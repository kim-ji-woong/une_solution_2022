using System.Collections.Generic;

namespace VDS.BLL.Excel
{
    public class SheetData
    {
        private string m_strSheetName = "";
        // 첫번째 행의 데이터들
        // Key : ColumnIndex
        private Dictionary<int, string> m_dicTitles = new Dictionary<int, string>();
        // Key : ColumnIndex
        private Dictionary<int, List<string>> m_dicColumnDatas = new Dictionary<int, List<string>>();
        private object m_tag = null;

        public string SheetName
        {
            get { return m_strSheetName; }
            set { m_strSheetName = value; }
        }

        // 첫번째 행의 데이터들
        // Key : ColumnIndex
        public Dictionary<int, string> Titles
        {
            get { return m_dicTitles; }
        }

        // Key : ColumnIndex
        public Dictionary<int, List<string>> ColumnDatas
        {
            get { return m_dicColumnDatas; }
        }

        public object Tag
        {
            get { return m_tag; }
            set { m_tag = value; }
        }

        public SheetData(string strSheetName)
        {
            m_strSheetName = strSheetName;
        }
    }
}
