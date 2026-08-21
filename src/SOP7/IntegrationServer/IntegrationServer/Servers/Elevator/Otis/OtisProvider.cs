using System;
using dnsTcpLib2;
using System.Net.Sockets;
using System.Collections.Generic;

namespace IntegrationServer.Servers.Elevator.Otis
{
    using ViewModels.Elevator;

    class OtisProvider : ClientServiceProvider
    {
        private int m_nPingCount = 0;
        private OtisManager m_netMgr = null;
        private bool m_isReading = false;

        private bool m_useBinaryLog = false;
        private MessageParser m_parser = null;

        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public OtisProvider(OtisManager netMgr, MessageParser parser)
        {
            m_netMgr = netMgr;
            m_parser = parser;

            this.LengthAdd = false;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public int SendData(byte[] bytes, int beginIndex, int len)
        {
            try
            {
                int sendLength = this.Send(bytes, beginIndex, len);

                if (sendLength > 0)
                {
                    WriteBinaryLog(bytes, beginIndex, sendLength, "Send");
                }

                return sendLength;
            }
            catch (Exception ex)
            {
                m_netMgr.WriteLog("[ERROR] ClientProvider.cs > void SendData(byte[], int, int) :" + ex.Message);
                this.Close();
            }

            return 0;
        }

        private string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            if (m_useBinaryLog == false)
                return "";

            string strBytesLog = GetByteString(bytes, nIndex, len);
            m_netMgr.WriteLog(strTag + " : " + strBytesLog);
            return strTag + " : " + strBytesLog;
        }

        private string GetByteString(byte[] bytes, int nIndex, int len)
        {
            string strBytes = "";

            for (int i = nIndex; i < nIndex + len; i++)
            {
                byte b = bytes[i];

                if (strBytes.Length == 0)
                    strBytes = string.Format("\t\t{0:X2}", (int)b);
                else
                    strBytes += string.Format(" {0:X2}", (int)b);
            }

            return strBytes;
        }

        public override void OnReceiveData()
        {
            if (m_isReading)
                return;

            try
            {
                lock (this)
                {
                    if (ReceivedData != null)
                    {
                        m_isReading = true;

                        int nBytesCount = ReceivedData.Length;

                        if (nBytesCount > 0)
                        {
                            m_nPingCount = 0;
                            byte[] bytes = ReceivedData;
                            ProcessData(bytes);
                        }
                    }

                    m_isReading = false;
                }
            }
            catch (Exception e)
            {
                m_netMgr.WriteLog("OnReceivedData Error : " + e.Message);
            }
        }

        public void ProcessData(byte[] bytes)
        {
            if (bytes != null)
            {
                WriteBinaryLog(bytes, 0, bytes.Length, "[Received]");

                ushort nTransactionID;
                Elevator elevator = m_parser.Parse(bytes, out nTransactionID);

                if (elevator != null)
                    m_netMgr.UpdateElevator(elevator, nTransactionID);
            }
        }

        public override void OnDropConnection()
        {
        }
    }
}
