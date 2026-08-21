using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    abstract class BoolNode
    {
        public abstract BoolResult Eval(Dictionary<string, object> ctx);
    }
}
