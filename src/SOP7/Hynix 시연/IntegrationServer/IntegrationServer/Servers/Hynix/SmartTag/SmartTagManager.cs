using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using Nipa.Model.Sdms.Sensor;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Hynix.SmartTag
{
    public class SmartTagManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Hynix_SmartTag; } }

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

        private int m_nLastSmartTagHistoryID = 0;
        private DateTime m_dtStart = new DateTime();

        private SopQueryManager_Hynix m_sopServerManager_Hynix = null; // SOPWebServer 통신

        public SmartTagManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerAlias, string strSOPWebServerURL)
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

                    int nSmartTagID = 0;
                    int nSmartTagReaderID = 0;
                    DateTime time;


                    // .TODO: 조회 부분 추가 필요 >> 조회 갯수에 따른 반복문 구성 필요
                    {
                        // 테스트
                        nSmartTagID = 1;
                        nSmartTagReaderID = 1;
                        time = DateTime.Now;


                        string strSQL = $@"select 
                                    {SensorZone.TableName}.{SensorZone.Fields.ID} as SensorZoneID 
                                    from {ViewModels.Hynix.SmartTag.TableName}, {SensorZone.TableName} 
                                    where {ViewModels.Hynix.SmartTag.TableName}.{ViewModels.Hynix.SmartTag.Fields.SmartTagID} = {SensorZone.TableName}.{SensorZone.Fields.OrgSensorID} 
                                    and {ViewModels.Hynix.SmartTag.TableName}.{ViewModels.Hynix.SmartTag.Fields.SmartTagID} = {nSmartTagID} 
                                    and {SensorZone.TableName}.{SensorZone.Fields.SensorType} = {(int)AgentFactory.BLL.Facility.FacilityType.Event_SmartTag} ";

                        dynamic dynamic = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                        if (dynamic == null)
                        {
                            throw new ApplicationException("join SmartTag, SensorZone Error  : " + strErrorMessage);
                        }

                        //int nSmartTagHistoryID = item.SmartTagHistoryID;
                        //int nSmartTagReaderID = item.SmartTagReaderID;
                        //DateTime time = item.Time;
                        int nSensorZoneID = dynamic.SensorZoneID;


                        // 스마트 태그 태깅 추가
                        string strQuery = $@"Select ISNULL(MAX({ViewModels.Hynix.History.SmartTag.Fields.SmartTagHistoryID}), 0) as max from {ViewModels.Hynix.History.SmartTag.TableName}";

                        dynamic maxResult = m_dataManager.GetSelect().SelectFirst(strQuery, out strErrorMessage);
                        if (maxResult == null)
                        {
                            throw new ApplicationException("select SmartTagHistory Error  : " + strErrorMessage);
                        }

                        int nMaxID = maxResult.max;
                        nMaxID++;

                        ViewModels.Hynix.History.SmartTag smartTagHistory = new ViewModels.Hynix.History.SmartTag();
                        smartTagHistory.SmartTagHistoryID = nMaxID;
                        smartTagHistory.SmartTagID = nSmartTagID;
                        smartTagHistory.SmartTagReaderID = nSmartTagReaderID;
                        smartTagHistory.Time = time;

                        if (m_dataManager.GetCreate().Insert<ViewModels.Hynix.History.SmartTag>(smartTagHistory, out strErrorMessage) == false)
                        {
                            throw new ApplicationException("Insert SmartTagHistory Error  : " + strErrorMessage);
                        }


                        if (m_serverManager.SendSensorData_HynixTaggin(m_sopServerManager_Hynix, nSensorZoneID, time, null, nSmartTagReaderID, out strErrorMessage))
                        {
                            WriteLog($"스마트태그 태깅 (SendSensorData_HynixTaggin 성공, SensorZoneID: {nSensorZoneID}) SmartTagReaderID: {nSmartTagReaderID}", LogTypes.Info);

                        }
                        else
                        {
                            WriteLog($"스마트태그 태깅 실패 (SendSensorData_HynixTaggin 실패, SensorZoneID: {nSensorZoneID}) SmartTagReaderID: {nSmartTagReaderID}, ErrorMessage: {strErrorMessage}", LogTypes.Error);
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
