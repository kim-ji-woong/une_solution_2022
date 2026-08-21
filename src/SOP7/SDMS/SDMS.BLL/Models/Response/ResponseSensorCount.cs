using System;
using System.Collections.Generic;
using System.Text;

namespace SDMS.BLL.Models.Response
{
    public class ResponseSensorCount : MessageResult
    {
        // 전체 화재센서 개수
        private int m_nFireSensorCount = 0;
        // 사용할수 없는 화재센서 개수
        private int m_nDisabledFireSensorCount = 0;
        // 전체 누출센서 개수
        private int m_nPSMSensorCount = 0;
        // 사용할수 없는 누출센서 개수
        private int m_nDisabledPSMSensorCount = 0;
        // 전체 기타센서 개수
        private int m_nEtcSensorCount = 0;
        // 사용할수 없는 기타센서 개수
        private int m_nDisabledEtcSensorCount = 0;
        // 전체 CCTV 개수
        private int m_nCCTVCount = 0;
        // 사용할수 없는 CCTV 개수
        private int m_nDisabledCCTVCount = 0;

        // 전체 지진센서 개수
        private int m_nEarthquakeSensorCount = 0;
        // 사용할수 없는 지진센서 개수
        private int m_nDisabledEarthquakeSensorCount = 0;
        // 전체 강풍센서 개수
        private int m_nStrongWindSensorCount = 0;
        // 사용할수 없는 강풍센서 개수
        private int m_nDisabledStrongWindSensorCount = 0;

        // 전체 환경설비 센서 개수
        private int m_nEnvironmentSensorCount = 0;
        // 사용할수 없는 환경설비 센서 개수
        private int m_nDisabledEnvironmentSensorCount = 0;
        // 전체 환경설비 센서 개수
        private int m_nManufactureSensorCount = 0;
        // 사용할수 없는 환경설비 센서 개수
        private int m_nDisabledManufactureSensorCount = 0;

        // 전체 비상벨 개수
        private int m_nEmergencyBellCount = 0;
        // 사용할수 없는 비상벨 개수
        private int m_nDisabledEmergencyBellCount = 0;
        // 전체 레이저 센서 개수
        private int m_nLaserSensorCount = 0;
        // 사용할 수 없는 레이저 센서 개수
        private int m_nDisabledLaserSensorCount = 0;
        // 전체 문열림센서 개수
        private int m_nDoorSensorCount = 0;
        // 사용할 수 없는 문열림센서 개수
        private int m_nDisabledDoorSensorCount = 0;

        // 전체 차량과속 센서 개수
        private int m_nSpeedDetectionSensorCount = 0;
        // 사용할수 없는 차량과속 센서 개수
        private int m_nDisabledSpeedDetectionSensorCount = 0;

        // 전체 화재센서 개수
        public int FireSensorCount
        {
            get { return m_nFireSensorCount; }
            set { m_nFireSensorCount = value; }
        }

        // 사용할수 없는 화재센서 개수
        public int DisabledFireSensorCount
        {
            get { return m_nDisabledFireSensorCount; }
            set { m_nDisabledFireSensorCount = value; }
        }

        // 전체 누출센서 개수
        public int PsmSensorCount
        {
            get { return m_nPSMSensorCount; }
            set { m_nPSMSensorCount = value; }
        }

        // 사용할수 없는 누출센서 개수
        public int DisabledPSMSensorCount
        {
            get { return m_nDisabledPSMSensorCount; }
            set { m_nDisabledPSMSensorCount = value; }
        }

        // 전체 기타센서 개수
        public int EtcSensorCount
        {
            get { return m_nEtcSensorCount; }
            set { m_nEtcSensorCount = value; }
        }

        // 사용할수 없는 기타센서 개수
        public int DisabledEtcSensorCount
        {
            get { return m_nDisabledEtcSensorCount; }
            set { m_nDisabledEtcSensorCount = value; }
        }

        // 전체 CCTV 개수
        public int CctvCount
        {
            get { return m_nCCTVCount; }
            set { m_nCCTVCount = value; }
        }

        // 사용할수 없는 CCTV 개수
        public int DisabledCCTVCount
        {
            get { return m_nDisabledCCTVCount; }
            set { m_nDisabledCCTVCount = value; }
        }

        // 전체 지진센서 개수
        public int EarthquakeSensorCount
        {
            get { return m_nEarthquakeSensorCount; }
            set { m_nEarthquakeSensorCount = value; }
        }

        // 사용할수 없는 지진센서 개수
        public int DisabledEarthquakeSensorCount
        {
            get { return m_nDisabledEarthquakeSensorCount; }
            set { m_nDisabledEarthquakeSensorCount = value; }
        }

        // 전체 강풍센서 개수
        public int StrongWindSensorCount
        {
            get { return m_nStrongWindSensorCount; }
            set { m_nStrongWindSensorCount = value; }
        }

        // 사용할수 없는 강풍센서 개수
        public int DisabledStrongWindSensorCount
        {
            get { return m_nDisabledStrongWindSensorCount; }
            set { m_nDisabledStrongWindSensorCount = value; }
        }



        // 전체 환경설비 센서 개수
        public int EnvironmentSensorCount
        {
            get { return m_nEnvironmentSensorCount; }
            set { m_nEnvironmentSensorCount = value; }
        }

        // 사용할수 없는 환경설비 센서 개수
        public int DisabledEnvironmentSensorCount
        {
            get { return m_nDisabledEnvironmentSensorCount; }
            set { m_nDisabledEnvironmentSensorCount = value; }
        }
        // 전체 제조설비 센서 개수
        public int ManufactureSensorCount
        {
            get { return m_nManufactureSensorCount; }
            set { m_nManufactureSensorCount = value; }
        }

        // 사용할수 없는 제조설비 센서 개수
        public int DisabledManufactureSensorCount
        {
            get { return m_nDisabledManufactureSensorCount; }
            set { m_nDisabledManufactureSensorCount = value; }
        }

        // 전체 비상벨 개수
        public int EmergencyBellCount
        {
            get { return m_nEmergencyBellCount; }
            set { m_nEmergencyBellCount = value; }
        }

        // 사용할수 없는 비상벨 개수
        public int DisabledEmergencyBellCount
        {
            get { return m_nDisabledEmergencyBellCount; }
            set { m_nDisabledEmergencyBellCount = value; }
        }
        
        public int LaserSensorCount
        {
            get { return m_nLaserSensorCount; }
            set { m_nLaserSensorCount = value; }
        }
        
        public int DisabledLaserSensorCount
        {
            get { return m_nDisabledLaserSensorCount; }
            set { m_nDisabledLaserSensorCount = value; }
        }
        
        public int DoorSensorCount
        {
            get { return m_nDoorSensorCount; }
            set { m_nDoorSensorCount = value; }
        }
        
        public int DisabledDoorSensorCount
        {
            get { return m_nDisabledDoorSensorCount; }
            set { m_nDisabledDoorSensorCount = value; }
        }

        public int SpeedDetectionSensorCount
        {
            get { return m_nSpeedDetectionSensorCount; }
            set { m_nSpeedDetectionSensorCount = value; }
        }

        public int DisabledSpeedDetectionSensorCount
        {
            get { return m_nDisabledSpeedDetectionSensorCount; }
            set { m_nDisabledSpeedDetectionSensorCount = value; }
        }
    }
}
