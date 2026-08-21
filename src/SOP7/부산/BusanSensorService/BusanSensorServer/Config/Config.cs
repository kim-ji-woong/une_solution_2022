using System;
using System.Collections.Generic;
using System.Text;

namespace BusanSensorServer.Config
{
    public class Site
    {
        public int ID { get; set; }
        
        public int DBType { get; set; }
        public string DBName { get; set; }
        public string DBHost { get; set; }
        public string DBID { get; set; }
        public string DBPw { get; set; }
        
        public int ExternalDBType { get; set; }
        public string ExternalDBHost { get; set; }
        public string ExternalDBName { get; set; }
        public string ExternalDBID { get; set; }
        public string ExternalDBPW { get; set; }
        
        public string SOPWebServerURL { get; set; }
    }

    public class Log
    {
        public string logFolder { get; set; }
        public int logLifeTime { get; set; }
        public string logFileTag { get; set; }
    }

    public class Info
    {
        public string DoorAlarmURL { get; set; }
        public string LaserAlarmURL { get; set; }
    }
}
