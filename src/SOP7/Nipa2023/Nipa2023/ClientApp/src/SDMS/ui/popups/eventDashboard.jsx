import React, { Component } from 'react';

import { EventDashboardComponent } from '../../styled/sdmsPopupsStyled';

import { UserDispatch } from '../../../Root/resource/userDispatch';
import Marquee from "react-fast-marquee";
import SDMSResource from '../../resource/id';
import SdmsResource from '../../resource/id';

class EventDashboard extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);
        this.state = {
        }

        this.props = props;

    }

    getAlarmList() {
        let messages = [];

        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;
        let alarmCount = 1;

        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;
        
        const receiveAtmosphereAlarm = option3DSensor.receiveAtmosphereAlarm;
        const receiveEmergencyBellAlarm = option3DSensor.receiveEmergencyBellAlarm;
        const receiveFireAlarm = option3DSensor.receiveFireAlarm;
        const receiveGasAlarm = option3DSensor.receiveGasAlarm;
        const receiveThermalCameraAlarm = option3DSensor.receiveThermalCameraAlarm;
        const receiveWorkerAlarm = option3DSensor.receiveWorkerAlarm;

        if (alarms) {
            const data = alarms['allAlarmDatas'];

            if (data.length !== 0) {
                for (let i = 0; i < data.length; i++){
                    
                    // 유형별 알람 설정 옵션 정보에 따른 표출 여부
                    let showAlarm = false;

                    if (data[i].facilityType === SDMSResource.facilityType.FIRE) {
                        showAlarm = receiveFireAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.ATMOSPHERE) {
                        showAlarm = receiveAtmosphereAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.EMERGENCYBELL) {
                        showAlarm = receiveEmergencyBellAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.GAS) {
                        showAlarm = receiveGasAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.THERMAL_CAMERA) {
                        showAlarm = receiveThermalCameraAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.WORKER) {
                        showAlarm = receiveWorkerAlarm;
                    }

                    // 종료되지 않은 알람만 대시보드에 표출
                    if(showAlarm && data[i].isAlarm) {
                        const dt = new Date(data[i].eventTime);
                        const [ymd, hms] = SDMSResource.getDate(dt);
                            
                        messages.push(
                            <span key={'eventDashboard_' + alarmCount}>
                                &lt;{alarmCount}&gt;&nbsp;{ymd + ' ' + hms} &nbsp;&nbsp;{data[i].message}
                            </span>
                        );
    
                        alarmCount += 1;
                    }
                }
            }
        }

        if(this.props.mode === SDMSResource.mode.monitoring && alarmCount === 1) {
            this.props.handlePopup(SDMSResource.ID.menu.eventDashboard, false);
        }

        return messages;
    }

    getFacilityAlarmList() {
        let facilityMessages = [];

        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;
        let alarmCount = 1;

        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;
        
        const receiveFacilityError = option3DSensor.receiveFacilityError;

        if (alarms) {
            const data = alarms['equipmentAlarmDatas'];

            if (data?.length !== 0) {
                for (let i = 0; i < data.length; i++){
                    
                    // 유형별 알람 설정 옵션 정보에 따른 표출 여부
                    let showAlarm = false;

                    if (data[i].facilityType === SDMSResource.facilityType.EQUIPMENT) {
                        showAlarm = receiveFacilityError;
                    }

                    // 종료되지 않은 알람만 대시보드에 표출
                    if(showAlarm && data[i].isAlarm) {
                        const dt = new Date(data[i].eventTime);
                        const [ymd, hms] = SDMSResource.getDate(dt);
                            
                        facilityMessages.push(
                            <span key={'eventDashboard_' + alarmCount}>
                                &lt;{alarmCount}&gt;&nbsp;{ymd + ' ' + hms} &nbsp;&nbsp;{data[i].message}
                            </span>
                        );
    
                        alarmCount += 1;
                    }
                }
            }
        }

        if(this.props.mode === SDMSResource.mode.equipment && alarmCount === 1) {
            this.props.handlePopup(SDMSResource.ID.menu.eventDashboard, false);
        }

        return facilityMessages;
    }

    render() {
        const messages = this.getAlarmList();
        const facilityMessages = this.getFacilityAlarmList();

        const mode = this.props.mode;

        return (
            <EventDashboardComponent id={this.props.popupType} className='UI_Section eventDashboard'>
                <div className='viewTitleTxt'>
                    <h2>알람 발생</h2>
                        <Marquee
                            style={{ width: 'calc(100% - 57px)' }}
                            pauseOnHover={true}
                        >
                            {
                                mode === SdmsResource.mode.monitoring ?
                                messages : facilityMessages
                            }
                        </Marquee>
                </div>
            </EventDashboardComponent>
        );
    }
}

export default EventDashboard;