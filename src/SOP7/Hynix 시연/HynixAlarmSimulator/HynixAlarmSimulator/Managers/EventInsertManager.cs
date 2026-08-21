using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using HynixAlarmSimulator.Data.ViewModels.Hynix;
using HynixAlarmSimulator.Data.ViewModels.Hynix.History;

namespace HynixAlarmSimulator.Managers
{
    public class EventInsertManager
    {
        private DataManager m_dataManager = null;

        private string m_strSOPWebServerURL = "";
        
        private List<Worker> m_listWorker = new List<Worker>();
        private List<Card> m_listCard = new List<Card>();
        private List<CardReader> m_listCardReader = new List<CardReader>();
        
        private SopQueryManager_Hynix sopSendEventQueryManager = null;
        private SopQueryManager_Hynix sopSendTaggingQueryManager = null;
        private SopQueryManager_Hynix sopSendAddMovingPositionQueryManager = null;
        
        public EventInsertManager(DataManager dataManager, string strSOPWebServerURL)
        {
            m_dataManager = dataManager;
            m_strSOPWebServerURL = strSOPWebServerURL;
            
            if (m_strSOPWebServerURL.Contains("127.0.0.1"))
                m_strSOPWebServerURL = m_strSOPWebServerURL.Replace("127.0.0.1", "localhost");
            
            if (m_strSOPWebServerURL.EndsWith("/") == false)
                m_strSOPWebServerURL += "/";
            
            string sopSendEventQueryManagerUrl = m_strSOPWebServerURL + "api/Worker/SendEvent";
            string sopSendTaggingQueryManagerUrl = m_strSOPWebServerURL + "api/Worker/SendTagging";
            string sopSendAddMovingPositionQueryManagerUrl = m_strSOPWebServerURL + "api/Worker/AddMovingPosition";
            
            sopSendEventQueryManager = new SopQueryManager_Hynix(sopSendEventQueryManagerUrl);
            sopSendTaggingQueryManager = new SopQueryManager_Hynix(sopSendTaggingQueryManagerUrl);
            sopSendAddMovingPositionQueryManager = new SopQueryManager_Hynix(sopSendAddMovingPositionQueryManagerUrl);
            Init();
        }
        
        private List<DataType> ToList<DataType>(IEnumerable<DataType> collections)
        {
            List<DataType> datas = new List<DataType>();
            datas.AddRange(collections);
            return datas;
        }
        
        private void Init()
        {
            IEnumerable<Worker> workers = m_dataManager.GetSelect().Select<Worker>(null, out string strErrorMessage);
            if (workers == null)
                return;
            m_listWorker = ToList(workers);
            
            IEnumerable<Card> cards = m_dataManager.GetSelect().Select<Card>(null, out strErrorMessage);
            if (cards == null)
                return;
            m_listCard = ToList(cards);

            IEnumerable<CardReader> cardReaders = m_dataManager.GetSelect().Select<CardReader>(null, out strErrorMessage);
            if (cardReaders == null)
                return;
            m_listCardReader = ToList(cardReaders);
        }

        public bool InsertForcedOpen()
        {
            if (m_listWorker.Count == 0 || m_listCard.Count == 0 || m_listCardReader.Count == 0)
                return false;

            string strErrorMessage;

            string strQuery = $@"SELECT 
                                    sz.ID AS SensorZoneID,
                                    sti.ID AS SensorTagInfoID
                                FROM HynixCardReader hcr
                                INNER JOIN SdmsSensorZone sz ON hcr.CardReaderID = sz.OrgSensorID 
                                    AND sz.SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_CardReader}
                                INNER JOIN SdmsSensorTagInfo sti ON sz.ID = sti.SensorZoneID
                                WHERE hcr.CardReaderID = 1
                                ";
            
            // Send Signal
            ArrayList arrDatas = new ArrayList();
            int nTagID = -1;
            int nSensorZoneID = -1;
            bool bIsAlarm = true; // 고정값
            DateTime dtTIme = DateTime.Now;
            
            IEnumerable<dynamic> sensorInfoResult = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
            foreach (dynamic sensorInfo in sensorInfoResult)
            {   
                nSensorZoneID = sensorInfo.SensorZoneID;
                nTagID = sensorInfo.SensorTagInfoID;
            }
            
            int nSensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_ForcedDoorOpen;
            
            arrDatas.Add(nSensorType);
            arrDatas.Add(nTagID);
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(bIsAlarm);
            arrDatas.Add(2);
            arrDatas.Add(dtTIme);

            if (sopSendEventQueryManager.SendAlarmQuery(arrDatas, "POST", "", null) == false)
            {
                return false;
            }
            
            return true;
        }

        public bool InsertDeputy()
        {
            return true;
        }

        public bool InsertTail()
        {
            return true;
        }
        
        public bool InsertStealing()
        {
            return true;
        }

        public bool InsertStranger()
        {
            return true;
        }

        public bool InsertDetour()
        {
            return true;
        }

        public bool InsertUnauthorizedEntry()
        {
            return true;
        }

        public bool InsertUnauthorizedStuff()
        {
            return true;
        }
    }
}