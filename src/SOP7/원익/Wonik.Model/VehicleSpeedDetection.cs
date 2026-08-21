using System;
using System.Collections.Generic;
using System.Text;

namespace Wonik.Model
{
	public class VehicleSpeedDetection : IIDObject
	{
		public enum Fields { ID, DetectionTime, SensorID, Speed };

		public int ID { get; set; }
		public DateTime DetectionTime { get; set; }
		public int SensorID { get; set; }
		public int Speed { get; set; }

		public static string TableName { get { return "SdmsVehicleSpeedDetection"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = false;

			return field.ToString();
		}
	}
}
