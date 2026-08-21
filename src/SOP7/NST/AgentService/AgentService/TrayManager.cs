using System;
using System.Timers;
using System.Windows.Forms;
using System.Drawing;
using System.Runtime.InteropServices;
using System.IO;
using System.Collections.Generic;

namespace AgentService
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

        private SDMS.IDAL.IDataManager m_dataManager = null;
        private Common.IDAL.IDataManager m_commonDataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;

        private LocationManager m_locationManager = null;
        private System.Timers.Timer m_timer = null;

        private string m_strCopySourceFolder = null;
        private string m_strCopySourcePattern = null;
        private string m_strCopyTarget = null;

        public TrayManager()
        {
            CreateNotifyicon();
            SetDataManager();
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
            this.m_contextMenu.Size = new System.Drawing.Size(181, 35);

            // Create the NotifyIcon.
            this.m_icon = new System.Windows.Forms.NotifyIcon(this.components);

            // The Icon property sets the icon that will appear
            // in the systray for this application.
            m_icon.Icon = AgentService.Resources.SDMS_BLUE;

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            m_icon.ContextMenuStrip = this.m_contextMenu;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            m_icon.Text = "NST Agent";
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
            m_timer.Stop();
            Application.Exit();
        }

        private void trayIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                m_contextMenu.Show();
        }

        private void SetDataManager()
        {
            string strWebServerURL = System.Configuration.ConfigurationManager.AppSettings["webServerURL"].ToString();
            string strDBName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            string strDBType = System.Configuration.ConfigurationManager.AppSettings["dbType"].ToString();

            int nDBType;

            if (int.TryParse(strDBType.Trim(), out nDBType))
            {
                m_dataManager = new SDMS.DAL.DataManager(strDBName, nDBType, 1, strWebServerURL);
                m_commonDataManager = new Common.DAL.DataManager(strDBName, nDBType, 1, strWebServerURL);
                m_teamDataManager = new TeamEditor.DAL.DataManager(strDBName, nDBType, 1, strWebServerURL);

                string strLocationWebServiceUrl = System.Configuration.ConfigurationManager.AppSettings["locationUrl"].ToString();
                string strWorkerCount = System.Configuration.ConfigurationManager.AppSettings["workerCount"].ToString();

                int nWorkerCount;

                if (int.TryParse(strWorkerCount.Trim(), out nWorkerCount))
                {
                    m_locationManager = new LocationManager(strLocationWebServiceUrl, nWorkerCount, m_commonDataManager, m_dataManager);

                    m_timer = new System.Timers.Timer(3000);
                    m_timer.Elapsed += OnTimer;
                    m_timer.Start();
                }
            }

            string strUseCopyFile = System.Configuration.ConfigurationManager.AppSettings["useCopyFile"].ToString();

            if (strUseCopyFile.ToLower().Trim() == "true")
            {
                string strCopySourceFolder = System.Configuration.ConfigurationManager.AppSettings["copySourceFolder"].ToString();
                string strCopySourcePattern = System.Configuration.ConfigurationManager.AppSettings["copySourcePattern"].ToString();
                string strCopyTarget = System.Configuration.ConfigurationManager.AppSettings["copyTarget"].ToString();

                if (strCopySourceFolder != null && strCopySourceFolder.Trim().Length > 0 &&
                    strCopySourcePattern != null && strCopySourcePattern.Trim().Length > 0 &&
                    strCopyTarget != null && strCopyTarget.Trim().Length > 0)
                {
                    m_strCopySourceFolder = strCopySourceFolder;
                    m_strCopySourcePattern = strCopySourcePattern;
                    m_strCopyTarget = strCopyTarget;
                }
            }
        }

        private void OnTimer(object sender, ElapsedEventArgs e)
        {
            string strErrorMessage;

            if (m_locationManager.ReadData(m_teamDataManager, out strErrorMessage) == false)
            {
                /*Logger.Instance.Write("ReadData Error : " + strErrorMessage);
                System.Diagnostics.Trace.WriteLine("ReadData Error : " + strErrorMessage);*/
            }

            if (m_strCopySourceFolder != null)
            {
                CopyFile();
            }
        }

        private void CopyFile()
        {
            string[] files = Directory.GetFiles(m_strCopySourceFolder, m_strCopySourcePattern);

            if (files.Length > 0)
            {
                string strLastFile = GetLastFile(files);
                File.Copy(strLastFile, m_strCopyTarget, true);
            }
        }

        private string GetLastFile(string[] files)
        {
            List<string> fileList = new List<string>();

            foreach (string strFile in files)
            {
                fileList.Add(strFile);
            }

            fileList.Sort();

            return fileList[fileList.Count - 1];
        }
    }
}
