using System;
using System.Collections.Generic;
using System.Text;
using static dnsSopID.ID;

namespace SDMS.Model.Sensor
{
    /// <summary>
    /// SdmsSensorServerInfo
    /// </summary>
    public class ServerInfo : IIDObject
    {
        public enum Fields { ID, ServerType, Place, IP, Port, Status, SOPWebServerURL, bUse, SiteID };

        private int m_nID = -1;
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        private int m_nServerType = (int)ServerTypes.None;
        public int ServerType
        {
            get { return m_nServerType; }
            set { m_nServerType = value; }
        }

        private string m_strPlace = "";
        public string Place
        {
            get { return m_strPlace; }
            set { m_strPlace = value; }
        }

        private string m_strIP = "";
        public string IP
        {
            get { return m_strIP; }
            set { m_strIP = value; }
        }

        private int? m_nPort = null;
        public int? Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

        private bool? m_bStatus = null;
        public bool? Status
        {
            get { return m_bStatus; }
            set { m_bStatus = value; }
        }

        private string m_strSOPWebServerURL = "";
        public string SOPWebServerURL
        {
            get { return m_strSOPWebServerURL; }
            set { m_strSOPWebServerURL = value; }
        }

        private bool? m_bUse = null;
        public bool? bUse
        {
            get { return m_bUse; }
            set { m_bUse = value; }
        }

        private int? m_nSiteID = null;
        public int? SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public static string TableName
        {
            get { return "SdmsSensorServerInfo"; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Port ||
                field == Fields.Status ||
                field == Fields.SOPWebServerURL ||
                field == Fields.bUse ||
                field == Fields.SiteID)
                isNullable = true;
            else
                isNullable = false;
            return field.ToString();
        }
    }
}
