using System;
using System.Collections.Generic;
using System.Text;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.Model
{
    public class ExternalLogin : Table
    {
        public enum Fields { UserID, LoginKey, LoginTime, Enabled };
        public enum WriteFields { UserID, LoginKey, LoginTime, Enabled };

        private string m_strUserID = "";
        private long m_nLoginKey = 0;
        private DateTime m_dtLogin = new DateTime();
        private bool m_enabled = false;

        public string UserID
        {
            get { return m_strUserID; }
            set { m_strUserID = value; }
        }

        public long LoginKey
        {
            get { return m_nLoginKey; }
            set { m_nLoginKey = value; }
        }

        public DateTime LoginTime
        {
            get { return m_dtLogin; }
            set { m_dtLogin = value; }
        }

        public bool Enabled
        {
            get { return m_enabled; }
            set { m_enabled = value; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }

        public override string GetTableName()
        {
            return "ExternalLogin";
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("UserID = '{0}' and LoginKey = '{1}'", UserID, LoginKey);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }

        public ExternalLogin Clone()
        {
            return (ExternalLogin)this.MemberwiseClone();
        }
    }
}
