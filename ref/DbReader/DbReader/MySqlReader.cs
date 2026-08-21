using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace DbReader
{
    class MySqlReader : SchemaReader
    {
        public MySqlReader(DataManager dataManager)
            : base(dataManager)
        {
        }

        public override List<string> ReadDbNames(out string strErrorMessage)
        {
            string strSQL = "show databases";
            IEnumerable<dynamic> results = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
                return null;

            List<string> dbNames = new List<string>();

            foreach (var item in results)
            {
                if (item.Database != "sys" &&
                    item.Database != "information_schema" &&
                    item.Database != "performance_schema")
                    dbNames.Add(item.Database);
            }

            return dbNames;
        }

        public override List<DBTable> ReadTables(out string strErrorMessage)
        {
            ICollection<DBTable> tables = GetTableList(out strErrorMessage);

            if (tables != null)
            {
                List<DBTable> _tables = new List<DBTable>();
                _tables.AddRange(tables);
                _tables.Sort();

                return _tables;
            }

            return null;
        }

        private ICollection<DBTable> GetTableList(out string strErrorMessage)
        {
            Dictionary<string, string> dicIdentityFields = GetIdentityFields(out strErrorMessage);

            if (dicIdentityFields == null)
                return null;

            string strSQL = "SELECT Table_Name, Column_Name, Is_Nullable, Data_Type from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = '" + m_dataManager.GetDBManager().DbName + "'";
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
            string strSQL = "select COLUMN_NAME, TABLE_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = '" + m_dataManager.GetDBManager().DbName + "' order by TABLE_NAME";
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
        }
    }
}
