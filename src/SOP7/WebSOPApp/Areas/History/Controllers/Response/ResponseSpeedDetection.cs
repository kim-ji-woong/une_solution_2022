using System;
using System.Collections.Generic;

namespace WebSOPApp.Areas.History.Controllers.Response
{
    // 과속 이력 API 공통 결과. BeaconServer 의 MessageResult 와 같은 형태(success / message)다.
    public class SpeedDetectionResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
    }

    public class ResponseSpeedDetectionSensors : SpeedDetectionResult
    {
        public List<global::SDMS.Model.Sensor.ETC> Sensors { get; set; }
    }

    public class ResponseSpeedDetectionHistories : SpeedDetectionResult
    {
        public List<SpeedDetectionData> SpeedDetectionDatas { get; set; }
    }

    // 과속 감지 1건 + 센서(위치) 이름. BeaconServer 의 SpeedDetectionData 와 같은 필드다.
    public class SpeedDetectionData
    {
        public int ID { get; set; }
        public DateTime DetectionTime { get; set; }
        public int SensorID { get; set; }
        public int Speed { get; set; }
        public string CarNo { get; set; }            // LPR 매칭 전이면 null
        public double? DiffSeconds { get; set; }     // LPR 이벤트 시각과의 차이(초)
        public string SensorName { get; set; }       // 센서 이름 = 위치 이름

        public SpeedDetectionData(global::Wonik.Model.VehicleSpeedDetection detection, string strSensorName)
        {
            ID = detection.ID;
            DetectionTime = detection.DetectionTime;
            SensorID = detection.SensorID;
            Speed = detection.Speed;
            CarNo = detection.CarNo;
            DiffSeconds = detection.DiffSeconds;
            SensorName = strSensorName;
        }
    }
}
