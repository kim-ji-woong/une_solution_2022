using System;

namespace IntegrationServer.ViewModels.Worker.SWayM
{
    public class AP
    {
        private int m_nApNo = -1;
        private int m_nSensorID = -1;
        private string m_strName = "";
        private bool m_isAssign = true;
        private string m_strState = "";
        private DateTime m_dtCreate = new DateTime();
        private string m_strMcAddr = "";

        public int ApNo
        {
            get { return m_nApNo; }
            set { m_nApNo = value; }
        }

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public bool IsAssign
        {
            get { return m_isAssign; }
            set { m_isAssign = value; }
        }

        public string State
        {
            get { return m_strState; }
            set { m_strState = value; }
        }

        public DateTime CreateTime
        {
            get { return m_dtCreate; }
            set { m_dtCreate = value; }
        }

        public string MacAddress
        {
            get { return m_strMcAddr; }
            set { m_strMcAddr = value; }
        }

        public void SetApNo()
        {
            int len = m_strName.Length;

            int num = 0;
            bool begin = false;

            for (int i = 0; i < len; i++)
            {
                char ch = m_strName[i];

                if (begin == false)
                {
                    if (ch >= '0' && ch <= '9')
                    {
                        begin = true;
                        num = num * 10 + (int)(ch - '0');
                    }
                }
                else
                {
                    if (ch < '0' || ch > '9')
                        break;
                    else
                        num = num * 10 + (int)(ch - '0');
                }
            }

            m_nApNo = num;
        }
    }
}
