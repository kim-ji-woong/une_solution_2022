using System;
using System.Windows.Forms;

namespace ClientTest
{
    public partial class FormMain : Form, INetworkOwner
    {
        private ClientProvider m_clientProvider = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            string strIP;
            int port;

            if (ConfigManager.GetConnection(out strIP, out port))
            {
                textBoxServerIP.Text = strIP;
                textBoxPort.Text = port.ToString();
            }

            m_clientProvider = new ClientProvider(this);
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            string strIP = textBoxServerIP.Text.Trim();

            if (strIP.Length == 0)
            {
                textBoxServerIP.Focus();
                MessageBox.Show("Server IP를 입력하세요.");
                return;
            }

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
                MessageBox.Show("Port는 0보다 큰 정수만 가능합니다.");
                return;
            }

            if (m_clientProvider.Connect(strIP, port))
            {
                WriteLog("접속 성공 to " + strIP + ":" + port);
                btnConnect.Enabled = false;
                btnDisconnect.Enabled = true;
            }
        }

        private void btnDisconnect_Click(object sender, EventArgs e)
        {
            m_clientProvider.Close();
        }

        public void OnReceive(string strRecv)
        {
            WriteLog(strRecv, true);
        }

        private void WriteLog(string str, bool? isRecv = null)
        {
            string strText = textBoxRecv.Text.Trim();

            if (isRecv != null)
            {
                string strTag = (bool)isRecv ? "[Recv]" : "[Send]";

                if (strText.Length > 0)
                    strText += "\r\n" + strTag + " : " + str;
                else
                    strText = strTag + " : " + str;
            }
            else
            {
                if (strText.Length > 0)
                    strText += "\r\n" + str;
                else
                    strText = str;
            }

            this.Invoke((MethodInvoker)delegate
            {
                textBoxRecv.Text = strText;
            });
        }

        public void OnClose()
        {
            WriteLog("접속 종료");

            this.Invoke((MethodInvoker)delegate
            {
                btnConnect.Enabled = true;
                btnDisconnect.Enabled = false;
            });
        }

        private void textBoxSend_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                btnSend_Click(null, null);
            }
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            if (btnConnect.Enabled == false)
            {
                string strSend = textBoxSend.Text.Trim();

                if (strSend.Length == 0)
                    return;

                if (m_clientProvider.Send(strSend))
                    WriteLog(strSend, false);
            }

            textBoxSend.Text = "";
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            string strIP = textBoxServerIP.Text.Trim();
            string strPort = textBoxPort.Text.Trim();

            if (strIP.Length > 0 && strPort.Length > 0)
            {
                int port;

                if (int.TryParse(strPort, out port))
                {
                    ConfigManager.SetConnection(strIP, port);
                }
            }
        }
    }
}
