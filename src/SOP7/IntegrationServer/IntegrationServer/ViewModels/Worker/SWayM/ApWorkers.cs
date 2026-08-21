using System.Collections.Generic;

namespace IntegrationServer.ViewModels.Worker.SWayM
{
    public class ApWorkers
    {
        private AP m_ap = null;
        private List<Worker> m_workers = new List<Worker>();

        public AP AP
        {
            get { return m_ap; }
            set { m_ap = value; }
        }

        public List<Worker> Workers
        {
            get { return m_workers; }
            set { m_workers = value; }
        }
    }
}
