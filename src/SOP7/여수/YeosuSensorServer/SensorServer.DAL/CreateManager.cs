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
	public class CreateManager : QueryManager, ICreate
	{
		private DataManager m_dataManager = null;
		private const int FindCountLimit = 100;

		public CreateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		private string GetInsertErrorMessage(string tableName)
		{
			return string.Format("{0} 테이블의 데이터 삽입에 실패하였습니다.", tableName);
		}

		private bool EqualsValue(object oldObj, object newObj)
		{
			if (oldObj == null && newObj == null)
				return true;

			if (oldObj is DateTime)
			{
				DateTime dt1, dt2;
				if (DateTime.TryParse(oldObj.ToString(), out dt1) && DateTime.TryParse(newObj.ToString(), out dt2))
				{
					if (Convert.ToDateTime(oldObj).ToString("yyyyMMddHHmmss") == Convert.ToDateTime(newObj).ToString("yyyyMMddHHmmss"))
						return true;
				}
				else
				{
					if (oldObj.ToString().Trim() == newObj.ToString().Trim())
						return true;
				}
			}

			return false;
		}

		public MaterialLink CreateMaterialLink(MaterialLink obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<MaterialLink.Fields, object> dicFieldDatas = new Dictionary<MaterialLink.Fields, object>();
			dicFieldDatas[MaterialLink.Fields.MaterialID] = obj.MaterialID;
			dicFieldDatas[MaterialLink.Fields.UniqueID] = obj.UniqueID;
			dicFieldDatas[MaterialLink.Fields.Min1] = obj.Min1;
			dicFieldDatas[MaterialLink.Fields.Max1] = obj.Max1;
			dicFieldDatas[MaterialLink.Fields.Min2] = obj.Min2;
			dicFieldDatas[MaterialLink.Fields.Max2] = obj.Max2;
			dicFieldDatas[MaterialLink.Fields.Direction] = obj.Direction;

			string strSQL = string.Format("Insert into {0} ({1}) values({2})",
				MaterialLink.TableName,
				GetFieldNames<MaterialLink.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				MaterialLink data = new MaterialLink();
				data.MaterialID = obj.MaterialID;
				data.UniqueID = obj.UniqueID;
				data.Min1 = obj.Min1;
				data.Max1 = obj.Max1;
				data.Min2 = obj.Min2;
				data.Max2 = obj.Max2;
				data.Direction = obj.Direction;

				return data;
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		public SensorLink CreateSensorLink(SensorLink obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<SensorLink.Fields, object> dicFieldDatas = new Dictionary<SensorLink.Fields, object>();
			dicFieldDatas[SensorLink.Fields.SensorName] = obj.SensorName;

			string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(NodeID) FROM {0} C where ServiceID = {2} and RegionID = {3} and GroupID = {4} ), 0) + 1, {5})",
				SensorLink.TableName,
				GetFieldNames<SensorLink.Fields>(),
				obj.ServiceID,
				obj.RegionID,
				obj.GroupID,
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format("order by {0} desc, {1} desc, {2} desc, {3} desc",
					SensorLink.GetFieldName(SensorLink.Fields.ServiceID, out isNullable),
					SensorLink.GetFieldName(SensorLink.Fields.RegionID, out isNullable),
					SensorLink.GetFieldName(SensorLink.Fields.GroupID, out isNullable),
					SensorLink.GetFieldName(SensorLink.Fields.NodeID, out isNullable));

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<SensorLink> datas = m_dataManager.GetSelectManager().SelectSensorLinks(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameSensorLink(obj, datas[0]))
					return datas[0];

				return GetSensorLink(obj, datas[0].ServiceID, datas[0].RegionID, datas[0].GroupID, datas[0].NodeID, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameSensorLink(SensorLink oldObject, SensorLink newObject)
		{
			if (oldObject.ServiceID == newObject.ServiceID)
				return true;

			return false;
		}

		private SensorLink GetSensorLink(SensorLink obj, int serviceID, int regionID, int groupID, int nodeID, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} and {2} = {3} and {4} = {5} and {6} < {7} order by {0} desc, {2} desc, {4} desc, {6} desc",
				SensorLink.GetFieldName(SensorLink.Fields.ServiceID, out isNullable), serviceID,
				SensorLink.GetFieldName(SensorLink.Fields.RegionID, out isNullable), regionID,
				SensorLink.GetFieldName(SensorLink.Fields.GroupID, out isNullable), groupID,
				SensorLink.GetFieldName(SensorLink.Fields.NodeID, out isNullable), nodeID);
			List<SensorLink> datas = m_dataManager.GetSelectManager().SelectSensorLinks(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (SensorLink data in datas)
			{
				if (IsSameSensorLink(data, obj))
					return data;

				if (data.NodeID < nodeID)
					nodeID = data.NodeID;
			}

			if (nCount < nLimit)
				return GetSensorLink(obj, serviceID, regionID, groupID, nodeID, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(SensorLink.TableName);
			return null;
		}

		public EtcSensorDataHistory CreateEtcSensorDataHistory(EtcSensorDataHistory obj, out string strErrorMessage)
		{
			strErrorMessage = null;
			Dictionary<EtcSensorDataHistory.Fields, object> dicFieldDatas = new Dictionary<EtcSensorDataHistory.Fields, object>();
			dicFieldDatas[EtcSensorDataHistory.Fields.SensorID] = obj.SensorID;
			dicFieldDatas[EtcSensorDataHistory.Fields.TimeStamp] = obj.TimeStamp;
			dicFieldDatas[EtcSensorDataHistory.Fields.SensorValue] = obj.SensorValue;

			string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
				EtcSensorDataHistory.TableName,
				GetFieldNames<EtcSensorDataHistory.Fields>(),
				GetFieldValues(dicFieldDatas));

			ArrayList arrResult = m_dbManager.GetResultData(strSQL);

			if (arrResult != null)
			{
				bool isNullable;
				string strCondition = string.Format(" {0} = {2} order by {0} desc, {1} desc",
					EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.SensorID, out isNullable),
					EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out isNullable),
					obj.SensorID);

				// 가장 마지막에 삽입된 객체를 얻어온다.
				List<EtcSensorDataHistory> datas = m_dataManager.GetSelectManager().SelectEtcSensorDataHistorys(null, strCondition, 1, out strErrorMessage);

				if (datas == null || datas.Count == 0)
					return null;

				if (IsSameEtcSensorDataHistory(obj, datas[0]))
					return datas[0];

				return GetEtcSensorDataHistory(obj, datas[0].SensorID, datas[0].TimeStamp, 2, FindCountLimit, out strErrorMessage);
			}
			else
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
			}

			return null;
		}

		private bool IsSameEtcSensorDataHistory(EtcSensorDataHistory oldObject, EtcSensorDataHistory newObject)
		{
			if (oldObject.SensorID == newObject.SensorID)
				return true;

			return false;
		}

		private EtcSensorDataHistory GetEtcSensorDataHistory(EtcSensorDataHistory obj, int sensorID, DateTime timeStamp, int nCount, int nLimit, out string strErrorMessage)
		{
			bool isNullable;
			string strCondition = string.Format("{0} = {1} and {2} < '{3}' order by {0} desc, {2} desc",
				EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.SensorID, out isNullable), sensorID,
				EtcSensorDataHistory.GetFieldName(EtcSensorDataHistory.Fields.TimeStamp, out isNullable), timeStamp.ToString("yyyy-MM-dd HH:mm:ss"));
			List<EtcSensorDataHistory> datas = m_dataManager.GetSelectManager().SelectEtcSensorDataHistorys(null, strCondition, nCount, out strErrorMessage);

			if (datas == null)
				return null;

			foreach (EtcSensorDataHistory data in datas)
			{
				if (IsSameEtcSensorDataHistory(data, obj))
					return data;

				if (data.TimeStamp < timeStamp)
					timeStamp = data.TimeStamp;
			}

			if (nCount < nLimit)
				return GetEtcSensorDataHistory(obj, sensorID, timeStamp, nCount * 2, nLimit, out strErrorMessage);

			strErrorMessage = GetInsertErrorMessage(EtcSensorDataHistory.TableName);
			return null;
		}

		private bool IsSameTime(DateTime? time1, DateTime? time2)
		{
			if (time1 == null && time2 == null)
				return true;
			else if (time1 == null || time2 == null)
				return false;

			return IsSameTime2((DateTime)time1, (DateTime)time2);
		}

		private bool IsSameTime2(DateTime time1, DateTime time2)
		{
			if (time1.Year == time2.Year &&
				time1.Month == time2.Month &&
				time1.Day == time2.Day &&
				time1.Hour == time2.Hour &&
				time1.Minute == time2.Minute &&
				time1.Second == time2.Second)
				return true;

			return false;
		}

        public EtcSensorData CreateEtcSensorData(EtcSensorData obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<EtcSensorData.Fields, object> dicFieldDatas = new Dictionary<EtcSensorData.Fields, object>();
            dicFieldDatas[EtcSensorData.Fields.SensorID] = obj.SensorID;
            dicFieldDatas[EtcSensorData.Fields.SensorType] = obj.SensorType;
            dicFieldDatas[EtcSensorData.Fields.X] = obj.X;
            dicFieldDatas[EtcSensorData.Fields.Y] = obj.Y;
            dicFieldDatas[EtcSensorData.Fields.Latitude] = obj.Latitude;
            dicFieldDatas[EtcSensorData.Fields.Longitude] = obj.Longitude;


            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                EtcSensorData.TableName,
                GetFieldNames<EtcSensorData.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc, {1} desc",
                    EtcSensorData.GetFieldName(EtcSensorData.Fields.SensorID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<EtcSensorData> datas = m_dataManager.GetSelectManager().SelectEtcSensorDatas(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameEtcSensorData(obj, datas[0]))
                    return datas[0];

                return GetEtcSensorData(obj, datas[0].SensorID, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameEtcSensorData(EtcSensorData oldObject, EtcSensorData newObject)
        {
            if (oldObject.SensorID == newObject.SensorID)
                return true;

            return false;
        }

        private EtcSensorData GetEtcSensorData(EtcSensorData obj, int sensorID, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} = {1} order by {0} desc",
                EtcSensorData.GetFieldName(EtcSensorData.Fields.SensorID, out isNullable), 
				sensorID);
            List<EtcSensorData> datas = m_dataManager.GetSelectManager().SelectEtcSensorDatas(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (EtcSensorData data in datas)
            {
                if (IsSameEtcSensorData(data, obj))
                    return data;

            }

            if (nCount < nLimit)
                return GetEtcSensorData(obj, sensorID, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(EtcSensorDataHistory.TableName);
            return null;
        }

        public AirNode CreateAirNode(AirNode obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<AirNode.Fields, object> dicFieldDatas = new Dictionary<AirNode.Fields, object>();
            dicFieldDatas[AirNode.Fields.ID] = obj.ID;
            dicFieldDatas[AirNode.Fields.SiteNm] = obj.SiteNm;
            dicFieldDatas[AirNode.Fields.X] = obj.X;
            dicFieldDatas[AirNode.Fields.Y] = obj.Y;
            dicFieldDatas[AirNode.Fields.Addr] = obj.Addr;
            dicFieldDatas[AirNode.Fields.Year] = obj.Year;
			dicFieldDatas[AirNode.Fields.MangName] = obj.MangName;
			dicFieldDatas[AirNode.Fields.Item] = obj.Item;


            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                AirNode.TableName,
                GetFieldNames<AirNode.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc, {1} desc",
                    AirNode.GetFieldName(AirNode.Fields.ID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<AirNode> datas = m_dataManager.GetSelectManager().SelectAirNodes(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameAirNode(obj, datas[0]))
                    return datas[0];

                return GetAirNode(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameAirNode(AirNode oldObject, AirNode newObject)
        {
            if (oldObject.ID == newObject.ID)
                return true;

            return false;
        }

        private AirNode GetAirNode(AirNode obj, int nodeID, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} = {1} order by {0} desc",
                AirNode.GetFieldName(AirNode.Fields.ID, out isNullable),
                nodeID);
            List<AirNode> datas = m_dataManager.GetSelectManager().SelectAirNodes(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (AirNode data in datas)
            {
                if (IsSameAirNode(data, obj))
                    return data;

            }

            if (nCount < nLimit)
                return GetAirNode(obj, nodeID, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(AirNode.TableName);
            return null;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        public AirDataHistory CreateAirDataHistory(AirDataHistory obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<AirDataHistory.Fields, object> dicFieldDatas = new Dictionary<AirDataHistory.Fields, object>();
            dicFieldDatas[AirDataHistory.Fields.ID] = obj.SiteID;
            dicFieldDatas[AirDataHistory.Fields.SiteID] = obj.SiteID;
            dicFieldDatas[AirDataHistory.Fields.LogDate] = obj.LogDate;
            dicFieldDatas[AirDataHistory.Fields.SO2] = obj.SO2;
            dicFieldDatas[AirDataHistory.Fields.NO2] = obj.NO2;
            dicFieldDatas[AirDataHistory.Fields.O3] = obj.O3;
            dicFieldDatas[AirDataHistory.Fields.CO] = obj.CO;
            dicFieldDatas[AirDataHistory.Fields.PM10] = obj.PM10;
            dicFieldDatas[AirDataHistory.Fields.PM25] = obj.PM25;
            dicFieldDatas[AirDataHistory.Fields.PM10Daily] = obj.PM10Daily;
            dicFieldDatas[AirDataHistory.Fields.PM25Daily] = obj.PM25Daily;
            dicFieldDatas[AirDataHistory.Fields.Khai] = obj.Khai;
            dicFieldDatas[AirDataHistory.Fields.SO2Grade] = obj.SO2Grade;
            dicFieldDatas[AirDataHistory.Fields.NO2Grade] = obj.NO2Grade;
            dicFieldDatas[AirDataHistory.Fields.O3Grade] = obj.O3Grade;
            dicFieldDatas[AirDataHistory.Fields.COGrade] = obj.COGrade;
            dicFieldDatas[AirDataHistory.Fields.PM10Grade] = obj.PM10Grade;
            dicFieldDatas[AirDataHistory.Fields.PM25Grade] = obj.PM25Grade;
            dicFieldDatas[AirDataHistory.Fields.PM10Grade1h] = obj.PM10Grade1h;
            dicFieldDatas[AirDataHistory.Fields.PM25Grade1h] = obj.PM25Grade1h;
            dicFieldDatas[AirDataHistory.Fields.KhaiGrade] = obj.KhaiGrade;
            dicFieldDatas[AirDataHistory.Fields.SO2Flag] = obj.SO2Flag;
            dicFieldDatas[AirDataHistory.Fields.NO2Flag] = obj.NO2Flag;
            dicFieldDatas[AirDataHistory.Fields.O3Flag] = obj.O3Flag;
            dicFieldDatas[AirDataHistory.Fields.COFlag] = obj.COFlag;
            dicFieldDatas[AirDataHistory.Fields.PM10Flag] = obj.PM10Flag;
            dicFieldDatas[AirDataHistory.Fields.PM25Flag] = obj.PM25Flag;

            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                AirDataHistory.TableName,
                GetFieldNames<AirDataHistory.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc",
                    AirDataHistory.GetFieldName(AirDataHistory.Fields.ID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<AirDataHistory> datas = m_dataManager.GetSelectManager().SelectAirDataHistories(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameAirDataHistory(obj, datas[0]))
                    return datas[0];

                return GetAirDataHistory(obj, datas[0].ID, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameAirDataHistory(AirDataHistory oldObject, AirDataHistory newObject)
        {
            if (oldObject.ID == newObject.ID)
                return true;

            return false;
        }

        private AirDataHistory GetAirDataHistory(AirDataHistory obj, int nodeID, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0} = {1} order by {0} desc",
                AirDataHistory.GetFieldName(AirDataHistory.Fields.ID, out isNullable),
                nodeID);
            List<AirDataHistory> datas = m_dataManager.GetSelectManager().SelectAirDataHistories(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (AirDataHistory data in datas)
            {
                if (IsSameAirDataHistory(data, obj))
                    return data;

            }

            if (nCount < nLimit)
                return GetAirDataHistory(obj, nodeID, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(AirDataHistory.TableName);
            return null;
        }



        public KmaAsos CreateKmaAsos(KmaAsos obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<KmaAsos.Fields, object> dicFieldDatas = new Dictionary<KmaAsos.Fields, object>();
            dicFieldDatas[KmaAsos.Fields.ID] = 1;
            dicFieldDatas[KmaAsos.Fields.LogDate] = obj.LogDate;
            dicFieldDatas[KmaAsos.Fields.WD] = obj.WD;
            dicFieldDatas[KmaAsos.Fields.WS] = obj.WS;
            dicFieldDatas[KmaAsos.Fields.Pressure] = obj.Pressure;
            dicFieldDatas[KmaAsos.Fields.SeaLevelPressure] = obj.SeaLevelPressure;
            dicFieldDatas[KmaAsos.Fields.Temperature] = obj.Temperature;
            dicFieldDatas[KmaAsos.Fields.DewPointTemp] = obj.DewPointTemp;
            dicFieldDatas[KmaAsos.Fields.Humidity] = obj.Humidity;
            dicFieldDatas[KmaAsos.Fields.Evaporation] = obj.Evaporation;
            dicFieldDatas[KmaAsos.Fields.Rainfall] = obj.Rainfall;
            dicFieldDatas[KmaAsos.Fields.Snowfall3hr] = obj.Snowfall3hr;
            dicFieldDatas[KmaAsos.Fields.SnowfallDay] = obj.SnowfallDay;
            dicFieldDatas[KmaAsos.Fields.SnowfallCover] = obj.SnowfallCover;
            dicFieldDatas[KmaAsos.Fields.CurrentWeather] = obj.CurrentWeather;
            dicFieldDatas[KmaAsos.Fields.CloudAmount] = obj.CloudAmount;
            dicFieldDatas[KmaAsos.Fields.CloudAmountMid] = obj.CloudAmountMid;
            dicFieldDatas[KmaAsos.Fields.CloudHeightMin] = obj.CloudHeightMin;
            dicFieldDatas[KmaAsos.Fields.Visibility] = obj.Visibility;
            dicFieldDatas[KmaAsos.Fields.HourSunshine] = obj.HourSunshine;
            dicFieldDatas[KmaAsos.Fields.HoursolarRadiation] = obj.HoursolarRadiation;
            dicFieldDatas[KmaAsos.Fields.GrounStatusCode] = obj.GrounStatusCode;
            dicFieldDatas[KmaAsos.Fields.Grounttemp] = obj.Grounttemp;
            dicFieldDatas[KmaAsos.Fields.Temperature005m] = obj.Temperature005m;
            dicFieldDatas[KmaAsos.Fields.Temperature01m] = obj.Temperature01m;
            dicFieldDatas[KmaAsos.Fields.Temperature02m] = obj.Temperature02m;
            dicFieldDatas[KmaAsos.Fields.Temperature03m] = obj.Temperature03m;
            dicFieldDatas[KmaAsos.Fields.RainfallDay] = obj.RainfallDay;
            dicFieldDatas[KmaAsos.Fields.StnID] = obj.StnID;

            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                KmaAsos.TableName,
                GetFieldNames<KmaAsos.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc",
                    KmaAsos.GetFieldName(KmaAsos.Fields.LogDate, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<KmaAsos> datas = m_dataManager.GetSelectManager().SelectKmaAsoses(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameKmaAsos(obj, datas[0]))
                    return datas[0];

                return GetKmaAsos(obj, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameKmaAsos(KmaAsos oldObject, KmaAsos newObject)
        {
            if (oldObject.LogDate == newObject.LogDate)
                return true;

            return false;
        }

        private KmaAsos GetKmaAsos(KmaAsos obj, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("order by {0} desc",
                KmaAsos.GetFieldName(KmaAsos.Fields.LogDate, out isNullable));
            List<KmaAsos> datas = m_dataManager.GetSelectManager().SelectKmaAsoses(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (KmaAsos data in datas)
            {
                if (IsSameKmaAsos(data, obj))
                    return data;

            }

            if (nCount < nLimit)
                return GetKmaAsos(obj, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(KmaAsos.TableName);
            return null;
        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        public CleanSYS CreateCleanSYS(CleanSYS obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<CleanSYS.Fields, object> dicFieldDatas = new Dictionary<CleanSYS.Fields, object>();
            dicFieldDatas[CleanSYS.Fields.AreaNM] = obj.AreaNM;
            dicFieldDatas[CleanSYS.Fields.FactManageNM] = obj.FactManageNM;
            dicFieldDatas[CleanSYS.Fields.StackCode] = obj.StackCode;
            dicFieldDatas[CleanSYS.Fields.MeasureDT] = obj.MeasureDT;
            dicFieldDatas[CleanSYS.Fields.TspExhstpermstdValue] = obj.TspExhstpermstdValue;
            dicFieldDatas[CleanSYS.Fields.TspMeasureValue] = obj.TspMeasureValue;
            dicFieldDatas[CleanSYS.Fields.SoxExhstpermstdValue] = obj.SoxExhstpermstdValue;
            dicFieldDatas[CleanSYS.Fields.SoxMeasureValue] = obj.SoxMeasureValue;
            dicFieldDatas[CleanSYS.Fields.NoxExhstpermstdValue] = obj.NoxExhstpermstdValue;
            dicFieldDatas[CleanSYS.Fields.NoxMeasureValue] = obj.NoxMeasureValue;
            dicFieldDatas[CleanSYS.Fields.HclExhstpermstdValue] = obj.HclExhstpermstdValue;
            dicFieldDatas[CleanSYS.Fields.HclMeasureValue] = obj.HclMeasureValue;
            dicFieldDatas[CleanSYS.Fields.HfExhstpermstdValue] = obj.HfExhstpermstdValue;
            dicFieldDatas[CleanSYS.Fields.HfMeasureValue] = obj.HfMeasureValue;
            dicFieldDatas[CleanSYS.Fields.Nh3ExhstpermstdValue] = obj.Nh3ExhstpermstdValue;
            dicFieldDatas[CleanSYS.Fields.Nh3MeasureValue] = obj.Nh3MeasureValue;
            dicFieldDatas[CleanSYS.Fields.CoExhstpermstdValue] = obj.CoExhstpermstdValue;
            dicFieldDatas[CleanSYS.Fields.CoMeasureValue] = obj.CoMeasureValue;
            

            string strSQL = string.Format("Insert into {0} ({1}) values ({2})",
                CleanSYS.TableName,
                GetFieldNames<CleanSYS.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc",
                    CleanSYS.GetFieldName(CleanSYS.Fields.FactManageNM, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<CleanSYS> datas = m_dataManager.GetSelectManager().SelectCleanSYSs(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameCleanSYS(obj, datas[0]))
                    return datas[0];

                return GetCleanSYS(obj, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameCleanSYS(CleanSYS oldObject, CleanSYS newObject)
        {
            if (oldObject.MeasureDT == newObject.MeasureDT)
                return true;

            return false;
        }

        private CleanSYS GetCleanSYS(CleanSYS obj, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("order by {0} desc",
                CleanSYS.GetFieldName(CleanSYS.Fields.FactManageNM, out isNullable));
            List<CleanSYS> datas = m_dataManager.GetSelectManager().SelectCleanSYSs(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (CleanSYS data in datas)
            {
                if (IsSameCleanSYS(data, obj))
                    return data;

            }

            if (nCount < nLimit)
                return GetCleanSYS(obj, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(CleanSYS.TableName);
            return null;
        }

        public OptionSDMS CreateYeosuOptionSDMS(OptionSDMS obj, out string strErrorMessage)
        {
            strErrorMessage = null;
            Dictionary<OptionSDMS.Fields, object> dicFieldDatas = new Dictionary<OptionSDMS.Fields, object>();
            dicFieldDatas[OptionSDMS.Fields.PropertyName] = obj.PropertyName;
            dicFieldDatas[OptionSDMS.Fields.PropertyValue] = obj.PropertyValue;
            dicFieldDatas[OptionSDMS.Fields.SiteID] = obj.SiteID;
            dicFieldDatas[OptionSDMS.Fields.Description] = obj.Description;


            string strSQL = string.Format("Insert into {0} ({1}) values (IsNull((SELECT MAX(ID) FROM {0} C), 0) + 1, {2})",
                OptionSDMS.TableName,
                GetFieldNames<OptionSDMS.Fields>(),
                GetFieldValues(dicFieldDatas));

            ArrayList arrResult = m_dbManager.GetResultData(strSQL);

            if (arrResult != null)
            {
                bool isNullable;
                string strCondition = string.Format("order by {0} desc",
                    OptionSDMS.GetFieldName(OptionSDMS.Fields.ID, out isNullable));

                // 가장 마지막에 삽입된 객체를 얻어온다.
                List<OptionSDMS> datas = m_dataManager.GetSelectManager().SelectAllYeosuOptionSDMS(null, strCondition, 1, out strErrorMessage);

                if (datas == null || datas.Count == 0)
                    return null;

                if (IsSameYeosuOptionSDMS(obj, datas[0]))
                    return datas[0];

                return GetYeosuOptionSDMS(obj, 2, FindCountLimit, out strErrorMessage);
            }
            else
            {
                strErrorMessage = m_dbManager.LastErrorMessage;
            }

            return null;
        }

        private bool IsSameYeosuOptionSDMS(OptionSDMS oldObject, OptionSDMS newObject)
        {
            if (oldObject.ID == newObject.ID)
                return true;

            return false;
        }

        private OptionSDMS GetYeosuOptionSDMS(OptionSDMS obj, int nCount, int nLimit, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("order by {0} desc",
                OptionSDMS.GetFieldName(OptionSDMS.Fields.ID, out isNullable));
            List<OptionSDMS> datas = m_dataManager.GetSelectManager().SelectAllYeosuOptionSDMS(null, strCondition, nCount, out strErrorMessage);

            if (datas == null)
                return null;

            foreach (OptionSDMS data in datas)
            {
                if (IsSameYeosuOptionSDMS(data, obj))
                    return data;

            }

            if (nCount < nLimit)
                return GetYeosuOptionSDMS(obj, nCount * 2, nLimit, out strErrorMessage);

            strErrorMessage = GetInsertErrorMessage(OptionSDMS.TableName);
            return null;
        }
    }
	
}

