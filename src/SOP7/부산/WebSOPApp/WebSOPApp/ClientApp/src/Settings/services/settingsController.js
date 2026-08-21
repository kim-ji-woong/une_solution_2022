import { isEqual } from "lodash";
import ProjectResource from "../../Root/resource/id";
import { JsonManager } from "./jsonManager";
import { SettingContextManager } from "../../Root/resource/settingContextManager";
import SettingsStore from "../settingsStore";

export class SettingsController {
    static timerCheck = false;
    static timerAlarm = 0;
    
    static makeSettingDatas(properties) {
        const len = properties.length;
        const settings = {};

        for (let i = 0; i < len; i++) {
            const prop = properties[i];
            settings[prop.name] = prop.value;
        }

        return settings;
    }
    
    static startWatchTimer() {
        if (SettingsController.timerCheck)
            return;
        
        SettingsController.timerCheck = true;
        
        SettingsController.WatchSettings();
        let timerSettings = setTimeout(async function tick() {
            await SettingsController.WatchSettings();
            timerSettings = setTimeout(tick, 2000);
        }, 2000);
    }

    // 공용 옵션들 불러오기
    static async WatchSettings() {
        const [sdmsSettings, sdmsMessage] = await SettingsController.reloadSdmsCommonSettings();

        const [sopSettings, sopMessage] = await SettingsController.reloadSopCommonSettings();

        const [accountSettings, accountMessage] = await SettingsController.reloadAccountSettings();
    }

    static stopWatchTimer() {
        SettingsController.timerCheck = false;

        if (SettingsController.timerAlarm > 0) {
            clearTimeout(SettingsController.timerAlarm);
            SettingsController.timerAlarm = 0;
        }
    }

    static async requestSettings(id) {
        try {
            const jsonData = JsonManager.makeRequestSettings(id);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestData', {
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
                    return [result, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSettings 실패"];
    }

    static async reloadSdmsCommonSettings() {
        const [sdmsSettings, sdmsMessage] = await SettingsController.requestSdmsCommonSettings();

        if (sdmsSettings === null)
            return [false, sdmsMessage];

        let currentSettings = SettingsStore.getState().sdmsCommonSettings;

        if (currentSettings === null || currentSettings === undefined) {

            SettingsStore.dispatch({ type: 'SDMS_COMMON_SETTINGS', sdmsCommonSettings: sdmsSettings });
        } else {
            for (const name in sdmsSettings) {
                const oldValue = currentSettings[name];
                const newValue = sdmsSettings[name];

                if (oldValue !== newValue) {
                    SettingsStore.dispatch({ type: 'SDMS_COMMON_SETTINGS', sdmsCommonSettings: sdmsSettings });
                    break;
                }
            }
        }

        return [true, sdmsMessage];
    }

    static async reloadSopCommonSettings(isFirst) {
        const [sopSettings, sopMessage] = await SettingsController.requestSopCommonSettings();

        if (sopSettings === null)
            return [false, sopMessage];

        let currentSettings = SettingsStore.getState().sopCommonSettings;

        if (isFirst) {
            SettingsStore.dispatch({ type: 'SOP_COMMON_SETTINGS', sopCommonSettings: sopSettings });
        }

        if (currentSettings === null || currentSettings === undefined) {
            SettingsStore.dispatch({type: 'SOP_COMMON_SETTINGS', sopCommonSettings: sopSettings});
        }
        else {
            for (const name in sopSettings) {
                const oldValue = currentSettings[name];
                const newValue = sopSettings[name];

                if (oldValue !== newValue) {
                    SettingsStore.dispatch({ type: 'SOP_COMMON_SETTINGS', sopCommonSettings: sopSettings });
                    break;
                }
            }
        }

        return [true, sopMessage];
    }

    static async reloadAccountSettings() {
        const userInfo = await ProjectResource.initUserInfo();

        if (userInfo === null || userInfo === undefined)
            return [false, "해당 계정 정보가 없습니다."];

        const userID = userInfo.id;

        const [accountSettings, accountMessage] = await SettingsController.requestAccountSettings(userID);

        if (accountSettings === null)
            return [false, accountMessage];

        if (accountSettings !== null || accountSettings !== undefined) {
            let shortcutKey = accountSettings.shortcutKey;
            let currentKey = SettingsStore.getState().shortcutKey;

            if (currentKey === null || currentKey === undefined)
                SettingsStore.dispatch({ type: 'SHORTCUT_KEY', shortcutKey: shortcutKey });
            else {
                if (shortcutKey.dashboard !== currentKey.dashboard ||
                    shortcutKey.history !== currentKey.history ||
                    shortcutKey.home !== currentKey.home ||
                    shortcutKey.rotation !== currentKey.rotation ||
                    shortcutKey.sdms !== currentKey.sdms ||
                    shortcutKey.settings !== currentKey.settings ||
                    shortcutKey.sop !== currentKey.sop ||
                    shortcutKey.sopMgr !== currentKey.sopMgr ||
                    shortcutKey.teamEdit !== currentKey.teamEdit)
                    SettingsStore.dispatch({ type: 'SHORTCUT_KEY', shortcutKey: shortcutKey });
            }

            // SDMS 페이지를 동시에 띄워 (팝업창 위치/사이즈, 자동회전 대기시간) 서로 동기화 시킬 필요는 없음
            //let popupState = SettingsStore.getState().popupState;
            //let idleTime = SettingsStore.getState().idleTime;
        }

        return [true, accountMessage];
    }

    static async requestSdmsCommonSettings() {
        try {
            const jsonData = JsonManager.makeRequestSdmsCommonSettings();

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestData', {
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
                    return [SettingsController.makeSettingDatas(result.properties), null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSdmsCommonSettings 실패"];
    }

    static async requestSopCommonSettings() {
        try {
            const jsonData = JsonManager.makeRequestSopCommonSettings();

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestData', {
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
                    return [SettingsController.makeSettingDatas(result.properties), null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSdmsCommonSettings 실패"];
    }

    static async requestAccountSettings(id) {
        try {
            const jsonData = JsonManager.makeRequestAccountSettings(id);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestData', {
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
                    return [result, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestAccountSettings 실패"];
    }

    static async requestResetPopup(userID, popupState) {
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

    static async requestLinkedSOPList() {
        try {
            const jsonData = JsonManager.makeRequestLinkedSOPs();

            const res = await fetch(ProjectResource.baseUrl + '/SOPManager/SOP/RequestData', {
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
                    return [result.linkedSops, result.message];
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

    static async requestSaveSettings(saveData) {
        try {
            const jsonData = JsonManager.makeSaveSettings(saveData);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSaveSettings 실패"];
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

    static async requestGetSpreadMessage() {
        try {
            const jsonData = JsonManager.makeRequestGetSpreadMessage();

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/SDMS/RequestData', {
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
                    return [result.spreadMessages, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestGetSpreadMessage 실패"];
    }

    static async requestSetSpreadMessage(addSpread, updateSpread, deleteSpread) {
        try {
            const jsonData = JsonManager.makeRequestSetSpreadMessage(addSpread, updateSpread, deleteSpread);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/SDMS/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSetSpreadMessage 실패"];
    }
    
    static async requestUpdateLinkedSOPs(addLinkedSOP, updateLinkedSOP, removeLinkedSOP) {
        try {
            const jsonData = JsonManager.makeRequestUpdateLinkedSOPs(addLinkedSOP, updateLinkedSOP, removeLinkedSOP);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestData', {
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
                    return [result.success, null];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async downloadFile(response) {
        const fileName = SettingsController.getFileName(response);

        if (fileName.length === 0) {
            return;
        }

        const blob = await response.blob();
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        window.URL.revokeObjectURL(blob);
    }

    static getFileName(response) {
        const result = response.headers.get('content-disposition');
        const tokens = result.split(';');

        const tokenCount = tokens.length;

        for (let i = 0; i < tokenCount; i++) {
            const token = tokens[i].trim();
            const index = token.indexOf('=');

            if (index > 0) {
                const key = token.substring(0, index).trim();
                const value = token.substring(index + 1).trim();

                if (key === 'filename*') {
                    const index2 = value.indexOf("''");

                    if (index2 >= 0) {
                        const uri = value.substring(index2 + 2).trim();
                        return decodeURI(uri);
                    }
                }
            }
        }

        return "";
    }

    static async requestDownloadRegularTeam(siteID) {
        try {
            const jsonData = JsonManager.makeRequestDownloadRegularTeam(siteID);

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingsController.downloadFile(res);
                    return [true, ""];
                }
                else {
                    const result = await res.json();

                    if (result.success) {
                        return [result.success, ""];
                    }
                    else {
                        return [null, result.message];
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }

    static async requestUploadRegularTeamFile(file, siteID) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);
            formData.append('nSiteID', siteID)

            const res = await fetch(ProjectResource.baseUrl + '/Settings/Settings/UploadRegularTeam', {
                method: 'post',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.success, ""];
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
}

export default SettingsController;