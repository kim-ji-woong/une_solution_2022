import { createStore } from 'redux';

export default createStore(function (state, action) {
    if (state === undefined) {
        return { weatherDatas: null }
    }
    else if (action.type === 'SENSOR_ALARM') {
        return {
            sensorAlarm: action.sensorAlarm,
            weatherDatas: state.weatherDatas,
            mobileUsers: state.mobileUsers,
            psmSensors: state.psmSensors,
            actionType: action.type
        }
    }
    else if (action.type === 'SOP_HISTORY') {
        return {
            sensorAlarm: state.sensorAlarm,
            sensorAllAlarm: state.sensorAllAlarm,
            sensorCount: state.sensorCount,
            sopHistory: action.sopHistory,
            weatherDatas: state.weatherDatas,
            newCCTVList: state.newCCTVList,
            rangeSensors: state.rangeSensors,
            workerInfos: state.workerInfos,
            actionType: action.type
        }
    }
    else if (action.type === 'WEATHER_CURRENT') {
        return {
            sensorAlarm: state.sensorAlarm,
            weatherDatas: action.weatherDatas,
            mobileUsers: state.mobileUsers,
            psmSensors: state.psmSensors,
            actionType: action.type
        }
    }
    else if (action.type === 'MOBILE_USERS') {
        return {
            sensorAlarm: state.sensorAlarm,
            weatherDatas: state.weatherDatas,
            mobileUsers: action.mobileUsers,
            psmSensors: state.psmSensors,
            actionType: action.type
        }
    }
    else if (action.type === 'PSM_SENSORS') {
        return {
            sensorAlarm: state.sensorAlarm,
            weatherDatas: state.weatherDatas,
            mobileUsers: state.mobileUsers,
            psmSensors: action.psmSensors,
            actionType: action.type
        }
    }

    return state;
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
