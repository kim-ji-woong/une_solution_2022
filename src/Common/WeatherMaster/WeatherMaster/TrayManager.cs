using System;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Configuration;
using dnsDBUtil;
using Weather.DAL;

namespace WeatherMaster
{
    public class TrayManager
    {
        private class ProcessInfo
        {
            private string m_strProcessPath = "";
            private string m_strProcessName = "";
            private string m_strProcessParam = "";

            public string Path
            {
                get { return m_strProcessPath; }
                set { m_strProcessPath = value; }
            }

            public string Name
            {
                get { return m_strProcessName; }
                set { m_strProcessName = value; }
            }

            public string Param
            {
                get { return m_strProcessParam; }
                set { m_strProcessParam = value; }
            }
        }

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

        private ToolStripMenuItem tsMenuClose;
        private Timer m_timer = null;
        private bool m_runProcess = false;

        private string m_strAppName = "WeatherMaster";
        private string m_strKey = "";
        private int m_nTargetCoordX = -1, m_nTargetCoordY = -1;

        private DataManager m_dataManager = null;

        public TrayManager()
        {
            if (ReadConfig())
            {
                CreateNotifyicon();

                m_timer = new Timer();
                // 10초에 한번씩 동작
                m_timer.Interval = 1000 * 10;
                m_timer.Tick += OnTimer;
                m_timer.Start();

                // 시작과 동시에 한번 실행시킨다.
                OnTimer(null, null);
            }
        }

        private bool ReadConfig()
        {
            string strKey = ConfigurationManager.AppSettings["key"];
            string strExpired = ConfigurationManager.AppSettings["expired"];

            if (strKey != null && strExpired != null)
            {
                DateTime dtNow = DateTime.Now;
                string strNow = string.Format("{0}{1:00}{2:00}", dtNow.Year, dtNow.Month, dtNow.Day);

                if (string.Compare(strNow, strExpired) >= 0)
                {
                    MessageBox.Show("API 호출키의 유효기간이 지났습니다.\r\n새로 발급받으세요.");
                    return false;
                }
                else
                    m_strKey = strKey;
            }

            string strSiteID = ConfigurationManager.AppSettings["siteID"];
            string strDBName = ConfigurationManager.AppSettings["dbName"];
            string strDBType = ConfigurationManager.AppSettings["dbType"];
            string strDBHost = ConfigurationManager.AppSettings["dbHost"];
            string strDbId = ConfigurationManager.AppSettings["dbID"];
            string strDbPw = ConfigurationManager.AppSettings["dbPW"];

            if (strSiteID != null && strDBName != null &&
                strDBType != null && strDBHost != null &&
                strDbId != null && strDbPw != null)
            {
                int nSiteID, nDBType;

                if (int.TryParse(strSiteID.Trim(), out nSiteID) == false)
                {
                    MessageBox.Show("siteID는 정수이어야만 합니다.");
                    return false;
                }

                if (int.TryParse(strDBType.Trim(), out nDBType) == false)
                {
                    MessageBox.Show("dbType은 정수이어야만 합니다.");
                    return false;
                }

                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                strDBHost = AES256Cipher.AES_decrypt(strDBHost, key);
                strDbId = AES256Cipher.AES_decrypt(strDbId, key);
                strDbPw = AES256Cipher.AES_decrypt(strDbPw, key);

                m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDbId, strDbPw, nSiteID);
            }

            string strTargetCoord = ConfigurationManager.AppSettings["targetCoord"];

            if (strTargetCoord != null)
            {
                int nIndex = strTargetCoord.IndexOf('_');

                if (nIndex > 0)
                {
                    string strX = strTargetCoord.Substring(0, nIndex).Trim();
                    string strY = strTargetCoord.Substring(nIndex + 1).Trim();

                    int x, y;

                    if (int.TryParse(strX, out x) && int.TryParse(strY, out y))
                    {
                        m_nTargetCoordX = x;
                        m_nTargetCoordY = y;
                        return true;
                    }
                }
            }

            MessageBox.Show("targetCoord가 존재하지 않거나 잘못된 값입니다.");
            return false;
        }

        private void OnTimer(object sender, EventArgs e)
        {
            if (m_runProcess)
                return;

            m_runProcess = true;

            if (WeatherManager.ReadWeatherInfo(m_nTargetCoordX, m_nTargetCoordY, m_strKey, m_dataManager) == false)
            {
                m_timer.Stop();
            }

            m_runProcess = false;
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
            this.m_contextMenu.Size = new System.Drawing.Size(181, 70);

            // Create the NotifyIcon.
            this.m_icon = new System.Windows.Forms.NotifyIcon(this.components);

            // The Icon property sets the icon that will appear
            // in the systray for this application.
            m_icon.Icon = global::WeatherMaster.Resource.weather;

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            m_icon.ContextMenuStrip = this.m_contextMenu;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            m_icon.Text = m_strAppName;
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
    }
}
