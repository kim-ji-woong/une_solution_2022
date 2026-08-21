using System;
using System.Collections.Generic;
using VDS.Model;

namespace VDS.BLL.Models.Response
{
    public class ResponseDataCenters : MessageResult
    {
        private List<DataCenterEx> m_dataCenters = new List<DataCenterEx>();

        public List<DataCenterEx> DataCenters
        {
            get { return m_dataCenters; }
            set { m_dataCenters = value; }
        }

        public ResponseDataCenters()
            : base()
        {
        }

        public ResponseDataCenters(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class DataCenterEx : Model.DataCenter.DataCenter
    {
        private SiteEx m_site = null;
        private Nation m_nation = null;
        private Model.DataCenter.Data m_data = null;
        private float m_fUsingRatio = 0;

        public SiteEx Site
        {
            get { return m_site; }
            set { m_site = value; }
        }

        public Nation Nation
        {
            get { return m_nation; }
            set { m_nation = value; }
        }

        public Model.DataCenter.Data Data
        {
            get { return m_data; }
            set { m_data = value; }
        }

        public float UsingRatio
        {
            get { return m_fUsingRatio; }
            set { m_fUsingRatio = value; }
        }

        public DataCenterEx()
        {
        }

        public DataCenterEx(Model.DataCenter.DataCenter dc, Model.DataCenter.Data data)
        {
            this.ID = dc.ID;
            this.Name = dc.Name;
            this.EngName = dc.EngName;
            this.SiteID = dc.SiteID;
            this.NationID = dc.NationID;
            this.Address = dc.Address;
            this.RegDate = dc.RegDate;
            this.Width = dc.Width;
            this.Length = dc.Length;
            this.Height = dc.Height;
            this.TileWidth = dc.TileWidth;
            this.TileLength = dc.TileLength;
            this.TileElevation = dc.TileElevation;
            this.UnitOfLength = dc.UnitOfLength;
            this.Type = dc.Type;
            this.Latitude = dc.Latitude;
            this.Longitude = dc.Longitude;
            this.Memo = dc.Memo;
            this.BeginGridX = dc.BeginGridX;
            this.BeginGridY = dc.BeginGridY;
            this.UTC = dc.UTC;
            this.CreationType = dc.CreationType;
            this.Data = data;
        }
    }

    public class ResponseSiteCompanies : MessageResult
    {
        private List<string> m_companies = new List<string>();

        public List<string> Companies
        {
            get { return m_companies; }
            set { m_companies = value; }
        }

        public ResponseSiteCompanies()
            : base()
        {
        }

        public ResponseSiteCompanies(bool success, string message)
            : base(success, message)
        {
        }
    }
}
