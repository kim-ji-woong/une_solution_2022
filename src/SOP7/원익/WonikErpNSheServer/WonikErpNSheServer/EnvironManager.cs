using Dashboard.Model;
using dnsCommunicateSopServer;
using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WonikErpNSheServer
{
    public class EnvironManager
    {
        private DirectDBManager m_environDBManager = null;
        private DBDataManager m_dbDataManager = null;

        private Dictionary<string, string> m_dicEnvironAlarms = new Dictionary<string, string>();
        private Dictionary<string, EnvironmentSensorData> m_dicEnvironmentSensors = null;

        private SopQueryManager m_sopQueryMgr = null;
        private string m_strEnvironAlarmURL = null;

        public Logger Logger { get; set; }

        Thread m_thread = null;
        private bool m_runThread = false;

        public EnvironManager(DirectDBManager environDBManager, DBDataManager dbDataManager)
        {
            m_environDBManager = environDBManager;
            m_dbDataManager = dbDataManager;

            m_sopQueryMgr = new SopQueryManager();
            this.Logger = Logger.Instance.Clone("LOG_Environ");

            Init();            
        }

        private void Init()
        {
            string strEnvironAlarmURL = ConfigurationManager.AppSettings.Get("EnvironAlarmURL");
            if (strEnvironAlarmURL == null || strEnvironAlarmURL.Length == 0)
                strEnvironAlarmURL = "http://127.0.0.1:44379/api/EnvironmentSensor";

            m_strEnvironAlarmURL = strEnvironAlarmURL;

            Dictionary<string, EnvironmentSensorData> dicEnvironmentSensors = m_dbDataManager.LoadSensors(dnsData.Sensor.Facility.FacilityType.Environment, out string strErrorMessage);
            if (dicEnvironmentSensors == null)            
                this.Logger.Write("Init 오류: " + strErrorMessage);            
            else           
                m_dicEnvironmentSensors = dicEnvironmentSensors;            
        }

        public void Start()
        {
            if (m_runThread)
                return;

            this.Logger.Write("EnvironManager Start()");

            m_runThread = true;

            m_thread = new Thread(new ThreadStart(RequestThread));
            m_thread.Start();

        }

        public void Stop()
        {
            if (!m_runThread)
                return;

            this.Logger.Write("EnvironManager Stop()");

            m_runThread = false;
            m_thread.Abort();
        }

        private void RequestThread()
        {
            while (m_runThread)
            {               
                try
                {
                    string strErrorMessage;

                    // 알람정보 읽어오기
                    Dictionary<string, string> dicEnvironAlarms = GetEnvironAlarm(out strErrorMessage);
                    if (dicEnvironAlarms == null)
                    {
                        this.Logger.Write(strErrorMessage);
                        Thread.Sleep(1000 * 60);
                        continue;
                    }

                    // 알람체크
                    if (CheckEnvironAlarm(dicEnvironAlarms, out strErrorMessage) == false)
                    //if (CheckEnvironAlarm2(dicEnvironAlarms, out strErrorMessage) == false)
                    {
                        this.Logger.Write(strErrorMessage);
                        Thread.Sleep(1000 * 60);
                        continue;
                    }

                    Thread.Sleep(100 * 5);
                }
                catch (Exception ex)
                {
                    this.Logger.Write("[ERROR] RequestThread() Exception : " + ex.Message);
                }
            }
        }


        public Dictionary<string, string> GetEnvironAlarm(out string strErrorMessage)
        {
            strErrorMessage = "";
            Dictionary<string, string> dicEnvironAlarms = null;
            DateTime dtNow = DateTime.Now;

            // HMI_YN: 업데이트 유무 확인값 (HMI 데이터를 기록하면 Y, 우리 쪽에서 데이터를 읽으면 N 값으로 업데이트)
            // PV: 알람 유무 확인값(0: 정상, 1: 알람)
            string strSQL = string.Format("Select DATETIME, HMI_ID, TAG_ID, HMI_YN, PV From CAMPUS_HMI_ALARM_PV Where PV = 1");
            //string strSQL = string.Format("Select DATETIME, HMI_ID, TAG_ID, HMI_YN, PV From CAMPUS_HMI_ALARM_PV Where PV = 1 And HMI_YN = 'N'");

            ArrayList arrResult = m_environDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = "1. GetEnvironAlarm Error (CAMPUS_HMI_ALARM_PV 테이블을 조회 할 수 없습니다.)";
                return null;
            }



            // HMI_YN 업데이트
            strSQL = $"UPDATE CAMPUS_HMI_ALARM_PV SET HMI_YN = 'Y' Where HMI_YN = 'N'";
            ArrayList arrResult2 = m_environDBManager.GetResultData(strSQL);
            if (arrResult2 == null)
            {
                strErrorMessage = m_environDBManager.LastErrorMessage;
                return null;
            }




            dicEnvironAlarms = new Dictionary<string, string>();

            int nCount = arrResult.Count;

            for (int i = 0; i < nCount - 4; i += 5)
            {
                //string strDATETIME = WebDBManager.GetDateTimeField(arrResult[i].ToString());
                VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[i]);                
                string strHMI_ID = WebDBManager.GetStringField(arrResult[i + 1].ToString());
                string strTAG_ID = WebDBManager.GetStringField(arrResult[i + 2].ToString());
                string strHMI_YN = WebDBManager.GetStringField(arrResult[i + 3].ToString());
                int nPV = WebDBManager.GetIntField(arrResult[i + 4].ToString(), 0);


                if (data == null)
                    continue;

                DateTime dtDATETIME = data.Data;

                TimeSpan span = dtNow - dtDATETIME;

                if (span.TotalMinutes >= 3.0)
                {
                    strSQL = $"UPDATE CAMPUS_HMI_ALARM_PV Set PV = 0 Where HMI_ID = '{strHMI_ID}' And TAG_ID = '{strTAG_ID}'";

                    arrResult2 = m_environDBManager.GetResultData(strSQL);
                    if (arrResult2 == null)
                    {
                        strErrorMessage = m_environDBManager.LastErrorMessage;
                        return null;
                    }
                }

                strTAG_ID += "_" + strHMI_ID;

                dicEnvironAlarms[strTAG_ID] = strTAG_ID;
            }


            return dicEnvironAlarms;
        }

        public bool CheckEnvironAlarm(Dictionary<string, string> dicEnvironAlarms, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (dicEnvironAlarms == null)
            {
                strErrorMessage = "EnvironAlarmData 값이 올바르지 않습니다.";
                return false;
            }

            Dictionary<string, string> dicAddAlarms = new Dictionary<string, string>();
            Dictionary<string, string> dicRemoveAlarms = new Dictionary<string, string>();

            foreach (KeyValuePair<string, string> pair in dicEnvironAlarms)
            {
                string strTag = pair.Key;

                if (m_dicEnvironAlarms.ContainsKey(strTag) == false)
                    dicAddAlarms[strTag] = strTag;
            }

            foreach (KeyValuePair<string, string> pair in m_dicEnvironAlarms)
            {
                string strTag = pair.Key;

                if (dicEnvironAlarms.ContainsKey(strTag) == false)
                    dicRemoveAlarms[strTag] = strTag;
            }

            m_dicEnvironAlarms = dicEnvironAlarms;

            foreach (KeyValuePair<string, string> pair in dicAddAlarms)
            {
                string strTag = pair.Key;

                // 해당 센서 찾기
                if (m_dicEnvironmentSensors.ContainsKey(strTag))
                {
                    EnvironmentSensorData sensorData = m_dicEnvironmentSensors[strTag];

                    // 알람 발생
                    bool bIsAlarm = true;
                    int nAlarmLevel = 2;

                    ArrayList arrData = new ArrayList();
                    arrData.Add((int)dnsData.Sensor.Facility.FacilityType.Environment);
                    arrData.Add(sensorData.TagInfoID);
                    arrData.Add(sensorData.SensorZoneID);
                    arrData.Add(bIsAlarm);
                    arrData.Add(nAlarmLevel);

                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strEnvironAlarmURL) == false)
                    {
                        strErrorMessage = $"1. SendAlarmQuery 실패 (Name: {sensorData.ETC.Name}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID})";
                        return false;
                    }
                    else
                    {   // 알람 발생 로그
                        this.Logger.Write($"Sensor: {sensorData.ETC.Name} ({sensorData.ETC.UniqueKey}), IsAlarm: {bIsAlarm}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID}");
                    }
                }
                else
                {
                    this.Logger.Write($"{strTag} 해당 태그에 대한 센서 정보가 없습니다.");
                }
                
            }

            foreach (KeyValuePair<string, string> pair in dicRemoveAlarms)
            {
                string strTag = pair.Key;

                // 해당 센서 찾기
                if (m_dicEnvironmentSensors.ContainsKey(strTag))
                {
                    EnvironmentSensorData sensorData = m_dicEnvironmentSensors[strTag];

                    // 알람 해제
                    bool bIsAlarm = false;

                    ArrayList arrData = new ArrayList();
                    arrData.Add((int)dnsData.Sensor.Facility.FacilityType.Environment);
                    arrData.Add(sensorData.TagInfoID);
                    arrData.Add(sensorData.SensorZoneID);
                    arrData.Add(bIsAlarm);

                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strEnvironAlarmURL) == false)
                    {
                        strErrorMessage = $"1. SendAlarmQuery 실패 (Name: {sensorData.ETC.Name}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID})";
                        return false;
                    }
                    else
                    {   // 알람 해제 로그
                        this.Logger.Write($"Sensor: {sensorData.ETC.Name} ({sensorData.ETC.UniqueKey}), IsAlarm: {bIsAlarm}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID}");

                    }
                }
                    
            }


            return true;
        }

        // 알람 발생 신호만 연동되기 때문에 알람 해제 처리는 생략 
        public bool CheckEnvironAlarm2(Dictionary<string, string> dicEnvironAlarms, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (dicEnvironAlarms == null)
            {
                strErrorMessage = "EnvironAlarmData 값이 올바르지 않습니다.";
                return false;
            }

            //Dictionary<string, string> dicAddAlarms = new Dictionary<string, string>();
            //Dictionary<string, string> dicRemoveAlarms = new Dictionary<string, string>();

            //foreach (KeyValuePair<string, string> pair in dicEnvironAlarms)
            //{
            //    string strTag = pair.Key;

            //    if (m_dicEnvironAlarms.ContainsKey(strTag) == false)
            //        dicAddAlarms[strTag] = strTag;
            //}

            //foreach (KeyValuePair<string, string> pair in m_dicEnvironAlarms)
            //{
            //    string strTag = pair.Key;

            //    if (dicEnvironAlarms.ContainsKey(strTag) == false)
            //        dicRemoveAlarms[strTag] = strTag;
            //}

            //m_dicEnvironAlarms = dicEnvironAlarms;

            foreach (KeyValuePair<string, string> pair in dicEnvironAlarms)
            {
                string strTag = pair.Key;

                // 해당 센서 찾기
                if (m_dicEnvironmentSensors.ContainsKey(strTag))
                {
                    EnvironmentSensorData sensorData = m_dicEnvironmentSensors[strTag];

                    // 알람 발생
                    bool bIsAlarm = true;
                    int nAlarmLevel = 2;

                    ArrayList arrData = new ArrayList();
                    arrData.Add((int)dnsData.Sensor.Facility.FacilityType.Environment);
                    arrData.Add(sensorData.TagInfoID);
                    arrData.Add(sensorData.SensorZoneID);
                    arrData.Add(bIsAlarm);
                    arrData.Add(nAlarmLevel);

                    if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strEnvironAlarmURL) == false)
                    {
                        strErrorMessage = $"1. SendAlarmQuery 실패 (Name: {sensorData.ETC.Name}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID})";
                        return false;
                    }
                    else
                    {   // 알람 발생 로그
                        this.Logger.Write($"Sensor: {sensorData.ETC.Name} ({sensorData.ETC.UniqueKey}), IsAlarm: {bIsAlarm}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID}");
                    }
                }

            }

            //foreach (KeyValuePair<string, string> pair in dicRemoveAlarms)
            //{
            //    string strTag = pair.Key;

            //    // 해당 센서 찾기
            //    if (m_dicEnvironmentSensors.ContainsKey(strTag))
            //    {
            //        EnvironmentSensorData sensorData = m_dicEnvironmentSensors[strTag];

            //        // 알람 해제
            //        bool bIsAlarm = false;

            //        ArrayList arrData = new ArrayList();
            //        arrData.Add((int)dnsData.Sensor.Facility.FacilityType.Environment);
            //        arrData.Add(sensorData.TagInfoID);
            //        arrData.Add(sensorData.SensorZoneID);
            //        arrData.Add(bIsAlarm);

            //        if (m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, m_strEnvironAlarmURL) == false)
            //        {
            //            strErrorMessage = $"1. SendAlarmQuery 실패 (Name: {sensorData.ETC.Name}, IsAlarm: {bIsAlarm.ToString()}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID})";
            //            return false;
            //        }
            //        else
            //        {   // 알람 해제 로그
            //            this.Logger.Write($"Sensor: {sensorData.ETC.Name} ({sensorData.ETC.UniqueKey}), IsAlarm: {bIsAlarm}, TagInfoID: {sensorData.TagInfoID}, SensorZoneID: {sensorData.SensorZoneID}");

            //        }
            //    }

            //}


            return true;
        }
    }



    public class EnvironAlarmData 
    {
        public string TagID { get; set; }
        public int PV { get; set; }

        public EnvironAlarmData()
        {

        }



    }
}
