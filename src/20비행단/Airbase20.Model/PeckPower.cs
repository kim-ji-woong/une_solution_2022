using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.Model
{
	public class PeckPower
	{
		public enum Fields { ID, Name, PeckValue };

		public int ID { get; set; }
		public string Name { get; set; }
		public int PeckValue { get; set; }

		public static string TableName { get { return "PeckPower"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;
			return field.ToString();
		}
	}
}
