using dnsTcpLib2;
using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using static dnsSopID.ID;

namespace IntegrationServer.Servers.Fire.Siemens
{
    /// <summary>
    /// 지멘스 클라이언트 모드
    /// </summary>
    public class SiemensClientProvider : ClientServiceProvider
    {
        private int m_nServerSeqNo = -1;
        private ServerTypes m_serverType = ServerTypes.Fire_Siemens;

        private SiemensManager m_parentManager = null;
        private SiemensProcessData m_process = null;

        // 지난번에 받은 패킷이 완전하지 않을 경우 지난 패킷을 보관했다가 나머지 패킷을 수신하면 합친다.
        private byte[] m_arrTempReceived = null;
        
        // 현재 OnReceive()에서 받은 데이터를 처리중인가?
        private bool m_isReadingProcess = false;
        public bool IsReadingProcess
        {
            get { return m_isReadingProcess; }
        }

        private int m_nPingCount = 0;
        public int PingCount
        {
            get { return m_nPingCount; }
            set { m_nPingCount = value; }
        }

        public SiemensClientProvider(SiemensManager mgr, int nServerSeqNo)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;

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

        public bool ProcessData(byte[] bytes)
        {            
            if (m_process == null)
                new SiemensProcessData(m_parentManager, null, m_nServerSeqNo);

            return m_process.OnReceive(bytes);
        }

        public override void OnDropConnection()
        {
            
        }
    }
}
