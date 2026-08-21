using dnsCommunicateSopServer;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace MagogServer
{
	public class WebServiceManager
	{
		public const string SUCESS = "success";

		private string BaseAddress = "";

		private string SOPWebServerURL_Fire = "";

		public static string FIRE_TAG = "GFS";

		public static string DOOR_TAG = "ACS";

		public static string FIRE_NORMAL = "False";

		public static List<string> DOOR_OPEN = new List<string>
		{
			"4303",
			"4305",
			"4307"
		};

		public static List<string> DOOR_CLOSE = new List<string>
		{
			"4302",
			"4304",
			"4306"
		};

		public static int DOOR_OPEN_DB = 0;

		public static int DOOR_CLOSE_DB = 1;

		private ProcessManager m_parent = null;

		private SopQueryManager m_sopQueryMgr = new SopQueryManager("");

		private List<string> m_fireAlarms = new List<string>();

		private List<string> m_doorStates = new List<string>();

		public WebServiceManager(ProcessManager parent, string strWebServiceBaseURL, string strSOPWebServerURL_Fire)
		{
			this.m_parent = parent;
			this.BaseAddress = strWebServiceBaseURL;
			this.SOPWebServerURL_Fire = strSOPWebServerURL_Fire;
		}

		private string SendQuery(Dictionary<string, string> dicHeaders, string strBodyJson, string strURL, out string strErrorMessage, string strMethodType = "GET")
		{
			strErrorMessage = "";
			string strResponse = null;
			try
			{
				HttpWebRequest request = (HttpWebRequest)WebRequest.Create(new Uri(strURL));
				request.Method = strMethodType;
				if (dicHeaders != null)
				{
					request.ContentType = "application/json; charset=utf-8";
					foreach (KeyValuePair<string, string> dicHeader in dicHeaders)
					{
						string key = dicHeader.Key;
						string value = dicHeader.Value;
						request.Headers.Add(key, value);
					}
				}
				if (strBodyJson != null && strBodyJson != "")
				{
					StreamWriter streamWriter = new StreamWriter(request.GetRequestStream());
					streamWriter.Write(strBodyJson);
					streamWriter.Flush();
					streamWriter.Close();
				}
				HttpWebResponse wRes = (HttpWebResponse)request.GetResponse();
				Stream respPostStream = wRes.GetResponseStream();
				StreamReader readerPost = new StreamReader(respPostStream, Encoding.UTF8);
				strResponse = readerPost.ReadToEnd().Trim();
				request.Abort();
				readerPost.Close();
				respPostStream.Close();
			}
			catch (WebException ex)
			{
				strErrorMessage = ex.Message;
				return null;
			}
			if (strResponse == null)
			{
				strErrorMessage = "Request 실패";
				return null;
			}
			strErrorMessage = "success";
			return strResponse;
		}

		public Dictionary<string, JObject> RequestGroupDatas(string strGroupTag, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<string, JObject> datas = null;
			try
			{
				string strURL = this.BaseAddress + "/api/group/" + strGroupTag;
				string strResult = this.SendQuery((Dictionary<string, string>)null, (string)null, strURL, out strErrorMessage, "GET");
				if (strErrorMessage == "success" && strResult != null)
				{
					JObject jResult = JObject.Parse(strResult);
					if (jResult != null && jResult[strGroupTag] != null)
					{
						JObject jGroup = (JObject)jResult[strGroupTag];
						int nCnt = jGroup.Count;
						datas = new Dictionary<string, JObject>();
						foreach (KeyValuePair<string, JToken> item in jGroup)
						{
							string strTagID = item.Key;
							JObject jData = datas[strTagID] = (JObject)item.Value;
						}
					}
				}
			}
			catch (Exception e)
			{
				datas = null;
				strErrorMessage = e.Message;
			}
			return datas;
		}

		public List<string> GetAlarmList(Dictionary<string, JObject> api_datas, object NormalState, out string strErrorMessage)
		{
			strErrorMessage = null;
			List<string> alarmList = new List<string>();
			try
			{
				if (api_datas == null)
				{
					return alarmList;
				}
				foreach (KeyValuePair<string, JObject> api_data in api_datas)
				{
					string strTagID = api_data.Key;
					JObject jData = api_data.Value;
					if (!strTagID.EndsWith("_ConnState") && jData["value"].ToString() != NormalState)
					{
						alarmList.Add(strTagID);
					}
				}
			}
			catch (Exception e)
			{
				strErrorMessage = e.Message;
				alarmList = null;
			}
			return alarmList;
		}

		public void CheckFireAlarm(Dictionary<string, JObject> api_datas)
		{
			try
			{
				if (api_datas != null)
				{
					List<string> fireAlarms = new List<string>();
					foreach (KeyValuePair<string, JObject> api_data in api_datas)
					{
						string strTagID2 = api_data.Key;
						JObject jData = api_data.Value;
						if (!strTagID2.EndsWith("_ConnState"))
						{
							JToken jToken = jData["value"];
							if (((jToken != null) ? jToken.ToString() : null) != WebServiceManager.FIRE_NORMAL)
							{
								fireAlarms.Add(strTagID2);
							}
						}
					}
					List<string> addAlarms = new List<string>();
					List<string> removeAlarms = new List<string>();
					foreach (string fireAlarm in this.m_fireAlarms)
					{
						if (!fireAlarms.Contains(fireAlarm))
						{
							removeAlarms.Add(fireAlarm);
						}
					}
					foreach (string item in fireAlarms)
					{
						if (!this.m_fireAlarms.Contains(item))
						{
							addAlarms.Add(item);
						}
					}
					foreach (string item2 in addAlarms)
					{
						// 통합 SI 서버 작동 시, 화재 신호 한번에 ON/OFF 발생 예외처리
						if (addAlarms.Count > 200)
							break;

						string strTag6 = item2.Replace("GFS", "");
						strTag6 = strTag6.Replace("_", "");
						strTag6 = "1" + strTag6;
						int nTag2 = 0;
						int nTemp = default(int);
						if (int.TryParse(strTag6, out nTemp))
						{
							nTag2 = nTemp;
						}
						if (this.m_parent.SensorManager.FireSensors.ContainsKey(nTag2))
						{
							SensorData sensor2 = this.m_parent.SensorManager.FireSensors[nTag2];
							ArrayList arrData2 = new ArrayList();
							arrData2.Add(sensor2.SensorType);
							arrData2.Add(sensor2.TagID);
							arrData2.Add(sensor2.SensorZoneID);
							arrData2.Add(true);
							if (!this.m_sopQueryMgr.SendAlarmQuery(arrData2, ID.ALARM_METHOD, this.SOPWebServerURL_Fire, null))
							{
								Logger.Instance.Write(string.Format("WebServiceManager SendAlarmQuery() Error (IsAlarm: {0}, TagID: {1}, SensorZoneID: {2})", true, sensor2.TagID, sensor2.SensorZoneID));
							}
							else
							{
								this.m_fireAlarms.Add(item2);
								Logger.Instance.Write(string.Format("화재 알람 발생: TagID: {0}, SensorZoneID: {1}", sensor2.TagID, sensor2.SensorZoneID));
							}
						}
					}
					foreach (string item3 in removeAlarms)
					{
						string strTag3 = item3.Replace("GFS", "");
						strTag3 = strTag3.Replace("_", "");
						strTag3 = "1" + strTag3;
						int nTag = 0;
						int nTemp2 = default(int);
						if (int.TryParse(strTag3, out nTemp2))
						{
							nTag = nTemp2;
						}
						if (this.m_parent.SensorManager.FireSensors.ContainsKey(nTag))
						{
							SensorData sensor = this.m_parent.SensorManager.FireSensors[nTag];
							ArrayList arrData = new ArrayList();
							arrData.Add(sensor.SensorType);
							arrData.Add(sensor.TagID);
							arrData.Add(sensor.SensorZoneID);
							arrData.Add(false);
							if (!this.m_sopQueryMgr.SendAlarmQuery(arrData, ID.ALARM_METHOD, this.SOPWebServerURL_Fire, null))
							{
								Logger.Instance.Write(string.Format("WebServiceManager SendAlarmQuery() Error (IsAlarm: {0}, TagID: {1}, SensorZoneID: {2})", false, sensor.TagID, sensor.SensorZoneID));
							}
							else
							{
								this.m_fireAlarms.Remove(item3);
								Logger.Instance.Write(string.Format("화재 알람 해제: TagID: {0}, SensorZoneID: {1}", sensor.TagID, sensor.SensorZoneID));
							}
						}
					}
				}
			}
			catch (Exception e)
			{
				Logger.Instance.Write("WebServiceManager CheckFireAlarm() 예외발생 (" + e.Message + ")");
			}
		}

		public void CheckDoorState(Dictionary<string, JObject> api_datas)
		{
			try
			{
				if (api_datas != null)
				{
					List<string> doorStates = new List<string>();
					foreach (KeyValuePair<string, JObject> api_data in api_datas)
					{
						string strTagID5 = api_data.Key;
						JObject jData = api_data.Value;
						if (!strTagID5.EndsWith("_ConnState"))
						{
							List<string> dOOR_CLOSE = WebServiceManager.DOOR_CLOSE;
							JToken jToken = jData["value"];
							if (dOOR_CLOSE.Contains((jToken != null) ? jToken.ToString() : null))
							{
								doorStates.Add(strTagID5);
							}
						}
					}
					List<string> addStates = new List<string>();
					List<string> removeStates = new List<string>();
					foreach (string doorState in this.m_doorStates)
					{
						if (!doorStates.Contains(doorState))
						{
							removeStates.Add(doorState);
						}
					}
					foreach (string item in doorStates)
					{
						if (!this.m_doorStates.Contains(item))
						{
							addStates.Add(item);
						}
					}
					if (addStates.Count > 0)
					{
						string strErrorMessage2 = default(string);
						if (this.m_parent.SensorManager.UpdateDoorState(addStates, WebServiceManager.DOOR_CLOSE_DB, out strErrorMessage2))
						{
							foreach (string item2 in addStates)
							{
								this.m_doorStates.Add(item2);
							}
						}
						else
						{
							Logger.Instance.Write(string.Format("WebServiceManager UpdateDoorState() Error (State: {0}, TagID: {1}, ErrorMessage: {2})", WebServiceManager.DOOR_CLOSE_DB, string.Join(",", addStates), strErrorMessage2));
						}
					}
					if (removeStates.Count > 0)
					{
						string strErrorMessage = default(string);
						if (this.m_parent.SensorManager.UpdateDoorState(removeStates, WebServiceManager.DOOR_OPEN_DB, out strErrorMessage))
						{
							foreach (string item3 in removeStates)
							{
								this.m_doorStates.Remove(item3);
							}
						}
						else
						{
							Logger.Instance.Write(string.Format("WebServiceManager UpdateDoorState() Error (State: {0}, TagID: {1}, ErrorMessage: {2})", WebServiceManager.DOOR_OPEN_DB, string.Join(",", removeStates), strErrorMessage));
						}
					}
				}
			}
			catch (Exception e)
			{
				Logger.Instance.Write("WebServiceManager CheckDoorState() 예외발생 (" + e.Message + ")");
			}
		}

		public void TestAlarm(bool bIsAlarm)
        {
			Dictionary<int, SensorData> fireSensors = this.m_parent.SensorManager.FireSensors;

			if (fireSensors?.Count > 0)
            {
				int i = 0;

				foreach (KeyValuePair<int, SensorData> pair in fireSensors)
                {
					if (i >= 200)
						break;

					SensorData sensor2 = pair.Value;
					ArrayList arrData2 = new ArrayList();
					arrData2.Add(sensor2.SensorType);
					arrData2.Add(sensor2.TagID);
					arrData2.Add(sensor2.SensorZoneID);
					arrData2.Add(bIsAlarm);

					if (!this.m_sopQueryMgr.SendAlarmQuery(arrData2, ID.ALARM_METHOD, this.SOPWebServerURL_Fire, null))
					{
						Logger.Instance.Write(string.Format($"WebServiceManager SendAlarmQuery() Error (IsAlarm: {bIsAlarm}, TagID: {sensor2.TagID}, SensorZoneID: {sensor2.SensorZoneID})"));
					}

					i++;
				}
            }

		}
	}
}
