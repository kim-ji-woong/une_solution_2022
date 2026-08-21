using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace CheongsimServer
{
    public class AlarmManager
    {
        private DataManager m_s1DBManager = null;
        private DataManager m_dataManager = null;

        bool m_shutdownThread = true;

        int m_nErrorSleep = 1000 * 60;
        int m_nThreadSleep = 100 * 15;     // 1.5초

        Thread m_watchThread = null;

        public AlarmManager(DataManager s1DBManager, DataManager dataManager)
        {
            m_dataManager = dataManager;
            m_s1DBManager = s1DBManager;
        }

        public void Start()
        {
            if (m_shutdownThread == true)
            {
                m_shutdownThread = false;

                m_watchThread = new Thread(() => WatchThread());
                m_watchThread.Start();

            }
        }

        public void Stop()
        {
            m_shutdownThread = true;
        }

        private void WatchThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchThread 실행");


            while (!m_shutdownThread)
            {
                // 



                Thread.Sleep(m_nThreadSleep);
            }
        }
    }
}
