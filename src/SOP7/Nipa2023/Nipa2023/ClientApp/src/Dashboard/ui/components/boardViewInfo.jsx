import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { BoardViewInfoComponent } from '../../styled/dashboardStyled';

import { UserDispatch } from '../../../Root/resource/userDispatch';
import SdmsResource from '../../../SDMS/resource/id';

import topview from '../../images/topview.png';
import topview_lowSize from '../../images/topview_lowSize.png';
import BoardViewDetail from './boardViewDetail';

class BoardViewInfo extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);
		
		this.state = {
            sensorList: {},
            activeArea: 0,
        }

		this.props = props;
	}

    onAreaActive = (num) => {
        this.setState({ activeArea: num });
    }

    // 활성화된 센서 수 구하기
    getSensorEnabledCount = (sensors) => {
        let count = 0;

        if(sensors) {
            for(let sensor of sensors){
                if(sensor.enabled) {
                    count++;
                }
            }
        }
        
        return count;
    }

    getDisplayView() {

        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;
        let eventAlarmArea = [];

        let buildingDatas = this.props.buildingGroupList['buildingDatas'];
        const sensorList = this.props.sensorList;

        let factory = [];                   // 공장동
        let research = [];                  // 연구동
        let office = [];                    // 사무동
        let dormitory = [];                 // 기숙사
        let securityOffice = [];            // 경비실
        let garbageDump = [];               // 폐수처리장 및 쓰레기처리장
        let underground = [];               // 지하공동구
        let outdoor = [];                   // 외부영역

        if(!buildingDatas || !sensorList) {
            return [factory, research, office, dormitory, securityOffice, garbageDump, underground];
        }
        else {
            for(let building of buildingDatas) {
                const zoneDatas = building.zoneDatas;

                // 전체 센서 수
                let atmosphereCount = 0; 
                let emergencyCount = 0; 
                let gasCount = 0;
                let thermalCCTVCount = 0;
                let workerSensorCount = 0;
                let cctvSensorCount = 0;

                // 활성화된 센서 수
                let atmosphereSensorEnabledCount = 0;
                let emergencyBellSensorEnabledCount = 0;
                let gasSensorEnabledCount = 0;
                let thermalCameraSensorEnabledCount = 0;
                let workerSensorEnabledCount = 0;
                let cctvSensorEnabledCount = 0;

                // 이벤트 알람 수
                let atmosphereAlarmCount = 0; 
                let emergencyAlarmCount = 0; 
                let gasAlarmCount = 0;
                let thermalCCTVAlarmCount = 0;
                let workerSensorAlarmCount = 0;

                let isAlarm = false;

                if(zoneDatas) {
                    for(let zone of zoneDatas) {

                        let atmosphereSensors = null, emergencyBells = null, gasSensors = null, thermalCCTVs = null, aps = null, cctv = null;

                        if(sensorList) {
                            const _atmosphereSensors = sensorList['atmosphereSensors'];
                            const _emergencyBells = sensorList['emergencyBells'];
                            const _gasSensors = sensorList['gasSensors'];
                            const _thermalCCTVs = sensorList['thermalCCTVs'];
                            const _aps = sensorList['aps'];
                            const _cctvs = sensorList['cctvs'];

                            if(_atmosphereSensors) {
                                atmosphereSensors = _atmosphereSensors.filter(x => x.zoneID === zone.id);

                                if(atmosphereSensors?.length) {
                                    atmosphereCount += atmosphereSensors.length;

                                    atmosphereSensorEnabledCount += this.getSensorEnabledCount(atmosphereSensors);
                                }
                            }
                            if(_emergencyBells) {
                                emergencyBells = _emergencyBells.filter(x => x.zoneID === zone.id);

                                if(emergencyBells?.length){
                                    emergencyCount += emergencyBells.length;

                                    emergencyBellSensorEnabledCount += this.getSensorEnabledCount(emergencyBells);
                                }
                            }
                            if(_gasSensors) {
                                gasSensors = _gasSensors.filter(x => x.zoneID === zone.id);

                                if(gasSensors?.length){
                                    gasCount += gasSensors.length;

                                    gasSensorEnabledCount += this.getSensorEnabledCount(gasSensors);
                                }
                            }
                            if(_thermalCCTVs) {
                                thermalCCTVs = _thermalCCTVs.filter(x => x.zoneID === zone.id);

                                if(thermalCCTVs?.length){
                                    thermalCCTVCount += thermalCCTVs.length;

                                    thermalCameraSensorEnabledCount += this.getSensorEnabledCount(thermalCCTVs);
                                }
                            }
                            if(_aps) {
                                aps = _aps.filter(x => x.zoneID === zone.id);

                                if(aps?.length){
                                    workerSensorCount += aps.length;

                                    workerSensorEnabledCount += this.getSensorEnabledCount(aps);
                                }
                            }
                            if(_cctvs) {
                                cctv = _cctvs.filter(x => x.zoneID === zone.id);

                                if(cctv?.length){
                                    cctvSensorCount += cctv.length;

                                    cctvSensorEnabledCount += this.getSensorEnabledCount(cctv);
                                }
                            }
                        }

                        if(alarms) {
                            let smellAlarmDatas = null, emergencyBellAlarmDatas = null, gasAlarmDatas = null, thermalCameraAlarmDatas = null, workerTagAlarmDatas = null;

                            const _smellAlarmDatas = alarms['smellAlarmDatas'];
                            const _emergencyBellAlarmDatas = alarms['emergencyBellAlarmDatas'];
                            const _gasAlarmDatas = alarms['gasAlarmDatas'];
                            const _thermalCameraAlarmDatas = alarms['thermalCameraAlarmDatas'];
                            const _workerTagAlarmDatas = alarms['workerTagAlarmDatas'];

                            if(_smellAlarmDatas) {
                                smellAlarmDatas = _smellAlarmDatas.filter(x => x.zoneID === zone.id);

                                if(smellAlarmDatas?.length){
                                    atmosphereAlarmCount += smellAlarmDatas.length;
                                    if(atmosphereAlarmCount > 0) isAlarm = true;
                                }
                            }
                            if(_emergencyBellAlarmDatas) {
                                emergencyBellAlarmDatas = _emergencyBellAlarmDatas.filter(x => x.zoneID === zone.id);

                                if(emergencyBellAlarmDatas?.length){
                                    emergencyAlarmCount += emergencyBellAlarmDatas.length;
                                    if(emergencyAlarmCount > 0) isAlarm = true;
                                }
                            }
                            if(_gasAlarmDatas) {
                                gasAlarmDatas = _gasAlarmDatas.filter(x => x.zoneID === zone.id);

                                if(gasAlarmDatas?.length){
                                    gasAlarmCount += gasAlarmDatas.length;
                                    if(gasAlarmCount > 0) isAlarm = true;
                                }
                            }
                            if(_thermalCameraAlarmDatas) {
                                thermalCameraAlarmDatas = _thermalCameraAlarmDatas.filter(x => x.zoneID === zone.id);

                                if(thermalCameraAlarmDatas?.length){
                                    thermalCCTVAlarmCount += thermalCameraAlarmDatas.length;
                                    if(thermalCCTVAlarmCount > 0) isAlarm = true;
                                }
                            }
                            if(_workerTagAlarmDatas) {
                                workerTagAlarmDatas = _workerTagAlarmDatas.filter(x => x.zoneID === zone.id);

                                if(workerTagAlarmDatas?.length){
                                    workerSensorAlarmCount += workerTagAlarmDatas.length;
                                    if(workerSensorAlarmCount > 0) isAlarm = true;
                                }
                            }
                        }
                    }
                } 
                else {
                    // 외부영역
                    let atmosphereSensors = null, thermalCCTVs = null;

                    if(sensorList) {
                        const _atmosphereSensors = sensorList['atmosphereSensors'];
                        const _thermalCCTVs = sensorList['thermalCCTVs'];

                        if(_atmosphereSensors) {
                            atmosphereSensors = _atmosphereSensors.filter(x => x.zoneID >= 20000);
    
                            if(atmosphereSensors?.length) {
                                atmosphereCount += atmosphereSensors.length;
    
                                atmosphereSensorEnabledCount += this.getSensorEnabledCount(atmosphereSensors);
                            }
                        }
                        if(_thermalCCTVs) {
                            thermalCCTVs = _thermalCCTVs.filter(x => x.zoneID >= 20000);
    
                            if(thermalCCTVs?.length){
                                thermalCCTVCount += thermalCCTVs.length;
    
                                thermalCameraSensorEnabledCount += this.getSensorEnabledCount(thermalCCTVs);
                            }
                        }
                    }

                    if(alarms) {
                        let smellAlarmDatas = null, thermalCameraAlarmDatas = null;

                        const _smellAlarmDatas = alarms['smellAlarmDatas'];
                        const _thermalCameraAlarmDatas = alarms['thermalCameraAlarmDatas'];

                        if(_smellAlarmDatas) {
                            smellAlarmDatas = _smellAlarmDatas.filter(x => x.zoneID >= 20000);

                            if(smellAlarmDatas?.length){
                                atmosphereAlarmCount += smellAlarmDatas.length;
                                if(atmosphereAlarmCount > 0) isAlarm = true;
                            }
                        }
                        if(_thermalCameraAlarmDatas) {
                            thermalCameraAlarmDatas = _thermalCameraAlarmDatas.filter(x => x.zoneID >= 20000);

                            if(thermalCameraAlarmDatas?.length){
                                thermalCCTVAlarmCount += thermalCameraAlarmDatas.length;
                                if(thermalCCTVAlarmCount > 0) isAlarm = true;
                            }
                        }
                    }
                }

                switch (building.id) {
                    case SdmsResource.buildingType.factory :
                        factory.push(
                            <BoardViewDetail
                                key={'factory_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                cctvSensorCount={cctvSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                cctvSensorEnabledCount={cctvSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'2'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(2);
                        break;
                    case SdmsResource.buildingType.research :
                        research.push(
                            <BoardViewDetail
                                key={'research_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                cctvSensorCount={cctvSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                cctvSensorEnabledCount={cctvSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'5'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(5);
                        break;
                    case SdmsResource.buildingType.office :
                        office.push(
                            <BoardViewDetail
                                key={'office_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                cctvSensorCount={cctvSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                cctvSensorEnabledCount={cctvSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'4'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(4);
                        break;
                    case SdmsResource.buildingType.dormitory :
                        dormitory.push(
                            <BoardViewDetail
                                key={'dormitory_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                cctvSensorCount={cctvSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                cctvSensorEnabledCount={cctvSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'3'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(3);
                        break;
                    case SdmsResource.buildingType.securityOffice :
                        securityOffice.push(
                            <BoardViewDetail
                                key={'securityOffice_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                cctvSensorCount={cctvSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                cctvSensorEnabledCount={cctvSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'1'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(1);
                        break;
                    case SdmsResource.buildingType.garbageDump :
                        garbageDump.push(
                            <BoardViewDetail
                                key={'garbageDump_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                cctvSensorCount={cctvSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                cctvSensorEnabledCount={cctvSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'7'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(7);
                        break;
                    case SdmsResource.buildingType.underground :
                        underground.push(
                            <BoardViewDetail
                                key={'underground_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                cctvSensorCount={cctvSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                cctvSensorEnabledCount={cctvSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'6'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(6);
                        break;
                    case SdmsResource.buildingType.outdoor :
                        outdoor.push(
                            <BoardViewDetail
                                key={'underground_info'}
                                building={building}
                                onAreaActive={this.onAreaActive}
                                active={this.state.activeArea}
                                atmosphereCount={atmosphereCount}
                                emergencyCount={emergencyCount}
                                gasCount={gasCount}
                                thermalCCTVCount={thermalCCTVCount}
                                workerSensorCount={workerSensorCount}
                                atmosphereSensorEnabledCount={atmosphereSensorEnabledCount}
                                emergencyBellSensorEnabledCount={emergencyBellSensorEnabledCount}
                                gasSensorEnabledCount={gasSensorEnabledCount}
                                thermalCameraSensorEnabledCount={thermalCameraSensorEnabledCount}
                                workerSensorEnabledCount={workerSensorEnabledCount}
                                atmosphereAlarmCount={atmosphereAlarmCount}
                                emergencyAlarmCount={emergencyAlarmCount}
                                gasAlarmCount={gasAlarmCount}
                                thermalCCTVAlarmCount={thermalCCTVAlarmCount}
                                workerSensorAlarmCount={workerSensorAlarmCount}
                                activeNum={'8'}
                                isAlarm={isAlarm}
                            />
                        );
                        if(isAlarm) eventAlarmArea.push(8);
                        break;
                    default: 
                        break;
                }
            }

            return [factory, research, office, dormitory, securityOffice, garbageDump, underground, outdoor, eventAlarmArea];
        }
    }

    render() {
        let active = this.state.activeArea;

        const [factory, research, office, dormitory, securityOffice, garbageDump, underground, outdoor, eventAlarmArea] = this.getDisplayView();
        
        return (
            <BoardViewInfoComponent className="boardViewInfo">
                <div className='modelingImgWrap'>
                    <img src={topview_lowSize} alt='3D 모델링 사진' />
                    <ul>
                        <li id={active === 1 ? 'active' : null} onClick={() => this.onAreaActive(1)} className={eventAlarmArea && eventAlarmArea.includes(1) ? 'on' : null}>1</li>
                        <li id={active === 2 ? 'active' : null} onClick={() => this.onAreaActive(2)} className={eventAlarmArea && eventAlarmArea.includes(2) ? 'on' : null}>2</li>
                        <li id={active === 3 ? 'active' : null} onClick={() => this.onAreaActive(3)} className={eventAlarmArea && eventAlarmArea.includes(3) ? 'on' : null}>3</li>
                        <li id={active === 4 ? 'active' : null} onClick={() => this.onAreaActive(4)} className={eventAlarmArea && eventAlarmArea.includes(4) ? 'on' : null}>4</li>
                        <li id={active === 5 ? 'active' : null} onClick={() => this.onAreaActive(5)} className={eventAlarmArea && eventAlarmArea.includes(5) ? 'on' : null}>5</li>
                        <li id={active === 6 ? 'active' : null} onClick={() => this.onAreaActive(6)} className={eventAlarmArea && eventAlarmArea.includes(6) ? 'on' : null}>6</li>
                        <li id={active === 7 ? 'active' : null} onClick={() => this.onAreaActive(7)} className={eventAlarmArea && eventAlarmArea.includes(7) ? 'on' : null}>7</li>
                        <li id={active === 8 ? 'active' : null} onClick={() => this.onAreaActive(8)} className={eventAlarmArea && eventAlarmArea.includes(8) ? 'on' : null}>8</li>
                    </ul>
                </div>
                <div className='content left'>
                    {securityOffice}
                    {factory}
                    {dormitory}
                    {office}
                </div>
                <div className='content right'>
                    {research}
                    {underground}
                    {garbageDump}
                    {outdoor}
                </div>
                
            </BoardViewInfoComponent>
        )
    }
}

export default withRouter(BoardViewInfo);