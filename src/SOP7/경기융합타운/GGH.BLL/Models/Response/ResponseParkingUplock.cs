namespace GGH.BLL.Models.Response
{
    public class ResponseParkingUplock : MessageResult
    {
        private bool m_use = true;

        public bool Use
        {
            get { return m_use; }
            set { m_use = value; }
        }

        public ResponseParkingUplock()
        {
        }

        public ResponseParkingUplock(bool success, string message)
            : base(success, message)
        {
        }
    }
}
