using System;
using System.Collections.Generic;
using System.Text;

namespace Hynix.BLL.Response
{
    public class ResponseAbnormalHistory : MessageResult
    {
        public int WorkerID { get; set; }
        public string WorkerName { get; set; }
        public string OfficeName { get; set; }
        public string TeamName { get; set; }

        public List<Model.History.Abnormal> AbnormalHistorys { get; set; }

        public ResponseAbnormalHistory()
            : base()
        {
        }

        public ResponseAbnormalHistory(bool success, string message)
            : base(success, message)
        {
        }
    }
}
