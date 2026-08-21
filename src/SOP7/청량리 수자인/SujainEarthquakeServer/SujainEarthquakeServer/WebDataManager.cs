using dnsCommunicateSopServer;
using dnsDBUtil;
using SDMS.DAL;
using SDMS.Model.Sensor;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SujainEarthquakeServer
{
    public class WebDataManager
    {
        private DataManager m_dataManager = null;

        private SopQueryManager m_SopQueryMgr = null;

        private string ALARM_URL = null;

        public WebDataManager()
        {
            Init();

            m_SopQueryMgr = new SopQueryManager();
        }

        private void Init()
        {
            string strSiteID = ConfigurationManager.AppSettings.Get("SITE_ID");
            if (strSiteID == null || strSiteID.Length == 0)
                strSiteID = "16";

            string strDBName = ConfigurationManager.AppSettings.Get("DB_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "WSOP_16";

            string strDBType = ConfigurationManager.AppSettings.Get("DB_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "0";

            string strDBHost = ConfigurationManager.AppSettings.Get("DB_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "AwVB0IrUXAghp5PlaWuqWg==";

            string strDBId = ConfigurationManager.AppSettings.Get("DB_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "GUk6cJACqVBoIFh7ny7mqQ==";

            string strDBPw = ConfigurationManager.AppSettings.Get("DB_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "SezOwMM9A2mIbUk5DCW/eQ==";

            string strALARM_URL = ConfigurationManager.AppSettings.Get("ALARM_URL");
            if (strALARM_URL == null || strALARM_URL.Length == 0)
                strALARM_URL = "http://127.0.0.1:44379";

            string key = new string(new char[] { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6' });

            strDBHost = AES256Cipher.AES_decrypt(strDBHost.Trim(), key);
            strDBId = AES256Cipher.AES_decrypt(strDBId.Trim(), key);
            strDBPw = AES256Cipher.AES_decrypt(strDBPw.Trim(), key);

            int nSiteID, nDBType;
            int.TryParse(strSiteID.Trim(), out nSiteID);
            int.TryParse(strDBType.Trim(), out nDBType);

            m_dataManager = new DataManager(nDBType, strDBHost, strDBName, strDBId, strDBPw, nSiteID);

            ALARM_URL = strALARM_URL;
        }

        public bool GetSensorInfo(List<TriggerData> triggerDatas, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (triggerDatas == null)
            {
                strErrorMessage = "1. GetSensorInfo Error (triggerDatas 데이터가 존재하지 않습니다.)";
                return false;
            }

            string strUniqueKeys = null;

            foreach (TriggerData data in triggerDatas)
            {
                if (strUniqueKeys == null)
                    strUniqueKeys = "'" + data.ChannelID.ToString() + "'";
                else
                    strUniqueKeys += ", '" + data.ChannelID.ToString() + "'";
            }

            if (strUniqueKeys == null)
                return true;

            string strAdditionalConditions = string.Format("{0}.{1} in ({2}) and {0}.{3} in (18, 50)", ETC.TableName, ETC.Fields.UniqueKey, strUniqueKeys, ETC.Fields.MaterialType);

            ArrayList arrResult = m_dataManager.GetSelectManager().JoinSensorZoneTagInfoMaterialEarthquakeStrongWindSensor(strAdditionalConditions, out strErrorMessage);
            if (arrResult == null)
            {
                strErrorMessage = "2. GetSensorInfo Error (JoinSensorZoneTagInfoMaterialEarthquakeStrongWindSensor fail: " + strErrorMessage + ")";
                return false;
            }

            int nDataCount = arrResult.Count;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrResult[i] is SensorZone && arrResult[i + 1] is TagInfo && arrResult[i + 2] is Material && arrResult[i + 3] is ETC)
                {
                    SensorZone sensorZone = (SensorZone)arrResult[i];
                    TagInfo tagInfo = (TagInfo)arrResult[i + 1];
                    Material material = (Material)arrResult[i + 2];
                    ETC etc = (ETC)arrResult[i + 3];

                    foreach (TriggerData trigger in triggerDatas)
                    {
                        if (trigger.ChannelID.ToString() == etc.UniqueKey)
                        {
                            trigger.SensorTagID = tagInfo.ID;
                            trigger.SensorZoneID = sensorZone.ID;
                            trigger.SensorType = sensorZone.SensorType;
                            break;
                        }
                    }
                }
            }

            return true;
        }

        public bool SendAlarms(List<TriggerData> triggerDatas, out string strErrorMessage)
        {
            strErrorMessage = "";


            foreach (TriggerData trigger in triggerDatas)
            {
                if (trigger.SensorTagID.HasValue && trigger.SensorZoneID.HasValue && trigger.SensorType.HasValue)
                {
                    string strALARM_URL = ALARM_URL;
                    int? nAlarmLevel = null;

                    if (trigger.SensorType.Value == (int)dnsData.Sensor.Facility.FacilityType.Earthquake)
                    {
                        strALARM_URL = ALARM_URL + "/api/EarthquakeSensor";

                        // .TODO: 테스트 임시 처리
                        //if (trigger.Tr_Lv == (int)AlarmLevel.Attention ||
                        //    trigger.Tr_Lv == (int)AlarmLevel.Caution ||
                        //    trigger.Tr_Lv == (int)AlarmLevel.Warning ||
                        //    trigger.Tr_Lv == (int)AlarmLevel.Serious)
                        //    nAlarmLevel = trigger.Tr_Lv;


                        // 지진 강도값 체크 후 알람 단계 변화
                        // 관심 없음 (대한민국에서 지진이 발생할때...) 
                        // 1 이상 4 미만 주의
                        // 4 이상 5 미만 경계
                        // 5 이상 심각
                        if (trigger.Tr_MMI.HasValue && trigger.Tr_MMI.Value >= ID.Earthquake_Serious)
                            nAlarmLevel = (10000 * (int)AlarmLevel.Serious) + (int)trigger.Tr_MMI.Value;
                        else if (trigger.Tr_MMI.HasValue && trigger.Tr_MMI.Value >= ID.Earthquake_Warning)
                            nAlarmLevel = (10000 * (int)AlarmLevel.Warning) + (int)trigger.Tr_MMI.Value;
                        else if (trigger.Tr_MMI.HasValue && trigger.Tr_MMI.Value >= ID.Earthquake_Caution)
                            nAlarmLevel = (10000 * (int)AlarmLevel.Caution) + (int)trigger.Tr_MMI.Value;

                    }
                    else if (trigger.SensorType.Value == (int)dnsData.Sensor.Facility.FacilityType.STRONG_WIND)
                    {
                        strALARM_URL = ALARM_URL + "/api/StrongWindSensor";

                        if (trigger.Tr_Lv == (int)AlarmLevel.Attention ||
                            trigger.Tr_Lv == (int)AlarmLevel.Caution ||
                            trigger.Tr_Lv == (int)AlarmLevel.Warning ||
                            trigger.Tr_Lv == (int)AlarmLevel.Serious)
                            nAlarmLevel = trigger.Tr_Lv;
                    }
                    else
                        continue;

                    if (nAlarmLevel != null)
                    {
                        ArrayList arrData = new ArrayList();
                        arrData.Add(trigger.SensorType.Value);
                        arrData.Add(trigger.SensorTagID);
                        arrData.Add(trigger.SensorZoneID);
                        arrData.Add(true);
                        arrData.Add(nAlarmLevel);

                        if (m_SopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, strALARM_URL) == false)
                        {
                            strErrorMessage = "SendAlarms Error (SopQueryManager SendAlarmQuery 실패)";
                            return false;
                        }
                    }
                    
                }
            }
            

            return true;
        }

        public bool SendAlarms(List<BlackOutData> blackOutDatas, out string strErrorMessage)
        {
            strErrorMessage = "";

            foreach (BlackOutData data in blackOutDatas)
            {

                if (data.SensorTagID.HasValue == false || data.SensorZoneID.HasValue == false || data.SensorType.HasValue == false)
                    continue;

                    string strALARM_URL = ALARM_URL + "/api/BlackOutSensor";
                int nAlarmLevel = (int)AlarmLevel.Attention;
                bool bIsAlarm = false;

                if (data.Emergency == ID.BlackOut_Alarm_ON)
                    bIsAlarm = true;

                ArrayList arrData = new ArrayList();
                arrData.Add(data.SensorType.Value);
                arrData.Add(data.SensorTagID);
                arrData.Add(data.SensorZoneID);
                arrData.Add(bIsAlarm);
                arrData.Add(nAlarmLevel);

                if (m_SopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, strALARM_URL) == false)
                {
                    strErrorMessage = "SendAlarms Error (SopQueryManager SendAlarmQuery 실패)";
                    return false;
                }
            }

            return true;
        }
    }
}
