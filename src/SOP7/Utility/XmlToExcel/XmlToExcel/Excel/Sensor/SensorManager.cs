using System.Collections.Generic;

namespace XmlToExcel.Excel.Sensor
{
    using Data.Sensor;

    public class SensorManager
    {
        public List<SheetData> MakeSheetDatas(List<SheetData> sheetDatas, List<FireSensor> fireSensors, List<PSMSensor> psmSensors, List<EtcSensor> etcSensors, List<CCTVSensor> cctvs, out string strErrorMessage)
        {
            strErrorMessage = null;

            sheetDatas.Add(FireSensorManager.MakeSheetData(fireSensors));
            sheetDatas.Add(PSMSensorManager.MakeSheetData(psmSensors));
            sheetDatas.Add(EtcSensorManager.MakeSheetData(etcSensors));
            sheetDatas.Add(CCTVManager.MakeSheetData(cctvs));

            return sheetDatas;
        }

        public static string FloatString(float data)
        {
            return string.Format("{0:F2}", data);
        }
    }
}
