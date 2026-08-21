using System;
using System.Collections.Generic;
using System.Globalization;

namespace dnsAlarmScript.V1
{
    class Parser
    {
        private readonly List<Token> _t;
        private int _p;

        public Parser(List<Token> tokens) { _t = tokens; _p = 0; }

        private Token Peek() => _p < _t.Count ? _t[_p] : null;
        private Token Consume() => _t[_p++];

        private bool Match(string type, string text = null)
        {
            var tk = Peek();
            if (tk != null && tk.Type == type && (text == null || tk.Text == text)) { _p++; return true; }
            return false;
        }

        public BoolExpr Parse()
        {
            var expr = ParseOr();
            if (_p < _t.Count) throw new Exception($"Unexpected token {_t[_p]} (extra tokens after valid expression).");
            return expr;
        }

        // or -> and ("or" and)*
        private BoolExpr ParseOr()
        {
            var left = ParseAnd();
            while (Match("kw", "or"))
            {
                var right = ParseAnd();
                left = new Logical("or", left, right);
            }
            return left;
        }

        // and -> while ("and" while)*
        private BoolExpr ParseAnd()
        {
            var left = ParseWhile();
            while (Match("kw", "and"))
            {
                var right = ParseWhile();
                left = new Logical("and", left, right);
            }
            return left;
        }

        // while -> primary ("while" primary)*
        private BoolExpr ParseWhile()
        {
            var left = ParseComparison();
            //var left = ParsePrimaryBool();
            while (Match("kw", "while"))
            {
                var right = ParseComparison();
                //var right = ParsePrimaryBool();
                left = new WhileConstraint(left, right);
            }
            return left;
        }

        // primary bool -> '(' expr ')' | comparison
        private BoolExpr ParsePrimaryBool()
        {
            if (Match("paren", "("))
            {
                var expr = ParseOr();
                if (!Match("paren", ")")) throw new Exception("')' expected");
                return expr;
            }
            return ParseComparison();
        }

        // comparison -> value comp_op value
        private BoolExpr ParseComparison()
        {
            var left = ParseValue();
            var tk = Peek();
            if (tk != null && tk.Type == "op" && IsComparisonOp(tk.Text))
            {
                var op = Consume().Text;
                var right = ParseValue();
                return new Comparison(left, op, right);
            }
            throw new Exception($"Comparison operator expected at token {tk}.");
        }

        private static bool IsComparisonOp(string s) => s == ">" || s == "<" || s == ">=" || s == "<=" || s == "=" || s == "<>";

        // ---------- Value (arith) parser ----------
        // value := addsub
        private ValueExpr ParseValue() => ParseAddSub();

        // addsub := muldiv ( ('+'|'-') muldiv )*
        private ValueExpr ParseAddSub()
        {
            var left = ParseMulDiv();
            while (true)
            {
                var tk = Peek();
                if (tk != null && tk.Type == "op" && (tk.Text == "+" || tk.Text == "-"))
                {
                    string op = Consume().Text;
                    var right = ParseMulDiv();
                    left = new BinaryArith(op, left, right);
                }
                else break;
            }
            return left;
        }

        // muldiv := unary ( ('*'|'/') unary )*
        private ValueExpr ParseMulDiv()
        {
            var left = ParseUnary();
            while (true)
            {
                var tk = Peek();
                if (tk != null && tk.Type == "op" && (tk.Text == "*" || tk.Text == "/"))
                {
                    string op = Consume().Text;
                    var right = ParseUnary();
                    left = new BinaryArith(op, left, right);
                }
                else break;
            }
            return left;
        }

        // unary := '-' unary | primaryValue
        private ValueExpr ParseUnary()
        {
            if (Peek() != null && Peek().Type == "op" && Peek().Text == "-")
            {
                Consume();
                return new UnaryNeg(ParseUnary());
            }
            return ParsePrimaryValue();
        }

        // primaryValue := '(' addsub ')' | var | int | time
        private ValueExpr ParsePrimaryValue()
        {
            if (Match("paren", "("))
            {
                var val = ParseAddSub();
                if (!Match("paren", ")")) throw new Exception("')' expected in value expression");
                return val;
            }
            var tk = Peek();
            if (tk == null) throw new Exception("Unexpected end while parsing value");
            if (tk.Type == "var") { Consume(); return new VarValue(tk.Text); }
            if (tk.Type == "int") { Consume(); return new IntLiteral(int.Parse(tk.Text)); }
            if (tk.Type == "time") { Consume(); var ts = TimeSpan.Parse(tk.Text, CultureInfo.InvariantCulture); return new TimeLiteral(ts); }
            throw new Exception($"Value token expected but got {tk}");
        }
    }
}
