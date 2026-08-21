using System;

namespace VDS.Model.ItemData
{
	public class Box
	{
		public enum Fields { BoxID, Basic_Name, Basic_Company, Basic_ModelName, Basic_Status, Basic_Usage, Basic_RegDate, Basic_ItemLevel, Basic_EquipType, Basic_SerialNumber, Basic_PropertyType, Basic_ReceiveDate, Basic_OwnDepartment, Basic_PartitionAble, Basic_PartitionName, Basic_ReceiveYears, Basic_OperationDepartment, Basic_DiscardDate, Basic_OverUsedYear, Manage_SuperviseManager, Manage_OperationManager, Position_InstallRegion, Position_RackDetailPosition, Maintenance_WarrantyMonth, Maintenance_WarrantyExpiredDate, Maintenance_EOLDate, Maintenance_EOSLDate, Maintenance_EOSL, Maintenance_MaintenanceContract, Maintenance_MaintenanceCompanyName, Maintenance_MaintenanceBeginDate, Maintenance_MaintenanceEndDate, Maintenance_ProvideCompanyName, HW_BoxPartitionType, HW_PowerDual, HW_ConsoleUse, CPU_ModelName, CPU_ClockSpeed, CPU_SocketCount, CPU_CoreCountPerCPU, CPU_TotalSlotCount, CPU_UseSlotCount, CPU_HTUse, CPU_TotalCoreCount, Mem_TotalSlotCount, Mem_EA_1GB, Mem_EA_2GB, Mem_EA_4GB, Mem_EA_8GB, Mem_EA_16GB, Mem_EA_32GB, Mem_EA_64GB, Mem_EA_128GB, Mem_EA_256GB, Mem_UseSlotCount, Mem_MemoryCount, Mem_TotalMemoryVolume, Internal_InternalDiskVolumeGB, Internal_InternalDiskCount, Internal_InternalDiskUsableVolumeGB, Internal_InternalDiskTotalSlotCount, Internal_InternalDiskUseSlot, Internal_InternalDiskRaidType, Internal_InternalDiskSizeGB, External_ExternalDiskCompanyName, External_ExternalDiskModel, External_ExternalDiskRaidType, External_ExternalDiskSizeGB, External_ExternalDiskMultiPathSolution, PS_PowerSupplyCount, PS_PowerSupplyVolumeW, PS_PowerSupplyPduDual, PS_PowerSupplyRackPowerDual, Fan_FanCount, Fan_FanDual, Nic_NicSpeed, Nic_NicType, Nic_NicPort, Nic_NicCount, Nic_NicUsePortCount, Nic_OnboardNicPortCount, Nic_OnboardNicUsePortCount, Nic_HBASpeed, Nic_HBAType, Nic_HBAPort, Nic_HBACount, Nic_UsingHBAPortCount, NW_ManageIPAddr, NW_IPAddr2, NW_IPAddr3, NW_IPAddr4, Connect_SanSwitch1, Connect_SanSwitch2, Connect_SanSwitch3, Connect_NWEquip1, Connect_NWEquip2, Connect_NWEquip3, Connect_NWEquip4, Connect_NWEquip5, Connect_NWEquip6, Connect_NWEquip7, Connect_NWEquip8, Connect_Storage1, Connect_Storage2, Connect_Backup1, Connect_Backup2, Connect_Backup3, Connect_Backup4, DataCenterID };

		public int? BoxID { get; set; }
		public string Basic_Name { get; set; }
		public string Basic_Company { get; set; }
		public string Basic_ModelName { get; set; }
		public string Basic_Status { get; set; }
		public string Basic_Usage { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_ItemLevel { get; set; }
		public string Basic_EquipType { get; set; }
		public string Basic_SerialNumber { get; set; }
		public string Basic_PropertyType { get; set; }
		public DateTime? Basic_ReceiveDate { get; set; }
		public string Basic_OwnDepartment { get; set; }
		public bool? Basic_PartitionAble { get; set; }
		public string Basic_PartitionName { get; set; }
		public int? Basic_ReceiveYears { get; set; }
		public string Basic_OperationDepartment { get; set; }
		public DateTime? Basic_DiscardDate { get; set; }
		public bool? Basic_OverUsedYear { get; set; }
		public string Manage_SuperviseManager { get; set; }
		public string Manage_OperationManager { get; set; }
		public string Position_InstallRegion { get; set; }
		public string Position_RackDetailPosition { get; set; }
		public int? Maintenance_WarrantyMonth { get; set; }
		public DateTime? Maintenance_WarrantyExpiredDate { get; set; }
		public DateTime? Maintenance_EOLDate { get; set; }
		public DateTime? Maintenance_EOSLDate { get; set; }
		public bool? Maintenance_EOSL { get; set; }
		public bool? Maintenance_MaintenanceContract { get; set; }
		public string Maintenance_MaintenanceCompanyName { get; set; }
		public DateTime? Maintenance_MaintenanceBeginDate { get; set; }
		public DateTime? Maintenance_MaintenanceEndDate { get; set; }
		public string Maintenance_ProvideCompanyName { get; set; }
		public string HW_BoxPartitionType { get; set; }
		public bool? HW_PowerDual { get; set; }
		public bool? HW_ConsoleUse { get; set; }
		public string CPU_ModelName { get; set; }
		public string CPU_ClockSpeed { get; set; }
		public int? CPU_SocketCount { get; set; }
		public int? CPU_CoreCountPerCPU { get; set; }
		public int? CPU_TotalSlotCount { get; set; }
		public int? CPU_UseSlotCount { get; set; }
		public bool? CPU_HTUse { get; set; }
		public int CPU_TotalCoreCount { get; set; }
		public int? Mem_TotalSlotCount { get; set; }
		public int? Mem_EA_1GB { get; set; }
		public int? Mem_EA_2GB { get; set; }
		public int? Mem_EA_4GB { get; set; }
		public int? Mem_EA_8GB { get; set; }
		public int? Mem_EA_16GB { get; set; }
		public int? Mem_EA_32GB { get; set; }
		public int? Mem_EA_64GB { get; set; }
		public int? Mem_EA_128GB { get; set; }
		public int? Mem_EA_256GB { get; set; }
		public int? Mem_UseSlotCount { get; set; }
		public int? Mem_MemoryCount { get; set; }
		public int Mem_TotalMemoryVolume { get; set; }
		public int? Internal_InternalDiskVolumeGB { get; set; }
		public int? Internal_InternalDiskCount { get; set; }
		public int? Internal_InternalDiskUsableVolumeGB { get; set; }
		public int? Internal_InternalDiskTotalSlotCount { get; set; }
		public string Internal_InternalDiskUseSlot { get; set; }
		public string Internal_InternalDiskRaidType { get; set; }
		public int? Internal_InternalDiskSizeGB { get; set; }
		public string External_ExternalDiskCompanyName { get; set; }
		public string External_ExternalDiskModel { get; set; }
		public string External_ExternalDiskRaidType { get; set; }
		public int? External_ExternalDiskSizeGB { get; set; }
		public string External_ExternalDiskMultiPathSolution { get; set; }
		public int? PS_PowerSupplyCount { get; set; }
		public string PS_PowerSupplyVolumeW { get; set; }
		public bool? PS_PowerSupplyPduDual { get; set; }
		public bool? PS_PowerSupplyRackPowerDual { get; set; }
		public int? Fan_FanCount { get; set; }
		public bool? Fan_FanDual { get; set; }
		public string Nic_NicSpeed { get; set; }
		public string Nic_NicType { get; set; }
		public string Nic_NicPort { get; set; }
		public int? Nic_NicCount { get; set; }
		public int? Nic_NicUsePortCount { get; set; }
		public int? Nic_OnboardNicPortCount { get; set; }
		public int? Nic_OnboardNicUsePortCount { get; set; }
		public string Nic_HBASpeed { get; set; }
		public string Nic_HBAType { get; set; }
		public string Nic_HBAPort { get; set; }
		public int? Nic_HBACount { get; set; }
		public int? Nic_UsingHBAPortCount { get; set; }
		public string NW_ManageIPAddr { get; set; }
		public string NW_IPAddr2 { get; set; }
		public string NW_IPAddr3 { get; set; }
		public string NW_IPAddr4 { get; set; }
		public string Connect_SanSwitch1 { get; set; }
		public string Connect_SanSwitch2 { get; set; }
		public string Connect_SanSwitch3 { get; set; }
		public string Connect_NWEquip1 { get; set; }
		public string Connect_NWEquip2 { get; set; }
		public string Connect_NWEquip3 { get; set; }
		public string Connect_NWEquip4 { get; set; }
		public string Connect_NWEquip5 { get; set; }
		public string Connect_NWEquip6 { get; set; }
		public string Connect_NWEquip7 { get; set; }
		public string Connect_NWEquip8 { get; set; }
		public string Connect_Storage1 { get; set; }
		public string Connect_Storage2 { get; set; }
		public string Connect_Backup1 { get; set; }
		public string Connect_Backup2 { get; set; }
		public string Connect_Backup3 { get; set; }
		public string Connect_Backup4 { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "ItemData_Box"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.BoxID ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_EquipType ||
				field == Fields.Basic_SerialNumber ||
				field == Fields.Basic_PropertyType ||
				field == Fields.Basic_ReceiveDate ||
				field == Fields.Basic_OwnDepartment ||
				field == Fields.Basic_PartitionAble ||
				field == Fields.Basic_PartitionName ||
				field == Fields.Basic_ReceiveYears ||
				field == Fields.Basic_OperationDepartment ||
				field == Fields.Basic_DiscardDate ||
				field == Fields.Basic_OverUsedYear ||
				field == Fields.Manage_SuperviseManager ||
				field == Fields.Manage_OperationManager ||
				field == Fields.Position_InstallRegion ||
				field == Fields.Position_RackDetailPosition ||
				field == Fields.Maintenance_WarrantyMonth ||
				field == Fields.Maintenance_WarrantyExpiredDate ||
				field == Fields.Maintenance_EOLDate ||
				field == Fields.Maintenance_EOSLDate ||
				field == Fields.Maintenance_EOSL ||
				field == Fields.Maintenance_MaintenanceContract ||
				field == Fields.Maintenance_MaintenanceCompanyName ||
				field == Fields.Maintenance_MaintenanceBeginDate ||
				field == Fields.Maintenance_MaintenanceEndDate ||
				field == Fields.Maintenance_ProvideCompanyName ||
				field == Fields.HW_BoxPartitionType ||
				field == Fields.HW_PowerDual ||
				field == Fields.HW_ConsoleUse ||
				field == Fields.CPU_SocketCount ||
				field == Fields.CPU_CoreCountPerCPU ||
				field == Fields.CPU_TotalSlotCount ||
				field == Fields.CPU_UseSlotCount ||
				field == Fields.CPU_HTUse ||
				field == Fields.Mem_TotalSlotCount ||
				field == Fields.Mem_EA_1GB ||
				field == Fields.Mem_EA_2GB ||
				field == Fields.Mem_EA_4GB ||
				field == Fields.Mem_EA_8GB ||
				field == Fields.Mem_EA_16GB ||
				field == Fields.Mem_EA_32GB ||
				field == Fields.Mem_EA_64GB ||
				field == Fields.Mem_EA_128GB ||
				field == Fields.Mem_EA_256GB ||
				field == Fields.Mem_UseSlotCount ||
				field == Fields.Mem_MemoryCount ||
				field == Fields.Internal_InternalDiskVolumeGB ||
				field == Fields.Internal_InternalDiskCount ||
				field == Fields.Internal_InternalDiskUsableVolumeGB ||
				field == Fields.Internal_InternalDiskTotalSlotCount ||
				field == Fields.Internal_InternalDiskUseSlot ||
				field == Fields.Internal_InternalDiskRaidType ||
				field == Fields.Internal_InternalDiskSizeGB ||
				field == Fields.External_ExternalDiskCompanyName ||
				field == Fields.External_ExternalDiskModel ||
				field == Fields.External_ExternalDiskRaidType ||
				field == Fields.External_ExternalDiskSizeGB ||
				field == Fields.External_ExternalDiskMultiPathSolution ||
				field == Fields.PS_PowerSupplyCount ||
				field == Fields.PS_PowerSupplyVolumeW ||
				field == Fields.PS_PowerSupplyPduDual ||
				field == Fields.PS_PowerSupplyRackPowerDual ||
				field == Fields.Fan_FanCount ||
				field == Fields.Fan_FanDual ||
				field == Fields.Nic_NicSpeed ||
				field == Fields.Nic_NicType ||
				field == Fields.Nic_NicPort ||
				field == Fields.Nic_NicCount ||
				field == Fields.Nic_NicUsePortCount ||
				field == Fields.Nic_OnboardNicPortCount ||
				field == Fields.Nic_OnboardNicUsePortCount ||
				field == Fields.Nic_HBASpeed ||
				field == Fields.Nic_HBAType ||
				field == Fields.Nic_HBAPort ||
				field == Fields.Nic_HBACount ||
				field == Fields.Nic_UsingHBAPortCount ||
				field == Fields.NW_ManageIPAddr ||
				field == Fields.NW_IPAddr2 ||
				field == Fields.NW_IPAddr3 ||
				field == Fields.NW_IPAddr4 ||
				field == Fields.Connect_SanSwitch1 ||
				field == Fields.Connect_SanSwitch2 ||
				field == Fields.Connect_SanSwitch3 ||
				field == Fields.Connect_NWEquip1 ||
				field == Fields.Connect_NWEquip2 ||
				field == Fields.Connect_NWEquip3 ||
				field == Fields.Connect_NWEquip4 ||
				field == Fields.Connect_NWEquip5 ||
				field == Fields.Connect_NWEquip6 ||
				field == Fields.Connect_NWEquip7 ||
				field == Fields.Connect_NWEquip8 ||
				field == Fields.Connect_Storage1 ||
				field == Fields.Connect_Storage2 ||
				field == Fields.Connect_Backup1 ||
				field == Fields.Connect_Backup2 ||
				field == Fields.Connect_Backup3 ||
				field == Fields.Connect_Backup4)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
