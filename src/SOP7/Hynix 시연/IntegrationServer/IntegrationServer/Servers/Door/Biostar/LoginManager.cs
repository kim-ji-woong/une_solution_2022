using System;
using System.Net;
using System.Text;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Collections.Generic;

namespace IntegrationServer.Servers.Door.Biostar
{
    using Datas;

    class LoginManager
    {
        private const string LoginUrl = "api/login";
        private const string LogoutUrl = "api/logout";

        public const string SessionKey = "bs-session-id";

        private string m_strSessionID = null;
        private string m_strID = "admin";
        private string m_strPW = "admin1234[]";

        public string SessionID
        {
            get { return m_strSessionID; }
        }

        public LoginManager(Dictionary<ServerProperty, object> serverProperties)
        {
            SetDatas(serverProperties);
        }

        private void SetDatas(Dictionary<ServerProperty, object> serverProperties)
        {
            if (serverProperties == null)
                return;

            foreach (KeyValuePair<ServerProperty, object> pair in serverProperties)
            {
                if (pair.Key == ServerProperty.Biostar_id)
                {
                    if (pair.Value != null)
                    {
                        m_strID = pair.Value.ToString();
                    }
                }
                else if (pair.Key == ServerProperty.Biostar_pw)
                {
                    if (pair.Value != null)
                        m_strPW = pair.Value.ToString();
                }
            }
        }

        public bool Login(string strServerIP, out string strErrorMessage)
        {
            if (strServerIP.Length == 0)
            {
                strErrorMessage = "서버 IP가 지정되지 않았습니다.";
                return false;
            }

            if (m_strID == null || m_strID.Length == 0)
            {
                strErrorMessage = "api 접속 ID가 지정되지 않았습니다.";
                return false;
            }

            if (m_strPW == null || m_strPW.Length == 0)
            {
                strErrorMessage = "api 접속 PW가 지정되지 않았습니다.";
                return false;
            }

            m_strSessionID = null;
            string strUrl = strServerIP.EndsWith("/") ? strServerIP + LoginUrl : strServerIP + "/" + LoginUrl;
            return Login(strUrl, m_strID, m_strPW, out strErrorMessage);
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

            JObject json = new JObject();
            string strJson = json.ToString();

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;
            request.Headers.Add(SessionKey, m_strSessionID);

            m_strSessionID = null;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                if (wRes.StatusCode != HttpStatusCode.OK)
                {
                    strErrorMessage = "Error Code : " + wRes.StatusDescription;
                    return false;
                }

                return true;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return false;
        }

        private bool Login(string strUrl, string strID, string strPW, out string strErrorMessage)
        {
            JObject jsonData = new JObject();

            jsonData.Add("login_id", strID);
            jsonData.Add("password", strPW);

            JObject json = new JObject();
            json.Add("User", jsonData);

            string strJson = json.ToString();

            strErrorMessage = null;

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                if (wRes.StatusCode != HttpStatusCode.OK)
                {
                    strErrorMessage = "Error Code : " + wRes.StatusDescription;
                    return false;
                }

                string strSessionID = wRes.Headers[SessionKey];
                m_strSessionID = strSessionID;
                return true;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return false;
        }
    }
}
