using System;
using System.Collections.Generic;
using System.Text;
using History.BLL.Models.Data;
using SDMS.Model.History;

namespace Industrial.BLL.Model.Response
{
    public class ResponseIndustrialSensorDetectHistories
    {
        private List<SensorDetectHistoryData> m_sensorDetectHistoryDatas = new List<SensorDetectHistoryData>();

        public List<SensorDetectHistoryData> SensorDetectHistoryDatas
        {
            get { return m_sensorDetectHistoryDatas; }
            set { m_sensorDetectHistoryDatas = value; }
        }

        private List<SensorZoneHistory> m_sensorZoneHistories = new List<SensorZoneHistory>();

        public List<SensorZoneHistory> SensorZoneHistories
        {
            get { return m_sensorZoneHistories; }
            set { m_sensorZoneHistories= value; }
        }

        private int m_nLastSensorReactionHistoryID = -1;

        public int LastSensorReactionHistoryID
        {
            get { return m_nLastSensorReactionHistoryID; }
            set { m_nLastSensorReactionHistoryID = value; }
        }
    }
}
