using Airbase20.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.BLL.Models
{
    public class ResponseRelay : MessageResult
    {
        public Relay Relay { get; set; }

        public ResponseRelay()
        {
        }

        public ResponseRelay(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponseRelayList : MessageResult
    {
        public List<Relay> RelayList { get; set; }

        public ResponseRelayList()
        {
        }

        public ResponseRelayList(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponseSwitchDetail : MessageResult
    {
        public SwitchDetailData SwitchDetail { get; set; }

        public ResponseSwitchDetail()
        {
        }

        public ResponseSwitchDetail(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponseSwitchDetailList : MessageResult
    {
        public List<SwitchDetailData> SwitchDetailList { get; set; }

        public ResponseSwitchDetailList()
        {
        }

        public ResponseSwitchDetailList(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class SwitchDetailData
    {
        public SwitchDetailData(SwitchDetail switchDetail)
        {
            this.ID = switchDetail.ID;
            this.SwitchID = switchDetail.SwitchID;
            this.Circuit = switchDetail.Circuit;
            this.OpenClose = switchDetail.OpenClose;

            this.FI_Auto_A = switchDetail.FI_Auto_A;
            this.FI_Auto_B = switchDetail.FI_Auto_B;
            this.FI_Auto_C = switchDetail.FI_Auto_C;
            this.FI_Auto_N = switchDetail.FI_Auto_N;

            this.FailCurrent_A = switchDetail.FailCurrent_A;
            this.FailCurrent_B = switchDetail.FailCurrent_B;
            this.FailCurrent_C = switchDetail.FailCurrent_C;
            this.FailCurrent_N = switchDetail.FailCurrent_N;

            this.Phase_A = switchDetail.Phase_A;
            this.Phase_B = switchDetail.Phase_B;
            this.Phase_C = switchDetail.Phase_C;
            this.Phase_N = switchDetail.Phase_N;

            this.Volt_A = switchDetail.Volt_A;
            this.Volt_B = switchDetail.Volt_B;
            this.Volt_C = switchDetail.Volt_C;

            this.AverageLoad_A = switchDetail.AverageLoad_A;
            this.AverageLoad_B = switchDetail.AverageLoad_B;
            this.AverageLoad_C = switchDetail.AverageLoad_C;
            this.AverageLoad_N = switchDetail.AverageLoad_N;

            this.MaxLoad_A = switchDetail.MaxLoad_A;
            this.MaxLoad_B = switchDetail.MaxLoad_B;
            this.MaxLoad_C = switchDetail.MaxLoad_C;
            this.MaxLoad_N = switchDetail.MaxLoad_N;

            this.Memo = switchDetail.Memo;
        }


        public int ID { get; set; }
        public int SwitchID { get; set; }
        public int Circuit { get; set; }
        public bool? OpenClose { get; set; }
        public bool? FI_Auto_A { get; set; }
        public bool? FI_Auto_B { get; set; }
        public bool? FI_Auto_C { get; set; }
        public bool? FI_Auto_N { get; set; }
        public int? FailCurrent_A { get; set; }
        public int? FailCurrent_B { get; set; }
        public int? FailCurrent_C { get; set; }
        public int? FailCurrent_N { get; set; }
        public int? Phase_A { get; set; }
        public int? Phase_B { get; set; }
        public int? Phase_C { get; set; }
        public int? Phase_N { get; set; }
        public int? Volt_A { get; set; }
        public int? Volt_B { get; set; }
        public int? Volt_C { get; set; }
        public int? AverageLoad_A { get; set; }
        public int? AverageLoad_B { get; set; }
        public int? AverageLoad_C { get; set; }
        public int? AverageLoad_N { get; set; }
        public int? MaxLoad_A { get; set; }
        public int? MaxLoad_B { get; set; }
        public int? MaxLoad_C { get; set; }
        public int? MaxLoad_N { get; set; }
        public string Memo { get; set; }
    }





















    public class ResponsePeckPowerList : MessageResult
    {
        public List<PeckPower> PeckPowerList { get; set; }

        public ResponsePeckPowerList()
        {
        }

        public ResponsePeckPowerList(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponsePeckPower : MessageResult
    {
        public PeckPower PeckPower { get; set; }

        public ResponsePeckPower()
        {
        }

        public ResponsePeckPower(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }

    public class ResponseAlarmList : MessageResult
    {
        public List<AlarmData> AlarmList { get; set; }

        public ResponseAlarmList()
        {
        }

        public ResponseAlarmList(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }




    public class AlarmData : SwitchDetailData
    {
        public AlarmData(SwitchDetail switchDetail)
            : base(switchDetail)
        {

        }

        public string SwitchName { get; set; }

    }









    public class ResponsePowerResult : MessageResult
    {
        public double UseTodayPower { get; set; }
        public double UseWeekPower { get; set; }
        public double UseMonthPower { get; set; }
        public double UseYearPower { get; set; }

        public ResponsePowerResult()
        {
        }

        public ResponsePowerResult(bool success, string strMessage)
        {
            Success = success;
            Message = strMessage;
        }
    }







    public class Result
    {
        private bool m_result = false;

        public bool Success
        {
            get { return m_result; }
            set { m_result = value; }
        }
    }

    public class MessageResult : Result
    {
        private string m_strMessage = "";

        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        public MessageResult()
        {
        }

        public MessageResult(bool success, string strMessage)
        {
            Success = success;
            m_strMessage = strMessage;
        }
    }

}
