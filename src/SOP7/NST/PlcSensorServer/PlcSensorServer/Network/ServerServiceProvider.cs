using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using dnsTcpLib2;
using System.Threading;
using System.Text;

namespace PlcSensorServer.Network
{
    public class ServerServiceProvider : TcpServiceProvider
    {
        private ConcurrentDictionary<ConnectionState, ClientData> m_arrClients = new ConcurrentDictionary<ConnectionState, ClientData>();

        // Ping은 로그에 남기지 않는다.
        private bool m_exceptPingLog = true;
        private bool m_isAliveThread = true;

        private Thread m_connectionThread = null;
        private NetworkManager m_netMgr = null;
        private ISensorOwner m_sensorOwner = null;

        public ServerServiceProvider(NetworkManager netMgr, ISensorOwner sensorOwner)
        {
            m_netMgr = netMgr;
            m_sensorOwner = sensorOwner;
            m_connectionThread = new Thread(new ThreadStart(ConnectionThread));
            m_connectionThread.Start();
        }

        public override void OnAcceptConnection(ConnectionState state)
        {
            if (m_isAliveThread == false)
                return;

            state.LengthAdd = false;

            ClientData data = new ClientData(m_sensorOwner, state);
            state.Tag = data;
            data.ServiceProvider = this;

            if (m_arrClients.TryAdd(state, data))
            {
                m_netMgr.AddClient(state);
                string strLog = "New Client Connection : " + state.IPAddress + ":" + state.PortNo.ToString();
                Logger.Instance.Write(strLog);
                System.Diagnostics.Trace.WriteLine(strLog);
            }
        }

        public override bool OnReceiveData(ConnectionState state)
        {
            if (!base.OnReceiveData(state))
                return false;

            ClientData client = (ClientData)state.Tag;
            if (client == null)
                return false;

            client.PingCount = 0;

            bool bResult = client.OnReceiveData(state, state.RecivedBuffer);
            state.RecivedBuffer = null;
            return bResult;
        }

        public override void OnDropConnection(ConnectionState state)
        {
            // 서버가 종료상태면 다른 처리를 하지 않는다.
            if (m_isAliveThread == false)
                return;

            ClientData data = null;
            if (m_arrClients.TryRemove(state, out data))
            {
                data.Close();
                m_netMgr.RemoveClient(state);
            }

            Logger.Instance.Write("Client Close : " + state.IPAddress + ":" + state.PortNo.ToString());

            ClientData client = (ClientData)state.Tag;
            client.TempData = null;

            try
            {
                GC.Collect();
            }
            catch (System.Exception ex)
            {
                ConnectionLogClient.Instance.WriteLine("CG.Collect", ex);
            }
        }

        //// 연결이 지속되고 있는지 여부를 확인하는 Thread
        private void ConnectionThread()
        {
            int nCountThread = 0;
            List<ConnectionState> stateList = new List<ConnectionState>();

            while (m_isAliveThread)
            {
                stateList.Clear();
                stateList.AddRange(m_arrClients.Keys);

                foreach (ConnectionState state in stateList)
                {
                    ClientData client = (ClientData)state.Tag;

                    // 1분이상 아무 신호가 없으면 통신이 종료된 것으로 간주한다..
                    if (!state.Connected || client.PingCount > 60)
                    {
                        try
                        {
                            state.EndConnection();
                            m_netMgr.RemoveClient(state);
                            client.TempData = null;
                        }
                        catch (System.Exception ex)
                        {
                            ConnectionLogClient.Instance.WriteLine("PingThread", ex);
                        }
                    }
                    else
                    {
                        client.PingCount++;
                    }
                }

                Thread.Sleep(1000);

                nCountThread++;

                if (nCountThread == 3600)
                {
                    nCountThread = 0;
                    try
                    {
                        GC.Collect();
                    }
                    catch (Exception ex)
                    {
                        ConnectionLogClient.Instance.WriteLine("ConnectionThread GCCollect", ex);
                    }
                }
            }
        }

        public void ReleaseThread()
        {
            m_isAliveThread = false;

            // 쓰레드 종료를 2초간 기다린다.
            Thread.Sleep(2000);

            try
            {
                if (m_connectionThread.IsAlive)
                {
                    m_connectionThread.Abort();
                    m_connectionThread.Join();
                }
            }
            catch (System.Exception ex)
            {
                ConnectionLogClient.Instance.WriteLine("ReleaseThread", ex);
            }
        }

        public override object Clone()
        {
            return this;
        }

        public void SendOK(ConnectionState state)
        {
            byte[] bytes = Encoding.UTF8.GetBytes("OK");
            state.WriteAsync(bytes, 0, bytes.Length);
            Logger.Instance.Write("Response OK");
        }

        public void SendNOK(ConnectionState state, string strMessage)
        {
            byte[] bytes = Encoding.UTF8.GetBytes("NOK," + strMessage);
            state.WriteAsync(bytes, 0, bytes.Length);
            Logger.Instance.Write("Response NOK");
        }
    }
}
