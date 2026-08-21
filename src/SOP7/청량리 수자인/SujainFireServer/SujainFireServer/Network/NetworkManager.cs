using SujainFireServer.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using TcpLib2;

namespace SujainFireServer.Network
{
    public class NetworkManager
    {
        private WebDataManager m_webDataManager = null;
        private ExternalManager m_externalManager = null;

        private TcpServer Server;
        private DefaultServiceProvider Provider;

        private static NetworkManager m_instance = null;
        public static NetworkManager Instance
        {
            get { return m_instance; }
        }

        public NetworkManager(WebDataManager webDataManager, ExternalManager externalManager)
        {
            m_instance = this;
            m_webDataManager = webDataManager;
            m_externalManager = externalManager;

            Init();
        }

        private void Init()
        {
            // 서버 포트
            int nServerPort = 29712;

            string strServerPort = ConfigurationManager.AppSettings.Get("ServerPort");
            if (int.TryParse(strServerPort.Trim(), out int nTempPort))
                nServerPort = nTempPort;

            // 서버 연결
            Provider = new DefaultServiceProvider();
            Server = new TcpServer(Provider, nServerPort);
            Server.Start();
        }

        public void OnReceive(ConnectionState state, byte[] receivedData)
        {
            string strErrorMessage = "";

            if (receivedData == null)
            {
                strErrorMessage = "1. OnReceive Error (수신된 바이트 배열 데이터가 없습니다.)";
                Logger.Instance.Write(strErrorMessage);
                return;
            }


            List<string> eventList = null;
            List<EventInfo> eventInfoList = null;

            bool bIsAllClear = false;

            try
            {
                string strReceived = Encoding.Default.GetString(receivedData, 0, receivedData.Length);

                string strLog = string.Format("receivedData: {0}", strReceived);
                Logger.Instance.Write(strLog);

                eventList = ParsingStringEvent(strReceived, out strErrorMessage);
                if (eventList == null)
                {
                    strErrorMessage = "2. OnReceive Error (ParsingStringEvent Return null : " + strErrorMessage + ")";
                    Logger.Instance.Write(strErrorMessage);
                    return;
                }

                eventInfoList = ParsingXMLEvent(eventList, out bIsAllClear, out strErrorMessage);
                if (eventInfoList == null)
                {
                    strErrorMessage = "3. OnReceive Error (ParsingXMLEvent Return null : " + strErrorMessage + ")";
                    Logger.Instance.Write(strErrorMessage);
                    return;
                }


                // 센서 및 해당 Zone 조회
                if (m_webDataManager.GetSensorInfo(eventInfoList, bIsAllClear, out strErrorMessage) == false)
                {
                    strErrorMessage = "4. OnReceive Error (GetSensorInfo fail: " + strErrorMessage + ")";
                    Logger.Instance.Write(strErrorMessage);
                    return;
                }


                // 알람 신호 전송 처리
                if (m_webDataManager.SendAlarms(eventInfoList, bIsAllClear, out strErrorMessage) == false)
                {
                    strErrorMessage = "5. OnReceive Error (SendAlarms fail: " + strErrorMessage + ")";
                    Logger.Instance.Write(strErrorMessage);
                    return;
                }

                // SI DB 데이터 추가
                if (m_externalManager.SendExternalAlarms(eventInfoList, bIsAllClear, out strErrorMessage) == false)
                {
                    strErrorMessage = "6. OnReceive Error (SendAlarms fail: " + strErrorMessage + ")";
                    Logger.Instance.Write(strErrorMessage);
                    return;
                }




            }
            catch (Exception ex)
            {
                strErrorMessage = "7. OnReceive Error (예외발생: " + ex.Message + ")";
                Logger.Instance.Write(strErrorMessage);
                return;
            }

        }

        private List<string> ParsingStringEvent(string strReceivedData, out string strErrorMessage)
        {
            List<string> eventList = null;
            strErrorMessage = "";

            if (strReceivedData == null | strReceivedData == "")
            {
                strErrorMessage = "1. ParsingStringEvent Error (ReceivedData 데이터가 존재하지 않습니다.)";
                return null;
            }

            eventList = new List<string>();

            // <cml> 태그로 문자열 자르기
            // 1. </cml> 유무 확인
            while (strReceivedData.Contains("</cmx>"))
            {
                // 2. </cml> 위치 값 찾기 및 문자열 끝지점인지 확인
                int nIdx = strReceivedData.IndexOf("</cmx>");

                // 6 글자
                if (strReceivedData.Length == (nIdx + 6))
                {   // 3-1. 끝 지점일 경우 그 자체로 넣기
                    if (strReceivedData.Contains("<cmx>") && strReceivedData.Contains("</cmx>"))
                        eventList.Add(strReceivedData);
                    break;
                }
                else
                {   // 3-2. 아닐 경우 찾은 위치까지 자르고, 나머지 문자열 잘라서 다시 패턴 반복
                    string strCMX = strReceivedData.Substring(0, nIdx + 6);
                    if (strCMX.Contains("<cmx>") && strCMX.Contains("</cmx>"))
                        eventList.Add(strCMX);

                    strReceivedData = strReceivedData.Substring(nIdx + 6);
                }
            }

            return eventList;
        }

        private List<EventInfo> ParsingXMLEvent(List<string> eventList, out bool bIsALL, out string strErrorMessage)
        {
            strErrorMessage = "";
            bIsALL = false;
            List<EventInfo> eventInfos = null;

            if (eventList == null)
            {
                strErrorMessage = "1. ParsingXMLEvent Error (eventList 데이터가 존재하지 않습니다.)";
                return null;
            }

            eventInfos = new List<EventInfo>();

            foreach (string strCMX in eventList)
            {
                XElement xTemp = XElement.Parse(strCMX);

                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(strCMX);

                foreach (XmlNode rootNode in xmlDoc.ChildNodes)
                {
                    if (rootNode.Name == "cmx")
                    {
                        foreach (XmlNode cmxNode in rootNode.ChildNodes)
                        {
                            if (cmxNode.Name == "fire")
                            {
                                string strC1 = null;
                                string strC2 = null;
                                string strC3 = null;
                                string strC4 = null;
                                string strEmergency = null;

                                foreach (XmlNode fireNode in cmxNode.ChildNodes)
                                {
                                    if (fireNode.Name == "c1")
                                    {
                                        strC1 = fireNode.InnerText;
                                    }
                                    else if (fireNode.Name == "c2")
                                    {
                                        strC2 = fireNode.InnerText;
                                    }
                                    else if (fireNode.Name == "c3")
                                    {
                                        strC3 = fireNode.InnerText;
                                    }
                                    else if (fireNode.Name == "c4")
                                    {
                                        strC4 = fireNode.InnerText;
                                    }
                                    else if (fireNode.Name == "emergency")
                                    {
                                        strEmergency = fireNode.InnerText;
                                    }
                                }

                                if (strC1 == "ALL" && strEmergency == "2")
                                {   // 전체 복구 신호
                                    if (int.TryParse(strEmergency, out int nEmergency))
                                    {
                                        bIsALL = true;

                                        EventInfo info = new EventInfo();
                                        info.IsALL = true;
                                        info.Emergency = nEmergency;

                                        eventInfos.Add(info);
                                    }
                                }
                                else if (strC1 != "ALL" && strC1 != null && strC2 != null && strC3 != null && strC4 != null && strEmergency != null
                                    && int.TryParse(strC1, out int nC1)
                                    && int.TryParse(strC2, out int nC2)
                                    && int.TryParse(strC3, out int nC3)
                                    && int.TryParse(strC4, out int nC4))
                                {   // 개별 신호
                                    
                                    // 태그번호 (1 + 000 (수신기) + 0 (계통) + 000 (중계기) + 0 (넘버))
                                    string strTagNum = "1" + nC1.ToString("D3") + nC2.ToString() + nC3.ToString("D3") + nC4.ToString();

                                    if (int.TryParse(strTagNum, out int nTagNum) &&
                                        int.TryParse(strEmergency, out int nEmergency))
                                    {
                                        EventInfo info = new EventInfo();
                                        info.TagNum = nTagNum;
                                        info.Emergency = nEmergency;

                                        eventInfos.Add(info);
                                    }
                                }
                            }
                        }
                    }

                }
            }

            return eventInfos;
        }
    }
}
