using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using System.Windows.Forms;

namespace ChangeSite
{
    public class UpdateManager
    {
        private DirectDBManager m_dbMgr = null;

        public UpdateManager(DirectDBManager dbMgr)
        {
            m_dbMgr = dbMgr;
        }

        public bool UpdateSite(int nSiteID)
        {
            List<DBTable> tables = ReadTables();

            if (tables == null)
                return false;

            foreach (DBTable table in tables)
            {
                DBField field = table.GetField("siteid");

                if (field == null)
                    continue;

                string strSQL = string.Format("Update {0} set {1} = {2}", table.TableName, field.FieldName, nSiteID);

                if (m_dbMgr.GetResultData(strSQL) == null)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateManager.UpdateSite SQL : " + strSQL + ", ErrorMessage : " + m_dbMgr.LastErrorMessage);
                    return false;
                }
            }

            m_dbMgr.GetResultData("Delete from Site where ID <> " + nSiteID.ToString());
            return true;
        }

        private List<DBTable> ReadTables()
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

        private ICollection<DBTable> GetTableList()
        {
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

            for (int i = 0; i < nResultCount - 3; i += 4)
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

                table.AddField(field);
            }

            return dicTables.Values;
        }
    }
}
