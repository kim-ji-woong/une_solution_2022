using System;
using System.Collections.Generic;
using SDMS.IDAL;
using SDMS.Model.Sensor;
using SDMS.Model.CCTV;
using GGH.Model.Equipment;

namespace GGH.BLL
{
    using Models.Request;
    using Models.Response;

    public class SensorManager
    {
        private IDataManager m_sdmsDataManager = null;
        private GGH.IDAL.IDataManager m_dataManager = null;

        public SensorManager(IDataManager sdmsDataManager, GGH.IDAL.IDataManager dataManager)
        {
            m_sdmsDataManager = sdmsDataManager;
            m_dataManager = dataManager;
        }

        public MessageResult UpdateSensorEnabled(UpdateSensorEnabled data)
        {
            IDataManager sdmsDataManager = m_sdmsDataManager.Clone();

            if (sdmsDataManager.BeginBatch() == false)
                return new MessageResult(false, "DB 트랜잭션을 시작할 수 없습니다.");

            GGH.IDAL.IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch() == false)
            {
                sdmsDataManager.BatchRollback();
                return new MessageResult(false, "DB 트랜잭션을 시작할 수 없습니다.");
            }

            string strErrorMessage;

            if (data.EnabledSensors != null)
            {
                foreach (var sensorData in data.EnabledSensors)
                {
                    if (sensorData.SensorIDs == null || sensorData.SensorIDs.Count == 0)
                        continue;

                    if (UpdateSensorDataEnable(sdmsDataManager, dataManager, sensorData, true, out strErrorMessage) == false)
                    {
                        sdmsDataManager.BatchRollback();
                        dataManager.BatchRollback();
                        return new MessageResult(false, strErrorMessage);
                    }
                }
            }

            if (data.DisabledSensors != null)
            {
                foreach (var sensorData in data.DisabledSensors)
                {
                    if (sensorData.SensorIDs == null || sensorData.SensorIDs.Count == 0)
                        continue;

                    if (UpdateSensorDataEnable(sdmsDataManager, dataManager, sensorData, false, out strErrorMessage) == false)
                    {
                        sdmsDataManager.BatchRollback();
                        dataManager.BatchRollback();
                        return new MessageResult(false, strErrorMessage);
                    }
                }
            }

            if (sdmsDataManager.BatchCommit() == false || dataManager.BatchCommit() == false)
            {
                sdmsDataManager.BatchRollback();
                dataManager.BatchRollback();
                return new MessageResult(false, "DB 트랜잭션을 완료할 수 없습니다.");
            }

            return new MessageResult(true, "");
        }

        private bool UpdateSensorDataEnable(IDataManager sdmsDataManager, GGH.IDAL.IDataManager dataManager, UpdateSensorEnabled.SensorDatas sensorData, bool enabled, out string strErrorMessage)
        {
            if (sensorData.SensorType.ToLower() == "fire")
            {
                Dictionary<Fire.Fields, object> dicSets = new Dictionary<Fire.Fields, object>();
                dicSets[Fire.Fields.Enabled] = enabled;

                string strCondition = string.Format("{0} in ({1})", Fire.Fields.ID, string.Join(",", sensorData.SensorIDs.ToArray()));

                if (sdmsDataManager.GetUpdateManager().UpdateFireSensor(dicSets, null, strCondition, out strErrorMessage) == false)
                    return false;

                if (UpdateDataManager.MakeUpdateData(dataManager, Fire.TableName, Fire.Fields.Enabled.ToString(), enabled ? "1" : "0", strCondition, out strErrorMessage) == false)
                    return false;
            }
            else if (sensorData.SensorType.ToLower() == "etc")
            {
                Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
                dicSets[ETC.Fields.Enabled] = enabled;

                string strCondition = string.Format("{0} in ({1})", ETC.Fields.ID, string.Join(",", sensorData.SensorIDs.ToArray()));

                if (sdmsDataManager.GetUpdateManager().UpdateETCSensor(dicSets, null, strCondition, out strErrorMessage) == false)
                    return false;

                if (UpdateDataManager.MakeUpdateData(dataManager, ETC.TableName, ETC.Fields.Enabled.ToString(), enabled ? "1" : "0", strCondition, out strErrorMessage) == false)
                    return false;
            }
            else if (sensorData.SensorType.ToLower() == "psm")
            {
                Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();
                dicSets[PSM.Fields.Enabled] = enabled;

                string strCondition = string.Format("{0} in ({1})", PSM.Fields.ID, string.Join(",", sensorData.SensorIDs.ToArray()));

                if (sdmsDataManager.GetUpdateManager().UpdatePSMSensor(dicSets, null, strCondition, out strErrorMessage) == false)
                    return false;

                if (UpdateDataManager.MakeUpdateData(dataManager, PSM.TableName, PSM.Fields.Enabled.ToString(), enabled ? "1" : "0", strCondition, out strErrorMessage) == false)
                    return false;
            }
            else if (sensorData.SensorType.ToLower() == "cctv")
            {
                Dictionary<CCTV.Fields, object> dicSets = new Dictionary<CCTV.Fields, object>();
                dicSets[CCTV.Fields.Enabled] = enabled;

                string strCondition = string.Format("{0} in ({1})", CCTV.Fields.ID, string.Join(",", sensorData.SensorIDs.ToArray()));

                if (sdmsDataManager.GetUpdateManager().UpdateCCTV(dicSets, null, strCondition, out strErrorMessage) == false)
                    return false;

                if (UpdateDataManager.MakeUpdateData(dataManager, CCTV.TableName, CCTV.Fields.Enabled.ToString(), enabled ? "1" : "0", strCondition, out strErrorMessage) == false)
                    return false;
            }

            strErrorMessage = null;
            return true;
        }

        public ResponseUpdatePOIPositions UpdateFirstAidEquipments(RequestUpdatePOIPositions request)
        {
            string strErrorMessage;
            List<FirstAidEquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectFirstAidEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
                return new ResponseUpdatePOIPositions(false, strErrorMessage);

            Dictionary<string, FirstAidEquipmentType> dicEquipmentTypes = new Dictionary<string, FirstAidEquipmentType>();

            foreach (var equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.EquipmentTypeEng] = equipmentType;
            }

            Dictionary<int, int> dicZoneSiteIDs = GetZoneSiteID(dicEquipmentTypes, request, out strErrorMessage);

            if (dicZoneSiteIDs == null)
                return new ResponseUpdatePOIPositions(false, strErrorMessage);

            GGH.IDAL.IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch() == false)
                return new ResponseUpdatePOIPositions(false, "Database 트랜잭션을 시작할 수 없습니다.");

            ResponseUpdatePOIPositions response = new ResponseUpdatePOIPositions(true, "");
            int nDataCount = request.Datas.Count;

            DateTime dtNow = DateTime.Now;

            for (int i=nDataCount-1;i>=0;i--)
            {
                RequestUpdatePOIPosition data = request.Datas[i];

                if (data.SensorID < 0)
                {
                    if (CreateFirstAidEquipment(dataManager, dicEquipmentTypes, dicZoneSiteIDs, data, response, i, request.Datas, dtNow, out strErrorMessage) == false)
                    {
                        dataManager.BatchRollback();
                        return new ResponseUpdatePOIPositions(false, strErrorMessage);
                    }
                }
                else
                {
                    if (UpdateFirstAidEquipment(dataManager, dicEquipmentTypes, data, i, request.Datas, dtNow, out strErrorMessage) == false)
                    {
                        dataManager.BatchRollback();
                        return new ResponseUpdatePOIPositions(false, strErrorMessage);
                    }
                }
            }

            if (dataManager.BatchCommit() == false)
            {
                dataManager.BatchRollback();
                return new ResponseUpdatePOIPositions(false, "Database 트랜잭션을 정상적으로 종료하지 못하였습니다.");
            }

            return response;
        }

        private bool UpdateFirstAidEquipment(GGH.IDAL.IDataManager dataManager, Dictionary<string, FirstAidEquipmentType> dicEquipmentTypes, RequestUpdatePOIPosition data, int index, List<RequestUpdatePOIPosition> datas, DateTime dtNow, out string strErrorMessage)
        {
            FirstAidEquipmentType equipmentType;

            if (dicEquipmentTypes.TryGetValue(data.SensorType, out equipmentType))
            {
                Dictionary<FirstAidEquipment.Fields, object> dicSets = new Dictionary<FirstAidEquipment.Fields, object>();

                if (data.Position == null)
                {
                    dicSets[FirstAidEquipment.Fields.X] = null;
                    dicSets[FirstAidEquipment.Fields.Y] = null;
                    dicSets[FirstAidEquipment.Fields.Z] = null;
                }
                else
                {
                    dicSets[FirstAidEquipment.Fields.X] = data.Position.x;
                    dicSets[FirstAidEquipment.Fields.Y] = data.Position.y;
                    dicSets[FirstAidEquipment.Fields.Z] = data.Position.z;
                }

                Dictionary<FirstAidEquipment.Fields, object> dicConditions = new Dictionary<FirstAidEquipment.Fields, object>();
                dicConditions[FirstAidEquipment.Fields.ID] = data.SensorID;

                if (m_dataManager.GetUpdateManager().UpdateFirstAidEquipment(dicSets, dicConditions, null, out strErrorMessage) == false)
                    return false;
                else
                {
                    datas.RemoveAt(index);

                    FirstAidEquipment equipment = new FirstAidEquipment();

                    if (data.Position == null)
                    {
                        equipment.X = null;
                        equipment.Y = null;
                        equipment.Z = null;
                    }
                    else
                    {
                        equipment.X = data.Position.x;
                        equipment.Y = data.Position.y;
                        equipment.Z = data.Position.z;
                    }

                    if (UpdateDataManager.MakeUpdateData(equipment, dtNow, dataManager, out strErrorMessage) == false)
                        return false;
                }
            }

            strErrorMessage = null;
            return true;
        }

        private bool CreateFirstAidEquipment(GGH.IDAL.IDataManager dataManager, Dictionary<string, FirstAidEquipmentType> dicEquipmentTypes, Dictionary<int, int> dicZoneSiteIDs, RequestUpdatePOIPosition data, ResponseUpdatePOIPositions response, int index, List<RequestUpdatePOIPosition> datas, DateTime dtNow, out string strErrorMessage)
        {
            FirstAidEquipmentType equipmentType;

            if (dicEquipmentTypes.TryGetValue(data.SensorType, out equipmentType))
            {
                int siteID;

                if (dicZoneSiteIDs.TryGetValue(data.ZoneID, out siteID))
                {
                    FirstAidEquipment equipment = new FirstAidEquipment();

                    equipment.EquipmentName = equipmentType.EquipmentType;
                    equipment.EquipmentType = equipmentType.ID;
                    equipment.SiteID = siteID;
                    equipment.ZoneID = data.ZoneID;

                    if (data.Position == null)
                    {
                        equipment.X = null;
                        equipment.Y = null;
                        equipment.Z = null;
                    }
                    else
                    {
                        equipment.X = data.Position.x;
                        equipment.Y = data.Position.y;
                        equipment.Z = data.Position.z;
                    }

                    FirstAidEquipment newEquipment = dataManager.GetCreateManager().CreateFirstAidEquipment(equipment, out strErrorMessage);

                    if (newEquipment == null)
                        return false;
                    else
                    {
                        response.AddedSensors.Add(new POIData(data.SensorID, newEquipment.ID, data.SensorType));
                        datas.RemoveAt(index);

                        if (UpdateDataManager.MakeInsertData(newEquipment, dtNow, dataManager, out strErrorMessage) == false)
                            return false;
                    }
                }
                else
                    datas.RemoveAt(index);
            }

            strErrorMessage = null;
            return true;
        }

        private Dictionary<int, int> GetZoneSiteID(Dictionary<string, FirstAidEquipmentType> dicEquipmentTypes, RequestUpdatePOIPositions request, out string strErrorMessage)
        {
            Dictionary<int, int> dicZoneSiteIDs = new Dictionary<int, int>();

            int nDataCount = request.Datas.Count;

            for (int i = nDataCount - 1; i >= 0; i--)
            {
                RequestUpdatePOIPosition data = request.Datas[i];

                if (data.SensorID < 0)
                {
                    FirstAidEquipmentType equipmentType;

                    if (dicEquipmentTypes.TryGetValue(data.SensorType, out equipmentType))
                    {
                        dicZoneSiteIDs[data.ZoneID] = -1;
                    }
                }
            }

            strErrorMessage = null;

            if (dicZoneSiteIDs.Count == 0)
                return dicZoneSiteIDs;

            string strZoneIDs = "";

            foreach (int zoneID in dicZoneSiteIDs.Keys)
            {
                if (strZoneIDs.Length == 0)
                    strZoneIDs = zoneID.ToString();
                else
                    strZoneIDs += "," + zoneID.ToString();
            }

            string strConditions = string.Format("{0} in ({1})", SDMS.Model.Spatial.Zone.Fields.ID, strZoneIDs);
            List<SDMS.Model.Spatial.Zone> zones = m_sdmsDataManager.GetSelectManager().SelectZones(null, strConditions, out strErrorMessage);

            if (zones == null)
                return null;

            foreach (var zone in zones)
            {
                dicZoneSiteIDs[zone.ID] = zone.SiteID;
            }

            return dicZoneSiteIDs;
        }
    }
}
