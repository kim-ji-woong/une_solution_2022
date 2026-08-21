using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;

namespace WonikErpNSheServer
{
    public class ERPManager
    {
        private static string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });


        private DirectDBManager m_erpDBManager = null;
        private TeamEditor.DAL.DataManager m_dataManager = null;
        private SOPManager.DAL.DataManager m_sopDataManager = null;
        private SDMS.DAL.DataManager m_sdmsDataManager = null;

        private Dictionary<string, int> m_dicJobLevel = null;
        private Dictionary<string, int> m_dicJobPosition = null;
        private Dictionary<string, int> m_dicStatus = null;

        public Logger Logger { get; set; }

        public ERPManager(DirectDBManager erpDBManager, TeamEditor.DAL.DataManager dataManager, SOPManager.DAL.DataManager sopDataManager, SDMS.DAL.DataManager sdmsDataManager)
        {
            m_erpDBManager = erpDBManager;
            m_dataManager = dataManager;

            m_sopDataManager = sopDataManager;
            m_sdmsDataManager = sdmsDataManager;

            LoadTeamOptions();

            this.Logger = Logger.Instance.Clone("LOG_ERP");
        }

        private bool LoadTeamOptions()
        {
            m_dicJobLevel = new Dictionary<string, int>();
            m_dicJobPosition = new Dictionary<string, int>();
            m_dicStatus = new Dictionary<string, int>();

            string strErrorMessage = "";

            m_dicJobLevel = LoadTeamOptions(ID.TeamOption.JobLevel, out strErrorMessage);
            if (m_dicJobLevel == null)
                return false;

            m_dicJobPosition = LoadTeamOptions(ID.TeamOption.JobPosition, out strErrorMessage);
            if (m_dicJobPosition == null)
                return false;

            m_dicStatus = LoadTeamOptions(ID.TeamOption.Status, out strErrorMessage);
            if (m_dicStatus == null)
                return false;

            return true;
        }

        private Dictionary<string, int> LoadTeamOptions(ID.TeamOption option, out string strErrorMessage)
        {
            strErrorMessage = "";
            Dictionary<string, int> dicOptions = null;

            string strPropertyName = "";

            if (option == ID.TeamOption.JobLevel)
            {
                strPropertyName = "JobLevel";
            }
            else if (option == ID.TeamOption.JobPosition)
            {
                strPropertyName = "JobPosition";
            }
            else if (option == ID.TeamOption.Status)
            {
                strPropertyName = "Status";
            }
            else
            {
                strErrorMessage = "TeamOption 제대로 된 값이 아닙니다.";
                return dicOptions;
            }

            // 조회 
            Dictionary<Options.Fields, object> dicConditions = new Dictionary<Options.Fields, object>();
            dicConditions[Options.Fields.PropertyName] = strPropertyName;

            dicOptions = new Dictionary<string, int>();

            List<Options> options = m_dataManager.GetSelectManager().SelectOptions(dicConditions, "", out strErrorMessage);
            if (options == null)
                return dicOptions;

            foreach (Options data in options)
            {
                dicOptions[data.PropertyValue] = data.PropertyID;
            }

            return dicOptions;
        }

        public bool SetUpdateData(Dictionary<string, ERPRegular> dicERPRegulars, Dictionary<string, ERPRegularMember> dicERPRegularMembers, out Dictionary<string, List<RegularMember>> dicPathRegularMember, out string strErrorMessage)
        {
            strErrorMessage = "";
            dicPathRegularMember = new Dictionary<string, List<RegularMember>>();

            foreach (KeyValuePair<string, ERPRegular> pair in dicERPRegulars)
            {
                ERPRegular erpRegular = pair.Value;

                if (dicPathRegularMember.ContainsKey(erpRegular.Path) == false)
                    dicPathRegularMember[erpRegular.Path] = new List<RegularMember>();
            }

            foreach (KeyValuePair<string, ERPRegularMember> pair in dicERPRegularMembers)
            {
                ERPRegularMember erpRegularMember = pair.Value;

                if (erpRegularMember.DEPT_CD != null && erpRegularMember.DEPT_CD != "")
                {
                    if (dicERPRegulars.ContainsKey(erpRegularMember.DEPT_CD))
                    {
                        ERPRegular erpRegular = dicERPRegulars[erpRegularMember.DEPT_CD];

                        if (dicPathRegularMember.ContainsKey(erpRegular.Path))
                        {
                            dicPathRegularMember[erpRegular.Path].Add(erpRegularMember);
                        }
                        else
                        {
                            dicPathRegularMember[erpRegular.Path] = new List<RegularMember>();
                            dicPathRegularMember[erpRegular.Path].Add(erpRegularMember);
                        }
                    }
                    else
                    {
                        Console.WriteLine(erpRegularMember.DEPT_CD);
                        Logger.Write($"SetUpdateData 예외처리: Member DEPT_CD 부서코드가 불일치 (퇴사자) MemberName: {erpRegularMember.MemberName}, DEPT_CD: {erpRegularMember.DEPT_CD}");
                    }
                }
                else
                {
                    Console.WriteLine(erpRegularMember.MemberID);
                    Logger.Write("SetUpdateData 오류: ERPRegularMember DEPT_CD 부서코드가 없음 " + erpRegularMember.MemberID);
                }
            }

            return true;
        }

        public bool LoadERPData(out Dictionary<string, ERPRegular> dicERPRegulars, out Dictionary<string, ERPRegularMember> dicERPRegularMembers, out string strErrorMessage)
        {
            strErrorMessage = "";

            List<ERPTeamData> erpTeams = null;
            List<ERPMemberData> erpMembers = null;

            dicERPRegulars = null;
            dicERPRegularMembers = null;

            erpTeams = GetERPTeams(out strErrorMessage);
            if (erpTeams == null)
                return false;

            erpMembers = GetERPMembers(out strErrorMessage);
            if (erpMembers == null)
                return false;

            if (SetERPTeamData(erpTeams, out dicERPRegulars, out strErrorMessage) == false)
                return false;

            if (SetHRMemberData(erpMembers, out dicERPRegularMembers, out strErrorMessage) == false)
                return false;


            return true;
        }

        public bool CheckERPDataLoad(out string strErrorMessage)
        {   // ERP 업데이트 완료 체크
            strErrorMessage = "";

            DateTime dtToday = DateTime.Now;

            string strSQL = $"UPDATE INF_RCV_HR_ERP_002 SET INF_STATUS = 'Y', INF_MESSAGE = 'SUCCESS', INF_TIME = '{dtToday.ToString("yyyy-MM-dd HH:mm:ss")}' WHERE DATA_INPUT_TIME >= '{dtToday.ToString("yyyy-MM-dd")}'";
            ArrayList arrResult = m_erpDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = m_erpDBManager.LastErrorMessage;
                return false;
            }

            strSQL = $"UPDATE INF_RCV_HR_ERP_001 SET INF_STATUS = 'Y', INF_MESSAGE = 'SUCCESS', INF_TIME = '{dtToday.ToString("yyyy-MM-dd HH:mm:ss")}' WHERE DATA_INPUT_TIME >= '{dtToday.ToString("yyyy-MM-dd")}'";
            arrResult = m_erpDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = m_erpDBManager.LastErrorMessage;
                return false;
            }

            // 28일 이전 데이터 삭제
            DateTime removeDate = dtToday.AddDays(-28);

            strSQL = $"DELETE FROM INF_RCV_HR_ERP_001 WHERE DATA_INPUT_TIME <= '{removeDate.ToString("yyyy-MM-dd")}'";
            arrResult = m_erpDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = m_erpDBManager.LastErrorMessage;
                return false;
            }

            strSQL = $"DELETE FROM INF_RCV_HR_ERP_002 WHERE DATA_INPUT_TIME <= '{removeDate.ToString("yyyy-MM-dd")}'";
            arrResult = m_erpDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = m_erpDBManager.LastErrorMessage;
                return false;
            }

            return true;
        }

        public List<ERPTeamData> GetERPTeams(out string strErrorMessage)
        {
            strErrorMessage = "";

            DateTime dtToday = DateTime.Now;

            string strSQL = $"SELECT DEPT, PDEPT, LDEPTNM, LVL, SEQ FROM INF_RCV_HR_ERP_002 WHERE DATA_INPUT_TIME >= '{dtToday.ToString("yyyy-MM-dd")}'";
            ArrayList arrResult = m_erpDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = m_erpDBManager.LastErrorMessage;
                return null;
            }
            else if (arrResult.Count == 0)
            {
                strErrorMessage = $"{dtToday.ToString("yyyy-MM-dd")} INF_RCV_HR_ERP_002 데이터가 존재하지 않습니다.";
                return null;
            }

            int nCount = arrResult.Count;

            Dictionary<string, ERPTeamData> dicERPTeams = new Dictionary<string, ERPTeamData>();

            for (int i = 0; i < nCount - 4; i += 5)
            {
                string strDEPT = WebDBManager.GetStringField(arrResult[i], "");
                string strPDEPT = WebDBManager.GetStringField(arrResult[i + 1], "");
                string strLDEPTNM = WebDBManager.GetStringField(arrResult[i + 2], "");
                VariousData<int> nLVL = WebDBManager.GetIntField(arrResult[i + 3].ToString());
                VariousData<int> nSEQ = WebDBManager.GetIntField(arrResult[i + 4].ToString());

                ERPTeamData erpTeam = new ERPTeamData();
                erpTeam.DEPT = strDEPT;
                erpTeam.PDEPT = strPDEPT;
                erpTeam.LDEPTNM = strLDEPTNM;
                erpTeam.LVL = nLVL.Data;
                erpTeam.SEQ = nSEQ.Data;

                dicERPTeams[strDEPT] = erpTeam;
            }

            List<ERPTeamData> erpTeams = new List<ERPTeamData>();
            erpTeams = dicERPTeams.Values.ToList();

            return erpTeams;
        }

        public List<ERPMemberData> GetERPMembers(out string strErrorMessage)
        {
            strErrorMessage = "";

            DateTime dtToday = DateTime.Now;

            // USE_YN 0: 사용 중
            string strSQL = $"SELECT EMP_NO, NAME, HAND_TEL_NO, TEL_NO, EMAIL_ADDR, DEPT_CD, DEPT_NM, ROLL_PSTN, ROLL_PSTN_NM, ROLE_CD, ROLE_NM, USE_YN FROM INF_RCV_HR_ERP_001 WHERE DATA_INPUT_TIME >= '{dtToday.ToString("yyyy-MM-dd")}' AND USE_YN = '0'";
            ArrayList arrResult = m_erpDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = m_erpDBManager.LastErrorMessage;
                return null;
            }
            else if (arrResult.Count == 0)
            {
                strErrorMessage = $"{dtToday.ToString("yyyy-MM-dd")} INF_RCV_HR_ERP_001 데이터가 존재하지 않습니다.";
                return null;
            }

            int nCount = arrResult.Count;

            Dictionary<string, ERPMemberData> dicERPMembers = new Dictionary<string, ERPMemberData>();

            for (int i = 0; i < nCount - 11; i += 12)
            {
                string strEMP_NO = WebDBManager.GetStringField(arrResult[i], "");
                string strNAME = WebDBManager.GetStringField(arrResult[i + 1], "");
                string strHAND_TEL_NO = WebDBManager.GetStringField(arrResult[i + 2], "");
                string strTEL_NO = WebDBManager.GetStringField(arrResult[i + 3], "");
                string strEMAIL_ADDR = WebDBManager.GetStringField(arrResult[i + 4], "");
                string strDEPT_CD = WebDBManager.GetStringField(arrResult[i + 5], "");
                string strDEPT_NM = WebDBManager.GetStringField(arrResult[i + 6], "");
                string strROLL_PSTN = WebDBManager.GetStringField(arrResult[i + 7], "");
                string strROLL_PSTN_NM = WebDBManager.GetStringField(arrResult[i + 8], "");
                string strROLE_CD = WebDBManager.GetStringField(arrResult[i + 9], "");
                string strROLE_NM = WebDBManager.GetStringField(arrResult[i + 10], "");
                string strUSE_YN = WebDBManager.GetStringField(arrResult[i + 11], "");

                ERPMemberData erpMember = new ERPMemberData();
                erpMember.EMP_NO = strEMP_NO;
                erpMember.NAME = strNAME;
                erpMember.HAND_TEL_NO = strHAND_TEL_NO;
                erpMember.TEL_NO = strTEL_NO;
                erpMember.EMAIL_ADDR = strEMAIL_ADDR;
                erpMember.DEPT_CD = strDEPT_CD;
                erpMember.DEPT_NM = strDEPT_NM;
                erpMember.ROLL_PSTN = strROLL_PSTN;
                erpMember.ROLL_PSTN_NM = strROLL_PSTN_NM;
                erpMember.ROLE_CD = strROLE_CD;
                erpMember.ROLE_NM = strROLE_NM;
                erpMember.USE_YN = strUSE_YN;

                dicERPMembers[erpMember.EMP_NO] = erpMember;
            }

            List<ERPMemberData> erpMembers = new List<ERPMemberData>();
            erpMembers = dicERPMembers.Values.ToList();

            return erpMembers;
        }

        private bool SetERPTeamData(List<ERPTeamData> erpTeams, out Dictionary<string, ERPRegular> dicERPRegulars, out string strErrorMessage)
        {
            strErrorMessage = "";
            dicERPRegulars = new Dictionary<string, ERPRegular>();

            if (erpTeams == null)
            {
                strErrorMessage = "ERPTeam 데이터가 제대로 된 값이 들어있지 않습니다.";
                return false;
            }

            foreach (ERPTeamData erpTeam in erpTeams)
            {
                if (erpTeam.LVL == 1)
                {   // 루트 Team
                    ERPRegular erpRegular = new ERPRegular();
                    erpRegular.ParentTeamID = null;
                    erpRegular.TeamName = erpTeam.LDEPTNM;
                    erpRegular.DEPT = erpTeam.DEPT;
                    erpRegular.Path = erpTeam.LDEPTNM;

                    dicERPRegulars[erpTeam.DEPT] = erpRegular;

                    // 자식 HrRegular 조회 
                    GetChildERPTeam(erpRegular, erpTeams, ref dicERPRegulars);
                }
            }

            return true;
        }

        private void GetChildERPTeam(ERPRegular erpRegular, List<ERPTeamData> erpTeams, ref Dictionary<string, ERPRegular> dicERPRegulars)
        {   // 자식 HrRegular 조회 

            if (dicERPRegulars == null)
                dicERPRegulars = new Dictionary<string, ERPRegular>();

            foreach (ERPTeamData data in erpTeams)
            {
                if (erpRegular.DEPT == data.PDEPT)
                {
                    ERPRegular child = new ERPRegular();
                    child.TeamName = data.LDEPTNM;
                    child.DEPT = data.DEPT;
                    child.Path = erpRegular.Path + "|" + data.LDEPTNM;

                    // ORG_CD 중복 예외처리 
                    if (data.DEPT == "")
                        continue;

                    dicERPRegulars[data.DEPT] = child;
                    erpRegular.Children.Add(child);

                    GetChildERPTeam(child, erpTeams, ref dicERPRegulars);
                }
            }
        }

        private bool SetHRMemberData(List<ERPMemberData> erpMembers, out Dictionary<string, ERPRegularMember> dicERPRegularMembers, out string strErrorMessage)
        {
            strErrorMessage = "";
            dicERPRegularMembers = new Dictionary<string, ERPRegularMember>();

            if (erpMembers == null)
            {
                strErrorMessage = "ERPMemberData가 제대로 된 값이 들어있지 않습니다.";
                return false;
            }

            foreach (ERPMemberData erpMember in erpMembers)
            {
                ERPRegularMember regularMember = new ERPRegularMember();
                regularMember.MemberName = erpMember.NAME;
                regularMember.MemberID = erpMember.EMP_NO;
                regularMember.OfficePhoneNumber = erpMember.TEL_NO;
                regularMember.PhoneNumber = erpMember.HAND_TEL_NO;
                regularMember.Email = erpMember.EMAIL_ADDR;

                //regularMember.RegularID
                regularMember.DEPT_CD = erpMember.DEPT_CD;

                //regularMember.JobLevelID
                if (erpMember.ROLE_NM != null && erpMember.ROLE_NM != "")
                {
                    int nJobLevelID = GetTeamOptionID(ID.TeamOption.JobLevel, erpMember.ROLE_NM, out strErrorMessage);
                    if (nJobLevelID == -1)
                        return false;

                    regularMember.JobLevelID = nJobLevelID;
                }

                //regularMember.JobPositionID
                if (erpMember.ROLL_PSTN_NM != null && erpMember.ROLL_PSTN_NM != "")
                {
                    int nJobPositionID = GetTeamOptionID(ID.TeamOption.JobPosition, erpMember.ROLL_PSTN_NM, out strErrorMessage);
                    if (nJobPositionID == -1)
                        return false;

                    regularMember.JobPositionID = nJobPositionID;
                }

                //regularMember.StatusID
                if (erpMember.USE_YN != "0")
                    regularMember.StatusID = 3;
                else
                    regularMember.StatusID = 0;

                dicERPRegularMembers[regularMember.MemberID] = regularMember;
            }

            return true;
        }

        private int GetTeamOptionID(ID.TeamOption option, string strPropertyValue, out string strErrorMessage)
        {
            int nID = -1;
            strErrorMessage = "";

            // 조회 
            string strPropertyName = "";
            Dictionary<string, int> dicTeamOption = null;

            if (option == ID.TeamOption.JobLevel)
            {
                dicTeamOption = m_dicJobLevel;
                strPropertyName = "JobLevel";
            }
            else if (option == ID.TeamOption.JobPosition)
            {
                dicTeamOption = m_dicJobPosition;
                strPropertyName = "JobPosition";
            }
            else if (option == ID.TeamOption.Status)
            {
                dicTeamOption = m_dicStatus;
                strPropertyName = "Status";
            }
            else
            {
                strErrorMessage = "TeamOption 제대로 된 값이 아닙니다.";
                return nID;
            }

            if (dicTeamOption.ContainsKey(strPropertyValue) == false)
            {   // 없으면 추가
                int nPropertyID = GetMaxPropertyID(strPropertyName, out strErrorMessage);
                if (nPropertyID == -1)
                    return nPropertyID;

                int nTeamOptionID = m_dataManager.GetSelectManager().GetMaxID(Options.TableName, out strErrorMessage);

                Options data = new Options();
                data.ID = nTeamOptionID;
                data.PropertyID = nPropertyID;
                data.PropertyName = strPropertyName;
                data.PropertyValue = strPropertyValue;

                if (m_dataManager.GetCreateManager().AddOptions(data, out strErrorMessage) == false)
                    return nID;

                LoadTeamOptions();
                nID = nPropertyID;
            }
            else
            {
                nID = dicTeamOption[strPropertyValue];
            }


            return nID;
        }

        private int GetMaxPropertyID(string strPropertyName, out string strErrorMessage)
        {
            int nID = 0;
            strErrorMessage = "";

            Dictionary<Options.Fields, object> dicConditions = new Dictionary<Options.Fields, object>();
            dicConditions[Options.Fields.PropertyName] = strPropertyName;

            List<Options> options = m_dataManager.GetSelectManager().SelectOptions(dicConditions, "", out strErrorMessage);
            if (options == null)
            {
                nID = -1;
                return nID;
            }

            foreach (Options option in options)
            {
                if (nID < option.PropertyID)
                    nID = option.PropertyID;
            }

            nID = nID + 1;
            return nID;
        }





        /// <summary>
        /// <para>인자 dicPathRegularMember는 업데이트 할 Regular, RegularMember 정보</para>
        /// <para>인자 dicIDRegulars, dicIDRegularMembers는 dicPathRegularMember과 비교할 데이터, 값이 NULL 이면 현재 DB의 Regular, RegularMember와 비교</para>
        /// 예) 협력업체 정보를 제외하고 업데이트를 진행하고 싶다면, 협력업체의 Regular, RegularMember를 제외하고 dicIDRegulars, dicIDRegularMembers 값을 넣고 실행
        /// </summary>
        /// <param name="dicPathRegularMember">KEY: Regular의 Path, Value: Regular의 RegularMember 리스트</param>
        /// <param name="strErrorMessage">오류 결과 메시지</param>
        /// <param name="dicIDRegulars">KEY: Regular의 ID, Value: 현재 DB의 Regular 데이터</param>
        /// <param name="dicIDRegularMembers">KEY: RegularMember의 ID, Value: 현재 DB의 RegularMember 데이터</param>
        /// <returns></returns>
        public bool UpdateRegularMemberData(Dictionary<string, List<RegularMember>> dicPathRegularMember, out string strErrorMessage, int? nSiteID = null, Dictionary<int, Regular> dicIDRegulars = null, Dictionary<int, RegularMember> dicIDRegularMembers = null)
        {
            strErrorMessage = "";
            Dictionary<string, Regular> dicPathRegulars = new Dictionary<string, Regular>();
            Dictionary<string, RegularMember> dicRegularMembers = new Dictionary<string, RegularMember>();

            if (dicPathRegularMember == null)
            {
                strErrorMessage = "dicPathRegularMember 인자가 제대로 된 값이 아닙니다.";
                return false;
            }

            Dictionary<string, Regular> dicPathRegulars_Current = null;
            Dictionary<string, RegularMember> dicRegularMembers_Current = null;

            // 비교 데이터 형식 맞추기 -----------------------------------------------------------------------------
            if (dicIDRegulars == null && dicIDRegularMembers == null)
            {   // 현재 DB의 Regular, RegularMember 불러오기
                if (LoadCurrentRegularMember(nSiteID, out dicPathRegulars_Current, out dicRegularMembers_Current, out dicIDRegularMembers, out strErrorMessage) == false)
                    return false;
            }
            else
            {
                if (SetCurrentRegularMember(dicIDRegulars, dicIDRegularMembers, out dicPathRegulars_Current, out dicRegularMembers_Current, out strErrorMessage) == false)
                    return false;
            }



            // 외부 조직 데이터 비교 형식에 맞춰 정렬 -----------------------------------------------------------------------------
            int nRegularNewID = -1;

            foreach (KeyValuePair<string, List<RegularMember>> pair in dicPathRegularMember)
            {
                string strTeamPath = pair.Key;
                List<RegularMember> members = pair.Value;

                Regular regular = null;

                if (dicPathRegulars_Current.ContainsKey(strTeamPath))
                {   // 기존 있던 팀이라면
                    regular = dicPathRegulars_Current[strTeamPath];
                    dicPathRegulars[strTeamPath] = regular;
                }
                else if (dicPathRegulars.ContainsKey(strTeamPath))
                {   // 새로 추가된 팀에 포함되어 있다면
                    //continue;
                    regular = dicPathRegulars[strTeamPath];
                }
                else
                {   // 새로 추가될 팀
                    regular = new Regular();
                    regular.ID = nRegularNewID;

                    nRegularNewID = nRegularNewID - 1;

                    int nIdx = strTeamPath.LastIndexOf('|');
                    if (nIdx >= 0)
                    {
                        string strParentName = strTeamPath.Substring(0, nIdx);

                        nIdx++;
                        string strTeamName = strTeamPath.Substring(nIdx);
                        regular.TeamName = strTeamName;

                        int? nParentTeamID = GetParentID(strParentName, dicPathRegulars_Current, ref dicPathRegulars, ref nRegularNewID);
                        if (nParentTeamID == null)
                            return false;

                        regular.ParentTeamID = nParentTeamID;
                    }
                    else
                    {
                        regular.TeamName = strTeamPath;
                        regular.ParentTeamID = null;
                    }

                    dicPathRegulars[strTeamPath] = regular;
                }

                foreach (RegularMember member in members)
                {
                    if (dicRegularMembers_Current.ContainsKey(member.MemberID))
                    {
                        RegularMember data = dicRegularMembers_Current[member.MemberID];
                        member.ID = data.ID;
                    }
                    else
                    {
                        member.ID = -1;
                    }

                    member.RegularID = regular.ID;
                    dicRegularMembers[member.MemberID] = member;
                }
            }



            // Regular 비교 -----------------------------------------------------------------------------
            Dictionary<string, Regular> dicAddRegulars = new Dictionary<string, Regular>();
            Dictionary<string, Regular> dicRemoveRegulars = CloenDicRegularData(dicPathRegulars_Current, out strErrorMessage);

            if (dicRemoveRegulars == null)
                return false;

            foreach (KeyValuePair<string, Regular> pair in dicPathRegulars)
            {
                string strPath = pair.Key;
                Regular regular = pair.Value;

                if (regular.ID < 0)
                {   // 새로 추가된 Regular
                    dicAddRegulars[strPath] = regular;
                }
                else if (dicPathRegulars_Current.ContainsKey(strPath))
                {   // 존재하는 Regular는 제외
                    dicRemoveRegulars.Remove(strPath);
                }
            }





            // RegularMember 비교 -----------------------------------------------------------------------------
            Dictionary<string, RegularMember> dicAddRegularMembers = new Dictionary<string, RegularMember>();
            Dictionary<string, RegularMember> dicModifiRegularMembers = new Dictionary<string, RegularMember>();
            //Dictionary<string, RegularMember> dicRemoveRegularMembers = CloenDicMemberData(dicRegularMembers_Current, out strErrorMessage);

            Dictionary<int, RegularMember> dicRemoveRegularMembers = CloneRegularMemberData(dicIDRegularMembers, out strErrorMessage);

            if (dicRemoveRegularMembers == null)
                return false;

            foreach (KeyValuePair<string, RegularMember> pair in dicRegularMembers)
            {
                string strMemberID = pair.Key;
                RegularMember member = pair.Value;

                if (dicRegularMembers_Current.ContainsKey(strMemberID))
                {   // 존재하는 RegularMember

                    // 삭제 목록에서 제외
                    dicRemoveRegularMembers.Remove(member.ID);

                    RegularMember data = dicRegularMembers_Current[strMemberID];

                    // 비교 후 업데이트 여부 확인
                    if (member.MemberName != data.MemberName ||
                        member.Email != data.Email ||
                        member.JobLevelID != data.JobLevelID ||
                        member.JobPositionID != data.JobPositionID ||
                        member.RegularID != data.RegularID ||
                        member.StatusID != data.StatusID ||
                        member.OfficePhoneNumber != data.OfficePhoneNumber ||
                        member.PhoneNumber != data.PhoneNumber)
                    {
                        dicModifiRegularMembers[strMemberID] = member;
                    }
                }
                else if (member.ID < 0)
                {   // 새로 추가된 RegularMember
                    dicAddRegularMembers[strMemberID] = member;
                }

            }





            // 변경된 데이터 DB 적용 -----------------------------------------------------------------------------------
            //TeamEditor.BLL.Rollback.RollbackManager rollback = new TeamEditor.BLL.Rollback.RollbackManager();
            Dictionary<int, int> dicChangeRegularID = null;


            TeamEditor.IDAL.IDataManager dataManager = null;
            SDMS.IDAL.IDataManager sdmsDataManager = null;
            SOPManager.IDAL.IDataManager sopDataManager = null;

            sdmsDataManager = m_sdmsDataManager.Clone();
            if (sdmsDataManager.BeginBatch() == false)
            {
                strErrorMessage = "RemoveRegularMember 트랜잭션 오류 (SDMS BeginBatch Error)";
                return false;
            }
            

            dataManager = m_dataManager.Clone();
            if (dataManager.BeginBatch() == false)
            {
                strErrorMessage = "RemoveRegularMember 트랜잭션 오류 (TeamEditor BeginBatch Error)";
                return false;
            }
            
            sopDataManager = m_sopDataManager.Clone();
            if (sopDataManager.BeginBatch() == false)
            {
                strErrorMessage = "RemoveRegularMember 트랜잭션 오류 (TeamEditor BeginBatch Error)";
                return false;
            }            


            // Regular 추가 작업 및 Regular ID 변경 데이터 저장
            if (AddRegular(dataManager, nSiteID, dicAddRegulars.Values, out dicChangeRegularID, out strErrorMessage) == false)
            {
                //rollback.Rollback(m_sdmsDataManager, m_dataManager, m_sopDataManager);
                dataManager.BatchRollback();
                return false;
            }

            // RegularMember 추가
            if (AddRegularMember(dataManager, dicAddRegularMembers.Values, dicChangeRegularID, out strErrorMessage) == false)
            {
                //rollback.Rollback(m_sdmsDataManager, m_dataManager, m_sopDataManager);
                dataManager.BatchRollback();
                return false;
            }

            // RegularMember 업데이트
            if (UpdateRegularMember(dataManager, dicModifiRegularMembers.Values, dicChangeRegularID, out strErrorMessage) == false)
            {
                //rollback.Rollback(m_sdmsDataManager, m_dataManager, m_sopDataManager);
                dataManager.BatchRollback();
                return false;
            }
            
            // RegularMember 삭제
            if (RemoveRegularMember(dataManager, sdmsDataManager, sopDataManager, dicRemoveRegularMembers.Values, out strErrorMessage) == false)
            {
                //rollback.Rollback(m_sdmsDataManager, m_dataManager, m_sopDataManager);
                sdmsDataManager.BatchRollback();
                dataManager.BatchRollback();
                sopDataManager.BatchRollback();
                return false;
            }

            // Regular 삭제
            if (RemoveRegular(dataManager, sdmsDataManager, dicRemoveRegulars.Values, out strErrorMessage) == false)
            {
                //rollback.Rollback(m_sdmsDataManager, m_dataManager, m_sopDataManager);
                sdmsDataManager.BatchRollback();
                dataManager.BatchRollback();
                sopDataManager.BatchRollback();
                return false;
            }

            if (sdmsDataManager.BatchCommit() == false)
            {
                strErrorMessage = "UpdateRegularMemberData() sdmsDataManager BatchCommit 실패";
                sdmsDataManager.BatchRollback();
                sopDataManager.BatchRollback();
                dataManager.BatchRollback();                
                return false;
            }           
                
            if (sopDataManager.BatchCommit() == false)
            {
                strErrorMessage = "UpdateRegularMemberData() sopDataManager BatchCommit 실패";                
                sopDataManager.BatchRollback();
                dataManager.BatchRollback();
                return false;
            }

            if (dataManager.BatchCommit() == false)
            {
                strErrorMessage = "UpdateRegularMemberData() dataManager BatchCommit 실패";
                dataManager.BatchRollback();
                return false;
            }

            return true;
        }

        private bool LoadCurrentRegularMember(int? nSiteID, out Dictionary<string, Regular> dicPathRegulars, out Dictionary<string, RegularMember> dicRegularMembers, out Dictionary<int, RegularMember> dicIDRegularMembers, out string strErrorMessage)
        {
            strErrorMessage = "";
            dicPathRegulars = null;
            dicRegularMembers = null;
            dicIDRegularMembers = null;

            Dictionary<Regular.Fields, object> dicConditions = new Dictionary<Regular.Fields, object>();

            string strAdditionalConditions = "";
            if (nSiteID.HasValue)
                strAdditionalConditions = string.Format("{0} = {1}", Regular.Fields.SiteID, nSiteID);
            else
                strAdditionalConditions = string.Format("{0} is NULL", Regular.Fields.SiteID);

            List<Regular> regulars = m_dataManager.GetSelectManager().SelectRegulars(dicConditions, strAdditionalConditions, out strErrorMessage);
            if (regulars == null)
                return false;



            List<RegularMember> regularMembers = new List<RegularMember>();

            if (regulars.Count > 0)
            {
                Dictionary<RegularMember.Fields, object> dicConditions_RegularMember = new Dictionary<RegularMember.Fields, object>();
                strAdditionalConditions = "";

                string strRegularIDs = "";

                foreach (Regular regular in regulars)
                {
                    if (strRegularIDs == "")
                        strRegularIDs = regular.ID.ToString();
                    else
                        strRegularIDs += "," + regular.ID.ToString();
                }

                strAdditionalConditions = string.Format("{0} in ({1})", RegularMember.Fields.RegularID, strRegularIDs);

                regularMembers = m_dataManager.GetSelectManager().SelectRegularMembers(dicConditions_RegularMember, strAdditionalConditions, out strErrorMessage);
                if (regularMembers == null)
                    return false;
            }

            if (SetRegularMemberData(regulars, regularMembers, out dicPathRegulars, out dicRegularMembers, out dicIDRegularMembers, out strErrorMessage) == false)
                return false;


            return true;
        }

        private bool SetRegularMemberData(List<Regular> regulars, List<RegularMember> regularMembers, out Dictionary<string, Regular> dicPathRegulars, out Dictionary<string, RegularMember> dicRegularMembers, out Dictionary<int, RegularMember> dicIDRegularMembers, out string strErrorMessage)
        {
            strErrorMessage = "";

            dicPathRegulars = new Dictionary<string, Regular>();
            dicRegularMembers = new Dictionary<string, RegularMember>();
            dicIDRegularMembers = new Dictionary<int, RegularMember>();

            if (regulars == null || regularMembers == null)
            {
                strErrorMessage = "조직정보에 제대로 된 값이 들어있지 않습니다.";
                return false;
            }

            foreach (Regular regular in regulars)
            {
                if (regular.ParentTeamID == null)
                {   // 루트 Regular
                    TeamEditor.BLL.RegularTeam team = new TeamEditor.BLL.RegularTeam();
                    team.ID = regular.ID;
                    team.ParentTeamID = null;
                    team.TeamName = regular.TeamName;
                    team.Path = regular.TeamName;

                    dicPathRegulars[team.Path] = team;

                    // 자식 Regular 조회 
                    GetChildRegularTeam(team, regulars, ref dicPathRegulars);
                }
            }

            foreach (RegularMember member in regularMembers)
            {
                if (member.PhoneNumber != null && member.PhoneNumber != "")
                    member.PhoneNumber = DecryptString(member.PhoneNumber);

                dicIDRegularMembers[member.ID] = member;

                if (member.MemberID == null || member.MemberID == "")
                    continue;

                dicRegularMembers[member.MemberID] = member;
            }

            return true;
        }

        private void GetChildRegularTeam(TeamEditor.BLL.RegularTeam parentTeam, List<Regular> regulars, ref Dictionary<string, Regular> dicPathRegulars)
        {
            if (dicPathRegulars == null)
                dicPathRegulars = new Dictionary<string, Regular>();

            foreach (Regular regular in regulars)
            {
                if (parentTeam.ID == regular.ParentTeamID)
                {
                    TeamEditor.BLL.RegularTeam child = new TeamEditor.BLL.RegularTeam();
                    child.ID = regular.ID;
                    child.ParentTeamID = regular.ParentTeamID;
                    child.TeamName = regular.TeamName;

                    child.Path = parentTeam.Path + "|" + child.TeamName;

                    dicPathRegulars[child.Path] = child;

                    GetChildRegularTeam(child, regulars, ref dicPathRegulars);
                }
            }
        }

        private bool SetCurrentRegularMember(Dictionary<int, Regular> dicIDRegulars, Dictionary<int, RegularMember> dicIDRegularMembers, out Dictionary<string, Regular> dicPathRegulars, out Dictionary<string, RegularMember> dicRegularMembers, out string strErrorMessage)
        {
            strErrorMessage = "";
            dicPathRegulars = new Dictionary<string, Regular>();
            dicRegularMembers = new Dictionary<string, RegularMember>();

            List<Regular> regulars = new List<Regular>();

            foreach (KeyValuePair<int, Regular> pair in dicIDRegulars)
            {
                Regular regular = pair.Value;

                regulars.Add(regular);
            }

            foreach (KeyValuePair<int, Regular> pair in dicIDRegulars)
            {
                Regular regular = pair.Value;

                if (regular.ParentTeamID == null)
                {   // 루트 Regular
                    TeamEditor.BLL.RegularTeam team = new TeamEditor.BLL.RegularTeam();
                    team.ID = regular.ID;
                    team.ParentTeamID = null;
                    team.TeamName = regular.TeamName;
                    team.Path = regular.TeamName;

                    dicPathRegulars[team.Path] = team;

                    // 자식 Regular 조회 
                    GetChildRegularTeam(team, regulars, ref dicPathRegulars);
                }
            }

            foreach (KeyValuePair<int, RegularMember> pair in dicIDRegularMembers)
            {
                RegularMember member = pair.Value;

                if (member.MemberID == null || member.MemberID == "")
                    continue;

                if (member.PhoneNumber != null && member.PhoneNumber != "")
                    member.PhoneNumber = DecryptString(member.PhoneNumber);

                dicRegularMembers[member.MemberID] = member;
            }

            return true;
        }

        private int? GetParentID(string strTeamPath, Dictionary<string, Regular> dicPathRegulars_Current, ref Dictionary<string, Regular> dicPathRegulars, ref int nRegularNewID)
        {
            int nParentID = -1;

            Regular regular = null;

            if (dicPathRegulars_Current.ContainsKey(strTeamPath))
            {
                regular = dicPathRegulars_Current[strTeamPath];
            }
            else if (dicPathRegulars.ContainsKey(strTeamPath))
            {
                regular = dicPathRegulars[strTeamPath];
            }
            else
            {
                regular = new Regular();
                regular.ID = nRegularNewID;

                nRegularNewID = nRegularNewID - 1;

                int nIdx = strTeamPath.LastIndexOf('|');
                if (nIdx >= 0)
                {
                    string strParentName = strTeamPath.Substring(0, nIdx);

                    nIdx++;
                    string strTeamName = strTeamPath.Substring(nIdx);

                    regular.TeamName = strTeamName;

                    int? nParentTeamID = GetParentID(strParentName, dicPathRegulars_Current, ref dicPathRegulars, ref nRegularNewID);
                    if (nParentTeamID == null)
                        return nParentTeamID;

                    regular.ParentTeamID = nParentTeamID;
                }
                else
                {
                    regular.TeamName = strTeamPath;
                    regular.ParentTeamID = null;
                }

                dicPathRegulars[strTeamPath] = regular;
            }

            nParentID = regular.ID;

            return nParentID;
        }

        private Dictionary<string, Regular> CloenDicRegularData(Dictionary<string, Regular> dicPathRegulars, out string strErrorMessage)
        {
            strErrorMessage = "";
            Dictionary<string, Regular> dicCloen = null;

            if (dicPathRegulars == null)
            {
                strErrorMessage = "데이터가 제대로 되지 않았습니다.";
                return dicCloen;
            }

            dicCloen = new Dictionary<string, Regular>();

            foreach (KeyValuePair<string, Regular> pair in dicPathRegulars)
            {
                string strPath = pair.Key;
                Regular regular = pair.Value;

                Regular data = new Regular();
                data.ID = regular.ID;
                data.TeamName = regular.TeamName;
                data.ParentTeamID = regular.ParentTeamID;

                dicCloen[strPath] = data;
            }

            return dicCloen;
        }

        private Dictionary<int, RegularMember> CloneRegularMemberData(Dictionary<int, RegularMember> regularMembers, out string strErrorMessage)
        {
            strErrorMessage = "";
            Dictionary<int, RegularMember> cloenMembers = null;

            if (regularMembers == null)
            {
                strErrorMessage = "데이터가 제대로 되지 않았습니다.";
                return cloenMembers;
            }

            cloenMembers = new Dictionary<int, RegularMember>();

            foreach (KeyValuePair<int, RegularMember> pair in regularMembers)
            {
                int nID = pair.Key;
                RegularMember member = pair.Value;

                RegularMember data = new RegularMember();
                data.ID = member.ID;
                data.MemberName = member.MemberName;
                data.MemberID = member.MemberID;

                data.RegularID = member.RegularID;
                data.JobLevelID = member.JobLevelID;
                data.JobPositionID = member.JobPositionID;
                data.OfficePhoneNumber = member.OfficePhoneNumber;
                data.PhoneNumber = member.PhoneNumber;
                data.Email = member.Email;
                data.StatusID = member.StatusID;

                cloenMembers[nID] = member;
            }

            return cloenMembers;
        }

        private bool AddRegular(TeamEditor.IDAL.IDataManager dataManager, int? nSiteID, ICollection<Regular> regulars, out Dictionary<int, int> dicChangeRegularID, out string strErrorMessage)
        {
            strErrorMessage = "";
            dicChangeRegularID = new Dictionary<int, int>();

            try
            {
                string strError = null;

                foreach (Regular regular in regulars)
                {
                    // 이미 추가된 Regular 제외
                    if (regular.ID > 0)
                        continue;

                    int nID_old = regular.ID;

                    int nID = m_dataManager.GetSelectManager().GetMaxID(Regular.GetTableName(), out strError);
                    if (nID == -1)                    
                        throw new ApplicationException(strError);                    

                    regular.ID = nID;

                    if (regular.ParentTeamID != null && regular.ParentTeamID < 0)
                    {   // 부모 regular ID를 아직 모른다면 

                        if (dicChangeRegularID.ContainsKey((int)regular.ParentTeamID))
                            regular.ParentTeamID = dicChangeRegularID[(int)regular.ParentTeamID];
                        else
                        {   // 부모 regular가 아직 추가되지 않았다면 
                            regular.ParentTeamID = AddParentRegular(dataManager, nSiteID, (int)regular.ParentTeamID, regulars, dicChangeRegularID, out strError);
                            if (regular.ParentTeamID < 0)
                                throw new ApplicationException(strError);                           
                        }
                    }

                    if (nSiteID.HasValue)
                        regular.SiteID = nSiteID.Value;
                    else
                        regular.SiteID = null;

                    if (dataManager.GetCreateManager().AddRegular(regular) == false)
                        throw new ApplicationException("AddRegular 실패");

                    dicChangeRegularID[nID_old] = nID;
                }

            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }
           
            return true;
        }

        private int AddParentRegular(TeamEditor.IDAL.IDataManager dataManager, int? nSiteID, int nParentTeamID, ICollection<Regular> regulars, Dictionary<int, int> dicChangeRegularID,  out string strErrorMessage)
        {
            strErrorMessage = "";
            int nRegularID = nParentTeamID;

            foreach (Regular regular in regulars)
            {
                if (regular.ID == nParentTeamID)
                {
                    int nID_old = regular.ID;

                    int nID = dataManager.GetSelectManager().GetMaxID(Regular.GetTableName(), out strErrorMessage);
                    if (nID == -1)
                    {
                        return nRegularID;
                    }

                    regular.ID = nID;

                    if (regular.ParentTeamID != null && regular.ParentTeamID < 0)
                    {
                        if (dicChangeRegularID.ContainsKey((int)regular.ParentTeamID))
                            regular.ParentTeamID = dicChangeRegularID[(int)regular.ParentTeamID];
                        else
                        {
                            regular.ParentTeamID = AddParentRegular(dataManager, nSiteID, (int)regular.ParentTeamID, regulars, dicChangeRegularID, out strErrorMessage);
                            if (regular.ParentTeamID < 0)
                            {
                                return nRegularID;
                            }
                        }
                    }

                    if (nSiteID.HasValue)
                        regular.SiteID = nSiteID.Value;
                    else
                        regular.SiteID = null;

                    if (dataManager.GetCreateManager().AddRegular(regular) == false)
                        return -1;

                    dicChangeRegularID[nID_old] = nID;
                    nRegularID = nID;
                    break;
                }
            }

            return nRegularID;
        }

        private bool AddRegularMember(TeamEditor.IDAL.IDataManager dataManager, ICollection<RegularMember> regularMembers, Dictionary<int, int> dicChangeRegularID, out string strErrorMessage)
        {
            strErrorMessage = "";

            //TeamRollbackData rollbackData = new TeamRollbackData();
            //rollback.AddData(rollbackData);

            //List<RegularMember> rollbackMembers = new List<RegularMember>();
            //rollbackData.SetDeleteRegularMembers(rollbackMembers);

            try
            {
                string strError = null;

                foreach (RegularMember member in regularMembers)
                {
                    int nID = dataManager.GetSelectManager().GetMaxID(RegularMember.GetTableName(), out strError);
                    if (nID == -1)
                        throw new ApplicationException(strError);

                    member.ID = nID;

                    if (dicChangeRegularID.ContainsKey(member.RegularID) == true)
                    {
                        member.RegularID = dicChangeRegularID[member.RegularID];
                    }

                    if (member.PhoneNumber != null && member.PhoneNumber != "")
                    {
                        member.PhoneNumber = EncryptString(member.PhoneNumber);
                    }

                    if (dataManager.GetCreateManager().AddRegularMember(member) == false)
                        throw new ApplicationException("AddRegularMember 실패");
                }

            }
            catch (Exception ex)
            {
                //dataManager.BatchRollback();
                strErrorMessage = ex.Message;
                return false;
            }
            
            return true;
        }

        private bool UpdateRegularMember(TeamEditor.IDAL.IDataManager dataManager, ICollection<RegularMember> regularMembers, Dictionary<int, int> dicChangeRegularID, out string strErrorMessage)
        {
            strErrorMessage = "";

            //TeamRollbackData rollbackData = new TeamRollbackData();
            //rollback.AddData(rollbackData);

            //List<RegularMember> rollbackMembers = new List<RegularMember>();
            //rollbackData.SetUpdateRegularMembers(rollbackMembers);

            try
            {
                string strError = null;

                foreach (RegularMember member in regularMembers)
                {
                    if (dicChangeRegularID.ContainsKey(member.RegularID) == true)
                    {
                        member.RegularID = dicChangeRegularID[member.RegularID];
                    }

                    if (member.PhoneNumber != null && member.PhoneNumber != "")
                    {
                        member.PhoneNumber = EncryptString(member.PhoneNumber);
                    }

                    if (dataManager.GetUpdateManager().UpdateRegularMember(member, out strError) == false)
                        throw new ApplicationException(strError);
                }

            }
            catch (Exception ex)
            {
                //dataManager.BatchRollback();
                strErrorMessage = ex.Message;
                return false;
            }
           
            return true;
        }

        private bool RemoveRegularMember(TeamEditor.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager, SOPManager.IDAL.IDataManager sopDataManager, ICollection<RegularMember> regularMembers, out string strErrorMessage)
        {
            strErrorMessage = "";

            try
            {                
                string strError;


                foreach (RegularMember member in regularMembers)
                {
                    if (RemoveFacilityManagers(sdmsDataManager, (int)SDMS.Model.Sensor.FacilityManager.MemberTypes.RegularMember, member.ID, out strError) == false)
                        throw new ApplicationException(strError);

                    if (RemoveTemporaryMembers(dataManager, sdmsDataManager, null, member.ID, out strError) == false)
                        throw new ApplicationException(strError);

                    if (RemoveAccountUser(sopDataManager, member.ID, out strError) == false)
                        throw new ApplicationException(strError);
                }

                //TeamRollbackData rollbackData = new TeamRollbackData();
                //rollback.AddData(rollbackData);

                //List<RegularMember> rollbackMembers = new List<RegularMember>();
                //rollbackData.SetInsertRegularMembers(rollbackMembers);

                foreach (RegularMember member in regularMembers)
                {
                    if (m_dataManager.GetDeleteManager().DeleteRegularMember(member.ID, out strErrorMessage) == false)                    
                        Logger.Write($"RemoveRegularMember DeleteRegularMember 예외처리: member.ID: {member.ID}, member.MemberName: {member.MemberName} ({strErrorMessage})");
                }
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        private bool RemoveFacilityManagers(SDMS.IDAL.IDataManager dataManager, int memberType, int memberID, out string strErrorMessage)
        {
            strErrorMessage = "";

            // SDMS 사용안하는 경우
            if (dataManager == null)
                return true;

            bool isNullable;

            string strCondition = string.Format("{0} = {1} and {2} in ({3})",
                SDMS.Model.Sensor.FacilityManager.GetFieldName(SDMS.Model.Sensor.FacilityManager.Fields.MemberType, out isNullable),
                memberType,
                SDMS.Model.Sensor.FacilityManager.GetFieldName(SDMS.Model.Sensor.FacilityManager.Fields.MemberID, out isNullable),
                memberID);

            List<SDMS.Model.Sensor.FacilityManager> managers = dataManager.GetSelectManager().SelectFacilityManagers(null, strCondition, out strErrorMessage);
            if (managers == null)
                return false;

            //TeamRollbackData rollbackData = new TeamRollbackData();
            //rollback.AddData(rollbackData);

            //List<FacilityManager> rollbackManagers = new List<FacilityManager>();
            //rollbackData.SetInsertFacilityManagers(rollbackManagers);

            try
            {                
                string strError = null;

                foreach (SDMS.Model.Sensor.FacilityManager manager in managers)
                {
                    Dictionary<SDMS.Model.Sensor.FacilityManager.Fields, object> dicConditions = new Dictionary<SDMS.Model.Sensor.FacilityManager.Fields, object>();
                    dicConditions[SDMS.Model.Sensor.FacilityManager.Fields.ID] = manager.ID;

                    if (dataManager.GetDeleteManager().DeleteFacilityManager(dicConditions, null, out strError) == false)
                        throw new ApplicationException(strError);
                }

                strCondition = string.Format("{0} = {1} and {2} in ({3})",
                    SDMS.Model.Sensor.BuildingFacilityManager.GetFieldName(SDMS.Model.Sensor.BuildingFacilityManager.Fields.MemberType, out isNullable),
                    memberType,
                    SDMS.Model.Sensor.BuildingFacilityManager.GetFieldName(SDMS.Model.Sensor.BuildingFacilityManager.Fields.MemberID, out isNullable),
                    memberID);

                List<SDMS.Model.Sensor.BuildingFacilityManager> buildingManagers = m_sdmsDataManager.GetSelectManager().SelectBuildingFacilityManagers(null, strCondition, out strError);
                if (buildingManagers == null)
                    throw new ApplicationException(strError);

                //rollbackData = new TeamRollbackData();
                //rollback.AddData(rollbackData);

                //List<BuildingFacilityManager> rollbackBuildingManagers = new List<BuildingFacilityManager>();
                //rollbackData.SetInsertBuildingFacilityManagers(rollbackBuildingManagers);

                foreach (SDMS.Model.Sensor.BuildingFacilityManager manager in buildingManagers)
                {
                    Dictionary<SDMS.Model.Sensor.BuildingFacilityManager.Fields, object> dicConditions = new Dictionary<SDMS.Model.Sensor.BuildingFacilityManager.Fields, object>();
                    dicConditions[SDMS.Model.Sensor.BuildingFacilityManager.Fields.ID] = manager.ID;

                    if (dataManager.GetDeleteManager().DeleteBuildingFacilityManager(dicConditions, null, out strError) == false)
                        throw new ApplicationException(strError);
                }

                strCondition = string.Format("{0} = {1} and {2} in ({3})",
                    SDMS.Model.Sensor.EquipZoneFacilityManager.GetFieldName(SDMS.Model.Sensor.EquipZoneFacilityManager.Fields.MemberType, out isNullable),
                    memberType,
                    SDMS.Model.Sensor.EquipZoneFacilityManager.GetFieldName(SDMS.Model.Sensor.EquipZoneFacilityManager.Fields.MemberID, out isNullable),
                    memberID);

                List<SDMS.Model.Sensor.EquipZoneFacilityManager> equipZoneManagers = dataManager.GetSelectManager().SelectEquipZoneFacilityManagers(null, strCondition, out strError);
                if (equipZoneManagers == null)
                    throw new ApplicationException(strError);

                //rollbackData = new TeamRollbackData();
                //rollback.AddData(rollbackData);

                //List<EquipZoneFacilityManager> rollbackEquipZoneManagers = new List<EquipZoneFacilityManager>();
                //rollbackData.SetInsertEquipZoneFacilityManagers(rollbackEquipZoneManagers);

                foreach (SDMS.Model.Sensor.EquipZoneFacilityManager manager in equipZoneManagers)
                {
                    Dictionary<SDMS.Model.Sensor.EquipZoneFacilityManager.Fields, object> dicConditions = new Dictionary<SDMS.Model.Sensor.EquipZoneFacilityManager.Fields, object>();
                    dicConditions[SDMS.Model.Sensor.EquipZoneFacilityManager.Fields.ID] = manager.ID;

                    if (dataManager.GetDeleteManager().DeleteEquipZoneFacilityManager(dicConditions, null, out strError) == false)
                        throw new ApplicationException(strError);
                }
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return false;
            }

            return true;
        }

        private bool RemoveTemporaryMembers(TeamEditor.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager, int? nRegularTeamID, int? nRegularMemberID, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (dataManager == null || sdmsDataManager == null)
                return true;

            string strCondition = "";
            bool isNullable;

            if (nRegularTeamID != null)
            {
                strCondition = string.Format("{0} in ({1})", TemporaryMember.GetFieldName(TemporaryMember.Fields.RegularID, out isNullable), nRegularTeamID);
            }

            if (nRegularMemberID != null)
            {
                if (strCondition.Length == 0)
                    strCondition = string.Format("{0} in ({1})", TemporaryMember.GetFieldName(TemporaryMember.Fields.RegularMemberID, out isNullable), nRegularMemberID);
                else
                    strCondition += string.Format(" and {0} in ({1})", TemporaryMember.GetFieldName(TemporaryMember.Fields.RegularMemberID, out isNullable), nRegularMemberID);
            }

            if (strCondition.Length == 0)
                return true;


            List<TemporaryMember> members = dataManager.GetSelectManager().SelectTemporaryMembers(null, strCondition, out strErrorMessage);
            if (members == null)
                return false;

            foreach (TemporaryMember member in members)
            {
                if (RemoveFacilityManagers(sdmsDataManager, (int)SDMS.Model.Sensor.FacilityManager.MemberTypes.TemporaryMember, member.ID, out strErrorMessage) == false)
                    return false;
            }

            //TeamRollbackData rollbackData = new TeamRollbackData();
            //rollback.AddData(rollbackData);

            //List<TemporaryMember> rollbackMembers = new List<TemporaryMember>();
            //rollbackData.SetInsertTemporaryMembers(rollbackMembers);

            foreach (TemporaryMember member in members)
            {
                if (dataManager.GetDeleteManager().DeleteTemporaryMember(member.ID, out strErrorMessage) == false)
                    return false;
            }

            return true;
        }

        private bool RemoveAccountUser(SOPManager.IDAL.IDataManager sopDataManager, int nUserID, out string strErrorMessage)
        {
            bool isNullable;

            strErrorMessage = "";
            
            //TeamRollbackData rollbackData = new TeamRollbackData();
            //rollback.AddData(rollbackData);

            string strCondition = string.Format("{0} in ({1})", SOPManager.Model.Sop.Account.User.GetFieldName(SOPManager.Model.Sop.Account.User.Fields.MemberID, out isNullable), nUserID);

            List<SOPManager.Model.Sop.Account.User> users = sopDataManager.GetSelectManager().SelectUsers(strCondition, out strErrorMessage);
            if (users == null)
                return false;

            //rollbackData = new TeamRollbackData();
            //rollback.AddData(rollbackData);

            //List<User> rollbackUsers = new List<User>();
            //rollbackData.SetInsertUsers(rollbackUsers);

            foreach (SOPManager.Model.Sop.Account.User user in users)
            {
                // 연동 계정 옵션 제거
                strCondition = string.Format("{0} in ({1})", SOPManager.Model.Sop.Account.Option.GetFieldName(SOPManager.Model.Sop.Account.Option.Fields.UserID, out isNullable), user.ID);
                List<SOPManager.Model.Sop.Account.Option> options = sopDataManager.GetSelectManager().SelectOptions(null, strCondition, null, out strErrorMessage);
                if (options == null)
                    return false;

                //List<Option> rollbackOptions = new List<Option>();
                //rollbackData.SetInsertOptions(rollbackOptions);

                foreach (SOPManager.Model.Sop.Account.Option option in options)
                {
                    if (sopDataManager.GetDeleteManager().DeleteOption(option.ID) == false)
                    {
                        strErrorMessage = "DeleteOption 실패";
                        return false;
                    }
                }

                string strSQL = $"update {Common.Model.History.ActionStepHistory.TableName} set {Common.Model.History.ActionStepHistory.Fields.LastAccessedUserID}=null where {Common.Model.History.ActionStepHistory.Fields.LastAccessedUserID}={user.ID}";
                if (sopDataManager.GetSelectManager().GetResultData(strSQL, out strErrorMessage) == null)
                    return false;

                strSQL = $"update {Common.Model.History.ComponentHistory.TableName} set {Common.Model.History.ComponentHistory.Fields.AccessedUserID}=null where {Common.Model.History.ComponentHistory.Fields.AccessedUserID}={user.ID}";
                if (sopDataManager.GetSelectManager().GetResultData(strSQL, out strErrorMessage) == null)
                    return false;

                // 연동 계정 세션 제거
                strCondition = string.Format("{0} in ({1})", SOPManager.Model.Sop.Account.Session.GetFieldName(SOPManager.Model.Sop.Account.Session.Fields.AccountUserID, out isNullable), user.ID);

                List<SOPManager.Model.Sop.Account.Session> sessions = sopDataManager.GetSelectManager().SelectSessions(null, strCondition, null, out strErrorMessage);
                if (sessions == null)
                    return false;

                //rollbackData = new TeamRollbackData();
                //rollback.AddData(rollbackData);

                //List<Session> rollbackSessions = new List<Session>();
                //rollbackData.SetInsertSessions(rollbackSessions);

                foreach (SOPManager.Model.Sop.Account.Session session in sessions)
                {
                    if (sopDataManager.GetDeleteManager().DeleteSession(session.ID) == false)
                    {
                        strErrorMessage = $"DeleteSession 실패 session.ID: {session.ID}";
                        return false;
                    }
                }

                // 연동 계정 제거
                if (sopDataManager.GetDeleteManager().DeleteUser(user.ID) == false)
                {
                    strErrorMessage = $"DeleteUser 실패 user.ID: {user.ID}";
                    return false;
                }
            }

            return true;
        }

        private bool RemoveRegular(TeamEditor.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager, ICollection<Regular> regulars, out string strErrorMessage)
        {
            strErrorMessage = "";

            foreach (Regular regular in regulars)
            {
                if (RemoveFacilityManagers(sdmsDataManager, (int)SDMS.Model.Sensor.FacilityManager.MemberTypes.RegularTeam, regular.ID, out strErrorMessage) == false)
                    return false;

                if (RemoveTemporaryMembers(dataManager, sdmsDataManager, regular.ID, null, out strErrorMessage) == false)
                    return false;
            }

            //TeamRollbackData rollbackData = new TeamRollbackData();
            //rollback.AddData(rollbackData);

            //List<Regular> rollbackTeams = new List<Regular>();
            //rollbackData.SetInsertRegulars(rollbackTeams);

            foreach (Regular regular in regulars)
            {
                if (m_dataManager.GetDeleteManager().DeleteRegular(regular.ID, out strErrorMessage) == false)                
                    Logger.Write($"RemoveRegular DeleteRegular 예외처리: regular.ID: {regular.ID}, regular.TeamName: {regular.TeamName} ({strErrorMessage})");                

            }

            return true;
        }









        public static string EncryptString(string str)
        {
            return AES256Cipher.AES_encrypt(str, key);
        }

        public static string DecryptString(string str)
        {
            return AES256Cipher.AES_decrypt(str, key);
        }
    }
}
