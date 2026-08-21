import ProjectResource from "../../Root/resource/id";

import imgCloudy from '../../Common/img/weather/cloudy.png';
import imgCloudDay from '../../Common/img/weather/cloud_day.png';
import imgCloudNight from '../../Common/img/weather/cloud_night.png';
import imgHeavySnow from '../../Common/img/weather/heavySnow.png';
import imgSnow from '../../Common/img/weather/snow.png';
import imgSnowRain from '../../Common/img/weather/snowRain.png';
import imgHeavyRain from '../../Common/img/weather/heavyRain.png';
import imgRain from '../../Common/img/weather/rain.png';
import imgSunnyDay from '../../Common/img/weather/sunny_day.png';
import imgSunnyNight from '../../Common/img/weather/sunny_night.png';
import imgThunder from '../../Common/img/weather/thunder.png';
import imgDustStorm from '../../Common/img/weather/dustStorm.png';

export default class SdmsResource {
    static get ID() {
        return SdmsResource.id[ProjectResource.targetLanguage];
    }

    static UISection = "UI_Section";

    static PopupAniTime = 200;      // 팝업 Show, Hide 시간 설정

    static id = {
        "ko": {
            projectName: "SDMS",

            menu:
            {
                statusInfo: "현황정보", /* yeosu */
                allCCTV: "전체 CCTV",
                cctv: "CCTV 영상정보",
                alarmCCTV: "알람 CCTV",
                alarmCCTV1: "알람 CCTV_1",
                alarmCCTV2: "알람 CCTV_2",
                alarmCCTV3: "알람 CCTV_3",
                dashboard: "대시보드",
                eventInfo: "이벤트 정보", /* yeosu */
                miniMap: "미니맵", /* yeosu */
                editMode: "편집모드",
                manualReport: "수동신고",
                weatherInfo: "기상정보",
                editModeStatusInfo: "편집모드",
                buildingInfo: "정보",
                alarmMemo: "알람메모",
                detailInfo: "상세정보", /* yeosu */
                sensorStatus: "센서정보 현황",
                navInfo: "네비게이션바", /* yeosu */
                poiEditInfo: "POI편집모드", /* yeosu */
                atmospherePopup: "대기유해물질 상세정보",
                waterQualityPopup: "수질 상세정보",
                weatherPopup: "통합기상 상세정보",
                bacteriaPopup: '악취 상세정보',
                vocInfo: "VOC 분석시스템",
                vocDetailInfo: "VOC",
                cctvPopup: "지능형 환경감지 CCTV",
                dataInfo: "공공데이터",
                view360Popup: "360카메라 이미지 뷰어"
            },

            buildingInfo:
            {
                buildingGroupType: "건물그룹",
                buildingType: "건물",
                equipmentType: "설비",
                sensorInfo: "센서정보",
                outdoor: "외부 영역",
            },
            common:
            {
                confirm: "확인",
                cancel: "취소"
            },
            broadcast:
            {
                on: "방송장비의 알람상태를 동작시키며, 방송을 진행하게 됩니다.",
                onInfo: ["방송장비의 알람상태를 동작합니다.", "방송을 진행하게 됩니다.", "계속 할까요?"],
                close: "방송장비의 알람상태를 해제하며, 진행중인 방송이 있으면 종료시킵니다.",
                closeInfo: ["방송장비의 알람상태를 해제합니다.", "진행중인 방송이 있으면 즉시 종료됩니다.", "계속 할까요?"],
                onBroadcast: "방송시작",
                closeBroadcast: "방송종료"
            },
            errorMessage:
            {
                loadFailFacilityInfo: "설비 정보를 불러올 수 없습니다.",
                loadFailBuildingData: "건물 정보를 불러올 수 없습니다.",
                loadFailBuildingGroupData: "건물그룹 정보를 불러올 수 없습니다."
            }
        }
    }

    static AtmosphereData = {
        header: "Atmosphere",
        group: "대기센서",
        alarmType: "대기오염"
    };

    static WeatherData = {
        header: "Weather",
        group: "기상센서"
    };

    static WaterData = {
        header: "Water",
        group: "수질센서",
        alarmType: "수질오염"
    };

    static VocData = {
        header: "VOC",
        group: "VOC센서",
        alarmType: "기준초과"
    }

    static StinkData = {
        header: "OU",
        group: "악취센서",
        alarmType: "기준초과"
    }

    static facilityType = {
        FIRE: 0,

        PSM_SENSOR: 11,        // 유해화학물질 누출감지 센서

        FIREWALL: 15,                      // 방화벽

        ETC: 21,                           // 기타

        Intrusion_S1: 900,                    // SVMS 침입
        Loiter_S1: 901,                       // SVMS 배회
        Collapse_S1: 902,                     // SVMS 쓰러짐
        Theft_S1: 903,                        // SVMS 도난
        Neglect_S1: 904,                      // SVMS 방치
        VirtualFence_S1: 905,                 // SVMS 가상펜스
        Fire_S1: 906,                         // SVMS 화재
    }

    static materialType = {
        PSM: 11,        // 유해화학물질 누출감지 센서

        ETC: 21,                           // 기타

        // Soulbrain 공장설비
        Temp: 200,
        Humi: 201,
        CO2: 202,
        TVOC: 203,
        Dust_PM1: 204,
        Dust_PM2: 205,
        Dust_PM10: 206,
        AirPress: 207,
        Inclin_X: 208,
        Inclin_Y: 209,
        Vib_X: 210,
        Vib_Y: 211,
        Vib_Z: 212,
        Noise: 213,
        BLE_Count: 214,
        HF: 215,
        CO: 216,
        O2: 217,
        Value: 218,
        mA: 219,
        Contact: 220,
        Relay: 221,
        HCL: 222,
        CH3C: 223,
        N2H4: 224,
        CA: 225,
        EA: 226,
        VOC: 227,
        H2O2: 228,
        THC: 229,
        HNO3: 230,
        CL: 231,
        TOLUENE: 232,
        F2: 233,
        NH3: 234,
        LNG: 235,
        PGMEA: 236,
        H2S: 237,
        pH: 238,
        AUTO: 239,
        GATE1_OPEN: 240,
        GATE1_CLOSE: 241,
        GATE1_RATE: 242,
        GATE1_FAULT: 243,
        GATE2_OPEN: 244,
        GATE2_CLOSE: 245,
        GATE2_RATE: 246,
        GATE2_FAULT: 247,
        BATTERY: 248,
        OPERATION: 249,
        WATER_TEMP: 250,
        SCRUBBER: 251,
        F: 252,
        H2: 253,
        CL2: 254,
        C2H6O: 255,
        Flame: 256,
        Leak: 257,
        LEL: 258,
        TEPO: 259,
        CONNECT: 260,
        Wind_Dir: 261,
        Wind_Speed: 262,
        Rainfall: 263,
        Solar: 264,
        EC: 265,
        DO: 266,
        Turbidity: 267,
        
        // 여수 VOC 센서 Material Type
        _2_2_Dimethylbutane: 301,
        _3_Methylpentane: 302,
        _1_Hexene: 303,
        n_Hexane: 304,
        Benzene: 305,
        Cyclohexane: 306,
        _2_Methylhexane: 307,
        _2_3_Dimethylpentane: 308,
        _3_Methylhexane: 309,
        _2_2_4_Trimethylpentane: 310,
        n_Heptane: 311,
        Methylcyclohexane: 312,
        _2_3_4_Trimethylpentane: 313,
        Toluene: 314,
        _2_Methylheptane: 315,
        _3_Methylheptane: 316,
        n_Octane: 317,
        Ethylbenzene: 318,
        m_p_Xylene: 319,
        Styrene: 320,
        o_Xylene: 321,
        n_Nonane: 322,
        i_Propylbenzene: 323,
        n_Propylbenzene: 324,
        m_Ethyltoluene: 325,
        p_Ethyltoluene: 326,
        _1_3_5_Trimethylbenzene: 327,
        o_Ethyltoluene: 328,
        _1_2_4_Trimethylbenzene: 329,
        n_Decane: 330,
        _1_2_3_Trimethylbenzene: 331,
        m_Diethylbenzene: 332,
        p_Diethylbenzene: 333,
        n_Undecane: 334,
        n_Dodecan: 335,
        Ethane: 336,
        Ethene: 337,
        Propane: 338,
        Propene: 339,
        i_Butane: 340,
        n_Butane: 341,
        Acetylene: 342,
        trans_2_Buten: 343,
        _1_Butene: 344,
        cis_2_Butene: 345,
        Cyclopentane: 346,
        i_Pentane: 347,
        n_Pentane: 348,
        Butadiene: 349,
        trans_2_Pentene: 350,
        _1_Pentene: 351,
        cis_2_Pentene: 352,
        _2_2_DimethylbutaneVOC: 353,
        Methylcyclopentane: 354,
        _2_3_Dimethylbutane: 355,
        _2_Methylpentane: 356,
        _3_MethylpentaneVOC: 357,
        n_HexaneVOC: 358,
        Isoprene: 359,
        _1_HexeneVOC: 360,
        _2_4_Dimethylpentane: 361,

        // 악취 센서
        
        OU: 401,
    }

    static getFacilityTypeString(nType) {
        if (nType === SdmsResource.facilityType.FIRE)
            return "화재센서";
        else if (nType === SdmsResource.facilityType.PSM_SENSOR)
            return "누출";
        else if (nType === SdmsResource.facilityType.ETC)
            return "물질기상";
        //else if (nType === SdmsResource.facilityType.ETC)
        //    return "기타";
        else if (nType === SdmsResource.materialType.Temp)
            return "온도";
        else if (nType === SdmsResource.materialType.Humi)
            return "습도";
        else if (nType === SdmsResource.materialType.CO2)
            return "이산화탄소";
        else if (nType === SdmsResource.materialType.TVOC)
            return "TVOC";
        else if (nType === SdmsResource.materialType.Dust_PM1)
            return "미세먼지(PM 1.0)";
        else if (nType === SdmsResource.materialType.Dust_PM2)
            return "미세먼지(PM 2.5)";
        else if (nType === SdmsResource.materialType.Dust_PM10)
            return "미세먼지(PM 10)";
        else if (nType === SdmsResource.materialType.AirPress)
            return "기압";
        else if (nType === SdmsResource.materialType.Inclin_X)
            return "기울기(X)";
        else if (nType === SdmsResource.materialType.Inclin_Y)
            return "기울기(Y)";
        else if (nType === SdmsResource.materialType.Vib_X)
            return "진동(X)";
        else if (nType === SdmsResource.materialType.Vib_Y)
            return "진동(Y)";
        else if (nType === SdmsResource.materialType.Vib_Z)
            return "진동(Z)";
        else if (nType === SdmsResource.materialType.Noise)
            return "소음";
        else if (nType === SdmsResource.materialType.BLE_Count)
            return "BLE Count";
        else if (nType === SdmsResource.materialType.HF)
            return "불화수소";
        else if (nType === SdmsResource.materialType.CO)
            return "일산화탄소";
        else if (nType === SdmsResource.materialType.O2)
            return "산소";
        else if (nType === SdmsResource.materialType.Value)
            return "ESH_v5.1 측정값";
        else if (nType === SdmsResource.materialType.mA)
            return "mA";
        else if (nType === SdmsResource.materialType.Contact)
            return "접점";
        else if (nType === SdmsResource.materialType.Relay)
            return "릴레이";
        else if (nType === SdmsResource.materialType.HCL)
            return "염화수소";
        else if (nType === SdmsResource.materialType.CH3C)
            return "초산";
        else if (nType === SdmsResource.materialType.N2H4)
            return "하이드라진";
        else if (nType === SdmsResource.materialType.CA)
            return "CA Gas";
        else if (nType === SdmsResource.materialType.EA)
            return "에틸알콜";
        else if (nType === SdmsResource.materialType.VOC)
            return "VOC";
        else if (nType === SdmsResource.materialType.H2O2)
            return "과수";
        else if (nType === SdmsResource.materialType.THC)
            return "에탄올";
        else if (nType === SdmsResource.materialType.HNO3)
            return "질산";
        else if (nType === SdmsResource.materialType.CL)
            return "염소가스";
        else if (nType === SdmsResource.materialType.TOLUENE)
            return "톨루엔";
        else if (nType === SdmsResource.materialType.F2)
            return "불소";
        else if (nType === SdmsResource.materialType.NH3)
            return "암모니아";
        else if (nType === SdmsResource.materialType.LNG)
            return "액화천연가스";
        else if (nType === SdmsResource.materialType.PGMEA)
            return "유기가스";
        else if (nType === SdmsResource.materialType.H2S)
            return "황화수소";
        else if (nType === SdmsResource.materialType.pH)
            return "pH";
        else if (nType === SdmsResource.materialType.AUTO)
            return "자동모드";
        else if (nType === SdmsResource.materialType.GATE1_OPEN)
            return "수문1 열림";
        else if (nType === SdmsResource.materialType.GATE1_CLOSE)
            return "수문1 닫힘";
        else if (nType === SdmsResource.materialType.GATE1_RATE)
            return "수문1 개도율";
        else if (nType === SdmsResource.materialType.GATE1_FAULT)
            return "수문1 FAULT";
        else if (nType === SdmsResource.materialType.GATE2_OPEN)
            return "수문2 열림";
        else if (nType === SdmsResource.materialType.GATE2_CLOSE)
            return "수문2 닫힘";
        else if (nType === SdmsResource.materialType.GATE2_RATE)
            return "수문2 개도율";
        else if (nType === SdmsResource.materialType.GATE2_FAULT)
            return "수문2 FAULT";
        else if (nType === SdmsResource.materialType.BATTERY)
            return "배터리";
        else if (nType === SdmsResource.materialType.OPERATION)
            return "동작상태";
        else if (nType === SdmsResource.materialType.WATER_TEMP)
            return "수온";
        else if (nType === SdmsResource.materialType.SCRUBBER)
            return "스크러버";
        else if (nType === SdmsResource.materialType.F)
            return "F";
        else if (nType === SdmsResource.materialType.H2)
            return "수소";
        else if (nType === SdmsResource.materialType.CL2)
            return "CL2";
        else if (nType === SdmsResource.materialType.C2H6O)
            return "C2H6O";
        else if (nType === SdmsResource.materialType.Flame)
            return "Flame";
        else if (nType === SdmsResource.materialType.Leak)
            return "Leak";
        else if (nType === SdmsResource.materialType.LEL)
            return "LEL";
        else if (nType === SdmsResource.materialType.TEPO)
            return "TEPO";
        else if (nType === SdmsResource.materialType.CONNECT)
            return "통신상태";
        else if (nType === SdmsResource.materialType.Wind_Dir)
            return "풍향";
        else if (nType === SdmsResource.materialType.Wind_Speed)
            return "풍속";
        else if (nType === SdmsResource.materialType.Rainfall)
            return "강수량";
        else if (nType === SdmsResource.materialType.Solar)
            return "일사량";
        else if (nType === SdmsResource.materialType.EC)
            return "전기전도도";
        else if (nType === SdmsResource.materialType.DO)
            return "용존산소";
        else if (nType === SdmsResource.materialType.Turbidity)
            return "탁도";

        // VOC 
        else if (nType === SdmsResource.materialType._2_2_Dimethylbutane)
            return "2-2,디메틸뷰테인";
        else if (nType === SdmsResource.materialType._3_Methylpentane) 
            return "3-메틸펜테인";
        else if (nType === SdmsResource.materialType._1_Hexene) 
            return "1-헥센";
        else if (nType === SdmsResource.materialType.n_Hexane) 
            return "n-헥세인";
        else if (nType === SdmsResource.materialType.Benzene) 
            return "벤젠";
        else if (nType === SdmsResource.materialType.Cyclohexane) 
            return "씨클로헥세인";
        else if (nType === SdmsResource.materialType._2_Methylhexane)  
            return "2-메틸헥세인";
        else if (nType === SdmsResource.materialType._2_3_Dimethylpentane) 
            return "2-3-디메틸펜테인";
        else if (nType === SdmsResource.materialType._3_Methylhexane)  
            return "3-메틸헥세인";
        else if (nType === SdmsResource.materialType._2_2_4_Trimethylpentane)  
            return "2-2-4-트리메틸펜테인";
        else if (nType === SdmsResource.materialType.n_Heptane) 
            return "n-헵테인";
        else if (nType === SdmsResource.materialType.Methylcyclohexane)  
            return "메틸싸이클로헥세인";
        else if (nType === SdmsResource.materialType._2_3_4_Trimethylpentane) 
            return "2-3-4-트리메틸펜테인";
        else if (nType === SdmsResource.materialType.Toluene)  
            return "톨루엔";
        else if (nType === SdmsResource.materialType._2_Methylheptane)  
            return "2-메틸헵테인";
        else if (nType === SdmsResource.materialType._3_Methylheptane)  
            return "3-메틸헵테인";
        else if (nType === SdmsResource.materialType.n_Octane)  
            return "n-옥테인";
        else if (nType === SdmsResource.materialType.Ethylbenzene)  
            return "n-옥테인";
        else if (nType === SdmsResource.materialType.m_p_Xylene)  
            return "m-p-자일렌";
        else if (nType === SdmsResource.materialType.Styrene)  
            return "스티렌";
        else if (nType === SdmsResource.materialType.o_Xylene)  
            return "o-자일렌";
        else if (nType === SdmsResource.materialType.n_Nonane) 
            return "n-노네인";
        else if (nType === SdmsResource.materialType.i_Propylbenzene)
            return "i-프로필벤젠";
        else if (nType === SdmsResource.materialType.n_Propylbenzene) 
            return "n-프로필벤젠";
        else if (nType === SdmsResource.materialType.m_Ethyltoluene) 
            return "m-에틸톨루엔";
        else if (nType === SdmsResource.materialType.p_Ethyltoluene) 
            return "p-에틸톨루엔";
        else if (nType === SdmsResource.materialType._1_3_5_Trimethylbenzene) 
            return "1-3-5-트리메틸벤젠";
        else if (nType === SdmsResource.materialType.o_Ethyltoluene) 
            return "o-에틸톨루엔";
        else if (nType === SdmsResource.materialType._1_2_4_Trimethylbenzene) 
            return "1-2-4-트리메틸벤젠";
        else if (nType === SdmsResource.materialType.n_Decane)  
            return "n-데케인";
        else if (nType === SdmsResource.materialType._1_2_3_Trimethylbenzene)  
            return "1-2-3-트리메틸벤젠";
        else if (nType === SdmsResource.materialType.m_Diethylbenzene)
            return "m-다이에틸벤젠";
        else if (nType === SdmsResource.materialType.p_Diethylbenzene)  
            return "p-다이에틸벤젠";
        else if (nType === SdmsResource.materialType.n_Undecane)  
            return "n-운데케인";
        else if (nType === SdmsResource.materialType.n_Dodecan)  
            return "n-도데케인";
        else if (nType === SdmsResource.materialType.Ethane) 
            return "에탄";
        else if (nType === SdmsResource.materialType.Ethene) 
            return "에텐";
        else if (nType === SdmsResource.materialType.Propane) 
            return "프로페인";
        else if (nType === SdmsResource.materialType.Propene) 
            return "프로펜";
        else if (nType === SdmsResource.materialType.i_Butane) 
            return "i-뷰테인";
        else if (nType === SdmsResource.materialType.n_Butane)
            return "n-뷰테인";
        else if (nType === SdmsResource.materialType.Acetylene) 
            return "아세틸렌";
        else if (nType === SdmsResource.materialType.trans_2_Buten) 
            return "트랜스-2-뷰텐";
        else if (nType === SdmsResource.materialType._1_Butene)
            return "1-뷰텐";
        else if (nType === SdmsResource.materialType.cis_2_Butene)
            return "cis-2-뷰텐";
        else if (nType === SdmsResource.materialType.Cyclopentane) 
            return "시클로펜테인";
        else if (nType === SdmsResource.materialType.i_Pentane) 
            return "i-펜테인";
        else if (nType === SdmsResource.materialType.n_Pentane) 
            return "n-펜테인";
        else if (nType === SdmsResource.materialType.Butadiene)
            return "뷰타디엔";
        else if (nType === SdmsResource.materialType.trans_2_Pentene)
            return "trnas-2-펜텐";
        else if (nType === SdmsResource.materialType._1_Pentene)
            return "1-펜텐";
        else if (nType === SdmsResource.materialType.cis_2_Pentene)
            return "cis-2-펜텐";
        else if (nType === SdmsResource.materialType._2_2_DimethylbutaneVOC)
            return "2-2-디메틸뷰테인VOC";
        else if (nType === SdmsResource.materialType._2_3_Dimethylbutane)
            return "2-3-디메틸뷰테인";
        else if (nType === SdmsResource.materialType._2_Methylpentane)
            return "2-메틸펜테인";
        else if (nType === SdmsResource.materialType._3_MethylpentaneVOC)
            return "3-메틸펜테인VOC";
        else if (nType === SdmsResource.materialType.Methylcyclopentane)
            return "메틸시클로펜테인";
        else if (nType === SdmsResource.materialType.n_HexaneVOC) 
            return "n-헥세인VOC";
        else if (nType === SdmsResource.materialType.Isoprene)
            return "이소프렌";
        else if (nType === SdmsResource.materialType._1_HexeneVOC) 
            return "1-헥센VOC";
        else if (nType === SdmsResource.materialType._2_4_Dimethylpentane)
            return "2-4-디메틸펜테인";
        // VOC END
        else if (nType === SdmsResource.materialType.OU)
            return "복합악취"

        else if (nType === SdmsResource.facilityType.Intrusion_S1)
            return "지능형영상(침입)";
        else if (nType === SdmsResource.facilityType.Loiter_S1)
            return "지능형영상(배회)";
        else if (nType === SdmsResource.facilityType.Collapse_S1)
            return "지능형영상(쓰러짐)";
        else if (nType === SdmsResource.facilityType.Theft_S1)
            return "지능형영상(도난)";
        else if (nType === SdmsResource.facilityType.Neglect_S1)
            return "지능형영상(방치)";
        else if (nType === SdmsResource.facilityType.VirtualFence_S1)
            return "지능형영상(가상펜스)";
        else if (nType === SdmsResource.facilityType.Fire_S1)
            return "지능형영상(화재)";

        return "";
    }

    static isSVMSSensorType(type) {
        if (type === SdmsResource.facilityType.Intrusion_S1 ||
            type === SdmsResource.facilityType.Loiter_S1 ||
            type === SdmsResource.facilityType.Collapse_S1 ||
            type === SdmsResource.facilityType.Theft_S1 ||
            type === SdmsResource.facilityType.Neglect_S1 ||
            type === SdmsResource.facilityType.VirtualFence_S1 ||
            type === SdmsResource.facilityType.Fire_S1 ||
            type === SdmsResource.facilityType.EmergencyBell_S1)
            return true;

        return false;
    }

    static isETCSensorType(type) {
        if ((type >= SdmsResource.facilityType.FIREWALL && type <= SdmsResource.facilityType.ETC) ||
            type === SdmsResource.materialType.Temp ||
            type === SdmsResource.materialType.Humi ||
            type === SdmsResource.materialType.CO2 ||
            type === SdmsResource.materialType.TVOC ||
            type === SdmsResource.materialType.Dust_PM1 ||
            type === SdmsResource.materialType.Dust_PM2 ||
            type === SdmsResource.materialType.Dust_PM10 ||
            type === SdmsResource.materialType.AirPress ||
            type === SdmsResource.materialType.Inclin_X ||
            type === SdmsResource.materialType.Inclin_Y ||
            type === SdmsResource.materialType.Vib_X ||
            type === SdmsResource.materialType.Vib_Y ||
            type === SdmsResource.materialType.Vib_Z ||
            type === SdmsResource.materialType.Noise ||
            type === SdmsResource.materialType.BLE_Count ||
            type === SdmsResource.materialType.O2 ||
            type === SdmsResource.materialType.Value ||
            type === SdmsResource.materialType.mA ||
            type === SdmsResource.materialType.Contact ||
            type === SdmsResource.materialType.Relay ||
            type === SdmsResource.materialType.pH ||
            type === SdmsResource.materialType.AUTO ||
            type === SdmsResource.materialType.GATE1_OPEN ||
            type === SdmsResource.materialType.GATE1_CLOSE ||
            type === SdmsResource.materialType.GATE1_RATE ||
            type === SdmsResource.materialType.GATE1_FAULT ||
            type === SdmsResource.materialType.GATE2_OPEN ||
            type === SdmsResource.materialType.GATE2_CLOSE ||
            type === SdmsResource.materialType.GATE2_RATE ||
            type === SdmsResource.materialType.GATE2_FAULT ||
            type === SdmsResource.materialType.BATTERY ||
            type === SdmsResource.materialType.OPERATION ||
            type === SdmsResource.materialType.WATER_TEMP ||
            type === SdmsResource.materialType.SCRUBBER ||
            type === SdmsResource.materialType.Flame ||
            type === SdmsResource.materialType.Leak ||
            type === SdmsResource.materialType.LEL ||
            type === SdmsResource.materialType.CONNECT)
            return true;

        return false;
    }

    static isPSMSensorType(type) {
        if (type === SdmsResource.facilityType.PSM_SENSOR ||
            type === SdmsResource.materialType.HF ||
            type === SdmsResource.materialType.CO ||
            type === SdmsResource.materialType.HCL ||
            type === SdmsResource.materialType.CH3C ||
            type === SdmsResource.materialType.N2H4 ||
            type === SdmsResource.materialType.CA ||
            type === SdmsResource.materialType.EA ||
            type === SdmsResource.materialType.VOC ||
            type === SdmsResource.materialType.H2O2 ||
            type === SdmsResource.materialType.THC ||
            type === SdmsResource.materialType.HNO3 ||
            type === SdmsResource.materialType.CL ||
            type === SdmsResource.materialType.TOLUENE ||
            type === SdmsResource.materialType.F2 ||
            type === SdmsResource.materialType.NH3 ||
            type === SdmsResource.materialType.LNG ||
            type === SdmsResource.materialType.PGMEA ||
            type === SdmsResource.materialType.H2S ||
            type === SdmsResource.materialType.F ||
            type === SdmsResource.materialType.H2 ||
            type === SdmsResource.materialType.CL2 ||
            type === SdmsResource.materialType.C2H6O ||
            type === SdmsResource.materialType.TEPO)
            return true;

        return false;
    }

    static WeatherInfo = {
        Unknown: 0,
        Sunshine: 1,
        Thunder: 2,
        SnowRain: 3,
        HeavySnow: 4,
        Snow: 5,
        HeavyRain: 6,
        Rain: 7,
        Cloudy: 8,
        Cloud: 9,
        DustStorm: 10,
        FineDust: 11,
    }

    static getStateImage(state) {
        if (state === SdmsResource.WeatherInfo.Sunshine) {
            if (SdmsResource.isDayLight()) {
                return imgSunnyDay;
            }
            else {
                return imgSunnyNight;
            }
            //return imgSunshine;
        }
        else if (state === SdmsResource.WeatherInfo.Thunder) {
            return imgThunder;
        }
        else if (state === SdmsResource.WeatherInfo.SnowRain) {
            return imgSnowRain;
        }
        else if (state === SdmsResource.WeatherInfo.HeavySnow) {
            return imgHeavySnow;
        }
        else if (state === SdmsResource.WeatherInfo.Snow) {
            return imgSnow;
        }
        else if (state === SdmsResource.WeatherInfo.HeavyRain) {
            return imgHeavyRain;
        }
        else if (state === SdmsResource.WeatherInfo.Rain) {
            return imgRain;
        }
        else if (state === SdmsResource.WeatherInfo.Cloudy) {
            return imgCloudy;
        }
        else if (state === SdmsResource.WeatherInfo.DustStorm) {
            return imgDustStorm;
        }

        if (SdmsResource.isDayLight()) {
            return imgCloudDay;
        }

        return imgCloudNight;
    }

    static getWeatherStateString(state) {
        if (state === SdmsResource.WeatherInfo.Sunshine) {
            return "맑음";
        }
        else if (state === SdmsResource.WeatherInfo.Thunder) {
            return "천둥번개";
        }
        else if (state === SdmsResource.WeatherInfo.SnowRain) {
            return "진눈깨비";
        }
        else if (state === SdmsResource.WeatherInfo.HeavySnow) {
            return "폭설";
        }
        else if (state === SdmsResource.WeatherInfo.Snow) {
            return "눈";
        }
        else if (state === SdmsResource.WeatherInfo.HeavyRain) {
            return "폭우";
        }
        else if (state === SdmsResource.WeatherInfo.Rain) {
            return "비";
        }
        else if (state === SdmsResource.WeatherInfo.Cloudy) {
            return "구름";
        }
        else if (state === SdmsResource.WeatherInfo.DustStorm) {
            return "황사";
        }

        if (SdmsResource.isDayLight()) {
            return "구름조금";
        }

        return "밤";
    }

    static isDayLight() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 6 || hour >= 19) {
            return false;
        }

        return true;
    }

    static quickBtn = {
        statusInfo: 49,
        cctv: 50,
        dashboard: 51,
        eventInfo: 52,
        miniMap: 53,
        manualReport: 54,
        weatherInfo: 55,
        editMode: 56,

        cctvAlarm1: 49,
        cctvAlarm2: 50,
        cctvAlarm3: 51,
    }

    // SDMS 팝업 시스템 초기화 셋팅 값
    static popupResetLocation = {
        weatherInfo: {
            x: '96%', y: '6.5%', height: '100px', width: '270px' 
        },
        statusInfo: {
            x: '0.5%', y: '26%', height: '390px', width: '322px'
        },
        buildingInfo: {
            x: '0.5%', y: '78%', height: '210px', width: '320px'
        },
        dashboard: {
            x: '48%', y: '3%', height: '40px', width: '1367px'
        },
        miniMap: {
            x: '19%', y: '70%', height: '270px', width: '360px'
        },
        event: {
            x: '80.8%', y: '13%', height: '425px', width: '360px'
        },
        cctvInfo: {
            x: '80.8%', y: '57%', height: '380px', width: '360px'
        },
        cctvInfo_1: {
            x: '60%', y: '57%', height: '380px', width: '360px'
        },
        cctvInfo_2: {
            x: '40%', y: '57%', height: '380px', width: '360px'
        },
        cctvInfo_3: {
            x: '20%', y: '57%', height: '380px', width: '360px'
        },
        detailInfo: {
            x: '20%', y: '60%', height: '249px', width: '373px'
        },
        sensorStatus: {
            x: '20%', y: '60%', height: '0px', width: '600px'
        },
        navInfo: {
            x: '180%', y: '70%', height: '38px', width: '255px' 
        },
        poiEditInfo: {
            x: '20%', y: '80%', height: '463px', width: '372px'
        },
        eventInfo: {
            x: '80%', y: '15%', height: '570px', width: '359px'
            //x: '80.8%', y: '15%', height: '570px', width: '359px'
        },
        atmospherePopup: {
            x: '80.8%', y: '15%', height: '280px', width: '373px'
        },
        waterQualityPopup: {
            x: '80.8%', y: '15%', height: '356px', width: '373px'
        },
        weatherPopup: {
            x: '80.8%', y: '15%', height: '502px', width: '373px'
        },
        vocInfo: {
            x: '80.8%', y: '15%', height: '410px', width: '532px'
        },
        vocDetailInfo: {
            x: '90%', y: '15%', height: '630px', width: '417px'
            //x: '80.8%', y: '15%', height: '630px', width: '440px'
        },
        cctvPopup: {
            x: '80.8%', y: '15%', height: '427px', width: '373px'
        },
        dataInfo: {
            x: '80.8%', y: '15%', height: '545px', width: '373px'
        },
        bacteriaPopup: {
            x: '90%', y: '15%', height: '280px', width: '373px'
        },
    }

    static BroadcastState = {
        None: 0,
        Run: 1,
        Stop: 2,
    }

    static popupLayer = {
        statusInfo: "statusInfo", /* yeosu */
        cctvInfo: "cctvInfo",
        cctvInfo_1: "cctvInfo_1",
        cctvInfo_2: "cctvInfo_2",
        cctvInfo_3: "cctvInfo_3",
        buildingInfo: "buildingInfo",
        dashboard: "dashboard",
        event: "event", /* yeosu */
        eventInfo: "eventInfo", /* yeosu */
        miniMap: "miniMap", /* yeosu */
        weatherInfo: "weatherInfo", 
        editModeStatusInfo: "editModeStatusInfo",
        manualReport: "manualReport",
        alarmMemo: "alarmMemo",
        detailInfo: "detailInfo", /* yeosu */
        sensorStatus: "sensorStatus",
        navInfo: "navInfo", /* yeosu */
        poiEditInfo: "poiEditInfo", /* yeosu */
        atmospherePopup: "atmospherePopup",
        waterQualityPopup: "waterQualityPopup",
        weatherPopup: "weatherPopup",
        vocInfo: "vocInfo",
        vocDetailInfo: "vocDetailInfo",
        cctvPopup: "cctvPopup",
        dataInfo: "dataInfo",
        atmosphereCityPopup: "atmosphereCityPopup",
        cleanSYSPopup: "cleanSYSPopup",
        view360Popup: "view360Popup",
        bacteriaPopup: "bacteriaPopup",
    }

    static thresholds = {

        // 0번 인덱스 = 기준치 역순 여부 0: 정 , 1: 역

        // 대기 센서 오염도 기준
        206: [0, 30, 80, 150],
        205: [0, 15, 35, 75],
        254: [0, 1000, 4000, 6000],
        237: [0, 5, 20, 60],
        234: [0, 500, 1000, 3000],
        203: [0, 300, 800, 2000],
        222: [0, 1000, 4000, 6000],

        // 수질 센서 오염도 기준
        250: [0, 20 ,39 ,50],
        238: [0, 5, 7, 8.6],
        266: [1, 7.5, 5, 2],
        267: [0, 0.5, 0.8, 0.99],

        // VOC 센서 오염도 기준
        // 301: [0, 1.2, 3.6, 10.8],
        // 302: [0, 1.2, 3.6, 10.8],
        // 303: [0, 1.2, 3.6, 10.8],
        // 304: [0, 0.18, 0.54, 1.62],
        // 305: [0, 0.0015, 0.0045, 0.0135],
        // 306: [0, 1.6, 4.8, 14.4],
        // 307: [0, 1.2, 3.6, 10.8],
        // 308: [0, 1.2, 3.6, 10.8],
        // 309: [0, 1.2, 3.6, 10.8],
        // 310: [0, 1.2, 3.6, 10.8],
        // 311: [0, 1.2, 3.6, 10.8],
        // 312: [0, 1.2, 3.6, 10.8],
        // 313: [0, 1.2, 3.6, 10.8],
        // 314: [0, 1.2, 3.6, 10.8],
        // 315: [0, 1.2, 3.6, 10.8],
        // 316: [0, 1.2, 3.6, 10.8],
        // 317: [0, 1.2, 3.6, 10.8],
        // 318: [0, 0.2, 0.6, 1.8],
        // 319: [0, 0.02, 0.06, 0.18],
        // 320: [0, 0.2, 0.6, 1.8],
        // 321: [0, 0.02, 0.06, 0.18],
        // 322: [0, 1.2, 3.6, 10.8],
        // 323: [0, 1.2, 3.6, 10.8],
        // 324: [0, 1.2, 3.6, 10.8],
        // 325: [0, 1.2, 3.6, 10.8],
        // 326: [0, 1.2, 3.6, 10.8],
        // 327: [0, 0.06, 0.18, 0.54],
        // 328: [0, 1.2, 3.6, 10.8],
        // 329: [0, 0.06, 0.18, 0.54],
        // 330: [0, 1.2, 3.6, 10.8],
        // 331: [0, 0.06, 0.18, 0.54],
        // 332: [0, 1.2, 3.6, 10.8],
        // 333: [0, 1.2, 3.6, 10.8],
        // 334: [0, 1.2, 3.6, 10.8],
        // 335: [0, 1.2, 3.6, 10.8],
        // 336: [0, 1.2, 3.6, 10.8],
        // 337: [0, 1.2, 3.6, 10.8],
        // 338: [0, 1.2, 3.6, 10.8],
        // 339: [0, 1.2, 3.6, 10.8],
        // 340: [0, 1.2, 3.6, 10.8],
        // 341: [0, 1.2, 3.6, 10.8],
        // 342: [0, 1.2, 3.6, 10.8],
        // 343: [0, 1.2, 3.6, 10.8],
        // 344: [0, 1.2, 3.6, 10.8],
        // 345: [0, 1.2, 3.6, 10.8],
        // 346: [0, 1.2, 3.6, 10.8],
        // 347: [0, 1.2, 3.6, 10.8],
        // 348: [0, 1.2, 3.6, 10.8],
        // 349: [0, 0.0008, 0.0024, 0.0072],
        // 350: [0, 1.2, 3.6, 10.8],
        // 351: [0, 1.2, 3.6, 10.8],
        // 352: [0, 1.2, 3.6, 10.8],
        // 353: [0, 1.2, 3.6, 10.8],
        // 354: [0, 1.2, 3.6, 10.8],
        // 355: [0, 1.2, 3.6, 10.8],
        // 356: [0, 1.2, 3.6, 10.8],
        // 357: [0, 1.2, 3.6, 10.8],
        // 358: [0, 0.18, 0.54, 1.62],
        // 359: [0, 1.2, 3.6, 10.8],
        // 360: [0, 1.2, 3.6, 10.8],
        // 361: [0, 1.2, 3.6, 10.8],
        301: [0, 1300, 3700, 10900],
        302: [0, 1300, 3700, 10900],
        303: [0, 1300, 3700, 10900],
        304: [0, 190, 550, 1630],
        305: [0, 1.5, 4.6, 13.6],
        306: [0, 1700, 4900, 14500],
        307: [0, 1300, 3700, 10900],
        308: [0, 1300, 3700, 10900],
        309: [0, 1300, 3700, 10900],
        310: [0, 1300, 3700, 10900],
        311: [0, 1300, 3700, 10900],
        312: [0, 1300, 3700, 10900],
        313: [0, 1300, 3700, 10900],
        314: [0, 1300, 3700, 10900],
        315: [0, 1300, 3700, 10900],
        316: [0, 1300, 3700, 10900],
        317: [0, 1300, 3700, 10900],
        318: [0, 300, 700, 1900],
        319: [0, 300, 700, 1900],
        320: [0, 300, 700, 1900],
        321: [0, 300, 700, 1900],
        322: [0, 1300, 3700, 10900],
        323: [0, 1300, 3700, 10900],
        324: [0, 1300, 3700, 10900],
        325: [0, 1300, 3700, 10900],
        326: [0, 1300, 3700, 10900],
        327: [0, 70, 190, 550],
        328: [0, 1300, 3700, 10900],
        329: [0, 70, 190, 550],
        330: [0, 1300, 3700, 10900],
        331: [0, 70, 190, 550],
        332: [0, 1300, 3700, 10900],
        333: [0, 1300, 3700, 10900],
        334: [0, 1300, 3700, 10900],
        335: [0, 1300, 3700, 10900],
        336: [0, 1300, 3700, 10900],
        337: [0, 1300, 3700, 10900],
        338: [0, 1300, 3700, 10900],
        339: [0, 1300, 3700, 10900],
        340: [0, 1300, 3700, 10900],
        341: [0, 1300, 3700, 10900],
        342: [0, 1300, 3700, 10900],
        343: [0, 1300, 3700, 10900],
        344: [0, 1300, 3700, 10900],
        345: [0, 1300, 3700, 10900],
        346: [0, 1300, 3700, 10900],
        347: [0, 1300, 3700, 10900],
        348: [0, 1300, 3700, 10900],
        349: [0, 0.9, 2.5, 7.3],
        350: [0, 1300, 3700, 10900],
        351: [0, 1300, 3700, 10900],
        352: [0, 1300, 3700, 10900],
        353: [0, 1300, 3700, 10900],
        354: [0, 1300, 3700, 10900],
        355: [0, 1300, 3700, 10900],
        356: [0, 1300, 3700, 10900],
        357: [0, 1300, 3700, 10900],
        358: [0, 190, 550, 1630],
        359: [0, 1300, 3700, 10900],
        360: [0, 1300, 3700, 10900],
        361: [0, 1300, 3700, 10900],


        // 악취 -- 복합악취 = 희석배수 둘중에 하나 아무거나 사용
        400: [0, 5, 15, 30], 
        401: [0, 5, 15, 30],
    }

}