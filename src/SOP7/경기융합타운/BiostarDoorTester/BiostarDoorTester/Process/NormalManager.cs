using System;
using System.Net;
using System.Text;
using Newtonsoft.Json.Linq;
using System.IO;

namespace BiostarDoorTester.Process
{
    class NormalManager
    {
        public static string Request(string strUrl, string strJson, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strResult = "";

            byte[] bytes = Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            FormMain.Instance.WriteLog(strUrl);

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);

                strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

                if (wRes.StatusCode != HttpStatusCode.OK)
                {
                    strErrorMessage = "Error Code : " + wRes.StatusDescription;
                    return null;
                }

                return strResult;
            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
                FormMain.Instance.WriteLog("ErrorMessage : " + strErrorMessage);
            }

            return null;
        }
    }
}
