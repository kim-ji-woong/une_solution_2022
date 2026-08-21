using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Excel.Reader
{
	using Models.Request;
	using Writer;

	public class ITPropertyDetailNetworkReader : ExcelReader
	{
		private int m_nDataCenterID = -1;

		public ITPropertyDetailNetworkReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
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

			List<Network> networks = new List<Network>();
			int dataCount = sheetData.ColumnDatas[0].Count;

			for (int i = 2; i < dataCount; i++)
			{
				Network network = ReadNetwork(i, columnCount, sheetData.ColumnDatas, ref strErrorMessage);

				if (network == null)
					return false;
				else
					networks.Add(network);
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

			Dictionary<int, ItemType> dicItemTypes = GetNetworkItemTypes(ref strErrorMessage);

			if (dicItemTypes == null)
				return false;

			foreach (Network network in networks)
			{
				Item item;

				if (dicItems.TryGetValue(network.Basic_Name, out item) && dicItemTypes.ContainsKey(item.ItemTypeID))
					network.NetworkID = item.ID;
				else
					network.NetworkID = null;

				network.DataCenterID = m_nDataCenterID;
			}

			if (DeleteNetworks(m_nDataCenterID, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 네트웍 정보를 삭제하는데 실패하였습니다.";
				return false;
			}

			if (AddNetworks(networks, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 새로운 네트웍 정보를 입력하는데 실패하였습니다.";
				return false;
			}

			if (m_dataManager.Commit() == false)
			{
				strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
				return false;
			}

			return true;
		}

		private bool AddNetworks(List<Network> boxes, ref string strErrorMessage)
		{
			foreach (Network box in boxes)
			{
				if (m_dataManager.GetCreateManager().CreateNetwork(box, out strErrorMessage) == null)
					return false;
			}

			return true;
		}

		private bool DeleteNetworks(int nDataCenterID, ref string strErrorMessage)
		{
			Dictionary<Network.Fields, object> dicConditions = new Dictionary<Network.Fields, object>();
			dicConditions[Network.Fields.DataCenterID] = nDataCenterID;

			return m_dataManager.GetDeleteManager().DeleteNetwork(dicConditions, null, out strErrorMessage);
		}

		private Dictionary<int, ItemType> GetNetworkItemTypes(ref string strErrorMessage)
		{
			List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

			if (equipmentTypes == null)
				return null;

			int nEquipmentTypeID = -1;

			foreach (EquipmentType type in equipmentTypes)
			{
				string strTypeName = type.EngName.ToLower();

				if (strTypeName == "network")
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

		private Network ReadNetwork(int index, int columnCount, Dictionary<int, List<string>> columnDatas, ref string strErrorMessage)
		{
			bool success;
			Network network = new Network();

			for (int i = 0; i < columnCount; i++)
			{
				List<string> datas = columnDatas[i];
				string strData = datas[index];

				if (i == 0)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(네트워크장비명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					network.Basic_Name = str;
				}
				else if (i == 1)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(상태)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					network.Basic_Status = str;
				}
				else if (i == 2)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(네트워크장비상세분류)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					network.Basic_EquipDetailClass = str;
				}
				else if (i == 3)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(네트워크운영등급)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					network.Basic_ItemLevel = str;
				}
				else if (i == 4)
				{
					network.Basic_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(입고일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 5)
				{
					network.Basic_RegDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
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

					network.Basic_Usage = str;
				}
				else if (i == 7)
					network.Basic_OwnerCompanyName = GetString(strData);
				else if (i == 8)
					network.Basic_OwnDepartment = GetString(strData);
				else if (i == 9)
					network.Basic_OperationDepartment = GetString(strData);
				else if (i == 10)
				{
					network.Basic_OverUsedYear = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용연한 초과여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 11)
				{
					network.Basic_Stock = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Stock 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 12)
					network.Basic_Type1 = GetString(strData);
				else if (i == 13)
					network.Basic_Type2 = GetString(strData);
				else if (i == 14)
					network.Basic_Memo = GetString(strData);
				else if (i == 15)
					network.Manage_SuperviseManager = GetString(strData);
				else if (i == 16)
					network.Manage_OperationManager = GetString(strData);
				else if (i == 17)
					network.Position_InstallRegion = GetString(strData);
				else if (i == 18)
					network.Position_RackDetailPosition = GetString(strData);
				else if (i == 19)
					network.Maintenance_ProvideCompanyName = GetString(strData);
				else if (i == 20)
				{
					network.Maintenance_WarrantyMonth = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 기간)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 21)
				{
					network.Maintenance_WarrantyExpiredDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 만료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 22)
					network.Maintenance_MaintenanceCompanyName = GetString(strData);
				else if (i == 23)
				{
					network.Maintenance_EOSDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOS 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 24)
				{
					network.Maintenance_EOLDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOL Date)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 25)
				{
					network.Maintenance_MaintenanceContract = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 계약여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 26)
				{
					network.Maintenance_MaintenanceBeginDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 시작일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 27)
				{
					network.Maintenance_MaintenanceEndDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 종료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 28)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(모델명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					network.HW_ModelName = str;
				}
				else if (i == 29)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(제조사)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					network.HW_Company = str;
				}
				else if (i == 30)
					network.HW_SerialNumber = GetString(strData);
				else if (i == 31)
					network.HW_OSVersion = GetString(strData);
				else if (i == 32)
					network.HW_IP_01 = GetString(strData);
				else if (i == 33)
					network.HW_IP_02 = GetString(strData);
				else if (i == 34)
					network.HW_IP_03 = GetString(strData);
				else if (i == 35)
					network.HW_IP_04 = GetString(strData);
				else if (i == 36)
					network.HW_IP_05 = GetString(strData);
				else if (i == 37)
					network.HW_IP_06 = GetString(strData);
				else if (i == 38)
					network.HW_IP_07 = GetString(strData);
				else if (i == 39)
					network.HW_IP_08 = GetString(strData);
				else if (i == 40)
					network.HW_Rack = GetString(strData);
				else if (i == 41)
				{
					network.HW_PowerDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Power 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 42)
					network.HW_Zone = GetString(strData);
				else if (i == 43)
					network.HW_DetailUsage = GetString(strData);
				else if (i == 44)
				{
					network.HW_NMS = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(NMS 적용여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 45)
					network.HW_NWLineName = GetString(strData);
				else if (i == 46)
					network.Connect_NWEquip_1 = GetString(strData);
				else if (i == 47)
					network.Connect_NWEquip_2 = GetString(strData);
				else if (i == 48)
					network.Connect_NWEquip_3 = GetString(strData);
				else if (i == 49)
					network.Connect_NWEquip_4 = GetString(strData);
			}

			return network;
		}
	}
}
