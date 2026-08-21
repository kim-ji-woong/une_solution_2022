using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.Account;
using VDS.Model.ItemData;
using VDS.Model.Sensor;

namespace VDS.BLL
{
    using Models.Request;
    using Models.Response;
    using Models.Container;

    public class SaveManager
    {
        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        public SaveManager(ProcessManager processManager, IDataManager dataManager)
        {
            m_processManager = processManager;
            m_dataManager = dataManager;
        }

        public ResponseOption SaveAccountOption(Option option)
        {
            string strErrorMessage = null;
            Option result = null;

            if (option.ID <= 0)
            {
                int? id = GetAccountOptionID(option, out strErrorMessage);

                if (id == null && strErrorMessage != null)
                {
                    ResponseOption response = new ResponseOption();
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }
            }

            if (option.ID <= 0)
            {
                // 없으면 생성
                result = m_dataManager.GetCreateManager().CreateAccountOption(option, out strErrorMessage);

                if (strErrorMessage != null)
                    strErrorMessage = "계정별 옵션정보를 시스템 데이터베이스에 저장하는데 실패하였습니다.";
            }
            else
            {
                // 있으면 업데이트
                m_dataManager.GetUpdateManager().UpdateAccountOption(option, out strErrorMessage);
                result = m_dataManager.GetSelectManager().SelectAccountOption(option.ID, out strErrorMessage);

                if (strErrorMessage != null)
                    strErrorMessage = "계정별 옵션정보를 시스템 데이터베이스에 저장하지 못하였습니다.";
            }

            ResponseOption res = new ResponseOption();
            if (result == null)
            {
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                res.Success = true;
                if (res.Options == null)
                    res.Options = new List<Option>();
                res.Options.Add(result);
            }

            return res;
        }

        private int? GetAccountOptionID(Option option, out string strErrorMessage)
        {
            Dictionary<Option.Fields, object> dicConditions = new Dictionary<Option.Fields, object>();
            dicConditions[Option.Fields.UserID] = option.UserID;
            dicConditions[Option.Fields.Category] = option.Category;
            dicConditions[Option.Fields.SubCategory] = option.SubCategory;

            List<Option> options = m_dataManager.GetSelectManager().SelectAccountOptions(dicConditions, null, out strErrorMessage);

            if (strErrorMessage != null)
                strErrorMessage = "계정별 옵션정보를 시스템 데이터베이스로부터 조회하는데 실패하였습니다.";

            if (options == null || options.Count == 0)
                return null;

            option.ID = options[0].ID;
            return option.ID;
        }

        public MessageResult SaveViewport(RequestSaveViewport data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new MessageResult(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new MessageResult(false, "허가되지 않은 VDC의 정보를 수정할 수 없습니다.");

            Model.DataCenter.Viewport viewport = m_dataManager.GetSelectManager().SelectDataCenterViewport(data.DataCenterID, out strErrorMessage);

            if (viewport == null)
            {
                if (strErrorMessage != null)
                {
                    strErrorMessage = "VDC의 3D Viewport 정보를 시스템 데이터베이스로부터 조회하는데 실패하였습니다.";
                    return new MessageResult(false, strErrorMessage);
                }

                viewport = new Model.DataCenter.Viewport();
                viewport.DataCenterID = data.DataCenterID;
                viewport.PositionX = data.PositionX;
                viewport.PositionY = data.PositionY;
                viewport.PositionZ = data.PositionZ;
                viewport.RotationX = data.RotationX;
                viewport.RotationY = data.RotationY;
                viewport.RotationZ = data.RotationZ;

                if (m_dataManager.GetCreateManager().CreateDataCenterViewport(viewport, out strErrorMessage) == null)
                {
                    strErrorMessage = "VDC의 3D Viewport 정보를 시스템 데이터베이스에 입력하지 못하였습니다.";
                    return new MessageResult(false, strErrorMessage);
                }
            }
            else
            {
                viewport.PositionX = data.PositionX;
                viewport.PositionY = data.PositionY;
                viewport.PositionZ = data.PositionZ;
                viewport.RotationX = data.RotationX;
                viewport.RotationY = data.RotationY;
                viewport.RotationZ = data.RotationZ;

                if (m_dataManager.GetUpdateManager().UpdateDataCenterViewport(viewport, out strErrorMessage) == false)
                {
                    strErrorMessage = "VDC의 3D Viewport 정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                    return new MessageResult(false, strErrorMessage);
                }
            }

            return new MessageResult(true, "");
        }

        public MessageResult UpdateEditData(UpdateEditData data, int userID)
        {
            string strErrorMessage = null;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new MessageResult(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new MessageResult(false, "수정할 권한이 없는 VDC의 데이터를 수정하려고 시도하였습니다.");

            if (m_dataManager.BeginTransaction() == false)
                return new MessageResult(false, "DB Transaction을 시작할 수 없습니다.");

            foreach (RackGroup rackGroup in data.AddRackGroups)
            {
                rackGroup.CenterID = data.DataCenterID;
            }

            foreach (Rack rack in data.AddRacks)
            {
                rack.CenterID = data.DataCenterID;
            }

            foreach (Rack rack in data.UpdateRacks)
            {
                rack.CenterID = data.DataCenterID;
            }

            foreach (RackItems rackItems in data.AddRackItems)
            {
                foreach (RackItem item in rackItems.Items)
                {
                    item.CenterID = data.DataCenterID;
                }
            }

            foreach (RackItems rackItems in data.UpdateRackItems)
            {
                foreach (RackItem item in rackItems.Items)
                {
                    item.CenterID = data.DataCenterID;
                }
            }

            foreach (Facility facility in data.AddFacilities)
            {
                facility.DataCenterID = data.DataCenterID;
            }

            foreach (Facility facility in data.UpdateFacilities)
            {
                facility.DataCenterID = data.DataCenterID;
            }

            //Dictionary<int, SensorType> dicSensorTypes = null;

            foreach (Sensor sensor in data.AddSensors)
            {
                /*if (dicSensorTypes == null)
                {
                    List<SensorType> sensorTypes = m_dataManager.GetSelectManager().SelectSensorTypes(null, null, out strErrorMessage);

                    if (sensorTypes == null)
                        return new MessageResult(false, strErrorMessage);

                    dicSensorTypes = new Dictionary<int, SensorType>();

                    foreach (SensorType sensorType in sensorTypes)
                    {
                        dicSensorTypes[sensorType.ID] = sensorType;
                    }
                }*/

                sensor.CenterID = data.DataCenterID;
                //SensorTypeEx.SetSensorDefaultStatus(sensor, dicSensorTypes);
            }

            foreach (Sensor sensor in data.UpdateSensors)
            {
                sensor.CenterID = data.DataCenterID;
            }

            if (AddRackGroups(data.AddRackGroups, data.AddRacks, data.UpdateRacks, ref strErrorMessage) == false)
            {
                strErrorMessage = "RackGroup 정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveRacks(data.RemoveRacks, data.DataCenterID, ref strErrorMessage) == false)
            {
                strErrorMessage = "Rack 정보를 시스템 데이터베이스에서 삭제하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (AddRacks(data.AddRacks, data.UpdateRacks, data.AddRackItems, data.UpdateRackItems, ref strErrorMessage) == false)
            {
                strErrorMessage = "Rack 정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateRacks(data.UpdateRacks, ref strErrorMessage) == false)
            {
                strErrorMessage = "변경된 Rack 정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveRackItems(data.RemoveRackItems, data.DataCenterID, ref strErrorMessage) == false)
            {
                strErrorMessage = "IT 자산 정보를 시스템 데이터베이스에서 삭제하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (AddRackItems(data.AddRackItems, data.AddLinkedItems, ref strErrorMessage) == false)
            {
                strErrorMessage = "IT 자산 정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateRackItems(data.UpdateRackItems, ref strErrorMessage) == false)
            {
                strErrorMessage = "변경된 IT 자산 정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveLinkedItems(data.DataCenterID, data.RemoveLinkedItems, ref strErrorMessage) == false)
            {
                strErrorMessage = "IT 자산 정보들간의 연결정보를 시스템 데이터베이스에서 삭제하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (AddLinkedItems(data.DataCenterID, data.AddLinkedItems, ref strErrorMessage) == false)
            {
                strErrorMessage = "IT 자산 정보들간의 연결정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveFacilities(data.RemoveFacilities, data.DataCenterID, ref strErrorMessage) == false)
            {
                strErrorMessage = "설비정보를 시스템 데이터베이스에서 삭제하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (AddFacilities(data.AddFacilities, ref strErrorMessage) == false)
            {
                strErrorMessage = "설비정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateFacilities(data.UpdateFacilities, ref strErrorMessage) == false)
            {
                strErrorMessage = "변경된 설비정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (RemoveSensors(data.RemoveSensors, data.DataCenterID, ref strErrorMessage) == false)
            {
                strErrorMessage = "FMS 센서정보를 시스템 데이터베이스에서 삭제하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (AddSensors(data.AddSensors, ref strErrorMessage) == false)
            {
                strErrorMessage = "FMS 센서정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateSensors(data.UpdateSensors, ref strErrorMessage) == false)
            {
                strErrorMessage = "변경된 FMS 센서정보를 시스템 데이터베이스에 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (m_dataManager.Commit() == false)
                return new MessageResult(false, "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.");

            return new MessageResult(true, "");
        }

        private bool UpdateSensors(List<Sensor> sensors, ref string strErrorMessage)
        {
            if (sensors == null)
                return true;

            foreach (Sensor sensor in sensors)
            {
                if (m_dataManager.GetUpdateManager().UpdateSensor(sensor, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool AddSensors(List<Sensor> sensors, ref string strErrorMessage)
        {
            if (sensors == null)
                return true;

            foreach (Sensor sensor in sensors)
            {
                if (m_dataManager.GetCreateManager().CreateSensor(sensor, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool RemoveSensors(List<Sensor> sensors, int dataCenterID, ref string strErrorMessage)
        {
            if (sensors == null)
                return true;

            string strIDs = "";

            foreach (Sensor sensor in sensors)
            {
                strIDs += "," + sensor.ID.ToString();
            }

            if (strIDs.Length > 0)
            {
                strIDs = strIDs.Substring(1);

                bool isNullable;
                string strCondition = string.Format("{0} in ({1}) and {2} = {3}",
                    Sensor.GetFieldName(Sensor.Fields.ID, out isNullable),
                    strIDs,
                    Sensor.GetFieldName(Sensor.Fields.CenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetDeleteManager().DeleteSensor(null, strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool UpdateFacilities(List<Facility> facilities, ref string strErrorMessage)
        {
            if (facilities == null)
                return true;

            foreach (Facility facility in facilities)
            {
                if (m_dataManager.GetUpdateManager().UpdateFacility(facility, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool AddFacilities(List<Facility> facilities, ref string strErrorMessage)
        {
            if (facilities == null)
                return true;

            foreach (Facility facility in facilities)
            {
                if (m_dataManager.GetCreateManager().CreateFacility(facility, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool RemoveFacilities(List<Facility> facilities, int dataCenterID, ref string strErrorMessage)
        {
            if (facilities == null)
                return true;

            string strIDs = "";

            foreach (Facility facility in facilities)
            {
                strIDs += "," + facility.ID.ToString();
            }

            if (strIDs.Length > 0)
            {
                strIDs = strIDs.Substring(1);

                bool isNullable;
                string strCondition = string.Format("{0} in ({1}) and {2} = {3}",
                    Facility.GetFieldName(Facility.Fields.ID, out isNullable),
                    strIDs,
                    Facility.GetFieldName(Facility.Fields.DataCenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetDeleteManager().DeleteFacility(null, strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool AddRackGroups(List<RackGroup> addRackGroups, List<Rack> addRacks, List<Rack> updateRacks, ref string strErrorMessage)
        {
            Dictionary<int, int> dicRackGroupIDs = new Dictionary<int, int>();

            foreach (RackGroup rackGroup in addRackGroups)
            {
                RackGroup _rackGroup = m_dataManager.GetCreateManager().CreateRackGroup(rackGroup, out strErrorMessage);

                if (_rackGroup == null)
                    return false;

                dicRackGroupIDs[rackGroup.ID] = _rackGroup.ID;
            }

            foreach (Rack rack in addRacks)
            {
                if (rack.RackGroupID != null && rack.RackGroupID < 0)
                {
                    int newRackGroupID;

                    if (dicRackGroupIDs.TryGetValue((int)rack.RackGroupID, out newRackGroupID))
                        rack.RackGroupID = newRackGroupID;
                }
            }

            foreach (Rack rack in updateRacks)
            {
                if (rack.RackGroupID != null && rack.RackGroupID < 0)
                {
                    int newRackGroupID;

                    if (dicRackGroupIDs.TryGetValue((int)rack.RackGroupID, out newRackGroupID))
                        rack.RackGroupID = newRackGroupID;
                }
            }

            return true;
        }

        private bool UpdateRacks(List<Rack> updateRacks, ref string strErrorMessage)
        {
            Dictionary<Rack.Fields, object> dicConditions = new Dictionary<Rack.Fields, object>();
            Dictionary<Rack.Fields, object> dicSets = new Dictionary<Rack.Fields, object>();

            foreach (Rack rack in updateRacks)
            {
                dicConditions[Rack.Fields.ID] = rack.ID;

                if (rack.RackGroupID != null && rack.RackGroupID < 0)
                    rack.RackGroupID = null;

                dicSets[Rack.Fields.RackGroupID] = rack.RackGroupID;
                dicSets[Rack.Fields.Rotation] = rack.Rotation;
                dicSets[Rack.Fields.X] = rack.X;
                dicSets[Rack.Fields.Y] = rack.Y;
                dicSets[Rack.Fields.Name] = rack.Name;

                if (m_dataManager.GetUpdateManager().UpdateRack(dicSets, dicConditions, null, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool AddRacks(List<Rack> addRacks, List<Rack> updateRacks, List<RackItems> addRackItems, List<RackItems> updateRackItems, ref string strErrorMessage)
        {
            Dictionary<int, Rack> dicMoveRacks = new Dictionary<int, Rack>();
            Dictionary<int, RackItems> dicAddRackItems = new Dictionary<int, RackItems>();
            Dictionary<int, RackItems> dicUpdateRackItems = new Dictionary<int, RackItems>();

            foreach (Rack rack in updateRacks)
            {
                dicMoveRacks[rack.ID] = rack;
            }

            foreach (RackItems rackItem in addRackItems)
            {
                dicAddRackItems[rackItem.RackID] = rackItem;
            }

            foreach (RackItems rackItem in updateRackItems)
            {
                dicUpdateRackItems[rackItem.RackID] = rackItem;
            }

            foreach (Rack rack in addRacks)
            {
                if (rack.RackGroupID != null && rack.RackGroupID < 0)
                    rack.RackGroupID = null;

                Rack newRack = m_dataManager.GetCreateManager().CreateRack(rack, out strErrorMessage);

                if (newRack == null)
                    return false;

                if (rack.ID < 0)
                {
                    Rack moveRack;
                    RackItems rackItems;

                    if (dicMoveRacks.TryGetValue(rack.ID, out moveRack))
                        moveRack.ID = newRack.ID;

                    if (dicAddRackItems.TryGetValue(rack.ID, out rackItems))
                    {
                        rackItems.RackID = newRack.ID;

                        foreach (RackItem item in rackItems.Items)
                        {
                            item.CenterID = rack.CenterID;
                            item.RackID = newRack.ID;
                        }
                    }

                    if (dicUpdateRackItems.TryGetValue(rack.ID, out rackItems))
                    {
                        rackItems.RackID = newRack.ID;

                        foreach (RackItem item in rackItems.Items)
                        {
                            item.CenterID = rack.CenterID;
                            item.RackID = newRack.ID;
                        }
                    }
                }
            }

            return true;
        }

        private bool RemoveRacks(List<Rack> removeRacks, int dataCenterID, ref string strErrorMessage)
        {
            string strIDs = "";

            foreach (Rack rack in removeRacks)
            {
                if (strIDs.Length == 0)
                    strIDs = rack.ID.ToString();
                else
                    strIDs += ", " + rack.ID.ToString();
            }

            if (strIDs.Length > 0)
            {
                bool isNullable;
                string strSubQuery = string.Format("select {0}.{2} from {0}, {1} where {0}.{2} = {1}.{3} and {1}.{4} in ({5})",
                    Item.TableName,
                    Item_RU.TableName,
                    Item.GetFieldName(Item.Fields.ID, out isNullable),
                    Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable),
                    Item_RU.GetFieldName(Item_RU.Fields.RackID, out isNullable),
                    strIDs);

                string strCondition = string.Format("{0} in ({1}) and {2} = {3}",
                    Item.GetFieldName(Item.Fields.ID, out isNullable),
                    strSubQuery,
                    Item.GetFieldName(Item.Fields.CenterID, out isNullable),
                    dataCenterID);

                Dictionary<Item.Fields, object> dicSets = new Dictionary<Item.Fields, object>();
                dicSets[Item.Fields.Status] = 0;

                if (m_dataManager.GetUpdateManager().UpdateItem(dicSets, null, strCondition, out strErrorMessage) == false)
                    return false;

                string strCondition2 = string.Format("{0} in (Select {1} from {2} where {1} in ({3}) and {4} = {5}) ",
                    Item_RU.GetFieldName(Item_RU.Fields.RackID, out isNullable),
                    Rack.GetFieldName(Rack.Fields.ID, out isNullable),
                    Rack.TableName,
                    strIDs,
                    Rack.GetFieldName(Rack.Fields.CenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetDeleteManager().DeleteItem_RU(null, strCondition2, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("({0} in ({2}) or {1} in ({2})) and {3} = {4}",
                    LinkedItem.GetFieldName(LinkedItem.Fields.ItemID, out isNullable),
                    LinkedItem.GetFieldName(LinkedItem.Fields.LinkedItemID, out isNullable),
                    strSubQuery,
                    LinkedItem.GetFieldName(LinkedItem.Fields.CenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetDeleteManager().DeleteLinkedItem(null, strCondition, out strErrorMessage) == false)
                    return false;

                // Item은 삭제하지 않는다.
                /*strCondition = string.Format("{0} in ({1})", ItemServer.GetFieldName(ItemServer.Fields.BoxID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteItemServer(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Backup.GetFieldName(Backup.Fields.BackupID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteBackup(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Box.GetFieldName(Box.Fields.BoxID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteBox(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Etc.GetFieldName(Etc.Fields.EtcID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteEtc(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Network.GetFieldName(Network.Fields.NetworkID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteNetwork(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", SanSwitch.GetFieldName(SanSwitch.Fields.SwitchID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteSanSwitch(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Security.GetFieldName(Security.Fields.SecurityID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteSecurity(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Storage.GetFieldName(Storage.Fields.StorageID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteStorage(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Item.GetFieldName(Item.Fields.ID, out isNullable), strSubQuery);

                if (m_dataManager.GetDeleteManager().DeleteItem(null, strCondition, out strErrorMessage) == false)
                    return false;*/

                strCondition = string.Format("{0} in ({1}) and {2} = {3}",
                    Rack.GetFieldName(Rack.Fields.ID, out isNullable),
                    strIDs,
                    Rack.GetFieldName(Rack.Fields.CenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetDeleteManager().DeleteRack(null, strCondition, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool AddLinkedItems(int nDataCenterID, List<LinkedIdData> addLinkedItems, ref string strErrorMessage)
        {
            foreach (LinkedIdData linkedData in addLinkedItems)
            {
                LinkedItem linkedItem = new LinkedItem();
                linkedItem.CenterID = nDataCenterID;

                foreach (int id in linkedData.LinkedIDs)
                {
                    linkedItem.ItemID = linkedData.Id;
                    linkedItem.LinkedItemID = id;

                    if (m_dataManager.GetCreateManager().CreateLinkedItem(linkedItem, out strErrorMessage) == null)
                    {
                        return false;
                    }

                    linkedItem.LinkedItemID = linkedData.Id;
                    linkedItem.ItemID = id;

                    if (m_dataManager.GetCreateManager().CreateLinkedItem(linkedItem, out strErrorMessage) == null)
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        private bool RemoveLinkedItems(int nDataCenterID, List<LinkedIdData> removeLinkedItems, ref string strErrorMessage)
        {
            bool isNullable;
            string strConditions = string.Format("{0} = {1}", LinkedItem.GetFieldName(LinkedItem.Fields.CenterID, out isNullable), nDataCenterID);
            string strCondition2 = "";

            string strItemIDField = LinkedItem.GetFieldName(LinkedItem.Fields.ItemID, out isNullable);
            string strLinkedItemIDField = LinkedItem.GetFieldName(LinkedItem.Fields.LinkedItemID, out isNullable);

            foreach (LinkedIdData linkedData in removeLinkedItems)
            {
                foreach (int id in linkedData.LinkedIDs)
                {
                    string str = string.Format("({0} = {1} and {2} = {3}) or ({0} = {3} and {2} = {1}) ", strItemIDField, linkedData.Id, strLinkedItemIDField, id);

                    if (strCondition2.Length == 0)
                        strCondition2 = str;
                    else
                        strCondition2 += "or " + str;
                }
            }

            if (strCondition2.Length > 0)
            {
                strConditions += " and (" + strCondition2 + ")";

                if (m_dataManager.GetDeleteManager().DeleteLinkedItem(null, strConditions, out strErrorMessage) == false)
                {
                    return false;
                }
            }

            return true;
        }

        private bool AddRackItems(List<RackItems> addRackItems, List<LinkedIdData> addLinkedItems, ref string strErrorMessage)
        {
            Dictionary<int, int> dicItemIDs = new Dictionary<int, int>();

            foreach (RackItems items in addRackItems)
            {
                foreach (RackItem item in items.Items)
                {
                    Item newItem = m_dataManager.GetCreateManager().CreateItem(item, out strErrorMessage);

                    if (newItem == null)
                        return false;
                    else
                    {
                        dicItemIDs[item.ID] = newItem.ID;

                        Item_RU itemRU = new Item_RU();
                        itemRU.ItemID = newItem.ID;
                        itemRU.RackID = item.RackID;
                        itemRU.UPos = item.UPos;

                        if (m_dataManager.GetCreateManager().CreateItem_RU(itemRU, out strErrorMessage) == null)
                            return false;
                    }
                }
            }

            int id;

            foreach (LinkedIdData data in addLinkedItems)
            {
                if (data.Id < 0)
                {
                    if (dicItemIDs.TryGetValue(data.Id, out id))
                    {
                        data.Id = id;
                    }
                }

                for (int i = data.LinkedIDs.Count-1;i>=0;i--)
                {
                    int linkedID = data.LinkedIDs[i];

                    if (linkedID < 0)
                    {
                        if (dicItemIDs.TryGetValue(linkedID, out id))
                        {
                            data.LinkedIDs[i] = id;
                        }
                    }
                }
            }

            return true;
        }

        private bool UpdateRackItems(List<RackItems>  updateRackItems, ref string strErrorMessage)
        {
            foreach (RackItems items in updateRackItems)
            {
                foreach (RackItem item in items.Items)
                {
                    if (m_dataManager.GetUpdateManager().UpdateItem(item, out strErrorMessage) == false)
                        return false;

                    Item_RU itemRU = new Item_RU();
                    itemRU.RackID = item.RackID;
                    itemRU.ItemID = item.ID;
                    itemRU.UPos = item.UPos;

                    if (m_dataManager.GetUpdateManager().UpdateItem_RU(itemRU, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool RemoveRackItems(List<RackItems> rackItems, int dataCenterID, ref string strErrorMessage)
        {
            string strIDs = "";

            foreach (RackItems items in rackItems)
            {
                foreach (RackItem item in items.Items)
                {
                    if (strIDs.Length == 0)
                        strIDs = item.ID.ToString();
                    else
                        strIDs += ", " + item.ID.ToString();
                }
            }

            if (strIDs.Length > 0)
            {
                bool isNullable;
                string strCondition = string.Format("({0} in ({2}) or {1} in ({2})) and {3} = {4}",
                    LinkedItem.GetFieldName(LinkedItem.Fields.ItemID, out isNullable),
                    LinkedItem.GetFieldName(LinkedItem.Fields.LinkedItemID, out isNullable),
                    strIDs,
                    LinkedItem.GetFieldName(LinkedItem.Fields.CenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetDeleteManager().DeleteLinkedItem(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in (Select {1} from {2} where {1} in ({3}) and {4} = {5})",
                    Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable),
                    Item.GetFieldName(Item.Fields.ID, out isNullable),
                    Item.TableName,
                    strIDs,
                    Item.GetFieldName(Item.Fields.CenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetDeleteManager().DeleteItem_RU(null, strCondition, out strErrorMessage) == false)
                    return false;

                // RU 테이블만 삭제한다.
                // 대신 Item의 상태는 유휴로 바꾼다.
                Dictionary<Item.Fields, object> dicSets = new Dictionary<Item.Fields, object>();
                dicSets[Item.Fields.Status] = 0;

                strCondition = string.Format("{0} in ({1}) and {2} = {3}",
                    Item.GetFieldName(Item.Fields.ID, out isNullable),
                    strIDs,
                    Item.GetFieldName(Item.Fields.CenterID, out isNullable),
                    dataCenterID);

                if (m_dataManager.GetUpdateManager().UpdateItem(dicSets, null, strCondition, out strErrorMessage) == false)
                    return false;
                /*strCondition = string.Format("{0} in ({1})", ItemServer.GetFieldName(ItemServer.Fields.BoxID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteItemServer(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Backup.GetFieldName(Backup.Fields.BackupID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteBackup(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Box.GetFieldName(Box.Fields.BoxID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteBox(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Etc.GetFieldName(Etc.Fields.EtcID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteEtc(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Network.GetFieldName(Network.Fields.NetworkID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteNetwork(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", SanSwitch.GetFieldName(SanSwitch.Fields.SwitchID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteSanSwitch(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Security.GetFieldName(Security.Fields.SecurityID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteSecurity(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Storage.GetFieldName(Storage.Fields.StorageID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteStorage(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteItem_RU(null, strCondition, out strErrorMessage) == false)
                    return false;

                strCondition = string.Format("{0} in ({1})", Item.GetFieldName(Item.Fields.ID, out isNullable), strIDs);

                if (m_dataManager.GetDeleteManager().DeleteItem(null, strCondition, out strErrorMessage) == false)
                    return false;*/
            }

            return true;
        }

        public MessageResult SavetItemDetails(RequesSavetItemDetails data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new MessageResult(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new MessageResult(false, "허가되지 않은 VDC의 정보를 수정할 수 없습니다.");

            MessageResult result = null;

            if (data.DataCenterID == -1 || data.ItemType == -1)
            {
                result.Message = "SavetItemDetails Error: DataCenterID 또는 ItemType 정보가 잘못되었습니다.";
                result.Success = false;
                return result;
            }

            result = new MessageResult();

            /*Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
            dicConditions[Item.Fields.CenterID] = data.DataCenterID;

            List<Item> items = m_dataManager.GetSelectManager().SelectItems(dicConditions, null, out strErrorMessage);
            if (items == null)
            {
                result.Message = "2. SavetItemDetails Error: " + strErrorMessage;
                result.Success = false;
                return result;
            }

            string strItemIDs = "";

            foreach (Item item in items)
            {
                if (strItemIDs == "")
                    strItemIDs = item.ID.ToString();
                else
                    strItemIDs += "," + item.ID.ToString();
            }*/

            Dictionary<string, string> dicDuplicate = new Dictionary<string, string>();

            if (m_dataManager.BeginTransaction() == false)
                return new MessageResult(false, "DB Transaction을 시작할 수 없습니다.");

            if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.Server)
            {
                Dictionary<ItemServer.Fields, object> dicConditions = new Dictionary<ItemServer.Fields, object>();
                dicConditions[ItemServer.Fields.DataCenterID] = data.DataCenterID;
                //string strAdditionalConditions = string.Format("{0} in ({1})", ItemServer.Fields.BoxID, strItemIDs);

                List<ItemServer> itemServers = m_dataManager.GetSelectManager().SelectItemServers(dicConditions, null, out strErrorMessage);
                if (itemServers == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 서버 정보를 조회하는데 실패하였습니다.";
                    m_dataManager.Rollback();

                    result.Message = strErrorMessage;
                    result.Success = false;
                    return result;
                }

                Dictionary<string, ItemServer> dicServers = new Dictionary<string, ItemServer>();

                foreach (ItemServer server in itemServers)
                {
                    dicServers[server.DataCenterID + server.Basic_ServerName] = server;
                }

                /*Dictionary<string, ItemServer> dicServers = new Dictionary<string, ItemServer>();

                foreach (ItemServer server in itemServers)
                {
                    dicServers[server.BoxName] = server;
                }

                // 제거된 목록 만들기 - itemServers
                foreach (ItemServer server in data.ItemServers)
                {
                    if (dicServers.ContainsKey(server.BoxName))
                    {
                        itemServers.Remove(server);
                    }
                }*/

                Dictionary<Box.Fields, object> dicConditions2 = new Dictionary<Box.Fields, object>();
                dicConditions2[Box.Fields.DataCenterID] = data.DataCenterID;
                List<Box> boxes = m_dataManager.GetSelectManager().SelectBoxes(dicConditions2, null, out strErrorMessage);

                if (boxes == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 박스 정보를 조회하는데 실패하였습니다.";
                    m_dataManager.Rollback();

                    result.Message = strErrorMessage;
                    result.Success = false;
                    return result;
                }

                Dictionary<string, Box> dicBoxes = new Dictionary<string, Box>();

                foreach (Box box in boxes)
                {
                    dicBoxes[box.Basic_Name] = box;
                }

                // 기존 데이터는 업데이트
                foreach (ItemServer server in data.ItemServers)
                {
                    Box box;

                    if (server.BoxName != null && dicBoxes.TryGetValue(server.BoxName, out box))
                        server.BoxID = box.BoxID;
                    else
                        server.BoxID = null;

                    string key = server.DataCenterID + server.Basic_ServerName;
                    MessageResult _result = CheckDuplicate(dicDuplicate, key, server.Basic_ServerName, ref strErrorMessage);

                    if (_result != null)
                        return _result;

                    if (dicServers.ContainsKey(key))
                    {
                        if (m_dataManager.GetUpdateManager().UpdateItemServer(server, out strErrorMessage) == false)
                        {
                            strErrorMessage = "시스템 데이터베이스에서 서버 정보를 업데이트하는데 실패하였습니다.";
                            m_dataManager.Rollback();

                            result.Message = strErrorMessage;
                            result.Success = false;
                            return result;
                        }
                    }
                    else
                    {
                        if (m_dataManager.GetCreateManager().CreateItemServer(server, out strErrorMessage) == null)
                        {
                            strErrorMessage = "시스템 데이터베이스에 새로운 서버 정보를 입력하는데 실패하였습니다.";
                            m_dataManager.Rollback();

                            result.Message = strErrorMessage;
                            result.Success = false;
                            return result;
                        }
                    }
                }

                // 제거된 데이터 삭제
                /*if (itemServers.Count > 0)
                {
                    foreach (ItemServer server in itemServers)
                    {
                        if (m_dataManager.GetDeleteManager().DeleteItemServer(server.Basic_ServerName, server.DataCenterID, out strErrorMessage) == false)
                        {
                            m_dataManager.Rollback();

                            result.Message = strErrorMessage;
                            result.Success = false;
                            return result;
                        }
                    }
                }*/
            }
            else
            {
                Dictionary<Item.Fields, object> dicItemConditions = new Dictionary<Item.Fields, object>();
                dicItemConditions[Item.Fields.CenterID] = data.DataCenterID;

                List<Item> items = m_dataManager.GetSelectManager().SelectItems(dicItemConditions, null, out strErrorMessage);

                if (items == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 IT 자산 정보를 조회하는데 실패하였습니다.";
                    m_dataManager.Rollback();

                    result.Message = strErrorMessage;
                    result.Success = false;
                    return result;
                }

                Dictionary<string, Item> dicItems = new Dictionary<string, Item>();

                foreach (Item item in items)
                {
                    dicItems[item.Name] = item;
                }

                if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.Box)
                {
                    Dictionary<Box.Fields, object> dicConditions = new Dictionary<Box.Fields, object>();
                    dicConditions[Box.Fields.DataCenterID] = data.DataCenterID;
                    //string strAdditionalConditions = string.Format("{0} in ({1})", Box.Fields.BoxID, strItemIDs);

                    List<Box> boxes = m_dataManager.GetSelectManager().SelectBoxes(dicConditions, null, out strErrorMessage);
                    if (boxes == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에서 박스 정보를 조회하지 못하였습니다.";
                        m_dataManager.Rollback();

                        result.Message = strErrorMessage;
                        result.Success = false;
                        return result;
                    }

                    Dictionary<string, Box> dicBoxes = new Dictionary<string, Box>();

                    foreach (Box box in boxes)
                    {
                        dicBoxes[box.DataCenterID + box.Basic_Name] = box;
                    }

                    /*Dictionary<string, Box> dicBoxes = new Dictionary<string, Box>();

                    foreach (Box box in boxes)
                    {
                        dicBoxes[box.Basic_Name] = box;
                    }

                    // 제거된 목록 만들기 - boxes
                    foreach (Box box in data.Boxs)
                    {
                        if (dicBoxes.ContainsKey(box.Basic_Name))
                        {
                            boxes.Remove(box);
                        }
                    }*/

                    // 기존 데이터는 업데이트
                    foreach (Box box in data.Boxs)
                    {
                        Item item;

                        if (dicItems.TryGetValue(box.Basic_Name, out item))
                            box.BoxID = item.ID;
                        else
                            box.BoxID = null;

                        string key = box.DataCenterID + box.Basic_Name;
                        MessageResult _result = CheckDuplicate(dicDuplicate, key, box.Basic_Name, ref strErrorMessage);

                        if (_result != null)
                            return _result;

                        if (dicBoxes.ContainsKey(key))
                        {
                            if (m_dataManager.GetUpdateManager().UpdateBox(box, out strErrorMessage) == false)
                            {
                                strErrorMessage = "시스템 데이터베이스에서 박스 정보를 업데이트하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                        else
                        {
                            if (m_dataManager.GetCreateManager().CreateBox(box, out strErrorMessage) == null)
                            {
                                strErrorMessage = "시스템 데이터베이스에 새로운 박스 정보를 입력하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }

                    // 제거된 데이터 삭제
                    /*if (boxes.Count > 0)
                    {
                        foreach (Box box in boxes)
                        {
                            if (m_dataManager.GetDeleteManager().DeleteBox(box.Basic_Name, box.DataCenterID, out strErrorMessage) == false)
                            {
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }*/
                }
                else if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.Network)
                {
                    Dictionary<Network.Fields, object> dicConditions = new Dictionary<Network.Fields, object>();
                    dicConditions[Network.Fields.DataCenterID] = data.DataCenterID;
                    //string strAdditionalConditions = string.Format("{0} in ({1})", Network.Fields.NetworkID, strItemIDs);

                    List<Network> networks = m_dataManager.GetSelectManager().SelectNetworks(dicConditions, null, out strErrorMessage);
                    if (networks == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에서 네트웍 정보를 조회하는데 실패하였습니다.";
                        m_dataManager.Rollback();

                        result.Message = strErrorMessage;
                        result.Success = false;
                        return result;
                    }

                    Dictionary<string, Network> dicNetworks = new Dictionary<string, Network>();

                    foreach (Network network in networks)
                    {
                        dicNetworks[network.DataCenterID + network.Basic_Name] = network;
                    }

                    /*Dictionary<string, Network> dicNetworks = new Dictionary<string, Network>();

                    foreach (Network network in networks)
                    {
                        dicNetworks[network.Basic_Name] = network;
                    }

                    // 제거된 목록 만들기 - networks
                    foreach (Network network in data.Networks)
                    {
                        if (dicNetworks.ContainsKey(network.Basic_Name))
                        {
                            networks.Remove(network);
                        }
                    }*/

                    // 기존 데이터는 업데이트
                    foreach (Network network in data.Networks)
                    {
                        Item item;

                        if (dicItems.TryGetValue(network.Basic_Name, out item))
                            network.NetworkID = item.ID;
                        else
                            network.NetworkID = null;

                        string key = network.DataCenterID + network.Basic_Name;
                        MessageResult _result = CheckDuplicate(dicDuplicate, key, network.Basic_Name, ref strErrorMessage);

                        if (_result != null)
                            return _result;

                        if (dicNetworks.ContainsKey(key))
                        {
                            if (m_dataManager.GetUpdateManager().UpdateNetwork(network, out strErrorMessage) == false)
                            {
                                strErrorMessage = "시스템 데이터베이스에서 네트웍 정보를 업데이트하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                        else
                        {
                            if (m_dataManager.GetCreateManager().CreateNetwork(network, out strErrorMessage) == null)
                            {
                                strErrorMessage = "시스템 데이터베이스에 새로운 네트웍 정보를 입력하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }

                    // 제거된 데이터 삭제
                    /*if (networks.Count > 0)
                    {
                        foreach (Network network in networks)
                        {
                            if (m_dataManager.GetDeleteManager().DeleteNetwork(network.Basic_Name, network.DataCenterID, out strErrorMessage) == false)
                            {
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }*/
                }
                else if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.SanSwitch)
                {
                    Dictionary<SanSwitch.Fields, object> dicConditions = new Dictionary<SanSwitch.Fields, object>();
                    dicConditions[SanSwitch.Fields.DataCenterID] = data.DataCenterID;
                    //string strAdditionalConditions = string.Format("{0} in ({1})", SanSwitch.Fields.SwitchID, strItemIDs);

                    List<SanSwitch> sanSwitches = m_dataManager.GetSelectManager().SelectSanSwitches(dicConditions, null, out strErrorMessage);
                    if (sanSwitches == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에서 SAN 스위치 정보를 조회하는데 실패하였습니다.";
                        m_dataManager.Rollback();

                        result.Message = strErrorMessage;
                        result.Success = false;
                        return result;
                    }

                    Dictionary<string, SanSwitch> dicSwitches = new Dictionary<string, SanSwitch>();

                    foreach (SanSwitch _switch in sanSwitches)
                    {
                        dicSwitches[_switch.DataCenterID + _switch.Basic_Name] = _switch;
                    }

                    /*Dictionary<string, SanSwitch> dicSwitches = new Dictionary<string, SanSwitch>();

                    foreach (SanSwitch _switch in sanSwitches)
                    {
                        dicSwitches[_switch.Basic_Name] = _switch;
                    }

                    // 제거된 목록 만들기 - sanSwitches
                    foreach (SanSwitch sanSwitch in data.SanSwitchs)
                    {
                        if (dicSwitches.ContainsKey(sanSwitch.Basic_Name))
                        {
                            sanSwitches.Remove(sanSwitch);
                        }
                    }*/

                    // 기존 데이터는 업데이트
                    foreach (SanSwitch sanSwitch in data.SanSwitchs)
                    {
                        Item item;

                        if (dicItems.TryGetValue(sanSwitch.Basic_Name, out item))
                            sanSwitch.SwitchID = item.ID;
                        else
                            sanSwitch.SwitchID = null;

                        string key = sanSwitch.DataCenterID + sanSwitch.Basic_Name;
                        MessageResult _result = CheckDuplicate(dicDuplicate, key, sanSwitch.Basic_Name, ref strErrorMessage);

                        if (_result != null)
                            return _result;

                        if (dicSwitches.ContainsKey(key))
                        {
                            if (m_dataManager.GetUpdateManager().UpdateSanSwitch(sanSwitch, out strErrorMessage) == false)
                            {
                                strErrorMessage = "시스템 데이터베이스에서 SAN 스위치 정보를 업데이트하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                        else
                        {
                            if (m_dataManager.GetCreateManager().CreateSanSwitch(sanSwitch, out strErrorMessage) == null)
                            {
                                strErrorMessage = "시스템 데이터베이스에 새로운 SAN 스위치 정보를 입력하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }

                    // 제거된 데이터 삭제
                    /*if (sanSwitches.Count > 0)
                    {
                        foreach (SanSwitch sanSwitch in sanSwitches)
                        {
                            if (m_dataManager.GetDeleteManager().DeleteSanSwitch(sanSwitch.Basic_Name, sanSwitch.DataCenterID, out strErrorMessage) == false)
                            {
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }*/
                }
                else if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.Security)
                {
                    Dictionary<Security.Fields, object> dicConditions = new Dictionary<Security.Fields, object>();
                    dicConditions[Security.Fields.DataCenterID] = data.DataCenterID;
                    //string strAdditionalConditions = string.Format("{0} in ({1})", Security.Fields.SecurityID, strItemIDs);

                    List<Security> securities = m_dataManager.GetSelectManager().SelectSecurities(dicConditions, null, out strErrorMessage);
                    if (securities == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에서 보안 정보를 조회하는데 실패하였습니다.";
                        result.Message = strErrorMessage;
                        result.Success = false;
                        return result;
                    }

                    Dictionary<string, Security> dicSecurities = new Dictionary<string, Security>();

                    foreach (Security security in securities)
                    {
                        dicSecurities[security.DataCenterID + security.Basic_Name] = security;
                    }

                    /*Dictionary<string, Security> dicSecurities = new Dictionary<string, Security>();

                    foreach (Security security in securities)
                    {
                        dicSecurities[security.Basic_Name] = security;
                    }

                    // 제거된 목록 만들기 - securities
                    foreach (Security security in data.Securitys)
                    {
                        if (dicSecurities.ContainsKey(security.Basic_Name))
                        {
                            securities.Remove(security);
                        }
                    }*/

                    // 기존 데이터는 업데이트
                    foreach (Security security in data.Securitys)
                    {
                        Item item;

                        if (dicItems.TryGetValue(security.Basic_Name, out item))
                            security.SecurityID = item.ID;
                        else
                            security.SecurityID = null;

                        string key = security.DataCenterID + security.Basic_Name;
                        MessageResult _result = CheckDuplicate(dicDuplicate, key, security.Basic_Name, ref strErrorMessage);

                        if (_result != null)
                            return _result;

                        if (dicSecurities.ContainsKey(key))
                        {
                            if (m_dataManager.GetUpdateManager().UpdateSecurity(security, out strErrorMessage) == false)
                            {
                                strErrorMessage = "시스템 데이터베이스에서 보안 정보를 업데이트하는데 실패하였습니다.";
                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                        else
                        {
                            if (m_dataManager.GetCreateManager().CreateSecurity(security, out strErrorMessage) == null)
                            {
                                strErrorMessage = "시스템 데이터베이스에 새로운 보안 정보를 입력하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }

                    // 제거된 데이터 삭제
                    /*if (securities.Count > 0)
                    {
                        foreach (Security security in securities)
                        {
                            if (m_dataManager.GetDeleteManager().DeleteSecurity(security.Basic_Name, security.DataCenterID, out strErrorMessage) == false)
                            {
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }*/
                }
                else if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.BackUp)
                {
                    Dictionary<Backup.Fields, object> dicConditions = new Dictionary<Backup.Fields, object>();
                    dicConditions[Backup.Fields.DataCenterID] = data.DataCenterID;
                    //string strAdditionalConditions = string.Format("{0} in ({1})", Backup.Fields.BackupID, strItemIDs);

                    List<Backup> backups = m_dataManager.GetSelectManager().SelectBackups(dicConditions, null, out strErrorMessage);
                    if (backups == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에서 백업 정보를 조회하는데 실패하였습니다.";
                        m_dataManager.Rollback();

                        result.Message = strErrorMessage;
                        result.Success = false;
                        return result;
                    }

                    Dictionary<string, Backup> dicBackups = new Dictionary<string, Backup>();

                    foreach (Backup backup in backups)
                    {
                        dicBackups[backup.DataCenterID + backup.Basic_Name] = backup;
                    }

                    /*Dictionary<string, Backup> dicBackups = new Dictionary<string, Backup>();

                    foreach (Backup backup in backups)
                    {
                        dicBackups[backup.Basic_Name] = backup;
                    }

                    // 제거된 목록 만들기 - backups
                    foreach (Backup backup in data.Backups)
                    {
                        if (dicBackups.ContainsKey(backup.Basic_Name))
                        {
                            backups.Remove(backup);
                        }
                    }*/

                    // 기존 데이터는 업데이트
                    foreach (Backup backup in data.Backups)
                    {
                        Item item;

                        if (dicItems.TryGetValue(backup.Basic_Name, out item))
                            backup.BackupID = item.ID;
                        else
                            backup.BackupID = null;

                        string key = backup.DataCenterID + backup.Basic_Name;
                        MessageResult _result = CheckDuplicate(dicDuplicate, key, backup.Basic_Name, ref strErrorMessage);

                        if (_result != null)
                            return _result;

                        if (dicBackups.ContainsKey(key))
                        {
                            if (m_dataManager.GetUpdateManager().UpdateBackup(backup, out strErrorMessage) == false)
                            {
                                strErrorMessage = "시스템 데이터베이스에서 백업 정보를 업데이트하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                        else
                        {
                            if (m_dataManager.GetCreateManager().CreateBackup(backup, out strErrorMessage) == null)
                            {
                                strErrorMessage = "시스템 데이터베이스에 새로운 백업 정보를 입력하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }

                    // 제거된 데이터 삭제
                    /*if (backups.Count > 0)
                    {
                        foreach (Backup backup in backups)
                        {
                            if (m_dataManager.GetDeleteManager().DeleteSecurity(backup.Basic_Name, backup.DataCenterID, out strErrorMessage) == false)
                            {
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }*/
                }
                else if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.Storage)
                {
                    Dictionary<Storage.Fields, object> dicConditions = new Dictionary<Storage.Fields, object>();
                    dicConditions[Storage.Fields.DataCenterID] = data.DataCenterID;
                    //string strAdditionalConditions = string.Format("{0} in ({1})", Storage.Fields.StorageID, strItemIDs);

                    List<Storage> storages = m_dataManager.GetSelectManager().SelectStorages(dicConditions, null, out strErrorMessage);
                    if (storages == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에서 스토리지 정보를 조회하는데 실패하였습니다.";
                        m_dataManager.Rollback();

                        result.Message = strErrorMessage;
                        result.Success = false;
                        return result;
                    }

                    Dictionary<string, Storage> dicStroages = new Dictionary<string, Storage>();

                    foreach (Storage storage in storages)
                    {
                        dicStroages[storage.DataCenterID + storage.Basic_Name] = storage;
                    }

                    /*Dictionary<string, Storage> dicStroages = new Dictionary<string, Storage>();

                    foreach (Storage storage in storages)
                    {
                        dicStroages[storage.Basic_Name] = storage;
                    }

                    // 제거된 목록 만들기 - storages
                    foreach (Storage storage in data.Storages)
                    {
                        if (dicStroages.ContainsKey(storage.Basic_Name))
                        {
                            storages.Remove(storage);
                        }
                    }*/

                    // 기존 데이터는 업데이트
                    foreach (Storage storage in data.Storages)
                    {
                        Item item;

                        if (dicItems.TryGetValue(storage.Basic_Name, out item))
                            storage.StorageID = item.ID;
                        else
                            storage.StorageID = null;

                        string key = storage.DataCenterID + storage.Basic_Name;
                        MessageResult _result = CheckDuplicate(dicDuplicate, key, storage.Basic_Name, ref strErrorMessage);

                        if (_result != null)
                            return _result;

                        if (dicStroages.ContainsKey(key))
                        {
                            if (m_dataManager.GetUpdateManager().UpdateStorage(storage, out strErrorMessage) == false)
                            {
                                strErrorMessage = "시스템 데이터베이스에서 스토리지 정보를 업데이트하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                        else
                        {
                            if (m_dataManager.GetCreateManager().CreateStorage(storage, out strErrorMessage) == null)
                            {
                                strErrorMessage = "시스템 데이터베이스에 새로운 스토리지 정보를 입력하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }

                    // 제거된 데이터 삭제
                    /*if (storages.Count > 0)
                    {
                        foreach (Storage storage in storages)
                        {
                            if (m_dataManager.GetDeleteManager().DeleteSecurity(storage.Basic_Name, storage.DataCenterID, out strErrorMessage) == false)
                            {
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }*/
                }
                else if (data.ItemType == (int)RequesSavetItemDetails.ItemTypeID.Etc)
                {
                    Dictionary<Etc.Fields, object> dicConditions = new Dictionary<Etc.Fields, object>();
                    dicConditions[Etc.Fields.DataCenterID] = data.DataCenterID;
                    //string strAdditionalConditions = string.Format("{0} in ({1})", Etc.Fields.EtcID, strItemIDs);

                    List<Etc> etcs = m_dataManager.GetSelectManager().SelectEtcs(dicConditions, null, out strErrorMessage);
                    if (etcs == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에서 기타 IT 자산 정보를 조회하는데 실패하였습니다.";
                        m_dataManager.Rollback();

                        result.Message = strErrorMessage;
                        result.Success = false;
                        return result;
                    }

                    Dictionary<string, Etc> dicEtcs = new Dictionary<string, Etc>();

                    foreach (Etc etc in etcs)
                    {
                        dicEtcs[etc.DataCenterID + etc.Basic_Name] = etc;
                    }

                    /*Dictionary<string, Etc> dicEtcs = new Dictionary<string, Etc>();

                    foreach (Etc etc in etcs)
                    {
                        dicEtcs[etc.Basic_Name] = etc;
                    }

                    // 제거된 목록 만들기 - etcs
                    foreach (Etc etc in data.Etcs)
                    {
                        if (dicEtcs.ContainsKey(etc.Basic_Name))
                        {
                            etcs.Remove(etc);
                        }
                    }*/

                    // 기존 데이터는 업데이트
                    foreach (Etc etc in data.Etcs)
                    {
                        Item item;

                        if (dicItems.TryGetValue(etc.Basic_Name, out item))
                            etc.EtcID = item.ID;
                        else
                            etc.EtcID = null;

                        string key = etc.DataCenterID + etc.Basic_Name;
                        MessageResult _result = CheckDuplicate(dicDuplicate, key, etc.Basic_Name, ref strErrorMessage);

                        if (_result != null)
                            return _result;

                        if (dicEtcs.ContainsKey(key))
                        {
                            if (m_dataManager.GetUpdateManager().UpdateEtc(etc, out strErrorMessage) == false)
                            {
                                strErrorMessage = "시스템 데이터베이스에서 기타 IT 자산 정보를 업데이트하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                        else
                        {
                            if (m_dataManager.GetCreateManager().CreateEtc(etc, out strErrorMessage) == null)
                            {
                                strErrorMessage = "시스템 데이터베이스에 새로운 기타 IT 자산 정보를 입력하는데 실패하였습니다.";
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }

                    // 제거된 데이터 삭제
                    /*if (etcs.Count > 0)
                    {
                        foreach (Etc etc in etcs)
                        {
                            if (m_dataManager.GetDeleteManager().DeleteSecurity(etc.Basic_Name, etc.DataCenterID, out strErrorMessage) == false)
                            {
                                m_dataManager.Rollback();

                                result.Message = strErrorMessage;
                                result.Success = false;
                                return result;
                            }
                        }
                    }*/
                }
                else
                {
                    m_dataManager.Rollback();

                    result.Message = " SavetItemDetails Error: ItemType 정보가 잘못되었습니다.";
                    result.Success = false;
                    return result;
                }
            }

            if (m_dataManager.Commit() == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "Database 트랜잭션이 실패하였습니다.");
            }

            result.Success = true;
            return result;
        }

        private MessageResult CheckDuplicate(Dictionary<string, string> dicDuplicate, string key, string strTarget, ref string strErrorMessage)
        {
            if (dicDuplicate.ContainsKey(key))
            {
                strErrorMessage = string.Format("중복된 장비명이 존재합니다.({0})", strTarget);
                m_dataManager.Rollback();

                return new MessageResult(false, strErrorMessage);
            }
            else
                dicDuplicate[key] = key;

            return null;
        }

        public ResponseDataCenter AddDataCenter(RequestAddDataCenter data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseDataCenter(false, strErrorMessage);

            if (data.SiteID != siteID)
                return new ResponseDataCenter(false, "허가되지 않은 정보를 요청하였습니다.");

            if (m_dataManager.BeginTransaction() == false)
                return new ResponseDataCenter(false, "Database 트랜잭션을 시작할 수 없습니다.");

            if (data.ParentID != null)
            {
                bool overLimit = false;
                int nCloneCount = GetCloneCount(data, ref overLimit, out strErrorMessage);

                if (nCloneCount < 0)
                {
                    if (!overLimit)
                        strErrorMessage = "시스템 데이터베이스에서 복제된 VDC 개수를 조회하는데 실패하였습니다.";

                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }
            }

            bool isNullable;
            string strCondition = string.Format("{0} = {1} and {2} = {3} and ({4} = '{5}' or {6} = '{5}')",
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.NationID, out isNullable),
                data.NationID,
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.SiteID, out isNullable),
                data.SiteID,
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.Name, out isNullable),
                data.CenterName,
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.EngName, out isNullable));

            List<Model.DataCenter.DataCenter> centers = m_dataManager.GetSelectManager().SelectDataCenters(null, strCondition, out strErrorMessage);

            if (centers == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 기존 VDC 정보를 조회하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new ResponseDataCenter(false, strErrorMessage);
            }

            if (centers.Count > 0)
            {
                m_dataManager.Rollback();
                return new ResponseDataCenter(false, "이미 같은 이름을 가진 VDC가 존재합니다.");
            }

            Model.DataCenter.DataCenter dataCenter = new Model.DataCenter.DataCenter();

            dataCenter.Address = "";
            dataCenter.EngName = data.CenterName;
            dataCenter.UnitOfLength = (int)Model.DataCenter.DataCenter.UnitType.CM;
            dataCenter.Name = data.CenterName;
            dataCenter.Latitude = data.Latitude;
            dataCenter.Longitude = data.Longitude;
            dataCenter.NationID = data.NationID;
            dataCenter.RegDate = DateTime.Now;
            dataCenter.SiteID = data.SiteID;
            dataCenter.Type = data.CenterType;

            // RequestAddDataCenter의 모든 길이 단위는 mm이다.
            dataCenter.Width = (int)(data.Width / 10);
            dataCenter.Length = (int)(data.Depth / 10);
            dataCenter.Height = (int)(data.Height / 10);
            dataCenter.TileElevation = (int)(data.TileElevation / 10);
            dataCenter.TileLength = 60;
            dataCenter.TileWidth = 60;
            dataCenter.CreationType = data.CreationType;
            dataCenter.BeginGridX = data.StartX;
            dataCenter.BeginGridY = data.StartY;
            dataCenter.UTC = data.UTC;
            dataCenter.Memo = data.Memo;

            Model.DataCenter.DataCenter center = m_dataManager.GetCreateManager().CreateDataCenter(dataCenter, out strErrorMessage);

            if (center == null)
            {
                strErrorMessage = "시스템 데이터베이스에 새로운 VDC 정보를 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new ResponseDataCenter(false, strErrorMessage);
            }

            Model.DataCenter.Data dataCenterData = new Model.DataCenter.Data();
            dataCenterData.CenterID = center.ID;
            dataCenterData.IsClone = data.IsClone;
            dataCenterData.ParentID = data.ParentID;
            dataCenterData.ManagerTeam = data.ManagerTeam;
            dataCenterData.Manager = data.Manager;
            dataCenterData.Company = data.Company;

            Model.DataCenter.Data centerData = m_dataManager.GetCreateManager().CreateDataCenterData(dataCenterData, out strErrorMessage);

            if (centerData == null)
            {
                strErrorMessage = "시스템 데이터베이스에 새로 생성된 VDC의 부가정보를 입력하는데 실패하였습니다.";
                m_dataManager.Rollback();
                return new ResponseDataCenter(false, strErrorMessage);
            }

            if (data.ParentID != null)
            {
                Dictionary<int, RackGroup> dicRackGroups = CopyRackGroups(center, (int)data.ParentID, ref strErrorMessage);

                if (dicRackGroups == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 RackGroup 정보를 복제하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }

                Dictionary<int, Rack> dicRacks = CopyRacks(center, (int)data.ParentID, dicRackGroups, ref strErrorMessage);

                if (dicRacks == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 Rack 정보를 복제하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }

                Dictionary<int, Item> dicItems = CopyItems(center, (int)data.ParentID, dicRacks, ref strErrorMessage);

                if (dicItems == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 서버 정보를 조회하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }

                if (CopyLinkedItems(center, (int)data.ParentID, dicItems, ref strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 IT 자산의 연결정보를 복제하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }

                if (CopyItemDatas(center, (int)data.ParentID, dicItems, ref strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 IT 자산 정보를 복제하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }

                if (CopyFacilities(center, (int)data.ParentID, ref strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 설비 정보를 복제하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }

                if (CopySensors(center, (int)data.ParentID, ref strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 FMS 센서 정보를 복제하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }

                UserDataCenterLink dcLink = new UserDataCenterLink();
                dcLink.UserID = data.UserID;
                dcLink.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateAccountUserDataCenterLink(dcLink, out strErrorMessage) == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 복제된 VDC 정보에 대한 사용자 권한을 추가하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseDataCenter(false, strErrorMessage);
                }
            }

            if (m_dataManager.Commit() == false)
            {
                m_dataManager.Rollback();
                return new ResponseDataCenter(false, "Database 트랜잭션이 실패하였습니다.");
            }

            ResponseDataCenter response = new ResponseDataCenter(true, "");
            response.DataCenter = center;

            return response;
        }

        private int GetCloneCount(RequestAddDataCenter data, ref bool overLimit, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (data.ParentID == null)
                return 0;

            bool isNullable;
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                Model.DataCenter.Data.GetFieldName(Model.DataCenter.Data.Fields.CenterID, out isNullable),
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable),
                Model.DataCenter.DataCenter.TableName,
                Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.SiteID, out isNullable),
                data.SiteID);

            List<Model.DataCenter.Data> dataCenterDatas = m_dataManager.GetSelectManager().SelectDataCenterDatas(null, strCondition, out strErrorMessage);

            if (dataCenterDatas == null)
                return -1;

            Dictionary<int, DataCenterDataContainer> dicCenters = new Dictionary<int, DataCenterDataContainer>();
            
            foreach (Model.DataCenter.Data centerData in dataCenterDatas)
            {
                DataCenterDataContainer container = new DataCenterDataContainer();
                container.Data = centerData;
                dicCenters[centerData.CenterID] = container;
            }

            foreach (Model.DataCenter.Data centerData in dataCenterDatas)
            {
                DataCenterDataContainer container = dicCenters[centerData.CenterID];

                if (centerData.ParentID != null)
                {
                    DataCenterDataContainer parentContainer;

                    if (dicCenters.TryGetValue((int)centerData.ParentID, out parentContainer))
                    {
                        container.Parent = parentContainer;
                        parentContainer.Children.Add(container);
                    }
                }
            }

            DataCenterDataContainer baseContainer = null;
            int? parentID = data.ParentID;

            while (parentID != null)
            {
                DataCenterDataContainer container;

                if (dicCenters.TryGetValue((int)parentID, out container) == false)
                    break;

                baseContainer = container;
                parentID = container.Data.ParentID;
            }

            if (baseContainer == null)
                return 0;

            int childCount = baseContainer.GetChildCount();

            Model.DataCenter.Option option = m_dataManager.GetSelectManager().SelectDataCenterOption(Model.DataCenter.Option.VdcCopyLimit, out strErrorMessage);

            if (option == null)
            {
                if (strErrorMessage != null)
                    return -1;
                else
                    return childCount;
            }

            int limit;

            if (int.TryParse(option.PropertyValue.Trim(), out limit) == false)
                return childCount;

            if (childCount < limit)
                return childCount;

            overLimit = true;
            strErrorMessage = string.Format("더 이상 복제할 수 없습니다. 복제는 최대 {0}개까지만 가능합니다.", limit);
            return -1;
        }

        private bool CopyItemDatas(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<int, Box> dicBoxes = CopyItemDataBoxes(center, srcDataCenterID, dicItems, ref strErrorMessage);

            if (dicBoxes == null)
                return false;

            if (CopyItemDataServers(center, srcDataCenterID, dicBoxes, ref strErrorMessage) == false)
                return false;

            if (CopyItemDataBackups(center, srcDataCenterID, dicItems, ref strErrorMessage) == false)
                return false;

            if (CopyItemDataEtcs(center, srcDataCenterID, dicItems, ref strErrorMessage) == false)
                return false;

            if (CopyItemDataNetworks(center, srcDataCenterID, dicItems, ref strErrorMessage) == false)
                return false;

            if (CopyItemDataSanSwitches(center, srcDataCenterID, dicItems, ref strErrorMessage) == false)
                return false;

            if (CopyItemDataSecurities(center, srcDataCenterID, dicItems, ref strErrorMessage) == false)
                return false;

            if (CopyItemDataStorages(center, srcDataCenterID, dicItems, ref strErrorMessage) == false)
                return false;

            return true;
        }

        private bool CopyItemDataStorages(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<Storage.Fields, object> dicConditions = new Dictionary<Storage.Fields, object>();
            dicConditions[Storage.Fields.DataCenterID] = srcDataCenterID;
            List<Storage> storages = m_dataManager.GetSelectManager().SelectStorages(dicConditions, null, out strErrorMessage);

            if (storages == null)
                return false;

            Item item;

            foreach (Storage storage in storages)
            {
                if (storage.StorageID != null)
                {
                    if (dicItems.TryGetValue((int)storage.StorageID, out item))
                    {
                        storage.StorageID = item.ID;
                        storage.DataCenterID = center.ID;

                        if (m_dataManager.GetCreateManager().CreateStorage(storage, out strErrorMessage) == null)
                            return false;
                        else
                            continue;
                    }
                }

                storage.StorageID = null;
                storage.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateStorage(storage, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool CopyItemDataSecurities(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<Security.Fields, object> dicConditions = new Dictionary<Security.Fields, object>();
            dicConditions[Security.Fields.DataCenterID] = srcDataCenterID;
            List<Security> securities = m_dataManager.GetSelectManager().SelectSecurities(dicConditions, null, out strErrorMessage);

            if (securities == null)
                return false;

            Item item;

            foreach (Security security in securities)
            {
                if (security.SecurityID != null)
                {
                    if (dicItems.TryGetValue((int)security.SecurityID, out item))
                    {
                        security.SecurityID = item.ID;
                        security.DataCenterID = center.ID;

                        if (m_dataManager.GetCreateManager().CreateSecurity(security, out strErrorMessage) == null)
                            return false;
                        else
                            continue;
                    }
                }

                security.SecurityID = null;
                security.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateSecurity(security, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool CopyItemDataSanSwitches(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<SanSwitch.Fields, object> dicConditions = new Dictionary<SanSwitch.Fields, object>();
            dicConditions[SanSwitch.Fields.DataCenterID] = srcDataCenterID;
            List<SanSwitch> switches = m_dataManager.GetSelectManager().SelectSanSwitches(dicConditions, null, out strErrorMessage);

            if (switches == null)
                return false;

            Item item;

            foreach (SanSwitch _switch in switches)
            {
                if (_switch.SwitchID != null)
                {
                    if (dicItems.TryGetValue((int)_switch.SwitchID, out item))
                    {
                        _switch.SwitchID = item.ID;
                        _switch.DataCenterID = center.ID;

                        if (m_dataManager.GetCreateManager().CreateSanSwitch(_switch, out strErrorMessage) == null)
                            return false;
                        else
                            continue;
                    }
                }

                _switch.SwitchID = null;
                _switch.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateSanSwitch(_switch, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool CopyItemDataNetworks(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<Network.Fields, object> dicConditions = new Dictionary<Network.Fields, object>();
            dicConditions[Network.Fields.DataCenterID] = srcDataCenterID;
            List<Network> networks = m_dataManager.GetSelectManager().SelectNetworks(dicConditions, null, out strErrorMessage);

            if (networks == null)
                return false;

            Item item;

            foreach (Network network in networks)
            {
                if (network.NetworkID != null)
                {
                    if (dicItems.TryGetValue((int)network.NetworkID, out item))
                    {
                        network.NetworkID = item.ID;
                        network.DataCenterID = center.ID;

                        if (m_dataManager.GetCreateManager().CreateNetwork(network, out strErrorMessage) == null)
                            return false;
                        else
                            continue;
                    }
                }

                network.NetworkID = null;
                network.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateNetwork(network, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool CopyItemDataEtcs(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<Etc.Fields, object> dicConditions = new Dictionary<Etc.Fields, object>();
            dicConditions[Etc.Fields.DataCenterID] = srcDataCenterID;
            List<Etc> etcs = m_dataManager.GetSelectManager().SelectEtcs(dicConditions, null, out strErrorMessage);

            if (etcs == null)
                return false;

            Item item;

            foreach (Etc etc in etcs)
            {
                if (etc.EtcID != null)
                {
                    if (dicItems.TryGetValue((int)etc.EtcID, out item))
                    {
                        etc.EtcID = item.ID;
                        etc.DataCenterID = center.ID;

                        if (m_dataManager.GetCreateManager().CreateEtc(etc, out strErrorMessage) == null)
                            return false;
                        else
                            continue;
                    }
                }

                etc.EtcID = null;
                etc.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateEtc(etc, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool CopyItemDataBackups(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<Backup.Fields, object> dicConditions = new Dictionary<Backup.Fields, object>();
            dicConditions[Backup.Fields.DataCenterID] = srcDataCenterID;
            List<Backup> backups = m_dataManager.GetSelectManager().SelectBackups(dicConditions, null, out strErrorMessage);

            if (backups == null)
                return false;

            Item item;

            foreach (Backup backup in backups)
            {
                if (backup.BackupID != null)
                {
                    if (dicItems.TryGetValue((int)backup.BackupID, out item))
                    {
                        backup.BackupID = item.ID;
                        backup.DataCenterID = center.ID;

                        if (m_dataManager.GetCreateManager().CreateBackup(backup, out strErrorMessage) == null)
                            return false;
                        else
                            continue;
                    }
                }

                backup.BackupID = null;
                backup.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateBackup(backup, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private bool CopyItemDataServers(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Box> dicBoxes, ref string strErrorMessage)
        {
            Dictionary<ItemServer.Fields, object> dicConditions = new Dictionary<ItemServer.Fields, object>();
            dicConditions[ItemServer.Fields.DataCenterID] = srcDataCenterID;

            Box box;
            List<ItemServer> servers = m_dataManager.GetSelectManager().SelectItemServers(dicConditions, null, out strErrorMessage);

            foreach (ItemServer server in servers)
            {
                if (server.BoxID != null)
                {
                    if (dicBoxes.TryGetValue((int)server.BoxID, out box))
                    {
                        server.BoxID = box.BoxID;
                        server.DataCenterID = center.ID;
                        
                        if (m_dataManager.GetCreateManager().CreateItemServer(server, out strErrorMessage) == null)
                            return false;
                        else
                            continue;
                    }
                }

                server.BoxID = null;
                server.DataCenterID = center.ID;

                if (m_dataManager.GetCreateManager().CreateItemServer(server, out strErrorMessage) == null)
                    return false;
            }

            return true;
        }

        private Dictionary<int, Box> CopyItemDataBoxes(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<Box.Fields, object> dicConditions = new Dictionary<Box.Fields, object>();
            dicConditions[Box.Fields.DataCenterID] = srcDataCenterID;
            List<Box> boxes = m_dataManager.GetSelectManager().SelectBoxes(dicConditions, null, out strErrorMessage);

            if (boxes == null)
                return null;

            Item item;
            Dictionary<int, Box> dicBoxes = new Dictionary<int, Box>();

            foreach (Box box in boxes)
            {
                Box _box = null;
                string strOriginName = box.Basic_Name;

                if (box.BoxID != null)
                {
                    if (dicItems.TryGetValue((int)box.BoxID, out item))
                    {
                        int nOriginID = (int)box.BoxID;
                        box.BoxID = item.ID;
                        box.DataCenterID = center.ID;
                        _box = m_dataManager.GetCreateManager().CreateBox(box, out strErrorMessage);

                        if (_box == null)
                            return null;

                        dicBoxes[nOriginID] = _box;
                    }
                }

                if (_box == null)
                {
                    box.BoxID = null;
                    box.DataCenterID = center.ID;
                    _box = m_dataManager.GetCreateManager().CreateBox(box, out strErrorMessage);

                    if (_box == null)
                        return null;
                }
            }

            return dicBoxes;
        }

        private bool CopyLinkedItems(Model.DataCenter.DataCenter center, int srcDataCenterID, Dictionary<int, Item> dicItems, ref string strErrorMessage)
        {
            Dictionary<LinkedItem.Fields, object> dicConditions = new Dictionary<LinkedItem.Fields, object>();
            dicConditions[LinkedItem.Fields.CenterID] = srcDataCenterID;

            List<LinkedItem> linkedItems = m_dataManager.GetSelectManager().SelectLinkedItems(dicConditions, null, out strErrorMessage);

            if (linkedItems == null)
                return false;

            Item item1, item2;

            foreach (LinkedItem link in linkedItems)
            {
                if (dicItems.TryGetValue(link.ItemID, out item1) && dicItems.TryGetValue(link.LinkedItemID, out item2))
                {
                    LinkedItem linkedItem = new LinkedItem();
                    linkedItem.CenterID = center.ID;
                    linkedItem.ItemID = item1.ID;
                    linkedItem.LinkedItemID = item2.ID;

                    if (m_dataManager.GetCreateManager().CreateLinkedItem(linkedItem, out strErrorMessage) == null)
                        return false;
                }
            }

            return true;
        }

        private Dictionary<int, Item> CopyItems(Model.DataCenter.DataCenter dataCenter, int srcDataCenterID, Dictionary<int, Rack> dicRacks, ref string strErrorMessage)
        {
            Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
            dicConditions[Item.Fields.CenterID] = srcDataCenterID;

            List<Item> items = m_dataManager.GetSelectManager().SelectItems(dicConditions, null, out strErrorMessage);

            if (items == null)
                return null;

            string strRackIDs = "";

            foreach (KeyValuePair<int, Rack> pair in dicRacks)
            {
                if (strRackIDs.Length == 0)
                    strRackIDs = pair.Key.ToString();
                else
                    strRackIDs += ", " + pair.Key.ToString();
            }

            List<Item_RU> itemRUs = null;

            if (strRackIDs.Length == 0)
                itemRUs = new List<Item_RU>();
            else
            {
                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", Item_RU.GetFieldName(Item_RU.Fields.RackID, out isNullable), strRackIDs);
                itemRUs = m_dataManager.GetSelectManager().SelectItem_RUs(null, strCondition, out strErrorMessage);

                if (itemRUs == null)
                    return null;
            }

            Dictionary<int, Item_RU> dicItemRUs = new Dictionary<int, Item_RU>();

            foreach (Item_RU itemRU in itemRUs)
            {
                dicItemRUs[itemRU.ItemID] = itemRU;
            }

            DateTime dtNow = DateTime.Now;
            Rack rack;
            Dictionary<int, Item> dicItems = new Dictionary<int, Item>();

            foreach (Item item in items)
            {
                item.RegDate = dtNow;
                item.CenterID = dataCenter.ID;

                Item _item = m_dataManager.GetCreateManager().CreateItem(item, out strErrorMessage);

                if (_item == null)
                    return null;

                dicItems[item.ID] = _item;

                Item_RU itemRU;

                if (dicItemRUs.TryGetValue(item.ID, out itemRU) == false)
                    continue;

                if (dicRacks.TryGetValue(itemRU.RackID, out rack) == false)
                    continue;

                itemRU.RackID = rack.ID;
                itemRU.ItemID = _item.ID;

                if (m_dataManager.GetCreateManager().CreateItem_RU(itemRU, out strErrorMessage) == null)
                    return null;
            }

            return dicItems;
        }

        private bool CopySensors(Model.DataCenter.DataCenter dataCenter, int srcDataCenterID, ref string strErrorMessage)
        {
            Dictionary<Sensor.Fields, object> dicConditions = new Dictionary<Sensor.Fields, object>();
            dicConditions[Sensor.Fields.CenterID] = srcDataCenterID;

            List<Sensor> sensors = m_dataManager.GetSelectManager().SelectSensors(dicConditions, null, out strErrorMessage);

            if (sensors == null)
                return false;

            DateTime dtNow = DateTime.Now;

            foreach (Sensor sensor in sensors)
            {
                sensor.CenterID = dataCenter.ID;
                sensor.RegDate = dtNow;
                Sensor _sensor = m_dataManager.GetCreateManager().CreateSensor(sensor, out strErrorMessage);

                if (_sensor == null)
                    return false;
            }

            return true;
        }

        private bool CopyFacilities(Model.DataCenter.DataCenter dataCenter, int srcDataCenterID, ref string strErrorMessage)
        {
            Dictionary<Facility.Fields, object> dicConditions = new Dictionary<Facility.Fields, object>();
            dicConditions[Facility.Fields.DataCenterID] = srcDataCenterID;

            List<Facility> facilities = m_dataManager.GetSelectManager().SelectFacilities(dicConditions, null, out strErrorMessage);

            if (facilities == null)
                return false;

            DateTime dtNow = DateTime.Now;

            foreach (Facility facility in facilities)
            {
                facility.DataCenterID = dataCenter.ID;
                facility.RegDate = dtNow;
                Facility _facility = m_dataManager.GetCreateManager().CreateFacility(facility, out strErrorMessage);

                if (_facility == null)
                    return false;
            }

            return true;
        }

        private Dictionary<int, Rack> CopyRacks(Model.DataCenter.DataCenter dataCenter, int srcDataCenterID, Dictionary<int, RackGroup>  dicRackGroups, ref string strErrorMessage)
        {
            Dictionary<Rack.Fields, object> dicConditions = new Dictionary<Rack.Fields, object>();
            dicConditions[Rack.Fields.CenterID] = srcDataCenterID;

            List<Rack> racks = m_dataManager.GetSelectManager().SelectRacks(dicConditions, null, out strErrorMessage);

            if (racks == null)
                return null;

            DateTime dtNow = DateTime.Now;
            RackGroup rackGroup;
            Dictionary<int, Rack> dicRacks = new Dictionary<int, Rack>();

            foreach (Rack rack in racks)
            {
                if (rack.RackGroupID == null)
                {
                    rack.CenterID = dataCenter.ID;
                }
                else
                {
                    if (dicRackGroups.TryGetValue((int)rack.RackGroupID, out rackGroup) == false)
                        continue;

                    rack.CenterID = dataCenter.ID;
                    rack.RackGroupID = rackGroup.ID;
                }

                rack.RegDate = dtNow;
                Rack _rack = m_dataManager.GetCreateManager().CreateRack(rack, out strErrorMessage);

                if (_rack == null)
                    return null;
                else
                    dicRacks[rack.ID] = _rack;
            }

            return dicRacks;
        }

        private Dictionary<int, RackGroup> CopyRackGroups(Model.DataCenter.DataCenter dataCenter, int srcDataCenterID, ref string strErrorMessage)
        {
            Dictionary<RackGroup.Fields, object> dicConditions = new Dictionary<RackGroup.Fields, object>();
            dicConditions[RackGroup.Fields.CenterID] = srcDataCenterID;

            List<RackGroup> rackGroups = m_dataManager.GetSelectManager().SelectRackGroups(dicConditions, null, out strErrorMessage);

            if (rackGroups == null)
                return null;

            Dictionary<int, RackGroup> dicRackGroups = new Dictionary<int, RackGroup>();

            foreach (RackGroup rackGroup in rackGroups)
            {
                rackGroup.CenterID = dataCenter.ID;
                RackGroup rg = m_dataManager.GetCreateManager().CreateRackGroup(rackGroup, out strErrorMessage);

                if (rg == null)
                    return null;
                else
                    dicRackGroups[rackGroup.ID] = rg;
            }

            return dicRackGroups;
        }

        public MessageResult UpdateDataCenter(RequestUpdateDataCenter data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseSiteNNation(false, strErrorMessage);

            Model.DataCenter.DataCenter _dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (_dataCenter == null)
                return new MessageResult(false, "시스템 데이터베이스로부터 VDC 정보를 조회하지 못하였습니다.");

            if (_dataCenter.SiteID != siteID)
                return new ResponseSiteNNation(false, "허가되지 않은 정보에 접근중입니다.");

            bool isNullable;
            string strCondition = string.Format("{0} = {1}", Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable), data.DataCenterID);

            Model.DataCenter.DataCenter dataCenter = new Model.DataCenter.DataCenter();

            dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            dataCenter.Memo = data.Memo;

            MessageResult result = new MessageResult();

            bool _result = m_dataManager.GetUpdateManager().UpdateDataCenter(dataCenter, out strErrorMessage);
            result.Success = _result;

            if (strErrorMessage != null)
                strErrorMessage = "시스템 데이터베이스에서 VDC 정보를 변경하는데 실패하였습니다.";

            return result;
        }

        public MessageResult UpdateDataCenters(RequestUpdateDataCenters data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseSiteNNation(false, strErrorMessage);

            Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();

            if (m_dataManager.BeginTransaction() == false)
                return new MessageResult(false, "Database 트랜잭션을 시작할 수 없습니다.");

            foreach (RequestUpdateDataCenters.UpdateData updateData in data.UpdateDatas)
            {
                Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(updateData.DataCenterID, out strErrorMessage);

                if (dataCenter == null)
                {
                    m_dataManager.Rollback();
                    return new MessageResult(false, "시스템 데이터베이스로부터 VDC 정보를 조회하지 못하였습니다.");
                }

                if (dataCenter.SiteID != siteID)
                {
                    m_dataManager.Rollback();
                    return new MessageResult(false, "허가되지 않은 정보에 접근중입니다.");
                }

                Dictionary<Model.DataCenter.DataCenter.Fields, object> dicSets = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();

                if (updateData.CreationType != null)
                    dicSets[Model.DataCenter.DataCenter.Fields.CreationType] = updateData.CreationType;

                if (updateData.CenterName != null)
                {
                    dicSets[Model.DataCenter.DataCenter.Fields.Name] = updateData.CenterName;
                    dicSets[Model.DataCenter.DataCenter.Fields.EngName] = updateData.CenterName;
                }

                if (updateData.Type != null)
                    dicSets[Model.DataCenter.DataCenter.Fields.Type] = updateData.Type;

                dicSets[Model.DataCenter.DataCenter.Fields.Memo] = updateData.Memo;

                dicConditions[Model.DataCenter.DataCenter.Fields.ID] = updateData.DataCenterID;
                
                if (m_dataManager.GetUpdateManager().UpdateDataCenter(dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 VDC 정보를 업데이트하지 못하였습니다.";
                    m_dataManager.Rollback();
                    return new MessageResult(false, strErrorMessage);
                }
            }

            if (m_dataManager.Commit() == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "Database 트랜잭션이 실패하였습니다.");
            }

            return new MessageResult(true, "");
        }

        public MessageResult DeleteDataCenters(List<int> dataCenterIDs)
        {
            string strIDs = "";

            foreach (int id in dataCenterIDs)
            {
                if (strIDs.Length == 0)
                    strIDs = id.ToString();
                else
                    strIDs += ", " + id.ToString();
            }

            if (strIDs.Length == 0)
                return new MessageResult(true, "");

            string strErrorMessage;

            if (m_dataManager.BeginTransaction() == false)
                return new MessageResult(false, "Database 트랜잭션을 시작할 수 없습니다.");

            if (DeleteFacility(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteItem(strIDs, m_dataManager, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteRack(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteRackGroup(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteDataCenterViewport(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteUserDataCenterLink(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteDataCenterData(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (UpdateDataCenterData(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteWorkChangeTarget(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteWorkChangeBasic(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteWorkFaultTarget(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (DeleteWorkFaultBasic(strIDs, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.ID, out isNullable), strIDs);

            if (m_dataManager.GetDeleteManager().DeleteDataCenter(null, strCondition, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, strErrorMessage);
            }

            if (m_dataManager.Commit() == false)
            {
                m_dataManager.Rollback();
                return new MessageResult(false, "Database 트랜잭션이 실패하였습니다.");
            }

            return new MessageResult(true, "");
        }

        private bool DeleteWorkFaultTarget(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.Work.FaultTarget.GetFieldName(Model.Work.FaultTarget.Fields.DataCenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteWorkFaultTarget(null, strCondition, out strErrorMessage);
        }

        private bool DeleteWorkFaultBasic(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.Work.FaultBasic.GetFieldName(Model.Work.FaultBasic.Fields.DataCenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteWorkFaultBasic(null, strCondition, out strErrorMessage);
        }

        private bool DeleteWorkChangeTarget(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.Work.ChangeTarget.GetFieldName(Model.Work.ChangeTarget.Fields.DataCenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteWorkChangeTarget(null, strCondition, out strErrorMessage);
        }

        private bool DeleteWorkChangeBasic(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.Work.ChangeBasic.GetFieldName(Model.Work.ChangeBasic.Fields.DataCenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteWorkChangeBasic(null, strCondition, out strErrorMessage);
        }

        private bool UpdateDataCenterData(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.DataCenter.Data.GetFieldName(Model.DataCenter.Data.Fields.ParentID, out isNullable), strDataCenterIDs);

            Dictionary<Model.DataCenter.Data.Fields, object> dicSets = new Dictionary<Model.DataCenter.Data.Fields, object>();
            dicSets[Model.DataCenter.Data.Fields.ParentID] = null;

            return m_dataManager.GetUpdateManager().UpdateDataCenterData(dicSets, null, strCondition, out strErrorMessage);
        }

        private bool DeleteDataCenterData(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.DataCenter.Data.GetFieldName(Model.DataCenter.Data.Fields.CenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteDataCenterData(null, strCondition, out strErrorMessage);
        }

        private bool DeleteUserDataCenterLink(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.DataCenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteAccountUserDataCenterLink(null, strCondition, out strErrorMessage);
        }

        private bool DeleteDataCenterViewport(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Model.DataCenter.Viewport.GetFieldName(Model.DataCenter.Viewport.Fields.DataCenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteDataCenterViewport(null, strCondition, out strErrorMessage);
        }

        private bool DeleteRackGroup(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", RackGroup.GetFieldName(RackGroup.Fields.CenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteRackGroup(null, strCondition, out strErrorMessage);
        }

        private bool DeleteRack(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Rack.GetFieldName(Rack.Fields.CenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteRack(null, strCondition, out strErrorMessage);
        }

        private bool DeleteFacility(string strDataCenterIDs, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Facility.GetFieldName(Facility.Fields.DataCenterID, out isNullable), strDataCenterIDs);
            return m_dataManager.GetDeleteManager().DeleteFacility(null, strCondition, out strErrorMessage);
        }

        public static bool DeleteItem(string strDataCenterIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Item.GetFieldName(Item.Fields.CenterID, out isNullable), strDataCenterIDs);

            List<Item> items = dataManager.GetSelectManager().SelectItems(null, strCondition, out strErrorMessage);

            if (items == null)
                return false;

            string strItemIDs = "";

            foreach (Item item in items)
            {
                if (strItemIDs.Length == 0)
                    strItemIDs = item.ID.ToString();
                else
                    strItemIDs += "," + item.ID.ToString();
            }

            if (strItemIDs.Length == 0)
                return true;

            if (DeleteItemData_Box(strItemIDs, dataManager, out strErrorMessage) == false)
                return false;

            if (DeleteItemData_Backup(strItemIDs, dataManager, out strErrorMessage) == false)
                return false;

            if (DeleteItemData_Etc(strItemIDs, dataManager, out strErrorMessage) == false)
                return false;

            if (DeleteItemData_Network(strItemIDs, dataManager, out strErrorMessage) == false)
                return false;

            if (DeleteItemData_SanSwitch(strItemIDs, dataManager, out strErrorMessage) == false)
                return false;

            if (DeleteItemData_Security(strItemIDs, dataManager, out strErrorMessage) == false)
                return false;

            if (DeleteItemData_Storage(strItemIDs, dataManager, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", LinkedItem.GetFieldName(LinkedItem.Fields.CenterID, out isNullable), strDataCenterIDs);

            if (dataManager.GetDeleteManager().DeleteLinkedItem(null, strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in (Select {1} from {2} where {3} in ({4}))",
                Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable),
                Item.GetFieldName(Item.Fields.ID, out isNullable),
                Item.TableName,
                Item.GetFieldName(Item.Fields.CenterID, out isNullable),
                strDataCenterIDs);

            if (dataManager.GetDeleteManager().DeleteItem_RU(null, strCondition, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Item.GetFieldName(Item.Fields.CenterID, out isNullable), strDataCenterIDs);

            if (dataManager.GetDeleteManager().DeleteItem(null, strCondition, out strErrorMessage) == false)
                return false;

            return true;
        }

        public static bool DeleteItemData_Storage(string strItemIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Storage.GetFieldName(Storage.Fields.StorageID, out isNullable), strItemIDs);
            return dataManager.GetDeleteManager().DeleteStorage(null, strCondition, out strErrorMessage);
        }

        public static bool DeleteItemData_Security(string strItemIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Security.GetFieldName(Security.Fields.SecurityID, out isNullable), strItemIDs);
            return dataManager.GetDeleteManager().DeleteSecurity(null, strCondition, out strErrorMessage);
        }

        public static bool DeleteItemData_SanSwitch(string strItemIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", SanSwitch.GetFieldName(SanSwitch.Fields.SwitchID, out isNullable), strItemIDs);
            return dataManager.GetDeleteManager().DeleteSanSwitch(null, strCondition, out strErrorMessage);
        }

        public static bool DeleteItemData_Network(string strItemIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Network.GetFieldName(Network.Fields.NetworkID, out isNullable), strItemIDs);
            return dataManager.GetDeleteManager().DeleteNetwork(null, strCondition, out strErrorMessage);
        }

        public static bool DeleteItemData_Etc(string strItemIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Etc.GetFieldName(Etc.Fields.EtcID, out isNullable), strItemIDs);
            return dataManager.GetDeleteManager().DeleteEtc(null, strCondition, out strErrorMessage);
        }

        public static bool DeleteItemData_Backup(string strItemIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Backup.GetFieldName(Backup.Fields.BackupID, out isNullable), strItemIDs);
            return dataManager.GetDeleteManager().DeleteBackup(null, strCondition, out strErrorMessage);
        }

        public static bool DeleteItemData_Box(string strItemIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", Box.GetFieldName(Box.Fields.BoxID, out isNullable), strItemIDs);

            List<Box> boxes = dataManager.GetSelectManager().SelectBoxes(null, strCondition, out strErrorMessage);

            if (boxes == null)
                return false;

            string strBoxIDs = "";

            foreach (Box box in boxes)
            {
                if (strBoxIDs.Length == 0)
                    strBoxIDs = box.BoxID.ToString();
                else
                    strBoxIDs += "," + box.BoxID.ToString();
            }

            if (strBoxIDs.Length == 0)
                return true;

            if (DeleteItemServer(strBoxIDs, dataManager, out strErrorMessage) == false)
                return false;

            strCondition = string.Format("{0} in ({1})", Box.GetFieldName(Box.Fields.BoxID, out isNullable), strBoxIDs);
            return dataManager.GetDeleteManager().DeleteBox(null, strCondition, out strErrorMessage);
        }

        public static  bool DeleteItemServer(string strBoxIDs, IDataManager dataManager, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} in ({1})", ItemServer.GetFieldName(ItemServer.Fields.BoxID, out isNullable), strBoxIDs);
            return dataManager.GetDeleteManager().DeleteItemServer(null, strCondition, out strErrorMessage);
        }

        public ResponseRackNItemTypes UpdateTypeDatas(EditTypeData data)
        {
            if (m_dataManager.BeginTransaction() == false)
                return new ResponseRackNItemTypes(false, "DB Transaction을 시작할 수 없습니다.");

            string strErrorMessage = null;
            DateTime dtNow = DateTime.Now;

            foreach (RackType rackType in data.UpdateRackTypes)
            {
                rackType.ChangeDate = dtNow;

                if (m_dataManager.GetUpdateManager().UpdateRackType(rackType, out strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 RackType 정보를 업데이트하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseRackNItemTypes(false, strErrorMessage);
                }
            }

            foreach (ItemType itemType in data.UpdateItemTypes)
            {
                itemType.ChangeDate = dtNow;

                if (m_dataManager.GetUpdateManager().UpdateItemType(itemType, out strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 IT 자산 타입 정보를 업데이트하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseRackNItemTypes(false, strErrorMessage);
                }
            }

            foreach (FacilityType facilityType in data.UpdateFacilityTypes)
            {
                facilityType.ChangeDate = dtNow;

                if (m_dataManager.GetUpdateManager().UpdateFacilityType(facilityType, out strErrorMessage) == false)
                {
                    strErrorMessage = "시스템 데이터베이스에서 설비타입 정보를 업데이트하는데 실패하였습니다.";
                    m_dataManager.Rollback();
                    return new ResponseRackNItemTypes(false, strErrorMessage);
                }
            }

            if (m_dataManager.Commit() == false)
                return new ResponseRackNItemTypes(false, "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.");

            return m_processManager.LoadManager.GetRackNItemTypes();
        }
    }
}
