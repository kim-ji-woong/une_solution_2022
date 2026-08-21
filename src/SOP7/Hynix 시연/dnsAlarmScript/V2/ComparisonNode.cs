using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    class ComparisonNode : BoolNode
    {
        readonly ValueNode left, right;
        readonly string op;
        public ComparisonNode(ValueNode l, string op, ValueNode r) { left = l; this.op = op; right = r; }

        public override BoolResult Eval(Dictionary<string, object> ctx)
        {
            var L = left.Eval(ctx);
            var R = right.Eval(ctx);
            object lv = L.Value, rv = R.Value;

            // TimeSpan vs TimeSpan
            if (lv is TimeSpan && rv is TimeSpan)
            {
                var lt = (TimeSpan)lv; var rt = (TimeSpan)rv;
                bool res = Compare(lt.TotalSeconds, rt.TotalSeconds);
                if (res) { var v = new HashSet<string>(L.Vars); v.UnionWith(R.Vars); return new BoolResult(true, v); }
                return new BoolResult(false, new HashSet<string>());
            }

            // bool vs bool
            if (lv is bool && rv is bool)
            {
                bool a = (bool)lv, b = (bool)rv;
                bool rres = op switch
                {
                    "=" => a == b,
                    "==" => a == b,
                    "!=" => a != b,
                    "<>" => a != b,
                    _ => throw new Exception("Boolean supports only =/== or != comparisons")
                };
                if (rres) { var v = new HashSet<string>(L.Vars); v.UnionWith(R.Vars); return new BoolResult(true, v); }
                return new BoolResult(false, new HashSet<string>());
            }

            // numeric compare
            if (IsNumeric(lv) && IsNumeric(rv))
            {
                double ld = ToDouble(lv), rd = ToDouble(rv);
                bool res = Compare(ld, rd);
                if (res) { var v = new HashSet<string>(L.Vars); v.UnionWith(R.Vars); return new BoolResult(true, v); }
                return new BoolResult(false, new HashSet<string>());
            }

            throw new Exception($"Unsupported comparison between {lv?.GetType().Name} and {rv?.GetType().Name}");
        }

        bool Compare(double a, double b)
        {
            const double eps = 1e-12;
            return op switch
            {
                ">" => a > b,
                "<" => a < b,
                ">=" => a >= b,
                "<=" => a <= b,
                "=" => Math.Abs(a - b) < eps,
                "==" => Math.Abs(a - b) < eps,
                "!=" => Math.Abs(a - b) >= eps,
                "<>" => Math.Abs(a - b) >= eps,
                _ => throw new Exception("Unknown comp op: " + op)
            };
        }

        static bool IsNumeric(object o) => o is double || o is float || o is int || o is long || o is decimal;
        static double ToDouble(object o) => Convert.ToDouble(o);
    }
}
