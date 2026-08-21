using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;
using System.Windows.Forms;

namespace AlarmLinker
{
    using Models;

    class AlarmChecker
    {
        private IDataManager m_ownDBManager = null;
        private List<IDataManager> m_externalDBManagers = null;
        private Label m_labelErrorMessage = null;

        public AlarmChecker(IDataManager ownDBManager, List<IDataManager> externalDBManagers, Label labelErrorMessage)
        {
            m_ownDBManager = ownDBManager;
            m_externalDBManagers = externalDBManagers;
            m_labelErrorMessage = labelErrorMessage;
        }

        public bool Process()
        {
            // Key : DB Name
            // Value : Max SensorZoneHistory ID
            Dictionary<string, int> dicMaxSensorZoneHistoryID = ReadHistoryLink();
            
            if (dicMaxSensorZoneHistoryID == null)
                return false;

            // 새로운 알람은 외부 DB에서만 발생한다.
            if (ReadNewExternalAlarms(dicMaxSensorZoneHistoryID) == false)
                return false;

            SetErrorMessage("");
            return true;
        }

        private bool ReadNewExternalAlarms(Dictionary<string, int> dicMaxSensorZoneHistoryID)
        {
            int maxSensorZoneHistoryID;
            string strErrorMessage;

            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                string strDBName = dataManager.GetDBManager().DbName;

                if (dicMaxSensorZoneHistoryID.TryGetValue(strDBName, out maxSensorZoneHistoryID) == false)
                    maxSensorZoneHistoryID = 0;

                string strCondition = string.Format("{0} > {1}", SdmsHistorySensorZone.Fields.ID, maxSensorZoneHistoryID);
                IEnumerable<SdmsHistorySensorZone> sensorZoneHistories = dataManager.GetSelect().Select<SdmsHistorySensorZone>(strCondition, out strErrorMessage);

                if (sensorZoneHistories == null)
                {
                    SetErrorMessage(strErrorMessage);
                    return false;
                }

                string strSensorZoneHistoryIDs = "";

                foreach (SdmsHistorySensorZone sensorZoneHistory in sensorZoneHistories)
                {
                    if (strSensorZoneHistoryIDs.Length == 0)
                        strSensorZoneHistoryIDs = sensorZoneHistory.ID.ToString();
                    else
                        strSensorZoneHistoryIDs += "," + sensorZoneHistory.ID.ToString();
                }

                if (strSensorZoneHistoryIDs.Length > 0)
                {
                    strCondition = string.Format("{0} in ({1})", SdmsHistorySensorReaction.Fields.SensorZoneHistoryID, strSensorZoneHistoryIDs);
                    IEnumerable<SdmsHistorySensorReaction> sensorReactionHistories = dataManager.GetSelect().Select<SdmsHistorySensorReaction>(strCondition, out strErrorMessage);

                    if (sensorReactionHistories == null)
                    {
                        SetErrorMessage(strErrorMessage);
                        return false;
                    }

                    if (AddNewAlarms(sensorZoneHistories, sensorReactionHistories, strDBName) == false)
                        return false;
                }
            }

            return true;
        }

        private bool AddNewAlarms(IEnumerable<SdmsHistorySensorZone> sensorZoneHistories, IEnumerable<SdmsHistorySensorReaction> sensorReactionHistories, string strDBName)
        {
            string strErrorMessage;
            IDataManager ownDataManager = m_ownDBManager.Clone();

            if (ownDataManager.BeginBatch(out strErrorMessage) == false)
            {
                SetErrorMessage(strErrorMessage);
                return false;
            }

            int? maxID = GetMax(ownDataManager, SdmsHistorySensorZone.Fields.ID.ToString(), SdmsHistorySensorZone.TableName, null, out strErrorMessage);

            if (maxID == null)
            {
                string strTemp;
                ownDataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            int newID = (int)maxID + 1;

            // Key : External SensorZoneHistory ID
            // Value : Own SensorZoneHistory ID
            Dictionary<int, int> dicSensorZoneHistoryLink = new Dictionary<int, int>();
            List<SdmsHistorySensorZone> newSensorZoneHistories = new List<SdmsHistorySensorZone>();

            List<SensorZoneHistoryLink> newLinks = new List<SensorZoneHistoryLink>();
            // Key : External SensorZoneHistory ID
            Dictionary<int, SensorZoneHistoryLink> dicSensorZoneHistoryLink2 = new Dictionary<int, SensorZoneHistoryLink>();

            foreach (SdmsHistorySensorZone sensorZoneHistory in sensorZoneHistories)
            {
                dicSensorZoneHistoryLink[sensorZoneHistory.ID] = newID;

                SensorZoneHistoryLink link = new SensorZoneHistoryLink();
                link.ExternalDBName = strDBName;
                link.CompleteEvent = false;
                link.ExternalSensorZoneHistoryID = sensorZoneHistory.ID;
                link.ExternalSiteID = 1;
                link.OwnSensorZoneHistoryID = newID;

                dicSensorZoneHistoryLink2[sensorZoneHistory.ID] = link;
                newLinks.Add(link);

                sensorZoneHistory.ID = newID++;
                newSensorZoneHistories.Add(sensorZoneHistory);
            }

            if (ownDataManager.GetCreate().Insert<SdmsHistorySensorZone>(newSensorZoneHistories, out strErrorMessage) == false)
            {
                string strTemp;
                ownDataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            maxID = GetMax(ownDataManager, SdmsHistorySensorReaction.Fields.ID.ToString(), SdmsHistorySensorReaction.TableName, null, out strErrorMessage);

            if (maxID == null)
            {
                string strTemp;
                ownDataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            newID = (int)maxID + 1;

            int ownSensorZoneHistoryID;
            List<SdmsHistorySensorReaction> newSensorReactionHistories = new List<SdmsHistorySensorReaction>();

            foreach (SdmsHistorySensorReaction sensorReactionHistory in sensorReactionHistories)
            {
                if (dicSensorZoneHistoryLink.TryGetValue(sensorReactionHistory.SensorZoneHistoryID, out ownSensorZoneHistoryID))
                {
                    if (IsCompleteEvent(sensorReactionHistory)) 
                    {
                        SensorZoneHistoryLink link;

                        if (dicSensorZoneHistoryLink2.TryGetValue(sensorReactionHistory.SensorZoneHistoryID, out link))
                            link.CompleteEvent = true;
                    }

                    sensorReactionHistory.SensorZoneHistoryID = ownSensorZoneHistoryID;
                    sensorReactionHistory.ID = newID++;
                    newSensorReactionHistories.Add(sensorReactionHistory);
                }
                else
                {
                    string strTemp;
                    ownDataManager.BatchRollback(out strTemp);
                    return false;
                }
            }

            if (ownDataManager.GetCreate().Insert<SdmsHistorySensorReaction>(newSensorReactionHistories, out strErrorMessage) == false)
            {
                string strTemp;
                ownDataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            if (ownDataManager.GetCreate().Insert<SensorZoneHistoryLink>(newLinks, out strErrorMessage) == false)
            {
                string strTemp;
                ownDataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            if (ownDataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                ownDataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            return true;
        }

        private bool IsCompleteEvent(SdmsHistorySensorReaction reactionHistory)
        {
            if (reactionHistory.ReactionType == 50 || // 상황종료
                reactionHistory.ReactionType == 64 || // 사용자복구
                reactionHistory.ReactionType == 1000) // Timeout
                return true;

            return false;
        }

        private Dictionary<string, int> ReadHistoryLink()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = 0", SensorZoneHistoryLink.Fields.CompleteEvent);
            IEnumerable<SensorZoneHistoryLink> historyLinks = m_ownDBManager.GetSelect().Select<SensorZoneHistoryLink>(strCondition, out strErrorMessage);

            if (historyLinks == null)
            {
                SetErrorMessage(strErrorMessage);
                return null;
            }

            if (ReadExternalAlarmStatus(historyLinks) == false)
                return null;

            // Key : DB Name
            // Value : Max SensorZoneHistory ID
            Dictionary<string, int> dicMaxSensorZoneHistoryID = new Dictionary<string, int>();

            string strSQL = string.Format("Select {0}, max({1}) from {2} group by {0}",
                SensorZoneHistoryLink.Fields.ExternalDBName,
                SensorZoneHistoryLink.Fields.ExternalSensorZoneHistoryID,
                SensorZoneHistoryLink.TableName);

            IEnumerable<dynamic> results = m_ownDBManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (results == null)
            {
                SetErrorMessage(strErrorMessage);
                return null;
            }

            foreach (var item in results)
            {
                var data = item as IDictionary<string, object>;
                string strDBName = "";
                int maxSensorZoneHistoryID = 0;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    string strFieldName = pair.Key;
                    object value = pair.Value;

                    if (strFieldName == SensorZoneHistoryLink.Fields.ExternalDBName.ToString())
                        strDBName = (string)value;
                    else
                    {
                        if (value != null && value is int)
                            maxSensorZoneHistoryID = (int)value;
                        else
                            maxSensorZoneHistoryID = -1;
                    }
                }

                if (strDBName != null && strDBName.Trim().Length > 0 && maxSensorZoneHistoryID > 0)
                    dicMaxSensorZoneHistoryID[strDBName] = maxSensorZoneHistoryID;
            }

            return dicMaxSensorZoneHistoryID;
        }

        private void SetErrorMessage(string strErrorMessage)
        {
            if (this.m_labelErrorMessage != null)
                this.m_labelErrorMessage.Text = strErrorMessage;
        }

        private bool ReadExternalAlarmStatus(IEnumerable<SensorZoneHistoryLink> historyLinks)
        {
            // Key : DB Name
            Dictionary<string, string> dicSensorZoneHistoryIDs = new Dictionary<string, string>();

            foreach (SensorZoneHistoryLink link in historyLinks)
            {
                string strSensorZoneHistoryIDs = null;

                if (dicSensorZoneHistoryIDs.TryGetValue(link.ExternalDBName, out strSensorZoneHistoryIDs) == false)
                {
                    strSensorZoneHistoryIDs = link.ExternalSensorZoneHistoryID.ToString();
                    dicSensorZoneHistoryIDs[link.ExternalDBName] = strSensorZoneHistoryIDs;
                }
                else
                    dicSensorZoneHistoryIDs[link.ExternalDBName] = strSensorZoneHistoryIDs + "," + link.ExternalSensorZoneHistoryID.ToString();
            }

            string strErrorMessage;

            foreach (var pair in dicSensorZoneHistoryIDs)
            {
                IDataManager dataManager = GetExternalDataManager(pair.Key);

                if (dataManager != null)
                {
                    // Key : SensorZoneHistory ID
                    Dictionary<int, List<SdmsHistorySensorReaction>> dicSensorReactionHistories = new Dictionary<int, List<SdmsHistorySensorReaction>>();

                    string strCondition = string.Format("{0} in ({1})", SdmsHistorySensorReaction.Fields.SensorZoneHistoryID, pair.Value);
                    IEnumerable<SdmsHistorySensorReaction> reactionHistories = dataManager.GetSelect().Select<SdmsHistorySensorReaction>(strCondition, out strErrorMessage);

                    if (reactionHistories == null)
                    {
                        SetErrorMessage(strErrorMessage);
                        return false;
                    }

                    foreach (var reactionHistory in reactionHistories)
                    {
                        List<SdmsHistorySensorReaction> histories = null;

                        if (dicSensorReactionHistories.TryGetValue(reactionHistory.SensorZoneHistoryID, out histories) == false)
                        {
                            histories = new List<SdmsHistorySensorReaction>();
                            dicSensorReactionHistories[reactionHistory.SensorZoneHistoryID] = histories;
                        }

                        histories.Add(reactionHistory);
                    }

                    if (CompareSensorReactionHistories(dicSensorReactionHistories, pair.Key, historyLinks, dataManager) == false)
                        return false;
                }
            }

            return true;
        }

        private bool CompareSensorReactionHistories(Dictionary<int, List<SdmsHistorySensorReaction>> dicExternalSensorReactionHistorie, string strDBName, IEnumerable<SensorZoneHistoryLink> historyLinks, IDataManager externalDBManager)
        {
            string strSensorZoneHistoryIDs = "";

            // Key : External SensorZoneHistory ID
            // Value : Own SensorZoneHistory ID
            Dictionary<int, int> dicSensorZoneHistoryLinks = new Dictionary<int, int>();

            foreach (SensorZoneHistoryLink link in historyLinks)
            {
                if (link.ExternalDBName == strDBName)
                {
                    if (dicExternalSensorReactionHistorie.ContainsKey(link.ExternalSensorZoneHistoryID))
                    {
                        dicSensorZoneHistoryLinks[link.ExternalSensorZoneHistoryID] = link.OwnSensorZoneHistoryID;

                        if (strSensorZoneHistoryIDs.Length == 0)
                            strSensorZoneHistoryIDs = link.OwnSensorZoneHistoryID.ToString();
                        else
                            strSensorZoneHistoryIDs += "," + link.OwnSensorZoneHistoryID.ToString();
                    }
                }
            }

            if (strSensorZoneHistoryIDs.Length > 0)
            {
                string strErrorMessage;
                string strCondition = string.Format("{0} in ({1})", SdmsHistorySensorReaction.Fields.SensorZoneHistoryID, strSensorZoneHistoryIDs);
                IEnumerable<SdmsHistorySensorReaction> reactionHistories = m_ownDBManager.GetSelect().Select<SdmsHistorySensorReaction>(strCondition, out strErrorMessage);

                if (reactionHistories == null)
                {
                    SetErrorMessage(strErrorMessage);
                    return false;
                }

                // Key : SensorZoneHistory ID
                Dictionary<int, List<SdmsHistorySensorReaction>> dicOwnSensorReactionHistories = new Dictionary<int, List<SdmsHistorySensorReaction>>();

                foreach (var reactionHistory in reactionHistories)
                {
                    List<SdmsHistorySensorReaction> histories = null;

                    if (dicOwnSensorReactionHistories.TryGetValue(reactionHistory.SensorZoneHistoryID, out histories) == false)
                    {
                        histories = new List<SdmsHistorySensorReaction>();
                        dicOwnSensorReactionHistories[reactionHistory.SensorZoneHistoryID] = histories;
                    }

                    histories.Add(reactionHistory);
                }

                foreach (KeyValuePair<int, List<SdmsHistorySensorReaction>> pair in dicExternalSensorReactionHistorie)
                {
                    int ownSensorZoneHistoryID;
                    List<SdmsHistorySensorReaction> ownSensorReactionHistories = null;

                    if (dicSensorZoneHistoryLinks.TryGetValue(pair.Key, out ownSensorZoneHistoryID))
                    {
                        if (dicOwnSensorReactionHistories.TryGetValue(ownSensorZoneHistoryID, out ownSensorReactionHistories))
                        {
                            int externalCount = pair.Value.Count;
                            int ownCount = ownSensorReactionHistories.Count;

                            if (externalCount == ownCount)
                                continue;

                            if (externalCount > ownCount)
                            {
                                // 외부 사이트에서 기존 알람에 새로운 이벤트가 있다.
                                if (AddReactionHistories(m_ownDBManager, pair.Value, ownCount, externalCount, ownSensorZoneHistoryID, historyLinks, true) == false)
                                    return false;
                            }
                            else
                            {
                                // 현재 사이트에서 기존 알람에 새로운 이벤트가 있다.
                                if (AddReactionHistories(externalDBManager, ownSensorReactionHistories, externalCount, ownCount, pair.Key, historyLinks, false) == false)
                                    return false;
                            }
                        }
                    }
                }
            }

            return true;
        }

        private bool AddReactionHistories(IDataManager dataManager, List<SdmsHistorySensorReaction> sensorReactionHistories, int beginIndex, int endIndex, int sensorZoneHistoryID, IEnumerable<SensorZoneHistoryLink> historyLinks, bool isOwn)
        {
            string strErrorMessage;
            dataManager = dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
            {
                SetErrorMessage(strErrorMessage);
                return false;
            }

            int? maxID = GetMax(dataManager, SdmsHistorySensorReaction.Fields.ID.ToString(), SdmsHistorySensorReaction.TableName, null, out strErrorMessage);

            if (maxID == null)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            List<SdmsHistorySensorReaction> histories = new List<SdmsHistorySensorReaction>();
            int newID = (int)maxID + 1;

            for (int i=beginIndex;i<endIndex;i++)
            {
                SdmsHistorySensorReaction reactionHistory = sensorReactionHistories[i];
                reactionHistory.ID = newID++;
                reactionHistory.SensorZoneHistoryID = sensorZoneHistoryID;

                histories.Add(reactionHistory);

                if (IsCompleteEvent(reactionHistory))
                {
                    SensorZoneHistoryLink link = GetLink(sensorZoneHistoryID, isOwn, historyLinks);

                    if (link != null)
                    {
                        link.CompleteEvent = true;

                        if (m_ownDBManager.GetUpdate().Update<SensorZoneHistoryLink>(link, null, out strErrorMessage) == false)
                        {
                            string strTemp;
                            dataManager.BatchRollback(out strTemp);

                            SetErrorMessage(strErrorMessage);
                            return false;
                        }
                    }
                }
            }

            if (dataManager.GetCreate().Insert<SdmsHistorySensorReaction>(histories, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);

                SetErrorMessage(strErrorMessage);
                return false;
            }

            return true;
        }

        private SensorZoneHistoryLink GetLink(int sensorZoneHistoryID, bool isOwn, IEnumerable<SensorZoneHistoryLink> historyLinks)
        {
            foreach (SensorZoneHistoryLink link in historyLinks)
            {
                if ((isOwn && link.OwnSensorZoneHistoryID == sensorZoneHistoryID) ||
                    (!isOwn && link.ExternalSensorZoneHistoryID == sensorZoneHistoryID))
                    return link;
            }

            return null;
        }

        private int? GetMax(IDataManager dataManager, string strFieldName, string strTableName, string strCondition, out string strErrorMessage)
        {
            string strSQL = string.Format("Select max({0}) data from {1}", strFieldName, strTableName);

            if (strCondition != null && strCondition.Length > 0)
                strSQL += " where " + strCondition;

            IEnumerable<dynamic> result = dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                return item.data;
            }

            return 0;
        }

        private IDataManager GetExternalDataManager(string strDBName)
        {
            foreach (IDataManager dataManager in m_externalDBManagers)
            {
                if (dataManager.GetDBManager().DbName == strDBName)
                    return dataManager;
            }

            return null;
        }
    }
}
