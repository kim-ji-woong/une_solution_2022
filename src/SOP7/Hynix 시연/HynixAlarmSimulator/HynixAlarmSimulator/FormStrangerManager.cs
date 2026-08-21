using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Windows.Forms;
using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using HynixAlarmSimulator.Data.ViewModels.Hynix;

namespace HynixAlarmSimulator
{
    public partial class FormStrangerManager : Form
    {
        private DataManager? m_dataManager;
        private SopQueryManager_Hynix m_sopNewQueryManager;
        private SopQueryManager_Hynix m_sopOldQueryManager;
        
        Dictionary<string, Card> m_dicCard = new Dictionary<string, Card>();
        
        Card? m_SelectedCard;
        
        private Thread m_thread;
        private bool m_bStop = false;
        
        private string m_strAlarmString = "";
        private string m_strAddAlarmString = "";
        
        private Dictionary<string, int> m_dicAlarmInfo = new Dictionary<string, int>(); // OrgSensorName, SensorZoneHistoryID
        private int m_nSelectedSensorZoneHistoryID = -1;
        
        public FormStrangerManager(DataManager? dataManager, string strSOPWebServerURL)
        {
            InitializeComponent();
            
            m_dataManager = dataManager;
            if(strSOPWebServerURL.Contains("127.0.0.1"))
                strSOPWebServerURL = strSOPWebServerURL.Replace("127.0.0.1", "localhost");
            if (strSOPWebServerURL.EndsWith("/") == false)
                strSOPWebServerURL += "/";
            
            string strSopWebServerUrlNew = strSOPWebServerURL + "api/Worker/SendEvent";
            string strSopWebServerUrlOld = strSOPWebServerURL + "api/Worker/AddMovingPosition";
            
            m_sopNewQueryManager = new SopQueryManager_Hynix(strSopWebServerUrlNew);
            m_sopOldQueryManager = new SopQueryManager_Hynix(strSopWebServerUrlOld);

            m_thread = new Thread(WatchAlarmList);
            m_thread.Start();
            
            Init();
        }

        public void Init()
        {
            IEnumerable<Card> cards = m_dataManager.GetSelect().Select<Card>(null, out string strErrorMessage);
            
            if (strErrorMessage != null)
            {
                MessageBox.Show(strErrorMessage);
                return;
            }
            
            Card unknowCard = new Card();
            unknowCard.UniqueKey = "알수없음";
            unknowCard.CardID = 0;
            m_dicCard.Add("알수없음", unknowCard);
            CardList.Items.Add(unknowCard.UniqueKey);
            
            foreach (Card card in cards)
            {
                m_dicCard.Add(card.UniqueKey, card);
                CardList.Items.Add(card.UniqueKey);
            }
        }

        private void WatchAlarmList()
        {

            while (m_bStop == false)
            {
                try
                {
                    string strQuery = $@"SELECT ID, SensorZoneID, AllSensorZoneIDs 
                                            FROM SdmsHistorySensorZone 
                                            Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger}
                                            And ID IN 
                                                (Select SensorZoneHistoryID 
                                                    From SdmsAlarmCurrent 
                                                    Where SensorType in ({(int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger}
                                                                        ,{(int)AgentFactory.BLL.Facility.FacilityType.Event_CardTag})
                                                )
                                            Order By ID Desc";
                    
                    IEnumerable<dynamic> sensorZoneIDsResult = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
                    List<dynamic> sensorZoneIDs = sensorZoneIDsResult.ToList();
                    
                    if (sensorZoneIDs.Any() == false)
                        continue;
                    
                    string strSensorZoneIDs = sensorZoneIDs.Any()
                        ? string.Join(",", sensorZoneIDs.Select(item => item.AllSensorZoneIDs?.ToString() ?? ""))
                        : "";
                    
                    string strQuery2 = $@"SELECT ID, OrgSensorID FROM SdmsSensorZone WHERE ID IN ({strSensorZoneIDs})";
                    
                    IEnumerable<dynamic> sensorZones = m_dataManager.GetSelect().Select(strQuery2, out strErrorMessage);
                    
                    if (sensorZones == null)
                        continue;

                    foreach (dynamic item in sensorZones)
                    {
                        if (m_bStop) break;
                        
                        int nSensorZoneId = item.ID;
                        int? nOrgSensorId = item.OrgSensorID;
                        string strOrgSensorName = GetOrgSensorName(nSensorZoneId, nOrgSensorId);
                        
                        if (strOrgSensorName.Length < 1)
                            continue;
                        
                        if (m_dicAlarmInfo.ContainsKey(strOrgSensorName) == false)
                        {
                            int nSensorZoneHistoryId = GetSensorZoneHistoryID(nSensorZoneId, out strErrorMessage);
                            if (nSensorZoneHistoryId == -1)
                                continue;
                            
                            if (m_dicAlarmInfo.ContainsKey(strOrgSensorName) == false)
                                m_dicAlarmInfo.Add(strOrgSensorName, nSensorZoneHistoryId);
                        }

                        string sensorName = strOrgSensorName;
                        
                        if (EventList.InvokeRequired)
                        {
                            if (EventList.Items.Contains(sensorName) == false)
                                EventList.Invoke(new Action(() => EventList.Items.Add(sensorName)));
                        }
                        else
                        {
                            if (EventList.Items.Contains(sensorName) == false)
                                EventList.Items.Add(sensorName);
                        }
                        

                    }
                }
                catch (Exception ex)
                {
                    string strErrorMessage = "알람 리스트를 불러오는데 실패하였습니다.";
                    
                    if (this.InvokeRequired)
                    {
                        this.Invoke(new Action(() => MessageBox.Show(strErrorMessage + ex.Message)));
                    }
                    else
                    {
                        MessageBox.Show(strErrorMessage + ex.Message);
                    }

                }
                
                Thread.Sleep(1000 * 3);
            }
        }

        private int GetSensorZoneHistoryID(int sensorZoneID, out string strErrorMessage)
        {
            strErrorMessage = string.Empty;

            if (m_dataManager == null)
            {
                strErrorMessage = "DataManager가 초기화되지 않았습니다.";
                return -1;
            }
            
            string strQuery = $@"SELECT ID FROM SdmsHistorySensorZone WHERE SensorZoneID = {sensorZoneID} And SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger} Order By ID Desc";
            
            IEnumerable<dynamic> historySensorZoneResult = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
            
            if (historySensorZoneResult == null)
                return -1;
            
            foreach (dynamic sensorZoneHistory in historySensorZoneResult)
                return sensorZoneHistory.ID;
            
            return -1;
        }

        private string GetOrgSensorName(int sensorZoneID, int? nOrgSensorID)
        {
            if (m_dataManager == null)
                return "";
            
            if (nOrgSensorID == null)
            {
                return "거수자_" + sensorZoneID.ToString();
            }
            
            string strQuery = $@"SELECT UniqueKey FROM HynixCard WHERE CardID = {nOrgSensorID}";
            
            IEnumerable<dynamic> sensorZones = m_dataManager.GetSelect().Select(strQuery, out string strErrorMessage);
            
            if (sensorZones == null)
            {
                MessageBox.Show(strErrorMessage);
                return "";
            }
            
            foreach (dynamic item in sensorZones)
                return item.UniqueKey;
            
            return "";
        }

        private void NewTextBox_TextChanged(object sender, EventArgs e)
        {
            m_strAlarmString = NewTextBox.Text;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            
            ArrayList arrDatas = new ArrayList();  
            int nSensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger;
            int? nSensorZoneID = GetSensorZoneID(out string strErrorMessage);
            int? nTagInfoID = GetTagInfoID(nSensorZoneID, out strErrorMessage);
            int nAlarmLevel = 2;
            DateTime dtTIme = DateTime.Now;
            
            arrDatas.Add(nSensorType);
            arrDatas.Add(nTagInfoID);
            arrDatas.Add(nSensorZoneID);
            arrDatas.Add(true);
            arrDatas.Add(nAlarmLevel);
            arrDatas.Add(dtTIme);
            
            ArrayList arrDatas2 = new ArrayList();
            
            string[] strArr = m_strAlarmString.Split("\r\n");
            foreach (string str in strArr)
            {
                if (str.Length > 0)
                {
                    arrDatas2.Add(DateTime.Now);
                    arrDatas2.Add(str);
                }
            }
            
            if (m_sopNewQueryManager.SendAlarmQuery(arrDatas, "POST", "", arrDatas2) == false)
            {
                MessageBox.Show("알람 전송 실패", "실패", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            MessageBox.Show("알람 전송 성공", "성공", MessageBoxButtons.OK, MessageBoxIcon.Information);
            NewTextBox.Text = "";

        }

        private int? GetSensorZoneID(out string strErrorMessage)
        {
            int? nCardID = m_SelectedCard.CardID;
            
            if (nCardID == 0)
                nCardID = null;

            if (nCardID != null)
            {
                string strQuery = $@"SELECT ID FROM SdmsSensorZone WHERE SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_CardTag} AND OrgSensorID = {nCardID}";
            
                IEnumerable<dynamic> sensorZoneResult = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
                
                if (sensorZoneResult == null)
                    return null;
            
                foreach (dynamic sensorZone in sensorZoneResult)
                    return sensorZone.ID;
            }
            else
            {
                string strHistoryQuery = $@"Select AllSensorZoneIDs From SdmsHistorySensorZone Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger} Order By ID Desc";
                
                IEnumerable<dynamic> sensorZoneResult = m_dataManager.GetSelect().Select(strHistoryQuery, out strErrorMessage);
                
                List<dynamic> sensorZoneList = sensorZoneResult.ToList();

                string strSensorZoneIDs = "";
                
                int nCount = 0;
                
                foreach (dynamic sensorZone in sensorZoneList)
                {
                    strSensorZoneIDs += sensorZone.AllSensorZoneIDs;
                    nCount++;
                    if (nCount < sensorZoneList.Count())
                        strSensorZoneIDs += ",";
                }

                string strQuery;
                
                if (strSensorZoneIDs.Length > 0)
                    strQuery = $@"SELECT ID 
                                    FROM SdmsSensorZone 
                                    Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger}
                                    And ID IN 
                                        (
                                        Select ID 
                                            from SdmsSensorZone 
                                                Where ID NOT IN ({strSensorZoneIDs})
                                                And OrgSensorID is null);";
                else
                    strQuery = $@"SELECT ID FROM SdmsSensorZone Where SensorType = {(int)AgentFactory.BLL.Facility.FacilityType.Event_Stranger} And OrgSensorID is null";
                
                IEnumerable<dynamic> sensorZoneResult2 = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
                if (sensorZoneResult2 == null)
                    return null;
                
                foreach (dynamic sensorZone in sensorZoneResult2)
                    return sensorZone.ID;
                
            }
            
            return null;
        }

        private int? GetTagInfoID(int? nSensorZoneID, out string strErrorMessage)
        {
            string strQuery = $@"Select ID from SdmsSensorTagInfo Where SensorZoneID = {nSensorZoneID}";
            
            IEnumerable<dynamic> sensorTagInfoResult = m_dataManager.GetSelect().Select(strQuery, out strErrorMessage);
            
            if (sensorTagInfoResult == null)
                return null;
            
            foreach (dynamic sensorTagInfo in sensorTagInfoResult)
                return sensorTagInfo.ID;
            
            return null;
        }

        private void CardList_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_SelectedCard = m_dicCard[CardList.SelectedItem.ToString()];
        }

        private void EventList_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_nSelectedSensorZoneHistoryID = m_dicAlarmInfo[EventList.SelectedItem.ToString()];
        }

        private void AddEventText_TextChanged(object sender, EventArgs e)
        {
            m_strAddAlarmString = AddEventText.Text;
        }

        private void AddPositionButton_Click(object sender, EventArgs e)
        {
            if (m_sopOldQueryManager == null)
            {
                MessageBox.Show("SopQeuryManager가 Null입니다.", "에러", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            if (m_nSelectedSensorZoneHistoryID < 1 || m_strAddAlarmString.Length < 1)
            {
                MessageBox.Show("잘못된 알람 Parameter입니다.", "에러", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            if (m_sopOldQueryManager.SendAlarmQuery_HynixMovingPosition(m_nSelectedSensorZoneHistoryID, DateTime.Now, m_strAddAlarmString, out string strErrorMessage, "") == false)
            {
                MessageBox.Show("알람 수정에 실패하였습니다.", "에러", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }
            
            MessageBox.Show("알람 수정에 성공하였습니다.", "성공", MessageBoxButtons.OK, MessageBoxIcon.Information);
            AddEventText.Text = "";
        }
        
        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            m_bStop = true; // 스레드 종료 신호
            
            if (m_thread.IsAlive)
            {
                m_thread.Join(5000); // 최대 5초 대기
            }
            
            base.OnFormClosing(e);
        }

    }
}