using System;
using System.Collections.Generic;
using System.Globalization;

namespace dnsAlarmScript.V2
{
    class VariableNode : ValueNode
    {
        readonly string name;
        public VariableNode(string name) { this.name = name; }
        public override ValueResult Eval(Dictionary<string, object> ctx)
        {
            if (!ctx.TryGetValue(name, out var v))
            {
                // convenience: try without leading '#'
                if (name.StartsWith("#") && ctx.TryGetValue(name.Substring(1), out v))
                {
                    // use v
                }
                else
                {
                    throw new Exception($"Undefined variable '{name}'");
                }
            }
            // Accept numeric (int/long/double/decimal), bool, TimeSpan, string convertible
            if (v is int || v is long || v is float || v is double || v is decimal)
            {
                double d = Convert.ToDouble(v);
                return new ValueResult(d, new HashSet<string> { name });
            }
            if (v is bool bb) return new ValueResult(bb, new HashSet<string> { name });
            if (v is TimeSpan ts) return new ValueResult(ts, new HashSet<string> { name });
            if (v is string s)
            {
                if (double.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture, out var d2))
                    return new ValueResult(d2, new HashSet<string> { name });
                if (bool.TryParse(s, out var bb2))
                    return new ValueResult(bb2, new HashSet<string> { name });
                if (TimeSpan.TryParse(s, CultureInfo.InvariantCulture, out var ts2))
                    return new ValueResult(ts2, new HashSet<string> { name });
            }
            throw new Exception($"Unsupported variable type for '{name}': {v?.GetType().Name}");
        }
    }
}
