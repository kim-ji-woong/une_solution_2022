using AgentFactory.BLL;
using SDMS.Model.Sensor;
using SDMS.Model.Spatial;

namespace SOPWebServer.BLL.Server
{
    class SubmergeSensor : EtcSensor
    {
        public SubmergeSensor(MainManager mainManager, Factory factory)
            : base(mainManager, factory)
        {
            m_initialized = true;
        }

        protected override string GetDetectMessage(SensorZone sensorZone, EquipmentZone equipZone, bool isReal)
        {
            string strEventName = Facility.GetFacilityTypeString(Facility.FacilityType.SUBMERGENCY) + " 신호";

            if (isReal)
            {
                string strTag = GetTrainingModeString();

                if (equipZone == null)
                    return strTag + strEventName + "가 탐지되었습니다";
                else
                    return string.Format("{0}[{1}]에서 {2}가 탐지되었습니다", strTag, equipZone.DisplayText, strEventName);
            }

            if (equipZone == null)
                return string.Format("[테스트]{0}가 탐지되었습니다", strEventName);

            return string.Format("[테스트][{0}]에서 {1}가 탐지되었습니다", equipZone.DisplayText, strEventName);
        }

        protected override string GetManualReportString(int nZoneID)
        {
            string strMessage = "";

            if (nZoneID < 0)
            {
                strMessage = "침수 상황이 신고되었습니다";
            }
            else
            {
                Zone zone = m_mainManager.SensorManager.GetZone(nZoneID);

                if (zone != null)
                {
                    string szLocationName = zone.DisplayText;
                    strMessage = string.Format("[{0}]에서 침수 상황이 신고되었습니다", szLocationName);
                }
            }

            return strMessage;
        }
    }
}
