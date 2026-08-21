import store from '../../Root/store';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import { GghJsonManager } from './gghJsonManager';
import { isEqual } from 'lodash';
import { SDMSController } from './sdmsController';
import { SdmsJsonManager } from './sdmsJsonManager';
import SdmsResource from '../resource/id';
import { DashboardController } from '../../Dashboard/services/dashboardController';


export class GghController {
    static timerCheckParking = 0;
    static timerCheckUpsStatus = 0;
    static timerCheckLastEarthquake = 0;

    // 타이머로 센서 히스토리 불러오는 함수 리턴값을 Redux에 저장
    static async WatchSensorAlarm() {
        // 센서 알람 히스토리 조회
        let result = await GghController.requestAlarmNEvacuations();
        result = result == null ? new Array() : result;
        if (result == null) {
            return new Array();
        }
        
        // 현재 센서 알람 히스토리 조회
        GghController.toCompareAlarm('SENSOR_ALARM', result);

        SDMSController.watchSensorCount();
    }

    // 당일 알람 조회
    static async WatchSensorTodayAlarm() {
        let result = await DashboardController.requestTodayStatus();

        let todayAlarm = [];
        todayAlarm = result[0];

        if (todayAlarm) {
            // 값 비교 후 다를 경우 dispatch
            let currentDatas = store.getState().sensorTodayAlarm;

            let compare = isEqual(currentDatas, todayAlarm);

            if (!compare) {
                store.dispatch({ type: 'TODAY_ALARM', sensorTodayAlarm: todayAlarm });
            }
        }
    }

    static toCompareAlarm(type, result) {
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        let currentAlarm = store.getState().sensorAlarm;

        let receiveAlarm = [];
        for (let i = 0; i < result?.alarmDatas?.length; i++) {
            const alarmData = result.alarmDatas[i];

            // 로그인 유저의 siteID 알람만 체크 (지진알람은 모든 입주기관 포함)
            if (alarmData.facilityType === SdmsResource.facilityType.Earthquake ||
                (userInfo.siteID === ProjectResource.Site.GG_A || userInfo.siteID === alarmData.siteID)
            ) {
                receiveAlarm.push(alarmData);
            }
        }

        let temp = null; // 센서 비교에 사용

        currentAlarm = currentAlarm == null ? new Array() : currentAlarm;
        temp = currentAlarm.slice(); // 깊은 복사

        // 조회된 센서 알람와 표시되고 있는 센서 알람 비교 후 Redux에 저장
        if (receiveAlarm !== null && receiveAlarm !== undefined && receiveAlarm.length != currentAlarm.length) {
            // 알람 수가 같지 않을 때
            store.dispatch({ type: type, sensorAlarm: receiveAlarm, sensorAllAlarm: result.allAlarmDatas });

        } else if (receiveAlarm !== null && receiveAlarm !== undefined && receiveAlarm.length == currentAlarm.length && receiveAlarm.length != 0) {
            const receiveAlarmCount = receiveAlarm.length;
            for (let i = 0; i < receiveAlarmCount; i++) {
                // 기존 알람과 SensorZoneIDs 비교 추가 - 2023.02.15 K.D.R
                const alarmSensorZoneIDs = receiveAlarm[i].alarmSensorZoneIDs.join();

                for (let j = 0; j < temp.length; j++) {
                    const tempSensorZoneIDs = temp[j].alarmSensorZoneIDs.join();

                    // id 비교 같으면 삭제
                    if (receiveAlarm[i].dtTime == temp[j].dtTime &&
                        receiveAlarm[i].equipZoneID == temp[j].equipZoneID &&
                        receiveAlarm[i].sopStatus == temp[j].sopStatus &&
                        receiveAlarm[i].alarmDepth == temp[j].alarmDepth &&
                        receiveAlarm[i].isAlarm == temp[j].isAlarm &&
                        receiveAlarm[i].sensorZoneHistoryID == temp[j].sensorZoneHistoryID &&
                        alarmSensorZoneIDs == tempSensorZoneIDs) {
                        temp.splice(j, 1);
                        break;
                    }
                }
            }

            // currentAlarm 갯수가 남아있다면 >> 센서 알람이 동일하지 않음.
            if (temp.length != 0) {
                if (type === 'SENSOR_ALARM') {
                    store.dispatch({ type: type, sensorAlarm: receiveAlarm, sensorAllAlarm: result.allAlarmDatas });
                }
            }
        }

        // 피난 유도 (현재는 도본청, 도의회만 적용)
        const currentEvacuations = store.getState().evacuations;
        const evacuations = result.evacuations.find((data) => data.siteID === ProjectResource.Site.GG_B);
        const compareEvacuations = isEqual(currentEvacuations, evacuations);

        if (evacuations !== null && evacuations !== undefined && !compareEvacuations) {
            store.dispatch({ type: 'EVACUATIONS_INFOS', evacuations: evacuations });
        }
    }

    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        // 1.5초에 한번씩 실행 - 알람 및 피난유도 데이터
        let timerId = setTimeout(async function tick() {
            await GghController.WatchSensorAlarm();
            timerId = setTimeout(tick, 1500);
        }, 1500);

        // 1.5초에 한번씩 실행 - 당일 알람
        let timerTodayAlarm = setTimeout(async function tick() {
            await GghController.WatchSensorTodayAlarm();
            timerTodayAlarm = setTimeout(tick, 1500);
        }, 1500);

        // 1초에 한번씩 실행 - 출입통제 정보
        let timerAccessControl = setTimeout(async function tick() {
            await GghController.WatchDoorStatus(ProjectResource.Site.GG_B);
            timerAccessControl = setTimeout(tick, 1000);
        }, 1000);
    }

    static StartWatchTimerParking() {
        // 타이머 실행 유무 판단
        if (this.timerCheckParking == true)
            return;

        // 타이머 실행 체크
        this.timerCheckParking = true;

        // 1초에 한번씩 실행 - 주차관제 정보
        GghController.timerParking = setTimeout(async function tick() {
            await GghController.WatchParkingInfos();
            GghController.timerParking = setTimeout(tick, 1000);
        }, 1000);
    }

    static stopWatchTimerParking() {
        GghController.timerCheckParking = false;
        clearTimeout(GghController.timerParking);

        if (GghController.timerParking > 0) {
            clearTimeout(GghController.timerParking);
            GghController.timerParking = 0;
        }
    }

    static StartWatchTimerUpsStatus(siteID) {
        // 타이머 실행 유무 판단
        if (this.timerCheckUpsStatus == true)
            return;

        // 타이머 실행 체크
        this.timerCheckUpsStatus = true;

        // 1초에 한번씩 실행 - 전력 
        GghController.timerUpsStatus = setTimeout(async function tick() {
            await GghController.WatchUpsStatus(siteID);
            GghController.timerUpsStatus = setTimeout(tick, 1000);
        }, 1000);
    }

    static stopWatchTimerUpsStatus() {
        GghController.timerCheckUpsStatus = false;
        clearTimeout(SDMSController.timerUpsStatus);

        if (GghController.timerUpsStatus > 0) {
            clearTimeout(GghController.timerUpsStatus);
            GghController.timerUpsStatus = 0;
        }
    }

    static StartWatchTimerLastEarthquake() {
        // 타이머 실행 유무 판단
        if (this.timerCheckLastEarthquake == true)
            return;

        // 타이머 실행 체크
        this.timerCheckLastEarthquake = true;

        // 1초에 한번씩 실행 - 지진
        GghController.timerLastEarthquake = setTimeout(async function tick() {
            await GghController.WatchLastEarthquake();
            GghController.timerLastEarthquake = setTimeout(tick, 1000);
        }, 1000);
    }

    static stopWatchTimerLastEarthquake() {
        GghController.timerCheckLastEarthquake = false;
        clearTimeout(SDMSController.timerLastEarthquake);

        if (GghController.timerLastEarthquake > 0) {
            clearTimeout(GghController.timerLastEarthquake);
            GghController.timerLastEarthquake = 0;
        }
    }

    static async requestNvrList() {

        try {
            const jsonData = GghJsonManager.makeRequestNvrList();

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.nvrList, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [null, "requestNvrList 실패"];
    }

    static async updateNvrList(nvrList) {

        try {
            const jsonData = GghJsonManager.makeUpdateNvrList(nvrList);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [true, ""];
                }
                else {
                    return [false, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [false, "updateNvrList 실패"];
    }

    static async requestEvacuations() {

        try {
            const jsonData = GghJsonManager.makeRequestEvacuations();

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.evacuations, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [null, "requestEvacuations 실패"];
    }

    static async requestAlarmNEvacuations() {
        try {
            const jsonData = GghJsonManager.makeRequestAlarmNEvacuations();

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }

        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "requestAlarmNEvacuations 실패"
        };
    }

    static async requestCCTVList(siteID) {
        try {
            const jsonData = GghJsonManager.makeRequestCCTVList(siteID);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "requestCCTVList 실패"
        };
    }

    static async updateCCTVList(cctvList) {
        try {
            const jsonData = GghJsonManager.makeUpdateCCTVList(cctvList);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }
        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "updateCCTVList 실패"
        };
    }

    static async requestParkingGateList(siteID = -1) {
        try {
            const jsonData = GghJsonManager.makeRequestParkingGateList(siteID);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "requestParkingGateList 실패"
        };
    }

    static async requestDoorStatus(siteID = -1) {
        try {
            const jsonData = GghJsonManager.makeRequestDoorStatus(siteID);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "requestDoorStatus 실패"
        };
    }

    static async requestExitList(siteID = -1) {
        try {
            const jsonData = GghJsonManager.makeRequestExitList(siteID);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "requestExitList 실패"
        };
    }

    static async WatchParkingInfos() {
        // 주차관제 정보 조회
        let result = await GghController.requestParkingGateList();
        
        let parkingDatas = [];
        parkingDatas = result.gateList;

        if (result !== null && result.success === true) {

            // 값 비교 후 다를 경우 dispatch
            let currentDatas = store.getState().parkingDatas;

            // 기존 데이터가 없을 경우
            if (currentDatas.length === 0) {
                store.dispatch({ type: 'PARKING_INFOS', parkingDatas: parkingDatas });
                return;
            }

            let compare = isEqual(currentDatas, parkingDatas);

            if (!compare) {
                store.dispatch({ type: 'PARKING_INFOS', parkingDatas: parkingDatas });
            }
        }
    }

    static async WatchDoorStatus(siteID) {
        // 출입통제 정보 조회
        let result = await GghController.requestDoorStatus(siteID);
        
        let doorDatas = [];
        doorDatas = result.floorInfos;

        if (result !== null && result.success === true) {

            // 값 비교 후 다를 경우 dispatch
            let currentDatas = store.getState().doorDatas;

            // 기존 데이터가 없을 경우
            if (currentDatas.length === 0) {
                store.dispatch({ type: 'DOOR_INFOS', doorDatas: doorDatas });
                return;
            }

            let compare = isEqual(currentDatas, doorDatas);

            if (!compare) {
                store.dispatch({ type: 'DOOR_INFOS', doorDatas: doorDatas });
            }
        }
    }

    static async WatchUpsStatus(siteID) {
        // 전력 정보 조회
        let result = await GghController.requestUpsStatus(siteID);
        
        let upsDatas = [];
        upsDatas = result.upsList;

        if (result !== null && result.success === true) {

            // 값 비교 후 다를 경우 dispatch
            let currentDatas = store.getState().upsDatas;

            // 기존 데이터가 없을 경우
            if (currentDatas.length === 0) {
                store.dispatch({ type: 'UPS_INFOS', upsDatas: upsDatas });
                return;
            }

            let compare = isEqual(currentDatas, upsDatas);

            if (!compare) {
                store.dispatch({ type: 'UPS_INFOS', upsDatas: upsDatas });
            }
        }
    }

    static async WatchLastEarthquake() {
        let [result] = await GghController.requestLastEarthquake();

        if (result) {

            // 값 비교 후 다를 경우 dispatch
            let currentDatas = store.getState().earthquake;

            let compare = isEqual(currentDatas, result);

            if (!compare) {
                store.dispatch({ type: 'EARTHQUAKE_INFOS', earthquake: result });
            }
        }
    }

    static async requestAllDoors(siteID = -1) {
        try {
            const jsonData = GghJsonManager.makeRequestAllDoors(siteID);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "requestAllDoors 실패"
        };
    }

    static async requestUpsStatus(siteID) {
        try {
            const jsonData = GghJsonManager.makeRequestUpsStatus(siteID);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            //console.log(e);
        }

        return {
            success: false,
            message: "requestAllDoors 실패"
        };
    }

    static async updateSensorEnabled(enabledSensorDatas, disabledSensorDatas) {
        try {
            const jsonData = SdmsJsonManager.makeUpdateSensorEnabled(enabledSensorDatas, disabledSensorDatas);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestUpdatePOIPositions(sensorPositions) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return [false, "requestUpdatePOIPositions 실패 (해당 유저 정보를 찾을 수 없습니다.)"];

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPositions(userInfo.id, sensorPositions);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.addedSensors, result.success, result.message];
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestUpdatePOIPositions 실패"];
    }

    static async requestUpdatePOIPosition(sensorType, zoneID, sensorID, x, y, z) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return [false, "유저 정보를 찾을 수 없습니다."];

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPosition(userInfo.id, sensorType, zoneID, sensorID, x, y, z);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }

        } catch (e) {
            console.log(e);
            return [false, "requestUpdatePOIPosition 실패"];
        }
    }

    static async getWebSocketPort() {
        let port = -1;

        try {
            const res = await fetch('/SDMS/GGH/WebSocketPort');
            const data = await res.text();
            port = parseInt(data);
        }
        catch (e) {
            console.log(e);
        }

        return port;
    }

    static async requestEarthquakeHistory(quaterNo) {
        try {
            const jsonData = GghJsonManager.makeRequestEarthquakeHistory(quaterNo);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.earthquakeHistories, result.message];
            }

        } catch (e) {
            console.log(e);
            return [false, "requestEarthquakeHistory 실패"];
        }
    }

    static async requestLastEarthquake() {
        try {
            const jsonData = GghJsonManager.makeRequestLastEarthquake();

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.earthquake, result.message];
            }

        } catch (e) {
            console.log(e);
            return [false, "requestLastEarthquake 실패"];
        }
    }

    static async requestFirstAidEquipmentList(siteID = null) {
        try {
            const jsonData = GghJsonManager.makeRequestFirstAidEquipmentList(siteID);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result, result.success, result.message];
            }

        } catch (e) {
            console.log(e);
            return [null, false, "requestFirstAidEquipmentList 실패"];
        }
    }

    static async requestNewFirstAidEquipment(sensorType) {
        try {
            const jsonData = GghJsonManager.makeRequestNewFirstAidEquipment(sensorType);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result, result.success, result.message];
            }

        } catch (e) {
            console.log(e);
            return [null, false, "requestNewFirstAidEquipment 실패"];
        }
    }

    static async requestDeleteSensors(sensors) {
        try {
            const jsonData = GghJsonManager.makeRequestDeleteSensors(sensors);

            const res = await fetch('SDMS/GGH/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }

        } catch (e) {
            console.log(e);
            return [false, "requestDeleteSensors 실패"];
        }
    }
}
