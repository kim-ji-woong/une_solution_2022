using dnsData.Sensor;
using S1SVMSSDKv2.Info;
using SDMS.DAL;
using SDMS.Model.CCTV;
using SoPluginContainer.ViewModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Forms;

namespace SoPluginContainer
{
    public class ProcessManager : ISVMSEventOwner
    {
        private SVMSEventReceiver m_receiver = null;

        private DateTime? m_dtLastChanged = null;
        // 마지막에 CCTV List를 확인한 날짜
        private DateTime m_dtLastChecked;

        private System.Collections.Concurrent.ConcurrentQueue<Message> m_messageQueues = new System.Collections.Concurrent.ConcurrentQueue<Message>();
        private bool m_closeThread = false;

        private Timer m_timer = null;

        private CCTVManager m_cctvManager = null;
        private AlarmManager m_alarmManager = null;

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

        public ProcessManager()
        {
            // init
            Logger.Instance.Write("[ProcessManager] INIT");

            if (ReadConfig(out int nSiteID, out int nDBType, out string strDBName, out string strHost, out string strID, out string strPW, out string strSvmsIP, out int nSvmsPort, out string strSvmsID, out string strSvmsPW))
            {
                m_receiver = new SVMSEventReceiver(this, strSvmsIP, nSvmsPort, strSvmsID, strSvmsPW);
                m_receiver.DataManager = new DataManager(nDBType, strHost, strDBName, strID, strPW, nSiteID);
                m_receiver.CommonDataManager = new Common.DAL.DataManager(nDBType, strHost, strDBName, strID, strPW, nSiteID);
            } 
            else
            {
                Logger.Instance.Write("[ProcessManager] ReadConfig Error");
            }
        }

        private static bool ReadConfig(out int nSiteID, out int nDBType, out string strDBName, out string strHost, out string strID, out string strPW, out string strSvmsIP, out int nSvmsPort, out string strSvmsID, out string strSvmsPW)
        {
            nSiteID = nDBType = nSvmsPort = 0;
            strHost = strID = strPW = strDBName = strSvmsIP = strSvmsID = strSvmsPW = null;

            string strSiteID = ConfigurationManager.AppSettings.Get("siteid");
            string strDBType = ConfigurationManager.AppSettings.Get("dbType");

            if (strSiteID == null || strDBType == null)
                return false;

            if (int.TryParse(strSiteID, out nSiteID) == false || int.TryParse(strDBType, out nDBType) == false)
                return false;

            strDBName = ConfigurationManager.AppSettings.Get("dbName");

            strHost = ConfigurationManager.AppSettings.Get("dbHost");
            strID = ConfigurationManager.AppSettings.Get("dbID");
            strPW = ConfigurationManager.AppSettings.Get("dbPw");

            if (strDBName == null || strID == null || strPW == null)
                return false;

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strHost = dnsDBUtil.AES256Cipher.AES_decrypt(strHost, key);
            strID = dnsDBUtil.AES256Cipher.AES_decrypt(strID, key);
            strPW = dnsDBUtil.AES256Cipher.AES_decrypt(strPW, key);

            string svmsIP = ConfigurationManager.AppSettings.Get("svmsIP");
            string port = ConfigurationManager.AppSettings.Get("port");
            string id = ConfigurationManager.AppSettings.Get("id");
            string password = ConfigurationManager.AppSettings.Get("password");

            if (svmsIP == null || port == null || id == null || password == null)
                return false;

            int svmsPort;

            if (int.TryParse(port, out svmsPort) == false)
                return false;

            strSvmsIP = svmsIP;
            nSvmsPort = svmsPort;
            strSvmsID = id;
            strSvmsPW = password;

            return true;
        }

        public void OnAddCCTV(CCTV cctv)
        {
            m_dtLastChanged = DateTime.Now;
            Logger.Instance.Write("OnAddCCTV : " + cctv.CameraName);
        }

        public void OnMessage(DateTime eventTime, string uniqueKey, Facility.FacilityType sensorType, string strMessage)
        {
            if (sensorType != Facility.FacilityType.NONE)
            {
                m_messageQueues.Enqueue(new Message(eventTime, uniqueKey, sensorType, strMessage));
            }
        }

        public void OnModifiedCamera(CCTV cctv)
        {
            m_dtLastChanged = DateTime.Now;
            Logger.Instance.Write("OnModifiedCamera : " + cctv.CameraName);
        }



        public void Start()
        {
            if (m_receiver == null)
                return;

            Logger.Instance.Write("[ProcessManager] START");
            m_dtLastChecked = DateTime.Now;

            m_receiver.Start();

            m_cctvManager = new CCTVManager(m_receiver.DataManager, m_receiver.CommonDataManager);
            m_alarmManager = new AlarmManager(m_receiver.DataManager, m_receiver.CommonDataManager);

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
                    ICollection<CCTV> svmsCCTVs = null;
                    
                    svmsCCTVs = m_receiver.GetCCTVList();

                    if (svmsCCTVs != null)
                    {
                        m_cctvManager.Update(svmsCCTVs);
                    }
                }
            }

            m_alarmManager.CheckAutoClose();
            Logger.Instance.RemoveOldLogs();

            if (dtNow.Hour >= 1)
            {
                if (dtNow.Year != m_dtLastChecked.Year || dtNow.Month != m_dtLastChecked.Month || dtNow.Day != m_dtLastChecked.Day)
                {
                    m_dtLastChecked = dtNow;
                    // 변경된 CCTV List가 있는지 확인한다.
                    //ReloadCCTVList();
                }
            }
        }

        public void Stop()
        {
            Logger.Instance.Write("[ProcessManager] STOP");
            m_timer.Stop();
            m_closeThread = true;
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
    }    
}
