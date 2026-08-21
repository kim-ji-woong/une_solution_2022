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
            "getAccountUsers": {
                "siteID": siteID
            }
        }

        return JSON.stringify(json);
    }
    
    static makeRequestAccountUsers() {
        const json = {
            "requestAccountUsers": true
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

    static makeCheckBrowserID(userID, sessionKey) {
        const json = {
            "requestCheckBrowserID":
            {
                "userID": userID,
                "sessionKey": sessionKey,
            }
        }
        return JSON.stringify(json);
    }

    static makeCheckAutoLogin() {
        const json = {
            "checkAutoLogin": true
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
    
    static makeDeleteUser(userID) {
        const json = {
            "requestRemoveUser": {
                "userID": userID
            }
        }
        
        return JSON.stringify(json);
    }
    
    static makeRequestAddUser(tempUser) {
        const json = {
            "requestAddUser": {
                "memberID": tempUser.memberID,
                "userLevel": tempUser.userLevel,
                "userID": tempUser.userID,
                "nickName": tempUser.nickName,
                "siteID": tempUser.siteID
            }
        }
        
        return JSON.stringify(json);
    }
    
    static makeRequestSendPassword(name, phone, strEnc, key, mode) {
        const json = {
            "requestSendPassword": {
                "name": name,
                "phone": phone,
                "enc": strEnc,
                "key": key
            }
        }
        
        return JSON.stringify(json);
    }
        
}