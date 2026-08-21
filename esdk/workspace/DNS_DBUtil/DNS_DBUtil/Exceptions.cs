using System;
using System.Collections.Generic;
using System.Text;

namespace dnsDBUtil
{
    public class WebDBTransactionStateException : Exception
    {
        public WebDBTransactionStateException(string szMsg)
            : base(szMsg)
        {
        }
    }

    public class DBException
    {
        public static string[] ErrorMessage(string strMessage)
        {
            Logger.Instance.Write(strMessage);

            string[] results = new string[2];
            results[0] = "0";
            results[1] = strMessage;
            return results;
        }

        public static string ErrorMessage2(string strMessage, string strMethod = null)
        {
            if (strMethod == null)
                Logger.Instance.Write(strMessage);
            else
                Logger.Instance.Write(strMethod + " : " + strMessage);

            return strMessage;
        }
    }
}
