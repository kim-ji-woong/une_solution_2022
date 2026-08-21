using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WonikBeaconServer.Model
{
    public class RequestEquipZoneMembers
    {
        public int? EquipZoneID { get; set; }
    }

    public class RequestRemainerSMS
    {
        public List<string> PhoneNumbers { get; set; }
        public string Message { get; set; }
    }

    public class RequestSpeedDetectionHistorys
    {
        public string BeginDate { get; set; }
        public string EndDate { get; set; }
        public int? SensorID { get; set; }
    }
}
