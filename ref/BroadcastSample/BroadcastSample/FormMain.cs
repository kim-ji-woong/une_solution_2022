using System;
using System.Windows.Forms;
using dnsBroadcast;

namespace BroadcastSample
{
    public partial class FormMain : Form
    {
        private BaseMessageClient m_messageClient = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            btnStopBroadcast.Enabled = false;
            btnPauseBroadcast.Enabled = false;
        }

        private void Run()
        {
            btnRunBroadcast.Enabled = false;
            btnStopBroadcast.Enabled = true;
            btnPauseBroadcast.Enabled = true;

            m_messageClient = MessageClientFactory.CreateMessageClient(null);
            m_messageClient.OnCompleteBroadcast = this.OnCompleteBroadcast;

            m_messageClient.SirenFile = @"D:\UnESolution\bin\common12\66084^air-raid-siren-alert.mp3";
            m_messageClient.Run(false, "현재 평양 김일성대학 1층에서 화재가 탐지되었습니다. 근처에 계신분들은 즉시 대피하시기 바랍니다.");
            //m_messageClient.Run(true, "");
        }

        private void btnRunBroadcast_Click(object sender, EventArgs e)
        {
            if (m_messageClient == null)
                Run();
            else
            {
                m_messageClient.Resume();

                btnRunBroadcast.Enabled = false;
                btnStopBroadcast.Enabled = true;
                btnPauseBroadcast.Enabled = true;
            }
        }

        private void btnStopBroadcast_Click(object sender, EventArgs e)
        {
            if (m_messageClient != null)
            {
                m_messageClient.Stop();

                btnRunBroadcast.Enabled = true;
                btnStopBroadcast.Enabled = false;
                btnPauseBroadcast.Enabled = false;
            }
        }

        private void btnPauseBroadcast_Click(object sender, EventArgs e)
        {
            if (m_messageClient != null)
            {
                m_messageClient.Pause();

                btnRunBroadcast.Enabled = true;
                btnStopBroadcast.Enabled = true;
                btnPauseBroadcast.Enabled = false;
            }
        }

        private void OnCompleteBroadcast(BaseMessageClient sender, BaseMessageClient.Status status)
        {
            if (status == BaseMessageClient.Status.Completed)
                System.Diagnostics.Trace.WriteLine("Complete Broadcast");
            else if (status == BaseMessageClient.Status.Stopped)
                System.Diagnostics.Trace.WriteLine("Cancel Broadcast");
            else if (status == BaseMessageClient.Status.Error)
                System.Diagnostics.Trace.WriteLine("Error Broadcast");

            btnRunBroadcast.Enabled = true;
            btnStopBroadcast.Enabled = false;
            btnPauseBroadcast.Enabled = false;

            m_messageClient = null;
        }
    }
}
