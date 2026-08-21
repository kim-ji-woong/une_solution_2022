using System;

namespace VDS.Model.ItemData
{
	public class Etc
	{
		public enum Fields { EtcID, Basic_Name, Basic_Status, Basic_RegDate, Basic_Usage, Basic_EquipDetailClass, Basic_LifeYear, Basic_OverUsedYear, Basic_ReceiveDate, Basic_ItemLevel, Basic_OwnerCompanyName, Basic_OwnDepartment, Basic_OperationDepartment, Basic_SiteManager, Basic_DiscardDate, Basic_Memo, Manage_SuperviseManager, Manage_OperationManager, Position_InstallRegion, Position_RackDetailPosition, Maintenance_ProvideCompanyName, Maintenance_WarrantyMonth, Maintenance_WarrantyExpiredDate, Maintenance_FinancialDepartment, Maintenance_MaintenanceCompanyName, Maintenance_EOSDate, Maintenance_MaintenanceContract, Maintenance_MaintenanceBeginDate, Maintenance_MaintenanceEndDate, HW_ModelName, HW_Company, HW_SerialNumber, HW_FirmwareVersion, HW_MultiLicense, HW_MicCount, HW_PAD, HW_Rack, HW_MonitorModelName, HW_MonitorType, HW_MonitorScreenSizeInch, HW_ScreenIP, HW_HostName, HW_QoS, HW_QosVolume, HW_PrivateLine, HW_PrivateCompanyBW, HW_Special, Connect_NWEquip_1, Connect_NWEquip_2, DataCenterID };

		public int? EtcID { get; set; }
		public string Basic_Name { get; set; }
		public string Basic_Status { get; set; }
		public DateTime? Basic_RegDate { get; set; }
		public string Basic_Usage { get; set; }
		public string Basic_EquipDetailClass { get; set; }
		public int? Basic_LifeYear { get; set; }
		public bool? Basic_OverUsedYear { get; set; }
		public DateTime? Basic_ReceiveDate { get; set; }
		public string Basic_ItemLevel { get; set; }
		public string Basic_OwnerCompanyName { get; set; }
		public string Basic_OwnDepartment { get; set; }
		public string Basic_OperationDepartment { get; set; }
		public string Basic_SiteManager { get; set; }
		public DateTime? Basic_DiscardDate { get; set; }
		public string Basic_Memo { get; set; }
		public string Manage_SuperviseManager { get; set; }
		public string Manage_OperationManager { get; set; }
		public string Position_InstallRegion { get; set; }
		public string Position_RackDetailPosition { get; set; }
		public string Maintenance_ProvideCompanyName { get; set; }
		public int? Maintenance_WarrantyMonth { get; set; }
		public DateTime? Maintenance_WarrantyExpiredDate { get; set; }
		public string Maintenance_FinancialDepartment { get; set; }
		public string Maintenance_MaintenanceCompanyName { get; set; }
		public DateTime? Maintenance_EOSDate { get; set; }
		public bool? Maintenance_MaintenanceContract { get; set; }
		public DateTime? Maintenance_MaintenanceBeginDate { get; set; }
		public DateTime? Maintenance_MaintenanceEndDate { get; set; }
		public string HW_ModelName { get; set; }
		public string HW_Company { get; set; }
		public string HW_SerialNumber { get; set; }
		public string HW_FirmwareVersion { get; set; }
		public string HW_MultiLicense { get; set; }
		public int? HW_MicCount { get; set; }
		public bool? HW_PAD { get; set; }
		public bool? HW_Rack { get; set; }
		public string HW_MonitorModelName { get; set; }
		public string HW_MonitorType { get; set; }
		public int? HW_MonitorScreenSizeInch { get; set; }
		public string HW_ScreenIP { get; set; }
		public string HW_HostName { get; set; }
		public bool? HW_QoS { get; set; }
		public string HW_QosVolume { get; set; }
		public bool? HW_PrivateLine { get; set; }
		public string HW_PrivateCompanyBW { get; set; }
		public string HW_Special { get; set; }
		public string Connect_NWEquip_1 { get; set; }
		public string Connect_NWEquip_2 { get; set; }
		public int DataCenterID { get; set; }

		public static string TableName { get { return "ItemData_Etc"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.EtcID ||
				field == Fields.Basic_RegDate ||
				field == Fields.Basic_LifeYear ||
				field == Fields.Basic_OverUsedYear ||
				field == Fields.Basic_ReceiveDate ||
				field == Fields.Basic_OwnerCompanyName ||
				field == Fields.Basic_OwnDepartment ||
				field == Fields.Basic_OperationDepartment ||
				field == Fields.Basic_SiteManager ||
				field == Fields.Basic_DiscardDate ||
				field == Fields.Basic_Memo ||
				field == Fields.Manage_SuperviseManager ||
				field == Fields.Manage_OperationManager ||
				field == Fields.Position_InstallRegion ||
				field == Fields.Position_RackDetailPosition ||
				field == Fields.Maintenance_ProvideCompanyName ||
				field == Fields.Maintenance_WarrantyMonth ||
				field == Fields.Maintenance_WarrantyExpiredDate ||
				field == Fields.Maintenance_FinancialDepartment ||
				field == Fields.Maintenance_MaintenanceCompanyName ||
				field == Fields.Maintenance_EOSDate ||
				field == Fields.Maintenance_MaintenanceContract ||
				field == Fields.Maintenance_MaintenanceBeginDate ||
				field == Fields.Maintenance_MaintenanceEndDate ||
				field == Fields.HW_SerialNumber ||
				field == Fields.HW_FirmwareVersion ||
				field == Fields.HW_MultiLicense ||
				field == Fields.HW_MicCount ||
				field == Fields.HW_PAD ||
				field == Fields.HW_Rack ||
				field == Fields.HW_MonitorModelName ||
				field == Fields.HW_MonitorType ||
				field == Fields.HW_MonitorScreenSizeInch ||
				field == Fields.HW_ScreenIP ||
				field == Fields.HW_HostName ||
				field == Fields.HW_QoS ||
				field == Fields.HW_QosVolume ||
				field == Fields.HW_PrivateLine ||
				field == Fields.HW_PrivateCompanyBW ||
				field == Fields.HW_Special ||
				field == Fields.Connect_NWEquip_1 ||
				field == Fields.Connect_NWEquip_2)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
