using System.Collections.Generic;

namespace XmlToExcel.Excel.Sensor
{
    using Data.Sensor;

    public class EtcSensorManager
    {
        public const string SheetName = "기타센서";
        public const int ID_Index = 0;
        public const int Name_Index = 1;
        public const int X_Index = 2;
        public const int Y_Index = 3;
        public const int Z_Index = 4;
        public const int ZoneID_Index = 5;

        public static SheetData MakeSheetData(List<EtcSensor> sensors)
        {
            SheetData sheetData = new SheetData(SheetName);
            SetTitles(sheetData);

            foreach (EtcSensor sensor in sensors)
            {
                SetColumnDatas(sheetData, sensor);
            }

            return sheetData;
        }

        private static void SetTitles(SheetData sheetData)
        {
            sheetData.Titles[ID_Index] = "ID";
            sheetData.Titles[Name_Index] = "SensorName";
            sheetData.Titles[X_Index] = "X";
            sheetData.Titles[Y_Index] = "Y";
            sheetData.Titles[Z_Index] = "Z";
            sheetData.Titles[ZoneID_Index] = "ZoneID";

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }
        }

        private static void SetColumnDatas(SheetData sheetData, EtcSensor sensor)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(ID_Index, out columnDatas))
            {
                columnDatas.Add(sensor.ID.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(Name_Index, out columnDatas))
            {
                columnDatas.Add(sensor.Name);
            }

            if (sheetData.ColumnDatas.TryGetValue(X_Index, out columnDatas))
            {
                if (sensor.X == null)
                    columnDatas.Add(null);
                else
                    columnDatas.Add(SensorManager.FloatString((float)sensor.X));
            }

            if (sheetData.ColumnDatas.TryGetValue(Y_Index, out columnDatas))
            {
                if (sensor.Y == null)
                    columnDatas.Add(null);
                else
                    columnDatas.Add(SensorManager.FloatString((float)sensor.Y));
            }

            if (sheetData.ColumnDatas.TryGetValue(Z_Index, out columnDatas))
            {
                if (sensor.Z == null)
                    columnDatas.Add(null);
                else
                    columnDatas.Add(SensorManager.FloatString((float)sensor.Z));
            }

            if (sheetData.ColumnDatas.TryGetValue(ZoneID_Index, out columnDatas))
            {
                columnDatas.Add(sensor.ZoneID.ToString());
            }
        }
    }
}
