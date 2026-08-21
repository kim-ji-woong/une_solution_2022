using System;

namespace SensorServer.Model.Yeosu
{
	public class EtcSensorDataHistory
	{
		public enum Fields { SensorID, TimeStamp, SensorValue };

		public int SensorID { get; set; }
		public DateTime TimeStamp { get; set; }
		public string SensorValue { get; set; }

		public static string TableName { get { return "YeosuEtcSensorDataHistory"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.SensorValue)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
