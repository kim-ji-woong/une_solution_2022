using System;

namespace VDS.Model.ItemData
{
	public class Backup
	{
		public enum Fields { BackupID, Basic_Name, Basic_Status, Basic_RegDate, Basic_Usage, Basic_ReceiveDate, Basic_ItemLevel, Basic_OwnerCompanyName, Basic_OwnDepartment, Basic_OperationDepartment, Basic_OverUsedYear, Basic_Memo, Manage_SuperviseManager, Manage_OperationManager, Position_InstallRegion, Position_RackDetailPosition, Maintenance_ProvideCompanyName, Maintenance_WarrantyMonth, Maintenance_WarrantyExpiredDate, Maintenance_MaintenanceCompanyName, Maintenance_EOSDate, Maintenance_MaintenanceContract, Maintenance_MaintenanceBeginDate, Maintenance_MaintenanceEndDate, HW_ModelName, HW_Company, HW_SerialNumber, HW_DiskType, HW_FirmwareVersion, HW_Topology, HW_IP, HW_RegDate, HW_DiskDriveType, HW_DiskTypeVolumeGB, HW_DiskCount, HW_PhysicalVolumeGB, HW_UsableVolumeGB, HW_RaidType, HW_BuyDate, HW_TotalSlotCount, HW_TapeMediaType, HW_TapeMediaCount, Connect_NWEquip_1, Connect_NWEquip_2, Connect_NWEquip_3, Connect_NWEquip_4, Connect_SanSwitch_1, Connect_SanSwitch_2, Connect_SanSwitch_3, Connect_SanSwitch_4, DataCenterID };

		public int? BackupID { get; set; }
		public string Basic_Name { get; set; }
		public string Basic_Status { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_Usage { get; set; }
		public DateTime? Basic_ReceiveDate { get; set; }
		public string Basic_ItemLevel { get; set; }
		public string Basic_OwnerCompanyName { get; set; }
		public string Basic_OwnDepartment { get; set; }
		public string Basic_OperationDepartment { get; set; }
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
		public bool? Maintenance_MaintenanceContract { get; set; }
		public DateTime? Maintenance_MaintenanceBeginDate { get; set; }
		public DateTime? Maintenance_MaintenanceEndDate { get; set; }
		public string HW_ModelName { get; set; }
		public string HW_Company { get; set; }
		public string HW_SerialNumber { get; set; }
		public string HW_DiskType { get; set; }
		public string HW_FirmwareVersion { get; set; }
		public string HW_Topology { get; set; }
		public string HW_IP { get; set; }
		public DateTime? HW_RegDate { get; set; }
		public string HW_DiskDriveType { get; set; }
		public int? HW_DiskTypeVolumeGB { get; set; }
		public int? HW_DiskCount { get; set; }
		public int? HW_PhysicalVolumeGB { get; set; }
		public int HW_UsableVolumeGB { get; set; }
		public string HW_RaidType { get; set; }
		public DateTime? HW_BuyDate { get; set; }
		public int? HW_TotalSlotCount { get; set; }
		public string HW_TapeMediaType { get; set; }
		public int? HW_TapeMediaCount { get; set; }
		public string Connect_NWEquip_1 { get; set; }
		public string Connect_NWEquip_2 { get; set; }
		public string Connect_NWEquip_3 { get; set; }
		public string Connect_NWEquip_4 { get; set; }
		public string Connect_SanSwitch_1 { get; set; }
		public string Connect_SanSwitch_2 { get; set; }
		public string Connect_SanSwitch_3 { get; set; }
		public string Connect_SanSwitch_4 { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "ItemData_Backup"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.BackupID ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_ReceiveDate ||
				field == Fields.Basic_OwnerCompanyName ||
				field == Fields.Basic_OwnDepartment ||
				field == Fields.Basic_OperationDepartment ||
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
				field == Fields.Maintenance_MaintenanceContract ||
				field == Fields.Maintenance_MaintenanceBeginDate ||
				field == Fields.Maintenance_MaintenanceEndDate ||
				field == Fields.HW_SerialNumber ||
				field == Fields.HW_DiskType ||
				field == Fields.HW_FirmwareVersion ||
				field == Fields.HW_Topology ||
				field == Fields.HW_IP ||
				field == Fields.HW_RegDate ||
				field == Fields.HW_DiskDriveType ||
				field == Fields.HW_DiskTypeVolumeGB ||
				field == Fields.HW_DiskCount ||
				field == Fields.HW_PhysicalVolumeGB ||
				field == Fields.HW_RaidType ||
				field == Fields.HW_BuyDate ||
				field == Fields.HW_TotalSlotCount ||
				field == Fields.HW_TapeMediaType ||
				field == Fields.HW_TapeMediaCount ||
				field == Fields.Connect_NWEquip_1 ||
				field == Fields.Connect_NWEquip_2 ||
				field == Fields.Connect_NWEquip_3 ||
				field == Fields.Connect_NWEquip_4 ||
				field == Fields.Connect_SanSwitch_1 ||
				field == Fields.Connect_SanSwitch_2 ||
				field == Fields.Connect_SanSwitch_3 ||
				field == Fields.Connect_SanSwitch_4)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
