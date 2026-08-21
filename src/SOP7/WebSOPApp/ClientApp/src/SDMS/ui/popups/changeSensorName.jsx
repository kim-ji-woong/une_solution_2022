import React, { Component } from 'react';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import PopupDraggable from './popupDraggable';
import $ from 'jquery';
import SdmsResource from '../../resource/id';
import { ChangeSensorComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';
import {SDMSController} from "../../services/sdmsController";


class ChangeSensorName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 260,
            
            sensorList: null,
            buildingGroupList: null,
            useSensorTypes: null,
            
            currentTargetSensor: null,
            
            currentControlStatus: 0, // 0: 해제제어, 1: 세트제어
            
            modifiedObject: {},
        }
        
        this.refInputSensorName = React.createRef();

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
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
        
        this.init();
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('miniMapZIndex changed', this.state.popup.style.zIndex);
        }
        
    }
    
    componentWillUnmount() {
        
    }
    
    _setState = (state, callback) => {
        this.setState(state, () => {
            if (callback) {
                callback();
            }
        });
    }

    init = () => {
        const sensorList = this.props.sensorList;
        const buildingGroupList = this.props.buildingGroupList;
        const useSensorTypes = this.props.useSensorTypes;
        
        // 세트제어 해제제어 여부 가져오는 부분 자리
        
        this._setState({ sensorList, buildingGroupList, useSensorTypes });
    }

    repositionPopup(popupState) {
        let data = popupState.changeSensorName;

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
    
    isModified = (id) => {
        const modifiedObject = this.state.modifiedObject;

        if (modifiedObject === null || modifiedObject === undefined/* || modifiedObject === {}*/) {
            return false;
        }
        
        if (modifiedObject[id] !== null && modifiedObject[id] !== undefined) {
            return true;
        }
        
        return false;
    }
    
    getOptionUI = () => {
        if (this.state.sensorList === null || this.state.sensorList === undefined)
            return;
        
        if (this.state.useSensorTypes === null || this.state.useSensorTypes === undefined)
            return;
        
        const sensorList = this.state.sensorList;
        const useSensorTypes = this.state.useSensorTypes;
        
        let optionUI = [];
        
        let isModified = false;
        
        if (useSensorTypes.UseLaser) {
            if (sensorList.laserSensors !== null || sensorList.laserSensors !== undefined) {
                for (let i = 0; i < sensorList.laserSensors.length; i++) {
                    isModified = this.isModified(sensorList.laserSensors[i].id);
                    if (isModified) {
                        optionUI.push(<option key={"laser_" + i} value={sensorList.laserSensors[i].id}>*{sensorList.laserSensors[i].name}</option>)
                    } else {
                        optionUI.push(<option key={"laser_" + i} value={sensorList.laserSensors[i].id}>{sensorList.laserSensors[i].name}</option>)
                    }
                }
            }
        }
        
        if (useSensorTypes.UseDoor) {
            if (sensorList.doorSensors !== null || sensorList.laserSensors !== undefined) {
                for (let i = 0; i < sensorList.doorSensors.length; i++) {
                    isModified = this.isModified(sensorList.doorSensors[i].id);
                    if (isModified) {
                        optionUI.push(<option key={"door_" + i} value={sensorList.doorSensors[i].id}>*{sensorList.doorSensors[i].name}</option>)
                    } else {
                        optionUI.push(<option key={"door_" + i} value={sensorList.doorSensors[i].id}>{sensorList.doorSensors[i].name}</option>)
                    }
                }
            }
        }
        
        return optionUI;
    }
    
    // SdmsSensorETC 테이블에 한함
    getTargetSensor = (sensorID) => {
        const sensorList = this.state.sensorList;
        if (!sensorList) {
            return null;
        }
        
        for (let i = 0; i < sensorList.laserSensors.length; i++) {
            if (sensorList.laserSensors[i].id === parseInt(sensorID)) {
                return sensorList.laserSensors[i];
            }
        }
        
        for (let i = 0; i < sensorList.doorSensors.length; i++) {
            if (sensorList.doorSensors[i].id === parseInt(sensorID)) {
                return sensorList.doorSensors[i];
            }
        }
        
        return null;
    }
    
    setCurrentTarget = (value) => {
        const currentTargetSensor = this.getTargetSensor(value); // value = sensorID
        
        this._setState({ currentTargetSensor });
    }
    
    handleInputChange = () => {
        const name = this.refInputSensorName.current.value;
        // 업데이트 목록 
        let modifiedObject = this.state.modifiedObject? this.state.modifiedObject : {};
        
        // 현재 선택된 센서
        const currentTargetSensor = this.state.currentTargetSensor;
        
        if (currentTargetSensor === null || currentTargetSensor === undefined) {
            return;
        }
        
        if (name !== null && name !== undefined && name !== '') {
            modifiedObject[currentTargetSensor.id] = name;
        } else {
            if (modifiedObject[currentTargetSensor.id] !== null && modifiedObject[currentTargetSensor.id] !== undefined
                && modifiedObject[currentTargetSensor.id] !== '') {
                delete modifiedObject[currentTargetSensor.id];
            }
        }
        
        console.log(JSON.stringify(modifiedObject));
        
        this._setState({ modifiedObject });
    }
    
    getInputText = () => {
        const currentTargetSensor = this.state.currentTargetSensor;
        
        if (currentTargetSensor === null || currentTargetSensor === undefined) {
            return '';
        }
        
        const modifiedObject = this.state.modifiedObject;
        
        if (modifiedObject[currentTargetSensor.id] !== null && modifiedObject[currentTargetSensor.id] !== undefined) {
            return modifiedObject[currentTargetSensor.id];
        } else {
            return '';
        }
    }
    
    handleChangeStatus = (value) => { // 0: 해제제어, 1: 세트제어
        this._setState({ currentControlStatus: value });
    }

    onClickSave = async () => {
        const modifiedObject = this.state.modifiedObject;
        
        if (modifiedObject === null || modifiedObject === undefined) { // 향후 제어 여부도 확인하여 수정
            return;
        }
        
        let param = [];
        
        for (let key in modifiedObject) {
            if (modifiedObject[key] === null || modifiedObject[key] === undefined || modifiedObject[key] === '') {
                return;
            }

            let obj = { id: null, name: null };
            
            obj.id = key;
            obj.name = modifiedObject[key];
            
            param.push(obj);
        }
        
        const result = await SDMSController.requestUpdateSensorsFor2D(param);
        
        this.props.requestSensorList();
        
        this.props.showConfirmDialog("[INFO]", "수정이 완료되었습니다.", null, null);
        
        this._setState({ currentTargetSensor: null, modifiedObject: {} }, () => this.init());
        
    }

    render() {
        
        const optionUI = this.getOptionUI();
        
        const defaultInputText = this.getInputText();
        
        return (
            <ChangeSensorComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardChangeSensor'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={260}
                    popupMinHeight={180}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            센서명 변경
                        </h5>
                        {/*<a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.changeSensorName, false)}></a>*/}
                    </div>

                    <div className={'changeSensorConts'}>
                        <select onChange={(e) => this.setCurrentTarget(e.target.value)} defaultValue='default' value={this.state.currentTargetSensor?.id}>
                            <option value="default" disabled>선택하세요</option>    
                            {optionUI}
                        </select>
                        <input ref={this.refInputSensorName} value={defaultInputText} onChange={this.handleInputChange} type="text" placeholder="입력하세요"  />
                    </div>
                    <div className={'sensorBtnArea'}>
                        <div className={'sensorBtnBox'}>
                            {
                                this.state.currentControlStatus !== 1 ?
                                    <div id="statusCircle" className={'grayDOTT'}></div> :
                                    <div id="statusCircle" className={'greenDOTT'}></div>
                            }
                            <span onClick={() => this.handleChangeStatus(1)}>세트제어</span>
                            <span onClick={() => this.handleChangeStatus(0)}>해제제어</span>
                        </div>
                        <div className={'saveBtn'} onClick={() => this.onClickSave()}>저장</div>
                    </div>
                </PopupDraggable>
            </ChangeSensorComponent>
        );
    }
}

export default withTranslation()(ChangeSensorName);