using System;
using static dnsSopID.ID;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using static dnsData.Sensor.Facility;
using dnsCommunicateSopServer;

namespace IntegrationServer.Servers.Earthquake.GG
{
    using Datas;
    using ViewModels.Option;
    using ViewModels.Earthquake;
    using Managers;

    class EarthquakeManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private bool m_runThread = false;

        private IDataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;

        private string m_strServerIP = "";
        private int m_nPortNo = 0;
        private NetworkManager m_netMgr = null;

        public Logger Logger { get; set; }

        public int ServerSeqNo
        {
            get
            {
                return m_nServerSeqNo;
            }
        }

        public ServerTypes ServerType
        {
            get
            {
                return ServerTypes.Earthquake_GG;
            }
        }

        public bool IsConnected
        {
            get
            {
                return m_runThread;
            }
        }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        private const string DB_Name = "Earthquake_DB";
        private const string DB_Info = "Earthquake_UserInfo";

        private IDataManager m_earthDBManager = null;
        private int m_nSiteID = -1;

        public EarthquakeManager(ServerManager serverManager, IDataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int port, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_strServerIP = strServerIP;
            m_nPortNo = port;
            m_nSiteID = nSiteID;

            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_dataManager = dataManager.Clone();

            //ReadEarthDBInfo();
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        private void ReadEarthDBInfo()
        {
            WriteLog("ReadEarthDBInfo");

            string strErrorMessage;
            string strCondition = string.Format("{0} in ('{1}', '{2}')", OptionSDMS.Fields.PropertyName, DB_Name, DB_Info);
            IEnumerable<OptionSDMS> options = m_dataManager.GetSelect().Select<OptionSDMS>(strCondition, out strErrorMessage);

            if (options == null)
            {
                WriteLog("ReadOptionSDMS Fail : " + strErrorMessage);
                return;
            }

            WriteLog("ReadOptions");

            string strDBName = null;
            string strID = null, strPW = null;
            int dbType = -1;

            foreach (OptionSDMS option in options)
            {
                if (option.PropertyName.ToLower() == "earthquake_db")
                {
                    if (option.PropertyValue != null)
                        strDBName = option.PropertyValue.Trim();
                }
                else if (option.PropertyName.ToLower() == "earthquake_userinfo")
                {
                    if (option.PropertyValue != null)
                    {
                        string strDBInfo = option.PropertyValue.Trim();
                        string[] tokens = strDBInfo.Split('/');

                        if (tokens.Length == 3)
                        {
                            strID = tokens[0].Trim();
                            strPW = tokens[1].Trim();

                            int.TryParse(tokens[2].Trim(), out dbType);
                        }
                    }
                }
            }

            WriteLog("Earth DB Name1 : " + strDBName + ", IP : " + m_strServerIP);

            DataManager dbManager = new DataManager(dbType, m_strServerIP, strDBName, strID, strPW);
            m_earthDBManager = dbManager;
            WriteLog("Earth DB Name : " + strDBName + ", IP : " + m_strServerIP);
        }

        private void ReadAll()
        {
            if (m_earthDBManager == null)
                return;

            string strErrorMessage;

            // 자체 센서
            IEnumerable<HEvtInfo> hEvtInfos = m_earthDBManager.GetSelect().Select<HEvtInfo>(null, out strErrorMessage);

            if (hEvtInfos == null)
            {
                WriteLog("HEvtInfo Read Fail : " + strErrorMessage, LogTypes.Error);
                return;
            }

            // 행정안전부 센서
            IEnumerable<KEvtInfo> kEvtInfos = m_earthDBManager.GetSelect().Select<KEvtInfo>(null, out strErrorMessage);

            if (kEvtInfos == null)
            {
                WriteLog("KEvtInfo Read Fail : " + strErrorMessage, LogTypes.Error);
                return;
            }

            string strHLogs = "";
            int nCount = 0;

            foreach (HEvtInfo info in hEvtInfos)
            {
                string strLog = info.EVENT_ID + ", " + info.NET + ", " + info.OBS_ID + ", " + GetFieldValue(info.EVENT_TIME) + ", " + GetFieldValue(info.FILE_NM);
                strLog += ", " + GetFieldValue(info.SEND_DATE_NEMA) + ", " + GetFieldValue(info.SHOW_YN) + ", " + GetFieldValue(info.VOICE_YN) + ", " + GetFieldValue(info.pga_val);
                strLog += ", " + GetFieldValue(info.regdate);

                if (nCount == 0)
                    strHLogs = strLog;
                else
                    strHLogs += "\r\n" + strLog;

                nCount++;
            }

            WriteLog("Read HEvtInfo : Count(" + nCount + ") : " + strHLogs);

            string strKLogs = "";
            nCount = 0;

            foreach (KEvtInfo info in kEvtInfos)
            {
                string strLog = info.EQ_NO + ", " + info.EQ_DITC + ", " + info.ORIGIN_TIME + ", " + GetFieldValue(info.LAT) + ", " + GetFieldValue(info.LON);
                strLog += ", " + GetFieldValue(info.MAG) + ", " + GetFieldValue(info.ORIGIN_AREA) + ", " + GetFieldValue(info.START_TIME) + ", " + GetFieldValue(info.END_TIME);
                strLog += ", " + GetFieldValue(info.FILE_NM) + ", " + GetFieldValue(info.SEND_DATE_NEMA) + ", " + GetFieldValue(info.SHOW_YN) + ", " + GetFieldValue(info.REGDATE);

                if (nCount == 0)
                    strKLogs = strLog;
                else
                    strKLogs += "\r\n" + strLog;

                nCount++;
            }

            WriteLog("Read KEvtInfo : Count(" + nCount + ") : " + strKLogs);
        }

        private string GetFieldValue(double? value)
        {
            if (value == null)
                return "NULL";

            return string.Format("{0:F2}", (double)value);
        }

        private string GetFieldValue(DateTime? value)
        {
            if (value == null)
                return "NULL";

            return GetTimeString((DateTime)value);
        }

        private string GetFieldValue(string strValue)
        {
            if (strValue == null)
                return "NULL";

            return strValue.Trim();
        }

        public void Start()
        {
            /*ReadEarthDBInfo();

            if (m_earthDBManager == null)
                return;

            DateTime dtHLast, dtKLast;

            if (GetLastID(out dtHLast, out dtKLast))*/
            {
                /*ArrayList arrDatas = new ArrayList();

                arrDatas.Add(dtHLast);
                arrDatas.Add(dtKLast);*/

                //Thread t = new Thread(new ThreadStart(MonitoringThread));
                //t.Start(/*arrDatas*/);

                m_netMgr = new NetworkManager(this, m_dataManager, m_nSiteID);
                m_netMgr.Start(m_strServerIP, m_nPortNo);

                /*Thread t2 = new Thread(new ParameterizedThreadStart(m_netMgr.Listen));
                t2.Start(m_nPortNo);*/
            }
        }

        private bool GetLastID(out DateTime dtHLast, out DateTime dtKLast)
        {
            dtHLast = dtKLast = DateTime.Now;

            string strErrorMessage;

            string strCondition = string.Format("{0} = (select max({0}) from {1})", HEvtInfo.Fields.regdate, HEvtInfo.TableName);

            // 자체 센서
            HEvtInfo hEvtInfo = m_earthDBManager.GetSelect().SelectFirst<HEvtInfo>(strCondition, out strErrorMessage);

            if (hEvtInfo == null)
            {
                if (strErrorMessage != null)
                {
                    WriteLog("HEvtInfo ReadFirst Fail : " + strErrorMessage, LogTypes.Error);
                    return false;
                }
            }
            else if (hEvtInfo.regdate != null)
                dtHLast = (DateTime)hEvtInfo.regdate;

            strCondition = string.Format("{0} = (select max({0}) from {1})", KEvtInfo.Fields.REGDATE, KEvtInfo.TableName);

            // 행정안전부 센서
            KEvtInfo kEvtInfo = m_earthDBManager.GetSelect().SelectFirst<KEvtInfo>(strCondition, out strErrorMessage);

            if (kEvtInfo == null)
            {
                if (strErrorMessage != null)
                {
                    WriteLog("KEvtInfo ReadFirst Fail : " + strErrorMessage, LogTypes.Error);
                    return false;
                }
            }
            else if (kEvtInfo.REGDATE != null)
                dtKLast = (DateTime)kEvtInfo.REGDATE;

            return true;
        }

        private string GetTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private bool ReadEvent(ref DateTime dtHLast, ref DateTime dtKLast)
        {
            string strErrorMessage;

            /*string strCondition = string.Format("{0} > '{1}' order by {0} desc", HEvtInfo.Fields.regdate, GetTimeString(dtHLast));

            // 자체 센서
            HEvtInfo hEvtInfo = m_earthDBManager.GetSelect().SelectFirst<HEvtInfo>(strCondition, out strErrorMessage);

            if (hEvtInfo == null)
            {
                if (strErrorMessage != null)
                {
                    WriteLog("HEvtInfo ReadLast Fail : " + strErrorMessage, LogTypes.Error);
                    return false;
                }
            }
            else if (hEvtInfo.regdate != null)
            {
                // 읽은 시간에 초 미만의 milliseconds가 있을수 있기 때문에 깔끔하게 1초를 더한다.
                dtHLast = ((DateTime)hEvtInfo.regdate).AddSeconds(1);
            }*/

            string strCondition = string.Format("{0} > '{1}' order by {0} desc", KEvtInfo.Fields.REGDATE, GetTimeString(dtKLast));

            // 행정안전부 센서
            KEvtInfo kEvtInfo = m_earthDBManager.GetSelect().SelectFirst<KEvtInfo>(strCondition, out strErrorMessage);

            if (kEvtInfo == null)
            {
                if (strErrorMessage != null)
                {
                    WriteLog("KEvtInfo ReadLast Fail : " + strErrorMessage, LogTypes.Error);
                    return false;
                }
            }
            else if (kEvtInfo.REGDATE != null)
            {
                // 읽은 시간에 초 미만의 milliseconds가 있을수 있기 때문에 깔끔하게 1초를 더한다.
                dtKLast = ((DateTime)kEvtInfo.REGDATE).AddSeconds(1);
            }

            // UDP 통신으로 대체한다.
            /*// 자체 센서 측정값을 우선적으로 처리한다.
            if (hEvtInfo != null)
            {
                int intensity;
                int alarmLevel = IntensityManager.GetAlarmLevel(hEvtInfo, out intensity);
                return SendSensorData(alarmLevel > 0, alarmLevel * 10000 + intensity);
            }
            else*/ if (kEvtInfo != null)
            {
                // nMagnitude는 실제 규모값에 100을 곱한값이다.
                int nMagnitude;
                int alarmLevel = MagnitudeManager.GetAlarmLevel(kEvtInfo, out nMagnitude);
                return SendSensorData(alarmLevel > 0, alarmLevel * 10000 + nMagnitude);
            }

            return true;
        }

        public bool SendSensorData(bool isAlarm, int nAlarmLevel)
        {
            Dictionary<int, SensorTag> sensorTags = SensorManager.Instance.FindSensors(m_nServerSeqNo);

            if (sensorTags != null)
            {
                foreach (KeyValuePair<int, SensorTag> pair in sensorTags)
                {
                    return SendSensorData(pair.Value, isAlarm, nAlarmLevel);
                }
            }

            return true;
        }

        // nAlarmLevel이 100보다 작으면 진도, 100 이상이면 규모를 의미
        // 100 이상일 경우 nAlarmLevel을 100으로 나눈값이 규모
        private bool SendSensorData(SensorTag sensorTag, bool isAlarm, int nAlarmLevel)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, (int)FacilityType.Earthquake, sensorTag.ID, sensorTag.SensorZoneID, isAlarm, nAlarmLevel);
        }

        public void Stop()
        {
            m_runThread = false;

            if (m_netMgr != null)
            {
                m_netMgr.Stop();
                m_netMgr = null;
            }
        }

        private void MonitoringThread(/*object args*/)
        {
            if (m_runThread)
                return;

            ReadEarthDBInfo();

            if (m_earthDBManager == null)
                return;

            DateTime dtHLast, dtKLast;

            if (GetLastID(out dtHLast, out dtKLast) == false)
            {
                WriteLog("GetLastID Fail");
                return;
            }
            
            //ArrayList arrDatas = (ArrayList)args;
            //DateTime dtHLast = (DateTime)arrDatas[0];
            //DateTime dtKLast = (DateTime)arrDatas[1];

            m_runThread = true;

            while (m_runThread)
            {
                try
                {
                    ReadEvent(ref dtHLast, ref dtKLast);
                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    WriteLog("[ERROR] MonitoringThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);
                }
            }
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }
}
