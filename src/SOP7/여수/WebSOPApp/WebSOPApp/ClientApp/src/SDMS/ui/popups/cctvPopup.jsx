import React, { Component, useState } from 'react';
import './../../css/popup.css';

import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';

import { SensorInfoBox } from './../../styled';
import { SensorTitleC } from './../../styled';
import { ReferenceTime } from './../../styled';
import { SeosorCloseIcon } from './../../styled';

import { CCTVView } from './../../styled';
import { CCTVlocationText } from './../../styled';
import { SensorNameA } from './../../styled';
import { DivideLine } from './../../styled';
import { SensorAddress } from './../../styled';
import { CameraViewBtn } from './../../styled';



class CCTVPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.isSubscribed = true;
    }

    componentDidMount() {

        $('.' + content.col1row1).dblclick(function () {
          $('.' + content.col1row1).toggleClass(content.full);
        });
        $('.' + content.col1row2).dblclick(function () {
            $('.' + content.col1row2).toggleClass(content.full);
        });
        $('.' + content.col2row1).dblclick(function () {
            $('.' + content.col2row1).toggleClass(content.full);
        });
        $('.' + content.col2row2).dblclick(function () {
            $('.' + content.col2row2).toggleClass(content.full);
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    componentWillUnmount() {
        this.isSubscribed = false;
    }

    setState = (state, callback) => {
        if (this.isSubscribed) {
            super.setState(state, callback);
        }
    }

    repositionPopup(popupState) {
        let data = popupState.cctvPopup;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardMiniMap)[0];
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

    render() {
        return (
            <>
                <div id={this.props.popupType} className={content.cctvPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={427}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        {/* 지능형 CCTV 팝업창 */}
                        <SensorInfoBox /* style={{ height: '391px' }} */>
                            <SensorTitleC>지능형 환경감시 CCTV</SensorTitleC>
                            <ReferenceTime>15:20:00 기준</ReferenceTime>
                            <SeosorCloseIcon onClick={() => this.props.setVisiblePopups(SDMS.menu.cctvPopup, false)}></SeosorCloseIcon>


                            {/*************************************************/}
                            <div className={content.viewDashboardCCTVConts}>
                                <div>
                                    <div className={content.viewDashboardCCTVview}>
                                        <div className={content.viewDashboardCCTVGrid}>
                                            <div className={content.col1row1}>
                                                <span id="cctv1_span">
                                                    <iframe id="cctv1" allowtransparency="yes" scrolling="no"></iframe>
                                                </span>
                                            </div>
                                            <div className={content.col2row1}>
                                                <span id="cctv2_span">
                                                    <iframe id="cctv2" allowtransparency="yes" scrolling="no"></iframe>
                                                </span>
                                            </div>
                                            <div className={content.col1row2}>
                                                <span id="cctv3_span">
                                                    <iframe id="cctv3" allowtransparency="yes" scrolling="no"></iframe>
                                                </span>
                                            </div>
                                            <div className={content.col2row2}>
                                                <span id="cctv4_span">
                                                    <iframe id="cctv4" allowtransparency="yes" scrolling="no"></iframe>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*************************************************/}

                            <div style={{ marginTop: '10px' }}>
                              <CCTVlocationText>
                                <SensorNameA>여수국가산단전망대</SensorNameA>
                                <DivideLine></DivideLine>
                                <SensorAddress>화치동 산 183-1</SensorAddress>
                              </CCTVlocationText>
                              <CameraViewBtn>추적카메라뷰</CameraViewBtn>
                            </div>
                        </SensorInfoBox>
                    </PopupDraggable>
                </div>
            </>
        );
    }

}

export default CCTVPopup;