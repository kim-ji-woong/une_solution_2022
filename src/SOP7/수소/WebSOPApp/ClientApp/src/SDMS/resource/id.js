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

//import imgCloudy_Wonik from '../../Common/img/imgwonik/weather/cloudy.png';
//import imgCloudDay_Wonik from '../../Common/img/imgwonik/weather/cloud_day.png';
//import imgCloudNight_Wonik from '../../Common/img/imgwonik/weather/cloud_night.png';
//import imgHeavySnow_Wonik from '../../Common/img/imgwonik/weather/heavySnow.png';
//import imgSnow_Wonik from '../../Common/img/imgwonik/weather/snow.png';
//import imgSnowRain_Wonik from '../../Common/img/imgwonik/weather/snowRain.png';
//import imgHeavyRain_Wonik from '../../Common/img/imgwonik/weather/heavyRain.png';
//import imgRain_Wonik from '../../Common/img/imgwonik/weather/rain.png';
//import imgSunnyDay_Wonik from '../../Common/img/imgwonik/weather/sunny_day.png';
//import imgSunnyNight_Wonik from '../../Common/img/imgwonik/weather/sunny_night.png';
//import imgThunder_Wonik from '../../Common/img/imgwonik/weather/thunder.png';
//import imgDustStorm_Wonik from '../../Common/img/imgwonik/weather/dustStorm.png';
import { i18n } from "../../language/i18n";
import Sdms from "../ui/sdms";


export default class SdmsResource {
    static menu = {
        현황정보: "현황정보",
        현황정보창: "현황정보창",
        전체_CCTV: "전체 CCTV",
        CCTV_영상정보: "CCTV 영상정보",
        알람_CCTV: "알람 CCTV",
        알람_CCTV_1: "알람 CCTV_1",
        알람_CCTV_2: "알람 CCTV_2",
        알람_CCTV_3: "알람 CCTV_3",
        CCTV_APP: "CCTV_APP",
        대시보드: "대시보드",
        대시보드창: "대시보드창",
        이벤트_정보: "이벤트 정보",
        이벤트_정보창: "이벤트 정보창",
        미니맵: "미니맵",
        편집모드: "편집모드",
        수동신고: "수동신고",
        기상정보: "기상정보",
        현황정보_편집모드: "편집모드",
        정보: "정보",
        알람메모: "알람 메모",
        작업자현황: "작업자 현황",
        작업일지: "작업일지",
        센서현황: "센서 현황",
        작업자정보: "작업자 정보",
        인원현황: "인원 현황",
        안전구역_평가: "안전구역 평가",
        이력데이터: "이력 데이터",
        알람인원정보: "알람 인원 정보",
        // 수소 -------------------
        이상_탐지: "이상 탐지",
        시뮬레이션: "시뮬레이션",
        위험성_평가_예측: "위험성 평가 예측",
        복합센서: "복합센서",
        센서정보창: "센서정보창",
        토스트알람창: "토스트알람창",
        실시간위험요인: "실시간위험요인",
        // ----------------------- //
    }

    static adminMenu = {
        뷰포트_설정: "뷰포트 설정",
        POI_이동: "POI 이동",
        가벽: "가벽",
        화재센서_이동: "화재센서 이동",
        누출센서_이동: "누출센서 이동",
        기타센서_이동: "기타센서 이동",
        CCTV_이동: "CCTV 이동"
    }

    static PopupAniTime = 200;      // 팝업 Show, Hide 시간 설정

    static facilityType = {
        FIRE: 0,

        PRESSURE_SENSOR: 2,                 // 펌프압력

        CCTV: 3,                            // CCTV 

        PSM_SENSOR: 11,                     // 유해화학물질 누출감지 센서

        FIREWALL: 15,                       // 방화벽
        DOOR: 16,                           // 문
        BLACKOUT: 17,                       // 정전
        STRONG_WIND: 18,                    // 강풍
        WaterLevel: 19,                     // 침수
        Terror: 20,                         // 테러
        ETC: 21,                            // 기타

        Earthquake: 50,                     // 지진

        Collapse: 111,
        SOS: 112,
        Confined: 113,
        VirtualFence: 114,
        Becon_Stay: 115,                    // 비콘 체류알람
        Becon_SOS: 116,                     // 비콘 SOS

        Environment: 117,                   // 환경설비
        Manufacture: 118,                   // 제조설비
        EmergencyBell: 119,                 // 비상벨
        
        Laser: 120,                         // 레이저
        EXIT: 121,                          // 비상구

        Temp: 200,                          // 온도

        LowBattery: 252,                    // 배터리교체

        H2: 292,                            // 센코 고농도 수소
        Flow: 293,                          // 유량
        Conductivity: 294,                  // 전도도
        GAS: 295,                           // 가스

        H2JAG: 296,                        // JAG 가스 산소
        O2JAG: 297,                        // JAG 가스 수소

        H2Low_Senko: 298,                   // 센코 저농도 수소
        O2_Senko: 299,                      // 센코 산소

        Anomaly: 301,                       // 이상탐지
        Risk: 302,                          // 위험성 평가 예측



        Intrusion_S1: 900,                  // SVMS 침입
        Loiter_S1: 901,                     // SVMS 배회
        Collapse_S1: 902,                   // SVMS 쓰러짐
        Theft_S1: 903,                      // SVMS 도난
        Neglect_S1: 904,                    // SVMS 방치
        VirtualFence_S1: 905,               // SVMS 가상펜스
        Fire_S1: 906,                       // SVMS 화재
        SVMS_Device_Event: 908              // CCTV가 아닌 SVMS 장치 이벤트
    }

    static materialType = {
        PSM: 11,                            // 유해화학물질 누출감지 센서

        STRONG_WIND: 18,                   // 강풍

        ETC: 21,                            // 기타

        Earthquake: 50,                     // 지진 센서

        
    }

    static getFacilityTypeString(nType) {
        if (nType === SdmsResource.facilityType.H2)
            return i18n.t('facilityType.고농도수소');
        else if (nType === SdmsResource.facilityType.Temp)
            return i18n.t('facilityType.온도');     
        else if (nType === SdmsResource.facilityType.Flow)
            return i18n.t('facilityType.유량');
        else if (nType === SdmsResource.facilityType.Conductivity)
            return i18n.t('facilityType.전도도');
        else if (nType === SdmsResource.facilityType.GAS)
            return i18n.t('facilityType.가스');
        else if (nType === SdmsResource.facilityType.PRESSURE_SENSOR)
            return i18n.t('facilityType.압력');
        else if (nType === SdmsResource.facilityType.H2Low_Senko)
            return i18n.t('facilityType.저농도수소');
        else if (nType === SdmsResource.facilityType.O2_Senko)
            return i18n.t('facilityType.산소');
        else if (nType === SdmsResource.facilityType.H2JAG)
            return i18n.t('facilityType.산소가스');
        else if (nType === SdmsResource.facilityType.O2JAG)
            return i18n.t('facilityType.수소가스');

        return "";
    }
    /*
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
        if ((type >= SdmsResource.facilityType.FIREWALL && type <= SdmsResource.facilityType.ETC &&
            type != SdmsResource.facilityType.STRONG_WIND && type != SdmsResource.facilityType.BLACKOUT && type != SdmsResource.facilityType.DOOR) ||            
            type === SdmsResource.facilityType.SVMS_Device_Event)
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

    static isEletricSensorType(type) {
        if (type === SdmsResource.facilityType.BLACKOUT ||
            type === SdmsResource.facilityType.LowBattery)
            return true;

        return false;
    }

    static isFireSensorType(type) {
        return type === SdmsResource.facilityType.FIRE;
    }

    static isStrongWindSensorType(type) {
        return type === SdmsResource.facilityType.STRONG_WIND;
    }

    static isEarthquakeSensorType(type) {
        return type === SdmsResource.facilityType.Earthquake;
    }

    static isBlackOutSensorType(type) {
        return type === SdmsResource.facilityType.BLACKOUT;
    }

    static isEnvironmentSensorType(type) {
        return type === SdmsResource.facilityType.Environment;
    }

    static isManufactureSensorType(type) {
        return type === SdmsResource.facilityType.Manufacture;
    }

    static isEmergencyBellSensorType(type) {
        return type === SdmsResource.facilityType.EmergencyBell;
    }

    static isLowBatterySensorType(type) {
        return type === SdmsResource.facilityType.LowBattery;
    }

    static isWaterLevelSensorType(type) {
        return type === SdmsResource.facilityType.WaterLevel;
    }

    static isTerrorSensorType(type) {
        return type === SdmsResource.facilityType.Terror;
    }

    static isBeaconSensorType(type) {
        if (type === SdmsResource.facilityType.Becon_Stay ||
            type === SdmsResource.facilityType.Becon_SOS)
            return true;

        return false;
    }
    
    static isLaserSensorType(type) {
        if (type === SdmsResource.facilityType.Laser)
            return true;
        
        return false;
    }
    
    static isDoorSensorType(type) {
        if (type === SdmsResource.facilityType.DOOR)
            return true;

        return false;
    }
    */

    static isPressureSensorType(type) {
        return type === SdmsResource.facilityType.PRESSURE_SENSOR;
    }

    static isTempSensorType(type) {
        return type === SdmsResource.facilityType.Temp;
    }

    static isH2SensorType(type) {
        return type === SdmsResource.facilityType.H2;
    }

    static isH2LowSensorType(type) {
        return type === SdmsResource.facilityType.H2Low_Senko;
    }

    static isO2SensorType(type) {
        return type === SdmsResource.facilityType.O2_Senko;
    }

    static isFlowSensorType(type) {
        return type === SdmsResource.facilityType.Flow;
    }

    static isConductivitySensorType(type) {
        return type === SdmsResource.facilityType.Conductivity;
    }

    static isGASSensorType(type) {
        return type === SdmsResource.facilityType.GAS;
    }

    static isH2GasSensorType(type) {
        return type === SdmsResource.facilityType.H2JAG;
    }

    static isO2GasSensorType(type) {
        return type === SdmsResource.facilityType.O2JAG;
    }

    static isAnomalySensorType(type) {
        return type === SdmsResource.facilityType.Anomaly;
    }

    static isRiskSensorType(type) {
        return type === SdmsResource.facilityType.Risk;
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

    static getStateImageWonik(state) {
    //    if (state === SdmsResource.WeatherInfo.Sunshine) {
    //        if (SdmsResource.isDayLight()) {
    //            return imgSunnyDay_Wonik;
    //        }
    //        else {
    //            return imgSunnyNight_Wonik;
    //        }
    //    }
    //    else if (state === SdmsResource.WeatherInfo.Thunder) {
    //        return imgThunder_Wonik;
    //    }
    //    else if (state === SdmsResource.WeatherInfo.SnowRain) {
    //        return imgSnowRain_Wonik;
    //    }
    //    else if (state === SdmsResource.WeatherInfo.HeavySnow) {
    //        return imgHeavySnow_Wonik;
    //    }
    //    else if (state === SdmsResource.WeatherInfo.Snow) {
    //        return imgSnow_Wonik;
    //    }
    //    else if (state === SdmsResource.WeatherInfo.HeavyRain) {
    //        return imgHeavyRain_Wonik;
    //    }
    //    else if (state === SdmsResource.WeatherInfo.Rain) {
    //        return imgRain_Wonik;
    //    }
    //    else if (state === SdmsResource.WeatherInfo.Cloudy) {
    //        return imgCloudy_Wonik;
    //    }
    //    else if (state === SdmsResource.WeatherInfo.DustStorm) {
    //        return imgDustStorm_Wonik;
    //    }

    //    if (SdmsResource.isDayLight()) {
    //        return imgCloudDay_Wonik;
    //    }

        return imgCloudNight;
    }

    static getWeatherStateString(state) {
        if (state === SdmsResource.WeatherInfo.Sunshine) {
            return i18n.t('weather.맑음');
        }
        else if (state === SdmsResource.WeatherInfo.Thunder) {
            return i18n.t('weather.천둥번개');
        }
        else if (state === SdmsResource.WeatherInfo.SnowRain) {
            return i18n.t('weather.진눈깨비');
        }
        else if (state === SdmsResource.WeatherInfo.HeavySnow) {
            return i18n.t('weather.폭설');
        }
        else if (state === SdmsResource.WeatherInfo.Snow) {
            return i18n.t('weather.눈');
        }
        else if (state === SdmsResource.WeatherInfo.HeavyRain) {
            return i18n.t('weather.폭우');
        }
        else if (state === SdmsResource.WeatherInfo.Rain) {
            return i18n.t('weather.비');
        }
        else if (state === SdmsResource.WeatherInfo.Cloudy) {
            return i18n.t('weather.구름');
        }
        else if (state === SdmsResource.WeatherInfo.DustStorm) {
            return i18n.t('weather.황사');
        }

        if (SdmsResource.isDayLight()) {
            return i18n.t('weather.구름조금');
        }

        return i18n.t('weather.밤');
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
        statusInfoNew: 49,
        cctv: 50,
        dashboard: 51,
        dashboardPop: 51,
        eventInfo: 52,
        eventInfoNew: 52,
        miniMap: 53,
        manualReport: 54,
        weatherInfo: 55,
        editMode: 56,
        sensorStatus: 57,
        workerInfo: 48,
        workerPath: 48,


        cctvAlarm1: 49,
        cctvAlarm2: 50,
        cctvAlarm3: 51,
    }

    // SDMS 팝업 시스템 초기화 셋팅 값
    static popupResetLocation = {
        weatherInfo: {
            x: '0.5%', y: '6%', height: '180px', width: '320px'
        },
        statusInfo: {
            x: '82%', y: '5%', height: '', width: '320px'
        },
        statusInfoNew: {
            x: '82%', y: '5%', height: '900px', width: '346px'
        },
        buildingInfo: {
            x: '0.5%', y: '78%', height: '210px', width: '320px'
        },
        sensorInfo: {
            x: '0.5%', y: '78%', height: '160px', width: '320px'
        },
        dashboard: {
            x: '26%', y: '15%', height: '100%', width: '321px'
        },
        dashboardPop: {
            x: '83.33%', y: '5%', height: '900px', width: '320px'
        },
        miniMap: {
            x: '19%', y: '70%', height: '290px', width: '260px'
        },
        event: {
            x: '80%', y: '13%', height: '426px', width: '360px'
        },
        eventInfoNew: {
            x: '83.33%', y: '5%', height: '900px', width: '320px'
        },
        cctvInfo: {
            x: '80%', y: '57%', height: '380px', width: '360px'
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
        workerInfo: {
            x: '18%', y: '19%', height: '380px', width: '530px'
        },
        sensorStatus: {
            x: '59%', y: '19%', height: '550px', width: '380px'
        },
        workerStatus: {
            x: '62%', y: '34%', height: '500px', width: '320px'
        },
        workerStatusPopup: {
            x: '62%', y: '34%', height: '420px', width: '716px'
        },
        workerInfoSB:{
            x: '62%', y: '34%', height: '525px', width: '530px'
        },
        safetyAreaAssessment: {
            x: '18%', y: '26%', height: '741px', width: '432px'   /* height: '500px' */
        },
        historyData: {
            x: '8%', y: '26%', height: '741px', width: '432px'  
        },
        detectionInfo: {
            x: '18%', y: '26%', height: '837px', width: '1638px'
        },
        simulationInfo: {
            x: '90%', y: '26%', height: '432px', width: '470px'
        },
        analysisInfo: {
            x: '18%', y: '26%', height: '806px', width: '1378px'
        },
        waterLevelInfo: {
            x: '85%', y: '15%', height: '319px', width: '260px'
        },
        elevatorInfo: {
            x: '76%', y: '15%', height: '624px', width: '430px'
        },
        accessControl: {
            x: '76%', y: '15%', height: '356px', width: '360px'
        },
        parkingInfo: {
            x: '76%', y: '15%', height: '348px', width: '284px'
        },
        changeSensorName: {
            x: '76%', y: '15%', height: '180px', width: '260px'
        },
        alarmMemo: {
            x: '76%', y: '15%', height: '300px', width: '380px'
        },
        compoundData: {
            x: '5%', y: '47%', height: '265px', width: '321px'
        }
    }

    static BroadcastState = {
        None: 0,
        Run: 1,
        Stop: 2,
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        statusInfoNew: "statusInfoNew",
        cctvInfo: "cctvInfo",
        cctvInfo_1: "cctvInfo_1",
        cctvInfo_2: "cctvInfo_2",
        cctvInfo_3: "cctvInfo_3",
        buildingInfo: "buildingInfo",
        dashboard: "dashboard",
        dashboardPop: "dashboardPop",
        event: "event",
        eventInfoNew: "eventInfoNew",
        miniMap: "miniMap",
        weatherInfo: "weatherInfo",
        editModeStatusInfo: "editModeStatusInfo",
        manualReport: "manualReport",
        alarmMemo: "alarmMemo",
        workerInfo: "workerInfo",
        workerInfoSB: "workerInfoSB",
        sensorStatus: "sensorStatus",
        workerStatus: "workerStatus",
        workerStatusPopup: "workerStatusPopup",
        workerPath: "workerPath",
        workerDetailInfo: "workerDetailInfo",
        safetyAreaAssessment: "safetyAreaAssessment",
        historyData: "historyData",
        detectionInfo: "detectionInfo",
        simulationInfo: "simulationInfo",
        analysisInfo: "analysisInfo",
        waterLevelInfo: "waterLevelInfo",   // 집수정(경기)
        electricInfo: "electricInfo",       // 전력(경기)
        elevatorInfo: "elevatorInfo",       // 엘리베이터(경기)
        accessControl: "accessControl",     // 출입통제(경기)
        parkingInfo: "parkingInfo",         // 주차관제(경기)
        earthquakeInfo: "earthquakeInfo",   // 지진(경기)
        changeSensorName: "changeSensorName",
        compoundData: "compoundData",
        sensorInfo: "sensorInfo",
        riskFactorsInfo: "riskFactorsInfo",
    }

    static workerType = {
        Worker: null,               // 현재 인원
        Visitor: 1,                 // 현재 내방객

        YesterWorker: 2,            // 어제 인원
        PlanVisitor: 3,             // 예정 내방객
    }

    static zoneID = {
        outdoor: 20000,
    }

    static WonikWorker = {
        AssemblyID_H: 20000,
        AssemblyID_A: 20001,
        AssemblyID_C: 20002,
        AssemblyID_V: 20003,
        AssemblyID_S: 20004,

        CampusID_H: 3,
        CampusID_C: 2,
        CampusID_A: 1,
        CampusID_V: 5,
        CampusID_S: 4,
    }

    static AssessmentClass = {
        A: "A",
        B: "B",
        C: "C",
        D: "D",
        E: "E"
    }

    static assessmentType = {
        eqZone: 1,
        environ: 2
    };

    static waterLevel = {
        default: 0,
        low: 1,
        high: 2
    }

    static simulationFacilityType = {
        electrolysis: "electrolysis",
        calvera: "calvera",
        compressor: "compressor",
        mediumPressureTank: "mediumPressureTank", // 중압탱크 (임의지정)
        fiba: "fiba",
        dispenser1: "dispenser1",
        vehicle1: "vehicle1",
        dispenser2: "dispenser2",
        vehicle2: "vehicle2",
    }

    // 위험성 평가 예측
    static analysisIgnitionType = {
        fire: "fire",
        explosion: "explosion"
    }

    static analysisFacilityType = {
        전체: "전체",
        Node1: "Node1",
        Node2: "Node2",
        Node3_1: "Node3-1",
        Node3_2: "Node3-2",
        Node3_3: "Node3-3",
        Node4: "Node4",
        Node5: "Node5",
        Node6_1: "Node6-1",
        Node6_2: "Node6-2",
        Node6_3: "Node6-3",
        Node7: "Node7",
        Node8: "Node8",
        Node9: "Node9",
        Node10: "Node10",
        E1: "E1",
        E2: "E2",
        E3_1: "E3-1",
        E3_2: "E3-2",
        E3_3: "E3-3",
        E4_1: "E4-1",
        E4_2: "E4-2",
        E4_3: "E4-3",
        E5: "E5"
    }

    static analysisProcessParamType = {
        밸브개도율: "밸브개도율",
        산소농도: "산소농도(O2%)",
        수소농도: "수소농도(LEL%)",
        압력: "압력",
        압력강하율: "압력강하율(누설지표)",
        온도: "온도",
        유량: "유량",
        진동: "진동",
        차압: "차압"
    }

    static analysisDeviationType = {
        오동작: "오동작",
        밸브_닫힘_고착: "밸브 닫힘 고착",
        밸브_열림_고착: "밸브 열림 고착",
        고유량: "고유량(High)",
        맥동_요동: "맥동 / 요동",
        무압: "무압(Zero)",
        무유량: "무유량(No Flow)",
        미검출: "미검출(센서 고장)",
        상승: "상승(High)",
        역류: "역류(Reverse)",
        저유량: "저유량(Low)",
        저하: "저하(Low)",
        증가: "증가(High)"
    }
}