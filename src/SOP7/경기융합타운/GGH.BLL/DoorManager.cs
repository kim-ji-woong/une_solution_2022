using System.Collections.Generic;
using SDMS.IDAL;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using dnsData.Sensor;

namespace GGH.BLL
{
    using Models.Response;

    public class DoorManager
    {
        public enum DoorStatus { Opened = 0, Closed = 1};

        private IDataManager m_dataManager = null;

        public DoorManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseDoorStatus GetClosedDoors(int siteID)
        {
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.MaterialType] = (int)Facility.FacilityType.DOOR;

            Dictionary<Zone.Fields, object> dicConditions2 = null;

            if (siteID > 0)
            {
                dicConditions[ETC.Fields.SiteID] = siteID;

                dicConditions2 = new Dictionary<Zone.Fields, object>();
                dicConditions2[Zone.Fields.SiteID] = siteID;
            }

            string strErrorMessage;
            List<ETC> doors = m_dataManager.GetSelectManager().SelectETCSensors(dicConditions, null, out strErrorMessage);

            if (doors == null)
                return new ResponseDoorStatus(false, strErrorMessage);

            List<Zone> zones = m_dataManager.GetSelectManager().SelectZones(dicConditions2, null, out strErrorMessage);

            if (zones == null)
                return new ResponseDoorStatus(false, strErrorMessage);

            Dictionary<int, Zone> dicZones = new Dictionary<int, Zone>();

            foreach (Zone zone in zones)
            {
                dicZones[zone.ID] = zone;
            }

            ResponseDoorStatus response = new ResponseDoorStatus(true, "");
            
            foreach (ETC door in doors)
            {
                FloorDoors floorInfo = null;

                if (response.FloorInfos.TryGetValue(door.ZoneID, out floorInfo) == false)
                {
                    floorInfo = new FloorDoors();
                    floorInfo.ZoneID = door.ZoneID;

                    Zone zone;

                    if (dicZones.TryGetValue(door.ZoneID, out zone))
                    {
                        if (zone.FloorIndex != null)
                        {
                            floorInfo.FloorName = (int)zone.FloorIndex < 0 ? string.Format("B{0}F", ((int)zone.FloorIndex) * (-1)) : string.Format("{0}F", ((int)zone.FloorIndex) + 1);
                        }
                    }

                    response.FloorInfos[door.ZoneID] = floorInfo;
                }

                floorInfo.TotalDoorCount++;

                if (door.Status == (int)DoorStatus.Closed)
                    floorInfo.ClosedDoors.Add(door);
            }

            return response;
        }

        public ResponseExitList GetExitList(int siteID)
        {
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.MaterialType] = (int)Facility.FacilityType.EXIT;

            if (siteID > 0)
            {
                dicConditions[ETC.Fields.SiteID] = siteID;
            }

            string strErrorMessage;
            List<ETC> exits = m_dataManager.GetSelectManager().SelectETCSensors(dicConditions, null, out strErrorMessage);

            if (exits == null)
                return new ResponseExitList(false, strErrorMessage);

            ResponseExitList response = new ResponseExitList(true, "");

            foreach (ETC exit in exits)
            {
                FloorExit floorInfo = null;

                if (response.FloorInfos.TryGetValue(exit.ZoneID, out floorInfo) == false)
                {
                    floorInfo = new FloorExit();
                    floorInfo.ZoneID = exit.ZoneID;
                    response.FloorInfos[exit.ZoneID] = floorInfo;
                }

                floorInfo.ExitList.Add(exit);
            }

            return response;
        }

        public ResponseAllDoors GetAllDoors(int siteID)
        {
            Dictionary<ETC.Fields, object> dicConditions = new Dictionary<ETC.Fields, object>();
            dicConditions[ETC.Fields.MaterialType] = (int)Facility.FacilityType.DOOR;

            if (siteID > 0)
            {
                dicConditions[ETC.Fields.SiteID] = siteID;
            }

            string strErrorMessage;
            List<ETC> doors = m_dataManager.GetSelectManager().SelectETCSensors(dicConditions, null, out strErrorMessage);

            if (doors == null)
                return new ResponseAllDoors(false, strErrorMessage);

            ResponseAllDoors response = new ResponseAllDoors(true, "");

            foreach (ETC door in doors)
            {
                FloorDoors2 floorInfo = null;

                if (response.FloorInfos.TryGetValue(door.ZoneID, out floorInfo) == false)
                {
                    floorInfo = new FloorDoors2();
                    floorInfo.ZoneID = door.ZoneID;
                    response.FloorInfos[door.ZoneID] = floorInfo;
                }

                floorInfo.Doors.Add(door);
            }

            return response;
        }
    }
}
