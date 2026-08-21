import SessionString from "../../Common/resource/sessionString";

export default class ProjectResource {
    static targetLanguage = "ko";
    static baseUrl = "";
    static campusID = 1;
    static campusName = null;

    static get ID() {
        return ProjectResource.id[ProjectResource.targetLanguage];
    }

    static path = {
        root: "/",
        sdms: "/sdms",
        monitoring: "/monitoring",
        dashboardMonitoring: "/dashboard-monitoring",
        dashboardMes: "/dashboard-mes",
        teamEditor: "/team-editor",
        history: "/history",
        sopSimulator: "/sop-simulator",
        sopManager: "/sop-manager",
        tablet: "/tablet"
    }

    static id = {
        "ko": {
            title: {
                dashboardMonitoring: "대시보드",
                dashboardMes: "MES화면",
                sopSimulator: 'SOP',
                sopManager: 'SOP 편집',
                history: "이력관리",
                teamEditor: '조직관리',
                sopSimulator: 'SOP',
                sopManager: 'SOP 편집',
            },
        }
    }

    static campus = {
        campus_1: 1,                   // 제 1공장동
        campus_2: 2,                   // 제 2공장동
        campus_3: 3                    // 제 3공장동
    }

    static initUserInfo(siteID) {
        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()));

        if (userInfo?.options) {
            // 계정 옵션 JSON string 일 경우 객체로 변환 
            if (typeof (userInfo.options) === "string")
                userInfo.options = JSON.parse(userInfo.options);
        }

        ProjectResource.loginUser = userInfo;
        return userInfo;
    }

    static getUserInfo() {
        if (ProjectResource.loginUser && !ProjectResource.loginUser.name) {
            window.localStorage.removeItem(SessionString.Key.account + "_" + ProjectResource.loginUser.siteID.toString());
            ProjectResource.clearLoginUser();
            return null;
        }

        return ProjectResource.loginUser;
    }

    static getUserAuthor() {
        const userInfo = ProjectResource.getUserInfo();
        let userAuthor = null;

        if (userInfo !== null && userInfo !== undefined)
            userAuthor = userInfo.level;

        return userAuthor;
    }

    static setLoginUser(user) {
        ProjectResource.loginUser = user;

        const siteID = user?.siteID;

        if (siteID === null || siteID === undefined) {
            return;
        }

        window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(user));
    }

    static clearLoginUser() {
        ProjectResource.loginUser = null;
    }

    static setCampusID(campus) {
        ProjectResource.campusID = campus.id;
        ProjectResource.campusName = campus.name;
    }

    static styleMode = "default";

    static setMode = (mode) => {
        ProjectResource.styleMode = mode;
    }
}

