using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EmergencyBell_Nextronics
{
    using Network;

    public partial class FormMain : Form, IOwner
    {
        private NetworkManager m_netMgr = null;

        public FormMain()
        {
            InitializeComponent();

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            m_netMgr = new NetworkManager(25000, this);
        }

        public void WriteLog(string strLog)
        {
            this.Invoke((MethodInvoker)delegate
            {
                string strText = this.textBoxLog.Text;

                if (strText.Length == 0)
                    this.textBoxLog.Text = strLog;
                else
                    this.textBoxLog.Text = strText + "\r\n" + strLog;

                this.textBoxLog.SelectionStart = this.textBoxLog.Text.Length;
                this.textBoxLog.ScrollToCaret();
            });
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            m_netMgr.Start();
            btnStart.Enabled = false;
        }
    }
}
