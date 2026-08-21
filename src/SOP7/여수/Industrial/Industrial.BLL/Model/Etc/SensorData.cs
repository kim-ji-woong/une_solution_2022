using System;
using System.Collections.Generic;
using System.Text;

namespace Industrial.BLL.Model.Etc
{
    public class SensorData
    {
        private int? m_nSensorType = -1;
        private int m_nSensorID = -1;
        private string m_strSensorName = null;
        private float? m_fLatitude = null;
        private float? m_fLongitude = null;
        private float? m_x = null;
        private float? m_y = null;
        private int? m_nStatus = null;

        public int? SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value;}
        }
        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value;}
        }
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
        public float? Latitude
        {
            get { return m_fLatitude; }
            set { m_fLatitude = value; }
        }
        public float? Longitude 
        {
            get { return m_fLongitude; }
            set { m_fLongitude = value;}
        }
        public float? X
        {
            get { return m_x; }
            set { m_x = value; }
        }

        public float? Y
        {
            get { return m_y; }
            set { m_y = value; }
        }

        public int? Status
        {
            get { return m_nStatus; }
            set { m_nStatus = value;}
        }
    }
}
