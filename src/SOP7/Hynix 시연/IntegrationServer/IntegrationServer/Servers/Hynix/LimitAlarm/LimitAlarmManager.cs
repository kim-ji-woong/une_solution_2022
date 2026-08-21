using AgentFactory.BLL;
using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using Nipa.Model.Sdms.Sensor;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Hynix.LimitAlarm
{
    public class LimitAlarmManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Hynix_LimitAlarm; } }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public bool IsConnected { get { return false; } }

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        private bool m_runThread = false;

        private IDataManager m_dataManager = null;
        private int m_nSiteID = -1;

        private int m_nLastCardTagHistoryID = 0;
        private DateTime m_dtStart = new DateTime();

        private SopQueryManager m_sopServerManager = null; // SOPWebServer 통신

        private Dictionary<int, int> m_dicAlarms = new Dictionary<int, int>();

        public LimitAlarmManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerAlias, string strSOPWebServerURL)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_sopServerManager = new SopQueryManager(strSOPWebServerURL);

            m_nSiteID = nSiteID;
            m_dataManager = dataManager;
        }

        public void Start()
        {
            m_dtStart = DateTime.Now;

            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void MonitoringThread(/*object args*/)
        {
            if (m_runThread)
                return;

            m_runThread = true;

            string strErrorMessage;

            while (m_runThread)
            {
                try
                {
                    // 지정된 타입 센서 불러오기
                    string strSQL = $@"select 
                                    {PSM.TableName}.{PSM.Fields.ID}, {PSM.TableName}.{PSM.Fields.CurrentData}, {PSM.TableName}.{PSM.Fields.LimitValue},
                                    {SensorZone.TableName}.{SensorZone.Fields.ID} as SensorZoneID, {TagInfo.TableName}.{TagInfo.Fields.ID} as TagInfoID
                                    from {PSM.TableName}, {SensorZone.TableName}, {TagInfo.TableName}
                                    where {PSM.TableName}.{PSM.Fields.ID} = {SensorZone.TableName}.{SensorZone.Fields.OrgSensorID} 
                                    and {SensorZone.TableName}.{SensorZone.Fields.SensorType} = {(int)Facility.FacilityType.PSM_SENSOR}
                                    and {SensorZone.TableName}.{SensorZone.Fields.ID} = {TagInfo.TableName}.{TagInfo.Fields.SensorZoneID} 
                                    and {PSM.TableName}.{PSM.Fields.MaterialType} IN ({(int)Facility.FacilityType.CL}, {(int)Facility.FacilityType.VOC}, {(int)Facility.FacilityType.H2})";

                    IEnumerable<dynamic> psms = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);
                    if (psms == null)
                    {
                        throw new ApplicationException("PSM SensorZone TagInfo Join Error : " + strErrorMessage);
                    }

                    foreach (var psm in psms)
                    {
                        // LimitValue, CurrentData 불러오기

                        double? fSensorValue = psm.CurrentData;
                        if (fSensorValue == null)
                            continue;

                        string strStandards = psm.LimitValue;
                        if (strStandards == null || strStandards.Length == 0)
                            continue;

                        string[] arrStandards = strStandards.Split("|");
                        if (arrStandards.Length < 2)
                            continue;

                        string[] bStandards = arrStandards[0].Split(","); // 특징
                        string[] nStandards = arrStandards[1].Split(","); // 수치

                        int AlarmLevel = 0;

                        AlarmLevel = GetAlarmLevel(bStandards, nStandards, fSensorValue.Value);

                        bool isChange = false;

                        // 기존 알람 레벨과 비교
                        if (m_dicAlarms.ContainsKey(psm.ID) == false)
                        {
                            if (AlarmLevel > 0)
                                isChange = true;
                        }
                        else
                        {
                            int level = m_dicAlarms[psm.ID];

                            if (AlarmLevel != level)
                                isChange = true;
                        }

                        // 변화가 있다면 알람 송신 및 해제
                        if (isChange)
                        {
                            if (AlarmLevel == 0)
                            {   // 알람 해제
                                if (m_serverManager.SendSensorData(m_sopServerManager, (int)Facility.FacilityType.PSM_SENSOR, psm.TagInfoID, psm.SensorZoneID, false))
                                {
                                    WriteLog($"임계치 알람 해제 (SendSensorData 성공, Tag ID: {psm.TagInfoID}, SensorZoneID: {psm.SensorZoneID})", LogTypes.Info);

                                    // 알람 레벨 저장
                                    m_dicAlarms[psm.ID] = AlarmLevel;
                                }
                                else
                                {
                                    WriteLog($"임계치 알람 해제 실패 (SendSensorData 실패, Tag ID: {psm.TagInfoID}, SensorZoneID: {psm.SensorZoneID})", LogTypes.Error);
                                }
                            }
                            else
                            {   // 알람 송신
                                if (m_serverManager.SendSensorData(m_sopServerManager, (int)Facility.FacilityType.PSM_SENSOR, psm.TagInfoID, psm.SensorZoneID, true, AlarmLevel))
                                {
                                    WriteLog($"임계치 알람  (SendSensorData 성공, Tag ID: {psm.TagInfoID}, SensorZoneID: {psm.SensorZoneID})", LogTypes.Info);

                                    // 알람 레벨 저장
                                    m_dicAlarms[psm.ID] = AlarmLevel;
                                }
                                else
                                {
                                    WriteLog($"임계치 알람 실패 (SendSensorData 실패, Tag ID: {psm.TagInfoID}, SensorZoneID: {psm.SensorZoneID})", LogTypes.Error);
                                }
                            }

                            
                        }                                                
                    }
                }
                catch (Exception e)
                {
                    WriteLog("[ERROR] MonitoringThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);

                    Thread.Sleep(1000);
                }
            }
        }

        private int GetAlarmLevel(string[] bStandards, string[] standards, double value)
        {
            int level = 0;

            if (bStandards[0] == "False" && bStandards[1] == "False" && bStandards[2] == "False")
            {
                return -1;
            }

            for (int i = 0; i < standards.Length; i++)
            {
                float standard = Convert.ToSingle(standards[i]);

                if (value >= standard)
                    level += 1;
            }

            if (level > 0)
                level++;

            return level;
        }





        private void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }





    }
}
