namespace Soulbrain.Models.Request
{
    public class RequestLinkedSop
    {
        private int m_nPsmSensorID = -1;

        public int PsmSensorID
        {
            get { return m_nPsmSensorID; }
            set { m_nPsmSensorID = value; }
        }
    }
}
