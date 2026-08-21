using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WonikBeaconServer.Config
{
    public class ConfigManager
    {
        private Site m_site = new Site();
        private Log m_log = new Log();
        private Beacon m_beacon = new Beacon();
        private SpeedDetection m_speedDetection = new SpeedDetection();

        public Site Site
        {
            get { return m_site; }
        }

        public Log Log
        {
            get { return m_log; }
        }

        public Beacon Beacon
        {
            get { return m_beacon; }
        }

        public SpeedDetection SpeedDetection
        {
            get { return m_speedDetection; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_site.ReadConfig(config);
            m_log.ReadConfig(config);
            m_beacon.ReadConfig(config);
            m_speedDetection.ReadConfig(config);
        }
    }
}
