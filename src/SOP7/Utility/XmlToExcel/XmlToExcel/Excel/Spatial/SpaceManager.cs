using System.Collections.Generic;

namespace XmlToExcel.Excel.Spatial
{
    using Data;

    public class SpaceManager
    {
        public List<SheetData> MakeSheetDatas(ICollection<BuildingGroupData> buildingGroupDatas, out string strErrorMessage)
        {
            strErrorMessage = null;

            List<SheetData> sheetDatas = new List<SheetData>();

            sheetDatas.Add(BuildingGroupManager.MakeSheetData(buildingGroupDatas));
            sheetDatas.Add(BuildingManager.MakeSheetData(buildingGroupDatas));
            sheetDatas.Add(ZoneManager.MakeSheetData(buildingGroupDatas));
            sheetDatas.Add(EquipmentZoneManager.MakeSheetData(buildingGroupDatas));

            return sheetDatas;
        }
    }
}
