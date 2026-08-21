using System.Collections;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;

namespace VDS.BLL.Excel.Writer
{
    public class ITPropertyWriter : ExcelWriter
    {
        public const int Index_RackName = 0;
        public const int Index_Type = 1;
        public const int Index_HostName = 2;
        public const int Index_ModelName = 3;
        public const int Index_Company = 4;
        public const int Index_USize = 5;
        public const int Index_Usage = 6;
        public const int Index_UnitPos = 7;
        public const int Index_Shelf = 8;
        public const int Index_PosInShelf = 9;
        public const int Index_Status = 10;

        public const string Column_RackName = "Rack명";
        public const string Column_Type = "IT자산 구분";
        public const string Column_HostName = "호스트명";
        public const string Column_ModelName = "모델명";
        public const string Column_Company = "제조사";
        public const string Column_USize = "U 크기";
        public const string Column_Usage = "용도";
        public const string Column_UnitPos = "시작위치(U)";
        public const string Column_Shelf = "선반유무";
        public const string Column_PosInShelf = "선반 내 위치";
        public const string Column_Status = "상태";

        private int m_nDataCenterID = -1;
        private Model.DataCenter.DataCenter m_dataCenter = null;

        public ITPropertyWriter(IDataManager dataManager, int dataCenterID)
            : base(dataManager)
        {
            m_nDataCenterID = dataCenterID;
        }

        protected override string GetSubject()
        {
            if (m_dataCenter == null)
                return "data";

            return m_dataCenter.Name;
        }

        protected override ICollection<SheetData> ReadSheetDatas(out string strErrorMessage)
        {
            Model.DataCenter.DataCenter dataCenter = m_dataManager.GetSelectManager().SelectDataCenter(m_nDataCenterID, out strErrorMessage);

            if (dataCenter == null)
            {
                strErrorMessage = "입력된 값에 대한 DataCenter 정보를 Database에서 조회할 수 없습니다.";
                return null;
            }
            else
                m_dataCenter = dataCenter;

            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinRackEquipmentTypeItemItemRUItemTypeCompany(m_dataCenter.ID, null, out strErrorMessage);

            if (arrDatas == null)
                return null;

            SheetData sheetData = new SheetData(m_dataCenter.Name);
            SetTitles(sheetData);

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-5;i+=6)
            {
                if (arrDatas[i] is Rack && arrDatas[i + 1] is EquipmentType && arrDatas[i + 2] is Item && arrDatas[i + 3] is Item_RU && arrDatas[i + 4] is ItemType && arrDatas[i + 5] is Company)
                {
                    Rack rack = (Rack)arrDatas[i];
                    EquipmentType equipmentType = (EquipmentType)arrDatas[i + 1];
                    Item item = (Item)arrDatas[i + 2];
                    Item_RU itemRU = (Item_RU)arrDatas[i + 3];
                    ItemType itemType = (ItemType)arrDatas[i + 4];
                    Company company = (Company)arrDatas[i + 5];

                    SetColumnDatas(sheetData, rack, equipmentType, item, itemRU, itemType, company);
                }
            }

            bool isNullable;
            string strConditions = string.Format("{0}.{1} not in (Select {2} from {3})",
                Item.TableName,
                Item.GetFieldName(Item.Fields.ID, out isNullable),
                Item_RU.GetFieldName(Item_RU.Fields.ItemID, out isNullable),
                Item_RU.TableName);

            arrDatas = m_dataManager.GetSelectManager().JoinItemItemTypeEquipmentTypeCompany(m_dataCenter.ID, strConditions, out strErrorMessage);

            if (arrDatas == null)
                return null;

            nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-3;i+=4)
            {
                if (arrDatas[i] is Item && arrDatas[i + 1] is ItemType && arrDatas[i + 2] is EquipmentType && arrDatas[i + 3] is Company)
                {
                    Item item = (Item)arrDatas[i];
                    ItemType itemType = (ItemType)arrDatas[i + 1];
                    EquipmentType equipmentType = (EquipmentType)arrDatas[i + 2];
                    Company company = (Company)arrDatas[i + 3];

                    SetColumnDatas(sheetData, null, equipmentType, item, null, itemType, company);
                }
            }

            List<SheetData> sheetDatas = new List<SheetData>();

            if (sheetDatas != null)
                sheetDatas.Add(sheetData);

            return sheetDatas;
        }

        private void SetColumnDatas(SheetData sheetData, Rack rack, EquipmentType equipmentType, Item item, Item_RU itemRU, ItemType itemType, Company company)
        {
            List<string> columnDatas;

            if (sheetData.ColumnDatas.TryGetValue(Index_RackName, out columnDatas))
            {
                if (rack != null)
                    columnDatas.Add(rack.Name);
                else
                    columnDatas.Add("");
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_Type, out columnDatas))
            {
                columnDatas.Add(equipmentType.Name);
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_HostName, out columnDatas))
            {
                columnDatas.Add(item.Name);
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_ModelName, out columnDatas))
            {
                columnDatas.Add(itemType.ModelName);
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_Company, out columnDatas))
            {
                columnDatas.Add(company.Name);
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_USize, out columnDatas))
            {
                columnDatas.Add(itemType.Unit == null ? "" : ((int)itemType.Unit).ToString());
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_Usage, out columnDatas))
            {
                columnDatas.Add(item.Usage);
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_UnitPos, out columnDatas))
            {
                if (itemRU != null)
                    columnDatas.Add(itemRU.UPos.ToString());
                else
                    columnDatas.Add("");
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_Shelf, out columnDatas))
            {
                if (itemType.Shelf == null || (bool)itemType.Shelf == false)
                    columnDatas.Add("N");
                else
                    columnDatas.Add("Y");
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_PosInShelf, out columnDatas))
            {
                if (item.PositionInShelf == null)
                    columnDatas.Add("");
                else
                {
                    int pos = (int)item.PositionInShelf;

                    if (pos == (int)Item.ShelfPosition.Left)
                        columnDatas.Add("왼쪽");
                    else if (pos == (int)Item.ShelfPosition.Center)
                        columnDatas.Add("가운데");
                    else
                        columnDatas.Add("오른쪽");
                }
            }

            if (sheetData.ColumnDatas.TryGetValue(Index_Status, out columnDatas))
            {
                if (item.Status == null)
                    columnDatas.Add("");
                else
                {
                    int status = (int)item.Status;

                    if (status == 1)
                        columnDatas.Add("운용");
                    else
                        columnDatas.Add("유휴");
                }
            }
        }

        private void SetTitles(SheetData sheetData)
        {
            sheetData.Titles[Index_RackName] = Column_RackName;
            sheetData.Titles[Index_Type] = Column_Type;
            sheetData.Titles[Index_HostName] = Column_HostName;
            sheetData.Titles[Index_ModelName] = Column_ModelName;
            sheetData.Titles[Index_Company] = Column_Company;
            sheetData.Titles[Index_USize] = Column_USize;
            sheetData.Titles[Index_Usage] = Column_Usage;
            sheetData.Titles[Index_UnitPos] = Column_UnitPos;
            sheetData.Titles[Index_Shelf] = Column_Shelf;
            sheetData.Titles[Index_PosInShelf] = Column_PosInShelf;
            sheetData.Titles[Index_Status] = Column_Status;

            foreach (KeyValuePair<int, string> pair in sheetData.Titles)
            {
                sheetData.ColumnDatas[pair.Key] = new List<string>();
            }
        }
    }
}
