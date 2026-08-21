using System.Collections.Generic;

namespace XmlToExcel.Excel.Spatial
{
    using Data;

    public class EquipmentZoneManager
    {
        public const string SheetName = "EquipmentZone";
        public const int ID_Index = 0;
        public const int Name_Index = 1;
        public const int LinkedZoneIDList_Index = 2;

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
                        foreach (EquipmentZoneData equipZone in zone.EquipmentZoneDatas)
                        {
                            SetColumnDatas(sheetData, equipZone);
                        }
                    }
                }
            }

            return sheetData;
        }

        private static void SetTitles(SheetData sheetData)
        {
            sheetData.Titles[ID_Index] = "ID";
            sheetData.Titles[Name_Index] = "ZoneName";
            sheetData.Titles[LinkedZoneIDList_Index] = "LinkedZoneIDList";

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }
        }

        private static void SetColumnDatas(SheetData sheetData, EquipmentZoneData equipZone)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(ID_Index, out columnDatas))
            {
                columnDatas.Add(equipZone.ID.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(Name_Index, out columnDatas))
            {
                columnDatas.Add(equipZone.ZoneName);
            }

            if (sheetData.ColumnDatas.TryGetValue(LinkedZoneIDList_Index, out columnDatas))
            {
                columnDatas.Add(ListToString(equipZone.LinkedZoneIDs));
            }
        }

        private static string ListToString(List<int> ids)
        {
            string strIDs = "";

            foreach (int id in ids)
            {
                if (strIDs.Length == 0)
                    strIDs = id.ToString();
                else
                    strIDs += "," + id.ToString();
            }

            return strIDs;
        }
    }
}
