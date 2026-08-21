using System.Collections.Generic;

namespace XmlToExcel.Excel.Spatial
{
    using Data;

    public class BuildingGroupManager
    {
        public const string SheetName = "BuildingGroup";
        public const int ID_Index = 0;
        public const int Name_Index = 1;
        public const int ParentID_Index = 2;

        public static SheetData MakeSheetData(ICollection<BuildingGroupData> buildingGroupDatas)
        {
            SheetData sheetData = new SheetData(SheetName);
            SetTitles(sheetData);

            foreach (BuildingGroupData buildingGroup in buildingGroupDatas)
            {
                SetColumnDatas(sheetData, buildingGroup);
            }

            return sheetData;
        }

        private static void SetTitles(SheetData sheetData)
        {
            sheetData.Titles[ID_Index] = "ID";
            sheetData.Titles[Name_Index] = "BuildingGroupName";
            sheetData.Titles[ParentID_Index] = "ParentID";

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }
        }

        private static void SetColumnDatas(SheetData sheetData, BuildingGroupData buildingGroup)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(ID_Index, out columnDatas))
            {
                columnDatas.Add(buildingGroup.ID.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(Name_Index, out columnDatas))
            {
                columnDatas.Add(buildingGroup.GroupName);
            }

            if (sheetData.ColumnDatas.TryGetValue(ParentID_Index, out columnDatas))
            {
                if (buildingGroup.Parent == null)
                    columnDatas.Add(null);
                else
                    columnDatas.Add(buildingGroup.Parent.ID.ToString());
            }
        }
    }
}
