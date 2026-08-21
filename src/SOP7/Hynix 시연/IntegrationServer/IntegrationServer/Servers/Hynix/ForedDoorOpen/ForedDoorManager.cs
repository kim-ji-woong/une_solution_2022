using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using IntegrationServer.ViewModels.Hynix.History;
using Nipa.Model.Sdms.Sensor;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Hynix.ForedDoorOpen
{
    public class ForedDoorManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Hynix_ForedDoorOpen; } }

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
        private DateTime m_dtStart = new DateTime();

        private List<ForedDoorOpenData> m_doorOpenDatas = new List<ForedDoorOpenData>();

        private SopQueryManager_Hynix m_sopServerManager_Hynix = null; // SOPWebServer 통신

        public ForedDoorManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerAlias, string strSOPWebServerURL)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_sopServerManager_Hynix = new SopQueryManager_Hynix(strSOPWebServerURL);

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
                    int nCardReaderID = 0;
                    DateTime time;

                    // .TODO: 알람 레벨 체크 필요
                    int nAlarmLevel = 2;


                    // .TODO: CardReaderID time 조회 부분 추가 필요


                    // .TODO: 조회 부분 추가 필요 >> 아래 코드는 반복문 안으로 구성되야 함
                    {
                        // .TODO: 테스트 용도
                        nCardReaderID = 1;
                        time = m_dtStart;
                        nAlarmLevel = 2;


                        // .TODO: 현장 데이터를 받아서 해당 SensorZone, TagInfo 조회를 하여 알람 송신
                        string strConditions;

                        string strSQL = $@"select 
                                    {SensorZone.TableName}.{SensorZone.Fields.ID} as SensorZoneID, {TagInfo.TableName}.{TagInfo.Fields.ID} as TagInfoID 
                                    from {SensorZone.TableName}, {TagInfo.TableName}
                                    where {SensorZone.TableName}.{SensorZone.Fields.OrgSensorID} = {nCardReaderID}
                                    and {SensorZone.TableName}.{SensorZone.Fields.SensorType} = {(int)AgentFactory.BLL.Facility.FacilityType.Event_CardReader} 
                                    and {SensorZone.TableName}.{SensorZone.Fields.ID} = {TagInfo.TableName}.{TagInfo.Fields.SensorZoneID}";



                        dynamic dynamic = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                        if (dynamic == null)
                        {
                            throw new ApplicationException("join SensorZone, TagInfo Error  : " + strErrorMessage);
                        }

                        int nSensorZoneID = dynamic.SensorZoneID;
                        int nTagInfoID = dynamic.TagInfoID;
                        int nSensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_ForcedDoorOpen;

                        ForedDoorOpenData data = m_doorOpenDatas.Find(x => x.CardReaderID == nCardReaderID && x.Time == time);
                        if (data == null)
                        {
                            if (m_serverManager.SendSensorData_Hynix(m_sopServerManager_Hynix, nSensorType, nTagInfoID, nSensorZoneID, true, nAlarmLevel, time))
                            {
                                WriteLog($"강제 문열림 알람 (SendSensorData_Hynix 성공, Tag ID: {nTagInfoID}, SensorZoneID: {nSensorZoneID})", LogTypes.Info);

                                data = new ForedDoorOpenData();
                                data.CardReaderID = nCardReaderID;
                                data.Time = time;

                                m_doorOpenDatas.Add(data);
                            }
                            else
                            {
                                WriteLog($"강제 문열림 알람 송신 실패 (SendSensorData_Hynix 실패, Tag ID: {nTagInfoID}, SensorZoneID: {nSensorZoneID})", LogTypes.Error);
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
    /// 강제 문열림 알람 매칭용 데이터
    /// </summary>
    public class ForedDoorOpenData
    {
        public int CardReaderID { get; set; }
        public DateTime Time { get; set; }
    }
}
