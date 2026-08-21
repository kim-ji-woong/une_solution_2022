using System;
using System.Collections.Generic;
using System.Text;

namespace BusanTP.BLL.Models.Sensors
{
    public class Sensor
    {
        // 정상, 관심, 주의, 경계, 심각
        public enum StatusType { Normal = 0, Interest, Caution, Warning, Alert };

        private int m_nID = -1;
        private int m_nSensorType = 0;
        private string m_strSensorTypeName = "";
        private bool m_enabled = true;
        // 측정 단위(Unit of Material)
        private string m_uom = null;
        // 센서값
        private string m_strValue = null;
        // StatusType
        private int? m_status = null;
        // 3D 통신을 위한 값들
        private int? m_SensorType = null;
        private float? m_latitude = null;
        private float? m_longitude = null;
        private float? x = null;
        private float? y = null;

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

        public string SensorTypeName
        {
            get { return m_strSensorTypeName; }
            set { m_strSensorTypeName = value; }
        }

        public bool Enabled
        {
            get { return m_enabled; }
            set { m_enabled = value; }
        }

        // 측정 단위(Unit of Material)
        public string UoM
        {
            get { return m_uom; }
            set { m_uom = value; }
        }

        // 센서값
        public string Value
        {
            get { return m_strValue; }
            set { m_strValue = value; }
        }

        // StatusType
        public int? Status
        {
            get { return m_status; }
            set { m_status = value; }
        }

        
    }
}
