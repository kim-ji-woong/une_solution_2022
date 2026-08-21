using System;

namespace VDS.Model.ItemData
{
	public class Security
	{
		public enum Fields { SecurityID, Basic_Name, Basic_Status, Basic_RegDate, Basic_Usage, Basic_EquipType, Basic_EquipDetailClass, Basic_ReceiveDate, Basic_ItemLevel, Basic_OwnerCompanyName, Basic_OwnDepartment, Basic_OperationDepartment, Basic_Memo, Manage_SuperviseManager, Manage_OperationManager, Position_InstallRegion, Position_RackDetailPosition, Maintenance_ProvideCompanyName, Maintenance_WarrantyMonth, Maintenance_WarrantyExpiredDate, Maintenance_MaintenanceCompanyName, Maintenance_EOSDate, Maintenance_MaintenanceContract, Maintenance_MaintenanceBeginDate, Maintenance_MaintenanceEndDate, HW_ModelName, HW_Company, HW_SerialNumber, HW_FirmwareVersion, HW_IP, Connect_NWEquip_1, Connect_NWEquip_2, DataCenterID };

		public int? SecurityID { get; set; }
		public string Basic_Name { get; set; }
		public string Basic_Status { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_Usage { get; set; }
		public string Basic_EquipType { get; set; }
		public string Basic_EquipDetailClass { get; set; }
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
		public string HW_IP { get; set; }
		public string Connect_NWEquip_1 { get; set; }
		public string Connect_NWEquip_2 { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "ItemData_Security"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.SecurityID ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_EquipType ||
				field == Fields.Basic_EquipDetailClass ||
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
				field == Fields.HW_IP ||
				field == Fields.Connect_NWEquip_1 ||
				field == Fields.Connect_NWEquip_2)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
