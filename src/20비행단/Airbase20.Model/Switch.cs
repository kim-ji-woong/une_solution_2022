using System;
using System.Collections.Generic;
using System.Text;

namespace Airbase20.Model
{
	public class Switch
	{
		public enum Fields { ID, Name, Type, IP, SubIP, Port, Memo, SlaveID };

		public int ID { get; set; }
		public string Name { get; set; }
		public int Type { get; set; }
		public string IP { get; set; }
		public string SubIP { get; set; }
		public int Port { get; set; }
		public string Memo { get; set; }
		public int SlaveID { get; set; }

		public static string TableName { get { return "Switch"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.Memo)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
