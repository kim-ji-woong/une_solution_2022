import React, { Component } from 'react';

import alarm_on from '../../images/alarm_on.png';
import alarm_off from '../../images/alarm_off.png';

import SdmsResource from '../../resource/id';
import { UserDispatch } from '../../../Root/resource/userDispatch';

class StatusInfoZone extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);

        this.state = {

        }

        this.refSelectedSensor = React.createRef();
        this.refNotSelectedSensor = React.createRef();
    }

    componentDidMount() {
        // console.log(this.props);
    }

    componentDidUpdate(prevProps) {
        if(this.refSelectedSensor.current !== null) {
            this.refSelectedSensor.current.scrollIntoView({behavior : "smooth", block: "center"});
        }

        const titleDepth3 = document.getElementsByClassName('title-3depth on');
        const treeDepth3 = document.getElementsByClassName('tree-3depth on');
        const titleDepth4 = document.getElementsByClassName('title-4depth on');
        const treeDepth4 = document.getElementsByClassName('tree-4depth on');

        if((this.props.selectedStatusInfo.building === null || (this.props.selectedSensor === null && prevProps.selectedStatusInfo.building !== this.props.selectedStatusInfo.building)) ||
        (this.props.selectedStatusInfo.zone === null || (this.props.selectedSensor === null && prevProps.selectedStatusInfo.zone !== this.props.selectedStatusInfo.zone))) {
            
            for(let element3 of treeDepth3) {
                element3.classList.remove('on');
            }
            
            for(let element4 of treeDepth4) {
                element4.classList.remove('on');
            }
            
            for(let titleElement3 of titleDepth3) {
                titleElement3.classList.remove('on');
            }
            
            for(let titleElement4 of titleDepth4) {
                titleElement4.classList.remove('on');
            }
        }
    }

    onClickShowHide = (type, id) => {
        const element = document.getElementById(type + '_' + id);

        if (!element) 
            return;

        element.classList.toggle('on');
        element.previousSibling.classList.toggle('on');
    }

    selectSensor = (target, sensor) => {

        this.props.selectSensor(sensor, this.props.zone);
    }

    isAlarmSensor(facilityType, sensor) {

        // 환경설정 > 유형별 알람설정에서 체크 해제된 알람은 관제화면상에서 알람 표출X
        let isShow = true;      

        let alarmImgID = 'lightGrayICO';
        let alarmImgSrc = alarm_off;
        let alarmTxtID = 'alarmOff';

        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        const receiveAtmosphereAlarm = option3DSensor?.receiveAtmosphereAlarm;
        const receiveEmergencyBellAlarm = option3DSensor?.receiveEmergencyBellAlarm;
        const receiveFireAlarm = option3DSensor?.receiveFireAlarm;
        const receiveGasAlarm = option3DSensor?.receiveGasAlarm;
        const receiveThermalCameraAlarm = option3DSensor?.receiveThermalCameraAlarm;

        if(facilityType === SdmsResource.facilityType.ATMOSPHERE) {
            isShow = receiveAtmosphereAlarm;
        }
        else if(facilityType === SdmsResource.facilityType.EMERGENCYBELL) {
            isShow = receiveEmergencyBellAlarm;
        }
        else if(facilityType === SdmsResource.facilityType.FIRE) {
            isShow = receiveFireAlarm;
        }
        else if(facilityType === SdmsResource.facilityType.GAS) {
            isShow = receiveGasAlarm;
        }
        else if(facilityType === SdmsResource.facilityType.THERMAL_CAMERA) {
            isShow = receiveThermalCameraAlarm;
        }
        
        if(!isShow) {
            return [alarmImgID, alarmImgSrc, alarmTxtID];
        }
        else {
            const { alarm } = this.context;
            const alarms = alarm[0].alarmState;
            
            if (alarms) {
                const todayAlarms = alarms['allAlarmDatas'];
    
                for (let alarm of todayAlarms) {
    
                    if (alarm.isAlarm && alarm.facilityType === facilityType) {
                        if ((sensor.multiSensor?.isMultiSensor && sensor.multiSensor.idList.includes(alarm.orgSensorID)) ||
                            alarm.orgSensorID === sensor.id) {
                            alarmImgID = 'lightRedICO';
                            alarmImgSrc = alarm_on;
                            alarmTxtID = 'alarmOn';
                        }
                    }
                }
            }
            
            return [alarmImgID, alarmImgSrc, alarmTxtID];
        }
    }

    isSelectedSensor(sensorTagInfoID) {
        const selectedSensor = this.props.selectedSensor;
        let sensorClassName = '';
        let ref = null;

        if(selectedSensor) {
            if(selectedSensor.sensorTagInfoID === sensorTagInfoID) {
                sensorClassName = 'sensorText selected';
                ref = this.refSelectedSensor;
            }
            else {
                sensorClassName = 'sensorText';
                ref = this.refNotSelectedSensor;
            }
        }

        return [sensorClassName, ref];
    }

    isAlarmWorkerSensor(sensor) {

        // 환경설정 > 유형별 알람설정에서 체크 해제된 알람은 관제화면상에서 알람 표출X
        let isShow = true;  

        let alarmImgID = 'lightGrayICO';
        let alarmImgSrc = alarm_off;
        let alarmTxtID = 'alarmOff';

        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        const receiveWorkerAlarm = option3DSensor?.receiveWorkerAlarm;

        if(sensor.facilityType === SdmsResource.facilityType.WORKER) {
            isShow = receiveWorkerAlarm;
        }

        if(!isShow) {
            return [alarmImgID, alarmImgSrc, alarmTxtID];
        }
        else {
            const { alarm } = this.context;
            const alarms = alarm[0].alarmState;
            
            if (alarms) {
                const todayAlarms = alarms['allAlarmDatas'];
    
                for (let alarm of todayAlarms) {
    
                    if(alarm.isAlarm && alarm.facilityType === SdmsResource.facilityType.WORKER) {
                        if ((sensor.multiSensor?.isMultiSensor && sensor.multiSensor.idList.includes(alarm.orgSensorID)) ||
                            alarm.orgSensorID === sensor.id) {
                            alarmImgID = 'lightRedICO';
                            alarmImgSrc = alarm_on;
                            alarmTxtID = 'alarmOn';
                        }
                    }
                }
            }
            
            return [alarmImgID, alarmImgSrc, alarmTxtID];
        }
    }

    getSensorUI() {
        let atmosphereSensorsUI = [];
        let emergencyBellsUI = [];
        let gasSensorsUI = [];
        let thermalCCTVsUI = [];
        let workerTagsUI = [];
        let cctvsUI = [];

        if (this.props.atmosphereSensors) {
            this.props.atmosphereSensors.map((atmosphereSensor) => {
                const [alarmImgID, alarmImgSrc, alarmTxtID] = this.isAlarmSensor(atmosphereSensor.facilityType, atmosphereSensor); // 알람이 발생한 센서인가 ?

                const [sensorClassName, ref] = this.isSelectedSensor(atmosphereSensor.sensorTagInfoID); // 선택된 센서인가 ?

                return atmosphereSensorsUI.push(
                    <li key={'atmosphereSensor' + atmosphereSensor.id}>
                        <span className={sensorClassName} id={alarmTxtID} ref={ref} onClick={(e) => this.selectSensor(e.target, atmosphereSensor)}>{atmosphereSensor.name}</span>
                        <div>
                            <span className={atmosphereSensor.enabled ? 'greenDOTT' : 'grayDOTT'} />
                            <img src={alarmImgSrc} id={alarmImgID} className='alarmImg' alt='알람 아이콘' />
                        </div>
                    </li>
                );
            });
        };

        if (this.props.emergencyBells) {
            this.props.emergencyBells.map((emergencyBell) => {
                const [alarmImgID, alarmImgSrc, alarmTxtID] = this.isAlarmSensor(emergencyBell.facilityType, emergencyBell); // 알람이 발생한 센서인가 ?

                const [sensorClassName, ref] = this.isSelectedSensor(emergencyBell.sensorTagInfoID); // 선택된 센서인가 ?

                return emergencyBellsUI.push(
                    <li key={'emergencyBell' + emergencyBell.id}>
                        <span className={sensorClassName} id={alarmTxtID} ref={ref} onClick={(e) => this.selectSensor(e.target, emergencyBell)}>{emergencyBell.name}</span>
                        <div>
                            <span className={emergencyBell.enabled ? 'greenDOTT' : 'grayDOTT'} />
                            <img src={alarmImgSrc} id={alarmImgID} className='alarmImg' alt='알람 아이콘' />
                        </div>
                    </li>
                );
            });
        };

        if (this.props.gasSensors) {
            this.props.gasSensors.map((gasSensor) => {
                const [alarmImgID, alarmImgSrc, alarmTxtID] = this.isAlarmSensor(gasSensor.facilityType, gasSensor); // 알람이 발생한 센서인가 ?

                const [sensorClassName, ref] = this.isSelectedSensor(gasSensor.sensorTagInfoID); // 선택된 센서인가 ?

                return gasSensorsUI.push(
                    <li key={'gasSensor' + gasSensor.id}>
                        <span className={sensorClassName} id={alarmTxtID} ref={ref} onClick={(e) => this.selectSensor(e.target, gasSensor)}>{gasSensor.name}</span>
                        <div>
                            <span className={gasSensor.enabled ? 'greenDOTT' : 'grayDOTT'} />
                            <img src={alarmImgSrc} id={alarmImgID} className='alarmImg' alt='알람 아이콘' />
                        </div>
                    </li>
                );
            });
        };

        if (this.props.thermalCCTVs) {
            this.props.thermalCCTVs.map((thermalCCTV) => {
                const [alarmImgID, alarmImgSrc, alarmTxtID] = this.isAlarmSensor(thermalCCTV.facilityType, thermalCCTV); // 알람이 발생한 센서인가 ?

                const [sensorClassName, ref] = this.isSelectedSensor(thermalCCTV.sensorTagInfoID); // 선택된 센서인가 ?

                return thermalCCTVsUI.push(
                    <li key={'thermalCCTV' + thermalCCTV.id}>
                        <span className={sensorClassName} id={alarmTxtID} ref={ref} onClick={(e) => this.selectSensor(e.target, thermalCCTV)}>{thermalCCTV.name}</span>
                        <div>
                            <span className={thermalCCTV.enabled ? 'greenDOTT' : 'grayDOTT'} />
                            <img src={alarmImgSrc} id={alarmImgID} className='alarmImg' alt='알람 아이콘' />
                        </div>
                    </li>
                );
            });
        };

        if (this.props.workers) {
            this.props.workers.map((worker) => {
                const [alarmImgID, alarmImgSrc, alarmTxtID] = this.isAlarmWorkerSensor(worker); // 알람이 발생한 센서인가 ?

                const [sensorClassName, ref] = this.isSelectedSensor(worker.sensorTagInfoID); // 선택된 센서인가 ?

                return workerTagsUI.push(
                    <li key={'workerTags' + worker.id}>
                        <span className={sensorClassName} id={alarmTxtID} ref={ref} onClick={(e) => this.selectSensor(e.target, worker)}>{worker.name}</span>
                        <div>
                            <span className={worker.enabled ? 'greenDOTT' : 'grayDOTT'} />
                            <img src={alarmImgSrc} id={alarmImgID} className='alarmImg' alt='알람 아이콘' />
                        </div>
                    </li>
                );
            });
        };

        if (this.props.cctvs) {
            this.props.cctvs.map((cctv) => {
                const [sensorClassName, ref] = this.isSelectedSensor(cctv.sensorTagInfoID); // 선택된 센서인가 ?

                return cctvsUI.push(
                    <li key={'cctvs' + cctv.id}>
                        <span className={sensorClassName} ref={ref} onClick={(e) => this.selectSensor(e.target, cctv)}>{cctv.name}</span>
                        <div>
                            <span className={cctv.enabled ? 'greenDOTT' : 'grayDOTT'} />
                        </div>
                    </li>
                );
            });
        };

        return [atmosphereSensorsUI, emergencyBellsUI, gasSensorsUI, thermalCCTVsUI, workerTagsUI, cctvsUI];
    };

    render() {
        let [atmosphereSensorsUI, emergencyBellsUI, gasSensorsUI, thermalCCTVsUI, workerTagsUI, cctvsUI] = this.getSensorUI();

        let sensorUI = [];
        let workerUI = [];
        let cctvUI = [];

        const atmosphereSensorCount = (this.props.atmosphereSensors) ? this.props.atmosphereSensors.length : 0;
        const emergencyBellCount = (this.props.emergencyBells) ? this.props.emergencyBells.length : 0;
        const gasSensorCount = (this.props.gasSensors) ? this.props.gasSensors.length : 0;
        const thermalCCTVsCount = (this.props.thermalCCTVs) ? this.props.thermalCCTVs.length : 0;
        const workerTagsCount = (this.props.workers) ? this.props.workers.length : 0;
        const cctvsCount = (this.props.cctvs) ? this.props.cctvs.length : 0;

        const allSensorCount = atmosphereSensorCount + emergencyBellCount + gasSensorCount + thermalCCTVsCount + cctvsCount;
        

        let sensorClass = '';
        let sensorChildClass = '';
        let workerClass = '';
        let workerChildClass = '';
        let cctvClass = '';
        let cctvChildClass = '';

        let gasClass = 'title-4depth';
        let gasChildClass = 'tree-4depth';
        let atmosphereClass = 'title-4depth';
        let atmosphereChildClass = 'tree-4depth';
        let emergencyBellClass = 'title-4depth';
        let emergencyBellChildClass = 'tree-4depth';
        let thermalCameraClass = 'title-4depth';
        let thermalCameraChildClass = 'tree-4depth';

        // 선택된 센서가 있을 경우 tree open
        if(this.props.selectedSensor?.facilityType === SdmsResource.facilityType.GAS ||
            this.props.selectedSensor?.facilityType === SdmsResource.facilityType.ATMOSPHERE ||
            this.props.selectedSensor?.facilityType === SdmsResource.facilityType.EMERGENCYBELL ||
            (this.props.selectedSensor?.facilityType === SdmsResource.facilityType.THERMAL_CAMERA && this.props.selectedSensor?.facilityTypeName !== "CCTV")) {
            sensorClass = 'title-3depth on';
            sensorChildClass = 'tree-3depth on';

            if(this.props.selectedSensor?.facilityType === SdmsResource.facilityType.GAS) {
                gasClass = 'title-4depth on';
                gasChildClass = 'tree-4depth on';
            }
            
            if(this.props.selectedSensor?.facilityType === SdmsResource.facilityType.ATMOSPHERE) {
                atmosphereClass = 'title-4depth on';
                atmosphereChildClass = 'tree-4depth on';
            }

            if(this.props.selectedSensor?.facilityType === SdmsResource.facilityType.EMERGENCYBELL) {
                emergencyBellClass = 'title-4depth on';
                emergencyBellChildClass = 'tree-4depth on';
            }

            if(this.props.selectedSensor?.facilityType === SdmsResource.facilityType.THERMAL_CAMERA && this.props.selectedSensor?.facilityTypeName !== "CCTV") {
                thermalCameraClass = 'title-4depth on';
                thermalCameraChildClass = 'tree-4depth on';
            }
        }
        else {
            sensorClass = 'title-3depth';
            sensorChildClass = 'tree-3depth';
        }

        if(this.props.selectedSensor?.facilityType === SdmsResource.facilityType.WORKER) {
            workerClass = 'title-3depth on';
            workerChildClass = 'tree-3depth last on';
        }
        else {
            workerClass = 'title-3depth';
            workerChildClass = 'tree-3depth last';
        }

        if(this.props.selectedSensor?.facilityType === SdmsResource.facilityType.CCTV && this.props.selectedSensor?.facilityTypeName === "CCTV") {
            cctvClass = 'title-3depth on';
            cctvChildClass = 'tree-3depth last on';
        }
        else {
            cctvClass = 'title-3depth';
            cctvChildClass = 'tree-3depth last';
        }

        if(atmosphereSensorCount !== 0) {
            sensorUI.push(
                <li key={'atmosphereSensor_' + atmosphereSensorCount}>
                    <p className={atmosphereClass} onClick={(e) => { this.onClickShowHide('atmosphereSensor', this.props.id) }}>{SdmsResource.ID.sensor.atmosphere} ({atmosphereSensorCount})</p>
                    <ul className={atmosphereChildClass} id={'atmosphereSensor_' + this.props.id}>
                        {atmosphereSensorsUI}
                    </ul>
                </li>
            );
        }

        if(emergencyBellCount !== 0){
            sensorUI.push(
                <li key={'emergencyBell_' + emergencyBellCount}>
                    <p className={emergencyBellClass} onClick={(e) => { this.onClickShowHide('emergencyBell', this.props.id) }}>{SdmsResource.ID.sensor.emergencyBell} ({emergencyBellCount})</p>
                    <ul className={emergencyBellChildClass} id={'emergencyBell_' + this.props.id}>
                        {emergencyBellsUI}
                    </ul>
                </li>
            );
        }

        if(gasSensorCount !== 0){
            sensorUI.push(
                <li key={'gasSensor_' + gasSensorCount}>
                    <p className={gasClass} onClick={(e) => { this.onClickShowHide('gasSensor', this.props.id) }}>{SdmsResource.ID.sensor.gas} ({gasSensorCount})</p>
                    <ul className={gasChildClass} id={'gasSensor_' + this.props.id}>
                        {gasSensorsUI}
                    </ul>
                </li>
            );
        }

        if(thermalCCTVsCount !== 0){
            sensorUI.push(
                <li key={'thermalCCTV_' + thermalCCTVsCount}>
                    <p className={thermalCameraClass} onClick={(e) => { this.onClickShowHide('thermalCCTV', this.props.id) }}>{SdmsResource.ID.sensor.thermalCamera} ({thermalCCTVsCount})</p>
                    <ul className={thermalCameraChildClass} id={'thermalCCTV_' + this.props.id}>
                        {thermalCCTVsUI}
                    </ul>
                </li>
            );
        }

        if(workerTagsCount !== 0){
            workerUI.push(
                <li key={'workerTags_' + workerTagsCount}>
                    <p className={workerClass} onClick={(e) => { this.onClickShowHide('workerTags', this.props.id) }}>{SdmsResource.ID.sensor.worker} ({workerTagsCount})</p>
                    <ul className={workerChildClass} id={'workerTags_' + this.props.id}>
                        {workerTagsUI}
                    </ul>
                </li>
            );
        }

        if(cctvsCount !== 0){
            cctvUI.push(
                <li key={'cctvs_' + cctvsCount}>
                    <p className={cctvClass} onClick={(e) => { this.onClickShowHide('cctvs', this.props.id) }}>{SdmsResource.ID.sensor.cctv} ({cctvsCount})</p>
                    <ul className={cctvChildClass} id={'cctvs_' + this.props.id}>
                        {cctvsUI}
                    </ul>
                </li>
            );
        }

        return ( 
            <>          
                <li>
                    <p className={sensorClass} onClick={() => this.onClickShowHide("sensorGroups", this.props.zone.id)}>센서 ({allSensorCount})</p>
                    <ul className={sensorChildClass} id={'sensorGroups_' + this.props.zone.id}>
                        {sensorUI}
                    </ul>
                </li>
                {workerUI}
                {cctvUI}
            </> 
        );
    }
}

export default StatusInfoZone;