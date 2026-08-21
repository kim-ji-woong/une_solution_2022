export class JsonManager {
    static makeUserLogin(data, key, isFullVersion) {
        const json = {
            "login":
            {
                "value": data,
                "key": key,
                "isFullVersion": isFullVersion,
            },
        }

        return JSON.stringify(json);
    }

    static makeUpdateAccountUser(accountUser, accessedUserID) {
        const json = {
            "updateAccountUsers":
            {
                "AccountUsers": accountUser,
                "AccessedUserID": accessedUserID
            }
        }

        return JSON.stringify(json);
    }

    static makeUpdateAccountUser2(accountUser, accessedUserID) {
        const json = {
            "updateAccountUsers2":
            {
                "AccountUsers": accountUser,
                "AccessedUserID": accessedUserID
            }
        }

        return JSON.stringify(json);
    }

    static makeRemoveAccountUsers(accountUser) {
        const json = {
            "removeAccountUsers": accountUser
        }

        return JSON.stringify(json);
    }

    static makeReRegisterAccountUsers(accountUser) {
        const json = {
            "reRegisterAccountUsers": accountUser
        }

        return JSON.stringify(json);
    }


    static makeGetAccountLevels() {
        const json = {
            "getAccountLevels": true
        }

        return JSON.stringify(json);
    }

    static makeGetAccountUsers(siteID) {
        const json = {
            "getAccountUsers": 
            {
                siteID: siteID
            }
        }

        return JSON.stringify(json);
    }

    static makeChangePassword(name, data, value, key, mode) {
        const json = {
            "changePassword":
            {
                "name": name,
                "data": data,
                "value": value,
                "key": key,
                "mode": mode,
            },
        }

        return JSON.stringify(json);
    }

    static makeCheckParamsCode(code) {
        const json = {
            "checkParamsCode":
            {
                "code": code,
            },
        }

        return JSON.stringify(json);
    }

    static makeSetPassword(data, key) {
        const json = {
            "setPassword":
            {
                "value": data,
                "key": key,
            },
        }

        return JSON.stringify(json);
    }

    static makeCheckLoginSession(userID, sessionKey) {
        const json = {
            "checkLoginSession":
            {
                "userID": userID,
                "sessionKey": sessionKey,
            },
        }

        return JSON.stringify(json);
    }

    static makeAutoLogin(beginCode, key) {
        const json = {
            "autoLogin":
            {
                "beginCode": beginCode,
                "key": key
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestLoginKey(num, userID) {
        const json = {
            "requestLoginKey":
            {
                "num": num,
                "userID": userID
            }
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

    static makeRequestNewUser(userID, userLevel, siteID, nickName) {
        const json = {
            "requestNewUser":
            {
                "userID": userID,
                "userLevel": userLevel,
                "siteID": siteID,
                "nickName": nickName
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestNewUsers(parameter) {
        const json = {
            "requestNewUsers":
            {
                "requests": JsonManager.makeNewUserRequest(parameter)
            }
        }

        return JSON.stringify(json);
    }

    static makeNewUserRequest(parameter) {
        const requests = [];

        for (const arr in parameter) {
            if (Array.isArray(arr) && arr.length >= 4) {
                const nickName = arr[3] ? arr[3] : arr[0];
                requests.push([arr[0], arr[1], arr[2], nickName]);
            }
        }

        return requests;
    }
}