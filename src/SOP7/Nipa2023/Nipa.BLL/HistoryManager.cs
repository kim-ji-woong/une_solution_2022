using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Nipa.Model.Sdms.History;
using Nipa.Model.Sop.Category;
using Nipa.Model.Sop.History;
using Nipa.Model.Sop;
using Nipa.Model.Account;
using dnsData.Sensor;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Nipa.DAL;
using System.Linq;

namespace Nipa.BLL
{
    using Models;
    using Models.Request;
    using Models.Response;
    using Models.Response.SDMS;
    using Models.Response.SOP;

    public class HistoryManager
    {
        private IDataManager m_dataManager = null;
        private JoinManager m_joinManager = null;

        public HistoryManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
            m_joinManager = new JoinManager(m_dataManager);
        }

        private List<string> InitActionStepNames(int nSiteID, out Common.DAL.DataManager commonDataManager, out SOPManager.DAL.DataManager sopDataManager, out SDMS.DAL.DataManager sdmsDataManager)
        {
            dnsDapperDBUtil.Manager.WebDBManager webDBManager = m_dataManager.GetDBManager();

            commonDataManager = new Common.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, nSiteID);
            sopDataManager = new SOPManager.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, nSiteID);
            TeamEditor.DAL.DataManager teamDataManager = new TeamEditor.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, nSiteID);
            sdmsDataManager = new SDMS.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, nSiteID);

            SOPManager.BLL.ProcessManager processManager = new SOPManager.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sdmsDataManager);
            return processManager.GetLoadManager().InitActionStepNames();
        }

        public ResponseSensorDetectHistories DisplaySensorDetectHistories(RequestSensorDetectHistories data)
        {
            string strErrorMessage = null;
            string strMaterialName = "";

            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicGasMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicAtmosphereMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEmergencyMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicThermalMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicWorkerMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicFireMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEquipmentMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();

            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicMaterials = ReadMaterials(dicGasMaterials, dicAtmosphereMaterials, dicEmergencyMaterials, dicThermalMaterials, dicWorkerMaterials, dicFireMaterials, dicEquipmentMaterials, out strErrorMessage);

            if (dicMaterials == null)
                return new ResponseSensorDetectHistories(false, strErrorMessage);

            string strFireTypeIDs = "", strPsmTypeIDs = "", strEtcTypeIDs = "", strCctvTypeIDs = "", strEquipmentMaterialIDs = "";
            SetSensorTypes(dicGasMaterials, dicAtmosphereMaterials, dicEmergencyMaterials, dicThermalMaterials, dicWorkerMaterials, dicFireMaterials, dicEquipmentMaterials, ref strFireTypeIDs, ref strPsmTypeIDs, ref strEtcTypeIDs, ref strCctvTypeIDs, ref strEquipmentMaterialIDs);

            string strCondition = string.Format("b.{0} in ({1},{2},{3},{4},{5},{6})",
                SensorReaction.Fields.ReactionType,
                (int)SensorReaction.ReactionTypes.BEGIN_STATUS,
                (int)SensorReaction.ReactionTypes.MALFUNCTION,
                (int)SensorReaction.ReactionTypes.END_STATUS,
                (int)SensorReaction.ReactionTypes.CHANGE_ALARM_DEPTH,
                (int)SensorReaction.ReactionTypes.USER_RESET,
                (int)SensorReaction.ReactionTypes.TIME_OUT);

            string strConditionSensorTypes = "";
            string strInitCondition = " and c." + SensorZone.Fields.SensorType;
            bool isPsmType = false, isEtcType = false;

            if (data.FacilityType > -1)
            {
                string strSensorTypes = GetSensorTypes(data.FacilityType, dicGasMaterials, dicAtmosphereMaterials, dicEmergencyMaterials, dicThermalMaterials, dicWorkerMaterials, dicFireMaterials, ref isPsmType, ref isEtcType);

                if (strSensorTypes.Length > 0)
                    strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, strSensorTypes);
                /*if (Facility.IsFireSensorType(Facility.ToFacilityType(data.FacilityType)))
                    strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, string.Join(",", Facility.GetFireTypeAllNumberToList()));
                else
                {
                    strMaterialName = GetMaterialName(data.FacilityType, dicMaterials);

                    if (strMaterialName == "co" || strMaterialName == "ou")
                    {
                        strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, (int)Facility.FacilityType.PSM_SENSOR);
                        isPsmType = true;
                    }
                    else if (strMaterialName == "비상벨" || strMaterialName == "ap")
                    {
                        strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, (int)Facility.FacilityType.ETC);
                        isEtcType = true;
                    }
                    else if (IsCCTVType(data.FacilityType) || strMaterialName == "화재감지" || strMaterialName == "비인가구역")
                        strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, string.Join(",", GetCCTVTypes()));
                }*/
            }
            else if (strEquipmentMaterialIDs.Length > 0)
            {
                strConditionSensorTypes = string.Format("{0} not in ({1})", strInitCondition, strEquipmentMaterialIDs);
            }

            DateTime beginTime = Convert.ToDateTime(data.BeginTime);
            DateTime endTime = Convert.ToDateTime(data.EndTime);

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(" And b.{0} in (", SensorReaction.Fields.SensorZoneHistoryID);

            if (data.RowCount > 0)
                sb.AppendFormat("Select TOP({0}) szh.ID ", data.RowCount);
            else
                sb.AppendFormat("Select szh.ID", data.RowCount);

            sb.AppendFormat("        From {0} as szh ", SensorZone.TableName);
            sb.AppendFormat("       INNER join {0} as z on szh.ZoneID=z.ID", Nipa.Model.Sdms.Spatial.Zone.TableName);
            sb.AppendFormat(" Where {0} >= '{1}' And {0} <= '{2}'",
                SensorZone.Fields.Time, beginTime.ToString("yyyy-MM-dd HH:mm:ss"), endTime.ToString("yyyy-MM-dd HH:mm:ss"));

            if (data.LastSensorZoneHistoryID > 0)
            {
                if (data.IsDesc)
                    sb.AppendFormat(" And sz.ID < {0}", data.LastSensorZoneHistoryID);
                else
                    sb.AppendFormat(" And sz.ID > {0}", data.LastSensorZoneHistoryID);
            }
            if (strConditionSensorTypes.Length > 0)
                sb.Append(strConditionSensorTypes);

            if (data.BuildingGroupID > 0 || data.BuildingID > 0 || data.ZoneID > 0)
            {
                if (data.ZoneID > 0)
                    sb.AppendFormat(" And z.ID = {0}", data.ZoneID);
                else
                {
                    if (data.BuildingID > 0)
                    {
                        sb.AppendFormat(" And z.BuildingID = {0}", data.BuildingID);
                    }
                    else if (data.BuildingGroupID > 0)
                    {
                        sb.AppendFormat(" And z.BuildingID in (Select ID From SdmsSpatialBuilding Where BuildingGroupID = {0})", data.BuildingGroupID);
                    }
                }
            }

            if (data.CampusID > 0)
            {
                sb.AppendFormat(" And szh.SiteID = {0}", data.CampusID);
            }

            if (data.RowCount > 0)
            {
                sb.Append(" Order By szh.ID ");
                if (!data.IsDesc)
                    sb.Append(" Asc");
                else
                    sb.Append(" Desc");
            }
            sb.Append(" ) ");
            sb.AppendFormat(" Order By d.{0} ", SensorZone.Fields.ID);

            if (!data.IsDesc)
                sb.Append(" Asc");
            else
                sb.Append(" Desc");

            strCondition += sb.ToString();

            ArrayList arrResult = m_joinManager.JoinEquipmentZoneSensorReactionHistorySensorZoneSensorZoneHistoryZone(strCondition, out strErrorMessage);
            if (arrResult == null)
                return new ResponseSensorDetectHistories(false, strErrorMessage);

            ResponseSensorDetectHistories res = new ResponseSensorDetectHistories(true, "");

            if (arrResult.Count == 0)
                return res;

            Dictionary<int, Nipa.Model.Sdms.Sensor.PSM> dicPsmSensors = null;
            Dictionary<int, Nipa.Model.Sdms.Sensor.ETC> dicEtcSensors = null;

            if (isPsmType)
            {
                dicPsmSensors = ReadPsmSensors(out strErrorMessage);

                if (dicPsmSensors == null)
                    return new ResponseSensorDetectHistories(false, strErrorMessage);
            }
            else if (isEtcType)
            {
                dicEtcSensors = ReadEtcSensors(out strErrorMessage);

                if (dicEtcSensors == null)
                    return new ResponseSensorDetectHistories(false, strErrorMessage);
            }

            Common.DAL.DataManager commonDataManager;
            SOPManager.DAL.DataManager sopDataManager;
            SDMS.DAL.DataManager sdmsDataManager;
            List<string> strActionStepNames = InitActionStepNames(data.CampusID, out commonDataManager, out sopDataManager, out sdmsDataManager);
            List<SensorDetectHistoryData> datas = new List<SensorDetectHistoryData>();

            // 각 알람이 어떻게 종료되었는지 (50:상황종료/21:오작동/64:user reset)
            Dictionary<int, SensorZoneKey> endTypes2 = new Dictionary<int, SensorZoneKey>();

            Dictionary<int, string> dicEndTimes = new Dictionary<int, string>();
            Dictionary<int, SensorDetectHistoryData> dicHistoryDatas = new Dictionary<int, SensorDetectHistoryData>();
            List<int> allSensorZoneIDs = new List<int>();

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount; i += 5)
            {
                if (arrResult[i] is Nipa.Model.Sdms.Spatial.EquipmentZone &&
                    arrResult[i + 1] is SensorReaction &&
                    arrResult[i + 2] is Nipa.Model.Sdms.Sensor.SensorZone &&
                    arrResult[i + 3] is SensorZone &&
                    arrResult[i + 4] is Nipa.Model.Sdms.Spatial.Zone)
                {
                    SensorDetectHistoryData _data = new SensorDetectHistoryData();

                    Nipa.Model.Sdms.Spatial.EquipmentZone eq = arrResult[i] as Nipa.Model.Sdms.Spatial.EquipmentZone;
                    SensorReaction srh = arrResult[i + 1] as SensorReaction;
                    Nipa.Model.Sdms.Sensor.SensorZone sz = arrResult[i + 2] as Nipa.Model.Sdms.Sensor.SensorZone;
                    SensorZone szh = arrResult[i + 3] as SensorZone;
                    Nipa.Model.Sdms.Spatial.Zone zone = arrResult[i + 4] as Nipa.Model.Sdms.Spatial.Zone;
                    
                    /*if (IsValidSensorZone(strMaterialName, sz.OrgSensorID, isPsmType, isEtcType, dicPsmSensors, dicEtcSensors, dicMaterials) == false)
                        continue;*/

                    List<int> _allSensorZoneIDs = StringToIntList(szh.AllSensorZoneIDs);
                    allSensorZoneIDs.AddRange(_allSensorZoneIDs);

                    int sensorZoneID;
                    int.TryParse(srh.Param2, out sensorZoneID);
                    int isAlarm;
                    int.TryParse(srh.Param4, out isAlarm);

                    if (srh.ReactionType == (int)SensorReaction.ReactionTypes.MALFUNCTION ||
                        srh.ReactionType == (int)SensorReaction.ReactionTypes.END_STATUS ||
                        srh.ReactionType == (int)SensorReaction.ReactionTypes.USER_RESET ||
                        srh.ReactionType == (int)SensorReaction.ReactionTypes.TIME_OUT ||
                        (srh.ReactionType == (int)SensorReaction.ReactionTypes.CHANGE_ALARM_DEPTH && isAlarm == 0))
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

                        if (key.ReactionType != SensorReaction.ReactionTypes.END_STATUS)
                        {
                            if (srh.ReactionType == (int)SensorReaction.ReactionTypes.CHANGE_ALARM_DEPTH)
                                key.ReactionType = SensorReaction.ReactionTypes.END_STATUS;
                            else
                                key.ReactionType = (SensorReaction.ReactionTypes)srh.ReactionType;
                        }

                        SensorDetectHistoryData historyData;

                        if ((key.ReactionType == SensorReaction.ReactionTypes.END_STATUS ||
                            key.ReactionType == SensorReaction.ReactionTypes.MALFUNCTION ||
                            key.ReactionType == SensorReaction.ReactionTypes.USER_RESET ||
                            key.ReactionType == SensorReaction.ReactionTypes.TIME_OUT))
                        {
                            if (dicHistoryDatas.TryGetValue(srh.SensorZoneHistoryID, out historyData))
                                historyData.EndTime = srh.Time.ToString("yyyy-MM-dd HH:mm:ss");
                            else
                                dicEndTimes[srh.SensorZoneHistoryID] = srh.Time.ToString("yyyy-MM-dd HH:mm:ss");
                        }

                        continue;
                    }

                    if (data.RowCount > 0 && datas.Count == data.RowCount) // 바인딩할 개수만큼만 담는다
                        continue;

                    res.LastSensorReactionHistoryID = (res.LastSensorReactionHistoryID == -1) ? szh.ID : Math.Min(res.LastSensorReactionHistoryID, szh.ID);

                    if (srh.ReactionType == (int)SensorReaction.ReactionTypes.BEGIN_STATUS)
                    {
                        _data.SensorZoneHistoryID = szh.ID;
                        _data.ReactionType = (int)srh.ReactionType;
                        _data.Time = srh.Time.ToString("yyyy-MM-dd HH:mm:ss");
                        //_data.Type = Facility.GetNFacilityTypeString(szh.SensorType);
                        _data.ZoneName = eq.DisplayText;
                        _data.RealMode = (szh.DetectionStatus == (int)SensorZone.DetectionType.Real) ? "1" : "0";
                        _data.DetectType = (sz.ID >= dnsSopID.Header.ManualReportDefaultID) ? "수동 신고" : "센서 감지";
                        _data.DetectInfo = "-";
                        _data.AllSensorZoneIDs = _allSensorZoneIDs;
                        _data.SensorZoneID = sensorZoneID;
                        _data.Memo = szh.Memo;

                        if (sz.OrgSensorID != null)
                        {
                            int nFacilityType = GetFacilityType(sz.SensorType, (int)sz.OrgSensorID, ref dicPsmSensors, ref dicEtcSensors);
                            _data.Type = SensorManager.GetSensorTypeName(nFacilityType, dicMaterials);
                        }

                        string strEndTime;

                        if (dicEndTimes.TryGetValue(szh.ID, out strEndTime))
                            _data.EndTime = strEndTime;

                        if (srh.Param5 == "1" && strActionStepNames.Count > 0)
                            _data.AlarmLevel = strActionStepNames[0];
                        else if (srh.Param5 == "2" && strActionStepNames.Count > 1)
                            _data.AlarmLevel = strActionStepNames[1];
                        else if (srh.Param5 == "3" && strActionStepNames.Count > 2)
                            _data.AlarmLevel = strActionStepNames[2];
                        else if (srh.Param5 == "4" && strActionStepNames.Count > 3)
                            _data.AlarmLevel = strActionStepNames[3];

                        datas.Add(_data);
                        dicHistoryDatas[_data.SensorZoneHistoryID] = _data;
                    }
                }
            }

            #region 알람 종료 방식 지정
            foreach (SensorDetectHistoryData _data in datas)
            {
                SensorZoneKey key;
                if (endTypes2.TryGetValue(_data.SensorZoneHistoryID, out key))
                {
                    switch (key.ReactionType)
                    {
                        case SensorReaction.ReactionTypes.END_STATUS:
                            _data.DetectInfo = "현장 종료";
                            break;
                        case SensorReaction.ReactionTypes.MALFUNCTION:
                            _data.DetectInfo = "오작동 처리";
                            break;
                        case SensorReaction.ReactionTypes.USER_RESET:
                            _data.DetectInfo = "사용자 종료";
                            break;
                        case SensorReaction.ReactionTypes.TIME_OUT:
                            _data.DetectInfo = "자동 종료";
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
                ArrayList arrResult2 = commonDataManager.GetSelectManager().JoinActionStepHistoryActionStep(null, null, strCondition, out strErrorMessage);
                if (arrResult2 == null)
                    return null;

                int nResultCount2 = arrResult2.Count;
                for (int i = 0; i < nResultCount2; i += 2)
                {
                    if (arrResult2[i] is Common.Model.History.ActionStepHistory && arrResult2[i + 1] is SOPManager.Model.Sop.Category.ActionStep)
                    {
                        Common.Model.History.ActionStepHistory history = arrResult2[i] as Common.Model.History.ActionStepHistory;
                        SOPManager.Model.Sop.Category.ActionStep actionStep = arrResult2[i + 1] as SOPManager.Model.Sop.Category.ActionStep;

                        for (int j = 0; j < datas.Count; j++)
                        {
                            if (history.SensorZoneHistoryID == datas[j].SensorZoneHistoryID)
                            {
                                datas[j].SopBeginTime = history.BeginTime.ToString("yyyy-MM-dd HH:mm:ss");
                                datas[j].SopEndTime = (history.EndTime == null) ? "-" : ((DateTime)history.EndTime).ToString("yyyy-MM-dd HH:mm:ss");

                                ArrayList arrResult3 = sopDataManager.GetSelectManager().JoinDisasterCategorySubDisasterCategoryDisasterActionStep(actionStep.ID, out strErrorMessage);
                                if (arrResult3 == null)
                                    return null;

                                if (arrResult3[0] is SOPManager.Model.Sop.Category.DisasterCategory && arrResult3[1] is SOPManager.Model.Sop.Category.SubDisasterCategory && arrResult3[2] is SOPManager.Model.Sop.Category.Disaster && arrResult3[3] is SOPManager.Model.Sop.Category.ActionStep)
                                {
                                    SOPManager.Model.Sop.Category.DisasterCategory a = arrResult3[0] as SOPManager.Model.Sop.Category.DisasterCategory;
                                    SOPManager.Model.Sop.Category.SubDisasterCategory b = arrResult3[1] as SOPManager.Model.Sop.Category.SubDisasterCategory;
                                    SOPManager.Model.Sop.Category.Disaster c = arrResult3[2] as SOPManager.Model.Sop.Category.Disaster;
                                    SOPManager.Model.Sop.Category.ActionStep d = arrResult3[3] as SOPManager.Model.Sop.Category.ActionStep;

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
                arrResult = m_joinManager.JoinSensorZoneSensors(null, strFireTypeIDs, strPsmTypeIDs, strEtcTypeIDs, strCctvTypeIDs, out strErrorMessage);
                //arrResult = sdmsDataManager.GetSelectManager().JoinSensorZoneSensors(null, strCondition, out strErrorMessage);
                if (arrResult == null)
                    return null;

                int resultCount = arrResult.Count;
                Dictionary<int, string> dicSensorZoneNames = new Dictionary<int, string>();

                for (int i = 0; i < resultCount-3; i += 4)
                {
                    if (arrResult[i] is int && arrResult[i + 1] is int && arrResult[i + 3] is string)
                    {
                        int nSensorZoneID = (int)arrResult[i];
                        int nSensorType = (int)arrResult[i + 1];
                        string strSensorName = arrResult[i + 3].ToString();

                        dicSensorZoneNames[nSensorZoneID] = strSensorName;
                    }
                }

                if (resultCount > 0)
                {
                    string strSensorName;

                    for (int j = 0; j < datas.Count; j++)
                    {
                        if (dicSensorZoneNames.TryGetValue(datas[j].SensorZoneID, out strSensorName))
                            datas[j].SensorName = strSensorName;
                        /*for (int i = 0; i < resultCount; i += 3)
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
                        }*/
                    }
                }
            }
            #endregion

            res.SensorDetectHistoryDatas = datas.OrderByDescending(p => p.Time).ThenByDescending(p => p.SensorZoneHistoryID).ToList();

            return res;
        }

        private void SetSensorTypes(Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicGasMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicAtmosphereMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEmergencyMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicThermalMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicWorkerMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicFireMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEquipmentMaterials, ref string strFireTypeIDs, ref string strPsmTypeIDs, ref string strEtcTypeIDs, ref string strCctvTypeIDs, ref string strEquipmentMaterialIDs)
        {
            strFireTypeIDs = GetSensorTypes(dicFireMaterials);
            strCctvTypeIDs = GetSensorTypes(dicThermalMaterials);
            strPsmTypeIDs = GetSensorTypes(dicGasMaterials);
            string strPsmType2 = GetSensorTypes(dicAtmosphereMaterials);

            if (strPsmType2.Length > 0)
            {
                if (strPsmTypeIDs.Length > 0)
                    strPsmTypeIDs += "," + strPsmType2;
                else
                    strPsmTypeIDs = strPsmType2;
            }

            strEtcTypeIDs = GetSensorTypes(dicEmergencyMaterials);
            string strEtcType2 = GetSensorTypes(dicWorkerMaterials);

            if (strEtcType2.Length > 0)
            {
                if (strEtcTypeIDs.Length > 0)
                    strEtcTypeIDs += "," + strEtcType2;
                else
                    strEtcTypeIDs = strEtcType2;
            }

            strEquipmentMaterialIDs = GetSensorTypes(dicEquipmentMaterials);
        }

        private string GetSensorTypes(int nFacilityType, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicGasMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicAtmosphereMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEmergencyMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicThermalMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicWorkerMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicFireMaterials, ref bool isPsmType, ref bool isEtcType)
        {
            if (dicGasMaterials.ContainsKey(nFacilityType))
            {
                isPsmType = true;
                return GetSensorTypes(dicGasMaterials);
            }

            if (dicAtmosphereMaterials.ContainsKey(nFacilityType))
            {
                isPsmType = true;
                return GetSensorTypes(dicAtmosphereMaterials);
            }

            if (dicEmergencyMaterials.ContainsKey(nFacilityType))
            {
                isEtcType = true;
                return GetSensorTypes(dicEmergencyMaterials);
            }

            if (dicThermalMaterials.ContainsKey(nFacilityType))
                return GetSensorTypes(dicThermalMaterials);

            if (dicWorkerMaterials.ContainsKey(nFacilityType))
            {
                isEtcType = true;
                return GetSensorTypes(dicWorkerMaterials);
            }

            if (dicFireMaterials.ContainsKey(nFacilityType))
                return GetSensorTypes(dicFireMaterials);

            return "";
        }

        private string GetSensorTypes(Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicMaterials)
        {
            string strSensorTypes = "";

            foreach (var material in dicMaterials.Values)
            {
                if (strSensorTypes.Length == 0)
                    strSensorTypes = material.ID.ToString();
                else
                    strSensorTypes += "," + material.ID.ToString();
            }

            return strSensorTypes;
        }

        private bool IsValidSensorZone(string strMaterialName, int? orgSensorID, bool isPsmType, bool isEtcType, Dictionary<int, Nipa.Model.Sdms.Sensor.PSM> dicPsmSensors, Dictionary<int, Nipa.Model.Sdms.Sensor.ETC> dicEtcSensors, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicMaterials)
        {
            if (isPsmType)
            {
                Nipa.Model.Sdms.Sensor.PSM sensor;

                if (orgSensorID != null && dicPsmSensors != null && dicPsmSensors.TryGetValue((int)orgSensorID, out sensor))
                {
                    if (strMaterialName == "co")
                    {
                        Nipa.Model.Sdms.Sensor.Material material;

                        if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                        {
                            string sensorMaterialName = material.MaterialName.ToLower();

                            if (sensorMaterialName == "co" ||
                                sensorMaterialName == "h2s" ||
                                sensorMaterialName == "o2" ||
                                sensorMaterialName == "ch4" ||
                                sensorMaterialName == "co2")
                                return true;
                        }
                    }
                    else if (strMaterialName == "ou")
                    {
                        Nipa.Model.Sdms.Sensor.Material material;

                        if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                        {
                            string sensorMaterialName = material.MaterialName.ToLower();

                            if (sensorMaterialName == "ou" ||
                                sensorMaterialName == "미세먼지(pm 1.0)" ||
                                sensorMaterialName == "미세먼지(pm 2.5)" ||
                                sensorMaterialName == "미세먼지(pm 10)" ||
                                sensorMaterialName == "voc" ||
                                sensorMaterialName.StartsWith("휘발성"))
                                return true;
                        }
                    }
                }
            }
            else if (isEtcType)
            {
                Nipa.Model.Sdms.Sensor.ETC sensor;

                if (orgSensorID != null && dicEtcSensors != null && dicEtcSensors.TryGetValue((int)orgSensorID, out sensor))
                {
                    if (strMaterialName == "비상벨")
                    {
                        Nipa.Model.Sdms.Sensor.Material material;

                        if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                        {
                            string sensorMaterialName = material.MaterialName.ToLower();

                            if (sensorMaterialName == "비상벨")
                                return true;
                        }
                    }
                    else if (strMaterialName == "ap")
                    {
                        Nipa.Model.Sdms.Sensor.Material material;

                        if (sensor.MaterialType != null && dicMaterials.TryGetValue((int)sensor.MaterialType, out material))
                        {
                            string sensorMaterialName = material.MaterialName.ToLower();

                            if (sensorMaterialName.StartsWith("작업자"))
                                return true;
                        }
                    }
                }
            }
            else
                return true;

            return false;
        }

        private Dictionary<int, Nipa.Model.Sdms.Sensor.Material> ReadMaterials(Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicGasMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicAtmosphereMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEmergencyMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicThermalMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicWorkerMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicFireMaterials, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEquipmentMaterials, out string strErrorMessage)
        {
            IEnumerable<Nipa.Model.Sdms.Sensor.Material> materials = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.Sensor.Material>(null, out strErrorMessage);

            if (materials == null)
                return null;

            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();

            foreach (Nipa.Model.Sdms.Sensor.Material material in materials)
            {
                dicMaterials[material.ID] = material;

                string strMaterialName = material.MaterialName.ToLower();

                if (strMaterialName == "co2" ||
                    strMaterialName == "co" ||
                    strMaterialName == "o2" ||
                    strMaterialName == "h2s" ||
                    strMaterialName == "ch4")
                {
                    dicGasMaterials[material.ID] = material;
                }
                else if (strMaterialName.StartsWith("미세먼지") ||
                    strMaterialName.StartsWith("휘발성") ||
                    strMaterialName == "ou")
                {
                    dicAtmosphereMaterials[material.ID] = material;
                }
                else if (strMaterialName == "비상벨")
                {
                    dicEmergencyMaterials[material.ID] = material;
                }
                else if (strMaterialName == "화재감지" ||
                    strMaterialName == "비인가구역" ||
                    strMaterialName == "cctv")
                {
                    dicThermalMaterials[material.ID] = material;
                }
                else if (strMaterialName.StartsWith("작업자") ||
                    strMaterialName == "ap" ||
                    strMaterialName == "배터리 교체")
                {
                    dicWorkerMaterials[material.ID] = material;
                }
                else if (strMaterialName == "화재")
                {
                    dicFireMaterials[material.ID] = material;
                }
                else if (strMaterialName == "사출설비")
                {
                    dicEquipmentMaterials[material.ID] = material;
                }
            }

            return dicMaterials;
        }

        private Dictionary<int, Nipa.Model.Sdms.Sensor.PSM> ReadPsmSensors(out string strErrorMessage)
        {
            IEnumerable<Nipa.Model.Sdms.Sensor.PSM> sensors = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.Sensor.PSM>(null, out strErrorMessage);

            if (sensors == null)
                return null;

            Dictionary<int, Nipa.Model.Sdms.Sensor.PSM> dicSensors = new Dictionary<int, Model.Sdms.Sensor.PSM>();

            foreach (Nipa.Model.Sdms.Sensor.PSM sensor in sensors)
            {
                dicSensors[sensor.ID] = sensor;
            }

            return dicSensors;
        }

        private Dictionary<int, Nipa.Model.Sdms.Sensor.ETC> ReadEtcSensors(out string strErrorMessage)
        {
            IEnumerable<Nipa.Model.Sdms.Sensor.ETC> sensors = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.Sensor.ETC>(null, out strErrorMessage);

            if (sensors == null)
                return null;

            Dictionary<int, Nipa.Model.Sdms.Sensor.ETC> dicSensors = new Dictionary<int, Model.Sdms.Sensor.ETC>();

            foreach (Nipa.Model.Sdms.Sensor.ETC sensor in sensors)
            {
                dicSensors[sensor.ID] = sensor;
            }

            return dicSensors;
        }

        private string GetMaterialName(int facilityTypeID, Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicMaterials)
        {
            Nipa.Model.Sdms.Sensor.Material material;

            if (dicMaterials.TryGetValue(facilityTypeID, out material))
                return material.MaterialName.ToLower();

            return "";
        }

        public MessageResult UpdateSensorDetectHistoryMemo(UpdateSensorDetectHistoryMemo data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", SensorZone.Fields.ID, data.SensorZoneHistoryID);
            SensorZone sensorZoneHistory = m_dataManager.GetSelect().SelectFirst<SensorZone>(strCondition, out strErrorMessage);

            if (sensorZoneHistory == null)
            {
                if (strErrorMessage != null)
                    return new MessageResult(false, strErrorMessage);
                else
                    return new MessageResult(false, "시스템 데이터베이스로부터 알람정보를 찾을수 없습니다.");
            }

            sensorZoneHistory.Memo = data.Memo;

            if (m_dataManager.GetUpdate().Update<SensorZone>(sensorZoneHistory, null, out strErrorMessage))
                return new MessageResult(true, "");

            return new MessageResult(false, strErrorMessage);
        }

        private List<int> StringToIntList(string str)
        {
            string[] tokens = str.Split(',');
            List<int> datas = new List<int>();

            foreach (string strToken in tokens)
            {
                int data;

                if (int.TryParse(strToken.Trim(), out data))
                    datas.Add(data);
            }

            return datas;
        }

        private bool IsCCTVType(int facilityType)
        {
            if (facilityType == (int)Facility.FacilityType.CCTV ||
                facilityType == (int)Facility.FacilityType.SicFire ||
                facilityType == (int)Facility.FacilityType.SicTemp ||
                facilityType == (int)Facility.FacilityType.SicIntrusion)
                return true;

            return false;
        }

        private string GetCCTVTypes()
        {
            string strTypes = ((int)Facility.FacilityType.CCTV).ToString();
            strTypes += "," + ((int)Facility.FacilityType.SicFire).ToString();
            strTypes += "," + ((int)Facility.FacilityType.SicTemp).ToString();
            strTypes += "," + ((int)Facility.FacilityType.SicIntrusion).ToString();

            return strTypes;
        }

        public ResponseSensorDetectAnalysis DisplaySensorDetectAnalysis(RequestSensorDetectAnalysis data)
        {
            string strErrorMessage = null;
            string strReactionTypes = string.Format("{0},{1},{2},{3},{4}",
                (int)SensorReaction.ReactionTypes.BEGIN_STATUS,
                (int)SensorReaction.ReactionTypes.MALFUNCTION,
                (int)SensorReaction.ReactionTypes.END_STATUS,
                (int)SensorReaction.ReactionTypes.USER_RESET,
                (int)SensorReaction.ReactionTypes.TIME_OUT);

            string strCondition = string.Format(" a.{0} >= '{1}' And a.{0} <= '{2}' And a.{3} < {4} And b.{5} in ({6})"
                , SensorZone.Fields.Time
                , data.BeginTime, data.EndTime
                , SensorZone.Fields.SensorZoneID, dnsSopID.Header.ManualReportDefaultID
                , SensorReaction.Fields.ReactionType, strReactionTypes);

            string strMaterialName = "";
            bool isPsmType = false, isEtcType = false;

            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicGasMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicAtmosphereMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEmergencyMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicThermalMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicWorkerMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicFireMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();
            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicEquipmentMaterials = new Dictionary<int, Model.Sdms.Sensor.Material>();

            Dictionary<int, Nipa.Model.Sdms.Sensor.Material> dicMaterials = ReadMaterials(dicGasMaterials, dicAtmosphereMaterials, dicEmergencyMaterials, dicThermalMaterials, dicWorkerMaterials, dicFireMaterials, dicEquipmentMaterials, out strErrorMessage);

            string strFireTypeIDs = "", strPsmTypeIDs = "", strEtcTypeIDs = "", strCctvTypeIDs = "", strEquipmentMaterialIDs = "";
            SetSensorTypes(dicGasMaterials, dicAtmosphereMaterials, dicEmergencyMaterials, dicThermalMaterials, dicWorkerMaterials, dicFireMaterials, dicEquipmentMaterials, ref strFireTypeIDs, ref strPsmTypeIDs, ref strEtcTypeIDs, ref strCctvTypeIDs, ref strEquipmentMaterialIDs);

            if (data.FacilityType > -1)
            {
                string strConditionSensorTypes = "";
                string strInitCondition = " and a." + SensorZone.Fields.SensorType;

                string strSensorTypes = GetSensorTypes(data.FacilityType, dicGasMaterials, dicAtmosphereMaterials, dicEmergencyMaterials, dicThermalMaterials, dicWorkerMaterials, dicFireMaterials, ref isPsmType, ref isEtcType);

                if (strSensorTypes.Length > 0)
                    strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, strSensorTypes);

                /*if (Facility.IsFireSensorType(Facility.ToFacilityType(data.FacilityType)))
                    strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, strFireTypeIDs);
                else
                {
                    strMaterialName = GetMaterialName(data.FacilityType, dicMaterials);

                    if (strMaterialName == "co" || strMaterialName == "ou")
                    {
                        strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, strPsmTypeIDs);
                        isPsmType = true;
                    }
                    else if (strMaterialName == "비상벨" || strMaterialName == "ap")
                    {
                        strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, strEtcTypeIDs);
                        isEtcType = true;
                    }
                    else if (IsCCTVType(data.FacilityType) || strMaterialName == "화재감지" || strMaterialName == "비인가구역")
                        strConditionSensorTypes = string.Format("{0} in ({1})", strInitCondition, strCctvTypeIDs);
                }*/

                if (strConditionSensorTypes.Length > 0)
                    strCondition += strConditionSensorTypes;
            }
            else if (strEquipmentMaterialIDs.Length > 0)
            {
                strCondition += string.Format(" and a.{0} not in ({1})", SensorZone.Fields.SensorType, strEquipmentMaterialIDs);
            }

            if (data.BuildingGroupID > 0 || data.BuildingID > 0 || data.ZoneID > 0)
            {
                string strConditionZone = "";

                if (data.ZoneID > 0)
                {
                    strConditionZone = string.Format(" And a.{0} = {1}", SensorZone.Fields.ZoneID, data.ZoneID);
                }
                else
                {
                    if (data.BuildingID > 0)
                    {
                        strConditionZone = string.Format(" And a.{0} in (select {1} from {2} Where {3} = {4})"
                            , SensorZone.Fields.ZoneID, Nipa.Model.Sdms.Spatial.Zone.Fields.ID, Nipa.Model.Sdms.Spatial.Zone.TableName, Nipa.Model.Sdms.Spatial.Zone.Fields.BuildingID, data.BuildingID);
                    }
                    else if (data.BuildingGroupID > 0)
                    {
                        strConditionZone = string.Format(" And a.{0} in (select {1} from {2} Where {3} in (Select {4} From {5} Where {6} = {7}))"
                            , SensorZone.Fields.ZoneID, Nipa.Model.Sdms.Spatial.Zone.Fields.ID,
                            Nipa.Model.Sdms.Spatial.Zone.TableName, Nipa.Model.Sdms.Spatial.Zone.Fields.BuildingID,
                            Nipa.Model.Sdms.Spatial.Building.Fields.ID, Nipa.Model.Sdms.Spatial.Building.TableName,
                            Nipa.Model.Sdms.Spatial.Building.Fields.BuildingGroupID, data.BuildingGroupID);
                    }
                }

                strCondition += strConditionZone;
            }

            if (data.CampusID > 0)
            {
                strCondition += string.Format(" And a.{0} = {1}", SensorZone.Fields.SiteID, data.CampusID);
            }

            ArrayList arrResult = m_joinManager.JoinSensorZoneHistorySensorReactionHistory(strCondition, out strErrorMessage);
            if (arrResult == null)
                return null;

            Dictionary<int, Nipa.Model.Sdms.Sensor.PSM> dicPsmSensors = null;
            Dictionary<int, Nipa.Model.Sdms.Sensor.ETC> dicEtcSensors = null;

            Dictionary<int, SensorDetectAnalysisData> dicDatas = new Dictionary<int, SensorDetectAnalysisData>();

            int allDetectCount = 0;
            int allMalfunctionCount = 0;

            int resultCount = arrResult.Count;
            for (int i = 0; i < resultCount; i += 2)
            {
                if ((arrResult[i] is SensorZone) == false || (arrResult[i + 1] is SensorReaction) == false)
                    continue;

                SensorZone szh = arrResult[i] as SensorZone;
                SensorReaction srh = arrResult[i + 1] as SensorReaction;

                foreach (int sensorZoneID in StringToIntList(szh.AllSensorZoneIDs))
                {
                    SensorDetectAnalysisData _data;

                    if (dicDatas.TryGetValue(sensorZoneID, out _data))
                    {
                        _data = dicDatas[sensorZoneID];
                    }
                    else
                    {
                        _data = new SensorDetectAnalysisData();
                        _data.SensorZoneHistoryID = szh.ID;
                        _data.SensorZoneID = sensorZoneID;
                        _data.ZoneID = szh.ZoneID;
                        //_data.Type = SensorManager.GetSensorTypeName(szh.SensorType, dicMaterials);//Facility.GetNFacilityTypeString(szh.SensorType);

                        dicDatas.Add(sensorZoneID, _data);
                    }

                    if (srh.ReactionType == (int)SensorReaction.ReactionTypes.BEGIN_STATUS)
                    {
                        _data.DetectCount++;
                        allDetectCount++;
                    }
                    else if (srh.ReactionType == (int)SensorReaction.ReactionTypes.END_STATUS)
                        _data.EndCount++;
                    else if (srh.ReactionType == (int)SensorReaction.ReactionTypes.USER_RESET)
                        _data.UserResetCount++;
                    else if (srh.ReactionType == (int)SensorReaction.ReactionTypes.MALFUNCTION)
                    {
                        _data.MalfunctionCount++;
                        allMalfunctionCount++;
                    }
                    else if (srh.ReactionType == (int)SensorReaction.ReactionTypes.TIME_OUT)
                        _data.TimeoutCount++;
                }
            }

            ResponseSensorDetectAnalysis res = new ResponseSensorDetectAnalysis(true, "");

            if (data.BuildingGroupID > 0)
            {
                string strCondition1 = string.Format("{0} = {1}", Nipa.Model.Sdms.Spatial.BuildingGroup.Fields.ID, data.BuildingGroupID);
                Nipa.Model.Sdms.Spatial.BuildingGroup group = m_dataManager.GetSelect().SelectFirst<Nipa.Model.Sdms.Spatial.BuildingGroup>(strCondition1, out strErrorMessage);

                if (group == null)
                    return new ResponseSensorDetectAnalysis(false, strErrorMessage);

                res.SearchZoneName = group.DisplayText;

                if (data.BuildingID > 0)
                {
                    strCondition1 = string.Format("{0} = {1}", Nipa.Model.Sdms.Spatial.Building.Fields.ID, data.BuildingID);
                    Nipa.Model.Sdms.Spatial.Building building = m_dataManager.GetSelect().SelectFirst<Nipa.Model.Sdms.Spatial.Building>(strCondition1, out strErrorMessage);
                    res.SearchZoneName += " " + building.DisplayText;

                    if (data.ZoneID > 0)
                    {
                        strCondition1 = string.Format("{0} = {1}", Nipa.Model.Sdms.Spatial.Zone.Fields.ID, data.ZoneID);
                        Nipa.Model.Sdms.Spatial.Zone zone = m_dataManager.GetSelect().SelectFirst<Nipa.Model.Sdms.Spatial.Zone>(strCondition1, out strErrorMessage);
                        res.SearchZoneName += " " + zone.DisplayText;
                    }
                }
            }
            else
                res.SearchZoneName = "전체";

            ArrayList sensorNameResult = m_joinManager.JoinSensorZoneSensors("", strFireTypeIDs, strPsmTypeIDs, strEtcTypeIDs, strCctvTypeIDs, out strErrorMessage);
            if (sensorNameResult == null)
                return null;

            ArrayList zoneResult = m_joinManager.JoinBuildingGroupBuildingZone("", out strErrorMessage);
            if (zoneResult == null)
                return null;

            int sensorNameResultCount = sensorNameResult.Count;
            Dictionary<int, ArrayList> dicSensorZoneDatas = new Dictionary<int, ArrayList>();

            for (int i = 0; i < sensorNameResultCount; i += 4)
            {
                if (sensorNameResult[i] is int && sensorNameResult[i + 1] is int && sensorNameResult[i + 2] is int && sensorNameResult[i + 3] is string)
                {
                    int nSensorZoneID = (int)sensorNameResult[i];
                    int nSensorType = (int)sensorNameResult[i + 1];
                    int? orgSensorID = (int?)sensorNameResult[i + 2];
                    string strSensorName = sensorNameResult[i + 3].ToString();

                    ArrayList sensorZoneDatas = new ArrayList();
                    sensorZoneDatas.Add(nSensorType);
                    sensorZoneDatas.Add(orgSensorID);
                    sensorZoneDatas.Add(strSensorName);

                    dicSensorZoneDatas[nSensorZoneID] = sensorZoneDatas;

                    SensorDetectAnalysisData _data;

                    if (orgSensorID != null && dicDatas.TryGetValue(nSensorZoneID, out _data))
                    {
                        int nFacilityType = GetFacilityType(nSensorType, (int)orgSensorID, ref dicPsmSensors, ref dicEtcSensors);
                        _data.Type = SensorManager.GetSensorTypeName(nFacilityType, dicMaterials);
                    }
                }
            }

            /*if (isPsmType)
            {
                if (dicPsmSensors == null)
                    dicPsmSensors = ReadPsmSensors(out strErrorMessage);

                if (dicPsmSensors == null)
                    return new ResponseSensorDetectAnalysis(false, strErrorMessage);
            }
            else if (isEtcType)
            {
                if (dicEtcSensors == null)
                    dicEtcSensors = ReadEtcSensors(out strErrorMessage);

                if (dicEtcSensors == null)
                    return new ResponseSensorDetectAnalysis(false, strErrorMessage);
            }*/

            int zoneResultCount = zoneResult.Count;

            string maxCountSensorName = "";
            int maxMalfunctionCount = 0;
            double allDetectRate = 0, maxMalfunctionRate = 0;

            dicDatas = dicDatas.OrderByDescending(x => x.Value.DetectCount).ToDictionary(x => x.Key, x => x.Value);

            ArrayList sensorZoneData;
            List<SensorDetectAnalysisData> datas = new List<SensorDetectAnalysisData>();

            Dictionary<int, ArrayList> dicBuildingZones = new Dictionary<int, ArrayList>();

            for (int i = 0; i < zoneResultCount; i += 3)
            {
                if (zoneResult[i] is Nipa.Model.Sdms.Spatial.BuildingGroup && zoneResult[i + 1] is Nipa.Model.Sdms.Spatial.Building && zoneResult[i + 2] is Nipa.Model.Sdms.Spatial.Zone)
                {
                    Nipa.Model.Sdms.Spatial.BuildingGroup buildingGroup = zoneResult[i] as Nipa.Model.Sdms.Spatial.BuildingGroup;
                    Nipa.Model.Sdms.Spatial.Building building = zoneResult[i + 1] as Nipa.Model.Sdms.Spatial.Building;
                    Nipa.Model.Sdms.Spatial.Zone zone = zoneResult[i + 2] as Nipa.Model.Sdms.Spatial.Zone;

                    ArrayList arrDatas = new ArrayList();
                    arrDatas.Add(buildingGroup);
                    arrDatas.Add(building);
                    arrDatas.Add(zone);

                    dicBuildingZones[zone.ID] = arrDatas;
                }
            }

            strCondition = string.Format("{0} is null", Nipa.Model.Sdms.Spatial.Zone.Fields.BuildingID);
            IEnumerable<Nipa.Model.Sdms.Spatial.Zone> zones = m_dataManager.GetSelect().Select<Nipa.Model.Sdms.Spatial.Zone>(strCondition, out strErrorMessage);

            if (zones == null)
                return new ResponseSensorDetectAnalysis(false, strErrorMessage);

            Dictionary<int, Model.Sdms.Spatial.Zone> dicOutdoorZones = new Dictionary<int, Model.Sdms.Spatial.Zone>();

            foreach (var zone in zones)
            {
                dicOutdoorZones[zone.ID] = zone;
            }

            foreach (KeyValuePair<int, SensorDetectAnalysisData> item in dicDatas)
            {
                SensorDetectAnalysisData _data = item.Value;

                if (dicSensorZoneDatas.TryGetValue(_data.SensorZoneID, out sensorZoneData) == false)
                    continue;

                /*if (IsValidSensorZone(strMaterialName, (int?)sensorZoneData[1], isPsmType, isEtcType, dicPsmSensors, dicEtcSensors, dicMaterials) == false)
                    continue;*/

                _data.SensorName = (string)sensorZoneData[2];
                _data.MalfunctionRate = Math.Round(((float)_data.MalfunctionCount / (float)_data.DetectCount) * 100, 2);

                if (double.IsNaN(_data.MalfunctionRate))
                    _data.MalfunctionRate = 0;

                allDetectRate = allDetectRate + (float)_data.DetectCount / allDetectCount * 100;
                _data.DetectRate = (allDetectRate > 100) ? 100 : Math.Round(allDetectRate, 2);

                ArrayList arrDatas;


                if (dicBuildingZones.TryGetValue(_data.ZoneID, out arrDatas))
                {
                    Nipa.Model.Sdms.Spatial.BuildingGroup buildingGroup = arrDatas[0] as Nipa.Model.Sdms.Spatial.BuildingGroup;
                    Nipa.Model.Sdms.Spatial.Building building = arrDatas[1] as Nipa.Model.Sdms.Spatial.Building;
                    Nipa.Model.Sdms.Spatial.Zone zone = arrDatas[2] as Nipa.Model.Sdms.Spatial.Zone;

                    if (zone.DisplayText.StartsWith(building.DisplayText))
                        _data.ZoneName = zone.DisplayText;
                    else
                        _data.ZoneName = /*buildingGroup.DisplayText + " " + */building.DisplayText + " " + zone.DisplayText;
                }
                else
                {
                    Nipa.Model.Sdms.Spatial.Zone zone;

                    if (dicOutdoorZones.TryGetValue(_data.ZoneID, out zone))
                        _data.ZoneName = zone.DisplayText;
                }

                if (maxMalfunctionCount < _data.MalfunctionCount ||
                    (maxMalfunctionCount == _data.MalfunctionCount && maxMalfunctionRate < _data.MalfunctionRate))
                {
                    maxCountSensorName = _data.SensorName;
                    maxMalfunctionCount = _data.MalfunctionCount;
                    maxMalfunctionRate = _data.MalfunctionRate;
                }

                datas.Add(_data);
            }

            res.SensorDetectAnalysisDatas = datas;
            res.AllDetectCount = allDetectCount;
            res.AllMalfunctionRate = allDetectCount == 0 ? 0 : Math.Round(((float)allMalfunctionCount / (float)allDetectCount) * 100, 2);
            res.MaxCountSensorName = maxCountSensorName;

            return res;
        }

        private int GetFacilityType(int nSensorType, int orgSensorID, ref Dictionary<int, Nipa.Model.Sdms.Sensor.PSM> dicPsmSensors, ref Dictionary<int, Nipa.Model.Sdms.Sensor.ETC> dicEtcSensors)
        {
            string strErrorMessage;
            int nFacilityType = nSensorType;

            if (nSensorType == (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR)
            {
                if (dicPsmSensors == null)
                    dicPsmSensors = ReadPsmSensors(out strErrorMessage);

                if (dicPsmSensors != null)
                {
                    Nipa.Model.Sdms.Sensor.PSM sensor;

                    if (dicPsmSensors.TryGetValue(orgSensorID, out sensor) && sensor.MaterialType != null)
                        nFacilityType = (int)sensor.MaterialType;
                }
            }
            else if (nSensorType == (int)dnsData.Sensor.Facility.FacilityType.ETC)
            {
                if (dicEtcSensors == null)
                    dicEtcSensors = ReadEtcSensors(out strErrorMessage);

                if (dicEtcSensors != null)
                {
                    Nipa.Model.Sdms.Sensor.ETC sensor;

                    if (dicEtcSensors.TryGetValue(orgSensorID, out sensor) && sensor.MaterialType != null)
                        nFacilityType = (int)sensor.MaterialType;
                }
            }

            return nFacilityType;
        }

        public ResponseSopDisasterCategoryList GetDisasterCategoryList(RequestSopDisasterCategoryList data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", DisasterCategory.Fields.SiteID, data.CampusID);
            IEnumerable<DisasterCategory> disasterCategories = m_dataManager.GetSelect().Select<DisasterCategory>(strCondition, out strErrorMessage);

            if (disasterCategories == null)
                return new ResponseSopDisasterCategoryList(false, strErrorMessage);

            ResponseSopDisasterCategoryList response = new ResponseSopDisasterCategoryList(true, "");
            response.DisasterCategories.AddRange(disasterCategories);
            return response;
        }

        public ResponseSopSubDisasterCategoryList GetSubDisasterCategoryList(RequestSopSubDisasterCategoryList data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} = {4})",
                SubDisasterCategory.Fields.DisasterCategoryID,
                DisasterCategory.Fields.ID,
                DisasterCategory.TableName,
                DisasterCategory.Fields.SiteID,
                data.CampusID);
            IEnumerable<SubDisasterCategory> subDisasterCategories = m_dataManager.GetSelect().Select<SubDisasterCategory>(strCondition, out strErrorMessage);

            if (subDisasterCategories == null)
                return new ResponseSopSubDisasterCategoryList(false, strErrorMessage);

            ResponseSopSubDisasterCategoryList response = new ResponseSopSubDisasterCategoryList(true, "");
            response.SubDisasterCategories.AddRange(subDisasterCategories);
            return response;
        }

        public ResponseSopStandardActionStepNameList GetStandardActionStepNameList()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 'StandardActionStepNames'", OptionSopSimulator.Fields.PropertyName);
            IEnumerable<OptionSopSimulator> options = m_dataManager.GetSelect().Select<OptionSopSimulator>(strCondition, out strErrorMessage);

            if (options == null)
                return new ResponseSopStandardActionStepNameList(false, strErrorMessage);

            foreach (OptionSopSimulator option in options)
            {
                if (option.PropertyValue != null)
                {
                    string[] tokens = option.PropertyValue.Split(',');

                    if (tokens.Count() == 4)
                    {
                        ResponseSopStandardActionStepNameList response = new ResponseSopStandardActionStepNameList(true, "");
                        
                        foreach (string strActionStepName in tokens)
                        {
                            response.ActionStepNames.Add(strActionStepName.Trim());
                        }

                        return response;
                    }
                }
            }

            ResponseSopStandardActionStepNameList response2 = new ResponseSopStandardActionStepNameList(true, "");
            response2.ActionStepNames.Add("관심");
            response2.ActionStepNames.Add("주의");
            response2.ActionStepNames.Add("경계");
            response2.ActionStepNames.Add("심각");
            return response2;
        }

        public ResponseSOPHistories GetSopHistories(RequestSOPHistories data)
        {
            dnsDapperDBUtil.Manager.WebDBManager webDBManager = m_dataManager.GetDBManager();
            SOPManager.DAL.DataManager sopDataManager = new SOPManager.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, data.CampusID);

            string strErrorMessage = null;

            string strCondition = string.Format(" And {0}.{1} >= '{2}' And {0}.{1} <= '{3}'"
                , ActionStep.TableName, ActionStep.Fields.BeginTime
                , data.BeginTime, data.EndTime);

            strCondition += string.Format(" And {0}.{1} = {2}", DisasterCategory.TableName, DisasterCategory.Fields.SiteID, data.CampusID);

            Dictionary<SOPManager.Model.Sop.Category.SubDisasterCategory.Fields, object> dicSubDisasterCategoryConditions = null;
            //Dictionary<SOPManager.Model.Sop.Category.DisasterCategory.Fields, object> dicDisasterCategoryConditions = null;
            Dictionary<SOPManager.Model.Sop.Category.ActionStep.Fields, object> dicActionStepConditions = null;

            if (data.SubDisasterCategoryID > 0)
            {
                dicSubDisasterCategoryConditions = new Dictionary<SOPManager.Model.Sop.Category.SubDisasterCategory.Fields, object>();
                dicSubDisasterCategoryConditions[SOPManager.Model.Sop.Category.SubDisasterCategory.Fields.ID] = data.SubDisasterCategoryID;
            }

            if (data.ActionStepName != null && data.ActionStepName.Length > 0)
            {
                dicActionStepConditions = new Dictionary<SOPManager.Model.Sop.Category.ActionStep.Fields, object>();
                dicActionStepConditions[SOPManager.Model.Sop.Category.ActionStep.Fields.StepName] = data.ActionStepName;
            }

            ArrayList arrResult = sopDataManager.GetSelectManager().SelectSOPHistory(null, dicSubDisasterCategoryConditions, null, dicActionStepConditions, null, strCondition, out strErrorMessage);
            if (arrResult == null)
                return new ResponseSOPHistories(false, strErrorMessage);

            ResponseSOPHistories res = new ResponseSOPHistories(true, "");
            List<SOPHistoryData> datas = new List<SOPHistoryData>();

            Dictionary<int, int> dicUserIDs = new Dictionary<int, int>();
            List<int> sensorZoneHistoryIDs = new List<int>();

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount; i += 5)
            {
                if (arrResult[i] is SOPManager.Model.Sop.Category.DisasterCategory &&
                    arrResult[i + 1] is SOPManager.Model.Sop.Category.SubDisasterCategory &&
                    arrResult[i + 2] is SOPManager.Model.Sop.Category.Disaster &&
                    arrResult[i + 3] is SOPManager.Model.Sop.Category.ActionStep &&
                    arrResult[i + 4] is Common.Model.History.ActionStepHistory)
                {
                    SOPHistoryData historyData = new SOPHistoryData();

                    SOPManager.Model.Sop.Category.DisasterCategory dc = arrResult[i] as SOPManager.Model.Sop.Category.DisasterCategory;
                    SOPManager.Model.Sop.Category.SubDisasterCategory sdc = arrResult[i + 1] as SOPManager.Model.Sop.Category.SubDisasterCategory;
                    SOPManager.Model.Sop.Category.Disaster d = arrResult[i + 2] as SOPManager.Model.Sop.Category.Disaster;
                    SOPManager.Model.Sop.Category.ActionStep step = arrResult[i + 3] as SOPManager.Model.Sop.Category.ActionStep;
                    Common.Model.History.ActionStepHistory ash = arrResult[i + 4] as Common.Model.History.ActionStepHistory;

                    historyData.ActionStepHistoryID = ash.ID;
                    historyData.DisasterName = dc.CategoryName;
                    historyData.SopName = d.DisasterName;
                    historyData.ActionStepName = step.StepName;
                    historyData.RealMode = (ash.RealMode != null && (bool)ash.RealMode) ? "실제" : "훈련";
                    historyData.Position = ash.Position;
                    historyData.BeginTime = ash.BeginTime.ToString("yyyy-MM-dd HH:mm:ss");
                    historyData.EndTime = (ash.EndTime == null) ? "-" : ((DateTime)ash.EndTime).ToString("yyyy-MM-dd HH:mm:ss");

                    if (ash.LastAccessedUserID != null)
                    {
                        dicUserIDs[(int)ash.LastAccessedUserID] = (int)ash.LastAccessedUserID; // 사용자가 삭제됐을수도 있으니 같이 쿼리하지 않고 따로 조회한다
                        historyData.LastAccessedUserID = (int)ash.LastAccessedUserID;
                    }

                    if (ash.SensorZoneHistoryID != null)
                    {
                        sensorZoneHistoryIDs.Add((int)ash.SensorZoneHistoryID);
                        historyData.SensorZoneHistoryID = (int)ash.SensorZoneHistoryID;
                    }

                    datas.Add(historyData);
                }
            }

            List<int> userIDs = dicUserIDs.Values.ToList();

            #region 사용자 지정
            if (userIDs.Count > 0)
            {
                strCondition = string.Format("{0} in ({1})", User.Fields.ID, string.Join(",", userIDs));
                IEnumerable<User> users = m_dataManager.GetSelect().Select<User>(strCondition, out strErrorMessage);

                if (users == null)
                    return new ResponseSOPHistories(false, strErrorMessage);

                foreach (var user in users)
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

            if (data.LastAccessedUserName != null && data.LastAccessedUserName.Length > 0)
            {
                List<SOPHistoryData> tempDatas = new List<SOPHistoryData>();

                foreach (var historyData in datas)
                {
                    if (historyData.UserName == data.LastAccessedUserName)
                        tempDatas.Add(historyData);
                }

                datas = tempDatas;
            }
            #endregion

            #region 센서명 지정
            if (sensorZoneHistoryIDs.Count > 0)
            {
                strCondition = string.Format("{0} in ({1})", SensorZone.Fields.ID, string.Join(", ", sensorZoneHistoryIDs));
                IEnumerable<SensorZone> sensorZoneHistories = m_dataManager.GetSelect().Select<SensorZone>(strCondition, out strErrorMessage);
                if (sensorZoneHistories == null)
                    return new ResponseSOPHistories(false, strErrorMessage);

                List<int> sensorZoneIDs = new List<int>();
                foreach (SensorZone history in sensorZoneHistories)
                {
                    int sensorZoneID;
                    string[] tokens = history.AllSensorZoneIDs.Split(',');
                    List<int> allSensorZoneIDs = new List<int>();

                    foreach (string strSensorZoneID in tokens)
                    {
                        if (int.TryParse(strSensorZoneID.Trim(), out sensorZoneID))
                            allSensorZoneIDs.Add(sensorZoneID);
                    }

                    for (int i = 0; i < datas.Count; i++)
                    {
                        if (datas[i].SensorZoneHistoryID == history.ID)
                        {
                            datas[i].AllSensorZoneIDs = allSensorZoneIDs;                            
                        }
                    }

                    sensorZoneIDs.AddRange(allSensorZoneIDs);
                }

                if (sensorZoneIDs.Count > 0)
                {
                    string strFireTypeIDs = string.Join(",", Facility.GetFireTypeAllNumberToList());
                    string strPsmTypeIDs = ((int)Facility.FacilityType.PSM_SENSOR).ToString();
                    string strEtcTypeIDs = ((int)Facility.FacilityType.ETC).ToString();
                    string strCctvTypeIDs = string.Join(",", GetCCTVTypes());

                    strCondition = string.Format("{0} in ({1})", Nipa.Model.Sdms.Sensor.SensorZone.Fields.ID, string.Join(", ", sensorZoneIDs));
                    arrResult = m_joinManager.JoinSensorZoneSensors(strCondition, strFireTypeIDs, strPsmTypeIDs, strEtcTypeIDs, strCctvTypeIDs, out strErrorMessage);
                    if (arrResult == null)
                        return new ResponseSOPHistories(false, strErrorMessage);

                    int resultCount = arrResult.Count;
                    for (int i = 0; i < resultCount; i += 4)
                    {
                        if (arrResult[i] is int && arrResult[i + 1] is int && arrResult[i + 3] is string)
                        {
                            int nSensorZoneID = (int)arrResult[i];
                            int nSensorType = (int)arrResult[i + 1];
                            string strSensorName = arrResult[i + 3].ToString();

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

            res.SopHistoryDatas = datas;
            return res;
        }

        public ResponseSOPComponentHistories GetSOPComponentHistories(RequestSOPComponentHistories data)
        {
            string strErrorMessage = null;
            string strCondition = string.Format("{0} = {1}", ActionStep.Fields.ID, data.ActionStepHistoryID);
            ActionStep actionStepHistory = m_dataManager.GetSelect().SelectFirst<ActionStep>(strCondition, out strErrorMessage);

            if (actionStepHistory == null)
                return new ResponseSOPComponentHistories(false, strErrorMessage);

            strCondition = string.Format("{0} = {1}", Component.Fields.ActionStepHistoryID, data.ActionStepHistoryID);
            IEnumerable<Component> histories = m_dataManager.GetSelect().Select<Component>(strCondition, out strErrorMessage);

            if (histories == null)
                return new ResponseSOPComponentHistories(false, strErrorMessage);

            if (histories.Count() == 0)
                return new ResponseSOPComponentHistories(true, "");

            string strHistoryIDs = string.Join(", ", histories.Select(p => p.ID));
            strCondition = string.Format("{0} IN ({1})", ComponentDetail.Fields.ComponentHistoryID, strHistoryIDs);
            IEnumerable<ComponentDetail> details = m_dataManager.GetSelect().Select<ComponentDetail>(strCondition, out strErrorMessage);

            if (details == null)
                return new ResponseSOPComponentHistories(false, strErrorMessage);

            Dictionary<string, SopHistoryComponentData> dicDatas = new Dictionary<string, SopHistoryComponentData>();

            /*SOPManager.BLL.ProcessManager processMgr =
                new SOPManager.BLL.ProcessManager(m_processManager.CommonDataManager, m_processManager.SopDataManager, m_processManager.TeamDataManager, m_processManager.SdmsDataManager);
            SOPManager.BLL.LoadManager sopLoadManager = processMgr.GetLoadManager();*/
            dnsDapperDBUtil.Manager.WebDBManager webDBManager = m_dataManager.GetDBManager();
            SOPManager.DAL.DataManager sopDataManager = new SOPManager.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, data.CampusID);
            TeamEditor.DAL.DataManager teamDataManager = new TeamEditor.DAL.DataManager((int)webDBManager.DatabaseType, webDBManager.DbHost, webDBManager.DbName, webDBManager.DbID, webDBManager.DbPw, data.CampusID);

            foreach (Component history in histories)
            {
                string strKey = history.ComponentType + "_" + history.ComponentID;
                SopHistoryComponentData _data = null;

                if (dicDatas.ContainsKey(strKey))
                    _data = dicDatas[strKey];
                else
                {
                    _data = new SopHistoryComponentData();
                    _data.ActionStepHistoryID = history.ActionStepHistoryID;
                    _data.ComponentHistoryID = history.ID;
                    _data.ComponentID = history.ComponentID;
                    _data.ComponentType = history.ComponentType;

                    if (_data.ComponentType == (int)SOPManager.Model.Sop.Component.Section.SectionType.Process)
                    {
                        SOPManager.Model.Sop.Component.Process process = sopDataManager.GetSelectManager().SelectProcess(_data.ComponentID, out strErrorMessage);
                        if (process == null)
                            return new ResponseSOPComponentHistories(false, strErrorMessage);

                        _data.SectionName = process.Text;
                        _data.TeamList = GetReciver(process.TeamList, teamDataManager);

                        strCondition = string.Format("{0} = {1}", SOPManager.Model.Sop.Component.ProcessMission.Fields.ProcessID, _data.ComponentID);

                        List<SOPManager.Model.Sop.Component.ProcessMission> missions = sopDataManager.GetSelectManager().SelectProcessMissions(strCondition, out strErrorMessage);
                        if (missions == null)
                            return new ResponseSOPComponentHistories(false, strErrorMessage);

                        int missionCount = missions.Count;
                        for (int i = 0; i < missionCount; i++)
                        {
                            ComponentHistoryDetailData detailData = new ComponentHistoryDetailData();
                            detailData.SectionName = _data.SectionName;
                            detailData.MissionText = ReplaceMessage(missions[i].MissionText, actionStepHistory.Position, actionStepHistory.BeginTime.ToString());
                            detailData.DataIndex = i;

                            _data.MissionDatas.Add(detailData);
                        }
                    }
                    else if (_data.ComponentType == (int)SOPManager.Model.Sop.Component.Section.SectionType.Decision)
                    {
                        SOPManager.Model.Sop.Component.Decision decision = sopDataManager.GetSelectManager().SelectDecision(_data.ComponentID, out strErrorMessage);
                        if (decision == null)
                            return new ResponseSOPComponentHistories(false, strErrorMessage);

                        _data.SectionName = decision.Text;
                    }
                    else if (_data.ComponentType == (int)SOPManager.Model.Sop.Component.Section.SectionType.Endpoint)
                    {
                        SOPManager.Model.Sop.Component.EndPoint endPoint = sopDataManager.GetSelectManager().SelectEndPoint(_data.ComponentID, out strErrorMessage);
                        if (endPoint == null)
                            return new ResponseSOPComponentHistories(false, strErrorMessage);

                        _data.SectionName = endPoint.Text;
                    }
                    else if (_data.ComponentType == (int)SOPManager.Model.Sop.Component.Section.SectionType.Internal)
                    {
                        SOPManager.Model.Sop.Component.InternalTransmission @internal = sopDataManager.GetSelectManager().SelectInternalTransmission(_data.ComponentID, out strErrorMessage);
                        if (@internal == null)
                            return new ResponseSOPComponentHistories(false, strErrorMessage);

                        _data.SectionName = @internal.Text;
                        _data.TeamList = GetReciver(@internal.TeamList, teamDataManager);

                        ComponentHistoryDetailData detailData = new ComponentHistoryDetailData();
                        detailData.SectionName = _data.SectionName;
                        detailData.MissionText = ReplaceMessage(@internal.Message, actionStepHistory.Position, actionStepHistory.BeginTime.ToString());
                        detailData.DataIndex = 0;
                        detailData.Time = history.Time.ToString("yyyy-MM-dd HH:mm");

                        _data.MissionDatas.Add(detailData);
                    }

                    dicDatas.Add(strKey, _data);
                }

                _data.Time = history.Time.ToString("yyyy-MM-dd HH:mm");
                _data.Status = history.Status;
                _data.strStatus = (history.Status == 3) ? "확인" : "실행중";
                _data.UserID = (history.AccessedUserID != null) ? (int)history.AccessedUserID : -1;

                foreach (ComponentDetail detail in details)
                {
                    if (history.ID == detail.ComponentHistoryID)
                    {
                        ComponentHistoryDetailData detailData = _data.MissionDatas[detail.DataIndex];
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
                SopHistoryComponentData _data = item.Value;

                int completeCount = 0;
                foreach (ComponentHistoryDetailData missionData in _data.MissionDatas)
                {
                    if (missionData.Completion == "완료")
                        completeCount++;
                }

                if (completeCount == _data.MissionDatas.Count) // 완료된 개수와  mission개수가 같은가?
                {
                    if (_data.MissionDatas.Count == 0)
                        _data.Completion = "확인";
                    else
                        _data.Completion = "완료";

                }
                else if (completeCount > 0 && completeCount < _data.MissionDatas.Count) // 완료된 개수가 mission개수보다 작은가?
                    _data.Completion = "부분완료";
                else if (completeCount == 0)
                    _data.Completion = "미완료";

                datas.Add(_data);
            }

            ResponseSOPComponentHistories res = new ResponseSOPComponentHistories(true, "");
            res.SOPComponentHistoryDatas = datas;

            return res;
        }

        private List<string> GetReciver(List<SOPManager.Model.Sop.Component.Receiver> receivers, TeamEditor.DAL.DataManager teamDataManager)
        {
            List<string> names = new List<string>();

            if (receivers == null)
                return names;

            foreach (SOPManager.Model.Sop.Component.Receiver receiver in receivers)
            {
                if (receiver.TeamType == 2)
                {
                    string strErrorMessage = null;
                    Dictionary<TeamEditor.Model.Sop.Team.Regular.Fields, object> dicCondition = new Dictionary<TeamEditor.Model.Sop.Team.Regular.Fields, object>();
                    dicCondition.Add(TeamEditor.Model.Sop.Team.Regular.Fields.ID, receiver.TeamID);

                    List<TeamEditor.Model.Sop.Team.Regular> regulars = teamDataManager.GetSelectManager().SelectRegulars(dicCondition, out strErrorMessage);
                    if (regulars != null)
                    {
                        foreach (TeamEditor.Model.Sop.Team.Regular regular in regulars)
                        {
                            names.Add(regular.TeamName);
                        }
                    }
                }

            }

            return names;
        }

        private string ReplaceMessage(string message, string position, string time)
        {
            string retrunMessage = message;

            // 특수 문자가 있니 ?
            if (message.Contains("{") && message.Contains("}"))
            {
                SOPManager.BLL.Models.Request.RequestParseSpecialMessage req = new SOPManager.BLL.Models.Request.RequestParseSpecialMessage();
                req.Message = message;
                req.Location = position;
                req.Time = time;

                SOPManager.BLL.Models.Response.ResponseParseSpecialMessage res = SOPManager.BLL.LoadManager._ParseSpecialMessage(req);
                retrunMessage = res.ParseMessage;
            }

            return retrunMessage;
        }
    }
}
