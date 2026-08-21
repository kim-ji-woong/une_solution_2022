using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SujainEarthquakeServer
{
    public class ProcessManager
    {
        Thread m_watchExternal = null;
        Thread m_watchBlackOut = null;

        private bool m_shutdownThread = false;

        private ExternalManager m_externalManager = null;
        private WebDataManager m_webDataManager = null;

        private int m_nThreadSleep = 500;
        private int m_nEarthquakeThreadSleep = 1000 * 60;
        private int m_nErrorSleep = 1000 * 60;

        public ProcessManager()
        {
            m_externalManager = new ExternalManager();
            m_webDataManager = new WebDataManager();

            m_watchExternal = new Thread(() => WatchExternalThread());
            m_watchExternal.Start();

            m_watchBlackOut = new Thread(() => WatchBlackOutThread());
            m_watchBlackOut.Start();
        }

        public void Shutdown()
        {
            m_shutdownThread = true;
            m_watchExternal.Abort();
            m_watchBlackOut.Abort();
        }


        private void WatchExternalThread()
        {
            Logger.Instance.Write("WatchExternalThread 실행");

            while (!m_shutdownThread)
            {
                string strErrorMessage = "";

                List<TriggerData> triggerDatas = m_externalManager.ReloadEventTrigger(out strErrorMessage);
                if (triggerDatas == null)
                {
                    Logger.Instance.Write(strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                // 알람 여부 확인
                if (m_webDataManager.GetSensorInfo(triggerDatas, out strErrorMessage) == false)
                {
                    Logger.Instance.Write(strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                // 알람 발생 및 복구
                if (m_webDataManager.SendAlarms(triggerDatas, out strErrorMessage) == false)
                {
                    Logger.Instance.Write(strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                Thread.Sleep(m_nEarthquakeThreadSleep);
            }
        }


        private void WatchBlackOutThread()
        {
            Logger.Instance.Write("WatchBlackOutThread 실행");

            while (!m_shutdownThread)
            {
                string strErrorMessage = "";

                List<BlackOutData> blackOutDatas = m_externalManager.ReloadBlackOut(out strErrorMessage);
                if (blackOutDatas == null)
                {
                    Logger.Instance.Write(strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                // 알람 발생 및 복구
                if (m_webDataManager.SendAlarms(blackOutDatas, out strErrorMessage) == false)
                {
                    Logger.Instance.Write(strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                Thread.Sleep(m_nThreadSleep);
            }
        }
    }
}
