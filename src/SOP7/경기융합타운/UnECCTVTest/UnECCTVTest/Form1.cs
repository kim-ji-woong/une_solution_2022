using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.IO;
using System.Windows.Forms;

namespace UnECCTVTest
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            string strUrl = textBoxUrl.Text.Trim();
            //vlcControl1.Play(new Uri(strUrl));
            this.vlcPanelLT.Url = strUrl;
        }

        private DirectoryInfo GetVlcDirectory()
        {
            var vlcLibDirectory = new DirectoryInfo(Path.Combine("./", "libvlc", IntPtr.Size == 4 ? "win-x86" : "win-x64"));
            return vlcLibDirectory;
        }
    }
}
