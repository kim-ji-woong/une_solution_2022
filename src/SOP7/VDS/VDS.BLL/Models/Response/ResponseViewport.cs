namespace VDS.BLL.Models.Response
{
    public class ResponseViewport : MessageResult
    {
        private int m_nDataCenterID = -1;
        private float m_fPosX = 0;
        private float m_fPosY = 0;
        private float m_fPosZ = 0;
        private float m_fRotationX = 0;
        private float m_fRotationY = 0;
        private float m_fRotationZ = 0;

        public int DataCenterID
        {
            get { return m_nDataCenterID; }
            set { m_nDataCenterID = value; }
        }

        public float PositionX
        {
            get { return m_fPosX; }
            set { m_fPosX = value; }
        }

        public float PositionY
        {
            get { return m_fPosY; }
            set { m_fPosY = value; }
        }

        public float PositionZ
        {
            get { return m_fPosZ; }
            set { m_fPosZ = value; }
        }

        public float RotationX
        {
            get { return m_fRotationX; }
            set { m_fRotationX = value; }
        }

        public float RotationY
        {
            get { return m_fRotationY; }
            set { m_fRotationY = value; }
        }

        public float RotationZ
        {
            get { return m_fRotationZ; }
            set { m_fRotationZ = value; }
        }

        public ResponseViewport()
            : base()
        {
        }

        public ResponseViewport(bool success, string message)
            : base(success, message)
        {
        }
    }
}
