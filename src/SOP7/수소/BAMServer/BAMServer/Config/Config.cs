using System;
using System.Collections.Generic;
using System.Text;

namespace BAMServer.Config
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
        public string ApiURL { get; set; }
        public int? ThreadSleep { get; set; }
        public int? DataSaveTime { get; set; }
    }

    public class SenkoInfo
    {
        public string IP { get; set; }
        public int? Port { get; set; }
        public int? SlaveID { get; set; }
    }
}
