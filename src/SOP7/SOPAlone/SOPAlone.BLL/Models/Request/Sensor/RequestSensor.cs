using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.BLL.Models.Request.Sensor
{
    public class RequestRunSOP
    {
        public int FacilityType { get; set; }
        public int? BuildingGroupID { get; set; }
        public int? BuildingID { get; set; }
        public int? ZoneID { get; set; }
        public int? AlarmDepth { get; set; }
        public string OccurLocation { get; set; }
        /// <summary>
        /// 이전에 열려있는 SOP 모두 종료 (결과적으로 지금 실행시킬 SOP 한개만 남음)
        /// </summary>
        public bool? ExitPreviousSop { get; set; }
    }

    public class RequestCloseSOP
    {
        public int ID { get; set; }
    }
}
