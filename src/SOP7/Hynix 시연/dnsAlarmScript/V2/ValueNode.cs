using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    abstract class ValueNode
    {
        public abstract ValueResult Eval(Dictionary<string, object> ctx);
    }
}
