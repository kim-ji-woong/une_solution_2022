using System;
using System.Collections.Generic;
using VDS.IDAL;
using VDS.Model;
using VDS.Model.ItemData;

namespace VDS.BLL.Excel.Reader
{
	using Models.Request;
	using Writer;

	public class ITPropertyDetailServerReader : ExcelReader
	{
		private int m_nDataCenterID = -1;

		public ITPropertyDetailServerReader(string strFilePath, IDataManager dataManager, int nDataCenterID)
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

			List<ItemServer> servers = new List<ItemServer>();
			int dataCount = sheetData.ColumnDatas[0].Count;

			for (int i = 2; i < dataCount; i++)
			{
				ItemServer server = ReadServer(i, columnCount, sheetData.ColumnDatas, ref strErrorMessage);

				if (server == null)
					return false;
				else
					servers.Add(server);
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

			foreach (ItemServer server in servers)
			{
				Item item;

				if (dicItems.TryGetValue(server.BoxName, out item) && dicItemTypes.ContainsKey(item.ItemTypeID))
					server.BoxID = item.ID;
				else
					server.BoxID = null;

				server.DataCenterID = m_nDataCenterID;
			}

			if (DeleteServers(m_nDataCenterID, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 서버 정보를 삭제하는데 실패하였습니다.";
				return false;
			}

			if (AddServers(servers, ref strErrorMessage) == false)
			{
				strErrorMessage = "시스템 데이터베이스에서 새로운 서버 정보를 입력하는데 실패하였습니다.";
				return false;
			}

			if (m_dataManager.Commit() == false)
			{
				strErrorMessage = "시스템 DB에 편집된 데이터를 저장하는데 실패하였습니다.";
				return false;
			}

			return true;
		}

		private bool AddServers(List<ItemServer> servers, ref string strErrorMessage)
		{
			foreach (ItemServer box in servers)
			{
				if (m_dataManager.GetCreateManager().CreateItemServer(box, out strErrorMessage) == null)
					return false;
			}

			return true;
		}

		private bool DeleteServers(int nDataCenterID, ref string strErrorMessage)
		{
			Dictionary<ItemServer.Fields, object> dicConditions = new Dictionary<ItemServer.Fields, object>();
			dicConditions[ItemServer.Fields.DataCenterID] = nDataCenterID;

			return m_dataManager.GetDeleteManager().DeleteItemServer(dicConditions, null, out strErrorMessage);
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

		private ItemServer ReadServer(int index, int columnCount, Dictionary<int, List<string>> columnDatas, ref string strErrorMessage)
		{
			bool success;
			ItemServer server = new ItemServer();

			for (int i = 0; i < columnCount; i++)
			{
				List<string> datas = columnDatas[i];
				string strData = datas[index];

				if (i == 0)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(서버명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.Basic_ServerName = str;
				}
				else if (i == 1)
					server.Basic_ServerCategory = GetString(strData);
				else if (i == 2)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(관련BOX명)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.BoxName = str;
				}
				else if (i == 3)
					server.Basic_ProductGroup = GetString(strData);
				else if (i == 4)
					server.Basic_WorkSystemName = GetString(strData);
				else if (i == 5)
					server.Basic_SystemName = GetString(strData);
				else if (i == 6)
					server.Basic_ServerType = GetString(strData);
				else if (i == 7)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(운영구분)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.Basic_OperationType = str;
				}
				else if (i == 8)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(서버등급)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.Basic_ServerLevel = str;
				}
				else if (i == 9)
					server.Basic_ServerLevelYear_1 = GetString(strData);
				else if (i == 10)
					server.Basic_ServerLevelYear = GetString(strData);
				else if (i == 11)
				{
					server.Basic_ReceiveDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(입고일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 12)
				{
					server.Basic_RegDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 13)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(상태)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.Basic_Status = str;
				}
				else if (i == 14)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(용도)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.Basic_Usage = str;
				}
				else if (i == 15)
					server.Basic_VirtualType = GetString(strData);
				else if (i == 16)
					server.Basic_DRType = GetString(strData);
				else if (i == 17)
					server.Basic_PropertyType = GetString(strData);
				else if (i == 18)
					server.Manage_SuperviseManager = GetString(strData);
				else if (i == 19)
					server.Manage_OperationManager = GetString(strData);
				else if (i == 20)
					server.Manage_ServiceManager = GetString(strData);
				else if (i == 21)
					server.Position_InstallRegion = GetString(strData);
				else if (i == 22)
					server.Position_Region = GetString(strData);
				else if (i == 23)
					server.Position_RackDetailPosition = GetString(strData);
				else if (i == 24)
					server.Basic_OwnDepartment = GetString(strData);
				else if (i == 25)
					server.Basic_OperationDepartment = GetString(strData);
				else if (i == 26)
					server.Basic_GIMS = GetString(strData);
				else if (i == 27)
					server.HW_OSType = GetString(strData);
				else if (i == 28)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(OS)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.HW_OS = str;
				}
				else if (i == 29)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(OS Version)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.HW_OSVersion = str;
				}
				else if (i == 30)
					server.HW_OSPatchLevel = GetString(strData);
				else if (i == 31)
				{
					server.HW_OSInstallDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(OS 설치일자)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 32)
					server.HW_OSAccountID = GetString(strData);
				else if (i == 33)
				{
					server.HW_KernelBit = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Kernel bit)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 34)
				{
					server.HW_EOS = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOS 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 35)
				{
					server.HW_EOSDate = GetDateTime(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(EOS Date)의 값은 0000-00-00 형태의 날짜 또는 빈문자열만 입력 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 36)
				{
					server.HW_AccountTPAM = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(계정 TPAM 적용 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 37)
				{
					server.HW_LogicalCoreCount = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Logical Core 수)의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 38)
				{
					server.HW_UsableDiskVolumeGB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Usable Disk 용량(GB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 39)
				{
					server.HW_LogicalMemoryVolumeMB = GetInt(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Logical Memory 용량(MB))의 값은 정수 또는 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 40)
					server.HW_NetworkSpeed = GetString(strData);
				else if (i == 41)
				{
					server.HW_ServerDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(서버 이중화여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 42)
					server.Dual_DualType = GetString(strData);
				else if (i == 43)
					server.Dual_DualSolutionVM = GetString(strData);
				else if (i == 44)
					server.Dual_DualSolutionService = GetString(strData);
				else if (i == 45)
					server.Dual_DualServerVM = GetString(strData);
				else if (i == 46)
					server.SW_AccountManage = GetString(strData);
				else if (i == 47)
					server.SW_ServerAccessInstall = GetString(strData);
				else if (i == 48)
				{
					server.SW_DCA = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(DCA 적용여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 49)
				{
					server.SW_VaccineInstall = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(백신설치 유무)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 50)
					server.SW_InstallVaccineName = GetString(strData);
				else if (i == 51)
					server.SW_InstallSWName = GetString(strData);
				else if (i == 52)
					server.NW_Zone = GetString(strData);
				else if (i == 53)
					server.NW_ServiceIPAddr = GetString(strData);
				else if (i == 54)
				{
					server.NW_ServiceIPDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(서비스 IP 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 55)
					server.NW_HeartBeatIPAddr = GetString(strData);
				else if (i == 56)
				{
					server.NW_HeartBeatIPDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Heart Beat IP 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 57)
					server.NW_BackupIPAddr = GetString(strData);
				else if (i == 58)
				{
					server.NW_BackIPDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(백업 IP 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 59)
				{
					string str = GetString(strData);

					if (str == null || str.Length == 0)
					{
						strErrorMessage = string.Format("{0}(관리용 IP Address)의 값이 비어있거나 잘못된 데이터가 들어있습니다.", GetCellName(i, index));
						return null;
					}

					server.NW_ManageIPAddr = str;
				}
				else if (i == 60)
				{
					server.NW_ManageIPDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(관리용 IP 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 61)
					server.NW_Etc1IPAddr = GetString(strData);
				else if (i == 62)
				{
					server.NW_Etc1IPAddrDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(기타1 IP 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 63)
					server.NW_Etc2IPAddr = GetString(strData);
				else if (i == 64)
				{
					server.NW_Etc2IPDual = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(기타2 IP 이중화 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 65)
				{
					server.Backup_InternalOSBackup = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(Internal OS 백업 유무)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 66)
					server.Backup_InternalOSBackupSW = GetString(strData);
				else if (i == 67)
				{
					server.Backup_ExternalBackupRun = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(External 백업 수행 유무)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 68)
					server.Backup_ExternalBackupSWType = GetString(strData);
				else if (i == 69)
				{
					server.Backup_ExternalRemote = GetBoolean(strData, out success);

					if (success == false)
					{
						strErrorMessage = string.Format("{0}(External 원격 소산 여부)의 값은 TRUE / FALSE / 빈문자열만 가능합니다.", GetCellName(i, index));
						return null;
					}
				}
				else if (i == 70)
					server.Backup_ExternalRemotePosition = GetString(strData);
			}

			return server;
		}
	}
}
