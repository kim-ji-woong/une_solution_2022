using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace powerDataServer
{
    public partial class Form1 : Form
    {
        ProcessManager m_processManager = null;

        public Form1()
        {
            InitializeComponent();

            m_processManager = new ProcessManager();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            m_processManager.Start();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            m_processManager.Stop();
        }
    }
}
