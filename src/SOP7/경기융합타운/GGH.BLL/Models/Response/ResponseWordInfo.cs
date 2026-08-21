namespace GGH.BLL.Models.Response
{
    // Microsoft Word 문서
    public class ResponseWordInfo : MessageResult
    {
        private byte[] m_bytes = null;
        private string m_strFileName = null;

        public byte[] Bytes
        {
            get { return m_bytes; }
            set { m_bytes = value; }
        }

        public string FileName
        {
            get { return m_strFileName; }
            set { m_strFileName = value; }
        }

        public ResponseWordInfo()
            : base()
        {
        }

        public ResponseWordInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
