using System;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;

namespace IntegrationServer.Servers.ParkingGate.RS
{
    using Datas;
    using ViewModels.ParkingGate.RS;
    using static AgentFactory.BLL.ServerType;

    class ParkingGateManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private bool m_runThread = false;
        private string m_strBaseUrl = "";
        private IDataManager m_dataManager = null;
        private WebServiceManager m_webServiceManager = null;

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
                return ServerTypes.ParkingGate_rs;
            }
        }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public bool IsConnected
        {
            get
            {
                return m_runThread;
            }
        }

        public Logger Logger { get; set; }

        public ParkingGateManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerIP, int port, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_strBaseUrl = strServerIP.ToLower().StartsWith("http://") ? strServerIP : "http://" + strServerIP;
            m_strBaseUrl += ":" + port.ToString();

            m_dataManager = dataManager.Clone();
            m_webServiceManager = new WebServiceManager(m_strBaseUrl, m_dataManager, nSiteID);
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void MonitoringThread()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            while (m_runThread)
            {
                try
                {
                    // Key : ParkingGate ID
                    // Value : status
                    Dictionary<int, int> parkingGates = m_webServiceManager.ReadParkingGates();
                    //List<ParkingGate> parkingGates = m_webServiceManager.ReadParkingGates();

                    if (parkingGates != null)
                    {
                        UpdateParkingGates(parkingGates);
                    }

                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    WriteLog("[ERROR] MonitoringThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);
                }
            }
        }

        private void UpdateParkingGates(Dictionary<int, int> parkingGates)
        //private void UpdateParkingGates(List<ParkingGate> parkingGates)
        {
            string strErrorMessage;

            Dictionary<ParkingGate.Fields, object> dicSets = new Dictionary<ParkingGate.Fields, object>();

            foreach (KeyValuePair<int, int> pair in parkingGates)
            {
                dicSets[ParkingGate.Fields.Status] = pair.Value;
                string strCondition = string.Format("{0} = {1}", ParkingGate.Fields.ID, pair.Key);

                if (m_dataManager.GetUpdate().Update<ParkingGate, ParkingGate.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateParkingGates Error : " + strErrorMessage);
                }
                else
                    m_webServiceManager.UpdateParkingGateStatus(pair.Key, pair.Value);
            }
            
            /*if (m_dataManager.GetUpdate().Update<ParkingGate>(parkingGates, out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("UpdateParkingGates Error : " + strErrorMessage);
            }*/
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
