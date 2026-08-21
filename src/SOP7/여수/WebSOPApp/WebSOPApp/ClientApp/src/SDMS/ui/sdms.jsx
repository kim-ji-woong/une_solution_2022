import React, { Component } from 'react';
import styles from '../css/sdms.module.css';
import content from '../../Common/css/content.module.css';
import { SDMSController } from '../services/sdmsController';
import { SensorSimulatorController } from '../../SensorSimulator/services/sensorSimulatorController';
import { SDMSDataManager } from '../services/sdmsDataManager';
import SDMSResource from '../resource/id';
import SDMSMainMenu from './sdmsMainMenu';
import uis from '../../Common/css/ui.module.css';
import $, { post } from 'jquery';
import store from '../../Root/store';
import Event from './popups/event';
import EventDashboard from './popups/eventDashboard';
import BuildingInfo from './popups/buildingInfo';
import StatusInfo from './popups/statusInfo';
import CCTVInfo from './popups/cctvInfo';
import MiniMap from './popups/miniMap';
import Dashboard from './popups/dashboard';
import DetailInfo from './popups/detailInfo';
import SensorStatus from './popups/sensorStatus';
import NavInfo from './popups/navInfo';
import POIEditInfo from './popups/poiEditInfo';
import EventInfo from './popups/eventInfo';
import AtmospherePopup from './popups/AtmospherePopup';
import WaterQualityPopup from './popups/waterQualityPopup';
import WeatherPopup from './popups/weatherPopup';
import VOCInfo from './popups/VOCdetailInfo';
import VOCDetailInfo from './popups/VOCdetailInfo';
import CCTVPopup from './popups/cctvPopup';
import DataInfo from './popups/dataInfo';

import SettingsStore from '../../Settings/settingsStore';
import SettingResource from '../../Settings/resource/id';

import WeatherInfo from './popups/weatherInfo';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import ManualReport from './popups/manualReport';
import { DashboardController } from '../../Dashboard/services/dashboardController';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';

import ModeMenuBar from '../../SDMS/ui/modeMenuBar';
import SdmsResource from '../resource/id';
import { SettingController } from '../../Settings/services/settingController';

import YeosuLogo from '../../Common/image/common/yeosuLogo_W.png';
import View360Popup from './popups/view360Popup';
import { Link } from 'react-router-dom';

import { wsProcessManager } from '../services/wsProcessManager';

import proj4 from 'proj4';
import BacteriaPopup from './popups/BacteriaPopup';


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
        detailInfo: SDMSResource.ID.menu.detailInfo, /* 0929 */
        sensorStatus: SDMSResource.ID.menu.sensorStatus, /* 0929 */
        navInfo: SDMSResource.ID.menu.navInfo, /* yeosu */
        poiEditInfo: SDMSResource.ID.menu.poiEditInfo, /* yeosu */
        atmospherePopup: SDMSResource.ID.menu.atmospherePopup, /* yeosu */
        waterQualityPopup: SDMSResource.ID.menu.waterQualityPopup, /* yeosu */
        weatherPopup: SDMSResource.ID.menu.weatherPopup, /* yeosu */
        vocInfo: SDMSResource.ID.menu.vocInfo, /* yeosu */
        vocDetailInfo: SDMSResource.ID.menu.vocDetailInfo, /* yeosu */
        cctvPopup: SDMSResource.ID.menu.cctvPopup, /* yeosu */
        dataInfo: SDMSResource.ID.menu.dataInfo,
        view360Popup: SDMSResource.ID.menu.view360Popup,
        bacteriaPopup: SDMSResource.ID.menu.bacteriaPopup, /* yeosu */
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
        facilitySubGroups: 11,
        closeZone: 12
    }

    static ChkShowHide = false;     // 팝업 열리고 닫히고 애니메이션 동작 중인지 체크

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            alarmLoading: true,
            timer: true,
            site3dOptions: {},
            currentSiteID: null,
            _3dOptions: {},
            sensorAlarms: store.getState().sensorAlarm,
            sensorOnAlarms: null,
            sensorCount: store.getState().sensorCount,
            selectedAlarm: null,
            alarmSound: false,
            idleTime: 1000 * 60 * 15,
            useIdleTime: true,
            command:
            {
                menu: null,
                menuParameter: null
            },
            showMenuArea: false,
            visiblePopups: {},
            //preVisiblePopups: {},
            cctvList: null,
            buildingInfo: {},
            weatherInfo:
            {
                selectedIndex: 0,
                datas: store.getState().weatherDatas
            },
            buildingGroupList: [],
            sensorList: {},
            sensorHistories: {},
            materials: {},
            materialLinks: null,
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
                detailInfoZIndex: 0, /* 0929 */
                sensorStatusZIndex: 0, /* 0929 */
                navInfoZIndex: 0,
                poiEditInfo: 0,
                dataInfoZIndex: -1,
                eventInfoZIndex: 0,
                atmospherePopupZIndex: 0,
                waterQualityPopupZIndex: 0,
                weatherPopupZIndex: 0,
                bacteriaPopupZIndex: 0,
                vocInfoZIndex: 0,
                vocDetailInfoZIndex: 0,
                cctvPopupZIndex: 0,
                view360Popup: -1,
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
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
            dashboardSensors: null,
            moveDisplayAlarm: SettingResource.moveDisplayAlarm.lastAlarm,
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
                facilitySubGroups: null,
            },
            rangeSensors: [],
            selectedRangeSensors: [],
            selectedSensor: null,
            selectedSensorInfo: {
                sensorType: 0,
                sensor: 0,
            },
            xrayMode: [false, -1, 'SDMS', 'viewMode'],
            autoRotation: false,
            idleAutoRotation: false,
            onClickSameAlarm: null,

            sensorZoneHistories: [],

            publicDatas: null,
            sensorDatas: null,

            image360Sensor: null,
            externalSensorLink: null,

            testParam: false,
            
            prevSensorID: null,
        }

        /*
            SDMS 이외의 페이지를 새창에서 열지 않으면 
            Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
            발생
        */
        this.isMount = true;

        this.wsMgr = this.props.wsMgr;

        this.props = props;
        //this.refFileDialog = React.createRef();

        this.onSelectedAlarm = this.onSelectedAlarm.bind(this);
        this.isSameAlarmTrue = this.isSameAlarmTrue.bind(this);
        this.setVisiblePopups = this.setVisiblePopups.bind(this);
        this.moveToX = this.moveToX.bind(this);
        this.setVisiblePoi = this.setVisiblePoi.bind(this);
        this.onSound = this.onSound.bind(this);
        this.setActiveDragPopup = this.setActiveDragPopup.bind(this);
        this.onClickMalfunction = this.onClickMalfunction.bind(this);
        this.getFacilityModelName = this.getFacilityModelName.bind(this);
        this.getSpatialInfo = this.getSpatialInfo.bind(this);
        this.getSpatialBuildingGroupInfo = this.getSpatialBuildingGroupInfo.bind(this);
        this.onSelectedSensor = this.onSelectedSensor.bind(this);
        this.requestSensorList = this.requestSensorList.bind(this);
        this.firstSensorAlarm = this.firstSensorAlarm.bind(this);

        this.getStreamServerURL();
        this.updateSensorCoordinates();

        // CCTV창 별로 연결된 알람의 데이터
        this.alarmInfo = {};
        this.alarmCCTVs = {};

        store.subscribe(function () {
            this.changeAlarm(store.getState());
            this.changeSensorCount(store.getState());
            //this.changeWeather(store.getState());
            //this.changeCommonSettings(store.getState());
            this.setRangeSensorStatus(store.getState());

            const data = store.getState();

            if (data.actionType === 'SENSOR_LIST') {
                //this.requestSensorList();
                this.subscribeSensorList(store.getState().sensorList);
            }
            if (data.actionType === 'SENSOR_HISTORY') {
                this.subscribeSensorHistory(store.getState().sensorHistory);
            }

            if (data.actionType === 'PUBLIC_DATA') {
                // PulicData Redux

                const result = store.getState();

                const data = result.publicData;

                this.setPublicData(data);
            }

            if (data.actionType === 'SOCKET_ACTION') {

                const data = store.getState();

                const socketAction = data.socketAction;

                // 3D상에서 POI 선택시 클라이언트에서도 센서가 선택되도록 한다. actionType = 1
                if (socketAction) {
                    if (socketAction.actionType === 1) {

                        let sensorID = parseInt(socketAction.parameter);

                        const [sensorType, sensor] = this.getSensorFromSensorID(sensorID);

                        if (sensorType !== null && sensorType !== undefined && sensor !== null && sensor !== undefined) {
                            SDMS.ChkShowHide = false;

                            this.onSelectedSensor(sensorType, sensor, true)
                        }
                    }

                    // 시연용 임의 센서
                    if (socketAction.actionType === 2) {
                        if (socketAction.parameter === 1) {
                            this.testOn();
                        } else if (socketAction.parameter === 0) {
                            this.testOff();
                        }
                    }

                    //if (socketAction.actionType === 3) {
                    //    this.sendTestSMS();
                    //}

                }
            }

            if (data.actionType === 'TEST_ACTION') {
                const result = store.getState();

                const data = result.testAction;
                if (data !== undefined && data !== null) {
                    this.sendTestSMS();
                }
            }

        }.bind(this));

        this.initMoveDisplayAlarm();

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'RESET_POPUP') {
                this.resetPopupState(data.popupState);
            } else if (data.actionType === 'SETTINGS') {
                this.sendIdleTime(data.idleTime);
            } else if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                this.changeSDMSCommonSettings(data.sdmsCommonSettings);
                this.setMoveDisplayAlarm(data.moveDisplayAlarm);
            }

        }.bind(this));

        this.setPopupState = this.setPopupState.bind(this);
        this.getPopupState = this.getPopupState.bind(this);

        this.setCctvFullScreenState = this.setCctvFullScreenState.bind(this);

        this.refBroadcast = React.createRef();

        this.user = null;
        this.lastMouseMoveTime = new Date();
        this.lastAutoRotationCommandTime = new Date();

        this.init();

    }
    
    subscribeSensorHistory = (sensorHistories) => {
        if (!sensorHistories) {
            return;
        }
        
        this.setState({ sensorHistories: sensorHistories }, () => sensorHistories = null);
    }

    subscribeSensorList = (sensorList) => {
        if (!sensorList) {
            return;
        }
        
        const materialLinks = this.state.materialLinks;
        
        if (materialLinks === null || materialLinks === undefined) 
            return;
        
        let result = {};
        if (sensorList.fireSensors) {
            result['fireSensors'] = sensorList.fireSensors;
        }
        if (sensorList.psmSensors) {
            result['psmSensors'] = sensorList.psmSensors;
        }
        if (sensorList.etcSensors) {
            const [atmospheres, waters, weathers, vocs, stinks] = this.getSplitedSensors(sensorList.etcSensors);
            
            if (atmospheres === null || waters === null || weathers === null || vocs === null || stinks === null)
                return;
            
            if (atmospheres.length === 0 || waters.length === 0 || weathers.length === 0 || vocs.length === 0 || stinks.length === 0)
                return;
            
            result['atmospheres'] = atmospheres;
            result['waters'] = waters;
            result['weathers'] = weathers;
            result['vocs'] = vocs;
            result['stinks'] = stinks;
        }
        if (sensorList.atmospheres) {
            result['atmospheres'] = sensorList.atmospheres;
        }
        if (sensorList.waters) {
            result['waters'] = sensorList.waters;
        }
        if (sensorList.weathers) {
            result['weathers'] = sensorList.weathers;
        }
        if (sensorList.vocs) {
            result['vocs'] = sensorList.vocs;
        }
        if (sensorList.stinks) {
            result['stinks'] = sensorList.stinks;
        }
        
        this.setPanelData(sensorList, null, materialLinks);
        
        return this.setState({ sensorList: result }, () => result = null);
    }

    getSplitedSensors = (etcs) => {
        if (!etcs)
            return;
        
        let atmospheres = [];
        let waters = [];
        let weathers = [];
        let vocs = [];
        let stinks = [];
        
        if (this.state.sensorDatas === null || this.state.sensorDatas === undefined) {
            //const result = await SDMSController.requestSensorDatas();
            //sensorDatas = result.sensorDatas;
            return [atmospheres, waters, weathers, vocs, stinks];
        }
        
        let sensorDatas = this.state.sensorDatas;
        
        for (let i = 0; i < etcs.length; i++) {
            let etc = etcs[i];
            
            for (let j = 0; j < sensorDatas.length; j++) {
                let zoneInfo = sensorDatas[j];
                let zoneID = zoneInfo.sensorID;
                let sensorType = zoneInfo.sensorType;

                if (etc.zoneID === zoneID) {
                    if (sensorType === 1) {
                        atmospheres.push(etc);
                    } else if (sensorType === 2) {
                        waters.push(etc);
                    } else if (sensorType === 3) {
                        weathers.push(etc);
                    } else if (sensorType === 4) {
                        vocs.push(etc);
                    } else if (sensorType === 6) {
                        stinks.push(etc);
                    }
                }
            }
        }
        
        return [atmospheres, waters, weathers, vocs, stinks];
            
    }
        

    _setState(state, callback) {
        if (this.isMount) {
            this.setState(state, callback);
        }
    }
    
    sendIdleTime(storeValue) {
        const idleTime = storeValue ? storeValue : {};

        if (idleTime === undefined || idleTime === null)
            return;

        if (idleTime.constructor === Object && Object.keys(idleTime).length === 0)
            return;

        const arrIdleTime = idleTime.split(';');
        const value = parseInt(arrIdleTime[0]);
        const use = parseInt(arrIdleTime[1]);

        if (value === undefined || value === null)
            return;

        if (use === undefined || use === null)
            return;

        if (this.wsMgr) {
            this.wsMgr.sendAutoRotationTime(value, use);
        }
    }

    testOn = () => {

        // XrayModeOn , EventPanelOn , StatusInfoPanel
        if (this.wsMgr) {
            this.wsMgr.changeViewMode(2); // XrayMode

            this.onSound(true, true);

            this._setState({ testParam: true }, () => this.setXrayMode(true));
        }

    }

    testOff = () => {
        if (this.wsMgr) {
            this.wsMgr.changeViewMode(1);

            this.onSound(false, true);

            this._setState({ testParam: false }, () => this.setXrayMode(false));
        }
    }

    sendTestSMS = () => {
        // test SMS 작성
        const message = "";
        SDMSController.requestTestSMS(message);
    }

    getSensorFromSensorID= (sensorID) => {

        let sensorType = null
        let sensor = null;

        let sensors = [];
        let sensorInfos = [];

        if (this.state.sensorDatas !== null && this.state.sensorDatas !== undefined) {
            sensorInfos = this.state.sensorDatas;
        }
        const sensorList = this.state.sensorList;

        // sensorType  1:대기 , 2:수질 , 3:기상 , 4:VOC

        if (sensorInfos) {
            for (let i = 0; i < sensorInfos.length; i++) {
                let sensorInfo = sensorInfos[i];

                if (sensorInfo.sensorID === sensorID) {
                    if (sensorInfo.sensorType === 1) {
                        sensorType = StatusInfo.AtmosphereType;
                        sensors = sensorList.atmospheres;
                    } else if (sensorInfo.sensorType === 2) {
                        sensorType = StatusInfo.WaterType;
                        sensors = sensorList.waters;
                    } else if (sensorInfo.sensorType === 3) {
                        sensorType = StatusInfo.WeatherType;
                        sensors = sensorList.weathers;
                    } else if (sensorInfo.sensorType === 4) {
                        sensorType = StatusInfo.VocType;
                        sensors = sensorList.vocs;
                    } else if (sensorInfo.sensorType === 6) {
                        sensorType = StatusInfo.BacterialType;
                        sensors = sensorList.stinks;
                    }
                }
            }
        }


        for (let k = 0; k < sensors.length; k++) {
            if (sensorID === sensors[k].zoneID) {
                sensor = sensors[k];
                break;
            }
        }

        return [sensorType, sensor]

    }

    initVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[SDMSMainMenu.Fire_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.CCTV_Type] = true;
        visibleSensorTypes[SDMSMainMenu.PSM_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Etc_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.EquipZoneName] = true;

        return visibleSensorTypes;
    }

    componentDidMount() {
        this.props.menuEvent.handler = this.onSelectMenu;
        this.props.menuEvent.onClickLogo = this.onClickLogo;

        this.requestSensorList();

        this.setViewMode();

        /*this.initRotation();*/

        // this.set3DOptions();

        // 처음부터 뜰 메뉴
        var visiblePopups = this.state.visiblePopups;
        visiblePopups[SDMS.menu.statusInfo] = true;
        visiblePopups[SDMS.menu.allCCTV] = false;
        visiblePopups[SDMS.menu.cctv] = false;
        visiblePopups[SDMS.menu.alarmCCTV1] = false;
        visiblePopups[SDMS.menu.alarmCCTV2] = false;
        visiblePopups[SDMS.menu.alarmCCTV3] = false;
        visiblePopups[SDMS.menu.dashboard] = true;
        visiblePopups[SDMS.menu.eventInfo] = false;
        visiblePopups[SDMS.menu.miniMap] = true;
        visiblePopups[SDMS.menu.weatherInfo] = false;
        visiblePopups[SDMS.menu.manualReport] = false;
        visiblePopups[SDMS.menu.detailInfo] = false; /* 0929 */
        visiblePopups[SDMS.menu.sensorStatus] = false; /* 0929 */
        visiblePopups[SDMS.menu.navInfo] = true; /* yeosu */
        visiblePopups[SDMS.menu.poiEditInfo] = false; /* yeosu */
        visiblePopups[SDMS.menu.atmospherePopup] = false; /* yeosu */
        visiblePopups[SDMS.menu.waterQualityPopup] = false; /* yeosu */
        visiblePopups[SDMS.menu.weatherPopup] = false; /* yeosu */
        visiblePopups[SDMS.menu.vocInfo] = false; /* yeosu */
        visiblePopups[SDMS.menu.vocDetailInfo] = false; 
        visiblePopups[SDMS.menu.cctvPopup] = false; /* yeosu */
        visiblePopups[SDMS.menu.dataInfo] = false;
        visiblePopups[SDMS.menu.visiblePopups] = false;
        visiblePopups[SDMS.menu.view360Popup] = false;
        visiblePopups[SDMS.menu.bacteriaPopup] = false /* yeosu */

        this._setState({ visiblePopups: visiblePopups });

        this.refreshAlarm();

        // 각 페이지 별로 클래스 초기화
        $('#mainSB').addClass(uis.posi_relative);
        $('#headerSB').addClass(uis.posiHeaderWrap);
        $('#headerSB').removeClass(uis.appHeaderWrap);

        //팝업 상태값 일괄 획득
        this.getPopupState();

        // 대시보드 센서 목록 초기화
        this.initDashboardSensors();


        const user = ProjectResource.getUserInfo();
        this.user = user;

        proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=1000000 +y_0=2000000 +ellps=WGS84 +units=m +no_defs'); // elips = bessel

    }

    componentWillUnmount() {
        this.isMount = false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.refBroadcast.current) {
            const dashboard = document.getElementById(SDMSResource.popupLayer.dashboard);

            if (dashboard) {
                const rectDashboard = dashboard.getBoundingClientRect();
                const broadcastRight = rectDashboard.right + 11;
                this.refBroadcast.current.style.left = broadcastRight + 'px';
            }
        }
    }

    setPanelData = (sensorList, alarms, materialLinks) => {

        if (sensorList === null || sensorList === undefined)
            return;

        if (materialLinks === null || materialLinks === undefined)
            return;

        let noneRangeSensors = [];

        noneRangeSensors = this.getNoneRangeSensors(sensorList);

        let resultArray = [];

        for (let i = 0; i < noneRangeSensors.length; i++) {

            // 센서 패널 만들기 (대기 , 수질 , 악취 )
            const entireSensor = noneRangeSensors[i];

            const zoneID = entireSensor.zoneID;
            const sensors = entireSensor.sensors;

            for (const sensor of sensors) {

                //elementArray = [water.zoneID, indiSensor.sensorTypeName, indiSensor.uoM, indiSensor.value, false];

                if (this.isNoneDangerSensorValue(sensor, materialLinks) === true) { // 온도 습도 풍향 풍속일 경우 (위험도가 없고 패널상에 표현하지 않음)
                    continue;
                }

                let valueInfo = this.isDangerSensorValue(sensor, materialLinks);

                let element = this.makePanelElement(
                    zoneID,
                    sensor.sensorTypeName,
                    sensor.uoM,
                    valueInfo.value,
                    valueInfo.isAlarmed);

                resultArray.push(element);
            }
        }
        if (this.wsMgr) {
            this.wsMgr.sendPanels(resultArray);
        }
        
        resultArray = null;
    }

    makePanelElement = (zoneID, sensorTypeName, uoM, value, isAlarmed) => {

        if (zoneID === null || zoneID === undefined) {
            zoneID = "null";
        }

        let modSensorTypeName = "";

        if (sensorTypeName === null || sensorTypeName === undefined || sensorTypeName === "") {
            sensorTypeName = "null";
        } else {
            modSensorTypeName = sensorTypeName.replace(/,/g, '!');
        }

        if (uoM === null || uoM === undefined || uoM === "") {
            uoM = "null";
        }

        if (value === null || value === undefined || value === "") {
            value = "null";
        }

        let element = [
            zoneID,
            modSensorTypeName,
            uoM,
            value,
            isAlarmed
        ];

        return element;

    }

    isNoneDangerSensorValue = (sensor, materialLinks) => {
        const sensorType = sensor.sensorType;

        for (let i = 0; i < materialLinks.length; i++) {
            const materialLink = materialLinks[i];

            if (sensorType === materialLink.materialID) {
                if (materialLink.min1 === null &&
                    materialLink.max1 === null &&
                    materialLink.min2 === null &&
                    materialLink.max2 === null)
                {
                    return true;
                }
            }
        }
        return false;
    }

    isDangerSensorValue = (sensor, materialLinks) => { // 여수는 4단계 알람만 사용

        let valueInfo = {
            value: null,
            isAlarmed: false
        }

        let value = sensor.value;

        if (value === null || value === undefined) {
            valueInfo.isAlarmed = false;

            return valueInfo
        }

        let direction = null;
        let dir1 = null; // 임계치 정방향
        let dir0 = null; // 임계치 반대방향 (작아질수록 나빠지는 임계치)

        for (let i = 0; i < materialLinks.length; i++) {
            const curMaterialID = sensor.sensorType;
            const targetMaterial = materialLinks[i];

            if (curMaterialID === targetMaterial.materialID) {
                direction = targetMaterial.direction;

                if (direction === 1) {
                    dir1 = targetMaterial.min2; // 3단계 이상 : 패널 주황색 , 4단계 이상 : 패널 빨간색

                        valueInfo.value = parseFloat(value);
                    if (parseFloat(value) > parseFloat(dir1)) {
                        valueInfo.isAlarmed = true;
                    }
                    return valueInfo;
                }

                if (direction === 0) {
                    dir0 = targetMaterial.min1;

                        valueInfo.value = parseFloat(value);
                    if (parseFloat(value) < parseFloat(dir0)) {
                        valueInfo.isAlarmed = true;
                    }
                    return valueInfo;
                }
            }
        }

    }

    getNoneRangeSensors = (sensors) => { // 유형별 센서 나눠놓은거 다시 합쳐서 패널 만들어야 함
        let result = [];

        const atmos = sensors.atmospheres;
        const waters = sensors.waters;
        const vocs = sensors.vocs;
        const stinks = sensors.stinks;

        for (const at of atmos) {
            result.push(at);
        }

        for (const wt of waters) {
            result.push(wt);
        }

        for (const voc of vocs) {
            result.push(voc);
        }
        
        for (const stink of stinks) {
            result.push(stink);
        }

        return result;
    }

    updateSensorCoordinates = async () => {

        let sensorDatas = [];

        const result = await SDMSController.requestSensorDatas();

        sensorDatas = result.sensorDatas

        if (sensorDatas === undefined || sensorDatas === null || sensorDatas?.length === 0)
            return;

        let targets = [];

        for (let i = 0; i < sensorDatas.length; i++) {

            const sensorData = sensorDatas[i];

            if (sensorData.x === null || sensorData.y === null) {

                if (sensorData.sensorID === 20000) {
                    continue;
                }
                
                if (sensorData.latitude === null || sensorData.longitude === null) {
                    continue;
                }

                let target = {
                    id: null,
                    latitude: null,
                    longitude: null,
                    x: null,
                    y: null
                };

                target.id = parseInt(sensorData.sensorID);
                target.latitude = sensorData.latitude.toString();
                target.longitude = sensorData.longitude.toString();
                
                const coordinates = this.convertCoordinates(sensorData.longitude, sensorData.latitude);

                target.x = (coordinates[0] * -1).toString();
                target.y = (coordinates[1]).toString();

                targets.push(target);
            }
        }
        if (targets.length !== 0) {
            SDMSController.updateSensorCoordinates(targets);
        }
        
    }

    // Convert Coordinates by proj4
    convertCoordinates = (lon, lat) => {

        const utmCoordinates = proj4('EPSG:5179', [lon, lat]);

        return utmCoordinates;
    }

    refreshAlarm = () => {
        let selectedAlarm = null;

        let visiblePopups = this.state.visiblePopups;

        if (this.state.sensorAlarms === null || this.state.sensorAlarms === undefined)
            return;
        
        const sensorAlarms = this.state.sensorAlarms;

        if (this.state.selectedAlarm === null || this.state.selectedAlarm === undefined) {

            selectedAlarm = this.state.sensorAlarms[0];

            visiblePopups[SDMS.menu.eventInfo] = true;

            this._setState({ selectedAlarm: selectedAlarm, visiblePopups: visiblePopups });
        }

    }

    // wsMgr에서 호출
    async send3Dsettings() {
        let weatherData = await SDMSController.requestWeatherInfo2();

        let weather = null;

        // 날씨 정보 통신
        let weatherInfo = weatherData.datas[0];
        if (weatherInfo) {
            weather = this.makeWeatherInfo(weatherInfo);
            this.wsMgr.responseWeather();
        } else {
            // 날씨 정보 호출 오류
        }
    }

    // websocket 통신을 위한 날씨정보
    makeWeatherInfo(data) {
        const _data = data.current2;

        const _windSpeed = _data.windSpeed * 0.036;
        const _windDirection = this.setWindDirection(_data.windDirection);
        const _presipitation = _data.rain;
        const _weather = this.setWeatherState(_data.state);

        const weatherInfo = {
            windSpeed: _windSpeed,
            windDirection: _windDirection,
            presipitation: _presipitation,
            weather: _weather,
        }

        return weatherInfo;
    }

    setWeatherState(data) {

        let state = null;

        if (data === WeatherInfo.Sunshine) { // 맑음
            state = 1;
        } else if (data === WeatherInfo.Cloud || data === WeatherInfo.Cloudy) { // 흐림
            state = 2;
        } else if (data === WeatherInfo.Rain || data === WeatherInfo.HeavyRain || data === WeatherInfo.Thunder) { // 비
            state = 3;
        } else if (data === WeatherInfo.Snow || data === WeatherInfo.SnowRain || data === WeatherInfo.HeavySnow) { // 눈
            state = 4;
        } else if (data === WeatherInfo.DustStorm || data === WeatherInfo.FineDust) { // 안개
            state = 5
        } else {
            state = null;
        }

        return state;
    }

    setWindDirection(degrees) {

        let direction = null;

        const directions = [
            "북", "북동", "동", "남동", "남", "남서", "서", "북서", "북"
        ];

        // 입력된 각도를 360으로 나누어 정규화합니다.
        degrees = (degrees + 360) % 360;

        // 45도 간격으로 방향을 계산합니다.
        const index = Math.round(degrees / 45);

        // 해당 방향을 반환합니다.
        return directions[index];

    }

    isLogined(user) {
        if (user) {
            if (this.wsMgr) {
                this.wsMgr.checkLogin(1);
            }
        } else {
            if (this.wsMgr) {
                this.wsMgr.checkLogin(0);
            }
        }
    }

    changeSDMSCommonSettings(storeValue) {
        const commonSettings = storeValue ? storeValue : {};

        this._setState({ commonSettings: commonSettings });
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

    onMouseMove = (event) => {
        const current = new Date();
        const timeSpan = current - this.lastAutoRotationCommandTime;

        if (this.state.autoRotation)
            return;

        if (timeSpan > 1000 * 1) { // // 즉시회전 버튼을 누른뒤 이시간 동안은 자동회전이 멈추지 않도록 한다.
            this.lastMouseMoveTime = current;

            if (this.state.idleAutoRotation) {
                // 마우스 움직임 감지시 AutoRotation 해제
                this._setState({ idleAutoRotation: false }, this.wsMgr.setAutoRotation(false));
            }
        }
    }

    async init() {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        // 설정 불러오기 
        const [result, message] = await SettingController.requestSettings(userInfo.id);
        if (result === null || result === undefined)
            return;

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

        if (this.wsMgr) {
            this.wsMgr.setWeatherOption(weatherState, weatherSoundState);

            if (rotationTime !== null) {
                this.wsMgr.sendAutoRotationTime(rotationTime, use);
            }
        }

        if (this.state.popupState === null || this.state.popupState === undefined || this.state.popupState === {}) {
            this.getPopupState();
        }
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

    //initIdleTime = () => {
    //    let idleTime = SettingsStore.getState().idleTime;

    //    if (idleTime === null || idleTime === undefined || idleTime === "") {
    //        return;
    //    }

    //    let arrIdleTime = idleTime.split(";");

    //    if (arrIdleTime.length !== 2) {
    //        idleTime = "10;1";  // 기본값
    //        arrIdleTime = idleTime.split(";");
    //    }

    //    idleTime = arrIdleTime[0];
    //    idleTime = parseFloat(idleTime);

    //    let useIdleTime = true;

    //    if (arrIdleTime[1] === "0") {
    //        this.state.idleTime = idleTime;
    //        this.state.useIdleTime = useIdleTime;
    //    }

    //    this._setState({ idleTime: idleTime * 60 * 1000 });
    //}

    //initRotation = () => {
    //    if (!this.state.useIdleTime)
    //        return;

    //    if (this.state.autoRotation)
    //        return;

    //    const current = new Date();
    //    const timeSpan = current - this.lastMouseMoveTime;

    //    if (this.state.idleTime < timeSpan && this.state.idleAutoRotation === false) {
    //        this._setState({ idleAutoRotation: true }, this.wsMgr.setAutoRotation(true));
    //        console.log("wsMgr.setAutoRotation(true");
    //    }

    //    setTimeout(() => this.initRotation(), 1000);
    //}

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

            this._setState({ weatherInfo });
        }
    }

    async changeSensorCount(data) {
        if (data === null || data === undefined || data.actionType !== 'SENSOR_COUNT')
            return;

        this._setState({ sensorCount: data.sensorCount });
    }

    firstSensorAlarm(alarm) {

        if (!this.state.selectedAlarm) {
            this.moveToAlarmSensor(alarm);
        }

    }

    // pH, HCl, NH3등과 같이 세부 알람내용이 담긴 메시지를
    // 수질센서, 대기센서등과 같이 알람 카테고리로 바꾼다.
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

    async changeAlarm(storeValue) {
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

        if (selectedAlarm && selectedAlarm.isAlarm) {
            if (selectedAlarm.sensorZoneID < 1000000) {
                alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                menus[SDMS.menu.eventInfo] = true;
                alarmCCTV = this.showAlarmCCTV(alarmType, selectedAlarm);
                this.setXrayMode(true);
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

            // 2024 01 11 3D 이동 옵션에 따라 이벤트 후 selectedAlarm 변경 해야함 
            if (moveToAlarm === null || moveToAlarm === undefined) {
                [moveToAlarm, isSame] = this.getAlarmToDisplay(this.state.selectedAlarm, selectedAlarm, this.state.moveDisplayAlarm);
            }

            if (moveToAlarm) {
                selectedAlarm = moveToAlarm;
            }
            else {
                // 새로 발생한 알람이 없으면 현재 선택된 알람으로 3D 이동한다
                if (selectedAlarm) {
                    if (this.state.moveDisplayAlarm !== SettingResource.moveDisplayAlarm.currentDisplay) {
                        this.showAlarm(selectedAlarm, null);
                    }
                }
            }
        }

        if (selectedAlarm === null) {
            this._setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, cctvList: null, alarmSound: false });
        }
        else {
            const alarmRangeSensor = this.getAlarmRangeSensor(selectedAlarm);

            /*if (selectedAlarm?.isAlarm && alarmRangeSensor) {*/
            if (selectedAlarm?.isAlarm) {

                menus[SDMS.menu.sensorStatus] = true;
                this._setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, selectedRangeSensors: [alarmRangeSensor] }, this.moveToAlarmSensor(selectedAlarm, isSame, selectedAlarm.isAlarm));
            }
            else {
                this._setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus }, this.moveToAlarmSensor(selectedAlarm, isSame, selectedAlarm.isAlarm));
            }
        }
        
        if (this.wsMgr) {
            // send WebSocket header 12 to 3D WebToApp
            this.onResponseSensorList(alarms);
        }
        
            
    }
    
    onResponseSensorList = async (alarms) => {
        
        if (!this.state.alarmLoading) {
            //return;
        }
        
        let sensorDatas = this.state.sensorDatas;
        
        if (sensorDatas === null || sensorDatas === undefined) {
            sensorDatas = await SDMSController.requestSensorDatas();
            if (sensorDatas !== null || sensorDatas !== undefined) {
                sensorDatas = sensorDatas.sensorDatas;
            }
        }
            
        let arrayResult = [];
        
        if (sensorDatas) {
            for (let el of sensorDatas) {
                let arrayElement = [];

                let isAlarm = false;

                if (alarms !== null && alarms !== undefined) {
                    for (let alarm of alarms) {
                        if (alarm.zoneID === el.sensorID && alarm.isAlarm === true) {
                            isAlarm = true;
                            break;
                        }
                    }
                }

                arrayElement.push(el.sensorID !== null && el.sensorID !== undefined ? el.sensorID : "null");
                arrayElement.push(el.sensorType !== null && el.sensorType !== undefined ? el.sensorType : "null");
                arrayElement.push(el.x !== null && el.x !== undefined ? el.x : "null");
                arrayElement.push(el.y !== null && el.y !== undefined ? el.y : "null");
                arrayElement.push(el.longitude !== null && el.longitude !== undefined ? el.longitude : "null");
                arrayElement.push(el.latitude !== null && el.latitude !== undefined ? el.latitude : "null");
                arrayElement.push(isAlarm);

                if (el.sensorType === 0)
                    continue;
                if (el.x === null || el.x === undefined)
                    continue;
                if (el.y === null || el.y === undefined)
                    continue;

                arrayResult.push(arrayElement);
            }
        }
        
        if (this.wsMgr) {
            this.wsMgr.responseSensorList(arrayResult);   
        }
        
        arrayResult = [];
    }

    getAlarmToDisplay = (prevAlarm, selectedAlarm, displayMode) => {
        //0 : 현재대로 - 현재 알람 유지
        //1 : 알람 울릴때마다 화면 이동 사용 X
        //2 : 첫번째 알람 화면으로 이동 - 최초 발생
        //3 : 마지막 알람 화면으로 이동 - 최근 발생

        const alarms = this.state.sensorAlarms;
        let prevAlarmHistoryID = prevAlarm;
        console.log("DisplayAlarm : " + displayMode);

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

    }

    // 여수 RangeSensor 사용 X
    getAlarmRangeSensor(alarm) {
        const sensors = [...this.state.rangeSensors];

        const sensorList = this.state.sensorList;

        if (!sensorList) {
            return;
        }

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

    getAlarmSoundElements = () => {

        if (this.state.selectedAlarm === null || this.state.selectedAlarm === undefined)
            return (
                <></>
            );

        if (this.state.selectedAlarm.isAlarm === false)
            return (
                <></>
            );

        if (!this.state.alarmSound)
            return (
                <></>
            );

        if (this.state.testParam) {
            return (
                <audio autoPlay={true} loop={true}
                    src="/resource/sound/alarm_level4.mp3">
                </audio>
            );
        }

        if (this.state.selectedAlarm.alarmDepth === 3) {
            return (
                <audio autoPlay={true} loop={true}
                    src="/resource/sound/alarm_level3.mp3">
                </audio>
            );
        } else if (this.state.selectedAlarm.alarmDepth === 4) {
            return (
                <audio autoPlay={true} loop={true}
                    src="/resource/sound/alarm_level4.mp3">
                </audio>
            );
        }
    }

    showAlarmCCTV(alarmType, selectedAlarm) {
        for (let key in this.alarmInfo) {
            const alarmInfo = this.alarmInfo[key];

            if (this.state.visiblePopups[key] && alarmInfo && alarmInfo[1]) {
                if (alarmInfo[1].sensorZoneHistoryID === selectedAlarm.sensorZoneHistoryID ||
                    alarmInfo[1].equipZoneID === selectedAlarm.equipZoneID) {
                    this.state.visiblePopups[SDMS.menu.allCCTV] = true;
                    // 이미 알람 CCTV 창이 떠있다.
                    return key;
                }
            }
        }

        let alarmCCTV = "";
        let oldDate = null;

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
        }

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
                        this.showAlarm(moveToSensor[i], null);
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
        else if (alarm && index <= 1) { // 사용자복구, 오작동
            if (index === 0) {
                await SDMSController.requestMalfunction(alarm.facilityType, alarm.sensorZoneID, userInfo.id, false);
            }
            else if (index === 1) {
                await SDMSController.requestMalfunction(alarm.facilityType, alarm.sensorZoneID, userInfo.id, true);
            }
        }

        this._setState({ confirmMessage, selectedAlarm: {} });

    }

    onAuthorError = () => {
        this.showConfirmDialog("권한", ["해당 로그인 사용자는 권한이 없습니다."], null, null);
    }

    async requestSensorList() {

        let [result, message] = await SDMSController.requestAllSensors();
        let facilityInfos = await SDMSController.requestAllFacilityInfo();
        let historyResult = await SDMSController.requestSensorDataHistory();
        let materials = await SDMSController.requestMaterials();
        let materialLinksResult = await SDMSController.requestMaterialLink();
        let sensorDatas = await SDMSController.requestSensorDatas();

        let materialLinks = null;
        if (materialLinksResult.success) {
            materialLinks = materialLinksResult.materialLinks;
        }

        let history = {}
        if (historyResult) {
            history = historyResult.etcSensorDataHistories
        }

        if (result === null) {
            this._setState({ facilityInfos: facilityInfos });
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

            if (result.atmospheres) {
                sensorList['atmospheres'] = result.atmospheres;
            }

            if (result.waters) {
                sensorList['waters'] = result.waters;
            }

            if (result.weathers) {
                sensorList['weathers'] = result.weathers;
            }

            if (result.vocs) {
                sensorList['vocs'] = result.vocs;
            }

            if (result.stinks) {
                sensorList['stinks'] = result.stinks;
            }

            const sensorZoneHistories = await SDMSController.requestSensorZoneHistories();

            const onAlarmList = this.makeSensorZoneHistoriesOnAlarm(sensorZoneHistories);

            this.setPanelData(sensorList, null, materialLinks);
            
            this._setState({ sensorList: sensorList, facilityInfos: facilityInfos, sensorHistories: history, materials: materials, materialLinks: materialLinks, sensorZoneHistories: onAlarmList, sensorDatas: sensorDatas.sensorDatas});
            await this.set3DOptions(sensorList);
            
        }
    }

    async setPublicData(data) {
        
        if (data === null || data === undefined)
            return;

        this._setState({ publicDatas: data });

    }

    makeSensorZoneHistoriesOnAlarm = (sensorZoneHistories) => {

        let onAlarmList = [];
        for (let i = 0; i < sensorZoneHistories.length; i++) {
            const onAlarmHistory = sensorZoneHistories[i];

            if (onAlarmHistory.param4 !== 0 && onAlarmHistory.reactionType !== 1000) {
                onAlarmList.push(onAlarmHistory);
            }
        }

        return onAlarmList;
    }

    onClick360 = (sensor) => {

        this.setVisiblePopups(SDMS.menu.view360Popup, true);

        this._setState({ image360Sensor: sensor });

    }

    onClickClose360 = () => {
        this._setState({ image360Sensor: null });
    }

    async set3DOptions(sensorList) {
        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList();

        // 유저 계정에 따라 3D High, Light 버전 다르기 때문에 
        let userInfo = await ProjectResource.initUserInfo();

        const site3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, userInfo ? userInfo.id : 0);
        //const _3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, userInfo.id);

        if (site3dOptions[0] === null) {
            this.showConfirmDialog("Error", [site3dOptions[1]], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }

        let first3DOptions = null;
        let firstSiteID = null;

        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];

            if (!first3DOptions) {
                first3DOptions = _3dOptions;
                firstSiteID = siteID;
            }
        }
        // this.setSensorList(site3dOptions, sensorList);

        this._setState({ loading: false, site3dOptions: site3dOptions, currentSiteID: firstSiteID, _3dOptions: first3DOptions, buildingGroupList });
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

            if (fireSensors) {
                this.setFireSensors(fireSensors, site3dOptions);
            }

            if (psmSensors) {
                this.setPSMSensors(psmSensors, site3dOptions);
            }

            if (etcSensors) {
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
            }
        }
    }

    setEtcSensors(etcSensors, site3dOptions) {
        const sensorCount = etcSensors.length;

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
            }
        }
    }

    onSelectMenu = (menu, param) => {
        if (menu === SDMSMainMenu.Menu_Show_Menu_Area) {
            this._setState({ showMenuArea: !this.state.showMenuArea });
        }
        else if (menu === SDMSMainMenu.Menu_Refresh) {
            this._setState({ showMenuArea: this.state.showMenuArea });
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
            menu === SDMSResource.ID.menu.detailInfo || /* 0929 */
            menu === SDMSResource.ID.menu.sensorStatus ||
            menu === SDMSResource.ID.menu.weatherInfo ||
            menu === SDMSResource.ID.menu.navInfo ||
            menu === SDMSResource.ID.menu.poiEditInfo ||
            menu === SDMSResource.ID.menu.atmospherePopup ||
            menu === SDMSResource.ID.menu.waterQualityPopup ||
            menu === SDMSResource.ID.menu.weatherPopup ||
            menu === SDMSResource.ID.menu.vocInfo ||
            menu === SDMSResource.ID.menu.vocDetailInfo ||
            menu === SDMSResource.ID.menu.cctvPopup ||
            menu === SDMSResource.ID.menu.dataInfo ||
            menu === SDMSResource.ID.menu.bacteriaPopup)
        {
            this.setVisiblePopups(menu);
        }
        else if (menu === SDMSResource.ID.menu.manualReport) {
            this.setManualReport(menu);
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

    postSelectSensorForCCTVGroup = (poi, equipZoneID, equipZoneName, cctvList) => {
        const menus = this.state.visiblePopups;
        menus[SDMS.menu.cctv] = true;

        if (equipZoneID === null) {
            this.clearEqiupZoneCCTVs();
        }

        this._setState({ selectedPOI: [poi, false], cctvList: cctvList, visiblePopups: menus });
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
        //this.editModeManager.contents3D.poiManager.selectEquipZoneCCTVs(emptyEquipZoneCCTV);
    }

    isEditMode() {
        return false;
        //return this.state.editMode !== Contents3D.Edit_Mode_None;
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

        if (this.wsMgr) {
            this.wsMgr.moveCameraToTarget(0);
        }
        
    }

    /*onChangeMode = (mode, param) => {
        const cmd = {};
        cmd.menu = this.state.command.menu;
        cmd.menuParameter = this.state.command.menuParameter;
        cmd.mode = mode;
        cmd.modeParameter = param;

        console.log(`SDMS.onChangeMode : menu(${mode}, param(${param})`);

        this._setState({ command: cmd });
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

    showAlarm(alarm, targetCCTVMenu) {
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID

        const [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm] = SDMS.getAlarmInfo(alarm);
        this.onSelectMenu(SDMSMainMenu.Menu_Show_Alarm, [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm]);
        if (alarm.sensorZoneID < 1000000) {
            if (SDMSResource.isSVMSSensorType(alarm.facilityType)) {
                alarmCCTVID = alarm.orgSensorID;
            }

            this.getEquipZoneCCTV(alarm.equipZoneID, targetCCTVMenu, alarmCCTVID);
        }
    }

    hideAlarm() {
        if (this.wsMgr) {
            this.wsMgr.hideAlarm();
        }
        this.onSelectMenu(SDMSMainMenu.Menu_Hide_Alarm);
    }

    removeAlarm(facilityType, orgSensorID, alarmDepth) {
        var sensorType = SDMS.getFacilityType(facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_Remove_Alarm, [sensorType, orgSensorID, alarmDepth]);
    }

    onSelectedAlarm(alarm, isSame, isAlarm) {
        
        this._setState({ selectedAlarm: alarm }, this.moveToAlarmSensor(alarm, isSame, isAlarm));
        
    }

    isSameAlarmTrue() {
        this._setState({ onClickSameAlarm: true });
    }
    
    // 선택된 알람에 해당하는 센서 트리 열기 , 선택 , 팝업
    moveToAlarmSensor(alarm, isSame, isAlarm) {
        const selectedAlarmSensorID = alarm.zoneID;

        let sensorType = null;
        let alarmSensor = null;

        let atmosList = null;
        let waterList = null;
        let vocList = null;
        let stinkList = null;
        
        const sensorList = this.state.sensorList;

        if (sensorList === null || sensorList === undefined) {
            return;
        }

        if (Object.keys(sensorList).length === 0) {
            return;
        }
        // 분기처리 해야함 수질센서 눌렀는데 Atmosphere 처리됨
        if (sensorList) {
            atmosList = sensorList.atmospheres; 
            waterList = sensorList.waters;
            vocList = sensorList.vocs;
            stinkList = sensorList.stinks;
            
            // 선택된 알람의 센서가 atmos일때
            for (let i = 0; i < atmosList.length; i++) {
                const atmosSensor = atmosList[i];

                if (atmosSensor.zoneID === selectedAlarmSensorID) {
                    sensorType = StatusInfo.AtmosphereType;
                    this._setState({
                        selectedSensorInfo:
                        {
                            sensor: atmosList[i],
                            sensorType: sensorType
                        },
                        selectedSensor: {
                            sensor: atmosList[i],
                            sensorType: sensorType
                        }
                    }, this.onSelectedSensor(sensorType, atmosList[i], false, isAlarm));
                    return;
                }
            }

            // 선택된 알람의 센서가 water일때
            for (let k = 0; k < waterList.length; k++) {
                const waterSensor = waterList[k];

                if (waterSensor.zoneID === selectedAlarmSensorID) {
                    sensorType = StatusInfo.WaterType;
                    this._setState({
                        selectedSensorInfo:
                        {
                            sensor: waterList[k],
                            sensorType: sensorType
                        },
                        selectedSensor:
                        {
                            sensor: waterList[k],
                            sensorType: sensorType
                        },
                        onClickSameAlarm: isSame
                    }, this.onSelectedSensor(sensorType, waterList[k], false, isAlarm));
                    return;
                }
            }

            for (let a = 0; a < vocList.length; a++) {
                const vocSensor = vocList[a];

                if (vocSensor.zoneID === selectedAlarmSensorID) {
                    sensorType = StatusInfo.VocType;
                    this._setState({
                        selectedSensorInfo: {
                            sensor: vocList[a],
                            sensorType: sensorType
                        },
                        selectedSensor: {
                            sensor: vocList[a],
                            sensorType: sensorType
                        },
                        onClickSameAlarm: isSame
                    }, this.onSelectedSensor(sensorType, vocList[a], false, isAlarm));
                    return
                }
            }

            for (let b = 0; b < stinkList?.length; b++) {
                const stinkSensor = stinkList[b];

                if (stinkSensor.zoneID === selectedAlarmSensorID) {
                    sensorType = StatusInfo.BacterialType;
                    this._setState({
                        selectedSensorInfo: {
                            sensor: stinkList[b],
                            sensorType: sensorType
                        },
                        selectedSensor: {
                            sensor: stinkList[b],
                            sensorType: sensorType
                        },
                        onClickSameAlarm: isSame
                    }, this.onSelectedSensor(sensorType, stinkList[b], false, isAlarm));
                    return;
                }
            }

            //this.wsMgr.onAlarm(alarmSensor, 1);
        } 
    }

    // 선택된 알람으로 3D 이동
    onMoveSelectedAlarm = () => {
        const selectedAlarm = this.state.selectedAlarm;

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

    async getEquipZoneCCTV(equipZoneID, targetCCTVMenu, alarmCCTVID) {
        let cctvList = "";

        // EquipZoneCCTV LIST 조회
        const [success, result] = await SDMSController.getEquipZoneCCTV(equipZoneID);

        if (success === null || success === undefined || success === false) {
            if (!targetCCTVMenu || targetCCTVMenu === SDMS.menu.cctv) {
                this.state.cctvList = cctvList;
            }

            if (targetCCTVMenu && targetCCTVMenu.length > 0) {
                this.alarmCCTVs[targetCCTVMenu] = cctvList;
            }
            //this._setState({ cctvList: cctvList });
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
        //this._setState({ cctvList: cctvList });
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
            this._setState({ streamServerURL: streamServerURL});
    }

    setVisiblePoi(typeName, visible) {
        let types = { ...this.state.visibleSensorTypes };

        // 솔브레인 iot 같은 경우 psm, etc 포함
        if (typeName === "iot") {
            types["psm"] = visible;
            types["etc"] = visible;
        } else
            types[typeName] = visible;
        
        this._setState({ visibleSensorTypes: types });
    }

    setVisiblePopups(menu, visible, isOpened) {

        if (isOpened) {
            this._setState({ selectedSensorInfo: null });
        }

        //if (SDMS.ChkShowHide === true)
        //    return;

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
        if (menu === SDMS.menu.atmospherePopup) {
            menus[SDMS.menu.waterQualityPopup] = false;
            menus[SDMS.menu.weatherPopup] = false;
            menus[SDMS.menu.vocDetailInfo] = false;
            menus[SDMS.menu.bacteriaPopup] = false;
        } else if (menu === SDMS.menu.waterQualityPopup) {
            menus[SDMS.menu.atmospherePopup] = false;
            menus[SDMS.menu.weatherPopup] = false;
            menus[SDMS.menu.vocDetailInfo] = false;
            menus[SDMS.menu.bacteriaPopup] = false;
        } else if (menu === SDMS.menu.weatherPopup) {
            menus[SDMS.menu.atmospherePopup] = false;
            menus[SDMS.menu.waterQualityPopup] = false;
            menus[SDMS.menu.vocDetailInfo] = false;
            menus[SDMS.menu.bacteriaPopup] = false;
        } else if (menu === SDMS.menu.vocDetailInfo) {
            menus[SDMS.menu.atmospherePopup] = false;
            menus[SDMS.menu.waterQualityPopup] = false;
            menus[SDMS.menu.weatherPopup] = false;
            menus[SDMS.menu.bacteriaPopup] = false;
        } else if (menu === SDMS.menu.bacteriaPopup) {
            menus[SDMS.menu.atmospherePopup] = false;
            menus[SDMS.menu.waterQualityPopup] = false;
            menus[SDMS.menu.weatherPopup] = false;
            menus[SDMS.menu.vocDetailInfo] = false;
        }

        // Delete
        if (this.state.testParam) {
            menus[SDMS.menu.atmospherePopup] = false;
            menus[SDMS.menu.waterQualityPopup] = false;
            menus[SDMS.menu.weatherPopup] = false;
            menus[SDMS.menu.vocDetailInfo] = false;
            menus[SDMS.menu.bacteriaPopup] = false;

            return this._setState({ visiblePopups: menus, selectedSensor: null });
        }

        this._setState({ visiblePopups: menus, selectedSensorInfo: {} }); 
        // 팝업 닫히는 애니메이션 효과
        this.hideAnimatePopup(menus, menus_old, () => {
            //console.log(SDMS.menu.allCCTV + ": " + menus[SDMS.menu.allCCTV], SDMS.menu.alarmCCTV1 + ": " + menus[SDMS.menu.alarmCCTV1]);
            this._setState({ visiblePopups: menus })
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
                        hideID = "#" + SDMSResource.popupLayer.eventInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.eventInfo);
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
                    else if (key === SDMS.menu.detailInfo) {
                        hideID = "#" + SDMSResource.popupLayer.detailInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.detailInfo); 
                    }
                    else if (key === SDMS.menu.sensorStatus) {
                        hideID = "#" + SDMSResource.popupLayer.sensorStatus;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.sensorStatus); 
                    }
                    else if (key === SDMS.menu.atmospherePopup) {
                        hideID = "#" + SDMSResource.popupLayer.atmospherePopup;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.atmospherePopup);
                    }
                    else if (key === SDMS.menu.waterQualityPopup) {
                        hideID = "#" + SDMSResource.popupLayer.waterQualityPopup;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.waterQualityPopup);
                    }
                    else if (key === SDMS.menu.weatherPopup) {
                        hideID = "#" + SDMSResource.popupLayer.weatherPopup;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.weatherPopup); 
                    }
                    else if (key === SDMS.menu.vocInfo) {
                        hideID = "#" + SDMSResource.popupLayer.vocInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.vocInfo);
                    }
                    else if (key === SDMS.menu.cctvPopup) {
                        hideID = "#" + SDMSResource.popupLayer.cctvPopup;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.cctvPopup); 
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
            this._setState({ selectedPOI: null });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_Floor) {
            //this.onChangeBuildingGroup(menuParameter, SDMS.SelectedStatusInfoType.zone);
            this.onSelectMenu(menu, [menuParameter.buildingID, SDMSDataManager.getZoneFloor(menuParameter)]);

            // 건물 이동시 기존 선택된 POI 선택해제  - K.D.R
            this._setState({ selectedPOI: null });
        }
        else {
            this.onSelectMenu(menu, menuParameter);
        }
    }

    // 이벤트 중 선택된 센서와 일치하는 경우 판별
    getSensorFromAlarm(sensor, isAlarm) {

        let result = null;
        //const alarms = this.state.sensorAlarms;
        const alarms = store.getState().sensorAlarm;
        // if (sensor && alarms) {
        //     for (const alarm of alarms) {
        //         if (sensor.sensors === undefined || sensor.sensors == null) {
        //             return;
        //         }
        //         for (const _sensor of sensor.sensors) {
        //             if (_sensor.id === alarm.orgSensorID) {
        //                 if (alarm.isAlarm === true && isAlarm === true) {
        //                     return alarm;
        //                 }
        //             }
        //         }
        //     }
        // }
        if (sensor === null || sensor === undefined) {
            return;
        }
        
        if (alarms === null || alarms === undefined) {
            return;
        }
        
        for (const alarm of alarms) {
            if (sensor.zoneID === alarm.zoneID) {
                if (alarm.isAlarm === true) {
                    return alarm;
                }
            }
        }
    }

    // Accordion에서 센서 선택시 팝업에 전달하기 위한 Property 작업
    onSelectedSensor(sensorType, sensor, isSocketAction, isAlarmSensor, isFromStatusInfo = null) { // isFromStatusInfo = 센서 현황판에서 클릭시 3D효과가 다름 (true/false)
        
        let isAlarmOnSensor = isAlarmSensor;

        const indiVisiblePopups = this.getSensorKind(sensorType);
        // 선택한 센서가 이벤트 센서와 동일하면 setState selectedAlarm

        const currentAlarms = this.state.sensorAlarms;
        if (isAlarmOnSensor === null || isAlarmOnSensor === undefined) {
            // 알람 관련 정보가 들어오지 않으면 한번더 체크
            for (let i = 0; i < currentAlarms?.length; i++) {
                const alarm = currentAlarms[i];
                if (sensor) {
                    if (sensor.zoneID === alarm.zoneID) {
                        isAlarmOnSensor = true;
                        break;
                    } else {
                        isAlarmOnSensor = false;
                    }
                } else {
                    // 센서 정보 없음
                    isAlarmOnSensor = false;
                }
            }
        }

        if (this.state.testParam) {
            return;
        }

        const isAlarmed = this.getSensorFromAlarm(sensor, isAlarmOnSensor); // 선택된 센서와 알람리스트 비교 , 동일하면 return alarm

        let isAlarm = false;

        if (isAlarmed) {
            isAlarm = true;
            this.setVisiblePopups(SDMS.menu.eventInfo, true);
        }
        let prevSensorID = this.state.prevSensorID;

        if (sensor) {

            if (sensor.zoneID !== prevSensorID) {

                if (this.wsMgr) {
                    if (isSocketAction) {
                        prevSensorID = sensor.zoneID;
                    } else {
                        if (isFromStatusInfo === null || isFromStatusInfo === undefined) {
                            isFromStatusInfo = false;
                        }
                        //this.wsMgr.selectPOI(sensor.zoneID, isAlarm, isFromStatusInfo);
                        this.wsMgr.selectPOI(sensor.zoneID, isAlarm);
                        prevSensorID = sensor.zoneID;
                    }
                }
            }

            if (isAlarmed) {
                this._setState({
                    selectedSensorInfo: { sensorType: sensorType, sensor: sensor },
                    selectedSensor: { sensorType: sensorType, sensor: sensor },
                    selectedAlarm: isAlarmed,
                    prevSensorID: prevSensorID
                }, this.setVisiblePopups(indiVisiblePopups, true));
            } else {
                this._setState({
                    selectedSensorInfo: { sensorType: sensorType, sensor: sensor },
                    selectedSensor: { sensorType: sensorType, sensor: sensor },
                    prevSensorID: prevSensorID
                }, this.setVisiblePopups(indiVisiblePopups, true));
            }
            
            return;
        }
    }

    // 클릭한 센서 종류에 따라 Popup 종류 설정
    getSensorKind(sensorType) {
        let visiblePopups = null;

        switch (sensorType) {
            case StatusInfo.AtmosphereType:
                visiblePopups = SDMSResource.ID.menu.atmospherePopup;
                break;
            case StatusInfo.WaterType:
                visiblePopups = SDMSResource.ID.menu.waterQualityPopup;
                break;
            case StatusInfo.WeatherType:
                visiblePopups = SDMSResource.ID.menu.weatherPopup;
                break;
            case StatusInfo.VocType:
                visiblePopups = SDMSResource.ID.menu.vocDetailInfo;
                //visiblePopups = SDMSResource.ID.menu.vocDetailInfo;
                break;
            case StatusInfo.BacterialType:
                visiblePopups = SDMSResource.ID.menu.bacteriaPopup;
                break;
            case StatusInfo.CCTVType:
                visiblePopups = SDMSResource.ID.menu.cctvPopup;
                break;
            default: 
                return;
        }
        return visiblePopups;
    }

    onSelectSensor = (sensorType, sensorID, zoneID) => {
        if (!sensorType || !sensorID || !zoneID) {
            this._setState({ selectedPOI: null });
        }
        else {
            this._setState({ selectedPOI: [sensorType, sensorID, zoneID] });
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
        this._setState({ popupLayer: layerInfo });
    }*/

    onSound(sound, isTest) {

        if (isTest) {
            if (sound !== this.state.alarmSound) {
                this._setState({ alarmSound: sound });
                return;
            }
        }

        if (this.state.selectedAlarm === null && this.state.selectedAlarm === undefined) {
            if (this.state.selectedAlarm.isAlarm === false) {
                return;
            }
        }

        if (this.state.selectedAlarm.isAlarm === false) {
            return;
        }

        if (sound !== this.state.alarmSound) {
            this._setState({ alarmSound: sound });
        }
    }

    isIndoorCCTV(cctv, zoneID) {
        const zoneData = this.state._3dOptions.zones[zoneID];

        if (zoneData) {
            return true;
        }

        return false;
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

                this._setState({ selectedRangeSensors: selectedSensors, visiblePopups });
            }
        }
    }

    changeToAllSensor = () => {
        const visiblePopups = { ...this.state.visiblePopups };
        visiblePopups[SDMS.menu.sensorStatus] = true;

        this._setState({ selectedRangeSensors: [], visiblePopups });
    }

    onSelectCCTV = (cctvID, poi, poiManager) => {
        const isEditMode = this.isEditMode();

        if (!isEditMode) {
            var menus = this.state.visiblePopups;
            menus[SDMS.menu.allCCTV] = true;
            menus[SDMS.menu.cctv] = true;

            if (this.containCCTV(cctvID) === false) {
                this._setState({ cctvList: this.getCCTVList(cctvID), visiblePopups: menus, selectedPOI: [poi, false] });
                // 하나의 CCTV만 표시하는 방식
                //this._setState({ cctvList: cctvID, visiblePopups: menus, selectedPOI: [poi, false] });
            }
            else {
                // 이미 CCTV 팝업에 영상이 있어도 POI 선택은 되도록 수정 - K.D.R
                this._setState({ selectedPOI: [poi, false] });
            }
        }
        else if (isEditMode) {
            this._setState({ selectedPOI: [poi, false] });
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
        //this.editModeManager.contents3D.poiManager.selectEquipZoneCCTVs(equipZoneCCTV);
        this._setState({ cctvList });
    }

    showBuildingInfo = (type, arrInfo) => {

        // TODO: 샘플 데이터 예시
        /*arrInfo = new Array();
        arrInfo[0] = SDMSResource.ID.buildingInfo.equipmentType;         // 건물 or 설비
        arrInfo[1] = "HF 탱크";                                          // 설비 이름
        arrInfo[2] = "HF";                                               // 취급물질(대표)
        arrInfo[3] = "안준후";                                           // 담당자
        arrInfo[4] = "010-123-1234";                                     // 담당자 연락처*/

        const menus = this.state.visiblePopups;

        if (arrInfo) {
            //menus[SDMS.menu.statusInfo] = true;
            menus[SDMS.menu.buildingInfo] = true;
        } else {
            menus[SDMS.menu.buildingInfo] = false;
        }

        this._setState({ buildingInfo: arrInfo, visiblePopups: menus });
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

            this._setState({ currentView: {buildingID, zoneID, zoneName}});
        }
    }

    resetPopupState = (popupState) => {
        if (popupState === null || popupState === undefined)
            return;

        //let data = popupState;

        //if (data.actionType === 'ResetPopup') {
            //this._setState({ popupState: data.popupState });
            this._setState({ popupState: popupState });
        //}
    }

    setRangeSensorStatus(storeValue) {
        if (storeValue.rangeSensors) {
            if (this.isSameRangeSensors(storeValue.rangeSensors) === false) {
                this._setState({ rangeSensors: storeValue.rangeSensors });
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
            this._setState({ moveDisplayAlarm: move });
        }
    }

    async initDashboardSensors() {
        const [result, message] = await DashboardController.requestUseSensor();

        if (result !== null && result !== undefined) {
            this._setState({ dashboardSensors: result });
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
            this._setState({ popupState: popupState });
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
            this._setState({ popupState: popupState });
        }
    }

    //cctv 전체화면 설정
    setCctvFullScreenState(cctvFullScreenState) {
        this._setState({
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
        selectedStatusInfo.cctvGroups = false;
        selectedStatusInfo.cctvSubGroups = false;
        selectedStatusInfo.facilityGroups = false;
        selectedStatusInfo.facilitySubGroups = false;

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
        else if (type === SDMS.SelectedStatusInfoType.facilitySubGroups) {
            selectedStatusInfo.facilityGroups = true;
            selectedStatusInfo.facilitySubGroups = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.none) {
            if (selectedStatusInfo.buildingGroup === null)
                return;

            selectedStatusInfo.buildingGroup = null;
            selectedStatusInfo.building = null;
            selectedStatusInfo.zone = null;
        }

        // 다른 공간의 POI 및 설비 클릭하여 이동시 선택이 풀려서 주석처리  - K.D.R
        //this._setState({ selectedStatusInfo, selectedPOI: null });
        this._setState({ selectedStatusInfo });
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
                return [selectedPOI[0], selectedPOI[2], selectedPOI[1]];
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

            this._setState({ currentSiteID: siteID, _3dOptions, command });
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

    setAutoRotation = (autoRotation) => {
        if (this.wsMgr) {
            this.wsMgr.setAutoRotate(autoRotation);
        }
        this._setState({ autoRotation });
    }

    moveCameraToTarget(sector) {
        if (this.wsMgr) {
            this.wsMgr.moveCameraToTarget(sector);
        }
    }


    setPopupUI(visiblePopups) {
        const [sensorType, zoneID, sensorID] = this.getSelectedSensorInfo();
        const multiSite = this.isMultiSite();

        var popups = [];
        if (visiblePopups[SDMS.menu.eventInfo]) {
            /* if (!this.isEditMode() && this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) { */
                if (!this.isEditMode() && visiblePopups[SDMS.menu.eventInfo]) {  /* yeosu */
                popups.push(
                    <EventInfo key='sdms_popup_eventInfo'
                        sensorAlarms={this.state.sensorAlarms}
                        selectedAlarm={this.state.selectedAlarm}
                        sensorDatas={this.state.sensorDatas}
                        onSelectedAlarm={this.onSelectedAlarm}
                        onMoveSelectedAlarm={this.onMoveSelectedAlarm}
                        setVisiblePopups={this.setVisiblePopups}
                        setActiveDragPopup={this.setActiveDragPopup}
                        zIndex={this.state.popupLayer.eventInfoZIndex}
                        popupType={SDMSResource.popupLayer.eventInfo}
                        popupState={this.state.popupState.eventInfo}
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
                        sensorList={this.state.sensorList}
                        getAlarmSensor={this.getAlarmSensor}
                        firstSensorAlarm={this.firstSensorAlarm}
                        wsMgr={this.wsMgr}
                        selectedSensor={this.state.selectedSensor}
                        selectedSensorInfo={this.state.selectedSensorInfo}
                        testParam={this.state.testParam}
                    />
                );
            }
            else {
                visiblePopups[SDMS.menu.eventInfo] = false;
            }
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.statusInfo]) {
            popups.push(
                <StatusInfo key='sdms_popup_statusInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    visiblePopups={this.state.visiblePopups}
                    multiSite={multiSite}
                    buildingGroupList={this.state.buildingGroupList}
                    outdoorZones={this.state._3dOptions.outdoorZones}
                    zoneList={this.state._3dOptions.zones}
                    buildingIDs={this.state._3dOptions.buildingIDs}
                    indoorModels={this.state._3dOptions.indoorModels}
                    sensorList={this.state.sensorList}
                    moveToX={this.moveToX}
                    onSelectSensor={this.onSelectSensor}
                    selectedAlarm={this.state.selectedAlarm}
                    firstSensorAlarm={this.firstSensorAlarm}
                    //selectedSensor={[sensorType, zoneID, sensorID]}
                    selectedSensor={this.state.selectedSensor}
                    materialLinks={this.state.materialLinks}
                    selectedInfo={this.state.selectedStatusInfo}
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
                    onSelectedSensor={this.onSelectedSensor}
                    wsMgr={this.wsMgr}
                    setPoiLayer={this.setPoiLayer}
                    onClickSameAlarm={this.state.onClickSameAlarm}
                    isSameAlarmTrue={this.isSameAlarmTrue}
                    onClick360={this.onClick360}
                    testParam={this.state.testParam}
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

        if (!this.isEditMode() && visiblePopups[SDMS.menu.view360Popup]) {
            popups.push(
                <View360Popup key='sdms_popup_view360Popup'
                    curSensor={this.state.image360Sensor}
                    alarms={this.state.sensorAlarms}
                    zIndex={this.state.popupLayer.view360Popup}
                    setVisiblePopups={this.setVisiblePopups}
                    popupType={SDMSResource.popupLayer.view360Popup}
                    setActiveDragPopup={this.setActiveDragPopup}
                    popupState={this.state.popupState.view360Popup}
                    setPopupState={this.setPopupState}
                    sensorDatas={this.state.sensorDatas}
                />)
        }


        /*if (visiblePopups[SDMS.menu.allCCTV] && visiblePopups[SDMS.menu.cctv] && !this.isEditMode()) {
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
                    menu={SDMS.menu.cctv}
                    selectedCCTVID={selectedCCTVID}
                />
            );
        }*/

        this.showAlarmCCTVPopups(visiblePopups, popups);

        if (!this.isEditMode() && visiblePopups[SDMS.menu.dashboard]) {
            popups.push(
                <Dashboard key='sdms_popup_dashBoard'
                    alarms={this.state.sensorAlarms}
                    setVisiblePopups={this.setVisiblePopups}
                    sensorCount={this.state.sensorCount}
                    zIndex={this.state.popupLayer.dashboardZIndex}
                    popupType={SDMSResource.popupLayer.dashboard}
                    popupState={this.state.popupState.dashboard}
                    setActiveDragPopup={this.setActiveDragPopup}
                    setPopupState={this.setPopupState}
                    buildingGroupList={this.state.buildingGroupList}
                    dashboardSensors={this.state.dashboardSensors}
                    getAlarmSensor={this.getAlarmSensor}
                    testParam={this.state.testParam}
                />
            );
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.miniMap]) {
            popups.push(
                <MiniMap key='sdms_popup_miniMap'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    selectedSensor={this.state.selectedSensor}
                    selectedAlarm={this.state.selectedAlarm}
                    alarms={this.state.sensorAlarms}
                    sensorDatas={this.state.sensorDatas}
                    zIndex={this.state.popupLayer.miniMapZIndex}
                    popupType={SDMSResource.popupLayer.miniMap}
                    popupState={this.state.popupState.miniMap}
                    setPopupState={this.setPopupState}
                    currentView={this.state.currentView}
                    moveCameraToTarget={this.moveCameraToTarget}
                    wsMgr={this.wsMgr}
                    image360Sensor={this.state.image360Sensor}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.detailInfo]) {  /* 0929 */
            popups.push(
                <DetailInfo key='sdms_popup_detailInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.detailInfoZIndex}
                    popupType={SDMSResource.popupLayer.detailInfo}
                    popupState={this.state.popupState.detailInfo}
                    setPopupState={this.setPopupState}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.sensorStatus]) {  /* 0929 */
            const [rangeSensors, isAll] = this.getRangeSensorsForSensorStatus();

            //popups.push(
            //    <SensorStatus key='sdms_popup_sensorStatus'
            //        setVisiblePopups={this.setVisiblePopups}
            //        setActiveDragPopup={this.setActiveDragPopup}
            //        zIndex={this.state.popupLayer.sensorStatusZIndex}
            //        popupType={SDMSResource.popupLayer.sensorStatus}
            //        popupState={this.state.popupState.sensorStatus}
            //        setPopupState={this.setPopupState}
            //        visibleSensorTypes={this.state.visibleSensorTypes}
            //        setVisiblePoi={this.setVisiblePoi}
            //        changeToAllSensor={this.changeToAllSensor}
            //        sensors={rangeSensors}
            //        isAllSensor={isAll}
            //        sensorCount={this.state.sensorCount}
            //    />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.navInfo]) {  /* yeosu */
            popups.push(
                <NavInfo key='sdms_popup_navInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.navInfoZIndex}
                    popupType={SDMSResource.popupLayer.navInfo}
                    popupState={this.state.popupState.navInfo}
                    setPopupState={this.setPopupState}
                    setAutoRotation={this.setAutoRotation}
                    autoRotation={this.state.autoRotation}
                    wsMgr={this.wsMgr}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.poiEditInfo]) {  /* yeosu */
            popups.push(
                <POIEditInfo key='sdms_popup_poiEditInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.poiEditInfoZIndex}
                    popupType={SDMSResource.popupLayer.poiEditInfo}
                    popupState={this.state.popupState.poiEditInfo}
                    setPopupState={this.setPopupState}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.dataInfo]) {  
            popups.push(
                <DataInfo key='sdms_popup_dataInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.dataInfoZIndex}
                    popupType={SDMSResource.popupLayer.dataInfo}
                    popupState={this.state.popupState.dataInfo}
                    setPopupState={this.setPopupState}
                    publicDatas={this.state.publicDatas}
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

        if (!this.isEditMode() && visiblePopups[SDMS.menu.atmospherePopup]) {
            popups.push(
                <AtmospherePopup key='sdms_popup_atmospherePopup'
                    selectedSensor={this.state.selectedSensor}
                    selectedSensorInfo={this.state.selectedSensorInfo}
                    weatherInfo={this.state.weatherInfo}
                    sensorList={this.state.sensorList}
                    selectedAlarm={this.state.selectedAlarm}
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.atmospherePopupZIndex}
                    popupType={SDMSResource.popupLayer.atmospherePopup}
                    popupState={this.state.popupState.atmospherePopup}
                    setPopupState={this.setPopupState}
                    checkedMaterials={this.state.checkedMaterials}
                    onChangeCheckedMaterials={this.onChangeCheckedMaterials}
                />);
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.waterQualityPopup]) {
            popups.push(
                <WaterQualityPopup key='sdms_popup_waterQualityPopup'
                    setVisiblePopups={this.setVisiblePopups}
                    selectedSensorInfo={this.state.selectedSensorInfo}
                    selectedSensor={this.state.selectedSensor}
                    sensorList={this.state.sensorList}
                    weatherInfo={this.state.weatherInfo}
                    selectedAlarm={this.state.selectedAlarm}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.waterQualityPopupZIndex}
                    popupType={SDMSResource.popupLayer.waterQualityPopup}
                    popupState={this.state.popupState.waterQualityPopup}
                    setPopupState={this.setPopupState}
                    checkedMaterials={this.state.checkedMaterials}
                    onChangeCheckedMaterials={this.onChangeCheckedMaterials}
                />);
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.weatherPopup]) {
            popups.push(
                <WeatherPopup key='sdms_popup_weatherPopup'
                    setVisiblePopups={this.setVisiblePopups}
                    selectedSensorInfo={this.state.selectedSensorInfo}
                    selectedSensor={this.state.selectedSensor}
                    sensorList={this.state.sensorList}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.weatherPopupZIndex}
                    popupType={SDMSResource.popupLayer.weatherPopup}
                    popupState={this.state.popupState.weatherPopup}
                    setPopupState={this.setPopupState}
                    dataHistories={this.state.sensorHistories}
                    materials={this.state.materials}
                />);
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.vocDetailInfo]) {
            popups.push(
                <VOCDetailInfo key='sdms_popup_vocDetailInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    selectedSensor={this.state.selectedSensor}
                    materials={this.state.materials}
                    materialLinks={this.state.materialLinks}
                    selectedSensorInfo={this.state.selectedSensorInfo}
                    selectedAlarm={this.state.selectedAlarm}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.vocDetailInfoZIndex}
                    popupType={SDMSResource.popupLayer.vocDetailInfo}
                    popupState={this.state.popupState.vocDetailInfo}
                    setPopupState={this.setPopupState}
                    checkedMaterials={this.state.checkedMaterials}
                    onChangeCheckedMaterials={this.onChangeCheckedMaterials}
                />);
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.bacteriaPopup]) {
            popups.push(
                <BacteriaPopup key='sdms_popup_bacteriaPopup'
                    setVisiblePopups={this.setVisiblePopups}
                    selectedSensor={this.state.selectedSensor}
                    materials={this.state.materials}
                    materialLinks={this.state.materialLinks}
                    selectedSensorInfo={this.state.selectedSensorInfo}
                    selectedAlarm={this.state.selectedAlarm}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.bacteriaPopupZIndex}
                    popupType={SDMSResource.popupLayer.bacteriaPopup}
                    popupState={this.state.popupState.bacteriaPopup}
                    setPopupState={this.setPopupState}
                    checkedMaterials={this.state.checkedMaterials}
                    onChangeCheckedMaterials={this.onChangeCheckedMaterials}
                />
            )
        }

        //if (!this.isEditMode() && visiblePopups[SDMS.menu.vocDetailInfo]) {
        //    popups.push(
        //        <VOCDetailInfo key='sdms_popup_vocDetailInfo'
        //             setVisiblePopups={this.setVisiblePopups}
        //             setActiveDragPopup={this.setActiveDragPopup}
        //             zIndex={this.state.popupLayer.vocDetailInfoZIndex}
        //             popupType={SDMSResource.popupLayer.vocDetailInfo}
        //             popupState={this.state.popupState.vocDetailInfo}
        //             setPopupState={this.setPopupState}
        //        />);
        //}

        if (!this.isEditMode() && visiblePopups[SDMS.menu.cctvPopup]) {
            popups.push(
                <CCTVPopup key='sdms_popup_cctvPopup'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.cctvPopupZIndex}
                    popupType={SDMSResource.popupLayer.cctvPopup}
                    popupState={this.state.popupState.cctvPopup}
                    setPopupState={this.setPopupState}
                />);
        }

        //if (this.state.visiblePopups !== visiblePopups) {
        //    this._setState({ visiblePopups: visiblePopups }, () => {
        //        console.log("VisiblePopups Update");
        //    })
        //}

        return popups;
    }

    showAlarmCCTVPopups(visiblePopups, popups) {
        for (let i = 1; i <= 3; i++) {
            this.showAlarmCCTVPopup(i, SDMSResource.ID.menu.alarmCCTV + "_" + i, visiblePopups, popups);
        }

        this.FocusAlarmCCTVPopup();
    }

    showAlarmCCTVPopup(index, menu, visiblePopups, popups) {
        if (visiblePopups[SDMS.menu.allCCTV] && visiblePopups[menu] && !this.isEditMode()) {
            //const key = 'sdms_popup_cctvInfo_' + index;
            let key = 'sdms_popup_cctvInfo_' + this.alarmInfo[menu][1].sensorZoneHistoryID;

            const popupType = SDMSResource.popupLayer.cctvInfo + "_" + index;

            /*popups.push(
                <CCTVInfo key={key}
                    setVisiblePopups={this.setVisiblePopups}
                    cctvList={this.alarmCCTVs[menu]}
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
                    alarmInfo={this.alarmInfo[menu]}
                    menu={menu}
                    selectedAlarm={this.state.selectedAlarm}
                />
            );*/
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
    //    this._setState({ confirmMessage });
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

        this._setState({ confirmMessage });
    }

    closeConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;
        this._setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this._setState({ confirmMessage });
    }

    getFacilityModelName(facilityID) {
        const facilities = [...this.state.facilityInfos];
        const facilityCount = facilities.length;

        for (let i = 0; i < facilityCount; i++) {
            const facility = facilities[i];

            if (facility.id === facilityID) {
                return facility.modelName;
            }
        }

        return null;
    }

    getFacility(facilityModelName) {
        const facilities = [...this.state.facilityInfos];
        const facilityCount = facilities.length;

        for (let i = 0; i < facilityCount; i++) {
            const facility = facilities[i];

            if (facility.modelName === facilityModelName) {
                return facility;
            }
        }

        return null;
    }

    selectFacility = (obj) => {
        
        if (obj === null) {
            this._setState({ selectedFacility: { facilityID: -1, modelName:''} });
            return;
        }

        const facilityInfo = this.getFacility(obj.name);

        if (!facilityInfo) {
            this._setState({ selectedFacility: { facilityID: -1, modelName: '' } });
            return;
        }

        const facility = this.state.selectedFacility;
        facility.facilityID = facilityInfo.id;
        facility.modelName = obj.name;

        const [buildingGroup, building, zone] = this.getSpatialInfo(facilityInfo.zoneID);
        const selectedStatusInfo = this.state.selectedStatusInfo;
        selectedStatusInfo.buildingGroup = buildingGroup;
        selectedStatusInfo.building = building;
        selectedStatusInfo.zone = zone;
        selectedStatusInfo.sensorGroups = false;
        selectedStatusInfo.fireSensors = false;
        selectedStatusInfo.psmSensors = false;
        selectedStatusInfo.etcSensors = false;
        selectedStatusInfo.cctvGroups = false;
        selectedStatusInfo.cctvSubGroups = false;
        selectedStatusInfo.facilityGroups = true;
        selectedStatusInfo.facilitySubGroups = true;
        
        this._setState({ selectedStatusInfo, selectedFacility: facility });
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

        this._setState({ buildingGroupList });
    }

    makeAlarmSensors() {
        const _sensors = {
            fire: {}
        };
        const sensorList = { ...this.state.sensorList };

        for (const sensorTypeName in sensorList) {
            const typeSensors = {};
            _sensors[sensorTypeName] = typeSensors;

            if (sensorTypeName === "atmospheres") {
                typeSensors.data = SdmsResource.AtmosphereData;
            }
            else if (sensorTypeName === "waters") {
                typeSensors.data = SdmsResource.WaterData;
            }
            else if (sensorTypeName === "vocs"){
                typeSensors.data = SdmsResource.VocData;
            }
            else if (sensorTypeName === "stinks") {
                typeSensors.data = SdmsResource.StinkData;
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

    async setViewMode() {
        const user = ProjectResource.getUserInfo();

        if (user) {
            const prevMode = [...this.state.xrayMode];
            const options = await SDMSController.requestGetOption(user.id, prevMode[2]);

            if (options) {
                const len = options.length;
                const targetSubCategory = prevMode[3].toLowerCase();

                if (len > 1 && options[0]) {
                    for (const option of options[1]) {
                        if (option.subCategory.toLowerCase() === targetSubCategory) {
                            //const xrayMode = option.propertyValue1 === "1" ? false : true;
                            const xrayMode = option.propertyValue1 === "1" ? false : true;

                            if (this.wsMgr) {
                                if (xrayMode) {
                                    this.wsMgr.changeViewMode(2);
                                } else {
                                    this.wsMgr.changeViewMode(1);
                                }
                            }

                            this._setState({ xrayMode: [xrayMode, option.id, prevMode[2], prevMode[3]] });
                            break;
                        }
                    }
                }
            }
        }
    }

    setPoiLayer = (sensorType, _isShow) => {

        let isShow = null;
        let _sensorType = null;
        if (_isShow) {
            isShow = 1;
        } else {
            isShow = 0;
        }
        
        switch (sensorType) {
            case StatusInfo.EntireType:
                _sensorType = 0;
                break;
            case StatusInfo.AtmosphereType:
                _sensorType = 1;
                break;
            case StatusInfo.WaterType:
                _sensorType = 2;
                break;
            case StatusInfo.WeatherType:
                _sensorType = 3;
                break;
            case StatusInfo.VocType:
                _sensorType = 4;
                break;
            case StatusInfo.CCTVType:
                _sensorType = 5;
                break;
            case StatusInfo.BacterialType:
                _sensorType = 6;
                break;
            default:
                return;
        }
        

        if (this.wsMgr) {
            this.wsMgr.showPOI(_sensorType, isShow)
        }
    }

    setXrayMode = async (xrayMode) => {
        if (this.wsMgr) {
            if (xrayMode) {
                this.wsMgr.changeViewMode(2);
            } else {
                this.wsMgr.changeViewMode(1);
            }
        }

        const prevMode = [...this.state.xrayMode];
        this._setState({ xrayMode: [xrayMode, prevMode[1], prevMode[2], prevMode[3]] });

        const user = ProjectResource.getUserInfo();

        if (user) {
            //DB 전달
            await SDMSController.requestSaveOption(
                prevMode[1],
                user.id,      // UserID
                prevMode[2],  // Category
                prevMode[3],  // SubCategory
                xrayMode ? "2" : "1",       // PropertyValue1
                '',       // PropertyValue2
                '',  // PropertyValue3
                ''    // PropertyValue4
            );
        }

        // Delete
        this.setVisiblePopups(null, null, null)
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

        this.makeAlarmSensors();
        const [sensorType, zoneID, sensorID] = this.getSelectedSensorInfo();

        return (
            <div className={styles.bodyArea} style={{ MozUserSelect: 'none', WebkitUserSelect: 'none' }} /*onMouseMove={(e) => this.onMouseMove(e)}*/>

                <Link to="/sdms"><span className={uis.logoArea + " " + SdmsResource.UISection} style={{ position: 'absolute', left: '0px', top: '0px' }} onClick={() => this.onClickLogo()}><img src={YeosuLogo} /></span></Link>
                
                {
                    (this.state.selectedAlarm !== null && this.state.selectedAlarm?.isAlarm)
                        ? <EventDashboard selectedAlarm={this.state.selectedAlarm} sensorList={this.state.sensorList} />
                        : <></>
                }
                  {popupUI}
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }

                <ModeMenuBar
                    visiblePopups={this.state.visiblePopups}
                    setVisiblePopups={this.setVisiblePopups}
                    setXrayMode={this.setXrayMode}
                    xrayMode={this.state.xrayMode[0]}
                />  {/* 0103 */}

                <figure>
                    {
                        this.getAlarmSoundElements()
                    }
                </figure>

            </div>
        );
    }
}


export default SDMS;