using System;
using System.Collections.Generic;

namespace dnsAlarmScript.V1
{
    public class Validator
    {
        private static string[] Variables = new string[] {
            "CardTaggingCount",
            "CardDeniedCount",
            "SmartTagTaggingCount",
            "ElapsedTime"
        };

        public static List<string> CheckValidation(string strScript, out string changedScript, out string strErrorMessage)
        {
            changedScript = null;

            if (strScript == null)
            {
                strErrorMessage = "null 값은 허용하지 않습니다.";
                return null;
            }

            string strScriptOrigin = strScript;
            strScript = strScript.ToLower().Trim();

            if (strScript.Length == 0)
            {
                strErrorMessage = "script가 비어 있습니다.";
                return null;
            }

            foreach (string strVariable in Variables)
            {
                string strSrc = strVariable.ToLower();
                string strTrg = "#" + strSrc;
                strScript = strScript.Replace(strSrc, strTrg);
            }

            int len = strScript.Length;

            for (int i=0;i<len;i++)
            {
                if (strScript[i] == '#')
                {
                    strScriptOrigin = strScriptOrigin.Insert(i, "#");
                }
            }

            changedScript = AddIndexToVariables(strScriptOrigin);

            Dictionary<string, string> dicVariables = new Dictionary<string, string>();

            try
            {
                var tok = new Tokenizer(strScript);
                var tokens = tok.Tokenize();

                if (CheckTokens(tokens, strScriptOrigin, dicVariables, out strErrorMessage) == false)
                    return null;

                var parser = new Parser(tokens);
                parser.Parse();
            }
            catch (Exception ex)
            {
                strErrorMessage = ex.Message;
                return null;
            }

            List<string> variables = new List<string>();
            variables.AddRange(dicVariables.Keys);

            strErrorMessage = null;
            return variables;
        }

        private static string AddIndexToVariables(string strScript)
        {
            string changedScript = strScript.ToLower().Trim();

            foreach (string strVariable in Variables)
            {
                string strSrc = strVariable.ToLower();

                if (strSrc == "elapsedtime")
                    continue;

                int index = changedScript.IndexOf(strSrc);
                int orderIndex = 0;

                while (index >= 0)
                {
                    string strVariable2 = string.Format("{0}_{1}", strSrc, ++orderIndex);

                    string str1 = "";
                    string str2 = str2 = changedScript.Substring(index + strSrc.Length);

                    if (index > 0)
                        str1 = changedScript.Substring(0, index);

                    changedScript = str1 + strVariable2 + str2;
                    index = changedScript.IndexOf(strSrc, index + 1);
                }
            }

            return changedScript;
        }

        public static List<ScriptInfo> GetScriptInfos(string strScript)
        {
            var tok = new Tokenizer(strScript);
            var tokens = tok.Tokenize();

            List<ScriptInfo> scriptInfos = new List<ScriptInfo>();
            // Key : BeginIndex
            // Value : EndIndex
            Dictionary<int, int> dicIgnoreIndecies = new Dictionary<int, int>();

            int beginIndex = 0;
            int tokenCount = tokens.Count;

            for (int i=0;i<tokenCount;i++)
            {
                if (CheckIgnore(i, dicIgnoreIndecies))
                {
                    if (CheckIgnore(beginIndex, dicIgnoreIndecies))
                        beginIndex = i + 1;

                    continue;
                }

                var token = tokens[i];

                if (token.Type == "paren")
                {
                    if (token.Text == "(")
                        beginIndex = i + 1;
                    else
                    {
                        ParseTokens(tokens, beginIndex, i - 1, scriptInfos);
                        dicIgnoreIndecies[beginIndex - 1] = i;

                        beginIndex = 0;
                        i = -1;
                        continue;
                    }
                }
                else if (token.Type == "kw")
                {
                    if (beginIndex == i)
                    {
                        beginIndex = i + 1;
                        continue;
                    }
                }
            }

            if (beginIndex < tokenCount)
            {
                ParseTokens(tokens, beginIndex, tokenCount - 1, scriptInfos);
            }

            return scriptInfos;
        }

        private static bool CheckIgnore(int index, Dictionary<int, int> dicIgnoreIndecies)
        {
            foreach (KeyValuePair<int, int> pair in dicIgnoreIndecies)
            {
                int beginIndex = pair.Key;
                int endIndex = pair.Value;

                if (index >= beginIndex && index <= endIndex)
                    return true;
            }

            return false;
        }

        private static void ParseTokens(List<Token> tokens, int beginIndex, int endIndex, List<ScriptInfo> scriptInfos)
        {
            int index = beginIndex;

            for (int i = beginIndex; i <= endIndex; i++)
            {
                var token = tokens[i];

                if (token.Type == "kw")
                {
                    if (token.Text == "or" || token.Text == "and")
                    {
                        MakeScriptInfo(tokens, index, i - 1, scriptInfos);
                        index = i + 1;
                    }
                }
            }

            if (index < endIndex)
                MakeScriptInfo(tokens, index, endIndex, scriptInfos);
        }

        private static void MakeScriptInfo(List<Token> tokens, int beginIndex, int endIndex, List<ScriptInfo> scriptInfos)
        {
            string elapsedTimeOperation = null;
            int? elapsedTimeTargetSeconds = null;

            Dictionary<string, string> dicVariables = new Dictionary<string, string>();

            for (int i=beginIndex;i<=endIndex;i++)
            {
                var token = tokens[i];

                if (token.Type == "var")
                {
                    if (token.Text == "#elapsedtime")
                    {
                        if (i <= endIndex - 2 && tokens[i + 1].Type == "op" && tokens[i + 2].Type == "time")
                        {
                            elapsedTimeOperation = tokens[i + 1].Text;
                            elapsedTimeTargetSeconds = TimeToSeconds(tokens[i + 2].Text);
                        }
                    }
                    else
                        dicVariables[token.Text.Substring(1)] = token.Text;
                }
            }

            if (dicVariables.Count == 0)
                return;

            ScriptInfo info = new ScriptInfo();

            info.ElapsedTimeOperation = elapsedTimeOperation;
            info.ElapsedTimeTargetSeconds = elapsedTimeTargetSeconds;
            info.Variables.AddRange(dicVariables.Keys);

            scriptInfos.Add(info);
        }

        private static int? TimeToSeconds(string strTime)
        {
            string[] tokens = strTime.Split(':');

            if (tokens.Length == 3)
            {
                int hour, min, sec;

                if (int.TryParse(tokens[0].Trim(), out hour) && int.TryParse(tokens[1].Trim(), out min) && int.TryParse(tokens[2].Trim(), out sec))
                {
                    return hour * 3600 + min * 60 + sec;
                }
            }

            return null;
        }

        private static bool CheckTokens(List<Token> tokens, string strScript, Dictionary<string, string> dicVariables, out string strErrorMessage)
        {
            strErrorMessage = null;

            foreach (Token token in tokens)
            {
                if (token.Type == "var")
                {
                    bool find = false;
                    string strVariable = token.Text.Substring(1);

                    foreach (string strVar in Variables)
                    {
                        if (strVariable == strVar.ToLower())
                        { 
                            find = true;
                            break;
                        }
                    }

                    string variable = strScript.Substring(token.Pos + 1, strVariable.Length);

                    if (find == false)
                    {
                        strErrorMessage = string.Format("{0}는 알수없는 변수입니다.", variable);
                        return false;
                    }
                    else
                        dicVariables[variable] = variable;
                }
            }

            return true;
        }
    }
}
