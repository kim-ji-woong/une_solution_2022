import React, { Component } from 'react';

import { EventDashboardComponent } from '../../styled/sdmsPopupsStyled';

import atmosphere from '../../images/eventDashboard_atmosphere_blank.svg'; // 대기오염 아이콘
import weather from '../../images/eventDashboard_atmosphere.svg'; // 날씨 아이콘
import reductionEquipment from '../../images/eventDashboard_reductionEquipment.svg'; // 저감설비 아이콘
import emissionFacilities from '../../images/eventDashboard_electricCT.svg'; // 전류CT 아이콘
import SdmsResource from "../../resource/id";
import {SDMSController} from "../../services/sdmsController";

class EventDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            close: "",
            currentSensorType: null,
            seconds: 5, // 초기 값
        }
        
        this.timeoutContainer = null;
    }
    
    componentDidMount() {
        this.startTimeout();
    }
    
    componentWillUnmount() {
        clearTimeout(this.timeoutContainer);
        this.props.sendShowAlarm(this.props.selectedAlarm); // 3D상 화면에서 알람 표출을 위한 소켓신호 메서드
        this.props.showAlarm(this.props.dashboardAlarm, null);
        this.props.moveDisplayFromAlarm(this.props.dashboardAlarm, this.getSensorTypeFromZoneID(this.props.dashboardAlarm?.zoneID)); // 웹에서 알람 표출을 위한 메서드 
        this.props.setSimulationMode(false); // 시뮬레이션 모드일 경우 종료
        this.props.sendPOIList();// 알람 연동된 POI 리스트 누락되는 경우가 있어 추가
    }
    
    getSensorTypeFromZoneID = (zoneID) => {
        if (!this.props.externalSensors || !this.props.externalSensorTypes)
            return null;

        let externalSensorTypes = this.props.externalSensorTypes;
        let externalSensors = this.props.externalSensors;

        let sensorType = null;
        
        const sensor = externalSensors.find(sensor => sensor.zoneID === zoneID);
        const type = sensor.sensorType;

        sensorType = externalSensorTypes.find(sensorType => sensorType.id === type);

        return sensorType;
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dashboardAlarm?.sensorZoneHistoryID !== prevProps.dashboardAlarm?.sensorZoneHistoryID) {
            if (this.timeoutContainer) { // 기존 타이머 종료
                clearTimeout(this.timeoutContainer);
                this.startTimeout();
            }
        }
    }
    
    startTimeout = () => {
        this.timeoutContainer = setTimeout(() => {
            this.props.setVisibleDashboard(false);
        }, 5000);
    }

    handlePopups = () => {
        this.setState({ close: "closePopup" });

        setTimeout(() => {
            this.props.handlePopups('eventDashboard', false);
        }, 200);
    }
    
    getNodeImage = () => {
        let sensorType = '';
        
        if (!this.props.selectedAlarm || !this.props.externalSensors) {
            return sensorType;
        }
        
        const zoneID = this.props.selectedAlarm.zoneID;
        const targetSensor = this.props.externalSensors.find(sensor => sensor.zoneID === zoneID);
        
        const strAtmosphere = 'atmosphere';
        if (!targetSensor) {
            return strAtmosphere;
        }
        
        switch(targetSensor.sensorType) {
            case SdmsResource.SensorType.atmosphere || SdmsResource.SensorType.kWeather:
                sensorType = 'atmosphere';
                break;
            case SdmsResource.SensorType.electricity:
                sensorType = 'emissionFacilities';
                break;
            default:
                sensorType = 'atmosphere';
                break;
        }
        
        return sensorType;
    }

    getContentsUI = () => {
        const alarm = this.props.selectedAlarm;

        if (!alarm || Object.keys(alarm).length === 0 || !this.props.externalSensors) {
            return <></>;
        }

        const targetSensor = this.props.externalSensors.find(sensor => sensor.zoneID === alarm.zoneID);
        
        if (!targetSensor) {
            console.log('eventDashboard.jsx: targetSensor is null line 119');
            return <></>;
        }
        
        const sensorType = targetSensor.sensorType === SdmsResource.SensorType.electricity
            ? '전류센서'
            : '대기유해물질';

        return (
            <div className='contentWrap'>
                <p className='time'>{alarm.strDateTime}</p>
                <div className='text'>
                    <p>{alarm.zoneName}</p>
                    <p>에서</p>
                    <p>{sensorType}</p>
                    <p>이벤트가 탐지되었습니다.</p>
                </div>
                <p className='autoClose'>5초 뒤 자동으로 화면이 이동합니다.</p>
            </div>
        );
    }

    render() {

        let image = '';
        const sensorImage = this.getNodeImage();
        let imageClassName = 'atmosphereImage';
        if (sensorImage === 'atmosphere') {
            image = atmosphere;
        }
        else if (sensorImage === 'emissionFacilities') {
            image = emissionFacilities;
            imageClassName = "electricityIcon";
        }
        
        const contents = this.getContentsUI();

        return (
            <EventDashboardComponent className={this.state.close} onClick={() => this.handlePopups()}>
                <div>
                    <div>
                        <div className={'iconWrap'}>
                            <img src={image} alt='이벤트 아이콘' className={imageClassName}/>
                            <span className={'lightAni'}></span>
                        </div>
                        {contents}
                    </div>
                    <button className='dslX' onClick={this.handlePopups}>닫기</button>
                </div>
            </EventDashboardComponent>
        );
    }
}

export default EventDashboard;