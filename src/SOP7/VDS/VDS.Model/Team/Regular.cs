namespace VDS.Model.Team
{
	public class Regular
	{
		public enum Fields { ID, TeamName, ParentTeamID };

		public int ID { get; set; }
		public string TeamName { get; set; }
		public int? ParentTeamID { get; set; }

		public static string TableName { get { return "TeamRegular"; } }

		public static string GetFieldName(Fields field, out bool isNullable)
		{
			if (field == Fields.ParentTeamID)
				isNullable = true;
			else
				isNullable = false;

			return field.ToString();
		}
	}
}
