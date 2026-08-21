namespace AgentFactory.BLL
{
    using Agent;

    public class FactoryEx : Factory
    {
        public override BaseAgent MakeAgent(AgentType type)
        {
            if (type == AgentType.Fire)
                return new FireAgent();

            return base.MakeAgent(type);
        }
    }
}
