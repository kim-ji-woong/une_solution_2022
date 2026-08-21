using System;
using dnsTcpLib2;
using System.Net.Sockets;
using System.Collections.Generic;
using System.Threading;

namespace ClientTest
{
    abstract class ClientProvider : ClientServiceProvider
    {
        // Event Log만 남길 것인가?
        protected bool m_onlyEventLog = false;
        protected ModbusManager m_parentManager = null;
        protected byte m_functionCode = 0x00;
        protected ushort m_transID = 0;

        private bool m_runThread = false;

        // Key : Transaction ID
        // Value : Start Address(상위 2Byte), Request Length(하위 2Byte)
        private Dictionary<int, int> m_dicStartAddress = new Dictionary<int, int>();

        // requestLength : 한번에 몇개의 센서 데이터를 읽을 것인가?
        public ClientProvider(ModbusManager mgr)
        {
            m_parentManager = mgr;
            this.LengthAdd = false;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        protected abstract void SendRequest();
        protected abstract bool OnReceive(byte[] bytes, byte fc, int dataLength);

        public override void OnDropConnection()
        {
        }

        public override void OnReceiveData()
        {
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
                byte fc = data[7];          // Function Code
                int dataLength = data[8];   // Byte Count >> Data를 구성하는 Byte Count

                OnReceive(data, fc, dataLength);
            }
            catch (Exception e)
            {
                Logger.Instance.Write(Logger.LogTypes.Error, "ClientProvider OnReceiveData() : " + e.Message);
            }
        }

        public static ClientProvider MakeInstance(int functionCode, ModbusManager mgr)
        {
            if (functionCode == 0x01)
                return new ReadCoilProvider(mgr);
            else if (functionCode == 0x03)
                return new ReadHoldingRegisterProvider(mgr);
            else if (functionCode == 0x04)
                return new ReadInputRegisterProvider(mgr);

            return null;
        }

        public void Start()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            Thread connectionThread = new Thread(new ThreadStart(ConnectionThread));
            connectionThread.Start();

            Thread requestThread = new Thread(new ThreadStart(RequestThread));
            requestThread.Start();
        }

        public void Stop()
        {
            m_runThread = false;
            this.Close();
        }

        private void ConnectionThread()
        {
            while (m_runThread)
            {
                try
                {
                    if (!this.IsConnected)
                    {
                        lock (this)
                        {
                            if (m_parentManager != null && m_parentManager.Port > 0 && m_parentManager.ServerIP != null && m_parentManager.ServerIP != "")
                            {
                                this.Connect(m_parentManager.ServerIP, m_parentManager.Port);

                                if (this.IsConnected)
                                {
                                    // 연결 성공
                                    Logger.Instance.Write(Logger.LogTypes.Info, "ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected);
                                }
                                else
                                { 
                                    // 연결 실패
                                    Logger.Instance.Write(Logger.LogTypes.Info, "ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected);
                                }
                            }
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write(Logger.LogTypes.Error, "ConnectionThread() : " + e.Message);
                }
            }
        }

        private void RequestThread()
        {
            while (m_runThread)
            {
                try
                {
                    SendRequest();
                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write(Logger.LogTypes.Error, "RequestThread() : " + e.Message);
                }
            }
        }

        protected short GetStartAddress(byte[] bytes, out ushort requestLength)
        {
            requestLength = 0;
            int transactionID = GetTransactionID(bytes);

            int value;
            short startAddr;

            if (m_dicStartAddress.TryGetValue(transactionID, out value))
            {
                // 사용이 끝난 시작주소는 메모리에서 삭제한다.
                m_dicStartAddress.Remove(transactionID);

                startAddr = (short)(value >> 16);
                requestLength = (ushort)(value & 0xffff);
                return startAddr;
            }

            return -1;
        }

        protected int GetTransactionID(byte[] bytes)
        {
            // Big Endian을 Little Endian으로 바꾼다.
            byte[] datas = new byte[2] { bytes[1], bytes[0] };
            return BitConverter.ToUInt16(datas);
        }

        private void SetTransaction(ushort transID, ushort startAddr, ushort length)
        {
            int value = (((int)startAddr) << 16) | ((int)length);
            m_dicStartAddress[(int)transID] = value;
        }

        protected byte[] MakeRequestMsg(byte functionCode, int nSlaveID, ushort transID, ushort startAddr, ushort length)
        {
            byte[] arrSlaveID = BitConverter.GetBytes(nSlaveID);
            byte slaveID = arrSlaveID[0];

            byte[] arrTransID = BitConverter.GetBytes(transID);
            byte[] arrStartAddr = BitConverter.GetBytes(startAddr);
            byte[] arrLength = BitConverter.GetBytes(length);

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

            data[7] = functionCode; // Function code

            //data[8] = 0x00;         // 읽어올 주소
            //data[9] = 0x00;         // 읽어올 주소 
            Array.Copy(arrStartAddr, 0, data, 8, arrStartAddr.Length);

            //data[10] = 0x00;      // 읽어올 갯수
            //data[11] = 0x06;      // 읽어올 갯수
            Array.Copy(arrLength, 0, data, 10, arrLength.Length);

            SetTransaction(transID, startAddr, length);
            return data;
        }

        protected void SendBytes(byte[] bytes)
        {
            try
            {
                if (!this.IsClientDisposed && this.IsConnected)
                {
                    this.LengthAdd = false;
                    int nResult = this.Send(bytes, 0, bytes.Length);

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
                            m_parentManager.WriteBinaryLog(bytes, 0, bytes.Length, "[Send]");
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write(Logger.LogTypes.Error, "SendBytes() : " + e.Message);
            }
        }
    }
}
