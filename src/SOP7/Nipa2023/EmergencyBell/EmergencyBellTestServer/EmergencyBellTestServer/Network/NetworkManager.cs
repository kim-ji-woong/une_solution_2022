using dnsTcpLib2;
using System.Collections.Generic;
using System.Collections.Concurrent;

namespace EmergencyBellTestServer.Network
{
    public class NetworkManager
    {
        private ServerServiceProvider m_serverProvider = null;
        private TcpServer m_server = null;
        private ConcurrentDictionary<ConnectionState, ConnectionState> m_dicClients = new ConcurrentDictionary<ConnectionState, ConnectionState>();

        public NetworkManager()
        {
        }

        public void Start(int port)
        {
            m_serverProvider = new ServerServiceProvider(this);
            m_server = new TcpServer(m_serverProvider, port);
            m_server.Start();
        }

        public void Stop()
        {
            if (m_server != null)
                m_server.Stop();
        }

        public void Send(byte[] bytes, int offset, int len)
        {
            ConnectionState state;
            ICollection<ConnectionState> keys = m_dicClients.Keys;

            foreach (ConnectionState key in keys)
            {
                if (m_dicClients.TryGetValue(key, out state))
                {
                    state.Write(bytes, offset, len);

                    System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)state.RemoteEndPoint;
                    string strIP = endPoint.Address.ToString();

                    if (bytes != null)
                    {
                        string strLog = "";

                        for (int i = offset; i < offset + len; i++)
                        {
                            if (i == offset)
                                strLog = string.Format("{0:X02}", bytes[i]);
                            else
                                strLog += string.Format(" {0:X02}", bytes[i]);
                        }

                        System.Diagnostics.Trace.WriteLine("Send(" + strIP + ") : " + strLog);
                    }
                }
                else
                    m_dicClients.TryRemove(key, out state);
            }
        }

        public void OnAddClient(ConnectionState state)
        {
            m_dicClients[state] = state;
        }

        public void OnDropClient(ConnectionState state)
        {
            ConnectionState temp;
            m_dicClients.TryRemove(state, out temp);
        }
    }
}
