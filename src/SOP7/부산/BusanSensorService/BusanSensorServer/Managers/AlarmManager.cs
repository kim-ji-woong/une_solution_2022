using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using BusanSensorServer.Models;
using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsData.Sensor;
using SDMS.Model.Sensor;

namespace BusanSensorServer.Managers
{
    public class AlarmManager
    {
        private static AlarmManager m_instance = null;
        public static AlarmManager Instance { get { return m_instance; } }
        
        private DataManager m_dataManager = null;
        private string m_strUrl = "";
        private bool m_bRunThread = false;
        
        private Dictionary<int, AlarmInfo> m_dicCurrentAlarm = new Dictionary<int, AlarmInfo>();
        
        public Dictionary<int, AlarmInfo> DicCurrentAlarm
        {
            get { return m_dicCurrentAlarm; }
        }
        
        public AlarmManager(DataManager dataManager, string strSOPWebServerFrontURL)
        {
            m_instance = this;
            m_dataManager = dataManager;

            m_strUrl = strSOPWebServerFrontURL;

            m_bRunThread = true;
            Thread t = new Thread(new ThreadStart(LoadCurrentAlarm));
            t.Start();
        }

        public void Stop()
        {
            m_bRunThread = false;
        }

        public void LoadCurrentAlarm()
        {
            string strErrorMessage;
            string strQuery = $@"
                    select SensorZoneHistoryID, SensorType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs
                        from {SDMS.Model.Alarm.CurrentAlarm.TableName}";
            
            while (m_bRunThread)
            {
                DateTime dtNow = DateTime.Now;

                IEnumerable<dynamic> szh = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
                if (szh == null)
                {
                    Logger.Instance.Write("[ERROR] Select SdmsAlarmCurrent : " + strErrorMessage);
                    return;
                }
                
                Dictionary<int, AlarmInfo> dicCurrentAlarm = new Dictionary<int, AlarmInfo>();

                foreach (var item in szh)
                {
                    int nSensorZoneHistoryID = item.SensorZoneHistoryID;
                    int nSensorType = item.SensorType;
                    DateTime dtTimeStamp = item.TimeStamp;
                    int nSopStatus = item.SopStatus;
                    int nAlarmDepth = item.AlarmDepth;
                    string strAlarmSensorZoneIDs = item.AlarmSensorZoneIDs;
                    //
                    // if (dtTimeStamp < dtNow.AddDays(-1))
                    // {
                    //     TimeoutAlarm(nSensorZoneHistoryID, dtNow, out strErrorMessage);
                    //     continue;
                    // }
                    
                    if (nSensorZoneHistoryID <= 0 || nSensorType < 0 || dtTimeStamp == null || nAlarmDepth <= 0)
                        continue;
                    
                    if (strAlarmSensorZoneIDs == null || strAlarmSensorZoneIDs.Length == 0)
                        continue;
                    
                    string[] alarmSensorZoneIDs = strAlarmSensorZoneIDs.Split(',');
                    if (alarmSensorZoneIDs.Length == 0)
                        continue;

                    for (int i = 0; i < alarmSensorZoneIDs.Length; i++)
                    {
                        if (!int.TryParse(alarmSensorZoneIDs[i], out int nSensorZoneID))
                            continue;
                        
                        if (!dicCurrentAlarm.ContainsKey(nSensorZoneID))
                            dicCurrentAlarm.Add(nSensorZoneID, new AlarmInfo());
                        
                        dicCurrentAlarm[nSensorZoneID].SensorZoneHistoryID = nSensorZoneHistoryID;
                        dicCurrentAlarm[nSensorZoneID].SensorType = nSensorType;
                        dicCurrentAlarm[nSensorZoneID].TimeStamp = dtTimeStamp;
                        dicCurrentAlarm[nSensorZoneID].SopStatus = nSopStatus;
                        dicCurrentAlarm[nSensorZoneID].AlarmDepth = nAlarmDepth;
                        dicCurrentAlarm[nSensorZoneID].SensorZoneID = nSensorZoneID;
                    }
                }
                
                m_dicCurrentAlarm = dicCurrentAlarm;
                Logger.Instance.Write("dicCurrentAlarm Count : " + m_dicCurrentAlarm.Count + " / " + dtNow.ToString("yyyy-MM-dd HH:mm:ss"));
                Thread.Sleep(1000);
            }
        }

        public bool TimeoutAlarm(int nSensorZoneHistoryID, DateTime dt, out string strErrorMessage)
        {
            if (m_strUrl.Length == 0 || m_strUrl == null)
            {
                strErrorMessage = "SOPWebServerURL is null";
                return false;
            }
            
            string strQuery = $@"
                select SensorZoneHistoryID, SensorType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs
                    from {SDMS.Model.Alarm.CurrentAlarm.TableName}
                    where SensorZoneHistoryID = {nSensorZoneHistoryID}";
            dynamic szh = m_dataManager.GetSelect().SelectFirst(strQuery, out strErrorMessage);
            
            if (szh == null)
            {
                Logger.Instance.Write("[ERROR] Select SdmsAlarmCurrent : " + strErrorMessage);
                return false;
            }

            int nFacilityType = 0;
            foreach (var item in szh)
            {
                if (item.Key == "SensorType")
                {
                    nFacilityType = item.Value;
                }
            }

            strQuery = string.Empty;
            strQuery = $@"
                        Select ID, TypeName, LinkedTableName, SiteID from {FacilityType.TableName} Where ID = {nFacilityType}";

            dynamic ft = m_dataManager.GetSelect().SelectFirst(strQuery, out strErrorMessage);
            
            if (ft == null) 
            {
                Logger.Instance.Write("[ERROR] Select FacilityType : " + strErrorMessage);
                return false;
            }

            string strFacilityType = string.Empty;
            foreach (var item in ft)
            {
                if (item.Key == "TypeName")
                    strFacilityType = item.Value;
            }

            SopQueryManager sopQueryManager = null;
            if (strFacilityType.ToLower().Contains("fire"))
                sopQueryManager = new SopQueryManager(m_strUrl + "/api/fireSensor");
            if (strFacilityType.ToLower().Contains("psm"))
                sopQueryManager = new SopQueryManager(m_strUrl + "/api/psmSensor");
            if (strFacilityType.ToLower().Contains("etc"))
                sopQueryManager = new SopQueryManager(m_strUrl + "/api/etcSensor");
            
            if (!SendClearAlarm(sopQueryManager, nFacilityType, /*해제는 태그ID 필요 없음*/ -1, nSensorZoneHistoryID, 3))
            {
                strErrorMessage = "SendClearAlarm Fail";
                return false;
            }

            return true;
        }
        
        /// <summary>
        /// 알람해제
        /// </summary>
        /// <param name="sopQueryManager"></param>
        /// <param name="nSensorType"></param>
        /// <param name="nTagID"></param>
        /// <param name="nSensorZoneID"></param>
        /// <param name="nClearType">1:오작동,2:사용자복구,3:timeout</param>
        /// <returns></returns>
        public bool SendClearAlarm(SopQueryManager sopQueryManager, int nSensorType, int nTagID, int nSensorZoneID, int nClearType)
        {
            if (sopQueryManager == null)
                return false;

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(nSensorType);
            arrDatas.Add(nTagID);
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(false);

            string strURL = m_strUrl;
            
            if (nSensorType == (int)Facility.FacilityType.ETC)
            {
                if (strURL.EndsWith("/"))
                    strURL += "api/etcSensor";
                else 
                    strURL += "/api/etcSensor";
            }

            bool result = false;
            if (nClearType == 1)
                result = sopQueryManager.SendAlarmMalfunctionQuery(true, arrDatas, "POST", strURL);
            else if (nClearType == 2)
                result = sopQueryManager.SendAlarmUserResetQuery(true, arrDatas, "POST", strURL);
            else if (nClearType == 3)
                result = sopQueryManager.SendAlarmTimeoutQuery(arrDatas, "POST", strURL);
            return result;
        }

        public bool SendAlarm(SopQueryManager sopQueryManager, ArrayList arrDatas, out string strErrorMessage)
        {
            int nSensorType = (int)arrDatas[0];
            
            string strURL = m_strUrl;
            
            if (nSensorType == (int)Facility.FacilityType.ETC)
            {
                if (strURL.EndsWith("/"))
                    strURL += "api/etcSensor";
                else 
                    strURL += "/api/etcSensor";
            }
            
            return sopQueryManager.SendAlarmQuery(arrDatas, "POST", out strErrorMessage, strURL, null);
        }

    }
}