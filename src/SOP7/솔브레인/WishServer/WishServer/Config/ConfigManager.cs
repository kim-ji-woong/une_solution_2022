using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WishServer.Config
{
    public class ConfigManager
    {
        private Site m_site = new Site();
        private Log m_log = new Log();

        public Site Site
        {
            get { return m_site; }
        }

        public Log Log
        {
            get { return m_log; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_site.ReadConfig(config);
            m_log.ReadConfig(config);
        }
    }
}
