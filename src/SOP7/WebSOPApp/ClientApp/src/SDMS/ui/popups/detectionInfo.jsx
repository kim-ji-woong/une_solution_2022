import React, { Component } from 'react';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import ProjectResource from '../../../Root/resource/id';
import { DetectionInfoComponent } from '../../../SDMS/styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';

// 이상탐지
class DetectionInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPressUIOn: false,
            detectTbodyUI1On: false,
            detectTbodyUI2On: false,
            detectTbodyUI3On: false,
            detectTbodyUI4On: false,
            detectTbodyUI5On: false,
            detectDataImageUI1On: false,
            detectDataImageUI2On: false,
            detectDataImageUI3On: false,
            detectDataImageUI4On: false,
            detectDataImageUI5On: false,

            selectValue: [],
            /* selectBox1: true,
            selectBox2: false */
        };

        this.presshandleClick = this.presshandleClick.bind(this);
        this.stick1handleClick = this.stick1handleClick.bind(this);
        this.stick2handleClick = this.stick2handleClick.bind(this);
        this.stick3handleClick = this.stick3handleClick.bind(this);
        this.stick4handleClick = this.stick4handleClick.bind(this);
        this.stick5handleClick = this.stick5handleClick.bind(this);

    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        //const target = document.getElementById("dsBot_" + this.props.popupType); 
        const target = document.getElementById("dsBot_" + SdmsResource.popupLayer.detectionInfo);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data?.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            }
        }.bind(this));

        //this.init();

        $('.detectionSelect').click(function () {
            $('.detectionOptionBox').toggle();
        });

        $('.activeOption2').click(function () {
            $('.detectionOptionBox').toggle();
        });

        $('.activeOption1').click(function () {
            $('.activeOption1').addClass('activeOption1Active');
        });

        $('.activeOption2').click(function () {
            $('.activeOption2').addClass('activeOption2Active');
        });
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        if (this.props.currentView !== prevProps.currentView) {
            if (this.props.currentView.buildingID === null || this.props.currentView.zoneID === null) {
                return;
            }

            const eqZoneDatas = this.getEqZoneDatas();
            this.setState({ eqZoneDatas, searchEqZoneText: '', showEqZoneDropDown: false, searchEqZoneDatas: [], selectedEqZone: null });
        }
    }

    repositionPopup(popupState) {
        let data = popupState.detectionInfo;

        if (data === null || data === undefined)
            return;

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    presshandleClick() {
        this.setState(prevState => ({
            isPressUIOn: !prevState.isPressUIOn,
        }));
    }

    stick1handleClick(){
        this.setState(prevState => ({
            detectTbodyUI1On: !prevState.detectTbodyUI1On,
            detectTbodyUI2On: false,
            detectTbodyUI3On: false,
            detectTbodyUI4On: false,
            detectTbodyUI5On: false,

            detectDataImageUI1On: !prevState.detectDataImageUI1On,
            detectDataImageUI2On: false,
            detectDataImageUI3On: false,
            detectDataImageUI4On: false,
            detectDataImageUI5On: false,

        }));

        $('.detectStick1Disable').toggleClass('detectStick1Active');
        $('.detectStick2Active').removeClass('detectStick2Active');
        $('.detectStick3Active').removeClass('detectStick3Active');
        $('.detectStick4Active').removeClass('detectStick4Active');
        $('.detectStick5Active').removeClass('detectStick5Active');
    }

    stick2handleClick(){

        this.setState(prevState => ({
            detectTbodyUI2On: !prevState.detectTbodyUI2On,
            detectTbodyUI1On: false,
            detectTbodyUI3On: false,
            detectTbodyUI4On: false,
            detectTbodyUI5On: false,

            detectDataImageUI2On: !prevState.detectDataImageUI2On,
            detectDataImageUI1On: false,
            detectDataImageUI3On: false,
            detectDataImageUI4On: false,
            detectDataImageUI5On: false,

        }));

        $('.detectStick2Disable').toggleClass('detectStick2Active');
        $('.detectStick1Active').removeClass('detectStick1Active');
        $('.detectStick3Active').removeClass('detectStick3Active');
        $('.detectStick4Active').removeClass('detectStick4Active');
        $('.detectStick5Active').removeClass('detectStick5Active');
    }

    stick3handleClick(){
        this.setState(prevState => ({
            detectTbodyUI3On: !prevState.detectTbodyUI3On,
            detectTbodyUI1On: false,
            detectTbodyUI2On: false,
            detectTbodyUI4On: false,
            detectTbodyUI5On: false,

            detectDataImageUI3On: !prevState.detectDataImageUI3On,
            detectDataImageUI1On: false,
            detectDataImageUI2On: false,
            detectDataImageUI4On: false,
            detectDataImageUI5On: false,

        }));

        $('.detectStick3Disable').toggleClass('detectStick3Active');
        $('.detectStick1Active').removeClass('detectStick1Active');
        $('.detectStick2Active').removeClass('detectStick2Active');
        $('.detectStick4Active').removeClass('detectStick4Active');
        $('.detectStick5Active').removeClass('detectStick5Active');
    }

    stick4handleClick(){
        this.setState(prevState => ({
            detectTbodyUI4On: !prevState.detectTbodyUI4On,
            detectTbodyUI1On: false,
            detectTbodyUI2On: false,
            detectTbodyUI3On: false,
            detectTbodyUI5On: false,

            detectDataImageUI4On: !prevState.detectDataImageUI4On,
            detectDataImageUI1On: false,
            detectDataImageUI2On: false,
            detectDataImageUI3On: false,
            detectDataImageUI5On: false,

        }));
        $('.detectStick4Disable').toggleClass('detectStick4Active');
        $('.detectStick1Active').removeClass('detectStick1Active');
        $('.detectStick2Active').removeClass('detectStick2Active');
        $('.detectStick3Active').removeClass('detectStick3Active');
        $('.detectStick5Active').removeClass('detectStick5Active');
    }

    stick5handleClick(){
        this.setState(prevState => ({
            detectTbodyUI5On: !prevState.detectTbodyUI5On,
            detectTbodyUI1On: false,
            detectTbodyUI2On: false,
            detectTbodyUI3On: false,
            detectTbodyUI4On: false,

            detectDataImageUI5On: !prevState.detectDataImageUI5On,
            detectDataImageUI1On: false,
            detectDataImageUI2On: false,
            detectDataImageUI3On: false,
            detectDataImageUI4On: false,

        }));

        $('.detectStick5Disable').toggleClass('detectStick5Active');
        $('.detectStick1Active').removeClass('detectStick1Active');
        $('.detectStick2Active').removeClass('detectStick2Active');
        $('.detectStick3Active').removeClass('detectStick3Active');
        $('.detectStick4Active').removeClass('detectStick4Active');
    }

    displayDetectGraphUI = () => {
        let detectGraphUI = [];

        if (this.state.isPressUIOn === true) {
            detectGraphUI.push(
                <>
                    <div className={'detectActiveImage'}></div>
                    <span className={'detectStick1Disable'} onClick={this.stick1handleClick}></span>
                    <span className={'detectStick2Disable'} onClick={this.stick2handleClick}></span>
                    <span className={'detectStick3Disable'} onClick={this.stick3handleClick}></span>
                    <span className={'detectStick4Disable'} onClick={this.stick4handleClick}></span>
                    <span className={'detectStick5Disable'} onClick={this.stick5handleClick}></span>
                </>);
        } else if (this.state.isPressUIOn === false) {
            detectGraphUI.push(
                <>
                   <div className={'detectImage'}></div>
                </>
            );
        }

        return detectGraphUI;
    }




    displayDetectTbodyUI = () => {
        let detectTbodyUI = [];
        console.log("detection : " + i18n.language)
        if (i18n.language === "ko") {
            if (this.state.detectTbodyUI1On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값(Mpa)</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>92</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>79</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>85</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.25</p>
                                <p className={'detectTbodyTrSpan'}>04:18:11</p>
                            </td>
                            <td>78,81,89,98</td>
                            <td>데이터 영역</td>
                            <td>평균: 86.5(MPa), 분산:60.25(MPa^2),분포:20(MPa)</td>
                        </tr>
                    </>);
            } else if (this.state.detectTbodyUI2On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값(Mpa)</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.06.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>8, 10</td>
                            <td>데이터 영역</td>
                            <td>평균:9(MPa), 분산:1(MPa^2),분포:2(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.06.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>16,18</td>
                            <td>데이터 영역</td>
                            <td>평균:17(MPa),분산:1(MPa^2),분포:2(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.06.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>13</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>-</p>
                                <p className={'detectTbodyTrSpan'}>-</p>
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI3On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값(Mpa)</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>95</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>80</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>75. 100</td>
                            <td>데이터 영역</td>
                            <td>평균:88(MPa), 분산:156.5(MPa^2),분포:25(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.25</p>
                                <p className={'detectTbodyTrSpan'}>04:18:11</p>
                            </td>
                            <td>85</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI4On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값(Mpa)</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>7</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>9</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>13</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.25</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>17</td>
                            <td>단일 데이터</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI5On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값(Mpa)</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>75,94</td>
                            <td>데이터 영역</td>
                            <td>평균:84.5(MPa),분산:90.25(MPa^2),분포:19(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>81,91</td>
                            <td>데이터 영역</td>
                            <td>평균:86(MPa),분산:25(MPa^2),분포:10(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.15</p>
                                <p className={'detectTbodyTrSpan'}>19:07:09</p>
                            </td>
                            <td>16,18</td>
                            <td>데이터 영역</td>
                            <td>평균:17(MPa),분산:1(MPa^2),분포:2(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.20</p>
                                <p className={'detectTbodyTrSpan'}>10:36:09</p>
                            </td>
                            <td>73,79</td>
                            <td>데이터 영역</td>
                            <td>평균:76(MPa),분산:9(MPa^2),분포:6(MPa)</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI1On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI2On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI3On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI4On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI5On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>발생 일시</th>
                            <th>이상 데이터 값</th>
                            <th>단일/영역 여부</th>
                            <th>통계 정보(평균, 분산, 분포 등)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            }
        } else if (i18n.language === "en") {
            if (this.state.detectTbodyUI1On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>92</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>79</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>85</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.04.25</p>
                                <p className={'detectTbodyTrSpan'}>04:18:11</p>
                            </td>
                            <td>78,81,89,98</td>
                            <td>Area of the data</td>
                            <td>mean: 86.5(MPa), variance:60.25(MPa^2),<br />distribution:20(MPa)</td>
                        </tr>
                    </>);
            } else if (this.state.detectTbodyUI2On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.06.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>8, 10</td>
                            <td>Area of the data</td>
                            <td>mean:9(MPa), variance:1(MPa^2),<br />distribution:2(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.06.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>16,18</td>
                            <td>Area of the data</td>
                            <td>mean:17(MPa),variance:1(MPa^2),<br />distribution:2(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.06.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>13</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>-</p>
                                <p className={'detectTbodyTrSpan'}>-</p>
                            </td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI3On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>95</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>80</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>75. 100</td>
                            <td>Area of the data</td>
                            <td>mean:88(MPa), variance:156.5(MPa^2),<br />distribution:25(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.08.25</p>
                                <p className={'detectTbodyTrSpan'}>04:18:11</p>
                            </td>
                            <td>85</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI4On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>7</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>9</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.20</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>13</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.09.25</p>
                                <p className={'detectTbodyTrSpan'}>19:36:09</p>
                            </td>
                            <td>17</td>
                            <td>Single data</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI5On === true) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.05</p>
                                <p className={'detectTbodyTrSpan'}>13:42:07</p>
                            </td>
                            <td>75,94</td>
                            <td>Area of the data</td>
                            <td>mean:84.5(MPa),variance:90.25(MPa^2),<br />distribution:19(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.10</p>
                                <p className={'detectTbodyTrSpan'}>17:29:10</p>
                            </td>
                            <td>81,91</td>
                            <td>Area of the data</td>
                            <td>mean:86(MPa),variance:25(MPa^2),<br />distribution:10(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.15</p>
                                <p className={'detectTbodyTrSpan'}>19:07:09</p>
                            </td>
                            <td>16,18</td>
                            <td>Area of the data</td>
                            <td>mean:17(MPa),variance:1(MPa^2),<br />distribution:2(MPa)</td>
                        </tr>
                        <tr>
                            <td>
                                <p className={'detectTbodyTrSpan'}>2023.10.20</p>
                                <p className={'detectTbodyTrSpan'}>10:36:09</p>
                            </td>
                            <td>73,79</td>
                            <td>Area of the data</td>
                            <td>mean:76(MPa),variance:9(MPa^2),<br />distribution:6(MPa)</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI1On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI2On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI3On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI4On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            } else if (this.state.detectTbodyUI5On === false) {
                detectTbodyUI.push(
                    <>
                        <tr>
                            <th>Time</th>
                            <th>Abnormal data value(Mpa)</th>
                            <th>Single / Area</th>
                            <th>Statistical information<br />(mean, variance, distribution, etc.)</th>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </>
                );
            }
        }

        return detectTbodyUI;

    }



    displayDetectDataImageUI = () => {
        let detectDataImageUI = [];

        if (this.state.detectDataImageUI1On === true) {
            if (i18n.language.toString() === "ko") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage4'}></div>
                    </>
                );
            } else if (i18n.language.toString() === "en") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage4En'}></div>
                    </>
                );
            }
        } else if (this.state.detectDataImageUI2On === true) {
            if (i18n.language.toString() === "ko") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage6'}></div>
                    </>
                );
            } else if (i18n.language.toString() === "en") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage6En'}></div>
                    </>
                );
            }
            
        } else if (this.state.detectDataImageUI3On === true) {
            if (i18n.language.toString() === "ko") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage8'}></div>
                    </>
                );
            } else if (i18n.language.toString() === "en") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage8En'}></div>
                    </>
                );
            }
            
        } else if (this.state.detectDataImageUI4On === true) {
            if (i18n.language.toString() === "ko") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage9'}></div>
                    </>
                );
            } else if (i18n.language.toString() === "en") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage9En'}></div>
                    </>
                );
            }

        } else if (this.state.detectDataImageUI5On === true) {
            if (i18n.language.toString() === "ko") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage10'}></div>
                    </>
                );
            } else if (i18n.language.toString() === "en") {
                detectDataImageUI.push(
                    <>
                        <div className={'detectDataImage10En'}></div>
                    </>
                );
            }

        } else if(this.state.detectDataImageUI1On === false && this.state.detectDataImageUI2On === false && this.state.detectDataImageUI3On === false && this.state.detectDataImageUI4On === false && this.state.detectDataImageUI5On === false){
             if (i18n.language.toString() === "ko") {
                 detectDataImageUI.push(
                     <>
                         <div className={'detectDataImage'}></div>
                     </>
                 );
             } else if (i18n.language.toString() === "en") {
                 detectDataImageUI.push(
                     <>
                         <div className={'detectDataImageEn'}></div>
                     </>
                 );
             }
             
        }
        return detectDataImageUI;
    } 


    setSelectValue = (target) => {
        const value = target.textContent;
        let selectValue = this.state.selectValue;

        if (selectValue.length === 2) {
            let newValue = [];
            newValue.push(value);
            this.setState({ selectValue: newValue });
        }
        else {
            selectValue.push(value);
            this.setState({ selectValue: selectValue });
        }
    }

    /* setSelectValue = (target, index) => {
        const value = target.textContent;
        let selectValue = this.state.selectValue;

        if(index === 1) {
            if(selectValue.length === 2) {
                let newValue = [];
                newValue.push(value);
                this.setState({ selectValue: newValue, selectBox1: false, selectBox2: true });
            }
            else {
                selectValue.push(value);
                this.setState({ selectValue: selectValue, selectBox1: false, selectBox2: true });
            }
        }
        else if(index === 2) {
            selectValue.push(value);
            this.handleSelectBox();
            this.setState({ selectValue: selectValue, selectBox1: true, selectBox2: false });
        }
    } */

    /* handleSelectBox = () => {
        const selectOption = document.getElementById('detectionOptionBox');

        if(selectOption) {
            selectOption.classList.toggle('on');
        }
    } */

    render() {
        const detectGraphUI = this.displayDetectGraphUI();
        const detectTbodyUI = this.displayDetectTbodyUI();
        const detectDataImageUI = this.displayDetectDataImageUI();

        const selectValue = this.state.selectValue;

        return (
            <DetectionInfoComponent id={this.props.popupType} className={'viewDetectionSection'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={1638}
                    popupMinHeight={837}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {i18n.t('sdms.detect.이상 탐지')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.detectionInfo, false)}></a>
                    </div>
                    <div className={'dslContDetect'}>
                        {/* <select className={'detectionSelect'}>
                    <option>전기분해기</option>
                    <option>전기분해기2</option>
                    <option>전기분해기3</option>
                  </select> */}

                        <div className={'detectionSelect'} /* onClick={() => this.handleSelectBox()} */>
                            {
                                selectValue.length > 0 &&
                                selectValue.map((data, index) => <span /* key={'select_' + index} */ id={'select' + index}>{data}</span>)
                            }
                        </div>

                        <div className={'detectionOptionBox'} /* id='detectionOptionBox' */ style={{ display: 'none' }}>
                            <div className={'detectFirstOption'}>
                                <span className={'activeOption1'} onClick={(e) => this.setSelectValue(e.target)}>{i18n.t('sdms.detect.전기분해기')}</span>
                                <span>{i18n.t('sdms.detect.전기분해기 생산 수소 공급')}</span>
                                <span>{i18n.t('sdms.detect.수소 트레일러용 하역 터미널')}</span>
                                <span>{i18n.t('sdms.detect.질소 정화 시스템')}</span>
                                <span>{i18n.t('sdms.detect.압력 용기')}</span>
                                <span>{i18n.t('sdms.detect.압축기')}</span>
                                <span>{i18n.t('sdms.detect.냉각 시스템')}</span>
                                <span>{i18n.t('sdms.detect.디스펜서')}</span>
                            </div>
                            <div className={'detectSecondOption'}>
                                <span>{i18n.t('sdms.detect.ELY 모듈')}</span>
                                <span>{i18n.t('sdms.detect.드라이어')}</span>
                                <span>{i18n.t('sdms.detect.압력 용기')}</span>
                                <span className={'activeOption2'} onClick={this.presshandleClick}><p onClick={(e) => this.setSelectValue(e.target)}>{i18n.t('sdms.detect.압축기')}</p></span>
                                <span>{i18n.t('sdms.detect.공냉식 열교환기1')}</span>
                                <span>{i18n.t('sdms.detect.공냉식 열교환기2')}</span>
                                <span>{i18n.t('sdms.detect.환기 시스템1')}</span>
                                <span>{i18n.t('sdms.detect.환기 시스템2')}</span>
                                <span>{i18n.t('sdms.detect.환기 시스템3')}</span>
                                <span>{i18n.t('sdms.detect.환기 시스템4')}</span>
                                <span>{i18n.t('sdms.detect.환기 시스템5')}</span>
                            </div>
                        </div>

                        {/* <div className={'detectionOptionBox'} id='detectionOptionBox'>
                        <div className={this.state.selectBox1 ? 'detectFirstOption on' : 'detectFirstOption'} onClick={this.state.selectBox1 ? ((e) => this.setSelectValue(e.target, 1)) : ''}>
                            <span>{SDMSResource.ID.detect.electrolyzerProduction}</span>
                            <span className={'disableOptionActive'}>{SDMSResource.ID.detect.electrolyzerProductionHydrogenSupply}</span>
                            <span>{SDMSResource.ID.detect.carryingTerminalForHydrogenTrailers}</span>
                            <span>{SDMSResource.ID.detect.nitrogenPurificationSystem}</span>
                            <span>{SDMSResource.ID.detect.pressureVessel}</span>
                            <span>{SDMSResource.ID.detect.compressor}</span>
                            <span>{SDMSResource.ID.detect.coolingSystem}</span>
                            <span>{SDMSResource.ID.detect.dispenser}</span>
                        </div>
                        <div className={this.state.selectBox2 ? 'detectSecondOption on' : 'detectSecondOption'} onClick={this.state.selectBox2 ? ((e) => this.setSelectValue(e.target, 2)) : ''}>
                            <span>{SDMSResource.ID.detect.elyModule}</span>
                            <span>{SDMSResource.ID.detect.dryer}</span>
                            <span>{SDMSResource.ID.detect.pressureVessel}</span>
                            <span onClick={this.presshandleClick}><p>{SDMSResource.ID.detect.compressor}</p></span>
                            <span>{SDMSResource.ID.detect.airCooledHeatExchanger1}</span>
                            <span>{SDMSResource.ID.detect.airCooledHeatExchanger2}</span>
                            <span>{SDMSResource.ID.detect.ventilationSystem1}</span>
                            <span>{SDMSResource.ID.detect.ventilationSystem2}</span>
                            <span>{SDMSResource.ID.detect.ventilationSystem3}</span>
                            <span>{SDMSResource.ID.detect.ventilationSystem4}</span>
                            <span>{SDMSResource.ID.detect.ventilationSystem5}</span>
                        </div>
                    </div> */}

                        {detectGraphUI}

                        <div className={'detectFlexBox'}>
                            <div className={'detectDetailTableBox'}>
                                <span>{i18n.t('sdms.detect.이상 진단 상세 정보')}</span>
                                <table className={'detectDetailTable'}>
                                    <colgroup>
                                        <col style={{ width: "15%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "45%" }} />
                                    </colgroup>
                                    <tbody>

                                        {detectTbodyUI}


                                    </tbody>
                                </table>

                            </div>
                            <div className={'detectDataBox'}>
                                <span>{i18n.t('sdms.detect.이상 진단 상세 데이터')}</span>

                                {/* <div className={'detectDataImage'}></div> */}

                                {detectDataImageUI}
                            </div>
                        </div>
                    </div>


                </PopupDraggable>
            </DetectionInfoComponent>
        );
    }
}

export default withTranslation()(DetectionInfo);