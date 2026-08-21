export class JsonManager {

    static makeSaveSettings(saveData) {
        const json = {
            "requestSaveSettings":
                {
                    "userID": saveData.userID,
                    "shortcutKey": saveData.shortcutKey,
                    "idleTime": saveData.idleTime,
                    "reAlarm": saveData.reAlarm,
                    "useReceiveFire": saveData.useReceiveFire,
                    "useReceivePSM": saveData.useReceivePSM,
                    "useReceiveETC": saveData.useReceiveETC,
                    "useReceiveSVMS": saveData.useReceiveSVMS,
                    "eventInfoDisplayTerm": saveData.eventInfoDisplayTerm,
                    "useScreenMove": saveData.useScreenMove,
                    "exeCautionSOP": saveData.exeCautionSOP,
                    "exeAlartSOP": saveData.exeAlartSOP,
                    "exeSeriousSOP": saveData.exeSeriousSOP,
                    "useTrainingMode": saveData.useTrainingMode,
                    "useWaterMark": saveData.useWaterMark,
                    "useHeadMessage": saveData.useHeadMessage,
                    "useAutoMoveSOPScreen": saveData.useAutoMoveSOPScreen,
                    "useBroadcast": saveData.useBroadcast,
                    "useSMS": saveData.useSMS,
                    "useEmail": saveData.useEmail,
                    "useConfirm": saveData.useConfirm,
                    "workingBeginHour": saveData.workingBeginHour,
                    "workingEndHour": saveData.workingEndHour,
                    "useResultSummary": saveData.useResultSummary,
                    "dashboardBegin": saveData.dashboardBegin,
                    "dashboardEnd": saveData.dashboardEnd,
                    "fireSOPWaitEndTime": saveData.fireSOPWaitEndTime,
                    "psmsopWaitEndTime": saveData.psmsopWaitEndTime,
                    "etcsopWaitEndTime": saveData.etcsopWaitEndTime,
                    "fireSOPRecoverEndTime": saveData.fireSOPRecoverEndTime,
                    "psmsopRecoverEndTime": saveData.psmsopRecoverEndTime,
                    "etcsopRecoverEndTime": saveData.etcsopRecoverEndTime,
                    "moveDisplayAlarm": saveData.moveDisplayAlarm,
                    "useAlarmBroadcast": saveData.useAlarmBroadcast,
                    "usePoiFocus": saveData.usePoiFocus,
                    "usePoiHighlight": saveData.usePoiHighlight,
                    "turnStart": saveData.turnStart,
                    "useAlarmTurn": saveData.useAlarmTurn,
                    "weatherState": saveData.weatherState,
                    "weatherSoundState": saveData.weatherSoundState
                }
        };

        return JSON.stringify(json);
    }
    
    static makeRequestSdmsCommonSettings() {
        const json = {
            "requestSdmsCommonSettings": true
        };

        return JSON.stringify(json);
    }

    static makeRequestSopCommonSettings() {
        const json = {
            "requestSopCommonSettings": true
        };

        return JSON.stringify(json);
    }

    static makeRequestSettings(userID) {
        const json = {
            "requestSettings":
                {
                    "userID": userID,
                }
        };

        return JSON.stringify(json);
    }

    static makeRequestAccountSettings(userID) {
        const json = {
            "requestAccountSettings":
                {
                    "userID": userID,
                }
        };

        return JSON.stringify(json);
    }
    static makeRequestResetPopup(userID, popupState) {
        const json = {
            "requestResetPopup":
                {
                    "userID": userID,
                    "popupState": popupState,
                }
        };

        return JSON.stringify(json);
    }

    static makeRequestOptions(userID, campusID) {
        const json = {
            "userID": userID,
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeUpdateOptions(userID, campusID, option3DNormal, option3DSensor, optionSopNormal) {
        const json = {
            "userID": userID,
            "campusID": campusID,
            "option3DNormal": option3DNormal,
            "option3DSensor": option3DSensor,
            "optionSopNormal": optionSopNormal
        };

        return JSON.stringify(json);
    }

    static makeRequestLinkedSOPList(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPList(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeUpdateSettings(userID, campusID, option3DNormal, option3DSensor, optionSopNormal, updateLinkedSOPList) {
        const json = {
            "updateOptions": {
                "userID": userID,
                "campusID": campusID,
                "option3DNormal": option3DNormal,
                "option3DSensor": option3DSensor,
                "optionSopNormal": optionSopNormal
            },
            "updateLinkedSOPList": updateLinkedSOPList
        };

        return JSON.stringify(json);
    }

    static makeRequestAlarmOptions() {
        const json = {
        };

        return JSON.stringify(json);
    }

    static makeRequestGetSpreadMessage() {
        const json = {
            "requestGetSpreadMessage": true
        };

        return JSON.stringify(json);
    }

    static makeRequestSetSpreadMessage(addSpreadMessage, updateSpreadMessage, removeSpreadMessage) {
        const json = {
            "requestSetSpreadMessage":
                {
                    "addSpreadMessage": addSpreadMessage,
                    "updateSpreadMessage": updateSpreadMessage,
                    "removeSpreadMessage": removeSpreadMessage,
                }
        };

        return JSON.stringify(json);
    }
    
    static makeRequestUpdateUseReceives(useReceives) {
        const json = {
            "requestUpdateUseReceives":
                {
                    "sdmsOptions": useReceives
                }
        };
        
        return JSON.stringify(json);
    }
    
    static makeRequestExternalSensorGIS() {
        const json = {
            "requestExternalSensorGIS": true
        };
        
        return JSON.stringify(json);
    }
}