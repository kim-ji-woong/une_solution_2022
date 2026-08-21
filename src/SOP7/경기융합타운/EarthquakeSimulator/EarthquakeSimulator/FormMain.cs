using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EarthquakeSimulator
{
    using Data;

    public partial class FormMain : Form
    {
        private DBManager m_dbMgr = new DBManager();

        public FormMain()
        {
            InitializeComponent();
        }

        private void btnApply_Click(object sender, EventArgs e)
        {
            m_dbMgr.SetData(textBoxDbHost.Text.Trim(), textBoxGal.Text.Trim());
        }

        private void OnTimer(object sender, EventArgs e)
        {
            m_dbMgr.WriteData();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            timer1.Start();
        }
    }
}
