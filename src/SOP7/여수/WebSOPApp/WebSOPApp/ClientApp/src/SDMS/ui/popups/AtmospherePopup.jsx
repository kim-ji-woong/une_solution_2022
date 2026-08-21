/// <reference path="statusinfobuildinggroup.jsx" />
import React, { Component } from 'react';
//import styled from 'styled-components';
import './../../css/popup.css';

import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';
import StatusInfo from './statusInfo';

import { AtmospherePopupComponent } from './../../sdmsStyled';
import store from '../../../Root/store';

import WeatherMiniPop from "./weatherMiniPop";


function getColor(num, color) {

    let _color = null;
    let colorText = null;

    if (color === 1) {
        _color = "blue";
    } else if (color === 2) {
        _color = "yellow";
    } else if (color === 3) {
        _color = "orange";
    } else {
        _color = "red";
    }

    colorText = _color + num.toString();

    return colorText;
}

function clearChildren1(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function clearChildren2(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function clearChildren3(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function clearChildren4(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

let timer1 = null;
function addSticks1(value, colorNum, parent, isDuplicated) {

    if (parent.lastChild) {
        if (value !== null && value !== undefined) {
            parent.lastChild.classList.remove("white");
            if (value === 1) {
                parent.lastChild.classList.add(getColor(colorNum, 1));
                colorNum++;
            }
            if (value === 2) {
                parent.lastChild.classList.add(getColor(colorNum, 2));
                colorNum++;
            }
            if (value === 3) {
                parent.lastChild.classList.add(getColor(colorNum, 3));
                colorNum++;
            }
            if (value === 4) {
                parent.lastChild.classList.add(getColor(colorNum, 4));
                colorNum++;
            }
        } else {
            parent.lastChild.classList.remove("white");
            parent.lastChild.classList.add("red");
        }
    }

    if (parent.children.length >= 10)
        return;

    if (isDuplicated) {
        clearTimeout(timer1);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer1 = setTimeout(addSticks1, 50, value, colorNum, parent, false);
}

let timer2 = null;
async function addSticks2(value, colorNum, parent, isDuplicated) {

    if (parent.lastChild) {
        if (value !== null && value !== undefined) {
            parent.lastChild.classList.remove("white");
            if (value === 1) {
                parent.lastChild.classList.add(getColor(colorNum, 1));
                colorNum++;
            }
            if (value === 2) {
                parent.lastChild.classList.add(getColor(colorNum, 2));
                colorNum++;
            }
            if (value === 3) {
                parent.lastChild.classList.add(getColor(colorNum, 3));
                colorNum++;
            }
            if (value === 4) {
                parent.lastChild.classList.add(getColor(colorNum, 4));
                colorNum++;
            }
        } else {
            parent.lastChild.classList.remove("white");
            parent.lastChild.classList.add("blue");
        }
    }

    if (parent.children.length >= 10)
        return;

    if (isDuplicated) {
        clearTimeout(timer2);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer2 = setTimeout(addSticks2, 50, value, colorNum, parent, false);
}

let timer3 = null;
async function addSticks3(value, colorNum, parent, isDuplicated) {
    if (parent.lastChild) {
        if (value !== null && value !== undefined) {
            parent.lastChild.classList.remove("white");
            if (value === 1) {
                parent.lastChild.classList.add(getColor(colorNum, 1));
                colorNum++;
            }
            if (value === 2) {
                parent.lastChild.classList.add(getColor(colorNum, 2));
                colorNum++;
            }
            if (value === 3) {
                parent.lastChild.classList.add(getColor(colorNum, 3));
                colorNum++;
            }
            if (value === 4) {
                parent.lastChild.classList.add(getColor(colorNum, 4));
                colorNum++;
            }
        } else {
            parent.lastChild.classList.remove("white");
            parent.lastChild.classList.add("blue");
        }
    }

    if (parent.children.length >= 10)
        return;

    if (isDuplicated) {
        clearTimeout(timer3);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer3 = setTimeout(addSticks3, 50, value, colorNum, parent, false);
}

let timer4 = null;
async function addSticks4(value, colorNum, parent, isDuplicated) {
    if (parent.lastChild) {
        if (value !== null && value !== undefined) {
            parent.lastChild.classList.remove("white");
            if (value === 1) {
                parent.lastChild.classList.add(getColor(colorNum, 1));
                colorNum++;
            }
            if (value === 2) {
                parent.lastChild.classList.add(getColor(colorNum, 2));
                colorNum++;
            }
            if (value === 3) {
                parent.lastChild.classList.add(getColor(colorNum, 3));
                colorNum++;
            }
            if (value === 4) {
                parent.lastChild.classList.add(getColor(colorNum, 4));
                colorNum++;
            }
        } else {
            parent.lastChild.classList.remove("white");
            parent.lastChild.classList.add("blue");
        }
    }

    if (parent.children.length >= 10)
        return;

    if (isDuplicated) {
        clearTimeout(timer4);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer4 = setTimeout(addSticks4, 50, value, colorNum, parent, false);
}

function drawSticks1(value) {
    const elements = document.getElementsByClassName("sticks1");

    if (elements && elements.length > 0) {
        const sticks1 = elements[0];
        clearChildren1(sticks1);
        addSticks1(value, 1, sticks1, true);
    }
}

async function drawSticks2(value) {
    const elements = document.getElementsByClassName("sticks2");

    if (elements && elements.length > 0) {
        const sticks2 = elements[0];
        clearChildren2(sticks2);
        addSticks2(value, 1, sticks2, true);
    }
}

async function drawSticks3(value) {
    const elements = document.getElementsByClassName("sticks3");

    if (elements && elements.length > 0) {
        const sticks3 = elements[0];
        clearChildren3(sticks3);
        addSticks3(value, 1, sticks3, true);
    }
}

async function drawSticks4(value) {
    const elements = document.getElementsByClassName("sticks4");

    if (elements && elements.length > 0) {
        const sticks4 = elements[0];
        clearChildren4(sticks4);
        addSticks4(value, 1, sticks4, true);
    }
}


class AtmospherePopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedSensor: this.props.selectedSensor?.sensor,
            show: false,

            dustPM10: 0,
            dustPM025: 0,
            CL2: 0,
            NH3: 0,
            VOC: 0,
            HCl: 0,
            H2S: 0,
            val3: 0,

            miniPopInfo: false,
            miniPopInfo2: true,

            sensorList: store.getState().sensorList,

            isDangerPm10: 1,
            isDangerPm025: 1,
            isDangerCL2: 1,
            isDangerNH3: 1,
            isDangerVOC: 1,
            isDangerHCl: 1,
            isDangerH2S: 1,
            isVal3Danger: 1,

            displayText: null,
        }

        this.props = props;

        store.subscribe(function () {

            const data = store.getState();

            if (data === null || data === undefined || data.actionType !== 'SENSOR_LIST')
                return;

            //this.getSensorList(data);
            this.setState({ sensorList: data.sensorList });

        }.bind(this));

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        // 1 : 안전 , 2 : 보통 , 3 : 나쁨 , 4 : 매우나쁨
        this.isDangerPm10 = 1;
        this.isDangerPm025 = 1;
        this.isDangerCL2 = 1;

        this.isDanger();

        this.isSubscribed = true;
    }

    showModal = e => {

        this.setState({
            show: !this.state.show
        });
    };

    /* onClose = e => {
        this.props.onClose && this.props.onClose(e);
    }; */


    componentDidMount() {

        this.getMaterialValue();

        //drawSticks1(this.isDangerPm10);
        //drawSticks2(this.isDangerPm025);
        //drawSticks3(this.isDangerCL2);

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

    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('miniMapZIndex changed', this.state.popup.style.zIndex);
        }

        //if (this.props.selectedSensorInfo !== prevProps.selectedSensorInfo) {
        //    if (this.props.selectedSensorInfo.sensorType === StatusInfo.AtmosphereType) {

        //        this.setState({ selectedSensor: this.props.selectedSensorInfo.sensor }, () => this.getMaterialValue());

        //    }
        //}
        //if (this.props.selectedSensorInfo !== prevProps.selectedSensorInfo) {
        //    if (this.props.selectedSensorInfo.sensorType === StatusInfo.AtmosphereType) {
        //        this.setState({ selectedSensor: this.props.selectedSensorInfo.sensor }, () => this.getMaterialValue());
        //    }
        //}

        if (this.props.selectedSensor !== prevProps.selectedSensor) {
            if (this.props.selectedSensor.sensorType === StatusInfo.AtmosphereType) {

                this.setState({ selectedSensor: this.props.selectedSensor.sensor }, () => this.getMaterialValue());
            }
        }

        if (this.props.sensorList !== prevProps.sensorList) {

            if (this.isNewVal(prevProps.sensorList)) {
                this.getNewMaterialValue(prevProps.selectedSensorInfo);

            }
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

    isNewVal(prevSensorList) {

        let curAtmosSensors = this.props.sensorList.atmospheres;
        let prevAtmosSensors = prevSensorList.atmospheres;

        let result = null;

        const sensorName = this.state.selectedSensor?.position;

        for (let i = 0; i < prevAtmosSensors.length; i++) {
            const prevSensor = prevAtmosSensors[i];
            const indiSensors = prevSensor.sensors;

            const curSensor = this.props.sensorList.atmospheres[i];
            const curIndiSensors = curSensor.sensors;

            if (curSensor.position === sensorName) {
                for (let j = 0; j < indiSensors.length; j++) {
                    const preVal = indiSensors[j].value;
                    const curVal = curIndiSensors[j].value;

                    if (preVal !== curVal) {
                        result = true;
                    } else {
                        result = false;
                    }
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }

    getNewMaterialValue(prevSensor) {
        if (this.state.selectedSensor) {

            const atmosphereSensors = this.props.sensorList.atmospheres;
            const curZoneID = this.state.selectedSensor.zoneID;

            let curSensor = null;

            for (const sensor of atmosphereSensors) {
                if (curZoneID === sensor.zoneID) {
                    curSensor = sensor;
                }
            }

            this.setState({ selectedSensor: curSensor }, this.getMaterialValue);
            //let curSensorID = null;
            //let preSensorID = null;
            //let curVal = null;
            //let preVal = null;

            //const preSensors = prevSensor.sensor.sensors;

            //for (let j = 0; j < curSensor.sensors.length; j++) {
            //    curSensorID = curSensor.sensors[j].id;
            //    curVal = curSensor.sensors[j].value;

            //    for (let i = 0; i < preSensors.length; i++) {
            //        preSensorID = preSensors[i].id;
            //        preVal = preSensors[i].value;

            //        if (curSensorID === preSensorID && curVal !== preVal) {
            //            this.setState({ selectedSensor: curSensor }, this.getMaterialValue);
            //        }
            //    }
            //}
        }
    }

    repositionPopup(popupState) {
        let data = popupState.atmospherePopup;

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

    //팝업 리사이즈 이벤트 리스너
    popupResizeMouseMove = (event) => {
        let sizeY = 0;

        switch (this.state.resizeType) {
            // 수직
            case 'v-b': // 바텀 수직
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    //그리드 사이즈를 부모(팝업) 사이즈 비율대로 조절
                    const grid = this.findElementByClassName(content.atmospherePopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.atmospherePopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.atmospherePopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.atmospherePopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.atmospherePopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.atmospherePopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            default:
        }

    }

    popupResizeMousePress = (event, resizeType) => {
        const popup = document.getElementById(this.props.popupType);

        this.setState({
            maxScreenHeight: document.getElementsByTagName('body')[0].clientHeight,
            maxScreenWidth: document.getElementsByTagName('body')[0].clientWidth,
            resizeType: resizeType,
            originalMouseX: event.pageX,
            originalMouseY: event.pageY,
            originalWidth: document.getElementById(this.props.popupType).clientWidth,
            originalHeight: document.getElementById(this.props.popupType).clientHeight,
            originalX: document.getElementById(this.props.popupType).getBoundingClientRect().left,
            originalY: document.getElementById(this.props.popupType).getBoundingClientRect().top,
        });
    }

    popupResizeMouseUp = () => {
        this.setState({ resizeType: null });
    }

    getMaterialValue() {

        if (this.state.selectedSensor) {
            if (this.state.selectedSensor.sensors || this.state.selectedSensor.sensors != undefined) {
                const itemValues = this.state.selectedSensor.sensors;

                let dustPm025 = null;
                let dustPm10 = null;
                let CL2 = null;
                let NH3 = null;
                let VOC = null;
                let HCl = null;
                let H2S = null;

                let val3 = null;

                let displayText = null;
                let CL2Text = "Cl2(염소가스)";
                let NH3Text = "NH3(암모니아)";
                let VOCText = "VOC(유기화합물)";
                let HClText = "HCl(염산)";
                let H2SText = "H2S(황화수소)";

                /*
                    * sensorType = 205 = 초미세먼지 pm2.5
                    * sensorType = 206 = 미세먼지 pm10
                    * sensorType = 254 = 염소 CL2
                    */
                for (const sensor of itemValues) {
                    if (sensor.sensorType == 205) dustPm025 = sensor.value;
                    if (sensor.sensorType == 206) dustPm10 = sensor.value;
                    if (sensor.sensorType == 254) {
                        val3 = sensor.value;
                        displayText = CL2Text;
                        CL2 = sensor.value;
                    }
                    if (sensor.sensorType == 234) {
                        val3 = sensor.value;
                        displayText = NH3Text;
                        NH3 = sensor.value;
                    }
                    if (sensor.sensorType == 227) {
                        val3 = sensor.value;
                        displayText = VOCText;
                        VOC = sensor.value;
                    }
                    if (sensor.sensorType == 222) {
                        val3 = sensor.value;
                        displayText = HClText;
                        HCl = sensor.value;
                    }
                    if (sensor.sensorType == 237) {
                        val3 = sensor.value;
                        displayText = H2SText;
                        H2S = sensor.value;
                    }

                };

                this.setState({ dustPM10: dustPm10, dustPM025: dustPm025, CL2: CL2, NH3: NH3, VOC: VOC, HCl: HCl, H2S: H2S, val3: val3, displayText: displayText }, () => {
                    this.isDanger();
                });
            }
        }

    }

    getTime = () => {
        const fullDate = new Date();
        let hours = fullDate.getHours();
        let minutes = fullDate.getMinutes();
        let seconds = fullDate.getSeconds();

        if (parseInt(hours) < 10) {
            hours = "0" + hours.toString();
        }

        if (parseInt(minutes) < 10) {
            minutes = "0" + minutes.toString();
        }

        if (parseInt(seconds) < 10) {
            seconds = "0" + seconds.toString();
        }

        let time = hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();

        return time;
    }

    // 대기 센서 위험도 기준
    isDanger() {

        let isDangerPm10 = 1;
        let isDangerPm025 = 1;
        let isDangerCL2 = 1;
        let isDangerNH3 = 1;
        let isDangerVOC = 1;
        let isDangerHCl = 1;
        let isDangerH2S = 1;

        let isVal3Danger = 1;

        const pm10 = parseFloat(this.state.dustPM10);
        const pm025 = parseFloat(this.state.dustPM025);
        const CL2 = parseFloat(this.state.CL2);
        const NH3 = parseFloat(this.state.NH3);
        const VOC = parseFloat(this.state.VOC);
        const HCl = parseFloat(this.state.HCl);
        const H2S = parseFloat(this.state.H2S);


        if (pm10 > 30) {
            isDangerPm10 = 2;
            if (pm10 > 80) {
                isDangerPm10 = 3;
                if (pm10 > 150) {
                    isDangerPm10 = 4;
                }
            }
        }

        if (pm025 > 15) {
            isDangerPm025 = 2;
            if (pm025 > 35) {
                isDangerPm025 = 3;
                if (pm025 > 75) {
                    isDangerPm025 = 4;
                }
            }
        }

        if (CL2 > 1000) {
            isVal3Danger = 2;
            if (CL2 > 4000) {
                isVal3Danger = 3;
                if (CL2 > 6000) {
                    isVal3Danger = 4;
                }
            }
        }

        if (NH3 > 500) {
            isVal3Danger = 2;
            if (NH3 > 1000) {
                isVal3Danger = 3;
                if (NH3 > 3000) {
                    isVal3Danger = 4;
                }
            }
        }

        if (VOC > 300) {
            isVal3Danger = 2;
            if (VOC > 800) {
                isVal3Danger = 3;
                if (VOC > 2000) {
                    isVal3Danger = 4;
                }
            }
        }

        if (HCl > 1000) {
            isVal3Danger = 2;
            if (HCl > 4000) {
                isVal3Danger = 3;
                if (HCl > 6000) {
                    isVal3Danger = 4;
                }
            }
        }

        if (H2S > 5) {
            isVal3Danger = 2;
            if (H2S > 20) {
                isVal3Danger = 3;
                if (H2S > 60) {
                    isVal3Danger = 4;
                }
            }
        }

        this.setState({ isDangerPm10: isDangerPm10, isDangerPm025: isDangerPm025, isDangerCL2: isDangerCL2, isDangerNH3: isDangerNH3, isDangerVOC: isDangerVOC, isDangerHCl: isDangerHCl, isDangerH2S: isDangerH2S, isVal3Danger: isVal3Danger }, this.setDangerBar(isDangerPm10, isDangerPm025, isVal3Danger, isDangerCL2));
    }

    setDangerBar(val1, val2, val3, val4) {
        drawSticks1(val1);
        drawSticks2(val2);
        drawSticks3(val3);
        // ZoneID가 20이면 Material 4개
        const zone = this.state.selectedSensor ? this.state.selectedSensor : null;
        if (zone) {
            if (zone.zoneID === 20) {
                drawSticks4(val4);
            }
        }

    }

    getWeatherMiniPop() {
        const popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined) {
            return <></>;
        }

        const parent = popup.parentElement;

        if (parent) {
            if (this.state.show) {
                const miniPopWidth = 170;

                const rectParent = parent.getBoundingClientRect();
                const rect = popup.getBoundingClientRect();

                if (rect.right + miniPopWidth <= rectParent.width) {
                    return (
                        <WeatherMiniPop selectedSensor={this.state.selectedSensor} miniPopInfo={this.state.miniPopInfo} left={rect.width}></WeatherMiniPop>)
                }
                else {
                    return (
                        <WeatherMiniPop selectedSensor={this.state.selectedSensor} miniPopInfo={this.state.miniPopInfo2}></WeatherMiniPop>)
                }
            }
        }
    }

    getValueText() {
        if (this.state.selectedSensor) {

        } else {
            console.log("선택된 센서 없음 Value 호출 불가능")
        }
    }

    render() {

        const time = this.getTime();

        this.getValueText();

        let quadraMaterialHeight = null;

        if (this.state.selectedSensor !== null && this.state.selectedSensor !== undefined) {
            if (this.state.selectedSensor.zoneID === 20) {
                quadraMaterialHeight = {
                    height: '325px'
                }
            }
        }

        return (
            <>
                <AtmospherePopupComponent id={this.props.popupType} className={content.atmospherePopup + " " + SDMSResource.UISection} style={quadraMaterialHeight}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={280}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                        {/* <div className={'sensorInfoDetailBox'} style={quadraMaterialHeight}> */}
                            <div className={'sensorInfoTitleBox'}>
                                <div className={'sensorInfoDetailTitle'}>
                                    <span className={'sensorTitleIcon'}></span>
                                    <span className={'sensorDetailTitle'}>센서 상세정보</span>
                                    {/*<ReferenceTime>15:20:00 기준</ReferenceTime>*/}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span className={'referenceTime'}>{time} 기준</span>
                                    <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.atmospherePopup, false, true)}></span>
                                </div>
                            </div>

                            <div className={'sensorInfoContents'}>
                                <div className={'sensorInfoSecondBox'}>
                                    <span className={'titleTriIcon'}></span>
                                    <span className={'sensorTitleA'}>대기유해물질</span>
                                    <span className={'weatherInfoBtn'}
                                        onMouseEnter={e => { this.showModal(e); }}
                                        onMouseLeave={e => { this.showModal(e); }}
                                    >
                                        기상정보
                                    </span>
                                </div>
                                <span style={{ display: 'block', width: '100%', height: '1px', border: 'dashed 1px #707070', marginBottom: '6px' }}></span>
                                <div className={'sensorInfoThirdBox'}>
                                    <span className={'sensorNameA'}>{this.state.selectedSensor && this.state.selectedSensor.position}</span>
                                    <span className={'divideLine'}></span>
                                    <span className={'sensorAddress'}>{this.state.selectedSensor && this.state.selectedSensor.address}</span>

                                    {/* <WeatherInfoBtn onClick={e => {this.showModal(e); }} onClick={this.onClose}>기상정보 
                                 </WeatherInfoBtn> */}

                                </div>
                                <div className={'sensorItemBox'}>
                                    <table>
                                        <tbody> 
                                            <tr className={'itemBoxTrLine'} style={{ borderBottom: 'solid 1px #808080' }}>
                                                <th className={'itemBoxTh'}>센서항목</th>
                                                <th className={'itemBoxTh'}>수치</th>
                                                <th className={'itemBoxTh'}>위험도</th>
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                {this.state.isDangerPm10 >= 3 ?
                                                    <td className={'itemBoxTd1 active'}>미세먼지(PM10)</td> :
                                                    <td className={'itemBoxTd1'}>미세먼지(PM10)</td>
                                                }
                                                {this.state.isDangerPm10 >= 3 ?
                                                    <td className={'itemBoxTd2 active'}>{this.state.selectedSensor && this.state.dustPM10}㎕/㎥</td> :
                                                    <td className={'itemBoxTd2'}>{this.state.selectedSensor && this.state.dustPM10}㎕/㎥</td>
                                                }
                                                <td className={'itemBoxTd3'}>
                                                    <span className="sticks1"></span>
                                                    {/* <div className="skillProgress">
                                                      <div className="item">
                                                        <div className="progress">
                                                          <div className="progressLevel" style={{ width: '90%' }}></div>
                                                        </div>
                                                      </div>
                                                   </div> */}
                                                </td>
                                                {/* <button onClick={onClickButton}>Go</button> */}
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                {this.state.isDangerPm025 >= 3 ?
                                                    <td className={'itemBoxTd1 active'}>초미세먼지(PM2.5)</td> :
                                                    <td className={'itemBoxTd1'}>초미세먼지(PM2.5)</td>
                                                }
                                                {this.state.isDangerPm025 >= 3 ?
                                                    <td className={'itemBoxTd2 active'}>{this.state.selectedSensor && this.state.dustPM025}㎍/㎥</td> :
                                                    <td className={'itemBoxTd2'}>{this.state.selectedSensor && this.state.dustPM025}㎍/㎥</td>
                                                }
                                                <td className={'itemBoxTd3'}>
                                                    <span className="sticks2"></span>
                                                    {/* <div className="skillProgress">
                                                        <div className="item">
                                                            <div className="progress">
                                                                <div className="progressLevel" style={{ width: '60%' }}></div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </td>
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                {this.state.isVal3Danger >= 3 ?
                                                    <td className={'itemBoxTd1 active'}>{this.state.displayText}</td> :
                                                    <td className={'itemBoxTd1'}>{this.state.displayText}</td>
                                                }
                                                {this.state.isVal3Danger >= 3 ?
                                                    <td className={'itemBoxTd2 active'}>{this.state.selectedSensor && this.state.val3}㎍/㎥</td> :
                                                    <td className={'itemBoxTd2'}>{this.state.selectedSensor && this.state.val3}㎍/㎥</td>
                                                }
                                                <td className={'itemBoxTd3'}>
                                                    <span className="sticks3"></span>
                                                    {/* <div className="skillProgress">
                                                        <div className="item">
                                                            <div className="progress">
                                                                <div className="progressLevel" style={{ width: '50%' }}></div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </td>
                                            </tr>
                                            {this.state.selectedSensor?.zoneID === 20 ?
                                                <tr className={'itemBoxTr'}>
                                                    {this.state.isDangerCL2 >= 3 ?
                                                        <td className={'itemBoxTd1 active'}>Cl2(염소가스)</td> :
                                                        <td className={'itemBoxTd1'}>Cl2(염소가스)</td>
                                                    }
                                                    {this.state.isDangerCL2 >= 3 ?
                                                        <td className={'itemBoxTd2 active'}>{this.state.selectedSensor && this.state.CL2}㎍/㎥</td> :
                                                        <td className={'itemBoxTd2'}>{this.state.selectedSensor && this.state.CL2}㎍/㎥</td>
                                                    }
                                                    <td className={'itemBoxTd3'}>
                                                        <span className="sticks4"></span>
                                                        {/* <div className="skillProgress">
                                                            <div className="item">
                                                                <div className="progress">
                                                                    <div className="progressLevel" style={{ width: '100%' }}></div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                    </td>
                                                </tr>
                                                : <></>
                                                }
                                        </tbody> 
                                    </table>
                                </div>
                            </div>
                        {/* </div> */}

                        {this.state.show &&
                            this.getWeatherMiniPop()
                        }

                    </PopupDraggable>
                </AtmospherePopupComponent>

                {/*
                <div style={{ position: 'absolute', top: '0px', left: '400px' }}>
                    <WeatherMiniPop show={this.state.show}></WeatherMiniPop>
                    {
                        this.state.show &&
                        <WeatherMiniPop></WeatherMiniPop>
                    }
                </div>
                */}
            </>
        );
    }
};

export default AtmospherePopup;