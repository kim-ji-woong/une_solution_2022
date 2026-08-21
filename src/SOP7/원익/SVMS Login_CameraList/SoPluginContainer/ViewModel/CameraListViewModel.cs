using System;
using System.Windows;
using System.Collections.Concurrent;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using S1SVMSSDKv2.Info;
using S1SVMSSDKv2.Model.Device;
using SDMS.Model.CCTV;
using dnsData.Sensor;

namespace SoPluginContainer.ViewModel
{
    public class CameraListViewModel : SingletonViewModelBase<CameraListViewModel>
    {
        // Key : Camera GUID
        private Dictionary<string, CCTV> m_dicCameras = new Dictionary<string, CCTV>();
        public Dictionary<string, CCTV> DicCameras
        {
            get { return m_dicCameras; }
        }
        // Key : Camera GUID
        // Value : Camera에 할당된 Profile별 URL들
        private Dictionary<string, List<string>> m_dicCameraURLs = new Dictionary<string, List<string>>();

        static object lockObj = new object();
        private string ServerKey = string.Empty;
        private const String BaseViewModelKey = "CameraListViewModelKey";

        private static volatile CameraListViewModel instance;
        public static CameraListViewModel Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (lockObj)
                    {
                        if (instance == null)
                        {
                            instance = new CameraListViewModel(BaseViewModelKey);
                            instance.VMKey = BaseViewModelKey;
                        }
                    }
                }

                return instance;
            }
        }

        private ObservableCollection<DeviceGroup> deviceGroupList = new ObservableCollection<DeviceGroup>();
        public ObservableCollection<DeviceGroup> DeviceGroupList
        {
            get
            {
                return deviceGroupList;
            }
            set
            {
                deviceGroupList = value;
                OnPropertyChanged("DeviceGroupList");
            }
        }

        private ObservableCollection<DeviceCamera> deviceCameraList = new ObservableCollection<DeviceCamera>();
        public ObservableCollection<DeviceCamera> DeviceCameraList
        {
            get
            {
                return deviceCameraList;
            }
            set
            {
                deviceCameraList = value;
                OnPropertyChanged("DeviceCameraList");
            }
        }

        private InItEnum isInitCameraInfo = new InItEnum();


        private CameraListViewModel(String vmKey)
        {
            this.VMKey = vmKey;
        }

        public static CameraListViewModel GetInstance()
        {
            return GetInstance(BaseViewModelKey);
        }

        public void SetManagementServer(ManagementServer managementServer, ISVMSEventOwner owner = null)
        {
            if (managementServer == null)
                return;

            //managementServer.RequestDeviceGroupList();
            managementServer.RequestDeviceCameraList();

            InitializeDeviceListResponse(managementServer, owner);
        }

        public void Clear()
        {
            deviceGroupList.Clear();
            deviceCameraList.Clear();

            isInitCameraInfo = InItEnum.None;
        }

        private void InitializeDeviceListResponse(ManagementServer managementServer, ISVMSEventOwner owner)
        {
            managementServer.DeviceGroupListCompleted += (serverKey, isSuccess, isFinished, deviceGroups, originalActionStructuer) =>
            {
                if (isSuccess == true)
                {
                    //Application.Current.Dispatcher.Invoke(() =>
                    //{
                    //    if (isFinished != true)
                    //    {
                    //        foreach (var deviceGroupItem in deviceGroups)
                    //        {
                    //            if (!String.IsNullOrEmpty(deviceGroupItem.GroupGUID))
                    //            {
                    //                DeviceGroupList.Add(deviceGroupItem);
                    //            }
                    //        }
                    //    }
                    //    else
                    //    {
                    //        isInitCameraInfo |= InItEnum.CameraGroupComplete;
                    //        managementServer.RequestDeviceCameraList();         
                    //    }
                    //});
                }
            };

            managementServer.AddDeviceGroupNotified += (serverKey, isSuccess, addDeviceGroup, originalActionStructure) =>
            {
                if (isSuccess == true)
                {

                }
            };

            managementServer.ModifyDeviceGroupNotified += (serverKey, isSuccess, modifyDeviceGroup, originalActionStructure) =>
            {
                if (isSuccess == true)
                {

                }
            };

            managementServer.RemoveDeviceGroupNotified += (serverKey, isSuccess, removeDeviceGroup, originalActionStructure) =>
            {
                if (isSuccess == true)
                {

                }
            };

            managementServer.TransferDeviceGroupToDeviceGroupNotified += (serverKey, isSuccess, deviceGUID, fromParentDn, toParentDn, originalActionStructure) =>
            {
                if (isSuccess == true)
                {

                }
            };

            managementServer.DeviceCameraListCompleted += (serverKey, isSuccess, isFinished, deviceCameras, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    Logger.Instance.Write("[DeviceCameraListCompleted] Call");

                    //Application.Current.Dispatcher.Invoke(() =>
                    //{
                    //    if (isFinished != true)
                    //    {
                    //        foreach (DeviceCamera deviceCameraItem in deviceCameras)
                    //        {
                    //            string deviceCameraGUID = deviceCameraItem.CameraGUID;
                    //            if (!String.IsNullOrEmpty(deviceCameraGUID))
                    //            {
                    //                try
                    //                {
                    //                    DeviceCameraList.Add(deviceCameraItem);
                    //                }
                    //                catch (Exception ex)
                    //                {
                    //                }
                    //            }
                    //        }
                    //    }
                    //    else
                    //    {
                    //        isInitCameraInfo |= InItEnum.CameraListComplete;
                    //    }
                    //});

                    if (isFinished != true)
                    {
                        foreach (var deviceCameraItem in deviceCameras)
                        {
                            try
                            {
                                string deviceCameraGUID = deviceCameraItem.CameraGUID;
                                string cameraIP = deviceCameraItem.CameraIPAddress;
                                if (cameraIP != "")
                                {
                                    cameraIP = deviceCameraItem.CameraRTSPURL;
                                }

                                System.Diagnostics.Trace.WriteLine("GUID: " + deviceCameraGUID);
                                System.Diagnostics.Trace.WriteLine("Camera: " + cameraIP);

                                string strCameraName = deviceCameraItem.CameraName;
                                string strURL = deviceCameraItem.ConnectURL;
                                int nPort = deviceCameraItem.CameraRTSPPort;
                                string strID = deviceCameraItem.ID;
                                string strPW = deviceCameraItem.Password;

                                string strIP = deviceCameraItem.CameraIPAddress;
                                string strCameraCompanyName = deviceCameraItem.CameraManufactureCompany;
                                string strCameraModelName = deviceCameraItem.CameraModelName;

                                if (deviceCameraGUID != null)
                                {
                                    CCTV cctv = new CCTV();
                                    cctv.UserID = strID;
                                    cctv.Password = strPW;
                                    cctv.CameraName = strCameraName;
                                    cctv.URL = strURL + "?a=0";
                                    cctv.UniqueKey = deviceCameraGUID;
                                    cctv.Enabled = deviceCameraItem.IsActive && deviceCameraItem.IsAlive;
                                    cctv.CameraIP = strIP;
                                    cctv.CameraCompanyName = strCameraCompanyName;
                                    cctv.CameraModelName = strCameraModelName;

                                    Logger.Instance.Write("SVMSEventCameraList, CCTV[" + cctv.CameraName + "], " + cctv.UniqueKey + ", Enabled : " + cctv.Enabled);

                                    // Multi Profile Check
                                    // 일부러 낮은 해상도의 Profile이 있나 물어본다.
                                    //managementServer.RequestGetDeviceCameraLiveStreamInformation(cctv.UniqueKey, 100, 100);

                                    m_dicCameras[deviceCameraGUID] = cctv;

                                    if (owner != null)
                                        owner.OnAddCCTV(cctv);

                                    List<string> urls = null;

                                    if (m_dicCameraURLs.TryGetValue(deviceCameraGUID, out urls) == false)
                                    {
                                        urls = new List<string>();
                                        m_dicCameraURLs[deviceCameraGUID] = urls;
                                    }

                                    if (urls.Contains(cctv.URL) == false)
                                        urls.Add(cctv.URL);
                                }

                                if (string.IsNullOrEmpty(deviceCameraGUID) == false)
                                {
                                    //managementServer.GetIntelligentConfigurationInformation(deviceCameraGUID);
                                }

                                Console.WriteLine("[DeviceCamera] " + deviceCameraItem.CameraGUID);
                            }
                            catch (Exception ex)
                            {
                            }
                        }

                        if (owner != null)
                            owner.OnMessage(DateTime.Now, null, Facility.FacilityType.NONE, string.Format("CCTV 총 {0}개 읽어오기 완료", m_dicCameras.Count));
                    }
                    else
                    {
                        Console.WriteLine("[------------] " + "list up completed.");
                    }
                }
            };

            managementServer.AddDeviceCameraNotified += (serverKey, isSuccess, addDeviceCamera, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    managementServer.RequestDeviceCameraList();
                    Logger.Instance.Write("[DeviceCamera] " + addDeviceCamera.CameraGUID + " added.");
                }
            };

            managementServer.ModifyDeviceCameraNotified += (serverKey, isSuccess, modifyDeviceCamera, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    CCTV cctv;

                    if (m_dicCameras.TryGetValue(modifyDeviceCamera.CameraGUID, out cctv))
                    {
                        bool isChanged = false;

                        if (modifyDeviceCamera.ID != cctv.UserID)
                        {
                            cctv.UserID = modifyDeviceCamera.ID;
                            isChanged = true;
                        }

                        if (modifyDeviceCamera.Password != cctv.Password)
                        {
                            cctv.Password = modifyDeviceCamera.Password;
                            isChanged = true;
                        }

                        if (modifyDeviceCamera.CameraName != cctv.CameraName)
                        {
                            cctv.CameraName = modifyDeviceCamera.CameraName;
                            isChanged = true;
                        }

                        string strURL = modifyDeviceCamera.ConnectURL + "?a=0";

                        if (strURL != cctv.URL)
                        {
                            cctv.URL = strURL;
                            isChanged = true;
                        }

                        bool isEnabled = modifyDeviceCamera.IsActive && modifyDeviceCamera.IsAlive;

                        if (isEnabled != cctv.Enabled)
                        {
                            Logger.Instance.Write("OnModifiedCamera, CCTV[" + cctv.ID + "], " + cctv.UniqueKey + ", Enabled : " + isEnabled);
                            cctv.Enabled = isEnabled;
                            isChanged = true;
                        }

                        if (modifyDeviceCamera.CameraIPAddress != cctv.CameraIP)
                        {
                            cctv.CameraIP = modifyDeviceCamera.CameraIPAddress;
                            isChanged = true;
                        }

                        if (modifyDeviceCamera.CameraManufactureCompany != cctv.CameraCompanyName)
                        {
                            cctv.CameraCompanyName = modifyDeviceCamera.CameraManufactureCompany;
                            isChanged = true;
                        }

                        if (modifyDeviceCamera.CameraModelName != cctv.CameraModelName)
                        {
                            cctv.CameraModelName = modifyDeviceCamera.CameraModelName;
                            isChanged = true;
                        }

                        if (owner != null && isChanged)
                            owner.OnModifiedCamera(cctv);
                    }

                    Console.WriteLine("[DeviceCamera] " + modifyDeviceCamera.CameraGUID + " modified.");
                    Logger.Instance.Write("[DeviceCamera] " + modifyDeviceCamera.CameraGUID + " modified.");
                }
            };

            managementServer.RemoveDeviceCameraNotified += (serverKey, isSuccess, removeDeviceCamera, originalActionStructure) =>
            {
                if (isSuccess == true)
                {
                    managementServer.RequestDeviceCameraList();
                    Logger.Instance.Write("[DeviceCamera] " + removeDeviceCamera.CameraGUID + " removed.");
                }
            };

            managementServer.ModifyDeviceCameraNumberNotified += (ms, isSuccess, deviceCameraItem, node) =>
            {

            };

        }

        private enum InItEnum
        {
            None = 0,
            CameraGroupComplete = 1,
            CameraListComplete = 2,
            SequenceCameraListComplete = 4
        }

        public ICollection<CCTV> GetCCTVList()
        {
            return m_dicCameras.Values;
        }
    }
}
