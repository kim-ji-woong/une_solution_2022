using dnsData.Sensor;
using S1SVMSSDKv2.Info;
using SDMS.DAL;
using SDMS.Model.CCTV;
using SoPluginContainer.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoPluginContainer
{
    public class SVMSEventReceiver
    {
        private ISVMSEventOwner m_owner = null;       

        private string m_strSvmsIP = "";
        private int m_nSvmsPort = 0;
        private string m_strSvmsID = "";
        private string m_strSvmsPW = "";

        private ManagementServer ManagementServer = null;

        private CameraListViewModel m_cameraListView = null;

        private DataManager m_dataManager = null;
        public DataManager DataManager
        {
            get { return m_dataManager; }
            set { m_dataManager = value; }
        }
        private Common.DAL.DataManager m_commonDataManager = null;
        public Common.DAL.DataManager CommonDataManager
        {
            get { return m_commonDataManager; }
            set { m_commonDataManager = value; }
        }

        private int m_nLastIntelligentEvent = 0;

        public SVMSEventReceiver(ISVMSEventOwner owner, string svmsIP, int svmsPort, string svmsID, string svmsPW)
        {
            m_owner = owner;
            m_strSvmsIP = svmsIP;
            m_nSvmsPort = svmsPort;
            m_strSvmsID = svmsID;
            m_strSvmsPW = svmsPW;
        }

        public void Start()
        {
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
                    // 로그인 완료 처리                        
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
                        m_cameraListView = CameraListViewModel.GetInstance();
                        m_cameraListView.SetManagementServer(managementServer, m_owner);
                    }

                    // 로그인 완료
                    Logger.Instance.Write("[SVMSEventReceiver] " + message);
                        
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
                            m_owner.OnMessage(eventTime, SVMSEventInformation.DeviceGUID, sensorType, strEventMessage);
                    }

                    Logger.Instance.Write("[SVMSEventReceiver] (" + SVMSEventInformation.DeviceGUID + ")] type: →" + SVMSEventInformation.AlarmProperty.Type + " " + SVMSEventInformation.DeviceType);
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

        public ICollection<CCTV> GetCCTVList()
        {
            ICollection<CCTV> cctvList = m_cameraListView.DicCameras.Values;

            List<CCTV> cctvs = new List<CCTV>();

            if (cctvList != null)
                cctvs.AddRange(cctvList);

            return cctvs;
        }
    }

    public interface ISVMSEventOwner
    {
        void OnMessage(DateTime eventTime, string uniqueKey, Facility.FacilityType sensorType, string strMessage);
        void OnModifiedCamera(CCTV cctv);
        void OnAddCCTV(CCTV cctv);
    }
}
