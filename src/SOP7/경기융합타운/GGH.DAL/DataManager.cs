using System.Collections;
using System.Collections.Generic;

namespace GGH.DAL
{
    using IDAL;
    using dnsDBUtil;

    public class DataManager : IDataManager
    {
        private DirectDBManager m_dbManager = null;
        
        private SelectManager m_selectManager = null;
        private CreateManager m_createManager = null;
        private UpdateManager m_updateManager = null;
        private DeleteManager m_deleteManager = null;


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

            if (m_createManager == null)
            {
                m_createManager = new CreateManager(this);
            }

            if (m_updateManager == null)
            {
                m_updateManager = new UpdateManager(this);
            }

            if (m_deleteManager == null)
            {
                m_deleteManager = new DeleteManager(this);
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

        public void SetDBConnection()
        {
            if (m_dbManager == null)
            {
                m_dbManager = new TransactionDBManager();
            }
        }

        public void SetDBConnection(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            if (m_dbManager == null)
            {
                m_dbManager = new TransactionDBManager(nDbType, strDbHost, strDbName, strDbID, strDbPw);
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

        public IDataManager Clone(string strDbHost, string strDbName, string strDbID, string strDbPw, int siteID)
        {
            DataManager dataManager = new DataManager((int)m_dbManager.DatabaseType, strDbHost, strDbName, strDbID, strDbPw, siteID);
            return dataManager;
        }
    }

    internal class TransactionDBManager : DirectDBManager
    {
        public TransactionDBManager()
            : base()
        {
        }

        public TransactionDBManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
            : base(nDbType, strDbHost, strDbName, strDbID, strDbPw)
        {
        }

        public override ArrayList GetResultData(string strSQL, string strDBName = null)
        {
            if (IsBeginBatch)
                return GetBatchData(strSQL);

            return base.GetResultData(strSQL, strDBName);
        }

        public override ArrayList GetResultData(string strSQL, int nLimit, string strDBName = null)
        {
            if (IsBeginBatch)
                return GetBatchData(strSQL, nLimit);

            return base.GetResultData(strSQL, nLimit, strDBName);
        }

        public override ArrayList GetStoredProcedureResult(string strProcedureName, List<string> fieldNames, List<string> fieldValues, string strDBName = null)
        {
            if (IsBeginBatch)
                return GetBatchStoredProcedureResult(strProcedureName, fieldNames, fieldValues);

            return base.GetStoredProcedureResult(strProcedureName, fieldNames, fieldValues, strDBName);
        }
    }
}
