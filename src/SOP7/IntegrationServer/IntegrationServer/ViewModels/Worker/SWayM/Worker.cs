using System;

namespace IntegrationServer.ViewModels.Worker.SWayM
{
    public class Worker
    {
        private int m_nSensorID = -1;
        private string m_strUniqueKey = "";
        private string m_strName = "";
        private DateTime m_dtCreate = new DateTime();
        private string m_strState = "";
        private bool m_isAssign = true;
        private string m_strMcAddr = "";
        private string m_strDeviceName = "";

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public DateTime CreateTime
        {
            get { return m_dtCreate; }
            set { m_dtCreate = value; }
        }

        public string State
        {
            get { return m_strState; }
            set { m_strState = value; }
        }

        public bool IsAssign
        {
            get { return m_isAssign; }
            set { m_isAssign = value; }
        }

        public string MacAddress
        {
            get { return m_strMcAddr; }
            set { m_strMcAddr = value; }
        }

        public string DeviceName
        {
            get { return m_strDeviceName; }
            set { m_strDeviceName = value; }
        }
    }
}
