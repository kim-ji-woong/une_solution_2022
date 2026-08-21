using System;
using System.Collections.Generic;
using System.Text;

namespace SOPManager.Model.Sop.Config
{
    /// <summary>
    /// 연결 설정된 SOP의 버전 개수
    /// ex) A SOP의 버전이 몇 개인지
    /// </summary>
    public class LinkedSopCountByVersion
    {
        public int LinkedSopID { get; set; }
        public int Count { get; set; }
    }
}
