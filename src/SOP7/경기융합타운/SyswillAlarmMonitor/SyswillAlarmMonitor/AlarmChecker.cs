using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using dnsDapperDBUtil;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace SyswillAlarmMonitor
{
    using Models;
    using Models.Sdms.Alarm;
    using Models.Sdms.Sensor;
    using Models.Sdms.Spatial;
    using DAL;

    class AlarmChecker
    {
        private DataManager m_dataManager = null;
        private int m_nSiteID = -1;

        private SpaceManager m_spaceManager = null;
        private Dictionary<int, FacilityType> m_dicFacilityTypes = new Dictionary<int, FacilityType>();
        private Dictionary<AlarmData.AlarmTypes, FacilityType> m_dicAlarmFacilityTypes = new Dictionary<AlarmData.AlarmTypes, FacilityType>();

        public SpaceManager SpaceManager
        {
            get
            {
                if (m_spaceManager != null)
                    return m_spaceManager;

                if (m_dataManager == null)
                    return null;

                m_spaceManager = new SpaceManager(m_dataManager, m_nSiteID);
                return m_spaceManager;
            }
        }

        public DataManager DataManager
        {
            get { return m_dataManager; }
        }

        public AlarmChecker(int nSiteID)
        {
            m_nSiteID = nSiteID;

            string strDbHost = ConfigurationManager.AppSettings.Get("DBHost");
            string strDbInfo = ConfigurationManager.AppSettings.Get("DBInfo");

            int nDbType;
            string strID, strPW, strDbName;

            if (GetDbInfo(strDbInfo, out nDbType, out strDbName, out strID, out strPW))
            {
                m_dataManager = new DataManager(nDbType, strDbHost, strDbName, strID, strPW);
                ReadSensorTypes();
            }
        }

        private bool GetDbInfo(string strDbInfo, out int nDbType, out string strDbName, out string strID, out string strPW)
        {
            if (strDbInfo != null && strDbInfo.Length > 0)
            {
                string strInfo = AES256Cipher.AES_decrypt(strDbInfo);
                string[] tokens = strInfo.Split('-');

                if (tokens.Length >= 4)
                {
                    if (int.TryParse(tokens[0].Trim(), out nDbType))
                    {
                        strDbName = tokens[1].Trim();
                        strID = tokens[2].Trim();
                        strPW = tokens[3].Trim();
                        return true;
                    }
                }
            }

            nDbType = 0;
            strDbName = strID = strPW = null;
            return false;
        }

        private void ReadSensorTypes()
        {
            string strErrorMessage;
            IEnumerable<FacilityType> facilityTypes = m_dataManager.GetSelect().Select<FacilityType>(null, out strErrorMessage);

            if (facilityTypes == null)
                return;

            foreach (FacilityType facilityType in facilityTypes)
            {
                m_dicFacilityTypes[facilityType.ID] = facilityType;

                string strTypeName = facilityType.TypeName.ToLower();

                if (strTypeName == "fire")
                    m_dicAlarmFacilityTypes[AlarmData.AlarmTypes.Fire] = facilityType;
                else if (strTypeName == "psm")
                    m_dicAlarmFacilityTypes[AlarmData.AlarmTypes.Gas] = facilityType;
                else if (strTypeName == "terror")
                    m_dicAlarmFacilityTypes[AlarmData.AlarmTypes.Terror] = facilityType;
                else if (strTypeName == "blackout")
                    m_dicAlarmFacilityTypes[AlarmData.AlarmTypes.Blackout] = facilityType;
                else if (strTypeName == "submerge")
                    m_dicAlarmFacilityTypes[AlarmData.AlarmTypes.Water] = facilityType;
                else if (strTypeName == "emergencybell")
                    m_dicAlarmFacilityTypes[AlarmData.AlarmTypes.EmergencyBell] = facilityType;
            }
        }

        private void SetSensorTypeAlarms(Dictionary<int, List<AlarmSensor>> dicSensorTypeAlarms, AlarmData.AlarmTypes alarmType)
        {
            FacilityType facilityType;

            if (m_dicAlarmFacilityTypes.TryGetValue(alarmType, out facilityType))
            {
                dicSensorTypeAlarms[facilityType.ID] = new List<AlarmSensor>();
            }
        }

        public List<AlarmSensor> GetSensorZones(List<AlarmData> alarmDatas)
        {
            if (m_dataManager == null)
                return null;

            string strErrorMessage;
            IEnumerable<FacilityType> facilityTypes = m_dataManager.GetSelect().Select<FacilityType>(null, out strErrorMessage);

            if (facilityTypes == null)
                return null;

            Dictionary<int, List<AlarmSensor>> dicFireAlarms = new Dictionary<int, List<AlarmSensor>>();
            Dictionary<int, List<AlarmSensor>> dicTerrorAlarms = new Dictionary<int, List<AlarmSensor>>();
            Dictionary<int, List<AlarmSensor>> dicEmergencyBellAlarms = new Dictionary<int, List<AlarmSensor>>();
            Dictionary<int, List<AlarmSensor>> dicSubmergeAlarms = new Dictionary<int, List<AlarmSensor>>();
            Dictionary<int, List<AlarmSensor>> dicBlackoutAlarms = new Dictionary<int, List<AlarmSensor>>();
            Dictionary<int, List<AlarmSensor>> dicGasAlarms = new Dictionary<int, List<AlarmSensor>>();

            SetSensorTypeAlarms(dicFireAlarms, AlarmData.AlarmTypes.Fire);
            SetSensorTypeAlarms(dicTerrorAlarms, AlarmData.AlarmTypes.Terror);
            SetSensorTypeAlarms(dicEmergencyBellAlarms, AlarmData.AlarmTypes.EmergencyBell);
            SetSensorTypeAlarms(dicSubmergeAlarms, AlarmData.AlarmTypes.Water);
            SetSensorTypeAlarms(dicBlackoutAlarms, AlarmData.AlarmTypes.Blackout);
            SetSensorTypeAlarms(dicGasAlarms, AlarmData.AlarmTypes.Gas);

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinCurrentAlarmSensorZoneHistorySensorZoneTagInfo(null, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-3;i+=4)
            {
                if (arrDatas[i] is Current && arrDatas[i + 1] is Models.Sdms.History.SensorZone && arrDatas[i + 2] is SensorZone && arrDatas[i + 3] is TagInfo)
                {
                    Current currentAlarm = (Current)arrDatas[i];
                    Models.Sdms.History.SensorZone sensorZoneHistory = (Models.Sdms.History.SensorZone)arrDatas[i + 1];
                    SensorZone sensorZone = (SensorZone)arrDatas[i + 2];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 3];

                    AlarmSensor alarm = new AlarmSensor();
                    alarm.SensorZone = sensorZone;
                    alarm.SensorZoneHistory = sensorZoneHistory;
                    alarm.TagInfo = tagInfo;
                    alarm.IsAlarm = true;

                    FacilityType facilityType;

                    if (m_dicFacilityTypes.TryGetValue(currentAlarm.SensorType, out facilityType))
                    {
                        string strTypeName = facilityType.TypeName.ToLower();

                        if (strTypeName == "fire")
                            AddAlarmSensor(dicFireAlarms, alarm, currentAlarm.SensorType);
                        else if (strTypeName == "psm")
                            AddAlarmSensor(dicGasAlarms, alarm, currentAlarm.SensorType);
                        else if (strTypeName == "terror")
                            AddAlarmSensor(dicTerrorAlarms, alarm, currentAlarm.SensorType);
                        else if (strTypeName == "blackout")
                            AddAlarmSensor(dicBlackoutAlarms, alarm, currentAlarm.SensorType);
                        else if (strTypeName == "submerge")
                            AddAlarmSensor(dicSubmergeAlarms, alarm, currentAlarm.SensorType);
                        else if (strTypeName == "emergencybell")
                            AddAlarmSensor(dicEmergencyBellAlarms, alarm, currentAlarm.SensorType);
                    }
                }
            }

            SortAlarmSensors(dicFireAlarms);
            SortAlarmSensors(dicGasAlarms);
            SortAlarmSensors(dicTerrorAlarms);
            SortAlarmSensors(dicBlackoutAlarms);
            SortAlarmSensors(dicSubmergeAlarms);
            SortAlarmSensors(dicEmergencyBellAlarms);

            List<AlarmSensor> alarmSensors = new List<AlarmSensor>();
            Dictionary<int, List<AlarmSensor>> dicAlarmSensors = null;

            foreach (AlarmData alarmData in alarmDatas)
            {
                if (alarmData.AlarmType == AlarmData.AlarmTypes.Fire)
                    dicAlarmSensors = dicFireAlarms;
                else if (alarmData.AlarmType == AlarmData.AlarmTypes.Blackout)
                    dicAlarmSensors = dicBlackoutAlarms;
                else if (alarmData.AlarmType == AlarmData.AlarmTypes.EmergencyBell)
                    dicAlarmSensors = dicEmergencyBellAlarms;
                else if (alarmData.AlarmType == AlarmData.AlarmTypes.Gas)
                    dicAlarmSensors = dicGasAlarms;
                else if (alarmData.AlarmType == AlarmData.AlarmTypes.Water)
                    dicAlarmSensors = dicSubmergeAlarms;
                else if (alarmData.AlarmType == AlarmData.AlarmTypes.Terror)
                    dicAlarmSensors = dicTerrorAlarms;
                else
                    continue;

                AlarmSensor alarmSensor = GetAlarmSensor(dicAlarmSensors, alarmData);

                if (alarmSensor != null)
                {
                    alarmSensor.AlarmType = alarmData.AlarmType;
                    alarmSensors.Add(alarmSensor);
                }
            }

            return alarmSensors;
        }

        private void SortAlarmSensors(Dictionary<int, List<AlarmSensor>> dicAlarms)
        {
            foreach (KeyValuePair<int, List<AlarmSensor>> pair in dicAlarms)
            {
                pair.Value.Sort();
            }
        }

        private void AddAlarmSensor(Dictionary<int, List<AlarmSensor>> dicAlarms, AlarmSensor alarm, int sensorType)
        {
            List<AlarmSensor> alarmSensors = null;

            if (dicAlarms.TryGetValue(sensorType, out alarmSensors) == false)
            {
                alarmSensors = new List<AlarmSensor>();
                dicAlarms[sensorType] = alarmSensors;
            }

            alarmSensors.Add(alarm);
        }

        private AlarmSensor GetAlarmSensor(Dictionary<int, List<AlarmSensor>> dicAlarms, AlarmData alarmData)
        {
            List<AlarmSensor> alarms = null;

            if (alarmData.FloorIndex == null)
                return null;

            EquipmentZone equipZone = m_spaceManager.GetEquipZone((int)alarmData.FloorIndex);

            if (equipZone == null)
                return null;

            FacilityType facilityType;

            if (m_dicAlarmFacilityTypes.TryGetValue(alarmData.AlarmType, out facilityType) == false)
                return null;

            SensorZone sensorZone = m_spaceManager.GetSensorZone(equipZone.ID, facilityType.ID);

            if (sensorZone == null)
                return null;

            if (alarmData.Status == AlarmData.AlarmStatus.Clear)
            {
                if (dicAlarms.TryGetValue(sensorZone.SensorType, out alarms))
                {
                    foreach (AlarmSensor alarmSensor in alarms)
                    {
                        if (alarmSensor.IsAlarm && alarmSensor.SensorZone.ID == sensorZone.ID)
                        {
                            AlarmSensor alarm = new AlarmSensor();
                            alarm.IsAlarm = false;
                            alarm.AlarmType = alarmData.AlarmType;

                            alarm.SensorZone = sensorZone;

                            alarm.TagInfo = new TagInfo();
                            alarm.TagInfo.ID = sensorZone.ID;

                            return alarm;
                        }
                    }
                }
            }
            else if (alarmData.Status == AlarmData.AlarmStatus.Alarm || alarmData.Status == AlarmData.AlarmStatus.Processing)
            {
                if (dicAlarms.TryGetValue(sensorZone.SensorType, out alarms))
                {
                    foreach (AlarmSensor alarmSensor in alarms)
                    {
                        if (alarmSensor.IsAlarm && alarmSensor.SensorZone.ID == sensorZone.ID)
                        {
                            // 이미 알람이 발생한 상태
                            return null;
                        }
                    }
                }

                AlarmSensor alarm = new AlarmSensor();
                alarm.IsAlarm = true;
                alarm.AlarmType = alarmData.AlarmType;

                alarm.SensorZone = sensorZone;

                alarm.TagInfo = new TagInfo();
                alarm.TagInfo.ID = sensorZone.ID;
                alarm.AlarmLevel = alarmData.GetAlarmLevel();

                return alarm;
            }

            return null;
        }

        private int GetSensorZoneNumber(int begin, int end, Dictionary<int, List<AlarmSensor>> dicAlarms, out int sensorType)
        {
            sensorType = -1;
            int index = begin;

            foreach (KeyValuePair<int, List<AlarmSensor>> pair in dicAlarms)
            {
                sensorType = pair.Key;

                foreach (AlarmSensor alarm in pair.Value)
                {
                    if (alarm.SensorZone.ID > index)
                        return index;

                    index++;

                    if (index > end)
                        break;
                }

                break;
            }

            if (index > end)
                return -1;

            return index;
        }
    }
}
