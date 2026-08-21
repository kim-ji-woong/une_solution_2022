using System;
using System.Collections;
using System.Collections.Generic;
using dnsDBUtil;
using SensorServer.IDAL;
using SensorServer.Model.Yeosu;
using SensorServer.Model.Yeosu.External;
using SensorServer.Model.Yeosu.Option;
using SensorServer.Model.Yeosu.Public;

namespace SensorServer.DAL
{
	public class SelectManager : QueryManager, ISelect
	{
		private DataManager m_dataManager = null;

		public SelectManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private void SetQuery(ref string strSQL, string strCondition, string strAdditionalConditions)
		{
            string strOrderBy = "";

            if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
            {
                if (strCondition.Length > 0)
                {
                    string strFirst = strAdditionalConditions.Trim().ToLower();
                    if (strFirst.StartsWith("order by") || strFirst.StartsWith("inner"))
                        strOrderBy = strAdditionalConditions;
                    else
                        strCondition += " and " + strAdditionalConditions;
                }
                else
                    strCondition = strAdditionalConditions;
            }

            if (strCondition.Length > 0)
            {
                string strFirst = strCondition.Trim().ToLower();
                if (strFirst.StartsWith("order by") || strFirst.StartsWith("inner"))
                    strSQL += " " + strCondition;
                else
                    strSQL += " where " + strCondition;

                if (strOrderBy.Length > 0)
                    strSQL += " " + strOrderBy;
            }
        }

		private string GetDateTimeString(DateTime time)
		{
			return string.Format("{0}-{1:00}-{2:00} {3:00}:{4:00}:{5:00}", time.Year, time.Month, time.Day, time.Hour, time.Minute, time.Second);
		}

		public List<MaterialLink> SelectMaterialLinks(Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectMaterialLinks(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<MaterialLink> SelectMaterialLinks(Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<MaterialLink.Fields>(out nFieldCount), MaterialLink.TableName);

			string strCondition = "";

			if (SetCondition<MaterialLink.Fields>(ref strCondition, dicConditions, MaterialLink.GetFieldName, MaterialLink.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<MaterialLink> datas = new List<MaterialLink>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				MaterialLink model = ReadMaterialLink(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private MaterialLink ReadMaterialLink(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			MaterialLink model = new MaterialLink();
			bool isNullable;

			foreach (MaterialLink.Fields field in MaterialLink.Fields.GetValues(typeof(MaterialLink.Fields)))
			{
				string strFieldName = MaterialLink.GetFieldName(field, out isNullable);

				if (field == MaterialLink.Fields.MaterialID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.MaterialID = data.Data;
					}
				}
				else if (field == MaterialLink.Fields.UniqueID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.UniqueID = data.Data;
					}
				}
				else if (field == MaterialLink.Fields.Min1)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Min1 = null;
					else
					{
						model.Min1 = data.Data;
					}
				}
				else if (field == MaterialLink.Fields.Max1)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Max1 = null;
					else
					{
						model.Max1 = data.Data;
					}
				}
				else if (field == MaterialLink.Fields.Min2)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Min2 = null;
					else
					{
						model.Min2 = data.Data;
					}
				}
				else if (field == MaterialLink.Fields.Max2)
				{
					VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

					if (data == null)
						model.Max2 = null;
					else
					{
						model.Max2 = data.Data;
					}
				}
				else if (field == MaterialLink.Fields.Direction)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.Direction = data.Data;
					}
				}

				index++;
			}

			return model;
		}


		public SensorLink SelectSensorLink(int serviceID, int regionID, int groupID, int nodeID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where ServiceID = {2} and RegionID = {3} and GroupID = {4} and NodeID = {5} ", 
				GetFieldNames<SensorLink.Fields>(out nFieldCount), SensorLink.TableName
				, serviceID
				, regionID
				, groupID
				, nodeID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				SensorLink model = ReadSensorLink(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<SensorLink> SelectSensorLinks(Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectSensorLinks(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<SensorLink> SelectSensorLinks(Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<SensorLink.Fields>(out nFieldCount), SensorLink.TableName);

			string strCondition = "";

			if (SetCondition<SensorLink.Fields>(ref strCondition, dicConditions, SensorLink.GetFieldName, SensorLink.TableName, ref strErrorMessage) == false)
				return null;

			SetQuery(ref strSQL, strCondition, strAdditionalConditions);

			ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<SensorLink> datas = new List<SensorLink>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				SensorLink model = ReadSensorLink(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private SensorLink ReadSensorLink(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			SensorLink model = new SensorLink();
			bool isNullable;

			foreach (SensorLink.Fields field in SensorLink.Fields.GetValues(typeof(SensorLink.Fields)))
			{
				string strFieldName = SensorLink.GetFieldName(field, out isNullable);

				if (field == SensorLink.Fields.ServiceID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.ServiceID = data.Data;
					}
				}
				else if (field == SensorLink.Fields.RegionID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.RegionID = data.Data;
					}
				}
				else if (field == SensorLink.Fields.GroupID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.GroupID = data.Data;
					}
				}
				else if (field == SensorLink.Fields.NodeID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.NodeID = data.Data;
					}
				}
				else if (field == SensorLink.Fields.SensorName)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SensorName = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SensorName = data;
					}
				}

				index++;
			}

			return model;
		}

		public EtcSensorDataHistory SelectEtcSensorDataHistory(int sensorID, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1} where SensorID = {2} ",
				GetFieldNames<EtcSensorDataHistory.Fields>(out nFieldCount), EtcSensorDataHistory.TableName
				, sensorID);

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null && arrResult.Count >= nFieldCount)
			{
				EtcSensorDataHistory model = ReadEtcSensorDataHistory(arrResult, 0, out strErrorMessage);

				if (model == null)
					return null;

				return model;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public List<EtcSensorDataHistory> SelectEtcSensorDataHistorys(Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			return SelectEtcSensorDataHistorys(dicConditions, strAdditionalConditions, null, out strErrorMessage);
		}

		public List<EtcSensorDataHistory> SelectEtcSensorDataHistorys(Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
		{
			strErrorMessage = null;
			int nFieldCount;

			string strSQL = string.Format("select {0} from {1}", GetFieldNames<EtcSensorDataHistory.Fields>(out nFieldCount), EtcSensorDataHistory.TableName);

			string strCondition = "";

			if (SetCondition<EtcSensorDataHistory.Fields>(ref strCondition, dicConditions, EtcSensorDataHistory.GetFieldName, EtcSensorDataHistory.TableName, ref strErrorMessage) == false)
				return null;

			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
                    strCondition += " and " + strAdditionalConditions;
                else
					strCondition = strAdditionalConditions;
			}

			if (strCondition.Length > 0)
            {
                if (strCondition.Trim().ToLower().StartsWith("order by"))
                    strSQL += " " + strCondition;
                else
                    strSQL += " where " + strCondition;
            }

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

			if (arrResult == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return null;
			}

			int nResultCount = arrResult.Count;
			List<EtcSensorDataHistory> datas = new List<EtcSensorDataHistory>();

			for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
			{
				EtcSensorDataHistory model = ReadEtcSensorDataHistory(arrResult, i, out strErrorMessage);

				if (model == null)
					return null;
				else
					datas.Add(model);
			}

			return datas;
		}

		private EtcSensorDataHistory ReadEtcSensorDataHistory(ArrayList arrResult, int index, out string strErrorMessage)
		{
			strErrorMessage = null;
			EtcSensorDataHistory model = new EtcSensorDataHistory();
			bool isNullable;

			foreach (EtcSensorDataHistory.Fields field in EtcSensorDataHistory.Fields.GetValues(typeof(EtcSensorDataHistory.Fields)))
			{
				string strFieldName = EtcSensorDataHistory.GetFieldName(field, out isNullable);

				if (field == EtcSensorDataHistory.Fields.SensorID)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SensorID = data.Data;
					}
				}
				else if (field == EtcSensorDataHistory.Fields.TimeStamp)
				{
					VariousData<DateTime> data = WebDBManager.GetDateTimeField(arrResult[index]);

					if (data == null)
					{
						strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.TimeStamp = data.Data;
					}
				}
				else if (field == EtcSensorDataHistory.Fields.SensorValue)
				{
					string data = WebDBManager.GetStringField(arrResult[index]);

					if (data == null)
					{
						if (isNullable)
							model.SensorValue = null;
						else
						{
							strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
							return null;
						}
					}
					else
					{
						model.SensorValue = data;
					}
				}

				index++;
			}

			return model;
		}

        public EtcSensorData SelectEtcSensorData(int sensorID, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where SensorID = {2} ",
                GetFieldNames<EtcSensorData.Fields>(out nFieldCount), EtcSensorData.TableName
                , sensorID);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                EtcSensorData model = ReadEtcSensorData(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<EtcSensorData> SelectEtcSensorDatas(Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectEtcSensorDatas(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<EtcSensorData> SelectEtcSensorDatas(Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} order by SensorID", GetFieldNames<EtcSensorData.Fields>(out nFieldCount), EtcSensorData.TableName);

            string strCondition = "";

            if (SetCondition<EtcSensorData.Fields>(ref strCondition, dicConditions, EtcSensorData.GetFieldName, EtcSensorData.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<EtcSensorData> datas = new List<EtcSensorData>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                EtcSensorData model = ReadEtcSensorData(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private EtcSensorData ReadEtcSensorData(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            EtcSensorData model = new EtcSensorData();
            bool isNullable;

            foreach (EtcSensorData.Fields field in EtcSensorData.Fields.GetValues(typeof(EtcSensorData.Fields)))
            {
                string strFieldName = EtcSensorData.GetFieldName(field, out isNullable);

                if (field == EtcSensorData.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                } else if (field == EtcSensorData.Fields.SensorID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SensorID = data.Data;
                    }
                } else if (field == EtcSensorData.Fields.SensorType)
				{
					VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

					if (data == null)
					{
						strErrorMessage = string.Format("{0}은 null이 될 수 없습니다.", strFieldName);
						return null;
					}
					else
					{
						model.SensorType = data.Data;
					}
				} else if (field == EtcSensorData.Fields.X)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.X = null;
                    else
                    {
                        model.X = data.Data;
                    }
                }
                else if (field == EtcSensorData.Fields.Y)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Y = null;
                    else
                    {
                        model.Y = data.Data;
                    }
                }
                else if (field == EtcSensorData.Fields.Latitude)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Latitude = null;
                    else
                    {
                        model.Latitude = data.Data;
                    }
                }
                else if (field == EtcSensorData.Fields.Longitude)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Longitude = null;
                    else
                    {
                        model.Longitude = data.Data;
                    }
                }
                else if (field == EtcSensorData.Fields.PositionName)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        model.PositionName = null;
                    }
                    else
                    {
                        model.PositionName = data;
                    }
                }

                index++;
            }

            return model;
        }

        public AirNode SelectAirNode(int nodeID, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<AirNode.Fields>(out nFieldCount), AirNode.TableName
                , nodeID);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                AirNode model = ReadAirNode(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<AirNode> SelectAirNodes(Dictionary<AirNode.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectAirNodes(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<AirNode> SelectAirNodes(Dictionary<AirNode.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<AirNode.Fields>(out nFieldCount), AirNode.TableName);

            string strCondition = "";

            if (SetCondition<AirNode.Fields>(ref strCondition, dicConditions, AirNode.GetFieldName, AirNode.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<AirNode> datas = new List<AirNode>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                AirNode model = ReadAirNode(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private AirNode ReadAirNode(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            AirNode model = new AirNode();
            bool isNullable;

            foreach (AirNode.Fields field in AirNode.Fields.GetValues(typeof(AirNode.Fields)))
            {
                string strFieldName = AirNode.GetFieldName(field, out isNullable);

                if (field == AirNode.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == AirNode.Fields.SiteNm)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteNm = data;
                    }
                }
                else if (field == AirNode.Fields.X)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.X = null;
                    else
                    {
                        model.X = data.Data;
                    }
                }
                else if (field == AirNode.Fields.Y)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Y = null;
                    else
                    {
                        model.Y = data.Data;
                    }
                }
                else if (field == AirNode.Fields.Addr)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Addr = data;
                    }
                }
                else if (field == AirNode.Fields.Year)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.Year = null;
                    else
                    {
                        model.Year = data.Data;
                    }
                }
				else if (field == AirNode.Fields.MangName)
				{
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.MangName = data;
                    }
                }
				else if (field == AirNode.Fields.Item)
				{
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.Item = data;
                    }
                }

                index++;
            }

            return model;
        }

        public AirDataHistory SelectAirDataHistory(int nodeID, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1} where ID = {2} ",
                GetFieldNames<AirDataHistory.Fields>(out nFieldCount), AirDataHistory.TableName
                , nodeID);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                AirDataHistory model = ReadAirDataHistory(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<AirDataHistory> SelectAirDataHistories(Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectAirDataHistories(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<AirDataHistory> SelectAirDataHistories(Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<AirDataHistory.Fields>(out nFieldCount), AirDataHistory.TableName);

            string strCondition = "";

            if (SetCondition<AirDataHistory.Fields>(ref strCondition, dicConditions, AirDataHistory.GetFieldName, AirDataHistory.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<AirDataHistory> datas = new List<AirDataHistory>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                AirDataHistory model = ReadAirDataHistory(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private AirDataHistory ReadAirDataHistory(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            AirDataHistory model = new AirDataHistory();
            bool isNullable;

            foreach (AirDataHistory.Fields field in AirDataHistory.Fields.GetValues(typeof(AirDataHistory.Fields)))
            {
                string strFieldName = AirDataHistory.GetFieldName(field, out isNullable);

                if (field == AirDataHistory.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.LogDate)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.LogDate = data;
                    }
                }
                else if (field == AirDataHistory.Fields.SO2)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.SO2 = null;
                    else
                    {
                        model.SO2 = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.NO2)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.NO2 = null;
                    else
                    {
                        model.NO2 = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.O3)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.O3 = null;
                    else
                    {
                        model.O3 = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.CO)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.CO = null;
                    else
                    {
                        model.CO = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM10)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.PM10 = null;
                    else
                    {
                        model.PM10 = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM25)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.PM25 = null;
                    else
                    {
                        model.PM25 = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM10Daily)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.PM10Daily = null;
                    else
                    {
                        model.PM10Daily = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM25Daily)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.PM25Daily = null;
                    else
                    {
                        model.PM25Daily = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.Khai)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Khai = null;
                    else
                    {
                        model.Khai = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.SO2Grade)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.SO2Grade = null;
                    else
                    {
                        model.SO2Grade = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.NO2Grade)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.NO2Grade = null;
                    else
                    {
                        model.NO2Grade = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.O3Grade)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.O3Grade = null;
                    else
                    {
                        model.O3Grade = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.COGrade)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.COGrade = null;
                    else
                    {
                        model.COGrade = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM10Grade)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.PM10Grade = null;
                    else
                    {
                        model.PM10Grade = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM25Grade)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.PM25Grade = null;
                    else
                    {
                        model.PM25Grade = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM10Grade1h)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.PM10Grade1h = null;
                    else
                    {
                        model.PM10Grade1h = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM25Grade1h)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.PM25Grade1h = null;
                    else
                    {
                        model.PM25Grade1h = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.SO2Flag)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.SO2Flag = null;
                    else
                    {
                        model.SO2Flag = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.NO2Flag)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.NO2Flag = null;
                    else
                    {
                        model.NO2Flag = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.O3Flag)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.O3Flag = null;
                    else
                    {
                        model.O3Flag = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.COFlag)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.COFlag = null;
                    else
                    {
                        model.COFlag = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM10Flag)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.PM10Flag = null;
                    else
                    {
                        model.PM10Flag = data.Data;
                    }
                }
                else if (field == AirDataHistory.Fields.PM25Flag)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.PM25Flag = null;
                    else
                    {
                        model.PM25Flag = data.Data;
                    }
                }
                index++;
            }

            return model;
        }

        public KmaAsos SelectKmaAsos(int kmaID, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            bool isNullable;

            string strSQL = string.Format("select {0} from {1} where {2} = {3}",
                GetFieldNames<KmaAsos.Fields>(out nFieldCount), KmaAsos.TableName,
                KmaAsos.GetFieldName(KmaAsos.Fields.ID, out isNullable), kmaID);

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null && arrResult.Count >= nFieldCount)
            {
                KmaAsos model = ReadKmaAsos(arrResult, 0, out strErrorMessage);

                if (model == null)
                    return null;

                return model;
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        public List<KmaAsos> SelectKmaAsoses(Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectKmaAsoses(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<KmaAsos> SelectKmaAsoses(Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<KmaAsos.Fields>(out nFieldCount), KmaAsos.TableName);

            string strCondition = "";

            if (SetCondition<KmaAsos.Fields>(ref strCondition, dicConditions, KmaAsos.GetFieldName, KmaAsos.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<KmaAsos> datas = new List<KmaAsos>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                KmaAsos model = ReadKmaAsos(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private KmaAsos ReadKmaAsos(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            KmaAsos model = new KmaAsos();
            bool isNullable;

            foreach (KmaAsos.Fields field in KmaAsos.Fields.GetValues(typeof(KmaAsos.Fields)))
            {
                string strFieldName = KmaAsos.GetFieldName(field, out isNullable);
                if (field == KmaAsos.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }

                if (field == KmaAsos.Fields.LogDate)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.LogDate = data;
                    }
                }
                else if (field == KmaAsos.Fields.WD)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.WD = null;
                    else
                    {
                        model.WD = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.WS)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.WS = null;
                    else
                    {
                        model.WS = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Pressure)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Pressure = null;
                    else
                    {
                        model.Pressure = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.SeaLevelPressure)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.SeaLevelPressure = null;
                    else
                    {
                        model.SeaLevelPressure = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Temperature)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Temperature = null;
                    else
                    {
                        model.Temperature = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.DewPointTemp)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.DewPointTemp = null;
                    else
                    {
                        model.DewPointTemp = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Humidity)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.Humidity = null;
                    else
                    {
                        model.Humidity = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Evaporation)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Evaporation = null;
                    else
                    {
                        model.Evaporation = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Rainfall)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Rainfall = null;
                    else
                    {
                        model.Rainfall = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Snowfall3hr)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Snowfall3hr = null;
                    else
                    {
                        model.Snowfall3hr = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.SnowfallDay)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.SnowfallDay = null;
                    else
                    {
                        model.SnowfallDay = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.SnowfallCover)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.SnowfallCover = null;
                    else
                    {
                        model.SnowfallCover = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.CurrentWeather)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.CurrentWeather = null;
                    else
                    {
                        model.CurrentWeather = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.CloudAmount)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.CloudAmount = null;
                    else
                    {
                        model.CloudAmount = data;
                    }
                }
                else if (field == KmaAsos.Fields.CloudAmountMid)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.CloudAmountMid = null;
                    else
                    {
                        model.CloudAmountMid = data;
                    }
                }
                else if (field == KmaAsos.Fields.CloudHeightMin)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.CloudHeightMin = null;
                    else
                    {
                        model.CloudHeightMin = data;
                    }
                }
                else if (field == KmaAsos.Fields.Visibility)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.Visibility = null;
                    else
                    {
                        model.Visibility = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.HourSunshine)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.HourSunshine = null;
                    else
                    {
                        model.HourSunshine = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.HoursolarRadiation)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.HoursolarRadiation = null;
                    else
                    {
                        model.HoursolarRadiation = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.GrounStatusCode)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.GrounStatusCode = null;
                    else
                    {
                        model.GrounStatusCode = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Grounttemp)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Grounttemp = null;
                    else
                    {
                        model.Grounttemp = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Temperature005m)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Temperature005m = null;
                    else
                    {
                        model.Temperature005m = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Temperature01m)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Temperature01m = null;
                    else
                    {
                        model.Temperature01m = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Temperature02m)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Temperature02m = null;
                    else
                    {
                        model.Temperature02m = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.Temperature03m)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.Temperature03m = null;
                    else
                    {
                        model.Temperature03m = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.RainfallDay)
                {
                    VariousData<float> data = WebDBManager.GetFloatField(arrResult[index].ToString());

                    if (data == null)
                        model.RainfallDay = null;
                    else
                    {
                        model.RainfallDay = data.Data;
                    }
                }
                else if (field == KmaAsos.Fields.StnID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                        model.StnID = null;
                    else
                    {
                        model.StnID = data.Data;
                    }
                }
                index++;
            }

            return model;
        }

        ///
        ///
        /*
         * ClaenSYS Select Index를 정의할 고유값이 없어 리스트로만 조회 - CJH 2023-06-13
         */

        public List<CleanSYS> SelectCleanSYSs(Dictionary<CleanSYS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectCleanSYSs(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<CleanSYS> SelectCleanSYSs(Dictionary<CleanSYS.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<CleanSYS.Fields>(out nFieldCount), CleanSYS.TableName);

            string strCondition = "";

            if (SetCondition<CleanSYS.Fields>(ref strCondition, dicConditions, CleanSYS.GetFieldName, CleanSYS.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<CleanSYS> datas = new List<CleanSYS>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                CleanSYS model = ReadCleanSYS(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private CleanSYS ReadCleanSYS(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            CleanSYS model = new CleanSYS();
            bool isNullable;

            foreach (CleanSYS.Fields field in CleanSYS.Fields.GetValues(typeof(CleanSYS.Fields)))
            {
                string strFieldName = CleanSYS.GetFieldName(field, out isNullable);
                if (field == CleanSYS.Fields.AreaNM)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.AreaNM = data;
                    }
                }

                if (field == CleanSYS.Fields.FactManageNM)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.FactManageNM = data;
                    }
                }
                else if (field == CleanSYS.Fields.StackCode)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.StackCode = data;
                    }
                }
                else if (field == CleanSYS.Fields.MeasureDT)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.MeasureDT = null;
                    else
                    {
                        model.MeasureDT = data;
                    }
                }
                else if (field == CleanSYS.Fields.TspExhstpermstdValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.TspExhstpermstdValue = null;
                    else
                    {
                        model.TspExhstpermstdValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.TspMeasureValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.TspMeasureValue = null;
                    else
                    {
                        model.TspMeasureValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.SoxExhstpermstdValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.SoxExhstpermstdValue = null;
                    else
                    {
                        model.SoxExhstpermstdValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.SoxMeasureValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.SoxMeasureValue = null;
                    else
                    {
                        model.SoxMeasureValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.NoxExhstpermstdValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.NoxExhstpermstdValue = null;
                    else
                    {
                        model.NoxExhstpermstdValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.NoxMeasureValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.NoxMeasureValue = null;
                    else
                    {
                        model.NoxMeasureValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.HclExhstpermstdValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.HclExhstpermstdValue = null;
                    else
                    {
                        model.HclExhstpermstdValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.HclMeasureValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.HclMeasureValue = null;
                    else
                    {
                        model.HclMeasureValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.HfExhstpermstdValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.HfExhstpermstdValue = null;
                    else
                    {
                        model.HfExhstpermstdValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.HfMeasureValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.HfMeasureValue = null;
                    else
                    {
                        model.HfMeasureValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.Nh3ExhstpermstdValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.Nh3ExhstpermstdValue = null;
                    else
                    {
                        model.Nh3ExhstpermstdValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.Nh3MeasureValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.Nh3MeasureValue = null;
                    else
                    {
                        model.Nh3MeasureValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.CoExhstpermstdValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.CoExhstpermstdValue = null;
                    else
                    {
                        model.CoExhstpermstdValue = data;
                    }
                }
                else if (field == CleanSYS.Fields.CoMeasureValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                        model.CoMeasureValue = null;
                    else
                    {
                        model.CoMeasureValue = data;
                    }
                }
                index++;
            }

            return model;
        }

        public List<OptionSDMS> SelectAllYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            return SelectAllYeosuOptionSDMS(dicConditions, strAdditionalConditions, null, out strErrorMessage);
        }

        public List<OptionSDMS> SelectAllYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage)
        {
            strErrorMessage = null;
            int nFieldCount;

            string strSQL = string.Format("select {0} from {1}", GetFieldNames<OptionSDMS.Fields>(out nFieldCount), OptionSDMS.TableName);

            string strCondition = "";

            if (SetCondition<OptionSDMS.Fields>(ref strCondition, dicConditions, OptionSDMS.GetFieldName, OptionSDMS.TableName, ref strErrorMessage) == false)
                return null;

            SetQuery(ref strSQL, strCondition, strAdditionalConditions);

            ArrayList arrResult = topNCount == null ? m_dbManager.GetResultData(strSQL) : m_dbManager.GetResultData(strSQL, (int)topNCount);

            if (arrResult == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return null;
            }

            int nResultCount = arrResult.Count;
            List<OptionSDMS> datas = new List<OptionSDMS>();

            for (int i = 0; i < nResultCount - (nFieldCount - 1); i += nFieldCount)
            {
                OptionSDMS model = ReadOptionSDMS(arrResult, i, out strErrorMessage);

                if (model == null)
                    return null;
                else
                    datas.Add(model);
            }

            return datas;
        }

        private OptionSDMS ReadOptionSDMS(ArrayList arrResult, int index, out string strErrorMessage)
        {
            strErrorMessage = null;
            OptionSDMS model = new OptionSDMS();
            bool isNullable;

            foreach (OptionSDMS.Fields field in OptionSDMS.Fields.GetValues(typeof(OptionSDMS.Fields)))
            {
                string strFieldName = OptionSDMS.GetFieldName(field, out isNullable);

                if (field == OptionSDMS.Fields.ID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.ID = data.Data;
                    }
                }
                else if (field == OptionSDMS.Fields.PropertyName)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.PropertyName = data;
                    }
                }
                else if (field == OptionSDMS.Fields.PropertyValue)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.PropertyValue = data;
                    }
                }
                else if (field == OptionSDMS.Fields.SiteID)
                {
                    VariousData<int> data = WebDBManager.GetIntField(arrResult[index].ToString());

                    if (data == null)
                    {
                        strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                        return null;
                    }
                    else
                    {
                        model.SiteID = data.Data;
                    }
                }
                else if (field == OptionSDMS.Fields.Description)
                {
                    string data = WebDBManager.GetStringField(arrResult[index]);

                    if (data == null)
                    {
                        if (isNullable)
                            model.Description = null;
                        else
                        {
                            strErrorMessage = string.Format("{0}는 null이 될수 없습니다.", strFieldName);
                            return null;
                        }
                    }
                    else
                    {
                        model.Description = data;
                    }
                }

                index++;
            }

            return model;
        }

        public int GetMaxID(string strTableName, out string strErrorMessage, string strCondition = "")
        {
            int nID = -1;
            strErrorMessage = "";

            string strSQL = "Select max(ID) from " + strTableName;
            if (strCondition.Length > 0)
            {
                if (strCondition.Trim().ToLower().StartsWith("order by"))
                    strSQL += " " + strCondition;
                else
                    strSQL += " where " + strCondition;
            }

            ArrayList arrResults = m_dbManager.GetResultData(strSQL);

            if (arrResults == null)
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
                return nID;
            }

            nID = arrResults.Count == 0 ? 1 : WebDBManager.GetIntField(arrResults[0].ToString(), 0) + 1;

            return nID;
        }
    }
}
