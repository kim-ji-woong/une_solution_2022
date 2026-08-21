import React, { Component } from 'react';

import './../../css/popup.css';

import $ from 'jquery';
import SDMSResource from '../../resource/id';
import content from '../../../Common/css/content.module.css';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';

import { NavbarArea } from './../../styled';
import { NaviIcon } from './../../styled';
import { HomeIcon } from './../../styled';
import { ViewIcon } from './../../styled';
import { ZoomInIcon } from './../../styled';
import { ZoomOutIcon } from './../../styled';
import { TurnOn } from './../../styled';
import { TurnOff } from './../../styled';

import ProjectResource from '../../../Root/resource/id';

import ConfirmDialog from '../../../Common/ui/confirmDialog';


class NavInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.initPopupState = this.initPopupState.bind(this);
        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {

        this.initPopupState();


        $(document).ready(function () {
            /* $(".slide-toggle").click(function () {
                $(".box").animate({
                    width: "toggle"
                });
            }); */

            $(".slide-toggle").click(function () {
                $(".box").animate({ width: "toggle" }, 400);

            });
        });

        $(document).ready(function () {
            $(".slide-toggle2").click(function () {
                $(".box2").animate({
                    width: "toggle"
                });
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        //this.setScrollbar();
    }

    initPopupState() {
        var popup = document.getElementsByClassName(content.navInfo)[0];

        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.navInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    moveToOrigin() {
        if (this.props.wsMgr) {
            this.props.wsMgr.moveCameraToTarget(0); // 시작 위치로 이동
        }
    }

    requestViewport() {
        if (this.props.wsMgr) {
            this.props.wsMgr.requestCameraLocation();

            this.showConfirmDialog("성공", ["기본 뷰 설정을 완료하였습니다."], this.state.confirmMessage.buttons, this.onCloseConfirmDialog());
        }
    }

    zoom(zoomIn) {
        if (this.props.wsMgr) {
            this.props.wsMgr.zoomCamera(zoomIn);
        }
    }

    showConfirmDialog = (title, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

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

    /* displayNavUI = () => {
        const autoRotation = this.props.autoRotation ? "modeOn" : "modeOff";

        if (ProjectResource.SiteID === ProjectResource.Site.Yeosu) {
            return
            <>
                <div id="dsNav">
                    <button className="slide-toggle"></button>
                    <div className="box">
                        <ul className="dsnMenu box-inner">
                            <li><a onClick={() => this.moveToOrigin()}></a></li>
                            <li><a onClick={() => this.requestViewport()}></a></li>
                            <li><a onClick={() => this.zoom(true)}></a></li>
                            <li><a onClick={() => this.zoom(false)}></a></li>
                            <li><a className={autoRotation} onClick={() => this.props.setAutoRotation(!this.props.autoRotation)}></a></li>
                            <li><a></a></li>
                        </ul>
                    </div>
                </div>
            </>
        } else if (ProjectResource.SiteID === ProjectResource.Site.Busan) {
            return
            <>
                <div id="dsNavBusan">
                   <span>네비게이션</span>
                   <button className="slide-toggle"></button>
                   <div className="navArea">
                     <ul className="dsnMenu box-inner">
                        <li><a onClick={() => this.moveToOrigin()}></a></li>
                        <li><a onClick={() => this.requestViewport()}></a></li>
                        <li><a onClick={() => this.zoom(true)}></a></li>
                        <li><a onClick={() => this.zoom(false)}></a></li>
                        <li><a className={autoRotation} onClick={() => this.props.setAutoRotation(!this.props.autoRotation)}></a></li>
                     </ul>
                   </div>
                </div>
            </>
        }
        return <></>
    } */


    render() {
        const autoRotation = this.props.autoRotation ? "modeOn" : "modeOff";

        return (
            <>
                <div id={this.props.popupType} className={content.navInfo + " " + SDMSResource.UISection}>
                   <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={215}
                        popupMinHeight={40}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    > 

                      {/* <div id="dsNav2">
                       <NaviIcon className="slide-toggle2"></NaviIcon>
                       <NavbarArea>
                         <div className="box2">
                           <ul className="box-inner2">
                             <HomeIcon></HomeIcon>
                             <ViewIcon></ViewIcon>
                             <ZoomInIcon></ZoomInIcon>
                             <ZoomOutIcon></ZoomOutIcon> 
                             <TurnOn></TurnOn> 
                             <TurnOff></TurnOff>
                           </ul>
                         </div>
                       </NavbarArea> 
                     </div> */}

                     <div id="dsNav">
                        <button className="slide-toggle"></button>
                        <div className="box">
                            <ul className="dsnMenu box-inner">
                                <span data-tooltip="초기화면"><li><a onClick={() => this.moveToOrigin()}></a></li></span>
                                <span data-tooltip="기본뷰로 설정"><li><a onClick={() => this.requestViewport()}></a></li></span>
                                <span data-tooltip="확대"><li><a onClick={() => this.zoom(true)}></a></li></span>
                                <span data-tooltip="축소"><li><a onClick={() => this.zoom(false)}></a></li></span>
                                <span data-tooltip="자동회전"><li><a className={autoRotation} onClick={() => this.props.setAutoRotation(!this.props.autoRotation)}></a></li></span>
                                <li><a></a></li>
                            </ul>
                        </div>
                     </div> 

                    {/*  {
                        this.displayNavUI()
                    } */}

                  </PopupDraggable>
                </div>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </>
        );
    }
};

export default NavInfo;