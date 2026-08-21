using System;
using System.Collections.Generic;
using System.Windows.Forms;
using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using HynixAlarmSimulator.Data.ViewModels.Hynix;
using HynixAlarmSimulator.Data.ViewModels.Hynix.History;
using SDMS.Model.Sensor;
using SmartTag = HynixAlarmSimulator.Data.ViewModels.Hynix.SmartTag;

namespace HynixAlarmSimulator.Managers
{
    public class HistoryDataInsertManager
    {
        private DataManager m_dataManager = null;
        private SopQueryManager_Hynix m_sopQueryManager = null;
        
        public HistoryDataInsertManager(DataManager dataManager, SopQueryManager_Hynix sopQueryManager)
        {
            m_dataManager = dataManager;
            m_sopQueryManager = sopQueryManager;
        }

        public bool InsertCardTagHistory(Card card, CardReader cardReader, bool isPermit, bool isEnter, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (card == null || cardReader == null)
            {
                strErrorMessage = "카드 또는 카드 리더 정보가 유효하지 않습니다.";
                return false;
            }
            
            string strQuery = $@"Select ISNULL(MAX({CardTag.Fields.CardTagHistoryID}), 0) as max from {CardTag.TableName}";
            
            IEnumerable<dynamic> maxResult = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
            
            int nMaxID = -1;
            
            foreach (dynamic max in maxResult)
            {
                nMaxID = max.max;
                nMaxID++;
            }
            
            CardTag cardTag = new CardTag()
            {
                CardTagHistoryID = nMaxID,
                Time = DateTime.Now,
                CardID = card.CardID,
                CardReaderID = cardReader.CardReaderID,
                Type = isEnter ? 1 : 0,
                IsApprove = isPermit,
            };

            int nCardSensorZoneID = -1;
            
            string strGetCardSensorZoneIdSql = $@"SELECT ID FROM SdmsSensorZone  WHERE OrgSensorID = {card.CardID} And SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_CardTag}";
            
            IEnumerable<dynamic> sensorZoneResult = m_dataManager.GetSelect().Select(strGetCardSensorZoneIdSql, out strErrorMessage);
            
            if (sensorZoneResult == null)
                return false;
            
            foreach (dynamic sensorZone in sensorZoneResult)
                nCardSensorZoneID = sensorZone.ID;
            
            if (m_dataManager.GetCreate().Insert(cardTag, out strErrorMessage) == false)
            {
                return false;
            }
            
            if (m_sopQueryManager == null || m_sopQueryManager.SendAlarmQuery_HynixTaggin(nCardSensorZoneID, DateTime.Now, cardTag.CardReaderID, null, out strErrorMessage) == false)
            {
                return false;
            }
            
            return true;
        }
        
        public bool InsertSmartTagHistory(SmartTag smartTag, SmartTagReader smartTagReader, out string strErrorMessage)
        {
            strErrorMessage = "";

            int nSensorZone = 0;
            
            string strSmartTagSensorZoneIdSql = $@"Select {SensorZone.Fields.ID} 
                                                    from {SensorZone.TableName} 
                                                    Where {SensorZone.Fields.SensorType} = {(int)AgentFactory.BLL.Facility.FacilityType.Event_SmartTag} 
                                                      And OrgSensorID = {smartTag.SmartTagID}";
            
            IEnumerable<dynamic> sensorZoneResult = m_dataManager.GetSelect().Select(strSmartTagSensorZoneIdSql, out strErrorMessage);

            foreach (dynamic sensorZone in sensorZoneResult)
            {
                nSensorZone = sensorZone.ID;
            }
            
            Data.ViewModels.Hynix.History.SmartTag smartTagHistory = new Data.ViewModels.Hynix.History.SmartTag();
            
            int nMaxID = -1;

            string strGetMaxIdSql = $@"Select ISNULL(MAX({Data.ViewModels.Hynix.History.SmartTag.Fields.SmartTagHistoryID}), 0) as max 
                                        from {Data.ViewModels.Hynix.History.SmartTag.TableName}";
            
            IEnumerable<dynamic> maxResult = m_dataManager.GetSelect().Select(strGetMaxIdSql, out strErrorMessage);
            foreach (dynamic max in maxResult)
                nMaxID = max.max;
            
            smartTagHistory.SmartTagHistoryID = nMaxID + 1;
            smartTagHistory.Time = DateTime.Now;
            smartTagHistory.SmartTagID = smartTag.SmartTagID;
            smartTagHistory.SmartTagReaderID = smartTagReader.SmartTagReaderID;

            if (m_dataManager.GetCreate().Insert(smartTagHistory, out strErrorMessage) == false)
            {
                return false;
            }
            
            if (m_sopQueryManager.SendAlarmQuery_HynixTaggin(nSensorZone, DateTime.Now, null, smartTagReader.SmartTagReaderID, out strErrorMessage) == false)
            {
                return false;
            }

            return true;
        }
        
    }
}