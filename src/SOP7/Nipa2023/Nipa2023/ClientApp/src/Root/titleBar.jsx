import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ProjectResource from '../Root/resource/id';

import { TitleBarComponent } from './styled/titleBarStyled';
import nipa_logo from '../Root/images/nipa_logo.png';
import { AccountController } from '../Account/services/accountController';
import { SdmsController } from '../SDMS/services/sdmsController';
import { UserDispatch } from './resource/userDispatch';
import home_icon from '../Root/images/home_icon.png';
import { ContextManager } from './resource/contextManager';
import AccountResource from '../Account/resource/id';
import SessionString from '../Common/resource/sessionString';
import AccountManager from '../Account/ui/popups/accountManager';
import AccountChangePwd from '../Account/ui/popups/accountChangePwd';
import LayoutSetting from '../Settings/ui/layoutSetting';

import ConfirmDialog from '../Common/ui/confirmDialog';
import SdmsResource from '../SDMS/resource/id';

class TitleBar extends Component {
    static contextType = UserDispatch;
    static className = "TitleBar";

    constructor(props) {
        super(props);

        this.state = {
            accountMgrPopupOpen: false,
            accountChangePwdPopupOpen: false,
            layoutSettingPopupOpen: false,

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },

            site: null
        }

        this.props = props;
    }

    componentDidMount() {
        // this.setState({ accountMgrPopupOpen: true }); // 사용자권한관리

        const { user } = this.context;
        const dispatch = user[1];
        AccountController.startWatchTimer(this, dispatch);


        ContextManager.setEventOwner(ContextManager.LoginState, TitleBar.className, this);
        ContextManager.setEventOwner(ContextManager.UpdateInfo, TitleBar.className, this);
    }

    componentDidUpdate() {
        document.addEventListener("click", (e) => {
            let target = e.target;

            if (target.id === 'userMenuBtn' || target.id === 'navMenuBtn') {
                return;
            } else {
                let userMenu = document.getElementById('userMenu');
                let navMenu = document.getElementById('navMenu');

                if (userMenu === null || navMenu === null) {
                    return;
                } 
                
                userMenu.classList.remove('on');
                navMenu.classList.remove('on');
        }
        });
    }

    getLoginState() {
        const { user } = this.context;
        const loginState = user[0].loginState;
        return loginState;
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

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

    onDispatchAction(state, action) {
        if (action.type === ContextManager.LoginState) {
            const user = ProjectResource.getUserInfo();
            this.checkLoginState(action, user);
        }
    }

    checkLoginState = (data, user) => {
        if (data === null || data === undefined ||
            data.loginState === null || data.loginState === undefined)
            return;

        if (data.loginState === AccountResource.loginState.logout) {
            this.logout(user);
        } else if (data.loginState === AccountResource.loginState.disconnected) {
            this.showConfirmDialog(['서버와의 연결이 끊어졌습니다.'], ['확인'], this.logout, 'error');
        } else if (data.loginState === AccountResource.loginState.false) {
            this.showConfirmDialog(['동일한 계정으로 로그인되었습니다.'], ['확인'], this.logout, 'error');
        } else if (data.loginState === AccountResource.loginState.login) {
            //this.onCloseConfirmDialog();
        }
    }

    onClickOpenPopup = (type, levelID) => {
        
        if (type === 'manager') {
            if (levelID === AccountResource.accountLevelID.admin) {
                this.showConfirmDialog(['권한이 없습니다.'], null, null, 'error');
                return;
            } else {
                this.setState({ accountMgrPopupOpen: true });
            }
        } else if (type === 'changePwd') {
            this.setState({ accountChangePwdPopupOpen: true });
        } else if (type === 'settings') {
            this.setState({ layoutSettingPopupOpen: true });
        }

        const userMenu = document.getElementById('userMenu');
        userMenu.classList.remove('on');
    }

    onClickClosePopup = (type, value) => {
        if (type === 'manager') {
            this.setState({ accountMgrPopupOpen: value });
        } else if (type === 'changePwd') {
            this.setState({ accountChangePwdPopupOpen: value });
        } else if (type === 'settings') {
            this.setState({ layoutSettingPopupOpen: value });
            const userInfo = ProjectResource.getUserInfo();
            this.props.getSettingsOption(userInfo);
            this.props.wsManager.closePopup();
        }
    }

    checkLogout = () => {
        this.showConfirmDialog(['로그아웃하시겠습니까?'], ['취소', '확인'], this.logout, 'error');
    }

    logout = () => {
        let user = ProjectResource.getUserInfo();

        // 로그아웃 시
        // 로그인 페이지로 이동
        this.props.history.push(ProjectResource.path.root);

        const siteID = user?.siteID;

        if (siteID !== null && siteID !== undefined) {
            window.localStorage.removeItem(SessionString.Key.account + "_" + siteID.toString());
        }

        ProjectResource.clearLoginUser();
        this.onCloseConfirmDialog();
    }

    showMenu(e) {
        const userMenu = document.getElementById('userMenu');
        const navMenu = document.getElementById('navMenu');

        if(userMenu && navMenu) {
            if(userMenu.classList.contains('on')) {
                userMenu.classList.remove('on');
            } else if(navMenu.classList.contains('on')) {
                navMenu.classList.remove('on');
            }
        }

        const target = e.target.nextSibling;
        target.classList.toggle('on');
    };

    getUserInfo() {
        let userName = "-";
        let userLevelName = "-";

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo !== null && userInfo !== undefined) {
            userName = userInfo.name;
            userLevelName = userInfo.userLevel.levelName;
        }

        return (
            <div className='userMenu'>
                <button id='userMenuBtn' onClick={(e) => this.showMenu(e)}>유저메뉴</button>
                <div id='userMenu'>
                    <span>{userLevelName}</span>
                    <p>{userName}</p>
                    <ul>
                        <li><button onClick={() => this.onClickOpenPopup('manager', userInfo.levelID)} title="사용자 관리" /></li>
                        <li><button onClick={() => this.onClickOpenPopup('changePwd')} title="비밀번호 변경" /></li>
                        <li><button onClick={() => this.checkLogout()} title="로그아웃" /></li>
                    </ul>
                </div>
            </div>
        )
    }

    getMenu = () => {
        const path = this.props.path;
        const campusID = ProjectResource.campusID;
        let userInfo = ProjectResource.getUserInfo();

        // SDMS -> 유저 메뉴만 표기
        // 나머지 -> 전체 메뉴 표기
        if (path === ProjectResource.path.sdms || campusID !== ProjectResource.campus.campus_1) {
            return (
                <div className='menuWrap'>
                    {this.getUserInfo()}
                </div>
            )
        } else {
            return (
                <div className='menuWrap'>
                    {this.getUserInfo()}

                    <div className='navMenu'>
                        <button id='navMenuBtn' onClick={(e) => this.showMenu(e)}>네비게이션</button>
                        <div id='navMenu'>
                            <ul>
                                <li onClick={() => this.props.history.push(ProjectResource.path.dashboardMonitoring)}>{ProjectResource.ID.title.dashboardMonitoring}</li>
                                <li onClick={() => this.props.history.push(ProjectResource.path.dashboardMes)}>{ProjectResource.ID.title.dashboardMes}</li>
                                <li onClick={() => this.props.history.push(ProjectResource.path.sopSimulator)}>{ProjectResource.ID.title.sopSimulator}</li>
                                <li onClick={() => {
                                    userInfo && userInfo !== null && (parseInt(userInfo.levelID) === AccountResource.accountLevelID.master || parseInt(userInfo.levelID) === AccountResource.accountLevelID.generalAdmin) ? 
                                        this.props.history.push(ProjectResource.path.sopManager) : 
                                        this.showConfirmDialog(['권한이 없습니다.'], null, null, 'error')
                                    }}
                                >{ProjectResource.ID.title.sopManager}</li>
                                <li onClick={() => this.props.history.push(ProjectResource.path.history)}>{ProjectResource.ID.title.history}</li>
                                <li onClick={() => this.props.history.push(ProjectResource.path.teamEditor)}>{ProjectResource.ID.title.teamEditor}</li>
                            </ul>
                        </div>
                    </div>

                    <div className='settingMunu'>
                        <button onClick={() => this.onClickOpenPopup('settings')}>환경설정</button>
                    </div>
                </div>
            )
        }
    };

    getCampusName() {
        const path = this.props.path;
        let campusName = ProjectResource.campusName;

        if (path === ProjectResource.path.dashboardMonitoring) {
            return SdmsResource.ID.menu.dashboard;
        } 
        else if (path === ProjectResource.path.dashboardMes) {
            return "MES화면";
        } 
        else if (path === ProjectResource.path.teamEditor) {
            return ProjectResource.ID.title.teamEditor;
        } 
        else if (path === ProjectResource.path.history) {
            return ProjectResource.ID.title.history;
        } 
        else if (path === ProjectResource.path.sopManager) {
            return ProjectResource.ID.title.sopManager;
        } 
        else if (path === ProjectResource.path.sopSimulator) {
            return ProjectResource.ID.title.sopSimulator;
        } 
        else {
            return campusName;
        }
    }

    getModeName() {
        const path = this.props.path;
        let modeName = SdmsResource.ID.mode.monitoring;

        if (path === ProjectResource.path.monitoring) {
            let mode = SdmsResource.getMode();
    
            if (mode === SdmsResource.mode.monitoring) {
                modeName = SdmsResource.ID.mode.monitoring + "관리";
            } else if (mode === SdmsResource.mode.equipment) {
                modeName = SdmsResource.ID.mode.equipment + "관리";
            } else if (mode === SdmsResource.mode.equipmentDetail) {
                modeName = SdmsResource.ID.mode.equipment + "관리";
            }
    
            return <div className='modeName'>{modeName}</div>
        } 
    }

    onClickGoMain = () => {
        SdmsResource.setMode(SdmsResource.mode.monitoring);
        this.props.history.push(ProjectResource.path.monitoring);
    }

    moveToOutdoor = async () => {
        const campusID = ProjectResource.campusID;
        
        if (campusID) {
            const [zoneData, message] = await SdmsController.requestZoneData(20000);

            if (!zoneData) {
                if (message && message.length > 0) {
                    this.showConfirmDialog([message], null, null, 'error');
                }
            }
            else {
                const cameraPosition = {
                    x: zoneData.cameraPositionX,
                    y: zoneData.cameraPositionY,
                    z: zoneData.cameraPositionZ
                };

                const cameraRotation = {
                    x: zoneData.cameraRotationX,
                    y: zoneData.cameraRotationY,
                    z: zoneData.cameraRotationZ
                };

                this.props.wsManager.moveToOutdoor(campusID, cameraPosition, cameraRotation);

                this.props.onClickChangeMode(SdmsResource.mode.monitoring);
                this.props.checkMoveToOutdoor(true);
            }
        }
    }

    render() {
        // 경로에 따라 유저메뉴 위치 변경
        let path = window.location.pathname;
        let dashboard = null;
        let campusName = this.getCampusName();
        let campusID = ProjectResource.campusID;

        let position = path === ProjectResource.path.sdms || campusID === ProjectResource.campus.campus_2 ? 'right' : 'center';
        
        if (campusID === ProjectResource.campus.campus_1) {
            if (path === ProjectResource.path.dashboardMonitoring || 
                path === ProjectResource.path.dashboardMes ||
                path === ProjectResource.path.teamEditor ||
                path === ProjectResource.path.history ||
                path === ProjectResource.path.sopManager ||
                path === ProjectResource.path.sopSimulator) {
                dashboard = (
                    <img src={home_icon} alt='관제화면으로 이동' className='homeBtn' onClick={() => this.onClickGoMain()} />
                );
            }
            else if (path === ProjectResource.path.monitoring) {
                // (임시)관제화면 홈버튼 클릭시 외부영역으로 이동 
                dashboard = (
                    <img src={home_icon} alt='외부영역으로 이동' className='homeBtn' onClick={() => this.moveToOutdoor()} />
                );
            }
        }

        campusName = path !== ProjectResource.path.sdms ? 
            <span>{campusName}</span> : null

        return (
            <>
            <TitleBarComponent className='UI_Section titleBar' $position={position} $path={path}>
                <div className='titleWrap'>
                    <img src={nipa_logo} alt='타이틀바로고' className='logo' onClick={() => this.props.history.push(ProjectResource.path.sdms)} />
                    {campusName}
                    {dashboard}
                </div>
                {
                    campusID === ProjectResource.campus.campus_1 &&
                    this.getModeName()
                }
                {
                    this.getMenu()
                }
            </TitleBarComponent>

            {
                this.state.accountMgrPopupOpen &&
                <AccountManager 
                    onClickClosePopup={this.onClickClosePopup}
                />
            }

            {
                this.state.accountChangePwdPopupOpen &&
                <AccountChangePwd
                    onClickClosePopup={this.onClickClosePopup}
                />
            }

            {
                this.state.layoutSettingPopupOpen &&
                <LayoutSetting
                    onClickClosePopup={this.onClickClosePopup}
                    option3DNormal={this.props.option3DNormal}
                    option3DSensor={this.props.option3DSensor}
                    optionSopNormal={this.props.optionSopNormal}
                    getSettingsOption={this.props.getSettingsOption}
                    checkPopupStateReset={this.props.checkPopupStateReset}
                />
            }

            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClose={this.state.confirmMessage.onClose}
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    type={this.state.confirmMessage.type}
                />
            } 
            </>
		);
	}
}

export default withRouter(TitleBar);