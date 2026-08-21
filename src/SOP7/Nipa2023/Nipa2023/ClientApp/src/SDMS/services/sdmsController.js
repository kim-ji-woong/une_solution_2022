import ProjectResource from '../../Root/resource/id';
import { SdmsJsonManager } from './sdmsJsonManager';
import { AlarmContextManager } from '../../Root/resource/alarmContextManager';
import { isEqual } from 'lodash';
import { UserDispatch } from '../../Root/resource/userDispatch';
import SdmsResource from '../resource/id';

export class SdmsController {
    static timerCheck = false;
    static timerAlarm = 0;
    static contextType = UserDispatch;
    
    static startWatchTimer(stateContainer, dispatch) {
        // 타이머 실행 유무 판단
        if (SdmsController.timerCheck)
            return;

        // 타이머 실행 체크
        SdmsController.timerCheck = true;

        // 1초에 한번씩 이벤트 알람 호출
        SdmsController.timerAlarm = setTimeout(function tick() {
            const state = stateContainer.getAlarmState();
            SdmsController.WatchAlarmCheck(state, dispatch, stateContainer);
            SdmsController.timerAlarm = setTimeout(tick, 1000);
        }, 1000);
    }

    static stopWatchTimer() {
        SdmsController.timerCheck = false;

        if (SdmsController.timerAlarm > 0) {
            clearTimeout(SdmsController.timerAlarm);
            SdmsController.timerAlarm = 0;
        }
    }

    static async WatchAlarmCheck(state, dispatch, stateContainer) {
        const user = await ProjectResource.getUserInfo();

        if (user === null || user === undefined) {
            return;
        }

        const [result, resultMessage] = await SdmsController.requestTodayAlarmData();
    
        if (result == null) {
            return;
        }

        // 알람 객체만 남기고 나머지 삭제
        const { message, success, ...alarmList } = result;

        if (state == null || state == undefined) {
            dispatch({ type: AlarmContextManager.AlarmInfo, alarmState: alarmList, message: resultMessage });
        }
        else {
            // 기존에 저장된 알람리스트와 DB 알람리스트 값 비교
            let compare = isEqual(state, alarmList);

            // 값이 다르다면 업데이트
            if (!compare) {

                const prevDatas = state['workerTagAlarmDatas'];
                const updatedDatas = alarmList['workerTagAlarmDatas'];

                // 작업자 장비협착 이벤트 알람이 시스템종료될 경우 web to app 신호 전송
                if(prevDatas.length === updatedDatas.length) {

                    let item = [];
                    for (let i = 0; i < prevDatas.length; i++) {
                        if(prevDatas[i].isAlarm !== updatedDatas[i].isAlarm){
                            item.push(updatedDatas[i]);
                        }
                    }

                    if (item.length > 0 && item[0]?.materialType === SdmsResource.facilityType.EQUIPMENT_TIGHTENING) {
                        stateContainer.sendFacilityAlarm(item[0]);
                    } 
                }

                const prevEquipment = state['equipmentAlarmDatas'];
                const updatedEquipment = alarmList['equipmentAlarmDatas'];

                // 설비 이벤트 알람이 시스템종료될 경우 web to app 신호 전송
                if(prevEquipment.length === updatedEquipment.length) {

                    let item = [];
                    for (let i = 0; i < prevEquipment.length; i++) {
                        if(prevEquipment[i].isAlarm !== updatedEquipment[i].isAlarm){
                            item.push(updatedEquipment[i]);
                        }
                    }

                    if (item.length > 0 && item[0].facilityType === SdmsResource.facilityType.EQUIPMENT) {
                        stateContainer.sendFacilityAlarm(item[0]);
                    } 
                }

                dispatch({ type: AlarmContextManager.AlarmInfo, alarmState: alarmList, message: resultMessage });
            } 
        }
    }

    static async requestSensorList(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSensorList(campusID);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/SDMS/RequestSensorList', {
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

    static async requestAtmosphereSensorInfo(sensorID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestAtmosphereSensorInfo(sensorID);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/SDMS/RequestAtmosphereSensorInfo', {
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

        return [null, "requestAtmosphereSensorInfo 실패"];
    }

    static async requestGasSensorInfo(sensorID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestGasSensorInfo(sensorID);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/SDMS/RequestGasSensorInfo', {
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

        return [null, "requestGasSensorInfo 실패"];
    }

    static async requestBuildingGroupList(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestBuildingGroupList(campusID);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestBuildingGroupList', {
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

        return [null, null, "requestBuildingGroupList 실패"];
    }

    static async requestZoneList(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestZoneList(campusID);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestZoneList', {
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
                    return [result.zones, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestZoneList 실패"];
    }

    static async requestZoneData(zoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestZoneData(zoneID);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestZoneData', {
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
                    return [result.zoneData, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestZoneData 실패"];
    }

    static async requestSaveViewport(zoneID, cameraLocationX, cameraLocationY, cameraLocationZ, cameraRotationX, cameraRotationY, cameraRotationZ) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSaveViewport(zoneID, cameraLocationX, cameraLocationY, cameraLocationZ, cameraRotationX, cameraRotationY, cameraRotationZ);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestSaveViewport', {
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
            console.log(e);
        }

        return [false, "requestSaveViewport 실패"];
    }

    static async requestTodayAlarmData() {
        try {
            const jsonData = SdmsJsonManager.makeRequestTodayAlarmData();

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestTodayAlarmData', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestTodayAlarmData 실패"];
    }

    // 오늘부터 (오늘 포함)몇일 이전까지의 알람정보를 조회할 것인가?
    static async requestPastAlarmData(days) {
        try {
            const jsonData = SdmsJsonManager.makeRequestPastAlarmData(days);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestPeriodAlarmData', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestPastAlarmData 실패"];
    }

    // 특정 기간동안의 알람정보 조회
    static async requestPeriodAlarmData(beginYear, beginMonth, beginDay, endYear, endMonth, endDay) {
        try {
            const jsonData = SdmsJsonManager.makeRequestPeriodAlarmData(beginYear, beginMonth, beginDay, endYear, endMonth, endDay);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestPeriodAlarmData', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestPeriodAlarmData 실패"];
    }

    // 공장동 리스트 얻어오기
    static async requestCampusList() {
        try {
            const jsonData = SdmsJsonManager.makeRequestCampusList();

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestCampusList', {
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
                    return [result.campusList, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestCampusList 실패"];
    }

    // 설비 리스트 얻어오기
    static async requestFacilityList(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityList(campusID);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestFacilityList', {
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
                    return [SdmsController.makeFacility(result.facilities), result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFacilityList 실패"];
    }

    // 설비 상세정보 얻어오기
    static async requestFacilityData(facilityID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFacilityData(facilityID);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestFacilityData', {
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
                    return [SdmsController.makeFacilityData(result.datas), result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestFacilityData 실패"];
    }

    // MES Data 얻어오기
    // mesType : 0(생산현황), 1(품질현황), 2(구매현황), 3(매출현황)
    static async requestMESData(campusID, mesType) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMESData(campusID, mesType);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestMESData', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestMESData 실패"];
    }

    // MES 설비 Data 얻어오기
    static async requestMESEquipmentData(equipmentIDs) {
        try {
            const jsonData = SdmsJsonManager.makeRequestMESEquipmentData(equipmentIDs);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestMESEquipmentData', {
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
                    return [result.datas, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestMESEquipmentData 실패"];
    }

    static async requestClearAlarm(sensorZoneID, sensorZoneHistoryID, accessedUserID, memo, isMalfunction = false) {
        try {
            const jsonData = SdmsJsonManager.makeRequestClearAlarm(sensorZoneID, sensorZoneHistoryID, accessedUserID, memo, isMalfunction);

            const res = await fetch('SDMS/SDMS/RequestClearAlarm', {
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

    static async requestCampusData(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestCampusData(campusID);

            const res = await fetch('SDMS/SDMS/RequestCampusData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.datas, ""];
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestCampusData 실패"];
    }

    static async requestAPStatistics(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestAPStatistics(campusID);

            const res = await fetch('SDMS/SDMS/RequestAPStatistics', {
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
                    result.locationCount = SdmsController.locationCountToJson(result.locationCount);
                    result.locationWorkerCount = SdmsController.locationCountToJson(result.locationWorkerCount);
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestAPStatistics 실패"];
    }

    static async requestWorkerStatistics(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestWorkerStatistics(campusID);

            const res = await fetch('SDMS/SDMS/RequestWorkerStatistics', {
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
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestWorkerStatistics 실패"];
    }

    static async requestAPList(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestAPList(campusID);

            const res = await fetch('SDMS/SDMS/RequestAPList', {
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
                    return [result.apList, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestAPList 실패"];
    }

    static async requestWorkerList(campusID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestWorkerList(campusID);

            const res = await fetch('SDMS/SDMS/RequestWorkerList', {
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
                    return [result.workerList, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, "requestWorkerList 실패"];
    }

    // CCTV Stream Server URL 얻어오기
    static async requestStreamServerURL() {
        try {
            const jsonData = SdmsJsonManager.makeRequestStreamServerURL();

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestStreamServerURL', {
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
            console.log(e);
        }

        return "";
    }

    static locationCountToJson(locationCount) {
        const result = {};

        for (const locationData of locationCount) {
            const index = locationData.lastIndexOf('_');

            if (index < 0) {
                continue;
            }

            const count = parseInt(locationData.substring(index + 1).trim());

            if (count > 0) {
                result[locationData.substring(0, index).trim()] = count;
            }
        }

        return result;
    }

    static makeFacility(facilities) {
        const result = [];

        for (const facility of facilities) {
            const _facility = { ...facility.facility };
            _facility.datas = SdmsController.makeFacilityData(facility.datas);
            result.push(_facility);
        }

        return result;
    }

    static makeFacilityData(datas) {
        const _datas = {};

        for (const data of datas) {
            _datas[data.propertyName] = data;
        }

        return _datas;
    }

    static setMode(mode) {
        SdmsResource.setMode(mode);
    }

    static async requestSituationNotice(facilityType, sensorZoneID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestSituationNotice(facilityType, sensorZoneID);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestSituationNotice', {
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

    static async requestRealSensorData(targetTypeID, currentTypeID, sensorID, zoneID) {
        if (targetTypeID === null || currentTypeID === null || sensorID === null || zoneID === null) {
            return [null, ""];
        }

        try {
            const jsonData = SdmsJsonManager.makeRequestRealSensorData(targetTypeID, currentTypeID, sensorID, zoneID);

            const res = await fetch(ProjectResource.baseUrl + 'SDMS/SDMS/RequestRealSensorData', {
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
                    if (result.etc) {
                        return [result.etc, ""];
                    }
                    else if (result.psm) {
                        return [result.psm, ""];
                    }
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "해당 센서정보를 찾을수 없습니다."];
    }
}