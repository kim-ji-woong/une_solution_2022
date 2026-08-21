using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;

namespace UneToBAMServer.Process
{
    public class WebServiceManager
    {
        public const string SUCESS = "success";
        public const string POST = "POST";

        public static List<BAM_Data> RequestAPIData(string strURL, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<BAM_Data> results = null;
            string strResult = null;

            try
            {
                strResult = SendQuery(null, null, strURL, out strErrorMessage, WebServiceManager.POST);

                if (strErrorMessage == SUCESS && strResult != null)
                {
                    results = new List<BAM_Data>();

                    JObject jResults = JObject.Parse(strResult);

                    bool isSuccess = jResults.Value<bool?>("success") ?? false;
                    strErrorMessage = jResults.Value<string>("message");                    

                    if (isSuccess == false)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    string strBamData = jResults.Value<string>("bamData");

                    JArray jResult = JArray.Parse(strBamData);

                    for (int i = 0; i < jResult?.Count; i++)
                    {
                        JObject jData = (JObject)jResult[i];

                        BAM_Data data = new BAM_Data()
                        {
                            live_process_index = jData["live_process_index"]?.ToString().Length > 0 ? jData["live_process_index"]?.ToString().Trim() : null,
                            measure_id = jData["measure_id"]?.ToString().Length > 0 ? jData["measure_id"]?.ToString().Trim() : null,
                            component_id = jData["component_id"]?.ToString().Length > 0 ? jData["component_id"]?.ToString().Trim() : null,
                            id_ext = jData["id_ext"]?.ToString().Length > 0 ? jData["id_ext"]?.ToString().Trim() : null,
                            sensor_type = jData["sensor_type"]?.ToString().Length > 0 ? jData["sensor_type"]?.ToString().Trim() : null,
                            asset_type = jData["asset_type"]?.ToString().Length > 0 ? jData["asset_type"]?.ToString().Trim() : null,
                            com_node = jData["com_node"]?.ToString().Length > 0 ? jData["com_node"]?.ToString().Trim() : null,
                            location_type = jData["location_type"]?.ToString().Length > 0 ? jData["location_type"]?.ToString().Trim() : null,
                            eclass_path = jData["eclass_path"]?.ToString().Length > 0 ? jData["eclass_path"]?.ToString().Trim() : null,
                            aas_path = jData["aas_path"]?.ToString().Length > 0 ? jData["aas_path"]?.ToString().Trim() : null,
                            parameter = jData["parameter"]?.ToString().Length > 0 ? jData["parameter"]?.ToString().Trim() : null,
                            unit_type = jData["unit_type"]?.ToString().Length > 0 ? jData["unit_type"]?.ToString().Trim() : null,
                            max = jData["max"]?.ToString().Length > 0 ? jData["max"]?.ToString().Trim() : null,
                            min = jData["min"]?.ToString().Length > 0 ? jData["min"]?.ToString().Trim() : null,
                            calibration_path = jData["calibration_path"]?.ToString().Length > 0 ? jData["calibration_path"]?.ToString().Trim() : null,
                            backup_path = jData["backup_path"]?.ToString().Length > 0 ? jData["backup_path"]?.ToString().Trim() : null,
                            //timestamp = jData["timestamp"]?.ToString().Length > 0 ? jData["timestamp"]?.ToString().Trim() : null,
                            value = jData["value"]?.ToString().Length > 0 ? jData["value"]?.ToString().Trim() : null
                        };

                        if (jData["timestamp"]?.Type == JTokenType.Date)
                        {
                            DateTimeOffset date = jData["timestamp"].ToObject<DateTimeOffset>();
                            string strDate = date.ToString("yyyy-MM-dd HH:mm:ss");

                            data.timestamp = strDate;
                        }

                        results.Add(data);
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                results = null;
            }

            return results;
        }


        public static bool SendBAMDataToUNE(List<BAM_Data> bamDatas, string strURL, out string strErrorMessage)
        {
            strErrorMessage = null;
            bool result = true;
            string strResult = null;

            try
            {
                string strJson = JsonSerializer.Serialize<List<BAM_Data>>(bamDatas);

                strResult = SendQuery(null, strJson, strURL, out strErrorMessage, POST);
                if (strErrorMessage != SUCESS)
                    result = false;
            }
            catch (Exception e)
            {
                result = false;
                strErrorMessage = e.Message;
            }

            return result;
        }

        private static string SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";

            string strResponse = null;

            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strURL));
                request.Method = strMethodType;

                if (dicHeaders != null)
                {
                    request.ContentType = "application/json; charset=utf-8";

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
                    request.ContentType = "application/json; charset=utf-8";

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
