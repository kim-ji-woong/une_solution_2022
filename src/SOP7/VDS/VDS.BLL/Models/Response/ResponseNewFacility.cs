using VDS.Model;
using VDS.Model.Sensor;

namespace VDS.BLL.Models.Response
{
    public class ResponseNewFacility : MessageResult
    {
        private Facility m_facility = null;

        public Facility Facility
        {
            get { return m_facility; }
            set { m_facility = value; }
        }

        public ResponseNewFacility()
            : base()
        {
        }

        public ResponseNewFacility(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class ResponseNewSensor : MessageResult
    {
        private Sensor m_sensor = null;

        public Sensor Sensor
        {
            get { return m_sensor; }
            set { m_sensor = value; }
        }

        public ResponseNewSensor()
            : base()
        {
        }

        public ResponseNewSensor(bool success, string message)
            : base(success, message)
        {
        }
    }
}
