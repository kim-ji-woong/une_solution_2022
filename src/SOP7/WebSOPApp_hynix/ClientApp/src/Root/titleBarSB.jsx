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

import uis from '../Common/css/ui.module.css';
import contents from '../Common/css/content.module.css';
import styles from '../Common/css/style.module.css';
import titleBarSBs from './css/titleBarSB.module.css';
import newStyles from '../Common/css/newStyle.module.css';
import uneCommon from '../Common/css/uneCommon.module.css';
import dashboard from '../Dashboard/css/dashboardNew.module.css';

import logo from '../Common/image/common/logo.png';
import Ulogout from '../Common/img/common/user_logout.png';
import Umanagement from '../Common/img/common/user_management.png';
import Upassword from '../Common/img/common/user_password.png';

import UpasswordWonik from '../Common/img/common/user_password_wonik.png';
import UmanagementWonik from '../Common/img/common/user_management_wonik.png';
import UlogoutWonik from '../Common/img/common/user_logout_wonik.png';

import UlogoutHydrogen from '../Common/img/imghydrogen/H_logoutIcon.png';

import $ from 'jquery';
import SDMSMenuBtn from '../SDMS/ui/sdmsMenuBtn';

import SopSimulatorMenuBtn from '../SOPSimulator/ui/sopSimulatorMenuBtn';
import AccountManager from '../Account/ui/popups/accountManager';
import AccountRegister from '../Account/ui/popups/accountRegister';
import AccountManagerNew from '../Account/ui/popups/accountManagerNew';
import AccountManagerGG from '../Account/ui/popups/accountManagerGG';
import ConfirmDialog from '../Common/ui/confirmDialog';

import AccountResource from '../Account/resource/id';
import ProjectResource from './resource/id';

import AccountStore from '../Account/accountStore';

import SopController from '../SOPManager/services/sopController';

import AccountChangePwd from '../Account/ui/popups/accountChangePwd';

import { TitleBar, CampusBarComponent } from './styled/titleBar';

import HydrogenLogout from '../Common/img/imghydrogen/H_logoutIcon.png';
import { i18n, withTranslation, i18nUtil } from '../language/i18n';
import { GghController } from '../SDMS/services/gghController';
import wsManager from '../SDMS/services/wsManager';

import rqProfile from '../Common/img/common/rq_profile.jpg';
import menuIcon from '../Common/img/imgwonik/header_menu_icon.png';
import gg_titlebar_select_arrow from '../Common/img/imgGyeonggi/gg_titlebar_select_arrow.svg';
import settingIcon from '../Common/img/imgwonik/header_setting_icon.png';
import userIcon from '../Common/img/imgwonik/header_user_icon.png';
import arrowIcon from '../Common/img/imgwonik/header_arrow_icon.png';
import rqLogoGyeonggi from '../Common/image/common/logo_Gyeonggi.png';


class TitleBarSB extends Component {
    static keys = [];
    static shortcutKey = null;

	constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            settingOnOff: false,
            opneChangePwd: false,

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

            isGGallBtnHovered: false,

            tooltip:{
                show: false,
                top: 0,
                left: 0,
                content: ''
            }
        }

        this.props = props;


        // 시스템 Site ID 초기화
        this.initSiteID();
        // 선택 Site ID 초기화
        this.initSelectSiteID();

        this.setWsManager();
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
        // this.setState({ popupOpen: true }); // 사용자권한관리
        // this.setState({ settingOnOff: true }); // 환경설정

        // 센서 히스토리 감시 타이머 시작
        if (ProjectResource.SiteID !== ProjectResource.Site.Tlb) {
            SDMSController.StartWatchTimer();
        }
        SopSimulatorController.StartWatchTimer();
        SettingController.StartWatchTimer();
        if (ProjectResource.SiteID !== ProjectResource.Site.SUJAIN && ProjectResource.SiteID !== ProjectResource.Site.Tlb) {
            DashboardController.StartWatchTimer();
        }

        this.startWatchTimerGG();

        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();

        // 다른 곳 클릭했을때 이벤트 발생
        $('#mainSB').click(function (e) {

            if ($('.rqQckBtn').hasClass('on') || $('.rqAppBtn').hasClass('on') || $('.rqUsrBtn').hasClass('on') || $('.rqUsrBtnGG').hasClass('on')) {
                let targetName = e.target.className;

                if (targetName === "") {
                    $('.rqQckBtn').next().hide();
                    $('.rqQckBtn').removeClass('on');
                    $('.rqAppBtn').next().hide();
                    $('.rqAppBtn').removeClass('on');
                    $('.rqUsrBtn').next().hide();
                    $('.rqUsrBtn').removeClass('on');
                    $('.rqUsrBtnGG').next().hide();
                    $('.rqUsrBtnGG').removeClass('on');
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

        $('.rqBtnGG button').click(function () {
            if ($(this).is('.on')) {
                $(this).next().hide();
                $(this).removeClass('on');
            } else {
                $('.rqBtnGG > ul, .rqBtnGG > div').hide();
                $('.rqBtnGG button').removeClass('on');
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

        $(document).mouseup(function (e) {
            if ($('.rqBtnGG').has(e.target).length === 0) {
                $('.rqBtnGG > ul, .rqBtnGG > div').hide();
                $('.rqBtnGG button').removeClass('on');
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

    startWatchTimerGG = async () => {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteID();

            if (result === ProjectResource.Site.GG_A) {
                GghController.StartWatchTimer();
            }
        }
        else if (siteID === ProjectResource.Site.GG_A) {
            GghController.StartWatchTimer();
        }
    }

    async setWsManager() {
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.siteID >= ProjectResource.Site.GG_A && userInfo?.siteID <= ProjectResource.Site.GG_H) {
            if (!this.wsManager) {
                const webSocketPort = await GghController.getWebSocketPort();
    
                if (webSocketPort > 0) {
                    this.wsManager = new wsManager(webSocketPort, this);
                }
            }
        }
    }

    closeAllCCTVs = async () => {
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.siteID >= ProjectResource.Site.GG_A && userInfo?.siteID <= ProjectResource.Site.GG_H) {
            if (this.wsManager) {
                this.wsManager.closeAll(userInfo.id);
                this.wsManager.close();
                this.wsManager = null;
            }
        }
    }

    onWebsocketMessage(guid) {
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
        } else if (TitleBarSB.keys[commonKey] && e.keyCode === commonKey) {
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
        
        if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            siteID = userInfo.siteID;
        }
        
        if (siteID) {
            SettingsStore.dispatch({ type: 'SELECT_SITEID', selectSiteID: siteID });
        }
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
        this.closeAllCCTVs();

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
            this.showConfirmDialog(i18n.t('common.오류'), [data.message], [i18n.t('common.확인')], this.onClickFalseConfirm, this.onClickFalseConfirm);
        } else if (data.loginState === AccountResource.loginState.false) {
            // 세션 조회 실패 시
            this.showConfirmDialog(i18n.t('common.오류'), [data.message], [i18n.t('common.확인')], this.onClickFalseConfirm, this.onClickFalseConfirm);
        } else if (data.loginState === AccountResource.loginState.login) {
            this.onCloseConfirmDialog();
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
        if (ProjectResource.SiteID === ProjectResource.Site.GG_A && this.state.isEditMode)
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
            // 경기 inline-css
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                return (
                    <div className={"rqQck rqBtn"} style={{ display: 'none', float: 'left', position: 'relative', marginRight: '20px' }}>
                        <button className="rqQckBtn" style={{ display: 'block', width: '30px', height: '30px', cursor: 'pointer', textIndent: '-9999px' }}>메뉴열기</button>
                    </div>
                );
            }
            else {
                return (
                    /*
                    <div className={uis.fileWrap}>
                        <button type="button" className={uis.btnFile}><i className={uis.iconFile}></i></button>
                    </div>
                    */
                    <div className={"rqQck rqBtn"}>
                        <button className="rqQckBtn">메뉴열기</button>
                    </div>
                );
            }
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

        let linkSDMS = <Link to="/sdms" target="_blank">{i18n.t('menu.3D관제화면')}</Link>;
        let linkSOPSimulator = <Link to={ProjectResource.path.sopSimulator} target="_blank">{i18n.t('menu.SOP')}</Link>;
        let linkSOPManager = <Link to={ProjectResource.path.sopManager} target="_blank">{i18n.t('menu.SOP 편집')}</Link>;
        let linkTeamEditor = <Link to={ProjectResource.path.teamEditor} target="_blank">{i18n.t('menu.조직관리')}</Link>;
        let linkDashBoard = <Link to={ProjectResource.path.dashboard} target="_blank">{i18n.t('menu.대시보드')}</Link>;
        let linkHistory = <Link to={ProjectResource.path.history} target="_blank">{i18n.t('menu.이력')}</Link>;

        if (path === ProjectResource.path.sdms) {
            linkSDMS = <a>{i18n.t('menu.3D관제화면')}</a>;
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

        // 경기 inline-css
        if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            linkSDMS = <Link to="/sdms" target="_blank" style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.3D관제화면')}</Link>;
            linkSOPSimulator = <Link to={ProjectResource.path.sopSimulator} target="_blank" style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.SOP')}</Link>;
            linkSOPManager = <Link to={ProjectResource.path.sopManager} target="_blank" style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.SOP 편집')}</Link>;
            linkTeamEditor = <Link to={ProjectResource.path.teamEditor} target="_blank" style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.조직관리')}</Link>;
            linkDashBoard = <Link to={ProjectResource.path.dashboard} target="_blank" style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.대시보드')}</Link>;
            linkHistory = <Link to={ProjectResource.path.history} target="_blank" style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.이력')}</Link>;
    
            if (path === ProjectResource.path.sdms) {
                linkSDMS = <a style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.3D관제화면')}</a>;
            } else if (path === ProjectResource.path.sopSimulator) {
                linkSOPSimulator = <a style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.SOP')}</a>;
            } else if (path === ProjectResource.path.sopManager) {
                linkSOPManager = <a style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.SOP 편집')}</a>;
            } else if (path === ProjectResource.path.teamEditor) {
                linkTeamEditor = <a style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.조직관리')}</a>;
            } else if (path === ProjectResource.path.dashboard) {
                linkDashBoard = <a style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.대시보드')}</a>;
            } else if (path === ProjectResource.path.history) {
                linkHistory = <a style={{ display: 'block', color: '#fff', textAlign: 'center', fontSize: '13px', height: '30px', lineHeight: '30px', overFlow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{i18n.t('menu.이력')}</a>;
            }
        }

        const userAuthor = ProjectResource.getUserAuthor();


        let adminLink = null;
        let userLink = null;

        let securityLink = (<React.Fragment>
        </React.Fragment>);
        let ceoLink = (<React.Fragment>
        </React.Fragment>);

        if (ProjectResource.SiteID === ProjectResource.Site.SUJAIN || ProjectResource.SiteID === ProjectResource.Site.Magog) {
            // 대시보드 제외
            adminLink = (<React.Fragment>
                <li>{sdms}{linkSDMS}</li>
                <li>{teamEdit}{linkTeamEditor}</li>
                <li>{sop}{linkSOPSimulator}</li>
                <li>{sopMgr}{linkSOPManager}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

            userLink = (<React.Fragment>
                <li>{sdms}{linkSDMS}</li>
                <li>{teamEdit}{linkTeamEditor}</li>
                <li>{sop}{linkSOPSimulator}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

        } else if (ProjectResource.SiteID === ProjectResource.Site.Tlb) {
            // 대시보드, 3D 제외
            adminLink = (<React.Fragment>                
                <li>{sop}{linkSOPSimulator}</li>
                <li>{sopMgr}{linkSOPManager}</li>
                <li>{teamEdit}{linkTeamEditor}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

            userLink = (<React.Fragment>
                <li>{sop}{linkSOPSimulator}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

        } else if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
            // 대시보드 제외
            adminLink = (<React.Fragment>                
                <li>{teamEdit}{linkTeamEditor}</li>
                <li>{sop}{linkSOPSimulator}</li>
                <li>{sopMgr}{linkSOPManager}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

            userLink = (<React.Fragment>
                <li>{sop}{linkSOPSimulator}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

        } else if (ProjectResource.SiteID === ProjectResource.Site.CheongSim) {
            adminLink = (<React.Fragment>
                <li>{sdms}{linkSDMS}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

            userLink = (<React.Fragment>
                <li>{sdms}{linkSDMS}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

        } else if (userInfo && userInfo.siteID >= ProjectResource.Site.GG_B && userInfo.siteID <= ProjectResource.Site.GG_H) {
            // 대시보드 제외
            adminLink = (<React.Fragment>                
                <li style={{ position: 'relative' }}>{sdms}{linkSDMS}</li>
                <li style={{ position: 'relative' }}>{teamEdit}{linkTeamEditor}</li>
                <li style={{ position: 'relative' }}>{sop}{linkSOPSimulator}</li>
                <li style={{ position: 'relative' }}>{sopMgr}{linkSOPManager}</li>
                <li style={{ position: 'relative' }}>{history}{linkHistory}</li>
            </React.Fragment>);

            userLink = (<React.Fragment>
                <li style={{ position: 'relative' }}>{sdms}{linkSDMS}</li>
                <li style={{ position: 'relative' }}>{teamEdit}{linkTeamEditor}</li>
                <li style={{ position: 'relative' }}>{sop}{linkSOPSimulator}</li>
                <li style={{ position: 'relative' }}>{sopMgr}{linkSOPManager}</li>
                <li style={{ position: 'relative' }}>{history}{linkHistory}</li>
            </React.Fragment>);

        } else {
            adminLink = (<React.Fragment>
                <li>{sdms}{linkSDMS}</li>
                <li>{teamEdit}{linkTeamEditor}</li>
                <li>{dashboard}{linkDashBoard}</li>
                <li>{sop}{linkSOPSimulator}</li>
                <li>{sopMgr}{linkSOPManager}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);

            userLink = (<React.Fragment>
                <li>{sdms}{linkSDMS}</li>
                <li>{teamEdit}{linkTeamEditor}</li>
                <li>{dashboard}{linkDashBoard}</li>
                <li>{sop}{linkSOPSimulator}</li>
                <li>{history}{linkHistory}</li>
            </React.Fragment>);
        }


        if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
            securityLink = (<React.Fragment>
                <li>{dashboard}{linkDashBoard}</li>
            </React.Fragment>);

            ceoLink = (<React.Fragment>
                <li>{sdms}{linkSDMS}</li>
                <li>{dashboard}{linkDashBoard}</li>
            </React.Fragment>);
        }


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
        } else if (userAuthor === AccountResource.accountLevelID.wonikSecurity) {
            linkMenuUI.push(
                <React.Fragment key={"linkSecurity"}>
                    {securityLink}
                </React.Fragment>
            );
        } else if (userAuthor === AccountResource.accountLevelID.wonikCEO ||
            userAuthor === AccountResource.accountLevelID.wonikSafety ||
            userAuthor === AccountResource.accountLevelID.wonikSafeAdmin) {
            linkMenuUI.push(
                <React.Fragment key={"linkCEO"}>
                    {ceoLink}
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

    onClickAccountMgr = () => {
        if (ProjectResource.SiteID === ProjectResource.Site.CheongSim) {
            return this.showConfirmDialog("[INFO]", "지원하지 않는 기능입니다.", ["확인"], this.onCloseConfirmDialog, this.onCloseConfirmDialog);
        }
        this.setState({ popupOpen: true });
    }

    onClickClosePopup = (value) => {
        this.setState({ popupOpen: value });
        //this.state.popupOpen = value;
        //this.props.close(value);
    }

    settingOff = () => {
        this.setState({ settingOnOff: false });
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

    handleTooltip = (e, content) => {
        const target = e.target;
        const parent = e.target.parentElement;

        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > div.width &&
        if(targetNode.width > parentNode.width) {

            this.setState({
                tooltip: {
                    show: !this.state.tooltip.show,
                    top: parentNode.top + 55,
                    left: parentNode.left,
                    content: content
                }
            });
        }
    }

    handleUserMenu = (e) => {
        if (e.target.classList.contains('on')) {
            e.target.classList.remove('on');
        }
        else {
            e.target.classList.add('on');
        }
    }

    getUserInfo() {
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

            let adminIconArea = null;
            if (ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen) {
                adminIconArea = (<>
                    <li className="adminIconAreaLi">{i18n.t('account.로그아웃')}<a onClick={this.onClickLogout} title={i18n.t('account.로그아웃')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen ? UlogoutHydrogen : Ulogout} alt={i18n.t('account.로그아웃')} className="AlogoutHydrogen" title={i18n.t('account.로그아웃')} /></a></li>
                </>);
            } else if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                // 경기 inline-css
                adminIconArea = (<>
                    <li style={{ float: 'left', width: '33.3%', background: '#1A212E' }}><a style={{ display: 'block', height: '24px', lineHeight: '24px', color: '#fff', fontSize: '11px', background: '#1A212E', letterSpacing: '-0.1em' }} id={'rqUsrLiA'} onClick={this.onClickAccountMgr} title={i18n.t('account.사용자 관리')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UmanagementWonik : Umanagement} alt={i18n.t('account.사용자 관리')} className="Amanagement" style={{ width: '18px', height: '12px', marginLeft: '3px', marginTop: '6px', display: 'inline-block', objectFit: 'none' }} title={i18n.t('account.사용자 관리')} /></a></li>
                    <li style={{ float: 'left', width: '33.3%', background: '#1A212E' }}><a style={{ display: 'block', height: '24px', lineHeight: '24px', color: '#fff', fontSize: '11px', background: '#1A212E', letterSpacing: '-0.1em' }} onClick={this.onClickChangePwd} title={i18n.t('account.비밀번호 변경')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UpasswordWonik : Upassword} alt={i18n.t('account.비밀번호 변경')} className="Apassword" style={{ width: '15px', height: '14px', marginLeft: '1px', marginTop: '5px', display: 'inline-block', objectFit: 'none' }} title={i18n.t('account.비밀번호 변경')} /></a></li>
                    <li style={{ float: 'left', width: '33.3%', background: '#1A212E' }}><a style={{ display: 'block', height: '24px', lineHeight: '24px', color: '#fff', fontSize: '11px', background: '#1A212E', letterSpacing: '-0.1em' }} onClick={this.onClickLogout} title={i18n.t('account.로그아웃')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UlogoutWonik : Ulogout} alt={i18n.t('account.로그아웃')} className="Alogout" style={{ width: '12px', height: '14px', marginLeft: '3px', marginTop: '5px', display: 'inline-block' }} title={i18n.t('account.로그아웃')} /></a></li>
                </>);
            } else {
                adminIconArea = (<>
                    <li><a onClick={this.onClickAccountMgr} title={i18n.t('account.사용자 관리')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UmanagementWonik : Umanagement} alt={i18n.t('account.사용자 관리')} className="Amanagement" title={i18n.t('account.사용자 관리')} /></a></li>
                    <li><a onClick={this.onClickChangePwd} title={i18n.t('account.비밀번호 변경')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UpasswordWonik : Upassword} alt={i18n.t('account.비밀번호 변경')} className="Apassword" title={i18n.t('account.비밀번호 변경')} /></a></li>
                    <li><a onClick={this.onClickLogout} title={i18n.t('account.로그아웃')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UlogoutWonik : Ulogout} alt={i18n.t('account.로그아웃')} className="Alogout" title={i18n.t('account.로그아웃')} /></a></li>
                </>);
            }

            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                // 경기 inline-css
                return (
                    <div 
                        className="rqBtnGG" 
                        style={{ 
                            float: 'left', 
                            position: 'relative', 
                            marginRight: '20px', 
                            order: '1' 
                        }}
                    >
                        <button 
                            className="rqUsrBtnGG" 
                            onClick={(e) => this.handleUserMenu(e)}
                            style={{ 
                                display: 'block', 
                                height: '22px', 
                                background: 'none', 
                                color:'#9397a1', 
                                cursor: 'pointer', 
                                position: 'relative', 
                                top: '-1px' 
                            }}
                        >
                            <img 
                                src={userIcon} 
                                alt="" 
                                style={{ 
                                    display: 'inline-block', 
                                    verticalAlign: 'middle', 
                                    width: '22px', 
                                    height: '22px' 
                                }}
                            />
                            <span 
                                className="rqUsrSpanGG"
                                style={{ 
                                    margin: '10px', 
                                    fontSize: '14px', 
                                    fontWeight: 'bold'
                                }}
                            >
                                <p 
                                    style={{ 
                                        display: 'inline-block', 
                                        marginRight: '10px', 
                                        width: '60px', 
                                        whiteSpace: 'nowrap', 
                                        textOverflow: 'ellipsis', 
                                        overflow: 'hidden', 
                                        position: 'relative', 
                                        top: '4px' 
                                    }}
                                >
                                    {userName}
                                </p>
                                <img 
                                    src={arrowIcon} 
                                    alt="" 
                                    style={{ 
                                        display: 'inline-block', 
                                        verticalAlign: 'middle',
                                        width: '7px', 
                                        height: '4px' 
                                    }} 
                                />
                            </span>
                        </button>
                        <div 
                            style={{ 
                                display: 'none', 
                                position: 'absolute', 
                                width: '100px', 
                                top: '100%', 
                                left: '81%', 
                                marginTop: '14px', 
                                marginLeft: '-83px',
                                background: '#0E162D', 
                                textAlign: 'center', 
                                border: 'solid 1px #272e41', 
                                overflow: 'hidden', 
                                borderRadius: '4px 4px 8px 8px',
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <em 
                                className="adminProfile" 
                                style={{ 
                                    display: 'none', 
                                    width: '44px', 
                                    height: '44px', 
                                    border: 'solid 2px #75D61C', 
                                    margin: '10px auto', 
                                    backgroundSize: 'cover',
                                    textIndent: '-9999px', 
                                    borderRadius: '50%', 
                                    backgroundImage: `url(${rqProfile})` 
                                }}
                            >
                                프로필사진
                            </em>
                            <span 
                                style={{ 
                                    display: 'block', 
                                    color: '#5398FF', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    marginTop: '20px', 
                                    marginBottom: '4px'
                                }} 
                            >
                                {userLevel}
                            </span>
                            <span 
                                // className="adminUserName" 
                                style={{ 
                                    color: '#fff', 
                                    fontSize: '16px !important', 
                                    textAlign: 'center', 
                                    padding: '0 5px', 
                                    cursor: 'default'
                                }}
                                onMouseOver={(e) => this.handleTooltip(e, userName)}
                                onMouseLeave={() => this.setState({ tooltip:{show: false} })}
                            >
                                {userName}
                            </span>
                            
                            <ul 
                                className="adminIconArea" 
                                style={{ 
                                    display: 'block', 
                                    marginTop: '20px' 
                                }}
                            >
                                { adminIconArea }
                            </ul>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className={"rqUsr rqBtn"}>
                        <button className="rqUsrBtn">
                            <span className="rqUsrSpan"><p>{userName}</p></span>
                            {
                                ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                                <p className="rqContectNation">{this.getDate()}</p>
                            }
                        </button>
                        <div>
                            <em className="adminProfile">프로필사진</em>
                            <span onClick={() => this.onChangeLanguage()}>{userLevel}</span>
                            <p className="adminUserName">{userName}</p>
                            {
                                ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                                <p className="adminContectNation" onClick={() => this.onChangeLanguage2()}>{this.getDate()}</p>
                            }
                            <ul className="adminIconArea">
                                { adminIconArea }
                            </ul>
                        </div>
                    </div>
                );
            }
        } else {
            // 경기 inline-css
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                return (
                    <div
                        className="rqBtnGG" 
                        style={{
                            float: "left",
                            position: "relative",
                            marginRight: "20px",
                            order: "1",
                        }}
                    >
                        <button
                            className="rqUsrBtnGG"
                            style={{
                                display: "block",
                                height: "22px",
                                background: "none",
                                color: "#9397a1",
                                cursor: "pointer",
                                position: "relative",
                                top: "-1px",
                            }}
                        >
                            <img
                                src={userIcon}
                                alt=""
                                style={{
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                    width: "22px",
                                    height: "22px",
                                }}
                            />
                            <span
                                className="rqUsrSpanGG"
                                style={{
                                    margin: "10px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                <p
                                    style={{
                                        display: "inline-block",
                                        marginRight: "10px",
                                        width: "60px",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        position: "relative",
                                        top: "4px",
                                    }}
                                >
                                    {userName}
                                </p>
                                <img
                                    src={arrowIcon}
                                    alt=""
                                    style={{
                                        display: "inline-block",
                                        verticalAlign: "middle",
                                        width: "7px",
                                        height: "4px",
                                    }}
                                />
                            </span>
                        </button>
                        <div
                            style={{
                                display: "none",
                                position: "absolute",
                                width: "100px",
                                top: "100%",
                                left: "81%",
                                marginTop: "14px",
                                marginLeft: "-83px",
                                background: "#0E162D",
                                textAlign: "center",
                                border: "solid 1px #272e41",
                                overflow: 'hidden', 
                                borderRadius: "4px 4px 8px 8px",
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <em
                                className="adminProfile"
                                style={{
                                    display: "none",
                                    width: "44px",
                                    height: "44px",
                                    border: "solid 2px #75D61C",
                                    margin: "10px auto",
                                    backgroundSize: "cover",
                                    textIndent: "-9999px",
                                    borderRadius: "50%",
                                    backgroundImage: `url(${rqProfile})`,
                                }}
                            >
                                프로필사진
                            </em>
                            <span
                                style={{
                                    display: "block",
                                    color: "#5398FF",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    marginTop: "20px",
                                    marginBottom: "4px",
                                }}
                            >
                                {userLevel}
                            </span>
                            <span
                                style={{
                                    color: "#fff",
                                    fontSize: "16px !important",
                                    textAlign: "center",
                                    padding: '0 5px', 
                                    cursor: 'default'
                                }}
                                onMouseOver={(e) => this.handleTooltip(e, userName)}
                                onMouseLeave={() => this.setState({ tooltip:{show: false} })}
                            >
                                {userName}
                            </span>

                            <ul 
                                style={{ 
                                    display: "block", 
                                    marginTop: "20px" 
                                }}
                            >
                                <li
                                    className="rqli"
                                    style={{
                                        float: "left",
                                        width: "50%",
                                        background: "#1A212E",
                                    }}
                                >
                                    <a
                                        style={{
                                            display: "block",
                                            height: "24px",
                                            lineHeight: "24px",
                                            color: "#fff",
                                            fontSize: "11px",
                                            background: "#1A212E",
                                            letterSpacing: "-0.1em",
                                        }}
                                        onClick={this.onClickChangePwd}
                                        title={i18n.t("account.비밀번호 변경")}
                                    >
                                        <img
                                            src={
                                                    ProjectResource.styleMode ===
                                                    ProjectResource.StyleType.Wonik ||
                                                    ProjectResource.styleMode ===
                                                    ProjectResource.StyleType.Gyeonggi
                                                    ? UpasswordWonik
                                                    : Upassword
                                                }
                                            style={{
                                                width: "15px",
                                                height: "14px",
                                                marginLeft: "1px",
                                                marginTop: "5px",
                                                display: "inline-block",
                                                objectFit: "none",
                                            }}
                                            alt={i18n.t("account.비밀번호 변경")}
                                            className="Apassword"
                                            title={i18n.t("account.비밀번호 변경")}
                                        />
                                    </a>
                                </li>
                                <li
                                    className="rqli"
                                    style={{
                                        float: "left",
                                        width: "50%",
                                        background: "#1A212E",
                                    }}
                                >
                                    <a
                                        style={{
                                            display: "block",
                                            height: "24px",
                                            lineHeight: "24px",
                                            color: "#fff",
                                            fontSize: "11px",
                                            background: "#1A212E",
                                            letterSpacing: "-0.1em",
                                        }}
                                        onClick={this.onClickLogout}
                                        title={i18n.t("account.로그아웃")}
                                    >
                                        <img
                                            src={
                                                ProjectResource.styleMode ===
                                                ProjectResource.StyleType.Wonik ||
                                                ProjectResource.styleMode ===
                                                ProjectResource.StyleType.Gyeonggi
                                                ? UlogoutWonik
                                                : Ulogout
                                            }
                                            alt={i18n.t("account.로그아웃")}
                                            className="Alogout"
                                            style={{
                                                width: "12px",
                                                height: "14px",
                                                marginLeft: "3px",
                                                marginTop: "5px",
                                                display: "inline-block",
                                            }}
                                            title={i18n.t("account.로그아웃")}
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div /* className="rqUsr rqBtn user" */ className={"rqUsr rqBtn"}>
                        <button className="rqUsrBtn"><span className="rqUsrSpan"><p>{userName}</p></span></button>
                        <div>
                            <em className="adminProfile">프로필사진</em>
                            <span>{userLevel}</span>
                            <p>{userName}</p>
                            <ul>
                                {/* <li className="rqli" title="비밀번호 변경"><a onClick={this.onClickChangePwd}><img src={Upassword} alt="비밀번호 변경" className="Upassword" title="비밀번호 변경" /></a></li>
                                <li className="rqli" title="로그아웃"><a onClick={this.onClickLogout}><img src={Ulogout} alt="로그아웃" className="Ulogout" title="로그아웃" /></a></li> */}
                                <li className="rqli"><a onClick={this.onClickChangePwd} title={i18n.t('account.비밀번호 변경')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UpasswordWonik : Upassword} alt={i18n.t('account.비밀번호 변경')} className="Apassword" title={i18n.t('account.비밀번호 변경')} /></a></li>
                                <li className="rqli"><a onClick={this.onClickLogout} title={i18n.t('account.로그아웃')}><img src={ProjectResource.styleMode === ProjectResource.StyleType.Wonik || ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi ? UlogoutWonik : Ulogout} alt={i18n.t('account.로그아웃')} className="Alogout" title={i18n.t('account.로그아웃')} /></a></li>
                            </ul>
                        </div>
                    </div>
                );
            }
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

        if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
            return <h1 className="rqLogo" onClick={() => this.onClickLogo()}>{home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.GCC) {
            return <h1 className="rqLogoGC" onClick={() => this.onClickLogo()}>{home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.SUJAIN) {
            return <h1 className="rqLogoSujain" onClick={() => this.onClickLogo()}>{home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
            return <h1 className="rqLogoWonik" onClick={() => this.onClickLogo()}>{home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.SENKO) {
            return <h1 className="rqLogoSenko" onClick={() => this.onClickLogo()}>{home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
            return <h1 className="rqLogoHydrogen" onClick={() => this.onClickLogo()}>{home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.Tlb) {
            return <h1 className="rqLogoTlb" onClick={() => this.onClickLogo()}>{home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            return <h1 
                        className="rqLogoGG" 
                        style={{ 
                            display: 'inline-block',
                            float: 'left',
                            width: '63px',
                            height: '24px',
                            marginRight: '20px',
                            background: `url(${rqLogoGyeonggi}) center 1px / 100% no-repeat`,
                            cursor: `${this.state.isEditMode ? 'default' : 'pointer'}`
                        }}
                        onClick={() => this.onClickLogo()}
                    >
                        {home}</h1>
        } else if (ProjectResource.SiteID === ProjectResource.Site.Magog) {
            return <h1 className="rqLogoMagog" onClick={() => this.onClickLogo()}>{home}</h1>
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

    onClickChangePwd = () => {
        this.setState({ opneChangePwd: true});
    }

    onClickCloseChangePwd = () => {
        this.setState({ opneChangePwd: false });
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

        let unit = "오전";
        let hours = date.getHours();
        if (hours < 10)
            hours = "0" + hours;
        else if (hours > 11) {
            unit = "오후";
    
            if (hours > 12) {
                hours = hours - 12;
        
                if (hours < 10) {
                    hours = "0" + hours;
                }
            }
        }

        let minutes = date.getMinutes();
        if (minutes < 10)
            minutes = "0" + minutes;

        displayTime = year + "-" + month + "-" + day + "(" + dayString + ") " + unit + " " + hours + ":" + minutes;

        if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
            return null;
        } else if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
            return displayTime;
        } else if (ProjectResource.SiteID === ProjectResource.Site.GCC) {
            return displayTime;
        } else if (ProjectResource.SiteID === ProjectResource.Site.SUJAIN) {
            return displayTime;
        } else if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
            return displayTime;
        } else if (ProjectResource.SiteID === ProjectResource.Site.SENKO) {
            return displayTime;
        } else if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            return displayTime;
        }
    }

    render() {        
        return (
            <>
                {
                    this.state.tooltip.show &&
                    <div 
                        style={{ 
                            top: this.state.tooltip.top, 
                            left: this.state.tooltip.left,
                            position: 'absolute',
                            padding: '5px',
                            background: '#000',
                            color: '#fff',
                            fontSize: '12px',
                            borderRadius: '2px',
                            zIndex: 9999,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {this.state.tooltip.content}
                    </div>
                }      
                <TitleBar className="rqMenu" $isEditMode={this.state.isEditMode}>
                    <div className="rqLogoWrap">
                    {
                        this.getLogo()
                    }
                        <span>
                            {
                                this.getDisplayTime()
                            }
                        </span>
                    </div>
                    {/* 경기 inline-css */}
                    <div className="rqBtnWrap" style={ProjectResource.SiteID === ProjectResource.Site.GG_A ? { position: 'absolute', right: '0', top: '16px', marginRight: '40px', display: 'flex', flexDirection: 'row', alignItems: 'center' } : {}}>
                        {
                            this.getTargetMenus()
                        }

                        {
                            // 경기 inline-css
                            (ProjectResource.SiteID === ProjectResource.Site.GG_A) ?
                                <div className={"rqApp rqBtn"} style={{ float: 'left', position: 'relative', marginRight: '20px', order: '2', padding: '0 20px', height: '17px', borderLeft: '1px solid var(--middle-gray-color)', borderRight: '1px solid var(--middle-gray-color)', cursor: 'pointer' }}>
                                    <button className="rqAppBtn" style={{ display: 'block', width: '20px', height: '20px', cursor: 'pointer', textIndent: '-9999px', backgroundImage: `url(${menuIcon})`, position: 'relative', top: '-1px' }}>메뉴열기</button>
                                    <ul style={{ display: 'none', position: 'absolute', top: '100%', left: '50%', width: '110px', marginTop: '16px', marginLeft: '-55px', padding: '10px 0', background: '#0e162d', border: '1px solid rgb(39, 46, 65)', borderRadius: '4px' }}>
                                        { this.getLinkMenu() }
                                    </ul>
                                </div> :
                                <div className={"rqApp rqBtn"}>
                                    <button className="rqAppBtn">메뉴열기</button>
                                    <ul>
                                        { this.getLinkMenu() }
                                    </ul>
                                </div>
                        }
                        
                        { this.getUserInfo() }
                        {ProjectResource.SiteID !== ProjectResource.Site.CheongSim &&
                            <a onClick={this.onClickSetting} className="rqStng">{this.getSettingKey()}</a>
                        }
                        {
                            ProjectResource.styleMode === ProjectResource.StyleType.Wonik &&
                                <CampusBar
                                    selectSiteID={this.state.selectSiteID}
                                    onClickSite={this.onClickSite}
                                />
                        }
                        {
                            ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi &&
                                <CampusBar
                                    selectSiteID={this.state.selectSiteID}
                                    onClickSite={this.onClickSite}
                                    isEditMode={this.state.isEditMode}
                                />
                        }
                    </div>
                </TitleBar>
                
                { this.getTitleNameUI() }

                {
                    (this.state.popupOpen && ProjectResource.SiteID === ProjectResource.Site.GG_A) &&
                        <AccountManagerGG onClickClosePopup={this.onClickClosePopup} />
                }
                {
                    /*<DisplayPopup open={this.state.popupOpen} mode={AccountResource.popupMode.사용자_권한_관리} onClickClosePopup={this.onClickClosePopup} />*/
                    (this.state.popupOpen && ProjectResource.SiteID !== ProjectResource.Site.GG_A) &&
                        <AccountManagerNew onClickClosePopup={this.onClickClosePopup} />
                }

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
                    <AccountChangePwd onClickCloseChangePwd={this.onClickCloseChangePwd} />
                }

                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </>
		);
	}
}

export default withRouter(withTranslation()(TitleBarSB));


class DisplayPopup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            popupMode: null,

            regulars: null,             // 부서
            accountLevels: null,        // 권한
            accountUsers: null,         // 유저 리스트

            removeAccountUsers: [],     // 삭제된 리스트
        }

        this.props = props;
        this.init();
    }

    async init() {
        const userInfo = await ProjectResource?.initUserInfo();

        let siteID = null;

        if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            userInfo?.siteID) {
            siteID = userInfo.siteID;
        } else if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            ProjectResource?.SiteID) {
            siteID = ProjectResource.SiteID;
        }
    
        const accountLevels = await AccountController.getAccountLevels();
        const regulars = await TeamEditController.DisplayBasicRegular(siteID);
        let accountUsers = await AccountController.getAccountUsers(siteID);

        this.setState({ regulars: regulars, accountLevels: accountLevels, accountUsers: accountUsers });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            // 외부에서 열고 닫았을때
            this.setState({ open: this.props.open, popupMode: this.props.mode });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        //console.log('componentWillUpdate');

        if (nextProps.open !== this.props.open && nextProps.open === true) {
            this.state.removeAccountUsers = [];
            this.reload();
        }
    }

    onClickClosePopup = (value) => {
        this.setState({ open: value });
        this.props.onClickClosePopup(value);

        return;
    }

    onClickCancle = () => {
        this.state.popupMode = AccountResource.popupMode.사용자_권한_관리

        this.reload();
    }

    onClickRegister = () => {
        this.setState({ popupMode: AccountResource.popupMode.사용자_권한_등록 });
    }

    onClickConfirm = () => {
        this.setState({ popupMode: AccountResource.popupMode.사용자_권한_관리 });

        this.reload();
    }

    onChangeReload = () => {
        this.reload();
    }

    async reload() {
        const userInfo = await ProjectResource?.initUserInfo();

        let siteID = null;

        if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            userInfo?.siteID) {
            siteID = userInfo.siteID;
        } else if (userInfo?.levelID !== AccountResource.accountLevelID.master &&
            ProjectResource?.SiteID) {
            siteID = ProjectResource.SiteID;
        }

        const accountUsers = await AccountController.getAccountUsers(siteID);
        const regulars = await TeamEditController.DisplayBasicRegular(siteID);

        this.setState({ regulars: regulars, accountUsers: accountUsers });
    }

    render() {
        if (this.state.open === true && this.state.popupMode === AccountResource.popupMode.사용자_권한_관리) {
            return <AccountManager onClickClosePopup={this.onClickClosePopup} onClickRegister={this.onClickRegister} onChangeReload={this.onChangeReload} regulars={this.state.regulars} accountLevels={this.state.accountLevels} accountUsers={this.state.accountUsers} removeAccountUsers={this.state.removeAccountUsers} />;
        } else if (this.state.open === true && this.state.popupMode === AccountResource.popupMode.사용자_권한_등록) {
            return <AccountRegister onClickClosePopup={this.onClickClosePopup} onClickCancle={this.onClickCancle} onClickConfirm={this.onClickConfirm} regulars={this.state.regulars} accountLevels={this.state.accountLevels} accountUsers={this.state.accountUsers} removeAccountUsers={this.state.removeAccountUsers} />;
        } else {
            return null;
        }
    }
}

class CampusBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showSites: false
        }

        this.wrapperRef = React.createRef();
    }

    async componentDidMount() {
        const userInfo = await ProjectResource?.initUserInfo();
        if (userInfo && userInfo.siteID >= ProjectResource.Site.GG_A && userInfo.siteID <= ProjectResource.Site.GG_H) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }
    
    componentWillUnmount() {
        const userInfo = ProjectResource?.getUserInfo();
        if (userInfo && userInfo.siteID >= ProjectResource.Site.GG_A && userInfo.siteID <= ProjectResource.Site.GG_H) {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.current?.contains(event.target)) {
            this.setState({ showSites: false });
        }
    };

    getSelectedSiteName = (selectSiteID) => {
        let siteName = '';
        const sites = ProjectResource?.sites;

        if (selectSiteID && sites) {
            const selectedSite = sites.find(site => site.id === selectSiteID);
            siteName = selectedSite.siteName.trim();
        }
        return siteName;
    }

    onClickSite = (siteID) => {
        this.props.onClickSite(siteID);
        this.setState({ showSites: false });
    }

    handleMouseEnter = (className) => {
        if (className === 'allBtn') {
            this.setState({ isGGallBtnHovered: true });
        }
    };
    
    handleMouseLeave = (className) => {
        if (className === 'allBtn') {
            this.setState({ isGGallBtnHovered: false });
        }
    };

    displaySite = () => {
        const selectSiteID = this.props.selectSiteID;
        const sites = ProjectResource?.sites;
        const userInfo = ProjectResource?.getUserInfo();
        const path = window.location.pathname;
        
        let titleUI = null;
        let selectSiteUI = [];
        let selectSiteUI_GG = [];
        let displaySiteUI = null;
        
        // 경로에 따른 title 확인
        // SOP, SOPMgr, 조직관리, 이력관리 >> 메뉴 표시
        // SDMS >> 사이트 명 표시
        // 대시보드 표시 없음
        if (path === ProjectResource.path.sopSimulator) {
            titleUI = ProjectResource.menu.sopSimulator;
        } else if (path === ProjectResource.path.sopManager) {
            titleUI = ProjectResource.menu.sopManager;
        } else if (path === ProjectResource.path.teamEditor) {
            titleUI = ProjectResource.menu.teamEditor;
        } else if (path === ProjectResource.path.history) {
            titleUI = ProjectResource.menu.history;
        } else if (path === ProjectResource.path.sdms) {
            titleUI = ProjectResource.menu.sdms;
        }
        
        // selectSiteUI
        // SDMS, SOPMgr, 조직관리, 이력관리 표시
        // 대시보드, SOP 표시 없음
        // 경기 -> SOP까지 표시
        if (path === ProjectResource.path.sopManager ||
            path === ProjectResource.path.teamEditor ||
            path === ProjectResource.path.history ||
            path === ProjectResource.path.sdms||
            (path === ProjectResource.path.sopSimulator && ProjectResource.SiteID === ProjectResource.Site.GG_A)) {

            if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
                if (sites.length > 1
                    && (userInfo?.levelID === AccountResource.accountLevelID.master
                    || userInfo?.levelID === AccountResource.accountLevelID.wonikCEO
                    || userInfo?.levelID === AccountResource.accountLevelID.wonikSafety
                    || userInfo?.levelID === AccountResource.accountLevelID.wonikSafeAdmin)) {
                    if (selectSiteID === ProjectResource.Site.Wonik_A) {
                        selectSiteUI.push(<li key={"selectSiteUI_on_" + ProjectResource.Site.Wonik_A} className='on'>캠퍼스A</li>);
                    } else {
                        selectSiteUI.push(<li key={"selectSiteUI_" + ProjectResource.Site.Wonik_A} onClick={() => this.props.onClickSite(ProjectResource.Site.Wonik_A)}>캠퍼스A</li>);
                    }
                    if (selectSiteID === ProjectResource.Site.Wonik_C) {
                        selectSiteUI.push(<li key={"selectSiteUI_on_" + ProjectResource.Site.Wonik_C} className='on'>캠퍼스C</li>);
                    } else {
                        selectSiteUI.push(<li key={"selectSiteUI_" + ProjectResource.Site.Wonik_C} onClick={() => this.props.onClickSite(ProjectResource.Site.Wonik_C)}>캠퍼스C</li>);
                    }
                    if (selectSiteID === ProjectResource.Site.Wonik) {
                        selectSiteUI.push(<li key={"selectSiteUI_on_" + ProjectResource.Site.Wonik} className='on'>캠퍼스H</li>);
                    } else {
                        selectSiteUI.push(<li key={"selectSiteUI_" + ProjectResource.Site.Wonik} onClick={() => this.props.onClickSite(ProjectResource.Site.Wonik)}>캠퍼스H</li>);
                    }
                    if (selectSiteID === ProjectResource.Site.Wonik_S) {
                        selectSiteUI.push(<li key={"selectSiteUI_on_" + ProjectResource.Site.Wonik_S} className='on'>캠퍼스S</li>);
                    } else {
                        selectSiteUI.push(<li key={"selectSiteUI_" + ProjectResource.Site.Wonik_S} onClick={() => this.props.onClickSite(ProjectResource.Site.Wonik_S)}>캠퍼스S</li>);
                    }
                    if (selectSiteID === ProjectResource.Site.Wonik_V) {
                        selectSiteUI.push(<li key={"selectSiteUI_on_" + ProjectResource.Site.Wonik_V} className='on'>캠퍼스V</li>);
                    } else {
                        selectSiteUI.push(<li key={"selectSiteUI_" + ProjectResource.Site.Wonik_V} onClick={() => this.props.onClickSite(ProjectResource.Site.Wonik_V)}>캠퍼스V</li>);
                    }
                }
            }
            else if(userInfo?.siteID === ProjectResource.Site.GG_A) { 
                for (let i = 0; i < sites?.length; i++) {
                    const siteData = sites[i];

                    // 복합 Site
                    if (siteData.id > 1000) {
                        continue;
                    }

                    // 경기 inline-css
                    selectSiteUI_GG.push(<li key={"selectSiteUI" + siteData.id} style={{ width: '100%', height: '26px', lineHeight: '26px', textAlign: 'center', letterSpacing: '0.3px', border: '0', borderRadius: '0', marginLeft: '0', fontSize: `14px !important`, color: '#fff', cursor: 'pointer' }} onClick={() => this.onClickSite(Number(siteData.id))}>{siteData.siteName}</li>);
                }

                if (path === ProjectResource.path.sdms) {
                    selectSiteUI_GG.shift();
                }
            } 
            else {
                for (let i = 0; i < sites?.length; i++) {
                    const siteData = sites[i];
                    
                    if (userInfo?.levelID !== AccountResource.accountLevelID.master && sites.length > 1)
                        continue;
                    
                    if (siteData.id === selectSiteID) {
                        selectSiteUI.push(<li key={"selectSiteUI_on_" + siteData.id} className='on'>{siteData.siteName}</li>);
                    } else {
                        selectSiteUI.push(<li key={"selectSiteUI_" + siteData.id} onClick={() => this.props.onClickSite(siteData.id)}>{siteData.siteName}</li>);
                    }
                }
            }
        }

        if (ProjectResource.SiteID === ProjectResource.Site.GG_A){
            // 경기 inline-css
            if (userInfo?.siteID === ProjectResource.Site.GG_A &&
                path === ProjectResource.path.sdms &&
                !this.props.isEditMode &&
                selectSiteID !== ProjectResource.Site.GG_A
            ) {
                displaySiteUI = <React.Fragment>
                    <div className='rqCampus' style={{ position: 'fixed', left: '50%', top: '15px', transform: `translate(-50%, 0)` }}>
                        <h5 style={{ color: '#5398FF', fontSize: '20px', fontWeight: '600' }}>{titleUI}</h5>
                    </div>
                    <div className='rqCampus_gg' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                        <button 
                            className='allBtn' 
                            onMouseEnter={() => this.handleMouseEnter('allBtn')}
                            onMouseLeave={() => this.handleMouseLeave('allBtn')}
                            style={{ 
                                width: '142px', 
                                height: '36px', 
                                background: this.state.isGGallBtnHovered ? `#5398FF` : `#525868`, 
                                borderRadius: '5px', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }} 
                            onClick={() => this.props.onClickSite(ProjectResource.Site.GG_A)}
                        >
                            <span style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>경기융합타운</span>
                        </button>
                        <button className={this.state.showSites ? 'leftBtn on' : 'leftBtn'} style={{ width: '175px', height: '36px', background: `#272E42 url(${gg_titlebar_select_arrow}) 95% 49% no-repeat`, border: '1px solid #525868', borderRadius: '5px', color: '#fff', fontSize: '14px', paddingLeft: '10px', paddingRight: '28px', cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={() => this.setState({ showSites: !this.state.showSites })}>
                            {this.getSelectedSiteName(selectSiteID)}
                        </button>
                        {
                            this.state.showSites ?
                                <ul className='on' style={{ display: 'block', width: '175px', background: '#0E162D', border: '1px solid #FFFFFF38', fontSize: '14px', position: 'absolute', top: '36px', right: '0' }}>
                                    {selectSiteUI_GG}
                                </ul> :
                                <ul style={{ display: 'none', width: '175px', background: '#0E162D', border: '1px solid #FFFFFF38', fontSize: '14px', position: 'absolute', top: '36px', right: '0' }}>
                                    {selectSiteUI_GG}
                                </ul>
                        }
                    </div>
                </React.Fragment>;
            }
            else if (userInfo?.siteID === ProjectResource.Site.GG_A &&
                    (path === ProjectResource.path.history || path === ProjectResource.path.sopSimulator)
            ) {
                displaySiteUI = <React.Fragment>
                    <div className='rqCampus' style={{ position: 'fixed', left: '50%', top: '15px', transform: `translate(-50%, 0)` }}>
                        <h5 style={{ color: '#5398FF', fontSize: '20px', fontWeight: '600' }}>{titleUI}</h5>
                    </div>
                    <div className='rqCampus_gg' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                        {
                            this.state.showSites ?
                            <button className='leftBtn on' style={{ width: '175px', height: '36px', background: `#272E42 url(${gg_titlebar_select_arrow}) 95% 49% no-repeat`, border: '1px solid #4F96FE', borderRadius: '5px', color: '#fff', fontSize: '14px', paddingLeft: '10px', paddingRight: '28px', cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={() => this.setState({ showSites: !this.state.showSites })}>
                                {this.getSelectedSiteName(selectSiteID)}
                            </button> :
                            <button className='leftBtn' style={{ width: '175px', height: '36px', background: `#272E42 url(${gg_titlebar_select_arrow}) 95% 49% no-repeat`, border: '1px solid #525868', borderRadius: '5px', color: '#fff', fontSize: '14px', paddingLeft: '10px', paddingRight: '28px', cursor: 'pointer', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={() => this.setState({ showSites: !this.state.showSites })}>
                                {this.getSelectedSiteName(selectSiteID)}
                            </button>
                        }

                        {
                            this.state.showSites ?
                                <ul className='on' style={{ display: 'block', width: '175px', background: '#0E162D', border: '1px solid #FFFFFF38', fontSize: '14px', position: 'absolute', top: '36px', right: '0' }}>
                                    {selectSiteUI_GG}
                                </ul> :
                                <ul style={{ display: 'none', width: '175px', background: '#0E162D', border: '1px solid #FFFFFF38', fontSize: '14px', position: 'absolute', top: '36px', right: '0' }}>
                                    {selectSiteUI_GG}
                                </ul>
                        }
                    </div>
                </React.Fragment>;
            }
            else {
                let siteName = this.getSelectedSiteName(userInfo?.siteID);

                if (userInfo?.siteID === ProjectResource.Site.GG_A) {
                    siteName = '경기융합타운';
                }

                displaySiteUI = <React.Fragment>
                    <div className='rqCampus' style={{ position: 'fixed', left: '50%', top: '15px', transform: `translate(-50%, 0)` }}>
                        <h5 style={{ color: '#5398FF', fontSize: '20px', fontWeight: '600' }}>{titleUI}</h5>
                    </div>
                    <p style={{ position: 'relative', top: '10px', width: '112px', userSelect: 'none' }}>{siteName}</p>
                </React.Fragment>;
            }
        }
        else {
            displaySiteUI = <React.Fragment>
                <div className='rqCampus'>
                    <h5>{titleUI}</h5>
                </div>
                <ul>
                    {selectSiteUI}
                </ul>
            </React.Fragment>;
        }

        return [displaySiteUI];
    }

    render() {
        const [displaySiteUI] = this.displaySite();

        return (
            <CampusBarComponent ref={this.wrapperRef}>
                {displaySiteUI}
            </CampusBarComponent>
        );
    }
}