using System;
using System.Net;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.Configuration;
using dnsCommunicateSopServer;

namespace SysWillAlarm
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
        private string m_strAlarmNoFilePath = "";
        private Logger m_logger = null;

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

        public AlarmManager(ConfigData data, string strBaseLogFolder)
        {
            m_strBaseUrl = data.BaseUrl;
            m_strSopWebServerUrl = data.SOPWebServerUrl;
            m_nSiteID = data.SiteID;

            m_alarmChecker = new AlarmChecker(m_nSiteID, data.DbHost, data.DbName, data.DbType, data.DbId, data.DbPw);
            m_spaceManager = m_alarmChecker.SpaceManager;

            string strLogFolder = string.Format("{0}/SyswillAlarmMonitor/{1}", strBaseLogFolder, m_nSiteID);
            m_logger = new Logger(strLogFolder);

            ReadLastAlarmNo(m_nSiteID);
        }

        private void ReadLastAlarmNo(int nSiteID)
        {
            m_strAlarmNoFilePath = "";
            int index = LastAlarmNo.LastIndexOf('.'); 

            if (index > 0)
            {
                string strFileName = LastAlarmNo.Substring(0, index) + "_" + nSiteID.ToString();
                string strExt = LastAlarmNo.Substring(index);
                m_strAlarmNoFilePath = strFileName + strExt;
            }
            else
                m_strAlarmNoFilePath = LastAlarmNo + "_" + nSiteID.ToString();

            if (File.Exists(m_strAlarmNoFilePath))
            {
                StreamReader reader = new StreamReader(m_strAlarmNoFilePath, System.Text.Encoding.UTF8);
                string strLine = reader.ReadLine().Trim();
                reader.Close();

                int maxAlarmNo;

                if (int.TryParse(strLine, out maxAlarmNo))
                    m_nPrevLastAlarmNo = maxAlarmNo;
            }
        }

        private void WriteLastAlarmNo(int alarmNo)
        {
            StreamWriter writer = new StreamWriter(m_strAlarmNoFilePath, false, System.Text.Encoding.UTF8);
            writer.WriteLine(alarmNo);
            writer.Close();
        }

        public List<AlarmData> ReadAlarms(int alarmCount = -1)
        {
            if (m_processing)
                return null;

            m_processing = true;
            List<AlarmData> alarmDatas = null;

            string strUrl = alarmCount < 0 ? m_strBaseUrl : m_strBaseUrl + "/" + alarmCount.ToString();

            m_logger.Write("ReadAlarms : " + strUrl);
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

                m_logger.Write(strResult);

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

                    if (IgnoreAlarm(alarmData) == false)
                    {
                        if (alarmData.AlarmNo > m_nPrevLastAlarmNo)
                            alarmDatas.Add(alarmData);
                    }

                    token = token.Next;

                    if (alarmData.AlarmNo > maxAlarmNo)
                        maxAlarmNo = alarmData.AlarmNo;
                }
            }

            return alarmDatas;
        }

        private bool IgnoreAlarm(AlarmData alarmData)
        {
            if (m_nSiteID == 47)
            {
                // 주택도시공사
                if (alarmData.AlarmType == AlarmData.AlarmTypes.Fire ||
                    alarmData.AlarmType == AlarmData.AlarmTypes.EmergencyBell)
                    return true;
            }
            else if (m_nSiteID == 44)
            {
                // 복합시설관
                if (alarmData.AlarmType == AlarmData.AlarmTypes.Fire ||
                    alarmData.AlarmType == AlarmData.AlarmTypes.EmergencyBell)
                    return true;
            }
            else if (m_nSiteID == 44)
            {
                // 교육청
            }

            return false;
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
