using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HynixAlarmSimulator.Config
{
    public class Database
    {
        public int DbType { get; set; }
        public string DbHost { get; set; }
        public string DbName { get; set; }
        public string DbID { get; set; }
        public string DbPw { get; set; }
    }

    public class AppConfig
    {
        public string SOPWebServerURL { get; set; }
    }
}
