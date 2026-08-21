using System.Collections.Generic;

namespace XmlToExcel.Excel.Spatial
{
    using Data;

    public class ZoneManager
    {
        public const string SheetName = "Zone";
        public const int ID_Index = 0;
        public const int Name_Index = 1;
        public const int BuildingID_Index = 2;
        public const int Floor_Index = 3;

        public static SheetData MakeSheetData(ICollection<BuildingGroupData> buildingGroupDatas)
        {
            SheetData sheetData = new SheetData(SheetName);
            SetTitles(sheetData);

            foreach (BuildingGroupData buildingGroup in buildingGroupDatas)
            {
                foreach (BuildingData building in buildingGroup.BuildingDatas)
                {
                    foreach (ZoneData zone in building.ZoneDatas)
                    {
                        SetColumnDatas(sheetData, zone);
                    }
                }
            }

            return sheetData;
        }

        private static void SetTitles(SheetData sheetData)
        {
            sheetData.Titles[ID_Index] = "ID";
            sheetData.Titles[Name_Index] = "ZoneName";
            sheetData.Titles[BuildingID_Index] = "BuildingID";
            sheetData.Titles[Floor_Index] = "MaxFloor";

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }
        }

        private static void SetColumnDatas(SheetData sheetData, ZoneData zone)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(ID_Index, out columnDatas))
            {
                columnDatas.Add(zone.ID.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(Name_Index, out columnDatas))
            {
                columnDatas.Add(zone.ZoneName);
            }

            if (sheetData.ColumnDatas.TryGetValue(BuildingID_Index, out columnDatas))
            {
                columnDatas.Add(zone.BuildingID.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(Floor_Index, out columnDatas))
            {
                columnDatas.Add(zone.FloorIndex.ToString());
            }
        }
    }
}
