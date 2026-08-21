using System.Collections.Generic;
using SDMS.Model.CCTV;

namespace GGH.BLL.Models.Response
{
    public class ResponseCCTVList2 : MessageResult
    {
        private List<CCTV> m_cctvs = new List<CCTV>();

        public List<CCTV> Cctvs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        public ResponseCCTVList2()
            : base()
        {
        }

        public ResponseCCTVList2(bool success, string message)
            : base(success, message)
        {
        }
    }
}
