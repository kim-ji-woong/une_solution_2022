using System.Collections.Generic;

namespace History.IBLL.Models.Response
{
    public class ResponseSOPComponentHistories
    {
        private List<SopHistoryComponentData> m_sopComponentHistoryDatas = new List<SopHistoryComponentData>();
        public List<SopHistoryComponentData> SOPComponentHistoryDatas
        {
            get { return m_sopComponentHistoryDatas; }
            set { m_sopComponentHistoryDatas = value; }
        }
    }
}
