using System;
using System.Globalization;
using System.IO;
using System.Net;
using System.Text;
using System.Xml.Linq;

namespace WonikLPR
{
    /// <summary>
    /// LPR 이벤트 검색 API 클라이언트.
    /// - 페이지 검색 API (page_summary=1) : 전체 로그/페이지 개수 조회
    /// - 데이터 검색 API (page_summary=0) : 페이지 단위 로그 조회
    /// 응답은 XML, 인증은 HTTP Digest(SHA-256).
    /// </summary>
    public class LprApiClient
    {
        /// <summary>LPR 검색 고정값 (문서 기준)</summary>
        private const string METHOD = "get";
        private const string TYPE = "lpr";
        private const int CATEGORY = 64;

        private readonly string m_apiUrl;
        private readonly int m_timeout;
        private readonly DigestAuthenticator m_authenticator;
        private readonly ResponseWriter m_responseWriter;

        public LprApiClient(string apiUrl, string userId, string userPw, int timeout)
            : this(apiUrl, userId, userPw, timeout, null)
        {
        }

        /// <param name="responseWriter">응답 원문 저장기. null 이면 저장하지 않는다.</param>
        public LprApiClient(string apiUrl, string userId, string userPw, int timeout,
            ResponseWriter responseWriter)
        {
            m_apiUrl = apiUrl;
            m_timeout = timeout;
            m_authenticator = new DigestAuthenticator(userId, userPw);
            m_responseWriter = responseWriter;
        }

        /// <summary>
        /// 페이지 검색 API. 전체 로그 개수 / 전체 페이지 개수를 조회한다.
        /// </summary>
        public LprPageSummary GetPageSummary(int pageSize, LprSearchFilter filter)
        {
            string url = BuildUrl(pageSize, 1, null, filter);
            string xml = Request(url);

            return ParsePageSummary(xml);
        }

        /// <summary>
        /// 데이터 검색 API. 해당 페이지의 로그 목록을 조회한다.
        /// </summary>
        public LprLogPage GetLogPage(int pageSize, int pageIndex, LprSearchFilter filter)
        {
            string url = BuildUrl(pageSize, 0, pageIndex, filter);
            string xml = Request(url);

            return ParseLogPage(xml, pageIndex);
        }

        /// <summary>
        /// 요청 URL 생성. pageSummary 1 이면 페이지 검색, 0 이면 데이터 검색(page_index 필수).
        /// </summary>
        private string BuildUrl(int pageSize, int pageSummary, int? pageIndex, LprSearchFilter filter)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(m_apiUrl);
            sb.Append(m_apiUrl.IndexOf('?') >= 0 ? "&" : "?");

            sb.AppendFormat("method={0}", METHOD);
            sb.AppendFormat("&type={0}", TYPE);
            sb.AppendFormat("&category={0}", CATEGORY);
            sb.AppendFormat("&page_size={0}", pageSize);

            if (pageIndex.HasValue)
            {
                sb.AppendFormat("&page_index={0}", pageIndex.Value);
            }

            sb.AppendFormat("&page_summary={0}", pageSummary);

            if (filter != null)
            {
                // 값이 없으면 전달하지 않는다. (전체 검색)
                AppendOptional(sb, "search_text", filter.SearchText);
                AppendOptional(sb, "start_date", filter.StartDate);
                AppendOptional(sb, "start_time", filter.StartTime);
                AppendOptional(sb, "end_date", filter.EndDate);
                AppendOptional(sb, "end_time", filter.EndTime);
            }

            return sb.ToString();
        }

        private static void AppendOptional(StringBuilder sb, string key, string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return;
            }

            sb.AppendFormat("&{0}={1}", key, Uri.EscapeDataString(value));
        }

        /// <summary>
        /// HTTP GET. 401 수신시 Digest challenge 를 갱신하고 1회 재시도한다.
        /// </summary>
        private string Request(string url)
        {
            Uri uri = new Uri(url);
            string response;

            try
            {
                response = Send(uri);
            }
            catch (WebException ex)
            {
                string[] challenge = GetAuthenticateHeaders(ex);
                if (challenge == null)
                {
                    throw;
                }

                // 보유중인 nonce 가 만료됐거나 최초 요청인 경우
                m_authenticator.Reset();
                if (m_authenticator.SetChallenge(challenge) == false)
                {
                    throw new WebException("Digest challenge 파싱 실패.", ex);
                }

                response = Send(uri);
            }

            // 파싱 전에 원문을 남긴다. (파싱 실패시에도 응답을 확인할 수 있도록)
            if (m_responseWriter != null)
            {
                m_responseWriter.Write(url, response);
            }

            return response;
        }

        private string Send(Uri uri)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.Method = "GET";
            request.Timeout = m_timeout;
            request.ReadWriteTimeout = m_timeout;
            request.AllowAutoRedirect = false;
            request.UserAgent = "WonikLPR";

            string authorization = m_authenticator.BuildAuthorizationHeader(request.Method, uri.PathAndQuery);
            if (authorization != null)
            {
                request.Headers[HttpRequestHeader.Authorization] = authorization;
            }

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                return ReadBody(response);
            }
        }

        private static string ReadBody(HttpWebResponse response)
        {
            using (Stream stream = response.GetResponseStream())
            {
                if (stream == null)
                {
                    return string.Empty;
                }

                using (StreamReader reader = new StreamReader(stream, Encoding.UTF8, true))
                {
                    return reader.ReadToEnd();
                }
            }
        }

        /// <summary>
        /// 401 응답에서 WWW-Authenticate 헤더 추출. 401 이 아니면 null.
        /// </summary>
        private static string[] GetAuthenticateHeaders(WebException ex)
        {
            if (ex.Status != WebExceptionStatus.ProtocolError)
            {
                return null;
            }

            HttpWebResponse response = ex.Response as HttpWebResponse;
            if (response == null || response.StatusCode != HttpStatusCode.Unauthorized)
            {
                return null;
            }

            using (response)
            {
                return response.Headers.GetValues("WWW-Authenticate");
            }
        }

        private static LprPageSummary ParsePageSummary(string xml)
        {
            XElement result = FindFirst(xml, "Result");
            if (result == null)
            {
                throw new FormatException("페이지 검색 응답에 Result 항목이 없습니다. 응답=" + Shorten(xml));
            }

            return new LprPageSummary
            {
                TotalLog = ToInt(GetChildValue(result, "TotalLog")),
                PageSize = ToInt(GetChildValue(result, "PageSize")),
                TotalPage = ToInt(GetChildValue(result, "TotalPage")),
            };
        }

        private static LprLogPage ParseLogPage(string xml, int pageIndex)
        {
            XDocument document = Parse(xml);

            LprLogPage page = new LprLogPage();
            page.PageIndex = pageIndex;

            foreach (XElement element in document.Descendants("LogItem"))
            {
                page.Items.Add(new LprLogItem
                {
                    Index = ToLong(GetChildValue(element, "Index")),
                    Date = GetChildValue(element, "Date"),
                    Time = GetChildValue(element, "Time"),
                    Channel = GetChildValue(element, "Channel"),
                    Type = GetChildValue(element, "Type"),
                    Type2 = GetChildValue(element, "Type2"),
                    LPR = GetChildValue(element, "LPR"),
                    LineNo = GetChildValue(element, "LineNo"),
                    Error = GetChildValue(element, "Error"),
                });
            }

            return page;
        }

        private static XElement FindFirst(string xml, string name)
        {
            XDocument document = Parse(xml);

            foreach (XElement element in document.Descendants(name))
            {
                return element;
            }

            return null;
        }

        private static XDocument Parse(string xml)
        {
            if (string.IsNullOrEmpty(xml))
            {
                throw new FormatException("응답이 비어 있습니다.");
            }

            try
            {
                return XDocument.Parse(xml);
            }
            catch (Exception ex)
            {
                throw new FormatException("XML 파싱 실패. 응답=" + Shorten(xml), ex);
            }
        }

        private static string GetChildValue(XElement parent, string name)
        {
            XElement child = parent.Element(name);
            return child == null ? string.Empty : child.Value.Trim();
        }

        private static int ToInt(string value)
        {
            int result;
            int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out result);

            return result;
        }

        private static long ToLong(string value)
        {
            long result;
            long.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out result);

            return result;
        }

        private static string Shorten(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            value = value.Replace("\r", string.Empty).Replace("\n", string.Empty);

            return value.Length <= 200 ? value : value.Substring(0, 200) + "...";
        }
    }

    /// <summary>
    /// 검색 옵션 파라미터. 값이 없으면 전달하지 않으며 전체 검색이 된다.
    /// </summary>
    public class LprSearchFilter
    {
        /// <summary>번호판 숫자 4자리</summary>
        public string SearchText { get; set; }

        /// <summary>검색 시작 날짜 (YYYYMMDD)</summary>
        public string StartDate { get; set; }

        /// <summary>검색 시작 시간 (hhmmss)</summary>
        public string StartTime { get; set; }

        /// <summary>검색 끝 날짜 (YYYYMMDD)</summary>
        public string EndDate { get; set; }

        /// <summary>검색 끝 시간 (hhmmss)</summary>
        public string EndTime { get; set; }
    }
}
