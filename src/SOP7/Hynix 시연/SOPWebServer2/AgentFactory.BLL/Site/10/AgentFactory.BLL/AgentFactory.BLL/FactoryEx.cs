using System;
using System.Collections.Generic;
using System.Text;

namespace AgentFactory.BLL
{
    public class FactoryEx : Factory
    {
        public override BaseAgent MakeAgent(AgentType type)
        {
            if (type == AgentType.Fire)
                return new Agent.FireAgent();
            else if (type == AgentType.Security)
                return new Agent.SecurityAgent();
            else if (type == AgentType.Etc)
                return new Agent.EtcAgent();
            else if (type == AgentType.Beacon)
                return new Agent.BeaconAgent();

            return base.MakeAgent(type);
        }
    }
}
