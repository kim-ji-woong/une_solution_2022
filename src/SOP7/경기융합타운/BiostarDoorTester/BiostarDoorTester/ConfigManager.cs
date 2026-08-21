using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace BiostarDoorTester
{
    class ConfigManager
    {
        public static string GetServerIP()
        {
            string strServerIP = ConfigurationManager.AppSettings.Get("ServerIP");

            if (strServerIP == null || strServerIP.Trim().Length == 0)
                return "";

            return strServerIP.Trim();
        }

        public static string GetID()
        {
            string strID = ConfigurationManager.AppSettings.Get("ID");

            if (strID == null || strID.Trim().Length == 0)
                return "";

            return strID.Trim();
        }

        public static string GetPW()
        {
            string strPW = ConfigurationManager.AppSettings.Get("PW");

            if (strPW == null || strPW.Trim().Length == 0)
                return "";

            return strPW.Trim();
        }
    }
}
