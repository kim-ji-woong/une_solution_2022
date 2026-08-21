using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSopID;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using static dnsData.Sensor.Facility;
using static dnsSopID.ID;
using dnsTcpLib2;

namespace IntegrationServer.Servers.EmergencyBell.ITSeng
{
    public class ITSengManager : IServer
    {
        #region IServer 인터페이스
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo => m_nServerSeqNo;

        public ID.ServerTypes ServerType => ID.ServerTypes.EmergencyBell_ITSeng;

        private string m_strServerAlias = string.Empty;
        public string ServerAlias => m_strServerAlias;

        public bool IsConnected => false;

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            m_provider = new ServiceProvider(this);
            m_server = new TcpServer(m_provider, m_nPort);
            m_server.Start();
        }

        public void Stop()
        {
            m_server.Stop();
        }
        #endregion

        private DataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;
        // ITS 비상벨은 Tcp 서버이기 때문에 여러개를 실행시킬수 없다.
        // 따라서, 여러 Site에서 사용할 경우를 위하여 SiteID를 multi로 사용하도록 한다.
        private List<int> m_siteIDs = new List<int>();
        //private int m_nSiteID = -1;
        private string m_strServerIP = string.Empty;
        private int m_nPort = -1;

        // 현재 DB에 저장된 상태값
        private bool m_bDBConnectState = false;

        private string m_strOnText = "Type=ALERT";
        private string m_strOffText = "Type=OFF";

        private TcpServer m_server = null;
        private ServiceProvider m_provider = null;

        // 비상벨 센서 목록
        // Key : SensorTag.ID
        private Dictionary<int, SensorTag> m_dicSensorTags = new Dictionary<int, SensorTag>();
        // Key : SensorTag.Description
        private Dictionary<string, SensorTag> m_dicSensorTags2 = new Dictionary<string, SensorTag>();

        public ITSengManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nSiteID, int nServerSeqNo, string strServerIP, int nPort,  string strServerAlias)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            SetSiteIDs(nSiteID);
            //m_nSiteID = nSiteID;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerIP = strServerIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;

            LoadSensors();
            //m_dicSensorTags = SensorManager.LoadSensors(m_dataManager, m_nSiteID, (int)dnsData.Sensor.Facility.FacilityType.EmergencyBell);
            SetSensorTags(m_dicSensorTags);
        }

        // SiteID 값의 범위가 1 ~ 99라고 가정하고
        // 여러개일때 다음과 같은 방법으로 조합한다.
        // 1, 3, 35, 78 => 1033578
        private void SetSiteIDs(int nSiteID)
        {
            int size = ((int)Math.Log10(nSiteID)) + 1;

            int target = 100;

            for (int i = 0; i < size; i += 2)
            {
                int siteID = nSiteID % target;
                m_siteIDs.Add(siteID);

                nSiteID = nSiteID / target;
            }
        }

        private void LoadSensors()
        {
            m_dicSensorTags.Clear();

            foreach (int siteID in m_siteIDs)
            {
                Dictionary<int, SensorTag> dicSensorTags = SensorManager.LoadSensors(m_dataManager, siteID, (int)dnsData.Sensor.Facility.FacilityType.EmergencyBell);

                if (dicSensorTags != null)
                {
                    foreach (KeyValuePair<int, SensorTag> pair in dicSensorTags)
                    {
                        m_dicSensorTags[pair.Key] = pair.Value;
                    }
                }
            }
        }

        private void SetSensorTags(Dictionary<int, SensorTag> dicSensorTags)
        {
            if (dicSensorTags != null)
            {
                foreach (KeyValuePair<int, SensorTag> pair in dicSensorTags)
                {
                    if (pair.Value.Description != null)
                        m_dicSensorTags2[pair.Value.Description] = pair.Value;
                }
            }
        }

        public void ProcessData(string strRecvData)
        {
            if (strRecvData != null)
                this.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "[Received] " + strRecvData);

            string strType = string.Empty;

            bool? isAlarm = null;
            if (strRecvData.Contains(m_strOnText))
            {
                isAlarm = true;
                strType = m_strOnText;
            }
            else if (strRecvData.Contains(m_strOffText))
            {
                isAlarm = false;
                strType = m_strOffText;
            }

            if (isAlarm == null)
                return;

            int nTypeIndex = strRecvData.IndexOf(strType);
            string strValue = strRecvData.Substring(nTypeIndex + strType.Length, strRecvData.Length - (nTypeIndex + strType.Length));
            string[] strSplit = strValue.Split('#');

            int nSplitLength = strSplit.Length;
            for (int i = 0; i < nSplitLength; i++)
            {
                string temp = strSplit[i];
                if (temp.Length == 0)
                    continue;

                int nLastIndex = temp.LastIndexOf('&');
                string strName = temp.Substring(nLastIndex + 1);

                SensorTag sensorTag = FindSensor(strName);
                if (sensorTag == null)
                    continue;

                if (sensorTag != null)
                {
                    string strLog = string.Format("SensorZone ID({0}) {1}", sensorTag.SensorZoneID, (bool)isAlarm ? "알람" : "알람해제");
                    this.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, strLog);
                }
                else
                {
                    string strLog = string.Format("Not Found SensorZone({0}), m_dicSensorTags2.Count : {1}", strName, m_dicSensorTags2.Count);
                    this.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, strLog);
                }

                SendSensorData(sensorTag, (bool)isAlarm);
            }

        }

        private SensorTag FindSensor(string strSensorName)
        {
            SensorTag tag;

            if (m_dicSensorTags2.TryGetValue(strSensorName, out tag))
                return tag;
            /*Dictionary<int, SensorTag> dicSensors = SensorManager.Instance.FindSensors(m_nServerSeqNo);
            foreach (KeyValuePair<int, SensorTag> pair in dicSensors)
            {
                if (strSensorName == pair.Value.Description)
                    return pair.Value;
            }*/

            return null;
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

            strLog = $"Recv Bytes : {strLog}";
            this.Logger.Write(LogTypes.Info, ServerTypes.EmergencyBell_ITSeng, m_nServerSeqNo, strLog);
        }

        public bool SendSensorData(SensorTag sensorTag, bool bIsAlarm)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, (int)FacilityType.EmergencyBell, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm);
        }

        public void SendSensorDataAsync(SensorTag sensorTag, bool bIsAlarm)
        {
            m_serverManager.SendSensorDataAsync(m_sopQueryManager, (int)FacilityType.EmergencyBell, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm);
        }

        public void WriteLog(string strLog, LogTypes logTypes = LogTypes.Info)
        {
            this.Logger.Write(logTypes, ServerTypes.EmergencyBell_ITSeng, m_nServerSeqNo, strLog);
        }
    }
}
