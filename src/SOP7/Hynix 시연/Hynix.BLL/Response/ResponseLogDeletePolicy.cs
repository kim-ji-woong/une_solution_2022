namespace Hynix.BLL.Response
{
    public class ResponseLogDeletePolicy : MessageResult
    {
        public enum LogDeleteOption { JustDelete = 0, ArchiveNDelete };

        private int m_deleteOption = (int)LogDeleteOption.JustDelete;

        public int DeleteOption
        {
            get { return m_deleteOption; }
            set { m_deleteOption = value; }
        }

        public ResponseLogDeletePolicy()
            : base()
        {
        }

        public ResponseLogDeletePolicy(bool success, string message)
            : base(success, message)
        {
        }
    }
}
