using System.IO;
using System.Text;
using System.Windows.Forms;

namespace EmergencyBell
{
    public partial class FormMain : Form
    {
        private string FileName = "memory.dat";

        private Network.NetworkManager m_netMgr = null;

        public FormMain()
        {
            InitializeComponent();
            ReadMemory();
        }

        private void ReadMemory()
        {
            if (File.Exists(FileName))
            {
                StreamReader reader = new StreamReader(FileName, Encoding.UTF8);

                while (reader.EndOfStream == false)
                {
                    string strLine = reader.ReadLine();

                    if (strLine == null)
                        break;

                    strLine = strLine.Trim().ToLower();

                    if (strLine.Length == 0)
                        continue;

                    if (strLine.StartsWith("ip"))
                    {
                        string strIP = GetValue(strLine, "ip");
                        this.textBoxIP.Text = strIP;
                    }
                    else if (strLine.StartsWith("port"))
                    {
                        string strPort = GetValue(strLine, "port");
                        this.textBoxPort.Text = strPort;
                    }
                }

                reader.Close();
            }
        }

        private void WriteMemory(string strIP, string strPort)
        {
            StreamWriter writer = new StreamWriter(FileName, false, Encoding.UTF8);
            writer.WriteLine("ip " + strIP);
            writer.WriteLine("port " + strPort);
            writer.Close();
        }

        private string GetValue(string strSrc, string strTrg)
        {
            return strSrc.Substring(strTrg.Length + 1).Trim();
        }

        private void btnConnect_Click(object sender, System.EventArgs e)
        {
            string strIP = this.textBoxIP.Text.Trim();

            if (strIP.Length == 0)
            {
                this.textBoxIP.Focus();
                MessageBox.Show("IP를 입력하세요.");
                return;
            }

            string strPort = this.textBoxPort.Text.Trim();

            if (strPort.Length == 0)
            {
                this.textBoxPort.Focus();
                MessageBox.Show("Port를 입력하세요.");
                return;
            }

            int port;

            if (int.TryParse(strPort, out port) == false || port <= 0)
            {
                this.textBoxPort.Focus();
                MessageBox.Show("Port는 0보다 큰 정수만 입력 가능합니다.");
                return;
            }

            WriteMemory(strIP, strPort);
            m_netMgr = new Network.NetworkManager(strIP, port);
            btnConnect.Enabled = false;
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (m_netMgr != null)
                m_netMgr.Stop();
        }

        private void btnSend_Click(object sender, System.EventArgs e)
        {
            string strSend = textBoxMessage.Text.Trim();

            if (strSend.Length == 0)
                return;

            string[] tokens = strSend.Split(' ');
            byte[] bytes = new byte[tokens.Length + 1];
            int index = 0;
            int sum = 0;

            foreach (string strToken in tokens)
            {
                bytes[index++] = System.Convert.ToByte(strToken.Trim(), 16);
                sum += (int)bytes[index - 1];
            }

            if (index > 0)
            {
                byte checkSum = (byte)(sum % 256);
                bytes[index++] = checkSum;
                m_netMgr.Send(bytes, 0, index);
            }

            textBoxMessage.Text = "";
        }
    }
}
