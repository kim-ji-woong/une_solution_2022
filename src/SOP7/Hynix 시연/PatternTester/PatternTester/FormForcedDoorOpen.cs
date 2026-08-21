using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PatternTester
{
    public partial class FormForcedDoorOpen : Form
    {
        private IControlOwner m_owner = null;

        public FormForcedDoorOpen(IControlOwner owner)
        {
            InitializeComponent();
            TopLevel = false;
            m_owner = owner;
        }

        private void cboTaggingFailCount_SelectedIndexChanged(object sender, EventArgs e)
        {
            SendScript();
        }

        private void cboElapsedTime_SelectedIndexChanged(object sender, EventArgs e)
        {
            SendScript();
        }

        private void SendScript()
        {
            if (cboTaggingFailCount.SelectedIndex < 0)
                m_owner.SetScript("");

            string strTaggingFailCount = "";

            if (cboTaggingFailCount.SelectedIndex > 0)
                strTaggingFailCount = string.Format("CardDeniedCount >= {0}", cboTaggingFailCount.SelectedIndex);

            string strElapsedTime = "";

            if (cboElapsedTime.SelectedIndex > 0)
                strElapsedTime = string.Format("ElapsedTime <= '0:{0:00}:00'", cboElapsedTime.SelectedIndex);

            if (strTaggingFailCount.Length > 0)
            {
                if (strElapsedTime.Length > 0)
                    m_owner.SetScript(strTaggingFailCount + " while " + strElapsedTime);
                else
                    m_owner.SetScript(strTaggingFailCount);
            }
            else
                m_owner.SetScript("");
        }

        public void GetScript()
        {
            SendScript();
        }
    }
}
