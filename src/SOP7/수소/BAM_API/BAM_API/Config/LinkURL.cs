using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.Config
{
    public class LinkURL : Config
    {
        private string m_strBAMServerURL = "";
        private string m_strAWSServerURL = "";

        public string BAMServerURL
        {
            get { return m_strBAMServerURL; }
            set { m_strBAMServerURL = value; }
        }

        public string AWSServerURL
        {
            get { return m_strAWSServerURL; }
            set { m_strAWSServerURL = value; }
        }

        public void ReadConfig(IConfiguration config)
        {
            ReadString(config, "LinkURL:BAMServerURL", ref m_strBAMServerURL);
            ReadString(config, "LinkURL:AWSServerURL", ref m_strAWSServerURL);
        }
    }
}
