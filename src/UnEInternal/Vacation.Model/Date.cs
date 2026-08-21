using System;
using System.Collections.Generic;

namespace Vacation.Model
{
    public class Date : IComparable
    {
        // Normal : 하루 휴가
        // AM : 오전 반차
        // PM : 오후 반차
        public enum DateType { Normal = 1, AM, PM }

        private int m_nYear = -1;
        private int m_nMonth = -1;
        private int m_nDay = -1;
        private DateType m_type = DateType.Normal;

        public int Year
        {
            get { return m_nYear; }
            set { m_nYear = value; }
        }

        public int Month
        {
            get { return m_nMonth; }
            set { m_nMonth = value; }
        }

        public int Day
        {
            get { return m_nDay; }
            set { m_nDay = value; }
        }

        public DateType Type
        {
            get { return m_type; }
            set { m_type = value; }
        }

        public Date()
        {
        }

        public Date(Date date)
        {
            this.m_nYear = date.m_nYear;
            this.m_nMonth = date.m_nMonth;
            this.m_nDay = date.m_nDay;
            this.m_type = date.m_type;
        }

        public static string DateListToString(List<Date> dates)
        {
            string strDateList = "";

            foreach (Date date in dates)
            {
                string strDate = string.Format("{0}{1:00}", date.Month, date.Day);

                if (date.Type == Date.DateType.AM || date.Type == DateType.PM)
                    strDate += ":" + ((int)date.Type).ToString();

                if (strDateList.Length == 0)
                    strDateList = strDate;
                else
                    strDateList += " " + strDate;
            }

            return strDateList;
        }

        public static List<Date> StringToDateList(string strDates, int year)
        {
            List<Date> dates = new List<Date>();
            string[] tokens = strDates.Trim().Split(' ');

            int month, day;
            int prev = 0;

            foreach (string strToken in tokens)
            {
                if (strToken.Length == 0)
                    continue;

                string strDate = strToken;
                DateType type = DateType.Normal;

                int nIndex = strToken.LastIndexOf(':');

                if (nIndex > 0)
                {
                    string strType = strToken.Substring(nIndex + 1).Trim();

                    if (strType == ((int)DateType.AM).ToString())
                        type = DateType.AM;
                    else if (strType == ((int)DateType.PM).ToString())
                        type = DateType.PM;
                    else if (strType == ((int)DateType.Normal).ToString())
                        type = DateType.Normal;

                    strDate = strToken.Substring(0, nIndex).Trim();
                }

                string strDay = strDate.Substring(strDate.Length - 2);
                string strMonth = strDate.Substring(0, strDate.Length - 2);

                if (int.TryParse(strMonth, out month) == false ||
                    int.TryParse(strDay, out day) == false)
                    continue;

                Date date = new Date();
                date.Year = year;
                date.Month = month;
                date.Day = day;
                date.Type = type;

                int dateNumber = year * 10000 + month * 100 + day;

                if (dateNumber < prev)
                {
                    year++;
                    date.Year = year;
                    prev = year * 10000 + month * 100 + day;
                }
                else
                    prev = dateNumber;

                dates.Add(date);
            }

            return dates;
        }

        public int CompareTo(object obj)
        {
            if (obj == null)
                return 0;

            if (obj is Date)
            {
                Date date1 = this;
                Date date2 = (Date)obj;

                if (date1.Year < date2.Year)
                    return -1;
                else if (date1.Year > date2.Year)
                    return 1;
                else
                {
                    if (date1.Month < date2.Month)
                        return -1;
                    else if (date1.Month > date2.Month)
                        return 1;
                    else
                    {
                        if (date1.Day < date2.Day)
                            return -1;
                        else if (date1.Day > date2.Day)
                            return 1;
                        else
                        {
                            if (date1.Type == DateType.Normal)
                            {
                                if (date2.Type == DateType.AM || date2.Type == DateType.PM)
                                    return 1;
                            }
                            else if (date1.Type == DateType.AM)
                            {
                                if (date2.Type != DateType.AM)
                                    return -1;
                            }
                            else// if (date1.Type == DateType.PM)
                            {
                                if (date2.Type == DateType.AM)
                                    return 1;
                                else if (date2.Type == DateType.Normal)
                                    return -1;
                            }
                        }
                    }
                }
            }

            return 0;
        }
    }
}
