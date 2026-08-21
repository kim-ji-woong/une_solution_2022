import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SessionString from '../Common/js/sessionString';
import { SDMSController } from '../SDMS/services/sdmsController';
import SopSimulatorController from '../SOPSimulator/services/sopSimulatorController';
import { AccountController } from '../Account/services/accountController';
import { TeamEditController } from '../TeamEditor/services/teamEditController';
import { SettingController } from '../Settings/services/settingController';
import { DashboardController } from '../Dashboard/services/dashboardController';
import LayoutSetting from '../Settings/ui/popups/layoutSetting';
import SettingsStore from '../Settings/settingsStore';
import Store from './store';

import newStyles from '../Common/css/newStyle.module.css';
import dashboard from '../Dashboard/css/dashboardNew.module.css';


import $ from 'jquery';
import SDMSMenuBtn from '../SDMS/ui/sdmsMenuBtn';

import SopSimulatorMenuBtn from '../SOPSimulator/ui/sopSimulatorMenuBtn';
import AccountManager from '../Account/ui/popups/accountManager';
import ConfirmDialog from '../Common/ui/confirmHydrogen';

import AccountResource from '../Account/resource/id';
import ProjectResource from './resource/id';

import AccountStore from '../Account/accountStore';

import SopController from '../SOPManager/services/sopController';

import AccountChangePwd from '../Account/ui/popups/accountChangePwd';

import { TitleBar, CampusBarComponent } from './styled/titleBar';


import { i18n, withTranslation, i18nUtil } from '../language/i18n';
import setting_icon from '../Common/img/imghydrogen/main/setting_icon.svg';
import setting_icon_active from '../Common/img/imghydrogen/main/setting_icon_active.svg';

import MyPage from '../Account/ui/myPage';
import ChangePassword from '../Account/ui/changePassword';

class TitleBarSB extends Component {
    static keys = [];
    static shortcutKey = null;

	constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            settingOnOff: false,
            opneChangePwd: false,
            openMyPage: false,
            openChangePwd: false,
            openAccountManager: false,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [''],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },

            loading: true,
            reload: null,
            selectSiteID: null,
            isEditMode: false,
            date: new Date(),

            accountUsers: [],
        }

        this.props = props;


        // 시스템 Site ID 초기화
        this.initSiteID();
        // 선택 Site ID 초기화
        this.initSelectSiteID();

        this.initAccount();
    }

	componentDidUpdate() {
		//console.log('componentDidUpdate');
	}

    componentWillUnmount() {
		this.unsubscribe_AccountStore();
        this.unsubscribe_SettingsStore();

        // 언마운트시 단축키 이벤트 리스너 해제
        window.removeEventListener("keydown", this.keysPressedHandler, false);
        window.removeEventListener("keyup", this.keysReleasedHandler, false);
	}

	componentDidMount() {
		//console.log('componentDidMount');
        //this.setState({ popupOpen: true }); // 사용자권한관리
        // this.setState({ settingOnOff: true }); // 환경설정

        // 센서 히스토리 감시 타이머 시작
        SDMSController.StartWatchTimer();
        SopSimulatorController.StartWatchTimer();
        SettingController.StartWatchTimer();
        //if (ProjectResource.SiteID !== ProjectResource.Site.SUJAIN && ProjectResource.SiteID !== ProjectResource.Site.Tlb) {
        //    DashboardController.StartWatchTimer();
        //}

        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();

        // 다른 곳 클릭했을때 이벤트 발생
        $('#mainSB').click(function (e) {

            if ($('.rqQckBtn').hasClass('on') || $('.rqAppBtn').hasClass('on') || $('.rqUsrBtn').hasClass('on')) {
                let targetName = e.target.className;

                if (targetName === "") {
                    $('.rqQckBtn').next().hide();
                    $('.rqQckBtn').removeClass('on');
                    $('.rqAppBtn').next().hide();
                    $('.rqAppBtn').removeClass('on');
                    $('.rqUsrBtn').next().hide();
                    $('.rqUsrBtn').removeClass('on');
                }
            }
        });

        $('.rqBtn button').click(function () {
            if ($(this).is('.on')) {
                $(this).next().hide();
                $(this).removeClass('on');
            } else {
                $('.rqBtn > ul, .rqBtn > div').hide();
                $('.rqBtn button').removeClass('on');
                $(this).next().show();
                $(this).addClass('on');
            }
        });

        // 메뉴 선택 시 닫힘
        $('rqQck ul li').click(function (e) {
            $('.rqQckBtn').next().hide();
            $('.rqQckBtn').removeClass('on');
        });
        $('.rqApp ul li').click(function (e) {
            $('.rqAppBtn').next().hide();
            $('.rqAppBtn').removeClass('on');
        });

        $(document).mouseup(function (e) {
            if ($('.rqBtn').has(e.target).length === 0) {
                $('.rqBtn > ul, .rqBtn > div').hide();
                $('.rqBtn button').removeClass('on');
            }
        });

        // 단축키 이벤트 리스너
        this.keysPressedHandler = (e) => this.keysPressed(e, this);
        this.keysReleasedHandler = (e) => this.keysReleased(e, this);

        window.addEventListener("keydown", this.keysPressedHandler, false);
        window.addEventListener("keyup", this.keysReleasedHandler, false);


        this.unsubscribe_AccountStore = AccountStore.subscribe(function () {
            let data = AccountStore.getState();

            if (data.actionType === 'LOGIN_STATE') {
                this.checkLoginState(data);
            } else if (data.actionType === 'UPDATE_INFO') {
                this.reloadAccountInfo(data);
            }

            this.reloadDate();
        }.bind(this));

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SHORTCUT_KEY') {
                TitleBarSB.shortcutKey = data.shortcutKey;
            } else if (data.actionType === 'SELECT_SITEID') {
                this.changeSelectSiteID(data.selectSiteID);
            } else if (data.actionType === 'IS_EDIT_MODE') {
                this.changeEditMode(data.isEditMode);
            }
        }.bind(this));
    }

    keysPressed(e, target) {
        // store an entry for every key pressed
        TitleBarSB.keys[e.keyCode] = true;

        const commonKey = 18;   // Alt 키
        
        // 단축키 설정 가져오기
        let shortcutKey = TitleBarSB.shortcutKey;

        if (shortcutKey === null || shortcutKey === undefined) {
            return;
        }

        if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.sdms)]) {
            // sdms 단축키
            let url = window.location.origin + ProjectResource.path.sdms;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.sdms)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.settings)]) {
            // settings 단축키
            console.log("settings 단축키");
            target.onClickSetting();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.settings)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.teamEdit)]) {
            // teamEdit 단축키
            console.log("teamEdit 단축키");
            let url = window.location.origin + ProjectResource.path.teamEditor;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.teamEdit)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.home)]) {
            // home 단축키
            console.log("home 단축키");
            target.onClickLogo();
            target.hideShortCutKey();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.home)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBarSB.keys[commonKey]) {
            // 단축키 도움말
            console.log("단축키 도움말 단축키");
            target.showShortCutKey();

            // prevent default browser behavior
            e.preventDefault();
        }
        // GS인증에 따른 단축키 설정 
        else if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.sop)]) {
            console.log("sop 단축키");
            let url = window.location.origin + ProjectResource.path.sopSimulator;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.sop)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.sopMgr)]) {
            // sopMgr 단축키
            let url = window.location.origin + ProjectResource.path.sopManager;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.sopMgr)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.dashboard)]) {
            // dashboard 단축키
            let url = window.location.origin + ProjectResource.path.dashboard;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.dashboard)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBarSB.keys[commonKey] && TitleBarSB.keys[parseInt(shortcutKey.history)]) {
            // history 단축키
            let url = window.location.origin + ProjectResource.path.history;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBarSB.keys[commonKey] = false;
            TitleBarSB.keys[parseInt(shortcutKey.history)] = false;
            // prevent default browser behavior
            e.preventDefault();
        }
        
    }

    keysReleased(e, target) {
        // mark keys that were released
        TitleBarSB.keys[e.keyCode] = false;

        if (e.keyCode === 18) {
            target.hideShortCutKey();
        }
    }

    reloadDate = () => {
        const date = this.state.date;
        const dt = new Date();
        
        if (date?.getMinutes() !== dt.getMinutes()) {
            this.setState({date: dt});
        }
    }

    async initSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteID();

            if (result !== null && result !== undefined) {
                ProjectResource.SiteID = result;
            }

            this.setState({ reload: true });
        }
    }

    async initSelectSiteID() {
        const userInfo = await ProjectResource?.initUserInfo();
        const path = window?.location?.pathname;

        let siteID = null;

        if ((userInfo?.levelID === AccountResource.accountLevelID.master ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikCEO ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikSafety ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikSafeAdmin) &&
            path === ProjectResource?.path?.sdms) {
            // 마스터 경우 
            // SDMS 일 경우 SHOW SITE ID 초기화
            siteID = userInfo.showSiteID;
        } else if (userInfo?.siteID) {
            // 아닌 경우 자기 사이트
            siteID = userInfo.siteID;
        } else if (ProjectResource?.SiteID) {
            siteID = ProjectResource.SiteID;
        } 
        
        if (siteID) {
            SettingsStore.dispatch({ type: 'SELECT_SITEID', selectSiteID: siteID });
        }
    }

    initAccount = async () => {
        let accountUsers = [];

        const accountData = await AccountController.getAccountUsers(null);
        if (accountData?.length > 0) {
            accountUsers = accountData;
        }

        this.setState({ accountUsers })
    }

    changeSelectSiteID = (siteID) => {
        const selectSiteID = this.state.selectSiteID;

        if (siteID && siteID !== selectSiteID) 
            this.setState({ selectSiteID: siteID});
    }

    changeEditMode = (mode) => {
        const isEditMode = this.state.isEditMode;

        if (mode !== isEditMode) 
            this.setState({ isEditMode: mode});
    }

    showShortCutKey = () => {
        // 단축키 도움말 표시 관련 클래스 제거로 단축키 도움말 표시
        $(".shortcutKey").removeClass("hideKey");
    }

    hideShortCutKey = () => {
        // 단축키 도움말 표시 관련 클래스 추가로 단축키 도움말 숨김
        $(".shortcutKey").addClass("hideKey");
    }

	onClickLogout = () => {
        // 계정 리덕스에 상태 업데이트
        AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.logout, message: i18n.t('account.로그아웃했습니다') });
    }

    checkLoginState = (data) => {
        if (data === null || data === undefined ||
            data.loginState === null || data.loginState === undefined)
            return;

        if (data.loginState === AccountResource.loginState.logout) {
            // 로그아웃 시
            // 로그인 페이지로 이동
            this.props.history.push(ProjectResource.path.root);

            const siteID = ProjectResource.SiteID;

            if (siteID !== null && siteID !== undefined) {
                window.localStorage.removeItem(SessionString.Key.account + "_" + siteID.toString());
            }
        } else if (data.loginState === AccountResource.loginState.disconnected) {
            // 네트워크 연결 끊김 시
            this.showConfirmDialog(i18n.t('common.접속 오류'), [data.message], [i18n.t('common.확인')], this.onClickFalseConfirm, this.onClickFalseConfirm);
        } else if (data.loginState === AccountResource.loginState.false) {
            // 세션 조회 실패 시
            this.showConfirmDialog(i18n.t('common.접속 오류'), [data.message], [i18n.t('common.확인')], this.onClickFalseConfirm, this.onClickFalseConfirm);
        } else if (data.loginState === AccountResource.loginState.login) {
            const confirmMessage = { ...this.state.confirmMessage };
            if (confirmMessage.title === i18n.t('common.접속 오류')) {
                // 네트워크 연결 끊김 및 세션 오류 메시지만 닫기
                this.onCloseConfirmDialog();
            }            
        }
    }

    reloadAccountInfo = (data) => {
        this.setState({ reload: true });
    }

    onClickFalseConfirm = () => {
        //window.location.href = ProjectResource.path.root;
        this.props.history.push(ProjectResource.path.root);

        // 세션 초기화
        //window.localStorage.removeItem(SessionString.Key.account);
        const siteID = ProjectResource.SiteID;

        if (siteID !== null && siteID !== undefined) {
            window.localStorage.removeItem(SessionString.Key.account + "_" + siteID.toString());
        }
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, onClickClose) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (onClickClose !== null && onClickClose !== undefined)
            confirmMessage.onClose = onClickClose;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    onClickLogo() {
        if (this.state.isEditMode)
            return;
        
        if (this.props.menuEvent && this.props.menuEvent.onClickLogo) {
            this.props.menuEvent.onClickLogo();
        }
    }

    onClickSite = (siteID) => {
        if (siteID !== this.props.selectSiteID)
            SettingsStore.dispatch({ type: 'SELECT_SITEID', selectSiteID: siteID });
    }

    onClickSetting = () => {
        this.setState({ settingOnOff: true });
    }

    getTargetMenus() {
        if (this.props.target === "sdms") {
            return <SDMSMenuBtn menuEvent={this.props.menuEvent} />
        } else if (this.props.target === "sop-simulator") {
            return <SopSimulatorMenuBtn menuEvent={this.props.menuEvent} />;
        } else {
            return (
                <div className={"rqQck rqBtn"}>
                    <button className="rqQckBtn">메뉴열기</button>
                </div>
            );
        }
    }

    getLinkMenu() {
        const path = window.location.pathname;
        const userInfo = ProjectResource.getUserInfo();
        let linkMenuUI = [];

        // 단축키 설정 가져오기
        let shortcutKey = TitleBarSB.shortcutKey;
        let sdms = "";
        let sop = "";
        let sopMgr = "";
        let dashboard = "";
        let history = "";
        let teamEdit = "";

        if (shortcutKey !== null && shortcutKey !== undefined) {
            if (shortcutKey.sdms !== null && shortcutKey.sdms !== undefined && shortcutKey.sdms !== "") {
                let key = String.fromCharCode(shortcutKey.sdms);
                sdms = <span className={"shortcutKey menuShortCut hideKey"}>Al+{key}</span>;
            }
            if (shortcutKey.sop !== null && shortcutKey.sop !== undefined && shortcutKey.sop !== "") {
                let key = String.fromCharCode(shortcutKey.sop);
                sop = <span className={"shortcutKey menuShortCut hideKey"}>Al+{key}</span>;
            }
            if (shortcutKey.sopMgr !== null && shortcutKey.sopMgr !== undefined && shortcutKey.sopMgr !== "") {
                let key = String.fromCharCode(shortcutKey.sopMgr);
                sopMgr = <span className={"shortcutKey menuShortCut hideKey"}>Al+{key}</span>;
            }
            if (shortcutKey.dashboard !== null && shortcutKey.dashboard !== undefined && shortcutKey.dashboard !== "") {
                let key = String.fromCharCode(shortcutKey.dashboard);
                dashboard = <span className={"shortcutKey menuShortCut hideKey"}>Al+{key}</span>;
            }
            if (shortcutKey.history !== null && shortcutKey.history !== undefined && shortcutKey.history !== "") {
                let key = String.fromCharCode(shortcutKey.history);
                history = <span className={"shortcutKey menuShortCut hideKey"}>Al+{key}</span>;
            }
            if (shortcutKey.teamEdit !== null && shortcutKey.teamEdit !== undefined && shortcutKey.teamEdit !== "") {
                let key = String.fromCharCode(shortcutKey.teamEdit);
                teamEdit = <span className={"shortcutKey menuShortCut hideKey"}>Al+{key}</span>;
            }
        }

        let linkSDMS = <Link to="/sdms" target="_blank">{i18n.t('menu.모니터링 시스템')}</Link>;
        let linkSOPSimulator = <Link to={ProjectResource.path.sopSimulator} target="_blank">{i18n.t('menu.SOP')}</Link>;
        let linkSOPManager = <Link to={ProjectResource.path.sopManager} target="_blank">{i18n.t('menu.SOP 편집')}</Link>;
        let linkTeamEditor = <Link to={ProjectResource.path.teamEditor} target="_blank">{i18n.t('menu.조직관리')}</Link>;
        let linkDashBoard = <Link to={ProjectResource.path.dashboard} target="_blank">{i18n.t('menu.대시보드')}</Link>;
        let linkHistory = <Link to={ProjectResource.path.history} target="_blank">{i18n.t('menu.이력')}</Link>;

        if (path === ProjectResource.path.sdms) {
            linkSDMS = <a>{i18n.t('menu.모니터링 시스템')}</a>;
        } else if (path === ProjectResource.path.sopSimulator) {
            linkSOPSimulator = <a>{i18n.t('menu.SOP')}</a>;
        } else if (path === ProjectResource.path.sopManager) {
            linkSOPManager = <a>{i18n.t('menu.SOP 편집')}</a>;
        } else if (path === ProjectResource.path.teamEditor) {
            linkTeamEditor = <a>{i18n.t('menu.조직관리')}</a>;
        } else if (path === ProjectResource.path.dashboard) {
            linkDashBoard = <a>{i18n.t('menu.대시보드')}</a>;
        } else if (path === ProjectResource.path.history) {
            linkHistory = <a>{i18n.t('menu.이력')}</a>;
        }

        const userAuthor = ProjectResource.getUserAuthor();


        let adminLink = null;
        let userLink = null;

        let securityLink = (<React.Fragment>
        </React.Fragment>);
        let ceoLink = (<React.Fragment>
        </React.Fragment>);

        adminLink = (<React.Fragment>
            <li>{sdms}{linkSDMS}</li>
            <li>{sop}{linkSOPSimulator}</li>
            <li>{sopMgr}{linkSOPManager}</li>
            <li>{history}{linkHistory}</li>
            <li>{teamEdit}{linkTeamEditor}</li>
        </React.Fragment>);

        userLink = (<React.Fragment>
            <li>{sop}{linkSOPSimulator}</li>
            <li>{history}{linkHistory}</li>
        </React.Fragment>);


        // 계정 권한 별 표시
        if (userAuthor === AccountResource.accountLevelID.master ||
            userAuthor === AccountResource.accountLevelID.admin) {
            linkMenuUI.push(
                <React.Fragment key={"linkAdmin"}>
                    {adminLink}
                </React.Fragment>
            );
        } else if (userAuthor === AccountResource.accountLevelID.user) {
            linkMenuUI.push(
                <React.Fragment key={"linkUser"}>
                    {userLink}
                </React.Fragment>
            );
        } else {
            linkMenuUI.push(
                <React.Fragment key={"link"}>
                </React.Fragment>
            );
        }
        return linkMenuUI;
    }

    getTitle = () => {
        const path = window.location.pathname;
        let title = "";

        if (path === ProjectResource.path.sdms) {
            title = i18n.t('menu.모니터링 시스템');
        } else if (path === ProjectResource.path.sopSimulator) {
            title = i18n.t('menu.SOP');
        } else if (path === ProjectResource.path.sopManager) {
            title = i18n.t('menu.SOP 편집');
        } else if (path === ProjectResource.path.teamEditor) {
            title = i18n.t('menu.조직관리');
        } else if (path === ProjectResource.path.history) {
            title = i18n.t('menu.이력');
        }

        return title;
    }

    onClickMyPage = () => {
        this.setState({ openMyPage: true });
    }

    onClickCloseMypage = () => {
        this.setState({ openMyPage: false });
    }

    onClickClosePopup = (value) => {
        this.setState({ popupOpen: value });
    }

    settingOff = () => {
        this.setState({ settingOnOff: false });
    }

    onClickAccountMgr = async () => {
        this.setState({ openAccountManager: true });

        let accountUsers = [];

        const accountData = await AccountController.getAccountUsers(null);
        if (accountData?.length > 0) {
            accountUsers = accountData;
        }

        this.setState({ accountUsers })
    }

    onClickCloseAccountMgr = () => {
        this.setState({ openAccountManager: false });
    }

    getTitleNameUI() {
        const path = window.location.pathname;

        if (path === ProjectResource.path.sdms) {
            return (<></>);
        } else if (path === ProjectResource.path.teamEditor) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{i18n.t('menu.조직관리')}</h2>
                </div>);
        } 
        else if (path === ProjectResource.path.sopSimulator) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{i18n.t('menu.SOP')}</h2>
                </div>);
        } else if (path === ProjectResource.path.sopManager) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{i18n.t('menu.SOP 편집')}</h2>
                </div>);
        } else if (path === ProjectResource.path.dashboard) {
            return (
                <div id={newStyles.hsTop} className={dashboard.hsTop}>
                    <h2 className={newStyles.hstTitle}>{i18n.t('menu.대시보드')}</h2>
                </div>);
        } else if (path === ProjectResource.path.history) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{i18n.t('menu.이력')}</h2>
                </div>);
        }
    }

    getDate() {
        const now = new Date();

        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);;
        const hour = ('0' + now.getHours()).slice(-2);
        const min = ('0' + now.getMinutes()).slice(-2);
        const sec = ('0' + now.getSeconds()).slice(-2);

        if (ProjectResource.targetLanguage === "en") {
            return "KR " + year + "." + month + "." + day + " " + hour + ":" + min;
        } else {
            return "KR " + year + "." + month + "." + day + " " + hour + ":" + min;
        }
    }

    // 수현 : 언어 변경 TEST 
    onChangeLanguage = () => {
        if (i18n.language === "ko") {
            i18n.changeLanguage("en");
        } else if (i18n.language === "en") {
            i18n.changeLanguage("ko");
        }
    }

    // 수현 : 언어 변경 TEST 
    onChangeLanguage2 = () => {
        console.log("ProjectResource.targetLanguage : " + ProjectResource.targetLanguage);
        if (ProjectResource.targetLanguage === "ko") {
            ProjectResource.targetLanguage = "en";
        } else if (ProjectResource.targetLanguage === "en") {
            ProjectResource.targetLanguage = "ko";
        }
    }

    getUserInfo() {
        const { openMyPage, openChangePwd, openAccountManager } = this.state;

        let userName = "-";
        let userLevel = "-";
        let userLevelID = -1;
        const siteID = ProjectResource.SiteID;        

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo !== null && userInfo !== undefined) {
            userName = userInfo.nickName;
            userLevel = i18nUtil.convertText(userInfo.level);
            userLevelID = userInfo.levelID;
        }

        if (userLevelID === AccountResource.accountLevelID.master ||
            userLevelID === AccountResource.accountLevelID.admin) {

            return (
                <div className={openMyPage || openChangePwd || openAccountManager ? "rqUsr rqBtn on" : "rqUsr rqBtn"}>
                    <button className="rqUsrBtn">
                        {/* <span className="rqUsrSpan"><p>{userName}</p></span> */}
                        {/* <p className="rqContectNation">{this.getDate()}</p> */}
                    </button>
                    <div>
                        <span className={"rqIDBox"} onClick={this.onClickMyPage}>
                            <span className={this.state.openMyPage ? 'on' : null}>{userLevel}</span>
                            <p onClick={() => this.onChangeLanguage()}>ID : {userName}</p>
                        </span>
                        {/* <p className="adminContectNation" onClick={() => this.onChangeLanguage2()}>{this.getDate()}</p> */}
                        <ul>
                            {/* { adminIconArea } */}
                            <li onClick={() => this.onClickAccountMgr()}>{i18n.t('account.계정 및 권한')}</li>
                            <li onClick={this.onClickLogout}>{i18n.t('account.로그아웃')}</li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={openMyPage || openChangePwd || openAccountManager ? "rqUsr rqBtn on" : "rqUsr rqBtn"}>
                    <button className="rqUsrBtn">
                    </button>
                    <div>
                        <span className={"rqIDBox"} onClick={this.onClickMyPage}>
                            <span className={this.state.openMyPage ? 'on' : null}>{userLevel}</span>
                            <p>ID : {userName}</p>
                        </span>
                        <ul>
                            <li onClick={this.onClickLogout}>{i18n.t('account.로그아웃')}</li>
                        </ul>
                    </div>
                </div>
            );
        }
        
    }

    getLogo() {
        // 단축키 설정 가져오기
        let shortcutKey = TitleBarSB.shortcutKey;
        let home = <></>;

        if (shortcutKey !== null && shortcutKey !== undefined) {
            if (shortcutKey.home !== null && shortcutKey.home !== undefined && shortcutKey.home !== "") {
                let key = String.fromCharCode(shortcutKey.home);
                home = <span className={"shortcutKey logoShortCut hideKey"}>Al+{key}</span>;
            }
        }

        if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
            return <h1 className="rqLogoHydrogen" onClick={() => this.onClickLogo()}>{home}</h1>
        }       

        if (this.props.menuEvent && this.props.menuEvent.getSDMSCommonSettings) {
            const logoStyle = this.props.menuEvent.getSDMSCommonSettings('TitleBarLogoStyle');

            if (logoStyle) {
                const styleObj = JSON.parse(logoStyle);
                return <h1 style={styleObj} onClick={() => this.onClickLogo()}>{home}</h1>
            }
        }
        return <></>
    }

    /* onClickChangePwd = () => {
        this.setState({ opneChangePwd: true});
    }

    onClickCloseChangePwd = () => {
        this.setState({ opneChangePwd: false });
    } */

    onClickChangePassword = () => {
        this.setState({ openChangePwd: true, openMyPage: false });
    }

    onClickCloseChangePassword = () => {
        this.setState({ openChangePwd: false });
    }

    reLoadOpenMyPage = () => {
        this.setState({ openChangePwd: false, openMyPage: true });
    }

    getSettingKey = () => {
        let shortcutKey = TitleBarSB.shortcutKey;
        let settings = <></>;

        if (shortcutKey !== null && shortcutKey !== undefined) {
            if (shortcutKey.settings !== null && shortcutKey.settings !== undefined && shortcutKey.settings !== "") {
                let key = String.fromCharCode(shortcutKey.settings);
                settings = <span className={"shortcutKey setShortCut hideKey"}>Al+{key}</span>;
            }
        }

        return settings;
    }

    getDisplayTime = () => {
        let displayTime = "-";
        let displayDay = "-";
        let date = this.state.date;        

        if (!date)
            date = new Date();

        const year = date.getFullYear();

        let month = date.getMonth() + 1;
        if (month < 10)
            month = "0" + month;

        let day = date.getDate();
        if (day < 10)
            day = "0" + day;

        const nDay = date.getDay();
        const dayString = i18n.t('account.arr.' + nDay);

        let unit = "AM";
        let hours = date.getHours();
        if (hours < 10)
            hours = "0" + hours;
        else if (hours > 11) {
            unit = "PM";
            if (hours > 12)
                hours = hours - 12;

            if (hours < 10)
                hours = "0" + hours;
        }

        let minutes = date.getMinutes();
        if (minutes < 10)
            minutes = "0" + minutes;
        
        displayDay = day + "." + month + "." + year;
        if (i18n.language === "ko") {
            displayDay = year + "." + month + "." +  day;
        }

        displayTime = unit + " " + hours + ":" + minutes;

        return [displayTime, displayDay];
    }

    render() {
        const [displayTime, displayDay] = this.getDisplayTime();

        return (
            <>                
                <TitleBar className="rqMenu" $isEditMode={this.state.isEditMode}>
                    <div className="rqLogoWrap">
                        {
                            this.getLogo()
                        }
                        <p>{this.getTitle()}</p>
                        <span>
                            {/* this.getDisplayTime()*/}
                        </span>
                    </div>
                    <div className="rqTimeWrap">
                        <span className="timeBox">{displayTime}</span>
                        <span className="dayBox">{displayDay}</span>
                    </div>

                    <div className="rqBtnWrap">
                        {
                            this.getTargetMenus()
                        }
                        <div className={"rqApp rqBtn"}>
                            <button className="rqAppBtn">메뉴열기</button>
                            <ul>
                                { this.getLinkMenu() }
                            </ul>
                        </div>
                        { this.getUserInfo() }
                        <img onClick={this.onClickSetting} className="rqStng" src={this.state.settingOnOff? setting_icon_active : setting_icon}/>
                    </div>

                </TitleBar>
                
                { this.getTitleNameUI() }

                {
                    /* 환경설정 팝업 */
                    /*<DisplaySetting settingOnOff={this.state.settingOnOff} settingOff={this.settingOff} />*/
                    this.state.settingOnOff &&
                    <LayoutSetting
                        settingOff={this.settingOff}
                    />
                }
                {
                    /* 비밀번호 변경 팝업 */
                    this.state.opneChangePwd &&
                    <AccountChangePwd 
                        onClickCloseChangePwd={this.onClickCloseChangePwd}
                        showConfirmDialog={this.showConfirmDialog}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                    />
                }
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
                {
                    this.state.openMyPage &&
                    <MyPage
                        onClickCloseMypage={this.onClickCloseMypage}
                        onClickChangePassword={this.onClickChangePassword}
                        accountUsers={this.state.accountUsers} />
                }
                {
                    this.state.openChangePwd &&
                    <ChangePassword
                        onClickCloseChangePassword={this.onClickCloseChangePassword}
                        showConfirmDialog={this.showConfirmDialog}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                        reLoadOpenMyPage={this.reLoadOpenMyPage}
                    />
                }
                {
                    this.state.openAccountManager &&
                    <AccountManager
                        onClickCloseAccountMgr={this.onClickCloseAccountMgr}
                        accountUsers={this.state.accountUsers} />
                }
            </>
		);
	}
}

export default withRouter(withTranslation()(TitleBarSB));