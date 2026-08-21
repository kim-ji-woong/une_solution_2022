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
import newStyles from '../Common/css/newStyle.module.css';
import uneCommon from '../Common/css/uneCommon.module.css';
import dashboard from '../Dashboard/css/dashboardNew.module.css';

import logo from '../Common/image/common/logo.png';
import Ulogout from '../Common/img/common/user_logout.png';
import Umanagement from '../Common/img/common/user_management.png';
import Upassword from '../Common/img/common/user_password.png';
import $, { event } from 'jquery';
import SDMSMenuBtn from '../SDMS/ui/sdmsMenuBtn';
import SopSimulatorMenuBtn from '../SOPSimulator/ui/sopSimulatorMenuBtn';
import AccountManager from '../Account/ui/popups/accountManager';
import AccountRegister from '../Account/ui/popups/accountRegister';
import ConfirmDialog from '../Common/ui/confirmDialog';

import AccountResource from '../Account/resource/id';
import SettingResource from '../Settings/resource/id';
import RootResource from './resource/id';
import AccountStore from '../Account/accountStore';

import ProjectResource from './resource/id';
import SopController from '../SOPManager/services/sopController';

import AccountChangePwd from '../Account/ui/popups/accountChangePwd';

import SopSimulatorYeosuResource from '../SOPSimulatorYeosu/resource/id';
import SdmsResource from '../SDMS/resource/id';
import wsManager from '../SDMS/services/wsManager';
import ReportResource from '../Report/resource/id';



class TitleBar extends Component {
    static pathSDMS = '/sdms';
    //static pathSOPSimulatorYeosu = '/sop-simulatorYeosu';
    static pathSOPSimulatorYeosu = '/sop-simulator';
    static pathSOPManagerYeosu = '/sop-manager';
    static pathHistoryYeosu = '/historyYeosu';
    static pathTeamYeosu = '/teamYeosu';
    static pathReportYeosu = '/report';

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
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
            loading: true,
            reload: null,
        }

        this.props = props;

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SHORTCUT_KEY') {
                TitleBar.shortcutKey = data.shortcutKey;
            }
        }.bind(this));

        AccountStore.subscribe(function () {
            let data = AccountStore.getState();

            if (data.actionType === 'LOGIN_STATE') {
                this.checkLoginState(data);
            } else if (data.actionType === 'UPDATE_INFO') {
                this.reloadAccountInfo(data);
            }
        }.bind(this));

        this.initSiteID();

        this.wsMgr = this.props.wsMgr;

    }

	componentDidUpdate() {
		//console.log('componentDidUpdate');
	}

	componentDidMount() {
		//console.log('componentDidMount');

        // 센서 히스토리 감시 타이머 시작
        SDMSController.StartWatchTimer();
        SopSimulatorController.StartWatchTimer();
        SettingController.StartWatchTimer();


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
                $('.rqBtn > ul').hide();
                $('.rqBtn button').removeClass('on');
                $(this).next().show();
                $(this).addClass('on');
            }
        });

        // 메뉴 선택 시 닫힘
        $('.' + newStyles.rqQck + ' ul li').click(function (e) {
            $('.rqQckBtn').next().hide();
            $('.rqQckBtn').removeClass('on');
        });

        /* test */
        $('.' + newStyles.rqApp).click(function (e) {
            $('.' + newStyles.adminBox).hide();
            $('.' + newStyles.adminBox).removeClass('on');
        });

        $('.' + newStyles.rqAppText).click(function (e) {
            //$('.rqQckBtn').next().hide();
            $('.rqQckBtn').removeClass('on');
        });

        $(document).mouseup(function (e) {
            if ($('.rqBtn').has(e.target).length === 0) {
                $('.rqBtn > ul, .rqBtn > div').hide();
                $('.rqBtn button').removeClass('on');
            }
        });

        // 단축키 이벤트 리스너
        window.addEventListener("keydown", (e) => this.keysPressed(e, this), false);
        window.addEventListener("keyup", (e) => this.keysReleased(e, this), false);

    }

    keysPressed(e, target) {
        // store an entry for every key pressed
        TitleBar.keys[e.keyCode] = true;

        const commonKey = 18;   // Alt 키
        
        // 단축키 설정 가져오기
        let shortcutKey = TitleBar.shortcutKey;

        if (shortcutKey === null || shortcutKey === undefined) {
            return;
        }

        if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.sdms)]) {
            // sdms 단축키
            let url = window.location.origin + RootResource.path.sdms;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.sdms)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.settings)]) {
            // settings 단축키
            console.log("settings 단축키");
            target.onClickSetting();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.settings)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.teamEdit)]) {
            // teamEdit 단축키
            console.log("teamEdit 단축키");
            let url = window.location.origin + RootResource.path.teamEditor;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.teamEdit)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.home)]) {
            // home 단축키
            console.log("home 단축키");
            target.onClickLogo();
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.home)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey]) {
            // 단축키 도움말
            console.log("단축키 도움말 단축키");
            target.showShortCutKey();

            // prevent default browser behavior
            e.preventDefault();
        }
        // GS인증에 따른 단축키 설정 
        else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.sop)] && ProjectResource.isGSMode !== true) {
            console.log("sop 단축키");
            let url = window.location.origin + RootResource.path.sopSimulator;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.sop)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.sopMgr)] && ProjectResource.isGSMode !== true) {
            // sopMgr 단축키
            let url = window.location.origin + RootResource.path.sopManager;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.sopMgr)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.dashboard)] && ProjectResource.isGSMode !== true) {
            // dashboard 단축키
            let url = window.location.origin + RootResource.path.dashboard;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.dashboard)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.history)] && ProjectResource.isGSMode !== true) {
            // history 단축키
            let url = window.location.origin + RootResource.path.history;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.history)] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (TitleBar.keys[commonKey] && TitleBar.keys[parseInt(shortcutKey.reportYeosu)] && ProjectResource.isGSMode !== true) {
            // history 단축키
            let url = window.location.origin + RootResource.path.reportYeosu;
            window.open(url, "_blank");
            target.hideShortCutKey();

            TitleBar.keys[commonKey] = false;
            TitleBar.keys[parseInt(shortcutKey.reportYeosu)] = false;
            // prevent default browser behavior
            e.preventDefault();
        }
    }

    keysReleased(e, target) {
        // mark keys that were released
        TitleBar.keys[e.keyCode] = false;

        if (e.keyCode === 18) {
            target.hideShortCutKey();
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

        // 솔브레인 작업현황 정보 읽어오기 관련 타이머
        if (ProjectResource.SiteID !== null && ProjectResource.SiteID !== undefined && ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
            DashboardController.StartWatchTimer();
        }
    }

    showShortCutKey = () => {
        // 단축키 도움말 표시 관련 클래스 제거로 단축키 도움말 표시
        $(".shortcutKey").removeClass(uis.hideKey);
    }

    hideShortCutKey = () => {
        // 단축키 도움말 표시 관련 클래스 추가로 단축키 도움말 숨김
        $(".shortcutKey").addClass(uis.hideKey);
    }

	onClickLogout = () => {
        // 계정 리덕스에 상태 업데이트
        AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.logout, message: "로그아웃 하였습니다." });

        if (this.wsMgr) {
            this.wsMgr.checkLogin(0);
            this.wsMgr.webSocket.close();
        }
    }

    checkLoginState = (data) => {
        if (data === null || data === undefined ||
            data.loginState === null || data.loginState === undefined)
            return;

        if (data.loginState === AccountResource.loginState.logout) {
            // 로그아웃 시
            // 로그인 페이지로 이동
            this.props.history.push(RootResource.path.root);
            
            const siteID = ProjectResource.SiteID;

            if (siteID !== null && siteID !== undefined) {
                window.localStorage.removeItem(SessionString.Key.account + "_" + siteID.toString());
            }
        } else if (data.loginState === AccountResource.loginState.disconnected) {
            // 네트워크 연결 끊김 시
            this.showConfirmDialog("오류", [data.message], ["확인"], this.onClickFalseConfirm, this.onClickFalseConfirm);
        } else if (data.loginState === AccountResource.loginState.false) {
            // 세션 조회 실패 시
            this.showConfirmDialog("오류", [data.message], ["확인"], this.onClickFalseConfirm, this.onClickFalseConfirm);
        } else if (data.loginState === AccountResource.loginState.login) {
            this.onCloseConfirmDialog();
        }
    }

    reloadAccountInfo = (data) => {
        this.setState({ reload: true });
    }

    onClickFalseConfirm = () => {
        //window.location.href = RootResource.path.root;
        this.props.history.push(RootResource.path.root);

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
        if (this.props.menuEvent && this.props.menuEvent.onClickLogo) {
            this.props.menuEvent.onClickLogo();
        }
    }

    static onClickTemp = () => {
        console.log("onClickTemp 실행");
        if (TitleBar.props.menuEvent && TitleBar.props.menuEvent.onClickLogo) {
            TitleBar.props.menuEvent.onClickLogo();
        }
    }

    onClickSetting = () => {
        this.setState({ settingOnOff: true });
    }

    getTargetMenus() {
        if (this.props.target === "sdms") {
            return <SDMSMenuBtn menuEvent={this.props.menuEvent} />
        } else if (this.props.target === "sop-simulator") {
            return <SopSimulatorMenuBtn menuEvent={this.props.menuEvent} />;
        } else if (this.props.target === "sop-simulatorYeosu") {
            return <SopSimulatorMenuBtn menuEvent={this.props.menuEvent} />;
        } else {
            return (
                /*
                <div className={uis.fileWrap}>
                    <button type="button" className={uis.btnFile}><i className={uis.iconFile}></i></button>
                </div>
                */
                <div className={newStyles.rqQck + " rqBtn"}>
                    <button className="rqQckBtn">메뉴열기</button>
                </div>
            );
        }
    }

    getLinkMenu() {
        const path = window.location.pathname;
        let linkMenuUI = [];

        // 단축키 설정 가져오기
        let shortcutKey = TitleBar.shortcutKey;
        let sdms = "";
        let sopYeosu = "";
        let historyYeosu = "";
        let teamYeosu = "";
        let sopYeosuManager = "";
        let reportYeosu = "";


        if (shortcutKey !== null && shortcutKey !== undefined) {
            if (shortcutKey.sdms !== null && shortcutKey.sdms !== undefined && shortcutKey.sdms !== "") {
                let key = String.fromCharCode(shortcutKey.sdms);
                sdms = <span className={"shortcutKey" + " " + uis.menuShortCut + " " + uis.hideKey}>Al+{key}</span>;
            }
            if (shortcutKey.sopYeosu !== null && shortcutKey.sopYeosu !== undefined && shortcutKey.sopYeosu !== "") {
                let key = String.fromCharCode(shortcutKey.sopYeosu);
                sopYeosu = <span className={"shortcutKey" + " " + uis.menuShortCut + " " + uis.hideKey}>AI+{key}</span>;
            } /* 1206 */
            if (shortcutKey.historyYeosu !== null && shortcutKey.historyYeosu !== undefined && shortcutKey.historyYeosu !== "") {
                let key = String.fromCharCode(shortcutKey.historyYeosu);
                historyYeosu = <span className={"shortcutKey" + " " + uis.menuShortCut + " " + uis.hideKey}>Al+{key}</span>;
            }
            if (shortcutKey.teamYeosu !== null && shortcutKey.teamYeosu !== undefined && shortcutKey.teamYeosu !== "") {
                let key = String.fromCharCode(shortcutKey.teamYeosu);
                teamYeosu = <span className={"shortcutKey" + " " + uis.menuShortCut + " " + uis.hideKey}>Al+{key}</span>;
            }
            if (shortcutKey.sopYeosuManager !== null && shortcutKey.sopYeosuManager !== undefined && shortcutKey.sopYeosuManager !== "") {
                let key = String.fromCharCode(shortcutKey.sopYeosuManager);
                sopYeosuManager = <span className={shortcutKey.sopYeosuManager + " " + uis.menuShortCut + " " + uis.hideKey}>Al+{key}</span>;
            }
            if (shortcutKey.reportYeosu !== null && shortcutKey.reportYeosu !== undefined && shortcutKey.reportYeosu !== "") {
                let key = String.fromCharCode(shortcutKey.reportYeosu);
                reportYeosu = <span className={shortcutKey.reportYeosu + " " + uis.menuShortCut + " " + uis.hideKey}>Al+{key}</span>;
            }
        }

        // 새탭에서 열림
        //let linkSDMS = <Link to="/sdms" target="_blank">3D관제화면</Link>;
        //let linkSOPSimulatorYeosu = <Link to="/sop-simulator" target="_blank">SOP여수</Link>;
        //let linkHistoryYeosu = <Link to="/historyYeosu" target="_black">이력관리 여수</Link>
        //let linkTeamYeosu = <Link to="/teamYeosu" target="_blank">조직관리 여수</Link>;
        //let linkSOPSimulatorYeosu = <Link to="/sdms" onClick={() => this.onClickMoveToSOP()}>SOP</Link>

        // 기존탭에서 열림
        let linkSDMS = <Link to="/sdms">3D관제화면</Link>;
        let linkSOPSimulatorYeosu = <Link to="/sop-simulator">SOP</Link>;
        let linkSOPManagerYeosu = <Link to="/sop-manager">SOP편집</Link> 
        //let linkSOPSimulatorYeosu = <a onClick={() => this.showConfirmDialog("[INFO]", "기능 수정 중 입니다.", null, this.onCloseConfirmDialog())}>SOP</a>
        //let linkSOPManagerYeosu = <a onClick={() => this.showConfirmDialog("[INFO]", "기능 수정 중 입니다.", null, this.onCloseConfirmDialog())}>SOP편집</a>
        let linkTeamYeosu = <Link to="/team-Editor">조직관리</Link>;
        let linkHistoryYeosu = <Link to="/history">이력관리</Link>;
        //let linkReportYeosu = <a onClick={() => this.showConfirmDialog("[INFO]", "화면 작업중 입니다.", null, this.onCloseConfirmDialog())}>보고서 및 통계</a>  /* <Link to="/reportYeosu">보고서 및 통계</Link>; */
        let linkReportYeosu = <Link to="/report">보고서 및 통계</Link>

        if (path === RootResource.path.sdms) {
            linkSDMS = <a>3D관제화면</a>;
        } else if (path === RootResource.path.sopSimulator) {
            linkSOPSimulatorYeosu = <a>SOP</a>;
        } else if (path === RootResource.path.sopManager) {
            linkSOPManagerYeosu = <a>SOP편집</a>
        } else if (path === RootResource.path.teamYeosu) {
            linkTeamYeosu = <a>조직관리</a>;
        } else if (path === RootResource.path.historyYeosu) {
            linkHistoryYeosu = <a>이력관리</a>;
        } else if (path === RootResource.path.reportYeosu) {
            linkReportYeosu = <a>보고서 및 통계</a>;
        }

        const userAuthor = ProjectResource.getUserAuthor();


        // GS 인증에 따른 메뉴 표시
        let adminLink = null;
        let userLink = null;

        if (ProjectResource.isGSMode !== true) {
            adminLink = (<React.Fragment>
                {/* <li>{dashboard}{linkDashBoard}</li> */}
                {/* <li>{sop}{linkSOPSimulator}</li> */}
                {/* <li>{sopMgr}{linkSOPManager}</li> */}
                {/* <li>{history}{linkHistory}</li> */}
            </React.Fragment>);

            userLink = (<React.Fragment>
                {/* <li>{dashboard}{linkDashBoard}</li> */}
                {/* <li>{sop}{linkSOPSimulator}</li> */}
                {/* <li>{history}{linkHistory}</li> */}
            </React.Fragment>);
        }


        // 계정 권한 별 표시
        if (userAuthor === AccountResource.ID.accountLevel.admin) {
            linkMenuUI.push(<React.Fragment key={"linkAdmin"}>
                <li>{sdms}{linkSDMS}</li>
                <li>{sopYeosu}{linkSOPSimulatorYeosu}</li>
                <li>{sopYeosuManager}{linkSOPManagerYeosu}</li> 
                <li>{teamYeosu}{linkTeamYeosu}</li>
                <li>{historyYeosu}{linkHistoryYeosu}</li>
                <li>{reportYeosu}{linkReportYeosu}</li>
                {adminLink}
            </React.Fragment>);
        } else {
            linkMenuUI.push(<React.Fragment key={"linkUser"}>
                <li>{sdms}{linkSDMS}</li>
                <li>{sopYeosu}{linkSOPSimulatorYeosu}</li>
                <li>{sopYeosuManager}{linkSOPManagerYeosu}</li> 
                <li>{teamYeosu}{linkTeamYeosu}</li>
                <li>{historyYeosu}{linkHistoryYeosu}</li>
                <li>{reportYeosu}{linkReportYeosu}</li>
                {userLink}
            </React.Fragment>);
        }
        
        return linkMenuUI;
        
    }

    onClickMoveToSOP = () => {
        window.open("/sop-simulator", "", "_blank");
    }

    onClickAccountMgr = () => {
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

    /* getTitleNameUI() {
        const path = window.location.pathname;

        if (path === RootResource.path.sdms) {
            return (<></>);
        } else if (path === RootResource.path.teamEditor) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{RootResource.ID.title.teamEditor}</h2>
                </div>);
        } 
        else if (path === RootResource.path.sopSimulator) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{RootResource.ID.title.sopSimulator}</h2>
                </div>);
        }else if (path === RootResource.path.sopSimulatorYeosu) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{RootResource.ID.title.sopSimulatorYeosu}</h2>
                </div>);
        } else if (path === RootResource.path.sopManager) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{RootResource.ID.title.sopManager}</h2>
                </div>);
        } else if (path === RootResource.path.dashboard) {
            return (
                <div id={newStyles.hsTop} className={dashboard.hsTop}>
                    <h2 className={newStyles.hstTitle}>{RootResource.ID.title.dashboard}</h2>
                </div>);
        } else if (path === RootResource.path.history) {
            return (
                <div id={newStyles.hsTop}>
                    <h2 className={newStyles.hstTitle}>{RootResource.ID.title.history}</h2>
                </div>);
        }
    } */


    getUserInfo() {
        let userName = "-";
        let userLevel = "-";

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo !== null && userInfo !== undefined) {
            userName = userInfo.nickName;
            userLevel = userInfo.level;
        }

        if (userLevel === AccountResource.ID.accountLevel.admin) {
            return (
                <div className={newStyles.rqUsr + " rqBtn"}>
                    <button className="rqUsrBtn"><span className="rqUsrSpan">{userName}</span></button>
                    {/* 아래로 펼쳐지는 영역 */}
                    <div className={newStyles.adminBox}>
                        <div style={{ display: 'flex', flexDirection: 'inherit', padding: '8px' }}>
                            {/* <em className={uneCommon.adminProfile}></em> */}
                            <div className={newStyles.adminFlex}>
                                <div>
                                  <span className={newStyles.adminIcon}></span>
                                </div>
                                <div>
                                  <span className={newStyles.adminNum}>여수산단</span>
                                  <p className={newStyles.userName}>{userName}</p>
                                </div>
                            </div>
                        </div>
                        <ul className={newStyles.rockBpx}>
                            {/* <li><a onClick={this.onClickAccountMgr} title="사용자 관리"><img src={Umanagement} alt="사용자관리" className={newStyles.Amanagement} title="사용자 관리" /></a></li>
                            <li className={newStyles.passwordBox}><a onClick={this.onClickChangePwd} title="비밀번호 변경"><img src={Upassword} alt="비밀번호 변경" className={newStyles.Apassword} title="비밀번호 변경" />비밀번호 변경</a></li>
                            <li className={newStyles.logoutBox}><a onClick={this.onClickLogout} title="로그아웃">로그아웃<img src={Ulogout} alt="로그아웃" className={newStyles.Alogout} title="로그아웃" /></a></li> 
                            <li className={newStyles.userIcon} onClick={this.onClickAccountMgr}><a title="사용자 관리"></a></li> */}
                            <li /* className={newStyles.lockIcon} */ onClick={this.onClickChangePwd}><a title="비밀번호 변경">비밀번호 변경</a></li>
                            <li /* className={newStyles.logoutIcon} */ onClick={this.onClickLogout}><a title="로그아웃">로그아웃</a><span className={newStyles.logoutIcon}></span></li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={newStyles.rqUsr + " rqBtn " + newStyles.user}>
                    <button className="rqUsrBtn"><span className="rqUsrSpan">{userName}</span></button>
                    <div>
                        <em className={uneCommon.userProfile}>프로필사진</em>
                        <span>{userLevel}</span>
                        <p>{userName}</p>
                        <ul>
                            <li className={newStyles.rqli} title="비밀번호 변경"><a onClick={this.onClickChangePwd}><img src={Upassword} alt="비밀번호 변경" className={newStyles.Upassword} title="비밀번호 변경" /></a></li>
                            <li className={newStyles.rqli} title="로그아웃"><a onClick={this.onClickLogout}><img src={Ulogout} alt="로그아웃" className={newStyles.Ulogout} title="로그아웃" /></a></li>
                        </ul>
                    </div>
                </div>
            );
        }
        
    }

    getLogo() {
        // 단축키 설정 가져오기
        let shortcutKey = TitleBar.shortcutKey;
        let home = <></>;

        if (shortcutKey !== null && shortcutKey !== undefined) {
            if (shortcutKey.home !== null && shortcutKey.home !== undefined && shortcutKey.home !== "") {
                let key = String.fromCharCode(shortcutKey.home);
                home = <span className={"shortcutKey" + " " + uis.logoShortCut + " " + uis.hideKey}>Al+{key}</span>;
            }
        }

        if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain) {
            return <h1 className={newStyles.rqLogo} onClick={() => this.onClickLogo()}>{home}</h1>
        }
        else if (ProjectResource.SiteID === ProjectResource.Site.GCC) {
            return <h1 className={newStyles.rqLogoGC} onClick={() => this.onClickLogo()}>{home}</h1>
        }

        return <></>
    }

    onClickChangePwd = () => {
        this.setState({ opneChangePwd: true });
    }

    onClickCloseChangePwd = () => {
        this.setState({ opneChangePwd: false });
    }

    getSettingKey = () => {
        let shortcutKey = TitleBar.shortcutKey;
        let settings = <></>;

        if (shortcutKey !== null && shortcutKey !== undefined) {
            if (shortcutKey.settings !== null && shortcutKey.settings !== undefined && shortcutKey.settings !== "") {
                let key = String.fromCharCode(shortcutKey.settings);
                settings = <span className={"shortcutKey" + " " + uis.setShortCut + " " + uis.hideKey}>Al+{key}</span>;
            }
        }

        return settings;
    }

    render() {
        return (
            <>                
                <div id={newStyles.rqMenu} className={SdmsResource.UISection}>
                    {/* {
                        this.getLogo()
                    }
                    {
                       this.getTargetMenus()
                    } */}
                    {
                        this.getUserInfo()
                    }
                    <div className={newStyles.rqApp + " rqBtn"}>
                        <button className="rqAppBtn">
                           <span className={newStyles.rqAppText}>메뉴</span>
                        </button>
                        <ul>
                          { this.getLinkMenu() }
                        </ul>
                    </div>
                    <div className={newStyles.rqSetBox}>
                        <div onClick={this.onClickSetting} style={{ display: 'flex' }}>
                           <a /* onClick={this.onClickSetting} */ className={newStyles.rqStng}></a>
                           <span className={newStyles.rqSettingText}>환경설정</span>
                        </div>
                        {this.getSettingKey()}
                    </div>
                </div>
                
                {/* { this.getTitleNameUI() } */}

                <DisplayPopup open={this.state.popupOpen} mode={AccountResource.ID.popupMode.manager} onClickClosePopup={this.onClickClosePopup} />

                
                {
                    /* 환경설정 팝업 */
                    /*<DisplaySetting settingOnOff={this.state.settingOnOff} settingOff={this.settingOff} />*/
                    this.state.settingOnOff &&
                    <LayoutSetting
                        settingOff={this.settingOff}
                        settingOnOff={this.state.settingOnOff}
                        wsMgr={this.wsMgr}
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

export default withRouter(TitleBar);


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
        const accountLevels = await AccountController.getAccountLevels();
        const regulars = await TeamEditController.GetRegular();
        let accountUsers = await AccountController.getAccountUsers();

        this.setState({ regulars: regulars, accountLevels: accountLevels, accountUsers: accountUsers });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.open !== this.props.open) {
            // 외부에서 열고 닫았을때
            this.setState({ open: this.props.open, popupMode: this.props.mode });
        }
    }

    /*componentWillUpdate(nextProps, nextState) {
        //console.log('componentWillUpdate');

        if (nextProps.open !== this.props.open && nextProps.open === true) {
            this.state.removeAccountUsers = [];
            this.reload();
        }
    }*/

    onClickClosePopup = (value) => {
        this.setState({ open: value });
        this.props.onClickClosePopup(value);

        return;
    }

    onClickCancle = () => {
        //this.setState({ popupMode: AccountResource.ID.popupMode.manager});
        this.state.popupMode = AccountResource.ID.popupMode.manager;

        this.reload();
    }

    onClickRegister = () => {
        this.setState({ popupMode: AccountResource.ID.popupMode.register});
    }

    onClickConfirm = () => {
        this.setState({ popupMode: AccountResource.ID.popupMode.manager });

        this.reload();
    }

    onChangeReload = () => {
        this.reload();
    }

    async reload() {
        const accountUsers = await AccountController.getAccountUsers();
        const regulars = await TeamEditController.GetRegular();

        this.setState({ regulars: regulars, accountUsers: accountUsers });
    }

    render() {
        if (this.state.open === true && this.state.popupMode === AccountResource.ID.popupMode.manager) {
            return <AccountManager onClickClosePopup={this.onClickClosePopup} onClickRegister={this.onClickRegister} onChangeReload={this.onChangeReload} regulars={this.state.regulars} accountLevels={this.state.accountLevels} accountUsers={this.state.accountUsers} removeAccountUsers={this.state.removeAccountUsers} />;
        } else if (this.state.open === true && this.state.popupMode === AccountResource.ID.popupMode.register) {
            return <AccountRegister onClickClosePopup={this.onClickClosePopup} onClickCancle={this.onClickCancle} onClickConfirm={this.onClickConfirm} regulars={this.state.regulars} accountLevels={this.state.accountLevels} accountUsers={this.state.accountUsers} removeAccountUsers={this.state.removeAccountUsers} />;
        } else {
            return <></>;
        }
    }
}