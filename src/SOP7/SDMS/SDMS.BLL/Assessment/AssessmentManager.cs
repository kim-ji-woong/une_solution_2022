using dnsEmail;
using dnsSMS;
using SDMS.BLL.Models.Data;
using SDMS.BLL.Models.Request.Assessment;
using SDMS.BLL.Models.Response;
using SDMS.BLL.Models.Response.Assessment;
using SDMS.IDAL;
using SDMS.Model.Assessment;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamEditor.Model.Sop.Team;

namespace SDMS.BLL.Assessment
{
    public class AssessmentManager
    {
        private SDMS.IDAL.IDataManager m_dataManager = null;
        private ProcessManager m_procManager = null;
        private SpatialManager m_spatialManager = null;

        private static string CheckFormURL = "/safetyCheckForm";

        // 자동발송 여부 체크
        //private static bool m_bIsSend = false;
        //private static DateTime m_dtSendDate;

        private static readonly string AES_key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

        public AssessmentManager(SDMS.IDAL.IDataManager dataManager, ProcessManager procManager)
        {
            m_dataManager = dataManager;
            m_procManager = procManager;

            m_spatialManager = new SpatialManager();
            m_spatialManager.LoadSpatial(m_dataManager);
        }

        /// <summary>
        /// 평가 양식 리스트 조회
        /// </summary>
        /// <returns></returns>
        public ResAssessmentQList LoadQList()
        {
            ResAssessmentQList res = new ResAssessmentQList();
            try
            {
                string strError;
                List<AssessmentQ> qList = m_dataManager.GetSelectManager().SelectAssessmentQs(null, $"{AssessmentQ.Fields.EquipZoneID} is Not Null order by {AssessmentQ.Fields.UpdateDate} desc", out strError);
                if (qList == null)
                    throw new ApplicationException(strError);

                res.QList = qList;

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 특정 평가 양식 문항 조회
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResAssessmentQItemList LoadQItemList(ReqLoadQItemList req)
        {
            ResAssessmentQItemList res = new ResAssessmentQItemList();
            try
            {
                string strError;
                string strAdditionalConditions = null;
                if (req.QID.HasValue)
                    strAdditionalConditions = $"QID={req.QID.Value}";

                List<AssessmentQItem> qItemList = m_dataManager.GetSelectManager().SelectAssessmentQItems(null, strAdditionalConditions, out strError);
                if (qItemList == null)
                    throw new ApplicationException(strError);

                res.QItems = qItemList;

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 평가 양식 삭제
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public MessageResult DeleteQ(ReqDeleteQ req)
        {
            MessageResult res = new MessageResult();
            IDataManager dataManager = m_dataManager.Clone();
            try
            {
                if (dataManager.BeginBatch() == false)
                {
                    res.Message = "트랜잭션 오류 (BeginBatch Error)";
                    return res;
                }

                string strError;

                if (!dataManager.GetDeleteManager().DeleteAssessmentQItem(null, $"{AssessmentQItem.Fields.QID}={req.QID}", out strError))
                    throw new ApplicationException(strError);

                if (!dataManager.GetDeleteManager().DeleteAssessmentQ(req.QID, out strError))
                    throw new ApplicationException(strError);

                if (dataManager.BatchCommit() == false)
                    throw new ApplicationException("평가 저장 실패");

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                dataManager.BatchRollback();
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 평가 양식 저장
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public MessageSaveResult SaveQ(ReqSaveQ req)
        {
            MessageSaveResult res = new MessageSaveResult();
            IDataManager dataManager = m_dataManager.Clone();
            try
            {
                string strError, strConditions;
                DateTime dtNow = DateTime.Now;
                string strSQL = string.Empty;

                AssessmentQ q = null;

                Dictionary<AssessmentQ.Fields, object> dicConditions = new Dictionary<AssessmentQ.Fields, object>();
                dicConditions[AssessmentQ.Fields.EquipZoneID] = req.EqZoneID;
                dicConditions[AssessmentQ.Fields.Type] = req.Type;

                // 해당 구역 조회
                List<AssessmentQ> assessmentQs = dataManager.GetSelectManager().SelectAssessmentQs(dicConditions, null, out strError);
                if (assessmentQs == null)
                    throw new ApplicationException(strError);

                if (dataManager.BeginBatch() == false)
                {
                    res.Message = "트랜잭션 오류 (BeginBatch Error)";
                    return res;
                }

                bool isCreate = true;

                if (assessmentQs.Count > 0)
                {
                    // 존재하면 업데이트
                    isCreate = false;

                    q = assessmentQs[0];
                    q.MemberIDs = req.MemberIDs;
                    q.UpdateDate = dtNow;

                    if (!dataManager.GetUpdateManager().UpdateAssessmentQ(q, out strError))
                        throw new ApplicationException(strError);

                    // 1개 이상일 경우
                    if (assessmentQs.Count > 1)
                    {
                        if (q.EquipZoneID.HasValue)
                            strConditions = $"{AssessmentQ.Fields.EquipZoneID}={q.EquipZoneID} and {AssessmentQ.Fields.ID}!={q.ID}";
                        else
                            strConditions = $"{AssessmentQ.Fields.EquipZoneID} is Null and {AssessmentQ.Fields.ID}!={q.ID}";
                        if (!dataManager.GetDeleteManager().DeleteAssessmentQ(null, strConditions, out strError))
                            throw new ApplicationException(strError);
                    }                       
                }
                else
                {
                    // 없으면 생성
                    q = new AssessmentQ();
                    q.ID = -1;
                    q.EquipZoneID = req.EqZoneID;
                    q.MemberIDs = req.MemberIDs;
                    q.CreateDate = q.UpdateDate = dtNow;
                    q.Type = req.Type;

                    AssessmentQ createQ = dataManager.GetCreateManager().CreateAssessmentQ(q, out strError);
                    if (createQ == null)
                        throw new ApplicationException(strError);

                    q.ID = createQ.ID;
                }

                List<int> itemIDs = new List<int>();

                foreach (AssessmentQItem item in req.QItemList)
                {
                    item.QID = q.ID;
                    if (item.Contents == null || item.Contents.Length == 0)
                        continue;

                    if (isCreate || item.ID <= 0)
                    {
                        AssessmentQItem createQItem = dataManager.GetCreateManager().CreateAssessmentQItem(item, out strError);
                        if (createQItem == null)
                            throw new ApplicationException(strError);

                        item.ID = createQItem.ID;
                    }
                    else
                    {
                        if (!dataManager.GetUpdateManager().UpdateAssessmentQItem(item, out strError))
                            throw new ApplicationException(strError);
                    }

                    itemIDs.Add(item.ID);
                }

                strConditions = $"{AssessmentQItem.Fields.QID}={q.ID}";
                if (itemIDs.Count > 0)
                    strConditions += $" and {AssessmentQItem.Fields.ID} not in ({string.Join(",", itemIDs)})";
                if (!dataManager.GetDeleteManager().DeleteAssessmentQItem(null, strConditions, out strError))
                    throw new ApplicationException(strError);

                if (dataManager.BatchCommit() == false)
                    throw new ApplicationException("평가 저장 실패");

                res.SaveID = q.ID;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                dataManager.BatchRollback();
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 평가 전송
        /// </summary>
        /// <param name="req"></param>
        /// <param name="strFrontURL"></param>
        /// <returns></returns>
        public MessageResult SendAssessment(ReqSendAssessment req, string strFrontURL)
        {
            MessageResult res = new MessageResult();
            IDataManager dataManager = m_dataManager.Clone();
            try
            {
                if (req.Contents == null || req.Contents.Count == 0)
                {
                    res.Message = "평가 항목을 입력하세요";
                    return res;
                }

                if (req.ReceiverMemberIDs == null || req.ReceiverMemberIDs.Count == 0)
                {
                    res.Message = "수신자를 선택하세요";
                    return res;
                }

                string strError = null;

                if (SendAssessmentMail(dataManager, m_procManager.TeamDataManager, m_procManager.SopDataManager, req.EquipmentZoneID, req.Contents, req.ReceiverMemberIDs, CheckFormURL, strFrontURL, req.Type, req.SendUserID, out strError) == false)
                    throw new ApplicationException(strError);

                res.Success = true;
                return res;
            }
            catch (Exception e)
            {
                res.Message = e.Message;
                return res;
            }
        }

        private static bool SendAssessmentMail(IDataManager dataManager, TeamEditor.IDAL.IDataManager teamDataManager, SOPManager.IDAL.IDataManager sopDataManager, int equipmentZoneID, List<string> contents, List<int> receiverMemberIDs, string strCheckFormURL, string strFrontURL, int nType, int? nSendUserID, out string strError)
        {
            strError = "";

            if (dataManager == null)
            {
                strError = "DataManager 가 존재하지 않습니다.";
                return false;
            }

            try
            {
                if (dataManager.BeginBatch() == false)
                {
                    strError = "트랜잭션 오류 (BeginBatch Error)";
                    return false;
                }

                DateTime dtNow = DateTime.Now;

                Model.Assessment.Assessment assessment = new Model.Assessment.Assessment();
                assessment.EquipmentZoneID = equipmentZoneID;
                assessment.SendDate = dtNow;
                assessment.ResultDate = new DateTime(dtNow.AddDays(3).Year, dtNow.AddDays(3).Month, dtNow.AddDays(3).Day, 23, 59, 59);
                assessment.Type = nType;

                Model.Assessment.Assessment createAssessment = dataManager.GetCreateManager().CreateAssessment(assessment, out strError);
                if (createAssessment == null)
                    throw new ApplicationException(strError);

                assessment.ID = createAssessment.ID;
                foreach (string content in contents)
                {
                    AssessmentA a = new AssessmentA();
                    a.AssessmentID = assessment.ID;
                    a.Contents = content;

                    AssessmentA createA = dataManager.GetCreateManager().CreateAssessmentA(a, out strError);
                    if (createA == null)
                        throw new ApplicationException(strError);
                }

                foreach (int memberID in receiverMemberIDs)
                {
                    AssessmentAMember member = new AssessmentAMember();
                    member.AssessmentID = assessment.ID;
                    member.MemberID = memberID;

                    AssessmentAMember createA = dataManager.GetCreateManager().CreateAssessmentAMember(member, out strError);
                    if (createA == null)
                        throw new ApplicationException(strError);
                }                

                string strMemberIDs = string.Join(",", receiverMemberIDs);
                string strConditions = $"{RegularMember.Fields.ID} in ({strMemberIDs})";

                List<RegularMember> regularMembers = teamDataManager.GetSelectManager().SelectRegularMembers(strConditions, out strError);
                if (regularMembers == null)
                    return false;

                // 문자도 함께 보내야 함
                Dictionary<int, RegularMember> dicMails = new Dictionary<int, RegularMember>();
                foreach (RegularMember item in regularMembers)
                {
                    if (item.Email?.Length > 0)
                        dicMails[item.ID] = item;
                }

                if (dicMails.Count == 0)
                    throw new ApplicationException("Email 정보를 입력한 인원이 없습니다");

                Model.Spatial.EquipmentZone equipZone = dataManager.GetSelectManager().SelectEquipmentZone(equipmentZoneID, out strError);
                if (equipZone == null)
                    throw new ApplicationException(strError);


                string strSendSABUN = "안전관리시스템";
                if (nSendUserID.HasValue && nSendUserID.Value > 0 && sopDataManager != null)
                {
                    SOPManager.Model.Sop.Account.User user = sopDataManager.GetSelectManager().SelectUser(nSendUserID.Value, out strError);
                    if (user != null)
                    {
                        strSendSABUN = user.UserID;

                        // 이름으로 변경
                        strSendSABUN = user.NickName;

                        if (strSendSABUN == "admin")
                            strSendSABUN = "UNE admin";
                    }                        
                }

                int sendSuc = 0;
                string failMsg = string.Empty;
                IEmailClient clientMail = EmailClientFactory.CreateMailClient();
                if (clientMail != null)
                {
                    EmailContent eContents = new EmailContent();
                    eContents.Title = $@"{equipZone.DisplayText} 구역평가";
                    eContents.Subject = $@"{equipZone.DisplayText} 구역평가";
                    eContents.TimeStamp = dtNow;

                    string strType = "";
                    if (assessment.Type == 1)
                        strType = "Zone";
                    else if (assessment.Type == 2)
                        strType = "안전환경";
                    else if (assessment.Type == 3)
                        strType = "현업";
                    else if (assessment.Type == 4)
                        strType = "안전/보건";
                    else if (assessment.Type == 5)
                        strType = "방재/환경";

                    eContents.Caller = strSendSABUN;

                    foreach (KeyValuePair<int, RegularMember> pair in dicMails)
                    {
                        eContents.EmailList.Clear();
                        eContents.EmailList.Add(pair.Value.Email);                        

                        string strURL = strFrontURL + strCheckFormURL + $"?assessmentID={assessment.ID}&memberID={pair.Key}";
                        string strMessage = $@"
                            <HTML>
                                <h3><strong>{equipZone.DisplayText} 구역평가를 진행하세요</strong></h3>                                
                                <p><span style='color: #000000;'><a title='{equipZone.DisplayText} 구역평가' href='{strURL}'>[맵핑] {equipZone.DisplayText} 구역 평가하기</a></span></p>
                                <p><span style='color: #000000;'> - {strType} 평가</span></p>
                                <p><span style='color: #000000;'></span></p>
                                <p><span style='color: #000000;'>☏문의사항: 방재그룹</span></p>
                            </HTML>";

                        eContents.Message = strMessage;

                        eContents.Tag = pair.Value.MemberName;  // 수신자 이름

                        if (clientMail.SendEmail(eContents, ref strError))
                        {
                            sendSuc++;

                            if (pair.Value.PhoneNumber?.Length > 0)
                            {
                                string strPhoneNumber = DecryptPhoneNumber(pair.Value.PhoneNumber);
                                //dicPhoneNumbers[strPhoneNumber] = strPhoneNumber;

                                // 문자 발송
                                IMessageClient client = MessageClientFactory.CreateMessageClient();
                                if (client != null)
                                {
                                    //List<string> phoneNumbers = dicPhoneNumbers.Values.ToList();
                                    List<string> phoneNumbers = new List<string>(); 
                                    phoneNumbers.Add(strPhoneNumber);

                                    List<string> names = new List<string>();
                                    names.Add(pair.Value.MemberName);

                                    MessageContent content = new MessageContent();
                                    content.Caller = strSendSABUN;
                                    content.PhoneNumbers.AddRange(phoneNumbers);
                                    content.EMails.AddRange(names);
                                    content.Message = "[원익큐엔씨]\n안녕하세요. " + pair.Value.MemberName + "님\n안전구역 평가등록 요청 드립니다.\n\n평가대상 : " + equipZone.DisplayText + "\n\n* 수신된 메일 링크를 통하여 진행 바랍니다.\n* 문의사항은 방재그룹에 연락 바랍니다.";
                                    content.Tag = "024100000079"; // 템플릿 코드
                                    client.SendSMS(content);
                                }
                            }
                        }
                        else
                        {
                            System.Diagnostics.Trace.WriteLine("메일을 보낼수 없습니다 관리자에게 문의하세요 " + strError);
                            failMsg = "메일을 보낼수 없습니다 관리자에게 문의하세요 " + strError;
                        }
                    }
                }

                if (sendSuc == 0)
                {
                    strError = failMsg;
                    throw new ApplicationException(strError);
                }

                if (dataManager.BatchCommit() == false)
                    throw new ApplicationException("BatchCommit 실패하였습니다.");
            }
            catch (Exception ex)
            {
                if (dataManager != null)
                    dataManager.BatchRollback();

                strError = ex.Message;
                return false;
            }

            return true;
        }

        public static string DecryptPhoneNumber(string strPhoneNumber)
        {
            return dnsDBUtil.AES256Cipher.AES_decrypt(strPhoneNumber, AES_key);
        }

        /// <summary>
        /// 평가 정보 조회 (평가자가 평가하는 페이지)
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResLoadAssessment LoadAssessment(ReqLoadAssessment req)
        {
            ResLoadAssessment res = new ResLoadAssessment();
            try
            {
                string strError = null;
                string strSQL = $@"
                    select SendDate, m.Score, a.EquipmentZoneID, ez.ZoneName, a.Type
                      from SdmsAssessment a
                     inner join SdmsAssessmentAMember m on a.ID=m.AssessmentID  
                     inner join (select ez.ID,
	                                Concat(isnull(bg.DisplayText + ' > ', ''),
			                                isnull(b.DisplayText + ' > ', ''),
			                                isnull(z.DisplayText + ' > ', ''),
			                                isnull(ez.DisplayText, ez.ZoneName)) ZoneName
                                from SdmsSpatialEquipmentZone ez
                                inner join SdmsSpatialZone z on z.ID=ez.LinkedZoneIDList
                                left outer join SdmsSpatialBuilding b on b.ID=z.BuildingID
                                left outer join SdmsSpatialBuildingGroup bg on bg.ID=b.BuildingGroupID) ez on a.EquipmentZoneID=ez.ID
                     where a.ID={req.AssessmentID} and m.MemberID={req.MemberID}";

                ArrayList arrResult =m_dataManager.GetSelectManager().GetResultData(strSQL, out strError);
                if (arrResult == null)
                    throw new ApplicationException(strError);

                if (arrResult.Count != 5)
                    throw new ApplicationException("평가 데이터를 조회할 수 없습니다");

                dnsDBUtil.VariousData<DateTime> dtSendDate = dnsDBUtil.WebDBManager.GetDateTimeField(arrResult[0]);
                dnsDBUtil.VariousData<float> nScore = dnsDBUtil.WebDBManager.GetFloatField(arrResult[1].ToString());
                dnsDBUtil.VariousData<int> nEquipmentZoneID = dnsDBUtil.WebDBManager.GetIntField(arrResult[2].ToString());
                string strZoneName = dnsDBUtil.WebDBManager.GetStringField(arrResult[3]);
                dnsDBUtil.VariousData<int> nType = dnsDBUtil.WebDBManager.GetIntField(arrResult[4].ToString());

                if (dtSendDate == null || nEquipmentZoneID == null)
                    throw new ApplicationException("평가 데이터를 조회할 수 없습니다");

                //if (nScore != null || nScore.Data > 0)
                //    throw new ApplicationException("이미 평가를 완료했습니다");

                LoadAssessmentData data = new LoadAssessmentData();
                data.Deadline = dtSendDate.Data.AddDays(3);
                if (nScore != null)
                    data.Score = nScore.Data;
                data.EquipmentZoneID = nEquipmentZoneID.Data;
                data.ZoneName = strZoneName;
                if (nType != null)
                    data.Type = nType.Data;

                res.AssessmentData = data;

                //List<AssessmentA> aList = m_dataManager.GetSelectManager().SelectAssessmentAs(null, $"{AssessmentA.Fields.AssessmentID}={req.AssessmentID}", out strError);
                //if (aList == null)
                //    throw new ApplicationException(strError);

                //res.AList = aList;
                strSQL = $@"
                    SELECT a.ID
                          ,a.AssessmentID
                          ,a.Contents
	                      ,aItem.Score
	                      ,aItem.Memo
                    FROM SdmsAssessmentA AS a
                    LEFT OUTER JOIN SdmsAssessmentAItem AS aItem ON a.ID = aItem.AID and aItem.MemberID={req.MemberID}
                    WHERE a.AssessmentID={req.AssessmentID}
                    order by a.ID";

                arrResult = m_dataManager.GetSelectManager().GetResultData(strSQL, out strError);
                if (arrResult == null)
                    throw new ApplicationException(strError);

                List<AListData> aListData = new List<AListData>();

                int resultCount = arrResult.Count;
                for (int i = 0; i < resultCount - 4; i += 5)
                {
                    dnsDBUtil.VariousData<int> ID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString());
                    dnsDBUtil.VariousData<int> AssessmentID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 1].ToString());
                    string strContents = dnsDBUtil.WebDBManager.GetStringField(arrResult[i + 2]);
                    dnsDBUtil.VariousData<float> Score = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 3].ToString());
                    string strMemo = dnsDBUtil.WebDBManager.GetStringField(arrResult[i + 4]);

                    if (ID == null || AssessmentID == null)
                        continue;

                    AListData aData = new AListData();
                    aData.ID = ID.Data;
                    aData.AssessmentID = AssessmentID.Data;
                    aData.Contents = strContents;

                    float? fScore = null;
                    if (Score != null)
                        fScore = Score.Data;

                    aData.Score = fScore;
                    aData.Memo = strMemo;

                    aListData.Add(aData);
                }

                res.AList = aListData;




                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 평가자가 평가하기
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public MessageResult SaveAssessment(ReqSaveAssessment req)
        {
            MessageResult res = new MessageResult();
            IDataManager dataManager = null;
            try
            {
                if (req.AItemDatas == null || req.AItemDatas.Count == 0)
                {
                    res.Message = "저장할 평가내역이 없습니다";
                    return res;
                }

                string strError = null;
                Model.Assessment.Assessment assessment = m_dataManager.GetSelectManager().SelectAssessment(req.AssessmentID, out strError);
                if (assessment == null)
                    throw new ApplicationException("평가 정보가 없습니다. " + strError);

                //if (DateTime.Now > assessment.SendDate.AddDays(3))
                //    throw new ApplicationException("제출기한이 지났습니다.");

                AssessmentAMember member = m_dataManager.GetSelectManager().SelectAssessmentAMember(req.AssessmentID, req.MemberID, out strError);
                if (member == null)
                    throw new ApplicationException("평가자 정보가 없습니다. " + strError);

                //if (member.Score != null)
                //    throw new ApplicationException("이미 평가가 완료되었습니다.");

                List<AssessmentA> aList = m_dataManager.GetSelectManager().SelectAssessmentAs(null, $"{AssessmentA.Fields.AssessmentID}={req.AssessmentID}", out strError);
                if (aList == null)
                    throw new ApplicationException(strError);

                int nAItemCount = req.AItemDatas.Count;

                if (aList.Count != nAItemCount && aList.Count != (nAItemCount - 1))
                    throw new ApplicationException("모든 문항을 평가하세요");

                dataManager = m_dataManager.Clone();
                if (dataManager.BeginBatch() == false)
                {
                    res.Message = "트랜잭션 오류";
                    return res;
                }

                // 그 전에 평가기록이 있다면 삭제
                string strConditions = $"{AssessmentAItem.Fields.AssessmentID}={req.AssessmentID} and {AssessmentAItem.Fields.MemberID}={req.MemberID}";
                if (!dataManager.GetDeleteManager().DeleteAssessmentAItem(null, strConditions, out strError))
                    throw new ApplicationException(strError);

                //bool? bIsPass = null;
                int nTotalScore = 0;
                foreach (SaveAssessmentData item in req.AItemDatas)
                {
                    if (item.AID == -1)
                    {
                        //bIsPass = item.Score == 5 ? true : false;
                        nAItemCount--;
                        continue;
                    }                        
                    else if (item.Score < 0)
                        throw new ApplicationException("점수를 선택하세요");
                    AssessmentAItem aItem = new AssessmentAItem();
                    aItem.AssessmentID = req.AssessmentID;
                    aItem.AID = item.AID;
                    aItem.MemberID = req.MemberID;
                    aItem.Score = item.Score;
                    aItem.Memo = item.Memo;

                    AssessmentAItem createAItem = dataManager.GetCreateManager().CreateAssessmentAItem(aItem, out strError);
                    if (createAItem == null)
                        throw new ApplicationException(strError);

                    nTotalScore += item.Score;
                }

                // 평가자 평균
                double scoreAvg = Math.Round(((double)nTotalScore / (double)nAItemCount), 2);

                Dictionary<AssessmentAMember.Fields, object> dicSets = new Dictionary<AssessmentAMember.Fields, object>();
                dicSets.Add(AssessmentAMember.Fields.Score, scoreAvg);
                //dicSets.Add(AssessmentAMember.Fields.IsPass, bIsPass);
                dicSets.Add(AssessmentAMember.Fields.Memo, req.Memo);

                strConditions = $"{AssessmentAMember.Fields.AssessmentID}={req.AssessmentID} and {AssessmentAMember.Fields.MemberID}={req.MemberID}";
                    
                if (!dataManager.GetUpdateManager().UpdateAssessmentAMember(dicSets, null, strConditions, out strError))
                    throw new ApplicationException(strError);

                // 해당 평가 전체 평가자 평균 (평가 완료한것만 계산)
                strConditions = $"{AssessmentAMember.Fields.AssessmentID}={req.AssessmentID} and {AssessmentAMember.Fields.Score} >= 0";
                string strSQL = $@"select round(AVG({AssessmentAMember.Fields.Score}),2) score, sum({AssessmentAMember.Fields.IsPass}) as pass from {AssessmentAMember.TableName} where {AssessmentAMember.Fields.AssessmentID}={req.AssessmentID} and Score >= 0";
                ArrayList arrAvgScore = dataManager.GetSelectManager().GetResultData(strSQL, out strError);
                if (arrAvgScore == null)
                    throw new ApplicationException(strError);

                float totalAvg = arrAvgScore.Count == 0 ? 0 : dnsDBUtil.WebDBManager.GetFloatField(arrAvgScore[0].ToString(), 0);

                dnsDBUtil.VariousData<int> data = dnsDBUtil.WebDBManager.GetIntField(arrAvgScore[1].ToString());
                //bIsPass = null;
                //if (data != null)
                //    bIsPass = data.Data > 0;

                Dictionary<Model.Assessment.Assessment.Fields, object> dicSets2 = new Dictionary<Model.Assessment.Assessment.Fields, object>();
                dicSets2.Add(Model.Assessment.Assessment.Fields.Score, totalAvg);
                //dicSets2.Add(Model.Assessment.Assessment.Fields.ResultDate, DateTime.Now);
                dicSets2.Add(Model.Assessment.Assessment.Fields.UpdateDate, DateTime.Now);
                dicSets2.Add(Model.Assessment.Assessment.Fields.IsPass, 1);

                strConditions = $"{Model.Assessment.Assessment.Fields.ID}={req.AssessmentID}";
                if (!dataManager.GetUpdateManager().UpdateAssessment(dicSets2, null, strConditions, out strError))
                    throw new ApplicationException(strError);

                if (dataManager.BatchCommit() == false)
                    throw new ApplicationException("트랜잭션 실패");

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                if (dataManager != null)
                    dataManager.BatchRollback();

                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 구역별 등급
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResLoadScoreByZone LoadScoreByZone(ReqLoadScoreByZone req)
        {
            ResLoadScoreByZone res = new ResLoadScoreByZone();

            try
            {
                // 등급 불러오기(사이트별 관리)
                int? nSiteID = req.SiteID;
                if (nSiteID.HasValue == false)                
                    nSiteID = m_procManager.CommonDataManager.SiteID;                

                Dictionary<string, Models.Data.AssessmentClassData> dicAssessmentClass = new Dictionary<string, Models.Data.AssessmentClassData>();

                // 마지막 등급
                //string strFailClassName = "-";

                string strPropertyName = "AssessmentClass";
                List<Common.Model.Option.Options> sdmsOptions = m_procManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID.Value, out string strErrorMessage);
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
                                        Models.Data.AssessmentClassData classData = new Models.Data.AssessmentClassData(strClassName, nStartScore, nEndScore);
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
                    Models.Data.AssessmentClassData classData = new Models.Data.AssessmentClassData("A", 80, 100);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("B", 60, 80);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("C", 40, 60);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("D", 20, 40);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("E", 0, 20);
                    dicAssessmentClass[classData.ClassName] = classData;

                    //strFailClassName = classData.ClassName;
                }

                // 타입별 마지막 결과를 조회 후 평균값 도출
                /*
                string strSQL = $@"
                    select e.ID, AVG(Score) as avgScore
                    from (select ID
                          from SdmsSpatialEquipmentZone 
                          where (REPLACE(LinkedZoneIDList, ' ', '') = '{req.ZoneID}'
                            or REPLACE(LinkedZoneIDList, ' ', '') like '%,{req.ZoneID},%')) e
                    left outer join (select *
				                    from SdmsAssessment a2
									inner join (
									    select Max(sendDate) as MaxSendDate, EquipmentZoneID as EqZoneID, Type as ty
				                        from SdmsAssessment
                                        where Score is not NULL
				                        group by EquipmentZoneID, Type
									) as a3 on a2.EquipmentZoneID = a3.EqZoneID and a2.SendDate = a3.MaxSendDate and a2.Type = a3.ty
			        ) a on e.ID=a.EquipmentZoneID
				    group by e.ID";
                */                
                // 타입별 비율 합산
                // 1차: 존[Type 1] 17, 환경[Type 2] 8,
                // 2차: 현업[Type 3] 10, 안전/보건[Type 4] 7, 방재/환경[Type 5] 8
                // 1차 점수는 반영 안됨
                string strSQL = $@"
                    select e.ID, SUM(CASE WHEN Type = 3 THEN Score * 10 WHEN Type = 4 THEN Score * 7 WHEN Type = 5 THEN Score * 8 ELSE 0 END) as avgScore
                    from (select ID
                          from SdmsSpatialEquipmentZone 
                          where (REPLACE(LinkedZoneIDList, ' ', '') = '{req.ZoneID}'
                            or REPLACE(LinkedZoneIDList, ' ', '') like '%,{req.ZoneID},%')) e
                    left outer join (select *
				                    from SdmsAssessment a2
									inner join (
									    select Max(sendDate) as MaxSendDate, EquipmentZoneID as EqZoneID, Type as ty
				                        from SdmsAssessment
                                        where Score is not NULL
				                        group by EquipmentZoneID, Type
									) as a3 on a2.EquipmentZoneID = a3.EqZoneID and a2.SendDate = a3.MaxSendDate and a2.Type = a3.ty
			        ) a on e.ID=a.EquipmentZoneID
				    group by e.ID";
                

                string strError;
                ArrayList arrResult = m_dataManager.GetSelectManager().GetResultData(strSQL, out strError);
                if (arrResult == null)
                    throw new ApplicationException(strError);

                List<ScoreByZoneData> datas = new List<ScoreByZoneData>();
                int resultCount = arrResult.Count;
                for (int i = 0; i < resultCount - 1; i+=2)
                {
                    dnsDBUtil.VariousData<int> nEquipZoneID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString());
                    dnsDBUtil.VariousData<float> nScore = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 1].ToString());

                    if (nEquipZoneID == null)
                        continue;

                    ScoreByZoneData data = new ScoreByZoneData();
                    data.EquipmentZoneID= nEquipZoneID.Data;

                    string strScore = "-";
                    if (nScore != null)
                    {
                        // 타입별 비율 합산
                        //float fScore = nScore.Data * 25;
                        float fScore = nScore.Data;

                        foreach (KeyValuePair<string, Models.Data.AssessmentClassData> pair in dicAssessmentClass)
                        {
                            string strClassName = pair.Key;
                            Models.Data.AssessmentClassData classData = pair.Value;

                            if (classData.StartScore <= fScore && classData.EndScore >= fScore)
                            {
                                strScore = strClassName;
                                break;
                            }
                        }
                    }

                    data.Score = strScore;
                    datas.Add(data);
                }

                res.ScoreByZoneDatas = datas;
                res.Success = true;
                return res;
            }
            catch (Exception e)
            {
                res.Message = e.Message;
                return res;
            }
        }

        /// <summary>
        /// 평가 제목 중복 조회
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResCheckQTitle CheckQTitle(ReqCheckQTitle req)
        {
            ResCheckQTitle res = new ResCheckQTitle();
            try
            {
                string strError;
                List<AssessmentQ> qList = m_dataManager.GetSelectManager().SelectAssessmentQs(null, $"Title='{req.Title}'", out strError);
                if (qList == null)
                    throw new ApplicationException(strError);
                else if (qList.Count > 0)
                {
                    res.IsCheck = false;
                    res.QID = qList[0].ID;
                }
                else if (qList.Count == 0)
                    res.IsCheck = true;

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }


        /// <summary>
        /// 사이트별 평가 기준 불러오기
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResAssessmentClass LoadAssessmentClass(ReqLoadAssessmentClass req)
        {
            ResAssessmentClass res = new ResAssessmentClass();
            try
            {
                string strErrorMessage;
                // 등급 불러오기(사이트별 관리)
                int? nSiteID = req.SiteID;
                if (nSiteID.HasValue == false)
                    nSiteID = m_procManager.CommonDataManager.SiteID;

                Dictionary<string, Models.Data.AssessmentClassData> dicAssessmentClass = new Dictionary<string, Models.Data.AssessmentClassData>();

                string strPropertyName = "AssessmentClass";
                List<Common.Model.Option.Options> sdmsOptions = m_procManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID.Value, out strErrorMessage);
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
                                        Models.Data.AssessmentClassData classData = new Models.Data.AssessmentClassData(strClassName, nStartScore, nEndScore);
                                        dicAssessmentClass[classData.ClassName] = classData;
                                    }
                                }
                            }
                        }
                    }
                }

                if (dicAssessmentClass.Count == 0)
                {
                    Models.Data.AssessmentClassData classData = new Models.Data.AssessmentClassData("A", 80, 100);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("B", 60, 80);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("C", 40, 60);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("D", 20, 40);
                    dicAssessmentClass[classData.ClassName] = classData;
                    classData = new Models.Data.AssessmentClassData("E", 0, 20);
                    dicAssessmentClass[classData.ClassName] = classData;
                }

                List<Models.Data.AssessmentClassData> assessmentClasses = new List<Models.Data.AssessmentClassData>();

                foreach (KeyValuePair<string, Models.Data.AssessmentClassData> pair in dicAssessmentClass)
                {
                    Models.Data.AssessmentClassData data = pair.Value;
                    assessmentClasses.Add(data);
                }

                res.AssessmentClasses = assessmentClasses;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 사이트별 평가 기준 불러오기
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public MessageResult SaveAssessmentClass(ReqSaveAssessmentClass req)
        {
            MessageResult res = new MessageResult();
            try
            {
                string strErrorMessage;
                // 등급 불러오기(사이트별 관리)
                int? nSiteID = req.SiteID;
                if (nSiteID.HasValue == false)
                    nSiteID = m_procManager.CommonDataManager.SiteID;

                string strPropertyValue = null;
                if (req.ClassA_Start.HasValue && req.ClassA_End.HasValue)
                {
                    if (strPropertyValue == null)
                        strPropertyValue = $"A:{req.ClassA_Start}~{req.ClassA_End}";
                }
                if (req.ClassB_Start.HasValue && req.ClassB_End.HasValue)
                {
                    if (strPropertyValue == null)
                        strPropertyValue = $"B:{req.ClassB_Start}~{req.ClassB_End}";
                    else
                        strPropertyValue += $",B:{req.ClassB_Start}~{req.ClassB_End}";
                }
                if (req.ClassC_Start.HasValue && req.ClassC_End.HasValue)
                {
                    if (strPropertyValue == null)
                        strPropertyValue = $"C:{req.ClassC_Start}~{req.ClassC_End}";
                    else
                        strPropertyValue += $",C:{req.ClassC_Start}~{req.ClassC_End}";
                }
                if (req.ClassD_Start.HasValue && req.ClassD_End.HasValue)
                {
                    if (strPropertyValue == null)
                        strPropertyValue = $"D:{req.ClassD_Start}~{req.ClassD_End}";
                    else
                        strPropertyValue += $",D:{req.ClassD_Start}~{req.ClassD_End}";
                }
                if (req.ClassE_Start.HasValue && req.ClassE_End.HasValue)
                {
                    if (strPropertyValue == null)
                        strPropertyValue = $"E:{req.ClassE_Start}~{req.ClassE_End}";
                    else
                        strPropertyValue += $",E:{req.ClassE_Start}~{req.ClassE_End}";
                }

                if (strPropertyValue == null)
                {
                    res.Message = "평가 기준 데이터가 올바르지 않습니다.";
                    return res;
                }

                Dictionary<string, Models.Data.AssessmentClassData> dicAssessmentClass = new Dictionary<string, Models.Data.AssessmentClassData>();

                string strPropertyName = "AssessmentClass";
                List<Common.Model.Option.Options> sdmsOptions = m_procManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID.Value, out strErrorMessage);
                if (sdmsOptions?.Count > 0)
                {   // 이미 있다면 업데이트
                    Common.Model.Option.Options option = sdmsOptions[0];
                    option.PropertyValue = strPropertyValue;

                    if (m_procManager.CommonDataManager.GetUpdateManager().UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, option) == false)
                    {
                        res.Message = "UpdateOption 실패";
                        return res;
                    }
                }
                else
                {   // 새로 등록
                    string strDescription = "구역평가 등급기준(예시 >> A:80~100,B:60~80,C:40~60,D:20~40,E:0~20)";

                    Common.Model.Option.Options option = new Common.Model.Option.Options();
                    option.TargetName = Common.Model.Option.Options.OptionTarget.SDMS;
                    option.PropertyName = strPropertyName;
                    option.PropertyValue = strPropertyValue;
                    option.SiteID = nSiteID.Value;

                    if (m_procManager.CommonDataManager.GetCreateManager().CreateOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, strPropertyValue, nSiteID.Value, strDescription) == null)
                    {
                        res.Message = "CreateOption 실패";
                        return res;
                    }
                }
               
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 특정 평가 양식 문항 조회
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResAssessmentEqZoneQItem LoadEqZoneQItemList(ReqLoadEqZoneQItemList req)
        {
            ResAssessmentEqZoneQItem res = new ResAssessmentEqZoneQItem();
            try
            {
                string strError;
                string strAdditionalConditions;

                if (req.EquipZoneID.HasValue)
                    strAdditionalConditions = $"{AssessmentQ.TableName}.{AssessmentQ.Fields.EquipZoneID}={req.EquipZoneID}";
                else
                    strAdditionalConditions = $"{AssessmentQ.TableName}.{AssessmentQ.Fields.EquipZoneID} is NULL";

                strAdditionalConditions += $" And {AssessmentQ.TableName}.{AssessmentQ.Fields.Type}={req.Type}";

                ArrayList arrResult = m_dataManager.GetSelectManager().JoinAssessmentQItemQ(strAdditionalConditions, out strError);
                if (arrResult == null)
                    throw new ApplicationException(strError);

                List<AssessmentQItem> qItemList = new List<AssessmentQItem>();

                int resultCount = arrResult.Count;
                for (int i = 0; i < resultCount - 1; i += 2)
                {
                    if (arrResult[i] is AssessmentQItem && arrResult[i + 1] is AssessmentQ)
                    {
                        AssessmentQItem qItem = arrResult[i] as AssessmentQItem;
                        AssessmentQ qData = arrResult[i + 1] as AssessmentQ;

                        if (res.AssessmentQ == null)
                            res.AssessmentQ = qData;

                        qItemList.Add(qItem);
                    }
                }

                res.QItems = qItemList;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 평가 양식 저장
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public MessageResult SaveQlist(ReqSaveQList req)
        {
            MessageResult res = new MessageResult();
            IDataManager dataManager = m_dataManager.Clone();
            try
            {
                string strError, strConditions;

                if (req.Qlist == null)
                {
                    res.Message = "저장할 데이터가 잘못 되었습니다.";
                    return res;
                }

                List<AssessmentQ> _qList = m_dataManager.GetSelectManager().SelectAssessmentQs(null, $"{AssessmentQ.Fields.EquipZoneID} is not NULL order by {AssessmentQ.Fields.UpdateDate} desc", out strError);
                if (_qList == null)
                {
                    res.Message = strError;
                    return res;
                }

                if (dataManager.BeginBatch() == false)
                {
                    res.Message = "트랜잭션 오류";
                    return res;
                }

                List<AssessmentQ> qList = req.Qlist;

                foreach (AssessmentQ qData in qList)
                {
                    foreach (AssessmentQ _qData in _qList)
                    {
                        if (qData.ID == _qData.ID)
                        {
                            if (qData.MemberIDs != _qData.MemberIDs)
                            {
                                // DB 업데이트
                                Dictionary<AssessmentQ.Fields, object> dicSets = new Dictionary<AssessmentQ.Fields, object>();
                                dicSets[AssessmentQ.Fields.MemberIDs] = qData.MemberIDs;
                                dicSets[AssessmentQ.Fields.UpdateDate] = DateTime.Now;
                                Dictionary<AssessmentQ.Fields, object> dicConditions = new Dictionary<AssessmentQ.Fields, object>();
                                dicConditions[AssessmentQ.Fields.ID] = qData.ID;
                                
                                if (m_dataManager.GetUpdateManager().UpdateAssessmentQ(dicSets, dicConditions, null, out strError) == false)
                                    throw new ApplicationException(strError);
                            }

                            _qList.Remove(_qData);
                            break;
                        }
                    }
                }

                if (_qList.Count > 0)
                {
                    string strRemoveIDs = null;

                    foreach (AssessmentQ qData in _qList)
                    {
                        if (strRemoveIDs == null)
                            strRemoveIDs = qData.ID.ToString();
                        else
                            strRemoveIDs += "," + qData.ID.ToString();
                    }

                    strConditions = $"{AssessmentQItem.Fields.QID} in ({strRemoveIDs})";
                    if (m_dataManager.GetDeleteManager().DeleteAssessmentQItem(null, strConditions, out strError) == false)
                        throw new ApplicationException(strError);

                    strConditions = $"{AssessmentQ.Fields.ID} in ({strRemoveIDs})";
                    if (m_dataManager.GetDeleteManager().DeleteAssessmentQ(null, strConditions, out strError) == false)
                        throw new ApplicationException(strError);
                }


                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                dataManager.BatchRollback();
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 사이트별 자동발송 설정 불러오기
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResAutoAssessment LoadAutoAssessment(ReqLoadAutoAssessment req)
        {
            ResAutoAssessment res = new ResAutoAssessment();
            try
            {
                string strErrorMessage;
                int nType = 0;
                int nDate = 0;
                int nSiteID = req.SiteID;

                // 원익의 경우 공통 옵션으로 사용됨
                if (m_procManager.CommonDataManager.SiteID == 30)
                    nSiteID = m_procManager.CommonDataManager.SiteID;

                string strPropertyName = "AutoAssessment";
                List<Common.Model.Option.Options> sdmsOptions = m_procManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID, out strErrorMessage);
                if (sdmsOptions?.Count > 0)
                {
                    Common.Model.Option.Options option = sdmsOptions[0];
                    string strValue = option.PropertyValue;
                    if (strValue != null)
                    {
                        string[] splits = strValue.Split(':');
                        if (splits.Length == 2)
                        {
                            string strType = splits[0];
                            string strDate = splits[1];
                            int _nType = 0;
                            int _nDate = 0;

                            if (int.TryParse(strType, out _nType) && int.TryParse(strDate, out _nDate))
                            {
                                nType = _nType;
                                nDate = _nDate;
                            }
                        }
                    }
                }
                               
                res.Type = nType;
                res.Date = nDate;
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        /// <summary>
        /// 사이트별 자동발송 설정
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public MessageResult SetAutoAssessment(ReqSetAutoAssessment req)
        {
            MessageResult res = new MessageResult();
            try
            {
                string strErrorMessage;
                int nType = req.Type;
                int nDate = req.Date;
                int nSiteID = req.SiteID;

                // 원익의 경우 공통 옵션으로 사용됨
                if (m_procManager.CommonDataManager.SiteID == 30)
                    nSiteID = m_procManager.CommonDataManager.SiteID;

                dnsDBUtil.Logger.Instance.Write($"SetAutoAssessment UserID: {req.UserID}, Type: {req.Type}, Date: {req.Date}");

                string strPropertyName = "AutoAssessment";
                string strDescription = "안전구역 평가 자동발송 설정";
                string strPropertyValue = $"{nType}:{nDate}";

                List<Common.Model.Option.Options> sdmsOptions = m_procManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, nSiteID, out strErrorMessage);
                if (sdmsOptions?.Count > 0)
                {   // 업데이트
                    Common.Model.Option.Options option = sdmsOptions[0];
                                        
                    Dictionary<Common.Model.Option.Options.Fields, object> dicSets = new Dictionary<Common.Model.Option.Options.Fields, object>();
                    dicSets[Common.Model.Option.Options.Fields.PropertyValue] = strPropertyValue;
                    Dictionary<Common.Model.Option.Options.Fields, object> dicConditions = new Dictionary<Common.Model.Option.Options.Fields, object>();
                    dicConditions[Common.Model.Option.Options.Fields.ID] = option.ID;

                    if (m_procManager.CommonDataManager.GetUpdateManager().UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, dicSets, dicConditions, null, out strErrorMessage) == false)
                        throw new ApplicationException(strErrorMessage);
                }
                else
                {   // 생성
                    Common.Model.Option.Options option = new Common.Model.Option.Options();
                    option.PropertyName = strPropertyName;
                    option.PropertyValue = strPropertyValue;
                    option.TargetName = Common.Model.Option.Options.OptionTarget.SDMS;
                    option.SiteID = nSiteID;
                    option.Description = strDescription;

                    if (m_procManager.CommonDataManager.GetCreateManager().CreateOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, strPropertyValue, nSiteID, strDescription) == null)
                        throw new ApplicationException(strErrorMessage);
                }

                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                return res;
            }
        }

        public static void SendAutoAssessment(IDataManager dataManager, Common.IDAL.IDataManager commonDataManager, TeamEditor.IDAL.IDataManager teamDataManager, SpatialManager spatialManager, string strLocalServerURL, bool isAuto = true)
        {
            string strErrorMessage;

            if (dataManager == null || commonDataManager == null || teamDataManager == null || spatialManager == null ||
                strLocalServerURL == null || strLocalServerURL == "")
                return;

            DateTime dtNow = DateTime.Now;

            // 오전 8시 전 또는 오후 6시 이후는 발송 안함
            // 자동 여부 확인 조건 추가
            if ((dtNow.Hour < 8 || dtNow.Hour > 17) && isAuto == true)
                return;

            // m_bIsSend, m_dtSendDate 전역변수로 관리하지 않고 DB 데이터로 관리
            DateTime dtSendDate = DateTime.Now;     // 옵션 데이트 변수

            Common.Model.Option.Options optionSendDate = null;

            string strPropertyName = "AutoAssessmentSendDate";
            List<Common.Model.Option.Options> sdmsOptions = commonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, out strErrorMessage);
            if (sdmsOptions == null)
                return;
            else if (sdmsOptions.Count > 0)
            {
                optionSendDate = sdmsOptions[0];

                try
                {
                    dtSendDate = Convert.ToDateTime(optionSendDate.PropertyValue);
                }
                catch (Exception)
                {
                    dtSendDate = DateTime.Now;
                }
            }

            // 자동 여부 확인 조건 추가
            if (dtNow.Day == dtSendDate.Day && isAuto == true)
                return;

            UpdateSendDateOption(commonDataManager, optionSendDate, dtNow, out strErrorMessage);

            //if (m_bIsSend == false)
            //{   // 발송하지 않은 경우
            // 주기 설정 불러오기
            strPropertyName = "AutoAssessment";
            sdmsOptions = commonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, out strErrorMessage);
            if (sdmsOptions == null)
                return;

            Dictionary<int, AutoAssessmentData> dicSettings = new Dictionary<int, AutoAssessmentData>();
                
            foreach (Common.Model.Option.Options option in sdmsOptions)
            {
                string strValue = option.PropertyValue;
                if (strValue != null)
                {
                    string[] splits = strValue.Split(':');
                    if (splits.Length == 2)
                    {
                        string strType = splits[0];
                        string strDate = splits[1];
                        int _nType = 0;
                        int _nDate = 0;

                        if (int.TryParse(strType, out _nType) && int.TryParse(strDate, out _nDate))
                        {
                            dicSettings[option.SiteID] = new AutoAssessmentData(_nType, _nDate);
                        }
                    }
                }
            }

            if (dicSettings.Count == 0)
                return;
            else
            {   // 기록
                if (dicSettings.ContainsKey(dataManager.SiteID))
                {
                    AutoAssessmentData data = dicSettings[dataManager.SiteID];
                    dnsDBUtil.Logger.Instance.Write($"SendAutoAssessment Log Type: {data.Type}, Date: {data.Date}");
                }
            }
            

            ICollection<EquipmentZoneData> _equipmentZones = spatialManager.EquipZones;
            if (_equipmentZones == null)
                return;

            List<EquipmentZoneData> equipmentZones = _equipmentZones.ToList();

            // 평가 리스트 불러오기
            string strAdditionalConditions = $"{AssessmentQ.Fields.Type} is Not NULL";

            ArrayList arrResult = dataManager.GetSelectManager().JoinAssessmentQItemQ(strAdditionalConditions, out strErrorMessage);
            if (arrResult == null)
                throw new ApplicationException(strErrorMessage);

            Dictionary<int, AssessmentQListData> dicQList = new Dictionary<int, AssessmentQListData>();

            int resultCount = arrResult.Count;
            for (int i = 0; i < resultCount - 1; i += 2)
            {
                if (arrResult[i] is AssessmentQItem && arrResult[i + 1] is AssessmentQ)
                {
                    AssessmentQItem qItem = arrResult[i] as AssessmentQItem;
                    AssessmentQ qData = arrResult[i + 1] as AssessmentQ;

                    if (dicQList.ContainsKey(qData.ID) == false)
                    {
                        AssessmentQListData qList = new AssessmentQListData(qData);
                        dicQList[qData.ID] = qList;
                    }

                    if (dicQList[qData.ID].Contents == null)
                        dicQList[qData.ID].Contents = new List<string>();

                    dicQList[qData.ID].Contents.Add(qItem.Contents);
                }
            }

            if (dicQList.Count == 0)
                return;

            foreach (KeyValuePair<int, AssessmentQListData> pair in dicQList)
            {
                AssessmentQListData qListData = pair.Value;
                AssessmentQ assessmentQ = qListData.Q;

                string strMemberIDs = assessmentQ.MemberIDs;
                if (strMemberIDs == null || strMemberIDs.Length == 0 || 
                    qListData.Contents == null || qListData.Contents.Count == 0)
                    continue;

                List<int> IDs = new List<int>();
                string[] arrIDs = strMemberIDs.Split(',');
                    
                foreach (string strID in arrIDs)
                {
                    if (int.TryParse(strID, out int nID))
                        IDs.Add(nID);
                }

                if (IDs.Count == 0)
                    continue;


                EquipmentZoneData equipment = null;
                if (assessmentQ.EquipZoneID.HasValue)
                    equipment = equipmentZones.Find(x => x.ID == assessmentQ.EquipZoneID);

                if (equipment == null)
                    continue;

                if (equipment.ID == assessmentQ.EquipZoneID)
                {
                    // 원익은 공통 옵션으로 사용함
                    if (dataManager.SiteID == 30)
                        equipment.SiteID = dataManager.SiteID;

                    if (dicSettings.ContainsKey(equipment.SiteID))
                    {   // 현재 날짜와 주기 설정을 체크 후 조건이 맞다면 발송
                        AutoAssessmentData data = dicSettings[equipment.SiteID];

                        if (data.Type == (int)AutoAssessmentData.AutoType.None && isAuto == true)
                        {
                            // 자동으로 보내는 경우에만
                            // 아무 것도 안함                            
                        }
                        else if ((data.Type == (int)AutoAssessmentData.AutoType.Month && dtNow.Day == data.Date) ||
                            (data.Type == (int)AutoAssessmentData.AutoType.Week && (int)dtNow.DayOfWeek == data.Date) ||
                            isAuto == false)
                        {   // 매 달 몇 일 주기가 맞는지 or 매 주 무슨 요일 맞는지
                            // 또는 자동으로 보내는게 아닐 경우

                            // 이메일 발송
                            SendAssessmentMail(dataManager.Clone(), teamDataManager, null, assessmentQ.EquipZoneID.Value, qListData.Contents, IDs, CheckFormURL, strLocalServerURL, assessmentQ.Type.Value, null, out strErrorMessage);
                            // 메일 및 문자 서버 과부하로 인한 딜레이
                            System.Threading.Thread.Sleep(3000);
                        }
                    }
                }
            }
        }

        private static bool UpdateSendDateOption(Common.IDAL.IDataManager commonDataManager, Common.Model.Option.Options option, DateTime dtSendDate, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (commonDataManager == null)
            {
                strErrorMessage = "commonDataManager 값이 존재하지 않습니다.";
                return false;
            }

            if (option == null)
            {   // 생성
                option = new Common.Model.Option.Options();
                option.SiteID = commonDataManager.SiteID;
                option.PropertyName = "AutoAssessmentSendDate";
                option.PropertyValue = dtSendDate.ToString("yyyy-MM-dd HH:mm:ss");

                if (commonDataManager.GetCreateManager().CreateOption(Common.Model.Option.Options.OptionTarget.SDMS, "AutoAssessmentSendDate", dtSendDate.ToString("yyyy-MM-dd HH:mm:ss"), commonDataManager.SiteID) == null)
                {
                    strErrorMessage = "UpdateSendDateOption CreateOption Error";
                    return false;
                }
            }
            else
            {   // 업데이트
                option.PropertyValue = dtSendDate.ToString("yyyy-MM-dd HH:mm:ss");

                if (commonDataManager.GetUpdateManager().UpdateOption(Common.Model.Option.Options.OptionTarget.SDMS, option) == false)
                {
                    strErrorMessage = "UpdateSendDateOption UpdateOption Error";
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// 기본 항목 저장
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public MessageResult SetQList(ReqSetQList req)
        {
            MessageResult res = new MessageResult();
            IDataManager dataManager = m_dataManager.Clone();

            try
            {
                string strErrorMessage;
                int nType = req.Type;

                if (req.QItems == null)
                {
                    strErrorMessage = "저장할 항목이 존재하지 않습니다.";
                    res.Message = strErrorMessage;
                    return res;
                }

                // 해당 타입에 대한 저장된 Q 불러오기
                Dictionary<AssessmentQ.Fields, object> dicConditions = new Dictionary<AssessmentQ.Fields, object>();
                dicConditions[AssessmentQ.Fields.Type] = req.Type;

                List<AssessmentQ> qList = dataManager.GetSelectManager().SelectAssessmentQs(dicConditions, null, out strErrorMessage);
                if (qList == null)
                {
                    res.Message = strErrorMessage;
                    return res;
                }

                if (dataManager.BeginBatch() == false)
                    throw new ApplicationException("평가 저장 실패");

                bool bChkCommQ = false;               

                // 저장할 항목으로 새로 qItem 리스트 생성
                if (qList.Count > 0)
                {
                    List<int> qIDs = new List<int>();
                    List<int> itemIDs = new List<int>();

                    foreach (AssessmentQ q in qList)
                    {
                        qIDs.Add(q.ID);
                    }

                    // 전 qItem 리스트 삭제
                    string strConditions = $"{AssessmentQItem.Fields.QID} in ({string.Join(",", qIDs)})";
                    if (itemIDs.Count > 0)
                        strConditions += $" and {AssessmentQItem.Fields.ID} not in ({string.Join(",", itemIDs)})";
                    if (!dataManager.GetDeleteManager().DeleteAssessmentQItem(null, strConditions, out strErrorMessage))
                        throw new ApplicationException(strErrorMessage);

                    foreach (AssessmentQ q in qList)
                    {
                        if (q.EquipZoneID == null)
                            bChkCommQ = true;

                        foreach (AssessmentQItem item in req.QItems)
                        {
                            item.QID = q.ID;
                            if (item.Contents == null || item.Contents.Length == 0)
                                continue;

                            AssessmentQItem createQItem = dataManager.GetCreateManager().CreateAssessmentQItem(item, out strErrorMessage);
                            if (createQItem == null)
                                throw new ApplicationException(strErrorMessage);

                            item.ID = createQItem.ID;
                            itemIDs.Add(item.ID);
                        }
                    }
                }

                // qList 중 EquipZoneID 값이 NULL 없다면 새로 생성
                if (bChkCommQ == false)
                {
                    DateTime dtNow = DateTime.Now;

                    AssessmentQ q = new AssessmentQ();
                    q.ID = -1;
                    q.EquipZoneID = null;
                    q.MemberIDs = null;
                    q.CreateDate = q.UpdateDate = dtNow;
                    q.Type = req.Type;

                    AssessmentQ createQ = dataManager.GetCreateManager().CreateAssessmentQ(q, out strErrorMessage);
                    if (createQ == null)
                        throw new ApplicationException(strErrorMessage);

                    foreach (AssessmentQItem item in req.QItems)
                    {
                        item.QID = createQ.ID;
                        if (item.Contents == null || item.Contents.Length == 0)
                            continue;

                        AssessmentQItem createQItem = dataManager.GetCreateManager().CreateAssessmentQItem(item, out strErrorMessage);
                        if (createQItem == null)
                            throw new ApplicationException(strErrorMessage);
                    }
                }

                if (dataManager.BatchCommit() == false)
                    throw new ApplicationException("평가 저장 실패");
            
                res.Success = true;
                return res;
            }
            catch (Exception ex)
            {
                dataManager.BatchRollback();
                res.Message = ex.Message;
                return res;
            }
        }



        public ResZoneAssessmentHistories LoadZoneAssessmentHistories(DateTime beginTime, DateTime endTime, int zoneID, int nSiteID, int? nEquipZone = null)
        {
            string strErrorMessage = null;

            ResZoneAssessmentHistories res = new ResZoneAssessmentHistories();

            beginTime = new DateTime(beginTime.Year, beginTime.Month, beginTime.Day, 0, 0, 0);
            endTime = new DateTime(endTime.Year, endTime.Month, endTime.Day, 23, 59, 59);

            // 존평가, 안전평가 합산으로 변경 >> 타입 조회 후 합산 - 20250430 원익 공민수 요청 
            string strSQL = $@"
                select avg(a.Score) as avgScore, a2.Month, a2.Type
                FROM SdmsAssessment a
                inner join (
	                SELECT EquipmentZoneID as a2ID, DATEPART(MONTH, SendDate) as Month, MAX(SendDate) as MaxDate, Type
	                FROM SdmsAssessment
                    where Score is not NULL
	                GROUP BY EquipmentZoneID, DATEPART(MONTH, SendDate), Type) as a2 
	                on a.EquipmentZoneID = a2.a2ID and a.SendDate = a2.MaxDate and a.Type = a2.Type
                inner join SdmsSpatialEquipmentZone as ez on a.EquipmentZoneID = ez.ID
                where a.SendDate >= '{beginTime.ToString("yyyy-MM-dd HH:mm:ss")}' And a.SendDate <= '{endTime.ToString("yyyy-MM-dd HH:mm:ss")}'                    
                    {(zoneID > 0 ? " and (REPLACE(ez.LinkedZoneIDList, ' ', '') = '" + zoneID + "' or REPLACE(ez.LinkedZoneIDList, ' ', '') like '%," + zoneID + ",%')" : "")}
                    {(nEquipZone > 0 ? " and ez.ID = " + nEquipZone : "")} 
                group by a2.Month, a2.Type";


            ArrayList arrResult = m_dataManager.GetSelectManager().GetResultData(strSQL, out strErrorMessage);
            if (arrResult == null)
            {
                res.Message = strErrorMessage;
                return res;
            }
                            
            List<ZoneAssessmentData> datas = new List<ZoneAssessmentData>();

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount - 2; i += 3)
            {
                dnsDBUtil.VariousData<float> avgScore = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i].ToString());
                dnsDBUtil.VariousData<int> month = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 1].ToString());
                dnsDBUtil.VariousData<int> type = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 2].ToString());

                if (avgScore == null || month == null || type == null)
                    continue;

                float fAvgScore = avgScore.Data * 25;
                int nMonth = month.Data;
                int nType = type.Data;

                ZoneAssessmentData data = new ZoneAssessmentData();
                data.Month = nMonth;
                data.AvgScore = fAvgScore;
                data.Type = nType;

                datas.Add(data);
            }

            // 조회 기간(beginTime) 이전의 타입별 마지막 평가 점수 조회
            // - 조회 기간 안에 해당 타입 데이터가 한 번도 없어도 그래프에서 직전값을 유지할 수 있도록 함 - 20260716 요청
            // - 타입 필터 없이 전체 조회 후, 어떤 타입을 사용할지는 프론트에서 판단(SDMSResource.assessmentType)
            string strLastSQL = $@"
                select avg(a.Score) as avgScore, a2.Type
                FROM SdmsAssessment a
                inner join (
	                SELECT EquipmentZoneID as a2ID, MAX(SendDate) as MaxDate, Type
	                FROM SdmsAssessment
                    where Score is not NULL and SendDate < '{beginTime.ToString("yyyy-MM-dd HH:mm:ss")}'
	                GROUP BY EquipmentZoneID, Type) as a2
	                on a.EquipmentZoneID = a2.a2ID and a.SendDate = a2.MaxDate and a.Type = a2.Type
                inner join SdmsSpatialEquipmentZone as ez on a.EquipmentZoneID = ez.ID
                where a.SendDate < '{beginTime.ToString("yyyy-MM-dd HH:mm:ss")}'
                    {(zoneID > 0 ? " and (REPLACE(ez.LinkedZoneIDList, ' ', '') = '" + zoneID + "' or REPLACE(ez.LinkedZoneIDList, ' ', '') like '%," + zoneID + ",%')" : "")}
                    {(nEquipZone > 0 ? " and ez.ID = " + nEquipZone : "")}
                group by a2.Type";

            List<ZoneAssessmentData> lastDatas = new List<ZoneAssessmentData>();

            ArrayList arrLastResult = m_dataManager.GetSelectManager().GetResultData(strLastSQL, out strErrorMessage);
            if (arrLastResult != null)
            {
                int nLastResultCount = arrLastResult.Count;
                for (int i = 0; i < nLastResultCount - 1; i += 2)
                {
                    dnsDBUtil.VariousData<float> lastAvgScore = dnsDBUtil.WebDBManager.GetFloatField(arrLastResult[i].ToString());
                    dnsDBUtil.VariousData<int> lastType = dnsDBUtil.WebDBManager.GetIntField(arrLastResult[i + 1].ToString());

                    if (lastAvgScore == null || lastType == null)
                        continue;

                    ZoneAssessmentData lastData = new ZoneAssessmentData();
                    lastData.AvgScore = lastAvgScore.Data * 25;
                    lastData.Type = lastType.Data;

                    lastDatas.Add(lastData);
                }
            }

            res.Success = true;
            res.ZoneAssessmentHistories = datas;
            res.LastScores = lastDatas;
            return res;
        }



        /// <summary>
        /// 사이트별 안전평가 평균점수
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        public ResLoadSiteScoreDatas LoadSiteScores()
        {
            ResLoadSiteScoreDatas res = new ResLoadSiteScoreDatas();

            try
            {
                string strErrorMessage;

                // 사이트별 평균 점수 불러오기
                /*
                string strSQL = $@"
                SELECT EqZone.SiteID, SUM(A.Score) AS TotalScore, COUNT(B.EquipmentZoneID) AS EqCount, (SUM(A.Score) / COUNT(B.EquipmentZoneID)) AS Avg
                FROM SdmsAssessment A
                INNER JOIN (SELECT EquipmentZoneID, SdmsAssessment.Type, MAX(SendDate) as SD
	                        FROM SdmsAssessment
	                        WHERE Score IS NOT NULL AND SdmsAssessment.Type IS NOT NULL
	                        GROUP BY EquipmentZoneID, SdmsAssessment.Type) B
                    ON A.EquipmentZoneID = B.EquipmentZoneID AND A.Type = B.Type AND A.SendDate = B.SD
                INNER JOIN SdmsSpatialEquipmentZone EqZone ON A.EquipmentZoneID = EqZone.ID
                GROUP BY EqZone.SiteID";
                */
                // 타입별 비율 합산 평균 점수
                // 1차: 존[Type 1] 17, 환경[Type 2] 8,
                // 2차: 현업[Type 3] 10, 안전/보건[Type 4] 7, 방재/환경[Type 5] 8
                string strSQL = $@"
                SELECT Site.SiteID, AVG(Site.TotalScore) AS SiteScore
                FROM (
	                SELECT A.EquipmentZoneID, SUM(CASE WHEN A.Type = 3 THEN A.Score * 10 WHEN A.Type = 4 THEN A.Score * 7 WHEN A.Type = 5 THEN A.Score * 8 ELSE 0 END) AS TotalScore, (SELECT SiteID FROM SdmsSpatialEquipmentZone WHERE ID = A.EquipmentZoneID) AS SiteID
	                FROM SdmsAssessment A
	                INNER JOIN (SELECT EquipmentZoneID, SdmsAssessment.Type, MAX(SendDate) as SD
				                FROM SdmsAssessment
				                WHERE Score IS NOT NULL AND SdmsAssessment.Type IS NOT NULL
				                GROUP BY EquipmentZoneID, SdmsAssessment.Type) B
		                ON A.EquipmentZoneID = B.EquipmentZoneID AND A.Type = B.Type AND A.SendDate = B.SD
	                INNER JOIN SdmsSpatialEquipmentZone EqZone ON A.EquipmentZoneID = EqZone.ID
	                GROUP BY A.EquipmentZoneID
	                ) AS Site
                GROUP BY Site.SiteID";                


                ArrayList arrResult = m_dataManager.GetSelectManager().GetResultData(strSQL, out strErrorMessage);
                if (arrResult == null)
                    throw new ApplicationException(strErrorMessage);

                res.SiteScores = new List<SiteScoreData>();

                int resultCount = arrResult.Count;
                for (int i = 0; i < resultCount - 1; i += 2)
                {
                    dnsDBUtil.VariousData<int> nSiteID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString());
                    //dnsDBUtil.VariousData<float> nTotalScore = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 1].ToString());
                    //dnsDBUtil.VariousData<int> nEqCount = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 2].ToString());
                    //dnsDBUtil.VariousData<float> nAvg = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 3].ToString());
                    dnsDBUtil.VariousData<float> nAvg = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 1].ToString());

                    SiteScoreData data = new SiteScoreData();
                    data.SiteID = nSiteID.Data;
                    //data.TotalScore = nTotalScore.Data;
                    //data.EqCount = nEqCount.Data;
                    data.Avg = nAvg.Data;

                    res.SiteScores.Add(data);
                }



                // 등급 기준 불러오기
                Dictionary<int, List<Models.Data.AssessmentClassData>> dicClassDatas = new Dictionary<int, List<Models.Data.AssessmentClassData>>();

                string strPropertyName = "AssessmentClass";
                List<Common.Model.Option.Options> sdmsOptions = m_procManager.CommonDataManager.GetSelectManager().SelectOption(Common.Model.Option.Options.OptionTarget.SDMS, strPropertyName, out strErrorMessage);
                if (sdmsOptions?.Count > 0)
                {
                    foreach (Common.Model.Option.Options option in sdmsOptions)
                    {
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
                                            Models.Data.AssessmentClassData classData = new Models.Data.AssessmentClassData(strClassName, nStartScore, nEndScore);

                                            if (dicClassDatas.ContainsKey(option.SiteID) == false)
                                            {
                                                dicClassDatas[option.SiteID] = new List<Models.Data.AssessmentClassData>();
                                            }

                                            dicClassDatas[option.SiteID].Add(classData);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                // 사이트별 랭크별 갯수 불러오기
                /*
                strSQL = $@"
                SELECT A.EquipmentZoneID, (SUM(A.Score) / COUNT(B.EquipmentZoneID)) AS TotalScore, (SELECT SiteID FROM SdmsSpatialEquipmentZone WHERE ID = A.EquipmentZoneID) AS SiteID
                FROM SdmsAssessment A
                INNER JOIN (SELECT EquipmentZoneID, SdmsAssessment.Type, MAX(SendDate) as SD
	                        FROM SdmsAssessment
	                        WHERE Score IS NOT NULL AND SdmsAssessment.Type IS NOT NULL
	                        GROUP BY EquipmentZoneID, SdmsAssessment.Type) B
                    ON A.EquipmentZoneID = B.EquipmentZoneID AND A.Type = B.Type AND A.SendDate = B.SD
                INNER JOIN SdmsSpatialEquipmentZone EqZone ON A.EquipmentZoneID = EqZone.ID
				GROUP BY A.EquipmentZoneID";
                */
                // 타입별 비율 합산 (1차: 존[Type 1] 17, 환경[Type 2] 8,
                // 2차: 현업[Type 3] 10, 안전/보건[Type 4] 7, 방재/환경[Type 5] 8)              
                strSQL = $@"
                SELECT A.EquipmentZoneID, SUM(CASE WHEN A.Type = 3 THEN A.Score * 10 WHEN A.Type = 4 THEN A.Score * 7 WHEN A.Type = 5 THEN A.Score * 8 ELSE 0 END) AS TotalScore, 
                (SELECT SiteID FROM SdmsSpatialEquipmentZone WHERE ID = A.EquipmentZoneID) AS SiteID
                FROM SdmsAssessment A
                INNER JOIN (SELECT EquipmentZoneID, SdmsAssessment.Type, MAX(SendDate) as SD
	                        FROM SdmsAssessment
	                        WHERE Score IS NOT NULL AND SdmsAssessment.Type IS NOT NULL
	                        GROUP BY EquipmentZoneID, SdmsAssessment.Type) B
                    ON A.EquipmentZoneID = B.EquipmentZoneID AND A.Type = B.Type AND A.SendDate = B.SD
                INNER JOIN SdmsSpatialEquipmentZone EqZone ON A.EquipmentZoneID = EqZone.ID
				GROUP BY A.EquipmentZoneID";                

                arrResult = m_dataManager.GetSelectManager().GetResultData(strSQL, out strErrorMessage);
                if (arrResult == null)
                    throw new ApplicationException(strErrorMessage);



                resultCount = arrResult.Count;
                for (int i = 0; i < resultCount - 2; i += 3)
                {
                    dnsDBUtil.VariousData<int> nEquipmentZoneID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i].ToString());
                    dnsDBUtil.VariousData<float> fScore = dnsDBUtil.WebDBManager.GetFloatField(arrResult[i + 1].ToString());
                    dnsDBUtil.VariousData<int> nSiteID = dnsDBUtil.WebDBManager.GetIntField(arrResult[i + 2].ToString());

                    if (dicClassDatas.ContainsKey(nSiteID.Data))
                    {
                        List<Models.Data.AssessmentClassData> classDatas = dicClassDatas[nSiteID.Data];

                        foreach (Models.Data.AssessmentClassData classData in classDatas)
                        {
                            // 타입별 비율 합산
                            //float score = fScore.Data * 25;
                            float score = fScore.Data;

                            if (classData.StartScore <= score && classData.EndScore >= score)
                            {
                                foreach (SiteScoreData site in res.SiteScores)
                                {
                                    if (site.SiteID == nSiteID.Data)
                                    {
                                        if (site.ClassCnt == null)
                                            site.ClassCnt = new Dictionary<string, int>();

                                        if (site.ClassCnt.ContainsKey(classData.ClassName) == false)
                                            site.ClassCnt[classData.ClassName] = 0;

                                        site.ClassCnt[classData.ClassName]++;

                                        break;
                                    }
                                }

                                break;
                            }
                        }
                    }
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Message = e.Message;
            }

            return res;
        }

        /// <summary>
        /// 안전구역 평가 일괄 전송
        /// </summary>
        /// <returns></returns>
        public async Task<bool> SendAllAssessment()
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            SendAutoAssessment(m_dataManager, m_procManager.CommonDataManager, m_procManager.TeamDataManager, m_spatialManager, m_procManager.LocalServerURL, false);

            return true;
        }
    }
}
