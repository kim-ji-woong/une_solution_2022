using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Nipa.Model.Sdms.History
{
	public class SensorReaction : Table
	{
		public enum Fields { ID, SensorZoneHistoryID, ReactionType, Time, Message, Param1, Param2, Param3, Param4, Param5 };
		public enum WriteFields { ID, SensorZoneHistoryID, ReactionType, Time, Message, Param1, Param2, Param3, Param4, Param5 };

		public enum ReactionTypes
		{
			NONE = -1,
			BEGIN_STATUS = 0,              // 상황 시작
			RUN_BROADCAST = 10,            // 사내 방송 실시         
			SEND_SMS = 11,                 // 문자메시지 발송
			MALFUNCTION = 21,              // 오작동 처리
			NOTIFY_SIGNAL = 22,            // 재난 신고
			IGNORE_SIGNAL = 23,            // 재난 탐지신호 무시

			RUN_SOP = 30,                  // SOP 발동 
			RUN_N_CANCEL_SOP = 31,         // SOP 실행중 취소
			FINISH_SOP = 32,               // SOP 종료
			IGNORE_SOP = 33,               // SOP 실행 안함
			END_STATUS = 50,               // 상황 종료

			CHANGE_ALARM_DEPTH = 62,
			USER_RESET = 64,               // 사용자 복구
			ETC = 100,                     // 기타
			RUN_DETECT_BROADCAST = 101,
			RUN_REPORT_BROADCAST = 102,
			SEND_DETECT_SMS = 111,
			SEND_REPORT_SMS = 112,
			SEND_MALFUNCTION_SMS = 113,
			SEND_REPAIR_SMS = 114,

			TIME_OUT = 1000
		}

		public int ID { get; set; }
		public int SensorZoneHistoryID { get; set; }
		public int ReactionType { get; set; }
		public DateTime Time { get; set; }
		public string Message { get; set; }
		public string Param1 { get; set; }
		public string Param2 { get; set; }
		public string Param3 { get; set; }
		public string Param4 { get; set; }
		public string Param5 { get; set; }

		public static string TableName { get { return "SdmsHistorySensorReaction"; } }

		public override string GetTableName()
		{
			return TableName;
		}

		public override string GetPrimaryCondition()
		{
			return string.Format("ID = {0}", ID);
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
