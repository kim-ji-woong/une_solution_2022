import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import uis from '../../../Common/css/ui.module.css';

import imgGrayLightIco from '../../../Common/image/icon/gray_light_ico.png';
import imgRedLightIco from '../../../Common/image/icon/red_light_ico.png';
import SdmsResource from '../../resource/id';
import { SDMSDataManager } from '../../services/sdmsDataManager';
import SDMS from '../sdms';
import SDMSMainMenu from '../sdmsMainMenu';
import ProjectResource from '../../../Root/resource/id';


class StatusInfoZone extends Component {
    constructor(props) {
        super(props);

        this.refZoneName = React.createRef();
        this.refZoneNameList = React.createRef();
        this.refSensors = React.createRef();
        this.refSensorsList = React.createRef();
        this.refFireSensors = React.createRef();
        this.refFireSensorsList = React.createRef();
        this.refPsmSensors = React.createRef();
        this.refPsmSensorsList = React.createRef();
        this.refEtcSensors = React.createRef();
        this.refEtcSensorsList = React.createRef();
        this.refCCTVGroups = React.createRef();
        this.refCCTVGroupsList = React.createRef();
        this.refCCTVSubGroups = React.createRef();
        this.refCCTVSubGroupsList = React.createRef();
        this.refFacilityGroups = React.createRef();
        this.refFacilityGroupsList = React.createRef();
        this.refFacilitySubGroups = React.createRef();
        this.refFacilitySubGroupsList = React.createRef();
        this.refExitLightSensors = React.createRef();
        this.refExitLightList = React.createRef();
        this.refExitLightGroups = React.createRef();
        this.refExitLightGroupsList = React.createRef();
        this.refSelectedItem = React.createRef();

        // 사용자가 마우스로 조작하였는가?
        // true : 접혔다.
        // false : 펼쳐졌다.
        this.manualZoneNameExpand = null;
        this.showZoneNameResult = false;
        this.manualSensorsExpand = null;
        this.showSensorsResult = false;
        this.manualFireSensorsExpand = null;
        this.showFireSensorsResult = false;
        this.manualPsmSensorsExpand = null;
        this.showPsmSensorsResult = false;
        this.manualEtcSensorsExpand = null;
        this.manualExitLightGroupExpand = null;
        this.manualExitLightSubGroupExpand = null;
        this.showEtcSensorsResult = false;
        this.manualCCTVGroupsExpand = null;
        this.showCCTVGroupsResult = false;
        this.manualCCTVSubGroupsExpand = null;
        this.showCCTVSubGroupsResult = false;
        this.manualFacilityGroupsExpand = null;
        this.showFacilityGroupsResult = false;
        this.manualFacilitySubGroupsExpand = null;
        //this.showFacilitySubGroupsResult = false;

        this.moveToX = this.moveToX.bind(this);
        this.prevSelectedSensor = [null, null, null];

        this.facilityTypes = this.initFacilityTypes();
    }

    initFacilityTypes() {
        const facilityTypes = {};

        facilityTypes[SdmsResource.materialType.FireFacility] = SdmsResource.getFacilityTypeString(SdmsResource.materialType.FireFacility);
        facilityTypes[SdmsResource.materialType.AirFacility] = SdmsResource.getFacilityTypeString(SdmsResource.materialType.AirFacility);
        facilityTypes[SdmsResource.materialType.ElectricFacility] = SdmsResource.getFacilityTypeString(SdmsResource.materialType.ElectricFacility);
        facilityTypes[SdmsResource.materialType.PanelFacility] = SdmsResource.getFacilityTypeString(SdmsResource.materialType.PanelFacility);

        return facilityTypes;
    }

    componentDidMount() {
        this.checkChildVisible();

    }

    componentDidUpdate(prevProps, prevState) {
        this.checkChildVisible();

        if (this.refSelectedItem.current) {
            this.props.setSelectedElement(this.refSelectedItem.current);
            //this.refSelectedItem.current.scrollIntoView(true);
        }
    }

    checkChildVisible() {
        this.checkChildVisibleData(this.refZoneName.current, this.refZoneNameList.current, this.showZoneNameResult);
        this.checkChildVisibleData(this.refSensors.current, this.refSensorsList.current, this.showSensorsResult);
        this.checkChildVisibleData(this.refFireSensors.current, this.refFireSensorsList.current, this.showFireSensorsResult);
        this.checkChildVisibleData(this.refPsmSensors.current, this.refPsmSensorsList.current, this.showPsmSensorsResult);
        this.checkChildVisibleData(this.refEtcSensors.current, this.refEtcSensorsList.current, this.showEtcSensorsResult);
        this.checkChildVisibleData(this.refCCTVGroups.current, this.refCCTVGroupsList.current, this.showCCTVGroupsResult);
        this.checkChildVisibleData(this.refCCTVSubGroups.current, this.refCCTVSubGroupsList.current, this.showCCTVSubGroupsResult);
        this.checkChildVisibleData(this.refFacilityGroups.current, this.refFacilityGroupsList.current, this.showFacilityGroupsResult);
        //this.checkChildVisibleData(this.refFacilitySubGroups.current, this.refFacilitySubGroupsList.current, this.showFacilitySubGroupsResult);
    }

    checkChildVisibleData(mainElement, listElement, showChild) {
        if (mainElement) {
            if (showChild) {
                if (mainElement.dataset.show_child !== 'true') {
                    mainElement.dataset.show_child = 'true';
                }

                if (listElement.classList.contains(content.on) === false) {
                    listElement.classList.add(content.on);
                }
            }
            else {
                if (mainElement.dataset.show_child !== 'false') {
                    mainElement.dataset.show_child = 'false';
                }

                if (listElement.classList.contains(content.on)) {
                    listElement.classList.remove(content.on);
                }
            }
        }
    }

    moveToX() {
        this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Floor, this.props.zone);
    }

    moveToSensor(sensorType, sensorID) {
        if (sensorType === SDMSMainMenu.Facility) {
            this.props.moveToX(SDMSMainMenu.Menu_MoveTo_Facility, [this.props.zone.id, SDMSMainMenu.Etc_Sensor, sensorID]);
        }
        else {
            this.props.moveToX(SDMSMainMenu.Menu_MoveTo_POI, [this.props.zone.id, sensorType, sensorID]);
        }        
    }

    onSelectSensor(sensorType, sensorID) {
        this.props.onSelectSensor(sensorType, this.props.zone.id, sensorID);
    }

    isAlarmSensor(facilityType, sensorID) {
        let alarmImgID = content.lightGrayICO;
        let alarmImgSrc = imgGrayLightIco;
        let enableColor = content.greenDOTT;

        if (this.props.sensorAlarms) {
            for (let j = 0; j < this.props.sensorAlarms.length; j++) {
                const alarm = this.props.sensorAlarms[j];
                if (!alarm.isAlarm) {
                    // 알람 발생한 센서는 상단에 있기 때문에 isAlarm=false가 나온 시점 이후에는 다 false만 있음
                    break;
                }
                if (facilityType === SdmsResource.facilityType.FIRE ||
                    (facilityType === SdmsResource.facilityType.PSM_SENSOR && SdmsResource.isPSMSensorType(facilityType)) ||
                    (facilityType === SdmsResource.facilityType.ETC && SdmsResource.isETCSensorType(facilityType)) ||
                    (facilityType === SdmsResource.facilityType.Intrusion_S1 && SdmsResource.isSVMSSensorType(facilityType))) {
                    if (alarm.orgSensorID === sensorID && alarm.facilityType === facilityType) {
                        alarmImgID = content.lightRedICO;
                        alarmImgSrc = imgRedLightIco;
                        enableColor = content.redDOTT;
                        break;
                    }
                }
            }
        }

        return [alarmImgID, alarmImgSrc, enableColor];
    }

    getSensorUI(facilitySubGroups_fireShowChild, facilitySubGroups_airShowChild, facilitySubGroups_electricShowChild, facilitySubGroups_panelShowChild) {
        let fireSensorUI = [];
        let psmSensorUI = [];
        let etcSensorUI = [];
        let cctvUI = [];
        let facilityInfosUI = [];
        let facilityInfoCount = 0;
        let exitLightUI = [];

        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        //const sensorList = this.props.sensorList;
        //if (sensorList === undefined || sensorList === null)
        //    return ui;
        
        if (this.props.fireSensors) {
            for (let i = 0; i < this.props.fireSensors.length; i++) {
                const sensor = this.props.fireSensors[i];
                const isSelected = sensorType === SDMSMainMenu.Fire_Sensor && sensorID === sensor.id;
                const sensorClassName = isSelected ? content.viewList5DepthTxt + " " + content.selected : content.viewList5DepthTxt;

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        if (isSelected) {
                            fireSensorUI.push(
                                <li key={'fireSensor_' + sensor.id} ref={this.refSelectedItem} id={'fireSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Fire_Sensor, sensor.id)}>{sensor.name}</span>
                                </li>
                            );
                        }
                        else {
                            fireSensorUI.push(
                                <li key={'fireSensor_' + sensor.id} id={'fireSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Fire_Sensor, sensor.id)}>{sensor.name}</span>
                                </li>
                            );
                        }
                    }
                    else {
                        const [alarmImgID, alarmImgSrc, enableColor] = this.isAlarmSensor(SdmsResource.facilityType.FIRE, sensor.id); // 알람이 발생한 센서인가 ?

                        // 화재센서 상태에 따라 색상 변화 수정 - K.D.R
                        /*let enableColor = content.grayDOTT;
                        if (sensor.enabled === true || sensor.enabled === null) {
                            enableColor = content.greenDOTT; 
                        }*/

                        if (isSelected) {
                            if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                                fireSensorUI.push(
                                    <li key={'fireSensor_' + sensor.id} ref={this.refSelectedItem} id={'fireSensor_' + sensor.id}>
                                        <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Fire_Sensor, sensor.id)}>{sensor.name}</span>
                                        <div className={content.linkArea}>
                                            <span className={content.drivingBox}>
                                                <span className={enableColor}></span>
                                                <span className={content.drivingText}></span>
                                            </span>
                                            <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.CCTV_Type, sensor.id)}>
                                                <a className={content.goA}>이동</a>
                                            </span>
                                        </div>
                                    </li>
                                );
                            }
                            else {
                                fireSensorUI.push(
                                    <li key={'fireSensor_' + sensor.id} ref={this.refSelectedItem} id={'fireSensor_' + sensor.id}>
                                        <span className={sensorClassName}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox}>
                                            <span><a /></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                        }
                        else {
                            if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                                fireSensorUI.push(
                                    <li key={'fireSensor_' + sensor.id} id={'fireSensor_' + sensor.id}>
                                        <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Fire_Sensor, sensor.id)}>{sensor.name}</span>
                                        <div className={content.linkArea}>
                                            <span className={content.drivingBox}>
                                                <span className={enableColor}></span>
                                                <span className={content.drivingText}></span>
                                            </span>
                                            <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.CCTV_Type, sensor.id)}>
                                                <a className={content.goA}>이동</a>
                                            </span>
                                        </div>
                                    </li>
                                );
                            }
                            else {
                                fireSensorUI.push(
                                    <li key={'fireSensor_' + sensor.id} id={'fireSensor_' + sensor.id}>
                                        <span className={sensorClassName}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox}>
                                            <span><a /></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }
        }
        
        if (this.props.psmSensors) {
            for (let i = 0; i < this.props.psmSensors.length; i++) {
                const sensor = this.props.psmSensors[i];
                const isSelected = sensorType === SDMSMainMenu.PSM_Sensor && sensorID === sensor.id;
                const sensorClassName = isSelected ? content.viewList5DepthTxt + " " + content.selected : content.viewList5DepthTxt;

                if (!sensor.linkedZones)
                    continue;

                if (sensor.zoneID === this.props.zone.id) {
                    if (this.props.isEditMode) {
                        if (isSelected) {
                            psmSensorUI.push(
                                <li key={'psmSensor_' + sensor.id} ref={this.refSelectedItem} id={'psmSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}>{sensor.name}</span>
                                </li>
                            );
                        }
                        else {
                            psmSensorUI.push(
                                <li key={'psmSensor_' + sensor.id} id={'psmSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}>{sensor.name}</span>
                                </li>
                            );
                        }
                    }
                    else {
                        const [alarmImgID, alarmImgSrc, enableColor] = this.isAlarmSensor(SdmsResource.facilityType.PSM_SENSOR, sensor.id); // 알람이 발생한 센서인가 ?
                        /*let enableColor = content.greenDOTT;
                        if (!sensor.enabled) {
                            enableColor = content.grayDOTT;
                        }*/

                        if (isSelected) {
                            if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                                psmSensorUI.push(
                                    <li key={'psmSensor_' + sensor.id} ref={this.refSelectedItem} id={'psmSensor_' + sensor.id}>
                                        <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox + " " + content.linkArea}>
                                            <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}><a className={content.goA}>이동</a></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            } else {
                                psmSensorUI.push(
                                    <li key={'psmSensor_' + sensor.id} ref={this.refSelectedItem} id={'psmSensor_' + sensor.id}>
                                        <span className={sensorClassName}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox}>
                                            <span><a /></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                        }
                        else {
                            if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                                psmSensorUI.push(
                                    <li key={'psmSensor_' + sensor.id} id={'psmSensor_' + sensor.id}>
                                        <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox + " " + content.linkArea}>
                                            <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.PSM_Sensor, sensor.id)}><a className={content.goA}>이동</a></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            } else {
                                psmSensorUI.push(
                                    <li key={'psmSensor_' + sensor.id} id={'psmSensor_' + sensor.id}>
                                        <span className={sensorClassName}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox}>
                                            <span><a /></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }
        }

        if (this.props.exitLights) {
            for (let i = 0; i < this.props.exitLights.length; i++) {
                const sensor = this.props.exitLights[i];
                
                if (sensor.zoneID === this.props.zone.id) {
                    this.addExitLightFromEtc(sensor, sensorType, sensorID, exitLightUI);
                }
            }
        }

        if (this.props.etcSensors) {
            // etc 센서는 복합센서라서 하나의 센서가 여러개의 타입을 가질수 있다.
            // 같은 이름의 센서는 하나만 표시하도록 한다.
            let prevSensorName = "";
            const facilityTypes = {};

            for (let i = 0; i < this.props.etcSensors.length; i++) {
                const sensor = this.props.etcSensors[i];

                if (sensor.name === prevSensorName)
                    continue;
                else
                    prevSensorName = sensor.name;

                const isSelected = sensorType === SDMSMainMenu.Etc_Sensor && sensorID === sensor.id;
                const sensorClassName = isSelected ? content.viewList5DepthTxt + " " + content.selected : content.viewList5DepthTxt;

                if (sensor.zoneID === this.props.zone.id) {
                    const facilityTypeName = this.facilityTypes[sensor.materialType];

                    if (facilityTypeName) {
                        this.addFacilityFromEtc(sensor, facilityTypeName, facilityTypes, sensorID);
                        continue;
                    }
                    else if (sensor.materialType === SdmsResource.materialType.ExitLight) {
                        this.addExitLightFromEtc(sensor, exitLightUI);
                        continue;
                    }

                    if (this.props.isEditMode) {
                        if (isSelected) {
                            etcSensorUI.push(
                                <li key={'etcSensor_' + sensor.id} ref={this.refSelectedItem} id={'etcSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>{sensor.name}</span>
                                </li>
                            );
                        }
                        else {
                            etcSensorUI.push(
                                <li key={'etcSensor_' + sensor.id} id={'etcSensor_' + sensor.id}>
                                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>{sensor.name}</span>
                                </li>
                            );
                        }
                    }
                    else {
                        const [alarmImgID, alarmImgSrc, enableColor] = this.isAlarmSensor(SdmsResource.facilityType.ETC, sensor.id); // 알람이 발생한 센서인가 ?
                        /*let enableColor = content.greenDOTT;
                        if (!sensor.enabled) {
                            enableColor = content.grayDOTT;
                        }*/

                        if (isSelected) {
                            if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                                etcSensorUI.push(
                                    <li key={'etcSensor_' + sensor.id} ref={this.refSelectedItem} id={'etcSensor_' + sensor.id}>
                                        <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox + " " + content.linkArea}>
                                            <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>
                                                <a className={content.goA}>이동</a>
                                            </span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                            else {
                                etcSensorUI.push(
                                    <li key={'etcSensor_' + sensor.id} ref={this.refSelectedItem} id={'etcSensor_' + sensor.id}>
                                        <span className={sensorClassName}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox}>
                                            <span><a /></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                        }
                        else {
                            if (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z)) {
                                etcSensorUI.push(
                                    <li key={'etcSensor_' + sensor.id} id={'etcSensor_' + sensor.id}>
                                        <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox + " " + content.linkArea}>
                                            <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.Etc_Sensor, sensor.id)}>
                                                <a className={content.goA}>이동</a>
                                            </span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                            else {
                                etcSensorUI.push(
                                    <li key={'etcSensor_' + sensor.id} id={'etcSensor_' + sensor.id}>
                                        <span className={sensorClassName}>{sensor.name}</span>
                                        <div className={uis.floatR + ' ' + content.posiRelative + " " + content.flexBox}>
                                            <span><a /></span>
                                            <div className={content.iconHorizontal}>
                                                <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                                <span className={enableColor}></span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }
                        }
                    }
                }
            }

            facilityInfoCount = this.addFacilityFromFacilityTypes(facilityInfosUI, facilityTypes, facilitySubGroups_fireShowChild, facilitySubGroups_airShowChild, facilitySubGroups_electricShowChild, facilitySubGroups_panelShowChild);
        }

        if (this.props.cctvs) {
            for (let i = 0; i < this.props.cctvs.length; i++) {
                const sensor = this.props.cctvs[i];
                const sensorClassName = sensorType === SDMSMainMenu.CCTV_Type && sensorID === sensor.id ? content.viewList5DepthTxt + " " + content.selected : content.viewList5DepthTxt;

                if (sensor.zoneID === this.props.zone.id) {
                    /*let enableColor = content.grayDOTT;
                    if (sensor.enabled === true || sensor.enabled === null) {
                        enableColor = content.greenDOTT;
                    }*/

                    const [alarmImgID, alarmImgSrc, enableColor] = this.isAlarmSensor(SdmsResource.facilityType.Intrusion_S1, sensor.id); // 알람이 발생한 센서인가 ?

                    cctvUI.push(
                        <li key={'cctv_' + sensor.id} id={'cctv_' + sensor.id}>
                            <span className={sensorClassName} /* style={{ width: '147px' }} */ onClick={() => this.moveToSensor(SDMSMainMenu.CCTV_Type, sensor.id)}>{sensor.name}</span>
                            {
                                (this.props.isEditMode === false && (this.props.hasIndoorModel || (sensor.x && sensor.y && sensor.z))) &&
                                <>
                                    <div className={content.linkArea}>
                                        <span className={content.drivingBox}>
                                            <span className={content.greenDOTE}></span>
                                            {/* <span className={content.redDOTE}></span> */}
                                        </span>
                                        <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.CCTV_Type, sensor.id)}>
                                            <a className={content.goA}>이동</a>
                                        </span>
                                        {/* <div className={content.iconHorizontal}>
                                            <img className={content.alarmImg} id={alarmImgID} src={alarmImgSrc} />
                                            <span className={enableColor}></span>
                                        </div> */}
                                   </div>
                                </>
                            }
                        </li>
                    );
                }
            }
        }

        return [fireSensorUI, psmSensorUI, etcSensorUI, cctvUI, facilityInfosUI, facilityInfoCount, exitLightUI, exitLightUI.length];
    }

    addExitLightFromEtc(sensor, sensorType, sensorID, exitLightUI) {
        const isSelected = sensorType === SDMSMainMenu.ExitLight_Sensor && sensorID === sensor.id;
        const sensorClassName = isSelected ? content.viewList5DepthTxt + " " + content.selected : content.viewList5DepthTxt;

        // 알람이 발생한 센서인가 ?
        const [alarmImgID, alarmImgSrc, enableColor] = this.isAlarmSensor(SdmsResource.facilityType.ETC, sensor.id);
        /*let enableColor = content.greenDOTT;
        if (!sensor.enabled) {
            enableColor = content.grayDOTT;
        }*/

        if (isSelected) {
            exitLightUI.push(
                <li key={'exitLight_' + sensor.id} ref={this.refSelectedItem} id={'exitLight_' + sensor.id}>
                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.ExitLight_Sensor, sensor.id)}>{sensor.name}</span>
                    <div className={content.linkArea}>
                        <span className={content.drivingBox}>
                            <span className={enableColor}></span>
                        </span>
                        <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.ExitLight_Sensor, sensor.id)}>
                            <a className={content.goA}>이동</a>
                        </span>
                    </div>

                </li>
            );
        }
        else {
            exitLightUI.push(
                <li key={'exitLight_' + sensor.id} id={'exitLight_' + sensor.id}>
                    <span className={sensorClassName} onClick={() => this.moveToSensor(SDMSMainMenu.ExitLight_Sensor, sensor.id)}>{sensor.name}</span>
                    <div className={content.linkArea}>
                        <span className={content.drivingBox}>
                            <span className={enableColor}></span>
                        </span>
                        <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.ExitLight_Sensor, sensor.id)}>
                            <a className={content.goA}>이동</a>
                        </span>
                    </div>

                </li>
            );
        }
    }

    addFacilityFromEtc(sensor, facilityTypeName, facilityTypes, selectedSensorID) {
        let facilityTypeDatas = facilityTypes[facilityTypeName];

        if (!facilityTypeDatas) {
            facilityTypeDatas = [];
            facilityTypes[facilityTypeName] = facilityTypeDatas;
        }

        const isSelected = selectedSensorID === sensor.id;
        const sensorClassName = isSelected ? content.viewList5DepthTxt + " " + content.selected : content.viewList5DepthTxt;

        // 알람이 발생한 센서인가 ?
        const [alarmImgID, alarmImgSrc, enableColor] = this.isAlarmSensor(SdmsResource.facilityType.ETC, sensor.id);

        if (isSelected) {
            facilityTypeDatas.push(
                <li key={'facilityInfo_' + sensor.id} ref={this.refSelectedItem} id={'facilityInfo_' + sensor.id}>
                    <span className={sensorClassName} style={{ width: '90px' }} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, sensor.id)}>{sensor.name}</span>
                    {
                        (this.props.isEditMode === false) &&
                        <>
                            {/* <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, sensor.id)}>
                              <a className={content.goA}>이동</a> 
                           </span> */}

                            <div className={content.linkArea}>
                                <span className={content.drivingBox}>
                                    <span className={enableColor}></span>
                                    <span className={content.drivingText}></span>
                                </span>
                                <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, sensor.id)}>
                                    <a className={content.goA}>이동</a>
                                </span>
                            </div>
                        </>
                    }
                </li>
            );
        }
        else {
            facilityTypeDatas.push(
                <li key={'facilityInfo_' + sensor.id} id={'facilityInfo_' + sensor.id}>
                    <span className={sensorClassName} style={{ width: '90px' }} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, sensor.id)}>{sensor.name}</span>
                    {
                        (this.props.isEditMode === false) &&
                        <>
                            {/* <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, sensor.id)}>
                              <a className={content.goA}>이동</a> 
                           </span> */}

                            <div className={content.linkArea}>
                                <span className={content.drivingBox}>
                                    <span className={enableColor}></span>
                                    <span className={content.drivingText}></span>
                                </span>
                                <span className={content.goLink} onClick={() => this.moveToSensor(SDMSMainMenu.Facility, sensor.id)}>
                                    <a className={content.goA}>이동</a>
                                </span>
                            </div>
                        </>
                    }
                </li>
            );
        }
    }

    addFacilityFromFacilityTypes(facilityInfosUI, facilityTypes, facilitySubGroups_fireShowChild, facilitySubGroups_airShowChild, facilitySubGroups_electricShowChild, facilitySubGroups_panelShowChild) {
        let facilityCount = 0;
        let showChild = false;

        const fireTypeName = SdmsResource.getFacilityTypeString(SdmsResource.materialType.FireFacility);
        const airTypeName = SdmsResource.getFacilityTypeString(SdmsResource.materialType.AirFacility);
        const electricTypeName = SdmsResource.getFacilityTypeString(SdmsResource.materialType.ElectricFacility);
        const panelTypeName = SdmsResource.getFacilityTypeString(SdmsResource.materialType.PanelFacility);

        for (const facilityTypeName in facilityTypes) {
            const facilityTypeDatas = facilityTypes[facilityTypeName];
            const dataCount = facilityTypeDatas.length;
            const typeName = facilityTypeName + "(" + dataCount + ")";

            if (facilityTypeName === fireTypeName) {
                showChild = facilitySubGroups_fireShowChild;
            }
            else if (facilityTypeName === airTypeName) {
                showChild = facilitySubGroups_airShowChild;
            }
            else if (facilityTypeName === electricTypeName) {
                showChild = facilitySubGroups_electricShowChild;
            }
            else if (facilityTypeName === panelTypeName) {
                showChild = facilitySubGroups_panelShowChild;
            }
            else {
                continue;
            }

            facilityCount += dataCount;

            facilityInfosUI.push(
                <li>
                    <span ref={this.refFacilitySubGroups} className={content.viewList4DepthHead} data-show_child={showChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e, facilityTypeName) }}>{typeName}</span>

                    <ul ref={this.refFacilitySubGroupsList} className={showChild === 'true' ? content.viewList5Depth + " " + content.on : content.viewList5Depth}>
                        {facilityTypeDatas}
                    </ul>
                </li>
            );
        }

        return facilityCount;
    }

    showChild(e, facilityTypeName) {
        const expand = this.props.showChild(e);

        // 현황정보 트리를 선택시 기존 선택된 POI는 선택해제 - K.D.R
        this.onSelectSensor(null, null);

        if (e.target === this.refZoneName.current) {
            this.manualZoneNameExpand = expand;
            if (this.manualZoneNameExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            } else if (!this.manualZoneNameExpand && this.props.onChangeBuildingGroup) {
                // 층 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 층 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup("zone", SDMS.SelectedStatusInfoType.closeZone);
            }
        }
        else if (e.target === this.refSensors.current) {
            this.manualSensorsExpand = expand;
            if (this.manualSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            } else if (!this.manualSensorsExpand && this.props.onChangeBuildingGroup) {
                // 센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            }
        }
        else if (e.target === this.refFireSensors.current) {
            this.manualFireSensorsExpand = expand;
            if (this.manualFireSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('fireSensors', SDMS.SelectedStatusInfoType.fireSensors);
            } else if (!this.manualFireSensorsExpand && this.props.onChangeBuildingGroup) {
                // 화재센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 화재센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        else if (e.target === this.refPsmSensors.current) {
            this.manualPsmSensorsExpand = expand;
            if (this.manualPsmSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('psmSensors', SDMS.SelectedStatusInfoType.psmSensors);
            } else if (!this.manualPsmSensorsExpand && this.props.onChangeBuildingGroup) {
                // PSM센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> PSM센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        else if (e.target === this.refEtcSensors.current) {
            this.manualEtcSensorsExpand = expand;
            if (this.manualEtcSensorsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('etcSensors', SDMS.SelectedStatusInfoType.etcSensors);
            } else if (!this.manualEtcSensorsExpand && this.props.onChangeBuildingGroup) {
                // ETC센서 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> ETC센서 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('sensorGroups', SDMS.SelectedStatusInfoType.sensorGroups);
            }
        }
        else if (e.target === this.refCCTVGroups.current) {
            this.manualCCTVGroupsExpand = expand;
            if (this.manualCCTVGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('cctvGroups', SDMS.SelectedStatusInfoType.cctvGroups);
            } else if (!this.manualCCTVGroupsExpand && this.props.onChangeBuildingGroup) {
                // CCTV 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어 닫히지 않는 오류 >> CCTV 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            }
        }
        else if (e.target === this.refCCTVSubGroups.current) {
            this.manualCCTVSubGroupsExpand = expand;
            if (this.manualCCTVSubGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('cctvSubGroups', SDMS.SelectedStatusInfoType.cctvSubGroups);
            } else if (!this.manualCCTVSubGroupsExpand && this.props.onChangeBuildingGroup) {
                // CCTV 서브트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어 닫히지 않는 오류 >> CCTV 서브 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('cctvGroups', SDMS.SelectedStatusInfoType.cctvGroups);
            }
        }
        else if (e.target === this.refFacilityGroups.current) {
            this.manualFacilityGroupsExpand = expand;
            if (this.manualFacilityGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('facilityGroups', SDMS.SelectedStatusInfoType.facilityGroups);
            } else if (!this.manualFacilityGroupsExpand && this.props.onChangeBuildingGroup) {
                // 설비 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 설비 트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup(this.props.zone, SDMS.SelectedStatusInfoType.zone);
            }
        }
        else if (e.target === this.refFacilitySubGroups.current) {
            this.manualFacilitySubGroupsExpand = expand;
            if (this.manualFacilitySubGroupsExpand && this.props.onChangeBuildingGroup) {
                this.props.onChangeBuildingGroup('facilitySubGroups', this.getFacilitySubGroupType(facilityTypeName));
            } else if (!this.manualFacilitySubGroupsExpand && this.props.onChangeBuildingGroup) {
                // 설비 서브트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어 닫히지 않는 오류 >> 설비 서브트리가 닫힐 경우도 추가 - K.D.R
                this.props.onChangeBuildingGroup('facilityGroups', SDMS.SelectedStatusInfoType.facilityGroups);
            }
        }        
    }

    getFacilitySubGroupType(facilityTypeName) {
        if (facilityTypeName === SdmsResource.getFacilityTypeString(SdmsResource.materialType.FireFacility)) {
            return SDMS.SelectedStatusInfoType.facilitySubGroups_fire;
        }
        else if (facilityTypeName === SdmsResource.getFacilityTypeString(SdmsResource.materialType.AirFacility)) {
            return SDMS.SelectedStatusInfoType.facilitySubGroups_air;
        }
        else if (facilityTypeName === SdmsResource.getFacilityTypeString(SdmsResource.materialType.ElectricFacility)) {
            return SDMS.SelectedStatusInfoType.facilitySubGroups_electric;
        }
        else if (facilityTypeName === SdmsResource.getFacilityTypeString(SdmsResource.materialType.PanelFacility)) {
            return SDMS.SelectedStatusInfoType.facilitySubGroups_panel;
        }

        return "";
    }

    isSelected() {
        let zoneShowChild = 'false';
        let sensorsShowChild = 'false';
        let fireSensorsShowChild = 'false';
        let psmSensorsShowChild = 'false';
        let etcSensorsShowChild = 'false';
        let exitLightGroupShowChild = 'false';
        let exitLightSubGroupShowChild = 'false';
        let cctvGroupsShowChild = 'false';
        let cctvSubGroupsShowChild = 'false';
        let facilityGroupsShowChild = 'false';
        let facilitySubGroups_fireShowChild = 'false';
        let facilitySubGroups_airShowChild = 'false';
        let facilitySubGroups_electricShowChild = 'false';
        let facilitySubGroups_panelShowChild = 'false';

        const [sensorType, zoneID, sensorID] = this.props.selectedSensor;

        if (this.prevSelectedSensor[0] !== sensorType ||
            this.prevSelectedSensor[1] !== zoneID ||
            this.prevSelectedSensor[2] !== sensorID) {

            this.manualZoneNameExpand = null;
            this.manualSensorsExpand = null;
            this.manualFireSensorsExpand = null;
            this.manualPsmSensorsExpand = null;
            this.manualEtcSensorsExpand = null;
            this.manualExitLightGroupExpand = null;
            this.manualExitLightSubGroupExpand = null;
            this.manualCCTVGroupsExpand = null;
            this.manualCCTVSubGroupsExpand = null;
        }

        this.prevSelectedSensor = [sensorType, zoneID, sensorID];

        if (sensorType !== null && zoneID !== null && sensorID !== null && sensorType !== "etc") {
            const zoneData = this.props.zone;

            if (zoneData && zoneData.id === zoneID) {
                // 선택된 센서가 있으니 Tree를 펼친다.
                zoneShowChild = 'true';

                if (sensorType === "cctv") {
                    cctvGroupsShowChild = 'true';
                    cctvSubGroupsShowChild = 'true';
                }
                else if (sensorType === "exitLight") {
                    exitLightGroupShowChild = 'true';
                    exitLightSubGroupShowChild = 'true';
                }
                else {
                    sensorsShowChild = 'true';

                    if (sensorType === "fire") {
                        fireSensorsShowChild = 'true';
                    }
                    else if (sensorType === "psm") {
                        psmSensorsShowChild = 'true';
                    }
                    else if (sensorType === "etc") {
                        etcSensorsShowChild = 'true';
                    }
                }
            }
        }
        else {
            if (this.props.selectedInfo) {
                if (this.props.zone === this.props.selectedInfo.zone) {
                    zoneShowChild = 'true';

                    if (this.props.selectedInfo.sensorGroups) {
                        sensorsShowChild = 'true';
                        if (this.props.selectedInfo.fireSensors) {
                            fireSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.psmSensors) {
                            psmSensorsShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.etcSensors) {
                            etcSensorsShowChild = 'true';
                        }
                    }
                    if (this.props.selectedInfo.exitLightGroups) {
                        exitLightGroupShowChild = 'true';
                        if (this.props.selectedInfo.exitLightSubGroups) {
                            exitLightSubGroupShowChild = 'true';
                        }
                    }                    
                    if (this.props.selectedInfo.cctvGroups) {
                        cctvGroupsShowChild = 'true';
                        if (this.props.selectedInfo.cctvSubGroups) {
                            cctvSubGroupsShowChild = 'true';
                        }
                    }                    
                    if (this.props.selectedInfo.facilityGroups) {
                        facilityGroupsShowChild = 'true';

                        if (this.props.selectedInfo.facilitySubGroups_fire) {
                            facilitySubGroups_fireShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.facilitySubGroups_air) {
                            facilitySubGroups_airShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.facilitySubGroups_electric) {
                            facilitySubGroups_electricShowChild = 'true';
                        }
                        else if (this.props.selectedInfo.facilitySubGroups_panel) {
                            facilitySubGroups_panelShowChild = 'true';
                        }
                    }                    
                }
            }
            else {
                if (this.manualZoneNameExpand !== null) {
                    zoneShowChild = this.manualZoneNameExpand ? 'true' : 'false';
                }

                if (this.manualSensorsExpand !== null) {
                    sensorsShowChild = this.manualSensorsExpand ? 'true' : 'false';
                }

                if (this.manualFireSensorsExpand !== null) {
                    fireSensorsShowChild = this.manualFireSensorsExpand ? 'true' : 'false';
                }

                if (this.manualPsmSensorsExpand !== null) {
                    psmSensorsShowChild = this.manualPsmSensorsExpand ? 'true' : 'false';
                }

                if (this.manualEtcSensorsExpand !== null) {
                    etcSensorsShowChild = this.manualEtcSensorsExpand ? 'true' : 'false';
                }

                if (this.manualExitLightGroupExpand !== null) {
                    exitLightGroupShowChild = this.manualExitLightGroupExpand ? 'true' : 'false';
                }

                if (this.manualExitLightSubGroupExpand !== null) {
                    exitLightSubGroupShowChild = this.manualExitLightSubGroupExpand ? 'true' : 'false';
                }

                if (this.manualCCTVGroupsExpand !== null) {
                    cctvGroupsShowChild = this.manualCCTVGroupsExpand ? 'true' : 'false';
                }

                if (this.manualCCTVSubGroupsExpand !== null) {
                    cctvSubGroupsShowChild = this.manualCCTVSubGroupsExpand ? 'true' : 'false';
                }

                if (this.manualFacilityGroupsExpand !== null) {
                    facilityGroupsShowChild = this.manualFacilityGroupsExpand ? 'true' : 'false';
                }

                if (this.manualFacilitySubGroupsExpand !== null) {
                    console.log("확인필요");
                    //facilitySubGroupsShowChild = this.manualFacilitySubGroupsExpand ? 'true' : 'false';
                }
            }
        }

        return [zoneShowChild, sensorsShowChild, fireSensorsShowChild, psmSensorsShowChild, etcSensorsShowChild, cctvGroupsShowChild, cctvSubGroupsShowChild, facilityGroupsShowChild, facilitySubGroups_fireShowChild, facilitySubGroups_airShowChild, facilitySubGroups_electricShowChild, facilitySubGroups_panelShowChild, exitLightGroupShowChild, exitLightSubGroupShowChild ];
    }

    render() {
        const [zoneShowChild, sensorsShowChild, fireSensorsShowChild, psmSensorsShowChild, etcSensorsShowChild, cctvGroupsShowChild, cctvSubGroupsShowChild, facilityGroupsShowChild, facilitySubGroups_fireShowChild, facilitySubGroups_airShowChild, facilitySubGroups_electricShowChild, facilitySubGroups_panelShowChild, exitLightGroupShowChild, exitLightSubGroupShowChild] = this.isSelected();
        let [fireSensorUI, psmSensorUI, etcSensorUI, cctvUI, facilityInfosUI, facilityCount, exitLightUI, exitLightCount] = this.getSensorUI(facilitySubGroups_fireShowChild, facilitySubGroups_airShowChild, facilitySubGroups_electricShowChild, facilitySubGroups_panelShowChild);
        this.showZoneNameResult = zoneShowChild === 'true';
        this.showSensorsResult = sensorsShowChild === 'true';
        this.showFireSensorsResult = fireSensorsShowChild === 'true';
        this.showPsmSensorsResult = psmSensorsShowChild === 'true';
        this.showEtcSensorsResult = etcSensorsShowChild === 'true';
        this.showExitLightGroupResult = exitLightGroupShowChild === 'true';
        this.showExitLightSubGroupResult = exitLightSubGroupShowChild === 'true';
        this.showCCTVGroupsResult = cctvGroupsShowChild === 'true';
        this.showCCTVSubGroupsResult = cctvSubGroupsShowChild === 'true';
        this.showFacilityGroupsResult = facilityGroupsShowChild === 'true';
        //this.showFacilitySubGroupsResult = facilitySubGroupsShowChild === 'true';

        const zoneName = this.props.zone.displayText ? this.props.zone.displayText : this.props.zone.name;

        const fireSensorCount = (this.props.fireSensors) ? this.props.fireSensors.length : 0;
        const psmSensorCount = (this.props.psmSensors) ? this.props.psmSensors.length : 0;
        const etcSensorCount = (this.props.etcSensors) ? this.props.etcSensors.length : 0;
        const cctvCount = (this.props.cctvs) ? this.props.cctvs.length : 0;

        const allSensorCount = fireSensorCount/* + psmSensorCount + etcSensorCount*/;
        let sensorUI = null;
            /*<React.Fragment>
                <li>
                    <span ref={this.refPsmSensors} className={content.viewList4DepthHead} data-show_child={psmSensorsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>누출센서 ({psmSensorCount})</span>
                    <ul ref={this.refPsmSensorsList} className={psmSensorsShowChild === 'true' ? content.viewList5Depth + " " + content.on : content.viewList5Depth}>
                        {psmSensorUI}
                    </ul>
                </li>
                <li>
                    <span ref={this.refEtcSensors} className={content.viewList4DepthHead} data-show_child={etcSensorsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>ETC센서 ({etcSensorCount})</span>
                    <ul ref={this.refEtcSensorsList} className={etcSensorsShowChild === 'true' ? content.viewList5Depth + " " + content.on : content.viewList5Depth}>
                        {etcSensorUI}
                    </ul>
                </li>
            </React.Fragment>;*/

        return (            
            <li>
                <span className={content.locationIcon}></span> 
                <div id={this.props.id} className={content.viewList2DepthHead}>
                    <span ref={this.refZoneName} className={content.viewList2DepthSpen} data-show_child={zoneShowChild} data-target_class='viewList2Depth' onClick={(e) => { this.showChild(e) }}>{zoneName}</span>
                    {
                        (this.props.hasIndoorModel) ? <span className={content.goLink} onClick={this.moveToX}><a className={content.goA}>이동</a></span> : <></>
                    }
                </div>
                {
                    this.props.sensorList &&
                    <ul ref={this.refZoneNameList} id={'zoneArea_' + this.props.zone.id} className={zoneShowChild === 'true' ? content.viewList3Depth + " " + content.on : content.viewList3Depth}>
                        {
                            allSensorCount > 0 &&
                            <li>
                                <div ref={this.refSensors} id={'sensorGroups_' + this.props.zone.id} className={content.viewList3DepthHead} data-show_child={sensorsShowChild} data-target_class='viewList3Depth' onClick={(e) => { this.showChild(e) }}>센서 ({allSensorCount})</div>
                                <ul ref={this.refSensorsList} id={'sensorGroupsArea_' + this.props.zone.id} className={sensorsShowChild === 'true' ? content.viewList4Depth + " " + content.on : content.viewList4Depth}>
                                    <li>
                                        <span ref={this.refFireSensors} className={content.viewList4DepthHead} data-show_child={fireSensorsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>화재센서 ({fireSensorCount})</span>
                                        <ul ref={this.refFireSensorsList} className={fireSensorsShowChild === 'true' ? content.viewList5Depth + " " + content.on : content.viewList5Depth}>
                                            {fireSensorUI}
                                        </ul>
                                    </li>
                                    {sensorUI}
                                </ul>
                            </li>
                        }
                        {
                            exitLightCount > 0 &&
                            <li>
                                <div ref={this.refExitLightGroups} id={'exitLightGroups_' + this.props.zone.id} className={content.viewList3DepthHead} data-show_child={exitLightGroupShowChild} data-target_class='viewList3Depth' onClick={(e) => { this.showChild(e) }}>유도등 ({exitLightCount})</div>
                                <ul ref={this.refExitLightGroupsList} id={'exitLightGroupsArea_' + this.props.zone.id} className={exitLightGroupShowChild === 'true' ? content.viewList4Depth + " " + content.on : content.viewList4Depth}>
                                    <li>
                                        <span ref={this.refExitLightSensors} className={content.viewList4DepthHead} data-show_child={exitLightSubGroupShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>유도등 ({exitLightCount})</span>
                                        <ul ref={this.refExitLightList} className={exitLightSubGroupShowChild === 'true' ? content.viewList5Depth + " " + content.on : content.viewList5Depth}>
                                            {exitLightUI}
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        }
                        {
                            cctvCount > 0 &&
                            <li>
                                <div ref={this.refCCTVGroups} id={'cctvGroups_' + this.props.zone.id} className={content.viewList3DepthHead} data-show_child={cctvGroupsShowChild} data-target_class='viewList3Depth' onClick={(e) => { this.showChild(e) }}>CCTV ({cctvCount})</div>
                                <ul ref={this.refCCTVGroupsList} id={'cctvGroupsArea_' + this.props.zone.id} className={cctvGroupsShowChild === 'true' ? content.viewList4Depth + " " + content.on : content.viewList4Depth}>
                                    <li>
                                        <span ref={this.refCCTVSubGroups} className={content.viewList4DepthHead} data-show_child={cctvSubGroupsShowChild} data-target_class='viewList4Depth' onClick={(e) => { this.showChild(e) }}>CCTV ({cctvCount})</span>

                                        <ul ref={this.refCCTVSubGroupsList} className={cctvSubGroupsShowChild === 'true' ? content.viewList5Depth + " " + content.on : content.viewList5Depth}>
                                            {cctvUI}
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        }
                        {
                            facilityCount > 0 &&
                            <li>
                                <div ref={this.refFacilityGroups} id={'facilityGroups_' + this.props.zone.id} className={content.viewList3DepthHead} data-show_child={facilityGroupsShowChild} data-target_class='viewList3Depth' onClick={(e) => { this.showChild(e) }}>설비 ({facilityCount})</div>
                                <ul ref={this.refFacilityGroupsList} id={'facilityGroupsArea_' + this.props.zone.id} className={facilityGroupsShowChild === 'true' ? content.viewList4Depth + " " + content.on : content.viewList4Depth}>
                                    {facilityInfosUI}
                                </ul>
                            </li>
                        }
                    </ul>
                }
            </li>
        );
    }
}

export default StatusInfoZone;