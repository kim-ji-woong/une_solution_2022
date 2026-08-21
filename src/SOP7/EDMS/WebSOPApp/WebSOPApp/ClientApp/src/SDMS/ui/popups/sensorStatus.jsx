import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import SDMS from '../sdms';
import SDMSMainMenu from '../sdmsMainMenu';
import SDMSResource from '../../resource/id';
import popup from '../../../SDMS/css/popup.module.css';
import Contents3D from '../3D/contents3D';
import '../../../SDMS/css/pop.css';
import '../../../SDMS/js/active.js';

import PopupDraggable from './popupDraggable';
import $ from 'jquery';
import { height } from '@amcharts/amcharts4/.internal/core/utils/Utils';


class SensorStatus extends Component {
    // 한 페이지에 센서가 몇개까지 표시되는가?
    static ItemCountPerPage = 10;
    // 페이지 번호는 화면에서 몇개까지 표시되는가?
    static PaginationCount = 5;

    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 600,
            popupMinHeight: 400,
            //pagingUI: true, /* 페이지 번호 */
            pageIndex: 0,
            showPsm: true,
            showEtc: true,
            orderBySensorID: true,
            searchText: '',
            bigSize: false
        };

        this.props = props;

        this.refAllView = React.createRef();
        this.refPsmButton = React.createRef();
        this.refEtcButton = React.createRef();
        this.refOrderBySensorValue = React.createRef();
        this.refOrderBySensorID = React.createRef();
        this.refSearchText = React.createRef();

        this.maxPageNumber = 1;

        if (this.props.cctvList !== null && this.props.cctvList !== "" && this.props.cctvList !== undefined)
            this.state.cctvList = this.props.cctvList;

        /*SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));*/

        if (SDMS.UseWalkingAvatar) {
            this.refPosX = React.createRef();
            this.refPosY = React.createRef();
            this.refPosZ = React.createRef();
            this.refScaleX = React.createRef();
            this.refScaleY = React.createRef();
            this.refScaleZ = React.createRef();
        }
    }


    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수직
            case 'v-b': // 바텀 수직
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    //그리드 사이즈를 부모(팝업) 사이즈 비율대로 조절
                    const grid = this.findElementByClassName(popup.sensorViewGrid);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(popup.sensorViewGrid);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(popup.sensorViewGrid);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(popup.sensorViewGrid);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(popup.sensorViewGrid);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(popup.sensorViewGrid);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            default:
        }
    }


    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
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

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        function draw(max, classname, colorname) {
            var i = 1;
            var func1 = setInterval(function () {
                if (i < max) {
                    color1(i, classname, colorname);
                    i++;
                } else {
                    clearInterval(func1);
                }
            }, 10);
        }
        function color1(i, classname, colorname) {
            $(classname).css({
                "background": "conic-gradient(" + colorname + " 0% " + i + "%, #ffffff " + i + "% 100%)"
            });
        }

        /* $(function () {
            var state = true;
            $("#button").click(function () {
                if (state) {
                    $("#effect").animate({
                        width: '100vw',
                        height: 'calc(100 % - 230px)',
                        backgroundColor: '#141b2a'
                    }, 500);
                } else {
                    $("#effect").animate({
                        width: 600,
                        height:600,
                        backgroundColor: '#141b2a'
                    }, 500);
                }
                state = !state;
            });
        }); */


        $(document).ready(function () {
            $("#fullButton").click(function () {
                $('.content').toggleClass("fullPage");
            });
        });

        /*const sensorStatus = this;

        $(".col1row1").dblclick(function () {
            $('.col2row1, .col1row2, .col2row2').toggleClass("hidden");
            let bigSize = false;

            if ($(".sensorInfoBox").hasClass("active")) {
                $(".sensorInfoBox").removeClass("active");
            } else {
                $(".sensorInfoBox").addClass("active");
                bigSize = true;
            }

            if ($(".sensorTitle1").hasClass("active")) {
                $(".sensorTitle1").removeClass("active");
            } else {
                $(".sensorTitle1").addClass("active");
            }

            if ($(".chartSkills").hasClass("active")) {
                $(".chartSkills").removeClass("active");
            } else {
                $(".chartSkills").addClass("active");
            }

            if ($(".chartSkills::before").hasClass("active")) {
                $(".chartSkills::before").removeClass("active");
            } else {
                $(".chartSkills::before").addClass("active");
            }

            if ($(".chartSkills li").hasClass("active")) {
                $(".chartSkills li").removeClass("active");
            } else {
                $(".chartSkills li").addClass("active");
            }

            if ($(".halfLine1").hasClass("active")) {
                $(".halfLine1").removeClass("active");
            } else {
                $(".halfLine1").addClass("active");
            }

            if ($(".halfLine4").hasClass("active")) {
                $(".halfLine4").removeClass("active");
            } else {
                $(".halfLine4").addClass("active");
            }

            if ($(".sensorText0").hasClass("active")) {
                $(".sensorText0").removeClass("active");
            } else {
                $(".sensorText0").addClass("active");
            }

            if ($(".sensorText1").hasClass("active")) {
                $(".sensorText1").removeClass("active");
            } else {
                $(".sensorText1").addClass("active");
            }

            if ($(".sensorText2").hasClass("active")) {
                $(".sensorText2").removeClass("active");
            } else {
                $(".sensorText2").addClass("active");
            }

            if ($(".sensorText3").hasClass("active")) {
                $(".sensorText3").removeClass("active");
            } else {
                $(".sensorText3").addClass("active");
            }

            if ($(".sensorLH").hasClass("active")) {
                $(".sensorLH").removeClass("active");
            } else {
                $(".sensorLH").addClass("active");
            }

            if ($(".figure").hasClass("active")) {
                $(".figure").removeClass("active");
            } else {
                $(".figure").addClass("active");
            }

            if ($(".stickAngle20").hasClass("active")) {
                $(".stickAngle20").removeClass("active");
            } else {
                $(".stickAngle20").addClass("active");
            }

            sensorStatus.setState({ bigSize });
        });

        $(".col2row1").dblclick(function () {
            $('.col1row1, .col1row2, .col2row2').toggleClass("hidden");
            let bigSize = false;

            if ($(".sensorInfoBox").hasClass("active")) {
                $(".sensorInfoBox").removeClass("active");
            } else {
                $(".sensorInfoBox").addClass("active");
                bigSize = true;
            }

            if ($(".sensorTitle1").hasClass("active")) {
                $(".sensorTitle1").removeClass("active");
            } else {
                $(".sensorTitle1").addClass("active");
            }

            if ($(".chartSkills").hasClass("active")) {
                $(".chartSkills").removeClass("active");
            } else {
                $(".chartSkills").addClass("active");
            }

            if ($(".chartSkills::before").hasClass("active")) {
                $(".chartSkills::before").removeClass("active");
            } else {
                $(".chartSkills::before").addClass("active");
            }

            if ($(".chartSkills li").hasClass("active")) {
                $(".chartSkills li").removeClass("active");
            } else {
                $(".chartSkills li").addClass("active");
            }

            if ($(".halfLine1").hasClass("active")) {
                $(".halfLine1").removeClass("active");
            } else {
                $(".halfLine1").addClass("active");
            }

            if ($(".halfLine4").hasClass("active")) {
                $(".halfLine4").removeClass("active");
            } else {
                $(".halfLine4").addClass("active");
            }

            if ($(".sensorText0").hasClass("active")) {
                $(".sensorText0").removeClass("active");
            } else {
                $(".sensorText0").addClass("active");
            }

            if ($(".sensorText1").hasClass("active")) {
                $(".sensorText1").removeClass("active");
            } else {
                $(".sensorText1").addClass("active");
            }

            if ($(".sensorText2").hasClass("active")) {
                $(".sensorText2").removeClass("active");
            } else {
                $(".sensorText2").addClass("active");
            }

            if ($(".sensorText3").hasClass("active")) {
                $(".sensorText3").removeClass("active");
            } else {
                $(".sensorText3").addClass("active");
            }

            if ($(".sensorLH").hasClass("active")) {
                $(".sensorLH").removeClass("active");
            } else {
                $(".sensorLH").addClass("active");
            }

            if ($(".figure").hasClass("active")) {
                $(".figure").removeClass("active");
            } else {
                $(".figure").addClass("active");
            }

            if ($(".stickAngle100").hasClass("active")) {
                $(".stickAngle100").removeClass("active");
            } else {
                $(".stickAngle100").addClass("active");
            }

            sensorStatus.setState({ bigSize });
        }); 


        $(".col1row2").dblclick(function () {
            $('.col1row1, .col2row1, .col2row2').toggleClass("hidden");
            let bigSize = false;

            if ($(".sensorInfoBox").hasClass("active")) {
                $(".sensorInfoBox").removeClass("active");
            } else {
                $(".sensorInfoBox").addClass("active");
                bigSize = true;
            }

            if ($(".sensorTitle1").hasClass("active")) {
                $(".sensorTitle1").removeClass("active");
            } else {
                $(".sensorTitle1").addClass("active");
            }

            if ($(".chartSkills").hasClass("active")) {
                $(".chartSkills").removeClass("active");
            } else {
                $(".chartSkills").addClass("active");
            }

            if ($(".chartSkills::before").hasClass("active")) {
                $(".chartSkills::before").removeClass("active");
            } else {
                $(".chartSkills::before").addClass("active");
            }

            if ($(".chartSkills li").hasClass("active")) {
                $(".chartSkills li").removeClass("active");
            } else {
                $(".chartSkills li").addClass("active");
            }

            if ($(".halfLine1").hasClass("active")) {
                $(".halfLine1").removeClass("active");
            } else {
                $(".halfLine1").addClass("active");
            }

            if ($(".halfLine4").hasClass("active")) {
                $(".halfLine4").removeClass("active");
            } else {
                $(".halfLine4").addClass("active");
            }

            if ($(".sensorText0").hasClass("active")) {
                $(".sensorText0").removeClass("active");
            } else {
                $(".sensorText0").addClass("active");
            }

            if ($(".sensorText1").hasClass("active")) {
                $(".sensorText1").removeClass("active");
            } else {
                $(".sensorText1").addClass("active");
            }

            if ($(".sensorText2").hasClass("active")) {
                $(".sensorText2").removeClass("active");
            } else {
                $(".sensorText2").addClass("active");
            }

            if ($(".sensorText3").hasClass("active")) {
                $(".sensorText3").removeClass("active");
            } else {
                $(".sensorText3").addClass("active");
            }

            if ($(".sensorLH").hasClass("active")) {
                $(".sensorLH").removeClass("active");
            } else {
                $(".sensorLH").addClass("active");
            }

            if ($(".figure").hasClass("active")) {
                $(".figure").removeClass("active");
            } else {
                $(".figure").addClass("active");
            }

            if ($(".stickAngle120").hasClass("active")) {
                $(".stickAngle120").removeClass("active");
            } else {
                $(".stickAngle120").addClass("active");
            }

            sensorStatus.setState({ bigSize });
        });


        $(".col2row2").dblclick(function () {
            $('.col1row1, .col1row2, .col2row1').toggleClass("hidden");
            let bigSize = false;

            if ($(".sensorInfoBox").hasClass("active")) {
                $(".sensorInfoBox").removeClass("active");
            } else {
                $(".sensorInfoBox").addClass("active");
                bigSize = true;
            }

            if ($(".sensorTitle1").hasClass("active")) {
                $(".sensorTitle1").removeClass("active");
            } else {
                $(".sensorTitle1").addClass("active");
            }

            if ($(".chartSkills").hasClass("active")) {
                $(".chartSkills").removeClass("active");
            } else {
                $(".chartSkills").addClass("active");
            }

            if ($(".chartSkills::before").hasClass("active")) {
                $(".chartSkills::before").removeClass("active");
            } else {
                $(".chartSkills::before").addClass("active");
            }

            if ($(".chartSkills li").hasClass("active")) {
                $(".chartSkills li").removeClass("active");
            } else {
                $(".chartSkills li").addClass("active");
            }

            if ($(".halfLine1").hasClass("active")) {
                $(".halfLine1").removeClass("active");
            } else {
                $(".halfLine1").addClass("active");
            }

            if ($(".halfLine4").hasClass("active")) {
                $(".halfLine4").removeClass("active");
            } else {
                $(".halfLine4").addClass("active");
            }

            if ($(".sensorText0").hasClass("active")) {
                $(".sensorText0").removeClass("active");
            } else {
                $(".sensorText0").addClass("active");
            }

            if ($(".sensorText1").hasClass("active")) {
                $(".sensorText1").removeClass("active");
            } else {
                $(".sensorText1").addClass("active");
            }

            if ($(".sensorText2").hasClass("active")) {
                $(".sensorText2").removeClass("active");
            } else {
                $(".sensorText2").addClass("active");
            }

            if ($(".sensorText3").hasClass("active")) {
                $(".sensorText3").removeClass("active");
            } else {
                $(".sensorText3").addClass("active");
            }

            if ($(".sensorLH").hasClass("active")) {
                $(".sensorLH").removeClass("active");
            } else {
                $(".sensorLH").addClass("active");
            }

            if ($(".figure").hasClass("active")) {
                $(".figure").removeClass("active");
            } else {
                $(".figure").addClass("active");
            }

            if ($(".stickAngle180").hasClass("active")) {
                $(".stickAngle180").removeClass("active");
            } else {
                $(".stickAngle180").addClass("active");
            }

            sensorStatus.setState({ bigSize });
        });*/


        let pagingUI = this.state.pagingUI;

        if (pagingUI === true) {
            pagingUI = true;
        } else if (pagingUI === false) {
            pagingUI = false;
        }

        this.setState({
            pagingUI: pagingUI,
        })


         $('#fullButton').click(function () {
             $('.sensorViewGrid').toggleClass("active");
        });

    }

    componentDidUpdate(prevProps, prevState) {
        this.state.cctvList = this.props.cctvList;
        //this.showCCTVs();

        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    repositionPopup(popupState) {
        let data = popupState.sensorStatus;

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

    /*resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }*/

    onClickAllView() {
        if (this.refAllView.current.classList.contains(popup.sensorFigure)) {
            if (this.props.isAllSensor === false) {
                // 개별센서 보기 모드에서 전체보기 모드로 전환(반대의 경우는 Icon을 Click 했을때에만 가능)
                this.props.changeToAllSensor();
            }
            else {
                this.refAllView.current.classList.remove(popup.sensorFigure);
                this.refAllView.current.classList.add(popup.sensorSeq);
            }
        }
    }

    togglePsmIcon() {
        let showPsm = true;

        if (this.refPsmButton.current.classList.contains(popup.selected)) {
            this.refPsmButton.current.classList.remove(popup.selected);
            showPsm = false;
        }
        else {
            this.refPsmButton.current.classList.add(popup.selected);
        }

        this.setState({ showPsm: showPsm });
    }

    toggleEtcIcon() {
        let showEtc = true;

        if (this.refEtcButton.current.classList.contains(popup.selected)) {
            this.refEtcButton.current.classList.remove(popup.selected);
            showEtc = false;
        }
        else {
            this.refEtcButton.current.classList.add(popup.selected);
        }

        this.setState({ showEtc: showEtc });
    }

    changeOrder(orderBySensorID) {
        if (orderBySensorID) {
            if (this.refOrderBySensorID.current.classList.contains(popup.sensorSeq)) {
                return;
            }
        }
        else {
            if (this.refOrderBySensorValue.current.classList.contains(popup.sensorSeq)) {
                return;
            }
        }

        this.setState({ orderBySensorID });
    }

    onKeyPressSearch = (e) => {
        if (e.key === 'Enter') {
            this.onClickSearch();
        }

        return;
    }

    onClickSearch() {
        const searchText = this.refSearchText.current.value;

        if (searchText) {
            this.setState({ searchText: searchText.trim() });
        }
        else {
            this.setState({ searchText: '' });
        }
    }

    displayUI = (enablePsmSensorCount, enableEtcSensorCount) => {
        let displayUI = [];
        const btnClassName = this.props.isAllSensor ? popup.sensorSeq : popup.sensorFigure;

        let widthSize = window.outerWidth;
        const psmIconClassName = this.state.showPsm ? popup.psmIcon + " " + popup.selected : popup.psmIcon;
        const etcIconClassName = this.state.showEtc ? popup.etcIcon + " " + popup.selected : popup.etcIcon;

        const sensorValueClassName = this.state.orderBySensorID ? popup.sensorFigure : popup.sensorSeq;
        const sensorIDClassName = this.state.orderBySensorID ? popup.sensorSeq : popup.sensorFigure;

        if (widthSize <= 600) {
            displayUI.push(
                <>
                    <div className={popup.sensorIconBox}>
                        <span ref={this.refPsmButton} className={psmIconClassName} onClick={() => this.togglePsmIcon()}></span>
                        <span ref={this.refEtcButton} className={etcIconClassName} onClick={() => this.toggleEtcIcon()}></span>
                        <div className={popup.sensorBtnArea}>
                            <div className={popup.sensorBtnBox}>
                                <span ref={this.refOrderBySensorValue} className={sensorValueClassName} onClick={() => this.changeOrder(false)}>수치</span>
                                <span ref={this.refOrderBySensorID} className={sensorIDClassName} onClick={() => this.changeOrder(true)}>센서</span>
                                <span ref={this.refAllView} className={btnClassName} onClick={() => this.onClickAllView()}>전체</span>
                            </div>

                            <div className={popup.sensorSearchBox}>
                                <span ref={this.refSearchText} className={popup.sensorSearchBlank} onKeyPress={(e) => this.onKeyPressSearch(e)}></span>
                                <span className={popup.sensorSearch} onClick={() => this.onClickSearch()}></span>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (widthSize >= 1025) {
            const psmSensorCount = this.props.sensorCount?.psmSensorCount;
            const etcSensorCount = this.props.sensorCount?.etcSensorCount;

            displayUI.push(
                <>
                    <div className={popup.sensorIconBox}>
                        <span ref={this.refPsmButton} className={psmIconClassName} onClick={() => this.togglePsmIcon()}></span>
                        <span ref={this.refEtcButton} className={etcIconClassName} onClick={() => this.toggleEtcIcon()}></span>
                    </div>
                    <div className={popup.sensorBtnArea}>
                        <div className={popup.sensorBtnBox}>
                            <span ref={this.refOrderBySensorValue} className={sensorValueClassName} onClick={() => this.changeOrder(false)}>수치</span>
                            <span ref={this.refOrderBySensorID} className={sensorIDClassName} onClick={() => this.changeOrder(true)}>센서</span>
                            <span ref={this.refAllView} className={btnClassName} onClick={() => this.onClickAllView()}>전체</span>
                        </div>
                    </div>
                    <div className={popup.sensorDataText}>
                    {
                        this.state.showPsm &&
                        <span className={popup.sensorName}>누출센서(<span className={popup.sensorCircle1}></span>{enablePsmSensorCount}/<span className={popup.sensorCircle2}></span>{psmSensorCount})</span>
                    }
                    {
                        this.state.showEtc &&
                        <span className={popup.sensorName}>기타센서(<span className={popup.sensorCircle1}></span>{enableEtcSensorCount}/<span className={popup.sensorCircle2}></span>{etcSensorCount})</span>
                    }
                    </div>
                    <div className={popup.sensorSearchBox}>
                        {/* <span className={popup.sensorSearchBlank}></span> */}
                        <input ref={this.refSearchText} type="text" className={popup.sensorSearchBlank} onKeyPress={(e) => this.onKeyPressSearch(e)} />
                        <span className={popup.sensorSearch} onClick={() => this.onClickSearch()}></span>
                    </div>
                </>
            );
        } else {
            displayUI.push(
                <></>
            );
        }

        /*displayUI.push(
            <div className={popup.sensorBtnArea}>
                <div className={popup.sensorBtnBox}>
                    <span ref={this.refAllView} className={btnClassName} onClick={() => this.onClickAllView()}>전체보기</span>
                </div>
            </div>
        );*/

        return displayUI;
    }

    getSensorRange(sensor) {
        let min = 0, max = null;
        const range = [[0, min]];
        let alarm = 0;

        if (sensor.limitLevel1 !== null && sensor.limitLevel1 !== undefined && sensor.useLimitLevel1) {
            range.push([1, sensor.limitLevel1]);
            max = sensor.limitLevel1;

            if (sensor.currentData !== null && sensor.currentData !== undefined && sensor.currentData >= sensor.limitLevel1)
                alarm = 1;
        }

        if (sensor.limitLevel2 !== null && sensor.limitLevel2 !== undefined && sensor.useLimitLevel2) {
            if (max === null || (max != null && sensor.limitLevel2 > max)) {
                range.push([2, sensor.limitLevel2]);
                max = sensor.limitLevel2;

                if (sensor.currentData !== null && sensor.currentData !== undefined && sensor.currentData >= sensor.limitLevel2)
                    alarm = 2;
            }
        }

        if (sensor.limitLevel3 !== null && sensor.limitLevel3 !== undefined && sensor.useLimitLevel3) {
            if (max === null || (max != null && sensor.limitLevel3 > max)) {
                range.push([3, sensor.limitLevel3]);
                max = sensor.limitLevel3;

                if (sensor.currentData !== null && sensor.currentData !== undefined && sensor.currentData >= sensor.limitLevel3)
                    alarm = 3;
            }
        }

        return [max - min, range, alarm];
    }

    getClassName(range, value) {
        const num = value[0];
        const data = value[1];

        let angle = parseInt(data * 180 / range);

        if (angle < 0)
            angle = 0;
        else if (angle > 180)
            angle = 180;

        return ["halfCircleText_" + angle, num];
    }

    getAlarmValues(range, values) {
        const items = [];

        for (const value of values) {
            const [className, num] = this.getClassName(range, value);
            items.push(<span class={className}>{num}</span>);
        }

        return items;
    }

    getChartItems(range, sensor, alarmLevel) {
        const sensorValue = sensor.currentData;
        const items = [], stickItems = [];

        let alarmColor = "", chartColor = "chartGreen";

        if (alarmLevel === 1) {
            alarmColor = " yellow";
            chartColor = " chartYellow";
        }
        else if (alarmLevel === 2) {
            alarmColor = " orange";
            chartColor = " chartOrange";
        }
        else if (alarmLevel === 3) {
            alarmColor = " red";
            chartColor = " chartRed";
        }

        const active = this.state.bigSize ? " active" : "";

        if (sensorValue !== null && sensorValue !== undefined) {
            let angle = parseInt(sensorValue * 180 / range);

            if (angle < 0)
                angle = 0;
            else if (angle > 180)
                angle = 180;

            items.push(<li class={chartColor + angle}></li>);
            items.push(<span class="halfLine1"></span>);
            items.push(<span class="halfLine4"></span>);
            stickItems.push(<span class={"stickAngle" + angle + active + alarmColor}></span>);
        }
        else {
            items.push(<li class="chartGreen0"></li>);
            items.push(<span class="halfLine1"></span>);
            items.push(<span class="halfLine4"></span>);
            stickItems.push(<span class={"stickAngle0" + active}></span>);
        }

        return [items, stickItems];
    }

    getAlarmIcon(alarmLevel) {
        if (alarmLevel === 1) {
            return (
                <span class="sensorAlarmYellow"></span>
            );
        }
        else if (alarmLevel === 2) {
            return (
                <span class="sensorAlarmOrange"></span>
            );
        }
        else if (alarmLevel === 3) {
            return (
                <span class="sensorAlarmRed"></span>
            );
        }

        return <></>;
    }

    getFontClass(alarmLevel, text) {
        const textLength = text.length;
        let fontSize = "";

        if (textLength > 2) {
            if (textLength <= 4) {
                fontSize = "16";
            }
            else {
                fontSize = "12";
            }
        }

        if (alarmLevel === 1) {
            return "numBoldYellow" + fontSize;
        }
        else if (alarmLevel === 2) {
            return "numBoldOrange" + fontSize;
        }
        else if (alarmLevel === 3) {
            return "numBoldRed" + fontSize;
        }

        return "numBoldGreen" + fontSize;
    }

    // 오름차순
    static compareSensorByValue(sensor1, sensor2) {
        if (sensor1.currentData === null || sensor1.currentData === undefined) {
            if (sensor2.currentData === null || sensor2.currentData === undefined)
                return 0;
            else
                return 1;
        }
        else if (sensor2.currentData === null || sensor2.currentData === undefined)
            return 1;

        if (sensor1.currentData < sensor2.currentData)
            return 1;
        else if (sensor1.currentData > sensor2.currentData)
            return -1;

        return 0;
    }

    filterSensors(sensors, searchText) {
        const _sensors = [];

        for (const sensor of sensors) {
            if (sensor.name.includes(searchText)) {
                _sensors.push(sensor);
            }
            else {
                const subData = this.getSensorSubData(sensor);

                if (subData.includes(searchText)) {
                    _sensors.push(sensor);
                }
            }
        }

        return _sensors;
    }

    getSensorSubData(sensor) {
        let data = sensor.materialType;

        /*if (sensor.buildingName !== null && sensor.buildingName.length > 0)
            data += ", " + sensor.buildingName;*/

        if (sensor.zoneName !== null && sensor.zoneName.length > 0)
            data += ", " + sensor.zoneName;

        return data;
    }

    getSensorItems() {
        const items = [];
        let sensors = [...this.props.sensors];

        if (this.state.orderBySensorID === false)
            sensors.sort(SensorStatus.compareSensorByValue);

        if (this.state.searchText.length > 0) {
            sensors = this.filterSensors(sensors, this.state.searchText);
        }

        const sensorCount = sensors.length;
        const beginIndex = SensorStatus.ItemCountPerPage * this.state.pageIndex;
        let endIndex = SensorStatus.ItemCountPerPage * (this.state.pageIndex + 1);

        //this.maxPageNumber = parseInt(sensorCount / SensorStatus.ItemCountPerPage);

        /*if (sensorCount % SensorStatus.ItemCountPerPage > 0) {
            this.maxPageNumber += 1;
        }*/

        if (endIndex > sensorCount)
            endIndex = sensorCount;

        const showPsm = this.state.showPsm;
        const showEtc = this.state.showEtc;
        let psmSensorCount = 0, etcSensorCount = 0;

        for (let i = 0; i < sensorCount; i++) {
        //for (let i = beginIndex; i < endIndex; i++) {
            const sensor = sensors[i];

            if (sensor.sensorType === SDMSMainMenu.PSM_Sensor) {
                if (showPsm === false)
                    continue;
                else
                    psmSensorCount++;
            }

            if (sensor.sensorType === SDMSMainMenu.Etc_Sensor) {
                if (showEtc === false)
                    continue;
                else
                    etcSensorCount++;
            }

            // 센서개수를 세기 위하여 이렇게 한다.
            if (i < beginIndex || i >= endIndex) {
                continue;
            }

            const [range, values, alarmLevel] = this.getSensorRange(sensor);
            const currentValue = this.getSensorValue(sensor);
            const fontClassName = this.getFontClass(alarmLevel, currentValue);
            const [chartItems, stickItems] = this.getChartItems(range, sensor, alarmLevel);

            items.push(
                <div class="col1row1">
                    <div class="sensorInfoBox">
                        <div class="sensorTitleArea">
                            <span class="sensorTitle1">{sensor.name}</span>
                            <span class="sensorTitle2">{this.getSensorSubData(sensor)}</span>
                        </div>
                        {
                            this.getAlarmIcon(alarmLevel)
                        }
                        {
                            this.getAlarmValues(range, values)
                        }
                        <ul class="chartSkills">
                            {
                                chartItems
                            }
                        </ul>
                        {
                            stickItems[0]
                        }
                        <span class="sensorLH">
                            <span class="sensorTextL">Low</span>
                            <span class="sensorTextH">High</span>
                        </span>
                        <div class="figure">
                            <span class="figureFont">수치</span>
                            <span class="line"></span>
                            <span class={fontClassName}>{currentValue}</span>
                            <span class="figureFont">{sensor.uom}</span>
                        </div>
                    </div>
                </div>
            );
        }

        this.maxPageNumber = parseInt((psmSensorCount + etcSensorCount) / SensorStatus.ItemCountPerPage);

        if ((psmSensorCount + etcSensorCount) % SensorStatus.ItemCountPerPage > 0)
            this.maxPageNumber += 1;

        return [items, psmSensorCount, etcSensorCount];
    }

    getSensorValue(sensor) {
        const currentData = sensor.currentData;

        if (currentData === null || currentData === undefined) {
            return "";
        }

        let result = currentData.toFixed(1).toString();

        if (result.endsWith('0')) {
            result = result.substring(0, result.length - 2);
        }

        return result;
    }

    onClickPage(pageIndex) {
        this.setState({ pageIndex });
    }

    getPageContents(obj) {
        const currentPageIndex = this.state.pageIndex + 1;

        if (currentPageIndex <= 1 && this.maxPageNumber <= 1) {
            obj.showPagination = false;
            return <></>;
        }
         
        let beginPageIndex = currentPageIndex % SensorStatus.PaginationCount === 0 ? parseInt(currentPageIndex / SensorStatus.PaginationCount) : parseInt(currentPageIndex / SensorStatus.PaginationCount) + 1;
        beginPageIndex = SensorStatus.PaginationCount * (beginPageIndex - 1) + 1;
        let endPageIndex = beginPageIndex + SensorStatus.PaginationCount - 1;

        if (endPageIndex > this.maxPageNumber)
            endPageIndex = this.maxPageNumber;

        const pageItems = [];

        if (beginPageIndex > 1) {
            const pageIndex = beginPageIndex - 2;
            pageItems.push(<li><a className={popup.arrowLeft} onClick={() => this.onClickPage(pageIndex)}></a></li>);
        }

        for (let i = beginPageIndex; i <= endPageIndex; i++) {
            const pageIndex = i - 1;

            if (i === currentPageIndex) {
                pageItems.push(<li><a className={popup.num + " " + popup.active} onClick={() => this.onClickPage(pageIndex)}>{i}</a></li>);
            }
            else {
                pageItems.push(<li><a className={popup.num} onClick={() => this.onClickPage(pageIndex)}>{i}</a></li>);
            }
        }

        if (endPageIndex < this.maxPageNumber) {
            pageItems.push(<li><a className={popup.arrowRight} onClick={() => this.onClickPage(endPageIndex)}></a></li>);
        }

        obj.showPagination = true;

        return (
            <div className={popup.sensorPaging}>
                <ul className={popup.pagination + " " + popup.modal}>
                    {
                        pageItems
                    }
                </ul>
            </div>
            );
    }

    render() {
        const [sensorItems, psmSensorCount, etcSensorCount] = this.getSensorItems();
        const displayUI = this.displayUI(psmSensorCount, etcSensorCount);

        const obj = { showPagination: false };
        const pageContents = this.getPageContents(obj);
        const sensorContsClassName = obj.showPagination ? popup.viewSensorConts : popup.viewSensorConts + " " + popup.noPage;
        const contentsClassName = obj.showPagination ? "content noPage" : "content";

        return (
            <>
              <div id={this.props.popupType} className={popup.viewDashboardSensorBox}>
                <div id="effect" class={contentsClassName}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={this.state.popupMinWidth}
                    popupMinHeight={this.state.popupMinHeight}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    popupResizeMouseMove={this.popupResizeMouseMove}
                    popupResizeMousePress={this.popupResizeMousePress}
                    popupResizeMouseUp={this.popupResizeMouseUp}
                >
                <div className={content.dslTop + " " + content.dslGrd} style={{ height: '35px' }}>
                    <h5 className={content.dslTitle}>
                        센서정보 현황
                    </h5>
                    <a className={popup.dslX} id="fullButton" class="default corner"></a>
                    <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.sensorStatus, false)}></a>
                 </div>

                {displayUI}

                 <div className={sensorContsClassName} resizable="yes" style={{ marginRight : '8px' }}>
                    <div class="sensorViewGrid">
                        { sensorItems }
                    </div>
                 </div>

               <div className={popup.dangerSteps}>
                  <span className={popup.interest}><span className={popup.interestCircle}></span>관심</span>
                  <span className={popup.caution}><span className={popup.cautionCircle}></span>주의</span>
                  <span className={popup.boundary}><span className={popup.boundaryCircle}></span>경계</span>
                  <span className={popup.serious}><span className={popup.seriousCircle}></span>심각</span>
                </div>
                { pageContents }

               </PopupDraggable>
              </div>
            </div>
            </>
      );
    }
}
export default SensorStatus;