using System.Collections.Generic;
using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseNewRack : MessageResult
    {
        private Rack m_rack = null;

        public Rack Rack
        {
            get { return m_rack; }
            set { m_rack = value; }
        }

        public ResponseNewRack()
            : base()
        {
        }

        public ResponseNewRack(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseNewRacks : MessageResult
    {
        private List<Rack> m_racks = new List<Rack>();

        public List<Rack> Racks
        {
            get { return m_racks; }
            set { m_racks = value; }
        }

        public ResponseNewRacks()
            : base()
        {
        }

        public ResponseNewRacks(bool success, string message)
            : base(success, message)
        {
        }
    }
}
