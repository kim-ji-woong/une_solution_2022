using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Excel.Reader
{
	using Models.Request;
	using Writer;

	public class ITPropertyDetailSanSwitchReader : ExcelReader
	{
		private int m_nDataCenterID = -1;

		public ITPropertyDetailSanSwitchReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
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

			List<SanSwitch> sanSwitchs = new List<SanSwitch>();
			int dataCount = sheetData.ColumnDatas[0].Count;

			for (int i = 2; i < dataCount; i++)
			{
				SanSwitch sanSwitch = ReadSanSwitch(i, columnCount, sheetData.ColumnDatas, ref strErrorMessage);

				if (sanSwitch == null)
					return false;
				else
					sanSwitchs.Add(sanSwitch);
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

			Dictionary<int, ItemType> dicItemTypes = GetSanSwitchItemTypes(ref strErrorMessage);

			if (dicItemTypes == null)
				return false;

			foreach (SanSwitch sanSwitch in sanSwitchs)
			{
				Item item;

				if (dicItems.TryGetValue(sanSwitch.Basic_Name, out item) && dicItemTypes.ContainsKey(item.ItemTypeID))
					sanSwitch.SwitchID = item.ID;
				else
					sanSwitch.SwitchID = null;

				sanSwitch.DataCenterID = m_nDataCenterID;
			}

			if (DeleteSanSwitchs(m_nDataCenterID, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 SAN 스위치 정보를 삭제하는데 실패하였습니다.";
				return false;
			}

			if (AddSanSwitchs(sanSwitchs, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 새로운 SAN 스위치 정보를 입력하는데 실패하였습니다.";
				return false;
			}

			if (m_dataManager.Commit() == false)
			{
				strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
				return false;
			}

			return true;
		}

		private bool AddSanSwitchs(List<SanSwitch> switches, ref string strErrorMessage)
		{
			foreach (SanSwitch _switch in switches)
			{
				if (m_dataManager.GetCreateManager().CreateSanSwitch(_switch, out strErrorMessage) == null)
					return false;
			}

			return true;
		}

		private bool DeleteSanSwitchs(int nDataCenterID, ref string strErrorMessage)
		{
			Dictionary<SanSwitch.Fields, object> dicConditions = new Dictionary<SanSwitch.Fields, object>();
			dicConditions[SanSwitch.Fields.DataCenterID] = nDataCenterID;

			return m_dataManager.GetDeleteManager().DeleteSanSwitch(dicConditions, null, out strErrorMessage);
		}

		private Dictionary<int, ItemType> GetSanSwitchItemTypes(ref string strErrorMessage)
		{
			List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

			if (equipmentTypes == null)
				return null;

			int nEquipmentTypeID = -1;

			foreach (EquipmentType type in equipmentTypes)
			{
				string strTypeName = type.EngName.ToLower();

				if (strTypeName == "san switch")
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

		private SanSwitch ReadSanSwitch(int index, int columnCount, Dictionary<int, List<string>> columnDatas, ref string strErrorMessage)
		{
			bool success;
			SanSwitch sanSwitch = new SanSwitch();

			for (int i = 0; i < columnCount; i++)
			{
				List<string> datas = columnDatas[i];
				string strData = datas[index];

				if (i == 0)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(SAN 스위치명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					sanSwitch.Basic_Name = str;
				}
				else if (i == 1)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(상태)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					sanSwitch.Basic_Status = str;
				}
				else if (i == 2)
				{
					sanSwitch.Basic_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(입고일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 3)
				{
					sanSwitch.Basic_RegDate = GetDateTime(strData, out success);

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
						strErrorMessage = string.Format("{0}(SAN 스위치 등급)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					sanSwitch.Basic_ItemLevel = str;
				}
				else if (i == 5)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(용도)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					sanSwitch.Basic_Usage = str;
				}
				else if (i == 6)
					sanSwitch.Basic_OwnerCompanyName = GetString(strData);
				else if (i == 7)
					sanSwitch.Basic_OwnDepartment = GetString(strData);
				else if (i == 8)
					sanSwitch.Basic_OperationDepartment = GetString(strData);
				else if (i == 9)
					sanSwitch.Basic_Memo = GetString(strData);
				else if (i == 10)
					sanSwitch.Manage_SuperviseManager = GetString(strData);
				else if (i == 11)
					sanSwitch.Manage_OperationManager = GetString(strData);
				else if (i == 12)
					sanSwitch.Position_InstallRegion = GetString(strData);
				else if (i == 13)
					sanSwitch.Position_RackDetailPosition = GetString(strData);
				else if (i == 14)
					sanSwitch.Maintenance_ProvideCompanyName = GetString(strData);
				else if (i == 15)
				{
					sanSwitch.Maintenance_WarrantyMonth = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 기간)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 16)
				{
					sanSwitch.Maintenance_WarrantyExpiredDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 만료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 17)
					sanSwitch.Maintenance_MaintenanceCompanyName = GetString(strData);
				else if (i == 18)
				{
					sanSwitch.Maintenance_EOSDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOS 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 19)
				{
					sanSwitch.Maintenance_MaintenanceContract = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 계약여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 20)
				{
					sanSwitch.Maintenance_MaintenanceBeginDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 시작일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 21)
				{
					sanSwitch.Maintenance_MaintenanceEndDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 종료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 22)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(모델명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					sanSwitch.HW_ModelName = str;
				}
				else if (i == 23)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(제조사)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					sanSwitch.HW_Company = str;
				}
				else if (i == 24)
					sanSwitch.HW_SerialNumber = GetString(strData);
				else if (i == 25)
					sanSwitch.HW_FirmwareVersion = GetString(strData);
				else if (i == 26)
				{
					sanSwitch.HW_Dual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(이중화여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 27)
					sanSwitch.HW_DualSanSwitchName = GetString(strData);
				else if (i == 28)
					sanSwitch.HW_InterfaceType = GetString(strData);
				else if (i == 29)
					sanSwitch.HW_Interface = GetString(strData);
				else if (i == 30)
				{
					int? data = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(FC 포트 개수)의 값은 정수만 가능합니다.", GetCellName(i, index));
						return null;
					}

					if (data == null)
					{
						strErrorMessage = string.Format("{0}(FC 포트 개수)의 값이 비어있습니다.", GetCellName(i, index));
						return null;
					}

					sanSwitch.HW_FCPortCount = (int)data;
				}
				else if (i == 31)
				{
					int? data = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(FC 포트 사용개수(최대포트수))의 값은 정수만 가능합니다.", GetCellName(i, index));
						return null;
					}

					if (data == null)
					{
						strErrorMessage = string.Format("{0}(FC 포트 사용개수)의 값이 비어있습니다.", GetCellName(i, index));
						return null;

					}

					sanSwitch.HW_FCPortUseCount = (int)data;
				}
				else if (i == 32)
				{
					sanSwitch.HW_FCPortFree = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(FC Port 여유)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 33)
				{
					sanSwitch.HW_GBICPortCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(GBIC 포트개수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 34)
					sanSwitch.HW_DualBoxSerial = GetString(strData);
				else if (i == 35)
					sanSwitch.HW_SecurityType = GetString(strData);
				else if (i == 36)
				{
					sanSwitch.HW_FanCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(FAN 개수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 37)
				{
					sanSwitch.HW_FanDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Fan 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 38)
				{
					sanSwitch.HW_PowerSupplyDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Power Supply 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 39)
				{
					sanSwitch.HW_ConnectPDUDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(연결 PDU 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 40)
				{
					sanSwitch.Dual_RackPowerDualUse = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Rack 전원 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
			}

			return sanSwitch;
		}
	}
}
