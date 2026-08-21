using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WonikErpNSheServer
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
            
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            
        }

        private void button1_Click(object sender, EventArgs e)
        {
            m_processManager.Start();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            m_processManager.Stop();
        }
    }
}
