using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace UdpServer
{
    using Network;

    public partial class FormMain : Form, IPostBox
    {
        private UdpServer m_udpServer = null;

        public FormMain()
        {
            InitializeComponent();
            m_udpServer = new UdpServer(this);
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            string strPortNo = textBoxPortNo.Text.Trim();

            if (strPortNo.Length == 0)
            {
                MessageBox.Show("Port 번호를 입력하세요.");
                return;
            }

            int portNo;

            if (int.TryParse(strPortNo, out portNo) == false || portNo < 0)
            {
                MessageBox.Show("Port 번호는 0보다 큰 정수이어야 합니다.");
                return;
            }

            btnStart.Enabled = false;
            textBoxPortNo.Enabled = false;
            textBoxMessage.Enabled = true;
            btnSend.Enabled = true;

            m_udpServer.Start(portNo);
        }

        public void ProcessMessage(byte[] bytes, int size)
        {
            string strMessage = Encoding.UTF8.GetString(bytes, 0, size);

            this.Invoke((MethodInvoker)delegate
            {
                AddHistory("[Recv] " + strMessage);
            });
        }

        private void AddHistory(string strMessage)
        {
            string strHistory = textBoxHistory.Text.Trim();

            if (strHistory.Length == 0)
                strHistory = strMessage;
            else
                strHistory += "\r\n" + strMessage;

            textBoxHistory.Text = strHistory;
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            string strMessage = textBoxMessage.Text.Trim();

            if (strMessage.Length > 0)
            {
                m_udpServer.Send(strMessage);
                AddHistory("[Send] " + strMessage);
            }

            textBoxMessage.Text = "";
        }
    }

    public interface IPostBox
    {
        void ProcessMessage(byte[] bytes, int size);
    }
}
