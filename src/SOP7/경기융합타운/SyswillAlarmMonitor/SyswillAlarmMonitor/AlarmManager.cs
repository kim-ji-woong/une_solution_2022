using System;
using System.Net;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.Configuration;
using dnsCommunicateSopServer;

namespace SyswillAlarmMonitor
{
    using Models;

    class AlarmManager
    {
        private string m_strBaseUrl = "";
        private string m_strSopWebServerUrl = "";
        private bool m_processing = false;
        private int m_nSiteID = -1;

        private AlarmChecker m_alarmChecker = null;
        private SpaceManager m_spaceManager = null;
        private int m_nPrevLastAlarmNo = -1;

        private const string LastAlarmNo = ".\\LastAlarm.txt";

        public dnsDapperDBUtil.DataAccessLayer.DAL.DataManager DataManager
        {
            get
            {
                if (m_alarmChecker != null)
                    return m_alarmChecker.DataManager;

                return null;
            }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
        }

        public AlarmManager()
        {
            m_strBaseUrl = ConfigurationManager.AppSettings.Get("BaseUrl");
            m_strSopWebServerUrl = ConfigurationManager.AppSettings.Get("SOPWebServerURL");
            string strSiteID = ConfigurationManager.AppSettings.Get("SiteID");

            int nSiteID;

            if (strSiteID != null && strSiteID.Length > 0 && int.TryParse(strSiteID, out nSiteID))
            {
                m_nSiteID = nSiteID;
                m_alarmChecker = new AlarmChecker(m_nSiteID);
                m_spaceManager = m_alarmChecker.SpaceManager;
            }

            ReadLastAlarmNo();
        }

        private void ReadLastAlarmNo()
        {
            if (File.Exists(LastAlarmNo))
            {
                StreamReader reader = new StreamReader(LastAlarmNo, System.Text.Encoding.UTF8);
                string strLine = reader.ReadLine().Trim();
                reader.Close();

                int maxAlarmNo;

                if (int.TryParse(strLine, out maxAlarmNo))
                    m_nPrevLastAlarmNo = maxAlarmNo;
            }
        }

        private void WriteLastAlarmNo(int alarmNo)
        {
            StreamWriter writer = new StreamWriter(LastAlarmNo, false, System.Text.Encoding.UTF8);
            writer.WriteLine(alarmNo);
            writer.Close();
        }

        /*public List<AlarmData> ReadAlarms(int alarmCount = -1)
        {
            if (m_processing)
                return null;

            m_processing = true;

            string strPath = @"D:\Project\SOP\경기융합타운\시스윌\alarmSample.json";

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            System.IO.StreamReader reader = new StreamReader(strPath, System.Text.Encoding.GetEncoding(949));
            string strJson = reader.ReadToEnd();
            reader.Close();

            int maxAlarmNo;
            List<AlarmData> alarmDatas = ParseAlarmDatas(JObject.Parse(strJson), out maxAlarmNo);

            if (alarmDatas != null && m_alarmChecker != null)
            {
                if (alarmCount > 0)
                {
                    int nCount = alarmDatas.Count;
                    List<AlarmData> tempDatas = new List<AlarmData>();

                    for (int i=0;i<alarmCount && i<nCount;i++)
                    {
                        tempDatas.Add(alarmDatas[i]);
                    }

                    alarmDatas.Clear();
                    alarmDatas.AddRange(tempDatas);
                    tempDatas.Clear();
                }

                if (maxAlarmNo > m_nPrevLastAlarmNo)
                {
                    m_nPrevLastAlarmNo = maxAlarmNo;
                    WriteLastAlarmNo(maxAlarmNo);
                }

                List<AlarmSensor> alarms = m_alarmChecker.GetSensorZones(alarmDatas);

                if (alarms != null)
                    SendAlarm(alarms);
            }

            m_processing = false;
            return alarmDatas;
        }*/

        public List<AlarmData> ReadAlarms(int alarmCount = -1)
        {
            if (m_processing)
                return null;

            m_processing = true;
            List<AlarmData> alarmDatas = null;

            string strUrl = alarmCount < 0 ? m_strBaseUrl : m_strBaseUrl + "/" + alarmCount.ToString();

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

                int maxAlarmNo;
                alarmDatas = ParseAlarmDatas(JObject.Parse(strResult), out maxAlarmNo);

                if (alarmDatas != null && m_alarmChecker != null)
                {
                    if (maxAlarmNo > m_nPrevLastAlarmNo)
                    {
                        m_nPrevLastAlarmNo = maxAlarmNo;
                        WriteLastAlarmNo(maxAlarmNo);
                    }

                    List<AlarmSensor> alarms = m_alarmChecker.GetSensorZones(alarmDatas);

                    if (alarms != null)
                        SendAlarm(alarms);
                }
            }
            catch (System.Net.WebException ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
                alarmDatas = new List<AlarmData>();
            }

            m_processing = false;
            return alarmDatas;
        }

        private List<AlarmData> ParseAlarmDatas(JObject json, out int maxAlarmNo)
        {
            maxAlarmNo = m_nPrevLastAlarmNo;
            List<AlarmData> alarmDatas = new List<AlarmData>();

            JToken tokenMessage = json.GetValue("Msg", StringComparison.OrdinalIgnoreCase);
            JToken tokenCode = json.GetValue("Code", StringComparison.OrdinalIgnoreCase);

            if (tokenCode == null || tokenMessage == null)
                return alarmDatas;

            int code = tokenCode.Value<int>();
            string message = tokenMessage.Value<string>();

            if (code != 1 || message != "OK")
                return alarmDatas;

            JToken tokenDatas = json.GetValue("data", StringComparison.OrdinalIgnoreCase);

            if (tokenDatas != null)
            {
                JToken token = tokenDatas.First;

                while (token != null)
                {
                    AlarmData alarmData = ParseAlarm(token);

                    if (alarmData.AlarmNo > m_nPrevLastAlarmNo)
                        alarmDatas.Add(alarmData);

                    token = token.Next;

                    if (alarmData.AlarmNo > maxAlarmNo)
                        maxAlarmNo = alarmData.AlarmNo;
                }
            }

            return alarmDatas;
        }

        private AlarmData ParseAlarm(JToken token)
        {
            AlarmData alarmData = new AlarmData();

            string strFacilityID = token.Value<string>("장비아이디");
            string strBuildingName = token.Value<string>("건물명");
            int alarmStatus = token.Value<int>("알람상태");
            string strFloorName = token.Value<string>("발생층수");
            string strAlarmLevel = token.Value<string>("알람레벨");
            string strTimestamp = token.Value<string>("발생시간");
            int alarmNo = token.Value<int>("알람번호");
            string strTrainingMode = token.Value<string>("훈련여부");
            string strProcessTime = token.Value<string>("처리시간");
            string strAlarmType = token.Value<string>("알람타입");

            alarmData.FacilityID = strFacilityID;
            alarmData.BuildingName = strBuildingName;
            alarmData.Status = AlarmData.ToAlarmStatus(alarmStatus);
            alarmData.FloorName = strFloorName;
            alarmData.AlarmLevel = strAlarmLevel;
            alarmData.Timestamp = strTimestamp;
            alarmData.AlarmNo = alarmNo;
            alarmData.IsTrainingMode = strTrainingMode == "N" || strTrainingMode == "n" ? false : true;
            alarmData.ProcessTime = strProcessTime;
            alarmData.AlarmType = AlarmData.ToAlarmTypes(strAlarmType);

            return alarmData;
        }

        private void SendAlarm(List<AlarmSensor> alarms)
        {
            string strBaseUrl = m_strSopWebServerUrl;

            if (strBaseUrl.EndsWith("/") == false)
                strBaseUrl += "/";

            SopQueryManager mgr = new SopQueryManager();

            foreach (AlarmSensor alarm in alarms)
            {
                string strUrl = "";

                if (alarm.AlarmType == AlarmData.AlarmTypes.Fire)
                    strUrl = strBaseUrl + "api/FireSensor";
                else if (alarm.AlarmType == AlarmData.AlarmTypes.Gas)
                    strUrl = strBaseUrl + "api/PSMSensor";
                else
                    strUrl = strBaseUrl + "api/EtcSensor";

                ArrayList arrData = new ArrayList();

                arrData.Add(alarm.SensorZone.SensorType);
                arrData.Add(alarm.TagInfo.ID);
                arrData.Add(alarm.SensorZone.ID);
                arrData.Add(alarm.IsAlarm);
                arrData.Add(alarm.AlarmLevel);

                mgr.SendAlarmQuery(arrData, "POST", strUrl);
            }
        }
    }
}
