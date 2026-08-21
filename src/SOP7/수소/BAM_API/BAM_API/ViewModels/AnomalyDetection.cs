using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.ViewModels
{
    public class AnomalyDetection : Table
    {
        public enum Fields { ID, SensorID, component_id, asset_type, location_type, sensor_type, unit_type, id_ext, measure_id, status, base_read_data_time, reconstruction_error_threshold, diagnosis_status, pattern_type, is_anomaly };
        public enum WriteFields { ID, SensorID, component_id, asset_type, location_type, sensor_type, unit_type, id_ext, measure_id, status, base_read_data_time, reconstruction_error_threshold, diagnosis_status, pattern_type, is_anomaly };

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
        public static string TableName { get { return "AnomalyDetection"; } }

        public static string GetFieldName(Fields field, out bool isNullable)
        {
            isNullable = false;
            return field.ToString();
        }

        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("ID = {0}", ID);
        }

        public override Type GetFieldType()
        {
            return typeof(Fields);
        }

        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }
    }
}
