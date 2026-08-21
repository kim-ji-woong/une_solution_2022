using dnsTcpLib2;
using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace IntegrationServer.Servers.Fire.JTECH
{
    class ClientProvider : ClientServiceProvider
    {
        private static byte FC_ReadRegister = 0x04;
        private int m_nServerSeqNo = -1;
        private UInt16 m_nTransID = 0;        

        private bool m_runThread = false;

        Thread m_ConnectionThread = null;
        Thread m_RequestThread = null;

        JTECHManager m_parentManager = null;

        private static bool IsReverse = true;   // 빅엔디안, 리틀엔디안 여부에 따라 

        public static int RegisterLength = 2;
        //public static int RegisterBit = 8;        

        public static UInt16 ReqLengLine1_2 = 61;
        public static UInt16 ReqLengLine2_1 = 64;
        public static UInt16 ReqLengLine2_2 = 65;
        public static UInt16 ReqLengLine2_3 = 67;
        public static UInt16 ReqLengLine2_4 = 66;
        public static UInt16 ReqLengLine3_1 = 113;
        public static UInt16 ReqLengLine3_2 = 110;
        public static UInt16 ReqLengLine3_3 = 94;
        public static UInt16 ReqLengLine4_1 = 87;
        public static UInt16 ReqLengLine4_2 = 102;
        public static UInt16 ReqLengLine4_3 = 70;
        public static UInt16 ReqLengLine4_4 = 71;
        public static UInt16 ReqLengLine5_1 = 72;
        public static UInt16 ReqLengLine5_2 = 77;
        public static UInt16 ReqLengLine5_3 = 89;

        public static UInt16 StartAddrLine1_2 = 2101;
        public static UInt16 StartAddrLine2_1 = 3101;
        public static UInt16 StartAddrLine2_2 = 4101;
        public static UInt16 StartAddrLine2_3 = 5101;
        public static UInt16 StartAddrLine2_4 = 6101;
        public static UInt16 StartAddrLine3_1 = 7101;
        public static UInt16 StartAddrLine3_2 = 8101;
        public static UInt16 StartAddrLine3_3 = 9101;
        public static UInt16 StartAddrLine4_1 = 10101;
        public static UInt16 StartAddrLine4_2 = 11101;
        public static UInt16 StartAddrLine4_3 = 12101;
        public static UInt16 StartAddrLine4_4 = 13101;
        public static UInt16 StartAddrLine5_1 = 14101;
        public static UInt16 StartAddrLine5_2 = 15101;
        public static UInt16 StartAddrLine5_3 = 16101;

        public static int SlaveID = 1;  // 공통으로 사용하는지 확인 필요



        public ClientProvider(JTECHManager mgr, int nServerSeqNo)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;

            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public override void OnDropConnection()
        {
            //throw new NotImplementedException();
        }

        public override void OnReceiveData()
        {
            string strErrorMessage = "";

            try
            {
                byte[] data = this.ReceivedData;

                if (data == null || data.Length < 10)
                    return;

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

                if (FC == FC_ReadRegister)
                {   // 알람 체크
                    m_parentManager.CheckAlarm(arrData, IsReverse);
                }                
            }
            catch (Exception e)
            {
                m_parentManager.WriteLog("Fire-JTECH ContactProvider OnReceiveData() Exception : " + e.Message, LogTypes.Error);
            }
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
                                m_parentManager.WriteLog("try connection : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString(), LogTypes.Info);
                                bool bResult = this.Connect(m_parentManager.ServerIP, m_parentManager.Port);

                                if (this.IsConnected)
                                {   // 연결 성공
                                    m_parentManager.WriteLog("ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected, LogTypes.Info);

                                    if (!m_runThread)
                                        return;

                                    string strError;
                                    if (UpdateServerStatus(this.IsConnected, out strError) == false)
                                    {
                                        m_parentManager.WriteLog($"ConnectionThread() : (UpdateServerStatus Error {strError})", LogTypes.Error);
                                    }

                                }
                                else
                                {   // 연결 실패
                                    m_parentManager.WriteLog("ConnectionThread() : " + m_parentManager.ServerIP + ":" + m_parentManager.Port.ToString() + " / " + this.IsConnected, LogTypes.Info);

                                    if (!m_runThread)
                                        return;

                                    string strError;
                                    if (UpdateServerStatus(this.IsConnected, out strError) == false)
                                    {
                                        m_parentManager.WriteLog($"ConnectionThread() : (UpdateServerStatus Error {strError})", LogTypes.Error);
                                    }

                                }
                            }
                        }
                    }

                    Thread.Sleep(500);
                }
                catch (Exception e)
                {
                    m_parentManager.WriteLog("ConnectionThread() Exception: " + e.Message, LogTypes.Error);
                }
            }
        }

        private void RequestThread()
        {
            while (m_runThread)
            {
                try
                {
                    if (this.IsConnected)
                    {
                        byte[] arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine1_2, ReqLengLine1_2, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread) 
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine2_1, ReqLengLine2_1, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine2_2, ReqLengLine2_2, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine2_3, ReqLengLine2_3, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine3_1, ReqLengLine3_1, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine3_2, ReqLengLine3_2, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine3_3, ReqLengLine3_3, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine4_1, ReqLengLine4_1, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine4_2, ReqLengLine4_2, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine4_3, ReqLengLine4_3, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine4_4, ReqLengLine4_4, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine5_1, ReqLengLine5_1, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine5_2, ReqLengLine5_2, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        arrData = MakeRequestMsg(FC_ReadRegister, SlaveID, m_nTransID, StartAddrLine5_3, ReqLengLine5_3, IsReverse);
                        SendBytes(arrData);
                        m_nTransID++;
                        Thread.Sleep(100);
                        if (!m_runThread)
                            return;

                        if (m_nTransID > 10000)
                            m_nTransID = 0;

                        Thread.Sleep(500);
                    }
                }
                catch (Exception e)
                {
                    m_parentManager.WriteLog("RequestThread() Exception : " + e.Message, LogTypes.Error);
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

        public static byte[] MakeRequestMsg(byte code, int nSlaveID, UInt16 nTransID, UInt16 nStartAddr, UInt16 nLength, bool bIsReverse = true)
        {
            UInt16 nHeadLength = 6;

            byte[] arrSlaveID = BitConverter.GetBytes(nSlaveID);
            byte slaveID = arrSlaveID[0];

            byte[] arrTransID = BitConverter.GetBytes(nTransID);
            byte[] arrStartAddr = BitConverter.GetBytes(nStartAddr);
            byte[] arrLength = BitConverter.GetBytes(nLength);
            byte[] arrHeadLength = BitConverter.GetBytes(nHeadLength);

            if (bIsReverse)
            {
                Array.Reverse(arrTransID);
                Array.Reverse(arrStartAddr);
                Array.Reverse(arrLength);
                Array.Reverse(arrHeadLength);
            }            

            byte[] data = new byte[12];

            //data[0] = 0x00;       // Transaction ID
            //data[1] = 0x00;       // Transaction ID
            Array.Copy(arrTransID, 0, data, 0, arrTransID.Length);

            data[2] = 0x00;         // TCP/IP 고정
            data[3] = 0x00;         // TCP/IP 고정

            //data[4] = 0x00;         // 길이
            //data[5] = 0x06;         // 길이
            Array.Copy(arrHeadLength, 0, data, 4, arrHeadLength.Length);

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
                        m_parentManager.WriteBinaryLog(CmdBuff, 0, CmdBuff.Length, "[Send]");
                }
            }
            catch (Exception e)
            {
                m_parentManager.WriteLog("SendBytes() Exception : " + e.Message, LogTypes.Error);
            }
        }
    }
}
