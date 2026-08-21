namespace SDMS.BLL.Models.Data.Sensor
{
    using Model.CCTV;

    public class CCTVSensor : CCTV
    {
        private int? m_nSensorTagID = null;
        private int? m_nSensorZoneID = null;

        public string Name
        {
            get { return this.CameraName; }
            set { this.CameraName = value; }
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
            this.SiteID = cctv.SiteID;
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

        public int? SiteID { get; set; }
        public int? EquipZoneID { get; set; }
    }
}
