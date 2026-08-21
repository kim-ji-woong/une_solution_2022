using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    class UnaryNegNode : ValueNode
    {
        readonly ValueNode inner;
        public UnaryNegNode(ValueNode inner) { this.inner = inner; }
        public override ValueResult Eval(Dictionary<string, object> ctx)
        {
            var r = inner.Eval(ctx);
            if (!(r.Value is double)) throw new Exception("Unary - only applies to numeric");
            return new ValueResult(-(double)r.Value, r.Vars);
        }
    }
}
