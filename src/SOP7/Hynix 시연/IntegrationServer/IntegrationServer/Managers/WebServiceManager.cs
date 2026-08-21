using System;
using System.IO;
using Newtonsoft.Json.Linq;

namespace IntegrationServer.Managers
{
    public static class WebServiceManager
    {
        public static JObject ReadPost(string strUrl, out string strErrorMessage)
        {
            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(new Uri(strUrl));
            request.Method = "POST";
            request.ContentType = "application/json; charset=utf-8";

            strErrorMessage = null;

            try
            {
                System.Net.HttpWebResponse wRes = (System.Net.HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                string strResult = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();
                strErrorMessage = null;

                return JObject.Parse(strResult);
            }
            catch (System.Net.WebException ex)
            {
                strErrorMessage = ex.Message;
            }

            return null;
        }

        /*public static JObject ReadPost(string strUrl, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strUrl.EndsWith("getStrctPersonList.do"))
                return ReadFile("인원계수.json");
            else if (strUrl.EndsWith("getEventList.do"))
                return ReadFile("이벤트이력조회.json");
            else if (strUrl.EndsWith("getApInfoList.do"))
                return ReadFile("AP List.json");
            else if (strUrl.EndsWith("getTagInfoList.do"))
                return ReadFile("Tag List.json");
            else if (strUrl.EndsWith("getGasData.do"))
                return ReadFile("가스데이터.json");

            return null;
        }

        private static JObject ReadFile(string strFileName)
        {
            string strFilePath = @"D:\Project\SOP\NIPA 5G\통신\작업자 위치 측위, 가스감지기 (에스웨이엠)\프로토콜\데이터 샘플\" + strFileName;
            string strJson = "";

            StreamReader reader = new StreamReader(strFilePath, System.Text.Encoding.UTF8);

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                strJson += strLine;
            }

            reader.Close();
            return JObject.Parse(strJson);
        }*/
    }
}
