using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Windows.Forms;
using System.IO;
using dnsBroadcast;

namespace BroadcastServer
{
    public class TrayManager
    {
        public enum BroadcastStatus { Run = 0, Complete, Stop, Pause, TimeOut };

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

        // Etc Sensor 알람 재발생 여유시간(초)
        private const double EtcSensorCoolTimeSeconds = 5;

        private NotifyIcon m_icon = null;
        private ContextMenuStrip m_contextMenu = null;
        private System.ComponentModel.IContainer components;

        private System.Windows.Forms.ToolStripMenuItem tsMenuClose;
        private System.Timers.Timer m_timer = null;
        private string m_strTargetFile = "";

        public TrayManager()
        {
            CreateNotifyicon();
            SetDataManager();
            SetTimer();
        }

        private void SetTimer()
        {
            m_timer = new System.Timers.Timer(1000);
            m_timer.Elapsed += OnTimer;
            m_timer.Start();
        }

        private void OnTimer(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (m_strTargetFile.Length > 0)
            {
                if (File.Exists(m_strTargetFile))
                {
                    try
                    {
                        StreamReader reader = new StreamReader(m_strTargetFile, System.Text.Encoding.UTF8);
                        string strMessage = "";

                        int actionStepHistoryID = -1;
                        int componentID = -1;
                        string strReturnFile = "", strDeleteFile = "";

                        while (reader.EndOfStream == false)
                        {
                            string strLine = reader.ReadLine().Trim();

                            if (strLine.Length > 0)
                            {
                                if (actionStepHistoryID < 0)
                                {
                                    if (int.TryParse(strLine, out actionStepHistoryID))
                                        continue;
                                    else
                                    {
                                        strDeleteFile = strLine;
                                        break;
                                    }
                                }
                                else if (componentID < 0)
                                {
                                    if (int.TryParse(strLine, out componentID))
                                        continue;
                                }
                                else if (strReturnFile.Length == 0)
                                {
                                    strReturnFile = strLine;
                                    continue;
                                }
                            }

                            if (strMessage.Length > 0)
                                strMessage += "\r\n" + strLine;
                            else
                                strMessage = strLine;
                        }

                        reader.Close();
                        File.Delete(m_strTargetFile);

                        if (strDeleteFile.Length > 0)
                            File.Delete(strDeleteFile);
                        else
                            RunBroadcast(actionStepHistoryID, componentID, strMessage, strReturnFile);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Trace.WriteLine("ReadFile Error : " + ex.Message);
                    }
                }
            }
        }

        private bool RunBroadcast(int actionStepHistoryID, int componentID, string strMessage, string strReturnFile)
        {
            BaseMessageClient messageClient = MessageClientFactory.CreateMessageClient();
            messageClient.Tag = new BroadcastHistoryData(actionStepHistoryID, componentID, strReturnFile);
            messageClient.OnCompleteBroadcast = this.OnCompleteBroadcast;

            messageClient.Run(false, strMessage);
            return true;
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
            m_icon.Icon = BroadcastServer.Resource.SDMS_BLUE;

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            m_icon.ContextMenuStrip = this.m_contextMenu;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            m_icon.Text = "Broadcast Server";
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
            Application.Exit();
        }

        private void trayIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                m_contextMenu.Show();
        }

        private void SetDataManager()
        {
            m_strTargetFile = System.Configuration.ConfigurationManager.AppSettings["TargetFile"].ToString();
        }

        private void OnCompleteBroadcast(BaseMessageClient sender, BaseMessageClient.Status status)
        {
            if (sender != null && sender.Tag != null && sender.Tag is BroadcastHistoryData)
            {
                BroadcastHistoryData data = (BroadcastHistoryData)sender.Tag;

                /*int historyStatus;

                if (status == BaseMessageClient.Status.Completed)
                    historyStatus = (int)BroadcastStatus.Complete;
                else if (status == BaseMessageClient.Status.Stopped)
                    historyStatus = (int)BroadcastStatus.Stop;
                else
                    historyStatus = (int)BroadcastStatus.TimeOut;*/

                StreamWriter writer = new StreamWriter(data.ReturnFile, false, System.Text.Encoding.UTF8);
                writer.WriteLine((int)status);
                writer.Close();
            }
        }
    }

    public class BroadcastHistoryData
    {
        private int m_nActionStepHistoryID = -1;
        private int m_nComponentID = -1;
        private string m_strReturnFile = "";

        public int ActionStepHistoryID
        {
            get { return m_nActionStepHistoryID; }
            set { m_nActionStepHistoryID = value; }
        }

        public int ComponentID
        {
            get { return m_nComponentID; }
            set { m_nComponentID = value; }
        }

        public string ReturnFile
        {
            get { return m_strReturnFile; }
            set { m_strReturnFile = value; }
        }

        public BroadcastHistoryData()
        {
        }

        public BroadcastHistoryData(int actionStepHistoryID, int componentID, string strReturnFile)
        {
            m_nActionStepHistoryID = actionStepHistoryID;
            m_nComponentID = componentID;
            m_strReturnFile = strReturnFile;
        }
    }
}
