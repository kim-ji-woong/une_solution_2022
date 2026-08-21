import React, { Component } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import SDMSResource from '../resource/id';
import ProjectResource from '../../Root/resource/id';
import SDMSMainMenu from './sdmsMainMenu';

import StatusInfo from './popups/statusInfo';
import WeatherInfo from './popups/weatherInfo';
import MiniMap from './popups/miniMap';
import CCTVInfo from './popups/cctvInfo';
import EventDashboard from './popups/eventDashboard';
import InitialSituationManagement from './popups/initialSituationManagement';
import Event from './popups/event';
import EventMemo from './popups/eventMemo';
import NavigationBar from './popups/navigationBar';
import StatusPsmSensorInfo from './popups/statusPsmSensorInfo';

import Store from '../../Root/store';
import {SDMSController} from "../services/sdmsController";

import SdmsResource from "../resource/id";
import SettingResource from '../../Settings/resource/id';

import ConfirmDialog from "../../Common/ui/confirmDialog";
import SettingsStore from "../../Settings/settingsStore";
import {SettingsController} from "../../Settings/services/settingsController";
import {User} from "oidc-client";
import SettingsResource from "../../Settings/resource/id";
import Loader from '../../Common/ui/loader';

class SDMS extends Component {

    static menu = {
        none: null,
        statusInfo: SDMSResource.ID.menu.statusInfo,        // 센서현황
        weatherInfo: SDMSResource.ID.menu.weatherInfo,       // 기상센서 상세정보
        miniMap: SDMSResource.ID.menu.miniMap,              // 미니맵
        cctvInfo: SDMSResource.ID.menu.cctvInfo,            // CCTV 영상정보
        event: SDMSResource.ID.menu.event,                  // 이벤트 현황
        eventMemo: SDMSResource.ID.menu.eventMemo,          // 이벤트 메모
        simulation: SDMSResource.ID.menu.simulation,        // 시뮬레이션
        statusPsmSensorInfo: SDMSResource.ID.menu.statusPsmSensorInfo,        // 대기센서 상세정보
        
    }

    constructor(props) {
        super(props);

        this.state = {
            visiblePopups: {},
            popupLayer: {
                statusInfoZIndex: 0,
                weatherInfoZIndex: 0,
                miniMapZIndex: 0,
                cctvInfoZIndex: 0,
                eventZIndex: 0,
                eventMemoZIndex: 0,
                statusPsmSensorInfoZIndex: 0,
                loading: false,
            },
            
            popupState: {},
            visibleSensorTypes: this.initVisibleSensorTypes(),

            cctvList: [],
            cctvIds: "",

            sensorList: null,
            selectedSensor: null,
            selectedSensorType: null,

            sensorAlarms: Store.getState().sensorAlarm,
            selectedAlarm: null,

            externalSensors: null,
            externalSensorTypes: null,
            externalMaterials: null,
            externalSensorGIS: null,
            externalPOIInfo: null,

            showEventDashboard: false,               // 이벤트 대시보드 팝업 default = false;
            showInitialSituationManagement: false,   // 초기상황 전파관리 팝업
            
            idleTime: null,
            moveDisplayAlarm: SettingsResource.moveDisplayAlarm.lastAlarm,

            firstAlarmTrigger: true,
            
            confirmMessage: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            },
            
            alarmSound: false,
            isLoading: false,
        }
        const ws = this.props.getWebSocket();
        if (ws && ws.getSDMS() === null) {
            ws.setSDMS(this);
        }

        this.wsMgr = ws;
        
        Store.subscribe(function () {
            
            const data = Store.getState();
            
            this.changeAlarm(Store.getState());
            
            if (data.actionType === 'SENSOR_LIST') {
                this.subscribeSensorList(Store.getState().sensorList);
            }
            
        }.bind(this));
        
        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();
            
            if (data.actionType === 'SETTINGS') {
                this.setSettings(data);
            } else if (data.actionType === 'RESET_POPUP') {
                this.resetPopupState(data.popupState);
            }
            
        }.bind(this));
        
        this.mounted = true;

        this.setVisiblePopups = this.setVisiblePopups.bind(this);
        this.setActiveDragPopup = this.setActiveDragPopup.bind(this);
        this.getPopupState = this.getPopupState.bind(this);
        this.setPopupState = this.setPopupState.bind(this);
        
        this.tempExternalSensors = null;
        this.tempExternalSensorTypes = null;
        
        this.initSDMS();
        this.initSettings();
        
        this.isLoading = false;
        this.loadingDegree = 0;
    }
    
    componentDidMount() {
        this.props.menuEvent.handler = this.onSelectMenu;
        this.props.menuEvent.onClickLogo = this.onClickLogo;
        
        // 처음부터 뜰 메뉴
        var visiblePopups = this.state.visiblePopups;
        visiblePopups[SDMS.menu.statusInfo] = true;
        visiblePopups[SDMS.menu.weatherInfo] = false;
        visiblePopups[SDMS.menu.miniMap] = true;
        visiblePopups[SDMS.menu.cctvInfo] = false;
        visiblePopups[SDMS.menu.event] = true;
        visiblePopups[SDMS.menu.simulation] = true;
        visiblePopups[SDMS.menu.statusPsmSensorInfo] = false;
        visiblePopups[SDMS.menu.eventMemo] = false;
        
        // 팝업 상태 일괄 획득
        this.getPopupState();
        
        this._setState({ visiblePopups: visiblePopups, isLoading: false });
        
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _setState = (state, callback) => {
        if (this.mounted) {
            this.setState(state, callback);
        }
    }
    
    setSettings = (settings) => {

        let idleTime = settings.idleTime.split(";"); // [0] : 시간, [1] : 사용여부
        let moveDisplayAlarm = settings.moveDisplayAlarm; // 알람 이동 옵션  0 or 3 - 현재화면 or 마지막 알람 화면으로 이동
        
        moveDisplayAlarm = parseInt(moveDisplayAlarm) !== 0 ? 3 : 0;
        
        this._setState({ idleTime: idleTime, moveDisplayAlarm: moveDisplayAlarm });
    }

    setVisiblePopups(menu, visible) {

        const menus = this.state.visiblePopups;
        const menus_old = Object.assign({}, this.state.visiblePopups);
        // "대기센서 상세정보"
        //
        if (visible === undefined) {
            if (menu instanceof Array) {
                const menuCount = menu.length;

                for (let i = 0; i < menuCount; i++) {
                    const menuItem = menu[i];
                    menus[menuItem] = !menus[menuItem];
                }
            }
            else {
                menus[menu] = !menus[menu];
            }
        }
        else {
            if (menu instanceof Array) {
                const menuCount = menu.length;

                for (let i = 0; i < menuCount; i++) {
                    const menuItem = menu[i];
                    menus[menuItem] = visible;
                }
            }
            else {
                menus[menu] = visible;
            }
        }

        this._setState({ visiblePopups: menus })
        
        // 팝업 닫히는 애니메이션 효과
        this.hideAnimatePopup(menus, menus_old, () => {
            this._setState({ visiblePopups: menus })
        });
    }

    onSelectMenu = (menu, param) => {
        if (menu === SDMSMainMenu.Menu_Show_Menu_Area) {
            this._setState({ showMenuArea: !this.state.showMenuArea });
        }
        else if (menu === SDMSMainMenu.Menu_Refresh) {
            this._setState({ showMenuArea: this.state.showMenuArea });
        }
        else if (
            menu === SDMSResource.ID.menu.statusInfo ||
            menu === SDMSResource.ID.menu.miniMap ||
            menu === SDMSResource.ID.menu.weatherInfo ||
            menu === SDMSResource.ID.menu.cctvInfo ||
            menu === SDMSResource.ID.menu.event ||
            menu === SDMSResource.ID.menu.simulation ||
            menu === SDMSResource.ID.menu.statusPsmSensorInfo ||
            menu === SDMSResource.ID.menu.eventMemo
        )
        {
            this.setVisiblePopups(menu);
        }
        else {
            this.processMenu(menu, param);
        }
    }

    async processMenu(menu, param) {
        const cmd = {};
        cmd.menu = menu;
        cmd.menuParameter = param;
        /*cmd.mode = this.state.command.mode;
        cmd.modeParameter = this.state.command.modeParameter;*/
        if (menu === SDMSMainMenu.Menu_Add_Alarm) {
            this._setState({ command: cmd, alarmSound: true });
        }
        else if (menu === SDMSMainMenu.Menu_Move_POI) {
            this._setState({ command: cmd, selectedPOI: null });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_POI) {
            if (param && param.length === 3) {
                this._setState({ command: cmd, selectedPOI: [param[1], param[2], param[0]] });
            }
            else {
                this._setState({ command: cmd });
            }
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_Facility)
        {
            this._setState({ command: cmd, selectedPOI: [param[1], param[0]] });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_BuildingGroup && param && Array.isArray(param) && param.length > 0 && !param[0]) {
            // 외부영역 항목에서 이동 버튼을 눌렀을때
            this.onClickLogo();
        }
        else {
            this._setState({ command: cmd });
        }
    }

    onClickLogo = () => {

        // 로고 클릭시 기본뷰로 가야함
        // if (this.wsMgr) {
        //     this.wsMgr.moveCameraToTarget(0);
        // }

    }

    changeAlarm = async (storeValue) => {
        const alarms = storeValue.sensorAlarm;
        this.changeAlarmMessage(alarms);

        if (storeValue && storeValue.actionType !== 'SENSOR_ALARM')
            return;

        const orgAlarms = this.state.sensorAlarms;

        var menus = this.state.visiblePopups;

        let selectedAlarm = null;
        let isSame = false;
        if (alarms && alarms.length > 0) {
            selectedAlarm = alarms[0];
        }

        let alarmType = "";
        let alarmCCTV = "";
        
        let sensorType = null;

        if (selectedAlarm && selectedAlarm.isAlarm) {
            if (selectedAlarm.sensorZoneID < 1000000) {
                alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                menus[SDMS.menu.event] = true;
                menus[SDMS.menu.statusInfo] = true;
                
                let bOpenSensorInfoPop = false;
                sensorType = await this.getSensorTypeFromZoneID(selectedAlarm.zoneID);
                
                if (sensorType) {
                    if (sensorType.id === SDMSResource.SensorType.atmosphere ||
                        sensorType.id === SDMSResource.SensorType.kWeather) {
                        menus[SDMS.menu.statusPsmSensorInfo] = true;
                    }
                    else if (sensorType.id === SDMSResource.SensorType.weather)
                        menus[SDMS.menu.weatherInfo] = true;
                    
                    // 알람 발생시 selectedAlarm => selectedSensor
                    this.setSelectedSensor(selectedAlarm.zoneID, sensorType);
                }
                
            }
        }

        if (selectedAlarm === null || !selectedAlarm.isAlarm) { // 알람 없음
            this.hideAlarm();
        }
        else {
            let moveToAlarm = await this.checkAlarm(orgAlarms, alarms, true, alarmCCTV);
            await this.checkAlarm(alarms, orgAlarms, false, alarmCCTV);

            // 2024 01 11 3D 이동 옵션에 따라 이벤트 후 selectedAlarm 변경 해야함 
            if (moveToAlarm === null || moveToAlarm === undefined) {
                [moveToAlarm, isSame] = this.getAlarmToDisplay(this.state.selectedAlarm, selectedAlarm, this.state.moveDisplayAlarm);
            }

            if (moveToAlarm) {
                selectedAlarm = moveToAlarm;
            }
        }

        if (selectedAlarm === null) { // 알람 없음
            this._setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, cctvList: null, alarmSound: false });
        }
        else { // 알람 있음
            if (selectedAlarm?.isAlarm) { // 알람 On
                // 알람 On시 이벤트 팝업 띄우기
                menus[SDMS.menu.event] = true;
                // 해당 알람에 해당하는 센서 상세정보 창 띄우기 , 선택된 센서 변경
                this.showAlarm(selectedAlarm, null);
                this.setSelectedSensor(selectedAlarm.zoneID, sensorType); // zoneID, sensorType
                this._setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, /*alarmSound: selectedAlarm.isAlarm,*/ });
                
                // 알람 발생시 3D 이동
                this.sendShowAlarm(selectedAlarm);
                
                this.setVisibleDashboard(true);
            } // 알람 Off
            else {
                this._setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, /*alarmSound: selectedAlarm.isAlarm*/ });
                this.setVisibleDashboard(true);
            }
        }
        
        // WebSocket Alarm
        
    }
    
    sendShowAlarm = (alarm) => {
        console.log(alarm);
        
        
    }
    
    onResponseSelectPOI = async (spaceID, poiID) => { /* spaceID = 빌딩 번호 ( 0 ~ 8 ) , poiID = ExternalSensorsID */
        let sensorID = null;
        let sensorType = null;
        
        let isOutdoor = false;
        if (spaceID === 0) {
            isOutdoor = true;
        }
        
        const externalSensors = this.state.externalSensors;
        if (!externalSensors) {
            return;
        }
        
        for (const sensor of externalSensors) {
            console.log(sensor);
        }
        
        await this.setSelectedSensor(sensor.id, sensorType);
    }
    
    showAlarm = (alarm, cctv) => {
        const [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm] = SDMS.getAlarmInfo(alarm);
        this.onSelectMenu(SDMSMainMenu.Menu_Show_Alarm, [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm]);
    }

    static getAlarmInfo(alarm) {
        var sensorType = SDMS.getFacilityType(alarm.facilityType);
        return [alarm.zoneID, sensorType, alarm.orgSensorID, alarm.alarmDepth, alarm.isAlarm];
    }

    static getFacilityType(facilityType) {
        let sensorType = SDMSResource.facilityType.ETC;
        
        return sensorType;
    }

    getAlarmToDisplay = (prevAlarm, selectedAlarm, displayMode) => {
        //0 : 현재대로 - 현재 알람 유지
        //1 : 첫번째 알람 화면으로 이동 - 최초 발생
        //2 : 마지막 알람 화면으로 이동 - 최근 발생

        const alarms = this.state.sensorAlarms;
        let prevAlarmHistoryID = prevAlarm;

        if (alarms === null || alarms === undefined || alarms?.length === 0) {
            return[null, false];
        }

        if (prevAlarm !== null && prevAlarm !== undefined) {
            prevAlarmHistoryID = prevAlarm.sensorZoneHistoryID;
        } // 현재 유지시 (0) selectedAlarm

        if (displayMode === SettingResource.moveDisplayAlarm.currentDisplay) {
            return [prevAlarm, true];
        }

        if (displayMode === SettingResource.moveDisplayAlarm.moveAlarm) {
            return [alarms[alarms?.length - 1], false];
        }

        if (displayMode === SettingResource.moveDisplayAlarm.firstAlarm) {

            let activeAlarms = [];
            let activeLength = null;
            for (let i = 0; i < alarms.length; i++) {
                const alarm = alarms[i];
                if (alarm.isAlarm) {
                    activeAlarms.push(alarm);
                }
            }
            activeLength = activeAlarms.length;
            return [activeAlarms[activeLength - 1], false];

        }

        if (displayMode === SettingResource.moveDisplayAlarm.lastAlarm) {
            return [selectedAlarm, false];
        }
        
        return [null, false];

    }

    hideAlarm() {
        // if (this.wsMgr) {
        //     this.wsMgr.hideAlarm();
        // }
        this.onSelectMenu(SDMSMainMenu.Menu_Hide_Alarm);
    }

    changeAlarmMessage(alarms) {
        if (!alarms) {
            return;
        }

        const target = "에서";
        const targetLength = target.length;

        for (const alarm of alarms) {
            if (alarm.facilityType === SdmsResource.facilityType.ETC) {
                const [sensorGroupData,] = this.getAlarmSensor(alarm);

                if (sensorGroupData) {
                    const index1 = alarm.message.indexOf("에서");
                    const index2 = alarm.message.indexOf("신호가");

                    if (index1 > 0 && index2 > index1) {
                        const str1 = alarm.message.substring(0, index1 + targetLength);
                        const str2 = alarm.message.substring(index2);
                        alarm.message = str1 + " " + sensorGroupData.group + " " + str2;
                    }
                }
            }
        }
    }

    makeAlarmSensors() {
        const _sensors = {
            fire: {}
        };
        const sensorList = { ...this.state.sensorList };
        
        if (!sensorList) {
            return;
        }

        for (const sensorTypeName in sensorList) {
            const typeSensors = {};
            _sensors[sensorTypeName] = typeSensors;

            if (sensorTypeName === "atmosphere") {
                typeSensors.data = SdmsResource.AtmosphereData;
            }
            else if (sensorTypeName === "kWeather"){
                typeSensors.data = SdmsResource.KWeatherData;
            }
            else {
                continue;
            }

            const sensors = sensorList[sensorTypeName];

            for (const sensorGroup of sensors) {
                for (const sensor of sensorGroup.sensors) {
                    typeSensors[sensor.id] = sensor;
                }
            }
        }

        this.alarmSensors = _sensors;
    }

    getAlarmSensor = (alarm) => {
        const alarmSensors = { ...this.alarmSensors };

        for (const sensorTypeName in alarmSensors) {
            const sensorGroup = alarmSensors[sensorTypeName];
            const sensor = sensorGroup[alarm.orgSensorID];

            if (sensor) {
                return [sensorGroup.data, sensor];
            }
        }

        return [null, null];
    }

    getAlarmTypeFromMessage(message) {
        const index = message.indexOf("에서");

        if (index < 0) {
            return "";
        }

        const index2 = message.lastIndexOf("탐지");

        if (index2 < 0) {
            return "";
        }

        let alarmType = message.substring(index + 2, index2).trim();

        if (alarmType.endsWith("이") || alarmType.endsWith("가")) {
            alarmType = alarmType.substring(0, alarmType.length - 1);
        }

        return alarmType;
    }

    async checkAlarm(alarms, targetAlarms, isChg, targetCCTVMenu) {
        var returnAlarm = [];

        if (alarms === null || alarms === undefined || alarms.length === 0) {
            for (let i = 0; i < targetAlarms.length; i++) {
                if ((isChg && targetAlarms[i].isAlarm) || (!isChg && !targetAlarms[i].isAlarm)) {
                    returnAlarm.push(targetAlarms[i]);
                }
            }
        }
        else {
            if (targetAlarms !== null && targetAlarms !== undefined) {
                for (let i = 0; i < targetAlarms.length; i++) {
                    if (targetAlarms[i].isAlarm) {
                        let isUpdate = true;
                        for (let j = 0; j < alarms.length; j++) {
                            if (targetAlarms[i].sensorZoneHistoryID === alarms[j].sensorZoneHistoryID) {
                                if (isChg) {
                                    // 알람 발생
                                    // alarms : org alarm
                                    // targetAlarms: new alarm
                                    //if (targetAlarms[i].isAlarm) {
                                    // 같은 Equipzone에 알람이 추가됐나 ?
                                    if (targetAlarms.length - 1 >= j &&
                                        alarms[j].alarmSensorZoneIDs.length < targetAlarms[j].alarmSensorZoneIDs.length) {
                                        isUpdate = true;
                                    }
                                    else {
                                        isUpdate = false;
                                    }
                                    //}
                                    //else {
                                    //    isUpdate = false;
                                    //}
                                }
                                else {
                                    // 알람 해제
                                    // alarms : new alarm
                                    // targetAlarms: org alarm
                                    if (!alarms[j].isAlarm) { // 알람해제 상태인가?
                                        //if (targetAlarms[i].isAlarm) { // 이전에는 알람중 이었나?
                                        isUpdate = true;
                                        //}
                                        //else {
                                        //    isUpdate = false;
                                        //}
                                    }
                                    else {
                                        // 같은 Equipzone에 알람이 해지됐나 ?
                                        if (alarms[j].alarmSensorZoneIDs.length < targetAlarms[i].alarmSensorZoneIDs.length) {
                                            isUpdate = true;
                                        }
                                        else {

                                            // 알람 진행중
                                            isUpdate = false;
                                        }
                                    }
                                }

                                break;
                            }
                        }

                        if (isUpdate) {
                            returnAlarm.push(targetAlarms[i]);
                        }
                    }
                }
            }
        }

        /*
        * 0 : 현재대로
        * 1 : 첫번째 알람 화면으로 이동
        * 2 : 마지막 알람 화면으로 이동
        */      
        const moveToOption = this.state.moveDisplayAlarm;
        let moveToSensor = new Array();

        for (let k = 0; k < returnAlarm.length; k++) {
            for (let i = 0; i < returnAlarm[k].alarmSensorZoneIDs.length; i++) {
                const sensorZoneID = returnAlarm[k].alarmSensorZoneIDs[i];
                if (sensorZoneID < 1000000) {

                    let nOrgSensorID = -1;

                    const sensor = this.getOrgSensor(returnAlarm[k].facilityType, sensorZoneID)
                    if (!sensor) {
                        continue;
                    }

                    if (isChg) { // 알람 발생
                        this.addAlarm(returnAlarm[k].zoneID, returnAlarm[k].facilityType, nOrgSensorID, returnAlarm[k].alarmDepth, returnAlarm[k].equipZoneID, targetCCTVMenu);
                        //}
                        if (moveToOption === SettingResource.moveDisplayAlarm.currentDisplay) {

                        }
                        else if (moveToOption === SettingResource.moveDisplayAlarm.moveAlarm) {
                            moveToSensor.push(returnAlarm[k]);
                        }
                        else if (moveToOption === SettingResource.moveDisplayAlarm.firstAlarm) {
                            if (k === 0) {
                                moveToSensor.push(returnAlarm[k]);
                            }
                        }
                        else if (moveToOption === SettingResource.moveDisplayAlarm.lastAlarm) {
                            if (k == returnAlarm.length - 1) {
                                moveToSensor.push(returnAlarm[k]);
                            }
                        }
                    }
                    else { // 알람 해제
                        this.removeAlarm(returnAlarm[k].facilityType, nOrgSensorID, returnAlarm[k].alarmDepth);
                    }
                }
                else {
                    // 수동 신고
                    if (isChg) {
                        if (moveToOption !== SettingResource.moveDisplayAlarm.currentDisplay) {
                            moveToSensor.push(returnAlarm[k]);
                        }
                    }
                    else {
                        this.removeAlarm(returnAlarm[k].facilityType, -1, returnAlarm[k].alarmDepth);
                    }
                }
            }
        }

        let selectedAlarm = null;
        if (isChg) {
            // 3D 이동할 알람
            for (let i = 0; i < moveToSensor.length; i++) {
                for (let j = 0; j < moveToSensor[i].alarmSensorZoneIDs.length; j++) {
                    const sensorZoneID = moveToSensor[i].alarmSensorZoneIDs[j];
                    if (sensorZoneID < 1000000) {

                        let nOrgSensorID = -1;

                        if (SDMSResource.isSVMSSensorType(moveToSensor[i].facilityType)) {
                            const [orgSensorID, isAlarmStatus] = await SDMSController.getOrgSensorID(sensorZoneID);
                            if (!orgSensorID || orgSensorID === undefined) {
                                continue;
                            }

                            nOrgSensorID = orgSensorID;
                        }
                        else {
                            const sensor = this.getOrgSensor(moveToSensor[i].facilityType, sensorZoneID);
                            if (!sensor) {
                                continue;
                            }

                            nOrgSensorID = sensor.id;
                        }

                        this.processMenu(SDMSMainMenu.Menu_Show_Alarm, [moveToSensor[i].zoneID, SDMS.getFacilityType(moveToSensor[i].facilityType), nOrgSensorID, moveToSensor[i].alarmDepth, moveToSensor[i].isAlarm]);
                        //this.moveToSensor(moveToSensor[i].zoneID, moveToSensor[i].facilityType, nOrgSensorID);
                        this.addAlarm(moveToSensor[i].zoneID, moveToSensor[i].facilityType, nOrgSensorID, moveToSensor[i].alarmDepth, moveToSensor[i].equipZoneID, targetCCTVMenu);
                    }
                    else {
                        //const alarmType = this.getAlarmTypeFromMessage(moveToSensor[i].message);
                        //const alarmCCTV = this.showAlarmCCTV(alarmType, moveToSensor[i]);
                        this.showAlarm(moveToSensor[i], null);
                    }
                    selectedAlarm = moveToSensor[i];
                }
            }
        }

        return selectedAlarm;
    }

    removeAlarm(facilityType, orgSensorID, alarmDepth) {
        var sensorType = SDMS.getFacilityType(facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_Remove_Alarm, [sensorType, orgSensorID, alarmDepth]);
    }

    addAlarm(zoneID, facilityType, orgSensorID, alarmDepth, equipZoneID, targetCCTVMenu) {
        var sensorType = SDMS.getFacilityType(facilityType);
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID

        this.onSelectMenu(SDMSMainMenu.Menu_Add_Alarm, [zoneID, sensorType, orgSensorID, alarmDepth]);

    }

    getOrgSensor(facilityType, sensorZoneID) {
        if (SDMSResource.isETCSensorType(facilityType)) {
            // if (this.state.sensorList.etcSensors) {
            //     const sensorLength = this.state.sensorList.etcSensors.length;
            //     for (let i = 0; i < sensorLength; i++) {
            //         const sensor = this.state.sensorList.etcSensors[i];
            //         if (sensor.sensorZoneID === sensorZoneID) {
            //             return sensor;
            //         }
            //     }
            // }
            const sensorID = sensorZoneID;
            if (this.state.sensorList) {
                for (const key in this.state.sensorList) {
                    const list = this.state.sensorList[key];
                    for (let i = 0; i < list.length; i++) {
                        const sensors = list[i].sensors;
                        for (let j = 0; j < sensors.length; j++) {
                            if (sensors[j].id === sensorID) {
                                return sensors[j];
                            }
                        }
                    }
                }
            }
        }

        return null;
    }
    
    initSettings = async () => {
        
        let userInfo = await ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;
        
        // 설정 불러오기
        const [result, message] = await SettingsController.requestSettings(userInfo.id);
        if (result === null || result === undefined) {
            return;
        }

        // 단축키 적용, sdms 회전 대기시간 적용
        let shortcutKey = result.shortcutKey;
        let idleTime = result.idleTime;
        let moveDisplayAlarm = result.moveDisplayAlarm;
        let turnStart = result.turnStart;
        let useAlarmTurn = result.useAlarmTurn;
        let weatherState = result.weatherState;
        let weatherSoundState = result.weatherSoundState
        SettingsStore.dispatch({ type: 'SETTINGS', idleTime, moveDisplayAlarm, turnStart, useAlarmTurn, weatherState, weatherSoundState });

        const [rotationTime, use] = this.getIdleTime(idleTime);

        // Idle Rotation Time Send to 3D
        // if (this.wsMgr) {
        //     this.wsMgr.setWeatherOption(weatherState, weatherSoundState);
        //
        //     if (rotationTime !== null) {
        //         this.wsMgr.sendAutoRotationTime(rotationTime, use);
        //     }
        // }

        if (this.state.popupState === null || this.state.popupState === undefined || this.state.popupState === {} ||
            this.isEmptyObject(this.state.popupState)) {
            this.getPopupState();
        }
    }
    
    isEmptyObject(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    
    initSDMS = async () => {
        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList();
        
        const externalSensors = await SDMSController.requestExternalSensors();
        
        const externalSensorTypes = await SDMSController.requestExternalSensorTypes();
        
        const externalMaterials = await SDMSController.requestExternalMaterials();
        
        const externalSensorGIS = await SDMSController.requestExternalSensorGIS();
        
        const externalPOIInfo = await SDMSController.requestExternalPOIInfo();
        
        if (externalMaterials !== null) {
            externalMaterials.sort((a,b) => (a.materialID - b.materialID));
        }
        
        this._setState({ 
            buildingGroupList: buildingGroupList, 
            outdoorZones: outdoorZones, 
            externalSensors: externalSensors,
            externalSensorTypes: externalSensorTypes,
            externalMaterials: externalMaterials,
            externalSensorGIS: externalSensorGIS,
            externalPOIInfo: externalPOIInfo
        });
    }


    subscribeSensorList = (storeValue) => {
        
        let sensorList = {};
        
        if (storeValue.atmospheres !== null && storeValue.atmospheres !== undefined) {
            sensorList[SDMSMainMenu.Atmosphere_Sensor] = storeValue.atmospheres;
        }
        
        if (storeValue.weathers !== null && storeValue.weathers !== undefined) {
            sensorList[SDMSMainMenu.Weather_Sensor] = storeValue.weathers;
        }
        
        if (storeValue.kWeathers !== null && storeValue.kWeathers !== undefined) {
            sensorList[SDMSMainMenu.KWeather_Sensor] = storeValue.kWeathers;
        }
        
        this._setState({ sensorList });
    }

    // SDMS 컴포넌트 마운트 시, 저장된 위치 값 호출
    async getPopupState() {
        // 세션에서 DB의 유저 key값 획득, 전체 팝업 좌표를 호출한다.

        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        const result = await SDMSController.requestGetOption(userInfo.id, 'popup');
        /*
         * propertyValue1 - x좌표 (pos)
         * propertyValue2 - y좌표 (pos)
         * propertyValue3 - height (size)
         * propertyValue4 - width (size)
        */
        if (typeof result !== 'undefined' && result[0] && result[1] != null) {
            var popupState = {}
            for (var i = 0 ; i < result[1].length ; i++) {
                popupState[result[1][i].subCategory] = {
                    id: result[1][i].id,
                    x: result[1][i].propertyValue1,
                    y: result[1][i].propertyValue2,
                    height: result[1][i].propertyValue3,
                    width: result[1][i].propertyValue4
                };
            }
            this._setState({ popupState: popupState });
            this.isLoading = true;
        }
    }
    
    resetPopupState = (popupState) => {
        if (popupState === null || popupState === undefined) {
            return;
        }

        this._setState({ popupState });
    }

    getIdleTime = (idleTime) => {
        if (idleTime === null || idleTime === undefined) {
            return null;
        }

        const extractedString = idleTime.split(';');
        const value = extractedString[0];
        const use = extractedString[1];
        const n_idleTime = parseInt(value);
        const n_use = parseInt(use);

        return [n_idleTime, n_use];
    }

    // 팝업 닫히는 애니메이션 효과
    hideAnimatePopup(menus, menus_old, callback) {

        let hideIDs = "";

        if (menus !== null && menus !== undefined &&
            menus_old !== null && menus_old !== undefined) {
            let target = null;
            let cssLeft = null;
            let cssTop = null;

            for (let key in menus) {
                const visibleOld = menus_old[key];
                const visibleNew = menus[key];
                let hideID = null;

                if (visibleNew === false && (visibleOld === undefined || visibleOld !== visibleNew)) {
                    // 기존에 존재하지 않는 팝업 또는 상태 변화가 생긴 팝업
                    if (key === SDMS.menu.event && this.state.sensorAlarms !== null && this.state.sensorAlarms?.length > 0) {
                        hideID = "#" + SDMSResource.popupLayer.event;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.event);
                    }
                    else if (key === SDMS.menu.statusInfo) {
                        hideID = "#" + SDMSResource.popupLayer.statusInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.statusInfo);
                    }
                }

                if (hideID !== null) {
                    if (hideIDs === "") {
                        hideIDs = hideID;
                    } else if (hideIDs !== "") {
                        hideIDs = hideIDs + ", " + hideID;
                    }

                    if (target !== null && target !== undefined) {
                        const clientRect = target.getBoundingClientRect();
                        cssLeft = clientRect.left;
                        cssTop = clientRect.top;
                    }

                    //break;
                }
            }

            if (hideIDs === "") {
                callback();
            } else if (hideIDs !== "") {
                // 창이 서서히 사라지는 효과
                if (cssLeft !== null && cssTop !== null) {
                    cssLeft = cssLeft + "px";
                    cssTop = cssTop + "px";

                    let hideValue = "80px";

                    $(hideIDs).animate({ opacity: 0, width: hideValue, height: hideValue, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                        $(hideIDs).css("opacity", "0");
                        callback();
                    });
                }
                else {
                    $(hideIDs).animate({ opacity: 0 }, SDMSResource.PopupAniTime, () => {
                        $(hideIDs).css("opacity", "0");
                        callback();
                    });
                }
                
                
            }

        }
        else {
            callback();
        }
    }

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    setActiveDragPopup(popupType) {
        // CCTV 팝업창이 제대로 동작하지 않아 제이쿼리 방식으로 수정 - K.D.R
        for (const key in SDMSResource.popupLayer) {
            const layerName = SDMSResource.popupLayer[key];

            if (layerName === popupType) {
                $("#" + layerName).css({ "z-index": 2 });
            } else {
                $("#" + layerName).css({ "z-index": 0 });
            }

        }
    }

    // 팝업 크기, 위치값 저장
    async setPopupState(popup, state) {
        // setState
        var popupState = this.state.popupState;
        popupState[popup] = state;

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        //DB 전달
        var result = await SDMSController.requestSaveOption(
            state.id,
            userInfo.id,    // UserID
            'popup',        // Category
            popup,          // SubCategory
            state.x,        // PropertyValue1
            state.y,        // PropertyValue2
            state.height,    // PropertyValue3
            state.width    // PropertyValue4
        );

        if (result[0]) {
            popupState[popup].id = result[1][0].id;
            this._setState({ popupState: popupState });
        }
    }

    initVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[SDMSMainMenu.Atmosphere_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.ReductionEquipment_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.EmissionFacilities_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Weather_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.CCTV_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.ZoneName_Sensor] = true;

        return visibleSensorTypes;
    }

    setVisiblePoi = (typeName, visible) => {
        let types = {...this.state.visibleSensorTypes};

        types[typeName] = visible;
        let type = null;

        switch (typeName) {
            case SDMSMainMenu.Atmosphere_Sensor:
                type = 1;
                break;
            case SDMSMainMenu.Weather_Sensor:
                type = 2;
                break;
            case SDMSMainMenu.ReductionEquipment_Sensor:
                type = 3;
                break;
            case SDMSMainMenu.EmissionFacilities_Sensor:
                type = 4;
                break;
            case SDMSMainMenu.CCTV_Sensor:
                type = 5;
                break;
            case SDMSMainMenu.ZoneName_Sensor:
                type = 6;
                break;
            default:
                break;
        }

        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendVisiblePOICategory(type, visible);
            }
        }

        this._setState({visibleSensorTypes: types});
    }
    

    handlePopups = (type, value) => {
        if(type === 'eventDashboard') {
            this._setState({ showEventDashboard: value });
        }
        else if(type === 'initialSituationManagement') {
            this._setState({ showInitialSituationManagement: value });
        }
    }
    
    setSelectedSensor = async (sensorID, sensorType) => {
        let sensorList = this.state.sensorList ? this.state.sensorList : null;
        let buildingGroupList = this.state.buildingGroupList ? this.state.buildingGroupList : null;
        let externalSensors = this.state.externalSensors ? this.state.externalSensors : null;
        let externalSensorTypes = this.state.externalSensorTypes ? this.state.externalSensorTypes : null;
        
        if (sensorList === null || buildingGroupList === null || externalSensors === null || externalSensorTypes === null) {
            //confirmDialog 호출 위치
            if (this.state.firstAlarmTrigger) {
                // 첫 알람리스트 호출시 센서정보가 없을 경우
                sensorList = await SDMSController.requestAllSensors();
                sensorList = sensorList[0];
                buildingGroupList = await SDMSController.requestBuildingGroupList();
                externalSensors = await SDMSController.requestExternalSensors();
                externalSensorTypes = await SDMSController.requestExternalSensorTypes();
            } else {
                return;   
            }
        }

        const sensorAlarms = this.state.sensorAlarms ? this.state.sensorAlarms : null;
        let menu = null;
        let targetSensorList = null;
        if (sensorType.id === SDMSResource.SensorType.atmosphere) {
            targetSensorList = sensorList.atmospheres;
            menu = SDMS.menu.statusPsmSensorInfo;
        } else if (sensorType.id === SDMSResource.SensorType.kWeather) {
            targetSensorList = sensorList.kWeathers;
            menu = SDMS.menu.statusPsmSensorInfo;
        } else if (sensorType.id === SDMSResource.SensorType.weather) {
            targetSensorList = sensorList.weathers;
            menu = SDMS.menu.weatherInfo;
        } 
        
        if (targetSensorList === null || targetSensorList.length === 0) {
            //confirmDialog 호출 위치
            return;
        }
        
        for (let i = 0; i < targetSensorList.length; i++) {
            let targetSensor = targetSensorList[i];
            
            if (targetSensor.zoneID === sensorID) {
                this._setState({ 
                    selectedSensor: targetSensor,
                    selectedSensorType: sensorType,
                    firstAlarmTrigger: false
                }, () => this.setVisiblePopups(menu, true)); // 선택된 센서 설정 후 팝업창 켜기
                break;
            }
        }
    }
    
    moveToBuilding = (buildingID) => { // === MoveToSpace
        if (this.wsMgr) {
            if (!this.wsMgr.connected) { // WebSocket 연결이 끊겼을 경우
                return;
            }
            
            if (buildingID === null || buildingID === undefined || buildingID === 20000) {
                // 실외 3D뷰 이동
                if (this.wsMgr) {
                    if (this.wsMgr.connected) {
                        this.wsMgr.sendMoveToSpace(0);
                    }
                }
                return;
            }
            
            const externalSensorGIS = this.state.externalSensorGIS;
            if (externalSensorGIS === null || externalSensorGIS === undefined) {
                return;
            }
            
            let targetID = null;
            
            for (let i = 0; i < externalSensorGIS.length; i++) {
                const gis = externalSensorGIS[i];
                if (gis.id === buildingID) {
                    targetID = gis.sensorID;
                }
            }
            
            if (this.wsMgr) {
                if (this.wsMgr.connected) {
                    this.wsMgr.sendMoveToSpace(targetID);
                }
            }
        }
    }
    
    getAlarmLevelFromSensor = (sensor) => {
        let alarmLevel = 1;
        
        const externalMateirials = this.state.externalMaterials;
        
        if (externalMateirials === null || externalMateirials === undefined) {
            return 0;
        }
        
        let targetMaterial = externalMateirials.find(material => material?.materialID === sensor.sensorType);
        
        if (targetMaterial === null || targetMaterial === undefined) {
            return 0;
        }
        
        const direction = targetMaterial?.direction;
        const value = parseFloat(sensor.value) ? parseFloat(sensor.value) : 0;
        
        if (direction === 1) { // 임계치 정방향
            if (value > targetMaterial.max1) {
                alarmLevel = 2;
            }
            
            if (value > targetMaterial.min2) {
                alarmLevel = 3;
            }
            
            if (value > targetMaterial.max2) {
                alarmLevel = 4;
            }
            
        } else if (direction === 3) { // 임계치 분포형
            if (targetMaterial.info !== null && targetMaterial.info !== undefined) {
                const info = targetMaterial.info;
                let thresholdInfo = JSON.parse(targetMaterial.info);

                let strArrAlarmLevel1 = thresholdInfo[1].split(",");
                let strArrAlarmLevel2 = thresholdInfo[2].split(",");
                let strArrAlarmLevel3 = thresholdInfo[3].split(",");
                
                if (value < parseFloat(strArrAlarmLevel1[0])) {
                    alarmLevel = 2;
                    if (value < parseFloat(strArrAlarmLevel2[0])) {
                        alarmLevel = 3;
                        if (value < parseFloat(strArrAlarmLevel3[0])) {
                            alarmLevel = 4;
                        }
                    }
                } else if (value > parseFloat(strArrAlarmLevel1[1])) {
                    alarmLevel = 2;
                    if (value > parseFloat(strArrAlarmLevel2[1])) {
                        alarmLevel = 3;
                        if (value > parseFloat(strArrAlarmLevel3[1])) {
                            alarmLevel = 4;
                        }
                    }
                }
            }
        }
        
        return alarmLevel;
    }

    getSensorTypeFromZoneID = async (zoneID) => {
        let sensorType = null;
        
        let externalSensorTypes = this.state.externalSensorTypes;
        let externalSensors = this.state.externalSensors;
        
        if (!externalSensorTypes || !externalSensors) {
            // 처음 실행시 state === undefined
            if (this.tempExternalSensorTypes === null || this.tempExternalSensorTypes === undefined) {
                externalSensorTypes = await SDMSController.requestExternalSensorTypes();
                externalSensors = await SDMSController.requestExternalSensors();
                
                // api 호출 절감을 위한 임시 객체 생성
                this.tempExternalSensorTypes = externalSensorTypes;
                this.tempExternalSensors = externalSensors;
            } else {
                // 임시 객체 삭제
                externalSensorTypes = this.tempExternalSensorTypes;
                externalSensors = this.tempExternalSensors;
            }
        } else {
            // preventing memory leak
            if (this.tempExternalSensorTypes || this.tempExternalSensors) {
                this.tempExternalSensorTypes = null;
                this.tempExternalSensors = null;
            }
        }
        
        const sensor = externalSensors.find(sensor => sensor.zoneID === zoneID);
        const type = sensor.sensorType;
        
        sensorType = externalSensorTypes.find(sensorType => sensorType.id === type);
        
        return sensorType;
    }

    showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.type = type;
        confirmMessage.messages = messages;
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

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }
    
    onClickMalfunction = (alarm) => {
        
        if (alarm.sensorZoneHistoryID !== this.state.selectedAlarm.sensorZoneHistoryID) {
            this.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["알람 선택이 잘못되었습니다.", "관리자에게 문의하세요."], ["확인"], this.onCloseConfirmDialog);
        }
        
        if (alarm.sensorZoneID >= 1000000) {
            this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["수동 신고한 알람을 종료하시겠습니까?"], ["상황 종료", "취소"], this.onMalfunction);
        } 
        else {
            this.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["탐지된 알람을 종료하시겠습니까?"], ["상황 종료", "오작동", "취소"], this.onMalfunction);
        }
    }
    
    onMalfunction = async (index) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;
        
        const alarm = this.state.selectedAlarm;
        
        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined) {
            return this.showConfirmDialog(ProjectResource.dialogTypes.Error, ["사용자 정보를 불러오지 못했습니다."], ["확인"], this.onCloseConfirmDialog);
        }
        
        if (alarm.sensorZoneID >= 1000000) {
            if (index === 0) {
                await SDMSController.requestClearManualReport(alarm.facilityType, alarm.sensorZoneID, alarm.sensorZoneHistoryID, userInfo.id)
            }
        }
        else if (alarm && index <= 1) { // 오작동 , 사용자복구
            if (index === 0) {
                await SDMSController.requestMalfunction(alarm.facilityType, alarm.sensorZoneID, userInfo.id, false);
            }
            else if (index === 1) {
                await SDMSController.requestMalfunction(alarm.facilityType, alarm.sensorZoneID, userInfo.id, true);
            }
        }
        
        this._setState({ confirmMessage, selectedAlarm: {} });
    }
    
    setSelectedAlarm = async (alarm) => {
        // 알람 선택시 센서 선택
        let sensorType = await this.getSensorTypeFromZoneID(alarm.zoneID);
        this.setSelectedSensor(alarm.zoneID, sensorType);
        this._setState({ selectedAlarm: alarm });
    }

    setAlarmSound = () => {
        this._setState({ alarmSound: !this.state.alarmSound });
    }
    
    onProcessingLoading = (category, value) => {
        if (category === 'start') {
            this.setState({ isLoading: true });
        } else if (category === 'process') {
            this.loadingDegree = value;
        } else if (category === 'end') {
            this.setState({ isLoading: false });
        }
    }

    onResponseSpaceList = () => {
        const externalSensorGIS = this.state.externalSensorGIS;
        if (externalSensorGIS === null || externalSensorGIS === undefined) {
            return;
        }
        
        let spaceList = [];
        
        for (let i = 0; i < externalSensorGIS.length; i++) {
            
            const gis = externalSensorGIS[i];
            
            let element = {
                "spaceID": gis.id,
                "spaceName": gis.positionName,
                "objectID": null,
                "cameraInfo": {
                    "position": {
                        "x": parseFloat(gis.positionX),
                        "y": parseFloat(gis.positionY),
                        "z": parseFloat(gis.positionZ)
                    },
                    "rotation": {
                        "x": parseFloat(gis.rotationX),
                        "y": parseFloat(gis.rotationY),
                        "z": parseFloat(gis.rotationZ)
                    },
                    "zoom": parseFloat(gis.zoom),
                }
            }
            
            spaceList.push(element);
        }
        
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendResponseSpaceList(spaceList);
            }
        }
        
    }
    
    sendSelectPOI = (spaceID, poiID) => {
        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendSelectPOI(spaceID, poiID);
            }
        }
    }

    onResponsePOIList = (targetSpaceID) => {
        const externalSensorGIS = this.state.externalSensorGIS;
        if (externalSensorGIS === null || externalSensorGIS === undefined) {
            return;
        }
        
        const externalPOIInfo = this.state.externalPOIInfo;
        if (externalPOIInfo === null || externalPOIInfo === undefined) {
            return;
        }
        
        for (let i = 0; i < externalSensorGIS.length; i++) {
            const gis = externalSensorGIS[i];
            
            if (targetSpaceID !== gis.id) {
                continue;
            }
            
            let pois = [];
            const spaceID = gis.id;
            
            for (let j = 0; j < externalPOIInfo.length; j++) {
                const poi = externalPOIInfo[j];
                
                const [alarmStatus, alarmValue, isConnected] = this.getAlarmInfoFromPoi(poi.id, poi.poiType);
                
                if (poi.spaceID === spaceID) {
                    let element = {
                        "poiID": poi.id,
                        "poiName": poi.poiName,
                        "poiType": poi.poiType,
                        "position": {
                            "x": parseFloat(poi.x),
                            "y": parseFloat(poi.y),
                            "z": parseFloat(poi.z)
                        },
                        "state": {
                            "isAlarm": alarmStatus,
                            "isConnected": isConnected,
                            "alarmValue": alarmValue
                        }
                    }

                    pois.push(element);
                }
            }
            
            let element = {
                "spaceID": gis.id,
                "POIs" : pois
            }
            
            if (this.wsMgr) {
                if (this.wsMgr.connected) {
                    this.wsMgr.sendResponsePOIList(element);
                }
            }
        }
        
        
    }
    
    getAlarmInfoFromPoi = (poiID, poiType) => {
        let alarmStatus = false;
        let alarmValue = 0;
        let isConnected = poiType === 1;
        
        const sensorList = this.state.sensorList;
        const sensorAlarms = this.state.sensorAlarms;
        
        if (sensorList === null || sensorList === undefined || sensorAlarms === null || sensorAlarms === undefined) {
            return [alarmStatus, alarmValue, isConnected];
        }
        
        if (!sensorAlarms.find(alarm => alarm.zoneID === poiID)) {
            return [alarmStatus, alarmValue, isConnected];
        }
        
        for (let i = 0; i < sensorAlarms.length; i++) {
            const alarm = sensorAlarms[i];
            const zoneID = alarm.zoneID;
        }
    }
    
    getPopupUI = (visiblePopups) => {
        let popups = [];

        if (!this.isLoading) return;

        if (visiblePopups[SDMS.menu.statusInfo]) {
            popups.push(
            <StatusInfo key='sdms_popup_statusInfo'
                        popupType={SDMSResource.popupLayer.statusInfo}
                        popupState={this.state.popupState.statusInfo}
                        setVisiblePopups={this.setVisiblePopups}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        visibleSensorTypes={this.state.visibleSensorTypes}
                        setVisiblePoi={this.setVisiblePoi}
                        sensorList={this.state.sensorList}
                        setSelectedSensor={this.setSelectedSensor}
                        selectedSensor={this.state.selectedSensor}
                        sensorAlarms={this.state.sensorAlarms}
                        buildingGroupList={this.state.buildingGroupList}
                        externalSensors={this.state.externalSensors}
                        externalSensorTypes={this.state.externalSensorTypes}
                        moveToBuilding={this.moveToBuilding}
                        getSensorTypeFromZoneID={this.getSensorTypeFromZoneID}
                        externalSensorGIS={this.state.externalSensorGIS}
                        externalPOIInfo={this.state.externalPOIInfo}
                        sendSelectPOI={this.sendSelectPOI}
            />
            );
        }

        if (visiblePopups[SDMS.menu.weatherInfo]) {
            popups.push(
                <WeatherInfo key='sdms_popup_weatherInfo'
                             popupType={SDMSResource.popupLayer.weatherInfo}
                             popupState={this.state.popupState.weatherInfo}
                             setVisiblePopups={this.setVisiblePopups}
                             setActiveDragPopup={this.setActiveDragPopup}
                             setPopupState={this.setPopupState}
                />
                );
        }

        if (visiblePopups[SDMS.menu.miniMap]) {
            popups.push(
                <MiniMap key='sdms_popup_miniMap'
                         popupType={SDMSResource.popupLayer.miniMap}
                         popupState={this.state.popupState.miniMap}
                         setVisiblePopups={this.setVisiblePopups}
                         setActiveDragPopup={this.setActiveDragPopup}
                         setPopupState={this.setPopupState}
                />
            );
        }

        // if (visiblePopups[SDMS.menu.cctvInfo]) {
        //     popups.push(
        //         <CCTVInfo key='sdms_popup_cctvInfo'
        //                   popupType={SDMSResource.popupLayer.cctvInfo}
        //                   popupState={this.state.popupState.cctvInfo}
        //                   setVisiblePopups={this.setVisiblePopups}
        //                   setActiveDragPopup={this.setActiveDragPopup}
        //                   setPopupState={this.setPopupState}
        //                   cctvList={this.state.cctvList}
        //                   cctvIds={this.state.cctvIds}
        //         />
        //     );
        // }
        
        if (visiblePopups[SDMS.menu.event]) {
            popups.push(
                <Event key='sdms_popup_event'
                       popupType={SDMSResource.popupLayer.event}
                       popupState={this.state.popupState.event}
                       setVisiblePopups={this.setVisiblePopups}
                       setActiveDragPopup={this.setActiveDragPopup}
                       setPopupState={this.setPopupState}
                       handlePopups={this.handlePopups}
                       sensorAlarms={this.state.sensorAlarms}
                       sensorList={this.state.sensorList}
                       setSelectedSensor={this.setSelectedSensor}
                       selectedAlarm={this.state.selectedAlarm}
                       setSelectedAlarm={this.setSelectedAlarm}
                       getSensorTypeFromZoneID={this.getSensorTypeFromZoneID}
                       onClickMalfunction={this.onClickMalfunction}
                       setAlarmSound={this.setAlarmSound}
                       alarmSound={this.state.alarmSound}
                />
            );
        }
        
        if (visiblePopups[SDMS.menu.eventMemo]) {
            popups.push(
                <EventMemo key='sdms_popup_eventMemo'
                           popupType={SDMSResource.popupLayer.eventMemo}
                           popupState={this.state.popupState.eventMemo}
                           setVisiblePopups={this.setVisiblePopups}
                           setActiveDragPopup={this.setActiveDragPopup}
                           setPopupState={this.setPopupState}
                           handlePopups={this.handlePopups}
                           selectedAlarm={this.state.selectedAlarm}
                           showConfirmDialog={this.showConfirmDialog}
                           onCloseConfirmDialog={this.onCloseConfirmDialog}
                />
            );
        }

        if (visiblePopups[SDMS.menu.statusPsmSensorInfo]) {
            popups.push(
                <StatusPsmSensorInfo key='sdms_popup_statusPsmSensorInfo'
                                     popupType={SDMSResource.popupLayer.statusPsmSensorInfo}
                                     popupState={this.state.popupState.statusPsmSensorInfo}
                                     setVisiblePopups={this.setVisiblePopups}
                                     setActiveDragPopup={this.setActiveDragPopup}
                                     setPopupState={this.setPopupState}
                                     sensorList={this.state.sensorList}
                                     selectedAlarm={this.state.selectedAlarm}
                                     selectedSensor={this.state.selectedSensor}
                                     selectedSensorType={this.state.selectedSensorType}
                                     externalMaterials={this.state.externalMaterials}
                                     getAlarmLevelFromSensor={this.getAlarmLevelFromSensor}
                />
            );
        }

        return popups;
    }

    getAlarmSoundElements = () => {
        if (!this.state.sensorAlarms || this.state.sensorAlarms?.length === 0) {
            return (
                <></>
            );
        }
        
        if (this.state.selectedAlarm === null || this.state.selectedAlarm === undefined) {
            return (
                <></>
            );
        }
        
        if (this.state.selectedAlarm.isAlarm === false)
            return (
                <></>
            );
        
        if (!this.state.alarmSound)
            return (
                <></>
            );
        
        if (this.state.alarmSound) {
            if (this.state.selectedAlarm.alarmDepth === 3) {
                return (
                    <audio autoPlay={true} loop={true}
                       //src="/resource/sound/alarm_level3.mp3">
                        src={process.env.PUBLIC_URL + '/sound/alarm_level3.mp3'}>
                    </audio>
                );
            } else if (this.state.selectedAlarm.alarmDepth === 4) {
                return (
                    <audio autoPlay={true} loop={true}
                            //src="/resource/sound/alarm_level4.mp3">
                        src={process.env.PUBLIC_URL + '/sound/alarm_level4.mp3'}>
                    </audio>
                );
            }
        }
    }
    
    setVisibleDashboard = (value) => {
        this._setState({ showEventDashboard: value });
    }
    
    sendCameraLocation = (zoneID) => {
        if (this.wsMgr) {
            // 3D뷰 카메라 이동
        }
    }

    render() {
        const visiblePopups = {...this.state.visiblePopups};
        const popupUI = this.getPopupUI(visiblePopups);
        
        this.makeAlarmSensors();

        return (
            <div>
                {
                    this.state.isLoading &&
                    <Loader />
                }

                <NavigationBar
                    setVisiblePopups={this.setVisiblePopups}
                    visiblePopups={this.state.visiblePopups}
                    sensorAlarms={this.state.sensorAlarms}
                />

                {popupUI}

                {
                    this.state.showEventDashboard &&
                    <EventDashboard
                        handlePopups={this.handlePopups}
                        setVisibleDashboard={this.setVisibleDashboard}
                        selectedAlarm={this.state.selectedAlarm}
                        selectedSensor={this.state.selectedSensor}
                        externalSensors={this.state.externalSensors}
                        externalSensorTypes={this.state.externalSensorTypes}
                        selectedSensorType={this.state.selectedSensorType}
                        sendCameraLocation={this.sendCameraLocation}
                    />
                }

                {
                    this.state.showInitialSituationManagement &&
                    <InitialSituationManagement
                        handlePopups={this.handlePopups}
                        externalSensors={this.state.externalSensors}
                        externalSensorTypes={this.state.externalSensorTypes}
                        buildingGroupList={this.state.buildingGroupList}
                        showConfirmDialog={this.showConfirmDialog}
                        onCloseConfirmDialog={this.onCloseConfirmDialog}
                    />
                }

                <figure>
                    {
                        this.getAlarmSoundElements()
                    }
                </figure>

                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog
                        type={this.state.confirmMessage.type}
                        messages={this.state.confirmMessage.messages}
                        buttons={this.state.confirmMessage.buttons}
                        onClickButton={this.state.confirmMessage.onClickButton}
                        onClose={() => this.onCloseConfirmDialog()}
                    />
                }

            </div>
        )
    }
}

export default withRouter(SDMS);