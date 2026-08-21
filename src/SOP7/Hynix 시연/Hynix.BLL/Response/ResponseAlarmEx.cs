using System;
using System.Collections.Generic;
using System.Text;

namespace Hynix.BLL.Response
{
    public class ResponseAlarmEx
    {
        private List<AlarmDataEx> m_alarmDatas = new List<AlarmDataEx>();
        public List<AlarmDataEx> AlarmDatas
        {
            get { return m_alarmDatas; }
            set { m_alarmDatas = value; }
        }

        private List<AlarmDataEx> m_allAlarmDatas = new List<AlarmDataEx>();
        public List<AlarmDataEx> AllAlarmDatas
        {
            get { return m_allAlarmDatas; }
            set { m_allAlarmDatas = value; }
        }
    }
}
