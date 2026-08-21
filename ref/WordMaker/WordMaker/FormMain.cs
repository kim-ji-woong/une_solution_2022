using System;
using System.Windows.Forms;
using System.IO;
using NPOI.XWPF.UserModel;
using NPOI.OpenXml4Net.OPC;
using NPOI.OpenXmlFormats.Wordprocessing;

namespace WordMaker
{
    public partial class FormMain : Form
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            string strSrcFilePath = @"D:\Project\SOP\경기융합타운\신규 보고서\alarm_no_sop.docx";
            string strTrgFilePath = @"D:\Project\SOP\경기융합타운\신규 보고서\alarm_no_sop_result.docx";

            XWPFDocument doc = new XWPFDocument(new FileStream(strSrcFilePath, FileMode.Open, FileAccess.Read, FileShare.Read));

            foreach (var table in doc.Tables)
            {
                var row = table.GetRow(1);

                var cell = row.GetCell(1);
                //XWPFParagraph paragraph2 = CopyParagraph(cell.Paragraphs[0], doc);
                cell.Paragraphs[0].CreateRun().SetText(GetDate(DateTime.Now.AddMinutes(-1)));
                CopyParagraph(cell.Paragraphs[0], cell).Runs[0].SetText(GetTime(DateTime.Now.AddMinutes(-1)));
                //cell.AddParagraph().CreateRun().SetText(GetTime(DateTime.Now.AddMinutes(-1)));

                var cell2 = row.GetCell(3);
                cell2.Paragraphs[0].CreateRun().SetText(GetDate(DateTime.Now.AddMinutes(-1)));
                CopyParagraph(cell2.Paragraphs[0], cell2).Runs[0].SetText(GetTime(DateTime.Now.AddMinutes(-1)));

                var cell3 = row.GetCell(5);
                cell3.SetText("경계");
            }

            using (var fs = new FileStream(strTrgFilePath, FileMode.Create, FileAccess.Write))
            {
                doc.Write(fs);
            }
        }

        private string GetDate(DateTime time)
        {
            string str = string.Format("{0}-{1:00}-{2:00}", time.Year, time.Month, time.Day);
            return str;
        }

        private string GetTime(DateTime time)
        {
            string str = string.Format("{0:00}:{1:00}:{2:00}", time.Hour, time.Minute, time.Second);
            return str;
        }

        // XWPFParagraph 객체 복사 메서드
        private XWPFParagraph CopyParagraph(XWPFParagraph original, XWPFTableCell cell)
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

        protected void CopyTable(XWPFTable sourceTable, XWPFDocument doc)
        {
            // 새 테이블 생성
            XWPFTable newTable = doc.CreateTable();

            // 소스 테이블의 각 행을 반복
            foreach (XWPFTableRow sourceRow in sourceTable.Rows)
            {
                // 새 테이블에 행 추가
                XWPFTableRow newRow = newTable.CreateRow();

                // 소스 행의 각 셀을 반복하여 새 행에 셀 추가
                for (int i = 0; i < sourceRow.GetTableCells().Count; i++)
                {
                    XWPFTableCell sourceCell = sourceRow.GetCell(i);
                    XWPFTableCell newCell = newRow.CreateCell();

                    CopyParagraph(sourceCell.Paragraphs[0], newCell).Runs[0].SetText(sourceCell.GetText());
                }
            }
        }
    }
}
