using System.Collections.Generic;
using System.Globalization;

namespace dnsAlarmScript.V2
{
    // --- Value nodes implementations ---
    class NumberNode : ValueNode
    {
        readonly double val;
        public NumberNode(string txt) { val = double.Parse(txt, CultureInfo.InvariantCulture); }
        public override ValueResult Eval(Dictionary<string, object> ctx) => new ValueResult(val, new HashSet<string>());
    }
}
