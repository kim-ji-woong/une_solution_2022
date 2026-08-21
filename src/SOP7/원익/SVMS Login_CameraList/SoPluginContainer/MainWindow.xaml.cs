using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Collections.Concurrent;
using System.Collections.ObjectModel;

using S1SVMSSDKv2.Info;
using SoPluginContainer.ViewModel;
using dnsData.Sensor;
using SDMS.Model.CCTV;
using System.Configuration;
using SDMS.DAL;


namespace SoPluginContainer
{
    /// <summary>
    /// MainWindow.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class MainWindow : ISVMSEventOwner
    {
        private class Message
        {
            public DateTime EventTime;
            public string UniqueKey;
            public Facility.FacilityType SensorType;
            public string MessageString;

            public Message()
            {
            }

            public Message(DateTime eventTime, string uniqueKey, Facility.FacilityType sensorType, string message)
            {
                EventTime = eventTime;
                UniqueKey = uniqueKey;
                SensorType = sensorType;
                MessageString = message;
            }
        }

        private string m_strSvmsIP = null;
        private int m_nSvmsPort = 0;
        private string m_strSvmsID = null;
        private string m_strSvmsPW = null;

        private ManagementServer ManagementServer = null;

        private DataManager m_dataManager = null;
        private Common.DAL.DataManager m_commonDataManager = null;

        private CCTVManager m_cctvManager = null;
        private AlarmManager m_alarmManager = null;

        private System.Windows.Forms.Timer m_timer = null;

        private DateTime? m_dtLastChanged = null;
        // 마지막에 CCTV List를 확인한 날짜
        private DateTime m_dtLastChecked;

        private CameraListViewModel m_cameraListView = null;

        private System.Collections.Concurrent.ConcurrentQueue<Message> m_messageQueues = new System.Collections.Concurrent.ConcurrentQueue<Message>();
        private bool m_closeThread = false;

        private int m_nLastIntelligentEvent = 0;

        public MainWindow()
        {
            InitializeComponent();

            Logger.Instance.Write("[MainWindow] 접속중입니다...");

            if (ReadConfig(out int nSiteID, out int nDBType, out string strDBName, out string strHost, out string strID, out string strPW, out string strSvmsIP, out int nSvmsPort, out string strSvmsID, out string strSvmsPW))
            {
                m_strSvmsIP = strSvmsIP;
                m_nSvmsPort = nSvmsPort;
                m_strSvmsID = strSvmsID;
                m_strSvmsPW = strSvmsPW;

                m_dataManager = new DataManager(nDBType, strHost, strDBName, strID, strPW, nSiteID);
                m_commonDataManager = new Common.DAL.DataManager(nDBType, strHost, strDBName, strID, strPW, nSiteID);
            }
            else
            {
                Logger.Instance.Write("[MainWindow] ReadConfig Error");
            }
        }

        private static bool ReadConfig(out int nSiteID, out int nDBType, out string strDBName, out string strHost, out string strID, out string strPW, out string strSvmsIP, out int nSvmsPort, out string strSvmsID, out string strSvmsPW)
        {
            nSiteID = nDBType = nSvmsPort = 0;
            strHost = strID = strPW = strDBName = strSvmsIP = strSvmsID = strSvmsPW = null;

            string strSiteID = ConfigurationManager.AppSettings.Get("siteid");
            string strDBType = ConfigurationManager.AppSettings.Get("dbType");

            if (strSiteID == null || strDBType == null)
                return false;

            if (int.TryParse(strSiteID, out nSiteID) == false || int.TryParse(strDBType, out nDBType) == false)
                return false;

            strDBName = ConfigurationManager.AppSettings.Get("dbName");

            strHost = ConfigurationManager.AppSettings.Get("dbHost");
            strID = ConfigurationManager.AppSettings.Get("dbID");
            strPW = ConfigurationManager.AppSettings.Get("dbPw");

            if (strDBName == null || strID == null || strPW == null)
                return false;

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strHost = dnsDBUtil.AES256Cipher.AES_decrypt(strHost, key);
            strID = dnsDBUtil.AES256Cipher.AES_decrypt(strID, key);
            strPW = dnsDBUtil.AES256Cipher.AES_decrypt(strPW, key);

            string svmsIP = ConfigurationManager.AppSettings.Get("svmsIP");
            string port = ConfigurationManager.AppSettings.Get("port");
            string id = ConfigurationManager.AppSettings.Get("id");
            string password = ConfigurationManager.AppSettings.Get("password");

            if (svmsIP == null || port == null || id == null || password == null)
                return false;

            int svmsPort;

            if (int.TryParse(port, out svmsPort) == false)
                return false;

            strSvmsIP = svmsIP;
            nSvmsPort = svmsPort;
            strSvmsID = id;
            strSvmsPW = password;

            return true;
        }

        private void root_Loaded(object sender, RoutedEventArgs e)
        {
            //Window.GetWindow(this).Close();

            if (m_strSvmsIP == null || m_strSvmsID == null || m_strSvmsPW == null)
                return;

            Logger.Instance.Write("[MainWindow] START");

            var managementServer = new ManagementServer(m_strSvmsIP, m_nSvmsPort, m_strSvmsID, m_strSvmsPW, false, 3, S1SVMSSDKv2.Model.Etc.SVMSClientType.ivaviewer, S1SVMSSDKv2.Model.Etc.SVMSClientType_v2.MosaicViewer);
            var serverKey = managementServer.Key;

            InitializeSVMSResponse(managementServer);

            Task.Factory.StartNew(() =>
            {
                managementServer.Launch((s, isSuccess) =>
                {
                    if (isSuccess)
                    {
                        ManagementServer = managementServer;
                    }
                });
            });

            m_cctvManager = new CCTVManager(m_dataManager, m_commonDataManager);
            m_alarmManager = new AlarmManager(m_dataManager, m_commonDataManager);

            m_cctvManager.RestartProcess();

            m_timer = new System.Windows.Forms.Timer();
            // 1초 주기
            m_timer.Interval = 1000;
            m_timer.Tick += OnTimer;
            m_timer.Start();

            OnTimer(null, null);

            System.Threading.Thread t = new System.Threading.Thread(new System.Threading.ThreadStart(MessageThread));
            t.Start();
        }

        private void root_StateChanged(object sender, EventArgs e)
        {
        }

        private void root_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            Logger.Instance.Write("[MainWindow] STOP");
            m_timer.Stop();
            m_closeThread = true;
        }

        private void OnTimer(object sender, EventArgs e)
        {
            DateTime dtNow = DateTime.Now;
            DateTime? dtLastChanged = m_dtLastChanged;

            if (dtLastChanged != null)
            {
                TimeSpan span = dtNow - (DateTime)dtLastChanged;

                if (span.TotalMinutes >= 1.0)
                {
                    // 마지막 변경 이후로 1분 이상 지났다면...
                    m_dtLastChanged = null;

                    // svms로부터 받아야 한다.
                    ICollection<CCTV> svmsCCTVs = null;

                    svmsCCTVs = GetCCTVList();

                    if (svmsCCTVs != null)
                    {
                        m_cctvManager.Update(svmsCCTVs);
                    }
                }
            }

            m_alarmManager.CheckAutoClose();
            Logger.Instance.RemoveOldLogs();

            if (dtNow.Hour >= 1)
            {
                if (dtNow.Year != m_dtLastChecked.Year || dtNow.Month != m_dtLastChecked.Month || dtNow.Day != m_dtLastChecked.Day)
                {
                    m_dtLastChecked = dtNow;
                    // 변경된 CCTV List가 있는지 확인한다.
                    //ReloadCCTVList();
                }
            }
        }

        private void MessageThread()
        {
            Message message;

            while (m_closeThread == false)
            {
                if (m_messageQueues.TryDequeue(out message))
                {
                    m_cctvManager.SendEvent(message.EventTime, message.UniqueKey, message.SensorType);
                }

                System.Threading.Thread.Sleep(100);
            }
        }

        public ICollection<CCTV> GetCCTVList()
        {
            ICollection<CCTV> cctvList = m_cameraListView.DicCameras.Values;

            List<CCTV> cctvs = new List<CCTV>();

            if (cctvList != null)
                cctvs.AddRange(cctvList);

            return cctvs;
        }

        private void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            LoginWindow loginWindow = new LoginWindow();
            loginWindow.Owner = this;
            loginWindow.WindowStartupLocation = WindowStartupLocation.CenterOwner;
            if (loginWindow.ShowDialog() == true)
            {
                //UpdateConnectStatus("접속중입니다...");

                var managementServer = new ManagementServer(loginWindow.ServerIP, loginWindow.ServerPort, loginWindow.UserID, loginWindow.Password, false, 3, S1SVMSSDKv2.Model.Etc.SVMSClientType.ivaviewer, S1SVMSSDKv2.Model.Etc.SVMSClientType_v2.MosaicViewer);
                var serverKey = managementServer.Key;

                InitializeSVMSResponse(managementServer);

                Task.Factory.StartNew(() =>
                {
                    managementServer.Launch((s, isSuccess) =>
                    {
                        if (isSuccess)
                        {
                            ManagementServer = managementServer;
                        }
                    });
                });
            }
        }


        private void LogoutButton_Click(object sender, RoutedEventArgs e)
        {
            if (ManagementServer != null)
            {
                ManagementServer.Cleanup(true);
                ManagementServer = null;
            }

            CameraListViewModel.GetInstance().Clear();

            //UpdateConnectStatus("서버와의 연결이 종료되었습니다.");
        }

        private void InitializeSVMSResponse(ManagementServer managementServer)
        {
            //event 핸들러 등록
            #region Connection

            /*-------------------------------------------------------------------------------------
                [로그인 결과]
            -------------------------------------------------------------------------------------*/
            managementServer.LoginCompleted += (serverKey, isSuccess, isAdministrator, originalActionStructure) =>
            {
                if (isSuccess)
                {
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        // 로그인 완료 처리
                        Application.Current.Dispatcher.BeginInvoke((Action)(() =>
                        {
                            if (managementServer == null)
                                return;

                            var message = string.Empty;

                            if (managementServer.IsLogin == false)
                            {
                                var resultCode = (originalActionStructure.SelectSingleNode("//Result") as System.Xml.XmlElement).GetAttribute("code");

                                if (string.Equals(resultCode, "10"))
                                {
                                    message = "로그인 실패 (이미 로그인 상태)";
                                }
                                else if (string.Equals(resultCode, "11"))
                                {
                                    message = "로그인 실패 (잘못된 아이디 또는 비밀번호)";
                                }
                                else if (string.Equals(resultCode, "12"))
                                {
                                    message = "로그인 실패 (접속권한 없음)";
                                }
                                else if (string.Equals(resultCode, "13"))
                                {
                                    message = "로그인 실패 (관리자에 의해 사용이 차단된 아이디 또는 아이피)";
                                }
                                else if (string.Equals(resultCode, "14"))
                                {
                                    message = "로그인 실패 (동시 접속자 수 초과)";
                                }
                                else if (string.Equals(resultCode, "15"))
                                {
                                    message = "로그인 실패 (비밀번호 3회 입력 오류로 차단된 아이디 또는 아이피)";
                                }
                                else if (string.Equals(resultCode, "16"))
                                {
                                    message = "로그인 실패 (할당되지 않은 사용자)";
                                }
                                else if (string.Equals(resultCode, "17"))
                                {
                                    message = "로그인 실패 (장기간 미접속 차단 계정)";
                                }
                                else
                                {
                                    message = "로그인 실패 (로그인 실패)";
                                }

                                return;
                            }
                            else
                            {
                                message = "카메라 정보를 불러오고 있습니다.";
                                //CameraListViewModel.GetInstance().SetManagementServer(managementServer);
                                m_cameraListView = CameraListViewModel.GetInstance();
                                m_cameraListView.SetManagementServer(managementServer, this);
                            }

                            // 로그인 완료
                            //UpdateConnectStatus(message);
                            Logger.Instance.Write("[SVMSEventReceiver] " + message);
                        }));

                    });
                }

                Console.WriteLine("SVMS ManagementServer login completed   server:{0}-admin:{1}-succ:{2}", serverKey, isAdministrator, isSuccess);
            };

            /*-------------------------------------------------------------------------------------
                [서버 연결 해제]
            -------------------------------------------------------------------------------------*/
            managementServer.Disconnected += (serverKey) =>
            {
                managementServer.IsLogin = false;
            };

            /*-------------------------------------------------------------------------------------
                [지능형/장치 이벤트 발생]
            -------------------------------------------------------------------------------------*/
            managementServer.SVMSEventNotified += (managementServerKey, isSuccess, SVMSEventInformation, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    //m_parentManager.Logger.Write(LogTypes.Info, m_serverType, m_nServerSeqNo, "[SVMSEvent (" + SVMSEventInformation.DeviceGUID + ")] type: →" + SVMSEventInformation.AlarmProperty.Type + " " + SVMSEventInformation.DeviceType);
                    int nReciverID = -1;
                    int nData = 0;
                    bool bFire = false;
                    int nType = SVMSEventInformation.AlarmProperty.Type;
                    // 시스템 상태값
                    if (nType >= 1000 && nType <= 1004)
                    {
                        switch (nType)
                        {
                            case 1000: // System on
                                break;
                            case 1001: // System off                                 
                                break;
                            case 1002: // CPU Power over
                                break;
                            case 1003: // system network over
                                break;
                            case 1004: // system memory over
                                break;
                        }

                    }
                    else
                    {
                        //IntPtr ptr = new IntPtr(nType);
                        //IntelligentConfigurationInformation alarm = (IntelligentConfigurationInformation)Marshal.PtrToStructure(ptr, typeof(IntelligentConfigurationInformation));
                        //int nAlarmType = alarm.IntelligentAlgorithmType;

                        // 우리가 처리할 항목 침입 / 배회 / 쓰러짐 / 도난 / 방치 / 가상펜스 / 화재 / 비상벨(DIO)
                        string strEventType = "";
                        Facility.FacilityType sensorType = Facility.FacilityType.NONE;

                        switch (nType)
                        {
                            case 0: // Previous Event clear
                                break;
                            case 2: // Intrusion(침입)
                                strEventType = "침입";
                                sensorType = Facility.FacilityType.Intrusion_S1;
                                break;
                            case 3: // Loitering (배회)
                                strEventType = "배회";
                                sensorType = Facility.FacilityType.Loiter_S1;
                                break;
                            case 4: // Slip( 쓰러짐 )
                                strEventType = "쓰러짐";
                                sensorType = Facility.FacilityType.Collapse_S1;
                                break;
                            case 6: // Steal (도난)
                                strEventType = "도난";
                                sensorType = Facility.FacilityType.Theft_S1;
                                break;
                            case 7: // Abandoned( 방치)
                                strEventType = "방치";
                                sensorType = Facility.FacilityType.Neglect_S1;
                                //break;
                                nReciverID = 2;
                                nData = 1;
                                break;
                            case 8: // Fence (가상펜스)
                                strEventType = "가상펜스";
                                sensorType = Facility.FacilityType.VirtualFence_S1;
                                //break;
                                nReciverID = 5;
                                nData = 1;
                                break;
                            case 100: // Fire (화재)
                                strEventType = "화재";
                                sensorType = Facility.FacilityType.Fire_S1;
                                break;
                                /*if (m_dbMgr.SiteID == 102)
                                {
                                    nReciverID = 2;
                                }
                                else
                                    nReciverID = 5;*/
                                bFire = true;
                                nData = 1;
                                break;
                            case 200: // DIO (카메라 DIO 비상벨)
                                break;
                            default:
                                break;
                        }
                        m_nLastIntelligentEvent = nType;

                        DateTime eventTime = DateTime.FromBinary(SVMSEventInformation.AlarmProperty.Time);
                        string strEventMessage = string.Format("[{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}] ({6}) {7}",
                            eventTime.Year,
                            eventTime.Month,
                            eventTime.Day,
                            eventTime.Hour,
                            eventTime.Minute,
                            eventTime.Second,
                            strEventType,
                            SVMSEventInformation.DeviceName
                            );

                        if (sensorType == Facility.FacilityType.Collapse_S1 ||
                            sensorType == Facility.FacilityType.VirtualFence_S1 ||
                            sensorType == Facility.FacilityType.Intrusion_S1 ||
                            sensorType == Facility.FacilityType.Loiter_S1 ||
                            sensorType == Facility.FacilityType.Theft_S1 ||
                            sensorType == Facility.FacilityType.Neglect_S1 ||
                            sensorType == Facility.FacilityType.Fire_S1)
                            OnMessage(eventTime, SVMSEventInformation.DeviceGUID, sensorType, strEventMessage);
                    }

                    Logger.Instance.Write("[SVMSEvent (" + SVMSEventInformation.DeviceGUID + ")] type: →" + SVMSEventInformation.AlarmProperty.Type + " " + SVMSEventInformation.DeviceType);
                }
            };

            /*-------------------------------------------------------------------------------------
                [이벤트 상황조치]
            -------------------------------------------------------------------------------------*/
            managementServer.TakeSVMSEventMeasureNotified += (managementServerKey, isSuccess, SVMSEventMeasureInformation, originalActionStructure) =>
            {
                if (isSuccess == true)
                {

                }
            };

            /*-------------------------------------------------------------------------------------
                [클라이언트 타입 등록 완료]
            -------------------------------------------------------------------------------------*/
            managementServer.ClientTypeCompleted += (key, isSuccess, clientGUID, originalActionStructure) =>
            {
                if (isSuccess)
                {
                    Console.WriteLine("ClientGuid : {0}", clientGUID);

                    if (originalActionStructure.SelectSingleNode("//licensechannelnumber") != null)
                        managementServer.MaxActiveCamera = int.Parse(originalActionStructure.SelectSingleNode("//licensechannelnumber").InnerText);

                    if (originalActionStructure.SelectSingleNode("//encver") != null)
                        managementServer.EncVer = int.Parse(originalActionStructure.SelectSingleNode("//encver").InnerText);
                }
            };

            /*-------------------------------------------------------------------------------------
                [카메라 영상정보 요청하기 위해서는 아래 코드 꼭 삽입 요망]
            -------------------------------------------------------------------------------------*/
            managementServer.DeviceSequenceCameraListCompleted += (string arg1, bool arg2, bool arg3, List<S1SVMSSDKv2.Model.Device.DeviceSequenceCamera> arg4, System.Xml.XmlNode arg5) =>
            {

            };

            #endregion //Connection
        }

        public void UpdateConnectStatus(string message)
        {
            Dispatcher.Invoke(() =>
            {
                ConnectStatus.Text = message;
            });
        }

        public void OnMessage(DateTime eventTime, string uniqueKey, Facility.FacilityType sensorType, string strMessage)
        {
            //throw new NotImplementedException();
            if (sensorType != Facility.FacilityType.NONE)
            {
                m_messageQueues.Enqueue(new Message(eventTime, uniqueKey, sensorType, strMessage));
            }
        }

        public void OnModifiedCamera(CCTV cctv)
        {
            //throw new NotImplementedException();
            m_dtLastChanged = DateTime.Now;
            Logger.Instance.Write("OnModifiedCamera : " + cctv.CameraName);
        }

        public void OnAddCCTV(CCTV cctv)
        {
            //throw new NotImplementedException();
            m_dtLastChanged = DateTime.Now;
            Logger.Instance.Write("OnAddCCTV : " + cctv.CameraName);
        }
    }
}
