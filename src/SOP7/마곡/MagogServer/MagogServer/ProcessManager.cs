using dnsCommunicateSopServer;
using dnsDBUtil;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using SDMS.DAL;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace MagogServer
{
    public class ProcessManager
    {
        private DataManager m_dataManager = null;

        private SensorManager m_sensorManager = null;
        public SensorManager SensorManager { get { return m_sensorManager; } }

        private FireProvider m_fireProvider = null;

        private WebServiceManager m_webServiceManager = null;

        private bool m_runThread = false;
        public bool RunThread { get { return m_runThread; } }

        private bool m_bIsConnectFire = false;

        Thread m_Thread = null;

        private int m_nSlaveID = 1;
        private string m_strServerIP = "192.168.122.5";
        private int m_nPort = 502;

        private int m_nThreadDelay = 100;   // 단위 0.1 초

        public ProcessManager()
        {
            Init();            
        }

        private void Init()
        {
            // 설정 값 불러오기
            var builder = new ConfigurationBuilder()
               .SetBasePath(Application.StartupPath)
               .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = builder.Build();
            var siteConfig = new Site();
            configuration.GetSection("Site").Bind(siteConfig);

            var modbusInfo = new ModbusInfo();
            configuration.GetSection("ModbusInfo").Bind(modbusInfo);

            var info = new Info();
            configuration.GetSection("Info").Bind(info);

            if (siteConfig.DBName == null || siteConfig.DbHost == null || siteConfig.DbID == null || siteConfig.DbPw == null ||
                modbusInfo.IP == null || info.SOPWebServerURL_Fire == null || info.WebServiceBaseURL == null)
            {
                Logger.Instance.Write("ProcessManager Init() Error : appsettings.json 설정 값을 확인해주세요");
                return;
            }                
            else
            {
                string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

                string strDBHost = AES256Cipher.AES_decrypt(siteConfig.DbHost.Trim(), key);
                string strDbID = AES256Cipher.AES_decrypt(siteConfig.DbID.Trim(), key);
                string strDbPw = AES256Cipher.AES_decrypt(siteConfig.DbPw.Trim(), key);

                m_dataManager = new DataManager(siteConfig.DBType, strDBHost, siteConfig.DBName, strDbID, strDbPw, siteConfig.ID);

                m_nSlaveID = modbusInfo.SlaveID;
                m_strServerIP = modbusInfo.IP;
                m_nPort = modbusInfo.Port;

                //m_fireProvider = new FireProvider(this, m_sopQueryMgr, m_nSlaveID, m_strServerIP, m_nPort, info.SOPWebServerURL_Fire);

                m_sensorManager = new SensorManager(m_dataManager);

                m_webServiceManager = new WebServiceManager(this, info.WebServiceBaseURL, info.SOPWebServerURL_Fire);
            }
        }

        public void Start()
        {
            if (m_runThread)
                return;

            m_runThread = true;

            m_Thread = new Thread(new ThreadStart(RequestThread));
            m_Thread.Start();
        }

        public void Stop()
        {
            m_runThread = false;
        }

        private void RequestThread()
        {
            string strErrorMessage = null;

            while (m_runThread)
            {
                try
                {
                    // 화재 API 형식으로 수정으로 주석처리
                    //if (m_fireProvider != null && m_fireProvider.IsConnected == false)
                    //{   // 연결시도
                    //    bool bResult = m_fireProvider.Connect(m_fireProvider.ServerIP, m_fireProvider.Port);

                    //    if (m_bIsConnectFire == false && bResult == true)
                    //    {   // 연결 성공
                    //        m_bIsConnectFire = true;
                    //        Logger.Instance.Write("ProcessManager Connect 성공");
                    //    }
                    //    else if (m_bIsConnectFire == true && bResult == false)
                    //    {   // 연결 실패
                    //        m_bIsConnectFire = false;
                    //        Logger.Instance.Write("ProcessManager Connect 실패");
                    //    }

                    //    DelayThread(5);
                    //}
                    //else
                    //{   // 데이터 요청
                    //    m_fireProvider.RequestFireData();
                    //    DelayThread(m_nThreadDelay);
                    //}


                    // 화재
                    List<string> fireAlarms = new List<string>();

                    Dictionary<string, JObject> fireDatas = m_webServiceManager.RequestGroupDatas(WebServiceManager.FIRE_TAG, out strErrorMessage);
                    if (fireDatas == null)                    
                        Logger.Instance.Write("ProcessManager FIRE_TAG RequestGroupDatas() Error : " + strErrorMessage);                    
                    else
                    {
                        // 화재 알람 처리
                        m_webServiceManager.CheckFireAlarm(fireDatas);
                    }

                    DelayThread(5);



                    // 출입문
                    List<string> doorStates = new List<string>();

                    Dictionary<string, JObject> doorDatas = m_webServiceManager.RequestGroupDatas(WebServiceManager.DOOR_TAG, out strErrorMessage);
                    if (doorDatas == null)
                        Logger.Instance.Write("ProcessManager DOOR_TAG RequestGroupDatas() Error : " + strErrorMessage);
                    else
                    {
                        // 출입문 상태 업데이트
                        m_webServiceManager.CheckDoorState(doorDatas);
                    }

                    DelayThread(5);

                }
                catch (Exception e)
                {
                    Logger.Instance.Write("ProcessManager RequestThread() Error : " + e.Message);
                    DelayThread(m_nThreadDelay);
                    continue;
                }
            }
        }

        public bool DelayThread(int nSecond)
        {
            for (int i = 0; i < nSecond; i++)
            {
                if (m_runThread == false)
                    return false;

                Thread.Sleep(100);
            }

            return true;
        }

        public bool TestAlarm(bool bAlarm)
        {
            m_webServiceManager.TestAlarm(bAlarm);

            return true;
        }

        public bool UpdateFireSensorName()
        {
            m_sensorManager.UpdateFireSensorName();

            return true;
        }

    }

    
}
