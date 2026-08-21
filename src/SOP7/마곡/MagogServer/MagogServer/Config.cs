using System;
using System.Collections.Generic;
using System.Text;

namespace MagogServer
{
    public class Site
    {
        public int ID { get; set; }
        public string DBName { get; set; }
        public int DBType { get; set; }
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
        public string SOPWebServerURL_Fire { get; set; }
        public string WebServiceBaseURL { get; set; }
    }

    public class ModbusInfo
    {
        public string IP { get; set; }
        public int Port { get; set; }
        public int SlaveID { get; set; }
    }
}
