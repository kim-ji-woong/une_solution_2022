using System;

namespace VDS.Model.ItemData
{
	public class Network
	{
		public enum Fields { NetworkID, Basic_Name, Basic_Status, Basic_RegDate, Basic_Usage, Basic_EquipDetailClass, Basic_ItemLevel, Basic_ReceiveDate, Basic_OwnerCompanyName, Basic_OwnDepartment, Basic_OperationDepartment, Basic_OverUsedYear, Basic_Stock, Basic_Type1, Basic_Type2, Basic_Memo, Manage_SuperviseManager, Manage_OperationManager, Position_InstallRegion, Position_RackDetailPosition, Maintenance_ProvideCompanyName, Maintenance_WarrantyMonth, Maintenance_WarrantyExpiredDate, Maintenance_MaintenanceCompanyName, Maintenance_EOSDate, Maintenance_EOLDate, Maintenance_MaintenanceContract, Maintenance_MaintenanceBeginDate, Maintenance_MaintenanceEndDate, HW_ModelName, HW_Company, HW_SerialNumber, HW_OSVersion, HW_IP_01, HW_IP_02, HW_IP_03, HW_IP_04, HW_IP_05, HW_IP_06, HW_IP_07, HW_IP_08, HW_Rack, HW_PowerDual, HW_Zone, HW_DetailUsage, HW_NMS, HW_NWLineName, Connect_NWEquip_1, Connect_NWEquip_2, Connect_NWEquip_3, Connect_NWEquip_4, DataCenterID };

		public int? NetworkID { get; set; }
		public string Basic_Name { get; set; }
		public string Basic_Status { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_Usage { get; set; }
		public string Basic_EquipDetailClass { get; set; }
		public string Basic_ItemLevel { get; set; }
		public DateTime? Basic_ReceiveDate { get; set; }
		public string Basic_OwnerCompanyName { get; set; }
		public string Basic_OwnDepartment { get; set; }
		public string Basic_OperationDepartment { get; set; }
		public bool? Basic_OverUsedYear { get; set; }
		public bool? Basic_Stock { get; set; }
		public string Basic_Type1 { get; set; }
		public string Basic_Type2 { get; set; }
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
		public bool? Maintenance_MaintenanceContract { get; set; }
		public DateTime? Maintenance_MaintenanceBeginDate { get; set; }
		public DateTime? Maintenance_MaintenanceEndDate { get; set; }
		public string HW_ModelName { get; set; }
		public string HW_Company { get; set; }
		public string HW_SerialNumber { get; set; }
		public string HW_OSVersion { get; set; }
		public string HW_IP_01 { get; set; }
		public string HW_IP_02 { get; set; }
		public string HW_IP_03 { get; set; }
		public string HW_IP_04 { get; set; }
		public string HW_IP_05 { get; set; }
		public string HW_IP_06 { get; set; }
		public string HW_IP_07 { get; set; }
		public string HW_IP_08 { get; set; }
		public string HW_Rack { get; set; }
		public bool? HW_PowerDual { get; set; }
		public string HW_Zone { get; set; }
		public string HW_DetailUsage { get; set; }
		public bool? HW_NMS { get; set; }
		public string HW_NWLineName { get; set; }
		public string Connect_NWEquip_1 { get; set; }
		public string Connect_NWEquip_2 { get; set; }
		public string Connect_NWEquip_3 { get; set; }
		public string Connect_NWEquip_4 { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "ItemData_Network"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.NetworkID ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_ReceiveDate ||
				field == Fields.Basic_OwnerCompanyName ||
				field == Fields.Basic_OwnDepartment ||
				field == Fields.Basic_OperationDepartment ||
				field == Fields.Basic_OverUsedYear ||
				field == Fields.Basic_Stock ||
				field == Fields.Basic_Type1 ||
				field == Fields.Basic_Type2 ||
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
				field == Fields.Maintenance_MaintenanceContract ||
				field == Fields.Maintenance_MaintenanceBeginDate ||
				field == Fields.Maintenance_MaintenanceEndDate ||
				field == Fields.HW_SerialNumber ||
				field == Fields.HW_OSVersion ||
				field == Fields.HW_IP_01 ||
				field == Fields.HW_IP_02 ||
				field == Fields.HW_IP_03 ||
				field == Fields.HW_IP_04 ||
				field == Fields.HW_IP_05 ||
				field == Fields.HW_IP_06 ||
				field == Fields.HW_IP_07 ||
				field == Fields.HW_IP_08 ||
				field == Fields.HW_Rack ||
				field == Fields.HW_PowerDual ||
				field == Fields.HW_Zone ||
				field == Fields.HW_DetailUsage ||
				field == Fields.HW_NMS ||
				field == Fields.HW_NWLineName ||
				field == Fields.Connect_NWEquip_1 ||
				field == Fields.Connect_NWEquip_2 ||
				field == Fields.Connect_NWEquip_3 ||
				field == Fields.Connect_NWEquip_4)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
