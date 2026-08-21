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
import EventDashboardNew from './popups/eventDashboardNew';
import EventInfoNew from './popups/eventInfoNew';
//import BuildingInfo from './popups/buildingInfo';
import SensorInfo from './popups/sensorInfo';
import StatusInfo from './popups/statusInfo';
//import StatusInfoNew from './popups/statusInfoNew';
import CCTVInfo from './popups/cctvInfo';
import MiniMap from './popups/miniMap';
import Dashboard from './popups/dashboard';
import DashboardPop from './popups/dashboardPop';
import SensorStatus from './popups/sensorStatus'; 
import DetectionInfo from './popups/detectionInfo';
import SimulationInfo from './popups/simulationInfo';
import AnalysisInfo from './popups/analysisInfo';
import CompoundData from './popups/compoundData';
import RiskFactorsInfo from './popups/riskFactorsInfo';

import SettingsStore from '../../Settings/settingsStore';
import SettingResource from '../../Settings/resource/id';
import SopController from '../../SOPManager/services/sopController';
import WeatherInfo from './popups/weatherInfo';
import EditMenus from './3D/editMenus';
import EditModeStatusInfo from './popups/editModeStatusInfo';
import { EditModeManager } from './3D/editModeManager';
import ConfirmDialog from '../../Common/ui/confirmHydrogen';
import ManualReport from './popups/manualReport';
import { DashboardController } from '../../Dashboard/services/dashboardController';
//import { array } from '@amcharts/amcharts4/core';

import imgCloseBroadcast from "../img/broadcast/closeBroadcast.png";
import { SettingController } from '../../Settings/services/settingController';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';

import { SDMSComponent } from '../styled/sdmsStyled';
import SopManagerResource from '../../SOPManager/resource/id';

import { EventFullBoxComponent } from '../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../language/i18n';
import hoistStatics from 'hoist-non-react-statics';
import { GghController } from '../services/gghController';
import wsManager from '../services/wsManager';
import LnbPopup from './navigationBar/lnbPopup';

// 수소
import { ModelDataManager } from './3D/Model/ModelDataManager';

import { BuildingInfoManager } from './3D/buildingInfoManager';

class SDMS extends Component {
    static menu = {
        none: null,
        statusInfo: SDMSResource.menu.현황정보,
        //statusInfoNew: SDMSResource.menu.현황정보창,
        allCCTV: SDMSResource.menu.전체_CCTV,
        cctv: SDMSResource.menu.CCTV_영상정보,
        alarmCCTV1: SDMSResource.menu.알람_CCTV_1,
        alarmCCTV2: SDMSResource.menu.알람_CCTV_2,
        alarmCCTV3: SDMSResource.menu.알람_CCTV_3,
        cctvApp: SDMSResource.menu.CCTV_APP,
        dashboard: SDMSResource.menu.대시보드,
        dashboardPop: SDMSResource.menu.대시보드창,
        eventInfo: SDMSResource.menu.이벤트_정보,
        eventInfoNew: SDMSResource.menu.이벤트_정보창,
        miniMap: SDMSResource.menu.미니맵,
        editMode: SDMSResource.menu.편집모드,
        manualReport: SDMSResource.menu.수동신고,
        weatherInfo: SDMSResource.menu.기상정보,
        editModeStatusInfo: SDMSResource.menu.현황정보_편집모드,
        streamServerURL: null,
        //buildingInfo: SDMSResource.menu.정보,
        alarmMemo: SDMSResource.menu.알람메모,
        workerInfo: SDMSResource.menu.작업자현황,
        sensorStatus: SDMSResource.menu.센서현황,
        workerStatus: SDMSResource.menu.작업자정보,
        // 수소 -------------------------------------
        detectionInfo: SDMSResource.menu.이상_탐지,
        simulationInfo: SDMSResource.menu.시뮬레이션,
        analysisInfo: SDMSResource.menu.위험성_평가_예측,
        compoundData: SDMSResource.menu.복합센서,
        sensorInfo: SDMSResource.menu.센서정보창,
        eventDashboardNew: SDMSResource.menu.토스트알람창,
        riskFactorsInfo: SDMSResource.menu.실시간위험요인,
        // ----------------------------------------- //
    }

    static SelectedStatusInfoType = {
        none: 0,
        buildingGroup: 1,
        building: 2,
        zone: 3,
        sensor: 4,

        sensorGroups: 4,
        fireSensors: 5,
        psmSensors: 6,
        etcSensors: 7,
        cctvGroups: 8,
        cctvSubGroups: 9,
        facilityGroups: 10,
        facilitySubGroups: 11,
        closeZone: 12,
        earthquakeSensors: 13,
        strongWindSensors: 14,
        environmentSensors: 15,
        manufactureSensors: 16,
        emergencyBellSensors: 17,
        laser: 18,
        door: 19
    }

    static UseWalkingAvatar = false;

    static ChkShowHide = false;     // 팝업 열리고 닫히고 애니메이션 동작 중인지 체크

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            loading3D: true,
            site3dOptions: {},
            currentSiteID: null,
            _3dOptions: {},
            sensorAlarms: [],
            sensorOnAlarms: null,
            sensorCount: store.getState().sensorCount,
            selectedAlarm: null,
            alarmSound: true,
            command:
            {
                menu: null,
                menuParameter: null,
                zoneID: null
                /*,
                mode: Contents3D.Mode_Outdoor_All,
                modeParameter: null*/
            },
            showMenuArea: false,
            visiblePopups: {},
            cctvList: null,
            cctvAppGUID_poi: null,
            cctvAppGUID_alarms: [],
            //buildingInfo: {},
            sensorInfo: {},
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
                //statusInfoNewZIndex: 0,
                cctvInfoZIndex: -1,
                cctvInfo_1ZIndex: -1,
                cctvInfo_2ZIndex: -1,
                cctvInfo_3ZIndex: -1, 
                //buildingInfoZIndex: 0,
                dashboardZIndex: 0,
                dashboardPopZIndex: 0,
                eventZIndex: 0,
                eventInfoNewZIndex: 0,
                miniMapZIndex: 0,
                weatherInfoZIndex: 0,
                editModeStatusInfoZIndex: 0,
                manualReportZIndex: 0,
                alarmMemoZIndex: 0,
                sensorStatusZIndex: 0, /* 0929 */
                detectionInfoZIndex: 0,
                simulationInfoZIndex: 0,
                analysisInfoZIndex: 0,
                compoundDataZIndex: 0,
                sensorInfoZIndex: 0,
                riskFactorsInfoZIndex: 0,
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
                buttons: [''],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
            newCCTVList: [],
            newCCTVList_old: [],    // 백업용
            selectedNewCCTV: null,
            //dashboardSensors: null,
            walker: null,
            commonSettings: {},

            // 현황정보 선택된 Node 정보
            selectedStatusInfo: {
                buildingGroup: null,
                building: null,
                zone: null,
                sensorGroups: null,

                h2Sensors: null,
                tempSensors: null,
                flowSensors: null,
                conductSensors: null,
                gasSensors: null,
                pressureSensors: null,

                cctvGroups: null,
                cctvSubGroups: null,
                facilityGroups: null,
                facilitySubGroups: null,
            },

            selectedStatusInfoID: {
                buildingID: null,
                zoneID: null,
                sensorID: null,
            },

            rangeSensors: store.getState().rangeSensors,
            selectedRangeSensors: [],
            rangeSensor: null,
            alarmRangeSensor: null,
            viewMode: null,
            workerInfos: store.getState().workerInfos,      // 인원현황
            useSensorTypes: null,                           // 사용 중인 센서 타입  
            selectEquipZonePOI: null,
            selectEquipZoneArea: null,
            selectEquipZoneID: null,

            reload: 0,          // 새로고침 변수

            toastAlarm: null,   // 토스트 알람 팝업 대상 알람

            isMute: false,      // 음소거 여부
            menu3DTools: {},

            selectAnomalyID: null,  // 이상탐지 선택ID
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
        this.getFacilityModelName = this.getFacilityModelName.bind(this);
        this.getSpatialInfo = this.getSpatialInfo.bind(this);
        this.getSpatialBuildingGroupInfo = this.getSpatialBuildingGroupInfo.bind(this);

        this.getStreamServerURL();

        // CCTV창 별로 연결된 알람의 데이터
        this.alarmInfo = {};
        this.alarmCCTVs = {};

        this.editModeManager = new EditModeManager();

        this.setPopupState = this.setPopupState.bind(this);
        this.getPopupState = this.getPopupState.bind(this);

        this.setCctvFullScreenState = this.setCctvFullScreenState.bind(this);

        this.refBroadcast = React.createRef();

        this.titleBarSiteID = null;     // 타이틀바 siteID 선택
        this.loadActionStepNames();

        this.initAuthorAlarms();        // 계정권한에 따라 알람 SHOW/HIDE

        this.tempNewSensor = null;
        this.tempNewSensorType = null;

        this.modelDataManager = new ModelDataManager();
    }

    initVisibleSensorTypes() {
        const visibleSensorTypes = {};

        //visibleSensorTypes[SDMSMainMenu.Fire_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.CCTV_Type] = true;
        //visibleSensorTypes[SDMSMainMenu.PSM_Sensor] = true;
        //visibleSensorTypes[SDMSMainMenu.Etc_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.EquipZoneName] = true;

        visibleSensorTypes[SDMSMainMenu.H2_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.H2Low_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.O2_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Temp_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Flow_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Conduct_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.GAS_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.H2JAG_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.O2JAG_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.PRESSURE_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.PV_Panel] = false;
        
        visibleSensorTypes[SDMSMainMenu.Use3DRotation] = false;

        //visibleSensorTypes[SDMSMainMenu.EquipZoneArea] = false;
        //visibleSensorTypes[SDMSMainMenu.Worker] = true;
        //visibleSensorTypes[SDMSMainMenu.Visitor] = true;

        return visibleSensorTypes;
    }

    componentDidMount() {
        const lang = ProjectResource.getLanguage();
        if (lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }

        this.props.menuEvent.handler = this.onSelectMenu;
        this.props.menuEvent.onClickLogo = this.onClickLogo;
        this.props.menuEvent.getSDMSCommonSettings = this.getSDMSCommonSettings;

        this.requestSensorList();
        
        //this.set3DOptions();

        // 처음부터 뜰 메뉴
        var visiblePopups = this.state.visiblePopups;
        visiblePopups[SDMS.menu.statusInfo] = false;
        //visiblePopups[SDMS.menu.statusInfoNew] = false;
        //visiblePopups[SDMS.menu.allCCTV] = false;
        //visiblePopups[SDMS.menu.cctv] = false;
        //visiblePopups[SDMS.menu.alarmCCTV1] = false;
        //visiblePopups[SDMS.menu.alarmCCTV2] = false;
        //visiblePopups[SDMS.menu.alarmCCTV3] = false;
        //visiblePopups[SDMS.menu.cctvApp] = false;
        //visiblePopups[SDMS.menu.dashboard] = false;
        visiblePopups[SDMS.menu.dashboardPop] = false;
        //visiblePopups[SDMS.menu.eventInfo] = false;
        visiblePopups[SDMS.menu.eventInfoNew] = false;
        visiblePopups[SDMS.menu.miniMap] = false;
        //visiblePopups[SDMS.menu.weatherInfo] = false;
        visiblePopups[SDMS.menu.manualReport] = false;
        //visiblePopups[SDMS.menu.workerInfo] = false;
        //visiblePopups[SDMS.menu.workerStatus] = false;
        //visiblePopups[SDMS.menu.sensorStatus] = false;
        visiblePopups[SDMS.menu.detectionInfo] = true;
        visiblePopups[SDMS.menu.simulationInfo] = false;
        visiblePopups[SDMS.menu.analysisInfo] = false;
        visiblePopups[SDMS.menu.compoundData] = false;
        visiblePopups[SDMS.menu.sensorInfo] = false;
        visiblePopups[SDMS.menu.riskFactorsInfo] = false;
        

        // 사이트 및 계정권한에 따라 초기 팝업 설정
        this.initVisibles();

        this.setState({ visiblePopups: visiblePopups });

        // 각 페이지 별로 클래스 초기화
        $('#mainSB').addClass('posi_relative');
        $('#headerSB').addClass('posiHeaderWrap');
        $('#headerSB').removeClass('appHeaderWrap');
        

        //팝업 상태값 일괄 획득
        this.getPopupState();
        // 대시보드 센서 목록 초기화
        //this.initDashboardSensors();
        // 사용중인 센서 타입 초기화
        this.initUseSensorTypes();

        this.unsubscribe = store.subscribe(function () {
            this.changeAlarm(store.getState());            
            this.changeSensorCount(store.getState());
            //this.changeWeather(store.getState());
            this.changeNewCCTVList(store.getState());
            //this.changeCommonSettings(store.getState());
            this.setRangeSensorStatus(store.getState());
            this.setWorkerInfos(store.getState());
        }.bind(this));

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'RESET_POPUP') {
                this.resetPopupState(data.popupState);
            } else if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                this.changeSDMSCommonSettings(data.sdmsCommonSettings);
                // 사용중인 센서타입 reload
                this.reloadUseSensorTypes(data.sdmsCommonSettings);
            }
            
        }.bind(this));

        window.addEventListener('beforeunload', this.closeAllCCTVs);

        document.addEventListener("visibilitychange", this.showCCTVPopups);

        this.setWsManager();

        this.closeAllCCTVs();
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribe_SettingsStore();

        this.closeAllCCTVs();
        window.removeEventListener('beforeunload', this.closeAllCCTVs);

        if (this.wsManager) {
            this.wsManager.close();
            this.wsManager = null;
        }
    }

    closeAllCCTVs = async () => {
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.siteID >= ProjectResource.Site.GG_A && userInfo?.siteID <= ProjectResource.Site.GG_H) {
            if (this.wsManager) {
                this.wsManager.closeAll(userInfo.id);
            }
        }
    }

    showCCTVPopups = async () => {
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.siteID >= ProjectResource.Site.GG_A && userInfo?.siteID <= ProjectResource.Site.GG_H) {
            this.wsManager.showCCTV(userInfo.id, document.visibilityState === "visible" ? true : false)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(this.alarmCCTVs);
        
        if (this.refBroadcast.current) {
            const dashboard = document.getElementById(SDMSResource.popupLayer.dashboard);
            
            if (dashboard) {
                const rectDashboard = dashboard.getBoundingClientRect();
                const broadcastRight = rectDashboard.right + 11;
                this.refBroadcast.current.style.left = broadcastRight + 'px';
            }
        }
    }

    async loadActionStepNames() {
        // 각 사이트별 단계배열 및 단계명 초기화
        await SopController.loadActionStepNames();
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
            this.setTempNewSensor(selectedNewCCTV, SDMSMainMenu.CCTV_Type);
            this.setState({ newCCTVList, selectedNewCCTV: selectedNewCCTV });
        }
    }

    async initVisibles() {
        let visiblePopups = this.state.visiblePopups;
        let visibleSensorTypes = this.state.visibleSensorTypes;
        let isUpdate = false;
        
        const userInfo = await ProjectResource.initUserInfo();

        // 사이트 별
        const siteID = ProjectResource.SiteID;
        if (siteID === ProjectResource.Site.Hydrogen ||
            siteID === ProjectResource.Site.CheongSim || 
            siteID === ProjectResource.Site.GG_A) {
            visiblePopups[SDMS.menu.weatherInfo] = false;
            isUpdate = true;
        }        
        
        if (isUpdate) 
            this.setState({ visiblePopups, visibleSensorTypes });
    }

    async initAuthorAlarms() {
        let selectedAlarm = null;
        let sensorAlarms = store.getState().sensorAlarm;
        const userInfo = await ProjectResource.initUserInfo();

        if (this.state.sensorAlarms?.length > 0) {
            selectedAlarm = this.state.sensorAlarms[0];
        }
        
        this.setState({ sensorAlarms, selectedAlarm });
    }

    changeSDMSCommonSettings(storeValue) {
        const commonSettings = storeValue ? storeValue : {};

        this.setState({ commonSettings: commonSettings });
    }

    getSDMSCommonSettings = (propertyName) => {
        const commonSettings = { ...this.state.commonSettings };
        return commonSettings[propertyName];
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
        const userInfo = ProjectResource.getUserInfo();
        const alarms = storeValue.sensorAlarm;

        // 계정권한에 따라 알람 SHOW/HIDE
        if (storeValue?.actionType !== 'SENSOR_ALARM')
            return;

        const orgAlarms = this.state.sensorAlarms;
        
        var menus = this.state.visiblePopups;

        // 선택된 알람이 변동이 없다면 현재 선택된 알람으로 유지 - 2023.02.15 K.D.R
        let selectedAlarm = (this.state.selectedAlarm) ? this.state.selectedAlarm : null;
        if (alarms && alarms.length > 0) {
            let findAlarm = null;

            if (selectedAlarm) {
                // 기존에 선택된 알람이 있고 새로운 알람 리스트 선택된 알람이 있다면 유지
                findAlarm = alarms.find(x => x.sensorZoneHistoryID === selectedAlarm.sensorZoneHistoryID && x.isAlarm == true);
            }

            if (findAlarm) {
                selectedAlarm = findAlarm;
            } else {
                // 없다면 알람 리스트 중 첫번째 알람 선택      
                selectedAlarm = alarms[0];
            }
        }

        let alarmType = "";
        let alarmCCTV = "";

        if (selectedAlarm && selectedAlarm.isAlarm)
        {
            // 정전신호는 센서가 따로 없기에 CCTV를 따로 띄우지 않도록 추가 설정 
            if (selectedAlarm.sensorZoneID < 1000000 && selectedAlarm.orgSensorID) {
                //alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                //menus[SDMS.menu.eventInfo] = true;

                // 수소 CCTV 정보가 없기 때문에 주석처리 - 수소
                //let alarmCCTVID = null;               
                //alarmCCTV = this.showAlarmCCTV(alarmType, selectedAlarm);
                //this.getEquipZoneCCTV(selectedAlarm.equipZoneID, alarmCCTV, alarmCCTVID, selectedAlarm.facilityType);
            }
        }


        if (selectedAlarm === null || !selectedAlarm.isAlarm) { // 알람 없음
            this.hideAlarm();

            // 편집모드 경우 알람, 알람해제 시 카메라 이동이 없음 - K.D.R
            if (this.isEditMode() !== true)
                this.onClickLogo();
        }
        else {
            // .TODO: 이동 해야할 알람을 선택되는 로직 부분 >> 선택된 알람을 통해서 토스트 팝업을 띄우기
            let moveToAlarm = await this.checkAlarm(orgAlarms, alarms, true, alarmCCTV);
            await this.checkAlarm(alarms, orgAlarms, false, alarmCCTV);

            if (moveToAlarm) {
                selectedAlarm = moveToAlarm;
            }
            else {
                // 새로 발생한 알람이 없으면 현재 선택된 알람으로 3D 이동한다
                if (selectedAlarm) {
                    if (this.state.commonSettings?.MoveDisplayAlarm !== SettingResource.moveDisplayAlarm.currentDisplay) {
                        // 알람 중지시 CCTV 팝업창 불일치 오류 수정
                        //await this.showAlarm(selectedAlarm, null);
                        //const alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
    
                        // 수소 CCTV 정보가 없기 때문에 주석처리 - 수소
                        //const _targetCCTVMenu = this.showAlarmCCTV(alarmType, selectedAlarm);
                        //await this.showAlarm(selectedAlarm, _targetCCTVMenu);
                    }

                    // 새로운 알람이 없다면 - 수소
                    selectedAlarm = null;
                }
            }
        }

        if (selectedAlarm === null) {
            // 선택된 알람이 있다면 해제
            if (this.state.selectedAlarm) {
                this.state.selectedAlarm = null;
                
                // 알람 소리 끄기
                const cmd = {};
                cmd.menu = SDMSMainMenu.Menu_Hide_Alarm;
                this.state.command = cmd;
            }

            this.setState({ sensorAlarms: alarms, toastAlarm: selectedAlarm, visiblePopups: menus, alarmSound: false });            
        }
        else {
            // 토스트 알람 팝업창 띄우기
            if (selectedAlarm && selectedAlarm.isAlarm) {
                menus[SDMS.menu.eventDashboardNew] = true;
            }
            if (selectedAlarm.isAlarm === false && this.state.selectedAlarm?.orgSensorID === selectedAlarm.orgSensorID) {
                // 현재 선택된 알람 정보가 바뀌지 않기 때문에
                this.state.selectedAlarm = selectedAlarm;
            }
            
            // 수소 PSM, ETC 센서 현황 정보가 없기에 주석처리 - 수소
            //const alarmRangeSensor = this.getAlarmRangeSensor(selectedAlarm);
            //if (selectedAlarm?.isAlarm && alarmRangeSensor) {
            //    menus[SDMS.menu.sensorStatus] = true;
            //    this.state.alarmRangeSensor = alarmRangeSensor;
            //} 
            // 위험성 평가 알람 경우 창 띄우기
            //const isRiskAssess = this.checkRiskAssess(selectedAlarm);
            //if (isRiskAssess) {
            //    menus[SDMS.menu.riskFactorsInfo] = true;
            //}


            this.setState({ sensorAlarms: alarms, toastAlarm: selectedAlarm, visiblePopups: menus, alarmSound: selectedAlarm.isAlarm });
        }
    }

    getAlarmRangeSensor(alarm) {
        if (this.useSensorList() === false)
            return null;

        if (alarm.facilityType === SDMSResource.facilityType.PSM_SENSOR) {
            const psmSensors = this.state.rangeSensors?.rangePsmSensors?.length > 0 ? this.state.rangeSensors?.rangePsmSensors : [];

            for (const sensor of psmSensors) {
                if (alarm?.orgSensorID?.toString() === sensor.id.toString()) {
                    return sensor;
                }
            }
        } else if (alarm.facilityType === SDMSResource.facilityType.ETC) {
            const etcSensors = this.state.rangeSensors?.rangeEtcSensors?.length > 0 ? this.state.rangeSensors?.rangeEtcSensors : [];

            for (const sensor of etcSensors) {
                if (alarm?.orgSensorID?.toString() === sensor.id.toString()) {
                    return sensor;
                }
            }
        }
        
        return null;
    }

    getAlarmTypeFromMessage(message) {
        // TODO: 지역화 필요함
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
        if (!selectedAlarm) {
            return;
        }

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
                    returnAlarm.unshift(targetAlarms[i]);
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

                                    // .TODO: 알람 단계 변화를 새로운 알람이라고 판단하는 부분 >> 새로운 알람이라고 처리해야 할지 고민 필요
                                    // alarms : org alarm
                                    // targetAlarms: new alarm
                                    // 같은 Equipzone에 알람이 추가됐나 ?
                                    // 같은 Equipzone에 alarmSensorZoneIDs 값에 변동이 있다 체크로 수정 - 2023.02.15 K.D.R
                                    if (targetAlarms.length - 1 >= j &&
                                        (alarms[j].alarmSensorZoneIDs.length != targetAlarms[i].alarmSensorZoneIDs.length ||
                                        alarms[j].alarmDepth != targetAlarms[i].alarmDepth)) {
                                            isUpdate = true;
                                    }
                                    else {
                                        isUpdate = false;
                                    }
                                }
                                else {
                                    // 알람 해제
                                    // alarms : new alarm
                                    // targetAlarms: org alarm
                                    if (!alarms[j].isAlarm) { // 알람해제 상태인가?
                                        isUpdate = true;

                                    }
                                    else {
                                        // .TODO: 알람 단계 변화를 새로운 알람이라고 판단하는 부분 >> 새로운 알람이라고 처리해야 할지 고민 필요
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
        //const moveToOption = (this.state.commonSettings?.MoveDisplayAlarm) ? this.state.commonSettings.MoveDisplayAlarm : SettingResource.moveDisplayAlarm.lastAlarm;
        const moveToOption = SettingResource.moveDisplayAlarm.lastAlarm;
        let moveToSensor = new Array();

        for (let k = 0; k < returnAlarm.length; k++) {
            for (let i = 0; i < returnAlarm[k].alarmSensorZoneIDs.length; i++) {
                //const [orgSensorID, isAlarmStatus] = await SDMSController.getOrgSensorID(returnAlarm[k].alarmSensorZoneIDs[i]);

                const sensorZoneID = returnAlarm[k].alarmSensorZoneIDs[i];
                if (sensorZoneID < 1000000) {
                    let nOrgSensorID = -1;

                    const sensor = this.getOrgSensor(returnAlarm[k].facilityType, sensorZoneID, returnAlarm[k].orgSensorID)
                    if (!sensor) {
                        continue;
                    }

                    nOrgSensorID = sensor.id;

                    if (isChg) { // 알람 발생
                        if (k == returnAlarm.length - 1) {
                            //this.moveToSensor(returnAlarm[k].zoneID, returnAlarm[k].facilityType, orgSensorID);
                        }

                        // targetCCTVMenu 가 해당 알람과 일치 하지 않음 - 2023.02.13 K.D.R
                        //const alarmType = this.getAlarmTypeFromMessage(returnAlarm[k].message);
                        //const _targetCCTVMenu = this.showAlarmCCTV(alarmType, returnAlarm[k]);
                        //this.addAlarm(returnAlarm[k].zoneID, returnAlarm[k].facilityType, nOrgSensorID, returnAlarm[k].alarmDepth, returnAlarm[k].equipZoneID, targetCCTVMenu);
                        
                        // 수소는 새로운 알람이 바로 선택되는 형태가 아니라 주석처리
                        //await this.addAlarm(returnAlarm[k].zoneID, returnAlarm[k].facilityType, nOrgSensorID, returnAlarm[k].alarmDepth, returnAlarm[k].equipZoneID, _targetCCTVMenu, returnAlarm[k].dtTime);

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

                        const sensor = this.getOrgSensor(moveToSensor[i].facilityType, sensorZoneID, moveToSensor[i].orgSensorID);
                        if (!sensor) {
                            continue;
                        }

                        nOrgSensorID = sensor.id;

                        // 수소는 새로운 알람이 바로 선택되는 형태가 아니라 주석처리
                        //this.processMenu(SDMSMainMenu.Menu_Show_Alarm, [moveToSensor[i].zoneID, SDMS.getFacilityType(moveToSensor[i].facilityType), nOrgSensorID, moveToSensor[i].alarmDepth, moveToSensor[i].isAlarm]);
                        // targetCCTVMenu 가 해당 알람과 일치 하지 않음. - 2023.02.13 K.D.R
                        //const alarmType = this.getAlarmTypeFromMessage(moveToSensor[i].message);
                        //const _targetCCTVMenu = this.showAlarmCCTV(alarmType, moveToSensor[i]);
                        //await this.addAlarm(moveToSensor[i].zoneID, moveToSensor[i].facilityType, nOrgSensorID, moveToSensor[i].alarmDepth, moveToSensor[i].equipZoneID, _targetCCTVMenu, moveToSensor[i].dtTime);
                    }
                    else {
                        // 수소는 새로운 알람이 바로 선택되는 형태가 아니라 주석처리
                        //await this.showAlarm(moveToSensor[i], null);
                    }
                    selectedAlarm = moveToSensor[i];
                }
            }
        }

        return selectedAlarm;
    }

    getOrgSensor(facilityType, sensorZoneID, orgSensorID = null) {
        if (SDMSResource.isH2SensorType(facilityType)) {
            if (this.state.sensorList.h2Sensors) {
                const sensorLength = this.state.sensorList.h2Sensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.h2Sensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isTempSensorType(facilityType)) {
            if (this.state.sensorList.tempSensors) {
                const sensorLength = this.state.sensorList.tempSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.tempSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isFlowSensorType(facilityType)) {
            if (this.state.sensorList.flowSensors) {
                const sensorLength = this.state.sensorList.flowSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.flowSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isConductivitySensorType(facilityType)) {
            if (this.state.sensorList.conductSensors) {
                const sensorLength = this.state.sensorList.conductSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.conductSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isGASSensorType(facilityType)) {
            if (this.state.sensorList.gasSensors) {
                const sensorLength = this.state.sensorList.gasSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.gasSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isPressureSensorType(facilityType)) {
            if (this.state.sensorList.pressureSensors) {
                const sensorLength = this.state.sensorList.pressureSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.pressureSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isO2SensorType(facilityType)) {
            if (this.state.sensorList.o2Sensors) {
                const sensorLength = this.state.sensorList.o2Sensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.o2Sensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isH2LowSensorType(facilityType)) {
            if (this.state.sensorList.h2LowSensors) {
                const sensorLength = this.state.sensorList.h2LowSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.h2LowSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isH2GasSensorType(facilityType)) {
            if (this.state.sensorList.h2JAGSensors) {
                const sensorLength = this.state.sensorList.h2JAGSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.h2JAGSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isO2GasSensorType(facilityType)) {
            if (this.state.sensorList.o2JAGSensors) {
                const sensorLength = this.state.sensorList.o2JAGSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.o2JAGSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isAnomalySensorType(facilityType) || SDMSResource.isRiskSensorType(facilityType)) {
            if (this.state.sensorList.tempSensors) {
                const sensorLength = this.state.sensorList.tempSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.tempSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.tempSensors) {
                const sensorLength = this.state.sensorList.tempSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.tempSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.flowSensors) {
                const sensorLength = this.state.sensorList.flowSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.flowSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.conductSensors) {
                const sensorLength = this.state.sensorList.conductSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.conductSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.gasSensors) {
                const sensorLength = this.state.sensorList.gasSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.gasSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.pressureSensors) {
                const sensorLength = this.state.sensorList.pressureSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.pressureSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.o2Sensors) {
                const sensorLength = this.state.sensorList.o2Sensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.o2Sensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.h2LowSensors) {
                const sensorLength = this.state.sensorList.h2LowSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.h2LowSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.h2JAGSensors) {
                const sensorLength = this.state.sensorList.h2JAGSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.h2JAGSensors[i];
                    if (sensor.id === orgSensorID) {
                        return sensor;
                    }
                }
            }
            if (this.state.sensorList.o2JAGSensors) {
                const sensorLength = this.state.sensorList.o2JAGSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.o2JAGSensors[i];
                    if (sensor.id === orgSensorID) {
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
            this.showConfirmDialog(i18n.t('sdms.formText.알람 종료'), [i18n.t('sdms.formText.수동 신고한 상황을 종료할까요?')], [i18n.t('sdms.formText.종료'), i18n.t('common.취소')], this.onClickMalfunction);
        }
        else {
            this.showConfirmDialog(i18n.t('sdms.formText.알람 종료'), [i18n.t('sdms.formText.탐지된 신호를 종료할까요?')], [i18n.t('sdms.formText.종료'), i18n.t('sdms.formText.오작동'), i18n.t('common.취소')], this.onClickMalfunction);
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
        this.showConfirmDialog(i18n.t('sdms.formText.권한'), [i18n.t('sdms.formText.해당 로그인 사용자는 권한이 없습니다')], null, null);
    }

    async requestSensorList() {        
        let siteIDs = null;        

        const [result, message] = await SDMSController.requestSensorList(siteIDs);
        const facilityInfos = await SDMSController.requestAllFacilityInfo();

        if (result === null) {
            console.log(message);
            this.setState({ facilityInfos: facilityInfos });
        }
        else {            
            const sensorList = {};
            if (result.h2Sensors) {
                sensorList['h2Sensors'] = result.h2Sensors;
            }
            if (result.tempSensors) {
                sensorList['tempSensors'] = result.tempSensors;
            }
            if (result.flowSensors) {
                sensorList['flowSensors'] = result.flowSensors;
            }
            if (result.conductSensors) {
                sensorList['conductSensors'] = result.conductSensors;
            }
            if (result.gasSensors) {
                sensorList['gasSensors'] = result.gasSensors;
            }
            if (result.pressureSensors) {
                sensorList['pressureSensors'] = result.pressureSensors;
            }

            if (result.h2LowSensors) {
                sensorList['h2LowSensors'] = result.h2LowSensors;
            }
            if (result.o2Sensors) {
                sensorList['o2Sensors'] = result.o2Sensors;
            }
            if (result.h2JAGSensors) {
                sensorList['h2JAGSensors'] = result.h2JAGSensors;
            }
            if (result.o2JAGSensors) {
                sensorList['o2JAGSensors'] = result.o2JAGSensors;
            }




            this.setState({ sensorList: sensorList, facilityInfos: facilityInfos });
            await this.set3DOptions(sensorList);
            
        }
    }

    async set3DOptions(sensorList) {
        let siteIDs = null;
        const userInfo = await ProjectResource.initUserInfo();

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);

        const site3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, userInfo ? userInfo.id : 0, siteIDs);
        //const _3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, userInfo.id);

        const isMultiSite = ProjectResource.IsMultiSite;
        const showSiteID = userInfo?.showSiteID;

        let first3DOptions = null;
        let firstSiteID = null;

        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];
            //this.setSensorList(_3dOptions, sensorList, siteID);

            if (!first3DOptions) {
                first3DOptions = _3dOptions;
                firstSiteID = siteID;
            }

            // 멀티사이트 경우 시작 사이트 설정 확인
            if (isMultiSite === true && showSiteID > 0 && showSiteID.toString() === siteID) {
                first3DOptions = _3dOptions;
                firstSiteID = siteID;
                break;
            }

            // 경기도청의 경우 로그인 유저의 siteID로 초기 siteID 설정
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                firstSiteID = userInfo.siteID;
            }
        }

        this.setSensorList(site3dOptions, sensorList);

        this.setState({ loading: false, site3dOptions: site3dOptions, currentSiteID: firstSiteID, _3dOptions: first3DOptions, buildingGroupList, viewMode: userInfo?.options?.viewMode });
        //this.setState({ loading: false, _3dOptions, buildingGroupList });


        // 타이틀바 siteID 선택
        const _firstSiteID = parseInt(firstSiteID);
        if (_firstSiteID !== NaN) {
            this.titleBarSiteID = _firstSiteID;
        }
    }

    setStateLoading3D = (value) => {
        this.setState({ loading3D: value });
    }

    setSensorList(site3dOptions, sensorList) {
        if (!sensorList || !site3dOptions) {
            console.log('[error] sensorList가 없음');
        }
        else {
            const h2Sensors = sensorList['h2Sensors'];
            const tempSensors = sensorList['tempSensors'];            
            const flowSensors = sensorList['flowSensors'];
            const conductSensors = sensorList['conductSensors'];
            const gasSensors = sensorList['gasSensors'];
            const pressureSensors = sensorList['pressureSensors'];

            const h2LowSensors = sensorList['h2LowSensors'];
            const o2Sensors = sensorList['o2Sensors'];
            const h2JAGSensors = sensorList['h2JAGSensors'];
            const o2JAGSensors = sensorList['o2JAGSensors'];

            if (h2Sensors) {
                this.setH2Sensors(h2Sensors, site3dOptions);
            }

            if (tempSensors) {
                this.setTempSensors(tempSensors, site3dOptions);
            }

            if (flowSensors) {
                this.setFlowSensors(flowSensors, site3dOptions);
            }

            if (conductSensors) {
                this.setConductSensors(conductSensors, site3dOptions);
            }

            if (gasSensors) {
                this.setGasSensors(gasSensors, site3dOptions);
            }

            if (pressureSensors) {
                this.setPressureSensors(pressureSensors, site3dOptions);
            }



            if (h2LowSensors) {
                this.setH2LowSensors(h2LowSensors, site3dOptions);
            }

            if (o2Sensors) {
                this.setO2Sensors(o2Sensors, site3dOptions);
            }

            if (h2JAGSensors) {
                this.setH2JAGSensors(h2JAGSensors, site3dOptions);
            }

            if (o2JAGSensors) {
                this.setO2JAGSensors(o2JAGSensors, site3dOptions);
            }
        }
    }

    getSiteID = (site3dOptions, zoneID) => {
        let _siteID = null;

        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];
            const zone = _3dOptions.zones[zoneID];

            if (zone) {
                _siteID = siteID;
                break;
            }
            else if (zoneID >= SDMSResource.zoneID.outdoor)
            {   // 외곽일 경우
                const siteData = ProjectResource.SiteID + zoneID - SDMSResource.zoneID.outdoor;
                if (siteID === siteData?.toString()) {
                    _siteID = siteID;
                    break;
                }
            }
        }

        if (!_siteID)
            _siteID = this.state.currentSiteID;

        return _siteID;
    }

    getZone(site3dOptions, zoneID) {
        let zone = null;

        for (const siteID in site3dOptions) {
            const _3dOptions = site3dOptions[siteID];
            // 멀티사이트 관련 수정
            zone = _3dOptions.zones[zoneID];

            if (!zone && zoneID !== null && zoneID !== undefined) {
                zone = _3dOptions.outdoorZones[zoneID.toString()];
            }

            if (zone)
                break;
        }

        return zone;
    }

    setH2Sensors(h2Sensors, site3dOptions) {
        const sensorCount = h2Sensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = h2Sensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.h2) {
                    zone.sensors.h2 = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.h2.push(sensor);
            }
        }
    }

    setTempSensors(tempSensors, site3dOptions) {
        const sensorCount = tempSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = tempSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.temp) {
                    zone.sensors.temp = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.temp.push(sensor);
            }
        }
    }

    setFlowSensors(flowSensors, site3dOptions) {
        const sensorCount = flowSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = flowSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.flow) {
                    zone.sensors.flow = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.flow.push(sensor);
            }
        }
    }

    setConductSensors(conductSensors, site3dOptions) {
        const sensorCount = conductSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = conductSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.conduct) {
                    zone.sensors.conduct = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.conduct.push(sensor);
            }
        }
    }

    setGasSensors(gasSensors, site3dOptions) {
        const sensorCount = gasSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = gasSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.gas) {
                    zone.sensors.gas = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.gas.push(sensor);
            }
        }
    }

    setPressureSensors(pressureSensors, site3dOptions) {
        const sensorCount = pressureSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = pressureSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.pressure) {
                    zone.sensors.pressure = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.pressure.push(sensor);
            }
        }
    }


    setH2LowSensors(h2LowSensors, site3dOptions) {
        const sensorCount = h2LowSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = h2LowSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.h2low) {
                    zone.sensors.h2low = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.h2low.push(sensor);
            }
        }
    }

    setO2Sensors(o2Sensors, site3dOptions) {
        const sensorCount = o2Sensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = o2Sensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.o2) {
                    zone.sensors.o2 = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.o2.push(sensor);
            }
        }
    }

    setH2JAGSensors(h2JAGSensors, site3dOptions) {
        const sensorCount = h2JAGSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = h2JAGSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.h2jag) {
                    zone.sensors.h2jag = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.h2jag.push(sensor);
            }
        }
    }

    setO2JAGSensors(o2JAGSensors, site3dOptions) {
        const sensorCount = o2JAGSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = o2JAGSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.o2jag) {
                    zone.sensors.o2jag = [];
                }

                const sensorInfo = this.modelDataManager.searchSensorID(sensor.id);
                if (sensorInfo) {
                    sensor.isIndoor = sensorInfo.isIndoor;
                }

                zone.sensors.o2jag.push(sensor);
            }
        }
    }

    onSelectMenu = (menu, param, zoneID) => {
        if (menu === SDMSMainMenu.Menu_Show_Menu_Area) {
            this.setState({ showMenuArea: !this.state.showMenuArea });
        }
        else if (menu === SDMSMainMenu.Menu_Refresh) {
            this.setState({ showMenuArea: this.state.showMenuArea });
        }
        else if (menu === SDMSResource.menu.현황정보 ||
            menu === SDMSResource.menu.현황정보창 ||
            menu === SDMSResource.menu.대시보드 ||
            menu === SDMSResource.menu.대시보드창 ||
            menu === SDMSResource.menu.CCTV_영상정보 ||
            menu === SDMSResource.menu.전체_CCTV ||
            menu === SDMSResource.menu.알람_CCTV_1 ||
            menu === SDMSResource.menu.알람_CCTV_2 ||
            menu === SDMSResource.menu.알람_CCTV_3 ||
            menu === SDMSResource.menu.이벤트_정보 ||
            menu === SDMSResource.menu.이벤트_정보창 ||
            menu === SDMSResource.menu.미니맵 ||
            menu === SDMSResource.menu.인원현황 || /* 0929 */
            menu === SDMSResource.menu.작업일지 ||
            menu === SDMSResource.menu.센서현황 ||
            menu === SDMSResource.menu.기상정보 ||            
            menu === SDMSResource.menu.이력데이터 ||
            menu === SDMSResource.menu.이상_탐지 ||
            menu === SDMSResource.menu.시뮬레이션 ||
            menu === SDMSResource.menu.위험성_평가_예측 ||
            menu === SDMSResource.menu.집수정 ||
            menu === SDMSResource.menu.복합센서||
            menu === SDMSResource.menu.센서정보창) {
            this.setVisiblePopups(menu);
        }
        else if (menu === SDMSResource.menu.수동신고 ||
            menu === SDMSResource.menu.안전구역_평가) {
            this.checkAuthPopups(menu);
        }
        else if (menu === SDMSResource.menu.편집모드) {
            this.setEditMode(true);
        }
        else {
            this.processMenu(menu, param, zoneID);
        }
    }

    checkAuthPopups = (menu) => {
        // 사용자 권한 체크
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor !== AccountResource.accountLevelID.master &&
            userAuthor !== AccountResource.accountLevelID.admin) {
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
            const [buildingGroup, building, zone, sensorType, sensorID] = this.onChangeBuildingGroup2(poi);
            if (buildingGroup && building && zone && sensorID) {
                const selectedStatusInfo = this.state.selectedStatusInfo;
                
                selectedStatusInfo.buildingGroup = buildingGroup;
                selectedStatusInfo.building = building;
                selectedStatusInfo.zone = zone;

                //if (sensorType === 'cctv') {
                //    selectedStatusInfo.sensorGroups = false;
                //    selectedStatusInfo.cctvGroups = true;
                //    selectedStatusInfo.cctvSubGroups = true;
                //    selectedStatusInfo.facilityGroups = false;
                //    selectedStatusInfo.facilitySubGroups = false;
                //}                
                //else {
                    selectedStatusInfo.sensorGroups = true;
                    // 기본 센서 외 제외처리 - 수소
                    if (sensorType === 'h2') {
                        selectedStatusInfo.h2Sensors = true;
                        selectedStatusInfo.tempSensors = false;
                        selectedStatusInfo.flowSensors = false;
                        selectedStatusInfo.conductSensors = false;
                        selectedStatusInfo.gasSensors = false;
                        selectedStatusInfo.pressureSensors = false;
                    }
                    else if (sensorType === 'temp') {
                        selectedStatusInfo.h2Sensors = false;
                        selectedStatusInfo.tempSensors = true;
                        selectedStatusInfo.flowSensors = false;
                        selectedStatusInfo.conductSensors = false;
                        selectedStatusInfo.gasSensors = false;
                        selectedStatusInfo.pressureSensors = false;
                    }
                    else if (sensorType === 'flow') {
                        selectedStatusInfo.h2Sensors = false;
                        selectedStatusInfo.tempSensors = false;
                        selectedStatusInfo.flowSensors = true;
                        selectedStatusInfo.conductSensors = false;
                        selectedStatusInfo.gasSensors = false;
                        selectedStatusInfo.pressureSensors = false;
                    }
                    else if (sensorType === 'conduct') {
                        selectedStatusInfo.h2Sensors = false;
                        selectedStatusInfo.tempSensors = false;
                        selectedStatusInfo.flowSensors = false;
                        selectedStatusInfo.conductSensors = true;
                        selectedStatusInfo.gasSensors = false;
                        selectedStatusInfo.pressureSensors = false;
                    }
                    else if (sensorType === 'gas') {
                        selectedStatusInfo.h2Sensors = false;
                        selectedStatusInfo.tempSensors = false;
                        selectedStatusInfo.flowSensors = false;
                        selectedStatusInfo.conductSensors = false;
                        selectedStatusInfo.gasSensors = true;
                        selectedStatusInfo.pressureSensors = false;
                    }
                    else if (sensorType === 'pressure') {
                        selectedStatusInfo.h2Sensors = false;
                        selectedStatusInfo.tempSensors = false;
                        selectedStatusInfo.flowSensors = false;
                        selectedStatusInfo.conductSensors = false;
                        selectedStatusInfo.gasSensors = false;
                        selectedStatusInfo.pressureSensors = true;
                    }
                    
                    selectedStatusInfo.cctvGroups = false;
                    selectedStatusInfo.cctvSubGroups = false;
                    selectedStatusInfo.facilityGroups = false;
                    selectedStatusInfo.facilitySubGroups = false;
                //}

                // 센서 선택
                this.onChangeStatusInfoID(building.id, zone.id, sensorID);

                this.setState({ selectedStatusInfo });
            }

            this.setState({ selectedPOI: [poi, updateDB] });
        }
        else {
            if (this.state.selectedPOI !== null) {
                // .TODO: 현황정보 POI 선택 해제
                let selectedStatusInfoID = this.state.selectedStatusInfoID;                
                selectedStatusInfoID.zoneID = null;
                selectedStatusInfoID.sensorID = null;

                this.setState({ selectedPOI: null, selectedStatusInfoID });
            }            
        }
    }

    onSelectEquipZonePOI = (poi) => {
        this.setState({selectEquipZonePOI: poi});
    }

    onSelectEquipZoneArea = (area) => {
        this.setState({selectEquipZoneArea: area});
    }

    selectEquipZoneID = (equipZoneID) => {
        if (equipZoneID !== null && (!equipZoneID || equipZoneID < 1))
            return;

        const menus = this.state.visiblePopups;
        
        let selectEquipZoneID = this.state.selectEquipZoneID;

        if (selectEquipZoneID !== equipZoneID)
            this.setState({ selectEquipZoneID: equipZoneID });
    }

    postSelectSensorForCCTVGroup = (poi, equipZoneID, equipZoneName, cctvList) => {
        const menus = this.state.visiblePopups;
        menus[SDMS.menu.cctv] = true;

        if (equipZoneID === null) {
            this.clearEqiupZoneCCTVs();
        }

        this.setState({ selectedPOI: [poi, false], cctvList: cctvList, visiblePopups: menus });
    }

    async processMenu(menu, param, zoneID) {
        if (menu === SDMSMainMenu.Menu_Move_Sensor) {
            const result = await this.moveSensor(param[0], param[1], param[2], param[3], param[4], param[5]);

            if (result === false)
                return;
        }

        const cmd = {};
        cmd.menu = menu;
        cmd.menuParameter = param;
        cmd.zoneID = zoneID;
        /*cmd.mode = this.state.command.mode;
        cmd.modeParameter = this.state.command.modeParameter;*/
        if (menu === SDMSMainMenu.Menu_Add_Alarm) {
            this.setState({ command: cmd, alarmSound: true });
        }
        else if (menu === SDMSMainMenu.Menu_Move_POI) {
            this.setState({ command: cmd, selectedPOI: null });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_POI) {
            if (param && param.length >= 3) {
                this.setState({ command: cmd, selectedPOI: [param[1], param[2], param[0]] });
            }
            else {
                this.setState({ command: cmd });
            }
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_Facility)
        {
            this.setState({ command: cmd, selectedPOI: [param[1], param[0]] });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_BuildingGroup && param && Array.isArray(param) && param.length > 0 && !param[0]) {
            // 외부영역 항목에서 이동 버튼을 눌렀을때
            this.onClickLogo();
        }
        else if (menu === SDMSMainMenu.Menu_Show_Alarm && param[1] !== SDMSMainMenu.Earthquake_Sensor) {
            // .TODO: 알람 표시 하기 전에 멀티사이트 경우 사이트 변경 확인
            const multiSite = this.isMultiSite();
            if (multiSite) {
                const [zoneID, sensorType, sensorID, alarmLevel, isAlarm] = param;
                const siteID = this.getSiteID(this.state.site3dOptions, zoneID);
                if (siteID !== this.state.currentSiteID) {
                    const isMovingCamera = false;
                    this.changeSite(siteID, isMovingCamera);
                }
            }

            this.setState({ command: cmd });
        }
        else if (param && param[1] !== SDMSMainMenu.Earthquake_Sensor) {
            this.setState({ command: cmd });
        }
    }

    setEditMode = (isEditMode) => {
        this.setTempNewSensor(null, null);
        const poiManager = this.editModeManager?.contents3D?.poiManager;

        if (poiManager) {
            poiManager.clearTempPOI();
        }

        // 계정 권한 확인
        const userAuthor = ProjectResource.getUserAuthor();
        if (userAuthor !== AccountResource.accountLevelID.master &&
            userAuthor !== AccountResource.accountLevelID.admin) {
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
                this.showConfirmDialog(i18n.t('common.확인'), [i18n.t('sdms.formText.편집중인 데이터가 있습니다'), i18n.t('sdms.formText.저장할까요?')], [i18n.t('sdms.formText.저장 후 종료'), i18n.t('sdms.formText.저장하지 않고 종료'), i18n.t('common.취소')], this.onClickEditModeCloseConfirm);
                return;
            }

            this.clearEqiupZoneCCTVs();

            // 가벽 추가 중 취소했다면 생성 중인 가벽 삭제
            this.editModeManager.cancleFakeWall();

            this.editModeManager.cancleEquipZoneArea();     // 영역 추가 중 취소했다면 생성 중인 영역 삭제

            selectedPOI = null;
            editMode = Contents3D.Edit_Mode_None;

            // CCTV 팝업창 닫기 버튼 표시
            $('#cctvInfoCloseBtn').show();
        }

        SettingsStore.dispatch({ type: 'IS_EDIT_MODE', isEditMode: isEditMode });
        this.setState({ editMode, selectedPOI, selectEquipZonePOI: null });
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

            this.editModeManager.cancleEquipZoneArea();     // 영역 추가 중 취소했다면 생성 중인 영역 삭제

            this.setState({ confirmMessage, selectedPOI: null, command, selectEquipZonePOI: null });

            // CCTV 팝업창 닫기 버튼 표시
            $('#cctvInfoCloseBtn').show();
        }
        else if (index === 1) {
            this.clearEqiupZoneCCTVs();

            // 저장하지 않고 종료
            this.editModeManager.backToOrigin(this.state.currentView?.zoneID);
            this.editModeManager.clear();
            this.editModeManager.initPOIEditMode();

            this.editModeManager.cancleEquipZoneArea();     // 영역 추가 중 취소했다면 생성 중인 영역 삭제

            // newCCTVList 백업 - K.D.R
            const newCCTVList = [...this.state.newCCTVList_old];

            this.setState({ editMode: Contents3D.Edit_Mode_None, confirmMessage, selectedPOI: null, command, newCCTVList, selectEquipZonePOI: null });

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
                    this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('sdms.formText.센서가 선택되지 않았습니다'), i18n.t('sdms.formText.확인해주세요')], null, null);
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
            this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
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
        let sensorType = SDMSMainMenu.H2_Sensor;

        if (SDMSResource.isH2SensorType(facilityType)) {
            sensorType = SDMSMainMenu.H2_Sensor;
        }
        else if (SDMSResource.isTempSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Temp_Sensor;
        }
        else if (SDMSResource.isFlowSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Flow_Sensor;
        }
        else if (SDMSResource.isConductivitySensorType(facilityType)) {
            sensorType = SDMSMainMenu.Conduct_Sensor;
        }
        else if (SDMSResource.isGASSensorType(facilityType)) {
            sensorType = SDMSMainMenu.GAS_Sensor;
        }
        else if (SDMSResource.isPressureSensorType(facilityType)) {
            sensorType = SDMSMainMenu.PRESSURE_Sensor;
        }
        else if (SDMSResource.isH2LowSensorType(facilityType)) {
            sensorType = SDMSMainMenu.H2Low_Sensor;
        }
        else if (SDMSResource.isO2SensorType(facilityType)) {
            sensorType = SDMSMainMenu.O2_Sensor;
        }
        else if (SDMSResource.isH2GasSensorType(facilityType)) {
            sensorType = SDMSMainMenu.H2JAG_Sensor;
        }
        else if (SDMSResource.isO2GasSensorType(facilityType)) {
            sensorType = SDMSMainMenu.O2JAG_Sensor;
        }

        return sensorType;
    }

    static getFacilityTypeID(orgSensorID, sensorList) {
        let facilityTypeID = null

        for (let key in sensorList) {
            const sensors = sensorList[key];

            const sensor = sensors?.find(x => x.id === orgSensorID);
            if (sensor) {
                facilityTypeID = sensor.facilityType;
                break;
            }
        }

        return facilityTypeID;
    }

    async addAlarm(zoneID, facilityType, orgSensorID, alarmDepth, equipZoneID, targetCCTVMenu, alarmTime = null) {
        var sensorType = SDMS.getFacilityType(facilityType);
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID
        
        this.onSelectMenu(SDMSMainMenu.Menu_Add_Alarm, [zoneID, sensorType, orgSensorID, alarmDepth, alarmTime]);

        //if (SDMSResource.isSVMSSensorType(facilityType)) {
        //    alarmCCTVID = orgSensorID;
        //}
        
        // 수소 CCTV 없으므로 주석처리 - 수소
        //await this.getEquipZoneCCTV(equipZoneID, targetCCTVMenu, alarmCCTVID, facilityType);
    }

    moveToSensor(zoneID, facilityType, orgSensorID) {
        var sensorType = SDMS.getFacilityType(facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_MoveTo_POI, [zoneID, sensorType, orgSensorID]);
    }

    async showAlarm(alarm, targetCCTVMenu) {
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID

        const [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm] = SDMS.getAlarmInfo(alarm, this.state.sensorList);
  
        // 수소 CCTV 존재하지 않기에 주석처리 - 수소
        //await this.getEquipZoneCCTV(alarm.equipZoneID, targetCCTVMenu, alarmCCTVID, alarm.facilityType);
        
        this.onSelectMenu(SDMSMainMenu.Menu_Show_Alarm, [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm]);
    }

    hideAlarm() {
        this.onSelectMenu(SDMSMainMenu.Menu_Hide_Alarm);
    }

    removeAlarm(facilityType, orgSensorID, alarmDepth) {
        var sensorType = SDMS.getFacilityType(facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_Remove_Alarm, [sensorType, orgSensorID, alarmDepth]);
    }

    onSelectedAlarm(alarm, isMove = true) {
        if (this.state.selectedAlarm === alarm) {
            return;
        }
       
        // 정보창 띄우기
        if (alarm) {
            // 이상탐지 / 위험성 평가 예측 알람 예외처리
            let sensorType = null;
            if (SDMSResource.isAnomalySensorType(alarm.facilityType) || SDMSResource.isRiskSensorType(alarm.facilityType)) {
                let facilityTypeID = SDMS.getFacilityTypeID(alarm.orgSensorID, this.state.sensorList)

                sensorType = SDMS.getFacilityType(facilityTypeID);
            }
            else {
                sensorType = SDMS.getFacilityType(alarm.facilityType);
            }

            const arrInfo = BuildingInfoManager.getBuildingInfo(sensorType, alarm.orgSensorID, alarm.siteID, this.state._3dOptions, this.state.sensorList, null, null);
            if (arrInfo?.length > 0) {
                this.showInfo(arrInfo[0], arrInfo);
            }
        }
                
        this.state.selectedAlarm = alarm;

        // 해당 알람으로 이동
        if (isMove === true) {
            this.onMoveSelectedAlarm();
        }        
    }

    checkRiskAssess(alarm) {
        let isRiskAssess = false;

        if (alarm.etc) {
            isRiskAssess = true;
        }

        return isRiskAssess;
    }

    // 선택된 알람으로 3D 이동
    onMoveSelectedAlarm = () => {
        const selectedAlarm = this.state.selectedAlarm;

        if (selectedAlarm) {
            // 정전신호는 센서가 따로 없기에 CCTV를 따로 띄우지 않도록 추가 설정 
            if (selectedAlarm.sensorZoneID < 1000000 && selectedAlarm.orgSensorID) {
                const alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                const alarmCCTV = this.showAlarmCCTV(alarmType, selectedAlarm);

                const isRiskAssess = this.checkRiskAssess(selectedAlarm);
                if (isRiskAssess) {
                    let menus = this.state.visiblePopups;
                    menus[SDMS.menu.riskFactorsInfo] = true;
                }

                this.showAlarm(selectedAlarm, alarmCCTV);
            }
            else {
                this.showAlarm(selectedAlarm, null);
            }
        }
    }

    static getAlarmInfo(alarm, sensorList = null) {
        var sensorType = null;
        if (SDMSResource.isAnomalySensorType(alarm.facilityType) || SDMSResource.isRiskSensorType(alarm.facilityType)) {
            let facilityTypeID = SDMS.getFacilityTypeID(alarm.orgSensorID, sensorList)

            sensorType = SDMS.getFacilityType(facilityTypeID);
        }
        else {
            sensorType = SDMS.getFacilityType(alarm.facilityType);
        }

        return [alarm.zoneID, sensorType, alarm.orgSensorID, alarm.alarmDepth, alarm.isAlarm];
    }

    getNextAlarmCCTVMenu() {
        const alarmCCTV1 = this.alarmCCTVs[SDMSResource.menu.알람_CCTV_1];

        if (!alarmCCTV1 || alarmCCTV1.length === 0) {
            return SDMSResource.menu.알람_CCTV_1;
        }

        const alarmCCTV2 = this.alarmCCTVs[SDMSResource.menu.알람_CCTV_2];

        if (!alarmCCTV2 || alarmCCTV2.length === 0) {
            return SDMSResource.menu.알람_CCTV_2;
        }

        const alarmCCTV3 = this.alarmCCTVs[SDMSResource.menu.알람_CCTV_3];

        if (!alarmCCTV3 || alarmCCTV3.length === 0) {
            return SDMSResource.menu.알람_CCTV_3;
        }

        return SDMSResource.menu.알람_CCTV_1;
    }

    async getEquipZoneCCTV(equipZoneID, targetCCTVMenu, alarmCCTVID, facilityType) {
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
            // 원익의 경우 SVMS-쓰러짐 알람 경우 해당 CCTV만 표시
            // SVMS CCTV 알람일 경우 해당 CCTV ID 확인 여부
            if (alarmCCTVID > 0 && facilityType === SDMSResource.facilityType.Collapse_S1 &&
                ProjectResource.SiteID === ProjectResource.Site.Wonik) {
                cctvList = alarmCCTVID;
            }
            else if (alarmCCTVID > 0) {
                // 해당 CCTV 영상을 첫 번째 위치로
                if (cctvList?.length > 0) {
                    let arrCCTVs = cctvList.split(",");
                    const idx = arrCCTVs?.indexOf(alarmCCTVID.toString());

                    if (idx >= 0) {
                        arrCCTVs.splice(idx, 1);
                    }

                    cctvList = "";

                    for (let i = 0; i < arrCCTVs?.length; i++) {
                        let cctvID = arrCCTVs[i];

                        if (cctvList === "")
                            cctvList = cctvID;
                        else
                            cctvList += "," + cctvID;
                    }

                    cctvList = alarmCCTVID + "," + cctvList;
                }
                else {
                    cctvList = alarmCCTVID;
                }
            }
            //else if (alarmCCTVID > 0 &&
            //    alarmCCTVID !== result.cctV1 && alarmCCTVID !== result.cctV2 &&
            //    alarmCCTVID !== result.cctV3 && alarmCCTVID !== result.cctV4 &&
            //    alarmCCTVID !== result.cctV5 && alarmCCTVID !== result.cctV6) {
            //    cctvList = alarmCCTVID + "," + cctvList;
            //}

            this.alarmCCTVs[targetCCTVMenu] = cctvList;
        }

        //this.setState({ cctvList: cctvList });

        // CCTV 화면이 바뀌지 않는 오류 수정
        let reload = this.state.reload + 1;
        this.setState({reload});
    }

    addCCTVList(cctvList, cctvID) {
        if (cctvID) {
            if (cctvList.length === 0)
                cctvList = cctvID;
            else
                cctvList += "," + cctvID;
        }

        return cctvList;
    }

    async getStreamServerURL() {
        const streamServerURL = await SDMSController.getStreamServerURL();

        if (streamServerURL !== null || streamServerURL !== undefined)
            this.setState({ streamServerURL: streamServerURL});
    }

    setVisiblePoi(typeName, visible) {
        let types = { ...this.state.visibleSensorTypes };

        types[typeName] = visible;
        
        this.setState({ visibleSensorTypes: types });
    }

    setVisiblePopups(menu, visible) {   //만약에 대시보드창을 누르면 menu에는 대시보드가 뜨고 visible은 true가 됨! => 안됌
        if (SDMS.ChkShowHide === true)
            return;

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
                for (let menuItem in menus){
                    if (menuItem === menu){
                        menus[menuItem] = !menus[menu];
                    }
                    else {
                        menus[menuItem] = false;
                    }
                }
            }
        }
        else {
            if (menu instanceof Array) {
                const menuCount = menu.length;

                for (let i = 0; i < menuCount; i++) {
                    const menuItem = menu[i];
                    menus[menuItem] = visible;

                    console.log(menuItem);
                    console.log(menus[menuItem]);
                }
            }
            else {
                menus[menu] = visible;
                console.log(menus[menu]);

                // 현황정보를 닫을 경우 초기화한다
                if (menu === SDMS.menu.statusInfo && !visible) {                    
                    this.onChangeBuildingGroup(null, SDMS.SelectedStatusInfoType.none);
                }
            }
        }
        
        //this.setState({ visiblePopups: menus }); 
        // 팝업 닫히는 애니메이션 효과
        this.hideAnimatePopup(menus, menus_old, () => {
            this.setState({ visiblePopups: menus })
            SDMS.ChkShowHide = false;
        });
    }

    onSelectAnomalyID = (anomalyID) => {
        this.state.selectAnomalyID = anomalyID;
        this.setVisiblePopups(SDMS.menu.detectionInfo, true);
    }

    setModePopup = (menu) => {
        const menus = this.state.visiblePopups;
        let showStatusInfo = false;
        let showDashboardPop = false;
        let showEventInfoNew = false;
        let showDetectionInfo = false;
        let showSimulationInfo = false;
        let showAnalysisInfo = false;

        if (menu === SDMS.menu.statusInfo) {
            showStatusInfo = !menus[menu];
        }
        else if (menu === SDMS.menu.dashboardPop) {
            showDashboardPop = !menus[menu];
        }
        else if (menu === SDMS.menu.eventInfoNew) {
            showEventInfoNew = !menus[menu];
        }
        else if (menu === SDMS.menu.detectionInfo) {
            this.state.selectAnomalyID = null;
            showDetectionInfo = !menus[menu];
        }
        else if (menu === SDMS.menu.simulationInfo) {
            showSimulationInfo = !menus[menu];
        }
        else if (menu === SDMS.menu.analysisInfo) {
            showAnalysisInfo = !menus[menu];
        }

        menus[SDMS.menu.statusInfo] = showStatusInfo;
        menus[SDMS.menu.dashboardPop] = showDashboardPop;
        menus[SDMS.menu.eventInfoNew] = showEventInfoNew;
        menus[SDMS.menu.detectionInfo] = showDetectionInfo;
        menus[SDMS.menu.simulationInfo] = showSimulationInfo;
        menus[SDMS.menu.analysisInfo] = showAnalysisInfo;

        this.setState({ visiblePopups: menus });
    }

    hideAnimatePopup(menus, menus_old, callback) {
        SDMS.ChkShowHide = true;
        let hideIDs = "";

        /*  하단 메뉴가 없기 때문에 의미가 없어짐 주석처리
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
                    else if (key === SDMS.menu.eventInfoNew) {
                        hideID = "#" + SDMSResource.popupLayer.eventInfoNew;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.eventInfoNew);
                    }
                    else if (key === SDMS.menu.statusInfo) {
                        hideID = "#" + SDMSResource.popupLayer.statusInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.statusInfo);
                    }
                    //else if (key === SDMS.menu.statusInfoNew) {
                    //    hideID = "#" + SDMSResource.popupLayer.statusInfoNew;
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.statusInfoNew);
                    //}
                    //else if (key === SDMS.menu.buildingInfo) {
                    //    hideID = "#" + SDMSResource.popupLayer.buildingInfo;
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.buildingInfo);
                    //}
                    else if (key === SDMS.menu.sensorInfo) {
                        hideID = "#" + SDMSResource.popupLayer.sensorInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.sensorInfo);
                    }
                    //else if (key === SDMS.menu.weatherInfo) {
                    //    hideID = "#" + SDMSResource.popupLayer.weatherInfo;
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.weatherInfo);
                    //}
                    //else if (key === SDMS.menu.cctv || key === SDMS.menu.alarmCCTV1 ||
                    //    key === SDMS.menu.alarmCCTV2 || key === SDMS.menu.alarmCCTV3) {

                    //    if (key === SDMS.menu.cctv) {
                    //        hideID = "#" + SDMSResource.popupLayer.cctvInfo;
                    //    } else if (key === SDMS.menu.alarmCCTV1) {
                    //        hideID = "#" + SDMSResource.popupLayer.cctvInfo_1;
                    //    } else if (key === SDMS.menu.alarmCCTV2) {
                    //        hideID = "#" + SDMSResource.popupLayer.cctvInfo_2;
                    //    } else if (key === SDMS.menu.alarmCCTV3) {
                    //        hideID = "#" + SDMSResource.popupLayer.cctvInfo_3;
                    //    }
                        
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.cctvInfo);
                    //}
                    //else if (key === SDMS.menu.dashboard) {
                    //    hideID = "#" + SDMSResource.popupLayer.dashboard;
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.dashboard);
                    //}
                    else if (key === SDMS.menu.dashboardPop) {
                        hideID = "#" + SDMSResource.popupLayer.dashboardPop;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.dashboardPop);
                    }
                    //else if (key === SDMS.menu.miniMap) {
                    //    hideID = "#" + SDMSResource.popupLayer.miniMap;
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.miniMap);
                    //}
                    //else if (key === SDMS.menu.manualReport) {
                    //    hideID = "#" + SDMSResource.popupLayer.manualReport;
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.manualReport);
                    //}
                    else if (key === SDMS.menu.sensorStatus) {
                        hideID = "#" + SDMSResource.popupLayer.sensorStatus;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.sensorStatus);
                    }
                    //else if (key === SDMS.menu.workerStatus) {
                    //    hideID = "#" + SDMSResource.popupLayer.workerStatus;
                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.workerStatus); 
                    //}
                    else if (key === SDMS.menu.detectionInfo) {
                        hideID = "#" + SDMSResource.popupLayer.detectionInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.detectionInfo);
                    }
                    else if (key === SDMS.menu.simulationInfo) {
                        hideID = "#" + SDMSResource.popupLayer.simulationInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.simulationInfo);
                    }
                    else if (key === SDMS.menu.analysisInfo) {
                        hideID = "#" + SDMSResource.popupLayer.analysisInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.analysisInfo);
                    }
                    else if (key === SDMS.menu.compoundData) {
                        hideID = "#" + SDMSResource.popupLayer.compoundData;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.compoundData);
                    }
                    //else if (key === SDMS.menu.allCCTV) {
                    //    if (menus[SDMS.menu.cctv] === true) {
                    //        if (hideID === null) {
                    //            hideID = "#" + SDMSResource.popupLayer.cctvInfo;
                    //        }
                    //    }
                    //    if (menus[SDMS.menu.alarmCCTV1] === true) {
                    //        if (hideID === null) {
                    //            hideID = "#" + SDMSResource.popupLayer.cctvInfo_1;
                    //        } else {
                    //            hideID = hideID + ", #" + SDMSResource.popupLayer.cctvInfo_1;
                    //        }
                    //    }
                    //    if (menus[SDMS.menu.alarmCCTV2] === true) {
                    //        if (hideID === null) {
                    //            hideID = "#" + SDMSResource.popupLayer.cctvInfo_2;
                    //        } else {
                    //            hideID = hideID + ", #" + SDMSResource.popupLayer.cctvInfo_2;
                    //        }
                    //    }
                    //    if (menus[SDMS.menu.alarmCCTV3] === true) {
                    //        if (hideID === null) {
                    //            hideID = "#" + SDMSResource.popupLayer.cctvInfo_3;
                    //        } else {
                    //            hideID = hideID + ", #" + SDMSResource.popupLayer.cctvInfo_3;
                    //        }
                    //    }

                    //    target = document.getElementById("dsBot_" + SDMSResource.popupLayer.cctvInfo);
                    //}
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
        */
        callback();
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
        // 사이트 변경 유무 체크
        const multiSite = this.isMultiSite();
        if (multiSite) {
            if (menu === SDMSMainMenu.Menu_MoveTo_Building ||
                menu === SDMSMainMenu.Menu_MoveTo_Floor) {
                let siteID = menuParameter.siteID;
                if (siteID && siteID !== this.state.currentSiteID) {
                    const isMovingCamera = false;
                    this.changeSite(siteID, isMovingCamera);
                }
            } else if (menu === SDMSMainMenu.Menu_MoveTo_POI) {
                let siteID = menuParameter[3];
                if (siteID && siteID !== this.state.currentSiteID) {
                    const isMovingCamera = false;
                    this.changeSite(siteID, isMovingCamera);
                }
            } else if (menu === SDMSMainMenu.Menu_MoveTo_Facility) {
                let siteID = menuParameter[2];
                if (siteID && siteID !== this.state.currentSiteID) {
                    const isMovingCamera = false;
                    this.changeSite(siteID, isMovingCamera);
                }
            }
        }

        if (menu === SDMSMainMenu.Menu_MoveTo_BuildingGroup) {
            this.onChangeBuildingGroup(menuParameter, SDMS.SelectedStatusInfoType.buildingGroup);
            this.onSelectMenu(menu, [menuParameter.groupName]);

            // 건물그룹 이동시 기존 선택된 POI 선택해제  - K.D.R
            this.setState({ selectedPOI: null });
        }
        else if (menu === SDMSMainMenu.Menu_MoveTo_Floor) {
            //this.onChangeBuildingGroup(menuParameter, SDMS.SelectedStatusInfoType.zone);

            this.onSelectMenu(menu, [menuParameter.buildingID, SDMSDataManager.getZoneFloor(menuParameter)], menuParameter.id);

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
            this.setState({ selectedPOI: [sensorType, sensorID, zoneID] });
        }
    }

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    setActiveDragPopup(popupType) {
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
        this.setTempNewSensor(null, SDMSMainMenu.CCTV_Type);
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

        const cctv = SDMSDataManager.getSensor(sensorType, zoneID, sensorID, this.state._3dOptions);

        if (cctv) {
            cctv.isIndoor = this.isIndoorCCTV(cctv, zoneID);
            this.editModeManager.addDeleteCCTVPOI(cctv, zoneID, poiManager);
            cctv.added = false;
            newCCTVList.push(cctv);
            this.setState({ newCCTVList });
        }
    }

    onDeleteSensor = (poi, poiManager) => {
        const [sensorType, zoneID, sensorID] = SDMS.getSensorInfo(poi);

        if (zoneID === null)
            return;

        const sensor = SDMSDataManager.getSensor(sensorType, zoneID, sensorID, this.state._3dOptions);

        if (sensor) {
            this.editModeManager.addDeleteSensorPOI(sensor, sensorType, zoneID, poiManager, this.state._3dOptions);
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
            this.setTempNewSensor(null, SDMSMainMenu.CCTV_Type);
            this.setState({ selectedNewCCTV: null });
        }
        else {
            this.setTempNewSensor(cctv, SDMSMainMenu.CCTV_Type);
            this.setState({ selectedNewCCTV: cctv });
        }
    }

    getRangeSensor(sensorID, sensorType) {
        
        if (sensorType === SDMSMainMenu.H2_Sensor) {
            const rangeSensors = this.state.rangeSensors?.rangeEtcSensors?.length > 0 ? this.state.rangeSensors?.rangeEtcSensors : [];

            for (const sensor of rangeSensors) {
                if (sensor.id.toString() === sensorID.toString()) {
                    return sensor;
                }
            }
        }

        return null;
    }

    containsSelectedSensor(sensor) {
        const rangeSensors = [...this.state.selectedRangeSensors];

        for (const rangeSensor of rangeSensors) {
            if (sensor.id === rangeSensor.id && sensor.sensorTypeID === rangeSensor.sensorTypeID) {
                return [rangeSensors, true];
            }
        }

        return [rangeSensors, false];
    }

    onSelectSensorPOI = (sensorID, sensorType) => {
        const sensor = this.getRangeSensor(sensorID, sensorType);

        if (sensor) {
            // 복합센서 UI
            const visiblePopups = { ...this.state.visiblePopups };
            visiblePopups[SDMS.menu.compoundData] = true;

            // 센서 타입 데이터 추가
            sensor.type = sensorType;

            //this.setState({ visiblePopups, rangeSensor: sensor });
            this.state.visiblePopups[SDMS.menu.compoundData] = true;
            this.state.rangeSensor = sensor;
        }
    }

    useSensorList() {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo?.options?.ui?.useSensorList === true) {
            return true;
        }

        return false;
    }

    useWorkerInfo() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useWorkerInfo === true)
    }

    useEquipZoneAssess() {
        const userInfo = ProjectResource.getUserInfo();
        return (userInfo?.options?.ui?.useEquipZoneAssess === true);
    }

    getDeviceSensors = (sensor) => {
        const sensors = [];

        // 이름이 동일한 센서 (같은 디바이스) 불러오기
        const rangePsmSensors = this.state.rangeSensors?.rangePsmSensors?.length > 0 ? this.state.rangeSensors?.rangePsmSensors : [];

        for (const rangeSensor of rangePsmSensors) {
            if (sensor.name === rangeSensor.name && sensor.id !== rangeSensor.id) {
                sensors.push(rangeSensor);
            }
        }

        const rangeEtcSensors = this.state.rangeSensors?.rangeEtcSensors?.length > 0 ? this.state.rangeSensors?.rangeEtcSensors : [];

        for (const rangeSensor of rangeEtcSensors) {
            if (sensor.name === rangeSensor.name && sensor.id !== rangeSensor.id) {
                sensors.push(rangeSensor);
            }
        }


        return sensors;
    }

    onSelectCCTV = (cctvID, poi, poiManager, screenXY) => {
        const isEditMode = this.isEditMode();

        if (!isEditMode || (isEditMode && this.state.editModeCCTV)) {
            var menus = this.state.visiblePopups;
            menus[SDMS.menu.allCCTV] = true;
            menus[SDMS.menu.cctv] = true;
            menus[SDMS.menu.cctvApp] = true;

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

    showInfo = (type, arrInfo) => {

        // TODO: 샘플 데이터 예시
        /*arrInfo = new Array();
        arrInfo[0] = SDMSResource.ID.buildingInfo.equipmentType;         // 건물 or 설비
        arrInfo[1] = "HF 탱크";                                          // 설비 이름
        arrInfo[2] = "HF";                                               // 취급물질(대표)
        arrInfo[3] = "안준후";                                           // 담당자
        arrInfo[4] = "010-123-1234";                                     // 담당자 연락처*/

        const menus = this.state.visiblePopups;

        if (arrInfo) {
            menus[SDMS.menu.sensorInfo] = true;
            menus[SDMS.menu.compoundData] = true;
        } else {
            menus[SDMS.menu.sensorInfo] = false;
            menus[SDMS.menu.compoundData] = false;
        }

        this.setState({ sensorInfo: arrInfo, visiblePopups: menus });
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

                    zoneName = i18nUtil.convertText(zoneName);
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
        if (storeValue.actionType === 'RANGE_SENSORS' && storeValue.rangeSensors) {
            if (this.isSameRangeSensors(storeValue.rangeSensors) === false) {
                this.setState({ rangeSensors: storeValue.rangeSensors });
            }
        }
    }

    // 인원 현황 관련
    setWorkerInfos(storeValue) {
        if (storeValue.actionType === 'WORKER_INFOS' && storeValue.workerInfos) {
            this.setState({ workerInfos: storeValue.workerInfos });
        }
    }

    // 3D BuildingGroup 인원수 불러오기
    getBuildingGroupWorkerInfo = (buildingGroupID) => {
        const visibleSensorTypes = { ...this.state.visibleSensorTypes };
        const buildingGroupWorkerInfos = this.state.workerInfos?.buildingGroupWorkerInfos ? [...this.state.workerInfos?.buildingGroupWorkerInfos] : [];

        // 사이트 별 초기값
        let [workerCnt, visitorCnt] = this.initBuildingGroupWorkerCnt();

        if (buildingGroupWorkerInfos.length === 0) {
             return [workerCnt, visitorCnt];
        }
            

        // 해당 데이터 찾기
        const workerData = buildingGroupWorkerInfos.find(x => x.spatialID === buildingGroupID && x.workerType === SDMSResource.workerType.Worker);
        if (workerData)
            workerCnt = workerData.workerCount;

        const visitorData = buildingGroupWorkerInfos.find(x => x.spatialID === buildingGroupID && x.workerType === SDMSResource.workerType.Visitor);
        if (visitorData)
            visitorCnt = visitorData.workerCount;



        // visibleSensorTypes 옵션 여부 확인
        if (!visibleSensorTypes || visibleSensorTypes[SDMSMainMenu.Worker] !== true)
            workerCnt = null;
        if (!visibleSensorTypes || visibleSensorTypes[SDMSMainMenu.Visitor] !== true)
            visitorCnt = null;

        return [workerCnt, visitorCnt];
    }

    initBuildingGroupWorkerCnt() {
        let workerCnt = 0;
        let visitorCnt = 0;

        // 사이트별 조건
        //if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain)
        //    visitorCnt = 0;

        return [workerCnt, visitorCnt];
    }

    // 3D Building 인원수 불러오기
    getBuildingWorkerInfo = (buildingID) => {
        const visibleSensorTypes = { ...this.state.visibleSensorTypes };
        const buildingWorkerInfos = this.state.workerInfos?.buildingWorkerInfos ? [...this.state.workerInfos?.buildingWorkerInfos] : [];

        // 사이트 별 초기값
        let [workerCnt, visitorCnt] = this.initBuildingWorkerCnt();

        if (buildingWorkerInfos === 0) {
            return [workerCnt, visitorCnt];
        }
            
        // 해당 데이터 찾기
        const workerData = buildingWorkerInfos.find(x => x.spatialID === buildingID && x.workerType === SDMSResource.workerType.Worker);
        if (workerData)
            workerCnt = workerData.workerCount;

        const visitorData = buildingWorkerInfos.find(x => x.spatialID === buildingID && x.workerType === SDMSResource.workerType.Visitor);
        if (visitorData)
            visitorCnt = visitorData.workerCount;




        // visibleSensorTypes 옵션 여부 확인
        if (!visibleSensorTypes || visibleSensorTypes[SDMSMainMenu.Worker] !== true)
            workerCnt = null;
        if (!visibleSensorTypes || visibleSensorTypes[SDMSMainMenu.Visitor] !== true)
            visitorCnt = null;


        return [workerCnt, visitorCnt];
    }

    initBuildingWorkerCnt() {
        let workerCnt = 0;
        let visitorCnt = 0;

        // 사이트별 조건
        if (ProjectResource.SiteID === ProjectResource.Site.Soulbrain)
            visitorCnt = null;

        return [workerCnt, visitorCnt];
    }

    isSameRangeSensors(rangeSensors) {
        const oldPSMSensors = this.state.rangeSensors?.rangePsmSensors?.length > 0 ? this.state.rangeSensors?.rangePsmSensors : [];
        const newPSMSensors = rangeSensors?.rangePsmSensors?.length > 0 ? rangeSensors.rangePsmSensors : [];
        const oldETCSensors = this.state.rangeSensors?.rangeEtcSensors?.length > 0 ? this.state.rangeSensors?.rangeEtcSensors : [];
        const newETCSensors = rangeSensors?.rangeEtcSensors?.length > 0 ? rangeSensors.rangeEtcSensors : [];

        const oldPSMCount = oldPSMSensors.length;
        const newPSMCount = newPSMSensors.length;
        const oldETCCount = oldETCSensors.length;
        const newETCCount = newETCSensors.length;

        let isSame = true;

        if (oldPSMCount !== newPSMCount) {
            for (let i = 0; i < newPSMCount; i++) {
                const newPSMSensor = rangeSensors.rangePsmSensors[i];
                newPSMSensor.prevValue = 0;
            }

            isSame = false;
        }

        if (oldETCCount !== newETCCount) {
            for (let i = 0; i < newETCCount; i++) {
                const newETCSensor = rangeSensors.rangeEtcSensors[i];
                newETCSensor.prevValue = 0;
            }

            isSame = false;
        }

        // 수치 업데이트는 sensorStatus 컴퍼넌트 내부적으로 처리
        return isSame;
    }

    //async initDashboardSensors() {
    //    const [result, message] = await DashboardController.requestUseSensor();

    //    if (result !== null && result !== undefined) {
    //        this.setState({ dashboardSensors: result });
    //    }
    //}

    initUseSensorTypes = () => {
        const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

        if (sdmsCommonSettings) {
            this.reloadUseSensorTypes(sdmsCommonSettings);
        }
    }

    reloadUseSensorTypes = (sdmsCommonSettings) => {
        let data = sdmsCommonSettings;
        let useSensorTypes = this.state.useSensorTypes;

        if (data?.UseFire !== undefined ||
            data?.UsePSM !== undefined ||
            data?.UseETC !== undefined ||
            data?.UseSVMS !== undefined ||
            data?.UseEarthquake !== undefined ||
            data?.UseStrongWind !== undefined ||
            data?.UseBlackOut !== undefined ||
            data?.UseBecon !== undefined ||
            data?.UseEnvironment !== undefined ||
            data?.UseManufacture !== undefined || 
            data?.UseEmergencyBell !== undefined ||
            data?.UseParkingBreaker !== undefined ||
            data?.UseLifeSaving !== undefined ||
            data?.UseCardiacDefibrillator !== undefined ||
            data?.UseRescueTeam !== undefined) {

            let sensorTypes = new Object();
            sensorTypes.UseFire = false;
            sensorTypes.UsePSM = false;
            sensorTypes.UseETC = false;
            sensorTypes.UseSVMS = false;
            sensorTypes.UseEarthquake = false;
            sensorTypes.UseStrongWind = false;
            sensorTypes.UseBlackOut = false;
            sensorTypes.UseBecon = false;
            sensorTypes.UseEnvironment = false;
            sensorTypes.UseManufacture = false;
            sensorTypes.UseEmergencyBell = false;
            sensorTypes.UseParkingBreaker = false;
            sensorTypes.UseLaser = false;
            sensorTypes.UseDoor = false;
            sensorTypes.UseLifeSaving = false;
            sensorTypes.UseCardiacDefibrillator = false;
            sensorTypes.UseRescueTeam = false;

            if (data.UseFire === "true")
                sensorTypes.UseFire = true;
            if (data.UsePSM === "true")
                sensorTypes.UsePSM = true;
            if (data.UseETC === "true")
                sensorTypes.UseETC = true;
            if (data.UseSVMS === "true")
                sensorTypes.UseSVMS = true;
            if (data.UseEarthquake === "true")
                sensorTypes.UseEarthquake = true;
            if (data.UseStrongWind === "true")
                sensorTypes.UseStrongWind = true;
            if (data.UseBlackOut === "true")
                sensorTypes.UseBlackOut = true;
            if (data.UseBecon === "true")
                sensorTypes.UseBecon = true;
            if (data.UseEnvironment === "true")
                sensorTypes.UseEnvironment = true;
            if (data.UseManufacture === "true")
                sensorTypes.UseManufacture = true;
            if (data.UseEmergencyBell === "true")
                sensorTypes.UseEmergencyBell = true;
            if (data.UseParkingBreaker === "true")
                sensorTypes.UseParkingBreaker = true;
            if (data.UseLaser === "true")
                sensorTypes.UseLaser = true;
            if (data.UseDoor === "true")
                sensorTypes.UseDoor = true;
            if (data.UseLifeSaving === "true")
                sensorTypes.UseLifeSaving = true;
            if (data.UseCardiacDefibrillator === "true")
                sensorTypes.UseCardiacDefibrillator = true;
            if (data.UseRescueTeam === "true")
                sensorTypes.UseRescueTeam = true;

            if (useSensorTypes === null ||
                useSensorTypes.UseFire !== data.UseFire ||
                useSensorTypes.UsePSM !== data.UsePSM ||
                useSensorTypes.UseETC !== data.UseETC ||
                useSensorTypes.UseSVMS !== data.UseSVMS ||
                useSensorTypes.UseEarthquake !== data.UseEarthquake ||
                useSensorTypes.UseStrongWind !== data.UseStrongWind ||
                useSensorTypes.UseBlackOut !== data.UseBlackOut ||
                useSensorTypes.UseBecon !== data.UseBecon ||
                useSensorTypes.UseEnvironment !== data.UseEnvironment ||
                useSensorTypes.UseManufacture !== data.UseManufacture ||
                useSensorTypes.UseEmergencyBell !== data.UseEmergencyBell ||
                useSensorTypes.UseParkingBreaker !== data.UseParkingBreaker ||
                useSensorTypes.UseLifeSaving !== data.UseLifeSaving ||
                useSensorTypes.UseCardiacDefibrillator !== data.UseCardiacDefibrillator ||
                useSensorTypes.UseRescueTeam !== data.UseRescueTeam) {

                this.setState({ useSensorTypes: sensorTypes });
            }
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
        return [buildingGroup, building, zone, sensorType, sensorID];
    }

    onChangeBuildingGroup = (value, type) => {
        const selectedStatusInfo = this.state.selectedStatusInfo;

        selectedStatusInfo.sensorGroups = false;

        selectedStatusInfo.h2Sensors = false;
        selectedStatusInfo.tempSensors = false;
        selectedStatusInfo.flowSensors = false;
        selectedStatusInfo.conductSensors = false;
        selectedStatusInfo.gasSensors = false;
        selectedStatusInfo.pressureSensors = false;

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
        else if (type === SDMS.SelectedStatusInfoType.h2Sensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.h2Sensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.tempSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.tempSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.flowSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.flowSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.conductSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.conductSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.gasSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.gasSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.pressureSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.pressureSensors = true;
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
        //this.setState({ selectedStatusInfo, selectedPOI: null });
        this.setState({ selectedStatusInfo });
    }

    onChangeStatusInfoID = (buildingID, zoneID, sensorID) => {
        let selectedStatusInfoID = {};
        selectedStatusInfoID.buildingID = buildingID;
        selectedStatusInfoID.zoneID = zoneID;
        selectedStatusInfoID.sensorID = sensorID;

        this.setState({ selectedStatusInfoID });
    }

    setStatusInfoID = (statusInfoID) => {
        this.state.selectedStatusInfoID.buildingID = statusInfoID.buildingID;
        this.state.selectedStatusInfoID.zoneID = statusInfoID.zoneID;
        this.state.selectedStatusInfoID.sensorID = statusInfoID.sensorID;
    }

    getSelectedSensorInfo() {
        const selectedPOI = this.state.selectedPOI;

        if (selectedPOI) {
            if (selectedPOI.length === 2 && selectedPOI[0] && selectedPOI[0].object) {
                return SDMS.getSensorInfo(selectedPOI[0]);
            }
            else if (selectedPOI.length === 3) {
                return [selectedPOI[0], selectedPOI[2], selectedPOI[1]];
            }
        }

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

    changeSite = (siteID, isMovingCamera = true) => {
        let _3dOptions = this.state.site3dOptions[siteID];

        if (!_3dOptions && parseInt(siteID) === ProjectResource.Site.GG_A) {
            for (const _siteID in this.state.site3dOptions) {
                _3dOptions = this.state.site3dOptions[_siteID];
                break;
            }
        }

        if (_3dOptions) {
            const command = {
                menu: SDMSMainMenu.Menu_MoveTo_Site,
                menuParameter: [siteID, isMovingCamera]
            }

            this.setState({ currentSiteID: siteID, _3dOptions, command });


            // 타이틀바 사이트 선택 
            const _siteID = parseInt(siteID);
            if (isNaN(_siteID))
                return;

            if (this.titleBarSiteID !== _siteID) {
                this.titleBarSiteID = _siteID;

                SettingsStore.dispatch({ type: 'SELECT_SITEID' });
            }
        }
    }

    getRangeSensorsForSensorStatus() {
        const rangeSensors = this.state.rangeSensors;
        const selectedSensors = [...this.state.selectedRangeSensors];
        const alarmRangeSensor = this.state.alarmRangeSensor;

        return [rangeSensors, selectedSensors, alarmRangeSensor];
    }

    setRangeSensors = (rangeSensors) => {
        if (rangeSensors === null || rangeSensors === undefined)
            return;

        this.setState({ selectedRangeSensors: rangeSensors, alarmRangeSensor: null });
    }

    closeRangeSensors = () => {
        this.state.selectedRangeSensors = [];
        this.state.alarmRangeSensor = null;

        this.setVisiblePopups(SDMS.menu.sensorStatus);
    }

    getZoneSiteID = (zoneID) => {
        const zone = this.getZone(this.state.site3dOptions, zoneID);

        if (zone) {
            return zone.siteID;
        }

        return null;
    }

    setMute = () => {
        let isMute = this.state.isMute;

        this.setState({ isMute: !isMute })
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
                        useSensorTypes={this.state.useSensorTypes}                        
                    />
                );
            }
            else {
                visiblePopups[SDMS.menu.eventInfo] = false;
            }
        }

        if (visiblePopups[SDMS.menu.eventInfoNew]) {
            if (!this.isEditMode() && visiblePopups[SDMS.menu.eventInfoNew]) {
                popups.push(
                    <EventInfoNew key='sdms_popup_eventInfoNew'
                        setVisiblePopups={this.setVisiblePopups}
                        setActiveDragPopup={this.setActiveDragPopup}
                        zIndex={this.state.popupLayer.eventInfoNewZIndex}
                        popupType={SDMSResource.popupLayer.eventInfoNew}
                        popupState={this.state.popupState.eventInfoNew}
                        setPopupState={this.setPopupState}
                        sensorAlarms={this.state.sensorAlarms}
                        alarmSound={this.state.alarmSound}
                        //onSound={this.onSound}
                        onMalfunction={this.onMalfunction}
                        alarmInfo={this.alarmInfo}
                        onAuthorError={this.onAuthorError}
                        showConfirmDialog={this.showConfirmDialog}
                        closeConfirmDialog={this.closeConfirmDialog}
                        buildingGroupList={this.state.buildingGroupList}
                        //popupStateAlarmMemo={this.state.popupState.alarmMemo}
                        //zIndexAlarmMemo={this.state.popupLayer.alarmMemoZIndex}
                        //popupTypeAlarmMemo={SDMSResource.popupLayer.alarmMemo}
                        //useSensorTypes={this.state.useSensorTypes}
                        sensorList={this.state.sensorList}
                        selectedAlarm={this.state.selectedAlarm}
                        onSelectedAlarm={this.onSelectedAlarm}
                        setMute={this.setMute}
                        isMute={this.state.isMute}
                        onSelectAnomalyID={this.onSelectAnomalyID}
                    />
                );
            }
            else {
                visiblePopups[SDMS.menu.eventInfoNew] = true;
            }
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.statusInfo]) {           
            popups.push(
                <StatusInfo key='sdms_popup_statusInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    multiSite={multiSite}
                    buildingGroupList={this.state.buildingGroupList}
                    site3dOptions={this.state.site3dOptions}
                    outdoorZones={this.state._3dOptions?.outdoorZones}
                    zoneList={this.state._3dOptions?.zones}
                    buildingIDs={this.state._3dOptions?.buildingIDs}
                    indoorModels={this.state._3dOptions?.indoorModels}
                    sensorList={this.state.sensorList}
                    moveToX={this.moveToX}
                    onSelectSensor={this.onSelectSensor}
                    selectedSensor={[sensorType, zoneID, sensorID]}
                    selectedInfo={this.state.selectedStatusInfo}
                    selectedInfoID={this.state.selectedStatusInfoID}
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
                    useSensorTypes={this.state.useSensorTypes}
                    onSelectedAlarm={this.onSelectedAlarm}
                    setStatusInfoID={this.setStatusInfoID}
                />
            );            
        }       
        if (!this.isEditMode() && visiblePopups[SDMS.menu.sensorInfo]) {
            popups.push(
                <SensorInfo key='sdms_popup_sensorInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.sensorInfoZIndex}
                    popupType={SDMSResource.popupLayer.sensorInfo}
                    info={this.state.sensorInfo}
                    popupState={this.state.popupState.sensorInfo}
                    setPopupState={this.setPopupState}
                />);
        }
        //if (!this.isEditMode() && visiblePopups[SDMS.menu.weatherInfo]) {
        //    if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
        //        popups.push(
        //            <WeatherInfo key='sdms_popup_weatherInfo'
        //                setVisiblePopups={this.setVisiblePopups}
        //                setActiveDragPopup={this.setActiveDragPopup}
        //                zIndex={this.state.popupLayer.weatherInfoZIndex}
        //                popupType={SDMSResource.popupLayer.weatherInfo}
        //                info={this.state.weatherInfo}
        //                popupState={this.state.popupState.weatherInfo}
        //                setPopupState={this.setPopupState}
        //            />);
        //    }
        //}
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

        if (this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
            this.showAlarmCCTVPopups(visiblePopups, popups);
        }

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
                    //dashboardSensors={this.state.dashboardSensors}
                    showConfirmDialog={this.showConfirmDialog}
                    useSensorTypes={this.state.useSensorTypes}
                />
            );
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.dashboardPop]) {
            popups.push(
                <DashboardPop key='sdms_popup_dashBoardPop'
                    selectedAlarm={this.state.selectedAlarm}
                    setVisiblePopups={this.setVisiblePopups}
                    sensorCount={this.state.sensorCount}
                    zIndex={this.state.popupLayer.dashboardPopZIndex}
                    popupType={SDMSResource.popupLayer.dashboardPop}
                    popupState={this.state.popupState.dashboardPop}
                    setActiveDragPopup={this.setActiveDragPopup}
                    setPopupState={this.setPopupState}
                    buildingGroupList={this.state.buildingGroupList}
                    //dashboardSensors={this.state.dashboardSensors}
                    showConfirmDialog={this.showConfirmDialog}
                    useSensorTypes={this.state.useSensorTypes}
                    sensorAlarms={this.state.sensorAlarms}
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
                    currentSiteID={this.state.currentSiteID}
                    walker={this.state.walker}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.sensorStatus]) {  /* 0929 */
            const [rangeSensors, selectedRangeSensors, alarmRangeSensor] = this.getRangeSensorsForSensorStatus();

            popups.push(
                <SensorStatus key='sdms_popup_sensorStatus'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.sensorStatusZIndex}
                    popupType={SDMSResource.popupLayer.sensorStatus}
                    popupState={this.state.popupState.sensorStatus}
                    setPopupState={this.setPopupState}
                    //visibleSensorTypes={this.state.visibleSensorTypes}
                    //setVisiblePoi={this.setVisiblePoi}
                    sensors={rangeSensors}
                    selectedSensors={selectedRangeSensors}
                    sensorCount={this.state.sensorCount}
                    setRangeSensors={this.setRangeSensors}
                    alarmSensor={alarmRangeSensor}
                    closeRangeSensors={this.closeRangeSensors}
                />);
        } 
        if (this.isEditMode()) {
            popups.push(
                <EditModeStatusInfo key='sdms_popup_editModeStatusInfo'
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
                    site3dOptions={this.state.site3dOptions}
                    useSensorTypes={this.state.useSensorTypes}
                />);
        }
        //if (!this.isEditMode() && visiblePopups[SDMS.menu.manualReport]) {
        //    popups.push(
        //        <ManualReport key='sdms_popup_manualReport'
        //            setVisiblePopups={this.setVisiblePopups}
        //            buildingGroupList={this.state.buildingGroupList}
        //            outdoorZones={this.state._3dOptions.outdoorZones}
        //            setActiveDragPopup={this.setActiveDragPopup}
        //            zIndex={this.state.popupLayer.manualReportZIndex}
        //            popupType={SDMSResource.popupLayer.manualReport}
        //            popupState={this.state.popupState.manualReport}
        //            setPopupState={this.setPopupState}
        //            currentView={this.state.currentView}
        //            useSensorTypes={this.state.useSensorTypes}
        //        />);
        //}

        if(!this.isEditMode() && visiblePopups[SDMS.menu.detectionInfo]) {
            popups.push(
                <DetectionInfo
                    key='sdms_popup_detectionInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.detectionInfoZIndex}
                    popupType={SDMSResource.popupLayer.detectionInfo}
                    popupState={this.state.popupState.detectionInfo}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    currentSiteID={this.state.currentSiteID}
                    buildingGroupList={this.state.buildingGroupList}
                    zoneList={this.state._3dOptions?.zones}
                    sensorList={this.state.sensorList}
                    selectAnomalyID={this.state.selectAnomalyID}
                />);
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.simulationInfo]) {
            popups.push(
                <SimulationInfo
                    key='sdms_popup_simulationInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.simulationInfoZIndex}
                    popupType={SDMSResource.popupLayer.simulationInfo}
                    popupState={this.state.popupState.simulationInfo}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    currentSiteID={this.state.currentSiteID}
                />);
        }
        
        if(!this.isEditMode() && visiblePopups[SDMS.menu.analysisInfo]) {
            popups.push(
                <AnalysisInfo
                    key='sdms_popup_analysisInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.analysisInfoZIndex}
                    popupType={SDMSResource.popupLayer.analysisInfo}
                    popupState={this.state.popupState.analysisInfo}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    currentSiteID={this.state.currentSiteID}
                />);
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.compoundData]) {
            popups.push(
                <CompoundData
                    key='sdms_popup_compoundData'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.compoundDataZIndex}
                    popupType={SDMSResource.popupLayer.compoundData}
                    popupState={this.state.popupState.compoundData}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    currentSiteID={this.state.currentSiteID}
                    rangeSensor={this.state.rangeSensor}
                    sensorAlarms={this.state.sensorAlarms}
                    selectedSensor={[sensorType, zoneID, sensorID]}
                    sensorList={this.state.sensorList}
                />);
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.riskFactorsInfo]) {
            popups.push(
                <RiskFactorsInfo key='sdms_popup_riskFactorsInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.riskFactorsInfoZIndex}
                    popupType={SDMSResource.popupLayer.riskFactorsInfo}
                    popupState={this.state.popupState.riskFactorsInfo}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    selectedAlarm={this.state.selectedAlarm}
                />);
        }
        
        // 3D 로딩이 끝난 후에 띄우기
        if (!this.state.loading3D && !this.isEditMode() && visiblePopups[SDMS.menu.eventDashboardNew]) {
            popups.push(
                <EventDashboardNew
                    key='sdms_popup_eventDashboardNew'
                    toastAlarm={this.state.toastAlarm}
                    sensorList={this.state.sensorList}
                    setVisiblePopups={this.setVisiblePopups}
                    onSelectedAlarm={this.onSelectedAlarm}
                    visiblePopups={visiblePopups}
                    setModePopup={this.setModePopup}
                />);
        }

        return popups;
    }


    showAlarmCCTVPopups(visiblePopups, popups) {
        for (let i = 1; i <= 3; i++) {
            this.showAlarmCCTVPopup(i, SDMSResource.menu.알람_CCTV + "_" + i, visiblePopups, popups);
        }

        this.FocusAlarmCCTVPopup();
    }

    showAlarmCCTVPopup(index, menu, visiblePopups, popups) {
        if (visiblePopups[SDMS.menu.allCCTV] && visiblePopups[menu] && !this.isEditMode()) {
            //const key = 'sdms_popup_cctvInfo_' + index;
            let key = 'sdms_popup_cctvInfo_' + this.alarmInfo[menu][1].sensorZoneHistoryID;

            const popupType = SDMSResource.popupLayer.cctvInfo + "_" + index;

            const cctvs = this.alarmCCTVs[menu];
            
            if (cctvs) {
                let cctvList = String(cctvs).trim().split(',');

                if (cctvList.length > 0) {
                    popups.push(
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
                            editMode={this.state.editMode}
                            editModeParam={this.state.editModeParam}
                            editModeManager={this.editModeManager}
                            alarmInfo={this.alarmInfo[menu]}
                            menu={menu}
                            selectedAlarm={this.state.selectedAlarm}
                        />
                    );
                }
            }
        }
    }

    FocusAlarmCCTVPopup = () => {
        // 기존 포커스 해제
        $(".cctvAlarmPopup").removeClass('dslGrdAct');

        const selectedAlarm = this.state.selectedAlarm;

        // 해당 알람CCTV 팝업만 하이라이트
        if (selectedAlarm !== null && selectedAlarm !== undefined) {
            //$(".cctvAlarm_" + selectedAlarm.sensorZoneHistoryID).addClass('dslGrdAct');
            $(".cctvAlarm_" + selectedAlarm.equipZoneID).addClass('dslGrdAct');
        }
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
            console.log(obj);
            this.setState({ selectedFacility: { facilityID: -1, modelName:''} });
            return;
        }

        const facilityInfo = this.getFacility(obj.name);

        if (!facilityInfo) {
            this.setState({ selectedFacility: {facilityID: -1, modelName: ''} });
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

        selectedStatusInfo.h2Sensors = false;
        selectedStatusInfo.tempSensors = false;
        selectedStatusInfo.flowSensors = false;
        selectedStatusInfo.conductSensors = false;
        selectedStatusInfo.gasSensors = false;
        selectedStatusInfo.pressureSensors = false;

        selectedStatusInfo.cctvGroups = false;
        selectedStatusInfo.cctvSubGroups = false;
        selectedStatusInfo.facilityGroups = true;
        selectedStatusInfo.facilitySubGroups = true;

        
        
        this.setState({ selectedStatusInfo, selectedFacility: facility });
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
            if (zoneID >= SDMSResource.zoneID.outdoor) {

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

        for (let i = 0; i < buildingGroupCount; i++) {
            const buildingGroup = buildingGroupList[i];

            if (buildingGroup.siteID.toString() === siteID) {
                buildingGroup.completeLoading = true;
            }
        }

        this.setState({ buildingGroupList });
    }

    is3DMode() {
        return this.state.viewMode === "3D";
    }

    is2DMode() {
        return this.state.viewMode === "2D";
    }

    async setWsManager() {
        const userInfo = await ProjectResource?.initUserInfo();

        if (userInfo?.siteID >= ProjectResource.Site.GG_A && userInfo?.siteID <= ProjectResource.Site.GG_H) {
            if (!this.wsManager) {
                const webSocketPort = await GghController.getWebSocketPort();
    
                if (webSocketPort > 0) {
                    this.wsManager = new wsManager(webSocketPort, this);
                }
            }
        }
    }

    setCCTVAppGuid = (guid, type) => {
        const userInfo = ProjectResource?.getUserInfo();

        if (type === 'poi') {
            if (this.state.cctvAppGUID_poi === null) {
                this.setState({ cctvAppGUID_poi: guid });
            }
        }
        else if (type === 'alarm') {
            let cctvList = this.state.cctvAppGUID_alarms;

            if (cctvList.length > 2) {
                // 종료할 cctv popup guid (알람 CCTV는 총 3개까지만 띄울 수 있음)
                const cctvBeDeleted = cctvList.shift();
                this.wsManager.closeCCTV(cctvBeDeleted, userInfo.id);

                cctvList.push(guid);
                this.setState({ cctvAppGUID_alarms: cctvList });
            }
            else {
                cctvList.push(guid);
                this.setState({ cctvAppGUID_alarms: cctvList });
            }
        }
    }

    onWebsocketMessage(guid) {
        if (this.state.cctvAppGUID_poi === guid) {
            this.setState({ cctvList: null, cctvAppGUID_poi: null });
        }
    }

    getWsManager = () => {
        return this.wsManager;
    }

    setTempNewSensor = (sensor, sensorType) => {
        this.tempNewSensor = sensor;
        this.tempNewSensorType = sensorType;

        if (this.editModeManager?.contents3D?.poiManager) {
            if (sensor) {
                this.editModeManager.contents3D.poiManager.addTempPOIIfNull(sensorType);
            }
            else {
                this.editModeManager.contents3D.poiManager.clearTempPOI();
            }
        }
    }

    getTempNewSensor = () => {
        return [this.tempNewSensor, this.tempNewSensorType];
    }

    getContents() {
        const [sensorType, zoneID, sensorID] = this.getSelectedSensorInfo();
        const visiblePopups = { ...this.state.visiblePopups };
        const isEditMode = this.isEditMode();

        return <Contents3D
            site3dOptions={this.state.site3dOptions}
            _3dOptions={this.state._3dOptions}
            multiSite={this.isMultiSite()}
            currentSiteID={this.state.currentSiteID}
            command={this.state.command}
            setVisiblePopups={this.setVisiblePopups}
            getVisiblePopups={this.getVisiblePopups}
            sensorList={this.state.sensorList}
            onSelectMenu={this.onSelectMenu}
            visibleSensorTypes={this.state.visibleSensorTypes}
            onSelectCCTV={this.onSelectCCTV}
            alarmSound={this.state.alarmSound}
            showInfo={this.showInfo}
            onSelectPOI={this.onSelectPOI}
            selectedSensor={[sensorType, zoneID, sensorID]}
            setCurrentView={this.setCurrentView}
            currentView={this.state.currentView}
            visiblePopups={visiblePopups}
            initOutdoorViewport={this.onClickLogo}
            setEditMode={this.setEditMode}
            checkAuthPopups={this.checkAuthPopups}
            editMode={this.state.editMode}
            editModeParam={this.state.editModeParam}
            editModeManager={this.editModeManager}
            isEditMode={isEditMode}
            selectedNewCCTV={this.state.selectedNewCCTV}
            onNewCCTVPOI={this.onNewCCTVPOI}
            onDeleteCCTV={this.onDeleteCCTV}
            onDeleteSensor={this.onDeleteSensor}
            setMovingAvatar={this.setMovingAvatar}
            showConfirmDialog={this.showConfirmDialog}
            closeConfirmDialog={this.closeConfirmDialog}
            sensorAlarms={this.state.sensorAlarms}
            newCCTVList={this.state.newCCTVList}
            getFacilityModelName={this.getFacilityModelName}
            selectFacility={this.selectFacility}
            onChangeBuildingGroup={this.onChangeBuildingGroup}
            getSpatialInfo={this.getSpatialInfo}
            onCompleteOutdoorModelLoading={this.onCompleteOutdoorModelLoading}
            changeSite={this.changeSite}
            selectedPOI={this.state.selectedPOI}
            onSelectSensorPOI={this.onSelectSensorPOI}
            selectedAlarm={this.state.selectedAlarm}
            getSpatialBuildingGroupInfo={this.getSpatialBuildingGroupInfo}
            getBuildingGroupWorkerInfo={this.getBuildingGroupWorkerInfo}
            getBuildingWorkerInfo={this.getBuildingWorkerInfo}
            onSelectEquipZonePOI={this.onSelectEquipZonePOI}
            selectEquipZonePOI={this.state.selectEquipZonePOI}
            onSelectEquipZoneArea={this.onSelectEquipZoneArea}
            selectEquipZoneArea={this.state.selectEquipZoneArea}
            selectEquipZoneID={this.selectEquipZoneID}
            setStateLoading3D={this.setStateLoading3D}
            getWsManager={this.getWsManager}
            setTempNewSensor={this.setTempNewSensor}
            getTempNewSensor={this.getTempNewSensor}
            onChangeStatusInfoID={this.onChangeStatusInfoID}
            isMute={this.state.isMute}
            onSelectedAlarm={this.onSelectedAlarm}
            menu3DTools={this.state.menu3DTools}
        />;
    }

    hydrogenNewAlarmUI() {
        if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
            return <></>;
        }

        if (this.state.selectedAlarm !== null && this.state.selectedAlarm.isAlarm && !this.state.selectedAlarm.newCheck && this.state.selectedAlarm.sopStatus < 0) {
            return <EventFullBoxComponent onClick={this.eventFullBox}>
                <span className={'dangerImage'}></span>
                <span className={'light1Image'}></span>
                <p className={'eventFullTitle'}>{i18nUtil.convertText(this.state.selectedAlarm.positionName)}</p>
                <span className={'light2Image'}></span>
                {
                    //<p className={'eventFullContents'}>2023.10.11 13:10:03 [전기분해기_압축기]에서 <span className={'eventRedFont'}>압력상승</span>이 탐지되었습니다.</p>
                    <p className={'eventFullContents'}>{this.state.selectedAlarm.strDateTime} {i18nUtil.convertText(this.state.selectedAlarm.message)}</p>
                }
                <span className={'eventFullBtn'} onClick={() => this.eventFullBox}>{i18n.t('common.확인')}</span>
            </EventFullBoxComponent>
        }

        return <></>;
    }

    eventFullBox = () => {
        const selectedAlarm = { ...this.state.selectedAlarm };
        selectedAlarm.newCheck = true;
        this.setState({ selectedAlarm });
    }

    get3DToolEvent = () => {

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
        const contents = this.getContents();

        return (
            <SDMSComponent className={'bodyArea'} style={{ MozUserSelect: 'none', WebkitUserSelect: 'none' }}>
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
                {/* {contents}  */}
                <LnbPopup
                    setVisiblePopups={this.setVisiblePopups}
                    getVisiblePopups={this.getVisiblePopups}
                    visiblePopups={visiblePopups}
                    sensorAlarms={this.state.sensorAlarms}
                    visibleSensorTypes={this.state.visibleSensorTypes}
                    setVisiblePoi={this.setVisiblePoi}
                    menu3DTools={this.state.menu3DTools}
                    setModePopup={this.setModePopup}

                />
                {popupUI}
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }

                {/* 토스트 팝업으로 대신하기로 하여 주석처리
                    this.hydrogenNewAlarmUI()
                */}
            </SDMSComponent>
        );
    }
}


export default hoistStatics(withTranslation()(SDMS), SDMS);