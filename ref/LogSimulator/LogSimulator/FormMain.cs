using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.IO;
using System.Windows.Forms;

namespace LogSimulator
{
    using Network.Server;
    using Utility;

    public partial class FormMain : Form
    {
        private ServerManager m_serverManager = new ServerManager();
        private List<byte[]> m_byteList = null;
        private int m_nByteIndex = -1;

        public FormMain()
        {
            InitializeComponent();
        }

        private void btnLogPath_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog openFileDialog = new OpenFileDialog())
            {
                openFileDialog.InitialDirectory = "c:\\";
                openFileDialog.Filter = "log files (*.log)|*.log|All files (*.*)|*.*";
                openFileDialog.FilterIndex = 2;
                openFileDialog.RestoreDirectory = true;

                if (openFileDialog.ShowDialog() == DialogResult.OK)
                {
                    //Get the path of specified file
                    string strFilePath = openFileDialog.FileName;
                    textBoxLogPath.Text = strFilePath;
                }
            }
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            string strPort = textBoxPort.Text.Trim();

            if (strPort.Length == 0)
            {
                MessageBox.Show("Port 번호를 입력하세요.");
                textBoxPort.Focus();
                return;
            }

            int portNo;

            if (int.TryParse(strPort, out portNo) == false || portNo <= 0)
            {
                MessageBox.Show("Port 번호는 0보다 큰 정수만 가능합니다.");
                textBoxPort.Focus();
                return;
            }

            string strServerIP = "";
            bool isTcp = true;

            if (checkBoxUdp.Checked)
            {
                strServerIP = textBoxIP.Text.Trim();
                isTcp = false;

                if (strServerIP.Length == 0)
                {
                    MessageBox.Show("IP 주소를 입력하세요.");
                    textBoxIP.Focus();
                    return;
                }
            }
   
            bool success = m_serverManager.Start(strServerIP, portNo, isTcp);

            btnSendDirect.Enabled = true;
            btnSend.Enabled = true;
            btnConnect.Enabled = false;
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            if (m_nByteIndex < 0 || m_byteList == null)
            {
                string strPath = textBoxLogPath.Text.Trim();

                if (strPath.Length == 0)
                {
                    MessageBox.Show("로그 파일의 경로를 입력하세요.");
                    textBoxLogPath.Focus();
                    return;
                }

                m_byteList = LogManager.GetByteList(strPath, textBoxLogTag.Text.Trim());
                m_nByteIndex = 0;
            }

            if (m_nByteIndex >= m_byteList.Count)
                return;

            byte[] bytes = m_byteList[m_nByteIndex++];
            m_serverManager.Send(bytes, bytes.Length);
        }

        private void btnSendDirect_Click(object sender, EventArgs e)
        {
            string strBytes = textBoxByteArray.Text.Trim();

            if (strBytes.Length == 0)
            {
                MessageBox.Show("전송할 Byte 배열을 입력하세요.");
                textBoxByteArray.Focus();
                return;
            }

            byte[] bytes = LogManager.GetBytes(strBytes, null);
            m_serverManager.Send(bytes, bytes.Length);
        }

        private void checkBox_CheckedChanged(object sender, EventArgs e)
        {
            if (sender == checkBoxTcp)
                checkBoxUdp.Checked = !checkBoxTcp.Checked;
            else
                checkBoxTcp.Checked = !checkBoxUdp.Checked;

            if (checkBoxUdp.Checked)
            {
                label2.Visible = true;
                textBoxIP.Visible = true;
            }
            else
            {
                label2.Visible = false;
                textBoxIP.Visible = false;
            }
        }
    }
}
