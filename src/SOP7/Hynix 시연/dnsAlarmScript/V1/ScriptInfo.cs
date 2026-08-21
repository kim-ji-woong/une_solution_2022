using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    // 단위 Script의 구성요소
    public class ScriptInfo
    {
        private string m_elapsedTimeOperation = null;
        private int? m_elapsedTimeTargetSeconds = null;
        private List<string> m_variables = new List<string>();

        public string ElapsedTimeOperation
        {
            get { return m_elapsedTimeOperation; }
            set { m_elapsedTimeOperation = value; }
        }

        public int? ElapsedTimeTargetSeconds
        {
            get { return m_elapsedTimeTargetSeconds; }
            set { m_elapsedTimeTargetSeconds = value; }
        }

        public List<string> Variables
        {
            get { return m_variables; }
            set { m_variables = value; }
        }
    }
}
