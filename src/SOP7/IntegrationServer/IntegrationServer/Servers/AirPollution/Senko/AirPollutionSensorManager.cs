using dnsDapperDBUtil.DataAccessLayer.DAL;
using IntegrationServer.Managers;
using IntegrationServer.Servers.EmergencyBell.MPia;
using IntegrationServer.ViewModels.Sdms;
using System;
using System.Collections.Generic;
using Nipa.Model.Sdms.Sensor;
using IntegrationServer.Datas;
using System.Numerics;
using static System.Windows.Forms.AxHost;
using System.Data;

namespace IntegrationServer.Servers.AirPollution.Senko
{
    public class AirPollutionSensorManager
    {
        private DataManager m_dataManager = null;
        private string m_strSensorUniqueTag = "Senko";
        private AirPollutionManager m_parentManager = null;

        enum MaterialType { VOC = 8450, OU = 8451, PM10 = 8705, PM25 = 8706 };

        // header
        private int STXLength = 1;
        private int TypeLength = 1;
        private int SequenceLength = 2;
        private int ServiceCodeLength = 2;
        private int RegionCodeLength = 2;
        private int GroupCodeLength = 2;
        private int NodeCodeLength = 2;
        private int CountOfPacketLength = 2;
        private int MilliSencondsLength = 8;

        // packet
        private int SensorClassLength = 2;
        private int SensorCodeLength = 2;
        private int SensorValueLength = 4;
        private int SensorStatusLength = 1;

        // footer
        private int CRCLength = 2;
        private int ETXLength = 1;

        private ushort AtmosphereClass = 0x2100;
        private ushort WeatherClass = 0x2200;

        private ushort TVOC = 0x2102;
        private ushort OU = 0x2103;
        private ushort PM10 = 0x2200;
        private ushort PM25 = 0x2201;

        private Dictionary<int, PSM> m_dicSensors = new Dictionary<int, PSM>();
        private Dictionary<int, Sensor> m_dicSensorZones = new Dictionary<int, Sensor>();
        private List<Sensor> m_SensorZones = new List<Sensor>();

        public AirPollutionSensorManager(DataManager dataManager, AirPollutionManager airPollutionManager)
        {
            m_dataManager = dataManager;
            m_parentManager = airPollutionManager;
        }

        public bool WriteSensorDatas(byte[] receivedData, string strData, dnsTcpLib2.ConnectionState state)
        {

            string strErrorMessage;
            // receivedData = source
            byte[] headers = new byte[STXLength + TypeLength + SequenceLength + ServiceCodeLength + RegionCodeLength + GroupCodeLength + NodeCodeLength + CountOfPacketLength + MilliSencondsLength];
            byte[] footers = new byte[CRCLength + ETXLength];
            byte[] packets = new byte[receivedData.Length - headers.Length - footers.Length];

            Array.Copy(receivedData, 0, headers, 0, headers.Length);
            Array.Copy(receivedData, headers.Length, packets, 0, packets.Length);
            Array.Copy(receivedData, headers.Length + packets.Length, footers, 0, footers.Length);

            if (!ReadSensors())
            {
                return false;
            }

            NodeData nodeData = GetNodeData(headers);

            m_parentManager.Logger.Write(LogTypes.Info, m_parentManager.ServerType, m_parentManager.ServerSeqNo, $"[INFO] : IP: {state.IPAddress.ToString()} , TimeStamp: {nodeData.DateTime} Raw Data : " + strData);

            int currentNodeID = nodeData.NodeID;
            string currentDataTime = nodeData.DateTime;

            List<byte[]> packetsData = new List<byte[]>();

            // Packet Data길이 9 , Header와 Footer를 제외한 나머지 데이터 정렬
            packetsData = SlicePackets(packets, 9);

            foreach (byte[] packet in packetsData)
            {

                byte[] classCode = new byte[SensorClassLength];
                byte[] sensorCode = new byte[SensorCodeLength];
                byte[] sensorValues = new byte[SensorValueLength];
                byte[] sensorStatus = new byte[SensorStatusLength];

                Array.Copy(packet, 0, classCode, 0, classCode.Length);
                Array.Copy(packet, classCode.Length, sensorCode, 0, sensorCode.Length);
                Array.Copy(packet, classCode.Length + sensorCode.Length, sensorValues, 0, sensorValues.Length);
                Array.Copy(packet, classCode.Length + sensorCode.Length + sensorValues.Length, sensorStatus, 0, sensorStatus.Length);

                if (BitConverter.IsLittleEndian)
                {
                    Array.Reverse(classCode);
                    Array.Reverse(sensorCode);
                    //Array.Reverse(sensorValues);
                    Array.Reverse(sensorStatus);
                }

                // 수신 데이터
                string classCodeHexString = BitConverter.ToString(classCode).Replace("-", "");
                string sensorCodeHexString = BitConverter.ToString(sensorCode).Replace("-", "");
                string sensorValuesHexString = BitConverter.ToString(sensorValues).Replace("-", "");
                string sensorStatusHexString = BitConverter.ToString(sensorStatus).Replace("-", "");

                int nSensorClassCode = Convert.ToInt32(classCodeHexString, 16);
                int nSensorCode = Convert.ToInt32(sensorCodeHexString, 16);
                float fSensorValue = BitConverter.ToSingle(sensorValues, 0);

                string strSensorType = "";

                // SensorCode에 해당하는 물질 종류 및 센서 값 확인하는 로그 찍기위함
                strSensorType = GetSensorMaterialType(nSensorCode);

                if (strSensorType != "")
                {
                    m_parentManager.Logger.Write(LogTypes.Info, m_parentManager.ServerType, m_parentManager.ServerSeqNo,
                    $"[INFO] {currentDataTime} : NodeID: {currentNodeID} , SensorType: {strSensorType} , SensorValue: {fSensorValue}");
                }

                foreach (var data in m_dicSensors)
                {
                    int key = data.Key;
                    PSM sensor = data.Value;

                    // Sensor UniqueKey
                    string uniqueKey = sensor.UniqueKey;
                    string[] keyArray = uniqueKey.Split('_');

                    string strSensorNodeID = keyArray[2];
                    string strSensorClass = keyArray[3];
                    string strSensorCode = keyArray[4];

                    int decimalNodeID = Convert.ToInt32(strSensorNodeID);
                    int decimalClassCode = Convert.ToInt32(strSensorClass);
                    int decimalSensorCode = Convert.ToInt32(strSensorCode);

                    string dSensorNodeIDHexString = decimalNodeID.ToString("X");
                    string dSensorClassHexString = decimalClassCode.ToString("X"); // Class_Code 일치여부 확인
                    string dSensorCodeHexString = decimalSensorCode.ToString("X"); // Sensor_Code 일치여부 확인

                    if (currentNodeID == decimalNodeID &&
                        decimalClassCode == nSensorClassCode &&
                        decimalSensorCode == nSensorCode)
                    {
                        if (UpdateSensorData(fSensorValue, sensor))
                        {
                            // SendAlarm
                            string strStandards = sensor.LimitValue.ToString();

                            string[] arrStandards = strStandards.Split("|");

                            string[] bStandards = arrStandards[0].Split(","); // 특징
                            string[] nStandards = arrStandards[1].Split(","); // 수치

                            int AlarmLevel = 0; 

                            AlarmLevel = GetAlarmLevel(bStandards, nStandards, fSensorValue);
                            // AlarmLevel = 0(해제, 미발생)이거나 2, 3 (발생 , 변경)
                           
                            if (AlarmLevel == -1)
                            {
                                // 알람 임계치 기준 없을때
                                continue;
                            }

                            Sensor sensorZone = null;
                            
                            foreach(var zone in m_SensorZones)
                            {
                                if (zone.ID == sensor.ID)
                                {
                                    sensorZone = zone;
                                }
                            }

                            if (sensorZone != null)
                            {
                                if (AlarmLevel > 0)
                                {
                                    // Sending
                                    if (!AlarmManager.Instance.DicCurrentAlarm.TryGetValue(sensorZone.SensorZoneID, out AlarmInfo alarm)) // 알람 미존재
                                    {
                                        // 알람 생성
                                        SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_parentManager.ServerSeqNo, sensorZone.ID);
                                        m_parentManager.SendSensorData(sensorTag, dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, true, AlarmLevel);
                                        m_parentManager.Logger.Write(LogTypes.Info, dnsSopID.ID.ServerTypes.PSM_Senko, AirPollutionManager.Instance.ServerSeqNo, "[Info] : 알람 발생 - SensorZoneID : " + sensorZone.ID.ToString());
                                    }
                                    else // 알람 존재
                                    {
                                        // 알람 단계 변경
                                        if (alarm.AlarmDepth != AlarmLevel)
                                        {
                                            if (AlarmLevel > 0)
                                            {
                                                // 알람 단계 변경
                                                SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_parentManager.ServerSeqNo, sensorZone.ID);
                                                m_parentManager.SendSensorData(sensorTag, dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, true, AlarmLevel);
                                                m_parentManager.Logger.Write(LogTypes.Info, dnsSopID.ID.ServerTypes.PSM_Senko, AirPollutionManager.Instance.ServerSeqNo, "[Info] : 알람 변경 - SensorZoneID : " + sensorZone.ID.ToString());
                                            }
                                        }
                                    }
                                }
                                else // AlarmLevel == 0
                                {
                                    if (AlarmManager.Instance.DicCurrentAlarm.TryGetValue(sensorZone.SensorZoneID, out AlarmInfo alarm)) // 알람 존재 
                                    {
                                        SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_parentManager.ServerSeqNo, sensorZone.ID);
                                        m_parentManager.SendSensorData(sensorTag, dnsData.Sensor.Facility.FacilityType.PSM_SENSOR, false, AlarmLevel);
                                        m_parentManager.Logger.Write(LogTypes.Info, dnsSopID.ID.ServerTypes.PSM_Senko, AirPollutionManager.Instance.ServerSeqNo, "[Info] : 알람 해제 - SensorZoneID : " + sensorZone.ID.ToString());
                                    }
                                }
                            }
                        }
                        else
                        {
                            strErrorMessage = "[Error] : SensorID: " + sensor.ID.ToString() + " PSMSensor Update Fail";
                            m_parentManager.Logger.Write(LogTypes.Error, dnsSopID.ID.ServerTypes.PSM_Senko, m_parentManager.ServerSeqNo, strErrorMessage);
                        }
                    }
                }

            }
            return true;
        }

        private string GetSensorMaterialType(int sensorCode)
        {
            string strMaterialType = "";

            if (sensorCode == (int)MaterialType.VOC)
            {
                strMaterialType = "VOC";
            } else if (sensorCode == (int)MaterialType.OU)
            {
                strMaterialType = "OU";
            } else if (sensorCode == (int)MaterialType.PM10)
            {
                strMaterialType = "PM10";
            } else if (sensorCode == (int)MaterialType.PM25)
            {
                strMaterialType = "PM25";
            }

            return strMaterialType;
        }

        private int GetAlarmLevel(string[] bStandards, string[] standards, float value)
        {
            int level = 0;

            if (bStandards[0] == "False" && bStandards[1] ==  "False" && bStandards[2] == "False") {
                return -1;
            }

            // Nipa 대기센서는 2단계 3단계 알람만 사용
            for (int i = 0; i < standards.Length; i++)
            {
                float standard = Convert.ToSingle(standards[i]);

                if (value > standard)
                    level += 1;
            }

            if (level == 0 || level == 1)
            {
                level = 0;
                return level;
            }

            if (level == 3 || level ==4)
                return level - 1;

            return level;
        }

        private NodeData GetNodeData(byte[] header)
        {
            int NodeID;

            byte[] stx = new byte[STXLength];
            byte[] type = new byte[TypeLength];
            byte[] sequence = new byte[SequenceLength];
            byte[] service = new byte[ServiceCodeLength];
            byte[] region = new byte[RegionCodeLength];
            byte[] group = new byte[GroupCodeLength];
            byte[] node = new byte[NodeCodeLength];
            byte[] countOfPacket = new byte[CountOfPacketLength];
            byte[] milliSeconds = new byte[MilliSencondsLength];

            Array.Copy(header, 0, stx, 0, STXLength);
            Array.Copy(header, STXLength, type, 0, TypeLength);
            Array.Copy(header, STXLength + TypeLength, sequence, 0, SequenceLength);
            Array.Copy(header, STXLength + TypeLength + SequenceLength, service, 0, ServiceCodeLength);
            Array.Copy(header, STXLength + TypeLength + SequenceLength + ServiceCodeLength, region, 0, RegionCodeLength);
            Array.Copy(header, STXLength + TypeLength + SequenceLength + ServiceCodeLength + RegionCodeLength, group, 0, GroupCodeLength);
            Array.Copy(header, STXLength + TypeLength + SequenceLength + ServiceCodeLength + RegionCodeLength + GroupCodeLength, node, 0, NodeCodeLength);
            Array.Copy(header, STXLength + TypeLength + SequenceLength + ServiceCodeLength + RegionCodeLength + GroupCodeLength + NodeCodeLength, countOfPacket, 0, CountOfPacketLength);
            Array.Copy(header, STXLength + TypeLength + SequenceLength + ServiceCodeLength + RegionCodeLength + GroupCodeLength + NodeCodeLength + CountOfPacketLength, milliSeconds, 0, MilliSencondsLength);

            if (BitConverter.IsLittleEndian)
            {
                Array.Reverse(node);
                Array.Reverse(milliSeconds);
            }

            string strNodeID = BitConverter.ToString(node).Replace("-", "");
            string strMilliSeconds = BitConverter.ToString(milliSeconds).Replace("-", "");

            NodeID = Convert.ToInt32(strNodeID);

            BigInteger nMilliSeconds = BigInteger.Parse(strMilliSeconds, System.Globalization.NumberStyles.HexNumber);
            TimeSpan timeSpan = TimeSpan.FromHours(9);
            long hourToMilliSeconds = (long)timeSpan.TotalMilliseconds; // GMT기준 한국시간은 +9시간 해줘야함.

            long resultTime = hourToMilliSeconds + (long)nMilliSeconds;

            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeMilliseconds(resultTime);

            NodeData nodeData = new NodeData();

            if (NodeID != -1 && dateTimeOffset.ToString() != "")
            {
                nodeData.NodeID = NodeID;
                nodeData.DateTime = dateTimeOffset.DateTime.ToString();
            }

            return nodeData;
        }

        private bool UpdateSensorData(float value, PSM sensor)
        {

            string strErrorMessage;

            sensor.CurrentData = value;

            bool bResult = m_dataManager.GetUpdate().Update<PSM>(sensor, null, out strErrorMessage);
            
            return bResult;
        }

        private bool ReadSensors()
        {
            Dictionary<int, PSM> dicSensors = null;
            dicSensors = ReadPSMSensors();

            if (dicSensors == null )
            {
                return false;
            }

            if (ReadSensorZones(dicSensors))
            {
                foreach(KeyValuePair<int, PSM> pair in dicSensors)
                {
                    m_dicSensors[pair.Key] = pair.Value;
                }
            }
            return true;
        }

        private bool ReadSensorZones(Dictionary<int, PSM> dicSensors)
        {
            string strSQL = string.Format("Select a.{0} as SensorZoneID, b.{1} as TagInfoID, a.{2} ",
                SensorZone.Fields.ID, TagInfo.Fields.ID, SensorZone.Fields.OrgSensorID);
            strSQL += string.Format("from {0} a, {1} b ", SensorZone.TableName, TagInfo.TableName);
            strSQL += string.Format("where b.{0} = a.{1} and b.{2} >= {3} and b.{2} < {4} and a.{5} in (Select {6} from {7} where {8} like '{9}%')",
                TagInfo.Fields.SensorZoneID,
                SensorZone.Fields.ID,
                TagInfo.Fields.TagNo,
                ((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR) * 1000,
                ((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR + 1) * 1000,
                SensorZone.Fields.OrgSensorID,
                PSM.Fields.ID,
                PSM.TableName,
                PSM.Fields.UniqueKey,
                m_strSensorUniqueTag);
            /*strSQL += string.Format("where b.{0} = a.{1} and a.{2} = {3} and a.{4} in (Select {5} from {6} where {7} like '%{8}%')",
                TagInfo.Fields.SensorZoneID,
                SensorZone.Fields.ID,
                SensorZone.Fields.SensorType,
                (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR,
                SensorZone.Fields.OrgSensorID,
                PSM.Fields.ID,
                PSM.TableName,
                PSM.Fields.UniqueKey,
                m_strSensorUniqueTag);*/

            string strErrorMessage;

            IEnumerable<dynamic> datas = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (datas == null)
                return false;

            foreach(var data in datas)
            {
                if (data.SensorZoneID != null && data.SensorZoneID is int &&
                    data.TagInfoID != null && data.TagInfoID is int &&
                    data.OrgSensorID != null && data.OrgSensorID is int)
                {
                    Sensor sensor = new Sensor();

                    sensor.ID = data.OrgSensorID;
                    sensor.SensorZoneID = data.SensorZoneID;
                    sensor.SensorTagInfoID = data.TagInfoID;

                    m_SensorZones.Add(sensor);
                }
            }

            return true;
        }

        private Dictionary<int, PSM> ReadPSMSensors()
        {
            Dictionary<int, PSM> dicSensors = new Dictionary<int, PSM>();

            string strErrorMessage;
            string strCondition = string.Format("{0} Like '%{1}%'", PSM.Fields.UniqueKey, m_strSensorUniqueTag);
            IEnumerable<PSM> sensors = m_dataManager.GetSelect().Select<PSM>(strCondition, out strErrorMessage);

            if (sensors == null)
            {
                System.Diagnostics.Trace.WriteLine("Select PSM Fail : " + strErrorMessage);
                return null;
            }

            foreach (PSM sensor in sensors)
            {
                dicSensors[sensor.ID] = sensor;
            }
            /*IEnumerable<dynamic> datas = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (datas == null)
                return null;

            foreach(var data in datas)
            {
                if (data.ID != null && data.ID is int &&
                    data.Name != null && data.Name is string &&
                    data.UniqueKey != null && data.UniqueKey is string)
                {
                    string strUniqueKey = (string)data.UniqueKey;

                    SensorPSM sensor = new SensorPSM();

                    sensor.ID = data.ID;
                    sensor.Name = data.Name;
                    sensor.PositionName = data.PositionName;
                    sensor.X = (float?)data.X;
                    sensor.Y = (float?)data.Y;
                    sensor.Z = (float?)data.Z;
                    sensor.CurrentData = (float?)data.CurrentData;
                    sensor.LimitLevel1 = (float?)data.LimitLevel1;
                    sensor.LimitLevel2 = (float?)data.LimitLevel2;
                    sensor.LimitLevel3 = (float?)data.LimitLevel3;
                    sensor.EquipZoneID = data.EquipZoneID;
                    sensor.UseLimitLevel1 = data.UseLimitLevel1;
                    sensor.UseLimitLevel2 = data.UseLimitLevel2;
                    sensor.UseLimitLevel3 = data.UseLimitLevel3;
                    sensor.Department = data.Department;
                    sensor.DepartmentPhoneNumber = data.DepartmentPhoneNumber;
                    sensor.Enabled = data.Enabled;
                    sensor.Status = data.Status;
                    sensor.UniqueKey = strUniqueKey;
                    sensor.ZoneID = data.ZoneID;
                    sensor.MaterialType = data.MaterialType;
                    sensor.LimitBase = (float?)data.LimitBase;
                    sensor.LimitType = data.LimitType;
                    sensor.LimitValue = data.LimitValue;

                    dicSensors.Add(sensor.ID, sensor);
                }
            }*/

            return dicSensors;
        }

        private static List<byte[]> SlicePackets(byte[] source, int sliceSize)
        {
            List<byte[]> packets = new List<byte[]>();

            for (int i = 0; i < source.Length; i += sliceSize)
            {
                int remainingLength = Math.Min(sliceSize, source.Length - i);
                byte[] slice = new byte[remainingLength];
                Array.Copy(source, i, slice, 0, remainingLength);
                packets.Add(slice);
            }

            return packets;
        }

        public class NodeData
        {
            private int m_nNodeID = -1;
            private string m_strDateTime = "";

            public int NodeID
            {
                get { return m_nNodeID; }
                set { m_nNodeID = value; }
            }

            public string DateTime
            {
                get { return m_strDateTime; }
                set { m_strDateTime = value; }
            }
        }


        public class Sensor
        {
            private int m_nID = -1;
            private string m_strName;
            private float? m_fCurrentData;
            private string m_strUniqueKey = "";
            private int m_nSensorZoneID = -1;
            private int m_nSensorTagInfoID = -1;
            private float? m_fLimitBase = null;
            private int? m_nLimitType = null;
            private string m_strLimitValue = null;
            private DateTime? m_dtAlarm = null;
            private int m_nOrgSensorID = -1;

            public int ID
            {
                get { return m_nID; }
                set { m_nID = value; }
            }

            public string Name
            {
                get { return m_strName; }
                set { m_strName = value; }
            }

            public float? CurrentData
            {
                get { return m_fCurrentData; }
                set { m_fCurrentData = value; }
            }

            public string UniqueKey
            {
                get { return m_strUniqueKey; }
                set { m_strUniqueKey = value; }
            }

            public int SensorZoneID
            {
                get { return m_nSensorZoneID; }
                set { m_nSensorZoneID = value; }
            }

            public int SensorTagInfoID
            {
                get { return m_nSensorTagInfoID; }
                set
                {
                    m_nSensorZoneID = (int)value;
                }
            }

            public int OrgSensorID
            {
                get { return m_nOrgSensorID;}
                set { m_nOrgSensorID = value; }
            }

            public float? LimitBase
            {
                get { return m_fLimitBase; }
                set { m_fLimitBase = value; }
            }

            public int? LimitType
            {
                get { return m_nLimitType; }
                set { m_nLimitType = value; }
            }

            public string LimitValue
            {
                get { return m_strLimitValue; }
                set { m_strLimitValue = value; }
            }

            public DateTime? AlarmTime
            {
                get { return m_dtAlarm; }
                set { m_dtAlarm = value; }
            }
        }
    }
}
