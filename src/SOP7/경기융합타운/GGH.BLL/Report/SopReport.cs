using System;
using System.IO;
using System.Collections.Generic;
using SDMS.IDAL;
using SDMS.Model.History;
using NPOI.XWPF.UserModel;
using History.IBLL.Models.Response;

namespace GGH.BLL.Report
{
    using Models.Alarm;
    using Models.Response;

    class SopReport : WordReport
    {
        private const string PropertyName = "Report_SOP_Path";

        public SopReport(IDataManager dataManager, Common.IDAL.IDataManager commonDataManager)
            : base(dataManager, commonDataManager)
        {
        }

        public ResponseWordInfo MakeReport(Dictionary<int, AlarmData> dicActionStepAlarmData)
        {
            string strErrorMessage;
            string strSrcFilePath = GetSourceFilePath(PropertyName, out strErrorMessage);

            if (strSrcFilePath == null)
                return new ResponseWordInfo(false, strErrorMessage);

            XWPFDocument doc = new XWPFDocument(new FileStream(strSrcFilePath, FileMode.Open, FileAccess.Read, FileShare.Read));

            if (doc.Tables.Count == 0)
                return new ResponseWordInfo(false, "잘못된 양식 파일입니다.");

            bool isFirst = true;
            XWPFTable firstTable = doc.Tables[0];

            foreach (KeyValuePair<int, AlarmData> pair in dicActionStepAlarmData)
            {
                if (isFirst)
                {
                    isFirst = false;
                    continue;
                }

                AddEmptyLine(doc, 3);
                CopyTable(firstTable, doc);
            }

            int index = 0;
            int tableCount = doc.Tables.Count;

            foreach (KeyValuePair<int, AlarmData> pair in dicActionStepAlarmData)
            {
                if (index < tableCount)
                {
                    XWPFTable table = doc.Tables[index++];
                    SetSopHistory(table, pair.Value, 0, out strErrorMessage);
                }
            }

            byte[] bytes = null;

            using (MemoryStream stream = new MemoryStream())
            {
                doc.Write(stream);
                bytes = stream.ToArray();
            }

            doc.Close();

            ResponseWordInfo response = new ResponseWordInfo(true, "");
            response.Bytes = bytes;
            response.FileName = "SopReport.docx";

            return response;
        }

        public bool SetSopHistory(XWPFTable table, AlarmData alarmData, int beginRowIndex, out string strErrorMessage)
        {
            strErrorMessage = null;
            SetBasicInfo(table, alarmData, beginRowIndex);

            if (alarmData.SopComponentHistoryDatas != null)
            {
                int index = 3;
                int no = 1;

                int nComponentHistoryDataCount = alarmData.SopComponentHistoryDatas.Count;
                CopyRow(table, beginRowIndex + index, nComponentHistoryDataCount - 1);

                foreach (var componentHistoryData in alarmData.SopComponentHistoryDatas)
                {
                    SetComponentHistoryData(table, componentHistoryData, beginRowIndex + index++, no++);

                    if (index >= 8)
                        break;
                }
            }

            return true;
        }

        private void SetComponentHistoryData(XWPFTable table, SopHistoryComponentData componentHistoryData, int rowIndex, int no)
        {
            var row = table.GetRow(rowIndex);

            var cellNo = row.GetCell(1);
            cellNo.SetText(no.ToString());

            var cellSectionName = row.GetCell(2);
            cellSectionName.SetText(componentHistoryData.SectionName);

            var cellTeamList = row.GetCell(3);
            cellTeamList.SetText(GetTeamList(componentHistoryData));

            var cellTime = row.GetCell(4);
            cellTime.SetText(componentHistoryData.Time);

            var cellStatus = row.GetCell(5);
            cellStatus.SetText(componentHistoryData.strStatus);
        }

        private string GetTeamList(SopHistoryComponentData componentHistoryData)
        {
            if (componentHistoryData.TeamList == null)
                return "";

            string strTeamList = null;

            foreach (string strTeamName in componentHistoryData.TeamList)
            {
                if (strTeamList == null)
                    strTeamList = strTeamName;
                else
                    strTeamList += ", " + strTeamName;
            }

            return strTeamList;
        }

        private void SetBasicInfo(XWPFTable table, AlarmData alarmData, int beginRowIndex)
        {
            if (alarmData.ActionStepHistory == null)
                return;

            var row = table.GetRow(beginRowIndex + 1);

            if (alarmData.SopName != null)
            {
                var cellSopName = row.GetCell(1);
                cellSopName.SetText(alarmData.SopName);
            }

            var cellSopBeginTime = row.GetCell(3);
            cellSopBeginTime.Paragraphs[0].CreateRun().SetText(GetDate(alarmData.ActionStepHistory.BeginTime));
            CopyParagraph(cellSopBeginTime.Paragraphs[0], cellSopBeginTime).Runs[0].SetText(GetTime(alarmData.ActionStepHistory.BeginTime));

            if (alarmData.ActionStepHistory.EndTime != null)
            {
                var cellSopEndTime = row.GetCell(5);
                cellSopEndTime.Paragraphs[0].CreateRun().SetText(GetDate((DateTime)alarmData.ActionStepHistory.EndTime));
                CopyParagraph(cellSopEndTime.Paragraphs[0], cellSopEndTime).Runs[0].SetText(GetTime((DateTime)alarmData.ActionStepHistory.EndTime));
            }

            var cellActionStepName = row.GetCell(7);
            cellActionStepName.SetText(alarmData.ActionStepName);
        }
    }
}
