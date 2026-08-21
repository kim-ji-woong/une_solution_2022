using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.Model
{
    public class RegularTeam : Table
    {
        public enum Fields { ID, Name, ParentID };
        public enum WriteFields { ID, Name, ParentID };

        private int m_nID = -1;
        private string m_strName = "";
        private int? m_nParentTeamID = null;

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public int? ParentTeamID
        {
            get { return m_nParentTeamID; }
            set { m_nParentTeamID = value; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.ParentID)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }

        public override string GetTableName()
        {
            return "RegularTeam";
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

        public RegularTeam Clone()
        {
            return (RegularTeam)this.MemberwiseClone();
        }
    }
}
