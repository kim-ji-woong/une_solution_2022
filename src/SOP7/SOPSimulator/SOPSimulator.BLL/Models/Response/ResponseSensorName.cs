using System;
using System.Collections.Generic;
using System.Text;

namespace SOPSimulator.BLL.Models.Response
{
    public class ResponseSensorName
    {
        private string m_strSensorName = "";
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
    }

    public class ResponseSensorMaterials
    {
        private string m_strSensorMaterials = "";
        public string SensorMaterials
        {
            get { return m_strSensorMaterials; }
            set { m_strSensorMaterials = value; }
        }
    }
}
