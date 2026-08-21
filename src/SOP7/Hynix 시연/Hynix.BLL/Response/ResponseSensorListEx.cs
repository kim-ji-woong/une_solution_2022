using System.Collections.Generic;
using SDMS.BLL.Models.Response;
using Hynix.Model;
using SDMS.BLL.Models.Data.Sensor;

namespace Hynix.BLL.Response
{
    public class ResponseSensorListEx : ResponseSensorList
    {
        private List<CardReader> m_cardReaders = new List<CardReader>();
        private List<SmartTagReader> m_smartTagReaders = new List<SmartTagReader>();
        private List<Door> m_doors = new List<Door>();

        public List<CardReader> CardReaders
        {
            get { return m_cardReaders; }
            set { m_cardReaders = value; }
        }

        public List<SmartTagReader> SmartTagReaders
        {
            get { return m_smartTagReaders; }
            set { m_smartTagReaders = value; }
        }

        public List<Door> Doors
        {
            get { return m_doors; }
            set { m_doors = value; }
        }

        public ResponseSensorListEx()
            : base()
        {
            Init();
        }

        public ResponseSensorListEx(bool success, string message)
            : base(success, message)
        {
            Init();
        }

        private void Init()
        {
            FireSensors = new List<FireSensor>();
            PSMSensors = new List<PSMSensor>();
            EtcSensors = new List<EtcSensor>();
            Cctvs = new List<CCTVSensor>();
            EarthquakeSensors = new List<EtcSensor>();
            StrongWindSensors = new List<EtcSensor>();
            EnvironmentSensors = new List<EtcSensor>();
            ManufactureSensors = new List<EtcSensor>();
            EmergencyBellSensors = new List<EtcSensor>();
            LaserSensors = new List<EtcSensor>();
        }
    }
}
