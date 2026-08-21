import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import { withRouter } from 'react-router-dom';
import SessionString from '../Common/js/sessionString';
import { AccountController } from '../Account/services/accountController';
//import { TeamEditController } from '../TeamEditor/services/teamEditController';
//import LayoutSetting from '../Settings/ui/popups/layoutSetting';
//import SettingsStore from '../Settings/settingsStore';
import Store from './store';

import uis from '../Common/css/ui.module.css';
import contents from '../Common/css/content.module.css';
import styles from '../Common/css/style.module.css';
import newStyles from '../Common/css/newStyle.module.css';
import uneCommon from '../Common/css/uneCommon.module.css';
//import dashboard from '../Dashboard/css/dashboardNew.module.css';

import logo from '../Common/image/common/logo.png';
import Ulogout from '../Common/img/common/user_logout.png';
import Umanagement from '../Common/img/common/user_management.png';
import Upassword from '../Common/img/common/user_password.png';
import $ from 'jquery';
import AccountManager from '../Account/ui/popups/accountManager';
import AccountRegister from '../Account/ui/popups/accountRegister';
import ConfirmDialog from '../Common/ui/confirmDialog';

import AccountResource from '../Account/resource/id';
//import SettingResource from '../Settings/resource/id';
import RootResource from './resource/id';
import AccountStore from '../Account/accountStore';

import ProjectResource from './resource/id';
//import SopController from '../SOPManager/services/sopController';

import AccountChangePwd from '../Account/ui/popups/accountChangePwd';

import edit from '../PropertyEdit/css/edit.module.css';
import wsManager from './services/wsManager';
import Dashboard from '../Dashboard/ui/dashboard';
import Interchange from './interchange';
import Management from '../Management/ui/management';
import VDCNewRegistration from '../Management/ui/vdcNewRegistration';
import CommonResource from '../Common/resource/id';
import TimerLocal from './timerLocal';
import TimerVDC from './timerVDC';
import ManagementController from '../Management/services/managementController';

class TitleBar extends Component {
    static pathSDMS = '/sdms';
    static pathSOPSimulatorYeosu = '/sop-simulatorYeosu';
    static pathHistoryYeosu = '/historyYeosu';
    static pathTeamYeosu = '/teamYeosu';

    static keys = [];
    static shortcutKey = null;

    static modeDashboard = 0;
    static modeMain = 1;
    static modeEdit = 2;

    static mode = {
        none: 0,
        management: 1,
        newRegist: 2
    }

    constructor(props) {
        super(props);

        this.state = {
            popupOpen: false,
            settingOnOff: false,
            opneChangePwd: false,

            currentMode: TitleBar.mode.none,
            parameter: null,

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

        /* SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SHORTCUT_KEY') {
                TitleBar.shortcutKey = data.shortcutKey;
            }
        }.bind(this)); */

        //AccountStore.subscribe(function () {
        //    let data = AccountStore.getState();

        //    if (data.actionType === 'LOGIN_STATE') {
        //        this.checkLoginState(data);
        //    } else if (data.actionType === 'UPDATE_INFO') {
        //        this.reloadAccountInfo(data);
        //    }
        //}.bind(this));

        this.initSiteID();
    }

    componentDidMount() {

        const path = window.location.pathname;

        // 경로에 따라 타이틀바 css 변경
        /* if (this.props.mode === TitleBar.modeMain) {
            $('.' + newStyles.langText).addClass(newStyles.langTextMain);
            $('.' + newStyles.timeText1).addClass(newStyles.timeText1Main);
            $('.' + newStyles.timeText1span).addClass(newStyles.timeText1spanMain);
            $('.' + newStyles.timeText2).addClass(newStyles.timeText2Main);
            $('.' + newStyles.timeText2span).addClass(newStyles.timeText2spanMain);
            $('.' + newStyles.rqUsrSpan).addClass(newStyles.rqUsrSpanMain);
            $('.' + newStyles.rqAppBtn).addClass(newStyles.rqAppBtnMain);
            $('.' + newStyles.rqStng).addClass(newStyles.rqStngMain);
        } else if (this.props.mode === TitleBar.modeEdit) {
            $('.' + newStyles.vdsEditLogo).addClass(newStyles.vdsEditLogo2);
        } */

        if (this.props.mode === TitleBar.modeDashboard) {
            $('.' + newStyles.timeAreaVDC).hide();
            $('.' + newStyles.timeTitleBoxVDC).hide();
            $('.' + newStyles.langTextTitleVDC).hide();
            $('.' + newStyles.langTextVDC).hide();
            $('.' + newStyles.timeBoxVDC).hide();
            $('.' + newStyles.timeText1VDC).hide();
            $('.' + newStyles.timeText2VDC).hide();
        } else if (this.props.mode === TitleBar.modeEdit) {
            $('.' + newStyles.langTextTitle).addClass(newStyles.langTextTitleEdit);
            $('.' + newStyles.langTextTitleVDC).addClass(newStyles.langTextTitleVDCEdit);
            $('.' + newStyles.rqUsr).addClass(newStyles.rqUsrEdit);
        }

        // 로그인 세션 감시 타이머 
        AccountController.StartWatchTimer();

        // 다른 곳 클릭했을때 이벤트 발생
        $('#mainSB').click(function (e) {

            if ($('.rqQckBtn').hasClass('on') || $('.' + newStyles.rqAppBtn).hasClass('on') || $('.rqUsrBtn').hasClass('on')) {
                let targetName = e.target.className;

                if (targetName === "") {
                    $('.rqQckBtn').next().hide();
                    $('.rqQckBtn').removeClass('on');
                    $('.' + newStyles.rqAppBtn).next().hide();
                    $('.' + newStyles.rqAppBtn).removeClass('on');
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
        $('.' + newStyles.rqQck + ' ul li').click(function (e) {
            $('.rqQckBtn').next().hide();
            $('.rqQckBtn').removeClass('on');
        });
        $('.' + newStyles.rqApp + ' ul li').click(function (e) {
            $('.' + newStyles.rqAppBtn).next().hide();
            $('.' + newStyles.rqAppBtn).removeClass('on');
        });

        $(document).mouseup(function (e) {
            if ($('.rqBtn').has(e.target).length === 0) {
                $('.rqBtn > ul, .rqBtn > div').hide();
                $('.rqBtn button').removeClass('on');
            }
        });

        this.unsubscribe = AccountStore.subscribe(function () {
            let data = AccountStore.getState();

            if (data.actionType === 'LOGIN_STATE') {
                this.checkLoginState(data);
            } else if (data.actionType === 'UPDATE_INFO') {
                this.reloadAccountInfo(data);
            }
        }.bind(this));
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);

        this.unsubscribe();
    }

    async initSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            ProjectResource.SiteID = 1;
            // 사이트 ID 요청
            /*const [result, message] = await SDMSController.requestGetSiteID();

            if (result !== null && result !== undefined) {
                ProjectResource.SiteID = result;
            }*/

            this.setState({ reload: true });
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

    onClickLogout = async () => {
        const result = await AccountController.logout();

        if (result.success) {
            if (this.props.wsManager) {
                this.props.wsManager.logout();
            }

            ProjectResource.setLoginUser(null);
            // 계정 리덕스에 상태 업데이트
            AccountStore.dispatch({ type: 'LOGIN_STATE', loginState: AccountResource.loginState.logout, message: "로그아웃 하였습니다." });
        }
        else {
            this.alertMessage(result.message, ProjectResource.ID.messageBox.title.error);
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
            this.props.closeRootMessageBox();
        } else if (data.loginState === AccountResource.loginState.false) {
            // 세션 조회 실패 시
            this.showConfirmDialog("오류", [data.message], ["확인"], this.onClickFalseConfirm, this.onClickFalseConfirm);
            this.props.closeRootMessageBox();
        } else if (data.loginState === AccountResource.loginState.licenseExpired || data.loginState === AccountResource.loginState.licenseWait || data.loginState === AccountResource.loginState.licenseAlert) {
            this.props.showRootMessageBox(data.loginState, data.message);
        } else if (data.loginState === AccountResource.loginState.login) {
            this.onCloseConfirmDialog();
            this.props.closeRootMessageBox();
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

    alertMessage = (message, messageType = ProjectResource.ID.messageBox.title.warning) => {
        this.showConfirmDialog(messageType, [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
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
        if (TitleBar.props.menuEvent && TitleBar.props.menuEvent.onClickLogo) {
            TitleBar.props.menuEvent.onClickLogo();
        }
    }

    onClickSetting = () => {
        this.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info);
    }

    getTargetMenus() {
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
        let levelID = 0;

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo !== null && userInfo !== undefined) {
            userName = userInfo.nickName;
            userLevel = ProjectResource.getAccountLevelName(userInfo.userLevel);
            levelID = userInfo.levelID;
        }

        if (levelID === AccountResource.accountLevel.vdsManager) {
            return (
                <div className={newStyles.rqUsr + " rqBtn" + " " + CommonResource.UISection}>
                    <button className="rqUsrBtn"><span className={newStyles.rqUsrSpan}>{userName}</span></button>
                    <div className={newStyles.adminBox}>
                        <div style={{ display: 'flex', flexDirection: 'inherit', padding: '10px 10px 6px 10px', justifyContent: 'center' }}>
                            {/* <em className={uneCommon.adminProfile}></em> */}
                            <div>
                                <span className={newStyles.adminIcon}></span>
                                <span className={newStyles.adminNum}>{userLevel}</span>
                                <p className={newStyles.userName}>{userName}</p>
                            </div>
                        </div>
                        <ul>
                            {/* <li className={newStyles.passwordBox}><a onClick={this.onClickChangePwd} title="비밀번호 변경">비밀번호 변경</a></li> */}
                            <li className={newStyles.logoutBox}><a onClick={this.onClickLogout} title="로그아웃">로그아웃<img src={Ulogout} alt="로그아웃" className={newStyles.Alogout} title="로그아웃" /></a></li>
                        </ul>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={newStyles.rqUsr + " rqBtn" + " " + CommonResource.UISection}>
                    <button className="rqUsrBtn"><span className={newStyles.rqUsrSpan}>{userName}</span></button>
                    <div className={newStyles.adminBox}>
                        <div style={{ display: 'flex', flexDirection: 'inherit', padding: '10px 10px 4px', justifyContent: 'center' }}>
                            {/* <em className={uneCommon.adminProfile}></em> */}
                            <div>
                                <span className={newStyles.adminIcon}></span>
                                <span className={newStyles.adminNum}>{userLevel}</span>
                                <p className={newStyles.userName}>{userName}</p>
                            </div>
                        </div>
                        <ul>
                            {/* <li className={newStyles.passwordBox}><a onClick={this.onClickChangePwd} title="비밀번호 변경">비밀번호 변경</a></li> */}
                            <li className={newStyles.logoutBox}><a onClick={this.onClickLogout} title="로그아웃">로그아웃<img src={Ulogout} alt="로그아웃" className={newStyles.Alogout} title="로그아웃" /></a></li>
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

    setMode(mode, parameter) {
        this.setState({ currentMode: mode, parameter });

        if (mode === TitleBar.mode.newRegist) {
            this.props.setNewRegistMode(true);
        }
        else {
            this.props.setNewRegistMode(false);
        }
    }

    toggleVdcManagement() {
        const userInfo = ProjectResource.getUserInfo();

        if (!userInfo) {
            return;
        }

        if (userInfo.levelID === AccountResource.accountLevel.user) {
            this.alertMessage(ProjectResource.ID.errorMessage.noPermissionToUser, ProjectResource.ID.messageBox.title.info);
        }
        else {
            if (this.state.currentMode === TitleBar.mode.management) {
                this.setState({ currentMode: TitleBar.mode.none });
            }
            else {
                this.setState({ currentMode: TitleBar.mode.management });
            }
        }
    }

    closeVdcManagement = (param) => {
        if (param && param.length > 0) {
            const mode = param[0];
            const parameter = [];

            for (let i = 1; i < param.length; i++) {
                parameter.push(param[i]);
            }

            this.setMode(mode, parameter.length > 0 ? parameter : null);
        }
        else {
            this.checkDataCenter();
        }
    }

    async checkDataCenter() {
        if (this.props.dataCenter) {
            const [dataCenter,] = await ManagementController.requestGetDataCenter(this.props.dataCenter.id)

            if (dataCenter) {
                this.props.dataCenter.name = dataCenter.name;
                this.props.dataCenter.engName = dataCenter.engName;
            }
        }

        this.setMode(TitleBar.mode.none, null);
    }

    render() {
        if (this.state.currentMode === TitleBar.mode.newRegist && this.state.parameter && this.state.parameter.length >= 2) {
            return <VDCNewRegistration dataCenter={this.state.parameter[0]} prev3DMode={this.state.parameter[1]} onClose={this.closeVdcManagement} onChangeMode={this.props.onChangeMode} wsManager={this.props.wsManager} makeParameter={this.props.makeParameter} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} getCameraOnOff={this.props.getCameraOnOff} setCameraOnOff={this.props.setCameraOnOff} getSensorOnOff={this.props.getSensorOnOff} setSensorOnOff={this.props.setSensorOnOff} />
        }

        return (
            <>
                <div id={newStyles.rqMenu}>
                    {/* <span className={newStyles.langText}>KOR</span>
                    <div className={newStyles.timeBox}>
                        <div className={newStyles.timeText1}><span className={newStyles.timeText1span}>{date}</span></div>
                        <div className={newStyles.timeText2}><span className={newStyles.timeText2span}>{time}</span></div>
                    </div> */}
                    <TimerLocal />
                    {/* <TimerVDC dataCenter={this.props.dataCenter} /> */}
                    {
                        this.getUserInfo()
                    }
                    <div className={newStyles.rqApp + " rqBtn" + " " + CommonResource.UISection}>
                        <button className={newStyles.rqAppBtn} onClick={() => this.toggleVdcManagement()}></button>
                        {
                        /*<ul>
                            {this.getLinkMenu()}
                        </ul>*/
                        }
                        <span className={newStyles.rqAppText}></span>
                    </div>
                    <div className={newStyles.rqSetBox + " " + CommonResource.UISection}>
                        <a onClick={this.onClickSetting} className={newStyles.rqStng}>
                            {this.getSettingKey()}
                        </a>
                        <span className={newStyles.rqSettingText}></span>
                    </div>
                </div>

                {/* { this.getTitleNameUI() } */}

                <DisplayPopup open={this.state.popupOpen} mode={AccountResource.ID.popupMode.manager} onClickClosePopup={this.onClickClosePopup} />


                {
                    /* 환경설정 팝업 */
                    /*<DisplaySetting settingOnOff={this.state.settingOnOff} settingOff={this.settingOff} />*/
                    this.state.settingOnOff &&
                    {/* <LayoutSetting
                        settingOff={this.settingOff}
                        settingOnOff={this.state.settingOnOff}

                    /> */}
                }

                {
                    /* 비밀번호 변경 팝업 */
                    this.state.opneChangePwd &&
                    <AccountChangePwd onClickCloseChangePwd={this.onClickCloseChangePwd} />
                }

                {
                    this.state.currentMode === TitleBar.mode.management &&
                    <Management onClose={this.closeVdcManagement} site={this.props.site} dashboard={this.props.dashboard} wsManager={this.props.wsManager} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} alertMessage={this.alertMessage} setCameraOnOff={this.props.setCameraOnOff} setSensorOnOff={this.props.setSensorOnOff} />
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
        //const regulars = await TeamEditController.GetRegular();
        let accountUsers = await AccountController.getAccountUsers();

        this.setState({ /* regulars: regulars, */  accountLevels: accountLevels, accountUsers: accountUsers });
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
        this.setState({ popupMode: AccountResource.ID.popupMode.register });
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
        //const regulars = await TeamEditController.GetRegular();

        this.setState({ /* regulars: regulars, */ accountUsers: accountUsers });
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