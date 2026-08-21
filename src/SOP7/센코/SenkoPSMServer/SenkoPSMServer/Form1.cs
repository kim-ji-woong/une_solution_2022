using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SenkoPSMServer
{
    public partial class Form1 : Form
    {
        ProcessManager m_processMgr = null;

        public Form1()
        {
            InitializeComponent();

            m_processMgr = new ProcessManager();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            m_processMgr.Start();
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {

        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            m_processMgr.Stop();
        }

        private void Form1_GiveFeedback(object sender, GiveFeedbackEventArgs e)
        {

        }
    }
}
