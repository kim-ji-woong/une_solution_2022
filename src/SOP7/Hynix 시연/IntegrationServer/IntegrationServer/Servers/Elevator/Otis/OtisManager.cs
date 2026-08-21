using System;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;

namespace IntegrationServer.Servers.Elevator.Otis
{
    using Datas;
    using ViewModels.Elevator;
    using static AgentFactory.BLL.ServerType;

    class OtisManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private bool m_runThread = false;

        private IDataManager m_dataManager = null;

        private OtisProvider m_clientProvider = null;
        private MessageParser m_messageParser = null;

        private string m_strServerIP = "";
        private int m_nPort = 0;

        private ushort m_nTransactionID = 0;
        private byte m_functionCode = 0x03;

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
                return ServerTypes.Elevator_OTIS;
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

        // Key : Elevator ID
        private Dictionary<int, Elevator> m_dicElevators = null;
        // Key : Elevator Group ID
        private Dictionary<int, List<Elevator>> m_dicElevatorGroups = null;

        public string ServerAlias { get { return m_strServerAlias; } }

        public OtisManager(ServerManager serverManager, IDataManager dataManager, int nSiteID, int nServerSeqNo, string strServerIP, int nPort, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_strServerIP = strServerIP;
            m_nPort = nPort;
            m_nSiteID = nSiteID;

            m_messageParser = new MessageParser(this);

            m_dataManager = dataManager.Clone();
            m_dicElevators = ReadDefaultElevator();
            SetElevatorGroups();
        }

        private void SetElevatorGroups()
        {
            Dictionary<int, List<Elevator>> dicElevatorGroups = new Dictionary<int, List<Elevator>>();
            List<Elevator> elevatorGroup = null;

            foreach (KeyValuePair<int, Elevator> pair in m_dicElevators)
            {
                Elevator elevator = pair.Value;

                if (elevator.GroupNo == null)
                    continue;

                if (dicElevatorGroups.TryGetValue((int)elevator.GroupNo, out elevatorGroup) == false)
                {
                    elevatorGroup = new List<Elevator>();
                    dicElevatorGroups[(int)elevator.GroupNo] = elevatorGroup;
                }

                elevatorGroup.Add(elevator);
            }

            foreach (KeyValuePair<int, List<Elevator>> pair in dicElevatorGroups)
            {
                pair.Value.Sort(CompareElevator);
            }

            m_dicElevatorGroups = dicElevatorGroups;
        }

        private int CompareElevator(Elevator elevator1, Elevator elevator2)
        {
            if (elevator1.ID < elevator2.ID)
                return -1;
            else if (elevator1.ID > elevator2.ID)
                return 1;

            return 0;
        }

        // 설치되어 있는 Elevator들의 재원을 얻어온다.
        private Dictionary<int, Elevator> ReadDefaultElevator()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Elevator.Fields.SiteID, m_nSiteID);
            IEnumerable<Elevator> elevators = m_dataManager.GetSelect().Select<Elevator>(strCondition, out strErrorMessage);

            Dictionary<int, Elevator> dicElevators = new Dictionary<int, Elevator>();
            
            if (elevators != null)
            {
                foreach (Elevator elevator in elevators)
                {
                    dicElevators[elevator.ID] = elevator;
                }
            }

            return dicElevators;
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
            m_clientProvider = new OtisProvider(this, m_messageParser);

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
                            RequestData();
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

        private void RequestData()
        {
            int count = 12;

            byte[] bytes = new byte[count];
            bytes[2] = 0x00;
            bytes[3] = 0x00;
            bytes[4] = 0x00;
            bytes[5] = 0x06;
            bytes[7] = m_functionCode;

            //ushort wordCount = 31;
            //SetBytes(bytes, 10, wordCount);

            foreach (KeyValuePair<int, List<Elevator>> pair in m_dicElevatorGroups)
            {
                int groupNo = pair.Key; // GroupNo => Slave ID
                int len = pair.Value.Count;

                bytes[6] = (byte)groupNo;
                ushort prevID = m_nTransactionID;

                for (int i=0;i<len;i++)
                {
                    Elevator elevator = pair.Value[i];

                    // 전체 층 갯수
                    ushort wordCount = (ushort)(elevator.MaxFloor - elevator.MinFloor + 1);
                    SetBytes(bytes, 10, wordCount);

                    int startAddr = i * 4700;
                    ushort nTransactionID = m_nTransactionID;//m_nTransactionID++;

                    SetBytes(bytes, 0, nTransactionID);
                    SetBytes(bytes, 8, (ushort)startAddr);
                    m_messageParser.SetTransaction(nTransactionID, startAddr);

                    if (m_clientProvider.SendData(bytes, 0, count) > 0)
                        m_clientProvider.PingCount = 0;

                    for (int j = 0; j < 10; j++)
                    {
                        Thread.Sleep(100);

                        // 먼저 보낸 Request에 대한 응답을 받을때까지 기다린다.(최대 1초간)
                        if (prevID == m_nTransactionID)
                            continue;
                        else
                        {
                            prevID = m_nTransactionID;
                            break;
                        }
                    }
                }
            }
        }

        private void SetBytes(byte[] bytes, int index, ushort data)
        {
            byte[] bDatas = BitConverter.GetBytes(data);
            Array.Reverse(bDatas);

            bytes[index] = bDatas[0];
            bytes[index + 1] = bDatas[1];
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        public void UpdateElevator(Elevator elevator, ushort nTransactionID)
        {
            string strErrorMessage;

            Dictionary<Elevator.Fields, object> dicSets = new Dictionary<Elevator.Fields, object>();
            dicSets[Elevator.Fields.Direction] = elevator.Direction;
            dicSets[Elevator.Fields.Door] = elevator.Door;
            dicSets[Elevator.Fields.Floor] = elevator.Floor;

            string strCondition = string.Format("{0} = {1}", Elevator.Fields.ID, elevator.ID);

            if (m_dataManager.GetUpdate().Update<Elevator, Elevator.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                WriteLog(strErrorMessage, LogTypes.Error);
            else
            {
                Elevator _elevator;

                if (m_dicElevators.TryGetValue(elevator.ID, out _elevator))
                {
                    _elevator.Floor = elevator.Floor;
                    _elevator.Door = elevator.Door;
                    _elevator.Direction = elevator.Direction;
                }
            }

            m_nTransactionID = ++nTransactionID;
        }

        public Elevator GetElevator(int groupNo, int index)
        {
            List<Elevator> elevators = null;

            if (m_dicElevatorGroups.TryGetValue(groupNo, out elevators))
            {
                if (elevators.Count > index && index >= 0)
                {
                    return elevators[index];
                }
            }

            return null;
        }
    }
}
