using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CCTVManager
{
    public partial class FormMain : Form
    {
        public FormMain()
        {
            SetSiteIDs(1234);
            InitializeComponent();
        }

        private List<int> m_siteIDs = new List<int>();
        private void SetSiteIDs(int nSiteID)
        {
            int size = ((int)Math.Log10(nSiteID)) + 1;

            int target = 100;

            for (int i=0;i<size;i+=2)
            {
                int siteID = nSiteID % target;
                m_siteIDs.Add(siteID);

                nSiteID = nSiteID / target;
            }
        }

        private void btnRun_Click(object sender, EventArgs e)
        {
            string strUrl = textBoxWebServerURL.Text.Trim();
            string strTitle = textBoxTitle.Text.Trim();
            string[] tokens = textBoxLocation.Text.Trim().Split(',');
            string strID = textBoxID.Text.Trim();

            if (tokens.Length == 2)
            {
                int x, y, id;

                if (int.TryParse(tokens[0].Trim(), out x) && int.TryParse(tokens[1].Trim(), out y) && int.TryParse(strID, out id))
                    Executer.Run(strUrl, strTitle, x, y, id);
            }
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            string strUrl, strTitle;
            int x, y, id;

            if (ConfigManager.GetData(out strUrl, out strTitle, out x, out y, out id))
            {
                textBoxWebServerURL.Text = strUrl;
                textBoxTitle.Text = strTitle;
                textBoxLocation.Text = x.ToString() + "," + y.ToString();
                textBoxID.Text = id.ToString();
            }
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            ConfigManager.SetData(textBoxWebServerURL.Text.Trim(), textBoxTitle.Text.Trim(), textBoxLocation.Text.Trim(), textBoxID.Text.Trim());
        }
    }
}
