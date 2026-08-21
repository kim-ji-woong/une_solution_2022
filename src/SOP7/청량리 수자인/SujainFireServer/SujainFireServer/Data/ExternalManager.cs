using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SujainFireServer.Data
{
    public class ExternalManager
    {
        private DirectDBManager m_dbManager = null;

        private Dictionary<int, bool> m_dicAlarms = new Dictionary<int, bool>();
        private Dictionary<int, List<int>> m_dicZoneAlarms = new Dictionary<int, List<int>>();

        private Dictionary<int, int> m_dicZoneID = new Dictionary<int, int>();

        public ExternalManager()
        {
            Init();
            IninZoneID();

            // 올클리어 복구
            InitAllClear(out string strErrorMessage);
        }

        private void Init()
        {
            string strDBName = ConfigurationManager.AppSettings.Get("EXTERNAL_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "ExternalDB";

            string strDBType = ConfigurationManager.AppSettings.Get("EXTERNAL_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "0";

            string strDBHost = ConfigurationManager.AppSettings.Get("EXTERNAL_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "192.168.10.10";

            string strDBId = ConfigurationManager.AppSettings.Get("EXTERNAL_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "sa";

            string strDBPw = ConfigurationManager.AppSettings.Get("EXTERNAL_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "!1q2w3e";


            int nDBType;
            int.TryParse(strDBType.Trim(), out nDBType);

            m_dbManager = new DirectDBManager(nDBType, strDBHost, strDBName, strDBId, strDBPw);
        }

        private void IninZoneID()
        {
            m_dicZoneID[215] = 1;
            m_dicZoneID[216] = 2;
            m_dicZoneID[217] = 3;
            m_dicZoneID[218] = 4;
            m_dicZoneID[219] = 5;
            m_dicZoneID[220] = 6;
            m_dicZoneID[221] = 7;
            m_dicZoneID[222] = 8;
            m_dicZoneID[223] = 9;
            m_dicZoneID[224] = 10;
            m_dicZoneID[225] = 11;
            m_dicZoneID[1] = 12;
            m_dicZoneID[2] = 13;
            m_dicZoneID[3] = 14;
            m_dicZoneID[4] = 15;
            m_dicZoneID[5] = 16;
            m_dicZoneID[6] = 17;
            m_dicZoneID[7] = 18;
            m_dicZoneID[8] = 19;
            m_dicZoneID[9] = 20;
            m_dicZoneID[10] = 21;
            m_dicZoneID[11] = 22;
            m_dicZoneID[12] = 23;
            m_dicZoneID[13] = 24;
            m_dicZoneID[14] = 25;
            m_dicZoneID[15] = 26;
            m_dicZoneID[16] = 27;
            m_dicZoneID[17] = 28;
            m_dicZoneID[18] = 29;
            m_dicZoneID[19] = 30;
            m_dicZoneID[20] = 31;
            m_dicZoneID[21] = 32;
            m_dicZoneID[22] = 33;
            m_dicZoneID[23] = 34;
            m_dicZoneID[24] = 35;
            m_dicZoneID[25] = 36;
            m_dicZoneID[26] = 37;
            m_dicZoneID[27] = 38;
            m_dicZoneID[28] = 39;
            m_dicZoneID[29] = 40;
            m_dicZoneID[30] = 41;
            m_dicZoneID[31] = 42;
            m_dicZoneID[32] = 43;
            m_dicZoneID[33] = 44;
            m_dicZoneID[34] = 45;
            m_dicZoneID[35] = 46;
            m_dicZoneID[36] = 47;
            m_dicZoneID[37] = 48;
            m_dicZoneID[38] = 49;
            m_dicZoneID[39] = 50;
            m_dicZoneID[40] = 51;
            m_dicZoneID[41] = 52;
            m_dicZoneID[42] = 53;
            m_dicZoneID[43] = 54;
            m_dicZoneID[44] = 55;
            m_dicZoneID[45] = 56;
            m_dicZoneID[46] = 57;
            m_dicZoneID[47] = 58;
            m_dicZoneID[48] = 59;
            m_dicZoneID[49] = 60;
            m_dicZoneID[50] = 61;
            m_dicZoneID[51] = 62;
            m_dicZoneID[52] = 63;
            m_dicZoneID[53] = 64;
            m_dicZoneID[54] = 65;
            m_dicZoneID[226] = 66;
            m_dicZoneID[227] = 67;
            m_dicZoneID[55] = 68;
            m_dicZoneID[56] = 69;
            m_dicZoneID[57] = 70;
            m_dicZoneID[58] = 71;
            m_dicZoneID[59] = 72;
            m_dicZoneID[60] = 73;
            m_dicZoneID[61] = 74;
            m_dicZoneID[62] = 75;
            m_dicZoneID[63] = 76;
            m_dicZoneID[64] = 77;
            m_dicZoneID[65] = 78;
            m_dicZoneID[66] = 79;
            m_dicZoneID[67] = 80;
            m_dicZoneID[68] = 81;
            m_dicZoneID[69] = 82;
            m_dicZoneID[70] = 83;
            m_dicZoneID[71] = 84;
            m_dicZoneID[72] = 85;
            m_dicZoneID[73] = 86;
            m_dicZoneID[74] = 87;
            m_dicZoneID[75] = 88;
            m_dicZoneID[76] = 89;
            m_dicZoneID[77] = 90;
            m_dicZoneID[78] = 91;
            m_dicZoneID[79] = 92;
            m_dicZoneID[80] = 93;
            m_dicZoneID[81] = 94;
            m_dicZoneID[82] = 95;
            m_dicZoneID[83] = 96;
            m_dicZoneID[84] = 97;
            m_dicZoneID[85] = 98;
            m_dicZoneID[86] = 99;
            m_dicZoneID[87] = 100;
            m_dicZoneID[88] = 101;
            m_dicZoneID[89] = 102;
            m_dicZoneID[90] = 103;
            m_dicZoneID[91] = 104;
            m_dicZoneID[92] = 105;
            m_dicZoneID[93] = 106;
            m_dicZoneID[94] = 107;
            m_dicZoneID[95] = 108;
            m_dicZoneID[96] = 109;
            m_dicZoneID[97] = 110;
            m_dicZoneID[98] = 111;
            m_dicZoneID[99] = 112;
            m_dicZoneID[100] = 113;
            m_dicZoneID[101] = 114;
            m_dicZoneID[102] = 115;
            m_dicZoneID[103] = 116;
            m_dicZoneID[104] = 117;
            m_dicZoneID[105] = 118;
            m_dicZoneID[106] = 119;
            m_dicZoneID[107] = 120;
            m_dicZoneID[108] = 121;
            m_dicZoneID[109] = 122;
            m_dicZoneID[110] = 123;
            m_dicZoneID[111] = 124;
            m_dicZoneID[112] = 125;
            m_dicZoneID[113] = 126;
            m_dicZoneID[114] = 127;
            m_dicZoneID[115] = 128;
            m_dicZoneID[116] = 129;
            m_dicZoneID[117] = 130;
            m_dicZoneID[118] = 131;
            m_dicZoneID[119] = 132;
            m_dicZoneID[120] = 133;
            m_dicZoneID[121] = 134;
            m_dicZoneID[122] = 135;
            m_dicZoneID[123] = 136;
            m_dicZoneID[124] = 137;
            m_dicZoneID[125] = 138;
            m_dicZoneID[126] = 139;
            m_dicZoneID[127] = 140;
            m_dicZoneID[128] = 141;
            m_dicZoneID[129] = 142;
            m_dicZoneID[130] = 143;
            m_dicZoneID[131] = 144;
            m_dicZoneID[132] = 145;
            m_dicZoneID[133] = 146;
            m_dicZoneID[134] = 147;
            m_dicZoneID[135] = 148;
            m_dicZoneID[136] = 149;
            m_dicZoneID[137] = 150;
            m_dicZoneID[138] = 151;
            m_dicZoneID[139] = 152;
            m_dicZoneID[140] = 153;
            m_dicZoneID[141] = 154;
            m_dicZoneID[142] = 155;
            m_dicZoneID[143] = 156;
            m_dicZoneID[144] = 157;
            m_dicZoneID[145] = 158;
            m_dicZoneID[146] = 159;
            m_dicZoneID[147] = 160;
            m_dicZoneID[148] = 161;
            m_dicZoneID[149] = 162;
            m_dicZoneID[150] = 163;
            m_dicZoneID[151] = 164;
            m_dicZoneID[152] = 165;
            m_dicZoneID[153] = 166;
            m_dicZoneID[154] = 167;
            m_dicZoneID[155] = 168;
            m_dicZoneID[156] = 169;
            m_dicZoneID[157] = 170;
            m_dicZoneID[158] = 171;
            m_dicZoneID[159] = 172;
            m_dicZoneID[160] = 173;
            m_dicZoneID[161] = 174;
            m_dicZoneID[162] = 175;
            m_dicZoneID[163] = 176;
            m_dicZoneID[164] = 177;
            m_dicZoneID[165] = 178;
            m_dicZoneID[166] = 179;
            m_dicZoneID[167] = 180;
            m_dicZoneID[168] = 181;
            m_dicZoneID[169] = 182;
            m_dicZoneID[170] = 183;
            m_dicZoneID[171] = 184;
            m_dicZoneID[172] = 185;
            m_dicZoneID[173] = 186;
            m_dicZoneID[174] = 187;
            m_dicZoneID[175] = 188;
            m_dicZoneID[176] = 189;
            m_dicZoneID[177] = 190;
            m_dicZoneID[178] = 191;
            m_dicZoneID[179] = 192;
            m_dicZoneID[180] = 193;
            m_dicZoneID[181] = 194;
            m_dicZoneID[182] = 195;
            m_dicZoneID[183] = 196;
            m_dicZoneID[184] = 197;
            m_dicZoneID[185] = 198;
            m_dicZoneID[186] = 199;
            m_dicZoneID[187] = 200;
            m_dicZoneID[188] = 201;
            m_dicZoneID[189] = 202;
            m_dicZoneID[190] = 203;
            m_dicZoneID[191] = 204;
            m_dicZoneID[192] = 205;
            m_dicZoneID[193] = 206;
            m_dicZoneID[194] = 207;
            m_dicZoneID[195] = 208;
            m_dicZoneID[196] = 209;
            m_dicZoneID[197] = 210;
            m_dicZoneID[198] = 211;
            m_dicZoneID[199] = 212;
            m_dicZoneID[200] = 213;
            m_dicZoneID[201] = 214;
            m_dicZoneID[202] = 215;
            m_dicZoneID[203] = 216;
            m_dicZoneID[204] = 217;
            m_dicZoneID[205] = 218;
            m_dicZoneID[206] = 219;
            m_dicZoneID[207] = 220;
            m_dicZoneID[208] = 221;
            m_dicZoneID[209] = 222;
            m_dicZoneID[210] = 223;
            m_dicZoneID[211] = 224;
            m_dicZoneID[212] = 225;
            m_dicZoneID[213] = 226;
            m_dicZoneID[214] = 227;
        }

        private bool InitAllClear(out string strErrorMessage)
        {
            strErrorMessage = "";

            // 초기화 시간
            DateTime dtNow = DateTime.Now;

            foreach (KeyValuePair<int, int> pair in m_dicZoneID)
            {
                int nZoneID = pair.Key;

                // 외부 ZoneID
                int nExZoneID = m_dicZoneID[nZoneID];

                if (WriteExternalAlarmSQL(nExZoneID, (int)ID.EmergencyType.OFF, dtNow, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        public bool SendExternalAlarms(List<EventInfo> eventInfoList, bool bIsAllClear, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 알람 시간
            DateTime dtNow = DateTime.Now;

            if (bIsAllClear == true)
            {   // 전체 복구 신호

                //foreach (KeyValuePair<int, List<int>> pair in m_dicZoneAlarms)
                //{
                //    int nZoneID = pair.Key;
                //    List<int> sensorZones = pair.Value;

                //    // 외부 ZoneID
                //    int nExZoneID = m_dicZoneID[nZoneID];

                //    if (sensorZones != null && sensorZones.Count > 0)
                //    {
                //        if (WriteExternalAlarmSQL(nExZoneID, (int)ID.EmergencyType.OFF, dtNow, out strErrorMessage) == false)
                //            return false;

                //        m_dicZoneAlarms[nZoneID] = new List<int>();
                //    }
                //}
                if (m_dicZoneAlarms != null && m_dicZoneAlarms.Count > 0)
                {
                    List<int> zoneIDs = new List<int>(m_dicZoneAlarms.Keys);

                    foreach (int nZoneID in zoneIDs)
                    {
                        // 외부 ZoneID
                        int nExZoneID = m_dicZoneID[nZoneID];

                        List<int> sensorZones = m_dicZoneAlarms[nZoneID];
                        if (sensorZones != null && sensorZones.Count > 0)
                        {
                            if (WriteExternalAlarmSQL(nExZoneID, (int)ID.EmergencyType.OFF, dtNow, out strErrorMessage) == false)
                                return false;

                            m_dicZoneAlarms[nZoneID] = new List<int>();
                        }
                    }
                }
            }
            else
            {   // 개별 신호
                foreach (EventInfo info in eventInfoList)
                {
                    if (info.ZoneID.HasValue == false || m_dicZoneID.ContainsKey(info.ZoneID.Value) == false)
                        continue;

                    // 외부 ZoneID
                    int nExZoneID = m_dicZoneID[info.ZoneID.Value];

                    // ZoneID 알람 체크 후
                    //if (m_dicAlarms.ContainsKey(info.ZoneID.Value))
                    if (m_dicZoneAlarms.ContainsKey(info.ZoneID.Value))
                    {
                        if (info.Emergency == (int)ID.EmergencyType.ON)
                        {
                            List<int> sensorZones = m_dicZoneAlarms[info.ZoneID.Value];
                            int nSensorZoneCnt = sensorZones.Count;

                            if (sensorZones.Contains(info.SensorZoneID.Value) == false)
                                m_dicZoneAlarms[info.ZoneID.Value].Add(info.SensorZoneID.Value);

                            if (nSensorZoneCnt == 0)
                            {   // 화재 발생
                                if (WriteExternalAlarmSQL(nExZoneID, info.Emergency, dtNow, out strErrorMessage) == false)
                                    return false;
                            }
                        }
                        else
                        {
                            List<int> sensorZones = m_dicZoneAlarms[info.ZoneID.Value];

                            if (sensorZones.Contains(info.SensorZoneID.Value) == true)
                                m_dicZoneAlarms[info.ZoneID.Value].Remove(info.SensorZoneID.Value);

                            int nSensorZoneCnt = sensorZones.Count;

                            if (nSensorZoneCnt == 0)
                            {   // 화재 복구
                                if (WriteExternalAlarmSQL(nExZoneID, info.Emergency, dtNow, out strErrorMessage) == false)
                                    return false;
                            }
                        }
                    }
                    else
                    {
                        // 발생 시에만 SQL 작성
                        if (info.Emergency == (int)ID.EmergencyType.ON)
                        {   // 화재 발생
                            //m_dicAlarms[info.ZoneID.Value] = true;

                            m_dicZoneAlarms[info.ZoneID.Value] = new List<int>();
                            m_dicZoneAlarms[info.ZoneID.Value].Add(info.SensorZoneID.Value);

                            if (WriteExternalAlarmSQL(nExZoneID, info.Emergency, dtNow, out strErrorMessage) == false)
                            {
                                return false;
                            }
                        }
                    }
                }
            }

            return true;
        }

        private bool WriteExternalAlarmSQL(int nZoneID, int nEmergency, DateTime alarmDate, out string strErrorMessage)
        {
            strErrorMessage = "";

            try
            {
                string strLog = string.Format("External Send Alarm (ZoneID: {0}, Emergency: {1}, Date: {2})", nZoneID, nEmergency, alarmDate.ToString("yyyy-MM-dd HH:mm:ss"));
                Logger.Instance.Write(strLog);


                string strSQL = string.Format("Insert into EventList_Fire (ZoneID, Emergency, Date) values ({0}, {1}, '{2}')", nZoneID, nEmergency, alarmDate.ToString("yyyy-MM-dd HH:mm:ss"));
                ArrayList arrResult = m_dbManager.GetResultData(strSQL);

                if (arrResult == null)
                {
                    strErrorMessage = "1. WriteExternalAlarmSQL Error (Insert 실패: " + m_dbManager.LastErrorMessage + ")";
                    return false;
                }

            }
            catch (Exception ex)
            {
                strErrorMessage = "WriteExternalAlarmSQL Error(예외발생: " + ex.Message + ")";
                return false;
            }

            return true;
        }
    }
}
