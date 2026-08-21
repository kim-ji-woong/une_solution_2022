using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Text;
using TeamEditor.IDAL;

namespace TeamEditor.DAL
{
    public class DataManager : IDataManager
    {
        private DirectDBManager m_dbManager = null;
        //private WebDBManager m_dbManager = null;

        private ICreate m_createManager = null;
        private IDelete m_deleteManager = null;
        private ISelect m_selectManager = null;
        private IUpdate m_updateManager = null;

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
            return m_createManager;
        }

        public IDelete GetDeleteManager()
        {
            return m_deleteManager;
        }

        public ISelect GetSelectManager()
        {
            return m_selectManager;
        }

        public IUpdate GetUpdateManager()
        {
            return m_updateManager;
        }

        public object GetDBManager()
        {
            return m_dbManager;
        }

        public void SetDBManager(object dbMgr)
        {
            if (dbMgr != null && dbMgr is DirectDBManager)
                m_dbManager = (DirectDBManager)dbMgr;
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

        public bool BeginBatch()
        {
            return m_dbManager.BeginBatch();
        }

        public bool BatchCommit()
        {
            return m_dbManager.BatchCommit();
        }

        public bool BatchRollback()
        {
            return m_dbManager.BatchRollback();
        }

        public IDataManager Clone()
        {
            DataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, m_dbManager.DbHost, m_dbManager.DbName, m_dbManager.DbID, m_dbManager.DbPw, SiteID);
            return dataManager;
        }
    }
}
