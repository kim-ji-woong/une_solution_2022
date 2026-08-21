using System.Collections.Generic;
using SDMS.Model.Sensor;

namespace AgentFactory.BLL.Agent
{
    public class EtcAgent : BaseAgent
    {
        public override MethodProcessType CheckMethod(MethodType type, params object[] args)
        {
            return MethodProcessType.Default;
        }

        public override object RunMethod(MethodType type, params object[] args)
        {
            return null;
        }

        public override int GetAlarmDepth(IAlarmManager alarmManager, KeyValuePair<SensorZone, int>[] sensorDatas, SensorZone sensorZone, int? alarmLevel = null)
        {
            int nAlarmDepth = 2;

            if (alarmLevel.HasValue && alarmLevel.Value > 2)
                nAlarmDepth = alarmLevel.Value;

            return nAlarmDepth;
        }
    }
}
