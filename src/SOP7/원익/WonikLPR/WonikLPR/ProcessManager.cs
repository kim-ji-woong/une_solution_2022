using System;
using System.Diagnostics;
using System.Net;
using System.Threading;

namespace WonikLPR
{
    /// <summary>
    /// LPR 이벤트 검색 API 를 주기적으로 호출하는 처리기.
    /// 프로세스가 종료될 때까지 설정된 주기(기본 1초)마다 API 를 호출하고 결과를 콘솔에 출력한다.
    /// </summary>
    public class ProcessManager
    {
        private Thread m_watchLPR = null;
        private ManualResetEvent m_stopEvent = null;
        private bool m_shutdownThread = true;

        private LprApiClient m_lprApiClient = null;
        private ResponseWriter m_responseWriter = null;

        private readonly int m_nPollInterval = AppConfig.PollInterval;
        private readonly int m_nPageSize = AppConfig.PageSize;
        private readonly int m_nPageIndex = AppConfig.PageIndex;

        public ProcessManager()
        {
            Init();
        }

        private void Init()
        {
            ServicePointManager.SecurityProtocol =
                SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            ServicePointManager.Expect100Continue = false;

            m_responseWriter = new ResponseWriter(AppConfig.ResponseFile);

            m_lprApiClient = new LprApiClient(
                AppConfig.ApiUrl,
                AppConfig.UserId,
                AppConfig.UserPw,
                AppConfig.Timeout,
                m_responseWriter);
        }

        public void Start()
        {
            if (m_shutdownThread == false)
            {
                return;
            }

            m_shutdownThread = false;
            m_stopEvent = new ManualResetEvent(false);

            Logger.Info("WonikLPR 시작.");
            Logger.Info(string.Format("API URL = {0}", AppConfig.ApiUrl));
            Logger.Info(string.Format("호출 주기 = {0}ms, page_size = {1}, page_index = {2}",
                m_nPollInterval, m_nPageSize, m_nPageIndex));
            Logger.Info(m_responseWriter.Enabled
                ? string.Format("응답 저장 파일 = {0}", m_responseWriter.FilePath)
                : "응답 저장 안함 (LPR_RESPONSE_FILE 미설정)");

            m_watchLPR = new Thread(() => WatchLPRThread());
            m_watchLPR.IsBackground = true;
            m_watchLPR.Start();
        }

        public void Stop()
        {
            if (m_shutdownThread == true)
            {
                return;
            }

            m_shutdownThread = true;

            if (m_stopEvent != null)
            {
                m_stopEvent.Set();
            }

            if (m_watchLPR != null)
            {
                m_watchLPR.Join(3000);
                m_watchLPR = null;
            }

            if (m_stopEvent != null)
            {
                m_stopEvent.Dispose();
                m_stopEvent = null;
            }

            Logger.Info("WonikLPR 종료.");
        }

        /// <summary>
        /// 주기적으로 API 를 호출하는 쓰레드.
        /// </summary>
        private void WatchLPRThread()
        {
            Stopwatch stopwatch = new Stopwatch();

            while (m_shutdownThread == false)
            {
                stopwatch.Restart();

                try
                {
                    PollOnce();
                }
                catch (Exception ex)
                {
                    Logger.Error("LPR API 호출 실패", ex);
                }

                stopwatch.Stop();

                // 호출에 걸린 시간을 제외하고 대기해 주기를 유지한다.
                int wait = m_nPollInterval - (int)stopwatch.ElapsedMilliseconds;
                if (wait < 0)
                {
                    wait = 0;
                }

                if (m_stopEvent.WaitOne(wait) == true)
                {
                    break;
                }
            }
        }

        /// <summary>
        /// 1회 호출 : 페이지 검색 API 로 전체 개수를 얻고, 데이터 검색 API 로 해당 페이지 로그를 얻는다.
        /// (문서상 로그 조회는 페이지 검색 → 데이터 검색 2단계 구성)
        /// </summary>
        private void PollOnce()
        {
            LprSearchFilter filter = null;   // 전체 검색

            LprPageSummary summary = m_lprApiClient.GetPageSummary(m_nPageSize, filter);
            Logger.Info(string.Format("[페이지 검색] {0}", summary));

            if (summary.TotalPage <= 0)
            {
                Logger.Info("[데이터 검색] 조회할 로그가 없습니다.");
                return;
            }

            int pageIndex = m_nPageIndex;
            if (pageIndex > summary.TotalPage)
            {
                pageIndex = summary.TotalPage;
            }

            LprLogPage page = m_lprApiClient.GetLogPage(m_nPageSize, pageIndex, filter);
            Logger.Info(string.Format("[데이터 검색] page_index={0}, 수신 {1}건",
                page.PageIndex, page.Items.Count));

            foreach (LprLogItem item in page.Items)
            {
                Logger.Info(string.Format("    {0}", item));
            }
        }
    }
}
