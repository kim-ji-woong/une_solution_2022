using SDMS.Model.Spatial;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Response
{
    using Model._2D;
    public class ResponseImagePath : MessageResult
    {

        private List<Sdms2DImage> m_Sdms2DImages = null;

        public List<Sdms2DImage> Sdms2DImages
        {
            get { return m_Sdms2DImages; }
            set { m_Sdms2DImages = value; }
        }

        public ResponseImagePath()
        {
            m_Sdms2DImages = new List<Sdms2DImage>();
        }


        private int nID = -1;
        private int m_zoneID = -1;
        private string m_filePath = "";
        private int m_siteID = -1;

        public int ID
        {
            get { return nID; }
            set { nID = value; }
        }
        public int ZoneID
        {
            get { return m_zoneID; }
            set { m_zoneID = value; }
        }

        public string FilePath
        {
            get { return m_filePath; }
            set { m_filePath = value; }
        }
        public int SiteID
        {
            get { return m_siteID; }
            set { m_siteID = value; }
        }

    }
}
