using SOPAlone.BLL.Models.Data.Spatial;
using SOPAlone.Model.Sop.Spatial;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.BLL.Models.Response.Spatial
{
    public class ResponseSpatial : MessageResult
    {
        public ICollection<BuildingGroupData> BuildingGroupDatas { get; set; }
    }
    public class ResponseBuildingGroups : MessageResult
    {
        public List<BuildingGroup> BuildingGroups { get; set; }
    }
    public class ResponseBuildings : MessageResult
    {
        public List<Building> Buildings { get; set; }
    }
    public class ResponseZones : MessageResult
    {
        public List<Zone> Zones { get; set; }
    }
}
