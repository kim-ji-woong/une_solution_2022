using dnsDapperDBUtil.DataAccessLayer.DAL;
using System.Collections.Generic;
using System;

namespace EarthquakeSimulator.Data
{
    using Data;

    class DBManager
    {
        private DataManager m_dataManager = null;
        private string m_strDbHost = null;
        private int m_nYear = 0, m_nMonth = 0, m_nDay = 0, m_nHour = 0, m_nMin = 0;
        private double m_dGal = 0;
        private int m_nIntensity = 0;

        public void SetData(string strDbHost, string strGal)
        {
            double gal;

            if (double.TryParse(strGal.Trim(), out gal) && gal >= 0)
            {
                int intensity = GetIntensity(gal);

                m_dGal = gal;
                m_nIntensity = intensity;

                m_dataManager = new DataManager(0, strDbHost, "WSOP_40", "sa", "9449966Ab");
                m_strDbHost = strDbHost;
            }
        }

        private static int GetIntensity(double gal)
        {
            if (gal < 0.6867)
                return 1;
            else if (gal >= 0.6867 && gal < 2.2563)
                return 2;
            else if (gal >= 2.2563 && gal < 7.4556)
                return 3;
            else if (gal >= 7.4556 && gal < 25.1136)
                return 4;
            else if (gal >= 25.1136 && gal < 67.2966)
                return 5;
            else if (gal >= 67.2966 && gal < 144.5013)
                return 6;
            else if (gal >= 144.5013 && gal < 310.5846)
                return 7;
            else if (gal >= 310.5846 && gal < 667.1781)
                return 8;
            else if (gal >= 667.1781 && gal < 1433.6334)
                return 9;
            else if (gal >= 1433.6334 && gal < 3080.34)
                return 10;
            //else if (gal >= 3080.34)
            return 11;
        }

        public bool WriteData()
        {
            if (m_dataManager == null)
                return false;

            int year, month, day, hour, min;

            if (GetCurrentTime(out year, out month, out day, out hour, out min))
            {
                if (IsChangedTime(year, month, day, hour, min))
                    return InsertData(year, month, day, hour, min);
                else
                    return UpdateData(year, month, day, hour, min);
            }

            return false;
        }

        private bool UpdateData(int year, int month, int day, int hour, int min)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = '{1}-{2:00}-{3:00} {4:00}:{5:00}:00'", Earthquake.Fields.TimeStamp, year, month, day, hour, min);
            IEnumerable<Earthquake> earthquakes = m_dataManager.GetSelect().Select<Earthquake>(strCondition, out strErrorMessage);

            if (earthquakes == null)
            {
                System.Diagnostics.Trace.WriteLine("ReadEarthQuake Error : " + strErrorMessage);
                return false;
            }

            foreach (Earthquake earthquake in earthquakes)
            {
                if (m_dGal > earthquake.Gal)
                {
                    Dictionary<Earthquake.Fields, object> dicSets = new Dictionary<Earthquake.Fields, object>();

                    dicSets[Earthquake.Fields.Hpga] = m_dGal;
                    dicSets[Earthquake.Fields.Tpga] = m_dGal;
                    dicSets[Earthquake.Fields.Gal] = m_dGal;
                    dicSets[Earthquake.Fields.Intensity] = m_nIntensity;

                    if (m_dataManager.GetUpdate().Update<Earthquake, Earthquake.Fields>(dicSets, strCondition, out strErrorMessage))
                        SetTime(year, month, day, hour, min);
                    else
                    {
                        System.Diagnostics.Trace.WriteLine("UpdateEarthQuake Error : " + strErrorMessage);
                        return false;
                    }
                }
                
                break;
            }

            return true;
        }

        private void SetTime(int year, int month, int day, int hour, int min)
        {
            m_nYear = year;
            m_nMonth = month;
            m_nDay = day;
            m_nHour = hour;
            m_nMin = min;
        }

        private bool InsertData(int year, int month, int day, int hour, int min)
        {
            Earthquake earthquake = new Earthquake();
            earthquake.TimeStamp = new DateTime(year, month, day, hour, min, 0);
            earthquake.Hpga = m_dGal;
            earthquake.Tpga = m_dGal;
            earthquake.Gal = m_dGal;
            earthquake.Intensity = m_nIntensity;

            string strErrorMessage;
            bool result = m_dataManager.GetCreate().Insert<Earthquake>(earthquake, out strErrorMessage);

            if (result == false)
            {
                if (strErrorMessage != null)
                    System.Diagnostics.Trace.WriteLine("InsertData Error : " + strErrorMessage);
                else
                    System.Diagnostics.Trace.WriteLine("InsertData 실패");
            }
            else
                SetTime(year, month, day, hour, min);

            return result;
        }

        private bool IsChangedTime(int year, int month, int day, int hour, int min)
        {
            if (m_nYear != year || m_nMonth != month || m_nDay != day ||
                m_nHour != hour || m_nMin != min)
                return true;

            return false;
        }

        private bool GetCurrentTime(out int year, out int month, out int day, out int hour, out int min)
        {
            year = month = day = hour = min = 0;

            string strErrorMessage;
            string strSQL = "Select GetDate()";
            IEnumerable<dynamic> times = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);

            if (times == null)
            {
                System.Diagnostics.Trace.WriteLine("GetCurrentTime Error : " + strErrorMessage);
                return false;
            }

            foreach (var item in times)
            {
                var data = item as IDictionary<string, object>;

                foreach (KeyValuePair<string, object> pair in data)
                {
                    DateTime time;

                    if (DateTime.TryParse(pair.Value.ToString().Trim(), out time))
                    {
                        year = time.Year;
                        month = time.Month;
                        day = time.Day;
                        hour = time.Hour;
                        min = time.Minute;
                        return true;
                    }
                }
            }

            return false;
        }
    }
}
