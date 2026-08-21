using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    abstract class BoolExpr
    {
        public abstract bool Evaluate(Dictionary<string, object> ctx);
    }

    abstract class ValueExpr
    {
        // returns int or TimeSpan
        public abstract object Evaluate(Dictionary<string, object> ctx);
    }

    class IntLiteral : ValueExpr
    {
        private readonly int _v;
        public IntLiteral(int v) => _v = v;
        public override object Evaluate(Dictionary<string, object> ctx) => _v;
    }

    class TimeLiteral : ValueExpr
    {
        private readonly TimeSpan _t;
        public TimeLiteral(TimeSpan t) => _t = t;
        public override object Evaluate(Dictionary<string, object> ctx) => _t;
    }

    class VarValue : ValueExpr
    {
        private readonly string _name;
        public VarValue(string name) => _name = name;
        public override object Evaluate(Dictionary<string, object> ctx)
        {
            if (!ctx.TryGetValue(_name, out var v)) throw new Exception($"Undefined variable: {_name}");
            return v;
        }
    }

    class UnaryNeg : ValueExpr
    {
        private readonly ValueExpr _inner;
        public UnaryNeg(ValueExpr inner) => _inner = inner;
        public override object Evaluate(Dictionary<string, object> ctx)
        {
            var val = _inner.Evaluate(ctx);
            if (val is int i) return -i;
            throw new Exception("Unary '-' supports only integers.");
        }
    }

    class BinaryArith : ValueExpr
    {
        private readonly string _op;
        private readonly ValueExpr _left, _right;
        public BinaryArith(string op, ValueExpr l, ValueExpr r) { _op = op; _left = l; _right = r; }
        public override object Evaluate(Dictionary<string, object> ctx)
        {
            var a = _left.Evaluate(ctx);
            var b = _right.Evaluate(ctx);
            if (!(a is int) || !(b is int)) throw new Exception("산술 연산은 정수끼리만 가능합니다.");
            int ai = (int)a, bi = (int)b;
            return _op switch
            {
                "+" => ai + bi,
                "-" => ai - bi,
                "*" => ai * bi,
                "/" => bi == 0 ? throw new DivideByZeroException() : ai / bi,
                _ => throw new Exception("Unknown arith op: " + _op),
            };
        }
    }
}
