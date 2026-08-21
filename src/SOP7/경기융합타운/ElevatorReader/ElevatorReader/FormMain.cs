using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ElevatorReader
{
    using Network;

    public partial class FormMain : Form
    {
        private NetworkManager m_netMgr = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            string strIP = textBoxIP.Text;
            string strPort = textBoxPort.Text;

            int nPort;

            if (int.TryParse(strPort, out nPort))
            {
                m_netMgr = new NetworkManager();
                m_netMgr.Start(strIP, nPort);
            }
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (m_netMgr != null)
                m_netMgr.Stop();
        }
    }
}
