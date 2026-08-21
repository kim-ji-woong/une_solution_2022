export class JsonManager {
    static makeUserLogin(data, key) {
        const json = {
            "value": data,
            "key": key
        }

        return JSON.stringify(json);
    }

    static makeRequestLoginKey(num, userID) {
        const json = {
            "num": num,
            "userID": userID
        }

        return JSON.stringify(json);
    }

    static makeRequestLoginKey2(num, name, data, mode) {
        const json = {
            "requestLoginKey":
            {
                "num": num,
                "name": name,
                "data": data,
                "mode": mode
            }
        }

        return JSON.stringify(json);
    }

    static makeCheckLoginSession(userID, sessionKey) {
        const json = {
            "userID": userID,
            "sessionKey": sessionKey,
        }

        return JSON.stringify(json);
    }

    static makeUseAutoLogin() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeRequestSaveOption(id, userID, category, subCategory, propertyValue1, propertyValue2, propertyValue3, propertyValue4) {
        const json = {
            'saveOption': {
                "id": id,
                "userID": userID,
                "category": category,
                "subCategory": subCategory,
                "propertyValue1": propertyValue1,
                "propertyValue2": propertyValue2,
                "propertyValue3": propertyValue3,
                "propertyValue4": propertyValue4,
            }
        }
        return JSON.stringify(json);
    }

    static makeRequestUserList(siteID) {
        const json = {
            'siteID': siteID
        }
        return JSON.stringify(json);
    }

    static makeRequestUserLevelList() {
        const json = {
        }
        return JSON.stringify(json);
    }

    static makeRequestUpdateUsers(deleteUserIDs, updateUsers) {
        const json = {
            "deleteUserIDs": deleteUserIDs,
            "updateUsers": updateUsers
        }
        return JSON.stringify(json);
    }

    static makeRequestGetOption(userID, category) {
        const json = {
            "userID": userID,
            "category": category
        }
        return JSON.stringify(json);
    }

    static makeRegularMemberList(siteID, keyword) {
        const json = {
            'siteID': siteID,
            'keyword': keyword
        }
        return JSON.stringify(json);
    }

    static makeRegularCreateUser(siteID, userID, levelID, memberID) {
        const json = {
            'siteID': siteID,
            'userID': userID,
            "accountLevelID": levelID,
            "regularMemberID": memberID
        }
        return JSON.stringify(json);
    }

    static makeChangePassword(oldValue, newValue, key) {
        const json = {
            "oldValue": oldValue,
            "newValue": newValue,
            "key": key
        }

        return JSON.stringify(json);
    }

    static makeRequestWebSocketPort() {
        const json = {
        }

        return JSON.stringify(json);
    }

    static makeFindPassword(userName, phoneNumber) {
        const json = {
            "userName": userName,
            "phoneNumber": phoneNumber
        }

        return JSON.stringify(json);
    }
}