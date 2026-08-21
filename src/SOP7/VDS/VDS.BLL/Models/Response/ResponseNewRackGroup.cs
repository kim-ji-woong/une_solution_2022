using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseNewRackGroup : MessageResult
    {
        private RackGroup m_rackGroup = null;

        public RackGroup RackGroup
        {
            get { return m_rackGroup; }
            set { m_rackGroup = value; }
        }

        public ResponseNewRackGroup()
            : base()
        {
        }

        public ResponseNewRackGroup(bool success, string message)
            : base(success, message)
        {
        }
    }
}
