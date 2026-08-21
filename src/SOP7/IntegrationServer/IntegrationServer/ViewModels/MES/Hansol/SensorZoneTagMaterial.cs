using Nipa.Model.Sdms.Sensor;

namespace IntegrationServer.ViewModels.MES.Hansol
{
    public class SensorZoneTagMaterial
    {
        private SensorZone m_sensorZone = null;
        private TagInfo m_tagInfo = null;
        private Material m_material = null;

        public SensorZone SensorZone
        {
            get { return m_sensorZone; }
            set { m_sensorZone = value; }
        }

        public TagInfo TagInfo
        {
            get { return m_tagInfo; }
            set { m_tagInfo = value; }
        }

        public Material Material
        {
            get { return m_material; }
            set { m_material = value; }
        }
    }
}
