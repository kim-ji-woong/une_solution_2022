using Hynix.Model;

namespace Hynix.BLL.Response
{
    public class ResponseWorkerInfo : MessageResult
    {
        private Worker m_worker = null;

        public Worker Worker
        {
            get { return m_worker; }
            set { m_worker = value; }
        }

        public ResponseWorkerInfo()
            : base()
        {
        }

        public ResponseWorkerInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
