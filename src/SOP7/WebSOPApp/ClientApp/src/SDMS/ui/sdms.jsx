import React, { Component } from 'react';
import styles from '../css/sdms.module.css';
import content from '../../Common/css/content.module.css';
import { SDMSController } from '../services/sdmsController';
import { SDMSDataManager } from '../services/sdmsDataManager';
import SDMSResource from '../resource/id';
import Contents3D from './3D/contents3D';
import Contents3D_15 from './3D/sites/contents3D_15';
import Contents2D from './2D/contents2D';
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
import SensorStatus from './popups/sensorStatus'; 
import WorkerPath from './popups/worker/workerPath';
import WorkerInfoSB from './../ui/popups/workerInfoSB';
import SafetyAreaAssessment from './popups/safetyAreaAssessment';
import HistoryData from './popups/historyData';
import WorkerDetailInfo from './popups/worker/workerDetailInfo';
import WorkerStatusPopup from './popups/worker/WorkerStatusPopup';
import DetectionInfo from './popups/detectionInfo';
import SimulationInfo from './popups/simulationInfo';
import AnalysisInfo from './popups/analysisInfo';
import WaterLevelInfo from './popups/waterLevelInfo';
import ElevatorInfo from './popups/elevatorInfo';
import ChangeSensorName from './popups/changeSensorName';

// 경기 SDMS POPUPS
import StatusInfo_gg from './popups/gyeonggi/statusInfo_gg';
import EventDashboard_gg from './popups/gyeonggi/eventDashboard_gg';
import FleeDashboard_gg from './popups/gyeonggi/fleeDashboard_gg';
import AccessControl_gg from './popups/gyeonggi/accessControl_gg';
import ParkingInfo_gg from './popups/gyeonggi/parkingInfo_gg';
import ElectricInfo_gg from './popups/gyeonggi/electricInfo_gg';
import CCTVInfo_gg from './popups/gyeonggi/cctvInfo_gg';
import ManualReport_gg from './popups/gyeonggi/manualReport_gg';
import EarthquakeInfo_gg from './popups/gyeonggi/earthquakeInfo_gg';

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
import CCTVApp_gg from './popups/gyeonggi/cctvApp_gg';
import wsManager from '../services/wsManager';
import EditModeStatusInfo_gg from './popups/gyeonggi/editModeStatusInfo_gg';
import SpeedingHistory from './popups/speedingHistory';
import SpeedingInfo from './popups/speedingInfo';

class SDMS extends Component {
    static menu = {
        none: null,
        statusInfo: SDMSResource.menu.현황정보,
        allCCTV: SDMSResource.menu.전체_CCTV,
        cctv: SDMSResource.menu.CCTV_영상정보,
        alarmCCTV1: SDMSResource.menu.알람_CCTV_1,
        alarmCCTV2: SDMSResource.menu.알람_CCTV_2,
        alarmCCTV3: SDMSResource.menu.알람_CCTV_3,
        cctvApp: SDMSResource.menu.CCTV_APP,
        dashboard: SDMSResource.menu.대시보드,
        eventInfo: SDMSResource.menu.이벤트_정보,
        miniMap: SDMSResource.menu.미니맵,
        editMode: SDMSResource.menu.편집모드,
        manualReport: SDMSResource.menu.수동신고,
        weatherInfo: SDMSResource.menu.기상정보,
        editModeStatusInfo: SDMSResource.menu.현황정보_편집모드,
        streamServerURL: null,
        buildingInfo: SDMSResource.menu.정보,
        alarmMemo: SDMSResource.menu.알람메모,
        workerInfo: SDMSResource.menu.작업자현황,
        workerInfoSB: SDMSResource.menu.작업일지,
        sensorStatus: SDMSResource.menu.센서현황,
        workerStatus: SDMSResource.menu.작업자정보,
        workerPath: SDMSResource.menu.인원현황,
        safetyAreaAssessment: SDMSResource.menu.안전구역_평가,
        historyData: SDMSResource.menu.이력데이터,
        workerDetailInfo: SDMSResource.menu.알람인원정보,
        speedingHistory: SDMSResource.menu.과속감지_이력,
        speedingInfo: SDMSResource.menu.과속감지_알림,
        // 수소 -------------------------------------
        detectionInfo: SDMSResource.menu.이상_탐지,
        simulationInfo: SDMSResource.menu.시뮬레이션,
        analysisInfo: SDMSResource.menu.위험도_분석,
        // ----------------------------------------- //
        // 경기 -------------------------------------
        waterLevelInfo: SDMSResource.menu.집수정,
        elevatorInfo: SDMSResource.menu.엘리베이터,
        accessControl: SDMSResource.menu.출입통제,
        parkingInfo: SDMSResource.menu.주차관제,
        electricInfo: SDMSResource.menu.전력량정보,
        earthquakeInfo: SDMSResource.menu.지진,
        // 천원궁 청심박물관 -------------------------
        changeSensorName: SDMSResource.menu.센서명_변경
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
                workerPathZIndex: 0, /* 0929 */
                sensorStatusZIndex: 0, /* 0929 */
                safetyAreaAssessmentZIndex: 0,
                historyDataZIndex: 0,
                workerDetailInfo: 0,
                workerInfoSBZIndex: 0,
                detectionInfoZIndex: 0,
                simulationInfoZIndex: 0,
                analysisInfoZIndex: 0,
                waterLevelInfoZIndex: 0,
                elevatorInfoZIndex: 0,
                accessControlZIndex: 0,
                parkingInfoZIndex: 0,
                electricInfoZIndex: 0,
                earthquakeInfoZIndex: 0,
                speedingHistoryZIndex: 0,
                speedingInfoZIndex: 0,
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
            dashboardSensors: null,
            walker: null,
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
                earthquakeSensors: null,
                strongWindSensors: null,
                environmentSensors: null,
                manufactureSensors: null,
                emergencyBellSensors: null,
                laser: null,
                door: null,
                cctvGroups: null,
                cctvSubGroups: null,
                facilityGroups: null,
                facilitySubGroups: null,
            },
            rangeSensors: store.getState().rangeSensors,
            selectedRangeSensors: [],
            alarmRangeSensor: null,
            viewMode: null,
            workerInfos: store.getState().workerInfos,      // 인원현황
            useSensorTypes: null,                           // 사용 중인 센서 타입  
            workerDetailInfo: null,                         // 비콘 체류 및 SOS 인원정보 
            workerStatusPopup: null,                        // 인원현황 구역 상세정보 
            selectEquipZonePOI: null,
            selectEquipZoneArea: null,
            selectEquipZoneID: null,

            selectSiteID: null,     // 경기 선택된 siteID
            evacuations: null,      // 경기 피난유도 데이터
            evacuationsPopupStatus: {[ProjectResource.Site.GG_B]: 0, [ProjectResource.Site.GG_F]: 0},    // 0: 닫힘, 1: 열림, 2: 안내창
            showEvacuationsPopup: {[ProjectResource.Site.GG_B]: false, [ProjectResource.Site.GG_F]: false},
            evacuationsCurrent: null,

            reload: 0,      // 새로고침 변수

            zoneIcons: {},  // 센서로 분류되지 않는 층별 아이콘들(경기도청)
            closedDoorDatas: {},

            speedDetectionDatas: [],        // 차량 과속 데이터
            isEmergencyMode: false,          // 특정 센서 알람 발생시 긴급 상황
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
        this.floorBoundingBoxManager = null;

        this.tempNewSensor = null;
        this.tempNewSensorType = null;

        this.isFirst = true;

        // 현재 이벤트 창에 표시된 알람정보
        this.currentAlarms = [];
        this.ignoreAlarmTime = null;
    }

    initVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[SDMSMainMenu.Fire_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.CCTV_Type] = true;
        visibleSensorTypes[SDMSMainMenu.PSM_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Etc_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.EquipZoneName] = true;
        visibleSensorTypes[SDMSMainMenu.EquipZoneArea] = false;
        visibleSensorTypes[SDMSMainMenu.Worker] = true;
        visibleSensorTypes[SDMSMainMenu.Visitor] = true;
        visibleSensorTypes[SDMSMainMenu.EquipZoneAssess] = true;
        visibleSensorTypes[SDMSMainMenu.Environment_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Manufacture_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Emergency_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Park] = true;
        visibleSensorTypes[SDMSMainMenu.Laser_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Door_Sensor] = false;
        visibleSensorTypes[SDMSMainMenu.Exit] = false;
        visibleSensorTypes[SDMSMainMenu.Life] = true;
        visibleSensorTypes[SDMSMainMenu.Cardiac] = true;
        visibleSensorTypes[SDMSMainMenu.Rescue] = true;
        visibleSensorTypes[SDMSMainMenu.SpeedDetection] = true;
        
        return visibleSensorTypes;
    }

    componentDidMount() {
        const lang = ProjectResource.getLanguage();
        if (lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }

        if (ProjectResource.SiteID !== ProjectResource.Site.Tlb) {
            SDMSController.StartWatchTimer();
        }

        this.startWatchTimerGG();

        this.props.menuEvent.handler = this.onSelectMenu;
        this.props.menuEvent.onClickLogo = this.onClickLogo;
        this.props.menuEvent.getSDMSCommonSettings = this.getSDMSCommonSettings;

        this.requestSensorList();
        
        //this.set3DOptions();

        // 처음부터 뜰 메뉴
        var visiblePopups = this.state.visiblePopups;
        visiblePopups[SDMS.menu.statusInfo] = true;
        visiblePopups[SDMS.menu.allCCTV] = false;
        visiblePopups[SDMS.menu.cctv] = false;
        visiblePopups[SDMS.menu.alarmCCTV1] = false;
        visiblePopups[SDMS.menu.alarmCCTV2] = false;
        visiblePopups[SDMS.menu.alarmCCTV3] = false;
        visiblePopups[SDMS.menu.cctvApp] = false;
        visiblePopups[SDMS.menu.dashboard] = true;
        visiblePopups[SDMS.menu.eventInfo] = true;
        visiblePopups[SDMS.menu.miniMap] = false;
        visiblePopups[SDMS.menu.weatherInfo] = true;
        visiblePopups[SDMS.menu.manualReport] = false;
        visiblePopups[SDMS.menu.workerInfo] = false;
        visiblePopups[SDMS.menu.workerInfoSB] = false;
        visiblePopups[SDMS.menu.workerStatus] = false;
        visiblePopups[SDMS.menu.sensorStatus] = false;
        visiblePopups[SDMS.menu.workerPath] = false;
        visiblePopups[SDMS.menu.safetyAreaAssessment] = false;
        visiblePopups[SDMS.menu.historyData] = false;
        visiblePopups[SDMS.menu.workerDetailInfo] = false;
        visiblePopups[SDMS.menu.detectionInfo] = false;
        visiblePopups[SDMS.menu.simulationInfo] = false;
        visiblePopups[SDMS.menu.analysisInfo] = false;
        visiblePopups[SDMS.menu.waterLevelInfo] = false;
        visiblePopups[SDMS.menu.elevatorInfo] = false;
        visiblePopups[SDMS.menu.changeSensorName] = false;
        visiblePopups[SDMS.menu.accessControl] = false;
        visiblePopups[SDMS.menu.parkingInfo] = false;
        visiblePopups[SDMS.menu.electricInfo] = false;
        visiblePopups[SDMS.menu.earthquakeInfo] = false;
        visiblePopups[SDMS.menu.speedingHistory] = false;
        visiblePopups[SDMS.menu.speedingInfo] = false;

        
        // 사이트 및 계정권한에 따라 초기 팝업 설정
        this.initVisibles();

        // 계정권한에 따른 알람 SHOW/HIDE 인한 주석
        //let selectedAlarm = null;
        //if (this.state.sensorAlarms === null) {
        //    // 새로 고침할 경우 null임 해결법 찾아야함
        //}
        //else {
        //    if (this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
        //        selectedAlarm = this.state.sensorAlarms[0];
        //    }
        //}

        //if (selectedAlarm === null)
        //    this.setState({ visiblePopups: visiblePopups });
        //else
        //    this.setState({ visiblePopups: visiblePopups, selectedAlarm: selectedAlarm });
        this.setState({ visiblePopups: visiblePopups });

        // 각 페이지 별로 클래스 초기화
        $('#mainSB').addClass('posi_relative');
        $('#headerSB').addClass('posiHeaderWrap');
        $('#headerSB').removeClass('appHeaderWrap');
        

        //팝업 상태값 일괄 획득
        this.getPopupState();
        // 대시보드 센서 목록 초기화
        this.initDashboardSensors();
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
            this.setEvacuations(store.getState());
            this.setDoorDatas(store.getState());
            this.setUpsDatas(store.getState());
            this.setSpeedDetectionDatas(store.getState());
        }.bind(this));

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'RESET_POPUP') {
                this.resetPopupState(data.popupState);
            } else if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                // setState 반영 전 = 이번 수신 직전 상태로 최초 로드 여부 판단
                const alreadyLoaded = this.isCommonSettingsLoaded();


                this.changeSDMSCommonSettings(data.sdmsCommonSettings);
                // 사용중인 센서타입 reload
                this.reloadUseSensorTypes(data.sdmsCommonSettings);


                // 최초 로드 시에만 현재 발생 중인 전체 알람의 긴급 여부 재분류 (이후 설정 변경 시 반복 검사 방지)
                if (!alreadyLoaded) {
                    this.reclassifyEmergencyAlarms(data.sdmsCommonSettings);
                }
            } else if (data.actionType === 'SELECT_SITEID') {
                this.changeSelectSiteID(data.selectSiteID);
            } else if (data.actionType === 'UPDATED_SENSOR_LIST') {
                this.reloadSensorList();
            }
            
        }.bind(this));

        window.addEventListener('beforeunload', this.closeAllCCTVs);

        document.addEventListener("visibilitychange", this.showCCTVPopups);

        this.setWsManager();

        this.closeAllCCTVs();
    }

    startWatchTimerGG = async () => {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            const [result, message] = await SDMSController.requestGetSiteID();

            if (result === ProjectResource.Site.GG_A) {
                GghController.StartWatchTimer();
            }
        }
        else if (siteID === ProjectResource.Site.GG_A) {
            GghController.StartWatchTimer();
        }
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
            if (this.wsManager) {
                this.wsManager.showCCTV(userInfo.id, document.visibilityState === "visible" ? true : false)
            }
        }
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

        if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            if (prevState.evacuations !== null) {
                if (prevState.evacuationsPopupStatus[ProjectResource.Site.GG_B] === 0 && prevState.evacuationsPopupStatus[ProjectResource.Site.GG_F] === 0 &&
                    this.state.evacuations[ProjectResource.Site.GG_B]?.isEvac && this.state.evacuations[ProjectResource.Site.GG_F]?.isEvac) {
                    this.setState({ 
                        evacuationsPopupStatus: {[ProjectResource.Site.GG_B]: 1, [ProjectResource.Site.GG_F]: 1}, 
                        showEvacuationsPopup: {[ProjectResource.Site.GG_B]: true, [ProjectResource.Site.GG_F]: true},
                        evacuationsCurrent: {siteID: ProjectResource.Site.GG_B, status: 1}
                    });

                    setTimeout(() => {
                        this.setState({ 
                            evacuationsPopupStatus: {...this.state.evacuationsPopupStatus, [ProjectResource.Site.GG_F]: 2}, 
                        });
                    }, 10000);
                }
                else if (prevState.evacuationsPopupStatus[ProjectResource.Site.GG_B] === 2 && prevState.evacuationsPopupStatus[ProjectResource.Site.GG_F] === 2 &&
                    !this.state.evacuations[ProjectResource.Site.GG_B]?.isEvac && !this.state.evacuations[ProjectResource.Site.GG_F]?.isEvac) {
                    this.setState({ 
                        evacuationsPopupStatus: {[ProjectResource.Site.GG_B]: 0, [ProjectResource.Site.GG_F]: 0}, 
                        showEvacuationsPopup: {[ProjectResource.Site.GG_B]: true, [ProjectResource.Site.GG_F]: true},
                        evacuationsCurrent: {siteID: ProjectResource.Site.GG_B, status: 0}
                    });

                    setTimeout(() => {
                        this.setState({ 
                            showEvacuationsPopup: {...this.state.showEvacuationsPopup, [ProjectResource.Site.GG_F]: false}, 
                        });
                    }, 10000);
                }
                else if (prevState.evacuations[ProjectResource.Site.GG_B]?.isEvac !== this.state.evacuations[ProjectResource.Site.GG_B]?.isEvac) {
                    if (this.state.evacuations[ProjectResource.Site.GG_B]?.isEvac) {
                        this.setState({ 
                            evacuationsPopupStatus: {...this.state.evacuationsPopupStatus, [ProjectResource.Site.GG_B]: 1}, 
                            showEvacuationsPopup: {...this.state.showEvacuationsPopup, [ProjectResource.Site.GG_B]: true},
                            evacuationsCurrent: {siteID: ProjectResource.Site.GG_B, status: 1}
                        });
                    }
                    else {
                        this.setState({ 
                            evacuationsPopupStatus: {...this.state.evacuationsPopupStatus, [ProjectResource.Site.GG_B]: 0},
                            showEvacuationsPopup: {...this.state.showEvacuationsPopup, [ProjectResource.Site.GG_B]: true},
                            evacuationsCurrent: {siteID: ProjectResource.Site.GG_B, status: 0}
                        });
                    }
                }
                else if (prevState.evacuations[ProjectResource.Site.GG_F]?.isEvac !== this.state.evacuations[ProjectResource.Site.GG_F]?.isEvac) {
                    if (this.state.evacuations[ProjectResource.Site.GG_F]?.isEvac) {
                        this.setState({ 
                            evacuationsPopupStatus: {...this.state.evacuationsPopupStatus, [ProjectResource.Site.GG_F]: 1},
                            showEvacuationsPopup: {...this.state.showEvacuationsPopup, [ProjectResource.Site.GG_F]: true},
                            evacuationsCurrent: {siteID: ProjectResource.Site.GG_F, status: 1}
                        });
                    }
                    else {
                        this.setState({ 
                            evacuationsPopupStatus: {...this.state.evacuationsPopupStatus, [ProjectResource.Site.GG_F]: 0}, 
                            showEvacuationsPopup: {...this.state.showEvacuationsPopup, [ProjectResource.Site.GG_F]: true},
                            evacuationsCurrent: {siteID: ProjectResource.Site.GG_F, status: 0}
                        });
                    }
                }
            }

            if (prevState.selectedAlarm !== this.state.selectedAlarm && this.state.selectedAlarm) {
                GghController.stopWatchTimerAccessControl();
                GghController.StartWatchTimerAccessControl(this.state.selectedAlarm.siteID);
            }

            if (prevState.cctvAppGUID_poi !== this.state.cctvAppGUID_poi || 
                prevState.cctvAppGUID_alarms !== this.state.cctvAppGUID_alarms
            ) {
                if (this.state.cctvAppGUID_poi === null && this.state.cctvAppGUID_alarms.length === 0) {
                    this.setVisiblePopups(SDMS.menu.cctvApp, false);
                }
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
            siteID === ProjectResource.Site.GG_A ||
            siteID === ProjectResource.Site.Magog) {
            visiblePopups[SDMS.menu.weatherInfo] = false;
            isUpdate = true;
        }

        if (userInfo?.levelID === AccountResource.accountLevelID.wonikCEO) {
            visiblePopups[SDMS.menu.weatherInfo] = false;
            visiblePopups[SDMS.menu.dashboard] = false;
            visiblePopups[SDMS.menu.eventInfo] = false;
            visiblePopups[SDMS.menu.historyData] = true;

            isUpdate = true;
        }
        else if (userInfo?.levelID === AccountResource.accountLevelID.wonikSafety ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikSafeAdmin ||
            (siteID === ProjectResource.Site.Wonik && this.useEquipZoneAssess())) {
            visiblePopups[SDMS.menu.weatherInfo] = false;
            visiblePopups[SDMS.menu.dashboard] = false;
            visiblePopups[SDMS.menu.eventInfo] = false;

            visibleSensorTypes[SDMSMainMenu.CCTV_Type] = false;
            
            isUpdate = true;
        }
        
        if (isUpdate) 
            this.setState({ visiblePopups, visibleSensorTypes });
    }

    async initAuthorAlarms() {
        let selectedAlarm = null;
        let sensorAlarms = store.getState().sensorAlarm;
        const userInfo = await ProjectResource.initUserInfo();

        // 계정권한에 따라 알람 SHOW/HIDE
        if (userInfo?.levelID === AccountResource.accountLevelID.wonikCEO ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikSafety ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikSafeAdmin) {
            sensorAlarms = [];
        }

        if (this.state.sensorAlarms?.length > 0) {
            selectedAlarm = this.state.sensorAlarms[0];
        }

        this.updateFloorBoundingBox(sensorAlarms);
        this.checkAlarmCCTV(sensorAlarms);
        this.setState({ sensorAlarms, selectedAlarm });
    }

    setEvacuations(storeValue) {
        if (storeValue.actionType === 'EVACUATIONS_INFOS' && storeValue.evacuations) {
            const evacuations_GG_B = storeValue.evacuations.find((data) => data.siteID === ProjectResource.Site.GG_B);
            const evacuations_GG_F = storeValue.evacuations.find((data) => data.siteID === ProjectResource.Site.GG_F);

            const obj =  {
                [ProjectResource.Site.GG_B]: evacuations_GG_B,
                [ProjectResource.Site.GG_F]: evacuations_GG_F,
            };

            this.setState({ evacuations: obj });

            if (this.isFirst) {
                if (obj[ProjectResource.Site.GG_B]?.isEvac && obj[ProjectResource.Site.GG_F]?.isEvac) {
                    this.setState({ 
                        evacuationsPopupStatus: {[ProjectResource.Site.GG_B]: 1, [ProjectResource.Site.GG_F]: 1}, 
                        showEvacuationsPopup: {[ProjectResource.Site.GG_B]: true, [ProjectResource.Site.GG_F]: true},
                        evacuationsCurrent: {siteID: ProjectResource.Site.GG_B, status: 1}
                    });
                }
                else if (obj[ProjectResource.Site.GG_B]?.isEvac && !obj[ProjectResource.Site.GG_F]?.isEvac) {
                    this.setState({ 
                        evacuationsPopupStatus: {[ProjectResource.Site.GG_B]: 1, [ProjectResource.Site.GG_F]: 0}, 
                        showEvacuationsPopup: {[ProjectResource.Site.GG_B]: true, [ProjectResource.Site.GG_F]: false},
                        evacuationsCurrent: {siteID: ProjectResource.Site.GG_B, status: 1}
                    });
                }
                else if (!obj[ProjectResource.Site.GG_B]?.isEvac && obj[ProjectResource.Site.GG_F]?.isEvac) {
                    this.setState({ 
                        evacuationsPopupStatus: {[ProjectResource.Site.GG_B]: 0, [ProjectResource.Site.GG_F]: 1}, 
                        showEvacuationsPopup: {[ProjectResource.Site.GG_B]: false, [ProjectResource.Site.GG_F]: true},
                        evacuationsCurrent: {siteID: ProjectResource.Site.GG_F, status: 1} 
                    });
                }

                this.isFirst = false;
            }
        }
    }

    setDoorDatas(storeValue) {
        if (storeValue.actionType === 'DOOR_INFOS' && storeValue.doorDatas) {
            if (this.editModeManager?.contents3D?.poiManager) {
                this.editModeManager.contents3D.poiManager.updateClosedDoors(storeValue.doorDatas);
            }

            this.setState({ closedDoorDatas: storeValue.doorDatas });
        }
    }

    setUpsDatas(storeValue) {
        if (storeValue.actionType === 'UPS_INFOS' && storeValue.upsDatas) {
            this.setState({ upsDatas: storeValue.upsDatas });
        }
    }
    
    setSpeedDetectionDatas(storeValue) {
        if (storeValue.actionType === 'SPEED_DETECTION' && storeValue.speedDetections) {
            const speedDetections = storeValue.speedDetections;
            let visiblePopups = this.state.visiblePopups;

            // 새로 '차량번호가 확인된' 과속이 10분 내이면 알림창을 띄운다.
            //   - 감지 직후엔 번호가 없어 표시할 게 없고, 번호가 채워지는 시점이 실제 확인 시점이다.
            //   - 이미 있던 번호나, 번호와 무관한 내용 변화(중복 삭제 등)로는 열지 않는다.
            if (speedDetections.length > 0) {
                const prevKeys = new Set(
                    (this.state.speedDetectionDatas || [])
                        .filter(d => d.carNo)
                        .map(d => d.carNo + '|' + d.detectionTime)
                );

                const now = new Date().getTime();
                let hasNewIdentified = false;

                for (let i = 0; i < speedDetections.length; i++) {
                    const d = speedDetections[i];
                    if (!d.carNo) continue;                       // 아직 번호 미확인
                    const key = d.carNo + '|' + d.detectionTime;
                    if (prevKeys.has(key)) continue;              // 이미 표시되던 번호

                    const t = new Date(d.detectionTime).getTime();
                    if ((now - t) < (60 * 1000 * 10)) {           // 10분 내 발생
                        hasNewIdentified = true;
                        break;
                    }
                }

                if (hasNewIdentified) {
                    visiblePopups[SDMS.menu.speedingInfo] = true;
                }
            }
            else if (speedDetections.length <= 0 && visiblePopups[SDMS.menu.speedingInfo] === true) {
                // 과속 데이터가 없는 경우 알림창이 떠 있을 경우 끄기
                visiblePopups[SDMS.menu.speedingInfo] = false;
            }

            this.setState({ speedDetectionDatas: storeValue.speedDetections, visiblePopups: visiblePopups });
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




    // commonSettings 로드 여부 (빈 객체 {} = 미로드). 최초 로드 1회 가드에 사용.
    isCommonSettingsLoaded() {
        const cs = this.state.commonSettings;
        return !!cs && Object.keys(cs).length > 0;
    }

    // 주어진 commonSettings 기준으로 현재 발생 중인 전체 활성 알람의 isEmergency 재분류
    // (설정이 알람보다 늦게 로드될 때 교정)
    reclassifyEmergencyAlarms(settings) {
        const alarms = this.state.sensorAlarms;
        if (!alarms || alarms.length === 0) return;

        const emergencyZoneIDs = this.getEmergencySensorZoneIDs(settings);
        let changed = false;
        for (const alarm of alarms) {
            if (!alarm.isAlarm) continue;   // 활성 알람만 대상
            changed = emergencyZoneIDs.has(alarm.sensorZoneID);
            if (changed)
                break;
        }

        //if (changed) this.setState({ sensorAlarms: [...alarms] });   // 변경 있을 때만 리렌더
        if (changed) {
            // 화면 UI 표시
            this.setState({ isEmergencyMode: true });
        }
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
        const alarms = storeValue?.sensorAlarm;

        if ((storeValue?.actionType === 'SENSOR_ALARM') && (userInfo?.siteID >= ProjectResource.Site.GG_A && userInfo?.siteID <= ProjectResource.Site.GG_H)) {
            let alarmCount = 0;
            let fireAlarmCount = 0;         // 화재 알람 갯수
            let blackoutAlarmCount = 0;     // 정전 알람 갯수
            let earthquakeAlarmCount = 0;   // 지진 알람 갯수
            let waterLevelAlarmCount = 0;   // 침수 알람 갯수
            let terrorAlarmCount = 0;       // 테러 알람 갯수

            for (let alarm of alarms) {
                if (alarm.isAlarm) {
                    if (alarm.facilityType === SDMSResource.facilityType.FIRE) {
                        fireAlarmCount++;
                    }
                    else if (alarm.facilityType === SDMSResource.facilityType.BLACKOUT) {
                        blackoutAlarmCount++;
                    }
                    else if (alarm.facilityType === SDMSResource.facilityType.Earthquake) {
                        earthquakeAlarmCount++;
                    }
                    else if (alarm.facilityType === SDMSResource.facilityType.WaterLevel) {
                        waterLevelAlarmCount++;
                    }
                    else if (alarm.facilityType === SDMSResource.facilityType.Terror) {
                        terrorAlarmCount++;
                    }
                    alarmCount++;
                }
            }

            this.setVisiblePoi(SDMSMainMenu.Exit, alarmCount > 0 ? true : false);
            this.setVisiblePoi(SDMSMainMenu.Door_Sensor, fireAlarmCount > 0 ? true : false);

            // 정전 이벤트 발생 시 전력 팝업 open
            // this.setVisiblePopups(SDMS.menu.electricInfo, blackoutAlarmCount > 0 ? true : false);

            // 지진 이벤트 발생 시 
            if (earthquakeAlarmCount > 0) {
                // 로그인 계정에 매핑된 사이트의 외부 모델로 3D 이동
                this.changeSite(userInfo.siteID, true);

                // 로그인 계정이 도본청/도의회, 도서관, 신용보증재단일 경우 지진계측정보 팝업 open
                if (userInfo.siteID === ProjectResource.Site.GG_B ||
                    userInfo.siteID === ProjectResource.Site.GG_D ||
                    userInfo.siteID === ProjectResource.Site.GG_F) {
                    this.setVisiblePopups(SDMS.menu.earthquakeInfo, earthquakeAlarmCount > 0 ? true : false);
                }
            }

            // 침수 이벤트 발생 시 집수정 팝업 open
            // this.setVisiblePopups(SDMS.menu.waterLevelInfo, waterLevelAlarmCount > 0 ? true : false);

            // 화재 이벤트 발생 시 출입통제 팝업 open
            if (fireAlarmCount > 0) {

                setTimeout(() => {
                    const haveClosedDoors = this.getClosedDoorsStatus(this.state.closedDoorDatas);
    
                    if (haveClosedDoors && 
                        (this.state.selectedAlarm?.siteID === ProjectResource.Site.GG_B || 
                        this.state.selectedAlarm?.siteID === ProjectResource.Site.GG_D ||
                        this.state.selectedAlarm?.siteID === ProjectResource.Site.GG_F ||
                        this.state.selectSiteID === ProjectResource.Site.GG_B || 
                        this.state.selectSiteID === ProjectResource.Site.GG_D || 
                        this.state.selectSiteID === ProjectResource.Site.GG_F)
                    ) {
                        this.setVisiblePopups(SDMS.menu.accessControl, true);
                    }
                }, 5000);
            }
            else {
                this.setVisiblePopups(SDMS.menu.accessControl, false);
            }
        }
        else if (storeValue?.actionType === 'SENSOR_ALARM' && userInfo?.siteID === ProjectResource.Site.Magog) {
            let fireAlarmCount = 0;

            for (let alarm of alarms) {
                if (alarm.isAlarm) {
                    if (alarm.facilityType === SDMSResource.facilityType.FIRE) {
                        fireAlarmCount++;
                    }
                }
            }

            this.setVisiblePoi(SDMSMainMenu.Door_Sensor, fireAlarmCount > 0 ? true : false);

            // 화재 이벤트 발생 시 출입통제 팝업 open
            if (fireAlarmCount > 0) {
                // 5초 후에 Close 문을 찾은 뒤 팝업을 띄우기

                const haveClosedDoors = this.getClosedDoorsStatus(this.state.closedDoorDatas);

                if (haveClosedDoors) {
                    setTimeout(() => {
                        this.setVisiblePopups(SDMS.menu.accessControl, true);
                    }, 5000);
                }
            }
        }
       
        // 계정권한에 따라 알람 SHOW/HIDE
        if ((storeValue?.actionType !== 'SENSOR_ALARM') ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikCEO ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikSafety ||
            userInfo?.levelID === AccountResource.accountLevelID.wonikSafeAdmin)
            return;

        // ChangeAlarm 동작 중인 경우 보류
        if (this.isChangeAlarmLoading === true) {
            this.loadingAlarm = storeValue;
            return;
        }

        this.isChangeAlarmLoading = true;
        this.loadingAlarm = null;

        const orgAlarms = this.state.sensorAlarms;


        // 직전 대비 신규로 발생한 알람만 추림 (isAlarm이고, 이전 목록에 같은 sensorZoneHistoryID로 알람 중이 아니었던 것)
        const prevAlarms = orgAlarms || [];
        const newlyAlarms = (alarms || []).filter(a =>
            a.isAlarm &&
            !prevAlarms.some(o => o.sensorZoneHistoryID === a.sensorZoneHistoryID && o.isAlarm)
        );

        // 신규 발생 알람 각각에 대해 OptionSDMS 긴급 목록(EmergencySensorZoneIDs) 기준으로 긴급 여부 판별 (플래그 + 로그)
        const emergencyZoneIDs = this.getEmergencySensorZoneIDs();

        if (newlyAlarms.length > 0) {
            let change = false;

            for (const alarm of newlyAlarms) {
                change = emergencyZoneIDs.has(alarm.sensorZoneID);
                if (change && this.state.isEmergencyMode !== true) {
                    // 화면 UI 표시
                    this.state.isEmergencyMode = true;
                }
            }
        }

        // 현재 활성 알람 중 긴급 알람이 하나도 남아있지 않으면 긴급 UI 자동 해제
        // (해제된 알람은 isAlarm=false로 갱신되어 오므로 "신규 발생" 필터로는 감지 불가 → 활성 알람 전체를 다시 검사해야 함)
        const hasActiveEmergency = (alarms || []).some(a => a.isAlarm && emergencyZoneIDs.has(a.sensorZoneID));
        if (!hasActiveEmergency && this.state.isEmergencyMode !== false) {
            this.state.isEmergencyMode = false;
        }

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
                alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                menus[SDMS.menu.eventInfo] = true;

                let alarmCCTVID = null;
                if (SDMSResource.isSVMSSensorType(selectedAlarm.facilityType))
                    alarmCCTVID = selectedAlarm.orgSensorID;                

                alarmCCTV = this.showAlarmCCTV(alarmType, selectedAlarm);

                this.getEquipZoneCCTV(selectedAlarm.equipZoneID, alarmCCTV, alarmCCTVID, selectedAlarm.facilityType);
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
                    if (this.state.commonSettings?.MoveDisplayAlarm !== SettingResource.moveDisplayAlarm.currentDisplay) {
                        // 알람 중지시 CCTV 팝업창 불일치 오류 수정
                        //await this.showAlarm(selectedAlarm, null);
                        const alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                        const _targetCCTVMenu = this.showAlarmCCTV(alarmType, selectedAlarm);
                        await this.showAlarm(selectedAlarm, _targetCCTVMenu);
                    }
                }
            }
        }

        if (selectedAlarm === null) {
            this.updateFloorBoundingBox(alarms);
            this.checkAlarmCCTV(alarms);
            this.setState({ sensorAlarms: alarms, selectedAlarm: selectedAlarm, visiblePopups: menus, cctvList: null, alarmSound: false });
        }
        else {
            const alarmRangeSensor = this.getAlarmRangeSensor(selectedAlarm);
            if (selectedAlarm?.isAlarm && alarmRangeSensor) {
                menus[SDMS.menu.sensorStatus] = true;
                this.state.alarmRangeSensor = alarmRangeSensor;
            } 
            const workerDetailInfo = this.getAlarmBeaconInfo(selectedAlarm);
            if (selectedAlarm?.isAlarm && workerDetailInfo) {
                menus[SDMS.menu.workerDetailInfo] = true;
                this.state.workerDetailInfo = workerDetailInfo;
            } 

            this.updateFloorBoundingBox(alarms);
            this.checkAlarmCCTV(alarms);

            this.setState({ 
                sensorAlarms: alarms, 
                selectedAlarm: selectedAlarm, 
                visiblePopups: menus, 
                alarmSound: this.state.alarmSound && selectedAlarm.isAlarm // this.state.alarmSound이 false인 경우 계속 false로 유지하기 위함 (한봄희)
            });
        }

        // 보류된 알람 표시
        this.isChangeAlarmLoading = false;

        if (this.loadingAlarm) {
            this.changeAlarm(this.loadingAlarm);
        }
    }

    getClosedDoorsStatus = (closedDoorDatas) => {
        // 미개방 출입문이 존재하는 층이 있는가?
        let haveClosedDoors = false;

        if (Object.keys(closedDoorDatas).length === 0) {
            this.setVisiblePopups(SDMS.menu.accessControl, false);
            return false;
        }

        for (let data in closedDoorDatas) {
            if (closedDoorDatas[data].closedDoors.length > 0) {
                haveClosedDoors = true;
                break;
            }
        }

        return haveClosedDoors;
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

    getAlarmBeaconInfo(alarm) {
        if (this.useWorkerInfo() === false)
            return null;

        let alarmBeaconInfo = null;

        if (SDMSResource.isBeaconSensorType(alarm.facilityType) && alarm.etc) {
            alarmBeaconInfo = {};
            alarmBeaconInfo.type = alarm.facilityType;
            alarmBeaconInfo.content = alarm.etc;
        } 
        
        return alarmBeaconInfo;
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

    // OptionSDMS의 EmergencySensorZoneIDs 값(콤마 구분 문자열)을 정수 Set으로 파싱
    // settings 미지정 시 현재 state의 commonSettings 사용 (setState 반영 전 값 전달 가능)
    getEmergencySensorZoneIDs(settings = this.state.commonSettings) {
        const raw = settings?.EmergencySensorZoneIDs;
        if (!raw) return new Set();

        return new Set(
            raw.split(',')
                .map(s => parseInt(s.trim(), 10))
                .filter(n => !isNaN(n))
        );
    }

    // 종료된 알람에 대한 CCTV창은 닫는다.
    checkAlarmCCTV(sensorAlarms) {
        const wsManager = this.wsManager;

        const deleteAlarms = [];

        for (const key in this.alarmInfo) {
            const alarmCCTV = this.alarmInfo[key];
            const alarm = alarmCCTV[1];
            const sensorZoneHistoryID = alarm?.sensorZoneHistoryID;

            if (!sensorZoneHistoryID) {
                continue;
            }

            let find = false;

            for (const sensorAlarm of sensorAlarms) {
                if (sensorAlarm.sensorZoneHistoryID === sensorZoneHistoryID) {
                    find = sensorAlarm.isAlarm;
                    break;
                }
            }

            if (find === false) {
                // 창을 닫을 때 alarmInfo 지우도록 수정
                //deleteAlarms.push(alarm.guid);
                //delete this.alarmInfo[key];
                deleteAlarms.push({ guid: alarm.guid, key: key });
            }
        }

        // 경기도를 위한 로직
        if (wsManager) {
            let userInfo = null;

            for (const pair of deleteAlarms) {
                if (!userInfo) {
                    userInfo = ProjectResource.getUserInfo();

                    if (!userInfo) {
                        return;
                    }
                }

                delete this.alarmInfo[pair.key];

                wsManager.closeCCTV(pair.guid, userInfo.id);
            }
        }
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
                    //returnAlarm.push(targetAlarms[i]);
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
                                    // alarms : org alarm
                                    // targetAlarms: new alarm
                                    //if (targetAlarms[i].isAlarm) {
                                        // 같은 Equipzone에 알람이 추가됐나 ?
                                        // 같은 Equipzone에 alarmSensorZoneIDs 값에 변동이 있다 체크로 수정 - 2023.02.15 K.D.R
                                    if (targetAlarms.length - 1 >= j &&
                                        //alarms[j].alarmSensorZoneIDs.length < targetAlarms[i].alarmSensorZoneIDs.length
                                        (alarms[j].alarmSensorZoneIDs.length != targetAlarms[i].alarmSensorZoneIDs.length ||
                                        alarms[j].alarmDepth != targetAlarms[i].alarmDepth)) {
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
        const moveToOption = (this.state.commonSettings?.MoveDisplayAlarm) ? this.state.commonSettings.MoveDisplayAlarm : SettingResource.moveDisplayAlarm.lastAlarm;
        let moveToSensor = new Array();

        for (let k = 0; k < returnAlarm.length; k++) {
            for (let i = 0; i < returnAlarm[k].alarmSensorZoneIDs.length; i++) {
                //const [orgSensorID, isAlarmStatus] = await SDMSController.getOrgSensorID(returnAlarm[k].alarmSensorZoneIDs[i]);

                const sensorZoneID = returnAlarm[k].alarmSensorZoneIDs[i];
                if (sensorZoneID < 1000000) {

                    let nOrgSensorID = -1;

                    if (SDMSResource.isSVMSSensorType(returnAlarm[k].facilityType) ||
                        SDMSResource.isBeaconSensorType(returnAlarm[k].facilityType)) {
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
                        // targetCCTVMenu 가 해당 알람과 일치 하지 않음 - 2023.02.13 K.D.R
                        const alarmType = this.getAlarmTypeFromMessage(returnAlarm[k].message);
                        const _targetCCTVMenu = this.showAlarmCCTV(alarmType, returnAlarm[k]);
                        //this.addAlarm(returnAlarm[k].zoneID, returnAlarm[k].facilityType, nOrgSensorID, returnAlarm[k].alarmDepth, returnAlarm[k].equipZoneID, targetCCTVMenu);
                        await this.addAlarm(returnAlarm[k].zoneID, returnAlarm[k].facilityType, nOrgSensorID, returnAlarm[k].alarmDepth, returnAlarm[k].equipZoneID, _targetCCTVMenu, returnAlarm[k].sensorZoneHistoryID, returnAlarm[k].dtTime);
                        //}


                        if (moveToOption === SettingResource.moveDisplayAlarm.currentDisplay) {

                        }
                        else if (moveToOption === SettingResource.moveDisplayAlarm.moveAlarm) {
                            moveToSensor.push(returnAlarm[k]);
                        }
                        else if (moveToOption === SettingResource.moveDisplayAlarm.firstAlarm) {
                            if (k === 0) {
                                let moveSensor = returnAlarm[k];
                                let chk = null;

                                // 이미 같은 센서존이 있다면 제외
                                if (moveToSensor.length > 0) {
                                    chk = moveToSensor.find(x => x.sensorZoneID === moveSensor.sensorZoneID);
                                    
                                    if (chk === null)
                                        moveToSensor.push(returnAlarm[k]);
                                }
                                else {
                                    moveToSensor.push(returnAlarm[k]);
                                }
                            }
                        }
                        else if (moveToOption === SettingResource.moveDisplayAlarm.lastAlarm) {
                            if (k == returnAlarm.length - 1) {
                                let moveSensor = returnAlarm[k];
                                let chk = null;

                                // 이미 같은 센서존이 있다면 제외
                                if (moveToSensor.length > 0) {
                                    chk = moveToSensor.find(x => x.sensorZoneID === moveSensor.sensorZoneID);

                                    if (chk === null)
                                        moveToSensor.push(returnAlarm[k]);
                                }
                                else {
                                    moveToSensor.push(returnAlarm[k]);
                                }
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

                        if (SDMSResource.isSVMSSensorType(moveToSensor[i].facilityType) ||
                            SDMSResource.isBeaconSensorType(moveToSensor[i].facilityType)) {
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

                        this.processMenu(SDMSMainMenu.Menu_Show_Alarm, [moveToSensor[i].zoneID, SDMS.getFacilityType(moveToSensor[i].facilityType), nOrgSensorID, moveToSensor[i].sensorZoneHistoryID, moveToSensor[i].alarmDepth, moveToSensor[i].isAlarm]);
                        //this.moveToSensor(moveToSensor[i].zoneID, moveToSensor[i].facilityType, nOrgSensorID);


                        // targetCCTVMenu 가 해당 알람과 일치 하지 않음. - 2023.02.13 K.D.R
                        const alarmType = this.getAlarmTypeFromMessage(moveToSensor[i].message);
                        const _targetCCTVMenu = this.showAlarmCCTV(alarmType, moveToSensor[i]);
                        //this.addAlarm(moveToSensor[i].zoneID, moveToSensor[i].facilityType, nOrgSensorID, moveToSensor[i].alarmDepth, moveToSensor[i].equipZoneID, targetCCTVMenu);
                        await this.addAlarm(moveToSensor[i].zoneID, moveToSensor[i].facilityType, nOrgSensorID, moveToSensor[i].alarmDepth, moveToSensor[i].equipZoneID, _targetCCTVMenu, moveToSensor[i].sensorZoneHistoryID, moveToSensor[i].dtTime);
                    }
                    else {
                        // 수동신고
                        this.setState({ alarmSound: true });
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
        else if (SDMSResource.isFireSensorType(facilityType)) {
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
        else if (SDMSResource.isEarthquakeSensorType(facilityType)) {
            if (this.state.sensorList.earthquakeSensors) {
                const sensorLength = this.state.sensorList.earthquakeSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.earthquakeSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isStrongWindSensorType(facilityType)) {
            if (this.state.sensorList.strongWindSensors) {
                const sensorLength = this.state.sensorList.strongWindSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.strongWindSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isEnvironmentSensorType(facilityType)) {
            if (this.state.sensorList.environmentSensors) {
                const sensorLength = this.state.sensorList.environmentSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.environmentSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isManufactureSensorType(facilityType)) {
            if (this.state.sensorList.manufactureSensors) {
                const sensorLength = this.state.sensorList.manufactureSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.manufactureSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isEmergencyBellSensorType(facilityType)) {
            if (this.state.sensorList.emergencyBellSensors) {
                const sensorLength = this.state.sensorList.emergencyBellSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.emergencyBellSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isLaserSensorType(facilityType)) {
            if (this.state.sensorList.laserSensors) {
                const sensorLength = this.state.sensorList.laserSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.laserSensors[i];
                    if (sensor.sensorZoneID === sensorZoneID) {
                        return sensor;
                    }
                }
            }
        }
        else if (SDMSResource.isDoorSensorType(facilityType)) {
            if (this.state.sensorList.doorSensors) {
                const sensorLength = this.state.sensorList.doorSensors.length;
                for (let i = 0; i < sensorLength; i++) {
                    const sensor = this.state.sensorList.doorSensors[i];
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
            this.showConfirmDialog(i18n.t('sdms.formText.알람 종료'), [ProjectResource.SiteID != ProjectResource.Site.Magog ? i18n.t('sdms.formText.수동 신고한 상황을 종료할까요?') : "상황을 종료할까요?"], [i18n.t('sdms.formText.종료'), i18n.t('common.취소')], this.onClickMalfunction);
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
        let zoneIcons = {};

        // 경기도청 
        if (ProjectResource.siteID === null) {
            await ProjectResource.loadSiteID();
        }
        if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_H) {
            const userInfo = await ProjectResource.initUserInfo();

            if (ProjectResource.siteID === ProjectResource.Site.GG_A && userInfo?.siteID === ProjectResource.Site.GG_A) {
                // 통합방재실 > 모든 공간
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A);
                siteIDs.push(ProjectResource.Site.GG_B);
                siteIDs.push(ProjectResource.Site.GG_C);
                siteIDs.push(ProjectResource.Site.GG_D);
                siteIDs.push(ProjectResource.Site.GG_E);
                siteIDs.push(ProjectResource.Site.GG_F);
                siteIDs.push(ProjectResource.Site.GG_G);
                siteIDs.push(ProjectResource.Site.GG_H);
            }
            else {
                // 그 외 > 공통으로 사용하는 지하층만 포함
                siteIDs = [];
                //siteIDs.push(ProjectResource.Site.GG_A); // 지하층

                if (userInfo) {
                    siteIDs.push(userInfo.siteID);
                }
            }

            const exitInfo = await GghController.requestExitList();

            if (exitInfo?.success) {
                zoneIcons[SDMSMainMenu.Exit] = exitInfo.floorInfos;
            }

            const doorInfo = await GghController.requestAllDoors();

            if (doorInfo?.success) {
                zoneIcons[SDMSMainMenu.Door_Sensor] = doorInfo.floorInfos;
            }
        }
        else if (ProjectResource.siteID === ProjectResource.Site.Magog) {
            const doorInfo = await SDMSController.requestAllDoors();

            if (doorInfo?.success) {
                zoneIcons[SDMSMainMenu.Door_Sensor] = doorInfo.floorInfos;
            }
        }

        const [result, message] = await SDMSController.requestSensorList(siteIDs);
        const facilityInfos = await SDMSController.requestAllFacilityInfo();

        if (result === null) {
            console.log(message);
            this.setState({ facilityInfos: facilityInfos, zoneIcons });
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
            if (result.earthquakeSensors) {
                sensorList['earthquakeSensors'] = result.earthquakeSensors;
            }
            if (result.strongWindSensors) {
                sensorList['strongWindSensors'] = result.strongWindSensors;
            }
            if (result.environmentSensors) {
                sensorList['environmentSensors'] = result.environmentSensors;
            }
            if (result.manufactureSensors) {
                sensorList['manufactureSensors'] = result.manufactureSensors;
            }
            if (result.emergencyBellSensors) {
                sensorList['emergencyBellSensors'] = result.emergencyBellSensors;
            }
            if (result.laserSensors) {
                sensorList['laserSensors'] = result.laserSensors;
            }
            if (result.doorSensors) {
                sensorList['doorSensors'] = result.doorSensors;
            }
            if (result.speedDetectionSensors) {
                sensorList['speedDetectionSensors'] = result.speedDetectionSensors;
            }

            this.setState({ sensorList: sensorList, facilityInfos: facilityInfos, zoneIcons });
            await this.set3DOptions(sensorList);
            
        }
    }

    async set3DOptions(sensorList) {
        let siteIDs = null;
        const userInfo = await ProjectResource.initUserInfo();
        if ((userInfo?.levelID !== AccountResource.accountLevelID.master
            && userInfo?.levelID !== AccountResource.accountLevelID.wonikCEO
            && userInfo?.levelID !== AccountResource.accountLevelID.wonikSafety
            && userInfo?.levelID !== AccountResource.accountLevelID.wonikSafeAdmin)
            && userInfo?.siteID) {
            siteIDs = [userInfo.siteID];
        }

        // 경기도청 
        if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_H) {
            if (ProjectResource.siteID === ProjectResource.Site.GG_A && userInfo?.siteID === ProjectResource.Site.GG_A) {
                // 통합방재실 > 모든 공간
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A);
                siteIDs.push(ProjectResource.Site.GG_B);
                siteIDs.push(ProjectResource.Site.GG_C);
                siteIDs.push(ProjectResource.Site.GG_D);
                siteIDs.push(ProjectResource.Site.GG_E);
                siteIDs.push(ProjectResource.Site.GG_F);
                siteIDs.push(ProjectResource.Site.GG_G);
                siteIDs.push(ProjectResource.Site.GG_H);
            }
            else {
                // 그 외 > 공통으로 사용하는 지하층만 포함
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A); // 지하층
                siteIDs.push(userInfo.siteID);
            }
        }

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

        if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_H) {
            const siteID = ProjectResource.siteID === ProjectResource.Site.GG_A ? null : ProjectResource.siteID;
            await this.setFirstAidEquipments(site3dOptions, siteID);
        }

        this.setState({ loading: false, site3dOptions: site3dOptions, currentSiteID: firstSiteID, _3dOptions: first3DOptions, buildingGroupList, viewMode: userInfo?.options?.viewMode });
        //this.setState({ loading: false, _3dOptions, buildingGroupList });


        // 타이틀바 siteID 선택 
        // 이미 다른 곳에서 this.titleBarSiteID를 초기화하고 있기 때문에 해당 부분 주석처리 (한봄희 2025-03-28)
        // const _firstSiteID = parseInt(firstSiteID);
        // if (_firstSiteID !== NaN) {
        //     this.titleBarSiteID = _firstSiteID;
        // }
    }

    // 구급장비
    async setFirstAidEquipments(site3dOptions, siteID) {
        const [equipments, success, message] = await GghController.requestFirstAidEquipmentList(siteID);

        if (success) {
            this.setFirstAidEquipmentList(equipments.cardiacs, site3dOptions, SDMSMainMenu.Cardiac);
            this.setFirstAidEquipmentList(equipments.descendingLifeLines, site3dOptions, SDMSMainMenu.Rescue);
            this.setFirstAidEquipmentList(equipments.safetyEquipments, site3dOptions, SDMSMainMenu.Life);
        }
        else {
            console.log(message);
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
            const fireSensors = sensorList['fireSensors'];
            const psmSensors = sensorList['psmSensors'];
            const etcSensors = sensorList['etcSensors'];
            const cctvs = sensorList['cctvs'];
            const earthquakeSensors = sensorList['earthquakeSensors'];
            const strongWindSensors = sensorList['strongWindSensors'];
            const environmentSensors = sensorList['environmentSensors'];
            const manufactureSensors = sensorList['manufactureSensors'];
            const emergencyBellSensors = sensorList['emergencyBellSensors'];
            const speedDetectionSensors = sensorList['speedDetectionSensors'];

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
            if (earthquakeSensors) {
                this.setEarthquakeSensors(earthquakeSensors, site3dOptions);
            }
            if (strongWindSensors) {
                this.setStrongWindSensors(strongWindSensors, site3dOptions);
            }
            if (environmentSensors) {
                this.setEnvironmentSensors(environmentSensors, site3dOptions);
            }
            if (manufactureSensors) {
                this.setManufactureSensors(manufactureSensors, site3dOptions);
            }
            if (emergencyBellSensors) {
                this.setEmergencyBellSensors(emergencyBellSensors, site3dOptions);
            }
            if (speedDetectionSensors) {
                this.setSpeedDetectionSensors(speedDetectionSensors, site3dOptions);
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

            if (zone) {
                if (!zone.sensors.etc) {
                    zone.sensors.etc = [];
                }

                zone.sensors.etc.push(sensor);
            }
        }
    }

    setEarthquakeSensors(earthquakeSensors, site3dOptions) {
        const sensorCount = earthquakeSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = earthquakeSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.earthquake) {
                    zone.sensors.earthquake = [];
                }

                zone.sensors.earthquake.push(sensor);
            }
        }
    }

    setStrongWindSensors(strongWindSensors, site3dOptions) {
        const sensorCount = strongWindSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = strongWindSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.strongWind) {
                    zone.sensors.strongWind = [];
                }

                zone.sensors.strongWind.push(sensor);
            }
        }
    }

    setEnvironmentSensors(environmentSensors, site3dOptions) {
        const sensorCount = environmentSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = environmentSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.environment) {
                    zone.sensors.environment = [];
                }

                zone.sensors.environment.push(sensor);
            }
        }
    }

    setManufactureSensors(manufactureSensors, site3dOptions) {
        const sensorCount = manufactureSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = manufactureSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.manufacture) {
                    zone.sensors.manufacture = [];
                }

                zone.sensors.manufacture.push(sensor);
            }
        }
    }

    setSpeedDetectionSensors(speedDetectionSensors, site3dOptions) {
        const sensorCount = speedDetectionSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = speedDetectionSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.speedDetection) {
                    zone.sensors.speedDetection = [];
                }

                zone.sensors.speedDetection.push(sensor);
            }
        }
    }

    setEmergencyBellSensors(emergencyBellSensors, site3dOptions) {
        const sensorCount = emergencyBellSensors.length;

        for (let i = 0; i < sensorCount; i++) {
            const sensor = emergencyBellSensors[i];
            const zone = this.getZone(site3dOptions, sensor.zoneID);

            if (zone) {
                if (!zone.sensors.emergencyBell) {
                    zone.sensors.emergencyBell = [];
                }

                zone.sensors.emergencyBell.push(sensor);
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

    setFirstAidEquipmentList(equipments, site3dOptions, name) {
        const count = equipments.length;

        for (let i = 0; i < count; i++) {
            const equipment = equipments[i];
            const zone = this.getZone(site3dOptions, equipment.zoneID);

            if (zone) {
                if (!zone.sensors[name]) {
                    zone.sensors[name] = [];
                }

                zone.sensors[name].push(equipment);
            }
        }
    }

    // 심장제세동기
    setCardiacs(cardiacs, site3dOptions) {
        const count = cardiacs.length;

        for (let i = 0; i < count; i++) {
            const equipment = cardiacs[i];
            const zone = this.getZone(site3dOptions, equipment.zoneID);

            if (zone) {
                if (!zone.sensors.cardiacs) {
                    zone.sensors.cardiacs = [];
                }

                zone.sensors.cardiacs.push(equipment);
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
            menu === SDMSResource.menu.대시보드 ||
            menu === SDMSResource.menu.CCTV_영상정보 ||
            menu === SDMSResource.menu.전체_CCTV ||
            menu === SDMSResource.menu.알람_CCTV_1 ||
            menu === SDMSResource.menu.알람_CCTV_2 ||
            menu === SDMSResource.menu.알람_CCTV_3 ||
            menu === SDMSResource.menu.이벤트_정보 ||
            menu === SDMSResource.menu.미니맵 ||
            menu === SDMSResource.menu.인원현황 || /* 0929 */
            menu === SDMSResource.menu.작업일지 ||
            menu === SDMSResource.menu.센서현황 ||
            menu === SDMSResource.menu.기상정보 ||            
            menu === SDMSResource.menu.이력데이터 ||
            menu === SDMSResource.menu.이상_탐지 ||
            menu === SDMSResource.menu.시뮬레이션 ||
            menu === SDMSResource.menu.위험도_분석 ||
            menu === SDMSResource.menu.집수정) {
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
                    selectedStatusInfo.earthquakeSensors = false;
                    selectedStatusInfo.strongWindSensors = false;
                    selectedStatusInfo.environmentSensors = false;
                    selectedStatusInfo.manufactureSensors = false;
                    selectedStatusInfo.emergencyBellSensors = false;
                    selectedStatusInfo.laser = false;
                    selectedStatusInfo.door = false;
                    selectedStatusInfo.cctvGroups = true;
                    selectedStatusInfo.cctvSubGroups = true;
                    selectedStatusInfo.facilityGroups = false;
                    selectedStatusInfo.facilitySubGroups = false;
                }
                else {
                    selectedStatusInfo.sensorGroups = true;
                    if (sensorType === 'fire') {
                        selectedStatusInfo.fireSensors = true;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.manufactureSensors = false;
                        selectedStatusInfo.emergencyBellSensors = false;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'psm') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = true;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.manufactureSensors = false;
                        selectedStatusInfo.emergencyBellSensors = false;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'etc') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = true;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.manufactureSensors = false;
                        selectedStatusInfo.emergencyBellSensors = false;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'earthquake') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = true;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.manufactureSensors = false;
                        selectedStatusInfo.emergencyBellSensors = false;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'strongWind') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = true;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.manufactureSensors = false;
                        selectedStatusInfo.emergencyBellSensors = false;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'environment') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = true;
                        selectedStatusInfo.manufactureSensors = false;
                        selectedStatusInfo.emergencyBellSensors = false;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'manufacture') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.manufactureSensors = true;
                        selectedStatusInfo.emergencyBellSensors = false;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'emergencyBell') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.manufactureSensors = false;
                        selectedStatusInfo.emergencyBellSensors = true;
                        selectedStatusInfo.laser = false;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'laser') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.laser = true;
                        selectedStatusInfo.door = false;
                    }
                    else if (sensorType === 'door') {
                        selectedStatusInfo.fireSensors = false;
                        selectedStatusInfo.psmSensors = false;
                        selectedStatusInfo.etcSensors = false;
                        selectedStatusInfo.earthquakeSensors = false;
                        selectedStatusInfo.strongWindSensors = false;
                        selectedStatusInfo.environmentSensors = false;
                        selectedStatusInfo.door = true;
                        selectedStatusInfo.laser = false;
                    }
                    selectedStatusInfo.cctvGroups = false;
                    selectedStatusInfo.cctvSubGroups = false;
                    selectedStatusInfo.facilityGroups = false;
                    selectedStatusInfo.facilitySubGroups = false;
                }

                this.setState({ selectedStatusInfo });
            }

            this.setState({ selectedPOI: [poi, updateDB] });
        }
        else {
            if (this.state.selectedPOI !== null) {
                this.setState({ selectedPOI: null });
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

        // equipZoneID null 아닐 경우 history 쓰고 있다면 열리도록 수정
        // .TODO: history 사용여부 판단
        if (equipZoneID !== null && this.useEquipZoneAssess()) {
            menus[SDMS.menu.historyData] = true;
        }
        
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
            SettingsStore.dispatch({ type: 'IS_EDIT_MODE', isEditMode: false });
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
        else if (SDMSResource.isEarthquakeSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Earthquake_Sensor;
        }
        else if (SDMSResource.isStrongWindSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Strongwind_Sensor;
        }
        else if (SDMSResource.isBlackOutSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Blackout_Sensor;
        }
        else if (SDMSResource.isEnvironmentSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Environment_Sensor;
        }
        else if (SDMSResource.isManufactureSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Manufacture_Sensor;
        }
        else if (SDMSResource.isEmergencyBellSensorType(facilityType)) {
            sensorType = SDMSMainMenu.Emergency_Sensor;
        }

        return sensorType;
    }

    async addAlarm(zoneID, facilityType, orgSensorID, alarmDepth, equipZoneID, targetCCTVMenu, sensorZoneHistoryID, alarmTime = null) {
        var sensorType = SDMS.getFacilityType(facilityType);
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID
        
        this.onSelectMenu(SDMSMainMenu.Menu_Add_Alarm, [zoneID, sensorType, orgSensorID, sensorZoneHistoryID, alarmDepth, alarmTime]);

        if (SDMSResource.isSVMSSensorType(facilityType)) {
            alarmCCTVID = orgSensorID;
        }

        await this.getEquipZoneCCTV(equipZoneID, targetCCTVMenu, alarmCCTVID, facilityType);
    }

    moveToSensor(zoneID, facilityType, orgSensorID) {
        var sensorType = SDMS.getFacilityType(facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_MoveTo_POI, [zoneID, sensorType, orgSensorID]);
    }

    async showAlarm(alarm, targetCCTVMenu) {
        let alarmCCTVID = null;     // SVMS 알람 시 해당 CCTV ID

        const [zoneID, sensorType, orgSensorID, alarmDepth, isAlarm] = SDMS.getAlarmInfo(alarm);

        if (SDMSResource.isSVMSSensorType(alarm.facilityType)) 
            alarmCCTVID = alarm.orgSensorID;        

        await this.getEquipZoneCCTV(alarm.equipZoneID, targetCCTVMenu, alarmCCTVID, alarm.facilityType);
        this.onSelectMenu(SDMSMainMenu.Menu_Show_Alarm, [zoneID, sensorType, orgSensorID, alarm.sensorZoneHistoryID, alarmDepth, isAlarm]);
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

        if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
            alarm.newCheck = true;
        }

        this.setState({ selectedAlarm: alarm });
    }

    // 선택된 알람으로 3D 이동
    onMoveSelectedAlarm = () => {
        const selectedAlarm = this.state.selectedAlarm;

        if (selectedAlarm) {
            // 정전신호는 센서가 따로 없기에 CCTV를 따로 띄우지 않도록 추가 설정 
            if (selectedAlarm.sensorZoneID < 1000000 && selectedAlarm.orgSensorID) {
                const alarmType = this.getAlarmTypeFromMessage(selectedAlarm.message);
                const alarmCCTV = this.showAlarmCCTV(alarmType, selectedAlarm);

                // 비콘 알람이라면 인원정보 띄우기
                const workerDetailInfo = this.getAlarmBeaconInfo(selectedAlarm);
                if (workerDetailInfo) {
                    let menus = this.state.visiblePopups;
                    menus[SDMS.menu.workerDetailInfo] = true;
                    this.state.workerDetailInfo = workerDetailInfo;
                } 

                this.showAlarm(selectedAlarm, alarmCCTV);
            }
            else {
                this.showAlarm(selectedAlarm, null);
            }

            // (마곡) 화재 알람 화면전환 시 출입통제 Popup Open
            if (selectedAlarm.facilityType === SDMSResource.facilityType.FIRE &&
                selectedAlarm.siteID === ProjectResource.Site.Magog &&
                !this.state.visiblePopups[SDMS.menu.accessControl]) {
                    const haveClosedDoors = this.getClosedDoorsStatus(this.state.closedDoorDatas);
                    this.setVisiblePopups(SDMS.menu.accessControl, haveClosedDoors ? true : false);
                }
            
            // (경기) 화재 알람 화면전환 시 출입통제 Popup Open
            if (selectedAlarm.facilityType === SDMSResource.facilityType.FIRE &&
                (selectedAlarm.siteID === ProjectResource.Site.GG_B || 
                selectedAlarm.siteID === ProjectResource.Site.GG_D ||
                selectedAlarm.siteID === ProjectResource.Site.GG_F) &&
                !this.state.visiblePopups[SDMS.menu.accessControl] &&
                selectedAlarm.isAlarm) {
                    setTimeout(() => {
                        const haveClosedDoors = this.getClosedDoorsStatus(this.state.closedDoorDatas);
                        this.setVisiblePopups(SDMS.menu.accessControl, haveClosedDoors ? true : false);
                    }, 5000);
                }
            
            // (경기) 침수 알람 화면전환 시 집수정 Popup Open
            if (selectedAlarm.facilityType === SDMSResource.facilityType.WaterLevel &&
                (selectedAlarm.siteID === ProjectResource.Site.GG_B || 
                selectedAlarm.siteID === ProjectResource.Site.GG_D ||
                selectedAlarm.siteID === ProjectResource.Site.GG_F) &&
                !this.state.visiblePopups[SDMS.menu.waterLevelInfo]) {
                    this.setVisiblePopups(SDMS.menu.waterLevelInfo, true);
                }
            
            // (경기) 정전, UPS 알람 화면전환 시 전력랑 정보 Popup Open
            if ((selectedAlarm.facilityType === SDMSResource.facilityType.BLACKOUT ||
                selectedAlarm.facilityType === SDMSResource.facilityType.LowBattery) &&
                (selectedAlarm.siteID === ProjectResource.Site.GG_B || 
                selectedAlarm.siteID === ProjectResource.Site.GG_D ||
                selectedAlarm.siteID === ProjectResource.Site.GG_F) &&
                !this.state.visiblePopups[SDMS.menu.electricInfo]) {
                    this.setVisiblePopups(SDMS.menu.electricInfo, true);
                }
        }
    }

    static getAlarmInfo(alarm) {
        var sensorType = SDMS.getFacilityType(alarm.facilityType);
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

        // 솔브레인 iot 같은 경우 psm, etc 포함
        if (typeName === "iot") {
            types[SDMSMainMenu.PSM_Sensor] = visible;
            types[SDMSMainMenu.Etc_Sensor] = visible;
        } else
            types[typeName] = visible;
        
        this.setState({ visibleSensorTypes: types });
    }

    setVisiblePopups(menu, visible) {

        if (!visible && menu === SDMS.menu.elevatorInfo) {
            SDMSController.stopWatchTimer();
        }

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
                
                if (menu === SDMS.menu.allCCTV || menu === SDMS.menu.cctv || menu === SDMS.menu.alarmCCTV1 ||
                    menu === SDMS.menu.alarmCCTV2 || menu === SDMS.menu.alarmCCTV3) {
                    // CCTV 뷰어 열기 이벤트일 경우
                    this.setCCTVPopups(menu, menus);
                }
                else if (menu === SDMS.menu.safetyAreaAssessment && ProjectResource.SiteID === ProjectResource.Site.Wonik) {
                    // 원익 경우 안전평가 메뉴 버튼을 클릭 시 
                    // 안전구역 평가 및 이력 팝업창 둘다 열고 닫는다.
                    menus[SDMS.menu.historyData] = !menus[menu];
                    menus[menu] = !menus[menu];                   
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
            // console.log(SDMS.menu.allCCTV + ": " + menus[SDMS.menu.allCCTV], SDMS.menu.alarmCCTV1 + ": " + menus[SDMS.menu.alarmCCTV1]);
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
                    else if (key === SDMS.menu.workerPath) {
                        hideID = "#" + SDMSResource.popupLayer.workerPath;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.workerPath); /* 0929 */
                    }
                    else if (key === SDMS.menu.workerInfoSB) {
                        hideID = "#" + SDMSResource.popupLayer.workerInfoSB;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.workerInfoSB);
                    }
                    else if (key === SDMS.menu.sensorStatus) {
                        hideID = "#" + SDMSResource.popupLayer.sensorStatus;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.sensorStatus); /* 0929 */
                    }
                    else if (key === SDMS.menu.workerStatus) {
                        hideID = "#" + SDMSResource.popupLayer.workerStatus;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.workerStatus); 
                    }
                    else if (key === SDMS.menu.safetyAreaAssessment) {
                        hideID = "#" + SDMSResource.popupLayer.safetyAreaAssessment;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.safetyAreaAssessment); 
                    }
                    else if (key === SDMS.menu.historyData) {
                        hideID = "#" + SDMSResource.popupLayer.historyData;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.historyData);
                    }
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
                    else if (key === SDMS.menu.changeSensorName) {
                        hideID = "#" + SDMSResource.popupLayer.changeSensorName;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.changeSensorName);
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

    checkPopupStatus = (siteID) => {
        // 경기에서 selectSiteID가 변경될 때
        // 변경된 입주기관에서 취급하지 않는 기능에 대한 팝업은 전부 닫히도록 함.
        const menus = this.state.visiblePopups;
    
        const closeMenus = (menuKeys) => {
            menuKeys.forEach((menuKey) => {
                if (menus[menuKey]) {
                    this.setVisiblePopups(menuKey, false);
                }
            });
        };
    
        const sharedMenus = [
            SDMS.menu.waterLevelInfo,
            SDMS.menu.electricInfo,
            SDMS.menu.earthquakeInfo,
            SDMS.menu.elevatorInfo,
            SDMS.menu.accessControl,
        ];
    
        if (![ProjectResource.Site.GG_B, ProjectResource.Site.GG_D, ProjectResource.Site.GG_F].includes(siteID) || this.state.selectSiteID !== ProjectResource.Site.GG_A) {
            // 집수정, 전력, 지진, 엘리베이터, 출입통제 메뉴 닫기
            GghController.stopWatchTimerUpsStatus();
            closeMenus(sharedMenus);
        }
    
        if (siteID !== ProjectResource.Site.GG_A) {
            // 주차관제 메뉴 닫기
            closeMenus([SDMS.menu.parkingInfo]);
        }
    };

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
        
        if (sensorType === SDMSMainMenu.PSM_Sensor) {
            const rangeSensors = this.state.rangeSensors?.rangePsmSensors?.length > 0 ? this.state.rangeSensors?.rangePsmSensors : [];

            for (const sensor of rangeSensors) {
                if (sensor.id.toString() === sensorID.toString()) {
                    return sensor;
                }
            }
        } else if (sensorType === SDMSMainMenu.Etc_Sensor) {
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

    onSelectSensorPOI = (sensorID, sensorType, poi, poiManager, isAlarm) => {
        const isEditMode = false;

        if (!isEditMode) {
            const sensor = this.getRangeSensor(sensorID, sensorType);

            if (sensor) {
                let selectedSensors = [...this.state.selectedRangeSensors];
                //let contains = true;

                if (isAlarm !== true) {

                    if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
                        selectedSensors = [];

                        // 솔브레인 경우 하나의 디바이스에 여러 센서정보가 묶여있어 함께 불어와야 한다.
                        const sensors = this.getDeviceSensors(sensor);
                        if (sensors) {
                            for (const _sensor of sensors) {
                                // 해당 디바이스 센서만 표시
                                //if (selectedSensors) {
                                //    const rangeSensor = selectedSensors.find(x => x.id === _sensor.id && x.sensorTypeID === _sensor.sensorTypeID)
                                //    if (rangeSensor === null || rangeSensor === undefined) {
                                //        selectedSensors.unshift(_sensor);
                                //    }
                                //} else {
                                //    selectedSensors.unshift(_sensor);
                                //}
                                selectedSensors.unshift(_sensor);
                            }
                        }
                    }

                    // 선택된 센서 추가
                    if (selectedSensors) {
                        const _sensor = selectedSensors.find(x => x.id === sensor.id && x.sensorTypeID === sensor.sensorTypeID)
                        if (_sensor === null || _sensor === undefined) {
                            selectedSensors.unshift(sensor);
                        }
                    } else {
                        selectedSensors.unshift(sensor);
                    }

                }

                // 수치UI 옵션화
                const visiblePopups = { ...this.state.visiblePopups };
                if (this.useSensorList())
                    visiblePopups[SDMS.menu.sensorStatus] = true;

                if (isAlarm === true) {
                    this.state.alarmRangeSensor = sensor;
                } else {
                    this.state.selectedRangeSensors = selectedSensors;
                    this.state.alarmRangeSensor = null;
                }

                this.setState({ visiblePopups });
            }
            else if (sensorType === SDMSMainMenu.SpeedDetection) {
                // 과속감지 센서 POI 선택 시 
                const visiblePopups = { ...this.state.visiblePopups };

                visiblePopups[SDMS.menu.speedingHistory] = true;
                this.setState({ visiblePopups });
            }
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

        if (ProjectResource.SiteID === ProjectResource.Site.GG_A && screenXY) {
            this.setState({ screenXY });
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

        const menus = this.state.visiblePopups;

        if (arrInfo) {
            //menus[SDMS.menu.statusInfo] = true;
            menus[SDMS.menu.buildingInfo] = true;
        } else {
            menus[SDMS.menu.buildingInfo] = false;
        }

        this.setState({ buildingInfo: arrInfo, visiblePopups: menus });
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

    async initDashboardSensors() {
        const [result, message] = await DashboardController.requestUseSensor();

        if (result !== null && result !== undefined) {
            this.setState({ dashboardSensors: result });
        }
    }

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

            if (data.UseFire?.toLowerCase() === "true")
                sensorTypes.UseFire = true;
            if (data.UsePSM?.toLowerCase() === "true")
                sensorTypes.UsePSM = true;
            if (data.UseETC?.toLowerCase() === "true")
                sensorTypes.UseETC = true;
            if (data.UseSVMS?.toLowerCase() === "true")
                sensorTypes.UseSVMS = true;
            if (data.UseEarthquake?.toLowerCase() === "true")
                sensorTypes.UseEarthquake = true;
            if (data.UseStrongWind?.toLowerCase() === "true")
                sensorTypes.UseStrongWind = true;
            if (data.UseBlackOut?.toLowerCase() === "true")
                sensorTypes.UseBlackOut = true;
            if (data.UseBecon?.toLowerCase() === "true")
                sensorTypes.UseBecon = true;
            if (data.UseEnvironment?.toLowerCase() === "true")
                sensorTypes.UseEnvironment = true;
            if (data.UseManufacture?.toLowerCase() === "true")
                sensorTypes.UseManufacture = true;
            if (data.UseEmergencyBell?.toLowerCase() === "true")
                sensorTypes.UseEmergencyBell = true;
            if (data.UseParkingBreaker?.toLowerCase() === "true")
                sensorTypes.UseParkingBreaker = true;
            if (data.UseLaser?.toLowerCase() === "true")
                sensorTypes.UseLaser = true;
            if (data.UseDoor?.toLowerCase() === "true")
                sensorTypes.UseDoor = true;
            if (data.UseLifeSaving?.toLowerCase() === "true")
                sensorTypes.UseLifeSaving = true;
            if (data.UseCardiacDefibrillator?.toLowerCase() === "true")
                sensorTypes.UseCardiacDefibrillator = true;
            if (data.UseRescueTeam?.toLowerCase() === "true")
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

    changeSelectSiteID = (siteID) => {
        const _siteID = parseInt(siteID);
        if (_siteID === NaN)
            return;
        
        if (_siteID !== this.titleBarSiteID) {
            this.changeSite(_siteID.toString(), true);
        }    

        if(_siteID !== this.state.selectSiteID) {
            if (_siteID >= ProjectResource.Site.GG_A && _siteID <= ProjectResource.Site.GG_H) {
                this.checkPopupStatus(_siteID);
            }

            this.ignoreAlarmTime = Date.now();
            this.setState({ selectSiteID: _siteID });
        }
    }

    reloadSensorList = () => {
        if (ProjectResource.siteID !== ProjectResource.Site.GG_A) {
            return;
        }

        // 환경설정 > 연동 서비스설정 > 센서 설정에서
        // 센서가 비활성화 되면 현황정보 트리에 바로 반영한다.
        this.requestSensorList();
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
        selectedStatusInfo.earthquakeSensors = false;
        selectedStatusInfo.strongWindSensors = false;
        selectedStatusInfo.environmentSensors = false;
        selectedStatusInfo.manufactureSensors = false;
        selectedStatusInfo.emergencyBellSensors = false;
        selectedStatusInfo.laser = false;
        selectedStatusInfo.door = false;
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
        else if (type === SDMS.SelectedStatusInfoType.earthquakeSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.earthquakeSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.strongWindSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.strongWindSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.environmentSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.environmentSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.manufactureSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.manufactureSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.emergencyBellSensors) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.emergencyBellSensors = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.laser) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.laser = true;
        }
        else if (type === SDMS.SelectedStatusInfoType.door) {
            selectedStatusInfo.sensorGroups = true;
            selectedStatusInfo.door = true;
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

                SettingsStore.dispatch({ type: 'SELECT_SITEID', selectSiteID: _siteID });
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

    setPopupUI(visiblePopups) {
        const [sensorType, zoneID, sensorID] = this.getSelectedSensorInfo();
        const multiSite = this.isMultiSite();

        var popups = [];
        if (visiblePopups[SDMS.menu.eventInfo]) {
            const eventProps = {
                sensorAlarms: this.state.sensorAlarms,
                selectedAlarm: this.state.selectedAlarm,
                onSelectedAlarm: this.onSelectedAlarm,
                onMoveSelectedAlarm: this.onMoveSelectedAlarm,
                setVisiblePopups: this.setVisiblePopups,
                setActiveDragPopup: this.setActiveDragPopup,
                zIndex: this.state.popupLayer.eventZIndex,
                popupType: SDMSResource.popupLayer.event,
                popupState: this.state.popupState.event,
                setPopupState: this.setPopupState,
                alarmSound: this.state.alarmSound,
                onSound: this.onSound,
                onMalfunction: this.onMalfunction,
                alarmInfo: this.alarmInfo,
                onAuthorError: this.onAuthorError,
                showConfirmDialog: this.showConfirmDialog,
                closeConfirmDialog: this.closeConfirmDialog,
                buildingGroupList: this.state.buildingGroupList,
                popupStateAlarmMemo: this.state.popupState.alarmMemo,
                zIndexAlarmMemo: this.state.popupLayer.alarmMemoZIndex,
                popupTypeAlarmMemo: SDMSResource.popupLayer.alarmMemo,
                useSensorTypes: this.state.useSensorTypes,
                selectSiteID: this.state.selectSiteID
            };
        
            if (!this.isEditMode() && ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                popups.push(<Event key='sdms_popup_event' {...eventProps} setCurrentAlarms={this.setCurrentAlarms} />);
            } else if (!this.isEditMode() && this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
                popups.push(<Event key='sdms_popup_event' {...eventProps} setCurrentAlarms={this.setCurrentAlarms} />);
            } else {
                visiblePopups[SDMS.menu.eventInfo] = false;
            }
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.statusInfo]) {
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                popups.push(
                    <StatusInfo_gg key='sdms_popup_statusInfo_gg'
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
                        changeSelectSiteID={this.changeSelectSiteID}
                        selectSiteID={this.state.selectSiteID}
                        loading3D={this.state.loading3D}
                    />
                );
            }
            else {
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
                        changeSelectSiteID={this.changeSelectSiteID}
                        selectSiteID={this.state.selectSiteID}
                    />
                );
            }
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
            if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
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
        }
        if ((visiblePopups[SDMS.menu.allCCTV] && visiblePopups[SDMS.menu.cctv] && !this.isEditMode()) ||
            (this.isEditMode() && this.state.editModeCCTV)) {
            const selectedCCTVID = SDMSMainMenu.isCCTVType(sensorType) ? sensorID : null;

            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                popups.push(
                    <CCTVApp_gg
                        key='sdms_popup_cctvApp_gg'
                        cctvList={this.state.cctvList}
                        screenXY={this.state.screenXY}
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
                        getWsManager={this.getWsManager}
                        setCCTVAppGuid={this.setCCTVAppGuid}
                        cctvAppGUID_poi={this.state.cctvAppGUID_poi}
                        setVisiblePopups={this.setVisiblePopups}
                    />
                );
            }
            else {
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
        }

        if (this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                this.showAlarmCCTVApps(popups);
            }
            else {
                this.showAlarmCCTVPopups(visiblePopups, popups);
            }
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
                    dashboardSensors={this.state.dashboardSensors}
                    showConfirmDialog={this.showConfirmDialog}
                    useSensorTypes={this.state.useSensorTypes}
                    selectSiteID={this.state.selectSiteID}
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
        if (!this.isEditMode() && visiblePopups[SDMS.menu.workerPath]) {  /* 0929 */
            popups.push(
                <WorkerPath key='sdms_popup_workerPath'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.workerPathZIndex}
                    popupState={this.state.popupState}
                    setPopupState={this.setPopupState}

                    buildingGroupList={this.state.buildingGroupList}
                    workerInfos={this.state.workerInfos}
                    setWorkerStatusPopup={this.setWorkerStatusPopup}
                    selectedWorkerStatusPopup={this.state.workerStatusPopup}
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
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                popups.push(
                    <EditModeStatusInfo_gg key='sdms_popup_editModeStatusInfo_gg'
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
                        selectSiteID={this.state.selectSiteID}
                    />);
            }
            else {
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
                        selectSiteID={this.state.selectSiteID}
                    />);
            }
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.manualReport]) {
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                popups.push(
                    <ManualReport_gg key='sdms_popup_manualReport_gg'
                        setVisiblePopups={this.setVisiblePopups}
                        buildingGroupList={this.state.buildingGroupList}
                        outdoorZones={this.state._3dOptions.outdoorZones}
                        setActiveDragPopup={this.setActiveDragPopup}
                        zIndex={this.state.popupLayer.manualReportZIndex}
                        popupType={SDMSResource.popupLayer.manualReport}
                        popupState={this.state.popupState.manualReport}
                        setPopupState={this.setPopupState}
                        currentView={this.state.currentView}
                        useSensorTypes={this.state.useSensorTypes}
                        getZoneSiteID={this.getZoneSiteID}
                    />);
            }else{
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
                        useSensorTypes={this.state.useSensorTypes}
                    />);
            }
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.workerDetailInfo]) {
            popups.push(
                <WorkerDetailInfo key='sdms_popup_workerDetailInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.workerDetailInfo}
                    popupType={SDMSResource.popupLayer.workerDetailInfo}
                    popupState={this.state.popupState.workerDetailInfo}
                    setPopupState={this.setPopupState}
                    workerDetailInfo={this.state.workerDetailInfo}
                    setWorkerStatusPopup={this.setWorkerStatusPopup}
                />);
        }
        if (!this.isEditMode() && this.state.workerStatusPopup) {
            popups.push(
                <WorkerStatusPopup
                    key='sdms_popup_workerStatusPopup'
                    equipZoneID={this.state.workerStatusPopup}
                    popupType={SDMSResource.popupLayer.workerStatusPopup}
                    popupState={this.state.popupState.workerStatusPopup}
                    setPopupState={this.setPopupState}
                    setActiveDragPopup={this.setActiveDragPopup}
                    setWorkerStatusPopup={this.setWorkerStatusPopup}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.workerInfoSB]) {
            popups.push(
                <WorkerInfoSB
                    key='sdms_popup_workerInfoSB'
                    setVisiblePopups={this.setVisiblePopups}
                    zIndex={this.state.popupLayer.workerInfoSB}
                    popupType={SDMSResource.popupLayer.workerInfoSB}
                    popupState={this.state.popupState.workerInfoSB}
                    setPopupState={this.setPopupState}
                    setActiveDragPopup={this.setActiveDragPopup}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    moveToX={this.moveToX}
                    onSelectMenu={this.onSelectMenu}
                />);
        }
        if (!this.isEditMode() && visiblePopups[SDMS.menu.safetyAreaAssessment]) {
            popups.push(
                <SafetyAreaAssessment   
                    key='sdms_popup_safetyAreaAssessment'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.safetyAreaAssessmentZIndex}
                    popupType={SDMSResource.popupLayer.safetyAreaAssessment}
                    popupState={this.state.popupState.safetyAreaAssessment}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    currentSiteID={this.state.currentSiteID}
                    currentView={this.state.currentView}
                    buildingGroupList={this.state.buildingGroupList}
                    sensorList={this.state.sensorList}
                    outdoorZones={this.state._3dOptions.outdoorZones}
                    site3dOptions={this.state.site3dOptions}
                />);
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.historyData]) {
            popups.push(
                <HistoryData
                    key='sdms_popup_historyData'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.historyDataZIndex}
                    popupType={SDMSResource.popupLayer.historyData}
                    popupState={this.state.popupState.historyData}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                    currentSiteID={this.state.currentSiteID}
                    currentView={this.state.currentView}
                    buildingGroupList={this.state.buildingGroupList}
                    selectEquipZoneID={this.state.selectEquipZoneID}
                    outdoorZones={this.state._3dOptions.outdoorZones}
                />);
        }

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

        if(!this.isEditMode() && visiblePopups[SDMS.menu.waterLevelInfo]) {
            popups.push(
                <WaterLevelInfo
                    key='sdms_popup_waterLevelInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.waterLevelInfoZIndex}
                    popupType={SDMSResource.popupLayer.waterLevelInfo}
                    popupState={this.state.popupState.waterLevelInfo}
                    setPopupState={this.setPopupState}
                    sensorAlarms={this.state.sensorAlarms}
                    selectedAlarm={this.state.selectedAlarm}
                    selectSiteID={this.state.selectSiteID}
                />
            );
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.elevatorInfo]) {
            popups.push(
                <ElevatorInfo
                    key={'sdms_popup_elevatorInfo_' + this.state.selectSiteID}
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.elevatorInfoZIndex}
                    popupType={SDMSResource.popupLayer.elevatorInfo}
                    popupState={this.state.popupState.elevatorInfo}
                    setPopupState={this.setPopupState}
                    sensorAlarms={this.state.sensorAlarms}
                    selectSiteID={this.state.selectSiteID}
                />
            );
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.accessControl] && 
            (this.state.selectedAlarm?.siteID === ProjectResource.Site.GG_B ||
            this.state.selectedAlarm?.siteID === ProjectResource.Site.GG_D ||
            this.state.selectedAlarm?.siteID === ProjectResource.Site.GG_F || 
            this.state.selectedAlarm?.siteID === ProjectResource.Site.Magog)) {
            popups.push(
                <AccessControl_gg
                    key='sdms_popup_accessControl'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.accessControlZIndex}
                    popupType={SDMSResource.popupLayer.accessControl}
                    popupState={this.state.popupState.accessControl}
                    setPopupState={this.setPopupState}
                    selectedAlarm={this.state.selectedAlarm}
                    closedDoorDatas={this.state.closedDoorDatas}
                    currentView={this.state.currentView}
                    moveToX={this.moveToX}
                    buildingGroupList={this.state.buildingGroupList}
                />
            );
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.parkingInfo]) {
            popups.push(
                <ParkingInfo_gg
                    key='sdms_popup_parkingInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.parkingInfoZIndex}
                    popupType={SDMSResource.popupLayer.parkingInfo}
                    popupState={this.state.popupState.parkingInfo}
                    setPopupState={this.setPopupState}
                />
            );
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.electricInfo]) {
            popups.push(
                <ElectricInfo_gg
                    key='sdms_popup_electricInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.electricInfoZIndex}
                    popupType={SDMSResource.popupLayer.electricInfo}
                    popupState={this.state.popupState.electricInfo}
                    setPopupState={this.setPopupState}
                    selectSiteID={this.state.selectSiteID}
                    sensorAlarms={this.state.sensorAlarms}
                />
            );
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.earthquakeInfo]) {
            popups.push(
                <EarthquakeInfo_gg
                    key='sdms_popup_earthquakeInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.earthquakeInfoZIndex}
                    popupType={SDMSResource.popupLayer.earthquakeInfo}
                    popupState={this.state.popupState.earthquakeInfo}
                    setPopupState={this.setPopupState}
                    showConfirmDialog={this.showConfirmDialog}
                    closeConfirmDialog={this.closeConfirmDialog}
                />
            );
        }

        if (!this.isEditMode() && visiblePopups[SDMS.menu.changeSensorName]) {
            popups.push(
                <ChangeSensorName key='sdms_popup_changeSensorName'
                                  setVisiblePopups={this.setVisiblePopups}
                                  setActiveDragPopup={this.setActiveDragPopup}
                                  zIndex={this.state.popupLayer.changeSensorZIndex}
                                  popupType={SDMSResource.popupLayer.changeSensorName}
                                  popupState={this.state.popupState.changeSensorName}
                                  setPopupState={this.setPopupState}
                                  currentView={this.state.currentView}
                                  currentSiteID={this.state.currentSiteID}
                                  sensorList={this.state.sensorList}
                                  buildingGroupList={this.state.buildingGroupList}
                                  useSensorTypes={this.state.useSensorTypes}
                                  requestSensorList={this.requestSensorList}
                                  showConfirmDialog={this.showConfirmDialog}
                />);
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.speedingHistory]) {
            popups.push(
                <SpeedingHistory
                    key='sdms_popup_speedingHistory'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.speedingHistoryZIndex}
                    popupType={SDMSResource.popupLayer.speedingHistory}
                    popupState={this.state.popupState.speedingHistory}
                    setPopupState={this.setPopupState}
                    selectSiteID={this.state.selectSiteID}
                    speedDetectionDatas={this.state.speedDetectionDatas}
                    selectedPOI={this.state.selectedPOI}
                    sensorList={this.state.sensorList}
                />
            );
        }

        if(!this.isEditMode() && visiblePopups[SDMS.menu.speedingInfo]) {
            popups.push(
                <SpeedingInfo
                    key='sdms_popup_speedingInfo'
                    setVisiblePopups={this.setVisiblePopups}
                    setActiveDragPopup={this.setActiveDragPopup}
                    zIndex={this.state.popupLayer.speedingInfoZIndex}
                    popupType={SDMSResource.popupLayer.speedingInfo}
                    popupState={this.state.popupState.speedingInfo}
                    setPopupState={this.setPopupState}
                    selectSiteID={this.state.selectSiteID}
                    speedDetectionDatas={this.state.speedDetectionDatas}
                />
            );
        }

        return popups;
    }

    setWorkerStatusPopup = (equipZoneID) => {
        this.setState({workerStatusPopup: equipZoneID});
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
            const alarm = this.alarmInfo[menu];

            if (alarm && alarm[1]) {
                let key = 'sdms_popup_cctvInfo_' + alarm[1].sensorZoneHistoryID;

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
    }

    showAlarmCCTVApps(popups) {
        for(let alarm in this.alarmInfo) {
            const cctvs = this.alarmInfo[alarm];
            
            if (cctvs) {
                let cctvList = String(cctvs).trim().split(',');

                if (cctvList.length > 0) {
                    popups.push(
                        <CCTVApp_gg
                            key={alarm}
                            cctvList={this.alarmCCTVs[alarm]}
                            editMode={this.state.editMode}
                            editModeManager={this.editModeManager}
                            alarmInfo={this.alarmInfo[alarm]}
                            menu={alarm}
                            selectedAlarm={this.state.selectedAlarm}
                            getWsManager={this.getWsManager}
                            setCCTVAppGuid={this.setCCTVAppGuid}
                            cctvAppGUID_poi={this.state.cctvAppGUID_poi}
                            setVisiblePopups={this.setVisiblePopups}
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
        selectedStatusInfo.fireSensors = false;
        selectedStatusInfo.psmSensors = false;
        selectedStatusInfo.etcSensors = false;
        selectedStatusInfo.cctvGroups = false;
        selectedStatusInfo.cctvSubGroups = false;
        selectedStatusInfo.facilityGroups = true;
        selectedStatusInfo.facilitySubGroups = true;
        selectedStatusInfo.earthquakeSensors = false;
        selectedStatusInfo.strongWindSensors = false;
        selectedStatusInfo.environmentSensors = false;
        selectedStatusInfo.manufactureSensors = false;
        selectedStatusInfo.emergencyBellSensors = false;
        selectedStatusInfo.laser = false;
        selectedStatusInfo.door = false;
        
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

        // 경기도청
        //if (siteID >= ProjectResource.Site.GG_A && siteID <= ProjectResource.Site.GG_D) {
            // 경기도청은 빌딩그룹 이동 하지 않음

            //const userInfo = ProjectResource.getUserInfo();

            //for (let i = 0; i < buildingGroupCount; i++) {
            //    const buildingGroup = buildingGroupList[i];

            //    if (ProjectResource.siteID === ProjectResource.Site.GG_A && userInfo?.levelID === AccountResource.accountLevelID.master) {
            //        // 통합방재실 > 모든 공간
            //        //buildingGroup.completeLoading = true;
            //    }
            //    else {
            //        // 그 외 > 자기꺼랑 공통으로 사용하는 지하층만 포함
            //        if (buildingGroup.siteID.toString() === ProjectResource.Site.GG_A || buildingGroup.siteID.toString() === siteID) {
            //            //buildingGroup.completeLoading = true;
            //        }
            //    }
            //}
        //}
        //else {
            for (let i = 0; i < buildingGroupCount; i++) {
                const buildingGroup = buildingGroupList[i];

                if (buildingGroup.siteID.toString() === siteID) {
                    buildingGroup.completeLoading = true;
                }
            }
        //}
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

    setCCTVAppGuid = (guid, type, menu) => {
        const userInfo = ProjectResource?.getUserInfo();

        if (type === 'poi') {
            if (this.state.cctvAppGUID_poi === null) {
                const cctvInfo = {
                    menu: menu,
                    guid: guid
                }
                this.setState({ cctvAppGUID_poi: cctvInfo });
            }
        }
        else if (type === 'alarm') {
            let cctvList = this.state.cctvAppGUID_alarms;

            if (cctvList.length > 2) {
                // 종료할 cctv popup guid (알람 CCTV는 총 3개까지만 띄울 수 있음)
                const cctvBeDeleted = cctvList.shift();

                if (this.wsManager) {
                    this.wsManager.closeCCTV(cctvBeDeleted, userInfo.id);
                }

                cctvList.push({
                    menu: menu,
                    guid: guid
                });
                this.setState({ cctvAppGUID_alarms: cctvList });
            }
            else {
                cctvList.push({
                    menu: menu,
                    guid: guid
                });
                this.setState({ cctvAppGUID_alarms: cctvList });
            }
        }
    }

    onWebsocketMessage(guid) {
        const { cctvAppGUID_poi, cctvAppGUID_alarms, visiblePopups } = this.state;

        if (cctvAppGUID_poi && cctvAppGUID_poi.guid === guid) {
            this.setState({ cctvList: null, cctvAppGUID_poi: null });
        }
        else {
            for (const cctv of cctvAppGUID_alarms) {
                if (cctv.guid === guid) {
                    delete this.alarmInfo[cctv.menu];
                    visiblePopups[cctv.menu] = false;
                }
            }

            const newGuidArr = cctvAppGUID_alarms.filter((x) => x.guid !== guid);
            this.setState({ cctvAppGUID_alarms: newGuidArr, visiblePopups });
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

    getAlarmMap = () => {
        const alarmInfo = {};
        const alarms = [...this.state.sensorAlarms];

        for (const alarm of alarms) {
            alarmInfo[alarm.sensorZoneHistoryID] = alarm;
        }

        return alarmInfo;
    }

    getContents() {
        const [sensorType, zoneID, sensorID] = this.getSelectedSensorInfo();
        const visiblePopups = { ...this.state.visiblePopups };
        const isEditMode = this.isEditMode();
        const alarmMap = this.getAlarmMap();

        if (this.is2DMode()) {
            return <Contents2D
                command={this.state.command}
                setCurrentView={this.setCurrentView}
                currentView={this.state.currentView}
                sensorList={this.state.sensorList}
                requestSensorList={this.requestSensorList}
                visibleSensorTypes={this.state.visibleSensorTypes}
                selectedPOI={this.state.selectedPOI}
                onSelectPOI={this.onSelectPOI}
                onSelectCCTV={this.onSelectCCTV}
                selectedSensor={[sensorType, zoneID, sensorID]}
                editModeManager={this.editModeManager}
                sensorAlarms={this.state.sensorAlarms}
                alarmMap={alarmMap}
                visiblePopups={visiblePopups}
                setVisiblePopups={this.setVisiblePopups}
                getVisiblePopups={this.getVisiblePopups}
                onSelectSensorPOI={this.onSelectSensorPOI}
                setEditMode={this.setEditMode}
                alarmSound={this.state.alarmSound}
                selectedAlarm={this.state.selectedAlarm}
            />;
        } else {            
            return <Contents3D
                site3dOptions={this.state.site3dOptions}
                _3dOptions={this.state._3dOptions}
                multiSite={this.isMultiSite()}
                currentSiteID={this.state.currentSiteID}
                command={this.state.command}
                setVisiblePopups={this.setVisiblePopups}
                getVisiblePopups={this.getVisiblePopups}
                sensorList={this.state.sensorList}
                zoneIcons={this.state.zoneIcons}
                closedDoorDatas={this.state.closedDoorDatas}
                onSelectMenu={this.onSelectMenu}
                visibleSensorTypes={this.state.visibleSensorTypes}
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
                alarmMap={alarmMap}
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
                setFloorBoundingBoxManager={this.setFloorBoundingBoxManager}
                selectSiteID={this.state.selectSiteID}
                setStateLoading3D={this.setStateLoading3D}
                getWsManager={this.getWsManager}
                setTempNewSensor={this.setTempNewSensor}
                getTempNewSensor={this.getTempNewSensor}
                cctvAppGUID_alarms={this.state.cctvAppGUID_alarms}
                cctvAppGUID_poi={this.state.cctvAppGUID_poi}
                getCurrentAlarms={this.getCurrentAlarms}
            />
        }
    }

    eventFullBox = () => {
        const selectedAlarm = { ...this.state.selectedAlarm };
        selectedAlarm.newCheck = true;
        this.setState({ selectedAlarm });
    }

    setFloorBoundingBoxManager = (mgr) => {
        this.floorBoundingBoxManager = mgr;
        this.updateFloorBoundingBox(this.state.sensorAlarms);
    }

    updateFloorBoundingBox(sensorAlarms) {
        if (this.floorBoundingBoxManager) {
            this.floorBoundingBoxManager.update(sensorAlarms);
        }
    }

    handleFleeDashboardPopup = (selectSiteID, value) => {
        if ([ProjectResource.Site.GG_B, ProjectResource.Site.GG_F].includes(selectSiteID)) {
            this.setState({
                evacuationsPopupStatus: {
                    ...this.state.evacuationsPopupStatus,
                    [selectSiteID]: value
                },
                evacuationsCurrent: null
            });
        }

        if (value === 0) {
            this.setState({
                showEvacuationsPopup: {
                    ...this.state.showEvacuationsPopup,
                    [selectSiteID]: false
                },
                evacuationsCurrent: null
            });
        }
    }

    getFleeDashboardUI = () => {
        let ui = [];

        const { evacuations, evacuationsPopupStatus, evacuationsCurrent, selectSiteID } = this.state;

        if (evacuations) {
            ui.push(
                <FleeDashboard_gg
                    key='FleeDashboard_gg'
                    evacuations={evacuations}
                    evacuationsPopupStatus={evacuationsPopupStatus}
                    handleFleeDashboardPopup={this.handleFleeDashboardPopup}
                    selectSiteID={selectSiteID}
                    evacuationsCurrent={evacuationsCurrent}
                />
            );
        }

        return ui;
    }

    setCurrentAlarms = (alarms) => {
        const currentAlarms = [...this.currentAlarms];
        const igrnoreAlarmTime = this.checkIgnoreAlarmTime();

        this.currentAlarms = alarms;

        if (igrnoreAlarmTime === false) {
            const newAlarm = this.checkAlarms(currentAlarms, alarms, alarms.length);

            if (newAlarm) {
                this.processMenu(SDMSMainMenu.Menu_Show_Alarm, [newAlarm.zoneID, SDMS.getFacilityType(newAlarm.facilityType), newAlarm.orgSensorID, newAlarm.sensorZoneHistoryID, newAlarm.alarmDepth, newAlarm.isAlarm]);
            }
        }
    }

    checkIgnoreAlarmTime() {
        if (this.ignoreAlarmTime === null) {
            return false;
        }

        const now = Date.now();
        const diff = (now - this.ignoreAlarmTime) / 1000;

        if (diff >= 1.0) {
            return false;
        }

        // site가 바뀐지 1초가 지나지 않았으면 alarm 관련하여 신경쓰지 않는다.
        return true;
    }

    getCurrentAlarms = () => {
        return this.currentAlarms;
    }

    checkAlarms(alarms1, alarms2, len) {
        let selectedAlarm = null;

        for (let i = 0; i < len; i++) {
            const alarm2 = alarms2[i];

            if (this.findAlarm(alarm2, alarms1) === false) {
                selectedAlarm = alarm2;
                break;
            }
        }

        if (selectedAlarm) {
            if (selectedAlarm.isAlarm) {
                return selectedAlarm;
            }

            // 남아있는 알람 가운데 활성화 상태인 첫번째 알람을 선택하도록 한다.
            for (let i = 0; i < len; i++) {
                const alarm2 = alarms2[i];

                if (alarm2.isAlarm) {
                    return alarm2;
                }
            }

            // 남아있는 알람이 없으면 알람을 모두 감추도록 한다.
            this.hideAlarm();
        }

        return null;
    }

    findAlarm(alarm, alarms) {
        for (const _alarm of alarms) {
            if (alarm.sensorZoneHistoryID === _alarm.sensorZoneHistoryID) {
                if (_alarm.isAlarm !== alarm.isAlarm) {
                    return false;
                }

                return true;
            }
        }

        return false;
    }

    onClickCloseEmergency = () => {
        this.setState({ isEmergencyMode: false});
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

        const emergencyMode = this.state.isEmergencyMode ? ' ' + styles.emergencyMode : '';

        return (
            <SDMSComponent className={'bodyArea' + emergencyMode} style={{ MozUserSelect: 'none', WebkitUserSelect: 'none' }}>
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
                {contents}                
                {
                    ((this.state.selectedAlarm !== null && this.state.selectedAlarm.isAlarm) &&
                    (this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0))
                        ? <EventDashboard selectedAlarm={this.state.selectedAlarm} sensorList={this.state.sensorList} />
                        : <></>
                }
                {popupUI}
                {
                    (
                        ProjectResource.SiteID === ProjectResource.Site.GG_A && 
                        ((this.state.showEvacuationsPopup[ProjectResource.Site.GG_B] && this.state.selectSiteID === ProjectResource.Site.GG_B) || (this.state.showEvacuationsPopup[ProjectResource.Site.GG_F] && this.state.selectSiteID === ProjectResource.Site.GG_F)) || 
                        ((this.state.showEvacuationsPopup[ProjectResource.Site.GG_B] && this.state.selectSiteID === ProjectResource.Site.GG_A) || (this.state.showEvacuationsPopup[ProjectResource.Site.GG_F] && this.state.selectSiteID === ProjectResource.Site.GG_A))
                    ) &&
                        this.getFleeDashboardUI()
                }

                {/*
                    this.broadcastIsRunning() &&
                    <img ref={this.refBroadcast} className={styles.closeBroadcast} src={imgCloseBroadcast} title={SdmsResource.ID.broadcast.close} onClick={this.onClickCloseBroadcast}/>
                */}
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }

                {/* 긴급 알람 경고 배너 - 상위 컨테이너에 emergencyMode 클래스가 있을 때만 표시 */}
                <div className={styles.emergencyBanner}>
                    <button type="button" className={styles.emergencyBannerClose} aria-label="close" onClick={this.onClickCloseEmergency}>×</button>
                    <div className={styles.emergencyBannerTitle}>
                        <span className={styles.siren}>🚨</span>
                        <span>Emergency</span>
                        <span className={styles.siren}>🚨</span>
                    </div>
                    <div className={styles.emergencyBannerSub}>임직원 대피 우선(책임자 연락)</div>
                </div>
            </SDMSComponent>
        );
    }
}


export default hoistStatics(withTranslation()(SDMS), SDMS);