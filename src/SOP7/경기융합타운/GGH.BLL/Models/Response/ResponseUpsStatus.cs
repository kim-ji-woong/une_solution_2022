using System.Collections.Generic;

namespace GGH.BLL.Models.Response
{
    public class ResponseUpsStatus : MessageResult
    {
        private int m_nSiteID = -1;
        private List<Ups> m_upsList = new List<Ups>();

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public List<Ups> UpsList
        {
            get { return m_upsList; }
            set { m_upsList = value; }
        }

        public ResponseUpsStatus()
            : base()
        {
        }

        public ResponseUpsStatus(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class Ups
    {
        private int m_nID = -1;
        private string m_strName = "";
        private double? m_currentData = null;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public double? CurrentData
        {
            get { return m_currentData; }
            set { m_currentData = value; }
        }
    }
}
