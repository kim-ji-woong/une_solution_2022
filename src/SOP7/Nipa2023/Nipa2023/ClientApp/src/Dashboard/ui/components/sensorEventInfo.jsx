import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SensorEventInfoComponent } from '../../styled/dashboardStyled';

import { UserDispatch } from '../../../Root/resource/userDispatch';
import SdmsResource from '../../../SDMS/resource/id';

class SensorEventInfo extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);
		
		this.state = {
            onSensor: SdmsResource.ID.sensor.gas
        }

		this.props = props;
	}

    getAlarmCount() {
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        let smellAlarm = [];
        let gasAlarm = [];
        let emergencyBellAlarm = [];
        let thermalCameraAlarm = [];
        let workerAlarm = [];
        let fireAlarm = [];

        let smellAlarmCount = 0;
        let gasAlarmCount = 0;
        let emergencyBellAlarmCount = 0;
        let thermalCameraAlarmCount = 0;
        let workerAlarmCount = 0;
        let fireAlarmCount = 0;

        if (alarms) {
            for (const alarm in alarms) {

                if (alarm === 'smellAlarmDatas') {
                    smellAlarmCount = alarms[alarm].length;
                    smellAlarm = alarms[alarm];
                }
                else if (alarm === 'gasAlarmDatas') {
                    gasAlarmCount = alarms[alarm].length;
                    gasAlarm = alarms[alarm];
                }
                else if (alarm === 'emergencyBellAlarmDatas') {
                    emergencyBellAlarmCount = alarms[alarm].length;
                    emergencyBellAlarm = alarms[alarm];
                }
                else if (alarm === 'thermalCameraAlarmDatas') {
                    thermalCameraAlarmCount = alarms[alarm].length;
                    thermalCameraAlarm = alarms[alarm];
                }
                else if (alarm === 'workerTagAlarmDatas') {
                    workerAlarmCount = alarms[alarm].length;
                    workerAlarm = alarms[alarm];
                }
                else if (alarm === 'fireAlarmDatas') {
                    fireAlarmCount = alarms[alarm].length;
                    fireAlarm = alarms[alarm];
                }
            }
        }

        return [smellAlarmCount, gasAlarmCount, emergencyBellAlarmCount,thermalCameraAlarmCount, workerAlarmCount, fireAlarmCount, smellAlarm, gasAlarm, emergencyBellAlarm, thermalCameraAlarm, workerAlarm, fireAlarm];
    }

    onSelectedAlarm = (alarm, sensorName) => {
        this.props.onSelectedAlarm(alarm, sensorName);
        this.setState({ onSensor: sensorName });
    }

    getChart = (count) => {
        let chart = [];

        if(count === 0) {
            return (
                <span className='chartWrap'>
                </span>
            );
        } 
        else {
            for(let i = 0; i < count; i++){
                chart.push(<span key={'chart_' + i}></span>);

                if (i === 12) {
                    break;
                }
            };

            return (
                <span className='chartWrap'>
                    {chart}
                </span>
            );
        }
    }

    render() {
        const onSensor = this.state.onSensor;

        const [smellAlarmCount, gasAlarmCount, emergencyBellAlarmCount,thermalCameraAlarmCount, workerAlarmCount, fireAlarmCount, smellAlarm, gasAlarm, emergencyBellAlarm, thermalCameraAlarm, workerAlarm, fireAlarm] = this.getAlarmCount();

        return (
            <SensorEventInfoComponent className="sensorEventInfo">
                <h1>센서 이벤트 알람</h1>
                <div className='content'>
                    <ul>
                        <li 
                            id={gasAlarmCount === 0 ? 'gray' : ''}
                            className={onSensor === SdmsResource.ID.sensor.gas ? 'gas on' : 'gas'} 
                            onClick={() => this.onSelectedAlarm(gasAlarm, SdmsResource.ID.sensor.gas)}>
                            {this.getChart(gasAlarmCount)}
                            <div>
                                <span>
                                    {SdmsResource.ID.sensor.gas} {gasAlarmCount}건
                                </span>
                            </div>
                        </li>
                        <li 
                            id={smellAlarmCount === 0 ? 'gray' : ''}
                            className={onSensor === SdmsResource.ID.sensor.atmosphere ? 'stink on' : 'stink'} 
                            onClick={() => this.onSelectedAlarm(smellAlarm, SdmsResource.ID.sensor.atmosphere)}
                        >
                            {this.getChart(smellAlarmCount)}
                            <div>
                                <span>
                                    {SdmsResource.ID.sensor.atmosphere} {smellAlarmCount}건
                                </span>
                            </div>
                        </li>
                        <li 
                            id={emergencyBellAlarmCount === 0 ? 'gray' : ''}
                            className={onSensor === SdmsResource.ID.sensor.emergencyBell ? 'emergencyBell on' : 'emergencyBell'} 
                            onClick={() => this.onSelectedAlarm(emergencyBellAlarm, SdmsResource.ID.sensor.emergencyBell)}
                        >
                            {this.getChart(emergencyBellAlarmCount)}
                            <div>
                                <span>
                                    {SdmsResource.ID.sensor.emergencyBell} {emergencyBellAlarmCount}건
                                </span>
                            </div>
                        </li>
                        <li 
                            id={thermalCameraAlarmCount === 0 ? 'gray' : ''}
                            className={onSensor === SdmsResource.ID.sensor.thermalCamera ? 'cctv on' : 'cctv'} 
                            onClick={() => this.onSelectedAlarm(thermalCameraAlarm, SdmsResource.ID.sensor.thermalCamera)}
                        >
                            {this.getChart(thermalCameraAlarmCount)}
                            <div>
                                <span>
                                    {(SdmsResource.ID.sensor.thermalCamera).substr(0, 3)} {thermalCameraAlarmCount}건
                                </span>
                            </div>
                        </li>
                        <li 
                            id={workerAlarmCount === 0 ? 'gray' : ''}
                            className={onSensor === SdmsResource.ID.sensor.worker ? 'worker on' : 'worker'} 
                            onClick={() => this.onSelectedAlarm(workerAlarm, SdmsResource.ID.sensor.worker)}
                        >
                            {this.getChart(workerAlarmCount)}
                            <div>
                                <span >
                                    {SdmsResource.ID.sensor.worker} {workerAlarmCount}건
                                </span>
                            </div>
                        </li>
                        <li 
                            id={fireAlarmCount === 0 ? 'gray' : ''}
                            className={onSensor === SdmsResource.ID.sensor.fire ? 'fire on' : 'fire'} 
                            onClick={() => this.onSelectedAlarm(fireAlarm, SdmsResource.ID.sensor.fire)}
                        >
                            {this.getChart(fireAlarmCount)}
                            <div>
                                <span >
                                    {SdmsResource.ID.sensor.fire} {fireAlarmCount}건
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </SensorEventInfoComponent>
        )
    }
}

export default withRouter(SensorEventInfo);