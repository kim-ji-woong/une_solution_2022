using dnsDBUtil;
using SDMS.DAL;
using SDMS.Model.Alarm;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;

namespace SoulbrainWebSensorServer
{
    public class WSopDataManager
    {
        private DataManager m_dataManager = null;
        private TeamEditor.DAL.DataManager m_memberDataManager = null;
        //private WebDBManager m_dbManager = null;
        private LogManager m_logMgr = new LogManager();

        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        private List<string> m_listETCSensors = null;
        public List<string> ETCSensors
        {
            get { return m_listETCSensors; }
        }

        private List<string> m_listPSMSensors = null;
        public List<string> PSMSensors
        {
            get { return m_listPSMSensors; }
        }

        private int m_nRegularMemberMaxID = 0;
        public int RegularMemberMaxID
        {
            get { return m_nRegularMemberMaxID; }
            set { m_nRegularMemberMaxID = value; }
        }

        private string m_strAlarmETCUrl = "";
        public string AlarmETCUrl
        {
            get { return m_strAlarmETCUrl; }
            set { m_strAlarmETCUrl = value; }
        }

        private string m_strAlarmPSMUrl = "";
        public string AlarmPSMUrl
        {
            get { return m_strAlarmPSMUrl; }
            set { m_strAlarmPSMUrl = value; }
        }

        public WSopDataManager(DataManager dataManager, TeamEditor.DAL.DataManager memberDataManager)
        {
            //m_dbManager = dbManager;
            m_dataManager = dataManager;
            m_memberDataManager = memberDataManager;

            InitURL();

            // 기존 생성된 ETC 및 PSM 센서 불러오기
            LoadETCSensors();
            LoadPSMSensors();
        }

        private void InitURL()
        {
            string strAlarmETCUrl = ConfigurationManager.AppSettings.Get("Alarm_ETC_URL");
            if (strAlarmETCUrl == null || strAlarmETCUrl.Length == 0)
                strAlarmETCUrl = "http://192.168.254.201:44379/api/EtcSensor";

            string strAlarmPSMUrl = ConfigurationManager.AppSettings.Get("Alarm_PSM_URL");
            if (strAlarmPSMUrl == null || strAlarmETCUrl.Length == 0)
                strAlarmPSMUrl = "http://192.168.254.201:44379/api/PSMSensor";

            m_strAlarmETCUrl = strAlarmETCUrl;
            m_strAlarmPSMUrl = strAlarmPSMUrl;
        }

        private void LoadETCSensors()
        {
            m_listETCSensors = new List<string>();

            Dictionary<ETC.Fields, object> dicConditions_ETC = new Dictionary<ETC.Fields, object>();
            string strAdditionalConditions = "";
            string strErrorMessage = "";

            List<ETC> listETCSensors = m_dataManager.GetSelectManager().SelectETCSensors(dicConditions_ETC, strAdditionalConditions, out strErrorMessage);

            if (listETCSensors == null)
                return;

            foreach (ETC sensor in listETCSensors)
            {
                string strUniqueKey = sensor.UniqueKey;

                int nIdx = strUniqueKey.LastIndexOf("_");
                if (nIdx != -1)
                {
                    strUniqueKey = strUniqueKey.Substring(0, nIdx);

                    if (m_listETCSensors.Contains(strUniqueKey) == false)
                        m_listETCSensors.Add(strUniqueKey);
                }
            }
        }

        private void LoadPSMSensors()
        {
            m_listPSMSensors = new List<string>();

            Dictionary<PSM.Fields, object> dicConditions_PSM = new Dictionary<PSM.Fields, object>();
            string strAdditionalConditions = "";
            string strErrorMessage = "";

            List<PSM> listPSMSensors = m_dataManager.GetSelectManager().SelectPSMSensors(dicConditions_PSM, strAdditionalConditions, out strErrorMessage);

            if (listPSMSensors == null)
                return;

            foreach (PSM sensor in listPSMSensors)
            {
                string strUniqueKey = sensor.UniqueKey;

                int nIdx = strUniqueKey.LastIndexOf("_");
                if (nIdx != -1)
                {
                    strUniqueKey = strUniqueKey.Substring(0, nIdx);

                    if (m_listPSMSensors.Contains(strUniqueKey) == false)
                        m_listPSMSensors.Add(strUniqueKey);
                }

                //if (!m_listPSMSensors.Contains(sensor.UniqueKey))
                //    m_listPSMSensors.Add(sensor.UniqueKey);
            }
        }

        // 정규조직 불러오기
        public bool LoadRegular(out List<Regular> regulars, out string strErrorMessage)
        {
            strErrorMessage = "";
            regulars = m_memberDataManager.GetSelectManager().SelectRegulars(out strErrorMessage);
            
            if (regulars == null)
                return false;

            return true;
        }

        // 정규조직 멤버 불러오기
        public bool LoadRegularMembers(out List<RegularMember> regularMembers, out string strErrorMessage)
        {
            regularMembers = null;

            strErrorMessage = "";
            regularMembers = m_memberDataManager.GetSelectManager().SelectRegularMembers(out strErrorMessage);

            if (regularMembers == null)
                return false;

            return true;
        }

        // Sensor 현재 수치 값 및 상태 업데이트
        //public async Task<bool> UpdateETCSensor(DataDevice device)
        public bool UpdateETCSensor(DataDevice device)
        {
            if (device == null)
                return false;

            List<DataSensor> listSensorData = device.SensorDataList;
            if (listSensorData == null)
                return false;

            foreach (DataSensor sensor in listSensorData)
            {
                if (sensor.ModelName == CommonString.MODEL_DEBUGGING ||
                    sensor.SensorName == "" || sensor.Value == "")
                    continue;

                int nEnabled = 0;
                bool bEnabled = false;
                string strErrorMessage = null;
                string strAdditionalConditions = "";
                int nSensorStatus = 0;

                if (sensor.SensorStatus == CommonString.STATUS_CAUTION)
                    nSensorStatus = CommonString.LEVEL_CAUTION;
                else if (sensor.SensorStatus == CommonString.STATUS_WARNING)
                    nSensorStatus = CommonString.LEVEL_WARNING;
               
                if (sensor.SensorStatus != CommonString.STATUS_OFFLINE)
                    nEnabled = 1;

                bEnabled = (nEnabled == 1);

                try
                {
                    if (CommonString.IsPSMSensorType(sensor.SensorName))
                    {
                        if (float.TryParse(sensor.Value, out float fValue))
                        {
                            Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();
                            dicSets.Add(PSM.Fields.CurrentData, fValue);
                            dicSets.Add(PSM.Fields.Status, nSensorStatus);
                            dicSets.Add(PSM.Fields.Enabled, bEnabled);
                            dicSets.Add(PSM.Fields.Name, device.DeviceName);

                            // DeviceId + _ + Material (UniqueKey) 조건으로 업데이트
                            strAdditionalConditions = string.Format("{0} = '{1}_{2}'", PSM.Fields.UniqueKey, device.DeviceId, sensor.SensorName);
                            if (m_dataManager.GetUpdateManager().UpdatePSMSensor(dicSets, null, strAdditionalConditions, out strErrorMessage) == false)
                            {
                                Logger.Instance.Write("UpdateETCSensor 오류 (UpdatePSMSensor fail: " + strErrorMessage + ")");
                                return false;
                            }
                        }
                        else
                        {
                            Logger.Instance.Write("UpdateETCSensor 오류 (PSM Sensor 수치 값 float 변환 실패 sensor.Value: " + sensor.Value + ")");
                        }
                    }
                    else if (CommonString.IsETCSensorType(sensor.SensorName))
                    {
                        Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
                        dicSets.Add(ETC.Fields.CurrentData, sensor.Value);
                        dicSets.Add(ETC.Fields.Status, nSensorStatus);
                        dicSets.Add(ETC.Fields.Enabled, bEnabled);
                        dicSets.Add(ETC.Fields.Name, device.DeviceName);

                        // DeviceId + _ + Material (UniqueKey) 조건으로 업데이트
                        strAdditionalConditions = string.Format("{0} = '{1}_{2}'", ETC.Fields.UniqueKey, device.DeviceId, sensor.SensorName);
                        if (m_dataManager.GetUpdateManager().UpdateETCSensor(dicSets, null, strAdditionalConditions, out strErrorMessage) == false)
                        {
                            Logger.Instance.Write("UpdateETCSensor 오류 (UpdateETCSensors fail: " + strErrorMessage + ")");
                            return false;
                        }
                    }
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("UpdateETCSensor 실패(예외처리: " + e.Message + ")");
                    return false;
                }
            }
            

            return true;
        }

        //public async Task<bool> UpdateETCSensor(List<AlarmSensorData> alarmSensors)
        public bool UpdateETCSensor(List<AlarmSensorData> alarmSensors)
        {
            // 이 함수를 비동기로 만든다.
            //await Task.Yield();

            if (alarmSensors == null)
                return false;

            foreach (AlarmSensorData alarmSensorData in alarmSensors)
            {
                List<DataSensor> listSensorData = alarmSensorData.SensorDataList;
                if (listSensorData == null)
                    continue;

                foreach (DataSensor sensor in listSensorData)
                {
                    if (sensor.ModelName == CommonString.MODEL_DEBUGGING ||
                        sensor.SensorName == "" || sensor.Value == "")
                        continue;

                    int nEnabled = 0;
                    bool bEnabled = false;
                    string strErrorMessage = null;
                    string strAdditionalConditions = "";
                    int nSensorStatus = 0;

                    if (sensor.SensorStatus == CommonString.STATUS_CAUTION)
                        nSensorStatus = CommonString.LEVEL_CAUTION;
                    else if (sensor.SensorStatus == CommonString.STATUS_WARNING)
                        nSensorStatus = CommonString.LEVEL_WARNING;

                    if (sensor.SensorStatus != CommonString.STATUS_OFFLINE)
                        nEnabled = 1;

                    bEnabled = (nEnabled == 1);

                    try
                    {
                        if (CommonString.IsPSMSensorType(sensor.SensorName))
                        {
                            if (float.TryParse(sensor.Value, out float fValue))
                            {
                                Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();
                                dicSets.Add(PSM.Fields.CurrentData, fValue);
                                dicSets.Add(PSM.Fields.Status, nSensorStatus);
                                dicSets.Add(PSM.Fields.Enabled, bEnabled);

                                // DeviceId + _ + Material (UniqueKey) 조건으로 업데이트
                                strAdditionalConditions = string.Format("{0} = '{1}_{2}'", PSM.Fields.UniqueKey, alarmSensorData.DeviceId, sensor.SensorName);
                                m_dataManager.GetUpdateManager().UpdatePSMSensor(dicSets, null, strAdditionalConditions, out strErrorMessage);
                            }
                            else
                            {
                                Logger.Instance.Write("PSM Sensor 수치 값 float 변환 실패 sensor.Value: " + sensor.Value);
                            }
                        }
                        else if (CommonString.IsETCSensorType(sensor.SensorName))
                        {
                            Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
                            dicSets.Add(ETC.Fields.CurrentData, sensor.Value);
                            dicSets.Add(ETC.Fields.Status, nSensorStatus);
                            dicSets.Add(ETC.Fields.Enabled, bEnabled);

                            // DeviceId + _ + Material (UniqueKey) 조건으로 업데이트
                            strAdditionalConditions = string.Format("{0} = '{1}_{2}'", ETC.Fields.UniqueKey, alarmSensorData.DeviceId, sensor.SensorName);
                            m_dataManager.GetUpdateManager().UpdateETCSensor(dicSets, null, strAdditionalConditions, out strErrorMessage);
                        }
                    }
                    catch (Exception e)
                    {
                        Logger.Instance.Write("UpdateETCSensor 실패(예외처리: " + e.Message + ")");
                        return false;
                    }

                    if (strErrorMessage != null)
                        Logger.Instance.Write("Sensor 수치 값 업데이트 실패 " + strErrorMessage);

                }
            }




            


            return true;
        }

        private FacilityType GetFacilityType(int nID, out string strErrorMessage)
        {
            FacilityType facilityType = null;

            facilityType = m_dataManager.GetSelectManager().SelectFacilityType(nID, out strErrorMessage);

            return facilityType;
        }

        private Material GetMaterialType(int nID, out string strErrorMessage)
        {
            Material materialType = null;

            materialType = m_dataManager.GetSelectManager().SelectMaterial(nID, out strErrorMessage);

            return materialType;
        }

        private SensorZone GetSensorZone(int nID, out string strErrorMessage)
        {
            SensorZone sensorZone = null;

            sensorZone = m_dataManager.GetSelectManager().SelectSensorZone(nID, out strErrorMessage);

            return sensorZone;
        }

        private TagInfo GetTagInfo(int nSensorZoneID, out string strErrorMessage)
        {
            TagInfo tagInfo = null;
            string strAdditionalConditions = "";

            Dictionary<TagInfo.Fields, object> dicConditions = new Dictionary<TagInfo.Fields, object>();
            dicConditions.Add(TagInfo.Fields.SensorZoneID, nSensorZoneID);

            List<TagInfo> tagInfos = m_dataManager.GetSelectManager().SelectSensorTagInfo(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (tagInfos == null)
                return tagInfo;

            foreach (TagInfo tag in tagInfos)
            {
                tagInfo = tag;
            }

            return tagInfo;
        }

        private SensorZoneHistory GetSensorZoneHistory(int nID, out string strErrorMessage)
        {
            SensorZoneHistory zoneHistory = null;
            Dictionary<SensorZoneHistory.Fields, object> dicConditions = new Dictionary<SensorZoneHistory.Fields, object>();
            dicConditions[SensorZoneHistory.Fields.ID] = nID;
            string strAdditionalConditions = "DetectionStatus != 3";

            // .TODO: 테스트 알람인지 실제 알람인지 조건 필요.
            //zoneHistory = m_dataManager.GetSelectManager().SelectSensorZoneHistory(nID, out strErrorMessage);
            List<SensorZoneHistory> sensorZoneHistorys = m_dataManager.GetSelectManager().SelectSensorZoneHistories(dicConditions, strAdditionalConditions, out strErrorMessage);

            if (sensorZoneHistorys == null)
            {

            } 
            else if (sensorZoneHistorys.Count == 0)
            {
                strErrorMessage = "테스트 신호를 제외한 해당 SensorZoneHistory 조회되지 않음"; 
            }
            else if (sensorZoneHistorys.Count > 0)
            {
                zoneHistory = sensorZoneHistorys[0];
            }

            return zoneHistory;
        }

        public AlarmData GetAlarmData(DataDevice device, DataSensor sensor)
        {
            AlarmData alarm = null;
            string strUrl = "";
            string strErrorMessage = "";

            SensorZone sensorZone = null;
            TagInfo tagInfo = null;
            int nFacilityTypeID = -1;

            try
            {
                // 타입 ID 구하기
                //type = GetFacilityType(sensor.SensorName, out strErrorMessage);
                ArrayList arrResult = null;

                if (CommonString.IsPSMSensorType(sensor.SensorName))
                {
                    nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;
                    strUrl = m_strAlarmPSMUrl;
                    string strAdditionalConditions = string.Format("{0}.{1} = '{2}_{3}'", PSM.TableName, PSM.Fields.UniqueKey, device.DeviceId, sensor.SensorName);
                    arrResult = m_dataManager.GetSelectManager().JoinSensorZoneTagInfoPSMMaterial(strAdditionalConditions, out strErrorMessage);
                }
                else if (CommonString.IsETCSensorType(sensor.SensorName))
                {
                    nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.ETC;
                    strUrl = m_strAlarmETCUrl;
                    string strAdditionalConditions = string.Format("{0}.{1} = '{2}_{3}'", ETC.TableName, ETC.Fields.UniqueKey, device.DeviceId, sensor.SensorName);
                    arrResult = m_dataManager.GetSelectManager().JoinSensorZoneTagInfoETCMaterial(strAdditionalConditions, out strErrorMessage);
                }
                else
                {
                    //m_logMgr.Log_Info("GetAlarmData 조회 실패 (" + sensor.SensorName + " 타입을 찾을 수 없습니다.)");
                    Logger.Instance.Write("GetAlarmData 조회 실패 (" + sensor.SensorName + " 타입을 찾을 수 없습니다.)");
                    return alarm;
                }

                if (arrResult == null)
                {
                    //m_logMgr.Log_Info("GetAlarmData 조회 실패 (JoinSensorZoneTagInfoPSMMaterial 실패) " + strErrorMessage);
                    Logger.Instance.Write("GetAlarmData 조회 실패 (JoinSensorZoneTagInfoPSMMaterial 실패) " + strErrorMessage);
                    return alarm;
                }
                else if (arrResult.Count == 0)
                {
                    //m_logMgr.Log_Info("GetAlarmData 조회 실패 (JoinSensorZoneTagInfoPSMMaterial 실패) 해당 값이 없습니다.");
                    Logger.Instance.Write("GetAlarmData 조회 실패 (JoinSensorZoneTagInfoPSMMaterial 실패) 해당 값이 없습니다.");
                    return alarm;
                }

                sensorZone = arrResult[0] as SensorZone;
                tagInfo = arrResult[1] as TagInfo;
                Material mt = arrResult[2] as Material;

            }
            catch (Exception e)
            {
                //m_logMgr.Log_Info("GetAlarmData 조회 실패 " + e.Message);
                Logger.Instance.Write("GetAlarmData 조회 실패 " + e.Message);
                return alarm;
            }
                
            alarm = new AlarmData();
            alarm.DeviceID = device.DeviceId;
            alarm.DeviceName = device.DeviceName;
            alarm.SensorID = sensor.SensorId;
            alarm.SensorZoneID = sensorZone.ID;
            alarm.SensorType = nFacilityTypeID;
            alarm.SensorTagID = tagInfo.ID;
            alarm.URL = strUrl;

            return alarm;
        }



        public AlarmData GetAlarmData(AlarmSensorData alarmSensorData)
        {
            AlarmData alarm = null;
            string strUrl = "";
            string strErrorMessage = "";

            SensorZone sensorZone = null;
            TagInfo tagInfo = null;

            try
            {
                ArrayList arrResult = null;
                
                if (alarmSensorData.FacilityType == (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR)
                {
                    strUrl = m_strAlarmPSMUrl;

                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat("{0}.{1} = '{2}'", PSM.TableName, PSM.Fields.UniqueKey, alarmSensorData.UniqueKey);

                    arrResult = m_dataManager.GetSelectManager().JoinSensorZoneTagInfoPSMMaterial(sb.ToString(), out strErrorMessage);
                }
                else if (alarmSensorData.FacilityType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
                {
                    strUrl = m_strAlarmETCUrl;

                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat("{0}.{1} = '{2}'", ETC.TableName, ETC.Fields.UniqueKey, alarmSensorData.UniqueKey);

                    arrResult = m_dataManager.GetSelectManager().JoinSensorZoneTagInfoETCMaterial(sb.ToString(), out strErrorMessage);
                }
                else
                {
                    Logger.Instance.Write("GetAlarmData 조회 실패 (FacilityType 데이터가 잘못 되었습니다.)");
                    return alarm;
                }


                if (arrResult == null)
                {
                    Logger.Instance.Write("GetAlarmData 조회 실패 (JoinSensorZoneTagInfoPSMMaterial 실패) " + strErrorMessage);
                    return alarm;
                }
                else if (arrResult.Count == 0)
                {
                    Logger.Instance.Write("GetAlarmData 조회 실패 (JoinSensorZoneTagInfoPSMMaterial2 실패) 해당 값이 없습니다.");
                    return alarm;
                }

                sensorZone = arrResult[0] as SensorZone;
                tagInfo = arrResult[1] as TagInfo;
                Material mt = arrResult[2] as Material;

                alarm = new AlarmData
                {
                    SensorZoneID = sensorZone.ID,
                    SensorType = alarmSensorData.FacilityType.Value,
                    SensorTagID = tagInfo.ID,
                    URL = strUrl
                };
            }
            catch (Exception e)
            {
                Logger.Instance.Write("GetAlarmData 조회 실패 " + e.Message);
                return alarm;
            }

            return alarm;
        }



        // 알람 리스트 조회
        public List<AlarmData> GetAlarmList()
        {
            string strErrorMessage = null;
            List<CurrentAlarm> currentAlarms = null;
            List<AlarmData> alarms = new List<AlarmData>();

            try
            {
                string strAdditionalConditions = "SensorType in (" + (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR + "," + (int)dnsData.Sensor.Facility.FacilityType.ETC + ")";

                Dictionary<CurrentAlarm.Fields, object> dicConditions = new Dictionary<CurrentAlarm.Fields, object>();
                currentAlarms = m_dataManager.GetSelectManager().SelectCurrentAlarms(dicConditions, strAdditionalConditions, out strErrorMessage);

                if (currentAlarms == null)
                {
                    //m_logMgr.Log_Info("GetAlarmList 조회 실패(CurrentAlarm 조회 실패) " + strErrorMessage);
                    Logger.Instance.Write("GetAlarmList 조회 실패(CurrentAlarm 조회 실패) " + strErrorMessage);
                    return null;
                }

                foreach (CurrentAlarm current in currentAlarms)
                {
                    strAdditionalConditions = string.Format("{0}.{1} = '{2}'", SensorZoneHistory.TableName, SensorZoneHistory.Fields.ID, current.SensorZoneHistoryID);
                    ArrayList arrResult = m_dataManager.GetSelectManager().JoinSensorZoneSensorZoneHistory(strAdditionalConditions, out strErrorMessage);

                    if (arrResult == null)
                    {
                        Logger.Instance.Write("GetAlarmList 조회 실패 (JoinSensorZoneSensorZoneHistory 실패) " + strErrorMessage);
                        return null;
                    }
                    else if (arrResult.Count == 0)
                    {
                        Logger.Instance.Write("GetAlarmList 조회 실패 (JoinSensorZoneSensorZoneHistory 실패) 해당 값이 없습니다.");
                        return null;
                    }

                    SensorZone sensorZone = arrResult[0] as SensorZone;
                    SensorZoneHistory zoneHistory = arrResult[1] as SensorZoneHistory;

                    if (sensorZone.OrgSensorID == null)
                        continue;

                    string strDeviceName = "";
                    string strDeviceID = "";
                    Material material = null;

                    if (dnsData.Sensor.Facility.IsPSMSensorType((dnsData.Sensor.Facility.FacilityType)sensorZone.SensorType))
                    {
                        PSM psmSensor = m_dataManager.GetSelectManager().SelectPSMSensor((int)sensorZone.OrgSensorID, out strErrorMessage);

                        if (psmSensor == null)
                        {
                            Logger.Instance.Write("SelectPSMSensor 조회 실패(psmSensor 조회 실패) " + strErrorMessage);
                            return null;
                        }

                        strDeviceName = psmSensor.Name;
                        strDeviceID = psmSensor.UniqueKey;

                        if (psmSensor.MaterialType != null)
                            material = GetMaterialType((int)psmSensor.MaterialType, out strErrorMessage);
                        else
                        {
                            Console.WriteLine(psmSensor.UniqueKey);
                            Logger.Instance.Write("PSM Sensor의 Material 타입이 존재하지 않습니다.");
                        }
                    }
                    else
                    {
                        ETC etcSensor = m_dataManager.GetSelectManager().SelectETCSensor((int)sensorZone.OrgSensorID, out strErrorMessage);

                        if (etcSensor == null)
                        {
                            Logger.Instance.Write("SelectETCSensor 조회 실패(etcSensor 조회 실패) " + strErrorMessage);
                            return null;
                        }

                        strDeviceName = etcSensor.Name;
                        strDeviceID = etcSensor.UniqueKey;

                        if (etcSensor.MaterialType != null)
                            material = GetMaterialType((int)etcSensor.MaterialType, out strErrorMessage);
                        else
                        {
                            Console.WriteLine(etcSensor.UniqueKey);
                            Logger.Instance.Write("ETC Sensor의 Material 타입이 존재하지 않습니다.");
                        }
                    }

                    AlarmData alarm = new AlarmData();
                    alarm.DeviceName = strDeviceName;
                    alarm.DeviceID = strDeviceID;
                    alarm.SensorType = sensorZone.SensorType;

                    int? nOrgSensorID = sensorZone.OrgSensorID;
                    alarm.OrgSensorID = (int)nOrgSensorID;

                    if (material != null)
                        alarm.SensorName = material.MaterialName;

                    alarms.Add(alarm);
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("GetAlarmList 실패(예외: " + e.Message + ")");
                return null;
            }

            return alarms;
        }


        /// <summary>
        /// Device 임계치 및 기준값 업데이트
        /// </summary>
        /// <param name="dicDevices">Device 리스트</param>
        /// <returns></returns>
        public bool UpdateSensorsThresholds(Dictionary<string, DataDevice> dicDevices)
        {
            if (dicDevices == null || dicDevices.Count == 0)
                return false;

            foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
            {
                DataDevice device = pair.Value;

                if (UpdateSensorsThreshold(device) == false)
                    return false;
            }

            return true;
        }


        public bool UpdateSensorsThreshold(DataDevice device)
        {
            string strErrorMessage = "";

            if (device == null)
                return false;

            List<DataSensor> listSensorData = device.SensorDataList;
            if (listSensorData == null)
                return false;

            foreach (DataSensor sensor in listSensorData)
            {
                try
                {
                    if (sensor.SensorName == "")
                        continue;

                    if (CommonString.IsPSMSensorType(sensor.SensorName))
                    {
                        float? fNormalRange = null;

                        if (float.TryParse(sensor.NormalRange, out float fTemp))
                            fNormalRange = fTemp;

                        string strUseLimit = false.ToString();      // 관심단계 임계치 사용안함
                        string strLimitValue = "";

                        if (sensor.CautionRange == null || sensor.CautionRange == "")
                        {
                            strUseLimit += "," + false.ToString();
                            strLimitValue += ",";
                        }
                        else
                        {
                            strUseLimit += "," + true.ToString();
                            strLimitValue += "," + sensor.CautionRange;
                        }

                        if (sensor.WarningRange == null || sensor.WarningRange == "")
                        {
                            strUseLimit += "," + false.ToString();
                            strLimitValue += ",";
                        }
                        else
                        {
                            strUseLimit += "," + true.ToString();
                            strLimitValue += "," + sensor.WarningRange;
                        }

                        strLimitValue = strUseLimit + "|" + strLimitValue;


                        Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();
                        dicSets.Add(PSM.Fields.LimitBase, fNormalRange);
                        dicSets.Add(PSM.Fields.LimitValue, strLimitValue);
                        dicSets.Add(PSM.Fields.LimitType, (int)PSM.Limit_Type.Normal);

                        // DeviceId + _ + Material (UniqueKey) 조건으로 업데이트
                        string strAdditionalConditions = string.Format("{0} = '{1}_{2}'", PSM.Fields.UniqueKey, device.DeviceId, sensor.SensorName);

                        if (m_dataManager.GetUpdateManager().UpdatePSMSensor(dicSets, null, strAdditionalConditions, out strErrorMessage) == false)
                            Logger.Instance.Write("UpdateSensor 실패 " + strErrorMessage);

                    }
                    else if (CommonString.IsETCSensorType(sensor.SensorName))
                    {
                        string strUseLimit = false.ToString();      // 관심단계 임계치 사용안함
                        string strLimitValue = "";

                        if (sensor.CautionRange == null || sensor.CautionRange == "")
                        {
                            strUseLimit += "," + false.ToString();
                            strLimitValue += ",";
                        }
                        else
                        {
                            strUseLimit += "," + true.ToString();
                            strLimitValue += "," + sensor.CautionRange;
                        }

                        if (sensor.WarningRange == null || sensor.WarningRange == "")
                        {
                            strUseLimit += "," + false.ToString();
                            strLimitValue += ",";
                        }
                        else
                        {
                            strUseLimit += "," + true.ToString();
                            strLimitValue += "," + sensor.WarningRange;
                        }

                        strLimitValue = strUseLimit + "|" + strLimitValue;


                        Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
                        dicSets.Add(ETC.Fields.LimitBase, sensor.NormalRange);
                        dicSets.Add(ETC.Fields.LimitValue, strLimitValue);
                        dicSets.Add(ETC.Fields.LimitType, (int)ETC.Limit_Type.Normal);

                        string strAdditionalConditions = string.Format("{0} = '{1}_{2}'", ETC.Fields.UniqueKey, device.DeviceId, sensor.SensorName);

                        if (m_dataManager.GetUpdateManager().UpdateETCSensor(dicSets, null, strAdditionalConditions, out strErrorMessage) == false)
                            Logger.Instance.Write("UpdateSensor 실패 " + strErrorMessage);
                    }
                }
                catch (Exception e)
                {
                    Logger.Instance.Write("UpdateSensor 실패(예외처리: " + e.Message + ")");
                    return false;
                }

                if (strErrorMessage != null && strErrorMessage != "")
                    Logger.Instance.Write("Sensor 임계치 업데이트 실패 " + strErrorMessage);

            }


            return true;
        }





        // IoT Sensor 추가 작업 용도 
        public bool AddETCSensor(Dictionary<string, DataDevice> dicDevices)
        {
            if (dicDevices == null || dicDevices.Count == 0)
                return false;

            // ID 시작값
            int nPSMSensorID = 1000;
            int nETCSensorID = 1455;
            int nSensorZoneID = 15952;
            int nSensorTagInfoID = 15952;

            foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
            {
                DataDevice device = pair.Value;
                List<DataSensor> listSensorData = device.SensorDataList;

                // VERSION_32002 디바이스 위치값 출력
                //string strDeviceLocation = "";

                //if (device.VersionId == CommonString.VERSION_32002)
                //{
                //    strDeviceLocation = string.Format("{0}  {1} {2} {3} {4}", device.DeviceId, device.PlaceExt1, device.PlaceExt2, device.PlaceExt3, device.PlaceAreaName);
                //    m_logMgr.Log_SQL(strDeviceLocation);
                //}

                foreach (DataSensor sensor in listSensorData)
                {
                    // 제외할 센서 네임 및 모드
                    if (sensor.ModelName == CommonString.MODEL_DEBUGGING
                        || sensor.SensorName == CommonString.SENSOR_RESULT
                        || sensor.SensorName == CommonString.ETC_mA
                        || sensor.SensorName == CommonString.ETC_Contact
                        || sensor.SensorName == CommonString.ETC_Relay
                        || sensor.SensorName == CommonString.SENSOR_GAS_TYPE
                        || sensor.SensorName == CommonString.ETC_CONNECT
                        || sensor.SensorName == CommonString.SENSOR_MAC
                        || sensor.SensorName == CommonString.SENSOR_TYPE
                        || sensor.SensorName == CommonString.SENSOR_GW_ID
                        || sensor.SensorName == CommonString.SENSOR_KIND
                        || sensor.SensorName == CommonString.SENSOR_MEASURE
                        || sensor.SensorName == CommonString.DEVICE_STATUS
                        || sensor.SensorName == CommonString.SENSOR_ERROR
                        || sensor.SensorName == CommonString.SENSOR_CH_NUM
                        || sensor.SensorName == CommonString.ETC_BLE_Count
                        || sensor.SensorName == CommonString.ETC_BLE_Count2
                        || sensor.SensorName == "")
                        continue;
                    /*
                    string strSQL = "";
                    string strSubSQL1 = "";
                    string strSubSQL2 = "";
                    */
                    string strSensorValue = "";

                    if (CommonString.IsPSMSensorType(sensor.SensorName))
                    {
                        /*
                        strSQL = string.Format("INSERT INTO SdmsSensorPSM (ID, Name, EquipZoneID, UseLimitLevel1, UseLimitLevel2, UseLimitLevel3, UniqueKey, ZoneID, MaterialType) " +
                            "VALUES (" +
                            "{0}, " +
                            "'{1}', " +
                            "30000, " +
                            "0, 0, 0, " +
                            "'{2}', " +
                            "30000, " +
                            "(SELECT ID FROM SdmsSensorMaterial WHERE MaterialName = '{3}')" +
                            ")", nPSMSensorID, device.DeviceName, (device.DeviceId + "_" + sensor.SensorName), sensor.SensorName);

                        strSubSQL1 = string.Format("INSERT INTO SdmsSensorZone (ID, SensorType, OrgSensorID, EquipZoneID, IsAlarmStatus) " +
                            "VALUES (" +
                            "{0}, " +
                            "{1}, " +
                            "{2}, " +
                            "30000, " +
                            "0" +
                            ")", nSensorZoneID, (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, nPSMSensorID);

                        strSubSQL2 = string.Format("INSERT INTO SdmsSensorTagInfo (ID, SensorServerID, TagNo, SensorZoneID, Activate, Description) " +
                            "VALUES (" +
                            "{0}, " +
                            "3, " +
                            "{0}, " +
                            "{1}, " +
                            "1, " +
                            "'SensorPSM')", nSensorTagInfoID, nSensorZoneID);

                        nPSMSensorID++;
                        nSensorZoneID++;
                        nSensorTagInfoID++;
                        */
                        strSensorValue = string.Format("11\t{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}", device.DeviceName, device.DeviceId, sensor.SensorName, device.PlaceExt1, device.PlaceExt2, device.PlaceExt3, device.PlaceExt4, device.PlaceAreaName);
                    }
                    else if (CommonString.IsETCSensorType(sensor.SensorName))
                    {
                        /*
                        strSQL = string.Format("INSERT INTO SdmsSensorETC (ID, Name, ZoneID, UniqueKey, MaterialType) " +
                            "VALUES (" +
                            "{0}, " +
                            "'{1}', " +
                            "30000, " +
                            "'{2}', " +
                            "(SELECT ID FROM SdmsSensorMaterial WHERE MaterialName = '{3}')" +
                            ")", nETCSensorID, device.DeviceName, (device.DeviceId + "_" + sensor.SensorName), sensor.SensorName);

                        strSubSQL1 = string.Format("INSERT INTO SdmsSensorZone (ID, SensorType, OrgSensorID, EquipZoneID, IsAlarmStatus) " +
                            "VALUES (" +
                            "{0}, " +
                            "{1}, " +
                            "{2}, " +
                            "30000, " +
                            "0" +
                            ")", nSensorZoneID, (int)dnsData.Sensor.Facility.FacilityType.ETC, nETCSensorID);

                        strSubSQL2 = string.Format("INSERT INTO SdmsSensorTagInfo (ID, SensorServerID, TagNo, SensorZoneID, Activate, Description) " +
                            "VALUES (" +
                            "{0}, " +
                            "3, " +
                            "{0}, " +
                            "{1}, " +
                            "1, " +
                            "'SensorETC')", nSensorTagInfoID, nSensorZoneID);

                        nETCSensorID++;
                        nSensorZoneID++;
                        nSensorTagInfoID++;
                        */
                        strSensorValue = string.Format("21\t{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}", device.DeviceName, device.DeviceId, sensor.SensorName, device.PlaceExt1, device.PlaceExt2, device.PlaceExt3, device.PlaceExt4, device.PlaceAreaName);
                    }
                    else
                    {
                        m_logMgr.Log_SQL(sensor.SensorName);
                    }

                    // SQL 기록
                    //m_logMgr.Log_SQL(strSQL);
                    //m_logMgr.Log_SQL(strSubSQL1);
                    //m_logMgr.Log_SQL(strSubSQL2);
                    m_logMgr.Log_SQL(strSensorValue);
                }

            }

            return true;
        }

        public static string EncryptString(string str)
        {
            return AES256Cipher.AES_encrypt(str, key);
        }

        public static string DecryptString(string str)
        {
            if (str == null)
                return null;

            return AES256Cipher.AES_decrypt(str, key);
        }
    }
}
