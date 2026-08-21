using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup
{
    public class Service
    {
        private DateTime m_dtPrev = new DateTime();
        // 2시에 실행한다.
        private int m_nTargetHour = 2;

        private bool m_isProcessing = false;

        public void Run()
        {
            DateTime dtNow = DateTime.Now;

            if (m_dtPrev.Hour != m_nTargetHour && dtNow.Hour == m_nTargetHour)
            {
                m_dtPrev = dtNow;

                if (m_isProcessing)
                    return;

                m_isProcessing = true;

                string strSopWebServerUrl;
                IDataManager dataManager = SettingManager.LoadDataManager(out strSopWebServerUrl);

                if (dataManager != null)
                {
                    BackupManager backupManager = new BackupManager(dataManager);
                    backupManager.Run(strSopWebServerUrl);
                }

                m_isProcessing = false;
            }
        }
    }
}
