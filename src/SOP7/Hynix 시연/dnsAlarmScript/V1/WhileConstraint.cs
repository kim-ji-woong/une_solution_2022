using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    class WhileConstraint : BoolExpr
    {
        private readonly BoolExpr _expr;
        private readonly BoolExpr _timeCond;
        public WhileConstraint(BoolExpr expr, BoolExpr timeCond) { _expr = expr; _timeCond = timeCond; }

        public override bool Evaluate(Dictionary<string, object> ctx)
            => _expr.Evaluate(ctx) && _timeCond.Evaluate(ctx);
    }
}
