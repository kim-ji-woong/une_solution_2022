using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Drawing;
using System.Runtime.InteropServices;

namespace SoPluginContainer
{
    public class TrayManager
    {
        [StructLayout(LayoutKind.Sequential)]
        public struct PointInter
        {
            public int X;
            public int Y;
            public static explicit operator Point(PointInter point)
            {
                return new Point(point.X, point.Y);
            }
        }

        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out PointInter lpPoint);

        private NotifyIcon m_icon = null;
        private ContextMenuStrip m_contextMenu = null;
        private System.ComponentModel.IContainer components;

        private System.Windows.Forms.ToolStripMenuItem tsMenuClose;

        ProcessManager m_processManager = null;

        public TrayManager()
        {
            CreateNotifyicon();

            m_processManager = new ProcessManager();
            m_processManager.Start();
        }

        private void CreateNotifyicon()
        {
            this.components = new System.ComponentModel.Container();
            this.m_contextMenu = new System.Windows.Forms.ContextMenuStrip();

            this.m_contextMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.tsMenuClose = new System.Windows.Forms.ToolStripMenuItem();

            // Initialize contextMenu1
            this.m_contextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsMenuClose});
            this.m_contextMenu.Size = new System.Drawing.Size(181, 140);

            // Create the NotifyIcon.
            this.m_icon = new System.Windows.Forms.NotifyIcon(this.components);

            // The Icon property sets the icon that will appear
            // in the systray for this application.
            m_icon.Icon = global::SoPluginContainer.Properties.Resources.SDMS_BLUE;

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            m_icon.ContextMenuStrip = this.m_contextMenu;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            m_icon.Text = "SVMSServer";
            m_icon.Visible = true;

            // Handle the DoubleClick event to activate the form.
            m_icon.MouseClick += new System.Windows.Forms.MouseEventHandler(this.trayIcon_MouseClick);

            // 
            // tsMenuClose
            // 
            this.tsMenuClose.Name = "tsMenuClose";
            this.tsMenuClose.Size = new System.Drawing.Size(180, 22);
            this.tsMenuClose.Text = "종료";
            this.tsMenuClose.Click += new System.EventHandler(this.tsMenuClose_Click);
        }

        private void tsMenuClose_Click(object sender, EventArgs e)
        {
            // 1) 백그라운드 작업 정지 (타이머/메시지 스레드 종료 플래그)
            try
            {
                if (m_processManager != null)
                    m_processManager.Stop();
            }
            catch (Exception ex)
            {
                Logger.Instance.Write("[TrayManager] ProcessManager.Stop 오류 : " + ex.Message);
            }

            // 2) 트레이 아이콘 제거 (남는 아이콘 방지)
            try
            {
                if (m_icon != null)
                {
                    m_icon.Visible = false;
                    m_icon.Dispose();
                    m_icon = null;
                }
            }
            catch { }

            // 3) 프로세스 확실히 종료.
            //    이 앱은 WPF이므로 WinForms의 Application.Exit()로는 종료되지 않고,
            //    SVMS SDK가 포그라운드 스레드를 유지할 수 있어 Environment.Exit로 강제 종료한다.
            Environment.Exit(0);
        }

        private void trayIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                m_contextMenu.Show();
        }
    }
}
