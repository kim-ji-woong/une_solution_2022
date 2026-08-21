using System.Collections.Generic;
using BusanTP.Model;

namespace BusanTP.IDAL
{
	public interface IUpdate
	{
		bool UpdateBusanExternalMaterial(Material obj, out string strErrorMessage);
		bool UpdateBusanExternalMaterial(Dictionary<Material.Fields, object> dicSets, Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBusanExternalSensor(Sensor obj, out string strErrorMessage);
		bool UpdateBusanExternalSensor(Dictionary<Sensor.Fields, object> dicSets, Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBusanExternalSensorType(SensorType obj, out string strErrorMessage);
		bool UpdateBusanExternalSensorType(Dictionary<SensorType.Fields, object> dicSets, Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBusanKWeatherNodeInfo(KWeatherNodeInfo obj, out string strErrorMessage);
		bool UpdateBusanKWeatherNodeInfo(Dictionary<KWeatherNodeInfo.Fields, object> dicSets, Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBusanSdmsOption(SdmsOption obj, out string strErrorMessage);
		bool UpdateBusanSdmsOption(Dictionary<SdmsOption.Fields, object> dicSets, Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBusanSensorDataHistory(SensorDataHistory obj, out string strErrorMessage);
		bool UpdateBusanSensorDataHistory(Dictionary<SensorDataHistory.Fields, object> dicSets, Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool UpdateBusanUserMemo(UserMemo obj, out string strErrorMessage);
		
		bool UpdateBusanUserMemo(Dictionary<UserMemo.Fields, object> dicSets, Dictionary<UserMemo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
	}
}
