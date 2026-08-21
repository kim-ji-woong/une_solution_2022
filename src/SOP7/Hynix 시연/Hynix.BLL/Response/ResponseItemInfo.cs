using Hynix.Model;

namespace Hynix.BLL.Response
{
    public class ResponseItemInfo : MessageResult
    {
        private Item m_item = null;

        public Item Item
        {
            get { return m_item; }
            set { m_item = value; }
        }

        public ResponseItemInfo()
            : base()
        {
        }

        public ResponseItemInfo(bool success, string message)
            : base(success, message)
        {
        }
    }
}
