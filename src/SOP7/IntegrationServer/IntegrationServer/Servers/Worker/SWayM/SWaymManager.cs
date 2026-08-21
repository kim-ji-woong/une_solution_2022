using System;
using static dnsSopID.ID;
using System.Threading;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;

namespace IntegrationServer.Servers.Worker.SWayM
{
    using Datas;
    using ViewModels.Worker.SWayM;

    public class SWaymManager : IServer
    {
        private ServerManager m_serverManager = null;
        private int m_nServerSeqNo = -1;
        private bool m_runThread = false;
        private int m_nSiteID = -1;

        private IDataManager m_dataManager = null;
        private AlarmManager m_alarmManager = null;
        private WorkerManager m_workerManager = null;
        private GasManager m_gasManager = null;

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
                return ServerTypes.Worker_SWayM;
            }
        }

        public bool IsConnected
        {
            get
            {
                return m_runThread;
            }
        }

        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }

        public SWaymManager(ServerManager serverManager, IDataManager dataManager, string strSOPWebServerURL, int nServerSeqNo, int nSiteID, string strBaseUrl, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;
            m_strServerAlias = strServerAlias;

            m_dataManager = dataManager.Clone();
            m_workerManager = new WorkerManager(strBaseUrl, this);
            m_gasManager = new GasManager(strBaseUrl, this, ChangeToPsmSensorUrl(strSOPWebServerURL), m_dataManager);
         
            InitData(strSOPWebServerURL);
        }

        private string ChangeToPsmSensorUrl(string strUrl)
        {
            int index = strUrl.LastIndexOf('/');

            if (index > 0)
            {
                string strBaseUrl = strUrl.Substring(0, index + 1);
                return strBaseUrl + "PSMSensor";
            }

            return strUrl;
        }

        private void InitData(string strSOPWebServerURL)
        {
            m_alarmManager = new AlarmManager(m_dataManager, strSOPWebServerURL);
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
            m_alarmManager.SaveAlarms();
        }

        private void MonitoringThread()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            // 이전에 발생한 알람을 읽어온다.
            m_alarmManager.ReadPrevAlarms();

            while (m_runThread)
            {
                try
                {
                    List<WorkerEvent> workerEvents = m_workerManager.Read(m_dataManager, m_nSiteID);

                    if (workerEvents != null)
                        m_alarmManager.CheckEvents(workerEvents);

                    m_gasManager.Read(m_dataManager, m_nSiteID);

                    for (int i = 0; i < 1; i++)
                    {
                        if (m_runThread == false)
                            break;

                        System.Threading.Thread.Sleep(1000);
                    }
                }
                catch (Exception e)
                {
                    System.Diagnostics.Trace.WriteLine("[ERROR] MonitoringThread() : " + e.Message);
                }
            }
        }

        public void WriteLog(string strLog, LogTypes type = LogTypes.Info)
        {
            if (this.Logger != null)
                this.Logger.Write(type, ServerType, m_nServerSeqNo, strLog);
            else
                Logger.Instance.Write(type, ServerType, m_nServerSeqNo, strLog);
        }
    }
}
