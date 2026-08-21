using System.Collections.Generic;
using BusanTP.Model;

namespace BusanTP.IDAL
{
	public interface ISelect
	{
		List<Material> SelectBusanExternalMaterials(Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Material> SelectBusanExternalMaterials(Dictionary<Material.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<Sensor> SelectBusanExternalSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<Sensor> SelectBusanExternalSensors(Dictionary<Sensor.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<SensorType> SelectBusanExternalSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SensorType> SelectBusanExternalSensorTypes(Dictionary<SensorType.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<KWeatherNodeInfo> SelectBusanKWeatherNodeInfos(Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<KWeatherNodeInfo> SelectBusanKWeatherNodeInfos(Dictionary<KWeatherNodeInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<SdmsOption> SelectBusanSdmsOptions(Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SdmsOption> SelectBusanSdmsOptions(Dictionary<SdmsOption.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<SensorDataHistory> SelectBusanSensorDataHistorys(Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SensorDataHistory> SelectBusanSensorDataHistorys(Dictionary<SensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);

		List<SensorGIS> SelectBusanExternalSensorGISs(Dictionary<SensorGIS.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<SensorGIS> SelectBusanExternalSensorGISs(Dictionary<SensorGIS.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
		
		List<POIInfo> SelectBusanExternalPOIInfos(Dictionary<POIInfo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<POIInfo> SelectBusanExternalPOIInfos(Dictionary<POIInfo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
		
		List<UserMemo> SelectBusanUserMemos(Dictionary<UserMemo.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<UserMemo> SelectBusanUserMemos(Dictionary<UserMemo.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
		
		List<TestOptions> SelectBusanTestOptions(Dictionary<TestOptions.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<TestOptions> SelectBusanTestOptions(Dictionary<TestOptions.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
		
		List<TestEvent> SelectBusanTestEvents(Dictionary<TestEvent.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<TestEvent> SelectBusanTestEvents(Dictionary<TestEvent.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
		
		List<WeatherSensorDataHistory> SelectBusanWeatherSensorDataHistory(Dictionary<WeatherSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, out string strErrorMessage);
		List<WeatherSensorDataHistory> SelectBusanWeatherSensorDataHistory(Dictionary<WeatherSensorDataHistory.Fields, object> dicConditions, string strAdditionalConditions, int? topNCount, out string strErrorMessage);
	}
}
