import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return {
            sensorAlarm: [],
            sensorAllAlarm: [],
            sensorTodayAlarm: [],
            rangeSensors: [],
            workerInfos: null,
            elevatorDatas: [],
            parkingDatas: [],
            doorDatas: [],
            upsDatas: [],
            evacuations: null,
            earthquake: {},
        }
    }
    else if (action.type === 'SENSOR_ALARM') { // 개수 제한한 알람 리스트
        return {
            sensorAlarm: action.sensorAlarm,
            sensorAllAlarm: action.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'TODAY_ALARM') { // 개수 제한한 알람 리스트
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: action.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'SENSOR_COUNT') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: action.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'SOP_HISTORY') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: action.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'WEATHER_CURRENT') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: action.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'NEW_CCTV_LIST') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: action.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: action.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'RANGE_SENSORS') {
        // 센서 수치 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: action.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'WORKER_INFOS') {
        // 인원 현황
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: action.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'ELEVATOR_INFOS') {
        // 엘리베이터 정보 (경기)
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: action.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'EVACUATIONS_INFOS') {
        // 피난유도 (경기)
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: action.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'PARKING_INFOS') {
        // 주차관제 (경기)
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: action.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'DOOR_INFOS') {
        // 출입통제 (경기)
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: action.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'UPS_INFOS') {
        // 전력 (경기)
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: action.upsDatas,
            evacuations: state.evacuations,
            earthquake: state.earthquake,
            actionType: action.type
        }
    }
    else if (action.type === 'EARTHQUAKE_INFOS') {
        // 지진 (경기)
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorTodayAlarm: state.sensorTodayAlarm,
            sensorCount: state.sensorCount,
            sopHistory: state.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            cctvAllList: state.cctvAllList,
            elevatorDatas: state.elevatorDatas,
            parkingDatas: state.parkingDatas,
            doorDatas: state.doorDatas,
            upsDatas: state.upsDatas,
            evacuations: state.evacuations,
            earthquake: action.earthquake,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
