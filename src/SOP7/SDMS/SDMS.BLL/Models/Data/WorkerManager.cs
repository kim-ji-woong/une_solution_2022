using SDMS.BLL.Models.Response;
using SDMS.IDAL;
using SDMS.Model.Worker;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SDMS.BLL.Models.Data
{
    public class WorkerManager
    {
        public static ResponseWorkerInfos GetWorkerInfos(IDataManager dataManager)
        {
            string strErrorMessage = null;
            ResponseWorkerInfos response = null;

            // 건물그룹 작업자 인원 정보 
            List<WorkerInfo> buildingGroupWorkerInfos = new List<WorkerInfo>();
            // 건물 작업자 인원 정보
            List<WorkerInfo> buildingWorkerInfos = new List<WorkerInfo>();
            // 층별 작업자 인원 정보
            List<WorkerInfo> zoneWorkerInfos = new List<WorkerInfo>();
            // 구역별 작업자 인원 정보
            List<WorkerInfo> equipZoneWorkerInfos = new List<WorkerInfo>();

            if (dataManager == null)
                return new ResponseWorkerInfos(false, "dataManager 데이터가 존재하지 않습니다.");

            List<WorkerInfo> workerInfos = dataManager.GetSelectManager().SelectWorkerInfos(null, null, out strErrorMessage);
            if (workerInfos == null)
            {
                response = new ResponseWorkerInfos(false, "1. LoadWorkerInfo Error : " + strErrorMessage);
                return response;
            }

            buildingGroupWorkerInfos = workerInfos.FindAll(x => x.SpatialType == (int)WorkerInfo.Spatial_Type.BuildingGroup);
            buildingWorkerInfos = workerInfos.FindAll(x => x.SpatialType == (int)WorkerInfo.Spatial_Type.Building);
            zoneWorkerInfos = workerInfos.FindAll(x => x.SpatialType == (int)WorkerInfo.Spatial_Type.Zone);
            equipZoneWorkerInfos = workerInfos.FindAll(x => x.SpatialType == (int)WorkerInfo.Spatial_Type.EquipmentZone);

            response = new ResponseWorkerInfos(true, "");
            response.BuildingGroupWorkerInfos = buildingGroupWorkerInfos;
            response.BuildingWorkerInfos = buildingWorkerInfos;
            response.ZoneWorkerInfos = zoneWorkerInfos;
            response.EquipZoneWorkerInfos = equipZoneWorkerInfos;

            return response;
        }
    }
}
