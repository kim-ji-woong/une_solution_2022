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
	public class UpdateManager : QueryManager, IUpdate
	{
		private DataManager m_dataManager = null;

		public UpdateManager(DataManager dataManager)
		{
			m_dataManager = dataManager;
			m_dbManager = m_dataManager.GetDBManager() as DirectDBManager;
		}

		public bool UpdateFromCondition(string strTableName, string strSets, string strCondition, string strAdditionalConditions, out string strErrorMessage)
		{
			if (strAdditionalConditions != null && strAdditionalConditions.Length > 0)
			{
				if (strCondition.Length > 0)
					strCondition += " and " + strAdditionalConditions;
				else
					strCondition = strAdditionalConditions;
			}

			string strSQL = string.Format("Update {0} set {1} where {2}", strTableName, strSets, strCondition);

			if (m_dbManager.GetResultData(strSQL) == null)
			{
				strErrorMessage = m_dbManager.LastErrorMessage;
				return false;
			}

			strErrorMessage = null;
			return true;
		}

		public bool UpdateMaterialLink(MaterialLink obj, out string strErrorMessage)
		{
			Dictionary<MaterialLink.Fields, object> dicSets = new Dictionary<MaterialLink.Fields, object>();
			dicSets[MaterialLink.Fields.MaterialID] = obj.MaterialID;
			dicSets[MaterialLink.Fields.UniqueID] = obj.UniqueID;
			dicSets[MaterialLink.Fields.Min1] = obj.Min1;
			dicSets[MaterialLink.Fields.Max1] = obj.Max1;
			dicSets[MaterialLink.Fields.Min2] = obj.Min2;
			dicSets[MaterialLink.Fields.Max2] = obj.Max2;
			dicSets[MaterialLink.Fields.Direction] = obj.Direction;

			Dictionary<MaterialLink.Fields, object> dicConditions = new Dictionary<MaterialLink.Fields, object>();

			return UpdateMaterialLink(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateMaterialLink(Dictionary<MaterialLink.Fields, object> dicSets, Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<MaterialLink.Fields>(ref strSets, dicSets, MaterialLink.GetFieldName, MaterialLink.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<MaterialLink.Fields>(ref strCondition, dicConditions, MaterialLink.GetFieldName, MaterialLink.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(MaterialLink.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}


		public bool UpdateSensorLink(SensorLink obj, out string strErrorMessage)
		{
			Dictionary<SensorLink.Fields, object> dicSets = new Dictionary<SensorLink.Fields, object>();
			dicSets[SensorLink.Fields.SensorName] = obj.SensorName;

			Dictionary<SensorLink.Fields, object> dicConditions = new Dictionary<SensorLink.Fields, object>();
			dicConditions[SensorLink.Fields.ServiceID] = obj.ServiceID;
			dicConditions[SensorLink.Fields.RegionID] = obj.RegionID;
			dicConditions[SensorLink.Fields.GroupID] = obj.GroupID;
			dicConditions[SensorLink.Fields.NodeID] = obj.NodeID;

			return UpdateSensorLink(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateSensorLink(Dictionary<SensorLink.Fields, object> dicSets, Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<SensorLink.Fields>(ref strSets, dicSets, SensorLink.GetFieldName, SensorLink.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<SensorLink.Fields>(ref strCondition, dicConditions, SensorLink.GetFieldName, SensorLink.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(SensorLink.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

		public bool UpdateEtcSensorDataHistory(EtcSensorDataHistory obj, out string strErrorMessage)
		{
			Dictionary<EtcSensorDataHistory.Fields, object> dicSets = new Dictionary<EtcSensorDataHistory.Fields, object>();
			dicSets[EtcSensorDataHistory.Fields.SensorValue] = obj.SensorValue;

			Dictionary<EtcSensorDataHistory.Fields, object> dicConditions = new Dictionary<EtcSensorDataHistory.Fields, object>();
			dicConditions[EtcSensorDataHistory.Fields.SensorID] = obj.SensorID;
			dicConditions[EtcSensorDataHistory.Fields.TimeStamp] = obj.TimeStamp;

			return UpdateEtcSensorDataHistory(dicSets, dicConditions, null, out strErrorMessage);
		}

		public bool UpdateEtcSensorDataHistory(Dictionary<EtcSensorDataHistory.Fields, object> dicSets, Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
			strErrorMessage = null;
			string strCondition = "";
			string strSets = "";

			if (SetData<EtcSensorDataHistory.Fields>(ref strSets, dicSets, EtcSensorDataHistory.GetFieldName, EtcSensorDataHistory.TableName, ref strErrorMessage) == false)
				return false;
			if (SetCondition<EtcSensorDataHistory.Fields>(ref strCondition, dicConditions, EtcSensorDataHistory.GetFieldName, EtcSensorDataHistory.TableName, ref strErrorMessage) == false)
				return false;

			return UpdateFromCondition(EtcSensorDataHistory.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
		}

        public bool UpdateEtcSensorData(EtcSensorData obj, out string strErrorMessage)
        {
            Dictionary<EtcSensorData.Fields, object> dicSets = new Dictionary<EtcSensorData.Fields, object>();
            dicSets[EtcSensorData.Fields.SensorType] = obj.SensorType;
            dicSets[EtcSensorData.Fields.X] = obj.X;
            dicSets[EtcSensorData.Fields.Y] = obj.Y;
            dicSets[EtcSensorData.Fields.Latitude] = obj.Latitude;
            dicSets[EtcSensorData.Fields.Longitude] = obj.Longitude;
            dicSets[EtcSensorData.Fields.PositionName] = obj.PositionName;

            Dictionary<EtcSensorData.Fields, object> dicConditions = new Dictionary<EtcSensorData.Fields, object>();
            dicConditions[EtcSensorData.Fields.ID] = obj.ID;

            return UpdateEtcSensorData(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateEtcSensorData(Dictionary<EtcSensorData.Fields, object> dicSets, Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<EtcSensorData.Fields>(ref strSets, dicSets, EtcSensorData.GetFieldName, EtcSensorData.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<EtcSensorData.Fields>(ref strCondition, dicConditions, EtcSensorData.GetFieldName, EtcSensorData.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(EtcSensorData.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }

        public bool UpdateAirNode(AirNode obj, out string strErrorMessage)
        {
            Dictionary<AirNode.Fields, object> dicSets = new Dictionary<AirNode.Fields, object>();
            dicSets[AirNode.Fields.SiteNm] = obj.SiteNm;
            dicSets[AirNode.Fields.X] = obj.X;
            dicSets[AirNode.Fields.Y] = obj.Y;
            dicSets[AirNode.Fields.Year] = obj.Year;
            dicSets[AirNode.Fields.Addr] = obj.Addr;
			dicSets[AirNode.Fields.MangName] = obj.MangName;
			dicSets[AirNode.Fields.Item] = obj.Item;


            Dictionary<AirNode.Fields, object> dicConditions = new Dictionary<AirNode.Fields, object>();
            dicConditions[AirNode.Fields.ID] = obj.ID;

            return UpdateAirNode(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateAirNode(Dictionary<AirNode.Fields, object> dicSets, Dictionary<AirNode.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<AirNode.Fields>(ref strSets, dicSets, AirNode.GetFieldName, AirNode.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<AirNode.Fields>(ref strCondition, dicConditions, AirNode.GetFieldName, AirNode.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(AirNode.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }

		public bool UpdateAirDataHistory(AirDataHistory obj, out string strErrorMessage)
		{
			Dictionary<AirDataHistory.Fields, object> dicSets = new Dictionary<AirDataHistory.Fields, object>();
			dicSets[AirDataHistory.Fields.SiteID] = obj.SiteID;
			dicSets[AirDataHistory.Fields.LogDate] = obj.LogDate;
			dicSets[AirDataHistory.Fields.SO2] = obj.SO2;
			dicSets[AirDataHistory.Fields.NO2] = obj.NO2;
			dicSets[AirDataHistory.Fields.O3] = obj.O3;
			dicSets[AirDataHistory.Fields.CO] = obj.CO;
			dicSets[AirDataHistory.Fields.PM10] = obj.PM10;
			dicSets[AirDataHistory.Fields.PM25] = obj.PM25;
			dicSets[AirDataHistory.Fields.PM10Daily] = obj.PM10Daily;
			dicSets[AirDataHistory.Fields.PM25Daily] = obj.PM25Daily;
			dicSets[AirDataHistory.Fields.Khai] = obj.Khai;
			dicSets[AirDataHistory.Fields.SO2Grade] = obj.SO2Grade;
			dicSets[AirDataHistory.Fields.NO2Grade] = obj.NO2Grade;
			dicSets[AirDataHistory.Fields.O3Grade] = obj.O3Grade;
			dicSets[AirDataHistory.Fields.COGrade] = obj.COGrade;
			dicSets[AirDataHistory.Fields.PM10Grade] = obj.PM10Grade;
			dicSets[AirDataHistory.Fields.PM25Grade] = obj.PM25Grade;
			dicSets[AirDataHistory.Fields.PM25Grade1h] = obj.PM25Grade1h;
			dicSets[AirDataHistory.Fields.PM10Grade1h] = obj.PM10Grade1h;
			dicSets[AirDataHistory.Fields.KhaiGrade] = obj.KhaiGrade;
			dicSets[AirDataHistory.Fields.SO2Flag] = obj.SO2Flag;
			dicSets[AirDataHistory.Fields.NO2Flag] = obj.NO2Flag;
			dicSets[AirDataHistory.Fields.O3Flag] = obj.O3Flag;
			dicSets[AirDataHistory.Fields.COFlag] = obj.COFlag;
			dicSets[AirDataHistory.Fields.PM10Flag] = obj.PM10Flag;
			dicSets[AirDataHistory.Fields.PM25Flag] = obj.PM25Flag;

            Dictionary<AirDataHistory.Fields, object> dicConditions = new Dictionary<AirDataHistory.Fields, object>();
            dicConditions[AirDataHistory.Fields.ID] = obj.SiteID;

            return UpdateAirDataHistory(dicSets, dicConditions, null, out strErrorMessage);
        }

		public bool UpdateAirDataHistory(Dictionary<AirDataHistory.Fields, object> dicSets, Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
		{
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<AirDataHistory.Fields>(ref strSets, dicSets, AirDataHistory.GetFieldName, AirDataHistory.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<AirDataHistory.Fields>(ref strCondition, dicConditions, AirDataHistory.GetFieldName, AirDataHistory.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(AirDataHistory.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }

        public bool UpdateKmaAsos(KmaAsos obj, out string strErrorMessage)
        {
            Dictionary<KmaAsos.Fields, object> dicSets = new Dictionary<KmaAsos.Fields, object>();
            dicSets[KmaAsos.Fields.LogDate] = obj.LogDate;
            dicSets[KmaAsos.Fields.WD] = obj.WD;
            dicSets[KmaAsos.Fields.WS] = obj.WS;
            dicSets[KmaAsos.Fields.Pressure] = obj.Pressure;
            dicSets[KmaAsos.Fields.SeaLevelPressure] = obj.SeaLevelPressure;
            dicSets[KmaAsos.Fields.Temperature] = obj.Temperature;
            dicSets[KmaAsos.Fields.DewPointTemp] = obj.DewPointTemp;
            dicSets[KmaAsos.Fields.Humidity] = obj.Humidity;
            dicSets[KmaAsos.Fields.Evaporation] = obj.Evaporation;
            dicSets[KmaAsos.Fields.Rainfall] = obj.Rainfall;
            dicSets[KmaAsos.Fields.Snowfall3hr] = obj.Snowfall3hr;
            dicSets[KmaAsos.Fields.SnowfallDay] = obj.SnowfallDay;
            dicSets[KmaAsos.Fields.SnowfallCover] = obj.SnowfallCover;
            dicSets[KmaAsos.Fields.CurrentWeather] = obj.CurrentWeather;
            dicSets[KmaAsos.Fields.CloudAmount] = obj.CloudAmount;
            dicSets[KmaAsos.Fields.CloudAmountMid] = obj.CloudAmountMid;
            dicSets[KmaAsos.Fields.CloudAmountMid] = obj.CloudAmountMid;
            dicSets[KmaAsos.Fields.CloudHeightMin] = obj.CloudHeightMin;
            dicSets[KmaAsos.Fields.Visibility] = obj.Visibility;
            dicSets[KmaAsos.Fields.HourSunshine] = obj.HourSunshine;
            dicSets[KmaAsos.Fields.HoursolarRadiation] = obj.HoursolarRadiation;
            dicSets[KmaAsos.Fields.GrounStatusCode] = obj.GrounStatusCode;
            dicSets[KmaAsos.Fields.Grounttemp] = obj.Grounttemp;
            dicSets[KmaAsos.Fields.Temperature005m] = obj.Temperature005m;
            dicSets[KmaAsos.Fields.Temperature01m] = obj.Temperature01m;
            dicSets[KmaAsos.Fields.Temperature02m] = obj.Temperature02m;
            dicSets[KmaAsos.Fields.Temperature03m] = obj.Temperature03m;
            dicSets[KmaAsos.Fields.RainfallDay] = obj.RainfallDay;
            dicSets[KmaAsos.Fields.StnID] = obj.StnID;

            Dictionary<KmaAsos.Fields, object> dicConditions = new Dictionary<KmaAsos.Fields, object>();
            dicConditions[KmaAsos.Fields.ID] = obj.ID;

            return UpdateKmaAsos(dicSets, dicConditions, null, out strErrorMessage);
         }

        public bool UpdateKmaAsos(Dictionary<KmaAsos.Fields, object> dicSets, Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<KmaAsos.Fields>(ref strSets, dicSets, KmaAsos.GetFieldName, KmaAsos.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<KmaAsos.Fields>(ref strCondition, dicConditions, KmaAsos.GetFieldName, KmaAsos.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(KmaAsos.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }

        public bool UpdateCleanSYS(CleanSYS obj, out string strErrorMessage)
        {
            Dictionary<CleanSYS.Fields, object> dicSets = new Dictionary<CleanSYS.Fields, object>();
            dicSets[CleanSYS.Fields.AreaNM] = obj.AreaNM;
            dicSets[CleanSYS.Fields.FactManageNM] = obj.FactManageNM;
            dicSets[CleanSYS.Fields.StackCode] = obj.StackCode;
            dicSets[CleanSYS.Fields.MeasureDT] = obj.MeasureDT;
            dicSets[CleanSYS.Fields.TspExhstpermstdValue] = obj.TspExhstpermstdValue;
            dicSets[CleanSYS.Fields.TspMeasureValue] = obj.TspMeasureValue;
            dicSets[CleanSYS.Fields.SoxExhstpermstdValue] = obj.SoxExhstpermstdValue;
            dicSets[CleanSYS.Fields.SoxMeasureValue] = obj.SoxMeasureValue;
            dicSets[CleanSYS.Fields.NoxExhstpermstdValue] = obj.NoxExhstpermstdValue;
            dicSets[CleanSYS.Fields.NoxMeasureValue] = obj.NoxMeasureValue;
            dicSets[CleanSYS.Fields.HclExhstpermstdValue] = obj.HclExhstpermstdValue;
            dicSets[CleanSYS.Fields.HclMeasureValue] = obj.HclMeasureValue;
            dicSets[CleanSYS.Fields.HfExhstpermstdValue] = obj.HfExhstpermstdValue;
            dicSets[CleanSYS.Fields.HfMeasureValue] = obj.HfMeasureValue;
            dicSets[CleanSYS.Fields.Nh3ExhstpermstdValue] = obj.Nh3ExhstpermstdValue;
            dicSets[CleanSYS.Fields.Nh3MeasureValue] = obj.Nh3MeasureValue;
            dicSets[CleanSYS.Fields.CoExhstpermstdValue] = obj.CoExhstpermstdValue;
            dicSets[CleanSYS.Fields.CoMeasureValue] = obj.CoMeasureValue;

            Dictionary<CleanSYS.Fields, object> dicConditions = new Dictionary<CleanSYS.Fields, object>();
            dicConditions[CleanSYS.Fields.MeasureDT] = obj.MeasureDT;

            return UpdateCleanSYS(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateCleanSYS(Dictionary<CleanSYS.Fields, object> dicSets, Dictionary<CleanSYS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<CleanSYS.Fields>(ref strSets, dicSets, CleanSYS.GetFieldName, CleanSYS.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<CleanSYS.Fields>(ref strCondition, dicConditions, CleanSYS.GetFieldName, CleanSYS.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(CleanSYS.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }

        public bool UpdateYeosuOptionSDMS(OptionSDMS obj, out string strErrorMessage)
        {
            Dictionary<OptionSDMS.Fields, object> dicSets = new Dictionary<OptionSDMS.Fields, object>();
            dicSets[OptionSDMS.Fields.ID] = obj.ID;
            dicSets[OptionSDMS.Fields.PropertyName] = obj.PropertyName;
            dicSets[OptionSDMS.Fields.PropertyValue] = obj.PropertyValue;
            dicSets[OptionSDMS.Fields.SiteID] = obj.SiteID;
            dicSets[OptionSDMS.Fields.Description] = obj.Description;

            Dictionary<OptionSDMS.Fields, object> dicConditions = new Dictionary<OptionSDMS.Fields, object>();
            dicConditions[OptionSDMS.Fields.ID] = obj.ID;

            return UpdateYeosuOptionSDMS(dicSets, dicConditions, null, out strErrorMessage);
        }

        public bool UpdateYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicSets, Dictionary<OptionSDMS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage)
        {
            strErrorMessage = null;
            string strCondition = "";
            string strSets = "";

            if (SetData<OptionSDMS.Fields>(ref strSets, dicSets, OptionSDMS.GetFieldName, OptionSDMS.TableName, ref strErrorMessage) == false)
                return false;
            if (SetCondition<OptionSDMS.Fields>(ref strCondition, dicConditions, OptionSDMS.GetFieldName, OptionSDMS.TableName, ref strErrorMessage) == false)
                return false;

            return UpdateFromCondition(OptionSDMS.TableName, strSets, strCondition, strAdditionalConditions, out strErrorMessage);
        }
    }
}
