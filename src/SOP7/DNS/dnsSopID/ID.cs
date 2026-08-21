namespace dnsSopID
{
    public class Header
    {
        // 탐지신호
        public const int SENSOR_DATA = 100;
        // 탐지신호(테스트)
        public const int SENSOR_DATA_TEST = 101;
        // 오동작처리
        public const int SENSOR_MALFUNCTION = 102;
        // 신호복구
        public const int SENSOR_USER_RESET = 103;
        // 재난신고
        public const int MANUAL_REPORT = 104;
        // 재난신고 해제
        public const int CLEAR_MANUAL_REPORT = 105;
        // 모든 신호 해제
        public const int CLEAR_DETECT_ALL = 109;
        // 하루 경과한 알람 복구
        public const int TIMEOUT = 110;

        // 기타 센서
        public const int ETC_SENSOR_DETECT = 125;
        public const int ETC_SENSOR_DATA_INT = 126;
        public const int ETC_SENSOR_DATA_DOUBLE = 127;
        public const int ETC_SENSOR_DATA_STRING = 128;

        // 상황 전파
        public const int SITUATION_NOTICE = 129;
        // SOP 진행 상황
        public const int SOP_RUN = 130;

        public const int RELOAD_ALARMS = 1000;


        // 수동신고를 위한 Zone ID
        // ex) ManualReportDefaultID + FacilityType
        //     화재 : ManualReportDefaultID + FacilityType.FIRE_SENSOR = 1000000
        //     누출 : ManualReportDefaultID + FacilityType.PSM_SENSOR = 1000011
        public const int ManualReportDefaultID = 1000000;
    }

    public class ErrorMessageType
    {
        public const int SUCCESS = 0;
        public const int SERVICE_IS_CLOSED = 1;
        public const int NULL_CLIENT_CONTEXT = 2;
        public const int UNKNOWN_CLIENT = 3;
        public const int UNKNOWN_HEADER = 4;
        public const int INVALID_MESSAGE = 5;
        public const int UNKNOWN_SENSOR_ID = 6;
        public const int DB_EXCEPTION = 7;
        public const int CAN_NOT_SEND_SMS = 8;
        public const int NO_SENSORZONE_HISTORY_ALARM = 9;
        public const int ALREADY_PROCESSED = 10;
        public const int INVALID_ID_OR_PASSWORD = 11;
        public const int ALREADY_USING_ID = 12;
        public const int UNKNOWN_CONFIG = 13;
        public const int NO_PERMISSION = 14;
        public const int NO_OTHER_CLIENTS = 15;
        public const int UNKNOWN_COMMAND = 16;
        public const int NO_SUCH_ALARM = 17;

        public static string ToMessage(int nErrorType)
        {
            switch (nErrorType)
            {
                case SUCCESS:
                    return "성공";

                case SERVICE_IS_CLOSED:
                    return "서비스가 종료되었습니다.";

                case NULL_CLIENT_CONTEXT:
                    return "Null Client Context";

                case UNKNOWN_CLIENT:
                    return "알려지지 않은 클라이언트 타입입니다.";

                case UNKNOWN_HEADER:
                    return "알려지지 않은 메시지 헤더입니다.";

                case INVALID_MESSAGE:
                    return "형식에 맞지않는 메시지입니다.";

                case UNKNOWN_SENSOR_ID:
                    return "알수없는 센서 ID 입니다.";

                case DB_EXCEPTION:
                    return "Database 예외가 발생하였습니다.";

                case CAN_NOT_SEND_SMS:
                    return "문자메시지를 발송할 수 없습니다.";

                case NO_SENSORZONE_HISTORY_ALARM:
                    return "SensorZoneHistory ID에 해당하는 알람이 존재하지 않습니다.";

                case ALREADY_PROCESSED:
                    return "이미 처리되었습니다.";

                case INVALID_ID_OR_PASSWORD:
                    return "잘못된 아이디 혹은 비밀번호입니다.";

                case ALREADY_USING_ID:
                    return "이미 사용중인 ID입니다.";

                case UNKNOWN_CONFIG:
                    return "알수없는 설정값입니다.";

                case NO_PERMISSION:
                    return "권한이 없습니다.";

                case NO_OTHER_CLIENTS:
                    return "다른 클라이언트가 존재하지 않습니다.";

                case UNKNOWN_COMMAND:
                    return "알려지지 않은 command 입니다.";
            }

            return "";
        }
    }

    public class DATA_TYPE
    {
        public const byte NULL = 0;
        public const byte INT = 1;
        public const byte INT_LIST = 2;
        public const byte FLOAT = 3;
        public const byte FLOAT_LIST = 4;
        public const byte DOUBLE = 5;
        public const byte DOUBLE_LIST = 6;
        public const byte STRING = 7;
        public const byte STRING_LIST_BEGIN = 8;
        public const byte STRING_LIST_END = 9;
        public const byte LONG = 10;
        public const byte LONG_LIST = 11;
        public const byte BOOLEAN = 12;
        public const byte BOOLEAN_LIST = 13;
        public const byte SHORT = 14;
        public const byte SHORT_LIST = 15;
        public const byte BYTE = 16;
        public const byte BYTE_ARRAY = 17;
        public const byte DATETIME = 18;
    }

    public class ID
    {
        // SensorType_업체명
        public enum ServerTypes
        {
            None = 0,
            /// <summary>
            /// 화재-동방
            /// </summary>
            Fire_Johnson = 1,
            /// <summary>
            /// 화재-지멘스
            /// </summary>
            Fire_Siemens,
            /// <summary>
            /// CCTV-S1_SVMS
            /// </summary>
            CCTV_S1_SVMS,
            /// <summary>
            /// 날씨
            /// </summary>
            Weather,
            /// <summary>
            /// 누출-센코
            /// </summary>
            PSM_Senko,
            /// <summary>
            /// 화재-비상방송 프로토콜
            /// </summary>
            Fire_EmergencyBroadcast,
            /// <summary>
            /// CCTV-신일테크 열화상 카메라
            /// </summary>
            CCTV_ShinilTech,
            /// <summary>
            /// 접점신호
            /// </summary>
            ContactSignal,
            /// <summary>
            /// 비상벨-엠피아
            /// </summary>
            EmergencyBell_MPia,
            /// <summary>
            /// MES-한솔코에버
            /// </summary>
            MES_Hansol,
            /// <summary>
            /// 작업자,가스센서-에스웨이엠
            /// </summary>
            Worker_SWayM,
            /// <summary>
            /// 화재-세이프시스템
            /// </summary>
            Fire_Safesystem,
            /// <summary>
            /// 로지-설비-집수정(수위 측정)
            /// </summary>
            Fms_SumpPit_Lozi,
            /// <summary>
            /// 비상벨-ITSeng
            /// </summary>
            EmergencyBell_ITSeng,
            /// <summary>
            /// 비상벨-샘물정보통신
            /// </summary>
            EmergencyBell_Smcom,
            /// <summary>
            /// 화재-태산전자
            /// </summary>
            Fire_Taesan,
            Elevator_HD,
            Earthquake_GG,
            UPS_GG,
            Mqtt_Corners,
            /// <summary>
            /// 출입통제 - DDS Security
            /// </summary>
            Door_DDS,
            Exit,
            /// <summary>
            /// 주차관제 - RS Solution
            /// </summary>
            ParkingGate_rs,
            Terror,
            /// <summary>
            /// 전력-신용보증재단
            /// </summary>
            Blackout_GG_F,
            /// <summary>
            /// 설비-집수정-신용보증재단
            /// </summary>
            Fms_SumpPit_GG_F,
            /// <summary>
            /// 올라이트 화재
            /// </summary>
            Fire_AllLite,
            /// <summary>
            /// 전원테크 화재
            /// </summary>
            Fire_JTECH,
            /// <summary>
            /// 전력-경기도서관
            /// </summary>
            Blackout_GG_D,
            /// <summary>
            /// 설비-집수정-경기도서관
            /// </summary>
            Fms_SumpPit_GG_D,
            /// <summary>
            /// 이레씨즈 비상벨-경기도서관
            /// </summary>
            EmergencyBell_Eraeseeds,
            /// <summary>
            /// 전력-계영정보통신
            /// </summary>
            Blackout_Gyeyoung,
            /// <summary>
            /// 출입통제 - Suprema api
            /// </summary>
            Door_Biostar,
            Elevator_OTIS,
            Elevator_IBMS,
            /// <summary>
            /// 비상벨-교육청
            /// </summary>
            EmergencyBell_GGEducation,
            /// <summary>
            /// 전력-교육청
            /// </summary>
            Blackout_GG_G,
            /// <summary>
            /// 화재-GH,복합시설관
            /// </summary>
            Fire_Singwang,
            /// <summary>
            /// 비상벨-주택도시공사, 복합시설관
            /// </summary>
            EmergencyBell_Nextronics
        }

        public static string GetServerText(ServerTypes id)
        {
            switch (id)
            {
                case ServerTypes.None: return "None";
                case ServerTypes.Fire_Johnson: return "화재-동방";
                case ServerTypes.Fire_Siemens: return "화재-지멘스";
                case ServerTypes.CCTV_S1_SVMS: return "CCTV-S1-SVMS";
                case ServerTypes.Weather: return "날씨-기상청";
                case ServerTypes.PSM_Senko: return "누출-센코";
                case ServerTypes.Fire_EmergencyBroadcast: return "화재-비상방송 프로토콜";
                case ServerTypes.CCTV_ShinilTech: return "열화상카메라-신일테크";
                case ServerTypes.ContactSignal: return "접점신호";
                case ServerTypes.EmergencyBell_MPia: return "비상벨-엠피아";
                case ServerTypes.MES_Hansol: return "MES-한솔코에버";
                case ServerTypes.Worker_SWayM: return "작업자,가스센서-에스웨이엠";
                case ServerTypes.Fire_Safesystem: return "화재-세이프시스템";
                case ServerTypes.Fms_SumpPit_Lozi: return "로지-설비-집수정";
                case ServerTypes.EmergencyBell_ITSeng: return "비상벨-ITSeng";
                case ServerTypes.EmergencyBell_Smcom: return "비상벨-샘물정보통신";
                case ServerTypes.Fire_Taesan: return "화재-태산전자";
                case ServerTypes.Elevator_HD: return "엘리베이터-현대";
                case ServerTypes.Earthquake_GG: return "지진-경기주택도시공사";
                case ServerTypes.UPS_GG: return "전력-경기도의회";
                case ServerTypes.Mqtt_Corners: return "MQTT-코너스";
                case ServerTypes.Door_DDS: return "출입통제-DDS";
                case ServerTypes.Exit: return "비상구";
                case ServerTypes.ParkingGate_rs: return "주차관제-RS";
                case ServerTypes.Blackout_GG_F: return "전력-신용보증재단";
                case ServerTypes.Fms_SumpPit_GG_F: return "설비-집수정-신용보증재단";
                case ServerTypes.Fire_AllLite: return "화재-올라이트";
                case ServerTypes.Fire_JTECH: return "화재-전원테크";
                case ServerTypes.Blackout_GG_D: return "전력-경기도서관";
                case ServerTypes.Fms_SumpPit_GG_D: return "설비-집수정-경기도서관";
                case ServerTypes.EmergencyBell_Eraeseeds: return "이레씨즈 비상벨-경기도서관";
                case ServerTypes.Door_Biostar: return "출입통제 - Suprema";
                case ServerTypes.Elevator_OTIS: return "엘리베이터-OTIS";
                case ServerTypes.Elevator_IBMS: return "엘리베이터-IBMS";
                case ServerTypes.EmergencyBell_GGEducation: return "비상벨-교육청";
                case ServerTypes.Blackout_GG_G: return "전력-교육청";
                case ServerTypes.Fire_Singwang: return "화재-신광전자";
                case ServerTypes.EmergencyBell_Nextronics: return "비상벨-넥스트로닉스";
            }

            return "";
        }
    }
}
