using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    class Logical : BoolExpr
    {
        private readonly string _op;
        private readonly BoolExpr _left, _right;
        public Logical(string op, BoolExpr l, BoolExpr r) { _op = op; _left = l; _right = r; }

        public override bool Evaluate(Dictionary<string, object> ctx)
        {
            return _op switch
            {
                "and" => _left.Evaluate(ctx) && _right.Evaluate(ctx),
                "or" => _left.Evaluate(ctx) || _right.Evaluate(ctx),
                _ => throw new Exception("Unknown logical op: " + _op),
            };
        }
    }
}
