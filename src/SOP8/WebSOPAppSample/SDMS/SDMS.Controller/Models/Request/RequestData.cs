namespace SDMS.Controller.Models.Request
{
    public class RequestData
    {
        private int? m_rowCount = null;

        public int? RowCount
        {
            get { return m_rowCount; }
            set { m_rowCount = value; }
        }
    }

    public class RequestLinkedSop
    {
        private int m_nFireSensorID = -1;

        public int FireSensorID
        {
            get { return m_nFireSensorID; }
            set { m_nFireSensorID = value; }
        }
    }
}
