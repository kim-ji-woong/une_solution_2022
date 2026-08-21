using System.Collections.Generic;

namespace SOPManager.BLL.Models.Response
{
    using Model.Sop.Config;
    using SOPManager.BLL.Models.SOP;

    public class ResponseLinkedSOPs : MessageResult
    {
        private List<LinkedSop> m_linkedSops = null;

        public List<LinkedSop> LinkedSops
        {
            get { return m_linkedSops; }
            set { m_linkedSops = value; }
        }
    }

    public class ResponseLoadLinkedSopDatas : MessageResult
    {
        public List<LinkedSopData> LinkedSopDatas { get; set; }
    }

    public class ResponseLoadLinkedSopVersions : MessageResult
    {
        public List<int> VersionIDs { get; set; }
    }
}
