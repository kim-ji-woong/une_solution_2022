using System;
using System.Net.Sockets;
using System.Net;
using System.Windows.Forms;

namespace ServerSampleJson
{
    public partial class FormMain : Form
    {
        private ClientController m_client = null;
        private static FormMain m_instance = null;

        public static FormMain Instance
        {
            get { return m_instance; }
        }

        public FormMain()
        {
            InitializeComponent();
            m_instance = this;
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            string strPort = textBoxPort.Text.Trim();

            if (strPort.Length == 0)
            {
                textBoxPort.Focus();
                MessageBox.Show("Port를 입력하세요.");
                return;
            }

            int port;

            if (int.TryParse(strPort, out port) == false || port <= 0)
            {
                textBoxPort.Focus();
                MessageBox.Show("Port는 0보다 큰 정수이어야만 합니다.");
                return;
            }

            btnStart.Enabled = false;
            textBoxPort.Enabled = false;
            textBoxSend.Enabled = true;
            btnSend.Enabled = true;

            BeginServer(port);
        }

        private void BeginServer(object param)
        {
            int nPort = (int)param;

            TcpListener server = new TcpListener(IPAddress.Parse("127.0.0.1"), nPort);
            server.Start();

            // 비동기 Listening
            server.BeginAcceptTcpClient(new AsyncCallback(OnAcceptClient), server);
        }

        private void OnAcceptClient(IAsyncResult result)
        {
            if (m_client != null)
                m_client.Close();

            // Get the listener that handles the client request.
            TcpListener listener = (TcpListener)result.AsyncState;

            // End the operation and display the received data on
            // the console.
            TcpClient client = listener.EndAcceptTcpClient(result);

            // Process the connection here. (Add the client to a
            // server table, read data, etc.)
            Console.WriteLine("Client connected completed");
            m_client = new ClientController(client);

            // 다음 클라이언트를 기다린다.
            listener.BeginAcceptTcpClient(new AsyncCallback(OnAcceptClient), listener);
        }

        public void OnReceive(string strMessage)
        {
            this.Invoke((MethodInvoker)delegate
            {
                string strText = textBoxReceive.Text.Trim();

                if (strText.Length == 0)
                    strText = "[Recv] " + strMessage;
                else
                    strText += "\r\n[Recv] " + strMessage;

                textBoxReceive.Text = strText;
            });
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            string strText = textBoxSend.Text.Trim();

            if (m_client != null && strText.Length > 0)
            {
                string strMessage = textBoxReceive.Text.Trim();

                if (strMessage.Length == 0)
                    strMessage = "[Send] " + strText;
                else
                    strMessage += "\r\n[Send] " + strText;

                textBoxReceive.Text = strMessage;
                m_client.SendData(strText, ClientController.PayloadDataType.Text);
            }

            textBoxSend.Text = "";
        }
    }
}
