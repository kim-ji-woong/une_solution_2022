using System;
using System.Collections.Generic;
using System.Linq;
using dnsDapperDBUtil.DataAccessLayer.DAL;

namespace SysWillAlarm
{
    using Models.Sdms.Sensor;
    using Models.Sdms.Spatial;

    class SpaceManager
    {
        private DataManager m_dataManager = null;
        private int m_nSiteID = -1;

        // Key : Floor Index
        private Dictionary<int, EquipmentZone> m_dicEquipZones = new Dictionary<int, EquipmentZone>();
        // Key : Floor Index
        private Dictionary<int, Zone> m_dicZones = new Dictionary<int, Zone>();
        // Key : SensorType ID
        // Value.Key : EquipZoneID
        private Dictionary<int, Dictionary<int, SensorZone>> m_dicSensorZones = new Dictionary<int, Dictionary<int, SensorZone>>();

        public SpaceManager(DataManager dataManager, int nSiteID)
        {
            m_dataManager = dataManager;
            m_nSiteID = nSiteID;

            ReadDatas();
        }

        public EquipmentZone GetEquipZone(int nFloorIndex)
        {
            EquipmentZone equipZone;

            if (m_dicEquipZones.TryGetValue(nFloorIndex, out equipZone))
                return equipZone;

            return null;
        }

        public Zone GetZone(int nFloorIndex)
        {
            Zone zone;

            if (m_dicZones.TryGetValue(nFloorIndex, out zone))
                return zone;

            return null;
        }

        public SensorZone GetSensorZone(int nEquipZoneID, int nSensorType)
        {
            Dictionary<int, SensorZone> dicSensorZones = null;

            if (m_dicSensorZones.TryGetValue(nSensorType, out dicSensorZones))
            {
                SensorZone sensorZone;

                if (dicSensorZones.TryGetValue(nEquipZoneID, out sensorZone))
                    return sensorZone;
            }

            return null;
        }

        private bool ReadDatas()
        {
            int nSensorType = (int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR;

            string strCondition = string.Format("{7} in (Select {0} from {1} where {2} = {3} and {4} >= {5} and {4} <= {6})",
                SensorZone.Fields.EquipZoneID,
                SensorZone.TableName,
                SensorZone.Fields.SensorType,
                nSensorType,
                SensorZone.Fields.OrgSensorID,
                m_nSiteID * 1000000 + nSensorType * 1000 + 1,
                m_nSiteID * 1000000 + nSensorType * 1000 + 100,
                EquipmentZone.Fields.ID);

            string strErrorMessage;
            IEnumerable<EquipmentZone> equipZones = m_dataManager.GetSelect().Select<EquipmentZone>(strCondition, out strErrorMessage);

            if (equipZones == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadEquipZoneID Fail : " + strErrorMessage);
                return false;
            }

            string strZoneIDs = "";
            Dictionary<int, EquipmentZone> dicEquipZones = new Dictionary<int, EquipmentZone>();

            foreach (var equipZone in equipZones)
            {
                if (equipZone.LinkedZoneIDList != null && equipZone.LinkedZoneIDList.Length > 0)
                {
                    if (strZoneIDs.Length == 0)
                        strZoneIDs = equipZone.LinkedZoneIDList;
                    else
                        strZoneIDs += "," + equipZone.LinkedZoneIDList;

                    int zoneID;

                    if (int.TryParse(equipZone.LinkedZoneIDList.Trim(), out zoneID))
                        dicEquipZones[zoneID] = equipZone;
                }
            }

            string strEquipZoneIDs = "";

            if (strZoneIDs.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", Zone.Fields.ID, strZoneIDs);
                IEnumerable<Zone> zones = m_dataManager.GetSelect().Select<Zone>(strCondition, out strErrorMessage);

                if (zones == null)
                    return false;

                foreach (Zone zone in zones)
                {
                    if (zone.FloorIndex != null)
                    {
                        m_dicZones[(int)zone.FloorIndex] = zone;

                        EquipmentZone equipZone;

                        if (dicEquipZones.TryGetValue(zone.ID, out equipZone))
                        {
                            m_dicEquipZones[(int)zone.FloorIndex] = equipZone;

                            if (strEquipZoneIDs.Length == 0)
                                strEquipZoneIDs = equipZone.ID.ToString();
                            else
                                strEquipZoneIDs += "," + equipZone.ID.ToString();
                        }
                    }
                }
            }

            if (strEquipZoneIDs.Length > 0)
            {
                strCondition = string.Format("{0} in ({1})", SensorZone.Fields.EquipZoneID, strEquipZoneIDs);
                IEnumerable<SensorZone> sensorZones = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);

                if (sensorZones == null)
                    return false;

                Dictionary<int, SensorZone> dicSensorZones = null;

                foreach (SensorZone sensorZone in sensorZones)
                {
                    if (m_dicSensorZones.TryGetValue(sensorZone.SensorType, out dicSensorZones) == false)
                    {
                        dicSensorZones = new Dictionary<int, SensorZone>();
                        m_dicSensorZones[sensorZone.SensorType] = dicSensorZones;
                    }

                    dicSensorZones[sensorZone.EquipZoneID] = sensorZone;
                }
            }

            return true;
        }
    }
}
