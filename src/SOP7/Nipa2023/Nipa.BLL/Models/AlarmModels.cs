using System;
using System.Collections.Generic;
using dnsData.Sensor;

namespace Nipa.BLL.Models
{
    public class AlarmData : ICloneable, IComparable
    {
        // 시작하기전, SOP 실행요청, SOP 실행중, SOP 종료
        public enum SopStatusType { NotBegin = -1, RequestBegin, Progress, Finish };

        // 알람발생시간
        private DateTime m_dtTime = new DateTime();
        public DateTime EventTime
        {
            get { return m_dtTime; }
            set { m_dtTime = value; }
        }

        // 알람종료시간
        private DateTime? m_dtCloseTime = null;
        public DateTime? CloseTime
        {
            get { return m_dtCloseTime; }
            set { m_dtCloseTime = value; }
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

        private string m_strFacilityTypeName = "";
        public string FacilityTypeName
        {
            get { return m_strFacilityTypeName; }
            set { m_strFacilityTypeName = value; }
        }

        private string m_strMessage = "";
        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        private int m_nSopStatus = (int)SopStatusType.NotBegin;
        public int SopStatus
        {
            get { return m_nSopStatus; }
            set { m_nSopStatus = value; }
        }

        private int m_AlarmDepth = -1;
        public int AlarmDepth
        {
            get { return m_AlarmDepth; }
            set { m_AlarmDepth = value; }
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

        private string m_strMaterialTypeName = "";
        public string MaterialTypeName
        {
            get { return m_strMaterialTypeName; }
            set { m_strMaterialTypeName = value; }
        }

        private string m_strWorkerTag = null;
        public string WorkerTag
        {
            get { return m_strWorkerTag; }
            set { m_strWorkerTag = value; }
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

        private int? m_facilityNo = null;

        public int? FacilityNo
        {
            get { return m_facilityNo; }
            set { m_facilityNo = value; }
        }

        private MesEquipmentDataEx m_mesEquipmentData = null;

        public MesEquipmentDataEx EquipmentData
        {
            get { return m_mesEquipmentData; }
            set { m_mesEquipmentData = value; }
        }

        public object Clone()
        {
            AlarmData data = new AlarmData();
            Copy(this, data);

            return data;
        }

        public int CompareTo(object obj)
        {
            AlarmData data1 = this;
            AlarmData data2 = (AlarmData)obj;

            if (data1.EventTime < data2.EventTime)
                return -1;
            else if (data1.EventTime > data2.EventTime)
                return 1;
            
            return 0;
        }

        public static void Copy(AlarmData src, AlarmData trg)
        {
            trg.m_dtTime = src.m_dtTime;
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
            trg.m_strFacilityTypeName = src.m_strFacilityTypeName;
            trg.m_strMessage = src.m_strMessage;
            trg.m_nSopStatus = src.m_nSopStatus;
            trg.m_AlarmDepth = src.m_AlarmDepth;
            trg.m_AlarmSensorZoneIDs = src.m_AlarmSensorZoneIDs;
            trg.m_strReleaseInfo = src.m_strReleaseInfo;
            trg.m_bIsAlarm = src.m_bIsAlarm;
            trg.m_strReportPerson = src.m_strReportPerson;
            trg.m_strMemo = src.m_strMemo;
            trg.m_nMaterialType = src.m_nMaterialType;
            trg.m_strMaterialTypeName = src.m_strMaterialTypeName;
            trg.SiteID = src.SiteID;
            trg.AlarmMemo = src.AlarmMemo;
            trg.ETC = src.ETC;
            trg.EquipmentData = src.EquipmentData;
        }
    }
}
