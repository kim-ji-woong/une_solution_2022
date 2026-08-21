using Common.Model.History;
using History.BLL.Models.Response;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using SOPManager.Model.Sop.Category;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Hynix.BLL.Process
{
    using Response;

    public class HistoryManager
    {
        private ProcessManager m_processManager = null;
        private static List<string> m_strActionStepNames = null;

        public HistoryManager(ProcessManager processManager)
        {
            this.m_processManager = processManager;
            InitActionStepNames();
        }

        /// <summary>
        /// 알람 단계 명칭 조회
        /// </summary>
        private void InitActionStepNames()
        {
            if (m_strActionStepNames == null)
            {
                SOPManager.BLL.ProcessManager processMgr =
                    new SOPManager.BLL.ProcessManager(m_processManager.CommonDataManager, m_processManager.SopDataManager, m_processManager.TeamDataManager, m_processManager.SdmsDataManager);
                m_strActionStepNames = processMgr.GetLoadManager().InitActionStepNames();
            }
        }

        public ResponseSensorDetectHistories DisplaySensorDetectHistories(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID, int nLastSensorZoneHistoryID, int rowCount, bool bIsDesc, int nSiteID, bool justOneType)
        {
            string strErrorMessage = null;

            string strCondition = string.Format("{0}.{1} in (0,21,50,62,64)", SensorReactionHistory.TableName, SensorReactionHistory.Fields.ReactionType);

            string strConditionSensorTypes = "";
            if (facilityType > -1)
            {
                //if (justOneType)
                //{
                //    strConditionSensorTypes = string.Format(" And SensorType = {0}", facilityType);
                //}
                //else
                //{
                //    if (Facility.IsFireSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetFireTypeAllNumberToList()));
                //    else if (Facility.IsPSMSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetPSMTypeAllNumberToList()));
                //    else if (Facility.IsETCSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetETCTypeAllNumberToList()));
                //    else if (Facility.IsSVMSSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetSVMSTypeAllNumberToList()));
                //    else if (Facility.IsEarthquakeSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetEarthquakeTypeAllNumberToList()));
                //    else if (Facility.IsStrongWindSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetStrongWindTypeAllNumberToList()));
                //    else if (Facility.IsBlackOutSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetBlackOutTypeAllNumberToList()));
                //    else if (Facility.IsLaserSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetLaserTypeAllNumberToList()));
                //    else if (Facility.IsDoorSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetDoorTypeAllNumberToList()));
                //}
                strConditionSensorTypes = string.Format(" And SensorType = {0}", facilityType);
            }

            StringBuilder sb = new StringBuilder();
            sb.Append(" And SdmsHistorySensorReaction.SensorZoneHistoryID in (");
            if (rowCount > 0)
            {
                // mysql : subQuery에 limit 포함하려면 한번 더 감싸야함
                if (nSiteID == 14)
                    sb.Append("Select subq.ID from (select sz.ID ");
                else
                    sb.AppendFormat("Select TOP({0}) sz.ID ", rowCount);
            }
            else
                sb.AppendFormat("Select sz.ID", rowCount);
            sb.Append("        From SdmsHistorySensorZone as sz ");
            sb.Append("       INNER join SdmsSpatialZone as z on sz.ZoneID=z.ID");
            sb.AppendFormat(" Where Time >= '{0}' And Time <= '{1}'", beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));
            if (nLastSensorZoneHistoryID > 0)
            {
                if (bIsDesc)
                    sb.AppendFormat(" And sz.ID < {0}", nLastSensorZoneHistoryID);
                else
                    sb.AppendFormat(" And sz.ID > {0}", nLastSensorZoneHistoryID);
            }
            if (strConditionSensorTypes.Length > 0)
                sb.Append(strConditionSensorTypes);

            if (buildingGroupID > 0 || buildingID > 0 || zoneID > 0)
            {
                if (zoneID > 0)
                    sb.AppendFormat(" And z.ID = {0}", zoneID);
                else
                {
                    if (buildingID > 0)
                    {
                        sb.AppendFormat(" And z.BuildingID = {0}", buildingID);
                    }
                    else if (buildingGroupID > 0)
                    {
                        sb.AppendFormat(" And z.BuildingID in (Select ID From SdmsSpatialBuilding Where BuildingGroupID = {0})", buildingGroupID);
                    }
                }
            }

            if (nSiteID > 0)
            {
                sb.AppendFormat(" And sz.SiteID = {0}", nSiteID);
            }

            if (rowCount > 0)
            {
                sb.Append(" Order By sz.ID ");
                if (!bIsDesc)
                    sb.Append(" Asc");
                else
                    sb.Append(" Desc");

                if (nSiteID == 14)
                    sb.AppendFormat(" LIMIT {0}) as subq", rowCount);
            }
            sb.Append(" ) ");
            sb.Append(" Order By SdmsHistorySensorZone.ID ");
            if (!bIsDesc)
                sb.Append(" Asc");
            else
                sb.Append(" Desc");

            strCondition += sb.ToString();

            return DisplaySensorDetectHistories(strCondition, rowCount);
        }

        public ResponseSensorDetectHistories DisplaySensorDetectHistoryQuery(string condition, int nLastSensorZoneHistoryID, int rowCount, int nSiteID, bool bIsDesc)
        {
            string strCondition = string.Format("{0}.{1} in (0,21,50,62,64)", SensorReactionHistory.TableName, SensorReactionHistory.Fields.ReactionType);

            if (condition != null && condition.Trim().Length > 0)
            {
                condition = ChangeDetectCondition(condition);

                string strCondition2 = condition.Replace("time", "SdmsHistorySensorReaction.time");
                strCondition2 = strCondition2.Replace("sensortype", "SdmsHistorySensorZone.sensortype");

                strCondition += " and " + strCondition2;
            }
            else
                condition = null;

            StringBuilder sb = new StringBuilder();
            sb.Append(" And SdmsHistorySensorReaction.SensorZoneHistoryID in (");

            if (rowCount > 0)
            {
                sb.AppendFormat("Select TOP({0}) sz.ID ", rowCount);
            }
            else
                sb.AppendFormat("Select sz.ID", rowCount);

            sb.Append("        From SdmsHistorySensorZone as sz ");
            sb.Append("       INNER join SdmsSpatialZone as z on sz.ZoneID=z.ID");

            if (condition != null)
                sb.AppendFormat(" where {0}", condition);

            if (nLastSensorZoneHistoryID > 0)
            {
                if (bIsDesc)
                    sb.AppendFormat(" And sz.ID < {0}", nLastSensorZoneHistoryID);
                else
                    sb.AppendFormat(" And sz.ID > {0}", nLastSensorZoneHistoryID);
            }

            if (nSiteID > 0)
            {
                sb.AppendFormat(" And sz.SiteID = {0}", nSiteID);
            }

            if (rowCount > 0)
            {
                sb.Append(" Order By sz.ID ");
                if (!bIsDesc)
                    sb.Append(" Asc");
                else
                    sb.Append(" Desc");

                if (nSiteID == 14)
                    sb.AppendFormat(" LIMIT {0}) as subq", rowCount);
            }
            sb.Append(" ) ");
            sb.Append(" Order By SdmsHistorySensorZone.ID ");
            if (!bIsDesc)
                sb.Append(" Asc");
            else
                sb.Append(" Desc");

            strCondition += sb.ToString();
            return DisplaySensorDetectHistories(strCondition, rowCount);
        }

        private ResponseSensorDetectHistories DisplaySensorDetectHistories(string strCondition, int rowCount)
        {
            string strErrorMessage;

            ArrayList arrResult = m_processManager.SdmsDataManager.GetSelectManager().JoinEquipmentZoneSensorReactionHistorySensorZoneSensorZoneHistory(null, null, null, null, strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            ResponseSensorDetectHistories res = new ResponseSensorDetectHistories();

            if (arrResult.Count == 0)
                return res;

            List<History.BLL.Models.Data.SensorDetectHistoryData> datas = new List<History.BLL.Models.Data.SensorDetectHistoryData>();

            // 각 알람이 어떻게 종료되었는지 (50:상황종료/21:오작동/64:user reset)
            Dictionary<int, History.BLL.LoadManager.SensorZoneKey> endTypes2 = new Dictionary<int, History.BLL.LoadManager.SensorZoneKey>();

            List<int> allSensorZoneIDs = new List<int>();

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount; i += 5)
            {
                if (arrResult[i] is EquipmentZone &&
                    arrResult[i + 1] is SensorReactionHistory &&
                    arrResult[i + 2] is SensorZone &&
                    arrResult[i + 3] is SensorZoneHistory &&
                    //arrResult[i + 4] is Building &&
                    arrResult[i + 4] is Zone)
                {
                    History.BLL.Models.Data.SensorDetectHistoryData data = new History.BLL.Models.Data.SensorDetectHistoryData();

                    EquipmentZone eq = arrResult[i] as EquipmentZone;
                    SensorReactionHistory srh = arrResult[i + 1] as SensorReactionHistory;
                    SensorZone sz = arrResult[i + 2] as SensorZone;
                    SensorZoneHistory szh = arrResult[i + 3] as SensorZoneHistory;
                    //Building b = arrResult[i + 4] as Building;
                    Zone z = arrResult[i + 4] as Zone;

                    allSensorZoneIDs.AddRange(szh.AllSensorZoneIDs);

                    int sensorZoneID;
                    int.TryParse(srh.Param2, out sensorZoneID);
                    int isAlarm;
                    int.TryParse(srh.Param4, out isAlarm);

                    if (srh.ReactionType == SensorReactionHistory.ReactionTypes.MALFUNCTION ||
                        srh.ReactionType == SensorReactionHistory.ReactionTypes.END_STATUS ||
                        srh.ReactionType == SensorReactionHistory.ReactionTypes.USER_RESET ||
                        (srh.ReactionType == SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH && isAlarm == 0))
                    {
                        History.BLL.LoadManager.SensorZoneKey key;
                        if (!endTypes2.TryGetValue(srh.SensorZoneHistoryID, out key))
                        {
                            key = new History.BLL.LoadManager.SensorZoneKey();
                            key.SensorZoneHistoryID = srh.SensorZoneHistoryID;
                            key.SensorZoneID = sensorZoneID;
                            key.EndTime = srh.Time.ToString("yyyy-MM-dd HH:mm:ss");
                            endTypes2[srh.SensorZoneHistoryID] = key;
                        }

                        if (key.ReactionType != SensorReactionHistory.ReactionTypes.END_STATUS)
                        {
                            if (srh.ReactionType == SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH)
                                key.ReactionType = SensorReactionHistory.ReactionTypes.END_STATUS;
                            else
                                key.ReactionType = srh.ReactionType;
                        }

                        //res.LastSensorReactionHistoryID = (res.LastSensorReactionHistoryID == -1) ? szh.ID : Math.Min(res.LastSensorReactionHistoryID, szh.ID);
                        continue;
                    }

                    if (rowCount > 0 && datas.Count == rowCount) // 바인딩할 개수만큼만 담는다
                        continue;

                    res.LastSensorReactionHistoryID = (res.LastSensorReactionHistoryID == -1) ? szh.ID : Math.Min(res.LastSensorReactionHistoryID, szh.ID);

                    data.SensorZoneHistoryID = szh.ID;
                    data.ReactionType = (int)srh.ReactionType;
                    data.Time = srh.Time.ToString("yyyy-MM-dd HH:mm:ss");
                    data.Type = AgentFactory.BLL.Facility.GetNFacilityTypeString(szh.SensorType);
                    data.ZoneName = z.DisplayText + " " + eq.DisplayText;
                    data.RealMode = (szh.DetectionStatus == SensorZoneHistory.DetectionType.Real) ? "1" : "0";
                    data.DetectType = (sz.ID >= dnsSopID.Header.ManualReportDefaultID) ? "수동 신고" : "센서 감지";
                    data.DetectInfo = "-";
                    data.AllSensorZoneIDs = szh.AllSensorZoneIDs;
                    data.SensorZoneID = sensorZoneID;
                    data.Memo = szh.Memo;

                    if (srh.Param5 == "1" && m_strActionStepNames.Count > 0)
                        data.AlarmLevel = m_strActionStepNames[0];
                    else if (srh.Param5 == "2" && m_strActionStepNames.Count > 1)
                        data.AlarmLevel = m_strActionStepNames[1];
                    else if (srh.Param5 == "3" && m_strActionStepNames.Count > 2)
                        data.AlarmLevel = m_strActionStepNames[2];
                    else if (srh.Param5 == "4" && m_strActionStepNames.Count > 3)
                        data.AlarmLevel = m_strActionStepNames[3];

                    datas.Add(data);


                }
            }

            #region 알람 종료 방식 지정
            foreach (History.BLL.Models.Data.SensorDetectHistoryData data in datas)
            {
                History.BLL.LoadManager.SensorZoneKey key;
                if (endTypes2.TryGetValue(data.SensorZoneHistoryID, out key))
                {
                    switch (key.ReactionType)
                    {
                        case SensorReactionHistory.ReactionTypes.END_STATUS:
                            data.DetectInfo = "현장 종료";
                            break;
                        case SensorReactionHistory.ReactionTypes.MALFUNCTION:
                            data.DetectInfo = "오작동 처리";
                            break;
                        case SensorReactionHistory.ReactionTypes.USER_RESET:
                            data.DetectInfo = "사용자 종료";
                            break;
                    }

                    data.EndTime = key.EndTime;
                }
            }
            #endregion

            #region 대응 시작시간, 대응 종료시간 지정
            if (datas != null && datas.Count > 0)
            {
                string historyIDs = string.Join(", ", datas.Select(p => p.SensorZoneHistoryID).ToList());

                strCondition = string.Format("SensorZoneHistoryID in ({0})", historyIDs);
                ArrayList arrResult2 = m_processManager.CommonDataManager.GetSelectManager().JoinActionStepHistoryActionStep(null, null, strCondition, out strErrorMessage);
                if (arrResult2 == null)
                    return null;

                int nResultCount2 = arrResult2.Count;
                for (int i = 0; i < nResultCount2; i += 2)
                {
                    if (arrResult2[i] is ActionStepHistory && arrResult2[i + 1] is ActionStep)
                    {
                        ActionStepHistory history = arrResult2[i] as ActionStepHistory;
                        ActionStep actionStep = arrResult2[i + 1] as ActionStep;

                        for (int j = 0; j < datas.Count; j++)
                        {
                            if (history.SensorZoneHistoryID == datas[j].SensorZoneHistoryID)
                            {
                                datas[j].SopBeginTime = history.BeginTime.ToString("yyyy-MM-dd HH:mm:ss");
                                datas[j].SopEndTime = (history.EndTime == null) ? "-" : ((DateTime)history.EndTime).ToString("yyyy-MM-dd HH:mm:ss");

                                ArrayList arrResult3 = m_processManager.SopDataManager.GetSelectManager().JoinDisasterCategorySubDisasterCategoryDisasterActionStep(actionStep.ID, out strErrorMessage);
                                if (arrResult3 == null)
                                    return null;

                                if (arrResult3[0] is DisasterCategory && arrResult3[1] is SubDisasterCategory && arrResult3[2] is Disaster && arrResult3[3] is ActionStep)
                                {
                                    DisasterCategory a = arrResult3[0] as DisasterCategory;
                                    SubDisasterCategory b = arrResult3[1] as SubDisasterCategory;
                                    Disaster c = arrResult3[2] as Disaster;
                                    ActionStep d = arrResult3[3] as ActionStep;

                                    datas[j].SopName = /*a.CategoryName + ">" + b.SubCategoryName + ">" + */c.DisasterName + ">" + d.StepName;
                                }

                                datas[j].ActionStepHistoryID = history.ID;
                                break;
                            }
                        }
                    }
                }
            }
            #endregion

            #region 센서명 지정
            if (allSensorZoneIDs.Count > 0)
            {
                //strCondition = "";//string.Format("ID in ({0})", string.Join(", ", allSensorZoneIDs.Distinct()));
                strCondition = string.Format("ID in ({0})", string.Join(", ", allSensorZoneIDs.Distinct()));
                arrResult = m_processManager.HyDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
                if (arrResult == null)
                    return null;

                int resultCount = arrResult.Count;
                if (resultCount > 0)
                {
                    for (int j = 0; j < datas.Count; j++)
                    {
                        string strTemp = datas[j].Type;

                        for (int i = 0; i < resultCount; i += 3)
                        {
                            if (arrResult[i] is int && arrResult[i + 1] is int && arrResult[i + 2] is string)
                            {
                                int nSensorZoneID = (int)arrResult[i];
                                int nSensorType = (int)arrResult[i + 1];
                                string strSensorName = arrResult[i + 2].ToString();

                                if (datas[j].SensorZoneID == nSensorZoneID && datas[j].Type == AgentFactory.BLL.Facility.GetNFacilityTypeString(nSensorType) ||
                                    datas[j].SensorZoneID == nSensorZoneID && AgentFactory.BLL.Facility.IsHynixSensorType((AgentFactory.BLL.Facility.FacilityType)nSensorType))
                                {
                                    datas[j].SensorName = strSensorName;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            #endregion

            res.SensorDetectHistoryDatas = datas.OrderByDescending(p => p.Time).ThenByDescending(p => p.SensorZoneHistoryID).ToList();

            return res;
        }

        public ResponseSensorDetectCondition GetSensorDetectCondition(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID)
        {
            string strCondition = string.Format("Time >= '{0}' and Time <= '{1}'", GetTimeString(beginTime), GetTimeString(endTime));

            if (facilityType >= 0)
                strCondition += string.Format(" and SensorType = {0}", facilityType);

            if (buildingGroupID >= 0)
                strCondition += string.Format(" and BuildingGroupID = {0}", buildingGroupID);

            if (buildingID >= 0)
                strCondition += string.Format(" and BuildingID = {0}", buildingID);

            if (zoneID >= 0)
                strCondition += string.Format(" and ZoneID = {0}", zoneID);

            ResponseSensorDetectCondition response = new ResponseSensorDetectCondition(true, "");
            response.Condition = strCondition;
            return response;
        }

        private string GetTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private string ChangeDetectCondition(string condition)
        {
            if (condition != null && condition.Trim().Length > 0)
            {
                condition = condition.ToLower();

                string strField = "buildinggroupid";
                string strField2 = "building_group_id";
                string strFieldCondition = GetFieldCondition(strField, condition);

                while (strFieldCondition != null)
                {
                    string strFieldCondition3 = strFieldCondition.Replace(strField, strField2);
                    string strFieldCondition2 = string.Format("buildingID in (Select ID from SdmsSpatialBuilding where {0})", strFieldCondition3);
                    condition = condition.Replace(strFieldCondition, strFieldCondition2);

                    strFieldCondition = GetFieldCondition(strField, condition);
                }

                condition = condition.Replace(strField2, strField);
            }

            return condition;
        }

        private string ChangeAnalysisCondition(string condition)
        {
            if (condition != null && condition.Trim().Length > 0)
            {
                condition = condition.ToLower();

                string strField = "buildinggroupid";
                string strField2 = "building_group_id";
                string strFieldCondition = GetFieldCondition(strField, condition);

                while (strFieldCondition != null)
                {
                    string strFieldCondition3 = strFieldCondition.Replace(strField, strField2);
                    string strFieldCondition2 = string.Format("buildingID in (Select ID from SdmsSpatialBuilding where {0})", strFieldCondition3);
                    condition = condition.Replace(strFieldCondition, strFieldCondition2);

                    strFieldCondition = GetFieldCondition(strField, condition);
                }

                condition = condition.Replace(strField2, strField).ToLower();

                strField = "buildingid";
                strField2 = "building_id";
                strFieldCondition = GetFieldCondition(strField, condition);

                while (strFieldCondition != null)
                {
                    string strFieldCondition3 = strFieldCondition.Replace(strField, strField2);
                    string strFieldCondition2 = string.Format("zoneID in (Select ID from SdmsSpatialZone where {0})", strFieldCondition3);
                    condition = condition.Replace(strFieldCondition, strFieldCondition2);

                    strFieldCondition = GetFieldCondition(strField, condition);
                }

                condition = condition.Replace(strField2, strField);
            }

            return condition;
        }

        private string GetFieldCondition(string strField, string condition)
        {
            int index = condition.IndexOf(strField);

            if (index < 0)
                return null;

            int index1 = index + strField.Length;

            int opIndex = GetNextOperationIndex(index1, condition);

            if (opIndex < 0)
                return null;

            int parenthesesIndex = GetParentheses(opIndex, condition);

            if (parenthesesIndex > 0)
            {
                string strFieldCondition = condition.Substring(index, parenthesesIndex - index);
                return strFieldCondition;
            }

            string strLinker;
            int nextOpIndex = GetNextLinkerIndex(opIndex, condition, out strLinker);

            if (nextOpIndex > 0)
            {
                int index2 = nextOpIndex - strLinker.Length - 1;
                int index3 = GetLastIndexNoEmpty(index2, condition);

                if (index3 > 0)
                {
                    string strFieldCondition = condition.Substring(index, index3 - index + 1);
                    return strFieldCondition;
                }
            }

            return condition.Substring(index);
        }

        private int GetLastIndexNoEmpty(int index, string condition)
        {
            for (int i = index; i >= 0; i--)
            {
                if (condition[i] != ' ' && condition[i] != '\t' && condition[i] != '\r' && condition[i] != '\n')
                {
                    return i;
                }
            }

            return -1;
        }

        private int GetParentheses(int index, string condition)
        {
            int len = condition.Length;
            int beginIndex = -1;
            int openCount = 0, closeCount = 0;

            for (int i = index; i < len; i++)
            {
                if (beginIndex < 0)
                {
                    if (condition[i] != ' ' && condition[i] != '\t' && condition[i] != '\r' && condition[i] != '\n')
                    {
                        if (condition[i] == '(')
                        {
                            beginIndex = i;
                            openCount = 1;
                        }
                        else
                            break;
                    }
                }
                else
                {
                    if (condition[i] == '(')
                        openCount++;
                    else if (condition[i] == ')')
                    {
                        closeCount++;

                        if (openCount == closeCount)
                            return i + 1;
                    }
                }
            }

            return -1;
        }

        private int GetNextOperationIndex(int index, string condition)
        {
            int len = condition.Length;
            int beginIndex = -1;

            for (int i = index; i < len; i++)
            {
                if (beginIndex < 0)
                {
                    if (condition[i] != ' ' && condition[i] != '\t' && condition[i] != '\r' && condition[i] != '\n')
                    {
                        beginIndex = i;

                        if (IsOperator(beginIndex, beginIndex, condition))
                        {
                            return i + 1;
                        }
                    }
                }
                else
                {
                    if (condition[i] != ' ' && condition[i] != '\t' && condition[i] != '\r' && condition[i] != '\n')
                    {
                        if (IsOperator(beginIndex, i, condition))
                        {
                            return i + 1;
                        }
                    }
                    else
                        beginIndex = -1;
                }
            }

            return -1;
        }

        private int GetNextLinkerIndex(int index, string condition, out string linker)
        {
            int len = condition.Length;
            int beginIndex = -1;
            linker = null;

            for (int i = index; i < len; i++)
            {
                if (beginIndex < 0)
                {
                    if (condition[i] != ' ' && condition[i] != '\t' && condition[i] != '\r' && condition[i] != '\n')
                    {
                        beginIndex = i;

                        if (IsLinker(beginIndex, beginIndex, condition))
                        {
                            linker = condition.Substring(beginIndex, i + 1 - beginIndex);
                            return i + 1;
                        }
                    }
                }
                else
                {
                    if (condition[i] != ' ' && condition[i] != '\t' && condition[i] != '\r' && condition[i] != '\n')
                    {
                        if (IsLinker(beginIndex, i, condition))
                        {
                            linker = condition.Substring(beginIndex, i + 1 - beginIndex);
                            return i + 1;
                        }
                    }
                    else
                        beginIndex = -1;
                }
            }

            return -1;
        }

        private bool IsLinker(int beginIndex, int endIndex, string condition)
        {
            string strOp = condition.Substring(beginIndex, endIndex - beginIndex + 1);

            if (strOp == "and" || strOp == "or")
                return true;

            return false;
        }

        private bool IsOperator(int beginIndex, int endIndex, string condition)
        {
            string strOp = condition.Substring(beginIndex, endIndex - beginIndex + 1);

            if (strOp == "=" || strOp == "<=" || strOp == ">=" || strOp == "<>" || strOp == "in")
                return true;

            if ((strOp == "<" || strOp == ">") && endIndex < condition.Length - 1)
            {
                string strOp2 = condition.Substring(beginIndex, endIndex - beginIndex + 2);

                if (strOp == "<>" || strOp == "<=" || strOp == ">=")
                    return false;
                else
                    return true;
            }

            return false;
        }

        public ResponseSensorDetectAnalysis DisplaySensorDetectAnalysis(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID, int siteID, bool justOneType)
        {
            string strErrorMessage = null;

            string strCondition = string.Format(" {0}.{1} >= '{2}' And {0}.{1} <= '{3}' And {0}.{4} < {5} And {6}.{7} in (0,21,50,64)"
                , SensorZoneHistory.TableName, SensorZoneHistory.Fields.Time
                , beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss")
                , SensorZoneHistory.Fields.SensorZoneID, dnsSopID.Header.ManualReportDefaultID
                , SensorReactionHistory.TableName, SensorReactionHistory.Fields.ReactionType);

            if (facilityType > -1)
            {
                string strConditionFacilityType = "";

                //if (justOneType)
                //{
                //    strConditionFacilityType = string.Format(" And {0}.{1} = {2}", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, facilityType);
                //}
                //else
                //{
                //    if (Facility.IsFireSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetFireTypeAllNumberToList()));
                //    else if (Facility.IsPSMSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetPSMTypeAllNumberToList()));
                //    else if (Facility.IsETCSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetETCTypeAllNumberToList()));
                //    else if (Facility.IsSVMSSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetSVMSTypeAllNumberToList()));
                //    else if (Facility.IsEarthquakeSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetEarthquakeTypeAllNumberToList()));
                //    else if (Facility.IsStrongWindSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetStrongWindTypeAllNumberToList()));
                //    else if (Facility.IsBlackOutSensorType(Facility.ToFacilityType(facilityType)))
                //        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetBlackOutTypeAllNumberToList()));
                //}
                strConditionFacilityType = string.Format(" And {0}.{1} = {2}", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, facilityType);

                if (strConditionFacilityType.Length > 0)
                    strCondition += strConditionFacilityType;
            }

            if (buildingGroupID > 0 || buildingID > 0 || zoneID > 0)
            {
                string strConditionZone = "";
                if (zoneID > 0)
                {
                    strConditionZone = string.Format(" And {0}.{1} = {2}", SensorZoneHistory.TableName, SensorZoneHistory.Fields.ZoneID, zoneID);
                }
                else
                {
                    if (buildingID > 0)
                    {
                        strConditionZone = string.Format(" And {0} in (select {1} from {2} Where {3} = {4})"
                            , SensorZoneHistory.Fields.ZoneID, Zone.Fields.ID, Zone.TableName, Zone.Fields.BuildingID, buildingID);
                    }
                    else if (buildingGroupID > 0)
                    {
                        strConditionZone = string.Format(" And {0} in (select {1} from {2} Where {3} in (Select {4} From {5} Where {6} = {7}))"
                            , SensorZoneHistory.Fields.ZoneID, Zone.Fields.ID, Zone.TableName, Zone.Fields.BuildingID, Building.Fields.ID, Building.TableName, Building.Fields.BuildingGroupID, buildingGroupID);
                    }
                }

                strCondition += strConditionZone;
            }

            if (siteID > 0)
            {
                strCondition += string.Format(" And {0}.{1} = {2}", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SiteID, siteID);
            }

            ArrayList arrResult = m_processManager.SdmsDataManager.GetSelectManager().JoinSensorZoneHistorySensorReactionHistory(strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            Dictionary<int, History.BLL.Models.Data.SensorDetectAnalysisData> dicDatas = new Dictionary<int, History.BLL.Models.Data.SensorDetectAnalysisData>();

            int allDetectCount = 0;
            int allMalfunctionCount = 0;

            int resultCount = arrResult.Count;
            for (int i = 0; i < resultCount; i += 2)
            {
                if ((arrResult[i] is SensorZoneHistory) == false || (arrResult[i + 1] is SensorReactionHistory) == false)
                    continue;

                SensorZoneHistory szh = arrResult[i] as SensorZoneHistory;
                SensorReactionHistory srh = arrResult[i + 1] as SensorReactionHistory;

                foreach (int sensorZoneID in szh.AllSensorZoneIDs)
                {
                    History.BLL.Models.Data.SensorDetectAnalysisData data;
                    if (dicDatas.TryGetValue(sensorZoneID, out data))
                    {
                        data = dicDatas[sensorZoneID];
                    }
                    else
                    {
                        data = new History.BLL.Models.Data.SensorDetectAnalysisData();
                        data.SensorZoneHistoryID = szh.ID;
                        data.SensorZoneID = sensorZoneID;
                        data.ZoneID = szh.ZoneID;
                        data.Type = AgentFactory.BLL.Facility.GetNFacilityTypeString(szh.SensorType);

                        dicDatas.Add(sensorZoneID, data);
                    }

                    if (srh.ReactionType == SensorReactionHistory.ReactionTypes.BEGIN_STATUS)
                    {
                        data.DetectCount++;
                        allDetectCount++;
                    }
                    else if (srh.ReactionType == SensorReactionHistory.ReactionTypes.END_STATUS)
                        data.EndCount++;
                    else if (srh.ReactionType == SensorReactionHistory.ReactionTypes.USER_RESET)
                        data.UserResetCount++;
                    else if (srh.ReactionType == SensorReactionHistory.ReactionTypes.MALFUNCTION)
                    {
                        data.MalfunctionCount++;
                        allMalfunctionCount++;
                    }
                }
            }

            ResponseSensorDetectAnalysis res = new ResponseSensorDetectAnalysis();
            if (buildingGroupID > 0)
            {
                BuildingGroup group = m_processManager.SdmsDataManager.GetSelectManager().SelectBuildingGroup(buildingGroupID, out strErrorMessage);
                res.SearchZoneName = group.DisplayText;

                if (buildingID > 0)
                {
                    Building building = m_processManager.SdmsDataManager.GetSelectManager().SelectBuilding(buildingID, out strErrorMessage);
                    res.SearchZoneName += " " + building.DisplayText;

                    if (zoneID > 0)
                    {
                        Zone zone = m_processManager.SdmsDataManager.GetSelectManager().SelectZone(zoneID, out strErrorMessage);
                        res.SearchZoneName += " " + zone.DisplayText;
                    }
                }
            }
            else
                res.SearchZoneName = "전체";

            strCondition = "";//string.Format("ID in ({0})", string.Join(", ", allSensorZoneIDKeys.Select(p => p.SensorZoneID)));
            ArrayList sensorNameResult = m_processManager.HyDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
            if (sensorNameResult == null)
                return null;

            strCondition = "";//string.Format("{0}.{1} in ({2})", Zone.TableName, Zone.Fields.ID, string.Join(", ", allSensorZoneIDKeys.Select(p => p.ZoneID)));
            ArrayList zoneResult = m_processManager.SdmsDataManager.GetSelectManager().JoinBuildingGroupBuildingZone(null, null, null, strCondition, out strErrorMessage);
            if (zoneResult == null)
                return null;

            int sensorNameResultCount = sensorNameResult.Count;
            int zoneResultCount = zoneResult.Count;

            string maxCountSensorName = "";
            int maxMalfunctionCount = 0;
            double allDetectRate = 0;

            dicDatas = dicDatas.OrderByDescending(x => x.Value.DetectCount).ToDictionary(x => x.Key, x => x.Value);

            List<History.BLL.Models.Data.SensorDetectAnalysisData> datas = new List<History.BLL.Models.Data.SensorDetectAnalysisData>();
            foreach (KeyValuePair<int, History.BLL.Models.Data.SensorDetectAnalysisData> item in dicDatas)
            {
                History.BLL.Models.Data.SensorDetectAnalysisData data = item.Value;
                data.MalfunctionRate = Math.Round(((float)data.MalfunctionCount / (float)data.DetectCount) * 100, 2);
                if (double.IsNaN(data.MalfunctionRate))
                    data.MalfunctionRate = 0;

                allDetectRate = allDetectRate + (float)data.DetectCount / allDetectCount * 100;
                data.DetectRate = (allDetectRate > 100) ? 100 : Math.Round(allDetectRate, 2);

                for (int i = 0; i < sensorNameResultCount; i += 3)
                {
                    if (sensorNameResult[i] is int && sensorNameResult[i + 1] is int && sensorNameResult[i + 2] is string)
                    {
                        int nSensorZoneID = (int)sensorNameResult[i];
                        int nSensorType = (int)sensorNameResult[i + 1];
                        string strSensorName = sensorNameResult[i + 2].ToString();

                        if (data.SensorZoneID == nSensorZoneID)
                        {
                            data.SensorName = strSensorName;
                            break;
                        }
                    }
                }

                for (int i = 0; i < zoneResultCount; i += 3)
                {
                    if (zoneResult[i] is BuildingGroup && zoneResult[i + 1] is Building && zoneResult[i + 2] is Zone)
                    {
                        BuildingGroup buildingGroup = zoneResult[i] as BuildingGroup;
                        Building building = zoneResult[i + 1] as Building;
                        Zone zone = zoneResult[i + 2] as Zone;

                        if (zone.ID == data.ZoneID)
                        {
                            data.ZoneName = buildingGroup.DisplayText + " " + building.DisplayText + " " + zone.DisplayText;
                            break;
                        }
                    }
                }

                if (maxMalfunctionCount < data.MalfunctionCount)
                {
                    maxCountSensorName = data.SensorName;
                    maxMalfunctionCount = data.MalfunctionCount;
                }

                datas.Add(data);
            }

            //datas = datas.OrderByDescending(p => p.DetectCount).ToList();

            res.SensorDetectAnalysisDatas = datas;
            res.AllDetectCount = allDetectCount;
            res.AllMalfunctionRate = 0;
            if (allMalfunctionCount != 0 && allDetectCount != 0)
                res.AllMalfunctionRate = Math.Round(((float)allMalfunctionCount / (float)allDetectCount) * 100, 2);
            res.MaxCountSensorName = maxCountSensorName;

            return res;
        }

        public ResponseSensorDetectAnalysis DisplaySensorDetectAnalysisQuery(string condition, int siteID)
        {
            string strErrorMessage = null;

            string strCondition = string.Format(" {0}.{1} < {2} And {3}.{4} in (0,21,50,64)"
                , SensorZoneHistory.TableName
                , SensorZoneHistory.Fields.SensorZoneID, dnsSopID.Header.ManualReportDefaultID
                , SensorReactionHistory.TableName, SensorReactionHistory.Fields.ReactionType);

            if (condition != null && condition.Trim().Length > 0)
            {
                condition = ChangeAnalysisCondition(condition);

                string strCondition2 = condition.Replace("time", "SdmsHistorySensorZone.time");
                strCondition2 = strCondition2.Replace("sensortype", "SdmsHistorySensorZone.sensortype");

                strCondition += " and " + strCondition2;
            }
            else
                condition = null;

            if (siteID > 0)
            {
                strCondition += string.Format(" And {0}.{1} = {2}", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SiteID, siteID);
            }

            ArrayList arrResult = m_processManager.SdmsDataManager.GetSelectManager().JoinSensorZoneHistorySensorReactionHistory(strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            Dictionary<int, History.BLL.Models.Data.SensorDetectAnalysisData> dicDatas = new Dictionary<int, History.BLL.Models.Data.SensorDetectAnalysisData>();

            int allDetectCount = 0;
            int allMalfunctionCount = 0;

            int resultCount = arrResult.Count;
            for (int i = 0; i < resultCount; i += 2)
            {
                if ((arrResult[i] is SensorZoneHistory) == false || (arrResult[i + 1] is SensorReactionHistory) == false)
                    continue;

                SensorZoneHistory szh = arrResult[i] as SensorZoneHistory;
                SensorReactionHistory srh = arrResult[i + 1] as SensorReactionHistory;

                foreach (int sensorZoneID in szh.AllSensorZoneIDs)
                {
                    History.BLL.Models.Data.SensorDetectAnalysisData data;
                    if (dicDatas.TryGetValue(sensorZoneID, out data))
                    {
                        data = dicDatas[sensorZoneID];
                    }
                    else
                    {
                        data = new History.BLL.Models.Data.SensorDetectAnalysisData();
                        data.SensorZoneHistoryID = szh.ID;
                        data.SensorZoneID = sensorZoneID;
                        data.ZoneID = szh.ZoneID;
                        data.Type = AgentFactory.BLL.Facility.GetNFacilityTypeString(szh.SensorType);

                        dicDatas.Add(sensorZoneID, data);
                    }

                    if (srh.ReactionType == SensorReactionHistory.ReactionTypes.BEGIN_STATUS)
                    {
                        data.DetectCount++;
                        allDetectCount++;
                    }
                    else if (srh.ReactionType == SensorReactionHistory.ReactionTypes.END_STATUS)
                        data.EndCount++;
                    else if (srh.ReactionType == SensorReactionHistory.ReactionTypes.USER_RESET)
                        data.UserResetCount++;
                    else if (srh.ReactionType == SensorReactionHistory.ReactionTypes.MALFUNCTION)
                    {
                        data.MalfunctionCount++;
                        allMalfunctionCount++;
                    }
                }
            }

            ResponseSensorDetectAnalysis res = new ResponseSensorDetectAnalysis();
            res.SearchZoneName = "검색된 조건";

            strCondition = "";//string.Format("ID in ({0})", string.Join(", ", allSensorZoneIDKeys.Select(p => p.SensorZoneID)));
            ArrayList sensorNameResult = m_processManager.HyDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
            if (sensorNameResult == null)
                return null;

            strCondition = "";//string.Format("{0}.{1} in ({2})", Zone.TableName, Zone.Fields.ID, string.Join(", ", allSensorZoneIDKeys.Select(p => p.ZoneID)));
            ArrayList zoneResult = m_processManager.SdmsDataManager.GetSelectManager().JoinBuildingGroupBuildingZone(null, null, null, strCondition, out strErrorMessage);
            if (zoneResult == null)
                return null;

            int sensorNameResultCount = sensorNameResult.Count;
            int zoneResultCount = zoneResult.Count;

            string maxCountSensorName = "";
            int maxMalfunctionCount = 0;
            double allDetectRate = 0;

            dicDatas = dicDatas.OrderByDescending(x => x.Value.DetectCount).ToDictionary(x => x.Key, x => x.Value);

            List<History.BLL.Models.Data.SensorDetectAnalysisData> datas = new List<History.BLL.Models.Data.SensorDetectAnalysisData>();
            foreach (KeyValuePair<int, History.BLL.Models.Data.SensorDetectAnalysisData> item in dicDatas)
            {
                History.BLL.Models.Data.SensorDetectAnalysisData data = item.Value;
                data.MalfunctionRate = Math.Round(((float)data.MalfunctionCount / (float)data.DetectCount) * 100, 2);
                if (double.IsNaN(data.MalfunctionRate))
                    data.MalfunctionRate = 0;

                allDetectRate = allDetectRate + (float)data.DetectCount / allDetectCount * 100;
                data.DetectRate = (allDetectRate > 100) ? 100 : Math.Round(allDetectRate, 2);

                for (int i = 0; i < sensorNameResultCount; i += 3)
                {
                    if (sensorNameResult[i] is int && sensorNameResult[i + 1] is int && sensorNameResult[i + 2] is string)
                    {
                        int nSensorZoneID = (int)sensorNameResult[i];
                        int nSensorType = (int)sensorNameResult[i + 1];
                        string strSensorName = sensorNameResult[i + 2].ToString();

                        if (data.SensorZoneID == nSensorZoneID)
                        {
                            data.SensorName = strSensorName;
                            break;
                        }
                    }
                }

                for (int i = 0; i < zoneResultCount; i += 3)
                {
                    if (zoneResult[i] is BuildingGroup && zoneResult[i + 1] is Building && zoneResult[i + 2] is Zone)
                    {
                        BuildingGroup buildingGroup = zoneResult[i] as BuildingGroup;
                        Building building = zoneResult[i + 1] as Building;
                        Zone zone = zoneResult[i + 2] as Zone;

                        if (zone.ID == data.ZoneID)
                        {
                            data.ZoneName = buildingGroup.DisplayText + " " + building.DisplayText + " " + zone.DisplayText;
                            break;
                        }
                    }
                }

                if (maxMalfunctionCount < data.MalfunctionCount)
                {
                    maxCountSensorName = data.SensorName;
                    maxMalfunctionCount = data.MalfunctionCount;
                }

                datas.Add(data);
            }

            //datas = datas.OrderByDescending(p => p.DetectCount).ToList();

            res.SensorDetectAnalysisDatas = datas;
            res.AllDetectCount = allDetectCount;
            res.AllMalfunctionRate = 0;
            if (allMalfunctionCount != 0 && allDetectCount != 0)
                res.AllMalfunctionRate = Math.Round(((float)allMalfunctionCount / (float)allDetectCount) * 100, 2);
            res.MaxCountSensorName = maxCountSensorName;

            return res;
        }
    }
}
