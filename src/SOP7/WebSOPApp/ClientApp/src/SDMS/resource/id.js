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

import imgCloudy_Wonik from '../../Common/img/imgwonik/weather/cloudy.png';
import imgCloudDay_Wonik from '../../Common/img/imgwonik/weather/cloud_day.png';
import imgCloudNight_Wonik from '../../Common/img/imgwonik/weather/cloud_night.png';
import imgHeavySnow_Wonik from '../../Common/img/imgwonik/weather/heavySnow.png';
import imgSnow_Wonik from '../../Common/img/imgwonik/weather/snow.png';
import imgSnowRain_Wonik from '../../Common/img/imgwonik/weather/snowRain.png';
import imgHeavyRain_Wonik from '../../Common/img/imgwonik/weather/heavyRain.png';
import imgRain_Wonik from '../../Common/img/imgwonik/weather/rain.png';
import imgSunnyDay_Wonik from '../../Common/img/imgwonik/weather/sunny_day.png';
import imgSunnyNight_Wonik from '../../Common/img/imgwonik/weather/sunny_night.png';
import imgThunder_Wonik from '../../Common/img/imgwonik/weather/thunder.png';
import imgDustStorm_Wonik from '../../Common/img/imgwonik/weather/dustStorm.png';
import { i18n } from "../../language/i18n";
import Sdms from "../ui/sdms";

export default class SdmsResource {
    static menu = {
        현황정보: "현황정보",
        전체_CCTV: "전체 CCTV",
        CCTV_영상정보: "CCTV 영상정보",
        알람_CCTV: "알람 CCTV",
        알람_CCTV_1: "알람 CCTV_1",
        알람_CCTV_2: "알람 CCTV_2",
        알람_CCTV_3: "알람 CCTV_3",
        CCTV_APP: "CCTV_APP",
        대시보드: "대시보드",
        이벤트_정보: "이벤트 정보",
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
        과속감지_이력: "과속감지 이력",
        // 수소 -------------------
        이상_탐지: "이상 탐지",
        시뮬레이션: "시뮬레이션",
        위험도_분석: "위험도 분석",
        // ----------------------- //
        // 경기 -------------------
        집수정: "집수정",
        전력량정보: "전력량 정보",
        엘리베이터: "엘리베이터",
        출입통제: "출입통제",
        주차관제: "주차관제",
        지진: "지진",
        // 천원궁 청심박물관 -------------------
        센서명_변경: "센서명_변경"
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
        
        CCTV: 3,                            // CCTV 

        PSM_SENSOR: 11,                     // 유해화학물질 누출감지 센서

        FIREWALL: 15,                       // 방화벽
        DOOR: 16,                           // 문
        BLACKOUT: 17,                       // 정전 - 전력
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

        LowBattery: 252,                    // 배터리교체 (UPS) - 전력

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
    }

    static getFacilityTypeString(nType) {
        if (nType === SdmsResource.facilityType.FIRE)
            return i18n.t('facilityType.화재');
        else if (nType === SdmsResource.facilityType.PSM_SENSOR)
            return i18n.t('facilityType.누출');
        else if (nType === SdmsResource.facilityType.BLACKOUT)
            return i18n.t('facilityType.정전');
        else if (nType === SdmsResource.facilityType.STRONG_WIND)
            return i18n.t('facilityType.강풍');
        else if (nType === SdmsResource.facilityType.ETC)
            return i18n.t('facilityType.기타');
        else if (nType === SdmsResource.facilityType.Earthquake)
            return i18n.t('facilityType.지진');
        else if (nType === SdmsResource.facilityType.Becon_Stay)
            return i18n.t('facilityType.비콘_체류');
        else if (nType === SdmsResource.facilityType.Becon_SOS)
            return i18n.t('facilityType.비콘_SOS');
        else if (nType === SdmsResource.facilityType.Laser)
            return i18n.t('facilityType.레이저');
        else if (nType === SdmsResource.facilityType.DOOR)
            return i18n.t('facilityType.도어');
        else if (nType === SdmsResource.materialType.Temp)
            return i18n.t('materialType.온도');
        else if (nType === SdmsResource.materialType.Humi)
            return i18n.t('materialType.습도');
        else if (nType === SdmsResource.materialType.CO2)
            return i18n.t('materialType.이산화탄소');
        else if (nType === SdmsResource.materialType.TVOC)
            return 'TVOC';
        else if (nType === SdmsResource.materialType.Dust_PM1)
            return i18n.t('materialType.미세먼지(PM 1.0)');
        else if (nType === SdmsResource.materialType.Dust_PM2)
            return i18n.t('materialType.미세먼지(PM 2.5)');
        else if (nType === SdmsResource.materialType.Dust_PM10)
            return i18n.t('materialType.미세먼지(PM 10)');
        else if (nType === SdmsResource.materialType.AirPress)
            return i18n.t('materialType.기압');
        else if (nType === SdmsResource.materialType.Inclin_X)
            return i18n.t('materialType.기울기(X)');
        else if (nType === SdmsResource.materialType.Inclin_Y)
            return i18n.t('materialType.기울기(Y)');
        else if (nType === SdmsResource.materialType.Vib_X)
            return i18n.t('materialType.진동(X)');
        else if (nType === SdmsResource.materialType.Vib_Y)
            return i18n.t('materialType.진동(Y)');
        else if (nType === SdmsResource.materialType.Vib_Z)
            return i18n.t('materialType.진동(Z)');
        else if (nType === SdmsResource.materialType.Noise)
            return i18n.t('materialType.소음');
        else if (nType === SdmsResource.materialType.BLE_Count)
            return i18n.t('materialType.BLE Count');
        else if (nType === SdmsResource.materialType.HF)
            return i18n.t('materialType.불화수소');
        else if (nType === SdmsResource.materialType.CO)
            return i18n.t('materialType.일산화탄소');
        else if (nType === SdmsResource.materialType.O2)
            return i18n.t('materialType.산소');
        else if (nType === SdmsResource.materialType.Value)
            return i18n.t('materialType.ESH_v5.1 측정값');
        else if (nType === SdmsResource.materialType.mA)
            return 'mA';
        else if (nType === SdmsResource.materialType.Contact)
            return i18n.t('materialType.접점');
        else if (nType === SdmsResource.materialType.Relay)
            return i18n.t('materialType.릴레이');
        else if (nType === SdmsResource.materialType.HCL)
            return i18n.t('materialType.염화수소');
        else if (nType === SdmsResource.materialType.CH3C)
            return i18n.t('materialType.초산');
        else if (nType === SdmsResource.materialType.N2H4)
            return i18n.t('materialType.하이드라진');
        else if (nType === SdmsResource.materialType.CA)
            return 'CA Gas';
        else if (nType === SdmsResource.materialType.EA)
            return i18n.t('materialType.에틸알콜');
        else if (nType === SdmsResource.materialType.VOC)
            return i18n.t('materialType.VOC');
        else if (nType === SdmsResource.materialType.H2O2)
            return i18n.t('materialType.과수');
        else if (nType === SdmsResource.materialType.THC)
            return i18n.t('materialType.에탄올');
        else if (nType === SdmsResource.materialType.HNO3)
            return i18n.t('materialType.질산');
        else if (nType === SdmsResource.materialType.CL)
            return i18n.t('materialType.염소가스');
        else if (nType === SdmsResource.materialType.TOLUENE)
            return i18n.t('materialType.톨루엔');
        else if (nType === SdmsResource.materialType.F2)
            return i18n.t('materialType.불소');
        else if (nType === SdmsResource.materialType.NH3)
            return i18n.t('materialType.암모니아');
        else if (nType === SdmsResource.materialType.LNG)
            return i18n.t('materialType.액화천연가스');
        else if (nType === SdmsResource.materialType.PGMEA)
            return i18n.t('materialType.유기가스');
        else if (nType === SdmsResource.materialType.H2S)
            return i18n.t('materialType.황화수소');
        else if (nType === SdmsResource.materialType.pH)
            return 'pH';
        else if (nType === SdmsResource.materialType.AUTO)
            return i18n.t('materialType.자동모드');
        else if (nType === SdmsResource.materialType.GATE1_OPEN)
            return i18n.t('materialType.수문1 열림');
        else if (nType === SdmsResource.materialType.GATE1_CLOSE)
            return i18n.t('materialType.수문1 닫힘');
        else if (nType === SdmsResource.materialType.GATE1_RATE)
            return i18n.t('materialType.수문1 개도율');
        else if (nType === SdmsResource.materialType.GATE1_FAULT)
            return i18n.t('materialType.수문1 FAULT');
        else if (nType === SdmsResource.materialType.GATE2_OPEN)
            return i18n.t('materialType.수문2 열림');
        else if (nType === SdmsResource.materialType.GATE2_CLOSE)
            return i18n.t('materialType.수문2 닫힘');
        else if (nType === SdmsResource.materialType.GATE2_RATE)
            return i18n.t('materialType.수문2 개도율');
        else if (nType === SdmsResource.materialType.GATE2_FAULT)
            return i18n.t('materialType.수문2 FAULT');
        else if (nType === SdmsResource.materialType.BATTERY)
            return i18n.t('materialType.배터리');
        else if (nType === SdmsResource.materialType.OPERATION)
            return i18n.t('materialType.동작상태');
        else if (nType === SdmsResource.materialType.WATER_TEMP)
            return i18n.t('materialType.수온');
        else if (nType === SdmsResource.materialType.SCRUBBER)
            return i18n.t('materialType.스크러버');
        else if (nType === SdmsResource.materialType.F)
            return 'F';
        else if (nType === SdmsResource.materialType.H2)
            return i18n.t('materialType.수소');
        else if (nType === SdmsResource.materialType.CL2)
            return 'CL2';
        else if (nType === SdmsResource.materialType.C2H6O)
            return 'C2H6O';
        else if (nType === SdmsResource.materialType.Flame)
            return 'Flame';
        else if (nType === SdmsResource.materialType.Leak)
            return 'Leak';
        else if (nType === SdmsResource.materialType.LEL)
            return 'LEL';
        else if (nType === SdmsResource.materialType.TEPO)
            return 'TEPO';
        else if (nType === SdmsResource.materialType.CONNECT)
            return i18n.t('materialType.통신상태');
        else if (nType === SdmsResource.facilityType.Intrusion_S1)
            return i18n.t('facilityType.지능형영상(침입)');
        else if (nType === SdmsResource.facilityType.Loiter_S1)
            return i18n.t('facilityType.지능형영상(배회)');
        else if (nType === SdmsResource.facilityType.Collapse_S1)
            return i18n.t('facilityType.지능형영상(쓰러짐)');
        else if (nType === SdmsResource.facilityType.Theft_S1)
            return i18n.t('facilityType.지능형영상(도난)');
        else if (nType === SdmsResource.facilityType.Neglect_S1)
            return i18n.t('facilityType.지능형영상(방치)');
        else if (nType === SdmsResource.facilityType.VirtualFence_S1)
            return i18n.t('facilityType.지능형영상(가상펜스)');
        else if (nType === SdmsResource.facilityType.Fire_S1)
            return i18n.t('facilityType.지능형영상(화재)');
        else if (nType === SdmsResource.facilityType.Environment)
            return i18n.t('facilityType.환경설비');
        else if (nType === SdmsResource.facilityType.Manufacture)
            return i18n.t('facilityType.제조설비');
        else if (nType === SdmsResource.facilityType.EmergencyBell)
            return i18n.t('facilityType.비상벨');

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
        if ((type >= SdmsResource.facilityType.FIREWALL && type <= SdmsResource.facilityType.ETC &&
            type != SdmsResource.facilityType.STRONG_WIND && type != SdmsResource.facilityType.BLACKOUT && type != SdmsResource.facilityType.DOOR && type != SdmsResource.facilityType.WaterLevel && type != SdmsResource.facilityType.Terror) ||
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
            type === SdmsResource.materialType.CONNECT ||
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
        if (state === SdmsResource.WeatherInfo.Sunshine) {
            if (SdmsResource.isDayLight()) {
                return imgSunnyDay_Wonik;
            }
            else {
                return imgSunnyNight_Wonik;
            }
        }
        else if (state === SdmsResource.WeatherInfo.Thunder) {
            return imgThunder_Wonik;
        }
        else if (state === SdmsResource.WeatherInfo.SnowRain) {
            return imgSnowRain_Wonik;
        }
        else if (state === SdmsResource.WeatherInfo.HeavySnow) {
            return imgHeavySnow_Wonik;
        }
        else if (state === SdmsResource.WeatherInfo.Snow) {
            return imgSnow_Wonik;
        }
        else if (state === SdmsResource.WeatherInfo.HeavyRain) {
            return imgHeavyRain_Wonik;
        }
        else if (state === SdmsResource.WeatherInfo.Rain) {
            return imgRain_Wonik;
        }
        else if (state === SdmsResource.WeatherInfo.Cloudy) {
            return imgCloudy_Wonik;
        }
        else if (state === SdmsResource.WeatherInfo.DustStorm) {
            return imgDustStorm_Wonik;
        }

        if (SdmsResource.isDayLight()) {
            return imgCloudDay_Wonik;
        }

        return imgCloudNight_Wonik;
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
        cctv: 50,
        dashboard: 51,
        eventInfo: 52,
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
            x: '0.5%', y: '26%', height: '500px', width: '320px'
        },
        buildingInfo: {
            x: '0.5%', y: '78%', height: '210px', width: '320px'
        },
        dashboard: {
            x: '26%', y: '15%', height: '79px', width: '970px'
        },
        miniMap: {
            x: '19%', y: '70%', height: '290px', width: '260px'
        },
        event: {
            x: '80%', y: '13%', height: '426px', width: '360px'
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
            x: '59%', y: '19%', height: '296px', width: '216px'   
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
        }
    }

    static BroadcastState = {
        None: 0,
        Run: 1,
        Stop: 2,
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        cctvInfo: "cctvInfo",
        cctvInfo_1: "cctvInfo_1",
        cctvInfo_2: "cctvInfo_2",
        cctvInfo_3: "cctvInfo_3",
        buildingInfo: "buildingInfo",
        dashboard: "dashboard",
        event: "event",
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
        speedingHistory: "speedingHistory",
        speedingInfo: "speedingInfo",
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
        eqZone: 1,          // 1차 Zone
        environ: 2,         // 1차 안전환경

        currentJob: 3,      // 2차 현업
        safety: 4,          // 2차 안전/보건
        prevention: 5       // 2차 방재/환경
    };

    static waterLevel = {
        default: 0,
        low: 1,
        high: 2
    }
}