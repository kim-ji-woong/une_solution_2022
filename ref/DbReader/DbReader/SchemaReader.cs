using System.Configuration;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace DbReader
{
    abstract class SchemaReader
    {
        protected DataManager m_dataManager = null;

        public SchemaReader(DataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public static string GetSysDbName()
        {
            string strDbType = ConfigurationManager.AppSettings.Get("dbType");

            if (strDbType != null && strDbType.Length > 0)
            {
                int dbType = 0;
                int.TryParse(strDbType.Trim(), out dbType);

                if (dbType == (int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver)
                    return "master";
                else if (dbType == (int)dnsDapperDBUtil.Manager.WebDBManager.DBType.mysql)
                    return "sys";
            }

            return "";
        }

        public abstract List<string> ReadDbNames(out string strErrorMessage);
        public abstract List<DBTable> ReadTables(out string strErrorMessage);
    }
}
