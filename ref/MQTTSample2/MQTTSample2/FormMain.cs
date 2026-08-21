using System;
using System.Configuration;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Windows.Forms;
using IntegrationServer.Servers.MQTT.Corners;
using IntegrationServer.Datas;
using System.IO;

namespace MQTTSample2
{
    public partial class FormMain : Form
    {
        private MqttManager m_mgr = null;
        private string m_strFilePath = "mqtt.dat";
        private SensorManager m_sensorManager = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private DataManager GetDataManager()
        {
            string strDbName = ConfigurationManager.AppSettings.Get("DBName");
            string strDbHost = ConfigurationManager.AppSettings.Get("DBHost");
            string strID = ConfigurationManager.AppSettings.Get("ID");
            string strPassword = ConfigurationManager.AppSettings.Get("Password");

            DataManager dataManager = new DataManager(0, strDbHost, strDbName, strID, strPassword);
            return dataManager;
        }

        private string GetServerInfo(out int siteID, out int port)
        {
            siteID = port = 0;

            string strSiteID = textBoxSiteID.Text.Trim();

            if (strSiteID.Length == 0)
            {
                textBoxSiteID.Focus();
                MessageBox.Show("Site ID를 입력하세요.");
                return null;
            }

            if (int.TryParse(strSiteID, out siteID) == false)
            {
                textBoxSiteID.Focus();
                MessageBox.Show("Site ID는 정수만 가능합니다.");
                return null;
            }

            string strPort = textBoxPort.Text.Trim();

            if (strPort.Length == 0)
            {
                textBoxPort.Focus();
                MessageBox.Show("Port를 입력하세요.");
                return null;
            }

            if (int.TryParse(strPort, out port) == false)
            {
                textBoxPort.Focus();
                MessageBox.Show("Port는 정수만 가능합니다.");
                return null;
            }

            string strIP = textBoxIP.Text.Trim();

            if (strIP.Length == 0)
            {
                textBoxIP.Focus();
                MessageBox.Show("IP를 입력하세요.");
                return null;
            }

            return strIP;
        }

        private void btnApply_Click(object sender, EventArgs e)
        {
            Dictionary<ServerProperty, object> serverProperties = new Dictionary<ServerProperty, object>();

            int siteID, port;
            string strIP = GetServerInfo(out siteID, out port);

            if (strIP != null)
            {
                serverProperties[ServerProperty.SiteID] = (long)siteID;
                serverProperties[ServerProperty.MpcID] = (long)1;

                int dbSiteID;

                if (GetDbSiteID(out dbSiteID))
                {
                    SetManager(dbSiteID, port, strIP, serverProperties);
                    btnApply.Enabled = false;
                }
            }

            WriteData();
        }

        private bool GetDbSiteID(out int siteID)
        {
            siteID = 0;
            string strSiteID = ConfigurationManager.AppSettings.Get("SiteID");

            if (strSiteID == null || strSiteID.Length == 0)
            {
                MessageBox.Show("SiteID가 설정되어 있지 않습니다. app.config 파일을 확인하세요.");
                return false;
            }

            if (int.TryParse(strSiteID.Trim(), out siteID) == false)
            {
                MessageBox.Show("SiteID는 정수만 가능합니다. app.config 파일을 확인하세요.");
                return false;
            }

            return true;
        }

        private void SetManager(int siteID, int port, string strIP, Dictionary<ServerProperty, object> serverProperties)
        {
            DataManager dataManager = GetDataManager();
            m_mgr = new MqttManager(null, dataManager, 1, siteID, strIP, port, "MQTT 테스터", serverProperties);
            m_mgr.Logger = IntegrationServer.Logger.Instance;
        }

        private void btnFire_Click(object sender, EventArgs e)
        {
            string strTagNo = textBoxTagNo.Text.Trim();

            if (strTagNo.Length == 0)
            {
                textBoxTagNo.Focus();
                MessageBox.Show("Tag No를 입력하세요.");
                return;
            }

            m_mgr.Publish(strTagNo, true);
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            string strTagNo = textBoxTagNo.Text.Trim();

            if (strTagNo.Length == 0)
            {
                textBoxTagNo.Focus();
                MessageBox.Show("Tag No를 입력하세요.");
                return;
            }

            m_mgr.Publish(strTagNo, false);
        }

        private void ReadData()
        {
            if (File.Exists(m_strFilePath) == false)
                return;

            int siteID = -1, port = -1;
            string strIP = null;
            StreamReader reader = new StreamReader(m_strFilePath, System.Text.Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                int index = strLine.IndexOf(':');

                if (index < 0)
                    continue;

                string strName = strLine.Substring(0, index).Trim();
                string strValue = strLine.Substring(index + 1).Trim();

                if (strName == "SiteID")
                    textBoxSiteID.Text = strValue;
                else if (strName == "IP")
                {
                    textBoxIP.Text = strValue;
                    strIP = strValue;
                }
                else if (strName == "Port")
                    textBoxPort.Text = strValue;
                else if (strName == "TagNo")
                    textBoxTagNo.Text = strValue;
            }

            reader.Close();

            int.TryParse(textBoxSiteID.Text, out siteID);
            int.TryParse(textBoxPort.Text, out port);

            Dictionary<ServerProperty, object> serverProperties = new Dictionary<ServerProperty, object>();
            serverProperties[ServerProperty.SiteID] = (long)siteID;
            serverProperties[ServerProperty.MpcID] = (long)1;

            int dbSiteID;

            if (GetDbSiteID(out dbSiteID))
                SetManager(dbSiteID, port, strIP, serverProperties);
        }

        private void WriteData()
        {
            StreamWriter writer = new StreamWriter(m_strFilePath, false, System.Text.Encoding.UTF8);

            writer.WriteLine("SiteID : " + textBoxSiteID.Text);
            writer.WriteLine("IP : " + textBoxIP.Text);
            writer.WriteLine("Port : " + textBoxPort.Text);
            writer.WriteLine("TagNo : " + textBoxTagNo.Text);

            writer.Close();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            ReadData();

            m_sensorManager = new SensorManager(GetDataManager());
            m_sensorManager.ReadData(cboFloor);
        }

        private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            WriteData();
        }

        private void cboFloor_SelectedIndexChanged(object sender, EventArgs e)
        {
            string strFloor = cboFloor.Items[cboFloor.SelectedIndex].ToString();
            m_sensorManager.SetGrid(strFloor, gridSensors);
        }

        private void gridSensors_MouseClick(object sender, MouseEventArgs e)
        {
            foreach (DataGridViewCell cell in gridSensors.SelectedCells)
            {
                DataGridViewRow row = gridSensors.Rows[cell.RowIndex];
                string strTagNo = row.Cells[2].Value.ToString();

                textBoxTagNo.Text = strTagNo;
            }
        }
    }
}
