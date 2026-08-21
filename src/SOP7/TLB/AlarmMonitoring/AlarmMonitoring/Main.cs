using dnsDBUtil;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using System.Threading;
using dnsCommunicateSopServer;
using System.Collections;
using dnsData.Sensor;

namespace AlarmMonitoring
{
    public class Main
    {
        private DirectDBManager m_dbManager = null;
        private SensorManager m_sensorManager = null;
        private SopQueryManager m_sopQueryManager = null;
        private string m_strFireURL = string.Empty;
        private string m_strFireSopWebServerURL = string.Empty;        
        private string m_strHighTempSopWebServerURL = string.Empty;
        private string m_strTiltSopWebServerURL = string.Empty;
        private bool m_bRunThread = false;
        public Main()
        {
            bool configCheck = ReadConfig();
            if (!configCheck)
                return;

            m_bRunThread = true;

            m_sensorManager = new SensorManager(m_dbManager);
            m_sopQueryManager = new SopQueryManager();
            Thread t = new Thread(new ThreadStart(Monitoring));
            t.Start();

            Logger.Instance.Write("Start");
        }

        private bool ReadConfig()
        {
            string strDbHost = ConfigurationManager.AppSettings["DbHost"];
            string strDbType = ConfigurationManager.AppSettings["DbType"];
            string strDbName = ConfigurationManager.AppSettings["DbName"];
            string strDbId = ConfigurationManager.AppSettings["DbId"];
            string strDbPw = ConfigurationManager.AppSettings["DbPw"];
            
            if (strDbHost == null || strDbType == null || strDbName == null || strDbId == null || strDbPw == null)
            {
                Logger.Instance.Write("config파일 확인");
                return false;
            }

            if (!int.TryParse(strDbType, out int nDBType))
            {
                Logger.Instance.Write("config DbType 확인");
                return false;
            }

            m_dbManager = new DirectDBManager(nDBType, strDbHost, strDbName, strDbId, strDbPw);

            string strFireURL = ConfigurationManager.AppSettings["FireURL"];
            if (strFireURL == null)
            {
                Logger.Instance.Write("config URL 확인");
                return false;
            }

            m_strFireURL = strFireURL;

            string strSopWebServerURL = ConfigurationManager.AppSettings["SopWebServerURL"];
            string lastStr = strSopWebServerURL.Substring(strSopWebServerURL.Length - 1, 1);
            if (lastStr == "/")
                strSopWebServerURL = strSopWebServerURL.Remove(strSopWebServerURL.Length - 1, 1);

            m_strFireSopWebServerURL = strSopWebServerURL + "/api/fireSensor";
            m_strHighTempSopWebServerURL = strSopWebServerURL + "/api/highTempSensor";
            m_strTiltSopWebServerURL = strSopWebServerURL + "/api/tiltSensor";


            return true;
        }

        private void Monitoring()
        {
            while (m_bRunThread)
            {
                try
                {
                    WebRequest request = WebRequest.Create(m_strFireURL);
                    request.Credentials = CredentialCache.DefaultCredentials;
                    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                    {
                        using (Stream s = response.GetResponseStream())
                        {
                            using (StreamReader sr = new StreamReader(s))
                            {
                                string strData = sr.ReadToEnd();
                                Result sensorInfo = JsonSerializer.Deserialize<Result>(strData);
#if SERVICE
#else
                                if (FormMain.TestSignal)
                                {
                                    //sensorInfo.success[0].sttus = "이상"; //TEST
                                    //sensorInfo.success[1].sttus = "이상"; //TEST

                                    // 경비실 테스트 신호
                                    FireSensorInfo fireSensorInfo = sensorInfo.success.Find(x => x.deviceNm == "TLB1R03");
                                    if (fireSensorInfo != null)
                                        fireSensorInfo.sttus = "이상";
                                    else
                                        Logger.Instance.Write("경비실 테스트 신호 Error 해당 값이 없음");

                                }
#endif
                                // 화재
                                CheckAlarm(sensorInfo.success, (int)Facility.FacilityType.FIRE_SENSOR);

                                // 고온감지 덕트
                                CheckAlarm(sensorInfo.success, (int)Facility.FacilityType.HighTemp);

                                // 누출 기울기
                                CheckAlarm(sensorInfo.success, (int)Facility.FacilityType.Tilt);
                            }
                        }
                    }
                }
                catch (Exception e)
                {

                    Logger.Instance.Write("Monitoring : " + e.Message);
                }

                Thread.Sleep(1000);
            }
        }

        private void CheckAlarm(List<FireSensorInfo> sensorInfos, int nSensorType)
        {
            if (!SensorManager.Instance.DicSensorTagInfo.TryGetValue(nSensorType, out Dictionary<int, SensorTag> sensorTags))
                return;            

            //foreach (FireSensorInfo info in sensorInfos)
            //{
            //    // .TODO: 이상센서 제외
            //    if (info.deviceNm == "TLBTK20" || info.deviceNm == "TLBTK05" || info.deviceNm == "TLB1R04" || info.deviceNm == "TLBTK30 (SOP 테스트)")
            //        continue;

            //    if (info.sttus != "정상")
            //    {                    
            //        foreach (var item in sensorTags)
            //        {
            //            SensorTag tag = item.Value;
            //            if (tag.SensorName == info.deviceNm)
            //            {
            //                if (!SensorManager.Instance.DicCurrentAlarm.TryGetValue(tag.SensorZoneID, out AlarmInfo alarmInfo))
            //                {
            //                    SendSensorData(nSensorType, tag.ID, tag.SensorZoneID, 1);
            //                }
            //                break;
            //            }
            //        }                    
            //    }               
            //}
            foreach (var item in sensorTags)
            {
                SensorTag tag = item.Value;

                FireSensorInfo info = sensorInfos?.Find(x => x.deviceNm == tag.SensorName);
                if (info != null && info.sttus != "정상")
                {
                    if (!SensorManager.Instance.DicCurrentAlarm.TryGetValue(tag.SensorZoneID, out AlarmInfo alarmInfo))                    
                        SendSensorData(nSensorType, tag.ID, tag.SensorZoneID, 1);                    
                }
            }


            foreach (KeyValuePair<int, AlarmInfo> item in SensorManager.Instance.DicCurrentAlarm)
            {
                if (!sensorTags.TryGetValue(item.Key, out SensorTag sensorTag))
                    continue;

                //foreach (FireSensorInfo info in sensorInfos)
                //{
                //    if (info.deviceNm == sensorTag.SensorName)
                //    {
                //        if (info.sttus == "정상")
                //            SendSensorData(nSensorType, sensorTag.ID, sensorTag.SensorZoneID, 0);
                //        break;
                //    }
                //}
                FireSensorInfo info = sensorInfos?.Find(x => x.deviceNm == sensorTag.SensorName);
                if (info != null && info.sttus == "정상")
                {
                    SendSensorData(nSensorType, sensorTag.ID, sensorTag.SensorZoneID, 0);
                }
            }
        }

        public bool SendSensorData(int nSensorType, int nTagID, int nSensorZoneID, int nSensorData)
        {
            if (m_sopQueryManager == null)
                return false;

            try
            {
                ArrayList arrDatas = new ArrayList();
                arrDatas.Add(nSensorType);
                arrDatas.Add(nTagID);
                arrDatas.Add(nSensorZoneID);
                arrDatas.Add((nSensorData == 1) ? true : false);

                string strURL = "";
                if (nSensorType == 0)
                    strURL = m_strFireSopWebServerURL;
                else if (nSensorType == 290)
                    strURL = m_strHighTempSopWebServerURL;
                else if (nSensorType == 291)
                    strURL = m_strTiltSopWebServerURL;

                bool result = m_sopQueryManager.SendAlarmQuery(arrDatas, "POST", out string strError, strURL);
                if (!result)
                    Logger.Instance.Write("SendSensorData strError : " + strError);
                return result;
            }
            catch (Exception e)
            {
                Logger.Instance.Write("SendSensorData : " + e.Message);
                return false;
            }
        }

        public void Stop()
        {
            m_bRunThread = false;
            if (m_sensorManager != null)
                m_sensorManager.Stop();

            Logger.Instance.Write("Stop");
        }
    }

    public class Result
    {
        public List<FireSensorInfo> success { get; set; }
    }
    public class FireSensorInfo
    {
        public string deviceEui { get; set; }
        public string knd { get; set; }
        public string deviceNm { get; set; }
        public string la{ get; set; }
        public string lo { get; set; }
        public string instlLc { get; set; }
        public string fcltyNm { get; set; }
        public string adres { get; set; }
        public string xaxsVa { get; set; }
        public string xaxsReVa { get; set; }
        public string yaxsVa { get; set; }
        public string yaxsReVa { get; set; }
        public string tp { get; set; }
        public string hd { get; set; }
        public string btry { get; set; }
        public string sttus { get; set; }
        public string regDe { get; set; }
    }
}
