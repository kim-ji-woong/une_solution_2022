using System;
using System.Collections.Generic;
using GGH.Model.CCTV;

namespace GGH.BLL.Models.Response
{
    public class ResponseCCTVPopupList : MessageResult
    {
        private List<CCTVStatus> m_statusList = new List<CCTVStatus>();

        public List<CCTVStatus> Popups
        {
            get { return m_statusList; }
            set { m_statusList = value; }
        }

        public ResponseCCTVPopupList()
            : base()
        {
        }

        public ResponseCCTVPopupList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseCCTVPopup : MessageResult
    {
        private CCTVStatus m_status = null;

        public CCTVStatus Popup
        {
            get { return m_status; }
            set { m_status = value; }
        }

        public ResponseCCTVPopup()
            : base()
        {
        }

        public ResponseCCTVPopup(bool success, string message)
            : base(success, message)
        {
        }
    }
}
