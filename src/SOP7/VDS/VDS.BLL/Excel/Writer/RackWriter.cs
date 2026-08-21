using System.Collections;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.HSSF.Util;

namespace VDS.BLL.Excel.Writer
{
    using Models.Request;

    public class RackWriter : ExcelWriter
    {
        private const int Index_U = 0;
        private const int Index_HostName = 1;
        private const int Index_ModelName = 2;
        private const int Index_Usage = 3;

        private const string Column_U = "U";
        private const string Column_HostName = "호스트명";
        private const string Column_ModelName = "모델명";
        private const string Column_Usage = "용도";

        private const string CombineTag = "_*_&^_";

        private int m_nDataCenterID = -1;
        private Dictionary<int, RackType> m_dicRackTypes = new Dictionary<int, RackType>();

        public RackWriter(IDataManager dataManager, int dataCenterID)
            : base(dataManager)
        {
            m_nDataCenterID = dataCenterID;
        }

        protected override string GetSubject()
        {
            return "data";
        }

        protected override ICollection<SheetData> ReadSheetDatas(out string strErrorMessage)
        {
            Dictionary<int, RackGroup> dicRackGroups = new Dictionary<int, RackGroup>();
            Dictionary<int, RackType> dicRackTypes = new Dictionary<int, RackType>();
            Dictionary<int, List<Rack>> dicRackGroupDatas = ReadRackGroups(dicRackGroups, dicRackTypes, out strErrorMessage);

            if (dicRackGroupDatas == null)
                return null;

            List<Rack> noRackGroupRacks = ReadNoRackGroupRacks(dicRackTypes, out strErrorMessage);

            if (noRackGroupRacks == null)
                return null;

            Dictionary<int, ItemType> dicItemTypes = new Dictionary<int, ItemType>();
            Dictionary<int, Dictionary<int, RackItem>> dicRackItems = ReadRackItems(dicItemTypes, out strErrorMessage);

            if (dicRackItems == null)
                return null;

            List<SheetData> sheetDatas = new List<SheetData>();

            foreach (KeyValuePair<int, List<Rack>> pair in dicRackGroupDatas)
            {
                RackGroup rackGroup = dicRackGroups[pair.Key];
                MakeSheet(rackGroup.GroupName, pair.Value, dicRackItems, dicRackTypes, dicItemTypes, sheetDatas);
            }

            MakeSheet("구역할당 되지않은 Rack", noRackGroupRacks, dicRackItems, dicRackTypes, dicItemTypes, sheetDatas);

            if (sheetDatas.Count == 0)
            {
                SheetData sheetData = new SheetData("기본");
                sheetDatas.Add(sheetData);
            }

            m_dicRackTypes = dicRackTypes;
            return sheetDatas;
        }

        private void MakeSheet(string strRackGroupName, List<Rack> racks, Dictionary<int, Dictionary<int, RackItem>> dicRackItems, Dictionary<int, RackType> dicRackTypes, Dictionary<int, ItemType> dicItemTypes, List<SheetData> sheetDatas)
        {
            SheetData sheetData = new SheetData(strRackGroupName);
            SetTitles(sheetData, racks);
            sheetData.Tag = racks;

            sheetDatas.Add(sheetData);

            int maxUnit = 0;

            foreach (Rack rack in racks)
            {
                RackType rackType = dicRackTypes[rack.RackTypeID];

                if (rackType.Unit > maxUnit)
                    maxUnit = rackType.Unit;
            }

            int nRackCount = racks.Count;

            for (int i = 0; i < nRackCount; i++)
            {
                Rack rack = racks[i];
                RackType rackType = dicRackTypes[rack.RackTypeID];
                Dictionary<int, RackItem> dicItems = null;

                if (dicRackItems.TryGetValue(rack.ID, out dicItems) == false)
                    dicItems = new Dictionary<int, RackItem>();

                int pos = i * 4;

                for (int j = maxUnit; j > 0; j--)
                {
                    RackItem item;

                    if (dicItems.TryGetValue(j, out item) == false)
                        item = null;

                    SetColumnDatas(sheetData, pos, j, item, dicItemTypes);
                }
            }
        }

        private ICellStyle CreateRackTitleStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;
            style.FillForegroundColor = HSSFColor.Black.Index;
            style.FillPattern = FillPattern.SolidForeground;

            return style;
        }

        private ICellStyle CreateHeaderStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;
            style.FillForegroundColor = HSSFColor.Grey25Percent.Index;
            style.FillPattern = FillPattern.SolidForeground;

            style.BorderLeft = style.BorderRight = style.BorderTop = style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            style.TopBorderColor = style.LeftBorderColor = style.RightBorderColor = style.BottomBorderColor = HSSFColor.Grey40Percent.Index;

            return style;
        }

        private ICellStyle CreateFirstHeaderStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;
            style.FillForegroundColor = HSSFColor.Grey25Percent.Index;
            style.FillPattern = FillPattern.SolidForeground;

            style.BorderLeft = style.BorderRight = NPOI.SS.UserModel.BorderStyle.Medium;
            style.BorderTop = style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            style.LeftBorderColor = style.RightBorderColor = HSSFColor.Black.Index;
            style.TopBorderColor = style.BottomBorderColor = HSSFColor.Grey25Percent.Index;

            return style;
        }

        private ICellStyle CreateLastHeaderStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;
            style.FillForegroundColor = HSSFColor.Grey25Percent.Index;
            style.FillPattern = FillPattern.SolidForeground;

            style.BorderRight = NPOI.SS.UserModel.BorderStyle.Medium;
            style.BorderLeft = style.BorderTop = style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            style.RightBorderColor = HSSFColor.Black.Index;
            style.LeftBorderColor = style.TopBorderColor = style.BottomBorderColor = HSSFColor.Grey25Percent.Index;

            return style;
        }

        private ICellStyle CreateMultiUnitStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;
            style.FillForegroundColor = HSSFColor.PaleBlue.Index;
            style.FillPattern = FillPattern.SolidForeground;

            style.BorderLeft = style.BorderRight = style.BorderTop = style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            style.TopBorderColor = style.LeftBorderColor = style.RightBorderColor = style.BottomBorderColor = HSSFColor.Grey25Percent.Index;

            return style;
        }

        private ICellStyle CreateLastMultiUnitStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;
            style.FillForegroundColor = HSSFColor.PaleBlue.Index;
            style.FillPattern = FillPattern.SolidForeground;

            style.BorderRight = NPOI.SS.UserModel.BorderStyle.Medium;
            style.BorderLeft = style.BorderTop = style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            style.TopBorderColor = style.LeftBorderColor = style.BottomBorderColor = HSSFColor.Grey25Percent.Index;
            style.RightBorderColor = HSSFColor.Black.Index;

            return style;
        }

        private ICellStyle CreateNormalStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            style.BorderLeft = style.BorderRight = style.BorderTop = style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            style.TopBorderColor = style.LeftBorderColor = style.RightBorderColor = style.BottomBorderColor = HSSFColor.Grey25Percent.Index;

            return style;
        }

        private ICellStyle CreateFirstNormalStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            style.BorderLeft = style.BorderRight = style.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Medium;
            style.TopBorderColor = style.LeftBorderColor = style.RightBorderColor = HSSFColor.Grey25Percent.Index;
            style.BottomBorderColor = HSSFColor.Black.Index;

            return style;
        }

        private ICellStyle CreateLastNormalStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            style.BorderRight = NPOI.SS.UserModel.BorderStyle.Medium;
            style.BorderLeft = style.BorderTop = style.BorderBottom = NPOI.SS.UserModel.BorderStyle.Thin;
            style.TopBorderColor = style.LeftBorderColor = style.RightBorderColor = style.BottomBorderColor = HSSFColor.Grey25Percent.Index;
            style.RightBorderColor = HSSFColor.Black.Index;

            return style;
        }

        private ICellStyle CreateLastLastNormalStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            style.BorderBottom = style.BorderRight = NPOI.SS.UserModel.BorderStyle.Medium;
            style.BorderLeft = style.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            style.TopBorderColor = style.LeftBorderColor = style.RightBorderColor = style.BottomBorderColor = HSSFColor.Grey25Percent.Index;
            style.BottomBorderColor = style.RightBorderColor = HSSFColor.Black.Index;

            return style;
        }

        private ICellStyle CreateNumberStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            style.BorderBottom = style.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            style.BorderLeft = style.BorderRight = NPOI.SS.UserModel.BorderStyle.Medium;
            style.BottomBorderColor = style.TopBorderColor = HSSFColor.Grey25Percent.Index;
            style.LeftBorderColor = style.RightBorderColor = HSSFColor.Black.Index;

            return style;
        }

        private ICellStyle CreateBlankStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            style.FillForegroundColor = HSSFColor.Black.Index;
            style.FillPattern = FillPattern.SolidForeground;

            return style;
        }

        private ICellStyle CreateFirstNumberStyle(HSSFWorkbook workbook)
        {
            ICellStyle style = workbook.CreateCellStyle();

            style.Alignment = HorizontalAlignment.Center;
            style.VerticalAlignment = VerticalAlignment.Center;

            style.BorderTop = NPOI.SS.UserModel.BorderStyle.Thin;
            style.BorderBottom = style.BorderLeft = style.BorderRight = NPOI.SS.UserModel.BorderStyle.Medium;
            style.TopBorderColor = HSSFColor.Grey25Percent.Index;
            style.BottomBorderColor = style.LeftBorderColor = style.RightBorderColor = HSSFColor.Black.Index;

            return style;
        }

        private IFont CreateRackTitleFont(HSSFWorkbook workbook)
        {
            IFont font = workbook.CreateFont();
            font.Color = HSSFColor.White.Index;
            font.FontHeightInPoints = 12;
            font.IsBold = true;
            return font;
        }

        protected override void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas)
        {
            IFont whiteText = CreateRackTitleFont(workbook);
            ICellStyle rackTitleStyle = CreateRackTitleStyle(workbook);
            rackTitleStyle.SetFont(whiteText);

            ICellStyle headerStyle = CreateHeaderStyle(workbook);
            ICellStyle firstHeaderStyle = CreateFirstHeaderStyle(workbook);
            ICellStyle lastHeaderStyle = CreateLastHeaderStyle(workbook);
            ICellStyle normalStyle = CreateNormalStyle(workbook);
            ICellStyle firstNormalStyle = CreateFirstNormalStyle(workbook);
            ICellStyle lastNormalStyle = CreateLastNormalStyle(workbook);
            ICellStyle lastLastNormalStyle = CreateLastLastNormalStyle(workbook);
            ICellStyle multiUnitStyle = CreateMultiUnitStyle(workbook);
            ICellStyle lastMultiUnitStyle = CreateLastMultiUnitStyle(workbook);
            ICellStyle numberStyle = CreateNumberStyle(workbook);
            ICellStyle firstNumberStyle = CreateFirstNumberStyle(workbook);
            ICellStyle blankStyle = CreateBlankStyle(workbook);

            foreach (SheetData sheetData in sheetDatas)
            {
                ISheet sheet = workbook.CreateSheet(sheetData.SheetName);

                if (sheet == null)
                    return;

                List<Rack> racks = (List<Rack>)sheetData.Tag;

                if (racks == null)
                    continue;

                IRow firstRow = sheet.CreateRow(0);

                for (int i=0;i<racks.Count;i++)
                {
                    Rack rack = racks[i];

                    int pos = i * 4;
                    ICell cell = firstRow.CreateCell(pos);
                    cell.SetCellValue(rack.Name);
                    cell.CellStyle = rackTitleStyle;

                    var cellRegion = new NPOI.SS.Util.CellRangeAddress(0, 0, pos, pos + 3);
                    sheet.AddMergedRegion(cellRegion);
                }

                IRow row = sheet.CreateRow(1);

                int min, max;

                if (GetMinMax(sheetData.Titles, out max, out min) == false)
                    continue;

                string strTitle;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.Titles.TryGetValue(i, out strTitle))
                    {
                        ICell cell = row.CreateCell(i);
                        int width = sheet.GetColumnWidth(i);

                        if (i % 4 == 0)
                            sheet.SetColumnWidth(i, width / 2);
                        else if (i % 4 == 1 || i % 4 == 2)
                            sheet.SetColumnWidth(i, width * 2);
                        else
                            sheet.SetColumnWidth(i, width * 3);

                        if (cell != null && strTitle != null)
                        {
                            cell.SetCellValue(strTitle);

                            if (i % 4 == 0)
                                cell.CellStyle = firstHeaderStyle;
                            else if (i % 4 == 3)
                                cell.CellStyle = lastHeaderStyle;
                            else
                                cell.CellStyle = headerStyle;
                        }
                    }
                }

                List<string> values;
                // Key : Column Index
                Dictionary<int, IRow> dicColumnRows = new Dictionary<int, IRow>();

                RackType rackType;
                Dictionary<int, int> dicSlotCount = new Dictionary<int, int>();

                for (int i = min; i <= max; i++)
                {
                    int rackIndex = i / 4;
                    Rack rack = racks[rackIndex];

                    if (m_dicRackTypes.TryGetValue(rack.RackTypeID, out rackType) == false)
                        rackType = null;

                    if (i % 4 == 2)
                        dicSlotCount = new Dictionary<int, int>();

                    if (sheetData.ColumnDatas.TryGetValue(i, out values))
                    {
                        int nValueCount = values.Count;

                        for (int j = 0; j < nValueCount; j++)
                        {
                            string str = values[j];

                            if (str != null)
                            {
                                if (i % 4 == 2)
                                {
                                    int index = str.IndexOf(CombineTag);

                                    if (index > 0)
                                    {
                                        int nSlotCount;
                                        string strSlotCount = str.Substring(index + CombineTag.Length).Trim();

                                        if (int.TryParse(strSlotCount, out nSlotCount))
                                        {
                                            dicSlotCount[j] = nSlotCount;
                                        }
                                    }
                                }
                            }
                        }

                        for (int j = 0; j < nValueCount; j++)
                        {
                            if (dicColumnRows.TryGetValue(j, out row) == false)
                            {
                                row = sheet.CreateRow(j + 2);
                                dicColumnRows[j] = row;
                            }

                            string str = values[j];
                            ICell cell = row.CreateCell(i);

                            int no = nValueCount - j;

                            if (cell != null && str != null)
                            {
                                cell.SetCellValue(str);
                                cell.CellStyle = i % 4 == 0 ? numberStyle : normalStyle;

                                if (str == "1" && i % 4 == 0)
                                {
                                    cell.CellStyle = firstNumberStyle;
                                }
                                else if (i % 4 == 3)
                                {
                                    if (j == nValueCount - 1)
                                        cell.CellStyle = lastLastNormalStyle;
                                    else
                                        cell.CellStyle = lastNormalStyle;
                                }
                                else if (j == nValueCount - 1)
                                {
                                    cell.CellStyle = firstNormalStyle;
                                }

                                if (rackType != null && rackType.Unit < no)
                                {
                                    cell.CellStyle = blankStyle;
                                }

                                if (i % 4 == 2)
                                {
                                    int index = str.IndexOf(CombineTag);

                                    if (index > 0)
                                    {
                                        cell.SetCellValue(str.Substring(0, index));
                                    }
                                }
                            }
                            else
                            {
                                if (rackType != null && rackType.Unit < no)
                                {
                                    cell.CellStyle = blankStyle;
                                }
                                else
                                {
                                    if (i % 4 == 3)
                                    {
                                        if (j == nValueCount - 1)
                                            cell.CellStyle = lastLastNormalStyle;
                                        else
                                            cell.CellStyle = lastNormalStyle;
                                    }
                                    else
                                    {
                                        cell.CellStyle = j == nValueCount - 1 ? firstNormalStyle : normalStyle;
                                    }
                                }
                            }
                        }

                        if (i % 4 == 3)
                        {
                            foreach (KeyValuePair<int, int> pair in dicSlotCount)
                            {
                                int j = pair.Key;
                                int nSlotCount = pair.Value;

                                IRow row1, row2;

                                if (dicColumnRows.TryGetValue(j - (nSlotCount - 1), out row1) && dicColumnRows.TryGetValue(j, out row2))
                                {
                                    for (int k = i - 2; k <= i; k++)
                                    {
                                        ICell cell1 = row1.GetCell(k);
                                        ICell cell2 = row2.GetCell(k);
                                        cell1.SetCellValue(cell2.StringCellValue);

                                        if (k == i)
                                            cell1.CellStyle = lastMultiUnitStyle;
                                        else
                                            cell1.CellStyle = multiUnitStyle;

                                        var cellRegion = new NPOI.SS.Util.CellRangeAddress(j + 2 - (nSlotCount - 1), j + 2, k, k);
                                        sheet.AddMergedRegion(cellRegion);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        private Dictionary<int, Dictionary<int, RackItem>> ReadRackItems(Dictionary<int, ItemType> dicItemTypes, out string strErrorMessage)
        {
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinItemItemRUItemType(m_nDataCenterID, null, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, RackItem> dicItems = null;
            Dictionary<int, Dictionary<int, RackItem>> dicRackItems = new Dictionary<int, Dictionary<int, RackItem>>();

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-2;i+=3)
            {
                if (arrDatas[i] is Item && arrDatas[i + 1] is Item_RU && arrDatas[i + 2] is ItemType)
                {
                    Item item = (Item)arrDatas[i];
                    Item_RU itemRU = (Item_RU)arrDatas[i + 1];
                    ItemType itemType = (ItemType)arrDatas[i + 2];

                    if (dicRackItems.TryGetValue(itemRU.RackID, out dicItems) == false)
                    {
                        dicItems = new Dictionary<int, RackItem>();
                        dicRackItems[itemRU.RackID] = dicItems;
                    }

                    RackItem rackItem = new RackItem(item, itemRU);

                    dicItems[itemRU.UPos] = rackItem;
                    dicItemTypes[itemType.ID] = itemType;
                }
            }

            return dicRackItems;
        }

        private List<Rack> ReadNoRackGroupRacks(Dictionary<int, RackType> dicRackTypes, out string strErrorMessage)
        {
            bool isNullable;
            string strCondition = string.Format("{0}.{1} is NULL", Rack.TableName, Rack.GetFieldName(Rack.Fields.RackGroupID, out isNullable));
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinRackRackType(m_nDataCenterID, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return null;

            int nDataCount = arrDatas.Count;
            List<Rack> racks = new List<Rack>();

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Rack && arrDatas[i + 1] is RackType)
                {
                    Rack rack = (Rack)arrDatas[i];
                    RackType rackType = (RackType)arrDatas[i + 1];

                    racks.Add(rack);
                    dicRackTypes[rackType.ID] = rackType;
                }
            }

            return racks;
        }

        private Dictionary<int, List<Rack>> ReadRackGroups(Dictionary<int, RackGroup> dicRackGroups, Dictionary<int, RackType> dicRackTypes, out string strErrorMessage)
        {
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinRackRackGroupRackType(m_nDataCenterID, null, out strErrorMessage);

            if (arrDatas == null)
                return null;

            Dictionary<int, List<Rack>> dicRackGroupDatas = new Dictionary<int, List<Rack>>();
            List<Rack> racks = null;

            int nDataCount = arrDatas.Count;

            for (int i = 0; i < nDataCount-2; i+=3)
            {
                if (arrDatas[i] is Rack && arrDatas[i + 1] is RackGroup && arrDatas[i + 2] is RackType)
                {
                    Rack rack = (Rack)arrDatas[i];
                    RackGroup rackGroup = (RackGroup)arrDatas[i + 1];
                    RackType rackType = (RackType)arrDatas[i + 2];

                    if (dicRackGroupDatas.TryGetValue(rackGroup.ID, out racks) == false)
                    {
                        racks = new List<Rack>();
                        dicRackGroupDatas[rackGroup.ID] = racks;
                    }

                    racks.Add(rack);
                    dicRackTypes[rackType.ID] = rackType;
                    dicRackGroups[rackGroup.ID] = rackGroup;
                }
            }

            return dicRackGroupDatas;
        }

        private void SetColumnDatas(SheetData sheetData, int pos, int slot, RackItem item, Dictionary<int, ItemType> dicItemTypes)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(pos + Index_U, out columnDatas))
            {
                columnDatas.Add(slot.ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(pos + Index_HostName, out columnDatas))
            {
                if (item == null)
                    columnDatas.Add(null);
                else
                    columnDatas.Add(item.Name);
            }

            if (sheetData.ColumnDatas.TryGetValue(pos + Index_ModelName, out columnDatas))
            {
                if (item == null)
                    columnDatas.Add(null);
                else
                {
                    ItemType itemType;

                    if (dicItemTypes.TryGetValue(item.ItemTypeID, out itemType))
                    {
                        if (itemType.Unit != null && itemType.Unit > 1)
                            columnDatas.Add(itemType.ModelName + CombineTag + ((int)itemType.Unit).ToString());
                        else
                            columnDatas.Add(itemType.ModelName);
                    }
                    else
                        columnDatas.Add(null);
                }
            }

            if (sheetData.ColumnDatas.TryGetValue(pos + Index_Usage, out columnDatas))
            {
                if (item == null)
                    columnDatas.Add(null);
                else
                    columnDatas.Add(item.Usage);
            }
        }

        private void SetTitles(SheetData sheetData, List<Rack> racks)
        {
            int nRackCount = racks.Count;

            for (int i= 0;i < nRackCount;i++)
            {
                int pos = i * 4;

                sheetData.Titles[Index_U + pos] = Column_U;
                sheetData.Titles[Index_HostName + pos] = Column_HostName;
                sheetData.Titles[Index_ModelName + pos] = Column_ModelName;
                sheetData.Titles[Index_Usage + pos] = Column_Usage;
            }

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }
        }
    }
}
