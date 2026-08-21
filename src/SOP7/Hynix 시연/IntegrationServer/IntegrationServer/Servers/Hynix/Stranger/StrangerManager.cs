using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using IntegrationServer.ViewModels.Hynix;
using IntegrationServer.ViewModels.Sdms;
using Nipa.Model.Sdms.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Hynix.Stranger
{
    public class StrangerManager : IServer
    {
        private string URL_Stranger = "/SendEvent";
        private string URL_ADD = "/AddMovingPosition";

        private string SOPWebServerURL;

        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Hynix_Stranger; } }

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

        private int m_nLastEventHistroyID = 0;

        private SopQueryManager_Hynix m_sopServerManager_Hynix = null; // SOPWebServer 통신

        private DateTime m_dtStart;

        private List<StrangerData> m_strangerDatas = new List<StrangerData>();

        public StrangerManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerAlias, string strSOPWebServerURL)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_sopServerManager_Hynix = new SopQueryManager_Hynix(strSOPWebServerURL);
            SOPWebServerURL = strSOPWebServerURL;

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

            bool isAdd = false;

            while (m_runThread)
            {
                try
                {
                    int nTagInfoID = 0;
                    int nSensorZoneID = 0;
                    int nSensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger;
                    string strStrangerKey = null;      // 알람 구분 키

                    int? nCardID = null;

                    // .TODO: 조회 부분 추가 필요 >> 조회 갯수에 따른 반복문 구성 필요
                    {


                        // .TODO: 알람 구분용 키 부분 체크 필요
                        strStrangerKey = m_dtStart.ToString();

                        // .TODO: 알람 레벨 체크 필요
                        int nAlarmLevel = 2;

                        // .TODO: 알람 발생 시간 부분 체크 필요
                        DateTime time = DateTime.Now;


                        // .TODO: 경로 리스트 확인 필요
                        DateTime dtTemp = DateTime.Now.AddMinutes(-5);

                        ArrayList arrDatas2 = new ArrayList();
                        arrDatas2.Add(dtTemp);
                        arrDatas2.Add("1층 입실");
                        dtTemp = dtTemp.AddMinutes(1);
                        arrDatas2.Add(dtTemp);
                        arrDatas2.Add("1층 퇴실");
                        dtTemp = dtTemp.AddMinutes(1);
                        arrDatas2.Add(dtTemp);
                        arrDatas2.Add("2층 입실");
                        dtTemp = dtTemp.AddMinutes(1);
                        arrDatas2.Add(dtTemp);
                        arrDatas2.Add("2층 퇴실");


                        StrangerData stranger = m_strangerDatas.Find(x => x.StrangerKey == strStrangerKey);
                        if (stranger == null)
                        {   // 기존 알람이 조회되지 않는 경우

                            if (nCardID.HasValue)
                            {   // CardID 조회가 되는 경우
                                string strSQL = $@"select 
                                    {Card.TableName}.{Card.Fields.CardID}, {Card.TableName}.{Card.Fields.WorkerID}, {Card.TableName}.{Card.Fields.UniqueKey}, 
                                    {SensorZone.TableName}.{SensorZone.Fields.ID} as SensorZoneID, {TagInfo.TableName}.{TagInfo.Fields.ID} as TagInfoID 
                                    from {Card.TableName}, {SensorZone.TableName}, {TagInfo.TableName}
                                    where {Card.TableName}.{Card.Fields.CardID} = {SensorZone.TableName}.{SensorZone.Fields.OrgSensorID} 
                                    and {SensorZone.TableName}.{SensorZone.Fields.SensorType} = {(int)AgentFactory.BLL.Facility.FacilityType.Event_CardTag} 
                                    and {SensorZone.TableName}.{SensorZone.Fields.ID} = {TagInfo.TableName}.{TagInfo.Fields.SensorZoneID}
                                    and {Card.TableName}.{Card.Fields.CardID} = {nCardID.Value}";

                                IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);
                                if (dynamics == null)
                                {
                                    throw new ApplicationException("join Card, SensorZone, TagInfo Error : " + strErrorMessage);
                                }

                                foreach (var item in dynamics)
                                {
                                    nSensorZoneID = item.SensorZoneID;
                                    nTagInfoID = item.TagInfoID;
                                }

                            }
                            else
                            {   // CardID 조회 되지 않는 경우
                                // 현재 알람 조회
                                IEnumerable<CurrentAlarm> alarms = m_dataManager.GetSelect().Select<CurrentAlarm>(null, out strErrorMessage);
                                if (alarms == null)
                                {
                                    throw new ApplicationException("CurrentAlarm Select Error : " + strErrorMessage);
                                }

                                string strAlarmSensorZoneIDs = null;

                                foreach (var alarm in alarms)
                                {

                                    if (alarm.AlarmSensorZoneIDs != null && alarm.AlarmSensorZoneIDs.Length > 0)
                                    {
                                        if (strAlarmSensorZoneIDs == null)
                                            strAlarmSensorZoneIDs = alarm.AlarmSensorZoneIDs;
                                        else
                                            strAlarmSensorZoneIDs += "," + alarm.AlarmSensorZoneIDs;
                                    }
                                }

                                // OrgSensorID = NULL AND SensorType = Event_Stranger  사용하지 않는 SdmsSensorZone 조회 

                                string strConditions = null;

                                if (strAlarmSensorZoneIDs != null)
                                {
                                    strConditions = $"{SensorZone.Fields.OrgSensorID} IS NULL AND {SensorZone.Fields.SensorType} = {(int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger} AND {SensorZone.Fields.ID} NOT IN ({strAlarmSensorZoneIDs})";
                                }

                                SensorZone sz = m_dataManager.GetSelect().SelectFirst<SensorZone>(strConditions, out strErrorMessage);
                                if (sz == null)
                                {
                                    throw new ApplicationException("SensorZone SelectFirst Error : " + strErrorMessage);
                                }

                                strConditions = $"{TagInfo.TableName}.{TagInfo.Fields.SensorZoneID} = {sz.ID}";

                                TagInfo tagInfo = m_dataManager.GetSelect().SelectFirst<TagInfo>(strConditions, out strErrorMessage);
                                if (tagInfo == null)
                                {
                                    throw new ApplicationException("TagInfo SelectFirst Error : " + strErrorMessage);
                                }

                                nSensorZoneID = sz.ID;
                                nTagInfoID = tagInfo.ID;
                            }




                            if (m_serverManager.SendSensorData_Hynix(m_sopServerManager_Hynix, nSensorType, nTagInfoID, nSensorZoneID, true, nAlarmLevel, time, arrDatas2, SOPWebServerURL + URL_Stranger))
                            {
                                // SensorZoneHistoryID 조회 필요

                                //SensorZone
                                IEnumerable<CurrentAlarm> alarms = m_dataManager.GetSelect().Select<CurrentAlarm>(null, out strErrorMessage);
                                if (alarms == null)
                                {
                                    throw new ApplicationException("CurrentAlarm Select Error : " + strErrorMessage);
                                }

                                List<AlarmData> alarmDatas = new List<AlarmData>();
                                int nSensorZoneHistoryID = -1;

                                foreach (var alarm in alarms)
                                {
                                    if (alarm.AlarmSensorZoneIDs != null && alarm.AlarmSensorZoneIDs.Length > 0)
                                    {
                                        string strAlarmSensorZoneIDs = alarm.AlarmSensorZoneIDs;
                                        string[] arrSensorZoneIDs = strAlarmSensorZoneIDs.Split(",");

                                        for (int i = 0; i < arrSensorZoneIDs.Length; i++)
                                        {
                                            string strSensorZoneID = arrSensorZoneIDs[i];
                                            int nTempSensorZoneID = 0;
                                            if (int.TryParse(strSensorZoneID, out nTempSensorZoneID) == true && nTempSensorZoneID == nSensorZoneID)
                                            {
                                                nSensorZoneHistoryID = alarm.SensorZoneHistoryID;
                                                break;
                                            }
                                        }
                                    }

                                    if (nSensorZoneHistoryID > 0)
                                        break;
                                }


                                stranger = new StrangerData();
                                stranger.CardID = nCardID;
                                stranger.Time = time;
                                stranger.StrangerKey = strStrangerKey;
                                stranger.SensorZoneHistoryID = nSensorZoneHistoryID;
                                m_strangerDatas.Add(stranger);

                                WriteLog($"이상행위자 알람 (SendSensorData_Hynix 성공, Tag ID: {nTagInfoID}, SensorZoneID: {nSensorZoneID})", LogTypes.Info);
                            }
                            else
                            {
                                WriteLog($"이상행위자 알람 송신 실패 (SendSensorData_Hynix 실패, Tag ID: {nTagInfoID}, SensorZoneID: {nSensorZoneID})", LogTypes.Error);
                            }
                        }
                        else
                        {   // 기존 알람인 경우


                            // .TODO: 일회성 추가 동선
                            if (isAdd == true)
                                continue;

                            // .TODO: 추가 동선이 있는지 파악 필요
                            dtTemp = DateTime.Now;
                            string strPosition = "3층 입실";

                            if (m_serverManager.SendSensorData_HynixMovingPosition(m_sopServerManager_Hynix, stranger.SensorZoneHistoryID, dtTemp, strPosition, out strErrorMessage, SOPWebServerURL + URL_ADD))
                            {
                                WriteLog($"추가 동선 성공 (SendSensorData_Hynix 성공, Tag ID: {nTagInfoID}, SensorZoneID: {nSensorZoneID})", LogTypes.Info);

                                isAdd = true;
                            }
                            else
                            {
                                WriteLog($"추가 동선 실패 (SendSensorData_Hynix 실패, Tag ID: {nTagInfoID}, SensorZoneID: {nSensorZoneID}, ErrorMessage: {strErrorMessage})", LogTypes.Error);
                            }
                        }

                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    WriteLog("[ERROR] MonitoringThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);

                    Thread.Sleep(1000);
                }
            }
        }

        private void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }

    /// <summary>
    /// 알람 매칭용 데이터
    /// </summary>
    public class StrangerData
    {
        public int? CardID { get; set; }
        public DateTime Time { get; set; }
        public string StrangerKey { get; set; }
        public int SensorZoneHistoryID { get; set; }
    }

    public class AlarmData
    {
        public int SensorZoneHistoryID { get; set; }
        public List<int> SensorZoneIDs { get; set; }
    }
}
