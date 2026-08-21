using System;
using System.Collections;
using System.Collections.Generic;
using System.Windows.Forms;
using System.Drawing;
using System.Runtime.InteropServices;
using dnsCommunicateSopServer;
using Newtonsoft.Json.Linq;
using System.Net;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace PlcSensorServer
{
    using SDMS.IDAL;
    using SDMS.DAL;
    using SDMS.Model.Sensor;
    using Data;

    public class TrayManager : IMainWindow, ISensorOwner
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

        public enum AlarmType
        {
            NO_ALARM = 0,
            ALARM = 1,
            NOT_CONNECTED = 2,
            CONNECTED = 3,
            PSM_ALARM_1 = 21,
            PSM_ALARM_2 = 22,
            PSM_ALARM_3 = 23
        }

        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out PointInter lpPoint);

        // Etc Sensor 알람 재발생 여유시간(초)
        private const double EtcSensorCoolTimeSeconds = 5;

        private NotifyIcon m_icon = null;
        private ContextMenuStrip m_contextMenu = null;
        private System.ComponentModel.IContainer components;

        private System.Windows.Forms.ToolStripMenuItem tsMenuShowClientList;
        private System.Windows.Forms.ToolStripMenuItem tsMenuClose;

        private FormClientList m_frmClientList = null;
        private List<FormClientList.ClientData> m_clientDatas = new List<FormClientList.ClientData>();

        private IDataManager m_dataManager = null;
        private Dictionary<string, PSMSensor> m_dicSensors = new Dictionary<string, PSMSensor>();
        private Dictionary<string, EtcSensor> m_dicEtcSensors = new Dictionary<string, EtcSensor>();

        private Network.NetworkManager m_netMgr = null;
        private SopQueryManager m_sopQueryManager = null;
        private SopQueryManager m_sopQueryManagerEtc = null;

        private string m_strNetvisionBaseURL = null;
        private double m_dDetectServerCoolingSeconds = 0;

        private Timer m_alarmTimer = null;
        private bool m_isProcessTimer = false;
        private List<int> m_currentAlarmSensorIDs = new List<int>();

        public TrayManager()
        {
            CreateNotifyicon();
            SetDataManager();
            SetNetworkManager();
            SetAlarmTimer();
        }

        private void CreateNotifyicon()
        {
            this.components = new System.ComponentModel.Container();
            this.m_contextMenu = new System.Windows.Forms.ContextMenuStrip();

            this.m_contextMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.tsMenuShowClientList = new System.Windows.Forms.ToolStripMenuItem();
            this.tsMenuClose = new System.Windows.Forms.ToolStripMenuItem();

            // Initialize contextMenu1
            this.m_contextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.tsMenuShowClientList,
            this.tsMenuClose});
            this.m_contextMenu.Size = new System.Drawing.Size(181, 70);

            // Create the NotifyIcon.
            this.m_icon = new System.Windows.Forms.NotifyIcon(this.components);

            // The Icon property sets the icon that will appear
            // in the systray for this application.
            m_icon.Icon = PlcSensorServer.Resources.SDMS_BLUE;

            // The ContextMenu property sets the menu that will
            // appear when the systray icon is right clicked.
            m_icon.ContextMenuStrip = this.m_contextMenu;

            // The Text property sets the text that will be displayed,
            // in a tooltip, when the mouse hovers over the systray icon.
            m_icon.Text = "PLC Sensor Server";
            m_icon.Visible = true;

            // Handle the DoubleClick event to activate the form.
            m_icon.MouseClick += new System.Windows.Forms.MouseEventHandler(this.trayIcon_MouseClick);

            // 
            // tsMenuShowClientList
            // 
            this.tsMenuShowClientList.Name = "tsMenuShowClientList";
            this.tsMenuShowClientList.Size = new System.Drawing.Size(180, 22);
            this.tsMenuShowClientList.Text = "접속현황 보기";
            this.tsMenuShowClientList.Click += new System.EventHandler(this.tsMenuShowClientList_Click);
            // 
            // tsMenuClose
            // 
            this.tsMenuClose.Name = "tsMenuClose";
            this.tsMenuClose.Size = new System.Drawing.Size(180, 22);
            this.tsMenuClose.Text = "종료";
            this.tsMenuClose.Click += new System.EventHandler(this.tsMenuClose_Click);
        }

        private void tsMenuShowClientList_Click(object sender, EventArgs e)
        {
            if (m_frmClientList == null || m_frmClientList.IsDisposed)
                m_frmClientList = new FormClientList();

            if (m_frmClientList.Visible == false)
            {
                m_frmClientList.SetClient(m_clientDatas);
                m_frmClientList.Show();
            }
        }

        private void tsMenuClose_Click(object sender, EventArgs e)
        {
            m_netMgr.Stop();
            Logger.Instance.Close();
            Application.Exit();
        }

        private void trayIcon_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                m_contextMenu.Show();
        }

        public void AddClient(int nClientType, int nClientSubType, string strIP, int nPort)
        {
            /*FormClientList.ClientData data = new FormClientList.ClientData();

            data.ClientType = nClientType;
            data.ClientSubType = nClientSubType;
            data.IP = strIP;
            data.Port = nPort;

            m_clientDatas.Add(data);

            if (m_frmClientList != null && m_frmClientList.IsDisposed == false && m_frmClientList.Visible)
                m_frmClientList.AddClient(nClientType, nClientSubType, strIP, nPort);*/
        }

        public void RemoveClient(string strIP, int nPort)
        {
            /*foreach (FormClientList.ClientData data in m_clientDatas)
            {
                if (data.IP == strIP && data.Port == nPort)
                {
                    m_clientDatas.Remove(data);
                    break;
                }
            }

            try
            {
                if (m_frmClientList != null && m_frmClientList.IsDisposed == false && m_frmClientList.Visible)
                    m_frmClientList.RemoveClient(strIP, nPort);
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine("RemoveClient Error : " + e.Message);
            }*/
        }

        private void SetDataManager()
        {
            string strWebServerURL = System.Configuration.ConfigurationManager.AppSettings["webServerURL"].ToString();
            string strDBName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            string strDBType = System.Configuration.ConfigurationManager.AppSettings["dbType"].ToString();
            string strDbID = System.Configuration.ConfigurationManager.AppSettings["DbID"].ToString();
            string strDbPW = System.Configuration.ConfigurationManager.AppSettings["DbPw"].ToString();
            string strDbHost = System.Configuration.ConfigurationManager.AppSettings["DbHost"].ToString();

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            if (strDbID != null && strDbID.Length > 0)
                strDbID = dnsDBUtil.AES256Cipher.AES_decrypt(strDbID, key);

            if (strDbPW != null && strDbPW.Length > 0)
                strDbPW = dnsDBUtil.AES256Cipher.AES_decrypt(strDbPW, key);

            if (strDbHost != null && strDbHost.Length > 0)
                strDbHost = dnsDBUtil.AES256Cipher.AES_decrypt(strDbHost, key);

            int nDBType;

            if (int.TryParse(strDBType.Trim(), out nDBType))
            {
                m_dataManager = new DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, 1);
                //m_dataManager = new DataManager(strDBName, nDBType, 1, strWebServerURL);
                ReadSensors();
            }

            string strAlarmServerBaseURL = System.Configuration.ConfigurationManager.AppSettings["alarmServer"].ToString();

            if (strAlarmServerBaseURL != null && strAlarmServerBaseURL.Length > 0)
                m_sopQueryManager = new SopQueryManager(strAlarmServerBaseURL);

            string strAlarmServerEtcURL = System.Configuration.ConfigurationManager.AppSettings["alarmServerEtc"].ToString();

            if (strAlarmServerBaseURL != null && strAlarmServerBaseURL.Length > 0)
                m_sopQueryManagerEtc = new SopQueryManager(strAlarmServerEtcURL);

            string strNetvisionBaseURL = System.Configuration.ConfigurationManager.AppSettings["netvisionBaseURL"].ToString();

            if (strNetvisionBaseURL != null && strNetvisionBaseURL.Length > 0)
                m_strNetvisionBaseURL = strNetvisionBaseURL;

            string strDetectSensorCoolingTime = System.Configuration.ConfigurationManager.AppSettings["detectSensorCoolingTime"].ToString();

            double coolingTime;

            if (double.TryParse(strDetectSensorCoolingTime.Trim(), out coolingTime))
            {
                m_dDetectServerCoolingSeconds = coolingTime;
            }
        }

        private void ReadSensors()
        {
            string strErrorMessage;
            List<PSM> sensors = m_dataManager.GetSelectManager().SelectPSMSensors(null, null, out strErrorMessage);

            if (sensors == null)
            {
                Logger.Instance.Write("ReadSensors Error : " + strErrorMessage);
                return;
            }

            List<ETC> etcSensors = m_dataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            if (etcSensors == null)
            {
                Logger.Instance.Write("ReadSensors Error2 : " + strErrorMessage);
                return;
            }

            string strIDs = "";
            Dictionary<int, PSMSensor> dicSensors = new Dictionary<int, PSMSensor>();

            foreach (var sensor in sensors)
            {
                if (sensor.UniqueKey != null && sensor.UniqueKey.StartsWith("G"))
                {
                    PSMSensor psmSensor = new PSMSensor(sensor);
                    m_dicSensors[sensor.UniqueKey] = psmSensor;
                    dicSensors[sensor.ID] = psmSensor;

                    if (strIDs.Length == 0)
                        strIDs = sensor.ID.ToString();
                    else
                        strIDs += ", " + sensor.ID.ToString();
                }
            }

            if (strIDs.Length > 0)
            {
                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", SensorZone.GetFieldName(SensorZone.Fields.OrgSensorID, out isNullable), strIDs);

                Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
                dicConditions[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;

                ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strCondition, out strErrorMessage);

                if (arrDatas == null)
                {
                    Logger.Instance.Write("ReadSensors Error3 : " + strErrorMessage);
                    return;
                }

                int nDataCount = arrDatas.Count;

                for (int i=0;i<nDataCount-1;i+=2)
                {
                    if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                    {
                        SensorZone sensorZone = (SensorZone)arrDatas[i];
                        TagInfo sensorTagInfo = (TagInfo)arrDatas[i + 1];

                        PSMSensor sensor;

                        if (sensorZone.OrgSensorID != null && dicSensors.TryGetValue((int)sensorZone.OrgSensorID, out sensor))
                        {
                            sensor.SensorZoneID = sensorZone.ID;
                            sensor.SensorTagInfoID = sensorTagInfo.ID;
                        }
                    }
                }
            }

            strIDs = "";
            Dictionary<int, EtcSensor> dicEtcSensors = new Dictionary<int, EtcSensor>();

            foreach (var sensor in etcSensors)
            {
                if (sensor.UniqueKey != null && sensor.UniqueKey.StartsWith("D"))
                {
                    EtcSensor etcSensor = new EtcSensor(sensor);
                    m_dicEtcSensors[sensor.UniqueKey] = etcSensor;
                    dicEtcSensors[sensor.ID] = etcSensor;

                    if (strIDs.Length == 0)
                        strIDs = sensor.ID.ToString();
                    else
                        strIDs += ", " + sensor.ID.ToString();
                }
            }

            if (strIDs.Length > 0)
            {
                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", SensorZone.GetFieldName(SensorZone.Fields.OrgSensorID, out isNullable), strIDs);

                Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
                dicConditions[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.ETC;

                ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, strCondition, out strErrorMessage);

                if (arrDatas == null)
                {
                    Logger.Instance.Write("ReadSensors Error4 : " + strErrorMessage);
                    return;
                }

                int nDataCount = arrDatas.Count;

                for (int i = 0; i < nDataCount - 1; i += 2)
                {
                    if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                    {
                        SensorZone sensorZone = (SensorZone)arrDatas[i];
                        TagInfo sensorTagInfo = (TagInfo)arrDatas[i + 1];

                        EtcSensor sensor;

                        if (sensorZone.OrgSensorID != null && dicEtcSensors.TryGetValue((int)sensorZone.OrgSensorID, out sensor))
                        {
                            sensor.SensorZoneID = sensorZone.ID;
                            sensor.SensorTagInfoID = sensorTagInfo.ID;
                        }
                    }
                }
            }
        }

        public void UpdateSensorData(string strSensorCode, float fValue, List<int> currentAlarmSensorIDs)
        {
            PSMSensor sensor;
            EtcSensor etcSensor;

            if (m_dicSensors.TryGetValue(strSensorCode, out sensor))
            {
                /*if (sensor.CurrentData == fValue)
                    return;*/

                sensor.CurrentData = fValue;

                string strErrorMessage;

                if (m_dataManager.GetUpdateManager().UpdatePSMSensor(sensor, out strErrorMessage))
                {
                    // 웹서버로 알람 데이터 전송
                    int nAlarmLevel;
                    bool isAlarm = IsAlarmStatus(sensor, out nAlarmLevel);
                    SendSensorData(sensor, isAlarm, nAlarmLevel);
                }
                else
                {
                    Logger.Instance.Write("UpdateSensorData Error : " + strErrorMessage);
                    System.Diagnostics.Trace.WriteLine("UpdateSensorData Error : " + strErrorMessage);
                }
            }
            else if (m_dicEtcSensors.TryGetValue(strSensorCode, out etcSensor))
            {
                string strValue = FloatToString(fValue);

                /*if (etcSensor.CurrentData == strValue)
                    return;*/

                etcSensor.CurrentData = strValue;

                string strErrorMessage;

                if (m_dataManager.GetUpdateManager().UpdateETCSensor(etcSensor, out strErrorMessage))
                {
                    // 웹서버로 알람 데이터 전송
                    int nAlarmLevel;
                    bool isAlarm = IsAlarmStatus(etcSensor, out nAlarmLevel);
                    SendSensorData(etcSensor, isAlarm, nAlarmLevel, currentAlarmSensorIDs);
                }
                else
                {
                    Logger.Instance.Write("UpdateSensorData Error2 : " + strErrorMessage);
                    System.Diagnostics.Trace.WriteLine("UpdateSensorData Error2 : " + strErrorMessage);
                }
            }
        }

        private string FloatToString(float value)
        {
            string strValue = string.Format("{0:F2}", value);
            int len = strValue.Length;

            if (strValue[len - 1] == '0')
            {
                if (strValue[len - 2] == '0')
                    strValue = strValue.Substring(0, len - 3);
                else
                    strValue = strValue.Substring(0, len - 1);
            }

            return strValue;
        }

        private bool GetSensorLimit(PSMSensor sensor, out bool useLimitLevel1, out bool useLimitLevel2, out bool useLimitLevel3, out float limitLevel1, out float limitLevel2, out float limitLevel3)
        {
            useLimitLevel1 = useLimitLevel2 = useLimitLevel3 = false;
            limitLevel1 = limitLevel2 = limitLevel3 = 0;

            if (sensor.LimitType != null && sensor.LimitType == 1 && sensor.LimitValue != null)
            {
                int index = sensor.LimitValue.IndexOf('|');

                if (index < 0)
                    return false;

                string strFirst = sensor.LimitValue.Substring(0, index).Trim();
                string strSecond = sensor.LimitValue.Substring(index + 1).Trim();

                string[] useArray = strFirst.Split(',');
                string[] valueArray = strSecond.Split(',');

                if (useArray.Length == 3 && valueArray.Length == 3)
                {
                    useLimitLevel1 = useArray[0].Trim().ToLower() == "true";
                    useLimitLevel2 = useArray[1].Trim().ToLower() == "true";
                    useLimitLevel3 = useArray[2].Trim().ToLower() == "true";

                    if (float.TryParse(valueArray[0].Trim(), out limitLevel1) && float.TryParse(valueArray[1].Trim(), out limitLevel2) && float.TryParse(valueArray[2].Trim(), out limitLevel3))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool IsAlarmStatus(PSMSensor sensor, out int nAlarmLevel)
        {
            nAlarmLevel = 0;
            bool useLimitLevel1, useLimitLevel2, useLimitLevel3;
            float limitLevel1, limitLevel2, limitLevel3;

            if (GetSensorLimit(sensor, out useLimitLevel1, out useLimitLevel2, out useLimitLevel3, out limitLevel1, out limitLevel2, out limitLevel3) == false)
                return false;

            if (useLimitLevel1/* && limitLevel1 != null*/)
            {
                if (sensor.CurrentData != null && (float)sensor.CurrentData >= limitLevel1)
                    nAlarmLevel = 1;
            }

            if (useLimitLevel2/* && sensor.LimitLevel2 != null*/)
            {
                if (sensor.CurrentData != null && (float)sensor.CurrentData >= limitLevel2)
                {
                    // 1단계 알람값과 2단계 알람값이 동일할 경우 아래단계의 알람으로 처리한다.
                    if (useLimitLevel1 /*&& sensor.LimitLevel1 != null*/ && limitLevel1 == limitLevel2)
                        nAlarmLevel = 1;
                    else
                        nAlarmLevel = 2;
                }
            }

            if (useLimitLevel3 /*&& sensor.LimitLevel3 != null*/)
            {
                if (sensor.CurrentData != null && (float)sensor.CurrentData >= limitLevel3)
                {
                    // 1단계 또는 2단계 알람값과 3단계 알람값이 동일할 경우 아래단계의 알람으로 처리한다.
                    if (useLimitLevel1 /*&& sensor.LimitLevel1 != null*/ && limitLevel1 == limitLevel3)
                        nAlarmLevel = 1;
                    else if (useLimitLevel2 /*&& sensor.LimitLevel2 != null*/ && limitLevel2 == limitLevel3)
                        nAlarmLevel = 2;
                    else
                        nAlarmLevel = 3;
                }
            }

            return nAlarmLevel > 0;
        }

        private bool IsAlarmStatus(EtcSensor sensor, out int nAlarmLevel)
        {
            nAlarmLevel = 0;

            string strValue = sensor.CurrentData;

            if (strValue == null)
                return false;

            float fValue;

            if (float.TryParse(strValue.Trim(), out fValue))
            {
                int nValue = (int)(fValue + 0.5f);

                // 0이면 알람, 1이면 해제
                /*if (nValue == 0)
                    nAlarmLevel = 1;*/
                // 주빅스에서 프로토콜을 바꿨음
                // 1이면 알람, 0이면 해제
                if (nValue >= 1)
                    nAlarmLevel = 1;
            }

            return nAlarmLevel > 0;
        }

        private void SetNetworkManager()
        {
            string strPort1 = System.Configuration.ConfigurationManager.AppSettings["port1"].ToString();
            string strPort2 = System.Configuration.ConfigurationManager.AppSettings["port2"].ToString();
            int nPort1, nPort2;

            if (int.TryParse(strPort1.Trim(), out nPort1) && int.TryParse(strPort2.Trim(), out nPort2))
            {
                m_netMgr = new Network.NetworkManager(nPort1, nPort2, this, this);
                m_netMgr.Start();
            }
        }

        private void SendSensorData(PSMSensor sensor, bool isAlarm, int nAlarmLevel)
        {
            ArrayList arrDatas = new ArrayList();

            arrDatas.Add((int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR);
            arrDatas.Add(sensor.SensorTagInfoID);
            arrDatas.Add(sensor.SensorZoneID);
            arrDatas.Add(isAlarm);
            arrDatas.Add(nAlarmLevel);

            Task<bool> result = m_sopQueryManager.SendAlarmQuery_Async(arrDatas, "POST");
        }

        private void SendSensorData(EtcSensor sensor, bool isAlarm, int nAlarmLevel, List<int> currentAlarmSensorIDs)
        {
            DateTime dtNow = DateTime.Now;

            if (sensor.IsAlarmStatus && !isAlarm)
            {
                TimeSpan span = dtNow - sensor.AlarmTime;

                // 감지센서 작동후 m_dDetectServerCoolingSeconds 만큼의 시간이 지나지 않으면
                // 알람을 해제하지 않는다.
                if (span.TotalSeconds < m_dDetectServerCoolingSeconds)
                    return;
            }

            if (isAlarm)
                SendToNetvision(sensor, 3);
            else
            {
                if (currentAlarmSensorIDs.Contains(sensor.ID))
                    SendToNetvision(sensor, 0);
            }

            ArrayList arrDatas = new ArrayList();

            arrDatas.Add((int)dnsData.Sensor.Facility.FacilityType.ETC);
            arrDatas.Add(sensor.SensorTagInfoID);
            arrDatas.Add(sensor.SensorZoneID);
            arrDatas.Add(isAlarm);
            arrDatas.Add(nAlarmLevel);

            if (isAlarm)
                sensor.AlarmTime = dtNow;

            sensor.IsAlarmStatus = isAlarm;
            Task<bool> result = m_sopQueryManagerEtc.SendAlarmQuery_Async(arrDatas, "POST");
        }

        private Dictionary<EtcSensor, DateTime> m_dicEtcSensorSendTimes = new Dictionary<EtcSensor, DateTime>();

        private void SendToNetvision(EtcSensor sensor, int alarmLevel)
        {
            if (m_strNetvisionBaseURL == null)
                return;

            DateTime dtNow = DateTime.Now;
            DateTime time;

            if (m_dicEtcSensorSendTimes.TryGetValue(sensor, out time) == false)
            {
                m_dicEtcSensorSendTimes[sensor] = dtNow;
            }
            else
            {
                TimeSpan span = dtNow - time;

                if (span.TotalSeconds < EtcSensorCoolTimeSeconds)
                    return;

                m_dicEtcSensorSendTimes[sensor] = dtNow;
            }

            Task<bool> result = SendPost_Async(dtNow, sensor, alarmLevel);
        }

        private bool SendPost(DateTime dtNow, EtcSensor sensor)
        {
            string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
            string strJson = "{ \"cameraID\": \"1F-2\", \"userID\": \"nst_001\", \"time\": \"" + strTime + "\", \"level\": 3, \"notifications\": \"감지센서 탐지신호" + sensor.UniqueKey + "\" }";
            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(m_strNetvisionBaseURL));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "", strErrorMessage = null;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return false;
            }

            return true;
        }

        private async Task<bool> SendPost_Async(DateTime dtNow, EtcSensor sensor, int alarmLevel)
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            string strTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second);
            string strJson = "{ \"cameraID\": \"1F-2\", \"userID\": \"nst_001\", \"time\": \"" + strTime + "\", \"level\": " + alarmLevel + ", \"notifications\": \"감지센서 탐지신호" + sensor.UniqueKey + "\" }";
            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(m_strNetvisionBaseURL));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            string strResult = "", strErrorMessage = null;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
                System.Diagnostics.Trace.WriteLine(strErrorMessage);
                return false;
            }

            return true;
        }

        public List<int> GetAlarmSensorIDs()
        {
            return m_currentAlarmSensorIDs;
            /*string strErrorMessage;
            List<SDMS.Model.Alarm.CurrentAlarm> alarms = m_dataManager.GetSelectManager().SelectCurrentAlarms(null, null, out strErrorMessage);

            List<int> sensorIDs = new List<int>();

            if (alarms == null)
                return sensorIDs;

            Dictionary<int, int> dicSensorZoneIDs = new Dictionary<int, int>();

            foreach (var alarm in alarms)
            {
                if (alarm.SensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
                {
                    foreach (int sensorZoneID in alarm.AlarmSensorZoneIDs)
                    {
                        dicSensorZoneIDs[sensorZoneID] = sensorZoneID;
                    }
                }
            }

            // SensorZoneID와 SensorID는 다르지만 DB에서 같도록 만들어둔다.
            sensorIDs.AddRange(dicSensorZoneIDs.Keys);
            return sensorIDs;*/
        }

        private void SetAlarmTimer()
        {
            m_alarmTimer = new Timer();

            m_alarmTimer.Interval = 1000;
            m_alarmTimer.Tick += OnTimer;
            m_alarmTimer.Start();
        }

        private void OnTimer(object sender, EventArgs e)
        {
            if (m_isProcessTimer)
                return;

            m_isProcessTimer = true;

            string strErrorMessage;
            List<SDMS.Model.Alarm.CurrentAlarm> alarms = m_dataManager.GetSelectManager().SelectCurrentAlarms(null, null, out strErrorMessage);

            List<int> sensorIDs = new List<int>();

            if (alarms == null)
            {
                m_isProcessTimer = false;
                m_currentAlarmSensorIDs = sensorIDs;
                return;
            }

            Dictionary<int, int> dicSensorZoneIDs = new Dictionary<int, int>();

            foreach (var alarm in alarms)
            {
                if (alarm.SensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
                {
                    foreach (int sensorZoneID in alarm.AlarmSensorZoneIDs)
                    {
                        dicSensorZoneIDs[sensorZoneID] = sensorZoneID;
                    }
                }
            }

            // SensorZoneID와 SensorID는 다르지만 DB에서 같도록 만들어둔다.
            sensorIDs.AddRange(dicSensorZoneIDs.Keys);
            m_isProcessTimer = false;
            m_currentAlarmSensorIDs = sensorIDs;
        }
    }

    public interface IMainWindow
    {
        void AddClient(int nClientType, int nClientSubType, string strIP, int nPort);
        void RemoveClient(string strIP, int nPort);
    }

    public interface ISensorOwner
    {
        void UpdateSensorData(string strSensorCode, float fValue, List<int> currentAlarmSensorIDs);
        List<int> GetAlarmSensorIDs();
    }
}
