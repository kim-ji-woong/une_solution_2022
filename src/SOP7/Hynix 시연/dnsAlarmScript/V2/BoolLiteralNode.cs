using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    class BoolLiteralNode : ValueNode
    {
        readonly bool b;
        public BoolLiteralNode(string txt) { b = txt.Equals("true", StringComparison.OrdinalIgnoreCase); }
        public override ValueResult Eval(Dictionary<string, object> ctx) => new ValueResult(b, new HashSet<string>());
    }
}
