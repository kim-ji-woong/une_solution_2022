using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AWS_API.Config
{
    public class Log : Config
    {
        private string m_strFolder = "";
        private int m_nLifeTime = 30;
        private string m_strFileTag = "";

        public string Folder
        {
            get { return m_strFolder; }
            set { m_strFolder = value; }
        }
        public int LifeTime
        {
            get { return m_nLifeTime; }
            set { m_nLifeTime = value; }
        }
        public string FileTag
        {
            get { return m_strFileTag; }
            set { m_strFileTag = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "Log:Folder", ref m_strFolder);
            ReadString(config, "Log:FileTag", ref m_strFileTag);

            int? nTemp = null;
            ReadInt(config, "Log:LifeTime", ref nTemp);

            if (nTemp.HasValue)
                m_nLifeTime = nTemp.Value;
        }
    }

    public class LinkURL: Config
    {
        private string m_strBAM_UNEApiServerURL = "";
        private string m_strUNEServerURL = "";
        private string m_strBAMServerURL = "";
        private string m_strKGSServerURL = "";
        private string m_strUNE_UNEApiServerURL = "";

        public string BAM_UNEApiServerURL
        { 
            get { return m_strBAM_UNEApiServerURL; } 
            set { m_strBAM_UNEApiServerURL = value; }
        }
        public string UNEServerURL
        {
            get { return m_strUNEServerURL; }
            set { m_strUNEServerURL = value; }
        }
        public string BAMServerURL
        {
            get { return m_strBAMServerURL; }
            set { m_strBAMServerURL = value; }
        }
        public string KGSServerURL
        {
            get { return m_strKGSServerURL; }
            set { m_strKGSServerURL = value; }
        }
        public string UNE_UNEApiServerURL
        {
            get { return m_strUNE_UNEApiServerURL; }
            set { m_strUNE_UNEApiServerURL = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "LinkURL:BAM_UNEApiServerURL", ref m_strBAM_UNEApiServerURL);
            ReadString(config, "LinkURL:UNEServerURL", ref m_strUNEServerURL);
            ReadString(config, "LinkURL:BAMServerURL", ref m_strBAMServerURL);
            ReadString(config, "LinkURL:KGSServerURL", ref m_strKGSServerURL);
            ReadString(config, "LinkURL:UNE_UNEApiServerURL", ref m_strUNE_UNEApiServerURL);
        }
    }
}
