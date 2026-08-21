using System.Collections.Generic;
using Nipa.Model.Sdms.Spatial;

namespace Nipa.BLL.Models
{
    public class BuildingGroupData : BuildingGroup
    {
        private List<BuildingData> m_buildingDatas = new List<BuildingData>();
        private BuildingGroupData m_parent = null;

        public BuildingGroupData Parent
        {
            get { return m_parent; }
            set { m_parent = value; }
        }

        public List<BuildingData> BuildingDatas
        {
            get { return m_buildingDatas; }
        }
    }

    public class BuildingData : Building
    {
        private List<ZoneData> m_zoneDatas = new List<ZoneData>();

        public List<ZoneData> ZoneDatas
        {
            get { return m_zoneDatas; }
        }
    }

    public class ZoneData : Zone, System.IComparable
    {
        private List<EquipmentZoneData> m_equipmentZoneDatas = new List<EquipmentZoneData>();
        private ZoneSensors m_sensors = null;
        private Model.Sdms.Spatial.ZoneData m_zoneData = new Model.Sdms.Spatial.ZoneData();

        public List<EquipmentZoneData> EquipmentZoneDatas
        {
            get { return m_equipmentZoneDatas; }
        }

        public ZoneSensors Sensors
        {
            get { return m_sensors; }
            set { m_sensors = value; }
        }

        public Model.Sdms.Spatial.ZoneData Datas
        {
            get { return m_zoneData; }
            set { m_zoneData = value; }
        }

        public int CompareTo(object obj)
        {
            ZoneData data1 = this;
            ZoneData data2 = (ZoneData)obj;

            if (data1.FloorIndex < data2.FloorIndex)
                return -1;
            else if (data1.FloorIndex > data2.FloorIndex)
                return 1;
            else
            {
                if (data1.AddFloor == null && data2.AddFloor != null)
                    return -1;
                else if (data1.AddFloor != null && data2.AddFloor == null)
                    return 1;
                else if (data1.AddFloor != null && data2.AddFloor != null)
                {
                    if ((float)data1.AddFloor < (float)data2.AddFloor)
                        return -1;
                    else if ((float)data1.AddFloor > (float)data2.AddFloor)
                        return 1;
                }
            }

            return 0;
        }
    }

    public class ZoneEx : Zone
    {
        private Model.Sdms.Spatial.ZoneData m_zoneData = null;

        public Model.Sdms.Spatial.ZoneData ZoneData
        {
            get { return m_zoneData; }
            set { m_zoneData = value; }
        }

        public ZoneEx()
        {
        }

        public ZoneEx(Zone zone)
        {
            this.AddFloor = zone.AddFloor;
            this.Boundary = zone.Boundary;
            this.BroadcastText = zone.BroadcastText;
            this.BuildingID = zone.BuildingID;
            this.DisplayText = zone.DisplayText;
            this.FloorIndex = zone.FloorIndex;
            this.ID = zone.ID;
            this.SiteID = zone.SiteID;
            this.TextCenter = zone.TextCenter;
            this.ZoneName = zone.ZoneName;
        }
    }

    public class EquipmentZoneData : EquipmentZone
    {
        // 하나의 EquipmentZone이 여러개의 Zone에 걸쳐 있을수 있다.
        private List<Zone> m_linkedZoneDatas = new List<Zone>();

        // 연결된 Zone ID List
        private List<int> m_linkedZoneIDs = new List<int>();

        public List<Zone> LinkedZoneDatas
        {
            get { return m_linkedZoneDatas; }
        }

        /// <summary>
        /// 연결된 Zone ID List
        /// </summary>
        public List<int> LinkedZoneIDs
        {
            get { return m_linkedZoneIDs; }
            set { m_linkedZoneIDs = value; }
        }

        public static List<int> ToLinkedZoneIDs(string strLinkedZoneIDList)
        {
            List<int> ids = new List<int>();

            if (strLinkedZoneIDList == null)
                return ids;

            string[] zoneIDs = strLinkedZoneIDList.Split(',');

            foreach (string strZoneID in zoneIDs)
            {
                int id;

                if (int.TryParse(strZoneID.Trim(), out id))
                    ids.Add(id);
            }

            return ids;
        }
    }

    public class ZoneSensors
    {
        private List<FireSensor> m_fireSensors = null;
        private List<PSMSensor> m_psmSensors = null;
        private List<EtcSensor> m_etcSensors = null;
        private List<CCTVSensor> m_cctvs = null;
        
        public List<FireSensor> FireSensors
        {
            get { return m_fireSensors; }
            set { m_fireSensors = value; }
        }

        public List<PSMSensor> PsmSensors
        {
            get { return m_psmSensors; }
            set { m_psmSensors = value; }
        }

        public List<EtcSensor> EtcSensors
        {
            get { return m_etcSensors; }
            set { m_etcSensors = value; }
        }

        public List<CCTVSensor> Cctvs
        {
            get { return m_cctvs; }
            set { m_cctvs = value; }
        }

        public ZoneSensors()
        {
        }

        public ZoneSensors(List<FireSensor> fireSensors, List<PSMSensor> psmSensors, List<EtcSensor> etcSensors, List<CCTVSensor> cctvs)
        {
            m_fireSensors = fireSensors;
            m_psmSensors = psmSensors;
            m_etcSensors = etcSensors;
            m_cctvs = cctvs;
        }
    }
}
