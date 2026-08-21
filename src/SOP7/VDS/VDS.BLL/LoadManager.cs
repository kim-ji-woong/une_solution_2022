using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.Account;
using VDS.Model.ItemData;
using VDS.Model.Sensor;
using VDS.Model.Work;
using System.IO;

namespace VDS.BLL
{
    using Models.Request;
    using Models.Response;
    using System.Collections;

    public class LoadManager
    {
        private IDataManager m_dataManager = null;

        public LoadManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseCountries GetCountries()
        {
            string strErrorMessage;
            List<Nation> nations = m_dataManager.GetSelectManager().SelectNations(null, null, out strErrorMessage);

            if (nations == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 국가 정보를 조회하는데 실패하였습니다.";
                return new ResponseCountries(false, strErrorMessage);
            }

            ResponseCountries response = new ResponseCountries(true, "");
            response.Nations.AddRange(nations);
            return response;
        }

        public ResponseDataCenters GetDataCenters(int userID)
        {
            string strErrorMessage;
            Dictionary<User.Fields, object> dicUserCondition = new Dictionary<User.Fields, object>();
            dicUserCondition[User.Fields.ID] = userID;

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinUserDataCenterDataCenterData(dicUserCondition, null, null, null, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 사용자 계정을 통한 VDC 정보를 조회하는데 실패하였습니다.";
                return new ResponseDataCenters(false, strErrorMessage);
            }

            int nDataCount = arrDatas.Count;
            List<Model.DataCenter.DataCenter> dataCenters = new List<Model.DataCenter.DataCenter>();
            List<Model.DataCenter.Data> dataCenterDatas = new List<Model.DataCenter.Data>();

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i + 1] is Model.DataCenter.DataCenter && arrDatas[i + 2] is Model.DataCenter.Data)
                {
                    dataCenters.Add((Model.DataCenter.DataCenter)arrDatas[i + 1]);
                    dataCenterDatas.Add((Model.DataCenter.Data)arrDatas[i + 2]);
                }
            }

            List<Nation> nations = m_dataManager.GetSelectManager().SelectNations(null, null, out strErrorMessage);

            if (nations == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 국가 정보를 조회하지 못하였습니다.";
                return new ResponseDataCenters(false, strErrorMessage);
            }

            ArrayList arrDatas2 = m_dataManager.GetSelectManager().JoinSiteSiteData(null, null, null, out strErrorMessage);

            if (arrDatas2 == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 고객사 정보를 조회하는데 실패하였습니다.";
                return new ResponseDataCenters(false, strErrorMessage);
            }

            int nDataCount2 = arrDatas2.Count;
            List<Model.Site.Site> sites = new List<Model.Site.Site>();
            List<Model.Site.Data> siteDatas = new List<Model.Site.Data>();

            for (int i=0;i<nDataCount2-1;i+=2)
            {
                if (arrDatas2[i] is Model.Site.Site && arrDatas2[i + 1] is Model.Site.Data)
                {
                    Model.Site.Site site = (Model.Site.Site)arrDatas2[i];
                    Model.Site.Data siteData = (Model.Site.Data)arrDatas2[i + 1];

                    sites.Add(site);
                    siteDatas.Add(siteData);
                }
            }

            Dictionary<int, Nation> dicNations = new Dictionary<int, Nation>();
            Dictionary<int, SiteEx> dicSites = new Dictionary<int, SiteEx>();

            foreach (Nation nation in nations)
            {
                dicNations[nation.ID] = nation;
            }

            int nSiteCount = sites.Count;

            for (int i=0;i<nSiteCount;i++)
            {
                Model.Site.Site site = sites[i];
                Model.Site.Data siteData = siteDatas[i];

                dicSites[site.ID] = new SiteEx(site, siteData);
            }

            int nDataCenterCount = dataCenters.Count;
            ResponseDataCenters response = new ResponseDataCenters(true, "");

            for (int i=0;i<nDataCenterCount;i++)
            {
                Model.DataCenter.DataCenter dc = dataCenters[i];
                Model.DataCenter.Data dcData = dataCenterDatas[i];

                Nation nation;
                SiteEx site;

                if (dicNations.TryGetValue(dc.NationID, out nation) && dicSites.TryGetValue(dc.SiteID, out site))
                {
                    DataCenterEx center = new DataCenterEx(dc, dcData);

                    center.Site = site;
                    center.Nation = nation;

                    response.DataCenters.Add(center);
                }
            }

            if (SetDataCenterRatio(response.DataCenters, out strErrorMessage) == false)
                return new ResponseDataCenters(false, strErrorMessage);

            return response;
        }

        public ResponseRackNItems GetRackNItems(int nDataCenterID, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseRackNItems(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(nDataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseRackNItems(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new ResponseRackNItems(false, "허가되지 않은 VDC의 정보에 접근하려고 시도하였습니다.");

            List<RackType> rackTypes = m_dataManager.GetSelectManager().SelectRackTypes(null, null, out strErrorMessage);

            if (rackTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 Rack Type 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            Dictionary<RackGroup.Fields, object> dicConditions1 = new Dictionary<RackGroup.Fields, object>();
            dicConditions1[RackGroup.Fields.CenterID] = nDataCenterID;

            List<RackGroup> rackGroups = m_dataManager.GetSelectManager().SelectRackGroups(dicConditions1, null, out strErrorMessage);

            if (rackGroups == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC내의 RackGroup 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            Dictionary<Rack.Fields, object> dicConditions2 = new Dictionary<Rack.Fields, object>();
            dicConditions2[Rack.Fields.CenterID] = nDataCenterID;

            List<Rack> racks = m_dataManager.GetSelectManager().SelectRacks(dicConditions2, null, out strErrorMessage);

            if (racks == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC내의 Rack 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            List<ItemType> itemTypes = m_dataManager.GetSelectManager().SelectItemTypes(null, null, out strErrorMessage);

            if (itemTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC내의 IT 자산 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            List<ItemTypeEx> itemTypeExes = ToItemTypeEx(itemTypes, null, out strErrorMessage);

            if (itemTypeExes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 IT 자산 타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            bool isNullable;
            string strCondition = string.Format("{0}.{1} = {2}", Item.TableName, Item.GetFieldName(Item.Fields.CenterID, out isNullable), nDataCenterID);

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinItemItemRU(strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 IT 자산의 위치 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            List<ItemEx> itemExes = ToItemEx(nDataCenterID, arrDatas, itemTypeExes, out strErrorMessage);

            if (itemExes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 IT 자산 정보를 조회하지 못하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            Dictionary<Facility.Fields, object> facilityCondition = new Dictionary<Facility.Fields, object>();
            facilityCondition[Facility.Fields.DataCenterID] = nDataCenterID;

            List<Facility> facilities = m_dataManager.GetSelectManager().SelectFacilities(facilityCondition, null, out strErrorMessage);

            if (facilities == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC내의 설비 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            List<FacilityType> facilityTypes = m_dataManager.GetSelectManager().SelectFacilityTypes(null, null, out strErrorMessage);

            if (facilityTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 설비타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            List<FacilityEx> _facilities = ToFacilityEx(facilities, facilityTypes, out strErrorMessage);

            Dictionary<Sensor.Fields, object> sensorCondition = new Dictionary<Sensor.Fields, object>();
            sensorCondition[Sensor.Fields.CenterID] = nDataCenterID;

            List<Sensor> sensors = m_dataManager.GetSelectManager().SelectSensors(sensorCondition, null, out strErrorMessage);

            if (sensors == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC내의 FMS 센서 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            List<SensorType> sensorTypes = m_dataManager.GetSelectManager().SelectSensorTypes(null, null, out strErrorMessage);

            if (facilityTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 FMS 센서 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            List<History> sensorHistories = m_dataManager.GetSelectManager().SelectLastSensorHistories(nDataCenterID, out strErrorMessage);

            if (sensorHistories == null)
            {
                strErrorMessage = "시스템 데이터베이스에서센서 이력정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItems(false, strErrorMessage);
            }

            Dictionary<string, History> dicSensorHistories = new Dictionary<string, History>();

            foreach (History history in sensorHistories)
            {
                dicSensorHistories[history.SensorName] = history;
            }

            List<SensorEx> _sensors = ToSensorEx(sensors, sensorTypes, dicSensorHistories);

            ResponseRackNItems response = new ResponseRackNItems(true, "");

            response.RackTypes.AddRange(rackTypes);
            response.RackGroups.AddRange(rackGroups);
            response.Racks.AddRange(racks);
            response.ItemTypes.AddRange(itemTypeExes);
            response.Items.AddRange(itemExes);
            response.Facilities.AddRange(_facilities);
            response.Sensors.AddRange(_sensors);

            return response;
        }

        public ResponseRackTypeList GetRackTypeList()
        {
            string strErrorMessage;
            List<RackType> rackTypes = m_dataManager.GetSelectManager().SelectRackTypes(null, null, out strErrorMessage);

            if (rackTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 RackType 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackTypeList(false, strErrorMessage);
            }

            List<Company> companies = m_dataManager.GetSelectManager().SelectCompanies(null, null, out strErrorMessage);

            if (companies == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 제조사 정보를 조회하는데 실패하였습니다.";
                return null;
            }

            Dictionary<int, Company> dicCompanies = new Dictionary<int, Company>();

            foreach (Company company in companies)
            {
                dicCompanies[company.ID] = company;
            }

            ResponseRackTypeList response = new ResponseRackTypeList(true, "");

            foreach (RackType rackType in rackTypes)
            {
                Company company;

                if (dicCompanies.TryGetValue(rackType.CompanyID, out company))
                {
                    RackTypeEx rackTypeEx = new RackTypeEx(rackType);
                    rackTypeEx.Company = company;
                    response.RackTypes.Add(rackTypeEx);
                }
            }

            return response;
        }

        public ResponseItemTypeList GetItemTypeList()
        {
            string strErrorMessage;
            List<ItemType> itemTypes = m_dataManager.GetSelectManager().SelectItemTypes(null, null, out strErrorMessage);

            if (itemTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 IT 자산타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseItemTypeList(false, strErrorMessage);
            }

            List<ItemTypeEx> itemTypeExes = ToItemTypeEx(itemTypes, null, out strErrorMessage);

            if (itemTypeExes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 IT 자산타입 정보를 조회하지 못하였습니다.";
                return new ResponseItemTypeList(false, strErrorMessage);
            }

            ResponseItemTypeList response = new ResponseItemTypeList(true, "");
            response.ItemTypes.AddRange(itemTypeExes);
            return response;
        }

        private bool GetItemTypeName(Item item, Dictionary<int, ItemTypeEx> dicItemTypes, Dictionary<int, EquipmentType> dicEquipmentTypes, out string strName)
        {
            strName = null;
            ItemTypeEx itemType;

            if (dicItemTypes.TryGetValue(item.ItemTypeID, out itemType) == false)
                return false;

            EquipmentType equipmentType;

            if (dicEquipmentTypes.TryGetValue(itemType.EquipmentType, out equipmentType) == false)
                return false;

            strName = equipmentType.EngName.ToLower();
            return true;
        }

        private bool IsBackupType(string strName)
        {
            if (strName == "backup")
                return true;

            return false;
        }

        private bool IsBoxType(string strName)
        {
            if (strName == "box")
                return true;

            return false;
        }

        private bool IsEtcType(string strName)
        {
            if (strName == "etc")
                return true;

            return false;
        }

        private bool IsNetworkType(string strName)
        {
            if (strName == "network")
                return true;

            return false;
        }

        private bool IsSanSwitchType(string strName)
        {
            if (strName == "san switch")
                return true;

            return false;
        }

        private bool IsSecurityType(string strName)
        {
            if (strName == "security")
                return true;

            return false;
        }

        private bool IsStorageType(string strName)
        {
            if (strName == "storage")
                return true;

            return false;
        }

        private bool IsServerType(string strName)
        {
            if (strName == "server")
                return true;

            return false;
        }

        private void SetItemName(ref string strItemNames, Item item)
        {
            if (strItemNames.Length == 0)
                strItemNames = "'" + item.Name.ToString() + "'";
            else
                strItemNames += ", '" + item.Name.ToString() + "'";
        }

        // itemDatas : Item + Item_RU
        private List<ItemEx> ToItemEx(int nDataCenterID, ArrayList itemDatas, List<ItemTypeEx> itemTypes, out string strErrorMessage)
        {
            Dictionary<LinkedItem.Fields, object> dicConditions = new Dictionary<LinkedItem.Fields, object>();
            dicConditions[LinkedItem.Fields.CenterID] = nDataCenterID;

            List<LinkedItem> linkedItems = m_dataManager.GetSelectManager().SelectLinkedItems(dicConditions, null, out strErrorMessage);

            if (linkedItems == null)
                return null;

            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
                return null;

            Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();

            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType;
            }

            Dictionary<int, ItemTypeEx> dicItemTypes = new Dictionary<int, ItemTypeEx>();

            foreach (ItemTypeEx itemType in itemTypes)
            {
                dicItemTypes[itemType.ID] = itemType;
            }

            List<ItemEx> itemExes = new List<ItemEx>();
            Dictionary<int, ItemEx> dicItemEx = new Dictionary<int, ItemEx>();
            Dictionary<string, ItemEx> dicItemName = new Dictionary<string, ItemEx>();

            int nDataCount = itemDatas.Count;
            string strBackupItemNames = "", strBoxItemNames = "", strEtcItemNames = "";
            string strNetworkItemNames = "", strSanSwitchItemNames = "", strSecurityItemNames = "";
            string strStorageItemNames = "", strServerItemNames = "";

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (itemDatas[i] is Item && itemDatas[i + 1] is Item_RU)
                {
                    Item item = (Item)itemDatas[i];
                    Item_RU itemRU = (Item_RU)itemDatas[i + 1];

                    ItemEx itemEx = new ItemEx(item, itemRU);
                    dicItemEx[item.ID] = itemEx;
                    dicItemName[item.Name] = itemEx;

                    itemExes.Add(itemEx);

                    string strName;

                    if (GetItemTypeName(item, dicItemTypes, dicEquipmentTypes, out strName) == false)
                        continue;

                    if (IsBackupType(strName))
                        SetItemName(ref strBackupItemNames, item);
                    else if (IsBoxType(strName))
                        SetItemName(ref strBoxItemNames, item);
                    else if (IsEtcType(strName))
                        SetItemName(ref strEtcItemNames, item);
                    else if (IsNetworkType(strName))
                        SetItemName(ref strNetworkItemNames, item);
                    else if (IsSanSwitchType(strName))
                        SetItemName(ref strSanSwitchItemNames, item);
                    else if (IsSecurityType(strName))
                        SetItemName(ref strSecurityItemNames, item);
                    else if (IsStorageType(strName))
                        SetItemName(ref strStorageItemNames, item);
                    else if (IsServerType(strName))
                        SetItemName(ref strServerItemNames, item);
                }
            }

            foreach (LinkedItem link in linkedItems)
            {
                ItemEx itemEx;

                if (dicItemEx.TryGetValue(link.ItemID, out itemEx))
                {
                    itemEx.LinkedItemIDs.Add(link.LinkedItemID);
                }
            }

            if (strBoxItemNames.Length > 0)
                SetBoxData(dicItemName, strBoxItemNames, nDataCenterID, out strErrorMessage);

            if (strBackupItemNames.Length > 0)
                SetBackupData(dicItemName, strBackupItemNames, nDataCenterID, out strErrorMessage);

            if (strEtcItemNames.Length > 0)
                SetEtcData(dicItemName, strEtcItemNames, nDataCenterID, out strErrorMessage);

            if (strNetworkItemNames.Length > 0)
                SetNetworkData(dicItemName, strNetworkItemNames, nDataCenterID, out strErrorMessage);

            if (strSanSwitchItemNames.Length > 0)
                SetSanSwitchData(dicItemName, strSanSwitchItemNames, nDataCenterID, out strErrorMessage);

            if (strSecurityItemNames.Length > 0)
                SetSecurityData(dicItemName, strSecurityItemNames, nDataCenterID, out strErrorMessage);

            if (strStorageItemNames.Length > 0)
                SetStorageData(dicItemName, strStorageItemNames, nDataCenterID, out strErrorMessage);

            return itemExes;
        }

        private List<FacilityEx> ToFacilityEx(List<Facility> facilities, List<FacilityType> facilityTypes, out string strErrorMessage)
        {
            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
                return null;

            string strCompanyIDs = "";
            Dictionary<int, int> dicCompanyIDs = new Dictionary<int, int>();

            foreach (FacilityType facilityType in facilityTypes)
            {
                if (dicCompanyIDs.ContainsKey(facilityType.CompanyID) == false)
                {
                    dicCompanyIDs[facilityType.CompanyID] = facilityType.CompanyID;
                    strCompanyIDs += "," + facilityType.CompanyID.ToString();
                }
            }

            Dictionary<int, Company> dicCompanies = new Dictionary<int, Company>();

            if (strCompanyIDs.Length > 0)
            {
                strCompanyIDs = strCompanyIDs.Substring(1);

                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", Company.GetFieldName(Company.Fields.ID, out isNullable), strCompanyIDs);
                List<Company> companines = m_dataManager.GetSelectManager().SelectCompanies(null, strCondition, out strErrorMessage);

                if (companines == null)
                    return null;

                foreach (Company company in companines)
                {
                    dicCompanies[company.ID] = company;
                }
            }

            Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();

            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType;
            }

            Dictionary<int, FacilityTypeEx> dicFacilityTypes = new Dictionary<int, FacilityTypeEx>();

            foreach (FacilityType facilityType in facilityTypes)
            {
                EquipmentType equipmentType;
                Company company;

                if (dicEquipmentTypes.TryGetValue(facilityType.EquipmentTypeID, out equipmentType) && dicCompanies.TryGetValue(facilityType.CompanyID, out company))
                {
                    FacilityTypeEx _facilityType = new FacilityTypeEx(facilityType);
                    _facilityType.EquipmentType = equipmentType;
                    _facilityType.Company = company;
                    dicFacilityTypes[facilityType.ID] = _facilityType;
                }
            }

            List<FacilityEx> _facilities = new List<FacilityEx>();

            foreach (Facility facility in facilities)
            {
                FacilityTypeEx facilityType;

                if (dicFacilityTypes.TryGetValue(facility.FacilityTypeID, out facilityType))
                {
                    FacilityEx _facility = new FacilityEx(facility);
                    _facility.FacilityType = facilityType;
                    _facilities.Add(_facility);
                }
            }

            return _facilities;
        }

        private List<SensorEx> ToSensorEx(List<Sensor> sensors, List<SensorType> sensorTypes, Dictionary<string, History> dicSensorHistories)
        {
            Dictionary<int, SensorTypeEx> dicSensorTypes = new Dictionary<int, SensorTypeEx>();

            foreach (SensorType sensorType in sensorTypes)
            {
                SensorTypeEx _sensorTYpe = new SensorTypeEx(sensorType);
                dicSensorTypes[_sensorTYpe.ID] = _sensorTYpe;
            }

            List<SensorEx> _sensors = new List<SensorEx>();

            foreach (Sensor sensor in sensors)
            {
                SensorTypeEx sensorType;

                if (dicSensorTypes.TryGetValue(sensor.SensorTypeID, out sensorType))
                {
                    History history;
                    int? data = null;
                    string strStatus = "";

                    if (dicSensorHistories.TryGetValue(sensor.Name, out history))
                    {
                        data = history.Data;
                        strStatus = history.Status;
                    }

                    SensorEx _sensor = new SensorEx(sensor, data, strStatus);
                    _sensor.SensorType = sensorType;
                    _sensors.Add(_sensor);
                }
            }

            return _sensors;
        }

        public ResponseFacilityTypeList GetFacilityTypeList()
        {
            string strErrorMessage;
            List<FacilityType> facilityTypes = m_dataManager.GetSelectManager().SelectFacilityTypes(null, null, out strErrorMessage);

            if (facilityTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 설비 정보를 조회하는데 실패하였습니다.";
                return new ResponseFacilityTypeList(false, strErrorMessage);
            }

            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 IT 구분 정보를 조회하는데 실패하였습니다.";
                return new ResponseFacilityTypeList(false, strErrorMessage);
            }

            Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();
            
            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType;
            }

            string strCompanyIDs = "";
            Dictionary<int, int> dicCompanyIDs = new Dictionary<int, int>();

            foreach (FacilityType facilityType in facilityTypes)
            {
                if (dicCompanyIDs.ContainsKey(facilityType.CompanyID) == false)
                {
                    dicCompanyIDs[facilityType.CompanyID] = facilityType.CompanyID;
                    strCompanyIDs += "," + facilityType.CompanyID.ToString();
                }
            }

            Dictionary<int, Company> dicCompanies = new Dictionary<int, Company>();

            if (strCompanyIDs.Length > 0)
            {
                strCompanyIDs = strCompanyIDs.Substring(1);

                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", Company.GetFieldName(Company.Fields.ID, out isNullable), strCompanyIDs);
                List<Company> companines = m_dataManager.GetSelectManager().SelectCompanies(null, strCondition, out strErrorMessage);

                if (companines == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 제조사 정보를 조회하는데 실패하였습니다.";
                    return null;
                }

                foreach (Company company in companines)
                {
                    dicCompanies[company.ID] = company;
                }
            }

            List<FacilityTypeEx> _facilityTypes = new List<FacilityTypeEx>();

            foreach (FacilityType facilityType in facilityTypes)
            {
                EquipmentType equipmentType;
                Company company;

                if (dicEquipmentTypes.TryGetValue(facilityType.EquipmentTypeID, out equipmentType) && dicCompanies.TryGetValue(facilityType.CompanyID, out company))
                {
                    FacilityTypeEx _facilityType = new FacilityTypeEx(facilityType);
                    _facilityType.EquipmentType = equipmentType;
                    _facilityType.Company = company;
                    _facilityTypes.Add(_facilityType);
                }
            }

            ResponseFacilityTypeList response = new ResponseFacilityTypeList(true, "");
            response.FacilityTypes.AddRange(_facilityTypes);
            return response;
        }

        public ResponseSensorTypeList GetSensorTypeList()
        {
            string strErrorMessage;
            List<SensorType> sensorTypes = m_dataManager.GetSelectManager().SelectSensorTypes(null, null, out strErrorMessage);

            if (sensorTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 FMS 센서 정보를 조회하는데 실패하였습니다.";
                return new ResponseSensorTypeList(false, strErrorMessage);
            }

            List<SensorTypeEx> _sensorTypes = new List<SensorTypeEx>();

            foreach (SensorType sensorType in sensorTypes)
            {
                _sensorTypes.Add(new SensorTypeEx(sensorType));
            }

            ResponseSensorTypeList response = new ResponseSensorTypeList(true, "");
            response.SensorTypes.AddRange(_sensorTypes);
            return response;
        }

        private bool SetStorageData(Dictionary<string, ItemEx> dicItemEx, string strItemNames, int nDataCenterID, out string strErrorMessage)
        {
            Dictionary<Storage.Fields, object> dicConditions = new Dictionary<Storage.Fields, object>();
            dicConditions[Storage.Fields.DataCenterID] = nDataCenterID;

            bool isNullable;
            string strCondition = strItemNames.Length > 0 ? string.Format("{0} in ({1})", Storage.GetFieldName(Storage.Fields.Basic_Name, out isNullable), strItemNames) : null;
            List<Storage> storages = m_dataManager.GetSelectManager().SelectStorages(dicConditions, strCondition, out strErrorMessage);

            if (storages == null)
                return false;

            ItemEx item;

            foreach (Storage storage in storages)
            {
                if (storage.Basic_Name != null)
                {
                    if (dicItemEx.TryGetValue(storage.Basic_Name, out item))
                        item.Storage = storage;
                }
            }

            return true;
        }

        private bool SetSecurityData(Dictionary<string, ItemEx> dicItemEx, string strItemNames, int nDataCenterID, out string strErrorMessage)
        {
            Dictionary<Security.Fields, object> dicConditions = new Dictionary<Security.Fields, object>();
            dicConditions[Security.Fields.DataCenterID] = nDataCenterID;

            bool isNullable;
            string strCondition = strItemNames.Length > 0 ? string.Format("{0} in ({1})", Security.GetFieldName(Security.Fields.Basic_Name, out isNullable), strItemNames) : null;
            List<Security> securities = m_dataManager.GetSelectManager().SelectSecurities(dicConditions, strCondition, out strErrorMessage);

            if (securities == null)
                return false;

            ItemEx item;

            foreach (Security security in securities)
            {
                if (security.Basic_Name != null)
                {
                    if (dicItemEx.TryGetValue(security.Basic_Name, out item))
                        item.Security = security;
                }
            }

            return true;
        }

        private bool SetSanSwitchData(Dictionary<string, ItemEx> dicItemEx, string strItemNames, int nDataCenterID, out string strErrorMessage)
        {
            Dictionary<SanSwitch.Fields, object> dicConditions = new Dictionary<SanSwitch.Fields, object>();
            dicConditions[SanSwitch.Fields.DataCenterID] = nDataCenterID;

            bool isNullable;
            string strCondition = strItemNames.Length > 0 ? string.Format("{0} in ({1})", SanSwitch.GetFieldName(SanSwitch.Fields.Basic_Name, out isNullable), strItemNames) : null;
            List<SanSwitch> switches = m_dataManager.GetSelectManager().SelectSanSwitches(dicConditions, strCondition, out strErrorMessage);

            if (switches == null)
                return false;

            ItemEx item;

            foreach (SanSwitch _switch in switches)
            {
                if (_switch.Basic_Name != null)
                {
                    if (dicItemEx.TryGetValue(_switch.Basic_Name, out item))
                        item.SanSwitch = _switch;
                }
            }

            return true;
        }

        private bool SetNetworkData(Dictionary<string, ItemEx> dicItemEx, string strItemNames, int nDataCenterID, out string strErrorMessage)
        {
            Dictionary<Network.Fields, object> dicConditions = new Dictionary<Network.Fields, object>();
            dicConditions[Network.Fields.DataCenterID] = nDataCenterID;

            bool isNullable;
            string strCondition = strItemNames.Length > 0 ? string.Format("{0} in ({1})", Network.GetFieldName(Network.Fields.Basic_Name, out isNullable), strItemNames) : null;
            List<Network> networks = m_dataManager.GetSelectManager().SelectNetworks(dicConditions, strCondition, out strErrorMessage);

            if (networks == null)
                return false;

            ItemEx item;

            foreach (Network network in networks)
            {
                if (network.Basic_Name != null)
                {
                    if (dicItemEx.TryGetValue(network.Basic_Name, out item))
                        item.Network = network;
                }
            }

            return true;
        }

        private bool SetEtcData(Dictionary<string, ItemEx> dicItemEx, string strItemNames, int nDataCenterID, out string strErrorMessage)
        {
            Dictionary<Etc.Fields, object> dicConditions = new Dictionary<Etc.Fields, object>();
            dicConditions[Etc.Fields.DataCenterID] = nDataCenterID;

            bool isNullable;
            string strCondition = strItemNames.Length > 0 ? string.Format("{0} in ({1})", Etc.GetFieldName(Etc.Fields.Basic_Name, out isNullable), strItemNames) : null;
            List<Etc> etcs = m_dataManager.GetSelectManager().SelectEtcs(dicConditions, strCondition, out strErrorMessage);

            if (etcs == null)
                return false;

            ItemEx item;

            foreach (Etc etc in etcs)
            {
                if (etc.Basic_Name != null)
                {
                    if (dicItemEx.TryGetValue(etc.Basic_Name, out item))
                        item.Etc = etc;
                }
            }

            return true;
        }

        private bool SetBackupData(Dictionary<string, ItemEx> dicItemEx, string strItemNames, int nDataCenterID, out string strErrorMessage)
        {
            Dictionary<Backup.Fields, object> dicConditions = new Dictionary<Backup.Fields, object>();
            dicConditions[Backup.Fields.DataCenterID] = nDataCenterID;

            bool isNullable;
            string strCondition = strItemNames.Length > 0 ? string.Format("{0} in ({1})", Backup.GetFieldName(Backup.Fields.Basic_Name, out isNullable), strItemNames) : null;
            List<Backup> backups = m_dataManager.GetSelectManager().SelectBackups(dicConditions, strCondition, out strErrorMessage);

            if (backups == null)
                return false;

            ItemEx item;

            foreach (Backup backup in backups)
            {
                if (backup.Basic_Name != null)
                {
                    if (dicItemEx.TryGetValue(backup.Basic_Name, out item))
                        item.Backup = backup;
                }
            }

            return true;
        }

        private bool SetBoxData(Dictionary<string, ItemEx> dicItemEx, string strItemNames, int nDataCenterID, out string strErrorMessage)
        {
            Dictionary<Box.Fields, object> dicConditions = new Dictionary<Box.Fields, object>();
            dicConditions[Box.Fields.DataCenterID] = nDataCenterID;

            bool isNullable;
            string strCondition = strItemNames.Length > 0 ? string.Format("{0} in ({1})", Box.GetFieldName(Box.Fields.Basic_Name, out isNullable), strItemNames) : null;
            List<Box> boxes = m_dataManager.GetSelectManager().SelectBoxes(dicConditions, strCondition, out strErrorMessage);

            if (boxes == null)
                return false;

            ItemEx item;

            foreach (Box box in boxes)
            {
                if (box.Basic_Name != null)
                {
                    if (dicItemEx.TryGetValue(box.Basic_Name, out item))
                        item.Box = box;
                }
            }

            return true;
        }

        private List<ItemTypeEx> ToItemTypeEx(List<ItemType> itemTypes, Dictionary<int, Company> dicCompanies, out string strErrorMessage)
        {
            if (dicCompanies == null)
            {
                List<Company> companies = m_dataManager.GetSelectManager().SelectCompanies(null, null, out strErrorMessage);

                if (companies == null)
                    return null;

                dicCompanies = new Dictionary<int, Company>();

                foreach (Company company in companies)
                {
                    dicCompanies[company.ID] = company;
                }
            }

            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
                return null;

            

            Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();

            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType;
            }

            List<ItemTypeEx> itemTypeExes = new List<ItemTypeEx>();

            foreach (ItemType itemType in itemTypes)
            {
                Company company = null;
                EquipmentType equipmentType = null;

                dicCompanies.TryGetValue(itemType.CompanyID, out company);
                dicEquipmentTypes.TryGetValue(itemType.EquipmentType, out equipmentType);

                ItemTypeEx itemTypeEx = new ItemTypeEx(itemType);
                itemTypeEx.Company = company;
                itemTypeEx.EquipmentTypeData = equipmentType;

                itemTypeExes.Add(itemTypeEx);
            }

            return itemTypeExes;
        }

        public ResponseOption GetOption(RequestOption data)
        {
            ResponseOption result = new ResponseOption();

            Dictionary<Option.Fields, object> dicCondition = new Dictionary<Option.Fields, object>();
            dicCondition.Add(Option.Fields.UserID, data.UserID);
            dicCondition.Add(Option.Fields.Category, data.Category);

            string strErrorMessage = null;
            List<Option> options = m_dataManager.GetSelectManager().SelectAccountOptions(dicCondition, null, out strErrorMessage);
            if (options == null)
            {
                result.Success = false;
                result.Message = "사용자의 옵션 정보를 읽을 수 없습니다.";
                return result;
            }

            result.Success = true;
            result.Options = options;
            return result;
        }

        public ResponseViewport GetViewport(int dataCenterID, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseViewport(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(dataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseViewport(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new ResponseViewport(false, "허가되지 않은 VDC의 정보에 접근할 수 없습니다.");

            Dictionary<Model.DataCenter.Viewport.Fields, object> dicConditions = new Dictionary<Model.DataCenter.Viewport.Fields, object>();
            dicConditions[Model.DataCenter.Viewport.Fields.DataCenterID] = dataCenterID;

            Model.DataCenter.Viewport viewport = m_dataManager.GetSelectManager().SelectDataCenterViewport(dataCenterID, out strErrorMessage);

            if (viewport == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC의 3D Viewport 정보를 조회하는데 실패하였습니다.";
                return new ResponseViewport(false, strErrorMessage);
            }

            ResponseViewport response = new ResponseViewport(true, "");

            response.DataCenterID = dataCenterID;
            response.PositionX = (float)viewport.PositionX;
            response.PositionY = (float)viewport.PositionY;
            response.PositionZ = (float)viewport.PositionZ;
            response.RotationX = (float)viewport.RotationX;
            response.RotationY = (float)viewport.RotationY;
            response.RotationZ = (float)viewport.RotationZ;

            return response;
        }

        public ResponseRackNItemTypes GetRackNItemTypes()
        {
            string strErrorMessage;
            List<RackType> rackTypes = m_dataManager.GetSelectManager().SelectRackTypes(null, null, out strErrorMessage);

            if (rackTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 RackType 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItemTypes(false, strErrorMessage);
            }

            List<Company> companies = m_dataManager.GetSelectManager().SelectCompanies(null, null, out strErrorMessage);

            if (companies == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 제조사 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItemTypes(false, strErrorMessage);
            }

            Dictionary<int, Company> dicCompanies = new Dictionary<int, Company>();

            foreach (Company company in companies)
            {
                dicCompanies[company.ID] = company;
            }

            List<RackTypeEx> _rackTypes = new List<RackTypeEx>();

            foreach (RackType rackType in rackTypes)
            {
                Company company;

                if (dicCompanies.TryGetValue(rackType.CompanyID, out company))
                {
                    RackTypeEx _rackType = new RackTypeEx(rackType);
                    _rackType.Company = company;
                    _rackTypes.Add(_rackType);
                }
            }

            List<ItemType> itemTypes = m_dataManager.GetSelectManager().SelectItemTypes(null, null, out strErrorMessage);

            if (itemTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 IT 자산타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItemTypes(false, strErrorMessage);
            }

            List<ItemTypeEx> itemTypeExes = ToItemTypeEx(itemTypes, dicCompanies, out strErrorMessage);

            if (itemTypeExes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 IT 자산타입 정보를 조회하지 못하였습니다.";
                return new ResponseRackNItemTypes(false, strErrorMessage);
            }

            List<FacilityType> facilityTypes = m_dataManager.GetSelectManager().SelectFacilityTypes(null, null, out strErrorMessage);

            if (facilityTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 설비타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseRackNItemTypes(false, strErrorMessage);
            }

            string strCompanyIDs = "";
            Dictionary<int, int> dicCompanyIDs = new Dictionary<int, int>();
            Dictionary<int, int> dicEquipmentTypeIDs = new Dictionary<int, int>();

            foreach (FacilityType facilityType in facilityTypes)
            {
                dicEquipmentTypeIDs[facilityType.EquipmentTypeID] = facilityType.EquipmentTypeID;

                if (dicCompanyIDs.ContainsKey(facilityType.CompanyID) == false)
                {
                    dicCompanyIDs[facilityType.CompanyID] = facilityType.CompanyID;
                    strCompanyIDs += "," + facilityType.CompanyID.ToString();
                }
            }

            string strEquipmentTypeIDs = "";

            foreach (KeyValuePair<int, int> pair in dicEquipmentTypeIDs)
            {
                strEquipmentTypeIDs += "," + pair.Key.ToString();
            }

            List<FacilityTypeEx> _facilityTypes = new List<FacilityTypeEx>();

            if (strEquipmentTypeIDs.Length > 0)
            {
                strEquipmentTypeIDs = strEquipmentTypeIDs.Substring(1);

                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", EquipmentType.GetFieldName(EquipmentType.Fields.ID, out isNullable), strEquipmentTypeIDs);
                List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, strCondition, out strErrorMessage);

                if (equipmentTypes == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 전체 IT 자산구분 정보를 조회하는데 실패하였습니다.";
                    return new ResponseRackNItemTypes(false, strErrorMessage);
                }

                Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();

                foreach (EquipmentType equipmentType in equipmentTypes)
                {
                    dicEquipmentTypes[equipmentType.ID] = equipmentType;
                }

                foreach (FacilityType facilityType in facilityTypes)
                {
                    EquipmentType equipmentType;
                    Company company;

                    if (dicEquipmentTypes.TryGetValue(facilityType.EquipmentTypeID, out equipmentType) && dicCompanies.TryGetValue(facilityType.CompanyID, out company))
                    {
                        FacilityTypeEx _facilityType = new FacilityTypeEx(facilityType);
                        _facilityType.EquipmentType = equipmentType;
                        _facilityType.Company = company;
                        _facilityTypes.Add(_facilityType);
                    }
                }
            }

            ResponseRackNItemTypes response = new ResponseRackNItemTypes(true, "");

            response.RackTypes.AddRange(_rackTypes);
            response.ItemTypes.AddRange(itemTypeExes);
            response.FacilityTypes.AddRange(_facilityTypes);

            return response;
        }

        public ResponseNewItem CreateNewItem(RequestNewItem data)
        {
            string strErrorMessage;
            ItemType itemType = m_dataManager.GetSelectManager().SelectItemType(data.ItemTypeID, out strErrorMessage);

            if (itemType == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 IT 자산타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseNewItem(false, strErrorMessage);
            }

            string strGuid = Guid.NewGuid().ToString();
            string strSimpleGuid = strGuid.Substring(0, 2);

            DateTime dtNow = DateTime.Now;
            ItemEx item = new ItemEx();

            item.CenterID = data.DataCenterID;
            item.ID = -1;
            item.ItemTypeID = itemType.ID;
            item.RackID = data.RackID;
            item.RegDate = DateTime.Now;
            item.UPos = data.UnitPosition;
            item.Name = itemType.ModelName + "_" + string.Format("{0}{1:00}{2:00}{3:00}{4:00}{5:00}_{6}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second, strSimpleGuid);
            item.Usage = "";
            item.PositionInShelf = itemType.Shelf != null && ((bool)itemType.Shelf) ? (int?)Item.ShelfPosition.Center : null;

            ResponseNewItem response = new ResponseNewItem(true, "");
            response.Item = item;
            return response;
        }

        public ResponseNewRack CreateNewRack(RequestNewRack data)
        {
            string strErrorMessage;
            RackType rackType = m_dataManager.GetSelectManager().SelectRackType(data.RackTypeID, out strErrorMessage);

            if (rackType == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 RackType 정보를 조회하는데 실패하였습니다.";
                return new ResponseNewRack(false, strErrorMessage);
            }

            string strGuid = Guid.NewGuid().ToString();
            string strSimpleGuid = strGuid.Substring(0, 2);

            DateTime dtNow = DateTime.Now;
            Rack rack = new Rack(); ;

            rack.CenterID = data.DataCenterID;
            rack.ID = -1;
            rack.Name = rackType.ModelName + "_" + string.Format("{0}{1:00}{2:00}{3:00}{4:00}{5:00}_{6}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second, strSimpleGuid);
            rack.RackGroupID = null;
            rack.RackTypeID = rackType.ID;
            rack.Rotation = 0;
            rack.X = data.X;
            rack.Y = data.Y;
            rack.Z = 0;
            rack.RegDate = DateTime.Now;
            rack.ChangeDate = null;

            ResponseNewRack response = new ResponseNewRack(true, "");
            response.Rack = rack;
            return response;
        }

        public ResponseNewRackGroup CreateNewRackGroup(RequestNewRackGroup data)
        {
            string strGuid = Guid.NewGuid().ToString();
            string strSimpleGuid = strGuid.Substring(0, 2);

            DateTime dtNow = DateTime.Now;
            RackGroup rackGroup = new RackGroup(); ;

            rackGroup.CenterID = data.DataCenterID;
            rackGroup.ID = -1;
            rackGroup.GroupName = "rackGroup_" + string.Format("{0}{1:00}{2:00}{3:00}{4:00}{5:00}_{6}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second, strSimpleGuid);

            ResponseNewRackGroup response = new ResponseNewRackGroup(true, "");
            response.RackGroup = rackGroup;
            return response;
        }

        public ResponseNewRacks CreateNewRacks(RequestNewRacks data)
        {
            string strErrorMessage;
            RackType rackType = m_dataManager.GetSelectManager().SelectRackType(data.RackTypeID, out strErrorMessage);

            if (rackType == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 Rack Type 정보를 조회하는데 실패하였습니다.";
                return new ResponseNewRacks(false, strErrorMessage);
            }

            DateTime dtNow = DateTime.Now;
            ResponseNewRacks response = new ResponseNewRacks(true, "");

            for (int i = 0; i < data.RackCount; i++)
            {
                string strGuid = Guid.NewGuid().ToString();
                string strSimpleGuid = strGuid.Substring(0, 4);

                Rack rack = new Rack(); ;

                rack.CenterID = data.DataCenterID;
                rack.ID = -(i + 1);
                rack.Name = rackType.ModelName + "_" + string.Format("{0}{1:00}{2:00}{3:00}{4:00}{5:00}_{6}", dtNow.Year, dtNow.Month, dtNow.Day, dtNow.Hour, dtNow.Minute, dtNow.Second, strSimpleGuid);
                rack.RackGroupID = null;
                rack.RackTypeID = rackType.ID;
                rack.Rotation = data.Rotation;
                rack.X = 0;
                rack.Y = 0;
                rack.Z = 0;
                rack.RegDate = DateTime.Now;
                rack.ChangeDate = null;

                response.Racks.Add(rack);
            }

            return response;
        }

        public ResponseNewFacility CreateNewFacility(RequestNewFacility data)
        {
            string strErrorMessage;
            FacilityType facilityType = m_dataManager.GetSelectManager().SelectFacilityType(data.FacilityTypeID, out strErrorMessage);

            if (facilityType == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 설비타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseNewFacility(false, strErrorMessage);
            }

            Facility facility = new Facility(); ;

            facility.DataCenterID = data.DataCenterID;
            facility.ID = -1;
            facility.FacilityTypeID = facilityType.ID;
            facility.Rotation = 0;
            facility.X = data.X;
            facility.Y = data.Y;
            facility.Z = 0;
            facility.RegDate = DateTime.Now;
            facility.ChangeDate = null;

            ResponseNewFacility response = new ResponseNewFacility(true, "");
            response.Facility = facility;
            return response;
        }

        private string GetDefaultSensorName(List<Sensor> sensors, string strSensorCode)
        {
            Dictionary<string, Sensor> dicSensors = new Dictionary<string, Sensor>();

            foreach (Sensor sensor in sensors)
            {
                dicSensors[sensor.Name] = sensor;
            }

            int nSensorCount = sensors.Count;

            for (int i=1;i<=nSensorCount+1;i++)
            {
                string strName = i < 100 ? string.Format("{1}-{0:00}", i, strSensorCode) : string.Format("{1}-{0}", i, strSensorCode);

                if (dicSensors.ContainsKey(strName) == false)
                    return strName;
            }

            return strSensorCode + "-000001";
        }

        public ResponseNewSensor CreateNewSensor(RequestNewSensor data)
        {
            string strErrorMessage;
            SensorType sensorType = m_dataManager.GetSelectManager().SelectSensorType(data.SensorTypeID, out strErrorMessage);

            if (sensorType == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 FMS 센서타입 정보를 조회하는데 실패하였습니다.";
                return new ResponseNewSensor(false, strErrorMessage);
            }

            Dictionary<Sensor.Fields, object> dicConditions = new Dictionary<Sensor.Fields, object>();
            dicConditions[Sensor.Fields.CenterID] = data.DataCenterID;

            List<Sensor> sensors = m_dataManager.GetSelectManager().SelectSensors(dicConditions, null, out strErrorMessage);

            if (sensors == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC내 FMS 센서 정보를 조회하는데 실패하였습니다.";
                return new ResponseNewSensor(false, strErrorMessage);
            }

            Sensor sensor = new Sensor(); ;

            sensor.Name = GetDefaultSensorName(sensors, sensorType.Code);
            sensor.CenterID = data.DataCenterID;
            sensor.ID = -1;
            sensor.SensorTypeID = sensorType.ID;
            sensor.X = data.X;
            sensor.Y = data.Y;
            sensor.Z = 0;
            sensor.RegDate = DateTime.Now;
            sensor.ChangeDate = null;

            SensorTypeEx.SetSensorDefaultStatus(sensor, sensorType);

            ResponseNewSensor response = new ResponseNewSensor(true, "");
            response.Sensor = sensor;
            return response;
        }

        public ResponseItemDetails GetItemDetails(int nDataCenterID, int? nItemType, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseItemDetails(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(nDataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseItemDetails(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new ResponseItemDetails(false, "허가되지 않은 VDC의 자산 상세정보에 접근중입니다.");

            /*Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
            dicConditions[Item.Fields.CenterID] = nDataCenterID;

            List<Item> items = m_dataManager.GetSelectManager().SelectItems(dicConditions, null, out strErrorMessage);

            if (items == null)
                return new ResponseItemDetails(false, strErrorMessage);
            else if (items.Count == 0)
                return new ResponseItemDetails(true, "");

            string strItemIDs = null;

            foreach (Item item in items)
            {
                if (strItemIDs == null)
                    strItemIDs = item.ID.ToString();
                else
                    strItemIDs += "," + item.ID.ToString();
            }*/

            ResponseItemDetails response = new ResponseItemDetails(true, "");

            //response.Items.AddRange(items);

            if (nItemType == (int)RequestItemDetails.ItemTypeID.Server || nItemType == null)
            {
                Dictionary<ItemServer.Fields, object> dicConditions = new Dictionary<ItemServer.Fields, object>();
                dicConditions[ItemServer.Fields.DataCenterID] = nDataCenterID;

                List<ItemServer> servers = m_dataManager.GetSelectManager().SelectItemServers(dicConditions, null, out strErrorMessage);

                if (servers == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 서버 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.ItemServers.AddRange(servers);
            }
            if (nItemType == (int)RequestItemDetails.ItemTypeID.Box || nItemType == null)
            {
                Dictionary<Model.ItemData.Box.Fields, object> dicConditions = new Dictionary<Model.ItemData.Box.Fields, object>();
                dicConditions[Model.ItemData.Box.Fields.DataCenterID] = nDataCenterID;

                List<Model.ItemData.Box> boxes = m_dataManager.GetSelectManager().SelectBoxes(dicConditions, null, out strErrorMessage);

                if (boxes == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 박스 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.Boxs.AddRange(boxes);
            }
            if (nItemType == (int)RequestItemDetails.ItemTypeID.Network || nItemType == null)
            {
                Dictionary<Model.ItemData.Network.Fields, object> dicConditions = new Dictionary<Model.ItemData.Network.Fields, object>();
                dicConditions[Model.ItemData.Network.Fields.DataCenterID] = nDataCenterID;

                List<Model.ItemData.Network> networks = m_dataManager.GetSelectManager().SelectNetworks(dicConditions, null, out strErrorMessage);

                if (networks == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 네트웍 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.Networks.AddRange(networks);
            }
            if (nItemType == (int)RequestItemDetails.ItemTypeID.SanSwitch || nItemType == null)
            {
                Dictionary<Model.ItemData.SanSwitch.Fields, object> dicConditions = new Dictionary<Model.ItemData.SanSwitch.Fields, object>();
                dicConditions[Model.ItemData.SanSwitch.Fields.DataCenterID] = nDataCenterID;

                List<Model.ItemData.SanSwitch> sanSwitches = m_dataManager.GetSelectManager().SelectSanSwitches(dicConditions, null, out strErrorMessage);

                if (sanSwitches == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 SAN 스위치 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.SanSwitchs.AddRange(sanSwitches);
            }
            if (nItemType == (int)RequestItemDetails.ItemTypeID.Security || nItemType == null)
            {
                Dictionary<Model.ItemData.Security.Fields, object> dicConditions = new Dictionary<Model.ItemData.Security.Fields, object>();
                dicConditions[Model.ItemData.Security.Fields.DataCenterID] = nDataCenterID;

                List<Model.ItemData.Security> securities = m_dataManager.GetSelectManager().SelectSecurities(dicConditions, null, out strErrorMessage);

                if (securities == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 보안 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.Securitys.AddRange(securities);
            }
            if (nItemType == (int)RequestItemDetails.ItemTypeID.BackUp || nItemType == null)
            {
                Dictionary<Model.ItemData.Backup.Fields, object> dicConditions = new Dictionary<Model.ItemData.Backup.Fields, object>();
                dicConditions[Model.ItemData.Backup.Fields.DataCenterID] = nDataCenterID;

                List<Model.ItemData.Backup> backups = m_dataManager.GetSelectManager().SelectBackups(dicConditions, null, out strErrorMessage);

                if (backups == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 백업 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.Backups.AddRange(backups);
            }
            if (nItemType == (int)RequestItemDetails.ItemTypeID.Storage || nItemType == null)
            {
                Dictionary<Model.ItemData.Storage.Fields, object> dicConditions = new Dictionary<Model.ItemData.Storage.Fields, object>();
                dicConditions[Model.ItemData.Storage.Fields.DataCenterID] = nDataCenterID;

                List<Model.ItemData.Storage> storages = m_dataManager.GetSelectManager().SelectStorages(dicConditions, null, out strErrorMessage);

                if (storages == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 스토리지 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.Storages.AddRange(storages);
            }
            if (nItemType == (int)RequestItemDetails.ItemTypeID.Etc || nItemType == null)
            {
                Dictionary<Model.ItemData.Etc.Fields, object> dicConditions = new Dictionary<Model.ItemData.Etc.Fields, object>();
                dicConditions[Model.ItemData.Etc.Fields.DataCenterID] = nDataCenterID;

                List<Model.ItemData.Etc> etcs = m_dataManager.GetSelectManager().SelectEtcs(dicConditions, null, out strErrorMessage);

                if (etcs == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 기타 IT 자산 정보를 조회하는데 실패하였습니다.";
                    return new ResponseItemDetails(false, strErrorMessage);
                }

                response.Etcs.AddRange(etcs);
            }

            return response;
        }

        private string GetItemDetailCondition(int nDataCenterID, string strItemType, string strFieldName)
        {
            bool isNullable;
            string strCondition = string.Format("select {0} from {1} where {2} = {3} and {4} in (Select {5} from {6} where {7} = (Select {8} from {9} where {10} = '{11}'))",
                Item.GetFieldName(Item.Fields.ID, out isNullable),
                Item.TableName,
                Item.GetFieldName(Item.Fields.CenterID, out isNullable),
                nDataCenterID,
                Item.GetFieldName(Item.Fields.ItemTypeID, out isNullable),
                ItemType.GetFieldName(ItemType.Fields.ID, out isNullable),
                ItemType.TableName,
                ItemType.GetFieldName(ItemType.Fields.EquipmentType, out isNullable),
                EquipmentType.GetFieldName(EquipmentType.Fields.ID, out isNullable),
                EquipmentType.TableName,
                EquipmentType.GetFieldName(EquipmentType.Fields.EngName, out isNullable),
                strItemType);

            return string.Format("{0} in ({1})", strFieldName, strCondition);
        }

        public ResponseSiteNDataCenters GetSiteDatas(RequestSiteNDataCenters data)
        {
            string strErrorMessage;
            Dictionary<User.Fields, object> dicConditions = new Dictionary<User.Fields, object>();
            dicConditions[User.Fields.ID] = data.UserID;

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinUserDataCenterDataCenterData(dicConditions, null, null, null, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 사용자 계정 정보를 이용한 VDC 정보를 조회하는데 실패하였습니다.";
                return new ResponseSiteNDataCenters(false, strErrorMessage);
            }

            List<Model.DataCenter.DataCenter> dataCenters = new List<Model.DataCenter.DataCenter>();
            List<Model.DataCenter.Data> dataCenterDatas = new List<Model.DataCenter.Data>();
            int nDataCount = arrDatas.Count;

            User user = null;
            Dictionary<int, int> dicSiteIDs = new Dictionary<int, int>();
            string strSitesIDs = "";

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is User && arrDatas[i + 1] is Model.DataCenter.DataCenter && arrDatas[i + 2] is Model.DataCenter.Data)
                {
                    Model.DataCenter.DataCenter dataCenter = (Model.DataCenter.DataCenter)arrDatas[i + 1];
                    Model.DataCenter.Data dataCenterData = (Model.DataCenter.Data)arrDatas[i + 2];

                    dataCenters.Add(dataCenter);
                    dataCenterDatas.Add(dataCenterData);

                    if (dicSiteIDs.ContainsKey(dataCenter.SiteID) == false)
                    {
                        dicSiteIDs[dataCenter.SiteID] = dataCenter.SiteID;

                        if (strSitesIDs.Length == 0)
                            strSitesIDs = dataCenter.SiteID.ToString();
                        else
                            strSitesIDs += ", " + dataCenter.SiteID.ToString();
                    }

                    user = (User)arrDatas[i];
                }
            }

            if (user == null)
            {
                Dictionary<User.Fields, object> dicUserCondition = new Dictionary<User.Fields, object>();
                dicUserCondition[User.Fields.ID] = data.UserID;

                ArrayList _arrDatas = m_dataManager.GetSelectManager().JoinUserUserDatas(dicUserCondition, null, null, out strErrorMessage);

                if (_arrDatas == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 사용자 계정 상세정보를 조회하는데 실패하였습니다.";
                    return new ResponseSiteNDataCenters(false, strErrorMessage);
                }
                else if (_arrDatas.Count >= 2)
                {
                    user = (User)_arrDatas[0];
                    UserData userData = (UserData)_arrDatas[1];

                    if (strSitesIDs.Length == 0)
                        strSitesIDs = userData.SiteID.ToString();
                }
            }

            bool isNullable;

            // VDS 관리자일 경우
            if (user != null && user.UserLevel == 1)
            {
                string strCondition = string.Format("{0} in ({1})", Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.SiteID, out isNullable), strSitesIDs);
                List<Model.DataCenter.DataCenter> centers = m_dataManager.GetSelectManager().SelectDataCenters(null, strCondition, out strErrorMessage);

                if (centers == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 VDC 정보를 조회하는데 실패하였습니다.";
                    return new ResponseSiteNDataCenters(false, strErrorMessage);
                }

                dataCenters.Clear();
                dataCenters.AddRange(centers);
            }

            List<Model.Site.Site> sites = new List<Model.Site.Site>();
            List<Model.Site.Data> siteDatas = new List<Model.Site.Data>();

            if (strSitesIDs.Length > 0)
            {
                string strCondition = string.Format("{0} in ({1})", Model.Site.Site.GetFieldName(Model.Site.Site.Fields.ID, out isNullable), strSitesIDs);
                ArrayList arrDatas2 = m_dataManager.GetSelectManager().JoinSiteSiteData(null, null, strCondition, out strErrorMessage);

                if (arrDatas2 == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 고객사와 그 부가정보를 조회하는데 실패하였습니다.";
                    return new ResponseSiteNDataCenters(false, strErrorMessage);
                }

                int nDataCount2 = arrDatas2.Count;

                for (int i=0;i<nDataCount2-1;i+=2)
                {
                    if (arrDatas2[i] is Model.Site.Site && arrDatas2[i + 1] is Model.Site.Data)
                    {
                        Model.Site.Site site = (Model.Site.Site)arrDatas2[i];
                        Model.Site.Data siteData = (Model.Site.Data)arrDatas2[i + 1];

                        sites.Add(site);
                        siteDatas.Add(siteData);
                    }
                }
            }

            int nSiteCount = sites.Count;
            Dictionary<int, SiteEx> dicSites = new Dictionary<int, SiteEx>();

            for (int i=0;i<nSiteCount;i++)
            {
                Model.Site.Site site = sites[i];
                Model.Site.Data siteData = siteDatas[i];

                SiteEx _site = new SiteEx(site, siteData);
                dicSites[_site.ID] = _site;
            }

            Dictionary<int, int> dicDataCenterNations = new Dictionary<int, int>();

            foreach (Model.DataCenter.DataCenter center in dataCenters)
            {
                SiteEx site;

                if (dicSites.TryGetValue(center.SiteID, out site))
                {
                    site.DataCenters.Add(center);
                    dicDataCenterNations[center.NationID] = center.NationID;
                }
            }

            List<Nation> nations = m_dataManager.GetSelectManager().SelectNations(null, null, out strErrorMessage);

            if (nations == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 국가정보를 조회하는데 실패하였습니다.";
                return new ResponseSiteNDataCenters(false, strErrorMessage);
            }

            ResponseSiteNDataCenters response = new ResponseSiteNDataCenters(true, "");

            response.AllNations.AddRange(nations);
            response.Sites.AddRange(dicSites.Values);

            foreach (Nation nation in nations)
            {
                if (dicDataCenterNations.ContainsKey(nation.ID))
                    response.Nations.Add(nation);
            }

            return response;
        }

        public ResponseDataCenterList GetDataCenterList(RequestGetDataCenters data)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, data.UserID, out siteID, out strErrorMessage) == false)
                return new ResponseDataCenterList(false, strErrorMessage);

            if (data.SiteID != siteID)
                return new ResponseDataCenterList(false, "허가되지 않은 정보에 접근중입니다.");

            Dictionary<User.Fields, object> dicUserConditions = new Dictionary<User.Fields, object>();
            dicUserConditions[User.Fields.ID] = data.UserID;

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinUserDataCenterDataCenterData(dicUserConditions, null, null, null, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 사용자 계정정보를 통한 VDC와 그 부가정보를 조회하는데 실패하였습니다.";
                return new ResponseDataCenterList(false, strErrorMessage);
            }

            User user = null;
            List<Model.DataCenter.DataCenter> userDataCenters = new List<Model.DataCenter.DataCenter>();
            List<Model.DataCenter.Data> userDataCenterDatas = new List<Model.DataCenter.Data>();
            int nDataCount = arrDatas.Count;

            string strSiteIDs = "";
            Dictionary<int, int> dicSiteIDs = new Dictionary<int, int>();

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is User && arrDatas[i + 1] is Model.DataCenter.DataCenter && arrDatas[i + 2] is Model.DataCenter.Data)
                {
                    user = (User)arrDatas[i];
                    Model.DataCenter.DataCenter dataCenter = (Model.DataCenter.DataCenter)arrDatas[i + 1];
                    Model.DataCenter.Data dataCenterData = (Model.DataCenter.Data)arrDatas[i + 2];

                    userDataCenters.Add(dataCenter);
                    userDataCenterDatas.Add(dataCenterData);

                    if (dicSiteIDs.ContainsKey(dataCenter.SiteID) == false)
                    {
                        dicSiteIDs[dataCenter.SiteID] = dataCenter.SiteID;

                        if (strSiteIDs.Length == 0)
                            strSiteIDs = dataCenter.SiteID.ToString();
                        else
                            strSiteIDs += ", " + dataCenter.SiteID.ToString();
                    }
                }
            }

            if (user == null)
            {
                Dictionary<User.Fields, object> dicUserCondition = new Dictionary<User.Fields, object>();
                dicUserCondition[User.Fields.ID] = data.UserID;

                ArrayList _arrDatas = m_dataManager.GetSelectManager().JoinUserUserDatas(dicUserCondition, null, null, out strErrorMessage);

                if (_arrDatas == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 사용자 계정과 그 부가정보를 조회하는데 실패하였습니다.";
                    return new ResponseDataCenterList(false, strErrorMessage);
                }
                else if (_arrDatas.Count < 2)
                    return new ResponseDataCenterList(false, "사용자 계정정보를 찾을수 없습니다.");

                user = (User)_arrDatas[0];
                UserData userData = (UserData)_arrDatas[1];

                if (strSiteIDs.Length == 0)
                    strSiteIDs = userData.SiteID.ToString();
            }

            // VDS 관리자일때
            if (user.UserLevel == 1)
            {
                bool isNullable;
                string strCondition = string.Format("{0} in ({1})", Model.DataCenter.DataCenter.GetFieldName(Model.DataCenter.DataCenter.Fields.SiteID, out isNullable), strSiteIDs);
                ArrayList arrDatas2 = m_dataManager.GetSelectManager().JoinDataCenterDataCenterData(null, null, strCondition, out strErrorMessage);

                if (arrDatas2 == null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 VDC와 그 부가정보를 조회하는데 실패하였습니다.";
                    return new ResponseDataCenterList(false, strErrorMessage);
                }

                int nDataCount2 = arrDatas2.Count;

                userDataCenters.Clear();
                userDataCenterDatas.Clear();

                for (int i=0;i<nDataCount2-1;i+=2)
                {
                    if (arrDatas2[i] is Model.DataCenter.DataCenter && arrDatas2[i + 1] is Model.DataCenter.Data)
                    {
                        Model.DataCenter.DataCenter dataCenter = (Model.DataCenter.DataCenter)arrDatas2[i];
                        Model.DataCenter.Data dataCenterData = (Model.DataCenter.Data)arrDatas2[i + 1];

                        userDataCenters.Add(dataCenter);
                        userDataCenterDatas.Add(dataCenterData);
                    }
                }
            }

            Dictionary<int, Model.DataCenter.Data> dicDataCenterDatas = new Dictionary<int, Model.DataCenter.Data>();
            Dictionary<int, Model.DataCenter.DataCenter> dicDataCenters = new Dictionary<int, Model.DataCenter.DataCenter>();
            int nDataCenterCount = userDataCenters.Count;

            for (int i=0;i<nDataCenterCount;i++)
            {
                Model.DataCenter.DataCenter dataCenter = userDataCenters[i];
                dicDataCenters[dataCenter.ID] = dataCenter;
                dicDataCenterDatas[dataCenter.ID] = userDataCenterDatas[i];
            }

            Dictionary<Model.DataCenter.DataCenter.Fields, object> dicConditions = new Dictionary<Model.DataCenter.DataCenter.Fields, object>();

            if (data.NationID > 0 && data.SiteID > 0 && data.CreationType != null)
            {
                dicConditions[Model.DataCenter.DataCenter.Fields.NationID] = data.NationID;
                dicConditions[Model.DataCenter.DataCenter.Fields.SiteID] = data.SiteID;
                dicConditions[Model.DataCenter.DataCenter.Fields.CreationType] = data.CreationType;
            }
            else if (data.NationID > 0 && data.SiteID > 0)
            {
                dicConditions[Model.DataCenter.DataCenter.Fields.NationID] = data.NationID;
                dicConditions[Model.DataCenter.DataCenter.Fields.SiteID] = data.SiteID;
            }
            else if (data.NationID > 0 && data.CreationType != null)
            {
                dicConditions[Model.DataCenter.DataCenter.Fields.NationID] = data.NationID;
                dicConditions[Model.DataCenter.DataCenter.Fields.CreationType] = data.CreationType;
            }
            else if (data.SiteID > 0 && data.CreationType != null)
            {
                dicConditions[Model.DataCenter.DataCenter.Fields.SiteID] = data.SiteID;
                dicConditions[Model.DataCenter.DataCenter.Fields.CreationType] = data.CreationType;
            }
            else if (data.NationID > 0)
            {
                dicConditions[Model.DataCenter.DataCenter.Fields.NationID] = data.NationID;
            }
            else if (data.SiteID > 0)
            {
                dicConditions[Model.DataCenter.DataCenter.Fields.SiteID] = data.SiteID;
            }
            else if (data.CreationType != null)
            {
                dicConditions[Model.DataCenter.DataCenter.Fields.CreationType] = data.CreationType;
            }
            else
                dicConditions = null;

            ArrayList arrDatas3 = m_dataManager.GetSelectManager().JoinDataCenterDataCenterData(dicConditions, null, null, out strErrorMessage);

            if (arrDatas3 == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC와 그 부가정보를 조회하는데 실패하였습니다.";
                return new ResponseDataCenterList(false, strErrorMessage);
            }

            List<DataCenterEx> dataCenters = new List<DataCenterEx>();
            int nDataCount3 = arrDatas3.Count;

            for (int i=0;i<nDataCount3-1;i+=2)
            {
                if (arrDatas3[i] is Model.DataCenter.DataCenter && arrDatas3[i + 1] is Model.DataCenter.Data)
                {
                    Model.DataCenter.DataCenter dataCenter = (Model.DataCenter.DataCenter)arrDatas3[i];
                    Model.DataCenter.Data dataCenterData = (Model.DataCenter.Data)arrDatas3[i + 1];

                    if (dicDataCenters.ContainsKey(dataCenter.ID))
                    {
                        if (data.Company == null || data.Company == dataCenterData.Company)
                        {
                            DataCenterEx dataCenterEx = new DataCenterEx(dataCenter, dataCenterData);
                            dataCenters.Add(dataCenterEx);
                        }
                    }
                }
            }

            if (SetDataCenterRatio(dataCenters, out strErrorMessage) == false)
                return new ResponseDataCenterList(false, strErrorMessage);

            ResponseDataCenterList response = new ResponseDataCenterList(true, "");
            response.DataCenters.AddRange(dataCenters);
            return response;
        }

        public ResponseSiteNNation GetSiteNNation(RequestSiteNNation data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseSiteNNation(false, strErrorMessage);

            if (data.SiteID != siteID)
                return new ResponseSiteNNation(false, "허가되지 않은 정보에 접근중입니다.");

            Model.Site.Site site = m_dataManager.GetSelectManager().SelectSite(data.SiteID, out strErrorMessage);

            if (site == null)
            {
                if (strErrorMessage != null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 고객사 정보를 조회하는데 실패하였습니다.";
                    return new ResponseSiteNNation(false, strErrorMessage);
                }
                else
                    return new ResponseSiteNNation(false, "Database에서 고객사 정보를 찾을수 없습니다.");
            }

            Nation nation = m_dataManager.GetSelectManager().SelectNation(data.NationID, out strErrorMessage);

            if (nation == null)
            {
                if (strErrorMessage != null)
                {
                    strErrorMessage = "시스템 데이터베이스에서 국가 정보를 조회하는데 실패하였습니다.";
                    return new ResponseSiteNNation(false, strErrorMessage);
                }
                else
                    return new ResponseSiteNNation(false, "Database에서 국가 정보를 찾을수 없습니다.");
            }

            ResponseSiteNNation response = new ResponseSiteNNation(true, "");
            response.Site = site;
            response.Nation = nation;

            return response;
        }

        public ResponseDataCenter GetDataCenter(RequestGetDataCenter data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseDataCenter(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC 정보를 조회하는데 실패하였습니다.";
                return new ResponseDataCenter(false, strErrorMessage);
            }

            if (dataCenter.SiteID != siteID)
                return new ResponseDataCenter(false, "허가되지 않은 정보에 접근중입니다.");

            ResponseDataCenter response = new ResponseDataCenter(true, "");
            response.DataCenter = dataCenter;
            return response;
        }

        public ResponseEmptyItemDetails GetEmptyItemDetails()
        {
            ResponseEmptyItemDetails response = new ResponseEmptyItemDetails(true, "");
            return response;
        }

        public ResponseSensorTypes GetSensorTypes()
        {
            string strErrorMessage;
            List<SensorType> sensorTypes = m_dataManager.GetSelectManager().SelectSensorTypes(null, null, out strErrorMessage);

            if (sensorTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 FMS 센서 정보를 조회하는데 실패하였습니다.";
                return new ResponseSensorTypes(false, strErrorMessage);
            }

            ResponseSensorTypes response = new ResponseSensorTypes(true, "");

            foreach (var sensorType in sensorTypes)
            {
                response.SensorTypes.Add(new SensorTypeEx(sensorType));
            }

            return response;
        }

        public ResponseWorkData GetWorkData(RequestWorkData data, int userID)
        {
            int siteID;
            string strErrorMessage;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseWorkData(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseWorkData(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new ResponseWorkData(false, "허가되지 않은 VDC의 정보에 접근중입니다.");

            Dictionary<ChangeBasic.Fields, object> dicConditionChangeBasic = new Dictionary<ChangeBasic.Fields, object>();
            dicConditionChangeBasic[ChangeBasic.Fields.DataCenterID] = data.DataCenterID;
            List<ChangeBasic> changeBasics = m_dataManager.GetSelectManager().SelectWorkChangeBasics(dicConditionChangeBasic, null, out strErrorMessage);

            if (changeBasics == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 변경작업 정보를 조회하는데 실패하였습니다.";
                return new ResponseWorkData(false, strErrorMessage);
            }

            Dictionary<ChangeTarget.Fields, object> dicConditionChangeTarget = new Dictionary<ChangeTarget.Fields, object>();
            dicConditionChangeTarget[ChangeTarget.Fields.DataCenterID] = data.DataCenterID;
            List<ChangeTarget> changeTargets = m_dataManager.GetSelectManager().SelectWorkChangeTargets(dicConditionChangeTarget, null, out strErrorMessage);

            if (changeTargets == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 변경작업 상세정보를 조회하는데 실패하였습니다.";
                return new ResponseWorkData(false, strErrorMessage);
            }

            Dictionary<FaultBasic.Fields, object> dicConditionFaultBasic = new Dictionary<FaultBasic.Fields, object>();
            dicConditionFaultBasic[FaultBasic.Fields.DataCenterID] = data.DataCenterID;
            List<FaultBasic> faultBasics = m_dataManager.GetSelectManager().SelectWorkFaultBasics(dicConditionFaultBasic, null, out strErrorMessage);

            if (faultBasics == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 장애정보를 조회하는데 실패하였습니다.";
                return new ResponseWorkData(false, strErrorMessage);
            }

            Dictionary<FaultTarget.Fields, object> dicConditionFaultTarget = new Dictionary<FaultTarget.Fields, object>();
            dicConditionFaultTarget[FaultTarget.Fields.DataCenterID] = data.DataCenterID;
            List<FaultTarget> faultTargets = m_dataManager.GetSelectManager().SelectWorkFaultTargets(dicConditionFaultTarget, null, out strErrorMessage);

            if (faultTargets == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 장애 상세정보를 조회하는데 실패하였습니다.";
                return new ResponseWorkData(false, strErrorMessage);
            }

            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 IT 자산구분 정보를 조회하는데 실패하였습니다.";
                return new ResponseWorkData(false, strErrorMessage);
            }

            Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();

            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType;
            }

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinItemItemRUItemType(data.DataCenterID, null, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 VDC내 IT 자산의 위치정보를 조회하는데 실패하였습니다.";
                return new ResponseWorkData(false, strErrorMessage);
            }

            Dictionary<string, Item> dicItems = new Dictionary<string, Item>();
            Dictionary<int, ItemType> dicItemTypes = new Dictionary<int, ItemType>();

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                Item item = (Item)arrDatas[i];
                Item_RU itemRU = (Item_RU)arrDatas[i + 1];
                ItemType itemType = (ItemType)arrDatas[i + 2];

                string strKey = item.Name + "_" + itemType.EquipmentType.ToString();
                dicItems[strKey] = item;

                dicItemTypes[itemType.ID] = itemType;
            }

            List<ChangeTarget> _changeTargets = null;
            Dictionary<int, List<ChangeTarget>> dicChangeTargets = new Dictionary<int, List<ChangeTarget>>();

            foreach (ChangeTarget target in changeTargets)
            {
                if (dicChangeTargets.TryGetValue(target.WorkID, out _changeTargets) == false)
                {
                    _changeTargets = new List<ChangeTarget>();
                    dicChangeTargets[target.WorkID] = _changeTargets;
                }

                _changeTargets.Add(target);
            }

            List<FaultTarget> _faultTargets = null;
            Dictionary<int, List<FaultTarget>> dicFaultTargets = new Dictionary<int, List<FaultTarget>>();

            foreach (FaultTarget target in faultTargets)
            {
                if (dicFaultTargets.TryGetValue(target.FaultID, out _faultTargets) == false)
                {
                    _faultTargets = new List<FaultTarget>();
                    dicFaultTargets[target.FaultID] = _faultTargets;
                }

                _faultTargets.Add(target);
            }

            ResponseWorkData response = new ResponseWorkData(true, "");

            foreach (ChangeBasic changeBasic in changeBasics)
            {
                ChangeData changeData = new ChangeData();
                changeData.BasicData = changeBasic;

                if (dicChangeTargets.TryGetValue(changeBasic.ID, out _changeTargets))
                {
                    foreach (ChangeTarget _target in _changeTargets)
                    {
                        ChangeTargetEx target = new ChangeTargetEx(_target);

                        Item item;
                        string strKey = target.PropertyName + "_" + target.EquipmentTypeID.ToString();

                        if (dicItems.TryGetValue(strKey, out item))
                            target.Item = item;

                        EquipmentType equipmentType;

                        if (dicEquipmentTypes.TryGetValue(_target.EquipmentTypeID, out equipmentType))
                            target.EquipmentType = equipmentType;

                        changeData.TargetDatas.Add(target);
                    }
                }

                response.ChangeDatas.Add(changeData);
            }

            foreach (FaultBasic faultBasic in faultBasics)
            {
                FaultData faultData = new FaultData();
                faultData.BasicData = faultBasic;

                if (dicFaultTargets.TryGetValue(faultBasic.ID, out _faultTargets))
                {
                    foreach (FaultTarget _target in _faultTargets)
                    {
                        FaultTargetEx target = new FaultTargetEx(_target);
                        EquipmentType equipmentType;

                        if (dicEquipmentTypes.TryGetValue(_target.EquipmentTypeID, out equipmentType))
                            target.EquipmentType = equipmentType;

                        faultData.TargetDatas.Add(target);
                    }
                }

                response.FaultDatas.Add(faultData);
            }

            return response;
        }

        public ResponseSiteWorkData GetSiteWorkData(RequestSiteWorkData data, int userID)
        {
            string strErrorMessage;
            
            bool isNullable;
            string strSubCondition = string.Format("Select {0} from {1} where {2} = {3}",
                UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.DataCenterID, out isNullable),
                UserDataCenterLink.TableName,
                UserDataCenterLink.GetFieldName(UserDataCenterLink.Fields.UserID, out isNullable),
                userID);

            string strCondition = string.Format("{0} in ({1}) order by {2}", ChangeBasic.GetFieldName(ChangeBasic.Fields.DataCenterID, out isNullable), strSubCondition, ChangeBasic.GetFieldName(ChangeBasic.Fields.RegTime, out isNullable));
            List<ChangeBasic> changeBasics = m_dataManager.GetSelectManager().SelectWorkChangeBasics(null, strCondition, out strErrorMessage);

            if (changeBasics == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 변경작업 정보를 조회하는데 실패하였습니다.";
                return new ResponseSiteWorkData(false, strErrorMessage);
            }

            strCondition = string.Format("{0} in ({1})", ChangeTarget.GetFieldName(ChangeTarget.Fields.DataCenterID, out isNullable), strSubCondition);
            List<ChangeTarget> changeTargets = m_dataManager.GetSelectManager().SelectWorkChangeTargets(null, strCondition, out strErrorMessage);

            if (changeTargets == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 변경작업 상세정보를 조회하는데 실패하였습니다.";
                return new ResponseSiteWorkData(false, strErrorMessage);
            }

            Dictionary<int, List<ChangeTarget>> dicChangeTargets = new Dictionary<int, List<ChangeTarget>>();

            foreach (ChangeTarget target in changeTargets)
            {
                List<ChangeTarget> targets = null;

                if (dicChangeTargets.TryGetValue(target.WorkID, out targets) == false)
                {
                    targets = new List<ChangeTarget>();
                    dicChangeTargets[target.WorkID] = targets;
                }

                targets.Add(target);
            }

            strCondition = string.Format("{0} in ({1}) order by {2}", FaultBasic.GetFieldName(FaultBasic.Fields.DataCenterID, out isNullable), strSubCondition, FaultBasic.GetFieldName(FaultBasic.Fields.EventTime, out isNullable));
            List<FaultBasic> faultBasics = m_dataManager.GetSelectManager().SelectWorkFaultBasics(null, strCondition, out strErrorMessage);

            if (faultBasics == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 장애정보를 조회하는데 실패하였습니다.";
                return new ResponseSiteWorkData(false, strErrorMessage);
            }

            strCondition = string.Format("{0} in ({1})", FaultTarget.GetFieldName(FaultTarget.Fields.DataCenterID, out isNullable), strSubCondition);
            List<FaultTarget> faultTargets = m_dataManager.GetSelectManager().SelectWorkFaultTargets(null, strCondition, out strErrorMessage);

            if (faultTargets == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 장애 상세정보를 조회하는데 실패하였습니다.";
                return new ResponseSiteWorkData(false, strErrorMessage);
            }

            Dictionary<int, List<FaultTarget>> dicFaultTargets = new Dictionary<int, List<FaultTarget>>();

            foreach (FaultTarget target in faultTargets)
            {
                List<FaultTarget> targets;

                if (dicFaultTargets.TryGetValue(target.FaultID, out targets) == false)
                {
                    targets = new List<FaultTarget>();
                    dicFaultTargets[target.FaultID] = targets;
                }

                targets.Add(target);
            }

            ResponseSiteWorkData response = new ResponseSiteWorkData(true, "");

            int changeCount = changeBasics.Count;

            for (int i=changeCount-1;i>=changeCount-2 && i>=0;i--)
            {
                ChangeBasic changeBasic = changeBasics[i];
                SiteChangeData changeData = new SiteChangeData();

                changeData.BasicData = changeBasic;
                List<ChangeTarget> targets = null;

                if (dicChangeTargets.TryGetValue(changeBasic.ID, out targets))
                {
                    changeData.TargetDatas.AddRange(targets);
                }

                response.ChangeDatas.Add(changeData);
            }

            int faultCount = faultBasics.Count;

            for (int i=faultCount-1;i>=faultCount-2 && i>=0;i--)
            {
                FaultBasic faultBasic = faultBasics[i];
                SiteFaultData faultData = new SiteFaultData();

                faultData.BasicData = faultBasic;
                List<FaultTarget> targets = null;

                if (dicFaultTargets.TryGetValue(faultBasic.ID, out targets))
                {
                    faultData.TargetDatas.AddRange(targets);
                }

                response.FaultDatas.Add(faultData);
            }

            return response;
        }

        public ResponseCFDImages GetCFDImages(RequestCFDImages data, string strResourceRootFolder, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseCFDImages(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseCFDImages(false, strErrorMessage);

            if (siteID != dataCenter.SiteID)
                return new ResponseCFDImages(false, "허가되지 않은 정보에 접근을 시도하였습니다.");

            string strPath = Directory.GetCurrentDirectory() + "\\" + strResourceRootFolder + "\\resource\\image\\cfd\\" + data.DataCenterID.ToString();

            if (Directory.Exists(strPath) == false)
                return new ResponseCFDImages(true, "");

            string[] files = Directory.GetFiles(strPath);
            ResponseCFDImages response = new ResponseCFDImages(true, "");

            foreach (string strFile in files)
            {
                int index = strFile.LastIndexOf('\\');
                string strFileName = index > 0 ? strFile.Substring(index + 1) : strFile;

                response.ImageTimes.Add(File.GetCreationTime(strFile));

                string strUrl = "resource/image/cfd/" + data.DataCenterID.ToString() + "/" + Uri.EscapeUriString(strFileName);
                response.ImageUrls.Add(strUrl);
            }

            return response;
        }

        public ResponseCompanyList GetCompanyList()
        {
            string strErrorMessage;
            List<Company> companies = m_dataManager.GetSelectManager().SelectCompanies(null, null, out strErrorMessage);

            if (companies == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 제조사 정보를 조회하는데 실패하였습니다.";
                return new ResponseCompanyList(false, strErrorMessage);
            }

            ResponseCompanyList response = new ResponseCompanyList(true, "");
            response.Companies.AddRange(companies);
            return response;
        }

        public ResponseSite GetSite(int siteID, int userID)
        {
            string strErrorMessage;
            int _siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out _siteID, out strErrorMessage) == false)
                return new ResponseSite(false, strErrorMessage);

            if (_siteID != siteID)
                return new ResponseSite(false, "허가되지 않은 고객사 정보에 접근하였습니다.");

            Dictionary<Model.Site.Site.Fields, object> dicSiteCondition = new Dictionary<Model.Site.Site.Fields, object>();
            dicSiteCondition[Model.Site.Site.Fields.ID] = siteID;

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSiteSiteData(dicSiteCondition, null, null, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 고객사 정보를 조회하는데 실패하였습니다.";
                return new ResponseSite(false, strErrorMessage);
            }

            if (arrDatas.Count < 2)
                return new ResponseSite(false, "시스템 데이터베이스에서 고객사의 정보를 조회할 수 없습니다.");

            Model.Site.Site site = (Model.Site.Site)arrDatas[0];
            Model.Site.Data siteData = (Model.Site.Data)arrDatas[1];

            ResponseSite response = new ResponseSite(true, "");
            response.Site = new SiteEx(site, siteData);
            return response;
        }

        public ResponseSiteCompanies GetSiteCompanies(RequestSiteCompanies data, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseSiteCompanies(false, strErrorMessage);

            if (data.SiteID != siteID)
                return new ResponseSiteCompanies(false, "허가되지 않은 고객사 정보에 접근하였습니다.");

            List<string> companies = m_dataManager.GetSelectManager().GetSiteCompanyList(data.SiteID, out strErrorMessage);

            if (companies == null)
            {
                strErrorMessage = "시스템 데이터베이스로부터 고객사의 전체 VDC 소속사 정보를 조회하는데 실패하였습니다.";
                return new ResponseSiteCompanies(false, strErrorMessage);
            }

            companies.Sort();

            ResponseSiteCompanies response = new ResponseSiteCompanies(true, "");
            response.Companies.AddRange(companies);
            return response;
        }

        public ResponseItem GetItem(RequestItem data, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new ResponseItem(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseItem(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new ResponseItem(false, "허가되지 않은 고객사 정보에 접근하였습니다.");

            Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
            dicConditions[Item.Fields.CenterID] = data.DataCenterID;
            dicConditions[Item.Fields.ID] = data.ItemID;

            List<Item> items = m_dataManager.GetSelectManager().SelectItems(dicConditions, null, out strErrorMessage);

            if (items == null)
                return new ResponseItem(false, "시스템 데이터베이스로부터 IT 자산정보를 조회하는데 실패하였습니다.");

            if (items.Count == 0)
                return new ResponseItem(false, "존재하지 않는 IT 자산정보를 조회하려고 시도하였습니다.");

            Item item = items[0];
            ItemType itemType = m_dataManager.GetSelectManager().SelectItemType(item.ItemTypeID, out strErrorMessage);

            if (itemType == null)
                return new ResponseItem(false, "시스템 데이터베이스에서 IT 자산타입 정보를 조회하는데 실패하였습니다.");

            Company company = m_dataManager.GetSelectManager().SelectCompany(itemType.CompanyID, out strErrorMessage);

            if (company == null)
                return new ResponseItem(false, "시스템 데이터베이스로부터 제조사 정보를 조회하는데 실패하였습니다.");

            EquipmentType equipmentType = m_dataManager.GetSelectManager().SelectEquipmentType(itemType.EquipmentType, out strErrorMessage);

            if (equipmentType == null)
                return new ResponseItem(false, "시스템 데이터베이스로부터 장비구분 정보를 조회하는데 실패하였습니다.");

            ItemTypeEx itemTypeEx = new ItemTypeEx(itemType);
            itemTypeEx.Company = company;
            itemTypeEx.EquipmentTypeData = equipmentType;

            Item_RU itemRU = m_dataManager.GetSelectManager().SelectItem_RU(item.ID, out strErrorMessage);

            if (itemRU == null)
                return new ResponseItem(false, "시스템 데이터베이스로부터 Item 설치위치 정보를 조회하는데 실패하였습니다.");

            ArrayList arrDatas = new ArrayList();
            arrDatas.Add(item);
            arrDatas.Add(itemRU);

            List<ItemTypeEx> itemTypes = new List<ItemTypeEx>();
            itemTypes.Add(itemTypeEx);

            List<ItemEx> itemExes = ToItemEx(data.DataCenterID, arrDatas, itemTypes, out strErrorMessage);

            if (itemExes == null)
                return new ResponseItem(false, strErrorMessage);

            if (itemExes.Count == 0)
                return new ResponseItem(false, "시스템 데이터베이스로부터 IT 자산정보를 조회하지 못하였습니다.");

            ResponseItem response = new ResponseItem(true, "");
            response.Item = itemExes[0];
            response.ItemType = itemTypeEx;

            return response;
        }

        public MessageResult CheckValidItemName(CheckValidItemName data, int userID)
        {
            string strErrorMessage;
            int siteID;

            if (AccountManager.GetUserSiteID(m_dataManager, userID, out siteID, out strErrorMessage) == false)
                return new MessageResult(false, strErrorMessage);

            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(data.DataCenterID, out strErrorMessage);

            if (dataCenter == null)
                return new ResponseItem(false, "시스템 데이터베이스로부터 VDC 정보를 조회하는데 실패하였습니다.");

            if (dataCenter.SiteID != siteID)
                return new MessageResult(false, "허가되지 않은 고객사 정보에 접근하였습니다.");

            Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
            dicConditions[Item.Fields.Name] = data.ItemName;
            dicConditions[Item.Fields.CenterID] = data.DataCenterID;

            List<Item> items = m_dataManager.GetSelectManager().SelectItems(dicConditions, null, out strErrorMessage);

            if (items == null)
            {
                strErrorMessage = "시스템 데이터베이스로부터 IT 자산정보를 조회하는데 실패하였습니다.";
                return new MessageResult(false, strErrorMessage);
            }

            foreach (Item item in items)
            {
                if (item.ID == data.ItemID)
                    continue;
                else
                {
                    strErrorMessage = string.Format("[{0}]는 이미 사용중인 이름입니다.", data.ItemName);
                    return new MessageResult(false, strErrorMessage);
                }
            }

            return new MessageResult(true, "");
        }

        public ResponseVdcStatistics GetVdcStatistics(RequestVdcStatistics data)
        {
            string strErrorMessage;
            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
                return new ResponseVdcStatistics(false, "시스템 데이터베이스로부터 전체 IT 구분 정보를 조회하는데 실패하였습니다.");

            Dictionary<int, string> dicEquipmentTypes = new Dictionary<int, string>();

            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType.EngName.ToLower();
            }

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinRackRackType(data.DataCenterID, null, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseVdcStatistics(false, "시스템 데이터베이스로부터 VDC의 Rack 정보를 조회하는데 실패하였습니다.");

            int nTotalUnitCount = 0;
            Dictionary<int, List<bool>> dicRackUnits = new Dictionary<int, List<bool>>();
            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Rack && arrDatas[i + 1] is RackType)
                {
                    Rack rack = (Rack)arrDatas[i];
                    RackType rackType = (RackType)arrDatas[i + 1];
                    nTotalUnitCount += rackType.Unit;

                    dicRackUnits[rack.ID] = GetEmptySlots(rackType.Unit);
                }
            }

            arrDatas = m_dataManager.GetSelectManager().JoinItemItemRUItemType(data.DataCenterID, null, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseVdcStatistics(false, "시스템 데이터베이스로부터 VDC의 자산정보를 조회하는데 실패하였습니다.");

            ResponseVdcStatistics response = new ResponseVdcStatistics(true, "");
            response.TotalRemainUnitCount = nTotalUnitCount;

            nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is Item && arrDatas[i + 1] is Item_RU && arrDatas[i + 2] is ItemType)
                {
                    Item item = (Item)arrDatas[i];
                    Item_RU itemRU = (Item_RU)arrDatas[i + 1];
                    ItemType itemType = (ItemType)arrDatas[i + 2];

                    if (itemType.Unit == null)
                        continue;

                    string strEquipmentType;

                    if (dicEquipmentTypes.TryGetValue(itemType.EquipmentType, out strEquipmentType))
                    {
                        if (strEquipmentType == "storage")
                            response.StorageUnitCount += (int)itemType.Unit;
                        else if (strEquipmentType == "backup")
                            response.BackupUnitCount += (int)itemType.Unit;
                        else if (strEquipmentType == "network")
                            response.NetworkUnitCount += (int)itemType.Unit;
                        else if (strEquipmentType == "san switch")
                            response.SanSwitchUnitCount += (int)itemType.Unit;
                        else if (strEquipmentType == "appliance")
                            response.ApplianceUnitCount += (int)itemType.Unit;
                        else if (strEquipmentType == "etc")
                            response.EtcUnitCount += (int)itemType.Unit;
                        else if (strEquipmentType == "security")
                            response.SecurityUnitCount += (int)itemType.Unit;
                        else if (strEquipmentType == "box")
                            response.ServerUnitCount += (int)itemType.Unit;

                        response.TotalUsedUnitCount += (int)itemType.Unit;
                        response.TotalRemainUnitCount -= (int)itemType.Unit;

                        List<bool> slotStatus = null;

                        if (dicRackUnits.TryGetValue(itemRU.RackID, out slotStatus))
                        {
                            SetSlotStatus(slotStatus, itemRU.UPos, (int)itemType.Unit);
                        }
                    }
                }
            }

            Dictionary<int, int> dicEmptyCounts = new Dictionary<int, int>();

            foreach (KeyValuePair<int, List<bool>> pair in dicRackUnits)
            {
                SetEmptySlots(dicEmptyCounts, pair.Value);
            }

            foreach (KeyValuePair<int, int> pair in dicEmptyCounts)
            {
                ResponseVdcStatistics.RemainUnit remain = new ResponseVdcStatistics.RemainUnit();
                remain.UnitSize = pair.Key;
                remain.Count = pair.Value;

                response.RemainUnits.Add(remain);
            }

            response.RemainUnits.Sort();
            return response;
        }

        public bool SetDataCenterRatio(List<DataCenterEx> dataCenters, out string strErrorMessage)
        {
            List<int> ids = new List<int>();

            foreach (DataCenterEx center in dataCenters)
            {
                ids.Add(center.ID);
            }

            if (ids.Count > 0)
            {
                Dictionary<int, float> dicRatios = GetUsingRatio(ids, out strErrorMessage);

                if (dicRatios == null)
                    return false;

                float ratio;

                foreach (DataCenterEx center in dataCenters)
                {
                    if (dicRatios.TryGetValue(center.ID, out ratio))
                        center.UsingRatio = ratio;
                }
            }
            else
                strErrorMessage = null;

            return true;
        }

        private Dictionary<int, float> GetUsingRatio(List<int> dataCenterIDs, out string strErrorMessage)
        {
            strErrorMessage = null;

            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

            if (equipmentTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스로부터 전체 IT 구분 정보를 조회하는데 실패하였습니다.";
                return null;
            }

            Dictionary<int, string> dicEquipmentTypes = new Dictionary<int, string>();

            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType.EngName.ToLower();
            }

            bool isNullable;
            string strCondition = string.Format("{0}.{1} in ({2})", Rack.TableName, Rack.GetFieldName(Rack.Fields.CenterID, out isNullable), string.Join(",", dataCenterIDs));
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinRackRackType(-1, strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스로부터 VDC의 Rack 정보를 조회하는데 실패하였습니다.";
                return null;
            }

            Dictionary<int, int> dicTotalUnitCounts = new Dictionary<int, int>();
            int nTotalUnitCount;
            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Rack && arrDatas[i + 1] is RackType)
                {
                    Rack rack = (Rack)arrDatas[i];
                    RackType rackType = (RackType)arrDatas[i + 1];
                    
                    if (dicTotalUnitCounts.TryGetValue(rack.CenterID, out nTotalUnitCount))
                        dicTotalUnitCounts[rack.CenterID] = nTotalUnitCount + rackType.Unit;
                    else
                        dicTotalUnitCounts[rack.CenterID] = rackType.Unit;
                }
            }

            strCondition = string.Format("{0}.{1} in ({2})", Item.TableName, Item.GetFieldName(Item.Fields.CenterID, out isNullable), string.Join(",", dataCenterIDs));
            arrDatas = m_dataManager.GetSelectManager().JoinItemItemRUItemType(-1, strCondition, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "시스템 데이터베이스로부터 VDC의 자산정보를 조회하는데 실패하였습니다.";
                return null;
            }

            int nTotalUsedUnitCount;

            Dictionary<int, int> dicTotalUsedUnitCounts = new Dictionary<int, int>();
            nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is Item && arrDatas[i + 1] is Item_RU && arrDatas[i + 2] is ItemType)
                {
                    Item item = (Item)arrDatas[i];
                    Item_RU itemRU = (Item_RU)arrDatas[i + 1];
                    ItemType itemType = (ItemType)arrDatas[i + 2];

                    if (itemType.Unit == null)
                        continue;

                    string strEquipmentType;

                    if (dicEquipmentTypes.TryGetValue(itemType.EquipmentType, out strEquipmentType))
                    {
                        if (dicTotalUsedUnitCounts.TryGetValue(item.CenterID, out nTotalUsedUnitCount))
                            dicTotalUsedUnitCounts[item.CenterID] = nTotalUsedUnitCount + (int)itemType.Unit;
                        else
                            dicTotalUsedUnitCounts[item.CenterID] = (int)itemType.Unit;
                    }
                }
            }

            Dictionary<int, float> dicDataCenterRatio = new Dictionary<int, float>();

            foreach (int dataCenterID in dataCenterIDs)
            {
                if (dicTotalUnitCounts.TryGetValue(dataCenterID, out nTotalUnitCount) && dicTotalUsedUnitCounts.TryGetValue(dataCenterID, out nTotalUsedUnitCount))
                {
                    if (nTotalUnitCount == 0)
                        dicDataCenterRatio[dataCenterID] = 0;
                    else
                        dicDataCenterRatio[dataCenterID] = nTotalUsedUnitCount * 100.0f / nTotalUnitCount;
                }
            }

            return dicDataCenterRatio;
        }

        private void SetEmptySlots(Dictionary<int, int> dicEmptyCounts, List<bool> slotStatus)
        {
            int continueousCount = 0;
            
            foreach (bool fill in slotStatus)
            {
                if (fill)
                {
                    if (continueousCount > 0)
                    {
                        int emptyCount;

                        if (dicEmptyCounts.TryGetValue(continueousCount, out emptyCount))
                            dicEmptyCounts[continueousCount] = emptyCount + 1;
                        else
                            dicEmptyCounts[continueousCount] = 1;
                    }

                    continueousCount = 0;
                }
                else
                    continueousCount++;
            }

            if (continueousCount > 0)
            {
                int emptyCount;

                if (dicEmptyCounts.TryGetValue(continueousCount, out emptyCount))
                    dicEmptyCounts[continueousCount] = emptyCount + 1;
                else
                    dicEmptyCounts[continueousCount] = 1;
            }
        }

        private void SetSlotStatus(List<bool> slotStatus, int uPos, int unitSize)
        {
            int nSlotCount = slotStatus.Count;

            for (int i=uPos-1;i<uPos-1+unitSize && i < nSlotCount;i++)
            {
                slotStatus[i] = true;
            }
        }

        private List<bool> GetEmptySlots(int slotSize)
        {
            List<bool> slots = new List<bool>();

            for (int i=0;i<slotSize;i++)
            {
                slots.Add(false);
            }

            return slots;
        }
    }
}
