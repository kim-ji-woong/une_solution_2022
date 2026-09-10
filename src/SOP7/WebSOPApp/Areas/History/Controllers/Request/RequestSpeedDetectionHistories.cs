namespace WebSOPApp.Areas.History.Controllers.Request
{
    // 과속 감지 이력 조회 조건
    public class RequestSpeedDetectionHistories
    {
        public string BeginDate { get; set; }      // yyyy-MM-dd HH:mm:ss
        public string EndDate { get; set; }        // yyyy-MM-dd HH:mm:ss
        public int? SensorID { get; set; }         // null 또는 0 이하면 전체 센서
    }
}
