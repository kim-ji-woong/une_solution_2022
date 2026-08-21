namespace Safety.Model.Sop.Team
{
	public class RegularMemberInfo
	{
		public enum Fields { MemberID, LoginStatus, ZoneID, X, Y, Helmet, Belt, Shoes };

		public int MemberID { get; set; }
		public bool LoginStatus { get; set; }
		public int? ZoneID { get; set; }
		public double? X { get; set; }
		public double? Y { get; set; }
		public bool? Helmet { get; set; }
		public bool? Belt { get; set; }
		public bool? Shoes { get; set; }

		public static string TableName { get { return "SopTeamRegularMemberInfo"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ZoneID ||
				field == Fields.X ||
				field == Fields.Y ||
				field == Fields.Helmet ||
				field == Fields.Belt ||
				field == Fields.Shoes)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
