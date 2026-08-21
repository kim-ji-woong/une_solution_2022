using Nipa.Model.Weather;
using dnsDapperDBUtil.Interfaces;

namespace Nipa.BLL.Models
{
    public class WeatherData : IDataClass
    {
        private Site m_site = null;
        private Current m_current = null;

        public Site Site
        {
            get { return m_site; }
            set { m_site = value; }
        }

        public Current Current
        {
            get { return m_current; }
            set { m_current = value; }
        }

        public void Binding(params object[] obj)
        {
            if (obj == null)
                return;

            for (int i = 0; i < obj.Length; i++)
            {
                if (obj[i] is Site)
                    this.Site = (Site)obj[i];
                else if (obj[i] is Current)
                    this.Current = (Current)obj[i];
            }
        }

        public object MakeDataClass()
        {
            return new WeatherData();
        }
    }

    public class WeatherWeeklyData
    {
        private Site m_site = null;
        private Weekly m_weekly = null;

        public Site Site
        {
            get { return m_site; }
            set { m_site = value; }
        }

        public Weekly Weekly
        {
            get { return m_weekly; }
            set { m_weekly = value; }
        }
    }
}
