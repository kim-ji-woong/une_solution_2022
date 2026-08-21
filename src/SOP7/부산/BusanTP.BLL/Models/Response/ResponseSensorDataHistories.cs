using System;
using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseSensorDataHistories : MessageResult
    {
        private List<SensorDataHistory> m_sensorDataHistories = new List<SensorDataHistory>();

        public List<SensorDataHistory> SensorDataHistories
        {
            get { return m_sensorDataHistories; }
            set { m_sensorDataHistories = value; }
        }

        public ResponseSensorDataHistories() : base()
        {
        }

        public ResponseSensorDataHistories(bool success, string message) : base(success, message)
        {
        }
        
    }

    public class SensorDataHistory
    {
        private int m_nBuildingID = -1;
        private List<SensorData> m_sensorDataHistories = new List<SensorData>();
        
        public int BuildingID
        {
            get { return m_nBuildingID; }
            set { m_nBuildingID = value; }
        }
        
        public List<SensorData> SensorDataHistories
        {
            get { return m_sensorDataHistories; }
            set { m_sensorDataHistories = value; }
        }
    }

    public class SensorData 
    {
        int m_nSensorID = -1;
        int m_nMaterialID = -1;
        double? m_dValue = null;
        DateTime? m_dtTimeStamp = null;
        DateTime? m_dtOriginTimeStamp = null;
        
        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }
        
        public int MaterialID
        {
            get { return m_nMaterialID; }
            set { m_nMaterialID = value; }
        }
        
        public double? Value
        {
            get { return m_dValue; }
            set { m_dValue = value; }
        }
        
        public DateTime? TimeStamp
        {
            get { return m_dtTimeStamp; }
            set { m_dtTimeStamp = value; }
        }
        
        public DateTime? OriginTimeStamp
        {
            get { return m_dtOriginTimeStamp; }
            set { m_dtOriginTimeStamp = value; }
        }
        
    }
}