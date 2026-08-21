using System;
using System.Net;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace ParkingDoorMonitor
{
    using Models;

    class DoorManager
    {
        private string m_strBaseUrl = "";
        private bool m_processing = false;

        public DoorManager(string strBaseUrl)
        {
            m_strBaseUrl = strBaseUrl;
        }

        public List<DoorData> ReadDatas()
        {
            if (m_processing)
                return null;

            m_processing = true;
            List<DoorData> doorDatas = null;

            string strUrl = m_strBaseUrl;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "GET";

            string strResult = "";

            try
            {
                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                Logger.Instance.Write(strResult);
                doorDatas = ParseDoorDatas(JObject.Parse(strResult));
            }
            catch (System.Net.WebException ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
                doorDatas = new List<DoorData>();
            }

            m_processing = false;
            return doorDatas;
        }

        private List<DoorData> ParseDoorDatas(JObject json)
        {
            List<DoorData> doorDatas = new List<DoorData>();

            JToken tokenResult = json.GetValue("result");
            JToken tokenDatas = json.GetValue("data");
            JToken tokeninfo = json.GetValue("info");

            int code;
            string strMessage;
            string strDeploy, strPublish;

            if (GetResult(tokenResult, out code, out strMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("GetResult False");
                return doorDatas;
            }

            if (GetInfo(tokeninfo, out strDeploy, out strPublish) == false)
            {
                System.Diagnostics.Trace.WriteLine("GetInfo False");
                return doorDatas;
            }

            if (strMessage != "OK")
            {
                System.Diagnostics.Trace.WriteLine("Message : " + strMessage);
                return doorDatas;
            }

            if (tokenDatas != null)
            {
                JToken token = tokenDatas.First;

                while (token != null)
                {
                    doorDatas.Add(ParseDoor(token));
                    token = token.Next;
                }
            }

            return doorDatas;
        }

        private bool GetResult(JToken tokenResult, out int code, out string strMessage)
        {
            code = 0;
            strMessage = null;

            if (tokenResult != null)
            {
                code = tokenResult.Value<int>("code");
                strMessage = tokenResult.Value<string>("message");
                return true;
            }

            return false;
        }

        private bool GetInfo(JToken tokenInfo, out string strDeploy, out string strPublish)
        {
            strDeploy = null;
            strPublish = null;

            if (tokenInfo != null)
            {
                strDeploy = tokenInfo.Value<string>("deployment");
                strPublish = tokenInfo.Value<string>("published");
                return true;
            }

            return false;
        }

        private DoorData ParseDoor(JToken token)
        {
            DoorData doorData = new DoorData();

            string strMachineCode = token.Value<string>("machineCode");
            string strGateStatus = token.Value<string>("gateStatus");

            doorData.MachineCode = strMachineCode;
            doorData.GateStatus = strGateStatus;

            return doorData;
        }
    }
}
