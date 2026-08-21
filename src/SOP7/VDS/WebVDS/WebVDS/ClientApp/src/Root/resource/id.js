import { AccountController } from '../../Account/services/accountController';
import SessionString from '../../Common/js/sessionString';
//import { SdmsJsonManager } from '../../SDMS/services/sdmsJsonManager';

export default class ProjectResource {
    static targetLanguage = "ko";
    static siteID = 1;

    static version = "1.0.0";   // VDS 버전

    /* 개발1팀 개발환경 */
    static baseUrl = "";

    static loginUser = null;

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
            dashboard: {
                vdcList: 'VDC 목록',
                vdcUsage: 'VDC 사용량',
                usageSummary: '사용량 요약 정보',
                vdcAssetInfo: 'VDC 자산정보',
                assetSummary: '자산 요약 정보',
                generalInfo: '일반정보',
                generalInfoDetail: {
                    companyName: '고객사명',
                    type: '구분',
                    creationType: '생성방법',
                    creationDate: '생성일',
                    address: '주소',
                    adminUser: '담당 Admin',
                    vdcCount: '총 VDC 수량',
                    creationType: '생성방식',
                    size: '크기',
                    beginDate: '시작일',
                    endDate: '만료일',
                    vdcCompany: 'VDC 소속사'
                },
                changeNFault: '변경/장애 요약정보',
                changeNFaultDetail: {
                    change: '변경',
                    fault: '장애'
                },
                location: '위치'
            },
            main: {
                inventory: '랙/인벤토리 관리',
                inventoryButtons: {
                    all: '전체',
                    server: '서버',
                    network: '네트워크',
                    etc: '기타'
                },
                inventoryPlaceHolder: '검색어를 입력하세요.',
                inventoryRackInfo: '랙 정보',
                inventoryRackInfoDetail: {
                    type: '구분',
                    kind: '종류',
                    size: '크기',
                    unit: 'Unit',
                    regDate: '설치일'
                },
                itPropertyInfo: 'IT장비 정보',
                itPropertyInfoDetail: {
                    hostName: 'HOST명',
                    cpu: 'cpu',
                    ram: '메모리',
                    disk: '내장디스크',
                    diskVolume: '내장디스크 용량',
                    regDate: '설치일',
                    size: '크기',
                    shelf: '선반 여부',
                    moreDetail: '더보기',
                    linkedServer: '연결서버'
                },
                view3d: {
                    title: '3D 미리보기',
                    subTitle: '3D 미리보기',
                    goBack: '돌아가기'
                }
            },
            edit: {
                inventory: '랙/인벤토리 관리',
                inventoryList: '인벤토리 목록',
                inventoryListDetail: {
                    rack: "랙",
                    itProperty: "IT장비",
                    facility: "설비",
                    etc: "기타",
                    rackList: "랙 목록",
                    area: "구역",
                    all: "전체",
                    search: "검색",
                    downloadSelection: "선택항목 다운로드",
                    downloadAll: "전체 다운로드",
                    regDate: "등록일자",
                    hostName: "HOST명",
                    kind: "구분",
                    company: "제조사",
                    unit: "Unit",
                    modelName: "모델명",
                    type: "타입",
                    size: "크기(W x D x H)"
                },
                editProperty: "자산 편집",
                editPropertyDetail: {
                    lib3dProperties: "3D자산 라이브러리",
                    rack: "랙",
                    itProperty: "IT장비",
                    facility: "설비",
                    etc: "기타",
                    no: "No",
                    modelName: "모델명",
                    category: "카테고리",
                    width: "Width",
                    depth: "Depth",
                    height: "Height",
                    company: "제조사",
                    wdh: "W x D x H(U)",
                    type: "타입",
                    rackTypes: "랙장비 종류",
                    all: "전체",
                    server: "서버",
                    network: "네트워크",
                    etc: "기타",
                    storage: "스토리지",
                    backup: "백업",
                    security: "보안",
                    sanSwitch: "SAN 스위치",
                    appliance: "어플라이언스",
                    itPropertyTypes: "IT장비 종류"
                },
                view3d: "3D뷰어",
                view3dDetail: {
                    goBack: "돌아가기"
                },
                inventoryPlaceHolder: '검색어를 입력하세요.',
                rackPlan: '랙 실장도',
                linkedITProperty: '연결 IT장비',
                itPropertyListInventory: '랙 인벤토리 목록'
            },
            management: {
                select: {
                    all: "전체",
                    rack: "랙",
                    itProperty: "IT장비",
                    facility: "설비"
                },
                dataCenterType: {
                    own: "자체",
                    rent: "임대"
                },
                creationType: {
                    fileUpload: "파일업로드",
                    interface: "인터페이스"
                },
                errorMessage: {
                    selectSite: "고객사를 선택하세요",
                    inputVdcName: "VDC명을 입력하세요",
                    inputLatitude: "위도를 입력하세요.(-90 ~ 90)",
                    inputLongitude: "경도를 입력하세요.(-180 ~ 180)",
                    inputWidth: "크기 (W)를 입력하세요.(0보다 큰 숫자)",
                    inputDepth: "크기 (D)를 입력하세요.(0보다 큰 숫자)",
                    inputHeight: "크기 (H)를 입력하세요.(0보다 큰 숫자)",
                    inputStartX: "시작점 (x)를 입력하세요.(0 또는 그 보다 큰 정수)",
                    inputStartY: "시작점 (y)를 입력하세요.(0 또는 그 보다 큰 정수)",
                    inputBottomElevation: "바닥면에서의 높이를 입력하세요.(0 또는 그 보다 큰 숫자)",
                }
            },
            quickButton: {
                modeFps: "1인칭 모드",
                modeBird: "3인칭 모드",
                modeEdit: "편집 모드"
            },
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
            },
            button: {
                confirm: '확인',
                initialize: '초기화',
                save: '저장'
            },
            messageBox: {
                title: {
                    error: "에러",
                    warning: "오류",
                    info: "정보",
                    confirm: "확인",
                    confirmCancel: "삭제",
                }
            },
            errorMessage: {
                sameRackName: "이미 같은 이름의 Rack이 존재합니다.",
                failMakeRackGroup: "이미 다른 그룹에 속해있습니다.",
                sameRackGroupName: "이미 같은 이름의 Rack 그룹이 존재합니다.",
                noPermissionToUser: "일반사용자는 사용할 수 없는 기능입니다."
            }
        }
    }

    static path = {
        root: "/",
        sopSimulator: "/sop-simulator",
        sopSimulatorYeosu: "/sop-simulatorYeosu", /* 1206  */
        sopSimulatorYeosuList: "/sop-simulatorYeosuList",  /* 1208 */
        sdms: "/sdms",
        teamEditor: "/team-editor",
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
        main: '/main',
        vds: '/vds',
        edit: '/edit'
    }

    static getUserInfo() {
        return ProjectResource.loginUser;
        /*const siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined ||
            window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()) == null)
            return null;

        let userInfo = JSON.parse(window.localStorage.getItem(SessionString.Key.account + "_" + siteID.toString()));
        return userInfo;*/
    }

    static async initUserInfo() {
        return ProjectResource.loginUser;
        //let siteID = ProjectResource.SiteID;

        //if (siteID === null || siteID === undefined) {
        //    siteID = 1;
        //}

        //const userInfo = ProjectResource.getUserInfo();

        //if (userInfo/* && (!userInfo.userData || !userInfo.dataCenters)*/) {
        //    const [user, message] = await AccountController.requestUserInfo(userInfo.id);

        //    if (user) {
        //        userInfo.userData = user.userData;
        //        userInfo.dataCenters = user.dataCenters;

        //        ProjectResource.setLoginUser(userInfo);
        //    }
        //}

        //return userInfo;
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
            siteID = 1;
        }

        return ProjectResource.getUserAuthor();
    }

    static setLoginUser(user) {
        ProjectResource.loginUser = user;
        /*if (user === null || user === undefined)
            return;

        const siteID = ProjectResource.SiteID;
        if (siteID === null || siteID === undefined)
            return;

        window.localStorage.setItem(SessionString.Key.account + "_" + siteID.toString(), JSON.stringify(user));*/
    }

    static clearLoginUser(user) {
        ProjectResource.loginUser = null;
        /*if (user === null || user === undefined)
            return;

        const siteID = ProjectResource.SiteID;
        if (siteID === null || siteID === undefined)
            return;

        window.localStorage.removeItem(SessionString.Key.account + "_" + siteID.toString());*/
    }

    static styleMode = "default";

    static setMode = (mode) => {
        ProjectResource.styleMode = mode;
    }

    static moveTo(target) {
        if (ProjectResource.targetLanguage === "ko") {
            return target + "  이동 >>";
        }

        return "move to " + target + " >>";
    }

    static getSiteName(site) {
        if (!site) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return site.name;
        }

        return site.engName;
    }

    static getNationName(nation) {
        if (!nation) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return nation.name;
        }

        return nation.engName;
    }

    static getDataCenterName(center) {
        if (!center) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return center.name;
        }

        return center.engName;
    }

    static getCompanyName(company) {
        if (!company) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return company.name;
        }

        return company.engName;
    }

    static getAccountLevelName(level) {
        if (!level) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return level.levelName;
        }

        return level.levelEngName;
    }

    static getEquipmentTypeName(equipmentType) {
        if (!equipmentType) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            if (equipmentType.name.toLowerCase() === "box" || equipmentType.name.toLowerCase() === "박스") {
                return "서버";
            }

            return equipmentType.name;
        }

        if (equipmentType.name.toLowerCase() === "box") {
            return "server";
        }

        return equipmentType.engName;
    }

    static getColorName(item) {
        if (!item) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return item.colorName;
        }

        return item.colorEngName;
    }

    static getSensorTypeName(sensorType) {
        if (!sensorType) {
            return "";
        }

        if (ProjectResource.targetLanguage === "ko") {
            return sensorType.name;
        }

        return sensorType.engName;
    }

    static getNeedText(need) {
        if (ProjectResource.targetLanguage === "ko") {
            if (need === 1 || need === "1") {
                return "필요";
            }

            return "불필요";
        }

        if (need === 1 || need === "1") {
            return "need";
        }

        return "not need";
    }

    static getRackEditText() {
        if (ProjectResource.targetLanguage === "ko") {
            return "VDC 랙 배치 편집";
        }

        return "Edit Rack";
    }

    static getRackEditOut() {
        if (ProjectResource.targetLanguage === "ko") {
            return "랙 편집";
        }

        return "Edit Rack";
    }

    static getITPropertyEditText() {
        if (ProjectResource.targetLanguage === "ko") {
            return "랙 인벤토리 정보 편집";
        }

        return "Edit IT Property";
    }

    static getUnknownRackGroupName() {
        if (ProjectResource.targetLanguage === "ko") {
            return "구역할당 되지않은 Rack";
        }

        return "No RackGroup";
    }

    static getNewRegistTitle(dataCenter) {
        if (ProjectResource.targetLanguage === "ko") {
            return dataCenter.name + " 신규생성 중";
        }

        return "New DataCenter is created as " + dataCenter.engName;
    }

    static notImplementMessage() {
        if (ProjectResource.targetLanguage === "ko") {
            return "향후 구현 기능입니다.";
        }

        return "not yet implemented...";
    }

    static deleteObject(obj) {
        for (const key in obj) {
            const data = obj[key];

            if (data instanceof HTMLElement) {
                continue;
            }
            else if (data && !Array.isArray(data) && data instanceof Object) {
                ProjectResource.deleteObject(data);
            }

            delete obj[key];
        }
    }

    static makeClone(obj) {
        if (!obj) {
            return obj;
        }

        let _obj;

        if (Array.isArray(obj)) {
            _obj = [...obj];
            const count = _obj.length;

            for (let i = 0; i < count; i++) {
                _obj.splice(i, 1, ProjectResource.makeClone(_obj[i]));
            }
        }
        else if (obj instanceof Object) {
            _obj = { ...obj };

            for (const key in _obj) {
                _obj[key] = ProjectResource.makeClone(_obj[key]);
            }
        }
        else {
            return obj;
        }

        return _obj;
    }
}

