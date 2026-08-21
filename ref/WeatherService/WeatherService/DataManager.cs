using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Drawing;

namespace WeatherService
{
    public class DataManager
    {
        private const string FileName = "data.txt";
        private const string All = "전체";
        private const string Delimeter = "/";

        private Dictionary<string, Point> m_dicLocationCoords = new Dictionary<string, Point>();
        private Dictionary<string, List<string>> m_dicFirst = new Dictionary<string, List<string>>();
        private Dictionary<string, List<string>> m_dicSecond = new Dictionary<string, List<string>>();

        public DataManager()
        {
            ReadFile(FileName);
        }

        private void ReadFile(string strFilePath)
        {
            int x, y;
            StreamReader reader = new StreamReader(strFilePath, Encoding.UTF8);

            List<string> secondList, thirdList;

            while (reader.EndOfStream == false)
            {
                string strLine = reader.ReadLine().Trim();

                if (strLine.Length == 0)
                    continue;

                string[] tokens = strLine.Split('\t');

                if (tokens.Length != 5)
                    continue;

                string strFirst = tokens[0].Trim();
                string strSecond = tokens[1].Trim();
                string strThird = tokens[2].Trim();

                if (strSecond.Length == 0)
                    strSecond = All;

                if (strThird.Length == 0)
                    strThird = All;

                string strX = tokens[3].Trim();
                string strY = tokens[4].Trim();

                if (int.TryParse(strX, out x) && int.TryParse(strY, out y))
                {
                    string strLocation = strFirst + Delimeter + strSecond + Delimeter + strThird;
                    m_dicLocationCoords[strLocation] = new Point(x, y);

                    if (m_dicFirst.TryGetValue(strFirst, out secondList) == false)
                    {
                        secondList = new List<string>();
                        m_dicFirst[strFirst] = secondList;
                    }

                    if (secondList.Contains(strSecond) == false)
                        secondList.Add(strSecond);

                    string strSecond2 = strFirst + Delimeter + strSecond;

                    if (m_dicSecond.TryGetValue(strSecond2, out thirdList) == false)
                    {
                        thirdList = new List<string>();
                        m_dicSecond[strSecond2] = thirdList;
                    }

                    if (thirdList.Contains(strThird) == false)
                        thirdList.Add(strThird);
                }
            }

            reader.Close();
        }

        public List<string> GetFirstList()
        {
            List<string> firstList = new List<string>();
            firstList.AddRange(m_dicFirst.Keys);
            firstList.Sort(CompareForSort);
            return firstList;
        }

        public List<string> GetSecondList(string strFirst)
        {
            List<string> secondList;

            if (m_dicFirst.TryGetValue(strFirst, out secondList))
            {
                secondList.Sort(CompareForSort);
                return secondList;
            }

            return new List<string>();
        }

        public List<string> GetThirdList(string strFirst, string strSecond)
        {
            List<string> thirdList;

            if (m_dicSecond.TryGetValue(strFirst + Delimeter + strSecond, out thirdList))
            {
                thirdList.Sort(CompareForSort);
                return thirdList;
            }

            return new List<string>();
        }

        public bool GetCoord(string strFirst, string strSecond, string strThird, out int x, out int y)
        {
            x = y = 0;
            Point pt;

            if (m_dicLocationCoords.TryGetValue(strFirst + Delimeter + strSecond + Delimeter + strThird, out pt))
            {
                x = pt.X;
                y = pt.Y;
                return true;
            }

            return false;
        }

        private static int CompareForSort(string str1, string str2)
        {
            if (str1 == All)
                return -1;
            else if (str2 == All)
                return 1;

            return string.Compare(str1, str2);
        }
    }
}
