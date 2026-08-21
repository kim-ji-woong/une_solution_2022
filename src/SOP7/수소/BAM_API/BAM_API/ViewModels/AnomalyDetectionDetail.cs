using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAM_API.ViewModels
{
    public class AnomalyDetectionDetail : Table
    {
        public enum Fields { ID, AnomalyDetectionID, read_data_time, timestamp, point_value_original, point_value_reconstruct, error_abs_value, is_anomaly };
        public enum WriteFields { ID, AnomalyDetectionID, read_data_time, timestamp, point_value_original, point_value_reconstruct, error_abs_value, is_anomaly };
        public int ID { get; set; }
        public int AnomalyDetectionID { get; set; }
        public DateTime read_data_time { get; set; }
        public DateTime timestamp { get; set; }
        public float point_value_original { get; set; }
        public float point_value_reconstruct { get; set; }
        public float error_abs_value { get; set; }
        public bool is_anomaly { get; set; }
        public static string TableName { get { return "AnomalyDetectionDetail"; } }

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
