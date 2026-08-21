using System;
using System.Windows.Forms;

namespace WonikLPR
{
    /// <summary>
    /// WinForm 진입 (SERVICE 미정의시 사용).
    /// 로그는 콘솔에만 출력하며, 폼은 처리 시작/중지만 담당한다.
    /// </summary>
    public partial class MainForm : Form
    {
        private ProcessManager m_processManager = null;

        public MainForm()
        {
            InitializeComponent();

            m_processManager = new ProcessManager();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            m_processManager.Start();

            m_labelStatus.Text = "동작중 - 로그는 콘솔 창에 출력됩니다.";
        }

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            m_processManager.Stop();
        }
    }
}
