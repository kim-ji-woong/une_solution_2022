using System;

namespace VDS.Model
{
	public class ItemServer
	{
		public enum Fields { BoxID, Basic_ServerCategory, Basic_SystemName, Basic_ServerName, Basic_ProductGroup, Basic_WorkSystemName, Basic_ServerType, Basic_OperationType, Basic_ServerLevel, Basic_ServerLevelYear_1, Basic_ServerLevelYear, Basic_ReceiveDate, Basic_RegDate, Basic_Status, Basic_Usage, Basic_VirtualType, Basic_DRType, Basic_PropertyType, Basic_OwnDepartment, Basic_OperationDepartment, Basic_GIMS, Manage_SuperviseManager, Manage_OperationManager, Manage_ServiceManager, Position_InstallRegion, Position_Region, Position_RackDetailPosition, HW_OSType, HW_OS, HW_OSVersion, HW_OSPatchLevel, HW_OSInstallDate, HW_OSAccountID, HW_KernelBit, HW_EOS, HW_EOSDate, HW_AccountTPAM, HW_LogicalCoreCount, HW_UsableDiskVolumeGB, HW_LogicalMemoryVolumeMB, HW_NetworkSpeed, HW_ServerDual, Dual_DualType, Dual_DualSolutionVM, Dual_DualSolutionService, Dual_DualServerVM, SW_AccountManage, SW_ServerAccessInstall, SW_DCA, SW_VaccineInstall, SW_InstallVaccineName, SW_InstallSWName, NW_Zone, NW_ServiceIPAddr, NW_ServiceIPDual, NW_HeartBeatIPAddr, NW_HeartBeatIPDual, NW_BackupIPAddr, NW_BackIPDual, NW_ManageIPAddr, NW_ManageIPDual, NW_Etc1IPAddr, NW_Etc1IPAddrDual, NW_Etc2IPAddr, NW_Etc2IPDual, Backup_InternalOSBackup, Backup_InternalOSBackupSW, Backup_ExternalBackupRun, Backup_ExternalBackupSWType, Backup_ExternalRemote, Backup_ExternalRemotePosition, DataCenterID, BoxName };

		public int? BoxID { get; set; }
		public string Basic_ServerCategory { get; set; }
		public string Basic_SystemName { get; set; }
		public string Basic_ServerName { get; set; }
		public string Basic_ProductGroup { get; set; }
		public string Basic_WorkSystemName { get; set; }
		public string Basic_ServerType { get; set; }
		public string Basic_OperationType { get; set; }
		public string Basic_ServerLevel { get; set; }
		public string Basic_ServerLevelYear_1 { get; set; }
		public string Basic_ServerLevelYear { get; set; }
		public DateTime? Basic_ReceiveDate { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_Status { get; set; }
		public string Basic_Usage { get; set; }
		public string Basic_VirtualType { get; set; }
		public string Basic_DRType { get; set; }
		public string Basic_PropertyType { get; set; }
		public string Basic_OwnDepartment { get; set; }
		public string Basic_OperationDepartment { get; set; }
		public string Basic_GIMS { get; set; }
		public string Manage_SuperviseManager { get; set; }
		public string Manage_OperationManager { get; set; }
		public string Manage_ServiceManager { get; set; }
		public string Position_InstallRegion { get; set; }
		public string Position_Region { get; set; }
		public string Position_RackDetailPosition { get; set; }
		public string HW_OSType { get; set; }
		public string HW_OS { get; set; }
		public string HW_OSVersion { get; set; }
		public string HW_OSPatchLevel { get; set; }
		public DateTime? HW_OSInstallDate { get; set; }
		public string HW_OSAccountID { get; set; }
		public int? HW_KernelBit { get; set; }
		public bool? HW_EOS { get; set; }
		public DateTime? HW_EOSDate { get; set; }
		public bool? HW_AccountTPAM { get; set; }
		public int? HW_LogicalCoreCount { get; set; }
		public int? HW_UsableDiskVolumeGB { get; set; }
		public int? HW_LogicalMemoryVolumeMB { get; set; }
		public string HW_NetworkSpeed { get; set; }
		public bool? HW_ServerDual { get; set; }
		public string Dual_DualType { get; set; }
		public string Dual_DualSolutionVM { get; set; }
		public string Dual_DualSolutionService { get; set; }
		public string Dual_DualServerVM { get; set; }
		public string SW_AccountManage { get; set; }
		public string SW_ServerAccessInstall { get; set; }
		public bool? SW_DCA { get; set; }
		public bool? SW_VaccineInstall { get; set; }
		public string SW_InstallVaccineName { get; set; }
		public string SW_InstallSWName { get; set; }
		public string NW_Zone { get; set; }
		public string NW_ServiceIPAddr { get; set; }
		public bool? NW_ServiceIPDual { get; set; }
		public string NW_HeartBeatIPAddr { get; set; }
		public bool? NW_HeartBeatIPDual { get; set; }
		public string NW_BackupIPAddr { get; set; }
		public bool? NW_BackIPDual { get; set; }
		public string NW_ManageIPAddr { get; set; }
		public bool? NW_ManageIPDual { get; set; }
		public string NW_Etc1IPAddr { get; set; }
		public bool? NW_Etc1IPAddrDual { get; set; }
		public string NW_Etc2IPAddr { get; set; }
		public bool? NW_Etc2IPDual { get; set; }
		public bool? Backup_InternalOSBackup { get; set; }
		public string Backup_InternalOSBackupSW { get; set; }
		public bool? Backup_ExternalBackupRun { get; set; }
		public string Backup_ExternalBackupSWType { get; set; }
		public bool? Backup_ExternalRemote { get; set; }
		public string Backup_ExternalRemotePosition { get; set; }
		public int DataCenterID { get; set; }
		public string BoxName { get; set; }

		public static string TableName { get { return "ItemServer"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.BoxID ||
				field == Fields.Basic_ServerCategory ||
				field == Fields.Basic_SystemName ||
				field == Fields.Basic_ProductGroup ||
				field == Fields.Basic_WorkSystemName ||
				field == Fields.Basic_ServerType ||
				field == Fields.Basic_ServerLevelYear_1 ||
				field == Fields.Basic_ServerLevelYear ||
				field == Fields.Basic_ReceiveDate ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_VirtualType ||
				field == Fields.Basic_DRType ||
				field == Fields.Basic_PropertyType ||
				field == Fields.Basic_OwnDepartment ||
				field == Fields.Basic_OperationDepartment ||
				field == Fields.Basic_GIMS ||
				field == Fields.Manage_SuperviseManager ||
				field == Fields.Manage_OperationManager ||
				field == Fields.Manage_ServiceManager ||
				field == Fields.Position_InstallRegion ||
				field == Fields.Position_Region ||
				field == Fields.Position_RackDetailPosition ||
				field == Fields.HW_OSType ||
				field == Fields.HW_OSPatchLevel ||
				field == Fields.HW_OSInstallDate ||
				field == Fields.HW_OSAccountID ||
				field == Fields.HW_KernelBit ||
				field == Fields.HW_EOS ||
				field == Fields.HW_EOSDate ||
				field == Fields.HW_AccountTPAM ||
				field == Fields.HW_LogicalCoreCount ||
				field == Fields.HW_UsableDiskVolumeGB ||
				field == Fields.HW_LogicalMemoryVolumeMB ||
				field == Fields.HW_NetworkSpeed ||
				field == Fields.HW_ServerDual ||
				field == Fields.Dual_DualType ||
				field == Fields.Dual_DualSolutionVM ||
				field == Fields.Dual_DualSolutionService ||
				field == Fields.Dual_DualServerVM ||
				field == Fields.SW_AccountManage ||
				field == Fields.SW_ServerAccessInstall ||
				field == Fields.SW_DCA ||
				field == Fields.SW_VaccineInstall ||
				field == Fields.SW_InstallVaccineName ||
				field == Fields.SW_InstallSWName ||
				field == Fields.NW_Zone ||
				field == Fields.NW_ServiceIPAddr ||
				field == Fields.NW_ServiceIPDual ||
				field == Fields.NW_HeartBeatIPAddr ||
				field == Fields.NW_HeartBeatIPDual ||
				field == Fields.NW_BackupIPAddr ||
				field == Fields.NW_BackIPDual ||
				field == Fields.NW_ManageIPDual ||
				field == Fields.NW_Etc1IPAddr ||
				field == Fields.NW_Etc1IPAddrDual ||
				field == Fields.NW_Etc2IPAddr ||
				field == Fields.NW_Etc2IPDual ||
				field == Fields.Backup_InternalOSBackup ||
				field == Fields.Backup_InternalOSBackupSW ||
				field == Fields.Backup_ExternalBackupRun ||
				field == Fields.Backup_ExternalBackupSWType ||
				field == Fields.Backup_ExternalRemote ||
				field == Fields.Backup_ExternalRemotePosition)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
