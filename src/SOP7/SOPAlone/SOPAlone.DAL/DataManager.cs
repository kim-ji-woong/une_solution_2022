using dnsDBUtil;
using SOPAlone.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.DAL
{
    public class DataManager : IDataManager
    {
        private DirectDBManager m_dbManager = null;

        private SelectManager m_selectManager = null;
        private CreateManager m_createManager = null;
        private UpdateManager m_updateManager = null;
        private int m_nSiteID = -1;

        public DataManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw, int nSiteID)
        {
            m_nSiteID = nSiteID;
            SetDBConnection(nDbType, strDbHost, strDbName, strDbID, strDbPw);

            m_selectManager = new SelectManager(this);
            m_createManager = new CreateManager(this);
            m_updateManager = new UpdateManager(this);
        }

        public ISelect GetSelectManager()
        {
            if (m_selectManager != null)
                return m_selectManager;

            return null;
        }
        public ICreate GetCreateManager()
        {
            if (m_createManager != null)
                return m_createManager;

            return null;
        }
        public IUpdate GetUpdateManager()
        {
            if (m_updateManager != null)
                return m_updateManager;

            return null;
        }

        public object GetDBManager()
        {
            if (m_dbManager != null)
                return m_dbManager;
            return null;
        }

        public void SetDBConnection(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            if (m_dbManager == null)
                m_dbManager = new DirectDBManager(nDbType, strDbHost, strDbName, strDbID, strDbPw);
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
            DataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, m_dbManager.DbHost, m_dbManager.DbName, m_dbManager.DbID, m_dbManager.DbPw, m_nSiteID);
            return dataManager;
        }
    }
}
