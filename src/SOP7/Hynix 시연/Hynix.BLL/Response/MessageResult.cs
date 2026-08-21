namespace Hynix.BLL.Response
{
    public class MessageResult
    {
        private bool m_success = false;
        private string m_strMessage = "";

        public bool Success
        {
            get { return m_success; }
            set { m_success = value; }
        }

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string message)
        {
            m_success = success;
            m_strMessage = message;
        }
    }
}
