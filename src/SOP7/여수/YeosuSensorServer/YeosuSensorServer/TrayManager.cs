using System;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Configuration;
using SensorServer.DAL;
using dnsDBUtil;
using SensorServer.BLL;
using System.Collections;
using System.Collections.Generic;
using dnsCommunicateSopServer;

using System.Threading;
using System.Threading.Tasks;
using System.Timers;

namespace YeosuSensorServer
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

        private class SensorData
        {
            private int m_nSensorType = -1;
            private int m_nSensorTagInfoID = -1;
            private int m_nSensorZoneID = -1;

            public int SensorType
            {
                get { return m_nSensorType; }
                set { m_nSensorType = value; }
            }

            public int SensorTagInfoID
            {
                get { return m_nSensorTagInfoID; }
                set { m_nSensorTagInfoID = value; }
            }

            public int SensorZoneID
            {
                get { return m_nSensorZoneID; }
                set { m_nSensorZoneID = value; }
            }
        }

        Logger m_Logger = null;

        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out PointInter lpPoint);

        private NotifyIcon m_icon = null;
        private ContextMenuStrip m_contextMenu = null;
        private System.ComponentModel.IContainer components;

        private ToolStripMenuItem tsMenuClose;
        
        // External Sensor Data
        private System.Threading.Timer m_timer;
        // Public Sensor Data
        private System.Threading.Timer t_timer;
        // Insert Sensor Data
        private System.Threading.Timer i_timer;

        private bool m_runProcess = false;
        private bool m_runProcess2 = false;
        private bool m_runProcessInsert = false;

        private string m_strAppName = "여수 센서서버";
        private ProcessManager m_processManager = null;
        private string m_strSopWebServerURL = null;

        // Key : OriginSensorID
        private Dictionary<int, SensorData> m_dicSensors = new Dictionary<int, SensorData>();

        public TrayManager()
        {
            if (ReadConfig())
            {
                CreateNotifyicon();

                m_timer = new System.Threading.Timer(OnTimer, m_Logger, 0, 1000 * 60 * 3); // 3분
                t_timer = new System.Threading.Timer(OnTimerPublic, m_Logger, 0, 1000 * 60 * 30); // 30분
                i_timer = new System.Threading.Timer(OnTimerInsertHistory, m_Logger, 0, 1000 * 60); // 1시간
                
                OnTimer(m_Logger);
                OnTimerPublic(m_Logger);
                OnTimerInsertHistory(m_Logger);

                // 프로그램이 종료되지 않게 하기 위해 일정 시간 대기
                Console.ReadLine();
                
            }
        }

        private bool ReadConfig()
        {
            string strSiteID = ConfigurationManager.AppSettings["siteID"];
            string strDBName = ConfigurationManager.AppSettings["dbName"];
            string strDBType = ConfigurationManager.AppSettings["dbType"];
            string strDBHost = ConfigurationManager.AppSettings["dbHost"];
            string strDbId = ConfigurationManager.AppSettings["dbID"];
            string strDbPw = ConfigurationManager.AppSettings["dbPW"];

            //strDBHost = "192.168.0.241";

            string strExternalDbHost = ConfigurationManager.AppSettings["externalDbHost"];
            string strExternalDbName = ConfigurationManager.AppSettings["externalDbName"];
            string strExternalDbId = ConfigurationManager.AppSettings["externalDbId"];
            string strExternalDbPw = ConfigurationManager.AppSettings["externalDbPw"];

            string strSopWebServerURL = ConfigurationManager.AppSettings["sopWebServerURL"];

            Logger Logger = Logger.Instance;
            Logger.LogFolder = ConfigurationManager.AppSettings["logFolder"];
            Logger.LogLifeDays = Double.Parse(ConfigurationManager.AppSettings["logLifeTime"]);
            Logger.LogTag = ConfigurationManager.AppSettings["logFileTag"];

            m_Logger = Logger;
            string strErrorMessage;

            if (strSopWebServerURL != null)
            {
                strSopWebServerURL = strSopWebServerURL.Trim();

                if (strSopWebServerURL.EndsWith("/"))
                    m_strSopWebServerURL = strSopWebServerURL + "api/EtcSensor";
                else
                    m_strSopWebServerURL = strSopWebServerURL + "/api/EtcSensor";
            }    

            //if (strSopWebServerURL != null)
            //{
            //    strSopWebServerURL = strSopWebServerURL.Trim();

            //    if (strSopWebServerURL.EndsWith("/"))
            //        //m_strSopWebServerURL = strSopWebServerURL + "api/FireSensor";
            //        m_strSopWebServerURL = strSopWebServerURL + "api/FireSensor";

            //    else
            //        //m_strSopWebServerURL = strSopWebServerURL + "api/FireSensor";
            //        m_strSopWebServerURL = strSopWebServerURL + "/api/FireSensor";
            //}

            if (strSiteID != null && strDBName != null &&
                strDBType != null && strDBHost != null &&
                strDbId != null && strDbPw != null &&
                strExternalDbHost != null && strExternalDbName != null &&
                strExternalDbId != null && strExternalDbPw != null)
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

                DataManager dataManager = new DataManager(nDBType, strDBHost, strDBName, strDbId, strDbPw, nSiteID);
                SDMS.DAL.DataManager sdmsDataManager = new SDMS.DAL.DataManager(nDBType, strDBHost, strDBName, strDbId, strDbPw, nSiteID);

                strExternalDbHost = AES256Cipher.AES_decrypt(strExternalDbHost, key);
                strExternalDbId = AES256Cipher.AES_decrypt(strExternalDbId, key);
                strExternalDbPw = AES256Cipher.AES_decrypt(strExternalDbPw, key);
                //strExternalDbId = "postgres";
                //strExternalDbPw = "9449966Ab";

                string strDbInfo = string.Format("[Info] SqlServer : {0}, {1}, {2} ", strDBHost, strDbId, strDbPw);
                string strExternalDbInfo = string.Format("[Info] PostgreSQL : {0}, {1}, {2} ", strExternalDbHost, strExternalDbId, strExternalDbPw);
                m_Logger.Write(strDbInfo);
                m_Logger.Write(strExternalDbInfo);
                 
                ReadSensorZone(sdmsDataManager, out strErrorMessage);
                if (strErrorMessage != string.Empty || strErrorMessage != null)
                {
                    m_Logger.Write(strErrorMessage);
                }

                m_processManager = new ProcessManager(sdmsDataManager, dataManager, strExternalDbHost, strExternalDbName, strExternalDbId, strExternalDbPw);

                return true;
            }

            return false;
        }

        private void ReadSensorZone(SDMS.DAL.DataManager dataManager, out string strErrorMessage)
        {
            List<SDMS.Model.Sensor.SensorZone> sensorZones = dataManager.GetSelectManager().SelectSensorZones(null, null, out strErrorMessage);

            Dictionary<int, SensorData> dicSensorDatas = new Dictionary<int, SensorData>();

            if (sensorZones != null)
            {
                foreach (SDMS.Model.Sensor.SensorZone sensorZone in sensorZones)
                {
                    if (sensorZone.OrgSensorID != null && sensorZone.SensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
                    {
                        SensorData sensorData = new SensorData();
                        sensorData.SensorType = sensorZone.SensorType;
                        sensorData.SensorZoneID = sensorZone.ID;

                        m_dicSensors[(int)sensorZone.OrgSensorID] = sensorData;
                        dicSensorDatas[sensorZone.ID] = sensorData;
                    }
                }

                List<SDMS.Model.Sensor.TagInfo> tagInfos = dataManager.GetSelectManager().SelectSensorTagInfo(null, null, out strErrorMessage);

                if (tagInfos != null)
                {
                    SensorData sensorData;

                    foreach (SDMS.Model.Sensor.TagInfo tagInfo in tagInfos)
                    {
                        if (dicSensorDatas.TryGetValue(tagInfo.SensorZoneID, out sensorData))
                        {
                            sensorData.SensorTagInfoID = tagInfo.ID;
                        }
                    }
                }
                else
                {
                    m_Logger.Write("tagInfos are Null");
                }
            }
            else
            {
                m_Logger.Write("SensorZones are Null");
            }
        }

        //private void OnTimerPublic(object sender, EventArgs e, Logger logger)
        private void OnTimerPublic(object state)
        {
            if (m_runProcess2)
            {
                return;
            }
                
            m_runProcess2 = true;

            string strErrorMessage;

            if (m_processManager.SensorManager.UpdatePublicSensorData(out strErrorMessage, m_Logger) == false)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    //Logger.Instance.Write("[ERROR] UpdatePublicSensorData is failed " +  strErrorMessage);
                    m_Logger.Write("[ERROR] UpdatePublicSensorData is failed " + strErrorMessage);
                }
            }
            else
            {
                if (strErrorMessage != null)
                {
                    m_Logger.Write("[ERROR] UpdatePublicSensorData is failed " + strErrorMessage);
                }
                
                m_Logger.Write("UpdatePublicSensorData is success " + DateTime.Now.ToString());
            }

            m_runProcess2 = false;
        }

        
        private void OnTimerInsertHistory(object state)
        {
            if (m_runProcessInsert)
                return;
            
            m_runProcessInsert = true;
            
            string strErrorMessage;

            if (!m_processManager.SensorManager.InsertSensorData(out strErrorMessage))
            {
                m_Logger.Write("[ERROR] InsertSensorData is failed " + strErrorMessage);
            }
            
            m_runProcessInsert = false;
        }
        
        //private void OnTimer(object sender, EventArgs e, Logger logger)
        private void OnTimer(object state)
        {
            if (m_runProcess)
            {
                return;
            }

            m_runProcess = true;
            
            m_Logger.Write("OnTimer Start");

            string strErrorMessage;
            List<AlarmSensor> alarmSensors = new List<AlarmSensor>();

            if (m_processManager.SensorManager.UpdateSensorData(alarmSensors, out strErrorMessage) == false)
            {
                if (strErrorMessage != null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    m_Logger.Write("[ERROR] in Ontimer1 " + strErrorMessage);
                }
            }
            else
            {
                if (m_strSopWebServerURL != null)
                {
                    foreach (AlarmSensor alarmSensor in alarmSensors)
                    {
                        SendAlarm(alarmSensor, out strErrorMessage);
                        if (strErrorMessage != null)
                        {
                            m_Logger.Write(strErrorMessage);
                        }
                    }
                }
            }
            m_runProcess = false;
        }

        private void SendAlarm(AlarmSensor alarmSensor, out string strErrorMessage)
        {
            if (alarmSensor.Sensor == null)
            {
                strErrorMessage = "[INFO] SendAlarm() : Sensor is null";
                return;
            }

            SensorData sensorData;

            if (m_dicSensors.TryGetValue(alarmSensor.Sensor.ID, out sensorData))
            {
                ArrayList arrData = new ArrayList();

                arrData.Add(sensorData.SensorType);
                arrData.Add(sensorData.SensorTagInfoID);
                arrData.Add(sensorData.SensorZoneID);
                arrData.Add(alarmSensor.AlarmLevel > 3);
                arrData.Add(alarmSensor.AlarmLevel);
                SopQueryManager mgr = new SopQueryManager();
                mgr.SendAlarmQuery(arrData, "POST", out strErrorMessage, m_strSopWebServerURL);

                if (strErrorMessage != null)
                {
                    m_Logger.Write("SendAlarmQuery is Failed : " + strErrorMessage);
                }
            }
            else
            {
                strErrorMessage = "[INFO] SendAlarm() : SensorData is null";
            }
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
            m_icon.Icon = global::YeosuSensorServer.Resource.weather;

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
            m_timer.Dispose();
            t_timer.Dispose();
            Application.Exit();
        }

        private void trayIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                m_contextMenu.Show();
        }
    }
}
