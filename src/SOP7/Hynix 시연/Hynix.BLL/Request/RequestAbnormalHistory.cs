using System;
using System.Collections.Generic;
using System.Text;

namespace Hynix.BLL.Request
{
    public class RequestAbnormalHistory
    {
        private int m_nWorkerID = 0;
        private DateTime m_time;

        public int WorkerID
        {
            get { return m_nWorkerID; }
            set { m_nWorkerID = value; }
        }

        public DateTime Time
        {
            get { return m_time; }
            set { m_time = value; }
        }
    }
}
