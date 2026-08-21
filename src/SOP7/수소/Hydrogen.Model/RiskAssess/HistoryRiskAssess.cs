using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.Model.RiskAssess
{
    public class HistoryRiskAssess
    {
        public enum Fields { ID, SensorID, Parameter, Deviation, Cause, event_scenario, hazard_scenario, action, reference, status, read_data_time };

        public int ID { get; set; }
        public int SensorID { get; set; }
        public string Parameter { get; set; }
        public string Deviation { get; set; }
        public string Cause { get; set; }
        public string event_scenario { get; set; }
        public string hazard_scenario { get; set; }
        public string action { get; set; }
        public string reference { get; set; }
        public string status { get; set; }
        public DateTime read_data_time { get; set; }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }

        public static string TableName
        {
            get { return "HistoryRiskAssess"; }
        }
    }
}
