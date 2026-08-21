namespace dnsAlarmScript.V1
{
    class Token
    {
        public string Type { get; }
        public string Text { get; }
        public int Pos { get; }
        public Token(string type, string text, int pos) { Type = type; Text = text; Pos = pos; }
        public override string ToString() => $"[{Type}:'{Text}' @ {Pos}]";
    }
}
