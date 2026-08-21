using System;
using System.Collections.Generic;
using System.Text;

namespace SOPManager.BLL.Models.SOP
{
    public class LinkedSopData
    {
        public int LinkID { get; set; }
        public int FacilityTypeID { get; set; }
        public int DisasterCategoryID { get; set; }
        public int SubDisasterCategoryID { get; set; }
        public string CategoryName { get; set; }
        public string SubCategoryName { get; set; }
        public string DisasterName { get; set; }
        public int? LinkedBuildingGroupID { get; set; }
        public int? LinkedBuildingID { get; set; }
        public int? LinkedZoneID { get; set; }
        public string ZoneName { get; set; }
        public string FacilityTypeName { get; set; }
        public int SiteID { get; set; }
    }
}
