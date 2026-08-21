using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SujainEarthquakeServer
{
    public enum AlarmLevel { Attention = 1, Caution, Warning, Serious }
    

    public class ID
    {
        public const string ALARM_METHOD = "POST";

        public const int Earthquake_Caution = 1;
        public const int Earthquake_Warning = 4;
        public const int Earthquake_Serious = 5;

        public const int BlackOutZone_Residential = 1;
        public const int BlackOutZone_Commercial = 2;
        public const int SensorZone_Residential = 40000;
        public const int SensorZone_Commercial = 40001;

        public const int BlackOut_Alarm_ON = 1;
        public const int BlackOut_Alarm_OFF = 0;
    }

    public class TriggerData 
    {
        public DateTime OpdateTime { get; set; }
        public int ChannelID { get; set; }
        public string ChannelCode { get; set; }
        public string ChannelName { get; set; }
        public string Direction { get; set; }
        public string Unit { get; set; }
        public int Tr_Lv { get; set; }
        public double Tr_Value { get; set; }
        public string Tr_Msg { get; set; }

        public double? Tr_MMI { get; set; }

        public int? SensorTagID { get; set; }
        public int? SensorZoneID { get; set; }
        public int? SensorType { get; set; }
    }


    public class BlackOutData
    {
        public int ID { get; set; }
        public int ZoneID { get; set; }
        public int Emergency { get; set; }
        public DateTime CreateDate { get; set; }

        public int? SensorTagID { get; set; }
        public int? SensorZoneID { get; set; }
        public int? SensorType { get; set; }
    }
}
