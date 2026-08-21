using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YH_SensorServer.Model
{
    public class RequestSensor
    {
        private int? m_nSensorID = null;

        public int? SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }
    }
}
