using System.Collections.Generic;

namespace Nipa.BLL.Models.Response.SDMS
{
    public class ResponseSensorDetectHistories : MessageResult
    {
        private List<SensorDetectHistoryData> m_sensorDetectHistoryDatas = new List<SensorDetectHistoryData>();
        public List<SensorDetectHistoryData> SensorDetectHistoryDatas
        {
            get { return m_sensorDetectHistoryDatas; }
            set { m_sensorDetectHistoryDatas = value; }
        }

        private int m_nLastSensorReactionHistoryID = -1;
        public int LastSensorReactionHistoryID
        {
            get { return m_nLastSensorReactionHistoryID; }
            set { m_nLastSensorReactionHistoryID = value; }
        }

        public ResponseSensorDetectHistories()
            : base()
        {
        }

        public ResponseSensorDetectHistories(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSensorDetectAnalysis : MessageResult
    {
        private List<SensorDetectAnalysisData> m_sensorDetectAnalysisDatas = new List<SensorDetectAnalysisData>();
        private int m_nAllDetectCount = 0;
        private double m_fAllMalfunctionRate = 0.0f;
        private string m_strMaxCountSensorName = "";
        private string m_strSearchZoneName = "전체";

        public List<SensorDetectAnalysisData> SensorDetectAnalysisDatas
        {
            get { return m_sensorDetectAnalysisDatas; }
            set { m_sensorDetectAnalysisDatas = value; }
        }
        public int AllDetectCount
        {
            get { return m_nAllDetectCount; }
            set { m_nAllDetectCount = value; }
        }
        public double AllMalfunctionRate
        {
            get { return m_fAllMalfunctionRate; }
            set { m_fAllMalfunctionRate = value; }
        }
        public string MaxCountSensorName
        {
            get { return m_strMaxCountSensorName; }
            set { m_strMaxCountSensorName = value; }
        }
        public string SearchZoneName
        {
            get { return m_strSearchZoneName; }
            set { m_strSearchZoneName = value; }
        }

        public ResponseSensorDetectAnalysis()
            : base()
        {
        }

        public ResponseSensorDetectAnalysis(bool success, string message)
            : base(success, message)
        {
        }
    }
}
