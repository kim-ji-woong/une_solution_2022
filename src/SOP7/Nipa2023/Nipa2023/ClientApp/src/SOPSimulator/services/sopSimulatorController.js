import { isEqual } from "lodash";
import { SopContextManager } from "../../Root/resource/sopContextManager";
import { UserDispatch } from "../../Root/resource/userDispatch";
// import store from '../../Root/store';

export default class SopSimulatorController {
    static timerCheck = false;
    static timer = 0;
    static contextType = UserDispatch;

    static async DisplaySopRun() {
        try {
            const response = await fetch('SOP/SOPSimulator/DisplaySopRun', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

            if (response.ok && response.status !== 204) {
                const datas = await response.json();
                return datas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async WatchSopRun(state, dispatch) {
        let sopHistory = await SopSimulatorController.DisplaySopRun();

        if (state === null) {
            console.log('changed? : ' + sopHistory.changed + ', nChanged : ' + sopHistory.nChanged + ', state.nChanged: null');
        }
        else {
            console.log('changed? : ' + sopHistory.changed + ', nChanged : ' + sopHistory.nChanged + ', state.nChanged: ' + state.nChanged);
        }

        // sopHistory.changed || sopHistory.nChanged 더블체크
        if (state === null || sopHistory.changed || sopHistory.nChanged !== state?.nChanged || state.sopRunDatas?.length !== sopHistory.sopRunDatas?.length) {
            console.log('sopHistory.sopRunDatas', sopHistory.sopRunDatas);
            if (state !== null) {
                console.log('state.sopRunDatas', state.sopRunDatas);
            }
            console.log('update sop history');
            dispatch({ type: SopContextManager.RunSOP, sopHistory, message: ''});
        }
    }

    /*
    static async WatchCommonSettings() {
        const [settings, message] = await SettingController.requestSopCommonSettings();

        if (settings !== null) {
            store.dispatch({ type: 'SOP_COMMON_SETTINGS', sopCommonSettings: settings });
        }
    }
    */

    static StartWatchTimer(stateContainer, dispatch) {
        // 타이머 실행 유무 판단
        if (SopSimulatorController.timerCheck)
            return;

        // 타이머 실행 체크
        SopSimulatorController.timerCheck = true;


        SopSimulatorController.timer = setTimeout(function tick() {
            const state = stateContainer.getSopHistoryState();
            SopSimulatorController.WatchSopRun(state, dispatch);
            SopSimulatorController.timer = setTimeout(tick, 1000);
        }, 500);
    }

    static stopWatchTimer() {
        SopSimulatorController.timerCheck = false;

        if (SopSimulatorController.timer > 0) {
            clearTimeout(SopSimulatorController.timer);
            SopSimulatorController.timer = 0;
        }
    }

    static async excuteSOP(beginDate, versionID, actionStepID, position, userID, sensorZoneHistoryID) {
        try {
            let ymdhms = '';
            if (beginDate !== null) {
                const y = beginDate.getFullYear();
                const m = beginDate.getMonth() + 1;
                const d = beginDate.getDate();
                const h = (beginDate.getHours() + 24) % 12
                const m2 = beginDate.getMinutes()

                ymdhms = y + "-" + m + "-" + d + " " + h + ":" + m2 + ":0";
            }

            const response = await fetch('SOP/SOPSimulator/ExcuteSOP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    strBeginTime: ymdhms,
                    VersionID: versionID,
                    ActionStepID: actionStepID,
                    Position: position,
                    LastAccessedUserID: userID,
                    SensorZoneHistoryID: sensorZoneHistoryID
                })
            });
            const actionStepHistoryID = await response.json();            
            return actionStepHistoryID; // result : ActionStepHistory ID
        } catch (e) {
            console.log(e);
        }
    }

    static async closeSOP(actionStepHistoryID, endTime, accessedUserID) {
        try {
            await fetch('SOP/SOPSimulator/CloseSOPByUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({ ActionStepHistoryID: actionStepHistoryID, EndTime:endTime, LastAccessedUserID: accessedUserID })
            });
        } catch (e) {
            console.log(e);
        }
    }

    static async progressSOP(actionStepHistoryID, componentID, componentType, accessedUserID, status, text) {
        try {
            const response = await fetch('SOP/SOPSimulator/ProgressSOP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentID: componentID,
                    ComponentType: componentType,
                    AccessedUserID: accessedUserID,
                    Status: status,
                    Text: text
                })
            });

            const history = await response.json();
            return history; // result : ComponentHistory
        } catch (e) {
            console.log(e);
        }
    }

    static async runSection(sopKey, actionStepID, actionStepHistoryID, section, accessedUserID, decisionValue, isSkip) {
        try {
            if (!decisionValue)
                decisionValue = null;

            const response = await fetch('SOP/SOPSimulator/RunSection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepID: actionStepID,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentID: section.id,
                    ComponentType: section.componentType,
                    AccessedUserID: accessedUserID,
                    DecisionValue: decisionValue,
                    Text: section.text,
                    Status: section.status,
                    Skip:isSkip
                })
            });

            const history = await response.json();
            return history; // result : ComponentHistory
        } catch (e) {
            console.log(e);
        }
    }

    static async monitorComponentHistory() {
        try {
            const response = await fetch('SOP/SOPSimulator/MonitorComponentHistory');
            const datas = await response.json();
            
            return datas;
        } catch (e) {
            console.log(e);
        }
    }

    static async progressMission(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID, checked) {
        try {
            const response = await fetch('SOP/SOPSimulator/ProgressMission', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentType: componentType,
                    ComponentID: componentID,
                    DataIndex: dataIndex,
                    ComponentStatus: componentStatus,
                    AccessedUserID: userID,
                    Checked: checked
                })
            });

            const detail = await response.json();
            return detail; // result : ComponentHistoryDetail
        } catch (e) {
            console.log(e);
        }
    }

    static async progressSpread(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID, isSMS, isEmail, isBroadcast, isSiren, message, receiverPhoneNumbers) {
        try {
            const response = await fetch('SOP/SOPSimulator/ProgressSpread', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentType: componentType,
                    ComponentID: componentID,
                    DataIndex: dataIndex,
                    ComponentStatus: componentStatus,
                    AccessedUserID: userID,
                    IsSMS: isSMS,                    
                    IsEmail: isEmail,
                    IsBroadcast: isBroadcast,
                    IsSiren: isSiren,
                    Message: message,
                    phoneNumbers: receiverPhoneNumbers
                })
            });

            const detail = await response.json();
            return detail; // result : 
        } catch (e) {
            console.log(e);
        }
    }

    static async excuteExternalProgram(sopKey, actionStepHistoryID, componentType, componentID, dataIndex, componentStatus, userID) {
        try {
            const response = await fetch('SOP/SOPSimulator/ExcuteExternalProgram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SopKey: sopKey,
                    ActionStepHistoryID: actionStepHistoryID,
                    ComponentType: componentType,
                    ComponentID: componentID,
                    DataIndex: dataIndex,
                    ComponentStatus: componentStatus,
                    AccessedUserID: userID
                })
            });

            const detail = await response.json();
            return detail; // result : 
        } catch (e) {
            console.log(e);
        }
    }

    static async requestSensorName(sensorZoneHistoryID) {
        try {
            const response = await fetch('SOP/SOPSimulator/RequestSensorName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    SensorZoneHistoryID: sensorZoneHistoryID
                })
            });

            const value = await response.json();
            return value.sensorName; // result : Disaster ID
        } catch (e) {
            console.log(e);
        }
    }
}