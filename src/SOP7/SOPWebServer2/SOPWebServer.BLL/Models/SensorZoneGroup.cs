using System.Collections.Generic;
using SDMS.Model.Spatial;
using SDMS.Model.Sensor;
using SDMS.Model.History;
using System.Collections.Concurrent;
using dnsData.Sensor;
using dnsData.Alarm;
using SDMS.IDAL;

namespace SOPWebServer.BLL.Models
{
    // 같은 EquipZone을 공유하며, Type이 같은 Sensor들의 집합
    public class SensorZoneGroup
    {
        private long m_nID = -1;
        private EquipmentZone m_equipZone = null;
        private Facility.FacilityType m_sensorType = Facility.FacilityType.NONE;
        // Value : SensorZone별 데이터
        private ConcurrentDictionary<SensorZone, int> m_dicSensorDatas = new ConcurrentDictionary<SensorZone, int>();
        private AlarmData m_alarm = null;

        // 이 그룹에 속한 모든 SensorZone (설정 정보이며 알람 상태가 아니다)
        // m_dicSensorDatas는 "알람이 발생한" SensorZone만 담기 때문에 별도로 보관한다.
        private ConcurrentDictionary<int, SensorZone> m_dicMembers = new ConcurrentDictionary<int, SensorZone>();

        // EquipZone ID와 SensorType의 조합
        // 상위 4바이트 : EquipZone ID
        // 하위 4바이트 : SensorType
        public long ID
        {
            get { return m_nID; }
        }

        public EquipmentZone EquipmentZone
        {
            get { return m_equipZone; }
            set
            {
                m_equipZone = value;
                SetID();
            }
        }

        public Facility.FacilityType SensorType
        {
            get { return m_sensorType; }
            set
            {
                m_sensorType = value;
                SetID();
            }
        }

        public AlarmData CurrentAlarm
        {
            get { return m_alarm; }
            set { m_alarm = value; }
        }

        /// <summary>
        /// 이 그룹에 속한 SensorZone을 등록한다. (기동 시 / 센서 추가 시)
        /// </summary>
        public void AddMember(SensorZone sensor)
        {
            if (sensor != null)
                m_dicMembers[sensor.ID] = sensor;
        }

        public ICollection<SensorZone> Members
        {
            get { return m_dicMembers.Values; }
        }

        public List<int> GetMemberIDs()
        {
            return new List<int>(m_dicMembers.Keys);
        }

        /// <summary>
        /// 그룹에 속한 SensorZone들의 알람 상태(Data / IsAlarmStatus)를 DB에서 다시 읽어
        /// 메모리(m_dicSensorDatas)를 DB 기준으로 맞춘다.
        ///
        /// 이 값들은 원래 프로세스 메모리에만 유지되어, DB와 어긋나면 신규 알람 신호가
        /// "이미 알람 발생중"으로 잘못 판정되어 조용히 무시되는 문제가 있었다.
        /// 신호를 처리하기 직전에 호출하여 DB를 기준으로 삼는다.
        /// </summary>
        /// <returns>DB 조회에 성공하여 갱신했으면 true. 실패 시 기존 메모리 값을 유지한다.</returns>
        public bool ReloadSensorDatas(IDataManager dataManager)
        {
            if (dataManager == null || m_dicMembers.Count == 0)
                return false;

            string strIDs = "";

            foreach (int nSensorZoneID in m_dicMembers.Keys)
            {
                if (strIDs.Length == 0)
                    strIDs = nSensorZoneID.ToString();
                else
                    strIDs += ", " + nSensorZoneID.ToString();
            }

            bool isNullable;
            string strCondition = string.Format("{0} in ({1})",
                SensorZone.GetFieldName(SensorZone.Fields.ID, out isNullable), strIDs);

            string strErrorMessage;
            List<SensorZone> sensorZones = dataManager.GetSelectManager().SelectSensorZones(null, strCondition, out strErrorMessage);

            // 조회 실패 시에는 기존 메모리 값을 그대로 둔다. (DB 일시 장애로 알람 상태를 잃지 않기 위함)
            if (sensorZones == null)
                return false;

            m_dicSensorDatas.Clear();

            foreach (SensorZone dbSensorZone in sensorZones)
            {
                SensorZone sensor;

                if (m_dicMembers.TryGetValue(dbSensorZone.ID, out sensor) == false)
                    continue;

                sensor.Data = dbSensorZone.Data;
                sensor.IsAlarmStatus = dbSensorZone.IsAlarmStatus;

                if (dbSensorZone.IsAlarmStatus && dbSensorZone.Data != null && dbSensorZone.Data > 0)
                    m_dicSensorDatas[sensor] = (int)dbSensorZone.Data;
            }

            return true;
        }

        public void SetSensorData(SensorZone sensor, int data, bool isAlarmStatus, IDataManager dataManager, bool updateDB = true)
        {
            if (dataManager != null && updateDB)
            {
                Dictionary<SensorZone.Fields, object> dicCondtions = new Dictionary<SensorZone.Fields, object>();
                Dictionary<SensorZone.Fields, object> dicSets = new Dictionary<SensorZone.Fields, object>();

                dicCondtions[SensorZone.Fields.ID] = sensor.ID;
                dicSets[SensorZone.Fields.Data] = data;
                dicSets[SensorZone.Fields.IsAlarmStatus] = isAlarmStatus;

                string strErrorMessage;

                if (dataManager.GetUpdateManager().UpdateSensorZone(dicSets, dicCondtions, "", out strErrorMessage))
                {
                    SetSensorData(sensor, data, isAlarmStatus);
                }
            }
            else
            {
                SetSensorData(sensor, data, isAlarmStatus);
            }
        }

        private void SetSensorData(SensorZone sensor, int data, bool isAlarmStatus)
        {
            sensor.Data = data;
            sensor.IsAlarmStatus = isAlarmStatus;

            if (data > 0 && isAlarmStatus)
                m_dicSensorDatas[sensor] = data;
            else
                m_dicSensorDatas.TryRemove(sensor, out data);
        }

        public bool GetSensorData(SensorZone sensor, out int data, out bool isAlarmStatus)
        {
            isAlarmStatus = false;

            if (m_dicSensorDatas.TryGetValue(sensor, out data) == false)
            {
                return false;
            }

            isAlarmStatus = sensor.IsAlarmStatus;
            return true;
        }

        public bool RemoveSensorData(SensorZone sensor, IDataManager dataManager)
        {
            if (dataManager == null)
            {
                int _data;

                if (m_dicSensorDatas.TryRemove(sensor, out _data))
                    return true;
                else
                    return false;
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            Dictionary<SensorZone.Fields, object> dicSets = new Dictionary<SensorZone.Fields, object>();

            dicConditions[SensorZone.Fields.ID] = sensor.ID;
            dicSets[SensorZone.Fields.Data] = null;
            dicSets[SensorZone.Fields.IsAlarmStatus] = false;

            string strErrorMessage;

            if (dataManager.GetUpdateManager().UpdateSensorZone(dicSets, dicConditions, "", out strErrorMessage))
            {
                int data;

                if (m_dicSensorDatas.TryRemove(sensor, out data))
                {
                    SetSensorData(sensor, 0, false);
                    //return dbMgr.BatchCommit();
                    return true;
                }
            }
            else
                return false;

            return m_dicSensorDatas.ContainsKey(sensor) == false;
        }

        public bool RemoveAllSensorData(IDataManager dataManager)
        {
            if (dataManager == null)
            {
                m_dicSensorDatas.Clear();
                return true;
            }

            string strCondition = "";
            KeyValuePair<SensorZone, int>[] sensorZoneDatas = m_dicSensorDatas.ToArray();
            
            foreach (KeyValuePair<SensorZone, int> pair in sensorZoneDatas)
            {
                SensorZone sensor = pair.Key;

                if (strCondition.Length == 0)
                    strCondition = sensor.ID.ToString();
                else
                    strCondition += ", " + sensor.ID.ToString();
            }

            if (strCondition.Length > 0)
            {
                Dictionary<SensorZone.Fields, object> dicSets = new Dictionary<SensorZone.Fields, object>();
                dicSets[SensorZone.Fields.Data] = null;
                dicSets[SensorZone.Fields.IsAlarmStatus] = false;

                bool isNullable;
                strCondition = SensorZone.GetFieldName(SensorZone.Fields.ID, out isNullable) + " in (" + strCondition + ")";

                string strErrorMessage;

                if (dataManager.GetUpdateManager().UpdateSensorZone(dicSets, null, strCondition, out strErrorMessage) == false)
                    return false;
            }

            foreach (KeyValuePair<SensorZone, int> pair in sensorZoneDatas)
            {
                SensorZone sensor = pair.Key;
                SetSensorData(sensor, 0, false);
            }

            m_dicSensorDatas.Clear();
            return true;
        }

        public bool BeginSituationNotice(IDataManager dataManager)
        {
            if (dataManager == null)
                return false;

            string strErrorMessage;
            Dictionary<SDMS.Model.Alarm.CurrentAlarm.Fields, object> dicConditions = new Dictionary<SDMS.Model.Alarm.CurrentAlarm.Fields, object>();
            dicConditions.Add(SDMS.Model.Alarm.CurrentAlarm.Fields.SensorZoneHistoryID, m_alarm.SensorZoneHistoryID);

            List<SDMS.Model.Alarm.CurrentAlarm> alarms = 
                dataManager.GetSelectManager().SelectCurrentAlarms(dicConditions, "", out strErrorMessage);

            if (alarms == null || alarms.Count == 0)
                return false;

            if (alarms[0].SopStatus >= 0)
                return false;

            Dictionary<SDMS.Model.Alarm.CurrentAlarm.Fields, object> dicSets = new Dictionary<SDMS.Model.Alarm.CurrentAlarm.Fields, object>();
            dicSets.Add(SDMS.Model.Alarm.CurrentAlarm.Fields.SopStatus, 0); // 0 : 실행요청

            if (dataManager.GetUpdateManager().UpdateCurrentAlarm(dicSets, dicConditions, "", out strErrorMessage))
                return true;
            else
                return false;
        }

        public void ClearSensorDatas(IDataManager dataManager)
        {
            KeyValuePair<SensorZone, int>[] sensorZoneDatas = m_dicSensorDatas.ToArray();

            foreach (KeyValuePair<SensorZone, int> pair in sensorZoneDatas)
            {
                SensorZone sensorZone = pair.Key;
                RemoveSensorData(sensorZone, dataManager);
            }
        }

        // SensorZoneGroup에 속해있는 모든 SensorZone 객체들을 리턴하는 것이 아니다.
        // 값이 들어있는(알람이 발생한) SensorZone들만 리턴한다.
        public KeyValuePair<SensorZone, int>[] GetSensors()
        {
            return m_dicSensorDatas.ToArray();
        }

        private void SetID()
        {
            long hi = m_equipZone == null ? -1 : m_equipZone.ID;
            long low = ((long)m_sensorType) & 0xffffffff;

            m_nID = (hi << 32) | low;
        }

        public List<int> GetAlarmSensorZoneIDs()
        {
            KeyValuePair<SensorZone, int>[] sensors = GetSensors();
            List<int> alarmSensorZoneIDs = new List<int>();

            foreach (KeyValuePair<SensorZone, int> pair in sensors)
            {
                alarmSensorZoneIDs.Add(pair.Key.ID);
            }

            return alarmSensorZoneIDs;
        }

        public static long ToID(EquipmentZone equipZone, Facility.FacilityType sensorType)
        {
            int nEquipZoneID = equipZone == null ? -1 : equipZone.ID;
            return ToID(nEquipZoneID, sensorType);
        }

        public static long ToID(int nEquipZoneID, Facility.FacilityType sensorType)
        {
            long hi = nEquipZoneID;
            long low = (long)sensorType;

            long nID = (hi << 32) | low;
            return nID;
        }

        public static void GetIDInfo(long nID, out int nEquipZoneID, out Facility.FacilityType sensorType)
        {
            nEquipZoneID = (int)(nID >> 32);
            sensorType = Facility.ToFacilityType((int)(nID & 0xffffffff));
        }
    }
}
