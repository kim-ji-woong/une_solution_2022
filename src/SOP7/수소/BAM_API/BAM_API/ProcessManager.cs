using BAM_API.Data;
using BAM_API.Process;
using BAM_API.ViewModels;
using dnsCommunicateSopServer;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static dnsData.Sensor.Facility;

namespace BAM_API
{
    public class ProcessManager
    {
        private const string ALARM_Warning = "주의";
        private const string ALARM_Alert = "경보";

        private const string PARAMETER_ALARM = "<parameter><comment>Status of Sensor. 0= default. 1= Normal. 5=On hold. 10=O2 alarm. 11=O2 critical. 20=H2 Alarm. 21=H2 critical. 101=LL Alarm. 102=L Alarm. 103=H Alarm. 104=HH Alarm. 210=Device Error. </comment></parameter>";

        private const string TYPE_STATUS = "status";

        private const int LEVEL_Warning = 2;
        private const int LEVEL_Alert = 3;



        private IDataManager m_dataManager = null;

        private Thread m_watchBamDataThread = null;
        private Thread m_watchKGSThread = null;

        private bool m_shutdownThread = false;

        private int m_nThreadSleep = 600;  // 60초

        private Dictionary<string, CheckData> m_dicCheck = new Dictionary<string, CheckData>();

        private SopQueryManager m_sopQueryManager = null;

        private Dictionary<string, int> m_dicKGSIDs = null;

        private Dictionary<int, int> m_dicAlarms = new Dictionary<int, int>();

        public ProcessManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;

            m_sopQueryManager = new SopQueryManager(Startup.ConfigManager.Site.SOPWebServerURL);

            InitKGSID();

            m_watchBamDataThread = new Thread(() => WatchBamDataThread());
            m_watchBamDataThread.Start();

            m_watchKGSThread = new Thread(() => WatchKGSThread());
            m_watchKGSThread.Start();
        }

        private void InitKGSID()
        {
            m_dicKGSIDs = new Dictionary<string, int>();

            m_dicKGSIDs["E1-10_H2(90006)"] = 7;
            m_dicKGSIDs["E1-11_O2(90010)"] = 8;
            m_dicKGSIDs["E1-16_H2(90008)"] = 3;
            m_dicKGSIDs["E1-1_H2(100108)"] = 23;
            m_dicKGSIDs["E1-5_H2(100106)"] = 24;
            m_dicKGSIDs["E1-6_H2(90007)"] = 2;
            m_dicKGSIDs["E1-7_O2(90012)"] = 1;
            m_dicKGSIDs["E1_P"] = 18;
            m_dicKGSIDs["E2_T"] = 20;
            m_dicKGSIDs["E3-1_P"] = 35;
            m_dicKGSIDs["E3-1_T"] = 34;
            m_dicKGSIDs["E3-2_P"] = 37;
            m_dicKGSIDs["E3-2_T"] = 36;
            m_dicKGSIDs["E3-3_P"] = 39;
            m_dicKGSIDs["E3-3_T"] = 38;
            m_dicKGSIDs["E4-1_P"] = 27;
            m_dicKGSIDs["E4-1_T"] = 26;
            m_dicKGSIDs["E4-2_P"] = 29;
            m_dicKGSIDs["E4-2_T"] = 28;
            m_dicKGSIDs["E4-3_P"] = 31;
            m_dicKGSIDs["E4-3_T"] = 30;
            m_dicKGSIDs["E5_T"] = 13;
            m_dicKGSIDs["Node1_P"] = 43;
            m_dicKGSIDs["Node1_T"] = 25;
            m_dicKGSIDs["Node2_P"] = 15;
            m_dicKGSIDs["Node2_T"] = 16;
            m_dicKGSIDs["Node7_P"] = 22;
            m_dicKGSIDs["Node7_Q"] = 50;
            m_dicKGSIDs["Node7_T"] = 44;

            m_dicKGSIDs["E1-12_H2(2914)"] = 60;
            m_dicKGSIDs["E1-13_O2(2907)"] = 61;
            m_dicKGSIDs["E1-14_H2(2913)"] = 11;
            m_dicKGSIDs["E1-15_H2(2910)"] = 40;
            m_dicKGSIDs["E1-2_H2(2911)"] = 55;
            m_dicKGSIDs["E1-3_O2(2909)"] = 56;

            m_dicKGSIDs["E1-4_H2(2915)"] = 57;
            m_dicKGSIDs["E1-8_H2(2912)"] = 9;
            m_dicKGSIDs["E1-9_O2(2908)"] = 10;
        }

        private void WatchBamDataThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchBamDataThread 실행");

            while (!m_shutdownThread)
            {
                try
                {
                    // BAM Data Read 
                    string strServerURL = Startup.ConfigManager.LinkURL.BAMServerURL;
                    strServerURL += "/api_corea/sensor/read02.php";
                    string strResult = WebServiceManager.SendQuery(null, null, strServerURL, out strErrorMessage);

                    // .TODO: 유엔이 내부 테스트
                    //string strServerURL = Startup.ConfigManager.LinkURL.AWSServerURL + "/UNE/RequestAPIData";
                    //string strResult = WebServiceManager.SendQuery(null, null, strServerURL, out strErrorMessage, WebServiceManager.POST);

                    if (strResult == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    // .TODO: 유엔이 내부 테스트
                    //JObject jResults = JObject.Parse(strResult);

                    //bool isSuccess = jResults.Value<bool?>("success") ?? false;
                    //strErrorMessage = jResults.Value<string>("message");

                    //if (isSuccess == false)
                    //{
                    //    throw new ApplicationException(strErrorMessage);
                    //}

                    //strResult = jResults.Value<string>("bamData");


                    List<BAM_Data> datas = new List<BAM_Data>();
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
                            //timestamp = jData["timestamp"]?.ToString().Length > 0 ? jData["timestamp"]?.ToString().Trim() : null,
                            value = jData["value"]?.ToString().Length > 0 ? jData["value"]?.ToString().Trim() : null
                        };

                        if (jData["timestamp"]?.Type == JTokenType.Date)
                        {
                            DateTimeOffset date = jData["timestamp"].ToObject<DateTimeOffset>();
                            string strDate = date.ToString("yyyy-MM-dd HH:mm:ss");

                            data.timestamp = strDate;
                        }

                        datas.Add(data);
                    }


                    // 모니터링 센서 관련 알람 상태 여부 파악
                    Dictionary<string, bool> dicDeviceIDs = Device.GetListID();

                    foreach (KeyValuePair<string, bool> deivce in dicDeviceIDs)
                    {
                        string strID = deivce.Key;
                        bool bIsAlarmCheck = deivce.Value;

                        List<BAM_Data> searchDatas = datas.FindAll(x => x.id_ext == strID);

                        foreach (BAM_Data searchData in searchDatas)
                        {
                            // 상태, 값 분류
                            string measure_id = searchData.measure_id;
                            string value = searchData.value;
                            string sensor_type = searchData.sensor_type;
                            string id_ext = searchData.id_ext;
                            string parameter = searchData.parameter;

                            CheckData data = null;

                            if (m_dicCheck.ContainsKey(strID) == false)
                            {
                                data = new CheckData();
                                data.id_ext = strID;

                                m_dicCheck[strID] = data;
                            }
                            else
                            {
                                data = m_dicCheck[strID];
                            }

                            if (sensor_type == TYPE_STATUS && bIsAlarmCheck && parameter == PARAMETER_ALARM)
                            {   // 상태 값은 알람 여부
                                int nLevel = GetAlarmLevel(value);

                                // .TODO: 임의 테스트 알람 발생
                                //if (measure_id == "PressSensor80Hrs01_02_status")
                                //{
                                //    nLevel = ID.ALARM_LEVEL1;
                                //}                                                          

                                if (data.level != nLevel)
                                {
                                    string strSQL = @$"SELECT sdmssensorzone.ID AS SensorZoneID,  sdmssensortaginfo.ID as TagID, sdmssensoretc.MaterialType as Type
                                                        FROM sdmssensoretc, sdmssensorzone, sdmssensortaginfo 
                                                        WHERE sdmssensoretc.ID = sdmssensorzone.OrgSensorID 
                                                        AND sdmssensorzone.ID = sdmssensortaginfo.SensorZoneID 
                                                        AND sdmssensoretc.UniqueKey = '{id_ext}'
                                                        AND sdmssensorzone.SensorType = sdmssensoretc.MaterialType";

                                    dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                                    if (result == null)
                                    {
                                        Logger.Instance.Write($"SZ, Tag Join Error (id_ext: {id_ext}, Message: {strErrorMessage})");
                                        continue;
                                    }

                                    int nSensorZoneID = result.SensorZoneID;
                                    int nTagID = result.TagID;
                                    int nType = result.Type;

                                    string strURL = GetServerURL(nType);
                                    if (strURL == ID.URL_NONE)
                                    {
                                        Logger.Instance.Write($"{nType} 해당하는 서버 URL 존재하지 않습니다.");
                                        continue;
                                    }

                                    strURL = Startup.ConfigManager.Site.SOPWebServerURL + strURL;


                                    if (nLevel == ID.ALARM_NORMAL)
                                    {   // 알람 해제
                                        bool bIsAlarm = false;

                                        ArrayList arrDatas = new ArrayList();
                                        arrDatas.Add(nType);
                                        arrDatas.Add(nTagID);
                                        arrDatas.Add(nSensorZoneID);
                                        arrDatas.Add(bIsAlarm);

                                        if (m_sopQueryManager.SendAlarmQuery(arrDatas, "POST", strURL) == false)
                                        {
                                            Logger.Instance.Write($"SendAlarmQuery Error (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, SensorType: {nType})");
                                        }
                                        else
                                        {
                                            data.level = nLevel;
                                            Logger.Instance.Write($"SendAlarmQuery Success (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, SensorType: {nType})");
                                        }
                                    }
                                    else if (nLevel == ID.ALARM_LEVEL1 || nLevel == ID.ALARM_LEVEL2)
                                    {   // 알람 발생
                                        bool bIsAlarm = true;

                                        ArrayList arrDatas = new ArrayList();
                                        arrDatas.Add(nType);
                                        arrDatas.Add(nTagID);
                                        arrDatas.Add(nSensorZoneID);
                                        arrDatas.Add(bIsAlarm);
                                        arrDatas.Add(nLevel);

                                        if (m_sopQueryManager.SendAlarmQuery(arrDatas, "POST", strURL) == false)
                                        {
                                            Logger.Instance.Write($"SendAlarmQuery Error (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, Level: {nLevel}, SensorType: {nType})");
                                        }
                                        else
                                        {
                                            data.level = nLevel;
                                            Logger.Instance.Write($"SendAlarmQuery Success (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, Level: {nLevel}, SensorType: {nType})");
                                        }
                                    }
                                }
                            }
                            else if (sensor_type == "value")
                            {   // 값은 업데이트

                                if (data.value != value)
                                {
                                    Dictionary<ETC.Fields, object> dicSets = new Dictionary<ETC.Fields, object>();
                                    dicSets[ETC.Fields.CurrentData] = value;

                                    string strConditions = $"{ETC.Fields.UniqueKey} = '{data.id_ext}'";

                                    if (m_dataManager.GetUpdate().Update<ETC, ETC.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                                    {
                                        Logger.Instance.Write($"ETC Update Error (id_ext: {id_ext}, Message: {strErrorMessage})");
                                        continue;
                                    }
                                }
                            }
                        }
                    }

                    SleepThread(250);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write($"WatchThread Error 예외: {e.Message}");
                    SleepThread();
                }
            }
        }

        public static int GetAlarmLevel(string status)
        {
            int nLevel = ID.ALARM_NORMAL;

            if (status == ID.Status_default || status == ID.Status_Normal || status == ID.Status_OnHold)
            {
                nLevel = ID.ALARM_NORMAL;
            }
            else if (status == ID.Status_O2alarm || status == ID.Status_H2Alarm || status == ID.Status_LAlarm || status == ID.Status_HAlarm)
            {
                nLevel = ID.ALARM_LEVEL1;
            }
            else if (status == ID.Status_O2critical || status == ID.Status_H2critical || status == ID.Status_LLAlarm || status == ID.Status_HHAlarm)
            {
                nLevel = ID.ALARM_LEVEL2;
            }

            return nLevel;
        }

        public int GetSensorType(string id_ext)
        {
            FacilityType type = FacilityType.NONE;

            if (id_ext.StartsWith(ID.IDEXT_Temp))
            {
                type = FacilityType.Temp;
            }
            else if (id_ext.StartsWith(ID.IDEXT_Pressure))
            {
                type = FacilityType.PRESSURE_SENSOR;
            }


            // .TODO: 센서 분류 추가 필요



            return (int)type;
        }

        public string GetServerURL(int nType)
        {
            string strURL = ID.URL_NONE;

            if (nType == (int)FacilityType.H2)
            {
                strURL = ID.URL_H2;
            }
            else if (nType == (int)FacilityType.Temp)
            {
                strURL = ID.URL_TEMP;
            }
            else if (nType == (int)FacilityType.PRESSURE_SENSOR)
            {
                strURL = ID.URL_Pressure;
            }
            else if (nType == (int)FacilityType.Flow)
            {
                strURL = ID.URL_Flow;
            }
            else if (nType == (int)FacilityType.H2JAG)
            {
                strURL = ID.URL_H2JAG;
            }
            else if (nType == (int)FacilityType.O2JAG)
            {
                strURL = ID.URL_O2JAG;
            }
            else if (nType == (int)FacilityType.H2Low_Senko)
            {
                strURL = ID.URL_H2Low;
            }
            else if (nType == (int)FacilityType.O2_Senko)
            {
                strURL = ID.URL_O2;
            }

            return strURL;
        }

        private void WatchKGSThread()
        {
            string strErrorMessage = "";
            Logger.Instance.Write("WatchKGSThread 실행");

            while (!m_shutdownThread)
            {
                try
                {
                    // BAM Data Read 
                    string strServerURL = Startup.ConfigManager.LinkURL.AWSServerURL;                    
                    strServerURL += "/KGS/RequestAlarm";
                    string strResult = WebServiceManager.SendQuery(null, null, strServerURL, out strErrorMessage, WebServiceManager.POST);
                    if (strResult == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    // AWS 응답 파싱
                    JObject jResults = JObject.Parse(strResult);
                    string success = jResults["success"]?.ToString().Trim();
                    string message = jResults["message"]?.ToString().Trim();
                    string kgs_data = jResults["kgs_data"]?.ToString().Trim();
                    string kgs_data_en = jResults["kgs_data_en"]?.ToString().Trim();

                    JObject data = JObject.Parse(kgs_data);
                    JObject data_en = JObject.Parse(kgs_data_en);

                    if (success != "True")
                    {
                        throw new ApplicationException("응답 오류 메시지: " + strErrorMessage);
                    }
                    else if (data == null)
                    {
                        throw new ApplicationException("kgs_data 데이터가 존재하지 않습니다.");
                    }
                    else if (data_en == null)
                    {
                        throw new ApplicationException("kgs_data_en 데이터가 존재하지 않습니다.");
                    }

                    JObject result = (JObject)data["result"];
                    if (result == null)
                    {
                        throw new ApplicationException("result 데이터가 존재하지 않습니다.");
                    }
                    JObject result_en = (JObject)data_en["result"];
                    if (result == null)
                    {
                        throw new ApplicationException("result_en 데이터가 존재하지 않습니다.");
                    }


                    string strTag = "E1-10_H2(90006)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-11_O2(90010)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-12_H2(2914)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-13_O2(2907)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-14_H2(2913)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-15_H2(2910)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-16_H2(90008)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-1_H2(100108)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-2_H2(2911)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-3_O2(2909)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-4_H2(2915)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-5_H2(100106)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-6_H2(90007)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-7_O2(90012)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-8_H2(2912)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1-9_O2(2908)";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E1_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "E1_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "E2_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E2_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E3-1_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");


                    strTag = "E3-1_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E3-2_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E3-2_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E3-3_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E3-3_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E4-1_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E4-1_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E4-2_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E4-2_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E4-3_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E4-3_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "E5_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "E5_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node10_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node10_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "Node1_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "Node1_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "Node2_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "Node2_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node3-1_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node3-1_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node3-2_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node3-2_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node3-3_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node3-3_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node4_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node4_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node5_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node5_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node6-1_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node6-1_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node6-2_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node6-2_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node6-3_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node6-3_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "Node7_P";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "Node7_Q";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    strTag = "Node7_T";
                    if (ParsingAlarmData((JObject)result[strTag], strTag, (JObject)result_en[strTag], out strErrorMessage) == false)
                        Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node8_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node8_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node9_P";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    //strTag = "Node9_T";
                    //if (ParsingAlarmData((JObject)result[strTag], strTag, out strErrorMessage) == false)
                    //    Logger.Instance.Write($"ParsingAlarmData Error 예외 ({strTag}): {strErrorMessage}");

                    SleepThread(250);
                }
                catch (Exception e)
                {
                    Logger.Instance.Write($"WatchKGSThread Error 예외: {e.Message}");
                    SleepThread();
                }
            }
        }

        public bool ParsingAlarmData(JObject jData, string strTag, JObject jData_en, out string strErrorMessage)
        {
            strErrorMessage = null;
            bool bRet = true;

            try
            {
                if (jData == null)
                {
                    throw new ApplicationException($"{strTag} 값이 존재하지 않습니다.");
                }
                else if (m_dicKGSIDs.ContainsKey(strTag) == false)
                {
                    throw new ApplicationException($"{strTag}의 ID가 존재하지 않습니다.");
                }

                int nSensorID = m_dicKGSIDs[strTag];
                int nLevel = 0;

                string status = jData["상태"]?.ToString().Trim();
                if (status == null)
                {
                    throw new ApplicationException($"상태 값이 존재하지 않습니다.");
                }

                if (status.Contains(ALARM_Warning))
                {
                    nLevel = LEVEL_Warning;
                }
                else if (status.Contains(ALARM_Alert))
                {
                    nLevel = LEVEL_Alert;
                }


                int nLevel_ORG = 0;
                if (m_dicAlarms.ContainsKey(nSensorID))
                {
                    nLevel_ORG = m_dicAlarms[nSensorID];
                }

                if (nLevel != nLevel_ORG)
                {
                    string strSQL = @$"SELECT sdmssensorzone.ID AS SensorZoneID,  sdmssensortaginfo.ID as TagID, sdmssensoretc.MaterialType as Type
                                        FROM sdmssensoretc, sdmssensorzone, sdmssensortaginfo 
                                        WHERE sdmssensoretc.ID = sdmssensorzone.OrgSensorID 
                                        AND sdmssensorzone.ID = sdmssensortaginfo.SensorZoneID 
                                        AND sdmssensoretc.ID = {nSensorID}
                                        AND sdmssensorzone.SensorType = sdmssensoretc.MaterialType";

                    dynamic result = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                    if (result == null)
                    {
                        throw new ApplicationException($"SZ, Tag Join Error (OrgSensorID: {nSensorID}, Message: {strErrorMessage})");
                    }

                    int nSensorZoneID = result.SensorZoneID;
                    int nTagID = result.TagID;
                    int nType = result.Type;

                    string strURL = GetServerURL(nType);
                    if (strURL == ID.URL_NONE)
                    {
                        throw new ApplicationException($"{nType} 해당하는 서버 URL 존재하지 않습니다.");
                    }

                    strURL = Startup.ConfigManager.Site.SOPWebServerURL + strURL;

                    if (nLevel == 0)
                    {   // 알람 발생 해제
                        bool bIsAlarm = false;

                        ArrayList arrDatas = new ArrayList();
                        arrDatas.Add(nType);
                        arrDatas.Add(nTagID);
                        arrDatas.Add(nSensorZoneID);
                        arrDatas.Add(bIsAlarm);

                        if (m_sopQueryManager.SendAlarmQuery(arrDatas, "POST", strURL) == false)
                        {
                            throw new ApplicationException($"SendAlarmQuery Error (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, SensorType: {nType})");
                        }
                        else
                        {
                            m_dicAlarms[nSensorID] = nLevel;
                            throw new ApplicationException($"SendAlarmQuery Success (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, SensorType: {nType})");
                        }
                    }
                    else
                    {   // 알람 발생 및 단계 변경

                        string strParameter = null;
                        string strDeviation = null;
                        string strCause = null;
                        string event_scenario = null;
                        string hazard_scenario = null;
                        string action = null;
                        string reference = null;

                        JArray hazops = (JArray)jData["hazop"];
                        JArray hazops_en = (JArray)jData_en["hazop"];
                        if (hazops != null && hazops.Count > 0 &&
                            hazops_en != null && hazops_en.Count > 0)
                        {
                            JObject hazop = (JObject)hazops[0];
                            JObject hazop_en = (JObject)hazops_en[0];

                            strParameter = new LanguageData(hazop["_공정파라미터"]?.ToString().Trim(), hazop_en["_공정파라미터"]?.ToString().Trim()).ToString();
                            strDeviation = new LanguageData(hazop["_이탈"]?.ToString().Trim(), hazop_en["_이탈"]?.ToString().Trim()).ToString();
                            strCause = new LanguageData(hazop["_원인"]?.ToString().Trim(), hazop_en["_원인"]?.ToString().Trim()).ToString();
                            event_scenario = new LanguageData(hazop["event_scenario"]?.ToString().Trim(), hazop_en["event_scenario"]?.ToString().Trim()).ToString();
                            hazard_scenario = new LanguageData(hazop["hazard_scenario"]?.ToString().Trim(), hazop_en["hazard_scenario"]?.ToString().Trim()).ToString();

                            status = jData["상태"]?.ToString().Trim();
                            if (status?.Length > 0)
                            {
                                int nIdx = status.IndexOf("(");
                                if (nIdx != -1)
                                {
                                    string status_ko = status.Substring(0, nIdx);
                                    string status_en = status.Substring(nIdx + 1).TrimEnd(')');

                                    status = new LanguageData(status_ko, status_en).ToString();
                                }
                                else
                                {
                                    status = new LanguageData(jData["상태"]?.ToString().Trim(), jData_en["상태"]?.ToString().Trim()).ToString();
                                }
                            }
                            else
                            {
                                status = new LanguageData("-", "-").ToString();
                            }
                           
                            if (nLevel == LEVEL_Warning)
                            {
                                action = new LanguageData(hazop["preventive_action_주의단계_"]?.ToString().Trim(), hazop_en["preventive_action_주의단계_"]?.ToString().Trim()).ToString();
                                reference = new LanguageData(hazop["preventive_reference_주의단계_"]?.ToString().Trim(), hazop_en["preventive_reference_주의단계_"]?.ToString().Trim()).ToString();
                            }
                            else if (nLevel == LEVEL_Alert)
                            {
                                action = new LanguageData(hazop["emergency_response_경보단계_"]?.ToString().Trim(), hazop_en["emergency_response_경보단계_"]?.ToString().Trim()).ToString();
                                reference = new LanguageData(hazop["emergency_reference"]?.ToString().Trim(), hazop_en["emergency_reference"]?.ToString().Trim()).ToString();
                            }
                        }
                        else
                        {
                            throw new ApplicationException($"hazop 데이터가 존재하지 않습니다.");
                        }

                        DateTime dtNow = DateTime.Now;


                        strSQL = $@"SELECT IFNULL(MAX(ID), 0) as max from historyriskassess";
                        dynamic maxResult = m_dataManager.GetSelect().SelectFirst(strSQL, out strErrorMessage);
                        if (maxResult == null)
                        {
                            throw new ApplicationException("MAX historyriskassess ID Error  : " + strErrorMessage);
                        }

                        int nMaxID = maxResult.max;
                        nMaxID++;

                        strSQL = $@"INSERT INTO historyriskassess (ID, SensorID, Parameter, Deviation, Cause, event_scenario, hazard_scenario, action, reference, status, read_data_time) 
                                    VALUES ({nMaxID}, {nSensorID}, '{strParameter}', '{strDeviation}', '{strCause}', '{event_scenario}', '{hazard_scenario}', '{action}', '{reference}', '{status}', '{dtNow.ToString("yyyy-MM-dd HH:mm:ss")}')";

                        if (m_dataManager.GetCreate().Insert(strSQL, out strErrorMessage) == false)
                        {
                            throw new ApplicationException("historyriskassess Insert Error  : " + strErrorMessage);
                        }

                        // 알람 발생 신호 송신
                        bool bIsAlarm = true;

                        ArrayList arrDatas = new ArrayList();
                        arrDatas.Add(nType);
                        arrDatas.Add(nTagID);
                        arrDatas.Add(nSensorZoneID);
                        arrDatas.Add(bIsAlarm);
                        arrDatas.Add(nLevel);

                        ArrayList arrData2 = new ArrayList();
                        arrData2.Add(nMaxID);

                        if (m_sopQueryManager.SendAlarmQuery(arrDatas, "POST", strURL, arrData2) == false)
                        {
                            throw new ApplicationException($"SendAlarmQuery Error (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, SensorType: {nType})");
                        }
                        else
                        {
                            m_dicAlarms[nSensorID] = nLevel;
                            Logger.Instance.Write($"SendAlarmQuery Success (IsAlarm: {bIsAlarm}, SensorZoneID: {nSensorZoneID}, TagID: {nTagID}, SensorType: {nType})");
                        }
                    }
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                bRet = false;
            }

            return bRet;
        }

        public void SleepThread(int nThreadSleep = -1)
        {
            if (nThreadSleep < 0)
                nThreadSleep = m_nThreadSleep;

            for (int i = 0; i < nThreadSleep * 10; i++)
            {
                if (m_shutdownThread)
                    break;

                Thread.Sleep(10);
            }
        }
    }

    public class CheckData
    {
        public string id_ext { get; set; }
        public int level { get; set; }
        public string value { get; set; }
    }

    public class LanguageData
    {
        public LanguageData(string strKO, string strEN)
        {
            this.ko = strKO;
            this.en = strEN;
        }

        public string ko { get; set; }
        public string en { get; set; }

        public string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
