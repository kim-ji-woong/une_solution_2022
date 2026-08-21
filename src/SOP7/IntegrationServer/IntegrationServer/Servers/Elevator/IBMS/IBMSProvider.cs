using System;
using dnsTcpLib2;
using System.Net.Sockets;
using System.Collections.Generic;

namespace IntegrationServer.Servers.Elevator.IBMS
{
    using ViewModels.Elevator;

    class IBMSProvider : ClientServiceProvider
    {
        private int m_nPingCount = 0;
        private IBMSManager m_netMgr = null;
        private bool m_isReading = false;
        private bool m_useBinaryLog = false;

        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public IBMSProvider(IBMSManager netMgr)
        {
            m_netMgr = netMgr;

            this.LengthAdd = false;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public void SendData(byte[] bytes, int beginIndex, int len)
        {
            try
            {
                this.m_netMgr.WriteLog("SendData : " + len.ToString() + ", " + beginIndex.ToString());
                int sendLength = this.Send(bytes, beginIndex, len);

                if (sendLength > 0)
                {
                    this.PingCount = 0;
                    WriteBinaryLog(bytes, beginIndex, sendLength, "Send");
                }
            }
            catch (Exception ex)
            {
                m_netMgr.WriteLog("[ERROR] ClientProvider.cs > void SendData(byte[], int, int) :" + ex.Message);
                this.Close();
            }
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
                WriteBinaryLog(bytes, 0, bytes.Length, "[Received]");

            int nIndex = 0, nBeginIndex = -1, nEndIndex = -1;
            byte[] results = GetBytesBlock(bytes, ref nIndex, ref nBeginIndex, ref nEndIndex);

            if (results != null)
            {
                int maxElevatorID, minElevatorID;
                Dictionary<int, Elevator> dicElevators = m_netMgr.GetDefaultElevators(out maxElevatorID, out minElevatorID);

                Elevator elevator = MessageParser.Parse(results, dicElevators, maxElevatorID, minElevatorID);

                if (elevator != null)
                    m_netMgr.UpdateElevator(elevator);
            }
        }

        private byte[] GetBytesBlock(byte[] bytes, ref int nIndex, ref int nBeginIndex, ref int nEndIndex)
        {
            int len = bytes.Length;
            bool find = false;

            for (int i = nIndex; i < len; i++)
            {
                char ch = (char)bytes[i];

                if ((char)bytes[i] == 'S')
                {
                    nBeginIndex = i;
                    find = true;
                    break;
                }
                /*if (i >= 2)
                {
                    char ch1 = (char)bytes[i - 2];
                    char ch2 = (char)bytes[i - 1];

                    if (ch1 == 'S' && ch2 == 'T' && ch == 'X')
                    {
                        nBeginIndex = i + 1;
                        find = true;
                        break;
                    }
                }*/
            }

            if (find == false)
                return null;

            find = false;

            for (int i = len-1; i > nBeginIndex; i--)
            {
                char ch = (char)bytes[i];

                if (ch == 'E')
                {
                    nEndIndex = i;
                    find = true;
                    break;
                }
                /*char ch1 = (char)bytes[i + 1];
                char ch2 = (char)bytes[i + 2];

                if (ch == 'E' && ch1 == 'T' && ch2 == 'X')
                {
                    nEndIndex = i - 1;
                    find = true;
                    break;
                }*/
            }

            int len2 = nEndIndex - nBeginIndex + 1;

            if (len2 > 0)
            {
                byte[] results = new byte[len2];
                System.Buffer.BlockCopy(bytes, nBeginIndex, results, 0, len2);
                return results;
            }

            return null;
        }

        public override void OnDropConnection()
        {
        }
    }
}
