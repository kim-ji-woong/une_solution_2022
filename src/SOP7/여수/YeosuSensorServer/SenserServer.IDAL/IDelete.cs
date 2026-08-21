using System;
using System.Collections.Generic;
using SensorServer.Model.Yeosu;
using SensorServer.Model.Yeosu.External;
using SensorServer.Model.Yeosu.Option;
using SensorServer.Model.Yeosu.Public;

namespace SensorServer.IDAL
{
	public interface IDelete
	{
		bool DeleteMaterialLink(Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteSensorLink(int serviceID, int regionID, int groupID, int nodeID, out string strErrorMessage);
		bool DeleteSensorLink(Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteEtcSensorDataHistory(int sensorID, DateTime timeStamp, out string strErrorMessage);
		bool DeleteEtcSensorDataHistory(Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        bool DeleteEtcSensorData(Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteAirNode(int airNodeID, out string strErrorMessage);
		bool DeleteAirDataHistory(int airNodeID, out string strErrorMessage);
		bool DeleteAirDataHistory(Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteKmaAsos(int kmaID, out string strErrorMessage);
		bool DeleteKmaAsos(Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool DeleteCleanSYS(string factManageNM, out string strErrorMessage);
		bool DeleteCleanSYSs(Dictionary<CleanSYS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteYeosuOptionSDMS(int ID, out string strErrorMessage);
		bool DeleteYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
    }
}
