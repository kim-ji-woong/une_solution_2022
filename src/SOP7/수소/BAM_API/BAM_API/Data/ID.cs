using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.Data
{
    public class ID
    {
        public static int ALARM_NORMAL = 0;
        public static int ALARM_LEVEL1 = 2;
        public static int ALARM_LEVEL2 = 3;

        public static string Status_default = "0";
        public static string Status_Normal = "1";
        public static string Status_OnHold = "5";
        public static string Status_O2alarm = "10";
        public static string Status_O2critical = "11";
        public static string Status_H2Alarm = "20";
        public static string Status_H2critical = "21";
        public static string Status_LLAlarm = "101";
        public static string Status_LAlarm = "102";
        public static string Status_HAlarm = "103";
        public static string Status_HHAlarm = "104";
        public static string Status_DeviceError = "210";

        public static string IDEXT_Temp = "TT";
        public static string IDEXT_Pressure = "PT";

        public static string URL_NONE = "None";
        public static string URL_TEMP = "/api/TempSensor";
        public static string URL_Pressure = "/api/PressureSensor";
        public static string URL_Flow = "/api/FlowSensor";
        public static string URL_H2JAG = "/api/H2JAGSensor";
        public static string URL_O2JAG = "/api/O2JAGSensor";
        public static string URL_H2 = "/api/H2Sensor";
        public static string URL_H2Low = "/api/H2LowSensor";
        public static string URL_O2 = "/api/O2Sensor";

        public static string URL_Anomaly = "/api/AnomalySensor";
    }

    public class Device
    {
        public static Dictionary<string, bool> GetListID()
        {
            Dictionary<string, bool> dicDevices = new Dictionary<string, bool>();
            dicDevices["QIZA90012"] = false;
            dicDevices["QIZA90007"] = false;
            dicDevices["QIZA90008"] = false;
            dicDevices["PT30088"] = true;
            dicDevices["FT30026"] = true;
            dicDevices["FTZA10016"] = true;
            dicDevices["QIZA90006"] = false;
            dicDevices["QIZA90010"] = false;
            dicDevices["PT80120"] = true;
            dicDevices["PT20330"] = false;
            dicDevices["PT10208"] = false;
            dicDevices["TT10210"] = false;
            dicDevices["PT10260"] = false;
            dicDevices["TT20120"] = false;
            dicDevices["PT20312"] = false;
            dicDevices["QIZA100108"] = false;
            dicDevices["QIZA100106"] = false;
            dicDevices["TT10132"] = false;
            dicDevices["TT20243"] = false;
            dicDevices["PT20242"] = false;
            dicDevices["TT20231"] = false;
            dicDevices["PT20230"] = false;
            dicDevices["TT20219"] = false;
            dicDevices["PT20218"] = true;
            dicDevices["TT10221"] = false;
            dicDevices["PT10220"] = false;
            dicDevices["TT10233"] = false;
            dicDevices["PT10232"] = false;
            dicDevices["TT10245"] = false;
            dicDevices["PT10244"] = false;
            dicDevices["PV10140"] = true;
            dicDevices["PV10116"] = true;
            dicDevices["PT10130"] = false;
            dicDevices["TT20314"] = false;
            dicDevices["PV10258"] = true;
            dicDevices["PV10276"] = true;
            dicDevices["PV10257"] = true;
            dicDevices["TT20262"] = true;
            dicDevices["PV10278"] = true;
            dicDevices["FT20315"] = false;
            dicDevices["PV20334"] = true;
            dicDevices["PV20322"] = true;
            dicDevices["PV20325"] = true;
            dicDevices["PV20324"] = true;

            dicDevices["QIZA_H2Une301"] = false;
            dicDevices["QIZA_O2Une301"] = false;
            dicDevices["QIZA_H2Une202"] = false;
            dicDevices["QIZA_H2Une201"] = false;
            dicDevices["QIZA_H2Une302"] = false;
            dicDevices["QIZA_O2Une201"] = false;
            dicDevices["QIZA_H2Une101"] = false;
            dicDevices["QIZA_O2Une101"] = false;
            dicDevices["QIZA_H2Une102"] = false;

            return dicDevices;

            /*
            List<string> ID = new List<string>();
            // KGS에서 처리하는 알람은 주석처리
            //ID.Add("QIZA90012");
            //ID.Add("QIZA90007");
            //ID.Add("QIZA90008");
            ID.Add("PT30088");
            ID.Add("FT30026");
            ID.Add("FTZA10016");
            //ID.Add("QIZA90006");
            //ID.Add("QIZA90010");
            ID.Add("PT80120");
            //ID.Add("PT20330");
            //ID.Add("PT10208");
            //ID.Add("TT10210");
            //ID.Add("PT10260");
            //ID.Add("TT20120");
            //ID.Add("PT20312");
            //ID.Add("QIZA100108");
            //ID.Add("QIZA100106");
            //ID.Add("TT10132");
            //ID.Add("TT20243");
            //ID.Add("PT20242");
            //ID.Add("TT20231");
            //ID.Add("PT20230");
            //ID.Add("TT20219");
            //ID.Add("PT20218");
            //ID.Add("TT10221");
            //ID.Add("PT10220");
            //ID.Add("TT10233");
            //ID.Add("PT10232");
            //ID.Add("TT10245");
            ID.Add("PT10244");
            ID.Add("PV10140");
            ID.Add("PV10116");
            //ID.Add("PT10130");
            //ID.Add("TT20314");
            ID.Add("PV10258");
            ID.Add("PV10276");
            ID.Add("PV10257");
            ID.Add("TT20262");
            ID.Add("PV10278");
            //ID.Add("FT20315");
            ID.Add("PV20334");
            ID.Add("PV20322");
            ID.Add("PV20325");
            ID.Add("PV20324");

            return ID;
            */
        }
    }

    public class DeviceInfo
    {
        public DeviceInfo(string strName, bool bIsAlarmCheck)
        {
            this.Name = strName;
            this.IsAlarmCheck = bIsAlarmCheck;
        }

        public string Name { get; set; }
        public bool IsAlarmCheck { get; set; }
    }
}
