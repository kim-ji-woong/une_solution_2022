namespace dnsAlarmScript.V2
{
    enum TokType { Number, Identifier, TimeLiteral, BooleanLiteral, Operator, LParen, RParen, End }

    class Token
    {
        public TokType Type;
        public string Text;
        public int Pos;
        public Token(TokType t, string text, int pos) { Type = t; Text = text; Pos = pos; }
        public override string ToString() => $"{Type}:'{Text}'@{Pos}";
    }
}
