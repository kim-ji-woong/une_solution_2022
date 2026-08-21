using SensorServer.Model.Yeosu;
using SensorServer.Model.Yeosu.External;
using SensorServer.Model.Yeosu.Option;
using SensorServer.Model.Yeosu.Public;

namespace SensorServer.IDAL
{
	public interface ICreate
	{
		MaterialLink CreateMaterialLink(MaterialLink obj, out string strErrorMessage);
		SensorLink CreateSensorLink(SensorLink obj, out string strErrorMessage);
		EtcSensorDataHistory CreateEtcSensorDataHistory(EtcSensorDataHistory obj, out string strErrorMessage);
		EtcSensorData CreateEtcSensorData(EtcSensorData obj, out string strErrorMessage);
		AirNode CreateAirNode(AirNode obj, out string strErrorMessage);
		AirDataHistory CreateAirDataHistory(AirDataHistory obj, out string strErrorMessage);
		KmaAsos CreateKmaAsos(KmaAsos obj, out string strErrorMessage);
		CleanSYS CreateCleanSYS(CleanSYS obj, out string strErrorMessage);

		OptionSDMS CreateYeosuOptionSDMS(OptionSDMS obj, out string strErrorMessage);
	}
}
