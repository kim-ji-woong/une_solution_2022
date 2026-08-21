using System.Collections.Generic;

namespace ClientTest
{
    class ModbusManager
    {
        // 모드버스 기본 Port
        private int m_nPort = 502;
        private string m_strServerIP = "";
        private ClientProvider m_clientProvider = null;

        private bool m_isStarted = false;
        private int m_nStartAddress = 0;
        private int m_nSlaveID = 1;

        // 한번에 몇개의 데이터를 읽을 것인가?
        private ushort m_requestLength = 100;

        private IOwner m_owner = null;
        private Dictionary<int, int> m_dicRequests = null;

        public int Port
        {
            get { return m_nPort; }
            set { m_nPort = value; }
        }

        public string ServerIP
        {
            get { return m_strServerIP; }
            set { m_strServerIP = value; }
        }

        public bool IsStarted
        {
            get { return m_isStarted; }
        }

        public int StartAddress
        {
            get { return m_nStartAddress; }
            set { m_nStartAddress = value; }
        }

        public int SlaveID
        {
            get { return m_nSlaveID; }
            set { m_nSlaveID = value; }
        }

        // 한번에 몇개의 데이터를 읽을 것인가?
        public ushort RequestLength
        {
            get { return m_requestLength; }
            set { m_requestLength = value; }
        }

        public Dictionary<int, int> Requests
        {
            get { return m_dicRequests; }
            set { m_dicRequests = value; }
        }

        public ModbusManager(string strServerIP, int functionCode, IOwner owner)
        {
            m_strServerIP = strServerIP;
            m_clientProvider = ClientProvider.MakeInstance(functionCode, this);
            m_owner = owner;
        }

        public void Start(IOwner owner)
        {
            if (m_clientProvider != null)
            {
                this.m_owner = owner;
                m_clientProvider.Start();
                m_isStarted = true;
            }
        }

        public void Stop()
        {
            if (m_clientProvider != null)
            {
                m_clientProvider.Stop();
                m_isStarted = false;
                m_owner = null;
            }
        }

        public string WriteBinaryLog(byte[] bytes, int nIndex, int len, string strTag)
        {
            string strBytesLog = Logger.GetByteString(bytes, nIndex, len);
            Logger.Instance.Write(Logger.LogTypes.Info, strTag + " : " + strBytesLog);

            string strLog = strTag + " : " + strBytesLog;

            if (m_owner != null)
                m_owner.WriteLog(strLog);

            return strLog;
        }

        public void WriteLog(string strLog)
        {
            Logger.Instance.Write(Logger.LogTypes.Info, strLog);

            if (m_owner != null)
                m_owner.WriteLog(strLog);
        }
    }

    interface IOwner
    {
        public void WriteLog(string strLog);
    }
}
