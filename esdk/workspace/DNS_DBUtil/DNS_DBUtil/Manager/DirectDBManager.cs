using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

namespace dnsDBUtil
{
    using Manager.DirectDB;

    public class DirectDBManager
    {
        //private double m_dTransactionTimeoutSeconds = 5.0;
        private DBManager m_transactionOwner = null;
        public enum DBType { sqlserver = 0, mysql, oracle, postgre, TypeCount };

        private const string NOT_CONNECTED_EXCEPTION = "DB 접속이 끊어졌습니다.\r\n서버 관리자에게 문의하세요.";

        private DBType m_dbType = DBType.sqlserver;
        private string m_strDbHost = string.Empty;
        private string m_strDbName = string.Empty;
        private string m_strDbID = string.Empty;
        private string m_strDbPw = string.Empty;

        private string m_strLastErrorMsg = string.Empty;

        private bool m_isBeginBatch = false;
        private string m_strBatchDB = string.Empty;

        public string DatabaseTypeName
        {
            get { return m_dbType.ToString(); }
            set
            {
                if (string.Compare(value, "mysql", true) == 0)
                {
                    m_dbType = DBType.mysql;
                }
                else if (string.Compare(value, "sqlserver", true) == 0)
                {
                    m_dbType = DBType.sqlserver;
                }
                else if (string.Compare(value, "oracle", true) == 0)
                {
                    m_dbType = DBType.sqlserver;
                }
                else if (string.Compare(value, "postgre", true) == 0)
                {
                    m_dbType = DBType.postgre;
                }
            }
        }
        public DBType DatabaseType { get { return m_dbType; } set { m_dbType = value; } }
        public string DbHost { get { return m_strDbHost; } set { m_strDbHost = value; } }
        public string DbName { get { return m_strDbName; } set { m_strDbName = value; } }
        public string DbID { get { return m_strDbID; } set { m_strDbID = value; } }
        public string DbPw { get { return m_strDbPw; } set { m_strDbPw = value; } }
        public string LastErrorMessage { get { return m_strLastErrorMsg; } }

        protected bool IsBeginBatch { get { return m_isBeginBatch; } }

        public DirectDBManager()
        {
        }

        public DirectDBManager(int nDbType, string strDbHost, string strDbName, string strDbID, string strDbPw)
        {
            m_dbType = (DBType)nDbType;
            m_strDbHost = strDbHost;
            m_strDbName = strDbName;
            m_strDbID = strDbID;
            m_strDbPw = strDbPw;

            DBManager.Host = m_strDbHost;
            DBManager.ID = m_strDbID;
            DBManager.PW = m_strDbPw;
        }

        public DirectDBManager Clone()
        {
            DirectDBManager dbMgr = new DirectDBManager();
            dbMgr.m_dbType = m_dbType;
            dbMgr.m_strDbHost = m_strDbHost;
            dbMgr.m_strDbName = m_strDbName;
            dbMgr.m_strDbID = m_strDbID;
            dbMgr.m_strDbPw = m_strDbPw;

            return dbMgr;
        }

        private void CheckLimit(ref string strSQL, int nLimit)
        {
            if (nLimit > 0)
            {
                if (m_dbType == DBType.mysql)
                {
                    strSQL += " LIMIT 0," + nLimit;
                }
                else if (m_dbType == DBType.sqlserver)
                {
                    int nIdx = strSQL.ToLower().IndexOf("select");
                    if (nIdx >= 0)
                    {
                        strSQL = strSQL.Insert(6, " TOP " + nLimit + " ");
                    }
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="strSQL">실행할 쿼리</param>
        /// <param name="nTranstion">1인경우 트랜잭션, 0이면 단일쿼리</param>
        /// <param name="nLimit">최대 행 개수</param>
        /// <param name="strDBName">사용할 Database이름</param>
        /// <returns></returns>
        public virtual ArrayList GetResultData(string strSQL, int nLimit, string strDBName = null)
        {
            CheckLimit(ref strSQL, nLimit);
            return GetResultData(strSQL, strDBName);
        }

        public virtual ArrayList GetResultData(string strSQL, string strDBName = null)
        {
            if (this.DatabaseType == DBType.mysql)
            {
                ChangeQuery(ref strSQL, "isnull", "ifnull");
                strSQL = strSQL.Replace("\\", "\\\\");
            }
            else if (this.DatabaseType == DBType.sqlserver)
            {
                ChangeQuery(ref strSQL, "ifnull", "isnull");
            }

            if (strDBName == null)
                strDBName = m_strDbName;

            return GetReadDB(strSQL, strDBName);
        }

        public virtual ArrayList GetStoredProcedureResult(string strProcedureName, List<string> fieldNames, List<string> fieldValues, string strDBName = null)
        {
            if (strDBName == null)
                strDBName = m_strDbName;

            return GetReadProcedure(strProcedureName, fieldNames, fieldValues, strDBName);
        }

        private void ChangeQuery(ref string strSQL, string strSrc, string strTrg)
        {
            int nIndex = strSQL.ToLower().IndexOf(strSrc);

            if (nIndex >= 0)
            {
                string str = strSQL.Substring(nIndex, strSrc.Length);
                strSQL = strSQL.Replace(str, strTrg);
            }
        }

        private ArrayList GetReadDB(string strSQL, string strDBName)
        {
            try
            {
                string[] results = RunQuery(strDBName, m_dbType.ToString(), strSQL);
                if (results == null)
                {
                    m_strLastErrorMsg = "WebDB 접속에 실패하였습니다.\r\n네트웍 상황을 확인하세요.";
                    return null;
                }
                else if (results[0] != "1")
                {
                    m_strLastErrorMsg = results[1];
                    return null;
                }

                int nDataCount;

                if (int.TryParse(results[1], out nDataCount) == false)
                {
                    m_strLastErrorMsg = "알수없는 오류입니다.";
                    return null;
                }

                ArrayList arrResults = new ArrayList();

                for (int i = 0; i < nDataCount; i++)
                {
                    arrResults.Add(results[i + 2]);
                }

                return arrResults;
            }
            catch (Exception e)
            {
                m_isBeginBatch = false;
                m_strLastErrorMsg = e.Message;
            }

            return null;
        }

        /// <summary>
        /// Query를 실행시키고 그 결과를 확인한다.
        /// </summary>
        /// <param name="dbName"></param>
        /// <param name="dbType">대소문자는 상관없다. mysql, sqlserver 가운데 선택한다.</param>
        /// <param name="query"></param>
        /// <returns>배열의 첫번째 요소 : 쿼리의 성공 여부("1"이면 성공, "0"이면 실패)
        ///          배열의 두번째 요소 : 성공했을 경우(결과값의 개수), 실패했을 경우(에러 메시지)
        ///          결과값 : null인 값은 '~'으로 시작, null이 아닌값은 '!'으로 시작
        /// </returns>
        public string[] RunQuery(string dbName, string dbType, string query)
        {
            if (dbName == null || dbName.Length == 0)
                return DBException.ErrorMessage("[RunQuery] DB 이름을 알수 없습니다.");
            else if (dbType == null || dbType.Length == 0)
                return DBException.ErrorMessage("[RunQuery] DB Type을 알수 없습니다.");
            else if (query == null || query.Length == 0)
                return DBException.ErrorMessage("[RunQuery] 실행하여야 할 쿼리가 존재하지 않습니다.");

            if (string.Compare(dbType, "mysql", true) == 0)
                return MySQLManager.RunQuery(dbName, query, null, m_strDbHost, m_strDbID, m_strDbPw);
            else if (string.Compare(dbType, "sqlserver", true) == 0)
                return SqlServerManager.RunQuery(dbName, query, null, m_strDbHost, m_strDbID, m_strDbPw);
            else if (string.Compare(dbType, "oracle", true) == 0)
                return OracleManager.RunQuery(dbName, query, null, m_strDbHost, m_strDbID, m_strDbPw);
            else if (string.Compare(dbType, "postgre", true) == 0)
                return PostgreSQLManager.RunQuery(dbName, query, null, m_strDbHost, m_strDbID, m_strDbPw);

            return DBException.ErrorMessage("[RunQuery] " + dbType + "은 알수 없는 DB Type입니다.");
        }

        public static void AddStoredProcedureValue(List<string> values, object value)
        {
            if (value == null)
                values.Add(null);
            else if (value is int ||
                value is long)
                values.Add("i" + value.ToString());
            else if (value is bool)
            {
                if ((bool)value)
                    values.Add("i1");
                else
                    values.Add("i0");
            }
            else if (value is float ||
                value is double)
                values.Add("f" + value.ToString());
            else if (value is string)
                values.Add("s" + value.ToString());
        }

        private ArrayList GetReadProcedure(string strProcedureName, List<string> fieldNames, List<string> fieldValues, string strDBName)
        {
            try
            {
                string[] results = RunStoredProcedure(strDBName, DatabaseTypeName, strProcedureName, fieldNames, fieldValues);

                if (results == null)
                {
                    m_strLastErrorMsg = "WebDB 접속에 실패하였습니다.\r\n네트웍 상황을 확인하세요.";
                    return null;
                }
                else if (results[0] != "1")
                {
                    m_strLastErrorMsg = results[1];
                    return null;
                }

                int nDataCount;

                if (int.TryParse(results[1], out nDataCount) == false)
                {
                    m_strLastErrorMsg = "알수없는 오류입니다.";
                    return null;
                }

                ArrayList arrResults = new ArrayList();

                for (int i = 0; i < nDataCount; i++)
                {
                    arrResults.Add(results[i + 2]);
                }

                return arrResults;
            }
            catch (Exception e)
            {
                m_isBeginBatch = false;
                m_strLastErrorMsg = e.Message;
            }

            return null;
        }

        public string[] RunStoredProcedure(string dbName, string dbType, string procedureName, List<string> fieldNames, List<string> fieldValues)
        {
            if (dbName == null || dbName.Length == 0)
                return DBException.ErrorMessage("[RunStoredProcedure] DB 이름을 알수 없습니다.");
            else if (dbType == null || dbType.Length == 0)
                return DBException.ErrorMessage("[RunStoredProcedure] DB Type을 알수 없습니다.");
            else if (procedureName == null || procedureName.Length == 0)
                return DBException.ErrorMessage("[RunStoredProcedure] 실행하여야 할 프로시저 이름이 존재하지 않습니다.");

            if (string.Compare(dbType, "mysql", true) == 0)
                return MySQLManager.RunStoredProcedure(dbName, procedureName, fieldNames, fieldValues, null, m_strDbHost, m_strDbID, m_strDbPw);
            else if (string.Compare(dbType, "sqlserver", true) == 0)
                return SqlServerManager.RunStoredProcedure(dbName, procedureName, fieldNames, fieldValues, null, m_strDbHost, m_strDbID, m_strDbPw);
            else if (string.Compare(dbType, "oracle", true) == 0)
                return OracleManager.RunStoredProcedure(dbName, procedureName, fieldNames, fieldValues, null, m_strDbHost, m_strDbID, m_strDbPw);
            else if (string.Compare(dbType, "postgre", true) == 0)
                return PostgreSQLManager.RunStoredProcedure(dbName, procedureName, fieldNames, fieldValues, null, m_strDbHost, m_strDbID, m_strDbPw);

            return DBException.ErrorMessage("[RunStoredProcedure] " + dbType + "은 알수 없는 DB Type입니다.");
        }

        public virtual bool BeginBatch(string strDBName = null)
        {
            if (m_isBeginBatch == true)
                throw new WebDBTransactionStateException("이전 트랜잭션이 종료되지 않았습니다.\nRollback이나 Commit이후에 호출 가능합니다.");

            strDBName = (strDBName == null ? m_strDbName : strDBName);
            m_strBatchDB = strDBName;

            try
            {
                string strErrorMessage = null;

                string[] results = new string[2];
                strErrorMessage = "";

                if (strDBName == null || strDBName.Length == 0)
                {
                    strErrorMessage = DBException.ErrorMessage2("[BeginBatch] DB 이름을 알수 없습니다.");
                    return false;
                }
                else if (m_dbType.ToString() == null || m_dbType.ToString().Length == 0)
                {
                    strErrorMessage = DBException.ErrorMessage2("[BeginBatch] DB Type을 알수 없습니다.");
                    return false;
                }

                if (m_isBeginBatch || m_transactionOwner != null)
                {
                    strErrorMessage = DBException.ErrorMessage2("[BeginBatch] Transaction이 이미 시작되어 있습니다.");
                    return false;
                }

                DBManager transactionOwner = null;
                string strResult = "";

                if (string.Compare(m_dbType.ToString(), "mysql", true) == 0)
                    transactionOwner = MySQLManager.BeginTransaction(strDBName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
                else if (string.Compare(m_dbType.ToString(), "sqlserver", true) == 0)
                    transactionOwner = SqlServerManager.BeginTransaction(strDBName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
                else if (string.Compare(m_dbType.ToString(), "oracle", true) == 0)
                    transactionOwner = OracleManager.BeginTransaction(strDBName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
                else if (string.Compare(m_dbType.ToString(), "postgre", true) == 0)
                    transactionOwner = PostgreSQLManager.BeginTransaction(strDBName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
                else
                {
                    strErrorMessage = DBException.ErrorMessage2("[BeginBatch] " + m_dbType.ToString() + "은 알수 없는 DB Type입니다.");
                    return false;
                }

                if (transactionOwner != null)
                {
                    m_isBeginBatch = true;
                    m_transactionOwner = transactionOwner;
                    m_isBeginBatch = true;
                }

                //if (!BeginBatch(strDBName, m_dbType.ToString(), out strErrorMessage))
                //{
                //    if (strErrorMessage == null)
                //    {
                //        m_strLastErrorMsg = "알수없는 오류입니다.";
                //        return false;
                //    }
                //    else
                //    {
                //        m_strLastErrorMsg = strErrorMessage;
                //        return false;
                //    }
                //}
            }
            catch (Exception e)
            {
                m_isBeginBatch = false;
                m_strLastErrorMsg = e.Message;
                return false;
            }

            return true;
        }

        public virtual bool BatchCommit()
        {
            if (m_isBeginBatch == false)
                throw new WebDBTransactionStateException("트랜잭션이 시작되지 않았습니다.\nCommit은 BeginBatch이후에 호출 가능합니다.");

            try
            {
                string result = m_transactionOwner.BatchCommit();
                m_isBeginBatch = false;

                if (result == null)
                {
                    m_strLastErrorMsg = "알수없는 오류입니다.";
                    return false;
                }
                else if (result.Length > 0)
                {
                    m_strLastErrorMsg = result;
                    return false;
                }
            }
            catch (Exception e)
            {
                m_isBeginBatch = false;
                m_strLastErrorMsg = e.Message;
                return false;
            }

            return true;
        }

        public virtual bool BatchRollback()
        {
            if (m_isBeginBatch == false)
                throw new WebDBTransactionStateException("트랜잭션이 시작되지 않았습니다.\nRollback은 BeginBatch이후에 호출 가능합니다.");

            try
            {
                string result = m_transactionOwner.BatchRollback();
                m_isBeginBatch = false;

                if (result == null)
                {
                    m_strLastErrorMsg = "알수없는 오류입니다.";
                    return false;
                }
                else if (result.Length > 0)
                {
                    m_strLastErrorMsg = result;
                    return false;
                }
            }
            catch (Exception e)
            {
                m_isBeginBatch = false;
                m_strLastErrorMsg = e.Message;
            }

            return true;
        }

        /// <summary>
        /// Transaction 시작을 알린다.
        /// </summary>
        /// <param name="dbName"></param>
        /// <param name="dbType">대소문자는 상관없다. mysql, sqlserver 가운데 선택한다.</param>
        /// <param name="errorMessage">Transaction 시작이 성공하면 빈 문자열의 값을 갖는다.
        ///                            실패하면 에러 메시지를 갖는다.
        /// </param>
        /// <returns>Transaction 시작이 성공하면 TransactionKey를 리턴하며, 0보다 큰 값을 가진다.
        ///          이 Key는 BatchCommit이나 BatchRollback, BatchQuery를 호출할때 사용된다.
        ///          실패하면 0을 리턴한다.
        /// </returns>
        public bool BeginBatch(string dbName, string dbType, out string strErrorMessage)
        {
            string[] results = new string[2];
            strErrorMessage = "";

            if (dbName == null || dbName.Length == 0)
            {
                strErrorMessage = DBException.ErrorMessage2("[BeginBatch] DB 이름을 알수 없습니다.");
                return false;
            }
            else if (dbType == null || dbType.Length == 0)
            {
                strErrorMessage = DBException.ErrorMessage2("[BeginBatch] DB Type을 알수 없습니다.");
                return false;
            }

            if (m_isBeginBatch || m_transactionOwner != null)
            {
                strErrorMessage = DBException.ErrorMessage2("[BeginBatch] Transaction이 이미 시작되어 있습니다.");
                return false;
            }

            DBManager transactionOwner = null;
            string strResult = "";

            if (string.Compare(dbType, "mysql", true) == 0)
                transactionOwner = MySQLManager.BeginTransaction(dbName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
            else if (string.Compare(dbType, "sqlserver", true) == 0)
                transactionOwner = SqlServerManager.BeginTransaction(dbName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
            else if (string.Compare(dbType, "oracle", true) == 0)
                transactionOwner = OracleManager.BeginTransaction(dbName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
            else if (string.Compare(dbType, "postgre", true) == 0)
                transactionOwner = PostgreSQLManager.BeginTransaction(dbName, m_strDbHost, m_strDbID, m_strDbPw, out strResult);
            else
            {
                strErrorMessage = DBException.ErrorMessage2("[BeginBatch] " + dbType + "은 알수 없는 DB Type입니다.");
                return false;
            }

            if (transactionOwner != null)
            {
                m_transactionOwner = transactionOwner;
                m_isBeginBatch = true;
            }

            return true;
        }

        public virtual ArrayList GetBatchStoredProcedureResult(string strProcedureName, List<string> fieldNames, List<string> fieldValues)
        {
            if (m_isBeginBatch == false)
                throw new WebDBTransactionStateException("트랜잭션이 시작되지 않았습니다.");

            return GetBatchProcedure(strProcedureName, fieldNames, fieldValues);
        }

        private ArrayList GetBatchProcedure(string strProcedureName, List<string> fieldNames, List<string> fieldValues)
        {
            try
            {
                string[] results = BatchStoredProcedure(strProcedureName, fieldNames, fieldValues);
                if (results == null)
                {
                    m_strLastErrorMsg = "WebDB 접속에 실패하였습니다.\r\n네트웍 상황을 확인하세요.";
                    return null;
                }
                else if (results[0] != "1")
                {
                    m_strLastErrorMsg = results[1];
                    return null;
                }

                int nDataCount;

                if (int.TryParse(results[1], out nDataCount) == false)
                {
                    m_strLastErrorMsg = "알수없는 오류입니다.";
                    return null;
                }

                ArrayList arrResults = new ArrayList();

                for (int i = 0; i < nDataCount; i++)
                {
                    arrResults.Add(results[i + 2]);
                }

                return arrResults;
            }
            catch (Exception e)
            {
                m_isBeginBatch = false;
                m_strLastErrorMsg = e.Message;
            }

            return null;
        }

        /// <summary>
        /// StoredProcedure를 실행시키고 그 결과를 확인한다.
        /// </summary>
        /// <param name="procedureName"></param>
        /// <param name="fieldNames"></param>
        /// <Param name="fieldValues"></Param>
        /// <param name="transactionKey"></param>
        /// <returns>배열의 첫번째 요소 : 쿼리의 성공 여부("1"이면 성공, "0"이면 실패)
        ///          배열의 두번째 요소 : 성공했을 경우(결과값의 개수), 실패했을 경우(에러 메시지)
        ///          결과값 : null인 값은 '~'으로 시작, null이 아닌값은 '!'으로 시작
        /// </returns>
        public string[] BatchStoredProcedure(string procedureName, List<string> fieldNames, List<string> fieldValues)
        {
            if (procedureName == null || procedureName.Length == 0)
                return DBException.ErrorMessage("[BatchStoredProcedure] 실행하여야 할 프로시저 이름이 존재하지 않습니다.");

            if (!m_isBeginBatch || m_transactionOwner == null)
                return DBException.ErrorMessage("[BatchStoredProcedure] Transaction이 시작되지 않았습니다. ");

            if (m_transactionOwner is MySQLManager)
                return MySQLManager.RunStoredProcedure(null, procedureName, fieldNames, fieldValues, (MySQLManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);
            else if (m_transactionOwner is SqlServerManager)
                return SqlServerManager.RunStoredProcedure(null, procedureName, fieldNames, fieldValues, (SqlServerManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);
            else if (m_transactionOwner is OracleManager)
                return OracleManager.RunStoredProcedure(null, procedureName, fieldNames, fieldValues, (OracleManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);
            else if (m_transactionOwner is PostgreSQLManager)
                return PostgreSQLManager.RunStoredProcedure(null, procedureName, fieldNames, fieldValues, (PostgreSQLManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);

            return DBException.ErrorMessage("[BatchStoredProcedure] 알수 없는 DB 오류입니다.");
        }

        public virtual ArrayList GetBatchData(string strSQL)
        {
            if (m_isBeginBatch == false || m_transactionOwner == null)
            {
                throw new WebDBTransactionStateException("트랜잭션이 시작되지 않았습니다.");
            }

            if (this.DatabaseType == DBType.mysql)
            {
                ChangeQuery(ref strSQL, "isnull", "ifnull");
                //strSQL = strSQL.Replace("ISNULL", "IFNULL");
                //strSQL = strSQL.Replace("isnull", "ifnull");
                strSQL = strSQL.Replace("\\", "\\\\");
            }
            else if (this.DatabaseType == DBType.sqlserver)
            {
                ChangeQuery(ref strSQL, "ifnull", "isnull");
                //strSQL = strSQL.Replace("IFNULL", "ISNULL");
            }

            return GetBatchDB(strSQL);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="strSQL">실행할 쿼리</param>
        /// <param name="nLimit">최대 행 개수</param>
        /// <returns></returns>
        public virtual ArrayList GetBatchData(string strSQL, int nLimit)
        {
            CheckLimit(ref strSQL, nLimit);
            return GetBatchData(strSQL);
        }

        private ArrayList GetBatchDB(string strSQL)
        {
            try
            {
                string[] results = BatchQuery(strSQL);
                if (results == null)
                {
                    m_strLastErrorMsg = "WebDB 접속에 실패하였습니다.\r\n네트웍 상황을 확인하세요.";
                    return null;
                }
                else if (results[0] != "1")
                {
                    m_strLastErrorMsg = results[1];
                    return null;
                }

                int nDataCount;

                if (int.TryParse(results[1], out nDataCount) == false)
                {
                    m_strLastErrorMsg = "알수없는 오류입니다.";
                    return null;
                }

                ArrayList arrResults = new ArrayList();

                for (int i = 0; i < nDataCount; i++)
                {
                    arrResults.Add(results[i + 2]);
                }

                return arrResults;
            }
            catch (Exception e)
            {
                //m_isBeginBatch가 false이면 rollback 할수가 없다.
                //m_isBeginBatch = false;
                m_strLastErrorMsg = e.Message;
            }

            return null;
        }
        /// <summary>
        /// Transaction을 사용하여 Query를 실행시키고 그 결과를 확인한다.
        /// </summary>
        /// <param name="query"></param>
        /// <param name="transactionKey"></param>
        /// <returns>배열의 첫번째 요소 : 쿼리의 성공 여부("1"이면 성공, "0"이면 실패)
        ///          배열의 두번째 요소 : 성공했을 경우(결과값의 개수), 실패했을 경우(에러 메시지)
        ///          결과값 : null인 값은 '~'으로 시작, null이 아닌값은 '!'으로 시작
        /// </returns>
        public string[] BatchQuery(string query)
        {
            if (query == null || query.Length == 0)
                return DBException.ErrorMessage("[BatchQuery] 실행하여야 할 쿼리가 존재하지 않습니다.");

            if (!m_isBeginBatch || m_transactionOwner == null)
                return DBException.ErrorMessage("[BatchQuery] Transaction이 시작되지 않았습니다. ");

            if (m_transactionOwner is MySQLManager)
                return MySQLManager.RunQuery(null, query, (MySQLManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);
            else if (m_transactionOwner is SqlServerManager)
                return SqlServerManager.RunQuery(null, query, (SqlServerManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);
            else if (m_transactionOwner is OracleManager)
                return OracleManager.RunQuery(null, query, (OracleManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);
            else if (m_transactionOwner is PostgreSQLManager)
                return PostgreSQLManager.RunQuery(null, query, (PostgreSQLManager)m_transactionOwner, m_strDbHost, m_strDbID, m_strDbPw);

            return DBException.ErrorMessage("[BatchQuery] 알수 없는 DB 오류입니다.");
        }

        static public byte GetByteField(string dataSrc, byte bDefault)
        {
            byte result = bDefault;

            if (dataSrc == null || dataSrc.StartsWith("!") == false)
            {
                return result;
            }

            byte num;

            if (byte.TryParse(dataSrc.Substring(1), out num))
                return num;

            return result;
        }
        static public VariousData<byte> GetByteField(string dataSrc)
        {
            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return null;

            byte num;

            if (byte.TryParse(dataSrc.Substring(1), out num))
                return new VariousData<byte>(num);

            return null;
        }
        static public int GetIntField(string dataSrc, int nDefault)
        {
            int result = nDefault;

            if (dataSrc == null || dataSrc.StartsWith("!") == false)
            {
                return result;
            }

            string strValue = dataSrc.Substring(1);

            if (string.Compare(strValue, "true", true) == 0)
                return 1;
            else if (string.Compare(strValue, "false", true) == 0)
                return 0;

            int num;

            if (int.TryParse(strValue, out num))
                return num;

            return nDefault;
        }
        static public VariousData<int> GetIntField(string dataSrc)
        {
            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return null;

            string strValue = dataSrc.Substring(1);

            if (string.Compare(strValue, "true", true) == 0)
                return new VariousData<int>(1);
            else if (string.Compare(strValue, "false", true) == 0)
                return new VariousData<int>(0);

            int num;

            if (int.TryParse(strValue, out num))
                return new VariousData<int>(num);

            return null;
        }
        static public long GetLongField(string dataSrc, int nDefault)
        {
            int result = nDefault;

            if (dataSrc == null || dataSrc.StartsWith("!") == false)
            {
                return result;
            }

            string strValue = dataSrc.Substring(1);

            if (string.Compare(strValue, "true", true) == 0)
                return 1;
            else if (string.Compare(strValue, "false", true) == 0)
                return 0;

            long num;

            if (long.TryParse(strValue, out num))
                return num;

            return nDefault;
        }
        static public VariousData<long> GetLongField(string dataSrc)
        {
            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return null;

            string strValue = dataSrc.Substring(1);

            if (string.Compare(strValue, "true", true) == 0)
                return new VariousData<long>(1);
            else if (string.Compare(strValue, "false", true) == 0)
                return new VariousData<long>(0);

            long num;

            if (long.TryParse(strValue, out num))
                return new VariousData<long>(num);

            return null;
        }
        static public float GetFloatField(string dataSrc, float fDefault)
        {
            float result = fDefault;

            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return result;

            float num;

            if (float.TryParse(dataSrc.Substring(1), out num))
                return num;

            return result;
        }
        static public VariousData<float> GetFloatField(string dataSrc)
        {
            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return null;

            float num;

            if (float.TryParse(dataSrc.Substring(1), out num))
                return new VariousData<float>(num);

            return null;
        }
        static public double GetDoubleField(string dataSrc, float fDefault)
        {
            double result = fDefault;

            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return result;

            double num;

            if (double.TryParse(dataSrc.Substring(1), out num))
                return num;

            return result;
        }
        static public VariousData<double> GetDoubleField(string dataSrc)
        {
            if (dataSrc == null || dataSrc.StartsWith("!") == false)
                return null;

            double num;

            if (double.TryParse(dataSrc.Substring(1), out num))
                return new VariousData<double>(num);

            return null;
        }
        static public DateTime GetDateTimeField(object dataSrc, DateTime dtDefault)
        {
            DateTime result = dtDefault;

            if (dataSrc == null)
                return result;

            string strValue = dataSrc.ToString();

            if (strValue.StartsWith("!") == false)
                return result;

            strValue = strValue.Substring(1);

            try
            {
                DateTime time = Convert.ToDateTime(strValue);
                return time;
            }
            catch (Exception)
            {
            }

            return result;
        }
        static public VariousData<DateTime> GetDateTimeField(object dataSrc)
        {
            if (dataSrc == null)
                return null;

            string strValue = dataSrc.ToString();

            if (strValue.StartsWith("!") == false)
                return null;

            strValue = strValue.Substring(1);

            try
            {
                DateTime time = Convert.ToDateTime(strValue);
                return new VariousData<DateTime>(time);
            }
            catch (Exception)
            {
            }

            return null;
        }
        /// <summary>
        /// 문자열 앞뒤의 빈문자들을 제거한다.
        /// </summary>
        /// <param name="dataSrc"></param>
        /// <param name="strDefault"></param>
        /// <returns></returns>
        static public string GetStringField(object dataSrc, string strDefault)
        {
            if (dataSrc == null)
                return strDefault;

            string strValue = dataSrc.ToString();

            if (strValue.StartsWith("!") == false)
                return strDefault;

            strValue = strValue.TrimStart(new char[] { ' ', '\t', '\r', '\n' });
            strValue = strValue.TrimEnd(new char[] { ' ', '\t', '\r', '\n' });

            // (char)5, 6, 7, 8은 DB 입력시 '\t', '\n', '\r', '\''이 임시로 바뀌어 들어간 값이므로, 다시 '\n'으로 되돌려 준다.

            strValue = strValue.Replace((char)6, '\n');
            strValue = strValue.Replace((char)7, '\r');
            strValue = strValue.Replace((char)8, '\'');

            strValue = strValue.Substring(1).Trim();
            return strValue;
        }
        /// <summary>
        /// 문자열 앞뒤의 빈문자들을 제거한다.
        /// </summary>
        /// <param name="dataSrc"></param>
        /// <returns></returns>
        static public string GetStringField(object dataSrc)
        {
            if (dataSrc == null)
                return null;

            string strValue = dataSrc.ToString();

            if (strValue.StartsWith("!") == false)
                return null;

            strValue = (string)dataSrc;
            strValue = strValue.TrimStart(new char[] { ' ', '\t', '\r', '\n' });
            strValue = strValue.TrimEnd(new char[] { ' ', '\t', '\r', '\n' });

            // (char)5, 6, 7, 8은 DB 입력시 '\t', '\n', '\r', '\''이 임시로 바뀌어 들어간 값이므로, 다시 '\n'으로 되돌려 준다.

            strValue = strValue.Replace((char)6, '\n');
            strValue = strValue.Replace((char)7, '\r');
            strValue = strValue.Replace((char)8, '\'');

            strValue = strValue.Substring(1).Trim();
            return strValue;
        }
        public static string MakeDateTimeString(DateTime time)
        {
            return string.Format("{0} {1:00}:{2:00}:{3:00}", time.ToShortDateString(), time.Hour, time.Minute, time.Second);
        }

        /// <summary>
        /// Model Class의 멤버에 value를 순서대로 넣어준다.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="model"> Model Class </param>
        /// <param name="info"> Model Class의 Field Info </param>
        /// <param name="value"> 세팅할 값들 </param>
        /// <returns> Model Class Type의 객체 </returns>
        public T GetObjectWithParams<T>(T model, PropertyInfo[] info, string[] columnInfo, params object[] value)
        {
            if (columnInfo.Length == value.Length)
            {
                for (int i = 0; i < info.Length; i++)
                {
                    if (columnInfo.Contains(info[i].Name, StringComparer.OrdinalIgnoreCase))
                    {
                        int idx = columnInfo.ToList().FindIndex(x => x.Equals(info[i].Name, StringComparison.OrdinalIgnoreCase));

                        if (info[i].CanWrite)
                        {
                            info[i].SetValue(model, value[idx]);
                        }
                        else
                        {
                            // Property 중 Setter가 없는 경우
                            continue;
                        }
                    }
                    else
                    {
                        var modelType = model.GetType();
                        var modelValue = modelType.GetProperty(info[i].Name).GetValue(model);

                        if (info[i].CanWrite)
                        {
                            info[i].SetValue(model, modelValue);
                        }
                        else
                        {
                            // Property 중 Setter가 없는 경우
                            continue;
                        }
                    }
                }
            }

            return (T)Convert.ChangeType(model, typeof(T));
        }

        /// <summary>
        /// Update 시 필요한 Value에 대한 Query String을 받아온다.
        /// </summary>
        /// <param name="info"> 해당 테이블의 칼럼 목록과 자료형으로 구성된 Dictionary, GetColumnInfoDictionary 참조 </param>
        /// <param name="param"> Update할 값 (Model Class, 변수이름 - 값으로 구성된 Dictionary 지원) </param>
        /// <param name="properties"> Model Class 사용 시 필요한 Class Info </param>
        /// <returns> Value에 대한 Query String </returns>
        public string ConvertUpdateParamsToString(Dictionary<string, string> info, object param, PropertyInfo[] properties = null)
        {
            string updateString = null;

            var paramType = param.GetType();

            if (paramType.Name.Contains("Dictionary"))
            {
                Dictionary<string, object> temp = param as Dictionary<string, object>;

                for (int i = 0; i < temp.Count; i++)
                {
                    string columnName = "", columnType = "";
                    KeyValuePair<string, string> existColumn = new KeyValuePair<string, string>();
                    bool isExist = false;

                    existColumn = info.FirstOrDefault(x => string.Equals(x.Key, temp.ElementAt(i).Key, StringComparison.OrdinalIgnoreCase));

                    if (existColumn.Key != null && existColumn.Value != null)
                    {
                        columnName = existColumn.Key;
                        columnType = existColumn.Value;
                        isExist = true;
                    }

                    if (isExist)
                    {
                        var value = temp.ElementAt(i).Value;

                        if (value == null)
                        {
                            Convert.ChangeType(value, typeof(string));
                            value = "NULL";
                        }
                        else
                        {
                            if (!properties[i].PropertyType.FullName.Contains("List"))
                            {
                                if (properties[i].PropertyType.FullName.Contains("string") || properties[i].PropertyType.FullName.Contains("String") ||
                                properties[i].PropertyType.FullName.Contains("bool") || properties[i].PropertyType.FullName.Contains("Boolean"))
                                {
                                    Convert.ChangeType(value, typeof(string));
                                    value = value.ToString().Trim();
                                    value = string.Format("'{0}'", value);
                                }
                                else if (properties[i].PropertyType.FullName.Contains("datetime") || properties[i].PropertyType.FullName.Contains("DateTime"))
                                {
                                    DateTime timeTemp = (DateTime)value;
                                    string format = "yyyy-MM-dd HH:mm:ss";
                                    string timeStr = timeTemp.ToString(format);
                                    Convert.ChangeType(value, typeof(string));
                                    value = string.Format("'{0}'", timeStr);
                                }
                            }
                        }

                        updateString += string.Format("{0} = {1}, ", temp.ElementAt(i).Key, value);
                    }
                }
            }
            else
            {
                if (properties != null)
                {
                    for (int i = 0; i < properties.Length; i++)
                    {
                        string columnName = "", columnType = "";
                        KeyValuePair<string, string> existColumn = new KeyValuePair<string, string>();
                        bool isExist = false;

                        existColumn = info.FirstOrDefault(x => string.Equals(x.Key, properties[i].Name, StringComparison.OrdinalIgnoreCase));

                        if (existColumn.Key != null && existColumn.Value != null)
                        {
                            columnName = existColumn.Key;
                            columnType = existColumn.Value;
                            isExist = true;
                        }

                        if (isExist)
                        {
                            if (param.GetType().GetProperty(properties[i].Name) == null)
                            {
                                continue;
                            }

                            var value = param.GetType().GetProperty(properties[i].Name).GetValue(param);

                            if (value == null)
                            {
                                Convert.ChangeType(value, typeof(string));
                                value = "NULL";
                            }
                            else
                            {
                                if (!properties[i].PropertyType.FullName.Contains("List"))
                                {
                                    if (properties[i].PropertyType.FullName.Contains("string") || properties[i].PropertyType.FullName.Contains("String") ||
                                    properties[i].PropertyType.FullName.Contains("bool") || properties[i].PropertyType.FullName.Contains("Boolean"))
                                    {
                                        Convert.ChangeType(value, typeof(string));
                                        value = value.ToString().Trim();
                                        value = string.Format("'{0}'", value);
                                    }
                                    else if (properties[i].PropertyType.FullName.Contains("datetime") || properties[i].PropertyType.FullName.Contains("DateTime"))
                                    {
                                        DateTime timeTemp = (DateTime)value;
                                        string format = "yyyy-MM-dd HH:mm:ss";
                                        string timeStr = timeTemp.ToString(format);
                                        Convert.ChangeType(value, typeof(string));
                                        value = string.Format("'{0}'", timeStr);
                                    }
                                }
                            }

                            updateString += string.Format("{0} = {1}, ", properties[i].Name, value);
                        }
                    }
                }
            }

            if (updateString != null && updateString.EndsWith(", "))
            {
                updateString = updateString.Substring(0, updateString.Length - 2);
            }

            return updateString;
        }

        private int GetPropertyIndex(string strColumnName, PropertyInfo[] properties)
        {
            int index = 0;

            foreach (PropertyInfo prop in properties)
            {
                if (string.Compare(prop.Name, strColumnName, true) == 0)
                    return index;

                index++;
            }

            return -1;
        }

        /// <summary>
        /// Select 조건에 맞는 데이터를 Model Class의 Data에 맞게 세팅해주는 메소드
        /// </summary>
        /// <param name="info"> 해당 테이블의 칼럼 목록과 자료형으로 구성된 Dictionary, GetColumnInfoDictionary 참조 </param>
        /// <param name="model"> 참조할 Model Class </param>
        /// <param name="properties"> Model Class에 대한 멤버 정보 </param>
        /// <param name="data"> Select 결과 Data </param>
        /// <param name="notExistMember"> 해당 테이블에 존재하지 않는 칼럼 </param>        
        /// <returns> Model Class 형태의 List </returns>
        public List<object> SetParamsWithColumnInfo(Dictionary<string, string> info, object model, PropertyInfo[] properties, ArrayList data, out string[] notExistMember)
        {
            int loopCnt = 0;
            List<string> notExistTemp = new List<string>();

            if (data.Count % info.Count == 0)
            {
                loopCnt = data.Count / info.Count;
            }

            List<object> ret = new List<object>();
            object[] items = new object[loopCnt];
            Type modelType = model.GetType();

            for (int i = 0; i < loopCnt; i++)
            {
                items[i] = Activator.CreateInstance(modelType);
            }

            object _lock = new object(); // Lock Object

            Parallel.For(0, loopCnt, i =>
            {
                lock (_lock)
                {
                    for (int j = properties.Length * i; j < properties.Length * (i + 1); j++)
                    {

                        string columnName = "", columnType = "";
                        KeyValuePair<string, string> existColumn = new KeyValuePair<string, string>();
                        bool isExist = false;

                        existColumn = info.FirstOrDefault(x => string.Equals(x.Key, properties[j % properties.Length].Name, StringComparison.OrdinalIgnoreCase));

                        if (existColumn.Key != null && existColumn.Value != null)
                        {
                            columnName = existColumn.Key;
                            columnType = existColumn.Value;
                            isExist = true;
                        }

                        if (isExist) // Class Member가 조회한 Column 이름에 있을 경우
                        {
                            int idx = GetPropertyIndex(columnName, properties) + (i * info.Count);
                            //int idx = info.Keys.ToList().IndexOf(columnName) + (i * info.Count);

                            if (data[idx].ToString().StartsWith("!"))
                            {
                                data[idx] = data[idx].ToString().Substring(1);
                            }
                            else
                            {
                                data[idx] = null;
                            }

                            if (data[idx] != null) // 얻어온 Column 데이터가 Null이 아닐 경우
                            {

                                if (this.DatabaseType == DBType.mysql)
                                {
                                    // geometry, geometrycollection, linestring, multilinestring, multipoint, multipolygon, point, polygon
                                    // timestamp, enum, set 은 미포함
                                    // enum, set의 경우 해당 칼럼의 이름 + 0 (ex) col1 + 0으로 select 쿼리)으로 내부 값을 따로 조회하여 처리 해야 함
                                    switch (columnType)
                                    {
                                        case "tinyint":
                                            // True or False 문자가 들어가 있는 경우도 있음
                                            if (data[idx].ToString().Length == 1 || bool.TryParse(data[idx].ToString(), out bool boolCheck)) // Boolean
                                            {
                                                //var boolTemp = Convert.ToBoolean(Int32.Parse(data[idx].ToString()));
                                                //data[idx] = boolTemp;
                                                var boolTemp = false;
                                                if (bool.TryParse(data[idx].ToString(), out boolTemp) == false)
                                                    boolTemp = Convert.ToBoolean(Int32.Parse(data[idx].ToString()));
                                                data[idx] = boolTemp;
                                            }
                                            else
                                            {
                                                data[idx] = Convert.ChangeType(data[idx], typeof(sbyte));
                                            }
                                            break;
                                        case "tinyint unsigned":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(byte));
                                            break;
                                        case "smallint":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(Int16));
                                            break;
                                        case "smallint unsigned":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(UInt16));
                                            break;
                                        case "mediumint":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(int));
                                            break;
                                        case "mediumint unsigned":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(uint));
                                            break;
                                        case "bigint":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(long));
                                            break;
                                        case "bigint unsigned":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(ulong));
                                            break;
                                        case "int":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(Int32));
                                            break;
                                        case "int unsigned":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(UInt32));
                                            break;
                                        case "float":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(float));
                                            break;
                                        case "double":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(float));   // 값이 0 경우 오류 발생으로 float 타입으로 수정
                                            break;
                                        case "decimal":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(decimal));
                                            break;
                                        case "bool":
                                        case "boolean":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(bool));
                                            break;
                                        case "bit":
                                            data[idx] = data[idx].ToString() == "1" ? true : false;

                                            // 수현 2023-08-16 : 기존 코드/ 왜 배열로 리턴하는지 모르겠음 
                                            //var bitStr = Convert.ToString(Int32.Parse(data[idx].ToString()), 2);
                                            //var bitTemp = bitStr.Select(c => c == '1').ToArray(); // Linq 구문에서 부하 있을 시 별도의 처리 로직 필요
                                            //data[idx] = bitTemp;                                            
                                            break;
                                        case "char":
                                        case "varchar":
                                        case "text":
                                        case "tinytext":
                                        case "mediumtext":
                                        case "longtext":
                                        case "json": // json은 별도로 처리할 것 (JsonManager.Deserialize)
                                            data[idx] = Convert.ChangeType(data[idx], typeof(string));
                                            break;
                                        case "time":
                                            var timespanTemp = TimeSpan.Parse(data[idx].ToString());
                                            data[idx] = timespanTemp;
                                            break;
                                        case "year": // 년도만 반환하므로 우선은 Int16으로 처리
                                            data[idx] = Convert.ChangeType(data[idx], typeof(Int16));
                                            break;
                                        case "date":
                                        case "datetime":
                                            // 형식 지정 필요시
                                            // DateTime.ParseExact(data[idx].ToString(), "yyyyMMdd", null);
                                            data[idx] = Convert.ChangeType(data[idx], typeof(DateTime));
                                            break;
                                        case "binary":
                                        case "varbinary":
                                        case "blob":
                                        case "tinyblob":
                                        case "mediumblob":
                                        case "longblob":
                                            string[] dataTempStr = data[idx].ToString().Split(',');
                                            byte[] dataTempByte = dataTempStr.Select(byte.Parse).ToArray();
                                            data[idx] = dataTempByte;
                                            break;
                                    }
                                }
                                else if (this.DatabaseType == DBType.sqlserver)
                                {
                                    // geography, geometry, hierachyid, timestamp 는 미포함, 필요한 경우 따로 처리 필요
                                    // geography, geometry, hierachyid는 ReadValue 대신 ReadStream으로 읽어 데이터 처리 필요
                                    // timestamp의 경우 binary 형태로 데이터가 들어옴
                                    // sql_variant의 경우 sql_variant -> sql_variant의 inner type으로 대체하여 type check 수행 (CheckVariantInnerType 함수 참고)
                                    switch (columnType)
                                    {
                                        case "int":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(int));
                                            break;
                                        case "real":
                                        case "float": // MS 권장 변경 타입은 double이나 사용에 크게 지장 없으므로 float으로 처리
                                            data[idx] = Convert.ChangeType(data[idx], typeof(float));
                                            break;
                                        case "bit":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(bool));
                                            break;
                                        case "tinyint":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(byte));
                                            break;
                                        case "smallint":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(Int16));
                                            break;
                                        case "bigint":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(Int64));
                                            break;
                                        case "smallmoney":
                                        case "money":
                                        case "numeric":
                                        case "decimal":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(decimal));
                                            break;
                                        case "char":
                                        case "nchar":
                                        case "varchar":
                                        case "nvarchar":
                                        case "text":
                                        case "ntext":
                                        case "xml":
                                            // 필요한 경우 trim 처리할 것, varchar(10) 같은 경우 나머지 자릿수는 공백으로 처리 됨
                                            data[idx] = Convert.ChangeType(data[idx], typeof(string));
                                            break;
                                        case "date":
                                        case "smalldatetime":
                                        case "datetime":
                                        case "datetime2":
                                            // 형식 지정 필요시
                                            // DateTime.ParseExact(data[idx].ToString(), "yyyyMMdd", null);
                                            data[idx] = Convert.ChangeType(data[idx], typeof(DateTime));
                                            break;
                                        case "datetimeoffset":
                                            var offsetTemp = DateTimeOffset.Parse(data[idx].ToString());
                                            data[idx] = offsetTemp;
                                            break;
                                        case "time":
                                            var timespanTemp = TimeSpan.Parse(data[idx].ToString());
                                            data[idx] = timespanTemp;
                                            break;
                                        case "binary":
                                        case "varbinary":
                                        case "rowversion":
                                        case "image":
                                            string[] dataTempStr = data[idx].ToString().Split(',');
                                            byte[] dataTempByte = dataTempStr.Select(byte.Parse).ToArray();
                                            data[idx] = dataTempByte;

                                            // image 테스트 코드, .Net Standard 환경에서 System.Drawing.Image가 기본적으로 없으므로 OpenCV 등을 이용할 것
                                            //if (dataType == "image")
                                            //{
                                            //    using (var ms = new MemoryStream(dataTempByte))
                                            //    {
                                            //        System.Drawing.Image img = System.Drawing.Image.FromStream(ms);
                                            //        img.Save("D:\\image.jpg");
                                            //    }
                                            //}

                                            break;
                                        case "uniqueidentifier":
                                            Guid guidTemp = Guid.Parse(data[idx].ToString());
                                            data[idx] = guidTemp;
                                            break;
                                        case "sql_variant":
                                            data[idx] = Convert.ChangeType(data[idx], typeof(object));
                                            break;
                                    }
                                }
                                else
                                {
                                    // Not Defined
                                }
                            }

                            if (properties[j % properties.Length].CanWrite)
                            {
                                if (properties[j % properties.Length].PropertyType.Name.Contains("List"))
                                {
                                    // Property 중 List이면서 해당 DB Column Type이 varchar 계열인 경우 해당 string에 대한 후처리가 필요하므로 넘김
                                    continue;
                                }
                                else
                                {
                                    properties[j % properties.Length].SetValue(items[i], data[idx]);
                                }
                            }
                            else
                            {
                                // Property 중 Setter가 없는 경우
                                continue;
                            }
                        }
                        else
                        {
                            // 같은 Column 이름으로 여러번 루프를 시행하므로, 처음 한 번만 Column에는 이름이 없는 Class Member들을 체크 함
                            if (i == 0)
                            {
                                notExistTemp.Add(properties[j % properties.Length].Name);
                            }

                            if (properties[j % properties.Length].CanWrite)
                            {
                                // 해당 model에서 받아온 값을 그대로 넣어 줌
                                var modelValue = modelType.GetProperty(properties[j % properties.Length].Name).GetValue(model);
                                properties[j % properties.Length].SetValue(items[i], modelValue);
                            }
                            else
                            {
                                // Property 중 Setter가 없는 경우
                                continue;
                            }
                        }
                    }
                }
            });

            for (int i = 0; i < items.Length; i++)
            {
                ret.Add(items[i]);
            }

            notExistMember = new string[notExistTemp.Count];
            notExistTemp.CopyTo(notExistMember);
            return ret;
        }

        /// <summary>
        /// MySQL 사용 시 unsigned 속성을 가진 Column을 체크
        /// </summary>
        /// <param name="info"> Column 정보 </param>
        /// <param name="tableName"> 조회할 테이블 이름 </param>
        /// <returns> Column 이름, 데이터 타입으로 구성된 Dictionary </returns>
        public Dictionary<string, string> CheckUnsignedValue(Dictionary<string, string> info, string tableName)
        {
            ArrayList checkValue = new ArrayList();
            ArrayList checkRes = null;

            if (info.ContainsValue("tinyint") || info.ContainsValue("smallint") ||
                info.ContainsValue("mediumint") || info.ContainsValue("bigint") || info.ContainsValue("int"))
            {
                string checkColumn;

                for (int i = 0; i < info.Count; i++)
                {
                    var typeValue = info.ElementAt(i).Value;

                    if (typeValue.Equals("tinyint") || typeValue.Equals("smallint") ||
                        typeValue.Equals("mediumint") || typeValue.Equals("bigint") || typeValue.Equals("int"))
                    {
                        checkColumn = info.ElementAt(i).Key.ToString();
                        checkValue.Add(checkColumn);
                    }
                }

                string unsignedStr = "";
                for (int i = 0; i < checkValue.Count; i++)
                {
                    if (i == 0)
                    {
                        unsignedStr += string.Format(" and (`COLUMN_NAME` = '{0}'", checkValue[i]);
                    }
                    else if (i == checkValue.Count - 1)
                    {
                        unsignedStr += string.Format(" or `COLUMN_NAME` = '{0}')", checkValue[i]);
                    }
                    else
                    {
                        unsignedStr += string.Format(" or `COLUMN_NAME` = '{0}'", checkValue[i]);
                    }

                }

                unsignedStr = string.Format("select `COLUMN_TYPE` from `INFORMATION_SCHEMA`.`COLUMNS` where `TABLE_SCHEMA` = '{0}' and `TABLE_NAME` = '{1}' {2}"
                                            , m_strDbName, tableName, unsignedStr);

                checkRes = GetResultData(unsignedStr);

                if (checkRes != null)
                {
                    for (int i = 0; i < checkValue.Count; i++)
                    {
                        if (checkRes[i].ToString().StartsWith("!"))
                        {
                            checkRes[i] = checkRes[i].ToString().Substring(1);
                        }

                        if (checkRes[i].ToString().EndsWith("unsigned"))
                        {
                            info[checkValue[i].ToString()] += " unsigned";
                        }
                    }
                }
            }

            return info;
        }

        /// <summary>
        /// MSSQL 사용 시 sql_variant 내부 타입을 체크
        /// </summary>
        /// <param name="info"> Column 정보 </param>
        /// <param name="tableName"> 조회할 테이블 이름 </param>
        /// <returns> Column 이름, 데이터 타입으로 구성된 Dictionary </returns>
        public Dictionary<string, string> CheckVariantInnerType(Dictionary<string, string> info, string tableName)
        {
            ArrayList variant = new ArrayList();
            ArrayList variantRes = null;

            if (info.ContainsValue("sql_variant"))
            {
                string variantColumn;

                for (int i = 0; i < info.Count; i++)
                {
                    if (info.ElementAt(i).Value.Equals("sql_variant"))
                    {
                        variantColumn = info.ElementAt(i).Key.ToString();
                        variant.Add(variantColumn);
                    }
                }

                string variantStr = "";

                for (int i = 0; i < variant.Count; i++)
                {
                    variantStr += string.Format("SQL_VARIANT_PROPERTY({0}, 'BaseType'), ", variant[i].ToString());
                }

                if (variantStr.EndsWith(", "))
                {
                    variantStr = variantStr.Substring(0, variantStr.Length - 2);
                    variantStr = string.Format("select {0} from {1}", variantStr, tableName);
                }

                variantRes = GetResultData(variantStr);

                if (variantRes != null)
                {
                    for (int i = 0; i < variant.Count; i++)
                    {
                        if (variantRes[i].ToString().StartsWith("!"))
                        {
                            variantRes[i] = variantRes[i].ToString().Substring(1);
                        }

                        info[variant[i].ToString()] = variantRes[i].ToString();
                    }
                }
            }

            return info;
        }

        /// <summary>
        /// 해당 테이블의 칼럼들의 이름과 자료형을 받아온다.
        /// </summary>
        /// <param name="strTableName"> 테이블 이름 </param>
        /// <param name="strDBName"> DB 이름 </param>
        /// <returns> 칼럼 이름 (string) - 자료형 (string)으로 구성된 Dictionary </returns>
        public Dictionary<string, string> GetColumnInfoDictionary(string strTableName, string strDBName = null)
        {
            string[] keys = GetColumnNameStringArray(strTableName);
            string[] values = GetColumnTypeStringArray(strTableName);

            Dictionary<string, string> ret = new Dictionary<string, string>();

            if (keys != null && values != null)
            {
                for (int i = 0; i < keys.Length; i++)
                {
                    ret.Add(keys[i], values[i]);
                }
            }

            return ret;
        }

        /// <summary>
        /// 해당 테이블의 칼럼 자료형을 받아온다.
        /// </summary>
        /// <param name="strTableName"> 테이블 이름 </param>
        /// <param name="strDBName"> DB 이름 </param>
        /// <returns> 칼럼 자료형 (string)으로 구성된 string array </returns>
        public string[] GetColumnTypeStringArray(string strTableName, string strDBName = null)
        {
            string query = "";

            if (strDBName == null)
            {
                strDBName = m_strDbName;
            }

            if (this.DatabaseType == DBType.mysql)
            {
                query = string.Format("select `DATA_TYPE` from `INFORMATION_SCHEMA`.`COLUMNS` where `TABLE_SCHEMA` = '{0}' and `TABLE_NAME` = '{1}'"
                                        , m_strDbName, strTableName);
            }
            else if (this.DatabaseType == DBType.sqlserver)
            {
                query = string.Format("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '{0}'", strTableName);
            }
            else
            {
                // Not Defined
            }

            ArrayList res = GetReadDB(query, strDBName);

            if (res != null)
            {
                for (int i = 0; i < res.Count; i++)
                {
                    if (res[i].ToString().StartsWith("!"))
                    {
                        res[i] = res[i].ToString().Substring(1);
                    }
                }

                return res.ToArray(typeof(string)) as string[];
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 해당 테이블의 칼럼 이름을 받아온다.
        /// </summary>
        /// <param name="strTableName"> 테이블 이름 </param>
        /// <param name="strDBName"> DB 이름 </param>
        /// <returns> 칼럼 이름으로 구성된 string (구분은 ,) </returns>
        public string GetColumnNameString(string strTableName, string strDBName = null)
        {
            string query = "";

            if (strDBName == null)
            {
                strDBName = m_strDbName;
            }

            if (this.DatabaseType == DBType.mysql)
            {
                query = string.Format("select `COLUMN_NAME` from `INFORMATION_SCHEMA`.`COLUMNS` where `TABLE_SCHEMA` = '{0}' and `TABLE_NAME` = '{1}'"
                                        , m_strDbName, strTableName);
            }
            else if (this.DatabaseType == DBType.sqlserver)
            {
                query = string.Format("select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '{0}'", strTableName);
            }
            else
            {
                // Not Defined
            }

            ArrayList res = GetReadDB(query, strDBName);

            if (res != null)
            {
                for (int i = 0; i < res.Count; i++)
                {
                    if (res[i].ToString().StartsWith("!"))
                    {
                        res[i] = res[i].ToString().Substring(1);
                    }
                }

                return string.Join(",", res.ToArray(typeof(string)) as string[]);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 해당 테이블의 칼럼 이름을 받아온다.
        /// </summary>
        /// <param name="strTableName"> 테이블 이름 </param>
        /// <param name="strDBName"> DB 이름 </param>
        /// <returns> 칼럼 이름 (string)으로 구성된 string array </returns>
        public string[] GetColumnNameStringArray(string strTableName, string strDBName = null)
        {
            string query = "";

            if (strDBName == null)
            {
                strDBName = m_strDbName;
            }

            if (this.DatabaseType == DBType.mysql)
            {
                query = string.Format("select `COLUMN_NAME` from `INFORMATION_SCHEMA`.`COLUMNS` where `TABLE_SCHEMA` = '{0}' and `TABLE_NAME` = '{1}'"
                                        , m_strDbName, strTableName);
            }
            else if (this.DatabaseType == DBType.sqlserver)
            {
                query = string.Format("select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '{0}'", strTableName);
            }
            else
            {
                // Not Defined
            }

            ArrayList res = GetReadDB(query, strDBName);

            if (res != null)
            {
                for (int i = 0; i < res.Count; i++)
                {
                    if (res[i].ToString().StartsWith("!"))
                    {
                        res[i] = res[i].ToString().Substring(1);
                    }
                }

                return res.ToArray(typeof(string)) as string[];
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Insert 시 필요한 Value를 string 형태로 만들어 준다.
        /// </summary>
        /// <param name="param"> 필요한 Value </param>
        /// <returns> Value 값이 포함된 string (구분은 ,) </returns>
        public string ConvertParamsToString(params object[] param)
        {
            if (param.Length > 0)
            {
                string ret = "";
                string temp = "";

                for (int i = 0; i < param.Length; i++)
                {
                    if (param[i] != null)
                    {
                        if (param[i].GetType() == typeof(string) || param[i].GetType() == typeof(bool))
                        {
                            temp = string.Format("'{0}'", param[i].ToString());
                        }
                        else if (param[i].GetType() == typeof(DateTime))
                        {
                            DateTime timeTemp = (DateTime)param[i];
                            string format = "yyyy-MM-dd HH:mm:ss";
                            string timeStr = timeTemp.ToString(format);
                            temp = string.Format("'{0}'", timeStr);
                        }
                        else
                        {
                            temp = string.Format("{0}", param[i].ToString());
                        }
                    }
                    else
                    {
                        temp = string.Format("NULL");
                    }

                    if (i == param.Length - 1)
                    {
                        ret += string.Format("{0}", temp);
                    }
                    else
                    {
                        ret += string.Format("{0},", temp);
                    }
                }

                return ret;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 해당 테이블의 마지막 Index(ID)를 얻어온다.
        /// </summary>
        /// <param name="tableName"> 테이블 이름 </param>
        /// <returns> 마지막 Index(ID) </returns>
        public int? GetLastIndex(string tableName)
        {
            string query = string.Format("select max(ID) from {0}", tableName);
            ArrayList res = GetResultData(query);

            if (res != null)
            {
                if (res[0].ToString().StartsWith("!"))
                {
                    res[0] = res[0].ToString().Substring(1);
                    return Convert.ToInt32(res[0].ToString());
                }
                else
                {
                    return 0;
                }
            }
            else
            {
                // Error
                return null;
            }
        }
    }
}
