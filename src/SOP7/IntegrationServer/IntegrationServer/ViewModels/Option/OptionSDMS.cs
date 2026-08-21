using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.ViewModels.Option
{
    public class OptionSDMS : Table
    {
        public enum Fields { ID, PropertyName, PropertyValue, SiteID, Description };
        public enum WriteFields { PropertyName, PropertyValue, SiteID, Description };

        private int m_nID = -1;
        private string m_strPropertyName = "";
        private string m_strPropertyValue = null;
        private int m_nSiteID = -1;
        private string m_strDescription = null;
                
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public string PropertyName
        {
            get { return m_strPropertyName; }
            set { m_strPropertyName = value; }
        }

        public string PropertyValue
        {
            get { return m_strPropertyValue; }
            set { m_strPropertyValue = value; }
        }

        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public string Description
        {
            get { return m_strDescription; }
            set { m_strDescription = value; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.PropertyValue ||
                field == Fields.Description)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
        public static string TableName = "OptionSDMS";
        public override string GetTableName()
        {
            return TableName;
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
    }
}
