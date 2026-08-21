using System;
using System.IO;
using Newtonsoft.Json.Linq;

namespace DbBackup
{
    using Models.Request;

    class WebServiceManager
    {
        public static string Send(SensorParameter parameter, string strUrl, out string strErrorMessage)
        {
            JObject obj = new JObject();
            obj.Add("Header", parameter.Header);
            obj.Add("ClientInfo", parameter.ClientInfo);

            return Send(obj, strUrl, out strErrorMessage);
        }

        public static string Send(JObject obj, string strUrl, out string strErrorMessage)
        {
            string strJson = obj.ToString();
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(strJson);
            int len = bytes.Length;

            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";
            request.ContentLength = len + 3;

            try
            {
                StreamWriter writer = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8);
                writer.Write(strJson);
                writer.Close();

                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                System.Diagnostics.Trace.WriteLine(strResult);
                return strResult;
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return null;
        }
    }
}
