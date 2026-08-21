import React, { Component } from 'react';
import imgClose from '../../../Common/img/imghydrogen/common/closeX_icon.svg';
import SDMS from '../sdms';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import PopupDraggable from './popupDraggable';
import { CompoundDataComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SDMSMainMenu from '../sdmsMainMenu';
import store from '../../../Root/store';

import SettingsStore from '../../../Settings/settingsStore';


class CompoundData extends Component{
    constructor(props) {
        super(props);
        this.state = {
            rangeSensor: props.rangeSensor,
        }

        this.props = props;

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        //$('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
        //    if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
        //        document.getElementById(this.props.popupType).style.opacity = 1;
        //    }
        //});
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

        //store.subscribe(function () {
        //    let data = store.getState();

        //    if (data.actionType === 'RANGE_SENSORS') {
        //        this.updateRangeSensors(data);
        //    }

        //}.bind(this));

        //this.updateRangeSensors(store.getState());
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    //updateRangeSensors(storeValue) {
    //    if (storeValue.rangeSensors) {
    //        // 현재 수치값과 비교
    //        const _rangeSensor = this.state.rangeSensor;
    //        const sensors = storeValue.rangeSensors?.rangeEtcSensors?.length > 0 ? storeValue.rangeSensors.rangeEtcSensors : [];

    //        if (_rangeSensor) {
    //            const rangeSensor = sensors.find(x => x.id === _rangeSensor.id);

    //            if (rangeSensor && rangeSensor.currentData != _rangeSensor.currentData) {
    //                rangeSensor.type = _rangeSensor.type;
    //                this.setState({ rangeSensor });
    //            }
    //        }
    //    }
    //}


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex
        }
    }

    /* initPopupState() {
        var popup = document.getElementsByClassName('viewDashboardBoxD viewDashboard')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    } */ 

    repositionPopup(popupState) {
        let data = popupState.compoundData;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + " " + content.viewDashboardSection)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        //popup.style.marginLeft = '0px';

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    getSensor(sensorList, facilityType, sensorID) {
        //if (SdmsResource.isH2SensorType(facilityType)) {
            if (sensorList?.h2Sensors) {
                const sensorLength = sensorList?.h2Sensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList.h2Sensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isTempSensorType(facilityType)) {
            if (sensorList?.tempSensors) {
                const sensorLength = sensorList?.tempSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.tempSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isFlowSensorType(facilityType)) {
            if (sensorList?.flowSensors) {
                const sensorLength = sensorList?.flowSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.flowSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isConductivitySensorType(facilityType)) {
            if (sensorList?.conductSensors) {
                const sensorLength = sensorList?.conductSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.conductSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isGASSensorType(facilityType)) {
            if (sensorList?.gasSensors) {
                const sensorLength = sensorList?.gasSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.gasSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isPressureSensorType(facilityType)) {
            if (sensorList?.pressureSensors) {
                const sensorLength = sensorList?.pressureSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.pressureSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isO2SensorType(facilityType)) {
            if (sensorList?.o2Sensors) {
                const sensorLength = sensorList?.o2Sensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.o2Sensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isH2LowSensorType(facilityType)) {
            if (sensorList?.h2LowSensors) {
                const sensorLength = sensorList?.h2LowSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.h2LowSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isH2GasSensorType(facilityType)) {
            if (sensorList?.h2JAGSensors) {
                const sensorLength = sensorList?.h2JAGSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.h2JAGSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}
        //else if (SdmsResource.isO2GasSensorType(facilityType)) {
            if (sensorList?.o2JAGSensors) {
                const sensorLength = sensorList?.o2JAGSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = sensorList?.o2JAGSensors[i];
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        //}

        return null;
    }

    getSensorDataUI = () => {
        const sensorList = this.props.sensorList;
        const sensorAlarms = this.props.sensorAlarms;
        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        const sensor = this.getSensor(sensorList, sensorType, sensorID);

        let value = "-";
        let className = "highConcentration";
        let level = "0";
        let typeName = "-";
        let unit = "%";
        let isToolTip = false;
        
        if (sensor) {

            // 센서 값
            value = sensor.currentData;
            if (Number.isNaN(parseFloat(value)) === false) {
                value = parseFloat(value);
                value = Math.floor(value * 1000) / 1000;

                level = "33";
            }
            else {
                value = "-";
            }            

            // 센서 타입
            if (SdmsResource.isH2SensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.고농도수소');
                unit = "%";
                isToolTip = true;
            }
            else if (SdmsResource.isTempSensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.온도');
                unit = "°C";
            }
            else if (SdmsResource.isFlowSensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.전도도');
                unit = "%";
            }
            else if (SdmsResource.isConductivitySensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.유량');
                unit = "g/s";
            }
            else if (SdmsResource.isPressureSensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.압력');
                unit = "bar";
            }
            else if (SdmsResource.isO2SensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.산소');
                unit = "%";
                isToolTip = true;
            }
            else if (SdmsResource.isH2LowSensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.저농도수소');
                unit = "ppm";
                isToolTip = true;
            }
            else if (SdmsResource.isH2GasSensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.수소가스');
                unit = "%";
            }
            else if (SdmsResource.isO2GasSensorType(sensor.facilityType)) {
                typeName = i18n.t('facilityType.산소가스');
                unit = "%";
            }

            for (let i = 0; i < sensorAlarms?.length; i++) {
                const sensorAlarm = sensorAlarms[i];

                if (sensorAlarm.isAlarm === false) {
                    continue;
                }

                // 알람 데이터 중 해당 데이터가 있다면
                // 해당 알람 레벨 및 클래스 네임 설정
                if (sensor.id === sensorAlarm.orgSensorID) {

                    //alarmDepth = 2                    
                    if (sensorAlarm.alarmDepth > 2) {
                        className = "oxygen";
                        level = "100";
                    }
                    else if (sensorAlarm.alarmDepth > 1) {
                        className = "lowConcentration";
                        level = "66";
                    }
                }
            }
        }

        return [value, className, level, typeName, unit, isToolTip];
    }

    showTooltip = (value) => {
        const target = document.getElementById('measurementItemBox');
        
        if (value) {
            target.classList.add('on');
        } else {
            target.classList.remove('on');
        }
    }

    render(){
        const [value, className, level, typeName, unit, isToolTip] = this.getSensorDataUI();

        return(
            <CompoundDataComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboard'}> 
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={321}
                    popupMinHeight={159}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                <div className={'compoundInfoTitle'}>
                        <span>{i18n.t('sdms.compoundData.복합 수소 센서 데이터')}</span>
                    <span className={'colseX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.compoundData, false)}><a><img src={imgClose} alt={i18n.t('common.닫기')} /></a></span>
                </div>
                {/* <div className={'compoundInfoConts'}>
                    <div>category / degree of risk</div>
                    <div>high concentration of hydrogen</div>
                    <div>low concentration of hydrogen</div>
                    <div>Oxygen</div>
                </div> */}
                <div className={'compoundInfoConts'}>
                    <div className='contentBox'>
                            <div className='head'>
                                
                            <div className='categoryWrap'>
                                    <p>{i18n.t('sdms.compoundData.항목 / 위험도')}</p>
                                    {
                                        isToolTip && 
                                        <div className='tooltipWrap'>
                                            <span
                                                className={'questionMark'}
                                                id={'questionMark'}
                                                onMouseEnter={() => this.showTooltip(true)}
                                                onMouseOut={() => this.showTooltip(false)}
                                            />
                                            <div className={'measurementItemBox'} id={'measurementItemBox'}>
                                                <div className={'triangle'}></div>
                                                <div className={'measurementItem'} id={'measurementItem'}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <td width={'40%'}>{i18n.t('sdms.compoundData.측정항목')}</td>
                                                                <td width={'20%'}><span className={'stage0'}></span>{i18n.t('sdms.compoundData.0단계')}</td>
                                                                <td width={'20%'}><span className={'stage1'}></span>{i18n.t('sdms.compoundData.1단계')}</td>
                                                                <td width={'20%'}><span className={'stage2'}></span>{i18n.t('sdms.compoundData.2단계')}</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{i18n.t('sdms.compoundData.고농도 수소')}</td>
                                                                <td>0~14</td>
                                                                <td>15~24</td>
                                                                <td>25~</td>
                                                            </tr>
                                                            <tr>
                                                                <td>{i18n.t('sdms.compoundData.저농도 수소')}</td>
                                                                <td>0~99</td>
                                                                <td>100~499</td>
                                                                <td>500~</td>
                                                            </tr>
                                                            <tr>
                                                                <td>{i18n.t('sdms.compoundData.산소')}</td>
                                                                <td>20.0~22.0</td>
                                                                <td>{i18n.t('sdms.compoundData.이하')}</td>
                                                                <td>23.0~</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                
                            </div>
                            <div className='valueWrap'>
                                <p>{i18n.t('sdms.compoundData.수치')}</p>
                            </div>
                        </div>
                        <div className='body'>
                            <div>
                                <div className={'progressNum'}>
                                        <span>{typeName}</span>
                                        <span><progress className={className} value={level} min="0" max="100"></progress></span>
                                </div>
                                <div className={'valueNum'}>
                                        <span>{value}</span>
                                        <span>({ unit})</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </PopupDraggable>
            </CompoundDataComponent>
        );
    }

}

export default withTranslation()(CompoundData);