namespace VDS.BLL.Models.Response
{
    public class ResponseExcelInfo : MessageResult
    {
        private byte[] m_bytes = null;

        public byte[] Bytes
        {
            get { return m_bytes; }
            set { m_bytes = value; }
        }

        public ResponseExcelInfo()
            : base()
        {
        }

        public ResponseExcelInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
