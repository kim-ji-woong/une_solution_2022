using SDMS.BLL.Models.Data;
using SDMS.Model.Assessment;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Response.Assessment
{
    public class ResAssessmentQList : MessageResult
    {
        public List<AssessmentQ> QList { get; set; }
    }

    public class ResAssessmentQItemList : MessageResult
    {
        public List<AssessmentQItem> QItems { get; set; }
    }    

    public class ResLoadAssessment : MessageResult
    {
        public LoadAssessmentData AssessmentData { get; set; }
        //public List<AssessmentA> AList { get; set; }
        public List<AListData> AList { get; set; }
    }

    public class LoadAssessmentData
    {
        public DateTime Deadline { get; set; }
        public float? Score { get; set; }
        public int EquipmentZoneID { get; set; }
        public string ZoneName { get; set; }
        public int? Type { get; set; }
    }

    public class ResLoadScoreByZone : MessageResult
    {
        public List<ScoreByZoneData> ScoreByZoneDatas { get; set; }
    }

    public class ScoreByZoneData
    {
        public int EquipmentZoneID { get; set; }
        public string Score { get; set; }
    }

    public class ResCheckQTitle : MessageResult
    {
        public bool IsCheck { get; set; }
        public int? QID { get; set; }
    }
    
    public class ResAssessmentClass : MessageResult
    {
        public List<Data.AssessmentClassData> AssessmentClasses { get; set; }
    }

    public class ResAssessmentEqZoneQItem : MessageResult
    {
        public AssessmentQ AssessmentQ { get; set; }
        public List<AssessmentQItem> QItems { get; set; }
    }

    public class ResAutoAssessment : MessageResult
    {
        /// <summary>
        /// 0: 설정안함, 1: 매주, 2: 매월
        /// </summary>
        public int Type { get; set; }
        /// <summary>
        /// Type 1 경우 0:일요일, 1:월요일, 2:화요일, 3:수요일, 4:목요일, 5:금요일, 6:토요일
        /// Type 2 경우 일자
        /// </summary>
        public int Date { get; set; }
    }


    public class ResZoneAssessmentHistories : MessageResult
    {
        public List<ZoneAssessmentData> ZoneAssessmentHistories { get; set; }

        // 조회 기간(BeginTime) 이전의 타입별 마지막 평가 점수 - 그래프에서 기간 밖 데이터로 직전값 유지(carry-forward) 시 사용
        public List<ZoneAssessmentData> LastScores { get; set; }
    }

    public class ZoneAssessmentData
    {
        public int Month { get; set; }
        public float AvgScore { get; set; }
        public int? Type { get; set; }
    }

    public class ResLoadSiteScoreDatas : MessageResult
    {
        public List<SiteScoreData> SiteScores { get; set; }
    }

    public class SiteScoreData
    {
        public int SiteID { get; set; }
        public float TotalScore { get; set; }
        public int EqCount { get; set; }
        public float Avg { get; set; }
        public Dictionary<string, int> ClassCnt { get; set; }
    }
}
