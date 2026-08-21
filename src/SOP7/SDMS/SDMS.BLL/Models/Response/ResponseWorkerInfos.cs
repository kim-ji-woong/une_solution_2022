using SDMS.Model.Worker;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Response
{
    public class ResponseWorkerInfos : MessageResult
    {
        private ICollection<WorkerInfo> m_buildingGroupWorkerInfos = null;
        private ICollection<WorkerInfo> m_buildingWorkerInfos = null;
        private ICollection<WorkerInfo> m_zoneWorkerInfos = null;
        private ICollection<WorkerInfo> m_equipZoneWorkerInfos = null;

        public ICollection<WorkerInfo> BuildingGroupWorkerInfos
        {
            get { return m_buildingGroupWorkerInfos; }
            set { m_buildingGroupWorkerInfos = value; }
        }
        public ICollection<WorkerInfo> BuildingWorkerInfos
        {
            get { return m_buildingWorkerInfos; }
            set { m_buildingWorkerInfos = value; }
        }
        public ICollection<WorkerInfo> ZoneWorkerInfos
        {
            get { return m_zoneWorkerInfos; }
            set { m_zoneWorkerInfos = value; }
        }
        public ICollection<WorkerInfo> EquipZoneWorkerInfos
        {
            get { return m_equipZoneWorkerInfos; }
            set { m_equipZoneWorkerInfos = value; }
        }

        public ResponseWorkerInfos()
            : base()
        {
        }

        public ResponseWorkerInfos(bool success, string message)
            : base(success, message)
        {
        }
    }
}
