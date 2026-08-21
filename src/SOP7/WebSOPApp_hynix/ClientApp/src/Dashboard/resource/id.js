import { i18n } from "../../language/i18n";
import ProjectResource from "../../Root/resource/id";
import SopManagerResource from "../../SOPManager/resource/id";

export default class DashboardResource {
    
    static get ID() {
        return DashboardResource.id[ProjectResource.targetLanguage];
    }

     static id = {
        "ko": {
            displayInfoType: {
                "workState": "작업현황",
                "fire": "화재",
                "intelligent": "지능형",
                "iot_01": "IoT_01 센서",
                "iot_02": "IoT_02 센서",
                "iot_03": "IoT_03 센서",
                "safetyEye": "세이프티아이",
            }
        },
        "en": {
            displayInfoType: {
                "workState": "WorkState",
                "fire": "Fire",
                "intelligent": "Intelligent",
                "iot_01": "IoT_01 Sensor",
                "iot_02": "IoT_02 Sensor",
                "iot_03": "IoT_03 Sensor",
                "safetyEye": "SafetyEye",
            }
        }
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
    }

    static weatherSite = {
        GONGJU: 1,
        PAJU: 2,
        PANGYO: 3,

        GUMI: 1,
        ANSEONG: 2,
    }

    static getWindDirection(state) {
        let windDirection = "";

        if (state === 0) {
            windDirection = "북쪽";
        } else if (state === 1) {
            windDirection = "북북동쪽";
        } else if (state === 2) {
            windDirection = "북동쪽";
        } else if (state === 3) {
            windDirection = "동북동쪽";
        } else if (state === 4) {
            windDirection = "동쪽";
        } else if (state === 5) {
            windDirection = "동남쪽";
        } else if (state === 6) {
            windDirection = "남동쪽";
        } else if (state === 7) {
            windDirection = "남남동쪽";
        } else if (state === 8) {
            windDirection = "남쪽";
        } else if (state === 9) {
            windDirection = "남남서쪽";
        } else if (state === 10) {
            windDirection = "남서쪽";
        } else if (state === 11) {
            windDirection = "서남서쪽";
        } else if (state === 12) {
            windDirection = "서쪽";
        } else if (state === 13) {
            windDirection = "서북서쪽";
        } else if (state === 14) {
            windDirection = "북서쪽";
        } else if (state === 15) {
            windDirection = "북북서쪽";
        } else  {
            windDirection = "바람 없음";
        }

        return windDirection;
    }

    static operationType = {
        normal: 0,
        fire: 1,
        high: 2,
        radiation: 3,
        electric: 4,
        welding: 5,
        heavy: 6,
        excavation: 7,
    }

    static displayInfoType = {
        WORK_STATE: 0,
        FIRE: 1,
        INTELLIGENT: 2,
        IOT_01: 3,
        IOT_02: 4,
        IOT_03: 5,
        SAFETY_EYE: 6,
        PSM: 7,
        ETC: 8,
    }

    static displayInfoTypeName(type) {
        let typeName = "-";

        if (type === DashboardResource.displayInfoType.FIRE)
            typeName = "화재";
        else if (type === DashboardResource.displayInfoType.INTELLIGENT)
            typeName = "지능형CCTV";
        else if (type === DashboardResource.displayInfoType.IOT_01)
            typeName = "IoT";
        else if (type === DashboardResource.displayInfoType.SAFETY_EYE)
            typeName = "세이프티";

        return typeName;
    }

    static fireSubType = {
        HEAT: 0,
        SMOKE: 1,
        FLAME: 2,
    }

    static getFireSubTypeString(fireSubType) {
        let type = i18n.t('materialType.일반 감지기');

        if (fireSubType === DashboardResource.fireSubType.HEAT) {
            type = i18n.t('materialType.열 감지기');
        } else if (fireSubType === DashboardResource.fireSubType.SMOKE) {
            type = i18n.t('materialType.연기 감지기');
        } else if (fireSubType === DashboardResource.fireSubType.FLAME) {
            type = i18n.t('materialType.불꽃 감지기');
        } 

        return type;
    }

    static alarmDepth = {
        attention: 1,
        caution: 2,
        alert: 3,
        serious: 4,
    }

    static getAlarmDepthString(depth) {
        let state = "-";

        if (depth === DashboardResource.alarmDepth.attention) {
            state = SopManagerResource.actionStep._1st;
        } else if (depth === DashboardResource.alarmDepth.caution) {
            state = SopManagerResource.actionStep._2nd;
        } else if (depth === DashboardResource.alarmDepth.alert) {
            state = SopManagerResource.actionStep._3rd;
        } else if (depth === DashboardResource.alarmDepth.serious) {
            state = SopManagerResource.actionStep._4th;
        }

        return state;
    }

    static zoneID = {
        outdoor: 20000,
    }

    static mode = {
        main: 0,
        sub: 1,
    }

    static workerType = {
        Normal: 1,      // 일반
        Fire: 2,        // 화재
        High: 3,        // 고소
        Blackout: 4,    // 정전
        Closeness: 5,   // 밀폐
        Heavy: 6,       // 중장비
        Excavation: 7,  // 굴착
        Radiation: 8,   // 방사능
        Common: 9       // 공통
    }

    static getWorkerTypeString(workerType) {
        let type = "-";

        if (workerType === DashboardResource.workerType.Normal) {
            type = "일반";
        } else if (workerType === DashboardResource.workerType.Fire) {
            type = "화재";
        } else if (workerType === DashboardResource.workerType.High) {
            type = "고소";
        } else if (workerType === DashboardResource.workerType.Blackout) {
            type = "정전";
        } else if (workerType === DashboardResource.workerType.Closeness) {
            type = "밀폐";
        } else if (workerType === DashboardResource.workerType.Heavy) {
            type = "중장비";
        } else if (workerType === DashboardResource.workerType.Excavation) {
            type = "굴착";
        } else if (workerType === DashboardResource.workerType.Radiation) {
            type = "방사능";
        } else if (workerType === DashboardResource.workerType.Common) {
            type = "공통";
        }

        return type;
    }
}