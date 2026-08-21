using System;
using System.Collections.Generic;
using NPOI.HPSF;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.IO;

namespace XmlToExcel.Excel
{
    using Data;
    using Data.Sensor;
    using Spatial;
    using Sensor;

    public class ExcelManager
    {
        public bool MakeFile(string strFilePath, ICollection<BuildingGroupData> buildingGroupDatas, List<FireSensor> fireSensors, List<PSMSensor> psmSensors, List<EtcSensor> etcSensors, List<CCTVSensor> cctvs, out string strErrorMessage, out string strExcelFileName)
        {
            strErrorMessage = null;
            strExcelFileName = GetFileName(strFilePath);

            try
            {
                HSSFWorkbook workbook = MakeWorkbook();

                if (workbook == null)
                    return false;

                List<SheetData> sheetDatas = MakeSheetDatas(buildingGroupDatas, fireSensors, psmSensors, etcSensors, cctvs, out strErrorMessage);

                WriteSheetDatas(workbook, sheetDatas);

                FileStream fs = new FileStream(strExcelFileName, FileMode.Create);

                using (BinaryWriter writer = new BinaryWriter(fs))
                {
                    workbook.Write(fs);
                    writer.Close();
                }
            }
            catch (Exception e)
            {
                strErrorMessage = e.Message;
                return false;
            }

            return true;
        }

        private string GetFileName(string strFilePath)
        {
            int index = strFilePath.LastIndexOf('.');
            string strExcelFileName = strFilePath.Substring(0, index + 1) + "xls";
            return strExcelFileName;
        }

        private HSSFWorkbook MakeWorkbook()
        {
            string strCompany = "유엔이";

            if (strCompany == null)
                strCompany = "";

            HSSFWorkbook hssfworkbook = new HSSFWorkbook();

            //create a entry of DocumentSummaryInformation
            DocumentSummaryInformation dsi = PropertySetFactory.CreateDocumentSummaryInformation();
            dsi.Company = strCompany;
            hssfworkbook.DocumentSummaryInformation = dsi;

            //create a entry of SummaryInformation
            SummaryInformation si = PropertySetFactory.CreateSummaryInformation();
            si.Subject = GetSubject();
            hssfworkbook.SummaryInformation = si;

            return hssfworkbook;
        }

        private string GetSubject()
        {
            return "공간 및 센서";
        }

        private List<SheetData> MakeSheetDatas(ICollection<BuildingGroupData> buildingGroupDatas, List<FireSensor> fireSensors, List<PSMSensor> psmSensors, List<EtcSensor> etcSensors, List<CCTVSensor> cctvs, out string strErrorMessage)
        {
            SpaceManager spaceManager = new SpaceManager();
            List<SheetData> sheetDatas = spaceManager.MakeSheetDatas(buildingGroupDatas, out strErrorMessage);

            if (sheetDatas == null)
                return null;

            SensorManager sensorManager = new SensorManager();
            return sensorManager.MakeSheetDatas(sheetDatas, fireSensors, psmSensors, etcSensors, cctvs, out strErrorMessage);
        }

        private void WriteSheetDatas(HSSFWorkbook workbook, ICollection<SheetData> sheetDatas)
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
    }
}
