using System;
using System.Collections.Generic;
using System.Text;

namespace CheongsimServer.Config
{
    public class Site
    {
        public string ID { get; set; }
        public string DBName { get; set; }
        public int? DBType { get; set; }
        public string DbHost { get; set; }
        public string DbID { get; set; }
        public string DbPw { get; set; }
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
