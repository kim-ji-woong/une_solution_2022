using System;

namespace dnsAlarmScript.V2
{
    // Lexer: produces tokens like Identifier (#var1), Number, TimeLiteral (inner text), BooleanLiteral, Operator (>=, and, or, while, +, -, etc.)
    class Lexer
    {
        readonly string s;
        int i = 0;
        public Lexer(string text) { s = text ?? ""; }

        bool IsIdChar(char c) => char.IsLetterOrDigit(c) || c == '_' || c == '#';

        public Token Next()
        {
            while (i < s.Length && char.IsWhiteSpace(s[i])) i++;
            if (i >= s.Length) return new Token(TokType.End, "", i);
            int start = i;
            char c = s[i];

            if (c == '(') { i++; return new Token(TokType.LParen, "(", start); }
            if (c == ')') { i++; return new Token(TokType.RParen, ")", start); }

            if (c == '\'')
            {
                i++;
                int st = i;
                while (i < s.Length && s[i] != '\'') i++;
                if (i >= s.Length) throw new Exception($"Unterminated time literal at {start}");
                string inner = s.Substring(st, i - st);
                i++; // skip closing '
                return new Token(TokType.TimeLiteral, inner, start);
            }

            if (char.IsDigit(c))
            {
                int st = i;
                while (i < s.Length && (char.IsDigit(s[i]) || s[i] == '.')) i++;
                return new Token(TokType.Number, s.Substring(st, i - st), start);
            }

            if (char.IsLetter(c) || c == '#')
            {
                int st = i;
                while (i < s.Length && IsIdChar(s[i])) i++;
                string word = s.Substring(st, i - st);
                string low = word.ToLowerInvariant();
                if (low == "and" || low == "or" || low == "while")
                    return new Token(TokType.Operator, low, start);
                if (low == "true" || low == "false")
                    return new Token(TokType.BooleanLiteral, low, start);
                return new Token(TokType.Identifier, word, start);
            }

            // multi-char operators
            if (i + 1 < s.Length)
            {
                string two = s.Substring(i, 2);
                if (two == ">=" || two == "<=" || two == "==" || two == "!=" || two == "<>")
                {
                    i += 2;
                    if (two == "<>") two = "!=";
                    return new Token(TokType.Operator, two, start);
                }
            }

            // single-char operators
            if ("<>+-*/=".IndexOf(c) >= 0)
            {
                i++;
                return new Token(TokType.Operator, c.ToString(), start);
            }

            throw new Exception($"Unknown char '{c}' at pos {i}");
        }
    }
}
