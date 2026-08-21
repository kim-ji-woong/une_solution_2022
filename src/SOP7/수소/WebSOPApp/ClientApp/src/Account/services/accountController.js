import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import { JsonManager } from './jsonManager';

import SessionString from '../../Common/js/sessionString';
import AccountStore from '../accountStore';
import AccountResource from '../resource/id';

import ProjectResource from '../../Root/resource/id';

import { i18n, withTranslation } from '../../language/i18n';

export class AccountController {
    static logoutMsgChk = false;
    static loading3DChk = false;

    static StartWatchTimer() {
        // 타이머 실행 유무 판단
        if (this.timerCheck)
            return;

        // 타이머 실행 체크
        this.timerCheck = true;

        let timerLogin = setTimeout(async function tick() {
            await AccountController.WatchLoginCheck();
            timerLogin = setTimeout(tick, 5000);
        }, 5000);
    }

    static async WatchLoginCheck() {
        const user = await ProjectResource.initUserInfo();

        if (user !== null && user !== undefined) {
            if (user.sessionKey === null || user.sessionKey === undefined) {
                let path = window.location.pathname;
                if (path !== ProjectResource.path.root && path !== ProjectResource.path.setPassword) {
                    AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.false, message: "로그아웃 되었습니다." });
                }

                return;
            }

            const userID = user.id;
            const sessionKey = user.sessionKey;

            const [result, message, userData] = await AccountController.checkLoginSession(userID, sessionKey);

            if (result === AccountResource.loginState.login) {
                // 세션이 유효

                // 계정 리덕스에 상태 업데이트
                AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: result, message: message });
                
                if (this.isNotFirst !== true) {  // 브라우저 첫 접속 시, 세션(계정 및 옵션) 업데이트
                    console.log("WatchLoginCheck is First Connect");
                    this.isNotFirst = true;
                    ProjectResource.setLoginUser(userData);
                    AccountStore.dispatch({ type: 'UPDATE_INFO', user: userData });
                }
                else if (user.levelID !== userData.levelID || user.nickName !== userData.nickName) { // 계정정보 변경 체크
                    ProjectResource.setLoginUser(userData);
                    AccountStore.dispatch({ type: 'UPDATE_INFO', user: userData });
                }

            } else {
                // 세션 값이 일치하지 않음
                let msg = i18n.t('account.로그아웃 되었습니다');

                if (message === "다른 곳에서 로그인하였습니다.") {
                    msg = i18n.t('account.다른 곳에서 로그인하였습니다');
                }
                else if (message === "해당 유저 Session은 존재하지 않습니다.") {
                    msg = i18n.t('account.해당 유저 Session은 존재하지 않습니다');
                }

                // 계정 리덕스에 상태 업데이트
                AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: result, message: msg });
            }
        } else {
            let path = window.location.pathname;
            if (path !== ProjectResource.path.root && path !== ProjectResource.path.setPassword) {
                AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.false, message: i18n.t('account.로그아웃 되었습니다') });
            }
        }
    }

    static async checkLoginSession(userID, sessionKey) {
        try {
            const jsonData = JsonManager.makeCheckLoginSession(userID, sessionKey);

            const res = await fetch('/Account/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                AccountController.loading3DChk = false;

                if (result.success) {
                    return [AccountResource.loginState.login, result.message, result.user];
                }
                else {
                    return [AccountResource.loginState.false, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);

            if (AccountController.loading3DChk === false) {
                let message = "서버와 연결이 끊어졌습니다.";

                return [AccountResource.loginState.disconnected, message];
            }
                
        }

        // 요청 중에 페이지 이동 시 응답을 받지 못하는 경우가 발생할 수 있음. 
        return [AccountResource.loginState.login, "checkLoginSession 실패하였습니다."];
    }

    static async getAccountLevels() {
        try {
            const jsonData = JsonManager.makeGetAccountLevels();

            const res = await fetch('/Account/Account/RequestData', {
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
                    //return [result, ""];
                    return result.accountLevels;
                }
                else {
                    return [null, result.message];
                }
            }


        }
        catch (e) {
            console.log(e);
        }

        return [null, "getAccountLevels 실패"];
    }

    static async getAccountUsers(siteID) {
        try {
            const jsonData = JsonManager.makeGetAccountUsers(siteID);

            const res = await fetch('/Account/Account/RequestData', {
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
                    //return [result, ""];
                    return result.accountUsers;
                }
                else {
                    return [null, result.message];
                }
            }


        }
        catch (e) {
            console.log(e);
        }

        return [null, "getAccountUsers 실패"];
    }

    static async changePassword(name, data, mode) {
        const loginKeyResult = await AccountController.requestLoginKey2(name, data, mode);

        if (loginKeyResult === null) {
            const result = {};
            result.success = false;
            result.message = "비밀번호를 변경할 수 없습니다.";
            return [result, result.message];
        }
        else if (loginKeyResult.success === false) {
            const result = {};
            result.success = false;
            result.message = loginKeyResult.message;
            return [result, result.message];
        }

        const key = loginKeyResult.loginKey;
        const salt = loginKeyResult.salt;
        /*const key = await AccountController.getLoginKey();

        if (!key)
            return [null, "changePassword 실패"];*/

        try {
            const pw = Math.random().toString(36).slice(2);
            const pwHash = sha256(pw + salt).toString();

            const strEnc = AccountController.encrypt(pw + "|" + pwHash, key);

            const jsonData = JsonManager.makeChangePassword(name, data, strEnc, key, mode);

            const res = await fetch('/Account/Account/RequestData', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "changePassword 실패"];
    }

    static async checkParamsCode(code) {
        try {
            const jsonData = JsonManager.makeCheckParamsCode(code);

            const res = await fetch('/Account/Account/RequestData', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "changePassword 실패"];
    }

    static async setPassword(id, userID, pwd, newPwd) {
        const loginKeyResult = await AccountController.requestLoginKey(userID);

        if (loginKeyResult === null) {
            const result = {};
            result.success = false;
            result.message = "비밀번호를 변경할 수 없습니다.";
            return [result, result.message];
        }
        else if (loginKeyResult.success === false) {
            const result = {};
            result.success = false;
            result.message = loginKeyResult.message;
            return [result, result.message];
        }

        const key = loginKeyResult.loginKey;
        const salt = loginKeyResult.salt;
        /*const key = await AccountController.getLoginKey();

        if (!key)
            return [null, "setPassword 실패"];*/

        try {
            const pwdHash = sha256(pwd + salt);
            const newPwdHash = sha256(newPwd + salt);

            const strEnc = AccountController.encrypt(id + "|" + pwdHash + "|" + newPwdHash, key);
            const jsonData = JsonManager.makeSetPassword(strEnc, key);

            const res = await fetch('/Account/Account/RequestData', {
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
                    return [result, result.message];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "setPassword 실패"];
    }

    static async reRegisterAccountUsers(accountUsers) {
        if (accountUsers === null || accountUsers === undefined || accountUsers.length === 0)
            return [null, "reRegisterAccountUsers 실패"];

        try {
            const jsonData = JsonManager.makeReRegisterAccountUsers(accountUsers);

            const res = await fetch('/Account/Account/RequestData', {
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

        return [null, "reRegisterAccountUsers 실패"];
    }

    static async removeAccountUsers(accountUsers) {
        if (accountUsers === null || accountUsers === undefined || accountUsers.length === 0)
            return [null, "removeAccountUsers 실패"];

        try {
            const jsonData = JsonManager.makeRemoveAccountUsers(accountUsers);

            const res = await fetch('/Account/Account/RequestData', {
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

        return [null, "removeAccountUsers 실패"];
    }

    static async updateAccountUser(accountUsers, accessedUserID) {
        if (accountUsers === null || accountUsers === undefined || accountUsers.length === 0)
            return [null, "updateAccountUsers 실패"];

        for (let i = 0; i < accountUsers.length; i++) {
            let accountUser = accountUsers[i];
            let num = "";

            if (accountUser.accountID !== -1) 
                continue;

            // 계정이 없다면 임시 비밀번호 저장 후 전달
            if (accountUser.phoneNumber === null || accountUser.phoneNumber === undefined) {
                num = "1234";
            } else {
                num = accountUser.phoneNumber;

                let index = num.indexOf('-');
                num = num.substring(index + 1);
                num = num.replace("-", "");
            }

            // 임시로 저장 후 전달
            num = sha256(num);
            accountUser.userID = num.toString();
        }

        try {
            const jsonData = JsonManager.makeUpdateAccountUser(accountUsers, accessedUserID);

            const res = await fetch('/Account/Account/RequestData', {
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

        return [null, "updateAccountUsers 실패"];
    }

    static async updateAccountUser2(accountUsers, accessedUserID) {
        if (accountUsers === null || accountUsers === undefined || accountUsers.length === 0)
            return [null, "updateAccountUsers 실패"];

        /*
         * salt 값이 없기 때문에 서버 쪽에서 salt 값과 비밀번호 함께 부여
        for (let i = 0; i < accountUsers.length; i++) {
            let accountUser = accountUsers[i];
            let num = "";

            if (accountUser.accountID !== -1)
                continue;

            // 계정이 없다면 임시 비밀번호 저장 후 전달
            if (accountUser.phoneNumber === null || accountUser.phoneNumber === undefined || accountUser.phoneNumber?.length < 12) {
                num = "1234";
            } else {
                num = accountUser.phoneNumber;
                let index = num?.lastIndexOf('-');
                if (index > 0)
                    num = num.substring(index + 1);
                //num = num.replace("-", "");
            }

            // 임시로 저장 후 전달
            num = sha256(num);
            accountUser.userID = num.toString();
        }
        */

        try {
            const jsonData = JsonManager.makeUpdateAccountUser2(accountUsers, accessedUserID);

            const res = await fetch('/Account/Account/RequestData', {
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
                    return [true, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "updateAccountUsers2 실패"];
    }

    static falseResult(message) {
        const result = {
            success: false,
            message: message
        }

        return result;
    }

    static async login(id, pw, isFullVersion) {
        const loginKeyResult = await AccountController.requestLoginKey(id);

        if (loginKeyResult === null) {
            return AccountController.falseResult("로그인 과정을 진행할 수 없습니다.");
        }

        if (loginKeyResult.externalLogin) {
            return await AccountController.externalLogin(id, pw, isFullVersion);
        }

        if (loginKeyResult.success === false) {
            return AccountController.falseResult(loginKeyResult.message);
        }

        const key = loginKeyResult.loginKey;
        const salt = loginKeyResult.salt;

        /*const key = await AccountController.getLoginKey();

        if (!key)
            return null;*/

        try {
            const pwHash = sha256(pw + salt);
            const strEnc = AccountController.encrypt(id + "|" + pwHash, key);
            const jsonData = {
                "value": strEnc,
                "key": key,
                "isFullVersion": isFullVersion,
            };

            const res = await fetch('/Account/Account/Login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success === true) {
                    // 로그인 성공
                    //AccountController.setLoginUser(result.user);
                    /*const siteID = ProjectResource.SiteID;

                    //세션 값 넣기
                    const user = result.user;
                    window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(user));*/
                    if (result.user?.options) {
                        result.user.options = JSON.parse(result.user.options);
                    }
                }

                return result;
            } else {
                let result = {};
                result.success = false;
                result.message = "Account Controller 페이지를 찾을 수 없습니다. 네트워크를 확인해주세요.";

                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return AccountController.falseResult("로그인에 실패하였습니다.");
    }

    static async externalLogin(id, pw, isFullVersion) {
        const key = await AccountController.getLoginKey();

        if (!key)
            return AccountController.falseResult("로그인에 실패하였습니다.");;

        try {
            const pwHash = sha256(pw);
            const strEnc = AccountController.encrypt(id + "|" + pwHash, key);
            const jsonData = JsonManager.makeUserLogin(strEnc, key, isFullVersion);

            const res = await fetch('/Account/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success === true) {
                    // 시스템 옵션
                    if (result.user?.options) {
                        result.user.options = JSON.parse(result.user.options);
                    }
                }

                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return AccountController.falseResult("로그인에 실패하였습니다.");;
    }

    /*
    static setLoginUser(user) {
        const siteID = ProjectResource.SiteID;
        window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(user));
    }
    */

    static async autoLogin(beginCode) {
        const key = await AccountController.getLoginKey();

        if (!key)
            return null;

        try {
            const jsonData = JsonManager.makeAutoLogin(beginCode, key);

            const res = await fetch('/Account/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return null;
    }

    static async getLoginKey() {
        const now = new Date();
        const ticks = now.getTime();

        let key = null;

        try {
            const res = await fetch('/Account/Account/GetLoginKey?num=' + ticks);
            key = await res.text();
        }
        catch (e) {
            console.log(e);
        }

        return key;
    }

    static async requestLoginKey(userID) {
        const now = new Date();
        const ticks = now.getTime();

        try {
            const jsonData = JsonManager.makeRequestLoginKey(ticks, userID);

            const res = await fetch('/Account/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestLoginKey2(name, data, mode) {
        const now = new Date();
        const ticks = now.getTime();

        try {
            const jsonData = JsonManager.makeRequestLoginKey2(ticks, name, data, mode);

            const res = await fetch('/Account/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        }
        catch (e) {
            console.log(e);
        }

        return null;
    }

    static async requestNewUser(userID, userLevel, siteID, nickName = null) {
        if (!nickName) {
            nickName = userID;
        }

        try {
            const jsonData = JsonManager.makeRequestNewUser(userID, userLevel, siteID, nickName);

            const res = await fetch('/Account/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.user, result.success, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, false, "requestNewUser 호출이 실패하였습니다."];
    }

    // parameter : [userID, userLevel, siteID, nickName]
    //             nickName은 null로 두면 userID와 동일하게 사용된다.
    static async requestNewUsers(parameter) {
        try {
            const jsonData = JsonManager.makeRequestNewUsers(parameter);

            const res = await fetch('/Account/Account/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.users, result.success, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, false, "requestNewUsers 호출이 실패하였습니다."];
    }

    static encrypt(str, KEY) {
        const IV = KEY.substring(0, 16);
        const key = CryptoJS.enc.Utf8.parse(KEY);
        const iv = CryptoJS.enc.Utf8.parse(IV);

        const srcs = CryptoJS.enc.Utf8.parse(str);
        const encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.ciphertext.toString();
    }

    static async requestUpdateUserInfo(accountID, levelID, memo = null) {
        try {
            const data = {
                "AccountID": accountID,
                "LevelID": levelID,
                "Memo": memo
            };

            const res = await fetch('/Account/Account/RequestUpdateUserInfo', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "requestUpdateUserInfo 호출이 실패하였습니다."];
    }

    static async requestAddAccount(memberID, accountLevel, userID, memberName) {
        try {
            const data = {
                "MemberID": memberID,
                "AccountLevel": accountLevel,
                "UserID": userID,
                "MemberName": memberName
            };

            const res = await fetch('/Account/Account/RequestAddAccount', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.accountID, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, null, "requestAddAccount 호출이 실패하였습니다."];
    }

    static async requestDoubleCheckID(userID) {
        try {
            const data = {
                "UserID": userID
            };

            const res = await fetch('/Account/Account/RequestDoubleCheckID', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.isDouble, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, null, "requestDoubleCheckID 호출이 실패하였습니다."];
    }
}