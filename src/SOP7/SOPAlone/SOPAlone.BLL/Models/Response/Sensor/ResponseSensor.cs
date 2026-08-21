using SOPAlone.Model.Sop.Sensor;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.BLL.Models.Response.Sensor
{
    public class ResponseLoadFacilityTypes : MessageResult
    {
        public List<FacilityType> FacilityTypes { get; set; }
    }

    public class ResponseRunSOP : MessageResult
    {
        /// <summary>
        /// ActionStepHistory ID
        /// </summary>
        public int ID { get; set; }
    }
}
