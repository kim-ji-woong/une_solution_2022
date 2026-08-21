import SessionString from '../../Common/js/sessionString';
import { SdmsJsonManager } from '../../SDMS/services/sdmsJsonManager';
import TreeNode from '../../TeamEditor/ui/utility/treenode';
import SettingsStore from '../../Settings/settingsStore';

export default class ProjectResource {
    static targetLanguage = "ko";
    static siteID = null;
    static bMultiSite = false;
    static sites = null;

    static version = "1.0.1";   // WSOP 버전    

    static get SiteID() {
        return ProjectResource.siteID;
    }

    static set SiteID(id) {
        ProjectResource.siteID = id;
    }

    static get IsMultiSite() {
        return ProjectResource.bMultiSite;
    }

    static menu = {
        sdms: "3D관제화면",
        sopSimulator: 'SOP',
        teamEditor: '조직관리',
        sopManager: 'SOP 편집',
        dashboard: '대시보드',
        history: "이력"
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
        specialReport: '/specialReport',
        sensorSimulator: '/sensors',
        dashboardWonik: "/dashboardWonik",
        safetyCheckForm: "/safetyCheckForm",    // 안전구역평가
        sampleVideo: "/sampleVideo",            // 원익 시현영상
        accessWonikSSO: "/accessWonikSSO"       // 원익 SSO
    }

    static getUserInfo() {
        const siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined ||
            window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()) == null)
            return null;

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
            siteID = await ProjectResource.loadSiteID();
        }

        return ProjectResource.getUserAuthor();
    }

    static async loadSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            try {
                //const jsonData = SdmsJsonManager.makeRequestGetSiteID();

                const res = await fetch('Commons/Commons/RequestGetSiteID', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    //body: jsonData
                });

                if (res.ok) {
                    const result = await res.json();

                    if (result.success === true) {
                        ProjectResource.SiteID = result.sites[0].id;
                        ProjectResource.sites = result.sites;
                        if (result.sites.length > 1) {
                            ProjectResource.bMultiSite = true;
                        }

                        // 사이트 읽어서 styleMode 변경하는거 동작 안됨. 방법 찾아보기
                        //if (result.sites[0].id === ProjectResource.Site.Soulbrain) {
                        //    ProjectResource.styleMode = ProjectResource.StyleType.Soulbrain;
                        //}
                        //else if (result.sites[0].id === ProjectResource.Site.Wonik) {
                        //    ProjectResource.styleMode = ProjectResource.StyleType.Wonik;
                        //}
                        //else {
                        //    ProjectResource.styleMode = ProjectResource.StyleType.Soulbrain;
                        //}

                        return ProjectResource.SiteID;
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

        // showSiteID 관련 추가
        const userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()));
        if (userInfo?.showSiteID) {
            user.showSiteID = userInfo.showSiteID;
        } else {
            if (user?.siteID)
                user.showSiteID = user.siteID;
            else
                user.showSiteID = siteID;
        }

        window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(user));
    }

    static setLanguage(type) {
        window.localStorage.setItem(SessionString.Key.language, type);
    }

    static getLanguage() {
        const language = window.localStorage.getItem(SessionString.Key.language);
        if (!language) {
            return "ko";
        }
        return language;
    }

    static setShowSiteID(showSiteID) {
        let ret = true;
        const siteID = ProjectResource.SiteID;
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            userInfo.showSiteID = showSiteID;

            window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(userInfo));
        } else {
            ret = false;
        }

        return ret;
    }

    static Site = {        
        Soulbrain: 10,      // 솔브레인
        GCC: 12,            // 녹십자
        Tlb: 14,            // TLB
        SUJAIN: 16,         // 수자인
        SENKO: 17,          // 센코
        Hydrogen: 15,       // 수소충전소
        CheongSim: 18,      // 천원궁

        Wonik: 30,          // 원익
        Wonik_A: 31,        // 원익_A
        Wonik_C: 32,        // 원익_C
        Wonik_V: 33,        // 원익_V
        Wonik_S: 34,        // 원익_S

        Magog: 35,          // 마곡

        GG_A: 40,           // 경기도청 (통합방재실)
        GG_B: 41,           // 경기도청 (도청,도의회)
        GG_C: 42,           // 사용안함
        GG_D: 43,           // 경기도청 (도서관)
        GG_E: 44,           // 경기도청 (복합시설관)
        GG_F: 45,           // 경기도청 (신용보증재단)
        GG_G: 46,           // 경기도청 (교육청)
        GG_H: 47,           // 경기도청 (경기주택도시공사 신사옥)
    }

    static StyleType = {
        Soulbrain: "soulbrain",
        Wonik: "Wonik",
        Hydrogen: "Hydrogen",
        Gyeonggi: "Gyeonggi",
        CheongSim: "CheongSim",
    }

    static styleMode = ProjectResource.StyleType.Soulbrain;
    // static styleMode = ProjectResource.StyleType.Wonik;
    // static styleMode = ProjectResource.StyleType.Hydrogen;
    // static styleMode = ProjectResource.StyleType.Gyeonggi;
    
    //static treeCascadeMode = TreeNode.Checkbox_RelativeUse;
    static treeCascadeMode() {
        if (ProjectResource.SiteID === ProjectResource.Site.Tlb) {
            return TreeNode.Checkbox_RelativeUse;
        }
        else {
            return TreeNode.CheckBox_NormalUse;
        }
    }
}