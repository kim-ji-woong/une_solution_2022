using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace AgentFactory.BLL.Agent
{
    /// <summary>
    /// 화재 알람 Agent.
    /// WSOP_30 대상 SensorType : 0(화재감지센서), 906(SVMS 화재)
    ///
    /// 기본 구현(BaseAgent)은 알람을 1단계에서 시작하지만 Site 30은 2단계에서 시작한다.
    /// </summary>
    public class FireAgent : BaseAgent
    {
        private const int DEFAULT_ALARM_DEPTH = 2;

        public override MethodProcessType CheckMethod(MethodType type, params object[] args)
        {
            return MethodProcessType.Default;
        }

        public override object RunMethod(MethodType type, params object[] args)
        {
            return null;
        }

        // 클라이언트가 알람단계를 보내온 경우 그 값을 최우선으로 사용한다.
        // 보내오지 않은 경우(null)에만 기본값 2단계를 적용한다.
        public override int GetAlarmDepth(IAlarmManager alarmManager, KeyValuePair<SensorZone, int>[] sensorDatas, SensorZone sensorZone, int? alarmLevel = null)
        {
            if (alarmLevel != null)
                return (int)alarmLevel;

            return DEFAULT_ALARM_DEPTH;
        }
    }
}
