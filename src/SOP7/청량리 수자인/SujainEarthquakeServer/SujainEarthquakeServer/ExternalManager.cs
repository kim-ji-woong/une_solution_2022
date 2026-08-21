using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SujainEarthquakeServer
{
    public class ExternalManager
    {
        private DirectDBManager m_dbManager = null;
        private DirectDBManager m_blackOutDBManager = null;

        private DateTime m_dtQureyLast = DateTime.Now;
        private DateTime m_dtBlackOutQureyLast = DateTime.Now;

        private Dictionary<int, int> m_dicBlackOutSensorZones = new Dictionary<int, int>();

        public ExternalManager()
        {
            Init();
        }

        private void Init()
        {
            string strDBName = ConfigurationManager.AppSettings.Get("EXTERNAL_NAME");
            if (strDBName == null || strDBName.Length == 0)
                strDBName = "mmp_s1";

            string strDBType = ConfigurationManager.AppSettings.Get("EXTERNAL_TYPE");
            if (strDBType == null || strDBType.Length == 0)
                strDBType = "3";

            string strDBHost = ConfigurationManager.AppSettings.Get("EXTERNAL_HOST");
            if (strDBHost == null || strDBHost.Length == 0)
                strDBHost = "192.168.11.11";

            string strDBId = ConfigurationManager.AppSettings.Get("EXTERNAL_ID");
            if (strDBId == null || strDBId.Length == 0)
                strDBId = "postgres";

            string strDBPw = ConfigurationManager.AppSettings.Get("EXTERNAL_PW");
            if (strDBPw == null || strDBPw.Length == 0)
                strDBPw = "Admin123$";



            string strBlackOutDBName = ConfigurationManager.AppSettings.Get("BLACKOUT_NAME");
            if (strBlackOutDBName == null || strBlackOutDBName.Length == 0)
                strBlackOutDBName = "mmp_s1";

            string strBlackOutDBType = ConfigurationManager.AppSettings.Get("BLACKOUT_TYPE");
            if (strBlackOutDBType == null || strBlackOutDBType.Length == 0)
                strBlackOutDBType = "0";

            string strBlackOutDBHost = ConfigurationManager.AppSettings.Get("BLACKOUT_HOST");
            if (strBlackOutDBHost == null || strBlackOutDBHost.Length == 0)
                strBlackOutDBHost = "192.168.10.11";

            string strBlackOutDBId = ConfigurationManager.AppSettings.Get("BLACKOUT_ID");
            if (strBlackOutDBId == null || strBlackOutDBId.Length == 0)
                strBlackOutDBId = "sa";

            string strBlackOutDBPw = ConfigurationManager.AppSettings.Get("BLACKOUT_PW");
            if (strBlackOutDBPw == null || strBlackOutDBPw.Length == 0)
                strBlackOutDBPw = "!1q2w3e";


            int nDBType = 3;
            int nBlackOutDBType = 0;

            int.TryParse(strDBType.Trim(), out nDBType);
            int.TryParse(strBlackOutDBType.Trim(), out nBlackOutDBType);

            m_dbManager = new DirectDBManager(nDBType, strDBHost, strDBName, strDBId, strDBPw);
            m_blackOutDBManager = new DirectDBManager(nBlackOutDBType, strBlackOutDBHost, strBlackOutDBName, strBlackOutDBId, strBlackOutDBPw);

            m_dicBlackOutSensorZones[ID.BlackOutZone_Residential] = ID.SensorZone_Residential;
            m_dicBlackOutSensorZones[ID.BlackOutZone_Commercial] = ID.SensorZone_Commercial;
        }

        public List<TriggerData> ReloadEventTrigger(out string strErrorMessage)
        {   // view_trigger 읽기
            strErrorMessage = "";
            List<TriggerData> triggers = null;

            string strSQL = string.Format("Select opdatetime, channelid, channelcode, channelname, direction, unit, tr_lv, tr_value, tr_MMI, tr_msg From view_trigger where opdatetime > '{0}'", m_dtQureyLast.ToString("yyyy-MM-dd HH:mm:ss"));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult == null)
            {
                strErrorMessage = "1. ReloadEventTrigger Error (view_trigger 테이블을 조회 할 수 없습니다.)";
                return triggers;
            }

            triggers = new List<TriggerData>();
            int nCount = arrResult.Count;

            DateTime? dtLast = null;

            for (int i = 0; i < nCount - 9; i += 10)
            {
                VariousData<DateTime> dt = WebDBManager.GetDateTimeField(arrResult[i]);
                int nChannelID = WebDBManager.GetIntField(arrResult[i + 1].ToString(), 0);
                string strChannelCode = WebDBManager.GetStringField(arrResult[i + 2].ToString());
                string strChannelName = WebDBManager.GetStringField(arrResult[i + 3].ToString());
                string strDirection = WebDBManager.GetStringField(arrResult[i + 4].ToString());
                string strUnit = WebDBManager.GetStringField(arrResult[i + 5].ToString());
                int nTr_Lv = WebDBManager.GetIntField(arrResult[i + 6].ToString(), 0);
                double dTr_Value = WebDBManager.GetDoubleField(arrResult[i + 7].ToString(), 0);
                double dTr_MMI = WebDBManager.GetDoubleField(arrResult[i + 8].ToString(), 0);
                string strTr_Msg = WebDBManager.GetStringField(arrResult[i + 9].ToString());

                if (dt == null)
                {
                    strErrorMessage = "2. ReloadEventTrigger Error (OpdateTime 데이터가 잘못되었습니다.)";
                    return null;
                }

                DateTime date = dt.Data;

                if (dtLast == null)
                    dtLast = date;
                if (dtLast < date)
                    dtLast = date;

                TriggerData data = new TriggerData();
                data.OpdateTime = date;
                data.ChannelID = nChannelID;
                data.ChannelCode = strChannelCode;
                data.ChannelName = strChannelName;
                data.Direction = strDirection;
                data.Unit = strUnit;
                data.Tr_Lv = nTr_Lv;
                data.Tr_Value = dTr_Value;
                data.Tr_Msg = strTr_Msg;
                data.Tr_MMI = dTr_MMI;

                triggers.Add(data);
            }

            if (dtLast.HasValue)
                m_dtQureyLast = dtLast.Value;


            return triggers;
        }


        public List<BlackOutData> ReloadBlackOut(out string strErrorMessage)
        {   // view_trigger 읽기
            strErrorMessage = "";
            List<BlackOutData> blackOutDatas = null;

            string strSQL = string.Format("Select ID, ZoneID, Emergency, Date From EventList_UVR where Date > '{0}'", m_dtBlackOutQureyLast.ToString("yyyy-MM-dd HH:mm:ss"));

            ArrayList arrResult = m_blackOutDBManager.GetResultData(strSQL);

            if (arrResult == null)
            {
                strErrorMessage = "1. ReloadBlackOut Error (EventList_UVR 테이블을 조회 할 수 없습니다.)";
                return blackOutDatas;
            }

            blackOutDatas = new List<BlackOutData>();
            int nCount = arrResult.Count;

            DateTime? dtLast = null;

            for (int i = 0; i < nCount - 3; i += 4)
            {
                int nID = WebDBManager.GetIntField(arrResult[i].ToString(), 0);
                int nZoneID = WebDBManager.GetIntField(arrResult[i + 1].ToString(), 0);
                int nEmergency = WebDBManager.GetIntField(arrResult[i + 2].ToString(), 0);
                VariousData<DateTime> dt = WebDBManager.GetDateTimeField(arrResult[i + 3]);

                if (dt == null)
                {
                    strErrorMessage = "2. ReloadBlackOut Error (Date 데이터가 잘못되었습니다.)";
                    return null;
                }

                if (m_dicBlackOutSensorZones.ContainsKey(nZoneID) == false)
                    continue;

                DateTime date = dt.Data;

                if (dtLast == null)
                    dtLast = date;
                if (dtLast < date)
                    dtLast = date;

                BlackOutData data = new BlackOutData();
                data.ID = nID;
                data.ZoneID = nZoneID;
                data.Emergency = nEmergency;
                data.CreateDate = date;

                data.SensorType = (int)dnsData.Sensor.Facility.FacilityType.BLACKOUT;

                int nSensorZoneID = m_dicBlackOutSensorZones[nZoneID];
                data.SensorTagID = nSensorZoneID;
                data.SensorZoneID = nSensorZoneID;

                blackOutDatas.Add(data);
            }

            if (dtLast.HasValue)
                m_dtBlackOutQureyLast = dtLast.Value;


            return blackOutDatas;
        }
    }
}
