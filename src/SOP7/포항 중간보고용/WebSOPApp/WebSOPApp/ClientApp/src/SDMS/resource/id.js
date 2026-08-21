import ProjectResource from "../../Root/resource/id";
import StringUtil from "../../Common/util/StringUtil";

export default class SdmsResource {
    static targetMode = 0;

    static get ID() {
        return SdmsResource.id[ProjectResource.targetLanguage];
    }

    static PopupAniTime = 200;      // 팝업 Show, Hide 시간 설정

    static id = {
        "ko": {
            projectName: "SDMS",
            menu:
            {
                statusInfo: "센서현황",
                weatherInfo: "기상센서 상세정보",
                miniMap: "미니맵",
                cctvInfo: "CCTV 영상정보",
                event: "이벤트 현황",
                eventMemo: "메모",
                simulation: "시뮬레이션",
                statusPsmSensorInfo: "대기센서 상세정보",
            },
            sensor:
            {
                atmosphere: "대기",
                electric: "전류CT",
                weather: "기상",
                cctv: "cctv"
            },
        }
    }
    
    static SensorType = {
        entire: 0, // Option 이용시 전체 선택 Value
        atmosphere: 1,
        weather: 2,
        electricity: 3,
        kWeather: 4,
        reduction: 5, // 저감설비 parent=3
        discharge: 6, // 배출설비 parent=3
        cctv: 7,
    }
    
    static AtmosphereData = {
        header: "Atmosphere",
        group: "대기센서",
        alarmType: "대기오염"
    };
    
    static WeatherData = {
        header: "Weather",
        group: "기상센서",
        alarmType: "기상"
    };
    
    static KWeatherData = {
        header: "KWeather",
        group: "케이웨더",
        alarmType: "대기오염"
    };

    static facilityType = {
        FIRE: 0,                        // 화재
        ETC: 21,                        // 기타

        Intrusion_S1: 900,                    // SVMS 침입
        Loiter_S1: 901,                       // SVMS 배회
        Collapse_S1: 902,                     // SVMS 쓰러짐
        Theft_S1: 903,                        // SVMS 도난
        Neglect_S1: 904,                      // SVMS 방치
        VirtualFence_S1: 905,                 // SVMS 가상펜스
        Fire_S1: 906,                         // SVMS 화재
        EmergencyBell_S1: 907,                // SVMS 비상벨
    }

    // SDMS 팝업 시스템 초기화 셋팅 값
    static popupResetLocation = {
        statusInfo: {
            x: '1%', y: '7%', height: '600px', width: '300px'
        },
        weatherInfo: {
            x: '16%', y: '25%', height: '390px', width: '300px'
        },
        miniMap: {
            x: '83%', y: '73%', height: '254px', width: '300px'
        },
        cctvInfo: {
            x: '50%', y: '13%', height: '314px', width: '300px'
        },
        event: {
            x: '83%', y: '7%', height: '600px', width: '300px'
        },
        statusPsmSensorInfo: {
            x: '16%', y: '8%', height: '400px', width: '300px'
        },
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        weatherInfo: "weatherInfo",
        miniMap: "miniMap",
        cctvInfo: "cctvInfo",
        event: "event",
        eventMemo: "eventMemo",
        simulation: "simulation",
        statusPsmSensorInfo: "statusPsmSensorInfo"
    }

    // 기상정보 팝업 속성
    static weatherProperty = {
        default: 0,                 // 아무것도 선택되지 않음
        windDirection: 1,           // 풍향
        windSpeed: 2,               // 풍속
        humidity: 3,                // 습도
        barometric: 4               // 기압
    }

    // 방위
    static weatherBearing = {
        east: 0,                    // 동
        southEast: 1,               // 남동
        south: 2,                   // 남
        southWest: 3,               // 남서
        west: 4,                    // 서
        northWest: 5,               // 북서
        north: 6                    // 북
    }

    static materialType = {
        PSM: 11,        // 유해화학물질 누출감지 센서

        ETC: 21,                           // 기타
        
    }
    
    static busanExternalMaterialType = {
        Temp: 1,
        Humi: 2,
        CO2: 3,
        NH3: 4,
        H2S: 5,
        TVOC: 6,
        PM10: 7,
        PM25: 8,
        Dilution: 9,
        OU: 10, // 복합악취
        Stink: 11, // 악취도
        // 포집기 : 12,
        WindDirection: 13,
        WindSpeed: 14,
        Rain: 15,
        AirPress: 16,
        Radiation: 17,
        Dust: 18,
        NO2: 19,
        O2: 20,
        FlowRate: 21, // 유량
        SO: 22, // 황산화물
        CO: 23,
        // FlowRate: 24, // 유량 중복
        pH: 25,
        SS: 26, // 부유고형물
        //NO2: 27, // 이산화질소 중복
        SO2: 28, //
        UV: 29,
        O3: 30
    }

    static isETCSensorType(type) {
        if (ProjectResource.SiteID === ProjectResource.Site.Busan) { // 부산 모든 센서 facilityType 21
            return true;
        }
        
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

    static getDate(date) {
        const dt = date;

        let mm = dt.getMonth() + 1;
        let dd = dt.getDate();
        let ss = dt.getSeconds();
        const ymd = dt.getFullYear() + '.' + StringUtil.getDoubleString(mm) + '.' + StringUtil.getDoubleString(dd);
        const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes()) + ':' + StringUtil.getDoubleString(ss);

        return [ymd, hms];
    }
}