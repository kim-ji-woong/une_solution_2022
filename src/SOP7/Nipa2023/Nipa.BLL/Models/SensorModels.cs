using System;
using System.Collections.Generic;
using Nipa.Model.Sdms.Sensor;
using Nipa.Model.Sdms.Spatial;
using Nipa.Model.Sdms.CCTV;

namespace Nipa.BLL.Models
{
    public class FireSensor : Fire
    {
        private bool m_isIndoor = false;
        // SensorTagInfo 테이블의 ID
        private int? m_nSensorTagID = null;
        private int? m_nSensorZoneID = null;
        // SensorTagInfo 테이블의 TagNo
        private int? m_nTagNo = null;

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

        // SensorTagInfo 테이블의 TagNo
        public int? TagNo
        {
            get { return m_nTagNo; }
            set { m_nTagNo = value; }
        }

        public FireSensor()
        {
        }

        public FireSensor(Fire fire)
        {
            this.ID = fire.ID;
            this.Name = fire.Name;
            this.PositionName = fire.PositionName;
            this.X = fire.X;
            this.Y = fire.Y;
            this.Z = fire.Z;
            this.ZoneID = fire.ZoneID;
            this.Department = fire.Department;
            this.DepartmentPhoneNumber = fire.DepartmentPhoneNumber;
            this.SensorSubType = fire.SensorSubType;
            this.Enabled = fire.Enabled;
        }
    }

    public class PSMSensor : PSM
    {
        private bool m_isIndoor = false;
        private List<Zone> m_linkedZones = new List<Zone>();
        // SensorTagInfo 테이블의 ID
        private int? m_nSensorTagID = null;
        private int? m_nSensorZoneID = null;
        // FacilityType
        private int m_nFacilityType = -1;
        private MultiSensor m_multiSensor = new MultiSensor();

        public bool IsIndoor
        {
            get { return m_isIndoor; }
            set { m_isIndoor = value; }
        }

        public List<Zone> LinkedZones
        {
            get { return m_linkedZones; }
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

        public MultiSensor MultiSensor
        {
            get { return m_multiSensor; }
            set { m_multiSensor = value; }
        }

        public PSMSensor()
        {
        }

        public PSMSensor(PSM psm)
        {
            this.ID = psm.ID;
            this.Name = psm.Name;
            this.PositionName = psm.PositionName;
            this.X = psm.X;
            this.Y = psm.Y;
            this.Z = psm.Z;
            this.ZoneID = psm.ZoneID;
            this.EquipZoneID = psm.EquipZoneID;
            this.CurrentData = psm.CurrentData;
            this.EquipZoneID = psm.EquipZoneID;
            this.Department = psm.Department;
            this.DepartmentPhoneNumber = psm.DepartmentPhoneNumber;
            this.Status = psm.Status;
            this.Enabled = psm.Enabled;
            this.UniqueKey = psm.UniqueKey;
        }
    }

    public class EtcSensor : ETC
    {
        private bool m_isIndoor = false;
        // SensorTagInfo 테이블의 ID
        private int? m_nSensorTagID = null;
        private int? m_nSensorZoneID = null;
        // FacilityType
        private int m_nFacilityType = -1;
        private MultiSensor m_multiSensor = new MultiSensor();

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

        public MultiSensor MultiSensor
        {
            get { return m_multiSensor; }
            set { m_multiSensor = value; }
        }

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

    public class CCTVSensor : CCTV
    {
        private int? m_nSensorTagID = null;
        private int? m_nSensorZoneID = null;
        private int m_nFacilityType = (int)dnsData.Sensor.Facility.FacilityType.CCTV;
        private string m_strFacilityTypeName = "";

        public string Name
        {
            get { return this.CameraName; }
            set { this.CameraName = value; }
        }

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }

        public string FacilityTypeName
        {
            get { return m_strFacilityTypeName; }
            set { m_strFacilityTypeName = value; }
        }

        public CCTVSensor()
        {
        }

        public CCTVSensor(CCTV cctv)
        {
            this.ID = cctv.ID;
            this.CameraName = cctv.CameraName;
            this.PositionName = cctv.PositionName;
            this.UniqueKey = cctv.UniqueKey;
            this.X = cctv.X;
            this.Y = cctv.Y;
            this.Z = cctv.Z;
            this.ZoneID = cctv.ZoneID;
            this.IsIndoor = cctv.IsIndoor;
            this.Type = cctv.Type;
            this.Channel = cctv.Channel;
            this.URL = cctv.URL;
            this.BigURL = cctv.BigURL;
            this.SmallURL = cctv.SmallURL;
            this.CameraIP = cctv.CameraIP;
            this.CameraCompanyName = cctv.CameraCompanyName;
            this.CameraModelName = cctv.CameraModelName;
            this.Description = cctv.Description;
            this.Enabled = cctv.Enabled;
        }

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
    }

    public class MultiSensor
    {
        private bool m_isMultiSensor = false;
        private List<int> m_sensorIDList = new List<int>();
        
        public bool IsMultiSensor
        {
            get { return m_isMultiSensor; }
            set { m_isMultiSensor = value; }
        }

        public List<int> IDList
        {
            get { return m_sensorIDList; }
            set { m_sensorIDList = value; }
        }
    }
}
