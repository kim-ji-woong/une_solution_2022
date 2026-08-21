export class JsonManager {
    static makeRequestResetPopup(userID) {
        const json = {
            "userID": userID
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
}