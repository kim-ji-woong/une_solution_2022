import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import uis from '../../../Common/css/ui.module.css';
import { SDMSController } from '../../services/sdmsController';
import SDMS from '../sdms';
import StringUtil from '../../../Common/util/StringUtil';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { SdmsScrollbar } from './SdmsScrollbar';
import $ from 'jquery';
import ProjectResource from '../../../Root/resource/id';
import SDMSResource from '../../resource/id';
import AccountResource from '../../../Account/resource/id';

import SettingsStore from '../../../Settings/settingsStore';

import styles from '../../css/sdms.module.css';
import imgCloseBroadcast from "../../img/broadcast/closeBroadcast.png";
import imgOnBroadcast from "../../img/broadcast/onBroadcast.png";
import { SettingController } from '../../../Settings/services/settingController';

import SensorDetectHistoryMemo from '../../../History/ui/popups/SensorDetectHistoryMemo';

import PopupDraggable from './popupDraggable';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

class Event extends Component {
    static keys = [];

    constructor(props) {
        super(props);

        this.state = {
            loginUser: null,
            commonSettings: SettingsStore.getState().sdmsCommonSettings,
            broadcastInfo: {},

            popupMemoHistoryID: null, // 메모 팝업에 표현할 SensorZoneHistoryID
            popupMemoContent: null,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
        }

        this.onMalfunction = this.onMalfunction.bind(this);
        this.onSituationNotice = this.onSituationNotice.bind(this);
        this.onSelectedAlarm = this.onSelectedAlarm.bind(this);
        this.onSound = this.onSound.bind(this);


        this.refAlarmList = React.createRef();
        this.refTitle = React.createRef();
        this.refHeader = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTable = React.createRef();

        SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'RESET_POPUP') {
                this.repositionPopup(data.popupState);
            } else if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                this.changeSDMSCommonSettings(data.sdmsCommonSettings);
            }

        }.bind(this));

        this.initSiteID();
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        //$('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
        //    if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
        //        document.getElementById(this.props.popupType).style.opacity = 1;
        //    }
        //});
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

        this.initUser();
        this.setScrollbar();

        // 단축키 이벤트 리스너
        //document.addEventListener("keydown", (e) => this.keysPressed(e, this), false);
        document.addEventListener("keydown", this.keyFunction, false);
        document.addEventListener("keyup", this.keysReleased, false);
    }

    componentWillUnmount() {
        // 단축키 이벤트 리스너 제거
        document.removeEventListener("keydown", this.keyFunction);
        document.removeEventListener("keyup", this.keysReleased);
    }

    keyFunction = (e) => this.keysPressed(e, this);

    keysPressed(e, target) {
        const commonKey = 16;   // Shift 키

        // store an entry for every key pressed
        Event.keys[e.keyCode] = true;

        if (Event.keys[commonKey] && Event.keys[81]) {
            // 상황전파 퀵버튼
            target.onSituationNotice();

            Event.keys[81] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (Event.keys[commonKey] && Event.keys[87]) {
            // 화면전환 퀵버튼
            target.onMoveSelectedAlarm();

            Event.keys[87] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (Event.keys[commonKey] && Event.keys[69]) {
            // 소리끄기 퀵버튼
            target.onSound();

            Event.keys[69] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (Event.keys[commonKey] && Event.keys[82]) {
            // 종료 퀵버튼
            target.onMalfunction();

            Event.keys[82] = false;
            // prevent default browser behavior
            e.preventDefault();
        }
    }

    keysReleased(e) {
        // mark keys that were released
        Event.keys[e.keyCode] = false;
    }

    repositionPopup(popupState) {
        let data = popupState.event;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + " " + content.viewDashboardEvent)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
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

    async initUser() {
        let user = await ProjectResource.initUserInfo();

        this.setState({ loginUser: user });
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

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex
        }

        this.setScrollbar();
    }

    onSelectedAlarm(alarm) {
        this.props.onSelectedAlarm(alarm);
    }
    onMoveSelectedAlarm() {
        this.props.onMoveSelectedAlarm();
    }

    onSound() {
        if (this.props.selectedAlarm.sound === undefined) {
            this.props.selectedAlarm.sound = true;
        }

        this.props.selectedAlarm.sound = !this.props.selectedAlarm.sound;
        this.props.onSound(this.props.selectedAlarm.sound);
    }

    setGridUI() {
        if (this.props.sensorAlarms === null || this.props.sensorAlarms.length === 0)
            return null;

        var grid = [];

        const alarms = this.props.sensorAlarms;
        for (var i = 0; i < alarms.length; i++) {
            const alarm = alarms[i];
            const dt = new Date(alarm.dtTime);
            var mm = dt.getMonth() + 1;
            var dd = dt.getDate();
            var ss = dt.getSeconds();
            const ymd = dt.getFullYear() + '.' + StringUtil.getDoubleString(mm) + '.' + StringUtil.getDoubleString(dd);
            const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes()) + ':' + StringUtil.getDoubleString(ss);

            var sopStatusClassName = content.redTxt;
            var sopStatusText = '미대응';
            let statusClassName = content.red;

            if (alarm.sopStatus === 0 || alarm.sopStatus === 1) {
                sopStatusClassName = content.greenTxt;
                sopStatusText = '대응중';
                statusClassName = content.grn;
            }
            else if (alarm.sopStatus === 2) {
                sopStatusClassName = content.whiteTxt;
                sopStatusText = '상황종료';
                statusClassName = '';
            }

            if (alarm.isAlarm === false) {
                sopStatusClassName = content.whiteTxt;
                sopStatusText = '알람종료';
                statusClassName = '';
            }

            var alarmDepth = '주의'
            if (alarm.alarmDepth === 1) {
                alarmDepth = '관심';
            }
            else if (alarm.alarmDepth === 3) {
                alarmDepth = '경계';
            }
            else if (alarm.alarmDepth === 4) {
                alarmDepth = '심각';
            }

            let rowClassName = '';
            if (alarm === this.props.selectedAlarm && !alarm.isAlarm) { // 알람종료된 row가 선택됐을 때
                rowClassName = content.selectedClosedAlarm;
            }
            else if (alarm === this.props.selectedAlarm) { // 선택된 row
                rowClassName = content.selectedAlarm;
            }
            else if (!alarm.isAlarm) { // 알람 종료된 row
                rowClassName = content.closedAlarm;
            }

            // MaterialType이 있을 경우
            let typeString = alarm.facilityTypeString;
            if (alarm.materialTypeString !== null && alarm.materialTypeString !== undefined && alarm.materialTypeString !== "")
                typeString = alarm.materialTypeString;

            // 이벤트 숫자
            // .TODO: 고도화 내용으로 인한 주석처리 
            //const displayNumUI = this.displayNumUI(alarm);
            const displayNumUI = [];
            const positionName = (!alarm.buildingName || alarm.buildingName.length === 0) ? alarm.zoneName : alarm.buildingName;

            grid.push(
                <React.Fragment key={"eventGrid_" + i}>
                    <tr className={rowClassName} onClick={() => this.onSelectedAlarm(alarm)} onDoubleClick={() => this.onMoveSelectedAlarm()}>
                        <td>{ymd}<br />{hms}{displayNumUI}</td> 
                        <td>{typeString}</td>
                        <td>{alarmDepth}</td>
                        <td>{positionName}</td>
                        <td><span className={statusClassName}>{sopStatusText}</span></td>
                    </tr>
                </React.Fragment>
            );
        }

        return grid;
    }

    displayNumUI = (alarm) => {
        let alarmInfo = this.props.alarmInfo;
        let displayNumUI = [];
        let num = null;

        for (let key in alarmInfo) {
            const data = alarmInfo[key];

            if (data[1].sensorZoneHistoryID === alarm.sensorZoneHistoryID) {
                if (key.indexOf(SDMSResource.ID.menu.alarmCCTV + "_") !== -1) {
                    num = key.replace(SDMSResource.ID.menu.alarmCCTV + "_", "");
                }
            }
        }

        if (num !== null && num !== undefined) {
            displayNumUI.push(
                <React.Fragment key={"eventSpan_" + num}>
                    <span className={content.eventAct}>{num}</span>
                </React.Fragment>
            );
        }

        return displayNumUI;
    }

    async onMalfunction() {
        const alarm = this.props.selectedAlarm;
        const userAuthor = ProjectResource.getUserAuthor();

        if (alarm.isAlarm) {
            // 권한에 따른 상황 종료 여부
            if (userAuthor === AccountResource.ID.accountLevel.admin)
                this.props.onMalfunction(alarm);
            else
                this.props.onAuthorError();
        } 
    }
    
    async onSituationNotice() {
        const alarm = this.props.selectedAlarm;
        if (alarm.sopStatus !== -1) {
            //alert('SOP가 진행중이거나 이미 종료되었습니다.');
            this.showConfirmDialog("에러", ["SOP가 진행중이거나 이미 종료되었습니다."], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            return;
        }

        if (!window.confirm('SOP를 실행할까요?'))
            return;

        // sop 새탭으로 띄우기
        window.open(ProjectResource.path.sopSimulator);
                
        await SDMSController.requestSituationNotice(alarm.facilityType, alarm.sensorZoneID);
    }

    changeSDMSCommonSettings(storeValue) {
        const commonSettings = storeValue ? storeValue : {};

        this.setState({ commonSettings: commonSettings });
    }

    broadcastIsRunning() {
        const run = this.state.commonSettings?.RunAlarmBroadcast;

        if (run) {
            const param = parseInt(run);

            if (param && param > 0) {
                return true;
            }
        }

        return false;
    }
     
    broadcastState() {
        let state = SDMSResource.BroadcastState.None;
        let buildingID = null;

        const siteID = ProjectResource.SiteID;

        const runAlarmBroadcast = this.state.commonSettings?.RunAlarmBroadcast;
        const closeAlarmBroadcast = this.state.commonSettings?.CloseAlarmBroadcast;
        const selectedAlarm = this.props.selectedAlarm;

        const buildingGroupList = this.props.buildingGroupList;
        if (buildingGroupList !== null && buildingGroupList !== undefined) {
            const buildingDatas = buildingGroupList[0].buildingDatas;
            let alarmBuildingID = null;

            const outdoorZoneID = 20000;

            if (selectedAlarm.zoneID === outdoorZoneID) {
                if (siteID === ProjectResource.Site.GCC) {
                    const pd2EquipZoneID = 1934;
                    const utEquipZoneID = 1935;
                    const pd2BuildingID = 3;
                    const utBuildingID = 7;

                    if (selectedAlarm.equipZoneID === pd2EquipZoneID) {
                        alarmBuildingID = pd2BuildingID;
                    } else if (selectedAlarm.equipZoneID === utEquipZoneID) {
                        alarmBuildingID = utBuildingID;
                    }
                }
            }
            else {
                for (var building of buildingDatas) {
                    const zoneDatas = building.zoneDatas;

                    for (var zone of zoneDatas) {
                        if (zone.id === selectedAlarm.zoneID) {
                            alarmBuildingID = building.id;
                            break;
                        }
                    }

                    if (alarmBuildingID !== null)
                        break;
                }
            }
            

            if (runAlarmBroadcast !== null && runAlarmBroadcast !== undefined &&
                closeAlarmBroadcast !== null && closeAlarmBroadcast !== undefined &&
                alarmBuildingID !== null) {
                var arrRunAlarmBroadcast = runAlarmBroadcast.split(",");
                var arrCloseAlarmBroadcast = closeAlarmBroadcast.split(",");
                buildingID = alarmBuildingID;

                if (arrRunAlarmBroadcast.indexOf(alarmBuildingID.toString()) !== -1) {
                    state = SDMSResource.BroadcastState.Run;
                }

                if (arrCloseAlarmBroadcast.indexOf(alarmBuildingID.toString()) !== -1) {
                    state = SDMSResource.BroadcastState.Stop;
                }  
            }
        }

        this.state.broadcastInfo.state = state;
        this.state.broadcastInfo.buildingID = buildingID;
        return state;
    }

    onClickCloseBroadcast = (e) => {
        this.props.showConfirmDialog(SDMSResource.ID.common.confirm,
            SDMSResource.ID.broadcast.closeInfo,
            [SDMSResource.ID.broadcast.closeBroadcast, SDMSResource.ID.common.cancel],
            this.onClickCloseBroadcastOption
        );
    }

    onClickCloseBroadcastOption = (index) => {
        if (index === 0) {
            this.closeBroadcast();
        }
        else {
            console.log("취소");
        }

        this.props.closeConfirmDialog();
    }

    async closeBroadcast() {
        const settings = [
            {
                "name": "CloseAlarmBroadcast",
                "value": "1"
            }
        ];

        const [success, message] = await SettingController.requestUpdateSdmsSettings(settings);

        if (!success && message !== null) {
            //alert(message);
            this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }
    }

    onClickOnOffBroadcast = (onOff) => {
        if (onOff === SDMSResource.BroadcastState.Stop) {
            // 방송 시작
            this.props.showConfirmDialog(SDMSResource.ID.common.confirm,
                SDMSResource.ID.broadcast.onInfo,
                [SDMSResource.ID.broadcast.onBroadcast, SDMSResource.ID.common.cancel],
                this.onClickOnOffBroadcastOption
            );
        } else if (onOff === SDMSResource.BroadcastState.Run) {
            // 방송 중지
            this.props.showConfirmDialog(SDMSResource.ID.common.confirm,
                SDMSResource.ID.broadcast.closeInfo,
                [SDMSResource.ID.broadcast.closeBroadcast, SDMSResource.ID.common.cancel],
                this.onClickOnOffBroadcastOption
            );
        }
    }

    onClickOnOffBroadcastOption = (index) => {
        if (index === 0) {
            this.onOffBroadcast();
        }
        else {
            console.log("취소");
        }

        this.props.closeConfirmDialog();
    }

    async onOffBroadcast() {
        const state = this.state.broadcastInfo.state;
        const buildingID = this.state.broadcastInfo.buildingID;
        let onOff = null;

        if (state === SDMSResource.BroadcastState.Stop) {
            onOff = "true";
        } else if (state === SDMSResource.BroadcastState.Run) {
            onOff = "false";
        }

        const [success, message] = await SettingController.requestOnOffBroadcast(onOff, buildingID.toString());
        
        if (!success && message !== null) {
            //alert(message);
            this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }
    }

    displayBroadcastUI = () => {
        let displayBroadcastUI = [];

        const siteID = ProjectResource.SiteID;

        if (siteID === ProjectResource.Site.Soulbrain) {
            if (this.broadcastIsRunning() === true) {
                displayBroadcastUI.push(<img className={styles.imgBroadcast} src={imgCloseBroadcast} title={SDMSResource.ID.broadcast.close} onClick={this.onClickCloseBroadcast} />);
            }
        } else if (siteID === ProjectResource.Site.GCC) {
            const state = this.broadcastState();

            if (state === SDMSResource.BroadcastState.Run) {
                // 방송 중 경우
                displayBroadcastUI.push(<img className={styles.imgBroadcast} src={imgCloseBroadcast} title={SDMSResource.ID.broadcast.on} onClick={() => this.onClickOnOffBroadcast(state)} />);
            } else if (state === SDMSResource.BroadcastState.Stop) {
                // 방송 중지 경우
                displayBroadcastUI.push(<img className={styles.imgBroadcast} src={imgOnBroadcast} title={SDMSResource.ID.broadcast.close} onClick={() => this.onClickOnOffBroadcast(state)} />);
            }
        }

        return displayBroadcastUI;
    }

    async initSiteID() {
        let siteID = ProjectResource.SiteID;

        if (siteID === null || siteID === undefined) {
            // 사이트 ID 요청
            siteID = await ProjectResource.loadSiteID();

            this.setState({ reload: true });
        }
    }

    getAlarmInfo() {
        const selectedAlarm = this.props.selectedAlarm;

        let evtClassName = content.evtFIRE;

        if (selectedAlarm.facilityType) {
            if (selectedAlarm.facilityType === SDMSResource.facilityType.FIRE) {
                evtClassName = content.evtFIRE;
            } else if (SDMSResource.isPSMSensorType(selectedAlarm.facilityType)) {
                evtClassName = content.evtPSM;
            } else if (SDMSResource.isETCSensorType(selectedAlarm.facilityType)) {
                evtClassName = content.evtETC;
            } else if (SDMSResource.isSVMSSensorType(selectedAlarm.facilityType)) {
                evtClassName = content.evtSVMS;
            }
        }

        return (
            <div className={content.dseInfo}>
                <em className={evtClassName}>이벤트 아이콘</em>
                <p>
                    <span>{this.props.selectedAlarm.positionName}</span>
                    {
                        (this.props.selectedAlarm.reportPerson.length === 0 && this.props.selectedAlarm.memo.length === 0)
                            ? <></>
                            : <>
                                <span>{(this.props.selectedAlarm.reportPerson.length === 0) ? ' - ' : this.props.selectedAlarm.reportPerson}</span>
                                <span>{(this.props.selectedAlarm.memo.length === 0) ? ' - ' : this.props.selectedAlarm.memo}</span>
                            </>
                    }
                </p>
                <p>{this.props.selectedAlarm.strDateTime}</p>
                <p>{this.props.selectedAlarm.message}</p>
            </div>
            );
    }

    setPopupMemo = (isOpen, sensorZoneHistoryID, memoContent) => {
        if (isOpen) {
            const selectedAlarm = this.props.selectedAlarm;
            const sensorZoneHistoryID = selectedAlarm.sensorZoneHistoryID;
            const memoContent = selectedAlarm.alarmMemo;

            if (sensorZoneHistoryID !== null && sensorZoneHistoryID > 0) {
                // 메모 팝업 열기
                this.setState({ popupMemoHistoryID: sensorZoneHistoryID, popupMemoContent: memoContent });
            }
        }
        else {
            if (sensorZoneHistoryID !== null && sensorZoneHistoryID > 0) {
                // 메모 저장 후
                const selectedAlarm = this.props.selectedAlarm;
                selectedAlarm.alarmMemo = memoContent;
            }

            this.setState({ popupMemoHistoryID: null, popupMemoContent: null });
        }
    }

    getBtnUI = () => {
        let btnUI =
            <ul className={content.eventIconBox}>
                <li onClick={this.onSituationNotice}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+Q</span><span className={content.eIcon1}></span><a>상황전파</a></li>
                <li onClick={() => this.onMoveSelectedAlarm()}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+W</span><span className={content.eIcon2}></span><a>화면전환</a></li>
                {
                    (this.props.alarmSound)
                        ? <li onClick={this.onSound}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+E</span><span className={content.eIcon3}></span><a>소리끄기</a></li>
                        : <li onClick={this.onSound}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+E</span><span className={content.eIcon4}></span><a>소리켜기</a></li>
                }
                <li onClick={() => this.setPopupMemo(true, null, null)}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}></span><span className={content.eIcon5}></span><a>메모</a></li>
                <li onClick={this.onMalfunction}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+R</span><span className={content.eIcon6}></span><a>종료</a></li>
            </ul>;


        if (ProjectResource.isGSMode === true) {
            btnUI =
                <ul className={content.gsEventIconBox}>
                    <li onClick={() => this.onMoveSelectedAlarm()}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+W</span><span className={content.eIcon2}></span><a>화면전환</a></li>
                    {
                        (this.props.alarmSound)
                            ? <li onClick={this.onSound}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+E</span><span className={content.eIcon3}></span><a>소리끄기</a></li>
                            : <li onClick={this.onSound}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+E</span><span className={content.eIcon4}></span><a>소리켜기</a></li>
                    }
                    <li onClick={this.onMalfunction}><span className={"shortcutKey" + " " + content.eventShortCut + " " + uis.hideKey}>Sh+R</span><span className={content.eIcon6}></span><a>종료</a></li>
                </ul>;
        }

        return btnUI;
    }

    render() {
        const gridUI = this.setGridUI();
        const btnUI = this.getBtnUI();

        return (
            <>
                <div id={this.props.popupType} className={content.viewDashboardBoxD + " " + content.viewDashboardEvent + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={360}
                        popupMinHeight={300}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        <div className={content.dslTop + " " + content.dslGrd}>
                            <h5 className={content.dslTitle} >
                                이벤트 정보
                            </h5>
                            {
                                //this.broadcastIsRunning() &&
                                //<img className={styles.imgBroadcast} src={imgCloseBroadcast} title={SDMSResource.ID.broadcast.close} onClick={this.onClickCloseBroadcast} />
                                this.displayBroadcastUI()
                            }
                            <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.event, false)}></a>
                        </div>
                        <div className={content.dslCont}>
                            <div ref={this.refAlarmList} className={content.alarmList}>
                                <h5 ref={this.refTitle}className={content.dseTitle}>발생현황</h5>
                                <div ref={this.refHeader} className={content.dseTop}>
                                    <table>
                                        <colgroup>
                                            <col className={content.width_25Pro} />
                                            <col className={content.width_20Pro} />
                                            <col className={content.width_15Pro} />
                                            <col className={content.width_15Pro} />
                                            <col className={content.width_25Pro} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>발생일시</th>
                                                <th>상황유형</th>
                                                <th>단계</th>
                                                <th>위치</th>
                                                <th>대응상태</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div className={content.dseTb + " " + content.scrollbar}>
                                    <Scrollbars ref={this.refScrollbar}>
                                        <table ref={this.refTable} className={content.scrollTable}>
                                            <caption>이벤트 발생일시, 상황유형, 단계, 위치, 대응상태로 구성된 표</caption>
                                            <colgroup>
                                                <col className={content.width_25Pro} />
                                                <col className={content.width_20Pro} />
                                                <col className={content.width_15Pro} />
                                                <col className={content.width_15Pro} />
                                                <col className={content.width_25Pro} />
                                            </colgroup>
                                            <tbody>
                                                {gridUI}
                                            </tbody>
                                        </table>
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className={content.alarmDetail}>
                                <div className={content.gap10}></div>
                                <h5 className={content.dseTitle}>세부정보</h5>
                                    {this.getAlarmInfo()}
                                    {btnUI}
                            </div>
                        </div>
                    </PopupDraggable>
                </div>
                {
                    (this.state.popupMemoHistoryID !== null && this.state.popupMemoHistoryID > 0) ?                        
                        <SensorDetectHistoryMemo
                            setPopupMemo={this.setPopupMemo}
                            actionStepHistoryID={this.state.popupMemoHistoryID}
                            popupMemoContent={this.state.popupMemoContent}

                            setActiveDragPopup={this.props.setActiveDragPopup}
                            setPopupState={this.props.setPopupState}
                            popupState={this.props.popupStateAlarmMemo}
                            zIndex={this.props.zIndexAlarmMemo}
                            popupType={this.props.popupTypeAlarmMemo}
                        />
                    : null
                }

                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </>
        );
    }
}

export default Event;