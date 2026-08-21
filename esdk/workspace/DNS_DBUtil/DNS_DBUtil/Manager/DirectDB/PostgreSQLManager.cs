using System;
using System.Data;
using System.Collections.Generic;
using Npgsql;

namespace dnsDBUtil.Manager.DirectDB
{
    public class PostgreSQLManager : DBManager
    {
        private NpgsqlTransaction m_transaction = null;
        private NpgsqlConnection m_connection = null;

        private static string GetConnectionString(string strDBName, string strDbHost, string strDbID, string strDbPw)
        {
            return string.Format("Server={0};Port=5432;Database={1};User ID={2};Password={3};", strDbHost, strDBName, strDbID, strDbPw);
        }

        public static string[] RunQuery(string dbName, string query, PostgreSQLManager transactionOwner, string strDbHost, string strDbID, string strDbPw)
        {
            string[] results = null;

            try
            {
                if (transactionOwner == null)
                {
                    string strConnection = GetConnectionString(dbName, strDbHost, strDbID, strDbPw);

                    using (NpgsqlConnection connection = new NpgsqlConnection(strConnection))
                    {
                        connection.Open();

                        NpgsqlCommand cmd = new NpgsqlCommand(query, connection);
                        cmd.CommandTimeout = 2;
                        if (IsSelectQuery(query))
                            results = SelectQuery(cmd);
                        else
                            results = ExecuteQuery(cmd);
                    }
                }
                else
                {
                    NpgsqlCommand cmd = new NpgsqlCommand(query, transactionOwner.m_connection, transactionOwner.m_transaction);
                    cmd.CommandTimeout = 2;
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

        public static string[] RunStoredProcedure(string dbName, string procedureName, List<string> fieldNames, List<string> fieldValues, PostgreSQLManager transactionOwner, string strDbHost, string strDbID, string strDbPw)
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

                NpgsqlCommand cmd = null;

                if (transactionOwner == null)
                {
                    string strConnection = GetConnectionString(dbName, strDbHost, strDbID, strDbPw);

                    using (NpgsqlConnection connection = new NpgsqlConnection(strConnection))
                    {
                        connection.Open();

                        cmd = new NpgsqlCommand(procedureName, connection);
                        results = GetStoredProcedureResults(cmd, nFieldCount, fieldNames, fieldValues);
                    }
                }
                else
                {
                    cmd = new NpgsqlCommand(procedureName, transactionOwner.m_connection, transactionOwner.m_transaction);
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

        private static string[] GetStoredProcedureResults(NpgsqlCommand cmd, int nFieldCount, List<string> fieldNames, List<string> fieldValues)
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
                        cmd.Parameters.Add(new NpgsqlParameter(strFieldName, data));
                }
                else if (strFieldValue.StartsWith("s"))
                {
                    cmd.Parameters.Add(new NpgsqlParameter(strFieldName, strFieldValue.Substring(1)));
                }
                else if (strFieldValue.StartsWith("f"))
                {
                    float data;

                    if (float.TryParse(strFieldValue.Substring(1), out data))
                        cmd.Parameters.Add(new NpgsqlParameter(strFieldName, data));
                }
            }

            return SelectQuery(cmd);
        }

        public static PostgreSQLManager BeginTransaction(string dbName, string strDbHost, string strDbID, string strDbPw, out string strErrorMessage)
        {
            strErrorMessage = "";
            string strConnection = GetConnectionString(dbName, strDbHost, strDbID, strDbPw);

            PostgreSQLManager transactionOwner = new PostgreSQLManager();

            try
            {
                transactionOwner.m_connection = new NpgsqlConnection(strConnection);
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

        private static string[] ExecuteQuery(NpgsqlCommand cmd)
        {
            cmd.ExecuteNonQuery();
            return MakeSuccess(null);
        }

        private static string[] SelectQuery(NpgsqlCommand cmd)
        {
            NpgsqlDataReader reader = cmd.ExecuteReader();
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
