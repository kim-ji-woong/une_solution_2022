using System.IO;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Configuration;
using System.Windows.Forms;

namespace DbReader
{
    class DbManager
    {
        private DataManager m_dataManager = null;
        private SchemaReader m_schemaReader = null;

        public DbManager(string strDbHost, string strDbName)
        {
            string strID = ConfigurationManager.AppSettings.Get("id");
            string strPW = ConfigurationManager.AppSettings.Get("pw");
            string strDbType = ConfigurationManager.AppSettings.Get("dbType");
            string strPort = ConfigurationManager.AppSettings.Get("port");

            if (strDbType == null || strDbType.Length == 0)
            {
                MessageBox.Show("Db Type이 설정되지 않았습니다.");
            }
            else if (strID == null || strID.Length == 0)
            {
                MessageBox.Show("Db ID가 설정되어 있지 않습니다.");
            }
            else if (strPW == null || strPW.Length == 0)
            {
                MessageBox.Show("Db 비밀번호가 설정되어 있지 않습니다.");
            }
            else
            {
                int dbType = 0;
                int.TryParse(strDbType.Trim(), out dbType);

                int? port = null;

                if (strPort != null && strPort.Length > 0)
                {
                    int _port;

                    if (int.TryParse(strPort, out _port))
                        port = _port;
                }

                m_dataManager = new DataManager(dbType, strDbHost, strDbName, strID, strPW, port);

                if (dbType == (int)dnsDapperDBUtil.Manager.WebDBManager.DBType.sqlserver)
                    m_schemaReader = new SqlServerReader(m_dataManager);
                else if (dbType == (int)dnsDapperDBUtil.Manager.WebDBManager.DBType.mysql)
                    m_schemaReader = new MySqlReader(m_dataManager);
            }
        }

        public List<string> ReadDbNames(out string strErrorMessage)
        {
            if (m_schemaReader == null)
            {
                strErrorMessage = "알수없는 DB Type입니다.";
                return null;
            }

            return m_schemaReader.ReadDbNames(out strErrorMessage);
            /*if (m_dataManager == null)
            {
                strErrorMessage = "DB 접속이 이루어지지 않았습니다.";
                return null;
            }

            string strSQL = "Select name, database_id id , create_date date from sys.databases";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return null;

            List<string> dbNames = new List<string>();

            foreach (var item in results)
            {
                if (item.name != "master" &&
                    item.name != "tempdb" &&
                    item.name != "model" &&
                    item.name != "msdb")
                    dbNames.Add(item.name);
            }

            return dbNames;*/
        }

        public List<DBTable> ReadTables(out string strErrorMessage)
        {
            if (m_schemaReader == null)
            {
                strErrorMessage = "알수없는 DB Type입니다.";
                return null;
            }

            return m_schemaReader.ReadTables(out strErrorMessage);
            /*ICollection<DBTable> tables = GetTableList(out strErrorMessage);

            if (tables != null)
            {
                List<DBTable> _tables = new List<DBTable>();
                _tables.AddRange(tables);
                _tables.Sort();

                return _tables;
            }

            return null;*/
        }

        /*private ICollection<DBTable> GetTableList(out string strErrorMessage)
        {
            Dictionary<string, string> dicIdentityFields = GetIdentityFields(out strErrorMessage);

            if (dicIdentityFields == null)
                return null;

            string strSQL = "SELECT Table_Name, Column_Name, Is_Nullable, Data_Type from INFORMATION_SCHEMA.COLUMNS";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            DBTable table;
            Dictionary<string, DBTable> dicTables = new Dictionary<string, DBTable>();

            foreach (var item in results)
            {
                var data = item as IDictionary<string, object>;
                string strFieldName = null, strTableName = null, isNullable = null, strDataType = null;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    string _fieldName = pair.Key.ToLower();

                    if (_fieldName == "column_name")
                        strFieldName = (string)pair.Value;
                    else if (_fieldName == "table_name")
                        strTableName = (string)pair.Value;
                    else if (_fieldName == "is_nullable")
                        isNullable = (string)pair.Value;
                    else if (_fieldName == "data_type")
                        strDataType = (string)pair.Value;
                }

                if (strFieldName != null && strTableName != null && isNullable != null && strDataType != null)
                {
                    if (dicTables.TryGetValue(strTableName.ToLower(), out table) == false)
                    {
                        table = new DBTable();
                        table.TableName = strTableName;
                        dicTables[strTableName.ToLower()] = table;
                    }

                    DBField field = new DBField();

                    field.FieldName = strFieldName;
                    field.IsNullable = isNullable.ToLower() == "yes";
                    field.FieldTypeName = strDataType;
                    field.IsIdentity = dicIdentityFields.ContainsKey(strTableName + "." + strFieldName);

                    table.AddField(field);
                }
            }

            dicTables.Remove("sysdiagrams");
            return dicTables.Values;
        }

        private Dictionary<string, string> GetIdentityFields(out string strErrorMessage)
        {
            string strSQL = "select COLUMN_NAME, TABLE_NAME from INFORMATION_SCHEMA.COLUMNS group by COLUMN_NAME, TABLE_NAME order by TABLE_NAME";
            //string strSQL = "select COLUMN_NAME, TABLE_NAME from INFORMATION_SCHEMA.COLUMNS where COLUMNPROPERTY(object_id(TABLE_SCHEMA + '.' + TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1 order by TABLE_NAME";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return null;

            Dictionary<string, string> dicFields = new Dictionary<string, string>();

            foreach (var item in results)
            {
                var data = item as IDictionary<string, object>;
                string strFieldName = null, strTableName = null;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    string _fieldName = pair.Key.ToLower();

                    if (_fieldName == "column_name")
                        strFieldName = (string)pair.Value;
                    else if (_fieldName == "table_name")
                        strTableName = (string)pair.Value;
                }

                if (strFieldName != null && strTableName != null)
                    dicFields[strTableName + "." + strFieldName] = strTableName + "." + strFieldName;
            }

            return dicFields;
        }*/

        public bool SelectDatas(string strFilePath, List<DBTable> tables, out string strErrorMessage)
        {
            StreamWriter writer = new StreamWriter(strFilePath, false, System.Text.Encoding.UTF8);

            foreach (DBTable table in tables)
            {
                if (SelectDatas(writer, table, out strErrorMessage) == false)
                {
                    writer.Close();
                    return false;
                }
            }

            strErrorMessage = null;
            writer.Close();
            return true;
        }

        private bool SelectDatas(StreamWriter writer, DBTable table, out string strErrorMessage)
        {
            string strSQL = "Select * from " + table.TableName;
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return false;

            writer.WriteLine("[" + table.TableName + "]");
            writer.WriteLine("Data Count : " + GetDataCount(results));
            
            string strFirstLine = "";
            bool first = true;

            foreach (var item in results)
            {
                var data = item as IDictionary<string, object>;
                string strLine = "";

                foreach (KeyValuePair<string, object> pair in data)
                {
                    string fieldName = pair.Key.ToLower();

                    if (pair.Value == null)
                        AddValue(ref strLine, "null");
                    else
                        AddValue(ref strLine, pair.Value.ToString());

                    if (first)
                        AddValue(ref strFirstLine, fieldName);
                }

                if (first)
                    writer.WriteLine(strFirstLine);

                writer.WriteLine(strLine);
                first = false;
            }

            writer.WriteLine();
            return true;
        }

        private int GetDataCount(IEnumerable<dynamic> results)
        {
            int count = 0;

            foreach (var item in results)
            {
                count++;
            }

            return count;
        }

        private void AddValue(ref string strLine, string strValue)
        {
            if (strLine.Length == 0)
                strLine = strValue;
            else
                strLine += "\t" + strValue;
        }
    }
}
