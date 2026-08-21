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

namespace SujainFireServer.Data
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

            ALARM_URL = strALARM_URL + "/api/FireSensor";
        }



        public bool GetSensorInfo(List<EventInfo> eventInfoList, bool bIsAllClear, out string strErrorMessage)
        {
            strErrorMessage = "";

            // 전체 복구신호 경우 조회할 필요가 없음
            if (bIsAllClear == true)
                return true;

            if (eventInfoList == null)
            {
                strErrorMessage = "1. GetSensorInfo Error (eventInfoList 데이터가 존재하지 않습니다.)";
                return false;
            }


            string strTagNum = null;

            foreach (EventInfo info in eventInfoList)
            {
                if (strTagNum == null)
                    strTagNum = info.TagNum.ToString();
                else
                    strTagNum += ", " + info.TagNum.ToString();
            }

            if (strTagNum == null)
                return true;

            string strAdditionalConditions = string.Format("{0}.{1} in ({2})",
                TagInfo.TableName, TagInfo.Fields.TagNo, strTagNum);

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSensorZoneTagInfoFireSensor(strAdditionalConditions, out strErrorMessage);

            if (arrDatas == null)
            {
                strErrorMessage = "2. GetSensorInfo Error (JoinSensorZoneTagInfoFireSensor fail: " + strErrorMessage + ")";
                return false;
            }

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount - 2; i += 3)
            {
                if (arrDatas[i] is SensorZone && arrDatas[i + 1] is TagInfo && arrDatas[i + 2] is Fire)
                {
                    SensorZone sensorZone = (SensorZone)arrDatas[i];
                    TagInfo tagInfo = (TagInfo)arrDatas[i + 1];
                    Fire fire = (Fire)arrDatas[i + 2];

                    foreach (EventInfo info in eventInfoList)
                    {
                        if (info.TagNum == tagInfo.TagNo)
                        {
                            info.SensorTagID = tagInfo.ID;
                            info.SensorZoneID = tagInfo.SensorZoneID;
                            info.ZoneID = fire.ZoneID;

                            break;
                        }
                    }
                }
            }

            return true;
        }


        public bool SendAlarms(List<EventInfo> eventInfoList, bool bIsAllClear, out string strErrorMessage)
        {
            strErrorMessage = "";

            if (bIsAllClear)
            {   // 전체 복구
                m_SopQueryMgr.SendAllClearQuery(ID.ALARM_METHOD, ALARM_URL);
            }
            else
            {
                foreach (EventInfo info in eventInfoList)
                {
                    if (info.SensorTagID.HasValue && info.SensorZoneID.HasValue)
                    {
                        ArrayList arrData = new ArrayList();
                        arrData.Add((int)dnsData.Sensor.Facility.FacilityType.FIRE_SENSOR);
                        arrData.Add(info.SensorTagID);
                        arrData.Add(info.SensorZoneID);

                        if (info.Emergency == (int)ID.EmergencyType.ON)
                            arrData.Add(true);
                        else if (info.Emergency == (int)ID.EmergencyType.OFF)
                            arrData.Add(false);
                        else
                            continue;

                        string strLog = string.Format("Send Alarm (SensorTagID: {0}, SensorZoneID: {1}, OnOff: {2})", info.SensorTagID.Value.ToString(), info.SensorZoneID.Value.ToString(), info.Emergency.ToString());
                        Logger.Instance.Write(strLog);

                        if (m_SopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, ALARM_URL) == false)
                        {
                            strErrorMessage = "SendAlarms Error (SopQueryManager SendAlarmQuery 실패)";
                            return false;
                        }
                    }
                }
            }

            return true;
        }
    }
}
