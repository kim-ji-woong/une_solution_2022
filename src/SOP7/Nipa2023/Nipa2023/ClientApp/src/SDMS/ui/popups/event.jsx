import React, { Component } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';
import Monitoring from '../monitoring';
import PopupDraggable from './popupDraggable';

import { Scrollbars } from 'react-custom-scrollbars-2';
import { SdmsScrollbar } from './SdmsScrollbar';

import { EventComponent, EventExitMemoComponent } from '../../styled/sdmsPopupsStyled';
import { UserDispatch } from '../../../Root/resource/userDispatch';
import SDMSResource from '../../resource/id';
import { SdmsController } from '../../services/sdmsController';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../resource/id';
import { ModalBackground } from '../../../Root/styled/theme';
import wsManager from '../../../Root/services/wsManager';

class Event extends Component {
    static contextType = UserDispatch;

    constructor(props) {
        super(props);

        this.state = {
            exitMemoPopup: false,
            exitAlarm: {},
            showTooltip: false,
            tooltipTop: 0,
            tooltipLeft: 0,
            tooltipContent: '',
            isClosed: false
        }

        this.props = props;

        this.refAlarmList = React.createRef();
        this.refTitle = React.createRef();
        this.refHeader = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTable = React.createRef();
    }

    componentDidMount() {

        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }

        this.initPopupState();

        $('.scrollbar').scrollTop(0);

        this.setScrollbar();

        if(this.props.mode === SdmsResource.mode.monitoring) {
            this.props.onChangeEventTabMenu(SdmsResource.mode.monitoring);
        }
        else {
            this.props.onChangeEventTabMenu(SdmsResource.mode.equipment);
        }
    }

    componentDidUpdate(prevProps) {
        this.setScrollbar();

        if(prevProps.mode !== this.props.mode) {
            if(this.props.mode === SdmsResource.mode.monitoring) {
                this.props.onChangeEventTabMenu(SdmsResource.mode.monitoring);
            }
            else {
                this.props.onChangeEventTabMenu(SdmsResource.mode.equipment);
            }
        }

        if(prevProps.isPopupStateReset !== this.props.isPopupStateReset) {
            this.repositionPopup();
        }
    }

    initPopupState() {
        var popup = document.getElementsByClassName('UI_Section event')[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        } else {
            // DB에 값이 따로 없을 경우
            let data = SDMSResource.popupResetLocation[this.props.popupType];

            popup.style.left = data.x;
            popup.style.top = data.y;
            popup.style.width = data.width;
            popup.style.height = data.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup() {

        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        let data = SDMSResource.popupResetLocation[this.props.popupType];

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    setScrollbar() {
        const rectAlarmList = this.refAlarmList.current.getBoundingClientRect();
        const rectTitle = this.refTitle.current.getBoundingClientRect();
        const rectHeader = this.refHeader.current.getBoundingClientRect();

        const width = rectHeader.width;
        const height = rectAlarmList.height - rectTitle.height - rectHeader.height - 5;

        let scrollVisible = false;

        if (this.refTable.current) {
            const rectTable = this.refTable.current.getBoundingClientRect();

            if (rectTable.height > height) {
                scrollVisible = true;
            }
        }

        SdmsScrollbar.setContentStyle(this.refScrollbar.current, width, height, scrollVisible);
    }

    onExitEventConfirm = (type) => {
        if(type === SdmsResource.mode.monitoring) {
            const selectedAlarm = this.props.selectedAlarm;
    
            if(selectedAlarm.facilityType === SdmsResource.facilityType.WORKER) {
                this.setState({ exitAlarm: selectedAlarm });
                this.props.showConfirmDialog(['알람을 종료하시겠습니까?'], ['오작동', '확인'], this.showManualReport, 'error');
            }
            else {
                this.setState({ exitAlarm: selectedAlarm });
                this.props.showConfirmDialog(['알람을 종료하시겠습니까?'], ['오작동', '확인'], this.clearAlarm, 'error');
            }
        } else if(type === SdmsResource.mode.equipment) {
            const selectedAlarm = this.props.selectedFacilityAlarm;

            this.setState({ exitAlarm: selectedAlarm });
            this.props.showConfirmDialog(['알람을 종료하시겠습니까?'], ['확인'], this.clearEquipmentAlarm, 'error');
        }
    }

    async onSituationNotice() {
        const alarm = this.props.selectedAlarm;
        if (!alarm.isAlarm) {
            this.props.showConfirmDialog(['종료된 이벤트입니다.'], null, null, 'error');
            return;
        }
        // SOP 실행 상태 (-1: SOP 시작 하기전, 0: SOP 실행 요청, 1: SOP 실행중, 2: SOP종료)
        if (alarm.sopStatus === -1) {
            this.props.showConfirmDialog(['SOP를 실행하시겠습니까?'], ['확인', '취소'], this.onRunSOP, 'error');
        }
        else if (alarm.sopStatus === 0) {
            this.props.showConfirmDialog(['해당 SOP는 이미 실행 요청되었습니다'], null, null, 'error');
        }
        else if (alarm.sopStatus === 1) {
            this.props.showConfirmDialog(['해당 SOP가 이미 진행중입니다'], null, null, 'error');
        }
        else if (alarm.sopStatus === 2) {
            this.props.showConfirmDialog(['해당 SOP는 이미 종료되었습니다'], null, null, 'error');
        }           
    }

    onRunSOP = async (index) => {
        if (index === 0) {
            this.props.history.push(ProjectResource.path.sopSimulator);

            const alarm = this.props.selectedAlarm;
            await SdmsController.requestSituationNotice(alarm.facilityType, alarm.sensorZoneID);
            this.props.onClose();
        }
        else {
            this.props.onClose();
        }
    }

    onMoveSelectedAlarm(type) {
        this.props.onMoveSelectedAlarm(type);
    }

    showManualReport = (index) => {
        if (index === 0) {
            this.clearAlarm(index);
        }
        else {
            this.props.onClose();
            this.setState({ exitMemoPopup: true });
        }
    }

    // 알람 유형이 작업자일 경우 조치사항 필수 입력
    clearAlarm = async (index) => {
        const userInfo = ProjectResource.getUserInfo();
        const alarm = this.state.exitAlarm;

        if (userInfo && alarm) {

            // 오작동 버튼 클릭했을 경우
            if (index === 0) {
                const result = await SdmsController.requestClearAlarm(alarm.sensorZoneID, alarm.sensorZoneHistoryID, userInfo.id, alarm.memo, true);

                if(result.success) {
                    this.props.onClose();
                    this.setState({ exitAlarm: {} });
                }
                else {
                    this.props.onClose();
                    this.props.showConfirmDialog([result.message], null, null, 'error');
                }
            }
            else {
                const result = await SdmsController.requestClearAlarm(alarm.sensorZoneID, alarm.sensorZoneHistoryID, userInfo.id, alarm.memo);
    
                if(result.success) {
                    // 작업자 센서 알람 종료시 조치사항 팝업 close
                    if(alarm.facilityType === SdmsResource.facilityType.WORKER) {
                        this.onClosePopup(false);

                        if(alarm.materialType === SdmsResource.facilityType.EQUIPMENT_TIGHTENING) {
                            this.props.wsManager.sendFacilityAlarm(alarm.facilityNo, wsManager.facilityAlarmType.stuckWorker, false);
                        }
                    }
                    
                    this.props.onClose();
                    this.setState({ exitAlarm: {} });
                }
                else {
                    this.props.showConfirmDialog([result.message], null, null, 'error');
                }
            }

            this.props.setSelectedAlarm(alarm.sensorZoneHistoryID);
        }
    }

    clearEquipmentAlarm = async () => {
        const userInfo = ProjectResource.getUserInfo();
        const alarm = this.state.exitAlarm;

        if (userInfo && alarm) {

            const result = await SdmsController.requestClearAlarm(alarm.sensorZoneID, alarm.sensorZoneHistoryID, userInfo.id, alarm.memo);

            if(result.success) {
                // this.props.wsManager.sendFacilityAlarm(alarm.equipmentData.equipment.id, wsManager.facilityAlarmType.productFail, false);
                this.props.onClose();
                this.setState({ exitAlarm: {} });
            }
            else {
                this.props.showConfirmDialog([result.message], null, null, 'error');
            }

            this.props.setSelectedAlarm(alarm.sensorZoneHistoryID);
        }
    }

    setExitAlarmMemo = (alarm) => {
        if(alarm) {
            this.setState({ exitAlarm: alarm });
            this.clearAlarm();
        }
    }

    onClosePopup = (value) => {
        this.setState({ exitMemoPopup: value });
    }

    onSelectedAlarm = (alarm, type) => {
        this.props.onSelectedAlarm(alarm, type);
        this.props.handlePopup(SDMSResource.ID.menu.workerEventInfo, false);

        if(alarm.isAlarm) {
            this.setState({ isClosed : false });
        }
        else {
            this.setState({ isClosed : true });
        }
    }

    getAlarmTable() {
        let grid = [];
        let closedGrid = [];
        let activeAlarmLength = 0;      // 종료되지 않은 알람 수

        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        const receiveAtmosphereAlarm = option3DSensor.receiveAtmosphereAlarm;
        const receiveEmergencyBellAlarm = option3DSensor.receiveEmergencyBellAlarm;
        const receiveFireAlarm = option3DSensor.receiveFireAlarm;
        const receiveGasAlarm = option3DSensor.receiveGasAlarm;
        const receiveThermalCameraAlarm = option3DSensor.receiveThermalCameraAlarm;
        const receiveWorkerAlarm = option3DSensor.receiveWorkerAlarm;

        // 선택된 알람
        const selectedAlarm = this.props.selectedAlarm;
        
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;
        let alarmCount = 1;
        
        if (alarms) {
        const data = alarms['allAlarmDatas'];

            if (data?.length === 0) {
                grid.push(
                    <div className={'dseInfo'}>
                        <div>
                            <p>활성화된 이벤트가 없습니다.</p>
                        </div>
                    </div>
                )
            } else {
                for (let i = 0; i < data.length; i++){

                    const dt = new Date(data[i].eventTime);
                    const [ymd, hms] = SdmsResource.getDate(dt);

                    let sopStatusText = '대기';
                    let alarmStatusText = "발생";
                    let alarmStatusClassName = 'alarmStatusOn';

                    if (data[i].sopStatus === 1) {
                        sopStatusText = '실행중';
                    }
                    else if (data[i].sopStatus === 2) {
                        sopStatusText = '완료';
                    }

                    // 상황유형
                    let alarmType = '';

                    // 유형별 알람 설정 옵션 정보에 따른 표출 여부
                    let showAlarm = false;

                    if (data[i].facilityType === SDMSResource.facilityType.FIRE) {
                        alarmType = SDMSResource.ID.sensor.fire;
                        showAlarm = receiveFireAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.ATMOSPHERE) {
                        alarmType = SDMSResource.ID.sensor.atmosphere;
                        showAlarm = receiveAtmosphereAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.EMERGENCYBELL) {
                        alarmType = SDMSResource.ID.sensor.emergencyBell;
                        showAlarm = receiveEmergencyBellAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.GAS) {
                        alarmType = SDMSResource.ID.sensor.gas;
                        showAlarm = receiveGasAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.THERMAL_CAMERA) {
                        alarmType = SDMSResource.ID.sensor.thermalCamera;
                        showAlarm = receiveThermalCameraAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.WORKER && data[i].materialType === SDMSResource.facilityType.EMERGENCY_CALL) {
                        alarmType = SDMSResource.ID.sensor.emergencyCall;
                        showAlarm = receiveWorkerAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.WORKER && data[i].materialType === SDMSResource.facilityType.FALL) {
                        alarmType = SDMSResource.ID.sensor.fall;
                        showAlarm = receiveWorkerAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.WORKER && data[i].materialType === SDMSResource.facilityType.EQUIPMENT_TIGHTENING) {
                        alarmType = SDMSResource.ID.sensor.equipmentTightening;
                        showAlarm = receiveWorkerAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.WORKER && data[i].materialType === SDMSResource.facilityType.PAIR_TWO) {
                        alarmType = SDMSResource.ID.sensor.pairTwo;
                        showAlarm = receiveWorkerAlarm;
                    }
                    else if (data[i].facilityType === SDMSResource.facilityType.WORKER && data[i].materialType === SDMSResource.facilityType.BATTERY_CHANGE) {
                        alarmType = SDMSResource.ID.sensor.batteryChange;
                        showAlarm = receiveWorkerAlarm;
                    }

                    let rowClassName = '';
                    if (data[i].sensorZoneHistoryID === selectedAlarm?.sensorZoneHistoryID && data[i].sensorZoneID === selectedAlarm?.sensorZoneID) { // 선택된 row
                        rowClassName = 'selectedAlarm';
                    }
                    else if (!data[i].isAlarm) { // 알람 종료된 row
                        rowClassName = 'closedAlarm';
                    }

                    if(data[i].isAlarm) {
                        activeAlarmLength++;
                    }
                    else {
                        // isAlarm이 false면 알람 종료
                        alarmStatusText = "종료";
                        alarmStatusClassName = 'alarmStatusOff';
                    }

                    if(showAlarm) {
                        if(data[i].isAlarm) {
                            grid.push(
                                <tr key={"eventGrid_" + alarmCount}
                                    className={rowClassName}
                                    onClick={() => this.onSelectedAlarm(data[i], SdmsResource.mode.monitoring)}
                                    onDoubleClick={() => this.onMoveSelectedAlarm(SdmsResource.mode.monitoring)}
                                >
                                    <td>{ymd}<br />{hms}</td> 
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, alarmType)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                            {alarmType}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, data[i].positionName)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                        {data[i].positionName}
                                        </span>
                                    </td>
                                    <td className={alarmStatusClassName}>{alarmStatusText}</td>
                                    <td>{sopStatusText}</td>
                                </tr>
                            );
                        }
                        else {
                            closedGrid.push(
                                <tr key={"eventGrid_" + alarmCount}
                                    className={rowClassName}
                                    onClick={() => this.onSelectedAlarm(data[i], SdmsResource.mode.monitoring)}
                                >
                                    <td>{ymd}<br />{hms}</td> 
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, alarmType)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                            {alarmType}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, data[i].positionName)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                        {data[i].positionName}
                                        </span>
                                    </td>
                                    <td className={alarmStatusClassName}>{alarmStatusText}</td>
                                    <td>{sopStatusText}</td>
                                </tr>
                            );
                        }
                    }

                    alarmCount += 1;
                }
            }
        }

        return [grid, closedGrid, activeAlarmLength];
    }

    getFacilityAlarmTable() {
        let facilityGrid = [];
        let facilityClosedGrid = [];
        let facilityActiveAlarmLength = 0;      // 종료되지 않은 알람 수

        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;

        const receiveFacilityError = option3DSensor.receiveFacilityError;

        // 선택된 알람
        const selectedAlarm = this.props.selectedFacilityAlarm;
        
        const { alarm } = this.context;
        const alarms = alarm[0].alarmState;
        let alarmCount = 1;
        
        if (alarms) {
        const data = alarms['equipmentAlarmDatas'];

            if (data?.length === 0) {
                facilityGrid.push(
                    <div className={'dseInfo'}>
                        <div>
                            <p>활성화된 이벤트가 없습니다.</p>
                        </div>
                    </div>
                )
            } else {
                for (let i = 0; i < data.length; i++){

                    const dt = new Date(data[i].eventTime);
                    const [ymd, hms] = SdmsResource.getDate(dt);

                    let alarmStatusText = "발생";
                    let alarmStatusClassName = 'alarmStatusOn';

                    // 불량유형
                    let alarmType = data[i]?.equipmentData?.alarmType;

                    // 유형별 알람 설정 옵션 정보에 따른 표출 여부
                    let showAlarm = false;

                    if (data[i].facilityType === SDMSResource.facilityType.EQUIPMENT) {
                        showAlarm = receiveFacilityError;
                    }

                    let rowClassName = '';
                    if (data[i].sensorZoneHistoryID === selectedAlarm?.sensorZoneHistoryID && data[i].sensorZoneID === selectedAlarm?.sensorZoneID) { // 선택된 row
                        rowClassName = 'selectedAlarm';
                    }
                    else if (!data[i].isAlarm) { // 알람 종료된 row
                        rowClassName = 'closedAlarm';
                    }

                    if(data[i].isAlarm) {
                        facilityActiveAlarmLength++;
                    }
                    else {
                        // isAlarm이 false면 알람 종료
                        alarmStatusText = "종료";
                        alarmStatusClassName = 'alarmStatusOff';
                    }

                    if(showAlarm) {
                        if(data[i].isAlarm) {
                            facilityGrid.push(
                                <tr key={"eventGrid_" + alarmCount}
                                    className={rowClassName}
                                    onClick={() => this.onSelectedAlarm(data[i], SdmsResource.mode.equipment)}
                                    onDoubleClick={() => this.onMoveSelectedAlarm(SdmsResource.mode.equipment)}
                                >
                                    <td>{ymd}<br />{hms}</td> 
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, alarmType)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                            {alarmType}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, data[i]?.equipmentData?.equipment?.name)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                        {data[i]?.equipmentData?.equipment?.name}
                                        </span>
                                    </td>
                                    <td className={alarmStatusClassName}>{alarmStatusText}</td>
                                </tr>
                            );
                        }
                        else {
                            facilityClosedGrid.push(
                                <tr key={"eventGrid_" + alarmCount}
                                    className={rowClassName}
                                    onClick={() => this.onSelectedAlarm(data[i], SdmsResource.mode.equipment)}
                                >
                                    <td>{ymd}<br />{hms}</td> 
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, alarmType)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                            {alarmType}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            onMouseOver={(e) => this.handleTooltip(e, data[i]?.equipmentData?.equipment?.name)}
                                            onMouseLeave={() => this.setState({ showTooltip: false })}
                                        >
                                            {data[i]?.equipmentData?.equipment?.name}
                                        </span>
                                    </td>
                                    <td className={alarmStatusClassName}>{alarmStatusText}</td>
                                </tr>
                            );
                        }
                    }

                    alarmCount += 1;
                }
            }
        }

        return [facilityGrid, facilityClosedGrid, facilityActiveAlarmLength];
    }

    getAlarmInfo() {

        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;
        
        const receiveAtmosphereAlarm = option3DSensor.receiveAtmosphereAlarm;
        const receiveEmergencyBellAlarm = option3DSensor.receiveEmergencyBellAlarm;
        const receiveFireAlarm = option3DSensor.receiveFireAlarm;
        const receiveGasAlarm = option3DSensor.receiveGasAlarm;
        const receiveThermalCameraAlarm = option3DSensor.receiveThermalCameraAlarm;
        const receiveWorkerAlarm = option3DSensor.receiveWorkerAlarm;

        // 유형별 알람 설정 옵션 정보에 따른 표출 여부
        let showAlarm = false;

        const selectedAlarm = this.props.selectedAlarm;

        if((selectedAlarm?.facilityType === SDMSResource.facilityType.FIRE && receiveFireAlarm) ||
        (selectedAlarm?.facilityType === SDMSResource.facilityType.ATMOSPHERE && receiveAtmosphereAlarm) ||
        (selectedAlarm?.facilityType === SDMSResource.facilityType.EMERGENCYBELL && receiveEmergencyBellAlarm) ||
        (selectedAlarm?.facilityType === SDMSResource.facilityType.GAS && receiveGasAlarm) ||
        (selectedAlarm?.facilityType === SDMSResource.facilityType.THERMAL_CAMERA && receiveThermalCameraAlarm) ||
        (selectedAlarm?.facilityType === SDMSResource.facilityType.WORKER && receiveWorkerAlarm)) {
            showAlarm = true;
        }

        if (selectedAlarm === null || !showAlarm) {

            return (
                <div className={'dseInfo'}>
                    <div>
                        <p>활성화된 이벤트가 없습니다.</p>
                    </div>
                </div>
            );
        }

        const dt = new Date(selectedAlarm.eventTime);
        const [ymd, hms] = SdmsResource.getDate(dt);

        let isWorkerType = false;
        let evtClassName = 'evtFIRE';

        if (selectedAlarm.facilityType) {
            if (selectedAlarm.facilityType === SDMSResource.facilityType.FIRE) {
                evtClassName = "evtFIRE";
            }
            else if (selectedAlarm.facilityType === SDMSResource.facilityType.ATMOSPHERE) {
                evtClassName = "evtSTINK";
            }
            else if (selectedAlarm.facilityType === SDMSResource.facilityType.EMERGENCYBELL) {
                evtClassName = "evtEMERGENCY_BELL";
            }
            else if (selectedAlarm.facilityType === SDMSResource.facilityType.GAS) {
                evtClassName = "evtGAS";
            }
            else if (selectedAlarm.facilityType === SDMSResource.facilityType.WORKER) {
                evtClassName = "evtWORKER";
                isWorkerType = true;
            }
        }

        return (
            <div className={'dseInfo'}>
                <em className={evtClassName}>이벤트 아이콘</em>
                <div>
                    <p>{selectedAlarm.positionName}</p>
                    <p>{ymd + ' ' + hms}</p>
                    <p>{selectedAlarm.message}</p>
                </div>
                {
                    isWorkerType && 
                    <button 
                        className={this.props.workerEventInfoPopupOpen ? 'moreInfo on' : 'moreInfo'}
                        onClick={() => this.props.handlePopup(SDMSResource.ID.menu.workerEventInfo, true)}
                    />
                }
            </div>
        );
    }

    getFacilityAlarmInfo() {
        
        // 유형별 알람 설정 옵션 정보
        const { setting } = this.context;
        const option3DSensor = setting[0].settingState;
        
        const receiveFacilityError = option3DSensor.receiveFacilityError;

        // 유형별 알람 설정 옵션 정보에 따른 표출 여부
        let showAlarm = false;

        const selectedAlarm = this.props.selectedFacilityAlarm;

        if(selectedAlarm?.facilityType === SDMSResource.facilityType.EQUIPMENT && receiveFacilityError) {
            showAlarm = true;
        }

        if (selectedAlarm === null || !showAlarm) {

            return (
                <div className={'dseInfo'}>
                    <div>
                        <p>활성화된 이벤트가 없습니다.</p>
                    </div>
                </div>
            );
        }

        const dt = new Date(selectedAlarm.eventTime);
        const [ymd, hms] = SdmsResource.getDate(dt);

        let evtClassName = 'evtEQUIPMENT';

        return (
            <div className={'dseInfo'}>
                <em className={evtClassName}>이벤트 아이콘</em>
                <div>
                    <p>{selectedAlarm?.equipmentData?.equipment?.name}</p>
                    <p>{ymd + ' ' + hms}</p>
                    <p>{selectedAlarm.message}</p>
                </div>
                <button 
                    className={this.props.visiblePopups[SdmsResource.ID.menu.equipmentFaultyImage] ? 'moreInfo on' : 'moreInfo'}
                    onClick={() => this.props.setVisiblePopups(SDMSResource.ID.menu.equipmentFaultyImage, true)}
                />
            </div>
        );
    }

    onChangeMenu = (menu) => {
        this.props.onChangeEventTabMenu(menu);
    }

    getTabMenu = () => {
        let displayMenu = [];

        displayMenu.push(
            <ul key='event_menu'>
                <li 
                    key='tab_monitoring'
                    className={this.props.eventTabMenu === SdmsResource.mode.monitoring ? 'on' : null}
                    onClick={() => this.onChangeMenu(SdmsResource.mode.monitoring)}
                >
                    안전관리
                </li>
                <li 
                    key='tab_equipment'
                    className={this.props.eventTabMenu === SdmsResource.mode.equipment ? 'on' : null}
                    onClick={() => this.onChangeMenu(SdmsResource.mode.equipment)}
                >
                    설비관리
                </li>
            </ul>
        );

        return displayMenu;
    }

    handleTooltip = (e, data) => {
        const domRect = e.target.getBoundingClientRect();

        const target = e.target;
        const parent = e.target.parentElement;
        
        const parentNode = parent.getBoundingClientRect();
        const targetNode = target.getBoundingClientRect();

        // span.width > td.width &&
        if(targetNode.width + 6 > parentNode.width) {

            this.setState({
                showTooltip: !this.state.showTooltip,
                tooltipTop: domRect.top + 16,
                tooltipLeft: domRect.left - 4,
                tooltipContent: data
            });
        }
    }

    render() {
        const mode = this.props.mode;
        const {showTooltip, tooltipTop, tooltipLeft, tooltipContent} = this.state;
        const displayMenu = this.getTabMenu();

        const [gridUI, closedGridUI, activeAlarmLength] = this.getAlarmTable();
        const [facilityGridUI, facilityClosedGridUI, facilityActiveAlarmLength] = this.getFacilityAlarmTable();

        if(gridUI.length > 0 && !this.props.eventDashboardPopupOpen && mode === SdmsResource.mode.monitoring) {
            this.props.handlePopup(SDMSResource.ID.menu.eventDashboard, true);
        } 

        if(facilityGridUI.length > 0 && !this.props.eventDashboardPopupOpen && mode === SdmsResource.mode.equipment) {
            this.props.handlePopup(SDMSResource.ID.menu.eventDashboard, true);
        } 

        return (
            <>
            {
                showTooltip &&
                <div id='sdms-tooltip-area' style={{ top: tooltipTop, left: tooltipLeft }}>
                    {tooltipContent}
                </div>
            }
            <EventComponent id={this.props.popupType} className='UI_Section event'>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={340}
                    popupMinHeight={400}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={'dslTop'}>
                        <h5 className={'dslTitle'} >
                            이벤트 정보
                        </h5>
                        <div className={'dslX'} onClick={() => this.props.setVisiblePopups(Monitoring.menu.event, false)}>
                            <a href="#none">닫기버튼</a>
                        </div>
                    </div>
                    <div className='dslCont'>
                        <div className='tabMenu' ref={this.refTitle}>
                            {displayMenu}
                        </div>
                        <div ref={this.refAlarmList} className={'alarmList'}>
                            <div ref={this.refHeader} className={'dseTop'}>
                                {
                                    this.props.eventTabMenu === SdmsResource.mode.monitoring ?
                                    <table>
                                        <colgroup>
                                            <col className={'width_25Pro'} />
                                            <col className={'width_20Pro'} />
                                            <col className={'width_20Pro'} />
                                            <col className={'width_13Pro'} />
                                            <col className={'width_15Pro'} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>발생일시</th>
                                                <th>상황유형</th>
                                                <th>발생위치</th>
                                                <th>알람</th>
                                                <th>SOP</th>
                                            </tr>
                                        </thead>
                                    </table> :
                                    <table>
                                        <colgroup>
                                            <col className={'width_20Pro'} />
                                            <col className={'width_25Pro'} />
                                            <col className={'width_20Pro'} />
                                            <col className={'width_10Pro'} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>발생일시</th>
                                                <th>불량유형</th>
                                                <th>발생위치</th>
                                                <th>알람</th>
                                            </tr>
                                        </thead>
                                    </table>
                                }
                            </div>
                            <div className={'dseTb'}>
                                <Scrollbars ref={this.refScrollbar}>
                                    <table ref={this.refTable} className={'scrollTable'}>
                                        <caption>이벤트 발생일시, 상황유형, 단계, 위치, 대응상태로 구성된 표</caption>
                                        {
                                            this.props.eventTabMenu === SdmsResource.mode.monitoring ?
                                            <colgroup>
                                                <col className={'width_25Pro'} />
                                                <col className={'width_20Pro'} />
                                                <col className={'width_20Pro'} />
                                                <col className={'width_13Pro'} />
                                                <col className={'width_15Pro'} />
                                            </colgroup> :
                                            <colgroup>
                                                <col className={'width_20Pro'} />
                                                <col className={'width_25Pro'} />
                                                <col className={'width_20Pro'} />
                                                <col className={'width_10Pro'} />
                                            </colgroup>
                                        }
                                        {
                                            this.props.eventTabMenu === SdmsResource.mode.monitoring ?
                                            
                                            (
                                                gridUI.length + closedGridUI.length > 0 ?
                                                <tbody>
                                                    {gridUI}
                                                    {closedGridUI}
                                                </tbody> :
                                                <div className={'dseInfo'}>
                                                    <div>
                                                        <p>활성화된 이벤트가 없습니다.</p>
                                                    </div>
                                                </div>
                                            ) :
                                            (
                                                facilityGridUI.length + facilityClosedGridUI.length > 0 ?
                                                <tbody>
                                                    {facilityGridUI}
                                                    {facilityClosedGridUI}
                                                </tbody> :
                                                <div className={'dseInfo'}>
                                                    <div>
                                                        <p>활성화된 이벤트가 없습니다.</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </table>
                                </Scrollbars>
                            </div>
                        </div>
                        {
                            this.props.eventTabMenu === SdmsResource.mode.monitoring ?
                            <div className={'alarmDetail'}>
                                <h5 className={'dseTitle'}>상세정보</h5>
                                    {this.getAlarmInfo()}
                                    <ul className={'eventIconBox'}>
                                        <li>
                                            <button className={activeAlarmLength === 0 || this.state.isClosed || gridUI.length === 0 ? 'eIconSop off' : 'eIconSop'} onClick={() => this.onSituationNotice()}>SOP</button>
                                        </li>
                                        <li>
                                            <button className={activeAlarmLength > 0 && !this.state.isClosed && gridUI.length > 0 ? 'eIconScreenMove' : 'eIconScreenMove off'} onClick={() => this.onMoveSelectedAlarm(SdmsResource.mode.monitoring)}>화면이동</button>
                                        </li>
                                        {
                                            this.props.alarmSound ?
                                                <li onClick={() => this.props.onSound(false)}>
                                                    <button className={activeAlarmLength > 0 && !this.state.isClosed && gridUI.length > 0 ? 'eIconSoundOff' : 'eIconSoundOff off'}>소리끄기</button>
                                                </li> :
                                                <li onClick={() => this.props.onSound(true)}>
                                                    <button className={activeAlarmLength > 0 && !this.state.isClosed && gridUI.length > 0 ? 'eIconSoundOn' : 'eIconSoundOff off'}>소리켜기</button>
                                                </li>
                                        }
                                        <li>
                                            <button className={activeAlarmLength > 0 && !this.state.isClosed && gridUI.length > 0 ? 'eIconEnd' : 'eIconEnd off'} onClick={() => this.onExitEventConfirm(SdmsResource.mode.monitoring)}>종료</button>
                                        </li>
                                    </ul>
                            </div> :
                            <div className={'alarmDetail'}>
                                <h5 className={'dseTitle'}>상세정보</h5>
                                {this.getFacilityAlarmInfo()}
                                <ul className={'eventIconBox'}>
                                    <li>
                                        <button className='eIconSop off'>SOP</button>
                                    </li>
                                    <li>
                                        <button className={facilityActiveAlarmLength > 0 && !this.state.isClosed && facilityGridUI.length > 0 ? 'eIconScreenMove' : 'eIconScreenMove off'} onClick={() => this.onMoveSelectedAlarm(SdmsResource.mode.equipment)}>화면이동</button>
                                    </li>
                                    {
                                        this.props.alarmSound ?
                                            <li onClick={() => this.props.onSound(false)}>
                                                <button className={facilityActiveAlarmLength > 0 && !this.state.isClosed && facilityGridUI.length > 0 ? 'eIconSoundOff' : 'eIconSoundOff off'}>소리끄기</button>
                                            </li> :
                                            <li onClick={() => this.props.onSound(true)}>
                                                <button className={facilityActiveAlarmLength > 0 && !this.state.isClosed && facilityGridUI.length > 0 ? 'eIconSoundOn' : 'eIconSoundOff off'}>소리켜기</button>
                                            </li>
                                    }
                                    <li>
                                        <button className={facilityActiveAlarmLength > 0 && !this.state.isClosed && facilityGridUI.length > 0 ? 'eIconEnd' : 'eIconEnd off'} onClick={() => this.onExitEventConfirm(SdmsResource.mode.equipment)}>종료</button>
                                    </li>
                                </ul>
                            </div>
                        }
                    </div>
                </PopupDraggable>
            </EventComponent>

            {
                this.state.exitMemoPopup &&
                    <EventExitMemo 
                        clearAlarm={this.clearAlarm}
                        setExitAlarmMemo={this.setExitAlarmMemo}
                        selectedAlarm={this.props.selectedAlarm}
                        onClosePopup={this.onClosePopup}
                    />
            }
            </>
        );
    }
}

export default withRouter(Event);


// 이벤트 종료시 조치사항 팝업
class EventExitMemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submitMemo: false
        }

        this.props = props;
    }

    handleSubmit(e) {
        e.preventDefault();

        let selectedAlarm = this.props.selectedAlarm;
        const memo = e.target.memo.value;

        if(selectedAlarm) {
            selectedAlarm.memo = memo;

            this.props.setExitAlarmMemo(selectedAlarm);
        }
    }

    handleChange = (e) => {
        const value = e.target.value;

        if(value.replace(/\s|　/gi, "").length > 0){
            this.setState({ submitMemo: true });
        }
        else {
            this.setState({ submitMemo: false });
        }
    }

    render() {

        return (
            <ModalBackground className='UI_Section'>
            <EventExitMemoComponent>
                <div className={'dslTop'}>
                    <h5 className={'dslTitle'} >
                        조치사항
                    </h5>
                    <div className={'dslX'} onClick={() => this.props.onClosePopup(false)}>
                        <a href="#none">닫기버튼</a>
                    </div>
                </div>

                <div className='dslCont'>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <textarea name='memo' onChange={(e) => this.handleChange(e)} />
                        <button type='submit' className={this.state.submitMemo ? 'eIconEnd on' : 'eIconEnd'} disabled={!this.state.submitMemo}>알람종료</button>
                    </form>
                </div>
            </EventExitMemoComponent>
            </ModalBackground>
        );
    }
}