using System;
using System.Collections.Generic;
using System.Text;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.Model
{
    public class JobLevel : Table
    {
        public enum Fields { ID, LevelName };
        public enum WriteFields { ID, LevelName };

        private int m_nID = -1;
        private string m_strLevelName = "";

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string LevelName
        {
            get { return m_strLevelName; }
            set { m_strLevelName = value; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }

        public override string GetTableName()
        {
            return "JobLevel";
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("ID = {0}", ID);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public JobLevel Clone()
        {
            return (JobLevel)this.MemberwiseClone();
        }
    }
}
