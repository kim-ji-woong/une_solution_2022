namespace VDS.BLL.Models.Response
{
    public class ResponseNewItem : MessageResult
    {
        private ItemEx m_item = null;

        public ItemEx Item
        {
            get { return m_item; }
            set { m_item = value; }
        }

        public ResponseNewItem()
            : base()
        {
        }

        public ResponseNewItem(bool success, string message)
            : base(success, message)
        {
        }
    }
}
