using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    class Tokenizer
    {
        private readonly string _s;
        private int _i;
        public Tokenizer(string s) { _s = s; _i = 0; }

        private bool IsIdChar(char c) => char.IsLetterOrDigit(c) || c == '_';

        public List<Token> Tokenize()
        {
            var tokens = new List<Token>();
            while (_i < _s.Length)
            {
                char c = _s[_i];
                if (char.IsWhiteSpace(c)) { _i++; continue; }
                int start = _i;

                if (c == '(' || c == ')')
                {
                    tokens.Add(new Token("paren", c.ToString(), start));
                    _i++;
                    continue;
                }
                if (c == '#')
                {
                    _i++;
                    while (_i < _s.Length && IsIdChar(_s[_i])) _i++;
                    tokens.Add(new Token("var", _s.Substring(start, _i - start), start));
                    continue;
                }
                if (c == '\'')
                {
                    _i++;
                    int st = _i;
                    while (_i < _s.Length && _s[_i] != '\'') _i++;
                    if (_i >= _s.Length) throw new Exception("Unterminated time literal starting at " + start);
                    string content = _s.Substring(st, _i - st);
                    _i++; // skip closing '
                    tokens.Add(new Token("time", content, start));
                    continue;
                }
                if (char.IsDigit(c))
                {
                    while (_i < _s.Length && char.IsDigit(_s[_i])) _i++;
                    tokens.Add(new Token("int", _s.Substring(start, _i - start), start));
                    continue;
                }

                // multi-char operators
                if (_s.Substring(_i).StartsWith(">=")) { tokens.Add(new Token("op", ">=", start)); _i += 2; continue; }
                if (_s.Substring(_i).StartsWith("<=")) { tokens.Add(new Token("op", "<=", start)); _i += 2; continue; }
                if (_s.Substring(_i).StartsWith("=")) { tokens.Add(new Token("op", "=", start)); _i += 1; continue; }
                if (_s.Substring(_i).StartsWith("<>")) { tokens.Add(new Token("op", "<>", start)); _i += 2; continue; }

                // single-char operators and punctuation
                if ("<>+-*/".IndexOf(c) >= 0) { tokens.Add(new Token("op", c.ToString(), start)); _i++; continue; }

                // keywords: and, or, while (ensure boundary)
                if (_s.Substring(_i).StartsWith("and") && (_i + 3 == _s.Length || !IsIdChar(_s[_i + 3])))
                { tokens.Add(new Token("kw", "and", start)); _i += 3; continue; }
                if (_s.Substring(_i).StartsWith("or") && (_i + 2 == _s.Length || !IsIdChar(_s[_i + 2])))
                { tokens.Add(new Token("kw", "or", start)); _i += 2; continue; }
                if (_s.Substring(_i).StartsWith("while") && (_i + 5 == _s.Length || !IsIdChar(_s[_i + 5])))
                { tokens.Add(new Token("kw", "while", start)); _i += 5; continue; }

                throw new Exception("Unknown character at pos " + _i + ": '" + c + "'");
            }
            return tokens;
        }
    }
}
