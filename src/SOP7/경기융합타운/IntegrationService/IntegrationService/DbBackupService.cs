using Microsoft.Extensions.Configuration;
using DbBackup;

namespace IntegrationService
{
    class DbBackupService
    {
        private Service m_service = new Service();

        public void Run()
        {
            m_service.Run();
        }

        public static DbBackupService ReadConfig(IConfiguration configuration)
        {
            bool useDbBackup = ReadBoolean(configuration, "AlarmLinker:DbBackup", false);

            if (useDbBackup == false)
                return null;

            return new DbBackupService();
        }

        private static bool ReadBoolean(IConfiguration configuration, string strTag, bool defaultValue)
        {
            string strData = configuration[strTag];

            if (strData != null)
            {
                strData = strData.Trim().ToLower();

                if (strData == "true")
                    return true;
                else if (strData == "false")
                    return false;
            }

            return defaultValue;
        }
    }
}
