using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using System.Windows.Forms;

namespace DalMaker
{
    public class DBManager
    {
        private WebDBManager m_dbMgr = null;

        public DBManager(string strDBName, string strWebServerURL)
        {
            m_dbMgr = new WebDBManager(strDBName, 0, 1, strWebServerURL);
        }

        public List<DBTable> ReadTables()
        {
            ICollection<DBTable> tables = GetTableList();

            if (tables != null)
            {
                List<DBTable> _tables = new List<DBTable>();
                _tables.AddRange(tables);
                _tables.Sort();

                return _tables;
            }

            return null;
        }

        private Dictionary<string, string> GetIdentityFields()
        {
            string strSQL = "select COLUMN_NAME, TABLE_NAME from INFORMATION_SCHEMA.COLUMNS where COLUMNPROPERTY(object_id(TABLE_SCHEMA + '.' + TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1 order by TABLE_NAME";
            ArrayList arrResult = m_dbMgr.GetResultData(strSQL);

            if (arrResult == null)
            {
                string strErrorMessage = m_dbMgr.LastErrorMessage;
                MessageBox.Show(strErrorMessage);
                return null;
            }

            Dictionary<string, string> dicFields = new Dictionary<string, string>();
            int nResultCount = arrResult.Count;

            for (int i=0;i<nResultCount-1;i+=2)
            {
                string strFieldName = WebDBManager.GetStringField(arrResult[i]);
                string strTableName = WebDBManager.GetStringField(arrResult[i + 1]);

                if (strFieldName == null || strTableName == null)
                    continue;

                dicFields[strTableName + "." + strFieldName] = strTableName + "." + strFieldName;
            }

            return dicFields;
        }

        private ICollection<DBTable> GetTableList()
        {
            Dictionary<string, string> dicIdentityFields = GetIdentityFields();

            if (dicIdentityFields == null)
                return null;

            string strSQL = "SELECT Table_Name, Column_Name, Is_Nullable, Data_Type from INFORMATION_SCHEMA.COLUMNS";
            ArrayList arrResult = m_dbMgr.GetResultData(strSQL);

            if (arrResult == null)
            {
                string strErrorMessage = m_dbMgr.LastErrorMessage;
                MessageBox.Show(strErrorMessage);
                return null;
            }

            DBTable table;
            Dictionary<string, DBTable> dicTables = new Dictionary<string, DBTable>();

            int nResultCount = arrResult.Count;

            for (int i=0;i<nResultCount-3;i+=4)
            {
                string strTableName = WebDBManager.GetStringField(arrResult[i]);
                string strFieldName = WebDBManager.GetStringField(arrResult[i + 1]);
                string isNullable = WebDBManager.GetStringField(arrResult[i + 2]);
                string strDataType = WebDBManager.GetStringField(arrResult[i + 3]);

                if (strTableName == null || strFieldName == null || isNullable == null || strDataType == null)
                    continue;

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

            if (SetPrimaryKey(dicTables) == false)
                return null;

            return dicTables.Values;
        }

        private bool SetPrimaryKey(Dictionary<string, DBTable> dicTables)
        {
            string strSQL = "Select Table_Name, COLUMN_NAME from INFORMATION_SCHEMA.KEY_COLUMN_USAGE where CONSTRAINT_NAME like 'PK_%'";
            ArrayList arrResult = m_dbMgr.GetResultData(strSQL);

            if (arrResult == null)
            {
                MessageBox.Show("SetPrimaryKey Error : " + m_dbMgr.LastErrorMessage);
                return false;
            }

            DBTable table;
            int nResultCount = arrResult.Count;

            for (int i=0;i<nResultCount-1;i+=2)
            {
                string strTableName = WebDBManager.GetStringField(arrResult[i]);
                string strFieldName = WebDBManager.GetStringField(arrResult[i + 1]);

                if (strTableName == null || strFieldName == null)
                    continue;

                if (dicTables.TryGetValue(strTableName.ToLower(), out table) == false)
                    continue;

                DBField field = table.GetField(strFieldName);

                if (field != null)
                    field.IsPrimaryKey = true;
            }

            return true;
        }
    }
}
