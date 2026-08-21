using System.Collections;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.Model;
using Nipa.Model.Sdms.Spatial;
using Nipa.DAL;

namespace Nipa.BLL
{
    using Models;
    using Models.Response;
    using Models.Response.SDMS;
    using Models.Request;

    public class SpatialManager
    {
        private Dictionary<int, BuildingGroupData> m_dicBuildingGroups = new Dictionary<int, BuildingGroupData>();
        private Dictionary<int, BuildingData> m_dicBuildings = new Dictionary<int, BuildingData>();
        private Dictionary<int, ZoneData> m_dicZones = new Dictionary<int, ZoneData>();
        private Dictionary<int, EquipmentZoneData> m_dicEquipZones = new Dictionary<int, EquipmentZoneData>();

        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;

        public ICollection<BuildingGroupData> BuildingGroups
        {
            get { return m_dicBuildingGroups.Values; }
        }

        public ICollection<BuildingData> Buildings
        {
            get { return m_dicBuildings.Values; }
        }

        public ICollection<ZoneData> Zones
        {
            get { return m_dicZones.Values; }
        }

        public ICollection<EquipmentZoneData> EquipZones
        {
            get { return m_dicEquipZones.Values; }
        }

        public SpatialManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(m_dataManager);
        }

        public BuildingGroupData GetBuildingGroup(int id)
        {
            BuildingGroupData bg;

            if (m_dicBuildingGroups.TryGetValue(id, out bg))
                return bg;

            return null;
        }

        public BuildingData GetBuilding(int id)
        {
            BuildingData building;

            if (m_dicBuildings.TryGetValue(id, out building))
                return building;

            return null;
        }

        public ZoneData GetZone(int id)
        {
            ZoneData zone;

            if (m_dicZones.TryGetValue(id, out zone))
                return zone;

            return null;
        }

        public EquipmentZoneData GetEquipmentZone(int id)
        {
            EquipmentZoneData equipZone;

            if (m_dicEquipZones.TryGetValue(id, out equipZone))
                return equipZone;

            return null;
        }

        public List<ZoneData> GetOutdoorZones()
        {
            List<ZoneData> zones = new List<ZoneData>();

            foreach (KeyValuePair<int, ZoneData> pair in m_dicZones)
            {
                if (pair.Value.BuildingID == null)
                    zones.Add(pair.Value);
            }

            return zones;
        }

        public bool LoadSpatial(int siteID, out string strErrorMessage)
        {
            strErrorMessage = null;

            m_dicBuildingGroups.Clear();
            m_dicBuildings.Clear();
            m_dicZones.Clear();
            m_dicEquipZones.Clear();

            string strCondition = string.Format("{0} = {1}", BuildingGroup.Fields.SiteID, siteID);
            IEnumerable<BuildingGroup> buildingGroups = m_dataManager.GetSelect().Select<BuildingGroup>(strCondition, out strErrorMessage);

            if (buildingGroups == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadSpatial Error : " + strErrorMessage);
                return false;
            }

            // Key : BuildingGroup ID
            // Value : Parent ID
            Dictionary<int, int> dicBuildingGroupParents = new Dictionary<int, int>();

            string strBuildingGroupIDs = "";

            foreach (BuildingGroup item in buildingGroups)
            {
                BuildingGroupData bg = new BuildingGroupData();

                bg.ID = item.ID;
                bg.ParentID = item.ParentID;
                bg.SiteID = item.SiteID;
                bg.TextCenter = item.TextCenter;
                bg.GroupName = item.GroupName;
                bg.DisplayText = item.DisplayText;

                if (item.ParentID != null)
                    dicBuildingGroupParents[item.ID] = (int)item.ParentID;

                m_dicBuildingGroups[bg.ID] = bg;

                if (strBuildingGroupIDs.Length == 0)
                    strBuildingGroupIDs = item.ID.ToString();
                else
                    strBuildingGroupIDs += "," + item.ID.ToString();
            }

            foreach (KeyValuePair<int, int> pair in dicBuildingGroupParents)
            {
                BuildingGroupData bg, parent;

                if (m_dicBuildingGroups.TryGetValue(pair.Key, out bg) && m_dicBuildingGroups.TryGetValue(pair.Value, out parent))
                {
                    bg.Parent = parent;
                }
            }

            IEnumerable<Building> buildings = null;

            if (strBuildingGroupIDs.Length == 0)
                buildings = new List<Building>();
            else
            {
                strCondition = string.Format("{0} in ({1})", Building.Fields.BuildingGroupID, strBuildingGroupIDs);
                buildings = m_dataManager.GetSelect().Select<Building>(strCondition, out strErrorMessage);
            }

            if (buildings == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadSpatial Error : " + strErrorMessage);
                return false;
            }

            foreach (Building building in buildings)
            {
                BuildingData buildingData = new BuildingData();

                buildingData.ID = building.ID;
                buildingData.BroadcastText = building.BroadcastText;
                buildingData.BuildingCode = building.BuildingCode;
                buildingData.BuildingGroupID = building.BuildingGroupID;
                buildingData.BuildingName = building.BuildingName;
                buildingData.DisplayText = building.DisplayText;
                buildingData.MaxFloor = building.MaxFloor;
                buildingData.MinFloor = building.MinFloor;
                buildingData.TextCenter = building.TextCenter;

                BuildingGroupData bg;

                if (m_dicBuildingGroups.TryGetValue(buildingData.BuildingGroupID, out bg))
                {
                    bg.BuildingDatas.Add(buildingData);
                }

                m_dicBuildings[buildingData.ID] = buildingData;
            }

            strCondition = string.Format("{0} = {1}", Zone.Fields.SiteID, siteID);
            IEnumerable<Zone> zones = m_dataManager.GetSelect().Select<Zone>(strCondition, out strErrorMessage);

            if (zones == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadSpatial Error : " + strErrorMessage);
                return false;
            }

            string strZoneIDs = "";

            foreach (Zone zone in zones)
            {
                ZoneData zoneData = new ZoneData();
                zoneData.ID = zoneData.Datas.ZoneID = zone.ID;
                zoneData.ZoneName = zone.ZoneName;
                zoneData.BuildingID = zone.BuildingID;
                zoneData.FloorIndex = zone.FloorIndex;
                zoneData.AddFloor = zone.AddFloor;
                zoneData.Boundary = zone.Boundary;
                zoneData.TextCenter = zone.TextCenter;
                zoneData.BroadcastText = zone.BroadcastText;
                zoneData.DisplayText = zone.DisplayText;
                zoneData.SiteID = zone.SiteID;

                BuildingData building;

                if (zone.BuildingID != null && m_dicBuildings.TryGetValue((int)zone.BuildingID, out building))
                {
                    building.ZoneDatas.Add(zoneData);
                }

                m_dicZones[zone.ID] = zoneData;

                if (strZoneIDs.Length == 0)
                    strZoneIDs = zone.ID.ToString();
                else
                    strZoneIDs += "," + zone.ID.ToString();
            }

            IEnumerable<Model.Sdms.Spatial.ZoneData> zoneDatas = null;

            if (strZoneIDs.Length == 0)
                zoneDatas = new List<Model.Sdms.Spatial.ZoneData>();
            else
            {
                strCondition = string.Format("{0} in ({1})", Model.Sdms.Spatial.ZoneData.Fields.ZoneID, strZoneIDs);
                zoneDatas = m_dataManager.GetSelect().Select<Model.Sdms.Spatial.ZoneData>(strCondition, out strErrorMessage);
            }

            if (zoneDatas == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadSpatial Error : " + strErrorMessage);
                return false;
            }

            foreach (Model.Sdms.Spatial.ZoneData zoneData in zoneDatas)
            {
                ZoneData data;

                if (m_dicZones.TryGetValue(zoneData.ZoneID, out data))
                {
                    data.Datas = zoneData;
                }
            }

            strCondition = string.Format("{0} = {1}", EquipmentZone.Fields.SiteID, siteID);
            IEnumerable<EquipmentZone> equipZones = m_dataManager.GetSelect().Select<EquipmentZone>(strCondition, out strErrorMessage);

            if (equipZones == null)
            {
                System.Diagnostics.Trace.WriteLine("LoadSpatial Error : " + strErrorMessage);
                return false;
            }

            foreach (EquipmentZone equipZone in equipZones)
            {
                EquipmentZoneData equipZoneData = new EquipmentZoneData();

                equipZoneData.Boundary = equipZone.Boundary;
                equipZoneData.BroadcastText = equipZone.BroadcastText;
                equipZoneData.DisplayText = equipZone.DisplayText;
                equipZoneData.ID = equipZone.ID;
                equipZoneData.SiteID = equipZone.SiteID;
                equipZoneData.TextCenter = equipZone.TextCenter;
                equipZoneData.Type = equipZone.Type;
                equipZoneData.ZoneName = equipZone.ZoneName;
                equipZoneData.LinkedZoneIDs = EquipmentZoneData.ToLinkedZoneIDs(equipZone.LinkedZoneIDList);

                ZoneData zone;

                foreach (int zoneID in equipZoneData.LinkedZoneIDs)
                {
                    if (m_dicZones.TryGetValue(zoneID, out zone))
                    {
                        zone.EquipmentZoneDatas.Add(equipZoneData);
                        equipZoneData.LinkedZoneDatas.Add(zone);
                    }
                }

                m_dicEquipZones[equipZoneData.ID] = equipZoneData;
            }

            SortZoneDatas(m_dicBuildingGroups);
            return true;
        }

        private void SortZoneDatas(Dictionary<int, BuildingGroupData> dicBuildingGroupDatas)
        {
            foreach (KeyValuePair<int, BuildingGroupData> pair in dicBuildingGroupDatas)
            {
                foreach (BuildingData buildingData in pair.Value.BuildingDatas)
                {
                    buildingData.ZoneDatas.Sort();
                }
            }
        }

        public ResponseBuildingGroupList GetBuildingGroupList(int campusID)
        {
            string strErrorMessage;

            //if (campusID != 1)
            //    return new ResponseBuildingGroupList(true, "");

            if (LoadSpatial(campusID, out strErrorMessage) == false)
                return new ResponseBuildingGroupList(false, strErrorMessage);

            ResponseBuildingGroupList response = new ResponseBuildingGroupList();
            response.BuildingGroups = new List<BuildingGroupData>();

            foreach (BuildingGroupData bg in this.BuildingGroups)
            {
                /*if (siteIDs != null && siteIDs?.Count > 0)
                {
                    if (siteIDs.Contains(bg.SiteID) == false)
                        continue;
                }*/

                response.BuildingGroups.Add(bg);
            }

            List<ZoneData> outdoorZones = this.GetOutdoorZones();

            foreach (ZoneData zone in outdoorZones)
            {
                /*if (siteIDs != null)
                {
                    if (siteIDs.Contains(zone.SiteID) == false)
                        continue;
                }*/

                response.OutdoorZones.Add(zone);
            }

            response.Success = true;
            return response;
        }

        public ResponseZoneList GetZoneList(int campusID)
        {
            //if (campusID != 1)
            //    return new ResponseZoneList(true, "");

            string strErrorMessage;
            string strCondition = string.Format("a.{0} = {1}", Zone.Fields.SiteID, campusID);
            ArrayList arrDatas = m_joinManager.JoinZoneZoneData(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseZoneList(false, strErrorMessage);

            int nDataCount = arrDatas.Count;
            ResponseZoneList response = new ResponseZoneList(true, "");

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Zone && arrDatas[i + 1] is Model.Sdms.Spatial.ZoneData)
                {
                    Zone zone = (Zone)arrDatas[i];
                    Model.Sdms.Spatial.ZoneData zoneData = (Model.Sdms.Spatial.ZoneData)arrDatas[i + 1];

                    /*if (siteIDs.Contains(zone.SiteID) == false)
                        continue;*/

                    ZoneEx _zone = new ZoneEx(zone);
                    _zone.ZoneData = zoneData;
                    response.Zones.Add(_zone);
                }
            }

            return response;
        }

        public ResponseZoneData GetZoneData(int zoneID)
        {
            string strErrorMessage;
            string strConditions = zoneID < 0 ? string.Format("a.{0} is NULL", Zone.Fields.BuildingID) : string.Format("a.{0} = {1}", Zone.Fields.ID, zoneID);
            ArrayList arrDatas = m_joinManager.JoinZoneZoneData(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseZoneData(false, strErrorMessage);

            ResponseZoneData response = new ResponseZoneData(true, "");
            response.ZoneID = zoneID;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Zone && arrDatas[i + 1] is Model.Sdms.Spatial.ZoneData)
                {
                    response.ZoneData = (Model.Sdms.Spatial.ZoneData)arrDatas[i + 1];
                    break;
                }
            }

            if (response.ZoneData == null)
            {
                response.Success = false;
                response.Message = string.Format("시스템 데이터베이스로부터 해당 Zone의 데이터를 찾을수 없습니다.(ID : {0})", zoneID);
            }

            return response;
        }

        public MessageResult SaveViewport(RequestSaveViewport data)
        {
            string strErrorMessage;
            string strConditions = data.ZoneID < 0 ? string.Format("a.{0} is NULL", Zone.Fields.BuildingID) : string.Format("a.{0} = {1}", Zone.Fields.ID, data.ZoneID);
            ArrayList arrDatas = m_joinManager.JoinZoneZoneData(strConditions, out strErrorMessage);

            if (arrDatas == null)
                return new MessageResult(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 1; i += 2)
            {
                if (arrDatas[i] is Zone && arrDatas[i + 1] is Model.Sdms.Spatial.ZoneData)
                {
                    Model.Sdms.Spatial.ZoneData zoneData = (Model.Sdms.Spatial.ZoneData)arrDatas[i + 1];

                    zoneData.CameraPositionX = data.CameraPositionX;
                    zoneData.CameraPositionY = data.CameraPositionY;
                    zoneData.CameraPositionZ = data.CameraPositionZ;
                    zoneData.CameraRotationX = data.CameraRotationX;
                    zoneData.CameraRotationY = data.CameraRotationY;
                    zoneData.CameraRotationZ = data.CameraRotationZ;

                    if (m_dataManager.GetUpdate().Update<Model.Sdms.Spatial.ZoneData>(zoneData, null, out strErrorMessage))
                        return new MessageResult(true, "");
                    else
                        return new MessageResult(false, strErrorMessage);
                }
            }

            return new MessageResult(false, string.Format("시스템 데이터베이스로부터 해당 Zone의 데이터를 찾을수 없습니다.(ID : {0})", data.ZoneID));
        }

        public ResponseCampusList GetCampusList()
        {
            string strErrorMessage;
            IEnumerable<Site> sites = m_dataManager.GetSelect().Select<Site>(null, out strErrorMessage);

            if (sites == null)
                return new ResponseCampusList(false, strErrorMessage);

            ResponseCampusList response = new ResponseCampusList(true, "");

            foreach (Site site in sites)
            {
                response.CampusList.Add(new Campus(site.ID, site.Name));
            }

            return response;
        }

        public ResponseFacilityList GetFacilityList(RequestFacilityList data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", Facility.Fields.SiteID, data.CampusID);
            IEnumerable<Facility> facilities = m_dataManager.GetSelect().Select<Facility>(strCondition, out strErrorMessage);

            if (facilities == null)
                return new ResponseFacilityList(false, strErrorMessage);

            IEnumerable<Nipa.Model.Mes.Equipment.Data> equipmentDatas = m_dataManager.GetSelect().Select<Nipa.Model.Mes.Equipment.Data>(null, out strErrorMessage);

            if (equipmentDatas == null)
                return new ResponseFacilityList(false, strErrorMessage);

            /*strCondition = string.Format("{0} = {1} and {2} = 'progress'", FacilityData.Fields.SiteID, data.CampusID, FacilityData.Fields.PropertyName);
            IEnumerable<FacilityData> facilityDatas = m_dataManager.GetSelect().Select<FacilityData>(strCondition, out strErrorMessage);

            if (facilityDatas == null)
                return new ResponseFacilityList(false, strErrorMessage);*/

            Dictionary<int, FacilityData> dicFacilityDatas = new Dictionary<int, FacilityData>();

            foreach (var equipmentData in equipmentDatas)
            {
                FacilityData facilityData = new FacilityData();

                facilityData.FacilityID = equipmentData.EqID;
                facilityData.PropertyName = "progress";
                facilityData.PropertyValue = string.Format("{0:F1}", equipmentData.Progress);
                facilityData.PropertyUnit = "%";
                facilityData.Description = "가동률";

                dicFacilityDatas[facilityData.FacilityID] = facilityData;
            }

            /*foreach (FacilityData facilityData in facilityDatas)
            {
                dicFacilityDatas[facilityData.FacilityID] = facilityData;
            }*/

            ResponseFacilityList response = new ResponseFacilityList(true, "");

            foreach (Facility facility in facilities)
            {
                FacilityData facilityData;

                if (dicFacilityDatas.TryGetValue(facility.ID, out facilityData))
                {
                    FacilityEx facilityEx = new FacilityEx(facility);
                    facilityEx.Datas.Add(facilityData);
                    response.Facilities.Add(facilityEx);
                }
            }

            return response;
        }

        public ResponseFacilityData GetFacilityData(RequestFacilityData data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", FacilityData.Fields.FacilityID, data.FacilityID);
            IEnumerable<FacilityData> facilityDatas = m_dataManager.GetSelect().Select<FacilityData>(strCondition, out strErrorMessage);

            if (facilityDatas == null)
                return new ResponseFacilityData(false, strErrorMessage);

            ResponseFacilityData response = new ResponseFacilityData(true, "");
            response.FacilityID = data.FacilityID;

            foreach (FacilityData facilityData in facilityDatas)
            {
                response.Datas.Add(facilityData);
            }

            return response;
        }

        public ResponseCampusData GetCampusData(RequestCampusData data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", SiteData.Fields.SiteID, data.CampusID);
            IEnumerable<SiteData> siteDatas = m_dataManager.GetSelect().Select<SiteData>(strCondition, out strErrorMessage);

            if (siteDatas == null)
                return new ResponseCampusData(false, strErrorMessage);

            ResponseCampusData response = new ResponseCampusData(true, "");
            response.Datas.AddRange(siteDatas);
            return response;
        }
    }
}
