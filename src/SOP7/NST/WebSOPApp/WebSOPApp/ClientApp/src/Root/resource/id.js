import SessionString from "../../Common/js/sessionString";

export default class ProjectResource {
    static targetLanguage = "ko";
    static _isModelViewer = false;
    static siteID = null;

    static get ID() {
        return ProjectResource.id[ProjectResource.targetLanguage];
    }

    static get isModelViewer() {
        return ProjectResource._isModelViewer;
    }

    static set isModelViewer(value) {
        ProjectResource._isModelViewer = value;
    }

    static get SiteID() {
        return ProjectResource.siteID;
    }

    static set SiteID(id) {
        ProjectResource.siteID = id;
    }

    static id = {
        "ko": {
            title: {
                sdms: "sdms",
                sopSimulator: 'SOP',
                teamEditor: '조직관리',
                sopManager: 'SOP 편집',
                dashboard: '대시보드',
                history: "이력관리",
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
        setPassword: "/setPassword",
        specialReport: '/specialReport',
    }

    static settingTab = {
        monitoring: "monitoring",
        disaster: "disaster",
        spread: "spread",
    }

    static getUserInfo() {
        const siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined ||
            window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()) === null) {
            return null;
        }

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

        if (userInfo)
            userAuthor = userInfo.levelID;

        return userAuthor;
    }

    static async initUserAuthor() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            ProjectResource.SiteID = await ProjectResource.loadSiteID();
        }

        return ProjectResource.getUserAuthor();
    }

    static async loadSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            try {
                const res = await fetch('Commons/Commons/RequestGetSiteID', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    const result = await res.json();

                    if (result.success === true) {
                        ProjectResource.SiteID = result.sites[0].id;
                        ProjectResource.sites = result.sites;
                        if (result.sites.length > 1) {
                            ProjectResource.bMultiSite = true;
                        }
                        return ProjectResource.SiteID;
                    }
                }

            } catch (e) {
                console.log(e);
            }
        }

        return siteID;
    }
}