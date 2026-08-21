using System;
using System.Linq;
using System.Text;
using dnsTcpLib2;
using System.Net.Sockets;
using SDMS.Model.Sensor;

namespace FireSensorServer.Network
{
    public class SiemensClientProvider : ClientServiceProvider
    {
        private const string ClientType = "Siemens";

        private NetworkManager m_mgr = null;
        private int m_nPingCount = 0;

        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;

        // 지난번에 받은 패킷이 완전하지 않을 경우 지난 패킷을 보관했다가 나머지 패킷을 수신하면 합친다.
       // private byte[] m_arrTempReceived = null;

        private Logger m_logger = null;
        private Client.ClientDataSiemens m_client = new Client.ClientDataSiemens(null, null); 

        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public SiemensClientProvider(NetworkManager mgr, Logger logger)
        {
            m_mgr = mgr;
            m_logger = logger;
            this.Client.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.NoDelay, true);
        }

        public override void OnReceiveData()
        {
            try
            {
                lock (this)
                {
                    if (ReceivedData != null)
                    {
                        m_isReadingProcess = true;

                        int nBytesCount = ReceivedData.Count();

                        if (nBytesCount > 0)
                        {
                            m_nPingCount = 0;
                            byte[] bytes = ReceivedData;
                            ProcessData(bytes);
                        }
                    }

                    m_isReadingProcess = false;
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("OnReceiveData Error : " + e.Message);
            }
        }

        public override void OnDropConnection()
        {
            if (m_logger != null)
                m_logger.Write("[" + NetworkManager.GetClientTypeString(NetworkManager.ClientType.Siemens) + "] close Connection");
        }

        public void ProcessData(byte[] bytes)
        {
            m_client.OnReceive(null, bytes);
        }

        private int AsciiToInt(byte[] bytes, int nIndex, int len)
        {
            int data = 0;

            for (int i = nIndex; i < nIndex + len; i++)
            {
                data = data * 10 + ((char)bytes[i] - '0');
            }

            return data;
        }

        private DateTime ToDateTime(byte[] bytes, int nIndex)
        {
            int year = ((int)bytes[nIndex]) + 2000;
            int month = (int)bytes[nIndex + 1];
            int day = (int)bytes[nIndex + 2];
            int hour = (int)bytes[nIndex + 3];
            int min = (int)bytes[nIndex + 4];
            int sec = (int)bytes[nIndex + 5];

            return new DateTime(year, month, day, hour, min, sec);
        }
    }
}
