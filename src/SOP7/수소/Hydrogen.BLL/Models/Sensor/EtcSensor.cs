using SDMS.Model.Sensor;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.BLL.Models.Sensor
{
    public class EtcSensor : ETC
    {
        private bool m_isIndoor = false;
        // SensorTagInfo 테이블의 ID
        private int? m_nSensorTagID = null;
        private int? m_nSensorZoneID = null;
        // FacilityType
        private int m_nFacilityType = -1;

        public bool IsIndoor
        {
            get { return m_isIndoor; }
            set { m_isIndoor = value; }
        }

        // SensorTagInfo 테이블의 ID
        public int? SensorTagInfoID
        {
            get { return m_nSensorTagID; }
            set { m_nSensorTagID = value; }
        }

        public int? SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }

        public int? EquipZoneID { get; set; }

        public EtcSensor()
        {
        }

        public EtcSensor(ETC etc)
        {
            this.ID = etc.ID;
            this.Name = etc.Name;
            this.MaterialType = etc.MaterialType;
            this.PositionName = etc.PositionName;
            this.X = etc.X;
            this.Y = etc.Y;
            this.Z = etc.Z;
            this.CurrentData = etc.CurrentData;
            this.ZoneID = etc.ZoneID;
            this.Department = etc.Department;
            this.DepartmentPhoneNumber = etc.DepartmentPhoneNumber;
            this.Status = etc.Status;
            this.Enabled = etc.Enabled;
            this.UniqueKey = etc.UniqueKey;
        }
    }
}
