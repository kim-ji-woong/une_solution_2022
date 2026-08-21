import { isEqual } from "lodash";
import { ContextManager } from "../../Root/resource/contextManager";
import ProjectResource from "../../Root/resource/id";
import { UserDispatch } from "../../Root/resource/userDispatch";
import { JsonManager } from "./jsonManager";
import { SettingContextManager } from "../../Root/resource/settingContextManager";

export class SettingsController {
    static timerCheck = false;
    static timerAlarm = 0;
    static contextType = UserDispatch;

    static startWatchTimer(stateContainer, dispatch) {
        // 타이머 실행 유무 판단
        if (SettingsController.timerCheck)
            return;

        // 타이머 실행 체크
        SettingsController.timerCheck = true;

        // 1초에 한번씩 이벤트 알람 호출
        SettingsController.timerAlarm = setTimeout(function tick() {
            const state = stateContainer.getSettingState();
            SettingsController.WatchSettingCheck(state, dispatch);
            SettingsController.timerAlarm = setTimeout(tick, 1000);
        }, 1000);
    }

    static stopWatchTimer() {
        SettingsController.timerCheck = false;

        if (SettingsController.timerAlarm > 0) {
            clearTimeout(SettingsController.timerAlarm);
            SettingsController.timerAlarm = 0;
        }
    }

    static async WatchSettingCheck(state, dispatch) {
        const [result, message] = await SettingsController.requestAlarmOptions();

        if (result == null) {
            return;
        }

        if (state == null || state == undefined) {
            dispatch({ type: SettingContextManager.SettingInfo, settingState: result, message: message });
        }
        else {
            // 기존에 저장된 리스트와 DB 알람리스트 값 비교
            let compare = isEqual(state, result);

            // 값이 다르다면 업데이트
            if (!compare) {
                dispatch({ type: SettingContextManager.SettingInfo, settingState: result, message: message });
            } 
        }
    }

    static async requestResetPopup(userID) {
        try {
            const jsonData = JsonManager.makeRequestResetPopup(userID);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestResetPopup', {
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
                    return [result.success, ""];
                }
                else {
                    return [false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestResetPopup 실패"];
    }

    static async requestOptions(userID, campusID) {
        try {
            const jsonData = JsonManager.makeRequestOptions(userID, campusID);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestOptions', {
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

        return [null, "requestOptions 실패"];
    }

    static async updateOptions(userID, campusID, option3DNormal, option3DSensor, optionSopNormal) {
        try {
            const jsonData = JsonManager.makeUpdateOptions(userID, campusID, option3DNormal, option3DSensor, optionSopNormal);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/UpdateOptions', {
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

        return [null, "updateOptions 실패"];
    }

    static async requestLinkedSOPList(campusID) {
        try {
            const jsonData = JsonManager.makeRequestLinkedSOPList(campusID);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestLinkedSOPList', {
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
                    return [result.sopList, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestLinkedSOPList 실패"];
    }

    static async requestSOPList(campusID) {
        try {
            const jsonData = JsonManager.makeRequestSOPList(campusID);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestSOPList', {
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
                    return [result.disasterCategories, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSOPList 실패"];
    }

    static async updateSettings(userID, campusID, option3DNormal, option3DSensor, optionSopNormal, updateLinkedSOPList) {
        try {
            const jsonData = JsonManager.makeUpdateSettings(userID, campusID, option3DNormal, option3DSensor, optionSopNormal, updateLinkedSOPList);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/UpdateSettings', {
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

        return [null, "updateSettings 실패"];
    }

    static async requestAlarmOptions() {
        try {
            const jsonData = JsonManager.makeRequestAlarmOptions();

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestAlarmOptions', {
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
                    return [result.option3DSensor, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestAlarmOptions 실패"];
    }

    // SOP 옵션 단일 저장
    static async requestSaveSOPSetting(propertyName, propertyValue, campusID) {
        try {
            const res = await fetch('Settings/Settings/SaveSOPSetting', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ PropertyName: propertyName, PropertyValue: propertyValue, CampusID: campusID })
            });

            if (res.ok) {
                const result = await res.json();
                return result.success;
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSaveSOPSetting 실패"];
    }
}