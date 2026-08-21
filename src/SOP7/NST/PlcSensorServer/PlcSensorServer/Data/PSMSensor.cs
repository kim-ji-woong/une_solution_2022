namespace PlcSensorServer.Data
{
    using SDMS.Model.Sensor;

    public class PSMSensor : PSM
    {
        private int m_nSensorZoneID = -1;
        private int m_nSensorTagInfoID = -1;

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int SensorTagInfoID
        {
            get { return m_nSensorTagInfoID; }
            set { m_nSensorTagInfoID = value; }
        }

        public PSMSensor()
        {
        }

        public PSMSensor(PSM sensor)
        {
            this.CurrentData = sensor.CurrentData;
            this.Department = sensor.Department;
            this.DepartmentPhoneNumber = sensor.DepartmentPhoneNumber;
            this.Enabled = sensor.Enabled;
            this.EquipZoneID = sensor.EquipZoneID;
            this.ID = sensor.ID;
            /*this.LimitLevel1 = sensor.LimitLevel1;
            this.LimitLevel2 = sensor.LimitLevel2;
            this.LimitLevel3 = sensor.LimitLevel3;*/
            this.MaterialType = sensor.MaterialType;
            this.Name = sensor.Name;
            this.PositionName = sensor.PositionName;
            this.Status = sensor.Status;
            this.UniqueKey = sensor.UniqueKey;
            /*this.UseLimitLevel1 = sensor.UseLimitLevel1;
            this.UseLimitLevel2 = sensor.UseLimitLevel2;
            this.UseLimitLevel3 = sensor.UseLimitLevel3;*/
            this.X = sensor.X;
            this.Y = sensor.Y;
            this.Z = sensor.Z;
            this.ZoneID = sensor.ZoneID;
            this.LimitBase = sensor.LimitBase;
            this.LimitType = sensor.LimitType;
            this.LimitValue = sensor.LimitValue;
        }
    }
}
