import React, { Component } from 'react';

import SdmsResource from '../../../SDMS/resource/id';

class BoardViewDetail extends Component {

    getSensorView() {
        let displayView = [];

        const {atmosphereCount, emergencyCount, gasCount, thermalCCTVCount, workerSensorCount, cctvSensorCount} = this.props;
        const {atmosphereSensorEnabledCount, emergencyBellSensorEnabledCount, gasSensorEnabledCount, thermalCameraSensorEnabledCount, workerSensorEnabledCount, cctvSensorEnabledCount} = this.props;
        const {atmosphereAlarmCount, emergencyAlarmCount, gasAlarmCount, thermalCCTVAlarmCount, workerSensorAlarmCount} = this.props;

        if(!atmosphereCount && !emergencyCount && !gasCount && !thermalCCTVCount && !workerSensorCount && !cctvSensorCount) {
            return(
                <li className='zoneInfoNone'>연동된 센서 없음.</li>
            )
        }
        else {
            if(atmosphereCount > 0) {
                displayView.push(
                    <li className='zoneInfo' key={'atmosphere_info'}>
                        <span>{SdmsResource.ID.sensor.atmosphere} : </span>
                        <span className='green'>{atmosphereSensorEnabledCount}</span>
                        <span> / {atmosphereCount} / </span>
                        <span className='red'>{atmosphereAlarmCount}</span>
                    </li>
                );
            };
    
            if(emergencyCount > 0) {
                displayView.push(
                    <li className='zoneInfo' key={'emergency_info'}>
                        <span>{SdmsResource.ID.sensor.emergencyBell} : </span>
                        <span className='green'>{emergencyBellSensorEnabledCount}</span>
                        <span> / {emergencyCount} / </span>
                        <span className='red'>{emergencyAlarmCount}</span>
                    </li>
                );
            };
    
            if(gasCount > 0) {
                displayView.push(
                    <li className='zoneInfo' key={'gas_info'}>
                        <span>{SdmsResource.ID.sensor.gas} : </span>
                        <span className='green'>{gasSensorEnabledCount}</span>
                        <span> / {gasCount} / </span>
                        <span className='red'>{gasAlarmCount}</span>
                    </li>
                );
            };
    
            if(thermalCCTVCount > 0) {
                displayView.push(
                    <li className='zoneInfo' key={'thermalCCTV_info'}>
                        <span>{SdmsResource.ID.sensor.thermalCamera} : </span>
                        <span className='green'>{thermalCameraSensorEnabledCount}</span>
                        <span> / {thermalCCTVCount} / </span>
                        <span className='red'>{thermalCCTVAlarmCount}</span>
                    </li>
                );
            };

            if(workerSensorCount > 0) {
                displayView.push(
                    <li className='zoneInfo' key={'workerSensor_info'}>
                        <span>{SdmsResource.ID.sensor.worker} : </span>
                        <span className='green'>{workerSensorEnabledCount}</span>
                        <span> / {workerSensorCount} / </span>
                        <span className='red'>{workerSensorAlarmCount}</span>
                    </li>
                );
            };

            if(cctvSensorCount > 0) {
                displayView.push(
                    <li className='zoneInfo' key={'cctvSensor_info'}>
                        <span>{SdmsResource.ID.sensor.cctv} : </span>
                        <span className='green'>{cctvSensorEnabledCount}</span>
                        <span> / {cctvSensorCount}</span>
                    </li>
                );
            };
    
            return displayView;
        }
    }

    render() {
        const displayView = this.getSensorView();

        let className = 'zoneInfoWrap';

        if(this.props.active === parseInt(this.props.activeNum) && !this.props.isAlarm) {
            className = 'zoneInfoWrap active';
        }
        else if(this.props.isAlarm) {
            className = 'zoneInfoWrap on';
        }

        return (
            <div className={className} onClick={() => this.props.onAreaActive(parseInt(this.props.activeNum))}>
                <div>
                    <span>{this.props.activeNum}</span>
                    <h5>{this.props.building.displayText}</h5>
                </div>
                <ul>
                    {displayView}
                </ul>
            </div>
        );
    }
}

export default BoardViewDetail;