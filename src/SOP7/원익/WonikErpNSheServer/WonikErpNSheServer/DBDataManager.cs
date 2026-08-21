using Dashboard.Model;
using dnsDBUtil;
using SDMS.Model.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WonikErpNSheServer
{
    public class DBDataManager
    {
        private Dashboard.DAL.DataManager m_dashboardDataManager = null;
        private SDMS.DAL.DataManager m_sdmsDataManager = null;

        public DBDataManager(Dashboard.DAL.DataManager dashboardDataManager, SDMS.DAL.DataManager sdmsDataManager)
        {
            m_dashboardDataManager = dashboardDataManager;
            m_sdmsDataManager = sdmsDataManager;
        }


        public Dictionary<int, PermitUpdateData> MakeUpdatePermitData(List<WorkPermitData> workPermitDatas, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (workPermitDatas == null)
            {
                strErrorMessage = "UpdateSHEWorkPermit Error (WorkPermitData 데이터가 존재하지 않습니다.)";
                return null;
            }

            Dictionary<int, PermitUpdateData> dicPermitUpdateData = new Dictionary<int, PermitUpdateData>();

            foreach (WorkPermitData data in workPermitDatas)
            {
                if (dicPermitUpdateData.ContainsKey(data.BuildingGroupID) == false)
                {
                    PermitUpdateData permit = new PermitUpdateData();
                    permit.BuildingGroupID = data.BuildingGroupID;

                    dicPermitUpdateData[data.BuildingGroupID] = permit;
                }
                
                PermitUpdateData updateData = dicPermitUpdateData[data.BuildingGroupID];

                if (data.WorkerTypes != null)
                {
                    foreach (int type in data.WorkerTypes)
                    {
                        if (type == (int)WorkPermit.Worker_Type.Normal)
                            updateData.Normal++;
                        else if (type == (int)WorkPermit.Worker_Type.Fire)
                            updateData.Fire++;
                        else if (type == (int)WorkPermit.Worker_Type.High)
                            updateData.High++;
                        else if (type == (int)WorkPermit.Worker_Type.Blackout)
                            updateData.Blackout++;
                        else if (type == (int)WorkPermit.Worker_Type.Closeness)
                            updateData.Closeness++;
                        else if (type == (int)WorkPermit.Worker_Type.Heavy)
                            updateData.Heavy++;
                        else if (type == (int)WorkPermit.Worker_Type.Excavation)
                            updateData.Excavation++;
                        else if (type == (int)WorkPermit.Worker_Type.Radiation)
                            updateData.Radiation++;
                        else if (type == (int)WorkPermit.Worker_Type.Common)
                            updateData.Common++;
                    }
                }
            }

            return dicPermitUpdateData;
        }




        public bool UpdateSHEWorkPermit(List<WorkPermitData> workPermitDatas, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (workPermitDatas == null)
            {
                strErrorMessage = "1. UpdateSHEWorkPermit Error (WorkPermitData 데이터가 존재하지 않습니다.)";
                return false;
            }
            else if (workPermitDatas.Count == 0)
            {
                return true;
            }

            // 캠퍼스별 작업 분류
            Dictionary<int, PermitUpdateData> dicPermitUpdateData = MakeUpdatePermitData(workPermitDatas, out strErrorMessage);
            if (dicPermitUpdateData == null)
            {
                strErrorMessage = "2. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                return false;
            }




            // 조회된 캠퍼스 이외에 작업 수 초기화
            string strBuildingGroupIDs = null;

            foreach (KeyValuePair<int, PermitUpdateData> pair in dicPermitUpdateData)
            {
                int nBuildingGroupID = pair.Key;

                if (strBuildingGroupIDs == null)
                    strBuildingGroupIDs = nBuildingGroupID.ToString();
                else
                    strBuildingGroupIDs += "," + nBuildingGroupID.ToString();
            }

            Dictionary<WorkPermit.Fields, object> dicConditions = new Dictionary<WorkPermit.Fields, object>();
            dicConditions[WorkPermit.Fields.SpatialType] = (int)WorkPermit.Spatial_Type.BuildingGroup;

            string strAdditionalConditions = null;

            if (strBuildingGroupIDs != null)
                strAdditionalConditions = string.Format("{0}.{1} NOT IN ({2})", WorkPermit.TableName, WorkPermit.Fields.SpatialID, strBuildingGroupIDs);

            if (m_dashboardDataManager.GetDeleteManager().DeleteWorkPermit(dicConditions, strAdditionalConditions, out strErrorMessage) == false)
            {
                strErrorMessage = "3. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                return false;
            }





            // 기존 캠퍼스 작업 조회
            List<WorkPermit> permits = new List<WorkPermit>();

            if (strBuildingGroupIDs != null)
            {
                strAdditionalConditions = string.Format("{0}.{1} IN ({2})", WorkPermit.TableName, WorkPermit.Fields.SpatialID, strBuildingGroupIDs);

                permits = m_dashboardDataManager.GetSelectManager().SelectWorkPermits(dicConditions, strAdditionalConditions, out strErrorMessage);
                if (permits == null)
                {
                    strErrorMessage = "4. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
            }



            // 조회된 캠퍼스 작업 수 생성 및 업데이트
            foreach (KeyValuePair<int, PermitUpdateData> pair in dicPermitUpdateData)
            {
                int nBuildingGroupID = pair.Key;
                PermitUpdateData data = pair.Value;

                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Normal, data.Normal, out strErrorMessage) == false)
                {
                    strErrorMessage = "5. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Fire, data.Fire, out strErrorMessage) == false)
                {
                    strErrorMessage = "6. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.High, data.High, out strErrorMessage) == false)
                {
                    strErrorMessage = "7. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Blackout, data.Blackout, out strErrorMessage) == false)
                {
                    strErrorMessage = "8. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Closeness, data.Closeness, out strErrorMessage) == false)
                {
                    strErrorMessage = "9. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Heavy, data.Heavy, out strErrorMessage) == false)
                {
                    strErrorMessage = "10. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Excavation, data.Excavation, out strErrorMessage) == false)
                {
                    strErrorMessage = "11. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Radiation, data.Radiation, out strErrorMessage) == false)
                {
                    strErrorMessage = "12. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
                if (UpdateWorkCount(permits, nBuildingGroupID, (int)WorkPermit.Worker_Type.Common, data.Common, out strErrorMessage) == false)
                {
                    strErrorMessage = "13. UpdateSHEWorkPermit Error (" + strErrorMessage + ")";
                    return false;
                }
            }

            return true;
        }

        private bool UpdateWorkCount(List<WorkPermit> permits, int nBuildingGroupID, int nWorkType, int nWorkCount, out string strErrorMessage)
        {
            WorkPermit permit = permits.Find(x => x.SpatialType == (int)WorkPermit.Spatial_Type.BuildingGroup && x.SpatialID == nBuildingGroupID && x.WorkerType == nWorkType);

            if (permit == null)
            {   // 생성
                WorkPermit newPermit = new WorkPermit();
                newPermit.SpatialType = (int)WorkPermit.Spatial_Type.BuildingGroup;
                newPermit.SpatialID = nBuildingGroupID;
                newPermit.WorkerType = nWorkType;
                newPermit.WorkerCount = nWorkCount;

                if (m_dashboardDataManager.GetCreateManager().CreateWorkPermit(newPermit, out strErrorMessage) == null)
                {
                    strErrorMessage = "CreateWorkPermit Error: " + strErrorMessage;
                    return false;
                }
            }
            else
            {   // 업데이트
                permit.WorkerCount = nWorkCount;

                if (m_dashboardDataManager.GetUpdateManager().UpdateWorkPermit(permit, out strErrorMessage) == false)
                {
                    strErrorMessage = "UpdateWorkPermit Error: " + strErrorMessage;
                    return false;
                }
            }

            return true;
        }

        public Dictionary<string, GasSensorData> LoadPSMSensors(out string strErrorMessage)
        {
            strErrorMessage = "";
            Dictionary<string, GasSensorData> dicGasSensorDatas = new Dictionary<string, GasSensorData>();


            // PSM, SensorZone, TagInfo 불러오기
            List<PSM> psms = m_sdmsDataManager.GetSelectManager().SelectPSMSensors(null, null, out strErrorMessage);
            if (psms == null)
                return null;
            else if (psms.Count == 0)
                return dicGasSensorDatas;

            string strPSMIDs = "";

            foreach (PSM psm in psms)
            {
                if (strPSMIDs == "")
                    strPSMIDs = psm.ID.ToString();
                else
                    strPSMIDs += "," + psm.ID.ToString();
            }

            //JoinSensorZoneTagInfoPSMMaterial

            string strAdditionalConditions = $"{PSM.TableName}.{PSM.Fields.ID} in ({strPSMIDs})";

            ArrayList arrDatas = m_sdmsDataManager.GetSelectManager().JoinSensorZoneTagInfoPSMMaterial(strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return null;
            else if (arrDatas.Count == 0)
            {
                strErrorMessage = "센서ID와 일치하는 정보가 없습니다.";
                return null;
            }

            int nResultCount = arrDatas.Count;

            for (int i = 0; i < nResultCount - 2; i += 3)
            {
                if (arrDatas[i] is SensorZone &&
                    arrDatas[i + 1] is TagInfo &&
                    arrDatas[i + 2] is Material)
                {
                    SensorZone sz = arrDatas[i] as SensorZone;
                    TagInfo tag = arrDatas[i + 1] as TagInfo;
                    Material material = arrDatas[i + 2] as Material;

                    PSM psm = psms.Find(x => x.ID == sz.OrgSensorID);
                    if (psm == null)
                        continue;

                    GasSensorData sensorData = new GasSensorData();
                    sensorData.ID = psm.ID;
                    sensorData.SensorName = psm.Name;
                    sensorData.UniqueKey = psm.UniqueKey;
                    sensorData.SensorZoneID = sz.ID;
                    sensorData.TagInfoID = tag.ID;

                    dicGasSensorDatas[sensorData.UniqueKey] = sensorData;
                }
            }
                
            return dicGasSensorDatas;
        }

        public bool UpdateSensorData(Dictionary<string, GasData> dicGasDatas, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (dicGasDatas == null)
            {
                strErrorMessage = "업데이트 할 센서 데이터가 존재하지 않습니다";
                return false;
            }

            foreach (KeyValuePair<string, GasData> pair in dicGasDatas)
            {
                GasData gasData = pair.Value;

                Dictionary<PSM.Fields, object> dicSets = new Dictionary<PSM.Fields, object>();
                dicSets[PSM.Fields.CurrentData] = gasData.Measure.ToString();

                Dictionary<PSM.Fields, object> dicConditions = new Dictionary<PSM.Fields, object>();
                dicConditions[PSM.Fields.UniqueKey] = gasData.SensorName + "_" + gasData.Type;

                if (m_sdmsDataManager.GetUpdateManager().UpdatePSMSensor(dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    return false;
                }
            }

            return true;
        }


        public Dictionary<string, EnvironmentSensorData> LoadSensors(dnsData.Sensor.Facility.FacilityType facilityType, out string strErrorMessage)
        {
            strErrorMessage = "";
            string strAdditionalConditions = $"{SensorZone.TableName}.{SensorZone.Fields.SensorType} = {(int)facilityType}";

            ArrayList arrDatas = m_sdmsDataManager.GetSelectManager().JoinSensorZoneTagInfoMaterialEarthquakeStrongWindSensor(strAdditionalConditions, out strErrorMessage);
            if (arrDatas == null)
                return null;
            else if (arrDatas.Count == 0)
            {
                strErrorMessage = "센서ID와 일치하는 정보가 없습니다.";
                return null;
            }

            Dictionary<string, EnvironmentSensorData> environmentSensors = new Dictionary<string, EnvironmentSensorData>();

            int nResultCount = arrDatas.Count;

            for (int i = 0; i < nResultCount - 3; i += 4)
            {
                if (arrDatas[i] is SensorZone &&
                    arrDatas[i + 1] is TagInfo &&
                    arrDatas[i + 2] is Material &&
                    arrDatas[i + 3] is ETC)
                {
                    SensorZone sz = arrDatas[i] as SensorZone;
                    TagInfo tag = arrDatas[i + 1] as TagInfo;
                    Material material = arrDatas[i + 2] as Material;
                    ETC sensor = arrDatas[i + 3] as ETC;

                    EnvironmentSensorData environmentSensor = new EnvironmentSensorData(sensor);
                    environmentSensor.SensorZoneID = sz.ID;
                    environmentSensor.TagInfoID = tag.ID;
                    environmentSensors[sensor.UniqueKey] = environmentSensor;
                }
            }

            return environmentSensors;
        }
    }
}
