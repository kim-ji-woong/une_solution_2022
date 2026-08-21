using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace MesReader.Data.Model
{
    public class Factory_operating : Table
    {
		public enum Fields { 이름, 대수, 비가동, 가동, 준비, 계획없음, 가동률 };
		public enum WriteFields { 이름, 대수, 비가동, 가동, 준비, 계획없음, 가동률 };

		public string 이름 { get; set; }
		public int? 대수 { get; set; }
		public int? 비가동 { get; set; }
		public int? 가동 { get; set; }
		public int? 준비 { get; set; }
		public int? 계획없음 { get; set; }
		public string 가동률 { get; set; }

		public static string TableName { get { return "Factory001_operating"; } }

		public override string GetTableName()
		{
			return TableName;
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
