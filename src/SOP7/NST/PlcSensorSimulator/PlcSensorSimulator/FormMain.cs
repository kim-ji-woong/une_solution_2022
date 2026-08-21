using System;
using System.Collections.Generic;
using System.Windows.Forms;
using SDMS.Model.Sensor;
using SDMS.Model.Alarm;
using SDMS.IDAL;
using SDMS.DAL;
using System.Collections;
using dnsCommunicateSopServer;

namespace PlcSensorSimulator
{
    public partial class FormMain : Form, IMessageOwner
    {
        private Network.NetworkManager m_netMgr = null;
        private bool m_processAlarm = false;
        private DataManager m_dataManager = null;
        private string m_fireAlarmURL = null;
        private SopQueryManager m_SopQueryMgr = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            SetDataManager();
            SetTimer();
        }

        private void SetTimer()
        {
            timer1.Tick += OnTimer;
            timer1.Start();
        }

        private void OnTimer(object sender, EventArgs e)
        {
            if (m_processAlarm || m_dataManager == null)
                return;

            m_processAlarm = true;

            CheckAlarm();

            m_processAlarm = false;
        }

        private void CheckAlarm()
        {
            string strErrorMessage;
            List<CurrentAlarm> alarms = m_dataManager.GetSelectManager().SelectCurrentAlarms(null, null, out strErrorMessage);

            if (alarms == null)
            {
                System.Diagnostics.Trace.WriteLine("CheckAlarm Fail : " + strErrorMessage);
                return;
            }

            Dictionary<int, bool> dicAlarmSensorZones = new Dictionary<int, bool>();
            Dictionary<int, DataGridViewRow> dicSensorZoneRow = new Dictionary<int, DataGridViewRow>();

            foreach (DataGridViewRow row in gridFireSensors.Rows)
            {
                if (row.Tag != null && row.Tag is FireSensor)
                {
                    FireSensor fireSensor = (FireSensor)row.Tag;
                    dicSensorZoneRow[fireSensor.SensorZone.ID] = row;
                }
            }

            foreach (CurrentAlarm alarm in alarms)
            {
                foreach (int sensorZoneID in alarm.AlarmSensorZoneIDs)
                {
                    dicAlarmSensorZones[sensorZoneID] = true;
                }
            }

            foreach (KeyValuePair<int, DataGridViewRow> pair in dicSensorZoneRow)
            {
                if (dicAlarmSensorZones.ContainsKey(pair.Key))
                {
                    for (int i = 0; i < 3; i++)
                    {
                        pair.Value.Cells[i].Style.BackColor = System.Drawing.Color.HotPink;
                    }
                }
                else
                {
                    for (int i = 0; i < 3; i++)
                    {
                        pair.Value.Cells[i].Style.BackColor = System.Drawing.Color.White;
                    }
                }
            }
        }

        private DataGridViewRow GetGridViewRow(int sensorZoneID)
        {
            foreach (DataGridViewRow row in gridFireSensors.Rows)
            {
                if (row.Tag != null && row.Tag is FireSensor)
                {
                    FireSensor fireSensor = (FireSensor)row.Tag;

                    if (fireSensor.SensorZone.ID == sensorZoneID)
                        return row;
                }
            }

            return null;
        }

        private void SetDataManager()
        {
            string strWebServerURL = System.Configuration.ConfigurationManager.AppSettings["webServerURL"].ToString();
            string strDBName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            string strDBType = System.Configuration.ConfigurationManager.AppSettings["dbType"].ToString();
            string strDbID = System.Configuration.ConfigurationManager.AppSettings["DbID"].ToString();
            string strDbPW = System.Configuration.ConfigurationManager.AppSettings["DbPw"].ToString();
            string strDbHost = System.Configuration.ConfigurationManager.AppSettings["DbHost"].ToString();
            m_fireAlarmURL = System.Configuration.ConfigurationManager.AppSettings["Alarm_Fire_URL"].ToString();

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
                m_SopQueryMgr = new SopQueryManager();

                DataManager dataManager = new DataManager(nDBType, strDbHost, strDBName, strDbID, strDbPW, 1);
                m_dataManager = dataManager;

                ReadSensors(dataManager);

                string strIP = System.Configuration.ConfigurationManager.AppSettings["ip"].ToString();
                string strPort1 = System.Configuration.ConfigurationManager.AppSettings["port1"].ToString();
                string strPort2 = System.Configuration.ConfigurationManager.AppSettings["port2"].ToString();

                int nPort1, nPort2;

                if (int.TryParse(strPort1.Trim(), out nPort1) && int.TryParse(strPort2.Trim(), out nPort2))
                {
                    m_netMgr = new Network.NetworkManager(strIP.Trim(), nPort1, nPort2, this);
                }
            }
        }

        private void ReadSensors(IDataManager dataManager)
        {
            string strErrorMessage;
            List<PSM> sensors = dataManager.GetSelectManager().SelectPSMSensors(null, null, out strErrorMessage);

            if (sensors == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadSensors Error : " + strErrorMessage);
                return;
            }

            sensors.Sort(SortSensor);

            foreach (var sensor in sensors)
            {
                if (sensor.UniqueKey != null && sensor.UniqueKey.StartsWith("G"))
                {
                    AddSensor(sensor.UniqueKey);
                }
            }

            List<ETC> etcSensors = dataManager.GetSelectManager().SelectETCSensors(null, null, out strErrorMessage);

            if (etcSensors == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadSensors Error2 : " + strErrorMessage);
                return;
            }

            etcSensors.Sort(SortEtcSensor);

            foreach (var sensor in etcSensors)
            {
                if (sensor.UniqueKey != null && sensor.UniqueKey.StartsWith("D"))
                {
                    AddSensor(sensor.UniqueKey);
                }
            }

            ReadFireSensors(dataManager);
        }

        private void ReadFireSensors(IDataManager dataManager)
        {
            string strErrorMessage;
            List<Fire> fireSensors = dataManager.GetSelectManager().SelectFireSensors(null, null, out strErrorMessage);

            if (fireSensors == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadFireSensors Error : " + strErrorMessage);
                return;
            }

            Dictionary<int, Fire> dicFireSensors = new Dictionary<int, Fire>();

            foreach (Fire sensor in fireSensors)
            {
                dicFireSensors[sensor.ID] = sensor;
            }

            Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
            dicConditions[SensorZone.Fields.SensorType] = 0;

            ArrayList arrDatas = dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, null, out strErrorMessage);

            if (arrDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadFireSensors Error2 : " + strErrorMessage);
                return;
            }

            List<FireSensor> sensors = new List<FireSensor>();
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];

                    Fire fireSensor;

                    if (sensorZone.OrgSensorID != null && dicFireSensors.TryGetValue((int)sensorZone.OrgSensorID, out fireSensor))
                    {
                        sensors.Add(new FireSensor(fireSensor, sensorZone, tagInfo));
                    }
                }
            }

            AddFireSensors(sensors);
        }

        private void AddFireSensors(List<FireSensor> sensors)
        {
            foreach (FireSensor fireSensor in sensors)
            {
                int rowIndex = gridFireSensors.Rows.Add();

                if (rowIndex >= 0)
                {
                    DataGridViewRow row = gridFireSensors.Rows[rowIndex];

                    row.Cells[0].Value = rowIndex + 1;
                    row.Cells[1].Value = fireSensor.Sensor.Name;
                    row.Cells[2].Value = fireSensor.Sensor.PositionName;
                    row.Tag = fireSensor;
                }
            }
        }

        private int SortSensor(PSM sensor1, PSM sensor2)
        {
            if (sensor1.UniqueKey == null)
                return -1;
            else if (sensor2.UniqueKey == null)
                return 1;

            return sensor1.UniqueKey.CompareTo(sensor2.UniqueKey);
        }

        private int SortEtcSensor(ETC sensor1, ETC sensor2)
        {
            if (sensor1.UniqueKey == null)
                return -1;
            else if (sensor2.UniqueKey == null)
                return 1;

            return sensor1.UniqueKey.CompareTo(sensor2.UniqueKey);
        }

        private void AddSensor(string strSensorUniqueKey)
        {
            int nRowIndex = gridSensors.Rows.Add();

            if (nRowIndex < 0)
                return;

            DataGridViewRow row = gridSensors.Rows[nRowIndex];
            row.Cells[0].Value = false;
            row.Cells[1].Value = strSensorUniqueKey;
            row.Cells[2].Value = "";
        }

        private void btnSendFireAlarm_Click(object sender, EventArgs e)
        {
            foreach (DataGridViewCell cell in gridFireSensors.SelectedCells)
            {
                FireSensor fireSensor = (FireSensor)cell.OwningRow.Tag;

                ArrayList arrData = new ArrayList();
                arrData.Add(0);
                arrData.Add(fireSensor.TagInfo.ID);
                arrData.Add(fireSensor.SensorZone.ID);
                arrData.Add(true);

                m_SopQueryMgr.SendAlarmQuery_TEST(arrData, "POST", m_fireAlarmURL);
                return;
            }
        }

        private void btnSendFireClear_Click(object sender, EventArgs e)
        {
            foreach (DataGridViewCell cell in gridFireSensors.SelectedCells)
            {
                FireSensor fireSensor = (FireSensor)cell.OwningRow.Tag;

                ArrayList arrData = new ArrayList();
                arrData.Add(0);
                arrData.Add(fireSensor.TagInfo.ID);
                arrData.Add(fireSensor.SensorZone.ID);
                arrData.Add(false);

                m_SopQueryMgr.SendAlarmQuery_TEST(arrData, "POST", m_fireAlarmURL);
                return;
            }
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            ArrayList arrDatas = new ArrayList();

            foreach (DataGridViewRow row in gridSensors.Rows)
            {
                if (row.Cells[0].Value != null && (bool)row.Cells[0].Value)
                {
                    object sensorValue = row.Cells[2].Value;

                    if (sensorValue == null)
                    {
                        row.Cells[2].Selected = true;
                        MessageBox.Show("전송할 센서의 값을 입력해야 합니다.");
                        return;
                    }

                    double value;

                    if (double.TryParse(sensorValue.ToString().Trim(), out value) == false || value < 0)
                    {
                        row.Cells[2].Selected = true;
                        MessageBox.Show("전송할 센서의 값이 제대로 입력되지 않았습니다.\r\n0 또는 그보다 큰 숫자만 가능합니다.");
                        return;
                    }

                    arrDatas.Add(row.Cells[1].Value.ToString().Trim());
                    arrDatas.Add(value);
                }
            }

            if (arrDatas.Count == 0)
            {
                MessageBox.Show("전송할 센서를 선택해 주세요.");
            }
            else
            {
                string strSendMessage = m_netMgr.Send(arrDatas, checkBoxAlarmStatus.Checked);

                if (strSendMessage != null)
                {
                    OnReceive(strSendMessage);
                }
            }
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            m_netMgr.ReleaseThread();
        }

        public void OnReceive(string str)
        {
            this.Invoke((MethodInvoker)delegate{
                string strMessage = textBoxMessage.Text.Trim();

                if (strMessage.Length > 0)
                    textBoxMessage.Text = strMessage + "\r\n" + str;
                else
                    textBoxMessage.Text = str;
            });
        }
    }

    public interface IMessageOwner
    {
        void OnReceive(string str);
    }

    public class FireSensor
    {
        private Fire m_sensor = null;
        private SensorZone m_sensorZone = null;
        private TagInfo m_tagInfo = null;

        public Fire Sensor
        {
            get { return m_sensor; }
            set { m_sensor = value; }
        }

        public SensorZone SensorZone
        {
            get { return m_sensorZone; }
            set { m_sensorZone = value; }
        }

        public TagInfo TagInfo
        {
            get { return m_tagInfo; }
            set { m_tagInfo = value; }
        }

        public FireSensor()
        {
        }

        public FireSensor(Fire sensor, SensorZone sensorZone, TagInfo tagInfo)
        {
            m_sensor = sensor;
            m_sensorZone = sensorZone;
            m_tagInfo = tagInfo;
        }
    }
}
