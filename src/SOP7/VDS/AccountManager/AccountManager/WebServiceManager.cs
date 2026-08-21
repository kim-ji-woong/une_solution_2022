using System;
using System.Collections.Generic;
using System.Configuration;
using Newtonsoft.Json.Linq;
using System.Text;
using System.IO;
using System.Windows.Forms;

namespace AccountManager
{
    using Models;

    public class WebServiceManager
    {
        private string m_strWebServerUrl = "";

        public WebServiceManager()
        {
            m_strWebServerUrl = ConfigurationManager.AppSettings.Get("WebServerURL");
        }

        public List<AccountUser> ReadAccountUsers(List<Level> levels)
        {
            string strUrl = m_strWebServerUrl.EndsWith("/") ? m_strWebServerUrl + "api/Account/RequestData" : m_strWebServerUrl + "/api/Account/RequestData";

            JObject json = new JObject();
            json.Add("requestAccountUserList", true);

            string strJson = json.ToString();

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";
            string strErrorMessage = null;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                List<AccountUser> users = GetUserList(JObject.Parse(strResult), levels, out strErrorMessage);

                if (users != null)
                {
                    return users;
                }
                else
                {
                    MessageBox.Show(strErrorMessage);
                }
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return null;
        }

        public List<AccountUser> UpdateAccountUsers(List<AccountUser> users, List<Level> levels)
        {
            string strUrl = m_strWebServerUrl.EndsWith("/") ? m_strWebServerUrl + "api/Account/RequestData" : m_strWebServerUrl + "/api/Account/RequestData";

            JArray arr = new JArray();

            foreach (AccountUser user in users)
            {
                JObject obj = new JObject();

                if (user.ID > 0)
                {
                    obj.Add("id", user.ID);
                }

                obj.Add("userID", user.UserID);
                obj.Add("levelID", user.UserLevel.ID);
                obj.Add("nickName", user.NickName);

                if (user.Password != null && user.Password.Length > 0)
                {
                    obj.Add("password", user.Password);
                }

                arr.Add(obj);
            }

            JObject jData = new JObject();
            jData.Add("userDatas", arr);

            JObject json = new JObject();
            json.Add("requestUpdateAccountUsers", jData);

            string strJson = json.ToString();

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";
            string strErrorMessage = null;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                List<AccountUser> _users = GetUserList(JObject.Parse(strResult), levels, out strErrorMessage);

                if (_users != null)
                {
                    return _users;
                }
                else
                {
                    MessageBox.Show(strErrorMessage);
                }
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return null;
        }

        private List<AccountUser> GetUserList(JObject json, List<Level> levels, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (json == null)
                return null;

            JToken tokenUsers = json.GetValue("users");
            JToken tokenLevels = json.GetValue("levels");
            JToken tokenSuccess = json.GetValue("success");
            JToken tokenMessage = json.GetValue("message");

            if (tokenMessage != null)
                strErrorMessage = tokenMessage.Value<string>();

            bool success = tokenSuccess.Value<bool>();

            if (success == false)
                return null;

            List<AccountUser> users = new List<AccountUser>();
            JToken tokenUser = tokenUsers.First;

            while (tokenUser != null)
            {
                int id = tokenUser["id"].Value<int>();
                string strUserID = tokenUser["userID"].Value<string>();
                string strNickName = tokenUser["nickName"].Value<string>();
                string strSalt = tokenUser["salt"].Value<string>();

                JToken userLevel = tokenUser["userLevel"];

                if (userLevel != null)
                {
                    int levelID = userLevel["id"].Value<int>();
                    string strLevelName = userLevel["levelName"].Value<string>();

                    Level level = new Level();
                    level.ID = levelID;
                    level.LevelName = strLevelName;

                    AccountUser user = new AccountUser();

                    user.ID = id;
                    user.UserID = strUserID;
                    user.NickName = strNickName;
                    user.Salt = strSalt;
                    user.UserLevel = level;

                    users.Add(user);
                }

                tokenUser = tokenUser.Next;
            }

            JToken tokenLevel = tokenLevels.First;

            while (tokenLevel != null)
            {
                int levelID = tokenLevel["id"].Value<int>();
                string strLevelName = tokenLevel["levelName"].Value<string>();

                Level level = new Level();
                level.ID = levelID;
                level.LevelName = strLevelName;

                levels.Add(level);

                tokenLevel = tokenLevel.Next;
            }

            return users;
        }
    }
}
