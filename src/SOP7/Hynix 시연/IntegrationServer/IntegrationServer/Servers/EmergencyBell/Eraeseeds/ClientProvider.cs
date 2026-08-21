using dnsTcpLib2;
using IntegrationServer.Datas;
using System;
using System.Net.Sockets;
using System.Threading;
using System.Collections.Generic;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.EmergencyBell.Eraeseeds
{
    class ClientProvider : ClientServiceProvider
    {
        private const byte DLE = 0x10;
        private const byte STX = 0x02;
        private const byte ETX = 0x03;

        private int m_nServerSeqNo = -1;
        private EraeseedsManager m_parentManager = null;

        private bool m_runThread = false;
        private bool m_isConnect = false;

        public ClientProvider(EraeseedsManager mgr, int nServerSeqNo)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;

            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public override void OnDropConnection()
        {
            m_parentManager.WriteLog("Connection closed");
        }

        public override void OnReceiveData()
        {
            try
            {
                byte[] data = this.ReceivedData;

                if (data == null || data.Length == 0)
                    return;

                m_parentManager.WriteBinaryLog(data, 0, data.Length, "[Received]");
                CheckBytes(data);
            }
            catch (Exception e)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.EmergencyBell_Eraeseeds, m_nServerSeqNo, "ContactProvider OnReceiveData() : " + e.Message);
            }
        }

        private void CheckBytes(byte[] bytes)
        {
            int len = bytes.Length;

            if (len < 4)
                return;

            if (bytes[0] == DLE && bytes[1] == STX)
            {
                byte cmd = bytes[2];
                int dataLen = (int)bytes[3];

                if (dataLen > 0 && dataLen + 4 + 2 <= len && bytes[dataLen + 4 + 1] == ETX)
                {
                    byte[] dataBytes = new byte[dataLen];
                    Buffer.BlockCopy(bytes, 4, dataBytes, 0, dataLen);
                    m_parentManager.ProcessData(cmd, dataBytes, dataLen);
                }
            }
        }

        public void Start()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            Thread t = new Thread(new ThreadStart(ConnectionThread));
            t.Start();

            /*m_RequestThread = new Thread(new ThreadStart(RequestThread));
            m_RequestThread.Start();*/
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
                            if (m_parentManager != null && m_parentManager.Port > 0
                                && m_parentManager.ServerIP != null && m_parentManager.ServerIP != "")
                            {
                                bool result = this.Connect(m_parentManager.ServerIP, m_parentManager.Port);

                                if (m_isConnect == false && result == true)
                                {   // 연결 성공
                                    m_isConnect = true;
                                    m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.EmergencyBell_Eraeseeds, m_nServerSeqNo, "ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected);

                                    string strError;
                                    if (UpdateServerStatus(m_isConnect, out strError) == false)
                                        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.EmergencyBell_Eraeseeds, m_nServerSeqNo, $"ConnectionThread() : (UpdateServerStatus Error {strError})");
                                }
                                else if (m_isConnect == true && result == false)
                                {   // 연결 실패
                                    m_isConnect = false;
                                    m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.EmergencyBell_Eraeseeds, m_nServerSeqNo, "ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected);

                                    string strError;
                                    if (UpdateServerStatus(m_isConnect, out strError) == false)
                                        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.EmergencyBell_Eraeseeds, m_nServerSeqNo, $"ConnectionThread() : (UpdateServerStatus Error {strError})");
                                }
                            }
                        }
                    }

                    Thread.Sleep(1000);

                    if (this.IsConnected)
                    {
                        // 전체장비 상태정보 조회
                        //SendQuery();
                    }
                }
                catch (Exception e)
                {
                    m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.EmergencyBell_Eraeseeds, m_nServerSeqNo, "ConnectionThread() : " + e.Message);
                }
            }
        }

        private void SendQuery()
        {
            byte[] bytes = new byte[16];

            bytes[0] = DLE;
            bytes[1] = STX;
            bytes[2] = Cep5200.EquipStatus;
            bytes[3] = 0x0B;
            bytes[4] = 0xFF;
            bytes[5] = 0x00;
            bytes[6] = 0x00;
            bytes[7] = 0x00;
            bytes[8] = 0x00;
            bytes[9] = 0x00;
            bytes[10] = 0x00;
            bytes[11] = 0x00;
            bytes[12] = 0x00;
            bytes[13] = 0x00;
            bytes[14] = 0x00;
            bytes[15] = ETX;

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
                    else if (nResult > 0)
                    {
                        this.m_parentManager.WriteBinaryLog(bytes, 0, bytes.Length, "[Send]");
                    }
                }
            }
            catch (Exception e)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.EmergencyBell_Eraeseeds, m_nServerSeqNo, "SendBytes() : " + e.Message);
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

            return m_parentManager.DataManager.GetUpdate().Update<ViewModels.Sdms.SensorServerInfo>(serverInfo, "ID=" + serverInfo.ID, out strError);
        }
    }
}
