using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SysWillAlarm.Models
{
    class AlarmData
    {
        public enum AlarmTypes { Fire = 0, Terror, EmergencyBell, Earthquake, Water, Blackout, Gas, None };
        // 발생, 처리완료, 알람무시, 처리중
        public enum AlarmStatus { Alarm = 0, Clear, Ignore, Processing, None };

        private string m_strFacilityID = "";
        private string m_strBuildingName = "";
        private string m_strFloorName = "";
        private string m_strAlarmLevel = "";
        // 알람발생시간
        private string m_strTimestamp = "";
        private int m_nAlarmNo = -1;
        private bool m_isTrainingMode = false;
        // 알람처리시간
        private string m_strProcessTime = "";
        private AlarmTypes m_alarmType = AlarmTypes.None;
        private AlarmStatus m_alarmStatus = AlarmStatus.None;

        public string FacilityID
        {
            get { return m_strFacilityID; }
            set { m_strFacilityID = value; }
        }

        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        public string FloorName
        {
            get { return m_strFloorName; }
            set { m_strFloorName = value; }
        }

        public string AlarmLevel
        {
            get { return m_strAlarmLevel; }
            set { m_strAlarmLevel = value; }
        }

        public string Timestamp
        {
            get { return m_strTimestamp; }
            set { m_strTimestamp = value; }
        }

        public int AlarmNo
        {
            get { return m_nAlarmNo; }
            set { m_nAlarmNo = value; }
        }

        public bool IsTrainingMode
        {
            get { return m_isTrainingMode; }
            set { m_isTrainingMode = value; }
        }

        public string ProcessTime
        {
            get { return m_strProcessTime; }
            set { m_strProcessTime = value; }
        }

        public AlarmTypes AlarmType
        {
            get { return m_alarmType; }
            set { m_alarmType = value; }
        }

        public AlarmStatus Status
        {
            get { return m_alarmStatus; }
            set { m_alarmStatus = value; }
        }

        public int? FloorIndex
        {
            get
            {
                if (m_strFloorName == null || m_strFloorName.Length == 0)
                    return null;

                int nFloorIndex;

                if (m_strFloorName.StartsWith("B"))
                {
                    string strFloorIndex = m_strFloorName.Substring(1, m_strFloorName.Length - 2);

                    if (int.TryParse(strFloorIndex, out nFloorIndex))
                        return nFloorIndex * (-1);
                }
                else
                {
                    string strFloorIndex = m_strFloorName.Substring(1, m_strFloorName.Length - 1);

                    if (int.TryParse(strFloorIndex, out nFloorIndex))
                        return nFloorIndex - 1;
                }

                return null;
            }
        }

        public int GetAlarmLevel()
        {
            int alarmLevel;

            if (int.TryParse(m_strAlarmLevel, out alarmLevel))
                return alarmLevel;

            return 1;
        }

        public static AlarmTypes ToAlarmTypes(string strAlarmType)
        {
            if (strAlarmType == "F")
                return AlarmTypes.Fire;
            else if (strAlarmType == "T")
                return AlarmTypes.Terror;
            else if (strAlarmType == "I")
                return AlarmTypes.EmergencyBell;
            else if (strAlarmType == "E")
                return AlarmTypes.Earthquake;
            else if (strAlarmType == "W")
                return AlarmTypes.Water;
            else if (strAlarmType == "B")
                return AlarmTypes.Blackout;
            else if (strAlarmType == "G")
                return AlarmTypes.Gas;

            return AlarmTypes.None;
        }

        public static AlarmStatus ToAlarmStatus(int alarmStatus)
        {
            if (alarmStatus == 0)
                return AlarmStatus.Alarm;
            else if (alarmStatus == 1)
                return AlarmStatus.Clear;
            else if (alarmStatus == 2)
                return AlarmStatus.Ignore;
            else if (alarmStatus == 3)
                return AlarmStatus.Processing;

            return AlarmStatus.None;
        }
    }
}
