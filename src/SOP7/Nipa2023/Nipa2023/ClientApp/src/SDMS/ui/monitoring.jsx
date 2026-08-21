import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ProjectResource from '../../Root/resource/id';
import SDMSResource from '../resource/id';
import SDMSMainMenu from './sdmsMainMenu';

import $ from 'jquery';
import { isEqual } from 'lodash';

import ConfirmDialog from '../../Common/ui/confirmDialog';
import StatusInfo from './popups/statusInfo';
import NavigationBar from './popups/navigationBar';
import Dashboard from './popups/dashboard';
import EventDashboard from './popups/eventDashboard';
import Event from './popups/event';
import Toolbar from './popups/toolbar';
import EquipmentStatus from './popups/equipmentStatus';
import EquipmentFaulty from './popups/equipmentFaulty';
import EquipmentDetail from './popups/equipmentDetail';
import EquipmentFaultyImage from './popups/equipmentFaultyImage';
import EquipmentFaultyImage2 from './popups/equipmentFaultyImage2';
import StatusPsmSensorInfo from './popups/statusPsmSensorInfo';
import WorkerInfo from './popups/workerInfo';
import WorkerInfoEquipmentStatus from './popups/WorkerInfoEquipmentStatus';
import WorkerEventInfo from './popups/workerEventInfo';
import ThermalImagingCamera from './popups/thermalImagingCamera';

import { MonitoringComponent } from '../styled/sdmsStyled';
import { SdmsController } from '../services/sdmsController';
import { SdmsDataManager } from '../services/sdmsDataManager';
import { AccountController } from '../../Account/services/accountController';
import wsManager from '../../Root/services/wsManager';
import { UserDispatch } from '../../Root/resource/userDispatch';
import SdmsResource from '../resource/id';


class Monitoring extends Component {
    static contextType = UserDispatch;
    static className = "Monitoring";

    static menu = {
        none: null,
        statusInfo: SDMSResource.ID.menu.statusInfo, // 현황정보
        dashboard: SDMSResource.ID.menu.dashboard, // 대시보드
        event: SDMSResource.ID.menu.event, // 이벤트알람
        workerPositioning: SDMSResource.ID.menu.workerPositioning, // 작업자위치측위
        equipmentStatus: SDMSResource.ID.menu.equipmentStatus, // 설비현황정보
        equipmentFaulty: SDMSResource.ID.menu.equipmentFaulty, // 불량현황정보
        equipmentFaultyImage: SDMSResource.ID.menu.equipmentFaultyImage, // 불량 상세이미지 (from 이벤트 정보 팝업)
        equipmentFaultyImage2: SDMSResource.ID.menu.equipmentFaultyImage2, // 불량 상세이미지 (from 불량 상세정보 팝업)
        equipmentEventAlarm: SDMSResource.ID.menu.equipmentEventAlarm, // 이벤트 발생
        statusPsmSensorInfo: SDMSResource.ID.menu.statusPsmSensorInfo, // 대기오염센서 상세정보
        workerInfo: SDMSResource.ID.menu.workerInfo, // 작업자 정보
        workerInfoEquipmentStatus: SDMSResource.ID.menu.workerInfoEquipmentStatus, // 장비현황 상세정보
        workerEventInfo: SDMSResource.ID.menu.workerEventInfo, // 작업자 이벤트 상세정보
        thermalImagingCamera: SDMSResource.ID.menu.thermalImagingCamera, // 열화상카메라 영상정보
    }

    constructor(props) {
        super(props);

        this.state = {
            campusID: null,
            campus2Datas: [],
            visiblePopups: {},
            popupLayer: {
                statusInfoZIndex: 0,
                dashboardZIndex: 0,
                eventZIndex: 0,
                equipmentStatusZIndex: 0,
                equipmentFaultyZIndex: 0,
                equipmentFaultyImageZIndex: 0,
                equipmentFaultyImage2ZIndex: 0,
                equipmentEventAlarmZIndex: 0,
                statusPsmSensorInfoZIndex: 0,
                workerInfoZIndex: 0,
                workerInfoEquipmentStatusZIndex: 0,
                workerEventInfoZIndex: 0,
                thermalImagingCameraZIndex: 0,
                buildingGroupList: [],
                outdoorZones: [],
                sensorList: {},
                loading: true
            },
            popupState: {},

            currentView: {
                buildingID: null,
                zoneID: null,
                zoneName: ''
            },

            visibleSensorTypes: this.initVisibleSensorTypes(),

            // 현황정보 선택된 Node 정보
            selectedStatusInfo: {
                building: null,             // 공장동
                zone: null,                 // 공장동 1층
                sensorGroups: null,         // 센서
            },

            selectedSensor: null,           // 선택된 센서 정보

            selectedFacilityID: null,
            selectedFacilityViewID: null,

            selectedAlarm: null,            // 선택된 알람 정보 (안전관리)
            selectedFacilityAlarm: null,    // 선택된 알람 정보 (설비관리)
            selectedFacilityEvent: null,    // 선택된 불량 이벤트 정보

            alarmSound: true,
            buildingGroupList: [],
            outdoorZones: [],
            sensorList: {},
            sensorDetailInfo: {
                sensorInfos: [],
                facilityType: null
            },

            equipmentItem: 0,   // 설비 팝업에서 선택된 사출기 ID
            facilityList: [],   // 설비 리스트
            facilityItem: {
                data: null,
                details: null
            }, // 설비 상세보기에서 선택된 사출기 데이터

            workerEventInfoPopupOpen: false,
            sensorDetailInfoPopupOpen: false,
            WorkerInfoEquipmentStatusPopupOpen: false,
            eventDashboardPopupOpen: false,

            streamServerURL: "",
            cctvList: [],
            cctvIds: "",

            rotationFromClick: false,       // 툴바에서 회전기능 클릭했는지 체크
            // isAutoRotation: false,          // 회전기능으로 인해 회전중인지 체크

            eventTabMenu: SdmsResource.mode.monitoring,

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        }

        this.props = props;

        this.setVisiblePopups = this.setVisiblePopups.bind(this);
        this.setActiveDragPopup = this.setActiveDragPopup.bind(this);
        this.setPopupState = this.setPopupState.bind(this);
        this.getPopupState = this.getPopupState.bind(this);
        this.setCurrentView = this.setCurrentView.bind(this);
        this.setVisiblePoi = this.setVisiblePoi.bind(this);
        this.onSelectedAlarm = this.onSelectedAlarm.bind(this);

        this.initDatas();
        this.initFacilityList();
        this.initCampusDatas();
        this.initWorkerDatas();

        // this.idleTimer = null;
        // this.idleTimeout = this.props.option3DNormal.autoRotationIdleMinutes * 60000;

        if (this.props.wsManager) {
            this.props.wsManager.setMonitoring(this);
        }
    }

    async initDatas() {
        const streamServerURL = await SdmsController.requestStreamServerURL();

        const campusID = ProjectResource.campusID;

        if (campusID) {
            if (this.props.wsManager) {
                // 1 : 외부영역, 2 : 실내
                this.props.wsManager.setViewMode(wsManager.mode.monitoring, 1);
                //this.moveToOutdoor(campusID);
            }

            const [sensorList, errorMessage] = await SdmsController.requestSensorList(campusID);

            if (sensorList) {
                const [buildingGroupList, outdoorZones, errorMessage2] = await SdmsController.requestBuildingGroupList(campusID);

                if (buildingGroupList) {
                    // setViewMode 호출뒤 0.5초간의 delay를 둔다.(api 호출시간은 무시한다.)
                    setTimeout(() => this.moveToOutdoor(campusID, outdoorZones), 500);
                    //this.moveToOutdoor(campusID, outdoorZones);
                    SdmsDataManager.setZoneSensors(buildingGroupList, outdoorZones, sensorList);
                    this.setState({ buildingGroupList, outdoorZones, sensorList, streamServerURL, loading: false });
                }
                else {
                    this.showConfirmDialog([errorMessage2], null, null, 'error');
                }
            }
            else {
                this.showConfirmDialog([errorMessage], null, null, 'error');
            }

            const [mesEquipmentData, message] = await SdmsController.requestMESEquipmentData([14, 22, 23]);

            if(mesEquipmentData) {
                this.setState({ mesEquipmentData });
            }
            else {
                this.showConfirmDialog([message], null, null, 'error');
            }
        }


        this.setState({ campusID: campusID, streamServerURL });
    }

    initFacilityList = async () => {
        const campusID = ProjectResource.campusID;

        if (campusID) {
            // 설비 리스트 받아오기
            const [facilityList, facilityMessage] = await SdmsController.requestFacilityList(campusID);

            if (facilityList) {
                let compare = isEqual(this.state.facilityList, facilityList);

                if (!compare) {
                    this.setState({ facilityList: facilityList });
                }

            } else {
                this.showConfirmDialog([facilityMessage], null, null, 'error');
            }
        }
    }

    initCampusDatas = async () => {
        const campusID = ProjectResource.campusID;

        if (campusID) {
            // 2공장동 데이터 가져오기
            const [campus2Datas, message] = await SdmsController.requestCampusData(ProjectResource.campus.campus_2);

            if (campus2Datas) {
                this.setState({ campus2Datas: campus2Datas });
            }
            else {
                this.showConfirmDialog([message], null, null, 'error');
            }
        }
    }

    initWorkerDatas = async () => {
        const campusID = ProjectResource.campusID;

        if (campusID) {
            const [apStatistics, message1] = await SdmsController.requestAPStatistics(campusID);

            if (apStatistics) {
                const [workerStatistics, message2] = await SdmsController.requestWorkerStatistics(campusID);

                if (workerStatistics) {
                    this.setState({ apStatistics, workerStatistics });
                }
                else {
                    this.showConfirmDialog([message2], null, null, 'error');
                }
            }
            else {
                this.showConfirmDialog([message1], null, null, 'error');
            }
        }
    }

    componentDidMount() {

        // 관제화면 진입시 모니터링 모드로 초기화
        SdmsResource.setMode(SdmsResource.mode.monitoring);

        // 처음부터 뜰 메뉴
        var visiblePopups = this.state.visiblePopups;
        visiblePopups[Monitoring.menu.statusInfo] = true;
        visiblePopups[Monitoring.menu.equipmentStatus] = true;
        visiblePopups[Monitoring.menu.equipmentFaulty] = false;
        visiblePopups[Monitoring.menu.equipmentFaultyImage] = false;
        visiblePopups[Monitoring.menu.equipmentEventAlarm] = true;
        visiblePopups[Monitoring.menu.workerInfo] = false;
        visiblePopups[Monitoring.menu.thermalImagingCamera] = false;

        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        if (alarms) {
            const datas = alarms['allAlarmDatas'];

            if(datas && datas?.length > 0) {
                for(let data of datas){
                    if(data.isAlarm) {
                        this.setState({ eventDashboardPopupOpen: true });
                        visiblePopups[Monitoring.menu.dashboard] = false;
                        visiblePopups[Monitoring.menu.event] = true;
                        break;
                    }
                    visiblePopups[Monitoring.menu.dashboard] = true;
                    visiblePopups[Monitoring.menu.event] = false;
                }
            }
            else {
                visiblePopups[Monitoring.menu.dashboard] = true;
                visiblePopups[Monitoring.menu.event] = false;
            }
        }

        //팝업 상태값 일괄 획득
        this.getPopupState();

        // 설비 리스트는 1분에 한번씩 데이터를 새로 불러옴
        this.facilityInterval = setInterval(this.initFacilityList, 60000);

        // 작업자 정보는 5초에 한번씩 데이터를 새로 불러옴
        this.workerInterval = setInterval(this.initWorkerDatas, 5000);

        this.setSelectedAlarm();

        // 환경설정 > 3D 회전 대기시간
        // 일정 시간 사용자가 마우스 조작하지 않으면 자동회전 on
        // if(this.props.option3DNormal.useAutoRotation) {
        //     window.addEventListener('mousemove', this.resetTimer);
        //     this.idleTimer = setTimeout(this.triggerIdleFunction, this.idleTimeout);
        // }
        this.props.wsManager.sendAutoRotationOption(this.props.option3DNormal.useAutoRotation, this.props.option3DNormal.autoRotationIdleMinutes);

        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        if(option3DSensor !== null && option3DSensor !== undefined) {
            this.props.wsManager.sendAlarmLayers(option3DSensor.receiveFireAlarm, option3DSensor.receiveAtmosphereAlarm, option3DSensor.receiveGasAlarm, option3DSensor.receiveEmergencyBellAlarm, option3DSensor.receiveThermalCameraAlarm, option3DSensor.receiveWorkerAlarm, option3DSensor.receiveFacilityError);
        }
    }

    componentWillUnmount() {
        // 언마운트 될 때 interval 중지
        clearInterval(this.facilityInterval);
        clearInterval(this.workerInterval);
        clearInterval(this.atmosphereSensorInterval);
        clearInterval(this.gasSensorInterval);

        // window.removeEventListener('mousemove', this.resetTimer);
    }

    componentDidUpdate(prevProps, prevState) {

        if(prevProps.newAlarmData !== this.props.newAlarmData) {

            const alarm = this.props.newAlarmData;

            if(alarm.facilityType === SdmsResource.facilityType.EQUIPMENT) {
                if(this.props.mode !== SdmsResource.mode.equipment) {
                    this.props.onClickChangeMode(SdmsResource.mode.equipmentDetail);
                }

                this.setVisiblePopups(Monitoring.menu.dashboard, false);
                this.setVisiblePopups(Monitoring.menu.event, true);

                this.onSelectedAlarm(alarm, SdmsResource.mode.equipment);
                this.onDoubleClickAlarm(alarm, SdmsResource.mode.equipment);
                this.setState({ eventDashboardPopupOpen: true });
            } else {
                if(this.props.mode !== SdmsResource.mode.monitoring) {
                    this.props.onClickChangeMode(SdmsResource.mode.monitoring);
                }

                // 이벤트알람을 더블클릭했을 경우 현황정보 POI ON
                let typeName = '';
                if(alarm.facilityType === SdmsResource.facilityType.GAS) {
                    typeName = SDMSMainMenu.Gas_Sensor;
                } else if(alarm.facilityType === SdmsResource.facilityType.ATMOSPHERE) {
                    typeName = SDMSMainMenu.Stink_Sensor;
                } else if(alarm.facilityType === SdmsResource.facilityType.EMERGENCYBELL) {
                    typeName = SDMSMainMenu.EmergencyBell_Sensor;
                } else if(alarm.facilityType === SdmsResource.facilityType.THERMAL_CAMERA) {
                    typeName = SDMSMainMenu.ThermalImagingCamera_Sensor;
                } else if(alarm.facilityType === SdmsResource.facilityType.WORKER) {
                    typeName = SDMSMainMenu.Worker_Sensor;
                } 

                this.setVisiblePoi(typeName, true);
                this.setVisiblePopups(Monitoring.menu.dashboard, false);
                this.setVisiblePopups(Monitoring.menu.event, true);
                this.setVisiblePopups(Monitoring.menu.statusInfo, true);

                this.onSelectedAlarm(alarm, SdmsResource.mode.monitoring);
                this.onDoubleClickAlarm(alarm, SdmsResource.mode.monitoring);
                this.setState({ eventDashboardPopupOpen: true });
            }
        }

        if(prevProps.mode !== this.props.mode) {
            const { alarm } = this.context;
            const alarms = alarm[0].alarmState;

            if(this.props.mode === SdmsResource.mode.monitoring) {
                if (alarms) {
                    const datas = alarms['allAlarmDatas'];

                    if(datas && datas?.length > 0) {
                        for(let data of datas){
                            if(data.isAlarm) {
                                this.setState({ eventDashboardPopupOpen: true });
                                this.setVisiblePopups(SDMSResource.ID.menu.dashboard, false);
                                this.setVisiblePopups(SDMSResource.ID.menu.event, true);
                                break;
                            }
                            this.setVisiblePopups(SDMSResource.ID.menu.dashboard, true);
                            this.setVisiblePopups(SDMSResource.ID.menu.event, false);
                        }
                    }
                    else {
                        this.setVisiblePopups(SDMSResource.ID.menu.dashboard, true);
                        this.setVisiblePopups(SDMSResource.ID.menu.event, false);
                    }
                }

                this.setVisiblePopups(SdmsResource.ID.menu.equipmentFaultyImage, false);
            }

            if(this.props.mode === SdmsResource.mode.equipment) {
                if (alarms) {
                    const datas = alarms['equipmentAlarmDatas'];

                    if(datas && datas?.length > 0) {
                        for(let data of datas){
                            if(data.isAlarm) {
                                this.setState({ eventDashboardPopupOpen: true });
                                this.setVisiblePopups(SDMSResource.ID.menu.dashboard, false);
                                this.setVisiblePopups(SDMSResource.ID.menu.event, true);
                                break;
                            }
                            this.setVisiblePopups(SDMSResource.ID.menu.dashboard, true);
                            this.setVisiblePopups(SDMSResource.ID.menu.event, false);
                        }
                    }
                    else {
                        this.setVisiblePopups(SDMSResource.ID.menu.dashboard, true);
                        this.setVisiblePopups(SDMSResource.ID.menu.event, false);
                    }
                }

                this.handlePopup(SDMSResource.ID.menu.workerEventInfo, false);
            }

            // const selectedStatusInfo = { ...this.state.selectedStatusInfo };
            // selectedStatusInfo.building = null;
            // selectedStatusInfo.zone = null;

            this.setState({ selectedFacilityID: null, selectedFacilityViewID: null, equipmentItem: 0, /* selectedSensor: null , selectedStatusInfo */ });
        }

        // if(this.props.option3DNormal !== prevProps.option3DNormal) {
        //     window.removeEventListener('mousemove', this.resetTimer);
        //     clearTimeout(this.idleTimer);
            
        //     if(this.props.option3DNormal.useAutoRotation) {
        //         this.idleTimeout = this.props.option3DNormal.autoRotationIdleMinutes * 60000;
        //         window.addEventListener('mousemove', this.resetTimer);
        //         this.idleTimer = setTimeout(this.triggerIdleFunction, this.idleTimeout);
        //     }
        // }

        if(prevProps.option3DNormal !== this.props.option3DNormal) {
            this.props.wsManager.sendAutoRotationOption(this.props.option3DNormal.useAutoRotation, this.props.option3DNormal.autoRotationIdleMinutes);
        }

        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.getPopupState();
            this.props.checkPopupStateReset(false);
        }

        // 타이틀바에서 home button 클릭시 건물/센서 선택정보 초기화
        if(this.props.isMoveToOutdoor) {
            this.resetSelectedStatus();
            this.props.checkMoveToOutdoor(false);
        }

        if(prevState.selectedAlarm?.facilityType === SdmsResource.facilityType.WORKER && this.state.selectedAlarm?.facilityType !== SdmsResource.facilityType.WORKER) {
            this.handlePopup(SDMSResource.ID.menu.workerEventInfo, false);
        }
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

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

    initVisibleSensorTypes() {
        const visibleSensorTypes = {};

        visibleSensorTypes[SDMSMainMenu.Stink_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Gas_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.EmergencyBell_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.ThermalImagingCamera_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.CCTV_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.ZoneName_Sensor] = true;
        visibleSensorTypes[SDMSMainMenu.Worker_Sensor] = true;

        return visibleSensorTypes;
    }

    setVisiblePoi(typeName, visible) {
        let types = { ...this.state.visibleSensorTypes };

        types[typeName] = visible;
        
        this.setState({ visibleSensorTypes: types });

        if (this.props.wsManager) {
            const layerID = wsManager.layerTypeNameToID(typeName);

            if (layerID) {
                this.props.wsManager.setLayerState(layerID, visible ? 1 : 0);
            }
        }
    }

    getVisibleSensorType(sensorType) {
        const visibleSensorTypes = { ...this.state.visibleSensorTypes };

        if (visibleSensorTypes[sensorType]) {
            return true;
        }

        return false;
    }

    getBuildingIDFromSensor(sensor) {
        const buildingGroupList = [...this.state.buildingGroupList];

        for (const buildingGroup of buildingGroupList) {
            for (const buildingData of buildingGroup.buildingDatas) {
                for (const zoneData of buildingData.zoneDatas) {
                    if (zoneData.id === sensor.zoneID) {
                        return buildingData.id;
                    }
                }
            }
        }

        return null;
    }

    getBuildingIDFromZoneID(zoneID) {
        if (zoneID < 0) {
            return null;
        }

        const buildingGroupList = [...this.state.buildingGroupList];

        for (const buildingGroup of buildingGroupList) {
            for (const buildingData of buildingGroup.buildingDatas) {
                for (const zoneData of buildingData.zoneDatas) {
                    if (zoneData.id === zoneID) {
                        return buildingData.id;
                    }
                }
            }
        }

        return null;
    }

    selectSensor = (sensor, zone) => {
        let buildingID = null;
        
        if(sensor.zoneID >= 20000) {
            buildingID = 20000;
        }
        else {
            buildingID = this.getBuildingIDFromSensor(sensor);
        }
        const zoneID = sensor.zoneID;
        const sensorGroups = sensor.facilityType;

        const selectedStatusInfo = { ...this.state.selectedStatusInfo };
        selectedStatusInfo.building = buildingID;
        selectedStatusInfo.zone = zoneID;
        selectedStatusInfo.sensorGroups = sensorGroups;

        clearInterval(this.atmosphereSensorInterval);
        clearInterval(this.gasSensorInterval);
        this.setState({ sensorDetailInfoPopupOpen: false });

        if(zone === undefined || zone === null) {
            // app to web
            this.setState({ selectedSensor: sensor, selectedStatusInfo });
        }
        else {
            // web to app
            const layerID = sensor.facilityTypeName && sensor.facilityTypeName.toLowerCase() === "cctv" ? wsManager.layer.cctv : wsManager.layerTypeFacilityTypeToID(sensor.facilityType);
            this.props.wsManager.selectSensor(zone.id, sensor.id, layerID);

            if (this.state.selectedSensor !== sensor) {
                this.setState({ selectedSensor: sensor, selectedStatusInfo });
            }
        }

        // 대기오염센서/가스센서 선택 시 상세정보 탐색
        if (sensor.facilityType === SDMSResource.facilityType.ATMOSPHERE) {
            this.getAtmosphereSensorInfo(sensor.id);
            this.atmosphereSensorInterval = setInterval(this.setAtmosphereSensorInterval, 5000);
        }
        else if (sensor.facilityType === SDMSResource.facilityType.GAS) {
            this.getGasSensorInfo(sensor.id);
            this.gasSensorInterval = setInterval(this.setGasSensorInterval, 5000);
        }
        else if (sensor.facilityType === SDMSResource.facilityType.THERMAL_CAMERA) {
            this.setState({ sensorDetailInfoPopupOpen: false });

            if(sensor.enabled) {
                this.getCCTVs(sensor);
                this.setVisiblePopups(Monitoring.menu.thermalImagingCamera, true);
            }
        }
        else {
            this.setState({ sensorDetailInfoPopupOpen: false });
        }

        // 작업자센서 선택 시 작업자정보 팝업 열림
        if(sensor.facilityType === SdmsResource.facilityType.WORKER) {
            this.setVisiblePopups(Monitoring.menu.workerInfo, true)
        }
    }

    // 대기오염센서 선택시 5초마다 데이터 탐색
    setAtmosphereSensorInterval = () => {
        this.getAtmosphereSensorInfo();
    }

    // 가스센서 선택시 5초마다 데이터 탐색
    setGasSensorInterval = () => {
        this.getGasSensorInfo();
    }

    getAtmosphereSensorInfo = async (id) => {
        clearInterval(this.gasSensorInterval);
        const sensor = this.state.selectedSensor;

        if(id !== null && id !== undefined) {
            const [result, message] = await SdmsController.requestAtmosphereSensorInfo(id);

            if (result.success) {
                this.setState({ sensorDetailInfo: { sensorInfos: result.sensorInfos, facilityType: SDMSResource.facilityType.ATMOSPHERE }, sensorDetailInfoPopupOpen: true });
            } else {
                this.showConfirmDialog([message], null, null, 'error');
            }
        } else {
            if (sensor === null) {
                return;
            } else {
                const [result, message] = await SdmsController.requestAtmosphereSensorInfo(sensor.id);
            
                if (result.success) {
                    this.setState({ sensorDetailInfo: { sensorInfos: result.sensorInfos, facilityType: SDMSResource.facilityType.ATMOSPHERE }, sensorDetailInfoPopupOpen: true });
                } else {
                    this.showConfirmDialog([message], null, null, 'error');
                }
            }
        }
    }

    getGasSensorInfo = async (id) => {
        clearInterval(this.atmosphereSensorInterval);
        const sensor = this.state.selectedSensor;

        if(id !== null && id !== undefined) {
            const [result, message] = await SdmsController.requestGasSensorInfo(id);

            if (result.success) {
                this.setState({ sensorDetailInfo: { sensorInfos: result.sensorInfos, facilityType: SDMSResource.facilityType.GAS }, sensorDetailInfoPopupOpen: true });
            } else {
                this.showConfirmDialog([message], null, null, 'error');
            }
        } else {
            if (sensor === null) {
                return;
            } else {
                const [result, message] = await SdmsController.requestGasSensorInfo(sensor.id);
            
                if (result.success) {
                    this.setState({ sensorDetailInfo: { sensorInfos: result.sensorInfos, facilityType: SDMSResource.facilityType.GAS }, sensorDetailInfoPopupOpen: true });
                } else {
                    this.showConfirmDialog([message], null, null, 'error');
                }
            }
        }
    }

    getCCTVs = (sensor) => {
        let cctvList = this.state.cctvList;

        if(cctvList.length === 4) {
            cctvList = [];
            cctvList.push(sensor);

            let ids = [];
            for(let cctv of cctvList) {
                ids.push(cctv.id);
            }

            this.setState({ cctvList: cctvList, cctvIds: ids });
        }
        else if(cctvList.length < 4) {
            const compareCCTV = cctvList.filter((cctv) => sensor.id === cctv.id);

            if(compareCCTV.length > 0) {
                return;
            }

            cctvList.unshift(sensor);
            
            let ids = [];
            for(let cctv of cctvList) {
                ids.push(cctv.id);
            }

            this.setState({ cctvList: cctvList, cctvIds: ids });
        }

        // const compareCCTV = cctvList.filter((cctv) => sensor.id === cctv.id);

        // if(compareCCTV.length > 0) {
        //     return;
        // }
        // else {
        //     if(cctvList.length === 4) {
        //         cctvList = [];
        //         cctvList.push(sensor);

        //         let ids = [];
        //         for(let cctv of cctvList) {
        //             ids.push(cctv.id);
        //         }

        //         this.setState({ cctvList: cctvList, cctvIds: ids });
        //     }
        //     else if(cctvList.length < 4) {
        //         cctvList.unshift(sensor);
                
        //         let ids = [];
        //         for(let cctv of cctvList) {
        //             ids.push(cctv.id);
        //         }

        //         this.setState({ cctvList: cctvList, cctvIds: ids });
        //     }
        // }
    }

    getSensorDataFromAlarm(id, facilityType) {
        const sensorList = this.state.sensorList;

        let atmosphereSensors = null, emergencyBells = null, gasSensors = null, thermalCCTVs = null, workers = null;

        if(sensorList) {
            const _atmosphereSensors = sensorList['atmosphereSensors'];
            const _emergencyBells = sensorList['emergencyBells'];
            const _gasSensors = sensorList['gasSensors'];
            const _thermalCCTVs = sensorList['thermalCCTVs'];
            const _workers = sensorList['aps'];

            if(facilityType === SdmsResource.facilityType.ATMOSPHERE) {
                atmosphereSensors = _atmosphereSensors.filter(x => (x.multiSensor?.isMultiSensor && x.multiSensor.idList.includes(id)) || x.id === id);
                return atmosphereSensors[0];
            }
            if(facilityType === SdmsResource.facilityType.EMERGENCYBELL) {
                emergencyBells = _emergencyBells.filter(x => (x.multiSensor?.isMultiSensor && x.multiSensor.idList.includes(id)) || x.id === id);
                return emergencyBells[0];
            }
            if(facilityType === SdmsResource.facilityType.GAS) {
                gasSensors = _gasSensors.filter(x => (x.multiSensor?.isMultiSensor && x.multiSensor.idList.includes(id)) || x.id === id);
                return gasSensors[0];
            }
            if(facilityType === SdmsResource.facilityType.THERMAL_CAMERA) {
                thermalCCTVs = _thermalCCTVs.filter(x => (x.multiSensor?.isMultiSensor && x.multiSensor.idList.includes(id)) || x.id === id);
                return thermalCCTVs[0];
            }
            if(facilityType === SdmsResource.facilityType.WORKER) {
                workers = _workers.filter(x => (x.multiSensor?.isMultiSensor && x.multiSensor.idList.includes(id)) || x.id === id);
                return workers[0];
            }
        }
    }

    onSelectedAlarm(alarm, type) {
        if (type === SdmsResource.mode.monitoring) {
            if (this.state?.selectedAlarm === alarm) {
                return;
            }

            this.setState({ selectedAlarm: alarm });
        } else if (type === SdmsResource.mode.equipment) {
            this.setState({ selectedFacilityAlarm: alarm });
        }
    }

    onSelectedFacilityEvent = (value) => {
        this.setState({ selectedFacilityEvent: value });
    }

    onDoubleClickAlarm = (alarm, type) => {
        if (type === SdmsResource.mode.monitoring) {
            const sensor = this.getSensorDataFromAlarm(alarm.orgSensorID, alarm.facilityType);
            
            if(sensor !== null && sensor !== undefined) {
                this.selectSensor(sensor);
            }
        } else if (type === SdmsResource.mode.equipment) {
            this.props.wsManager.sendFacilityAlarm(alarm.equipmentData.equipment.id, wsManager.facilityAlarmType.productFail, alarm.isAlarm);
        }
    }

    onSound = (value) => {
        this.setState({ alarmSound: value });
    }

    onMoveSelectedAlarm = (type) => {
        if (type === SdmsResource.mode.monitoring) {
            const selectedAlarm = this.state.selectedAlarm;
    
            if (selectedAlarm) {
                this.props.wsManager.showAlarm(selectedAlarm);
    
                const sensor = this.getSensorDataFromAlarm(selectedAlarm.orgSensorID, selectedAlarm.facilityType);
    
                if(sensor !== null && sensor !== undefined) {
                    this.selectSensor(sensor);
                }

                // 이벤트알람을 더블클릭했을 경우 현황정보 POI ON
                let typeName = '';
                if(selectedAlarm.facilityType === SdmsResource.facilityType.GAS) {
                    typeName = SDMSMainMenu.Gas_Sensor;
                } else if(selectedAlarm.facilityType === SdmsResource.facilityType.ATMOSPHERE) {
                    typeName = SDMSMainMenu.Stink_Sensor;
                } else if(selectedAlarm.facilityType === SdmsResource.facilityType.EMERGENCYBELL) {
                    typeName = SDMSMainMenu.EmergencyBell_Sensor;
                } else if(selectedAlarm.facilityType === SdmsResource.facilityType.THERMAL_CAMERA) {
                    typeName = SDMSMainMenu.ThermalImagingCamera_Sensor;
                } else if(selectedAlarm.facilityType === SdmsResource.facilityType.WORKER) {
                    typeName = SDMSMainMenu.Worker_Sensor;
                } 

                this.setVisiblePoi(typeName, true);
                this.setVisiblePopups(Monitoring.menu.statusInfo, true);
            }
            
            this.props.onClickChangeMode(SdmsResource.mode.monitoring);
        } else if (type === SdmsResource.mode.equipment) {
            this.props.onClickChangeMode(SdmsResource.mode.equipmentDetail);
            const selectedAlarm = this.state.selectedFacilityAlarm;

            this.props.wsManager.sendFacilityAlarm(selectedAlarm.equipmentData.equipment.id, wsManager.facilityAlarmType.productFail, selectedAlarm.isAlarm);
        }
    }

    // resetTimer = () => {
    //     // 마우스 움직임이 발생하면 타이머 재설정
    //     clearTimeout(this.idleTimer);
    //     this.idleTimer = setTimeout(this.triggerIdleFunction, this.idleTimeout);

    //     if(!this.state.rotationFromClick && this.props.wsManager && this.state.isAutoRotation) {
    //     // if(!this.state.rotationFromClick && this.props.wsManager) {
    //         this.props.wsManager.autoRotation(0);
    //         this.setState({ isAutoRotation: false });
    //     }
    // }
    
    // triggerIdleFunction = () => {
    //     if (this.props.wsManager) {
    //         this.props.wsManager.autoRotation(1);
    //         this.setState({ isAutoRotation: true });
    //     }
    // }

    checkRotationFromClick = (type) => {
        this.setState({ rotationFromClick: type });
    }

    setSelectedAlarm = (alarmID) => {
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        if (alarms) {
            const datas = alarms['allAlarmDatas'];

            if(datas?.length > 0) {
                this.setState({ selectedAlarm: null });

                for(let data of datas){

                    if(data.isAlarm && data.sensorZoneHistoryID !== alarmID) {
                        this.setState({ selectedAlarm: data });
                        break;
                    }
                }
            }

            const facilityDatas = alarms['equipmentAlarmDatas'];
            
            if(facilityDatas?.length > 0) {
                this.setState({ selectedFacilityAlarm: null });

                for(let data of facilityDatas){

                    if(data.isAlarm && data.sensorZoneHistoryID !== alarmID) {
                        this.setState({ selectedFacilityAlarm: data });
                        break;
                    }
                }
            }
        }
    }

    setVisiblePopups(menu, visible) {

        if(visible !== undefined && !visible) {
            this.props.wsManager.closePopup();
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
                if(menus[menu]) {
                    this.props.wsManager.closePopup();
                }
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

        if (menu === Monitoring.menu.ThermalImagingCamera && !visible) {
            this.setState({ cctvList: [], cctvIds: "", selectedSensor: null });

            if (this.props.wsManager) {
                this.props.wsManager.initThermalCCTVs();
            }
        }

        if (menu === Monitoring.menu.equipmentFaultyImage2 && !visible) {
            this.setState({ selectedFacilityEvent: null });
        }

        this.setState({ visiblePopups: menus })
        
        // 팝업 닫히는 애니메이션 효과
        this.hideAnimatePopup(menus, menus_old, () => {
            this.setState({ visiblePopups: menus })
        });
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
                    if (key === Monitoring.menu.eventInfo && this.state.sensorAlarms !== null && this.state.sensorAlarms.length > 0) {
                        hideID = "#" + SDMSResource.popupLayer.event;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.event);
                    }
                    else if (key === Monitoring.menu.statusInfo) {
                        hideID = "#" + SDMSResource.popupLayer.statusInfo;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.statusInfo);
                    }
                    else if (key === Monitoring.menu.dashboard) {
                        hideID = "#" + SDMSResource.popupLayer.dashboard;
                        target = document.getElementById("dsBot_" + SDMSResource.popupLayer.dashboard);
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
                $("#" + layerName).css({ "z-index": 2, "border": "1px solid #20DFA8" });
            } else {
                $("#" + layerName).css({ "z-index": 0, "border": "1px solid rgba(34, 42, 49, .9)" });
            }

        }
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
        var result = await AccountController.requestSaveOption(
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

    // SDMS 컴포넌트 마운트 시, 저장된 위치 값 호출
    async getPopupState() {
        // 세션에서 DB의 유저 key값 획득, 전체 팝업 좌표를 호출한다.

        const [resultUserInfo, errorMessage] = await AccountController.useAutoLogin();

        if(errorMessage) {
            this.showConfirmDialog([errorMessage], null, null, 'error');
            return;
        }

        let userInfo = await ProjectResource.initUserInfo(resultUserInfo.siteID);
        if (userInfo === null || userInfo === undefined)
            return;

        const result = await AccountController.requestGetOption(userInfo.id, 'popup');
        /*
         * propertyValue1 - x좌표 (pos)
         * propertyValue2 - y좌표 (pos)
         * propertyValue3 - height (size)
         * propertyValue4 - width (size)
        */
        if (typeof result !== 'undefined' && result[0] && result[1] != null) {
            var popupState = {}
            for (var i = 0 ; i < result[0].length ; i++) {
                popupState[result[0][i].subCategory] = {
                    id: result[0][i].id,
                    x: result[0][i].propertyValue1,
                    y: result[0][i].propertyValue2,
                    height: result[0][i].propertyValue3,
                    width: result[0][i].propertyValue4
                };
            }
            this.setState({ popupState: popupState });
        }
    }
    
    setCurrentView = (buildingID, zoneID, zoneName) => {
        this.setState({ currentView: { buildingID, zoneID, zoneName } });

        if (this.props.wsManager) {
            this.moveToZone(zoneID);
        }
    }

    resetSelectedStatus = () => {
        const selectedStatusInfo = { ...this.state.selectedStatusInfo };
        selectedStatusInfo.building = null;
        selectedStatusInfo.zone = null;
        selectedStatusInfo.sensorGroups = null;

        this.setVisiblePopups(SDMSResource.ID.menu.workerInfo, false);
        this.setVisiblePopups(SDMSResource.ID.menu.thermalImagingCamera, false);

        this.setState({ 
            selectedStatusInfo, 
            selectedSensor: null, 
            workerEventInfoPopupOpen: false, 
            sensorDetailInfoPopupOpen: false, 
            WorkerInfoEquipmentStatusPopupOpen: false, 
        });
    }

    moveToOutdoor = async (campusID, outdoorZones) => {
        if (campusID && outdoorZones && outdoorZones.length > 0) {
            const [zoneData, message] = await SdmsController.requestZoneData(outdoorZones[0].id);

            if (!zoneData) {
                if (message && message.length > 0) {
                    this.showConfirmDialog([message], null, null, 'error');
                }
            }
            else {
                const cameraPosition = {
                    x: zoneData.cameraPositionX,
                    y: zoneData.cameraPositionY,
                    z: zoneData.cameraPositionZ
                };

                const cameraRotation = {
                    x: zoneData.cameraRotationX,
                    y: zoneData.cameraRotationY,
                    z: zoneData.cameraRotationZ
                };

                const mode = SdmsResource.getMode();
                if (mode !== SdmsResource.mode.monitoring) {
                    this.props.onClickChangeMode(SdmsResource.mode.monitoring);
                }
                
                this.props.wsManager.moveToOutdoor(campusID, cameraPosition, cameraRotation);
            }
        }
    }

    async moveToZone(zoneID) {
        if (zoneID) {
            const [zoneData, message] = await SdmsController.requestZoneData(zoneID);

            if (!zoneData) {
                if (message && message.length > 0) {
                    this.showConfirmDialog([message], null, null, 'error');
                }
            }
            else {
                const cameraPosition = {
                    x: zoneData.cameraPositionX,
                    y: zoneData.cameraPositionY,
                    z: zoneData.cameraPositionZ
                };

                const cameraRotation = {
                    x: zoneData.cameraRotationX,
                    y: zoneData.cameraRotationY,
                    z: zoneData.cameraRotationZ
                };

                this.props.wsManager.moveToZone(zoneID, cameraPosition, cameraRotation);
            }
        }
    }

    setPopupUI(visiblePopups, mode) {
        let popups = [];

        // 모니터링모드일 경우
        if (mode === SDMSResource.mode.monitoring) {

            if (visiblePopups[Monitoring.menu.statusInfo]) {
                popups.push(
                    <StatusInfo key='sdms_popup_statusInfo'
                        setVisiblePopups={this.setVisiblePopups}
                        setActiveDragPopup={this.setActiveDragPopup}
                        zIndex={this.state.popupLayer.statusInfoZIndex}
                        popupType={SDMSResource.popupLayer.statusInfo}
                        popupState={this.state.popupState.statusInfo}
                        setPopupState={this.setPopupState}
    
                        buildingGroupList={this.state.buildingGroupList}
                        outdoorZones={this.state.outdoorZones}
                        sensorList={this.state.sensorList}
                        setCurrentView={this.setCurrentView}
                        moveToOutdoor={this.moveToOutdoor}
                        visibleSensorTypes={this.state.visibleSensorTypes}
                        setVisiblePoi={this.setVisiblePoi}
                        selectedSensor={this.state.selectedSensor}
                        selectSensor={this.selectSensor}
                        selectBuilding={this.selectBuilding}
                        selectZone={this.selectZone}
                        selectedStatusInfo={this.state.selectedStatusInfo}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }
    
            if (visiblePopups[Monitoring.menu.dashboard]) {
                popups.push(
                    <Dashboard key='sdms_popup_dashBoard'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.dashboardZIndex}
                        popupType={SDMSResource.popupLayer.dashboard}
                        popupState={this.state.popupState.dashboard}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        sensorList={this.state.sensorList}
                        mode={mode}
                        mesEquipmentData={this.state.mesEquipmentData}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }
    
            if (visiblePopups[Monitoring.menu.event]) {
                popups.push(
                    <Event key='sdms_popup_event'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.eventZIndex}
                        popupType={SDMSResource.popupLayer.event}
                        popupState={this.state.popupState.event}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        selectedAlarm={this.state.selectedAlarm}
                        selectedFacilityAlarm={this.state.selectedFacilityAlarm}
                        onSelectedAlarm={this.onSelectedAlarm}
                        handlePopup={this.handlePopup}
                        showConfirmDialog={this.showConfirmDialog}
                        onClose={this.state.confirmMessage.onClose}
                        mode={mode}
                        workerEventInfoPopupOpen={this.state.workerEventInfoPopupOpen}
                        onMoveSelectedAlarm={this.onMoveSelectedAlarm}
                        alarmSound={this.state.alarmSound}
                        onSound={this.onSound}
                        setSelectedAlarm={this.setSelectedAlarm}
                        wsManager={this.props.wsManager} 
                        visiblePopups={this.state.visiblePopups}
                        isPopupStateReset={this.props.isPopupStateReset}
                        eventTabMenu={this.state.eventTabMenu}
                        onChangeEventTabMenu={this.onChangeEventTabMenu}
                        eventDashboardPopupOpen={this.state.eventDashboardPopupOpen}
                    />
                );
            }
    
            if (visiblePopups[Monitoring.menu.workerInfo]) {
                popups.push(
                    <WorkerInfo key='sdms_popup_workerInfo'
                        setVisiblePopups={this.setVisiblePopups}
                        visiblePopups={this.state.visiblePopups}
                        zIndex={this.state.popupLayer.workerInfoZIndex}
                        popupType={SDMSResource.popupLayer.workerInfo}
                        popupState={this.state.popupState.workerInfo}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        handlePopup={this.handlePopup}
                        WorkerInfoEquipmentStatusPopupOpen={this.state.WorkerInfoEquipmentStatusPopupOpen}
                        apStatistics={this.state.apStatistics}
                        workerStatistics={this.state.workerStatistics}
                        selectedSensor={this.state.selectedSensor}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }
    
            if (visiblePopups[Monitoring.menu.thermalImagingCamera]) {
                popups.push(
                    <ThermalImagingCamera key='sdms_popup_thermalImagingCamera'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.thermalImagingCameraZIndex}
                        popupType={SDMSResource.popupLayer.thermalImagingCamera}
                        popupState={this.state.popupState.thermalImagingCamera}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        handlePopup={this.handlePopup}
                        streamServerURL={this.state.streamServerURL}
                        cctvList={this.state.cctvList}
                        cctvIds={this.state.cctvIds}
                        selectedSensor={this.state.selectedSensor}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }

            if (visiblePopups[Monitoring.menu.equipmentFaultyImage]) {
                popups.push(
                    <EquipmentFaultyImage key='sdms_popup_equipmentFaultyImage'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.equipmentFaultyImageZIndex}
                        popupType={SDMSResource.popupLayer.equipmentFaultyImage}
                        popupState={this.state.popupState.equipmentFaultyImage}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        selectedAlarm={this.state.selectedAlarm}
                        selectedFacilityAlarm={this.state.selectedFacilityAlarm}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }

        }

        // 설비모드일 경우
        if (mode === SDMSResource.mode.equipment) {
            if (visiblePopups[Monitoring.menu.equipmentStatus]) {
                popups.push(
                    <EquipmentStatus key='sdms_popup_equipmentStatus'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.equipmentStatusZIndex}
                        popupType={SDMSResource.popupLayer.equipmentStatus}
                        popupState={this.state.popupState.equipmentStatus}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        equipmentItem={this.state.equipmentItem}
                        onChangeEquipmentItem={this.onChangeEquipmentItem}
                        onClickMode={this.onClickMode}
                        facilityList={this.state.facilityList}
                        selectedFacilityID={this.state.selectedFacilityID}
                        selectFacility={this.selectFacility}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }
    
            if (visiblePopups[Monitoring.menu.equipmentFaulty]) {
                popups.push(
                    <EquipmentFaulty key='sdms_popup_equipmentFaulty'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.equipmentFaultyZIndex}
                        popupType={SDMSResource.popupLayer.equipmentFaulty}
                        popupState={this.state.popupState.equipmentFaulty}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        equipmentItem={this.state.equipmentItem}
                        onChangeEquipmentItem={this.onChangeEquipmentItem}
                        selectFacility={this.selectFacility}
                        facilityList={this.state.facilityList}
                        selectedFacilityID={this.state.selectedFacilityID}
                        onSelectedFacilityEvent={this.onSelectedFacilityEvent}
                        selectedFacilityEvent={this.state.selectedFacilityEvent}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }

            if (visiblePopups[Monitoring.menu.equipmentFaultyImage]) {
                popups.push(
                    <EquipmentFaultyImage key='sdms_popup_equipmentFaultyImage'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.equipmentFaultyImageZIndex}
                        popupType={SDMSResource.popupLayer.equipmentFaultyImage}
                        popupState={this.state.popupState.equipmentFaultyImage}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        selectedAlarm={this.state.selectedAlarm}
                        selectedFacilityAlarm={this.state.selectedFacilityAlarm}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }

            if (visiblePopups[Monitoring.menu.equipmentFaultyImage2]) {
                popups.push(
                    <EquipmentFaultyImage2 key='sdms_popup_equipmentFaultyImage2'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.equipmentFaultyImage2ZIndex}
                        popupType={SDMSResource.popupLayer.equipmentFaultyImage2}
                        popupState={this.state.popupState.equipmentFaultyImage2}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        selectedFacilityEvent={this.state.selectedFacilityEvent}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }

            if (visiblePopups[Monitoring.menu.dashboard]) {
                popups.push(
                    <Dashboard key='sdms_popup_dashBoard'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.dashboardZIndex}
                        popupType={SDMSResource.popupLayer.dashboard}
                        popupState={this.state.popupState.dashboard}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        sensorList={this.state.sensorList}
                        mode={mode}
                        mesEquipmentData={this.state.mesEquipmentData}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }
    
            if (visiblePopups[Monitoring.menu.event]) {
                popups.push(
                    <Event key='sdms_popup_event'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.eventZIndex}
                        popupType={SDMSResource.popupLayer.event}
                        popupState={this.state.popupState.event}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        selectedAlarm={this.state.selectedAlarm}
                        selectedFacilityAlarm={this.state.selectedFacilityAlarm}
                        onSelectedAlarm={this.onSelectedAlarm}
                        handlePopup={this.handlePopup}
                        showConfirmDialog={this.showConfirmDialog}
                        onClose={this.state.confirmMessage.onClose}
                        mode={mode}
                        workerEventInfoPopupOpen={this.state.workerEventInfoPopupOpen}
                        onMoveSelectedAlarm={this.onMoveSelectedAlarm}
                        alarmSound={this.state.alarmSound}
                        onSound={this.onSound}
                        setSelectedAlarm={this.setSelectedAlarm}
                        wsManager={this.props.wsManager}
                        visiblePopups={this.state.visiblePopups}
                        isPopupStateReset={this.props.isPopupStateReset}
                        eventTabMenu={this.state.eventTabMenu}
                        onChangeEventTabMenu={this.onChangeEventTabMenu}
                        eventDashboardPopupOpen={this.state.eventDashboardPopupOpen}
                    />
                );
            }
        }

        // 설비 상세정보모드일 경우
        if (mode === SDMSResource.mode.equipmentDetail) {

            popups.push(
                <EquipmentDetail key='sdms_popup_equipmentDetail'
                    facilityItem={this.state.facilityItem}
                />
            );
    
            if (visiblePopups[Monitoring.menu.event]) {
                popups.push(
                    <Event key='sdms_popup_event'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.eventZIndex}
                        popupType={SDMSResource.popupLayer.event}
                        popupState={this.state.popupState.event}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        selectedAlarm={this.state.selectedAlarm}
                        selectedFacilityAlarm={this.state.selectedFacilityAlarm}
                        onSelectedAlarm={this.onSelectedAlarm}
                        handlePopup={this.handlePopup}
                        showConfirmDialog={this.showConfirmDialog}
                        onClose={this.state.confirmMessage.onClose}
                        mode={mode}
                        workerEventInfoPopupOpen={this.state.workerEventInfoPopupOpen}
                        onMoveSelectedAlarm={this.onMoveSelectedAlarm}
                        alarmSound={this.state.alarmSound}
                        onSound={this.onSound}
                        setSelectedAlarm={this.setSelectedAlarm}
                        wsManager={this.props.wsManager} 
                        visiblePopups={this.state.visiblePopups}
                        isPopupStateReset={this.props.isPopupStateReset}
                        eventTabMenu={this.state.eventTabMenu}
                        onChangeEventTabMenu={this.onChangeEventTabMenu}
                        eventDashboardPopupOpen={this.state.eventDashboardPopupOpen}
                    />
                );
            }

            if (visiblePopups[Monitoring.menu.equipmentFaultyImage]) {
                popups.push(
                    <EquipmentFaultyImage key='sdms_popup_equipmentFaultyImage'
                        setVisiblePopups={this.setVisiblePopups}
                        zIndex={this.state.popupLayer.equipmentFaultyImageZIndex}
                        popupType={SDMSResource.popupLayer.equipmentFaultyImage}
                        popupState={this.state.popupState.equipmentFaultyImage}
                        setActiveDragPopup={this.setActiveDragPopup}
                        setPopupState={this.setPopupState}
                        selectedAlarm={this.state.selectedAlarm}
                        selectedFacilityAlarm={this.state.selectedFacilityAlarm}
                        isPopupStateReset={this.props.isPopupStateReset}
                    />
                );
            }
        }

        return popups;
    }

    getQuickButtonClassName(name) {
        if (this.state.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }

    // 네비게이션 바, 모드 선택 기능 (모니터링/설비)
    onClickMode = async (mode, data) => {

        /*if(data) {
            const [facilityData, errorMessage] = await SdmsController.requestFacilityData(data.id);

            if (facilityData) {
                const facilityItem = { ...this.state.facilityItem };
                facilityItem.data = data;
                facilityItem.details = facilityData;

                this.setState({ facilityItem: facilityItem });
            } else {
                this.showConfirmDialog([errorMessage], null, null, 'error');
            }
        }*/

        if (this.props.wsManager) {
            if (mode === SDMSResource.mode.equipment ||
                mode === SDMSResource.mode.equipmentDetail) {
                const subMode = data ? data.id : 1;
                this.props.wsManager.setViewMode(wsManager.mode.facility, subMode);
            }
            else if (mode === SDMSResource.mode.monitoring) {
                const subMode = 1;
                this.props.wsManager.setViewMode(wsManager.mode.monitoring, subMode);
            }
        }

        this.props.onClickChangeMode(mode);
    }

    onChangeEquipmentItem = (id) => {
        
        if (this.state.equipmentItem === id) {
            this.setState({ equipmentItem: 0, selectedFacilityID: null });
        } else {
            this.setState({ equipmentItem: id, selectedFacilityID: null });
        }
    }


    handlePopup = (type, isOpen) => {
        
        // 작업자 이벤트 상세정보 팝업
        if(type === SDMSResource.ID.menu.workerEventInfo) {
            this.setState({ workerEventInfoPopupOpen: isOpen });

            if(!isOpen) {
                this.props.wsManager.closePopup();
            }
        }

        //장비현황 상세정보 팝업
        if(type === SDMSResource.ID.menu.workerInfoEquipmentStatus) {
            this.setState({ WorkerInfoEquipmentStatusPopupOpen: isOpen });

            if(!isOpen) {
                this.props.wsManager.closePopup();
            }
        }

        // 이벤트 대시보드 팝업
        if(type === SDMSResource.ID.menu.eventDashboard) {
            this.setState({ eventDashboardPopupOpen: isOpen });
        }

        // 센서 상세정보 팝업
        if(type === SDMSResource.ID.menu.statusPsmSensorInfo) {
            clearInterval(this.atmosphereSensorInterval);
            clearInterval(this.gasSensorInterval);
            this.setState({ sensorDetailInfo: {}, sensorDetailInfoPopupOpen: isOpen });
        }
    }

    getNameTag () {
        const campus2Datas = this.state.campus2Datas;

        let nameTag = [];

        if(campus2Datas) {
            nameTag.push(
                <div className='tagDescription'>
                    <p>공장 정보</p>
                    <ul>
                        <li className='landArea'>
                            <div>
                                <p>대지면적</p>
                                <p>{parseInt(campus2Datas[0].value).toLocaleString()}평</p>
                            </div>
                            <p>{parseInt(campus2Datas[1].value).toLocaleString()}m</p>
                        </li>
                        <li className='buildingArea'>
                            <div>
                                <p>건축면적</p>
                                <p>{parseInt(campus2Datas[2].value).toLocaleString()}평</p>
                            </div>
                            <p>{parseInt(campus2Datas[3].value).toLocaleString()}m</p>
                        </li>
                        <li className='addressArea'>
                            <div>
                                <p>{campus2Datas[4].name}</p>
                                <p>{campus2Datas[4].value}</p>
                            </div>
                            <img src={campus2Datas[5].value} alt='공장동 사진'></img>
                        </li>
                    </ul>
                </div>
            );

            return nameTag;
        }
    }

    // app to web
    onSelect = (buildingID, facilityID) => {

        if(buildingID && facilityID === null) {

            if(buildingID === this.state.selectedStatusInfo.building) {

                const selectedStatusInfo = { ...this.state.selectedStatusInfo };
                selectedStatusInfo.building = null;
                this.setState({ selectedStatusInfo });
            }
            else {
                const selectedStatusInfo = { ...this.state.selectedStatusInfo };
                selectedStatusInfo.building = buildingID;
                this.setState({ selectedStatusInfo });
            }
        }
        else if(facilityID && buildingID === null) {
            this.setState({ selectedFacilityID: facilityID, equipmentItem: facilityID });
        }
    }

    // app to web
    moveToFacilityView = (facilityID) => {
        if(facilityID) {
            this.props.onClickChangeMode(SdmsResource.mode.equipmentDetail);
            this.setState({ selectedFacilityViewID: facilityID });
        }
    }

    // web to app
    selectBuilding = (buildingID) => {
        this.setState({ selectedSensor: null });

        if(buildingID) {
            this.props.wsManager.selectBuilding(buildingID);

            if(buildingID === this.state.selectedStatusInfo.building) {
                const selectedStatusInfo = { ...this.state.selectedStatusInfo };
                selectedStatusInfo.building = null;
                selectedStatusInfo.zone = null;
                selectedStatusInfo.sensorGroups = null;
                this.setState({ selectedStatusInfo });
            }
            else {
                const selectedStatusInfo = { ...this.state.selectedStatusInfo };
                selectedStatusInfo.building = buildingID;
                selectedStatusInfo.zone = null;
                selectedStatusInfo.sensorGroups = null;
                this.setState({ selectedStatusInfo });
            }

            this.setState({ sensorDetailInfoPopupOpen: false });
        }

        clearInterval(this.atmosphereSensorInterval);
        clearInterval(this.gasSensorInterval);
    }

    selectZone = (zoneID) => {
        this.setState({ selectedSensor: null });

        if(zoneID) {
            if(zoneID === this.state.selectedStatusInfo.zone) {
                const selectedStatusInfo = { ...this.state.selectedStatusInfo };
                selectedStatusInfo.zone = null;
                selectedStatusInfo.sensorGroups = null;
                this.setState({ selectedStatusInfo });
            }
            else {
                const selectedStatusInfo = { ...this.state.selectedStatusInfo };
                selectedStatusInfo.zone = zoneID;
                selectedStatusInfo.sensorGroups = null;
                this.setState({ selectedStatusInfo });
            }
        }
    }

    // web to app
    selectFacility = (facilityID) => {
        if(facilityID) {
            this.props.wsManager.selectFacility(facilityID);
        }
    }

    getAlarmList(alarmType) {
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;

        const alarmDatas = [];

        if (alarms) {
            if (alarmType < 0 || alarmType === wsManager.alarmType.safetyMode) {
                if (alarms.allAlarmDatas) {
                    const allAlarmDatas = [...alarms.allAlarmDatas];

                    for (const alarmData of allAlarmDatas) {
                        alarmDatas.push(alarmData);
                    }
                }
            }

            if (alarmType < 0 || alarmType === wsManager.alarmType.facilityMode) {
                if (alarms.equipmentAlarmDatas) {
                    const equipmentAlarmDatas = [...alarms.equipmentAlarmDatas];

                    for (const alarmData of equipmentAlarmDatas) {
                        alarmDatas.push(alarmData);
                    }
                }
            }
        }

        return alarmDatas;
    }

    playAlarmSound() {
        const currentAlarm = this.state.eventTabMenu === SdmsResource.mode.monitoring ? this.state.selectedAlarm : this.state.selectedFacilityAlarm;

        // 유형별 알람 설정에서 체크된 센서만 알람 사운드 송출
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        const receiveAtmosphereAlarm = option3DSensor?.receiveAtmosphereAlarm;
        const receiveEmergencyBellAlarm = option3DSensor?.receiveEmergencyBellAlarm;
        const receiveFireAlarm = option3DSensor?.receiveFireAlarm;
        const receiveGasAlarm = option3DSensor?.receiveGasAlarm;
        const receiveThermalCameraAlarm = option3DSensor?.receiveThermalCameraAlarm;
        const receiveWorkerAlarm = option3DSensor?.receiveWorkerAlarm;
        const receiveFacilityError = option3DSensor?.receiveFacilityError;

        let onAlarm = true;

        if (currentAlarm?.facilityType === SdmsResource.facilityType.FIRE) {
            onAlarm = receiveFireAlarm;
        }
        else if (currentAlarm?.facilityType === SdmsResource.facilityType.ATMOSPHERE) {
            onAlarm = receiveAtmosphereAlarm;
        }
        else if (currentAlarm?.facilityType === SdmsResource.facilityType.EMERGENCYBELL) {
            onAlarm = receiveEmergencyBellAlarm;
        }
        else if (currentAlarm?.facilityType === SdmsResource.facilityType.GAS) {
            onAlarm = receiveGasAlarm;
        }
        else if (currentAlarm?.facilityType === SdmsResource.facilityType.THERMAL_CAMERA) {
            onAlarm = receiveThermalCameraAlarm;
        }
        else if (currentAlarm?.facilityType === SdmsResource.facilityType.WORKER) {
            onAlarm = receiveWorkerAlarm;
        }
        else if (currentAlarm?.facilityType === SdmsResource.facilityType.EQUIPMENT) {
            onAlarm = receiveFacilityError;
        }

        if (!onAlarm) {
            return <></>
        }
        else {
            if (this.state.alarmSound && currentAlarm?.isAlarm) {
                if (currentAlarm.alarmDepth === 3) {
                    return (
                        <audio autoPlay={true} loop={true}
                            src="/sound/alarm_level3.mp3">
                        </audio>
                    );
                }
                else if (currentAlarm.alarmDepth === 4) {
                    return (
                        <audio autoPlay={true} loop={true}
                            src="/sound/alarm_level4.mp3">
                        </audio>
                    );
                }
                else {
                    return (
                        <audio autoPlay={true} loop={true}
                            src="/sound/alarm_level2.mp3">
                        </audio>
                    );
                }
            }
        }
    }

    onChangeEventTabMenu = (menu) => {
        this.setState({ eventTabMenu: menu });
    }

    render() {
        const mode = SdmsResource.getMode();
        const campusID = this.state.campusID;
        const visiblePopups = { ...this.state.visiblePopups };

        const popupUI = this.setPopupUI(visiblePopups, mode);

        return (
            <>
            <MonitoringComponent className='UI_Section monitoring'>
                {
                    // 1공장동일 경우에만 팝업 show
                    campusID === ProjectResource.campus.campus_1 &&
                    <>
                        {popupUI}
                        <NavigationBar 
                            setVisiblePopups={this.setVisiblePopups}
                            visiblePopups={this.state.visiblePopups}
                            onClickMode={this.onClickMode}
                            mode={mode}
                        />

                        {
                            mode !== SDMSResource.mode.equipmentDetail &&
                                <Toolbar 
                                    wsManager={this.props.wsManager} 
                                    currentView={this.state.currentView}
                                    checkRotationFromClick={this.checkRotationFromClick}
                                    moveToOutdoor={this.moveToOutdoor}
                                    outdoorZones={this.state.outdoorZones}
                                    resetSelectedStatus={this.resetSelectedStatus}
                                />
                        }

                        {
                            (this.state.sensorDetailInfoPopupOpen && mode === SdmsResource.mode.monitoring) &&
                                <StatusPsmSensorInfo key='sdms_popup_statusPsmSensorInfo'
                                    setVisiblePopups={this.setVisiblePopups}
                                    zIndex={this.state.popupLayer.statusPsmSensorInfoZIndex}
                                    popupType={SDMSResource.popupLayer.statusPsmSensorInfo}
                                    popupState={this.state.popupState.statusPsmSensorInfo}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    setPopupState={this.setPopupState}
                                    sensorDetailInfo={this.state.sensorDetailInfo}
                                    handlePopup={this.handlePopup}
                                    isPopupStateReset={this.props.isPopupStateReset}
                                />
                        }

                        {
                            this.state.workerEventInfoPopupOpen &&
                                <WorkerEventInfo key='sdms_popup_workerEventInfo'
                                    setVisiblePopups={this.setVisiblePopups}
                                    zIndex={this.state.popupLayer.workerEventInfoZIndex}
                                    popupType={SDMSResource.popupLayer.workerEventInfo}
                                    popupState={this.state.popupState.workerEventInfo}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    setPopupState={this.setPopupState}
                                    handlePopup={this.handlePopup}
                                    selectedAlarm={this.state.selectedAlarm}
                                    showConfirmDialog={this.showConfirmDialog}
                                    isPopupStateReset={this.props.isPopupStateReset}
                                />
                        }

                        {
                            (this.state.WorkerInfoEquipmentStatusPopupOpen && mode === SDMSResource.mode.monitoring) &&
                                <WorkerInfoEquipmentStatus key='sdms_popup_workerInfoEquipmentStatus'
                                    setVisiblePopups={this.setVisiblePopups}
                                    zIndex={this.state.popupLayer.workerInfoEquipmentStatusZIndex}
                                    popupType={SDMSResource.popupLayer.workerInfoEquipmentStatus}
                                    popupState={this.state.popupState.workerInfoEquipmentStatus}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    setPopupState={this.setPopupState}
                                    showConfirmDialog={this.showConfirmDialog}
                                    handlePopup={this.handlePopup}
                                    isPopupStateReset={this.props.isPopupStateReset}
                                />
                        }

                        {
                            (this.state.eventDashboardPopupOpen && mode !== SdmsResource.mode.equipmentDetail) &&
                                <EventDashboard key='sdms_popup_eventDashboard'
                                    handlePopup={this.handlePopup}
                                    mode={mode}
                                />
                        }

                        {/* <div id={'dsMap'}>
                            <h3 className={'dsmTitle'}>{this.state.currentView.zoneName}</h3>
                        </div> */}
                    </>
                }

                {
                    // 2공장동일 경우에만 팝업 show
                    campusID === ProjectResource.campus.campus_2 &&
                    <>
                        <Toolbar 
                            wsManager={this.props.wsManager} 
                            currentView={this.state.currentView}
                            checkRotationFromClick={this.checkRotationFromClick}
                        />

                        {
                            this.getNameTag()
                        }
                    </>
                }
            </MonitoringComponent>
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClose={this.state.confirmMessage.onClose}
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    type={this.state.confirmMessage.type}
                />
            }
            {
                this.playAlarmSound()
            }
            </>
        );
    }
}

export default withRouter(Monitoring);