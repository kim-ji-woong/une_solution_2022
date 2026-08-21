using System;
using System.Collections.Concurrent;
using dnsTcpLib2;
using IntegrationServer.Datas;
using static AgentFactory.BLL.ServerType;

namespace IntegrationServer.Servers.Fire.Siemens
{
    /// <summary>
    /// 지멘스 서버 모드
    /// </summary>
    public class SiemensServerProvider : TcpServiceProvider
    {
        private int m_nServerSeqNo = -1;
        private ServerTypes m_serverType = ServerTypes.Fire_Siemens;

        private SiemensManager m_parentManager = null;

        private ConcurrentDictionary<ConnectionState, SiemensProcessData> m_arrClients = new ConcurrentDictionary<ConnectionState, SiemensProcessData>();
        
        public SiemensServerProvider(SiemensManager mgr, int nServerSeqNo)
        {
            m_parentManager = mgr;
            m_nServerSeqNo = nServerSeqNo;
        }

        public override void OnAcceptConnection(ConnectionState state)
        {
            state.LengthAdd = false;

            SiemensProcessData data = new SiemensProcessData(m_parentManager, state, m_nServerSeqNo);
            state.Tag = data;

            if (m_arrClients.TryAdd(state, data))
            {
                m_parentManager.Logger.Write(LogTypes.Info, m_serverType, m_nServerSeqNo, " new Client Connection : " + state.IPAddress + ":" + state.PortNo.ToString());

                // winform 처리
                m_parentManager.AddClient(state, m_serverType);
            }
        }

        public override void OnDropConnection(ConnectionState state)
        {
            SiemensProcessData data = null;

            if (m_arrClients.TryRemove(state, out data))
            {
                m_parentManager.Logger.Write(LogTypes.Info, m_serverType, m_nServerSeqNo, " close Connection : " + state.IPAddress + ":" + state.PortNo.ToString());

                // winform 처리
                m_parentManager.RemoveClient(state);
            }
        }

        public override bool OnReceiveData(ConnectionState state)
        {
            if (!base.OnReceiveData(state))
                return false;

            byte[] bytes = CopyBytes(state.RecivedBuffer);

            if (bytes == null)
                return false;

            SiemensProcessData client;

            if (m_arrClients.TryGetValue(state, out client))
                client.OnReceive(bytes);

            WriteRecvLog(state, bytes);
            return true;
        }

        private void WriteRecvLog(ConnectionState state, byte[] bytes)
        {
            string strLog = "";

            int len = bytes.Length;

            for (int i=0;i<len;i++)
            {
                string strBytes = string.Format("{0:X2}", bytes[i]);

                if (i == 0)
                    strLog = strBytes;
                else
                    strLog += " " + strBytes;
            }

            if (len > 4)
            {
                strLog = string.Format("[{4}] Recv from {0}:{1}\r\nBytes Length : {2}\r\n{3}", state.IPAddress, state.PortNo, len, strLog, m_serverType);
                m_parentManager.Logger.Write(LogTypes.Info, m_serverType, m_nServerSeqNo, strLog);// m_logger.Write(strLog);
            }
        }

        private byte[] CopyBytes(byte[] bytes)
        {
            if (bytes == null)
                return null;

            int len = bytes.Length;

            if (len == 0)
                return null;

            byte[] copied = new byte[len];

            for (int i=0;i<len;i++)
            {
                copied[i] = bytes[i];
            }

            return copied;
        }

        public override object Clone()
        {
            return new SiemensServerProvider(m_parentManager, m_nServerSeqNo);
        }
    }
}
