namespace VDS.Model.Team
{
	public class RegularMember
	{
		public enum Fields { ID, RegularID, MemberName, MemberID, OfficePhoneNumber, PhoneNumber, JobLevel, JobPosition, Email, Status };

		public int ID { get; set; }
		public int RegularID { get; set; }
		public string MemberName { get; set; }
		public string MemberID { get; set; }
		public string OfficePhoneNumber { get; set; }
		public string PhoneNumber { get; set; }
		public string JobLevel { get; set; }
		public string JobPosition { get; set; }
		public string Email { get; set; }
		public string Status { get; set; }

		public static string TableName { get { return "TeamRegularMember"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.MemberID ||
				field == Fields.OfficePhoneNumber ||
				field == Fields.PhoneNumber ||
				field == Fields.JobLevel ||
				field == Fields.JobPosition ||
				field == Fields.Email ||
				field == Fields.Status)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
