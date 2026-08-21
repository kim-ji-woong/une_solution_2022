using Common.Model.History;
using dnsData.Sensor;
using dnsDBUtil;
using History.BLL.Models.Data;
using History.BLL.Models.Request;
using History.BLL.Models.Response;
using SDMS.Model.Assessment;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using SOPManager.Model.Sop.Account;
using SOPManager.Model.Sop.Category;
using SOPManager.Model.Sop.Component;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TeamEditor.Model.Sop.Team;
using History.IBLL.Models.Response;

namespace History.BLL
{
    public class LoadManager
    {
        private ProcessManager m_processManager = null;
        private static List<string> m_strActionStepNames = null;

        public LoadManager(ProcessManager processManager)
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
        public ResponseUserHistories DisplayUserHistory(DateTime beginTime, DateTime endTime, int nSiteID)
        {
            string strErrorMessage = null;

            string strCondition = string.Format("time >= '{0}' and time <= '{1}'", beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));
            List<UserHistory> userHistories = m_processManager.CommonDataManager.GetSelectManager().SelectUserHistories(null, strCondition, out strErrorMessage);
            if (userHistories == null)
                return null;

            List<User> users = m_processManager.SopDataManager.GetSelectManager().SelectUsers("", out strErrorMessage);
            if (users == null)
                return null;

            List<Level> levels = m_processManager.SopDataManager.GetSelectManager().SelectLevels(null, out strErrorMessage);
            if (levels == null)
                return null;

            List<Regular> regulars = m_processManager.TeamDataManager.GetSelectManager().SelectRegulars(null, out strErrorMessage);
            if (regulars == null)
                return null;

            List<RegularMember> regularMembers = m_processManager.TeamDataManager.GetSelectManager().SelectRegularMembers(null, out strErrorMessage);
            if (regularMembers == null)
                return null;

            List<UserHistoryData> datas = new List<UserHistoryData>();
            for (int i = 0; i < userHistories.Count; i++)
            {
                UserHistoryData data = new UserHistoryData();
                data.Time = userHistories[i].Time.ToString("yyyy-MM-dd HH:mm:ss");

                string strUserName = "";
                string strUserLevel = "";
                string strTeamName = "";
                
                bool bCheck = GetUserInfo(users, levels, regulars, regularMembers, userHistories[i].UserID, nSiteID, ref strUserName, ref strUserLevel, ref strTeamName);
                // 해당 사이트 User 체크
                if (bCheck == false)
                    continue;
                
                data.ID = userHistories[i].ID;
                data.Name = strUserName;
                data.Level = strUserLevel;
                data.TeamName = strTeamName;

                string strTargetType = "";
                string strActionType = "";
                GetActionType(userHistories[i].TargetType, userHistories[i].ActionType, ref strTargetType, ref strActionType);
                data.TargetType = strTargetType;
                data.ActionType = strActionType;
                data.HistoryContent = userHistories[i].HistoryContent;

                datas.Add(data);
            }

            ResponseUserHistories res = new ResponseUserHistories();
            res.UserHistoryDatas = datas;

            return res;
        }

        private bool GetUserInfo(List<User> users, List<Level> levels, List<Regular> regulars, List<RegularMember> regularMembers, int userID, int nSiteID, ref string strUserName, ref string strUserLevel, ref string strTeamName)
        {
            // 인원 조회 여부 체크하여 리턴 추가 >> 멀티 사이트 관련 조회
            bool bResult = true;

            int userLevel = -1;
            int? memberID = -1;
            User user = null;

            for (int i = 0; i < users.Count; i++)
            {
                // 해당 사이트 인원에 대해서만 조회
                if (users[i].ID == userID && users[i].SiteID == nSiteID)
                {
                    strUserName = users[i].NickName;
                    userLevel = users[i].UserLevel;
                    memberID = users[i].MemberID;

                    user = users[i];
                    break;
                }
            }

            if (user == null)
                bResult = false;

            if (userLevel >= 0)
            {
                for (int i = 0; i < levels.Count; i++)
                {
                    if (userLevel == levels[i].ID)
                    {
                        strUserLevel = levels[i].LevelName;
                        break;
                    }
                } 
            }
            else
            {
                strUserName = "-";
                strUserLevel = "-";
                strTeamName = "-";
            }

            if (memberID != null && memberID >= 0)
            {
                int regularID = -1;
                for (int i = 0; i < regularMembers.Count; i++)
                {
                    if (memberID == regularMembers[i].ID)
                    {
                        regularID = regularMembers[i].RegularID;
                        break;
                    }
                }

                if (regularID >= 0)
                {
                    for (int i = 0; i < regulars.Count; i++)
                    {
                        if (regularID == regulars[i].ID)
                        {
                            strTeamName = regulars[i].TeamName;
                            break;
                        }
                    }
                }
            }

            return bResult;
        }

        private void GetActionType(int targetType, int actionType, ref string strTargetType, ref string strActionType)
        {
            switch (targetType)
            {
                case 0: 
                    strTargetType = "POI";
                    break;
                case 1:
                    strTargetType = "공간정보";
                    break;
                case 2:
                    strTargetType = "가벽";
                    break;
                case 3:
                    strTargetType = "SOP";
                    break;
                case 4:
                    strTargetType = "현황정보";
                    break;
                case 5:
                    strTargetType = "사용자 권한";
                    break;
                case 6:
                    strTargetType = "빌딩 그룹 명칭";
                    break;
                case 7:
                    strTargetType = "빌딩 명칭";
                    break;
            }

            switch (actionType)
            {
                case 0:
                    strActionType = "추가";
                    break;
                case 1:
                    strActionType = "수정";
                    break;
                case 2:
                    strActionType = "이동";
                    break;
                case 3:
                    strActionType = "삭제";
                    break;
                case 4:
                    strActionType = "업로드";
                    break;
                case 5:
                    strActionType = "다운로드";
                    break;
            }
            
        }

        public ResponseMinMaxIndex GetMinMaxIndex(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID, bool justOneType)
        {
            string strErrorMessage = null;

            string strConditionSensorTypes = "";
            if (facilityType > -1)
            {
                if (justOneType)
                {
                    strConditionSensorTypes = string.Format(" And SensorType = {0}", facilityType);
                }
                else
                {
                    if (Facility.IsFireSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetFireTypeAllNumberToList()));
                    else if (Facility.IsPSMSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetPSMTypeAllNumberToList()));
                    else if (Facility.IsETCSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetETCTypeAllNumberToList()));
                    else if (Facility.IsSVMSSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetSVMSTypeAllNumberToList()));
                    else if (Facility.IsEarthquakeSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetEarthquakeTypeAllNumberToList()));
                    else if (Facility.IsStrongWindSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetStrongWindTypeAllNumberToList()));
                    else if (Facility.IsBlackOutSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetBlackOutTypeAllNumberToList()));
                    else if (Facility.IsH2SensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetH2TypeAllNumberToList()));
                    else if (Facility.IsFlowSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetFlowTypeAllNumberToList()));
                    else if (Facility.IsTempSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetTempTypeAllNumberToList()));
                    else if (Facility.IsConductivitySensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetConductivityTypeAllNumberToList()));
                    else if (Facility.IsPressureSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetPressureTypeAllNumberToList()));
                    else if (Facility.IsGasSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetGASTypeAllNumberToList()));
                }
            }

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(" SdmsHistorySensorZone.Time >= '{0}' And SdmsHistorySensorZone.Time <= '{1}'", beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));
            
            if (strConditionSensorTypes.Length > 0)
                sb.Append(strConditionSensorTypes);

            if (buildingGroupID > 0 || buildingID > 0 || zoneID > 0)
            {
                if (zoneID > 0)
                {
                    sb.AppendFormat(" And SdmsSpatialZone.ID = {0}", zoneID);
                }
                else
                {
                    if (buildingID > 0)
                    {
                        sb.AppendFormat(" And SdmsSpatialZone.BuildingID = {0}", buildingID);
                    }
                    else if (buildingGroupID > 0)
                    {
                        sb.AppendFormat(" And SdmsSpatialZone.BuildingID in (Select ID From SdmsSpatialBuilding Where BuildingGroupID = {0})", buildingGroupID);
                    }
                }
            }

            ResponseMinMaxIndex res = new ResponseMinMaxIndex();

            ArrayList arrResult = m_processManager.SdmsDataManager.GetSelectManager().GetMinMaxIndexSensorReactionHistory(sb.ToString(), out strErrorMessage);
            if (arrResult != null && arrResult.Count == 2)
            {
                int minID = Convert.ToInt32(arrResult[0]);
                int maxID = Convert.ToInt32(arrResult[1]);

                res.MinReactionHistoryID = minID;
                res.MaxReactionHistoryID = maxID;
            }

            return res;
        }

        public ResponseSensorDetectHistories DisplaySensorDetectHistories(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID, int nLastSensorZoneHistoryID, int rowCount, bool bIsDesc, int nSiteID, bool justOneType)
        {
            string strErrorMessage = null;

            string strCondition = string.Format("{0}.{1} in (0,21,50,62,64)", SensorReactionHistory.TableName, SensorReactionHistory.Fields.ReactionType);

            string strConditionSensorTypes = "";
            if (facilityType > -1)
            {
                if (justOneType)
                {
                    strConditionSensorTypes = string.Format(" And SensorType = {0}", facilityType);
                }
                else
                {
                    if (Facility.IsFireSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetFireTypeAllNumberToList()));
                    else if (Facility.IsPSMSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetPSMTypeAllNumberToList()));
                    else if (Facility.IsETCSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetETCTypeAllNumberToList()));
                    else if (Facility.IsSVMSSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetSVMSTypeAllNumberToList()));
                    else if (Facility.IsEarthquakeSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetEarthquakeTypeAllNumberToList()));
                    else if (Facility.IsStrongWindSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetStrongWindTypeAllNumberToList()));
                    else if (Facility.IsBlackOutSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetBlackOutTypeAllNumberToList()));
                    else if (Facility.IsLaserSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetLaserTypeAllNumberToList()));
                    else if (Facility.IsDoorSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetDoorTypeAllNumberToList()));
                    else if (Facility.IsEnvironmentSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetEnvironmentTypeAllNumberToList()));
                    else if (Facility.IsManufactureSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetManufactureTypeAllNumberToList()));
                }
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

            ArrayList arrResult = m_processManager.SdmsDataManager.GetSelectManager().JoinEquipmentZoneSensorReactionHistorySensorZoneSensorZoneHistory(null, null, null, null, strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            ResponseSensorDetectHistories res = new ResponseSensorDetectHistories();

            if (arrResult.Count == 0)
                return res;

            List<SensorDetectHistoryData> datas = new List<SensorDetectHistoryData>();
            
            // 각 알람이 어떻게 종료되었는지 (50:상황종료/21:오작동/64:user reset)
            Dictionary<int, SensorZoneKey> endTypes2 = new Dictionary<int, SensorZoneKey>();

            List<int> allSensorZoneIDs = new List<int>();            

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount; i+=5)
            {
                if (arrResult[i] is EquipmentZone && 
                    arrResult[i + 1] is SensorReactionHistory && 
                    arrResult[i + 2] is SensorZone && 
                    arrResult[i + 3] is SensorZoneHistory &&
                    //arrResult[i + 4] is Building &&
                    arrResult[i + 4] is Zone)
                {
                    SensorDetectHistoryData data = new SensorDetectHistoryData();

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
                        SensorZoneKey key;
                        if (!endTypes2.TryGetValue(srh.SensorZoneHistoryID, out key))
                        {
                            key = new SensorZoneKey();
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
                    data.Type = Facility.GetNFacilityTypeString(szh.SensorType);
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
            foreach (SensorDetectHistoryData data in datas)
            {
                SensorZoneKey key;
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

            #region 대응SOP 유무
            //if (datas != null && datas.Count > 0)
            //{
            //    string historyIDs = string.Join(", ", datas.Select(p => p.SensorZoneHistoryID).ToList());
            //    strCondition = string.Format("SensorZoneHistoryID in ({0})", historyIDs);

            //    List<ActionStepHistory> asHistories = m_processManager.CommonDataManager.GetSelectManager().SelectActionStepHistories(null, strCondition, out strErrorMessage);
            //    if (asHistories == null)
            //        return res;

            //    foreach (ActionStepHistory history in asHistories)
            //    {
            //        for (int j = 0; j < datas.Count; j++)
            //        {
            //            if (history.SensorZoneHistoryID == datas[j].SensorZoneHistoryID)
            //            {
            //                datas[j].ActionStepHistoryID = history.ID;
            //                break;
            //            }
            //        }
            //    }
            //}
            #endregion

            #region 센서명 지정
            if (allSensorZoneIDs.Count > 0)
            {
                strCondition = "";//string.Format("ID in ({0})", string.Join(", ", allSensorZoneIDs.Distinct()));
                arrResult = m_processManager.SdmsDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
                if (arrResult == null)
                    return null;

                int resultCount = arrResult.Count;
                if (resultCount > 0)
                {
                    for (int j = 0; j < datas.Count; j++)
                    {
                        for (int i = 0; i < resultCount; i += 3)
                        {
                            if (arrResult[i] is int && arrResult[i + 1] is int && arrResult[i + 2] is string)
                            {
                                int nSensorZoneID = (int)arrResult[i];
                                int nSensorType = (int)arrResult[i + 1];
                                string strSensorName = arrResult[i + 2].ToString();

                                if (datas[j].SensorZoneID == nSensorZoneID && datas[j].Type == Facility.GetNFacilityTypeString(nSensorType))
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

                if (justOneType)
                {
                    strConditionFacilityType = string.Format(" And {0}.{1} = {2}", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, facilityType);
                }
                else
                {
                    if (Facility.IsFireSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetFireTypeAllNumberToList()));
                    else if (Facility.IsPSMSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetPSMTypeAllNumberToList()));
                    else if (Facility.IsETCSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetETCTypeAllNumberToList()));
                    else if (Facility.IsSVMSSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetSVMSTypeAllNumberToList()));
                    else if (Facility.IsEarthquakeSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetEarthquakeTypeAllNumberToList()));
                    else if (Facility.IsStrongWindSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetStrongWindTypeAllNumberToList()));
                    else if (Facility.IsBlackOutSensorType(Facility.ToFacilityType(facilityType)))
                        strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetBlackOutTypeAllNumberToList()));
                }

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

            Dictionary<int, SensorDetectAnalysisData> dicDatas = new Dictionary<int, SensorDetectAnalysisData>();

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
                    SensorDetectAnalysisData data;
                    if (dicDatas.TryGetValue(sensorZoneID, out data))
                    {
                        data = dicDatas[sensorZoneID];
                    }
                    else
                    {
                        data = new SensorDetectAnalysisData();
                        data.SensorZoneHistoryID = szh.ID;
                        data.SensorZoneID = sensorZoneID;
                        data.ZoneID = szh.ZoneID;
                        data.Type = Facility.GetNFacilityTypeString(szh.SensorType);

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
            ArrayList sensorNameResult = m_processManager.SdmsDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
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

            List<SensorDetectAnalysisData> datas = new List<SensorDetectAnalysisData>();
            foreach (KeyValuePair<int, SensorDetectAnalysisData> item in dicDatas)
            {
                SensorDetectAnalysisData data = item.Value;
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
        /*
        public ResponseSensorDetectAnalysis DisplaySensorDetectAnalysis(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID)
        {
            string strErrorMessage = null;

            string strCondition = string.Format(" {0}.{1} >= '{2}' And {0}.{1} <= '{3}' And {0}.{4} < {5}"
                , SensorZoneHistory.TableName, SensorZoneHistory.Fields.Time
                , beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss")
                , SensorZoneHistory.Fields.SensorZoneID, dnsSopID.Header.ManualReportDefaultID);

            if (facilityType > -1)
            {
                string strConditionFacilityType = "";
                if (Facility.IsFireSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetFireTypeAllNumberToList()));
                else if (Facility.IsPSMSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetPSMTypeAllNumberToList()));
                else if (Facility.IsETCSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetETCTypeAllNumberToList()));
                else if (Facility.IsSVMSSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetSVMSTypeAllNumberToList()));

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

            //strCondition += " And ID = 221225";

            List<SensorZoneHistory> sensorZoneHistories = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorZoneHistories(null, strCondition, out strErrorMessage);
            if (sensorZoneHistories == null)
                return null;

            List<SensorZoneKey> allSensorZoneIDKeys = new List<SensorZoneKey>();            
            int nMinHistoryID = -1;
            int nMaxHistoryID = -1;

            foreach (SensorZoneHistory history in sensorZoneHistories)
            {
                foreach (int sensorZoneID in history.AllSensorZoneIDs)
                {
                    SensorZoneKey key = new SensorZoneKey();
                    key.SensorZoneHistoryID = history.ID;
                    key.SensorZoneID = sensorZoneID;
                    key.SensorType = history.SensorType;
                    key.ZoneID = history.ZoneID;
                    key.AllSensorZoneIDs = history.AllSensorZoneIDs;

                    if (nMinHistoryID == -1)
                        nMinHistoryID = history.ID;
                    else
                        nMinHistoryID = Math.Min(nMinHistoryID, history.ID);
                    nMaxHistoryID = Math.Max(nMaxHistoryID, history.ID);

                    allSensorZoneIDKeys.Add(key);
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

            //string strSensorZoneHistoryIDs = string.Join(", ", sensorZoneHistories.Select(p => p.ID));
            strCondition = string.Format("{0}.{1} >= '{2}' And {0}.{1} <= '{3}' And {4} in (0,21,50,62,64) And {0}.{5} >= {6} And {0}.{5} <= {7}"
                , SensorReactionHistory.TableName
                , SensorReactionHistory.Fields.Time, beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss")
                , SensorReactionHistory.Fields.ReactionType
                , SensorReactionHistory.Fields.SensorZoneHistoryID, nMinHistoryID, nMaxHistoryID);

            List<SensorReactionHistory> reactionHistories = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorReactionHistories(null, strCondition, out strErrorMessage);
            if (reactionHistories == null)
                return null;

            Dictionary<int, SensorDetectAnalysisData> dicDatas = new Dictionary<int, SensorDetectAnalysisData>();

            foreach (SensorReactionHistory reactionHistory in reactionHistories)
            {
                int sensorZoneID;
                if (!int.TryParse(reactionHistory.Param2, out sensorZoneID) && sensorZoneID <= 0)
                    continue;

                //SensorDetectAnalysisData data = null;
                //if (!dicDatas.TryGetValue(strKey, out data))
                //    continue;

                foreach (SensorZoneKey key in allSensorZoneIDKeys)
                {
                    if (key.SensorZoneHistoryID == reactionHistory.SensorZoneHistoryID && key.SensorZoneID == sensorZoneID)
                    {
                        SensorDetectAnalysisData data;
                        if (dicDatas.TryGetValue(sensorZoneID, out data))
                        {
                            data = dicDatas[key.SensorZoneID];
                        }
                        else
                        {
                            data = new SensorDetectAnalysisData();
                            data.SensorZoneHistoryID = key.SensorZoneHistoryID;
                            data.SensorZoneID = key.SensorZoneID;
                            data.ZoneID = key.ZoneID;
                            data.Type = Facility.GetNFacilityTypeString(key.SensorType);

                            dicDatas.Add(key.SensorZoneID, data);
                        }

                        if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.BEGIN_STATUS) // 상황 시작(알람 발생)
                        {
                            foreach (int item in key.AllSensorZoneIDs)
                            {
                                SensorDetectAnalysisData data2;
                                if (dicDatas.TryGetValue(item, out data2))
                                {
                                    data2 = dicDatas[key.SensorZoneID];
                                    data2.DetectCount++;
                                }
                            }
                            //data.DetectCount++;
                        }
                        else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.USER_RESET) // 사용자 복구
                        {
                            data.UserResetCount++;
                        }
                        else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.END_STATUS) // 현장 종료
                        {
                            foreach (int item in key.AllSensorZoneIDs)
                            {
                                SensorDetectAnalysisData data2;
                                if (dicDatas.TryGetValue(item, out data2))
                                {
                                    data2 = dicDatas[key.SensorZoneID];
                                    data2.EndCount++;
                                }
                            }

                            data.EndCount++;
                        }
                        else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.MALFUNCTION) // 오작동
                        {
                            data.MalfunctionCount++;
                        }
                        else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.USER_RESET) // 사용자 복구 (누출)
                        {
                            data.MalfunctionCount++;
                        }
                        //else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH)
                        //{
                        //    // 단계가 변했으므로 알람이 추가됐거나 해제됐다.
                        //    // Param2=SensorZoneID
                        //    // Param4= 0 또는 1 (0이면 알람해제, 1이면 알람발생)

                        //    int isAlarm;
                        //    if (int.TryParse(reactionHistory.Param4, out isAlarm))
                        //    {
                        //        if (isAlarm == 0)
                        //            data.EndCount++;
                        //        else if (isAlarm == 1)
                        //            data.DetectCount++;
                        //    }
                        //}
                        break;
                    } 
                }
            }

            strCondition = "";//string.Format("ID in ({0})", string.Join(", ", allSensorZoneIDKeys.Select(p => p.SensorZoneID)));
            ArrayList sensorNameResult = m_processManager.SdmsDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
            if (sensorNameResult == null)
                return null;

            strCondition = "";//string.Format("{0}.{1} in ({2})", Zone.TableName, Zone.Fields.ID, string.Join(", ", allSensorZoneIDKeys.Select(p => p.ZoneID)));
            ArrayList zoneResult = m_processManager.SdmsDataManager.GetSelectManager().JoinBuildingGroupBuildingZone(null, null, null, strCondition, out strErrorMessage);
            if (zoneResult == null)
                return null;

            int sensorNameResultCount = sensorNameResult.Count;
            int zoneResultCount = zoneResult.Count;

            int allDetectCount = 0;
            int allMalfunctionCount = 0;
            string maxCountSensorName = "";
            int maxMalfunctionCount = 0;

            List<SensorDetectAnalysisData> datas = new List<SensorDetectAnalysisData>();
            foreach (KeyValuePair<int, SensorDetectAnalysisData> item in dicDatas)
            {
                SensorDetectAnalysisData data = item.Value;
                //if (data.DetectCount == 0) data.DetectCount = 1; // 데이터 오류가 있음
                data.MalfunctionRate = Math.Round(((float)data.MalfunctionCount / (float)data.DetectCount) * 100, 2);
                if (double.IsNaN(data.MalfunctionRate))
                    data.MalfunctionRate = 0;
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

                allDetectCount += data.DetectCount;
                allMalfunctionCount += data.MalfunctionCount;
                if (maxMalfunctionCount < data.MalfunctionCount)
                {
                    maxCountSensorName = data.SensorName;
                    maxMalfunctionCount = data.MalfunctionCount;
                }

                datas.Add(data);
            }

            datas = datas.OrderByDescending(p => p.DetectCount).ToList();

            res.SensorDetectAnalysisDatas = datas;
            res.AllDetectCount = allDetectCount;
            res.AllMalfunctionRate = Math.Round(((float)allMalfunctionCount / (float)allDetectCount) * 100, 2);
            res.MaxCountSensorName = maxCountSensorName;

            return res;
        }
        */
        /*
        public ResponseSensorDetectAnalysis DisplaySensorDetectAnalysis(DateTime beginTime, DateTime endTime, int facilityType, int buildingGroupID, int buildingID, int zoneID)
        {
            string strErrorMessage = null;

            string strCondition = string.Format(" {0}.{1} >= '{2}' And {0}.{1} <= '{3}' And {0}.{4} < {5}"
                , SensorZoneHistory.TableName, SensorZoneHistory.Fields.Time
                , beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss")
                , SensorZoneHistory.Fields.SensorZoneID, dnsSopID.Header.ManualReportDefaultID);

            if (facilityType > -1)
            {
                string strConditionFacilityType = "";
                if (Facility.IsFireSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetFireTypeAllNumberToList()));
                else if (Facility.IsPSMSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetPSMTypeAllNumberToList()));
                else if (Facility.IsETCSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetETCTypeAllNumberToList()));
                else if (Facility.IsSVMSSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionFacilityType = string.Format(" And {0}.{1} in ({2})", SensorZoneHistory.TableName, SensorZoneHistory.Fields.SensorType, string.Join(",", Facility.GetSVMSTypeAllNumberToList()));

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

            //strCondition += " And ID = 221225";

            List<SensorZoneHistory> sensorZoneHistories = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorZoneHistories(null, strCondition, out strErrorMessage);
            if (sensorZoneHistories == null)
                return null;

            List<SensorZoneKey> allSensorZoneIDKeys = new List<SensorZoneKey>();
            foreach (SensorZoneHistory history in sensorZoneHistories)
            {
                SensorZoneKey key = new SensorZoneKey();
                key.SensorZoneHistoryID = history.ID;
                key.SensorZoneID = history.SensorZoneID;
                key.SensorType = history.SensorType;
                key.ZoneID = history.ZoneID;

                allSensorZoneIDKeys.Add(key);

                if (history.AllSensorZoneIDs.Count > 1)
                {
                    foreach (int sensorZoneID in history.AllSensorZoneIDs)
                    {
                        key = new SensorZoneKey();
                        key.SensorZoneHistoryID = history.ID;
                        key.SensorZoneID = sensorZoneID;
                        key.SensorType = history.SensorType;
                        key.ZoneID = history.ZoneID;

                        allSensorZoneIDKeys.Add(key);
                    } 
                }
            }
            allSensorZoneIDKeys.Distinct(); // 중복 제거

            ResponseSensorDetectAnalysis res = new ResponseSensorDetectAnalysis();

            if (allSensorZoneIDKeys.Count > 0)
            {
                string strSensorZoneHistoryIDs = string.Join(", ", sensorZoneHistories.Select(p => p.ID));
                strCondition = string.Format("{0} in ({1}) And {2} in (0,21,50,62,64)"
                    , SensorReactionHistory.Fields.SensorZoneHistoryID, strSensorZoneHistoryIDs
                    , SensorReactionHistory.Fields.ReactionType);
                List<SensorReactionHistory> reactionHistories = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorReactionHistories(null, strCondition, out strErrorMessage);
                if (reactionHistories == null)
                    return null;

                Dictionary<int, SensorDetectAnalysisData> dicDatas = new Dictionary<int, SensorDetectAnalysisData>();
                foreach (SensorReactionHistory reactionHistory in reactionHistories)
                {
                    int sensorZoneID;
                    if (!int.TryParse(reactionHistory.Param2, out sensorZoneID) && sensorZoneID <= 0)
                        continue;

                    foreach (SensorZoneKey key in allSensorZoneIDKeys)
                    {
                        if (key.SensorZoneHistoryID == -1 || key.SensorZoneID == -1)
                            continue;

                        if (reactionHistory.SensorZoneHistoryID == key.SensorZoneHistoryID && sensorZoneID == key.SensorZoneID)
                        {
                            SensorDetectAnalysisData data = null;

                            if (dicDatas.ContainsKey(sensorZoneID))
                            {
                                data = dicDatas[key.SensorZoneID];
                            }
                            else
                            {
                                data = new SensorDetectAnalysisData();
                                data.SensorZoneHistoryID = key.SensorZoneHistoryID;
                                data.SensorZoneID = key.SensorZoneID;
                                data.ZoneID = key.ZoneID;
                                data.Type = Facility.GetNFacilityTypeString(key.SensorType);

                                dicDatas.Add(key.SensorZoneID, data);
                            }

                            if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.BEGIN_STATUS) // 상황 시작(알람 발생)
                            {
                                data.DetectCount++;
                            }
                            else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.END_STATUS) // 현장 종료
                            {
                                data.EndCount++;
                            }
                            else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.MALFUNCTION) // 오작동
                            {
                                data.MalfunctionCount++;
                            }
                            else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.USER_RESET) // 사용자 복구 (누출)
                            {
                                data.MalfunctionCount++;
                            }
                            else if (reactionHistory.ReactionType == SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH)
                            {
                                // 단계가 변했으므로 알람이 추가됐거나 해제됐다.
                                // Param2=SensorZoneID
                                // Param4= 0 또는 1 (0이면 알람해제, 1이면 알람발생)

                                int isAlarm;
                                if (int.TryParse(reactionHistory.Param4, out isAlarm))
                                {
                                    if (isAlarm == 0)
                                        data.EndCount++;
                                    else if (isAlarm == 1)
                                        data.DetectCount++;
                                }
                            }

                            break;
                        }
                    }
                }

                strCondition = string.Format("ID in ({0})", string.Join(", ", allSensorZoneIDKeys.Select(p => p.SensorZoneID)));
                ArrayList sensorNameResult = m_processManager.SdmsDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
                if (sensorNameResult == null)
                    return null;

                strCondition = string.Format("{0}.{1} in ({2})", Zone.TableName, Zone.Fields.ID, string.Join(", ", allSensorZoneIDKeys.Select(p => p.ZoneID)));
                ArrayList zoneResult = m_processManager.SdmsDataManager.GetSelectManager().JoinBuildingGroupBuildingZone(null, null, null, strCondition, out strErrorMessage);
                if (zoneResult == null)
                    return null;

                int sensorNameResultCount = sensorNameResult.Count;
                int zoneResultCount = zoneResult.Count;

                int allDetectCount = 0;
                int allMalfunctionCount = 0;
                string maxCountSensorName = "";
                int maxMalfunctionCount = 0;

                List<SensorDetectAnalysisData> datas = new List<SensorDetectAnalysisData>();
                foreach (KeyValuePair<int, SensorDetectAnalysisData> item in dicDatas)
                {
                    SensorDetectAnalysisData data = item.Value;
                    data.MalfunctionRate = Math.Round(((float)data.MalfunctionCount / (float)data.DetectCount) * 100, 2);
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

                    allDetectCount += data.DetectCount;
                    allMalfunctionCount += data.MalfunctionCount;
                    if (maxMalfunctionCount < data.MalfunctionCount)
                    {
                        maxCountSensorName = data.SensorName;
                        maxMalfunctionCount = data.MalfunctionCount;
                    }

                    datas.Add(data);
                }

                datas = datas.OrderByDescending(p => p.DetectCount).ToList();

                res.SensorDetectAnalysisDatas = datas;
                res.AllDetectCount = allDetectCount;
                res.AllMalfunctionRate = Math.Round(((float)allMalfunctionCount / (float)allDetectCount) * 100,2);
                res.MaxCountSensorName = maxCountSensorName;
            }

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

            return res;
        }
        */
        public ResponseDisasterCategories LoadDisasterCategories(int nSiteID)
        {
            ResponseDisasterCategories res = new ResponseDisasterCategories();

            string strErrorMessage = null;

            Dictionary<DisasterCategory.Fields, object> dicConditions = new Dictionary<DisasterCategory.Fields, object>();
            dicConditions[DisasterCategory.Fields.SiteID] = nSiteID;

            List<DisasterCategory> dc = m_processManager.SopDataManager.GetSelectManager().SelectDisasterCategories(dicConditions, out strErrorMessage);
            if (dc == null)
                return res;

            res.DisasterCategories = dc;
            return res;
        }
        public ResponseSOPHistories DisplaySOPHistories(DateTime beginTime, DateTime endTime, int nSiteID)
        {
            string strErrorMessage = null;

            string strCondition = string.Format(" And {0}.{1} >= '{2}' And {0}.{1} <= '{3}'"
                , ActionStepHistory.TableName, ActionStepHistory.Fields.BeginTime
                , beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));

            strCondition += string.Format(" And {0}.{1} = {2}", DisasterCategory.TableName, DisasterCategory.Fields.SiteID, nSiteID);

            ArrayList arrResult = m_processManager.SopDataManager.GetSelectManager().SelectSOPHistory(null, null, null, null, null, strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            ResponseSOPHistories res = new ResponseSOPHistories();
            List<SOPHistoryData> datas = new List<SOPHistoryData>();

            List<int> userIDs = new List<int>();
            List<int> sensorZoneHistoryIDs = new List<int>();
                        
            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount; i += 5)
            {
                if (arrResult[i] is DisasterCategory &&
                    arrResult[i + 1] is SubDisasterCategory &&
                    arrResult[i + 2] is Disaster &&
                    arrResult[i + 3] is ActionStep &&
                    arrResult[i + 4] is ActionStepHistory)
                {
                    SOPHistoryData data = new SOPHistoryData();

                    DisasterCategory dc = arrResult[i] as DisasterCategory;
                    SubDisasterCategory sdc = arrResult[i + 1] as SubDisasterCategory;
                    Disaster d = arrResult[i + 2] as Disaster;
                    ActionStep step = arrResult[i + 3] as ActionStep;
                    ActionStepHistory ash = arrResult[i + 4] as ActionStepHistory;

                    data.ActionStepHistoryID = ash.ID;
                    data.DisasterName = dc.CategoryName;
                    data.SopName = d.DisasterName;
                    data.ActionStepName = step.StepName;
                    data.RealMode = (ash.RealMode != null && (bool)ash.RealMode) ? "실제" : "훈련";
                    data.Position = ash.Position;
                    data.BeginTime = ash.BeginTime.ToString("yyyy-MM-dd HH:mm:ss");
                    data.EndTime = (ash.EndTime == null) ? "-" : ((DateTime)ash.EndTime).ToString("yyyy-MM-dd HH:mm:ss");

                    if (ash.LastAccessedUserID != null)
                    {
                        userIDs.Add((int)ash.LastAccessedUserID); // 사용자가 삭제됐을수도 있으니 같이 쿼리하지 않고 따로 조회한다
                        data.LastAccessedUserID = (int)ash.LastAccessedUserID;
                    }

                    if (ash.SensorZoneHistoryID != null)
                    {
                        sensorZoneHistoryIDs.Add((int)ash.SensorZoneHistoryID);
                        data.SensorZoneHistoryID = (int)ash.SensorZoneHistoryID;
                    }

                    datas.Add(data);
                }
            }

            #region 사용자 지정
            if (userIDs.Count > 0)
            {
                strCondition = string.Format("ID in ({0})", string.Join(",", userIDs));
                List<User> users = m_processManager.SopDataManager.GetSelectManager().SelectUsers(strCondition, out strErrorMessage);
                if (users == null)
                    return null;

                foreach (User user in users)
                {
                    for (int j = 0; j < datas.Count; j++)
                    {
                        if (user.ID == datas[j].LastAccessedUserID)
                        {
                            datas[j].UserName = user.NickName;
                        }
                    }
                }
            } 
            #endregion

            #region 센서명 지정
            if (sensorZoneHistoryIDs.Count > 0)
            {
                strCondition = string.Format("ID in ({0})", string.Join(", ", sensorZoneHistoryIDs));
                List<SensorZoneHistory> histories = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorZoneHistories(null, strCondition, out strErrorMessage);
                if (histories == null)
                    return null;

                List<int> sensorZoneIDs = new List<int>();
                foreach (SensorZoneHistory history in histories)
                {
                    for (int i = 0; i < datas.Count; i++)
                    {
                        if (datas[i].SensorZoneHistoryID == history.ID)
                        {
                            datas[i].AllSensorZoneIDs = history.AllSensorZoneIDs;
                        }
                    }
                    sensorZoneIDs.AddRange(history.AllSensorZoneIDs);
                }

                if (sensorZoneIDs.Count > 0)
                {
                    strCondition = string.Format("ID in ({0})", string.Join(", ", sensorZoneIDs));
                    arrResult = m_processManager.SdmsDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
                    if (arrResult == null)
                        return null;

                    int resultCount = arrResult.Count;
                    for (int i = 0; i < resultCount; i += 3)
                    {
                        if (arrResult[i] is int && arrResult[i + 1] is int && arrResult[i + 2] is string)
                        {
                            int nSensorZoneID = (int)arrResult[i];
                            int nSensorType = (int)arrResult[i + 1];
                            string strSensorName = arrResult[i + 2].ToString();

                            for (int j = 0; j < datas.Count; j++)
                            {
                                if (datas[j].AllSensorZoneIDs != null)
                                {
                                    if (datas[j].AllSensorZoneIDs.Contains(nSensorZoneID))
                                    {
                                        if (datas[j].SensorName.Length > 0)
                                            datas[j].SensorName += ", " + strSensorName;
                                        else
                                            datas[j].SensorName = strSensorName;
                                    } 
                                }
                            } 
                            
                        }
                    }
                }
            } 
            #endregion

            res.SOPHistoryDatas = datas;
            return res;
        }

        public ResponseSOPHistories DisplaySOPHistories2(int sensorZoneHistoryID)
        {
            string strErrorMessage = null;

            //string strCondition = string.Format(" And {0}.{1} >= '{2}' And {0}.{1} <= '{3}'"
            //    , ActionStepHistory.TableName, ActionStepHistory.Fields.BeginTime
            //    , beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));

            string strCondition = string.Format(" And {0}.{1} = {2}" , ActionStepHistory.TableName, ActionStepHistory.Fields.SensorZoneHistoryID, sensorZoneHistoryID);

            ArrayList arrResult = m_processManager.SopDataManager.GetSelectManager().SelectSOPHistory(null, null, null, null, null, strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            ResponseSOPHistories res = new ResponseSOPHistories();
            List<SOPHistoryData> datas = new List<SOPHistoryData>();

            List<int> userIDs = new List<int>();
            List<int> sensorZoneHistoryIDs = new List<int>();

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount; i += 5)
            {
                if (arrResult[i] is DisasterCategory &&
                    arrResult[i + 1] is SubDisasterCategory &&
                    arrResult[i + 2] is Disaster &&
                    arrResult[i + 3] is ActionStep &&
                    arrResult[i + 4] is ActionStepHistory)
                {
                    SOPHistoryData data = new SOPHistoryData();

                    DisasterCategory dc = arrResult[i] as DisasterCategory;
                    SubDisasterCategory sdc = arrResult[i + 1] as SubDisasterCategory;
                    Disaster d = arrResult[i + 2] as Disaster;
                    ActionStep step = arrResult[i + 3] as ActionStep;
                    ActionStepHistory ash = arrResult[i + 4] as ActionStepHistory;

                    data.ActionStepHistoryID = ash.ID;
                    data.DisasterName = dc.CategoryName;
                    data.SopName = d.DisasterName;
                    data.ActionStepName = step.StepName;
                    data.RealMode = (ash.RealMode != null && (bool)ash.RealMode) ? "실제" : "훈련";
                    data.Position = ash.Position;
                    data.BeginTime = ash.BeginTime.ToString("yyyy-MM-dd HH:mm:ss");
                    data.EndTime = (ash.EndTime == null) ? "-" : ((DateTime)ash.EndTime).ToString("yyyy-MM-dd HH:mm:ss");

                    if (ash.LastAccessedUserID != null)
                    {
                        userIDs.Add((int)ash.LastAccessedUserID); // 사용자가 삭제됐을수도 있으니 같이 쿼리하지 않고 따로 조회한다
                        data.LastAccessedUserID = (int)ash.LastAccessedUserID;
                    }

                    if (ash.SensorZoneHistoryID != null)
                    {
                        sensorZoneHistoryIDs.Add((int)ash.SensorZoneHistoryID);
                    }
                    data.SensorZoneHistoryID = (int)ash.SensorZoneHistoryID;

                    datas.Add(data);
                }
            }

            #region 사용자 지정
            if (userIDs.Count > 0)
            {
                strCondition = string.Format("ID in ({0})", string.Join(",", userIDs));
                List<User> users = m_processManager.SopDataManager.GetSelectManager().SelectUsers(strCondition, out strErrorMessage);
                if (users == null)
                    return null;

                foreach (User user in users)
                {
                    for (int j = 0; j < datas.Count; j++)
                    {
                        if (user.ID == datas[j].LastAccessedUserID)
                        {
                            datas[j].UserName = user.NickName;
                        }
                    }
                }
            }
            #endregion

            #region 센서명 지정
            SensorZoneHistory szh = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorZoneHistory(sensorZoneHistoryID, out strErrorMessage);

            if (szh == null)
                return null;

            Dictionary<SensorReactionHistory.Fields, object> dicConditions = new Dictionary<SensorReactionHistory.Fields, object>();
            dicConditions.Add(SensorReactionHistory.Fields.SensorZoneHistoryID, sensorZoneHistoryID);

            List<SensorReactionHistory> sensorReactionHistories = m_processManager.SdmsDataManager.GetSelectManager().SelectSensorReactionHistories(dicConditions, null, out strErrorMessage);

            if (sensorReactionHistories == null)
                return null;

            StringBuilder sb = new StringBuilder();

            foreach (SensorReactionHistory history in sensorReactionHistories)
            {
                if (int.TryParse(history.Param5, out int isAlarmed))
                {
                    if (isAlarmed == 0 || // 여수 프로젝트는 2단계 알람을 받지 않는다.
                        isAlarmed == 1 ||
                        isAlarmed == 2)
                    {
                        continue;
                    }
                }
                if (int.TryParse(history.Param2, out int sensorID))
                {
                    ETC etc = m_processManager.SdmsDataManager.GetSelectManager().SelectETCSensor(sensorID, out strErrorMessage);

                    int? materialType = etc.MaterialType;
                    if (materialType == null)
                        continue;

                    Dictionary<Material.Fields, object> dicConditions2 = new Dictionary<Material.Fields, object>();
                    dicConditions2.Add(Material.Fields.ID, materialType);

                    List<Material> materials = m_processManager.SdmsDataManager.GetSelectManager().SelectMaterials(dicConditions2, null, out strErrorMessage);

                    if (materials != null)
                    {
                        foreach (Material material in materials) // 단일 개체지만 SensorETC 테이블의 MaterialType이 Null허용이라 dicCondition 사용
                        {
                            string str = material.MaterialName;
                            if (str != null)
                                if (sb.Length > 0)
                                {
                                    sb.Append("," + str);
                                }
                                else
                                {
                                    sb.Append(str);
                                }
                        }
                    }

                }
            }
            #endregion

            res.SOPHistoryDatas = datas;
            return res;
        }

        public ResponseSOPComponentHistories DisplaySOPComponentHistories(int nActionStepHistoryID)
        {
            string strErrorMessage = null;

            ActionStepHistory actionStepHistory = m_processManager.CommonDataManager.GetSelectManager().SelectActionStepHistory(nActionStepHistoryID, out strErrorMessage);
            if (actionStepHistory == null)
                return null;

            string strCondition = string.Format("{0} = {1}", ComponentHistory.Fields.ActionStepHistoryID, nActionStepHistoryID);
            List<ComponentHistory> histories = m_processManager.CommonDataManager.GetSelectManager().SelectComponentHistories(strCondition, out strErrorMessage);
            if (histories == null)
                return null;

            string strHistoryIDs = string.Join(", ", histories.Select(p => p.ID));
            strCondition = string.Format("{0} IN ({1})", ComponentHistoryDetail.Fields.ComponentHistoryID, strHistoryIDs);
            List<ComponentHistoryDetail> details = m_processManager.CommonDataManager.GetSelectManager().SelectComponentHistoryDetails(strCondition, out strErrorMessage);
            if (details == null)
                return null;
                        
            Dictionary<string, SopHistoryComponentData> dicDatas = new Dictionary<string, SopHistoryComponentData>();

            SOPManager.BLL.ProcessManager processMgr =
                new SOPManager.BLL.ProcessManager(m_processManager.CommonDataManager, m_processManager.SopDataManager, m_processManager.TeamDataManager, m_processManager.SdmsDataManager);
            SOPManager.BLL.LoadManager sopLoadManager = processMgr.GetLoadManager();

            foreach (ComponentHistory history in histories)
            {
                string strKey = history.ComponentType + "_" + history.ComponentID;
                SopHistoryComponentData data = null;
                if (dicDatas.ContainsKey(strKey))
                    data = dicDatas[strKey];
                else
                {
                    data = new SopHistoryComponentData();
                    data.ActionStepHistoryID = history.ActionStepHistoryID;
                    data.ComponentHistoryID = history.ID;
                    data.ComponentID = history.ComponentID;
                    data.ComponentType = history.ComponentType;

                    if (data.ComponentType == 0)
                    {
                        Process process = m_processManager.SopDataManager.GetSelectManager().SelectProcess(data.ComponentID, out strErrorMessage);
                        if (process == null)
                            return null;

                        data.SectionName = process.Text;
                        data.TeamList = GetReciver(process.TeamList);

                        strCondition = string.Format("{0} = {1}", ProcessMission.Fields.ProcessID, data.ComponentID);
                        List<ProcessMission> missions = m_processManager.SopDataManager.GetSelectManager().SelectProcessMissions(strCondition, out strErrorMessage);
                        if (missions == null)
                            return null;

                        int missionCount = missions.Count;
                        for (int i = 0; i < missionCount; i++)
                        {                            
                            ComponentHistoryDetailData detailData = new ComponentHistoryDetailData();
                            detailData.SectionName = data.SectionName;
                            detailData.MissionText = ReplaceMessage(missions[i].MissionText, actionStepHistory.Position, actionStepHistory.BeginTime.ToString(), sopLoadManager);
                            detailData.DataIndex = i;

                            data.MissionDatas.Add(detailData);
                        }
                    }
                    else if (data.ComponentType == 1)
                    {
                        Decision decision = m_processManager.SopDataManager.GetSelectManager().SelectDecision(data.ComponentID, out strErrorMessage);
                        if (decision == null)
                            return null;

                        data.SectionName = decision.Text;
                    }
                    else if (data.ComponentType == 3)
                    {
                        EndPoint endPoint = m_processManager.SopDataManager.GetSelectManager().SelectEndPoint(data.ComponentID, out strErrorMessage);
                        if (endPoint == null)
                            return null;

                        data.SectionName = endPoint.Text;
                    }
                    else if (data.ComponentType == 6)
                    {
                        InternalTransmission @internal = m_processManager.SopDataManager.GetSelectManager().SelectInternalTransmission(data.ComponentID, out strErrorMessage);
                        if (@internal == null)
                            return null;

                        data.SectionName = @internal.Text;
                        data.TeamList = GetReciver(@internal.TeamList);

                        ComponentHistoryDetailData detailData = new ComponentHistoryDetailData();
                        detailData.SectionName = data.SectionName;
                        detailData.MissionText = ReplaceMessage(@internal.Message, actionStepHistory.Position, actionStepHistory.BeginTime.ToString(), sopLoadManager); 
                        detailData.DataIndex = 0;
                        detailData.Time = history.Time.ToString("yyyy-MM-dd HH:mm");

                        data.MissionDatas.Add(detailData);
                    }

                    dicDatas.Add(strKey, data);
                }

                data.Time = history.Time.ToString("yyyy-MM-dd HH:mm");
                data.Status = history.Status;
                data.strStatus = (history.Status == 3) ? "확인" : "실행중";
                data.UserID = (history.AccessedUserID != null) ? (int)history.AccessedUserID : -1;
                //data.UserName 
                //data.Completion

                foreach (ComponentHistoryDetail detail in details)
                {
                    if (history.ID == detail.ComponentHistoryID && detail.DataIndex >= 0)
                    {
                        ComponentHistoryDetailData detailData = data.MissionDatas[detail.DataIndex];
                        if (detail.Datai == 0 || detail.Datai == 1) // checked/unchecked
                        {
                            detailData.Completion = (detail.Datai == 0) ? "미완료" : "완료";
                        }
                        detailData.Time = (detail.Time == null) ? "-" : ((DateTime)detail.Time).ToString("yyyy-MM-dd HH:mm");                        
                    }
                }
            }

            List<SopHistoryComponentData> datas = new List<SopHistoryComponentData>();
            foreach (KeyValuePair<string, SopHistoryComponentData> item in dicDatas)
            {
                SopHistoryComponentData data = item.Value;

                int completeCount = 0;
                foreach (ComponentHistoryDetailData missionData in data.MissionDatas)
                {
                    if (missionData.Completion == "완료")
                        completeCount++;
                }

                if (completeCount == data.MissionDatas.Count) // 완료된 개수와  mission개수가 같은가?
                {
                    if (data.MissionDatas.Count == 0)
                        data.Completion = "확인";
                    else 
                        data.Completion = "완료";

                }
                else if (completeCount > 0 && completeCount < data.MissionDatas.Count) // 완료된 개수가 mission개수보다 작은가?
                    data.Completion = "부분완료";
                else if (completeCount == 0)
                    data.Completion = "미완료";

                datas.Add(data);
            }

            ResponseSOPComponentHistories res = new ResponseSOPComponentHistories();
            res.SOPComponentHistoryDatas = datas;

            return res;
        }

        private List<string> GetReciver(List<Receiver> receivers)
        {
            List<string> names = new List<string>();

            if (receivers == null)
                return names;

            foreach (Receiver receiver in receivers)
            {
                if (receiver.TeamType == 2)
                {
                    string strErrorMessage = null;
                    Dictionary<Regular.Fields, object> dicCondition = new Dictionary<Regular.Fields, object>();
                    dicCondition.Add(Regular.Fields.ID, receiver.TeamID);
                    List<Regular> regulars = m_processManager.TeamDataManager.GetSelectManager().SelectRegulars(dicCondition, out strErrorMessage);
                    if (regulars != null)
                    {
                        foreach (Regular regular in regulars)
                        {
                            names.Add(regular.TeamName);
                        }
                    }
                }

            }

            return names;
        }

        private string ReplaceMessage(string message, string position, string time, SOPManager.BLL.LoadManager loadManager)
        {
            string retrunMessage = message;
            // 특수 문자가 있니 ?
            if (message.Contains("{") && message.Contains("}"))
            {
                SOPManager.BLL.Models.Request.RequestParseSpecialMessage req = new SOPManager.BLL.Models.Request.RequestParseSpecialMessage();
                req.Message = message;
                req.Location = position;
                req.Time = time;

                SOPManager.BLL.Models.Response.ResponseParseSpecialMessage res = loadManager.ParseSpecialMessage(req);
                retrunMessage = res.ParseMessage;
            }

            return retrunMessage;
        }

        public class SensorZoneKey
        {
            private int m_nSensorZoneHistoryID = -1;
            private int m_nSensorZoneID = -1;
            private int m_nSensorType = -1;
            private int m_nZoneID = -1;            
            private SensorReactionHistory.ReactionTypes m_reactionType = SensorReactionHistory.ReactionTypes.NONE;
            private List<int> m_allSensorZoneIDs = new List<int>();
            private string m_strEndTime = "";

            public int SensorZoneHistoryID
            {
                get { return m_nSensorZoneHistoryID; }
                set { m_nSensorZoneHistoryID = value; }
            }

            public int SensorZoneID
            {
                get { return m_nSensorZoneID; }
                set { m_nSensorZoneID = value; }
            }

            public int SensorType
            {
                get { return m_nSensorType; }
                set { m_nSensorType = value; }
            }

            public int ZoneID
            {
                get { return m_nZoneID; }
                set { m_nZoneID = value; }
            }

            public SensorReactionHistory.ReactionTypes ReactionType
            {
                get { return m_reactionType; }
                set { m_reactionType = value; }
            }

            public List<int> AllSensorZoneIDs
            {
                get { return m_allSensorZoneIDs; }
                set { m_allSensorZoneIDs = value; }
            }

            public string EndTime
            {
                get { return m_strEndTime; }
                set { m_strEndTime = value; }
            }
        }

        #region 안전구역평가
        public ResponseAssessmentHistories DisplayAssessmentHistories(DateTime beginTime, DateTime endTime, int buildingGroupID, int buildingID, int zoneID, int score, string evaluator, int nSiteID, int? nEquipZone = null)
        {
            string strErrorMessage = null;

            // 등급 불러오기(사이트별 관리)
            Dictionary<string, AssessmentClassData> dicAssessmentClass = new Dictionary<string, AssessmentClassData>();

            // 마지막 등급
            //string strFailClassName = "-";

            string strPropertyName = "AssessmentClass";
            List<Common.Model.Option.Options> sdmsOptions = m_processManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID, out strErrorMessage);
            if (sdmsOptions?.Count > 0)
            {
                Common.Model.Option.Options option = sdmsOptions[0];
                string strValue = option.PropertyValue;
                if (strValue != null)
                {
                    string[] splits = strValue.Split(',');

                    for (int i = 0; i < splits?.Length; i++)
                    {
                        string split = splits[i];
                        string[] splits2 = split.Split(':');

                        if (splits2?.Length == 2)
                        {
                            string strClassName = splits2[0];
                            string strScores = splits2[1];

                            string[] splits3 = strScores.Split('~');
                            if (splits3?.Length == 2)
                            {
                                string strStartScore = splits3[0];
                                string strEndScore = splits3[1];

                                int nStartScore = 0;
                                int nEndScore = 0;

                                if (int.TryParse(strStartScore, out nStartScore) && int.TryParse(strEndScore, out nEndScore))
                                {
                                    AssessmentClassData classData = new AssessmentClassData(strClassName, nStartScore, nEndScore);
                                    dicAssessmentClass[classData.ClassName] = classData;
                                    //strFailClassName = classData.ClassName;
                                }
                            }
                        }
                    }
                }             
            }

            if (dicAssessmentClass.Count == 0)
            {
                AssessmentClassData classData = new AssessmentClassData("A", 80, 100);
                dicAssessmentClass[classData.ClassName] = classData;

                classData = new AssessmentClassData("B", 60, 80);
                dicAssessmentClass[classData.ClassName] = classData;

                classData = new AssessmentClassData("C", 40, 60);
                dicAssessmentClass[classData.ClassName] = classData;

                classData = new AssessmentClassData("D", 20, 40);
                dicAssessmentClass[classData.ClassName] = classData;

                classData = new AssessmentClassData("E", 0, 20);
                dicAssessmentClass[classData.ClassName] = classData;

                //strFailClassName = classData.ClassName;
            }

            beginTime = new DateTime(beginTime.Year, beginTime.Month, beginTime.Day, 0, 0, 0);
            endTime = new DateTime(endTime.Year, endTime.Month, endTime.Day, 23, 59, 59);

            string strEvaluatorConditions = "";
            if (evaluator?.Length > 0)
            {
                // 평가자 필터
                strEvaluatorConditions = $@" and AssessmentID in (
                                                select AssessmentID
		                                          from SdmsAssessmentAMember mTemp
		                                         inner join SopTeamRegularMember rmTemp on mTemp.MemberID=rmTemp.ID
		                                         where rmTemp.MemberName like '%{evaluator}%') ";

            }

            //, case when a.Score=5 then 'A' when a.Score=4 then 'B' when a.Score=3 then 'C' when a.Score=2 then 'D' when a.Score=1 then 'E' else '-' end Score
            string strSQL = $@"
                select a.ID assessmentID, isnull(Title, '-') Title, ez.Position, ez.ZoneName, SendDate, ResultDate, a.UpdateDate, a.IsPass 
                     , case when MemberCnt = 1 then MemberName when MemberCnt > 1  then MemberName + ' 외 ' + convert(nvarchar, (MemberCnt - 1)) + '명' else '-' end Evaluator
                     , case when a.Score >= 0 then a.Score else -1 end Score
                     , a.Type
                  from SdmsAssessment a
                 inner join (select AssessmentID, MemberCnt, rm.ID MemberID, rm.MemberName
			                  from (select AssessmentID, count(*) MemberCnt, max(memberID) maxMemberID 
                                      from SdmsAssessmentAMember 
                                     where (1=1) {strEvaluatorConditions}
                                     group by AssessmentID) m                                
			                 inner join SopTeamRegularMember rm on m.maxMemberID=rm.ID) m on a.ID=m.AssessmentID

                 inner join (select ez.ID, 
			    	                Concat(isnull(bg.DisplayText + ' > ', ''),
			    		                   isnull(b.DisplayText + ' > ', ''),
			    		                   isnull(z.DisplayText, '')) position, isnull(ez.DisplayText, ez.ZoneName) zoneName

                              from SdmsSpatialEquipmentZone ez
                             inner join SdmsSpatialZone z on z.ID=ez.LinkedZoneIDList {(zoneID > 0 ? "and z.ID=" + zoneID : "")} {(nEquipZone > 0 ? " and ez.ID=" + nEquipZone : "")}
                             left outer join SdmsSpatialBuilding b on z.BuildingID = b.ID {(buildingID > 0 ? "and b.ID=" + buildingID : "")}
                             left outer join SdmsSpatialBuildingGroup bg on b.BuildingGroupID = bg.ID {(buildingGroupID > 0 ? "and bg.ID=" + buildingGroupID : "")}
                             where ez.SiteID={nSiteID}

                            ) ez on a.EquipmentZoneID=ez.ID
                 where (1=1) And SendDate >= '{beginTime.ToString("yyyy-MM-dd HH:mm:ss")}' And SendDate <= '{endTime.ToString("yyyy-MM-dd HH:mm:ss")}'
                   {(score > 0 ? "and score=" + score : "")}";

            ArrayList arrResult = m_processManager.SdmsDataManager.GetSelectManager().GetResultData(strSQL, out strErrorMessage);
            if (arrResult == null)
                return null;

            ResponseAssessmentHistories res = new ResponseAssessmentHistories();
            List<AssessmentHistoryData> datas = new List<AssessmentHistoryData>();

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount-10; i += 11)
            {
                VariousData<int> nAssessmentID = WebDBManager.GetIntField(arrResult[i].ToString());
                string strTitle = WebDBManager.GetStringField(arrResult[i + 1]);
                string strPosition = WebDBManager.GetStringField(arrResult[i + 2]);
                string strZoneName = WebDBManager.GetStringField(arrResult[i + 3]);
                VariousData<DateTime> dtSendDate = WebDBManager.GetDateTimeField(arrResult[i + 4].ToString());
                VariousData<DateTime> dtResultDate = WebDBManager.GetDateTimeField(arrResult[i + 5].ToString());
                VariousData<DateTime> dtUpdateDate = WebDBManager.GetDateTimeField(arrResult[i + 6].ToString());

                VariousData<int> IsPass = WebDBManager.GetIntField(arrResult[i + 7].ToString());

                string strEvaluator = WebDBManager.GetStringField(arrResult[i + 8]);
                //string strScore = WebDBManager.GetStringField(arrResult[i + 9]);
                VariousData<float> Score = WebDBManager.GetFloatField(arrResult[i + 9].ToString());
                VariousData<int> Type = WebDBManager.GetIntField(arrResult[i + 10].ToString());

                if (nAssessmentID == null || dtSendDate == null || Score == null || Type == null)
                    continue;

                float fScore = Score.Data * 25;
                string strScore = "-";

                foreach (KeyValuePair<string, AssessmentClassData> pair in dicAssessmentClass)
                {
                    string strClassName = pair.Key;
                    AssessmentClassData classData = pair.Value;

                    if (classData.StartScore <= fScore && classData.EndScore >= fScore)
                    {
                        strScore = strClassName;
                        break;
                    }
                }

                //if (IsPass?.Data == 0)
                //    strScore = strFailClassName;
                    
                AssessmentHistoryData data = new AssessmentHistoryData();
                data.AssessmentID = nAssessmentID.Data;
                data.Title = strTitle;
                data.Position = strPosition;
                data.ZoneName = strZoneName;
                data.SendDate = dtSendDate.Data.ToString("yyyy-MM-dd");
                if (dtResultDate != null)
                    data.ResultDate = dtResultDate.Data.ToString("yyyy-MM-dd");
                else
                    data.ResultDate = "-";
                if (dtUpdateDate != null)
                    data.UpdateDate = dtUpdateDate.Data.ToString("yyyy-MM-dd");
                else
                    data.UpdateDate = "-";
                data.Evaluator = strEvaluator;
                data.Score = strScore;
                data.Type = Type.Data;
                datas.Add(data);
            }

            res.AssessmentHistories = datas;
            return res;
        }

        public ResponseAssessmentDetails DisplayAssessmentDetails(int assessmentID, int? nSiteID)
        {
            string strErrorMessage;
            ResponseAssessmentDetails res = new ResponseAssessmentDetails();
            try
            {
                if (nSiteID == null)
                    nSiteID = m_processManager.SdmsDataManager.SiteID;

                // 등급 불러오기(사이트별 관리)
                Dictionary<string, AssessmentClassData> dicAssessmentClass = new Dictionary<string, AssessmentClassData>();

                // 마지막 등급
                string strFailClassName = "-";

                string strPropertyName = "AssessmentClass";
                List<Common.Model.Option.Options> sdmsOptions = m_processManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID.Value, out strErrorMessage);
                if (sdmsOptions?.Count > 0)
                {
                    Common.Model.Option.Options option = sdmsOptions[0];
                    string strValue = option.PropertyValue;
                    if (strValue != null)
                    {
                        string[] splits = strValue.Split(',');

                        for (int i = 0; i < splits?.Length; i++)
                        {
                            string split = splits[i];
                            string[] splits2 = split.Split(':');

                            if (splits2?.Length == 2)
                            {
                                string strClassName = splits2[0];
                                string strScores = splits2[1];

                                string[] splits3 = strScores.Split('~');
                                if (splits3?.Length == 2)
                                {
                                    string strStartScore = splits3[0];
                                    string strEndScore = splits3[1];

                                    int nStartScore = 0;
                                    int nEndScore = 0;

                                    if (int.TryParse(strStartScore, out nStartScore) && int.TryParse(strEndScore, out nEndScore))
                                    {
                                        AssessmentClassData classData = new AssessmentClassData(strClassName, nStartScore, nEndScore);
                                        dicAssessmentClass[classData.ClassName] = classData;
                                        strFailClassName = classData.ClassName;
                                    }
                                }
                            }
                        }
                    }
                }

                if (dicAssessmentClass.Count == 0)
                {
                    AssessmentClassData classData = new AssessmentClassData("A", 80, 100);
                    dicAssessmentClass[classData.ClassName] = classData;

                    classData = new AssessmentClassData("B", 60, 80);
                    dicAssessmentClass[classData.ClassName] = classData;

                    classData = new AssessmentClassData("C", 40, 60);
                    dicAssessmentClass[classData.ClassName] = classData;

                    classData = new AssessmentClassData("D", 20, 40);
                    dicAssessmentClass[classData.ClassName] = classData;

                    classData = new AssessmentClassData("E", 0, 20);
                    dicAssessmentClass[classData.ClassName] = classData;

                    strFailClassName = classData.ClassName;
                }

                string strError = null;
                List< AssessmentA> aList = m_processManager.SdmsDataManager.GetSelectManager().SelectAssessmentAs(null, $"{AssessmentA.Fields.AssessmentID}={assessmentID}", out strError);
                if (aList == null)
                    return res;

                res.AList = aList;

                string strSQL = $@"
                    select m.MemberID, rm.MemberName, m.Score avgScore, AID, Contents, aitem.Score, m.IsPass, aitem.Memo, ass.Type
                      from SdmsAssessmentAMember m
                     inner join SdmsAssessmentA a on m.AssessmentID=a.AssessmentID
                     inner join SdmsAssessmentAItem aitem on m.AssessmentID=aitem.AssessmentID and m.MemberID=aitem.MemberID and a.ID=aitem.AID
                     inner join SopTeamRegularMember rm on m.MemberID=rm.ID
                     inner join SdmsAssessment ass on m.AssessmentID = ass.ID
                     where m.AssessmentID={assessmentID}";

                ArrayList arrResult = m_processManager.SdmsDataManager.GetSelectManager().GetResultData(strSQL, out strError);
                if (arrResult == null)
                    return null;

                Dictionary<int, MemberScore> dicMemberScores = new Dictionary<int, MemberScore>();

                int nResultCount = arrResult.Count;
                for (int i = 0; i < nResultCount - 8; i += 9)
                {
                    VariousData<int> nMemberID = WebDBManager.GetIntField(arrResult[i].ToString());
                    string strMemberName = WebDBManager.GetStringField(arrResult[i + 1]);
                    VariousData<float> fAvgScore = WebDBManager.GetFloatField(arrResult[i + 2].ToString());
                    VariousData<int> nAID = WebDBManager.GetIntField(arrResult[i + 3].ToString());
                    string strContents = WebDBManager.GetStringField(arrResult[i + 4]);
                    VariousData<float> fScore = WebDBManager.GetFloatField(arrResult[i + 5].ToString());
                    VariousData<int> IsPass = WebDBManager.GetIntField(arrResult[i + 6].ToString());
                    string strMemo = WebDBManager.GetStringField(arrResult[i + 7]);
                    VariousData<int> nType = WebDBManager.GetIntField(arrResult[i + 8].ToString());

                    if (nMemberID == null || fAvgScore == null || nAID == null || fScore == null)
                        continue;                                                             

                    MemberScore memberScore;
                    if (!dicMemberScores.TryGetValue(nMemberID.Data, out memberScore))
                    {
                        memberScore = new MemberScore();
                        memberScore.AItems = new List<AItemData>();
                        memberScore.MemberID = nMemberID.Data;
                        memberScore.MemberName = strMemberName;
                        memberScore.AvgScore = fAvgScore.Data;
                        //memberScore.Memo = strMemo;
                        if (nType != null)
                            memberScore.Type = nType.Data;

                        float Score = fAvgScore.Data * 25;
                        string strScore = "-";

                        foreach (KeyValuePair<string, AssessmentClassData> pair in dicAssessmentClass)
                        {
                            string strClassName = pair.Key;
                            AssessmentClassData classData = pair.Value;

                            if (classData.StartScore <= Score && classData.EndScore >= Score)
                            {
                                strScore = strClassName;
                                break;
                            }
                        }

                        //bool? bIsPass = null;
                        //if (IsPass != null)
                        //{
                        //    bIsPass = IsPass.Data > 0;
                        //    if (bIsPass == false)
                        //        strScore = strFailClassName;
                        //}

                        memberScore.ScoreClass = strScore;
                        //memberScore.IsPass = bIsPass;

                        dicMemberScores[nMemberID.Data] = memberScore;
                    }

                    memberScore.AItems.Add(new AItemData()
                    {
                        AID = nAID.Data,
                        Contents = strContents,                        
                        Score = fScore.Data,
                        Memo = strMemo
                    });
                }

                res.MemberScores = dicMemberScores.Values.ToList();
                return res;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public ResAssessmentClass LoadAssessmentClass(RequestLoadAssessmentClass req)
        {
            ResAssessmentClass res = new ResAssessmentClass();
            try
            {
                string strErrorMessage;
                // 등급 불러오기(사이트별 관리)
                int? nSiteID = req.SiteID;
                if (nSiteID.HasValue == false)
                    nSiteID = m_processManager.CommonDataManager.SiteID;

                Dictionary<string, AssessmentClassData> dicAssessmentClass = new Dictionary<string, AssessmentClassData>();

                string strPropertyName = "AssessmentClass";
                List<Common.Model.Option.Options> sdmsOptions = m_processManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID.Value, out strErrorMessage);
                if (sdmsOptions?.Count > 0)
                {
                    Common.Model.Option.Options option = sdmsOptions[0];
                    string strValue = option.PropertyValue;
                    if (strValue != null)
                    {
                        string[] splits = strValue.Split(',');

                        for (int i = 0; i < splits?.Length; i++)
                        {
                            string split = splits[i];
                            string[] splits2 = split.Split(':');

                            if (splits2?.Length == 2)
                            {
                                string strClassName = splits2[0];
                                string strScores = splits2[1];

                                string[] splits3 = strScores.Split('~');
                                if (splits3?.Length == 2)
                                {
                                    string strStartScore = splits3[0];
                                    string strEndScore = splits3[1];

                                    int nStartScore = 0;
                                    int nEndScore = 0;

                                    if (int.TryParse(strStartScore, out nStartScore) && int.TryParse(strEndScore, out nEndScore))
                                    {
                                        AssessmentClassData classData = new AssessmentClassData(strClassName, nStartScore, nEndScore);
                                        dicAssessmentClass[classData.ClassName] = classData;
                                    }
                                }
                            }
                        }
                    }
                }

                if (dicAssessmentClass.Count == 0)
                {
                    AssessmentClassData classData = new AssessmentClassData("A", 80, 100);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new AssessmentClassData("B", 60, 80);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new AssessmentClassData("C", 40, 60);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new AssessmentClassData("D", 20, 40);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new AssessmentClassData("E", 0, 20);
                    dicAssessmentClass[classData.ClassName] = classData;
                }

                List<AssessmentClassData> assessmentClasses = new List<AssessmentClassData>();

                foreach (KeyValuePair<string, AssessmentClassData> pair in dicAssessmentClass)
                {
                    AssessmentClassData data = pair.Value;
                    assessmentClasses.Add(data);
                }

                res.AssessmentClasses = assessmentClasses;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                res.Success = false;
                return res;
            }
        }
        #endregion
    }
}
