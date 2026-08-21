using System;

namespace VDS.Model.ItemData
{
	public class Storage
	{
		public enum Fields { StorageID, Basic_Name, Basic_Status, Basic_RegDate, Basic_Usage, Basic_ItemLevel, Basic_ReceiveDate, Basic_ReceiveYears, Basic_OwnerCompanyName, Basic_OwnDepartment, Basic_OperationDepartment, Basic_SiteManager, Basic_DiscardDate, Basic_OverUsedYear, Basic_Memo, Manage_SuperviseManager, Manage_OperationManager, Position_InstallRegion, Position_RackDetailPosition, Maintenance_ProvideCompanyName, Maintenance_WarrantyMonth, Maintenance_WarrantyExpiredDate, Maintenance_MaintenanceCompanyName, Maintenance_EOSDate, Maintenance_EOLDate, Maintenance_EOSL, Maintenance_EOSLDate, Maintenance_MaintenanceContract, Maintenance_MaintenanceBeginDate, Maintenance_MaintenanceEndDate, HW_ModelName, HW_Company, HW_CacheMemory, HW_SerialNumber, HW_DiskType, HW_ControllerFirmwareVersion, HW_TotalPhysicalVolume, HW_TotalUsableVolume, HW_LogicalVolumeGB, HW_FreeVolumeGB, HW_MultiPath, HW_MultiPathPropertyName, HW_AvailableVolume, HW_GivenVolumeGB, HW_GivenRate, Dual_DualUse, Dual_DualType, Dual_BoxDualUse, Dual_BoxDualDiskEquipmentName, Dual_BoxDualSolutionName, Dual_ControllerDualUse, Dual_PowerDualUse, Dual_PDUDualUse, Dual_RackPowerDualUse, Dual_InternalCopySWUse, Dual_StorageCopyUse, Dual_StorageCopyType, Volume_RegDate, Volume_DiskType, Volume_EachDiskVolume, Volume_DiskCount, Volume_PhysicalVolume, Volume_UsableVolume, Volume_RaidSystem, Extra_DiskType, Extra_DiskVolume, Extra_DiskCount, IP_IPType, IP_IPAddress, IP_NetworkSpeed, Port_TotalPortCount, Port_UsePortCount, Port_LinkedSanSwitch, Port_ReceiveDate, Port_Count, Connect_ServerName, Connect_Usage, Connect_ServiceLevel, Connect_ModelName, Connect_OS, Connect_Cable, Connect_GivenVolume, Connect_RealUseVolume, Connect_EtcVolume, Connect_FreeVolume, Connect_MonthlyIncrease, Connect_ConnectType, Connect_ChannelPathCount, Connect_PathDualSolution, Connect_NWEquip_1, Connect_NWEquip_2, Connect_NWEquip_3, Connect_NWEquip_4, Connect_SanSwitch_1, Connect_SanSwitch_2, Connect_SanSwitch_3, Connect_SanSwitch_4, Connect_SanSwitch_5, Connect_SanSwitch_6, Connect_SanSwitch_7, Connect_SanSwitch_8, DataCenterID };

		public int? StorageID { get; set; }
		public string Basic_Name { get; set; }
		public string Basic_Status { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_Usage { get; set; }
		public string Basic_ItemLevel { get; set; }
		public DateTime? Basic_ReceiveDate { get; set; }
		public int? Basic_ReceiveYears { get; set; }
		public string Basic_OwnerCompanyName { get; set; }
		public string Basic_OwnDepartment { get; set; }
		public string Basic_OperationDepartment { get; set; }
		public string Basic_SiteManager { get; set; }
		public DateTime? Basic_DiscardDate { get; set; }
		public bool? Basic_OverUsedYear { get; set; }
		public string Basic_Memo { get; set; }
		public string Manage_SuperviseManager { get; set; }
		public string Manage_OperationManager { get; set; }
		public string Position_InstallRegion { get; set; }
		public string Position_RackDetailPosition { get; set; }
		public string Maintenance_ProvideCompanyName { get; set; }
		public int? Maintenance_WarrantyMonth { get; set; }
		public DateTime? Maintenance_WarrantyExpiredDate { get; set; }
		public string Maintenance_MaintenanceCompanyName { get; set; }
		public DateTime? Maintenance_EOSDate { get; set; }
		public DateTime? Maintenance_EOLDate { get; set; }
		public bool? Maintenance_EOSL { get; set; }
		public DateTime? Maintenance_EOSLDate { get; set; }
		public bool? Maintenance_MaintenanceContract { get; set; }
		public DateTime? Maintenance_MaintenanceBeginDate { get; set; }
		public DateTime? Maintenance_MaintenanceEndDate { get; set; }
		public string HW_ModelName { get; set; }
		public string HW_Company { get; set; }
		public int? HW_CacheMemory { get; set; }
		public string HW_SerialNumber { get; set; }
		public string HW_DiskType { get; set; }
		public string HW_ControllerFirmwareVersion { get; set; }
		public int? HW_TotalPhysicalVolume { get; set; }
		public int HW_TotalUsableVolume { get; set; }
		public int? HW_LogicalVolumeGB { get; set; }
		public int? HW_FreeVolumeGB { get; set; }
		public bool? HW_MultiPath { get; set; }
		public string HW_MultiPathPropertyName { get; set; }
		public int? HW_AvailableVolume { get; set; }
		public int? HW_GivenVolumeGB { get; set; }
		public double? HW_GivenRate { get; set; }
		public bool? Dual_DualUse { get; set; }
		public string Dual_DualType { get; set; }
		public bool? Dual_BoxDualUse { get; set; }
		public string Dual_BoxDualDiskEquipmentName { get; set; }
		public string Dual_BoxDualSolutionName { get; set; }
		public bool? Dual_ControllerDualUse { get; set; }
		public bool? Dual_PowerDualUse { get; set; }
		public bool? Dual_PDUDualUse { get; set; }
		public bool? Dual_RackPowerDualUse { get; set; }
		public bool? Dual_InternalCopySWUse { get; set; }
		public bool? Dual_StorageCopyUse { get; set; }
		public string Dual_StorageCopyType { get; set; }
		public DateTime? Volume_RegDate { get; set; }
		public string Volume_DiskType { get; set; }
		public int? Volume_EachDiskVolume { get; set; }
		public int? Volume_DiskCount { get; set; }
		public int? Volume_PhysicalVolume { get; set; }
		public int? Volume_UsableVolume { get; set; }
		public string Volume_RaidSystem { get; set; }
		public string Extra_DiskType { get; set; }
		public int? Extra_DiskVolume { get; set; }
		public int? Extra_DiskCount { get; set; }
		public string IP_IPType { get; set; }
		public string IP_IPAddress { get; set; }
		public string IP_NetworkSpeed { get; set; }
		public int? Port_TotalPortCount { get; set; }
		public int? Port_UsePortCount { get; set; }
		public string Port_LinkedSanSwitch { get; set; }
		public DateTime? Port_ReceiveDate { get; set; }
		public int? Port_Count { get; set; }
		public string Connect_ServerName { get; set; }
		public string Connect_Usage { get; set; }
		public string Connect_ServiceLevel { get; set; }
		public string Connect_ModelName { get; set; }
		public string Connect_OS { get; set; }
		public string Connect_Cable { get; set; }
		public double? Connect_GivenVolume { get; set; }
		public int? Connect_RealUseVolume { get; set; }
		public int? Connect_EtcVolume { get; set; }
		public int? Connect_FreeVolume { get; set; }
		public int? Connect_MonthlyIncrease { get; set; }
		public string Connect_ConnectType { get; set; }
		public int? Connect_ChannelPathCount { get; set; }
		public string Connect_PathDualSolution { get; set; }
		public string Connect_NWEquip_1 { get; set; }
		public string Connect_NWEquip_2 { get; set; }
		public string Connect_NWEquip_3 { get; set; }
		public string Connect_NWEquip_4 { get; set; }
		public string Connect_SanSwitch_1 { get; set; }
		public string Connect_SanSwitch_2 { get; set; }
		public string Connect_SanSwitch_3 { get; set; }
		public string Connect_SanSwitch_4 { get; set; }
		public string Connect_SanSwitch_5 { get; set; }
		public string Connect_SanSwitch_6 { get; set; }
		public string Connect_SanSwitch_7 { get; set; }
		public string Connect_SanSwitch_8 { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "ItemData_Storage"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.StorageID ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_ReceiveDate ||
				field == Fields.Basic_ReceiveYears ||
				field == Fields.Basic_OwnerCompanyName ||
				field == Fields.Basic_OwnDepartment ||
				field == Fields.Basic_OperationDepartment ||
				field == Fields.Basic_SiteManager ||
				field == Fields.Basic_DiscardDate ||
				field == Fields.Basic_OverUsedYear ||
				field == Fields.Basic_Memo ||
				field == Fields.Manage_SuperviseManager ||
				field == Fields.Manage_OperationManager ||
				field == Fields.Position_InstallRegion ||
				field == Fields.Position_RackDetailPosition ||
				field == Fields.Maintenance_ProvideCompanyName ||
				field == Fields.Maintenance_WarrantyMonth ||
				field == Fields.Maintenance_WarrantyExpiredDate ||
				field == Fields.Maintenance_MaintenanceCompanyName ||
				field == Fields.Maintenance_EOSDate ||
				field == Fields.Maintenance_EOLDate ||
				field == Fields.Maintenance_EOSL ||
				field == Fields.Maintenance_EOSLDate ||
				field == Fields.Maintenance_MaintenanceContract ||
				field == Fields.Maintenance_MaintenanceBeginDate ||
				field == Fields.Maintenance_MaintenanceEndDate ||
				field == Fields.HW_CacheMemory ||
				field == Fields.HW_SerialNumber ||
				field == Fields.HW_ControllerFirmwareVersion ||
				field == Fields.HW_TotalPhysicalVolume ||
				field == Fields.HW_LogicalVolumeGB ||
				field == Fields.HW_FreeVolumeGB ||
				field == Fields.HW_MultiPath ||
				field == Fields.HW_MultiPathPropertyName ||
				field == Fields.HW_AvailableVolume ||
				field == Fields.HW_GivenVolumeGB ||
				field == Fields.HW_GivenRate ||
				field == Fields.Dual_DualUse ||
				field == Fields.Dual_DualType ||
				field == Fields.Dual_BoxDualUse ||
				field == Fields.Dual_BoxDualDiskEquipmentName ||
				field == Fields.Dual_BoxDualSolutionName ||
				field == Fields.Dual_ControllerDualUse ||
				field == Fields.Dual_PowerDualUse ||
				field == Fields.Dual_PDUDualUse ||
				field == Fields.Dual_RackPowerDualUse ||
				field == Fields.Dual_InternalCopySWUse ||
				field == Fields.Dual_StorageCopyUse ||
				field == Fields.Dual_StorageCopyType ||
				field == Fields.Volume_RegDate ||
				field == Fields.Volume_DiskType ||
				field == Fields.Volume_EachDiskVolume ||
				field == Fields.Volume_DiskCount ||
				field == Fields.Volume_PhysicalVolume ||
				field == Fields.Volume_UsableVolume ||
				field == Fields.Volume_RaidSystem ||
				field == Fields.Extra_DiskType ||
				field == Fields.Extra_DiskVolume ||
				field == Fields.Extra_DiskCount ||
				field == Fields.IP_IPType ||
				field == Fields.IP_IPAddress ||
				field == Fields.IP_NetworkSpeed ||
				field == Fields.Port_TotalPortCount ||
				field == Fields.Port_UsePortCount ||
				field == Fields.Port_LinkedSanSwitch ||
				field == Fields.Port_ReceiveDate ||
				field == Fields.Port_Count ||
				field == Fields.Connect_ServerName ||
				field == Fields.Connect_Usage ||
				field == Fields.Connect_ServiceLevel ||
				field == Fields.Connect_ModelName ||
				field == Fields.Connect_OS ||
				field == Fields.Connect_Cable ||
				field == Fields.Connect_GivenVolume ||
				field == Fields.Connect_RealUseVolume ||
				field == Fields.Connect_EtcVolume ||
				field == Fields.Connect_FreeVolume ||
				field == Fields.Connect_MonthlyIncrease ||
				field == Fields.Connect_ConnectType ||
				field == Fields.Connect_ChannelPathCount ||
				field == Fields.Connect_PathDualSolution ||
				field == Fields.Connect_NWEquip_1 ||
				field == Fields.Connect_NWEquip_2 ||
				field == Fields.Connect_NWEquip_3 ||
				field == Fields.Connect_NWEquip_4 ||
				field == Fields.Connect_SanSwitch_1 ||
				field == Fields.Connect_SanSwitch_2 ||
				field == Fields.Connect_SanSwitch_3 ||
				field == Fields.Connect_SanSwitch_4 ||
				field == Fields.Connect_SanSwitch_5 ||
				field == Fields.Connect_SanSwitch_6 ||
				field == Fields.Connect_SanSwitch_7 ||
				field == Fields.Connect_SanSwitch_8)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
