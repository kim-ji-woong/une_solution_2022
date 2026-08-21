using System;
using System.Collections.Generic;
using System.Text;
using TcpLib2;

namespace ClientTest
{
    class ClientProvider : ClientServiceProvider
    {
        private INetworkOwner m_owner = null;

        public ClientProvider(INetworkOwner owner)
        {
            m_owner = owner;
            this.LengthAdd = false;
        }

        public override void OnReceiveData()
        {
            byte[] bytes = this.ReceivedData;

            if (bytes == null)
                return;

            string strRecvData = Encoding.UTF8.GetString(bytes, 0, bytes.Length);
            m_owner.OnReceive(strRecvData);
        }

        public override void OnDropConnection()
        {
            m_owner.OnClose();
        }

        public bool Send(string strSend)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(strSend);
            return this.Send(bytes, 0, bytes.Length) > 0;
        }
    }

    interface INetworkOwner
    {
        void OnReceive(string strRecv);
        void OnClose();
    }
}
