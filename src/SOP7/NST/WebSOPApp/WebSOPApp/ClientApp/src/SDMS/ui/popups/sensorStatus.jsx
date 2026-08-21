import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
//import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';
import SDMSResource from '../../resource/id';
import popup from '../../../SDMS/css/popup.module.css';
import '../../../SDMS/css/pop.css';
import '../../../SDMS/js/active.js';

import PopupDraggable from './popupDraggable';
import $ from 'jquery';


class SensorStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 600,
            popupMinHeight: 400,
            displayUI: this.displayUI(),
            pagingUI: false, /* 페이지 번호 */
            bigSize: false
        };

        this.props = props;
        this.refAllView = React.createRef();

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

        //const sensorStatus = this;

        $(document).ready(function () {
            $("#fullButton").click(function () {
                $('.content').toggleClass("fullPage");
            });
        });


        /*$(".col1row1").dblclick(function () {
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
        /*if (this.refAllView.current.classList.contains(popup.sensorSeq)) {
            this.refAllView.current.classList.remove(popup.sensorSeq);
            this.refAllView.current.classList.add(popup.sensorFigure);
        }
        else*/ if (this.refAllView.current.classList.contains(popup.sensorFigure)) {
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

    displayUI = () => {
        let displayUI = [];
        const btnClassName = this.props.isAllSensor ? popup.sensorSeq : popup.sensorFigure;

        displayUI.push(
            <div className={popup.sensorBtnArea}>
                <div className={popup.sensorBtnBox}>
                    <span ref={this.refAllView} className={btnClassName} onClick={() => this.onClickAllView()}>전체보기</span>
                </div>
            </div>
        );

        /*let widthSize = window.outerWidth;

        if (widthSize <= 600) {
            displayUI.push(
                <>
                    <div className={popup.sensorIconBox}>
                        <span className={popup.psmIcon}></span>
                        <span className={popup.etcIcon}></span>
                    </div>
                    <div className={popup.sensorBtnArea}>
                        <div className={popup.sensorBtnBox}>
                            <span className={popup.sensorFigure}>수치 순</span>
                            <span className={popup.sensorSeq}>센서 순</span>
                        </div>

                        <div className={popup.sensorSearchBox}>
                            <span className={popup.sensorSearchBlank}></span>
                            <span className={popup.sensorSearch}></span>
                        </div>
                    </div>
                </>
            );
        } else if (widthSize >= 1025) {
            displayUI.push(
                <>
                    <div className={popup.sensorIconBox}>
                        <span className={popup.psmIcon}></span>
                        <span className={popup.etcIcon}></span>
                    </div>
                    <div className={popup.sensorBtnArea}>
                        <div className={popup.sensorBtnBox}>
                            <span className={popup.sensorFigure}>수치 순</span>
                            <span className={popup.sensorSeq}>센서 순</span>
                        </div>

                        <div className={popup.sensorSearchBox}>
                            <input type="text" className={popup.sensorSearchBlank} />
                            <span className={popup.sensorSearch}></span>
                        </div>
                    </div>
                    <div className={popup.sensorDataText}>
                       <span className={popup.sensorName}>누출센서(<span className={popup.sensorCircle1}></span>10/<span className={popup.sensorCircle2}></span>10)</span>
                    </div>
                </>
            );
        } else {
            displayUI.push(
                <></>
            );
        }*/
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

    getSensorItems() {
        const items = [];
        
        for (const sensor of this.props.sensors) {
            const [range, values, alarmLevel] = this.getSensorRange(sensor);
            const currentValue = this.getSensorValue(sensor);
            const fontClassName = this.getFontClass(alarmLevel, currentValue);
            const [chartItems, stickItems] = this.getChartItems(range, sensor, alarmLevel);

            items.push(
                <div class="col1row1">
                    <div class="sensorInfoBox">
                        <div class="sensorTitleArea">
                            <span class="sensorTitle1">{sensor.name}</span>
                            <span class="sensorTitle2">{sensor.uniqueKey}</span>
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

        return items;
    }

    render() {
        let displayUI = this.displayUI();
        const sensorContsClassName = this.state.pagingUI ? popup.viewSensorConts2 : popup.viewSensorConts;

        return (
            <>
              <div id={this.props.popupType} className={popup.viewDashboardSensorBox}>
              <div id="effect" class="content">
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
                    <a className={content.dslX} onClick={() => this.props.setVisiblePopup(this.props.popupType, false)}></a>
                 </div>

                {displayUI}

              <div className={sensorContsClassName} resizable="yes">
                 {/* <div class="sensorView"> */}
                    <div class="sensorViewGrid">
                    {
                        this.getSensorItems()
                    }
                     </div> {/* sensorViewGrid */}
                   {/* </div> */}
               </div>

               <div className={popup.dangerSteps}>
                  <span className={popup.interest}><span className={popup.interestCircle}></span>관심</span>
                  <span className={popup.caution}><span className={popup.cautionCircle}></span>주의</span>
                  <span className={popup.boundary}><span className={popup.boundaryCircle}></span>경계</span>
                  <span className={popup.serious}><span className={popup.seriousCircle}></span>심각</span>
                </div>
                {
                    this.state.pagingUI &&
                        <div className={popup.sensorPaging}>
                            <ul className={popup.pagination + " " + popup.modal}>
                                <li><a className={popup.arrowLeft}></a></li>
                                <li><a className={popup.activeNum}>1</a></li>
                                <li><a className={popup.num}>2</a></li>
                                <li><a className={popup.num}>3</a></li>
                                <li><a className={popup.num}>4</a></li>
                                <li><a className={popup.num}>5</a></li>
                                <li><a className={popup.arrowRight}></a></li>
                            </ul>
                        </div>
                }

               </PopupDraggable>
              </div>
            </div>
            </>
      );
    }
}
export default SensorStatus;