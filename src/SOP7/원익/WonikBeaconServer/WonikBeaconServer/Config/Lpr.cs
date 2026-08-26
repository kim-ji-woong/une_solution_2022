using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WonikBeaconServer.Config
{
    /// <summary>
    /// LPR(번호판 인식) 이벤트 검색 API 설정.
    ///
    ///   api_search : 전체 건수/페이지 수를 얻는 URL (page_summary=1)
    ///   api_result : 실제 로그 데이터를 얻는 URL   (page_summary=0)
    ///   api_token  : "ID PW" 를 AES 로 암호화한 값. 복호화 후 공백으로 잘라 쓴다.
    ///
    /// URL 은 쿼리 스트링까지 포함한 형태로 두고, 조회 구간(start_date/time, end_date/time)과
    /// page_index 는 LprApiClient 가 덧붙이거나 덮어쓴다.
    /// </summary>
    public class Lpr : Config
    {
        private string m_strApiSearch = "";
        private string m_strApiResult = "";
        private string m_strApiToken = "";

        // --- 동작 파라미터 (없으면 아래 기본값) ---
        private int? m_nPollInterval = 300;      // CarNo 채우기 주기 (초)
        private int? m_nTimeout = 10;            // HTTP 타임아웃 (초)
        private int? m_nPageSize = 100;          // 페이지당 로그 개수
        private int? m_nMaxPage = 50;            // 한 번에 훑을 최대 페이지 수 (폭주 방지)
        private int? m_nSettleSeconds = 120;     // 감지 후 이 시간이 지난 행부터 매칭 시도 (LPR 등록 지연 여유)
        private int? m_nRetryHours = 48;         // 이 시간까지 거슬러 올라가 미채움 행을 재시도
        private int? m_nDefaultOffset = 12;      // 자동추정 실패 시 쓸 기본 보정값 (초). DB시각 = API시각 + offset
        private int? m_nOffsetScanRange = 60;    // 보정값 자동추정 스캔 범위 (±초)
        private int? m_nMatchTolerance = 3;      // 보정 후 허용 잔차 (초)
        private int? m_nMinSamplesForScan = 5;   // 자동추정에 필요한 최소 매칭 수
        private bool m_bEnabled = true;
        // 같은 차량번호 + 같은 감지시각인 행이 이미 있으면 그 행을 지울지 여부.
        // 감지 로직이 한 차량을 두 번 기록하는 경우를 정리한다. 끄면 갱신도 건너뛴다.
        private bool m_bDeleteDuplicate = true;
        // 같은 센서 + 같은 번호판이 이 시간(초) 안에 다시 나오면 한 대의 차량으로 본다.
        // 감지 로직이 한 차량을 몇 초 간격으로 여러 번 기록하는 경우가 있어 넉넉히 1분으로 둔다.
        // (실측: 같은 센서·번호판 쌍의 시간차는 최대 6초였고 그 이후 2분까지 한 쌍도 없었다)
        private int? m_nDuplicateWindowSeconds = 60;

        public string ApiSearch { get { return m_strApiSearch; } set { m_strApiSearch = value; } }
        public string ApiResult { get { return m_strApiResult; } set { m_strApiResult = value; } }
        public string ApiToken { get { return m_strApiToken; } set { m_strApiToken = value; } }

        public int PollInterval { get { return m_nPollInterval ?? 300; } }
        public int Timeout { get { return m_nTimeout ?? 10; } }
        public int PageSize { get { return m_nPageSize ?? 100; } }
        public int MaxPage { get { return m_nMaxPage ?? 50; } }
        public int SettleSeconds { get { return m_nSettleSeconds ?? 120; } }
        public int RetryHours { get { return m_nRetryHours ?? 48; } }
        public int DefaultOffset { get { return m_nDefaultOffset ?? 12; } }
        public int OffsetScanRange { get { return m_nOffsetScanRange ?? 60; } }
        public int MatchTolerance { get { return m_nMatchTolerance ?? 3; } }
        public int MinSamplesForScan { get { return m_nMinSamplesForScan ?? 5; } }
        public bool Enabled { get { return m_bEnabled; } }
        public bool DeleteDuplicate { get { return m_bDeleteDuplicate; } }
        public int DuplicateWindowSeconds { get { return m_nDuplicateWindowSeconds ?? 60; } }

        /// <summary>api_search / api_result / api_token 이 모두 채워져 있어야 동작한다.</summary>
        public bool IsValid
        {
            get
            {
                return m_bEnabled
                    && !string.IsNullOrWhiteSpace(m_strApiSearch)
                    && !string.IsNullOrWhiteSpace(m_strApiResult)
                    && !string.IsNullOrWhiteSpace(m_strApiToken);
            }
        }

        /// <summary>
        /// api_token 을 복호화해 ID / PW 로 나눈다. 평문은 "ID PW" 형태(공백 구분)다.
        /// 실패하면 false 를 돌려준다.
        /// </summary>
        public bool TryGetCredential(out string strUserID, out string strPassword)
        {
            strUserID = null;
            strPassword = null;

            if (string.IsNullOrWhiteSpace(m_strApiToken))
                return false;

            string strPlain;
            try
            {
                strPlain = WorkDBManager.DecryptString(m_strApiToken);
            }
            catch (Exception)
            {
                return false;
            }

            if (string.IsNullOrWhiteSpace(strPlain))
                return false;

            // 첫 공백에서만 자른다. 비밀번호에 공백이 들어 있어도 살아남는다.
            int nIndex = strPlain.IndexOf(' ');
            if (nIndex <= 0 || nIndex >= strPlain.Length - 1)
                return false;

            strUserID = strPlain.Substring(0, nIndex);
            strPassword = strPlain.Substring(nIndex + 1);
            return true;
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "LPR:api_search", ref m_strApiSearch);
            ReadString(config, "LPR:api_result", ref m_strApiResult);
            ReadString(config, "LPR:api_token", ref m_strApiToken);

            ReadInt(config, "LPR:PollInterval", ref m_nPollInterval);
            ReadInt(config, "LPR:Timeout", ref m_nTimeout);
            ReadInt(config, "LPR:PageSize", ref m_nPageSize);
            ReadInt(config, "LPR:MaxPage", ref m_nMaxPage);
            ReadInt(config, "LPR:SettleSeconds", ref m_nSettleSeconds);
            ReadInt(config, "LPR:RetryHours", ref m_nRetryHours);
            ReadInt(config, "LPR:DefaultOffset", ref m_nDefaultOffset);
            ReadInt(config, "LPR:OffsetScanRange", ref m_nOffsetScanRange);
            ReadInt(config, "LPR:MatchTolerance", ref m_nMatchTolerance);
            ReadInt(config, "LPR:MinSamplesForScan", ref m_nMinSamplesForScan);

            ReadBool(config, "LPR:Enabled", ref m_bEnabled);
            ReadBool(config, "LPR:DeleteDuplicate", ref m_bDeleteDuplicate);
            ReadInt(config, "LPR:DuplicateWindowSeconds", ref m_nDuplicateWindowSeconds);
        }
    }
}
