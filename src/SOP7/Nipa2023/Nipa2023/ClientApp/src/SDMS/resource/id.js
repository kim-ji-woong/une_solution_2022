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
                statusInfo: "현황정보",
                dashboard: "대시보드",
                event: "이벤트 알람",
                equipmentStatus: "설비 현황정보",
                equipmentFaulty: "불량 현황정보",
                eventInfo: "이벤트 정보",
                eventDashboard: "이벤트 대시보드",
                equipmentFaultyImage: "불량 이벤트 상세정보",
                equipmentFaultyImage2: "불량 상세정보",
                equipmentEventAlarm: "이벤트 발생",
                statusPsmSensorInfo: "대기오염센서 상세정보",
                workerInfo: "작업자 정보",
                workerInfoEquipmentStatus: "장비현황 상세정보",
                workerEventInfo: "작업자 이벤트 상세정보",
            },

            buildingInfo:
            {
                buildingGroupType: "건물그룹",
                buildingType: "건물",
                equipmentType: "설비",
                sensorInfo: "센서정보",
                outdoor: "외부 영역",
            },
            mode:
            {
                monitoring: "안전",
                equipment: "설비",
                equipmentDetail: "설비 상세정보",
            },
            sensor:
            {
                gas: "가스",
                atmosphere: "대기오염",
                emergencyBell: "비상벨",
                thermalCamera: "열화상카메라",
                cctv: "CCTV",
                fire: "화재",
                worker: "작업자",
                emergencyCall: "작업자(긴급호출)",
                fall: "작업자(쓰러짐)",
                equipmentTightening: "작업자(장비협착)",
                pairTwo: "작업자(2인1조)",
                batteryChange: "작업자(배터리교체)",
                equipment: "사출기"
            },

            equipmentStatusMenu: {
                ap: "AP",
                tag: "TAG"
            },

            workerAPs: {
                equipment22: "사출22호기",
                equipment23: "사출23호기",
                equipmentTightening: "장비협착",
                underground: "지하공동구",
                equipmentBuilding: "사출신동"
            }
        }
    }

    static facilityType = {
        FIRE: 0,                        // 화재
        ATMOSPHERE: 240,                // 대기오염
        GAS: 216,                       // 가스
        EMERGENCYBELL: 114,             // 비상벨
        WORKER: 251,                    // 작업자
        EMERGENCY_CALL: 241,            // 작업자(긴급호출)
        FALL: 111,                      // 작업자(쓰러짐)
        EQUIPMENT_TIGHTENING: 243,      // 작업자(장비협착)
        PAIR_TWO: 244,                  // 작업자(2인1조)
        BATTERY_CHANGE: 252,            // 작업자(배터리교체)
        THERMAL_CAMERA: 3,              // 열화상카메라
        CCTV: 3,                        // CCTV
        EQUIPMENT: 253,                 // 사출기
    }

    static buildingType = {
        factory: 1,                     // 공장동
        research: 2,                    // 연구동
        office: 3,                      // 사무동
        dormitory: 4,                   // 기숙사
        securityOffice: 5,              // 경비실
        garbageDump: 6,                 // 폐수처리장 및 쓰레기처리장
        underground: 7,                 // 지하공동구
        outdoor: 20000                  // 외부영역
    }

    // 관제화면 모드
    static mode = {
        monitoring: 0,                  // 모니터링 모드
        equipment: 1,                   // 설비 모드
        equipmentDetail: 2              // 설비 상세보기 모드
    }

    static equipmentStatusMenu = {
        AP: 0,
        TAG: 1
    }

    // SDMS 팝업 시스템 초기화 셋팅 값
    static popupResetLocation = {
        statusInfo: {
            x: '1%', y: '13%', height: '600px', width: '304px'
        },
        statusPsmSensorInfo: {
            x: '1%', y: '69%', height: '220px', width: '304px'
        },
        dashboard: {
            x: '20%', y: '6%', height: '82px', width: '1190px'
        },
        event: {
            x: '80%', y: '13%', height: '400px', width: '340px'
        },
        workerEventInfo: {
            x: '80%', y: '51%', height: '320px', width: '340px'
        },
        workerInfo: {
            x: '80%', y: '13%', height: '308px', width: '340px'
        },
        workerInfoEquipmentStatus: {
            x: '73.3%', y: '43%', height: '250px', width: '470px'
        },
        thermalImagingCamera: {
            x: '77.9%', y: '70%', height: '290px', width: '380px'
        },
        equipmentStatus: {
            x: '1%', y: '13%', height: '630px', width: '304px'
        },
        equipmentFaulty: {
            x: '78.7%', y: '13%', height: '263px', width: '365px'
        },
        equipmentFaultyImage: {
            x: '79.8%', y: '57%', height: '450px', width: '345px'
        },
        equipmentFaultyImage2: {
            x: '79.8%', y: '57%', height: '450px', width: '345px'
        },
        equipmentEventAlarm: {
            x: '80%', y: '60%', height: '258px', width: '249px'
        },
    }

    static popupLayer = {
        statusInfo: "statusInfo",
        dashboard: "dashboard",
        event: "event",
        equipmentFaulty: "equipmentFaulty",
        equipmentStatus: "equipmentStatus",
        equipmentFaultyImage: "equipmentFaultyImage",
        equipmentFaultyImage2: "equipmentFaultyImage2",
        equipmentEventAlarm: "equipmentEventAlarm",
        statusPsmSensorInfo: "statusPsmSensorInfo",
        workerInfo: "workerInfo",
        workerInfoEquipmentStatus: "workerInfoEquipmentStatus",
        workerEventInfo: "workerEventInfo",
        thermalImagingCamera: "thermalImagingCamera",
    }

    static setMode(mode) {
        if (SdmsResource.targetMode === mode) {
            return;
        } 
        else {
            SdmsResource.targetMode = mode;
        }
    }

    static getMode() {
        return SdmsResource.targetMode;
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