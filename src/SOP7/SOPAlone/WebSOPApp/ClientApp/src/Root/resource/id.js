import SessionString from '../../Common/js/sessionString';
import { AccountController } from '../../Account/services/accountController';
//import '../../SOPManager/styled/managerStyled';

export default class ProjectResource {
    
    static targetLanguage = "ko";
    static siteID = null;
    
    static version = "1.0.1";   // WSOP 버전

    //static isGSMode = null;     // GS인증 버전 확인용

    static get SiteID() {
        return ProjectResource.siteID;
    }

    static set SiteID(id) {
        ProjectResource.siteID = id;
    }

    static get ID() {
        return ProjectResource.id[ProjectResource.targetLanguage];
    }

    static id = {
        "ko": {
            title: {
                sopSimulator: 'SOP',
                teamEditor: '조직관리',
                sopManager: 'SOP 편집',
                dashboard: '대시보드',
                //history: "이력관리",
            },
        }
    }

    static path = {
        root: "/",
        sopSimulator: "/sop-simulator",
        sdms: "/sdms",
        teamEditor: "/team-editor",
        sopManager: "/sop-manager",
        dashboard: "/dashboard",
        history: "/history",
        findPassword: "/findPassword",
        specialReport: '/specialReport'
    }

    static getUserInfo() {
        const siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined || window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()) == null) {
            return null;
        }

        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()));

        if (userInfo?.options)  {
            // 계정 옵션 JSON string 일 경우 객체로 변환 
            if (typeof (userInfo.options) === "string")
                userInfo.options = JSON.parse(userInfo.options);
        }

        return userInfo;
    }

    static async initUserInfo() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            siteID = await AccountController.loadSiteID();
        }

        return ProjectResource.getUserInfo();
    }

    static getUserAuthor() {
        const userInfo = ProjectResource.getUserInfo();
        let userAuthor = null;

        if (userInfo !== null && userInfo !== undefined)
            userAuthor = userInfo.level;

        return userAuthor;
    }

    static async initUserAuthor() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            siteID = await AccountController.loadSiteID();
        }

        return ProjectResource.getUserAuthor();
    }

    static setLoginUser(user) {
        if (user === null || user === undefined)
            return;

        const siteID = ProjectResource.SiteID;
        if (siteID === null || siteID === undefined)
            return;

        window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(user));
    }

    static Site = {
        Cleannara: 1,    // 깨끗한나라
        NST: 11,         // NST
        Busan: 20,       // 부산
    }

    static StyleType = {
        Cleannara: "Cleannara",
        Busan: "Busan",
    }

    static styleMode = ProjectResource.StyleType.Cleannara;

    /* static StyleType = "Cleannara";

    static setMode = (mode) => {
        ProjectResource.StyleType = mode;
    } */
}