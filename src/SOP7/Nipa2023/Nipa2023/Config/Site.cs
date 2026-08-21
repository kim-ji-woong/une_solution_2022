using Microsoft.Extensions.Configuration;

namespace Nipa2023.Config
{
    public class Site
    {
        private string m_strResourceRootPath = "";
        private string m_strExternalLogin = null;
        private bool? m_autoLogin = null;
        private string m_strDBName = "";
        private int? m_nDBType = null;
        private int? m_nExternalSiteID = null;
        private string m_strSolutionName = null;
        private int? m_nWebSocketPort = null;
        private string m_strSOPWebServerURL = "";
        private string m_strStreamServerURL = "";

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

        public int? ExternalSiteID
        {
            get { return m_nExternalSiteID; }
            set { m_nExternalSiteID = value; }
        }

        public string SolutionName
        {
            get { return m_strSolutionName; }
            set { m_strSolutionName = value; }
        }

        public int? WebSocketPort
        {
            get { return m_nWebSocketPort; }
            set { m_nWebSocketPort = value; }
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

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Site:DBName", ref m_strDBName);
            ReadInt(config, "Site:DBType", ref m_nDBType);

            ReadString(config, "Site:externalLogin", ref m_strExternalLogin);
            ReadString(config, "Site:solutionName", ref m_strSolutionName);
            ReadInt(config, "Site:webSocketPort", ref m_nWebSocketPort);

            ReadString(config, "Site:SOPWebServerURL", ref m_strSOPWebServerURL);
            ReadString(config, "Site:StreamServerURL", ref m_strStreamServerURL);

            string strAutoLogin = config["Site:AutoLogin"];

            if (strAutoLogin != null && strAutoLogin.Trim().Length > 0)
            {
                strAutoLogin = strAutoLogin.ToLower().Trim();

                if (strAutoLogin == "true")
                    AutoLogin = true;
                else if (strAutoLogin == "false")
                    AutoLogin = false;
            }

            ReadInt(config, "Site:ExternalSiteID", ref m_nExternalSiteID);
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
