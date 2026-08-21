namespace Hynix.BLL.Response
{
    public class ResponseSensorDetectCondition : MessageResult
    {
        private string m_strCondition = null;

        public string Condition
        {
            get { return m_strCondition; }
            set { m_strCondition = value; }
        }

        public ResponseSensorDetectCondition()
            : base()
        {
        }

        public ResponseSensorDetectCondition(bool success, string message)
            : base(success, message)
        {
        }
    }
}
