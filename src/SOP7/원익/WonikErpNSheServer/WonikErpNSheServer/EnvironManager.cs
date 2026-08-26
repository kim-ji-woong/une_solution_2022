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

            // HMI_YN: 업데이트 유무 확인값 (HMI 데이터를 기록하면 Y, 우리 쪽에서 데이터를 읽으면 N 값으로 업데이트)
            // PV: 알람 유무 확인값(0: 정상, 1: 알람)
            string strSQL = string.Format("Select DATETIME, HMI_ID, TAG_ID, HMI_YN, PV From CAMPUS_HMI_ALARM_PV Where PV = 1");

            ArrayList arrResult = m_environDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = "1. GetEnvironAlarm Error (CAMPUS_HMI_ALARM_PV 테이블을 조회 할 수 없습니다.)";
                return null;
            }

            dicEnvironAlarms = new Dictionary<string, string>();

            int nCount = arrResult.Count;

            for (int i = 0; i < nCount - 4; i += 5)
            {
                //VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[i]);   // HMI 기록 시각(시계 편차 문제로 판정 기준에서 제외)
                string strHMI_ID = WebDBManager.GetStringField(arrResult[i + 1].ToString());
                string strTAG_ID = WebDBManager.GetStringField(arrResult[i + 2].ToString());
                string strHMI_YN = WebDBManager.GetStringField(arrResult[i + 3].ToString());
                //int nPV = WebDBManager.GetIntField(arrResult[i + 4].ToString(), 0);

                if (strHMI_ID == null || strTAG_ID == null)
                    continue;

                // 새로 발견된 알람(HMI_YN = 'N')만 처리:
                //  - CLONE 테이블에 '발견 시각(DB서버 GETDATE())'과 함께 등록 → 3분 타이머의 기준
                //  - HMI_YN 을 'Y'로 변경하여 읽음 처리
                // 3분 경과 판정을 HMI가 기록한 DATETIME 대신 '우리가 처음 발견한 시각'으로 하여
                // HMI 시스템과 로컬(서버) 시계 차이에 영향을 받지 않도록 한다.
                if (strHMI_YN == "N")
                {
                    // 중복 등록 방지: 아직 CLONE에 없을 때만 추가
                    strSQL = string.Format(
                        "IF NOT EXISTS (SELECT 1 FROM CAMPUS_HMI_ALARM_PV_CLONE WHERE HMI_ID = '{0}' AND TAG_ID = '{1}') " +
                        "INSERT INTO CAMPUS_HMI_ALARM_PV_CLONE (HMI_ID, TAG_ID, REG_DATE) VALUES ('{0}', '{1}', GETDATE())",
                        strTAG_ID_Escape(strHMI_ID), strTAG_ID_Escape(strTAG_ID));

                    if (m_environDBManager.GetResultData(strSQL) == null)
                    {
                        strErrorMessage = "2. GetEnvironAlarm Error (CAMPUS_HMI_ALARM_PV_CLONE 등록 실패) : " + m_environDBManager.LastErrorMessage;
                        return null;
                    }

                    strSQL = string.Format(
                        "UPDATE CAMPUS_HMI_ALARM_PV SET HMI_YN = 'Y' WHERE HMI_ID = '{0}' AND TAG_ID = '{1}' AND HMI_YN = 'N'",
                        strTAG_ID_Escape(strHMI_ID), strTAG_ID_Escape(strTAG_ID));

                    if (m_environDBManager.GetResultData(strSQL) == null)
                    {
                        strErrorMessage = "3. GetEnvironAlarm Error (HMI_YN 업데이트 실패) : " + m_environDBManager.LastErrorMessage;
                        return null;
                    }
                }

                string strKey = strTAG_ID + "_" + strHMI_ID;
                dicEnvironAlarms[strKey] = strKey;
            }

            // 발견 후 3분(180초) 지난 알람은 원본 PV = 0 으로 해제하고 CLONE에서 제거한다.
            if (ResetExpiredAlarms(out strErrorMessage) == false)
                return null;

            return dicEnvironAlarms;
        }

        /// <summary>
        /// CAMPUS_HMI_ALARM_PV_CLONE 에 등록된 항목 중 발견 시각(REG_DATE)으로부터
        /// 3분(180초)이 지난 것을 찾아 원본 CAMPUS_HMI_ALARM_PV 의 PV 를 0으로 되돌리고
        /// CLONE 에서 삭제한다.
        /// 경과 판정을 DB 서버 시각(GETDATE())으로만 수행하므로 HMI/로컬 시계 차이의 영향이 없다.
        /// </summary>
        private bool ResetExpiredAlarms(out string strErrorMessage)
        {
            strErrorMessage = "";

            string strSQL = "SELECT HMI_ID, TAG_ID FROM CAMPUS_HMI_ALARM_PV_CLONE WHERE DATEDIFF(second, REG_DATE, GETDATE()) >= 180";

            ArrayList arrResult = m_environDBManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                strErrorMessage = "4. ResetExpiredAlarms Error (CAMPUS_HMI_ALARM_PV_CLONE 조회 실패) : " + m_environDBManager.LastErrorMessage;
                return false;
            }

            int nCount = arrResult.Count;

            for (int i = 0; i < nCount - 1; i += 2)
            {
                string strHMI_ID = WebDBManager.GetStringField(arrResult[i].ToString());
                string strTAG_ID = WebDBManager.GetStringField(arrResult[i + 1].ToString());

                if (strHMI_ID == null || strTAG_ID == null)
                    continue;

                // 원본 알람 해제 (PV = 0)
                strSQL = string.Format(
                    "UPDATE CAMPUS_HMI_ALARM_PV SET PV = 0 WHERE HMI_ID = '{0}' AND TAG_ID = '{1}'",
                    strTAG_ID_Escape(strHMI_ID), strTAG_ID_Escape(strTAG_ID));

                if (m_environDBManager.GetResultData(strSQL) == null)
                {
                    strErrorMessage = "5. ResetExpiredAlarms Error (PV=0 업데이트 실패) : " + m_environDBManager.LastErrorMessage;
                    return false;
                }

                // 처리 완료된 CLONE 항목 삭제
                strSQL = string.Format(
                    "DELETE FROM CAMPUS_HMI_ALARM_PV_CLONE WHERE HMI_ID = '{0}' AND TAG_ID = '{1}'",
                    strTAG_ID_Escape(strHMI_ID), strTAG_ID_Escape(strTAG_ID));

                if (m_environDBManager.GetResultData(strSQL) == null)
                {
                    strErrorMessage = "6. ResetExpiredAlarms Error (CLONE 삭제 실패) : " + m_environDBManager.LastErrorMessage;
                    return false;
                }
            }

            return true;
        }

        // 문자열 값을 SQL 리터럴에 넣기 전 작은따옴표 이스케이프 (태그명 안전 처리)
        private static string strTAG_ID_Escape(string strValue)
        {
            if (strValue == null)
                return "";

            return strValue.Replace("'", "''");
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
