using System;
using System.Collections.Generic;
using System.Text;

namespace GGH.Model.Equipment
{
	public class FirstAidEquipmentType
	{
		public enum Fields { ID, EquipmentType, EquipmentTypeEng };

		public int ID { get; set; }
		public string EquipmentType { get; set; }
		public string EquipmentTypeEng { get; set; }

		public static string TableName { get { return "SdmsFirstAidEquipmentType"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
