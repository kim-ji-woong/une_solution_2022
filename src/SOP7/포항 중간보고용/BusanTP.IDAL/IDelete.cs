using System.Collections.Generic;
using BusanTP.Model;

namespace BusanTP.IDAL
{
	public interface IDelete
	{
		bool DeleteBusanExternalMaterial(Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteBusanExternalSensor(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteBusanExternalSensorType(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteBusanKWeatherNodeInfo(Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteBusanSdmsOption(Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

		bool DeleteBusanSensorDataHistory(Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);

	}
}
