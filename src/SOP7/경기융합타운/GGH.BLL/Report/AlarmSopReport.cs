using System;
using System.IO;
using System.Collections.Generic;
using SDMS.IDAL;
using SDMS.Model.History;
using NPOI.XWPF.UserModel;

namespace GGH.BLL.Report
{
    using Models.Response;
    using Models.Alarm;

    class AlarmSopReport : WordReport
    {
        private const string PropertyName = "Report_AlarmSOP_Path";
        private const string AlarmImage_PropertyName = "Report_AlarmImage_Path";

        public AlarmSopReport(IDataManager dataManager, Common.IDAL.IDataManager commonDataManager)
            : base(dataManager, commonDataManager)
        {
        }

        public ResponseWordInfo MakeReport(Dictionary<int, AlarmData> dicAlarms)
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

            foreach (KeyValuePair<int, AlarmData> pair in dicAlarms)
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

            foreach (KeyValuePair<int, AlarmData> pair in dicAlarms)
            {
                if (index < tableCount)
                {
                    XWPFTable table = doc.Tables[index++];
                    SetTable(table, pair.Value);
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
            response.FileName = "AlarmReport.docx";

            return response;
        }

        private void SetTable(XWPFTable table, AlarmData alarmData)
        {
            SetAlarmTimeNDepth(table, alarmData);
            SetSensorInfo(table, alarmData);
            SetAlarmLog(table, alarmData);
            SetAlarmImage(table, alarmData);

            if (alarmData.ActionStepHistory != null)
            {
                SopReport sopReport = new SopReport(m_dataManager, m_commonDataManager);

                string strErrorMessage;
                sopReport.SetSopHistory(table, alarmData, 5, out strErrorMessage);
            }
            else
            {
                for (int i = 8; i >= 5; i--)
                {
                    table.GetCTTbl().RemoveTr(i);
                    table.Rows.RemoveAt(i);
                }
            }
        }

        private void SetAlarmImage(XWPFTable table, AlarmData alarmData)
        {
            if (alarmData.SensorTypeEngName == null || alarmData.SensorTypeEngName.Length == 0)
                return;

            var row = table.GetRow(4);
            var cellImage = row.GetCell(1);

            string strErrorMessage;
            string strFolderPath = GetSourceFilePath(AlarmImage_PropertyName, out strErrorMessage);

            if (strFolderPath == null || strFolderPath.Length == 0)
                return;

            string strTag = alarmData.SiteID.ToString() + "/" + alarmData.ZoneID.ToString() + "/" + alarmData.SensorTypeEngName + "/" + alarmData.SensorZoneID.ToString() + ".png";
            string strFilePath = strFolderPath.EndsWith("/") ? strFolderPath + strTag : strFolderPath + "/" + strTag;

            if (File.Exists(strFilePath))
            {
                byte[] imageBytes = File.ReadAllBytes(strFilePath);

                int width = 400 * 9525;
                int height = 200 * 9525;

                XWPFRun run = cellImage.Paragraphs[0].CreateRun();
                run.AddPicture(new MemoryStream(imageBytes), (int)PictureType.PNG, "alarmSensor", width, height);
            }
        }

        private void SetAlarmLog(XWPFTable table, AlarmData alarmData)
        {
            var row = table.GetRow(3);
            var cellAlarmLog = row.GetCell(1);

            bool isFirst = true;

            foreach (var reactionHistory in alarmData.SensorReactionHistories)
            {
                if (isFirst)
                {
                    isFirst = false;
                    cellAlarmLog.Paragraphs[0].CreateRun().SetText(GetAlarmLog(reactionHistory));
                }
                else
                {
                    CopyParagraph(cellAlarmLog.Paragraphs[0], cellAlarmLog).Runs[0].SetText(GetAlarmLog(reactionHistory));
                }
            }
        }

        private void SetSensorInfo(XWPFTable table, AlarmData alarmData)
        {
            var row = table.GetRow(2);

            var cellSensorName = row.GetCell(1);
            cellSensorName.SetText(alarmData.SensorName);

            var cellSensorType = row.GetCell(3);
            cellSensorType.SetText(alarmData.SensorTypeName);

            var cellLocation = row.GetCell(5);
            cellLocation.SetText(alarmData.Location);
        }

        private void SetAlarmTimeNDepth(XWPFTable table, AlarmData alarmData)
        {
            var row = table.GetRow(1);

            var cellBeginTime = row.GetCell(1);
            cellBeginTime.Paragraphs[0].CreateRun().SetText(GetDate(alarmData.BeginTime));
            CopyParagraph(cellBeginTime.Paragraphs[0], cellBeginTime).Runs[0].SetText(GetTime(alarmData.BeginTime));

            if (alarmData.EndTime != null)
            {
                var cellEndTime = row.GetCell(3);
                cellEndTime.Paragraphs[0].CreateRun().SetText(GetDate((DateTime)alarmData.EndTime));
                CopyParagraph(cellEndTime.Paragraphs[0], cellEndTime).Runs[0].SetText(GetTime((DateTime)alarmData.EndTime));
            }

            var cellAlarmDepth = row.GetCell(5);
            cellAlarmDepth.SetText(GetAlarmDepthName(alarmData.AlarmDepth));
        }
    }
}
