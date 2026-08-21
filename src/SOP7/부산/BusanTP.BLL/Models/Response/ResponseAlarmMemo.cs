using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseAlarmMemo : MessageResult
    {
        public Dictionary<int, string> AlarmMemos { get; set; }
        
        public ResponseAlarmMemo() : base()
        {
        }
        
        public ResponseAlarmMemo(bool success, string message) : base(success, message)
        {
        }
    }
}