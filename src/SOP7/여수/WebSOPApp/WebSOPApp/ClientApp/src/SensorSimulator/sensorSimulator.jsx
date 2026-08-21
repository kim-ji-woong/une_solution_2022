import React, { Component } from 'react';
import SdmsResource from '../SDMS/resource/id';
import { SDMSController } from '../SDMS/services/sdmsController';
import { SDMSDataManager } from '../SDMS/services/sdmsDataManager';

import sensor from '../SensorSimulator/css/sensor.module.css';
import content from '../Common/css/content.module.css';
import $ from 'jquery';
import { SensorSimulatorController } from './services/sensorSimulatorController';
import ConfirmDialog from '../Common/ui/confirmDialog';

class SensorSimulator extends Component {
    static Positive = 1;
    static Negative = 0;
    static Both = 2;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            sensorList: null,
            sensorTagList: {},
            sensorTypes: [],
            currentSensorType: null,
            selectedSensor: null,
            selectedAlarm: null,
            currentAlarms: [],
            materialAlarmTypes: {},

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },

        }

        this.refSelect = React.createRef();
        this.refAlarmValue = React.createRef();
        this.alarmRange = [null, null, true];
    }

    componentDidMount() {
        this.readSensorList();
        setTimeout(() => this.checkAlarmList(), 1000);
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }


    showConfirmDialog = (title, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
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
        const materialAlarmTypes = await this.readMaterialAlarmDatas();

        const [result, message] = await SDMSController.requestSensorList();
        const sensorList = {};
        const sensorTagList = {};

        if (result) {
            const _3dOptions = await this.get3DOptions();

            if (_3dOptions) {
                if (result.etcSensors) {
                    this.setSensorList(result.etcSensors, _3dOptions, sensorList, sensorTagList);
                }

                const sensorTypes = [];

                for (const sensorTypeName in sensorList) {
                    sensorTypes.push(sensorTypeName);
                }

                const currentSensorType = sensorTypes.length > 0 ? sensorTypes[0] : "";
                this.setState({ loading: false, sensorList, sensorTagList, sensorTypes, currentSensorType, materialAlarmTypes });
            }
        }
        else {
            if (message && message.length > 0) {
                //alert(message);
                this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
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

    async readMaterialAlarmDatas() {
        const materialAlarmTypes = {};
        const [materialLinks, message] = await SensorSimulatorController.requestMaterialAlarmDatas();

        if (materialLinks) {
            for (const materialLink of materialLinks) {
                materialAlarmTypes[materialLink.materialID] = materialLink;
            }

            return materialAlarmTypes;
        }
        else {
            //alert(message);
            this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }

        return materialAlarmTypes;
    }

    setSensorList(sensors, _3dOptions, sensorList, sensorTagList) {
        for (const _sensor of sensors) {
            if (!_sensor.uniqueKey) {
                continue;
            }

            const index = _sensor.uniqueKey.lastIndexOf('_');

            if (index < 0) {
                continue;
            }

            const uniqueKey = _sensor.uniqueKey.substring(0, index);
            let categorySensors = {};

            if (uniqueKey.startsWith(SdmsResource.AtmosphereData.header)) {
                categorySensors = this.getSensors(SdmsResource.AtmosphereData.group, sensorList);
            }
            else if (uniqueKey.startsWith(SdmsResource.WaterData.header)) {
                categorySensors = this.getSensors(SdmsResource.WaterData.group, sensorList);
            }
            else if (uniqueKey.startsWith(SdmsResource.VocData.header)) {
                categorySensors = this.getSensors(SdmsResource.VocData.group, sensorList);
            }
            else if (uniqueKey.startsWith(SdmsResource.StinkData.header)) {
                categorySensors = this.getSensors(SdmsResource.StinkData.group, sensorList)
            }
            // 기상센서는 제외
            /*else if (uniqueKey.startsWith(SdmsResource.WeatherData.header)) {
                categorySensors = this.getSensors(SdmsResource.WeatherData.group, sensorList);
            }*/
            else {
                continue;
            }

            let sensorList2 = categorySensors[uniqueKey];

            if (!sensorList2) {
                sensorList2 = [];
                categorySensors[uniqueKey] = sensorList2;
            }

            sensorList2.push(_sensor);

            if (_sensor.sensorTagInfoID) {
                sensorTagList[_sensor.sensorTagInfoID] = _sensor;
            }
        }
    }

    getSensors(groupName, sensorList) {
        let sensors = sensorList[groupName];

        if (!sensors) {
            sensors = {};
            sensorList[groupName] = sensors;
        }

        return sensors;
    }

    async get3DOptions() {
        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList();
        const site3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, 0);

        if (site3dOptions) {
            for (const siteID in site3dOptions) {
                const _3dOptions = site3dOptions[siteID];
                return _3dOptions;
            }
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

    isValidType(materialType, sensorType) {
        if (sensorType === SdmsResource.AtmosphereData.group) {
            if (materialType === SdmsResource.materialType.Dust_PM2 ||
                materialType === SdmsResource.materialType.Dust_PM10 ||
                materialType === SdmsResource.materialType.CL2 ||
                materialType === SdmsResource.materialType.NH3 ||
                materialType === SdmsResource.materialType.HCL ||
                materialType === SdmsResource.materialType.VOC ||
                materialType === SdmsResource.materialType.H2S) {
                return true;
            }
        }
        else if (sensorType === SdmsResource.WaterData.group) {
            return true;
        }
        else if (sensorType === SdmsResource.VocData.group) {
            return true;
        }
        else if (sensorType === SdmsResource.StinkData.group) {
            if (materialType === SdmsResource.materialType.VOC ||
                materialType === SdmsResource.materialType.OU) {
                return true;
                }
        }

        return false;
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
        rootElements.push(<label for="tab1">{currentSensorType}</label>);

        let sgIndex = 1, sIndex = 1;
        const sensorGroupLiElements = [];

        for (const sensorName in sensors) {
            const sgID = "tabSG_" + sgIndex++;
            const sgElements = [];

            const sensorGroupData = sensors[sensorName];
            const sensorLiElements = [];

            if (sensorGroupData.length === 0) {
                continue;
            }

            sgElements.push(<input type="checkbox" id={sgID} />);
            sgElements.push(<label for={sgID}>{sensorGroupData[0].name}</label>);

            for (const _sensor of sensorGroupData) {
                if (this.isValidType(_sensor.materialType, currentSensorType) === false) {
                    continue;
                }

                const sID = "tabS_" + sIndex++;
                const sensorElements = [];
                const sensorClassName = _sensor === this.state.selectedSensor ? sensor.sensorName + " " + sensor.selected : sensor.sensorName;

                sensorElements.push(<input type="checkbox" id={sID} />);
                sensorElements.push(<p className={sensorClassName}><label for={sID} onClick={() => this.onSelectSensor(_sensor)}>{SdmsResource.getFacilityTypeString(_sensor.materialType)}</label></p>);

                sensorLiElements.push(
                    <li>
                        {
                            sensorElements
                        }
                    </li>
                );
            }

            sgElements.push(
                <ul className={sensor.thirdTab}>
                    {
                        sensorLiElements
                    }
                </ul>
            );

            sensorGroupLiElements.push(
                <li>
                    {
                        sgElements
                    }
                </li>
            );
        }

        rootElements.push(
            <ul className={sensor.secondTab}>
                {
                    sensorGroupLiElements
                }
            </ul>
        )

        return rootElements;
    }

    getSensor(tagNo) {
        return this.state.sensorTagList[tagNo];
    }

    getAlarmElements() {
        const currentAlarms = [...this.state.currentAlarms];
        const alarmElements = [];
        const alarmCount = currentAlarms.length;

        for (let i = 0; i < alarmCount; i++) {
            const alarm = currentAlarms[i];
            const alarmSensor = this.getSensor(alarm.sensorTagID);
            const sensorType = alarmSensor ? SdmsResource.getFacilityTypeString(alarmSensor.materialType) : SdmsResource.getFacilityTypeString(alarm.sensorType);
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
        //if (!sensor.facilityType) {
        //    return SdmsResource.facilityType.FIRE;
        //}

        if (!sensor.facilityType)
            return SdmsResource.facilityType.ETC;

        if (sensor.facilityType === -1)
            return SdmsResource.facilityType.ETC;

        return sensor.facilityType;
    }

    tryParseFloat = (value) => {
        const fValue = parseFloat(value);
        const result = isNaN(fValue) ? null : fValue;
        return result;
    }

    getAlarmLevel(sensorValue) {
        const direction = this.alarmRange[2];
        const min = this.alarmRange[0];
        const max = this.alarmRange[1];

        const value = this.tryParseFloat(sensorValue);

        let alarmLevel;

        let min1, min2, max1, max2;

        min1 = min[0] !== null && min[0] !== undefined ? min[0] : null;
        min2 = min[1] !== null && min[1] !== undefined ? min[1] : null;
        max1 = max[0] !== null && max[0] !== undefined ? max[0] : null;
        max2 = max[1] !== null && max[1] !== undefined ? max[1] : null;

        // 여수는 4단계 알람만 사용
        if (direction === SensorSimulator.Positive) {
            if (value > min1) {
                alarmLevel = 1;
            }

            if (value > max1) {
                alarmLevel = 2;
            }

            if (value > min2) {
                alarmLevel = 3;
            }

            if (value > max2) {
                alarmLevel = 4;
            }
            return alarmLevel;
        } else if (direction === SensorSimulator.Negative) {
            if (value < min2) {
                alarmLevel = 2;
            }

            if (value < max1) {
                alarmLevel = 3;
            }

            if (value < min1) {
                alarmLevel = 4;
            }
            return alarmLevel
        } else { /*if (direction === SensorSimulator.Both)*/
            const range1 = this.alarmRange[0];
            const range2 = this.alarmRange[1];

            if (sensorValue < range1[0] || sensorValue > range2[1]) {
                return 4;
            }
            else if (sensorValue > range1[1] && sensorValue < range2[0]) {
                return 0;
            }
        }

    }

    onClickSendAlarm(isAlarm, allClear) {
        if (isAlarm) {
            const selectedSensor = this.state.selectedSensor;

            if (!selectedSensor) {
                //alert("먼저 센서를 선택하세요.");
                this.showConfirmDialog("에러", ["먼저 센서를 선택하세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
            else if (this.alarmRange[0] === null || this.alarmRange[1] === null) {
                //alert("알람을 발생할 수 없는 센서입니다.");
                this.showConfirmDialog("에러", ["알람을 발생할 수 없는 센서입니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
            else {
                if (!this.refAlarmValue.current.value) {
                    //alert("알람을 발생시킬 센서값을 입력하세요.");
                    this.showConfirmDialog("에러", ["알람을 발생시킬 센서값을 입력하세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    return;
                }

                const sensorValue = parseFloat(this.refAlarmValue.current.value.toString().trim());

                if (sensorValue !== 0 && !sensorValue) {
                    //alert("알람을 발생시킬 숫자 형태의 센서값을 입력하세요.");
                    this.showConfirmDialog("에러", ["알람을 발생시킬 숫자 형태의 센서값을 입력하세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    return;
                }

                const alarmLevel = this.getAlarmLevel(sensorValue);

                if (alarmLevel < 4) {
                    //alert("알람은 최소 3단계(경계) 이상이어야 합니다.\r\n센서값을 다시 확인하세요.");
                    //this.showConfirmDialog("에러", ["알람은 최소 3단계(경계) 이상이어야 합니다.\r\n센서값을 다시 확인하세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    this.showConfirmDialog("에러", ["알람은 최소 4단계(심각) 이상이어야 합니다.\r\n센서값을 다시 확인하세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    return;
                }

                const sensorType = this.getSensorType(selectedSensor);
                SensorSimulatorController.sendAlarm(sensorType, selectedSensor.sensorTagInfoID, selectedSensor.sensorZoneID, alarmLevel, sensorValue);
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
                    //alert("먼저 알람을 선택하세요.");
                    this.showConfirmDialog("에러", ["먼저 알람을 선택하세요."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                }
                else {
                    SensorSimulatorController.clearAlarm(selectedAlarm.sensorType, selectedAlarm.sensorTagID, selectedAlarm.sensorZoneIDs);
                }
            }

            this.setState({ selectedAlarm: null });
        }
    }

    get3LevelAlarmRange() {
        const sensor = this.state.selectedSensor;
        // 이 값이 1이면 max보다 큰 값일때 4단계 알람이 된다.
        // 이 값이 0이면 min보다 작은 값일때 4단계 알람이 된다.
        // 이 값이 2이면 중간 값을 기준으로 양방향으로 멀어질때 4단계 알람이 된다.
        let direction = SensorSimulator.Positive;
        this.alarmRange = [null, null, direction];

        if (!sensor) {
            return "";
        }

        let min = null, max = null;
        //let min2 = null, max2 = null;

        const materialAlarmType = this.state.materialAlarmTypes[sensor.materialType];

        if (materialAlarmType) {
            if ((materialAlarmType.min1 === 0 || materialAlarmType.min1) && (materialAlarmType.max1 === 0 || materialAlarmType.max1) && (materialAlarmType.direction === 0 || materialAlarmType.direction)) {
                min = materialAlarmType.min1;
                max = materialAlarmType.max1;
                direction = materialAlarmType.direction;

                if ((materialAlarmType.min2 === 0 || materialAlarmType.min2) && (materialAlarmType.max2 === 0 || materialAlarmType.max2)) {
                    min = [min, max];
                    max = [materialAlarmType.min2, materialAlarmType.max2];
                }

                this.alarmRange = [min, max, direction];

                if (min !== null) {
                    if (direction === SensorSimulator.Both) {
                        //return "3단계(경계) 알람범위 : " + min[0] + " ~ " + min[1] + " 또는 " + max[0] + " ~ " + max[1];
                        return "4단계(심각) 알람범위 : " + min[0] + " 미만 " + max[1] + " 초과";
                    }
                    else {
                        //return "3단계(경계) 알람범위 : " + min + " ~ " + max;
                        if (direction === SensorSimulator.Positive) {
                            return "4단계(심각) 알람범위 : " + max[1] + " 초과";
                        }

                        if (direction === SensorSimulator.Negative) {
                            return "4단계(심각) 알람범위 : " + min[0] + " 미만";
                        }
                    }
                }
            }
        }

        /*if (this.state.currentSensorType === SdmsResource.AtmosphereData.group) {
            if (sensor.materialType === SdmsResource.materialType.Dust_PM2) {
                min = 36;
                max = 75;
            }
            else if (sensor.materialType === SdmsResource.materialType.Dust_PM10) {
                min = 81;
                max = 150;
            }
            else if (sensor.materialType === SdmsResource.materialType.H2S) {
                min = 21;
                max = 60;
            }
            else if (sensor.materialType === SdmsResource.materialType.NH3) {
                min = 1001;
                max = 3000;
            }
            else if (sensor.materialType === SdmsResource.materialType.VOC) {
                min = 801;
                max = 2000;
            }
            else if (sensor.materialType === SdmsResource.materialType.HCL) {
                min = 4001;
                max = 6000;
            }
            else if (sensor.materialType === SdmsResource.materialType.CL2) {
                min = 4001;
                max = 6000;
            }
        }
        else if (this.state.currentSensorType === SdmsResource.WaterData.group) {
            if (sensor.materialType === SdmsResource.materialType.pH) {
                min = 5;
                max = 5.5;
                min2 = 8;
                max2 = 8.6
                direction = SensorSimulator.Both;

                min = [min, max];
                max = [min2, max2];
            }
            else if (sensor.materialType === SdmsResource.materialType.WATER_TEMP) {
                min = 40;
                max = 50;
            }
            else if (sensor.materialType === SdmsResource.materialType.DO) {
                min = 2;
                max = 5;
                direction = SensorSimulator.Negative;
            }
            else if (sensor.materialType === SdmsResource.materialType.Turbidity) {
                min = 0.81;
                max = 0.99;
            }
        }

        this.alarmRange = [min, max, direction];

        if (min !== null) {
            if (direction === SensorSimulator.Both) {
                return "3단계(경계) 알람범위 : " + min[0] + " ~ " + min[1] + " 또는 " + max[0] + " ~ " + max[1];
            }
            else {
                return "3단계(경계) 알람범위 : " + min + " ~ " + max;
            }
        }*/

        return "";
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
                        <input ref={this.refAlarmValue} type="text"></input>
                      </div>
                            <p className={sensor.whiteText} style={{ color: 'black' }}>{this.get3LevelAlarmRange()}</p>
                    </div>
                    </div> {/* sensorTableArea */}

                </div>

                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }

            </>
        );
    }
}
export default SensorSimulator;