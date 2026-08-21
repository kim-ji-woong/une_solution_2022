import React, { Component } from 'react';
//import styled from 'styled-components';
import './../../css/popup.css';


import content from '../../../Common/css/content.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';
import StatusInfo from './statusInfo';

import { AtmospherePopupComponent } from './../../sdmsStyled';
import store from '../../../Root/store';

import WeatherMiniPop from "./weatherMiniPop";

//#region Progress Bar
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
//#endregion

class BacteriaPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSensor: this.props.selectedSensor?.sensor,
            show: false,

            VOC: 0,
            OU: 0,

            miniPopInfo: false,
            miniPopInfo2: true,

            sensorList: store.getState().sensorList,

            isDangerVOC: 1,
            isDangerOU: 1,

            displayText: null,
        }

        this.props = props;

        store.subscribe(function () {

            const data = store.getState();

            if (data === null || data === undefined || data.actionType !== 'SENSOR_LIST')
                return;

            this.setState({ sensorList: data.sensorList });

        }.bind(this));

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        this.isDanger();

        this.isSubscribed = true;

        this.bacterialType = StatusInfo.BacterialType;
    }

    showModal = e => {

        this.setState({
            show: !this.state.show
        });
    };

    componentDidMount() {

        this.getMaterialValue();

        //#region 창이 서서히 나타나는 효과
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
        //#endregion

    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('miniMapZIndex changed', this.state.popup.style.zIndex);
        }

        if (this.props.selectedSensor !== prevProps.selectedSensor) {
            if (this.props.selectedSensor.sensorType === StatusInfo.BacterialType) {

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

        let prevStinksSensors = prevSensorList.stinks;

        let result = null;

        const sensorName = this.state.selectedSensor?.position;

        for (let i = 0; i < prevStinksSensors.length; i++) {
            const prevSensor = prevStinksSensors[i];
            const indiSensors = prevSensor.sensors;

            const curSensor = this.props.sensorList.stinks[i];
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

            const stinksSensors = this.props.sensorList.stinks;
            const curZoneID = this.state.selectedSensor.zoneID;

            let curSensor = null;

            for (const sensor of stinksSensors) {
                if (curZoneID === sensor.zoneID) {
                    curSensor = sensor;
                }
            }

            this.setState({ selectedSensor: curSensor }, this.getMaterialValue);
            
        }
    }


    repositionPopup(popupState) {
        let data = popupState.bacteriaPopup;

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
                    const grid = this.findElementByClassName(content.bacteriaPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'v-t': //탑 수직
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.bacteriaPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            // 대각
            case 'd-rb': // 오른쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.bacteriaPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-rt': //오른쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.bacteriaPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lb': //왼쪽 하단 대각
                sizeY = event.pageY - this.state.originalY;

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.bacteriaPopup);

                    if (grid) {
                        grid.style.height = (sizeY - 70) + 'px';
                    }
                }
                break;
            case 'd-lt': //왼쪽 상단 대각
                sizeY = this.state.originalHeight - (event.pageY - this.state.originalMouseY);

                if (event.pageY > 60 && event.pageY < this.state.maxScreenHeight && sizeY > this.state.popupMinHeight) {
                    const grid = this.findElementByClassName(content.bacteriaPopup);

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
            if (this.state.selectedSensor.sensors !== null || this.state.selectedSensor.sensors !== undefined) {
                const itemValues = this.state.selectedSensor.sensors;
                const materialLinks = this.props.materialLinks;
                const materials = this.props.material?.[0];

                let VOC = null;
                let OU = null;

                let VOCText = "VOC(유기화합물)";
                let OuText = "희석배수";
                
                let displayText = null;
                
                /*
                    * sensorType = 227 = VOC
                    * sensorType = 401 = OU
                    */
                for (const sensor of itemValues) {

                    if (sensor.sensorType === SDMSResource.materialType.VOC) {
                        VOC = sensor.value;
                        displayText = VOCText;
                    }

                    if (sensor.sensorType === SDMSResource.materialType.OU) {
                        OU = sensor.value;
                        displayText = OuText;
                    }


                };

                this.setState({ VOC: VOC, OU: OU, displayText: displayText }, () => {
                    this.isDanger(VOC, OU);
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

    getDangerDegreeFromMaterialLink = (value, link) => {
        if (!link) {
            return 1;
        }

        let dangerDegree = 1;

        if (link.direction === 1) { // 임계치 정방향
            if (value > link.max1) {
                dangerDegree = 2;
            }
            if (value > link.min2) {
                dangerDegree = 3;
            }
            if (value > link.max2) {
                dangerDegree = 4;
            }
        } else if (link.direction === 0) { // 임계치 역방향
            if (value < link.min2) {
                dangerDegree = 2;
            }
            if (value < link.max1) {
                dangerDegree = 3;
            }
            if (value < link.min1) {
                dangerDegree = 4;
            }
        }

        return dangerDegree;
    }

    // 대기 센서 위험도 기준
    isDanger(VOC, OU) {

        VOC = parseFloat(VOC);
        OU = parseFloat(OU);

        const materialLinks = this.props.materialLinks;

        let vocThreshold = materialLinks?.find(link => link.materialID === SDMSResource.materialType.VOC);
        let ouThreshold = materialLinks?.find(link => link.materialID === SDMSResource.materialType.OU);

        let isDangerVOC = this.getDangerDegreeFromMaterialLink(VOC, vocThreshold);
        let isDangerOU = this.getDangerDegreeFromMaterialLink(OU, ouThreshold);

        this.setState({ isDangerVOC, isDangerOU }, this.setDangerBar(isDangerVOC, isDangerOU, null, null));
    }

    setDangerBar(val1, val2, val3, val4) {
        drawSticks1(val1);
        drawSticks2(val2);
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

    render() {

        const time = this.getTime();

        return (
            <>
                <AtmospherePopupComponent id={this.props.popupType} className={content.bacteriaPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={280}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                        <div className={'sensorInfoTitleBox'}>
                            <div className={'sensorInfoDetailTitle'}>
                                <span className={'sensorTitleIcon'}></span>
                                <span className={'sensorDetailTitle'}>센서 상세정보</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span className={'referenceTime'}>{time} 기준</span>
                                <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.bacteriaPopup, false, true)}></span>
                            </div>
                        </div>

                        <div className={'sensorInfoContents'}>
                            <div className={'sensorInfoSecondBox'}>
                                <span className={'titleTriIcon'}></span>
                                <span className={'sensorTitleA'}>악취유해물질</span>
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
                                            {this.state.isDangerVOC >= 3 ?
                                                <td className={'itemBoxTd1 active'}>VOC</td> :
                                                <td className={'itemBoxTd1'}>VOC</td>
                                            }
                                            {this.state.isDangerVOC >= 3 ?
                                                <td className={'itemBoxTd2 active'}>{this.state.selectedSensor && this.state.VOC}ppb</td> :
                                                <td className={'itemBoxTd2'}>{this.state.selectedSensor && this.state.VOC}ppb</td>
                                            }
                                            <td className={'itemBoxTd3'}>
                                                <span className="sticks1"></span>
                                            </td>
                                        </tr>
                                        <tr className={'itemBoxTr'}>
                                            {this.state.isDangerOU >= 3 ?
                                                <td className={'itemBoxTd1 active'}>희석배수</td> :
                                                <td className={'itemBoxTd1'}>희석배수</td>
                                            }
                                            {this.state.isDangerOU >= 3 ?
                                                <td className={'itemBoxTd2 active'}>{this.state.selectedSensor && this.state.OU}㎍/㎥</td> :
                                                <td className={'itemBoxTd2'}>{this.state.selectedSensor && this.state.OU}㎍/㎥</td>
                                            }
                                            <td className={'itemBoxTd3'}>
                                                <span className="sticks2"></span>
                                            </td>
                                        </tr>
                                        
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
            </>
        );
    }
};

export default BacteriaPopup;