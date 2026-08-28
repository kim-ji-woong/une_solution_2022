using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;
using WonikErpNSheServer.Gas;

namespace WonikErpNSheServer
{
    public class ProcessManager
    {
        private DirectDBManager m_sheDBManager = null;
        private DirectDBManager m_erpDBManager = null;
        private DirectDBManager m_environDBManager = null;
        private DirectDBManager m_hmiDBManager = null;
        private DirectDBManager m_envSDBManager = null;

        private TeamEditor.DAL.DataManager m_dataManager = null;
        private Dashboard.DAL.DataManager m_dashboardDataManager = null;
        private Common.DAL.DataManager m_commonDataManager = null;
        private SOPManager.DAL.DataManager m_sopDataManager = null;
        private SDMS.DAL.DataManager m_sdmsDataManager = null;

        private TeamEditor.BLL.ProcessManager m_teamProcessManager = null;

        Thread m_watchSHE = null;
        Thread m_watchERP = null;
        Thread m_watchHMI = null;

        SHEManager m_sheManager = null;
        ERPManager m_erpManager = null;        
        DBDataManager m_dbDataManager = null;
        GasManager m_gasManager = null;
        EnvironManager m_environManager = null;
        HMIManager m_hmiManager = null;
        EnvSManager m_envSManager = null;

        bool m_shutdownThread = true;

        int m_nSHEThreadSleep = 1000 * 60 * 60;     // 1시간
        int m_nERPThreadSleep = 1000 * 60 * 10;     // 10분
        int m_nErrorSleep = 1000 * 60;

        private DateTime m_dtLast = new DateTime();

        public ProcessManager()
        {
            Init();

            m_teamProcessManager = new TeamEditor.BLL.ProcessManager(m_commonDataManager, m_dataManager, m_sopDataManager, m_sdmsDataManager);

            m_sheManager = new SHEManager(m_sheDBManager);
            m_erpManager = new ERPManager(m_erpDBManager, m_dataManager, m_sopDataManager, m_sdmsDataManager);
            m_dbDataManager = new DBDataManager(m_dashboardDataManager, m_sdmsDataManager);
            m_environManager = new EnvironManager(m_environDBManager, m_dbDataManager);
            m_hmiManager = new HMIManager(m_hmiDBManager, m_dbDataManager);
            m_envSManager = new EnvSManager(m_envSDBManager, m_dbDataManager);

            m_gasManager = new GasManager(m_dbDataManager);
        }

        public void Start()
        {
            if (m_shutdownThread == true)
            {
                m_shutdownThread = false;

#if ERP
                // ERP 관련 쓰레드 생성
                m_watchERP = new Thread(() => WatchERPThread());
                m_watchERP.Start();
#endif

#if SERVER
                // SHE 관련 쓰레드 생성
                m_watchSHE = new Thread(() => WatchSHEThread());
                m_watchSHE.Start();

                // 환경설비 서버 시작
                m_environManager.Start();

                // 제조설비 서버 시작
                m_hmiManager.Start();

                // 환경S 서버 시작
                m_envSManager.Start();
#endif

#if GAS
                // 가스서버 시작
                m_gasManager.Start();
#endif
            }
        }

        public void Stop()
        {
            m_shutdownThread = true;
#if ERP
            m_watchERP.Abort();
#endif

#if SERVER
            m_watchSHE.Abort();

            // 환경설비 서버 정지
            m_environManager.Stop();

            m_hmiManager.Stop();

            m_envSManager.Stop();
#endif

#if GAS
            // 가스서버 정지
            m_gasManager.Stop();
#endif
        }

        private void Init()
        {
            // DB 초기화
            string strSiteID = ConfigurationManager.AppSettings.Get("SITE_ID");
            if (strSiteID == null || strSiteID.Length == 0)
                strSiteID = "30";

            string strDBName = ConfigurationManager.AppSettings.Get("DB_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "WSOP_30";

            string strDBType = ConfigurationManager.AppSettings.Get("DB_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "0";

            string strDBHost = ConfigurationManager.AppSettings.Get("DB_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "AwVB0IrUXAghp5PlaWuqWg==";

            string strDBId = ConfigurationManager.AppSettings.Get("DB_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "GUk6cJACqVBoIFh7ny7mqQ==";

            string strDBPw = ConfigurationManager.AppSettings.Get("DB_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "SezOwMM9A2mIbUk5DCW/eQ==";

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim(), key);
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim(), key);
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim(), key);

            int nSiteID, nDBType;
            int.TryParse(strSiteID.Trim(), out nSiteID);
            int.TryParse(strDBType.Trim(), out nDBType);

            m_dataManager = new TeamEditor.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_dashboardDataManager = new Dashboard.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_commonDataManager = new Common.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_sopDataManager = new SOPManager.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);
            m_sdmsDataManager = new SDMS.DAL.DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);



            // SHE DB 초기화
            string strSHEDBName = ConfigurationManager.AppSettings.Get("SHE_NAME");
            if (strSHEDBName == null || strSHEDBName.Length == 0)
                strSHEDBName = "WONIKSHE";

            string strSHEDBType = ConfigurationManager.AppSettings.Get("SHE_TYPE");
            if (strSHEDBType == null || strSHEDBType.Length == 0)
                strSHEDBType = "0";

            // SHE_HOST / SHE_ID / SHE_PW 는 AES256 암호화되어 저장되므로 기본값도 암호문으로 둔다.
            // (기본값 평문: 10.199.3.31 / qncshe / Qnc12345^)
            string strSHEDBHost = ConfigurationManager.AppSettings.Get("SHE_HOST");
            if (strSHEDBHost == null || strSHEDBHost.Length == 0)
                strSHEDBHost = "lKX/i6jb42jMUc3LUEh1ww==";

            string strSHEDBId = ConfigurationManager.AppSettings.Get("SHE_ID");
            if (strSHEDBId == null || strSHEDBId.Length == 0)
                strSHEDBId = "pmp6wJ+k2PL0Ir1EiDg+AA==";

            string strSHEDBPw = ConfigurationManager.AppSettings.Get("SHE_PW");
            if (strSHEDBPw == null || strSHEDBPw.Length == 0)
                strSHEDBPw = "ZwGcSDNEsUG7BBxdSRgS2Q==";

            // DB_HOST / DB_ID / DB_PW 와 동일한 키로 복호화한다. (key 는 위에서 정의됨)
            strSHEDBHost = AES256Cipher.AES_decrypt(strSHEDBHost.Trim(), key);
            strSHEDBId = AES256Cipher.AES_decrypt(strSHEDBId.Trim(), key);
            strSHEDBPw = AES256Cipher.AES_decrypt(strSHEDBPw.Trim(), key);

            int nSHEDBType = 0;

            if (int.TryParse(strSHEDBType.Trim(), out int nTemp))
                nSHEDBType = nTemp;

            m_sheDBManager = new DirectDBManager(nSHEDBType, strSHEDBHost, strSHEDBName, strSHEDBId, strSHEDBPw);




            // ERP DB 초기화
            string strERPDBName = ConfigurationManager.AppSettings.Get("ERP_NAME");
            if (strERPDBName == null || strERPDBName.Length == 0)
                strERPDBName = "Wonik_ERP";

            m_erpDBManager = new DirectDBManager(nDBType, strDBHost, strERPDBName, strDBId, strDBPw);


            // 환경설비 DB 초기화
            string strEnvironDBName = ConfigurationManager.AppSettings.Get("Environ_NAME");
            if (strEnvironDBName == null || strEnvironDBName.Length == 0)
                strEnvironDBName = "Wonik_Environment";

            m_environDBManager = new DirectDBManager(nDBType, strDBHost, strEnvironDBName, strDBId, strDBPw);


            // 제조설비 DB 초기화
            string strHmiDBName = ConfigurationManager.AppSettings.Get("HMI_NAME");
            if (strHmiDBName == null || strHmiDBName.Length == 0)
                strHmiDBName = "Wonik_HMI";

            m_hmiDBManager = new DirectDBManager(nDBType, strDBHost, strHmiDBName, strDBId, strDBPw);


            // 환경설비S DB 초기화
            string strEnvSDBName = ConfigurationManager.AppSettings.Get("EnvironS_NAME");
            if (strEnvSDBName == null || strEnvSDBName.Length == 0)
                strEnvSDBName = "Wonik_EnvS";

            m_envSDBManager = new DirectDBManager(nDBType, strDBHost, strEnvSDBName, strDBId, strDBPw);
        }

        private void WatchERPThread()
        {
            string strErrorMessage = "";
            m_erpManager.Logger.Write("WatchERPThread 실행");

            while (!m_shutdownThread)
            {               
                try
                {
                    // 첫 실행 또는 다음날 최초 동작, 1시 이후
                    DateTime temp = new DateTime();
                    DateTime dtNow = DateTime.Now;

                    int nCurrentTime = dtNow.Hour;

                    int nSubDay = dtNow.DayOfYear - m_dtLast.DayOfYear;

                    if ((temp != m_dtLast && nSubDay == 0) || 1 > nCurrentTime)
                    {
                        Thread.Sleep(m_nERPThreadSleep);
                        continue;
                    }

                    Dictionary<string, ERPRegular> dicERPRegulars = null;
                    Dictionary<string, ERPRegularMember> dicERPRegularMembers = null;

                    // ERP DB 불러오기
                    if (m_erpManager.LoadERPData(out dicERPRegulars, out dicERPRegularMembers, out strErrorMessage) == false)
                    {
                        m_erpManager.Logger.Write("1. WatchERPThread 오류 (LoadERPData 오류: " + strErrorMessage + ")");
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }

                    Dictionary<string, List<RegularMember>> dicPathRegularMember = null;

                    // 모듈에 맞춰 데이터 작업
                    if (m_erpManager.SetUpdateData(dicERPRegulars, dicERPRegularMembers, out dicPathRegularMember, out strErrorMessage) == false)
                    {
                        m_erpManager.Logger.Write("2. WatchERPThread 오류 (SetUpdateData 오류: " + strErrorMessage + ")");
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }

                    //if (m_teamProcessManager.GetSaveManager().UpdateRegularMemberData(dicPathRegularMember, out strErrorMessage) == false)
                    if (m_erpManager.UpdateRegularMemberData(dicPathRegularMember, out strErrorMessage) == false)
                    {
                        m_erpManager.Logger.Write("3. WatchERPThread 오류 (UpdateRegularMemberData 오류: " + strErrorMessage + ")");
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }

                    // ERP 업데이트 완료 체크 및 28일 이후 데이터 삭제
                    if (m_erpManager.CheckERPDataLoad(out strErrorMessage) == false)
                    {
                        m_erpManager.Logger.Write("4. WatchERPThread 오류 (CheckERPDataLoad 오류: " + strErrorMessage + ")");
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }

                    m_dtLast = dtNow;

                    Thread.Sleep(m_nERPThreadSleep);
                }
                catch (Exception ex)
                {
                    m_sheManager.Logger.Write("[ERROR] WatchERPThread() Exception : " + ex.Message);
                }
            }
        }

        private void WatchSHEThread()
        {
            string strErrorMessage = "";
            m_sheManager.Logger.Write("WatchSHEThread 실행");

            while (!m_shutdownThread)
            {                
                try
                {
                    // 오늘 일자 캠퍼스별 작업현황 불러오기
                    List<WorkPermitData> workPermitDatas = m_sheManager.GetSHEWorkPermit(DateTime.Today, out strErrorMessage);
                    if (workPermitDatas == null)
                    {
                        m_sheManager.Logger.Write(strErrorMessage);
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }


                    // DB에 추가 및 업데이트
                    if (m_dbDataManager.UpdateSHEWorkPermit(workPermitDatas, out strErrorMessage) == false)
                    {
                        m_sheManager.Logger.Write(strErrorMessage);
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }


                    Thread.Sleep(m_nSHEThreadSleep);
                }
                catch (Exception ex)
                {
                    m_sheManager.Logger.Write("[ERROR] WatchSHEThread() Exception : " + ex.Message);
                }
            }
        }

        private void WatchHmiThread()
        {
            string strErrorMessage = "";
            m_sheManager.Logger.Write("WatchHmiThread 실행");

            while (!m_shutdownThread)
            {

            }
        }
    }
}
