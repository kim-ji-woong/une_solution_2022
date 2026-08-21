using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    class BinaryArithNode : ValueNode
    {
        readonly string op;
        readonly ValueNode left, right;
        public BinaryArithNode(ValueNode l, string op, ValueNode r) { left = l; this.op = op; right = r; }

        public override ValueResult Eval(Dictionary<string, object> ctx)
        {
            var L = left.Eval(ctx);
            var R = right.Eval(ctx);
            if (!(L.Value is double) || !(R.Value is double))
                throw new Exception("Arithmetic operands must be numeric");
            double a = (double)L.Value, b = (double)R.Value;
            double res = op switch
            {
                "+" => a + b,
                "-" => a - b,
                "*" => a * b,
                "/" => b == 0 ? throw new DivideByZeroException() : a / b,
                _ => throw new Exception("Unknown arith op: " + op)
            };
            var vars = new HashSet<string>(L.Vars);
            vars.UnionWith(R.Vars);
            return new ValueResult(res, vars);
        }
    }
}
