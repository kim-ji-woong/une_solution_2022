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
    public partial class FormSmartTagManager : Form
    {
        
        private readonly DataManager? m_dataManager;
        private readonly SopQueryManager_Hynix m_sopQueryManager;
        private HistoryDataInsertManager m_historyDataInsertManager;
        
        private Dictionary<string, SmartTag> m_dicWorkerSmartTag = new Dictionary<string, SmartTag>();
        private Dictionary<string, SmartTag> m_dicItemSmartTag = new Dictionary<string, SmartTag>();
        private Dictionary<string, SmartTagReader> m_dicSmartTagReader = new Dictionary<string, SmartTagReader>();
        
        private SmartTag? m_SelectedSmartTag;
        private SmartTagReader? m_SelectedSmartTagReader;
        private Dictionary<int, string> m_dicTagIdTagName = new Dictionary<int, string>();
        
        private bool? m_bIsWorker;
        
        private string? m_strSOPWebServerURL;
        
        public FormSmartTagManager(DataManager? dataManager, string strSOPWebServerURL)
        {
            m_dataManager = dataManager;
            
            if (strSOPWebServerURL.Contains("127.0.0.1"))
                strSOPWebServerURL = strSOPWebServerURL.Replace("127.0.0.1", "localhost");
            
            if (strSOPWebServerURL.EndsWith("/") == false)
                strSOPWebServerURL += "/";
            
            m_strSOPWebServerURL = strSOPWebServerURL + "api/Worker/SendTagging";
            
            m_sopQueryManager = new SopQueryManager_Hynix(m_strSOPWebServerURL);
            
            m_historyDataInsertManager = new HistoryDataInsertManager(dataManager, m_sopQueryManager);
            
            InitializeComponent();

            Init();
        }
        
        private void Init()
        {
            string strErrorMessage;
            
            IEnumerable<SmartTag> smartTags = m_dataManager.GetSelect().Select<SmartTag>(null, out strErrorMessage);
            IEnumerable<Item> items = m_dataManager.GetSelect().Select<Item>(null, out strErrorMessage);
            IEnumerable<Worker> workers = m_dataManager.GetSelect().Select<Worker>(null, out strErrorMessage);
            
            if (strErrorMessage != null && strErrorMessage.Length > 0)
                ResultLabel.Text = $@"SmartTag, HynixItem, Worker 정보를 가져올 수 없습니다. {strErrorMessage}";
            
            List<SmartTag> smartTagList = smartTags.ToList();
            List<Item> itemList = items.ToList();
            List<Worker> workerList = workers.ToList();
            
            foreach (SmartTag smartTag in smartTagList)
            {
                if (smartTag.WorkerID != null)
                {
                    string strWorkerName = workerList.FirstOrDefault(x => x.WorkerID == smartTag.WorkerID)?.Name ?? "Unknown_" + smartTag.WorkerID;
                    m_dicWorkerSmartTag.Add(strWorkerName, smartTag);
                }
                else
                {
                    string strItemName = itemList.FirstOrDefault(x => x.ItemID == smartTag.ItemID)?.Name ?? "Unknown_" + smartTag.ItemID;
                    m_dicItemSmartTag.Add(strItemName, smartTag);
                }
            }
            
            IEnumerable<SmartTagReader> smartTagReaders = m_dataManager.GetSelect().Select<SmartTagReader>(null, out strErrorMessage);

            if (smartTagReaders == null)
            {
                ResultLabel.Text = $@"SmartTagReader 정보를 가져올 수 없습니다. {strErrorMessage}";
                return;
            }

            foreach (SmartTagReader smartTagReader in smartTagReaders)
            {
                m_dicSmartTagReader.Add(smartTagReader.UniqueKey, smartTagReader);
                TagReaderList.Items.Add(smartTagReader.UniqueKey);
            }
        }

        private void WorkerRadioButton_CheckedChanged(object sender, EventArgs e)
        {
            if (WorkerRadioButton.Checked)
            {
                TagList.Items.Clear();
                
                m_bIsWorker = true;
                
                foreach (KeyValuePair<string, SmartTag> pair in m_dicWorkerSmartTag)
                {
                    TagList.Items.Add(pair.Key);
                }
            }
        }

        private void ItemRadioButton_CheckedChanged(object sender, EventArgs e)
        {
            if (ItemRadioButton.Checked)
            {
                TagList.Items.Clear();
                
                m_bIsWorker = false;
                
                foreach (KeyValuePair<string, SmartTag> pair in m_dicItemSmartTag)
                {
                    TagList.Items.Add(pair.Key);
                }
            }
        }

        private void TagList_SelectedIndexChanged(object sender, EventArgs e)
        {
            string? key = TagList.SelectedItem?.ToString();
            if (!string.IsNullOrEmpty(key))
            {
                if (m_bIsWorker == true && m_dicWorkerSmartTag.TryGetValue(key, out SmartTag? smartTag))
                {
                    m_SelectedSmartTag = smartTag;
                    SetAllowedTagReaderList(true, smartTag.SmartTagID);
                }
                else if (m_bIsWorker == false && m_dicItemSmartTag.TryGetValue(key, out smartTag))
                {
                    m_SelectedSmartTag = smartTag;
                    SetAllowedTagReaderList(false, smartTag.SmartTagID);
                }
                else
                {
                    m_SelectedSmartTag = null;
                }
            }
            else
            {
                m_SelectedSmartTag = null;
            }
        }

        private void TagReaderList_SelectedIndexChanged(object sender, EventArgs e)
        {
            
            string? key = TagReaderList.SelectedItem?.ToString();
            if (!string.IsNullOrEmpty(key) && m_dicSmartTagReader.TryGetValue(key, out SmartTagReader? smartTagReader))
            {
                m_SelectedSmartTagReader = smartTagReader;
            }
            else
            {
                m_SelectedSmartTag = null;
            }
        }

        private void SetAllowedTagReaderList(bool isWorker, int smartTagId)
        {
            LinkedZoneList.Items.Clear();
            
            if (isWorker)
            {
                string strConditions = "WorkerID = " + smartTagId;
                
                IEnumerable<WorkerLinkZone> result = m_dataManager.GetSelect().Select<WorkerLinkZone>(strConditions, out string strErrorMessage);
                
                List<WorkerLinkZone> workerLinkZoneList = result.ToList();
                
                foreach (WorkerLinkZone workerLinkZone in workerLinkZoneList)
                {
                    int id = workerLinkZone.ZoneID;

                    foreach (SmartTagReader smartTagReader in m_dicSmartTagReader.Values)
                    {
                        if (smartTagReader.ZoneID == id)
                        {
                            LinkedZoneList.Items.Add(smartTagReader.UniqueKey);
                        }
                    }
                    
                }
            }
            else
            {
                string strConditions = "ItemID = " + smartTagId;
                
                IEnumerable<ItemLinkZone> result = m_dataManager.GetSelect().Select<ItemLinkZone>(strConditions, out string strErrorMessage);
                
                List<ItemLinkZone> itemLinkZoneList = result.ToList();
                
                foreach (ItemLinkZone itemLinkZone in itemLinkZoneList)
                {
                    int id = itemLinkZone.ZoneID;

                    foreach (SmartTagReader smartTagReader in m_dicSmartTagReader.Values)
                    {
                        if (smartTagReader.ZoneID == id)
                        {
                            LinkedZoneList.Items.Add(smartTagReader.UniqueKey);
                        }
                    }
                }
            }
        }

        private void InsertButton_Click(object sender, EventArgs e)
        {
            if (m_SelectedSmartTag == null)
            {
                MessageBox.Show("선택된 스마트 태그가 올바르지 않습니다.", "에러", MessageBoxButtons.OK, MessageBoxIcon.Error );
                return;
            }

            if (m_SelectedSmartTagReader == null)
            {
                MessageBox.Show("선택된 스마트 태그리더가 올바르지 않습니다.", "에러", MessageBoxButtons.OK, MessageBoxIcon.Error );
                return;
            }

            if (m_historyDataInsertManager.InsertSmartTagHistory(m_SelectedSmartTag, m_SelectedSmartTagReader, out string strErrorMessage) == false)
            {
                ResultLabel.Text = strErrorMessage;
                return;
            }
            
            ResultLabel.Text = "SmartTag History Insert Success";
        }

        private void FormSmartTagManager_Load(object sender, EventArgs e)
        {
            
        }
    }
}