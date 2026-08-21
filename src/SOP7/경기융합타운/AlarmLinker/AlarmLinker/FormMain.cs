using System.Configuration;
using System.Windows.Forms;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil;
using System.Collections.Generic;

namespace AlarmLinker
{
    public partial class FormMain : Form
    {
        private Service m_service = null;

        public FormMain()
        {
            InitializeComponent();
        }

        private void ReadConfig()
        {
            string strOwnDB = ConfigurationManager.AppSettings.Get("OwnDB");
            string strExternalDB = ConfigurationManager.AppSettings.Get("ExternalDB");

            if (strOwnDB == null || strOwnDB.Trim().Length == 0 ||
                strExternalDB == null || strExternalDB.Trim().Length == 0)
                return;

            string strOwnDBInfo = ConfigurationManager.AppSettings.Get("OwnDBInfo");
            string strExternalDBInfo = ConfigurationManager.AppSettings.Get("ExternalDBInfo");

            if (strOwnDBInfo == null || strOwnDBInfo.Trim().Length == 0 ||
                strExternalDBInfo == null || strExternalDBInfo.Trim().Length == 0)
                return;

            IDataManager ownDBManager = Service.GetDataManager(strOwnDB, strOwnDBInfo);
            //IDataManager ownDBManager = GetDataManager(strOwnDB, strOwnDBInfo);

            if (ownDBManager == null)
                return;

            List<IDataManager> externalDBManagers = new List<IDataManager>();

            string[] externalDBNames = strExternalDB.Split(';');
            string[] externalDBInfos = strExternalDBInfo.Split(';');

            int countName = externalDBNames.Length;
            int countInfo = externalDBInfos.Length;
            int min = countName < countInfo ? countName : countInfo;

            for (int i=0;i<min;i++)
            {
                IDataManager dataManager = Service.GetDataManager(externalDBNames[i], externalDBInfos[i]);
                //IDataManager dataManager = GetDataManager(externalDBNames[i], externalDBInfos[i]);

                if (dataManager == null)
                    return;

                externalDBManagers.Add(dataManager);
            }

            m_service = new Service(ownDBManager, externalDBManagers, this.labelErrorMessage);
        }

        private void OnTimer(object sender, System.EventArgs e)
        {
            if (m_service != null)
            {
                m_service.Run();
                m_service.UpdateElevator();
                m_service.UpdateEarthquakeHistory();
            }
        }

        private void FormMain_Load(object sender, System.EventArgs e)
        {
            this.labelErrorMessage.Text = "";
            ReadConfig();

            this.timer1.Start();
        }
    }
}
