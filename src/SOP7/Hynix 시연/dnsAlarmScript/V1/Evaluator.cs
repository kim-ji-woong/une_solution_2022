using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    public class Evaluator
    {
        public static bool Evaluate(string strScript, Dictionary<string, object> ctx, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strScript.IndexOf('#') < 0)
            {
                string strChanged;
                Validator.CheckValidation(strScript, out strChanged, out strErrorMessage);
                strScript = strChanged;
            }

            Dictionary<string, object> context = new Dictionary<string, object>();

            foreach (KeyValuePair<string, object> pair in ctx)
            {
                if (pair.Key.StartsWith("#"))
                    context[pair.Key] = pair.Value;
                else
                    context["#" + pair.Key] = pair.Value;
            }

            try
            {
                var tok = new Tokenizer(strScript);
                var tokens = tok.Tokenize();
                var parser = new Parser(tokens);
                var ast = parser.Parse();
                return ast.Evaluate(context);
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
            }

            return false;
        }
    }
}
