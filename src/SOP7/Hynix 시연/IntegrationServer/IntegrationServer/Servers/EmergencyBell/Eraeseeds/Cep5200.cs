using System;
using System.Collections.Generic;
using System.Text;

namespace IntegrationServer.Servers.EmergencyBell.Eraeseeds
{
    using Managers;
    using Datas;
    using static AgentFactory.BLL.ServerType;

    class Cep5200
    {
        public const byte EventOn = 0x61;
        public const byte EventOff = 0x62;
        public const byte EventOnV2 = 0x63;
        public const byte EventOffV2 = 0x64;
        public const byte EquipStatus = 0x65;
        public const byte EquipName = 0x66;
        public const byte EquipList = 0x67;

        public static SensorTag GetSensor(byte cmd, int len, byte[] bytes, Dictionary<string, SensorTag> dicSensorTags, Logger logger, int nServerSeqNo)
        {
            SensorTag sensorTag = null;

            if (cmd == EventOn || cmd == EventOff)
            {
                if (len < 5)
                    return null;

                int deviceType = (int)bytes[0];
                int deviceID = GetData(bytes, 1);
                int channelID = GetData(bytes, 3);
            }
            else if (cmd == EventOnV2 || cmd == EventOffV2)
            {
                if (len < 11)
                    return null;

                int deviceType = (int)bytes[0];
                int deviceID = GetData(bytes, 1);
                int channelID = GetData(bytes, 3);
                string strMacAddr = GetMacAddress(bytes, 5, len);

                dicSensorTags.TryGetValue(strMacAddr, out sensorTag);
            }
            else if (cmd == EquipStatus)
            {
                if (len < 15)
                    return null;

                int deviceType = (int)bytes[0];
                int deviceID = GetData(bytes, 1);
                int channelID = GetData(bytes, 3);
                string strMacAddr = GetMacAddress(bytes, 5, len);

                dicSensorTags.TryGetValue(strMacAddr, out sensorTag);
            }
            else if (cmd == EquipName)
            {
                if (len < 19)
                    return null;

                int deviceType = (int)bytes[0];
                int deviceID = GetData(bytes, 1);
                int channelID = GetData(bytes, 3);
                string strMacAddr = GetMacAddress(bytes, 5, len);
                string strIP = GetIP(bytes, 11);
                string strName = GetName(bytes, 19, len);

                WriteLog("EquipName : " + strMacAddr + ", IP(" + strIP + "), Name(" + strName + ")", logger, nServerSeqNo);
            }
            else if (cmd == EquipList)
            {
                if (len < 19)
                    return null;

                int totalCount = GetData(bytes, 0);
                int no = GetData(bytes, 2);

                int deviceType = (int)bytes[4];
                int deviceID = GetData(bytes, 5);
                int channelID = GetData(bytes, 7);
                string strMacAddr = GetMacAddress(bytes, 9, len);
                string strIP = GetIP(bytes, 15);
                string strName = GetName(bytes, 19, len);

                WriteLog("EquipList(" + no.ToString() + "/" + totalCount.ToString() + ") : " + strMacAddr + ", IP(" + strIP + "), Name(" + strName + ")", logger, nServerSeqNo);
            }

            return sensorTag;
        }

        private static string GetName(byte[] bytes, int index, int len)
        {
            if (index >= len)
                return "";

            byte[] arr = new byte[len - index];
            Buffer.BlockCopy(bytes, index, arr, 0, len - index);
            return Encoding.UTF8.GetString(arr);
        }

        private static string GetIP(byte[] bytes, int index)
        {
            string strIP = ((int)bytes[index]).ToString();

            for (int i=index+1;i<index+4;i++)
            {
                strIP += "." + ((int)bytes[i]).ToString();
            }

            return strIP;
        }

        private static string GetMacAddress(byte[] bytes, int index, int len)
        {
            string str = "";

            for (int i=index;i<len;i++)
            {
                if (str.Length == 0)
                    str = string.Format("{0:X2}", bytes[i]);
                else
                    str += string.Format("-{0:X2}", bytes[i]);
            }

            return str;
        }

        private static int GetData(byte[] bytes, int index)
        {
            // Big Endian to Little Endian
            byte[] arr = new byte[2] { bytes[index], bytes[index + 1] };
            Array.Reverse(arr);
            return (int)BitConverter.ToInt16(arr);
        }

        private static void WriteLog(string strLog, Logger logger, int nServerSeqNo)
        {
            if (logger != null)
                logger.Write(LogTypes.Info, ServerTypes.EmergencyBell_Eraeseeds, nServerSeqNo, strLog);
        }
    }
}
