using System.Configuration;

namespace CCTVMonitor
{
    class ConfigManager
    {
        public static bool Read(out string strPath)
        {
            strPath = ConfigurationManager.AppSettings.Get("Exe");
            return strPath != null && strPath.Length > 0;
        }
    }
}
