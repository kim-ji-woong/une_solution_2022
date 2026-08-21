using System.Collections;
using System.Collections.Generic;
using TeamEditor.Model.Sop.Team;
using System;
using dnsDBUtil;

namespace SOPManager.BLL
{
    using IDAL;
    using Model.Sop.Category;
    using Model.Sop.Component;
    using Models.SOP;
    using Models.Response;
    using SOPManager.Model.Sop.Account;
    using SOPManager.BLL.Models.Request;
    using SOPManager.Model.Sop.Config;    

    public class SaveManager
    {
        private IDataManager m_dataManager = null;
        private TeamEditor.IDAL.IDataManager m_teamDataManager = null;
        private ProcessManager m_processManager = null;

        public SaveManager(IDataManager manager, TeamEditor.IDAL.IDataManager teamDataManager, ProcessManager processManager)
        {
            m_dataManager = manager;
            m_teamDataManager = teamDataManager;
            m_processManager = processManager;
        }

        public bool IsRunningVersion(int nVersionID, IDataManager dataManager)
        {
            if (m_dataManager == null)
                return false;

            string strErrorMessage;
            return dataManager.GetSelectManager().IsRunningVersion(nVersionID, out strErrorMessage);
        }

        public ResponseSave SaveXML(SOPData sopData)
        {
            string strErrorMessage;
            Dictionary<ActionStepData, bool> dicActiveActionSteps = new Dictionary<ActionStepData, bool>();

            SectionData errorSection = null;
            ActionStep errorActionStep = null;

            if (CheckSOPValidation(sopData.ActionStepDatas, dicActiveActionSteps, out errorActionStep, out errorSection, out strErrorMessage) == false)
                return GetResponseSaveXML(null, null, null, strErrorMessage, errorActionStep, errorSection);

            if (sopData.DisasterCategory == null)
                return GetResponseSaveXML(null, null, null, Resource.ID.Get("errorMessage").Value("noDisasterCategory"));

            if (sopData.SubDisasterCategory == null)
                return GetResponseSaveXML(null, null, null, Resource.ID.Get("errorMessage").Value("noSubDisasterCategory"));

            if (sopData.Disaster == null)
                return GetResponseSaveXML(null, null, null, Resource.ID.Get("errorMessage").Value("noDisaster"));

            string strXMLFileName;
            string strXML = XMLManager.Save(m_dataManager, sopData, dicActiveActionSteps, out strXMLFileName, out strErrorMessage);

            if (strXML == null || strXML.Length == 0)
                return GetResponseSaveXML(null, null, null, strErrorMessage);

            return GetResponseSaveXML(sopData, strXML, strXMLFileName, "");
        }

        private ResponseSave GetResponseSaveXML(SOPData sopData, string strXML, string strXMLFileName, string strMessage, ActionStep errorActionStep = null, SectionData errorSection = null)
        {
            ResponseSave result = new ResponseSave();

            if (sopData == null || strXML == null)
            {
                result.Success = false;
            }
            else
            {
                result.Success = true;
                result.SOPData = sopData;
                result.XMLData = strXML;
                result.XMLFileName = strXMLFileName;
            }

            result.Message = strMessage;
            result.ErrorSection = errorSection;
            result.ErrorActionStep = errorActionStep;
            return result;
        }

        public ResponseSave SaveDB(int nUserID, SOPData sopData)
        {
            ActionStep errorActionStep = null;
            SectionData errorSection = null;
            string strErrorMessage;
            Dictionary<ActionStepData, bool> dicActiveActionSteps = new Dictionary<ActionStepData, bool>();

            if (sopData.DisasterCategory.SiteID <= 0)
            {
                int? siteID = GetUserSiteID(nUserID, out strErrorMessage);

                if (siteID == null)
                    return GetResponseSaveDB(null, strErrorMessage);
                else
                    sopData.DisasterCategory.SiteID = (int)siteID;
            }

            if (CheckSOPValidation(sopData.ActionStepDatas, dicActiveActionSteps, out errorActionStep, out errorSection, out strErrorMessage) == false)
                return GetResponseSaveDB(null, strErrorMessage, errorActionStep, errorSection);

            if (sopData.DisasterCategory == null)
                return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("noDisasterCategory"));

            if (sopData.SubDisasterCategory == null)
                return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("noSubDisasterCategory"));

            if (sopData.Disaster == null)
                return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("noDisaster"));

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch() == false)
                return new ResponseSave(false, "데이터베이스 Transaction을 시작할 수 없습니다.");

            //RollbackManager rollback = new RollbackManager();

            if (CheckNSave(sopData.DisasterCategory/*, rollback*/, dataManager) == false)
            {
                dataManager.BatchRollback();
                //rollback.Rollback(m_dataManager);
                return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveDisasterCategory"));
            }

            sopData.SubDisasterCategory.DisasterCategoryID = sopData.DisasterCategory.ID;

            if (CheckNSave(sopData.SubDisasterCategory/*, rollback*/, dataManager) == false)
            {
                dataManager.BatchRollback();
                //rollback.Rollback(m_dataManager);
                return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveSubDisasterCategory"));
            }

            strErrorMessage = null;
            Version version = sopData.Version;
            sopData.Version.OwnerID = nUserID;

            if (CheckNSave(ref version, nUserID, sopData.DisasterCategory.SiteID/*, rollback*/, dataManager, ref strErrorMessage) == false)
            {
                dataManager.BatchRollback();
                //rollback.Rollback(m_dataManager);

                if (strErrorMessage != null)
                    return new ResponseSave(false, CheckTextLengthError(strErrorMessage, dataManager));
                else
                    return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveVersion"));
            }

            sopData.Disaster.VersionID = version.ID;
            sopData.Disaster.SubDisasterCategoryID = sopData.SubDisasterCategory.ID;

            if (Save(sopData.Disaster/*, rollback*/, dataManager) == false)
            {
                dataManager.BatchRollback();
                //rollback.Rollback(m_dataManager);
                return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSave"));
            }

            foreach (ActionStepData actionStepData in sopData.ActionStepDatas)
            {
                if (actionStepData.ActionStep == null || actionStepData.StepMemberDatas == null ||
                    actionStepData.StepMemberDatas.Count == 0)
                    continue;

                if (dicActiveActionSteps.ContainsKey(actionStepData) == false)
                    continue;

                actionStepData.ActionStep.DisasterID = sopData.Disaster.ID;

                if (Save(actionStepData.ActionStep/*, rollback*/, dataManager) == false)
                {
                    dataManager.BatchRollback();
                    //rollback.Rollback(m_dataManager);
                    errorActionStep = actionStepData.ActionStep;
                    return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveActionStep"));
                }

                SetSectionNumbers(actionStepData.StepMemberDatas);

                foreach (StepMemberData stepMemberData in actionStepData.StepMemberDatas)
                {
                    if (stepMemberData.StepMember == null)
                        continue;

                    stepMemberData.StepMember.ActionStepID = actionStepData.ActionStep.ID;

                    if (Save(stepMemberData.StepMember/*, rollback*/, dataManager) == false)
                    {
                        dataManager.BatchRollback();
                        //rollback.Rollback(m_dataManager);
                        errorActionStep = actionStepData.ActionStep;
                        return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveStepMember"));
                    }

                    Dictionary<Section, SectionData> dicSectionDatas = new Dictionary<Section, SectionData>();
                    Dictionary<long, Section> dicGridSections = new Dictionary<long, Section>();
                    SectionGrid grid = null;

                    int nGridRowCount, nGridColumnCount;
                    GetGridSize(stepMemberData.Sections, out nGridColumnCount, out nGridRowCount);

                    if (nGridColumnCount > 0 && nGridRowCount > 0)
                    {
                        grid = SaveGrid(stepMemberData, nGridRowCount, nGridColumnCount/*, rollback*/, dataManager);

                        if (grid == null)
                        {
                            dataManager.BatchRollback();
                            //rollback.Rollback(m_dataManager);
                            errorActionStep = actionStepData.ActionStep;
                            return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveGrid"));
                        }

                        strErrorMessage = null;
                        List<Section> sections = SectionDataToSections(stepMemberData.Sections, grid.ID, stepMemberData.StepMember.ID, dicGridSections, dicSectionDatas);

                        foreach (Section section in sections)
                        {
                            section.GridID = grid.ID;
                            section.StepMemberID = stepMemberData.StepMember.ID;

                            if (Save(section/*, rollback*/, dataManager, ref strErrorMessage) == false)
                            {
                                dataManager.BatchRollback();
                                //rollback.Rollback(m_dataManager);

                                SectionData _sectionData;

                                if (dicSectionDatas.TryGetValue(section, out _sectionData))
                                {
                                    errorSection = _sectionData;
                                    errorActionStep = actionStepData.ActionStep;
                                }

                                if (strErrorMessage != null)
                                    return new ResponseSave(false, CheckTextLengthError(strErrorMessage, dataManager));
                                else
                                    return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveSection"));
                            }

                            SectionData sectionData;

                            if (dicSectionDatas.TryGetValue(section, out sectionData))
                            {
                                sectionData.ID = section.ID;
                                sectionData.GridID = section.GridID;
                            }
                        }
                    }

                    Dictionary<Arrow, ArrowData> dicArrowDatas = new Dictionary<Arrow, ArrowData>();
                    List<Arrow> arrows = ArrowDataToArrows(stepMemberData.Arrows, dicGridSections, stepMemberData.StepMember.ID, dicArrowDatas);

                    foreach (Arrow arrow in arrows)
                    {
                        if (Save(arrow/*, rollback*/, dataManager) == false)
                        {
                            dataManager.BatchRollback();
                            errorActionStep = actionStepData.ActionStep;
                            //rollback.Rollback(m_dataManager);
                            return GetResponseSaveDB(null, Resource.ID.Get("errorMessage").Value("failSaveArrow"));
                        }

                        ArrowData arrowData;

                        if (dicArrowDatas.TryGetValue(arrow, out arrowData))
                        {
                            arrowData.ID = arrow.ID;
                            arrowData.BeginComponentID = arrow.BeginComponentID;
                            arrowData.EndComponentID = arrow.EndComponentID;
                        }
                    }
                }
            }

            dataManager.BatchCommit();
            return GetResponseSaveDB(sopData, "", errorActionStep, errorSection);
        }

        private int? GetUserSiteID(int userID, out string strErrorMessage)
        {
            User user = m_dataManager.GetSelectManager().SelectUser(userID, out strErrorMessage);

            if (user == null)
            {
                if (strErrorMessage == null)
                    strErrorMessage = "잘못된 사용자 ID입니다.";

                return null;
            }

            return user.SiteID;
        }

        private string CheckTextLengthError(string strErrorMessage, IDataManager dataManager)
        {
            string strBeginTag = "잘린 값:";
            string strEndTag = "문이 종료되었습니다.";

            int index1 = strErrorMessage.IndexOf(strBeginTag);

            if (index1 > 0)
            {
                int index2 = strErrorMessage.LastIndexOf(strEndTag);

                if (index2 > index1)
                {
                    string strTableName = "", strFieldName = "";

                    if (GetFieldInfo(strErrorMessage, ref strTableName, ref strFieldName))
                    {
                        string strMessage;
                        int nTextLength = dataManager.GetSelectManager().GetColumnMaximumLength(strTableName, strFieldName, out strMessage);

                        if (nTextLength > 0)
                        {
                            string strFieldInfo = GetFieldDescription(strTableName, strFieldName);
                            return string.Format("{0} 그 길이가 영문의 경우 {1}자를 초과할 수 없습니다.", strFieldInfo, nTextLength);
                        }
                        /*string strSQL = string.Format("SELECT CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.COLUMNS where Table_Name = '{0}' and COLUMN_NAME = '{1}'", strTableName, strFieldName);

                        string strMessage;
                        ArrayList arrDatas = dataManager.GetSelectManager().ReadQuery(strSQL, out strMessage);

                        if (arrDatas != null && arrDatas.Count > 0)
                        {
                            VariousData<int> textLength = WebDBManager.GetIntField(arrDatas[0].ToString());

                            if (textLength != null)
                            {
                                string strFieldInfo = GetFieldDescription(strTableName, strFieldName);
                                return string.Format("{0} 그 길이가 영문의 경우 {1}자를 초과할 수 없습니다.", strFieldInfo, textLength.Data);
                            }
                        }*/
                    }
                }
            }

            return strErrorMessage;
        }

        private string GetFieldDescription(string strTableName, string strFieldName)
        {
            strFieldName = strFieldName.ToLower();
            strTableName = strTableName.ToLower();

            string strComponent = "Component";

            if (strTableName.EndsWith("Transmission"))
                strComponent = "상황전파 Component";
            else if (strTableName.EndsWith("annotation"))
                return "설명 Component의 내용은";
            else if (strTableName.EndsWith("arrow"))
                return "화살표의 Text는";
            else if (strTableName.EndsWith("decision"))
                strComponent = "판단 Component";
            else if (strTableName.EndsWith("endpoint"))
                strComponent = "시작/종료 Component";
            else if (strTableName.EndsWith("process"))
                strComponent = "프로세스 Component";
            else if (strTableName.EndsWith("processexternalmission"))
                strComponent = "외부실행 Process";
            else if (strTableName.EndsWith("processmission"))
                strComponent = "프로세스 Component";
            else if (strTableName.EndsWith("version"))
            {
                if (strFieldName == "versionname")
                    return "SOP 버전명은";
                else if (strFieldName == "description")
                    return "SOP 버전의 부가설명은";
            }

            if (strFieldName == "text")
            {
                return strComponent + "의 제목은";
            }
            else if (strFieldName == "missionText")
            {
                return strComponent + "의 내용은";
            }
            else if (strFieldName == "message")
            {
                return strComponent + "의 내용은";
            }
            else if (strFieldName.Contains("script"))
            {
                return strComponent + "의 수식은";
            }
            else if (strFieldName.Contains("value"))
            {
                return strComponent + "의 text는";
            }

            return strComponent + "의 데이터는";
        }

        private bool GetFieldInfo(string strMessage, ref string strTableName, ref string strFieldName)
        {
            string strTarget1 = "dbo.";
            int index = strMessage.IndexOf(strTarget1);

            if (index > 0)
            {
                string strTarget2 = "'의 열";
                int index2 = strMessage.IndexOf(strTarget2);

                if (index2 > index)
                {
                    int index3 = strMessage.IndexOf('\'', index2 + 1);

                    if (index3 > index2)
                    {
                        int index4 = strMessage.IndexOf('\'', index3 + 1);

                        if (index4 > 0)
                        {
                            strTableName = strMessage.Substring(index + strTarget1.Length, index2 - index - strTarget1.Length);
                            strFieldName = strMessage.Substring(index3 + 1, index4 - index3 - 1);
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private void SetSectionNumbers(List<StepMemberData> stepMemberDatas)
        {
            SectionData beginSection = null;
            Dictionary<SectionData, List<SectionData>> dicLinkedSections = new Dictionary<SectionData, List<SectionData>>();

            List<SectionData> linkedSections;

            foreach (StepMemberData stepMemberData in stepMemberDatas)
            {
                Dictionary<long, SectionData> dicSections = new Dictionary<long, SectionData>();

                foreach (SectionData sectionData in stepMemberData.Sections)
                {
                    if (sectionData.ComponentType == (int)Section.SectionType.Endpoint && sectionData.IsBegin == true)
                    {
                        beginSection = sectionData;
                    }

                    long key = ((((long)sectionData.GridColumnIndex) << 32) | ((long)sectionData.GridRowIndex));
                    dicSections[key] = sectionData;
                }

                foreach (ArrowData arrowData in stepMemberData.Arrows)
                {
                    if (arrowData.BeginComponentColumnIndex >= 0 && arrowData.BeginComponentRowIndex >= 0 &&
                        arrowData.EndComponentColumnIndex >= 0 && arrowData.EndComponentRowIndex >= 0)
                    {
                        long keyBegin = ((((long)arrowData.BeginComponentColumnIndex) << 32) | ((long)arrowData.BeginComponentRowIndex));
                        long keyEnd = ((((long)arrowData.EndComponentColumnIndex) << 32) | ((long)arrowData.EndComponentRowIndex));

                        SectionData sectionBegin, sectionEnd;

                        if (dicSections.TryGetValue(keyBegin, out sectionBegin) && dicSections.TryGetValue(keyEnd, out sectionEnd))
                        {
                            if (dicLinkedSections.TryGetValue(sectionBegin, out linkedSections) == false)
                            {
                                linkedSections = new List<SectionData>();
                                dicLinkedSections[sectionBegin] = linkedSections;
                            }

                            if (linkedSections.Contains(sectionEnd) == false)
                            {
                                linkedSections.Add(sectionEnd);
                            }
                        }
                    }
                }
            }

            if (beginSection == null)
                return;

            int nSectionNumber = 1;
            beginSection.SectionNumber = nSectionNumber;
            SetSectionNumbers(beginSection, dicLinkedSections, ref nSectionNumber);
        }

        private void SetSectionNumbers(SectionData sectionData, Dictionary<SectionData, List<SectionData>> dicLinkedSections, ref int nSectionNumber)
        {
            List<SectionData> sections;

            if (dicLinkedSections.TryGetValue(sectionData, out sections))
            {
                List<SectionData> sectionDatas = new List<SectionData>();

                foreach (SectionData section in sections)
                {
                    if (section.ComponentType == (int)Section.SectionType.Annotation)
                        continue;

                    if (section.SectionNumber == null)
                    {
                        section.SectionNumber = ++nSectionNumber;
                        sectionDatas.Add(section);
                    }
                }

                foreach (SectionData section in sectionDatas)
                {
                    SetSectionNumbers(section, dicLinkedSections, ref nSectionNumber);
                }
            }
        }

        private List<Arrow> ArrowDataToArrows(List<ArrowData> arrowDatas, Dictionary<long, Section> dicGridSections, int nStepMemberID, Dictionary<Arrow, ArrowData> dicArrowDatas)
        {
            List<Arrow> arrows = new List<Arrow>();

            foreach (ArrowData arrowData in arrowDatas)
            {
                Section sectionBegin = GetSection(arrowData.BeginComponentColumnIndex, arrowData.BeginComponentRowIndex, dicGridSections);

                if (sectionBegin == null)
                    continue;

                Section sectionEnd = GetSection(arrowData.EndComponentColumnIndex, arrowData.EndComponentRowIndex, dicGridSections);

                if (sectionEnd == null)
                    continue;

                Arrow arrow = new Arrow();

                arrow.BeginComponentPosition = arrowData.BeginComponentPosition;
                arrow.BeginSection = sectionBegin;
                arrow.EndComponentPosition = arrowData.EndComponentPosition;
                arrow.EndSection = sectionEnd;
                arrow.StepMemberID = nStepMemberID;
                arrow.Text = arrowData.Text;

                arrows.Add(arrow);
                dicArrowDatas[arrow] = arrowData;
            }

            return arrows;
        }

        private Section GetSection(int nGridColumnIndex, int nGridRowIndex, Dictionary<long, Section> dicGridSections)
        {
            Section section;
            long gridIndex = (((long)nGridColumnIndex) << 32 | ((long)nGridRowIndex));

            if (dicGridSections.TryGetValue(gridIndex, out section))
                return section;

            return null;
        }

        // dicGridSections : Grid 위치별 Section들
        //                   Key => 상위 4바이트 : GridColumnIndex, 하위 4바이트 : GridRowIndex
        private List<Section> SectionDataToSections(List<SectionData> sectionDatas, int nGridID, int nStepMemberID, Dictionary<long, Section> dicGridSections, Dictionary<Section, SectionData> dicSectionDatas)
        {
            List<Section> sections = new List<Section>();

            foreach (SectionData sectionData in sectionDatas)
            {
                Section section = null;

                if (sectionData.ComponentType == (int)Section.SectionType.Annotation)
                {
                    section = MakeAnnotation(sectionData, nGridID, nStepMemberID);
                }
                else if (sectionData.ComponentType == (int)Section.SectionType.Decision)
                {
                    section = MakeDecision(sectionData, nGridID, nStepMemberID);
                }
                else if (sectionData.ComponentType == (int)Section.SectionType.Endpoint)
                {
                    section = MakeEndPoint(sectionData, nGridID, nStepMemberID);
                }
                else if (sectionData.ComponentType == (int)Section.SectionType.Internal)
                {
                    section = MakeInternal(sectionData, nGridID, nStepMemberID);
                }
                else if (sectionData.ComponentType == (int)Section.SectionType.Process)
                {
                    section = MakeProcess(sectionData, nGridID, nStepMemberID);
                }

                if (section == null)
                    continue;

                long gridIndex = (((long)section.GridColumnIndex) << 32 | ((long)section.GridRowIndex));
                dicGridSections[gridIndex] = section;

                sections.Add(section);
                dicSectionDatas[section] = sectionData;
            }

            return sections;
        }

        private Process MakeProcess(SectionData sectionData, int nGridID, int nStepMemberID)
        {
            Process process = new Process();
            MakeSection(process, sectionData, nGridID, nStepMemberID);

            process.Text = sectionData.Text;
            process.OnlyTeamLeader = sectionData.OnlyTeamLeader;
            process.AutoRun = sectionData.AutoRun == null ? false : (bool)sectionData.AutoRun;

            if (sectionData.Missions != null)
                process.Missions.AddRange(sectionData.Missions);

            if (sectionData.Receivers != null)
            {
                foreach (Receiver receiver in sectionData.Receivers)
                {
                    process.AddTeam(receiver.TeamType, receiver.TeamID);
                }
            }

            /*if (sectionData.TeamID != null && sectionData.TeamType != null)
            {
                process.AddTeam((int)sectionData.TeamType, (int)sectionData.TeamID);
            }*/

            return process;
        }

        private InternalTransmission MakeInternal(SectionData sectionData, int nGridID, int nStepMemberID)
        {
            InternalTransmission _internal = new InternalTransmission();
            MakeSection(_internal, sectionData, nGridID, nStepMemberID);

            _internal.Text = sectionData.Text;
            _internal.UseSMS = sectionData.IsSMS == null ? false : (bool)sectionData.IsSMS;
            _internal.UseBroadcast = sectionData.IsBroadcast == null ? false : (bool)sectionData.IsBroadcast;
            _internal.UseEmail = sectionData.IsEmail == null ? false : (bool)sectionData.IsEmail;
            _internal.Message = sectionData.Message;

            if (sectionData.Receivers != null)
            {
                foreach (Receiver receiver in sectionData.Receivers)
                {
                    _internal.AddTeam(receiver.TeamType, receiver.TeamID);
                }
            }

            /*if (sectionData.TeamID != null && sectionData.TeamType != null)
            {
                _internal.AddTeam((int)sectionData.TeamType, (int)sectionData.TeamID);
            }*/

            _internal.OnlyTeamLeader = sectionData.OnlyTeamLeader;
            _internal.AutoRun = sectionData.AutoRun == null ? false : (bool)sectionData.AutoRun;

            return _internal;
        }

        private EndPoint MakeEndPoint(SectionData sectionData, int nGridID, int nStepMemberID)
        {
            if (sectionData.IsBegin == null)
                return null;

            EndPoint endpoint = new EndPoint();
            MakeSection(endpoint, sectionData, nGridID, nStepMemberID);

            endpoint.Text = sectionData.Text;
            endpoint.IsBegin = (bool)sectionData.IsBegin;
            
            return endpoint;
        }

        private Decision MakeDecision(SectionData sectionData, int nGridID, int nStepMemberID)
        {
            Decision decision = new Decision();
            MakeSection(decision, sectionData, nGridID, nStepMemberID);

            decision.Text = sectionData.Text;
            decision.TeamID = sectionData.TeamID;
            decision.TeamType = sectionData.TeamType;
            decision.AutoRunScript = sectionData.AutoRunScript;
            decision.AutoRunScriptVariableTypes = sectionData.AutoRunScriptVariableTypes;
            decision.Description = sectionData.Description;

            return decision;
        }

        private Annotation MakeAnnotation(SectionData sectionData, int nGridID, int nStepMemberID)
        {
            Annotation annotation = new Annotation();
            MakeSection(annotation, sectionData, nGridID, nStepMemberID);
            annotation.Text = sectionData.Text;

            return annotation;
        }

        private void MakeSection(Section section, SectionData sectionData, int nGridID, int nStepMemberID)
        {
            section.GridID = nGridID;
            section.GridColumnIndex = sectionData.GridColumnIndex;
            section.GridRowIndex = sectionData.GridRowIndex;
            section.Width = sectionData.Width;
            section.Height = sectionData.Height;
            section.ComponentID = sectionData.ComponentID;
            section.StepMemberID = nStepMemberID;
            section.SectionNumber = sectionData.SectionNumber;
        }

        private ResponseSave GetResponseSaveDB(SOPData sopData, string strMessage, ActionStep errorActionStep = null, SectionData errorSection = null)
        {
            ResponseSave result = new ResponseSave();

            if (sopData == null)
            {
                result.Success = false;
            }
            else
            {
                result.Success = true;
                result.SOPData = sopData;
            }

            result.Message = strMessage;
            result.ErrorSection = errorSection;
            result.ErrorActionStep = errorActionStep;
            return result;
        }

        private bool CheckSOPValidation(List<ActionStepData> actionStepDatas, Dictionary<ActionStepData, bool> dicActiveActionSteps, out ActionStep errorActionStep, out SectionData errorSection, out string strErrorMessage)
        {
            errorActionStep = null;
            errorSection = null;
            int activeActionStepCount = 0;

            foreach (ActionStepData actionStepData in actionStepDatas)
            {
                if (actionStepData.StepMemberDatas.Count == 0)
                    continue;

                // SOP는 반드시 시작 Component와 종료 Component가 하나 이상씩 존재해야 한다.
                bool? begin = null, end = null;
                int nSectionCount = 0;
                SectionData sectionBegin = null;
                List<SectionData> sectionEnds = new List<SectionData>();
                List<SectionData> allSections = new List<SectionData>();
                List<ArrowData> allArrows = new List<ArrowData>();

                foreach (StepMemberData stepMemberData in actionStepData.StepMemberDatas)
                {
                    allSections.AddRange(stepMemberData.Sections);
                    allArrows.AddRange(stepMemberData.Arrows);

                    foreach (SectionData sectionData in stepMemberData.Sections)
                    {
                        nSectionCount++;
                        if (sectionData.ComponentType == (int)Section.SectionType.Endpoint)
                        {
                            if (sectionData.IsBegin != null)
                            {
                                if ((bool)sectionData.IsBegin)
                                {
                                    begin = true;

                                    if (sectionBegin == null)
                                        sectionBegin = sectionData;
                                    else
                                    {
                                        strErrorMessage = string.Format("{0}단계에 시작 컴포넌트가 하나 이상 존재합니다.\r\n시작 컴포넌트는 반드시 하나만 있어야 합니다.", actionStepData.StepName);
                                        errorSection = sectionData;
                                        errorActionStep = actionStepData.ActionStep;
                                        return false;
                                    }
                                }
                                else
                                {
                                    end = true;
                                    sectionEnds.Add(sectionData);
                                }

                                if (begin != null && end != null)
                                    break;
                            }
                        }
                    }

                    if (begin != null && end != null)
                        break;
                }

                if (nSectionCount == 0)
                    continue;

                if (begin == null || begin == false)
                {
                    strErrorMessage = string.Format(Resource.ID.Get("errorMessageFormat").Value("noBeginComponent"), actionStepData.StepName);
                    return false;
                }
                else if (end == null || end == false)
                {
                    strErrorMessage = string.Format(Resource.ID.Get("errorMessageFormat").Value("noEndComponent"), actionStepData.StepName);
                    return false;
                }

                // SOP Component들간의 연결관계를 확인한다.
                if (CheckComponentConnection(allSections, sectionBegin, sectionEnds, allArrows, out errorSection, out strErrorMessage) == false)
                {
                    errorActionStep = actionStepData.ActionStep;
                    return false;
                }

                activeActionStepCount++;
                dicActiveActionSteps[actionStepData] = true;
            }

            if (activeActionStepCount == 0)
            {
                strErrorMessage = Resource.ID.Get("errorMessage").Value("noSOPDatas");
                return false;
            }

            strErrorMessage = null;
            return true;
        }

        private bool CheckComponentConnection(List<SectionData> sections, SectionData sectionBegin, List<SectionData> sectionEnds, List<ArrowData> arrows, out SectionData errorSection, out string strErrorMessage)
        {
            errorSection = null;
            SectionOrder sectionBeginOrder = null;
            Dictionary<int, SectionOrder> dicSections = new Dictionary<int, SectionOrder>();

            foreach (SectionData sectionData in sections)
            {
                if (sectionData.ComponentType == (int)Section.SectionType.Annotation)
                    continue;

                int key = GetSectionKey(sectionData);
                //int componentID = (sectionData.ComponentType << 24) | sectionData.ID;

                SectionOrder sectionOrder = new SectionOrder(sectionData);
                dicSections[key] = sectionOrder;

                if (sectionData == sectionBegin)
                    sectionBeginOrder = sectionOrder;
            }

            Dictionary<SectionData, SectionOrder> dicNextSections = new Dictionary<SectionData, SectionOrder>();

            foreach (ArrowData arrow in arrows)
            {
                SectionOrder section1, section2;

                if (dicSections.TryGetValue(GetArrowKey(arrow, true), out section1) && dicSections.TryGetValue(GetArrowKey(arrow, false), out section2))
                //if (dicSections.TryGetValue(arrow.BeginComponentID, out section1) && dicSections.TryGetValue(arrow.EndComponentID, out section2))
                {
                    if (section1.NextSections.Contains(section2) == false)
                    {
                        section1.NextSections.Add(section2);
                        dicNextSections[section2.SectionData] = section2;
                    }
                }
            }

            Dictionary<SectionOrder, SectionOrder> dicSectionOrders = new Dictionary<SectionOrder, SectionOrder>();
            
            if (GoToSectionEnd(sectionBeginOrder, dicSectionOrders) == false)
            {
                strErrorMessage = "시작 컴포넌트로부터 종료 컴포넌트까지 연결되어 있지 않습니다.";
                return false;
            }

            foreach (SectionData section in sections)
            {
                if (section.ComponentType == (int)Section.SectionType.Annotation)
                    continue;

                if (section == sectionBeginOrder.SectionData)
                    continue;

                if (dicNextSections.ContainsKey(section) == false)
                {
                    strErrorMessage = string.Format("연결되어 있지 않은 컴포넌트가 존재합니다.({0}, {1})", GetComponentTypeName(section), section.Text);
                    errorSection = section;
                    return false;
                }
            }

            strErrorMessage = null;
            return true;
        }

        private string GetComponentTypeName(SectionData sectionData)
        {
            if (sectionData.ComponentType == (int)Section.SectionType.Annotation)
                return "설명 Component";
            else if (sectionData.ComponentType == (int)Section.SectionType.Decision)
                return "판단 Component";
            else if (sectionData.ComponentType == (int)Section.SectionType.Endpoint)
                return "시작/종료 Component";
            else if (sectionData.ComponentType == (int)Section.SectionType.Internal)
                return "상황전파 Component";
            else if (sectionData.ComponentType == (int)Section.SectionType.Process)
                return "프로세스 Component";

            return "";
        }

        private int GetSectionKey(SectionData section)
        {
            return (section.GridColumnIndex << 16) | section.GridRowIndex;
        }

        private int GetArrowKey(ArrowData arrow, bool isBegin)
        {
            if (isBegin)
                return (arrow.BeginComponentColumnIndex << 16) | arrow.BeginComponentRowIndex;

            return (arrow.EndComponentColumnIndex << 16) | arrow.EndComponentRowIndex;
        }

        private bool GoToSectionEnd(SectionOrder section, Dictionary<SectionOrder, SectionOrder> dicSections)
        {
            foreach (SectionOrder next in section.NextSections)
            {
                if (next.SectionData.ComponentType == (int)Section.SectionType.Endpoint)
                {
                    if (next.SectionData.IsBegin != null && ((bool)next.SectionData.IsBegin) == false)
                        return true;
                }

                if (dicSections.ContainsKey(next))
                    continue;
                else
                {
                    dicSections[next] = next;

                    if (GoToSectionEnd(next, dicSections))
                        return true;
                }
            }

            return false;
        }

        /*private bool SaveSOP(int nUserID, DisasterCategory dc, SubDisasterCategory sdc, Disaster disaster, ref Version version, Dictionary<ActionStep, List<StepMember>> dicActionSteps, Dictionary<StepMember, List<Section>> dicStepMemberSections, Dictionary<StepMember, List<Arrow>> dicStepMemberArrows)
        {
            if (m_dataManager == null || m_dataManager.GetCreateManager() == null)
                return false;

            if (dc == null || sdc == null || disaster == null)
                return false;

            RollbackManager rollback = new RollbackManager();

            if (CheckNSave(dc, rollback) == false)
                return false;

            sdc.DisasterCategoryID = dc.ID;

            if (CheckNSave(sdc, rollback) == false)
            {
                rollback.Rollback(m_dataManager);
                return false;
            }

            if (CheckNSave(ref version, nUserID, rollback) == false)
            {
                rollback.Rollback(m_dataManager);
                return false;
            }

            disaster.VersionID = version.ID;
            disaster.SubDisasterCategoryID = sdc.ID;

            if (Save(disaster, rollback) == false)
            {
                rollback.Rollback(m_dataManager);
                return false;
            }

            foreach (KeyValuePair<ActionStep, List<StepMember>> pair in dicActionSteps)
            {
                pair.Key.DisasterID = disaster.ID;

                if (Save(pair.Key, rollback) == false)
                {
                    rollback.Rollback(m_dataManager);
                    return false;
                }

                foreach (StepMember stepMember in pair.Value)
                {
                    stepMember.ActionStepID = pair.Key.ID;

                    if (Save(stepMember, rollback) == false)
                    {
                        rollback.Rollback(m_dataManager);
                        return false;
                    }

                    List<Section> sections;
                    List<Arrow> arrows;
                    SectionGrid grid = null;

                    if (dicStepMemberSections.TryGetValue(stepMember, out sections))
                    {
                        int nGridRowCount, nGridColumnCount;
                        GetGridSize(sections, out nGridColumnCount, out nGridRowCount);

                        if (nGridColumnCount > 0 && nGridRowCount > 0)
                        {
                            grid = SaveGrid(stepMember.ID, nGridRowCount, nGridColumnCount, rollback);

                            if (grid == null)
                                return false;

                            foreach (Section section in sections)
                            {
                                section.GridID = grid.ID;
                                section.StepMemberID = stepMember.ID;

                                if (Save(section, rollback) == false)
                                {
                                    rollback.Rollback(m_dataManager);
                                    return false;
                                }
                            }
                        }
                    }

                    if (grid != null && dicStepMemberArrows.TryGetValue(stepMember, out arrows))
                    {
                        foreach (Arrow arrow in arrows)
                        {
                            arrow.StepMemberID = stepMember.ID;

                            if (Save(arrow, rollback) == false)
                            {
                                rollback.Rollback(m_dataManager);
                                return false;
                            }
                        }
                    }
                }
            }

            return true;
        }*/

        private SectionGrid SaveGrid(StepMemberData stepMemberData, int nGridRowCount, int nGridColumnCount/*, RollbackManager rollback*/, IDataManager dataManager)
        {
            int nStepMemberID = stepMemberData.StepMember.ID;

            ICreate createManager = dataManager.GetCreateManager();
            SectionGrid grid = createManager.CreateGrid(nStepMemberID);

            if (grid == null)
                return null;
            /*else
            {
                IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", SectionGrid.TableName, grid.ID)) == false)
                    return null;

                rollback.AddData(rollbackData);
            }*/

            //int nDefaultCellWidth = 300;
            //int nDefaultCellHeight = 200;

            /*IRollbackData _rollbackData = dataManager.MakeRollbackDataInstance();

            if (_rollbackData.AddDeleteRollback(string.Format("Delete from {0} where GridID = {1}", SectionGridRow.TableName, grid.ID)) == false)
                return null;

            rollback.AddData(_rollbackData);

            _rollbackData = dataManager.MakeRollbackDataInstance();

            if (_rollbackData.AddDeleteRollback(string.Format("Delete from {0} where GridID = {1}", SectionGridColumn.TableName, grid.ID)) == false)
                return null;

            rollback.AddData(_rollbackData);*/

            for (int i=0;i<nGridRowCount;i++)
            {
                int nCellHeight = stepMemberData.GridRowHeight[i];
                SectionGridRow row = createManager.CreateGridRow(grid.ID, i, nCellHeight/*nDefaultCellHeight*/);

                if (row == null)
                    return null;
            }

            for (int i = 0; i < nGridColumnCount; i++)
            {
                int nCellWidth = stepMemberData.GridColumnWidth[i];
                SectionGridColumn column = createManager.CreateGridColumn(grid.ID, i, nCellWidth/*nDefaultCellWidth*/);

                if (column == null)
                    return null;
            }

            return grid;
        }

        private void GetGridSize(List<SectionData> sectionDatas, out int nGridColumnCount, out int nGridRowCount)
        {
            int nMaxColumnIndex = -1, nMaxRowIndex = -1;

            foreach (SectionData sectionData in sectionDatas)
            {
                if (sectionData.GridColumnIndex > nMaxColumnIndex)
                    nMaxColumnIndex = sectionData.GridColumnIndex;

                if (sectionData.GridRowIndex > nMaxRowIndex)
                    nMaxRowIndex = sectionData.GridRowIndex;
            }

            nGridColumnCount = nMaxColumnIndex + 1;
            nGridRowCount = nMaxRowIndex + 1;
        }

        private bool Save(Arrow arrow/*, RollbackManager rollback*/, IDataManager dataManager)
        {
            if (arrow.MakeComponentID() == false)
                return false;

            Arrow _arrow = dataManager.GetCreateManager().CreateArrow(arrow.BeginComponentID, arrow.BeginComponentPosition, arrow.EndComponentID, arrow.EndComponentPosition, arrow.StepMemberID, arrow.Text);

            if (_arrow == null)
                return false;
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", Arrow.TableName, _arrow.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                arrow.ID = _arrow.ID;
            }

            return true;
        }

        private bool Save(Section section/*, RollbackManager rollback*/, IDataManager dataManager, ref string strErrorMessage)
        {
            if (section.ComponentType == (int)Section.SectionType.Annotation)
                return SaveAnnotation((Annotation)section/*, rollback*/, dataManager, ref strErrorMessage);
            else if (section.ComponentType == (int)Section.SectionType.Decision)
                return SaveDecision((Decision)section/*, rollback*/, dataManager, ref strErrorMessage);
            else if (section.ComponentType == (int)Section.SectionType.Endpoint)
                return SaveEndpoint((EndPoint)section/*, rollback*/, dataManager, ref strErrorMessage);
            else if (section.ComponentType == (int)Section.SectionType.Internal)
                return SaveInternal((InternalTransmission)section/*, rollback*/, dataManager, ref strErrorMessage);
            else if (section.ComponentType == (int)Section.SectionType.Process)
                return SaveProcess((Process)section/*, rollback*/, dataManager, ref strErrorMessage);

            return true;
        }

        private bool SaveProcess(Process process/*, RollbackManager rollback*/, IDataManager dataManager, ref string strErrorMessage)
        {
            Process _process = dataManager.GetCreateManager().CreateProcess(process.GridID, process.GridRowIndex, process.GridColumnIndex, process.Width, process.Height, process.Text, process.TeamList, process.ComponentID, process.StepMemberID, process.AutoRun, process.OnlyTeamLeader, process.SectionNumber);

            if (_process == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", Process.TableName, _process.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                process.ID = _process.ID;

                foreach (ProcessMissionData missionData in process.Missions)
                {
                    if (missionData.MissionType == ProcessMissionData.MissionDataType.Normal)
                    {
                        ProcessMission _mission = dataManager.GetCreateManager().CreateProcessMission(missionData.MissionText, process.ID);

                        if (_mission == null)
                        {
                            strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                            return false;
                        }
                        else
                        {
                            /*rollbackData = dataManager.MakeRollbackDataInstance();

                            if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", ProcessMission.TableName, _mission.ID)) == false)
                                return false;

                            rollback.AddData(rollbackData);*/
                            missionData.ID = _mission.ID;
                            missionData.ProcessID = _mission.ProcessID;
                        }
                    }
                    else if (missionData.MissionType == ProcessMissionData.MissionDataType.External)
                    {
                        List<ProcessExternalMission> externalMissions = ProcessMissionDataSorter.GetExternalMissions(missionData);

                        if (externalMissions == null)
                            return false;

                        foreach (ProcessExternalMission externalMission in externalMissions)
                        {
                            ProcessExternalMission _externalMission = dataManager.GetCreateManager().CreateProcessExternalMission(process.ID, externalMission.OrderIndex, externalMission.ProgramID, externalMission.ParameterIndex, externalMission.Value);

                            if (_externalMission == null)
                            {
                                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                                return false;
                            }
                            /*else
                            {
                                bool isNullable;
                                rollbackData = dataManager.MakeRollbackDataInstance();

                                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where {1} = {2} and {3} = {4} and {5} = {6} and {7} = {8}",
                                        ProcessExternalMission.TableName,
                                        ProcessExternalMission.GetFieldName(ProcessExternalMission.Fields.ProcessID, out isNullable),
                                        _externalMission.ProcessID,
                                        ProcessExternalMission.GetFieldName(ProcessExternalMission.Fields.OrderIndex, out isNullable),
                                        _externalMission.OrderIndex,
                                        ProcessExternalMission.GetFieldName(ProcessExternalMission.Fields.ProgramID, out isNullable),
                                        _externalMission.ProgramID,
                                        ProcessExternalMission.GetFieldName(ProcessExternalMission.Fields.ParameterIndex, out isNullable),
                                        _externalMission.ParameterIndex)) == false)
                                    return false;

                                rollback.AddData(rollbackData);
                            }*/
                        }
                    }
                }
            }

            return true;
        }

        private bool SaveInternal(InternalTransmission internalSection/*, RollbackManager rollback*/, IDataManager dataManager, ref string strErrorMessage)
        {
            InternalTransmission _internal = dataManager.GetCreateManager().CreateInternalTransmission(internalSection.GridID, internalSection.GridRowIndex, internalSection.GridColumnIndex, internalSection.Width, internalSection.Height, internalSection.Text, internalSection.ComponentID, internalSection.UseSMS, internalSection.UseBroadcast, internalSection.UseEmail == null ? false : (bool)internalSection.UseEmail, internalSection.StepMemberID, internalSection.AutoRun, internalSection.Message, internalSection.TeamList, internalSection.UseSiren, internalSection.OnlyTeamLeader, internalSection.SectionNumber);

            if (_internal == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", InternalTransmission.TableName, _internal.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                internalSection.ID = _internal.ID;
            }

            return true;
        }

        private bool SaveEndpoint(EndPoint endpoint/*, RollbackManager rollback*/, IDataManager dataManager, ref string strErrorMessage)
        {
            EndPoint _endpoint = dataManager.GetCreateManager().CreateEndPoint(endpoint.GridID, endpoint.GridRowIndex, endpoint.GridColumnIndex, endpoint.Width, endpoint.Height, endpoint.Text, endpoint.ComponentID, endpoint.IsBegin, endpoint.StepMemberID, endpoint.SectionNumber);

            if (_endpoint == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", EndPoint.TableName, _endpoint.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                endpoint.ID = _endpoint.ID;
            }

            return true;
        }

        private bool SaveDecision(Decision decision/*, RollbackManager rollback*/, IDataManager dataManager, ref string strErrorMessage)
        {
            Decision _decision = dataManager.GetCreateManager().CreateDecision(decision.GridID, decision.GridRowIndex, decision.GridColumnIndex, decision.Width, decision.Height, decision.Text, decision.ComponentID, decision.StepMemberID, decision.TeamID, decision.TeamType, decision.SectionNumber, decision.Description, null, null, null, null, null, null, null, decision.AutoRunScript, decision.AutoRunScriptVariableTypes);

            if (_decision == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", Decision.TableName, _decision.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                decision.ID = _decision.ID;
            }

            return true;
        }

        private bool SaveAnnotation(Annotation annotation/*, RollbackManager rollback*/, IDataManager dataManager, ref string strErrorMessage)
        {
            Annotation _annotation = dataManager.GetCreateManager().CreateAnnotation(annotation.GridID, annotation.GridRowIndex, annotation.GridColumnIndex, annotation.Width, annotation.Height, annotation.Text, annotation.ComponentID, annotation.StepMemberID, annotation.SectionNumber);

            if (_annotation == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return false;
            }
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", Annotation.TableName, _annotation.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                annotation.ID = _annotation.ID;
            }

            return true;
        }

        private bool Save(StepMember stepMember/*, RollbackManager rollback*/, IDataManager dataManager)
        {
            if (stepMember.TeamType < 0)
            {
                object originDBManager = m_teamDataManager.GetDBManager();
                m_teamDataManager.SetDBManager(((SOPManager.DAL.DataManager)dataManager).GetDBManager());

                string strErrorMessage;
                List<Regular> regularTeams = m_teamDataManager.GetSelectManager().SelectRegulars(out strErrorMessage);

                if (strErrorMessage != null || regularTeams == null)
                {
                    m_teamDataManager.SetDBManager(originDBManager);
                    return false;
                }

                if (regularTeams.Count == 0)
                {
                    m_teamDataManager.SetDBManager(originDBManager);
                    return false;
                }

                stepMember.TeamType = (int)StepMember.MemberTeamType.RegularTeam;
                stepMember.TeamID = regularTeams[0].ID;

                m_teamDataManager.SetDBManager(originDBManager);
            }

            StepMember _stepMember = dataManager.GetCreateManager().CreateStepMember(stepMember.TeamID, stepMember.TeamType, stepMember.ActionStepID);

            if (_stepMember == null)
                return false;
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", StepMember.TableName, _stepMember.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                stepMember.ID = _stepMember.ID;
            }

            return true;
        }

        private bool Save(ActionStep actionStep/*, RollbackManager rollback*/, IDataManager dataManager)
        {
            if (actionStep.StepName.Length == 0)
                return false;

            ActionStep _actionStep = dataManager.GetCreateManager().CreateActionStep(actionStep.StepName, actionStep.DisasterID);

            if (_actionStep == null)
                return false;
            else
            {
                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", ActionStep.TableName, _actionStep.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                actionStep.ID = _actionStep.ID;
            }
 
            return true;
        }

        private bool Save(Disaster disaster/*, RollbackManager rollback*/, IDataManager dataManager)
        {
            if (disaster.DisasterName == null || disaster.DisasterName.Length == 0)
                return false;

            Disaster _disaster = dataManager.GetCreateManager().CreateDisaster(disaster.DisasterName, disaster.SubDisasterCategoryID, disaster.VersionID);

            if (_disaster == null)
                return false;
            else
            {
                /*IRollbackData rollbackData = m_dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", Disaster.TableName, _disaster.ID)) == false)
                    return false;

                rollback.AddData(rollbackData);*/
                disaster.ID = _disaster.ID;
            }

            return true;
        }

        // DB에 저장되어 있는지 확인하여, 이미 저장되어 있으면 그냥 true를 리턴하고 빠져나온다.
        // 그렇지 않다면 rollback에 RollbackData를 넣은후 DB에 값을 저장한다.
        private bool CheckNSave(ref Version version, int nUserID, int nSiteID/*, RollbackManager rollback*/, IDataManager dataManager, ref string strErrorMessage)
        {
            if (version == null || version.ID < 0)
            {
                string strVersionName = "V1.0";
                bool isNormal = true;
                string strDescription = null;

                if (version != null)
                {
                    strVersionName = version.VersionName.Length > 0 ? version.VersionName : "V1.0";
                    isNormal = version.IsNormal;
                    strDescription = version.Description;
                }

                System.DateTime dtNow = System.DateTime.Now;

                Version _version = dataManager.GetCreateManager().CreateVersion(isNormal, dtNow, dtNow, strVersionName, nUserID, nSiteID, strDescription);

                if (_version == null)
                {
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return false;
                }
                else
                {
                    /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                    if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", Version.TableName, _version.ID)) == false)
                        return false;

                    rollback.AddData(rollbackData);*/
                    version = _version;
                }
            }
            else
            {
                string strPrevTime = string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", version.LastAccessTime.Year, version.LastAccessTime.Month, version.LastAccessTime.Day, version.LastAccessTime.Hour, version.LastAccessTime.Minute, version.LastAccessTime.Second);

                System.DateTime dtNow = System.DateTime.Now;
                version.LastAccessTime = dtNow;
                version.SiteID = nSiteID;

                /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                if (rollbackData.AddUpdateRollback(string.Format("Update {0} set LastAccessTime = '{1}' where ID = {2}", Version.TableName, strPrevTime, version.ID)) == false)
                    return false;*/

                if (dataManager.GetUpdateManager().UpdateVersion(version, "ID = " + version.ID.ToString()) == false)
                {
                    strErrorMessage = dataManager.GetUpdateManager().GetErrorMessage();
                    return false;
                }

                //rollback.AddData(rollbackData);

                // 기존 버전을 삭제한다.
                if (m_processManager.GetDeleteManager().DeleteSOPVersion(version.ID, false/*, rollback*/, true, dataManager, out strErrorMessage) == false)
                    //if (m_processManager.GetDeleteManager().DeleteSOPVersion(version.ID, false, rollback, true) == false)
                    return false;
            }

            return true;
        }

        // DB에 저장되어 있는지 확인하여, 이미 저장되어 있으면 그냥 true를 리턴하고 빠져나온다.
        // 그렇지 않다면 rollback에 RollbackData를 넣은후 DB에 값을 저장한다.
        private bool CheckNSave(SubDisasterCategory sdc/*, RollbackManager rollback*/, IDataManager dataManager)
        {
            if (sdc.ID < 0)
            {
                if (sdc.SubCategoryName == null || sdc.SubCategoryName.Length == 0)
                    return false;

                Dictionary<SubDisasterCategory.Fields, object> dicCondition = new Dictionary<SubDisasterCategory.Fields, object>();
                dicCondition[SubDisasterCategory.Fields.SubCategoryName] = sdc.SubCategoryName;
                dicCondition[SubDisasterCategory.Fields.DisasterCategoryID] = sdc.DisasterCategoryID;

                string strErrorMessage;
                List<SubDisasterCategory> subDisasterCategories = dataManager.GetSelectManager().SelectSubDisasterCategories(dicCondition, out strErrorMessage);

                if (subDisasterCategories == null)
                    return false;

                if (subDisasterCategories.Count > 0)
                {
                    sdc.ID = subDisasterCategories[0].ID;
                }
                else
                {
                    SubDisasterCategory _sdc = dataManager.GetCreateManager().CreateSubDisasterCategory(sdc.DisasterCategoryID, sdc.SubCategoryName);

                    if (_sdc == null)
                        return false;
                    else
                    {
                        /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                        if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", SubDisasterCategory.TableName, _sdc.ID)) == false)
                            return false;

                        rollback.AddData(rollbackData);*/
                        sdc.ID = _sdc.ID;
                    }
                }
            }

            return true;
        }

        // DB에 저장되어 있는지 확인하여, 이미 저장되어 있으면 그냥 true를 리턴하고 빠져나온다.
        // 그렇지 않다면 rollback에 RollbackData를 넣은후 DB에 값을 저장한다.
        private bool CheckNSave(DisasterCategory dc/*, RollbackManager rollback*/, IDataManager dataManager)
        {
            if (dc.ID < 0)
            {
                if (dc.CategoryName == null || dc.CategoryName.Length == 0)
                    return false;

                Dictionary<DisasterCategory.Fields, object> dicCondition = new Dictionary<DisasterCategory.Fields, object>();
                dicCondition[DisasterCategory.Fields.CategoryName] = dc.CategoryName;
                dicCondition[DisasterCategory.Fields.SiteID] = dc.SiteID;

                string strErrorMessage;
                List<DisasterCategory> disasterCategories = dataManager.GetSelectManager().SelectDisasterCategories(dicCondition, out strErrorMessage);

                if (disasterCategories == null)
                    return false;

                if (disasterCategories.Count > 0)
                {
                    dc.ID = disasterCategories[0].ID;
                }
                else
                {
                    DisasterCategory _dc = dataManager.GetCreateManager().CreateDisasterCategory(dc.CategoryName, m_dataManager.SiteID);

                    if (_dc == null)
                        return false;
                    else
                    {
                        /*IRollbackData rollbackData = dataManager.MakeRollbackDataInstance();

                        if (rollbackData.AddDeleteRollback(string.Format("Delete from {0} where ID = {1}", DisasterCategory.TableName, _dc.ID)) == false)
                            return false;

                        rollback.AddData(rollbackData);*/
                        dc.ID = _dc.ID;
                    }
                }
            }

            return true;
        }

        public ResponseOption SaveAccountOption(SOPManager.Model.Sop.Account.Option option)
        {
            string strErrorMessage = null;
            Option result = null;

            if (option.ID <= 0)
            {
                int? id = GetAccountOptionID(option, out strErrorMessage);

                if (id == null && strErrorMessage != null)
                {
                    ResponseOption response = new ResponseOption();
                    response.Success = false;
                    response.Message = strErrorMessage;
                    return response;
                }
            }

            if (option.ID <= 0)
            {   // 없으면 생성
                result = m_dataManager.GetCreateManager().CreateOption(option.UserID, option.Category, option.SubCategory, option.PropertyValue1, option.PropertyValue2, option.PropertyValue3, option.PropertyValue4);
            }
            else
            {   // 있으면 업데이트
                m_dataManager.GetUpdateManager().UpdateOption(option);
                result = m_dataManager.GetSelectManager().SelectOption(option.ID, out strErrorMessage);                
            }

            ResponseOption res = new ResponseOption();
            if (result == null)
            {
                res.Success = false;
                res.Message = strErrorMessage;
            }
            else
            {
                res.Success = true;
                if (res.Options == null)
                    res.Options = new List<Option>();
                res.Options.Add(result);
            }

            return res;
        }

        private int? GetAccountOptionID(Model.Sop.Account.Option option, out string strErrorMessage)
        {
            Dictionary<Model.Sop.Account.Option.Fields, object> dicConditions = new Dictionary<Option.Fields, object>();
            dicConditions[Model.Sop.Account.Option.Fields.UserID] = option.UserID;
            dicConditions[Model.Sop.Account.Option.Fields.Category] = option.Category;
            dicConditions[Model.Sop.Account.Option.Fields.SubCategory] = option.SubCategory;

            List<Model.Sop.Account.Option> options = m_dataManager.GetSelectManager().SelectOptions(dicConditions, out strErrorMessage);

            if (options == null || options.Count == 0)
                return null;

            option.ID = options[0].ID;
            return option.ID;
        }

        public MessageResult SaveLinkedSOPs(RequestSaveLinkedSOPs req)
        {
            MessageResult res = new MessageResult();

            if (req.LinkedSopDatas == null)
            {
                res.Message = "저장할 데이터가 잘못됨";
                return res;
            }

            IDataManager dataManager = m_dataManager;//.Clone();
            try
            {
                //if (dataManager.BeginBatch() == false)
                //{
                //    res.Message = "트랜잭션 실행 실패";
                //    return res;
                //}
                int nSiteID = req.SiteID;

                string strError = null;
                List<int> linkIDs = new List<int>();
                foreach (LinkedSopData item in req.LinkedSopDatas)
                {
                    LinkedSop temp = new LinkedSop()
                    {
                        ID = item.LinkID,
                        FacilityTypeID = item.FacilityTypeID,
                        DisasterCategoryID = item.DisasterCategoryID,
                        SubDisasterCategoryID = item.SubDisasterCategoryID,
                        DisasterName = item.DisasterName,
                        LinkedBuildingGroupID = item.LinkedBuildingGroupID,
                        LinkedBuildingID = item.LinkedBuildingID,
                        LinkedZoneID = item.LinkedZoneID,
                        //SiteID = item.SiteID
                        SiteID = nSiteID
                    };

                    if (item.LinkID <= 0)
                    {
                        LinkedSop createLinkedSop = dataManager.GetCreateManager().CreateLinkedSop(
                            item.FacilityTypeID, item.DisasterCategoryID, item.SubDisasterCategoryID, item.DisasterName, item.LinkedBuildingGroupID, item.LinkedBuildingID, item.LinkedZoneID, "", nSiteID);
                        if (createLinkedSop == null)
                            throw new ApplicationException(strError);

                        temp.ID = createLinkedSop.ID;
                    }
                    else
                    {
                        if (!dataManager.GetUpdateManager().UpdateLinkedSop(temp))
                            throw new ApplicationException(strError);
                    }

                    linkIDs.Add(temp.ID);
                }

                string strQuery = $"SiteID={nSiteID}";
                if (linkIDs.Count > 0)
                    strQuery += $" and ID not in ({string.Join(",", linkIDs)})";

                if (!dataManager.GetDeleteManager().DeleteLinkedSop(strQuery))
                    throw new ApplicationException("신호별 SOP 링크 삭제 실패");
                
                //dataManager.BatchCommit();

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                //dataManager.BatchRollback();
                res.Message = ex.Message;
                return res;
            }
        }

        // DB에 저장할 수 있는 문제없는 Section인지 검사한다.
        public MessageResult CheckSectionData(CheckSectionData data)
        {
            SectionData sectionData = data.SectionData;

            if (sectionData == null)
                return new MessageResult(false, "Component 정보가 존재하지 않습니다.");

            if (sectionData.ComponentType < 0)
                return CheckArrowData(data);

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch() == false)
                return new MessageResult(false, "데이터베이스 Transaction을 시작할 수 없습니다.");

            string strErrorMessage = null;
            Section section = null;
            SectionGrid grid = MakeTempGrid(data.StepMemberID, data.UserID, dataManager, ref strErrorMessage);
            //SectionGrid grid = m_dataManager.GetCreateManager().CreateGrid(data.StepMemberID);

            if (grid == null)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, strErrorMessage);
            }

            for (int i = 0; i <= sectionData.GridRowIndex; i++)
            {
                int nCellHeight = 100;
                SectionGridRow row = dataManager.GetCreateManager().CreateGridRow(grid.ID, i, nCellHeight);

                if (row == null)
                {
                    dataManager.BatchRollback();
                    return new MessageResult(false, dataManager.GetCreateManager().GetErrorMessage());
                }
            }

            for (int i = 0; i <= sectionData.GridColumnIndex; i++)
            {
                int nCellWidth = 100;
                SectionGridColumn column = dataManager.GetCreateManager().CreateGridColumn(grid.ID, i, nCellWidth);

                if (column == null)
                {
                    dataManager.BatchRollback();
                    return new MessageResult(false, dataManager.GetCreateManager().GetErrorMessage());
                }
            }

            if (sectionData.ComponentType == (int)Section.SectionType.Annotation)
            {
                section = MakeAnnotation(sectionData, grid.ID, grid.StepMemberID);
            }
            else if (sectionData.ComponentType == (int)Section.SectionType.Decision)
            {
                section = MakeDecision(sectionData, grid.ID, grid.StepMemberID);
            }
            else if (sectionData.ComponentType == (int)Section.SectionType.Endpoint)
            {
                section = MakeEndPoint(sectionData, grid.ID, grid.StepMemberID);
            }
            else if (sectionData.ComponentType == (int)Section.SectionType.Internal)
            {
                section = MakeInternal(sectionData, grid.ID, grid.StepMemberID);
            }
            else if (sectionData.ComponentType == (int)Section.SectionType.Process)
            {
                section = MakeProcess(sectionData, grid.ID, grid.StepMemberID);
            }

            if (section == null)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, "알려지지 않은 Component 타입입니다.");
            }

            //RollbackManager rollback = new RollbackManager();

            if (Save(section/*, rollback*/, dataManager, ref strErrorMessage) == false)
            {
                dataManager.BatchRollback();
                return new MessageResult(false, CheckTextLengthError(strErrorMessage, dataManager));
            }

            // 실제로 저장하려는 것이 아니라 검사만 하는 것이므로 Transaction을 취소한다.
            dataManager.BatchRollback();
            return new MessageResult(true, "");
        }

        // DB에 저장할 수 있는 문제없는 화살표인지 검사한다.
        public MessageResult CheckArrowData(CheckSectionData data)
        {
            if (data.SectionData.Text == null || data.SectionData.Text.Length == 0)
                return new MessageResult(true, "");

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch() == false)
                return new MessageResult(false, "데이터베이스 Transaction을 시작할 수 없습니다.");

            if (data.StepMemberID > 0)
            {
                Arrow arrow = dataManager.GetCreateManager().CreateArrow(0, 0, 0, 0, data.StepMemberID, data.SectionData.Text);

                if (arrow == null)
                {
                    dataManager.BatchRollback();
                    return new MessageResult(false, CheckTextLengthError(dataManager.GetCreateManager().GetErrorMessage(), dataManager));
                }
            }
            else
            {
                string strErrorMessage;
                List<DisasterCategory> disasterCategories = dataManager.GetSelectManager().SelectDisasterCategories(out strErrorMessage);

                if (disasterCategories == null)
                    return null;

                DisasterCategory disasterCategory = null;

                if (disasterCategories.Count == 0)
                {
                    disasterCategory = dataManager.GetCreateManager().CreateDisasterCategory("Temp", dataManager.SiteID);

                    if (disasterCategory == null)
                    {
                        dataManager.BatchRollback();
                        strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                        return new MessageResult(false, strErrorMessage);
                    }
                }
                else
                    disasterCategory = disasterCategories[0];

                List<SubDisasterCategory> subDisasterCategories = dataManager.GetSelectManager().SelectSubDisasterCategories(disasterCategory, out strErrorMessage);

                if (subDisasterCategories == null)
                    return null;

                SubDisasterCategory subDisasterCategory = null;

                if (subDisasterCategories.Count == 0)
                {
                    subDisasterCategory = dataManager.GetCreateManager().CreateSubDisasterCategory(disasterCategory.ID, "Temp");

                    if (subDisasterCategory == null)
                    {
                        dataManager.BatchRollback();
                        strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                        return new MessageResult(false, strErrorMessage);
                    }
                }
                else
                    subDisasterCategory = subDisasterCategories[0];

                Version version = dataManager.GetCreateManager().CreateVersion(true, DateTime.Now, DateTime.Now, "Temp", data.UserID, dataManager.SiteID);

                if (version == null)
                {
                    dataManager.BatchRollback();
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return new MessageResult(false, strErrorMessage);
                }

                Disaster disaster = dataManager.GetCreateManager().CreateDisaster("Temp", subDisasterCategory.ID, version.ID);

                if (disaster == null)
                {
                    dataManager.BatchRollback();
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return new MessageResult(false, strErrorMessage);
                }

                ActionStep actionStep = dataManager.GetCreateManager().CreateActionStep("Temp", disaster.ID);

                if (actionStep == null)
                {
                    dataManager.BatchRollback();
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return new MessageResult(false, strErrorMessage);
                }

                StepMember stepMember = dataManager.GetCreateManager().CreateStepMember(-1, 0, actionStep.ID);

                if (stepMember == null)
                {
                    dataManager.BatchRollback();
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return new MessageResult(false, strErrorMessage);
                }

                Arrow arrow = dataManager.GetCreateManager().CreateArrow(0, 0, 0, 0, stepMember.ID, data.SectionData.Text);

                if (arrow == null)
                {
                    dataManager.BatchRollback();
                    return new MessageResult(false, CheckTextLengthError(dataManager.GetCreateManager().GetErrorMessage(), dataManager));
                }
            }

            dataManager.BatchRollback();
            return new MessageResult(true, "");
        }

        private SectionGrid MakeTempGrid(int nStepMemberID, int nUserID, IDataManager dataManager, ref string strErrorMessage)
        {
            if (nStepMemberID > 0)
            {
                SectionGrid sectionGrid = dataManager.GetCreateManager().CreateGrid(nStepMemberID);

                if (sectionGrid == null)
                {
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return null;
                }
            }

            List<DisasterCategory> disasterCategories = dataManager.GetSelectManager().SelectDisasterCategories(out strErrorMessage);

            if (disasterCategories == null)
                return null;

            DisasterCategory disasterCategory = null;

            if (disasterCategories.Count == 0)
            {
                disasterCategory = dataManager.GetCreateManager().CreateDisasterCategory("Temp", dataManager.SiteID);

                if (disasterCategory == null)
                {
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return null;
                }
            }
            else
                disasterCategory = disasterCategories[0];

            List<SubDisasterCategory> subDisasterCategories = dataManager.GetSelectManager().SelectSubDisasterCategories(disasterCategory, out strErrorMessage);

            if (subDisasterCategories == null)
                return null;

            SubDisasterCategory subDisasterCategory = null;

            if (subDisasterCategories.Count == 0)
            {
                subDisasterCategory = dataManager.GetCreateManager().CreateSubDisasterCategory(disasterCategory.ID, "Temp");

                if (subDisasterCategory == null)
                {
                    strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                    return null;
                }
            }
            else
                subDisasterCategory = subDisasterCategories[0];

            Version version = dataManager.GetCreateManager().CreateVersion(true, DateTime.Now, DateTime.Now, "Temp", nUserID, dataManager.SiteID);

            if (version == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return null;
            }

            Disaster disaster = dataManager.GetCreateManager().CreateDisaster("Temp", subDisasterCategory.ID, version.ID);

            if (disaster == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return null;
            }

            ActionStep actionStep = dataManager.GetCreateManager().CreateActionStep("Temp", disaster.ID);

            if (actionStep == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return null;
            }

            StepMember stepMember = dataManager.GetCreateManager().CreateStepMember(-1, 0, actionStep.ID);

            if (stepMember == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return null;
            }

            SectionGrid grid = dataManager.GetCreateManager().CreateGrid(stepMember.ID);

            if (grid == null)
            {
                strErrorMessage = dataManager.GetCreateManager().GetErrorMessage();
                return null;
            }

            return grid;
        }
    }
}
