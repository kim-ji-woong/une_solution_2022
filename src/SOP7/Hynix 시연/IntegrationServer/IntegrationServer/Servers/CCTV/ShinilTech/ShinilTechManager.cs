using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsSopID;
using IntegrationServer.Datas;
using IntegrationServer.Managers;
using Nipa.Model.Sdms.CCTV;
using SicCsharp.API;
using SicCsharp.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static AgentFactory.BLL.ServerType;
using static dnsData.Sensor.Facility;

namespace IntegrationServer.Servers.CCTV.ShinilTech
{
    public class ShinilTechManager : SicSdkEvt, IServer
    {
        #region IServer 인터페이스                        
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }
        public void Start()
        {            
            Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"Start Version : {m_sicSdkObj.SicSdkVerGet()}");
            // 카메라 추가
            if (DevAdd())
            {
                DevConnect();

                Thread t = new Thread(new ThreadStart(ConnectionThread));
                t.Start();
            }
        }
        public void Stop()
        {
            Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "Stop");

            m_runThread = false;
            DevDisConnect();
        }
        private ServerManager m_serverManager = null;
        public ServerManager GetServerManager()
        {
            return m_serverManager;
        }
        public ServerTypes ServerType { get { return ServerTypes.CCTV_ShinilTech; } }
        public bool IsConnected { get; }
        public Logger Logger { get; set; }
        private string m_strServerAlias = "";
        public string ServerAlias { get { return m_strServerAlias; } }
        #endregion

        private SicSdkEvt m_sicSdkEvt;
        private SicSdk m_sicSdkObj;

        /// <summary>
        /// key: dev index
        /// </summary>
        private Dictionary<uint, CameraInfo> m_dicDevs = null;

        private DataManager m_dataManager = null;
        private int m_nSiteID = -1;
        private SopQueryManager m_sopQueryManager = null;

        // 현재 DB에 저장된 상태값
        private bool m_bDBConnectState = false;
        private bool m_runThread = false;

        private List<int> m_cctvIDs = new List<int>();

        public ShinilTechManager(ServerManager serverManager, DataManager dataManager, string strSOPWebServerURL, int nSiteID, int nServerSeqNo, string strServerAlias)
        {
            m_serverManager = serverManager;
            m_dataManager = (DataManager)dataManager.Clone();
            m_sopQueryManager = new SopQueryManager(strSOPWebServerURL);

            m_sicSdkEvt = this;
            m_sicSdkObj = new SicSdk(m_sicSdkEvt);

            m_nSiteID = nSiteID;
            m_nServerSeqNo = nServerSeqNo;

            m_strServerAlias = strServerAlias;

            //insert into SdmsCCTV(ID, CameraName, UniqueKey, IsIndoor, Type, URL) Values(2000, '40', 40, 1, 'Shinil', '')
            //insert into SdmsSensorZone(ID, SensorType, OrgSensorID, EquipZoneID, IsAlarmStatus) Values(2000, 6000, 2000, 136, 0)
            //insert into SdmsSensorTagInfo(ID, SensorServerID, TagNo, SensorZoneID, Activate, Description) values(2000, 4, 6000, 2000, 1, '온도')
        }

        private void LoadLimitValue()
        {
            string strConditions = $"CctvID in ({string.Join(",", m_cctvIDs)})";
            IEnumerable< CctvData> limits = m_dataManager.GetSelect().Select<CctvData>(strConditions, out string strError);
            if (limits == null)
            {
                Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"LoadLimitValue : CCTVData table 조회 오류 {strError}");
                return;
            }

            foreach (var item in limits)
            {
                foreach (KeyValuePair<uint, CameraInfo> dev in m_dicDevs)
                {
                    if (dev.Value.CctvID == item.CctvID)
                    {
                        dev.Value.LimitValue1 = item.LimitValue1;
                        dev.Value.LimitValue2 = item.LimitValue2;
                        dev.Value.LimitValue3 = item.LimitValue3;
                        dev.Value.LimitValue4 = item.LimitValue4;

                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"LoadLimitValue : item.CctvID => {item.CctvID}, value1 :{dev.Value.LimitValue1}, value1 :{dev.Value.LimitValue2}, value1 :{dev.Value.LimitValue3}, value1 :{dev.Value.LimitValue4}");
                        break;
                    }
                }
            }
        }

        private bool DevAdd()
        {
            try
            {
                Dictionary<int, SensorTag> sensorTags = SensorManager.Instance.FindSensors(m_nServerSeqNo);
                if (sensorTags == null || sensorTags.Count == 0)
                {
                    if (sensorTags == null)
                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "DevAdd : sensorTagInfo is null");
                    else
                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "DevAdd : sensorTagInfo count = " + sensorTags.Count);
                    return false;
                }

                // 최초 한번 실행
                m_sicSdkObj.SicSdkInit(Convert.ToUInt32(sensorTags.Count));
                Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "DevAdd : SicSdkInit success");

                m_cctvIDs.Clear();
                Dictionary<int, CameraInfo> logins = new Dictionary<int, CameraInfo>();

                foreach (KeyValuePair<int, SensorTag> pair in sensorTags)
                {
                    CCTVSensor cctv = (CCTVSensor)pair.Value;
                    if (cctv == null)
                        continue;

                    logins.Add(cctv.OrgSensorID, new CameraInfo()
                    {
                        LoginData = new SicSdkLoginPara()
                        {
                            Id = cctv.LoginID,
                            Pw = cctv.LoginPw,
                            IpV4 = cctv.CameraIP,
                            Port = Convert.ToUInt16(cctv.Port)
                        },
                        CctvID = cctv.OrgSensorID,
                        SensorZoneID = cctv.SensorZoneID,
                        IP = cctv.CameraIP,
                        Port = cctv.Port,
                        LoginID = cctv.LoginID,
                        LoginPw = cctv.LoginPw,
                        HighTemp = 0
                    });

                    m_cctvIDs.Add(cctv.OrgSensorID);
                }

                m_dicDevs = new Dictionary<uint, CameraInfo>();

                uint devIdx = 0;
                foreach (KeyValuePair<int, CameraInfo> pair in logins)
                {
                    CameraInfo info = pair.Value;
                    if (info.LoginData != null && info.LoginData.Id.Length > 0 && info.LoginData.IpV4.Length > 0 && info.LoginData.Port.ToString().Length > 0 && info.LoginData.Pw.Length > 0)
                    {
                        SicErrorCode result = m_sicSdkObj.SicSdkDevUpdate(info.LoginData, devIdx);
                        if (result == SicErrorCode.E_SicSdkErrNone)
                        {
                            info.Status = SicDeviceStatus.E_SicSdkStatNone;
                            m_dicDevs[devIdx] = info;
                        }

                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"DevAdd : DevUpdate index => [{devIdx}], IpV4 => {info.LoginData.IpV4}, result => {result}");
                    }
                    else
                    {
                        string IpV4 = info.LoginData?.IpV4?.Length > 0 ? info.LoginData.IpV4 : "null";
                        m_dicDevs[devIdx] = info;
                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"DevAdd : DevUpdate index => [{devIdx}], IpV4 => {IpV4}");
                    }

                    devIdx++;
                }

                LoadLimitValue();

                return true;
            }
            catch (Exception e)
            {
                Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "DevAdd : " + e.Message);
                return false;
            }
        }

        private void DevConnect()
        {
            try
            {
                foreach (KeyValuePair<uint, CameraInfo> pair in m_dicDevs)
                {
                    uint devIndex = pair.Key;
                    SicErrorCode result = m_sicSdkObj.SicSdkDevConnect(devIndex);
                    if (result == SicErrorCode.E_SicSdkErrNone)
                    {
                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"DevConnect : success cctv IP => [{pair.Value.IP}]");
                        // success
                        SicDeviceStatus stat = m_sicSdkObj.SicSdkDevStatGet(devIndex);
                        pair.Value.Status = stat;
                    }
                    else
                    {
                        Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"DevConnect : fail cctv IP => [{pair.Value.IP}], result => {result}");
                        // fail
                        pair.Value.Status = SicDeviceStatus.E_SicSdkStatNone;
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "DevConnect : " + e.Message);
            }
        }

        private SicErrorCode DevConnect(uint devIndex)
        {            
            SicErrorCode result = m_sicSdkObj.SicSdkDevConnect(devIndex);
            return result;
        }

        private void DevDisConnect()
        {
            try
            {
                if (m_dicDevs == null)
                    return;

                foreach (KeyValuePair<uint, CameraInfo> pair in m_dicDevs)
                {
                    uint devIndex = pair.Key;
                    SicErrorCode result = m_sicSdkObj.SicSdkDevDisconnect(devIndex);
                    if (result == SicErrorCode.E_SicSdkErrNone)
                    {
                        // success                    
                        pair.Value.Status = SicDeviceStatus.E_SicSdkStatNone;
                    }
                    else
                    {
                        // fail
                        pair.Value.Status = SicDeviceStatus.E_SicSdkStatNone;
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "DevDisConnect : " + e.Message);
            }
        }

        public SicDeviceStatus GetStatus(uint devIndex)
        {
            SicDeviceStatus stat = m_sicSdkObj.SicSdkDevStatGet(devIndex);
            return stat;

            //if (pair.Value.Status != stat)
            //{
            //    string strStatus = string.Empty;
            //    switch (stat)
            //    {
            //        case SicDeviceStatus.E_SicSdkStatNone: strStatus = "접속 되어 있지 않음"; break;
            //        case SicDeviceStatus.E_SicSdkStatConnect: strStatus = "접속은 되어있으나 로그인 되지 않음"; break;
            //        case SicDeviceStatus.E_SicSdkStatLogon: strStatus = "로그인 됨"; break;
            //        case SicDeviceStatus.E_SicSdkStatWaitClose: strStatus = "종료 대기 중"; break;
            //        case SicDeviceStatus.E_SicSdkStatReady: strStatus = "정상 동작 중"; break;
            //    }
            //    Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, pair.Value.IP + " 연결 상태 : " + strStatus);
            //}
        }

        public void GetHighTemp()
        {
            try
            {
                foreach (KeyValuePair<uint, CameraInfo> pair in m_dicDevs)
                {
                    if (!m_runThread)
                        return;

                    uint devIndex = pair.Key;
                    CameraInfo info = pair.Value;                    
                    if (info.Status == SicDeviceStatus.E_SicSdkStatConnect)
                    {
                        m_sicSdkObj.SicSdkDevUpdate(info.LoginData, devIndex);
                        info.Status = GetStatus(devIndex);
                    }

                    if (info.Status != SicDeviceStatus.E_SicSdkStatReady)
                    {
                        if (info.Status == SicDeviceStatus.E_SicSdkStatConnect || (int)info.Status == 4)
                        {
                            // 접속 끊김시 SicSdkDisconnect 후 SicSdkConnect
                            m_sicSdkObj.SicSdkDevDisconnect(devIndex);
                            SicErrorCode errCode = DevConnect(devIndex);
                            if (errCode == SicErrorCode.E_SicSdkErrNone)
                            {
                                SicDeviceStatus chgStatus = GetStatus(devIndex);
                                Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"2. IP : {info.IP}, chg Status => {info.Status} > {chgStatus}");
                                info.Status = chgStatus;
                                
                            }
                        }

                        if (info.Status != SicDeviceStatus.E_SicSdkStatReady) // 접속안됨
                        {
                            Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"Connect fail - IP : {info.IP}, Status => {info.Status}");
                            continue;
                        }
                    }

                    SicTempPos tempHigh;
                    SicTempPos tempLow;
                    uint tempAverage;

                    SicErrorCode result = m_sicSdkObj.SicSdkTempGet(devIndex, out tempLow, out tempHigh, out tempAverage);
                    if (result == SicErrorCode.E_SicSdkErrNone)
                    {
                        // success
                        System.Diagnostics.Trace.WriteLine($"TempHigh		: [{(tempHigh.Temp - 2731) / 10}]");
                        //System.Diagnostics.Trace.WriteLine($"TempHighX	: [{tempHigh.X}]");
                        //System.Diagnostics.Trace.WriteLine($"TempHighY	: [{tempHigh.Y}]");
                        //System.Diagnostics.Trace.WriteLine($"TempLow		: [{(tempLow.Temp - 2731) / 10}]");
                        //System.Diagnostics.Trace.WriteLine($"TempLowX		: [{tempLow.X}]");
                        //System.Diagnostics.Trace.WriteLine($"TempLowY		: [{tempLow.Y}]");
                        //System.Diagnostics.Trace.WriteLine($"TempAverage	: [{(tempAverage - 2731) / 10}]");

                        int highTemp = (tempHigh.Temp - 2731) / 10;

                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"GetHighTemp() IP : {info.IP}, HighTemp : {highTemp}");

                        // 임계치 높으면 알람                    
                        int nAlarmDepth = -1;
                        if (highTemp > info.LimitValue4)
                            nAlarmDepth = 4;
                        else if (highTemp > info.LimitValue3)
                            nAlarmDepth = 3;
                        else if (highTemp > info.LimitValue2)
                            nAlarmDepth = 2;
                        else if (highTemp > info.LimitValue1)
                            nAlarmDepth = 1;

                        if (nAlarmDepth > 0)
                        {
                            // 알람 내역이 없으면 알람 추가
                            if (!AlarmManager.Instance.DicCurrentAlarm.TryGetValue(info.SensorZoneID, out AlarmInfo alarm))
                            {
                                SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, info.CctvID);
                                SendSensorData(sensorTag, FacilityType.SicTemp, true, nAlarmDepth);

                                Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"add alarm : {info.IP}, HighTemp : {highTemp}");
                            }
                            else
                            {
                                // 알람 단계 변경
                                if (alarm.AlarmDepth != nAlarmDepth)
                                {
                                    SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, info.CctvID);
                                    SendSensorData(sensorTag, FacilityType.SicTemp, true, nAlarmDepth);

                                    Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"chg alarm : {info.IP}, HighTemp : {highTemp}");
                                }
                            }
                        }
                        else
                        {
                            if (AlarmManager.Instance.DicCurrentAlarm.TryGetValue(info.SensorZoneID, out AlarmInfo alarm))
                            {
                                SensorTag sensorTag = SensorManager.Instance.FindSensorByOrgSensorID(m_nServerSeqNo, info.CctvID);
                                SendSensorData(sensorTag, FacilityType.SicTemp, false, 0);

                                Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"clear alarm : {info.IP}, HighTemp : {highTemp}");
                            }
                        }

                        info.HighTemp = highTemp;
                    }
                    else
                    {
                        // fail
                        info.HighTemp = 0;
                        Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, $"GetHighTemp() SicSdkTempGet err, IP : {info.IP}, Status => {result}");
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, $"GetHighTemp() : {e.Message}");
            }
        }

        private void ConnectionThread()
        {
            m_runThread = true;
            byte[] pingBytes = new byte[] { 0x00 };

            while (m_runThread)
            {
                try
                {
                    // 각 카메라별로 접속하는건데 ServerInfo 테이블에 업데이트를 어떻게 해야하나 ?
                    //if (m_bDBConnectState == false)
                    //{   // 연결 상태 업데이트   
                    //    if (m_serverManager.UpdateConnectState(m_nServerSeqNo, ServerType, true))
                    //        m_bDBConnectState = true;
                    //}

                    //GetStatus();
                    GetHighTemp();

                    Thread.Sleep(1000);
                }
                catch (Exception e)
                {
                    Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "ConnectionThread() : " + e.Message);
                }
            }
        }

        /// <summary>
        /// 영역 설정하고 싶을 때 사용하기
        /// </summary>
        private void SetRoi()
        {
            // ROI 개수 = 21개로 고정, ROI index = 0 부터 20
            uint roiIndex = 0;
            foreach (KeyValuePair<uint, CameraInfo> pair in m_dicDevs)
            {
                SicTempRoiCfg roiCfg = new SicTempRoiCfg();

                uint devIndex = pair.Key;
                roiCfg.RoiType = SicRoiType.Rect;
                roiCfg.ChkType = SicCheckType.High;
                roiCfg.TempWarn = 50;
                roiCfg.TempCaus = 70;
                roiCfg.TempDang = 100;
                // 열화상 해상도가 160,120일경우 left=0, top=0, right = 160, bottom = 120 으로 설정
                roiCfg.RectLeft = 0;
                roiCfg.RectRight = 100;
                roiCfg.RectTop = 100;
                roiCfg.RectBottom = 100;

                SicErrorCode result = m_sicSdkObj.SicSdkRoiSet(devIndex, roiIndex, true, roiCfg);
                if (result == SicErrorCode.E_SicSdkErrNone)
                {
                    // success
                    // SicSdkRoiSet은 설정 값을 SDK에 설정하는 것이고 실질적으로 카메라에 적용하려면 SicSdkRoiCfgUpload 함수를 호출해야한다
                    m_sicSdkObj.SicSdkRoiCfgUpload(devIndex);
                }
                else
                {
                    // fail
                }
            }
        }

        public bool SendSensorData(SensorTag sensorTag, FacilityType facilityType, bool bIsAlarm, int nAlarmLevel)
        {
            return m_serverManager.SendSensorData(m_sopQueryManager, (int)facilityType, sensorTag.ID, sensorTag.SensorZoneID, bIsAlarm, nAlarmLevel);
        }

        #region override
        public override void SicSdkEvtConnected(uint devIdx)
        {
            base.SicSdkEvtConnected(devIdx);
        }

        public override void SicSdkEvtConnectFail(uint devIdx)
        {
            base.SicSdkEvtConnectFail(devIdx);
        }

        public override void SicSdkEvtClosed(uint devIdx)
        {
            base.SicSdkEvtClosed(devIdx);
        }

        public override void SicSdkEvtEventInfoRecv(uint devIdx, SicDvrEvt evtId, object data, uint dataSize)
        {
            base.SicSdkEvtEventInfoRecv(devIdx, evtId, data, dataSize);
        }

        public override void SicSdkEvtLogon(uint devIdx)
        {
            base.SicSdkEvtLogon(devIdx);
        }

        public override void SicSdkEvtStrmRecv(uint devIdx, byte ch, SicFrameType type, SicCodecType codec, uint timeSec, uint timeMili, uint resX, uint resY, uint strmSize, byte[] strm)
        {
            base.SicSdkEvtStrmRecv(devIdx, ch, type, codec, timeSec, timeMili, resX, resY, strmSize, strm);
        }

        public override void SicSdkEvtTempMap(uint devIdx, uint timeSec, uint timeMili, uint resX, uint resY, byte[] map)
        {
            base.SicSdkEvtTempMap(devIdx, timeSec, timeMili, resX, resY, map);
        } 
        #endregion

        public class CameraInfo
        {
            public int CctvID { get; set; }
            public int SensorZoneID { get; set; }
            public string IP { get; set; }
            public int Port { get; set; }
            public string LoginID { get; set; }
            public string LoginPw { get; set; }
            public SicDeviceStatus Status { get; set; }
            public int HighTemp { get; set; }
            public int? LimitValue1 { get; set; }
            public int? LimitValue2 { get; set; }
            public int? LimitValue3 { get; set; }
            public int? LimitValue4 { get; set; }
            public SicSdkLoginPara LoginData { get; set; }
        }
    }
}
