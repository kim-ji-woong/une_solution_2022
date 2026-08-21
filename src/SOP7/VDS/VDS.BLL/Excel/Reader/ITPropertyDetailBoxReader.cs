using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Excel.Reader
{
    using Models.Request;
    using Writer;

    public class ITPropertyDetailBoxReader : ExcelReader
    {
        private int m_nDataCenterID = -1;

        public ITPropertyDetailBoxReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
            : base(strFilePath, dataManager)
        {
            m_nDataCenterID = nDataCenterID;
        }

        protected override bool UpdateData(List<SheetData> sheetDatas, out string strErrorMessage)
        {
			strErrorMessage = null;

            if (sheetDatas.Count == 0)
            {
                strErrorMessage = "잘못된 형식의 엑셀파일입니다.";
                return false;
            }

            SheetData sheetData = sheetDatas[0];
            int columnCount = sheetData.ColumnDatas.Count;

            if (columnCount == 0)
            {
                strErrorMessage = "비어있는 엑셀파일입니다.";
                return false;
            }

			List<Box> boxes = new List<Box>();
            int dataCount = sheetData.ColumnDatas[0].Count;

            for (int i=2;i<dataCount;i++)
            {
                Box box = ReadBox(i, columnCount, sheetData.ColumnDatas, ref strErrorMessage);

				if (box == null)
					return false;
				else
					boxes.Add(box);
            }

			if (m_dataManager.BeginTransaction() == false)
            {
				strErrorMessage = "DB Transaction을 시작할 수 없습니다.";
				return false;
			}

			Dictionary<Item.Fields, object> dicConditions = new Dictionary<Item.Fields, object>();
			dicConditions[Item.Fields.CenterID] = m_nDataCenterID;

			List<Item> items = m_dataManager.GetSelectManager().SelectItems(dicConditions, null, out strErrorMessage);

			if (items == null)
			{
				strErrorMessage = "시스템 데이터베이스에서 VDC내 IT 자산 정보를 조회하는데 실패하였습니다.";
				return false;
			}

			Dictionary<string, Item> dicItems = new Dictionary<string, Item>();

			foreach (Item item in items)
            {
				dicItems[item.Name] = item;
            }

			Dictionary<int, ItemType> dicItemTypes = GetBoxItemTypes(ref strErrorMessage);

			if (dicItemTypes == null)
				return false;

			foreach (Box box in boxes)
            {
				Item item;

				if (dicItems.TryGetValue(box.Basic_Name, out item) && dicItemTypes.ContainsKey(item.ItemTypeID))
					box.BoxID = item.ID;
				else
					box.BoxID = null;

				box.DataCenterID = m_nDataCenterID;
            }

			if (DeleteBoxes(m_nDataCenterID, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 박스 정보를 삭제하는데 실패하였습니다.";
				return false;
			}

			if (AddBoxes(boxes, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 새로운 박스 정보를 입력하는데 실패하였습니다.";
				return false;
			}

			if (m_dataManager.Commit() == false)
			{
				strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
				return false;
			}

			return true;
        }

		private bool AddBoxes(List<Box> boxes, ref string strErrorMessage)
        {
			foreach (Box box in boxes)
			{
				if (m_dataManager.GetCreateManager().CreateBox(box, out strErrorMessage) == null)
					return false;
			}

			return true;
		}

		private bool DeleteBoxes(int nDataCenterID, ref string strErrorMessage)
        {
			Dictionary<Box.Fields, object> dicConditions = new Dictionary<Box.Fields, object>();
			dicConditions[Box.Fields.DataCenterID] = nDataCenterID;

			return m_dataManager.GetDeleteManager().DeleteBox(dicConditions, null, out strErrorMessage);
        }

		private Dictionary<int, ItemType> GetBoxItemTypes(ref string strErrorMessage)
        {
			List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

			if (equipmentTypes == null)
				return null;

			int nEquipmentTypeID = -1;

			foreach (EquipmentType type in equipmentTypes)
            {
				string strTypeName = type.EngName.ToLower();

				if (strTypeName == "box")
                {
					nEquipmentTypeID = type.ID;
					break;
                }
            }

			if (nEquipmentTypeID < 0)
				return new Dictionary<int, ItemType>();

			Dictionary<int, ItemType> dicItemTypes = new Dictionary<int, ItemType>();

			Dictionary<ItemType.Fields, object> dicConditions = new Dictionary<ItemType.Fields, object>();
			dicConditions[ItemType.Fields.EquipmentType] = nEquipmentTypeID;

			List<ItemType> itemTypes = m_dataManager.GetSelectManager().SelectItemTypes(dicConditions, null, out strErrorMessage);

			if (itemTypes == null)
			{
				strErrorMessage = "시스템 데이터베이스에서 IT 자산타입 정보를 조회하는데 실패하였습니다.";
				return null;
			}

			foreach (ItemType itemType in itemTypes)
            {
				dicItemTypes[itemType.ID] = itemType;
            }

			return dicItemTypes;
        }

        private Box ReadBox(int index, int columnCount, Dictionary<int, List<string>> columnDatas, ref string strErrorMessage)
        {
			bool success;
			Box box = new Box();

            for (int i=0;i<columnCount;i++)
            {
                List<string> datas = columnDatas[i];
                string strData = datas[index];

				if (i == 0)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(Box명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.Basic_Name = str;
				}
				else if (i == 1)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(Box 등급)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.Basic_ItemLevel = str;
				}
				else if (i == 2)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(Box제조사)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.Basic_Company = str;
				}
				else if (i == 3)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(Box모델명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.Basic_ModelName = str;
				}
				else if (i == 4)
					box.Basic_EquipType = GetString(strData);
				else if (i == 5)
					box.Basic_SerialNumber = GetString(strData);
				else if (i == 6)
					box.Basic_PropertyType = GetString(strData);
				else if (i == 7)
				{
					box.Basic_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(입고일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 8)
				{
					box.Basic_RegDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 9)
					box.Basic_OwnDepartment = GetString(strData);
				else if (i == 10)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(상태)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.Basic_Status = str;
				}
				else if (i == 11)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(용도)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.Basic_Usage = str;
				}
				else if (i == 12)
					box.Manage_SuperviseManager = GetString(strData);
				else if (i == 13)
					box.Manage_OperationManager = GetString(strData);
				else if (i == 14)
				{
					box.Basic_PartitionAble = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(파티션 가능유무)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 15)
					box.Basic_PartitionName = GetString(strData);
				else if (i == 16)
				{
					box.Basic_ReceiveYears = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(도입년차(년))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 17)
					box.Position_InstallRegion = GetString(strData);
				else if (i == 18)
					box.Position_RackDetailPosition = GetString(strData);
				else if (i == 19)
					box.Basic_OperationDepartment = GetString(strData);
				else if (i == 20)
				{
					box.Basic_DiscardDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(폐기일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 21)
				{
					box.Basic_OverUsedYear = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용연한 초과여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 22)
				{
					box.Maintenance_WarrantyMonth = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 기간(개월))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 23)
				{
					box.Maintenance_WarrantyExpiredDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 만료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 24)
				{
					box.Maintenance_EOLDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOL 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 25)
				{
					box.Maintenance_EOSLDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOSL 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 26)
				{
					box.Maintenance_EOSL = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOSL 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 27)
				{
					box.Maintenance_MaintenanceContract = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(계약여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 28)
					box.Maintenance_MaintenanceCompanyName = GetString(strData);
				else if (i == 29)
				{
					box.Maintenance_MaintenanceBeginDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(개시일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 30)
				{
					box.Maintenance_MaintenanceEndDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(종료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 31)
					box.Maintenance_ProvideCompanyName = GetString(strData);
				else if (i == 32)
					box.HW_BoxPartitionType = GetString(strData);
				else if (i == 33)
				{
					box.HW_PowerDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Power 이중화여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 34)
				{
					box.HW_ConsoleUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(콘솔유무)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 35)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(모델명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.CPU_ModelName = str;
				}
				else if (i == 36)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(Clock Speed)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					box.CPU_ClockSpeed = str;
				}
				else if (i == 37)
				{
					box.CPU_SocketCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Socket 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 38)
				{
					box.CPU_CoreCountPerCPU = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(CPU당 Core 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 39)
				{
					box.CPU_TotalSlotCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(전체 Slot 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 40)
				{
					box.CPU_UseSlotCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용 Slot 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 41)
				{
					box.CPU_HTUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(HT 지원유무)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 42)
				{
					int? data = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(총 Core 수)의 값은 정수만 가능합니다.", GetCellName(i, index));
						return null;
					}

					if (data == null)
					{
						strErrorMessage = string.Format("{0}(총 Core 수)의 값이 비어있습니다.", GetCellName(i, index));
						return null;
					}

					box.CPU_TotalCoreCount = (int)data;
				}
				else if (i == 43)
				{
					box.Mem_TotalSlotCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(전체 Slot 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 44)
				{
					box.Mem_EA_1GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(1GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 45)
				{
					box.Mem_EA_2GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(2GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 46)
				{
					box.Mem_EA_4GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(4GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 47)
				{
					box.Mem_EA_8GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(8GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 48)
				{
					box.Mem_EA_16GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(16GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 49)
				{
					box.Mem_EA_32GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(32GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 50)
				{
					box.Mem_EA_64GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(64GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 51)
				{
					box.Mem_EA_128GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(128GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 52)
				{
					box.Mem_EA_256GB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(256GB(EA))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 53)
				{
					box.Mem_UseSlotCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용 Slot 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 54)
				{
					box.Mem_MemoryCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Memory 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 55)
				{
					int? data = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(총 Memory 용량)의 값은 정수만 가능합니다.", GetCellName(i, index));
						return null;
					}

					if (data == null)
					{
						strErrorMessage = string.Format("{0}(총 Memory 용량)의 값이 비어있습니다.", GetCellName(i, index));
						return null;
					}

					box.Mem_TotalMemoryVolume = (int)data;
				}
				else if (i == 56)
				{
					box.Internal_InternalDiskVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Internal Disk 용량(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 57)
				{
					box.Internal_InternalDiskCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Internal Disk 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 58)
				{
					box.Internal_InternalDiskUsableVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Internal Disk usable Disk 용량(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 59)
				{
					box.Internal_InternalDiskTotalSlotCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Internal Disk 전체 Slot 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 60)
					box.Internal_InternalDiskUseSlot = GetString(strData);
				else if (i == 61)
					box.Internal_InternalDiskRaidType = GetString(strData);
				else if (i == 62)
				{
					box.Internal_InternalDiskSizeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Internal Disk Size(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 63)
					box.External_ExternalDiskCompanyName = GetString(strData);
				else if (i == 64)
					box.External_ExternalDiskModel = GetString(strData);
				else if (i == 65)
					box.External_ExternalDiskRaidType = GetString(strData);
				else if (i == 66)
				{
					box.External_ExternalDiskSizeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(External DISK Size(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 67)
					box.External_ExternalDiskMultiPathSolution = GetString(strData);
				else if (i == 68)
				{
					box.PS_PowerSupplyCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Power Supply 개수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 69)
					box.PS_PowerSupplyVolumeW = GetString(strData);
				else if (i == 70)
				{
					box.PS_PowerSupplyPduDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Power Supply PDU 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 71)
				{
					box.PS_PowerSupplyRackPowerDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Power Supply Rack 전원 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 72)
				{
					box.Fan_FanCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(FAN 개수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 73)
				{
					box.Fan_FanDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(FAN 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 74)
					box.Nic_NicSpeed = GetString(strData);
				else if (i == 75)
					box.Nic_NicType = GetString(strData);
				else if (i == 76)
					box.Nic_NicPort = GetString(strData);
				else if (i == 77)
				{
					box.Nic_NicCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(NIC 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 78)
				{
					box.Nic_NicUsePortCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(NIC 사용 Port 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 79)
				{
					box.Nic_OnboardNicPortCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Onboard NIC Port 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 80)
				{
					box.Nic_OnboardNicUsePortCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Onboard NIC 사용 Port 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 81)
					box.Nic_HBASpeed = GetString(strData);
				else if (i == 82)
					box.Nic_HBAType = GetString(strData);
				else if (i == 83)
					box.Nic_HBAPort = GetString(strData);
				else if (i == 84)
				{
					box.Nic_HBACount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(HBA 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 85)
				{
					box.Nic_UsingHBAPortCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용중인 HBA Port 수량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 86)
					box.NW_ManageIPAddr = GetString(strData);
				else if (i == 87)
					box.NW_IPAddr2 = GetString(strData);
				else if (i == 88)
					box.NW_IPAddr3 = GetString(strData);
				else if (i == 89)
					box.NW_IPAddr4 = GetString(strData);
				else if (i == 90)
					box.Connect_SanSwitch1 = GetString(strData);
				else if (i == 91)
					box.Connect_SanSwitch2 = GetString(strData);
				else if (i == 92)
					box.Connect_SanSwitch3 = GetString(strData);
				else if (i == 93)
					box.Connect_NWEquip1 = GetString(strData);
				else if (i == 94)
					box.Connect_NWEquip2 = GetString(strData);
				else if (i == 95)
					box.Connect_NWEquip3 = GetString(strData);
				else if (i == 96)
					box.Connect_NWEquip4 = GetString(strData);
				else if (i == 97)
					box.Connect_NWEquip5 = GetString(strData);
				else if (i == 98)
					box.Connect_NWEquip6 = GetString(strData);
				else if (i == 99)
					box.Connect_NWEquip7 = GetString(strData);
				else if (i == 100)
					box.Connect_NWEquip8 = GetString(strData);
				else if (i == 101)
					box.Connect_Storage1 = GetString(strData);
				else if (i == 102)
					box.Connect_Storage2 = GetString(strData);
				else if (i == 103)
					box.Connect_Backup1 = GetString(strData);
				else if (i == 104)
					box.Connect_Backup2 = GetString(strData);
				else if (i == 105)
					box.Connect_Backup3 = GetString(strData);
				else if (i == 106)
					box.Connect_Backup4 = GetString(strData);
			}

			return box;
        }
    }
}
