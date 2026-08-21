using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AWS_API
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

    public class BAM_Data
    {
        public string live_process_index { get; set; }
        public string measure_id { get; set; }
        public string component_id { get; set; }
        public string id_ext { get; set; }
        public string sensor_type { get; set; }
        public string asset_type { get; set; }
        public string com_node { get; set; }
        public string location_type { get; set; }
        public string eclass_path { get; set; }
        public string aas_path { get; set; }
        public string parameter { get; set; }
        public string unit_type { get; set; }
        public string max { get; set; }
        public string min { get; set; }
        public string calibration_path { get; set; }
        public string backup_path { get; set; }
        public string timestamp { get; set; }
        public string value { get; set; }
    }

    public class ReqDamageScope
    {
        public string mode { get; set; }
        public string node { get; set; }
        public int? risk_level { get; set; }
    }

    public class ReqRiskData
    {
        public string mode { get; set; }
        public string node { get; set; }
        public int? risk_level { get; set; }
        public string param { get; set; }
        public string deviation { get; set; }
        public string language { get; set; }
    }

    public class ReqAlarm
    {
        public string language { get; set; }
    }
}
