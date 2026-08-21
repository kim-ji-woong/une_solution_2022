using System;
using System.Net.Sockets;
using System.Net;
using System.Configuration;
using System.Diagnostics;
using System.Collections.Generic;
using System.Collections.Concurrent;

namespace CCTVMonitor.WebSocket
{
    using Proc;

    class NetworkManager : IClientOwner
    {
        private enum WebToApp
        {
            OpenCCTV = 1,
            ShowCCTV,
            CloseAll,
            CloseCCTV,
            RequestCCTVList,
            SetUrl
        }

        public enum AppToWeb
        {
            CloseCCTV = 1,
            CCTVList
        }

        private ConcurrentDictionary<ClientController, ClientController> m_dicClients = new ConcurrentDictionary<ClientController, ClientController>();
        //private ClientController m_client = null;

        private ProcessManager m_processManager = null;

        public NetworkManager()
        {
            m_processManager = new ProcessManager(this);
        }

        public void BeginServer()
        {
            string strExe = ConfigurationManager.AppSettings.Get("Exe");

            // 상대경로일 경우 실행 파일 폴더 기준으로 절대경로화 (CWD 의존 제거)
            if (!string.IsNullOrWhiteSpace(strExe) && !System.IO.Path.IsPathRooted(strExe))
                strExe = System.IO.Path.GetFullPath(System.IO.Path.Combine(AppContext.BaseDirectory, strExe));

            m_processManager.Path = strExe;
            string strPort = ConfigurationManager.AppSettings.Get("Port");
            int nPort;

            if (int.TryParse(strPort.Trim(), out nPort))
            {
                TcpListener server = new TcpListener(IPAddress.Parse("127.0.0.1"), nPort);
                server.Start();

                // 비동기 Listening
                server.BeginAcceptTcpClient(new AsyncCallback(OnAcceptClient), server);
                WriteLog("BeginServer");
            }
        }

        private void OnAcceptClient(IAsyncResult result)
        {
            /*if (m_client != null)
                m_client.Close();*/

            // Get the listener that handles the client request.
            TcpListener listener = (TcpListener)result.AsyncState;

            // End the operation and display the received data on
            // the console.
            TcpClient client = listener.EndAcceptTcpClient(result);

            // Process the connection here. (Add the client to a
            // server table, read data, etc.)
            Console.WriteLine("Client connected completed");

            AddClient(client);
            //m_client = new ClientController(client, this);

            // 다음 클라이언트를 기다린다.
            listener.BeginAcceptTcpClient(new AsyncCallback(OnAcceptClient), listener);
        }

        private void AddClient(TcpClient client)
        {
            ClientController clientController = new ClientController(client, this);
            m_dicClients[clientController] = clientController;
        }

        public void OnReceive(string strMessage, ClientController controller)
        {
            if (strMessage == null)
                return;

            WriteLog("OnReceive : " + strMessage);
            string[] tokens = strMessage.Split(',');

            if (tokens.Length >= 2)
            {
                int header;

                if (int.TryParse(tokens[0].Trim(), out header))
                    ProcessCommand(header, tokens, controller);
            }
        }

        private void ProcessCommand(int header, string[] tokens, ClientController controller)
        {
            if (header == (int)WebToApp.OpenCCTV)
                m_processManager.OpenCCTV(tokens, controller.Url);
            else if (header == (int)WebToApp.ShowCCTV)
                m_processManager.ShowCCTV(tokens);
            else if (header == (int)WebToApp.CloseAll)
                m_processManager.CloseAll(tokens);
            else if (header == (int)WebToApp.CloseCCTV)
                m_processManager.CloseCCTV(tokens);
            else if (header == (int)WebToApp.RequestCCTVList)
                m_processManager.RequestCCTVList(tokens);
            else if (header == (int)WebToApp.SetUrl)
                m_processManager.SetUrl(tokens, controller);
        }

        public void SendData(int header, object param1 = null, object param2 = null, object param3 = null, object param4 = null, object param5 = null)
        {
            string strData = header.ToString();

            if (param1 != null)
            {
                strData += "," + param1.ToString();

                if (param2 != null)
                {
                    strData += "," + param2.ToString();

                    if (param3 != null)
                    {
                        strData += "," + param3.ToString();

                        if (param4 != null)
                        {
                            strData += "," + param4.ToString();

                            if (param5 != null)
                            {
                                strData += "," + param5.ToString();
                            }
                        }
                    }
                }
            }

            List<ClientController> controllers = new List<ClientController>();
            controllers.AddRange(m_dicClients.Keys);

            foreach (ClientController controller in controllers)
            {
                if (controller.SendData(strData, ClientController.PayloadDataType.Text) == false)
                {
                    ClientController temp;
                    m_dicClients.TryRemove(controller, out temp);
                }
            }
            //m_client.SendData(strData, ClientController.PayloadDataType.Text);
        }

        public void CheckProcess()
        {
            m_processManager.CheckProcess();
        }

        public static System.IO.StreamWriter m_writer = new System.IO.StreamWriter("./log.txt", false, System.Text.Encoding.UTF8);

        public static void WriteLog(string strLog)
        {
            m_writer.WriteLine(strLog);
            m_writer.Flush();
        }
    }
}
