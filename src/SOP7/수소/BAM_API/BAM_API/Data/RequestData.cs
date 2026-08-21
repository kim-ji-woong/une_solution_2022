using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.Data
{
    public class ReqAnomalyDetection
    {
        public string component_id { get; set; }
        public string asset_type { get; set; }
        public string location_type { get; set; }
        public string sensor_type { get; set; }
        public string unit_type { get; set; }
        public string id_ext { get; set; }
        public string measure_id { get; set; }
        public anomalies data_anomalies { get; set; }
        public diagnosis data_diagnosis { get; set; }

    }

    public class anomalies
    {
        public string status { get; set; }
        public int length { get; set; }
        public string base_read_data_time { get; set; }
        public float reconstruction_error_threshold { get; set; }
        public List<anomaly> data_list { get; set; }
    }

    public class anomaly
    {
        public string read_data_time { get; set; }
        public string timestamp { get; set; }
        public float point_value_original { get; set; }
        public float point_value_reconstruct { get; set; }
        public float error_abs_value { get; set; }
        public bool is_anomaly { get; set; }
    }

    public class diagnosis
    {
        public string status { get; set; }
        public int length { get; set; }
        public string base_read_data_time { get; set; }
        public string pattern_type { get; set; }
    }    
}
