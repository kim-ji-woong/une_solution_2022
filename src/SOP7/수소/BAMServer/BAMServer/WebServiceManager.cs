using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace BAMServer
{
    public class WebServiceManager
    {
        public const string SUCESS = "success";

        public static List<BAM_Data> RequestAPIData(string strURL, out string strErrorMessage)
        {
            strErrorMessage = null;
            List<BAM_Data> results = null;

            try
            {
                string strResult = SendQuery(null, null, strURL, out strErrorMessage);

                if (strErrorMessage == SUCESS && strResult != null)
                {
                    results = new List<BAM_Data>();

                    // .TODO: 독일 현장에서는 달리 적용해야 함.
                    JArray jResult = JArray.Parse(strResult);

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
                            timestamp = jData["timestamp"]?.ToString().Length > 0 ? jData["timestamp"]?.ToString().Trim() : null,
                            value = jData["value"]?.ToString().Length > 0 ? jData["value"]?.ToString().Trim() : null
                        };

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



        public static void SendSensorData(int nID, Senko.ClientProvider provider, DateTime date)
        {
            string strURL = "";
            string strErrorMessage = null;
            string strResult = null;

            Random rand = new Random();
            int nValue = 0;

            if (provider.H2_High != null)
            {
                nValue = rand.Next(0, 100);

                strURL = $"http://192.168.100.21/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_01_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("hh:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
                strResult = SendQuery(null, null, strURL, out strErrorMessage);
                if (strErrorMessage != SUCESS)                
                    Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_High): {strErrorMessage}");                
            }

            if (provider.H2_Low != null)
            {
                nValue = rand.Next(0, 100);

                strURL = $"http://192.168.100.21/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_02_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("hh:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
                strResult = SendQuery(null, null, strURL, out strErrorMessage);
                if (strErrorMessage != SUCESS)
                    Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_Low): {strErrorMessage}");
            }

            if (provider.O2 != null)
            {
                nValue = rand.Next(0, 100);

                strURL = $"http://192.168.100.21/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_03_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("hh:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
                strResult = SendQuery(null, null, strURL, out strErrorMessage);
                if (strErrorMessage != SUCESS)
                    Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, O2): {strErrorMessage}");
            }

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
