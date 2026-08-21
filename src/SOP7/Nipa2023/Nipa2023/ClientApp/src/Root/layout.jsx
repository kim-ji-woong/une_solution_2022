import React, { Component } from 'react';
import { Container } from 'reactstrap';

import TitleBar from './titleBar';
import EquipmentEventAlarm from '../SDMS/ui/popups/equipmentEventAlarm';
import { UserDispatch } from './resource/userDispatch';
import EventAlarmPage from '../SDMS/ui/popups/eventAlarmPage';
import ProjectResource from './resource/id';
import { SdmsController } from '../SDMS/services/sdmsController';
import SdmsResource from '../SDMS/resource/id';
import wsManager from './services/wsManager';

class Layout extends Component {
    static contextType = UserDispatch;
    static className = "Layout";

    constructor(props) {
        super(props);

        this.state = {
            showAlarmPopup: false,
            alarmData: {},
            loading: true,
        }

        this.prevSensorZoneHistoryID = -1;
        this.prevEquipmentSensorZoneHistoryID = -1;
        this.prevAliveAlarmSensorZoneHistoryIDs = {};
    }

    componentDidMount() {
        this.readAlarms();
    }

    async readAlarms() {
        const [alarms, message] = await SdmsController.requestTodayAlarmData();

        if (alarms?.success) {
            for (const alarmData of alarms.allAlarmDatas) {
                if (this.prevSensorZoneHistoryID < alarmData.sensorZoneHistoryID) {
                    this.prevSensorZoneHistoryID = alarmData.sensorZoneHistoryID;
                }
            }

            for (const alarmData of alarms.equipmentAlarmDatas) {
                if (this.prevEquipmentSensorZoneHistoryID < alarmData.sensorZoneHistoryID) {
                    this.prevEquipmentSensorZoneHistoryID = alarmData.sensorZoneHistoryID;
                }
            }
        }

        this.setState({ loading: false });
    }

    componentDidUpdate(prevProps, prevState) {
        const path = window.location.pathname;

        const option3DSensor = this.props.option3DSensor;
        
        if(option3DSensor) {
            const receiveAtmosphereAlarm = option3DSensor.receiveAtmosphereAlarm;
            const receiveEmergencyBellAlarm = option3DSensor.receiveEmergencyBellAlarm;
            const receiveFireAlarm = option3DSensor.receiveFireAlarm;
            const receiveGasAlarm = option3DSensor.receiveGasAlarm;
            const receiveThermalCameraAlarm = option3DSensor.receiveThermalCameraAlarm;
            const receiveWorkerAlarm = option3DSensor.receiveWorkerAlarm;
            const receiveFacilityError = option3DSensor.receiveFacilityError;

            const { alarm } = this.context;
            const alarms = alarm[0].alarmState;
            
            if(alarms && this.state.loading === false) {
                
                const datas = alarms['allAlarmDatas'];
    
                if (datas.length > 0 && datas[0].sensorZoneHistoryID > this.prevSensorZoneHistoryID){
                    
                    // 유형별 알람 설정에서 체크된 센서만 알림 페이지 표출
                    const alarmType = datas[0].facilityType;
                    let showAlarm = false;
    
                    if(alarmType === SdmsResource.facilityType.ATMOSPHERE) {
                        showAlarm = receiveAtmosphereAlarm;
                    } else if(alarmType === SdmsResource.facilityType.EMERGENCYBELL) {
                        showAlarm = receiveEmergencyBellAlarm;
                    } else if(alarmType === SdmsResource.facilityType.FIRE) {
                        showAlarm = receiveFireAlarm;
                    } else if(alarmType === SdmsResource.facilityType.GAS) {
                        showAlarm = receiveGasAlarm;
                    } else if(alarmType === SdmsResource.facilityType.THERMAL_CAMERA) {
                        showAlarm = receiveThermalCameraAlarm;
                    } else if(alarmType === SdmsResource.facilityType.WORKER) {
                        showAlarm = receiveWorkerAlarm;
                    }
    
                    if(showAlarm && path !== ProjectResource.path.sdms) {
                        this.props.isNewAlarm(true);
                        this.setState({ alarmData: datas[0], showAlarmPopup: true });
                        this.prevSensorZoneHistoryID = datas[0].sensorZoneHistoryID;
                    }
                }
                    
                // 알람이 현장 종료된 경우 팝업or페이지 종료
                if (datas.length > 0 && datas[0].sensorZoneHistoryID === prevState.alarmData.sensorZoneHistoryID && !datas[0].isAlarm){
                    this.props.isNewAlarm(false);
                    this.setState({ showAlarmPopup: false, alarmData: {} });
                }
    
                // 설비모드 알람 처리
                const equipmentDatas = alarms['equipmentAlarmDatas'];

                if (equipmentDatas.length > 0 && equipmentDatas[0].sensorZoneHistoryID > this.prevEquipmentSensorZoneHistoryID){
                    
                    // 유형별 알람 설정에서 체크된 센서만 알림 페이지 표출
                    const alarmType = equipmentDatas[0].facilityType;
                    let showAlarm = false;
    
                    if(alarmType === SdmsResource.facilityType.EQUIPMENT) {
                        showAlarm = receiveFacilityError;
                    }
    
                    if(showAlarm && path !== ProjectResource.path.sdms) {
                        this.props.isNewAlarm(true);
                        this.setState({ alarmData: equipmentDatas[0], showAlarmPopup: true });
                        this.prevEquipmentSensorZoneHistoryID = equipmentDatas[0].sensorZoneHistoryID;
                    }
                }
                    
                // 알람이 현장 종료된 경우 팝업or페이지 종료
                if (equipmentDatas.length > 0 && equipmentDatas[0].sensorZoneHistoryID === prevState.alarmData.sensorZoneHistoryID && !equipmentDatas[0].isAlarm){
                    this.props.isNewAlarm(false);
                    this.setState({ showAlarmPopup: false, alarmData: {} });
                }
    
                // 종료된 알람처리
                this.checkAliveAlarms(alarms);
            }
        }

    }

    // 종료된 알람처리
    checkAliveAlarms(alarms) {
        for (const alarm of alarms.allAlarmDatas) {
            if (alarm.isAlarm) {
                this.prevAliveAlarmSensorZoneHistoryIDs[alarm.sensorZoneHistoryID] = alarm;
            }
        }

        const alarmSensorZoneHistoryIDs = { ...this.prevAliveAlarmSensorZoneHistoryIDs };

        for (const alarm of alarms.allAlarmDatas) {
            if (alarm.isAlarm) {
                delete alarmSensorZoneHistoryIDs[alarm.sensorZoneHistoryID];
            }
        }

        // 알람이 종료되었음을 web socket을 통해 알린다.
        for (const sensorZoneHistoryID in alarmSensorZoneHistoryIDs) {
            if (this.props.wsManager) {
                this.props.wsManager.closeAlarm(alarmSensorZoneHistoryIDs[sensorZoneHistoryID]);
            }

            delete this.prevAliveAlarmSensorZoneHistoryIDs[sensorZoneHistoryID];
        }
    }

    handleAlarmPopup = (type) => {
        const campusID = ProjectResource.campusID;
        const alarmData = this.state.alarmData;

        // 이벤트 유형이 작업자(장비협착)일 경우 모델링 이벤트가 멈춰야 함
        if (alarmData?.materialType === SdmsResource.facilityType.EQUIPMENT_TIGHTENING) {
            this.props.wsManager.sendFacilityAlarm(alarmData.facilityNo, wsManager.facilityAlarmType.stuckWorker, alarmData.isAlarm);
        }

        if (campusID === ProjectResource.campus.campus_2) {
            this.setState({ showAlarmPopup: type });
            return;
        }
        else {
            if (this.props.wsManager) {
                if (alarmData.facilityType === SdmsResource.facilityType.EQUIPMENT) {
                    if (alarmData.equipmentData?.equipment) {
                        this.props.wsManager.sendFacilityAlarm(alarmData.equipmentData.equipment.id, wsManager.facilityAlarmType.productFail, alarmData.isAlarm);
                    }
                } else {
                    this.props.wsManager.showAlarm(alarmData);
                }
            }
    
            if (alarmData.facilityType === SdmsResource.facilityType.EQUIPMENT) {
                this.props.onClickChangeMode(SdmsResource.mode.equipmentDetail);
            }
    
            this.props.setNewAlarm(alarmData);
            this.props.isNewAlarm(false);
            this.setState({ showAlarmPopup: type, alarmData: {} });
        }
    }

    render() {
        if (this.state.loading) {
            return <></>
        }

        const path = window.location.pathname;
        const campusID = ProjectResource.campusID;

        return (
            <main id="main">
                <TitleBar 
                    path={path}
                    onClickChangeMode={this.props.onClickChangeMode}
                    wsManager={this.props.wsManager}
                    option3DNormal={this.props.option3DNormal}
                    option3DSensor={this.props.option3DSensor}
                    optionSopNormal={this.props.optionSopNormal}
                    getSettingsOption={this.props.getSettingsOption}
                    checkPopupStateReset={this.props.checkPopupStateReset}
                    checkMoveToOutdoor={this.props.checkMoveToOutdoor}
                />
                <Container id="layoutContainer">
                    {this.props.children}
                    {
                        // 이벤트 발생시 표출될 팝업 (관제화면에는 표출X)
                        ((campusID === ProjectResource.campus.campus_2 && this.state.showAlarmPopup && path === ProjectResource.path.monitoring) || (this.state.showAlarmPopup && path !== ProjectResource.path.monitoring)) &&
                        <EquipmentEventAlarm
                            handleAlarmPopup={this.handleAlarmPopup}
                            alarmData={this.state.alarmData}
                        />
                    }

                    {
                        // 이벤트 발생시 관제화면에 표출될 페이지
                        (campusID === ProjectResource.campus.campus_1 && this.state.showAlarmPopup && path === ProjectResource.path.monitoring) &&
                        <EventAlarmPage
                            handleAlarmPopup={this.handleAlarmPopup}
                            alarmData={this.state.alarmData}
                        />
                    }
                </Container>
            </main>
        );
    }
}

export default Layout;