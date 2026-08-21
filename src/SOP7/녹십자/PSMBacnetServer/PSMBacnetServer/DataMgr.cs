using dnsCommunicateSopServer;
using dnsDBUtil;
using SDMS.DAL;
using SDMS.IDAL;
using SDMS.Model.Alarm;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PSMBacnetServer
{
    public class DataMgr
    {
        public const string ALARM_METHOD = "POST";

        private IDataManager m_dataManager = null;
        private SopQueryManager m_SopQueryMgr = null;

        private Dictionary<string, bool> m_dicAlarmLogChk = new Dictionary<string, bool>();

        private Dictionary<string, List<string>> m_dicSensorGroup = null;
        public Dictionary<string, List<string>> DicSensorGroup
        {
            get { return m_dicSensorGroup; }
        }

        private Dictionary<string, PSM> m_dicPSMSensors = null;
        public Dictionary<string, PSM> DicPSMSensors
        {
            get { return m_dicPSMSensors; }
        }

        private string m_strAlarmPSMUrl = "";
        public string AlarmPSMUrl
        {
            get { return m_strAlarmPSMUrl; }
            set { m_strAlarmPSMUrl = value; }
        }

        public DataMgr(out string strErrorMessage)
        {
            strErrorMessage = null;

            if (InitDB(out strErrorMessage) == false)
                return;

            if (InitSensorGroup(out strErrorMessage) == false)
                return;

            if (LoadSensorList(out strErrorMessage) == false)
                return;

            InitURL();
            m_SopQueryMgr = new SopQueryManager();
        }

        private void InitURL()
        {
            string strAlarmPSMUrl = ConfigurationManager.AppSettings.Get("Alarm_PSM_URL");
            if (strAlarmPSMUrl == null || strAlarmPSMUrl.Length == 0)
                strAlarmPSMUrl = "http://172.30.10.9:44379/api/PSMSensor";

            m_strAlarmPSMUrl = strAlarmPSMUrl;
        }

        private bool InitDB(out string strErrorMessage)
        {
            strErrorMessage = null;
            string strSite = ConfigurationManager.AppSettings.Get("siteid");

            if (strSite == null || strSite.Length == 0)
            {
                strErrorMessage = "siteid 값을 확인해주세요.";
                return false;
            }
                

            int nSiteID, nDBType;

            if (int.TryParse(strSite, out nSiteID) == false)
            {
                strErrorMessage = "siteid 값을 확인해주세요.";
                return false;
            }

            string strWebServerURL = ConfigurationManager.AppSettings.Get("webserverURL");
            string strDBName = ConfigurationManager.AppSettings.Get("dbName");
            string strDBType = ConfigurationManager.AppSettings.Get("dbType");

            if (strWebServerURL == null || strWebServerURL.Length == 0 ||
                strDBName == null || strDBName.Length == 0 ||
                strDBType == null || strDBType.Length == 0)
            {
                strErrorMessage = "webserverURL, dbName, dbType 값을 확인해주세요.";
                return false;
            }

            if (int.TryParse(strDBType, out nDBType) == false)
            {
                strErrorMessage = "dbType 값을 확인해주세요.";
                return false;
            }

            string strDBHost = ConfigurationManager.AppSettings.Get("DB_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "AwVB0IrUXAghp5PlaWuqWg==";

            string strDBId = ConfigurationManager.AppSettings.Get("DB_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "GUk6cJACqVBoIFh7ny7mqQ==";

            string strDBPw = ConfigurationManager.AppSettings.Get("DB_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "SezOwMM9A2mIbUk5DCW/eQ==";

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim(), key);
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim(), key);
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim(), key);

            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            return true;
        }

        private bool InitSensorGroup(out string strErrorMessage)
        {
            strErrorMessage = null;

            string strSensorGroup = ConfigurationManager.AppSettings.Get("SensorGroup");
            strSensorGroup = strSensorGroup.Replace("\r\n", "");

            if (strSensorGroup == null || strSensorGroup.Length == 0)
            {
                strErrorMessage = "SensorGroup 값이 제대로 설정되지 않았습니다.";
                return false;
            }

            m_dicSensorGroup = new Dictionary<string, List<string>>();

            string[] tokens = strSensorGroup.Split(',');
            int nTokenCount = tokens.Length;

            int nTempCount = 0;

            for (int i = 0; i < nTokenCount; i++)
            {
                string strToken = tokens[i].Trim();

                int nIndex1 = strToken.IndexOf('(');
                int nIndex2 = strToken.IndexOf(')');

                if (nIndex1 < 0 || nIndex2 < nIndex1)
                    continue;

                string strAlarmKey = strToken.Substring(0, nIndex1).Trim();
                string strSensorList = strToken.Substring(nIndex1 + 1, nIndex2 - nIndex1 - 1).Trim();

                string[] strSensors = strSensorList.Split('|');
                List<string> listSensor = new List<string>();

                foreach (string strSensorKey in strSensors)
                {
                    listSensor.Add(strSensorKey);
                    nTempCount++;
                }

                m_dicSensorGroup[strAlarmKey] = listSensor;

            }

            return true;
        }

        public bool LoadSensorList(out string strErrorMessage)
        {
            Dictionary<PSM.Fields, object> dicConditions = new Dictionary<PSM.Fields, object>();
            string strAdditionalConditions = null;
            strErrorMessage = null;

            List<PSM> psmSensors = m_dataManager.GetSelectManager().SelectPSMSensors(dicConditions, strAdditionalConditions, out strErrorMessage);
            if (psmSensors == null)
                return false;

            m_dicPSMSensors = new Dictionary<string, PSM>();

            foreach (PSM sensor in psmSensors)
            {
                m_dicPSMSensors[sensor.UniqueKey] = sensor;
            }

            return true;
        }

        public bool CheckAlarmSensor(List<string> listSensorKeys, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<string, AlarmData> dicAlarms = null;  

            if (listSensorKeys.Count > 0)
            {
                string sensorIDs = "";

                foreach (string sensorKey in listSensorKeys)
                {
                    PSM sensor = m_dicPSMSensors[sensorKey];
                    if (sensor == null)
                        continue;

                    if (sensorIDs == "")
                        sensorIDs = sensor.ID.ToString();
                    else
                        sensorIDs = sensorIDs + "," + sensor.ID.ToString();
                }

                dicAlarms = GetAlarmList(sensorIDs, out strErrorMessage);

                if (dicAlarms == null)
                    return false;
            }

            foreach (string sensorKey in listSensorKeys)
            {
                PSM sensor = m_dicPSMSensors[sensorKey];
                if (sensor == null)
                    continue;

                if (sensor.Status == BacnetMgr.STATE_ALARM)
                {   // 알람 상태

                    // 알람 데이터 생성 후 알람 발생
                    AlarmData alarmData = GetAlarmData(sensorKey, out strErrorMessage);
                    if (alarmData == null)
                    {
                        return false;
                    }

                    alarmData.IsAlarm = true;

                    ArrayList arrData = new ArrayList();
                    arrData.Add(alarmData.SensorType);
                    arrData.Add(alarmData.SensorTagID);
                    arrData.Add(alarmData.SensorZoneID);
                    arrData.Add(alarmData.IsAlarm);

                    // 알람 신호 전송
                    m_SopQueryMgr.SendAlarmQuery(arrData, ALARM_METHOD, m_strAlarmPSMUrl);
                    // 알람 로그 작성
                    WriteAlarmLog(sensor, alarmData.IsAlarm);
                }
                else //if (sensor.Status == BacnetMgr.STATE_NORMAL)
                {   // 알람 해제 상태

                    // 알람이 존재한다면 알람 해제 
                    if (dicAlarms.ContainsKey(sensorKey))
                    {
                        AlarmData alarmData = dicAlarms[sensorKey];
                        alarmData.IsAlarm = false;

                        ArrayList arrData = new ArrayList();
                        arrData.Add(alarmData.SensorType);
                        arrData.Add(alarmData.SensorTagID);
                        arrData.Add(alarmData.SensorZoneID);
                        arrData.Add(alarmData.IsAlarm);

                        // 알람 신호 전송
                        m_SopQueryMgr.SendAlarmQuery(arrData, ALARM_METHOD, m_strAlarmPSMUrl);
                        // 알람 로그 작성
                        WriteAlarmLog(sensor, alarmData.IsAlarm);
                    }
                }

            }

            return true;
        }

        private void WriteAlarmLog(PSM sensor, bool bIsRun)
        {
            // 로그 체크
            string strUniqueKey = sensor.UniqueKey;
            string strAlarmLog = "";

            if (m_dicAlarmLogChk.ContainsKey(strUniqueKey) == false)
            {   // 처음 작성
                m_dicAlarmLogChk[strUniqueKey] = bIsRun;

                if (bIsRun == true)
                {   // 알람 발생
                    strAlarmLog = string.Format("{0} 알람이 발생하였습니다.", strUniqueKey);
                }
                else
                {   // 알람 중지
                    strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
                }

                // 로그 작성
                Logger.Instance.Write(strAlarmLog);
            }
            else
            {
                bool bAlarmLogChk = m_dicAlarmLogChk[strUniqueKey];

                if (bIsRun != bAlarmLogChk)
                {   // 상태 변화
                    m_dicAlarmLogChk[strUniqueKey] = bIsRun;

                    if (bIsRun == true)
                    {   // 알람 발생
                        strAlarmLog = string.Format("{0} 알람이 발생하였습니다.", strUniqueKey);
                    }
                    else
                    {   // 알람 중지
                        strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
                    }

                    // 로그 작성
                    Logger.Instance.Write(strAlarmLog);
                }
            }
        }

        public AlarmData GetAlarmData(string sensorKey, out string strErrorMessage)
        {
            strErrorMessage = null;
            AlarmData alarm = null;
            string strUrl = "";
            
            SensorZone sensorZone = null;
            TagInfo tagInfo = null;
            int nFacilityTypeID = -1;

            try
            {
                // 타입 ID 구하기
                //type = GetFacilityType(sensor.SensorName, out strErrorMessage);
                ArrayList arrResult = null;

                nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;
                string strAdditionalConditions = string.Format("{0}.{1} = '{2}'", PSM.TableName, PSM.Fields.UniqueKey, sensorKey);
                arrResult = m_dataManager.GetSelectManager().JoinSensorZoneTagInfoPSMMaterial(strAdditionalConditions, out strErrorMessage);

                if (arrResult == null)
                {
                    return alarm;
                }
                else if (arrResult.Count == 0)
                {
                    strErrorMessage = "JoinSensorZoneTagInfoPSMMaterial 조회 해당 값이 없습니다.";
                    return alarm;
                }

                sensorZone = arrResult[0] as SensorZone;
                tagInfo = arrResult[1] as TagInfo;
                Material mt = arrResult[2] as Material;

            }
            catch (Exception e)
            {
                Logger.Instance.Write("GetAlarmData 조회 실패 " + e.Message);
                return alarm;
            }

            alarm = new AlarmData();
            alarm.SensorZoneID = sensorZone.ID;
            alarm.SensorType = nFacilityTypeID;
            alarm.SensorTagID = tagInfo.ID;

            return alarm;
        }

        public bool UpdateSensorData(List<string> listSensorKeys, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (string sensorKey in listSensorKeys)
            {
                PSM sensor = m_dicPSMSensors[sensorKey];
                if (sensor == null)
                    continue;

                Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();
                dicSets[PSM.Fields.CurrentData] = sensor.CurrentData;
                dicSets[PSM.Fields.Status] = sensor.Status;

                Dictionary<PSM.Fields, object> dicConditions = new Dictionary<PSM.Fields, object>();
                dicConditions[PSM.Fields.ID] = sensor.ID;

                //if (m_dataManager.GetUpdateManager().UpdatePSMSensor(sensor, out strErrorMessage) == false)
                if (m_dataManager.GetUpdateManager().UpdatePSMSensor(dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    return false;
                }
            }
                
            return true;
        }

        // 알람 리스트 조회
        public Dictionary<string, AlarmData> GetAlarmList(string sensorIDs, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<string, AlarmData> dicAlarms = new Dictionary<string, AlarmData>();
            try
            {
                string strAdditionalConditions = string.Format("{0}.{1} = {2} And {3}.{4} in ({5})", CurrentAlarm.TableName, CurrentAlarm.Fields.SensorType, (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR,
                SensorZone.TableName, SensorZone.Fields.OrgSensorID, sensorIDs);
                ArrayList arrResult = m_dataManager.GetSelectManager().JoinCurrentAlarmSensorZoneHistorySensorZoneTagInfo(strAdditionalConditions, out strErrorMessage);
                if (arrResult == null)
                {
                    return null;
                }
                else if (arrResult.Count == 0)
                {
                    return dicAlarms;
                }

                for (int i = 0; i < arrResult.Count; i += 4)
                {
                    CurrentAlarm current = arrResult[i] as CurrentAlarm;
                    SensorZoneHistory sensorZoneHistory = arrResult[i + 1] as SensorZoneHistory;
                    SensorZone sensorZone = arrResult[i + 2] as SensorZone;
                    TagInfo tagInfo = arrResult[i + 3] as TagInfo;

                    // 수동신고 제외
                    if (sensorZone.OrgSensorID == null)
                        continue;

                    PSM psmSensor = m_dataManager.GetSelectManager().SelectPSMSensor((int)sensorZone.OrgSensorID, out strErrorMessage);

                    AlarmData alarm = new AlarmData();
                    alarm.SensorType = sensorZone.SensorType;
                    alarm.SensorZoneID = sensorZone.ID;
                    alarm.SensorTagID = tagInfo.ID;
                    alarm.UniqueKey = psmSensor.UniqueKey;

                    //alarms.Add(alarm);
                    dicAlarms[psmSensor.UniqueKey] = alarm;
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("GetAlarmList 실패 (예외: " + e.Message + ")");
                return null;
            }

            return dicAlarms;
        }
    }

    public class AlarmData
    {
        private int m_nSensorType = -1;
        private int m_nSensorTagID = -1;
        private int m_nSensorZoneID = -1;
        private bool m_bIsAlarm = false;
        //private string m_strUrl = "";
        private string m_strUniqueKey = null;


        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int SensorTagID
        {
            get { return m_nSensorTagID; }
            set { m_nSensorTagID = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public bool IsAlarm
        {
            get { return m_bIsAlarm; }
            set { m_bIsAlarm = value; }
        }

        //public string URL
        //{
        //    get { return m_strUrl; }
        //    set { m_strUrl = value; }
        //}

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
        }
    }
}
