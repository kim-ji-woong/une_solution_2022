import React, { Component } from 'react';
import SdmsResource from '../SDMS/resource/id';
import { SDMSController } from '../SDMS/services/sdmsController';
import { SDMSDataManager } from '../SDMS/services/sdmsDataManager';

import sensor from '../SensorSimulator/css/sensor.module.css';
import content from '../Common/css/content.module.css';
import $ from 'jquery';
import { SensorSimulatorController } from './services/sensorSimulatorController';

import ProjectResource from '../Root/resource/id';
import AccountResource from '../Account/resource/id';
import { GghController } from '../SDMS/services/gghController';


class SensorSimulator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            sensorList: null,
            sensorTypes: [],
            currentSensorType: null,
            selectedSensor: null,
            selectedAlarm: null,
            currentAlarms: []
        }

        this.refSelect = React.createRef();
    }

    componentDidMount() {
        this.readSensorList();
        setTimeout(() => this.checkAlarmList(), 1000);
    }

    async checkAlarmList() {
        const [alarmList, message] = await SensorSimulatorController.requestAlarmList();

        if (!alarmList) {
            if (message && message.length > 0) {
                console.log("checkAlarmList Error : " + message);
            }
        }
        else {
            this.checkAlarms(alarmList);
        }

        setTimeout(() => this.checkAlarmList(), 1000);
    }

    // 알람상태가 바뀌었으면 화면을 갱신한다.
    checkAlarms(alarmList) {
        const currentAlarms = [...this.state.currentAlarms];
        const oldCount = currentAlarms.length;
        const newCount = alarmList.length;

        if (oldCount !== newCount) {
            this.setState({ currentAlarms: alarmList });
        }
        else {
            for (let i = 0; i < newCount; i++) {
                const oldAlarm = currentAlarms[i];
                const newAlarm = alarmList[i];

                if (this.alarmIsChanged(oldAlarm, newAlarm)) {
                //if (oldAlarm.sensorZoneHistoryID !== newAlarm.sensorZoneHistoryID) {
                    this.setState({ currentAlarms: alarmList });
                    break;
                }
            }
        }
    }

    alarmIsChanged(alarm1, alarm2) {
        if (alarm1.sensorZoneHistoryID !== alarm2.sensorZoneHistoryID) {
            return true;
        }

        const sensorZoneIDCount1 = alarm1.sensorZoneIDs.length;
        const sensorZoneIDCount2 = alarm2.sensorZoneIDs.length;

        if (sensorZoneIDCount1 !== sensorZoneIDCount2) {
            return true;
        }

        for (let i = 0; i < sensorZoneIDCount1; i++) {
            const sensorZone1 = alarm1.sensorZoneIDs[i];
            const sensorZone2 = alarm2.sensorZoneIDs[i];

            if (sensorZone1 !== sensorZone2) {
                return true;
            }
        }

        return false;
    }

    async readSensorList() {
        const [result, message] = await SDMSController.requestSensorList();
        const sensorList = {};

        if (result) {
            const _3dOptions = await this.get3DOptions();

            if (_3dOptions) {
                if (result.fireSensors) {
                    this.setSensorList(result.fireSensors, _3dOptions, sensorList, SdmsResource.facilityType.FIRE);
                }

                if (result.etcSensors) {
                    this.setSensorList(result.etcSensors, _3dOptions, sensorList, SdmsResource.facilityType.ETC);
                }

                if (result.psmSensors) {
                    this.setSensorList(result.psmSensors, _3dOptions, sensorList, SdmsResource.facilityType.PSM_SENSOR);
                }

                if (result.cctvs) {
                    this.setSensorList(result.cctvs, _3dOptions, sensorList, SdmsResource.facilityType.Intrusion_S1);
                }
                
                if (result.laserSensors)
                    this.setSensorList(result.laserSensors, _3dOptions, sensorList, SdmsResource.facilityType.Laser);
                
                if (result.doorSensors)
                    this.setSensorList(result.doorSensors, _3dOptions, sensorList, SdmsResource.facilityType.DOOR);

                if (result.emergencyBellSensors) {
                    this.setSensorList(result.emergencyBellSensors, _3dOptions, sensorList, SdmsResource.facilityType.EmergencyBell);
                }

                if (result.environmentSensors) {
                    this.setSensorList(result.environmentSensors, _3dOptions, sensorList, SdmsResource.facilityType.Environment);
                }
                
                const sensorTypes = [];

                for (const sensorTypeName in sensorList) {
                    sensorTypes.push(sensorTypeName);
                }

                const currentSensorType = sensorTypes.length > 0 ? sensorTypes[0] : "";
                this.setState({ loading: false, sensorList, sensorTypes, currentSensorType });
            }
        }
        else {
            if (message && message.length > 0) {
                alert(message);
            }
        }

        $('.' + sensor.trAct).click(function () {
            $('.' + sensor.trAct).removeClass(sensor.selectedArea);
            $(this).addClass(sensor.selectedArea);
        });

        $('.' + sensor.sensorName).click(function () {
            $('.' + sensor.sensorName).removeClass(sensor.selected);
            $(this).addClass(sensor.selected);
        });
    }

    setSensorList(sensors, _3dOptions, sensorList, facilityType) {
        for (const sensor of sensors) {
            const facilityName = SdmsResource.getFacilityTypeString(facilityType);

            if (facilityName.length === 0) {
                return;
            }

            let buildingGroups = sensorList[facilityName];

            if (!buildingGroups) {
                buildingGroups = {};
                sensorList[facilityName] = buildingGroups;
            }


            /*  멀티 사이트 관련 수정
            const zoneData = _3dOptions.zones[sensor.zoneID];
            if (!zoneData || zoneData.length < 4) {
                continue;
            }
            */
            let zoneData = null;
            let _3dOption = null;

            for (const siteID in _3dOptions) {
                _3dOption = _3dOptions[siteID];

                const data = _3dOption.zones[sensor.zoneID];
                if (data?.length > 3) {
                    zoneData = data;
                    break;
                }
            }

            if (!zoneData)
                continue;
            
            //const buildingData = _3dOptions.buildingIDs[zoneData[1]];
            const buildingData = _3dOption?.buildingIDs[zoneData[1]];

            if (!buildingData || buildingData.length < 3) {
                continue;
            }

            const buildingGroupName = buildingData[1];
            const buildingName = buildingData[2];

            let buildingGroup = buildingGroups[buildingGroupName];

            if (!buildingGroup) {
                buildingGroup = {};
                buildingGroups[buildingGroupName] = buildingGroup;
            }

            let building = buildingGroup[buildingName];

            if (!building) {
                building = {};
                buildingGroup[buildingName] = building;
            }

            const zoneName = zoneData[3];
            let zoneSensors = building[zoneName];

            if (!zoneSensors) {
                zoneSensors = {};
                building[zoneName] = zoneSensors;
            }

            zoneSensors[sensor.name] = sensor;
        }
    }

    async get3DOptions() {
        let siteIDs = null;
        const userInfo = await ProjectResource.initUserInfo();
        if (userInfo?.levelID !== AccountResource.accountLevelID.master && userInfo?.siteID) {
            siteIDs = [userInfo.siteID];
        }

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);
        const site3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, 0, siteIDs);

        if (site3dOptions) {
            /* 멀티 사이트 관련 수정
            for (const siteID in site3dOptions) {
                const _3dOptions = site3dOptions[siteID];
                return _3dOptions;
            }
            */
            return site3dOptions;
        }

        return null;
    }

    getSortedKeys(obj) {
        const keys = [];

        for (const keyName in obj) {
            keys.push(keyName);
        }

        keys.sort();
        return keys;
    }

    getSensorElements() {
        const sensorList = { ...this.state.sensorList };
        const currentSensorType = this.state.currentSensorType;

        if (!sensorList) {
            return <></>
        }

        const sensors = sensorList[currentSensorType];

        if (!sensors) {
            return <></>
        }

        const rootElements = [];
        rootElements.push(<input type="checkbox" id="tab1" />);
        rootElements.push(<label htmlFor="tab1">{currentSensorType}</label>);

        let bgIndex = 1, bIndex = 1, zIndex = 1, sIndex = 1;
        const buildingGroupLiElements = [];

        for (const buildingGroupName of this.getSortedKeys(sensors)) {
            const bgID = "tabBG_" + bgIndex++;
            const buildingGroupElements = [];

            buildingGroupElements.push(<input type="checkbox" id={bgID} />);
            buildingGroupElements.push(<label htmlFor={bgID}>{buildingGroupName}</label>);

            const buildingGroupData = sensors[buildingGroupName];
            const buildingLiElements = [];

            for (const buildingName of this.getSortedKeys(buildingGroupData)) {
                const bID = "tabB_" + bIndex++;
                const buildingElements = [];

                buildingElements.push(<input type="checkbox" id={bID} />);
                buildingElements.push(<label htmlFor={bID}>{buildingName}</label>);

                const buildingData = buildingGroupData[buildingName];
                const zoneLiElements = [];

                for (const zoneName of this.getSortedKeys(buildingData)) {
                    const zID = "tabZ_" + zIndex++;
                    const zoneElements = [];

                    zoneElements.push(<input type="checkbox" id={zID} defaultChecked />);
                    zoneElements.push(<label htmlFor={zID}>{zoneName}</label>);

                    const zoneData = buildingData[zoneName];
                    const sensorElements = [];

                    for (const sensorName of this.getSortedKeys(zoneData)) {
                        const _sensor = zoneData[sensorName];
                        const sID = "tabS_" + sIndex++;
                        const sensorClassName = _sensor === this.state.selectedSensor ? sensor.sensorName + " " + sensor.selected : sensor.sensorName;

                        sensorElements.push(
                            <li className={sensor.lastTab}>
                                <input type="checkbox" id={sID}/>
                                <p className={sensorClassName}><label htmlFor={sID} onClick={() => this.onSelectSensor(_sensor)}>{sensorName}</label></p>
                            </li>
                        );
                    }

                    zoneElements.push(
                        <ul className={sensor.fiftyTab}>
                            {
                                sensorElements
                            }
                        </ul>
                    );

                    zoneLiElements.push(
                        <li>
                        {
                            zoneElements
                        }
                        </li>
                    );
                }

                buildingElements.push(
                    <ul className={sensor.fourthTab}>
                        {
                            zoneLiElements
                        }
                    </ul>
                );

                buildingLiElements.push(
                    <li>
                        {
                            buildingElements
                        }
                    </li>
                );
            }

            buildingGroupElements.push(
                <ul className={sensor.thirdTab}>
                    {
                        buildingLiElements
                    }
                </ul>
            );

            buildingGroupLiElements.push(
                <li>
                    {
                        buildingGroupElements
                    }
                </li>
            );
        }

        rootElements.push(
            <ul className={sensor.secondTab}>
                {
                    buildingGroupLiElements
                }
            </ul>
        )

        return rootElements;
    }

    getAlarmElements() {
        const currentAlarms = [...this.state.currentAlarms];
        const alarmElements = [];
        const alarmCount = currentAlarms.length;

        for (let i = 0; i < alarmCount; i++) {
            const alarm = currentAlarms[i];
            const sensorType = SdmsResource.getFacilityTypeString(alarm.sensorType);
            const alarmClassName = alarm.sensorZoneHistoryID === this.state.selectedAlarm?.sensorZoneHistoryID ? sensor.trAct + " " + sensor.selectedArea : sensor.trAct;

            alarmElements.push(
                <tr className={alarmClassName} onClick={() => this.onSelectAlarm(alarm)}>
                    <td style={{ width: "8%" }}>{i + 1}</td>
                    <td style={{ width: "25%" }}>{alarm.time}</td>
                    <td style={{ width: "37%" }}>{alarm.positionName}</td>
                    <td style={{ width: "30%" }}>{sensorType}</td>
                </tr>
            );
        }

        return alarmElements;
    }

    onSelectAlarm(alarm) {
        this.setState({ selectedAlarm: alarm });
    }

    onSelectSensor(sensor) {
        this.setState({ selectedSensor: sensor });
    }

    getSensorTypes() {
        const sensorTypeElements = [];
        const sensorTypes = [...this.state.sensorTypes];

        const currentSensorType = this.state.currentSensorType;

        for (const sensorTypeName of sensorTypes) {
            if (sensorTypeName === currentSensorType) {
                sensorTypeElements.push(
                    <option value={sensorTypeName} selected>{sensorTypeName}</option>
                );
            }
            else {
                sensorTypeElements.push(
                    <option value={sensorTypeName}>{sensorTypeName}</option>
                );
            }
        }

        return sensorTypeElements; 
    }

    onChangeSensorType() {
        const currentSensorType = this.refSelect.current.options[this.refSelect.current.selectedIndex].value;
        this.setState({ currentSensorType, selectedSensor: null });
    }

    getSensorType(sensor) {
        if (!sensor.facilityType) {
            const currentSensorType = this.state.currentSensorType;

            let facilityType = SdmsResource.facilityType.Intrusion_S1;
            const facilityName = SdmsResource.getFacilityTypeString(facilityType);

            facilityType = SdmsResource.facilityType.FIRE;
          
            if (currentSensorType === facilityName)
                facilityType = SdmsResource.facilityType.Intrusion_S1;

            return facilityType;
        }

        return sensor.facilityType;
    }

    onClickSendAlarm(isAlarm, allClear) {
        if (isAlarm) {
            const selectedSensor = this.state.selectedSensor;

            if (!selectedSensor) {
                alert("먼저 센서를 선택하세요.");
            }
            else {
                const sensorType = this.getSensorType(selectedSensor);
                SensorSimulatorController.sendAlarm(sensorType, selectedSensor.sensorTagInfoID, selectedSensor.sensorZoneID);
            }
        }
        else {
            if (allClear) {
                const currentAlarms = [...this.state.currentAlarms];

                for (const alarm of currentAlarms) {
                    SensorSimulatorController.clearAlarm(alarm.sensorType, alarm.sensorTagID, alarm.sensorZoneIDs);
                }
            }
            else {
                const selectedAlarm = this.state.selectedAlarm;

                if (!selectedAlarm) {
                    alert("먼저 알람을 선택하세요.");
                }
                else {
                    SensorSimulatorController.clearAlarm(selectedAlarm.sensorType, selectedAlarm.sensorTagID, selectedAlarm.sensorZoneIDs);
                }
            }

            this.setState({ selectedAlarm: null });
        }
    }

    render() {
        if (this.state.loading) {
            return <></>
        }

        return (
            <>
                <div className={sensor.sensorPopBox}>
                    <div className={sensor.sensorBoxTitle}>
                        <span className={sensor.sensorText}>SensorSimulator</span>
                    </div>
                    <div className={sensor.titleArea}>
                        <span className={sensor.titleText}>센서타입 : </span>
                        <span>
                            <select ref={this.refSelect} className={sensor.sensorSelect} onChange={() => this.onChangeSensorType()}>
                                {
                                    this.getSensorTypes()
                                }
                            </select>
                        </span>
                    </div>

                    <div className={sensor.sensorTableArea}>
                    <div className={sensor.sensorFlex}>
                      <div className={sensor.alarmTable}>
                        <table>
                            <tr>
                                <th style={{ width: "8%" }}>No</th>
                                <th style={{ width: "25%" }}>발생시간</th>
                                <th style={{ width: "37%" }}>위치</th>
                                <th style={{ width: "30%" }}>센서타입</th>
                            </tr>
                            {
                                this.getAlarmElements()
                            }
                        </table>
                      </div>

                     <div className={sensor.alarmBox}>
                        <span className={sensor.alarmClose2} onClick={() => this.onClickSendAlarm(false, true)}><a>전체알람해제</a></span>
                        <span className={sensor.alarmClose} onClick={() => this.onClickSendAlarm(false)}><a>알람해제</a></span>
                     </div>
                    </div>

                    <div className={sensor.sensorFlex}>
                      <div className={sensor.sensorTable}>
                        <span className={sensor.sensorList}>센서 리스트</span>
                         <div className={sensor.sensorTreeArea}>
                            <ul className={sensor.firstTab}>
                                <li>
                                {
                                    this.getSensorElements()
                                }
                                </li>
                            </ul>
                         </div> {/* sensorTreeArea */}
                      </div> {/* sensorTable */}
                      <div className={sensor.alarmBox2}>
                        <span className={sensor.alarmOpen} onClick={() => this.onClickSendAlarm(true)}><a>알람발생</a></span>
                      </div>
                    </div>
                    </div> {/* sensorTableArea */}

                </div>
            </>
        );
    }
}
export default SensorSimulator;