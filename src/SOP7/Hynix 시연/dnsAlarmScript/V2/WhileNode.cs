using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    class WhileNode : BoolNode
    {
        readonly BoolNode left, right;
        public WhileNode(BoolNode l, BoolNode r) { left = l; right = r; }
        public override BoolResult Eval(Dictionary<string, object> ctx)
        {
            var L = left.Eval(ctx);
            if (!L.Value) return new BoolResult(false, new HashSet<string>());
            var R = right.Eval(ctx);
            if (!R.Value) return new BoolResult(false, new HashSet<string>());
            var v = new HashSet<string>(L.Vars); v.UnionWith(R.Vars);
            return new BoolResult(true, v);
        }
    }
}
