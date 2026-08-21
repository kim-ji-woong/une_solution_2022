using System;
using System.IO;
using System.Collections.Generic;
using SDMS.IDAL;
using SDMS.Model.History;
using Common.Model.Option;
using NPOI.XWPF.UserModel;

namespace GGH.BLL.Report
{
    class WordReport
    {
        private string[] AlarmDepth = new string[4]{ "관심", "주의", "경계", "심각" };

        protected IDataManager m_dataManager = null;
        protected Common.IDAL.IDataManager m_commonDataManager = null;

        public WordReport(IDataManager dataManager, Common.IDAL.IDataManager commonDataManager)
        {
            m_dataManager = dataManager;
            m_commonDataManager = commonDataManager;
        }

        protected string GetDate(DateTime time)
        {
            string str = string.Format("{0}-{1:00}-{2:00}", time.Year, time.Month, time.Day);
            return str;
        }

        protected string GetTime(DateTime time)
        {
            string str = string.Format("{0:00}:{1:00}:{2:00}", time.Hour, time.Minute, time.Second);
            return str;
        }

        // XWPFParagraph 객체 복사 메서드
        protected XWPFParagraph CopyParagraph(XWPFParagraph original, XWPFTableCell cell)
        {
            XWPFParagraph copy = cell.AddParagraph();

            // 정렬방식 복사
            copy.Alignment = original.Alignment;
            copy.FontAlignment = original.FontAlignment;
            copy.VerticalAlignment = original.VerticalAlignment;

            // 원본 문단에서 XWPFRun들을 복사하여 새 문단에 추가
            foreach (XWPFRun originalRun in original.Runs)
            {
                XWPFRun copiedRun = copy.CreateRun();
                //copiedRun.SetText(originalRun.ToString()); // 텍스트 복사

                // 스타일 복사 (옵션)
                copiedRun.IsBold = originalRun.IsBold;
                copiedRun.IsBold = originalRun.IsBold;
                copiedRun.IsItalic = originalRun.IsItalic;
                copiedRun.Underline = originalRun.Underline;
                copiedRun.FontFamily = originalRun.FontFamily;
                copiedRun.FontSize = originalRun.FontSize;
            }

            return copy;
        }

        protected string GetSourceFilePath(string strPropertyName, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = '{1}'", Options.Fields.PropertyName, strPropertyName);
            List<Options> options = m_commonDataManager.GetSelectManager().SelectOptions(Options.OptionTarget.SDMS, strCondition, null, out strErrorMessage);

            if (options == null)
                return null;

            foreach (Options option in options)
            {
                if (option.PropertyValue == null)
                    continue;

                return option.PropertyValue;
            }

            strErrorMessage = "보고서 양식이 지정되지 않았습니다.";
            return null;
        }

        protected void AddEmptyLine(XWPFDocument doc, int lineCount)
        {
            if (lineCount <= 0)
                return;

            string strText = null;

            for (int i = 0; i < lineCount; i++)
            {
                if (strText == null)
                    strText = "\n";
                else
                    strText += "\n";
            }

            XWPFParagraph emptyParagraph = doc.CreateParagraph();
            XWPFRun emptyRun = emptyParagraph.CreateRun();
            emptyRun.SetText(strText);
        }

        protected void CopyTable(XWPFTable sourceTable, XWPFDocument doc)
        {
            // 새 테이블 생성
            XWPFTable targetTable = doc.CreateTable();

            // 소스 테이블의 각 행을 반복
            foreach (XWPFTableRow sourceRow in sourceTable.Rows)
            {
                var targetRow = new XWPFTableRow(sourceRow.GetCTRow().Copy(), sourceTable);
                targetTable.AddRow(targetRow);
            }

            CopyTableBorders(sourceTable, targetTable);
            targetTable.GetCTTbl().RemoveTr(0);
            targetTable.Rows.RemoveAt(0);
        }

        protected void CopyRow(XWPFTable table, int sourceRowIndex, int count)
        {
            var row = table.GetRow(sourceRowIndex);
            var ctRow = row.GetCTRow();

            for (int i=0;i<count && i < 5;i++)
            {
                var copyRow = ctRow.Copy();
                var targetRow = new XWPFTableRow(copyRow, table);
                table.AddRow(targetRow);
            }
        }

        private void CopyTableBorders(XWPFTable source, XWPFTable target)
        {
            var sourceTblPr = source.GetCTTbl().tblPr;

            if (sourceTblPr == null)
                return;

            target.GetCTTbl().tblPr = sourceTblPr;
        }

        protected string GetAlarmDepthName(int alarmDepth)
        {
            if (alarmDepth <= 0 || alarmDepth > AlarmDepth.Length)
                return "";

            return AlarmDepth[alarmDepth - 1];
        }

        protected string GetAlarmLog(SensorReactionHistory reactionHistory)
        {
            string strLog = "";

            if (reactionHistory.Message != null && reactionHistory.Message.Trim().Length > 0)
                strLog = string.Format("[{0:00}:{1:00}:{2:00}] {3}", reactionHistory.Time.Hour, reactionHistory.Time.Minute, reactionHistory.Time.Second, reactionHistory.Message.Trim());
            else
                strLog = string.Format("[{0:00}:{1:00}:{2:00}] {3}", reactionHistory.Time.Hour, reactionHistory.Time.Minute, reactionHistory.Time.Second, GetReactionMessage((int)reactionHistory.ReactionType));

            return strLog;
        }

        protected string GetReactionMessage(int reactionType)
        {
            if (reactionType == (int)SensorReactionHistory.ReactionTypes.BEGIN_STATUS)
                return "상황 시작";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.RUN_BROADCAST)
                return "사내 방송 실시";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.SEND_SMS)
                return "문자메시지 발송";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.MALFUNCTION)
                return "오작동 처리";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.NOTIFY_SIGNAL)
                return "재난 신고";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.IGNORE_SIGNAL)
                return "재난 탐지신호 무시";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.RUN_SOP)
                return "SOP 발동";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.RUN_N_CANCEL_SOP)
                return "SOP 실행중 취소";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.FINISH_SOP)
                return "SOP 종료";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.IGNORE_SOP)
                return "SOP 실행 안함";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.END_STATUS)
                return "상황 종료";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.CHANGE_ALARM_DEPTH)
                return "알람단계 변경";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.USER_RESET)
                return "사용자 복구";
            else if (reactionType == (int)SensorReactionHistory.ReactionTypes.TIME_OUT)
                return "알람 유지시간 초과로 인한 자동 종료";

            return "";
        }
    }
}
