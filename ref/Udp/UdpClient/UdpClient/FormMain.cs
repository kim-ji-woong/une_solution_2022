using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.IO;
using System.Windows.Forms;

namespace UdpClient
{
    using Network;

    public partial class FormMain : Form
    {
        private UdpClient m_udpClient = null;
        private List<byte[]> m_byteList = new List<byte[]>();
        private int m_nBytesIndex = 0;

        public FormMain()
        {
            InitializeComponent();
            m_udpClient = new UdpClient();
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            string strPortNo = textBoxPortNo.Text.Trim();
            string strIP = textBoxIP.Text.Trim();

            if (strPortNo.Length == 0)
            {
                MessageBox.Show("Port 번호를 입력하세요.");
                return;
            }

            if (strIP.Length == 0)
            {
                MessageBox.Show("IP 주소를 입력하세요.");
                return;
            }

            int portNo;

            if (int.TryParse(strPortNo, out portNo) == false || portNo < 0)
            {
                MessageBox.Show("Port 번호는 0보다 큰 정수이어야 합니다.");
                return;
            }

            btnStart.Enabled = false;
            textBoxPortNo.Enabled = textBoxIP.Enabled = false;
            btnSend.Enabled = true;

            m_udpClient.Start(strIP, portNo);
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            ReadMessage();

            if (m_nBytesIndex < m_byteList.Count)
            {
                byte[] bytes = m_byteList[m_nBytesIndex++];
                m_udpClient.Send(bytes);
            }
            else
            {
                MessageBox.Show("모든 로그를 전송하였습니다.");
            }
        }

        private bool ReadMessage()
        {
            m_byteList.Clear();
            string strMessage = textBoxMessage.Text.Trim();

            if (strMessage == null || strMessage.Length == 0)
            {
                textBoxMessage.Focus();
                MessageBox.Show("전송할 메시지를 입력하세요.");
                return false;
            }

            byte[] bytes = Encoding.UTF8.GetBytes(strMessage);
            m_byteList.Add(bytes);
            m_nBytesIndex = 0;
            return true;
        }
    }
}
