using System;

namespace dnsAlarmScript.V2
{
    class Parser
    {
        readonly Lexer lex;
        Token cur;

        public Parser(string script)
        {
            lex = new Lexer(script);
            cur = lex.Next();
        }

        Token Next() { Token t = cur; cur = lex.Next(); return t; }
        bool Match(TokType type, string text = null) => cur.Type == type && (text == null || cur.Text == text);

        void Expect(TokType type, string text = null)
        {
            if (!Match(type, text)) throw new Exception($"Expected {type}{(text != null ? " '" + text + "'" : "")} but got {cur}");
            Next();
        }

        public BoolNode ParseExpression()
        {
            var node = ParseOr();
            if (cur.Type != TokType.End) throw new Exception($"Unexpected token after expression: {cur}");
            return node;
        }

        // or := and ('or' and)*
        BoolNode ParseOr()
        {
            var left = ParseAnd();
            while (cur.Type == TokType.Operator && cur.Text == "or")
            {
                Next();
                var right = ParseAnd();
                left = new OrNode(left, right);
            }
            return left;
        }

        // and := while ('and' while)*
        BoolNode ParseAnd()
        {
            var left = ParseWhile();
            while (cur.Type == TokType.Operator && cur.Text == "and")
            {
                Next();
                var right = ParseWhile();
                left = new AndNode(left, right);
            }
            return left;
        }

        // while := primaryBool ('while' primaryBool)*
        BoolNode ParseWhile()
        {
            var left = ParseComparison();
            //var left = ParsePrimaryBool();
            while (cur.Type == TokType.Operator && cur.Text == "while")
            {
                Next();
                var right = ParseComparison();
                //var right = ParsePrimaryBool();
                left = new WhileNode(left, right);
            }
            return left;
        }

        // primaryBool := '(' expression ')' | comparison
        BoolNode ParsePrimaryBool()
        {
            if (cur.Type == TokType.LParen)
            {
                Next();
                var expr = ParseOr();
                Expect(TokType.RParen);
                return expr;
            }
            return ParseComparison();
        }

        // comparison := additive (comp-op additive)?
        BoolNode ParseComparison()
        {
            var leftVal = ParseAdditive();
            if (cur.Type == TokType.Operator && IsComparisonOp(cur.Text))
            {
                string op = cur.Text; Next();
                var rightVal = ParseAdditive();
                return new ComparisonNode(leftVal, op, rightVal);
            }
            // treat lone value as boolean
            return new ValueAsBoolNode(leftVal);
        }

        static bool IsComparisonOp(string t) =>
            t == ">" || t == "<" || t == ">=" || t == "<=" || t == "=" || t == "==" || t == "!=";

        // additive := multiplicative (('+'|'-') multiplicative)*
        ValueNode ParseAdditive()
        {
            var left = ParseMultiplicative();
            while (cur.Type == TokType.Operator && (cur.Text == "+" || cur.Text == "-"))
            {
                string op = cur.Text; Next();
                var right = ParseMultiplicative();
                left = new BinaryArithNode(left, op, right);
            }
            return left;
        }

        // multiplicative := unary (('*'|'/') unary)*
        ValueNode ParseMultiplicative()
        {
            var left = ParseUnary();
            while (cur.Type == TokType.Operator && (cur.Text == "*" || cur.Text == "/"))
            {
                string op = cur.Text; Next();
                var right = ParseUnary();
                left = new BinaryArithNode(left, op, right);
            }
            return left;
        }

        // unary := '-' unary | primaryValue
        ValueNode ParseUnary()
        {
            if (cur.Type == TokType.Operator && cur.Text == "-")
            {
                Next();
                var inner = ParseUnary();
                return new UnaryNegNode(inner);
            }
            return ParsePrimaryValue();
        }

        // primaryValue := number | timeLiteral | boolean | identifier | '(' additive ')'
        ValueNode ParsePrimaryValue()
        {
            if (cur.Type == TokType.Number)
            {
                string t = cur.Text; Next();
                return new NumberNode(t);
            }
            if (cur.Type == TokType.TimeLiteral)
            {
                string t = cur.Text; Next();
                return new TimeNode(t);
            }
            if (cur.Type == TokType.BooleanLiteral)
            {
                string t = cur.Text; Next();
                return new BoolLiteralNode(t);
            }
            if (cur.Type == TokType.Identifier)
            {
                string t = cur.Text; Next();
                return new VariableNode(t);
            }
            if (cur.Type == TokType.LParen)
            {
                // arithmetic grouping: parse additive inside parentheses
                Next();
                var v = ParseAdditive();
                Expect(TokType.RParen);
                return v;
            }
            throw new Exception($"Unexpected token in primary value: {cur}");
        }
    }
}
