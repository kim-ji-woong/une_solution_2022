using Microsoft.Extensions.Configuration;

namespace Soulbrain.Config
{
    public class Site
    {
        private string m_strExternalLogin = null;
        private bool? m_autoLogin = null;
        private string m_strDBName = "";
        private int? m_nDBType = null;
        private string m_strDbHost = "";
        private string m_strDbID = "";
        private string m_strDbPw = "";

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
            ReadString(config, "Site:DBName", ref m_strDBName);
            ReadInt(config, "Site:DBType", ref m_nDBType);
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
                m_strDbHost = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbHost);
                m_strDbID = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbID);
                m_strDbPw = dnsDapperDBUtil.AES256Cipher.AES_decrypt(strDbPW);
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
