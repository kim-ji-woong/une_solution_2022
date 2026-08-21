using System;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.IO;
using System.Drawing;

namespace RTSPViewer
{
    public partial class FormMain : Form
    {
        [DllImport("Gdi32.dll", EntryPoint = "CreateRoundRectRgn")]
        private static extern IntPtr CreateRoundRectRgn
        (
            int nLeftRect,     // x-coordinate of upper-left corner
            int nTopRect,      // y-coordinate of upper-left corner
            int nRightRect,    // x-coordinate of lower-right corner
            int nBottomRect,   // y-coordinate of lower-right corner
            int nWidthEllipse, // width of ellipse
            int nHeightEllipse // height of ellipse
        );

        private MouseHelper m_ctrlHelper = null;
        private string m_strUrl = null;

        // 크기 변경시 화면깜빡임 방지
        protected override CreateParams CreateParams
        {
            get
            {
                var cp = base.CreateParams;
                cp.ExStyle |= 0x02000000;
                return cp;
            }
        }

        public FormMain(int? x, int? y, int? width, int? height, string strUrl)
        {
            InitializeComponent();

            if (x != null && y != null)
            {
                this.StartPosition = FormStartPosition.Manual;
                this.Location = new Point((int)x, (int)y);
            }

            if (width != null && height != null)
                this.Size = new Size((int)width, (int)height);

            m_strUrl = strUrl;

            ChangeSize(this.Width, this.Height);
            m_ctrlHelper = new MouseHelper(this);
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            string strUrl = m_strUrl != null ? m_strUrl : System.Configuration.ConfigurationManager.AppSettings["url"];

            if (strUrl != null)
            {
                strUrl = strUrl.Trim();

                if (strUrl.Length > 0)
                {
                    this.vlcControl1.Play(new Uri(strUrl));
                }
            }
        }

        private void vlcControl_VlcLibDirectoryNeeded(object sender, Vlc.DotNet.Forms.VlcLibDirectoryNeededEventArgs e)
        {
            var currentAssembly = Assembly.GetEntryAssembly();
            var currentDirectory = new FileInfo(currentAssembly.Location).DirectoryName;
            // Default installation path of VideoLAN.LibVLC.Windows
            e.VlcLibDirectory = new DirectoryInfo(Path.Combine(currentDirectory, "libvlc", IntPtr.Size == 4 ? "win-x86" : "win-x64"));
        }

        private void FormMain_MouseDown(object sender, MouseEventArgs e)
        {
            m_ctrlHelper.OnMouseDown(e, Control.MousePosition);
        }

        private void FormMain_MouseMove(object sender, MouseEventArgs e)
        {
            m_ctrlHelper.OnMouseMove(sender, e, Control.MousePosition);
        }

        private void FormMain_MouseUp(object sender, MouseEventArgs e)
        {
            m_ctrlHelper.OnMouseUp(e);
        }

        private void FormMain_MouseEnter(object sender, EventArgs e)
        {
            m_ctrlHelper.OnMouseEnter(Control.MousePosition);
        }

        private void FormMain_MouseLeave(object sender, EventArgs e)
        {
            m_ctrlHelper.OnMouseLeave();
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        public void ChangeSize(int width, int height)
        {
            this.Size = new Size(width, height);
            this.Region = Region.FromHrgn(CreateRoundRectRgn(0, 0, this.Width, this.Height, 20, 20));
            this.vlcControl1.Region = Region.FromHrgn(CreateRoundRectRgn(0, 0, this.vlcControl1.Width, this.vlcControl1.Height, 10, 10));
            this.panelInfo.Region = Region.FromHrgn(CreateRoundRectRgn(0, 0, this.panelInfo.Width, this.panelInfo.Height, 10, 10));
        }
    }
}
