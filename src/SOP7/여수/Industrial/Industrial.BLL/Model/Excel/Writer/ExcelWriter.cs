using NPOI.HPSF;
using Common.IDAL;
using System;
using System.Collections.Generic;
using System.Text;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.IO;
using NPOI.HSSF.Record;

namespace Industrial.BLL.Model.Excel.Writer
{
    public abstract class ExcelWriter
    {
        protected SensorServer.IDAL.IDataManager m_dataManager = null;
        protected SDMS.IDAL.IDataManager m_sdmsDataManager = null;

        public ExcelWriter(SensorServer.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataMAnager)
        {
            m_dataManager = dataManager;
            m_sdmsDataManager = sdmsDataMAnager;
        }

        public byte[] Run(out string strErrorMessage)
        {

            byte[] data = null;

            try
            {
                SheetData sheetData = ReadSheetDatas(out strErrorMessage);

                if (sheetData == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                HSSFWorkbook workbook = MakeWorkBook();

                if (workbook == null)
                    return null;

                WriteSheetData(workbook, sheetData);

                byte[] bytes = null;

                using (MemoryStream stream = new MemoryStream())
                {
                    workbook.Write(stream);
                    bytes = stream.ToArray();
                }

                workbook.Close();
                return bytes;

            } catch (Exception ex)
            {
                strErrorMessage = ex.Message;
            }

            return data;
        }

        private void WriteSheetData(HSSFWorkbook workbook, SheetData sheetData)
        {
            ISheet sheet = workbook.CreateSheet(sheetData.SheetName);

            if (sheet == null)
                return;

            IRow row = sheet.CreateRow(0);

            int min, max;

            if (GetMinMax(sheetData.Titles, out max, out min) == false)
            {
                return;
            }

            string strTitle;

            for (int i = min; i <= max; i++)
            {
                if (sheetData.Titles.TryGetValue(i, out strTitle))
                {
                    ICell cell = row.CreateCell(i);

                    if (cell != null && strTitle != null)
                    {
                        cell.SetCellValue(strTitle);
                    }
                }
            }

            List<string> values;
            // Key : Column Index
            Dictionary<int, IRow> dicColumnRows = new Dictionary<int, IRow>();

            for (int i = min; i <= max; i++)
            {
                if (sheetData.ColumnDatas.TryGetValue(i, out values))
                {
                    int nValueCount = values.Count;

                    for (int j = 0; j < nValueCount; j++)
                    {
                        if (dicColumnRows.TryGetValue(j, out row) == false)
                        {
                            row = sheet.CreateRow(j + 1);
                            dicColumnRows[j] = row;
                        }

                        string str = values[j];
                        ICell cell = row.CreateCell(i);

                        if (cell != null && str != null)
                            cell.SetCellValue(str);
                    }
                }
            }
        }

        private bool GetMinMax(Dictionary<int, string> dicTitles, out int max, out int min)
        {
            max = -1;
            min = 1;

            foreach (KeyValuePair<int, string> pair in dicTitles)
            {
                if (min > max)
                {
                    min = max = pair.Key;
                }
                else
                {
                    if (min > pair.Key)
                        min = pair.Key;

                    if (max < pair.Key)
                        max = pair.Key;
                }
            }

            return min <= max;
        }

        private HSSFWorkbook MakeWorkBook()
        {
            string strCompany = "여수산단";

            if (strCompany == null)
                strCompany = "";

            HSSFWorkbook hssfworkbook = new HSSFWorkbook();

            DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
            dsi.Company = strCompany;
            hssfworkbook.DocumentSummaryInformation = dsi;

            SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
            si.Subject = GetSubject();
            hssfworkbook.SummaryInformation = si;

            return hssfworkbook;

        }

        protected abstract SheetData ReadSheetDatas(out string strErrorMessage);

        protected abstract string GetSubject();

        public static ExcelWriter MakeInstance(DataMode mode, SensorServer.IDAL.IDataManager dataManager, SDMS.IDAL.IDataManager sdmsDataManager)
        {
            if (mode == DataMode.SensorInfo)
                return new SensorWriter(dataManager, sdmsDataManager);

            return null;
        }
    }
}
