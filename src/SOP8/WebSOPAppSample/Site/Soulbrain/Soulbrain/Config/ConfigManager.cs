using System.Linq;
using Microsoft.Extensions.Configuration;

namespace Soulbrain.Config
{
    public class ConfigManager
    {
        private Site m_site = new Site();

        public Site Site
        {
            get { return m_site; }
        }

        public void ReadConfig(IConfiguration config)
        {
            m_site.ReadConfig(config);
        }
    }
}
