using System;
using System.Collections.Generic;
using System.Text;

namespace AgentFactory.BLL
{
    public class ServerType
    {
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
            EmergencyBell_Nextronics,

            /// <summary>
            /// 하이닉스-강제 문열림
            /// </summary>
            Hynix_ForedDoorOpen = 951,
            /// <summary>
            /// 하이닉스-대리태깅
            /// </summary>
            Hynix_CheatedTagging,
            /// <summary>
            /// 하이닉스-꼬리물기
            /// </summary>
            Hynix_Untagging,
            /// <summary>
            /// 하이닉스-사원증도용
            /// </summary>
            Hynix_StealCard,
            /// <summary>
            /// 하이닉스-이상행위자
            /// </summary>
            Hynix_Stranger,
            /// <summary>
            /// 하이닉스-무인 보안검색 우회
            /// </summary>
            Hynix_EvasionItem,
            /// <summary>
            /// 하이닉스-비인가 구역 출입
            /// </summary>
            Hynix_NotPermittedPerson,
            /// <summary>
            /// 하이닉스-비인가 구역 반입
            /// </summary>
            Hynix_NotPermittedItem,

            /// <summary>
            /// 하이닉스-카드 태깅
            /// </summary>
            Hynix_CardTag,
            /// <summary>
            /// 하이닉스-스마트태그 태깅
            /// </summary>
            Hynix_SmartTag,


            /// <summary>
            /// 하이닉스-임계치 서버
            /// </summary>
            Hynix_LimitAlarm = 962,
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
                case ServerTypes.Hynix_ForedDoorOpen: return "하이닉스-강제 문열림";
                case ServerTypes.Hynix_CheatedTagging: return "하이닉스-대리태깅";
                case ServerTypes.Hynix_Untagging: return "하이닉스-꼬리물기";
                case ServerTypes.Hynix_StealCard: return "하이닉스-사원증도용";
                case ServerTypes.Hynix_Stranger: return "하이닉스-이상행위자";
                case ServerTypes.Hynix_EvasionItem: return "하이닉스-무인 보안검색 우회";
                case ServerTypes.Hynix_NotPermittedPerson: return "하이닉스-비인가 구역 출입";
                case ServerTypes.Hynix_NotPermittedItem: return "하이닉스-비인가 구역 반입";
                case ServerTypes.Hynix_CardTag: return "하이닉스-카드 태깅";
                case ServerTypes.Hynix_SmartTag: return "하이닉스-스마트태그 태깅";
                case ServerTypes.Hynix_LimitAlarm: return "하이닉스-임계치 서버";
            }

            return "";
        }
    }
}
