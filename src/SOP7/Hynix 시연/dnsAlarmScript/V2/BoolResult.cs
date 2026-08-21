using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    class BoolResult
    {
        public bool Value;
        public HashSet<string> Vars; // contributing vars (non-empty only if Value==true)
        public BoolResult(bool v, HashSet<string> vars) { Value = v; Vars = vars ?? new HashSet<string>(); }
    }
}
