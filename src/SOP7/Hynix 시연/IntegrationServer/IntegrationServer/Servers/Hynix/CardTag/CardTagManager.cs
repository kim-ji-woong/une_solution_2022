using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using Nipa.Model.Sdms.Sensor;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Hynix.CardTag
{
    public class CardTagManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Hynix_CardTag; } }

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

        private SopQueryManager_Hynix m_sopServerManager_Hynix = null; // SOPWebServer 통신

        public CardTagManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerAlias, string strSOPWebServerURL)
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
                    // .TODO: 현장에서는 데이터 읽는 부분을 추가하여 데이터를 읽고 우리 DB 쌓고 SOPServer 전달 해야한다.

                    int nCardID = 0;
                    int nCardReaderID = 0;
                    int nType = 1;
                    bool isApprove = true;

                    DateTime time;



                    // .TODO: 조회 부분 추가 필요 >> 조회 갯수에 따른 반복문 구성 필요
                    {
                        // 테스트
                        nCardID = 1;
                        nCardReaderID = 1;
                        time = DateTime.Now;
                        nType = 1;
                        isApprove = true;


                        string strSQL = $@"select 
                                    {SensorZone.TableName}.{SensorZone.Fields.ID} as SensorZoneID 
                                    from {ViewModels.Hynix.Card.TableName}, {SensorZone.TableName} 
                                    where {ViewModels.Hynix.Card.TableName}.{ViewModels.Hynix.Card.Fields.CardID} = {SensorZone.TableName}.{SensorZone.Fields.OrgSensorID} 
                                    and {ViewModels.Hynix.Card.TableName}.{ViewModels.Hynix.Card.Fields.CardID} = {nCardID} 
                                    and {SensorZone.TableName}.{SensorZone.Fields.SensorType} = {(int)AgentFactory.BLL.Facility.FacilityType.Event_CardTag} ";



                        dynamic dynamic = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                        if (dynamic == null)
                        {
                            throw new ApplicationException("join Card, SensorZone Error  : " + strErrorMessage);
                        }

                        int nSensorZoneID = dynamic.SensorZoneID;


                        // DB 저장
                        string strQuery = $@"Select ISNULL(MAX({ViewModels.Hynix.History.CardTag.Fields.CardTagHistoryID}), 0) as max from {ViewModels.Hynix.History.CardTag.TableName}";

                        dynamic maxResult = m_dataManager.GetSelect().SelectFirst(strQuery, out strErrorMessage);
                        if (maxResult == null)
                        {
                            throw new ApplicationException("select CardTagHistory Error  : " + strErrorMessage);
                        }

                        int nMaxID = maxResult.max;
                        nMaxID++;

                        ViewModels.Hynix.History.CardTag cardTag = new ViewModels.Hynix.History.CardTag();
                        cardTag.CardTagHistoryID = nMaxID;
                        cardTag.CardID = nCardID;
                        cardTag.CardReaderID = nCardReaderID;
                        cardTag.Time = time;
                        cardTag.Type = nType;
                        cardTag.IsApprove = isApprove;

                        if (m_dataManager.GetCreate().Insert<ViewModels.Hynix.History.CardTag>(cardTag, out strErrorMessage) == false)
                        {
                            throw new ApplicationException("Insert CardTagHistory Error  : " + strErrorMessage);
                        }

                        if (isApprove)
                        {
                            if (m_serverManager.SendSensorData_HynixTaggin(m_sopServerManager_Hynix, nSensorZoneID, time, nCardReaderID, null, out strErrorMessage))
                            {
                                WriteLog($"카드 태깅 (SendSensorData_HynixTaggin 성공, SensorZoneID: {nSensorZoneID}) CardReaderID: {nCardReaderID}", LogTypes.Info);

                            }
                            else
                            {
                                WriteLog($"카드 태깅 실패 (SendSensorData_HynixTaggin 실패, SensorZoneID: {nSensorZoneID}) CardReaderID: {nCardReaderID}, ErrorMessage: {strErrorMessage}", LogTypes.Error);
                            }
                        }


                        //Thread.Sleep(50);
                    }

                    Thread.Sleep(200);
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
}
