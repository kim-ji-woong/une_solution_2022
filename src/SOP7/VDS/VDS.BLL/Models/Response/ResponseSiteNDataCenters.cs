using System;
using System.Collections.Generic;
using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseSiteNDataCenters : MessageResult
    {
        // 전체 국가들
        private List<Nation> m_allNations = new List<Nation>();
        // Site에 속해있는 국가들
        private List<Nation> m_nations = new List<Nation>();
        private List<SiteEx> m_sites = new List<SiteEx>();

        // 전체 국가들
        public List<Nation> AllNations
        {
            get { return m_allNations; }
            set { m_allNations = value; }
        }

        // Site에 속해있는 국가들
        public List<Nation> Nations
        {
            get { return m_nations; }
            set { m_nations = value; }
        }

        public List<SiteEx> Sites
        {
            get { return m_sites; }
            set { m_sites = value; }
        }

        public ResponseSiteNDataCenters()
            : base()
        {
        }

        public ResponseSiteNDataCenters(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class SiteEx : Model.Site.Site
    {
        private Model.Site.Data m_siteData = null;
        private List<Model.DataCenter.DataCenter> m_dataCenters = new List<Model.DataCenter.DataCenter>();

        public Model.Site.Data Data
        {
            get { return m_siteData; }
            set { m_siteData = value; }
        }

        public List<Model.DataCenter.DataCenter> DataCenters
        {
            get { return m_dataCenters; }
            set { m_dataCenters = value; }
        }

        public SiteEx()
        {
        }

        public SiteEx(Model.Site.Site site, Model.Site.Data data)
        {
            this.EngName = site.EngName;
            this.ID = site.ID;
            this.Name = site.Name;
            this.Data = data;
        }
    }

    public class ResponseSiteNNation : MessageResult
    {
        private Model.Site.Site m_site = null;
        private Nation m_nation = null;

        public Model.Site.Site Site
        {
            get { return m_site; }
            set { m_site = value; }
        }

        public Nation Nation
        {
            get { return m_nation; }
            set { m_nation = value; }
        }

        public ResponseSiteNNation()
            : base()
        {
        }

        public ResponseSiteNNation(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSiteLicense : MessageResult
    {
        private DateTime m_beginDate = new DateTime();
        private DateTime m_endDate = new DateTime();
        private bool m_validation = false;
        private int m_nLicenseAlertDays = -1;

        public DateTime BeginDate
        {
            get { return m_beginDate; }
            set { m_beginDate = value; }
        }

        public DateTime EndDate
        {
            get { return m_endDate; }
            set { m_endDate = value; }
        }

        public bool Validation
        {
            get { return m_validation; }
            set { m_validation = value; }
        }

        public int LicenseAlertDays
        {
            get { return m_nLicenseAlertDays; }
            set { m_nLicenseAlertDays = value; }
        }

        public ResponseSiteLicense()
            : base()
        {
        }

        public ResponseSiteLicense(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseSite : MessageResult
    {
        private SiteEx m_site = null;

        public SiteEx Site
        {
            get { return m_site; }
            set { m_site = value; }
        }

        public ResponseSite()
            : base()
        {
        }

        public ResponseSite(bool success, string message)
            : base(success, message)
        {
        }
    }
}
