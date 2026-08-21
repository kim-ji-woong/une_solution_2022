using System;
using System.Collections.Generic;
using Nipa.Model.Sdms;
using Nipa.Model.Sop;

namespace Nipa.BLL.Models
{
    public class Option3DNormal
    {
        // 자동회전 대기시간
        private double m_dAutoRotationIdleMinutes = 10;
        // 자동회전을 사용할 것인가?
        private bool m_useAutoRotation = true;

        // 자동회전 대기시간
        public double AutoRotationIdleMinutes
        {
            get { return m_dAutoRotationIdleMinutes; }
            set { m_dAutoRotationIdleMinutes = value; }
        }

        // 자동회전을 사용할 것인가?
        public bool UseAutoRotation
        {
            get { return m_useAutoRotation; }
            set { m_useAutoRotation = value; }
        }

        public void SetIdleTime(string strIdleTime)
        {
            if (strIdleTime == null || strIdleTime.Length == 0)
                return;

            string[] tokens = strIdleTime.Split(';');

            if (tokens.Length != 2)
                return;

            double minutes;
            int use;

            if (double.TryParse(tokens[0].Trim(), out minutes) && int.TryParse(tokens[1].Trim(), out use))
            {
                m_dAutoRotationIdleMinutes = minutes;
                m_useAutoRotation = use == 1;
            }
        }

        public string GetIdleTime()
        {
            string strMiniutes = string.Format("{0:F1}", m_dAutoRotationIdleMinutes);

            if (strMiniutes.EndsWith(".0"))
                strMiniutes = strMiniutes.Substring(0, strMiniutes.Length - 2);

            if (m_useAutoRotation)
                return strMiniutes + ";1";

            return strMiniutes + ";0";
        }
    }

    public class Option3DSensor
    {
        // 현재 화면 유지
        // 알람 화면으로 이동
        // 첫번째 알람 화면으로 이동
        // 마지막 알람 화면으로 이동
        public enum MoveDisplayAlarmOption { StayCurrent = 0, MoveAlarm, FirstAlarm, LastAlarm };

        public const string Property_ReceiveFire = "UseReceiveFire";
        public const string Property_ReceiveGas = "UseReceiveGas";
        public const string Property_ReceiveAtmosphere = "UseReceiveAtmosphere";
        public const string Property_ReceiveEmergencyBell = "UseReceiveEmergencyBell";
        public const string Property_ReceiveWorker = "UseReceiveWorker";
        public const string Property_ReceiveThermalCamera = "UseReceiveThermalCamera";
        public const string Property_ReceiveFacilityError = "UseReceiveFacilityError";
        public const string Property_MoveDisplayAlarm = "MoveDisplayAlarm";

        private bool m_receiveGasAlarm = true;
        private bool m_receiveAtmosphereAlarm = true;
        private bool m_receiveEmergencyBellAlarm = true;
        private bool m_receiveThermalCameraAlarm = true;
        private bool m_receiveWorkerAlarm = true;
        private bool m_receiveFireAlarm = true;
        private bool m_receiveFacilityError = true;
        private int m_nMoveDisplayAlarm = (int)MoveDisplayAlarmOption.LastAlarm;

        // 가스알람을 수신할 것인가?
        public bool ReceiveGasAlarm
        {
            get { return m_receiveGasAlarm; }
            set { m_receiveGasAlarm = value; }
        }

        // 대기오염 알람을 수신할 것인가?
        public bool ReceiveAtmosphereAlarm
        {
            get { return m_receiveAtmosphereAlarm; }
            set { m_receiveAtmosphereAlarm = value; }
        }

        // 비상벨 알람을 수신할 것인가?
        public bool ReceiveEmergencyBellAlarm
        {
            get { return m_receiveEmergencyBellAlarm; }
            set { m_receiveEmergencyBellAlarm = value; }
        }

        // 열화상카메라 알람을 수신할 것인가?
        public bool ReceiveThermalCameraAlarm
        {
            get { return m_receiveThermalCameraAlarm; }
            set { m_receiveThermalCameraAlarm = value; }
        }

        // 작업자알람을 수신할 것인가?
        public bool ReceiveWorkerAlarm
        {
            get { return m_receiveWorkerAlarm; }
            set { m_receiveWorkerAlarm = value; }
        }

        // 화재알람을 수신할 것인가?
        public bool ReceiveFireAlarm
        {
            get { return m_receiveFireAlarm; }
            set { m_receiveFireAlarm = value; }
        }

        // 불량감지를 수신할 것인가?
        public bool ReceiveFacilityError
        {
            get { return m_receiveFacilityError; }
            set { m_receiveFacilityError = value; }
        }

        // 알람발생시 화면이동 옵션(MoveDisplayAlarmOption)
        public int MoveDisplayAlarm
        {
            get { return m_nMoveDisplayAlarm; }
            set { m_nMoveDisplayAlarm = value; }
        }

        public void SetOption(string strPropertyName, string strPropertyValue)
        {
            string strName = strPropertyName.ToLower();

            if (strName == Property_ReceiveFire.ToLower())
                SetBooleanValue(strPropertyValue, ref m_receiveFireAlarm);
            else if (strName == Property_ReceiveGas.ToLower())
                SetBooleanValue(strPropertyValue, ref m_receiveGasAlarm);
            else if (strName == Property_ReceiveAtmosphere.ToLower())
                SetBooleanValue(strPropertyValue, ref m_receiveAtmosphereAlarm);
            else if (strName == Property_ReceiveEmergencyBell.ToLower())
                SetBooleanValue(strPropertyValue, ref m_receiveEmergencyBellAlarm);
            else if (strName == Property_ReceiveThermalCamera.ToLower())
                SetBooleanValue(strPropertyValue, ref m_receiveThermalCameraAlarm);
            else if (strName == Property_ReceiveWorker.ToLower())
                SetBooleanValue(strPropertyValue, ref m_receiveWorkerAlarm);
            else if (strName == Property_ReceiveFacilityError.ToLower())
                SetBooleanValue(strPropertyValue, ref m_receiveFacilityError);
            else if (strName == Property_MoveDisplayAlarm.ToLower())
                SetMoveDisplayAlarm(strPropertyValue);
        }

        public OptionSDMS GetOption(IEnumerable<OptionSDMS> options, string strOptionName)
        {
            strOptionName = strOptionName.ToLower();

            foreach (OptionSDMS option in options)
            {
                if (option.PropertyName.ToLower() == strOptionName)
                    return option;
            }

            return null;
        }

        private void SetMoveDisplayAlarm(string strPropertyValue)
        {
            if (strPropertyValue == null || strPropertyValue.Length == 0)
                return;

            int value;

            if (int.TryParse(strPropertyValue.Trim(), out value))
            {
                if (value >= (int)MoveDisplayAlarmOption.StayCurrent && value <= (int)MoveDisplayAlarmOption.LastAlarm)
                    m_nMoveDisplayAlarm = value;
            }
        }

        public static void SetBooleanValue(string strPropertyValue, ref bool data)
        {
            if (strPropertyValue == null)
                return;

            string strValue = strPropertyValue.ToLower();

            if (strValue == "true" || strValue == "1")
                data = true;
            else if (strValue == "false" || strValue == "0")
                data = false;
        }
    }

    public class OptionSopNormal
    {
        public enum TimeUnit { Seconds = 0, Minutes, Hours };
        public enum AutoCloseOption { AutoClose = 0, ConfirmNClose, NoAutoClose };

        public const string Property_WorkingBeginHour = "WorkingBeginHour";
        public const string Property_WorkingEndHour = "WorkingEndHour";
        public const string Property_AutoMoveSOPScreen = "UseAutoMoveSOPScreen";
        public const string Property_SMS = "UseSMS";
        public const string Property_SopWaitTime = "SOPWaitEndTime";
        public const string Property_ResultSummary = "UseResultSummary";

        private bool m_useAutoMoveSOPScreen = true;
        private bool m_useSms = true;
        private int m_workingBeginHour = 9;
        private int m_workingBeginMinute = 0;
        private int m_workingEndHour = 18;
        private int m_workingEndMinute = 0;
        private bool m_useSopAutoClose = false;
        private int m_nAutoCloseTime = 10;
        private int m_nAutoCloseTimeUnit = (int)TimeUnit.Minutes;
        private bool m_useSopResultSummary = false;

        // 실행중인 컴포넌트로 자동 화면이동
        public bool UseAutoMoveSOPScreen
        {
            get { return m_useAutoMoveSOPScreen; }
            set { m_useAutoMoveSOPScreen = value; }
        }

        // 문자 사용여부
        public bool UseSms
        {
            get { return m_useSms; }
            set { m_useSms = value; }
        }

        // 평일주간 시간대 : 시작시간
        public int WorkingBeginHour
        {
            get { return m_workingBeginHour; }
            set { m_workingBeginHour = value; }
        }

        // 평일주간 시간대 : 시작분
        public int WorkingBeginMinute
        {
            get { return m_workingBeginMinute; }
            set { m_workingBeginMinute = value; }
        }

        // 평일주간 시간대 : 종료시간
        public int WorkingEndHour
        {
            get { return m_workingEndHour; }
            set { m_workingEndHour = value; }
        }

        // 평일주간 시간대 : 종료분
        public int WorkingEndMinute
        {
            get { return m_workingEndMinute; }
            set { m_workingEndMinute = value; }
        }

        // SOP 자동종료 사용여부
        public bool UseSopAutoClose
        {
            get { return m_useSopAutoClose; }
            set { m_useSopAutoClose = value; }
        }

        // SOP 자동종료 대기시간
        public int AutoCloseTime
        {
            get { return m_nAutoCloseTime; }
            set { m_nAutoCloseTime = value; }
        }

        // SOP 자동종료 대기시간(단위) : TimeUnit
        public int AutoCloseTimeUnit
        {
            get { return m_nAutoCloseTimeUnit; }
            set { m_nAutoCloseTimeUnit = value; }
        }

        // SOP 결과 요약창 사용여부
        public bool UseSopResultSummary
        {
            get { return m_useSopResultSummary; }
            set { m_useSopResultSummary = value; }
        }

        public void SetOption(string strPropertyName, string strPropertyValue)
        {
            string strName = strPropertyName.ToLower();

            if (strName == Property_WorkingBeginHour.ToLower())
                SetWorkingHour(strPropertyValue, ref m_workingBeginHour, ref m_workingBeginMinute);
            else if (strName == Property_WorkingEndHour.ToLower())
                SetWorkingHour(strPropertyValue, ref m_workingEndHour, ref m_workingEndMinute);
            else if (strName == Property_AutoMoveSOPScreen.ToLower())
                Option3DSensor.SetBooleanValue(strPropertyValue, ref m_useAutoMoveSOPScreen);
            else if (strName == Property_SMS.ToLower())
                Option3DSensor.SetBooleanValue(strPropertyValue, ref m_useSms);
            else if (strName == Property_ResultSummary.ToLower())
                Option3DSensor.SetBooleanValue(strPropertyValue, ref m_useSopResultSummary);
            else if (strName == Property_SopWaitTime.ToLower())
                SetSopWaitTime(strPropertyValue);
        }

        public OptionSopSimulator GetOption(IEnumerable<OptionSopSimulator> options, string strOptionName)
        {
            strOptionName = strOptionName.ToLower();

            foreach (OptionSopSimulator option in options)
            {
                if (option.PropertyName.ToLower() == strOptionName)
                    return option;
            }

            return null;
        }

        private void SetWorkingHour(string strPropertyValue, ref int hour, ref int minutes)
        {
            if (strPropertyValue == null)
                return;

            string[] tokens = strPropertyValue.Split(':');

            if (tokens.Length == 2)
            {
                int _hour, _min;

                if (int.TryParse(tokens[0].Trim(), out _hour) && int.TryParse(tokens[1].Trim(), out _min))
                {
                    hour = _hour;
                    minutes = _min;
                }
            }
        }

        private void SetSopWaitTime(string strPropertyValue)
        {
            string[] tokens = strPropertyValue.Split(';');

            if (tokens.Length == 3)
            {
                int time, unit, option;

                if (int.TryParse(tokens[0].Trim(), out time) && int.TryParse(tokens[1].Trim(), out unit) && int.TryParse(tokens[2].Trim(), out option))
                {
                    if (time >= 0)
                    {
                        if (unit >= (int)TimeUnit.Seconds && unit <= (int)TimeUnit.Hours)
                        {
                            if (option == (int)AutoCloseOption.ConfirmNClose)
                            {
                                m_useSopAutoClose = true;
                            }
                            else if (option == (int)AutoCloseOption.NoAutoClose)
                            {
                                m_useSopAutoClose = false;
                            }
                            else
                                return;

                            m_nAutoCloseTime = time;
                            m_nAutoCloseTimeUnit = unit;
                        }
                    }
                }
            }
        }
    }

    public class LinkedSOPData
    {
        private int m_nFacilityType = -1;
        private string m_strSensorType = "";
        private int? m_linkedBuildingID = null;
        private int? m_linkedZoneID = null;
        private string m_strLinkedPosition = null;
        private int m_nDisasterCategoryID = -1;
        private int m_nSubDisasterCategoryID = -1;
        private string m_strDisasterCategoryName = "";
        private string m_strSubDisasterCategoryName = "";
        private string m_strDisasterName = "";

        public int FacilityType
        {
            get { return m_nFacilityType; }
            set { m_nFacilityType = value; }
        }

        public string SensorType
        {
            get { return m_strSensorType; }
            set { m_strSensorType = value; }
        }

        public int? LinkedBuildingID
        {
            get { return m_linkedBuildingID; }
            set { m_linkedBuildingID = value; }
        }

        public int? LInkedZoneID
        {
            get { return m_linkedZoneID; }
            set { m_linkedZoneID = value; }
        }

        public string LinkedPosition
        {
            get { return m_strLinkedPosition; }
            set { m_strLinkedPosition = value; }
        }

        public int DisasterCategoryID
        {
            get { return m_nDisasterCategoryID; }
            set { m_nDisasterCategoryID = value; }
        }

        public int SubDisasterCategoryID
        {
            get { return m_nSubDisasterCategoryID; }
            set { m_nSubDisasterCategoryID = value; }
        }

        public string DisasterCategoryName
        {
            get { return m_strDisasterCategoryName; }
            set { m_strDisasterCategoryName = value; }
        }

        public string SubDisasterCategoryName
        {
            get { return m_strSubDisasterCategoryName; }
            set { m_strSubDisasterCategoryName = value; }
        }

        public string DisasterName
        {
            get { return m_strDisasterName; }
            set { m_strDisasterName = value; }
        }
    }
}
