using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    // --- Eval result containers ---
    class ValueResult
    {
        public object Value;               // double / TimeSpan / bool
        public HashSet<string> Vars;       // variables used to compute this value
        public ValueResult(object v, HashSet<string> vars) { Value = v; Vars = vars ?? new HashSet<string>(); }
    }
}
