using System;
using dnsTcpLib2;
using System.Net.Sockets;
using System.Collections.Generic;

namespace IntegrationServer.Servers.EmergencyBell.MPia
{
    using Datas;

    public class MPiaProvider : ClientServiceProvider
    {
        private static byte STX_Send = 0xa2;
        private static byte STX_Receive = 0xc2;

        private static byte InputSensorMemory = 0x00;
        private static byte DisplaySensorMemory = 0x01;
        private static byte LowPowerSensorMemory = 0x02;

        private static byte Code_ClearSensorMemory = 0x32;

        private MPiaManager m_mgr = null;
        private int m_nPingCount = 0;
        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;
        // 지난번에 받은 패킷이 완전하지 않을 경우 지난 패킷을 보관했다가 나머지 패킷을 수신하면 합친다.
        private byte[] m_arrTempReceived = null;

        private bool m_hasAlarm = false;

        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public bool HasAlarm
        {
            get { return m_hasAlarm; }
        }

        public MPiaProvider(MPiaManager mgr)
        {
            m_mgr = mgr;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
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

        public void ProcessData(byte[] bytes)
        {
            if (m_arrTempReceived != null)
            {
                int len1 = m_arrTempReceived.Length;
                int len2 = bytes.Length;

                byte[] bytes2 = new byte[len1 + len2];
                System.Buffer.BlockCopy(m_arrTempReceived, 0, bytes2, 0, len1);
                System.Buffer.BlockCopy(bytes, 0, bytes2, len1, len2);

                bytes = bytes2;
            }

            int nIndex = 0, nBeginIndex = -1, nEndIndex = -1;
            List<int> clearSensorMemoryList = new List<int>();

            while (GetBytesBlock(bytes, ref nIndex, ref nBeginIndex, ref nEndIndex))
            {
                ProcessData(bytes, nBeginIndex, nEndIndex, clearSensorMemoryList);
            }

            if (clearSensorMemoryList.Count > 0)
            {
                m_hasAlarm = true;
                //ClearSensorMemory();
            }
        }

        public void ClearSensorMemory()
        {
            byte[] bytes = new byte[6];

            bytes[0] = STX_Send;
            bytes[1] = 0x01;
            bytes[2] = Code_ClearSensorMemory;
            bytes[3] = 0x01;
            bytes[4] = InputSensorMemory;
            bytes[5] = GetCheckSum(bytes, 0, 4);

            this.SendData(bytes, 0, bytes.Length);
            m_hasAlarm = false;
        }

        public void SendData(byte[] bytes, int beginIndex, int len)
        {
            try
            {
                int sendLength = this.Send(bytes, beginIndex, len);

                if (sendLength > 0)
                {
                    string strLog = WriteBinaryLog(bytes, beginIndex, sendLength, "Send");
                    System.Diagnostics.Trace.WriteLine(strLog);
                }
            }
            catch (Exception ex)
            {
                m_mgr.WriteLog("[ERROR] ClientProvider.cs > void SendData(byte[], int, int) :" + ex.Message, LogTypes.Error);
                System.Diagnostics.Trace.WriteLine("[ERROR] ClientProvider.cs > void SendData(byte[], int, int) :" + ex.Message);
                this.Close();
            }
        }

        private void ProcessData(byte[] bytes, int nBeginIndex, int nEndIndex, List<int> clearSensorMemoryList)
        {
            try
            {
                string strLog = WriteBinaryLog(bytes, nBeginIndex, nEndIndex - nBeginIndex, "Recv");
                System.Diagnostics.Trace.WriteLine(strLog);

                byte addr = bytes[nBeginIndex + 1];
                byte code = bytes[nBeginIndex + 2];
                int dataLength = (int)bytes[nBeginIndex + 3];

                if (dataLength >= 6)
                {
                    byte memoryNo = bytes[nBeginIndex + 4];
                    int sensorNo = ((int)bytes[nBeginIndex + 5]) * 256 + (int)bytes[nBeginIndex + 6];

                    if (sensorNo > 0)
                    {
                        clearSensorMemoryList.Add(sensorNo);

                        string strSensorLog = string.Format("Sensor No({0}) is alarm status", sensorNo);
                        m_mgr.WriteLog(strSensorLog);
                        System.Diagnostics.Trace.WriteLine(strSensorLog);

                        m_mgr.SendAlarm(sensorNo);
                    }
                }
            }
            catch (Exception ex)
            {
                m_mgr.WriteLog("[ERROR] ClientProvider.cs > void ProcessData(byte[], int, int) :" + ex.Message, LogTypes.Error);
                System.Diagnostics.Trace.WriteLine("[ERROR] ClientProvider.cs > void ProcessData(byte[], int, int) :" + ex.Message);
                this.Close();
            }
        }

        private bool GetBytesBlock(byte[] bytes, ref int nIndex, ref int nBeginIndex, ref int nEndIndex)
        {
            m_arrTempReceived = null;

            int len = bytes.Length;
            bool find = false;

            for (int i = nIndex; i < len; i++)
            {
                if (bytes[i] == STX_Receive)
                {
                    nIndex = i;
                    find = true;
                    break;
                }
            }

            if (find == false)
                return false;

            while (nIndex < len)
            {
                if (nIndex == len - 1)
                {
                    m_arrTempReceived = new byte[1];
                    m_arrTempReceived[0] = bytes[nIndex];
                    return false;
                }
                else if (bytes[nIndex + 1] != STX_Receive)
                    break;
                else
                    nIndex++;
            }

            if (nIndex + 3 < len)
            {
                int dataLength = (int)bytes[nIndex + 3];

                if (nIndex + 3 + dataLength + 1 < len)
                {
                    byte checkSum = GetCheckSum(bytes, nIndex, nIndex + 3 + dataLength);

                    if (bytes[nIndex + 3 + dataLength + 1] == checkSum)
                    {
                        nBeginIndex = nIndex;
                        nEndIndex = nIndex + 3 + dataLength + 2;
                        nIndex = nEndIndex;
                        return true;
                    }
                    else
                    {
                        // checkSum이 일치하지 않는 Block은 버리고 나머지는 m_arrTempReceived에 남겨둔다.
                        int nIndex2 = nIndex + 3 + dataLength + 2;

                        if (nIndex2 < len)
                        {
                            m_arrTempReceived = new byte[len - nIndex2];
                            System.Buffer.BlockCopy(bytes, nIndex2, m_arrTempReceived, 0, len - nIndex2);
                            return false;
                        }
                    }
                }
            }

            // 처리되지 못한 데이터는 m_arrTempReceived에 남겨둔다.
            m_arrTempReceived = new byte[len - nIndex];
            System.Buffer.BlockCopy(bytes, nIndex, m_arrTempReceived, 0, len - nIndex);
            return false;
        }

        private byte GetCheckSum(byte[] bytes, int beginIndex, int endIndex)
        {
            int sum = 0;

            for (int i = beginIndex; i <= endIndex; i++)
            {
                sum += (int)bytes[i];
            }

            byte checkSum = (byte)(sum % 256);
            return checkSum;
        }

        private string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = GetByteString(bytes, nIndex, len);
            m_mgr.WriteLog(strTag + " : " + strBytesLog);
            return strTag + " : " + strBytesLog;
        }

        public override void OnDropConnection()
        {
            System.Diagnostics.Trace.WriteLine("OnDropConnection");
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
    }
}
