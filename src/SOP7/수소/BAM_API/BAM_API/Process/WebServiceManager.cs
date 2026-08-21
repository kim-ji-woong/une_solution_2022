using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BAM_API.Process
{
    public class WebServiceManager
    {
        public static string SUCESS = "success";
        public static string POST = "POST";

        public static string RequestSensorDatas(out string strErrorMessage)
        {
            strErrorMessage = null;
            string strResult = null;

            string strURL = "/api_corea/sensor/read02.php";

            try
            {
                strResult = SendQuery(null, null, strURL, out strErrorMessage);

                if (strErrorMessage != SUCESS)
                    strResult = null;

            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                strResult = null;
            }

            return strResult;
        }

        public static string SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";

            string strResponse = null;

            try
            {
                //string url = BaseAddress;

                //if (strURL.StartsWith("/"))
                //    url += strURL;
                //else
                //    url += "/" + strURL;

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strURL));
                request.Method = strMethodType;
                request.ContentType = "application/json; charset=utf-8";

                if (dicHeaders != null)
                {
                    // 요청 헤더 추가
                    foreach (KeyValuePair<string, string> pair in dicHeaders)
                    {
                        string key = pair.Key;
                        string value = pair.Value;
                        request.Headers.Add(key, value);
                    }
                }

                if (strBodyJson != null && strBodyJson != "")
                {
                    StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
                    streamWriter.Write(strBodyJson);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();

                Stream respPostStream = wRes.GetResponseStream();
                StreamReader readerPost = new StreamReader(respPostStream, System.Text.Encoding.UTF8);

                strResponse = readerPost.ReadToEnd().Trim();
                request.Abort();
                readerPost.Close();
                respPostStream.Close();

            }
            catch (WebException ex)
            {
                strErrorMessage = ex.Message;
                return null;
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return null;
            }

            strErrorMessage = SUCESS;
            return strResponse;
        }
    }

    public class BAM_Data
    {
        public string live_process_index { get; set; }
        public string measure_id { get; set; }
        public string component_id { get; set; }
        public string id_ext { get; set; }
        public string sensor_type { get; set; }
        public string asset_type { get; set; }
        public string com_node { get; set; }
        public string location_type { get; set; }
        public string eclass_path { get; set; }
        public string aas_path { get; set; }
        public string parameter { get; set; }
        public string unit_type { get; set; }
        public string max { get; set; }
        public string min { get; set; }
        public string calibration_path { get; set; }
        public string backup_path { get; set; }
        public string timestamp { get; set; }
        public string value { get; set; }
    }
}
