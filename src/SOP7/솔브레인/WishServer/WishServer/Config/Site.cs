using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WishServer.Config
{
    public class Site : Config
    {

        private string m_strDBName = "";
        private int? m_nDBType = null;
        private int? m_nSiteID = null;
        private string m_strDBHost = "";
        private string m_strDBID = "";
        private string m_strDBPw = "";

        private string m_strSOPWebServerURL = "";


        public string DBName
        {
            get { return m_strDBName; }
            set { m_strDBName = value; }
        }

        public int? DBType
        {
            get { return m_nDBType; }
            set { m_nDBType = value; }
        }

        public int? SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public string DBHost
        {
            get { return m_strDBHost; }
            set { m_strDBHost = value; }
        }

        public string DBID
        {
            get { return m_strDBID; }
            set { m_strDBID = value; }
        }

        public string DBPw
        {
            get { return m_strDBPw; }
            set { m_strDBPw = value; }
        }

        public string SOPWebServerURL
        {
            get { return m_strSOPWebServerURL; }
            set { m_strSOPWebServerURL = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Site:DBName", ref m_strDBName);
            ReadInt(config, "Site:DBType", ref m_nDBType);
            ReadInt(config, "Site:ID", ref m_nSiteID);

            ReadString(config, "Site:SOPWebServerURL", ref m_strSOPWebServerURL);

            string strDBHost = null, strDBID = null, strDBPW = null;

            ReadString(config, "Site:DbHost", ref strDBHost);
            ReadString(config, "Site:DbID", ref strDBID);
            ReadString(config, "Site:DbPw", ref strDBPW);

            string strAutoLogin = config["Site:AutoLogin"];


            if (strDBHost != null && strDBID != null && strDBPW != null &&
                strDBHost.Trim().Length > 0 &&
                strDBID.Trim().Length > 0 &&
                strDBPW.Trim().Length > 0)
            {
                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                m_strDBHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDBHost, key);
                m_strDBID = dnsDBUtil.AES256Cipher.AES_decrypt(strDBID, key);
                m_strDBPw = dnsDBUtil.AES256Cipher.AES_decrypt(strDBPW, key);
            }
        }
    }

    public class Config
    {
        protected void ReadString(IConfiguration config, string strTarget, ref string strValue)
        {
            string strData = config[strTarget];

            if (strData != null)
                strValue = strData.Trim();
        }

        protected void ReadInt(IConfiguration config, string strTarget, ref int? nValue)
        {
            string strData = config[strTarget];

            if (strData != null)
            {
                int data;

                if (int.TryParse(strData.Trim(), out data))
                    nValue = data;
            }
        }
    }
}
