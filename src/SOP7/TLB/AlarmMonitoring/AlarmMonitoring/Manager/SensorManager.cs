using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AlarmMonitoring
{
    public class SensorManager
    {
        private static SensorManager m_instance = null;
        public static SensorManager Instance { get { return m_instance; } }

        private DirectDBManager m_dbManager = null;

        // <Key:SensorType, <Key:OrgSensorID>>
        private Dictionary<int, Dictionary<int, SensorTag>> m_dicSensorTagInfo = new Dictionary<int, Dictionary<int, SensorTag>>();
        public Dictionary<int, Dictionary<int, SensorTag>> DicSensorTagInfo
        {
            get { return m_dicSensorTagInfo; }
        }
        private Dictionary<int, AlarmInfo> m_dicCurrentAlarm = new Dictionary<int, AlarmInfo>();
        public Dictionary<int, AlarmInfo> DicCurrentAlarm
        {
            get { return m_dicCurrentAlarm; }
        }

        private bool m_bRunThread = false;
        public SensorManager(DirectDBManager dbManager)
        {
            m_instance = this;
            m_dbManager = dbManager;
            if (LoadData())
            {
                m_bRunThread = true;
                Thread t = new Thread(new ThreadStart(LoadCurrentAlarm));
                t.Start();
            }
        }

        public void Stop()
        {
            m_bRunThread = false;
        }

        public bool LoadData()
        {            
            string strSQL = $@"
                select sz.ID SensorZoneID, sti.ID SensorTagInfoID, SensorType, OrgSensorID, TagNo,
                       case
		                when SensorType = 0
		                then (select Name from SdmsSensorFire f where f.ID=sz.OrgSensorID)
                        when SensorType = 290
		                then (select Name from SdmsSensorETC e where e.ID=sz.OrgSensorID)
                        when SensorType = 291
		                then (select Name from SdmsSensorETC e where e.ID=sz.OrgSensorID)
	                   end SensorName
                  from SdmsSensorZone sz
                 inner join SdmsSensorTagInfo sti on sz.ID=sti.SensorZoneID";

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);
            if (arrResult == null)
            {
                Logger.Instance.Write("LoadData : " + m_dbManager.LastErrorMessage);
                return false;
            }

            int nResultCount = arrResult.Count;
            for (int i = 0; i < nResultCount-5; i+=6)
            {
                VariousData<int> nSensorZoneID = WebDBManager.GetIntField(arrResult[i].ToString());
                VariousData<int> nSensorTagInfoID = WebDBManager.GetIntField(arrResult[i+1].ToString());
                VariousData<int> nSensorType = WebDBManager.GetIntField(arrResult[i+2].ToString());
                VariousData<int> nOrgSensorID = WebDBManager.GetIntField(arrResult[i+3].ToString());
                VariousData<int> nTagNo = WebDBManager.GetIntField(arrResult[i+4].ToString());
                string strSensorName = WebDBManager.GetStringField(arrResult[i + 5]);

                if (nSensorZoneID == null || nSensorTagInfoID == null || nSensorType == null || nOrgSensorID == null || nTagNo == null || strSensorName == null)
                    continue;

                SensorTag tagInfo = new SensorTag()
                {
                    ID = nSensorTagInfoID.Data,
                    SensorZoneID = nSensorZoneID.Data,
                    SensorType = nSensorType.Data,
                    TagNo = nTagNo.Data,
                    OrgSensorID = nOrgSensorID.Data,
                    SensorName = strSensorName
                };

                if (!m_dicSensorTagInfo.ContainsKey(tagInfo.SensorType))
                    m_dicSensorTagInfo.Add(tagInfo.SensorType, new Dictionary<int, SensorTag>());

                if (m_dicSensorTagInfo[tagInfo.SensorType].ContainsKey(tagInfo.OrgSensorID))
                    continue;

                m_dicSensorTagInfo[tagInfo.SensorType].Add(tagInfo.OrgSensorID, tagInfo);
            }

            return true;
        }

        public void LoadCurrentAlarm()
        {
            string strSQL = $@"
                select SensorZoneHistoryID, SensorType, TimeStamp, SopStatus, AlarmDepth, AlarmSensorZoneIDs
                  from SdmsAlarmCurrent ac";

            while (m_bRunThread)
            {
                ArrayList arrResult = m_dbManager.GetResultData(strSQL);
                if (arrResult == null)
                {
                    Logger.Instance.Write("LoadCurrentAlarm : " + m_dbManager.LastErrorMessage);
                    return;
                }

                Dictionary<int, AlarmInfo> dicCurrentAlarm = new Dictionary<int, AlarmInfo>();

                int nResultCount = arrResult.Count;
                for (int i = 0; i < nResultCount - 5; i += 6)
                {
                    VariousData<int> nSensorZoneHistoryID = WebDBManager.GetIntField(arrResult[i].ToString());
                    VariousData<int> nSensorType = WebDBManager.GetIntField(arrResult[i + 1].ToString());
                    VariousData<DateTime> dtTimeStamp = WebDBManager.GetDateTimeField(arrResult[i + 2]);
                    VariousData<int> nSopStatus = WebDBManager.GetIntField(arrResult[i + 3].ToString());
                    VariousData<int> nAlarmDepth = WebDBManager.GetIntField(arrResult[i + 4].ToString());
                    string strAlarmSensorZoneIDs = WebDBManager.GetStringField(arrResult[i + 5]);

                    if (nSensorZoneHistoryID == null || nSensorType == null || dtTimeStamp == null || nSopStatus == null || nAlarmDepth == null)
                        continue;

                    if (strAlarmSensorZoneIDs == null || strAlarmSensorZoneIDs.Length == 0)
                        continue;

                    string[] alarmSensorZoneIDs = strAlarmSensorZoneIDs.Split(',');
                    if (alarmSensorZoneIDs.Length == 0)
                        continue;

                    for (int j = 0; j < alarmSensorZoneIDs.Length; j++)
                    {
                        if (!int.TryParse(alarmSensorZoneIDs[j], out int nSensorZoneID))
                            continue;

                        if (!dicCurrentAlarm.ContainsKey(nSensorZoneID))
                            dicCurrentAlarm.Add(nSensorZoneID, new AlarmInfo());

                        dicCurrentAlarm[nSensorZoneID].SensorZoneHistoryID = nSensorZoneHistoryID.Data;
                        dicCurrentAlarm[nSensorZoneID].SensorType = nSensorType.Data;
                        dicCurrentAlarm[nSensorZoneID].TimeStamp = dtTimeStamp.Data;
                        dicCurrentAlarm[nSensorZoneID].SopStatus = nSopStatus.Data;
                        dicCurrentAlarm[nSensorZoneID].AlarmDepth = nAlarmDepth.Data;
                        dicCurrentAlarm[nSensorZoneID].SensorZoneID = nSensorZoneID;
                    }
                }

                m_dicCurrentAlarm = dicCurrentAlarm;

                Thread.Sleep(1000);
            }
        }
    }

    public class SensorTag
    {
        private int m_nID = 0;
        private int m_nSensorType = 0;
        private int m_nTagNo = 0;
        private int m_nSensorZoneID = 0;
        private int m_nOrgSensorID = 0;
        private string m_strSensorName = string.Empty;

        /// <summary>
        /// SensorTagInfo 테이블 ID
        /// </summary>
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int TagNo
        {
            get { return m_nTagNo; }
            set { m_nTagNo = value; }
        }

        public int SensorZoneID
        {
            get { return m_nSensorZoneID; }
            set { m_nSensorZoneID = value; }
        }

        public int OrgSensorID
        {
            get { return m_nOrgSensorID; }
            set { m_nOrgSensorID = value; }
        }
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
    }

    public class AlarmInfo
    {
        public int SensorZoneHistoryID { get; set; }
        public int SensorType { get; set; }
        public DateTime TimeStamp { get; set; }
        public int SopStatus { get; set; }
        public int AlarmDepth { get; set; }
        public int SensorZoneID { get; set; }
    }
}
