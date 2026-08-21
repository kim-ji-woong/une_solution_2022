namespace Hynix.DAL
{
    using IDAL;
    using dnsDBUtil;

    public class DataManager : IDataManager
    {
        private DirectDBManager m_dbManager = null;
        //private WebDBManager m_dbManager = null;

        private CreateManager m_createManager = null;
        private SelectManager m_selectManager = null;
        private DeleteManager m_deleteManager = null;
        private UpdateManager m_updateManager = null;

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
            if (m_createManager == null)
            {
                m_createManager = new CreateManager(this);
            }

            if (m_selectManager == null)
            {
                m_selectManager = new SelectManager(this);
            }

            if (m_deleteManager == null)
            {
                m_deleteManager = new DeleteManager(this);
            }

            if (m_updateManager == null)
            {
                m_updateManager = new UpdateManager(this);
            }
        }

        public ICreate GetCreateManager()
        {
            if (m_createManager != null)
            {
                return m_createManager;
            }
            else
            {
                return null;
            }
        }

        public IDelete GetDeleteManager()
        {
            if (m_deleteManager != null)
            {
                return m_deleteManager;
            }
            else
            {
                return null;
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

        public IUpdate GetUpdateManager()
        {
            if (m_updateManager != null)
            {
                return m_updateManager;
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

        public void SetDBManager(DirectDBManager dbMgr)
        {
            m_dbManager = dbMgr;
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

        public IDataManager Clone()
        {
            DataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, m_dbManager.DbHost, m_dbManager.DbName, m_dbManager.DbID, m_dbManager.DbPw, SiteID);
            return dataManager;
        }

        public IDataManager Clone(string strDbHost, string strDbName, string strDbID, string strDbPw, int siteID)
        {
            DataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, strDbHost, strDbName, strDbID, strDbPw, siteID);
            return dataManager;
        }
    }
}
