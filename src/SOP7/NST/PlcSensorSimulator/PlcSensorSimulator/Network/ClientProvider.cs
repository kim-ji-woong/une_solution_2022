using System;
using System.Text;
using dnsTcpLib2;
using System.Net.Sockets;

namespace PlcSensorSimulator.Network
{
    public class ClientProvider : ClientServiceProvider
    {
        private const byte BEGIN_BYTE = 0x23; //'#'
        private const byte SECOND_BYTE = 0x40;//'@'

        private NetworkManager m_mgr = null;
        private int m_nPingCount = 0;

        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;

        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public ClientProvider(NetworkManager mgr)
        {
            m_mgr = mgr;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
            this.LengthAdd = false;
        }

        public override void OnReceiveData()
        {
            try
            {
                lock (this)
                {
                    if (ReceivedData != null)
                    {
                        m_isReadingProcess = true;

                        int nBytesCount = ReceivedData.Length;

                        if (nBytesCount > 0)
                        {
                            m_nPingCount = 0;
                            byte[] bytes = ReceivedData;
                            ProcessData(bytes);
                        }
                    }

                    m_isReadingProcess = false;
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("[ERROR] OnReceiveData() : " + e.Message);
            }
        }

        public override void OnDropConnection()
        {
        }

        public void ProcessData(byte[] bytes)
        {
            if (bytes != null)
                ProcessData(bytes, 0, bytes.Length - 1);
        }

        private void ProcessData(byte[] bytes, int nBeginIndex, int nEndIndex)
        {
            string strData = GetString(bytes, nBeginIndex, nEndIndex - nBeginIndex + 1);
            m_mgr.OnReceive(strData);
            //try
            //{
            //    WriteBinaryLog(bytes, nBeginIndex, nEndIndex - nBeginIndex);

            //    string strData = GetString(bytes, nBeginIndex, nEndIndex - nBeginIndex + 1);

            //    if (bytes[nBeginIndex] == BEGIN_BYTE && bytes[nBeginIndex + 1] == SECOND_BYTE)
            //    {
            //        if (strData.Length > 2)
            //        {
            //            string[] tokens = strData.Substring(2).Split(',');

            //            int nTokenCount = tokens.Length;

            //            if (nTokenCount < 3)
            //            {
            //                System.Diagnostics.Trace.WriteLine("Invalid Data Received : " + strData);
            //            }
            //            else
            //            {
            //                string strType = tokens[0].Trim();

            //                if (strType.StartsWith("D"))
            //                    ProcessNormalData(tokens, nTokenCount);
            //                /*else if (strType.StartsWith("E"))
            //                    ProcessAlarmData(tokens, nTokenCount);*/
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    System.Diagnostics.Trace.WriteLine("[ERROR] ClientProvider.cs > void ProcessData(byte[], int, int) :" + ex.Message);
            //}
        }

        private void ProcessNormalData(string[] tokens, int nTokenCount)
        {
            for (int i = 2; i < nTokenCount; i++)
            {
                string[] arrDatas = tokens[i].Split('&');

                if (arrDatas == null || arrDatas.Length < 2)
                    continue;

                string strSensorID = arrDatas[0].Trim();
                string strSensorData = arrDatas[1].Trim();
            }
        }

        private void WriteBinaryLog(byte[] bytes, int nIndex, int len)
        {
            string strBytesLog = GetByteString(bytes);
            System.Diagnostics.Trace.WriteLine("Recv : " + strBytesLog);
        }

        private static string GetByteString(byte[] bytes)
        {
            string strBytes = "";

            foreach (byte b in bytes)
            {
                if (strBytes.Length == 0)
                    strBytes = string.Format("\t\t{0:X2}", (int)b);
                else
                    strBytes += string.Format(" {0:X2}", (int)b);
            }

            return strBytes;
        }

        private string GetString(byte[] bytes, int nIndex, int len)
        {
            byte[] trg = null;

            for (int i = nIndex; i < nIndex + len; i++)
            {
                if (bytes[i] == 0x00)
                {
                    if (i == nIndex)
                        return "";

                    trg = new byte[i - nIndex];
                    System.Buffer.BlockCopy(bytes, nIndex, trg, 0, i - nIndex);
                    break;
                }
            }

            if (trg == null)
            {
                trg = new byte[len];
                System.Buffer.BlockCopy(bytes, nIndex, trg, 0, len);
            }

            return Encoding.UTF8.GetString(trg);
        }
    }
}
