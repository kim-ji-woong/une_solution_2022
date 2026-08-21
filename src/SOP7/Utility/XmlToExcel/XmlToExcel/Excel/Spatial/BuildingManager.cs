using System.Collections.Generic;

namespace XmlToExcel.Excel.Spatial
{
    using Data;

    public class BuildingManager
    {
        public const string SheetName = "Building";
        public const int ID_Index = 0;
        public const int Name_Index = 1;
        public const int BuildingGroupID_Index = 2;
        public const int MaxFloor_Index = 3;
        public const int MinFloor_Index = 4;

        public static SheetData MakeSheetData(ICollection<BuildingGroupData> buildingGroupDatas)
        {
            SheetData sheetData = new SheetData(SheetName);
            SetTitles(sheetData);

            foreach (BuildingGroupData buildingGroup in buildingGroupDatas)
            {
                foreach (BuildingData building in buildingGroup.BuildingDatas)
                {
                    SetColumnDatas(sheetData, building);
                }
            }

            return sheetData;
        }

        private static void SetTitles(SheetData sheetData)
        {
            sheetData.Titles[ID_Index] = "ID";
            sheetData.Titles[Name_Index] = "BuildingName";
            sheetData.Titles[BuildingGroupID_Index] = "BuildingID";
            sheetData.Titles[MaxFloor_Index] = "MaxFloor";
            sheetData.Titles[MinFloor_Index] = "MinFloor";

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }
        }

        private static void SetColumnDatas(SheetData sheetData, BuildingData building)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(ID_Index, out columnDatas))
            {
                columnDatas.Add(building.ID.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(Name_Index, out columnDatas))
            {
                columnDatas.Add(building.BuildingName);
            }

            if (sheetData.ColumnDatas.TryGetValue(BuildingGroupID_Index, out columnDatas))
            {
                columnDatas.Add(building.BuildingGroupID.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(MaxFloor_Index, out columnDatas))
            {
                columnDatas.Add(building.MaxFloor.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(MinFloor_Index, out columnDatas))
            {
                columnDatas.Add(building.MinFloor.ToString());
            }
        }
    }
}
