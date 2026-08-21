using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace dnsDBUtil.Manager.DirectDB
{
    public class OracleManager : DBManager
    {
        private OracleTransaction m_transaction = null;
        private OracleConnection m_connection = null;
        private string m_strSId = "";

        public string SId
        {
            get { return m_strSId; }
            set { m_strSId = value; }
        }

        // 개별 쿼리마다 새로운 Connection을 맺지 않고, Database별로 Connection Pool을 만들어 공유하도록 한다.
        // Key : DB Name
        //private static ConcurrentDictionary<string, ConcurrentQueue<SqlConnection>> m_dicConnectionPools = new ConcurrentDictionary<string, ConcurrentQueue<SqlConnection>>();

        /*private static SqlConnection GetConnection(string dbName)
        {
            ConcurrentQueue<SqlConnection> connectionQueue;

            if (m_dicConnectionPools.TryGetValue(dbName, out connectionQueue))
            {
                return GetConnection(connectionQueue, dbName);
            }

            connectionQueue = new ConcurrentQueue<SqlConnection>();
            m_dicConnectionPools[dbName] = connectionQueue;

            return GetConnection(connectionQueue, dbName);
        }

        private static void AddConnection(string dbName, SqlConnection connection)
        {
            ConcurrentQueue<SqlConnection> connectionQueue;

            if (!m_dicConnectionPools.TryGetValue(dbName, out connectionQueue))
            {
                connectionQueue = new ConcurrentQueue<SqlConnection>();
                m_dicConnectionPools[dbName] = connectionQueue;
            }

            connectionQueue.Enqueue(connection);
        }

        private static SqlConnection GetConnection(ConcurrentQueue<SqlConnection> connectionQueue, string dbName)
        {
            SqlConnection connection;
            List<SqlConnection> connections = new List<SqlConnection>();

            while (connectionQueue.TryDequeue(out connection))
            {
                if (connection.State == ConnectionState.Open)
                {
                    foreach (SqlConnection conn in connections)
                    {
                        connectionQueue.Enqueue(conn);
                    }

                    return connection;
                }
                else
                    connections.Add(connection);
            }

            foreach (SqlConnection conn in connections)
            {
                connectionQueue.Enqueue(conn);
            }

            string strConnection = GetConnectionString(dbName);
            connection = new SqlConnection(strConnection);
            connection.Open();

            if (connection.State == ConnectionState.Open)
            {
                return connection;
            }

            return null;
        }*/

        private static string GetConnectionString(string strDBName, string strDbHost, string strDbID, string strDbPw, string strSId)
        {
            // ip: 211.206.126.88(port: 1521)
            // sid: KISACOM(개발DB: KISAD2)
            // id: kisasmp / pw : kisa2022smp

            // # sqlplus kisasmp/kisa2022smp
            // select* from kisa_bm.V_SMAPLE_CNTR_INCHRG;
            // 뷰 앞에 kisa_bm.을 입력을 해주셔야 됩니다

            /*Host = "211.206.126.88";
            ID = "kisasmp";
            PW = "kisa2022smp";*/
            string strPort = "1521";
            //string strSID = "KISACOM";
            

            string dataSourceFormat = @"(DESCRIPTION=(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = {0})(PORT = {1}))) (CONNECT_DATA =(SERVICE_NAME = {2})))";
            string dataSource = string.Format(dataSourceFormat, strDbHost, strPort, strSId);

            string connectionString = string.Format("Data Source={0};User ID={1};Password={2}", dataSource, strDbID, strDbPw);
            return connectionString;
        }

        public static string[] RunQuery(string dbName, string query, OracleManager transactionOwner, string strDbHost, string strDbID, string strDbPw)
        {
            string[] results = null;

            try
            {
                if (transactionOwner == null)
                {
                    // [Connection Pooling 사용 버전]
                    // Connection Pool로부터 작업중이지 않은 Connection을 얻어온다.
                    /*SqlConnection connection = GetConnection(dbName);

                    if (connection == null)
                        return WebDBService.ErrorMessage("DB에 접속할 수 없습니다.");

                    SqlCommand cmd = new SqlCommand(query, connection);

                    if (IsSelectQuery(query))
                        results = SelectQuery(cmd);
                    else
                        results = ExecuteQuery(cmd);

                    // 작업이 끝난 Connection을 Pool에 반환한다.
                    AddConnection(dbName, connection);*/

                    // [Connection Pooling 사용하지 않는 버전]
                    string strConnection = GetConnectionString(dbName, strDbHost, strDbID, strDbPw, "");

                    using (OracleConnection connection = new OracleConnection(strConnection))
                    {
                        connection.Open();

                        OracleCommand cmd = new OracleCommand(query, connection);

                        if (IsSelectQuery(query))
                            results = SelectQuery(cmd);
                        else
                            results = ExecuteQuery(cmd);
                    }
                }
                else
                {
                    OracleCommand cmd = new OracleCommand(query, transactionOwner.m_connection);

                    if (IsSelectQuery(query))
                        results = SelectQuery(cmd);
                    else
                        results = ExecuteQuery(cmd);
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("RunQuery : " + query);
                return DBException.ErrorMessage(e.Message);
            }

            return results;
        }

        public static string[] RunStoredProcedure(string dbName, string procedureName, List<string> fieldNames, List<string> fieldValues, OracleManager transactionOwner, string strDbHost, string strDbID, string strDbPw)
        {
            string[] results = null;

            try
            {
                int nFieldCount = fieldNames.Count;

                if (nFieldCount != fieldValues.Count)
                {
                    Logger.Instance.Write("RunStoredProcedure : Parameter 오류, field 이름과 value의 개수가 일치하지 않습니다.");
                    return DBException.ErrorMessage("RunStoredProcedure : Parameter 오류, field 이름과 value의 개수가 일치하지 않습니다.");
                }

                OracleCommand cmd = null;

                if (transactionOwner == null)
                {
                    // [Connection Pooling 사용 버전]
                    // Connection Pool로부터 작업중이지 않은 Connection을 얻어온다.
                    /*SqlConnection connection = GetConnection(dbName);

                    if (connection == null)
                        return WebDBService.ErrorMessage("DB에 접속할 수 없습니다.");

                    cmd = new SqlCommand(procedureName, connection);
                    results = GetStoredProcedureResults(cmd, nFieldCount, fieldNames, fieldValues);

                    // 작업이 끝난 Connection을 Pool에 반환한다.
                    AddConnection(dbName, connection);*/
                    // [Connection Pooling 사용하지 않는 버전]
                    string strConnection = GetConnectionString(dbName, strDbHost, strDbID, strDbPw, "");

                    using (OracleConnection connection = new OracleConnection(strConnection))
                    {
                        connection.Open();

                        cmd = new OracleCommand(procedureName, connection);
                        results = GetStoredProcedureResults(cmd, nFieldCount, fieldNames, fieldValues);
                    }
                }
                else
                {
                    cmd = new OracleCommand(procedureName, transactionOwner.m_connection);
                    results = GetStoredProcedureResults(cmd, nFieldCount, fieldNames, fieldValues);
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("RunStoredProcedure : " + procedureName + "(...) : " + e.Message);
                return DBException.ErrorMessage(e.Message);
            }

            return results;
        }

        private static string[] GetStoredProcedureResults(OracleCommand cmd, int nFieldCount, List<string> fieldNames, List<string> fieldValues)
        {
            cmd.CommandType = CommandType.StoredProcedure;

            for (int i = 0; i < nFieldCount; i++)
            {
                string strFieldName = fieldNames[i];
                string strFieldValue = fieldValues[i];

                if (strFieldValue.StartsWith("i"))
                {
                    int data;

                    if (int.TryParse(strFieldValue.Substring(1), out data))
                        cmd.Parameters.Add(new SqlParameter(strFieldName, data));
                }
                else if (strFieldValue.StartsWith("s"))
                {
                    cmd.Parameters.Add(new SqlParameter(strFieldName, strFieldValue.Substring(1)));
                }
                else if (strFieldValue.StartsWith("f"))
                {
                    float data;

                    if (float.TryParse(strFieldValue.Substring(1), out data))
                        cmd.Parameters.Add(new SqlParameter(strFieldName, data));
                }
            }

            return SelectQuery(cmd);
        }

        public static OracleManager BeginTransaction(string dbName, string strDbHost, string strDbID, string strDbPw, out string strErrorMessage)
        {
            strErrorMessage = "";
            string strConnection = GetConnectionString(dbName, strDbHost, strDbID, strDbPw, "");

            OracleManager transactionOwner = new OracleManager();

            try
            {
                transactionOwner.m_connection = new OracleConnection(strConnection);
                transactionOwner.m_connection.Open();
                transactionOwner.m_transaction = transactionOwner.m_connection.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);
            }
            catch (Exception e)
            {
                Logger.Instance.Write("BeginTransaction Fail : " + dbName);
                strErrorMessage = e.Message;
                return null;
            }

            transactionOwner.CreateTime = DateTime.Now;
            return transactionOwner;
        }

        public override string BatchCommit()
        {
            if (m_connection == null)
            {
                Logger.Instance.Write("BatchCommit");
                return DBException.ErrorMessage2("DB 연결이 끊어졌거나 유효하지 않습니다.");
            }

            if (m_transaction == null)
            {
                try
                {
                    m_connection.Close();
                }
                catch (Exception)
                {
                }

                m_connection = null;
                Logger.Instance.Write("BatchCommit");
                return DBException.ErrorMessage2("커밋할 Transaction이 존재하지 않습니다.");
            }

            string strError = "";

            try
            {
                m_transaction.Commit();
                m_connection.Close();
            }
            catch (Exception e)
            {
                strError = e.Message;
                Logger.Instance.Write("BatchCommit : " + strError);
            }

            m_transaction = null;
            m_connection = null;
            return strError;
        }

        public override string BatchRollback()
        {
            if (m_connection == null)
            {
                Logger.Instance.Write("BatchRollback");
                return DBException.ErrorMessage2("DB 연결이 끊어졌거나 유효하지 않습니다.");
            }

            if (m_transaction == null)
            {
                try
                {
                    m_connection.Close();
                }
                catch (Exception)
                {
                }

                m_connection = null;
                Logger.Instance.Write("BatchRollback");
                return DBException.ErrorMessage2("롤백할 Transaction이 존재하지 않습니다.");
            }

            string strError = "";

            try
            {
                m_transaction.Rollback();
                m_connection.Close();
            }
            catch (Exception e)
            {
                strError = e.Message;
                Logger.Instance.Write("BatchRollback : " + strError);
            }

            m_transaction = null;
            m_connection = null;
            return strError;
        }

        private static string[] ExecuteQuery(OracleCommand cmd)
        {            
            cmd.ExecuteNonQuery();
            return MakeSuccess(null);
        }

        private static string[] SelectQuery(OracleCommand cmd)
        {
            OracleDataReader reader = cmd.ExecuteReader();
            List<string> datas = new List<string>();

            int nColumnCount = reader.FieldCount;

            while (reader.Read())
            {
                for (int i = 0; i < nColumnCount; i++)
                {
                    if (reader.IsDBNull(i))
                        AddNullData(datas);
                    else
                    {
                        AddData(datas, reader.GetValue(i));
                    }
                }
            }

            reader.Close();
            return MakeSuccess(datas);
        }
    }
}
