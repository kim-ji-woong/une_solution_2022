using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Excel.Reader
{
	using Models.Request;
	using Writer;

	public class ITPropertyDetailBackupReader : ExcelReader
	{
		private int m_nDataCenterID = -1;

		public ITPropertyDetailBackupReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
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

			List<Backup> backups = new List<Backup>();
			int dataCount = sheetData.ColumnDatas[0].Count;

			for (int i = 2; i < dataCount; i++)
			{
				Backup backup = ReadBackup(i, columnCount, sheetData.ColumnDatas, ref strErrorMessage);

				if (backup == null)
					return false;
				else
					backups.Add(backup);
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

			Dictionary<int, ItemType> dicItemTypes = GetBackupItemTypes(ref strErrorMessage);

			if (dicItemTypes == null)
				return false;

			foreach (Backup backup in backups)
			{
				Item item;

				if (dicItems.TryGetValue(backup.Basic_Name, out item) && dicItemTypes.ContainsKey(item.ItemTypeID))
					backup.BackupID = item.ID;
				else
					backup.BackupID = null;

				backup.DataCenterID = m_nDataCenterID;
			}

			if (DeleteBackups(m_nDataCenterID, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 백업 정보를 삭제하는데 실패하였습니다.";
				return false;
			}

			if (AddBackups(backups, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 새로운 백업 정보를 입력하는데 실패하였습니다.";
				return false;
			}

			if (m_dataManager.Commit() == false)
			{
				strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
				return false;
			}

			return true;
		}

		private bool AddBackups(List<Backup> backups, ref string strErrorMessage)
		{
			foreach (Backup backup in backups)
			{
				if (m_dataManager.GetCreateManager().CreateBackup(backup, out strErrorMessage) == null)
					return false;
			}

			return true;
		}

		private bool DeleteBackups(int nDataCenterID, ref string strErrorMessage)
		{
			Dictionary<Backup.Fields, object> dicConditions = new Dictionary<Backup.Fields, object>();
			dicConditions[Backup.Fields.DataCenterID] = nDataCenterID;

			return m_dataManager.GetDeleteManager().DeleteBackup(dicConditions, null, out strErrorMessage);
		}

		private Dictionary<int, ItemType> GetBackupItemTypes(ref string strErrorMessage)
		{
			List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

			if (equipmentTypes == null)
				return null;

			int nEquipmentTypeID = -1;

			foreach (EquipmentType type in equipmentTypes)
			{
				string strTypeName = type.EngName.ToLower();

				if (strTypeName == "backup")
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

		private Backup ReadBackup(int index, int columnCount, Dictionary<int, List<string>> columnDatas, ref string strErrorMessage)
		{
			bool success;
			Backup backup = new Backup();

			for (int i = 0; i < columnCount; i++)
			{
				List<string> datas = columnDatas[i];
				string strData = datas[index];

				if (i == 0)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(백업장비명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					backup.Basic_Name = str;
				}
				else if (i == 1)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(상태)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					backup.Basic_Status = str;
				}
				else if (i == 2)
				{
					backup.Basic_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(입고일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 3)
				{
					backup.Basic_RegDate = GetDateTime(strData, out success);

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
						strErrorMessage = string.Format("{0}(백업 등급)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					backup.Basic_ItemLevel = str;
				}
				else if (i == 5)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(용도)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					backup.Basic_Usage = str;
				}
				else if (i == 6)
					backup.Basic_OwnerCompanyName = GetString(strData);
				else if (i == 7)
					backup.Basic_OwnDepartment = GetString(strData);
				else if (i == 8)
					backup.Basic_OperationDepartment = GetString(strData);
				else if (i == 9)
				{
					backup.Basic_OverUsedYear = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용연한 초과여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 10)
					backup.Basic_Memo = GetString(strData);
				else if (i == 11)
					backup.Manage_SuperviseManager = GetString(strData);
				else if (i == 12)
					backup.Manage_OperationManager = GetString(strData);
				else if (i == 13)
					backup.Position_InstallRegion = GetString(strData);
				else if (i == 14)
					backup.Position_RackDetailPosition = GetString(strData);
				else if (i == 15)
					backup.Maintenance_ProvideCompanyName = GetString(strData);
				else if (i == 16)
				{
					backup.Maintenance_WarrantyMonth = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 기간(개월))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 17)
				{
					backup.Maintenance_WarrantyExpiredDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 만료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 18)
					backup.Maintenance_MaintenanceCompanyName = GetString(strData);
				else if (i == 19)
				{
					backup.Maintenance_EOSDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOS 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 20)
				{
					backup.Maintenance_MaintenanceContract = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 계약여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 21)
				{
					backup.Maintenance_MaintenanceBeginDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 시작일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 22)
				{
					backup.Maintenance_MaintenanceEndDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 종료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 23)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(모델명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					backup.HW_ModelName = str;
				}
				else if (i == 24)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(제조사)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					backup.HW_Company = str;
				}
				else if (i == 25)
					backup.HW_SerialNumber = GetString(strData);
				else if (i == 26)
					backup.HW_FirmwareVersion = GetString(strData);
				else if (i == 27)
					backup.HW_DiskType = GetString(strData);
				else if (i == 28)
					backup.HW_Topology = GetString(strData);
				else if (i == 29)
					backup.HW_IP = GetString(strData);
				else if (i == 30)
				{
					backup.HW_RegDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 31)
					backup.HW_DiskDriveType = GetString(strData);
				else if (i == 32)
				{
					backup.HW_DiskTypeVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Disk Type 용량(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 33)
				{
					backup.HW_DiskCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Disk 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 34)
				{
					backup.HW_PhysicalVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(물리적 용량(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 35)
				{
					int? data = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Usable 용량(GB))의 값은 정수만 가능합니다.", GetCellName(i, index));
						return null;
					}

					if (data == null)
					{
						strErrorMessage = string.Format("{0}(Usable 용량(GB))의 값이 비어있습니다.", GetCellName(i, index));
						return null;
					}

					backup.HW_UsableVolumeGB = (int)data;
				}
				else if (i == 36)
					backup.HW_RaidType = GetString(strData);
				else if (i == 37)
				{
					backup.HW_BuyDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(구매일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 38)
				{
					backup.HW_TotalSlotCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(전체 Slot 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 39)
					backup.HW_TapeMediaType = GetString(strData);
				else if (i == 40)
				{
					backup.HW_TapeMediaCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Tape Media 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 41)
					backup.Connect_NWEquip_1 = GetString(strData);
				else if (i == 42)
					backup.Connect_NWEquip_2 = GetString(strData);
				else if (i == 43)
					backup.Connect_NWEquip_3 = GetString(strData);
				else if (i == 44)
					backup.Connect_NWEquip_4 = GetString(strData);
				else if (i == 45)
					backup.Connect_SanSwitch_1 = GetString(strData);
				else if (i == 46)
					backup.Connect_SanSwitch_2 = GetString(strData);
				else if (i == 47)
					backup.Connect_SanSwitch_3 = GetString(strData);
				else if (i == 48)
					backup.Connect_SanSwitch_4 = GetString(strData);
			}

			return backup;
		}
	}
}
