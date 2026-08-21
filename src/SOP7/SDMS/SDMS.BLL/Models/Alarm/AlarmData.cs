using dnsData.Sensor;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Alarm
{
    public class AlarmData : ICloneable
    {
        private DateTime? m_endTime = null;
        public DateTime? EndTime
        {
            get { return m_endTime; }
            set { m_endTime = value; }
        }

        private DateTime m_dtTime = new DateTime();
        public DateTime dtTime
        {
            get { return m_dtTime; }
            set { m_dtTime = value; }
        }

        private string m_strDateTime = "";
        public string StrDateTime
        {
            get { return m_strDateTime; }
            set { m_strDateTime = value; }
        }

        private int? m_nOrgSensorID = -1;
        public int? OrgSensorID
        {
            get { return m_nOrgSensorID; }
            set { m_nOrgSensorID = value; }
        }

        private int m_nSensorZoneID = -1;
        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        private int m_nSensorZoneHistoryID = -1;
        public int SensorZoneHistoryID
        {
            get { return m_nSensorZoneHistoryID; }
            set { m_nSensorZoneHistoryID = value; }
        }

        private string m_strSensorName = "";
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }

        private string m_strPositionName = "";
        public string PositionName
        {
            get { return m_strPositionName; }
            set { m_strPositionName = value; }
        }

        private string m_strBuildingName = "";
        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        private string m_strZoneName = "";
        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }

        private int m_nZoneID = -1;
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        private int m_nEquipZoneID = -1;
        public int EquipZoneID
        {
            get { return m_nEquipZoneID; }
            set { m_nEquipZoneID = value; }
        }

        private Facility.FacilityType m_facilityType = Facility.FacilityType.NONE;
        public Facility.FacilityType FacilityType
        {
            get { return m_facilityType; }
            set { m_facilityType = value; }
        }

        private string m_strFacilityTypeString = "";
        public string FacilityTypeString
        {
            get { return m_strFacilityTypeString; }
            set { m_strFacilityTypeString = value; }
        }

        private string m_strMessage = "";
        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        private int m_nSopStatus = -1;
        public int SopStatus
        {
            get { return m_nSopStatus; }
            set { m_nSopStatus = value; }
        }

        // 알람의 현재 등급
        private int m_AlarmDepth = -1;
        public int AlarmDepth
        {
            get { return m_AlarmDepth; }
            set
            {
                m_AlarmDepth = value;

                if (m_nMaxAlarmDepth < m_AlarmDepth)
                    m_nMaxAlarmDepth = m_AlarmDepth;
            }
        }

        // 가장 높았던 알람 등급
        private int m_nMaxAlarmDepth = -1;
        public int MaxAlarmDepth
        {
            get { return m_nMaxAlarmDepth; }
            set { m_nMaxAlarmDepth = value; }
        }

        private List<int> m_AlarmSensorZoneIDs = new List<int>();
        public List<int> AlarmSensorZoneIDs
        {
            get { return m_AlarmSensorZoneIDs; }
            set { m_AlarmSensorZoneIDs = value; }
        }

        private string m_strReleaseInfo = "";
        public string ReleaseInfo
        {
            get { return m_strReleaseInfo; }
            set { m_strReleaseInfo = value; }
        }

        private bool m_bIsAlarm = true;
        public bool IsAlarm
        {
            get { return m_bIsAlarm; }
            set { m_bIsAlarm = value; }
        }

        private string m_strReportPerson = "";
        public string ReportPerson
        {
            get { return m_strReportPerson; }
            set { m_strReportPerson = value; }
        }

        private string m_strMemo = "";
        /// <summary>
        /// 수동신고 메모
        /// </summary>
        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        private string m_strAlarmMemo = "";
        /// <summary>
        /// 사용자가 입력한 알람 메모
        /// </summary>
        public string AlarmMemo
        {
            get { return m_strAlarmMemo; }
            set { m_strAlarmMemo = value; }
        }

        private int? m_nMaterialType = null;
        public int? MaterialType 
        {
            get { return m_nMaterialType; }
            set { m_nMaterialType = value; }
        }

        private string m_strMaterialTypeString = "";
        public string MaterialTypeString
        {
            get { return m_strMaterialTypeString; }
            set { m_strMaterialTypeString = value; }
        }

        private int m_nSiteID = -1;
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        private string m_strETC = null;
        /// <summary>
        /// 기타 변수
        /// </summary>
        public string ETC
        {
            get { return m_strETC; }
            set { m_strETC = value; }
        }

        public object Clone()
        {
            AlarmData data = new AlarmData();
            Copy(this, data);

            return data;
        }

        public static void Copy(AlarmData src, AlarmData trg)
        {
            trg.m_endTime = src.m_endTime;
            trg.m_dtTime = src.m_dtTime;
            trg.m_strDateTime = src.m_strDateTime;
            trg.m_nOrgSensorID = src.m_nOrgSensorID;
            trg.m_nSensorZoneID = src.m_nSensorZoneID;
            trg.m_nSensorZoneHistoryID = src.m_nSensorZoneHistoryID;
            trg.m_strSensorName = src.m_strSensorName;
            trg.m_strPositionName = src.m_strPositionName;
            trg.m_strBuildingName = src.m_strBuildingName;
            trg.m_strZoneName = src.m_strZoneName;
            trg.m_nZoneID = src.m_nZoneID;
            trg.m_nEquipZoneID = src.m_nEquipZoneID;
            trg.m_facilityType = src.m_facilityType;
            trg.m_strFacilityTypeString = src.m_strFacilityTypeString;
            trg.m_strMessage = src.m_strMessage;
            trg.m_nSopStatus = src.m_nSopStatus;
            trg.m_nMaxAlarmDepth = src.m_nMaxAlarmDepth;
            trg.m_AlarmDepth = src.m_AlarmDepth;
            trg.m_AlarmSensorZoneIDs = src.m_AlarmSensorZoneIDs;
            trg.m_strReleaseInfo = src.m_strReleaseInfo;
            trg.m_bIsAlarm = src.m_bIsAlarm;
            trg.m_strReportPerson = src.m_strReportPerson;
            trg.m_strMemo = src.m_strMemo;
            trg.m_nMaterialType = src.m_nMaterialType;
            trg.m_strMaterialTypeString = src.m_strMaterialTypeString;
            trg.SiteID = src.SiteID;
            trg.AlarmMemo = src.AlarmMemo;
            trg.ETC = src.ETC;
        }
    }
}
