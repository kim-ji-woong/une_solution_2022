import store from '../../Root/store';
import { SdmsJsonManager } from './sdmsJsonManager';
import SessionString from '../../Common/js/sessionString';
import { SettingController } from '../../Settings/services/settingController';
import { SDMSDataManager } from './sdmsDataManager';
import SettingsStore from '../../Settings/settingsStore';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import { isEqual } from 'lodash';

export class SDMSController {
    static timerElevator = 0;

    // 센서 히스토리 불러오기
    static async DisplayAlarm() {
        try {
            const response = await fetch('SDMS/SDMS/DisplayAlarm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

            if (response.ok && response.status !== 204) {
                const data = await response.json();
                return data;
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    // 타이머로 센서 히스토리 불러오는 함수 리턴값을 Redux에 저장
    static async WatchSensorAlarm() {
        // 센서 알람 히스토리 조회
        let result = await SDMSController.DisplayAlarm();
        result = result == null ? new Array() : result;
        if (result == null) {
            return new Array();
        }
        
        // 현재 센서 알람 히스토리 조회
        SDMSController.toCompareAlarm('SENSOR_ALARM', result);

        SDMSController.watchSensorCount();
    }

    static toCompareAlarm(type, result) {
        
        const userInfo = ProjectResource.getUserInfo();
        if (!userInfo)
            return;

        let currentAlarm = store.getState().sensorAlarm;

        let receiveAlarm = [];
        for (let i = 0; i < result?.alarmDatas?.length; i++) {
            const alarmData = result.alarmDatas[i];

            // 마스터 경우 모든 사이트 알람 체크
            // 마스터가 아닌 경우 해당 사이트 알람 체크
            if (userInfo.levelID === AccountResource.accountLevelID.master || 
                userInfo.siteID === alarmData.siteID) {
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
    }

    static async RequestTodayAlarmData() {

        try {
            const jsonData = SdmsJsonManager.makeRequestTodayAlarmData();

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.alarmDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [null, "requestSaveViewport 실패"];
    }

    static async watchSensorCount() {
        try {
            // 멀티사이트 경우 선택된 사이트 조회
            let selectSiteID = null;
            if (ProjectResource.IsMultiSite === true) {
                let tempSiteID = SettingsStore?.getState()?.selectSiteID;
                if (tempSiteID > 0)
                    selectSiteID = tempSiteID;
            }

            // .TODO: 수소 전용 카운터 읽기가 구현 필요
            const jsonData = SdmsJsonManager.makeRequestSensorCount(selectSiteID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    const sensorCount = {};

                    sensorCount.fireSensorCount = result.fireSensorCount;
                    sensorCount.disabledFireSensorCount = result.disabledFireSensorCount;
                    sensorCount.psmSensorCount = result.psmSensorCount;
                    sensorCount.disabledPsmSensorCount = result.disabledPSMSensorCount;
                    sensorCount.etcSensorCount = result.etcSensorCount;
                    sensorCount.disabledEtcSensorCount = result.disabledEtcSensorCount;
                    sensorCount.cctvCount = result.cctvCount;
                    sensorCount.disabledCCTVCount = result.disabledCCTVCount;
                    sensorCount.earthquakeSensorCount = result.earthquakeSensorCount;
                    sensorCount.disabledEarthquakeSensorCount = result.disabledEarthquakeSensorCount;
                    sensorCount.strongWindSensorCount = result.strongWindSensorCount;
                    sensorCount.disabledStrongWindSensorCount = result.disabledStrongWindSensorCount;
                    sensorCount.environmentSensorCount = result.environmentSensorCount;
                    sensorCount.disabledEnvironmentSensorCount = result.disabledEnvironmentSensorCount;
                    sensorCount.emergencyBellCount = result.emergencyBellCount;
                    sensorCount.disabledEmergencyBellCount = result.disabledEmergencyBellCount;
                    sensorCount.laserSensorCount = result.laserSensorCount;
                    sensorCount.disabledLaserSensorCount = result.disabledLaserSensorCount;
                    sensorCount.doorSensorCount = result.doorSensorCount;
                    sensorCount.disabledDoorSensorCount = result.disabledDoorSensorCount;

                    let currentData = store.getState().sensorCount;

                    if (!currentData) {
                        store.dispatch({ type: 'SENSOR_COUNT', sensorCount: sensorCount });
                    }
                    else {
                        if (currentData.fireSensorCount !== sensorCount.fireSensorCount ||
                            currentData.disabledFireSensorCount !== sensorCount.disabledFireSensorCount ||
                            currentData.psmSensorCount !== sensorCount.psmSensorCount ||
                            currentData.disabledPsmSensorCount !== sensorCount.disabledPsmSensorCount ||
                            currentData.etcSensorCount !== sensorCount.etcSensorCount ||
                            currentData.disabledEtcSensorCount !== sensorCount.disabledEtcSensorCount ||
                            currentData.cctvCount !== sensorCount.cctvCount ||
                            currentData.disabledCCTVCount !== sensorCount.disabledCCTVCount ||
                            currentData.earthquakeSensorCount !== sensorCount.earthquakeSensorCount ||
                            currentData.disabledEarthquakeSensorCount !== sensorCount.disabledEarthquakeSensorCount ||
                            currentData.strongWindSensorCount !== sensorCount.strongWindSensorCount ||
                            currentData.disabledStrongWindSensorCount !== sensorCount.disabledStrongWindSensorCount ||
                            currentData.environmentSensorCount !== sensorCount.environmentSensorCount ||
                            currentData.disabledEnvironmentSensorCount !== sensorCount.disabledEnvironmentSensorCount ||
                            currentData.emergencyBellCount !== sensorCount.emergencyBellCount ||
                            currentData.disabledEmergencyBellCount !== sensorCount.disabledEmergencyBellCount ||
                            currentData.laserSensorCount !== sensorCount.laserSensorCount ||
                            currentData.disabledLaserSensorCount !== sensorCount.disabledLaserSensorCount ||
                            currentData.doorSensorCount !== sensorCount.doorSensorCount ||
                            currentData.disabledDoorSensorCount !== sensorCount.disabledDoorSensorCount) {
                            store.dispatch({ type: 'SENSOR_COUNT', sensorCount: sensorCount });
                        }
                    }
                }
            }
        }
        catch (e) {
            //console.log(e);
        }
    }

    // 타이머로 날씨정보 불러오는 함수 리턴값을 Redux에 저장
    static async WatchWeather() {
        let result = await SDMSController.requestWeatherInfo();
        result = result === null || result.success === false ? [] : result.datas;
        store.dispatch({ type: 'WEATHER_CURRENT', weatherDatas: result });
    }

    // 타이머로 새로운 CCTV 정보 불러오는 함수 리턴값을 Redux에 저장
    static async WatchNewCCTVList() {
        const result = await SDMSController.requestNewCCTVList();
        let _newCCTVList = result === null || result.success === false ? [] : result.cctVs;
        let _cctvAllList = result === null || result.success === false ? [] : result.allCCTVs;

        store.dispatch({ type: 'NEW_CCTV_LIST', newCCTVList: _newCCTVList, cctvAllList: _cctvAllList });
    }

    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        // 1.5초에 한번씩 실행 - 알람 및 센서 수치
        let timerId = setTimeout(async function tick() {
            if (!this.watchCount || this.watchCount === 1000)
                this.watchCount = 0;

            await SDMSController.WatchSensorAlarm();
            await SDMSController.WatchRangeSensors();
            await SDMSController.WatchWorkerInfos(this.watchCount);

            this.watchCount++;

            timerId = setTimeout(tick, 1500);
        }, 1500);

        // 1분에 한번씩 실행 - 날씨, 인원현황, CCTV
        SDMSController.WatchWeather();
        SDMSController.WatchNewCCTVList();
        let timerWeather = setTimeout(async function tick() {
            await SDMSController.WatchWeather();
            await SDMSController.WatchNewCCTVList();
            timerWeather = setTimeout(tick, 60000);
        }, 60000);
    }

    static StartWatchTimerElevator() {
        // 타이머 실행 유무 판단
        if (this.timerCheckElevator == true)
            return;

        // 타이머 실행 체크
        this.timerCheckElevator = true;

        // 1초에 한번씩 실행 - 엘리베이터 정보
        SDMSController.timerElevator = setTimeout(async function tick() {
            await SDMSController.WatchElevatorInfos();
            SDMSController.timerElevator = setTimeout(tick, 1000);
        }, 1000);
    }

    static stopWatchTimer() {
        SDMSController.timerCheckElevator = false;
        clearTimeout(SDMSController.timerElevator);

        if (SDMSController.timerElevator > 0) {
            clearTimeout(SDMSController.timerElevator);
            SDMSController.timerElevator = 0;
        }
    }

    static async requestBuildingGroupList(siteIDs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestBuildingGroupList(siteIDs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.buildingGroups, result.outdoorZones, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, ""];
    }

    static async requestOuterDatas(siteIDs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestOuterDatas(siteIDs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    const outdoorZoneCount = result.outdoorZones.length;

                    for (let i = 0; i < outdoorZoneCount; i++) {
                        const zone = result.outdoorZones[i];

                        if (zone.sensors?.cctvs) {
                            SDMSDataManager.checkCCTVTypes(zone.sensors.cctvs);
                        }
                    }

                    return [result.buildingGroups, result.outdoorZones, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, ""];
    }

    static async requestIndoorDatas(zoneID, siteIDs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestIndoorDatas(zoneID, siteIDs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    SDMSDataManager.checkCCTVTypes(result.cctvs);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestIndoorDatas 실패"];
    }

    static async requestGltfModelList(userID, siteIDs) {
        for (let i = 0; i < 10; i++) {
            const [models, gltfOption, message] = await SDMSController._requestGltfModelList(userID, siteIDs);

            if (models) {
                return [models, gltfOption, message];
            }
        }

        return [null, null, "requestGltfModelList 실패"];
        /*try {
            const jsonData = SdmsJsonManager.makeRequestGltfDataList(userID, siteIDs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.models, result.gltfOption, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, "requestGltfModelList 실패"];*/
    }

    static async _requestGltfModelList(userID, siteIDs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGltfDataList(userID, siteIDs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.models, result.gltfOption, ""];
                }
                else {
                    return [null, null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, null, "requestGltfModelList 실패"];
    }

    static async requestSaveViewport(modelName, modelFile, camera, modelDisplayText, buildingGroupID, buildingID, zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveViewport(modelName, modelFile, camera, modelDisplayText, buildingGroupID, buildingID, zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
            console.log(e);
        }

        return [false, "requestSaveViewport 실패"];
    }

    static async requestMoveBuildingNameText(buildingGroupName, buildingName, x, y, z) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMoveBuildingNameText(buildingGroupName, buildingName, x, y, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
            console.log(e);
        }

        return [false, "requestMoveBuildingNameText 실패"];
    }

    static async requestMoveEquipZoneNameText(equipZoneID, equipZoneName, x, y, z) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMoveEquipZoneNameText(equipZoneID, equipZoneName, x, y, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
            console.log(e);
        }

        return [false, "requestMoveBuildingNameText 실패"];
    }


    static async requestSensorList(siteIDs) {
        try {
            // 수소 센서 불러오기
            const res = await fetch('SDMS/Hydrogen/RequestSensorList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSensorList 실패"];
    }

    // sensorType : null이면 전체
    // enabled : null이면 전체
    // pageItemCount : null이면 전부(한 페이지에 몇개까지 표시할 것인가?)
    // pageIndex : null이면 전부(몇번째 페이지인가? 0부터 시작)
    static async requestPageSensorList(siteIDs, sensorType, enabled, searchText, pageItemCount, pageIndex) {
        try {
            const jsonData = SdmsJsonManager.makeRequestPageSensorList(siteIDs, sensorType, enabled, searchText, pageItemCount, pageIndex);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    SDMSDataManager.checkCCTVTypes(result.cctvs);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestPageSensorList 실패"];
    }

    static async requestMoveSensor(sensorType, sensorID, x, z) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSensor(sensorType, sensorID, x, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
            console.log(e);
        }

        return [false, "requestMoveSensor 실패"];
    }

    static async requestMalfunction(sensorType, sensorZoneID, accessedUserID, isMalfunction) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMalfunction(sensorType, sensorZoneID, accessedUserID, isMalfunction);

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    static async requestSituationNotice(facilityType, sensorZoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSituationNotice(facilityType, sensorZoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    static async getEquipZoneCCTV(equipZoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneCCTV(equipZoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, result.equipZoneCCTV];
                }
                else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [false, "getEquipZoneCCTV 실패"];
    }

    static async requestEquipZoneCCTVListFromSensor(sensorType, sensorID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneCCTVListFromSensor(sensorType, sensorID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestEquipZoneSensorList(sensorType, sensorID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneSensorList(sensorType, sensorID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestUpdateEquipZoneCCTVs(equipZoneCCTVs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestUpdateEquipZoneCCTVs(equipZoneCCTVs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async getOrgSensorID(sensorZoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGetOrgSensorID(sensorZoneID);
            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (res.ok) {
                const orgSensor = await res.json();
                return [orgSensor[0], orgSensor[1]]; // OrgSensorID, IsAlarmStatus
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async getStreamServerURL() {
        try {
            const jsonData = SdmsJsonManager.makeRequestStreamServerURL();

            const res = await fetch('SDMS/SDMS/GetStreamServerURL', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async getFacilityTypes() {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityTypes();

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.facilityTypes, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async getFacilityType(FacilityTypeID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityType(FacilityTypeID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [true, result.facilityType];
                }
                else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [false, "getFacilityType 실패"];
    }


    static async requestUpdatePOIPosition(sensorType, zoneID, sensorID, x, y, z) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return[false, "유저 정보를 찾을 수 없습니다."];

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPosition(userInfo.id, sensorType, zoneID, sensorID, x, y, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

    static async requestUpdatePOIPositions(sensorPositions) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return [false, "requestUpdatePOIPositions 실패 (해당 유저 정보를 찾을 수 없습니다.)"];

            const jsonData = SdmsJsonManager.makeRequestUpdatePOIPositions(userInfo.id, sensorPositions);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
        }

        return [false, "requestUpdatePOIPositions 실패"];
    }

    static async requestUpdateCCTVs(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return [false, "requestUpdateCCTVs 실패 (해당 유저정보를 찾을 수 없습니다.)"];

            const jsonData = SdmsJsonManager.makeRequestUpdateCCTVs(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return [false, "requestUpdateNewCCTVs 실패"];
    }

    //옵션 획득(list)
    static async requestGetOption(UserID, Category) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGetOption(UserID, Category);

            const res = await fetch('SOPManager/SOP/RequestData', {
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
                    return [true, result.options];
                } else {
                    return [false, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [false, 'requestGetOption 실패'];
    }

    //옵션 저장
    static async requestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4);
            const res = await fetch('SOPManager/SOP/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                //데이터가 성공적으로 삽입 되면 primary id를 반환 받는다.
                if (result.success) {
                    return [true, result.options]
                } else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }
        return [false, 'requestSaveOption 실패'];
    }

    static async requestFacilityInfoData(modelName) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityInfoData(modelName);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestAllFacilityInfo() {
        try {
            const jsonData = SdmsJsonManager.makeRequestAllFacilityInfo();

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                if (result === null) {
                    return null;
                }
                else {
                    return result.infos;
                }
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestBuildingData(buildingName) {
        try {
            const jsonData = SdmsJsonManager.makeRequestBuildingData(buildingName);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestBuildingGroupData(buildingGroupID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestBuildingGroupData(buildingGroupID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestSaveIndoorModelViewport(modelName, cameraData, zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveIndoorModelViewport(modelName, cameraData, zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestSaveOrthoModelViewport(modelName, cameraData, zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveOrthoModelViewport(modelName, cameraData, zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestWeatherInfo() {
        try {
            const jsonData = SdmsJsonManager.makeRequestWeatherInfo();

            const res = await fetch('Weather/Weather/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestFakeWalls(zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFakeWalls(zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestUpdateFakeWall(fakeWall, id, zoneID, mode) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateFakeWall(userInfo.id, fakeWall, id, zoneID, mode);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestUpdateFakeWalls(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateFakeWalls(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestManualReport(dateTime, sensorType, sensorZoneID, zoneID, alarmDepth, reportPerson, memo) {
        try {            
            const jsonData = SdmsJsonManager.makeRequestManualReport(dateTime, sensorType, sensorZoneID, zoneID, alarmDepth, reportPerson, memo);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryID, accessedUserID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryID, accessedUserID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestAllClearReport() {
        try {
            const jsonData = SdmsJsonManager.makeRequestAllClearReport();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestNewCCTVList() {
        try {
            const jsonData = SdmsJsonManager.makeRequestNewCCTVList();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestCommonSettings() {
        try {
            const jsonData = SdmsJsonManager.makeRequestCommonSettings();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestGetSiteID() {
        try {
            const jsonData = SdmsJsonManager.makeRequestGetSiteID();

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success === true) {
                    return [result.siteID, ""];
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestGetSiteID 실패"];
    }

    static async requestMaterials() {
        try {
            const jsonData = SdmsJsonManager.makeRequestMaterials();

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.materials, ""];
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestMaterials 실패"];
    }

    static async WatchRangeSensors() {
        let result = await SDMSController.requestRangeSensors();

        if (result !== null && result.success === true) {
            let rangeSensors = new Object();
            rangeSensors.rangePsmSensors = result.psmSensors;
            rangeSensors.rangeEtcSensors = result.etcSensors;
            store.dispatch({ type: 'RANGE_SENSORS', rangeSensors: rangeSensors });
        }

        
    }

    static async requestRangeSensors() {
        try {
            const jsonData = SdmsJsonManager.makeRequestRangeSensors();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestImageFilePath(zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestImagePath(zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }


    static async WatchWorkerInfos(watchCount) {
        const chk = watchCount % 3;
        if (chk !== 0)
            return;


        let result = await SDMSController.requestWorkerInfos();

        if (result !== null && result.success === true) {
            // 값 비교 후 다를 경우 dispatch
            let currentWorkers = store.getState().workerInfos;

            let newWorkers = new Object();
            newWorkers.buildingGroupWorkerInfos = result.buildingGroupWorkerInfos;
            newWorkers.buildingWorkerInfos = result.buildingWorkerInfos;
            newWorkers.zoneWorkerInfos = result.zoneWorkerInfos;
            newWorkers.equipZoneWorkerInfos = result.equipZoneWorkerInfos;

            // 기존 데이터가 없을 경우
            if (!currentWorkers) {
                store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                return;
            }

            // 신규 WorkerInfos 데이터와 현재 데이터 숫자가 맞지 않을 경우
            if (currentWorkers?.buildingGroupWorkerInfos?.length !== newWorkers?.buildingGroupWorkerInfos?.length ||
                currentWorkers?.buildingWorkerInfos?.length !== newWorkers?.buildingWorkerInfos?.length ||
                currentWorkers?.zoneWorkerInfos?.length !== newWorkers?.zoneWorkerInfos?.length) {
                store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                return;
            }

            // buildingGroup 데이터가 다를 경우
            if (newWorkers?.buildingGroupWorkerInfos?.length > 0 && currentWorkers?.buildingGroupWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.buildingGroupWorkerInfos) {
                    const workerInfo = currentWorkers.buildingGroupWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }

             // building 데이터가 다를 경우
            if (newWorkers?.buildingWorkerInfos?.length > 0 && currentWorkers?.buildingWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.buildingWorkerInfos) {
                    const workerInfo = currentWorkers.buildingWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }

             // zone 데이터가 다를 경우
            if (newWorkers?.zoneWorkerInfos?.length > 0 && currentWorkers?.zoneWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.zoneWorkerInfos) {
                    const workerInfo = currentWorkers.zoneWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }

            // equipZone 데이터가 다를 경우
            if (newWorkers?.equipZoneWorkerInfos?.length > 0 && currentWorkers?.equipZoneWorkerInfos?.length > 0) {
                for (const newWorkerInfo of newWorkers.equipZoneWorkerInfos) {
                    const workerInfo = currentWorkers.equipZoneWorkerInfos.find(x => x.id === newWorkerInfo.id && x.workerCount === newWorkerInfo.workerCount);

                    if (!workerInfo) {
                        store.dispatch({ type: 'WORKER_INFOS', workerInfos: newWorkers });
                        return;
                    }
                }
            }
        }
    }

    static async requestWorkerInfos() {
        try {
            const jsonData = SdmsJsonManager.makeRequestWorkerInfos();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async WatchDoorStatus(siteID) {
        // 출입문 상태 정보 조회
        let result = await SDMSController.requestDoorStatus(siteID);

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

    static async requestWonikEquipZoneMembers(equipZoneID) {
        try {
            const res = await fetch('http://10.6.13.71:2420/Beacon/RequestEquipZoneMembers', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ EquipZoneID: equipZoneID })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.equipZoneMembers, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestWonikEquipZoneMembers 실패"];
    }

    static async requestWonikRemainerMembers(equipZoneID) {
        try {
            const res = await fetch('http://10.6.13.71:2420/Beacon/RequestRemainerMembers', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ EquipZoneID: equipZoneID })
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.equipZoneMembers, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestWonikEquipZoneMembers 실패"];
    }

    static async requestWonikRemainerSMS(phoneNumbers) {
        try {
            const res = await fetch('http://10.6.13.71:2420/Beacon/RequestRemainerSMS', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ PhoneNumbers: phoneNumbers })
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
            console.log(e);
        }

        return [false, "requestWonikRemainerSendSMS 실패"];
    }

    static async requestSoulbrainWorkList() {
        try {
            const res = await fetch('http://192.168.254.201:31114/WishData/RequestTodayWorkList', {
            //const res = await fetch('http://localhost:31114/WishData/RequestTodayWorkList', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.workList, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSoulbrainWorkList 실패"];
    }

    static async requestUpdateEquipZoneAreas(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateEquipZoneAreas(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestEquipZoneAreas(zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestEquipZoneAreas(zoneID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestUpdateSensorEquipZones(datas) {
        try {
            let userInfo = ProjectResource.getUserInfo();
            if (userInfo === null || userInfo === undefined)
                return null;

            const jsonData = SdmsJsonManager.makeRequestUpdateSensorEquipZones(userInfo.id, datas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestGetAlarmMemos(sensorZoneHistoryIDs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGetAlarmMemos(sensorZoneHistoryIDs);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
                    return [result.alarmMemos, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestGetAlarmMemos 실패"];
    }

    static async requestYearStatus() {
        try {
            const jsonData = SdmsJsonManager.makeRequestYearStatus();

            const res = await fetch('SDMS/SDMS/RequestData', {
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

                    return [result.alarmInfos, ""];
                } else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestYearStatus 실패"];
    }
    
    static async requestUpdateCoordinatesFor2D(sensorType, sensorID, x, z) {
        try {
            const jsonData = SdmsJsonManager.makeRequestUpdateSensorCoordinatesFor2D(sensorType, sensorID, x, z);

            const res = await fetch('SDMS/SDMS/RequestData', {
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
    
    static async requestUpdateSensorsFor2D(modifiedSensors) {
        try {
            const jsonData = SdmsJsonManager.makeRequestUpdateSensorsFor2D(modifiedSensors);
            
            const res = await fetch('SDMS/SDMS/RequestData', {
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

    static async requestElevators() {
        try {
            const jsonData = SdmsJsonManager.makeRequestElevators();
            
            const res = await fetch('SDMS/SDMS/RequestData', {
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

    static async requestAlarmData(sensorZoneHistoryID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestAlarmData(sensorZoneHistoryID);

            const res = await fetch('SDMS/SDMS/RequestData', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.alarm;
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async WatchElevatorInfos() {
        // 엘리베이터 정보 조회
        let result = await SDMSController.requestElevators();

        let elevatorDatas = [];
        elevatorDatas = result.elevators;

        if (result !== null && result.success === true) {

            // 값 비교 후 다를 경우 dispatch
            let currentDatas = store.getState().elevatorDatas;

            // 기존 데이터가 없을 경우
            if (currentDatas.length === 0) {
                store.dispatch({ type: 'ELEVATOR_INFOS', elevatorDatas: elevatorDatas });
                return;
            }

            let compare = isEqual(currentDatas, elevatorDatas);

            if (!compare) {
                store.dispatch({ type: 'ELEVATOR_INFOS', elevatorDatas: elevatorDatas });
            }
        }
    }

    // ex) enabledSensorDatas = [
    //                              {
    //                                  "sensorType": "fire",
    //                                  "sensorIDs": [1,2,3,4]
    //                              },
    //                              {
    //                                  "sensorType": "etc",
    //                                  "sensorIDs": [2,5,7]
    //                              },
    //                              {
    //                                  "sensorType": "cctv",
    //                                  "sensorIDs": [2,5,7]
    //                              }
    //                          ]
    //     disabledSensorDatas = null
    static async updateSensorEnabled(enabledSensorDatas, disabledSensorDatas) {
        try {
            const jsonData = SdmsJsonManager.makeUpdateSensorEnabled(enabledSensorDatas, disabledSensorDatas);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

    static async requestAllDoors(siteID = -1) {
        try {
            const jsonData = SdmsJsonManager.makeRequestAllDoors(siteID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

    static async requestDoorStatus(siteID = -1) {
        try {
            const jsonData = SdmsJsonManager.makeRequestDoorStatus(siteID);

            const res = await fetch('SDMS/SDMS/RequestData', {
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

    static async requestSensorCount() {
        try {
            // 수소 센서 불러오기
            const res = await fetch('SDMS/Hydrogen/RequestSensorCount', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    const sensorList = {};

                    sensorList.h2SensorCount = result.h2SensorCount;
                    sensorList.disabledH2SensorCount = result.disabledH2SensorCount;
                    sensorList.tempSensorCount = result.tempSensorCount;
                    sensorList.disabledTempSensorCount = result.disabledTempSensorCount;
                    sensorList.flowSensorCount = result.flowSensorCount;
                    sensorList.disabledFlowSensorCount = result.disabledFlowSensorCount;
                    sensorList.conductSensorCount = result.conductSensorCount;
                    sensorList.disabledConductSensorCount = result.disabledConductSensorCount;
                    sensorList.gasSensorCount = result.gasSensorCount;
                    sensorList.disabledGASSensorCount = result.disabledGASSensorCount;
                    sensorList.pressureSensorCount = result.pressureSensorCount;
                    sensorList.disabledPressureSensorCount = result.disabledPressureSensorCount;

                    sensorList.o2SensorCount = result.o2SensorCount;
                    sensorList.disabledO2SensorCount = result.disabledO2SensorCount;
                    sensorList.h2LowSensorCount = result.h2LowSensorCount;
                    sensorList.disabledH2LowSensorCount = result.disabledH2LowSensorCount;
                    sensorList.h2JAGSensorCount = result.h2JAGSensorCount;
                    sensorList.disabledH2JAGSensorCount = result.disabledH2JAGSensorCount;
                    sensorList.o2JAGSensorCount = result.o2JAGSensorCount;
                    sensorList.disabledO2JAGSensorCount = result.disabledO2JAGSensorCount;


                    return [sensorList, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSensorCount 실패"];
    }

    static async requestHydrogenEquipZoneSensorList(sensorType, sensorID) {
        try {
            const data = {
                "SensorType": sensorType,
                "SensorID": sensorID
            };

            const res = await fetch('SDMS/Hydrogen/RequestHydrogenEquipZoneSensorList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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

    // 이상탐지
    static async requestTodaySensorAnomalyDetections(sensorID) {
        try {
            const data = {
                "SensorID": sensorID
            };

            const res = await fetch('AnomalyDetection/RequestTodaySensorAnomalyDetections', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    // 시뮬레이션
    static async requestSimulationData(datas) {
        try {
            const data = {
                "t_AmbC": datas.t_AmbC,
                "p_HBk_0": datas.p_HBk_0,
                "d2On": datas.d2On,
                "contOn": datas.contOn,
                "t_PreRun": datas.t_PreRun,
                "t_PreSet1": datas.t_PreSet1,
                "t_PreSet2": datas.t_PreSet2,
                "compMod": datas.compMod,

                "n_Source": datas.n_Source,
                "p_Source": datas.p_Source,
                "t_SourceC": datas.t_SourceC,
                "m_Source": datas.m_Source,

                "v_BufInd1": datas.v_BufInd1,
                "n_Buf1": datas.n_Buf1,
                "p_BufMax1": datas.p_BufMax1,
                "p_Buf_RC1": datas.p_Buf_RC1,
                "p_Buf_01": datas.p_Buf_01,
                "p_BufMin1": datas.p_BufMin1,

                "n_MCp": datas.n_MCp,
                "p_CpInMaxM": datas.p_CpInMaxM,
                "p_CpInMinM": datas.p_CpInMinM,
                "p_refM": datas.p_refM,
                "t_refCM": datas.t_refCM,
                "m_Cp_refM": datas.m_Cp_refM,
                "sp_CpM": datas.sp_CpM,
                "etaVM": datas.etaVM,
                "eta_CompM": datas.eta_CompM,
                "eta_motorM": datas.eta_motorM,
                "t_CoolSetCM": datas.t_CoolSetCM,
                "copm": datas.copm,

                "v_TkIndM": datas.v_TkIndM,
                "n_TkM": datas.n_TkM,
                "p_TkMaxM": datas.p_TkMaxM,
                "p_TkMinM": datas.p_TkMinM,
                "fuMoOnM": datas.fuMoOnM,
                "t_Tk_0CM": datas.t_Tk_0CM,

                "v_TkIndH": datas.v_TkIndH,
                "n_TkH": datas.n_TkH,
                "p_TkMaxH": datas.p_TkMaxH,
                "p_TkMinH": datas.p_TkMinH,
                "t_Tk_0CH": datas.t_Tk_0CH,

                "eA_Disp1": datas.eA_Disp1,
                "p_Class1": datas.p_Class1,
                "t_BaC1": datas.t_BaC1,
                "m_HFPLim1": datas.m_HFPLim1,
                "t_BrkMax1": datas.t_BrkMax1,
                "hfpMode1": datas.hfpMode1,
                "comOn1": datas.comOn1,

                "v_TkMode1": datas.v_TkMode1,
                "tvL1": datas.tvL1,
                "tV1": datas.tV1,
                "p_Tk_01": datas.p_Tk_01,
                "soC_G1": datas.soC_G1,
                "t_Tk_0C1": datas.t_Tk_0C1,

                "eA_Disp2": datas.eA_Disp2,
                "p_Class2": datas.p_Class2,
                "t_BaC2": datas.t_BaC2,
                "m_HFPLim2": datas.m_HFPLim2,
                "t_BrkMax2": datas.t_BrkMax2,
                "hfpMode2": datas.hfpMode2,
                "comOn2": datas.comOn2,

                "v_TkMode2": datas.v_TkMode2,
                "tvL2": datas.tvL2,
                "tV2": datas.tV2,
                "p_Tk_02": datas.p_Tk_02,
                "soC_G2": datas.soC_G2,
                "t_Tk_0C2": datas.t_Tk_0C2
            };

            const res = await fetch('MERI/RequestSimulationData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    // 위험성 평가 예측
    static async requestRisk(mode, node, param, deviation, language) {
        try {
            const data = {
                "mode": mode,
                "node": node,
                "param": param,
                "deviation": deviation,
                "language": language
            };

            const res = await fetch('KGS/RequestRisk', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestDamageScope(mode, node) {
        try {
            const data = {
                "mode": mode,
                "node": node,
            };

            const res = await fetch('KGS/RequestDamageScope', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return null;
    }


    static async requestRiskAssessInfo(id) {
        try {
            const data = {
                "RiskAssessInfoID": id
            };

            const res = await fetch('SDMS/Hydrogen/RequestRiskAssessInfo', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, null];
    }
}