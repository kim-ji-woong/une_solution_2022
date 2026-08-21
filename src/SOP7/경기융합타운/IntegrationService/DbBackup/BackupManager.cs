using System;
using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsDapperDBUtil;
using System.Threading;
using dnsSopID;

namespace DbBackup
{
    using Models.Sdms;
    using Models.Sdms.History;
    using Models.Sop.Account;
    using Models.Sop.Category;
    using Models.Sop.Component;
    using Models.Sop.Config;
    using Models.Sop.History;
    using Models.Request;

    class BackupManager
    {
        private IDataManager m_dataManager = null;
        // 종합방재실 SiteID를 사용한다.
        private int m_nSiteID = 40;
        private const string TargetProperty = "BackupProcess";
        private const string DBInfoProperty = "TargetDBInfo";

        public BackupManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public bool Run(string strSopWebServerUrl)
        {
            if (UpdateState(true))
            {
                // DB Backup이 시작됨을 알리고, 10초간 대기한다.
                // 다른 Process들이 진행중인 작업이 있으면 마무리할 시간을 준다.
                Thread.Sleep(10000);

                IDataManager backupDataManager = GetBackupDbManager();

                if (backupDataManager != null)
                {
                    Backup(backupDataManager);
                }

                if (UpdateState(false))
                {
                    ReloadSopWebServer(strSopWebServerUrl);
                    return true;
                }
            }

            return false;
        }

        // SopWebServer의 알람정보를 초기화하고 DB로부터 새로 읽어오도록 한다.
        private void ReloadSopWebServer(string strSopWebServerUrl)
        {
            if (strSopWebServerUrl == null)
                return;

            if (strSopWebServerUrl.EndsWith("/"))
                strSopWebServerUrl += "api/FireSensor";
            else
                strSopWebServerUrl += "/api/FireSensor";

            string strErrorMessage;
            WebServiceManager.Send(new SensorParameter(Header.RELOAD_ALARMS, "Reload_Alarms"), strSopWebServerUrl, out strErrorMessage);
        }

        private bool Backup(IDataManager backupDataManager)
        {
            string strErrorMessage;

            if (m_dataManager.BeginBatch(out strErrorMessage) == false)
                return false;

            if (RemoveSopHistory(out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (RemoveSopConfig(out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (RemoveSopComponent(out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (RemoveSopCategory(out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (RemoveSdmsHistory(out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (RemoveAccountOptions(out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            // Key : BackupDB User ID
            // Value : Own DB User ID
            Dictionary<int, int> dicUserMaps;

            if (AddAccountOptions(backupDataManager, out dicUserMaps, out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            // 1년 이내의 로그만 백업받는다.
            string strLastYearTime = GetTimeString(DateTime.Now.AddYears(-1));

            if (AddSdmsHistory(backupDataManager, strLastYearTime, out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (AddSopCategory(backupDataManager, dicUserMaps, out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (AddSopComponent(backupDataManager, out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (AddSopConfig(backupDataManager, out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (AddSopHistory(backupDataManager, strLastYearTime, out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            if (m_dataManager.BatchCommit(out strErrorMessage) == false)
                return Rollback(strErrorMessage);

            return true;
        }

        private bool AddSopConfig(IDataManager backupDataManager, out string strErrorMessage)
        {
            if (AddLinkedSop(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddSpecialMessage(backupDataManager, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool AddSpecialMessage(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<SpecialMessage> messages = backupDataManager.GetSelect().Select<SpecialMessage>(null, out strErrorMessage);

            if (messages == null)
                return false;

            List<SpecialMessage> datas = new List<SpecialMessage>();
            datas.AddRange(messages);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<SpecialMessage>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddLinkedSop(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<LinkedSop> sops = backupDataManager.GetSelect().Select<LinkedSop>(null, out strErrorMessage);

            if (sops == null)
                return false;

            List<LinkedSop> datas = new List<LinkedSop>();
            datas.AddRange(sops);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<LinkedSop>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddSopComponent(IDataManager backupDataManager, out string strErrorMessage)
        {
            if (AddStepMember(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddSectionGrid(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddProcess(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddInternal(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddDecision(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddEndpoint(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddAnnotation(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddArrow(backupDataManager, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool AddArrow(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<Arrow> arrows = backupDataManager.GetSelect().Select<Arrow>(null, out strErrorMessage);

            if (arrows == null)
                return false;

            List<Arrow> _arrows = new List<Arrow>();
            _arrows.AddRange(arrows);

            if (_arrows.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<Arrow>(_arrows, out strErrorMessage);
            }

            return true;
        }

        private bool AddAnnotation(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<Annotation> endpoints = backupDataManager.GetSelect().Select<Annotation>(null, out strErrorMessage);

            if (endpoints == null)
                return false;

            List<Annotation> sections = new List<Annotation>();
            sections.AddRange(endpoints);

            if (sections.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<Annotation>(sections, out strErrorMessage);
            }

            return true;
        }

        private bool AddEndpoint(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<EndPoint> endpoints = backupDataManager.GetSelect().Select<EndPoint>(null, out strErrorMessage);

            if (endpoints == null)
                return false;

            List<EndPoint> sections = new List<EndPoint>();
            sections.AddRange(endpoints);

            if (sections.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<EndPoint>(sections, out strErrorMessage);
            }

            return true;
        }

        private bool AddDecision(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<Decision> decisions = backupDataManager.GetSelect().Select<Decision>(null, out strErrorMessage);

            if (decisions == null)
                return false;

            List<Decision> sections = new List<Decision>();
            sections.AddRange(decisions);

            if (sections.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<Decision>(sections, out strErrorMessage);
            }

            return true;
        }

        private bool AddInternal(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<InternalTransmission> internals = backupDataManager.GetSelect().Select<InternalTransmission>(null, out strErrorMessage);

            if (internals == null)
                return false;

            List<InternalTransmission> sections = new List<InternalTransmission>();
            sections.AddRange(internals);

            if (sections.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<InternalTransmission>(sections, out strErrorMessage);
            }

            return true;
        }

        private bool AddProcess(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<Process> processes = backupDataManager.GetSelect().Select<Process>(null, out strErrorMessage);

            if (processes == null)
                return false;

            IEnumerable<ProcessMission> missions = backupDataManager.GetSelect().Select<ProcessMission>(null, out strErrorMessage);

            if (missions == null)
                return false;

            List<Process> sections = new List<Process>();
            sections.AddRange(processes);

            if (sections.Count > 0)
            {
                if (m_dataManager.GetCreate().Insert<Process>(sections, out strErrorMessage) == false)
                    return false;

                List<ProcessMission> processMissions = new List<ProcessMission>();
                processMissions.AddRange(missions);

                if (processMissions.Count > 0)
                {
                    if (m_dataManager.GetCreate().Insert<ProcessMission>(processMissions, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool AddSectionGrid(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<SectionGrid> grids = backupDataManager.GetSelect().Select<SectionGrid>(null, out strErrorMessage);

            if (grids == null)
                return false;

            IEnumerable<SectionGridColumn> columns = backupDataManager.GetSelect().Select<SectionGridColumn>(null, out strErrorMessage);

            if (columns == null)
                return false;

            IEnumerable<SectionGridRow> rows = backupDataManager.GetSelect().Select<SectionGridRow>(null, out strErrorMessage);

            if (rows == null)
                return false;

            List<SectionGrid> sectionGrids = new List<SectionGrid>();
            sectionGrids.AddRange(grids);

            if (sectionGrids.Count > 0)
            {
                if (m_dataManager.GetCreate().Insert<SectionGrid>(sectionGrids, out strErrorMessage) == false)
                    return false;

                List<SectionGridColumn> gridColumns = new List<SectionGridColumn>();
                gridColumns.AddRange(columns);

                List<SectionGridRow> gridRows = new List<SectionGridRow>();
                gridRows.AddRange(rows);

                if (gridColumns.Count > 0 && gridRows.Count > 0)
                {
                    if (m_dataManager.GetCreate().Insert<SectionGridColumn>(gridColumns, out strErrorMessage) == false)
                        return false;

                    if (m_dataManager.GetCreate().Insert<SectionGridRow>(gridRows, out strErrorMessage) == false)
                        return false;
                }
            }

            return true;
        }

        private bool AddStepMember(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<StepMember> stepMembers = backupDataManager.GetSelect().Select<StepMember>(null, out strErrorMessage);

            if (stepMembers == null)
                return false;

            List<StepMember> datas = new List<StepMember>();
            datas.AddRange(stepMembers);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<StepMember>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddSopCategory(IDataManager backupDataManager, Dictionary<int, int> dicUserMaps, out string strErrorMessage)
        {
            if (AddDisasterCategory(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddSubDisasterCategory(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddDisasterType(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddVersion(backupDataManager, dicUserMaps, out strErrorMessage) == false)
                return false;

            if (AddDisaster(backupDataManager, out strErrorMessage) == false)
                return false;

            if (AddActionStep(backupDataManager, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool AddActionStep(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<ActionStep> actionSteps = backupDataManager.GetSelect().Select<ActionStep>(null, out strErrorMessage);

            if (actionSteps == null)
                return false;

            List<ActionStep> datas = new List<ActionStep>();
            datas.AddRange(actionSteps);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<ActionStep>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddDisaster(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<Disaster> disasters = backupDataManager.GetSelect().Select<Disaster>(null, out strErrorMessage);

            if (disasters == null)
                return false;

            List<Disaster> datas = new List<Disaster>();
            datas.AddRange(disasters);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<Disaster>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddVersion(IDataManager backupDataManager, Dictionary<int, int> dicUserMaps, out string strErrorMessage)
        {
            IEnumerable<Version> versions = backupDataManager.GetSelect().Select<Version>(null, out strErrorMessage);

            if (versions == null)
                return false;

            int ownerUserID;
            List<Version> datas = new List<Version>();
            
            foreach (var version in versions)
            {
                if (version.OwnerID != null)
                {
                    if (dicUserMaps.TryGetValue((int)version.OwnerID, out ownerUserID) == false)
                        continue;

                    version.OwnerID = ownerUserID;
                }

                datas.Add(version);
            }

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<Version>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddDisasterType(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<DisasterType> disasterTypes = backupDataManager.GetSelect().Select<DisasterType>(null, out strErrorMessage);

            if (disasterTypes == null)
                return false;

            List<DisasterType> datas = new List<DisasterType>();
            datas.AddRange(disasterTypes);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<DisasterType>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddSubDisasterCategory(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<SubDisasterCategory> subDisasterCategories = backupDataManager.GetSelect().Select<SubDisasterCategory>(null, out strErrorMessage);

            if (subDisasterCategories == null)
                return false;

            List<SubDisasterCategory> datas = new List<SubDisasterCategory>();
            datas.AddRange(subDisasterCategories);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<SubDisasterCategory>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddDisasterCategory(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<DisasterCategory> disasterCategories = backupDataManager.GetSelect().Select<DisasterCategory>(null, out strErrorMessage);

            if (disasterCategories == null)
                return false;

            List<DisasterCategory> datas = new List<DisasterCategory>();
            datas.AddRange(disasterCategories);

            if (datas.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<DisasterCategory>(datas, out strErrorMessage);
            }

            return true;
        }

        private bool AddSopHistory(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            if (AddActionStepHistory(backupDataManager, strBeginTime, out strErrorMessage) == false)
                return false;

            if (AddActionStepHistoryAutoClose(backupDataManager, strBeginTime, out strErrorMessage) == false)
                return false;

            if (AddComponentHistory(backupDataManager, strBeginTime, out strErrorMessage) == false)
                return false;

            if (AddComponentDetailHistory(backupDataManager, strBeginTime, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool AddComponentDetailHistory(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} in (Select {4} from {5} where {6} >= '{7}'))",
                ComponentHistoryDetail.Fields.ComponentHistoryID,
                ComponentHistory.Fields.ID,
                ComponentHistory.TableName,
                ComponentHistory.Fields.ActionStepHistoryID,
                ActionStepHistory.Fields.ID,
                ActionStepHistory.TableName,
                ActionStepHistory.Fields.BeginTime, strBeginTime);

            IEnumerable<ComponentHistoryDetail> componentDetailHistories = backupDataManager.GetSelect().Select<ComponentHistoryDetail>(strCondition, out strErrorMessage);

            if (componentDetailHistories == null)
                return false;

            List<ComponentHistoryDetail> histories = new List<ComponentHistoryDetail>();
            histories.AddRange(componentDetailHistories);

            if (histories.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<ComponentHistoryDetail>(histories, out strErrorMessage);
            }

            return true;
        }

        private bool AddComponentHistory(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} >= '{4}')",
                ComponentHistory.Fields.ActionStepHistoryID,
                ActionStepHistory.Fields.ID,
                ActionStepHistory.TableName,
                ActionStepHistory.Fields.BeginTime, strBeginTime);

            IEnumerable<ComponentHistory> componentHistories = backupDataManager.GetSelect().Select<ComponentHistory>(strCondition, out strErrorMessage);

            if (componentHistories == null)
                return false;

            List<ComponentHistory> histories = new List<ComponentHistory>();
            histories.AddRange(componentHistories);

            if (histories.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<ComponentHistory>(histories, out strErrorMessage);
            }

            return true;
        }

        private bool AddActionStepHistoryAutoClose(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} >= '{4}')",
                ActionStepHistoryAutoClose.Fields.ActionStepHistoryID,
                ActionStepHistory.Fields.ID,
                ActionStepHistory.TableName,
                ActionStepHistory.Fields.BeginTime, strBeginTime);

            IEnumerable<ActionStepHistoryAutoClose> actionStepHistoryAutoCloses = backupDataManager.GetSelect().Select<ActionStepHistoryAutoClose>(strCondition, out strErrorMessage);

            if (actionStepHistoryAutoCloses == null)
                return false;

            List<ActionStepHistoryAutoClose> histories = new List<ActionStepHistoryAutoClose>();
            histories.AddRange(actionStepHistoryAutoCloses);

            if (histories.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<ActionStepHistoryAutoClose>(histories, out strErrorMessage);
            }

            return true;
        }

        private bool AddActionStepHistory(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} >= '{1}'", ActionStepHistory.Fields.BeginTime, strBeginTime);

            IEnumerable<ActionStepHistory> actionStepHistories = backupDataManager.GetSelect().Select<ActionStepHistory>(strCondition, out strErrorMessage);

            if (actionStepHistories == null)
                return false;

            List<ActionStepHistory> histories = new List<ActionStepHistory>();
            histories.AddRange(actionStepHistories);

            if (histories.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<ActionStepHistory>(histories, out strErrorMessage);
            }

            return true;
        }

        private string GetTimeString(DateTime time)
        {
            return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
        }

        private bool AddSdmsHistory(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            if (AddSensorZoneHistory(backupDataManager, strBeginTime, out strErrorMessage) == false)
                return false;

            if (AddSensorReactionHistory(backupDataManager, strBeginTime, out strErrorMessage) == false)
                return false;

            if (AddSensorReactionHistoryDescription(backupDataManager, strBeginTime, out strErrorMessage) == false)
                return false;

            if (AddCurrentAlarm(backupDataManager, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool AddCurrentAlarm(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<CurrentAlarm> alarms = backupDataManager.GetSelect().Select<CurrentAlarm>(null, out strErrorMessage);

            if (alarms == null)
                return false;

            List<CurrentAlarm> currentAlarms = new List<CurrentAlarm>();
            currentAlarms.AddRange(alarms);

            if (currentAlarms.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<CurrentAlarm>(currentAlarms, out strErrorMessage);
            }

            return true;
        }

        private bool AddSensorReactionHistoryDescription(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} >= '{4}')",
                SensorReactionHistoryDescription.Fields.SensorZoneHistoryID,
                SensorZoneHistory.Fields.ID,
                SensorZoneHistory.TableName,
                SensorZoneHistory.Fields.Time, strBeginTime);

            IEnumerable<SensorReactionHistoryDescription> sensorReactionHistoryDescriptions = backupDataManager.GetSelect().Select<SensorReactionHistoryDescription>(strCondition, out strErrorMessage);

            if (sensorReactionHistoryDescriptions == null)
                return false;

            List<SensorReactionHistoryDescription> histories = new List<SensorReactionHistoryDescription>();
            histories.AddRange(sensorReactionHistoryDescriptions);

            if (histories.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<SensorReactionHistoryDescription>(histories, out strErrorMessage);
            }

            return true;
        }

        private bool AddSensorReactionHistory(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} in (Select {1} from {2} where {3} >= '{4}')",
                SensorReactionHistory.Fields.SensorZoneHistoryID,
                SensorZoneHistory.Fields.ID,
                SensorZoneHistory.TableName,
                SensorZoneHistory.Fields.Time, strBeginTime);

            IEnumerable<SensorReactionHistory> sensorReactionHistories = backupDataManager.GetSelect().Select<SensorReactionHistory>(strCondition, out strErrorMessage);

            if (sensorReactionHistories == null)
                return false;

            List<SensorReactionHistory> histories = new List<SensorReactionHistory>();
            histories.AddRange(sensorReactionHistories);

            if (histories.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<SensorReactionHistory>(histories, out strErrorMessage);
            }

            return true;
        }

        private bool AddSensorZoneHistory(IDataManager backupDataManager, string strBeginTime, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} >= '{1}'", SensorZoneHistory.Fields.Time, strBeginTime);
            IEnumerable<SensorZoneHistory> sensorZoneHistories = backupDataManager.GetSelect().Select<SensorZoneHistory>(strCondition, out strErrorMessage);

            if (sensorZoneHistories == null)
                return false;

            List<SensorZoneHistory> histories = new List<SensorZoneHistory>();
            histories.AddRange(sensorZoneHistories);

            if (histories.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<SensorZoneHistory>(histories, out strErrorMessage);
            }

            return true;
        }

        private bool AddAccountOptions(IDataManager backupDataManager, out Dictionary<int, int> dicUserMaps, out string strErrorMessage)
        {
            // Key : BackupDB User ID
            // Value : Own DB User ID
            dicUserMaps = AddAccountUser(backupDataManager, out strErrorMessage);

            if (dicUserMaps == null)
                return false;

            if (AddAccountSession(backupDataManager, dicUserMaps, out strErrorMessage) == false)
                return false;

            if (AddAccountOption(backupDataManager, dicUserMaps, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool AddAccountOption(IDataManager backupDataManager, Dictionary<int, int> dicUserMaps, out string strErrorMessage)
        {
            IEnumerable<AccountOption> options = backupDataManager.GetSelect().Select<AccountOption>(null, out strErrorMessage);

            if (options == null)
                return false;

            int ownUserID;
            List<AccountOption> _options = new List<AccountOption>();

            foreach (var option in options)
            {
                if (dicUserMaps.TryGetValue(option.UserID, out ownUserID))
                {
                    option.UserID = ownUserID;
                    _options.Add(option);
                }
            }

            if (_options.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<AccountOption>(_options, out strErrorMessage);
            }

            return true;
        }

        private bool AddAccountSession(IDataManager backupDataManager, Dictionary<int, int> dicUserMaps, out string strErrorMessage)
        {
            IEnumerable<AccountSession> sessions = backupDataManager.GetSelect().Select<AccountSession>(null, out strErrorMessage);

            if (sessions == null)
                return false;

            int ownUserID;
            List<AccountSession> _sessions = new List<AccountSession>();

            foreach (var session in sessions)
            {
                if (dicUserMaps.TryGetValue(session.AccountUserID, out ownUserID))
                {
                    session.AccountUserID = ownUserID;
                    _sessions.Add(session);
                }
            }

            if (_sessions.Count > 0)
            {
                return m_dataManager.GetCreate().Insert<AccountSession>(_sessions, out strErrorMessage);
            }

            return true;
        }

        // Key : BackupDB User ID
        // Value : Own DB User ID
        private Dictionary<int, int> AddAccountUser(IDataManager backupDataManager, out string strErrorMessage)
        {
            IEnumerable<User> ownUsers = m_dataManager.GetSelect().Select<User>(null, out strErrorMessage);

            if (ownUsers == null)
                return null;

            IEnumerable<User> backupUsers = backupDataManager.GetSelect().Select<User>(null, out strErrorMessage);

            if (backupUsers == null)
                return null;

            int? maxID = GetMaxID(User.Fields.ID.ToString(), User.TableName, out strErrorMessage);

            if (maxID == null)
                return null;

            Dictionary<string, int> dicOwnUsers = new Dictionary<string, int>();

            foreach (var user in ownUsers)
            {
                dicOwnUsers[user.UserID] = user.ID;
            }

            // Key : BackupDB User ID
            // Value : Own DB User ID
            Dictionary<int, int> dicUserMaps = new Dictionary<int, int>();

            foreach (var user in backupUsers)
            {
                int ownUserID;

                if (dicOwnUsers.TryGetValue(user.UserID, out ownUserID))
                {
                    dicUserMaps[user.ID] = ownUserID;
                }
                else
                {
                    int originID = user.ID;
                    user.ID = (int)maxID + 1;

                    if (m_dataManager.GetCreate().Insert<User>(user, out strErrorMessage))
                        dicUserMaps[originID] = user.ID;
                    else
                        return null;
                }
            }

            return dicUserMaps;
        }

        // User 정보는 지우지 않는다.
        // User와 관련된 옵션 정보들만 삭제한다.
        private bool RemoveAccountOptions(out string strErrorMessage)
        {
            if (m_dataManager.GetDelete().Delete<AccountOption>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<AccountSession>(null, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool RemoveSdmsHistory(out string strErrorMessage)
        {
            if (m_dataManager.GetDelete().Delete<CurrentAlarm>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SMSHistory>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SensorReactionHistoryDescriptionText>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SensorReactionHistoryDescription>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SensorReactionHistory>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SensorZoneHistory>(null, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool RemoveSopHistory(out string strErrorMessage)
        {
            if (m_dataManager.GetDelete().Delete<ComponentHistoryDetail>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<ComponentHistory>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<BroadcastHistory>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<ActionStepHistoryAutoClose>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<ActionStepHistory>(null, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool RemoveSopCategory(out string strErrorMessage)
        {
            if (m_dataManager.GetDelete().Delete<ActionStep>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<Disaster>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<Version>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<DisasterType>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SubDisasterCategory>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<DisasterCategory>(null, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool RemoveSopComponent(out string strErrorMessage)
        {
            if (m_dataManager.GetDelete().Delete<Arrow>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<InternalTransmission>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<EndPoint>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<Decision>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<Annotation>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<ProcessMission>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<Process>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SectionGridColumn>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SectionGridRow>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SectionGrid>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<StepMember>(null, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool RemoveSopConfig(out string strErrorMessage)
        {
            if (m_dataManager.GetDelete().Delete<LinkedSop>(null, out strErrorMessage) == false)
                return false;
            if (m_dataManager.GetDelete().Delete<SpecialMessage>(null, out strErrorMessage) == false)
                return false;

            return true;
        }

        private bool Rollback(string strErrorMessage)
        {
            System.Diagnostics.Trace.WriteLine("Error : " + strErrorMessage);

            m_dataManager.BatchRollback(out strErrorMessage);
            return false;
        }

        private IDataManager GetBackupDbManager()
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", SdmsOption.Fields.PropertyName, DBInfoProperty);
            IEnumerable<SdmsOption> options = m_dataManager.GetSelect().Select<SdmsOption>(strCondition, out strErrorMessage);

            if (options != null)
            {
                foreach (var option in options)
                {
                    string strDecrypt = AES256Cipher.AES_decrypt(option.PropertyValue);
                    string[] tokens = strDecrypt.Split('-');

                    if (tokens.Length != 4)
                        continue;

                    string strHost = tokens[0].Trim();
                    string strName = tokens[1].Trim();
                    string strId = tokens[2].Trim();
                    string strPw = tokens[3].Trim();

                    DataManager dataManager = new DataManager(0, strHost, strName, strId, strPw);
                    return dataManager;
                }
            }

            return null;
        }

        private bool UpdateState(bool isProcessing)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}'", SdmsOption.Fields.PropertyName, TargetProperty);
            IEnumerable<SdmsOption> options = m_dataManager.GetSelect().Select<SdmsOption>(strCondition, out strErrorMessage);

            if (options != null)
            {
                foreach (SdmsOption option in options)
                {
                    option.PropertyValue = isProcessing.ToString();
                    return m_dataManager.GetUpdate().Update<SdmsOption>(option, null, out strErrorMessage);
                }
            }

            int? maxOptionID = GetMaxID(SdmsOption.Fields.ID.ToString(), SdmsOption.TableName, out strErrorMessage);

            if (maxOptionID != null)
            {
                SdmsOption option = new SdmsOption();

                option.ID = (int)maxOptionID + 1;
                option.PropertyName = TargetProperty;
                option.PropertyValue = isProcessing.ToString();
                option.SiteID = m_nSiteID;
                option.Description = "DB 자동백업이 진행중인가?";

                return m_dataManager.GetCreate().Insert<SdmsOption>(option, out strErrorMessage);
            }
            
            return false;
        }

        private int? GetMaxID(string strFieldName, string strTableName, out string strErrorMessage)
        {
            string strSQL = string.Format("Select max({0}) data from {1}", strFieldName, strTableName);
            IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (result == null)
                return null;

            foreach (var item in result)
            {
                return item.data;
            }

            return 0;
        }
    }
}
