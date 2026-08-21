using System;
using System.Windows.Forms;
using System.Collections.Generic;

namespace BiostarDoorTester
{
    using Process;
    using Data;

    public partial class FormMain : Form
    {
        private static FormMain m_instance = null;

        public static FormMain Instance
        {
            get { return m_instance; }
        }

        private LoginManager m_loginManager = new LoginManager();

        public FormMain()
        {
            m_instance = this;
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            textBoxServerIP.Text = ConfigManager.GetServerIP();
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            string strErrorMessage;

            if (m_loginManager.Login(textBoxServerIP.Text.Trim(), out strErrorMessage) == false)
            {
                MessageBox.Show(strErrorMessage);
            }
            else
            {
                btnLogin.Enabled = false;
                btnLogout.Enabled = true;

                textBoxHeader.Text = m_loginManager.Header;
                textBoxBody.Text = m_loginManager.Body;
            }
        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            string strErrorMessage;

            if (m_loginManager.Logout(textBoxServerIP.Text.Trim(), out strErrorMessage) == false)
            {
                MessageBox.Show(strErrorMessage);
            }
            else
            {
                btnLogin.Enabled = true;
                btnLogout.Enabled = false;

                textBoxHeader.Text = m_loginManager.Header;
                textBoxBody.Text = m_loginManager.Body;
            }
        }

        private void btnSearch_Click(object sender, EventArgs e)
        {
            string strErrorMessage;
            string strResult = DoorManager.RequestAllDoors(textBoxServerIP.Text.Trim(), m_loginManager.SessionID, out strErrorMessage);

            if (strResult == null)
                MessageBox.Show(strErrorMessage);
            else
            {
                textBoxBody.Text = strResult;

                List<Door> doors = DoorManager.GetDoors(strResult, out strErrorMessage);

                if (doors == null)
                {
                    MessageBox.Show(strErrorMessage);
                    return;
                }

                textBoxHeader.Text = DoorManager.GetDoorsString(doors);
            }
        }

        private void btnStatus_Click(object sender, EventArgs e)
        {
            string strErrorMessage;
            string strResult = DoorManager.RequestStatus(textBoxServerIP.Text.Trim(), m_loginManager.SessionID, out strErrorMessage);

            if (strResult == null)
                MessageBox.Show(strErrorMessage);
            else
            {
                textBoxBody.Text = strResult;

                List<Door> doors = DoorManager.GetStatus(strResult, out strErrorMessage);

                if (doors == null)
                {
                    MessageBox.Show(strErrorMessage);
                    return;
                }

                textBoxHeader.Text = DoorManager.GetDoorsString(doors);
            }
        }

        private System.IO.StreamWriter m_writer = new System.IO.StreamWriter("log.txt", false, System.Text.Encoding.UTF8);

        public void WriteLog(string strLog)
        {
            m_writer.WriteLine(strLog);
            m_writer.Flush();
        }

        private void btnNormal_Click(object sender, EventArgs e)
        {
            string strUrl = textBoxServerIP.Text.Trim();
            string strJson = textBoxHeader.Text.Trim();

            string strErrorMessage;
            string strResult = NormalManager.Request(strUrl, strJson, out strErrorMessage);

            if (strResult == null)
                textBoxBody.Text = strErrorMessage;
            else
                textBoxBody.Text = strResult;
        }
    }
}
