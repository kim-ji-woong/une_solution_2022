import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
import Monitoring from '../monitoring';

import PopupDraggable from './popupDraggable';

import { DashboardComponent } from '../../styled/sdmsPopupsStyled';

import detailDashboard from '../../images/detailDashboard.png';

import { UserDispatch } from '../../../Root/resource/userDispatch'; 
import SDMSResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

class Dashboard extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);

        this.state = {

        }

        this.props = props;
    }

    componentDidMount() {
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

        this.initPopupState();

        $('.scrollbar').scrollTop(0);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.repositionPopup();
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('UI_Section dashboard')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        } else {
            // DB에 값이 따로 없을 경우
            let data = SDMSResource.popupResetLocation[this.props.popupType];

            popup.style.left = data.x;
            popup.style.top = data.y;
            popup.style.width = data.width;
            popup.style.height = data.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup() {

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        let data = SDMSResource.popupResetLocation[this.props.popupType];

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    getAlarmCount() {
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        let smellAlarmCount = 0;
        let gasAlarmCount = 0;
        let emergencyBellAlarmCount = 0;
        let thermalCameraAlarmCount = 0;
        let workerTagAlarmCount = 0;
        let fireAlarmCount = 0;

        if (alarms) {
            for (const alarm in alarms) {

                if (alarm === 'smellAlarmDatas') {
                    smellAlarmCount = alarms[alarm].length;
                }
                else if (alarm === 'gasAlarmDatas') {
                    gasAlarmCount = alarms[alarm].length;
                }
                else if (alarm === 'emergencyBellAlarmDatas') {
                    emergencyBellAlarmCount = alarms[alarm].length;
                }
                else if (alarm === 'thermalCameraAlarmDatas') {
                    thermalCameraAlarmCount = alarms[alarm].length;
                }
                else if (alarm === 'workerTagAlarmDatas') {
                    workerTagAlarmCount = alarms[alarm].length;
                }
                else if (alarm === 'fireAlarmDatas') {
                    fireAlarmCount = alarms[alarm].length;
                }
            }
        }

        return [smellAlarmCount, gasAlarmCount, emergencyBellAlarmCount, thermalCameraAlarmCount, workerTagAlarmCount, fireAlarmCount];
    }

    getFacilityAlarmCount() {
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        let alarmCount14 = 0;
        let alarmCount22 = 0;
        let alarmCount23 = 0;

        if (alarms) {
            const data = alarms['equipmentAlarmDatas'];

            for (const alarm of data) {
                if (alarm?.equipmentData?.equipment?.id === 14) {
                    alarmCount14++;
                } else if (alarm?.equipmentData?.equipment?.id === 22) {
                    alarmCount22++;
                } else if (alarm?.equipmentData?.equipment?.id === 23) {
                    alarmCount23++;
                }
            }
        }

        return [alarmCount14, alarmCount22, alarmCount23];
    }

    getSensorCount() {
        const sensorList = this.props.sensorList;

        // 전체 센서 수
        let atmosphereSensorCount = 0;
        let gasSensorCount = 0;
        let emergencyBellSensorCount = 0;
        let thermalCameraSensorCount = 0;
        let workerSensorCount = 0;
        let fireSensorCount = 0;
        let cctvSensorCount = 0;

        // 활성화된 센서 수
        let atmosphereSensorEnabledCount = 0;
        let gasSensorEnabledCount = 0;
        let emergencyBellSensorEnabledCount = 0;
        let thermalCameraSensorEnabledCount = 0;
        let workerSensorEnabledCount = 0;
        let fireSensorEnabledCount = 0;
        let cctvSensorEnabledCount = 0;

        if (sensorList) {
            for (const sensor in sensorList) {

                if (sensor === 'atmosphereSensors') {
                    atmosphereSensorCount = sensorList[sensor].length;

                    atmosphereSensorEnabledCount = this.getSensorEnabledCount(atmosphereSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'gasSensors') {
                    gasSensorCount = sensorList[sensor].length;

                    gasSensorEnabledCount = this.getSensorEnabledCount(gasSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'emergencyBells') {
                    emergencyBellSensorCount = sensorList[sensor].length;

                    emergencyBellSensorEnabledCount = this.getSensorEnabledCount(emergencyBellSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'thermalCCTVs') {
                    thermalCameraSensorCount = sensorList[sensor].length;

                    thermalCameraSensorEnabledCount = this.getSensorEnabledCount(thermalCameraSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'aps') {
                    workerSensorCount = sensorList[sensor].length;

                    workerSensorEnabledCount = this.getSensorEnabledCount(workerSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'fireSensors') {
                    fireSensorCount = sensorList[sensor].length;

                    fireSensorEnabledCount = this.getSensorEnabledCount(fireSensorCount, sensorList[sensor]);
                }
                else if (sensor === 'cctvs') {
                    cctvSensorCount = sensorList[sensor].length;

                    cctvSensorEnabledCount = this.getSensorEnabledCount(cctvSensorCount, sensorList[sensor]);
                }
            }
        }

        return [atmosphereSensorCount, gasSensorCount, emergencyBellSensorCount,thermalCameraSensorCount, workerSensorCount, fireSensorCount, cctvSensorCount, atmosphereSensorEnabledCount, gasSensorEnabledCount, emergencyBellSensorEnabledCount, thermalCameraSensorEnabledCount, workerSensorEnabledCount, fireSensorEnabledCount, cctvSensorEnabledCount];
    }

    // 활성화된 센서 수 구하기
    getSensorEnabledCount = (allSensorsCount, sensors) => {
        let count = 0;

        if (sensors) {
            for (let i = 0; i < allSensorsCount; i++) {
                
                if (sensors[i].enabled){
                    count++;
                }
            }
        }
        
        return count;
    }

    goDashboard = (mode) => {
        if(mode === SDMSResource.mode.monitoring) {
            this.props.history.push(ProjectResource.path.dashboardMonitoring);
        } 
        else if(mode === SDMSResource.mode.equipment) {
            this.props.history.push(ProjectResource.path.dashboardMes);
        } 
    }

    render() {
        const mode = this.props.mode;

        const [smellAlarmCount, gasAlarmCount, emergencyBellAlarmCount, thermalCameraAlarmCount, workerTagAlarmCount, fireAlarmCount] = this.getAlarmCount();

        const [atmosphereSensorCount, gasSensorCount, emergencyBellSensorCount,thermalCameraSensorCount, workerSensorCount, fireSensorCount, cctvSensorCount, atmosphereSensorEnabledCount, gasSensorEnabledCount, emergencyBellSensorEnabledCount, thermalCameraSensorEnabledCount, workerSensorEnabledCount, fireSensorEnabledCount, cctvSensorEnabledCount] = this.getSensorCount();

        const mesEquipmentData = this.props.mesEquipmentData;

        const [alarmCount14, alarmCount22, alarmCount23] = this.getFacilityAlarmCount();

        return (
            <DashboardComponent id={this.props.popupType} className='UI_Section dashboard'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={1190}
                    popupMinHeight={82}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.dashboard, false)}>
                        <a href="#none">닫기버튼</a>
                    </div>
                    <div className={'viewDashboardSectionConts'}>
                        {
                            mode === SDMSResource.mode.monitoring &&
                            <>
                            <div className={'sectionblank'}>
                                <div className={'flexBox'}>
                                    <span>{SDMSResource.ID.sensor.gas}</span> ( <span className='greenTxt'>● </span>{gasSensorEnabledCount} / <span>● </span>{gasSensorCount} ) 
                                </div>
                                <div className={'flexBox'}>
                                    <span>{SDMSResource.ID.sensor.atmosphere}</span> ( <span className='greenTxt'>● </span>{atmosphereSensorEnabledCount} / <span>● </span>{atmosphereSensorCount} ) 
                                </div>
                                <div className={'flexBox'}>
                                    <span>{SDMSResource.ID.sensor.emergencyBell}</span> ( <span className='greenTxt'>● </span>{emergencyBellSensorEnabledCount} / <span>● </span>{emergencyBellSensorCount} ) 
                                </div>
                                <div className={'flexBox'}>
                                    <span>{SDMSResource.ID.sensor.thermalCamera}</span> ( <span className='greenTxt'>● </span>{thermalCameraSensorEnabledCount} / <span>● </span>{thermalCameraSensorCount} ) 
                                </div>
                                <div className={'flexBox'}>
                                    <span>{SDMSResource.ID.sensor.worker}</span> ( <span className='greenTxt'>● </span>{workerSensorEnabledCount} / <span>● </span>{workerSensorCount} ) 
                                </div>
                                <div className={'flexBox'}>
                                    <span>{SDMSResource.ID.sensor.fire}</span> ( <span className='greenTxt'>● </span>{fireSensorEnabledCount} / <span>● </span>{fireSensorCount} ) 
                                </div>
                                <div className={'flexBox'}>
                                    <span>{SDMSResource.ID.sensor.cctv}</span> ( <span className='greenTxt'>● </span>{cctvSensorEnabledCount} / <span>● </span>{cctvSensorCount} ) 
                                </div>
                            </div>

                            <div className={'viewDashboardTemperature'}>
                                <ul>
                                    <li>{SDMSResource.ID.sensor.gas} ({gasAlarmCount})건</li>
                                    <li>{SDMSResource.ID.sensor.atmosphere} ({smellAlarmCount})건</li>
                                    <li>{SDMSResource.ID.sensor.emergencyBell} ({emergencyBellAlarmCount})건</li>
                                    <li>{SDMSResource.ID.sensor.thermalCamera} ({thermalCameraAlarmCount})건</li>
                                    <li>{SDMSResource.ID.sensor.worker} ({workerTagAlarmCount})건</li>
                                    <li>{SDMSResource.ID.sensor.fire} ({fireAlarmCount})건</li>
                                </ul>
                                <div className={'detailBtn'}>
                                    <img src={detailDashboard} alt="상세보기" onClick={() => this.goDashboard(mode)} />
                                </div>
                            </div>
                            </>
                        }

                        {
                            mode === SDMSResource.mode.equipment &&
                            <>
                            <div className={'sectionblank'}>
                                {
                                    mesEquipmentData.map((data) => (
                                        <div className={'flexBox'} key={data.equipment.id}>
                                            <span>{data.equipment.name}</span><span className={data.equipment.usable ? 'greenTxt' : 'grayTxt'}> ●</span> 
                                        </div>
                                    ))
                                }
                            </div>

                            <div className={'viewDashboardTemperature'}>
                                <ul>
                                    <li>사출기 14호기 불량 ({alarmCount14})건</li>
                                    <li>사출기 22호기 불량 ({alarmCount22})건</li>
                                    <li>사출기 23호기 불량 ({alarmCount23})건</li>
                                </ul>
                                <div className={'detailBtn'}>
                                    <img src={detailDashboard} alt="상세보기" onClick={() => this.goDashboard(mode)} />
                                </div>
                            </div>
                            </>
                        }
                    </div>
                </PopupDraggable>
            </DashboardComponent>  
        );
    }
}

export default withRouter(Dashboard);

