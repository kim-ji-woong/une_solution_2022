using System;
using System.Collections.Generic;
using System.Text;

namespace Weather.Model
{
    public class Current2
    {
        public enum Fields { WeatherSiteID, Temperature, State, Rain, Humidity, WindSpeed, WindDirection, Atm, UpdateTime, TemperatureHigh, TemperatureLow };

        private int m_nSiteID = -1;
        private float m_fTemp = 0;
        private int? m_nState = null;
        private float m_fRain = 0;
        private float m_fHumidity = 0;
        private float? m_fWindSpeed = null;
        private int? m_nWindDir = null;
        private float? m_fAtm = null;
        private DateTime m_dtUpdate = new DateTime();
        private float? m_fTempHigh = 0;
        private float? m_fTempLow = 0;

        public int WeatherSiteID
        {
            get { return m_nSiteID; }
            set { m_nSiteID = value; }
        }

        public float Temperature
        {
            get { return m_fTemp; }
            set { m_fTemp = value; }
        }

        public int? State 
        {
            get { return m_nState; }
            set { m_nState = value; }
        }

        public float Rain
        {
            get { return m_fRain; }
            set { m_fRain = value; }
        }

        public float Humidity
        {
            get { return m_fHumidity; }
            set { m_fHumidity = value; }
        }

        public float? WindSpeed
        {
            get { return m_fWindSpeed; }
            set { m_fWindSpeed = value; }
        }

        public int? WindDirection
        {
            get { return m_nWindDir; }
            set { m_nWindDir = value; }
        }

        public float? Atm
        {
            get { return m_fAtm; }
            set { m_fAtm = value; }
        }

        public DateTime UpdateTime
        {
            get { return m_dtUpdate; }
            set { m_dtUpdate = value; }
        }

        public float? TemperatureHigh
        {
            get { return m_fTempHigh; }
            set { m_fTempHigh = value; }
        }

        public float? TemperatureLow
        {
            get { return m_fTempLow; }
            set { m_fTempLow = value; }
        }

        public static string TableName
        {
            get { return "WeatherCurrent2"; }
        }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.State ||
                field == Fields.WindSpeed ||
                field == Fields.WindDirection ||
                field == Fields.Atm ||
                field == Fields.TemperatureHigh ||
                field == Fields.TemperatureLow)
                isNullable = true;
            else
                isNullable = false;

            return field.ToString();
        }
    }
}
