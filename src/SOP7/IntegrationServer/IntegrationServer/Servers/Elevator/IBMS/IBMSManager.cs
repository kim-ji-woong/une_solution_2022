using System;
using static dnsSopID.ID;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;

namespace IntegrationServer.Servers.Elevator.IBMS
{
    using Datas;
    using ViewModels.Elevator;

    class IBMSManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private bool m_runThread = false;

        private IDataManager m_dataManager = null;

        private IBMSProvider m_clientProvider = null;
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
                return ServerTypes.Elevator_IBMS;
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

        public IBMSManager(ServerManager serverManager, IDataManager dataManager, int nSiteID, int nServerSeqNo, string strServerIP, int nPort, string strServerAlias)
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
            m_clientProvider = new IBMSProvider(this);

            // 엘리베이터 상태 요청
            byte[] bytes = GetQueryBytes();

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
                                else
                                    WriteLog("Connection Fail " + m_strServerIP + ":" + m_nPort);
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

        // 엘리베이터 상태요청
        private byte[] GetQueryBytes()
        {
            byte[] bytes = new byte[33];

            bytes[0] = MessageParser.STX;
            bytes[1] = (byte)'1';
            bytes[2] = (byte)'2';
            bytes[3] = (byte)'7';
            bytes[4] = (byte)'.';
            bytes[5] = (byte)'0';
            bytes[6] = (byte)'0';
            bytes[7] = (byte)'0';
            bytes[8] = (byte)'.';
            bytes[9] = (byte)'0';
            bytes[10] = (byte)'0';
            bytes[11] = (byte)'0';
            bytes[12] = (byte)'.';
            bytes[13] = (byte)'0';
            bytes[14] = (byte)'0';
            bytes[15] = (byte)'1';
            bytes[16] = (byte)'!';
            bytes[17] = (byte)'7';
            bytes[18] = (byte)'0';
            bytes[19] = (byte)'0';
            bytes[20] = (byte)'0';
            bytes[21] = (byte)'!';
            bytes[22] = (byte)'E';
            bytes[23] = (byte)'l';
            bytes[24] = (byte)'e';
            bytes[25] = (byte)'v';
            bytes[26] = (byte)'a';
            bytes[27] = (byte)'t';
            bytes[28] = (byte)'o';
            bytes[29] = (byte)'r';
            bytes[30] = (byte)'!';
            bytes[31] = (byte)'1';
            bytes[32] = MessageParser.ETX;

            return bytes;
        }

        public Dictionary<int, Elevator> GetDefaultElevators(out int maxID, out int minID)
        {
            maxID = m_nMaxElevatorID;
            minID = m_nMinElevatorID;
            return m_dicElevators;
        }

        public Elevator GetElevator(string strNo)
        {
            int no;

            if (int.TryParse(strNo.Trim(), out no))
            {
                int elevatorID = m_nMinElevatorID + no - 1;

                if (elevatorID >= m_nMinElevatorID && elevatorID <= m_nMaxElevatorID)
                {
                    Elevator elevator;

                    if (m_dicElevators.TryGetValue(elevatorID, out elevator))
                        return elevator;
                }
            }

            return null;
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

        public void UpdateElevator(Elevator elevator)
        {
            string strErrorMessage;

            Dictionary<Elevator.Fields, object> dicSets = new Dictionary<Elevator.Fields, object>();

            dicSets[Elevator.Fields.Run] = elevator.Run;
            dicSets[Elevator.Fields.Direction] = elevator.Direction;
            dicSets[Elevator.Fields.Door] = elevator.Door;
            dicSets[Elevator.Fields.Floor] = elevator.Floor;

            string strCondition = string.Format("{0} = {1}", Elevator.Fields.ID, elevator.ID);

            if (m_dataManager.GetUpdate().Update<Elevator, Elevator.Fields>(dicSets, strCondition, out strErrorMessage) == false)
            {
                WriteLog(strErrorMessage, LogTypes.Error);
            }
        }
    }
}
