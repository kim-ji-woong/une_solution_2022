using System;
using System.Collections.Generic;
using VDS.IDAL;
using System.IO;
using ExcelDataReader;

namespace VDS.BLL.Excel.Reader
{
    using Excel.Writer;

    public abstract class ExcelReader
    {
        private string m_strFilePath = null;
        protected IDataManager m_dataManager = null;

        public ExcelReader(string strFilePath, IDataManager dataManager)
        {
            m_strFilePath = strFilePath;
            m_dataManager = dataManager;
        }

        public bool Run(out string strErrorMessage)
        {
            if (m_strFilePath == null)
            {
                strErrorMessage = "파일경로가 유효하지 않습니다.";
                return false;
            }

            try
            {
                List<SheetData> sheetDatas = new List<SheetData>();
                
                using (var stream = File.Open(m_strFilePath, FileMode.Open, FileAccess.Read))
                {
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        do
                        {
                            SheetData sheet = new SheetData(reader.Name);
                            sheetDatas.Add(sheet);

                            bool firstLine = true;
                            List<string> columnDatas = null;

                            while (reader.Read())
                            {
                                int nFieldCount = reader.FieldCount;

                                for (int i = 0; i < nFieldCount; i++)
                                {
                                    object value = reader.GetValue(i);

                                    if (value == null)
                                    {
                                        if (firstLine)
                                            sheet.Titles[i] = null;
                                        else
                                        {
                                            if (sheet.ColumnDatas.TryGetValue(i, out columnDatas) == false)
                                            {
                                                columnDatas = new List<string>();
                                                sheet.ColumnDatas[i] = columnDatas;
                                            }

                                            columnDatas.Add(null);
                                        }
                                    }
                                    else
                                    {
                                        if (firstLine)
                                            sheet.Titles[i] = value.ToString();
                                        else
                                        {
                                            if (sheet.ColumnDatas.TryGetValue(i, out columnDatas) == false)
                                            {
                                                columnDatas = new List<string>();
                                                sheet.ColumnDatas[i] = columnDatas;
                                            }

                                            columnDatas.Add(value.ToString());
                                        }
                                    }
                                }

                                firstLine = false;
                            }
                        }
                        while (reader.NextResult());
                    }
                }

                return UpdateData(sheetDatas, out strErrorMessage);
            }
            catch (System.Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
                strErrorMessage = e.Message;
            }

            return false;
        }

        protected int[] GetColumnCounts(SheetData sheetData, int min, int max, out int maxColumnCount)
        {
            maxColumnCount = 0;

            foreach (KeyValuePair<int, List<string>> pair in sheetData.ColumnDatas)
            {
                int nColumnCount = pair.Value.Count;

                if (maxColumnCount < nColumnCount)
                    maxColumnCount = nColumnCount;
            }

            if (min > max)
                return null;

            List<string> datas;
            int[] arrColumnCount = new int[max - min + 1];

            for (int i = min; i <= max; i++)
            {
                if (sheetData.ColumnDatas.TryGetValue(i, out datas))
                    arrColumnCount[i - min] = datas.Count;
                else
                    arrColumnCount[i - min] = 0;
            }

            return arrColumnCount;
        }

        protected abstract bool UpdateData(List<SheetData> sheetDatas, out string strErrorMessage);

        public static ExcelReader MakeInstance(ExcelWriter.Mode mode, string strFilePath, IDataManager dataManager, object parameter = null)
        {
            if (mode == ExcelWriter.Mode.ITProperty)
            {
                if (parameter != null && parameter is int)
                return new ITPropertyReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_Box)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailBoxReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_Network)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailNetworkReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_Backup)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailBackupReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_Security)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailSecurityReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_Storage)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailStorageReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_Etc)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailEtcReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_SanSwitch)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailSanSwitchReader(strFilePath, dataManager, (int)parameter);
            }
            else if (mode == ExcelWriter.Mode.ITPropertyDetail_Server)
            {
                if (parameter != null && parameter is int)
                    return new ITPropertyDetailServerReader(strFilePath, dataManager, (int)parameter);
            }

            return null;
        }

        protected string GetString(string strData)
        {
            if (strData == null)
                return null;

            return strData.Trim();
        }

        protected DateTime? GetDateTime(string strData, out bool success)
        {
            success = true;

            if (strData == null || strData.Trim().Length == 0)
                return null;

            int year = 0, month = 0, day = 0, hour = 0, min = 0, sec = 0;
            int len = strData.Length;

            int index1 = strData.IndexOf('-');

            if (index1 < 0)
            {
                success = false;
                return null;
            }

            int index2 = strData.IndexOf('-', index1 + 1);

            if (index2 < index1)
            {
                success = false;
                return null;
            }

            string strYear = strData.Substring(0, index1).Trim();
            string strMonth = strData.Substring(index1 + 1, index2 - index1 - 1).Trim();
            string strDay = "";

            int nextIndex = index2 + 3;

            for (int i = index2 + 1; i < index2 + 3; i++)
            {
                char c = strData[i];

                if (c >= '0' && c <= '9')
                    strDay += c;
                else
                    break;
            }

            if (int.TryParse(strYear, out year) == false || int.TryParse(strMonth, out month) == false || int.TryParse(strDay, out day) == false)
            {
                success = false;
                return null;
            }

            int index3 = strData.IndexOf(':');

            if (index3 > 0)
            {
                int index4 = strData.IndexOf(':', index3 + 1);

                if (index4 > index3)
                {
                    int beginIndex = -1;

                    for (int i = nextIndex; i < index3; i++)
                    {
                        char c = strData[i];

                        if (c >= '0' && c <= '9')
                        {
                            beginIndex = i;
                            break;
                        }
                    }

                    if (beginIndex > 0)
                    {
                        string strHour = strData.Substring(beginIndex, index3 - beginIndex).Trim();
                        string strMin = strData.Substring(index3 + 1, index4 - index3 - 1).Trim();
                        string strSec = "";

                        for (int i = index4 + 1; i < index4 + 3; i++)
                        {
                            char c = strData[i];

                            if (c >= '0' && c <= '9')
                                strSec += c;
                            else
                                break;
                        }

                        if (int.TryParse(strHour, out hour) == false || int.TryParse(strMin, out min) == false || int.TryParse(strSec, out sec) == false)
                            return null;

                        if (strData.Contains("오후") || strData.Contains("PM"))
                        {
                            if (hour < 12)
                                hour += 12;
                        }
                        else if (strData.Contains("오전") || strData.Contains("AM"))
                        {
                            if (hour == 12)
                                hour = 0;
                        }
                    }
                }
            }

            return new DateTime(year, month, day, hour, min, sec);
        }

        protected bool? GetBoolean(string strData, out bool success)
        {
            success = true;

            if (strData == null)
                return null;

            string str = strData.ToLower().Trim();

            if (str == "true")
                return true;
            else if (str == "false")
                return false;
            else if (str.Length == 0)
                return null;

            success = false;
            return null;
        }

        protected int? GetInt(string strData, out bool success)
        {
            success = true;

            if (strData == null || strData.Trim().Length == 0)
                return null;

            int data;

            if (int.TryParse(strData.Trim(), out data))
                return data;

            success = false;
            return null;
        }

        protected string GetCellName(int col, int row)
        {
            string strCell = "";

            if (col >= 26)
            {
                int num1 = col / 26;
                int num2 = col % 26;

                strCell = GetAlphabet(num1 - 1) + GetAlphabet(num2);
            }
            else
                strCell = GetAlphabet(col);

            return strCell + (row + 2).ToString();
        }

        private string GetAlphabet(int num)
        {
            return ((char)('A' + num)).ToString();
        }
    }
}
