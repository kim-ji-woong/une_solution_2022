import React, { Component } from 'react';

import { EventDashboardComponent } from '../../styled/sdmsPopupsStyled';

import atmosphere from '../../images/eventDashboard_atmosphere_blank.svg'; // 대기오염 아이콘
import weather from '../../images/eventDashboard_atmosphere.svg'; // 날씨 아이콘
import reductionEquipment from '../../images/eventDashboard_reductionEquipment.svg'; // 저감설비 아이콘
import emissionFacilities from '../../images/eventDashboard_emissionFacilities.svg'; // 배출설비 아이콘
import SdmsResource from "../../resource/id";

class EventDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            close: ""
        }
        
        this.timeoutContainer = null;
    }
    
    componentDidMount() {
        this.startTimeout();
    }
    
    componentWillUnmount() {
        clearTimeout(this.timeoutContainer);
        this.props.sendCameraLocation();
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selectedAlarm?.sensorZoneHistoryID !== prevProps.selectedAlarm?.sensorZoneHistoryID) {
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
        let sensorTypeClass = '';
        
        if (!this.props.selectedSensor || !this.props.selectedAlarm) {
            return [sensorType, sensorTypeClass];
        }
        
        const selectedSensorType = this.props.selectedSensorType;
        const strAtmosphere = 'atmosphere';
        const strWeather = 'weather';
        const strReductionEquipment = 'reductionEquipment';
        const strEmissionFacilities = 'emissionFacilities';
        
        const img = 'Image';
        
        switch(selectedSensorType.id) {
            case SdmsResource.SensorType.atmosphere || SdmsResource.SensorType.kWeather:
                sensorTypeClass = strAtmosphere + img;
                sensorType = atmosphere;
                break;
            case SdmsResource.SensorType.weather:
                sensorTypeClass = strWeather + img;
                sensorType = weather;
                break;
            case SdmsResource.SensorType.reduction:
                sensorTypeClass = strReductionEquipment + img;
                sensorType = reductionEquipment;
                break;
            case SdmsResource.SensorType.discharge:
                sensorTypeClass = strEmissionFacilities + img;
                sensorType = emissionFacilities;
                break;
            default:
                sensorTypeClass = strAtmosphere + img;
                sensorType = atmosphere;
                break;
        }
        
        return[sensorType, sensorTypeClass];
    }

    getContentsUI = () => {
        const alarm = this.props.selectedAlarm;
        
        if (!alarm) {
            return (
                <></>
            );
        }
        
        const selectedSensorType = this.props.selectedSensorType;
        
        let building = alarm.buildingName;
        let sensorName = alarm.zoneName;
        let alarmType = '';
        if (selectedSensorType) {
            alarmType = selectedSensorType.name;
            if (selectedSensorType.id === SdmsResource.SensorType.atmosphere || selectedSensorType.id === SdmsResource.SensorType.kWeather) {
                alarmType = '대기오염';
            }
        }
        
        let contents = (
            <div className='contentWrap'>
                <p className='time'>{alarm.strDateTime}</p>
                <div className='text'>
                    <p>{sensorName}</p>
                    <p>에서</p> 
                    <p>{alarmType}</p>
                    <p>이벤트가 탐지되었습니다.</p>
                </div>
                <p className='autoClose'>5초 뒤 자동으로 화면이 이동합니다.</p>
            </div>
        )
        
        return contents;
    }

    render() {

        const [sensorImage, sensorClassName] = this.getNodeImage();

        const contents = this.getContentsUI();

        return (
            <EventDashboardComponent className={this.state.close}>
                <div>
                    <div>
                        <div className={'iconWrap'}>
                            <img src={sensorImage} alt='이벤트 아이콘' className={'atmosphereImage'}/>
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