using dnsCommunicateSopServer;
using dnsData.Sensor;
using dnsDBUtil;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Threading;
using WonikErpNSheServer;

namespace WonikErpNSheServer
{
    public class HMIManager
    {
		private Thread m_thread = null;

		private bool m_runThread = false;

		private DateTime m_dtLast = DateTime.Now;

		private DirectDBManager m_hmiDBManager = null;

		private DBDataManager m_dbDataManager = null;

		private string m_strManufAlarmURL = null;

		private Dictionary<string, EnvironmentSensorData> m_dicManufSensors = null;

		private SopQueryManager m_sopQueryMgr = null;

		public WonikErpNSheServer.Logger Logger
		{
			get;
			set;
		}

		public HMIManager(DirectDBManager hmiDBManager, DBDataManager dbDataManager)
		{
			this.m_hmiDBManager = hmiDBManager;
			this.m_dbDataManager = dbDataManager;
			this.m_sopQueryMgr = new SopQueryManager("");
			this.Logger = WonikErpNSheServer.Logger.Instance.Clone("LOG_HMI");
			this.Init();
		}

		private void Init()
		{
			string strManufAlarmURL = ConfigurationManager.AppSettings.Get("ManufAlarmURL");
			if (strManufAlarmURL == null || strManufAlarmURL.Length == 0)
			{
				strManufAlarmURL = "http://127.0.0.1:44379/api/ManufactureSensor";
			}
			this.m_strManufAlarmURL = strManufAlarmURL;
			string strErrorMessage = default(string);
			Dictionary<string, EnvironmentSensorData> dicManufSensors = this.m_dbDataManager.LoadSensors(Facility.FacilityType.Manufacture, out strErrorMessage);
			if (dicManufSensors == null)
			{
				this.Logger.Write("Init 오류: " + strErrorMessage);
			}
			else
			{
				this.m_dicManufSensors = dicManufSensors;
			}
		}

		public void Start()
		{
			if (!this.m_runThread)
			{
				this.Logger.Write("HMIManager Start()");

				this.m_runThread = true;
				this.m_thread = new Thread(this.RequestThread);
				this.m_thread.Start();
			}
		}

		public void Stop()
		{
			if (this.m_runThread)
			{
				this.Logger.Write("HMIManager Stop()");

				this.m_runThread = false;
				m_thread.Abort();
			}
		}

		private void RequestThread()
		{
			this.Logger.Write("제조설비 HMI 실행");

			while (this.m_runThread)
			{				
                try
                {
					string strErrorMessage = default(string);
					Dictionary<string, bool> dicHMIAlarms = this.GetHMIAlarm(out strErrorMessage);
					if (dicHMIAlarms == null)
					{
						this.Logger.Write(strErrorMessage);
						Thread.Sleep(60000);
					}
					else if (!this.CheckHMIAlarm(dicHMIAlarms, out strErrorMessage))
					{
						this.Logger.Write(strErrorMessage);
						Thread.Sleep(60000);
					}
					else
					{
						Thread.Sleep(500);
					}
				}
				catch (Exception ex)
				{
					this.Logger.Write("[ERROR] RequestThread() Exception : " + ex.Message);
				}
			}
		}

		public Dictionary<string, bool> GetHMIAlarm(out string strErrorMessage)
		{
			strErrorMessage = "";
			Dictionary<string, bool> dicHMIAlarms = null;
			string strSQL = string.Format("Select CreateDate, TagID, IsAlarm From AlarmList Where CreateDate > '" + this.m_dtLast.ToString("yyyy-MM-dd HH:mm:ss") + "' ORDER BY CreateDate", Array.Empty<object>());
			ArrayList arrResult = this.m_hmiDBManager.GetResultData(strSQL, null);
			if (arrResult == null)
			{
				strErrorMessage = "1. GetHMIAlarm Error (AlarmList 테이블을 조회 할 수 없습니다.)";
				return null;
			}
			dicHMIAlarms = new Dictionary<string, bool>();
			int nCount = arrResult.Count;
			for (int i = 0; i < nCount - 2; i += 3)
			{
				VariousData<DateTime> createDate = WebDBManager.GetDateTimeField(arrResult[i]);
				string strTagID = WebDBManager.GetStringField(arrResult[i + 1].ToString());
				VariousData<int> isAlarm = WebDBManager.GetIntField(arrResult[i + 2].ToString());
				if (createDate != null && isAlarm != null)
				{
					DateTime dtDATETIME = createDate.Data;
					if (dtDATETIME > this.m_dtLast)
					{
						this.m_dtLast = dtDATETIME;
					}
					bool bIsAlarm = (byte)((isAlarm.Data == 1) ? 1 : 0) != 0;
					if (dicHMIAlarms.ContainsKey(strTagID))
					{
						bool bAlarm = dicHMIAlarms[strTagID];
						if (bAlarm != bIsAlarm)
						{
							dicHMIAlarms.Remove(strTagID);
						}
					}
					else
					{
						dicHMIAlarms[strTagID] = bIsAlarm;
					}
				}
			}
			return dicHMIAlarms;
		}

		public bool CheckHMIAlarm(Dictionary<string, bool> dicHMIAlarms, out string strErrorMessage)
		{
			strErrorMessage = "";
			if (dicHMIAlarms == null)
			{
				strErrorMessage = "HMIAlarms 값이 올바르지 않습니다.";
				return false;
			}
			foreach (KeyValuePair<string, bool> dicHMIAlarm in dicHMIAlarms)
			{
				string strTag = dicHMIAlarm.Key;
				bool bIsAlarm = dicHMIAlarm.Value;
				if (this.m_dicManufSensors.ContainsKey(strTag))
				{
					EnvironmentSensorData sensorData = this.m_dicManufSensors[strTag];
					int nAlarmLevel = 2;
					ArrayList arrData = new ArrayList();
					arrData.Add(118);
					arrData.Add(sensorData.TagInfoID);
					arrData.Add(sensorData.SensorZoneID);
					arrData.Add(bIsAlarm);
					if (bIsAlarm)
					{
						arrData.Add(nAlarmLevel);
					}
					if (!this.m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, this.m_strManufAlarmURL, null))
					{
						strErrorMessage = string.Format("CheckHMIAlarm CheckHMIAlarm() Error (Name: {0}, IsAlarm: {1}, TagInfoID: {2}, SensorZoneID: {3})", sensorData.ETC.Name, bIsAlarm.ToString(), sensorData.TagInfoID, sensorData.SensorZoneID);
						return false;
					}
					this.Logger.Write(string.Format("Sensor: {0} ({1}), IsAlarm: {2}, TagInfoID: {3}, SensorZoneID: {4}", sensorData.ETC.Name, sensorData.ETC.UniqueKey, bIsAlarm, sensorData.TagInfoID, sensorData.SensorZoneID));
				}
			}
			return true;
		}
	}
}
