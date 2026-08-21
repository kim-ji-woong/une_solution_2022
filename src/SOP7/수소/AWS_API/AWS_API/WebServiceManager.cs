using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace AWS_API
{
    public class WebServiceManager
    {
        private static string BaseAddress = "http://192.168.100.21";
        public static string SUCESS = "success";
        public static string POST = "POST";

        //public static string RequestSensorDatas(out string strErrorMessage)
        //{
        //    strErrorMessage = null;
        //    string strResult = null;

        //    string strURL = "/api_corea/sensor/read02.php";

        //    try
        //    {
        //        strResult = SendQuery(null, null, strURL, out strErrorMessage);

        //        if (strErrorMessage != SUCESS)                
        //            strResult = null;

        //    }
        //    catch (Exception e)
        //    {                
        //        strErrorMessage = e.Message;
        //        strResult = null;
        //    }

        //    return strResult;
        //}

        //public static void SendSensorData()
        //{
        //    string strURL = "";
        //    string strErrorMessage = null;
        //    string strResult = null;

        //    DateTime date = DateTime.Now;            

        //    Random rand = new Random();
        //    int nValue = rand.Next(0, 100);

        //    int nID = 1;

        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_01_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_High): {strErrorMessage}");

        //    nValue = rand.Next(0, 100);
        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_02_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_Low): {strErrorMessage}");

        //    nValue = rand.Next(0, 100);
        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_03_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, O2): {strErrorMessage}");



        //    nID = 2;

        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_01_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_High): {strErrorMessage}");

        //    nValue = rand.Next(0, 100);
        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_02_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_Low): {strErrorMessage}");

        //    nValue = rand.Next(0, 100);
        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_03_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, O2): {strErrorMessage}");




        //    nID = 3;

        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_01_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_High): {strErrorMessage}");

        //    nValue = rand.Next(0, 100);
        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_02_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, H2_Low): {strErrorMessage}");

        //    nValue = rand.Next(0, 100);
        //    strURL = $"/api_corea/sensor/write?measure_id=H2SensorUneTest0{nID}_03_value&timestamp={date.ToString("yyyy-MM-dd")}T{date.ToString("HH:mm:ss")}.000%2B00:00&value={nValue.ToString()}";
        //    Logger.Instance.Write($"SendSensorData() URL Log: {strURL}");

        //    strResult = SendQuery(null, null, strURL, out strErrorMessage);
        //    if (strErrorMessage != SUCESS)
        //        Logger.Instance.Write($"SendSensorData() Error (ID: {nID}, O2): {strErrorMessage}");

        //}

        public static async void SendQuery_Async(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, string strMethodType = "GET")
        {
            // 이 함수를 비동기로 만든다.
            await Task.Yield();

            string strResult = SendQuery(dicHeaders, strBodyJson, strURL, out string strErrorMessage, strMethodType);
            if (strResult == null)
            {
                Logger.Instance.Write($"SendQuery Error (URL: {strURL} / Message: {strErrorMessage})");
            }

            return;

        }

        public static string SendBAMDataToUNE(List<BAM_Data> datas, string strURL, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strResult = null;

            try
            {
                string strJson = JsonSerializer.Serialize<List<BAM_Data>>(datas);

                strResult = SendQuery(null, strJson, strURL, out strErrorMessage, POST);
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
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strURL));
                request.Method = strMethodType;
                request.ContentType = "application/json; charset=utf-8";

                // 응답 시간 설정
                request.Timeout = 30000;

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
}
