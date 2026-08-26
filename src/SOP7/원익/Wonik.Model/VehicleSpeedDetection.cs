using System;
using System.Collections.Generic;
using System.Text;

namespace Wonik.Model
{
	public class VehicleSpeedDetection : IIDObject
	{
		// CarNo / DiffSeconds 는 반드시 뒤쪽(DB 컬럼 순서와 동일)에 둔다.
		//   CreateManager 가 GetFieldNames(컬럼 목록)와 GetFieldValues(값 목록)를 각각
		//   Enum.GetValues 순서로 만들어 Insert 문을 조립하므로, 열거 순서 = 컬럼 순서다.
		public enum Fields { ID, DetectionTime, SensorID, Speed, CarNo, DiffSeconds };

		public int ID { get; set; }
		public DateTime DetectionTime { get; set; }
		public int SensorID { get; set; }
		public int Speed { get; set; }

		/// <summary>
		/// 차량 번호판. LPR 연동으로 사후에 채워진다. 감지 시점에는 null 이다. (nvarchar(10), NULL 허용)
		/// </summary>
		public string CarNo { get; set; }

		/// <summary>
		/// LPR 이벤트 시각과의 차이(초). CarNo 를 채울 때 함께 기록한다.
		///   DiffSeconds = DetectionTime - LPR 이벤트 시각
		///   양수 : DB 시각이 더 늦음 (LPR 이 먼저 찍힘)
		///   음수 : DB 시각이 더 빠름
		/// (SQL float, NULL 허용)
		/// </summary>
		public double? DiffSeconds { get; set; }

		public static string TableName { get { return "SdmsVehicleSpeedDetection"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			isNullable = (field == Fields.CarNo || field == Fields.DiffSeconds);

			return field.ToString();
		}
	}
}
