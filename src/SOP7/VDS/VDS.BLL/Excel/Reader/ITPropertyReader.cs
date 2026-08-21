using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;

namespace VDS.BLL.Excel.Reader
{
    using Models.Request;
    using Writer;

    public class ITPropertyReader : ExcelReader
    {
        private int m_nDataCenterID = -1;

        public ITPropertyReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
            : base(strFilePath, dataManager)
        {
            m_nDataCenterID = nDataCenterID;
        }

        protected override bool UpdateData(List<SheetData> sheetDatas, out string strErrorMessage)
        {
            Dictionary<string, Rack> dicRacks = new Dictionary<string, Rack>();
            Dictionary<int, EquipmentType> dicEquipmentTypes = new Dictionary<int, EquipmentType>();
            Dictionary<string, EquipmentType> dicKorEquipmentTypes = new Dictionary<string, EquipmentType>();
            Dictionary<string, EquipmentType> dicEngEquipmentTypes = new Dictionary<string, EquipmentType>();
            Dictionary<string, ItemType> dicKorItemTypes = new Dictionary<string, ItemType>();
            Dictionary<string, ItemType> dicEngItemTypes = new Dictionary<string, ItemType>();
            Dictionary<string, Company> dicKorCompanies = new Dictionary<string, Company>();
            Dictionary<string, Company> dicEngCompanies = new Dictionary<string, Company>();
            Dictionary<string, ItemType> dicDefaultItemTypes = new Dictionary<string, ItemType>();
            Dictionary<int, RackType> dicRackTypes = new Dictionary<int, RackType>();

            List<RackType> rackTypes = m_dataManager.GetSelectManager().SelectRackTypes(null, null, out strErrorMessage);

            if (rackTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스로부터 RackType 정보를 조회할 수 없습니다.";
                return false;
            }

            foreach (RackType rackType in rackTypes)
            {
                dicRackTypes[rackType.ID] = rackType;
            }

            if (GetRacks(m_nDataCenterID, dicRacks, dicDefaultItemTypes, dicEquipmentTypes, dicKorEquipmentTypes, dicEngEquipmentTypes, dicKorItemTypes, dicEngItemTypes, dicKorCompanies, dicEngCompanies, out strErrorMessage) == false)
                return false;

            if (sheetDatas.Count == 0)
            {
                strErrorMessage = "잘못된 형식의 Excel 파일입니다.";
                return false;
            }

            SheetData sheetData = sheetDatas[0];

            List<Rack> racks = new List<Rack>();
            int nDepth = -1;

            foreach (KeyValuePair<int, List<string>> pair in sheetData.ColumnDatas)
            {
                nDepth = pair.Value.Count;
                break;
            }

            if (nDepth <= 0)
                return true;

            Dictionary<Rack, Dictionary<int, RackItem>> dicRackItems = new Dictionary<Rack, Dictionary<int, RackItem>>();
            Dictionary<Rack, Dictionary<int, RackItem>> dicRackSubItems = new Dictionary<Rack, Dictionary<int, RackItem>>();
            Dictionary<int, RackItem> dicItems = new Dictionary<int, RackItem>();
            Dictionary<int, RackItem> dicSubItems = new Dictionary<int, RackItem>();

            Dictionary<string, Item> dicItemNames = new Dictionary<string, Item>();
            DateTime dtNow = DateTime.Now;

            List<RackItem> noRackItems = new List<RackItem>();
            List<RackItem> items = new List<RackItem>();

            for (int i = 0; i < nDepth; i++)
            {
                string strRackName = null, strType = null, strHostName = null, strModelName = null, strShelf = null;
                string strCompanyName = null, strUsage = null, strStatus = null, strUSize = null;
                int? startPos = null, posInShelf = null, status = null;
                bool? shelf = null;

                foreach (KeyValuePair<int, List<string>> pair in sheetData.ColumnDatas)
                {
                    if (pair.Key == ITPropertyWriter.Index_RackName)
                    {
                        strRackName = pair.Value[i];
                    }
                    else if (pair.Key == ITPropertyWriter.Index_Type)
                    {
                        strType = pair.Value[i];
                    }
                    else if (pair.Key == ITPropertyWriter.Index_HostName)
                    {
                        strHostName = pair.Value[i];
                    }
                    else if (pair.Key == ITPropertyWriter.Index_ModelName)
                    {
                        strModelName = pair.Value[i];
                    }
                    else if (pair.Key == ITPropertyWriter.Index_Company)
                    {
                        strCompanyName = pair.Value[i];
                    }
                    else if (pair.Key == ITPropertyWriter.Index_USize)
                    {
                        strUSize = pair.Value[i];
                    }
                    else if (pair.Key == ITPropertyWriter.Index_Usage)
                    {
                        strUsage = pair.Value[i];
                    }
                    else if (pair.Key == ITPropertyWriter.Index_Status)
                    {
                        strStatus = pair.Value[i];

                        if (strStatus != null)
                        {
                            if (strStatus == "운용")
                                status = 1;
                            else if (strStatus == "유휴")
                                status = 0;
                        }
                    }
                    else if (pair.Key == ITPropertyWriter.Index_UnitPos)
                    {
                        string strUnitPos = pair.Value[i];

                        if (strUnitPos != null)
                        {
                            int uPos;

                            if (int.TryParse(strUnitPos.Trim(), out uPos))
                                startPos = uPos;
                        }
                    }
                    else if (pair.Key == ITPropertyWriter.Index_Shelf)
                    {
                        strShelf = pair.Value[i];

                        if (strShelf != null)
                        {
                            if (strShelf == "N" || strShelf == "n" || strShelf == "아니오")
                                shelf = false;
                            else if (strShelf == "Y" || strShelf == "y" || strShelf == "예")
                                shelf = true;
                        }
                    }
                    else if (pair.Key == ITPropertyWriter.Index_PosInShelf)
                    {
                        string strPosInShelf = pair.Value[i];

                        if (strPosInShelf != null)
                        {
                            strPosInShelf = strPosInShelf.ToLower();

                            if (strPosInShelf == "왼쪽" || strPosInShelf == "left")
                                posInShelf = (int)Item.ShelfPosition.Left;
                            else if (strPosInShelf == "가운데" || strPosInShelf == "center")
                                posInShelf = (int)Item.ShelfPosition.Center;
                            else if (strPosInShelf == "오른쪽" || strPosInShelf == "right")
                                posInShelf = (int)Item.ShelfPosition.Right;
                        }
                    }
                }

                if (strHostName == null || strHostName.Trim().Length == 0)
                {
                    strErrorMessage = "호스트명은 비어있을수 없습니다.";
                    return false;
                }

                if (startPos == null)
                {
                    if (strRackName != null && strRackName.Trim().Length > 0)
                    {
                        strErrorMessage = "시작위치는 비어있을수 없습니다.";
                        return false;
                    }
                }

                EquipmentType equipmentType = GetEquipmentType(strType, dicKorEquipmentTypes, dicEngEquipmentTypes, out strErrorMessage);

                if (equipmentType == null)
                    return false;

                ItemType itemType = GetItemTypeFromModel(strModelName, strCompanyName, dicKorItemTypes, dicEngItemTypes, out strErrorMessage);

                if (itemType == null)
                {
                    itemType = CreateNewItemType(strModelName, strCompanyName, equipmentType, strType, strUSize, shelf, dicDefaultItemTypes, dicKorItemTypes, dicEngItemTypes, dicKorCompanies, dicEngCompanies, ref strErrorMessage);

                    if (itemType == null)
                        return false;
                }

                if (strUSize != null && strUSize.Trim().Length > 0)
                {
                    int usize;

                    if (int.TryParse(strUSize.Trim(), out usize) == false || usize <= 0)
                    {
                        strErrorMessage = string.Format("{0}는 0보다 큰 정수만 입력 가능합니다.({1})", ITPropertyWriter.Column_USize, strUSize);
                        return false;
                    }

                    if (itemType.Unit == null)
                    {
                        strErrorMessage = string.Format("제조사 {0}, 모델명 {1}의 {2}는 null입니다. 별도로 지정할 수 없습니다.({3})", strCompanyName, strModelName, ITPropertyWriter.Column_USize, strUSize);
                        return false;
                    }
                    else if ((int)itemType.Unit != usize)
                    {
                        strErrorMessage = string.Format("제조사 {0}, 모델명 {1}의 {2}는 {3}입니다. {4}로 입력되었습니다.", strCompanyName, strModelName, ITPropertyWriter.Column_USize, (int)itemType.Unit, strUSize);
                        return false;
                    }
                }

                if (shelf != null)
                {
                    if (itemType.Shelf != shelf)
                    {
                        if (itemType.Shelf == null)
                            strErrorMessage = string.Format("제조사 {0}, 모델명 {1}의 선반 필요여부는 null입니다. 별도로 지정할 수 없습니다.({2})", strCompanyName, strModelName, strShelf);
                        else
                        {
                            string strYesNo = (bool)itemType.Shelf ? "Y" : "N";
                            strErrorMessage = string.Format("제조사 {0}, 모델명 {1}의 선반 필요여부는 {2}입니다. 입력된 값으로 변경할 수 없습니다.({3})", strCompanyName, strModelName, strYesNo, strShelf);
                        }

                        return false;
                    }
                }

                Rack rack = IsValidRackName(strRackName, dicRacks, out strErrorMessage);

                if (rack == null)
                {
                    if (strErrorMessage != null)
                        return false;
                }
                else
                {
                    dicItems = null;
                    dicSubItems = null;
                }

                if (rack != null)
                {
                    if (dicRackItems.TryGetValue(rack, out dicItems) == false)
                    {
                        dicItems = new Dictionary<int, RackItem>();
                        dicRackItems[rack] = dicItems;
                    }

                    if (startPos != null && itemType.Unit != null)
                    {
                        RackType rackType;

                        if (dicRackTypes.TryGetValue(rack.RackTypeID, out rackType))
                        {
                            if (rackType.Unit < (int)startPos || rackType.Unit < (int)startPos + (int)itemType.Unit - 1)
                            {
                                strErrorMessage = string.Format("IT자산의 시작위치 또는 U 크기가 Rack의 크기를 벗어났습니다.({0})", strHostName);
                                return false;
                            }
                        }
                    }
                }

                if (rack != null)
                {
                    if (dicRackSubItems.TryGetValue(rack, out dicSubItems) == false)
                    {
                        dicSubItems = new Dictionary<int, RackItem>();
                        dicRackSubItems[rack] = dicSubItems;
                    }
                }

                RackItem item = new RackItem();

                item.CenterID = m_nDataCenterID;
                item.ItemTypeID = itemType.ID;
                item.Name = strHostName;
                item.PositionInShelf = posInShelf;

                if (rack != null)
                    item.RackID = rack.ID;

                item.RegDate = dtNow;
                item.Status = status;

                if (startPos != null)
                    item.UPos = (int)startPos;

                item.Usage = strUsage == null ? "" : strUsage;

                if (dicItemNames.ContainsKey(item.Name.ToLower()))
                {
                    strErrorMessage = string.Format("같은 Host명을 가진 IT자산이 둘 이상 존재합니다.({0})", strHostName);
                    return false;
                }
                else
                    dicItemNames[item.Name.ToLower()] = item;

                int failPos;

                if (rack != null)
                {
                    if (CheckSlot(item, itemType, dicItems, dicSubItems, out failPos) == false)
                    {
                        strErrorMessage = string.Format("Rack({0})의 {1} 위치에 둘 이상의 IT 자산이 존재합니다.", strRackName, failPos);
                        return false;
                    }
                }
                else
                    noRackItems.Add(item);
                
                items.Add(item);
            }

            if (m_dataManager.BeginTransaction() == false)
            {
                strErrorMessage = "DB 트랜잭션을 시작할 수 없습니다.";
                return false;
            }

            string strDataCenterIDs = m_nDataCenterID.ToString();

            if (SaveManager.DeleteItem(strDataCenterIDs, m_dataManager, out strErrorMessage) == false)
            {
                m_dataManager.Rollback();
                return false;
            }

            foreach (KeyValuePair<Rack, Dictionary<int, RackItem>> pair in dicRackItems)
            {
                foreach (KeyValuePair<int, RackItem> pair2 in pair.Value)
                {
                    Item item = m_dataManager.GetCreateManager().CreateItem(pair2.Value, out strErrorMessage);

                    if (item == null)
                    {
                        m_dataManager.Rollback();
                        return false;
                    }

                    Item_RU itemRU = new Item_RU();
                    itemRU.ItemID = item.ID;
                    itemRU.RackID = pair2.Value.RackID;
                    itemRU.UPos = pair2.Value.UPos;

                    if (m_dataManager.GetCreateManager().CreateItem_RU(itemRU, out strErrorMessage) == null)
                    {
                        m_dataManager.Rollback();
                        return false;
                    }
                }
            }

            foreach (RackItem rackItem in noRackItems)
            {
                Item item = m_dataManager.GetCreateManager().CreateItem(rackItem, out strErrorMessage);

                if (item == null)
                {
                    m_dataManager.Rollback();
                    return false;
                }
            }

            if (m_dataManager.Commit() == false)
            {
                strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
                return false;
            }

            return true;
        }

        private ItemType CreateNewItemType(string strModelName, string strCompanyName, EquipmentType equipmentType, string strType, string strUSize, bool? shelf, Dictionary<string, ItemType> dicDefaultItemTypes, Dictionary<string, ItemType> dicKorItemTypes, Dictionary<string, ItemType> dicEngItemTypes, Dictionary<string, Company> dicKorCompanies, Dictionary<string, Company> dicEngCompanies, ref string strErrorMessage)
        {
            if (strUSize == null)
                return null;

            int usize;

            if (int.TryParse(strUSize.Trim(), out usize) == false)
                return null;

            string strKey = GetDefaultItemTypeKey(equipmentType.ID, usize, shelf == null ? false : (bool)shelf);
            ItemType itemType;

            if (dicDefaultItemTypes.TryGetValue(strKey, out itemType) == false)
                return null;

            Company company = null;

            if (dicKorCompanies.TryGetValue(strCompanyName.ToLower(), out company) == false)
            {
                if (dicEngCompanies.TryGetValue(strCompanyName.ToLower(), out company) == false)
                {
                    company = new Company();
                    company.EngName = company.Name = strCompanyName;
                    company = m_dataManager.GetCreateManager().CreateCompany(company, out strErrorMessage);

                    if (company == null)
                    {
                        strErrorMessage = "시스템 데이터베이스에 새로운 제조사 정보를 입력하는데 실패하였습니다.";
                        return null;
                    }
                    else
                    {
                        dicKorCompanies[company.Name.ToLower()] = company;
                        dicEngCompanies[company.EngName.ToLower()] = company;
                    }
                }
            }

            ItemType _itemType = new ItemType();

            _itemType.BackImageUrl = itemType.BackImageUrl;
            _itemType.ClassName = itemType.ClassName;
            _itemType.CompanyID = company.ID;
            _itemType.Depth = itemType.Depth;
            _itemType.EquipmentType = itemType.EquipmentType;
            _itemType.FbxUrl = itemType.FbxUrl;
            _itemType.GlbUrl = itemType.GlbUrl;
            _itemType.Height = itemType.Height;
            _itemType.ImageUrl = itemType.ImageUrl;
            _itemType.ModelName = strModelName;
            _itemType.Shelf = shelf != null && shelf == true;
            _itemType.Type = itemType.Type;
            _itemType.Unit = usize;
            _itemType.Width = itemType.Width;
            _itemType.RegDate = DateTime.Now;

            _itemType = m_dataManager.GetCreateManager().CreateItemType(_itemType, out strErrorMessage);

            if (_itemType == null)
            {
                strErrorMessage = "시스템 데이터베이스에 새로운 IT 자산타입 정보를 입력하는데 실패하였습니다.";
                return null;
            }

            string strKey2 = GetItemTypeKey(strModelName, strCompanyName);
            dicKorItemTypes[strKey2] = _itemType;
            dicEngItemTypes[strKey2] = _itemType;

            return _itemType;
        }

        private bool CheckSlot(RackItem item, ItemType itemType, Dictionary<int, RackItem> dicItems, Dictionary<int, RackItem> dicSubItems, out int failPos)
        {
            failPos = -1;

            for (int i=item.UPos;i<item.UPos + itemType.Unit;i++)
            {
                if (dicSubItems.ContainsKey(i))
                {
                    failPos = i;
                    return false;
                }
                else
                    dicSubItems[i] = item;
            }

            dicItems[item.UPos] = item;

            return true;
        }

        private Rack IsValidRackName(string strRackName, Dictionary<string, Rack> dicRacks, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strRackName == null || strRackName.Trim().Length == 0)
            {
                //strErrorMessage = "Rack명은 비어있을수 없습니다.";
                return null;
            }

            Rack rack;
            string strRackName2 = strRackName.Trim().ToLower();

            if (dicRacks.TryGetValue(strRackName2, out rack) == false)
            {
                strErrorMessage = string.Format("[{0}]은 존재하지 않는 Rack 이름입니다.", strRackName);
                return null;
            }

            return rack;
        }

        private EquipmentType GetEquipmentType(string strType, Dictionary<string, EquipmentType> dicKorEquipmentTypes, Dictionary<string, EquipmentType> dicEngEquipmentTypes, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strType == null || strType.Trim().Length == 0)
            {
                strErrorMessage = "IT자산 구분은 비어있을수 없습니다.";
                return null;
            }

            string strType2 = strType.Trim().ToLower();
            EquipmentType equipmentType;

            if (dicKorEquipmentTypes.TryGetValue(strType2, out equipmentType))
                return equipmentType;

            if (dicEngEquipmentTypes.TryGetValue(strType2, out equipmentType))
                return equipmentType;

            strErrorMessage = string.Format("IT자산 구분({0})은 인식할 수 없는 값입니다.", strType);
            return null;
        }

        private ItemType GetItemTypeFromModel(string strModelName, string strCompanyName, Dictionary<string, ItemType> dicKorItemTypes, Dictionary<string, ItemType> dicEngItemTypes, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strModelName == null || strModelName.Trim().Length == 0)
            {
                strErrorMessage = "모델명은 비어있을수 없습니다.";
                return null;
            }

            if (strCompanyName == null || strCompanyName.Trim().Length == 0)
            {
                strErrorMessage = "제조사는 비어있을수 없습니다.";
                return null;
            }

            ItemType itemType;
            string str = GetItemTypeKey(strModelName, strCompanyName);

            if (dicKorItemTypes.TryGetValue(str, out itemType))
                return itemType;

            if (dicEngItemTypes.TryGetValue(str, out itemType))
                return itemType;

            strErrorMessage = string.Format("모델명({0}), 제조사({1})에 해당하는 IT 자산정보는 존재하지 않습니다.\r\n데이터를 다시 확인하시기 바랍니다.", strModelName, strCompanyName);
            return null;
        }

        private bool GetRacks(int nDataCenterID, Dictionary<string, Rack> dicRacks, Dictionary<string, ItemType> dicDefaultItemTypes, Dictionary<int, EquipmentType> dicEquipmentTypes, Dictionary<string, EquipmentType> dicKorEquipmentTypes, Dictionary<string, EquipmentType> dicEngEquipmentTypes, Dictionary<string, ItemType> dicKorItemTypes, Dictionary<string, ItemType> dicEngItemTypes, Dictionary<string, Company> dicKorCompanies, Dictionary<string, Company> dicEngCompanies, out string strErrorMessage)
        {
            Dictionary<Rack.Fields, object> dicConditions = new Dictionary<Rack.Fields, object>();
            dicConditions[Rack.Fields.CenterID] = nDataCenterID;

            List<Rack> racks = m_dataManager.GetSelectManager().SelectRacks(dicConditions, null, out strErrorMessage);

            if (racks == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 Rack 정보를 조회하는데 실패하였습니다.";
                return false;
            }

            foreach (Rack rack in racks)
            {
                dicRacks[rack.Name.ToLower()] = rack;
            }

            bool isNullable;
            string strCondition = string.Format("{0} = (Select {1} from {2} where {3} = 'IT Equipment')",
                EquipmentType.GetFieldName(EquipmentType.Fields.CategoryID, out isNullable),
                EquipmentCategory.GetFieldName(EquipmentCategory.Fields.ID, out isNullable),
                EquipmentCategory.TableName,
                EquipmentCategory.GetFieldName(EquipmentCategory.Fields.EngName, out isNullable));

            List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, strCondition, out strErrorMessage);

            if (equipmentTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 IT 자산구분 정보를 조회하는데 실패하였습니다.";
                return false;
            }

            foreach (EquipmentType equipmentType in equipmentTypes)
            {
                dicEquipmentTypes[equipmentType.ID] = equipmentType;
                dicKorEquipmentTypes[equipmentType.Name.ToLower()] = equipmentType;
                dicEngEquipmentTypes[equipmentType.EngName.ToLower()] = equipmentType;
            }

            List<Company> companies = m_dataManager.GetSelectManager().SelectCompanies(null, null, out strErrorMessage);

            if (companies == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 국가 정보를 조회하는데 실패하였습니다.";
                return false;
            }

            Company defaultCompany = null;
            Dictionary<int, Company> dicCompanies = new Dictionary<int, Company>();

            foreach (Company company in companies)
            {
                dicCompanies[company.ID] = company;
                dicKorCompanies[company.Name.ToLower()] = company;
                dicEngCompanies[company.EngName.ToLower()] = company;

                if (company.Name == "기본" || company.EngName.ToLower().StartsWith("basic"))
                    defaultCompany = company;
            }

            List<ItemType> itemTypes = m_dataManager.GetSelectManager().SelectItemTypes(null, null, out strErrorMessage);

            if (itemTypes == null)
            {
                strErrorMessage = "시스템 데이터베이스에서 전체 IT 자산타입 정보를 조회하는데 실패하였습니다.";
                return false;
            }

            foreach (ItemType itemType in itemTypes)
            {
                Company company;

                if (dicCompanies.TryGetValue(itemType.CompanyID, out company))
                {
                    dicKorItemTypes[GetItemTypeKey(itemType, company, true)] = itemType;
                    dicEngItemTypes[GetItemTypeKey(itemType, company, false)] = itemType;

                    if (defaultCompany != null && itemType.CompanyID == defaultCompany.ID && itemType.Type.ToLower() == "r-type" && itemType.Unit != null && itemType.ImageUrl.Contains("SHD") == false)
                        dicDefaultItemTypes[GetDefaultItemTypeKey(itemType.EquipmentType, (int)itemType.Unit, itemType.Shelf == null ? false : (bool)itemType.Shelf)] = itemType;
                }
            }

            return true;
        }

        private string GetItemTypeKey(ItemType itemType, Company company, bool isKorean)
        {
            if (isKorean)
                return GetItemTypeKey(itemType.ModelName, company.Name);

            return GetItemTypeKey(itemType.ModelName, company.EngName);
        }

        private string GetItemTypeKey(string strModelName, string strCompanyName)
        {
            return strModelName.ToLower() + "_" + strCompanyName.ToLower();
        }

        private string GetDefaultItemTypeKey(int equipmentType, int unit, bool shelf)
        {
            return equipmentType.ToString() + "_" + unit.ToString() + "_" + shelf.ToString();
        }
    }
}
