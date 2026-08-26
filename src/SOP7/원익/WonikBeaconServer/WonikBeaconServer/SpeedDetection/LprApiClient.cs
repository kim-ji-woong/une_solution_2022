using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Xml.Linq;

namespace WonikBeaconServer.SpeedDetection
{
    /// <summary>LPR 이벤트 한 건.</summary>
    internal sealed class LprEvent
    {
        /// <summary>로그 고유번호</summary>
        public int Index;
        /// <summary>Date + Time 을 합친 장비 기준 시각</summary>
        public DateTime Time;
        /// <summary>CCTV 채널 번호</summary>
        public string Channel;
        /// <summary>인식된 번호판</summary>
        public string CarNo;
    }

    /// <summary>
    /// LPR 이벤트 검색 API 호출기.
    ///
    ///   1) api_search (page_summary=1) 로 전체 건수를 얻고
    ///   2) api_result (page_summary=0) 로 페이지를 돌며 로그를 모은다.
    ///
    /// 인증은 HTTP Digest(SHA-256) 이며 HttpDigest 로 직접 헤더를 만든다.
    /// </summary>
    internal sealed class LprApiClient
    {
        private readonly Config.Lpr m_config;
        private readonly Logger m_logger;
        private readonly HttpClient m_client;

        private readonly string m_strUserID;
        private readonly string m_strPassword;

        // 직전에 성공한 Authorization 헤더. 다음 요청에 미리 붙여 401 왕복을 줄인다.
        private string m_strLastAuthorization = null;
        private readonly object m_authLock = new object();

        public LprApiClient(Config.Lpr config, Logger logger, string strUserID, string strPassword)
        {
            m_config = config;
            m_logger = logger;
            m_strUserID = strUserID;
            m_strPassword = strPassword;

            var handler = new HttpClientHandler
            {
                AllowAutoRedirect = true,
                UseCookies = true,
                UseDefaultCredentials = false,
                AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
            };

            m_client = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(m_config.Timeout) };
            m_client.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "WonikBeaconServer/1.0");
            m_client.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "*/*");
        }

        /// <summary>
        /// 지정 구간의 LPR 이벤트를 모두 가져온다.
        /// 실패하면 null 을 돌려주고 strErrorMessage 에 사유를 담는다.
        /// (구간 안에 이벤트가 하나도 없으면 빈 리스트를 돌려준다. null 과 구분된다.)
        /// </summary>
        public List<LprEvent> GetEvents(DateTime dtFrom, DateTime dtTo, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                // --- 1단계 : 전체 건수 확인 ---
                string strSearchUrl = BuildUrl(m_config.ApiSearch, dtFrom, dtTo, null, 1);
                string strSearchXml = Get(strSearchUrl, out strErrorMessage);
                if (strSearchXml == null)
                    return null;

                int nTotalLog, nTotalPage;
                if (ParseSummary(strSearchXml, out nTotalLog, out nTotalPage) == false)
                {
                    strErrorMessage = "api_search 응답을 해석하지 못했습니다.";
                    return null;
                }

                if (nTotalLog <= 0)
                    return new List<LprEvent>();

                // TotalPage 를 그대로 믿지 않는다. 장비 문서 예시에서도 TotalLog/PageSize 와 어긋난다.
                // 둘 중 큰 값을 쓰되 MaxPage 로 자른다.
                int nPageSize = m_config.PageSize > 0 ? m_config.PageSize : 100;
                int nCalcPage = (nTotalLog + nPageSize - 1) / nPageSize;
                int nPageCount = Math.Max(nCalcPage, nTotalPage);

                if (nPageCount > m_config.MaxPage)
                {
                    m_logger.Write($"LprApiClient.GetEvents() : 페이지가 {nPageCount}개라 MaxPage({m_config.MaxPage})까지만 조회합니다. (TotalLog: {nTotalLog})");
                    nPageCount = m_config.MaxPage;
                }

                // --- 2단계 : 페이지 순회 ---
                List<LprEvent> events = new List<LprEvent>();
                HashSet<int> seen = new HashSet<int>();

                for (int nPage = 1; nPage <= nPageCount; nPage++)
                {
                    string strUrl = BuildUrl(m_config.ApiResult, dtFrom, dtTo, nPage, 0);
                    string strXml = Get(strUrl, out strErrorMessage);
                    if (strXml == null)
                        return null;

                    List<LprEvent> page = ParseLogItems(strXml);

                    // 빈 페이지가 나오면 더 볼 것이 없다. (TotalPage 가 과대여도 여기서 멈춘다)
                    if (page.Count == 0)
                        break;

                    int nAdded = 0;
                    foreach (LprEvent e in page)
                    {
                        if (seen.Add(e.Index))
                        {
                            events.Add(e);
                            nAdded++;
                        }
                    }

                    // 전부 이미 본 것이라면 같은 페이지를 반복해서 받고 있다는 뜻이다.
                    if (nAdded == 0)
                        break;
                }

                strErrorMessage = null;
                return events;
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return null;
            }
        }

        /// <summary>
        /// 설정에 든 URL 에 조회 구간과 page_index / page_summary 를 덧붙인다.
        /// 이미 같은 이름의 파라미터가 있으면 덮어쓴다.
        /// </summary>
        private string BuildUrl(string strBaseUrl, DateTime dtFrom, DateTime dtTo, int? nPageIndex, int nPageSummary)
        {
            int nSplit = strBaseUrl.IndexOf('?');
            string strPath = nSplit < 0 ? strBaseUrl : strBaseUrl.Substring(0, nSplit);
            string strQuery = nSplit < 0 ? "" : strBaseUrl.Substring(nSplit + 1);

            // 순서를 유지하면서 덮어쓰기 위해 리스트로 다룬다.
            List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();
            foreach (string part in strQuery.Split(new[] { '&' }, StringSplitOptions.RemoveEmptyEntries))
            {
                int nEq = part.IndexOf('=');
                if (nEq < 0)
                    parameters.Add(new KeyValuePair<string, string>(part, ""));
                else
                    parameters.Add(new KeyValuePair<string, string>(part.Substring(0, nEq), part.Substring(nEq + 1)));
            }

            Action<string, string> set = (key, value) =>
            {
                for (int i = 0; i < parameters.Count; i++)
                {
                    if (string.Equals(parameters[i].Key, key, StringComparison.OrdinalIgnoreCase))
                    {
                        parameters[i] = new KeyValuePair<string, string>(key, value);
                        return;
                    }
                }
                parameters.Add(new KeyValuePair<string, string>(key, value));
            };

            set("page_size", m_config.PageSize.ToString(CultureInfo.InvariantCulture));
            set("page_summary", nPageSummary.ToString(CultureInfo.InvariantCulture));

            if (nPageIndex.HasValue)
                set("page_index", nPageIndex.Value.ToString(CultureInfo.InvariantCulture));

            set("start_date", dtFrom.ToString("yyyyMMdd", CultureInfo.InvariantCulture));
            set("start_time", dtFrom.ToString("HHmmss", CultureInfo.InvariantCulture));
            set("end_date", dtTo.ToString("yyyyMMdd", CultureInfo.InvariantCulture));
            set("end_time", dtTo.ToString("HHmmss", CultureInfo.InvariantCulture));

            StringBuilder sb = new StringBuilder(strPath);
            sb.Append('?');
            for (int i = 0; i < parameters.Count; i++)
            {
                if (i > 0) sb.Append('&');
                sb.Append(parameters[i].Key).Append('=').Append(parameters[i].Value);
            }
            return sb.ToString();
        }

        /// <summary>GET 한 번. 401 이면 Digest 응답을 만들어 한 번 더 시도한다.</summary>
        private string Get(string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;
            Uri uri;

            if (Uri.TryCreate(strUrl, UriKind.Absolute, out uri) == false)
            {
                strErrorMessage = "URL 형식이 올바르지 않습니다: " + strUrl;
                return null;
            }

            try
            {
                // 직전에 통했던 Authorization 이 있으면 먼저 붙여 본다. (401 왕복 절약)
                string strPreset;
                lock (m_authLock) strPreset = m_strLastAuthorization;

                HttpResponseMessage response = Send(uri, strPreset);

                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    Uri challengedUri = response.RequestMessage?.RequestUri ?? uri;
                    string strAuth = BuildAuthorization(response, challengedUri);
                    response.Dispose();

                    if (strAuth == null)
                    {
                        strErrorMessage = "지원하는 인증 방식(Digest/Basic)이 응답에 없습니다.";
                        return null;
                    }

                    lock (m_authLock) m_strLastAuthorization = strAuth;
                    response = Send(challengedUri, strAuth);
                }

                using (response)
                {
                    if (response.IsSuccessStatusCode == false)
                    {
                        // 미리 붙였던 인증이 만료된 경우일 수 있으니 캐시를 버린다.
                        lock (m_authLock) m_strLastAuthorization = null;
                        strErrorMessage = $"HTTP {(int)response.StatusCode} {response.ReasonPhrase}";
                        return null;
                    }

                    byte[] body = response.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult();
                    return Encoding.UTF8.GetString(body);
                }
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return null;
            }
        }

        private HttpResponseMessage Send(Uri uri, string strAuthorization)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, uri);
            if (string.IsNullOrEmpty(strAuthorization) == false)
                request.Headers.TryAddWithoutValidation("Authorization", strAuthorization);

            return m_client.SendAsync(request, HttpCompletionOption.ResponseContentRead).GetAwaiter().GetResult();
        }

        /// <summary>401 응답의 챌린지 중 Digest 를 우선 선택해 Authorization 헤더 값을 만든다.</summary>
        private string BuildAuthorization(HttpResponseMessage response, Uri uri)
        {
            IEnumerable<string> challenges;
            if (response.Headers.TryGetValues("WWW-Authenticate", out challenges) == false)
                return null;

            var list = challenges.ToList();

            // Digest 를 먼저 시도하고, 없으면 Basic 등 다른 방식으로 넘어간다.
            foreach (bool wantDigest in new[] { true, false })
            {
                foreach (string raw in list)
                {
                    if (string.IsNullOrWhiteSpace(raw)) continue;

                    int sp = raw.IndexOf(' ');
                    string scheme = sp < 0 ? raw.Trim() : raw.Substring(0, sp).Trim();
                    string parameter = sp < 0 ? string.Empty : raw.Substring(sp + 1).Trim();

                    bool isDigest = string.Equals(scheme, "Digest", StringComparison.OrdinalIgnoreCase);
                    if (wantDigest != isDigest) continue;

                    string header = HttpDigest.CreateAuthorization(scheme, parameter, "GET", uri, m_strUserID, m_strPassword);
                    if (header != null) return header;
                }
            }
            return null;
        }

        /// <summary>api_search 응답에서 TotalLog / TotalPage 를 읽는다.</summary>
        private static bool ParseSummary(string strXml, out int nTotalLog, out int nTotalPage)
        {
            nTotalLog = 0;
            nTotalPage = 0;

            try
            {
                XElement root = XElement.Parse(strXml);
                XElement result = root.Name.LocalName == "Result" ? root : root.Descendants().FirstOrDefault(x => x.Name.LocalName == "Result");
                if (result == null)
                    return false;

                nTotalLog = GetInt(result, "TotalLog");
                nTotalPage = GetInt(result, "TotalPage");
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>api_result 응답에서 LogItem 들을 읽는다. 해석 못한 항목은 조용히 건너뛴다.</summary>
        private static List<LprEvent> ParseLogItems(string strXml)
        {
            List<LprEvent> list = new List<LprEvent>();

            XElement root;
            try
            {
                root = XElement.Parse(strXml);
            }
            catch (Exception)
            {
                return list;
            }

            foreach (XElement item in root.Descendants().Where(x => x.Name.LocalName == "LogItem"))
            {
                string strDate = GetString(item, "Date");
                string strTime = GetString(item, "Time");
                string strCarNo = GetString(item, "LPR");

                if (string.IsNullOrWhiteSpace(strDate) || string.IsNullOrWhiteSpace(strTime))
                    continue;
                if (string.IsNullOrWhiteSpace(strCarNo))
                    continue;

                DateTime dt;
                if (DateTime.TryParseExact(strDate.Trim() + " " + strTime.Trim(), "yyyy-MM-dd HH:mm:ss",
                        CultureInfo.InvariantCulture, DateTimeStyles.None, out dt) == false)
                    continue;

                list.Add(new LprEvent
                {
                    Index = GetInt(item, "Index"),
                    Time = dt,
                    Channel = GetString(item, "Channel"),
                    CarNo = strCarNo.Trim()
                });
            }

            return list;
        }

        private static string GetString(XElement parent, string strName)
        {
            XElement e = parent.Elements().FirstOrDefault(x => x.Name.LocalName == strName);
            return e == null ? null : e.Value;
        }

        private static int GetInt(XElement parent, string strName)
        {
            int n;
            string s = GetString(parent, strName);
            return int.TryParse(s?.Trim(), NumberStyles.Integer, CultureInfo.InvariantCulture, out n) ? n : 0;
        }
    }
}
