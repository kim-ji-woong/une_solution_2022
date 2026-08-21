using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model.Sdms.Sensor;

namespace IntegrationServer.Servers.Worker.SWayM
{
    using Managers;
    using ViewModels.Worker.SWayM;

    public class WorkerManager : JsonManager
    {
        private const string WorkerCountUrl = "extLink/getStrctPersonList.do";
        private const string WorkerEventUrl = "extLink/getEventList.do";
        private const string ApListUrl = "extLink/getApInfoList.do";
        private const string WorkerTagListUrl = "extLink/getTagInfoList.do";

        private string m_strBaseUrl = "";

        private string m_strPrevEventLog = "";
        private SWaymManager m_owner = null;

        public WorkerManager(string strBaseUrl, SWaymManager owner)
        {
            m_owner = owner;
            m_strBaseUrl = strBaseUrl;
        }

        public List<WorkerEvent> Read(IDataManager dataManager, int siteID)
        {
            Dictionary<string, AP> dicAps = ReadAP();

            if (dicAps == null)
                return null;

            Dictionary<string, Worker> dicWorkers = ReadWorker();

            if (dicWorkers == null)
                return null;

            Dictionary<string, ApWorkers> dicApWorkers = ReadWorkerCount(dicAps, dicWorkers);

            if (dicApWorkers == null)
                return null;

            Dictionary<string, WorkerEvent> dicEvents = ReadWorkerEvent(dicAps, dicWorkers);

            if (dicEvents == null)
                return null;

            string strErrorMessage;

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("BeginBatch Fail : " + strErrorMessage);
                return null;
            }

            if (UpdateApState(dataManager, dicAps, dicApWorkers, siteID, ref strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("UpdateApState Fail : " + strErrorMessage);
                dataManager.BatchRollback(out strErrorMessage);
                return null;
            }

            if (UpdateWorkerState(dataManager, dicWorkers, siteID, ref strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("UpdateWorkerState Fail : " + strErrorMessage);
                dataManager.BatchRollback(out strErrorMessage);
                return null;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                System.Diagnostics.Trace.WriteLine("BatchCommit Fail : " + strErrorMessage);
                dataManager.BatchRollback(out strErrorMessage);
                return null;
            }

            List<WorkerEvent> workerEvents = new List<WorkerEvent>();
            workerEvents.AddRange(dicEvents.Values);
            return workerEvents;
        }

        private bool UpdateWorkerState(IDataManager dataManager, Dictionary<string, Worker> dicWorkers, int siteID, ref string strErrorMessage)
        {
            string strTarget = "작업자_";
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} like '{4}%')",
                EtcData.Fields.SensorID,
                ETC.Fields.ID,
                ETC.TableName,
                ETC.Fields.Name,
                strTarget);
            IEnumerable<EtcData> etcDatas = dataManager.GetSelect().Select<EtcData>(strCondition, out strErrorMessage);

            if (etcDatas == null)
                return false;

            Dictionary<string, Worker> dicCloneWorkers = new Dictionary<string, Worker>();

            foreach (var pair in dicWorkers)
            {
                dicCloneWorkers[pair.Key] = pair.Value;
            }

            // Key : Sensor ID
            Dictionary<int, Worker> dicWorkerSensors = new Dictionary<int, Worker>();

            foreach (EtcData etcData in etcDatas)
            {
                if (etcData.PropertyName.ToLower() == "macaddr")
                {
                    Worker worker = null;

                    if (dicCloneWorkers.TryGetValue(etcData.PropertyValue, out worker) == false)
                    {
                        worker = FirstPopItem<string, Worker>(dicCloneWorkers);

                        if (worker != null)
                        {
                            etcData.PropertyValue = worker.MacAddress;
                            worker.SensorID = etcData.SensorID;
                        }
                    }
                    else
                    {
                        worker.SensorID = etcData.SensorID;
                    }

                    if (worker != null)
                    {
                        dicWorkerSensors[etcData.SensorID] = worker;
                    }
                }
            }

            List<EtcData> workerDatas = new List<EtcData>();

            foreach (var pair in dicWorkerSensors)
            {
                Worker worker = pair.Value;

                if (worker.SensorID > 0)
                {
                    EtcData etcData = new EtcData();

                    etcData.SensorID = worker.SensorID;
                    etcData.PropertyName = "MacAddr";
                    etcData.PropertyValue = worker.MacAddress;
                    etcData.SiteID = siteID;

                    workerDatas.Add(etcData);

                    etcData = new EtcData();

                    etcData.SensorID = worker.SensorID;
                    etcData.PropertyName = "Mapping";
                    etcData.PropertyValue = worker.IsAssign ? "1" : "0";
                    etcData.SiteID = siteID;

                    workerDatas.Add(etcData);

                    etcData = new EtcData();

                    etcData.SensorID = worker.SensorID;
                    etcData.PropertyName = "RegDate";
                    etcData.PropertyValue = string.Format("{0}-{1:00}-{2:00}", worker.CreateTime.Year, worker.CreateTime.Month, worker.CreateTime.Day);
                    etcData.SiteID = siteID;

                    workerDatas.Add(etcData);

                    etcData = new EtcData();

                    etcData.SensorID = worker.SensorID;
                    etcData.PropertyName = "Status";
                    etcData.PropertyValue = worker.State == "정상" ? "Normal" : "Changing";
                    etcData.SiteID = siteID;

                    workerDatas.Add(etcData);
                }
            }

            if (dataManager.GetUpdate().Update<EtcData>(workerDatas, out strErrorMessage) == false)
                return false;

            return true;
        }

        private Value FirstPopItem<Key, Value>(Dictionary<Key, Value> dicDatas) where Value : class
        {
            foreach (var pair in dicDatas)
            {
                dicDatas.Remove(pair.Key);
                return pair.Value;
            }

            return null;
        }

        private bool UpdateApState(IDataManager dataManager, Dictionary<string, AP> dicAps, Dictionary<string, ApWorkers> dicApWorkers, int siteID, ref string strErrorMessage)
        {
            string strCondition = string.Format("{0} like 'AP%'", ETC.Fields.UniqueKey);
            IEnumerable<ETC> etcs = dataManager.GetSelect().Select<ETC>(strCondition, out strErrorMessage);

            if (etcs == null)
                return false;

            Dictionary<string, AP> dicNameAps = new Dictionary<string, AP>();

            foreach (var pair in dicAps)
            {
                dicNameAps[pair.Value.Name] = pair.Value;
            }

            foreach (var ap in etcs)
            {
                AP _ap;

                if (dicNameAps.TryGetValue(ap.UniqueKey, out _ap))
                    _ap.SensorID = ap.ID;
            }

            ApWorkers apWorker;
            List<EtcData> apDatas = new List<EtcData>();

            foreach (var pair in dicAps)
            {
                AP ap = pair.Value;

                if (dicApWorkers.TryGetValue(ap.MacAddress, out apWorker) == false)
                    apWorker = null;

                if (ap.SensorID > 0)
                {
                    EtcData etcData = new EtcData();

                    etcData.SensorID = ap.SensorID;
                    etcData.PropertyName = "MacAddr";
                    etcData.PropertyValue = ap.MacAddress;
                    etcData.SiteID = siteID;

                    apDatas.Add(etcData);

                    etcData = new EtcData();

                    etcData.SensorID = ap.SensorID;
                    etcData.PropertyName = "Mapping";
                    etcData.PropertyValue = ap.IsAssign ? "1" : "0";
                    etcData.SiteID = siteID;

                    apDatas.Add(etcData);

                    etcData = new EtcData();

                    etcData.SensorID = ap.SensorID;
                    etcData.PropertyName = "RegDate";
                    etcData.PropertyValue = string.Format("{0}-{1:00}-{2:00}", ap.CreateTime.Year, ap.CreateTime.Month, ap.CreateTime.Day);
                    etcData.SiteID = siteID;

                    apDatas.Add(etcData);

                    etcData = new EtcData();

                    etcData.SensorID = ap.SensorID;
                    etcData.PropertyName = "Status";
                    etcData.PropertyValue = ap.State == "정상" ? "Normal" : "Changing";
                    etcData.SiteID = siteID;

                    apDatas.Add(etcData);

                    etcData = new EtcData();

                    etcData.SensorID = ap.SensorID;
                    etcData.PropertyName = "WorkerCount";
                    etcData.PropertyValue = apWorker != null ? apWorker.Workers.Count.ToString() : "0";
                    etcData.SiteID = siteID;

                    apDatas.Add(etcData);
                }
            }

            if (dataManager.GetUpdate().Update<EtcData>(apDatas, out strErrorMessage) == false)
                return false;

            return true;
        }

        private Dictionary<string, WorkerEvent> ReadWorkerEvent(Dictionary<string, AP> dicAps, Dictionary<string, Worker> dicWorkers)
        {
            string strErrorMessage;
            string strUrl = m_strBaseUrl.EndsWith("/") ? m_strBaseUrl + WorkerEventUrl : m_strBaseUrl + "/" + WorkerEventUrl;
            JObject json = WebServiceManager.ReadPost(strUrl, out strErrorMessage);

            Dictionary<string, WorkerEvent> dicEvents = new Dictionary<string, WorkerEvent>();

            if (json == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadWorkerEvent Error : " + strErrorMessage);
                return null;
            }
            else
            {
                string strEventLog = json.ToString();

                if (strEventLog != m_strPrevEventLog)
                {
                    m_strPrevEventLog = strEventLog;
                    m_owner.WriteLog(strEventLog);
                }

                JToken tags = json.GetValue("eventList");

                if (tags != null)
                {
                    foreach (JToken tag in tags)
                    {
                        string strEventTime = GetValue(tag, "EVENT_CREATE_DATE");
                        //string strAlarmID = GetValue(tag, "CODE_ID");
                        string strAlarmID = GetValue(tag, "EVT_TYPE");
                        string strEventType = GetValue(tag, "EVENT_TYPE");
                        string strApName = GetValue(tag, "DEVICE_NM");
                        //string strApMcAddr = GetValue(tag, "AP_MAC_ADDRESS");
                        string strWorkerMcAddr = GetValue(tag, "MAC_ADDRESS");

                        if (strEventTime == null || strAlarmID == null || strEventType == null ||
                            strApName == null || strWorkerMcAddr == null)
                            continue;

                        WorkerEvent.EventType eventType = WorkerEvent.ToEventType(strEventType);

                        if (eventType == WorkerEvent.EventType.None)
                            continue;

                        Worker worker;
                        AP ap = GetAP(dicAps, strApName);
                        DateTime dtTimeStamp;

                        if (DateTime.TryParse(strEventTime, out dtTimeStamp) &&
                            ap != null/*dicAps.TryGetValue(strApMcAddr, out ap)*/ &&
                            dicWorkers.TryGetValue(strWorkerMcAddr, out worker))
                        {
                            WorkerEvent workerEvent = new WorkerEvent();

                            workerEvent.AP = ap;
                            workerEvent.Worker = worker;
                            workerEvent.EventID = strAlarmID;
                            workerEvent.TimeStamp = dtTimeStamp;
                            workerEvent.WorkerEventType = eventType;

                            dicEvents[workerEvent.EventID + worker.MacAddress] = workerEvent;
                        }
                    }
                }
            }

            return dicEvents;
        }

        private AP GetAP(Dictionary<string, AP> dicAps, string strApName)
        {
            foreach (KeyValuePair<string, AP> pair in dicAps)
            {
                if (strApName == pair.Value.Name)
                    return pair.Value;
            }

            return null;
        }

        private Dictionary<string, Worker> ReadWorker()
        {
            string strErrorMessage;
            string strUrl = m_strBaseUrl.EndsWith("/") ? m_strBaseUrl + WorkerTagListUrl : m_strBaseUrl + "/" + WorkerTagListUrl;
            JObject json = WebServiceManager.ReadPost(strUrl, out strErrorMessage);

            if (json == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadWorker Error : " + strErrorMessage);
                return null;
            }
            else
            {
                JToken tags = json.GetValue("tagList");

                if (tags != null)
                {
                    Dictionary<string, Worker> dicWorkers = new Dictionary<string, Worker>();

                    foreach (JToken tag in tags)
                    {
                        string strName = GetValue(tag, "unitName");
                        string strState = GetValue(tag, "tagState");
                        string strAssign = GetValue(tag, "assignYn");
                        string strUniqueKey = GetValue(tag, "unitId");
                        string strCreateDate = GetValue(tag, "createDate");
                        string strMcAddr = GetValue(tag, "macAddress");
                        string strDeviceName = GetValue(tag, "deviceNm");

                        if (strName == null || strState == null || strAssign == null ||
                            strUniqueKey == null || strCreateDate == null ||
                            strMcAddr == null || strDeviceName == null)
                            continue;

                        Worker worker = new Worker();

                        DateTime dtCreate;

                        if (DateTime.TryParse(strCreateDate, out dtCreate))
                            worker.CreateTime = dtCreate;
                        else
                            continue;

                        worker.State = strState;
                        worker.Name = strName;
                        worker.IsAssign = strAssign == "Y" || strAssign == "y";
                        worker.UniqueKey = strUniqueKey;
                        worker.MacAddress = strMcAddr;
                        worker.DeviceName = strDeviceName;

                        dicWorkers[worker.MacAddress] = worker;
                    }

                    return dicWorkers;
                }
            }

            return null;
        }

        private Dictionary<string, AP> ReadAP()
        {
            string strErrorMessage;
            string strUrl = m_strBaseUrl.EndsWith("/") ? m_strBaseUrl + ApListUrl : m_strBaseUrl + "/" + ApListUrl;
            JObject json = WebServiceManager.ReadPost(strUrl, out strErrorMessage);

            if (json == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadAP Error : " + strErrorMessage);
                return null;
            }
            else
            {
                JToken tags = json.GetValue("apList");

                if (tags != null)
                {
                    Dictionary<string, AP> dicAps = new Dictionary<string, AP>();

                    foreach (JToken tag in tags)
                    {
                        string strName = GetValue(tag, "ap_name");
                        string strState = GetValue(tag, "ap_state");
                        string strAssign = GetValue(tag, "assign_yn");
                        string strCreateDate = GetValue(tag, "createDate");
                        string strMcAddr = GetValue(tag, "macAddress");

                        if (strName == null || strState == null || strAssign == null ||
                            strCreateDate == null || strMcAddr == null)
                            continue;

                        AP ap = new AP();

                        DateTime dtCreate;

                        if (DateTime.TryParse(strCreateDate, out dtCreate))
                            ap.CreateTime = dtCreate;
                        else
                            continue;

                        ap.State = strState;
                        ap.Name = strName;
                        ap.IsAssign = strAssign == "Y" || strAssign == "y";
                        ap.MacAddress = strMcAddr;
                        ap.SetApNo();

                        dicAps[ap.MacAddress] = ap;
                    }

                    return dicAps;
                }
            }

            return null;
        }

        private Dictionary<string, ApWorkers> ReadWorkerCount(Dictionary<string, AP> dicAps, Dictionary<string, Worker> dicWorkers)
        {
            string strErrorMessage;
            string strUrl = m_strBaseUrl.EndsWith("/") ? m_strBaseUrl + WorkerCountUrl : m_strBaseUrl + "/" + WorkerCountUrl;
            JObject json = WebServiceManager.ReadPost(strUrl, out strErrorMessage);

            if (json == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadWorkerCount Error : " + strErrorMessage);
                return null;
            }
            else
            {
                JToken tags = json.GetValue("list");

                if (tags != null)
                {
                    Dictionary<string, ApWorkers> dicApWorkers = new Dictionary<string, ApWorkers>();

                    foreach (JToken tag in tags)
                    {
                        string strApName = GetValue(tag, "ap_name");
                        string strWorkerUniqueKey = GetValue(tag, "user_seq");
                        string strWorkerName = GetValue(tag, "user_name");
                        string strApMcAddr = GetValue(tag, "ap_mac_address");
                        string strWorkerMcAddr = GetValue(tag, "tag_mac_address");

                        if (strApName == null || strWorkerUniqueKey == null ||
                            strWorkerName == null || strApMcAddr == null ||
                            strWorkerMcAddr == null)
                            continue;

                        ApWorkers apWorkers;

                        if (dicApWorkers.TryGetValue(strApMcAddr, out apWorkers) == false)
                        {
                            AP ap;

                            if (dicAps.TryGetValue(strApMcAddr, out ap) == false)
                            {
                                System.Diagnostics.Trace.WriteLine("ReadWorkerCount Unknown AP MacAddress : " + strApMcAddr);
                                continue;
                            }

                            apWorkers = new ApWorkers();
                            apWorkers.AP = ap;
                            dicApWorkers[strApMcAddr] = apWorkers;
                        }

                        Worker worker;

                        if (dicWorkers.TryGetValue(strWorkerMcAddr, out worker) == false)
                            continue;

                        apWorkers.Workers.Add(worker);
                    }

                    return dicApWorkers;
                }
            }

            return null;
        }
    }
}
