using System;

namespace BusanSensorServer.Models
{
    public class AlarmInfo
    {
        public int SensorZoneHistoryID { get; set; }
        public int SensorType { get; set; }
        public DateTime TimeStamp { get; set; }
        public int SopStatus { get; set; }
        public int AlarmDepth { get; set; }
        public int SensorZoneID { get; set; }
    }
    
    /// <summary>
    /// SensorZone + SensorTagInfo
    /// </summary>
    public class SensorTag
    {
        private int m_nID = 0;
        private int m_nSensorType = 0;
        private int m_nTagID = 0;
        private int m_nTagNo = 0;
        private int m_nSensorZoneID = 0;
        private int m_nOrgSensorID = 0;
        private int m_nSensorServerID = 0;
        private string m_strDescription = string.Empty;

        /// <summary>
        /// SensorTagInfo 테이블 ID
        /// </summary>
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int TagID
        {
            get { return m_nTagID; }
            set { m_nTagID = value; }
        }
        
        public int TagNo
        {
            get { return m_nTagNo; }
            set { m_nTagNo = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int OrgSensorID
        {
            get { return m_nOrgSensorID; }
            set { m_nOrgSensorID = value; }
        }

        public int SensorServerID
        {
            get { return m_nSensorServerID; }
            set { m_nSensorServerID = value; }
        }

        public string Description
        {
            get { return m_strDescription; }
            set { m_strDescription = value; }
        }
    }
}