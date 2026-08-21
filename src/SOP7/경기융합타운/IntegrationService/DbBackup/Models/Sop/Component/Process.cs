using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace DbBackup.Models.Sop.Component
{
	public class Process : Table
	{
		public enum Fields { ID, GridID, GridRowIndex, GridColumnIndex, width, height, text, TeamList, ComponentID, onlyTeamLeader, StepMemberID, valign, halign, FontName, FontStyle, FontSize, LineSpace, FontColor, AutoRun, SectionNumber };
		public enum WriteFields { ID, GridID, GridRowIndex, GridColumnIndex, width, height, text, TeamList, ComponentID, onlyTeamLeader, StepMemberID, valign, halign, FontName, FontStyle, FontSize, LineSpace, FontColor, AutoRun, SectionNumber };

		public int ID { get; set; }
		public int GridID { get; set; }
		public int GridRowIndex { get; set; }
		public int GridColumnIndex { get; set; }
		public double width { get; set; }
		public double height { get; set; }
		public string text { get; set; }
		public string TeamList { get; set; }
		public string ComponentID { get; set; }
		public bool? onlyTeamLeader { get; set; }
		public int StepMemberID { get; set; }
		public int? valign { get; set; }
		public int? halign { get; set; }
		public string FontName { get; set; }
		public int? FontStyle { get; set; }
		public double? FontSize { get; set; }
		public double? LineSpace { get; set; }
		public int? FontColor { get; set; }
		public bool AutoRun { get; set; }
		public int? SectionNumber { get; set; }

		public static string TableName { get { return "SopComponentProcess"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("{0} = {1}", Fields.ID, ID);
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
