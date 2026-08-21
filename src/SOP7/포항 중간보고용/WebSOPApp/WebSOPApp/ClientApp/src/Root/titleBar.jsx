import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProjectResource from './resource/id';
import RootResource from './resource/id';

import { TitleBarComponent } from './styled/titleBarStyled';
import { RangeFindingComponent, KeyMapComponent } from '../SDMS/styled/sdmsPopupsStyled';
import Clock from '../Common/ui/clock';
import pohang_logo from '../Common/images/pohang_logo.svg';
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
            autoRotation: false
        }
        
        this.wsMgr = this.props.getWebSocket();
    }
    
    componentDidMount() {
        SDMSController.StartWatchTimer();
        SettingsController.startWatchTimer();
        SopSimulatorController.StartWatchTimer();
        
        //AccountController.StartWatchTimer();
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
            this.setState({ showRangeFindingPopup: isShow });
        }
        else if (type === 'keyMap') {
            this.setState({ showKeyMapPopup: isShow });
        }
    }

    getMenu = () => {
        const { showMenuPopup } = this.state;

        // return (
        //     <div id='navMenu' className={showMenuPopup ? 'on' : 'off'}>
        //         <ul>
        //             <li onClick={() => this.props.history.push(ProjectResource.path.sdms)}>{ProjectResource.ID.title.sdms}</li>
        //             <li onClick={() => this.props.history.push(ProjectResource.path.sopSimulator)}>{ProjectResource.ID.title.sopSimulator}</li>
        //             <li onClick={() => this.props.history.push(ProjectResource.path.sopManager)}>{ProjectResource.ID.title.sopManager}</li>
        //             <li onClick={() => this.props.history.push(ProjectResource.path.history)}>{ProjectResource.ID.title.history}</li> 
        //             <li onClick={() => this.props.history.push(ProjectResource.path.teamEditor)}>{ProjectResource.ID.title.teamEditor}</li>
        //         </ul>
        //     </div>
        // );

        return (
            <div id='navMenu' className={showMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => this.props.history.push(ProjectResource.path.sopSimulator)}>{ProjectResource.ID.title.sopSimulator}</li>
                    <li onClick={() => this.props.history.push(ProjectResource.path.sopManager)}>{ProjectResource.ID.title.sopManager}</li>
                </ul>
            </div>
        );
    };

    getUserMenu = () => {
        const { showUserMenuPopup } = this.state;

        return (
            <div id='userMenu' className={showUserMenuPopup ? 'on' : 'off'}>
                <ul>
                    <li onClick={() => this.handlePopup('myPage', true)}>
                        <p>총괄관리자</p>
                        <p>ID : admin1234</p>
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
                                <img src={nav_1} alt='초기화면 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <img src={nav_2} alt='초기화면 지정 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <img src={nav_3} alt='확대 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button>
                                <img src={nav_4} alt='축소 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li>
                            <button onClick={(e) => this.handleAutoRotation(e)}>
                                <img src={autoRotation ? nav_5 : nav_5_1} alt='자동회전 ON 버튼' width={20} height={autoRotation ? 20 : 21} />
                            </button>
                        </li>
                        <li className={showRangeFindingPopup ? 'on' : null} onClick={() => this.handlePopup('rangeFinding', true)}>
                            <button>
                                <img src={nav_6} alt='거리측정 버튼' width={20} height={20} />
                            </button>
                        </li>
                        <li className={showKeyMapPopup ? 'on' : null} onClick={() => this.handlePopup('keyMap', true)}>
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
        this.setState({ autoRotation: !this.state.autoRotation });
    }

    render() {
        const { showSettingPopup, showMenuPopup, showUserMenuPopup, showMyPagePopup, showChangePwdPopup, showAccountManagerPopup, showRangeFindingPopup, showKeyMapPopup } = this.state;

        const path = window.location.pathname;

        return (
            <>
                <TitleBarComponent $autoRotation={this.state.autoRotation} className={"UI_Section"}>
                    <div>
                        <img src={pohang_logo} alt='포항시 로고' width={80} height={26} />
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
            spot1: 2.7,
            spot2: null,
            spot3: null,
            spot4: null
        }
    }

    render() {
        const { spot1, spot2, spot3, spot4 } = this.state;

        return (
            <RangeFindingComponent $spot={spot1}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        거리측정
                    </h5>
                    <button className='dslX' onClick={() => this.props.handlePopup('rangeFinding', false)}>닫기</button>
                </div>
                <div className='rangeContent'>
                    <ul className='range'>
                        {
                            !spot1 ?
                            <li className='nodata'>시작점을 선택하여<br />거리를 측정해주세요.</li> :
                            <>
                                <li className={spot1 ? 'on' : null}>
                                    <p>1번 지점</p>
                                    <p>{spot1}km</p>
                                </li>
                                <li className={spot2 ? 'on' : null}>
                                    <p>2번 지점</p>
                                    {spot2 ? <p>{spot2}km</p> : <p>-</p>}
                                </li>
                                <li className={spot3 ? 'on' : null}>
                                    <p>3번 지점</p>
                                    {spot3 ? <p>{spot3}km</p> : <p>-</p>}
                                </li>
                                <li className={spot4 ? 'on' : null}>
                                    <p>4번 지점</p>
                                    {spot4 ? <p>{spot4}km</p> : <p>-</p>}
                                </li>
                            </>
                        }
                    </ul>
                    <ul className='total'>
                        <li className='on'>
                            <p>총 길이</p>
                            <p></p>
                        </li>
                        <li>
                            <p>총 면적</p>
                            <p>-</p>
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
            <KeyMapComponent>
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