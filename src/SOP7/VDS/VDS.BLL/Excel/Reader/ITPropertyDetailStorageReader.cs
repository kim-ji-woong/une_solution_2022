using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Excel.Reader
{
	using Models.Request;
	using Writer;

	public class ITPropertyDetailStorageReader : ExcelReader
	{
		private int m_nDataCenterID = -1;

		public ITPropertyDetailStorageReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
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

			List<Storage> storages = new List<Storage>();
			int dataCount = sheetData.ColumnDatas[0].Count;

			for (int i = 2; i < dataCount; i++)
			{
				Storage storage = ReadStorage(i, columnCount, sheetData.ColumnDatas, ref strErrorMessage);

				if (storage == null)
					return false;
				else
					storages.Add(storage);
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
				strErrorMessage = "시스템 데이터베이스에서 VDC내 IT 자산타입 정보를 조회하는데 실패하였습니다.";
				return false;
			}

			Dictionary<string, Item> dicItems = new Dictionary<string, Item>();

			foreach (Item item in items)
			{
				dicItems[item.Name] = item;
			}

			Dictionary<int, ItemType> dicItemTypes = GetStorageItemTypes(ref strErrorMessage);

			if (dicItemTypes == null)
				return false;

			foreach (Storage storage in storages)
			{
				Item item;

				if (dicItems.TryGetValue(storage.Basic_Name, out item) && dicItemTypes.ContainsKey(item.ItemTypeID))
					storage.StorageID = item.ID;
				else
					storage.StorageID = null;

				storage.DataCenterID = m_nDataCenterID;
			}

			if (DeleteStorages(m_nDataCenterID, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 스토리지 정보를 삭제하는데 실패하였습니다.";
				return false;
			}

			if (AddStorages(storages, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에 새로운 스토리지 정보를 입력하는데 실패하였습니다.";
				return false;
			}

			if (m_dataManager.Commit() == false)
			{
				strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
				return false;
			}

			return true;
		}

		private bool AddStorages(List<Storage> storages, ref string strErrorMessage)
		{
			foreach (Storage storage in storages)
			{
				if (m_dataManager.GetCreateManager().CreateStorage(storage, out strErrorMessage) == null)
					return false;
			}

			return true;
		}

		private bool DeleteStorages(int nDataCenterID, ref string strErrorMessage)
		{
			Dictionary<Storage.Fields, object> dicConditions = new Dictionary<Storage.Fields, object>();
			dicConditions[Storage.Fields.DataCenterID] = nDataCenterID;

			return m_dataManager.GetDeleteManager().DeleteStorage(dicConditions, null, out strErrorMessage);
		}

		private Dictionary<int, ItemType> GetStorageItemTypes(ref string strErrorMessage)
		{
			List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

			if (equipmentTypes == null)
				return null;

			int nEquipmentTypeID = -1;

			foreach (EquipmentType type in equipmentTypes)
			{
				string strTypeName = type.EngName.ToLower();

				if (strTypeName == "storage")
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

		private Storage ReadStorage(int index, int columnCount, Dictionary<int, List<string>> columnDatas, ref string strErrorMessage)
		{
			bool success;
			Storage storage = new Storage();

			for (int i = 0; i < columnCount; i++)
			{
				List<string> datas = columnDatas[i];
				string strData = datas[index];

				if (i == 0)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(스토리지명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.Basic_Name = str;
				}
				else if (i == 1)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(상태)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.Basic_Status = str;
				}
				else if (i == 2)
				{
					storage.Basic_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(입고일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 3)
				{
					storage.Basic_RegDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 4)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(Storage 등급)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.Basic_ItemLevel = str;
				}
				else if (i == 5)
				{
					storage.Basic_ReceiveYears = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(도입년차(년))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 6)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(용도)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.Basic_Usage = str;
				}
				else if (i == 7)
					storage.Basic_OwnerCompanyName = GetString(strData);
				else if (i == 8)
					storage.Basic_OwnDepartment = GetString(strData);
				else if (i == 9)
					storage.Basic_OperationDepartment = GetString(strData);
				else if (i == 10)
					storage.Basic_SiteManager = GetString(strData);
				else if (i == 11)
				{
					storage.Basic_DiscardDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(폐기일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 12)
				{
					storage.Basic_OverUsedYear = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용연한 초과여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 13)
					storage.Basic_Memo = GetString(strData);
				else if (i == 14)
					storage.Manage_SuperviseManager = GetString(strData);
				else if (i == 15)
					storage.Manage_OperationManager = GetString(strData);
				else if (i == 16)
					storage.Position_InstallRegion = GetString(strData);
				else if (i == 17)
					storage.Position_RackDetailPosition = GetString(strData);
				else if (i == 18)
					storage.Maintenance_ProvideCompanyName = GetString(strData);
				else if (i == 19)
				{
					storage.Maintenance_WarrantyMonth = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 기간(개월))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 20)
				{
					storage.Maintenance_WarrantyExpiredDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 만료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 21)
					storage.Maintenance_MaintenanceCompanyName = GetString(strData);
				else if (i == 22)
				{
					storage.Maintenance_EOSDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOS 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 23)
				{
					storage.Maintenance_EOLDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOL 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 24)
				{
					storage.Maintenance_EOSL = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOSL 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 25)
				{
					storage.Maintenance_EOSLDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOSL 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 26)
				{
					storage.Maintenance_MaintenanceContract = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(계약여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 27)
				{
					storage.Maintenance_MaintenanceBeginDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(개시일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 28)
				{
					storage.Maintenance_MaintenanceEndDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(종료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 29)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(모델명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.HW_ModelName = str;
				}
				else if (i == 30)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(제조사)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.HW_Company = str;
				}
				else if (i == 31)
				{
					storage.HW_CacheMemory = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(캐쉬메모리)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 32)
					storage.HW_SerialNumber = GetString(strData);
				else if (i == 33)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(Disk Type)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.HW_DiskType = str;
				}
				else if (i == 34)
					storage.HW_ControllerFirmwareVersion = GetString(strData);
				else if (i == 35)
				{
					storage.HW_TotalPhysicalVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Total Phisycal 용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 36)
				{
					int? data = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Total Usable 용량)의 값은 정수만 가능합니다.", GetCellName(i, index));
						return null;
					}

					if (data == null)
					{
						strErrorMessage = string.Format("{0}(Total Usable 용량)의 값이 비어있습니다.", GetCellName(i, index));
						return null;
					}

					storage.HW_TotalUsableVolume = (int)data;
				}
				else if (i == 37)
				{
					storage.HW_LogicalVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Logical 용량(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 38)
				{
					storage.HW_FreeVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(여유 용량(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 39)
				{
					storage.HW_MultiPath = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(MultiPath 도입여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 40)
					storage.HW_MultiPathPropertyName = GetString(strData);
				else if (i == 41)
				{
					storage.HW_AvailableVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Available 용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 42)
				{
					storage.HW_GivenVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(할당 용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 43)
				{
					storage.HW_GivenRate = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(할당율)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 44)
				{
					storage.Dual_DualUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(이중화여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 45)
					storage.Dual_DualType = GetString(strData);
				else if (i == 46)
				{
					storage.Dual_BoxDualUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Box 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 47)
					storage.Dual_BoxDualDiskEquipmentName = GetString(strData);
				else if (i == 48)
					storage.Dual_BoxDualSolutionName = GetString(strData);
				else if (i == 49)
				{
					storage.Dual_ControllerDualUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(컨트롤러 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 50)
				{
					storage.Dual_PowerDualUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(전원 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 51)
				{
					storage.Dual_PDUDualUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(PDU 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 52)
				{
					storage.Dual_RackPowerDualUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Rack 전원 이중화여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 53)
				{
					storage.Dual_InternalCopySWUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(내부복제 SW 사용여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 54)
				{
					storage.Dual_StorageCopyUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(스토리지 복제여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 55)
					storage.Dual_StorageCopyType = GetString(strData);
				else if (i == 56)
				{
					storage.Volume_RegDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 57)
					storage.Volume_DiskType = GetString(strData);
				else if (i == 58)
				{
					storage.Volume_EachDiskVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(개별 Disk 용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 59)
				{
					storage.Volume_DiskCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Disk 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 60)
				{
					storage.Volume_PhysicalVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Physical 용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 61)
				{
					storage.Volume_UsableVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Usable 용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 62)
					storage.Volume_RaidSystem = GetString(strData);
				else if (i == 63)
					storage.Extra_DiskType = GetString(strData);
				else if (i == 64)
				{
					storage.Extra_DiskVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Disk 용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 65)
				{
					storage.Extra_DiskCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Disk 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 66)
					storage.IP_IPType = GetString(strData);
				else if (i == 67)
					storage.IP_IPAddress = GetString(strData);
				else if (i == 68)
					storage.IP_NetworkSpeed = GetString(strData);
				else if (i == 69)
				{
					storage.Port_TotalPortCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(총 Port 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 70)
				{
					storage.Port_UsePortCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용 Port 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 71)
					storage.Port_LinkedSanSwitch = GetString(strData);
				else if (i == 72)
				{
					storage.Port_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(도입일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 73)
				{
					storage.Port_Count = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(대수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 74)
					storage.Connect_ServerName = GetString(strData);
				else if (i == 75)
					storage.Connect_Usage = GetString(strData);
				else if (i == 76)
					storage.Connect_ServiceLevel = GetString(strData);
				else if (i == 77)
					storage.Connect_ModelName = GetString(strData);
				else if (i == 78)
					storage.Connect_OS = GetString(strData);
				else if (i == 79)
					storage.Connect_Cable = GetString(strData);
				else if (i == 80)
				{
					storage.Connect_GivenVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(할당용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 81)
				{
					storage.Connect_RealUseVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(실 사용 용량(AP/DB 파일))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 82)
				{
					storage.Connect_EtcVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(기타 용량(관리))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 83)
				{
					storage.Connect_FreeVolume = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(여유용량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 84)
				{
					storage.Connect_MonthlyIncrease = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(월별 증가량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 85)
					storage.Connect_ConnectType = GetString(strData);
				else if (i == 86)
				{
					storage.Connect_ChannelPathCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Channel Path 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 87)
					storage.Connect_PathDualSolution = GetString(strData);
				else if (i == 88)
					storage.Connect_NWEquip_1 = GetString(strData);
				else if (i == 89)
					storage.Connect_NWEquip_2 = GetString(strData);
				else if (i == 90)
					storage.Connect_NWEquip_3 = GetString(strData);
				else if (i == 91)
					storage.Connect_NWEquip_4 = GetString(strData);
				else if (i == 92)
					storage.Connect_SanSwitch_1 = GetString(strData);
				else if (i == 93)
					storage.Connect_SanSwitch_2 = GetString(strData);
				else if (i == 94)
					storage.Connect_SanSwitch_3 = GetString(strData);
				else if (i == 95)
					storage.Connect_SanSwitch_4 = GetString(strData);
				else if (i == 96)
					storage.Connect_SanSwitch_5 = GetString(strData);
				else if (i == 97)
					storage.Connect_SanSwitch_6 = GetString(strData);
				else if (i == 98)
					storage.Connect_SanSwitch_7 = GetString(strData);
				else if (i == 99)
					storage.Connect_SanSwitch_8 = GetString(strData);
			}

			return storage;
		}
	}
}
