using System;
using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Sdms.Sensor;
using dnsCommunicateSopServer;
using System.IO;
using System.Text;

namespace IntegrationServer.Servers.Worker.SWayM
{
    using ViewModels.Sdms;
    using ViewModels.Worker.SWayM;

    public class AlarmManager
    {
        private const string AlarmLogFile = "SWayMAlarm.log";
        private const int LogDays = 10;

        private string m_strLogFilePath = "";

        private IDataManager m_dataManager = null;
        private SopQueryManager m_sopQueryManager = null;

        // Key : Material ID
        private Dictionary<int, WorkerEvent.EventType> m_dicMaterialWorkerEventType = new Dictionary<int, WorkerEvent.EventType>();
        // Key : 1 ~ 14
        private Dictionary<int, SensorZoneTag> m_dicEmergencyCallSensorZones = new Dictionary<int, SensorZoneTag>();
        private Dictionary<int, SensorZoneTag> m_dicCollapseSensorZones = new Dictionary<int, SensorZoneTag>();
        private Dictionary<int, SensorZoneTag> m_dicStuckSensorZones = new Dictionary<int, SensorZoneTag>();
        private Dictionary<int, SensorZoneTag> m_dicPairSensorZones = new Dictionary<int, SensorZoneTag>();
        private Dictionary<int, SensorZoneTag> m_dicChangeBatterySensorZones = new Dictionary<int, SensorZoneTag>();
        // Key : SensorZone ID
        private Dictionary<int, SensorZoneTag> m_dicAllSensorZones = new Dictionary<int, SensorZoneTag>();
        // 현재 진행중인 AP, 작업자 관련 알람들
        // Key : SensorZone ID
        private Dictionary<int, AlarmSensor> m_dicCurrentAlarms = new Dictionary<int, AlarmSensor>();
        // 이제까지 발생한 알람들(현 시점으로부터 LogDays 이전의 데이터는 삭제된다.)
        private Dictionary<string, WorkerEvent> m_dicPrevWorkerEvents = new Dictionary<string, WorkerEvent>();

        public AlarmManager(IDataManager dataManager, string strSOPWebServerURL)
        {
            m_dataManager = dataManager;
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);
            SetLogFile();
            ReadSensors();
        }

        private void SetLogFile()
        {
            string strLogFolder = Logger.Instance.LogFolder;
            m_strLogFilePath = strLogFolder.EndsWith("\\") || strLogFolder.EndsWith("/") ? strLogFolder + AlarmLogFile : strLogFolder + "\\" + AlarmLogFile;
        }

        public void SaveAlarms()
        {
            List<WorkerEvent> prevAlarms = new List<WorkerEvent>();
            prevAlarms.AddRange(m_dicPrevWorkerEvents.Values);

            DateTime dtNow = DateTime.Now;
            StreamWriter writer = new StreamWriter(m_strLogFilePath, false, Encoding.UTF8);

            foreach (WorkerEvent alarm in prevAlarms)
            {
                TimeSpan span = dtNow - alarm.TimeStamp;

                if (span.TotalDays <= LogDays)
                {
                    string strLine = string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}", alarm.EventID, alarm.Worker.MacAddress, alarm.Worker.DeviceName, alarm.AP.MacAddress, alarm.AP.Name.ToString(), alarm.WorkerEventType.ToString(), DateTimeString(alarm.TimeStamp));
                    WriteLog(strLine, writer);
                }
            }

            writer.Close();
        }

        private void WriteLog(string strLog, StreamWriter writer)
        {
            writer.WriteLine(strLog);
        }

        private string DateTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        public Dictionary<string, WorkerEvent> ReadAlarms()
        {
            if (File.Exists(m_strLogFilePath) == false)
                return new Dictionary<string, WorkerEvent>();

            DateTime dtNow = DateTime.Now;
            Dictionary<string, WorkerEvent> dicPrevAlarms = new Dictionary<string, WorkerEvent>();
            StreamReader reader = new StreamReader(m_strLogFilePath, Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                string[] tokens = strLine.Split('\t');

                if (tokens.Length == 7)
                {
                    string strEventID = tokens[0].Trim();
                    string strWorkerMacAddr = tokens[1].Trim();
                    string strDeviceName = tokens[2].Trim();
                    string strApMacAddr = tokens[3].Trim();
                    string strApName = tokens[4].Trim();
                    string strWorkerEventType = tokens[5].Trim();
                    string strTimeStamp = tokens[6].Trim();

                    WorkerEvent workerEvent = new WorkerEvent();

                    workerEvent.EventID = strEventID;
                    workerEvent.Worker = new Worker();
                    workerEvent.Worker.MacAddress = strWorkerMacAddr;
                    workerEvent.Worker.DeviceName = strDeviceName;
                    workerEvent.WorkerEventType = WorkerEvent.ToEventType(strWorkerEventType);
                    workerEvent.AP = new AP();
                    workerEvent.AP.MacAddress = strApMacAddr;
                    workerEvent.AP.ApNo = GetApID(strApName);
                    workerEvent.AP.Name = strApName;

                    DateTime time;

                    if (DateTime.TryParse(strTimeStamp, out time))
                    {
                        TimeSpan span = dtNow - time;

                        if (span.TotalDays <= LogDays)
                        {
                            workerEvent.TimeStamp = time;
                            dicPrevAlarms[GetEventKey(workerEvent)] = workerEvent;
                        }
                    }
                }
            }

            reader.Close();
            m_dicPrevWorkerEvents = dicPrevAlarms;

            return dicPrevAlarms;
        }

        private bool ReadSensors()
        {
            string strErrorMessage;
            IEnumerable<Material> materials = m_dataManager.GetSelect().Select<Material>(null, out strErrorMessage);

            if (materials == null)
            {
                System.Diagnostics.Trace.WriteLine("Read Material Fail : " + strErrorMessage);
                return false;
            }

            int ec = -1, collapse = -1, stuck = -1;
            int pair = -1, changeBattery = -1;
            string strIDs = "";

            foreach (Material material in materials)
            {
                if (material.MaterialName.EndsWith("긴급호출"))
                {
                    m_dicMaterialWorkerEventType[material.ID] = WorkerEvent.EventType.EmergencyCall;
                    ec = material.ID;
                    SetIDs(ref strIDs, material.ID);
                }
                else if (material.MaterialName.EndsWith("쓰러짐"))
                {
                    m_dicMaterialWorkerEventType[material.ID] = WorkerEvent.EventType.Collapse;
                    collapse = material.ID;
                    SetIDs(ref strIDs, material.ID);
                }
                else if (material.MaterialName.Contains("협착") && material.MaterialName.Contains("작업자"))
                {
                    m_dicMaterialWorkerEventType[material.ID] = WorkerEvent.EventType.Stuck;
                    stuck = material.ID;
                    SetIDs(ref strIDs, material.ID);
                }
                else if (material.MaterialName.EndsWith("2인1조"))
                {
                    m_dicMaterialWorkerEventType[material.ID] = WorkerEvent.EventType.PairError;
                    pair = material.ID;
                    SetIDs(ref strIDs, material.ID);
                }
                else if (material.MaterialName.EndsWith("배터리 교체"))
                {
                    m_dicMaterialWorkerEventType[material.ID] = WorkerEvent.EventType.ChangeBattery;
                    changeBattery = material.ID;
                    SetIDs(ref strIDs, material.ID);
                }
            }

            if (strIDs.Length == 0)
                return false;

            string strConditions = string.Format("{0} in ({1}) and {2} like 'AP%'", ETC.Fields.MaterialType, strIDs, ETC.Fields.UniqueKey);
            IEnumerable<ETC> sensors = m_dataManager.GetSelect().Select<ETC>(strConditions, out strErrorMessage);

            if (sensors == null)
            {
                System.Diagnostics.Trace.WriteLine("Read ETC Fail : " + strErrorMessage);
                return false;
            }

            Dictionary<int, ETC> dicSensors = new Dictionary<int, ETC>();

            foreach (ETC sensor in sensors)
            {
                dicSensors[sensor.ID] = sensor;
            }

            strConditions = string.Format("{0} in ({5}) and {1} in (Select {2} from {3} where {4} in ({5}) and {6} like 'AP%')",
                SensorZone.Fields.SensorType,
                SensorZone.Fields.OrgSensorID,
                ETC.Fields.ID,
                ETC.TableName,
                ETC.Fields.MaterialType,
                strIDs,
                ETC.Fields.UniqueKey);

            ArrayList arrDatas = JoinSensorZoneTagInfo(m_dataManager, strConditions, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("Read JoinSensorZoneTag Fail : " + strErrorMessage);
                return false;
            }

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    ETC sensor;
                    Dictionary<int, SensorZoneTag> dicSensorZones = null;

                    if (sensorZone.OrgSensorID != null && dicSensors.TryGetValue((int)sensorZone.OrgSensorID, out sensor))
                    {
                        if (sensor.MaterialType == ec)
                            dicSensorZones = m_dicEmergencyCallSensorZones;
                        else if (sensor.MaterialType == collapse)
                            dicSensorZones = m_dicCollapseSensorZones;
                        else if (sensor.MaterialType == stuck)
                            dicSensorZones = m_dicStuckSensorZones;
                        else if (sensor.MaterialType == pair)
                            dicSensorZones = m_dicPairSensorZones;
                        else if (sensor.MaterialType == changeBattery)
                            dicSensorZones = m_dicChangeBatterySensorZones;
                        else
                            continue;

                        SensorZoneTag sensorZoneTag = new SensorZoneTag(sensorZone, tagInfo);
                        sensorZoneTag.ApNo = GetApID(sensor);

                        dicSensorZones[GetApID(sensor)] = sensorZoneTag;
                        m_dicAllSensorZones[sensorZone.ID] = sensorZoneTag;
                    }
                }
            }

            return true;
        }

        private int GetApID(ETC ap)
        {
            return GetApID(ap.Name);
        }

        private int GetApID(string strName)
        {
            int len = strName.Length;

            int num = 0;
            bool begin = false;

            for (int i = 0; i < len; i++)
            {
                char ch = strName[i];

                if (begin == false)
                {
                    if (ch >= '0' && ch <= '9')
                    {
                        begin = true;
                        num = num * 10 + (int)(ch - '0');
                    }
                }
                else
                {
                    if (ch < '0' || ch > '9')
                        break;
                    else
                        num = num * 10 + (int)(ch - '0');
                }
            }

            return num;
        }

        private void SetIDs(ref string strIDs, int id)
        {
            if (strIDs.Length == 0)
                strIDs = id.ToString();
            else
                strIDs += "," + id.ToString();
        }

        public static ArrayList JoinSensorZoneTagInfo(IDataManager dataManager, string strAdditionalConditions, out string strErrorMessage)
        {
            SensorZone sensorZone = new SensorZone();
            TagInfo tagInfo = new TagInfo();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}", sensorZone.GetTableName(), tagInfo.GetTableName(), SensorZone.Fields.ID, TagInfo.Fields.SensorZoneID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = Select(strSQL, dataManager, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneFieldCount = sensorZone.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZone = new SensorZone();
                tagInfo = new TagInfo();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneFieldCount)
                    {
                        ReadSensorZone(pair.Key, pair.Value, sensorZone);
                    }
                    else
                    {
                        ReadTagInfo(pair.Key, pair.Value, tagInfo);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZone);
                arrDatas.Add(tagInfo);
            }

            return arrDatas;
        }

        private static void ReadSensorZone(string strFieldName, object value, SensorZone sensorZone)
        {
            if (strFieldName == SensorZone.Fields.ID.ToString())
                sensorZone.ID = (int)value;
            else if (strFieldName == SensorZone.Fields.SensorType.ToString())
                sensorZone.SensorType = (int)value;
            else if (strFieldName == SensorZone.Fields.OrgSensorID.ToString())
            {
                if (value == null)
                    sensorZone.OrgSensorID = null;
                else
                    sensorZone.OrgSensorID = (int)value;
            }
            else if (strFieldName == SensorZone.Fields.EquipZoneID.ToString())
                sensorZone.EquipZoneID = (int)value;
            else if (strFieldName == SensorZone.Fields.IsAlarmStatus.ToString())
                sensorZone.IsAlarmStatus = (bool)value;
            else if (strFieldName == SensorZone.Fields.Data.ToString())
            {
                if (value == null)
                    sensorZone.Data = null;
                else
                    sensorZone.Data = (int)value;
            }
        }

        private static void ReadTagInfo(string strFieldName, object value, TagInfo tagInfo)
        {
            if (strFieldName == TagInfo.Fields.ID.ToString())
                tagInfo.ID = (int)value;
            else if (strFieldName == TagInfo.Fields.SensorServerID.ToString())
                tagInfo.SensorServerID = (int)value;
            else if (strFieldName == TagInfo.Fields.TagNo.ToString())
                tagInfo.TagNo = (int)value;
            else if (strFieldName == TagInfo.Fields.SensorZoneID.ToString())
            {
                if (value == null)
                    tagInfo.SensorZoneID = null;
                else
                    tagInfo.SensorZoneID = (int)value;
            }
            else if (strFieldName == TagInfo.Fields.Activate.ToString())
                tagInfo.Activate = (int)value;
            else if (strFieldName == TagInfo.Fields.Description.ToString())
            {
                if (value == null)
                    tagInfo.Description = null;
                else
                    tagInfo.Description = (string)value;
            }
        }

        public static IEnumerable<dynamic> Select(string strSQL, IDataManager dataManager, out string strErrMsg)
        {
            return dataManager.GetDBManager().Query(strSQL, out strErrMsg);
        }

        private ArrayList JoinSensorZoneHistorySensorZoneHistoryData(string strAdditionalConditions, out string strErrorMessage)
        {
            Nipa.Model.Sdms.History.SensorZone sensorZoneHistory = new Nipa.Model.Sdms.History.SensorZone();
            Nipa.Model.Sdms.History.SensorZoneData sensorZoneHistoryData = new Nipa.Model.Sdms.History.SensorZoneData();

            string strSQL = string.Format("Select a.*, b.* from {0} a, {1} b where a.{2} = b.{3}",
                sensorZoneHistory.GetTableName(),
                sensorZoneHistoryData.GetTableName(),
                Nipa.Model.Sdms.History.SensorZone.Fields.ID,
                Nipa.Model.Sdms.History.SensorZoneData.Fields.SensorZoneHistoryID);

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
                strSQL += " and " + strAdditionalConditions;

            ArrayList arrDatas = new ArrayList();
            IEnumerable<dynamic> result = Select(strSQL, m_dataManager, out strErrorMessage);

            if (result == null)
                return null;

            int nSensorZoneHistoryFieldCount = sensorZoneHistory.GetFieldCount();

            foreach (var item in result)
            {
                var data = item as IDictionary<string, object>;
                int nIndex = 0;

                sensorZoneHistory = new Nipa.Model.Sdms.History.SensorZone();
                sensorZoneHistoryData = new Nipa.Model.Sdms.History.SensorZoneData();

                foreach (KeyValuePair<string, object> pair in data)
                {
                    if (nIndex < nSensorZoneHistoryFieldCount)
                    {
                        ReadSensorZoneHistory(pair.Key, pair.Value, sensorZoneHistory);
                    }
                    else
                    {
                        ReadSensorZoneHistoryData(pair.Key, pair.Value, sensorZoneHistoryData);
                    }

                    nIndex++;
                }

                arrDatas.Add(sensorZoneHistory);
                arrDatas.Add(sensorZoneHistoryData);
            }

            return arrDatas;
        }

        private void ReadSensorZoneHistory(string strFieldName, object value, Nipa.Model.Sdms.History.SensorZone sensorZoneHistory)
        {
            if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.ID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.ID = (int)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.SensorZoneID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.SensorZoneID = (int)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.Data.ToString())
            {
                sensorZoneHistory.Data = (string)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.Time.ToString())
            {
                if (value != null)
                    sensorZoneHistory.Time = (DateTime)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.ZoneID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.ZoneID = (int)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.SensorType.ToString())
            {
                if (value != null)
                    sensorZoneHistory.SensorType = (int)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.DetectionStatus.ToString())
            {
                if (value != null)
                    sensorZoneHistory.DetectionStatus = (int)value;
                else
                    sensorZoneHistory.DetectionStatus = null;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.SiteID.ToString())
            {
                if (value != null)
                    sensorZoneHistory.SiteID = (int)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.AllSensorZoneIDs.ToString())
            {
                sensorZoneHistory.AllSensorZoneIDs = (string)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZone.Fields.Memo.ToString())
            {
                sensorZoneHistory.Memo = (string)value;
            }
        }

        private void ReadSensorZoneHistoryData(string strFieldName, object value, Nipa.Model.Sdms.History.SensorZoneData sensorZoneHistoryData)
        {
            if (strFieldName == Nipa.Model.Sdms.History.SensorZoneData.Fields.SensorZoneHistoryID.ToString())
            {
                if (value != null)
                    sensorZoneHistoryData.SensorZoneHistoryID = (int)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZoneData.Fields.PropertyName.ToString())
            {
                sensorZoneHistoryData.PropertyName = (string)value;
            }
            else if (strFieldName == Nipa.Model.Sdms.History.SensorZoneData.Fields.PropertyValue.ToString())
            {
                sensorZoneHistoryData.PropertyValue = (string)value;
            }
        }

        public bool ReadPrevAlarms()
        {
            // Key : Event ID
            Dictionary<string, WorkerEvent> dicPrevAlarms = ReadAlarms();

            // Key : AP no + EventType
            Dictionary<string, WorkerEvent> dicPrevWorkerEvents = new Dictionary<string, WorkerEvent>();

            foreach (var pair in dicPrevAlarms)
            {
                if (pair.Value.AP != null)
                    dicPrevWorkerEvents[pair.Value.AP.ApNo + pair.Value.WorkerEventType.ToString()] = pair.Value;
            }

            string strErrorMessage;
            IEnumerable<CurrentAlarm> alarms = m_dataManager.GetSelect().Select<CurrentAlarm>(null, out strErrorMessage);

            if (alarms == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadPrevAlarms Fail : " + strErrorMessage);
                return false;
            }

            string strSensorZoneHistoryIDs = "";

            foreach (CurrentAlarm alarm in alarms)
            {
                if (strSensorZoneHistoryIDs.Length == 0)
                    strSensorZoneHistoryIDs = alarm.SensorZoneHistoryID.ToString();
                else
                    strSensorZoneHistoryIDs += "," + alarm.SensorZoneHistoryID.ToString();
            }

            if (strSensorZoneHistoryIDs.Length == 0)
                return true;

            string strConditions = string.Format("{0} in ({1})", Nipa.Model.Sdms.History.SensorZoneData.Fields.SensorZoneHistoryID, strSensorZoneHistoryIDs);
            ArrayList arrDatas = JoinSensorZoneHistorySensorZoneHistoryData(strConditions, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("Read JoinSensorZoneHistorySensorZoneHistoryData Fail : " + strErrorMessage);
                return false;
            }

            int nDataCount = arrDatas.Count;
            Dictionary<int, Nipa.Model.Sdms.History.SensorZoneData> dicSensorZoneHistoryDatas = new Dictionary<int, Nipa.Model.Sdms.History.SensorZoneData>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Nipa.Model.Sdms.History.SensorZone && arrDatas[i + 1] is Nipa.Model.Sdms.History.SensorZoneData)
                {
                    Nipa.Model.Sdms.History.SensorZone sensorZoneHistory = (Nipa.Model.Sdms.History.SensorZone)arrDatas[i];
                    Nipa.Model.Sdms.History.SensorZoneData sensorZoneHistoryData = (Nipa.Model.Sdms.History.SensorZoneData)arrDatas[i + 1];
                    dicSensorZoneHistoryDatas[sensorZoneHistory.SensorZoneID] = sensorZoneHistoryData;
                }
            }

            WorkerEvent workerEvent;
            SensorZoneTag sensorZoneTag;
            int sensorZoneID;

            foreach (CurrentAlarm alarm in alarms)
            {
                string[] strSensorZoneIDs = alarm.AlarmSensorZoneIDs.Split(',');

                foreach (string strSensorZoneID in strSensorZoneIDs)
                {
                    if (int.TryParse(strSensorZoneID.Trim(), out sensorZoneID))
                    {
                        if (m_dicAllSensorZones.TryGetValue(sensorZoneID, out sensorZoneTag))
                        {
                            WorkerEvent.EventType eventType;

                            if (m_dicMaterialWorkerEventType.TryGetValue(sensorZoneTag.SensorZone.SensorType, out eventType) && dicPrevWorkerEvents.TryGetValue(sensorZoneTag.ApNo + eventType.ToString(), out workerEvent))
                            {
                                AlarmSensor alarmSensor = new AlarmSensor(sensorZoneTag, workerEvent);
                                m_dicCurrentAlarms[sensorZoneID] = alarmSensor;

                                Nipa.Model.Sdms.History.SensorZoneData sensorZoneHistoryData;

                                if (dicSensorZoneHistoryDatas.TryGetValue(sensorZoneID, out sensorZoneHistoryData))
                                    alarmSensor.SensorZoneHistoryID = sensorZoneHistoryData.SensorZoneHistoryID;
                            }
                        }
                    }
                }
            }

            return true;
        }

        private string GetEventKey(WorkerEvent workerEvent)
        {
            return workerEvent.WorkerEventType.ToString() + workerEvent.Worker.MacAddress + DateTimeString(workerEvent.TimeStamp);
        }

        public void CheckEvents(List<WorkerEvent> workerEvents)
        {
            List<WorkerEvent> removeWorkerEvents = new List<WorkerEvent>();

            int nEventCount = workerEvents.Count;

            for (int i = nEventCount - 1; i >= 0; i--)
            {
                WorkerEvent workerEvent = workerEvents[i];
                removeWorkerEvents.Add(workerEvent);

                // 이전에 발생했던 알람은 무시한다.
                if (m_dicPrevWorkerEvents.ContainsKey(GetEventKey(workerEvent)))
                    workerEvents.RemoveAt(i);
                else
                    m_dicPrevWorkerEvents[GetEventKey(workerEvent)] = workerEvent;
            }

            // Key : AP No + WorkerEventType
            Dictionary<string, AlarmSensor> dicCurrentAlarmSensorZoneTags = new Dictionary<string, AlarmSensor>();

            foreach (var pair in m_dicCurrentAlarms)
            {
                string strKey = pair.Value.SensorZoneTag.ApNo + GetEventKey(pair.Value.WorkerEvent);//pair.Value.WorkerEvent.WorkerEventType.ToString();
                dicCurrentAlarmSensorZoneTags[strKey] = pair.Value;
            }

            List<AlarmSensor> newAlarmSensorZones = new List<AlarmSensor>();

            foreach (WorkerEvent workerEvent in removeWorkerEvents)
            {
                if (workerEvent.AP == null)
                    continue;

                string strKey = workerEvent.AP.ApNo + GetEventKey(workerEvent);//workerEvent.WorkerEventType.ToString();

                if (dicCurrentAlarmSensorZoneTags.ContainsKey(strKey))
                    dicCurrentAlarmSensorZoneTags.Remove(strKey);
            }

            foreach (WorkerEvent workerEvent in workerEvents)
            {
                if (workerEvent.AP == null)
                    continue;

                string strKey = workerEvent.AP.ApNo + GetEventKey(workerEvent);//workerEvent.WorkerEventType.ToString();

                if (dicCurrentAlarmSensorZoneTags.ContainsKey(strKey) == false)
                {
                    SensorZoneTag sensorZoneTag = GetSensorZoneTag(workerEvent);

                    if (sensorZoneTag != null)
                    {
                        newAlarmSensorZones.Add(new AlarmSensor(sensorZoneTag, workerEvent));
                    }
                }
            }

            RemoveAlarms(dicCurrentAlarmSensorZoneTags.Values);
            SendAlarms(newAlarmSensorZones);
        }

        // SensorZoneHistory 생성후 알람부가정보가 생성되었는지 확인
        private void CheckAlarmData()
        {
            string strSensorZoneIDs = "";
            Dictionary<int, AlarmSensor> dicSensorZoneAlarms = new Dictionary<int, AlarmSensor>();

            foreach (var pair in m_dicCurrentAlarms)
            {
                if (pair.Value.SensorZoneHistoryID < 0)
                {
                    if (strSensorZoneIDs.Length == 0)
                        strSensorZoneIDs = pair.Value.SensorZoneTag.SensorZone.ID.ToString();
                    else
                        strSensorZoneIDs += "," + pair.Value.SensorZoneTag.SensorZone.ID.ToString();

                    dicSensorZoneAlarms[pair.Value.SensorZoneTag.SensorZone.ID] = pair.Value;
                }
            }

            if (strSensorZoneIDs.Length == 0)
                return;

            string strConditions = string.Format("{0} in ({1}) and {2} in (Select {3} from {4})",
                Nipa.Model.Sdms.History.SensorZone.Fields.SensorZoneID,
                strSensorZoneIDs,
                Nipa.Model.Sdms.History.SensorZone.Fields.ID,
                CurrentAlarm.Fields.SensorZoneHistoryID,
                CurrentAlarm.TableName);

            string strErrorMessage;
            IEnumerable<Nipa.Model.Sdms.History.SensorZone> sensorZoneHistories = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.History.SensorZone>(strConditions, out strErrorMessage);

            if (sensorZoneHistories == null)
            {
                System.Diagnostics.Trace.WriteLine("Read SensorZoneHistory Fail : " + strErrorMessage);
                return;
            }

            string strSensorZoneHistoryIDs = "";
            Dictionary<int, Nipa.Model.Sdms.History.SensorZone> dicSensorZoneHistories = new Dictionary<int, Nipa.Model.Sdms.History.SensorZone>();

            foreach (var sensorZoneHistory in sensorZoneHistories)
            {
                if (strSensorZoneHistoryIDs.Length == 0)
                    strSensorZoneHistoryIDs = sensorZoneHistory.ID.ToString();
                else
                    strSensorZoneHistoryIDs += "," + sensorZoneHistory.ID.ToString();

                dicSensorZoneHistories[sensorZoneHistory.ID] = sensorZoneHistory;
            }

            if (strSensorZoneHistoryIDs.Length > 0)
            {
                string strPropertyName = "WorkerTag";
                strConditions = string.Format("{0} in ({1}) and {2} = '{3}'",
                    Nipa.Model.Sdms.History.SensorZoneData.Fields.SensorZoneHistoryID,
                    strSensorZoneHistoryIDs,
                    Nipa.Model.Sdms.History.SensorZoneData.Fields.PropertyName,
                    strPropertyName);

                IEnumerable<Nipa.Model.Sdms.History.SensorZoneData> sensorZoneHistoryDatas = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.History.SensorZoneData>(strConditions, out strErrorMessage);

                if (sensorZoneHistoryDatas == null)
                {
                    System.Diagnostics.Trace.WriteLine("Read SensorZoneData Fail : " + strErrorMessage);
                    return;
                }

                foreach (var sensorZoneHistoryData in sensorZoneHistoryDatas)
                {
                    Nipa.Model.Sdms.History.SensorZone sensorZoneHistory;

                    if (dicSensorZoneHistories.TryGetValue(sensorZoneHistoryData.SensorZoneHistoryID, out sensorZoneHistory))
                    {
                        AlarmSensor alarm;

                        if (dicSensorZoneAlarms.TryGetValue(sensorZoneHistory.SensorZoneID, out alarm))
                        {
                            alarm.SensorZoneHistoryID = sensorZoneHistory.ID;
                            dicSensorZoneHistories.Remove(alarm.SensorZoneHistoryID);
                        }
                    }
                }

                List<Nipa.Model.Sdms.History.SensorZoneData> newSensorZoneHistoryDatas = new List<Nipa.Model.Sdms.History.SensorZoneData>();

                foreach (var pair in dicSensorZoneHistories)
                {
                    AlarmSensor alarm;

                    if (dicSensorZoneAlarms.TryGetValue(pair.Value.SensorZoneID, out alarm))
                    {
                        Nipa.Model.Sdms.History.SensorZoneData sensorZoneData = new Nipa.Model.Sdms.History.SensorZoneData();

                        sensorZoneData.PropertyName = strPropertyName;
                        sensorZoneData.PropertyValue = alarm.WorkerEvent.Worker.DeviceName;
                        sensorZoneData.SensorZoneHistoryID = pair.Value.ID;

                        newSensorZoneHistoryDatas.Add(sensorZoneData);
                    }
                }

                if (newSensorZoneHistoryDatas.Count > 0)
                {
                    if (m_dataManager.GetCreate().Insert<Nipa.Model.Sdms.History.SensorZoneData>(newSensorZoneHistoryDatas, out strErrorMessage) == false)
                    {
                        System.Diagnostics.Trace.WriteLine("Insert SensorZoneHistoryData Fail : " + strErrorMessage);
                        return;
                    }

                    Nipa.Model.Sdms.History.SensorZone sensorZoneHistory;

                    foreach (var sensorZoneHistoryData in newSensorZoneHistoryDatas)
                    {
                        if (dicSensorZoneHistories.TryGetValue(sensorZoneHistoryData.SensorZoneHistoryID, out sensorZoneHistory))
                        {
                            AlarmSensor alarm;

                            if (dicSensorZoneAlarms.TryGetValue(sensorZoneHistory.SensorZoneID, out alarm))
                            {
                                alarm.SensorZoneHistoryID = sensorZoneHistory.ID;
                            }
                        }
                    }
                }
            }
        }

        private void RemoveAlarms(IEnumerable<AlarmSensor> alarmSensorZones)
        {
            foreach (AlarmSensor alarm in alarmSensorZones)
            {
                ArrayList arrDatas = new ArrayList();

                arrDatas.Add(alarm.SensorZoneTag.SensorZone.SensorType);
                arrDatas.Add(alarm.SensorZoneTag.TagInfo.ID);
                arrDatas.Add(alarm.SensorZoneTag.SensorZone.ID);
                arrDatas.Add(false);

                m_sopQueryManager.SendAlarmQuery(arrDatas, "POST");
                m_dicCurrentAlarms.Remove(alarm.SensorZoneTag.SensorZone.ID);
            }
        }

        private void SendAlarms(IEnumerable<AlarmSensor> alarmSensorZones)
        {
            foreach (AlarmSensor alarm in alarmSensorZones)
            {
                ArrayList arrDatas = new ArrayList();

                arrDatas.Add(alarm.SensorZoneTag.SensorZone.SensorType);
                arrDatas.Add(alarm.SensorZoneTag.TagInfo.ID);
                arrDatas.Add(alarm.SensorZoneTag.SensorZone.ID);
                arrDatas.Add(true);

                m_sopQueryManager.SendAlarmQuery(arrDatas, "POST");
                m_dicCurrentAlarms[alarm.SensorZoneTag.SensorZone.ID] = alarm;
            }

            CheckAlarmData();
        }

        private SensorZoneTag GetSensorZoneTag(WorkerEvent workerEvent)
        {
            Dictionary<int, SensorZoneTag> dicSensorZoneTags = GetSensorZoneTagCollection(workerEvent);

            if (dicSensorZoneTags == null)
                return null;

            SensorZoneTag sensorZoneTag;

            if (dicSensorZoneTags.TryGetValue(workerEvent.AP.ApNo, out sensorZoneTag))
                return sensorZoneTag;

            return null;
        }

        private Dictionary<int, SensorZoneTag> GetSensorZoneTagCollection(WorkerEvent workerEvent)
        {
            if (workerEvent.WorkerEventType == WorkerEvent.EventType.EmergencyCall)
                return m_dicEmergencyCallSensorZones;
            else if (workerEvent.WorkerEventType == WorkerEvent.EventType.Collapse)
                return m_dicCollapseSensorZones;
            else if (workerEvent.WorkerEventType == WorkerEvent.EventType.ChangeBattery)
                return m_dicChangeBatterySensorZones;
            else if (workerEvent.WorkerEventType == WorkerEvent.EventType.PairError)
                return m_dicPairSensorZones;
            else if (workerEvent.WorkerEventType == WorkerEvent.EventType.Stuck)
                return m_dicStuckSensorZones;

            return null;
        }
    }
}
