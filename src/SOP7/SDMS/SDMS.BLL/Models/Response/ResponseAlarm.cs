using SDMS.BLL.Models.Alarm;
using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Response
{
    public class ResponseAlarm
    {
        private List<AlarmData> m_alarmDatas = new List<AlarmData>();
        public List<AlarmData> AlarmDatas
        {
            get { return m_alarmDatas; }
            set { m_alarmDatas = value; }
        }

        private List<AlarmData> m_allAlarmDatas = new List<AlarmData>();
        public List<AlarmData> AllAlarmDatas
        {
            get { return m_allAlarmDatas; }
            set { m_allAlarmDatas = value; }
        }
    }

    public class ResponseAlarmData : MessageResult
    {
        private AlarmData m_alarmData = null;

        public AlarmData Alarm
        {
            get { return m_alarmData; }
            set { m_alarmData = value; }
        }

        public ResponseAlarmData()
            : base()
        {
        }

        public ResponseAlarmData(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseAlarmMemos : MessageResult
    {
        public Dictionary<int, string> AlarmMemos { get; set; }

        public ResponseAlarmMemos()
            : base()
        {
        }

        public ResponseAlarmMemos(bool success, string message)
            : base(success, message)
        {
        }
    }
}
