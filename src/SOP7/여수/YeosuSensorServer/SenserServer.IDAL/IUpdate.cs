using System.Collections.Generic;
using SensorServer.Model.Yeosu;
using SensorServer.Model.Yeosu.External;
using SensorServer.Model.Yeosu.Option;
using SensorServer.Model.Yeosu.Public;

namespace SensorServer.IDAL
{
	public interface IUpdate
	{
		bool UpdateMaterialLink(MaterialLink obj, out string strErrorMessage);
		bool UpdateMaterialLink(Dictionary<MaterialLink.Fields, object> dicSets, Dictionary<MaterialLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateSensorLink(SensorLink obj, out string strErrorMessage);
		bool UpdateSensorLink(Dictionary<SensorLink.Fields, object> dicSets, Dictionary<SensorLink.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateEtcSensorDataHistory(EtcSensorDataHistory obj, out string strErrorMessage);
		bool UpdateEtcSensorDataHistory(Dictionary<EtcSensorDataHistory.Fields, object> dicSets, Dictionary<EtcSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateEtcSensorData(Dictionary<EtcSensorData.Fields, object> dicSets, Dictionary<EtcSensorData.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateAirNode(Dictionary<AirNode.Fields, object> dicSets, Dictionary<AirNode.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateAirDataHistory(AirDataHistory obj, out string strErrorMessage);
		bool UpdateAirDataHistory(Dictionary<AirDataHistory.Fields, object> dicSets, Dictionary<AirDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateKmaAsos(KmaAsos obj, out string strErrorMessage);
		bool UpdateKmaAsos(Dictionary<KmaAsos.Fields, object> dicSets, Dictionary<KmaAsos.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		bool UpdateCleanSYS(CleanSYS obj, out string strErrorMessage);
		bool UpdateCleanSYS(Dictionary<CleanSYS.Fields, object> dicSets, Dictionary<CleanSYS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
        bool UpdateYeosuOptionSDMS(OptionSDMS obj, out string strErrorMessage);
        bool UpdateYeosuOptionSDMS(Dictionary<OptionSDMS.Fields, object> dicSets, Dictionary<OptionSDMS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
    }
}
