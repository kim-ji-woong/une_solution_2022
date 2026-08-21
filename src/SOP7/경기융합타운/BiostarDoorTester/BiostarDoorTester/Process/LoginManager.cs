using System;
using System.Net;
using System.Text;
using Newtonsoft.Json.Linq;
using System.IO;

namespace BiostarDoorTester.Process
{
    class LoginManager
    {
        private const string LoginUrl = "api/login";
        private const string LogoutUrl = "api/logout";

        public const string SessionKey = "bs-session-id";

        private string m_strSessionID = null;

        private string m_strHeader = "";
        private string m_strBody = "";

        public string Header
        {
            get { return m_strHeader; }
        }

        public string Body
        {
            get { return m_strBody; }
        }

        public string SessionID
        {
            get { return m_strSessionID; }
        }

        public bool Login(string strServerIP, out string strErrorMessage)
        {
            if (strServerIP.Length == 0)
            {
                strErrorMessage = "서버 IP가 지정되지 않았습니다.";
                return false;
            }

            m_strSessionID = null;
            string strUrl = strServerIP.EndsWith("/") ? strServerIP + LoginUrl : strServerIP + "/" + LoginUrl;
            return Login(strUrl, ConfigManager.GetID(), ConfigManager.GetPW(), out strErrorMessage);
        }

        public bool Logout(string strServerIP, out string strErrorMessage)
        {
            if (m_strSessionID == null)
            {
                strErrorMessage = "이미 로그아웃 상태입니다.";
                return false;
            }

            strErrorMessage = null;
            string strUrl = strServerIP.EndsWith("/") ? strServerIP + LogoutUrl : strServerIP + "/" + LogoutUrl;
            FormMain.Instance.WriteLog("Logout : " + strUrl + ", SessionKey : " + m_strSessionID);

            JObject json = new JObject();
            string strJson = json.ToString();

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            FormMain.Instance.WriteLog("len : " + len);

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;
            request.Headers.Add(SessionKey, m_strSessionID);

            try
            {
                FormMain.Instance.WriteLog("try writing");
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();
                FormMain.Instance.WriteLog("close writing");

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                FormMain.Instance.WriteLog("status code : " + wRes.StatusCode);

                if (wRes.StatusCode != HttpStatusCode.OK)
                {
                    strErrorMessage = "Error Code : " + wRes.StatusDescription;
                    FormMain.Instance.WriteLog("Error Code : " + wRes.StatusDescription);
                    return false;
                }

                m_strHeader = "";
                m_strBody = strResult;
                return true;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
                FormMain.Instance.WriteLog("Exception : " + ex.Message);
            }

            return false;
        }

        private bool Login(string strUrl, string strID, string strPW, out string strErrorMessage)
        {
            FormMain.Instance.WriteLog("Login");
            JObject jsonData = new JObject();

            jsonData.Add("login_id", strID);
            jsonData.Add("password", strPW);

            JObject json = new JObject();
            json.Add("User", jsonData);

            string strJson = json.ToString();

            strErrorMessage = null;
            /*if (Login2(strUrl, strJson, out strErrorMessage) == false)
                return false;*/

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            FormMain.Instance.WriteLog(strUrl);

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                FormMain.Instance.WriteLog("Request : " + strJson);

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();
                FormMain.Instance.WriteLog("GetResponse");

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                FormMain.Instance.WriteLog("StatusCode : " + wRes.StatusCode);

                if (wRes.StatusCode != HttpStatusCode.OK)
                {
                    strErrorMessage = "Error Code : " + wRes.StatusDescription;
                    return false;
                }

                m_strBody = strResult;

                string strSessionID = wRes.Headers[SessionKey];
                m_strHeader = strSessionID;

                if (strSessionID == null)
                    m_strBody += "\r\nBody SessionID is null";
                else
                {
                    m_strBody += "\r\nBody SessionID : " + strSessionID;
                    m_strSessionID = strSessionID;
                }

                FormMain.Instance.WriteLog("Login Success");
                return true;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
                FormMain.Instance.WriteLog("ErrorMessage : " + strErrorMessage);
            }

            return false;
        }

        private bool Login2(string strUrl, string strJson, out string strErrorMessage)
        {
            strErrorMessage = null;

            try
            {
                var webRequest = new System.Net.Http.HttpRequestMessage(System.Net.Http.HttpMethod.Post, strUrl);
                webRequest.Content = new System.Net.Http.StringContent(strJson, Encoding.UTF8, "application/json");

                System.Net.Http.HttpClient httpClient = new System.Net.Http.HttpClient();
                var result = httpClient.Send(webRequest);
                string strResult = result.ToString();

                m_strHeader = strResult;

                string strSessionID = GetSessionID(strResult, SessionKey);

                if (strSessionID == null)
                    m_strHeader += "\r\nHeader SessionID is null";
                else
                {
                    m_strHeader += "\r\nHeader SessionID : " + strSessionID;
                    m_strSessionID = strSessionID;
                }

                return true;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return false;
        }

        private string GetSessionID(string strResult, string strTarget)
        {
            int index = strResult.IndexOf('{');

            if (index <= 0)
                return null;

            string strData = strResult.Substring(0, index).Trim();
            string[] tokens = strData.Split(',');

            strTarget = strTarget.ToLower();

            foreach (string strToken in tokens)
            {
                string[] tokens2 = strToken.Split(':');

                if (tokens2.Length != 2)
                    continue;

                string strName = tokens2[0].Trim().ToLower();

                if (strName == strTarget)
                    return tokens2[1].Trim();
            }

            return null;
        }

        /*private bool GetResult(string strResult, out string strSessionID, out string strErrorMessage)
        {
            JObject json = JObject.Parse(strResult);

            strErrorMessage = null;
            strSessionID = null;

            if (json == null)
                return false;

            JToken tokenStatus = json.GetValue("Status");
            JToken tokenSessionID = json.GetValue(SessionKey);

            if (tokenStatus == null)
            {
                strErrorMessage = "Status 값이 null입니다.";
                return false;
            }

            if (tokenSessionID == null)
            {
                strErrorMessage = "Session ID 값이 null입니다.";
                return false;
            }

            string strStatus = tokenStatus.Value<string>().ToLower();
            strSessionID = tokenSessionID.Value<string>();

            if (strStatus.Contains("200") == false)
            {
                strErrorMessage = "Error Code : " + strStatus;
                return false;
            }

            return true;
        }*/
    }
}
