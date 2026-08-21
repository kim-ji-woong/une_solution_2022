using System;
using System.Collections.Generic;
using System.Text;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Vacation.Model
{
    public class OptionKakaoInfo : Table
    {
        public enum Fields { ID, CountryCode, SenderKey, BsID, BsPasswd };
        public enum WriteFields { ID, CountryCode, SenderKey, BsID, BsPasswd };

        private int m_nID = -1;
        private int m_nCountryCode = -1;
        private string m_strSenderKey = "";
        private string m_strBsID = "";
        private string m_strBsPasswd = "";

        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int CountryCode
        {
            get { return m_nCountryCode; }
            set { m_nCountryCode = value; }
        }

        public string SenderKey
        {
            get { return m_strSenderKey; }
            set { m_strSenderKey = value; }
        }

        public string BsID
        {
            get { return m_strBsID; }
            set { m_strBsID = value; }
        }

        public string BsPasswd
        {
            get { return m_strBsPasswd; }
            set { m_strBsPasswd = value; }
        }

        public override string GetTableName()
        {
            return "OptionKakaoInfo";
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

        public OptionKakaoInfo Clone()
        {
            return (OptionKakaoInfo)this.MemberwiseClone();
        }
    }
}
