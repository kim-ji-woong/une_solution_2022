using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    // --- Bool nodes implementations ---
    class ValueAsBoolNode : BoolNode
    {
        readonly ValueNode val;
        public ValueAsBoolNode(ValueNode v) { val = v; }
        public override BoolResult Eval(Dictionary<string, object> ctx)
        {
            var r = val.Eval(ctx);
            bool b = ConvertToBool(r.Value);
            if (b) return new BoolResult(true, r.Vars);
            return new BoolResult(false, new HashSet<string>());
        }

        static bool ConvertToBool(object o)
        {
            if (o is bool bb) return bb;
            if (o is double d) return Math.Abs(d) > 1e-12;
            if (o is TimeSpan ts) return ts.TotalSeconds != 0;
            throw new Exception($"Cannot convert {o?.GetType().Name} to bool");
        }
    }
}
