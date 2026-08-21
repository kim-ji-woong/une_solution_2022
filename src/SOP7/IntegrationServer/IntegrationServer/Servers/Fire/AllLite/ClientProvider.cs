using dnsTcpLib2;
using IntegrationServer.Datas;
using System;
using System.Net.Sockets;
using System.Threading;
using System.Collections.Generic;
using static dnsSopID.ID;

namespace IntegrationServer.Servers.Fire.AllLite
{
    class ClientProvider : ClientServiceProvider
    {
        private int m_nServerSeqNo = -1;

        private UInt16 m_nTransID = 1;

        private AllLiteManager m_parentManager = null;

        private bool m_runThread = false;
        private bool m_bIsConnect = false;

        Thread m_ConnectionThread = null;
        Thread m_RequestThread = null;

        private static byte FC_ReadDiscrete = 0x02;
        private static byte FC_ReadHoldingRegisger = 0x03;
        private static byte FC_ReadRegister = 0x04;

        public const int RegisterLength = 2;
        // 한번에 몇개의 센서 데이터를 읽을 것인가?
        public static UInt16 RequestLength = 100;

        // Key : Transaction ID
        // Value : Start Address
        private Dictionary<int, int> m_dicStartAddress = new Dictionary<int, int>();

        // Event 발생시에만 로그를 남길 것인가?
        private bool m_onlyEventLog = true;
        private byte m_functionCode = 0x00;

        public ClientProvider(AllLiteManager mgr, int nServerSeqNo)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;

            m_functionCode = FC_ReadHoldingRegisger;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public override void OnDropConnection()
        {
            
        }

        public override void OnReceiveData()
        {
            string strErrorMessage = "";

            try
            {
                byte[] data = this.ReceivedData;

                if (data == null || data.Length < 10)
                    return;

                if (m_onlyEventLog == false)
                    m_parentManager.WriteBinaryLog(data, 0, data.Length, "[Received]");

                //data[0] = 0x00;           // Transaction ID
                //data[1] = 0x00;           // Transaction ID
                //data[2] = 0x00;           // TCP/IP 고정
                //data[3] = 0x00;           // TCP/IP 고정
                //data[4] = 0x00;           // 길이
                //data[5] = 0x04;           // 길이 >> SlaveID 부터 [SlaveID, FC, Byte Count, Data] 길이
                //data[6] = 0x01;           // Slave ID
                byte FC = data[7];          // Function Code
                int nDataLeng = data[8];    // Byte Count >> Data를 구성하는 Byte Count

                byte[] arrData = new byte[nDataLeng];

                Array.Copy(data, 9, arrData, 0, nDataLeng);

                if (FC == m_functionCode && nDataLeng == RequestLength * RegisterLength)
                {
                    int startAddr = GetStartAddress(data);

                    if (startAddr >= 0)
                    {
                        // 신호 체크
                        m_parentManager.CheckAlarm(arrData, startAddr);
                    }
                }
            }
            catch (Exception e)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_AllLite, m_nServerSeqNo, "ContactProvider OnReceiveData() : " + e.Message);
            }
        }

        private int GetTransactionID(byte[] bytes)
        {
            // Big Endian을 Little Endian으로 바꾼다.
            byte[] datas = new byte[2] { bytes[1], bytes[0] };
            return BitConverter.ToUInt16(datas);
        }

        private int GetStartAddress(byte[] bytes)
        {
            int transactionID = GetTransactionID(bytes);

            int startAddr;

            if (m_dicStartAddress.TryGetValue(transactionID, out startAddr))
                return startAddr;

            return -1;
        }

        public void Start()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            m_ConnectionThread = new Thread(new ThreadStart(ConnectionThread));
            m_ConnectionThread.Start();

            m_RequestThread = new Thread(new ThreadStart(RequestThread));
            m_RequestThread.Start();
        }

        public void Stop()
        {
            m_runThread = false;
            this.Close();
        }

        private void ConnectionThread()
        {
            byte[] pingBytes = new byte[] { 0x00 };

            while (m_runThread)
            {
                try
                {
                    if (!this.IsConnected)
                    {
                        lock (this)
                        {
                            if (m_parentManager != null && m_parentManager.Port > 0
                                && m_parentManager.ServerIP != null && m_parentManager.ServerIP != "")
                            {
                                bool bResult = this.Connect(m_parentManager.ServerIP, m_parentManager.Port);

                                if (m_bIsConnect == false && bResult == true)
                                {   // 연결 성공
                                    m_bIsConnect = true;
                                    m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_AllLite, m_nServerSeqNo, "ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected);

                                    string strError;
                                    if (UpdateServerStatus(m_bIsConnect, out strError) == false)
                                        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_AllLite, m_nServerSeqNo, $"ConnectionThread() : (UpdateServerStatus Error {strError})");
                                }
                                else if (m_bIsConnect == true && bResult == false)
                                {   // 연결 실패
                                    m_bIsConnect = false;
                                    m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_AllLite, m_nServerSeqNo, "ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected);

                                    string strError;
                                    if (UpdateServerStatus(m_bIsConnect, out strError) == false)
                                        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_AllLite, m_nServerSeqNo, $"ConnectionThread() : (UpdateServerStatus Error {strError})");
                                }
                            }
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_AllLite, m_nServerSeqNo, "ConnectionThread() : " + e.Message);
                }
            }
        }

        private bool UpdateServerStatus(bool bStatus, out string strError)
        {
            ViewModels.Sdms.SensorServerInfo serverInfo = new ViewModels.Sdms.SensorServerInfo()
            {
                ID = m_nServerSeqNo,
                ServerType = (int)m_parentManager.ServerType,
                Place = m_parentManager.ServerAlias,
                IP = m_parentManager.ServerIP,
                Port = m_parentManager.Port,
                Status = bStatus,
                SOPWebServerURL = m_parentManager.SOPWebServerURL,
                bUse = m_parentManager.Use,
                SiteID = m_parentManager.SiteID
            };

            bool bResult = m_parentManager.DataManager.GetUpdate().Update<ViewModels.Sdms.SensorServerInfo>(serverInfo, "ID=" + serverInfo.ID, out strError);

            return bResult;
        }

        private void RequestThread()
        {
            while (m_runThread)
            {
                try
                {
                    if (this.IsConnected)
                    {
                        UInt16 nStartAddr = 999;                // 입력포트 주소
                        UInt16 nLength = RequestLength;         // 데이터 읽을 갯수
                        int nSlaveID = 1;

                        do
                        {
                            nStartAddr = (UInt16)m_parentManager.GetStartAddress();

                            if (nStartAddr < 0)
                                break;

                            byte[] arrData = MakeRequestMsg(m_functionCode, nSlaveID, m_nTransID, nStartAddr, nLength);
                            SendBytes(arrData);

                            m_dicStartAddress[m_nTransID] = nStartAddr;
                            m_nTransID++;

                            // 전체 센서들에 대해서 모두 Query를 해야하기 때문에 0.1초마다 질의를 한다.
                            Thread.Sleep(100);
                        }
                        while (true);
                    }

                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_AllLite, m_nServerSeqNo, "RequestThread() : " + e.Message);
                }
            }
        }

        public void SendBytes(byte[] CmdBuff)
        {
            try
            {
                if (!this.IsClientDisposed && this.IsConnected)
                {
                    this.LengthAdd = false;
                    int nResult = this.Send(CmdBuff, 0, CmdBuff.Length);

                    if (nResult < 0)
                    {
                        lock (this)
                        {
                            if (this.IsConnected)
                                this.Close();

                            if (this.Client.Client != null)
                            {
                                if (this.Client.Connected)
                                    this.Client.Close();
                            }
                        }
                    }
                    else
                    {
                        if (m_onlyEventLog == false)
                            m_parentManager.WriteBinaryLog(CmdBuff, 0, CmdBuff.Length, "[Send]");
                    }
                }
            }
            catch (Exception e)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_AllLite, m_nServerSeqNo, "SendBytes() : " + e.Message);
            }
        }

        public static byte[] MakeRequestMsg(byte code, int nSlaveID, UInt16 nTransID, UInt16 nStartAddr, UInt16 nLength)
        {
            byte[] arrSlaveID = BitConverter.GetBytes(nSlaveID);
            byte slaveID = arrSlaveID[0];

            byte[] arrTransID = BitConverter.GetBytes(nTransID);
            byte[] arrStartAddr = BitConverter.GetBytes(nStartAddr);
            byte[] arrLength = BitConverter.GetBytes(nLength);

            Array.Reverse(arrTransID);
            Array.Reverse(arrStartAddr);
            Array.Reverse(arrLength);


            byte[] data = new byte[12];

            //data[0] = 0x00;       // Transaction ID
            //data[1] = 0x00;       // Transaction ID
            Array.Copy(arrTransID, 0, data, 0, arrTransID.Length);

            data[2] = 0x00;         // TCP/IP 고정
            data[3] = 0x00;         // TCP/IP 고정

            data[4] = 0x00;         // 길이
            data[5] = 0x06;         // 길이

            data[6] = slaveID;      // Server ID

            data[7] = code;         // Function code

            //data[8] = 0x00;         // 읽어올 주소
            //data[9] = 0x00;         // 읽어올 주소 
            Array.Copy(arrStartAddr, 0, data, 8, arrStartAddr.Length);

            //data[10] = 0x00;      // 읽어올 갯수
            //data[11] = 0x06;      // 읽어올 갯수
            Array.Copy(arrLength, 0, data, 10, arrLength.Length);

            return data;
        }
    }
}
