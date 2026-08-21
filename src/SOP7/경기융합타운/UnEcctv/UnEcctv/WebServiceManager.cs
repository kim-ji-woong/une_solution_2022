using System;
using System.IO;
using System.Configuration;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.Drawing;

namespace UnEcctv
{
    using Data;

    class WebServiceManager
    {
        private string m_strUrl = "";

        public WebServiceManager(string strUrl)
        {
            if (strUrl != null)
            {
                string strBaseUrl = strUrl;//GetUrl();

                if (strBaseUrl.EndsWith("/"))
                    m_strUrl = strBaseUrl + "SDMS/GGH/RequestData";
                else
                    m_strUrl = strBaseUrl + "/SDMS/GGH/RequestData";
            }
        }

        /*private string GetUrl()
        {
            string strUrl = ConfigurationManager.AppSettings.Get("Url");

            if (strUrl == null || strUrl.Trim().Length == 0)
                return "";

            return strUrl;
        }*/

        public CCTVStatus RunCommand(string strCommand, List<CCTVData> cctvDatas, out Point? ptLocation)
        {
            ptLocation = null;

            if (strCommand == null)
                return null;

            strCommand = strCommand.Trim();

            if (strCommand.Length == 0)
                return null;

            List<int> cctvIDs = new List<int>();
            string[] tokens = strCommand.Split('/');
            int len = tokens.Length;

            if (len < 5)
                return null;

            CCTVStatus status = new CCTVStatus();

            status.Guid = tokens[0].Trim();

            int userID, sensorZoneHistoryID;

            if (int.TryParse(tokens[1].Trim(), out userID))
                status.UserID = userID;
            else
                return null;

            int markNo;
            int? mark = null;

            if (int.TryParse(tokens[2].Trim(), out markNo))
                mark = markNo;

            status.Title = tokens[3].Trim();

            if (int.TryParse(tokens[4].Trim(), out sensorZoneHistoryID))
                status.SensorZoneHistoryID = sensorZoneHistoryID;
            else
                status.SensorZoneHistoryID = null;

            string strLocation = tokens[5].Trim();
            int index = strLocation.IndexOf(',');

            if (index > 0)
            {
                string strX = strLocation.Substring(0, index).Trim();
                string strY = strLocation.Substring(index + 1).Trim();

                int x, y;

                if (int.TryParse(strX, out x) && int.TryParse(strY, out y))
                {
                    ptLocation = new Point(x, y);
                }
            }

            for (int i = 6; i < len; i++)
            {
                string strToken = tokens[i].Trim();
                int cctvID;

                if (int.TryParse(strToken, out cctvID))
                {
                    cctvIDs.Add(cctvID);
                    SetCCTV(status, cctvID, cctvIDs.Count);
                }
            }

            if (cctvIDs.Count > 0)
            {
                Dictionary<int, CCTVData> dicCCTVDatas = ReadCCTVs(cctvIDs);

                if (dicCCTVDatas == null)
                    return null;

                foreach (KeyValuePair<int, CCTVData> pair in dicCCTVDatas)
                {
                    cctvDatas.Add(pair.Value);
                }

                /*CCTVStatus _status = ReadStatus(status.Guid, status.UserID);

                if (_status != null)
                {
                    // 이미 같은 CCTV 창이 존재하기 때문에 DB만 업데이트하고 application은 실행시키지 않는다.
                    _status.CCTV1 = status.CCTV1;
                    _status.CCTV2 = status.CCTV2;
                    _status.CCTV3 = status.CCTV3;
                    _status.CCTV4 = status.CCTV4;
                    _status.Visible = ptLocation == null ? false : true;

                    string strErrorMessage;
                    UpdateStatus(_status, out strErrorMessage);
                    return null;
                }*/

                status.MarkNo = mark;
                status.Visible = ptLocation != null;
                return status;
            }

            return null;
        }

        private void SetCCTV(CCTVStatus status, int cctvID, int index)
        {
            if (index == 1)
                status.CCTV1 = cctvID;
            else if (index == 2)
                status.CCTV2 = cctvID;
            else if (index == 3)
                status.CCTV3 = cctvID;
            else if (index == 4)
                status.CCTV4 = cctvID;
        }

        public Dictionary<int, CCTVData> ReadCCTVs(List<int> cctvIDs)
        {
            if (cctvIDs.Count == 0)
                return new Dictionary<int, CCTVData>();

            JArray arrIDs = new JArray();

            foreach (int id in cctvIDs)
            {
                arrIDs.Add(id);
            }

            JObject jsonData = new JObject();
            jsonData.Add("cctvIDs", arrIDs);

            JObject json = new JObject();
            json.Add("requestCCTVList2", jsonData);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(m_strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                if (strResult == null)
                    return null;

                JObject jsonResult = JObject.Parse(strResult);

                if (jsonResult == null)
                    return null;

                List<CCTV> cctvs = new List<CCTV>();
                JArray arr = (JArray)jsonResult["cctvs"];

                foreach (JToken token in arr)
                {
                    cctvs.Add(ToCCTV(token));
                }

                Dictionary<int, CCTVData> dicCCTVDatas = new Dictionary<int, CCTVData>();

                foreach (CCTV cctv in cctvs)
                {
                    dicCCTVDatas[cctv.ID] = ToCCTVData(cctv);
                }

                return dicCCTVDatas;
            }
            catch (System.Net.WebException ex)
            {
                System.Diagnostics.Trace.WriteLine("ReadCCTVs Error : " + ex.Message);
            }

            return null;

            /*Dictionary<int, CCTVData> dicCCTVDatas = new Dictionary<int, CCTVData>();

            foreach (CCTV cctv in cctvs)
            {
                dicCCTVDatas[cctv.ID] = ToCCTVData(cctv);
            }

            return dicCCTVDatas;*/
        }

        public bool CloseCCTVPopups(int userID)
        {
            JObject jsonData = new JObject();
            jsonData.Add("userID", userID);

            JObject json = new JObject();
            json.Add("closeCCTVPopups", jsonData);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(m_strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                JObject jsonResult = JObject.Parse(strResult);

                if (jsonResult == null)
                    return false;

                bool success = (bool)jsonResult["success"];

                if (success == false)
                {
                    string strErrorMessage = (string)jsonResult["message"];
                    System.Diagnostics.Trace.WriteLine("CloseCCTVPopups Error : " + strErrorMessage);
                    return false;
                }

                return true;
            }
            catch (System.Net.WebException ex)
            {
                System.Diagnostics.Trace.WriteLine("CloseCCTVPopups Error : " + ex.Message);
            }

            return false;
        }

        public bool ShowCCTVPopups(int userID, bool visible)
        {
            JObject jsonData = new JObject();
            jsonData.Add("userID", userID);
            jsonData.Add("visible", visible);

            JObject json = new JObject();
            json.Add("showCCTVPopups", jsonData);

            string strJson = json.ToString();

            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(m_strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "";

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                JObject jsonResult = JObject.Parse(strResult);

                if (jsonResult == null)
                    return false;

                bool success = (bool)jsonResult["success"];

                if (success == false)
                {
                    string strErrorMessage = (string)jsonResult["message"];
                    System.Diagnostics.Trace.WriteLine("ShowCCTVPopups Error : " + strErrorMessage);
                    return false;
                }

                return true;
            }
            catch (System.Net.WebException ex)
            {
                System.Diagnostics.Trace.WriteLine("ShowCCTVPopups Error : " + ex.Message);
            }

            return false;
        }

        private CCTVData ToCCTVData(CCTV cctv)
        {
            CCTVData data = new CCTVData();

            data.ID = cctv.ID;
            data.Title = cctv.CameraName;
            data.Url = cctv.URL;

            return data;
        }

        private CCTV ToCCTV(JToken token)
        {
            int id = (int)token["id"];
            string strCameraName = (string)token["cameraName"];
            string strPositionName = (string)token["positionName"];
            string strUniqueKey = (string)token["uniqueKey"];
            double? x = (double?)token["x"];
            double? y = (double?)token["y"];
            double? z = (double?)token["z"];
            int? zoneID = (int?)token["zoneID"];
            bool isIndoor = (bool)token["isIndoor"];
            string strType = (string)token["type"];
            int? channel = (int?)token["channel"];
            string strID = (string)token["userID"];
            string strPW = (string)token["password"];
            string strUrl = (string)token["url"];
            string strBigUrl = (string)token["bigURL"];
            string strSmallUrl = (string)token["smallURL"];
            bool? enabled = (bool?)token["enabled"];
            string strCameraIP = (string)token["cameraIP"];
            string strCameraCompanyName = (string)token["cameraCompanyName"];
            string strCameraModelName = (string)token["cameraModelName"];
            string strDescription = (string)token["description"];
            int? siteID = (int?)token["siteID"];

            CCTV cctv = new CCTV();

            cctv.ID = id;
            cctv.CameraName = strCameraName;
            cctv.PositionName = strPositionName;
            cctv.UniqueKey = strUniqueKey;
            cctv.X = x;
            cctv.Y = y;
            cctv.Z = z;
            cctv.ZoneID = zoneID;
            cctv.IsIndoor = isIndoor;
            cctv.Type = strType;
            cctv.Channel = channel;
            cctv.UserID = strID;
            cctv.Password = strPW;
            cctv.URL = strUrl;
            cctv.BigURL = strBigUrl;
            cctv.SmallURL = strSmallUrl;
            cctv.Enabled = enabled;
            cctv.CameraIP = strCameraIP;
            cctv.CameraCompanyName = strCameraCompanyName;
            cctv.CameraModelName = strCameraModelName;
            cctv.Description = strDescription;
            cctv.SiteID = siteID;

            return cctv;
        }

        private CCTVStatus ToStatus(JToken token)
        {
            string strGuid = (string)token["guid"];
            int userID = (int)token["userID"];
            string strTitle = (string)token["title"];
            int? sensorZoneHistoryID = (int?)token["sensorZoneHistoryID"];
            int? cctv1 = (int?)token["cctV1"];
            int? cctv2 = (int?)token["cctV2"];
            int? cctv3 = (int?)token["cctV3"];
            int? cctv4 = (int?)token["cctV4"];
            DateTime heartBeat = (DateTime)token["heartBeat"];
            bool visible = (bool)token["visible"];

            CCTVStatus status = new CCTVStatus();

            status.Guid = strGuid;
            status.UserID = userID;
            status.Title = strTitle;
            status.SensorZoneHistoryID = sensorZoneHistoryID;
            status.CCTV1 = cctv1;
            status.CCTV2 = cctv2;
            status.CCTV3 = cctv3;
            status.CCTV4 = cctv4;
            status.HeartBeat = heartBeat;
            status.Visible = visible;

            return status;
        }

        private JObject ToJObject(CCTVStatus status)
        {
            JObject json = new JObject();

            json.Add("guid", status.Guid);
            json.Add("userID", status.UserID);
            json.Add("title", status.Title);
            json.Add("sensorZoneHistoryID", status.SensorZoneHistoryID);
            json.Add("cCTV1", status.CCTV1);
            json.Add("cCTV2", status.CCTV2);
            json.Add("cCTV3", status.CCTV3);
            json.Add("cCTV4", status.CCTV4);
            json.Add("heartBeat", status.HeartBeat);
            json.Add("visible", status.Visible);

            JObject jsonData = new JObject();
            jsonData.Add("status", json);

            return jsonData;
        }
    }
}
