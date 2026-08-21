namespace AgentFactory.BLL
{
    using Agent;

    public class FactoryEx : Factory
    {
        // WSOP_30의 SdmsSensorZone에 실제 등록된 SensorType 기준으로 필요한 Agent만 생성한다.
        //   Fire        : 0(화재감지센서), 906(SVMS 화재)
        //   PSM         : 11(유해화학물질 누출감지)
        //   Beacon      : 115(위험구역 체류), 116(비콘 SOS)
        //   Environment : 117(환경설비)
        //   Manufacture : 118(제조설비)
        //   Security    : 900~905(SVMS 침입/배회/쓰러짐/도난/방치/가상펜스)
        //
        // 위 목록에 없는 타입은 base가 DummyAgent를 돌려주며 기본값 1단계로 동작한다.
        // WSOP_30에 새 센서 종류를 추가하면 여기에도 Agent를 추가해야 2단계가 적용된다.
        public override BaseAgent MakeAgent(AgentType type)
        {
            if (type == AgentType.Fire)
                return new FireAgent();
            else if (type == AgentType.PSM)
                return new PSMAgent();
            else if (type == AgentType.Security)
                return new SecurityAgent();
            else if (type == AgentType.Beacon)
                return new BeaconAgent();
            else if (type == AgentType.Environment)
                return new EnvironmentAgent();
            else if (type == AgentType.Manufacture)
                return new ManufactureAgent();

            return base.MakeAgent(type);
        }
    }
}
