import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import { JsonManager } from './jsonManager';

import ProjectResource from '../../Root/resource/id';
import { ContextManager } from '../../Root/resource/contextManager';
import AccountResource from '../resource/id';
import { isEqual } from 'lodash';

export class AccountController {
    static timerCheck = false;
    static timerLogin = 0;

    static startWatchTimer(stateContainer, dispatch) {
        // 타이머 실행 유무 판단
        if (AccountController.timerCheck)
            return;

        // 타이머 실행 체크
        AccountController.timerCheck = true;

        AccountController.timerLogin = setTimeout(async function tick() {
            const state = stateContainer.getLoginState();
            await AccountController.WatchLoginCheck(state, dispatch);
            AccountController.timerLogin = setTimeout(tick, 5000);
        }, 5000);
    }

    static stopWatchTimer() {
        AccountController.timerCheck = false;

        if (AccountController.timerLogin > 0) {
            clearTimeout(AccountController.timerLogin);
            AccountController.timerLogin = 0;
        }
    }

    static async WatchLoginCheck(state, dispatch) {
        const user = ProjectResource.getUserInfo();

        if (user !== null && user !== undefined) {
            if (user.sessionKey === null || user.sessionKey === undefined) {
                let path = window.location.pathname;
                if (path !== ProjectResource.path.root && path !== ProjectResource.path.findPassword) {
                    dispatch({ type: ContextManager.LoginState, loginState: AccountResource.loginState.false, message: "로그아웃 되었습니다." });
                }

                return;
            }

            const userID = user.id;
            const sessionKey = user.sessionKey;

            const [result, message, userData] = await AccountController.checkLoginSession(userID, sessionKey);

            let compare = isEqual(state, result);

            if (!compare) {
                if (result === AccountResource.loginState.login) {
                    // 계정상태 업데이트
    
                    if (this.isNotFirst !== true) {  // 브라우저 첫 접속 시, 세션(계정 및 옵션) 업데이트
                        console.log("WatchLoginCheck is First Connect");
                        this.isNotFirst = true;
                        ProjectResource.setLoginUser(userData);
                        dispatch({ type: ContextManager.UpdateInfo, user: userData });
                    }
                    else if (user.levelID !== userData.levelID || user.name !== userData.name) { // 계정정보 변경 체크
                        ProjectResource.setLoginUser(userData);
                        dispatch({ type: ContextManager.UpdateInfo, user: userData });
                    }
    
                } else {
                    // 계정상태 업데이트
                    dispatch({ type: ContextManager.LoginState, loginState: result, message: message });
                }
            }

        } else {
            let path = window.location.pathname;
            if (path !== ProjectResource.path.root && path !== ProjectResource.path.findPassword && path !== ProjectResource.path.tablet) {
                dispatch({ type: ContextManager.LoginState, loginState: AccountResource.loginState.false, message: "로그아웃 되었습니다." });
            }
        }
    }

    static async checkLoginSession(userID, sessionKey) {
        let loadingCheck = true;

        try {
            const jsonData = JsonManager.makeCheckLoginSession(userID, sessionKey);

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/CheckLoginSession', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                loadingCheck = false;

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

            if (loadingCheck === false) {
                return [AccountResource.loginState.disconnected, "서버와 연결이 끊어졌습니다."];
            }

        }

        // 요청 중에 페이지 이동 시 응답을 받지 못하는 경우가 발생할 수 있음. 
        return [AccountResource.loginState.login, "checkLoginSession 실패하였습니다."];
    }

    static async login(id, pw) {
        const loginKeyResult = await AccountController.requestLoginKey(id);

        if (loginKeyResult === null) {
            return AccountController.falseResult("로그인 과정을 진행할 수 없습니다.");
        }

        if (loginKeyResult.externalLogin) {
            return await AccountController.externalLogin(id, pw);
        }

        if (loginKeyResult.success === false) {
            return AccountController.falseResult(loginKeyResult.message);
        }

        const key = loginKeyResult.loginKey;
        const salt = loginKeyResult.externalLogin ? "" : loginKeyResult.salt;

        /*const key = await AccountController.getLoginKey();

        if (!key)
            return null;*/

        try {
            const pwHash = sha256(pw + salt);
            const strEnc = AccountController.encrypt(id + "|" + pwHash, key);
            const jsonData = JsonManager.makeUserLogin(strEnc, key);

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/Login', {
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
                    if (result.user?.options && typeof (result.user.options) === 'string') {
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

    static falseResult(message) {
        const result = {
            success: false,
            message: message
        }

        return result;
    }

    static async getLoginKey() {
        const now = new Date();
        const ticks = now.getTime();

        let key = null;

        try {
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/GetLoginKey?num=' + ticks);
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

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestLoginKey', {
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

    static async logout() {
        try {
            const jsonData = JsonManager.makeUserLogout();

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/Logout', {
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

        return AccountController.falseResult("로그아웃에 실패하였습니다.");
    }

    static async externalLogin(id, pw) {
        const key = await AccountController.getLoginKey();

        if (!key)
            return AccountController.falseResult("로그인에 실패하였습니다.");;

        try {
            const pwHash = sha256(pw);
            const strEnc = AccountController.encrypt(id + "|" + pwHash, key);
            const jsonData = JsonManager.makeUserLogin(strEnc, key);

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/Login', {
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

        return AccountController.falseResult("로그인에 실패하였습니다.");;
    }

    static async useAutoLogin() {
        try {
            const jsonData = JsonManager.makeUseAutoLogin();

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/UseAutoLogin', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "useAutoLogin 실패"];
    }

    //옵션 저장
    static async requestSaveOption(id, userID, category, subCategory, propertyValue1, propertyValue2, propertyValue3, propertyValue4) {
        try {
            const jsonData = JsonManager.makeRequestSaveOption(id, userID, category, subCategory, propertyValue1, propertyValue2, propertyValue3, propertyValue4);
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestSaveOption', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                //데이터가 성공적으로 삽입 되면 primary id를 반환 받는다.
                if (result.success) {
                    return [true, result.options]
                } else {
                    return [false, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }
        return [false, 'requestSaveOption 실패'];
    }

    static async requestUserList(siteID) {
        try {
            const jsonData = JsonManager.makeRequestUserList(siteID);
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestUserList', {
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
                    return [result.users, result.message];
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, 'requestUserList 실패'];
    }

    static async requestUserLevelList() {
        try {
            const jsonData = JsonManager.makeRequestUserLevelList();
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestUserLevelList', {
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
                    return [result.levels, result.message];
                } else {
                    return [null, result.message];
                }
            }

        } catch (e) {
            console.log(e);
        }

        return [null, 'requestUserLevelList 실패'];
    }

    static async requestUpdateUsers(deleteUserIDs, updateUsers) {
        try {
            const jsonData = JsonManager.makeRequestUpdateUsers(deleteUserIDs, updateUsers);
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/UpdateUsers', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }

        } catch (e) {
            console.log(e);
        }

        return [false, 'requestUpdateUsers 실패'];
    }

    static async requestGetOption(userID, category) {
        try {
            const jsonData = JsonManager.makeRequestGetOption(userID, category);
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestGetOption', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success)
                    return [result.options, result.message];
                else
                    return [null, result.message];
            }

        } catch (e) {
            console.log(e);
        }

        return [null, 'requestGetOption 실패'];
    }

    static async requestRegularMemberList(siteID, keyword) {
        try {
            const jsonData = JsonManager.makeRegularMemberList(siteID, keyword);
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestRegularMemberList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success)
                    return [result.teams, result.message];
                else
                    return [null, result.message];
            }

        } catch (e) {
            console.log(e);
        }

        return [null, 'requestRegularMemberList 실패'];
    }

    static async requestCreateUser(siteID, userID, levelID, memberID) {
        try {
            const jsonData = JsonManager.makeRegularCreateUser(siteID, userID, levelID, memberID);
            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestCreateUser', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success)
                    return [result.user, result.message];
                else
                    return [null, result.message];
            }

        } catch (e) {
            console.log(e);
        }

        return [null, 'requestCreateUser 실패'];
    }

    static async requestChangePassword(id, oldPassword, newPassword) {
        const loginKeyResult = await AccountController.requestLoginKey(id);

        if (loginKeyResult === null) {
            return AccountController.falseResult("비밀번호를 변경할 수 없습니다.");
        }

        if (loginKeyResult.externalLogin) {
            return AccountController.falseResult("외부 로그인 상태인 계정은 비밀번호를 변경할 수 없습니다.");
        }

        if (loginKeyResult.success === false) {
            return AccountController.falseResult(loginKeyResult.message);
        }

        const key = loginKeyResult.loginKey;
        const salt = loginKeyResult.salt;

        try {
            const pwOldHash = sha256(oldPassword + salt);
            const strOldEnc = AccountController.encrypt(id + "|" + pwOldHash, key);
            const pwNewHash = sha256(newPassword + salt);
            const strNewEnc = AccountController.encrypt(id + "|" + pwNewHash, key);
            const jsonData = JsonManager.makeChangePassword(strOldEnc, strNewEnc, key);

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestChangePassword', {
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
                    if (result.user?.options && typeof (result.user.options) === 'string') {
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

        return [false, "requestChangePassword 호출 실패"];
    }

    static async requestWebSocketPort() {
        try {
            const jsonData = JsonManager.makeRequestWebSocketPort();

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestWebSocketPort', {
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

        return AccountController.falseResult("WebSocketPort를 확인할 수 없습니다.");
    }

    static async requestFindPassword(userName, phoneNumber) {
        try {
            const jsonData = JsonManager.makeFindPassword(userName, phoneNumber);

            const res = await fetch(ProjectResource.baseUrl + '/Account/Account/RequestFindPassword', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
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

        return [false, "requestFindPassword 호출 실패"];
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
}