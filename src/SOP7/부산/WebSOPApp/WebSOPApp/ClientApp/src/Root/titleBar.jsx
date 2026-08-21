import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProjectResource from './resource/id';
import RootResource from './resource/id';
import ActionStore from '../SDMS/services/actionStore';

import { TitleBarComponent } from './styled/titleBarStyled';
import { RangeFindingComponent, KeyMapComponent } from '../SDMS/styled/sdmsPopupsStyled';
import Clock from '../Common/ui/clock';
import busan_typo from '../Common/images/busan_typo.svg';
import menu from './images/menu.svg';
import setting from './images/setting.svg';
import user_menu from './images/user_menu.svg';
import navigation from './images/navigation.svg';
import nav_1 from './images/nav_1.svg';
import nav_2 from './images/nav_2.svg';
import nav_3 from './images/nav_3.svg';
import nav_4 from './images/nav_4.svg'; 
import nav_5 from './images/nav_5.svg';
import nav_5_1 from './images/nav_5_1.svg';
import nav_6 from './images/nav_6.svg';
import nav_7 from './images/nav_7.svg';
import tooltip_icon from '../SDMS/images/tooltip_icon.svg';

import LayoutSetting from '../Settings/ui/layoutSetting';
import MyPage from '../Account/ui/myPage';
import ChangePwd from '../Account/ui/changePwd';
import AccountManager from '../Account/ui/accountManager';
import SessionString from "../Common/js/sessionString";
import {SDMSController} from "../SDMS/services/sdmsController";
import {SettingsController} from "../Settings/services/settingsController";
import SopSimulatorController from "../SOPSimulator/services/sopSimulatorController";
import {AccountController} from "../Account/services/accountController";
import SettingsResource from "../Settings/resource/id";
import Loader from "../Common/ui/loader";


class TitleBar extends Component {
    static pathSDMS = '/sdms';
    static pathSOPSimulator = '/sop-simulator';
    static pathSOPManager = '/sop-manager';
    static pathHistory = '/history';
    static pathTeam = '/team';

    constructor(props) {
        super(props);

        this.state = {
            showSettingPopup: false,
            showMenuPopup: false,
            showUserMenuPopup: false,
            showMyPagePopup: false,
            showChangePwdPopup: false,
            showAccountManagerPopup: false,
            showRangeFindingPopup: false,
            showKeyMapPopup: false,
            showNavBar: false,
            autoRotation: false,
            accountUsers: null,
            
            totalDistance: 0, // m
        }
        
        ActionStore.subscribe( function () {
            let data = ActionStore.getState();
            if (data.actionType === 'OFF_MEASURE_DISTANCE') {
                this.processMeasureDistanceWithAlarm(data.offMeasureDistance);
            }
        }.bind(this));
        
        this.wsMgr = this.props.getWebSocket();
        this.init();
        
        this.loadingTimer = null;
    }
    
    componentDidMount() {
        SettingsController.startWatchTimer();
        SopSimulatorController.StartWatchTimer();
        
        //AccountController.StartWatchTimer();
        
        if (!this.wsMgr.getTitleBar()) {
            this.wsMgr.setTitleBar(this);
        }
        
        const userInfo = ProjectResource.getUserInfo()
    }

    componentDidUpdate() {
        document.addEventListener("click", (e) => {
            let target = e.target;

            if (target.id === 'menuBtn' || target.id === 'userBtn') {
                return;
            } else {

                if (this.state.showMenuPopup || this.state.showUserMenuPopup) {
                    let userMenu = document.getElementById('userMenu');
                    let navMenu = document.getElementById('navMenu');
    
                    if (userMenu === null || navMenu === null) {
                        return;
                    }
                    
                    this.setState({ showMenuPopup: false, showUserMenuPopup: false });
                }
            }
        });
    }

    init = async () => {
        const accountUsers = await AccountController.getAccountUsers(ProjectResource.Site.Busan);

        if (!accountUsers) {
            this.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["계정 및 권한 정보를 불러오는데 실패하였습니다."], null, null);
            return;
        }
        this.setState({ accountUsers });
    }

    processMeasureDistanceWithAlarm = (data) => {
        if (!data) {
            return;
        }
        
        this.handlePopup('rangeFinding', false);
        if (this.wsMgr) {
            if (this.wsMgr.connected) {

                let content = {
                    "value": false
                };
                
                ActionStore.dispatch({
                    type: 'isOnMeasureDistance',
                    isOnMeasureDistance: false
                });

                ActionStore.dispatch({
                    type: 'offMeasureDistance',
                    offMeasureDistance: false
                });
                
                this.wsMgr.sendMeasurementMode(content);
            }
        }
    }

    handlePopup = (type, isShow) => {
        
        if (type === 'setting') {
            this.setState({ showSettingPopup: isShow });
        }
        if (type === 'accountManager') {
            this.setState({ showAccountManagerPopup: isShow });
        }
        else if (type === 'menu') {

            if (!this.state.showMenuPopup && this.state.showUserMenuPopup) {
                this.setState({ showMenuPopup: true, showUserMenuPopup: false });
            }
            else {
                this.setState({ showMenuPopup: !this.state.showMenuPopup });
            }
        }
        else if (type === 'userMenu') {

            if (!this.state.showUserMenuPopup && this.state.showMenuPopup) {
                this.setState({ showUserMenuPopup: true, showMenuPopup: false });
            }
            else {
                this.setState({ showUserMenuPopup: !this.state.showUserMenuPopup });
            }
        }
        else if (type === 'myPage') {

            if (isShow) {
                this.setState({ showMyPagePopup: isShow, showChangePwdPopup: false });
            }
            else {
                this.setState({ showMyPagePopup: isShow });
            }
        }
        else if (type === 'changePwd') {

            if (isShow) {
                this.setState({ showChangePwdPopup: isShow, showMyPagePopup: false });
            }
            else {
                this.setState({ showChangePwdPopup: isShow });
            }
        }
        else if (type === 'rangeFinding') {
            if (this.wsMgr) {
                if (this.wsMgr.connected) {
                    let content = {
                        "value": isShow ? 1 : 0
                    }
                    this.wsMgr.sendMeasurementMode(content);
                }
                
                ActionStore.dispatch({
                    type: 'IS_ON_MEASURE_DISTANCE',
                    isOnMeasureDistance: isShow
                });
            }
            
            if (this.state.showRangeFindingPopup !== isShow) {
                if (this.props.menuEvent && this.props.menuEvent.handleVisiblePopups) {
                    this.props.menuEvent.handleVisiblePopups(isShow);
                }
            }
            
            let isLoading = this.state.isLoading;
            if (!isShow)
                isLoading = true;
            
            if (isLoading) {
                this.loadingTimer = setTimeout(() => {
                    this.setState({ isLoading: false });
                }, 5000);
                
                this.setState({ showRangeFindingPopup: isShow, isLoading });
            }
            
            if (!isLoading) {
                this.setState({showRangeFindingPopup: isShow});
            }
        }
        else if (type === 'keyMap') {
            this.setState({ showKeyMapPopup: isShow });
        }
    }
    
    setTotalDistance = (totalDistance) => {
        this.setState({ totalDistance: totalDistance });
    }
    
    onClickMovePage = (path) => {
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                
                let menuType = null;
                if (path === ProjectResource.path.sdms) {
                    menuType = 1;
                }
                else if (path === ProjectResource.path.sopSimulator) {
                    menuType = 2;
                }
                else if (path === ProjectResource.path.sopManager) {
                    menuType = 3;
                }
                else if (path === ProjectResource.path.history) {
                    menuType = 4;
                }
                else if (path === ProjectResource.path.teamEditor) {
                    menuType = 5;
                }
                
                let parameter = {
                    "menuType": menuType
                }
                this.wsMgr.sendCheckMenuState(parameter);
            }
        }
        this.props.history.push(path);
    }

    getMenu = () => {
        const { showMenuPopup } = this.state;

        return (
            <div id='navMenu' className={showMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => this.onClickMovePage(ProjectResource.path.sdms)}>{ProjectResource.ID.title.sdms}</li>
                    <li onClick={() => this.onClickMovePage(ProjectResource.path.sopSimulator)}>{ProjectResource.ID.title.sopSimulator}</li>
                    <li onClick={() => this.onClickMovePage(ProjectResource.path.sopManager)}>{ProjectResource.ID.title.sopManager}</li>
                    <li onClick={() => this.onClickMovePage(ProjectResource.path.history)}>{ProjectResource.ID.title.history}</li> 
                    <li onClick={() => this.onClickMovePage(ProjectResource.path.teamEditor)}>{ProjectResource.ID.title.teamEditor}</li>
                </ul>
            </div>
        );
    };

    getUserMenu = () => {
        const { showUserMenuPopup } = this.state;
        const userInfo = ProjectResource.getUserInfo();
        //console.log(userInfo);
        let userLevel = "";
        let userID = "";


        if (userInfo !== null && userInfo !== undefined) {
            userLevel = userInfo.level;
            userID = userInfo.userID;
        }

        return (
            <div id='userMenu' className={showUserMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => this.handlePopup('myPage', true)}>
                        <p>{userLevel}</p>
                        <p>ID : {userID}</p>
                    </li>
                    <li onClick={() => this.handlePopup('accountManager', true)}>계정 및 권한</li>
                    <li onClick={() => this.onClickLogout()}>로그아웃</li>
                </ul>
            </div>
        );
    };

    onClickLogout = () => {
        // 세션 초기화
        window.localStorage.removeItem(SessionString.Key.account);
        
        // Logout 신호
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendCheckLogout();
            }
        }
        // 메인 페이지 이동
        this.props.history.push('/');
    }

    handleNavBar = () => {
        this.setState({ showNavBar: !this.state.showNavBar });

        const btns = document.getElementById('navigationBtns');
        if(!this.state.showNavBar) {
            btns.classList.add('on');
            btns.classList.remove('off');
        }
        else {
            btns.classList.add('off');
            btns.classList.remove('on');
        }
    }
    
    onClickOriginViewport = async () => {
        const viewport = await SDMSController.requestViewport();
        if (!viewport)
            return;
        
        let content = {
            "spaceID": viewport.spaceID,
            "cameraInfo": {
                "position": {
                    "x": viewport.locationX,
                    "y": viewport.locationY,
                    "z": viewport.locationZ,
                },
                "rotation": {
                    "x": viewport.rotationX,
                    "y": viewport.rotationY,
                    "z": viewport.rotationZ,
                },
                "zoom": viewport.zoom
            }
        }
        
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendMoveToInitialScreen(content);
            }
        }
    }
    
    onClickSaveOriginViewport = async () => {
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendRequestCameraLocation();
                // wsProcessManager에서 responseCameraLocation 함수 호출 후 값 저장
            }
        }
    }
    
    onClickZoomIn = () => {
        
        let zoomIn = {
            "value": 1
        }
        
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendZoom(zoomIn);
            }
        }
    }
    
    onClickZoomOut = () => {

        let zoomOut = {
            "value": 0
        }
        
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendZoom(zoomOut);
            }
        }
    }

    getNavigationBtn = () => {
        const path = window.location.pathname;
        const { showNavBar, autoRotation, showRangeFindingPopup, showKeyMapPopup } = this.state;

        if (path === ProjectResource.path.sdms) {
            return (
                <>
                    <button className={showNavBar ? 'navigationBtn on' : 'navigationBtn off'} onClick={() => this.handleNavBar()}>
                        <img src={navigation} alt='네비게이션 버튼' width={20} height={20} />
                    </button>
                    <ul className={'navigationBtn item'} id='navigationBtns'>
                        <li>
                            <button>
                                <img src={nav_1} alt='초기화면 버튼' width={20} height={20} onClick={() => this.onClickOriginViewport()} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <img src={nav_2} alt='초기화면 지정 버튼' width={20} height={20} onClick={() => this.onClickSaveOriginViewport()}/>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.onClickZoomIn()}>
                                <img src={nav_3} alt='확대 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.onClickZoomOut()}>
                                <img src={nav_4} alt='축소 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button onClick={(e) => this.handleAutoRotation(e)}>
                                <img src={autoRotation ? nav_5 : nav_5_1} alt='자동회전 ON 버튼' width={20} height={autoRotation ? 20 : 21} />
                            </button>
                        </li>
                        <li className={showRangeFindingPopup ? 'on' : null} onClick={() => this.handlePopup('rangeFinding', !this.state.showRangeFindingPopup)}>
                            <button>
                                <img src={nav_6} alt='거리측정 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li className={showKeyMapPopup ? 'on' : null} onClick={() => this.handlePopup('keyMap', !this.state.showKeyMapPopup)}>
                            <button>
                                <img src={nav_7} alt='키 맵 버튼' width={20} height={20} />
                            </button>
                        </li>
                    </ul>
                </>
            );
        }
        else {
            return null;
        }
    }

    handleAutoRotation = (e) => {
        e.stopPropagation();
        
        let autoRotation = {
            "value": !this.state.autoRotation
        }
        
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendAutoRotation(autoRotation);
            }
        }
        
        this.setState({ autoRotation: !this.state.autoRotation });
    }
    
    onClickLogo = () => {
        
        // 해당 페이지의 메인(초기) 페이지 이동
        const path = window.location.pathname;
        if (path === ProjectResource.path.sdms) {
            if (this.props.menuEvent && this.props.menuEvent.onClickLogo) {
                this.props.menuEvent.onClickLogo();
            }
        } else if (path === ProjectResource.path.sopSimulator) {
            if (this.props.menuEvent && this.props.menuEvent.onClickLogo) {
                this.props.menuEvent.onClickLogo();
            }
        } else if (path === ProjectResource.path.sopManager) {
            
        } else if (path === ProjectResource.path.history) {
            
        } else if (path === ProjectResource.path.teamEditor) {
            
        }

        this.props.history.push(path);
    }

    render() {
        const { showSettingPopup, showMenuPopup, showUserMenuPopup, showMyPagePopup, showChangePwdPopup, showAccountManagerPopup, showRangeFindingPopup, showKeyMapPopup } = this.state;

        const path = window.location.pathname;

        return (
            <>
                {this.state.isLoading &&
                    <Loader 
                    degree={undefined} 
                    />
                }
                <TitleBarComponent $autoRotation={this.state.autoRotation} className={"UI_Section"}>
                    <div>
                        <img id={"Busan_Logo"} src={busan_typo} alt='부산시 로고' width={100} height={25} onClick={() => this.onClickLogo()}/>
                        <Clock />
                    </div>
                    <div>
                        <button 
                            className={showSettingPopup ? 'on' : null}
                            onClick={() => this.handlePopup('setting', true)}
                        >
                            <img src={setting} alt='환경설정 버튼' />
                        </button>
                        <button
                            className={showMenuPopup ? 'on' : null}
                            onClick={() => this.handlePopup('menu')}
                        >
                            <img src={menu} alt='메뉴 버튼' id='menuBtn' />
                        </button>
                        {
                            this.getMenu()
                        } 
                        <button
                            className={showUserMenuPopup ? 'on' : null}
                            onClick={() => this.handlePopup('userMenu')}
                        >
                            <img src={user_menu} alt='사용자메뉴 버튼' id='userBtn' />
                        </button>
                        {
                            this.getUserMenu()
                        }
                        {
                            this.getNavigationBtn()
                        }
                    </div>
                </TitleBarComponent>
                {
                    showSettingPopup &&
                    <LayoutSetting
                        handlePopup={this.handlePopup}
                        getWebSocket={this.props.getWebSocket}
                    />
                }
                {
                    showMyPagePopup &&
                    <MyPage
                        handlePopup={this.handlePopup}
                        accountUsers={this.state.accountUsers}
                    />
                }
                {
                    showChangePwdPopup &&
                    <ChangePwd
                        handlePopup={this.handlePopup}
                    />
                }
                {
                    showAccountManagerPopup &&
                    <AccountManager
                        handlePopup={this.handlePopup}
                    />
                }
                {
                    (showRangeFindingPopup && path === ProjectResource.path.sdms) &&
                    <RangeFinding
                        handlePopup={this.handlePopup}
                        totalDistance={this.state.totalDistance}
                    />
                }
                {
                    (showKeyMapPopup && path === ProjectResource.path.sdms) &&
                    <KeyMap
                        handlePopup={this.handlePopup}
                    />
                }
            </>
        );
    }
}

export default withRouter(TitleBar);


// 거리측정 팝업
class RangeFinding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: false
        }
    }

    render() {
        const { start } = this.state;

        return (
            <RangeFindingComponent className={"UI_Section"}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        거리측정
                    </h5>
                    <button className='dslX' onClick={() => this.props.handlePopup('rangeFinding', false)}>닫기</button>
                </div>
                <div className='rangeContent'>
                    <ul className='range'>
                        {
                            !start ?
                            <li>시작점을 선택하여<br />거리를 측정해주세요.</li> :
                            <li>‘ESC’키를 눌러<br />측정을 마칠 수 있습니다.</li>
                        }
                    </ul>
                    <ul className='total'>
                        <li className={start ? 'on' : null}>
                            <p>총 거리</p>
                            <p>{this.props.totalDistance ? 
                                this.props.totalDistance + 'm' :
                                '0' + 'm'
                            }</p>
                        </li>
                    </ul>
                </div>
            </RangeFindingComponent>
        );
    }
} 


// 키 맵 팝업
class KeyMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {

        return (
            <KeyMapComponent className={"UI_Section"}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        키 맵 도움말
                    </h5>
                    <button className='dslX' onClick={() => this.props.handlePopup('keyMap', false)}>닫기</button>
                </div>
                <div className='keyMapContent'>
                    <ul>
                        <li>
                            <p>TOP</p>
                            <div>
                                <p>Ctrl</p>
                                <p>T</p>
                            </div>
                        </li>
                        <li>
                            <p>FRONT</p>
                            <div>
                                <p>Ctrl</p>
                                <p>F</p>
                            </div>
                        </li>
                        <li>
                            <p>LEFT</p>
                            <div>
                                <p>Ctrl</p>
                                <p>L</p>
                            </div>
                        </li>
                        <li>
                            <p>RIGHT</p>
                            <div>
                                <p>Ctrl</p>
                                <p>R</p>
                            </div>
                        </li>
                        <li>
                            <p>ISO</p>
                            <div>
                                <p>Ctrl</p>
                                <p>S</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </KeyMapComponent>
        );
    }
}