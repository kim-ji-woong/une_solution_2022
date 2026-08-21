using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Mes.Equipment
{
	public class Data : Table
	{
		public enum Fields { EqID, ShotCount, ShotTime, ProcessTime, CushionPos, MaxPressure, TransferPos, TransferPressure, InjectTime, HoldingPressure, MeasureTime, MeasureStartPos, MeasureEndPos, IcingTime, MoldOpenTime, MoldCloseTime, FowardTime, BackwardTime, OK, TimeStamp, Progress };
		public enum WriteFields { EqID, ShotCount, ShotTime, ProcessTime, CushionPos, MaxPressure, TransferPos, TransferPressure, InjectTime, HoldingPressure, MeasureTime, MeasureStartPos, MeasureEndPos, IcingTime, MoldOpenTime, MoldCloseTime, FowardTime, BackwardTime, OK, TimeStamp, Progress };

		public int EqID { get; set; }
		public int ShotCount { get; set; }
		public DateTime ShotTime { get; set; }
		public double ProcessTime { get; set; }
		public double CushionPos { get; set; }
		public double MaxPressure { get; set; }
		public double TransferPos { get; set; }
		public double TransferPressure { get; set; }
		public double InjectTime { get; set; }
		public double HoldingPressure { get; set; }
		public double MeasureTime { get; set; }
		public double MeasureStartPos { get; set; }
		public double MeasureEndPos { get; set; }
		public double IcingTime { get; set; }
		public double MoldOpenTime { get; set; }
		public double MoldCloseTime { get; set; }
		public double FowardTime { get; set; }
		public double BackwardTime { get; set; }
		public bool OK { get; set; }
		public DateTime TimeStamp { get; set; }
		public float Progress { get; set; }

		public static string TableName { get { return "MesEquipmentData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("EqID = {0}", EqID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(WriteFields);
		}
	}
}
