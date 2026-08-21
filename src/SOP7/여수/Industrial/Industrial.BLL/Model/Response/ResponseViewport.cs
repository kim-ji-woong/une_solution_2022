namespace Industrial.BLL.Model.Response
{
    public class ResponseViewport : MessageResult
    {
        private float m_locationX = 0;
        private float m_locationY = 0;
        private float m_locationZ = 0;
        private float m_rotationX = 0;
        private float m_rotationY = 0;
        private float m_rotationZ = 0;

        public float LocationX
        {
            get { return m_locationX; }
            set { m_locationX = value; }
        }

        public float LocationY
        {
            get { return m_locationY; }
            set { m_locationY = value; }
        }

        public float LocationZ
        {
            get { return m_locationZ; }
            set { m_locationZ = value; }
        }

        public float RotationX
        {
            get { return m_rotationX; }
            set { m_rotationX = value; }
        }

        public float RotationY
        {
            get { return m_rotationY; }
            set { m_rotationY = value; }
        }

        public float RotationZ
        {
            get { return m_rotationZ; }
            set { m_rotationZ = value; }
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
