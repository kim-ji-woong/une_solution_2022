using System.Collections.Generic;

namespace GGH.BLL.Models.Response
{
    public class ResponseUpdatePOIPositions : MessageResult
    {
        private List<POIData> m_dddedSensors = new List<POIData>();

        public List<POIData> AddedSensors
        {
            get { return m_dddedSensors; }
            set { m_dddedSensors = value; }
        }

        public ResponseUpdatePOIPositions()
            : base()
        {
        }

        public ResponseUpdatePOIPositions(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class POIData
    {
        private int m_nTempID = -1;
        private int m_nSaveID = -1;
        private string m_strSensorType = null;

        public int TempID
        {
            get { return m_nTempID; }
            set { m_nTempID = value; }
        }

        public int SaveID
        {
            get { return m_nSaveID; }
            set { m_nSaveID = value; }
        }

        public string SensorType
        {
            get { return m_strSensorType; }
            set { m_strSensorType = value; }
        }

        public POIData()
        {
        }

        public POIData(int tempID, int saveID, string strSensorType)
        {
            m_nTempID = tempID;
            m_nSaveID = saveID;
            m_strSensorType = strSensorType;
        }
    }
}
