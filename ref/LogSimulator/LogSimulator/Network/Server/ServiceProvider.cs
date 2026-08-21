using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using dnsTcpLib2;

namespace LogSimulator.Network.Server
{
    class ServiceProvider : TcpServiceProvider
    {
        private ConcurrentDictionary<ConnectionState, ConnectionState> m_dicClients = new ConcurrentDictionary<ConnectionState, ConnectionState>();

        public override void OnAcceptConnection(ConnectionState state)
        {
            state.LengthAdd = false;
            m_dicClients.TryAdd(state, state);
            System.Diagnostics.Trace.WriteLine(string.Format("add new Client {0}:{1}", state.IPAddress, state.PortNo));
        }

        public override void OnDropConnection(ConnectionState state)
        {
            ConnectionState removeState;
            m_dicClients.TryRemove(state, out removeState);
            System.Diagnostics.Trace.WriteLine(string.Format("remove Client {0}:{1}", state.IPAddress, state.PortNo));
        }

        public bool Send(byte[] bytes, int size)
        {
            List<ConnectionState> clients = new List<ConnectionState>();
            clients.AddRange(m_dicClients.Values);

            bool success = true;

            foreach (ConnectionState state in clients)
            {
                if (state.WriteAsync(bytes, 0, size) == false)
                    success = false;
            }

            return success;
        }

        public override object Clone()
        {
            return this;
        }
    }
}
