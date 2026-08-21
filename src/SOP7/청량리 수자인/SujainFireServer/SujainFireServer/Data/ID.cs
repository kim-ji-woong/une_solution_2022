using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SujainFireServer.Data
{
    public class ID
    {
        public enum EmergencyType { ON = 1, OFF = 2 }

        public const string ALARM_METHOD = "POST";
    }

    public class EventInfo
    {
        private bool m_bIsALL = false;

        public int TagNum { get; set; }
        public int Emergency { get; set; }
        public bool IsALL
        {
            get { return m_bIsALL; }
            set { m_bIsALL = value; }
        }

        public int? SensorTagID { get; set; }
        public int? SensorZoneID { get; set; }
        public int? ZoneID { get; set; }
    }
}
