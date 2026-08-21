using System;
using System.Configuration;
using System.Windows.Forms;
using Hynix.DAL;
using Hynix.Model;
using System.Collections.Generic;

namespace PatternTester
{
    public partial class FormMain : Form, IControlOwner
    {
        private const int CheatedTagging = 1;
        private const int ForcedOpen = 0;

        private DataManager m_dataManager = null;
        private FormHelp m_frmHelp = null;

        private FormCheatedTagging m_frmCheatedTagging = null;
        private FormForcedDoorOpen m_frmForcedDoorOpen = null;

        public FormMain()
        {
            InitializeComponent();

            m_frmCheatedTagging = new FormCheatedTagging(this);
            m_frmForcedDoorOpen = new FormForcedDoorOpen(this);
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            if (GetDbManager())
            {
                cboAlarmType.SelectedIndex = 0;
            }

            panel1.Controls.Add(m_frmForcedDoorOpen);
            m_frmForcedDoorOpen.Dock = DockStyle.Left;
            m_frmForcedDoorOpen.Visible = false;

            panel1.Controls.Add(m_frmCheatedTagging);
            m_frmCheatedTagging.Dock = DockStyle.Left;
            m_frmCheatedTagging.Visible = false;
        }

        private bool GetDbManager()
        {
            string strDbType = ConfigurationManager.AppSettings.Get("DbType");
            string strDbHost = ConfigurationManager.AppSettings.Get("DbHost");
            string strDbName = ConfigurationManager.AppSettings.Get("DbName");
            string strDbId = ConfigurationManager.AppSettings.Get("DbId");
            string strPW = ConfigurationManager.AppSettings.Get("DbPw");

            if (strDbType == null || strDbType.Trim().Length == 0)
                return false;

            if (strDbHost == null || strDbHost.Trim().Length == 0)
                return false;

            if (strDbName == null || strDbName.Trim().Length == 0)
                return false;

            if (strDbId == null || strDbId.Trim().Length == 0)
                return false;

            if (strPW == null || strPW.Trim().Length == 0)
                return false;

            int dbType;

            if (int.TryParse(strDbType.Trim(), out dbType) == false)
                return false;

            m_dataManager = new DataManager(dbType, strDbHost, strDbName, strDbId, strPW, 10);
            return true;
        }

        private void cboAlarmType_SelectedIndexChanged(object sender, System.EventArgs e)
        {
            int sensorType = GetCurrentSensorType();

            if (sensorType == (int)AgentFactory.BLL.Facility.FacilityType.Event_CheatedTagging)
                ShowCheatedTagging();
            else if (sensorType == (int)AgentFactory.BLL.Facility.FacilityType.Event_ForcedDoorOpen)
                ShowForcedDoorOpen();

            if (checkBoxOptions.Checked == false)
            {
                string strErrorMessage;
                AlarmScript script = ReadAlarmScript(sensorType, out strErrorMessage);

                if (script == null)
                {
                    this.textBoxPolicy.Text = "";
                    MessageBox.Show(strErrorMessage);
                }
                else
                {
                    this.textBoxPolicy.Text = script.Script;
                }
            }
        }

        private void ShowCheatedTagging()
        {
            m_frmForcedDoorOpen.Visible = false;
            m_frmCheatedTagging.Show();
            m_frmCheatedTagging.GetScript();
        }

        private void ShowForcedDoorOpen()
        {
            m_frmCheatedTagging.Visible = false;
            m_frmForcedDoorOpen.Show();
            m_frmForcedDoorOpen.GetScript();
        }

        private int GetCurrentSensorType()
        {
            int sensorType;

            if (this.cboAlarmType.SelectedIndex == CheatedTagging)
                sensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_CheatedTagging;
            else if (this.cboAlarmType.SelectedIndex == ForcedOpen)
                sensorType = (int)AgentFactory.BLL.Facility.FacilityType.Event_ForcedDoorOpen;
            else
                sensorType = -1;

            return sensorType;
        }

        private AlarmScript ReadAlarmScript(int sensorType, out string strErrorMessage)
        {
            AlarmScript script = m_dataManager.GetSelectManager().SelectHynixAlarmScript(sensorType, out strErrorMessage);

            if (script == null)
            {
                if (strErrorMessage != null && strErrorMessage.Length > 0)
                    return null;

                script = new AlarmScript();
                script.Script = "";
                return script;
            }

            return script;
        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            string strErrorMessage;
            string strChanged;
            List<string> varisbles = dnsAlarmScript.V1.Validator.CheckValidation(this.textBoxPolicy.Text.Trim(), out strChanged, out strErrorMessage);

            if (varisbles == null)
            {
                MessageBox.Show(strErrorMessage);
                return;
            }

            int sensorType = GetCurrentSensorType();

            AlarmScript script = ReadAlarmScript(sensorType, out strErrorMessage);

            if (script != null && script.SensorTypeID > 0)
            {
                script.Script = this.textBoxPolicy.Text.Trim();

                if (m_dataManager.GetUpdateManager().UpdateHynixAlarmScript(script, out strErrorMessage))
                {
                    MessageBox.Show("적용되었습니다.");
                    return;
                }
            }
            else
            {
                if (strErrorMessage == null || strErrorMessage.Length == 0)
                {
                    script = new AlarmScript();
                    script.SensorTypeID = sensorType;
                    script.Script = this.textBoxPolicy.Text.Trim();

                    if (m_dataManager.GetCreateManager().CreateHynixAlarmScript(script, out strErrorMessage) != null)
                    {
                        MessageBox.Show("적용되었습니다.");
                        return;
                    }
                }
            }

            MessageBox.Show(strErrorMessage);
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            int sensorType = GetCurrentSensorType();

            string strErrorMessage;
            AlarmScript script = ReadAlarmScript(sensorType, out strErrorMessage);

            if (script != null)
                this.textBoxPolicy.Text = script.Script;
        }

        private void btnHelp_Click(object sender, EventArgs e)
        {
            if (m_frmHelp == null || m_frmHelp.Visible == false)
            {
                m_frmHelp = new FormHelp();
                m_frmHelp.Show();
            }
            else
                m_frmHelp.Show();
        }

        private void checkBoxOptions_CheckedChanged(object sender, EventArgs e)
        {
            panel1.Visible = !panel1.Visible;

            if (panel1.Visible)
            {
                int sensorType = GetCurrentSensorType();

                if (sensorType == (int)AgentFactory.BLL.Facility.FacilityType.Event_CheatedTagging)
                    ShowCheatedTagging();
                else if (sensorType == (int)AgentFactory.BLL.Facility.FacilityType.Event_ForcedDoorOpen)
                    ShowForcedDoorOpen();
            }
        }

        public void SetScript(string strScript)
        {
            this.textBoxPolicy.Text = strScript;
        }
    }

    public interface IControlOwner
    {
        void SetScript(string strScript);
    }
}
