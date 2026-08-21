using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.Sensor;
using dnsSopID;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using IntegrationServer.ViewModels.Sdms;
using Nipa.Model.Sdms.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using static dnsSopID.ID;

namespace IntegrationServer.Servers.Fire.JTECH
{
    class JTECHManager : IServer
    {
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ID.ServerTypes ServerType { get { return ServerTypes.Fire_JTECH; } }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        private bool m_isStarted = false;
        public bool IsConnected { get { return m_isStarted; } }

        public Logger Logger { get; set; }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager() { return m_serverManager; }

        private ClientProvider m_provider = null;
        private SopQueryManager m_sopQueryManager = null;

        private DataManager m_dataManager = null;
        public DataManager DataManager { get { return m_dataManager; } }

        public string ServerIP { get; set; }
        // 모드버스 기본 Port
        private int m_nPort = 502;
        public int Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

        public string SOPWebServerURL { get; set; }

        private int m_nSiteID = -1;
        public int SiteID { get { return m_nSiteID; } }

        private bool m_use = false;
        public bool Use { get { return m_use; } }

        private Dictionary<int, bool> m_dicAlarms = new Dictionary<int, bool>();

        public JTECHManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strServerIP, int nPort, string strServerAlias, bool use)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_nServerSeqNo = nServerSeqNo;

            this.ServerIP = strServerIP;
            m_nPort = nPort;
            m_strServerAlias = strServerAlias;

            this.SOPWebServerURL = strSOPWebServerURL;
            m_nSiteID = nSiteID;
            m_use = use;

            m_provider = new ClientProvider(this, m_nServerSeqNo);
            m_provider.LengthAdd = false;
        }

        public void Start()
        {
            // 현재 DB 알람을 확인한다.
            CheckPrevAlarm();

            m_provider.Start();
            m_isStarted = true;
        }

        public void Stop()
        {
            m_provider.Stop();
            m_isStarted = false;
        }

        private void CheckPrevAlarm()
        {
            string strErrorMessage;

            List<int> alarmTagNos = GetCurrentAlarmTagNos(m_dataManager, out strErrorMessage);
            if (alarmTagNos == null)
            {
                WriteLog($"GetCurrentAlarmTagNos 오류 ({strErrorMessage})", LogTypes.Error);
            }
            else
            {
                m_dicAlarms = new Dictionary<int, bool>();

                foreach (int nTagNo in alarmTagNos)
                {
                    m_dicAlarms[nTagNo] = true;
                }
            }
        }

        public void CheckAlarm(byte[] arrData, bool bIsReverse = true) 
        {           
            try
            {
                bool? checkAlarmOption = null;

                int nDataLeng = arrData.Length;
                int nStartAddr = 0;

                if (nDataLeng == ClientProvider.ReqLengLine1_2 * ClientProvider.RegisterLength)
                {   // 1번 2계통
                    nStartAddr = (int)ClientProvider.StartAddrLine1_2;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine2_1 * ClientProvider.RegisterLength)
                {   // 2번 1계통
                    nStartAddr = (int)ClientProvider.StartAddrLine2_1;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine2_2 * ClientProvider.RegisterLength)
                {   // 2번 2계통
                    nStartAddr = (int)ClientProvider.StartAddrLine2_2;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine2_3 * ClientProvider.RegisterLength)
                {   // 2번 3계통
                    nStartAddr = (int)ClientProvider.StartAddrLine2_3;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine2_4 * ClientProvider.RegisterLength)
                {   // 2번 4계통
                    nStartAddr = (int)ClientProvider.StartAddrLine2_4;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine3_1 * ClientProvider.RegisterLength)
                {   // 3번 1계통
                    nStartAddr = (int)ClientProvider.StartAddrLine3_1;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine3_2 * ClientProvider.RegisterLength)
                {   // 3번 2계통
                    nStartAddr = (int)ClientProvider.StartAddrLine3_2;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine3_3 * ClientProvider.RegisterLength)
                {   // 3번 3계통
                    nStartAddr = (int)ClientProvider.StartAddrLine3_3;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine4_1 * ClientProvider.RegisterLength)
                {   // 4번 1계통
                    nStartAddr = (int)ClientProvider.StartAddrLine4_1;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine4_2 * ClientProvider.RegisterLength)
                {   // 4번 2계통
                    nStartAddr = (int)ClientProvider.StartAddrLine4_2;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine4_3 * ClientProvider.RegisterLength)
                {   // 4번 3계통
                    nStartAddr = (int)ClientProvider.StartAddrLine4_3;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine4_4 * ClientProvider.RegisterLength)
                {   // 4번 4계통
                    nStartAddr = (int)ClientProvider.StartAddrLine4_4;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine5_1 * ClientProvider.RegisterLength)
                {   // 5번 1계통
                    nStartAddr = (int)ClientProvider.StartAddrLine5_1;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine5_2 * ClientProvider.RegisterLength)
                {   // 5번 2계통
                    nStartAddr = (int)ClientProvider.StartAddrLine5_2;
                }
                else if (nDataLeng == ClientProvider.ReqLengLine5_3 * ClientProvider.RegisterLength)
                {   // 5번 3계통
                    nStartAddr = (int)ClientProvider.StartAddrLine5_3;
                }
                else
                {   
                    throw new ApplicationException("데이터 갯수가 맞지 않습니다.");
                }


                for (int i = 0; i < nDataLeng; i += ClientProvider.RegisterLength)
                {
                    // 알람 체크 후
                    byte[] arrByte = new byte[ClientProvider.RegisterLength];
                    Array.Copy(arrData, i, arrByte, 0, ClientProvider.RegisterLength);

                    if (bIsReverse)
                    {
                        Array.Reverse(arrByte);
                    }


                    BitArray bitArr = new BitArray(arrByte);
                    

                    bool isAlarm = bitArr[11];  // 입력 FLAG


                    int nTagNo = nStartAddr;
                    if (i > 0)
                        nTagNo = nStartAddr + (i / ClientProvider.RegisterLength);

                    if (isAlarm == true)
                    {   // 1. 알람 발생

                        // 알람 발생 중인지 아닌지 확인
                        if (m_dicAlarms.ContainsKey(nTagNo) == false || m_dicAlarms[nTagNo] != true)
                        {   // 발생 중이 아니라면
                           
                            SensorTag sensorTag = SensorManager.Instance.FindSensor(m_nServerSeqNo, nTagNo);
                            if (sensorTag != null)
                            {
                                // 알람 발생 전송
                                if (m_serverManager.SendSensorData(m_sopQueryManager, (int)Facility.FacilityType.FIRE_SENSOR, sensorTag.ID, sensorTag.SensorZoneID, true))
                                {
                                    if (checkAlarmOption == null)
                                        checkAlarmOption = CheckAlarmReceiveOption(m_dataManager, m_nSiteID);

                                    if (checkAlarmOption == true)
                                    {
                                        SendMqtt(sensorTag, true);
                                        WriteLog($"화재 알람 발생 (SendSensorData 성공, Tag ID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID})", LogTypes.Info);
                                    }

                                    // 알람 데이터 저장
                                    m_dicAlarms[nTagNo] = true;
                                }
                            }
                            else
                            {
                                WriteLog("JTECHManager CheckAlarm() Error : TagNo 해당 센서를 찾을 수 없습니다. " + nTagNo, LogTypes.Error);
                            }                           
                        }
                    }
                    else
                    {    // 2. 알람 해제

                        // 알람 발생 중인지 확인
                        if (m_dicAlarms.ContainsKey(nTagNo) == true && m_dicAlarms[nTagNo] == true)
                        {   // 발생 중이라면

                            SensorTag sensorTag = SensorManager.Instance.FindSensor(m_nServerSeqNo, nTagNo);
                            if (sensorTag != null)
                            {
                                if (m_serverManager.SendSensorData(m_sopQueryManager, (int)Facility.FacilityType.FIRE_SENSOR, sensorTag.ID, sensorTag.SensorZoneID, false))
                                {
                                    SendMqtt(sensorTag, false);
                                    WriteLog($"화재 알람 해제 (SendSensorData 성공, Tag ID: {sensorTag.ID}, SensorZoneID: {sensorTag.SensorZoneID})", LogTypes.Info);

                                    // 알람 데이터 삭제
                                    m_dicAlarms[nTagNo] = false;
                                }
                            }
                            else
                            {
                                WriteLog("JTECHManager CheckAlarm() Error : TagNo 해당 센서를 찾을 수 없습니다. " + nTagNo, LogTypes.Error);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                WriteLog("JTECHManager CheckAlarm() Exception : " + e.Message, LogTypes.Error);
            }
        }

        public static bool CheckAlarmReceiveOption(IDataManager dataManager, int siteID)
        {
            string strCondition = string.Format("{0} = 'UseReceiveFire' and {1} = {2}",
                ViewModels.Option.OptionSDMS.Fields.PropertyName,
                ViewModels.Option.OptionSDMS.Fields.SiteID,
                siteID);

            string strErrorMessage;
            IEnumerable<ViewModels.Option.OptionSDMS> options = dataManager.GetSelect().Select<ViewModels.Option.OptionSDMS>(strCondition, out strErrorMessage);

            if (options == null)
                return false;

            foreach (var option in options)
            {
                if (option.PropertyValue == null)
                    continue;

                if (option.PropertyValue == "1")
                    return true;
                else if (option.PropertyValue == "0")
                    return false;

                string strValue = option.PropertyValue.ToLower();

                if (strValue == "true")
                    return true;
                else if (strValue == "false")
                    return false;
            }

            return false;
        }


        public static List<int> GetCurrentAlarmSensorZoneIDs(DataManager dataManager, out string strErrorMessage)
        {
            string strSQL = string.Format("Select {0} sensorZoneIDs from {1}", CurrentAlarm.Fields.AlarmSensorZoneIDs, CurrentAlarm.TableName);
            IEnumerable<dynamic> results = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return null;

            Dictionary<int, int> dicSensorZoneIDs = new Dictionary<int, int>();

            foreach (var item in results)
            {
                string strSensorZoneIDs = item.sensorZoneIDs;

                if (strSensorZoneIDs == null || strSensorZoneIDs.Length == 0)
                    continue;

                string[] tokens = strSensorZoneIDs.Split(',');

                int sensorZoneID;

                foreach (string strToken in tokens)
                {
                    if (int.TryParse(strToken.Trim(), out sensorZoneID))
                        dicSensorZoneIDs[sensorZoneID] = sensorZoneID;
                }
            }

            List<int> sensorZoneIDs = new List<int>();
            sensorZoneIDs.AddRange(dicSensorZoneIDs.Keys);
            return sensorZoneIDs;
        }

        public List<int> GetCurrentAlarmTagNos(DataManager dataManager, out string strErrorMessage)
        {
            List<int> tagNos = new List<int>();

            List<int> sensorZoneIDs = AlarmManager.GetCurrentAlarmSensorZoneIDs(dataManager, out strErrorMessage);
            if (sensorZoneIDs == null)
                return null;
            else if (sensorZoneIDs.Count == 0)
                return tagNos;

            Dictionary<int, int> dicTagNos = new Dictionary<int, int>();

            string strSQL = string.Format($"SELECT {TagInfo.TableName}.{TagInfo.Fields.TagNo} " +
               $"FROM {TagInfo.TableName}, {SensorZone.TableName}, {ViewModels.Sdms.Sensor.Fire.TableName} " +
               $"WHERE {ViewModels.Sdms.Sensor.Fire.TableName}.{ViewModels.Sdms.Sensor.Fire.Fields.SiteID} = {m_nSiteID} " +
               $"AND {SensorZone.TableName}.{SensorZone.Fields.OrgSensorID} = {ViewModels.Sdms.Sensor.Fire.TableName}.{ViewModels.Sdms.Sensor.Fire.Fields.ID} " +
               $"AND {SensorZone.TableName}.{SensorZone.Fields.SensorType} = {(int)Facility.FacilityType.FIRE_SENSOR} " +
               $"AND {TagInfo.TableName}.{TagInfo.Fields.SensorZoneID} = {SensorZone.TableName}.{SensorZone.Fields.ID} " +
               $"AND {TagInfo.TableName}.{TagInfo.Fields.SensorZoneID} IN ({string.Join(',', sensorZoneIDs)})");

            IEnumerable<dynamic> results = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return null;

            foreach (var item in results)
            {
                int nTagNo = item.TagNo;

                dicTagNos[nTagNo] = nTagNo;
            }

            tagNos.AddRange(dicTagNos.Keys);
            return tagNos;
        }

        // 피난유도 신호를 보낸다.
        private void SendMqtt(SensorTag sensorTag, bool isAlarm)
        {
            // 피난유도 시스템에 화재신호를 보낸다.
            MQTT.Corners.MqttManager mgr = MQTT.Corners.MqttManager.GetInstance(m_nSiteID);

            if (mgr != null)
            {
                string strTagNo = sensorTag.TagNo.ToString();
                mgr.Publish(strTagNo, isAlarm);

                if (isAlarm)
                    WriteLog("화재신호 대피유도 시스템에 전송, TagNo: " + strTagNo, LogTypes.Info);
                else
                    WriteLog("화재복구 대피유도 시스템에 전송, TagNo: " + strTagNo, LogTypes.Info);
            }
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = Logger.GetByteString(bytes, nIndex, len);
            WriteLog(strTag + " : " + strBytesLog, LogTypes.Info);
            return strTag + " : " + strBytesLog;
        }
    }
}
