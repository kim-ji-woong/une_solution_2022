using System;
using System.Configuration;
using System.Windows.Forms;

namespace ParkingDoorMonitor
{
    public partial class FormMain : Form
    {
        private DoorManager m_doorManager = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void OnTimer(object sender, EventArgs e)
        {
            m_doorManager.ReadDatas();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            string strBaseUrl = ConfigurationManager.AppSettings.Get("BaseUrl");
            m_doorManager = new DoorManager(strBaseUrl);

            timer1.Start();
        }
    }
}
