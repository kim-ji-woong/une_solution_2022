using System.Collections.Generic;

namespace BusanTP.BLL.Models.Response
{
    public class ResponseTestMode : MessageResult
    {
        
        private bool m_testMode = false;
        private List<BusanTP.Model.TestEvent> m_testEvents = new List<BusanTP.Model.TestEvent>();
        
        public bool TestMode
        {
            get { return m_testMode; }
            set { m_testMode = value; }
        }
        
        public List<BusanTP.Model.TestEvent> TestEvents
        {
            get { return m_testEvents; }
            set { m_testEvents = value; }
        }
        
        public ResponseTestMode() : base()
        {
        }
        
        public ResponseTestMode(bool success, string message) : base(success, message)
        {
        }
    }
}