using System;
using System.Collections.Generic;
using System.Globalization;

namespace dnsAlarmScript.V2
{
    class TimeNode : ValueNode
    {
        readonly TimeSpan ts;
        public TimeNode(string inner)
        {
            if (!TimeSpan.TryParse(inner, CultureInfo.InvariantCulture, out ts))
                throw new Exception($"Invalid time literal '{inner}'");
        }
        public override ValueResult Eval(Dictionary<string, object> ctx) => new ValueResult(ts, new HashSet<string>());
    }
}
