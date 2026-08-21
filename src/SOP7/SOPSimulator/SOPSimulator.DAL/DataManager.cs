using System.Collections;

namespace SOPSimulator.DAL
{
    using IDAL;
    using dnsDBUtil;

    public class DataManager : IDataManager
    {
        private DirectDBManager m_dbManager = null;
        //private WebDBManager m_dbManager = null;

        private SelectManager m_selectManager = null;

        private int m_nSiteID = 0;

        public int SiteID
        {
            get
            {
                return m_nSiteID;
            }
        }

        public DataManager()
        {
            SetDBConnection();

            CreateAllManager();
        }

        public DataManager(int nSiteID)
        {
            m_nSiteID = nSiteID;
            SetDBConnection();

            CreateAllManager();
        }

        public DataManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw, int nSiteID)
        {
            m_nSiteID = nSiteID;
            SetDBConnection(nDbType, strDbHost, strDbName, strDbID, strDbPw);

            CreateAllManager();
        }

        public void CreateAllManager()
        {
            if (m_selectManager == null)
            {
                m_selectManager = new SelectManager(this);
            }
        }

        public ISelect GetSelectManager()
        {
            if (m_selectManager != null)
            {
                return m_selectManager;
            }
            else
            {
                return null;
            }
        }
        public object GetDBManager()
        {
            if (m_dbManager != null)
            {
                return m_dbManager;
            }
            else
            {
                return null;
            }
        }

        public void SetDBConnection()
        {
            if (m_dbManager == null)
            {
                m_dbManager = new DirectDBManager();
            }
        }

        public void SetDBConnection(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            if (m_dbManager == null)
            {
                m_dbManager = new DirectDBManager(nDbType, strDbHost, strDbName, strDbID, strDbPw);
            }
        }
    }
}
