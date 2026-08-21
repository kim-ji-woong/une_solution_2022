using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections;
using Nipa.DAL;
using Nipa.Model.Sdms.Sensor;
using dnsCommunicateSopServer;
using Nipa.Model.Sdms.CCTV;
using Nipa.Model.Sdms.Spatial;

namespace Nipa.BLL
{
    using Models;
    using Models.Request;
    using Models.Response.SDMS;
    using Models.Response;

    public class AlarmManager
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;
        private string m_strSopWebServerUrl = "";

        public AlarmManager(IDataManager dataManager, string strSopWebServerUrl)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(dataManager);
            m_strSopWebServerUrl = strSopWebServerUrl;
        }

        /// <summary>
        /// 오늘 발생한 알람 정보
        /// </summary>
        public ResponseAlarmData GetTodayAlarmData()
        {
            RequestAlarmPeriod request = new RequestAlarmPeriod();
            DateTime dtNow = DateTime.Now;

            request.BeginDate = dtNow.Year * 10000 + dtNow.Month * 100 + dtNow.Day;
            request.EndDate = request.BeginDate;
            return GetPeriodAlarmData(request);
        }

        /// <summary>
        /// 특정 기간동안에 발생한 알람 정보
        /// </summary>
        public ResponseAlarmData GetPeriodAlarmData(RequestAlarmPeriod data)
        {
            ResponseAlarmData result = new ResponseAlarmData();
            List<AlarmData> alarmDatas = new List<AlarmData>();

            string strErrorMessage = null;

            string strBeginTime = string.Format("{0}-{1}-{2} 00:00:00", data.BeginDate / 10000, (data.BeginDate % 10000) / 100, data.BeginDate % 100);
            string strEndTime = string.Format("{0}-{1}-{2} 23:59:59", data.EndDate / 10000, (data.EndDate % 10000) / 100, data.EndDate % 100);
            string strCondition = string.Format("b.{0} >= '{1}' and b.{0} <= '{2}' and b.{3} < {4}",
                Model.Sdms.History.SensorZone.Fields.Time, strBeginTime, strEndTime, Model.Sdms.History.SensorZone.Fields.SensorZoneID, dnsSopID.Header.ManualReportDefaultID);

            List<int> reactionTypes = new List<int>();
            // 알람발생
            reactionTypes.Add(0);
            // 상황종료
            reactionTypes.Add(50);
            // 사용자 복구
            reactionTypes.Add(64);
            // 타임아웃
            reactionTypes.Add(1000);
            ArrayList arrDatas = m_joinManager.JoinSensorZoneSensorZoneHistorySensorReactionHistory(strCondition, reactionTypes, out strErrorMessage);

            if (arrDatas == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            // 시작일 이전의 알람 가운데에서 현재까지 진행중인 알람을 얻어온다.
            strCondition = string.Format("b.{0} < '{1}' and b.{2} < {3}", Model.Sdms.History.SensorZone.Fields.Time, strBeginTime, Model.Sdms.History.SensorZone.Fields.SensorZoneID, dnsSopID.Header.ManualReportDefaultID);
            ArrayList arrDatas2 = m_joinManager.JoinSensorZoneSensorZoneHistorySensorReactionHistoryFromCurrentAlarm(strCondition, out strErrorMessage);

            if (arrDatas2 == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            for (int i= arrDatas2.Count - 1;i>=0;i--)
            {
                arrDatas.Insert(0, arrDatas2[i]);
            }

            int nResultCount = arrDatas.Count;

            if (arrDatas.Count == 0)
            {
                result.Success = true;
                return result;
            }

            IEnumerable<Material> materials = m_dataManager.GetSelect().Select<Material>(null, out strErrorMessage);

            if (materials == null)
                return new ResponseAlarmData(false, strErrorMessage);

            Material atmosphereMaterial = null;
            Dictionary<int, Material> dicMaterials = new Dictionary<int, Material>();
            Dictionary<int, Material> dicWorkerMaterials = new Dictionary<int, Material>();

            foreach (Material material in materials)
            {
                dicMaterials[material.ID] = material;

                string strMaterialName = material.MaterialName.ToLower();

                if (strMaterialName == "ou")
                    atmosphereMaterial = material;
                else if (strMaterialName.Contains("작업자") || strMaterialName == "배터리 교체")
                    dicWorkerMaterials[material.ID] = material;
            }

            IEnumerable<FacilityType> facilityTypes = m_dataManager.GetSelect().Select<FacilityType>(null, out strErrorMessage);

            if (facilityTypes == null)
                return new ResponseAlarmData(false, strErrorMessage);

            Dictionary<int, int> dicFireSensorTypes = new Dictionary<int, int>();
            Dictionary<int, int> dicPSMSensorTypes = new Dictionary<int, int>();
            Dictionary<int, int> dicEtcSensorTypes = new Dictionary<int, int>();

            foreach (FacilityType facilityType in facilityTypes)
            {
                if (facilityType.LinkedTableName == Fire.TableName)
                    dicFireSensorTypes[facilityType.ID] = facilityType.ID;
                else if (facilityType.LinkedTableName == PSM.TableName)
                    dicPSMSensorTypes[facilityType.ID] = facilityType.ID;
                else if (facilityType.LinkedTableName == ETC.TableName)
                    dicEtcSensorTypes[facilityType.ID] = facilityType.ID;
            }

            Dictionary<int, Zone> dicZoneIDs = new Dictionary<int, Zone>();
            Dictionary<int, EquipmentZone> dicEquipZoneIDs = new Dictionary<int, EquipmentZone>();
            Dictionary<int, Fire> dicFireSensorIDs = new Dictionary<int, Fire>();
            Dictionary<int, ETC> dicEtcSensorIDs = new Dictionary<int, ETC>();
            Dictionary<int, PSM> dicPsmSensorIDs = new Dictionary<int, PSM>();
            Dictionary<int, CCTV> dicCctvIDs = new Dictionary<int, CCTV>();
            Dictionary<int, AlarmData> dicAlarmDatas = new Dictionary<int, AlarmData>();

            string strWorkerAlarmSensorZoneHistoryIDs = "";
            string strSensorZoneHistoryIDs = "";

            for (int i = 0; i < nResultCount; i += 3)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is Model.Sdms.History.SensorZone && arrDatas[i + 2] is Model.Sdms.History.SensorReaction)
                {
                    SensorZone sensorZone = arrDatas[i] as SensorZone;
                    Model.Sdms.History.SensorZone sensorZoneHistory = arrDatas[i + 1] as Model.Sdms.History.SensorZone;
                    Model.Sdms.History.SensorReaction sensorReactionHistory = arrDatas[i + 2] as Model.Sdms.History.SensorReaction;

                    AlarmData alarmData = null;

                    if (dicAlarmDatas.TryGetValue(sensorZoneHistory.ID, out alarmData) == false)
                        alarmData = null;

                    if (alarmData == null)
                    {
                        alarmData = new AlarmData();
                        alarmData.EventTime = sensorZoneHistory.Time;
                        alarmData.SensorZoneID = sensorZone.ID;
                        alarmData.FacilityType = (dnsData.Sensor.Facility.FacilityType)sensorZoneHistory.SensorType;
                        alarmData.OrgSensorID = sensorZone.OrgSensorID;
                        alarmData.ZoneID = sensorZoneHistory.ZoneID;
                        alarmData.EquipZoneID = sensorZone.EquipZoneID;
                        alarmData.SensorZoneHistoryID = sensorZoneHistory.ID;
                        alarmData.SiteID = sensorZoneHistory.SiteID;
                        alarmData.Message = sensorReactionHistory.Message;

                        alarmDatas.Add(alarmData);
                        dicAlarmDatas[sensorZoneHistory.ID] = alarmData;

                        if (sensorZone.OrgSensorID != null)
                        {
                            if (dicFireSensorTypes.ContainsKey(sensorZoneHistory.SensorType)/*dnsData.Sensor.Facility.IsFireSensorType((dnsData.Sensor.Facility.FacilityType)sensorZoneHistory.SensorType)*/)
                                dicFireSensorIDs[(int)sensorZone.OrgSensorID] = null;
                            else if (dicPSMSensorTypes.ContainsKey(sensorZoneHistory.SensorType)/*dnsData.Sensor.Facility.IsPSMSensorType((dnsData.Sensor.Facility.FacilityType)sensorZoneHistory.SensorType)*/)
                                dicPsmSensorIDs[(int)sensorZone.OrgSensorID] = null;
                            else if (dicEtcSensorTypes.ContainsKey(sensorZoneHistory.SensorType)/*dnsData.Sensor.Facility.IsETCSensorType((dnsData.Sensor.Facility.FacilityType)sensorZoneHistory.SensorType)*/)
                            {
                                dicEtcSensorIDs[(int)sensorZone.OrgSensorID] = null;

                                if (dicWorkerMaterials.ContainsKey(sensorZoneHistory.SensorType))
                                {
                                    if (strWorkerAlarmSensorZoneHistoryIDs.Length == 0)
                                        strWorkerAlarmSensorZoneHistoryIDs = sensorZoneHistory.ID.ToString();
                                    else
                                        strWorkerAlarmSensorZoneHistoryIDs += "," + sensorZoneHistory.ID.ToString();
                                }
                            }
                            else if (sensorZoneHistory.SensorType == (int)dnsData.Sensor.Facility.FacilityType.CCTV ||
                                sensorZoneHistory.SensorType == (int)dnsData.Sensor.Facility.FacilityType.SicFire ||
                                sensorZoneHistory.SensorType == (int)dnsData.Sensor.Facility.FacilityType.SicIntrusion)
                                dicCctvIDs[(int)sensorZone.OrgSensorID] = null;
                        }

                        dicZoneIDs[sensorZoneHistory.ZoneID] = null;
                        dicEquipZoneIDs[sensorZone.EquipZoneID] = null;

                        if (strSensorZoneHistoryIDs.Length == 0)
                            strSensorZoneHistoryIDs = sensorZoneHistory.ID.ToString();
                        else
                            strSensorZoneHistoryIDs += "," + sensorZoneHistory.ID.ToString();
                    }

                    if (sensorReactionHistory.ReactionType != 0)
                        alarmData.CloseTime = sensorReactionHistory.Time;
                }
            }

            if (strWorkerAlarmSensorZoneHistoryIDs.Length > 0)
            {
                strCondition = string.Format("{0} in ({1}) and {2} = 'WorkerTag'",
                    Nipa.Model.Sdms.History.SensorZoneData.Fields.SensorZoneHistoryID,
                    strWorkerAlarmSensorZoneHistoryIDs,
                    Nipa.Model.Sdms.History.SensorZoneData.Fields.PropertyName);
                IEnumerable<Nipa.Model.Sdms.History.SensorZoneData> sensorZoneHistoryDatas = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.History.SensorZoneData>(strCondition, out strErrorMessage);

                if (sensorZoneHistoryDatas == null)
                    return new ResponseAlarmData(false, strErrorMessage);

                AlarmData alarmData;

                foreach (var sensorZoneHistoryData in sensorZoneHistoryDatas)
                {
                    if (dicAlarmDatas.TryGetValue(sensorZoneHistoryData.SensorZoneHistoryID, out alarmData))
                    {
                        alarmData.WorkerTag = sensorZoneHistoryData.PropertyValue;
                    }
                }
            }

            IEnumerable<Model.Sdms.Alarm.Current> currentAlarms = m_dataManager.GetSelect().Select<Model.Sdms.Alarm.Current>(null, out strErrorMessage);

            if (currentAlarms == null)
                return new ResponseAlarmData(false, strErrorMessage);

            Dictionary<int, Model.Sdms.Alarm.Current> dicCurrentAlarms = new Dictionary<int, Model.Sdms.Alarm.Current>();

            foreach (Model.Sdms.Alarm.Current alarm in currentAlarms)
            {
                AlarmData alarmData;

                if (dicAlarmDatas.TryGetValue(alarm.SensorZoneHistoryID, out alarmData))
                    alarmData.SopStatus = alarm.SopStatus;

                dicCurrentAlarms[alarm.SensorZoneHistoryID] = alarm;
            }

            foreach (var pair in dicAlarmDatas)
            {
                if (dicCurrentAlarms.ContainsKey(pair.Key))
                    pair.Value.IsAlarm = true;
                else
                    pair.Value.IsAlarm = false;
            }

            if (strSensorZoneHistoryIDs.Length > 0)
            {
                strCondition = string.Format("b.{0} in ({1})", Model.Sop.History.ActionStep.Fields.SensorZoneHistoryID, strSensorZoneHistoryIDs);
                ArrayList arrDatas3 = m_joinManager.JoinSensorZoneHistoryActionStepHistory(strCondition, out strErrorMessage);

                if (arrDatas3 == null)
                    return new ResponseAlarmData(false, strErrorMessage);

                nResultCount = arrDatas3.Count;

                for (int i=0;i<nResultCount-1;i+=2)
                {
                    if (arrDatas3[i] is Model.Sdms.History.SensorZone && arrDatas3[i + 1] is Model.Sop.History.ActionStep)
                    {
                        Model.Sdms.History.SensorZone sensorZoneHistory = (Model.Sdms.History.SensorZone)arrDatas3[i];
                        Model.Sop.History.ActionStep actionStepHistory = (Model.Sop.History.ActionStep)arrDatas3[i + 1];

                        AlarmData alarmData;

                        if (dicAlarmDatas.TryGetValue(sensorZoneHistory.ID, out alarmData))
                        {
                            if (actionStepHistory.EndTime != null)
                                alarmData.SopStatus = (int)AlarmData.SopStatusType.Finish;
                            else
                                alarmData.SopStatus = (int)AlarmData.SopStatusType.Progress;
                        }
                    }
                }
            }

            if (ReadZones(dicZoneIDs, out strErrorMessage) == false)
                return new ResponseAlarmData(false, strErrorMessage);
            if (ReadEquipZones(dicEquipZoneIDs, out strErrorMessage) == false)
                return new ResponseAlarmData(false, strErrorMessage);
            if (ReadFireSensors(dicFireSensorIDs, out strErrorMessage) == false)
                return new ResponseAlarmData(false, strErrorMessage);
            if (ReadPsmSensors(dicPsmSensorIDs, out strErrorMessage) == false)
                return new ResponseAlarmData(false, strErrorMessage);
            if (ReadEtcSensors(dicEtcSensorIDs, out strErrorMessage) == false)
                return new ResponseAlarmData(false, strErrorMessage);
            if (ReadCctvs(dicCctvIDs, out strErrorMessage) == false)
                return new ResponseAlarmData(false, strErrorMessage);

            List<AlarmData> fireAlarms = new List<AlarmData>();
            List<AlarmData> smellAlarms = new List<AlarmData>();
            List<AlarmData> gasAlarms = new List<AlarmData>();
            List<AlarmData> emergencyBellAlarms = new List<AlarmData>();
            List<AlarmData> workerTagAlarms = new List<AlarmData>();
            List<AlarmData> thermalCameraAlarms = new List<AlarmData>();
            List<AlarmData> equipmentAlarms = new List<AlarmData>();

            int workerMaterialID = -1, equipmentMaterialID = -1;
            SetMaterialIDs(dicMaterials, ref workerMaterialID, ref equipmentMaterialID);

            foreach (AlarmData alarmData in alarmDatas)
            {
                if (alarmData.OrgSensorID != null && dicFireSensorTypes.ContainsKey((int)alarmData.FacilityType)/*dnsData.Sensor.Facility.IsFireSensorType((dnsData.Sensor.Facility.FacilityType)alarmData.FacilityType)*/)
                {
                    Fire fireSensor;

                    if (dicFireSensorIDs.TryGetValue((int)alarmData.OrgSensorID, out fireSensor))
                    {
                        alarmData.PositionName = fireSensor.PositionName;
                        alarmData.SensorName = fireSensor.Name;
                        alarmData.FacilityTypeName = "화재";
                        fireAlarms.Add(alarmData);
                    }
                }
                else if (alarmData.OrgSensorID != null && dicPSMSensorTypes.ContainsKey((int)alarmData.FacilityType)/*dnsData.Sensor.Facility.IsPSMSensorType((dnsData.Sensor.Facility.FacilityType)alarmData.FacilityType)*/)
                {
                    PSM psmSensor;

                    if (dicPsmSensorIDs.TryGetValue((int)alarmData.OrgSensorID, out psmSensor))
                    {
                        alarmData.SensorName = psmSensor.Name;

                        if (psmSensor.MaterialType != null)
                        {
                            Material material;

                            if (dicMaterials.TryGetValue((int)psmSensor.MaterialType, out material))
                            {
                                string strMaterialName = material.MaterialName.ToLower();
                                alarmData.MaterialType = material.ID;
                                alarmData.FacilityType = (dnsData.Sensor.Facility.FacilityType)material.ID;
                                alarmData.FacilityTypeName = alarmData.MaterialTypeName = material.MaterialName;
                                alarmData.PositionName = psmSensor.PositionName;

                                if (strMaterialName == "ou" || strMaterialName == "voc" || strMaterialName.StartsWith("휘발성") || strMaterialName.StartsWith("미세먼지"))
                                {
                                    if (atmosphereMaterial != null)
                                        alarmData.FacilityType = (dnsData.Sensor.Facility.FacilityType)atmosphereMaterial.ID;

                                    smellAlarms.Add(alarmData);
                                }
                                else
                                {
                                    // 모든 Gas 알람의 FacilityType은 CO로 통일한다.
                                    alarmData.FacilityType = dnsData.Sensor.Facility.FacilityType.CO;
                                    gasAlarms.Add(alarmData);
                                }
                            }
                        }
                    }
                }
                else if (alarmData.OrgSensorID != null && dicEtcSensorTypes.ContainsKey((int)alarmData.FacilityType)/*dnsData.Sensor.Facility.IsETCSensorType((dnsData.Sensor.Facility.FacilityType)alarmData.FacilityType)*/)
                {
                    ETC etcSensor;

                    if (dicEtcSensorIDs.TryGetValue((int)alarmData.OrgSensorID, out etcSensor))
                    {
                        alarmData.PositionName = etcSensor.PositionName;
                        alarmData.SensorName = etcSensor.Name;

                        Material material;

                        if (etcSensor.MaterialType != null && dicMaterials.TryGetValue((int)etcSensor.MaterialType, out material))
                        {
                            alarmData.MaterialType = etcSensor.MaterialType;
                            alarmData.FacilityType = (dnsData.Sensor.Facility.FacilityType)(int)etcSensor.MaterialType;
                            alarmData.FacilityTypeName = alarmData.MaterialTypeName = material.MaterialName;

                            /*if (workerMaterialID < 0)
                            {
                                foreach (var pair in dicMaterials)
                                {
                                    if (pair.Value.MaterialName.StartsWith("AP"))
                                    {
                                        workerMaterialID = pair.Value.ID;
                                        break;
                                    }
                                }
                            }*/

                            string strWorkerMaterial = "작업자";

                            if (material.MaterialName == "배터리 교체" || (material.MaterialName.StartsWith(strWorkerMaterial) && material.MaterialName.Length > strWorkerMaterial.Length))
                            {
                                if (workerMaterialID < 0)
                                    workerMaterialID = GetMaterialID(strWorkerMaterial);

                                alarmData.FacilityType = (dnsData.Sensor.Facility.FacilityType)workerMaterialID;

                                if (etcSensor.UniqueKey != null)
                                {
                                    int index = etcSensor.UniqueKey.IndexOf('_');

                                    if (index > 0)
                                        alarmData.SensorName = etcSensor.UniqueKey.Substring(0, index);
                                }

                                if (material.MaterialName.Contains("협착"))
                                {
                                    int facilityNo = GetFacilityNo(etcSensor.PositionName);

                                    if (facilityNo > 0)
                                        alarmData.FacilityNo = facilityNo;
                                }

                                alarmData.ETC = etcSensor.PositionName;
                            }

                            if (material.MaterialName == "비상벨")
                                emergencyBellAlarms.Add(alarmData);
                            else if (dicWorkerMaterials.ContainsKey(material.ID))
                                workerTagAlarms.Add(alarmData);
                            else if (material.ID == equipmentMaterialID)
                                equipmentAlarms.Add(alarmData);
                        }
                    }
                }
                else if (alarmData.OrgSensorID != null && 
                    (alarmData.FacilityType == dnsData.Sensor.Facility.FacilityType.CCTV ||
                    alarmData.FacilityType == dnsData.Sensor.Facility.FacilityType.SicFire ||
                    alarmData.FacilityType == dnsData.Sensor.Facility.FacilityType.SicIntrusion))
                {
                    CCTV cctv;

                    if (dicCctvIDs.TryGetValue((int)alarmData.OrgSensorID, out cctv))
                    {
                        alarmData.PositionName = cctv.PositionName;
                        alarmData.SensorName = cctv.CameraName;
                        alarmData.FacilityType = dnsData.Sensor.Facility.FacilityType.CCTV;

                        if (cctv.Type.ToLower().Contains("thermal"))
                            alarmData.FacilityTypeName = "열화상카메라";
                        else
                            alarmData.FacilityTypeName = "CCTV";

                        thermalCameraAlarms.Add(alarmData);
                    }
                }

                if (alarmData.PositionName == null)
                    alarmData.PositionName = "";

                Zone zone;

                if (alarmData.PositionName.Length == 0 && dicZoneIDs.TryGetValue(alarmData.ZoneID, out zone))
                    alarmData.ZoneName = zone.DisplayText;

                EquipmentZone equipZone;

                if (dicEquipZoneIDs.TryGetValue(alarmData.EquipZoneID, out equipZone))
                    alarmData.PositionName = equipZone.DisplayText;
            }

            // 가장 최근 알람이 제일 먼저 나타나도록 한다.
            fireAlarms.Reverse();
            smellAlarms.Reverse();
            gasAlarms.Reverse();
            emergencyBellAlarms.Reverse();
            workerTagAlarms.Reverse();
            thermalCameraAlarms.Reverse();
            equipmentAlarms.Reverse();

            if (equipmentAlarms.Count > 0)
            {
                SetMesEquipmentDatas(equipmentAlarms);
            }

            result.FireAlarmDatas.AddRange(fireAlarms);
            result.SmellAlarmDatas.AddRange(smellAlarms);
            result.GasAlarmDatas.AddRange(gasAlarms);
            result.EmergencyBellAlarmDatas.AddRange(emergencyBellAlarms);
            result.WorkerTagAlarmDatas.AddRange(workerTagAlarms);
            result.ThermalCameraAlarmDatas.AddRange(thermalCameraAlarms);
            result.EquipmentAlarmDatas.AddRange(equipmentAlarms);

            result.AllAlarmDatas.AddRange(fireAlarms);
            result.AllAlarmDatas.AddRange(smellAlarms);
            result.AllAlarmDatas.AddRange(gasAlarms);
            result.AllAlarmDatas.AddRange(emergencyBellAlarms);
            result.AllAlarmDatas.AddRange(workerTagAlarms);
            result.AllAlarmDatas.AddRange(thermalCameraAlarms);
            //result.AllAlarmDatas.AddRange(equipmentAlarms);
            result.AllAlarmDatas.Sort();
            result.AllAlarmDatas.Reverse();

            result.Success = true;
            return result;
        }

        private void SetMesEquipmentDatas(List<AlarmData> alarmDatas)
        {
            string strErrorMessage;
            IEnumerable<Nipa.Model.Mes.Equipment.Equipment> equipments = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Equipment.Equipment>(null, out strErrorMessage);

            if (equipments == null)
            {
                System.Diagnostics.Trace.WriteLine("Read Equipment Fail : " + strErrorMessage);
                return;
            }

            Dictionary<int, Nipa.Model.Mes.Equipment.Equipment> dicEquipments = new Dictionary<int, Model.Mes.Equipment.Equipment>();

            foreach (Nipa.Model.Mes.Equipment.Equipment equipment in equipments)
            {
                dicEquipments[equipment.ID] = equipment;
            }

            string strSensorZoneHistoryIDs = "";

            foreach (AlarmData alarmData in alarmDatas)
            {
                if (strSensorZoneHistoryIDs.Length == 0)
                    strSensorZoneHistoryIDs = alarmData.SensorZoneHistoryID.ToString();
                else
                    strSensorZoneHistoryIDs += "," + alarmData.SensorZoneHistoryID.ToString();
            }

            string strCondition = string.Format("{0} in ({1})", Nipa.Model.Sdms.History.SensorZoneData.Fields.SensorZoneHistoryID, strSensorZoneHistoryIDs);
            IEnumerable<Nipa.Model.Sdms.History.SensorZoneData> sensorZoneHistoryDatas = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.History.SensorZoneData>(strCondition, out strErrorMessage);

            if (sensorZoneHistoryDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("Read sensorZoneHistoryData Fail : " + strErrorMessage);
                return;
            }

            MesEquipmentDataEx equipmentData;
            // Key : SensorZoneHistory ID
            Dictionary<int, MesEquipmentDataEx> dicSensorZoneHistoryDatas = new Dictionary<int, MesEquipmentDataEx>();

            foreach (var sensorZoneHistoryData in sensorZoneHistoryDatas)
            {
                if (dicSensorZoneHistoryDatas.TryGetValue(sensorZoneHistoryData.SensorZoneHistoryID, out equipmentData) == false)
                {
                    equipmentData = new MesEquipmentDataEx();
                    equipmentData.Data = new Model.Mes.Equipment.Data();
                    dicSensorZoneHistoryDatas[sensorZoneHistoryData.SensorZoneHistoryID] = equipmentData;
                }

                if (sensorZoneHistoryData.PropertyName == "AlarmType")
                    equipmentData.AlarmType = sensorZoneHistoryData.PropertyValue;
                else if (sensorZoneHistoryData.PropertyName == "EqID")
                {
                    int eqID;

                    if (sensorZoneHistoryData.PropertyValue != null && int.TryParse(sensorZoneHistoryData.PropertyValue.Trim(), out eqID))
                    {
                        Nipa.Model.Mes.Equipment.Equipment equipment;

                        if (dicEquipments.TryGetValue(eqID, out equipment))
                        {
                            equipmentData.Equipment = equipment;
                            equipmentData.Data.EqID = eqID;
                        }
                    }
                }
                else if (sensorZoneHistoryData.PropertyName == "ImagePath")
                    equipmentData.ImagePath = sensorZoneHistoryData.PropertyValue;
                else if (sensorZoneHistoryData.PropertyName == "BackwardTime")
                    equipmentData.Data.BackwardTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "CushionPos")
                    equipmentData.Data.CushionPos = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "FowardTime")
                    equipmentData.Data.FowardTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "HoldingPressure")
                    equipmentData.Data.HoldingPressure = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "IcingTime")
                    equipmentData.Data.IcingTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "InjectTime")
                    equipmentData.Data.InjectTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "MaxPressure")
                    equipmentData.Data.MaxPressure = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "MeasureEndPos")
                    equipmentData.Data.MeasureEndPos = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "MeasureStartPos")
                    equipmentData.Data.MeasureStartPos = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "MeasureTime")
                    equipmentData.Data.MeasureTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "MoldCloseTime")
                    equipmentData.Data.MoldCloseTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "MoldOpenTime")
                    equipmentData.Data.MoldOpenTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "ProcessTime")
                    equipmentData.Data.ProcessTime = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "ShotCount")
                    equipmentData.Data.ShotCount = GetInt(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "ShotTime")
                    equipmentData.Data.ShotTime = GetDateTime(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "TransferPos")
                    equipmentData.Data.TransferPos = GetDouble(sensorZoneHistoryData.PropertyValue);
                else if (sensorZoneHistoryData.PropertyName == "TransferPressure")
                    equipmentData.Data.TransferPressure = GetDouble(sensorZoneHistoryData.PropertyValue);
            }

            foreach (AlarmData alarmData in alarmDatas)
            {
                if (dicSensorZoneHistoryDatas.TryGetValue(alarmData.SensorZoneHistoryID, out equipmentData))
                    alarmData.EquipmentData = equipmentData;
            }
        }

        private DateTime GetDateTime(string strValue)
        {
            if (strValue == null)
                return new DateTime();

            DateTime data;

            if (DateTime.TryParse(strValue.Trim(), out data) == false)
                return new DateTime();

            return data;
        }

        private int GetInt(string strValue)
        {
            if (strValue == null)
                return 0;

            int data;

            if (int.TryParse(strValue.Trim(), out data) == false)
                return 0;

            return data;
        }

        private double GetDouble(string strValue)
        {
            if (strValue == null)
                return 0;

            double data;

            if (double.TryParse(strValue.Trim(), out data) == false)
                return 0;

            return data;
        }

        private void SetMaterialIDs(Dictionary<int, Material> dicMaterials, ref int workerMaterialID, ref int equipmentMaterialID)
        {
            foreach (var pair in dicMaterials)
            {
                if (pair.Value.MaterialName.StartsWith("AP"))
                {
                    workerMaterialID = pair.Value.ID;

                    if (equipmentMaterialID > 0)
                        return;
                }
                else if (pair.Value.MaterialName.StartsWith("사출설비"))
                {
                    equipmentMaterialID = pair.Value.ID;

                    if (workerMaterialID > 0)
                        return;
                }
            }
        }

        private int GetFacilityNo(string strName)
        {
            if (strName == null)
                return 0;

            int len = strName.Length;
            bool begin = false;
            int no = 0;

            for (int i=0;i<len;i++)
            {
                char ch = strName[i];

                if (begin == false)
                {
                    if (ch >= '0' && ch <= '9')
                    {
                        begin = true;
                        no = (int)(ch - '0');
                    }
                }
                else
                {
                    if (ch >= '0' && ch <= '9')
                        no = no * 10 + (int)(ch - '0');
                    else
                        break;
                }
            }

            return no;
        }

        private int GetMaterialID(string strMaterialName)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", Material.Fields.MaterialName, strMaterialName);
            Material material = m_dataManager.GetSelect().SelectFirst<Material>(strCondition, out strErrorMessage);

            if (material == null)
                return -1;

            return material.ID;
        }

        private bool ReadZones(Dictionary<int, Zone> dicZoneIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strZoneIDs = "";

            foreach (KeyValuePair<int, Zone> pair in dicZoneIDs)
            {
                if (strZoneIDs.Length == 0)
                    strZoneIDs = pair.Key.ToString();
                else
                    strZoneIDs += "," + pair.Key.ToString();
            }

            if (strZoneIDs.Length == 0)
                return true;

            string strConditions = string.Format("{0} in ({1})", Zone.Fields.ID, strZoneIDs);
            IEnumerable<Zone> zones = m_dataManager.GetSelect().Select<Zone>(strConditions, out strErrorMessage);

            if (zones == null)
                return false;

            foreach (Zone zone in zones)
            {
                dicZoneIDs[zone.ID] = zone;
            }

            return true;
        }

        private bool ReadEquipZones(Dictionary<int, EquipmentZone> dicEquipZoneIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strEquipZoneIDs = "";

            foreach (KeyValuePair<int, EquipmentZone> pair in dicEquipZoneIDs)
            {
                if (strEquipZoneIDs.Length == 0)
                    strEquipZoneIDs = pair.Key.ToString();
                else
                    strEquipZoneIDs += "," + pair.Key.ToString();
            }

            if (strEquipZoneIDs.Length == 0)
                return true;

            string strConditions = string.Format("{0} in ({1})", EquipmentZone.Fields.ID, strEquipZoneIDs);
            IEnumerable<EquipmentZone> equipZones = m_dataManager.GetSelect().Select<EquipmentZone>(strConditions, out strErrorMessage);

            if (equipZones == null)
                return false;

            foreach (EquipmentZone equipZone in equipZones)
            {
                dicEquipZoneIDs[equipZone.ID] = equipZone;
            }

            return true;
        }

        private bool ReadFireSensors(Dictionary<int, Fire> dicFireSensorIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strSensorIDs = "";

            foreach (KeyValuePair<int, Fire> pair in dicFireSensorIDs)
            {
                if (strSensorIDs.Length == 0)
                    strSensorIDs = pair.Key.ToString();
                else
                    strSensorIDs += "," + pair.Key.ToString();
            }

            if (strSensorIDs.Length == 0)
                return true;

            string strConditions = string.Format("{0} in ({1})", Fire.Fields.ID, strSensorIDs);
            IEnumerable<Fire> fireSensors = m_dataManager.GetSelect().Select<Fire>(strConditions, out strErrorMessage);

            if (fireSensors == null)
                return false;

            foreach (Fire fireSensor in fireSensors)
            {
                dicFireSensorIDs[fireSensor.ID] = fireSensor;
            }

            return true;
        }

        private bool ReadPsmSensors(Dictionary<int, PSM> dicPsmSensorIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strSensorIDs = "";

            foreach (KeyValuePair<int, PSM> pair in dicPsmSensorIDs)
            {
                if (strSensorIDs.Length == 0)
                    strSensorIDs = pair.Key.ToString();
                else
                    strSensorIDs += "," + pair.Key.ToString();
            }

            if (strSensorIDs.Length == 0)
                return true;

            string strConditions = string.Format("{0} in ({1})", PSM.Fields.ID, strSensorIDs);
            IEnumerable<PSM> psmSensors = m_dataManager.GetSelect().Select<PSM>(strConditions, out strErrorMessage);

            if (psmSensors == null)
                return false;

            foreach (PSM psmSensor in psmSensors)
            {
                dicPsmSensorIDs[psmSensor.ID] = psmSensor;
            }

            return true;
        }

        private bool ReadEtcSensors(Dictionary<int, ETC> dicEtcSensorIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strSensorIDs = "";

            foreach (KeyValuePair<int, ETC> pair in dicEtcSensorIDs)
            {
                if (strSensorIDs.Length == 0)
                    strSensorIDs = pair.Key.ToString();
                else
                    strSensorIDs += "," + pair.Key.ToString();
            }

            if (strSensorIDs.Length == 0)
                return true;

            string strConditions = string.Format("{0} in ({1})", ETC.Fields.ID, strSensorIDs);
            IEnumerable<ETC> etcSensors = m_dataManager.GetSelect().Select<ETC>(strConditions, out strErrorMessage);

            if (etcSensors == null)
                return false;

            foreach (ETC etcSensor in etcSensors)
            {
                dicEtcSensorIDs[etcSensor.ID] = etcSensor;
            }

            return true;
        }

        private bool ReadCctvs(Dictionary<int, CCTV> dicCctvIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            string strSensorIDs = "";

            foreach (KeyValuePair<int, CCTV> pair in dicCctvIDs)
            {
                if (strSensorIDs.Length == 0)
                    strSensorIDs = pair.Key.ToString();
                else
                    strSensorIDs += "," + pair.Key.ToString();
            }

            if (strSensorIDs.Length == 0)
                return true;

            string strConditions = string.Format("{0} in ({1})", CCTV.Fields.ID, strSensorIDs);
            IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(strConditions, out strErrorMessage);

            if (cctvs == null)
                return false;

            foreach (CCTV cctv in cctvs)
            {
                dicCctvIDs[cctv.ID] = cctv;
            }

            return true;
        }

        public MessageResult ClearAlarm(RequestClearAlarm data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Nipa.Model.Sdms.History.SensorZone.Fields.ID, data.SensorZoneHistoryID);
            Nipa.Model.Sdms.History.SensorZone sensorZoneHistory = m_dataManager.GetSelect().SelectFirst<Nipa.Model.Sdms.History.SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistory == null)
            {
                System.Diagnostics.Trace.WriteLine("Select SensorZoneHistory Fail : " + strErrorMessage);
                return new MessageResult(false, strErrorMessage);
            }

            FacilityType facilityType = GetFacilityType(sensorZoneHistory.SensorType, out strErrorMessage);

            if (facilityType == null)
            {
                System.Diagnostics.Trace.WriteLine("ClearAlarm Fail : " + strErrorMessage);
                return new MessageResult(false, strErrorMessage);
            }

            strCondition = string.Format("{0} = {1}", TagInfo.Fields.SensorZoneID, data.SensorZoneID);
            TagInfo tagInfo = m_dataManager.GetSelect().SelectFirst<TagInfo>(strCondition, out strErrorMessage);

            if (tagInfo == null)
            {
                System.Diagnostics.Trace.WriteLine("SelectTagInfo Fail : " + strErrorMessage);
                return new MessageResult(false, strErrorMessage);
            }

            string strTableName = facilityType.LinkedTableName.ToLower();
            bool result = false;

            try
            {
                string url = m_strSopWebServerUrl + "/api";

                if (strTableName == "sdmssensorfire")
                    url += "/FireSensor";
                else if (strTableName == "sdmssensorpsm")
                    url += "/PSMSensor";
                else if (strTableName == "sdmssensoretc")
                    url += "/EtcSensor";
                else if (strTableName == "sdmscctv")
                    url += "/SecuritySensor";
                else
                    return new MessageResult(false, "지정되지 않은 SensorTable입니다.(" + strTableName + ")");

                SopQueryManager sopQueryManager = new SopQueryManager(url);

                ArrayList arrDatas = new ArrayList();

                if (url.EndsWith("PSMSensor"))
                {
                    arrDatas.Add(data.SensorZoneID);
                    arrDatas.Add(data.AccessedUserID);

                    result = sopQueryManager.SendAlarmUserResetQuery(data.IsMalfunction, arrDatas, "POST");
                }
                else
                {
                    arrDatas.Add(sensorZoneHistory.SensorType);
                    arrDatas.Add(tagInfo.ID);
                    arrDatas.Add(data.SensorZoneID);
                    arrDatas.Add(false);

                    result = sopQueryManager.SendAlarmMalfunctionQuery(data.IsMalfunction, arrDatas, "POST");
                }

                if (result && data.Memo != null)
                {
                    sensorZoneHistory.Memo = data.Memo;

                    result = m_dataManager.GetUpdate().Update<Nipa.Model.Sdms.History.SensorZone>(sensorZoneHistory, null, out strErrorMessage);

                    if (result == false)
                        System.Diagnostics.Trace.WriteLine("Update SensorZoneHistory Fail : " + strErrorMessage);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
                return new MessageResult(false, strErrorMessage);
            }

            return new MessageResult(result, "");
        }

        private FacilityType GetFacilityType(int sensorType, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", FacilityType.Fields.ID, sensorType);
            return m_dataManager.GetSelect().SelectFirst<FacilityType>(strCondition, out strErrorMessage);
        }

        /// <summary>
        /// 알람 오작동
        /// </summary>
        public MessageResult Malfunction(RequestClearAlarm data)
        {
            bool result = false;

            try
            {
                string strErrorMessage = null;
                string strCondition = string.Format("{0} = {1}", Nipa.Model.Sdms.History.SensorZone.Fields.ID, data.SensorZoneHistoryID);
                Nipa.Model.Sdms.History.SensorZone sensorZoneHistory = m_dataManager.GetSelect().SelectFirst<Nipa.Model.Sdms.History.SensorZone>(strCondition, out strErrorMessage);

                if (sensorZoneHistory == null)
                {
                    System.Diagnostics.Trace.WriteLine("Select SensorZoneHistory Fail : " + strErrorMessage);
                    return new MessageResult(false, strErrorMessage);
                }

                FacilityType facilityType = GetFacilityType(sensorZoneHistory.SensorType, out strErrorMessage);

                if (facilityType == null)
                {
                    System.Diagnostics.Trace.WriteLine("Malfunction Fail : " + strErrorMessage);

                    if (strErrorMessage == null)
                        return new MessageResult(false, "알려지지 않은 센서타입입니다.(" + sensorZoneHistory.SensorType + ")");
                    else
                        return new MessageResult(false, strErrorMessage);
                }

                strCondition = string.Format("{0} = {1}", TagInfo.Fields.SensorZoneID, data.SensorZoneID);
                TagInfo tagInfo = m_dataManager.GetSelect().SelectFirst<TagInfo>(strCondition, out strErrorMessage);

                if (tagInfo == null)
                {
                    System.Diagnostics.Trace.WriteLine("Malfunction Fail2 : " + strErrorMessage);

                    if (strErrorMessage == null)
                        return new MessageResult(false, "시스템 데이터베이스로부터 알람이 발생한 센서정보를 찾을수 없습니다.");
                    else
                        return new MessageResult(false, strErrorMessage);
                }

                string strTableName = facilityType.LinkedTableName.ToLower();

                string url = m_strSopWebServerUrl + "/api";

                ArrayList arrDatas = new ArrayList();
                SopQueryManager sopQueryManager = new SopQueryManager();

                if (strTableName == "sdmssensorfire")
                {
                    arrDatas.Add(sensorZoneHistory.SensorType);
                    arrDatas.Add(tagInfo.ID);
                    arrDatas.Add(data.SensorZoneID);
                    arrDatas.Add(false);

                    url += "/FireSensor";
                    result = sopQueryManager.SendAlarmMalfunctionQuery(data.IsMalfunction, arrDatas, "POST", url);
                }
                else if (strTableName == "sdmssensorpsm")
                {
                    arrDatas.Add(data.SensorZoneID);
                    arrDatas.Add(data.AccessedUserID);

                    url += "/PSMSensor";
                    result = sopQueryManager.SendAlarmUserResetQuery(!data.IsMalfunction, arrDatas, "POST", url);
                }
                else if (strTableName == "sdmssensoretc")
                {
                    arrDatas.Add(sensorZoneHistory.SensorType);
                    arrDatas.Add(tagInfo.ID);
                    arrDatas.Add(data.SensorZoneID);
                    arrDatas.Add(false);

                    url += "/EtcSensor";
                    result = sopQueryManager.SendAlarmMalfunctionQuery(data.IsMalfunction, arrDatas, "POST", url);
                }
                else if (strTableName == "sdmscctv")
                {
                    arrDatas.Add(sensorZoneHistory.SensorType);
                    arrDatas.Add(tagInfo.ID);
                    arrDatas.Add(data.SensorZoneID);
                    arrDatas.Add(false);

                    url += "/SecuritySensor";
                    result = sopQueryManager.SendAlarmMalfunctionQuery(data.IsMalfunction, arrDatas, "POST", url);
                }
                else
                    return new MessageResult(false, "지정되지 않은 SensorTable입니다.(" + strTableName + ")");

                if (result && data.Memo != null)
                {
                    sensorZoneHistory.Memo = data.Memo;

                    result = m_dataManager.GetUpdate().Update<Nipa.Model.Sdms.History.SensorZone>(sensorZoneHistory, null, out strErrorMessage);

                    if (result == false)
                        System.Diagnostics.Trace.WriteLine("Update SensorZoneHistory Fail : " + strErrorMessage);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.WriteLine(ex.Message);
                return new MessageResult(false, ex.Message);
            }

            if (result == false)
                return new MessageResult(result, "알람해제가 실패하였습니다");

            return new MessageResult(result, "");
        }

        /// <summary>
        /// 상황전파
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public MessageResult SituationNotice(RequestSituationNotice data)
        {
            MessageResult res = new MessageResult();
            try
            {
                SopQueryManager sopQueryManager = new SopQueryManager(m_strSopWebServerUrl + "/api/Sop");

                ArrayList arrDatas = new ArrayList();
                arrDatas.Add(data.SensorType); // 0: 화재
                arrDatas.Add(data.SensorZoneID);

                sopQueryManager.SendSituationNotice(arrDatas, "POST");

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }
    }
}
