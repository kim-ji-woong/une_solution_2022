using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    class Comparison : BoolExpr
    {
        private readonly ValueExpr _left;
        private readonly string _op;
        private readonly ValueExpr _right;
        public Comparison(ValueExpr l, string op, ValueExpr r) { _left = l; _op = op; _right = r; }

        public override bool Evaluate(Dictionary<string, object> ctx)
        {
            var lv = _left.Evaluate(ctx);
            var rv = _right.Evaluate(ctx);

            if (lv is int li && rv is int ri) return Compare(li, ri);
            if (lv is TimeSpan lt && rv is TimeSpan rt) return Compare(lt, rt);
            throw new Exception($"타입 불일치 비교: {lv?.GetType().Name} { _op } {rv?.GetType().Name}");
        }

        private bool Compare<T>(T a, T b) where T : IComparable<T>
        {
            int cmp = a.CompareTo(b);
            return _op switch
            {
                ">" => cmp > 0,
                ">=" => cmp >= 0,
                "<" => cmp < 0,
                "<=" => cmp <= 0,
                "=" => cmp == 0,
                "<>" => cmp != 0,
                _ => throw new Exception("Unknown comp op: " + _op),
            };
        }
    }
}
