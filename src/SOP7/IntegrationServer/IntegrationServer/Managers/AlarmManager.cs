using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Datas;
using IntegrationServer.Servers;
using IntegrationServer.ViewModels.Sdms;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using static dnsSopID.ID;

namespace IntegrationServer.Managers
{
    public class AlarmManager
    {
        private static AlarmManager m_instance = null;
        public static AlarmManager Instance { get { return m_instance; } }

        private ServerManager m_serverManager = null;
        private DataManager m_dataManager = null;
        
        private bool m_bRunThread = false;

        private Dictionary<int, AlarmInfo> m_dicCurrentAlarm = new Dictionary<int, AlarmInfo>();
        public Dictionary<int, AlarmInfo> DicCurrentAlarm
        {
            get { return m_dicCurrentAlarm; }
        }

        private string m_strUrl = "";

        public AlarmManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerFrontURL)
        {
            m_instance = this;
            m_serverManager = serverManager;
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
            string strSQL = $@"
                select SensorZoneHistoryID, SensorType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs
                  from SdmsAlarmCurrent ac";

            while (m_bRunThread)
            {
                DateTime dtNow = DateTime.Now;

                IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out string strError);
                if (dynamics == null)
                {
                    Logger.Instance.Write(LogTypes.Error, ServerTypes.None, -1, "LoadCurrentAlarm : " + strError);
                    return;
                }

                Dictionary<int, AlarmInfo> dicCurrentAlarm = new Dictionary<int, AlarmInfo>();

                foreach (var item in dynamics)
                {
                    int nSensorZoneHistoryID = item.SensorZoneHistoryID;
                    int nSensorType = item.SensorType;
                    DateTime dtTimeStamp = item.TimeStamp;
                    int nSopStatus = item.SopStatus;
                    int nAlarmDepth = item.AlarmDepth;
                    string strAlarmSensorZoneIDs = item.AlarmSensorZoneIDs;

                    if (dtTimeStamp < dtNow.AddDays(-1)) // 하루가 경과된 알람들은 종료처리한다
                    {
                        TimeoutAlarm(nSensorZoneHistoryID, dtNow);
                        continue;
                    }

                    if (nSensorZoneHistoryID <= 0 || nSensorType < 0 || dtTimeStamp == null || nAlarmDepth <= 0)
                        continue;

                    if (strAlarmSensorZoneIDs == null || strAlarmSensorZoneIDs.Length == 0)
                        continue;

                    string[] alarmSensorZoneIDs = strAlarmSensorZoneIDs.Split(',');
                    if (alarmSensorZoneIDs.Length == 0)
                        continue;

                    for (int j = 0; j < alarmSensorZoneIDs.Length; j++)
                    {
                        if (!int.TryParse(alarmSensorZoneIDs[j], out int nSensorZoneID))
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

                Thread.Sleep(1000);
            }
        }

        private void TimeoutAlarm(int nSensorZoneHistoryID, DateTime time)
        {
            if (m_strUrl == null || m_strUrl.Length == 0)
                return;

            //dynamic dy = m_dataManager.GetSelect().SelectFirst($"select isnull(max({Nipa.Model.Sdms.History.SensorReaction.Fields.ID})+1, 1) maxID from {Nipa.Model.Sdms.History.SensorReaction.TableName}", out string strErrMsg);
            //if (dy == null || dy.maxID == null)
            //    return;

            //Nipa.Model.Sdms.History.SensorReaction sr = new Nipa.Model.Sdms.History.SensorReaction();
            //sr.ID = dy.maxID;
            //sr.SensorZoneHistoryID = nSensorZoneHistoryID;
            //sr.ReactionType = (int)Nipa.Model.Sdms.History.SensorReaction.ReactionTypes.TIME_OUT;
            //sr.Time = time;
            //sr.Message = "알람발생후 만 하루가 경과하여 알람을 초기화합니다.";

            //m_dataManager.GetCreate().Insert<Nipa.Model.Sdms.History.SensorReaction>(sr, out strErrMsg);
            //m_dataManager.GetDelete().Delete<CurrentAlarm>($"{CurrentAlarm.Fields.SensorZoneHistoryID}={nSensorZoneHistoryID}", out strErrMsg);

            Nipa.Model.Sdms.History.SensorZone sz = m_dataManager.GetSelect().SelectFirst<Nipa.Model.Sdms.History.SensorZone>($"{Nipa.Model.Sdms.History.SensorZone.Fields.ID}={nSensorZoneHistoryID}", out string strErrMsg);
            if (sz == null)
                return;

            Nipa.Model.Sdms.Sensor.FacilityType ft = m_dataManager.GetSelect().SelectFirst<Nipa.Model.Sdms.Sensor.FacilityType>($"{Nipa.Model.Sdms.Sensor.FacilityType.Fields.ID}={sz.SensorType}", out strErrMsg);
            if (ft == null)
                return;

            SopQueryManager queryManager = null;
            if (ft.LinkedTableName.ToLower().Contains("fire"))
                queryManager = new SopQueryManager(m_strUrl + "/api/fireSensor");
            else if (ft.LinkedTableName.ToLower().Contains("psm"))
                queryManager = new SopQueryManager(m_strUrl + "/api/psmSensor");
            else if (ft.LinkedTableName.ToLower().Contains("etc"))
                queryManager = new SopQueryManager(m_strUrl + "/api/etcSensor");

            if (ft.LinkedTableName.ToLower().Contains("psm"))
                m_serverManager.SendClearPsmAlarm(queryManager, sz.SensorZoneID); 
            else
                m_serverManager.SendClearAlarm(queryManager, sz.SensorType, -1 /*알람해제는 TagID 필요없음*/, sz.SensorZoneID, 3);
        }

        public static List<int> GetCurrentAlarmSensorZoneIDs(DataManager dataManager, out string strErrorMessage)
        {
            string strSQL = string.Format("Select {0} sensorZoneIDs from {1}", CurrentAlarm.Fields.AlarmSensorZoneIDs, CurrentAlarm.TableName);
            IEnumerable<dynamic> results = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return null;

            Dictionary<int, int> dicSensorZoneIDs = new Dictionary<int, int>();

            foreach (var item in results)
            {
                string strSensorZoneIDs = item.sensorZoneIDs;

                if (strSensorZoneIDs == null || strSensorZoneIDs.Length == 0)
                    continue;

                string[] tokens = strSensorZoneIDs.Split(',');

                int sensorZoneID;

                foreach (string strToken in tokens)
                {
                    if (int.TryParse(strToken.Trim(), out sensorZoneID))
                        dicSensorZoneIDs[sensorZoneID] = sensorZoneID;
                }
            }

            List<int> sensorZoneIDs = new List<int>();
            sensorZoneIDs.AddRange(dicSensorZoneIDs.Keys);
            return sensorZoneIDs;
        }
    }
}
