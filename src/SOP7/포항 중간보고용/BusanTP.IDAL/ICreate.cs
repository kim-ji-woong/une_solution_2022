using BusanTP.Model;

namespace BusanTP.IDAL
{
	public interface ICreate
	{
		Material CreateBusanExternalMaterial(Material obj, out string strErrorMessage);
		Sensor CreateBusanExternalSensor(Sensor obj, out string strErrorMessage);
		SensorType CreateBusanExternalSensorType(SensorType obj, out string strErrorMessage);
		KWeatherNodeInfo CreateBusanKWeatherNodeInfo(KWeatherNodeInfo obj, out string strErrorMessage);
		SdmsOption CreateBusanSdmsOption(SdmsOption obj, out string strErrorMessage);
		SensorDataHistory CreateBusanSensorDataHistory(SensorDataHistory obj, out string strErrorMessage);
	}
}
