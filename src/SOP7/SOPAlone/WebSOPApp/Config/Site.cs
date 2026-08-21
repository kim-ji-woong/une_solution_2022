using Microsoft.Extensions.Configuration;

namespace WebSOPApp.Config
{
    public class Site
    {
        private bool m_bIsSopAlone = false;
        private string m_strWebServerURL = "";
        private string m_strSOPWebServerURL = "";
        private string m_strStreamServerURL = "";
        private string m_strResourceRootPath = "";
        private string m_strExternalLogin = null;
        private bool? m_autoLogin = null;
        private string m_strDBName = "";
        private int? m_nDBType = null;
        private int? m_nSiteID = null;
        private string m_strDbHost = "";
        private string m_strDbID = "";
        private string m_strDbPw = "";

        public bool IsSopAlone
        {
            get { return m_bIsSopAlone; }
            set { m_bIsSopAlone = value; }
        }
        public string WebServerURL
        {
            get { return m_strWebServerURL; }
            set { m_strWebServerURL = value; }
        }

        public string SOPWebServerURL
        {
            get { return m_strSOPWebServerURL; }
            set { m_strSOPWebServerURL = value; }
        }

        public string StreamServerURL
        {
            get { return m_strStreamServerURL; }
            set { m_strStreamServerURL = value; }
        }

        public string ResourceRootPath
        {
            get { return m_strResourceRootPath; }
            set { m_strResourceRootPath = value; }
        }

        public string ExternalLogin
        {
            get { return m_strExternalLogin; }
            set { m_strExternalLogin = value; }
        }

        public bool? AutoLogin
        {
            get { return m_autoLogin; }
            set { m_autoLogin = value; }
        }

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

        public string DbHost
        {
            get { return m_strDbHost; }
            set { m_strDbHost = value; }
        }

        public string DbID
        {
            get { return m_strDbID; }
            set { m_strDbID = value; }
        }

        public string DbPw
        {
            get { return m_strDbPw; }
            set { m_strDbPw = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            string sopAlone = "false";
            ReadString(config, "Options:sopAlone", ref sopAlone);
            if (bool.TryParse(sopAlone, out m_bIsSopAlone))
            {
                SOPSimulator.BLL.SOPRunManager.IsSopAlone = m_bIsSopAlone;
                SOPSimulator.BLL.SMSManager.IsSopAlone = m_bIsSopAlone;
                SOPManager.BLL.LoadManager.IsSopAlone = m_bIsSopAlone;
                Common.BLL.OptionManager.IsSopAlone = m_bIsSopAlone;
            }

            ReadString(config, "Site:DBName", ref m_strDBName);
            ReadInt(config, "Site:DBType", ref m_nDBType);
            ReadInt(config, "Site:ID", ref m_nSiteID);

            ReadString(config, "Site:WebServerURL", ref m_strWebServerURL);
            ReadString(config, "Site:SOPWebServerURL", ref m_strSOPWebServerURL);
            ReadString(config, "Site:StreamServerURL", ref m_strStreamServerURL);
            ReadString(config, "Site:externalLogin", ref m_strExternalLogin);

            string strDbHost = null, strDbID = null, strDbPW = null;

            ReadString(config, "Site:DbHost", ref strDbHost);
            ReadString(config, "Site:DbID", ref strDbID);
            ReadString(config, "Site:DbPw", ref strDbPW);

            string strAutoLogin = config["Site:AutoLogin"];

            if (strAutoLogin != null && strAutoLogin.Trim().Length > 0)
            {
                strAutoLogin = strAutoLogin.ToLower().Trim();

                if (strAutoLogin == "true")
                    AutoLogin = true;
                else if (strAutoLogin == "false")
                    AutoLogin = false;
            }

            if (strDbHost != null && strDbID != null && strDbPW != null &&
                strDbHost.Trim().Length > 0 &&
                strDbID.Trim().Length > 0 &&
                strDbPW.Trim().Length > 0)
            {
                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                m_strDbHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDbHost, key);
                m_strDbID = dnsDBUtil.AES256Cipher.AES_decrypt(strDbID, key);
                m_strDbPw = dnsDBUtil.AES256Cipher.AES_decrypt(strDbPW, key);
            }
        }

        private void ReadString(IConfiguration config, string strTarget, ref string strValue)
        {
            string strData = config[strTarget];

            if (strData != null)
                strValue = strData.Trim();
        }

        private void ReadInt(IConfiguration config, string strTarget, ref int? nValue)
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
