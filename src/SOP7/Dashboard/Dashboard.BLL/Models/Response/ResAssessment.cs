using Dashboard.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dashboard.BLL.Models.Response
{
    public class ResLoadSiteScores : MessageResult
    {
        public List<SiteScoreData> SiteScores { get; set; }
    }

    public class SiteScoreData
    {
        public int SiteID { get; set; }
        public float TotalScore { get; set; }
        public int EqCount { get; set; }
        public float Avg { get; set; }
    }
}
