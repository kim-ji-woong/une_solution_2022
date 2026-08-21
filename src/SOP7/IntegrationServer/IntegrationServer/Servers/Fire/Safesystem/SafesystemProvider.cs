using dnsTcpLib2;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using static dnsSopID.ID;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace IntegrationServer.Servers.Fire.Safesystem
{
    /// <summary>
    /// 화재-세이프시스템 통신
    /// </summary>
    public class SafesystemProvider : ClientServiceProvider
    {
        private int m_nServerSeqNo = -1;
        private SafesystemManager m_parentManager = null;
        
        // 지난번에 받은 패킷이 완전하지 않을 경우 지난 패킷을 보관했다가 나머지 패킷을 수신하면 합친다.
        private byte[] m_arrTempReceived = null;

        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;
        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        private int m_nPingCount = 0;
        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        private int m_nSiteID = -1;
        private IDataManager m_dataManager = null;

        // Key : SI
        private Dictionary<string, SensorTag> m_dicSISensorTags = null;
        // Key : TagNo
        private Dictionary<int, SensorTag> m_dicTagNoSensorTags = null;

        private const byte BEGIN_BYTE = 0x5B;//'A'
        private const int BLOCK_LENGTH = 22;

        private const byte LOG_TYPE_FIRE = 0x07;
        private const byte LOG_TYPE_OP = 0x05;
        private const byte LOG_TYPE_FIRED = 0x06;
        private const byte LOG_TYPE_RECOVERTY = 0x0a;

        public SafesystemProvider(SafesystemManager mgr, int nServerSeqNo, IDataManager dataManager, int nSiteID)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;
            m_dataManager = dataManager;
            
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);

            Dictionary<int, SensorTag> dicSensorTags = SensorManager.LoadSensors(dataManager, nSiteID, (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR);
            SetSensors(dicSensorTags);
        }

        private void SetSensors(Dictionary<int, SensorTag> dicSensorTags)
        {
            m_dicTagNoSensorTags = dicSensorTags;

            if (dicSensorTags != null)
            {
                m_dicSISensorTags = new Dictionary<string, SensorTag>();

                foreach (KeyValuePair<int, SensorTag> pair in dicSensorTags)
                {
                    m_dicSISensorTags[pair.Value.Description] = pair.Value;
                }
            }
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

                        int nBytesCount = ReceivedData.Count();

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
                System.Diagnostics.Trace.WriteLine("OnReceiveData Error : " + e.Message);
            }
        }

        public override void OnDropConnection()
        {
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Safesystem, m_nServerSeqNo, "close Connection");
        }

        public void ProcessData(byte[] bytes)
        {
            try
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

                while (GetBytesBlock(bytes, ref nIndex, ref nBeginIndex, ref nEndIndex))
                {
                    ProcessData(bytes, nBeginIndex, nEndIndex);
                }
            }
            catch (Exception ex)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Safesystem, m_nServerSeqNo, "ProcessData(byte[]) : " + ex.Message);
            }
        }

        private void ProcessData(byte[] bytes, int nBeginIndex, int nEndIndex)
        {
            try
            {
                // Port
                //int A = 0;
                //// ID
                //int B = 15;
                //// CH
                //int C = 17;
                //// 수신기
                //int D = 1;

                //int result = Convert.ToInt32(A + B * Math.Pow(256, 1) + C * Math.Pow(256, 2) + D * Math.Pow(256, 3));

                // OUTPUT
                // A << 1
                // 0
                // B << 8
                // 3840
                // C << 16
                // 1114112
                // D << 24
                // 16777216
                // 3840 / 256
                // 15
                // 1114112 / Math.Pow(256, 2)
                // 17

                //
                string str =  Encoding.UTF8.GetString(bytes);
                m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Safesystem, m_nServerSeqNo, str);
                WriteBinaryLog(bytes, nBeginIndex, nEndIndex - nBeginIndex);

                string strAlarmType = GetString(bytes, nBeginIndex, 6);    // [FIRE] [WARN] [RECV] [CHCK]
                string strSplit1 = GetString(bytes, nBeginIndex + 6, 1);   // <
                //string strReceiver = GetString(bytes, nBeginIndex + 9, 2); // 수신기 (00~99)
                int nReceiver = AsciiToInt(bytes, nBeginIndex + 7, 2);
                string strSplit2 = GetString(bytes, nBeginIndex + 9, 1);  // -
                string strMark = GetString(bytes, nBeginIndex + 10, 1);    // 설비기호 (m,i,q,x)
                string strCH = GetString(bytes, nBeginIndex + 11, 2);      // CH (00~FF)
                string strID = GetString(bytes, nBeginIndex + 13, 2);      // ID (00~FF)
                string strPort = GetString(bytes, nBeginIndex + 15, 2);    // Port (00~FF)
                string strSplit3 = GetString(bytes, nBeginIndex + 17, 1);  // >
                string strStatus= GetString(bytes, nBeginIndex + 18, bytes.Length - 18); // (ON), (OFF)

                string strSI = GetString(bytes, nBeginIndex + 6, 12);

                int nCH = Convert.ToInt32(strCH, 16);
                int nID = Convert.ToInt32(strID, 16);
                int nPort = Convert.ToInt32(strPort, 16);

                string strLog = $"Receiver({nReceiver}), Mark({strMark}), CH({strCH}), ID({strID}), Port({strPort}), Status({strStatus}), Description({strSI})";
                m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Safesystem, m_nServerSeqNo, strLog);
                System.Diagnostics.Trace.WriteLine(strLog);

                if (strStatus.ToUpper().Contains("ON"))
                {
                    if (JTECH.JTECHManager.CheckAlarmReceiveOption(m_dataManager, m_nSiteID))
                    {
                        // 화재신호
                        //ProcessFire(nReceiver, nCH, nID, nPort);
                        ProcessFire(strSI, true);
                    }
                }
                else if (strStatus.ToUpper().Contains("OFF"))
                {
                    // 복구신호
                    //ProcessClear(nReceiver, nCH, nID, nPort);
                    ProcessFire(strSI, false);
                }
            }
            catch (Exception ex)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Safesystem, m_nServerSeqNo, "SafesystemProvider.cs > void ProcessData(byte[], int, int) :" + ex.Message);
            }
        }

        public void ProcessFire(string strSI, bool bIsAlarm)
        {
            SensorTag sensorTag = FindSensor(strSI);
            //Dictionary<int, SensorTag> sensorTags = SensorManager.Instance.FindSensors(m_nServerSeqNo);
            if (sensorTag == null)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Safesystem, m_nServerSeqNo, $"SafesystemProvider.cs > void ProcessFire(string) : strSI:{strSI} sensor not find");
                return;
            }

            /*SensorTag sensorTag = null;
            foreach (KeyValuePair<int, SensorTag> item in sensorTags)
            {
                if (item.Value.Description == strSI)
                {
                    sensorTag = item.Value;                    
                    break;
                }
            }*/

            m_parentManager.SendSensorData(sensorTag, bIsAlarm);

            string strSensorInfo = GetSensorInfo(strSI);

            // 피난유도 시스템에 화재신호를 보낸다.
            if (strSensorInfo != null)
            {
                MQTT.Corners.MqttManager mgr = MQTT.Corners.MqttManager.GetInstance(m_nSiteID);

                if (mgr != null)
                {
                    mgr.Publish(strSensorInfo, bIsAlarm);

                    if (bIsAlarm)
                        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Safesystem, m_nServerSeqNo, "화재신호 대피유도 시스템에 전송, SensorInfo: " + strSensorInfo);
                    else
                        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Safesystem, m_nServerSeqNo, "화재복구 대피유도 시스템에 전송, SensorInfo: " + strSensorInfo);
                }
            }
            /*if (strSensorInfo != null && MQTT.Corners.MqttManager.Instance != null)
            {
                MQTT.Corners.MqttManager.Instance.Publish(strSensorInfo, bIsAlarm);
            }*/
        }

        private string GetSensorInfo(string strSI)
        {
            if (strSI == null)
                return null;

            int len = strSI.Length;

            if (strSI[0] == '<' && strSI[len - 1] == '>' && len >= 3)
                return strSI.Substring(1, len - 2).Trim();

            return null;
        }

        public void ProcessFire(int nReceiverID, int nCH, int nID, int nPort)
        {
            int nTagNo = GetSensorTagNo(nReceiverID, nCH, nID, nPort);
            SensorTag sensorTag = FindSensor(nTagNo);
            if (sensorTag == null)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Safesystem, m_nServerSeqNo
                    , $"SafesystemProvider.cs > void ProcessFire(int, int, int, int) : nReceiverID:{nReceiverID}, nCH:{nCH}, nID:{nID}, nPort:{nPort} sensor not find");
                return;
            }

            m_parentManager.SendSensorData(sensorTag, true);
        }

        private Dictionary<string, SensorTag> GetSISensorTags(Dictionary<int, SensorTag> sensorTags)
        {
            Dictionary<string, SensorTag> dicSensorTags = new Dictionary<string, SensorTag>();

            foreach (KeyValuePair<int, SensorTag> item in sensorTags)
            {
                dicSensorTags[item.Value.Description] = item.Value;
            }

            return dicSensorTags;
        }

        private Dictionary<int, SensorTag> GetTagNoSensorTags(Dictionary<int, SensorTag> sensorTags)
        {
            Dictionary<int, SensorTag> dicSensorTags = new Dictionary<int, SensorTag>();

            foreach (KeyValuePair<int, SensorTag> item in sensorTags)
            {
                dicSensorTags[item.Value.TagNo] = item.Value;
            }

            return dicSensorTags;
        }

        private SensorTag FindSensor(string strSI)
        {
            if (m_dicSISensorTags == null)
            {
                Dictionary<int, SensorTag> sensorTags = SensorManager.Instance.FindSensors(m_nServerSeqNo);

                if (sensorTags != null)
                {
                    if (m_dicSISensorTags == null)
                        m_dicSISensorTags = GetSISensorTags(sensorTags);
                }
                else
                    m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Safesystem, m_nServerSeqNo, $"SafesystemProvider.cs > void ProcessFire(string) : nServerSeqNo:{m_nServerSeqNo} server id not find");
            }

            if (m_dicSISensorTags != null)
            {
                SensorTag sensorTag;

                if (m_dicSISensorTags.TryGetValue(strSI, out sensorTag))
                    return sensorTag;
            }

            return null;
        }

        private SensorTag FindSensor(int tagNo)
        {
            if (m_dicTagNoSensorTags == null)
            {
                Dictionary<int, SensorTag> sensorTags = SensorManager.Instance.FindSensors(m_nServerSeqNo);

                if (sensorTags != null)
                {
                    if (m_dicTagNoSensorTags == null)
                        m_dicTagNoSensorTags = GetTagNoSensorTags(sensorTags);
                }
                else
                    m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Safesystem, m_nServerSeqNo, $"SafesystemProvider.cs > void ProcessFire(string) : nServerSeqNo:{m_nServerSeqNo} server id not find");
            }

            if (m_dicTagNoSensorTags != null)
            {
                SensorTag sensorTag;

                if (m_dicTagNoSensorTags.TryGetValue(tagNo, out sensorTag))
                    return sensorTag;
            }

            return null;
        }

        public void ProcessClear(int nReceiverID, int nCH, int nID, int nPort)
        {
            int nTagNo = GetSensorTagNo(nReceiverID, nCH, nID, nPort);
            SensorTag sensorTag = SensorManager.Instance.FindSensor(m_nServerSeqNo, nTagNo);
            m_parentManager.SendSensorData(sensorTag, false);
        }

        private void ProcessAllClear()
        {
            m_parentManager.SendAllClear();
        }

        public int GetSensorTagNo(int nReceiverID, int nCH, int nID, int nPort)
        {
            // Port + ID*256 + CH*256^2 + Receiver*256^3

            // 1.
            //int nTagNo = Convert.ToInt32(nPort + nID * Math.Pow(256, 1) + nCH * Math.Pow(256, 2) + nReceiverID * Math.Pow(256, 3));

            // 2.
            //int _1st = 256;
            //int _2nd = 256 * 256;
            //int _3rd = 256 * 256 * 256;
            //int nTagNo = nPort + nID * _1st + nCH * _2nd + nReceiverID * _3rd;

            // 3.
            //int nTagNo = nPort | (nID << 8) | (nCH << 16) | (nReceiverID << 24);
            //return nTagNo;


            string strReceiverID = nReceiverID.ToString();
            string strCH = nCH.ToString().PadLeft(3, '0');
            string strID = nID.ToString().PadLeft(3, '0');
            string strPort = nPort.ToString();

            int.TryParse(strReceiverID + strCH + strID + strPort, out int nTagNo);
            return nTagNo;
        }

        private void GetPart(int nTagNo, out int nPort, out int nID, out int nCH, out int nReceiverID)
        {
            nReceiverID = (nTagNo >> 24);
            nCH = (nTagNo >> 16) & 0x00ff;
            nID = (nTagNo >> 8) & 0x0000ff;
            nPort = nTagNo & 0x000000ff;
        }

        private void WriteBinaryLog(byte[] bytes, int nIndex, int len)
        {
            string strLog = "";

            for (int i = nIndex; i < nIndex + len; i++)
            {
                string strBytes = string.Format("{0:X2}", bytes[i]);

                if (i == nIndex)
                    strLog = strBytes;
                else
                    strLog += " " + strBytes;
            }

            strLog = string.Format("[{2}] Recv from Server\r\nBytes Length : {0}\r\n{1}", len, strLog, GetServerText(ServerTypes.Fire_Safesystem));
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Safesystem, m_nServerSeqNo, strLog);
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

            return Encoding.GetEncoding("utf-8").GetString(trg);
        }

        private int AsciiToInt(byte[] bytes, int nIndex, int len)
        {
            int data = 0;

            for (int i = nIndex; i < nIndex + len; i++)
            {
                data = data * 10 + ((char)bytes[i] - '0');
            }

            return data;
        }

        private DateTime ToDateTime(byte[] bytes, int nIndex)
        {
            int year = ((int)bytes[nIndex]) + 2000;
            int month = (int)bytes[nIndex + 1];
            int day = (int)bytes[nIndex + 2];
            int hour = (int)bytes[nIndex + 3];
            int min = (int)bytes[nIndex + 4];
            int sec = (int)bytes[nIndex + 5];

            return new DateTime(year, month, day, hour, min, sec);
        }

        private bool GetBytesBlock(byte[] bytes, ref int nIndex, ref int nBeginIndex, ref int nEndIndex)
        {
            m_arrTempReceived = null;

            int len = bytes.Length;
            bool find = false;

            for (int i = nIndex; i < len; i++)
            {
                if (bytes[i] == BEGIN_BYTE)
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
                else if (bytes[nIndex + 1] != BEGIN_BYTE)
                    break;
                else
                    nIndex++;
            }

            if (nIndex + BLOCK_LENGTH <= len)
            {
                nBeginIndex = nIndex;
                nEndIndex = nBeginIndex + BLOCK_LENGTH;
                nIndex = nEndIndex;
                return true;
            }

            if (len <= nIndex)
                return false;

            // 처리되지 못한 데이터는 m_arrTempReceived에 남겨둔다.
            m_arrTempReceived = new byte[len - nIndex];
            System.Buffer.BlockCopy(bytes, nIndex, m_arrTempReceived, 0, len - nIndex);
            return false;
        }
    }
}
