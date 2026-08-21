using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.Model.Anomaly
{
    public class AnomalyDetection
    {
        public enum Fields { ID, SensorID, component_id, asset_type, location_type, sensor_type, unit_type, id_ext, measure_id, status, base_read_data_time, reconstruction_error_threshold, diagnosis_status, pattern_type, is_anomaly };

        public int ID { get; set; }
        public int SensorID { get; set; }
        public string component_id { get; set; }
        public string asset_type { get; set; }
        public string location_type { get; set; }
        public string sensor_type { get; set; }
        public string unit_type { get; set; }
        public string id_ext { get; set; }
        public string measure_id { get; set; }
        public string status { get; set; }
        public DateTime base_read_data_time { get; set; }
        public float reconstruction_error_threshold { get; set; }
        public string diagnosis_status { get; set; }
        public string pattern_type { get; set; }
        public bool is_anomaly { get; set; }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }

        public static string TableName
        {
            get { return "AnomalyDetection"; }
        }
    }
}
