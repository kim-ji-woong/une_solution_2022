using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AWS_API
{
    public class ProcessManager
    {
        private Thread m_watchSend = null;

        private bool m_shutdownThread = false;

        private WebServiceManager m_webServiceManager = null;

        public ProcessManager()
        {

        }

        public void SleepThread(int nThreadSleep)
        {
            for (int i = 0; i < nThreadSleep * 10; i++)
            {
                if (m_shutdownThread)
                    break;

                Thread.Sleep(10);
            }
        }
    }
}
