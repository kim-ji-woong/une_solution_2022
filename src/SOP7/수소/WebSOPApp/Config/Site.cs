using Microsoft.Extensions.Configuration;

namespace WebSOPApp.Config
{
    public class Site
    {
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
        private bool m_bIsMultilingual = false;
        private string m_strLocalServerURL = "http://127.0.0.1";
        private bool m_bUseEquipZoneAssess = false;
        private int? m_webSocketPort = null;

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

        public bool IsMultilingual
        {
            get { return m_bIsMultilingual; }
            set { m_bIsMultilingual = value; }
        }
        public string LocalServerURL
        {
            get { return m_strLocalServerURL; }
            set { m_strLocalServerURL = value; }
        }

        public bool UseEquipZoneAssess
        {
            get { return m_bUseEquipZoneAssess; }
            set { m_bUseEquipZoneAssess = value; }
        }

        public int? WebSocketPort
        {
            get { return m_webSocketPort; }
            set { m_webSocketPort = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Site:DBName", ref m_strDBName);
            ReadInt(config, "Site:DBType", ref m_nDBType);
            ReadInt(config, "Site:ID", ref m_nSiteID);

            ReadString(config, "Site:WebServerURL", ref m_strWebServerURL);
            ReadString(config, "Site:SOPWebServerURL", ref m_strSOPWebServerURL);
            ReadString(config, "Site:StreamServerURL", ref m_strStreamServerURL);
            ReadString(config, "Site:externalLogin", ref m_strExternalLogin);
            ReadString(config, "Site:LocalServerURL", ref m_strLocalServerURL);

            string strDbHost = null, strDbID = null, strDbPW = null;

            ReadString(config, "Site:DbHost", ref strDbHost);
            ReadString(config, "Site:DbID", ref strDbID);
            ReadString(config, "Site:DbPw", ref strDbPW);

            ReadInt(config, "Site:webSocketPort", ref m_webSocketPort);

            string strAutoLogin = config["Site:AutoLogin"];
            if (strAutoLogin != null && strAutoLogin.Trim().Length > 0)
            {
                strAutoLogin = strAutoLogin.ToLower().Trim();

                if (strAutoLogin == "true")
                    AutoLogin = true;
                else if (strAutoLogin == "false")
                    AutoLogin = false;
            }

            string strUseEquipZoneAssess = null;
            ReadString(config, "Options:ui:useEquipZoneAssess", ref strUseEquipZoneAssess);
            if (strUseEquipZoneAssess != null && strUseEquipZoneAssess.Trim().Length > 0)
            {
                strUseEquipZoneAssess = strUseEquipZoneAssess.ToLower().Trim();

                if (strUseEquipZoneAssess == "true")
                    UseEquipZoneAssess = true;
                else if (strUseEquipZoneAssess == "false")
                    UseEquipZoneAssess = false;
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

            string strMultilingual = "false";
            ReadString(config, "Options:multilingual", ref strMultilingual);
            if (bool.TryParse(strMultilingual, out m_bIsMultilingual))
            {
                //SOPSimulator.BLL.SOPRunManager.IsMultilingual = m_bIsMultilingual;
                //SOPSimulator.BLL.SMSManager.IsMultilingual = m_bIsMultilingual;
                //SOPManager.BLL.LoadManager.IsMultilingual = m_bIsMultilingual;
                //Common.BLL.OptionManager.IsMultilingual = m_bIsMultilingual;
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
