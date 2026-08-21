using ClosedXML.Excel;
using Common.Model.History;
using dnsData.Sensor;
using Hydrogen.BLL.Models;
using Hydrogen.BLL.Models.Data;
using Hydrogen.Model.RiskAssess;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using SDMS.IDAL;
using SDMS.Model.History;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;
using SOPManager.Model.Sop.Category;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;

namespace Hydrogen.BLL
{
    public class LoadManager
    {
        IDataManager m_dataManager = null;
        SOPManager.IDAL.IDataManager m_sopDataManager = null;
        Common.IDAL.IDataManager m_commonDataManager = null;
        IDAL.IDataManager m_hyDataManager = null;
        private static List<string> m_strActionStepNames = null;

        private static string AWS_URL = "http://18.156.85.186:8082";
        private static string KGS_DamageScope = "/KGS/RequestDamageScope";
        private static string KGS_Risk = "/KGS/RequestRiskData";

        private static string SUCESS = "success";
        private static string POST = "POST";

        private static double PixelScale = 3.2;

        public LoadManager(IDataManager dataManager, SOPManager.IDAL.IDataManager sopDataManager, Common.IDAL.IDataManager commonDataManager, IDAL.IDataManager hyDataManager)
        {
            m_dataManager = dataManager;
            m_sopDataManager = sopDataManager;
            m_commonDataManager = commonDataManager;
            m_hyDataManager = hyDataManager;

            InitActionStepNames();
        }

        /// <summary>
        /// 알람 단계 명칭 조회
        /// </summary>
        private void InitActionStepNames()
        {
            if (m_strActionStepNames == null)
            {
                m_strActionStepNames = getActionStepNames();
            }
        }

        /// <summary>
        /// 알람 단계 명칭 조회
        /// </summary>
        public List<string> getActionStepNames()
        {
            if (m_strActionStepNames != null)
                return m_strActionStepNames;

            string strErrorMessage;
            List<Common.Model.Option.Options> options =
                m_commonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "StandardActionStepNames", out strErrorMessage);
            if (options == null || options.Count == 0)
                return new List<string>() { "관심", "주의", "경계", "심각" };

            Common.Model.Option.Options sopSimulratorOption = options[0];
            string[] actionStepNames = sopSimulratorOption.PropertyValue.Split(',');

            if (actionStepNames == null)
                return null;

            if (actionStepNames.Length == 0)
                return new List<string>() { "관심", "주의", "경계", "심각" };

            if (m_strActionStepNames == null)
                m_strActionStepNames = new List<string>();
            else
                m_strActionStepNames.Clear();

            for (int i = 0; i < actionStepNames.Length; i++)
                m_strActionStepNames.Add(actionStepNames[i].Trim());

            return m_strActionStepNames;
        }

        public ResponseMinMaxIndex GetMinMaxIndex(DateTime beginTime, DateTime endTime, int facilityType, int buildingID, int zoneID)
        {
            string strErrorMessage = null;

            string strConditionSensorTypes = "";
            if (facilityType > -1)
            {
                if (Facility.IsH2SensorType(Facility.ToFacilityType(facilityType)))
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

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(" SdmsHistorySensorZone.Time >= '{0}' And SdmsHistorySensorZone.Time <= '{1}'", beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));

            if (strConditionSensorTypes.Length > 0)
                sb.Append(strConditionSensorTypes);

            if (buildingID > 0 || zoneID > 0)
            {
                if (zoneID > 0)
                {
                    sb.AppendFormat(" And SdmsSpatialZone.ID = {0}", zoneID);
                }
                else if(buildingID > 0)
                {
                    sb.AppendFormat(" And SdmsSpatialZone.BuildingID = {0}", buildingID);
                }
            }

            ResponseMinMaxIndex res = new ResponseMinMaxIndex();

            ArrayList arrResult = m_dataManager.GetSelectManager().GetCountSensorReactionHistory(sb.ToString(), out strErrorMessage);
            if (arrResult != null && arrResult.Count == 2)
            {
                int minID = Convert.ToInt32(arrResult[0]);
                int maxID = Convert.ToInt32(arrResult[1]);

                res.MinReactionHistoryID = minID;
                res.MaxReactionHistoryID = maxID;
            }

            return res;
        }

        public ResponseCountIndex GetCountIndex(DateTime beginTime, DateTime endTime, int facilityType, int buildingID, int zoneID)
        {
            string strErrorMessage = null;

            string strConditionSensorTypes = "";
            if (facilityType > -1)
            {
                if (Facility.IsH2SensorType(Facility.ToFacilityType(facilityType)))
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

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(" SdmsHistorySensorZone.Time >= '{0}' And SdmsHistorySensorZone.Time <= '{1}'", beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));

            if (strConditionSensorTypes.Length > 0)
                sb.Append(strConditionSensorTypes);

            if (buildingID > 0 || zoneID > 0)
            {
                if (zoneID > 0)
                {
                    sb.AppendFormat(" And SdmsSpatialZone.ID = {0}", zoneID);
                }
                else if (buildingID > 0)
                {
                    sb.AppendFormat(" And SdmsSpatialZone.BuildingID = {0}", buildingID);
                }
            }

            ResponseCountIndex res = new ResponseCountIndex();

            ArrayList arrResult = m_dataManager.GetSelectManager().GetCountSensorReactionHistory(sb.ToString(), out strErrorMessage);
            if (arrResult != null && arrResult.Count == 1)
            {
                int nCount = Convert.ToInt32(arrResult[0]);

                res.Count = nCount;
            }

            return res;
        }

        public ResponseSensorDetectHistories DisplaySensorDetectHistories(DateTime beginTime, DateTime endTime, int facilityType, int buildingID, int zoneID, int nLastSensorZoneHistoryID, int rowCount, bool bIsDesc, int nSiteID)
        {
            string strErrorMessage = null;

            string strCondition = string.Format("{0}.{1} in (0,21,50,62,64)", SensorReactionHistory.TableName, SensorReactionHistory.Fields.ReactionType);

            string strConditionSensorTypes = "";
            if (facilityType > -1)
            {
                if (Facility.IsH2SensorType(Facility.ToFacilityType(facilityType)))
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

            StringBuilder sb = new StringBuilder();
            sb.Append(" And SdmsHistorySensorReaction.SensorZoneHistoryID in (");
            if (rowCount > 0)
            {
                // mysql : subQuery에 limit 포함하려면 한번 더 감싸야함
                if (nSiteID == 14 || nSiteID == 15)
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

            if (buildingID > 0 || zoneID > 0)
            {
                if (zoneID > 0)
                    sb.AppendFormat(" And z.ID = {0}", zoneID);
                else if (buildingID > 0)
                {
                    sb.AppendFormat(" And z.BuildingID = {0}", buildingID);
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

                if (nSiteID == 14 || nSiteID == 15)
                    sb.AppendFormat(" LIMIT {0}) as subq", rowCount);
            }
            sb.Append(" ) ");
            sb.Append(" Order By SdmsHistorySensorZone.ID ");
            if (!bIsDesc)
                sb.Append(" Asc");
            else
                sb.Append(" Desc");

            strCondition += sb.ToString();

            ArrayList arrResult = m_dataManager.GetSelectManager().JoinEquipmentZoneSensorReactionHistorySensorZoneSensorZoneHistory(null, null, null, null, strCondition, out strErrorMessage);
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
            for (int i = 0; i < nResultCount; i += 5)
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
                    //data.ZoneName = z.DisplayText + " " + eq.DisplayText;
                    data.ZoneName = z.DisplayText;
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
                ArrayList arrResult2 = m_commonDataManager.GetSelectManager().JoinActionStepHistoryActionStep(null, null, strCondition, out strErrorMessage);
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

                                ArrayList arrResult3 = m_sopDataManager.GetSelectManager().JoinDisasterCategorySubDisasterCategoryDisasterActionStep(actionStep.ID, out strErrorMessage);
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
                arrResult = m_dataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
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

        public ResponseSensorDetectHistories DisplaySensorDetectHistories2(DateTime beginTime, DateTime endTime, int facilityType, int buildingID, int zoneID, int limitCount, int rowCount, int nSiteID)
        {
            string strErrorMessage = null;

            string strCondition = string.Format("{0}.{1} in (0,21,50,62,64)", SensorReactionHistory.TableName, SensorReactionHistory.Fields.ReactionType);

            string strConditionSensorTypes = "";
            if (facilityType > -1)
            {
                if (Facility.IsH2SensorType(Facility.ToFacilityType(facilityType)))
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
                else if (Facility.IsH2LowSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetH2LowTypeAllNumberToList()));
                else if (Facility.IsO2SensorType(Facility.ToFacilityType(facilityType)))
                    strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetO2TypeAllNumberToList()));
                else if (Facility.IsH2JAGSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetH2JAGTypeAllNumberToList()));
                else if (Facility.IsO2JAGSensorType(Facility.ToFacilityType(facilityType)))
                    strConditionSensorTypes = string.Format(" And SensorType in ({0})", string.Join(",", Facility.GetO2JAGTypeAllNumberToList()));
            }

            StringBuilder sb = new StringBuilder();
            sb.Append(" And SdmsHistorySensorReaction.SensorZoneHistoryID in (");
            if (rowCount >= 0)
            {
                // mysql : subQuery에 limit 포함하려면 한번 더 감싸야함
                //if (nSiteID == 14 || nSiteID == 15)
                //    sb.Append("Select subq.ID from (select sz.ID ");
                //else
                //    sb.AppendFormat("Select TOP({0}) sz.ID ", rowCount);
                sb.Append("Select subq.ID from (select sz.ID ");
            }
            else
                sb.AppendFormat("Select sz.ID", rowCount);
            sb.Append("        From SdmsHistorySensorZone as sz ");
            sb.Append("       INNER join SdmsSpatialZone as z on sz.ZoneID=z.ID");
            sb.AppendFormat(" Where Time >= '{0}' And Time <= '{1}'", beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));

            if (strConditionSensorTypes.Length > 0)
                sb.Append(strConditionSensorTypes);

            if (buildingID > 0 || zoneID > 0)
            {
                if (zoneID > 0)
                    sb.AppendFormat(" And z.ID = {0}", zoneID);
                else if (buildingID > 0)
                {
                    sb.AppendFormat(" And z.BuildingID = {0}", buildingID);
                }
            }

            if (nSiteID > 0)
            {
                sb.AppendFormat(" And sz.SiteID = {0}", nSiteID);
            }

            if (rowCount >= 0)
            {
                sb.Append(" Order By sz.ID ");
                //if (!bIsDesc)
                //    sb.Append(" Asc");
                //else
                //    sb.Append(" Desc");
                sb.Append(" Desc");

                sb.AppendFormat(" LIMIT {0}, {1}) as subq", limitCount, rowCount);
            }
            sb.Append(" ) ");
            sb.Append(" Order By SdmsHistorySensorZone.ID ");

            //if (!bIsDesc)
            //    sb.Append(" Asc");
            //else
            //    sb.Append(" Desc");
            sb.Append(" Desc");

            strCondition += sb.ToString();

            ArrayList arrResult = m_dataManager.GetSelectManager().JoinEquipmentZoneSensorReactionHistorySensorZoneSensorZoneHistory(null, null, null, null, strCondition, out strErrorMessage);
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
            for (int i = 0; i < nResultCount; i += 5)
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
                    //data.ZoneName = z.DisplayText + " " + eq.DisplayText;
                    data.ZoneName = z.DisplayText;
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
                ArrayList arrResult2 = m_commonDataManager.GetSelectManager().JoinActionStepHistoryActionStep(null, null, strCondition, out strErrorMessage);
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

                                ArrayList arrResult3 = m_sopDataManager.GetSelectManager().JoinDisasterCategorySubDisasterCategoryDisasterActionStep(actionStep.ID, out strErrorMessage);
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
                arrResult = m_dataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
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



        public ResponseSettings GetSettings(RequestSettings data)
        {
            ResponseSettings result = new ResponseSettings();

            // 유저 설정 정보 불러오기
            Dictionary<SOPManager.Model.Sop.Account.Option.Fields, object> dicCondition = new Dictionary<SOPManager.Model.Sop.Account.Option.Fields, object>();
            dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.UserID, data.UserID);
            //dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.Category, strShortcutKey);

            string strErrorMessage = null;
            List<SOPManager.Model.Sop.Account.Option> options = m_sopDataManager.GetSelectManager().SelectOptions(dicCondition, out strErrorMessage);
            if (options == null)
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            string strShortcutKey = "ShortcutKey";

            // 기본값
            result.IdleTime = "15";

            foreach (SOPManager.Model.Sop.Account.Option option in options)
            {
                if (option.Category == "IdleTime")
                {
                    result.IdleTime = option.PropertyValue1;
                    break;
                }                    
            }

            Dictionary<string, string> dicSDMSDefaultOptions = new Dictionary<string, string>();

            dicSDMSDefaultOptions["UseReceiveH2"] = "true";
            dicSDMSDefaultOptions["UseReceiveTemp"] = "true";
            dicSDMSDefaultOptions["UseReceiveFlow"] = "true";
            dicSDMSDefaultOptions["UseReceiveConductivity"] = "true";
            dicSDMSDefaultOptions["UseReceivePressure"] = "true";
            dicSDMSDefaultOptions["UseReceiveGAS"] = "true";
            
            dicSDMSDefaultOptions["UseScreenMove"] = "true";
            dicSDMSDefaultOptions["MoveDisplayAlarm"] = "3";

            dicSDMSDefaultOptions["UsePoiFocus"] = "true";

            dicSDMSDefaultOptions["AlarmAutoEnd"] = "1";


            if (!GetSDMSOptions(dicSDMSDefaultOptions, result, data.SiteID, out strErrorMessage))
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }


            Dictionary<string, string> dicSopDefaultOptions = new Dictionary<string, string>();
            dicSopDefaultOptions["UseSMS"] = "false";
            dicSopDefaultOptions["UseEmail"] = "false";
            dicSopDefaultOptions["UseResultSummary"] = "true";

            dicSopDefaultOptions["SOPWaitEndTime"] = "30;1;0";

            dicSopDefaultOptions["ExeCautionSOP"] = "1";
            dicSopDefaultOptions["ExeAlartSOP"] = "1";
            dicSopDefaultOptions["ExeSeriousSOP"] = "1";
            dicSopDefaultOptions["UseConfirm"] = "true";
            dicSopDefaultOptions["WorkingBeginHour"] = "9:0";
            dicSopDefaultOptions["WorkingEndHour"] = "18:0";
            dicSopDefaultOptions["UseAutoMoveSOPScreen"] = "true";
                        

            if (!GetSopOptions(dicSopDefaultOptions, result, data.SiteID, out strErrorMessage))
            {
                result.Success = false;
                result.Message = strErrorMessage;
                return result;
            }

            result.Success = true;
            return result;
        }

        private bool GetSDMSOptions(Dictionary<string, string> dicDefaultOptions, ResponseSettings result, int? nSiteID, out string strErrorMessage)
        {
            List<Common.Model.Option.Options> options = null;
            if (nSiteID != null && nSiteID > 0)
                options = m_commonDataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SDMS, $"SiteID={(int)nSiteID}", null, out strErrorMessage);
            else
                options = m_commonDataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SDMS, out strErrorMessage);

            if (options == null)
                return false;

            foreach (Common.Model.Option.Options option in options)
            {
                if (dicDefaultOptions.ContainsKey(option.PropertyName))
                    dicDefaultOptions[option.PropertyName] = option.PropertyValue;
            }

            foreach (KeyValuePair<string, string> pair in dicDefaultOptions)
            {
                if (pair.Key == "UseReceiveH2")
                    result.UseReceiveH2 = pair.Value;
                else if (pair.Key == "UseReceiveTemp")
                    result.UseReceiveTemp = pair.Value;
                else if (pair.Key == "UseReceiveFlow")
                    result.UseReceiveFlow = pair.Value;
                else if (pair.Key == "UseReceiveConductivity")
                    result.UseReceiveConductivity = pair.Value;
                else if (pair.Key == "UseReceivePressure")
                    result.UseReceivePressure = pair.Value;
                else if (pair.Key == "UseReceiveGAS")
                    result.UseReceiveGAS = pair.Value;
                else if (pair.Key == "UseScreenMove")
                    result.UseScreenMove = pair.Value;
                else if (pair.Key == "MoveDisplayAlarm")
                    result.MoveDisplayAlarm = pair.Value;
                else if (pair.Key == "UsePoiFocus")
                    result.UsePoiFocus = pair.Value;
                else if (pair.Key == "AlarmAutoEnd")
                    result.AlarmAutoEnd = pair.Value;
            }

            return true;
        }

        private bool GetSopOptions(Dictionary<string, string> dicDefaultOptions, ResponseSettings result, int? nSiteID, out string strErrorMessage)
        {
            strErrorMessage = "";

            List<Common.Model.Option.Options> options = null;
            if (nSiteID != null && nSiteID > 0)
                options = m_commonDataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SOPSimulator, $"SiteID={nSiteID}", null, out strErrorMessage);
            else
                options = m_commonDataManager.GetSelectManager().SelectOptions(Common.Model.Option.Options.OptionTarget.SOPSimulator, out strErrorMessage);

            if (options == null)
                return false;

            foreach (Common.Model.Option.Options option in options)
            {
                if (dicDefaultOptions.ContainsKey(option.PropertyName))
                    dicDefaultOptions[option.PropertyName] = option.PropertyValue;
            }

            foreach (KeyValuePair<string, string> pair in dicDefaultOptions)
            {
                if (pair.Key == "ExeCautionSOP")
                    result.ExeCautionSOP = pair.Value;
                else if (pair.Key == "ExeAlartSOP")
                    result.ExeAlartSOP = pair.Value;
                else if (pair.Key == "ExeSeriousSOP")
                    result.ExeSeriousSOP = pair.Value;
                else if (pair.Key == "UseTrainingMode")
                    result.UseAutoMoveSOPScreen = pair.Value;
                else if (pair.Key == "UseSMS")
                    result.UseSMS = pair.Value;
                else if (pair.Key == "UseEmail")
                    result.UseEmail = pair.Value;
                else if (pair.Key == "UseConfirm")
                    result.UseConfirm = pair.Value;
                else if (pair.Key == "WorkingBeginHour")
                    result.WorkingBeginHour = pair.Value;
                else if (pair.Key == "WorkingEndHour")
                    result.WorkingEndHour = pair.Value;
                else if (pair.Key == "UseResultSummary")
                    result.UseResultSummary = pair.Value;
                else if (pair.Key == "SOPWaitEndTime")
                    result.SOPWaitEndTime = pair.Value;               
            }

            return true;
        }

        public MessageResult SaveSettings(RequestSaveSettings_Hydrogen data)
        {
            MessageResult result = new MessageResult();

            string strErrorMessage = null;
            int nSiteID = -1; //m_processManager.SopDataManager.SiteID;
            if (data.SiteID == null || data.SiteID <= 0)
            {
                string strError = null;
                List<Common.Model.Site> sites = m_commonDataManager.GetSelectManager().SelectSites(null, out strError);
                if (sites == null || sites.Count == 0)
                {
                    result.Message = "Site ID를 조회할 수 없습니다";
                    return result;
                }

                nSiteID = sites[0].ID;
            }
            else
                nSiteID = (int)data.SiteID;

            #region AccountOption
            //if (data.ShortcutKey != null)
            //{   // 단축키 설정 정보 저장
            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "SDMS", data.ShortcutKey.SDMS, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "SOP", data.ShortcutKey.SOP, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "SOPMgr", data.ShortcutKey.SOPMgr, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "TeamEdit", data.ShortcutKey.TeamEdit, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "History", data.ShortcutKey.History, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "Settings", data.ShortcutKey.Settings, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "Dashboard", data.ShortcutKey.Dashboard, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "Home", data.ShortcutKey.Home, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }

            //    if (!UpdateAccountOption(data.UserID, "ShortcutKey", "Rotation", data.ShortcutKey.Rotation, out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }
            //}

            if (data.IdleTime != null)
            {   // 회전대기 시간 설정
                if (!UpdateAccountOption(data.UserID, "IdleTime", "", data.IdleTime, out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            #endregion

            if (data.UseReceiveH2 != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseReceiveH2", data.UseReceiveH2, nSiteID, "수소 알람 신호 수신 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseReceiveFlow != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseReceiveFlow", data.UseReceiveFlow, nSiteID, "유량 알람 신호 수신 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseReceiveConductivity != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseReceiveConductivity", data.UseReceiveConductivity, nSiteID, "전도도 알람 신호 수신 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseReceiveTemp != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseReceiveTemp", data.UseReceiveTemp, nSiteID, "온도 알람 신호 수신 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseReceivePressure != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseReceivePressure", data.UseReceivePressure, nSiteID, "압력 알람 신호 수신 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseReceiveGAS != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseReceiveGAS", data.UseReceiveGAS, nSiteID, "가스 알람 신호 수신 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseScreenMove != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UseScreenMove", data.UseScreenMove, nSiteID, "종료/오탐지시 화면 이동 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }            

            if (data.ExeCautionSOP != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "ExeCautionSOP", data.ExeCautionSOP, nSiteID, "주의 알람 감지시 SOP 실행 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.ExeAlartSOP != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "ExeAlartSOP", data.ExeAlartSOP, nSiteID, "경계 알람 감지시 SOP 실행 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.ExeSeriousSOP != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "ExeSeriousSOP", data.ExeSeriousSOP, nSiteID, "심각 알람 감지시 SOP 실행 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.MoveDisplayAlarm != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "MoveDisplayAlarm", data.MoveDisplayAlarm, nSiteID, "알람시 자동 화면 전환 기능 설정", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseAutoMoveSOPScreen != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "UseAutoMoveSOPScreen", data.UseAutoMoveSOPScreen, nSiteID, "실행중인 컴포넌트로 자동 화면 이동 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            //if (data.UseBroadcast != null)
            //{
            //    if (!UpdateOption(Options.OptionTarget.SOPSimulator, "UseBroadcast", data.UseBroadcast, nSiteID, "방송 전파 사용 여부", out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }
            //}

            if (data.UseSMS != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "UseSMS", data.UseSMS, nSiteID, "문자 전파 사용 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseEmail != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "UseEmail", data.UseEmail, nSiteID, "이메일 전파 사용 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseConfirm != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "UseConfirm", data.UseConfirm, nSiteID, "상황 전파시 확인단계 거치기 설정", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.WorkingBeginHour != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "WorkingBeginHour", data.WorkingBeginHour, nSiteID, "평일 주간 시작 시간", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.WorkingEndHour != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "WorkingEndHour", data.WorkingEndHour, nSiteID, "평일 주간 종료 시간", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UseResultSummary != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "UseResultSummary", data.UseResultSummary, nSiteID, "SOP 결과 요약창 설정 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.SOPWaitEndTime != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SOPSimulator, "SOPWaitEndTime", data.SOPWaitEndTime, nSiteID, "SOP 대기 자동 종료 설정 [ 시간 / 시간단위(0:초,1:분,2:시간) / 종료모드(0:자동종료, 1:확인 후 종료, 2:종료안함) ]", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.UsePoiFocus != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "UsePoiFocus", data.UsePoiFocus, nSiteID, "이벤트 관련 POI에 카메라 포커싱 여부", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            //if (data.UsePoiHighlight != null)
            //{
            //    if (!UpdateOption(Options.OptionTarget.SDMS, "UsePoiHighlight", data.UsePoiHighlight, nSiteID, "POI 선택시 선택된 POI 및 같은 공간의 POI 확대 여부", out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }
            //}

            //if (data.UseAlarmArea != null)
            //{
            //    if (!UpdateOption(Options.OptionTarget.SDMS, "UseAlarmArea", data.UseAlarmArea, nSiteID, "이벤트 관련 영역 표시 여부를 설정 여부", out strErrorMessage))
            //    {
            //        result.Success = false;
            //        result.Message = strErrorMessage;
            //        return result;
            //    }
            //}

            if (data.AlarmAutoEnd != null)
            {
                if (!UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, "AlarmAutoEnd", data.AlarmAutoEnd, nSiteID, "알람 자동종료 설정", out strErrorMessage))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            result.Success = true;
            return result;
        }

        private bool UpdateAccountOption(int nUserID, string strCategory, string strSubCategory, string strPropertyValue1, out string strErrorMessage, string strPropertyValue2 = "", string strPropertyValue3 = "", string strPropertyValue4 = "")
        {
            strErrorMessage = "";
            //string strCategory = "ShortcutKey";

            Dictionary<SOPManager.Model.Sop.Account.Option.Fields, object> dicCondition = new Dictionary<SOPManager.Model.Sop.Account.Option.Fields, object>();
            dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.UserID, nUserID);
            dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.Category, strCategory);
            dicCondition.Add(SOPManager.Model.Sop.Account.Option.Fields.SubCategory, strSubCategory);

            List<SOPManager.Model.Sop.Account.Option> options = m_sopDataManager.GetSelectManager().SelectOptions(dicCondition, out strErrorMessage);
            if (options == null)
            {
                return false;
            }

            if (options.Count == 0)
            {   // 새로 생성
                SOPManager.Model.Sop.Account.Option retOption = m_sopDataManager.GetCreateManager().CreateOption(nUserID, strCategory, strSubCategory, strPropertyValue1, strPropertyValue2, strPropertyValue3, strPropertyValue4);

                if (retOption == null)
                {
                    strErrorMessage = strCategory + " " + strSubCategory + " CreateOption 실패.";
                    return false;
                }
            }
            else if (options.Count > 0)
            {   // 업데이트
                SOPManager.Model.Sop.Account.Option optionData = options[0];
                optionData.PropertyValue1 = strPropertyValue1;
                optionData.PropertyValue2 = strPropertyValue2;
                optionData.PropertyValue3 = strPropertyValue3;
                optionData.PropertyValue4 = strPropertyValue4;

                if (!m_sopDataManager.GetUpdateManager().UpdateOption(optionData))
                {
                    strErrorMessage = strCategory + " " + strSubCategory + " UpdateOption 실패.";
                    return false;
                }
            }

            return true;
        }

        private bool UpdateOption(Common.Model.Option.Options.OptionTarget type, string strPropertyName, string strPropertyValue, int nSiteID, string strDescription, out string strErrorMessage)
        {
            List<Common.Model.Option.Options> options = m_commonDataManager.GetSelectManager().SelectOption(type, strPropertyName, nSiteID, out strErrorMessage);
            if (options == null)
            {
                return false;
            }

            if (options.Count == 0)
            {
                Common.Model.Option.Options option = m_commonDataManager.GetCreateManager().CreateOption(type, strPropertyName, strPropertyValue, nSiteID, strDescription);

                if (option == null)
                {
                    strErrorMessage = strPropertyName + " CreateOption 실패.";
                    return false;
                }
            }
            else if (options.Count > 0)
            {
                Common.Model.Option.Options optionData = options[0];
                optionData.PropertyValue = strPropertyValue;
                string strCondition = "ID = " + optionData.ID.ToString();

                if (!m_commonDataManager.GetUpdateManager().UpdateOption(type, optionData, strCondition))
                {
                    strErrorMessage = strPropertyName + " UpdateOption 실패.";
                    return false;
                }
            }

            return true;
        }

        public MessageResult ResetPopup(RequestResetPopup data)
        {
            MessageResult result = new MessageResult();

            string strCategory = "popup";
            string strErrorMessage = null;

            if (data.UserID.HasValue == false)
            {
                result.Success = false;
                result.Message = "UserID 값이 존재하지 않습니다.";
                return result;
            }

            if (data.PopupState.StatusInfo != null)
            {
                if (!UpdateAccountOption(data.UserID.Value, strCategory, "statusInfo", data.PopupState.StatusInfo.X, out strErrorMessage, data.PopupState.StatusInfo.Y, data.PopupState.StatusInfo.Height, data.PopupState.StatusInfo.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }            

            if (data.PopupState.DashboardPop != null)
            {
                if (!UpdateAccountOption(data.UserID.Value, strCategory, "dashboardPop", data.PopupState.DashboardPop.X, out strErrorMessage, data.PopupState.DashboardPop.Y, data.PopupState.DashboardPop.Height, data.PopupState.DashboardPop.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }            

            if (data.PopupState.EventInfoNew != null)
            {
                if (!UpdateAccountOption(data.UserID.Value, strCategory, "eventInfoNew", data.PopupState.EventInfoNew.X, out strErrorMessage, data.PopupState.EventInfoNew.Y, data.PopupState.EventInfoNew.Height, data.PopupState.EventInfoNew.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            if (data.PopupState.CompoundData != null)
            {
                if (!UpdateAccountOption(data.UserID.Value, strCategory, "compoundData", data.PopupState.CompoundData.X, out strErrorMessage, data.PopupState.CompoundData.Y, data.PopupState.CompoundData.Height, data.PopupState.CompoundData.Width))
                {
                    result.Success = false;
                    result.Message = strErrorMessage;
                    return result;
                }
            }

            result.Success = true;
            return result;
        }

        public MessageResult ClearLinkedSops()
        {
            MessageResult result = new MessageResult();

            bool bRet = m_sopDataManager.GetDeleteManager().DeleteLinkedSop(null);
            if (bRet == false)
            {
                result.Message = m_sopDataManager.GetDeleteManager().GetErrorMessage();
            }

            result.Success = bRet;
            return result;
        }

        public static ResponseSimulationData GetSimulationData(ReqSimulationData req)
        {
            ResponseSimulationData res = new ResponseSimulationData();

            // .TODO: 변수 값 형태 확인 필요


            // 원본 파일 경로 설정
            string originalExePath = @".\MERI\MHySIM_HRS_Run.exe";
            string originalExcelPath = @".\MERI\Input_Total.xlsx";
            string baseDirectory = Path.GetDirectoryName(originalExePath);

            // 임시 폴더 경로 생성 (현재 시간 기반)
            string timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss_fff");
            string tempFolderPath = Path.Combine(baseDirectory, $"Temp_{timestamp}");

            try
            {
                // 1. 임시 폴더 생성
                Console.WriteLine($"임시 폴더 생성: {tempFolderPath}");
                Directory.CreateDirectory(tempFolderPath);


                // 2. 파일 복사
                string copiedExePath = Path.Combine(tempFolderPath, "MHySIM_HRS_Run.exe");
                string copiedExcelPath = Path.Combine(tempFolderPath, "Input_Total.xlsx");
                string csvPath = Path.Combine(tempFolderPath, "Output_Total.csv");

                File.Copy(originalExePath, copiedExePath, true);
                File.Copy(originalExcelPath, copiedExcelPath, true);


                // 3. Excel 파일의 값 수정
                ModifyExcel(copiedExcelPath, req);

                // 4. 실행파일 실행
                RunExecutable(copiedExePath);

                // 5. CSV 파일 생성 대기
                WaitForCsvFile(csvPath, timeoutSeconds: 60); // 1분 타임아웃


                SimulationData data = new SimulationData();

                // 6. CSV 파일 읽기
                if (ReadFromCsv(csvPath, out data, out string strErrorMessage) == false)
                    throw new TimeoutException("ReadFromCsv Error: " + strErrorMessage);

                // 응답 메시지로 변환
                if (ChangeResponseData(req, data, out res, out strErrorMessage) == false)
                    throw new TimeoutException("ChangeResponseData Error: " + strErrorMessage);


                // 7. 임시 폴더 삭제
                if (Directory.Exists(tempFolderPath))
                    Directory.Delete(tempFolderPath, true); // true: 하위 파일/폴더도 모두 삭제                

                res.Success = true;
            }
            catch (Exception e)
            {
                // 오류 자료는 당분간 디버깅을 위해서 남겨둔다.
                //if (Directory.Exists(tempFolderPath))
                //    Directory.Delete(tempFolderPath, true); // true: 하위 파일/폴더도 모두 삭제

                res.Success = false;
                res.Message = e.Message;
            }

            return res;
        }

        /// <summary>
        /// Excel 파일의 B2 셀 값을 수정
        /// </summary>
        static void ModifyExcel(string excelPath, ReqSimulationData req)
        {
            //using (var package = new ExcelPackage(new FileInfo(excelPath)))
            using (var workbook = new XLWorkbook(excelPath))
            {
                var worksheet = workbook.Worksheet(1);

                worksheet.Cell("B3").Value = req.T_AmbC;
                worksheet.Cell("B4").Value = req.P_HBk_0;
                worksheet.Cell("B5").Value = req.D2On;
                worksheet.Cell("B6").Value = req.ContOn;
                worksheet.Cell("B7").Value = req.t_PreRun;
                worksheet.Cell("B8").Value = req.t_PreSet1;
                worksheet.Cell("B9").Value = req.t_PreSet2;
                //worksheet.Cell("B10").Value = req.Q_Fire;
                worksheet.Cell("B11").Value = req.CompMod;

                if (req.N_Source.HasValue)
                    worksheet.Cell("B58").Value = req.N_Source;
                if (req.P_Source.HasValue)
                    worksheet.Cell("B59").Value = req.P_Source;
                if (req.T_SourceC.HasValue)
                    worksheet.Cell("B60").Value = req.T_SourceC;
                if (req.m_Source.HasValue)
                    worksheet.Cell("B61").Value = req.m_Source;

                if (req.V_BufInd1.HasValue)
                    worksheet.Cell("B62").Value = req.V_BufInd1;
                if (req.N_Buf1.HasValue)
                    worksheet.Cell("B63").Value = req.N_Buf1;
                if (req.P_BufMax1.HasValue)
                    worksheet.Cell("B64").Value = req.P_BufMax1;
                if (req.P_Buf_RC1.HasValue)
                    worksheet.Cell("B65").Value = req.P_Buf_RC1;
                if (req.P_Buf_01.HasValue)
                    worksheet.Cell("B66").Value = req.P_Buf_01;
                if (req.P_BufMin1.HasValue)
                    worksheet.Cell("B67").Value = req.P_BufMin1;

                if (req.N_MCp.HasValue)
                    worksheet.Cell("B160").Value = req.N_MCp;
                if (req.P_CpInMaxM.HasValue)
                    worksheet.Cell("B161").Value = req.P_CpInMaxM;
                if (req.P_CpInMinM.HasValue)
                    worksheet.Cell("B162").Value = req.P_CpInMinM;
                if (req.P_refM.HasValue)
                    worksheet.Cell("B163").Value = req.P_refM;
                if (req.T_refCM.HasValue)
                    worksheet.Cell("B164").Value = req.T_refCM;
                if (req.m_Cp_refM.HasValue)
                    worksheet.Cell("B165").Value = req.m_Cp_refM;
                if (req.Sp_CpM.HasValue)
                    worksheet.Cell("B166").Value = req.Sp_CpM;
                if (req.EtaVM.HasValue)
                    worksheet.Cell("B167").Value = req.EtaVM;
                if (req.Eta_CompM.HasValue)
                    worksheet.Cell("B168").Value = req.Eta_CompM;
                if (req.Eta_motorM.HasValue)
                    worksheet.Cell("B169").Value = req.Eta_motorM;
                if (req.T_CoolSetCM.HasValue)
                    worksheet.Cell("B170").Value = req.T_CoolSetCM;
                if (req.COPM.HasValue)
                    worksheet.Cell("B171").Value = req.COPM;

                if (req.V_TkIndM.HasValue)
                    worksheet.Cell("B237").Value = req.V_TkIndM;
                if (req.N_TkM.HasValue)
                    worksheet.Cell("B238").Value = req.N_TkM;
                if (req.P_TkMaxM.HasValue)
                    worksheet.Cell("B239").Value = req.P_TkMaxM;
                if (req.P_TkMinM.HasValue)
                    worksheet.Cell("B240").Value = req.P_TkMinM;
                if (req.FuMoOnM.HasValue)
                    worksheet.Cell("B241").Value = req.FuMoOnM;
                if (req.T_Tk_0CM.HasValue)
                    worksheet.Cell("B242").Value = req.T_Tk_0CM;

                if (req.V_TkIndH.HasValue)
                    worksheet.Cell("B258").Value = req.V_TkIndH;
                if (req.N_TkH.HasValue)
                    worksheet.Cell("B259").Value = req.N_TkH;
                if (req.P_TkMaxM.HasValue)
                    worksheet.Cell("B260").Value = req.P_TkMaxM;
                if (req.P_TkMinM.HasValue)
                    worksheet.Cell("B261").Value = req.P_TkMinM;
                if (req.T_Tk_0CH.HasValue)
                    worksheet.Cell("B262").Value = req.T_Tk_0CH;

                if (req.EA_Disp1.HasValue)
                    worksheet.Cell("B296").Value = req.EA_Disp1;
                if (req.P_Class1.HasValue)
                    worksheet.Cell("B297").Value = req.P_Class1;
                if (req.T_BaC1.HasValue)
                    worksheet.Cell("B298").Value = req.T_BaC1;
                if (req.m_HFPLim1.HasValue)
                    worksheet.Cell("B299").Value = req.m_HFPLim1;
                if (req.t_BrkMax1.HasValue)
                    worksheet.Cell("B300").Value = req.t_BrkMax1;
                if (req.HFPMode1.HasValue)
                    worksheet.Cell("B301").Value = req.HFPMode1;
                if (req.ComOn1.HasValue)
                    worksheet.Cell("B302").Value = req.ComOn1;

                if (req.V_TkMode1.HasValue)
                    worksheet.Cell("B306").Value = req.V_TkMode1;
                if (req.TVL1.HasValue)
                    worksheet.Cell("B307").Value = req.TVL1;
                if (req.TV1.HasValue)
                    worksheet.Cell("B308").Value = req.TV1;
                if (req.P_Tk_01.HasValue)
                    worksheet.Cell("B309").Value = req.P_Tk_01;
                if (req.SOC_G1.HasValue)
                    worksheet.Cell("B310").Value = req.SOC_G1;
                if (req.T_Tk_0C1.HasValue)
                    worksheet.Cell("B311").Value = req.T_Tk_0C1;

                if (req.EA_Disp2.HasValue)
                    worksheet.Cell("B312").Value = req.EA_Disp2;
                if (req.P_Class2.HasValue)
                    worksheet.Cell("B313").Value = req.P_Class2;
                if (req.T_BaC2.HasValue)
                    worksheet.Cell("B314").Value = req.T_BaC2;
                if (req.m_HFPLim2.HasValue)
                    worksheet.Cell("B315").Value = req.m_HFPLim2;
                if (req.t_BrkMax2.HasValue)
                    worksheet.Cell("B316").Value = req.t_BrkMax2;
                if (req.HFPMode2.HasValue)
                    worksheet.Cell("B317").Value = req.HFPMode2;
                if (req.ComOn2.HasValue)
                    worksheet.Cell("B318").Value = req.ComOn2;

                if (req.V_TkMode2.HasValue)
                    worksheet.Cell("B322").Value = req.V_TkMode2;
                if (req.TVL2.HasValue)
                    worksheet.Cell("B323").Value = req.TVL2;
                if (req.TV2.HasValue)
                    worksheet.Cell("B324").Value = req.TV2;
                if (req.P_Tk_02.HasValue)
                    worksheet.Cell("B325").Value = req.P_Tk_02;
                if (req.SOC_G2.HasValue)
                    worksheet.Cell("B326").Value = req.SOC_G2;
                if (req.T_Tk_0C2.HasValue)
                    worksheet.Cell("B327").Value = req.T_Tk_0C2;

                workbook.Save();
            }
        }

        /// <summary>
        /// 실행파일 실행 및 종료 대기
        /// </summary>
        static void RunExecutable(string exePath)
        {
            //ProcessStartInfo startInfo = new ProcessStartInfo
            //{
            //    FileName = exePath,
            //    UseShellExecute = false,

            //    CreateNoWindow = false,  // true -> false로 변경하여 창 표시
            //    RedirectStandardOutput = true,  // 출력 캡처
            //    RedirectStandardError = true,   // 에러 캡처

            //    WorkingDirectory = Path.GetDirectoryName(exePath),

            //    StandardOutputEncoding = System.Text.Encoding.GetEncoding(949)  // EUC-KR
            //};

            //using (System.Diagnostics.Process process = System.Diagnostics.Process.Start(startInfo))
            //{
            //    // 표준 출력 읽기
            //    string output = process.StandardOutput.ReadToEnd();
            //    string error = process.StandardError.ReadToEnd();

            //    process.WaitForExit();

            //    Console.WriteLine($"종료 코드: {process.ExitCode}");
            //    Console.WriteLine($"표준 출력:\n{output}");
            //    Console.WriteLine($"에러 출력:\n{error}");
            //}
            ProcessStartInfo startInfo = new ProcessStartInfo
            {
                FileName = exePath,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = Path.GetDirectoryName(exePath)
            };

            using (System.Diagnostics.Process process = System.Diagnostics.Process.Start(startInfo))
            {
                process.WaitForExit();
                Console.WriteLine($"실행 완료 (종료 코드: {process.ExitCode})");
            }
        }

        /// <summary>
        /// CSV 파일 생성 대기
        /// </summary>
        static void WaitForCsvFile(string csvPath, int timeoutSeconds)
        {
            DateTime startTime = DateTime.Now;

            while (!File.Exists(csvPath))
            {
                if ((DateTime.Now - startTime).TotalSeconds > timeoutSeconds)
                {
                    throw new TimeoutException($"CSV 파일이 {timeoutSeconds}초 내에 생성되지 않았습니다.");
                }

                Thread.Sleep(300);
                Console.Write(".");
            }

            // 파일이 완전히 쓰여질 때까지 추가 대기 - 이미 생성되어 주석 처리
            //Thread.Sleep(500);

            // 파일이 다른 프로세스에 의해 잠겨있지 않은지 확인
            WaitForFileReady(csvPath, timeoutSeconds: 30);

            Console.WriteLine("\nCSV 파일 생성 완료!");
        }

        /// <summary>
        /// 파일이 읽기 가능할 때까지 대기
        /// </summary>
        static void WaitForFileReady(string filePath, int timeoutSeconds)
        {
            DateTime startTime = DateTime.Now;

            while (true)
            {
                try
                {
                    using (FileStream stream = File.Open(filePath, FileMode.Open, FileAccess.Read, FileShare.None))
                    {
                        break;
                    }
                }
                catch (IOException)
                {
                    if ((DateTime.Now - startTime).TotalSeconds > timeoutSeconds)
                    {
                        throw new TimeoutException("파일이 준비되지 않았습니다.");
                    }
                    Thread.Sleep(300);
                }
            }
        }

        public static bool ReadFromCsv(string csvPath, out SimulationData data, out string strErrorMessage)
        {
            bool bIsRet = true;

            data = new SimulationData();
            strErrorMessage = null;

            try
            {
                string[] lines = File.ReadAllLines(csvPath);

                if (lines.Length < 2)
                {
                    throw new Exception("CSV 파일에 데이터가 없습니다.");
                }

                for (int i = 1; i < lines.Length; i++)
                {
                    string line = lines[i].Trim();
                    if (string.IsNullOrWhiteSpace(line))
                        continue;

                    string[] values = line.Split(',');

                    if (values.Length >= 155)
                    {
                        double time = ParseDouble(values[0]);

                        double P_Buf1 = ParseDouble(values[21]);
                        double T_Buf1 = ParseDouble(values[155]);

                        double T_TkM = ParseDouble(values[51]);
                        double P_MBk = ParseDouble(values[143]);
                        double DeFuel1_MBk = ParseDouble(values[128]);
                        double DeFuel2_MBk = ParseDouble(values[139]);

                        double T_TkH = ParseDouble(values[66]);
                        double P_HBk = ParseDouble(values[142]);
                        double DeFuel1_HBk = ParseDouble(values[129]);
                        double DeFuel2_HBk = ParseDouble(values[140]);

                        double m_MCp1 = ParseDouble(values[32]);                        

                        double T_Tk1_1 = ParseDouble(values[125]);
                        double P_Tk1_1 = ParseDouble(values[101]);
                        double m_HFP1_1 = ParseDouble(values[121]);
                        double SOC_Tk1_1 = ParseDouble(values[96]);

                        double T_Tk2 = ParseDouble(values[136]);
                        double P_Tk2 = ParseDouble(values[92]);
                        double m_HFP2 = ParseDouble(values[132]);
                        double SOC_Tk2 = ParseDouble(values[95]);

                        double t_ElepS1_1 = ParseDouble(values[118]);                        


                        data.P_Buf1[time] = P_Buf1;
                        data.T_Buf1[time] = T_Buf1;

                        data.T_TkM[time] = T_TkM;
                        data.P_MBk[time] = P_MBk;
                        data.DeFuel1_MBk[time] = DeFuel1_MBk;
                        data.DeFuel2_MBk[time] = DeFuel2_MBk;

                        data.T_TkH[time] = T_TkH;
                        data.P_HBk[time] = P_HBk;
                        data.DeFuel1_HBk[time] = DeFuel1_HBk;
                        data.DeFuel2_HBk[time] = DeFuel2_HBk;

                        data.m_MCp1[time] = m_MCp1;                        

                        data.T_Tk1_1[time] = T_Tk1_1;
                        data.P_Tk1_1[time] = P_Tk1_1;
                        data.m_HFP1_1[time] = m_HFP1_1;
                        data.SOC_Tk1_1[time] = SOC_Tk1_1;

                        data.T_Tk2[time] = T_Tk2;
                        data.P_Tk2[time] = P_Tk2;
                        data.m_HFP2[time] = m_HFP2;
                        data.SOC_Tk2[time] = SOC_Tk2;

                        data.t_ElepS1_1[time] = t_ElepS1_1;

                        if (data.MaxTime < time)
                            data.MaxTime = time;
                    }
                }
            }
            catch (Exception ex)
            {
                strErrorMessage = $"CSV 파일 읽기 오류: {ex.Message}";
                bIsRet = false;
            }

            return bIsRet;
        }

        private static double ParseDouble(string value)
        {
            if (double.TryParse(value.Trim(), NumberStyles.Any, CultureInfo.InvariantCulture, out double result))
                return result;
            return 0.0;
        }

        public static bool ChangeResponseData(ReqSimulationData req, SimulationData data, out ResponseSimulationData res, out string strErrorMessage)
        {
            bool bIsRet = true;

            strErrorMessage = null;
            res = new ResponseSimulationData();

            res.P_Buf1.Values = data.P_Buf1;
            res.T_Buf1.Values = data.T_Buf1;

            res.T_TkM.Values = data.T_TkM;
            res.P_MBk.Values = data.P_MBk;

            if (req.D2On == 0)
                res.DeFuel_MBk.Values = data.DeFuel1_MBk;
            else
                res.DeFuel_MBk.Values = data.DeFuel2_MBk;

            res.T_TkH.Values = data.T_TkH;
            res.P_HBk.Values = data.P_HBk;

            if (req.D2On == 0)
                res.DeFuel_HBk.Values = data.DeFuel1_HBk;
            else
                res.DeFuel_HBk.Values = data.DeFuel2_HBk;

            res.m_MCp1.Values = data.m_MCp1;

            res.MaxTime = data.MaxTime;

            if (req.D2On == 0)
            {
                res.ChargePressure = data.P_Tk1_1[data.MaxTime];
                res.ChargeTemp = data.T_Tk1_1[data.MaxTime];
                res.ChargeRate = data.SOC_Tk1_1[data.MaxTime];
            }
            else
            {
                res.ChargePressure = data.P_Tk2[data.MaxTime];
                res.ChargeTemp = data.T_Tk2[data.MaxTime];
                res.ChargeRate = data.SOC_Tk2[data.MaxTime];
            }

            res.ChargeTime = data.t_ElepS1_1[data.MaxTime];


            double dMax = res.P_Buf1.GetMax();
            res.P_Buf1.Max = dMax;
            double dMin = res.P_Buf1.GetMin();
            res.P_Buf1.Min = dMin;

            dMax = res.T_Buf1.GetMax();
            res.T_Buf1.Max = dMax;
            dMin = res.T_Buf1.GetMin();
            res.T_Buf1.Min = dMin;

            dMax = res.T_TkM.GetMax();
            res.T_TkM.Max = dMax;
            dMin = res.T_TkM.GetMin();
            res.T_TkM.Min = dMin;

            dMax = res.P_MBk.GetMax();
            res.P_MBk.Max = dMax;
            dMin = res.P_MBk.GetMin();
            res.P_MBk.Min = dMin;

            dMax = res.DeFuel_MBk.GetMax();
            res.DeFuel_MBk.Max = dMax;
            dMin = res.DeFuel_MBk.GetMin();
            res.DeFuel_MBk.Min = dMin;


            dMax = res.T_TkH.GetMax();
            res.T_TkH.Max = dMax;
            dMin = res.T_TkH.GetMin();
            res.T_TkH.Min = dMin;

            dMax = res.P_HBk.GetMax();
            res.P_HBk.Max = dMax;
            dMin = res.P_HBk.GetMin();
            res.P_HBk.Min = dMin;

            dMax = res.DeFuel_HBk.GetMax();
            res.DeFuel_HBk.Max = dMax;
            dMin = res.DeFuel_HBk.GetMin();
            res.DeFuel_HBk.Min = dMin;


            dMax = res.m_MCp1.GetMax();
            res.m_MCp1.Max = dMax;
            dMin = res.m_MCp1.GetMin();
            res.m_MCp1.Min = dMin;


            return bIsRet;
        }

        public static ResponseDamageScope GetDamageScope(ReqDamageScope req)
        {
            ResponseDamageScope res = new ResponseDamageScope();

            try
            {
                // AWS 요청 전달
                string strServerURL = AWS_URL + KGS_DamageScope;

                JObject jObject = new JObject();
                jObject.Add("mode", req.mode);
                jObject.Add("node", req.node);
                jObject.Add("risk_level", req.risk_level);

                string strResult = SendQuery(null, jObject.ToString(), strServerURL, out string strErrorMessage, POST);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }


                // AWS 응답 파싱
                JObject jResults = JObject.Parse(strResult);
                string success = jResults["success"]?.ToString().Trim();
                string message = jResults["message"]?.ToString().Trim();

                string kgs_data = jResults["kgs_data"]?.ToString().Trim();

                JObject jkgs_data = JObject.Parse(kgs_data);

                if (success != "True")
                {
                    throw new ApplicationException("응답 오류 메시지: " + strErrorMessage);
                }
                else if (jkgs_data == null)
                {
                    throw new ApplicationException("kgs_data 데이터가 존재하지 않습니다.");
                }

                JObject data = (JObject)jkgs_data["result"];
                if (data == null)
                {
                    throw new ApplicationException("result 데이터가 존재하지 않습니다.");
                }

                res.node1 = ParsingDamageScope((JObject)data["Node1"], @"{""ko"": ""Node1"", ""en"": ""Node1""}");
                res.node2 = ParsingDamageScope((JObject)data["Node2"], @"{""ko"": ""Node2"", ""en"": ""Node2""}");

                res.node3_1 = ParsingDamageScope((JObject)data["Node3-1"], @"{""ko"": ""Node3-1"", ""en"": ""Node3-1""}");
                res.node3_2 = ParsingDamageScope((JObject)data["Node3-2"], @"{""ko"": ""Node3-2"", ""en"": ""Node3-2""}");
                res.node3_3 = ParsingDamageScope((JObject)data["Node3-3"], @"{""ko"": ""Node3-3"", ""en"": ""Node3-3""}");

                res.node4 = ParsingDamageScope((JObject)data["Node4"], @"{""ko"": ""Node4"", ""en"": ""Node4""}");
                res.node5 = ParsingDamageScope((JObject)data["Node5"], @"{""ko"": ""Node5"", ""en"": ""Node5""}");

                res.node6_1 = ParsingDamageScope((JObject)data["Node6-1"], @"{""ko"": ""Node6-1"", ""en"": ""Node6-1""}");
                res.node6_2 = ParsingDamageScope((JObject)data["Node6-2"], @"{""ko"": ""Node6-2"", ""en"": ""Node6-2""}");
                res.node6_3 = ParsingDamageScope((JObject)data["Node6-3"], @"{""ko"": ""Node6-3"", ""en"": ""Node6-3""}");

                res.node7 = ParsingDamageScope((JObject)data["Node7"], @"{""ko"": ""Node7"", ""en"": ""Node7""}");
                res.node8 = ParsingDamageScope((JObject)data["Node8"], @"{""ko"": ""Node8"", ""en"": ""Node8""}");
                res.node9 = ParsingDamageScope((JObject)data["Node9"], @"{""ko"": ""Node9"", ""en"": ""Node9""}");
                res.node10 = ParsingDamageScope((JObject)data["Node10"], @"{""ko"": ""Node10"", ""en"": ""Node10""}");

                res.e1 = ParsingDamageScope((JObject)data["E1"], @"{""ko"": ""중압 압축기"", ""en"": ""Medium-Pressure Compressor""}");
                res.e2 = ParsingDamageScope((JObject)data["E2"], @"{""ko"": ""고압 압축기"", ""en"": ""High-Pressure Compressor""}");

                res.e3_1 = ParsingDamageScope((JObject)data["E3-1"], @"{""ko"": ""저압탱크1"", ""en"": ""Calvera1""}");
                res.e3_2 = ParsingDamageScope((JObject)data["E3-2"], @"{""ko"": ""저압탱크2"", ""en"": ""Calvera2""}");
                res.e3_3 = ParsingDamageScope((JObject)data["E3-3"], @"{""ko"": ""저압탱크3"", ""en"": ""Calvera3""}");

                res.e4_1 = ParsingDamageScope((JObject)data["E4-1"], @"{""ko"": ""고압탱크1"", ""en"": ""Fiba1""}");
                res.e4_2 = ParsingDamageScope((JObject)data["E4-2"], @"{""ko"": ""고압탱크2"", ""en"": ""Fiba2""}");
                res.e4_3 = ParsingDamageScope((JObject)data["E4-3"], @"{""ko"": ""고압탱크3"", ""en"": ""Fiba3""}");

                res.e5 = ParsingDamageScope((JObject)data["E5"], @"{""ko"": ""냉각기"", ""en"": ""Cooler""}");

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = e.Message;
                res.Success = false;
            }

            return res;
        }

        public static DamageScope ParsingDamageScope(JObject jData, string strNodeName)
        {
            DamageScope damageScope = null;

            if (jData != null)
            {
                damageScope = new DamageScope();

                string strAmount = jData["누출량(kg/s)"]?.ToString().Trim();
                string strArea = jData["누출면적(m2)"]?.ToString().Trim();
                string strPressure = jData["압력(MPa)"]?.ToString().Trim();
                string strCrack = jData["크렉싸이즈(mm)"]?.ToString().Trim();
                string strTemperature = jData["온도(℃)"]?.ToString().Trim();

                damageScope.node = strNodeName;

                if (double.TryParse(strAmount, out double dAmount))
                {
                    damageScope.leak_amount = dAmount;
                }
                if (double.TryParse(strArea, out double dArea))
                {
                    damageScope.leak_area = dArea;
                }
                if (double.TryParse(strCrack, out double dCrack))
                {
                    damageScope.crack_size = dCrack;
                }
                if (double.TryParse(strPressure, out double dPressure))
                {
                    damageScope.pressure = dPressure;
                }
                if (double.TryParse(strTemperature, out double dTemperature))
                {
                    damageScope.temperature = dTemperature;
                }

                JObject bands = (JObject)jData["risk_bands"];
                JObject risk = bands["risk_1"] as JObject;
                if (risk != null)
                {
                    string inner_radius_m = risk["inner_radius_m"]?.ToString().Trim();
                    string outer_radius_m = risk["outer_radius_m"]?.ToString().Trim();

                    if (double.TryParse(inner_radius_m, out double inner_radius) && double.TryParse(outer_radius_m, out double outer_radius))
                    {
                        Radius radius = new Radius();
                        radius.inner_radius = inner_radius;
                        radius.outer_radius = outer_radius;

                        damageScope.risk_1 = radius;
                    }
                }

                risk = bands["risk_2"] as JObject;
                if (risk != null)
                {
                    string inner_radius_m = risk["inner_radius_m"]?.ToString().Trim();
                    string outer_radius_m = risk["outer_radius_m"]?.ToString().Trim();

                    if (double.TryParse(inner_radius_m, out double inner_radius) && double.TryParse(outer_radius_m, out double outer_radius))
                    {
                        Radius radius = new Radius();
                        radius.inner_radius = inner_radius;
                        radius.outer_radius = outer_radius;

                        damageScope.risk_2 = radius;
                    }
                }

                risk = bands["risk_3"] as JObject;
                if (risk != null)
                {
                    string inner_radius_m = risk["inner_radius_m"]?.ToString().Trim();
                    string outer_radius_m = risk["outer_radius_m"]?.ToString().Trim();

                    if (double.TryParse(inner_radius_m, out double inner_radius) && double.TryParse(outer_radius_m, out double outer_radius))
                    {
                        Radius radius = new Radius();
                        radius.inner_radius = inner_radius;
                        radius.outer_radius = outer_radius;

                        damageScope.risk_3 = radius;
                    }
                }

                risk = bands["risk_4"] as JObject;
                if (risk != null)
                {
                    string inner_radius_m = risk["inner_radius_m"]?.ToString().Trim();
                    string outer_radius_m = risk["outer_radius_m"]?.ToString().Trim();

                    if (double.TryParse(inner_radius_m, out double inner_radius) && double.TryParse(outer_radius_m, out double outer_radius))
                    {
                        Radius radius = new Radius();
                        radius.inner_radius = inner_radius;
                        radius.outer_radius = outer_radius;

                        damageScope.risk_4 = radius;
                    }
                }

                risk = bands["risk_5"] as JObject;
                if (risk != null)
                {
                    string inner_radius_m = risk["inner_radius_m"]?.ToString().Trim();
                    string outer_radius_m = risk["outer_radius_m"]?.ToString().Trim();

                    if (double.TryParse(inner_radius_m, out double inner_radius) && double.TryParse(outer_radius_m, out double outer_radius))
                    {
                        Radius radius = new Radius();
                        radius.inner_radius = inner_radius;
                        radius.outer_radius = outer_radius;

                        damageScope.risk_5 = radius;
                    }
                }
            }

            return damageScope;
        }

        public static ResponseRisk GetRiskData(ReqRisk req)
        {
            ResponseRisk res = new ResponseRisk();

            try
            {
                // AWS 요청 전달
                string strServerURL = AWS_URL + KGS_Risk;

                JObject jObject = new JObject();
                jObject.Add("mode", req.mode);
                jObject.Add("node", req.node);
                jObject.Add("risk_level", req.risk_level);
                jObject.Add("param", req.param);
                jObject.Add("deviation", req.deviation);
                jObject.Add("language", req.language);

                string strResult = SendQuery(null, jObject.ToString(), strServerURL, out string strErrorMessage, POST);
                if (strResult == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }


                // AWS 응답 파싱
                JObject jResults = JObject.Parse(strResult);
                string success = jResults["success"]?.ToString().Trim();
                string message = jResults["message"]?.ToString().Trim();
                string kgs_data = jResults["kgs_data"]?.ToString().Trim();

                JObject data = JObject.Parse(kgs_data);

                if (success != "True")
                {
                    throw new ApplicationException("응답 오류 메시지: " + strErrorMessage);
                }
                else if (data == null)
                {
                    throw new ApplicationException("kgs_data 데이터가 존재하지 않습니다.");
                }

                JObject result = (JObject)data["result"];
                if (result == null)
                {
                    throw new ApplicationException("result 데이터가 존재하지 않습니다.");
                }
                
                res.node1 = ParsingRiskInfo((JObject)result["Node1"], @"{""ko"": ""Node1"", ""en"": ""Node1""}");
                res.node2 = ParsingRiskInfo((JObject)result["Node2"], @"{""ko"": ""Node2"", ""en"": ""Node2""}");

                res.node3_1 = ParsingRiskInfo((JObject)result["Node3-1"], @"{""ko"": ""Node3-1"", ""en"": ""Node3-1""}");
                res.node3_2 = ParsingRiskInfo((JObject)result["Node3-2"], @"{""ko"": ""Node3-2"", ""en"": ""Node3-2""}");
                res.node3_3 = ParsingRiskInfo((JObject)result["Node3-3"], @"{""ko"": ""Node3-3"", ""en"": ""Node3-3""}");

                res.node4 = ParsingRiskInfo((JObject)result["Node4"], @"{""ko"": ""Node4"", ""en"": ""Node4""}");
                res.node5 = ParsingRiskInfo((JObject)result["Node5"], @"{""ko"": ""Node5"", ""en"": ""Node5""}");

                res.node6_1 = ParsingRiskInfo((JObject)result["Node6-1"], @"{""ko"": ""Node6-1"", ""en"": ""Node6-1""}");
                res.node6_2 = ParsingRiskInfo((JObject)result["Node6-2"], @"{""ko"": ""Node6-2"", ""en"": ""Node6-2""}");
                res.node6_3 = ParsingRiskInfo((JObject)result["Node6-3"], @"{""ko"": ""Node6-3"", ""en"": ""Node6-3""}");

                res.node7 = ParsingRiskInfo((JObject)result["Node7"], @"{""ko"": ""Node7"", ""en"": ""Node7""}");
                res.node8 = ParsingRiskInfo((JObject)result["Node8"], @"{""ko"": ""Node8"", ""en"": ""Node8""}");
                res.node9 = ParsingRiskInfo((JObject)result["Node9"], @"{""ko"": ""Node9"", ""en"": ""Node9""}");
                res.node10 = ParsingRiskInfo((JObject)result["Node10"], @"{""ko"": ""Node10"", ""en"": ""Node10""}");

                res.e1 = ParsingRiskInfo((JObject)result["E1"], @"{""ko"": ""중압 압축기"", ""en"": ""Medium-Pressure Compressor""}");
                res.e2 = ParsingRiskInfo((JObject)result["E2"], @"{""ko"": ""고압 압축기"", ""en"": ""High-Pressure Compressor""}");

                res.e3_1 = ParsingRiskInfo((JObject)result["E3-1"], @"{""ko"": ""저압탱크1"", ""en"": ""Calvera1""}");
                res.e3_2 = ParsingRiskInfo((JObject)result["E3-2"], @"{""ko"": ""저압탱크2"", ""en"": ""Calvera2""}");
                res.e3_3 = ParsingRiskInfo((JObject)result["E3-3"], @"{""ko"": ""저압탱크3"", ""en"": ""Calvera3""}");

                res.e4_1 = ParsingRiskInfo((JObject)result["E4-1"], @"{""ko"": ""고압탱크1"", ""en"": ""Fiba1""}");
                res.e4_2 = ParsingRiskInfo((JObject)result["E4-2"], @"{""ko"": ""고압탱크2"", ""en"": ""Fiba2""}");
                res.e4_3 = ParsingRiskInfo((JObject)result["E4-3"], @"{""ko"": ""고압탱크3"", ""en"": ""Fiba3""}");

                res.e5 = ParsingRiskInfo((JObject)result["E5"], @"{""ko"": ""냉각기"", ""en"": ""e냉각기""}");

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = e.Message;
                res.Success = false;
            }

            return res;
        }

        public static RiskInfo ParsingRiskInfo(JObject jData, string strNodeName)
        {
            RiskInfo riskInfo = null;

            if (jData != null)
            {
                riskInfo = new RiskInfo();

                JArray hazops = (JArray)jData["hazop_matches"];

                riskInfo.node = strNodeName;

                if (hazops != null && hazops.Count > 0)
                {
                    JObject hazop = (JObject)hazops[0];
                                        
                    riskInfo.nodeInfo = hazop["Node 설명"]?.ToString().Trim();
                    riskInfo.scenario_id = hazop["Scenario_ID"]?.ToString().Trim();
                    riskInfo.emergency_reference = hazop["emergency_reference"]?.ToString().Trim();
                    riskInfo.emergency_response = hazop["emergency_response"]?.ToString().Trim();
                    riskInfo.event_scenario = hazop["event_scenario"]?.ToString().Trim();
                    riskInfo.hazard_scenario = hazop["hazard_scenario"]?.ToString().Trim();

                    riskInfo.preventive_action = hazop["preventive_action"]?.ToString().Trim();
                    riskInfo.preventive_reference = hazop["preventive_reference"]?.ToString().Trim();
                    riskInfo.proc_param = hazop["공정파라미터"]?.ToString().Trim();
                    riskInfo.cause = hazop["원인"]?.ToString().Trim();
                    riskInfo.break_away = hazop["이탈"]?.ToString().Trim();
                }

                string strRisk = jData["risk"]?.ToString().Trim();
                if (int.TryParse(strRisk, out int nRisk))
                {
                    riskInfo.risk = nRisk;
                }
                else
                {
                    riskInfo.risk = 5;
                }
            }

            return riskInfo;
        }

        public ResponseRiskAssessInfo GetRiskAssessInfo(ReqRiskAssessInfo req)
        {
            ResponseRiskAssessInfo res = new ResponseRiskAssessInfo();

            try
            {
                HistoryRiskAssess historyRisk = m_hyDataManager.GetSelectManager().SelectHistoryRiskAssess(req.RiskAssessInfoID, out string strErrorMessage);
                if (historyRisk == null)
                {
                    throw new TimeoutException("SelectHistoryRiskAssess Error: " + strErrorMessage);
                }

                ETC sensor = m_dataManager.GetSelectManager().SelectETCSensor(historyRisk.SensorID, out strErrorMessage);
                if (sensor == null)
                {
                    throw new TimeoutException(historyRisk.SensorID.ToString() + " ID 센서 정보가 존재하지 않습니다 : " + strErrorMessage);
                }

                res.ID = historyRisk.ID;
                res.SensorID = historyRisk.SensorID;
                res.SensorName = sensor.Name;
                res.Parameter = historyRisk.Parameter;
                res.Deviation = historyRisk.Deviation;
                res.Cause = historyRisk.Cause;
                res.event_scenario = historyRisk.event_scenario;
                res.hazard_scenario = historyRisk.hazard_scenario;
                res.action = historyRisk.action;
                res.reference = historyRisk.reference;
                res.status = historyRisk.status;

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = e.Message;
                res.Success = false;
            }

            return res;
        }

        public static string SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";

            string strResponse = null;

            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strURL));
                request.Method = strMethodType;
                request.ContentType = "application/json; charset=utf-8";

                // 응답 시간 설정
                request.Timeout = 30000;

                if (dicHeaders != null)
                {
                    // 요청 헤더 추가
                    foreach (KeyValuePair<string, string> pair in dicHeaders)
                    {
                        string key = pair.Key;
                        string value = pair.Value;
                        request.Headers.Add(key, value);
                    }
                }

                if (strBodyJson != null && strBodyJson != "")
                {
                    StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBodyJson);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
                return null;
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return null;
            }

            strErrorMessage = SUCESS;
            return strResponse;
        }

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

    public class SimulationData
    {
        public SimulationData()
        {
            this.P_Buf1 = new Dictionary<double, double>();
            this.T_Buf1 = new Dictionary<double, double>();

            this.T_TkM = new Dictionary<double, double>();
            this.P_MBk = new Dictionary<double, double>();
            this.DeFuel1_MBk = new Dictionary<double, double>();
            this.DeFuel2_MBk = new Dictionary<double, double>();

            this.T_TkH = new Dictionary<double, double>();
            this.P_HBk = new Dictionary<double, double>();
            this.DeFuel1_HBk = new Dictionary<double, double>();
            this.DeFuel2_HBk = new Dictionary<double, double>();

            this.m_MCp1 = new Dictionary<double, double>();

            this.T_Tk1_1 = new Dictionary<double, double>();
            this.P_Tk1_1 = new Dictionary<double, double>();
            this.m_HFP1_1 = new Dictionary<double, double>();
            this.SOC_Tk1_1 = new Dictionary<double, double>();

            this.T_Tk2 = new Dictionary<double, double>();
            this.P_Tk2 = new Dictionary<double, double>();
            this.m_HFP2 = new Dictionary<double, double>();
            this.SOC_Tk2 = new Dictionary<double, double>();

            this.t_ElepS1_1 = new Dictionary<double, double>();
        }

        public double MaxTime { get; set; }       

        // 저압탱크
        public Dictionary<double, double> P_Buf1 { get; set; }
        public Dictionary<double, double> T_Buf1 { get; set; }

        // 중압탱크
        public Dictionary<double, double> T_TkM { get; set; }
        public Dictionary<double, double> P_MBk { get; set; }
        public Dictionary<double, double> DeFuel1_MBk { get; set; }
        public Dictionary<double, double> DeFuel2_MBk { get; set; }

        // 고압탱크
        public Dictionary<double, double> T_TkH { get; set; }
        public Dictionary<double, double> P_HBk { get; set; }
        public Dictionary<double, double> DeFuel1_HBk { get; set; }
        public Dictionary<double, double> DeFuel2_HBk { get; set; }

        // 압축기
        public Dictionary<double, double> m_MCp1 { get; set; }        

        // 넥소
        public Dictionary<double, double> T_Tk1_1 { get; set; }
        public Dictionary<double, double> P_Tk1_1 { get; set; }
        public Dictionary<double, double> m_HFP1_1 { get; set; }
        public Dictionary<double, double> SOC_Tk1_1 { get; set; }

        // 지게차
        public Dictionary<double, double> T_Tk2 { get; set; }
        public Dictionary<double, double> P_Tk2 { get; set; }
        public Dictionary<double, double> m_HFP2 { get; set; }
        public Dictionary<double, double> SOC_Tk2 { get; set; }

        // 충전시간
        public Dictionary<double, double> t_ElepS1_1 { get; set; }
    }
}
