using System;
using static dnsSopID.ID;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using System.Threading;
using Nipa.Model.Sdms.Sensor;

namespace IntegrationServer.Servers.Door.DDS
{
    using ViewModels.Door;
    using ViewModels.Option;
    using Datas;
    using ViewModels.Sdms.Sensor;

    class DoorManager : IServer
    {
        public enum DoorStatus { Opened = 0, Closed = 1 };

        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;

        private IDataManager m_dataManager = null;
        private IDataManager m_externalDataManager = null;
        private bool m_runThread = false;

        // Key : amadeus5 Outputs.ID
        // Value : OwnDB SdmsSensorETC.ID
        //private Dictionary<int, int> m_dicGateExternalLinks = new Dictionary<int, int>();

        public Logger Logger { get; set; }

        public int ServerSeqNo
        {
            get
            {
                return m_nServerSeqNo;
            }
        }

        public ServerTypes ServerType
        {
            get
            {
                return ServerTypes.Door_DDS;
            }
        }

        public bool IsConnected
        {
            get
            {
                return false;
            }
        }

        private int m_nSiteID = -1;

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public DoorManager(ServerManager serverManager, IDataManager dataManager, int nServerSeqNo, int nSiteID, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_strServerAlias = strServerAlias;

            m_nSiteID = nSiteID;
            m_dataManager = dataManager;

            //ReadGateExternalLinks();
        }

        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public void Start()
        {
            Thread t = new Thread(new ThreadStart(MonitoringThread));
            t.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        /*private void ReadGateExternalLinks()
        {
            string strErrorMessage;
            IEnumerable<GateExternalLink> links = m_dataManager.GetSelect().Select<GateExternalLink>(null, out strErrorMessage);

            if (links == null)
            {
                WriteLog("Read GateExternalLink Fail : " + strErrorMessage);
                return;
            }

            m_dicGateExternalLinks.Clear();

            foreach (var link in links)
            {
                m_dicGateExternalLinks[link.GateID] = link.EtcSensorID;
            }
        }*/

        private void MonitoringThread(/*object args*/)
        {
            if (m_runThread)
                return;

            m_runThread = true;

            if (ReadExternalDBOptions() == false)
            {
                m_runThread = false;
                return;
            }

            List<string> offGateNames = new List<string>();

            while (m_runThread)
            {
                try
                {
                    offGateNames.Clear();

                    if (ReadExternalGate(offGateNames))
                    {
                        UpdateOwnDB(offGateNames);
                    }

                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    WriteLog("[ERROR] MonitoringThread() : " + e.Message);
                    System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);
                }
            }
        }

        private bool UpdateOwnDB(List<string> offGateNames)
        {
            string strErrorMessage;

            if (offGateNames.Count == 0)
            {
                Dictionary<EtcSensor.Fields, object> dicSets = new Dictionary<EtcSensor.Fields, object>();
                dicSets[EtcSensor.Fields.Status] = null;

                string strCondition = string.Format("{0} = {1} and {2} = {3}", EtcSensor.Fields.SiteID, m_nSiteID, EtcSensor.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.DOOR);

                if (m_dataManager.GetUpdate().Update<EtcSensor, EtcSensor.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                {
                    WriteLog("Update EtcSensor Error : " + strErrorMessage);
                    return false;
                }
            }
            else
            {
                Dictionary<EtcSensor.Fields, object> dicSets = new Dictionary<EtcSensor.Fields, object>();
                dicSets[EtcSensor.Fields.Status] = (int)DoorStatus.Closed;

                string strKeys = null;

                foreach (string gateName in offGateNames)
                {
                    if (strKeys == null)
                        strKeys = "'" + gateName + "'";
                    else
                        strKeys += ", '" + gateName + "'";
                }

                string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} in ({5})",
                    EtcSensor.Fields.SiteID, m_nSiteID, 
                    EtcSensor.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.DOOR,
                    EtcSensor.Fields.UniqueKey, strKeys);

                if (m_dataManager.GetUpdate().Update<EtcSensor, EtcSensor.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                {
                    WriteLog("Update EtcSensor1 Error : " + strErrorMessage);
                    return false;
                }

                dicSets[EtcSensor.Fields.Status] = null;

                strCondition = string.Format("{0} = {1} and {2} = {3} and {4} not in ({5})",
                    EtcSensor.Fields.SiteID, m_nSiteID,
                    EtcSensor.Fields.MaterialType, (int)dnsData.Sensor.Facility.FacilityType.DOOR,
                    EtcSensor.Fields.UniqueKey, strKeys);

                if (m_dataManager.GetUpdate().Update<EtcSensor, EtcSensor.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                {
                    WriteLog("Update EtcSensor2 Error : " + strErrorMessage);
                    return false;
                }
            }

            /*List<int> offIDs = new List<int>();

            foreach (int externalID in offGateIDs)
            {
                int ID;

                if (m_dicGateExternalLinks.TryGetValue(externalID, out ID))
                    offIDs.Add(ID);
            }

            if (offIDs.Count > 0)
            {
                Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
                dicSets[ETC.Fields.Status] = (int)DoorStatus.Closed;

                string strConditions = string.Format("ID in ({0})", string.Join(',', offIDs.ToArray()));

                if (m_dataManager.GetUpdate().Update<ETC, ETC.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                {
                    WriteLog("Update ETC Error : " + strErrorMessage);
                    return false;
                }

                dicSets[ETC.Fields.Status] = null;

                strConditions = string.Format("ID not in ({0})", string.Join(',', offIDs.ToArray()));

                if (m_dataManager.GetUpdate().Update<ETC, ETC.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                {
                    WriteLog("Update ETC Error : " + strErrorMessage);
                    return false;
                }
            }
            else
            {
                Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
                dicSets[ETC.Fields.Status] = null;

                if (m_dataManager.GetUpdate().Update<ETC, ETC.Fields>(dicSets, null, out strErrorMessage) == false)
                {
                    WriteLog("Update ETC Error : " + strErrorMessage);
                    return false;
                }
            }*/

            return true;
        }

        private bool ReadExternalDBOptions()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 'ExternalGateDB' and {1} = {2}", OptionSDMS.Fields.PropertyName, OptionSDMS.Fields.SiteID, m_nSiteID);
            OptionSDMS option = m_dataManager.GetSelect().SelectFirst<OptionSDMS>(strCondition, out strErrorMessage);

            if (option == null || option.PropertyValue == null)
            {
                if (strErrorMessage != null)
                    WriteLog("Read OptionSDMS Error : " + strErrorMessage, LogTypes.Error);
                else
                    WriteLog("OptionSDMS에 ExternalGateDB가 존재하지 않습니다.", LogTypes.Error);

                return false;
            }

            string[] tokens = option.PropertyValue.Split(',');

            if (tokens.Length >= 4)
            {
                string strIP = tokens[0].Trim();
                string strDbName = tokens[1].Trim();
                string strID = tokens[2].Trim();
                string strPW = tokens[3].Trim();

                if (tokens.Length >= 6)
                {
                    string strType = tokens[4].Trim();
                    string strPort = tokens[5].Trim();

                    int dbType, port;

                    if (int.TryParse(strType, out dbType) && int.TryParse(strPort, out port))
                        m_externalDataManager = new DataManager(dbType, strIP, strDbName, strID, strPW, port);
                    else
                        m_externalDataManager = new DataManager(0, strIP, strDbName, strID, strPW);
                }
                else
                    m_externalDataManager = new DataManager(0, strIP, strDbName, strID, strPW);

                return true;
            }

            return false;
        }

        private bool ReadExternalGate(List<string> offGateNames)
        {
            // 출입문이 닫혀있는것만 얻어온다.(7 : 계속 Off)
            string strSQL = "Select Name from Output where Actual_mode = 7";

            string strErrorMessage;
            IEnumerable<dynamic> results = m_externalDataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
            {
                WriteLog("Read Output Error : " + strErrorMessage);
                return false;
            }

            foreach (var item in results)
            {
                string strGateName = item.Name;
                offGateNames.Add(strGateName);
            }

            return true;
        }

        private void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }
}
