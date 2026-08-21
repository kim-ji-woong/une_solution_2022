using System;
using System.Collections.Generic;

namespace AgentFactory.BLL
{
    public class Facility
    {
        private static Dictionary<int, FacilityType> m_dicFacilityType = null;


        public enum FacilityType
        {
            NONE = -1,
            FIRE_SENSOR = 0,        // 화재탐지센서(100번 ~ 199번)
            COOLER_SENSOR = 1,      // 스프링쿨러
            PRESSURE_SENSOR = 2,    // 펌프압력센서
            CCTV = 3,
            FE = 4,                 // 소화기(Fire Extinguisher)
            HD = 5,                 // 소화전(Hydrant)
            FA = 6,                 // 발신기(Fire Alarm)
            FR = 7,                 // 수신반(Fire Receiver)
            PSM_SENSOR = 11,        // 유해화학물질 누출감지 센서
            DISASTER_PREVENTION_EQUIPMENT = 12, // 방재장비
            AIR_QUAILITY = 13,                  // 공기질 센서
            TEMPERATURE_HUMIDITY = 14,          // 온도/습도 센서
            FIREWALL = 15,                      // 방화벽
            DOOR = 16,                          // 출입문
            BLACKOUT = 17,                      // 정전
            STRONG_WIND = 18,                   // 강풍
            SUBMERGENCY = 19,                   // 침수
            TERROR = 20,                        // 테러
            ETC = 21,                           // 기타
            Earthquake = 50,                    // 지진 센서
            FireSensor_TypeA = 101,             // 화재감지기 A
            FireSensor_TypeB = 102,             // 화재감지기 B
            FireSensor_GasEmission = 103,       // 가스 방출신호
            FireSensor_ManualControl = 104,     // 수동조작함 신호
            FireSensor_LightType = 105,         // 광선식
            FireSensor_SiemensType = 106,       // 지멘스 자탐
            FireSensor_Monitoring = 107,        // 감시
            FireSensor_SensingLine = 108,       // 감지선
            FireSensor_AnalogSmokeType = 109,   // 아날로그식 연기
            FireSensor_MonitoringType = 110,    // 감시센서
            Collapse = 111,                     // 쓰러짐
            SOS = 112,                          // SOS
            Confined = 113,                     // 협착
            VirtualFence = 114,                 // 가상펜스
            Becon_Stay = 115,                   // 비콘 위험구역 체류 알람
            Becon_SOS = 116,                    // 비콘 SOS 알람
            Environment = 117,                  // 환경설비
            Manufacture = 118,                  // 제조설비
            EmergencyBell = 119,                // 비상벨
            Laser = 120,                        // 레이저
            EXIT = 121,                         // 비상구
            SpeedDetection = 122,               // 차량 과속센서

            // Soulbrain 공장설비
            Temp = 200,
            Humi = 201,
            CO2 = 202,
            TVOC = 203,
            Dust_PM1 = 204,
            Dust_PM2 = 205,
            Dust_PM10 = 206,
            AirPress = 207,
            Inclin_X = 208,
            Inclin_Y = 209,
            Vib_X = 210,
            Vib_Y = 211,
            Vib_Z = 212,
            Noise = 213,
            BLE_Count = 214,
            HF = 215,
            CO = 216,
            O2 = 217,
            Value = 218,
            mA = 219,
            Contact = 220,
            Relay = 221,
            HCL = 222,
            CH3C = 223,
            N2H4 = 224,
            CA = 225,
            EA = 226,
            VOC = 227,
            H2O2 = 228,
            THC = 229,
            HNO3 = 230,
            CL = 231,
            TOLUENE = 232,
            F2 = 233,
            NH3 = 234,
            LNG = 235,
            PGMEA = 236,
            H2S = 237,

            CH4 = 239,
            OU = 240,               // 복합악취
            EmergencyCall = 241,    // 긴급호출
            Stuck = 243,            // 장비협착
            Pair = 244,             // 2인1조
            LowBattery = 252,       // 배터리교체
            //Equipment = 253,      // 설비
            H2 = 253,               // 수소

            // TLB
            HighTemp = 290,         // 고온감지 덕트
            Tilt = 291,             // 기울기 센서

            // 수소
            //H2 = 292,               // 수소
            Flow = 293,             // 유량
            Conductivity = 294,     // 전도도
            GAS = 295,              // 가스

            // 녹십자 가스
            C2H5OH = 300,

            Security_Sensor = 899,              // 방범센서
                                                // 서울대학교 e재난 시스템 - S1시스템 통합으로 추가됨
                                                // skkim     2017-03-14
            Intrusion_S1 = 900,                    // SVMS 침입
            Loiter_S1 = 901,                       // SVMS 배회
            Collapse_S1 = 902,                     // SVMS 쓰러짐
            Theft_S1 = 903,                        // SVMS 도난
            Neglect_S1 = 904,                      // SVMS 방치
            VirtualFence_S1 = 905,                 // SVMS 가상펜스
            Fire_S1 = 906,                         // SVMS 화재
            EmergencyBell_S1 = 907,                // SVMS 비상벨
            SVMS_Device_Event = 908,               // SVMS CCTV가 아닌 별도의 Device를 통한 이벤트

            Event_ForcedDoorOpen = 951,             // 강제 문열림
            Event_CheatedTagging = 952,             // 대리태깅
            Event_Untagging = 953,                  // 꼬리물기
            Event_StealCard = 954,                  // 사원증 도용
            Event_Stranger = 955,                   // 이상행위자
            Event_EvasionItem = 956,                // 무인 보안검색 회피
            Event_NotPermittedPerson = 957,         // 비인가 구역 출입
            Event_NotPermittedItem = 958,           // 비인가 구역 반입
            Event_CardTag = 959,                    // 사원증 태깅
            Event_SmartTag = 960,                   // 스마트태그 태깅
            Event_CardReader = 961,                 // 카드리더

            GeneralIntrusionT1_S1 = 1001,          // S1Access 일반침입1
            GeneralIntrusionT2_S1 = 1002,          // S1Access 일반 침입2
            InternalIntrusionT3_S1 = 1003,         // S1Access 내부침입
            VaultIntrusionT4_S1 = 1004,            // S1Access 금고침입
            FireF1_S1 = 2000,                      // S1Access 화재
            CustomerEmergencyC1_S1 = 2100,         // S1Access 고객비상
            CustomerEmergencyC2_S1 = 2110,         // S1Access 고객 비상
            RescueQQ_S1 = 2200,                    // S1Access 구급
            GasG1_S1 = 2300,                       // S1Access 가스
            BlackoutAbnormalityU1_S1 = 3000,       // S1Access 정전이상
            LeakAbnormalityU4_S1 = 3004,           // S1Access 누수이상
            SynthesisAlertAbnormalityU8_S1 = 3008, // S1Access 종합경보반 이상
            ExternalAlarmBell = 4000,              // 외부 비상벨

            SecomFire = 5000,                       // SECOM 화재
            SecomExternalAlarmBell = 5001,          // SECOM 외부 비상벨
            SecomWomenAlarmBell = 5002,             // SECOM 여자화장실 비상벨

            SicTemp = 6000,                         // 신일테크 열화상 카메라 온도
            SicFire = 6001,                         // 신일테크 열화상 카메라 화재
            SicIntrusion = 6002                     // 신일테크 열화상 카메라 침입

        };

        public static string GetNFacilityTypeString(int facilityType)
        {
            return GetFacilityTypeString(ToFacilityType(facilityType));
        }

        public static string GetFacilityTypeString(FacilityType nType)
        {
            if (nType == Facility.FacilityType.FIRE_SENSOR ||
                nType == Facility.FacilityType.FireSensor_TypeA ||
                nType == Facility.FacilityType.FireSensor_TypeB)
                return "화재센서";
            else if (nType == Facility.FacilityType.COOLER_SENSOR)
                return "스프링쿨러";
            else if (nType == Facility.FacilityType.PRESSURE_SENSOR)
                return "압력";
            else if (nType == Facility.FacilityType.PSM_SENSOR)
                return "유해화학물질 센서";
            else if (nType == Facility.FacilityType.AIR_QUAILITY)
                return "공기질 센서";
            else if (nType == Facility.FacilityType.TEMPERATURE_HUMIDITY)
                return "온도/습도 센서";
            else if (nType == Facility.FacilityType.DISASTER_PREVENTION_EQUIPMENT)
                return "방재장비";
            else if (nType == Facility.FacilityType.FireSensor_Monitoring)
                return "감시";
            else if (nType == Facility.FacilityType.FireSensor_SensingLine)
                return "감지선";
            else if (nType == Facility.FacilityType.FireSensor_AnalogSmokeType)
                return "연기감지기";
            else if (nType == Facility.FacilityType.FireSensor_MonitoringType)
                return "감시센서";
            else if (nType == Facility.FacilityType.CCTV)
                return "CCTV";
            else if (nType == Facility.FacilityType.FE)
                return "소화기";
            else if (nType == Facility.FacilityType.HD)
                return "소화전";
            else if (nType == Facility.FacilityType.FA)
                return "발신기";
            else if (nType == Facility.FacilityType.FR)
                return "수신기";
            else if (nType == Facility.FacilityType.FireSensor_GasEmission)
                return "가스방출";
            else if (nType == Facility.FacilityType.FireSensor_ManualControl)
                return "수동조작함";
            else if (nType == Facility.FacilityType.FireSensor_SiemensType)
                return "지멘스자탐";
            else if (nType == Facility.FacilityType.FireSensor_LightType)
                return "광선식";
            else if (nType == Facility.FacilityType.Intrusion_S1)
                return "지능형영상(침입)";
            else if (nType == Facility.FacilityType.Loiter_S1)
                return "지능형영상(배회)";
            else if (nType == Facility.FacilityType.Collapse_S1)
                return "지능형영상(쓰러짐)";
            else if (nType == Facility.FacilityType.Theft_S1)
                return "지능형영상(도난)";
            else if (nType == Facility.FacilityType.Neglect_S1)
                return "지능형영상(방치)";
            else if (nType == Facility.FacilityType.VirtualFence_S1)
                return "지능형영상(가상펜스)";
            else if (nType == Facility.FacilityType.Fire_S1)
                return "지능형영상(화재)";
            else if (nType >= Facility.FacilityType.GeneralIntrusionT1_S1 && nType <= Facility.FacilityType.SynthesisAlertAbnormalityU8_S1)
                return "S1Access";
            else if (nType == Facility.FacilityType.ExternalAlarmBell)
                return "외부 비상벨";
            else if (nType >= Facility.FacilityType.SecomFire && nType <= Facility.FacilityType.SecomWomenAlarmBell)
                return "세콤";
            else if (nType == FacilityType.FIREWALL)
                return "방화벽";
            else if (nType == FacilityType.DOOR)
                return "출입문";
            else if (nType == FacilityType.BLACKOUT)
                return "정전";
            else if (nType == FacilityType.STRONG_WIND)
                return "강풍";
            else if (nType == FacilityType.TERROR)
                return "테러";
            else if (nType == FacilityType.SUBMERGENCY)
                return "침수";
            else if (nType == FacilityType.Earthquake)
                return "지진";
            else if (nType == FacilityType.ETC)
                return "기타";
            else if (nType == FacilityType.Temp)
                return "온도";
            else if (nType == FacilityType.Humi)
                return "습도";
            else if (nType == FacilityType.CO2)
                return "이산화탄소";
            else if (nType == FacilityType.TVOC)
                return "TVOC";
            else if (nType == FacilityType.Dust_PM1)
                return "미세먼지(PM 1.0)";
            else if (nType == FacilityType.Dust_PM2)
                return "미세먼지(PM 2.5)";
            else if (nType == FacilityType.Dust_PM10)
                return "미세먼지(PM 10)";
            else if (nType == FacilityType.AirPress)
                return "기압";
            else if (nType == FacilityType.Inclin_X)
                return "기울기(X)";
            else if (nType == FacilityType.Inclin_Y)
                return "기울기(Y)";
            else if (nType == FacilityType.Vib_X)
                return "진동(X)";
            else if (nType == FacilityType.Vib_Y)
                return "진동(Y)";
            else if (nType == FacilityType.Vib_Z)
                return "진동(Z)";
            else if (nType == FacilityType.Noise)
                return "소음";
            else if (nType == FacilityType.BLE_Count)
                return "BLE Count";
            else if (nType == FacilityType.HF)
                return "불화수소";
            else if (nType == FacilityType.CO)
                return "일산화탄소";
            else if (nType == FacilityType.O2)
                return "산소";
            else if (nType == FacilityType.Value)
                return "ESH_v5.1 측정값";
            else if (nType == FacilityType.mA)
                return "mA";
            else if (nType == FacilityType.Contact)
                return "접점";
            else if (nType == FacilityType.Relay)
                return "릴레이";
            else if (nType == FacilityType.HCL)
                return "염화수소";
            else if (nType == FacilityType.CH3C)
                return "초산";
            else if (nType == FacilityType.N2H4)
                return "하이드라진";
            else if (nType == FacilityType.CA)
                return "CA Gas";
            else if (nType == FacilityType.EA)
                return "에틸알콜";
            else if (nType == FacilityType.VOC)
                return "VOC";
            else if (nType == FacilityType.H2O2)
                return "과수";
            else if (nType == FacilityType.THC)
                return "에탄올";
            else if (nType == FacilityType.HNO3)
                return "질산";
            else if (nType == FacilityType.CL)
                return "염소가스";
            else if (nType == FacilityType.TOLUENE)
                return "톨루엔";
            else if (nType == FacilityType.F2)
                return "불소";
            else if (nType == FacilityType.NH3)
                return "암모니아";
            else if (nType == FacilityType.LNG)
                return "액화천연가스";
            else if (nType == FacilityType.PGMEA)
                return "유기가스";
            else if (nType == FacilityType.H2S)
                return "황화수소";
            else if (nType == FacilityType.C2H5OH)
                return "인화성 가스"; // 물질은 에탄올이나 녹십자 요청으로 명칭 변경;
            else if (nType == FacilityType.Becon_Stay)
                return "체류 알람";
            else if (nType == FacilityType.Becon_SOS)
                return "SOS 알람";
            else if (nType == FacilityType.Environment)
                return "환경설비";
            else if (nType == FacilityType.Manufacture)
                return "제조설비";
            else if (nType == FacilityType.EmergencyBell)
                return "비상벨";
            else if (nType == FacilityType.LowBattery)
                return "배터리 방전경고";
            else if (nType == FacilityType.Laser)
                return "레이저";
            else if (nType == FacilityType.HighTemp)
                return "덕트 고온감지";
            else if (nType == FacilityType.Tilt)
                return "기울기센서";
            else if (nType == Facility.FacilityType.H2)
                return "수소";
            else if (nType == Facility.FacilityType.Temp)
                return "온도";
            else if (nType == Facility.FacilityType.Flow)
                return "유량";
            else if (nType == Facility.FacilityType.Conductivity)
                return "전도도";
            else if (nType == Facility.FacilityType.GAS)
                return "가스";
            else if (nType == Facility.FacilityType.SUBMERGENCY)
                return "침수";
            else if (nType == Facility.FacilityType.Event_ForcedDoorOpen)
                return "강제 문열림";
            else if (nType == Facility.FacilityType.Event_CheatedTagging)
                return "대리태깅";
            else if (nType == Facility.FacilityType.Event_Untagging)
                return "꼬리물기";
            else if (nType == Facility.FacilityType.Event_StealCard)
                return "사원증 도용";
            else if (nType == Facility.FacilityType.Event_Stranger)
                return "이상행위자";
            else if (nType == Facility.FacilityType.Event_EvasionItem)
                return "무인 보안검색 회피";
            else if (nType == Facility.FacilityType.Event_NotPermittedPerson)
                return "비인가 구역 출입";
            else if (nType == Facility.FacilityType.Event_NotPermittedItem)
                return "비인가 구역 반입";

            return "";
        }

        #region 
        public static bool IsSecurityType(FacilityType type)
        {
            if ((type >= FacilityType.Security_Sensor && type <= FacilityType.SVMS_Device_Event) ||
                (type >= FacilityType.GeneralIntrusionT1_S1 && type <= FacilityType.VaultIntrusionT4_S1) ||
                type == FacilityType.CustomerEmergencyC1_S1 || type == FacilityType.CustomerEmergencyC2_S1 ||
                type == FacilityType.RescueQQ_S1 || type == FacilityType.GasG1_S1 ||
                type == FacilityType.BlackoutAbnormalityU1_S1 || type == FacilityType.LeakAbnormalityU4_S1 ||
                type == FacilityType.SynthesisAlertAbnormalityU8_S1 || type == FacilityType.ExternalAlarmBell ||
                type == FacilityType.SecomExternalAlarmBell || type == FacilityType.SecomWomenAlarmBell ||
                type == FacilityType.SicTemp || type == FacilityType.SicIntrusion)
                return true;

            return false;
        }
        public static bool IsFireSensorType(FacilityType type)
        {
            if (type == FacilityType.FIRE_SENSOR ||
                (type >= FacilityType.FireSensor_TypeA && type <= FacilityType.FireSensor_MonitoringType) ||
                type == FacilityType.Fire_S1 ||
                type == FacilityType.FireF1_S1 ||
                type == FacilityType.SecomFire)
                return true;

            return false;
        }
        public static bool IsETCSensorType(FacilityType type)
        {
            if ((type >= FacilityType.FIREWALL && type <= FacilityType.ETC
                && type != FacilityType.STRONG_WIND && type != FacilityType.BLACKOUT && type != FacilityType.DOOR) ||
                type == FacilityType.EmergencyBell)
                return true;

            return false;
        }
        public static bool IsPSMSensorType(FacilityType type)
        {
            if (type == FacilityType.PSM_SENSOR ||
                type == FacilityType.HF ||
                type == FacilityType.CO ||
                type == FacilityType.HCL ||
                type == FacilityType.CH3C ||
                type == FacilityType.N2H4 ||
                type == FacilityType.CA ||
                type == FacilityType.EA ||
                type == FacilityType.VOC ||
                type == FacilityType.H2O2 ||
                type == FacilityType.THC ||
                type == FacilityType.HNO3 ||
                type == FacilityType.CL ||
                type == FacilityType.TOLUENE ||
                type == FacilityType.F2 ||
                type == FacilityType.NH3 ||
                type == FacilityType.LNG ||
                type == FacilityType.PGMEA ||
                type == FacilityType.H2S)
                return true;

            return false;
        }
        public static bool IsSVMSSensorType(FacilityType type)
        {
            if (type == FacilityType.Intrusion_S1 ||
                type == FacilityType.Loiter_S1 ||
                type == FacilityType.Collapse_S1 ||
                type == FacilityType.Theft_S1 ||
                type == FacilityType.Neglect_S1 ||
                type == FacilityType.VirtualFence_S1 ||
                type == FacilityType.Fire_S1 ||
                type == FacilityType.EmergencyBell_S1 ||
                type == FacilityType.SVMS_Device_Event)
                return true;

            return false;
        }
        public static bool IsStrongWindSensorType(FacilityType type)
        {
            return type == FacilityType.STRONG_WIND;
        }
        public static bool IsBlackOutSensorType(FacilityType type)
        {
            return type == FacilityType.BLACKOUT;
        }
        public static bool IsEarthquakeSensorType(FacilityType type)
        {
            return type == FacilityType.Earthquake;
        }
        public static bool IsBeaconSensorType(FacilityType type)
        {
            if (type == FacilityType.Becon_Stay ||
                type == FacilityType.Becon_SOS)
                return true;

            return false;
        }
        public static bool IsEnvironmentSensorType(FacilityType type)
        {
            return type == FacilityType.Environment;
        }

        public static bool IsManufactureSensorType(FacilityType type)
        {
            return type == FacilityType.Manufacture;
        }
        public static bool IsDoorSensorType(FacilityType type)
        {
            return type == FacilityType.DOOR;
        }
        public static bool IsLaserSensorType(FacilityType type)
        {
            return type == FacilityType.Laser;
        }

        public static bool IsLowBatterySensorType(FacilityType type)
        {
            return type == FacilityType.LowBattery;
        }

        public static bool IsHighTempSensorType(FacilityType type)
        {
            return type == FacilityType.HighTemp;
        }

        public static bool IsTiltSensorType(FacilityType type)
        {
            return type == FacilityType.Tilt;
        }

        public static bool IsH2SensorType(FacilityType type)
        {
            return type == FacilityType.H2;
        }

        public static bool IsFlowSensorType(FacilityType type)
        {
            return type == FacilityType.Flow;
        }

        public static bool IsConductivitySensorType(FacilityType type)
        {
            return type == FacilityType.Conductivity;
        }

        public static bool IsTempSensorType(FacilityType type)
        {
            return type == FacilityType.Temp;
        }

        public static bool IsPressureSensorType(FacilityType type)
        {
            return type == FacilityType.PRESSURE_SENSOR;
        }

        public static bool IsGasSensorType(FacilityType type)
        {
            return type == FacilityType.GAS;
        }

        public static bool IsHynixSensorType(FacilityType type)
        {
            if (type == FacilityType.Event_ForcedDoorOpen ||
                type == FacilityType.Event_CheatedTagging ||
                type == FacilityType.Event_Untagging ||
                type == FacilityType.Event_StealCard ||
                type == FacilityType.Event_Stranger ||
                type == FacilityType.Event_EvasionItem ||
                type == FacilityType.Event_NotPermittedPerson ||
                type == FacilityType.Event_NotPermittedItem ||
                type == FacilityType.Event_CardTag ||
                type == FacilityType.Event_SmartTag ||
                type == FacilityType.Event_CardReader)
                return true;

            return false;
        }

        public static List<int> GetFireTypeAllNumberToList()
        {
            List<int> fires = new List<int>();
            fires.Add((int)FacilityType.FIRE_SENSOR);
            fires.Add((int)FacilityType.FireSensor_TypeA);
            fires.Add((int)FacilityType.FireSensor_TypeB);
            fires.Add((int)FacilityType.FireSensor_GasEmission);
            fires.Add((int)FacilityType.FireSensor_ManualControl);
            fires.Add((int)FacilityType.FireSensor_LightType);
            fires.Add((int)FacilityType.FireSensor_SiemensType);
            fires.Add((int)FacilityType.FireSensor_Monitoring);
            fires.Add((int)FacilityType.FireSensor_SensingLine);
            fires.Add((int)FacilityType.FireSensor_AnalogSmokeType);
            fires.Add((int)FacilityType.FireSensor_MonitoringType);
            fires.Add((int)FacilityType.Fire_S1);
            fires.Add((int)FacilityType.FireF1_S1);
            fires.Add((int)FacilityType.SecomFire);

            return fires;
        }

        public static List<int> GetETCTypeAllNumberToList()
        {
            List<int> etcs = new List<int>();
            etcs.Add((int)FacilityType.FIREWALL);
            etcs.Add((int)FacilityType.DOOR);
            etcs.Add((int)FacilityType.BLACKOUT);
            etcs.Add((int)FacilityType.STRONG_WIND);
            etcs.Add((int)FacilityType.SUBMERGENCY);
            etcs.Add((int)FacilityType.TERROR);
            etcs.Add((int)FacilityType.ETC);
            etcs.Add((int)FacilityType.Temp);
            etcs.Add((int)FacilityType.Humi);
            etcs.Add((int)FacilityType.CO2);
            etcs.Add((int)FacilityType.TVOC);
            etcs.Add((int)FacilityType.Dust_PM1);
            etcs.Add((int)FacilityType.Dust_PM2);
            etcs.Add((int)FacilityType.Dust_PM10);
            etcs.Add((int)FacilityType.AirPress);
            etcs.Add((int)FacilityType.Inclin_X);
            etcs.Add((int)FacilityType.Inclin_Y);
            etcs.Add((int)FacilityType.Vib_X);
            etcs.Add((int)FacilityType.Vib_Y);
            etcs.Add((int)FacilityType.Vib_Z);
            etcs.Add((int)FacilityType.Noise);
            etcs.Add((int)FacilityType.BLE_Count);
            etcs.Add((int)FacilityType.O2);
            etcs.Add((int)FacilityType.Value);
            etcs.Add((int)FacilityType.mA);
            etcs.Add((int)FacilityType.Contact);
            etcs.Add((int)FacilityType.Relay);
            etcs.Add((int)FacilityType.SVMS_Device_Event);

            // .TODO: 수소 타입추가
            etcs.Add((int)FacilityType.H2);
            etcs.Add((int)FacilityType.Temp);
            etcs.Add((int)FacilityType.Flow);
            etcs.Add((int)FacilityType.Conductivity);
            etcs.Add((int)FacilityType.GAS);

            return etcs;
        }

        public static List<int> GetPSMTypeAllNumberToList()
        {
            List<int> psms = new List<int>();
            psms.Add((int)FacilityType.PSM_SENSOR);
            psms.Add((int)FacilityType.HF);
            psms.Add((int)FacilityType.CO);
            psms.Add((int)FacilityType.HCL);
            psms.Add((int)FacilityType.CH3C);
            psms.Add((int)FacilityType.N2H4);
            psms.Add((int)FacilityType.CA);
            psms.Add((int)FacilityType.EA);
            psms.Add((int)FacilityType.VOC);
            psms.Add((int)FacilityType.H2O2);
            psms.Add((int)FacilityType.THC);
            psms.Add((int)FacilityType.HNO3);
            psms.Add((int)FacilityType.CL);
            psms.Add((int)FacilityType.TOLUENE);
            psms.Add((int)FacilityType.F2);
            psms.Add((int)FacilityType.NH3);
            psms.Add((int)FacilityType.LNG);
            psms.Add((int)FacilityType.PGMEA);
            psms.Add((int)FacilityType.H2S);
            psms.Add((int)FacilityType.CH4);
            psms.Add((int)FacilityType.OU);

            return psms;
        }

        public static List<int> GetSVMSTypeAllNumberToList()
        {
            List<int> psms = new List<int>();
            psms.Add((int)FacilityType.Intrusion_S1);
            psms.Add((int)FacilityType.Loiter_S1);
            psms.Add((int)FacilityType.Collapse_S1);
            psms.Add((int)FacilityType.Theft_S1);
            psms.Add((int)FacilityType.Neglect_S1);
            psms.Add((int)FacilityType.VirtualFence_S1);
            psms.Add((int)FacilityType.Fire_S1);
            psms.Add((int)FacilityType.EmergencyBell_S1);

            return psms;
        }

        public static List<int> GetEarthquakeTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.Earthquake);

            return types;
        }

        public static List<int> GetStrongWindTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.STRONG_WIND);

            return types;
        }

        public static List<int> GetBlackOutTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.BLACKOUT);

            return types;
        }

        public static List<int> GetLaserTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.Laser);

            return types;
        }

        public static List<int> GetDoorTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.DOOR);

            return types;
        }

        public static List<int> GetH2TypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.H2);

            return types;
        }

        public static List<int> GetFlowTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.Flow);

            return types;
        }

        public static List<int> GetTempTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.Temp);

            return types;
        }

        public static List<int> GetConductivityTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.Conductivity);

            return types;
        }

        public static List<int> GetGASTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.GAS);

            return types;
        }

        public static List<int> GetPressureTypeAllNumberToList()
        {
            List<int> types = new List<int>();
            types.Add((int)FacilityType.PRESSURE_SENSOR);

            return types;
        }

        #endregion

        // nFacilityType : DB 스키마에 정의된 값
        public static FacilityType ToFacilityType(int nFacilityType)
        {
            if (m_dicFacilityType == null)
            {
                var dicFacilityType = new Dictionary<int, FacilityType>();

                foreach (FacilityType type in Enum.GetValues(typeof(FacilityType)))
                {
                    dicFacilityType[(int)type] = type;
                }

                m_dicFacilityType = dicFacilityType;
            }

            FacilityType fType;

            if (m_dicFacilityType.TryGetValue(nFacilityType, out fType))
                return fType;

            return FacilityType.NONE;
        }

        public static string GetFacilityTypeShortString(FacilityType nType)
        {
            switch (nType)
            {
                case FacilityType.FIRE_SENSOR: return "화재";
                case FacilityType.ETC: return "기타";
                case FacilityType.PSM_SENSOR: return "누출";
            }

            return string.Empty;
        }

        public static string GetFacilityTypeShortEnString(FacilityType nType)
        {
            switch (nType)
            {
                case FacilityType.FIRE_SENSOR: return "Fire";
                case FacilityType.ETC: return "ETC";
                case FacilityType.PSM_SENSOR: return "Leak";
            }

            return string.Empty;
        }
    }
}
