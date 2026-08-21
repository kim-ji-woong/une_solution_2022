using SOPAlone.Model.Sop.Spatial;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.BLL.Models.Data.Spatial
{
    public class BuildingGroupData : BuildingGroup
    {
        public List<BuildingData> BuildingDatas { get; set; }
    }

    public class BuildingData : Building
    {
        public List<Zone> Zones { get; set; }
    }
}
