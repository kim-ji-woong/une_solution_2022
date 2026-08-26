using dnsData.Sensor;
using dnsSMS;
using SDMS.DAL;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;
using Wonik.Model;
using WonikBeaconServer.Model;
using WonikBeaconServer.SpeedDetection;

namespace WonikBeaconServer
{
    public class ProcessManager
    {
        private SDMS.IDAL.IDataManager m_dataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private Wonik.IDAL.IDataManager m_wonikDataManager = null;

        private WebServiceManager m_webServiceManager = null;
        public WebServiceManager WebServiceManager 
        { 
            get { return m_webServiceManager; } 
        }

        private WorkDBManager m_workDBManager = null;
        public WorkDBManager WorkDBManager
        {
            get { return m_workDBManager; }
        }

        DetectionManager m_detectionManager = null;
        CarNoUpdater m_carNoUpdater = null;

        Thread m_watchWorker = null;
        Thread m_watchAlarm = null;
        Thread m_watchDetection = null;

        private bool m_shutdownThread = false;

        private int m_nThreadSleep = 1000;
        private int m_nErrorSleep = 1000 * 60;

        private bool m_bIsOneCycle = false;

        private static List<SpeedDetectionData> m_todaySpeedDetections = new List<SpeedDetectionData>();
        // 목록 내용 변화 감지용 시그니처(행 수뿐 아니라 CarNo/DiffSeconds 갱신도 반영)
        private static string m_strTodaySignature = null;

        public ProcessManager(SDMS.IDAL.IDataManager dataManager, TeamEditor.IDAL.IDataManager teamDataManager, Wonik.IDAL.IDataManager wonikDataManager)
        {
            m_dataManager = dataManager;
            m_teamDataManager = teamDataManager;
            m_wonikDataManager = wonikDataManager;            

            m_workDBManager = new WorkDBManager(this, dataManager, teamDataManager);
            m_webServiceManager = new WebServiceManager(this);

            m_watchWorker = new Thread(() => WatchWorkerThread());
            m_watchWorker.Start();

            m_watchAlarm = new Thread(() => WatchAlarmThread());
            m_watchAlarm.Start();

            m_watchDetection = new Thread(() => WatchDetectionThread());
            m_watchDetection.Start();

            m_detectionManager = new DetectionManager(dataManager, m_wonikDataManager);
            m_detectionManager.Start();

            // 과속 기록의 CarNo 를 LPR 이벤트로 사후에 채운다. 설정(LPR)이 비어 있으면 스스로 시작하지 않는다.
            m_carNoUpdater = new CarNoUpdater(m_wonikDataManager);
            m_carNoUpdater.Start();
        }

        private void InitConfig()
        {

        }

        private void WatchWorkerThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchWorkerThread 실행");

            while (!m_shutdownThread)
            {
                Dictionary<int, BeaconCount> dicBuildingGroups = new Dictionary<int, BeaconCount>();
                Dictionary<int, BeaconCount> dicBuildings = new Dictionary<int, BeaconCount>();
                Dictionary<int, BeaconCount> dicZones = new Dictionary<int, BeaconCount>();
                Dictionary<int, BeaconCount> dicEquipmentZones = new Dictionary<int, BeaconCount>();

                dicBuildingGroups = m_webServiceManager.RequestCampusCount(out strErrorMessage);
                if (dicBuildingGroups == null)
                {
                    Logger.Instance.Write("1. WatchWorkerThread Error: " + strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                foreach (KeyValuePair<int, BeaconCount> pair in dicBuildingGroups)
                {
                    int nBuildingGroupID = pair.Key;

                    BeaconCount beaconCount = pair.Value;
                    string strBuildingGroupID = beaconCount.ID;

                    Dictionary<int, BeaconCount> dicBuildingIDs = m_webServiceManager.RequestBuildingCount(strBuildingGroupID, out strErrorMessage);
                    if (dicBuildingIDs == null)
                    {
                        Logger.Instance.Write("2. WatchWorkerThread Error: " + strErrorMessage);
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }

                    foreach (KeyValuePair<int, BeaconCount> pair2 in dicBuildingIDs)
                    {
                        int nBuildingID = pair2.Key;
                        BeaconCount beaconCount_Building = pair2.Value;
                        string strBuildingID = beaconCount_Building.ID;

                        dicBuildings[nBuildingID] = beaconCount_Building;

                        Dictionary<int, BeaconCount> dicFloorIDs = m_webServiceManager.RequestFloorCount(strBuildingID, out strErrorMessage);
                        if (dicFloorIDs == null)
                        {
                            Logger.Instance.Write("3. WatchWorkerThread Error: " + strErrorMessage);
                            Thread.Sleep(m_nErrorSleep);
                            continue;
                        }
                        
                        foreach (KeyValuePair<int, BeaconCount> pair3 in dicFloorIDs)
                        {
                            int nZoneID = pair3.Key;
                            BeaconCount beaconCount_Zone = pair3.Value;
                            string strFloorID = beaconCount_Zone.ID;

                            dicZones[nZoneID] = beaconCount_Zone;
                        }
                    }
                }

                // 구역정보 한번만 조회하도록 수정 요청 - 20231227
                Dictionary<int, BeaconCount> dicGeofenceIDs = m_webServiceManager.RequestGeofenceCount(out strErrorMessage);
                if (dicGeofenceIDs == null)
                {
                    Logger.Instance.Write("4. WatchWorkerThread Error: " + strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                foreach (KeyValuePair<int, BeaconCount> pair4 in dicGeofenceIDs)
                {
                    int nEquipmentZoneID = pair4.Key;
                    BeaconCount beaconCount_EquipmentZone = pair4.Value;
                    string strGeofenceID = beaconCount_EquipmentZone.ID;

                    dicEquipmentZones[nEquipmentZoneID] = beaconCount_EquipmentZone;
                }

                if (m_workDBManager.UpdateWorkInfoCount(dicBuildingGroups, dicBuildings, dicZones, dicEquipmentZones, out strErrorMessage) == false)
                {
                    Logger.Instance.Write("7. WatchWorkerThread Error: " + strErrorMessage);
                    Thread.Sleep(m_nErrorSleep);
                    continue;
                }

                if (m_bIsOneCycle == false)
                    m_bIsOneCycle = true;

                // 5초 간격으로 수정 요청 - 20231227
                //Thread.Sleep(m_nThreadSleep);
                Thread.Sleep(m_nThreadSleep * 3);
            }
        }

        private void WatchAlarmThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchAlarmThread 실행");

            int i = 0;

            while (!m_shutdownThread)
            {
                if (m_bIsOneCycle)
                {
                    i++;

                    List<AlarmData> alarmDatas = m_webServiceManager.RequestAlertHeads(out strErrorMessage);
                    if (alarmDatas == null)
                    {
                        Logger.Instance.Write("1. WatchAlarmThread Error: " + strErrorMessage);
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }


                    if (m_workDBManager.CheckAlarm(alarmDatas, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write("2. WatchAlarmThread Error: " + strErrorMessage);
                        Thread.Sleep(m_nErrorSleep);
                        continue;
                    }

                    Thread.Sleep(m_nThreadSleep);
                }
                else
                {
                    Thread.Sleep(m_nErrorSleep);
                }
            }
        }

        public ResponseEquipZoneMembers GetEquipZoneMembers(int? nEquipZoneID)
        {
            string strErrorMessage;
            ResponseEquipZoneMembers response = new ResponseEquipZoneMembers();

            List<AlarmData> personDatas = new List<AlarmData>();

            int? nGeofenceFcNum = m_webServiceManager.FindGeofenceFcNum(nEquipZoneID);

            if (nGeofenceFcNum.HasValue)
            {
                List<PersonData> datas = m_webServiceManager.RequestEntranceGeofenceCount(nGeofenceFcNum.Value, out strErrorMessage);
                if (datas == null)
                {
                    response.Success = false;
                    response.Message = "1. GetEquipZoneMembers Error : " + strErrorMessage;
                    return response;
                }

                List<AlarmData> alarmDatas = m_webServiceManager.RequestAlertHeads(out strErrorMessage);
                if (alarmDatas == null)
                {
                    response.Success = false;
                    response.Message = "2. GetEquipZoneMembers Error : " + strErrorMessage;
                    return response;
                }

                if (datas.Count > 0)
                {
                    foreach (PersonData data in datas)
                    {
                        AlarmData _alarmData = new AlarmData(data);

                        if (data.ComNum == (int)PersonData.ComNum_Type.Worker)
                        {
                            RegularMemberData regularMember = m_workDBManager.FindRegularMember(_alarmData.TargetId);
                            if (regularMember != null)
                            {
                                _alarmData.PhoneNumber = regularMember.PhoneNumber;
                                _alarmData.Belong = regularMember.RegularName;
                            }
                        }

                        int? nZoneID = m_webServiceManager.FindZoneID(_alarmData.Floor);
                        if (nZoneID != null)
                        {
                            string strZoneName = m_workDBManager.FindZoneName(nZoneID.Value);
                            if (strZoneName != null)
                                _alarmData.Floor = strZoneName;
                        }


                        personDatas.Add(_alarmData);
                    }
                }

                if (datas.Count > 0 && alarmDatas.Count > 0)
                {
                    foreach (AlarmData alarmData in alarmDatas)
                    {
                        AlarmData temp = personDatas.Find(x => x.TargetId == alarmData.TargetId);

                        if (temp != null)
                        {
                            if (alarmData.SosOn == CommonString.YES)
                                temp.SosOn = CommonString.YES;
                            else if (alarmData.LongStayZoneOn == CommonString.YES)
                                temp.LongStayZoneOn = CommonString.YES;
                        }
                    }
                }
            }

            response.EquipZoneMembers = personDatas;
            response.Success = true;
            return response;
        }
                        
        public ResponseEquipZoneMembers GetRemainerMembers(int? nEquipZoneID)
        {
            string strErrorMessage;
            ResponseEquipZoneMembers response = new ResponseEquipZoneMembers();

            List<AlarmData> personDatas = new List<AlarmData>();

            string strCampusID = m_webServiceManager.FindCampusID(nEquipZoneID);

            if (strCampusID != null)
            {
                List<PersonData> datas = m_webServiceManager.RequestRemnant(strCampusID, out strErrorMessage);
                if (datas == null)
                {
                    response.Success = false;
                    response.Message = "1. GetEquipZoneMembers Error : " + strErrorMessage;
                    return response;
                }

                if (datas.Count > 0)
                {
                    foreach (PersonData data in datas)
                    {
                        AlarmData _alarmData = new AlarmData(data);

                        int? nZoneID = m_webServiceManager.FindZoneID(_alarmData.Floor);
                        if (nZoneID != null)
                        {
                            string strZoneName = m_workDBManager.FindZoneName(nZoneID.Value);
                            if (strZoneName != null)
                                _alarmData.Floor = strZoneName;
                        }

                        personDatas.Add(_alarmData);
                    }
                }
            }

            response.EquipZoneMembers = personDatas;
            response.Success = true;
            return response;
        }

        public MessageResult SendRemainerSMS(List<string> phoneNumbers, string strMessage)
        {
            string strErrorMessage;
            MessageResult response = new MessageResult();
            
            if (phoneNumbers == null)
            {
                response.Success = false;
                response.Message = "phoneNumbers 데이터가 존재하지 않습니다.";
                return response;
            }

            IMessageClient client = MessageClientFactory.CreateMessageClient();
            if (client != null)
            {
                MessageContent content = new MessageContent();
                content.Caller = "";

                content.PhoneNumbers.AddRange(phoneNumbers);

                content.Message = strMessage;

                if (client.SendSMS(content))
                {
                    response.Success = true;
                }
                else
                {
                    response.Success = false;
                    response.Message = "SendSMS 실패하였습니다.";
                }
            }
            else
            {
                response.Success = false;
                response.Message = "IMessageClient 선언을 실패하였습니다.";
            }
            
            return response;
        }

        public ResponseVehicleSpeedDetections GetTodaySpeedDetections()
        {
            string strErrorMessage;
            ResponseVehicleSpeedDetections response = new ResponseVehicleSpeedDetections();

            response.SpeedDetectionDatas = m_todaySpeedDetections;
            response.Success = true;
            return response;
        }

        private void WatchDetectionThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchDetectionThread 실행");

            while (!m_shutdownThread)
            {
                try
                {
                    DateTime dtToday = DateTime.Today;
                    
                    string strConditions = $"{VehicleSpeedDetection.TableName}.{VehicleSpeedDetection.Fields.DetectionTime} >= '{dtToday.ToString("yyyy-MM-dd")} 00:00:00'";
                    ArrayList arrResult = m_wonikDataManager.GetSelectManager().JoinVehicleSpeedDetectionSensorETC(strConditions, out strErrorMessage);
                    if (arrResult == null)
                        throw new ApplicationException(strErrorMessage);

                    List<SpeedDetectionData> speedDetections = new List<SpeedDetectionData>();

                    int resultCount = arrResult.Count;
                    for (int i = 0; i < resultCount - 1; i += 2)
                    {
                        if (arrResult[i] is VehicleSpeedDetection && arrResult[i + 1] is SensorETC)
                        {
                            VehicleSpeedDetection detection = arrResult[i] as VehicleSpeedDetection;
                            SensorETC sensor = arrResult[i + 1] as SensorETC;

                            SpeedDetectionData detectionData = new SpeedDetectionData(detection);
                            detectionData.SensorName = sensor.Name;

                            speedDetections.Add(detectionData);
                        }
                    }

                    // 행 수뿐 아니라 내용(CarNo/DiffSeconds 갱신 포함) 변화도 감지해 목록을 교체한다.
                    // (순수 UPDATE 로 CarNo 가 채워진 경우에도 곧바로 반영되도록)
                    string strSignature = BuildDetectionSignature(speedDetections);
                    if (m_strTodaySignature != strSignature)
                    {
                        m_todaySpeedDetections = speedDetections;
                        m_strTodaySignature = strSignature;
                    }                    

                    Thread.Sleep(m_nThreadSleep);
                }
                catch (Exception ex)
                {
                    Logger.Instance.Write("WatchDetectionThread Error: " + ex.Message);
                    Thread.Sleep(m_nErrorSleep);
                }
            }
        }

        // 오늘 과속 목록의 내용 시그니처. ID + CarNo + DiffSeconds 를 이어붙여
        // 새 행(INSERT)/삭제(DELETE)뿐 아니라 CarNo/DiffSeconds 갱신(UPDATE)까지 감지한다.
        private static string BuildDetectionSignature(List<SpeedDetectionData> list)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            foreach (SpeedDetectionData d in list)
            {
                sb.Append(d.ID).Append(':')
                  .Append(d.CarNo ?? "").Append(':')
                  .Append(d.DiffSeconds.HasValue ? d.DiffSeconds.Value.ToString() : "").Append('|');
            }
            return sb.ToString();
        }

        public ResponseVehicleSpeedDetections GetSpeedDetectionHistorys(RequestSpeedDetectionHistorys req)
        {
            string strErrorMessage;
            ResponseVehicleSpeedDetections response = new ResponseVehicleSpeedDetections();

            try
            {
                string strConditions = $"{VehicleSpeedDetection.TableName}.{VehicleSpeedDetection.Fields.DetectionTime} >= '{req.BeginDate}' and {VehicleSpeedDetection.TableName}.{VehicleSpeedDetection.Fields.DetectionTime} <= '{req.EndDate}'";

                if (req.SensorID > 0)                
                    strConditions += $" and {VehicleSpeedDetection.TableName}.{VehicleSpeedDetection.Fields.SensorID} = {req.SensorID}";

                ArrayList arrResult = m_wonikDataManager.GetSelectManager().JoinVehicleSpeedDetectionSensorETC(strConditions, out strErrorMessage);
                if (arrResult == null)
                    throw new ApplicationException(strErrorMessage);

                List<SpeedDetectionData> speedDetections = new List<SpeedDetectionData>();

                int resultCount = arrResult.Count;
                for (int i = 0; i < resultCount - 1; i += 2)
                {
                    if (arrResult[i] is VehicleSpeedDetection && arrResult[i + 1] is SensorETC)
                    {
                        VehicleSpeedDetection detection = arrResult[i] as VehicleSpeedDetection;
                        SensorETC sensor = arrResult[i + 1] as SensorETC;

                        SpeedDetectionData detectionData = new SpeedDetectionData(detection);
                        detectionData.SensorName = sensor.Name;

                        speedDetections.Add(detectionData);
                    }
                }

                response.SpeedDetectionDatas = speedDetections;
                response.Success = true;

            }
            catch (Exception ex)
            {                
                response.Message = ex.Message;
                response.Success = false;
            }
           
            return response;
        }

        /// <summary>
        /// 과속 기준 속도를 돌려준다. appsettings.json 의 SpeedDetection:SpeedLimit 값이다.
        /// 감지 로직과 화면이 같은 기준을 쓰도록 이 한 곳에서 배포한다.
        /// </summary>
        public ResponseSpeedLimit GetSpeedLimit()
        {
            ResponseSpeedLimit response = new ResponseSpeedLimit();

            response.SpeedLimit = Startup.ConfigManager.SpeedDetection.SpeedLimit;
            response.Success = true;
            return response;
        }

        public ResponseSpeedDetectionSensors GetSpeedDetectionSensors()
        {
            string strErrorMessage;
            ResponseSpeedDetectionSensors response = new ResponseSpeedDetectionSensors();

            try
            {
                Dictionary<SDMS.Model.Sensor.SensorZone.Fields, object> dicConditions1 = new Dictionary<SDMS.Model.Sensor.SensorZone.Fields, object>();
                dicConditions1[SDMS.Model.Sensor.SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.SpeedDetection;

                string strConditions = string.Empty;

                ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSensorZoneETCSensor(dicConditions1, null, strConditions, out strErrorMessage);
                if (arrDatas == null)
                    throw new ApplicationException(strErrorMessage);

                int nDataCount = arrDatas.Count;

                List<SDMS.Model.Sensor.ETC> sensors = new List<SDMS.Model.Sensor.ETC>();

                for (int i = 0; i < nDataCount - 1; i += 2)
                {
                    if (arrDatas[i] is SDMS.Model.Sensor.SensorZone && arrDatas[i + 1] is SDMS.Model.Sensor.ETC)
                    {
                        SDMS.Model.Sensor.ETC sensor = (SDMS.Model.Sensor.ETC)arrDatas[i + 1];
                        sensors.Add(sensor);
                    }
                }

                response.Sensors = sensors;
                response.Success = true;

            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
            }

            return response;
        }
    }
}
