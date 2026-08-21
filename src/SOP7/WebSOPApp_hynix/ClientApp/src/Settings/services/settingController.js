import JsonManager from "./jsonManager";
import SettingsStore from '../settingsStore';
import ProjectResource from '../../Root/resource/id';
//import { object } from "@amcharts/amcharts4/core";
import { isEqual } from 'lodash';

export class SettingController {
    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck == true)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        SettingController.WatchSettings();
        let timerSettings = setTimeout(async function tick() {
            await SettingController.WatchSettings();
            timerSettings = setTimeout(tick, 2000);
        }, 2000);
    }

    // 공용 옵션들 불러오기
    static async WatchSettings() {
        let selectSiteID = SettingsStore?.getState()?.selectSiteID;
        if (!selectSiteID)
            return;

        if (selectSiteID >= ProjectResource.Site.GG_A && selectSiteID <= ProjectResource.Site.GG_H) {
            const userInfo = await ProjectResource.initUserInfo();
            
            if (userInfo?.siteID === ProjectResource.Site.GG_A) {
                selectSiteID = userInfo.siteID;
            }
        }

        const [sdmsSettings, sdmsMessage] = await SettingController.reloadSdmsCommonSettings(selectSiteID);

        const [sopSettings, sopMessage] = await SettingController.reloadSopCommonSettings(selectSiteID);

        const [accountSettings, accountMessage] = await SettingController.reloadAccountSettings(selectSiteID);
    }

    static async reloadSdmsCommonSettings(selectSiteID) {
        const [sdmsSettings, sdmsMessage] = await SettingController.requestSdmsCommonSettings(selectSiteID);

        if (sdmsSettings === null) 
            return [false, sdmsMessage];
        
        let currentSettings = SettingsStore.getState().sdmsCommonSettings;

        if (currentSettings === null || currentSettings === undefined) {
            SettingsStore.dispatch({ type: 'SDMS_COMMON_SETTINGS', sdmsCommonSettings: sdmsSettings });
        } else {
            let compare = isEqual(currentSettings, sdmsSettings);

            if (!compare) {
                SettingsStore.dispatch({ type: 'SDMS_COMMON_SETTINGS', sdmsCommonSettings: sdmsSettings });
            }
        }

        return [true, sdmsMessage];
    }

    static async reloadSopCommonSettings(selectSiteID) {
        const [sopSettings, sopMessage] = await SettingController.requestSopCommonSettings(selectSiteID);

        if (sopSettings === null)
            return [false, sopMessage];

        let currentSettings = SettingsStore.getState().sopCommonSettings;

        if (currentSettings === null || currentSettings === undefined)
            SettingsStore.dispatch({ type: 'SOP_COMMON_SETTINGS', sopCommonSettings: sopSettings });
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

        const [accountSettings, accountMessage] = await SettingController.requestAccountSettings(userID);

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

    static async requestSettings(userID, siteID) {
        try {
            const jsonData = JsonManager.makeRequestSettings(userID, siteID);

            const res = await fetch('Settings/Settings/RequestData', {
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

    static async requestSdmsCommonSettings(selectSiteID) {
        try {
            const jsonData = JsonManager.makeRequestSdmsCommonSettings();

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [SettingController.makeSettingDatas(result.properties, selectSiteID), null];
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

    static async requestSopCommonSettings(selectSiteID) {
        try {
            const jsonData = JsonManager.makeRequestSopCommonSettings();

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [SettingController.makeSettingDatas(result.properties, selectSiteID), null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSopCommonSettings 실패"];
    }

    static async requestAccountSettings(id) {
        try {
            const jsonData = JsonManager.makeRequestAccountSettings(id);

            const res = await fetch('Settings/Settings/RequestData', {
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

    static makeSettingDatas(properties, selectSiteID) {
        const len = properties.length;
        const settings = {};

        for (let i = 0; i < len; i++) {
            const prop = properties[i];

            if (!selectSiteID)
                settings[prop.name] = prop.value;
            else if (selectSiteID === prop.siteID)
                settings[prop.name] = prop.value;
        }

        // (경기) 종합방재실 계정은 모든 입주기관의 useSensorTypes과 useReceiveSensorTypes데이터를 알 수 있어야 한다.
        if (selectSiteID >= ProjectResource.Site.GG_A && selectSiteID <= ProjectResource.Site.GG_H) {
            const useSensorTypesGroups = {};
            const useReceiveSensorTypesGroups = {};
        
            // 각 입주기관 별 허용된 센서 목록
            const allowedSensors = {
                [ProjectResource.Site.GG_B]: ["UseFire", "UseEmergencyBell", "UseBlackOut", "UseSubmerge", "UseEarthquake"],
                [ProjectResource.Site.GG_D]: ["UseFire", "UseEmergencyBell", "UseBlackOut", "UseSubmerge", "UseEarthquake"],
                [ProjectResource.Site.GG_E]: ["UseFire", "UseEmergencyBell", "UseBlackOut"],
                [ProjectResource.Site.GG_F]: ["UseFire", "UseEmergencyBell", "UseBlackOut", "UseSubmerge", "UseEarthquake"],
                [ProjectResource.Site.GG_G]: ["UseFire", "UseEmergencyBell", "UseBlackOut"],
                [ProjectResource.Site.GG_H]: ["UseFire", "UseEmergencyBell", "UseBlackOut"]
            };
        
            Object.keys(allowedSensors).forEach(site => {
                useSensorTypesGroups[site] = {};
                useReceiveSensorTypesGroups[site] = {};
            });
        
            for (const prop of properties) {
                const siteID = prop.siteID;
                if (!allowedSensors[siteID]) continue;
        
                const sensorName = prop.name;
                const receiveSensorName = prop.name;
        
                if (allowedSensors[siteID].includes(sensorName)) {
                    useSensorTypesGroups[siteID][sensorName] = prop.value;
                }
                if (allowedSensors[siteID].some(s => receiveSensorName === `UseReceive${s.slice(3)}`)) {
                    useReceiveSensorTypesGroups[siteID][receiveSensorName] = prop.value;
                }
            }

            settings["useSensorTypesGroups"] = useSensorTypesGroups;
            settings["useReceiveSensorTypesGroups"] = useReceiveSensorTypesGroups;
        }

        return settings;
    }

    static async requestSaveSettings(saveData, siteID) {
        try {
            const jsonData = JsonManager.makeSaveSettings(saveData, siteID);

            let url = 'Settings/Settings/RequestData';

            if (siteID >= ProjectResource.Site.GG_A && siteID <= ProjectResource.Site.GG_H) {
                url = 'SDMS/GGH/RequestData';
            }

            const res = await fetch(url, {
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

    static async requestSaveSetting(propertyName, propertyValue) {
        try {
            const res = await fetch('Settings/Settings/SaveSOPSetting', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ PropertyName: propertyName, PropertyValue: propertyValue })
            });

            if (res.ok) {
                const result = await res.json();
                return result.success;
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestSaveSettings 실패"];
    }

    static async requestUpdateSdmsSettings(settings) {
        try {
            const jsonData = JsonManager.makeUpdateSdmsSettings(settings);

            const res = await fetch('Settings/Settings/RequestData', {
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

        return [null, "requestUpdateSdmsSettings 실패"];
    }

    static async requestResetPopup(id, popupState) {
        try {
            const jsonData = JsonManager.makeRequestResetPopup(id, popupState);

            const res = await fetch('Settings/Settings/RequestData', {
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

        return [null, "requestResetPopup 실패"];
    }

    static async requestUploadBuildingFile(file, selectedSiteID) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);
            formData.append('siteID', selectedSiteID);

            const res = await fetch('Settings/Settings/UploadBuildingFile', {
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

    static async requestUploadBuildingGroupFile(file, selectedSiteID) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);
            formData.append('siteID', selectedSiteID);

            const res = await fetch('Settings/Settings/UploadBuildingGroupFile', {
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

    static async requestUploadFacilityFile(file, selectedSiteID) {
        try {
            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);
            formData.append('siteID', selectedSiteID);

            const res = await fetch('Settings/Settings/UploadFacilityFile', {
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

    static async requestUploadRegularTeamFile(file, selectedSiteID) {
        try {
            if (selectedSiteID === ProjectResource.Site.GG_A) {
                selectedSiteID = "null";
            }
            else {
                selectedSiteID = selectedSiteID.toString();
            }

            const formData = new FormData();
            //formData.append('textFile', file);
            formData.append('files', file);
            formData.append('siteID', selectedSiteID);

            const res = await fetch('Settings/Settings/UploadRegularTeam', {
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

    static async requestDownloadBuilding(selectedSiteID) {
        try {
            const jsonData = JsonManager.makeRequestDownloadBuilding(selectedSiteID);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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

    static async requestDownloadBuildingGroup(selectedSiteID) {
        try {
            const jsonData = JsonManager.makeRequestDownloadBuildingGroup(selectedSiteID);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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

    static async requestDownloadFacility(selectedSiteID) {
        try {
            const jsonData = JsonManager.makeRequestDownloadFacility(selectedSiteID);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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

    static async requestDownloadRegularTeam(selectedSiteID) {
        try {
            const jsonData = JsonManager.makeRequestDownloadRegularTeam(selectedSiteID);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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

    static async requestDownloadRegularTeams(siteIDs) {
        try {
            const jsonData = JsonManager.makeRequestDownloadRegularTeams(siteIDs);

            const res = await fetch('Settings/Settings/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                if (res.headers.get('content-type') === 'application/vnd.ms-excel') {
                    await SettingController.downloadFile(res);
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

    static async downloadFile(response) {
        const fileName = SettingController.getFileName(response);

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

    static async requestGetSpreadMessage() {
        try {
            const jsonData = JsonManager.makeRequestGetSpreadMessage();

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

    static async requestSetAccoutPopup(id) {
        try {
            const jsonData = JsonManager.makeRequestSetAccoutPopup(id);

            const res = await fetch('Settings/Settings/RequestData', {
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

        return [null, "requestSetAccoutPopup 실패"];
    }

    static async requestResetAccoutPopup(id) {
        try {
            const jsonData = JsonManager.makeRequestResetAccoutPopup(id);

            const res = await fetch('Settings/Settings/RequestData', {
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
                    return [result.accountPopups, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestResetAccoutPopup 실패"];
    }



    static async requestOnOffBroadcast(onOff, buildingID) {
        try {
            const jsonData = JsonManager.makeRequestOnOffBroadcast(onOff, buildingID);

            const res = await fetch('Settings/Settings/RequestData', {
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

        return [null, "requestUpdateSdmsSettings 실패"];
    }

    static async requestLogDeletePolicy() {
        try {
            const jsonData = JsonManager.makeRequestLogDeletePolicy();

            const res = await fetch('Settings/Settings/RequestLogDeletePolicy', {
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
                    return [result.deleteOption, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestLogDeletePolicy 실패"];
    }

    static async saveLogDeletePolicy(deleteOption, siteID) {
        try {
            const jsonData = JsonManager.makeSaveLogDeletePolicy(deleteOption, siteID);

            const res = await fetch('Settings/Settings/SaveLogDeletePolicy', {
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

        return [null, "saveLogDeletePolicy 실패"];
    }
}
