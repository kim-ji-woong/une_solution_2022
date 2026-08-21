using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GGHTServices.Managers
{
    public class ConfigManager
    {
        public static int SiteID { get; set; }
        public static int DbType { get; set; }
        public static string DbHost { get; set; }
        public static string DbName { get; set; }
        public static string DbID { get; set; }
        public static string DbPw { get; set; }
        public static string SOPWebServerURL { get; set; }
        public static string LogFolder { get; set; }
        public static string LogFileTag { get; set; }
        public static int LogLifeDays { get; set; }
    }
}
