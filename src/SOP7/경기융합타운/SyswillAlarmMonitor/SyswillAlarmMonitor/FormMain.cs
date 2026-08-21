using System;
using System.Windows.Forms;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;

namespace SyswillAlarmMonitor
{
    public partial class FormMain : Form
    {
        private AlarmManager m_alarmManager = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void FormMain_Load(object sender, EventArgs e)
        {
            m_alarmManager = new AlarmManager();
            SetSiteName();

            timer1.Start();
        }

        private void OnTimer(object sender, EventArgs e)
        {
            m_alarmManager.ReadAlarms(10);
        }

        private void SetSiteName()
        {
            DataManager dataManager = m_alarmManager.DataManager;

            if (dataManager != null)
            {
                string strErrorMessage;
                string strSQL = "Select SiteName name from Site where ID = " + m_alarmManager.SiteID.ToString();
                IEnumerable<dynamic> results = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

                if (results != null)
                {
                    foreach (var data in results)
                    {
                        string strSiteName = (string)data.name;
                        labelSite.Text = strSiteName;
                    }
                }
            }
        }
    }
}
