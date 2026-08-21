using Nipa.Model.Sdms.Spatial;
using System.Collections.Generic;
using Nipa.Model;

namespace Nipa.BLL.Models.Response.SDMS
{
    public class ResponseBuildingGroupList : MessageResult
    {
        private List<BuildingGroupData> m_buildingGroups = new List<BuildingGroupData>();
        private List<ZoneData> m_outdoorZones = new List<ZoneData>();

        public List<BuildingGroupData> BuildingGroups
        {
            get { return m_buildingGroups; }
            set { m_buildingGroups = value; }
        }

        public List<ZoneData> OutdoorZones
        {
            get { return m_outdoorZones; }
        }

        public ResponseBuildingGroupList()
            : base()
        {
        }

        public ResponseBuildingGroupList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseZoneList : MessageResult
    {
        private List<ZoneEx> m_zones = new List<ZoneEx>();

        public List<ZoneEx> Zones
        {
            get { return m_zones; }
            set { m_zones = value; }
        }

        public ResponseZoneList()
            : base()
        {
        }

        public ResponseZoneList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseZoneData : MessageResult
    {
        private int m_nZoneID = -1;
        private Model.Sdms.Spatial.ZoneData m_zoneData = null;

        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }

        public Model.Sdms.Spatial.ZoneData ZoneData
        {
            get { return m_zoneData; }
            set { m_zoneData = value; }
        }

        public ResponseZoneData()
            : base()
        {
        }

        public ResponseZoneData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseCampusList : MessageResult
    {
        private List<Campus> m_campusList = new List<Campus>();

        public List<Campus> CampusList
        {
            get { return m_campusList; }
            set { m_campusList = value; }
        }

        public ResponseCampusList()
            : base()
        {
        }

        public ResponseCampusList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class Campus
    {
        private int m_nCampusID = -1;
        private string m_strCampusName = "";

        public int ID
        {
            get { return m_nCampusID; }
            set { m_nCampusID = value; }
        }

        public string Name
        {
            get { return m_strCampusName; }
            set { m_strCampusName = value; }
        }

        public Campus()
        {
        }

        public Campus(int id, string name)
        {
            m_nCampusID = id;
            m_strCampusName = name;
        }
    }

    public class ResponseFacilityList : MessageResult
    {
        private List<FacilityEx> m_facilities = new List<FacilityEx>();

        public List<FacilityEx> Facilities
        {
            get { return m_facilities; }
            set { m_facilities = value; }
        }

        public ResponseFacilityList()
            : base()
        {
        }

        public ResponseFacilityList(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseFacilityData : MessageResult
    {
        private List<FacilityData> m_datas = new List<FacilityData>();
        private int m_nFacilityID = -1;

        public List<FacilityData> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public int FacilityID
        {
            get { return m_nFacilityID; }
            set { m_nFacilityID = value; }
        }

        public ResponseFacilityData()
            : base()
        {
        }

        public ResponseFacilityData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class FacilityEx
    {
        private List<FacilityData> m_datas = new List<FacilityData>();
        private Facility m_facility = new Facility();

        public List<FacilityData> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public Facility Facility
        {
            get { return m_facility; }
            set { m_facility = value; }
        }

        public FacilityEx()
        {
        }

        public FacilityEx(Facility facility)
        {
            m_facility = facility;
        }
    }

    public class ResponseCampusData : MessageResult
    {
        private List<SiteData> m_datas = new List<SiteData>();

        public List<SiteData> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public ResponseCampusData()
            : base()
        {
        }

        public ResponseCampusData(bool success, string message)
            : base(success, message)
        {
        }
    }
}
