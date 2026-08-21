using System.Collections.Concurrent;
using System.Collections.Generic;
using dnsTcpLib2;
using System.Text;

namespace IntegrationServer.Servers.EmergencyBell.ITSeng
{
    class ServiceProvider : TcpServiceProvider
    {
        private ConcurrentDictionary<ConnectionState, ConnectionState> m_dicClients = new ConcurrentDictionary<ConnectionState, ConnectionState>();
        private ITSengManager m_mgr = null;

        public ServiceProvider(ITSengManager mgr)
        {
            this.m_mgr = mgr;
        }

        public override void OnAcceptConnection(ConnectionState state)
        {
            state.LengthAdd = false;
            m_dicClients.TryAdd(state, state);
            m_mgr.WriteLog(string.Format("add new Client {0}:{1}", state.IPAddress, state.PortNo));
        }

        public override void OnDropConnection(ConnectionState state)
        {
            ConnectionState removeState;
            m_dicClients.TryRemove(state, out removeState);
            m_mgr.WriteLog(string.Format("remove Client {0}:{1}", state.IPAddress, state.PortNo));
        }

        public override bool OnReceiveData(ConnectionState state)
        {
            if (!base.OnReceiveData(state))
                return false;

            //WriteByteArray(state.RecivedBuffer);

            bool bResult = OnReceive(state, state.RecivedBuffer);
            state.RecivedBuffer = null;
            return bResult;
        }

        private bool OnReceive(ConnectionState state, byte[] bytes)
        {
            string strRecvData = Encoding.UTF8.GetString(bytes, 0, bytes.Length);

            byte[] sendBytes = Encoding.UTF8.GetBytes(strRecvData + "&Return=ok");
            // 받은 내용에 "&Return=ok" 붙여서 되돌려 보내준다.
            bool result = Send(sendBytes, sendBytes.Length, state);

            m_mgr.ProcessData(strRecvData);
            return result;
        }

        public bool Send(byte[] bytes, int size, ConnectionState state)
        {
            return state.WriteAsync(bytes, 0, size);
        }

        public override object Clone()
        {
            return this;
        }
    }
}
