using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    class OrNode : BoolNode
    {
        readonly BoolNode left, right;
        public OrNode(BoolNode l, BoolNode r) { left = l; right = r; }
        public override BoolResult Eval(Dictionary<string, object> ctx)
        {
            var L = left.Eval(ctx);
            if (L.Value) return new BoolResult(true, new HashSet<string>(L.Vars));
            var R = right.Eval(ctx);
            if (R.Value) return new BoolResult(true, new HashSet<string>(R.Vars));
            return new BoolResult(false, new HashSet<string>());
        }
    }
}
