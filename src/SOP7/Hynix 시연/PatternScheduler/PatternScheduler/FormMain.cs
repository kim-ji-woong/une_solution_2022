using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Windows.Forms;
using Common.IDAL;
using Common.DAL;

namespace PatternScheduler
{
    public partial class FormMain : Form
    {
        private ScheduleReader m_scheduleReader = null;
        private Dictionary<string, string> m_dicOriginSchedules = new Dictionary<string, string>();
        private bool m_systemInput = false;

        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            DataManager dataManager = GetDataManager();
            m_scheduleReader = new ScheduleReader(dataManager);

            m_systemInput = true;
            SetSchedule();
            m_systemInput = false;
        }

        private void SetSchedule()
        {
            Dictionary<string, List<string>> dicSchedules = m_scheduleReader.ReadSchedules();

            gridSchedule.Rows.Clear();
            m_dicOriginSchedules.Clear();

            int no = 1;

            foreach (KeyValuePair<string, List<string>> pair in dicSchedules)
            {
                int rowIndex = gridSchedule.Rows.Add();
                DataGridViewRow row = gridSchedule.Rows[rowIndex];

                row.Cells[0].Value = no++;
                row.Cells[1].Value = GetEventType(pair.Key);
                row.Cells[1].Tag = pair.Key;
                row.Cells[2].Value = GetScheduleString(pair.Value);
                row.Tag = pair.Value;

                m_dicOriginSchedules[pair.Key] = row.Cells[2].Value.ToString();
            }
        }

        private string GetScheduleString(List<string> schedules)
        {
            string strSchedule = "";

            foreach (string schedule in schedules)
            {
                if (strSchedule.Length == 0)
                    strSchedule = schedule;
                else
                    strSchedule += ";" + schedule;
            }

            return strSchedule;
        }

        private string GetEventType(string strEventType)
        {
            if (strEventType == "foreddooropen")
                return "강제 문열림";
            else if (strEventType == "cheatedtagging")
                return "대리태깅";
            else if (strEventType == "untagging")
                return "꼬리물기";
            else if (strEventType == "stealcard")
                return "사원증 도용";
            else if (strEventType == "stranger")
                return "이상행위자Lv2";
            else if (strEventType == "strangerlv3")
                return "이상행위자Lv3";
            else if (strEventType == "evasionitem")
                return "무인보안 검색 우회";
            else if (strEventType == "notpermittedperson")
                return "비인가 구역 출입";
            else if (strEventType == "notpermitteditem")
                return "비인가 구역 반입";

            return "";
        }

        private DataManager GetDataManager()
        {
            string strDbType = ConfigurationManager.AppSettings.Get("DbType");
            string strDbHost = ConfigurationManager.AppSettings.Get("DbHost");
            string strDbName = ConfigurationManager.AppSettings.Get("DbName");
            string strDbId = ConfigurationManager.AppSettings.Get("DbId");
            string strPW = ConfigurationManager.AppSettings.Get("DbPw");
            string strSiteID = ConfigurationManager.AppSettings.Get("SiteID");

            if (strDbType == null || strDbType.Trim().Length == 0)
                return null;

            if (strDbHost == null || strDbHost.Trim().Length == 0)
                return null;

            if (strDbName == null || strDbName.Trim().Length == 0)
                return null;

            if (strDbId == null || strDbId.Trim().Length == 0)
                return null;

            if (strPW == null || strPW.Trim().Length == 0)
                return null;

            int dbType, siteID;

            if (int.TryParse(strDbType.Trim(), out dbType) == false)
                return null;

            if (int.TryParse(strSiteID.Trim(), out siteID) == false)
                return null;

            DataManager dataManager = new DataManager(dbType, strDbHost, strDbName, strDbId, strPW, siteID);
            return dataManager;
        }

        private void gridSchedule_CellValueChanged(object sender, DataGridViewCellEventArgs e)
        {
            if (m_systemInput)
                return;

            if (e.RowIndex >= 0 && e.ColumnIndex == 2)
            {
                DataGridViewRow row = gridSchedule.Rows[e.RowIndex];
                string strEventType = row.Cells[1].Tag == null ? null : row.Cells[1].Tag.ToString();

                if (strEventType != null)
                {
                    string strOrigin;

                    if (m_dicOriginSchedules.TryGetValue(strEventType, out strOrigin))
                    {
                        string strSchedule = GetTimeSchedule(row.Cells[2].Value == null ? null : row.Cells[2].Value.ToString());

                        if (strOrigin.Trim() == strSchedule)
                        {
                            btnApply.Enabled = false;
                            return;
                        }
                    }

                    btnApply.Enabled = true;
                }
            }
        }

        private string GetTimeSchedule(string strValue)
        {
            if (strValue == null)
                return null;

            string[] tokens = strValue.Split(';');
            string strSchedule = "";

            foreach (string strToken in tokens)
            {
                string[] times = strToken.Split('-');
                string strTimes = "";

                foreach (string strTime in times)
                {
                    if (strTimes.Length == 0)
                        strTimes = strTime;
                    else
                        strTimes += "-" + strTime;
                }

                if (strSchedule.Length == 0)
                    strSchedule = strTimes;
                else
                    strSchedule += ";" + strTimes;
            }

            return strSchedule;
        }

        private void btnApply_Click(object sender, EventArgs e)
        {
            string strErrorMessage;

            foreach (DataGridViewRow row in gridSchedule.Rows)
            {
                string strEventType = (string)row.Cells[1].Tag;

                if (strEventType == null)
                    continue;

                string strSchedule = GetTimeSchedule(row.Cells[2].Value.ToString());

                if (m_scheduleReader.UpdateSchedule(strEventType, strSchedule, out strErrorMessage) == false)
                {
                    MessageBox.Show(strErrorMessage);
                    return;
                }
            }

            MessageBox.Show("적용되었습니다.");
        }
    }
}
