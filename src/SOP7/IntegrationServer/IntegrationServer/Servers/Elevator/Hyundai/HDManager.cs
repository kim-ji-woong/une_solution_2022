using System;
using static dnsSopID.ID;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;

namespace IntegrationServer.Servers.Elevator.Hyundai
{
    using Datas;
    using ViewModels.Elevator;

    class HDManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private bool m_runThread = false;
        
        private IDataManager m_dataManager = null;

        private HDProvider m_clientProvider = null;
        private string m_strServerIP = "";
        private int m_nPort = 0;
        
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
                return ServerTypes.Elevator_HD;
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
        private int m_nSiteID = -1;

        private Dictionary<int, Elevator> m_dicElevators = null;
        private int m_nMaxElevatorID = -1, m_nMinElevatorID = 100;

        public string ServerAlias { get { return m_strServerAlias; } }

        public HDManager(ServerManager serverManager, IDataManager dataManager, int nSiteID, int nServerSeqNo, string strServerIP, int nPort, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_strServerIP = strServerIP;
            m_nPort = nPort;
            m_nSiteID = nSiteID;

            m_dataManager = dataManager.Clone();
            m_dicElevators = ReadDefaultElevator();
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            Thread t = new Thread(new ThreadStart(ConnectionThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void ConnectionThread()
        {
            if (m_runThread)
                return;

            m_runThread = true;
            m_clientProvider = new HDProvider(this);

            // 엘리베이터 상태 요청
            byte[] bytes = new byte[7] { (byte)'S', (byte)'T', (byte)'X', (byte)'R', (byte)'E', (byte)'T', (byte)'X' };

            while (m_runThread)
            {
                try
                {
                    if (m_clientProvider.IsConnected)
                    {
                        // 10초 이상 아무 신호를 못받으면 접속이 끊어진 것으로 간주한다.
                        if (m_clientProvider.PingCount > 10)
                        {
                            lock (m_clientProvider)
                            {
                                m_clientProvider.Close();
                            }
                        }
                        else
                            m_clientProvider.PingCount++;

                        if (m_clientProvider.IsConnected)
                        {
                            m_clientProvider.SendData(bytes, 0, bytes.Length);
                        }
                    }

                    if (!m_clientProvider.IsConnected)
                    {
                        if (m_nPort > 0)
                        {
                            lock (m_clientProvider)
                            {
                                if (m_clientProvider.Connect(m_strServerIP, m_nPort))
                                {
                                    m_clientProvider.PingCount = 0;
                                    WriteLog("[Connection Info] " + m_strServerIP + ":" + m_nPort + " / " + m_clientProvider.IsConnected);
                                }
                            }
                        }
                    }

                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    WriteLog("[ERROR] ConnectionThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] ConnectionThread() : " + e.Message);
                }
            }
        }

        public Dictionary<int, Elevator> GetDefaultElevators(out int maxID, out int minID)
        {
            maxID = m_nMaxElevatorID;
            minID = m_nMinElevatorID;
            return m_dicElevators;
        }

        // 설치되어 있는 Elevator들의 재원을 얻어온다.
        private Dictionary<int, Elevator> ReadDefaultElevator()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Elevator.Fields.SiteID, m_nSiteID);
            IEnumerable<Elevator> elevators = m_dataManager.GetSelect().Select<Elevator>(strCondition, out strErrorMessage);

            Dictionary<int, Elevator> dicElevators = new Dictionary<int, Elevator>();
            int min = 100, max = -1;

            if (elevators != null)
            {
                foreach (Elevator elevator in elevators)
                {
                    dicElevators[elevator.ID] = elevator;

                    if (max < elevator.ID)
                        max = elevator.ID;
                    if (min > elevator.ID)
                        min = elevator.ID;
                }
            }

            m_nMaxElevatorID = max;
            m_nMinElevatorID = min;
            return dicElevators;
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        public void UpdateElevators(List<Elevator> elevators)
        {
            string strErrorMessage;

            Dictionary<Elevator.Fields, object> dicSets = new Dictionary<Elevator.Fields, object>();

            foreach (Elevator elevator in elevators)
            {
                dicSets[Elevator.Fields.Run] = elevator.Run;
                dicSets[Elevator.Fields.Direction] = elevator.Direction;
                dicSets[Elevator.Fields.Door] = elevator.Door;
                dicSets[Elevator.Fields.Floor] = elevator.Floor;

                string strCondition = string.Format("{0} = {1}", Elevator.Fields.ID, elevator.ID);

                if (m_dataManager.GetUpdate().Update<Elevator, Elevator.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                {
                    WriteLog(strErrorMessage, LogTypes.Error);
                    break;
                }
            }

            //if (m_dataManager.GetUpdate().Update<Elevator>(elevators, out strErrorMessage) == false)
            //    WriteLog(strErrorMessage, LogTypes.Error);
        }
    }
}
