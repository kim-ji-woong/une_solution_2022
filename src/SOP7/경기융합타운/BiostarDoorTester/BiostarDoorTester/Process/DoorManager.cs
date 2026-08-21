using System;
using System.Net;
using System.Text;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Collections.Generic;

namespace BiostarDoorTester.Process
{
    using Data;

    class DoorManager
    {
        private const string SearchUrl = "api/v2/doors/search";
        private const string StatusUrl = "api/doors/status";

        public static string RequestAllDoors(string strServerIP, string strSessionID, out string strErrorMessage)
        {
            string strUrl = strServerIP.EndsWith("/") ? strServerIP + SearchUrl : strServerIP + "/" + SearchUrl;
            return SearchAll(strUrl, strSessionID, out strErrorMessage);
        }

        public static string RequestStatus(string strServerIP, string strSessionID, out string strErrorMessage)
        {
            string strUrl = strServerIP.EndsWith("/") ? strServerIP + StatusUrl : strServerIP + "/" + StatusUrl;
            return ReadStatus(strUrl, strSessionID, out strErrorMessage);
        }

        private static string ReadStatus(string strUrl, string strSessionID, out string strErrorMessage)
        {
            if (strSessionID == null)
            {
                strErrorMessage = "로그아웃 상태입니다.";
                return null;
            }

            strErrorMessage = null;

            JObject json = new JObject();
            json.Add("monitoring_permission", true);

            string strJson = json.ToString();

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;
            request.Headers.Add(LoginManager.SessionKey, strSessionID);

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
                    return null;
                }

                return strResult;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return null;
        }

        public static List<Door> GetStatus(string strResult, out string strErrorMessage)
        {
            strErrorMessage = null;
            JObject json = JObject.Parse(strResult);

            if (json == null)
                return null;

            JToken tokenDoorStatusCollection = null;

            foreach (JToken child in json.Children())
            {
                string strPath = child.Path;

                if (strPath.ToLower() == "doorstatuscollection")
                {
                    tokenDoorStatusCollection = json[strPath];
                    break;
                }
            }

            if (tokenDoorStatusCollection == null)
            {
                strErrorMessage = "DoorStatusCollection 값이 null입니다.";
                return null;
            }

            JToken tokenRows = null;

            foreach (JToken child in tokenDoorStatusCollection.Children())
            {
                string strPath = child.Path;
                int index = strPath.LastIndexOf('.');

                if (index < 0)
                    continue;

                strPath = strPath.Substring(index + 1);

                if (strPath.ToLower() == "rows")
                {
                    tokenRows = tokenDoorStatusCollection[strPath];
                    break;
                }
            }

            if (tokenRows == null)
            {
                strErrorMessage = "DoorStatusCollection.rows 값이 null입니다.";
                return null;
            }

            List<Door> doors = new List<Door>();
            JArray arrRows = (JArray)tokenRows;

            foreach (var row in arrRows)
            {
                JToken tokenDoorID = row["door_id"];
                JToken tokenOpened = row["opened"];
                JToken tokenStatus = row["status"];

                if (tokenDoorID == null)
                {
                    strErrorMessage = "DoorStatusCollection.rows.door_id 값이 null입니다.";
                    return null;
                }

                if (tokenOpened == null)
                {
                    strErrorMessage = "DoorStatusCollection.rows.opened 값이 null입니다.";
                    return null;
                }

                if (tokenStatus == null)
                {
                    strErrorMessage = "DoorStatusCollection.rows.status 값이 null입니다.";
                    return null;
                }

                JToken tokenID = tokenDoorID["id"];

                string strID = tokenID.Value<string>();
                string strOpend = tokenOpened.Value<string>();
                string strStatus = tokenStatus.Value<string>();

                int id, status;
                bool isOpened;

                if (int.TryParse(strID, out id) && GetBoolean(strOpend, out isOpened) && int.TryParse(strStatus, out status))
                {
                    Door door = new Door();
                    door.ID = id;
                    door.IsOpen = isOpened;
                    door.Status = status;

                    doors.Add(door);
                }
            }

            return doors;
        }

        private static bool GetBoolean(string str, out bool isTrue)
        {
            str = str.ToLower();

            if (str == "true")
            {
                isTrue = true;
                return true;
            }
            else if (str == "false")
            {
                isTrue = false;
                return true;
            }

            isTrue = false;
            return false;
        }

        private static string SearchAll(string strUrl, string strSessionID, out string strErrorMessage)
        {
            if (strSessionID == null)
            {
                strErrorMessage = "로그아웃 상태입니다.";
                return null;
            }

            FormMain.Instance.WriteLog("SearchAll : " + strUrl + ", SessionID : " + strSessionID);
            JObject json = new JObject();

            json.Add("limit", 1000);
            json.Add("order_by", "door_group_id.name:false");

            string strJson = json.ToString();

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            strErrorMessage = null;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;
            request.Headers.Add(LoginManager.SessionKey, strSessionID);

            try
            {
                FormMain.Instance.WriteLog("try Writing");

                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                FormMain.Instance.WriteLog("close Writing");

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                FormMain.Instance.WriteLog("getResponse");

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                FormMain.Instance.WriteLog("Response : " + strResult);
                FormMain.Instance.WriteLog("StatusCode : " + wRes.StatusCode);

                if (wRes.StatusCode != HttpStatusCode.OK)
                {
                    strErrorMessage = "Error Code : " + wRes.StatusDescription;
                    FormMain.Instance.WriteLog("Error Code : " + wRes.StatusDescription);
                    return null;
                }

                return strResult;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
                FormMain.Instance.WriteLog("Exception : " + ex.Message);
            }

            return null;
        }

        public static List<Door> GetDoors(string strResult, out string strErrorMessage)
        {
            strErrorMessage = null;
            JObject json = JObject.Parse(strResult);

            if (json == null)
                return null;

            JToken tokenDoorCollection = null;

            foreach (JToken child in json.Children())
            {
                string strPath = child.Path;
                
                if (strPath.ToLower() == "doorcollection")
                {
                    tokenDoorCollection = json[strPath];
                    break;
                }
            }

            if (tokenDoorCollection == null)
            {
                strErrorMessage = "DoorCollection 값이 null입니다.";
                return null;
            }

            JToken tokenRows = null;

            foreach (JToken child in tokenDoorCollection.Children())
            {
                string strPath = child.Path;
                int index = strPath.LastIndexOf('.');

                if (index < 0)
                    continue;

                strPath = strPath.Substring(index + 1);

                if (strPath.ToLower() == "rows")
                {
                    tokenRows = tokenDoorCollection[strPath];
                    break;
                }
            }

            if (tokenRows == null)
            {
                strErrorMessage = "DoorCollection.rows 값이 null입니다.";
                return null;
            }

            List<Door> doors = new List<Door>();
            JArray arrRows = (JArray)tokenRows;

            foreach (var row in arrRows)
            {
                JToken tokenID = row["id"];
                JToken tokenName = row["name"];
                JToken tokenStatus = row["status"];

                if (tokenID == null)
                {
                    strErrorMessage = "DoorCollection.rows.id 값이 null입니다.";
                    return null;
                }

                if (tokenName == null)
                {
                    strErrorMessage = "DoorCollection.rows.name 값이 null입니다.";
                    return null;
                }

                if (tokenStatus == null)
                {
                    strErrorMessage = "DoorCollection.rows.status 값이 null입니다.";
                    return null;
                }

                int id = tokenID.Value<int>();
                string strName = tokenName.Value<string>();
                int status = tokenStatus.Value<int>();

                Door door = new Door();
                door.ID = id;
                door.Name = strName;
                door.Status = status;

                doors.Add(door);
            }

            return doors;
        }

        public static string GetDoorsString(List<Door> doors)
        {
            string strLog = string.Format("Total : " + doors.Count);

            foreach (Door door in doors)
            {
                strLog += string.Format("\r\nID({0}), Name({1}), Status({2})", door.ID, door.Name, door.GetStatusString());
            }

            return strLog;
        }
    }
}
