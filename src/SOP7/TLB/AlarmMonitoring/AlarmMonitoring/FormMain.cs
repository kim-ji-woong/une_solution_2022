using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AlarmMonitoring
{
    public partial class FormMain : Form
    {
        private static bool m_bTest = false;
        public static bool TestSignal
        {
            get { return m_bTest; }
        }
        private Main m_main = null;
        public FormMain()
        {
            InitializeComponent();
            Logger.Instance.Write("FormLoad");

            button1.Enabled = true;
            button2.Enabled = false;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            m_main = new Main();
            button1.Enabled = false;
            button2.Enabled = true;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (m_main != null)
                m_main.Stop();

            button1.Enabled = true;
            button2.Enabled = false;
        }

        private void FormMain_FormClosed(object sender, FormClosedEventArgs e)
        {
            if (m_main != null)
                m_main.Stop();
        }

        private void cbTest_CheckedChanged(object sender, EventArgs e)
        {
            m_bTest = cbTest.Checked;
        }
    }
}
