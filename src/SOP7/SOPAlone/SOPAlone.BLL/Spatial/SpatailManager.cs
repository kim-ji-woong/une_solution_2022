using SOPAlone.BLL.Models.Data.Spatial;
using SOPAlone.BLL.Models.Response.Spatial;
using SOPAlone.IDAL;
using SOPAlone.Model.Sop.Spatial;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.BLL.Spatial
{
    public class SpatailManager
    {
        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;
                
        public SpatailManager(IDataManager manager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_processManager = processManager;
        }

        public ResponseSpatial LoadSpatail()
        {
            ResponseSpatial res = new ResponseSpatial();
            try
            {
                Dictionary<int, BuildingGroupData> dicBuildingGroups = new Dictionary<int, BuildingGroupData>();
                Dictionary<int, BuildingData> dicBuildings = new Dictionary<int, BuildingData>();

                string strError;
                List<BuildingGroup> buildingGroups = m_dataManager.GetSelectManager().SelectBuildingGroups(string.Empty, out strError);
                if (buildingGroups == null)
                    throw new ApplicationException(strError);

                foreach (BuildingGroup item in buildingGroups)
                {
                    BuildingGroupData bg = new BuildingGroupData();

                    bg.ID = item.ID;
                    bg.GroupName = item.GroupName;
                    bg.DisplayText = item.DisplayText;
                    bg.SiteID = item.SiteID;

                    dicBuildingGroups[bg.ID] = bg;
                }

                List<Building> buildings = m_dataManager.GetSelectManager().SelectBuildings(string.Empty, out strError);
                if (buildings == null)
                    throw new ApplicationException(strError);

                foreach (Building building in buildings)
                {
                    BuildingData buildingData = new BuildingData();
                    buildingData.ID = building.ID;
                    buildingData.BuildingGroupID = building.BuildingGroupID;
                    buildingData.BuildingName = building.BuildingName;
                    buildingData.DisplayText = building.DisplayText;
                    buildingData.MaxFloor = building.MaxFloor;
                    buildingData.MinFloor = building.MinFloor;

                    BuildingGroupData bg;

                    if (dicBuildingGroups.TryGetValue(buildingData.BuildingGroupID, out bg))
                    {
                        if (bg.BuildingDatas == null)
                            bg.BuildingDatas = new List<BuildingData>();
                        bg.BuildingDatas.Add(buildingData);
                    }

                    dicBuildings[buildingData.ID] = buildingData;
                }

                List<Zone> zones = m_dataManager.GetSelectManager().SelectZones(string.Empty, out strError);
                if (zones == null)
                    throw new ApplicationException(strError);

                foreach (Zone zone in zones)
                {
                    BuildingData building;

                    if (zone.BuildingID != null && dicBuildings.TryGetValue((int)zone.BuildingID, out building))
                    {
                        if (building.Zones == null)
                            building.Zones = new List<Zone>();
                        building.Zones.Add(zone);
                    }
                }

                res.BuildingGroupDatas = dicBuildingGroups.Values;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        public ResponseBuildingGroups LoadOnlyBuildingGroup()
        {
            ResponseBuildingGroups res = new ResponseBuildingGroups();
            try
            {                
                string strError;
                List<BuildingGroup> bgs = m_dataManager.GetSelectManager().SelectBuildingGroups(string.Empty, out strError);
                if (bgs == null)
                    throw new ApplicationException(strError);

                res.BuildingGroups = bgs;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        public ResponseBuildings LoadOnlyBuildings()
        {
            ResponseBuildings res = new ResponseBuildings();
            try
            {
                string strError;
                List<Building> bs = m_dataManager.GetSelectManager().SelectBuildings(string.Empty, out strError);
                if (bs == null)
                    throw new ApplicationException(strError);

                res.Buildings = bs;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        public ResponseZones LoadOnlyZones()
        {
            ResponseZones res = new ResponseZones();
            try
            {
                string strError;
                List<Zone> z = m_dataManager.GetSelectManager().SelectZones(string.Empty, out strError);
                if (z == null)
                    throw new ApplicationException(strError);

                res.Zones = z;
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
