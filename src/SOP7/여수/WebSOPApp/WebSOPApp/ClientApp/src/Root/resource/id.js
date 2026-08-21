import SessionString from '../../Common/js/sessionString';
import { SdmsJsonManager } from '../../SDMS/services/sdmsJsonManager';

export default class ProjectResource {
    static targetLanguage = "ko";
    static siteID = null;

    static version = "1.0.1";   // WSOP 버전

    static isGSMode = null;     // GS인증 버전 확인용

    static baseUrl = " ";
    //static baseUrl = "http://221.147.100.161:12000";

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
                sdms: "sdms",
                sopSimulator: 'SOP',
                sopSimulatorYeosu: 'SOP여수',  /* 1206 */
                sopSimulatorYeosuList: 'SOP여수List', /* 1208 */
                teamEditor: '조직관리',
                teamYeosu: '조직관리 여수',
                sopManager: 'SOP 편집',
                dashboard: '대시보드',
                history: '이력관리',
                historyYeosu: '이력관리 여수',
                historyAnalysis: '센서탐지 분석',
                historySOP: 'SOP 이력',
                reportYeosu: '보고서 및 통계',
            },
        }
    }

    static path = {
        root: "/",
        sopSimulator: "/sop-simulator",
        sopSimulatorYeosu: "/sop-simulatorYeosu", /* 1206  */
        sopSimulatorYeosuList: "/sop-simulatorYeosuList",  /* 1208 */
        sdms: "/sdms",
        teamEditor: "/team-Editor", /* "/team-editor" */
        teamYeosu : "/teamYeosu",
        sopManager: "/sop-manager",
        dashboard: "/dashboard",
        history: "/history",
        historyYeosu: "/historyYeosu",
        historyAnalysis: "/historyAnalysis", /* 0201 */
        historySOP: "/historySOP",
        findPassword: "/findPassword",
        specialReport: '/specialReport',
        sensorSimulator: '/sensors',
        reportYeosu: '/report',
    }

    static getUserInfo() {
        const siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined ||
            window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()) == null)
            return null;

        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()));

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

    static async loadSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            try {
                const jsonData = SdmsJsonManager.makeRequestGetSiteID();

                const res = await fetch(ProjectResource.baseUrl + '/SDMS/SDMS/RequestData', {
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
                        ProjectResource.SiteID = result.siteID;
                    }
                }

            } catch (e) {
                console.log(e);
            }
        }

        return siteID;
    }

    static setLoginUser(user) {
        if (user === null || user === undefined)
            return;

        const siteID = ProjectResource.SiteID;
        if (siteID === null || siteID === undefined)
            return;

        window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(user));
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
        Soulbrain: 10,      // 솔브레인
        GCC: 12,            // 녹십자
        Yeosu: 20,          // 여수
        Busan: 30,          // 부산
    }


    static styleMode = "yeosu";
    
    static setMode = (mode) => {
        ProjectResource.styleMode = mode;
    }
}

