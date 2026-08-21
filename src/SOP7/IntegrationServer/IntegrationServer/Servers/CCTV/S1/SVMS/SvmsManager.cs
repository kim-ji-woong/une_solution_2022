 using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsData.Sensor;
using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using static dnsSopID.ID;

namespace IntegrationServer.Servers.CCTV.S1.SVMS
{
    public class SvmsManager : IServer, ISVMSEventOwner
    {
        #region IServer 인터페이스
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }

        public ServerTypes ServerType { get { return ServerTypes.Fire_Johnson; } }
        public void Start()
        {
            if (m_serverProperties == null || m_serverProperties.Count == 0)
                return;

            List<string> svmsIPs = new List<string>();
            List<int> svmsPorts = new List<int>();
            List<string> svmsIDs = new List<string>();
            List<string> svmsPWs = new List<string>();

            foreach (KeyValuePair<ServerProperty, object> item in m_serverProperties)
            {
                string[] strValues = item.Value.ToString().Split('/');
                if (strValues.Length == 0)
                    return;

                if (item.Key == ServerProperty.SvmsIP)
                    svmsIPs = strValues.Select(p => p.Trim()).ToList();
                else if (item.Key == ServerProperty.SvmsPort)
                {
                    for (int i = 0; i < strValues.Length; i++)
                    {
                        string strValue = strValues[i];
                        if (!int.TryParse(strValue, out int nPort))
                            return;

                        svmsPorts.Add(nPort);
                    }
                }
                else if (item.Key == ServerProperty.SvmsID)
                    svmsIDs = strValues.Select(p => p.Trim()).ToList();
                else if (item.Key == ServerProperty.SvmsPW)
                    svmsPWs = strValues.Select(p => p.Trim()).ToList();
            }

            int nCount = svmsIPs.Count;
            if (nCount != svmsPorts.Count || nCount != svmsIDs.Count || nCount != svmsPWs.Count)
                return;

            m_svmsEventReceivers = SVMSEventReceiver.MakeInstances(this, m_dataManager, m_nSiteID, svmsIPs, svmsPorts, svmsIDs, svmsPWs);
            if (m_svmsEventReceivers?.Count > 0)
            {
                bool isFirst = true;

                foreach (SVMSEventReceiver receiver in m_svmsEventReceivers)
                {
                    if (isFirst)
                    {
                        m_cctvManager = new CCTVManager(this, receiver.DataManager, m_nServerSeqNo, m_nSiteID);
                        m_alarmManager = new AlarmManager(this, receiver.DataManager);
                    }
                    else
                        isFirst = false;

                    receiver.ConnectServer();
                }

                m_cctvManager.RestartProcess();

                m_timer = new Timer();
                // 1초 주기
                m_timer.Interval = 1000;
                m_timer.Tick += OnTimer;
                m_timer.Start();

                OnTimer(null, null);

                System.Threading.Thread t = new System.Threading.Thread(new System.Threading.ThreadStart(MessageThread));
                t.Start();
            }
        }

        public void Stop()
        {
            if (m_timer != null)
            {
                m_timer.Stop();
                m_timer.Dispose();
            }
        }

        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }

        public bool IsConnected { get; }
        private bool m_bIsConnected = false;
        public Logger Logger { get; set; }
        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }
        #endregion

        private DataManager m_dataManager = null;
        private int m_nSiteID = -1;
        private Dictionary<ServerProperty, object> m_serverProperties = null;
        public Dictionary<ServerProperty, object> ServerProperties { get { return m_serverProperties; } }

        private SopQueryManager m_sopQueryManager = null;

        private List<SVMSEventReceiver> m_svmsEventReceivers = null;
        private List<SVMSEventReceiver> m_svmsTempEventReceivers = null;
        private CCTVManager m_cctvManager = null;
        private AlarmManager m_alarmManager = null;

        private System.Collections.Concurrent.ConcurrentQueue<Message> m_messageQueues = new System.Collections.Concurrent.ConcurrentQueue<Message>();
        private bool m_closeThread = false;

        private Timer m_timer = null;
        private DateTime? m_dtLastChanged = null;
        // 마지막에 CCTV List를 확인한 날짜
        private DateTime m_dtLastChecked;

        public SvmsManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nSiteID, int nServerSeqNo, Dictionary<ServerProperty, object> serverProperties, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);            

            m_nSiteID = nSiteID;
            m_nServerSeqNo = nServerSeqNo;
            m_serverProperties = serverProperties;
            m_strServerAlias = strServerAlias;
        }

        private void OnTimer(object sender, EventArgs e)
        {
            DateTime dtNow = DateTime.Now;
            DateTime? dtLastChanged = m_dtLastChanged;

            if (dtLastChanged != null)
            {
                TimeSpan span = dtNow - (DateTime)dtLastChanged;

                if (span.TotalMinutes >= 1.0)
                {
                    // 마지막 변경 이후로 1분 이상 지났다면...
                    m_dtLastChanged = null;

                    // svms로부터 받아야 한다.
                    ICollection<ViewModels.Sdms.CCTV> svmsCCTVs = null;

                    if (m_svmsTempEventReceivers != null)
                    {
                        svmsCCTVs = SVMSEventReceiver.GetCCTVList(m_svmsTempEventReceivers);

                        //WriteCCTVListLog("[TempEventReceiver List]", svmsCCTVs);

                        SVMSEventReceiver.DisposeInstances(m_svmsTempEventReceivers);
                        m_svmsTempEventReceivers = null;
                    }
                    else
                        svmsCCTVs = SVMSEventReceiver.GetCCTVList(m_svmsEventReceivers);

                    if (svmsCCTVs != null)
                    {
                        m_cctvManager.Update(svmsCCTVs);
                    }
                }
            }

            m_alarmManager.CheckAutoClose();
            /*
             * 통합 서버를 OFF 시키면 안되기 때문에 다른 방식으로 불러오기 
            if (dtNow.Hour >= 1)
            {
                if (dtNow.Year != m_dtLastChecked.Year || dtNow.Month != m_dtLastChecked.Month || dtNow.Day != m_dtLastChecked.Day)
                {
                    m_dtLastChecked = dtNow;
                    // 변경된 CCTV List가 있는지 확인한다.
                    ReloadCCTVList();
                }
            }
            */
        }

        private void ReloadCCTVList()
        {
            // 프로그램 종료 >> 감시 프로세스에서 재시작하여 CCTV List 다시 불러오기
            //m_closeThread = true;
            //Application.Exit();
        }
        private void MessageThread()
        {
            Message message;

            while (m_closeThread == false)
            {
                if (m_messageQueues.TryDequeue(out message))
                {
                    m_cctvManager.SendEvent(message.EventTime, message.UniqueKey, message.SensorType);
                }

                System.Threading.Thread.Sleep(100);
            }
        }

        public bool SendSensorData(int nSensorType, int nTagID, int nSensorZoneID, bool bIsAlarm)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, nSensorType, nTagID, nSensorZoneID, bIsAlarm);
        }

        #region ISVMSEventOwner 인터페이스
        public void OnMessage(DateTime eventTime, string uniqueKey, Facility.FacilityType sensorType, string strMessage)
        {
            DateTime dtNow = DateTime.Now;
            string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00} ", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);

            if (sensorType != Facility.FacilityType.NONE)
            {
                m_cctvManager.SendEvent(eventTime, uniqueKey, sensorType);
            }

            //this.Invoke((MethodInvoker)delegate
            //{
            //    string strText = textBoxStatus.Text.Trim();

            //    if (strText.Length == 0)
            //        strText = strTime + strMessage;
            //    else
            //        strText += "\r\n" + strTime + strMessage;

            //    textBoxStatus.Text = strText;
            //});
        }

        public void OnModifiedCamera(ViewModels.Sdms.CCTV cctv)
        {
            if (m_cctvManager != null)
            {
                if (m_cctvManager.UpdateCCTV(cctv))
                {
                    m_dtLastChanged = DateTime.Now;
                }
            }
        }

        public void OnAddCCTV(ViewModels.Sdms.CCTV cctv)
        {
            m_dtLastChanged = DateTime.Now;
        }
        #endregion

        private class Message
        {
            public DateTime EventTime;
            public string UniqueKey;
            public Facility.FacilityType SensorType;
            public string MessageString;

            public Message()
            {
            }

            public Message(DateTime eventTime, string uniqueKey, Facility.FacilityType sensorType, string message)
            {
                EventTime = eventTime;
                UniqueKey = uniqueKey;
                SensorType = sensorType;
                MessageString = message;
            }
        }
    }
}
