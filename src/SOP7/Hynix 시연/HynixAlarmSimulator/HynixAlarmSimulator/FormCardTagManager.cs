
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using dnsCommunicateSopServer_Hynix;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using HynixAlarmSimulator.Data.ViewModels.Hynix;
using HynixAlarmSimulator.Managers;

namespace HynixAlarmSimulator
{
    public partial class ExternalControllerForm : Form
    {
        private DataManager? m_dataManager = null;
        private HistoryDataInsertManager m_historyDataInsertManager = null;
        private SopQueryManager_Hynix m_sopQueryManager = null;
        
        private Dictionary<string, Card> m_dicCardList = new Dictionary<string, Card>();
        private Dictionary<string, CardReader> m_dicCardReaderList = new Dictionary<string, CardReader>();
        
        private Card m_SelectedCard = null;
        private CardReader m_SelectedCardReader = null;
        private bool m_IsPermit = true;
        private bool m_IsEnter = true;
        
        private string m_strSOPWebServerURL = null;
        
        public ExternalControllerForm(DataManager? dataManager, string strSOPWebServerURL)
        {
            if (strSOPWebServerURL.Contains("127.0.0.1"))
                strSOPWebServerURL = strSOPWebServerURL.Replace("127.0.0.1", "localhost");
            
            if (strSOPWebServerURL.EndsWith("/") == false)
                strSOPWebServerURL += "/";
            
            strSOPWebServerURL += "api/Worker/SendTagging";
            
            m_dataManager = dataManager;
            m_strSOPWebServerURL = strSOPWebServerURL;
            m_sopQueryManager = new SopQueryManager_Hynix(m_strSOPWebServerURL);
            m_historyDataInsertManager = new HistoryDataInsertManager(dataManager, m_sopQueryManager);
            InitializeComponent();
            InitializeExternalController();
            Init();
        }
        
        private void Init()
        {
            IEnumerable<Card> cards = m_dataManager.GetSelect().Select<Card>(null, out string strErrorMessage);
            if (cards == null)
            {
                MessageBox.Show("카드 데이터를 가져오는데 실패했습니다.");
                return;
            }

            foreach (Card card in cards)
            {
                m_dicCardList.Add(card.UniqueKey, card);
                CardList.Items.Add(card.UniqueKey);
            }
            
            IEnumerable<CardReader> cardReaders = m_dataManager.GetSelect().Select<CardReader>(null, out strErrorMessage);
            if (cardReaders == null)
            {
                MessageBox.Show("카드 리더 데이터를 가져오는데 실패했습니다.");
                return;
            }

            foreach (CardReader cardReader in cardReaders)
            {
                m_dicCardReaderList.Add(cardReader.UniqueKey, cardReader);
                CardReaderList.Items.Add(cardReader.UniqueKey);
            }
            
            InsertButton.Enabled = true;
        }
        
        private void InitializeExternalController()
        {
            
        }
        
        private void ExternalControllerForm_Load(object sender, EventArgs e)
        {
            
        }

        private void ExternalControllerForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            
        }

        private void CardList_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_SelectedCard = m_dicCardList[CardList.SelectedItem.ToString()];
            CardList.SelectedItem = m_SelectedCard;
        }

        private void CardReaderList_SelectedIndexChanged(object sender, EventArgs e)
        {
            m_SelectedCardReader = m_dicCardReaderList[CardReaderList.SelectedItem.ToString()];
            CardReaderList.SelectedItem = m_SelectedCardReader;
        }

        private void RefuseRadio_CheckedChanged(object sender, EventArgs e)
        {
            if (RefuseRadio.Checked == true)
                m_IsPermit = false;
        }

        private void PermitRadio_CheckedChanged(object sender, EventArgs e)
        {
            if (PermitRadio.Checked == true)
                m_IsPermit = true;
        }

        private void InsertButton_Click(object sender, EventArgs e)
        {
            if (m_historyDataInsertManager.InsertCardTagHistory(m_SelectedCard, m_SelectedCardReader, m_IsPermit, m_IsEnter, out string strErrorMessage) == false)
            {
                MessageBox.Show($@"데이터 추가에 실패했습니다. : {strErrorMessage}", "오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void EnterRadio_CheckedChanged(object sender, EventArgs e)
        {
            if (EnterRadio.Checked == true)
                m_IsEnter = true;
        }

        private void ExitRadio_CheckedChanged(object sender, EventArgs e)
        {
            if (ExitRadio.Checked == true)
                m_IsEnter = false;
        }
    }
}
