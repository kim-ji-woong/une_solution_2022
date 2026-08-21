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
    public partial class FormCheatedTagging : Form
    {
        private IControlOwner m_owner = null;

        public FormCheatedTagging(IControlOwner owner)
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
            if (cboTaggingCount.SelectedIndex < 0)
                m_owner.SetScript("");

            string strTaggingCount = "";

            if (cboTaggingCount.SelectedIndex > 0)
                strTaggingCount = string.Format("CardTaggingCount >= {0}", cboTaggingCount.SelectedIndex);

            string strElapsedTime = "";

            if (cboElapsedTime.SelectedIndex <= 0)
                strElapsedTime = "";
            else if (cboElapsedTime.SelectedIndex <= 5)
                strElapsedTime = string.Format("ElapsedTime <= '0:00:{0}0'", cboElapsedTime.SelectedIndex);
            else
                strElapsedTime = string.Format("ElapsedTime <= '0:{0:00}:00'", cboElapsedTime.SelectedIndex - 5);

            if (strTaggingCount.Length > 0)
            {
                if (strElapsedTime.Length > 0)
                    m_owner.SetScript(strTaggingCount + " while " + strElapsedTime);
                else
                    m_owner.SetScript(strTaggingCount);
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
