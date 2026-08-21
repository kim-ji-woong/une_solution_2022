using System;

namespace VDS.Model.ItemData
{
	public class SanSwitch
	{
		public enum Fields { SwitchID, Basic_Name, Basic_Status, Basic_RegDate, Basic_Usage, Basic_ReceiveDate, Basic_ItemLevel, Basic_OwnerCompanyName, Basic_OwnDepartment, Basic_OperationDepartment, Basic_Memo, Manage_SuperviseManager, Manage_OperationManager, Position_InstallRegion, Position_RackDetailPosition, Maintenance_ProvideCompanyName, Maintenance_WarrantyMonth, Maintenance_WarrantyExpiredDate, Maintenance_MaintenanceCompanyName, Maintenance_EOSDate, Maintenance_MaintenanceContract, Maintenance_MaintenanceBeginDate, Maintenance_MaintenanceEndDate, HW_ModelName, HW_Company, HW_SerialNumber, HW_FirmwareVersion, HW_Dual, HW_DualSanSwitchName, HW_InterfaceType, HW_Interface, HW_FCPortCount, HW_FCPortUseCount, HW_FCPortFree, HW_GBICPortCount, HW_DualBoxSerial, HW_SecurityType, HW_FanCount, HW_FanDual, HW_PowerSupplyDual, HW_ConnectPDUDual, Dual_RackPowerDualUse, DataCenterID };

		public int? SwitchID { get; set; }
		public string Basic_Name { get; set; }
		public string Basic_Status { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_Usage { get; set; }
		public DateTime? Basic_ReceiveDate { get; set; }
		public string Basic_ItemLevel { get; set; }
		public string Basic_OwnerCompanyName { get; set; }
		public string Basic_OwnDepartment { get; set; }
		public string Basic_OperationDepartment { get; set; }
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
		public string HW_FirmwareVersion { get; set; }
		public bool? HW_Dual { get; set; }
		public string HW_DualSanSwitchName { get; set; }
		public string HW_InterfaceType { get; set; }
		public string HW_Interface { get; set; }
		public int HW_FCPortCount { get; set; }
		public int HW_FCPortUseCount { get; set; }
		public int? HW_FCPortFree { get; set; }
		public int? HW_GBICPortCount { get; set; }
		public string HW_DualBoxSerial { get; set; }
		public string HW_SecurityType { get; set; }
		public int? HW_FanCount { get; set; }
		public bool? HW_FanDual { get; set; }
		public bool? HW_PowerSupplyDual { get; set; }
		public bool? HW_ConnectPDUDual { get; set; }
		public bool? Dual_RackPowerDualUse { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "ItemData_SanSwitch"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.SwitchID ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_ReceiveDate ||
				field == Fields.Basic_OwnerCompanyName ||
				field == Fields.Basic_OwnDepartment ||
				field == Fields.Basic_OperationDepartment ||
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
				field == Fields.HW_FirmwareVersion ||
				field == Fields.HW_Dual ||
				field == Fields.HW_DualSanSwitchName ||
				field == Fields.HW_InterfaceType ||
				field == Fields.HW_Interface ||
				field == Fields.HW_FCPortFree ||
				field == Fields.HW_GBICPortCount ||
				field == Fields.HW_DualBoxSerial ||
				field == Fields.HW_SecurityType ||
				field == Fields.HW_FanCount ||
				field == Fields.HW_FanDual ||
				field == Fields.HW_PowerSupplyDual ||
				field == Fields.HW_ConnectPDUDual ||
				field == Fields.Dual_RackPowerDualUse)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
