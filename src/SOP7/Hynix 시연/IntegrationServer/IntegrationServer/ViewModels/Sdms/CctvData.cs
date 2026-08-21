using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.CCTV
{
	public class CctvData : Table
	{
		public enum Fields { CctvID, Type, LimitValue1, LimitValue2, LimitValue3, LimitValue4 };

		public int CctvID { get; set; }
		/// <summary>
		/// 1 : 온도
		/// </summary>
		public int Type { get; set; }
		/// <summary>
		/// 관심 알람 임계치
		/// </summary>
		public int? LimitValue1 { get; set; }
		/// <summary>
		/// 주의 알람 임계치
		/// </summary>
		public int? LimitValue2 { get; set; }
		/// <summary>
		/// 경보 알람 임계치
		/// </summary>
		public int? LimitValue3 { get; set; }
		/// <summary>
		/// 심각 알람 임계치
		/// </summary>
		public int? LimitValue4 { get; set; }

		public static string TableName { get { return "SdmsCCTVData"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format(Fields.CctvID + " = " + CctvID);
		}

		public override Type GetFieldType()
		{
			return typeof(Fields);
		}

		public override Type GetWriteFieldType()
		{
			return typeof(Fields);
		}
	}
}
