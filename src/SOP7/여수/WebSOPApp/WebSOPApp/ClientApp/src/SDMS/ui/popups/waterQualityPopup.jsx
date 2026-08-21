import React, { Component } from 'react';
import './../../css/popup.css';

import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import SDMSResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';
import StatusInfo from './statusInfo';

import { WaterQualityPopupComponent } from './../../sdmsStyled';
import store from '../../../Root/store';


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

let timer4 = null;
let timer5 = null;
let timer6 = null;
let timer7 = null;
let timer8 = null;

function clearChildren4(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function clearChildren5(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function clearChildren6(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function clearChildren7(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

function clearChildren8(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

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
            parent.lastChild.classList.add("red");
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

async function addSticks5(value, colorNum, parent, isDuplicated) {
    if (parent.lastChild) {
        if (value !== null && value !== undefined) {
            parent.lastChild.classList.remove("white");
            parent.lastChild.classList.add("gray");
        } else {
            parent.lastChild.classList.remove("white");
            parent.lastChild.classList.add("gray");
        }
    }

    if (parent.children.length >= 10)
        return;

    if (isDuplicated) {
        clearTimeout(timer5);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer5 = setTimeout(addSticks5, 50, value, colorNum, parent, false);
}

async function addSticks6(value, colorNum, parent, isDuplicated) {
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
        clearTimeout(timer6);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer6 = setTimeout(addSticks6, 50, value, colorNum, parent, false);
}

async function addSticks7(value, colorNum, parent, isDuplicated) {
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
        clearTimeout(timer7);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer7 = setTimeout(addSticks7, 50, value, colorNum, parent, false);
}

async function addSticks8(value, colorNum, parent, isDuplicated) {
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
        clearTimeout(timer8);
    }

    const child = document.createElement("div");
    child.classList.add("shortStick");
    child.classList.add("white");

    parent.appendChild(child);
    timer8 = setTimeout(addSticks8, 50, value, colorNum, parent, false);
}


async function drawSticks4(value) {
    const elements = document.getElementsByClassName("sticks4");

    if (elements && elements.length > 0) {
        const sticks4 = elements[0];
        clearChildren4(sticks4);
        addSticks4(value, 1, sticks4, true);
    }
}

async function drawSticks5(value) {
    const elements = document.getElementsByClassName("sticks5");

    if (elements && elements.length > 0) {
        const sticks5 = elements[0];
        clearChildren5(sticks5);
        addSticks5(value, 1, sticks5, true);
    }
}

async function drawSticks6(value) {
    const elements = document.getElementsByClassName("sticks6");

    if (elements && elements.length > 0) {
        const sticks6 = elements[0];
        clearChildren6(sticks6);
        addSticks6(value, 1, sticks6, true);
    }
}

async function drawSticks7(value) {
    const elements = document.getElementsByClassName("sticks7");

    if (elements && elements.length > 0) {
        const sticks7 = elements[0];
        clearChildren7(sticks7);
        addSticks7(value, 1, sticks7, true);
    }
}

async function drawSticks8(value) {
    const elements = document.getElementsByClassName("sticks8");

    if (elements && elements.length > 0) {
        const sticks8 = elements[0];
        clearChildren8(sticks8);
        addSticks8(value, 1, sticks8, true);
    }
}


class WaterQualityPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //selectedSensor: this.props.selectedSensorInfo?.sensor,
            selectedSensor: this.props.selectedSensor?.sensor,
            temp: 0,
            pH: 0,
            EC: 0,
            DO: 0,
            turb: 0,

            // 1 : 안전 , 2 : 보통 , 3 : 나쁨 , 4 : 매우나쁨 // EC제외
            isDangerTemp: 1,
            isDangerPH: 1,
            isDangerDO: 1,
            isDangerTurb: 1,

            sensorList: store.getState().sensorList,

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

        this.isDanger();

        this.isSubscribed = true;

    }

    componentDidMount() {

        this.getMaterialValue();


    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('miniMapZIndex changed', this.state.popup.style.zIndex);
        }

        if (this.props.selectedSensorInfo !== prevProps.selectedSensorInfo) {
            if (this.props.selectedSensorInfo.sensorType == StatusInfo.WaterType) {
                this.setState({ selectedSensor: this.props.selectedSensorInfo.sensor }, () => this.getMaterialValue());
            }
        }

        if (this.props.sensorList !== prevProps.sensorList) {
            this.isNewVal(prevProps.sensorList);

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

        let curAtmosSensors = this.props.sensorList.waters;
        let prevWaters = prevSensorList.waters;

        let result = null;

        const sensorName = this.state.selectedSensor?.position;

        for (let i = 0; i < prevWaters.length; i++) {
            const prevSensor = prevWaters[i];
            const indiSensors = prevSensor.sensors;

            const curSensor = this.props.sensorList.waters[i];
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

    getNewMaterialValue() {
        if (this.state.sensorList) {

            const waterSensor = this.props.sensorList.waters;
            const curZoneID = this.state.selectedSensor.zoneID;

            let curSensor = null;

            for (const sensor of waterSensor) {
                if (curZoneID === sensor.zoneID) {
                    curSensor = sensor;
                }
            }

            this.setState({ selectedSensor: curSensor }, this.getMaterialValue);

        }

    }

    repositionPopup(popupState) {
        let data = popupState.waterQualityPopup;

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

    getMaterialValue = () => {
        if (this.state.selectedSensor) {
            if (this.state.selectedSensor.sensors || this.state.selectedSensor.sensors != undefined) {
                const itemValues = this.state.selectedSensor.sensors;

                let temp = null;
                let pH = null;
                let EC = null;
                let DO = null;
                let turb = null;
                /*
                * sensorType = 250 = 수온 temp
                * sensorType = 238 = 수소이온농도 pH
                * sensorType = 265 = 전기전도도 EC
                * sensorType = 266 = 용존산소 DO
                * sensorType = 267 = 탁도 Turbidity
                */
                for (const sensor of itemValues) {
                    if (sensor.sensorType == 250) temp = sensor.value;
                    if (sensor.sensorType == 238) pH = sensor.value;
                    if (sensor.sensorType == 265) EC = sensor.value;;
                    if (sensor.sensorType == 266) DO = sensor.value;;
                    if (sensor.sensorType == 267) turb = sensor.value;;
                }

                this.setState({ temp: temp, pH: pH, EC: EC, DO: DO, turb: turb }, () => {
                    this.isDanger();
                })
            }
        }
    }

    // 수질 센서 위험도 기준
    isDanger() {

        let isDangerTemp = 1;
        let isDangerPH = 1;
        let isDangerDO = 1;
        let isDangerTurb = 1;

        const temp = parseFloat(this.state.temp);
        const pH = parseFloat(this.state.pH);
        const DO = parseFloat(this.state.DO);
        const turb = parseFloat(this.state.turb)

        if (temp > 20) {
            isDangerTemp = 2;
            if (temp > 39) {
                isDangerTemp = 3;
                if (temp > 50) {
                    isDangerTemp = 4;
                }
            }
        }

        if (pH > 5) {
            isDangerPH = 2;
            if (pH > 7) {
                isDangerPH = 3;
                if (pH > 8.6) {
                    isDangerPH = 4;
                }
            }
        }

        if (DO < 7.5) {
            isDangerDO = 2;
            if (DO < 5.1) {
                isDangerDO = 3;
                if (DO <= 2) {
                    isDangerDO = 4;
                }
            }
        }

        if (turb > 0.51) {
            isDangerTurb = 2;
            if (turb > 0.8) {
                isDangerTurb = 3;
                if (turb >= 1) {
                    isDangerTurb = 4;
                }
            }
        }
        this.setState({ isDangerTemp: isDangerTemp, isDangerPH: isDangerPH, isDangerDO: isDangerDO, isDangerTurb: isDangerTurb }, this.setDangerBar(isDangerTemp, isDangerPH, isDangerDO, isDangerTurb));
    }

    setDangerBar(isDangerTemp, isDangerPH, isDangerDO, isDangerTurb) {

        drawSticks4(isDangerDO);
        drawSticks5(1); // 기준 x
        drawSticks6(isDangerTurb);
        drawSticks7(isDangerPH);
        drawSticks8(isDangerTemp);
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

    render() {

        const time = this.getTime();

        return (
            <>
                <WaterQualityPopupComponent id={this.props.popupType} className={content.waterQualityPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={373}
                        popupMinHeight={356}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                        {/* <div className={'sensorInfoDetailBox'}> */}
                            <div className={'sensorInfoTitleBoxw'}>
                              <div className={'sensorInfoDetailTitlew'}>
                                <span className={'sensorTitleIcon'}></span>
                                <span className={'sensorDetailTitle'}>센서 상세정보</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span className={'referenceTime'}>{time} 기준</span>
                                <span className={'seosorCloseIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.waterQualityPopup, false, true)}></span>
                              </div>
                            </div>

                            <div className={'sensorInfoContentsWater'}>
                                <div className={'sensorInfoSecondBox'}>
                                    <span className={'titleTriIcon'}></span>
                                    <span className={'sensorTitleW'}>수질 상세정보</span>
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
                                                <th className={'itemBoxTh'}>측정항목</th>
                                                <th className={'itemBoxTh'}>수치</th>
                                                <th className={'itemBoxTh'}>위험도</th>
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                {this.state.isDangerDO >= 3 ?
                                                    <td className={'itemBoxTd1 active'}>DO</td> :
                                                    <td className={'itemBoxTd1'}>DO</td>
                                                }
                                                {this.state.isDangerDO >= 3 ?
                                                    <td className={'itemBoxTd2 active'}>{this.state.DO}㎕/㎥</td> :
                                                    <td className={'itemBoxTd2'}>{this.state.DO}㎕/㎥</td>
                                                }
                                                <td className={'itemBoxTd3'}><span className="sticks4"></span></td>
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                <td className={'itemBoxTd1'}>전기전도도</td>
                                                <td className={'itemBoxTd2'}>{this.state.EC}㎍/㎥</td>
                                                <td className={'itemBoxTd3'}><span className="sticks5"></span></td>
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                {this.state.isDangerTurb >= 3 ?
                                                    <td className={'itemBoxTd1 active'}>탁도</td> :
                                                    <td className={'itemBoxTd1'}>탁도</td>
                                                }
                                                {this.state.isDangerTurb >= 3 ?
                                                    <td className={'itemBoxTd2 active'}>{this.state.turb}㎍/㎥</td> :
                                                    <td className={'itemBoxTd2'}>{this.state.turb}㎍/㎥</td>
                                                }
                                                <td className={'itemBoxTd3'}><span className="sticks6"></span></td>
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                {this.state.isDangerPH >= 3 ?
                                                    <td className={'itemBoxTd1 active'}>PH</td> :
                                                    <td className={'itemBoxTd1'}>PH</td>
                                                }
                                                {this.state.isDangerPH >= 3 ?
                                                    <td className={'itemBoxTd2 active'}>{this.state.pH}PH</td> :
                                                    <td className={'itemBoxTd2'}>{this.state.pH}PH</td>
                                                }
                                                <td className={'itemBoxTd3'}><span className="sticks7"></span></td>
                                            </tr>
                                            <tr className={'itemBoxTr'}>
                                                {this.state.isDangerTemp >= 3 ?
                                                    <td className={'itemBoxTd1 active'}>수온</td> :
                                                    <td className={'itemBoxTd1'}>수온</td>
                                                }
                                                {this.state.isDangerTemp >= 3 ?
                                                    <td className={'itemBoxTd2 active'}>{this.state.temp}℃</td> :
                                                    <td className={'itemBoxTd2'}>{this.state.temp}℃</td>
                                                }
                                                <td className={'itemBoxTd3'}><span className="sticks8"></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        {/* </div> */}
                    </PopupDraggable>
                </WaterQualityPopupComponent>
            </>
        );
    };

};

export default WaterQualityPopup;