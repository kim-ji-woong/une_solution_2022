using SujainFireServer.Data;
using SujainFireServer.Network;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SujainFireServer
{
    public partial class FormMain : Form
    {
        private WebDataManager m_dataManager = null;
        private ExternalManager m_externalManager = null;
        private NetworkManager m_NetworkManager = null;

        private static FormMain m_instance = null;
        public static FormMain Instance
        {
            get { return m_instance; }
        }

        public FormMain()
        {
            m_instance = this;
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            m_dataManager = new WebDataManager();
            m_externalManager = new ExternalManager();

            m_NetworkManager = new NetworkManager(m_dataManager, m_externalManager);
        }

        public void OnReceive(TcpLib2.ConnectionState state, byte[] receivedData)
        {
            if (receivedData == null)
                return;

            System.Net.IPEndPoint endPoint = (System.Net.IPEndPoint)state.RemoteEndPoint;
            string strIP = endPoint.Address.ToString();

            string strReceived = Encoding.UTF8.GetString(receivedData, 0, receivedData.Length);

            Invoke((MethodInvoker)delegate
            {
                if (textBoxDialogue.Text.Length == 0)
                    textBoxDialogue.Text += strIP + " : " + strReceived;
                else
                    textBoxDialogue.Text += "\r\n" + strIP + " : " + strReceived;
            });
        }
    }
}
