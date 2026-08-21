using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.Collections.Generic;
using System.IO;
using VDS.IDAL;
using VDS.Model;

namespace VDS.BLL.Excel.Writer
{
    public abstract class ExcelWriter
    {
        public enum Mode { None, ITProperty, Rack, ITPropertyDetail_Network, ITPropertyDetail_Security, ITPropertyDetail_Backup, ITPropertyDetail_Server, ITPropertyDetail_Storage, ITPropertyDetail_Box, ITPropertyDetail_SanSwitch, ITPropertyDetail_Etc };

        protected IDataManager m_dataManager = null;

        public ExcelWriter(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public byte[] Run(out string strErrorMessage)
        {
            try
            {
                ICollection<SheetData> sheetDatas = ReadSheetDatas(out strErrorMessage);

                if (sheetDatas == null)
                {
                    System.Diagnostics.Trace.WriteLine(strErrorMessage);
                    return null;
                }

                HSSFWorkbook workbook = MakeWorkbook();

                if (workbook == null)
                    return null;

                WriteSheetDatas(workbook, sheetDatas);

                byte[] bytes = null;

                using (MemoryStream stream = new MemoryStream())
                {
                    workbook.Write(stream);
                    bytes = stream.ToArray();
                }

                workbook.Close();
                return bytes;
            }
            catch (System.Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
                strErrorMessage = e.Message;
            }

            return null;
        }

        protected virtual void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas)
        {
            foreach (SheetData sheetData in sheetDatas)
            {
                ISheet sheet = workbook.CreateSheet(sheetData.SheetName);

                if (sheet == null)
                    return;

                IRow row = sheet.CreateRow(0);

                int min, max;

                if (GetMinMax(sheetData.Titles, out max, out min) == false)
                    continue;

                string strTitle;

                for (int i = min; i <= max; i++)
                {
                    if (sheetData.Titles.TryGetValue(i, out strTitle))
                    {
                        ICell cell = row.CreateCell(i);

                        if (cell != null && strTitle != null)
                            cell.SetCellValue(strTitle);
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
        }

        protected bool GetMinMax(Dictionary<int, string> dicTitles, out int max, out int min)
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

        private HSSFWorkbook MakeWorkbook()
        {
            string strCompany = "유엔이";

            if (strCompany == null)
                strCompany = "";

            HSSFWorkbook hssfworkbook = new HSSFWorkbook(/*stream*/);

            DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
            dsi.Company = strCompany;
            hssfworkbook.DocumentSummaryInformation = dsi;

            //create a entry of SummaryInformation
            SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
            si.Subject = GetSubject();
            hssfworkbook.SummaryInformation = si;

            return hssfworkbook;
        }

        protected abstract ICollection<SheetData> ReadSheetDatas(out string strErrorMessage);
        protected abstract string GetSubject();

        public static ExcelWriter MakeInstance(Mode mode, IDataManager dataManager, object parameter = null)
        {
            if (mode == Mode.ITProperty)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyWriter(dataManager, (int)parameter);
            }
            else if (mode == Mode.Rack)
            {
                if (parameter != null && parameter is int)
                    return new RackWriter(dataManager, (int)parameter);
            }

            return null;
        }
    }
}
