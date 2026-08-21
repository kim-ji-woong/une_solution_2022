using System.Collections.Generic;
using GGH.Model.CCTV;

namespace GGH.BLL.Models.Response
{
    public class ResponseNvrList : MessageResult
    {
        private List<Nvr> m_nvrList = new List<Nvr>();

        public List<Nvr> NvrList
        {
            get { return m_nvrList; }
            set { m_nvrList = value; }
        }

        public ResponseNvrList()
            : base()
        {
        }

        public ResponseNvrList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
