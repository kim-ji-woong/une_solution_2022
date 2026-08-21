using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AWS_API.Config
{
    public class ConfigManager
    {
        private Log m_log = new Log();

        private LinkURL m_linkURL = new LinkURL();

        public Log Log
        {
            get { return m_log; }
        }

        public LinkURL LinkURL
        {
            get { return m_linkURL; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_log.ReadConfig(config);
            m_linkURL.ReadConfig(config);
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
