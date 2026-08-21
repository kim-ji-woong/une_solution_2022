using SDMS.Model.Assessment;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Request.Assessment
{
    public class ReqLoadQItemList
    {
        public int? QID { get; set; }
    }

    public class ReqDeleteQ
    {
        public int QID { get; set; }
    }

    public class ReqSaveQ
    {
        public int QID { get; set; }
        //public string Title { get; set; }
        //public int RegisterUserID { get; set; }
        public int? EqZoneID { get; set; }
        public string MemberIDs { get; set; }
        public List<AssessmentQItem> QItemList { get; set; }
        //public bool IsOverWrite { get; set; }
        public int Type { get; set; }
    }

    public class ReqSendAssessment
    {
        public int EquipmentZoneID { get; set; }
        public List<int> ReceiverMemberIDs { get; set; }
        public string Title { get; set; }
        public List<string> Contents { get; set; }
        public int SendUserID { get; set; }
        public int Type { get; set; }
    }

    public class ReqLoadAssessment
    {
        public int AssessmentID { get; set; }
        public int MemberID { get; set; }
    }

    public class ReqSaveAssessment
    {
        public int AssessmentID { get; set; }
        public int MemberID { get; set; }
        public List<SaveAssessmentData> AItemDatas { get; set; }
        public string Memo { get; set; }
    }

    public class SaveAssessmentData
    {
        public int AID { get; set; }
        public int Score { get; set; }
        public string Memo { get; set; }
    }

    public class ReqLoadScoreByZone
    {
        public int ZoneID { get; set; }
        public int? SiteID { get; set; }
    }

    public class ReqCheckQTitle
    {
        public string Title { get; set; }
    }

    public class ReqLoadAssessmentClass
    {
        public int? SiteID { get; set; }
    }

    public class ReqSaveAssessmentClass
    {
        public int? SiteID { get; set; }
        public int? ClassA_Start { get; set; }
        public int? ClassA_End { get; set; }
        public int? ClassB_Start { get; set; }
        public int? ClassB_End { get; set; }
        public int? ClassC_Start { get; set; }
        public int? ClassC_End { get; set; }
        public int? ClassD_Start { get; set; }
        public int? ClassD_End { get; set; }
        public int? ClassE_Start { get; set; }
        public int? ClassE_End { get; set; }
    }

    public class ReqLoadEqZoneQItemList
    {
        public int? EquipZoneID { get; set; }
        public int Type { get; set; }
    }

    public class ReqSaveQList
    {
        public List<AssessmentQ> Qlist { get; set; }
    }

    public class ReqLoadAutoAssessment
    {
        public int SiteID { get; set; }
    }

    public class ReqSetAutoAssessment
    {
        public int SiteID { get; set; }
        public int Type { get; set; }
        public int Date { get; set; }
        public int UserID { get; set; }
    }

    public class ReqSetQList
    {
        public int Type { get; set; }
        public List<AssessmentQItem> QItems { get; set; }
    }

    public class ReqLoadZoneAssessmentHistories
    {
        private string m_strBeginTime = "";
        private string m_strEndTime = "";
        private int m_nZoneID = -1;
        private int m_nSiteID = -1;
        public int? EquipZoneID { get; set; }
        public string BeginTime
        {
            get { return m_strBeginTime; }
            set { m_strBeginTime = value; }
        }

        public string EndTime
        {
            get { return m_strEndTime; }
            set { m_strEndTime = value; }
        }        
        public int ZoneID
        {
            get { return m_nZoneID; }
            set { m_nZoneID = value; }
        }        
        public int SiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }
    }
}
