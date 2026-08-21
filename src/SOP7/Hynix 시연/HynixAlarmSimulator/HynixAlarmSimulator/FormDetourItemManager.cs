using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using HynixAlarmSimulator.Data.ViewModels.Hynix;
using HynixAlarmSimulator.Data.ViewModels.Hynix.History;

namespace HynixAlarmSimulator
{
    public partial class FormDetourItemManager : Form
    {
        private string m_strSOPWebServerURL;
        private DataManager? m_dataManager = null;
        private SopQueryManager_Hynix m_sopQueryManager;
        
        private Dictionary<string, Card> m_dicCard = new Dictionary<string, Card>();
        private Card m_SelectedCard = null;
        private string m_strItemName;
        
        public FormDetourItemManager(DataManager? dataManager, string strSOPWebServerURL)
        {
            m_dataManager = dataManager;
            if (strSOPWebServerURL.Contains("127.0.0.1"))
                strSOPWebServerURL = strSOPWebServerURL.Replace("127.0.0.1", "localhost");
            
            if (strSOPWebServerURL.EndsWith("/") == false)
                strSOPWebServerURL += "/";
            
            m_strSOPWebServerURL = strSOPWebServerURL + "api/Worker/SendEvent";
            
            m_sopQueryManager = new SopQueryManager_Hynix(m_strSOPWebServerURL);
            
            InitializeComponent();
            
            Init();
        }

        public void Init()
        {
            string strErrorMessage = "";
            
            IEnumerable<Card> cards = m_dataManager.GetSelect().Select<Card>(null, out strErrorMessage);
            
            if (strErrorMessage != null)
            {
                MessageBox.Show(strErrorMessage);
                return;
            }
            
            Card unknowCard = new Card();
            
            unknowCard.CardID = 0;
            unknowCard.UniqueKey = "알수없음";
            unknowCard.WorkerID = 0;
            
            m_dicCard.Add(unknowCard.UniqueKey, unknowCard);
            
            CardListBox.Items.Add(unknowCard.UniqueKey);
            
            foreach (Card card in cards)
            {
                m_dicCard.Add(card.UniqueKey, card);
                CardListBox.Items.Add(card.UniqueKey);
            }
            
        }


        private void CardListBox_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_SelectedCard = m_dicCard[CardListBox.SelectedItem.ToString()];
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {
            m_strItemName = ItemNameTextBox.Text;
        }

        private void AddEventButton_Click(object sender, EventArgs e)
        {
            string itemName;
            if (m_strItemName == "")
                itemName = "미상";
            else 
                itemName = m_strItemName;

            if (m_SelectedCard.UniqueKey == "알수없음")
            {
                int nSensorZoneID = 0;
                
                string strHistoryQuery = $@"Select AllSensorZoneIDs From SdmsHistorySensorZone Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_EvasionItem}";
                
                IEnumerable<dynamic> sensorZoneResult = m_dataManager.GetSelect().Select(strHistoryQuery, out string strErrorMessage);
                if (sensorZoneResult == null)
                    return;
                
                List<string> listSensorZoneIDs = new List<string>();
                
                foreach (dynamic sensorZone in sensorZoneResult)
                    listSensorZoneIDs.Add(sensorZone.AllSensorZoneIDs.ToString());
                
                string strSensorZoneIDs = "";
                
                if (listSensorZoneIDs.Count > 0)
                    strSensorZoneIDs = string.Join(",", listSensorZoneIDs);

                string strQuery = "";
                if (strSensorZoneIDs == "")
                {
                    strQuery = $@"Select ID From SdmsSensorZone 
                                    Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_EvasionItem}
                                    AND OrgSensorID is null
                                    ";
                }
                else
                {
                    strQuery = $@"Select ID From SdmsSensorZone 
                                    Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_EvasionItem}
                                    AND ID NOT IN ({strSensorZoneIDs})
                                    AND OrgSensorID is null
                                    ";
                }
                
                IEnumerable<dynamic> sensorZoneResult2 = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
                
                if (sensorZoneResult2 == null)
                    return;
                
                foreach (dynamic sensorZone in sensorZoneResult2)
                {
                    nSensorZoneID = sensorZone.ID;
                    break;
                }

                int nSensorTagInfoID = 0;
                
                string strQuery3 = $@"Select ID From SdmsSensorTagInfo Where SensorZoneID = {nSensorZoneID}";
                
                IEnumerable<dynamic> sensorTagInfoResult = m_dataManager.GetSelect().Select(strQuery3, out strErrorMessage);
                
                if (sensorTagInfoResult == null)
                    return;
                
                foreach (dynamic sensorTagInfo in sensorTagInfoResult)
                {
                    nSensorTagInfoID = sensorTagInfo.ID;
                    break;
                }
                
                int nSensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_EvasionItem;

                int nAlarmLevel = 2;
                
                DateTime dtTIme = DateTime.Now;
                
                ArrayList arrDatas = new ArrayList();
                arrDatas.Add(nSensorType);
                arrDatas.Add(nSensorTagInfoID);
                arrDatas.Add(nSensorZoneID);
                arrDatas.Add(true);
                arrDatas.Add(nAlarmLevel);
                arrDatas.Add(dtTIme);
                
                ArrayList arrDatas2 = new ArrayList();
                arrDatas2.Add(itemName);

                if (m_sopQueryManager.SendAlarmQuery_Hynix(arrDatas, "POST", out strErrorMessage, "", arrDatas2) == false)
                {
                    MessageBox.Show("알람 발송에 실패하였습니다. : " + strErrorMessage);
                    return;
                }

            }
            else
            {
                
                List<int> cardTagIds = new List<int>();
                string strCardReaderQuery = $@"Select CardReaderID From HynixCardReader";
                IEnumerable<dynamic> cardReaderResult = m_dataManager.GetSelect().Select(strCardReaderQuery, out string strErrorMessage);
                
                List<dynamic> cardReaderList = cardReaderResult.ToList();
                if (cardReaderList.Any())
                {
                    foreach (dynamic cardReader in cardReaderList)
                    {
                        cardTagIds.Add(cardReader.CardReaderID);
                    }
                }
                    
                int nSensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_EvasionItem;
                
                int nAlarmLevel = 2;
                
                int nSensorZoneID = 0;
                
                string strQuery = $@"Select ID From SdmsSensorZone Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_CardTag} And OrgSensorID = {m_SelectedCard.CardID}";
                
                IEnumerable<dynamic> sensorZoneResult = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
                
                if (sensorZoneResult == null)
                    return;
                
                foreach (dynamic sensorZone in sensorZoneResult)
                    nSensorZoneID = sensorZone.ID;
                
                int nSensorTagInfoID = 0;
                
                string strQuery2 = $@"Select ID From SdmsSensorTagInfo Where SensorZoneID = {nSensorZoneID}";
                
                IEnumerable<dynamic> sensorTagInfoResult = m_dataManager.GetSelect().Select(strQuery2, out strErrorMessage);
                
                if (sensorTagInfoResult == null)
                    return;
                
                foreach (dynamic sensorTagInfo in sensorTagInfoResult)
                    nSensorTagInfoID = sensorTagInfo.ID;
                
                DateTime dtTIme = DateTime.Now;
                
                ArrayList arrDatas = new ArrayList();
                arrDatas.Add(nSensorType);
                arrDatas.Add(nSensorTagInfoID);
                arrDatas.Add(nSensorZoneID);
                arrDatas.Add(true);
                arrDatas.Add(nAlarmLevel);
                arrDatas.Add(dtTIme);
                
                ArrayList arrDatas2 = new ArrayList();
                arrDatas2.Add(itemName);

                if (m_sopQueryManager.SendAlarmQuery_Hynix(arrDatas, "POST", out strErrorMessage, "", arrDatas2) == false)
                {
                    MessageBox.Show("알람 전송 실패 : " + strErrorMessage, "에러", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                int nMaxID = 0;
                string strQuery3 = $@"Select MAX(CardTagHistoryID) as MaxID From HynixCardTagHistory";
                IEnumerable<dynamic> cardTagHistoryResult = m_dataManager.GetSelect().Select(strQuery3, out strErrorMessage);
                if (cardTagHistoryResult == null)
                    return;
                foreach (dynamic cardTagHistory in cardTagHistoryResult)
                    nMaxID = cardTagHistory.MaxID;

                CardTag tagHistory = new CardTag();
                tagHistory.CardID = m_SelectedCard.CardID;
                if (cardReaderList.Count > 0)
                    tagHistory.CardReaderID = cardReaderList[new Random().Next(0, cardReaderList.Count)].CardReaderID;
                else
                    return;
                tagHistory.CardTagHistoryID = nMaxID + 1;
                tagHistory.IsApprove = true;
                tagHistory.Type = 1;
                tagHistory.Time = dtTIme;

                if (m_dataManager.GetCreate().Insert<CardTag>(tagHistory, out strErrorMessage) == false)
                {
                    MessageBox.Show("카드 태그 이력 추가에 실패하였습니다. : " + strErrorMessage, "에러", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                
                MessageBox.Show("이벤트 생성 성공", "알림", MessageBoxButtons.OK, MessageBoxIcon.Information);
                
            }
                
            
        }
    }
}