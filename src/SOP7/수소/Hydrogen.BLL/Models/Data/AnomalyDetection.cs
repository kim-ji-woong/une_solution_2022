using Hydrogen.Model.Anomaly;
using System;
using System.Collections.Generic;
using System.Text;

namespace Hydrogen.BLL.Models.Data
{
    // 이상탐지 데이터
    public class AnomalyDetectionData : AnomalyDetection
    {
        public AnomalyDetectionData()
        {

        }

        public AnomalyDetectionData(AnomalyDetection data)
        {
            this.ID = data.ID;
            this.SensorID = data.SensorID;
            this.component_id = data.component_id;
            this.asset_type = data.asset_type;
            this.location_type = data.location_type;
            this.sensor_type = data.sensor_type;
            this.unit_type = data.unit_type;
            this.id_ext = data.id_ext;
            this.measure_id = data.measure_id;
            this.status = data.status;
            this.base_read_data_time = data.base_read_data_time;
            this.reconstruction_error_threshold = data.reconstruction_error_threshold;
            this.diagnosis_status = data.diagnosis_status;
            this.pattern_type = data.pattern_type;
            this.is_anomaly = data.is_anomaly;
        }

        public List<AnomalyDetectionDetail> details { get; set; }

    }
}
