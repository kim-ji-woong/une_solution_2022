using Dashboard.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dashboard.BLL.Models.Response
{
    public class ResponseWorkPermit : MessageResult
    {
        private List<WorkPermit> m_workPermits = null;

        public List<WorkPermit> WorkPermits
        {
            get { return m_workPermits; }
            set { m_workPermits = value; }
        }

        public List<WorkPermit> BuildingGroupWorkPermits { get; set; }

        public List<WorkPermit> BuildingWorkPermits { get; set; }

        public List<WorkPermit> ZoneWorkPermits { get; set; }
    }
}
