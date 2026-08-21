import React, { Component } from 'react';
import styles from '../css/sdms.module.css';
import content from '../../Common/css/content.module.css';
import { SDMSController } from '../services/sdmsController';
import { SDMSDataManager } from '../services/sdmsDataManager';
import SDMSResource from '../resource/id';
import Contents3D from './3D/contents3D';
import SDMSMainMenu from './sdmsMainMenu';
import uis from '../../Common/css/ui.module.css';
import $ from 'jquery';
import store from '../../Root/store';
import Event from './popups/event';
import EventDashboard from './popups/eventDashboard';
import BuildingInfo from './popups/buildingInfo';
import StatusInfo from './popups/statusInfo';
import CCTVInfo from './popups/cctvInfo';
import MiniMap from './popups/miniMap';
import Dashboard from './popups/dashboard';
import WorkerInfo from './popups/workerInfo'; /* 0929 */
import SensorStatus from './popups/sensorStatus'; /* 0929 */
import SettingsStore from '../../Settings/settingsStore';
import SettingResource from '../../Settings/resource/id';

import SopController from '../../SOPManager/services/sopController';
import WeatherInfo from './popups/weatherInfo';
import EditMenus from './3D/editMenus';
import EditModeStatusInfo from './popups/editModeStatusInfo';
import { EditModeManager } from './3D/editModeManager';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import ManualReport from './popups/manualReport';
import { DashboardController } from '../../Dashboard/services/dashboardController';
import { array } from '@amcharts/amcharts4/core';

import imgCloseBroadcast from "../img/broadcast/closeBroadcast.png";
import { SettingController } from '../../Settings/services/settingController';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import InfoBox from './popups/infoBox';
import StatusInfoZone from './popups/statusInfoZone';
import SdmsResource from '../resource/id';
import InfoBoxRow from './popups/infoBoxRow';
import InfoBoxElectric from './popups/infoBoxElectric';
import { EDMSController } from '../services/edmsController';
import { PipeManager } from './3D/pipeManager';

class SDMS extends Component {
    static menu = {
        none: null,
        statusInfo: SDMSResource.ID.menu.statusInfo,
        allCCTV: SDMSResource.ID.menu.allCCTV,
        cctv: SDMSResource.ID.menu.cctv,
        alarmCCTV1: SDMSResource.ID.menu.alarmCCTV + "_1",
        alarmCCTV2: SDMSResource.ID.menu.alarmCCTV + "_2",
        alarmCCTV3: SDMSResource.ID.menu.alarmCCTV + "_3",
        dashboard: SDMSResource.ID.menu.dashboard,
        eventInfo: SDMSResource.ID.menu.eventInfo,
        miniMap: SDMSResource.ID.menu.miniMap,
        editMode: SDMSResource.ID.menu.editMode,
        manualReport: SDMSResource.ID.menu.manualReport,
        weatherInfo: SDMSResource.ID.menu.weatherInfo,
        editModeStatusInfo: SDMSResource.ID.menu.editModeStatusInfo,
        streamServerURL: null,
        buildingInfo: SDMSResource.ID.menu.buildingInfo,
        alarmMemo: SDMSResource.ID.menu.alarmMemo,
        workerInfo: SDMSResource.ID.menu.workerInfo, /* 0929 */
        sensorStatus: SDMSResource.ID.menu.sensorStatus, /* 0929 */
    }

    static SelectedStatusInfoType = {
        none: 0,
        buildingGroup: 1,
        building: 2,
        zone: 3,
        sensorGroups: 4,
        fireSensors: 5,
        psmSensors: 6,
        etcSensors: 7,
        cctvGroups: 8,
        cctvSubGroups: 9,
        facilityGroups: 10,
        facilitySubGroups_fire: 11,
        facilitySubGroups_air: 12,
        facilitySubGroups_electric: 13,
        facilitySubGroups_panel: 14,
        closeZone: 15,
        exitLightGroups: 16,
        exitLightSubGroups: 17
    }

    static UseWalkingAvatar = false;

    static ChkShowHide = false;     // 팝업 열리고 닫히고 애니메이션 동작 중인지 체크

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            site3dOptions: {},
            currentSiteID: null,
            _3dOptions: {},
            sensorAlarms: store.getState().sensorAlarm,
            sensorOnAlarms: null,
            sensorCount: store.getState().sensorCount,
            selectedAlarm: null,
            alarmSound: true,
            command:
            {
                menu: null,
                menuParameter: null/*,
                mode: Contents3D.Mode_Outdoor_All,
                modeParameter: null*/
            },
            showMenuArea: false,
            visiblePopups: {},
            cctvList: null,
            buildingInfo: {},
            weatherInfo:
            {
                selectedIndex: 0,
                datas: store.getState().weatherDatas
            },
            buildingGroupList: [],
            sensorList: {},
            visibleSensorTypes: this.initVisibleSensorTypes(),
            facilityInfos: null,
            popupLayer: {
                statusInfoZIndex: 0,
                cctvInfoZIndex: -1,
                cctvInfo_1ZIndex: -1,
                cctvInfo_2ZIndex: -1,
                cctvInfo_3ZIndex: -1, 
                buildingInfoZIndex: 0,
                dashboardZIndex: 0,
                eventZIndex: 0,
                miniMapZIndex: 0,
                weatherInfoZIndex: 0,
                editModeStatusInfoZIndex: 0,
                manualReportZIndex: 0,
                alarmMemoZIndex: 0,
                workerInfoZIndex: 0, /* 0929 */
                sensorStatusZIndex: 0, /* 0929 */
            },
            popupState: {},
            selectedPOI: null,
            selectedFacility: {
                facilityID: -1,
                modelName: ''
            },
            cctvFullScreenState: {
                isFullScreen: false,
                cctvName: null,
                url: null,
                w: null,
                h: null
            },
            currentView: {
                buildingID: null,   // null이면 외부영역
                zoneID: null,
                zoneName: ''
            },
            editMode: Contents3D.Edit_Mode_None,
            editModeParam: null,
            // 편집모드에서 CCTV 화면을 볼수 있도록 할것인가?
            editModeCCTV: false,
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
            newCCTVList: [],
            newCCTVList_old: [],    // 백업용
            selectedNewCCTV: null,
            dashboardSensors: null,
            walker: null,
            moveDisplayAlarm: SettingResource.moveDisplayAlarm.moveAlarm,
            commonSettings: {},

            // 현황정보 선택된 Node 정보
            selectedStatusInfo: {
                buildingGroup: null,
                building: null,
                zone: null,
                sensorGroups: null,
                fireSensors: null,
                psmSensors: null,
                etcSensors: null,
                cctvGroups: null,
                cctvSubGroups: null,
                facilityGroups: null,
                facilitySubGroups_fire: null,
                facilitySubGroups_air: null,
                facilitySubGroups_electric: null,
                facilitySubGroups_panel: null
            },
            rangeSensors: [],
            selectedRangeSensors: [],
            viewMode: null,
            infoBoxData: null,
            infoBoxRowData: null,
            infoBoxElectricData: null
        }

        this.props = props;
        //this.refFileDialog = React.createRef();

        this.onSelectedAlarm = this.onSelectedAlarm.bind(this);
        this.setVisiblePopups = this.setVisiblePopups.bind(this);
        this.moveToX = this.moveToX.bind(this);
        this.setVisiblePoi = this.setVisiblePoi.bind(this);
        this.onSound = this.onSound.bind(this);
        this.setActiveDragPopup = this.setActiveDragPopup.bind(this);
        this.onClickMalfunction = this.onClickMalfunction.bind(this);
        this.getFacilityModel = this.getFacilityModel.bind(this);
        this.getSpatialInfo = this.getSpatialInfo.bind(this);
        this.getSpatialBuildingGroupInfo = this.getSpatialBuildingGroupInfo.bind(this);

        this.getStreamServerURL();

        // CCTV창 별로 연결된 알람의 데이터
        this.alarmInfo = {};
        this.alarmCCTVs = {};

        this.editModeManager = new EditModeManager();

        store.subscribe(function () {
            this.changeAlarm(store.getState());            
            this.changeSensorCount(store.getState());
            this.changeWeather(store.getState());
            this.changeNewCCTVList(store.getState());
            //this.changeCommonSettings(store.getState());
            this.setRangeSensorStatus(store.getState());
        }.bind(this));

        this.initMoveDisplayAlarm();

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'RESET_POPUP') {
                this.resetPopupState(data.popupState);
            } else if (data.actionType === 'SETTINGS') {
                this.setMoveDisplayAlarm(data.moveDisplayAlarm);
            } else if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                this.changeSDMSCommonSettings(data.sdmsCommonSettings);
            }
            
        }.bind(this));

        this.setPopupState = this.setPopupState.bind(this);
        this.getPopupState = this.getPopupState.bind(this);

        this.setCctvFullScreenState = this.setCctvFullScreenState.bind(this);

        this.refBroadcast = React.createRef();
    }

    initVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[SDMSMainMenu.Fire_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.CCTV_Type] = true;
        visibleSensorTypes[SDMSMainMenu.PSM_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Etc_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.EquipZoneName] = true;
        visibleSensorTypes[SDMSMainMenu.Electric_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.FireControl_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.FireAlarm_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Formal_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.ExitLight_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.AirFan] = true;
        visibleSensorTypes[SDMSMainMenu.Panel1] = true;
        visibleSensorTypes[SDMSMainMenu.Panel2] = true;
        visibleSensorTypes[SDMSMainMenu.Escape_02] = false;
        visibleSensorTypes[SDMSMainMenu.Escape_03] = false;
        visibleSensorTypes[SDMSMainMenu.Escape_04] = false;
        visibleSensorTypes[SDMSMainMenu.Escape_05] = false;

        return visibleSensorTypes;
    }

    componentDidMount() {
        this.props.menuEvent.handler = this.onSelectMenu;
        this.props.menuEvent.onClickLogo = this.onClickLogo;

        this.requestSensorList();

        //this.set3DOptions();

        // 처음부터 뜰 메뉴
        var visiblePopups = this.state.visiblePopups;
        visiblePopups[SDMS.menu.statusInfo] = true;
        visiblePopups[SDMS.menu.allCCTV] = true;
        visiblePopups[SDMS.menu.cctv] = false;
        visiblePopups[SDMS.menu.alarmCCTV1] = false;
        visiblePopups[SDMS.menu.alarmCCTV2] = false;
        visiblePopups[SDMS.menu.alarmCCTV3] = false;
        visiblePopups[SDMS.menu.dashboard] = true;
        visiblePopups[SDMS.menu.eventInfo] = true;
        visiblePopups[SDMS.menu.miniMap] = false;
        visiblePopups[SDMS.menu.weatherInfo] = true;
        visiblePopups[SDMS.menu.manualReport] = false;
        visiblePopups[SDMS.menu.workerInfo] = false; /* 0929 */
        visiblePopups[SDMS.menu.sensorStatus] = false; /* 0929 */

        let selectedAlarm = null;
        if (this.state.sensorAlarms === null) {
            // 새로 고침할 경우 null임 해결법 찾아야함
        }
        else {
            if (this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
                selectedAlarm = this.state.sensorAlarms[0];
            }
        }

        if (selectedAlarm === null)
            this.setState({ visiblePopups: visiblePopups });
        else
            this.setState({ visiblePopups: visiblePopups, selectedAlarm: selectedAlarm });

        // 각 페이지 별로 클래스 초기화
        $('#mainSB').addClass(uis.posi_relative);
        $('#headerSB').addClass(uis.posiHeaderWrap);
        $('#headerSB').removeClass(uis.appHeaderWrap);
        

        //팝업 상태값 일괄 획득
        this.getPopupState();
        // 대시보드 센서 목록 초기화
        this.initDashboardSensors();
    }

    componentWillUnmount() {
    }

    componentDidUpdate() {
        if (this.refBroadcast.current) {
            const dashboard = document.getElementById(SDMSResource.popupLayer.dashboard);
            
            if (dashboard) {
                const rectDashboard = dashboard.getBoundingClientRect();
                const broadcastRight = rectDashboard.right + 11;
                this.refBroadcast.current.style.left = broadcastRight + 'px';
            }
        }
    }

    async changeNewCCTVList(storeValue) {
        const newCCTVList = storeValue.newCCTVList ? [...storeValue.newCCTVList] : [];

        if (storeValue && storeValue.actionType !== 'NEW_CCTV_LIST')
            return;

        const oldCCTVList = [...this.state.newCCTVList];
        this.editModeManager.insertDeleteCCTVs(newCCTVList);

        const newCount = newCCTVList.length;
        const oldCount = oldCCTVList.length;
        let changed = false;

        if (newCount !== oldCount) {
            changed = true;

            const mapNewCCTVs = this.listToDictionary(newCCTVList);

            for (let i = 0; i < oldCount; i++) {
                const oldCCTV = oldCCTVList[i];
                const newCCTV = mapNewCCTVs[oldCCTV.id];

                if (newCCTV) {
                    // POI로 화면에 배치되었는가?
                    newCCTV.added = oldCCTV.added;
                }
            }
        }
        else {
            for (let i = 0; i < newCount; i++) {
                const newCCTV = newCCTVList[i];
                const oldCCTV = oldCCTVList[i];

                // POI로 화면에 배치되었는가?
                newCCTV.added = oldCCTV.added;

                if (changed === false) {
                    if (newCCTV.id !== oldCCTV.id ||
                        newCCTV.cameraName !== oldCCTV.cameraName ||
                        newCCTV.uniqueKey !== oldCCTV.uniqueKey ||
                        newCCTV.x !== oldCCTV.x ||
                        newCCTV.y !== oldCCTV.y ||
                        newCCTV.z !== oldCCTV.z ||
                        newCCTV.zoneID !== oldCCTV.zoneID ||
                        newCCTV.url !== oldCCTV.url) {
                        changed = true;
                        //break;
                    }
                }
            }
        }

        let updateSelection = false;
        let selectedNewCCTV = this.state.selectedNewCCTV;

        if (selectedNewCCTV) {
            for (let i = 0; i < newCount; i++) {
                const newCCTV = newCCTVList[i];

                if (selectedNewCCTV.id === newCCTV.id) {
                    selectedNewCCTV = newCCTV;
                    updateSelection = true;
                    break;
                }
            }

            if (updateSelection === false) {
                selectedNewCCTV = null;
                updateSelection = true;
            }
        }

        if (changed || updateSelection) {
            this.setState({ newCCTVList, selectedNewCCTV: selectedNewCCTV });
        }
    }

    /*
    async changeCommonSettings(storeValue) {
        const commonSettings = storeValue.sdmsCommonSettings ? { ...storeValue.sdmsCommonSettings } : {};

        if (storeValue && storeValue.actionType !== 'SDMS_COMMON_SETTINGS')
            return;

        const oldCommonSettings = { ...this.state.commonSettings };
        let newCount = 0;

        for (const name in commonSettings) {
            newCount++;

            const oldValue = oldCommonSettings[name];
            const newValue = commonSettings[name];

            if (oldValue !== newValue) {
                this.setState({ commonSettings: commonSettings });
                return;
            }
        }

        let oldCount = 0;

        for (const name in oldCommonSettings) {
            oldCount++;
        }

        if (newCount !== oldCount) {
            this.setState({ commonSettings: commonSettings });
        }
    }
    */
    changeSDMSCommonSettings(storeValue) {
        const commonSettings = storeValue ? storeValue : {};

        this.setState({ commonSettings: commonSettings });
    }

    listToDictionary(list) {
        const count = list.length;
        const dictionary = {};

        for (let i = 0; i < count; i++) {
            const data = list[i];
            dictionary[data.id] = data;
        }

        return dictionary;
    }

    async changeWeather(data) {
        if (data === null || data === undefined || data.actionType !== 'WEATHER_CURRENT')
            return;

        const weatherDatas = data.weatherDatas;

        if (weatherDatas) {
            const weatherInfo =
            {
                selectedIndex: this.state.weatherInfo.selectedIndex,
                datas: weatherDatas,
            }

            this.setState({ weatherInfo });
        }
    }

    async changeSensorCount(data) {
        if (data === null || data === undefined || data.actionType !== 'SENSOR_COUNT')
            return;

        this.setState({ sensorCount: data.sensorCount });
    }

    async changeAlarm(storeValue) {
        const alarms = storeValue.sensorAlarm;
        
        if (storeValue && storeValue.actionType !== 'SENSOR_ALARM')
            return;

        const orgAlarms = this.state.sensorAlarms;
        
        var menus = this.state.visiblePopups;

        let selectedAlarm = null;                
        if (alarms && alarms.length > 0) {
            selectedAlarm = alarms[0];            
        }

        let alarmType = "";
        let alarmCCTV = "";

        if (selectedAlarm && selectedAlarm.isAlarm)
        {
            if (selectedAlarm.sensorZoneID < 1000000) {
                alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                menus[SDMS.menu.eventInfo] = true;
                alarmCCTV = this.showAlarmCCTV(alarmType, selectedAlarm);
            }
            //menus[SDMS.menu.cctv] = true;
        }
        else {
            //menus[SDMS.menu.eventInfo] = false;
            //menus[SDMS.menu.cctv] = false;
        }

        if (selectedAlarm === null || !selectedAlarm.isAlarm) { // 알람 없음
            this.hideAlarm();

            // 편집모드 경우 알람, 알람해제 시 카메라 이동이 없음 - K.D.R
            if (this.isEditMode() !== true)
                this.onClickLogo();
        }
        else {
            let moveToAlarm = await this.checkAlarm(orgAlarms, alarms, true, alarmCCTV);
            await this.checkAlarm(alarms, orgAlarms, false, alarmCCTV);

            if (moveToAlarm) {
                selectedAlarm = moveToAlarm;
            }
            else {
                // 새로 발생한 알람이 없으면 현재 선택된 알람으로 3D 이동한다
                if (selectedAlarm) {
                    if (this.state.moveDisplayAlarm !== SettingResource.moveDisplayAlarm.currentDisplay) {
                        await this.showAlarm(selectedAlarm, null);
                    }
                }
            }
        }

        if (selectedAlarm === null) {
            this.setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, cctvList: null, alarmSound: false });
        }
        else {
            const alarmRangeSensor = this.getAlarmRangeSensor(selectedAlarm);
            const selectedPOI = selectedAlarm?.isAlarm ? this.makeSelectedPOI(SDMSMainMenu.getSensorType(selectedAlarm.facilityType), selectedAlarm.zoneID, selectedAlarm.orgSensorID) : null;

            if (selectedAlarm?.isAlarm && alarmRangeSensor ) {
                menus[SDMS.menu.sensorStatus] = true;
                this.setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, alarmSound: selectedAlarm.isAlarm, selectedRangeSensors: [alarmRangeSensor], selectedPOI });
            }
            else {
                this.setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, alarmSound: selectedAlarm.isAlarm, selectedPOI });
            }
        }
    }

    getAlarmRangeSensor(alarm) {
        const sensors = [...this.state.rangeSensors];

        for (const sensor of sensors) {
            if (alarm.orgSensorID.toString() === sensor.id.toString() && sensor.materialType === alarm.materialTypeString)
                return sensor;
        }

        return null;
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

    showAlarmCCTV(alarmType, selectedAlarm) {
        /*for (let key in this.alarmInfo) {
            const alarmInfo = this.alarmInfo[key];

            if (this.state.visiblePopups[key] && alarmInfo && alarmInfo[1]) {
                if (alarmInfo[1].sensorZoneHistoryID === selectedAlarm.sensorZoneHistoryID ||
                    alarmInfo[1].equipZoneID === selectedAlarm.equipZoneID) {
                    this.state.visiblePopups[SDMS.menu.allCCTV] = true;
                    // 이미 알람 CCTV 창이 떠있다.
                    return key;
                }
            }
        }*/

        let alarmCCTV = "";
        /*let oldDate = null;

        if (this.state.visiblePopups[SDMS.menu.alarmCCTV1]) {
            [oldDate, alarmCCTV] = this.setOldDateItem(SDMS.menu.alarmCCTV1, oldDate, alarmCCTV);

            if (this.state.visiblePopups[SDMS.menu.alarmCCTV2]) {
                [oldDate, alarmCCTV] = this.setOldDateItem(SDMS.menu.alarmCCTV2, oldDate, alarmCCTV);

                if (this.state.visiblePopups[SDMS.menu.alarmCCTV3] === false) {
                    this.state.visiblePopups[SDMS.menu.alarmCCTV3] = true;
                    alarmCCTV = SDMS.menu.alarmCCTV3;
                }
                else {
                    [oldDate, alarmCCTV] = this.setOldDateItem(SDMS.menu.alarmCCTV3, oldDate, alarmCCTV);
                }
            }
            else {
                this.state.visiblePopups[SDMS.menu.alarmCCTV2] = true;
                alarmCCTV = SDMS.menu.alarmCCTV2;
            }
        }
        else {
            this.state.visiblePopups[SDMS.menu.alarmCCTV1] = true;
            alarmCCTV = SDMS.menu.alarmCCTV1;
        }*/

        this.state.visiblePopups[SDMS.menu.alarmCCTV1] = true;
        alarmCCTV = SDMS.menu.alarmCCTV1;

        if (alarmCCTV.length > 0) {
            this.state.visiblePopups[SDMS.menu.allCCTV] = true;
            this.alarmInfo[alarmCCTV] = [alarmType, selectedAlarm, new Date()];
        }

        return alarmCCTV;
    }

    setOldDateItem(alarmCCTV, date, prevData) {
        const alarmData = this.alarmInfo[alarmCCTV];

        if (alarmData) {
            if (date === null) {
                return [alarmData[2], alarmCCTV];
            }
            else if (alarmData[2] < date) {
                return [alarmData[2], alarmCCTV];
            }
        }

        return [date, prevData];
    }

    getOnAlarms(alarms) {
        if (!alarms) {
            return;
        }

        let onAlarms = [];

        const alarmsLength = alarms.length;
        for (let i = 0; i < alarmsLength; i++) {
            if (alarms[i].isAlarm) {
                onAlarms.push(alarms[i]);
            }
        }

        return onAlarms;
    }

    async checkAlarm(alarms, targetAlarms, isChg, targetCCTVMenu) {
        var returnAlarm = [];

        if (alarms === null || alarms.length === 0) {
            for (let i = 0; i < targetAlarms.length; i++) {
                if ((isChg && targetAlarms[i].isAlarm) || (!isChg && !targetAlarms[i].isAlarm)) {
                    returnAlarm.push(targetAlarms[i]);
                }
            }
        }
        else {
            if (targetAlarms !== null) {
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

        //0 : 현재대로
        //1 : 알람 울릴때마다 화면 이동
        //2 : 첫번째 알람 화면으로 이동
        //3 : 마지막 알람 화면으로 이동        
        const moveToOption = this.state.moveDisplayAlarm;
        let moveToSensor = new Array();

        for (let k = 0; k < returnAlarm.length; k++) {
            for (let i = 0; i < returnAlarm[k].alarmSensorZoneIDs.length; i++) {
                //const [orgSensorID, isAlarmStatus] = await SDMSController.getOrgSensorID(returnAlarm[k].alarmSensorZoneIDs[i]);

                const sensorZoneID = returnAlarm[k].alarmSensorZoneIDs[i];
                if (sensorZoneID < 1000000) {

                    let nOrgSensorID = -1;

                    if (SDMSResource.isSVMSSensorType(returnAlarm[k].facilityType)) {
                        const [orgSensorID, isAlarmStatus] = await SDMSController.getOrgSensorID(sensorZoneID);
                        if (!orgSensorID || orgSensorID === undefined) {
                            continue;
                        }

                        nOrgSensorID = orgSensorID;
                    }
                    else {
                        const sensor = this.getOrgSensor(returnAlarm[k].facilityType, sensorZoneID)
                        if (!sensor) {
                            continue;
                        }

                        nOrgSensorID = sensor.id;
                    }

                    if (isChg) { // 알람 발생
                        if (k == returnAlarm.length - 1) {
                            //this.moveToSensor(returnAlarm[k].zoneID, returnAlarm[k].facilityType, orgSensorID);
                        }
                        //if (isAlarmStatus) {
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
                        //if (!isAlarmStatus) {
                        this.removeAlarm(returnAlarm[k].facilityType, nOrgSensorID, returnAlarm[k].alarmDepth);
                        //}
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
                        await this.showAlarm(moveToSensor[i], null);
                    }
                    selectedAlarm = moveToSensor[i];
                }
            }
        }

        return selectedAlarm;
    }

    getOrgSensor(facilityType, sensorZoneID) {
        if (SDMSResource.isPSMSensorType(facilityType)) {
            if (this.state.sensorList.psmSensors) {
                const sensorLength = this.state.sensorList.psmSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.psmSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isETCSensorType(facilityType)) {
            if (this.state.sensorList.etcSensors) {
                const sensorLength = this.state.sensorList.etcSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.etcSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else {
            if (this.state.sensorList.fireSensors) {
                const sensorLength = this.state.sensorList.fireSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.fireSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }

        return null;
    }

    // 같은 Equipzone의 알람이 변경되면 alarmSensorZoneIDs 데이터가 변경되는데, 
    // 이 경우에 알람이 추가된건지, 해지된건지 판단한다
    checkAlarmZoneHistoryID(sensorZoneIDs, targetSensorZoneIDs) {
        var returnIDs = [];

        if (sensorZoneIDs === null || sensorZoneIDs.length === 0) {
            returnIDs = targetSensorZoneIDs;
            return returnIDs;
        }

        if (targetSensorZoneIDs !== null) {
            for (var i = 0; i < targetSensorZoneIDs.length; i++) {
                var chk = false;
                for (var j = 0; j < sensorZoneIDs.length; j++) {                    
                    if (targetSensorZoneIDs[i] === sensorZoneIDs[j]) {
                        chk = true;
                        break;
                    }
                }

                if (!chk) {
                    returnIDs.push(targetSensorZoneIDs[i]);
                }
            }
        }

        return returnIDs;
    }

    onMalfunction = (alarm) => {
        if (alarm.sensorZoneID >= 1000000) {
            this.showConfirmDialog("알람 종료", ["수동 신고한 상황을 종료할까요?"], ["상황 종료", "취소"], this.onClickMalfunction);
        }
        else {
            this.showConfirmDialog("알람 종료", ["탐지된 신호를 종료할까요?"], ["종료", "오작동", "취소"], this.onClickMalfunction);
        }
    }
    async onClickMalfunction(index) {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        const alarm = this.state.selectedAlarm;

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined) 
            return;

        if (alarm.sensorZoneID >= 1000000) {
            if (index === 0) {
                await SDMSController.requestClearManualReport(alarm.facilityType, alarm.sensorZoneID, alarm.sensorZoneHistoryID, userInfo.id);
            }
        }
        else if (alarm && index <= 1) { // 오작동, 사용자복구
            if (index === 0) {
                await SDMSController.requestMalfunction(alarm.facilityType, alarm.sensorZoneID, userInfo.id, false);
            }
            else if (index === 1) {
                await SDMSController.requestMalfunction(alarm.facilityType, alarm.sensorZoneID, userInfo.id, true);
            }
        }
        
        this.setState({ confirmMessage });
    }

    onAuthorError = () => {
        this.showConfirmDialog("권한", ["해당 로그인 사용자는 권한이 없습니다."], null, null);
    }

    async requestSensorList() {
        const [result, message] = await SDMSController.requestSensorList();
        const facilityInfos = await SDMSController.requestAllFacilityInfo();

        if (result === null) {
            console.log(message);
            this.setState({ facilityInfos: facilityInfos });
        }
        else {            
            const sensorList = {};
            if (result.fireSensors) {
                sensorList['fireSensors'] = result.fireSensors;
            }

            if (result.psmSensors) {
                sensorList['psmSensors'] = result.psmSensors;
            }

            if (result.etcSensors) {
                sensorList['etcSensors'] = result.etcSensors;
            }

            if (result.cctvs) {
                sensorList['cctvs'] = result.cctvs;
            }

            this.setState({ sensorList: sensorList, facilityInfos: facilityInfos });
            await this.set3DOptions(sensorList);
        }
    }

    async set3DOptions(sensorList) {
        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList();

        // 유저 계정에 따라 3D High, Light 버전 다르기 때문에 
        let userInfo = await ProjectResource.initUserInfo();

        if (userInfo?.options) {
            userInfo.options = JSON.parse(userInfo.options);
        }

        const site3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, userInfo ? userInfo.id : 0);
        //const _3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, userInfo.id);

        let first3DOptions = null;
        let firstSiteID = null;

        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];
            //this.setSensorList(_3dOptions, sensorList, siteID);

            if (!first3DOptions) {
                first3DOptions = _3dOptions;
                firstSiteID = siteID;
            }
        }

        const [edmsFacilities, errorMessage2] = await EDMSController.requestFacilities();

        if (!edmsFacilities) {
            alert(errorMessage2);
            return;
        }
        else {
            this.setEdmsFacilities(edmsFacilities);
        }

        this.setSensorList(site3dOptions, sensorList);

        this.setState({ loading: false, site3dOptions: site3dOptions, currentSiteID: firstSiteID, _3dOptions: first3DOptions, buildingGroupList, viewMode: userInfo?.options?.viewMode });
        //this.setState({ loading: false, _3dOptions, buildingGroupList });
    }

    setEdmsFacilities(edmsFacilities) {
        this.edmsFacilities_modelName = {};
        this.edmsFacilities_sensorName = {};

        const facilityCount = edmsFacilities.length;

        for (let i = facilityCount - 1; i >= 0; i--) {
            const facility = edmsFacilities[i];

            this.edmsFacilities_modelName[facility.modelName] = facility;
            this.edmsFacilities_sensorName[facility.sensorName] = facility;
        }
    }

    getEdmsFacility = (modelName, sensorName) => {
        if (modelName && modelName.length > 0) {
            return this.edmsFacilities_modelName[modelName];
        }
        else if (sensorName && sensorName.length > 0) {
            return this.edmsFacilities_sensorName[sensorName];
        }

        return null;
    }

    setSensorList(site3dOptions, sensorList) {
        if (!sensorList || !site3dOptions) {
            console.log('[error] sensorList가 없음');
        }
        else {
            const fireSensors = sensorList['fireSensors'];
            const psmSensors = sensorList['psmSensors'];
            const etcSensors = sensorList['etcSensors'];
            const cctvs = sensorList['cctvs'];
            let exitLights = sensorList['exitLights'];

            if (!exitLights) {
                exitLights = [];
                sensorList['exitLights'] = exitLights;
            }

            if (fireSensors) {
                this.setFireSensors(fireSensors, site3dOptions);
            }

            if (psmSensors) {
                this.setPSMSensors(psmSensors, site3dOptions);
            }

            if (etcSensors) {
                this.setExitLightSensors(etcSensors, site3dOptions, exitLights);
                this.setEtcSensors(etcSensors, site3dOptions);
            }

            if (cctvs) {
                this.setCCTVs(cctvs, site3dOptions);
            }
        }
    }

    getZone(site3dOptions, zoneID) {
        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];
            let zone = _3dOptions.zones[zoneID];

            if (!zone && zoneID !== null && zoneID !== undefined) {
                zone = _3dOptions.outdoorZones[zoneID.toString()];
            }

            return zone;
        }

        return null;
    }

    setFireSensors(fireSensors, site3dOptions) {
        const sensorCount = fireSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = fireSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);
            /*let zone = _3dOptions.zones[sensor.zoneID];

            if (!zone) {
                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
            }*/

            if (zone) {
                if (!zone.sensors.fire) {
                    zone.sensors.fire = [];
                }

                zone.sensors.fire.push(sensor);
                sensor.edmsFacility = this.getEdmsFacility(null, sensor.name);
            }
        }
    }

    setPSMSensors(psmSensors, site3dOptions) {
        const sensorCount = psmSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = psmSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);
            /*let zone = _3dOptions.zones[sensor.zoneID];

            if (!zone) {
                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
            }*/

            if (zone) {
                if (!zone.sensors.psm) {
                    zone.sensors.psm = [];
                }

                zone.sensors.psm.push(sensor);
                sensor.edmsFacility = this.getEdmsFacility(null, sensor.name);
            }
        }
    }

    // 유도등
    setExitLightSensors(etcSensors, site3dOptions, exitLights) {
        const sensorCount = etcSensors.length;

        for (let i = sensorCount-1; i >= 0; i--) {
            const sensor = etcSensors[i];

            if (sensor.materialType === SdmsResource.materialType.ExitLight) {
                const zone = this.getZone(site3dOptions, sensor.zoneID);

                if (zone) {
                    if (!zone.sensors.exitLight) {
                        zone.sensors.exitLight = [];
                    }

                    zone.sensors.exitLight.push(sensor);
                }

                exitLights.push(sensor);
                etcSensors.splice(i, 1);
                sensor.edmsFacility = this.getEdmsFacility(null, sensor.name);
            }
        }

        exitLights.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }

            return 0;
        });
    }

    setEtcSensors(etcSensors, site3dOptions) {
        const sensorCount = etcSensors.length;

        etcSensors.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }

            return 0;
        });

        for (let i = 0; i < sensorCount; i++) {
            const sensor = etcSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);
            /*let zone = _3dOptions.zones[sensor.zoneID];

            if (!zone) {
                zone = _3dOptions.outdoorZones[sensor.zoneID.toString()];
            }*/

            if (zone) {
                if (!zone.sensors.etc) {
                    zone.sensors.etc = [];
                }

                zone.sensors.etc.push(sensor);
                sensor.edmsFacility = this.getEdmsFacility(null, sensor.name);
            }
        }
    }

    setCCTVs(cctvs, site3dOptions) {
        const cctvCount = cctvs.length;

        for (let i = 0; i < cctvCount; i++) {
            const cctv = cctvs[i];
            const zone = this.getZone(site3dOptions, cctv.zoneID);
            /*let zone = _3dOptions.zones[cctv.zoneID];

            if (!zone && cctv.zoneID !== null && cctv.zoneID !== undefined) {
                zone = _3dOptions.outdoorZones[cctv.zoneID.toString()];
            }*/

            if (zone) {
                if (!zone.sensors.cctv) {
                    zone.sensors.cctv = [];
                }

                zone.sensors.cctv.push(cctv);
                cctv.edmsFacility = this.getEdmsFacility(null, cctv.name);
            }
        }
    }

    onSelectMenu = (menu, param) => {
        if (menu === SDMSMainMenu.Menu_Show_Menu_Area) {
            this.setState({ showMenuArea: !this.state.showMenuArea });
        }
        else if (menu === SDMSMainMenu.Menu_Refresh) {
            this.setState({ showMenuArea: this.state.showMenuArea });
        }
        else if (menu === SDMSResource.ID.menu.statusInfo ||
            menu === SDMSResource.ID.menu.dashboard ||
            menu === SDMSResource.ID.menu.cctv ||
            menu === SDMSResource.ID.menu.allCCTV ||
            menu === SDMSResource.ID.menu.alarmCCTV1 ||
            menu === SDMSResource.ID.menu.alarmCCTV2 ||
            menu === SDMSResource.ID.menu.alarmCCTV3 ||
            menu === SDMSResource.ID.menu.eventInfo ||
            menu === SDMSResource.ID.menu.miniMap ||
            menu === SDMSResource.ID.menu.workerInfo || /* 0929 */
            menu === SDMSResource.ID.menu.sensorStatus ||
            menu === SDMSResource.ID.menu.weatherInfo) {
            this.setVisiblePopups(menu);
        }
        else if (menu === SDMSResource.ID.menu.manualReport) {
            this.setManualReport(menu);
        }
        else if (menu === SDMSResource.ID.menu.editMode) {
            this.setEditMode(true);
        }
        else {
            this.processMenu(menu, param);
        }
    }

    setManualReport = (menu) => {
        // 사용자 권한 체크
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor !== AccountResource.ID.accountLevel.admin) {
            this.onAuthorError();
            return;
        }

        this.setVisiblePopups(menu);
    }

    onSelectPOI = (poi, updateDB, contents3D) => {
        if (updateDB && this.isEditMode()) {
            this.editModeManager.addSensor(poi, this.state._3dOptions);
        }
        else if (this.state.editMode === Contents3D.Edit_Mode_CCTVGroup && this.state.editModeParam === CCTVInfo.Mode_Select_Sensor) {
            this.editModeManager.setSensorForCCTVGroup(poi, this.postSelectSensorForCCTVGroup, this.showConfirmDialog, contents3D);

            if (!this.editModeManager?.contents3D?.poiManager?.selectedPOI) {
                return;
            }

            this.setState({ editModeParam: CCTVInfo.Mode_Select_CCTV });
            return;
        }

        if (poi) {            
            const [buildingGroup, building, zone, sensorType] = this.onChangeBuildingGroup2(poi);
            if (buildingGroup && building && zone) {
                const selectedStatusInfo = this.state.selectedStatusInfo;
                
                selectedStatusInfo.buildingGroup = buildingGroup;
                selectedStatusInfo.building = building;
                selectedStatusInfo.zone = zone;

                if (sensorType === 'cctv') {
                    selectedStatusInfo.sensorGroups = false;
                    selectedStatusInfo.fireSensors = false;
                    selectedStatusInfo.psmSensors = false;
                    selectedStatusInfo.etcSensors = false;
                    selectedStatusInfo.exitLightGroups = false;
                    selectedStatusInfo.exitLightSubGroups = false;
                    selectedStatusInfo.cctvGroups = true;
                    selectedStatusInfo.cctvSubGroups = true;
                    selectedStatusInfo.facilityGroups = false;
                    selectedStatusInfo.facilitySubGroups_fire = false;
                    selectedStatusInfo.facilitySubGroups_air = false;
                    selectedStatusInfo.facilitySubGroups_electric = false;
                    selectedStatusInfo.facilitySubGroups_panel = false;
                }
                else if (sensorType === 'exitLight') {
                    selectedStatusInfo.sensorGroups = false;
                    selectedStatusInfo.fireSensors = false;
                    selectedStatusInfo.psmSensors = false;
                    selectedStatusInfo.etcSensors = false;
                    selectedStatusInfo.exitLightGroups = true;
                    selectedStatusInfo.exitLightSubGroups = true;
                    selectedStatusInfo.cctvGroups = false;
                    selectedStatusInfo.cctvSubGroups = false;
                    selectedStatusInfo.facilityGroups = false;
                    selectedStatusInfo.facilitySubGroups_fire = false;
                    selectedStatusInfo.facilitySubGroups_air = false;
                    selectedStatusInfo.facilitySubGroups_electric = false;
                    selectedStatusInfo.facilitySubGroups_panel = false;
                }
                else {
                    selectedStatusInfo.sensorGroups = true;
                    if (sensorType === 'fire') {
                        selectedStatusInfo.fireSensors = true;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                    }
                    else if (sensorType === 'psm') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = true;
                        selectedStatusInfo.etcSensors = false;
                    }
                    else if (sensorType === 'etc') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = true;
                    }
                    selectedStatusInfo.cctvGroups = false;
                    selectedStatusInfo.cctvSubGroups = false;
                    selectedStatusInfo.exitLightGroups = false;
                    selectedStatusInfo.exitLightSubGroups = false;
                    selectedStatusInfo.facilityGroups = false;
                    selectedStatusInfo.facilitySubGroups_fire = false;
                    selectedStatusInfo.facilitySubGroups_air = false;
                    selectedStatusInfo.facilitySubGroups_electric = false;
                    selectedStatusInfo.facilitySubGroups_panel = false;
                }

                
                this.setState({ selectedStatusInfo, infoBoxData: null, infoBoxRowData: null, infoBoxElectricData: null });
            }

            this.setState({ selectedPOI: [poi, updateDB] });
        }
        else {
            if (this.state.selectedPOI !== null) {
                this.setState({ selectedPOI: null });
            }            
        }
    }

    makeSelectedPOI(sensorType, zoneID, sensorID) {
        return [sensorType, zoneID, sensorID];
    }

    setSelectedPOI = (sensorType, sensorID, zoneID) => {
        this.setState({ selectedPOI: this.makeSelectedPOI(sensorType, zoneID, sensorID) });
        //this.setState({ selectedPOI: [sensorType, sensorID, zoneID] });
    }

    setSelectedStatusInfoFromEtcSensor(sensor) {
        if (sensor.materialType !== 0 && !sensor.materialType) {
            return;
        }

        const selectedStatusInfo = { ...this.state.selectedStatusInfo };

        selectedStatusInfo.facilitySubGroups_fire = false;
        selectedStatusInfo.facilitySubGroups_air = false;
        selectedStatusInfo.facilitySubGroups_electric = false;
        selectedStatusInfo.facilitySubGroups_panel = false;

        if (sensor.materialType === SdmsResource.materialType.FireFacility) {
            selectedStatusInfo.facilitySubGroups_fire = true;
        }
        else if (sensor.materialType === SdmsResource.materialType.AirFacility) {
            selectedStatusInfo.facilitySubGroups_air = true;
        }
        else if (sensor.materialType === SdmsResource.materialType.ElectricFacility) {
            selectedStatusInfo.facilitySubGroups_electric = true;
        }
        else if (sensor.materialType === SdmsResource.materialType.PanelFacility) {
            selectedStatusInfo.facilitySubGroups_panel = true;
        }
        else {
            return;
        }

        const [buildingGroup, building, zone] = this.getSpatialInfo(sensor.zoneID);
        
        selectedStatusInfo.facilityGroups = true;
        selectedStatusInfo.buildingGroup = buildingGroup;
        selectedStatusInfo.building = building;
        selectedStatusInfo.zone = zone;

        this.setState({ selectedStatusInfo });
    }

    onSelectSensorModel = (sensorModel, zoneID, sensorType, sensorID) => {
        const selectedStatusInfo = { ...this.state.selectedStatusInfo };
        const selectedPOI = this.makeSelectedPOI(sensorType, zoneID, sensorID);
        //const selectedPOI = [sensorType, sensorID, zoneID];

        selectedStatusInfo.cctvGroups = false;
        selectedStatusInfo.cctvSubGroups = false;
        selectedStatusInfo.exitLightGroups = false;
        selectedStatusInfo.exitLightSubGroups = false;
        selectedStatusInfo.facilityGroups = true;

        selectedStatusInfo.facilitySubGroups_fire = false;
        selectedStatusInfo.facilitySubGroups_air = false;
        selectedStatusInfo.facilitySubGroups_electric = false;
        selectedStatusInfo.facilitySubGroups_panel = false;

        if (sensorType === SDMSMainMenu.FireControl_Sensor)
            selectedStatusInfo.facilitySubGroups_fire = true;
        else if (sensorType === SDMSMainMenu.AirFan)
            selectedStatusInfo.facilitySubGroups_air = true;
        else if (sensorType === SDMSMainMenu.Electric_Sensor)
            selectedStatusInfo.facilitySubGroups_electric = true;
        else if (sensorType === "panel")
            selectedStatusInfo.facilitySubGroups_panel = true;

        this.setState({ selectedStatusInfo, selectedPOI });
    }

    postSelectSensorForCCTVGroup = (poi, equipZoneID, equipZoneName, cctvList) => {
        const menus = this.state.visiblePopups;
        menus[SDMS.menu.cctv] = true;

        if (equipZoneID === null) {
            this.clearEqiupZoneCCTVs();
        }

        this.setState({ selectedPOI: [poi, false], cctvList: cctvList, visiblePopups: menus });
    }

    async processMenu(menu, param) {
        if (menu === SDMSMainMenu.Menu_Move_Sensor) {
            const result = await this.moveSensor(param[0], param[1], param[2], param[3], param[4], param[5]);

            if (result === false)
                return;
        }

        const cmd = {};
        cmd.menu = menu;
        cmd.menuParameter = param;
        /*cmd.mode = this.state.command.mode;
        cmd.modeParameter = this.state.command.modeParameter;*/
        if (menu === SDMSMainMenu.Menu_Add_Alarm) {
            this.setState({ command: cmd, alarmSound: true });
        }
        else if (menu === SDMSMainMenu.Menu_Move_POI) {
            this.setState({ command: cmd, selectedPOI: null });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_POI) {
            if (param && param.length === 3) {
                this.setState({ command: cmd, selectedPOI: this.makeSelectedPOI(param[1], param[0], param[2]), infoBoxData: null, infoBoxRowData: null, infoBoxElectricData: null });
            }
            else {
                this.setState({ command: cmd });
            }
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_Facility)
        {
            let facilityID = null;

            if (param && param.length === 3) {
                param = [param[0], param[1], param[2]];
            }

            if (param[1] === SDMSMainMenu.Etc_Sensor) {
                facilityID = this.onSelectEtcSensor(param[2]);

                if (facilityID === 0 || facilityID) {
                    if (cmd?.menuParameter && cmd.menuParameter.length >= 3) {
                        cmd.menuParameter[2] = facilityID;
                    }
                }
            }

            const sensorType = param[1];
            const zoneID = param[0];
            const sensorID = param[2];
            this.setState({ command: cmd, selectedPOI: this.makeSelectedPOI(sensorType, zoneID, sensorID) });
            //this.setState({ command: cmd, selectedPOI: [param[1], param[2], param[0]] });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_BuildingGroup && param && Array.isArray(param) && param.length > 0 && !param[0]) {
            // 외부영역 항목에서 이동 버튼을 눌렀을때
            this.onClickLogo();
        }
        else {
            this.setState({ command: cmd });
        }
    }

    onSelectEtcSensor(sensorID) {
        const _etcSensors = this.state.sensorList?.etcSensors;

        if (_etcSensors) {
            const etcSensors = [..._etcSensors];

            for (const sensor of etcSensors) {
                if (sensor.id === sensorID) {
                    if (sensor.materialType === SdmsResource.materialType.FireFacility ||
                        sensor.materialType === SdmsResource.materialType.AirFacility ||
                        sensor.materialType === SdmsResource.materialType.ElectricFacility ||
                        sensor.materialType === SdmsResource.materialType.PanelFacility ||
                        sensor.materialType === SdmsResource.materialType.ExitLight) {
                        return this.selectFacility(sensor, true);
                    }
                }
            }
        }

        return null;
    }

    setEditMode = (isEditMode) => {
        // 계정 권한 확인
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor !== AccountResource.ID.accountLevel.admin) {
            this.onAuthorError();
            return;
        }

        let editMode = this.state.editMode;
        let selectedPOI = !this.state.selectedPOI ? null : [...this.state.selectedPOI];

        if (isEditMode) {
            /*if (this.isIndoor() === false) {
                alert("외부공간에서는 편집모드를 실행할 수 없습니다.");
                return;
            }*/

            if (editMode === Contents3D.Edit_Mode_None) {
                editMode = Contents3D.Edit_Mode_MovePOI;
            }

            // newCCTVList 백업 - K.D.R
            const newCCTVList_old = this.copyArray(this.state.newCCTVList);
            this.state.newCCTVList_old = newCCTVList_old;
        }
        else {
            if (this.editModeManager.isEmpty() === false) {
                this.showConfirmDialog("확인", ["편집중인 데이터가 있습니다.", "저장할까요?"], ["저장후 종료", "저장하지 않고 종료", "취소"], this.onClickEditModeCloseConfirm);
                return;
            }

            this.clearEqiupZoneCCTVs();

            // 가벽 추가 중 취소했다면 생성 중인 가벽 삭제 - K.D.R
            this.editModeManager.cancleFakeWall();    

            selectedPOI = null;
            editMode = Contents3D.Edit_Mode_None;

            // CCTV 팝업창 닫기 버튼 표시
            $('#cctvInfoCloseBtn').show();
        }

        this.setState({ editMode, selectedPOI });
    }

    copyArray(array) {
        let cloneArr = [];

        if (array !== null && array !== undefined && array.length !== 0) {
            for (let i = 0; i < array.length; i++) {
                const arrData = Object.assign({}, array[i]);
                cloneArr.push(arrData);
            }
        }

        return cloneArr;
    }

    clearEqiupZoneCCTVs() {
        // equipZoneCCTV 초기화
        const emptyEquipZoneCCTV = this.makeEquipZoneCCTV(null);
        this.editModeManager.contents3D.poiManager.selectEquipZoneCCTVs(emptyEquipZoneCCTV);
    }

    onClickEditModeCloseConfirm = (index) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        const command = {
            menu: SDMSMainMenu.Menu_ClearSelection,
            menuParameter: null
        };

        if (index === 0) {
            this.clearEqiupZoneCCTVs();

            // 저장후 종료
            this.editModeManager.saveAll(this, this.setEditModeFalse);
            this.editModeManager.initPOIEditMode();
            this.setState({ confirmMessage, selectedPOI: null, command });

            // CCTV 팝업창 닫기 버튼 표시
            $('#cctvInfoCloseBtn').show();
        }
        else if (index === 1) {
            this.clearEqiupZoneCCTVs();

            // 저장하지 않고 종료
            this.editModeManager.backToOrigin(this.state.currentView?.zoneID);
            this.editModeManager.clear();
            this.editModeManager.initPOIEditMode();

            // newCCTVList 백업 - K.D.R
            const newCCTVList = [...this.state.newCCTVList_old];

            this.setState({ editMode: Contents3D.Edit_Mode_None, confirmMessage, selectedPOI: null, command, newCCTVList });

            // CCTV 팝업창 닫기 버튼 표시
            $('#cctvInfoCloseBtn').show();
        }
        else {
            // 취소
            this.setState({ confirmMessage });
        }
    }

    updateNewCCTVs = () => {
        this.setState({ newCCTVList: this.state.newCCTVList });
    }

    setEditModeFalse = () => {
        this.setEditMode(false);
    }

    saveEditDatas = () => {
        this.editModeManager.saveAll(this, this.updateNewCCTVs);
    }

    setEditModeItem = (mode, param) => {
        let editModeCCTV = null;

        // 구역별 CCTV 편집모드에서는 CCTV창이 항상 보이게 한다.
        if (mode === Contents3D.Edit_Mode_CCTVGroup) {
            editModeCCTV = true;

            // CCTV 팝업창 닫기 버튼 숨김
            $('#cctvInfoCloseBtn').hide();
        } else {
            // CCTV 팝업창 닫기 버튼 표시
            $('#cctvInfoCloseBtn').show();
        }

        if (mode === Contents3D.Edit_Mode_CCTVGroup && param === CCTVInfo.Mode_Select_Sensor) {
            if (this.state.editMode === mode && this.state.editModeParam === param) {
                return;
            }

            this.setState({ editMode: mode, editModeParam: param, selectedPOI: null, editModeCCTV });
        }
        else {
            if (editModeCCTV !== null) {
                if (!this.editModeManager?.contents3D?.poiManager?.selectedPOI) {
                    this.showConfirmDialog("확인", ["센서가 선택되지 않았습니다.", "확인해주세요."], null, null);
                    return;
                }

                this.setState({ editMode: mode, editModeParam: param, editModeCCTV });
            }
            else {
                this.setState({ editMode: mode, editModeParam: param });
            }
        }
    }

    setEditModeCCTV = (visible) => {
        if (this.state.editMode === Contents3D.Edit_Mode_CCTVGroup) {
            // 구역별 CCTV 편집모드에서는 CCTV창이 항상 보이게 한다.
            this.setState({ editModeCCTV: true });
        }
        else {
            this.setState({ editModeCCTV: visible });
        }
    }

    isEditMode() {
        return this.state.editMode !== Contents3D.Edit_Mode_None;
    }

    isIndoor() {
        const currentBuildingID = this.state.currentView.buildingID;

        if (currentBuildingID !== null && currentBuildingID !== undefined) {
            return true;
        }

        return false;
    }

    async moveSensor(sensorType, sensorID, zoneID, x, y, z) {
        const [success, message] = await SDMSController.requestMoveSensor(sensorType, sensorID, x, z);

        if (success === false) {
            this.showConfirmDialog("에러", [message], null, null);
            //alert(message);
        }

        return success;
    }

    onClickLogo = () => {
        if (this.state._3dOptions.outdoorModel) {
            const cmd = {};
            cmd.menu = SDMSMainMenu.Menu_Show_Outdoor;
            cmd.menuParameter = this.state._3dOptions.outdoorModel;
            //cmd.mode = Contents3D.Mode_Outdoor_All;
            //cmd.modeParameter = this.state._3dOptions.outdoorModel;

            this.setState({ command: cmd });
        }
    }

    /*onChangeMode = (mode, param) => {
        const cmd = {};
        cmd.menu = this.state.command.menu;
        cmd.menuParameter = this.state.command.menuParameter;
        cmd.mode = mode;
        cmd.modeParameter = param;

        console.log(`SDMS.onChangeMode : menu(${mode}, param(${param})`);

        this.setState({ command: cmd });
    }*/

    static getFacilityType(facilityType) {
        let sensorType = SDMSMainMenu.Fire_Sensor;
        if (SDMSResource.isPSMSensorType(facilityType)) {
            sensorType = SDMSMainMenu.PSM_Sensor;
        }
        else if (SDMSResource.isETCSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Etc_Sensor;
        }
        else if (SDMSResource.isSVMSSensorType(facilityType)) {
            sensorType = SDMSMainMenu.CCTV_Type;
        }

        return sensorType;
    }

    addAlarm(zoneID, facilityType, orgSensorID, alarmDepth, equipZoneID, targetCCTVMenu) {
        var sensorType = SDMS.getFacilityType(facilityType);
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID
        
        this.onSelectMenu(SDMSMainMenu.Menu_Add_Alarm, [zoneID, sensorType, orgSensorID, alarmDepth]);

        if (SDMSResource.isSVMSSensorType(facilityType)) {
            alarmCCTVID = orgSensorID;
        }

        this.getEquipZoneCCTV(equipZoneID, targetCCTVMenu, alarmCCTVID);
    }

    moveToSensor(zoneID, facilityType, orgSensorID) {
        var sensorType = SDMS.getFacilityType(facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_MoveTo_POI, [zoneID, sensorType, orgSensorID]);
    }

    async showAlarm(alarm, targetCCTVMenu) {
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID

        const [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm] = SDMS.getAlarmInfo(alarm);

        await this.getEquipZoneCCTV(alarm.equipZoneID, targetCCTVMenu, alarmCCTVID);
        this.onSelectMenu(SDMSMainMenu.Menu_Show_Alarm, [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm]);

        if (alarm.sensorZoneID < 1000000) {
            if (SDMSResource.isSVMSSensorType(alarm.facilityType)) {
                alarmCCTVID = alarm.orgSensorID;
            }

            //this.getEquipZoneCCTV(alarm.equipZoneID, targetCCTVMenu, alarmCCTVID);
        }
    }

    hideAlarm() {
        this.onSelectMenu(SDMSMainMenu.Menu_Hide_Alarm);
    }

    removeAlarm(facilityType, orgSensorID, alarmDepth) {
        var sensorType = SDMS.getFacilityType(facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_Remove_Alarm, [sensorType, orgSensorID, alarmDepth]);
    }

    onSelectedAlarm(alarm) {
        if (this.state.selectedAlarm === alarm) {
            return;
        }

        //this.getEquipZoneCCTV(alarm.equipZoneID);

        this.setState({ selectedAlarm: alarm });
    }

    // 선택된 알람으로 3D 이동
    onMoveSelectedAlarm = (alarm) => {
        const selectedAlarm = alarm;//this.state.selectedAlarm;

        if (selectedAlarm) {
            if (selectedAlarm.sensorZoneID < 1000000) {
                const alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                const alarmCCTV = this.showAlarmCCTV(alarmType, selectedAlarm);
                this.showAlarm(selectedAlarm, alarmCCTV);
            }
            else {
                this.showAlarm(selectedAlarm, null);
            }
        }
    }

    static getAlarmInfo(alarm) {
        var sensorType = SDMS.getFacilityType(alarm.facilityType);
        return [alarm.zoneID, sensorType, alarm.orgSensorID, alarm.alarmDepth, alarm.isAlarm];
    }

    getNextAlarmCCTVMenu() {
        const alarmCCTV1 = this.alarmCCTVs[SDMSResource.ID.menu.alarmCCTV1];

        if (!alarmCCTV1 || alarmCCTV1.length === 0) {
            return SDMSResource.ID.menu.alarmCCTV1;
        }

        const alarmCCTV2 = this.alarmCCTVs[SDMSResource.ID.menu.alarmCCTV2];

        if (!alarmCCTV2 || alarmCCTV2.length === 0) {
            return SDMSResource.ID.menu.alarmCCTV2;
        }

        const alarmCCTV3 = this.alarmCCTVs[SDMSResource.ID.menu.alarmCCTV3];

        if (!alarmCCTV3 || alarmCCTV3.length === 0) {
            return SDMSResource.ID.menu.alarmCCTV3;
        }

        return SDMSResource.ID.menu.alarmCCTV1;
    }

    async getEquipZoneCCTV(equipZoneID, targetCCTVMenu, alarmCCTVID) {
        let cctvList = "";

        if (!targetCCTVMenu) {
            targetCCTVMenu = this.getNextAlarmCCTVMenu();
        }

        // EquipZoneCCTV LIST 조회
        const [success, result] = await SDMSController.getEquipZoneCCTV(equipZoneID);

        if (success === null || success === undefined || success === false) {
            if (!targetCCTVMenu || targetCCTVMenu === SDMS.menu.cctv) {
                this.state.cctvList = cctvList;
            }

            if (targetCCTVMenu && targetCCTVMenu.length > 0) {
                this.alarmCCTVs[targetCCTVMenu] = cctvList;
            }
            //this.setState({ cctvList: cctvList });
            return;
        }

        if (result.cctV1 !== null && result.cctV1 !== undefined) {
            cctvList = this.addCCTVList(cctvList, result.cctV1);
        } 
        if (result.cctV2 !== null && result.cctV2 !== undefined) {
            cctvList = this.addCCTVList(cctvList, result.cctV2);
        } 
        if (result.cctV3 !== null && result.cctV3 !== undefined) {
            cctvList = this.addCCTVList(cctvList, result.cctV3);
        } 
        if (result.cctV4 !== null && result.cctV4 !== undefined) {
            cctvList = this.addCCTVList(cctvList, result.cctV4);
        } 
        if (result.cctV5 !== null && result.cctV5 !== undefined) {
            cctvList = this.addCCTVList(cctvList, result.cctV5);
        }
        if (result.cctV6 !== null && result.cctV6 !== undefined) {
            cctvList = this.addCCTVList(cctvList, result.cctV6);
        } 

        if (!targetCCTVMenu || targetCCTVMenu === SDMS.menu.cctv) {
            this.state.cctvList = cctvList;
        }

        if (targetCCTVMenu && targetCCTVMenu.length > 0) {
            // SVMS CCTV 알람일 경우 해당 CCTV ID 확인 여부
            if (alarmCCTVID !== null && alarmCCTVID !== undefined &&
                alarmCCTVID !== result.cctV1 && alarmCCTVID !== result.cctV2 &&
                alarmCCTVID !== result.cctV3 && alarmCCTVID !== result.cctV4 &&
                alarmCCTVID !== result.cctV5 && alarmCCTVID !== result.cctV6) {
                cctvList = alarmCCTVID + "," + cctvList;
            }

            this.alarmCCTVs[targetCCTVMenu] = cctvList;
        }
        this.setState({ cctvList: cctvList });
    }

    addCCTVList(cctvList, cctvID) {
        if (cctvList.length === 0)
            cctvList = cctvID;
        else
            cctvList += "," + cctvID;

        return cctvList;
    }

    async getStreamServerURL() {
        const streamServerURL = await SDMSController.getStreamServerURL();

        if (streamServerURL !== null || streamServerURL !== undefined)
            this.setState({ streamServerURL: streamServerURL});
    }

    setVisiblePoi(typeName, visible) {
        let types = { ...this.state.visibleSensorTypes };

        // 솔브레인 iot 같은 경우 psm, etc 포함
        if (typeName === "iot") {
            types["psm"] = visible;
            types["etc"] = visible;
        } else
            types[typeName] = visible;
        
        this.setState({ visibleSensorTypes: types });
    }

    setVisiblePopups(menu, visible) {
        if (SDMS.ChkShowHide === true)
            return;

        if (menu === SDMS.menu.workerInfo) {
            return;
        }

        const menus = this.state.visiblePopups;
        const menus_old = Object.assign({}, this.state.visiblePopups);

        if (visible === undefined) {
            if (menu instanceof Array) {
                const menuCount = menu.length;

                for (let i = 0; i < menuCount; i++) {
                    const menuItem = menu[i];
                    menus[menuItem] = !menus[menuItem];
                }
            }
            else {
                
                if (menu === SDMS.menu.allCCTV || menu === SDMS.menu.cctv || menu === SDMS.menu.alarmCCTV1 ||
                    menu === SDMS.menu.alarmCCTV2 || menu === SDMS.menu.alarmCCTV3) {
                    // CCTV 뷰어 열기 이벤트일 경우
                    this.setCCTVPopups(menu, menus);
                }
                else {
                    // 이외에 팝업창
                    menus[menu] = !menus[menu];
                }
                    
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

                // CCTV 뷰어가 다 닫혔을 경우
                if ((menu === SDMS.menu.cctv || menu === SDMS.menu.alarmCCTV1 || menu === SDMS.menu.alarmCCTV2 || menu === SDMS.menu.alarmCCTV3) &&
                    menus[SDMS.menu.cctv] === false &&
                    menus[SDMS.menu.alarmCCTV1] === false &&
                    menus[SDMS.menu.alarmCCTV2] === false &&
                    menus[SDMS.menu.alarmCCTV3] === false &&
                    menus[SDMS.menu.allCCTV] === true)
                    menus[SDMS.menu.allCCTV] = false;

                if (menu === SDMS.menu.cctv && visible === false) {
                    // CCTV 뷰어를 닫을 경우 기존 CCTV 리스트 초기화
                    this.state.cctvList = null;
                }

                // 현황정보를 닫을 경우 초기화한다
                if (menu === SDMS.menu.statusInfo && !visible) {                    
                    this.onChangeBuildingGroup(null, SDMS.SelectedStatusInfoType.none);
                }
            }
        }
        
        //this.setState({ visiblePopups: menus }); 
        // 팝업 닫히는 애니메이션 효과
        this.hideAnimatePopup(menus, menus_old, () => {
            console.log(SDMS.menu.allCCTV + ": " + menus[SDMS.menu.allCCTV], SDMS.menu.alarmCCTV1 + ": " + menus[SDMS.menu.alarmCCTV1]);  
            this.setState({ visiblePopups: menus })
            SDMS.ChkShowHide = false; 
        });
    }

    hideAnimatePopup(menus, menus_old, callback) {
        SDMS.ChkShowHide = true;
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
                    if (key === SDMS.menu.eventInfo && this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
                        hideID = "#" + SDMSResource.popupLayer.event;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.event);
                    }
                    else if (key === SDMS.menu.statusInfo) {
                        hideID = "#" + SDMSResource.popupLayer.statusInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.statusInfo);
                    }
                    else if (key === SDMS.menu.buildingInfo) {
                        hideID = "#" + SDMSResource.popupLayer.buildingInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.buildingInfo);
                    }
                    else if (key === SDMS.menu.weatherInfo) {
                        hideID = "#" + SDMSResource.popupLayer.weatherInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.weatherInfo);
                    }
                    else if (key === SDMS.menu.cctv || key === SDMS.menu.alarmCCTV1 ||
                        key === SDMS.menu.alarmCCTV2 || key === SDMS.menu.alarmCCTV3) {

                        if (key === SDMS.menu.cctv) {
                            hideID = "#" + SDMSResource.popupLayer.cctvInfo;
                        } else if (key === SDMS.menu.alarmCCTV1) {
                            hideID = "#" + SDMSResource.popupLayer.cctvInfo_1;
                        } else if (key === SDMS.menu.alarmCCTV2) {
                            hideID = "#" + SDMSResource.popupLayer.cctvInfo_2;
                        } else if (key === SDMS.menu.alarmCCTV3) {
                            hideID = "#" + SDMSResource.popupLayer.cctvInfo_3;
                        }
                        
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.cctvInfo);
                    }
                    else if (key === SDMS.menu.dashboard) {
                        hideID = "#" + SDMSResource.popupLayer.dashboard;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.dashboard);
                    }
                    else if (key === SDMS.menu.miniMap) {
                        hideID = "#" + SDMSResource.popupLayer.miniMap;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.miniMap);
                    }
                    else if (key === SDMS.menu.manualReport) {
                        hideID = "#" + SDMSResource.popupLayer.manualReport;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.manualReport);
                    }
                    else if (key === SDMS.menu.workerInfo) {
                        hideID = "#" + SDMSResource.popupLayer.workerInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.workerInfo); /* 0929 */
                    }
                    else if (key === SDMS.menu.sensorStatus) {
                        hideID = "#" + SDMSResource.popupLayer.sensorStatus;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.sensorStatus); /* 0929 */
                    }
                    else if (key === SDMS.menu.allCCTV) {
                        if (menus[SDMS.menu.cctv] === true) {
                            if (hideID === null) {
                                hideID = "#" + SDMSResource.popupLayer.cctvInfo;
                            }
                        }
                        if (menus[SDMS.menu.alarmCCTV1] === true) {
                            if (hideID === null) {
                                hideID = "#" + SDMSResource.popupLayer.cctvInfo_1;
                            } else {
                                hideID = hideID + ", #" + SDMSResource.popupLayer.cctvInfo_1;
                            }
                        }
                        if (menus[SDMS.menu.alarmCCTV2] === true) {
                            if (hideID === null) {
                                hideID = "#" + SDMSResource.popupLayer.cctvInfo_2;
                            } else {
                                hideID = hideID + ", #" + SDMSResource.popupLayer.cctvInfo_2;
                            }
                        }
                        if (menus[SDMS.menu.alarmCCTV3] === true) {
                            if (hideID === null) {
                                hideID = "#" + SDMSResource.popupLayer.cctvInfo_3;
                            } else {
                                hideID = hideID + ", #" + SDMSResource.popupLayer.cctvInfo_3;
                            }
                        }

                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.cctvInfo);
                    }
                    // 편집모드 현황정보 창은 닫을 수 없는 팝업창이므로
                    //else if (visibleNew === SDMS.menu.editModeStatusInfo) {
                    //    hidePopups.push(SDMSResource.popupLayer.editModeStatusInfo);
                    //} 
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

    setCCTVPopups(menu, menus) {
        
        // 알람 CCTV 뷰어 열기 이벤트일 경우, 해당 알람 CCTV 뷰어가 아직 열리지 않았다면 제외처리  
        if ((menu === SDMS.menu.alarmCCTV1 || menu === SDMS.menu.alarmCCTV2 || menu === SDMS.menu.alarmCCTV3)) {
            let cctvAlarmChk = false;

            for (let key in this.alarmInfo) {
                if (menu === key)
                    cctvAlarmChk = true;
            }

            if (cctvAlarmChk === false)
                return menus;
        }

        // CCTV 뷰어 열기 이벤트일 경우, CCTV 뷰어가 다 닫혀있을 때 기본 CCTV 뷰어 열기
        if (menu === SDMS.menu.allCCTV &&
            menus[menu] === false &&
            menus[SDMS.menu.cctv] === false &&
            menus[SDMS.menu.alarmCCTV1] === false &&
            menus[SDMS.menu.alarmCCTV2] === false &&
            menus[SDMS.menu.alarmCCTV3] === false)
            menus[SDMS.menu.cctv] = true;
        else if ((menu === SDMS.menu.alarmCCTV1 || menu === SDMS.menu.alarmCCTV2 || menu === SDMS.menu.alarmCCTV3) &&
            menus[menu] === false &&
            menus[SDMS.menu.cctv] === false &&
            menus[SDMS.menu.alarmCCTV1] === false &&
            menus[SDMS.menu.alarmCCTV2] === false &&
            menus[SDMS.menu.alarmCCTV3] === false) 
            menus[SDMS.menu.allCCTV] = true;
        
        menus[menu] = !menus[menu];

        // CCTV 뷰어가 다 닫혔을 경우
        if (menus[SDMS.menu.cctv] === false &&
            menus[SDMS.menu.alarmCCTV1] === false &&
            menus[SDMS.menu.alarmCCTV2] === false &&
            menus[SDMS.menu.alarmCCTV3] === false &&
            menus[SDMS.menu.allCCTV] === true)
            menus[SDMS.menu.allCCTV] = false;

        return menus;
    }

    getVisiblePopups = (menu) => {
        const menus = this.state.visiblePopups;
        return menus[menu];
    }

    moveToX(menu, menuParameter) {
        if (menu === SDMSMainMenu.Menu_MoveTo_BuildingGroup) {
            this.onChangeBuildingGroup(menuParameter, SDMS.SelectedStatusInfoType.buildingGroup);
            this.onSelectMenu(menu, [menuParameter.groupName]);

            // 건물그룹 이동시 기존 선택된 POI 선택해제  - K.D.R
            this.setState({ selectedPOI: null });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_Floor) {
            //this.onChangeBuildingGroup(menuParameter, SDMS.SelectedStatusInfoType.zone);
            this.onSelectMenu(menu, [menuParameter.buildingID, SDMSDataManager.getZoneFloor(menuParameter)]);

            // 건물 이동시 기존 선택된 POI 선택해제  - K.D.R
            this.setState({ selectedPOI: null });
        }
        else {
            this.onSelectMenu(menu, menuParameter);
        }
    }

    onSelectSensor = (sensorType, sensorID, zoneID) => {
        if (!sensorType || !sensorID || !zoneID) {
            this.setState({ selectedPOI: null });
        }
        else {
            this.setState({ selectedPOI: this.makeSelectedPOI(sensorType, zoneID, sensorID) });
            //this.setState({ selectedPOI: [sensorType, sensorID, zoneID] });
        }
    }

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    setActiveDragPopup(popupType) {
        //const popupLayer = { ...this.state.popupLayer };
        //const layerName = popupType + "ZIndex";

        //for (const key in popupLayer) {
        //    if (key === layerName) {
        //        popupLayer[key] = 1;

        //        // 제이쿼리 zIndex 수정
        //        $("#" + popupType).attr("z-index", 1);
        //    }
        //    else {
        //        popupLayer[key] = 0;

        //        // 제이쿼리 zIndex 수정
        //        $("#" + popupType).attr("z-index", 0);
        //    }
        //}
        // CCTV 팝업창이 제대로 동작하지 않아 제이쿼리 방식으로 수정 - K.D.R
        for (const key in SDMSResource.popupLayer) {
            const layerName = SDMSResource.popupLayer[key];

            if (layerName === popupType) {
                $("#" + layerName).css("z-index", 1);
            } else {
                $("#" + layerName).css("z-index", 0);
            }

        }
    }
    /*setActiveDragPopup(layerInfo) {
        this.setState({ popupLayer: layerInfo });
    }*/

    onSound(sound) {
        if (sound !== this.state.alarmSound) {
            this.setState({ alarmSound: sound });
        }
    }

    onNewCCTVPOI = (poi, zoneID, poiManager) => {
        const cctv = this.state.selectedNewCCTV;

        if (cctv) {
            cctv.added = true;
        }

        this.editModeManager.addNewCCTVPOI(poi, zoneID, poiManager);
        this.setState({ selectedNewCCTV: null });
    }

    onDeleteCCTV = (poi, poiManager) => {
        const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

        if (zoneID === null)
            return;

        //const cctv = SDMSDataManager.getSensor(sensorType, zoneID, sensorID, this.state._3dOptions);

        const newCCTVList = [...this.state.newCCTVList];
        const cctvCount = newCCTVList.length;

        for (let i = 0; i < cctvCount; i++) {
            const _cctv = newCCTVList[i];

            if (_cctv.id === sensorID) {
                _cctv.added = false;
                this.editModeManager.deleteNewCCTVPOI(_cctv.id, zoneID);
                this.setState({ newCCTVList });
                return;
            }
        }
        /*for (let i = 0; i < cctvCount; i++) {
            const _cctv = newCCTVList[i];

            if (_cctv.id === cctv.id) {
                _cctv.added = false;
                this.editModeManager.deleteNewCCTVPOI(cctv.id, zoneID);
                this.setState({ newCCTVList });
                return;
            }
        }*/

        const cctv = SDMSDataManager.getSensor(sensorType, zoneID, sensorID, this.state._3dOptions);

        if (cctv) {
            cctv.isIndoor = this.isIndoorCCTV(cctv, zoneID);
            this.editModeManager.addDeleteCCTVPOI(cctv, zoneID, poiManager);
            cctv.added = false;
            newCCTVList.push(cctv);
            this.setState({ newCCTVList });
        }
    }

    isIndoorCCTV(cctv, zoneID) {
        const zoneData = this.state._3dOptions.zones[zoneID];

        if (zoneData) {
            return true;
        }

        return false;
    }

    onSelectNewCCTV = (cctv) => {
        const selectedCCTV = this.state.selectedNewCCTV;

        if (selectedCCTV === cctv) {
            this.setState({ selectedNewCCTV: null });
        }
        else {
            this.setState({ selectedNewCCTV: cctv });
        }
    }

    getRangeSensor(sensorID, sensorType) {
        const rangeSensors = [...this.state.rangeSensors];

        for (const sensor of rangeSensors) {
            if (sensor.id.toString() === sensorID.toString() && sensor.sensorType === sensorType) {
                return sensor;
            }
        }

        return null;
    }

    containsSelectedSensor(sensor) {
        const rangeSensors = [...this.state.selectedRangeSensors];

        for (const rangeSensor of rangeSensors) {
            if (sensor.id === rangeSensor.id) {
                return [rangeSensors, true];
            }
        }

        return [rangeSensors, false];
    }

    onSelectSensorPOI = (sensorID, sensorType, poi, poiManager, onlyOne) => {
        const isEditMode = false;

        if (!isEditMode) {
            const sensor = this.getRangeSensor(sensorID, sensorType);

            if (sensor) {
                const [selectedSensors, contains] = onlyOne ? [[], false] : this.containsSelectedSensor(sensor);

                const visiblePopups = { ...this.state.visiblePopups };
                visiblePopups[SDMS.menu.sensorStatus] = true;

                if (contains === false) {
                    // 배열의 첫요소로 삽입
                    selectedSensors.unshift(sensor);
                }

                this.setState({ selectedRangeSensors: selectedSensors, visiblePopups });
            }
        }
    }

    changeToAllSensor = () => {
        const visiblePopups = { ...this.state.visiblePopups };
        visiblePopups[SDMS.menu.sensorStatus] = true;

        this.setState({ selectedRangeSensors: [], visiblePopups });
    }

    onSelectCCTV = (cctvID, poi, poiManager) => {
        const isEditMode = this.isEditMode();

        if (!isEditMode || (isEditMode && this.state.editModeCCTV)) {
            var menus = this.state.visiblePopups;
            menus[SDMS.menu.allCCTV] = true;
            menus[SDMS.menu.cctv] = true;

            if (this.state.editMode === Contents3D.Edit_Mode_CCTVGroup) {
                if (this.state.editModeParam === CCTVInfo.Mode_Select_CCTV) {
                    if (this.containCCTV(cctvID) === false) {
                        const cctvList = this.getCCTVList(cctvID);
                        const equipZoneCCTV = this.makeEquipZoneCCTV(cctvList);
                        poiManager.selectEquipZoneCCTVs(equipZoneCCTV);

                        // 최대 4개의 CCTV까지 표시하는 방식
                        this.setState({ cctvList: cctvList, visiblePopups: menus, selectedPOI: [poi, false] });
                    }
                }
            }
            else {
                if (this.containCCTV(cctvID) === false) {
                    this.setState({ cctvList: this.getCCTVList(cctvID), visiblePopups: menus, selectedPOI: [poi, false] });
                    // 하나의 CCTV만 표시하는 방식
                    //this.setState({ cctvList: cctvID, visiblePopups: menus, selectedPOI: [poi, false] });
                }
                else {
                    // 이미 CCTV 팝업에 영상이 있어도 POI 선택은 되도록 수정 - K.D.R
                    this.setState({ selectedPOI: [poi, false] });
                }
            }
        }
        else if (isEditMode) {
            this.setState({ selectedPOI: [poi, false] });
        }
    }

    makeEquipZoneCCTV(cctvList) {
        const equipZoneCCTV = {
            cctV1: null,
            cctV2: null,
            cctV3: null,
            cctV4: null
        }

        if (!cctvList) {
            return equipZoneCCTV;
        }

        const ids = cctvList.toString().split(',');
        const cctvCount = ids.length;

        for (let i = 0; i < cctvCount; i++) {
            const id = ids[i].trim();
            const cctvID = parseInt(id);

            if (cctvID !== null && cctvID !== undefined && isNaN(cctvID) === false) {
                if (equipZoneCCTV.cctV1 === null) {
                    equipZoneCCTV.cctV1 = cctvID;
                }
                else if (equipZoneCCTV.cctV2 === null) {
                    equipZoneCCTV.cctV2 = cctvID;
                }
                else if (equipZoneCCTV.cctV3 === null) {
                    equipZoneCCTV.cctV3 = cctvID;
                }
                else if (equipZoneCCTV.cctV4 === null) {
                    equipZoneCCTV.cctV4 = cctvID;
                    break;
                }
            }
        }

        return equipZoneCCTV;
    }

    containCCTV(cctvID) {
        const cctvList = this.state.cctvList;

        if (!cctvList) {
            return false;
        }

        const ids = cctvList.toString().split(',');
        const count = ids.length;

        const _cctvID = cctvID.toString();

        for (let i = 0; i < count; i++) {
            const id = ids[i].trim();

            if (id === _cctvID) {
                return true;
            }
        }

        return false;
    }

    getCCTVList(cctvID) {
        const cctvList = this.state.cctvList;

        if (!cctvList) {
            return cctvID;
        }

        const ids = cctvList.toString().split(',');
        const count = ids.length;

        if (count === 0) {
            return cctvID;
        } else if (count <= 3) {
            //return cctvList + "," + cctvID;
            return cctvID + ',' + cctvList;
        }

        let strCCTVList = "";

        //for (let i = count - 3; i < count; i++) {
        //    if (i === count - 3) {
        //        strCCTVList = ids[i].trim();
        //    }
        //    else {
        //        strCCTVList += "," + ids[i].trim();
        //    }
        //}
        for (let i = 0; i < 3; i++) {
            if (i === 0) {
                strCCTVList = ids[i].trim();
            } else {
                strCCTVList += "," + ids[i].trim();
            }
        }

        //return strCCTVList + "," + cctvID;
        return cctvID + ',' + strCCTVList;
    }

    setCCTVList = (cctvList) => {
        const equipZoneCCTV = this.makeEquipZoneCCTV(cctvList);
        this.editModeManager.contents3D.poiManager.selectEquipZoneCCTVs(equipZoneCCTV);
        this.setState({ cctvList });
    }

    showBuildingInfo = (type, arrInfo) => {

        // TODO: 샘플 데이터 예시
        /*arrInfo = new Array();
        arrInfo[0] = SDMSResource.ID.buildingInfo.equipmentType;         // 건물 or 설비
        arrInfo[1] = "HF 탱크";                                          // 설비 이름
        arrInfo[2] = "HF";                                               // 취급물질(대표)
        arrInfo[3] = "안준후";                                           // 담당자
        arrInfo[4] = "010-123-1234";                                     // 담당자 연락처*/

        // EDMS에서 건물정보는 의미가 없다.
        /*const menus = this.state.visiblePopups;

        if (arrInfo) {
            //menus[SDMS.menu.statusInfo] = true;
            menus[SDMS.menu.buildingInfo] = true;
        } else {
            menus[SDMS.menu.buildingInfo] = false;
        }

        this.setState({ buildingInfo: arrInfo, visiblePopups: menus });*/
    }

    setCurrentView = (zoneID) => {
        if (this.state.currentView.zoneID !== zoneID) {
            let buildingID = null;
            let zoneName = '';

            if (zoneID !== null) {
                const zone = this.state._3dOptions.zones[zoneID];

                if (zone) {
                    buildingID = zone[1];
                    zoneName = zone[3];
                }
            }

            this.setState({ currentView: {buildingID, zoneID, zoneName}});
        }
    }

    resetPopupState = (popupState) => {
        if (popupState === null || popupState === undefined)
            return;

        //let data = popupState;

        //if (data.actionType === 'ResetPopup') {
            //this.setState({ popupState: data.popupState });
            this.setState({ popupState: popupState });
        //}
    }

    setRangeSensorStatus(storeValue) {
        if (storeValue.rangeSensors) {
            if (this.isSameRangeSensors(storeValue.rangeSensors) === false) {
                this.setState({ rangeSensors: storeValue.rangeSensors });
            }
        }
    }

    isSameRangeSensors(rangeSensors) {
        const oldSensors = [...this.state.rangeSensors];

        const oldCount = oldSensors.length;
        const newCount = rangeSensors.length;

        if (oldCount !== newCount) {
            for (let i = 0; i < newCount; i++) {
                const newSensor = rangeSensors[i];
                newSensor.prevValue = 0;
            }

            return false;
        }

        const selectedRangeSensors = {};
        const originSelectedRangeSensors = [...this.state.selectedRangeSensors];

        for (const sensor of originSelectedRangeSensors) {
            selectedRangeSensors[sensor.id.toString()] = sensor;
        }

        let isSame = true;

        for (let i = 0; i < newCount; i++) {
            const oldSensor = oldSensors[i];
            const newSensor = rangeSensors[i];

            if (oldSensor.currentData !== newSensor.currentData) {
                isSame = false;
            }

            newSensor.prevValue = oldSensor.currentData;

            const selectedSensor = selectedRangeSensors[newSensor.id.toString()];

            if (selectedSensor) {
                if (selectedSensor.currentData !== newSensor.currentData) {
                    selectedSensor.currentData = newSensor.currentData;
                    isSame = false;
                }
            }
        }

        return isSame;
    }

    initMoveDisplayAlarm = () => {
        let moveDisplayAlarm = SettingsStore.getState().moveDisplayAlarm;

        this.setMoveDisplayAlarm(moveDisplayAlarm);
    }

    setMoveDisplayAlarm = (move) => {
        if (move === null || move === undefined)
            return;

        let moveDisplayAlarm = this.state.moveDisplayAlarm;

        if (moveDisplayAlarm !== move) {
            this.setState({ moveDisplayAlarm: move });
        }
    }

    async initDashboardSensors() {
        const [result, message] = await DashboardController.requestUseSensor();

        if (result !== null && result !== undefined) {
            this.setState({ dashboardSensors: result });
        }
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
            this.setState({ popupState: popupState });
        }
    }

    async reloadSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteID();

            if (result !== null && result !== undefined) {
                siteID = result;
            }
        }

        return siteID;
    }

    //팝업 크기, 위치값 저장
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
            this.setState({ popupState: popupState });
        }
    }

    //cctv 전체화면 설정
    setCctvFullScreenState(cctvFullScreenState) {
        this.setState({
            cctvFullScreenState: {
                isFullScreen: cctvFullScreenState.isFullScreen,
                url: cctvFullScreenState.url,
                cctvName: cctvFullScreenState.cctvName,
                w: cctvFullScreenState.w,
                h: cctvFullScreenState.h
            }
        });

    }

    onChangeBuildingGroup2(poi) {
        const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

        const [buildingGroup, building, zone] = this.getSpatialInfo(zoneID);
        return [buildingGroup, building, zone, sensorType];
    }

    onChangeBuildingGroup = (value, type) => {
        const selectedStatusInfo = this.state.selectedStatusInfo;

        selectedStatusInfo.sensorGroups = false;
        selectedStatusInfo.fireSensors = false;
        selectedStatusInfo.psmSensors = false;
        selectedStatusInfo.etcSensors = false;
        selectedStatusInfo.exitLightGroups = false;
        selectedStatusInfo.exitLightSubGroups = false;
        selectedStatusInfo.cctvGroups = false;
        selectedStatusInfo.cctvSubGroups = false;
        selectedStatusInfo.facilityGroups = false;
        selectedStatusInfo.facilitySubGroups_fire = false;
        selectedStatusInfo.facilitySubGroups_air = false;
        selectedStatusInfo.facilitySubGroups_electric = false;
        selectedStatusInfo.facilitySubGroups_panel = false;

        if (type === SDMS.SelectedStatusInfoType.buildingGroup) {
            selectedStatusInfo.buildingGroup = value;
            // 빌딩 그룹이 선택될 경우 기존에 빌딩, 층 정보는 null값 처리 - K.D.R
            selectedStatusInfo.building = null;
            selectedStatusInfo.zone = null;
        }
        else if (type === SDMS.SelectedStatusInfoType.building) {
            selectedStatusInfo.building = value;
            // 빌딩이 선택될 경우 기존에 층 정보는 null값 처리 - K.D.R
            selectedStatusInfo.zone = null;
        }
        else if (type === SDMS.SelectedStatusInfoType.zone) {
            selectedStatusInfo.zone = value;
        }
        else if (type === SDMS.SelectedStatusInfoType.closeZone) {
            // 층 트리가 열린 상태에서 다시 클릭하면 닫혀야 하는데 props값이 열린 상태로 유지되어서 닫히지 않는 오류 >> 층 트리가 닫힐 경우도 추가 - K.D.R
            selectedStatusInfo.zone = null;
        }
        else if (type === SDMS.SelectedStatusInfoType.sensorGroups) {
            selectedStatusInfo.sensorGroups = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.fireSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.fireSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.psmSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.psmSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.etcSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.etcSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.exitLightGroups) {
            selectedStatusInfo.exitLightGroups = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.exitLightSubGroups) {
            selectedStatusInfo.exitLightGroups = true;
            selectedStatusInfo.exitLightSubGroups = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.cctvGroups) {
            selectedStatusInfo.cctvGroups = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.cctvSubGroups) {
            selectedStatusInfo.cctvGroups = true;
            selectedStatusInfo.cctvSubGroups = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.facilityGroups) {
            selectedStatusInfo.facilityGroups = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.facilitySubGroups_fire) {
            selectedStatusInfo.facilityGroups = true;
            selectedStatusInfo.facilitySubGroups_fire = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.facilitySubGroups_air) {
            selectedStatusInfo.facilityGroups = true;
            selectedStatusInfo.facilitySubGroups_air = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.facilitySubGroups_electric) {
            selectedStatusInfo.facilityGroups = true;
            selectedStatusInfo.facilitySubGroups_electric = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.facilitySubGroups_panel) {
            selectedStatusInfo.facilityGroups = true;
            selectedStatusInfo.facilitySubGroups_panel = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.none) {
            if (selectedStatusInfo.buildingGroup === null)
                return;

            selectedStatusInfo.buildingGroup = null;
            selectedStatusInfo.building = null;
            selectedStatusInfo.zone = null;
        }

        // 다른 공간의 POI 및 설비 클릭하여 이동시 선택이 풀려서 주석처리  - K.D.R
        //this.setState({ selectedStatusInfo, selectedPOI: null });
        this.setState({ selectedStatusInfo });
    }

    getSelectedSensorInfo() {
        const selectedPOI = this.state.selectedPOI;

        if (selectedPOI) {
            if (selectedPOI.length === 2 && selectedPOI[0] && selectedPOI[0].object) {
                return SDMS.getSensorInfo(selectedPOI[0]);

                /*const name = selectedPOI[0].object.name;

                const index1 = name.indexOf('_');
                const index2 = name.lastIndexOf('_');

                if (index1 < 0 || index2 <= index1) {
                    return [null, null, null];
                }

                const sensorType = name.substring(0, index1).trim();
                const strZoneID = name.substring(index1 + 1, index2).trim();
                const strSensorID = name.substring(index2 + 1).trim();

                const zoneID = parseInt(strZoneID);
                const sensorID = parseInt(strSensorID);

                if (sensorType.length > 0 &&
                    zoneID !== null && zoneID !== undefined && zoneID !== NaN &&
                    sensorID !== null && sensorID !== undefined && sensorID !== NaN) {
                    return [sensorType, zoneID, sensorID];
                }*/
            }
            else if (selectedPOI.length === 3) {
                const sensorType = selectedPOI[0];
                const zoneID = selectedPOI[1];
                const sensorID = selectedPOI[2];
                return this.makeSelectedPOI(sensorType, zoneID, sensorID);
                //return [selectedPOI[0], selectedPOI[2], selectedPOI[1]];
            }
        }

        /*if (selectedPOI && selectedPOI.length >= 2 && selectedPOI[0].object) {
            const name = selectedPOI[0].object.name;

            const index1 = name.indexOf('_');
            const index2 = name.lastIndexOf('_');

            if (index1 < 0 || index2 <= index1) {
                return [null, null, null];
            }

            const sensorType = name.substring(0, index1).trim();
            const strZoneID = name.substring(index1 + 1, index2).trim();
            const strSensorID = name.substring(index2 + 1).trim();

            const zoneID = parseInt(strZoneID);
            const sensorID = parseInt(strSensorID);

            if (sensorType.length > 0 &&
                zoneID !== null && zoneID !== undefined && zoneID !== NaN &&
                sensorID !== null && sensorID !== undefined && sensorID !== NaN) {
                return[sensorType, zoneID, sensorID];
            }
        }*/

        return [null, null, null];
    }

    static getSensorInfo(poi) {
        if (!poi) {
            return [null, null, null];
        }

        const name = poi.object ? poi.object.name : poi.name;

        const index1 = name.indexOf('_');
        const index2 = name.lastIndexOf('_');

        if (index1 < 0 || index2 <= index1) {
            return [null, null, null];
        }

        const sensorType = name.substring(0, index1).trim();
        const strZoneID = name.substring(index1 + 1, index2).trim();
        const strSensorID = name.substring(index2 + 1).trim();

        const zoneID = parseInt(strZoneID);
        const sensorID = parseInt(strSensorID);

        if (sensorType.length > 0 &&
            zoneID !== null && zoneID !== undefined && isNaN(zoneID) === false &&
            sensorID !== null && sensorID !== undefined && isNaN(sensorID) === false) {
            return [sensorType, zoneID, sensorID];
        }

        return [null, null, null];
    }

    isMultiSite() {
        const site3dOptions = { ...this.state.site3dOptions };
        let siteCount = 0;

        for (const siteID in site3dOptions) {
            siteCount++;
        }

        return siteCount > 1;
    }

    changeSite = (siteID) => {
        const _3dOptions = this.state.site3dOptions[siteID];

        if (_3dOptions) {
            const command = {
                menu: SDMSMainMenu.Menu_MoveTo_Site,
                    menuParameter: siteID
            }

            this.setState({ currentSiteID: siteID, _3dOptions, command });
        }
    }

    getRangeSensorsForSensorStatus() {
        const rangeSensors = [...this.state.rangeSensors];
        const selectedSensors = [...this.state.selectedRangeSensors];

        if (selectedSensors.length === 0) {
            return [rangeSensors, true];
        }

        return [selectedSensors, false];
    }

    closeInfoBox = () => {
        this.setState({ infoBoxData: null, infoBoxElectricData: null, infoBoxRowData: null});
    }

    showInfoBox = async (modelName, sensor, x, y) => {
        if (modelName && modelName.startsWith(PipeManager.AirFan_Data.beginTag) === false) {
            const result = await SDMSController.requestFacilityInfoData(modelName);

            if (sensor && sensor.facilityType === SdmsResource.facilityType.ETC) {
                this.onSelectSensor(SDMSMainMenu.Etc_Sensor, sensor.id, sensor.zoneID);
                this.setSelectedStatusInfoFromEtcSensor(sensor);
            }

            this.setInfoBoxElectric(result, sensor, x, y);
        }
        else {
            if (sensor && sensor.facilityType === SdmsResource.facilityType.ETC) {
                this.onSelectSensor(SDMSMainMenu.Etc_Sensor, sensor.id, sensor.zoneID);
                this.setSelectedStatusInfoFromEtcSensor(sensor);
            }

            this.setInfoBoxRowData(sensor, x, y);
        }
    }

    isAlarmSensor(sensor) {
        if (!sensor) {
            return false;
        }

        const sensorAlarms = this.state.sensorAlarms;

        if (sensorAlarms) {
            const alarms = [...sensorAlarms];

            for (const alarm of alarms) {
                if (alarm.sensorZoneID === sensor.sensorZoneID) {
                    return alarm.isAlarm;
                }
            }
        }

        return false;
    }

    setInfoBoxElectric(data, sensor, x, y) {
        if (!data?.facilityName) {
            this.setInfoBoxRowData(sensor, x, y);
            //this.setState({ infoBoxData: null, infoBoxElectricData: null });
            return;
        }

        const index1 = data.facilityName.lastIndexOf('(');
        const index2 = data.facilityName.lastIndexOf(')');

        if (index1 < 0 || index2 <= index1) {
            this.setInfoBoxRowData(sensor, x, y);
            return;
        }

        const sensorName = data.facilityName.substring(0, index1);
        const materialTypeNo = data.facilityName.substring(index1 + 1, index2);
        const materialType = parseInt(materialTypeNo);

        if (materialType === SdmsResource.materialType.ElectricFacility) {
            const isAlarm = this.isAlarmSensor(sensor);

            const electricData = {
                sensorName: sensorName,
                dir: !this.state.currentView?.buildingID ? true : false,
                isAlarm: isAlarm,
                status: isAlarm ? '알람' : '운전중',
                x: x,
                y: y
            }

            this.setState({ infoBoxData: null, infoBoxElectricData: electricData, infoBoxRowData: null });
        }
        else {
            this.setState({ infoBoxData: null, infoBoxElectricData: null, infoBoxRowData: null });
        }
    }

    setInfoBoxData(data, x, y) {
        if (!data || data.success === false) {
            this.setState({ infoBoxData: null });
        }
        else {
            const infoBoxData = {
                name: data.facilityName,
                description: '',
                x: x,
                y: y,
                properties: InfoBox.getProperties(data.datas)
            }

            this.setState({ infoBoxData });
        }
    }

    showInfoBoxRow = (sensor, x, y) => {
        this.setInfoBoxRowData(sensor, x, y);
    }

    setInfoBoxRowData(sensor, x, y) {
        let infoBoxRowData = null;
        
        if (sensor) {
            const isAlarm = this.isAlarmSensor(sensor);

            if (sensor.materialType === SdmsResource.materialType.PanelFacility) {
                infoBoxRowData = {
                    title: sensor.name,
                    items: [
                        { name: 'VCB', value: '투입' },
                        { name: '전압', value: '48.5°C', redValue: isAlarm },
                        { name: '전류', value: '20A' },
                        { name: '전력', value: '48Kw' },
                        { name: '전력량', value: '48.005kWh' },
                        { name: 'Alarm', value: isAlarm ? '알람' : '정상', icon: isAlarm ? { red: true } : { green: true } }
                    ],
                    x: x,
                    y: y
                }
            }
            else if (sensor.materialType === SdmsResource.materialType.FireFacility) {
                const statusText = isAlarm ? '알람' : '정상';
                const icon = isAlarm ? { red: true } : { green: true };

                infoBoxRowData = {
                    title: sensor.name,
                    items: [
                        { name: '설비위치', value: sensor.positionName },
                        { name: 'Door Open', value: statusText, icon: icon },
                        { name: '밸브 Open', value: statusText, icon: icon },
                        { name: '펌프기동', value: statusText, icon: icon }
                    ],
                    x: x,
                    y: y
                }
            }
            else {
                infoBoxRowData = {
                    title: sensor.name,
                    items: [
                        { name: '설비위치', value: sensor.positionName },
                        { name: '운전상태', value: isAlarm ? '알람' : '정상', icon: isAlarm ? { red: true } : { green: true } }
                    ],
                    x: x,
                    y: y
                }
            }
        }

        this.setState({ infoBoxData: null, infoBoxElectricData: null, infoBoxRowData });
    }

    setPopupUI(visiblePopups) {
        const [sensorType, zoneID, sensorID] = this.getSelectedSensorInfo();
        const multiSite = this.isMultiSite();

        var popups = [];
        if (visiblePopups[SDMS.menu.eventInfo]) {
            if (!this.isEditMode() && this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
                popups.push(
                    <Event key='sdms_popup_event'
                        sensorAlarms={this.state.sensorAlarms}
                        selectedAlarm={this.state.selectedAlarm}
                        onSelectedAlarm={this.onSelectedAlarm}
                        onMoveSelectedAlarm={this.onMoveSelectedAlarm}
                        setVisiblePopups={this.setVisiblePopups}
                        setActiveDragPopup={this.setActiveDragPopup}
                        zIndex={this.state.popupLayer.eventZIndex}
                        popupType={SDMSResource.popupLayer.event}
                        popupState={this.state.popupState.event}
                        setPopupState={this.setPopupState}
                        alarmSound={this.state.alarmSound}
                        onSound={this.onSound}
                        onMalfunction={this.onMalfunction}
                        alarmInfo={this.alarmInfo}
                        onAuthorError={this.onAuthorError}
                        showConfirmDialog={this.showConfirmDialog}
                        closeConfirmDialog={this.closeConfirmDialog}
                        buildingGroupList={this.state.buildingGroupList}

                        popupStateAlarmMemo={this.state.popupState.alarmMemo}
                        zIndexAlarmMemo={this.state.popupLayer.alarmMemoZIndex}
                        popupTypeAlarmMemo={SDMSResource.popupLayer.alarmMemo}
                    />
                );
            }
            else {
                visiblePopups[SDMS.menu.eventInfo] = false;
            }
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.statusInfo]) {
            const selectedStatusInfo = { ...this.state.selectedStatusInfo };

            popups.push(
                <StatusInfo key='sdms_popup_statusInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    multiSite={multiSite}
                    buildingGroupList={this.state.buildingGroupList}
                    outdoorZones={this.state._3dOptions.outdoorZones}
                    zoneList={this.state._3dOptions.zones}
                    buildingIDs={this.state._3dOptions.buildingIDs}
                    indoorModels={this.state._3dOptions.indoorModels}
                    sensorList={this.state.sensorList}
                    moveToX={this.moveToX}
                    onSelectSensor={this.onSelectSensor}
                    selectedSensor={[sensorType, zoneID, sensorID]}
                    selectedInfo={selectedStatusInfo}
                    selectedFacility={this.state.selectedFacility}
                    onChangeBuildingGroup={this.onChangeBuildingGroup}
                    sensorAlarms={this.state.sensorAlarms}
                    visibleSensorTypes={this.state.visibleSensorTypes}
                    setVisiblePoi={this.setVisiblePoi}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.statusInfoZIndex}
                    popupType={SDMSResource.popupLayer.statusInfo}
                    popupState={this.state.popupState.statusInfo}
                    setPopupState={this.setPopupState}
                    facilityInfos={this.state.facilityInfos}
                    newCCTVList={this.state.newCCTVList}
                    setEditModeItem={this.setEditModeItem}
                />
            );
        }
        
        if (visiblePopups[SDMS.menu.buildingInfo]) {
            popups.push(
                <BuildingInfo key='sdms_popup_buildingInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.buildingInfoZIndex}
                    popupType={SDMSResource.popupLayer.buildingInfo}
                    info={this.state.buildingInfo}
                    popupState={this.state.popupState.buildingInfo}
                    setPopupState={this.setPopupState}
                />);
        }
        

        if (!this.isEditMode() && visiblePopups[SDMS.menu.weatherInfo]) {
            popups.push(
                <WeatherInfo key='sdms_popup_weatherInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.weatherInfoZIndex}
                    popupType={SDMSResource.popupLayer.weatherInfo}
                    info={this.state.weatherInfo}
                    popupState={this.state.popupState.weatherInfo}
                    setPopupState={this.setPopupState}
                />);
        }
        if ((visiblePopups[SDMS.menu.allCCTV] && visiblePopups[SDMS.menu.cctv] && !this.isEditMode()) ||
            (this.isEditMode() && this.state.editModeCCTV)) {
            const selectedCCTVID = SDMSMainMenu.isCCTVType(sensorType) ? sensorID : null;

            popups.push(
                <CCTVInfo key='sdms_popup_cctvInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    cctvList={this.state.cctvList}
                    streamServerURL={this.state.streamServerURL}
                    cctvs={this.state.sensorList['cctvs']}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.cctvInfoZIndex}
                    popupType={SDMSResource.popupLayer.cctvInfo}
                    popupState={this.state.popupState.cctvInfo}
                    setPopupState={this.setPopupState}
                    cctvFullScreenState={this.state.cctvFullScreenState}
                    setCctvFullScreenState={this.setCctvFullScreenState}
                    setCCTVList={this.setCCTVList}
                    editMode={this.state.editMode}
                    editModeParam={this.state.editModeParam}
                    editModeManager={this.editModeManager}
                    editModeCCTV={this.state.editModeCCTV}
                    setEditModeCCTV={this.setEditModeCCTV}
                    menu={SDMS.menu.cctv}
                    selectedCCTVID={selectedCCTVID}
                />
            );
        }

        this.showAlarmCCTVPopups(visiblePopups, popups);

        if (!this.isEditMode() && visiblePopups[SDMS.menu.dashboard]) {
            popups.push(
                <Dashboard key='sdms_popup_dashBoard'
                    selectedAlarm={this.state.selectedAlarm}
                    setVisiblePopups={this.setVisiblePopups}
                    sensorCount={this.state.sensorCount}
                    zIndex={this.state.popupLayer.dashboardZIndex}
                    popupType={SDMSResource.popupLayer.dashboard}
                    popupState={this.state.popupState.dashboard}
                    setActiveDragPopup={this.setActiveDragPopup}
                    setPopupState={this.setPopupState}
                    buildingGroupList={this.state.buildingGroupList}
                    dashboardSensors={this.state.dashboardSensors}

                />
            );
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.miniMap]) {
            popups.push(
                <MiniMap key='sdms_popup_miniMap'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.miniMapZIndex}
                    popupType={SDMSResource.popupLayer.miniMap}
                    popupState={this.state.popupState.miniMap}
                    setPopupState={this.setPopupState}
                    currentView={this.state.currentView}
                    walker={this.state.walker}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.workerInfo]) {  /* 0929 */
            /*popups.push(
                <WorkerInfo key='sdms_popup_workerInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.workerInfoZIndex}
                    popupType={SDMSResource.popupLayer.workerInfo}
                    popupState={this.state.popupState.workerInfo}
                    setPopupState={this.setPopupState}
                />);*/
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.sensorStatus]) {  /* 0929 */
            const [rangeSensors, isAll] = this.getRangeSensorsForSensorStatus();

            popups.push(
                <SensorStatus key='sdms_popup_sensorStatus'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.sensorStatusZIndex}
                    popupType={SDMSResource.popupLayer.sensorStatus}
                    popupState={this.state.popupState.sensorStatus}
                    setPopupState={this.setPopupState}
                    visibleSensorTypes={this.state.visibleSensorTypes}
                    setVisiblePoi={this.setVisiblePoi}
                    changeToAllSensor={this.changeToAllSensor}
                    sensors={rangeSensors}
                    isAllSensor={isAll}
                    sensorCount={this.state.sensorCount}
                />);
        } 
        if (this.isEditMode()) {
            popups.push(<EditModeStatusInfo key='sdms_popup_editModeStatusInfo'
                multiSite={multiSite}
                buildingGroupList={this.state.buildingGroupList}
                outdoorZones={this.state._3dOptions.outdoorZones}
                buildingIDs={this.state._3dOptions.buildingIDs}
                indoorModels={this.state._3dOptions.indoorModels}
                zoneList={this.state._3dOptions.zones}
                sensorList={this.state.sensorList}
                newCCTVList={this.state.newCCTVList}
                selectedNewCCTV={this.state.selectedNewCCTV}
                onSelectNewCCTV={this.onSelectNewCCTV}
                onSelectSensor={this.onSelectSensor}
                selectedSensor={[sensorType, zoneID, sensorID]}
                moveToX={this.moveToX}
                editMode={this.state.editMode}
                editModeParam={this.state.editModeParam}
                setEditModeItem={this.setEditModeItem}
                editModeManager={this.editModeManager}
                visibleSensorTypes={this.state.visibleSensorTypes}
                setVisiblePoi={this.setVisiblePoi}
                setActiveDragPopup={this.setActiveDragPopup}
                zIndex={this.state.popupLayer.editModeStatusInfoZIndex}
                popupType={SDMSResource.popupLayer.editModeStatusInfo}
                popupState={this.state.popupState.editModeStatusInfo}
                setPopupState={this.setPopupState}
                selectedInfo={this.state.selectedStatusInfo}
                selectedFacility={this.state.selectedFacility}
                onChangeBuildingGroup={this.onChangeBuildingGroup}
            />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.manualReport]) {
            popups.push(
                <ManualReport key='sdms_popup_manualReport'
                    setVisiblePopups={this.setVisiblePopups}
                    buildingGroupList={this.state.buildingGroupList}
                    outdoorZones={this.state._3dOptions.outdoorZones}

                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.manualReportZIndex}
                    popupType={SDMSResource.popupLayer.manualReport}
                    popupState={this.state.popupState.manualReport}
                    setPopupState={this.setPopupState}
                    currentView={this.state.currentView}
                />);
        }

        // 우선순위1
        if (this.state.infoBoxData) {
            popups.push(
                <InfoBox data={this.state.infoBoxData} closeInfoBox={this.closeInfoBox} />
            );
        }
        // 우선순위2
        else if (this.state.infoBoxElectricData) {
            popups.push(
                <InfoBoxElectric data={this.state.infoBoxElectricData} closeInfoBox={this.closeInfoBox} />
            );
        }
        // 우선순위3
        else if (this.state.infoBoxRowData) {
            popups.push(
                <InfoBoxRow data={this.state.infoBoxRowData} closeInfoBox={this.closeInfoBox} />
            );
        }

        return popups;
    }

    setEscapeVisble(visibleSensorTypes, sensorType, zoneID, sensorID) {
        visibleSensorTypes[SDMSMainMenu.Escape_02] = false;
        visibleSensorTypes[SDMSMainMenu.Escape_03] = false;
        visibleSensorTypes[SDMSMainMenu.Escape_04] = false;
        visibleSensorTypes[SDMSMainMenu.Escape_05] = false;

        const targetZoneID = 10;

        if (this.state.sensorAlarms) {
            const sensorAlarms = [...this.state.sensorAlarms];

            for (const alarm of sensorAlarms) {
                if (alarm.isAlarm && alarm.zoneID === targetZoneID) {
                    visibleSensorTypes[SDMSMainMenu.Escape_02] = true;
                    visibleSensorTypes[SDMSMainMenu.Escape_03] = true;
                    visibleSensorTypes[SDMSMainMenu.Escape_04] = true;
                    visibleSensorTypes[SDMSMainMenu.Escape_05] = true;
                    return visibleSensorTypes;
                }
            }
        }

        if (sensorType === SDMSMainMenu.ExitLight_Sensor) {
            if (zoneID === targetZoneID) {
                if (sensorID === 51) {
                    visibleSensorTypes[SDMSMainMenu.Escape_02] = true;
                    visibleSensorTypes[SDMSMainMenu.Escape_03] = true;
                }
                else if (sensorID === 52) {
                    visibleSensorTypes[SDMSMainMenu.Escape_04] = true;
                    visibleSensorTypes[SDMSMainMenu.Escape_05] = true;
                }
            }
        }

        return visibleSensorTypes;
    }

    showAlarmCCTVPopups(visiblePopups, popups) {
        // 알람 CCTV창은 하나만 나오도록 한다.
        for (let i = 1; i <= 1; i++) {
            this.showAlarmCCTVPopup(i, SDMSResource.ID.menu.alarmCCTV + "_" + i, visiblePopups, popups);
        }

        this.FocusAlarmCCTVPopup();
    }

    showAlarmCCTVPopup(index, menu, visiblePopups, popups) {
        if (visiblePopups[SDMS.menu.allCCTV] && visiblePopups[menu] && !this.isEditMode()) {
            //const key = 'sdms_popup_cctvInfo_' + index;
            let key = 'sdms_popup_cctvInfo_' + this.alarmInfo[menu][1].sensorZoneHistoryID;

            const popupType = SDMSResource.popupLayer.cctvInfo + "_" + index;
            const selectedAlarm = this.state.selectedAlarm;
            let cctvList = null;
            let alarmInfo = null;

            if (!selectedAlarm) {
                return;
            }

            // 알람 CCTV창은 하나만 나오도록 한다.
            for (const menuName in this.alarmCCTVs) {
                const alarmData = this.alarmInfo[menuName];

                if (alarmData && alarmData.length >= 2 && alarmData[1].sensorZoneHistoryID === selectedAlarm.sensorZoneHistoryID) {
                    cctvList = this.alarmCCTVs[menuName];
                    alarmInfo = alarmData;
                    break;
                }
            }

            if (cctvList) {
                popups.push(
                    <CCTVInfo key={key}
                        setVisiblePopups={this.setVisiblePopups}
                        cctvList={cctvList}
                        streamServerURL={this.state.streamServerURL}
                        cctvs={this.state.sensorList['cctvs']}
                        setActiveDragPopup={this.setActiveDragPopup}
                        zIndex={this.state.popupLayer[popupType + "ZIndex"]}
                        popupType={popupType}
                        popupState={this.state.popupState[popupType]}
                        setPopupState={this.setPopupState}
                        cctvFullScreenState={this.state.cctvFullScreenState}
                        setCctvFullScreenState={this.setCctvFullScreenState}
                        setCCTVList={this.setCCTVList}
                        editMode={this.state.editMode}
                        editModeParam={this.state.editModeParam}
                        editModeManager={this.editModeManager}
                        alarmInfo={alarmInfo}
                        /*alarmInfo={this.alarmInfo[menu]}*/
                        menu={menu}
                        selectedAlarm={this.state.selectedAlarm}
                    />
                );
            }
        }
    }

    FocusAlarmCCTVPopup = () => {
        // 기존 포커스 해제
        $(".cctvAlarmPopup").removeClass(content.dslGrdAct);

        const selectedAlarm = this.state.selectedAlarm;

        // 해당 알람CCTV 팝업만 하이라이트
        if (selectedAlarm !== null && selectedAlarm !== undefined) {
            $(".cctvAlarm_" + selectedAlarm.sensorZoneHistoryID).addClass(content.dslGrdAct);
        }
    }

    //onClickCloseBroadcast = (e) => {
    //    this.showConfirmDialog(SdmsResource.ID.common.confirm,
    //        SdmsResource.ID.broadcast.closeInfo,
    //        [SdmsResource.ID.broadcast.closeBroadcast, SdmsResource.ID.common.cancel],
    //        this.onClickCloseBroadcastOption
    //    );
    //}

    //onClickCloseBroadcastOption = (index) => {
    //    if (index === 0) {
    //        this.closeBroadcast();
    //    }
    //    else {
    //        console.log("취소");
    //    }

    //    const confirmMessage = { ...this.state.confirmMessage };
    //    confirmMessage.visible = false;
    //    this.setState({ confirmMessage });
    //}

    //async closeBroadcast() {
    //    const settings = [
    //        {
    //            "name": "CloseAlarmBroadcast",
    //            "value": "1"
    //        }
    //    ];

    //    const [success, message] = await SettingController.requestUpdateSdmsSettings(settings);

    //    if (!success && message !== null) {
    //        alert(message);
    //    }
    //}

    //broadcastIsRunning() {
    //    const run = this.state.commonSettings?.RunAlarmBroadcast;

    //    if (run) {
    //        const param = parseInt(run);

    //        if (param && param > 0) {
    //            return true;
    //        }
    //    }

    //    return false;
    //}

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

    closeConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;
        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    setMovingAvatar = (walker) => {
        this.setState({ walker: walker });
    }

    getFacilityModel(facilityID) {
        const facilities = [...this.state.facilityInfos];
        const facilityCount = facilities.length;

        for (let i = 0; i < facilityCount; i++) {
            const facility = facilities[i];

            if (facility.id === facilityID) {
                return { ...facility };
            }
        }

        return null;
    }

    getFacility(facilityModelName, fromFacilityName) {
        const facilities = [...this.state.facilityInfos];
        const facilityCount = facilities.length;

        for (let i = 0; i < facilityCount; i++) {
            const facility = facilities[i];

            if (fromFacilityName) {
                if (SDMS.getFacilityName(facility.facilityName) === facilityModelName) {
                    return { ...facility };
                }
            }
            else {
                if (facility.modelName === facilityModelName) {
                    return { ...facility };
                }
            }
        }

        return null;
    }

    static getFacilityName(facilityName) {
        const index1 = facilityName.lastIndexOf('(');
        const index2 = facilityName.lastIndexOf(')');

        if (index1 && index2 && index1 < index2) {
            return facilityName.substring(0, index1);
        }

        return facilityName;
    }

    selectFacility = (obj, fromFacilityName) => {
        
        if (obj === null) {
            this.setState({ selectedFacility: { facilityID: -1, modelName:''} });
            return null;
        }

        const facilityInfo = this.getFacility(obj.name, fromFacilityName);

        if (!facilityInfo) {
            this.setState({ selectedFacility: {facilityID: -1, modelName: ''} });
            return null;
        }

        const facility = this.state.selectedFacility;
        facility.facilityID = facilityInfo.id;
        facility.modelName = facilityInfo.modelName;
        //facility.modelName = obj.name;

        const [buildingGroup, building, zone] = this.getSpatialInfo(facilityInfo.zoneID);
        const selectedStatusInfo = { ...this.state.selectedStatusInfo };
        selectedStatusInfo.buildingGroup = buildingGroup;
        selectedStatusInfo.building = building;
        selectedStatusInfo.zone = zone;
        selectedStatusInfo.sensorGroups = false;
        selectedStatusInfo.fireSensors = false;
        selectedStatusInfo.psmSensors = false;
        selectedStatusInfo.etcSensors = false;
        selectedStatusInfo.exitLightGroups = false;
        selectedStatusInfo.exitLightSubGroups = false;
        selectedStatusInfo.cctvGroups = false;
        selectedStatusInfo.cctvSubGroups = false;
        selectedStatusInfo.facilityGroups = true;

        selectedStatusInfo.facilitySubGroups_fire = false;
        selectedStatusInfo.facilitySubGroups_air = false;
        selectedStatusInfo.facilitySubGroups_electric = false;
        selectedStatusInfo.facilitySubGroups_panel = false;

        if (obj.materialType === SDMSResource.materialType.FireFacility) {
            selectedStatusInfo.facilitySubGroups_fire = true;
        }
        else if (obj.materialType === SDMSResource.materialType.AirFacility) {
            selectedStatusInfo.facilitySubGroups_air = true;
        }
        else if (obj.materialType === SDMSResource.materialType.ElectricFacility) {
            selectedStatusInfo.facilitySubGroups_electric = true;
        }
        else if (obj.materialType === SDMSResource.materialType.PanelFacility) {
            selectedStatusInfo.facilitySubGroups_panel = true;
        }
        else {
            return;
        }

        const selectedPOI = this.makeSelectedPOI(SDMSMainMenu.Etc_Sensor, obj.zoneID, obj.id);
        //const selectedPOI = [SDMSMainMenu.Etc_Sensor, obj.id, obj.zoneID];

        this.setState({ selectedStatusInfo, selectedFacility: facility, selectedPOI });
        return facility.facilityID;
    }

    getSpatialBuildingGroupInfo(buildingGroupName) {
        const buildingGroupCount = this.state.buildingGroupList.length;
        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = this.state.buildingGroupList[i];
            if (buildingGroup.groupName === buildingGroupName) {
                return buildingGroup
            }
        }

        return null;
    }

    getSpatialInfo(zoneID) {
        if (zoneID > 0) {
            if (zoneID >= 20000) {

                return [this.state._3dOptions.outdoorZones, this.state._3dOptions.outdoorZones, this.state._3dOptions.outdoorZones[zoneID]];
            }
            else {
                const buildingGroupCount = this.state.buildingGroupList.length;
                for (let i = 0; i < buildingGroupCount; i++) {
                    const buildingGroup = this.state.buildingGroupList[i];
                    const buildingCount = buildingGroup.buildingDatas.length;
                    for (let j = 0; j < buildingCount; j++) {
                        const building = buildingGroup.buildingDatas[j];
                        const zoneCount = building.zoneDatas.length;
                        for (let k = 0; k < zoneCount; k++) {
                            const zone = building.zoneDatas[k];
                            if (!zone)
                                continue;

                            if (zoneID === zone.id) {
                                return [buildingGroup, building, zone];
                            }
                        }
                    }
                }
            }
        }

        return [null, null, null];
    }

    onCompleteOutdoorModelLoading = (siteID) => {
        const buildingGroupList = [...this.state.buildingGroupList];
        const buildingGroupCount = buildingGroupList.length;

        for (let i = 0; i < buildingGroupCount;i++) {
            const buildingGroup = buildingGroupList[i];

            if (buildingGroup.siteID.toString() === siteID) {
                buildingGroup.completeLoading = true;
            }
        }

        this.setState({ buildingGroupList });
    }

    render() {
        if (this.state.loading) {
            return (
                <></>
            );
        }

        const visiblePopups = { ...this.state.visiblePopups };
        const popupUI = this.setPopupUI(visiblePopups);
        const isEditMode = this.isEditMode();

        const [sensorType, zoneID, sensorID] = this.getSelectedSensorInfo();
        const visibleSensorTypes = this.setEscapeVisble({ ...this.state.visibleSensorTypes }, sensorType, zoneID, sensorID);

        return (
            <div className={styles.bodyArea} style={{ MozUserSelect: 'none', WebkitUserSelect: 'none' }}>
                {
                    /*isEditMode &&*/
                    <EditMenus
                        isEditMode={isEditMode}
                        setEditMode={this.setEditMode}
                        setEditModeItem={this.setEditModeItem}
                        setEditModeCCTV={this.setEditModeCCTV}
                        saveEditDatas={this.saveEditDatas}
                        currentZoneName={this.state.currentView.zoneName}
                        editMode={this.state.editMode}
                        editModeParam={this.state.editModeParam}
                        editModeCCTV={this.state.editModeCCTV}
                    />
                }
                {
                    /*<SDMSMainMenu showMenuArea={this.state.showMenuArea} _3dOptions={this.state._3dOptions} selectedPOI={this.state.selectedPOI} onSelectMenu={this.onSelectMenu} />*/
                }
                {<Contents3D
                    site3dOptions={this.state.site3dOptions}
                    _3dOptions={this.state._3dOptions}
                    multiSite={this.isMultiSite()}
                    currentSiteID={this.state.currentSiteID}
                    command={this.state.command}
                    setVisiblePopups={this.setVisiblePopups}
                    getVisiblePopups={this.getVisiblePopups}
                    sensorList={this.state.sensorList}
                    onSelectMenu={this.onSelectMenu}
                    visibleSensorTypes={visibleSensorTypes}
                    onSelectCCTV={this.onSelectCCTV}
                    alarmSound={this.state.alarmSound}
                    showBuildingInfo={this.showBuildingInfo}
                    onSelectPOI={this.onSelectPOI}
                    selectedSensor={[sensorType, zoneID, sensorID]}
                    setCurrentView={this.setCurrentView}
                    currentView={this.state.currentView}
                    visiblePopups={visiblePopups}
                    initOutdoorViewport={this.onClickLogo}
                    setEditMode={this.setEditMode}
                    setManualReport={this.setManualReport}
                    editMode={this.state.editMode}
                    editModeParam={this.state.editModeParam}
                    editModeManager={this.editModeManager}
                    isEditMode={isEditMode}
                    selectedNewCCTV={this.state.selectedNewCCTV}
                    onNewCCTVPOI={this.onNewCCTVPOI}
                    onDeleteCCTV={this.onDeleteCCTV}
                    setMovingAvatar={this.setMovingAvatar}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    sensorAlarms={this.state.sensorAlarms}
                    newCCTVList={this.state.newCCTVList}
                    getFacilityModel={this.getFacilityModel}
                    selectFacility={this.selectFacility}
                    onChangeBuildingGroup={this.onChangeBuildingGroup}
                    getSpatialInfo={this.getSpatialInfo}
                    onCompleteOutdoorModelLoading={this.onCompleteOutdoorModelLoading}
                    changeSite={this.changeSite}
                    selectedPOI={this.state.selectedPOI}
                    onSelectSensorPOI={this.onSelectSensorPOI}
                    selectedAlarm={this.state.selectedAlarm}
                    getSpatialBuildingGroupInfo={this.getSpatialBuildingGroupInfo}
                    showInfoBox={this.showInfoBox}
                    showInfoBoxRow={this.showInfoBoxRow}
                    facilityInfos={this.state.facilityInfos}
                    onSelectSensorModel={this.onSelectSensorModel}
                    getEdmsFacility={this.getEdmsFacility}
                    setSelectedPOI={this.setSelectedPOI}
                />}
                {
                    (this.state.selectedAlarm !== null && this.state.selectedAlarm.isAlarm)
                        ? <EventDashboard selectedAlarm={this.state.selectedAlarm} sensorList={this.state.sensorList} />
                        : <></>
                }
                {popupUI}
                {/*
                    this.broadcastIsRunning() &&
                    <img ref={this.refBroadcast} className={styles.closeBroadcast} src={imgCloseBroadcast} title={SdmsResource.ID.broadcast.close} onClick={this.onClickCloseBroadcast}/>
                */}
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </div>
        );
    }
}


export default SDMS;