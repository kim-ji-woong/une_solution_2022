using System;
using System.Configuration;

namespace WonikLPR
{
    /// <summary>
    /// App.config(appSettings) 값 읽기.
    /// </summary>
    public static class AppConfig
    {
        /// <summary>API URL (쿼리 스트링 제외)</summary>
        public static string ApiUrl
        {
            get { return GetString("LPR_API_URL", "http://192.168.1.100/setup/log/log.cgi"); }
        }

        /// <summary>HTTP Digest 인증 ID</summary>
        public static string UserId
        {
            get { return GetString("LPR_USER_ID", "admin"); }
        }

        /// <summary>HTTP Digest 인증 PW</summary>
        public static string UserPw
        {
            get { return GetString("LPR_USER_PW", "admin"); }
        }

        /// <summary>페이지당 로그 개수</summary>
        public static int PageSize
        {
            get { return GetInt("LPR_PAGE_SIZE", 100); }
        }

        /// <summary>조회할 페이지 인덱스</summary>
        public static int PageIndex
        {
            get { return GetInt("LPR_PAGE_INDEX", 1); }
        }

        /// <summary>API 호출 주기 (ms)</summary>
        public static int PollInterval
        {
            get { return GetInt("LPR_POLL_INTERVAL", 1000); }
        }

        /// <summary>HTTP 타임아웃 (ms)</summary>
        public static int Timeout
        {
            get { return GetInt("LPR_TIMEOUT", 5000); }
        }

        /// <summary>응답 저장 파일 경로 (미설정시 저장 안함)</summary>
        public static string ResponseFile
        {
            get { return GetString("LPR_RESPONSE_FILE", string.Empty); }
        }

        private static string GetString(string key, string defaultValue)
        {
            string value = ConfigurationManager.AppSettings[key];
            return string.IsNullOrEmpty(value) ? defaultValue : value;
        }

        private static int GetInt(string key, int defaultValue)
        {
            int value;
            if (int.TryParse(ConfigurationManager.AppSettings[key], out value) == false)
            {
                return defaultValue;
            }

            return value;
        }
    }
}
