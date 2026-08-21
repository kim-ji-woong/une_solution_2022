using System.Collections.Generic;
using SDMS.BLL.Models.Alarm;
using Hynix.Model.History;

namespace Hynix.BLL.Response
{
    public class ResponseTodayAlarmDataEx : MessageResult
    {
        private List<AlarmDataEx> m_alarmDatas = new List<AlarmDataEx>();

        public List<AlarmDataEx> AlarmDatas
        {
            get { return m_alarmDatas; }
            set { m_alarmDatas = value; }
        }

        public ResponseTodayAlarmDataEx()
            : base()
        {
        }

        public ResponseTodayAlarmDataEx(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class AlarmDataEx : AlarmData
    {
        private List<SensorZoneInfo> m_sensorZoneHistoryInfos = new List<SensorZoneInfo>();
        private int m_nFacilityType = -1;
        // 알람에 관련된 센서의 ID
        private int? m_targetSensorID = null;

        public new int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }

        // 알람에 관련된 센서의 ID
        public int? TargetSensorID
        {
            get { return m_targetSensorID; }
            set { m_targetSensorID = value; }
        }

        public List<SensorZoneInfo> SensorZoneHistoryInfos
        {
            get { return m_sensorZoneHistoryInfos; }
            set { m_sensorZoneHistoryInfos = value; }
        }

        public AlarmDataEx()
        {
        }

        public AlarmDataEx(AlarmData alarmData)
        {
            this.dtTime = alarmData.dtTime;
            this.StrDateTime = alarmData.StrDateTime;
            this.OrgSensorID = alarmData.OrgSensorID;
            this.SensorZoneID = alarmData.SensorZoneID;
            this.SensorZoneHistoryID = alarmData.SensorZoneHistoryID;
            this.SensorName = alarmData.SensorName;
            this.PositionName = alarmData.PositionName;
            this.BuildingName = alarmData.BuildingName;
            this.ZoneName = alarmData.ZoneName;
            this.ZoneID = alarmData.ZoneID;
            this.EquipZoneID = alarmData.EquipZoneID;
            this.FacilityType = (int)alarmData.FacilityType;
            this.FacilityTypeString = alarmData.FacilityTypeString;
            this.Message = alarmData.Message;
            this.SopStatus = alarmData.SopStatus;
            this.AlarmDepth = alarmData.AlarmDepth;
            this.MaxAlarmDepth = alarmData.MaxAlarmDepth;
            this.AlarmSensorZoneIDs = alarmData.AlarmSensorZoneIDs;
            this.ReleaseInfo = alarmData.ReleaseInfo;
            this.IsAlarm = alarmData.IsAlarm;
            this.ReportPerson = alarmData.ReportPerson;
            this.Memo = alarmData.Memo;
            this.AlarmMemo = alarmData.AlarmMemo;
            this.MaterialType = alarmData.MaterialType;
            this.MaterialTypeString = alarmData.MaterialTypeString;
            this.SiteID = alarmData.SiteID;
            this.ETC = alarmData.ETC;
        }
    }
}
