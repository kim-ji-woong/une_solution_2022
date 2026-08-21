using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Excel.Reader
{
	using Models.Request;
	using Writer;

	public class ITPropertyDetailEtcReader : ExcelReader
	{
		private int m_nDataCenterID = -1;

		public ITPropertyDetailEtcReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
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

			List<Etc> etcs = new List<Etc>();
			int dataCount = sheetData.ColumnDatas[0].Count;

			for (int i = 2; i < dataCount; i++)
			{
				Etc etc = ReadEtc(i, columnCount, sheetData.ColumnDatas, ref strErrorMessage);

				if (etc == null)
					return false;
				else
					etcs.Add(etc);
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

			Dictionary<int, ItemType> dicItemTypes = GetEtcItemTypes(ref strErrorMessage);

			if (dicItemTypes == null)
				return false;

			foreach (Etc etc in etcs)
			{
				Item item;

				if (dicItems.TryGetValue(etc.Basic_Name, out item) && dicItemTypes.ContainsKey(item.ItemTypeID))
					etc.EtcID = item.ID;
				else
					etc.EtcID = null;

				etc.DataCenterID = m_nDataCenterID;
			}

			if (DeleteEtcs(m_nDataCenterID, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 기타 IT자산 정보를 삭제하는데 실패하였습니다.";
				return false;
			}

			if (AddEtcs(etcs, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 새로운 기타 IT자산 정보를 입력하는데 실패하였습니다.";
				return false;
			}

			if (m_dataManager.Commit() == false)
			{
				strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
				return false;
			}

			return true;
		}

		private bool AddEtcs(List<Etc> etcs, ref string strErrorMessage)
		{
			foreach (Etc etc in etcs)
			{
				if (m_dataManager.GetCreateManager().CreateEtc(etc, out strErrorMessage) == null)
					return false;
			}

			return true;
		}

		private bool DeleteEtcs(int nDataCenterID, ref string strErrorMessage)
		{
			Dictionary<Etc.Fields, object> dicConditions = new Dictionary<Etc.Fields, object>();
			dicConditions[Etc.Fields.DataCenterID] = nDataCenterID;

			return m_dataManager.GetDeleteManager().DeleteEtc(dicConditions, null, out strErrorMessage);
		}

		private Dictionary<int, ItemType> GetEtcItemTypes(ref string strErrorMessage)
		{
			List<EquipmentType> equipmentTypes = m_dataManager.GetSelectManager().SelectEquipmentTypes(null, null, out strErrorMessage);

			if (equipmentTypes == null)
				return null;

			int nEquipmentTypeID = -1;

			foreach (EquipmentType type in equipmentTypes)
			{
				string strTypeName = type.EngName.ToLower();

				if (strTypeName == "etc")
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

		private Etc ReadEtc(int index, int columnCount, Dictionary<int, List<string>> columnDatas, ref string strErrorMessage)
		{
			bool success;
			Etc etc = new Etc();

			for (int i = 0; i < columnCount; i++)
			{
				List<string> datas = columnDatas[i];
				string strData = datas[index];

				if (i == 0)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(기타장비명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					etc.Basic_Name = str;
				}
				else if (i == 1)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(상태)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					etc.Basic_Status = str;
				}
				else if (i == 2)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(기타장비상세분류)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					etc.Basic_EquipDetailClass = str;
				}
				else if (i == 3)
				{
					etc.Basic_LifeYear = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(사용연한)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 4)
				{
					etc.Basic_OverUsedYear = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(초과여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 5)
				{
					etc.Basic_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(입고일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 6)
				{
					etc.Basic_RegDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 7)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(기타 등급)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					etc.Basic_ItemLevel = str;
				}
				else if (i == 8)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(용도)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					etc.Basic_Usage = str;
				}
				else if (i == 9)
					etc.Basic_OwnerCompanyName = GetString(strData);
				else if (i == 10)
					etc.Basic_OwnDepartment = GetString(strData);
				else if (i == 11)
					etc.Basic_OperationDepartment = GetString(strData);
				else if (i == 12)
					etc.Basic_SiteManager = GetString(strData);
				else if (i == 13)
				{
					etc.Basic_DiscardDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(폐기일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 14)
					etc.Basic_Memo = GetString(strData);
				else if (i == 15)
					etc.Manage_SuperviseManager = GetString(strData);
				else if (i == 16)
					etc.Manage_OperationManager = GetString(strData);
				else if (i == 17)
					etc.Position_InstallRegion = GetString(strData);
				else if (i == 18)
					etc.Position_RackDetailPosition = GetString(strData);
				else if (i == 19)
					etc.Maintenance_ProvideCompanyName = GetString(strData);
				else if (i == 20)
				{
					etc.Maintenance_WarrantyMonth = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 기간(개월))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 21)
				{
					etc.Maintenance_WarrantyExpiredDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Warranty 만료일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 22)
					etc.Maintenance_FinancialDepartment = GetString(strData);
				else if (i == 23)
					etc.Maintenance_MaintenanceCompanyName = GetString(strData);
				else if (i == 24)
				{
					etc.Maintenance_EOSDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOS 일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 25)
				{
					etc.Maintenance_MaintenanceContract = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 계약여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 26)
				{
					etc.Maintenance_MaintenanceBeginDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(유지보수 시작일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 27)
				{
					etc.Maintenance_MaintenanceEndDate = GetDateTime(strData, out success);

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

					etc.HW_ModelName = str;
				}
				else if (i == 29)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(제조사)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					etc.HW_Company = str;
				}
				else if (i == 30)
					etc.HW_SerialNumber = GetString(strData);
				else if (i == 31)
					etc.HW_FirmwareVersion = GetString(strData);
				else if (i == 32)
					etc.HW_MultiLicense = GetString(strData);
				else if (i == 33)
				{
					etc.HW_MicCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(마이크 수량)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 34)
				{
					etc.HW_PAD = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(PAD 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 35)
				{
					etc.HW_Rack = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(거치대 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 36)
					etc.HW_MonitorModelName = GetString(strData);
				else if (i == 37)
					etc.HW_MonitorType = GetString(strData);
				else if (i == 38)
				{
					etc.HW_MonitorScreenSizeInch = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(모니터 화면크기(Inch))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 39)
					etc.HW_ScreenIP = GetString(strData);
				else if (i == 40)
					etc.HW_HostName = GetString(strData);
				else if (i == 41)
				{
					etc.HW_QoS = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(QoS 설정여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 42)
					etc.HW_QosVolume = GetString(strData);
				else if (i == 43)
				{
					etc.HW_PrivateLine = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(전용화상회선 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 44)
					etc.HW_PrivateCompanyBW = GetString(strData);
				else if (i == 45)
					etc.HW_Special = GetString(strData);
				else if (i == 46)
					etc.Connect_NWEquip_1 = GetString(strData);
				else if (i == 47)
					etc.Connect_NWEquip_2 = GetString(strData);
			}

			return etc;
		}
	}
}
