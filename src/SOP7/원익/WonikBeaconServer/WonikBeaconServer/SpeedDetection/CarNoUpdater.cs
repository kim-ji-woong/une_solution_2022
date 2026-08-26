using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Wonik.Model;

namespace WonikBeaconServer.SpeedDetection
{
    /// <summary>
    /// SdmsVehicleSpeedDetection 의 CarNo(차량번호)를 LPR 이벤트로 채우는 백그라운드 작업.
    ///
    /// 과속 감지 로직(DetectionProvider)은 CarNo 를 모른 채 행을 만든다. 이 클래스가 주기적으로
    /// CarNo 가 비어 있는 행을 찾아 LPR API 결과와 시각으로 짝지어 UPDATE 한다.
    ///
    /// [시각 보정]
    ///   LPR 장비 시계와 SOP 서버 시계가 어긋나 있고, 그 차이가 하루 1~2초씩 밀린다.
    ///   (2026-08-20 +15초 → 08-24 +9초 로 관측)
    ///   그래서 고정 상수를 쓰지 않고, 매 주기 실측 데이터로 보정값을 다시 추정한다.
    ///       DB 시각 ≒ API 시각 + offset
    ///   표본이 모자라면 직전에 학습한 값을, 그것도 없으면 설정의 DefaultOffset 을 쓴다.
    ///
    /// [센서별 분리]
    ///   센서마다 LPR 카메라와의 거리가 달라 offset 이 다르다. 센서별로 따로 추정한다.
    /// </summary>
    public class CarNoUpdater
    {
        /// <summary>CarNo 컬럼 길이. 넘치면 잘라 넣는다. (nvarchar(10))</summary>
        private const int CarNoMaxLength = 10;

        /// <summary>매칭에 실패한 행을 다시 시도하기까지의 최소 간격. 실패할수록 2배씩 늘린다.</summary>
        private static readonly TimeSpan RetryBackoffBase = TimeSpan.FromMinutes(10);
        private static readonly TimeSpan RetryBackoffMax = TimeSpan.FromHours(6);

        private readonly Wonik.IDAL.IDataManager m_wonikDataManager;
        private readonly Config.Lpr m_config;
        private readonly Logger m_logger;
        private LprApiClient m_client;

        private Thread m_thread;
        private volatile bool m_shutdown;

        /// <summary>센서별로 학습해 둔 보정값(초).</summary>
        private readonly Dictionary<int, int> m_dicOffsets = new Dictionary<int, int>();

        /// <summary>매칭 실패한 행의 다음 재시도 시각과 실패 횟수.</summary>
        private readonly Dictionary<int, KeyValuePair<DateTime, int>> m_dicRetry = new Dictionary<int, KeyValuePair<DateTime, int>>();

        public CarNoUpdater(Wonik.IDAL.IDataManager wonikDataManager)
        {
            m_wonikDataManager = wonikDataManager;
            m_config = Startup.ConfigManager.Lpr;
            m_logger = new Logger("CarNoUpdater");
        }

        public void Start()
        {
            if (m_wonikDataManager == null)
            {
                m_logger.Write("Start() : DataManager 가 없어 시작하지 않습니다.");
                return;
            }

            if (m_config.Enabled == false)
            {
                m_logger.Write("Start() : LPR:Enabled 가 false 라 시작하지 않습니다.");
                return;
            }

            if (m_config.IsValid == false)
            {
                m_logger.Write("Start() : LPR 설정(api_search / api_result / api_token)이 비어 있어 시작하지 않습니다.");
                return;
            }

            string strUserID, strPassword;
            if (m_config.TryGetCredential(out strUserID, out strPassword) == false)
            {
                m_logger.Write("Start() : api_token 복호화에 실패했습니다. \"ID PW\" 형태를 암호화한 값인지 확인하세요.");
                return;
            }

            m_client = new LprApiClient(m_config, m_logger, strUserID, strPassword);

            m_shutdown = false;
            m_thread = new Thread(WorkerThread) { IsBackground = true };
            m_thread.Start();

            m_logger.Write($"Start() : 시작 (주기 {m_config.PollInterval}초, 소급 {m_config.RetryHours}시간, 허용오차 ±{m_config.MatchTolerance}초)");
        }

        public void Stop()
        {
            m_shutdown = true;
        }

        private void WorkerThread()
        {
            // 서버 기동 직후에는 DB/센서가 자리를 잡을 시간을 준다.
            Thread.Sleep(10 * 1000);

            while (m_shutdown == false)
            {
                try
                {
                    RunOnce();
                }
                catch (Exception ex)
                {
                    m_logger.Write("WorkerThread() Exception : " + ex.Message);
                }

                for (int i = 0; i < m_config.PollInterval && m_shutdown == false; i++)
                    Thread.Sleep(1000);
            }

            m_logger.Write("WorkerThread() : 종료");
        }

        /// <summary>한 주기 분량의 작업. 예외는 호출자가 잡는다.</summary>
        private void RunOnce()
        {
            DateTime dtNow = DateTime.Now;

            // 감지 직후에는 LPR 로그가 아직 안 올라와 있을 수 있으므로 SettleSeconds 만큼 기다린 행부터 본다.
            DateTime dtTo = dtNow.AddSeconds(-m_config.SettleSeconds);
            DateTime dtFrom = dtNow.AddHours(-m_config.RetryHours);

            if (dtTo <= dtFrom)
                return;

            List<VehicleSpeedDetection> rows = SelectRows(dtFrom, dtTo);
            if (rows == null)
                return;

            // 소급 구간을 벗어난 행의 재시도 기록은 더 쓸 일이 없다.
            PurgeRetry(rows.Select(r => r.ID));

            // CarNo 나 DiffSeconds 중 하나라도 비어 있으면 갱신 대상. 재시도 대기 중인 것은 건너뛴다.
            //   CarNo 만 보면, 예전 버전이 CarNo 만 채워둔 행은 영영 DiffSeconds 가 비어 있게 된다.
            //   둘 다 확인해야 그런 행도 뒤늦게 메워진다.
            List<VehicleSpeedDetection> targets = rows
                .Where(r => (string.IsNullOrEmpty(r.CarNo) || r.DiffSeconds == null) && IsRetryDue(r.ID, dtNow))
                .ToList();

            if (targets.Count == 0)
                return;

            // API 조회 구간. DB시각 = API시각 + offset 이므로 API 쪽은 offset 만큼 앞이다.
            int nPad = m_config.OffsetScanRange + m_config.MatchTolerance + 5;
            DateTime dtApiFrom = targets.Min(r => r.DetectionTime).AddSeconds(-nPad);
            DateTime dtApiTo = targets.Max(r => r.DetectionTime).AddSeconds(nPad);

            string strErrorMessage;
            List<LprEvent> events = m_client.GetEvents(dtApiFrom, dtApiTo, out strErrorMessage);

            if (events == null)
            {
                m_logger.Write($"RunOnce() : LPR API 조회 실패 ({dtApiFrom:yyyy-MM-dd HH:mm:ss} ~ {dtApiTo:yyyy-MM-dd HH:mm:ss}) : {strErrorMessage}");
                return;
            }

            if (events.Count == 0)
            {
                m_logger.Write($"RunOnce() : 대상 {targets.Count}건이나 해당 구간 LPR 이벤트가 없습니다.");
                MarkFailed(targets.Select(r => r.ID), dtNow);
                return;
            }

            // 보정값 추정에는 이미 채워진 행까지 쓴다. 표본이 많을수록 추정이 안정적이다.
            Dictionary<int, int> dicOffsets = EstimateOffsets(rows, events);

            int nDeleted;
            int nUpdated = MatchAndUpdate(targets, events, dicOffsets, dtNow, rows, out nDeleted);

            m_logger.Write($"RunOnce() : 대상 {targets.Count}건, LPR 이벤트 {events.Count}건, 갱신 {nUpdated}건, 중복삭제 {nDeleted}건" +
                           $" (보정값 {string.Join(", ", dicOffsets.Select(p => $"{p.Key}:{p.Value:+0;-0;0}s"))})");
        }

        /// <summary>지정 구간의 과속 기록을 모두 읽는다. (CarNo 유무 무관)</summary>
        private List<VehicleSpeedDetection> SelectRows(DateTime dtFrom, DateTime dtTo)
        {
            string strErrorMessage;
            string strTable = VehicleSpeedDetection.TableName;
            bool isNullable;
            string strTimeField = VehicleSpeedDetection.GetFieldName(VehicleSpeedDetection.Fields.DetectionTime, out isNullable);

            string strConditions = string.Format("{0}.{1} >= '{2}' and {0}.{1} <= '{3}'",
                strTable, strTimeField,
                dtFrom.ToString("yyyy-MM-dd HH:mm:ss"),
                dtTo.ToString("yyyy-MM-dd HH:mm:ss"));

            List<VehicleSpeedDetection> rows =
                m_wonikDataManager.GetSelectManager().SelectVehicleSpeedDetections(null, strConditions, out strErrorMessage);

            if (rows == null)
            {
                m_logger.Write("SelectRows() : 조회 실패 : " + strErrorMessage);
                return null;
            }

            return rows;
        }

        /// <summary>
        /// 센서별로 보정값을 추정한다.
        /// -OffsetScanRange ~ +OffsetScanRange 를 훑어 "짝이 생기는 행 수"가 가장 많은 값을 고른다.
        /// 표본이 MinSamplesForScan 에 못 미치면 직전 학습값 또는 DefaultOffset 을 유지한다.
        /// </summary>
        private Dictionary<int, int> EstimateOffsets(List<VehicleSpeedDetection> rows, List<LprEvent> events)
        {
            Dictionary<int, int> result = new Dictionary<int, int>();
            double[] eventTicks = events.Select(e => e.Time.Ticks / (double)TimeSpan.TicksPerSecond).OrderBy(x => x).ToArray();
            int nTolerance = m_config.MatchTolerance;
            int nRange = m_config.OffsetScanRange;

            foreach (IGrouping<int, VehicleSpeedDetection> group in rows.GroupBy(r => r.SensorID))
            {
                int nSensorID = group.Key;
                double[] rowTicks = group.Select(r => r.DetectionTime.Ticks / (double)TimeSpan.TicksPerSecond).ToArray();

                int nBestOffset = 0, nBestCount = 0;

                for (int nOffset = -nRange; nOffset <= nRange; nOffset++)
                {
                    int nCount = 0;
                    foreach (double t in rowTicks)
                    {
                        // 행 시각에서 offset 을 빼면 기대되는 API 시각이다.
                        double target = t - nOffset;
                        if (HasNear(eventTicks, target, nTolerance))
                            nCount++;
                    }

                    // 같은 개수면 절대값이 작은(=덜 극단적인) 보정값을 택한다.
                    if (nCount > nBestCount || (nCount == nBestCount && nCount > 0 && Math.Abs(nOffset) < Math.Abs(nBestOffset)))
                    {
                        nBestCount = nCount;
                        nBestOffset = nOffset;
                    }
                }

                int nUse;
                if (nBestCount >= m_config.MinSamplesForScan)
                {
                    nUse = nBestOffset;
                    lock (m_dicOffsets) m_dicOffsets[nSensorID] = nUse;
                }
                else
                {
                    lock (m_dicOffsets)
                    {
                        if (m_dicOffsets.TryGetValue(nSensorID, out nUse) == false)
                            nUse = m_config.DefaultOffset;
                    }
                }

                result[nSensorID] = nUse;
            }

            return result;
        }

        /// <summary>정렬된 시각 배열에 target 기준 ±tolerance 안의 값이 있는지.</summary>
        private static bool HasNear(double[] sorted, double target, int nTolerance)
        {
            int lo = 0, hi = sorted.Length - 1;
            while (lo <= hi)
            {
                int mid = (lo + hi) / 2;
                double d = sorted[mid] - target;
                if (Math.Abs(d) <= nTolerance) return true;
                if (d < 0) lo = mid + 1; else hi = mid - 1;
            }
            return false;
        }

        /// <summary>
        /// 보정값을 적용해 행과 이벤트를 1:1 로 짝짓고 CarNo 를 갱신한다.
        /// 잔차 절대값이 작은 쌍부터 확정한다. 이벤트 하나가 두 행에 붙지 않도록 막는다.
        /// </summary>
        private int MatchAndUpdate(List<VehicleSpeedDetection> targets, List<LprEvent> events,
                                   Dictionary<int, int> dicOffsets, DateTime dtNow,
                                   List<VehicleSpeedDetection> allRows, out int nDeleted)
        {
            int nTolerance = m_config.MatchTolerance;
            int nWindow = m_config.DuplicateWindowSeconds;
            nDeleted = 0;

            // 이미 번호판이 붙은 행을 (센서 + 차량번호) 로 묶어둔다.
            //   감지 로직은 추적 상태를 하나만 들고 있어서, 레이더가 두 대를 번갈아 보고하면
            //   같은 차를 "새 차량"으로 다시 인식해 몇 초 사이에 여러 건을 기록한다.
            //   시각이 정확히 같지 않아도 같은 센서에서 같은 번호판이 짧은 시간 안에 다시 나오면
            //   한 대로 봐야 한다. 그래서 시각이 아니라 (센서 + 번호판) 으로 묶고
            //   DuplicateWindowSeconds(기본 60초) 안에 있는지로 판정한다.
            Dictionary<string, List<VehicleSpeedDetection>> existing =
                new Dictionary<string, List<VehicleSpeedDetection>>(StringComparer.Ordinal);

            foreach (VehicleSpeedDetection r in allRows)
            {
                if (string.IsNullOrEmpty(r.CarNo))
                    continue;

                string k = MakeKey(r.SensorID, r.CarNo);
                List<VehicleSpeedDetection> lst;
                if (existing.TryGetValue(k, out lst) == false)
                {
                    lst = new List<VehicleSpeedDetection>();
                    existing[k] = lst;
                }
                lst.Add(r);
            }

            var candidates = new List<Tuple<double, VehicleSpeedDetection, LprEvent>>();

            foreach (VehicleSpeedDetection row in targets)
            {
                int nOffset;
                if (dicOffsets.TryGetValue(row.SensorID, out nOffset) == false)
                    nOffset = m_config.DefaultOffset;

                foreach (LprEvent e in events)
                {
                    double dResidual = (row.DetectionTime - e.Time.AddSeconds(nOffset)).TotalSeconds;
                    if (Math.Abs(dResidual) <= nTolerance)
                        candidates.Add(Tuple.Create(Math.Abs(dResidual), row, e));
                }
            }

            candidates.Sort((a, b) => a.Item1.CompareTo(b.Item1));

            HashSet<int> usedRows = new HashSet<int>();
            HashSet<int> usedEvents = new HashSet<int>();
            int nUpdated = 0;

            foreach (var c in candidates)
            {
                VehicleSpeedDetection row = c.Item2;
                LprEvent e = c.Item3;

                if (usedRows.Contains(row.ID) || usedEvents.Contains(e.Index))
                    continue;

                string strCarNo = e.CarNo;
                if (strCarNo.Length > CarNoMaxLength)
                    strCarNo = strCarNo.Substring(0, CarNoMaxLength);

                // 보정값을 뺀 잔차가 아니라 "실제로 몇 초 차이가 났는지"를 그대로 남긴다.
                //   양수 : DB 시각이 LPR 보다 늦음   음수 : DB 시각이 더 빠름
                // LPR 장비 시계가 하루 1~2초씩 밀리므로, 이 값이 쌓이면 드리프트를 눈으로 추적할 수 있다.
                double dDiffSeconds = (row.DetectionTime - e.Time).TotalSeconds;

                string strErrorMessage;
                string strKey = MakeKey(row.SensorID, strCarNo);

                List<VehicleSpeedDetection> siblings;
                if (existing.TryGetValue(strKey, out siblings) == false)
                {
                    siblings = new List<VehicleSpeedDetection>();
                    existing[strKey] = siblings;
                }

                // 같은 센서 + 같은 번호판이면서 시각이 창(기본 60초) 안에 있는 기존 행
                List<VehicleSpeedDetection> near = siblings
                    .Where(x => Math.Abs((row.DetectionTime - x.DetectionTime).TotalSeconds) <= nWindow)
                    .ToList();

                if (near.Count > 0)
                {
                    // 한 대의 차량이 여러 건으로 기록된 것이다. 속도가 가장 큰 것 하나만 남긴다.
                    VehicleSpeedDetection best = near.OrderByDescending(x => x.Speed).First();

                    if (m_config.DeleteDuplicate == false)
                    {
                        // 삭제를 끄면 갱신도 하지 않는다. 중복 행에 번호판을 또 붙이지 않기 위해서다.
                        usedRows.Add(row.ID);
                        m_logger.Write($"MatchAndUpdate() : 중복 감지 ID {row.ID} ({strCarNo}) - DeleteDuplicate 가 false 라 건너뜀");
                        continue;
                    }

                    if (row.Speed > best.Speed)
                    {
                        // 새 행이 더 빠르다 → 새 행을 남기고 창 안의 기존 행들을 지운다.
                        if (m_wonikDataManager.GetUpdateManager().UpdateVehicleSpeedDetectionCarNo(row.ID, strCarNo, dDiffSeconds, out strErrorMessage) == false)
                        {
                            m_logger.Write($"MatchAndUpdate() : ID {row.ID} 갱신 실패 : {strErrorMessage}");
                            continue;
                        }

                        row.CarNo = strCarNo;
                        row.DiffSeconds = dDiffSeconds;

                        usedRows.Add(row.ID);
                        usedEvents.Add(e.Index);
                        nUpdated++;
                        lock (m_dicRetry) m_dicRetry.Remove(row.ID);

                        foreach (VehicleSpeedDetection old in near)
                        {
                            if (m_wonikDataManager.GetDeleteManager().DeleteVehicleSpeedDetection(old.ID, out strErrorMessage))
                            {
                                siblings.Remove(old);
                                nDeleted++;
                                lock (m_dicRetry) m_dicRetry.Remove(old.ID);

                                m_logger.Write($"MatchAndUpdate() : 중복 삭제(속도 낮음) ID {old.ID} {old.Speed}km/h " +
                                               $"← 유지 ID {row.ID} {row.Speed}km/h " +
                                               $"({old.DetectionTime:yyyy-MM-dd HH:mm:ss}, 센서 {old.SensorID}, {strCarNo})");
                            }
                            else
                            {
                                m_logger.Write($"MatchAndUpdate() : ID {old.ID} 중복 삭제 실패 : {strErrorMessage}");
                            }
                        }

                        siblings.Add(row);
                    }
                    else
                    {
                        // 기존 행이 같거나 더 빠르다 → 새 행을 버린다.
                        if (m_wonikDataManager.GetDeleteManager().DeleteVehicleSpeedDetection(row.ID, out strErrorMessage))
                        {
                            usedRows.Add(row.ID);
                            usedEvents.Add(e.Index);
                            nDeleted++;
                            lock (m_dicRetry) m_dicRetry.Remove(row.ID);

                            m_logger.Write($"MatchAndUpdate() : 중복 삭제 ID {row.ID} {row.Speed}km/h " +
                                           $"← 유지 ID {best.ID} {best.Speed}km/h " +
                                           $"({row.DetectionTime:yyyy-MM-dd HH:mm:ss}, 센서 {row.SensorID}, {strCarNo})");
                        }
                        else
                        {
                            m_logger.Write($"MatchAndUpdate() : ID {row.ID} 중복 삭제 실패 : {strErrorMessage}");
                        }
                    }

                    continue;
                }

                if (m_wonikDataManager.GetUpdateManager().UpdateVehicleSpeedDetectionCarNo(row.ID, strCarNo, dDiffSeconds, out strErrorMessage))
                {
                    row.CarNo = strCarNo;
                    row.DiffSeconds = dDiffSeconds;

                    usedRows.Add(row.ID);
                    usedEvents.Add(e.Index);
                    siblings.Add(row);
                    nUpdated++;

                    lock (m_dicRetry) m_dicRetry.Remove(row.ID);
                }
                else
                {
                    m_logger.Write($"MatchAndUpdate() : ID {row.ID} 갱신 실패 : {strErrorMessage}");
                }
            }

            // 이번에 짝을 못 찾은 행은 다음 시도를 미룬다. (매 주기 같은 구간을 다시 긁지 않도록)
            MarkFailed(targets.Where(r => usedRows.Contains(r.ID) == false).Select(r => r.ID), dtNow);

            return nUpdated;
        }

        /// <summary>
        /// 중복 판정 묶음 키. 같은 센서에서 같은 번호판이면 같은 묶음이다.
        /// 실제 중복 여부는 그 묶음 안에서 감지시각 차이(DuplicateWindowSeconds)로 판정한다.
        /// </summary>
        private static string MakeKey(int nSensorID, string strCarNo)
        {
            return nSensorID.ToString() + "|" + strCarNo;
        }

        private bool IsRetryDue(int nID, DateTime dtNow)
        {
            lock (m_dicRetry)
            {
                KeyValuePair<DateTime, int> entry;
                if (m_dicRetry.TryGetValue(nID, out entry) == false)
                    return true;

                return entry.Key <= dtNow;
            }
        }

        private void MarkFailed(IEnumerable<int> ids, DateTime dtNow)
        {
            lock (m_dicRetry)
            {
                foreach (int nID in ids)
                {
                    KeyValuePair<DateTime, int> entry;
                    int nFailCount = m_dicRetry.TryGetValue(nID, out entry) ? entry.Value + 1 : 1;

                    double dMinutes = RetryBackoffBase.TotalMinutes * Math.Pow(2, Math.Min(nFailCount - 1, 8));
                    if (dMinutes > RetryBackoffMax.TotalMinutes)
                        dMinutes = RetryBackoffMax.TotalMinutes;

                    m_dicRetry[nID] = new KeyValuePair<DateTime, int>(dtNow.AddMinutes(dMinutes), nFailCount);
                }
            }
        }

        /// <summary>
        /// 이번 조회 구간에 더 이상 나타나지 않는 행의 재시도 기록을 버린다.
        /// (구간을 벗어난 행은 다시 볼 일이 없으므로 계속 들고 있으면 메모리만 샌다)
        /// </summary>
        private void PurgeRetry(IEnumerable<int> currentIDs)
        {
            HashSet<int> alive = new HashSet<int>(currentIDs);

            lock (m_dicRetry)
            {
                List<int> remove = m_dicRetry.Keys.Where(id => alive.Contains(id) == false).ToList();
                foreach (int nID in remove)
                    m_dicRetry.Remove(nID);
            }
        }
    }
}
