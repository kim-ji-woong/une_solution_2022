using dnsCommunicateSopServer;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Timers;

namespace SoulbrainWebSensorServer
{
    public class WebServiceManager
    {
        private string BaseAddress = "";
        private string m_strSoulbrainID = null;
        private string m_strSoulbrainPW = null;

        private string m_strToken = null;
        private string m_strRefreshtoken = null;

        private int m_nMaxRecordID = 0;

        private Dictionary<string, bool> m_dicAlarmLogChk = new Dictionary<string, bool>();

        Dictionary<string, DataDevice> m_dicDevices = new Dictionary<string, DataDevice>();
        public Dictionary<string, DataDevice> DicDevices
        {
            get { return m_dicDevices; }
        }

        private WSopDataManager m_wsopDataMgr = null;
        public WSopDataManager WSopDataMgr
        {
            set { m_wsopDataMgr = value; }
            get { return m_wsopDataMgr; }
        }

        private SopQueryManager m_SopQueryMgr = null;

        private List<AlarmData> m_listAlarm = new List<AlarmData>();

        Dictionary<string, MemberData> m_dicMembers = new Dictionary<string, MemberData>();
        public Dictionary<string, MemberData> DicMembers
        {
            get { return m_dicMembers; }
        }

        private DateTime m_dtCreate = DateTime.Now;
        private DateTime m_dtChkDay = DateTime.Now;

        public WebServiceManager()
        {
            this.BaseAddress = ConfigurationManager.AppSettings.Get("WebServiceBaseURL");
            if (this.BaseAddress == null || this.BaseAddress.Length == 0)
                this.BaseAddress = "http://si.soulbrain.co.kr:8989";


            string strSoulbrainID = ConfigurationManager.AppSettings.Get("SOULBARIN_ID");
            if (strSoulbrainID == null || strSoulbrainID.Length == 0)
                strSoulbrainID = "T10692";

            string strSoulbrainPW = ConfigurationManager.AppSettings.Get("SOULBARIN_PW");
            if (strSoulbrainPW == null || strSoulbrainPW.Length == 0)
                strSoulbrainPW = "T10692";

            m_strSoulbrainID = strSoulbrainID;
            m_strSoulbrainPW = strSoulbrainPW;

            //RequestDeviceList();

            //RequestAllSensorData();

            m_SopQueryMgr = new SopQueryManager();

        }

        public bool RequestLogin()
        {
            // Login 요청 정보 작성
            string strURL = "/api/login";
            string strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            string strJson = "{\"userid\": \"" + m_strSoulbrainID + "\", \"password\":\"" + m_strSoulbrainPW + "\"}";

            // Login REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage, "POST");

            if (strErrorMessage == CommonString.SUCESS)
            {
                // 로그인 성공 >> 토큰 저장
                JObject jResult = JObject.Parse(strResult);
                string strToken = jResult["token"].ToString();
                string strRefreshtoken = jResult["refreshtoken"].ToString();

                m_strToken = strToken;
                m_strRefreshtoken = strRefreshtoken;
            }
            else
            {
                m_strToken = null;
                m_strRefreshtoken = null;

                //Console.WriteLine("Login REST API 실패. (" + strErrorMessage + ")");
                Logger.Instance.Write("Login REST API 실패. (" + strErrorMessage + ")");
                return false;
            }

            return true;
        }


        public bool RequestDeviceList()
        {
            // 로그인 실패로 인해서 토큰 값이 없음.
            if (m_strToken == null)
                return false;

            // Device List 요청 정보 작성
            string strURL = "/api/deviceext/list?size=1000";        // size 값은 한번 요청 시 확인할 device 갯수
            string strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(CommonString.Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device List REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

            if (strErrorMessage == CommonString.SUCESS)
            {
                // 디바이스 조회 성공
                JObject jResult = JObject.Parse(strResult);
                JArray jArrDevices = (JArray)jResult["content"];

                // 조회된 디바이스가 없음
                if (jArrDevices == null || jArrDevices.Count == 0)
                    return false;

                // 메모리 누적현상 관련 수정
                if (m_dicDevices?.Count > 0)
                {
                    m_dicDevices.Clear();
                    m_dicDevices = new Dictionary<string, DataDevice>();
                }


                // DB에 생성된 센서 이외는 제외(디바이스 이름으로 구별)
                List<string> ETCSensors = m_wsopDataMgr.ETCSensors;
                List<string> PSMSensors = m_wsopDataMgr.PSMSensors;





                // 디바이스 리스트 생성
                for (int i = 0; i < jArrDevices.Count; i++)
                {
                    JObject jDevice = (JObject)jArrDevices[i];
                    
                    // 제외된 디바이스 항목
                    // 파주 공장은 제외 또는 인디게이터,게이트웨이,레벨감지기_수신반 제외 또는 TEST Device 제외
                    if (jDevice["organizationName"].ToString().Trim() == CommonString.FACT_PAJU ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_30062 ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_30063 ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_32001 ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_32003 ||
                        jDevice["deviceId"].ToString().Trim() == CommonString.TEST_DEVICE1 ||
                        jDevice["deviceId"].ToString().Trim() == CommonString.TEST_DEVICE2)
                        continue;

                    

                    // DB에 등록된 센서만
                    //if (ETCSensors.Contains(jDevice["deviceId"].ToString().Trim()) == false &&
                    //    PSMSensors.Contains(jDevice["deviceId"].ToString().Trim()) == false)
                    //    continue;
                    // .TODO: 등록되지 않는 센서만 기록
                    if (ETCSensors.Contains(jDevice["deviceId"].ToString().Trim()) ||
                        PSMSensors.Contains(jDevice["deviceId"].ToString().Trim()))
                        continue;





                    DataDevice device = null;

                    device = new DataDevice();
                    device.DeviceId = jDevice["deviceId"].ToString().Trim();
                    device.DeviceName = jDevice["deviceName"].ToString().Trim();
                    device.OrganizationName = jDevice["organizationName"].ToString().Trim();
                    device.Status = jDevice["status"].ToString().Trim();
                    device.VersionId = jDevice["versionId"].ToString().Trim();

                    if (jDevice["placeExt1"] != null && jDevice["placeExt2"] != null && jDevice["placeExt3"] != null)
                    {
                        device.PlaceExt1 = jDevice["placeExt1"].ToString().Trim();
                        device.PlaceExt2 = jDevice["placeExt2"].ToString().Trim();
                        device.PlaceExt3 = jDevice["placeExt3"].ToString().Trim();
                    }
                    if (jDevice["placeExt4"] != null)
                    {
                        device.PlaceExt4 = jDevice["placeExt4"].ToString().Trim();
                    }
                    if (jDevice["placeAreaName"] != null)
                    {
                        device.PlaceAreaName = jDevice["placeAreaName"].ToString().Trim();
                    }

                    m_dicDevices[device.DeviceId] = device;
                }
            }
            else
            {
                //Console.WriteLine("Device List REST API 실패. (" + strErrorMessage + ")");
                Logger.Instance.Write("Device List REST API 실패. (" + strErrorMessage + ")");
                return false;
            }

            return true;
        }

        public Dictionary<string, DataDevice> RequestDeviceList2()
        {
            Dictionary<string, DataDevice> dicDevices = null;

            // 로그인 실패로 인해서 토큰 값이 없음.
            if (m_strToken == null)
                return dicDevices;

            // Device List 요청 정보 작성
            string strURL = "/api/deviceext/list?size=1000";        // size 값은 한번 요청 시 확인할 device 갯수
            string strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(CommonString.Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device List REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

            if (strErrorMessage == CommonString.SUCESS)
            {
                // 디바이스 조회 성공
                JObject jResult = JObject.Parse(strResult);
                JArray jArrDevices = (JArray)jResult["content"];

                // 조회된 디바이스가 없음
                if (jArrDevices == null || jArrDevices.Count == 0)
                    return dicDevices;


                // 디바이스 리스트 생성
                for (int i = 0; i < jArrDevices.Count; i++)
                {
                    JObject jDevice = (JObject)jArrDevices[i];

                    // 제외된 디바이스 항목
                    // 파주 공장은 제외 또는 인디게이터,게이트웨이,레벨감지기_수신반 제외 또는 TEST Device 제외
                    if (jDevice["organizationName"].ToString().Trim() == CommonString.FACT_PAJU ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_30062 ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_30063 ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_32001 ||
                        jDevice["versionId"].ToString().Trim() == CommonString.VERSION_32003 ||
                        jDevice["deviceId"].ToString().Trim() == CommonString.TEST_DEVICE1 ||
                        jDevice["deviceId"].ToString().Trim() == CommonString.TEST_DEVICE2)
                        continue;

                    // DB에 생성된 센서 이외는 제외(디바이스 이름으로 구별)
                    List<string> ETCSensors = m_wsopDataMgr.ETCSensors;
                    List<string> PSMSensors = m_wsopDataMgr.PSMSensors;

                    DataDevice device = null;

                    device = new DataDevice();
                    device.DeviceId = jDevice["deviceId"].ToString().Trim();
                    device.DeviceName = jDevice["deviceName"].ToString().Trim();
                    device.OrganizationName = jDevice["organizationName"].ToString().Trim();
                    device.Status = jDevice["status"].ToString().Trim();
                    device.VersionId = jDevice["versionId"].ToString().Trim();

                    if (jDevice["placeExt1"] != null && jDevice["placeExt2"] != null && jDevice["placeExt3"] != null)
                    {
                        device.PlaceExt1 = jDevice["placeExt1"].ToString().Trim();
                        device.PlaceExt2 = jDevice["placeExt2"].ToString().Trim();
                        device.PlaceExt3 = jDevice["placeExt3"].ToString().Trim();
                    }
                    if (jDevice["placeAreaName"] != null)
                    {
                        device.PlaceAreaName = jDevice["placeAreaName"].ToString().Trim();
                    }

                    if (dicDevices == null)
                        dicDevices = new Dictionary<string, DataDevice>();

                    dicDevices[device.DeviceId] = device;
                }
            }
            else
            {
                //Console.WriteLine("Device List REST API 실패. (" + strErrorMessage + ")");
                Logger.Instance.Write("Device List REST API 실패. (" + strErrorMessage + ")");
                return null;
            }

            return dicDevices;
        }

        public bool RequestSensorData(List<AlarmSensorData> alarmSensors)
        {
            if (alarmSensors == null)
                return false;

            foreach (AlarmSensorData alarmSensor in alarmSensors)
            {
                // Device Sensor Data 요청 정보 작성
                string strURL = "/api/datarecordext/" + alarmSensor.DeviceId + "/latest";
                string strErrorMessage = null;

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders.Add(CommonString.Header_Authorization, "Bearer " + m_strToken);

                string strJson = null;

                // Device Sensor Data REST API 요청
                string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {   // Device Sensor Data 조회 성공
                    JArray jArrSensor = JArray.Parse(strResult);

                    // 조회된 Sensor Data가 없음
                    if (jArrSensor == null || jArrSensor.Count == 0)
                        continue;

                    List<DataSensor> listSensorData = GetDeviceSensorList(alarmSensor, jArrSensor);
                    alarmSensor.SensorDataList = listSensorData;
                }
                else
                {
                    Logger.Instance.Write("Device Sensor Data REST API 실패. (Device ID: " + alarmSensor.DeviceId + ", ErrorMessage: " + strErrorMessage + ")");
                }
            }

            return true;
        }

        private List<DataSensor> GetDeviceSensorList(AlarmSensorData alarmSensorData, JArray jArrSensor)
        {
            List<DataSensor> listSensorData = new List<DataSensor>();

            if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_30063_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, CommonString.VERSION_32001_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, CommonString.VERSION_32003_NAME, false) == 0)
                return listSensorData;


            // 버전에 따른 분류
            if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_30064_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, CommonString.VERSION_32004_NAME, false) == 0 ||
                string.Compare(alarmSensorData.VersionName, CommonString.VERSION_32006_NAME, false) == 0)
            {   // B 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_TYPE, false) == 0 ||
                        string.Compare(sensor.SensorName, CommonString.SENSOR_KIND, false) == 0 ||
                        string.Compare(sensor.SensorName, CommonString.SENSOR_MEASURE, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;

                        // H2 오타 경우 예외처리
                        if (sensorData.SensorName == "H")
                            sensorData.SensorName = CommonString.PSM_H2;
                    }
                    else if (string.Compare(sensor.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                    //else if (string.Compare(sensor.SensorName, CommonString.ETC_CONNECT, false) == 0)
                    //{
                    //    sensor.Value = sensor.SensorStatus;
                    //    // 해당 센서만 추가
                    //    listSensorData.Add(sensor);
                    //}
                }

                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            else if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_32005_NAME, false) == 0)
            {   // B-2 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, CommonString.SENSOR_MEASURE, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                    else if (string.Compare(sensor.SensorName, CommonString.ETC_WATER_TEMP, false) == 0)
                    {
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                    //else if (string.Compare(sensor.SensorName, CommonString.ETC_CONNECT, false) == 0)
                    //{
                    //    sensor.Value = sensor.SensorStatus;
                    //    // 해당 센서만 추가
                    //    listSensorData.Add(sensor);
                    //}
                }

                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            //else if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_30065_NAME, false) == 0)
            //{   // B-3 타입
            //    // 디바이스가 조회되지 않음
            //}
            //else if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_30061_NAME, false) == 0)
            //{   // C 타입 - 스크러버
            //    // 디바이스가 조회되지 않음
            //}
            else if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_32002_NAME, false) == 0)
            {   // C 타입 - HF
                List<DataSensor> temps = new List<DataSensor>();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        DataSensor sensorData = new DataSensor();
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.SensorName = CommonString.PSM_HF;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;

                        // 해당 센서만 추가
                        listSensorData.Add(sensorData);
                    }
                    else if (string.Compare(sensor.SensorName, CommonString.ETC_BATTERY, false) == 0 ||
                        string.Compare(sensor.SensorName, CommonString.ETC_OPERATION, false) == 0)
                    {
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }
            }
            else if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_30056_NAME, false) == 0 ||
                    string.Compare(alarmSensorData.VersionName, CommonString.VERSION_31007_NAME, false) == 0 ||
                    string.Compare(alarmSensorData.VersionName, CommonString.VERSION_31008_NAME, false) == 0)
            {   // A 타입
                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    // VERSION_31007 디바이스의 센서 타입 명칭이 기존 명칭과 다르다. 변환 작업
                    if (string.Compare(alarmSensorData.VersionName, CommonString.VERSION_31007_NAME, false) == 0)
                        sensor.SensorName = CommonString.ChangeSensorType(sensor.SensorName);

                    // 해당 센서만 추가
                    listSensorData.Add(sensor);
                }
            }

            return listSensorData;
        }






        /// <summary>
        /// 단일 디바이스의 센서 데이터를 조회
        /// </summary>
        /// <param name="device">디바이스 정보</param>
        /// <param name="bChkAlarm">알람체크 유무</param>
        /// <param name="alarms">현재 알람 리스트</param>
        /// <returns></returns>
        public bool RequestSensorData(DataDevice device, bool bChkAlarm = false)
        {
            // Device Sensor Data 요청 정보 작성
            string strURL = "/api/datarecordext/" + device.DeviceId + "/latest";
            string strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(CommonString.Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device Sensor Data REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

            if (strErrorMessage == CommonString.SUCESS)
            {   // Device Sensor Data 조회 성공
                JArray jArrSensor = JArray.Parse(strResult);
                
                // 조회된 Sensor Data가 없음
                if (jArrSensor == null || jArrSensor.Count == 0)
                    return false;

                if (device.SensorDataList != null)
                {
                    device.SensorDataList.Clear();
                    //GC.Collect();
                }
                   
                List<DataSensor> listSensorData = GetDeviceSensorList(device, jArrSensor, bChkAlarm);
                device.SensorDataList = listSensorData;
            }
            else
            {
                Logger.Instance.Write("Device Sensor Data REST API 실패. (Device ID: " + device.DeviceId + ", ErrorMessage: " + strErrorMessage + ")");
                return false;
            }
                
            return true;
        }

        private List<DataSensor> GetDeviceSensorList(DataDevice device, JArray jArrSensor, bool bChkAlarm = false)
        {
            List<DataSensor> listSensorData = new List<DataSensor>();

            // 현재 알람 조회
            List<AlarmData> alarms = m_wsopDataMgr.GetAlarmList();

            // 버전에 따른 분류
            if (string.Compare(device.VersionId, CommonString.VERSION_30064, false) == 0 ||
                string.Compare(device.VersionId, CommonString.VERSION_32004, false) == 0)
            {   // B 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_TYPE, false) == 0 ||
                        string.Compare(sensor.SensorName, CommonString.SENSOR_KIND, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;

                        // H2 오타 경우 예외처리
                        if (sensorData.SensorName == "H")
                            sensorData.SensorName = CommonString.PSM_H2;
                    }
                    else if (string.Compare(sensor.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                }

                // 알람 신호 체크
                if (bChkAlarm)
                    CheckAlarmData(device, sensorData, alarms);
                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            else if (device.VersionId == CommonString.VERSION_32005)
            {   // B-2 타입
                DataSensor sensorData = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (string.Compare(sensor.SensorName, CommonString.SENSOR_MEASURE, false) == 0)
                    {
                        sensorData.SensorName = sensor.Value;
                    }
                    else if (string.Compare(sensor.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;
                    }
                    else if (/*sensor.SensorName == CommonString.ETC_WATER_TEMP*/
                        string.Compare(sensor.SensorName, CommonString.ETC_WATER_TEMP, false) == 0)
                    {
                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensor, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }

                // 알람 신호 체크
                if (bChkAlarm)
                    CheckAlarmData(device, sensorData, alarms);
                // 해당 센서만 추가
                listSensorData.Add(sensorData);
            }
            else if (string.Compare(device.VersionId, CommonString.VERSION_30065, false) == 0)
            {   // B-3 타입
                DataSensor sensorGAS1 = new DataSensor();
                DataSensor sensorGAS2 = new DataSensor();
                DataSensor sensorGAS3 = new DataSensor();
                DataSensor sensorGAS4 = new DataSensor();
                DataSensor sensorGAS5 = new DataSensor();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (/*sensor.SensorName == CommonString.SENSOR_GAS_NAME1*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_NAME1, false) == 0)
                    {
                        sensorGAS1.SensorName = sensor.Value;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_VAL1*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_VAL1, false) == 0)
                    {
                        sensorGAS1.SensorId = sensor.SensorId;
                        sensorGAS1.Value = sensor.Value;
                        sensorGAS1.SensorStatus = sensor.SensorStatus;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_NAME2*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_NAME2, false) == 0)
                    {
                        sensorGAS2.SensorName = sensor.Value;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_VAL2*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_VAL2, false) == 0)
                    {
                        sensorGAS2.SensorId = sensor.SensorId;
                        sensorGAS2.Value = sensor.Value;
                        sensorGAS2.SensorStatus = sensor.SensorStatus;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_NAME3*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_NAME3, false) == 0)
                    {
                        sensorGAS3.SensorName = sensor.Value;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_VAL3*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_VAL3, false) == 0)
                    {
                        sensorGAS3.SensorId = sensor.SensorId;
                        sensorGAS3.Value = sensor.Value;
                        sensorGAS3.SensorStatus = sensor.SensorStatus;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_NAME4*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_NAME4, false) == 0)
                    {
                        sensorGAS4.SensorName = sensor.Value;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_VAL4*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_VAL4, false) == 0)
                    {
                        sensorGAS4.SensorId = sensor.SensorId;
                        sensorGAS4.Value = sensor.Value;
                        sensorGAS4.SensorStatus = sensor.SensorStatus;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_NAME5*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_NAME5, false) == 0)
                    {
                        sensorGAS5.SensorName = sensor.Value;
                    }
                    else if (/*sensor.SensorName == CommonString.SENSOR_GAS_VAL5*/
                        string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_VAL5, false) == 0)
                    {
                        sensorGAS5.SensorId = sensor.SensorId;
                        sensorGAS5.Value = sensor.Value;
                        sensorGAS5.SensorStatus = sensor.SensorStatus;
                    }
                }

                // 알람 신호 체크
                if (bChkAlarm)
                {
                    CheckAlarmData(device, sensorGAS1, alarms);
                    CheckAlarmData(device, sensorGAS2, alarms);
                    CheckAlarmData(device, sensorGAS3, alarms);
                    CheckAlarmData(device, sensorGAS4, alarms);
                    CheckAlarmData(device, sensorGAS5, alarms);
                }

                // 해당 센서만 추가
                listSensorData.Add(sensorGAS1);
                listSensorData.Add(sensorGAS2);
                listSensorData.Add(sensorGAS3);
                listSensorData.Add(sensorGAS4);
                listSensorData.Add(sensorGAS5);
            }
            else if (/*device.VersionId == CommonString.VERSION_30061*/
                string.Compare(device.VersionId, CommonString.VERSION_30061, false) == 0)
            {   // C 타입 - 스크러버
                List<DataSensor> temps = new List<DataSensor>();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (/*sensor.SensorName == CommonString.ETC_Value*/
                        string.Compare(sensor.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        DataSensor sensorData = new DataSensor();
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.SensorName = CommonString.ETC_SCRUBBER;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;

                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensorData, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensorData);
                    }
                    else if (/*sensor.SensorName == CommonString.ETC_TEMP*/
                        string.Compare(sensor.SensorName, CommonString.ETC_TEMP, false) == 0)
                    {
                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensor, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }
            }
            else if (/*device.VersionId == CommonString.VERSION_32002*/
                string.Compare(device.VersionId, CommonString.VERSION_32002, false) == 0)
            {   // C 타입 - HF
                List<DataSensor> temps = new List<DataSensor>();

                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    if (/*sensor.SensorName == CommonString.ETC_Value*/
                        string.Compare(sensor.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        DataSensor sensorData = new DataSensor();
                        sensorData.SensorId = sensor.SensorId;
                        sensorData.SensorName = CommonString.PSM_HF;
                        sensorData.Value = sensor.Value;
                        sensorData.SensorStatus = sensor.SensorStatus;

                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensorData, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensorData);
                    }
                    else if (/*sensor.SensorName == CommonString.ETC_BATTERY ||
                        sensor.SensorName == CommonString.ETC_OPERATION*/
                        string.Compare(sensor.SensorName, CommonString.ETC_BATTERY, false) == 0 ||
                        string.Compare(sensor.SensorName, CommonString.ETC_OPERATION, false) == 0)
                    {
                        // 알람 신호 체크
                        if (bChkAlarm)
                            CheckAlarmData(device, sensor, alarms);
                        // 해당 센서만 추가
                        listSensorData.Add(sensor);
                    }
                }
            }
            else
            {   // A 타입
                for (int i = 0; i < jArrSensor.Count; i++)
                {
                    JObject jSensor = (JObject)jArrSensor[i];

                    DataSensor sensor = new DataSensor
                    {
                        SensorId = jSensor["sensorId"].ToString().Trim(),
                        SensorName = jSensor["sensorName"].ToString().Trim(),
                        ModelName = jSensor["modelName"].ToString().Trim(),
                        SensorStatus = jSensor["sensorStatus"].ToString().Trim(),
                        Value = jSensor["value"].ToString().Trim()
                    };

                    // VERSION_31007 디바이스의 센서 타입 명칭이 기존 명칭과 다르다. 변환 작업
                    if (/*device.VersionId == CommonString.VERSION_31007*/
                        string.Compare(device.VersionId, CommonString.VERSION_31007, false) == 0)
                        sensor.SensorName = CommonString.ChangeSensorType(sensor.SensorName);

                    // 알람 신호 체크
                    if (bChkAlarm)
                        CheckAlarmData(device, sensor, alarms);
                    // 해당 센서만 추가
                    listSensorData.Add(sensor);
                }
            }

            return listSensorData;
        }

        //private async System.Threading.Tasks.Task<bool> CheckAlarmData(DataDevice device, DataSensor sensor, List<AlarmData> alarms)
        private bool CheckAlarmData(DataDevice device, DataSensor sensor, List<AlarmData> alarms)
        {
            // 디버깅용,센서값,mA,접점,릴레이,가스종류,MAC,TYPE,GW_ID,종류,측정종류,기기상태,에러상태,통신상태 센서는 알람체크 제외 
            if (string.Compare(sensor.ModelName, CommonString.MODEL_DEBUGGING, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_RESULT, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.ETC_mA, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.ETC_Contact, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.ETC_Relay, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_GAS_TYPE, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.ETC_CONNECT, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_MAC, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_TYPE, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_GW_ID, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_KIND, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_MEASURE, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.DEVICE_STATUS, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_ERROR, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.SENSOR_CH_NUM, false) == 0 ||
                string.Compare(sensor.SensorName, CommonString.ETC_BLE_Count, false) == 0 )
                return true;


            // TODO: 센서 알람 테스트
            //if (device.DeviceId == "BERRY40MG-00001" && sensor.SensorName == "TVOC")
            //{
            //    Console.WriteLine(device.DeviceName);
            //    sensor.SensorStatus = CommonString.STATUS_WARNING;
            //}

            AlarmData alarm = null;

            if (alarms != null && alarms.Count > 0)
                alarm = alarms.Find(x => x.DeviceID == (device.DeviceId + "_" + sensor.SensorName));
            

            // 알람 리스트 중 복귀된 신호 확인
            if (alarm != null && (sensor.SensorStatus == CommonString.STATUS_NORMAL || sensor.SensorStatus == CommonString.STATUS_OFFLINE))
            {
                AlarmData _alarmData = m_wsopDataMgr.GetAlarmData(device, sensor);
                if (_alarmData != null)
                {
                    alarm.IsAlarm = false;

                    ArrayList arrData = new ArrayList();
                    arrData.Add(_alarmData.SensorType);
                    arrData.Add(_alarmData.SensorTagID);
                    arrData.Add(_alarmData.SensorZoneID);
                    arrData.Add(_alarmData.IsAlarm);

                    // 알람 신호 전송
                    // TODO: 현재 알람 단계 관련 데이터가 빠짐
                    if (m_SopQueryMgr.SendAlarmQuery(arrData, CommonString.ALARM_METHOD, _alarmData.URL) == false)
                    {
                        Logger.Instance.Write("SendAlarmQuery Error (SensorType: " + _alarmData.SensorType.ToString() + ", SensorTagID: " + _alarmData.SensorTagID.ToString() + ", SensorZoneID: " + _alarmData.SensorZoneID.ToString() +
                               ", IsAlarm: " + _alarmData.IsAlarm.ToString() + ")");
                        return false;
                    }

                    // 알람 로그 작성
                    WriteAlarmLog(device, sensor, false);
                }
            }

            if (sensor.SensorStatus == CommonString.STATUS_CAUTION || sensor.SensorStatus == CommonString.STATUS_WARNING)
            {
                // 알람 발생일 경우 여기서 판단하지 말고 일단 서버로 알람 전송
                AlarmData alarmData = m_wsopDataMgr.GetAlarmData(device, sensor);
                if (alarmData != null)
                {
                    alarmData.IsAlarm = true;

                    ArrayList arrData = new ArrayList();
                    arrData.Add(alarmData.SensorType);
                    arrData.Add(alarmData.SensorTagID);
                    arrData.Add(alarmData.SensorZoneID);
                    arrData.Add(alarmData.IsAlarm);

                    if (sensor.SensorStatus == CommonString.STATUS_CAUTION)
                    {
                        int nAlarmLevel = CommonString.LEVEL_CAUTION;
                        arrData.Add(nAlarmLevel);
                    }
                    else if (sensor.SensorStatus == CommonString.STATUS_WARNING)
                    {
                        int nAlarmLevel = CommonString.LEVEL_WARNING;
                        arrData.Add(nAlarmLevel);
                    }
                    else
                    {
                        int nAlarmLevel = CommonString.LEVEL_CAUTION;
                        arrData.Add(nAlarmLevel);
                    }

                    // 알람 신호 전송
                    if (m_SopQueryMgr.SendAlarmQuery(arrData, CommonString.ALARM_METHOD, alarmData.URL) == false)
                    {
                        Logger.Instance.Write("SendAlarmQuery Error (SensorType: " + alarmData.SensorType.ToString() + ", SensorTagID: " + alarmData.SensorTagID.ToString() + ", SensorZoneID: " + alarmData.SensorZoneID.ToString() +
                               ", IsAlarm: " + alarmData.IsAlarm.ToString() + ")");
                        return false;
                    }

                    // 알람 로그 작성
                    WriteAlarmLog(device, sensor, true);
                }
            }
            
            return true;
        }

        //public async System.Threading.Tasks.Task<bool> SendAlarmSensorData(List<AlarmSensorData> alarmSensors)
        public bool SendAlarmSensorData(List<AlarmSensorData> alarmSensors)
        {
            // 이 함수를 비동기로 만든다.
            //await System.Threading.Tasks.Task.Yield();

            if (alarmSensors == null)
                return false;

            foreach (AlarmSensorData alarmSensorData in alarmSensors)
            {
                AlarmData alarmData = m_wsopDataMgr.GetAlarmData(alarmSensorData);
                if (alarmData != null)
                {
                    ArrayList arrData = new ArrayList();
                    arrData.Add(alarmData.SensorType);
                    arrData.Add(alarmData.SensorTagID);
                    arrData.Add(alarmData.SensorZoneID);
                   

                    if (alarmSensorData.SensorStatus == CommonString.STATUS_NORMAL)
                    {
                        alarmData.IsAlarm = false;
                        arrData.Add(alarmData.IsAlarm);
                    }
                    else if (alarmSensorData.SensorStatus == CommonString.STATUS_CAUTION)
                    {
                        alarmData.IsAlarm = true;
                        arrData.Add(alarmData.IsAlarm);

                        int nAlarmLevel = CommonString.LEVEL_CAUTION;
                        arrData.Add(nAlarmLevel);
                    }
                    else if (alarmSensorData.SensorStatus == CommonString.STATUS_WARNING)
                    {
                        alarmData.IsAlarm = true;
                        arrData.Add(alarmData.IsAlarm);

                        int nAlarmLevel = CommonString.LEVEL_WARNING;
                        arrData.Add(nAlarmLevel);
                    }
                    else
                    {
                        alarmData.IsAlarm = true;
                        arrData.Add(alarmData.IsAlarm);

                        int nAlarmLevel = CommonString.LEVEL_CAUTION;
                        arrData.Add(nAlarmLevel);
                    }

                    // 알람 신호 전송
                    if (m_SopQueryMgr.SendAlarmQuery(arrData, CommonString.ALARM_METHOD, alarmData.URL) == false)
                    {
                        Logger.Instance.Write("SendAlarmQuery Error (SensorType: " + alarmData.SensorType.ToString() + ", SensorTagID: " + alarmData.SensorTagID.ToString() + ", SensorZoneID: " + alarmData.SensorZoneID.ToString() +
                               ", IsAlarm: " + alarmData.IsAlarm.ToString() + ")");
                        return false;
                    }

                    // 알람 로그 작성
                    WriteAlarmLog(alarmSensorData, alarmData.IsAlarm);
                }
            }

            return true;
        }

        private void WriteAlarmLog(AlarmSensorData alarmSensorData, bool bIsRun)
        {
            // 로그 체크
            string strUniqueKey = alarmSensorData.UniqueKey;
            string strSensorStatus = alarmSensorData.SensorStatus;
            string strAlarmLog = "";

            if (bIsRun == true)
            {   // 알람 발생
                strAlarmLog = string.Format("{0} {1} 알람이 발생하였습니다.", strUniqueKey, strSensorStatus);
            }
            else
            {   // 알람 중지
                strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
            }

            // 로그 작성
            Logger.Instance.Write(strAlarmLog);
        }

        private void WriteAlarmLog(DataDevice device, DataSensor sensor, bool bIsRun)
        {
            // 로그 체크
            string strUniqueKey = device.DeviceId + "_" + sensor.SensorName;

            string strSensorStatus = sensor.SensorStatus;

            string strAlarmLog = "";


            if (m_dicAlarmLogChk.ContainsKey(strUniqueKey) == false)
            {   // 처음 작성
                m_dicAlarmLogChk[strUniqueKey] = bIsRun;

                if (bIsRun == true)
                {   // 알람 발생
                    strAlarmLog = string.Format("{0} {1} 알람이 발생하였습니다.", strUniqueKey, strSensorStatus);
                }
                else
                {   // 알람 중지
                    strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
                }

                // 로그 작성
                Logger.Instance.Write(strAlarmLog);
            }
            else
            {
                bool bAlarmLogChk = m_dicAlarmLogChk[strUniqueKey];

                if (bIsRun != bAlarmLogChk)
                {   // 상태 변화
                    m_dicAlarmLogChk[strUniqueKey] = bIsRun;

                    if (bIsRun == true)
                    {   // 알람 발생
                        strAlarmLog = string.Format("{0} {1} 알람이 발생하였습니다.", strUniqueKey, strSensorStatus);
                    }
                    else
                    {   // 알람 중지
                        strAlarmLog = string.Format("{0} 알람이 중지되었습니다.", strUniqueKey);
                    }

                    // 로그 작성
                    Logger.Instance.Write(strAlarmLog);
                }
            }
        }


        public List<AlarmSensorData> RequestEventList()
        {
            List<AlarmRecord> eventList = null;
            List<AlarmSensorData> alarmSensors = null;

            // 로그인 실패로 인해서 토큰 값이 없음.
            if (m_strToken == null)
                return alarmSensors;

            try
            {
                // Device List 요청 정보 작성
                StringBuilder sb = new StringBuilder();

                // 오늘 날짜
                // 이벤트 타입은 주의 또는 경계
                // 0 페이지 1000 사이즈 조회
                //sb.AppendFormat("/api/deviceext/event/list?page=0&size=1000&sort&eventType=ALL_ALARM&optDeviceGroupName=false&optDeviceName=false&optDeviceId=false&optUserId=false&optSubOrganization=true&startDate={0}&endDate={0}", DateTime.Now.ToString("yyyy-MM-dd"));
                sb.AppendFormat("/api/deviceext/event/list?page=0&size=20&sort&optDeviceGroupName=false&optDeviceName=false&optDeviceId=false&optUserId=false&optSubOrganization=true&startDate={0}&endDate={0}", DateTime.Now.ToString("yyyy-MM-dd"));

                string strErrorMessage = null;

                Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
                dicHeaders.Add(CommonString.Header_Authorization, "Bearer " + m_strToken);

                string strJson = null;

                // Event List REST API 요청
                string strResult = SendQuery(dicHeaders, strJson, sb.ToString(), out strErrorMessage);

                if (strErrorMessage == CommonString.SUCESS)
                {
                    // 디바이스 조회 성공
                    JObject jResult = JObject.Parse(strResult);
                    JArray jArrContents = (JArray)jResult["content"];

                    eventList = new List<AlarmRecord>();
                    alarmSensors = new List<AlarmSensorData>();

                    // 조회된 데이터가 없음
                    if (jArrContents == null || jArrContents.Count == 0)
                        return alarmSensors;

                    int nMaxRecordID = 0;
                    DateTime dtNow = DateTime.Now;

                    if ((dtNow - m_dtChkDay).TotalHours > 1)
                    {   // 한 시간 지나면 MaxRecordID 초기화
                        m_dtChkDay = dtNow;
                        m_nMaxRecordID = 0;
                    }

                    // 디바이스 리스트 생성
                    for (int i = 0; i < jArrContents.Count; i++)
                    {
                        JObject jContent = (JObject)jArrContents[i];

                        if (int.TryParse(jContent["recordId"].ToString().Trim(), out int nRecordID) == false)
                            continue;

                        // 전에 읽었던 기록은 제외
                        if (nRecordID <= m_nMaxRecordID)
                            continue;
                        else if (nMaxRecordID < nRecordID)
                            nMaxRecordID = nRecordID;



                        string strSensorName = null;
                        if (jContent["sensorName"] != null)
                            strSensorName = jContent["sensorName"].ToString().Trim();
                        else
                            Console.WriteLine("strSensorName null");

                        string strTimeCreated = jContent["timeCreated"].ToString().Trim();
                        string strEventType = jContent["eventType"].ToString().Trim();
                        string strSensorStatus = jContent["sensorStatus"].ToString().Trim();
                        DateTime dtTimeCreated = DateTime.Parse(strTimeCreated);

                        // 통신상태, 오프라인 제외
                        if (strSensorName == null || strSensorName == CommonString.ETC_CONNECT || 
                            strEventType == CommonString.ETC_OFFLINE || strSensorStatus == CommonString.STATUS_OFFLINE ||
                             (dtTimeCreated - m_dtCreate).TotalSeconds < 0)
                            continue;

                        
                        AlarmRecord alarmRecord = new AlarmRecord
                        {
                            RecordId = nRecordID,
                            DeviceId = jContent["deviceId"].ToString().Trim(),
                            DeviceName = jContent["deviceName"].ToString().Trim(),
                            SensorName = jContent["sensorName"].ToString().Trim(),
                            EventType = jContent["eventType"].ToString().Trim(),
                            VersionName = jContent["versionName"].ToString().Trim(),
                            SensorStatus = jContent["sensorStatus"].ToString().Trim(),
                        };

                        eventList.Add(alarmRecord);
                    }

                    // 최근 읽은 ID 값으로 업데이트
                    if (nMaxRecordID > 0)
                        m_nMaxRecordID = nMaxRecordID;


                    if (eventList.Count > 0)
                        alarmSensors = GetAlarmSensorList(eventList);

                }
                else
                {
                    Logger.Instance.Write("Event List REST API 실패. (" + strErrorMessage + ")");
                    return null;
                }
            }
            catch (Exception e)
            {
                Logger.Instance.Write("RequestEventList 예외발생 . (" + e.Message + ")");
                return null;
            }

            

            return alarmSensors;
        }


        private List<AlarmSensorData> GetAlarmSensorList(List<AlarmRecord> eventList)
        {
            if (eventList == null)
                return null;
            else if (eventList.Count == 0)
                return new List<AlarmSensorData>();


            Dictionary<string, AlarmSensorData> dicAlarmSensors = new Dictionary<string, AlarmSensorData>();

            // 역순으로 >> eventList는 최근 순으로 정렬되어 있음
            int nStartNum = eventList.Count - 1;
            //foreach (AlarmRecord record in eventList)
            for (int i = nStartNum; i >= 0; i--)
            {
                AlarmRecord record = eventList[i];

                if (string.Compare(record.VersionName, CommonString.VERSION_30063_NAME, false) == 0 ||
                    string.Compare(record.VersionName, CommonString.VERSION_32001_NAME, false) == 0 ||
                    string.Compare(record.VersionName, CommonString.VERSION_32003_NAME, false) == 0 ||
                    string.Compare(record.SensorName, CommonString.ETC_CONNECT, false) == 0)
                    continue;

                AlarmSensorData alarmSensor = null;

                // sensor_key 구하기
                // sensorType 구하기
                // sensor status 구하기

                // 버전명에 따라 분류
                if (string.Compare(record.VersionName, CommonString.VERSION_30056_NAME, false) == 0 ||
                    string.Compare(record.VersionName, CommonString.VERSION_31007_NAME, false) == 0 ||
                    string.Compare(record.VersionName, CommonString.VERSION_31008_NAME, false) == 0)
                {
                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat("{0}_{1}", record.DeviceId, record.DeviceName);
                    string strUniqueKey = sb.ToString();

                    int? nFacilityTypeID = null;

                    if (CommonString.IsPSMSensorType(record.SensorName))
                        nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;
                    else if (CommonString.IsETCSensorType(record.SensorName))
                        nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.ETC;

                    alarmSensor = new AlarmSensorData {
                        FacilityType = nFacilityTypeID,
                        UniqueKey = strUniqueKey,
                        SensorStatus = record.SensorStatus,
                        DeviceId = record.DeviceId,
                        VersionName = record.VersionName
                    };
                }
                //else if (string.Compare(record.VersionName, CommonString.VERSION_30061_NAME, false) == 0)
                //{
                //    // 디바이스가 조회되지 않음
                //}
                else if (string.Compare(record.VersionName, CommonString.VERSION_30064_NAME, false) == 0 ||
                    string.Compare(record.VersionName, CommonString.VERSION_32004_NAME, false) == 0 ||
                    string.Compare(record.VersionName, CommonString.VERSION_32006_NAME, false) == 0)
                {
                    // 수치만 알람으로 인정
                    if (string.Compare(record.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        int nIdx = record.DeviceId.IndexOf("_");
                        if (nIdx == -1)
                            continue;

                        string strSensorName = record.DeviceId.Substring(0, nIdx);
                        if (strSensorName == CommonString.ETC_FLAME)
                            strSensorName = CommonString.ETC_Flame;

                        StringBuilder sb = new StringBuilder();
                        sb.AppendFormat("{0}_{1}", record.DeviceId, strSensorName);
                        string strUniqueKey = sb.ToString();

                        int? nFacilityTypeID = null;
                        if (CommonString.IsPSMSensorType(strSensorName))
                            nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;
                        else if (CommonString.IsETCSensorType(strSensorName))
                            nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.ETC;

                        alarmSensor = new AlarmSensorData
                        {
                            FacilityType = nFacilityTypeID,
                            UniqueKey = strUniqueKey,
                            SensorStatus = record.SensorStatus,
                            DeviceId = record.DeviceId,
                            VersionName = record.VersionName
                        };
                    }
                }
                //else if (string.Compare(record.VersionName, CommonString.VERSION_30065_NAME, false) == 0)
                //{
                //    // 디바이스가 조회되지 않음
                //}
                else if (string.Compare(record.VersionName, CommonString.VERSION_32002_NAME, false) == 0)
                {
                    int? nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;

                    StringBuilder sb = new StringBuilder();
                    sb.AppendFormat("{0}_{1}", record.DeviceId, CommonString.PSM_HF);
                    string strUniqueKey = sb.ToString();

                    alarmSensor = new AlarmSensorData
                    {
                        FacilityType = nFacilityTypeID,
                        UniqueKey = strUniqueKey,
                        SensorStatus = record.SensorStatus,
                        DeviceId = record.DeviceId,
                        VersionName = record.VersionName
                    };
                }
                else if (string.Compare(record.VersionName, CommonString.VERSION_32005_NAME, false) == 0)
                {
                    // 수치일 경우
                    if (string.Compare(record.SensorName, CommonString.ETC_Value, false) == 0)
                    {
                        int nIdx = record.DeviceId.IndexOf("_");
                        if (nIdx == -1)
                            continue;

                        string strSensorName = record.DeviceId.Substring(0, nIdx);

                        StringBuilder sb = new StringBuilder();
                        sb.AppendFormat("{0}_{1}", record.DeviceId, strSensorName);
                        string strUniqueKey = sb.ToString();

                        int? nFacilityTypeID = null;
                        if (CommonString.IsPSMSensorType(strSensorName))
                            nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.PSM_SENSOR;
                        else if (CommonString.IsETCSensorType(strSensorName))
                            nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.ETC;

                        alarmSensor = new AlarmSensorData
                        {
                            FacilityType = nFacilityTypeID,
                            UniqueKey = strUniqueKey,
                            SensorStatus = record.SensorStatus,
                            DeviceId = record.DeviceId,
                            VersionName = record.VersionName
                        };
                    }
                    else if (string.Compare(record.SensorName, CommonString.ETC_WATER_TEMP, false) == 0)
                    {
                        int? nFacilityTypeID = (int)dnsData.Sensor.Facility.FacilityType.ETC;

                        StringBuilder sb = new StringBuilder();
                        sb.AppendFormat("{0}_{1}", record.DeviceId, CommonString.ETC_WATER_TEMP);
                        string strUniqueKey = sb.ToString();

                        alarmSensor = new AlarmSensorData
                        {
                            FacilityType = nFacilityTypeID,
                            UniqueKey = strUniqueKey,
                            SensorStatus = record.SensorStatus,
                            DeviceId = record.DeviceId,
                            VersionName = record.VersionName
                        };
                    }
                }


                if (alarmSensor != null)
                    dicAlarmSensors[alarmSensor.UniqueKey] = alarmSensor;
            }

            return dicAlarmSensors.Values.ToList();
        }



        // 조회된 모든 디바이스의 센서 데이터를 조회
        public bool RequestAllSensorData()
        {
            // 조회된 디바이스가 없음
            if (m_dicDevices == null || m_dicDevices.Count == 0)
                return false;

            foreach (KeyValuePair<string, DataDevice> pair in m_dicDevices)
            {
                DataDevice device = pair.Value;

                if (!RequestSensorData(device))
                    return false;
            }

            return true;
        }

        // 계정 리스트 조회
        public bool RequestAccountList()
        {
            // 로그인 실패로 인해서 토큰 값이 없음.
            if (m_strToken == null)
                return false;

            // Device List 요청 정보 작성
            string strURL = "/api/accountext/list";        
            string strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(CommonString.Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device List REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

            if (strErrorMessage == CommonString.SUCESS)
            {
                // 계정 조회 성공
                JObject jResult = JObject.Parse(strResult);
                JArray jArrMembers = (JArray)jResult["content"];

                // 조회된 계정이 없음
                if (jArrMembers == null || jArrMembers.Count == 0)
                    return false;

                List<MemberData> ListMembers = new List<MemberData>();

                // 계정 리스트 생성
                for (int i = 0; i < jArrMembers.Count; i++)
                {
                    JObject jMember = (JObject)jArrMembers[i];

                    // 파주 공장은 제외
                    if (jMember["belongOrgName"].ToString().Trim() == CommonString.FACT_PAJU)
                        continue;

                    MemberData member = null;

                    member = new MemberData();
                    member.ID = jMember["userId"].ToString().Trim();
                    member.Name = jMember["userName"].ToString().Trim();
                    member.BelongorgName = jMember["belongOrgName"].ToString().Trim();
                    member.TeamName = jMember["teamName"].ToString().Trim();
                    member.Mobile = jMember["mobile"].ToString().Trim();
                    member.Email = jMember["email"].ToString().Trim();

                    m_dicMembers[member.ID] = member;
                }
            }
            else
            {
                return false;
            }

            return true;
        }


        /// <summary>
        /// Device 정보 및 임계치 조회
        /// </summary>
        /// <param name="dicDevices">Device 리스트</param>
        /// <returns></returns>
        public bool UpdateSensorInfos(Dictionary<string, DataDevice> dicDevices)
        {
            if (dicDevices == null || dicDevices.Count == 0)
                return false;
           
            foreach (KeyValuePair<string, DataDevice> pair in dicDevices)
            {
                DataDevice device = pair.Value;

                // 디바이스 정보 불러오기
                if (RequestSensorData(device) == false)
                    return false;

                // 디바이스 해당 센서 임계치 정보 불러오기
                if (RequestSensorThreshold(device) == false)
                    return false;
            }

            return true;
        }


        public bool RequestSensorThreshold(DataDevice device)
        {
            // Device Sensor Data 요청 정보 작성
            string strURL = "/api/ruleext/threshold/" + device.DeviceId;
            string strErrorMessage = null;

            Dictionary<string, string> dicHeaders = new Dictionary<string, string>();
            dicHeaders.Add(CommonString.Header_Authorization, "Bearer " + m_strToken);

            string strJson = null;

            // Device Sensor Data REST API 요청
            string strResult = SendQuery(dicHeaders, strJson, strURL, out strErrorMessage);

            if (strErrorMessage == CommonString.SUCESS)
            {   // Device Sensor Data 조회 성공
                JArray jArrSensor = JArray.Parse(strResult);

                // 조회된 Sensor Data가 없음
                if (jArrSensor == null || jArrSensor.Count == 0)
                    return false;

                // 임계치 값 해당 센서에 넣기
                UpdateSensorThreshold(device, jArrSensor);



            }
            else
            {
                //Console.WriteLine("Device Sensor Threshold REST API 실패. (Device ID: " + device.DeviceId + ", ErrorMessage: " + strErrorMessage + ")");
                Logger.Instance.Write("Device Sensor Threshold REST API 실패. (Device ID: " + device.DeviceId + ", ErrorMessage: " + strErrorMessage + ")");
                return false;
            }

            return true;
        }


        private bool UpdateSensorThreshold(DataDevice device, JArray jArrSensor)
        {
            if (device == null || device.SensorDataList == null || device.SensorDataList.Count == 0 ||
                jArrSensor == null)
                return false;

            for (int i = 0; i < jArrSensor.Count; i++)
            {
                JObject jSensor = (JObject)jArrSensor[i];

                DataSensor sensor = new DataSensor();
                sensor.SensorId = jSensor["sensorId"].ToString().Trim();
                sensor.SensorName = jSensor["sensorName"].ToString().Trim();
                sensor.ModelName = jSensor["modelName"].ToString().Trim();

                sensor.NormalRange = jSensor["normalRange"].ToString().Trim();
                sensor.CautionRange = jSensor["cautionRange"].ToString().Trim();
                sensor.WarningRange = jSensor["warningRange"].ToString().Trim();


                DataSensor listSensor = device.SensorDataList.Find(x => x.SensorId == sensor.SensorId);

                if (listSensor != null)
                {
                    string strNormalRange = sensor.NormalRange;
                    string strCautionRange = sensor.CautionRange;
                    string strWarningRange = sensor.WarningRange;

                    // .TODO: 임시 로그 기록
                    //if (strNormalRange != "")
                    //{
                    //    Logger.Instance.Write("Device: " + device.DeviceId + ", 솔브레인 닷컴 임계치값(Normal: " + strNormalRange + 
                    //        ", Caution: " + strCautionRange + ", Warning: " + strWarningRange + ")");
                    //}

                    if (strNormalRange.Contains("~") == true)
                    {   // 범위값  >> 숫자값
                        int idx = strNormalRange.IndexOf("~");

                        if (idx != -1)
                        {
                            string strTemp1 = strNormalRange.Substring(0, idx);
                            string strTemp2 = strNormalRange.Substring(idx + 1);

                            if (float.TryParse(strTemp1, out float fTemp1) && float.TryParse(strTemp2, out float fTemp2))
                            {
                                // 중간값 구하기
                                float fTemp3 = fTemp2 - fTemp1;
                                fTemp3 = fTemp3 / 2;
                                fTemp3 = fTemp1 + fTemp3;

                                strNormalRange = fTemp3.ToString("F2");
                            }
                        }
                    }

                    if (strCautionRange.Contains("~") == true)
                    {   // 범위값  >> 숫자값
                        int idx = strCautionRange.IndexOf("~");

                        if (idx != -1)
                        {
                            string strTemp1 = strCautionRange.Substring(0, idx);
                            string strTemp2 = strCautionRange.Substring(idx + 1);

                            if (float.TryParse(strTemp1, out float fTemp1) && float.TryParse(strTemp2, out float fTemp2) && float.TryParse(strNormalRange, out float fNormalRange))
                            {
                                if (fNormalRange < fTemp2)
                                {   // 기준값보다 임계치가 클 경우
                                    strCautionRange = fTemp1.ToString("F2");
                                }
                                else
                                {   // 기준값보다 임계치가 작을 경우
                                    strCautionRange = fTemp2.ToString("F2");
                                }
                            }
                        }
                    }

                    if (strWarningRange.Contains("~") == true)
                    {   // 범위값  >> 숫자값
                        int idx = strWarningRange.IndexOf("~");

                        if (idx != -1)
                        {
                            string strTemp1 = strWarningRange.Substring(0, idx);
                            string strTemp2 = strWarningRange.Substring(idx + 1);

                            if (float.TryParse(strTemp1, out float fTemp1) && float.TryParse(strTemp2, out float fTemp2) && float.TryParse(strNormalRange, out float fNormalRange))
                            {
                                if (fNormalRange < fTemp2)
                                {   // 기준값보다 임계치가 클 경우
                                    strWarningRange = fTemp1.ToString("F2");
                                }
                                else
                                {   // 기준값보다 임계치가 작을 경우
                                    strWarningRange = fTemp2.ToString("F2");
                                }
                            }
                        }
                    }

                    //if (strNormalRange != "")
                    //{
                    //    Logger.Instance.Write("Device: " + device.DeviceId + ", DB 임계치값(Normal: " + strNormalRange +
                    //        ", Caution: " + strCautionRange + ", Warning: " + strWarningRange + ")\n");
                    //}

                    // .TODO: 임시 로그 기록
                    listSensor.NormalRange = strNormalRange;
                    listSensor.CautionRange = strCautionRange;
                    listSensor.WarningRange = strWarningRange;
                }
            }

            return true;
        }










        private string SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
        {
            strErrorMessage = "";
            string url = BaseAddress;

            if (strURL.StartsWith("/"))
                url += strURL;
            else
                url += "/" + strURL;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(url));
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

            string strResponse = "";

            try
            {
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
                strErrorMessage = ex.Status.ToString();
                return "";
            }

            if (strResponse == null)
            {
                strErrorMessage = "Request 실패";
                return "";
            }

            strErrorMessage = CommonString.SUCESS;
            return strResponse;
        }
    }
}
