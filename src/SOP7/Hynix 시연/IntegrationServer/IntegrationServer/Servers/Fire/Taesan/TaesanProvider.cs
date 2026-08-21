using dnsTcpLib2;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Collections.Concurrent;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Fire.Taesan
{
    /// <summary>
    /// 화재-동방 통신
    /// </summary>
    public class TaesanProvider : ClientServiceProvider
    {
        private int m_nServerSeqNo = -1;
        private TaesanManager m_parentManager = null;
        
        // 지난번에 받은 패킷이 완전하지 않을 경우 지난 패킷을 보관했다가 나머지 패킷을 수신하면 합친다.
        //private byte[] m_arrTempReceived = null;

        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;
        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        // OnReceive()에서 처리하는 도중에 새로운 데이터가 들어오면 Queue에 넣는다.
        private ConcurrentQueue<byte[]> m_messageQueue = new ConcurrentQueue<byte[]>();

        private int m_nPingCount = 0;
        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        // Key : TagNo
        private Dictionary<int, SensorTag> m_dicTagNoSensorTags = null;

        private const byte BEGIN_BYTE = 0x41;//'A'
        private const int BLOCK_LENGTH = 72;

        private const byte LOG_TYPE_FIRE = 0x07;
        private const byte LOG_TYPE_OP = 0x05;
        private const byte LOG_TYPE_FIRED = 0x06;
        private const byte LOG_TYPE_RECOVERTY = 0x0a;

        public TaesanProvider(TaesanManager mgr, int nServerSeqNo)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;
            
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
                        int nBytesCount = ReceivedData.Count();

                        if (nBytesCount > 0)
                        {
                            m_nPingCount = 0;

                            byte[] bytes = ReceivedData;
                            m_messageQueue.Enqueue(bytes);

                            WriteTextLog("Bytes Length(" + bytes.Length + ")");

                            if (m_isReadingProcess)
                                return;

                            m_isReadingProcess = true;
                            ProcessData();
                            m_isReadingProcess = false;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("OnReceiveData Error : " + e.Message);
            }
        }

        public override void OnDropConnection()
        {
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Taesan, m_nServerSeqNo, "close Connection");
        }

        public void ProcessData()
        {
            try
            {
                byte[] bytes;

                while (m_messageQueue.TryDequeue(out bytes))
                {
                    List<byte[]> validByteList = GetMessageList(bytes);

                    foreach (byte[] validBytes in validByteList)
                    {
                        WriteBinaryLog(validBytes, 0, validBytes.Length);

                        string strRecvData = Encoding.Unicode.GetString(validBytes);
                        string[] strRecvDatas = strRecvData.Split(',');

                        if (strRecvDatas == null)
                            continue;

                         int nDataCount = strRecvDatas.Length;
                        string _strDataType = null;

                        for (int i=0;i<nDataCount-3;i+=4)
                        {
                            string strDataType = _strDataType == null ? strRecvDatas[i].Trim() : _strDataType;
                            string strTime = strRecvDatas[i + 1].Trim();
                            string strData1 = strRecvDatas[i + 2].Trim();
                            string strData2 = strRecvDatas[i + 3].Trim();
                            _strDataType = null;

                            // 다음 구문에 대한 유효성 검증
                            if (i + 3 < nDataCount - 3)
                            {
                                string str1 = strRecvDatas[i + 4].Trim();

                                DateTime dtTemp;

                                if (DateTime.TryParse(strRecvDatas[i + 4], out dtTemp))
                                {
                                    // 이번 구문과 다음 구문 사이에 쉼표(,)가 빠져 있음
                                    strData2 = ParseData(strData2, ref _strDataType);
                                    i--;
                                }
                            }

                            ProcessData(strDataType, strTime, strData1, strData2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Taesan, m_nServerSeqNo, "ProcessData(byte[]) : " + ex.Message);
            }
        }

        // strSrc를 Action과 DataType으로 분리한다.
        private string ParseData(string strSrc, ref string strDataType)
        {
            for (int i=strSrc.Length-1;i>=0;i--)
            {
                char ch = strSrc[i];

                if (ch < '0' || ch > '9')
                {
                    strDataType = strSrc.Substring(i + 1).Trim();
                    return strSrc.Substring(0, i + 1).Trim();
                }
            }

            strDataType = null;
            return strSrc;
        }

        // bytes에서 유효한 값들을 얻어온다.
        private List<byte[]> GetMessageList(byte[] bytes)
        {
            List<byte[]> validBytesList = new List<byte[]>();
            int len = bytes.Length;

            int beginIndex = -1;

            for (int i=0;i<len-1;i+=2)
            {
                if (beginIndex < 0)
                {
                    if (bytes[i] != 0x00 || bytes[i + 1] != 0x00)
                    {
                        beginIndex = i;
                    }
                }
                else
                {
                    if (bytes[i] == 0x00 && bytes[i + 1] == 0x00)
                    {
                        int blockLength = i - beginIndex;
                        byte[] blockBytes = new byte[blockLength];

                        System.Buffer.BlockCopy(bytes, beginIndex, blockBytes, 0, blockLength);
                        beginIndex = -1;

                        validBytesList.Add(blockBytes);
                    }
                }
            }

            if (beginIndex >= 0)
            {
                int blockLength = len % 2 == 0 ? len - beginIndex : len - beginIndex - 1;
                byte[] blockBytes = new byte[blockLength];

                System.Buffer.BlockCopy(bytes, beginIndex, blockBytes, 0, blockLength);
                validBytesList.Add(blockBytes);
            }

            return validBytesList;
        }

        private void ProcessData(string strDataType, string strTime, string strData1, string strData2)
        {
            try
            {
                WriteTextLog(strDataType + "," + strTime + "," + strData1 + "," + strData2);
                
                // 수신기 복구 / 0,2022-01-01 01:01:01,수신기1,수신기 복구 / 데이터 타입, 시간, 수신기 이름, 동작
                // 일반 화재 / 1,2022-01-01 01:01:01,수신기1 2-3-4,지하1층 화재 / 데이터 타입, 시간, (수신기 이름 + 채널 + 중계기 번호 + 감지기 번호), (위치 주소 + 동작)
                // 일반 복구 / 5,2022-01-01 01:01:01,수신기1 2-3-4,지하1층 화재 복구 / 데이터 타입, 시간, (수신기 이름 + 채널 + 중계기 번호 + 감지기 번호), (위치 주소 + 동작)
                // 아날로그 화재 / 17,2022-01-01 01:01:01,수신기1 2-3-1-4,지하1층 1번 연기 감지기 화재 / 데이터 타입, 시간, (수신기 이름 + 채널 + 중계기 번호 + 회로 번호 + 감지기 번호), (위치 주소 + 감지기 주소 + 동작)

                // ●데이터 타입은 각 프로토콜에 부여된 고유한 번호로써 수신기 복구(0), 일반 화재(1), 일반 화재 복구(5), 아날로그 화재(17)로 나뉜다.
                // ●시간은 년, 월, 일, 시, 분, 초 순으로 년, 월, 일은 문자 ‘–’로 구분되고, 시, 분, 초는 문자 ‘:’ 로 구분된다.
                // ●일반 화재 및 복구의 경우에는 수신기 이름과 채널, 중계기 번호와 그 중계기의 회로 번호로 구분되며, 아날로그 화재는 추가로 감지기 번호까지 사용된다.또한 아날로그 화재의 회로 번호는 1로 고정된다.
                // ●주소는 수신기에서 설정된 이름과 데이터 타입에 따른 수신기 복구, 화재, 화재 복구라는 단어가 사용된다,
                // ●아날로그 화재 후 아날로그 복구는 사용되지 않으며 수신기 복구 시 아날로그 화재가 복구 처리된다.
                // ●응답 신호는 클라이언트에서 보내는 신호를 접속된 모든 클라이언트에 재전송한다.

                int nDataType = -1;
                DateTime dtDateTime = new DateTime();
                string strReceiverName = null; // 수신기 이름
                int nChanel = -1; // 채널
                int nRelay = -1; // 중계기 번호
                int nLine = -1; // 회로 번호
                int nDetector = -1; // 감지기 번호

                string strAction = null;

                string strLog = string.Empty;
                List<SensorTag> receiverSensorTags = null;

                if (strDataType == "0")
                {
                    if (!DateTime.TryParse(strTime, out dtDateTime))
                        return;
                    
                    strReceiverName = strData1;
                    strAction = strData2;

                    if (int.TryParse(strDataType, out nDataType) == false)
                        return;

                    receiverSensorTags = m_parentManager.GetAlarmSensorTags(strReceiverName);

                    if (receiverSensorTags == null)
                        return;
                }
                else if (strDataType == "1" || strDataType == "5")
                {
                    if (!DateTime.TryParse(strTime, out dtDateTime))
                        return;

                    string[] strValues = strData1.Split(' ');
                    if (strValues == null || strValues.Length == 0)
                        return;

                    strReceiverName = strValues[0];
                    if (strValues.Length > 1 && strValues[1].Length > 0)
                    {
                        string[] strValues2 = strValues[1].Split('-');
                        if (strValues2 == null || strValues2.Length == 0)
                            return;

                        if (strValues2.Length < 1 || !IntTryParse(strValues2[0], ref nChanel))
                            return;
                        if (strValues2.Length < 2 || !IntTryParse(strValues2[1], ref nRelay))
                            return;
                        if (strValues2.Length < 3 || !IntTryParse(strValues2[2], ref nLine))
                            return;
                    }
                    
                    strAction = strData2;

                    if (!int.TryParse(strDataType, out nDataType))
                        return;
                }
                else if (strDataType == "17")
                {
                    if (!DateTime.TryParse(strTime, out dtDateTime))
                        return;

                    string[] strValues = strData1.Split(' ');
                    if (strValues == null || strValues.Length == 0)
                        return;

                    strReceiverName = strValues[0];
                    if (strValues.Length > 1 && strValues[1].Length > 0)
                    {
                        string[] strValues2 = strValues[1].Split('-');
                        if (strValues2 == null || strValues2.Length == 0)
                            return;

                        if (strValues2.Length < 1 || !IntTryParse(strValues2[0], ref nChanel))
                            return;
                        if (strValues2.Length < 2 || !IntTryParse(strValues2[1], ref nRelay))
                            return;
                        if (strValues2.Length < 3 || !IntTryParse(strValues2[2], ref nLine))
                            return;
                        if (strValues2.Length < 4 || !IntTryParse(strValues2[3], ref nDetector))
                            return;
                    }
                    
                    nDataType = 17;
                }

                m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Taesan, m_nServerSeqNo, strLog);

                if (nDataType == 1 || nDataType == 17)
                {
                    ProcessFire(strReceiverName, nChanel, nRelay, nLine, nDetector, true);
                }
                else if (/*nDataType == 0 || */nDataType == 5)
                {
                    ProcessFire(strReceiverName, nChanel, nRelay, nLine, nDetector, false);
                }
                else if (nDataType == 0 && receiverSensorTags != null)
                {
                    foreach (SensorTag sensorTag in receiverSensorTags)
                    {
                        m_parentManager.SendSensorData(sensorTag, false);
                    }
                }
            }
            catch (Exception ex)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Taesan, m_nServerSeqNo, "ClientProvider.cs > void ProcessData(byte[], int, int) :" + ex.Message);
            }
        }

        //private void ProcessData(byte[] bytes, int nBeginIndex, int nEndIndex)
        //{
        //    try
        //    {
        //        WriteBinaryLog(bytes, nBeginIndex, nEndIndex - nBeginIndex);

        //        string strRecvData = Encoding.Unicode.GetString(bytes);
        //        string[] strRecvDatas = strRecvData.Split(',');

        //        if (strRecvDatas == null || strRecvDatas.Length == 0)
        //            return;

        //        // 수신기 복구 / 0,2022-01-01 01:01:01,수신기1,수신기 복구 / 데이터 타입, 시간, 수신기 이름, 동작
        //        // 일반 화재 / 1,2022-01-01 01:01:01,수신기1 2-3-4,지하1층 화재 / 데이터 타입, 시간, (수신기 이름 + 채널 + 중계기 번호 + 감지기 번호), (위치 주소 + 동작)
        //        // 일반 복구 / 5,2022-01-01 01:01:01,수신기1 2-3-4,지하1층 화재 복구 / 데이터 타입, 시간, (수신기 이름 + 채널 + 중계기 번호 + 감지기 번호), (위치 주소 + 동작)
        //        // 아날로그 화재 / 17,2022-01-01 01:01:01,수신기1 2-3-1-4,지하1층 1번 연기 감지기 화재 / 데이터 타입, 시간, (수신기 이름 + 채널 + 중계기 번호 + 회로 번호 + 감지기 번호), (위치 주소 + 감지기 주소 + 동작)

        //        // ●데이터 타입은 각 프로토콜에 부여된 고유한 번호로써 수신기 복구(0), 일반 화재(1), 일반 화재 복구(5), 아날로그 화재(17)로 나뉜다.
        //        // ●시간은 년, 월, 일, 시, 분, 초 순으로 년, 월, 일은 문자 ‘–’로 구분되고, 시, 분, 초는 문자 ‘:’ 로 구분된다.
        //        // ●일반 화재 및 복구의 경우에는 수신기 이름과 채널, 중계기 번호와 그 중계기의 회로 번호로 구분되며, 아날로그 화재는 추가로 감지기 번호까지 사용된다.또한 아날로그 화재의 회로 번호는 1로 고정된다.
        //        // ●주소는 수신기에서 설정된 이름과 데이터 타입에 따른 수신기 복구, 화재, 화재 복구라는 단어가 사용된다,
        //        // ●아날로그 화재 후 아날로그 복구는 사용되지 않으며 수신기 복구 시 아날로그 화재가 복구 처리된다.
        //        // ●응답 신호는 클라이언트에서 보내는 신호를 접속된 모든 클라이언트에 재전송한다.

        //        int nDataType = -1;
        //        DateTime dtDateTime = new DateTime();
        //        string strReceiverName = null; // 수신기 이름
        //        int nChanel = -1; // 채널
        //        int nRelay = -1; // 중계기 번호
        //        int nLine = -1; // 회로 번호
        //        int nDetector = -1; // 감지기 번호
                
        //        string strAction = null;

        //        string strLog = string.Empty;
        //        List<SensorTag> receiverSensorTags = null;

        //        if (strRecvDatas[0] == "0")
        //        {
        //            if (strRecvDatas.Length < 2 || !DateTime.TryParse(strRecvDatas[1], out dtDateTime))
        //                return;
        //            if (strRecvDatas.Length < 3 || strRecvDatas[2].Length == 0)
        //                return;                    
        //            if (strRecvDatas.Length < 4 || strRecvDatas[3].Length == 0)
        //                return;

        //            strReceiverName = strRecvDatas[2];
        //            strAction = strRecvDatas[3];

        //            if (int.TryParse(strRecvDatas[0], out nDataType) == false)
        //                return;

        //            receiverSensorTags = m_parentManager.GetAlarmSensorTags(strReceiverName);

        //            if (receiverSensorTags == null)
        //                return;

        //            //nDataType = 0;
        //        }
        //        else if (strRecvDatas[0] == "1" || strRecvDatas[0] == "5")
        //        {
        //            if (strRecvDatas.Length < 2 || !DateTime.TryParse(strRecvDatas[1], out dtDateTime))
        //                return;
        //            if (strRecvDatas.Length > 2 && strRecvDatas[2].Length > 0)
        //            {
        //                string[] strValues = strRecvDatas[2].Split(' ');
        //                if (strValues == null || strValues.Length == 0)
        //                    return;

        //                strReceiverName = strValues[0];
        //                if (strValues.Length > 1 && strValues[1].Length > 0)
        //                {
        //                    string[] strValues2 = strValues[1].Split('-');
        //                    if (strValues2 == null || strValues2.Length == 0)
        //                        return;

        //                    if (strValues2.Length < 1 || !IntTryParse(strValues2[0], ref nChanel))
        //                        return;
        //                    if (strValues2.Length < 2 || !IntTryParse(strValues2[1], ref nRelay))
        //                        return;
        //                    if (strValues2.Length < 3 || !IntTryParse(strValues2[2], ref nLine))
        //                        return;
        //                }
        //            }
        //            else
        //                return;

        //            if (strRecvDatas.Length < 4 || strRecvDatas[3].Length == 0)
        //                return;

        //            strAction = strRecvDatas[3];

        //            if (!int.TryParse(strRecvDatas[0], out nDataType))
        //                return;
        //        }
        //        else if (strRecvDatas[0] == "17")
        //        {
        //            if (strRecvDatas.Length < 2 || !DateTime.TryParse(strRecvDatas[1], out dtDateTime))
        //                return;

        //            if (strRecvDatas.Length > 2 && strRecvDatas[2].Length > 0)
        //            {
        //                string[] strValues = strRecvDatas[2].Split(' ');
        //                if (strValues == null || strValues.Length == 0)
        //                    return;

        //                strReceiverName = strValues[0];
        //                if (strValues.Length > 1 && strValues[1].Length > 0)
        //                {
        //                    string[] strValues2 = strValues[1].Split('-');
        //                    if (strValues2 == null || strValues2.Length == 0)
        //                        return;

        //                    if (strValues2.Length < 1 || !IntTryParse(strValues2[0], ref nChanel))
        //                        return;
        //                    if (strValues2.Length < 2 || !IntTryParse(strValues2[1], ref nRelay))
        //                        return;
        //                    if (strValues2.Length < 3 || !IntTryParse(strValues2[2], ref nLine))
        //                        return;
        //                    if (strValues2.Length < 4 || !IntTryParse(strValues2[3], ref nDetector))
        //                        return;
        //                }
        //            }
        //            else
        //                return;

        //            if (strRecvDatas.Length < 4 || strRecvDatas[3].Length == 0)
        //                strAction = strRecvDatas[3];

        //            nDataType = 17;
        //        }

        //        m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Taesan, m_nServerSeqNo, strLog);

        //        if (nDataType == 1 || nDataType == 17)
        //        {
        //            ProcessFire(strReceiverName, nChanel, nRelay, nLine, nDetector, true);
        //        }
        //        else if (/*nDataType == 0 || */nDataType == 5)
        //        {
        //            ProcessFire(strReceiverName, nChanel, nRelay, nLine, nDetector, false);
        //        }
        //        else if (nDataType == 0 && receiverSensorTags != null)
        //        {
        //            foreach (SensorTag sensorTag in receiverSensorTags)
        //            {
        //                m_parentManager.SendSensorData(sensorTag, false);
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Taesan, m_nServerSeqNo, "ClientProvider.cs > void ProcessData(byte[], int, int) :" + ex.Message);
        //    }
        //}

        private bool IntTryParse(string strValue, ref int nValue)
        {
            if (strValue == null || strValue.Length == 0)
                return false;

            return int.TryParse(strValue, out nValue);
        }

        public void ProcessFire(string strReceiver, int nChanel, int nRelay, int nLine, int nDetector, bool bIsAlarm)
        {
            int nTagNo = GetSensorTagNo(strReceiver, nChanel, nRelay, nLine, nDetector);
            if (nTagNo == -1)
                return;

            SensorTag sensorTag = FindSensor(nTagNo);

            if (sensorTag != null)
                m_parentManager.SendSensorData(sensorTag, bIsAlarm);
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
                    m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Safesystem, m_nServerSeqNo, $"TaesanProvider.cs > void FindSensor(int) : m_nServerSeqNo:{m_nServerSeqNo} server id not find");
            }

            if (m_dicTagNoSensorTags != null)
            {
                SensorTag sensorTag;

                if (m_dicTagNoSensorTags.TryGetValue(tagNo, out sensorTag))
                    return sensorTag;
            }

            return null;
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

        private void ProcessAllClear()
        {
            // 전체복구 처리해야 함
            int? nSiteID = null;

            // 원익의 경우 사이트별 클리어 신호
            if (m_parentManager.SiteID >= 30 && m_parentManager.SiteID <= 34)
                nSiteID = m_parentManager.SiteID;

            m_parentManager.SendAllClear(nSiteID);
        }

        public int GetSensorTagNo(string strReceiver, int nChanel, int nRelay, int nLine, int nDetector)
        {
            try
            {
                if (nChanel < 0 || nRelay < 0 || nLine < 0)
                {
                    throw new ApplicationException("");
                }
                // 1011223344, 10112233
                // 발신기=F-0(동)-1(채널)-15(중계기번호)-1(회로번호)
                // 감지기=F-1(동)-9(채널)-2(중계기번호)-1(회로번호)-66(도면감지기번호)

                int nReceiverNo = -1;
                if (strReceiver.Trim().ToUpper() == "경기도융합타운A")
                    nReceiverNo = 0;
                else if (strReceiver.Trim().ToUpper() == "경기도융합타운B")
                    nReceiverNo = 1;

                string strTagNo = "1" + nReceiverNo + nChanel.ToString().PadLeft(2, '0') + nRelay.ToString().PadLeft(2, '0') + nLine.ToString().PadLeft(2, '0');

                if (nDetector > 0)
                {
                    // 발신기는 감지기 번호가 없음
                    strTagNo += nDetector.ToString().PadLeft(2, '0');
                }
                
                if (int.TryParse(strTagNo, out int nTagNo))
                    return nTagNo;
                else
                    return -1;
            }
            catch (Exception)
            {
                m_parentManager.Logger.Write(LogTypes.Error, ServerTypes.Fire_Taesan, m_nServerSeqNo, 
                    $"TaesanProvider.cs > void GetSensorTagNo(string, string, string, string, string) : [{strReceiver},{nChanel},{nRelay},{nLine},{nDetector}]");
                return -1;
            }
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

            strLog = string.Format("[{2}] Recv from Server\r\nBytes Length : {0}\r\n{1}", len, strLog, GetServerText(ServerTypes.Fire_Taesan));
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Taesan, m_nServerSeqNo, strLog);
            System.Diagnostics.Trace.WriteLine(strLog);
        }

        private void WriteTextLog(string strLog)
        {
            strLog = string.Format("[{1}] Recv from Server : {0}", strLog, GetServerText(ServerTypes.Fire_Taesan));
            m_parentManager.Logger.Write(LogTypes.Info, ServerTypes.Fire_Taesan, m_nServerSeqNo, strLog);
            System.Diagnostics.Trace.WriteLine(strLog);
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

            return Encoding.GetEncoding(51949).GetString(trg);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="bytes"></param>
        /// <param name="nIndex"></param>
        /// <param name="nReceiverID">중계반 2bytes</param>
        /// <param name="nRelayID">Loop 1bytes</param>
        /// <param name="nLoopID">중계기 3bytes</param>
        /// <param name="nTagID">회로번호 1bytes</param>
        private void GetReceiverInfo(byte[] bytes, int nIndex, ref int nReceiverID, ref int nRelayTeam, ref int nLoopID, ref int nRelayID, ref int nTagID)
        {
            nReceiverID = AsciiToInt(bytes, nIndex, 2);  // 수신반
            nRelayTeam = AsciiToInt(bytes, nIndex + 2, 2);  // 중계반
            nLoopID = AsciiToInt(bytes, nIndex + 4, 1);  // Loop
            nRelayID = AsciiToInt(bytes, nIndex + 5, 3); // 중계기
            nTagID = AsciiToInt(bytes, nIndex + 8, 1);   // 회로번호
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

        /*private bool GetBytesBlock(byte[] bytes, ref int nIndex, ref int nBeginIndex, ref int nEndIndex)
        {
            m_arrTempReceived = null;

            int len = bytes.Length;
            //bool find = false;

            //for (int i = nIndex; i < len; i++)
            //{
            //    if (bytes[i] == BEGIN_BYTE)
            //    {
            //        nIndex = i;
            //        find = true;
            //        break;
            //    }
            //}

            //if (find == false)
            //    return false;

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
        }*/
    }
}
