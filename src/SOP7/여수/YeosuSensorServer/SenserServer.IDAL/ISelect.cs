using System;
using System.Collections.Generic;
using SensorServer.Model.Yeosu;
using SensorServer.Model.Yeosu.External;
using SensorServer.Model.Yeosu.Option;
using SensorServer.Model.Yeosu.Public;

namespace SensorServer.IDAL
{
	public interface ISelect
	{
        int GetMaxID(string strTableName, out string strErrorMessage, string strCondition = "");
        List<MaterialLink> SelectMaterialLinks(Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<MaterialLink> SelectMaterialLinks(Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		SensorLink SelectSensorLink(int serviceID, int regionID, int groupID, int nodeID, out string strErrorMessage);
		List<SensorLink> SelectSensorLinks(Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SensorLink> SelectSensorLinks(Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		EtcSensorDataHistory SelectEtcSensorDataHistory(int sensorID, out string strErrorMessage);
		List<EtcSensorDataHistory> SelectEtcSensorDataHistorys(Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<EtcSensorDataHistory> SelectEtcSensorDataHistorys(Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		EtcSensorData SelectEtcSensorData(int sensorID, out string strErrorMessage);
		List<EtcSensorData> SelectEtcSensorDatas(Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<EtcSensorData> SelectEtcSensorDatas(Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		AirNode SelectAirNode(int nodeID, out string strErrorMessage);
		List<AirNode> SelectAirNodes(Dictionary<AirNode.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<AirNode> SelectAirNodes(Dictionary<AirNode.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		AirDataHistory SelectAirDataHistory(int nodeID, out string strErrorMessage);
		List<AirDataHistory> SelectAirDataHistories(Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        List<AirDataHistory> SelectAirDataHistories(Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);


		KmaAsos SelectKmaAsos(int kmaID, out string strErrorMessage);
		List<KmaAsos> SelectKmaAsoses(Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<KmaAsos> SelectKmaAsoses(Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<CleanSYS> SelectCleanSYSs(Dictionary<CleanSYS.Fields, object> dicConditionsm, string strAdditionalConditions, out string strErrorMessage);
		List<CleanSYS> SelectCleanSYSs(Dictionary<CleanSYS.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

        List<OptionSDMS> SelectAllYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicConditionsm, string strAdditionalConditions, out string strErrorMessage);
        List<OptionSDMS> SelectAllYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
    }
}
