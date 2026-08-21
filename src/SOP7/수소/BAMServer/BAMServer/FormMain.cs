using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace BAMServer
{
    public partial class FormMain : Form
    {
        private ProcessManager m_processManager = null;

        public FormMain()
        {
            InitializeComponent();

            m_processManager = new ProcessManager();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            m_processManager.Start();
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            m_processManager.Stop();
        }
    }
}
