import SessionString from "../../Common/js/sessionString";
import {SdmsJsonManager} from "../../SDMS/services/sdmsJsonManager";

export default class ProjectResource {
    static targetLanguage = "ko";
    static siteID = null;
    static baseUrl = "";
    static version = "1.0.1";

    static get SiteID() {
        return ProjectResource.siteID;
    }
    
    static set SiteID(id) { 
        ProjectResource.siteID = id;
    }
    static get ID() {
        return ProjectResource.id[ProjectResource.targetLanguage];
    }

    static path = {
        root: "/",
        sdms: "/sdms",
        sopSimulator: "/sop-simulator",
        sopManager: "/sop-manager",
        history: "/history",
        teamEditor: "/team-editor",
    }

    static id = {
        "ko": {

            "title": {
                sdms: "3D 관제화면",
                sopSimulator: "SOP",
                sopManager: "SOP 편집",
                history: "이력관리",
                teamEditor: "조직관리",
            }
        }
    }

    // 알림창 타입
    static dialogTypes = {
        ERROR: 'ERROR',
        WARNING: 'WARNING',
        INFO: 'INFO',
        QUESTION: 'QUESTION',
        SUCCESS: 'SUCCESS'
    }

    static styleMode = "default";

    static setMode = (mode) => {
        ProjectResource.styleMode = mode;
    }

    static getUserInfo() {
        const siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined ||
            window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()) == null)
            return null;

        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()));

        if (userInfo?.options) {
            // 계정 옵션 JSON string 일 경우 객체로 변환 
            if (typeof (userInfo.options) === "string")
                userInfo.options = JSON.parse(userInfo.options);
        }

        return userInfo;
    }

    static async initUserInfo() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
           siteID = await ProjectResource.loadSiteID();
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
            siteID = await ProjectResource.loadSiteID();
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
    
    static async loadSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            try {
                const jsonData = SdmsJsonManager.makeRequestGetSiteID();

                const res = await fetch(ProjectResource.baseUrl + "/SDMS/SDMS/RequestData", {
                    method: "post",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: jsonData
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.success === true) {
                        ProjectResource.SiteID = data.siteID;
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }

        return siteID;
    }
    
    static async clearLoginUser() {
        let siteID = ProjectResource.SiteID;
        if (siteID === null || siteID === undefined) {
            siteID = await ProjectResource.loadSiteID();

            if (siteID === null || siteID === undefined) {
                return;
            }
        }
        
        window.localStorage.removeItem(SessionString.Key.account + "_" + siteID.toString());
    }
    
    static Site = {
        Busan: 21,
    }
    
}

