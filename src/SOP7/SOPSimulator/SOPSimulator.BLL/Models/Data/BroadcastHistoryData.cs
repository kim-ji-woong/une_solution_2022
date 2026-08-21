namespace SOPSimulator.BLL.Models.Data
{
    public class BroadcastHistoryData
    {
        private int m_nActionStepHistoryID = -1;
        private int m_nComponentID = -1;

        public int ActionStepHistoryID
        {
            get { return m_nActionStepHistoryID; }
            set { m_nActionStepHistoryID = value; }
        }

        public int ComponentID
        {
            get { return m_nComponentID; }
            set { m_nComponentID = value; }
        }

        public BroadcastHistoryData()
        {
        }

        public BroadcastHistoryData(int actionStepHistoryID, int componentID)
        {
            m_nActionStepHistoryID = actionStepHistoryID;
            m_nComponentID = componentID;
        }
    }
}
