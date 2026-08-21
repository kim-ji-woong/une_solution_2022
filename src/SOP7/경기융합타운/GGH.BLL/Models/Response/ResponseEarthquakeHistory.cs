using System.Collections.Generic;
using GGH.Model.History;
using System;

namespace GGH.BLL.Models.Response
{
    public class ResponseEarthquakeHistory : MessageResult
    {
        private int m_quaterNo = 1;
        private List<NullableEarthquake> m_earthquakeHistories = new List<NullableEarthquake>();

        public int QuaterNo
        {
            get { return m_quaterNo; }
            set { m_quaterNo = value; }
        }

        public List<NullableEarthquake> EarthquakeHistories
        {
            get { return m_earthquakeHistories; }
            set { m_earthquakeHistories = value; }
        }

        public ResponseEarthquakeHistory()
            : base()
        {
        }

        public ResponseEarthquakeHistory(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseLastEarthquake : MessageResult
    {
        private Earthquake m_earthquake = null;

        public Earthquake Earthquake
        {
            get { return m_earthquake; }
            set { m_earthquake = value; }
        }

        public ResponseLastEarthquake()
            : base()
        {
        }

        public ResponseLastEarthquake(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class NullableEarthquake
    {
        public DateTime TimeStamp { get; set; }
        public double? Hpga { get; set; }
        public double? Tpga { get; set; }
        public double? Gal { get; set; }
        public int? Intensity { get; set; }

        public static NullableEarthquake ToNullableEarthquake(Earthquake earthquake)
        {
            NullableEarthquake _earthquake = new NullableEarthquake();

            _earthquake.Gal = earthquake.Gal;
            _earthquake.Hpga = earthquake.Hpga;
            _earthquake.Tpga = earthquake.Tpga;
            _earthquake.Intensity = earthquake.Intensity;
            _earthquake.TimeStamp = earthquake.TimeStamp;

            return _earthquake;
        }
    }
}
