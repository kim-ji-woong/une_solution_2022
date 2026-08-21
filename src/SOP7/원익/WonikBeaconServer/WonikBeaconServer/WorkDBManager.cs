using dnsCommunicateSopServer;
using dnsDBUtil;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using SDMS.Model.Worker;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;

namespace WonikBeaconServer
{
    public class WorkDBManager
    {
        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        private SDMS.IDAL.IDataManager m_dataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private ProcessManager m_processManager = null;

        private SopQueryManager m_SopQueryMgr = null;

        private List<AlarmData> m_sosAlarms = new List<AlarmData>();
        private List<AlarmData> m_stayAlarms = new List<AlarmData>();

        private string m_strSOPWebServerURL = "http://127.0.0.1:44379/api/BeaconSensor";

        public WorkDBManager(ProcessManager processManager, SDMS.IDAL.IDataManager dataManager, TeamEditor.IDAL.IDataManager teamDataManager)
        {
            string strSOPWebServerURL = Startup.ConfigManager.Site.SOPWebServerURL;
            if (strSOPWebServerURL != null && strSOPWebServerURL != "")
                m_strSOPWebServerURL = strSOPWebServerURL;

            m_processManager = processManager;
            m_dataManager = dataManager;
            m_teamDataManager = teamDataManager;

            m_SopQueryMgr = new SopQueryManager();
        }

        public bool UpdateWorkInfoCount(Dictionary<int, BeaconCount> dicBuildingGroups, Dictionary<int, BeaconCount> dicBuildings, Dictionary<int, BeaconCount> dicZones, Dictionary<int, BeaconCount> dicEquipmentZones,
            out string strErrorMessage)
        {
            strErrorMessage = "";

            List<WorkerInfo> workerInfos = m_dataManager.GetSelectManager().SelectWorkerInfos(null, null, out strErrorMessage);
            if (workerInfos == null)
            {
                strErrorMessage = "SelectWorkerInfos error (" + strErrorMessage + ")";
                return false;
            }

            List<WorkerInfo> workerInfos_BuildingGroups = new List<WorkerInfo>();
            List<WorkerInfo> workerInfos_Buildings = new List<WorkerInfo>();
            List<WorkerInfo> workerInfos_Zones = new List<WorkerInfo>();
            List<WorkerInfo> workerInfos_EquipmentZones = new List<WorkerInfo>();

            foreach (WorkerInfo workerInfo in workerInfos)
            {
                if (workerInfo.SpatialType == (int)WorkerInfo.Spatial_Type.BuildingGroup)
                {
                    workerInfos_BuildingGroups.Add(workerInfo);
                }
                else if (workerInfo.SpatialType == (int)WorkerInfo.Spatial_Type.Building)
                {
                    workerInfos_Buildings.Add(workerInfo);
                }
                else if (workerInfo.SpatialType == (int)WorkerInfo.Spatial_Type.Zone)
                {
                    workerInfos_Zones.Add(workerInfo);
                }
                else if (workerInfo.SpatialType == (int)WorkerInfo.Spatial_Type.EquipmentZone)
                {
                    workerInfos_EquipmentZones.Add(workerInfo);
                }
            }

            List<WorkerInfo> beacons_BuildingGroups = new List<WorkerInfo>();
            List<WorkerInfo> beacons_Buildings = new List<WorkerInfo>();
            List<WorkerInfo> beacons_Zones = new List<WorkerInfo>();
            List<WorkerInfo> beacons_EquipmentZones = new List<WorkerInfo>();

            foreach (KeyValuePair<int, BeaconCount> pair in dicBuildingGroups)
            {
                int nBuildingGroupID = pair.Key;
                BeaconCount beacon = pair.Value;

                int? nEmployeeInCount = beacon.EmployeeInCount;
                int? nVisitInCount = beacon.VisitInCount;

                if (nEmployeeInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.BuildingGroup;
                    worker.SpatialID = nBuildingGroupID;
                    worker.WorkerType = null;
                    worker.WorkerCount = nEmployeeInCount.Value;

                    beacons_BuildingGroups.Add(worker);
                }
                if (nVisitInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.BuildingGroup;
                    worker.SpatialID = nBuildingGroupID;
                    worker.WorkerType = (int)WorkerInfo.Worker_Type.Visitor;
                    worker.WorkerCount = nVisitInCount.Value;

                    beacons_BuildingGroups.Add(worker);
                }
            }

            foreach (KeyValuePair<int, BeaconCount> pair in dicBuildings)
            {
                int nBuildingID = pair.Key;
                BeaconCount beacon = pair.Value;

                int? nEmployeeInCount = beacon.EmployeeInCount;
                int? nVisitInCount = beacon.VisitInCount;

                if (nEmployeeInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.Building;
                    worker.SpatialID = nBuildingID;
                    worker.WorkerType = null;
                    worker.WorkerCount = nEmployeeInCount.Value;

                    beacons_Buildings.Add(worker);
                }
                if (nVisitInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.Building;
                    worker.SpatialID = nBuildingID;
                    worker.WorkerType = (int)WorkerInfo.Worker_Type.Visitor;
                    worker.WorkerCount = nVisitInCount.Value;

                    beacons_Buildings.Add(worker);
                }
            }


            foreach (KeyValuePair<int, BeaconCount> pair in dicZones)
            {
                int nZoneID = pair.Key;
                BeaconCount beacon = pair.Value;

                int? nEmployeeInCount = beacon.EmployeeInCount;
                int? nVisitInCount = beacon.VisitInCount;

                if (nEmployeeInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.Zone;
                    worker.SpatialID = nZoneID;
                    worker.WorkerType = null;
                    worker.WorkerCount = nEmployeeInCount.Value;

                    beacons_Zones.Add(worker);
                }
                if (nVisitInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.Zone;
                    worker.SpatialID = nZoneID;
                    worker.WorkerType = (int)WorkerInfo.Worker_Type.Visitor;
                    worker.WorkerCount = nVisitInCount.Value;

                    beacons_Zones.Add(worker);
                }
            }


            foreach (KeyValuePair<int, BeaconCount> pair in dicEquipmentZones)
            {
                int nEquipmentZoneID = pair.Key;
                BeaconCount beacon = pair.Value;

                int? nEmployeeInCount = beacon.EmployeeInCount;
                int? nVisitInCount = beacon.VisitInCount;

                if (nEmployeeInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.EquipmentZone;
                    worker.SpatialID = nEquipmentZoneID;
                    worker.WorkerType = null;
                    worker.WorkerCount = nEmployeeInCount.Value;

                    beacons_EquipmentZones.Add(worker);
                }
                if (nVisitInCount.HasValue)
                {
                    WorkerInfo worker = new WorkerInfo();
                    worker.SpatialType = (int)WorkerInfo.Spatial_Type.EquipmentZone;
                    worker.SpatialID = nEquipmentZoneID;
                    worker.WorkerType = (int)WorkerInfo.Worker_Type.Visitor;
                    worker.WorkerCount = nVisitInCount.Value;

                    beacons_EquipmentZones.Add(worker);
                }
            }



            // 값 비교 
            foreach (WorkerInfo info in beacons_BuildingGroups)
            {
                WorkerInfo data = workerInfos_BuildingGroups.Find(x => x.SpatialID == info.SpatialID && x.SpatialType == info.SpatialType && x.WorkerType == info.WorkerType);

                if (data != null)
                {   // 업데이트
                    info.ID = data.ID;
                    // 삭제 목록에서 제외
                    workerInfos_BuildingGroups.Remove(data);
                }
                else
                {   // 새로 추가
                    info.ID = -1;
                }
            }
            foreach (WorkerInfo info in beacons_Buildings)
            {
                WorkerInfo data = workerInfos_Buildings.Find(x => x.SpatialID == info.SpatialID && x.SpatialType == info.SpatialType && x.WorkerType == info.WorkerType);

                if (data != null)
                {   // 업데이트
                    info.ID = data.ID;
                    // 삭제 목록에서 제외
                    workerInfos_Buildings.Remove(data);
                }
                else
                {   // 새로 추가
                    info.ID = -1;
                }
            }
            foreach (WorkerInfo info in beacons_Zones)
            {
                WorkerInfo data = workerInfos_Zones.Find(x => x.SpatialID == info.SpatialID && x.SpatialType == info.SpatialType && x.WorkerType == info.WorkerType);

                if (data != null)
                {   // 업데이트
                    info.ID = data.ID;
                    // 삭제 목록에서 제외
                    workerInfos_Zones.Remove(data);
                }
                else
                {   // 새로 추가
                    info.ID = -1;
                }
            }
            foreach (WorkerInfo info in beacons_EquipmentZones)
            {
                WorkerInfo data = workerInfos_EquipmentZones.Find(x => x.SpatialID == info.SpatialID && x.SpatialType == info.SpatialType && x.WorkerType == info.WorkerType);

                if (data != null)
                {   // 업데이트
                    info.ID = data.ID;
                    // 삭제 목록에서 제외
                    workerInfos_EquipmentZones.Remove(data);
                }
                else
                {   // 새로 추가
                    info.ID = -1;
                }
            }





            // 삭제
            List<int> IDs = new List<int>();

            foreach (WorkerInfo info in workerInfos_BuildingGroups)
            {
                IDs.Add(info.ID);
            }
            foreach (WorkerInfo info in workerInfos_Buildings)
            {
                IDs.Add(info.ID);
            }
            foreach (WorkerInfo info in workerInfos_Zones)
            {
                IDs.Add(info.ID);
            }
            foreach (WorkerInfo info in workerInfos_EquipmentZones)
            {
                IDs.Add(info.ID);
            }

            if (IDs.Count > 0)
            {
                string strAdditionalConditions = string.Format("ID in ({0})", string.Join(",", IDs));

                if (m_dataManager.GetDeleteManager().DeleteWorkerInfo(null, strAdditionalConditions, out strErrorMessage) == false)
                {
                    strErrorMessage = "DeleteWorkerInfo error (" + strErrorMessage + ")";
                    return false;
                }
            }




            // 업데이트 및 추가
            foreach (WorkerInfo info in beacons_BuildingGroups)
            {
                if (info.ID > 0)
                {   // 업데이트
                    if (m_dataManager.GetUpdateManager().UpdateWorkerInfo(info, out strErrorMessage) == false)
                    {
                        strErrorMessage = "UpdateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
                else
                {   // 추가
                    if (m_dataManager.GetCreateManager().CreateWorkerInfo(info, out strErrorMessage) == null)
                    {
                        strErrorMessage = "CreateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
            }
            foreach (WorkerInfo info in beacons_Buildings)
            {
                if (info.ID > 0)
                {   // 업데이트
                    if (m_dataManager.GetUpdateManager().UpdateWorkerInfo(info, out strErrorMessage) == false)
                    {
                        strErrorMessage = "UpdateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
                else
                {   // 추가
                    if (m_dataManager.GetCreateManager().CreateWorkerInfo(info, out strErrorMessage) == null)
                    {
                        strErrorMessage = "CreateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
            }
            foreach (WorkerInfo info in beacons_Zones)
            {
                if (info.ID > 0)
                {   // 업데이트
                    if (m_dataManager.GetUpdateManager().UpdateWorkerInfo(info, out strErrorMessage) == false)
                    {
                        strErrorMessage = "UpdateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
                else
                {   // 추가
                    if (m_dataManager.GetCreateManager().CreateWorkerInfo(info, out strErrorMessage) == null)
                    {
                        strErrorMessage = "CreateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
            }
            foreach (WorkerInfo info in beacons_EquipmentZones)
            {
                if (info.ID > 0)
                {   // 업데이트
                    if (m_dataManager.GetUpdateManager().UpdateWorkerInfo(info, out strErrorMessage) == false)
                    {
                        strErrorMessage = "UpdateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
                else
                {   // 추가
                    if (m_dataManager.GetCreateManager().CreateWorkerInfo(info, out strErrorMessage) == null)
                    {
                        strErrorMessage = "CreateWorkerInfo error (" + strErrorMessage + ")";
                        return false;
                    }
                }
            }



            return true;
        }

        public bool CheckAlarm(List<AlarmData> alarmDatas, out string strErrorMessage)
        {
            strErrorMessage = "";
            List<AlarmData> _alarmDatas = new List<AlarmData>();

            if (alarmDatas == null)
            {
                strErrorMessage = "1. CheckAlarm Error (AlarmData 정보가 올바르지 않습니다.)";
                return false;
            }

            foreach (AlarmData alarmData in alarmDatas)
            {
                if (alarmData.SosOn != CommonString.YES && alarmData.LongStayZoneOn != CommonString.YES)
                    continue;

                // SensorTagID, SensorZoneID 조회
                Dictionary<SensorZone.Fields, object> dicConditions = new Dictionary<SensorZone.Fields, object>();
                
                // SOS 알람 처리하지 않도록 수정 요청
                //if (alarmData.SosOn == CommonString.YES)
                //    dicConditions[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Becon_SOS;
                //else 
                if (alarmData.LongStayZoneOn == CommonString.YES)
                    dicConditions[SensorZone.Fields.SensorType] = (int)dnsData.Sensor.Facility.FacilityType.Becon_Stay;
                else
                    continue;

                dicConditions[SensorZone.Fields.EquipZoneID] = alarmData.EquipZoneID;

                ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSensorZoneTagInfo(dicConditions, null, null, out strErrorMessage);
                if (arrDatas == null)
                    continue;
                else if (arrDatas.Count != 2)
                    continue;
                else if (arrDatas.Count == 2)
                {
                    if (arrDatas[0] is SensorZone && arrDatas[1] is TagInfo)
                    {
                        SensorZone sensorZone = (SensorZone)arrDatas[0];
                        TagInfo tagInfo = (TagInfo)arrDatas[1];

                        alarmData.SensorTagID = tagInfo.ID;
                        alarmData.SensorZoneID = sensorZone.ID;
                    }
                    else
                        continue;
                }
                else
                    continue;


                // 임직원 정보 조회
                if (alarmData.ComNum == (int)PersonData.ComNum_Type.Worker)
                {
                    RegularMemberData regularMember = FindRegularMember(alarmData.TargetId);
                    if (regularMember != null)
                    {
                        alarmData.PhoneNumber = regularMember.PhoneNumber;
                        alarmData.Belong = regularMember.RegularName;
                    }
                }


                // 층정보 조회
                int? nZoneID = m_processManager.WebServiceManager.FindZoneID(alarmData.Floor);
                if (nZoneID != null)
                {
                    string strZoneName = FindZoneName(nZoneID.Value);
                    if (strZoneName != null)
                        alarmData.Floor = strZoneName;
                }


                _alarmDatas.Add(alarmData);
            }





            // 현재 알람 리스트 정보
            List<AlarmData> sosAlarms = new List<AlarmData>();
            List<AlarmData> stayAlarms = new List<AlarmData>();

            foreach (AlarmData data in m_sosAlarms)
            {
                AlarmData clone = data.Clone();
                sosAlarms.Add(clone);
            }

            foreach (AlarmData data in m_stayAlarms)
            {
                AlarmData clone = data.Clone();
                stayAlarms.Add(clone);
            }

            List<AlarmData> sosAlarms_new = new List<AlarmData>();
            List<AlarmData> stayAlarms_new = new List<AlarmData>();






            // 알람 리스트와 현재 발생중인 알람과 비교 후 알람 신호 추가 및 중지
            foreach (AlarmData alarm in _alarmDatas)
            {
                if (alarm.SosOn == CommonString.YES)
                {
                    AlarmData temp = sosAlarms.Find(x => x.EquipZoneID == alarm.EquipZoneID && x.TargetId == alarm.TargetId);
                    if (temp != null)
                    {   // 현재 발생중인 알람
                        sosAlarms.Remove(temp);
                    }
                    else
                    {   // 새로 발생한 알람
                        sosAlarms_new.Add(alarm);
                    }
                }
                else if (alarm.LongStayZoneOn == CommonString.YES)
                {
                    AlarmData temp = stayAlarms.Find(x => x.EquipZoneID == alarm.EquipZoneID && x.TargetId == alarm.TargetId);
                    if (temp != null)
                    {   // 현재 발생중인 알람
                        stayAlarms.Remove(temp);
                    }
                    else
                    {   // 새로 발생한 알람
                        stayAlarms_new.Add(alarm);
                    }
                }
            }





            // 중지된 SOS 알람 리스트
            foreach (AlarmData alarm in sosAlarms) 
            {
                if (alarm.SensorType.HasValue && alarm.SensorTagID.HasValue && alarm.SensorZoneID.HasValue)
                {
                    int nAlarmLevel = GetAlarmLevel(m_sosAlarms, alarm.EquipZoneID);
                    if (nAlarmLevel > 0)
                        nAlarmLevel--;
                    else if (nAlarmLevel < 0)
                        nAlarmLevel = 0;
                    
                    ArrayList arrData = new ArrayList();
                    arrData.Add(alarm.SensorType.Value);
                    arrData.Add(alarm.SensorTagID.Value);
                    arrData.Add(alarm.SensorZoneID.Value);

                    bool bIsAlarm = false;
                    if (nAlarmLevel > 0)
                        bIsAlarm = true;

                    arrData.Add(bIsAlarm);
                    arrData.Add(nAlarmLevel);

                    ArrayList arrData2 = new ArrayList();
                    arrData2.Add(alarm.Name);
                    arrData2.Add(alarm.TargetId);
                    arrData2.Add(alarm.Belong);
                    arrData2.Add(alarm.PhoneNumber);
                    arrData2.Add(alarm.Floor);
                    arrData2.Add(alarm.EquipZoneID);
                    arrData2.Add(alarm.StayTime);
                    arrData2.Add(alarm.ComNum);

                    if (m_SopQueryMgr.SendAlarmQuery(arrData, CommonString.ALARM_METHOD, m_strSOPWebServerURL, arrData2) == false)
                    {
                        Logger.Instance.Write("2. CheckAlarm Error (SensorType: " + alarm.SensorType.ToString() + ", SensorTagID: " + alarm.SensorTagID.ToString() + ", SensorZoneID: " + alarm.SensorZoneID.ToString() +
                               ", IsAlarm: false)");
                        return false;
                    } 
                    else
                    {
                        Logger.Instance.Write($"SendAlarm Log (IsAlarm: {bIsAlarm}, SensorType: {alarm.SensorType}, Floor: {alarm.Floor}, EquipZoneID: {alarm.EquipZoneID}, 체류자: {alarm.Name}, 소속: {alarm.Belong}");
                    }

                    // 중지 신호 발송이후 현재 알람에서 제거 
                    AlarmData temp = m_sosAlarms.Find(x => x.EquipZoneID == alarm.EquipZoneID && x.TargetId == alarm.TargetId);
                    if (temp != null)
                    {   // 현재 발생중인 알람
                        m_sosAlarms.Remove(temp);
                    }
                }
            }

            // 중지된 체류 알람 리스트
            foreach (AlarmData alarm in stayAlarms)
            {
                if (alarm.SensorType.HasValue && alarm.SensorTagID.HasValue && alarm.SensorZoneID.HasValue)
                {
                    int nAlarmLevel = GetAlarmLevel(m_stayAlarms, alarm.EquipZoneID);
                    if (nAlarmLevel > 0)
                        nAlarmLevel--;
                    else if (nAlarmLevel < 0)
                        nAlarmLevel = 0;

                    ArrayList arrData = new ArrayList();
                    arrData.Add(alarm.SensorType.Value);
                    arrData.Add(alarm.SensorTagID.Value);
                    arrData.Add(alarm.SensorZoneID.Value);

                    bool bIsAlarm = false;
                    if (nAlarmLevel > 0)
                        bIsAlarm = true;

                    arrData.Add(bIsAlarm);
                    arrData.Add(nAlarmLevel);

                    ArrayList arrData2 = new ArrayList();
                    arrData2.Add(alarm.Name);
                    arrData2.Add(alarm.TargetId);
                    arrData2.Add(alarm.Belong);
                    arrData2.Add(alarm.PhoneNumber);
                    arrData2.Add(alarm.Floor);
                    arrData2.Add(alarm.EquipZoneID);
                    arrData2.Add(alarm.StayTime);
                    arrData2.Add(alarm.ComNum);

                    if (m_SopQueryMgr.SendAlarmQuery(arrData, CommonString.ALARM_METHOD, m_strSOPWebServerURL, arrData2) == false)
                    {
                        Logger.Instance.Write("3. CheckAlarm Error (SensorType: " + alarm.SensorType.ToString() + ", SensorTagID: " + alarm.SensorTagID.ToString() + ", SensorZoneID: " + alarm.SensorZoneID.ToString() +
                               ", IsAlarm: false)");
                        return false;
                    }
                    else
                    {
                        Logger.Instance.Write($"SendAlarm Log (IsAlarm: {bIsAlarm}, SensorType: {alarm.SensorType}, Floor: {alarm.Floor}, EquipZoneID: {alarm.EquipZoneID}, 체류자: {alarm.Name}, 소속: {alarm.Belong}");
                    }

                    // 중지 신호 발송이후 현재 알람에서 제거 
                    AlarmData temp = m_stayAlarms.Find(x => x.EquipZoneID == alarm.EquipZoneID && x.TargetId == alarm.TargetId);
                    if (temp != null)
                    {   // 현재 발생중인 알람
                        m_stayAlarms.Remove(temp);
                    }
                }
            }

            // 새로 발생된 SOS 알람 리스트
            foreach (AlarmData alarm in sosAlarms_new)
            {
                if (alarm.SensorType.HasValue && alarm.SensorTagID.HasValue && alarm.SensorZoneID.HasValue)
                {
                    int nAlarmLevel = GetAlarmLevel(m_sosAlarms, alarm.EquipZoneID);
                    if (nAlarmLevel < 4)
                        nAlarmLevel++;
                    else if (nAlarmLevel > 4)
                        nAlarmLevel = 4;

                    ArrayList arrData = new ArrayList();
                    arrData.Add(alarm.SensorType.Value);
                    arrData.Add(alarm.SensorTagID.Value);
                    arrData.Add(alarm.SensorZoneID.Value);

                    bool bIsAlarm = false;
                    if (nAlarmLevel > 0)
                        bIsAlarm = true;

                    arrData.Add(bIsAlarm);
                    arrData.Add(nAlarmLevel);

                    ArrayList arrData2 = new ArrayList();
                    arrData2.Add(alarm.Name);
                    arrData2.Add(alarm.TargetId);
                    arrData2.Add(alarm.Belong);
                    arrData2.Add(alarm.PhoneNumber);
                    arrData2.Add(alarm.Floor);
                    arrData2.Add(alarm.EquipZoneID);
                    arrData2.Add(alarm.StayTime);
                    arrData2.Add(alarm.ComNum);

                    if (m_SopQueryMgr.SendAlarmQuery(arrData, CommonString.ALARM_METHOD, m_strSOPWebServerURL, arrData2) == false)
                    {
                        Logger.Instance.Write("4. CheckAlarm Error (SensorType: " + alarm.SensorType.ToString() + ", SensorTagID: " + alarm.SensorTagID.ToString() + ", SensorZoneID: " + alarm.SensorZoneID.ToString() +
                               ", IsAlarm: true)");
                        return false;
                    }
                    else
                    {
                        Logger.Instance.Write($"SendAlarm Log (IsAlarm: {bIsAlarm}, SensorType: {alarm.SensorType}, Floor: {alarm.Floor}, EquipZoneID: {alarm.EquipZoneID}, 체류자: {alarm.Name}, 소속: {alarm.Belong}");
                    }

                    // 발생 신호 발송이후 현재 알람에 추가 
                    m_sosAlarms.Add(alarm);
                }
            }

            // 새로 발생된 체류 알람 리스트
            foreach (AlarmData alarm in stayAlarms_new)
            {
                if (alarm.SensorType.HasValue && alarm.SensorTagID.HasValue && alarm.SensorZoneID.HasValue)
                {
                    int nAlarmLevel = GetAlarmLevel(m_stayAlarms, alarm.EquipZoneID);
                    if (nAlarmLevel < 4)
                        nAlarmLevel++;
                    else if (nAlarmLevel > 4)
                        nAlarmLevel = 4;

                    ArrayList arrData = new ArrayList();
                    arrData.Add(alarm.SensorType.Value);
                    arrData.Add(alarm.SensorTagID.Value);
                    arrData.Add(alarm.SensorZoneID.Value);

                    bool bIsAlarm = false;
                    if (nAlarmLevel > 0)
                        bIsAlarm = true;

                    arrData.Add(bIsAlarm);
                    arrData.Add(nAlarmLevel);

                    ArrayList arrData2 = new ArrayList();
                    arrData2.Add(alarm.Name);
                    arrData2.Add(alarm.TargetId);
                    arrData2.Add(alarm.Belong);
                    arrData2.Add(alarm.PhoneNumber);
                    arrData2.Add(alarm.Floor);
                    arrData2.Add(alarm.EquipZoneID);
                    arrData2.Add(alarm.StayTime);
                    arrData2.Add(alarm.ComNum);

                    if (m_SopQueryMgr.SendAlarmQuery(arrData, CommonString.ALARM_METHOD, m_strSOPWebServerURL, arrData2) == false)
                    {
                        Logger.Instance.Write("5. CheckAlarm Error (SensorType: " + alarm.SensorType.ToString() + ", SensorTagID: " + alarm.SensorTagID.ToString() + ", SensorZoneID: " + alarm.SensorZoneID.ToString() +
                               ", IsAlarm: true)");
                        return false;
                    }
                    else
                    {
                        Logger.Instance.Write($"SendAlarm Log (IsAlarm: {bIsAlarm}, SensorType: {alarm.SensorType}, Floor: {alarm.Floor}, EquipZoneID: {alarm.EquipZoneID}, 체류자: {alarm.Name}, 소속: {alarm.Belong}");
                    }

                    // 발생 신호 발송이후 현재 알람에 추가 
                    m_stayAlarms.Add(alarm);
                }
            }

            return true;
        }

        private int GetAlarmLevel(List<AlarmData> alarms, int? nEquipZoneID)
        {
            int nLevel = 0;

            // EquipZoneID 일치하는 갯수를 반환
            if (alarms?.Count > 0)
            {
                foreach (AlarmData alarmData in alarms)
                {
                    if (alarmData.EquipZoneID == nEquipZoneID)
                    {
                        nLevel++;
                    }
                }
            }

            return nLevel;
        }


        public RegularMemberData FindRegularMember(string strMemberID)
        {
            RegularMemberData member = null;
            string strErrorMessage = null;

            string strAdditionalConditions = string.Format("{0}.{1} = '{2}'", RegularMember.GetTableName(), RegularMember.Fields.MemberID, strMemberID);

            ArrayList arrDatas = m_teamDataManager.GetSelectManager().JoinRegularRegularMember(strAdditionalConditions, out strErrorMessage);

            if (arrDatas?.Count > 1)
            {
                if (arrDatas[0] is Regular && arrDatas[1] is RegularMember)
                {
                    Regular regular = (Regular)arrDatas[0];
                    RegularMember regularMember = (RegularMember)arrDatas[1];

                    member = new RegularMemberData(regularMember);
                    if (member.PhoneNumber != null)
                        member.PhoneNumber = DecryptString(member.PhoneNumber);

                    member.RegularName = regular.TeamName;
                }
            }

            

            return member;
        }

        public string FindZoneName(int nZoneID)
        {
            string strZoneName = null;
            string strErrorMessage = null;

            Zone zone = m_dataManager.GetSelectManager().SelectZone(nZoneID, out strErrorMessage);
            if (zone != null)
            {
                strZoneName = zone.DisplayText;
            }

            return strZoneName;
        }

        public static string EncryptString(string str)
        {
            return AES256Cipher.AES_encrypt(str, key);
        }

        public static string DecryptString(string str)
        {
            return AES256Cipher.AES_decrypt(str, key);
        }
    }
}
