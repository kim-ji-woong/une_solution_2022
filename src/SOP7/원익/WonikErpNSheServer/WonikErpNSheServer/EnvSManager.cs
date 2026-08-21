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
    public class EnvSManager
	{
		private Thread m_thread = null;

		private bool m_runThread = false;

		private DateTime m_dtLast = DateTime.Now;

		private DirectDBManager m_envDBManager = null;

		private DBDataManager m_dbDataManager = null;

		private string m_strManufAlarmURL = null;

		private Dictionary<string, EnvironmentSensorData> m_dicEnvSensors = null;

		private SopQueryManager m_sopQueryMgr = null;

		public WonikErpNSheServer.Logger Logger
		{
			get;
			set;
		}

		public EnvSManager(DirectDBManager envDBManager, DBDataManager dbDataManager)
		{
			this.m_envDBManager = envDBManager;
			this.m_dbDataManager = dbDataManager;
			this.m_sopQueryMgr = new SopQueryManager("");
			this.Logger = WonikErpNSheServer.Logger.Instance.Clone("LOG_EnvS");
			this.Init();
		}

		private void Init()
		{
			string strManufAlarmURL = ConfigurationManager.AppSettings.Get("EnvironAlarmURL");
			if (strManufAlarmURL == null || strManufAlarmURL.Length == 0)
			{
				strManufAlarmURL = "http://127.0.0.1:44379/api/EnvironmentSensor";
			}
			this.m_strManufAlarmURL = strManufAlarmURL;
			string strErrorMessage = default(string);
			Dictionary<string, EnvironmentSensorData> dicEnvSensors = this.m_dbDataManager.LoadSensors(Facility.FacilityType.Environment, out strErrorMessage);
			if (dicEnvSensors == null)
			{
				this.Logger.Write("Init 오류: " + strErrorMessage);
			}
			else
			{
				this.m_dicEnvSensors = dicEnvSensors;
			}
		}

		public void Start()
		{
			if (!this.m_runThread)
			{
				this.Logger.Write("EnvSManager Start()");

				this.m_runThread = true;
				this.m_thread = new Thread(this.RequestThread);
				this.m_thread.Start();
			}
		}

		public void Stop()
		{
			if (this.m_runThread)
			{
				this.Logger.Write("EnvSManager Stop()");

				this.m_runThread = false;
				m_thread.Abort();
			}
		}

		private void RequestThread()
		{
			while (this.m_runThread)
			{			
                try
                {
					string strErrorMessage = default(string);
					Dictionary<string, bool> dicEnvSAlarms = this.GetEnvSAlarm(out strErrorMessage);
					if (dicEnvSAlarms == null)
					{
						this.Logger.Write(strErrorMessage);
						Thread.Sleep(60000);
					}
					else if (!this.CheckEnvSAlarm(dicEnvSAlarms, out strErrorMessage))
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

		public Dictionary<string, bool> GetEnvSAlarm(out string strErrorMessage)
		{
			strErrorMessage = "";
			Dictionary<string, bool> dicEnvSAlarms = null;
			string strSQL = string.Format("Select dtm, name, val From alarm_list Where dtm > '" + this.m_dtLast.ToString("yyyy-MM-dd HH:mm:ss") + "' ORDER BY dtm", Array.Empty<object>());
			ArrayList arrResult = this.m_envDBManager.GetResultData(strSQL, null);
			if (arrResult == null)
			{
				strErrorMessage = "1. GetEnvSAlarm Error (alarm_list 테이블을 조회 할 수 없습니다.)";
				return null;
			}
			dicEnvSAlarms = new Dictionary<string, bool>();
			int nCount = arrResult.Count;
			for (int i = 0; i < nCount - 2; i += 3)
			{
				VariousData<DateTime> dtm = WebDBManager.GetDateTimeField(arrResult[i]);
				string name = WebDBManager.GetStringField(arrResult[i + 1].ToString());
				VariousData<int> val = WebDBManager.GetIntField(arrResult[i + 2].ToString());
				if (dtm != null && val != null)
				{
					DateTime dtDATETIME = dtm.Data;
					if (dtDATETIME > this.m_dtLast)
					{
						this.m_dtLast = dtDATETIME;
					}
					bool bVal = (byte)((val.Data == 1) ? 1 : 0) != 0;
					if (dicEnvSAlarms.ContainsKey(name))
					{
						bool bAlarm = dicEnvSAlarms[name];
						if (bAlarm != bVal)
						{
							dicEnvSAlarms.Remove(name);
						}
					}
					else
					{
						dicEnvSAlarms[name] = bVal;
					}
				}
			}
			return dicEnvSAlarms;
		}

		public bool CheckEnvSAlarm(Dictionary<string, bool> dicEnvAlarms, out string strErrorMessage)
		{
			strErrorMessage = "";
			if (dicEnvAlarms == null)
			{
				strErrorMessage = "EnvAlarms 값이 올바르지 않습니다.";
				return false;
			}
			foreach (KeyValuePair<string, bool> dicEnvAlarm in dicEnvAlarms)
			{
				string strTag = dicEnvAlarm.Key;
				bool bIsAlarm = dicEnvAlarm.Value;
				if (this.m_dicEnvSensors.ContainsKey(strTag))
				{
					EnvironmentSensorData sensorData = this.m_dicEnvSensors[strTag];
					int nAlarmLevel = 2;
					ArrayList arrData = new ArrayList();
					arrData.Add((int)Facility.FacilityType.Environment);
					arrData.Add(sensorData.TagInfoID);
					arrData.Add(sensorData.SensorZoneID);
					arrData.Add(bIsAlarm);
					if (bIsAlarm)
					{
						arrData.Add(nAlarmLevel);
					}
					if (!this.m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, this.m_strManufAlarmURL, null))
					{
						strErrorMessage = string.Format("CheckEnvSAlarm SendAlarmQuery() Error (Name: {0}, IsAlarm: {1}, TagInfoID: {2}, SensorZoneID: {3})", sensorData.ETC.Name, bIsAlarm.ToString(), sensorData.TagInfoID, sensorData.SensorZoneID);
						return false;
					}
					this.Logger.Write(string.Format("Sensor: {0} ({1}), IsAlarm: {2}, TagInfoID: {3}, SensorZoneID: {4}", sensorData.ETC.Name, sensorData.ETC.UniqueKey, bIsAlarm, sensorData.TagInfoID, sensorData.SensorZoneID));
				}
			}
			return true;
		}
	}
}
