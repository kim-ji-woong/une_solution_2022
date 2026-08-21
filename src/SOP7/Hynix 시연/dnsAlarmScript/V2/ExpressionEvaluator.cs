using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V2
{
    public static class ExpressionEvaluator
    {
        /// <summary>
        /// Evaluate expression and return (result, vars).
        /// contributingVars is non-empty only when result == true.
        /// </summary>
        public static bool EvaluateTrace(string exprScript, Dictionary<string, object> ctx, out List<string> vars, out string strErrorMessage)
        {
            strErrorMessage = null;
            vars = null;

            try
            {
                var parser = new Parser(exprScript);
                BoolNode root = parser.ParseExpression();
                var res = root.Eval(ctx);

                vars = new List<string>();

                if (res.Value)
                    vars.AddRange(res.Vars);

                return res.Value;
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
            }

            return false;
        }

        // while ~ 구문을 삭제한다.
        public static string RemoveWhileExpression(string strScript)
        {
            int index = strScript.IndexOf("while");

            while (index > 0)
            {
                int endIndex = GetWhileEndIndex(strScript, index);

                string str1 = strScript.Substring(0, index);
                string str2 = endIndex < strScript.Length - 1 ? strScript.Substring(endIndex + 1) : "";
                strScript = str1 + str2;

                index = strScript.IndexOf("while");
            }

            return strScript;
        }

        private static int GetWhileEndIndex(string strScript, int beginIndex)
        {
            int len = strScript.Length;
            int openCount = 0, closeCount = 0;
            int quotationCount = 0;
            bool op = false;

            for (int i=beginIndex;i<len;i++)
            {
                char ch = strScript[i];

                if (op == false)
                {
                    if (ch == '<' || ch == '>' || ch == '=')
                        op = true;
                }
                else
                {
                    if (ch == '(')
                        openCount++;
                    else if (ch == ')')
                    {
                        closeCount++;

                        if (quotationCount >= 2 && openCount == closeCount)
                            return i;
                    }
                    else if (ch == '\'')
                    {
                        quotationCount++;

                        if (quotationCount >= 2 && openCount == closeCount)
                            return i;
                    }
                }
            }

            return len - 1;
        }
    }
}
