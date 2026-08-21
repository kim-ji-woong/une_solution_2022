using Common.Model.History;
using SOPAlone.BLL.Models.Request.Sensor;
using SOPAlone.BLL.Models.Response;
using SOPAlone.BLL.Models.Response.Sensor;
using SOPAlone.IDAL;
using SOPAlone.Model.Sop.Sensor;
using SOPAlone.Model.Sop.Spatial;
using SOPManager.Model.Sop.Config;
using System;
using System.Collections.Generic;
using System.Text;

namespace SOPAlone.BLL.Sensor
{
    public class SensorManager
    {
        private IDataManager m_dataManager = null;
        private ProcessManager m_processManager = null;

        public SensorManager(IDataManager manager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_processManager = processManager;
        }

        public ResponseLoadFacilityTypes LoadFacilityTypes()
        {
            ResponseLoadFacilityTypes res = new ResponseLoadFacilityTypes();
            try
            {
                string strError;
                List<FacilityType> types = m_dataManager.GetSelectManager().SelectFacilityTypes(string.Empty, out strError);
                if (types == null)
                    throw new ApplicationException(strError);

                res.FacilityTypes = types;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }            
        }

        public ResponseRunSOP RunSOP(RequestRunSOP req)
        {
            ResponseRunSOP res = new ResponseRunSOP();
            try
            {
                if (req.FacilityType < 0)
                {
                    res.Message = "센서 종류 (FacilityType) 확인";
                    return res;
                }

                SOPManager.BLL.Models.SOP.SOPData sopData = GetLinkedSOP(req.FacilityType, req.BuildingGroupID, req.BuildingID, req.ZoneID);
                SOPSimulator.BLL.ProcessManager sopProcManager = new SOPSimulator.BLL.ProcessManager(
                    m_processManager.CommonDataManager,
                    m_processManager.SopDataManager,
                    m_processManager.TeamDataManager,
                    m_processManager.SopSimulatorDataManager,
                    null);

                if (sopData != null)
                {
                    string strPosition = req.OccurLocation;
                    if (strPosition == null || strPosition.Length == 0)
                    {
                        string strError = null;
                        if (req.BuildingGroupID != null && req.BuildingGroupID > 0)
                        {
                            BuildingGroup bg = m_dataManager.GetSelectManager().SelectBuildingGroup($"ID={req.BuildingGroupID}", out strError);
                            if (bg != null)
                                strPosition = (bg.DisplayText != null && bg.DisplayText.Length > 0) ? bg.DisplayText + " " : bg.GroupName + " ";
                        }
                        if (req.BuildingID != null && req.BuildingID > 0)
                        {
                            Building b = m_dataManager.GetSelectManager().SelectBuilding($"ID={req.BuildingID}", out strError);
                            if (b != null)
                                strPosition += (b.DisplayText != null && b.DisplayText.Length > 0) ? b.DisplayText + " " : b.BuildingName + " ";
                        }
                        if (req.ZoneID != null && req.ZoneID > 0)
                        {
                            Zone z = m_dataManager.GetSelectManager().SelectZone($"ID={req.ZoneID}", out strError);
                            if (z != null)
                                strPosition += (z.DisplayText != null && z.DisplayText.Length > 0) ? z.DisplayText + " " : z.ZoneName + " ";
                        }

                        strPosition.Trim();
                    }
                    
                    Common.Model.History.ActionStepHistory history = sopProcManager.GetSopRunManager().ExcuteActionStep(sopData, strPosition, req.AlarmDepth);
                    if (history == null)
                        res.Message = $"params > 1.{req.FacilityType}/ 2.{req.BuildingGroupID}/ 3.{req.BuildingID}/ 4.{req.ZoneID}/ 5.{req.AlarmDepth}/ 6.{req.OccurLocation}";
                    else
                    {
                        res.ID = history.ID;
                        res.Success = true;
                    }
                }
                else
                {
                    res.Message = $"연결된 SOP가 없습니다. params > 1.{req.FacilityType}/ 2.{req.BuildingGroupID}/ 3.{req.BuildingID}/ 4.{req.ZoneID}/ 5.{req.AlarmDepth}/ 6.{req.OccurLocation}";
                }

                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        private SOPManager.BLL.Models.SOP.SOPData GetLinkedSOP(int nFacilityType, int? nBuildingGroupID, int? nBuildingID, int? nZoneID)
        {
            string strConditions = $"FacilityTypeID={nFacilityType}";

            Dictionary<LinkedSop.Fields, object> dicConditions = new Dictionary<LinkedSop.Fields, object>();
            dicConditions.Add(LinkedSop.Fields.FacilityTypeID, nFacilityType);

            string strErrorMessage = null;
            List<LinkedSop> sops = m_processManager.SopDataManager.GetSelectManager().SelectLinkedSops(dicConditions, out strErrorMessage);
            if (sops == null)
                return null;

            LinkedSop sop = null;
            foreach (LinkedSop item in sops)
            {
                if (nBuildingGroupID == null && nBuildingID == null && nZoneID == null &&
                    item.LinkedBuildingGroupID == null && item.LinkedBuildingID == null && item.LinkedZoneID== null)
                {
                    sop = item;
                    break;
                }

                if (nBuildingGroupID != null && nBuildingGroupID == item.LinkedBuildingGroupID)
                    sop = item;
                if (nBuildingID != null && nBuildingID == item.LinkedBuildingID)
                    sop = item;
                if (nZoneID != null && nZoneID == item.LinkedZoneID)
                {
                    sop = item;
                    break;
                }
            }

            SOPManager.BLL.Models.SOP.SOPData sopData = null;
            if (sop != null)
            {
                sopData = GetLinkedSOP(sop.DisasterCategoryID, sop.SubDisasterCategoryID, sop.DisasterName);
            }

            return sopData;
        }

        private SOPManager.BLL.Models.SOP.SOPData GetLinkedSOP(int disasterCategoryID, int subDisasterCategoryID, string disasterName)
        {
            string strErrorMessage = null;

            Dictionary<SOPManager.Model.Sop.Category.Disaster.Fields, object> dicCondition = new Dictionary<SOPManager.Model.Sop.Category.Disaster.Fields, object>();
            dicCondition.Add(SOPManager.Model.Sop.Category.Disaster.Fields.SubDisasterCategoryID, subDisasterCategoryID);
            dicCondition.Add(SOPManager.Model.Sop.Category.Disaster.Fields.DisasterName, disasterName);

            string strCondition = string.Format("{0}.OwnerID = {1}.ID AND {0}.ID = {2}.VersionID AND {2}.{3}={4} AND {2}.{5}='{6}' AND {3} in (Select {7} From {8} Where {9}={10})",
                SOPManager.Model.Sop.Category.Version.TableName,
                SOPManager.Model.Sop.Account.User.TableName,
                SOPManager.Model.Sop.Category.Disaster.TableName,
                SOPManager.Model.Sop.Category.Disaster.Fields.SubDisasterCategoryID,
                subDisasterCategoryID,
                SOPManager.Model.Sop.Category.Disaster.Fields.DisasterName,
                disasterName,
                SOPManager.Model.Sop.Category.SubDisasterCategory.Fields.ID,
                SOPManager.Model.Sop.Category.SubDisasterCategory.TableName,
                SOPManager.Model.Sop.Category.SubDisasterCategory.Fields.DisasterCategoryID,
                disasterCategoryID);

            System.Collections.ArrayList arrResult =
             m_processManager.SopDataManager.GetSelectManager().JoinDisasterUserVersion(strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            SOPManager.Model.Sop.Category.Version selectedVersion = null;
            SOPManager.Model.Sop.Category.Version selectedVersion2 = null; // 실행되야 할 반대의 모드를 넣어줌 (평일/휴일) > 해당 모드 없으면 이거로 실행시킴

            int resultCount = arrResult.Count;
            if (resultCount == 0)
                return null;

            bool isNormal = true;//GetIsNormal();

            for (int i = 0; i < resultCount; i += 3)
            {
                SOPManager.Model.Sop.Category.Version version = arrResult[i + 2] as SOPManager.Model.Sop.Category.Version;
                if (version == null)
                    continue;

                if (version.IsNormal == isNormal && (selectedVersion == null || selectedVersion.LastAccessTime < version.LastAccessTime))
                    selectedVersion = version;
                else if (version.IsNormal != isNormal && (selectedVersion2 == null || selectedVersion2.LastAccessTime < version.LastAccessTime))
                    selectedVersion2 = version;
            }

            if (selectedVersion == null && selectedVersion2 == null)
                return null;

            SOPManager.BLL.ProcessManager processMgr =
                new SOPManager.BLL.ProcessManager(m_processManager.CommonDataManager, m_processManager.SopDataManager, m_processManager.TeamDataManager, null);

            if (selectedVersion != null)
            {
                SOPManager.BLL.Models.Response.ResponseOpen response = processMgr.GetLoadManager().OpenDB(selectedVersion.ID);
                return response.SOPData;
            }
            else
            {
                SOPManager.BLL.Models.Response.ResponseOpen response = processMgr.GetLoadManager().OpenDB(selectedVersion2.ID);
                return response.SOPData;
            }
        }

        public MessageResult CloseSOP(RequestCloseSOP req)
        {
            MessageResult res = new MessageResult();

            try
            {
                if (req.ID <= 0)
                {
                    res.Message = "SOP ID를 입력하세요";
                    return res;
                }

                string strError = null;
                ActionStepHistory history = m_processManager.CommonDataManager.GetSelectManager().SelectActionStepHistory(req.ID, out strError);
                if (history == null)
                {
                    if (strError?.Length > 0)
                        throw new ApplicationException(strError);
                    else
                        throw new ApplicationException("해당 ID의 SOP 내역이 없습니다. ID를 확인하세요");
                }

                SOPSimulator.BLL.ProcessManager sopProcManager = new SOPSimulator.BLL.ProcessManager(
                    m_processManager.CommonDataManager,
                    m_processManager.SopDataManager,
                    m_processManager.TeamDataManager,
                    m_processManager.SopSimulatorDataManager,
                    null);

                if (!sopProcManager.GetSopRunManager().CloseSOP(history))
                    throw new ApplicationException("SOP 종료 실패 : " + req.ID);

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        public MessageResult CloseAllSOP()
        {
            MessageResult res = new MessageResult();

            try
            {
                string strError = null;
                List<ActionStepHistory> histories = m_processManager.CommonDataManager.GetSelectManager().SelectActionStepHistories("EndTime IS null", out strError);
                if (histories == null)
                    throw new ApplicationException(strError);

                SOPSimulator.BLL.ProcessManager sopProcManager = new SOPSimulator.BLL.ProcessManager(
                    m_processManager.CommonDataManager,
                    m_processManager.SopDataManager,
                    m_processManager.TeamDataManager,
                    m_processManager.SopSimulatorDataManager,
                    null);

                foreach (ActionStepHistory history in histories)
                {
                    if (!sopProcManager.GetSopRunManager().CloseSOP(history))
                        throw new ApplicationException("SOP 종료 실패 : " + history.ID);
                }

                sopProcManager.GetSopRunManager().DicSopRunDatas.Clear();

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }
    }
}
