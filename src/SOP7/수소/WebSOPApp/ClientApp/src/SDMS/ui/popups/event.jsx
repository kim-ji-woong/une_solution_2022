import { ui } from 'jquery';
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
import { fab } from '@fortawesome/free-brands-svg-icons';

import SensorDetectHistoryMemo from '../../../History/ui/popups/SensorDetectHistoryMemo';

import PopupDraggable from './popupDraggable';

import { EventComponent } from '../../styled/sdmsPopupsStyled';
import SopManagerResource from '../../../SOPManager/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import settingsStore from '../../../Settings/settingsStore';

class Event extends Component {
    static keys = [];

    static ReloadTime = 3000;

    constructor(props) {
        super(props);

        this.state = {
            loginUser: null,
            commonSettings: SettingsStore.getState().sdmsCommonSettings,
            broadcastInfo: {},

            popupMemoHistoryID: null,   // 메모 팝업에 표현할 SensorZoneHistoryID
            popupMemoContent: null,

            selectedType: null,   // 표시할 이벤트 타입 ID
            selectedSite: null,   // 표시할 입주기관 ID (경기)
            selectSiteID: null,   // 현재 선택된 siteID (경기)

            alarmMemos: [],         // .TODO: 주기적으로 알람 메모 불러오기
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

        this.timer = null;
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
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


        // .TODO: 주기적으로 알람 메모 불러오기
        this.loadMemos();
        this.timer = setTimeout(() => this.reloadMemos(this), Event.ReloadTime);

        this.unsubscribe_SettingsStore = settingsStore.subscribe(function () {
            let data = SettingsStore.getState();

            if (data.actionType === 'SELECT_SITEID') {
                this.changeSelectSiteID(data.selectSiteID);
            }
        }.bind(this));
    }

    changeSelectSiteID = (siteID) => {
        const selectedSite = this.state.selectedSite;

        if (siteID && siteID !== selectedSite) {
            if (!this.state.selectedSite) {
                this.setState({selectedSite: siteID});
            } else if (siteID === ProjectResource.Site.GG_A) {
                this.setState({selectedSite: ProjectResource.Site.GG_A});
            } else if (siteID === ProjectResource.Site.GG_B) {
                this.setState({selectedSite: ProjectResource.Site.GG_B});
            } else if (siteID === ProjectResource.Site.GG_D) {
                this.setState({selectedSite: ProjectResource.Site.GG_D});
            } else if (siteID === ProjectResource.Site.GG_E) {
                this.setState({selectedSite: ProjectResource.Site.GG_E});
            } else if (siteID === ProjectResource.Site.GG_F) {
                this.setState({selectedSite: ProjectResource.Site.GG_F});
            } else if (siteID === ProjectResource.Site.GG_G) {
                this.setState({selectedSite: ProjectResource.Site.GG_G});
            } else if (siteID === ProjectResource.Site.GG_H) {
                this.setState({selectedSite: ProjectResource.Site.GG_H});
            }

            this.setState({selectSiteID: siteID});
		}
    }

    componentWillUnmount() {
        // 단축키 이벤트 리스너 제거
        document.removeEventListener("keydown", this.keyFunction);
        document.removeEventListener("keyup", this.keysReleased);

        // 메모 불러오기 타이머 종료
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.unsubscribe_SettingsStore();
    }

    // 메모 불러오기 타이머 
    reloadMemos = (target) => {
        if (target !== null && target !== undefined) {
            target.loadMemos();

            target.timer = setTimeout(() => target.reloadMemos(target), Event.ReloadTime);
        }
    }

    loadMemos = async () => {
        const alarms = this.props.sensorAlarms;
        const sensorZoneHistoryIDs = [];

        if (!alarms || alarms?.length === 0)
            return;
       
        for (let i = 0; i < alarms.length; i++) {
            const alarm = alarms[i];

            if (alarm.sensorZoneHistoryID > 0)
                sensorZoneHistoryIDs.push(alarm.sensorZoneHistoryID);
        }

        // 해당 메모 불러오기
        const [result, message] = await SDMSController.requestGetAlarmMemos(sensorZoneHistoryIDs);
        if (result) {
            for (let sensorZoneHistoryID in result) {
                let memo = result[sensorZoneHistoryID];
                if (!memo)
                    memo = "";

                const alarm = alarms.find(x => x.sensorZoneHistoryID.toString() === sensorZoneHistoryID);
                if (alarm) {
                    alarm.alarmMemo = memo;
                }
            }           
        }
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

        const isShowMemoPopup = this.state.popupMemoHistoryID !== null && this.state.popupMemoHistoryID > 0;
        if(isShowMemoPopup) {
            this.setPopupMemo(isShowMemoPopup, alarm.sensorZoneHistoryID, alarm.alarmMemo);
        }
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

        let grid = [];
        const alarms = this.props.sensorAlarms;
        const selectedType = this.state.selectedType;
        const selectedSite = this.state.selectedSite;   // 경기


        // SOP, 메모 사용 확인
        const userInfo = ProjectResource.getUserInfo();
        let useSOP = true;
        let useAlarmMemo = true;

        if (ProjectResource.SiteID === ProjectResource.Site.CheongSim)
            useSOP = false;

        useAlarmMemo = (userInfo?.options?.ui?.useAlarmMemo === true);


        for (let i = 0; i < alarms.length; i++) {
            const alarm = alarms[i];

            // 선택된 타입 확인
            if (selectedType !== null) {
                const facilityType = alarm.facilityType;

                if (!(selectedType === SDMSResource.facilityType.Intrusion_S1 && SDMSResource.isSVMSSensorType(facilityType)) &&
                    !(selectedType === SDMSResource.facilityType.Becon_Stay && SDMSResource.isBeaconSensorType(facilityType)) &&
                    !(selectedType === SDMSResource.facilityType.LowBattery && SDMSResource.isEletricSensorType(facilityType)) &&
                    selectedType !== facilityType)
                    continue;
            }

            const dt = new Date(alarm.dtTime);
            let mm = dt.getMonth() + 1;
            let dd = dt.getDate();
            let ss = dt.getSeconds();
            const ymd = dt.getFullYear() + '.' + StringUtil.getDoubleString(mm) + '.' + StringUtil.getDoubleString(dd);
            const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes()) + ':' + StringUtil.getDoubleString(ss);

            let sopStatusClassName = 'redTxt';
            let sopStatusHydrogenClassName = 'eventAlarmDisableIcon'; /* 알람아이콘으로 표출 */
            let sopStatusText = i18n.t('sdms.event.대기');
            let alarmStatusText = i18n.t('sdms.event.발생');
            let statusClassName = 'red';

            if (alarm.sopStatus === 1) {
                sopStatusClassName = 'greenTxt';
                sopStatusText = i18n.t('sdms.event.실행중');
                sopStatusHydrogenClassName = 'eventAlarmActiveIcon';
                //statusClassName = content.grn;
            }
            else if (alarm.sopStatus === 2) {
                sopStatusClassName = 'whiteTxt';
                sopStatusText = i18n.t('sdms.event.종료');
                //statusClassName = '';
                sopStatusHydrogenClassName = 'eventAlarmDisableIcon';
            }

            if (alarm.isAlarm === false) {
                sopStatusClassName = 'whiteTxt';
                alarmStatusText = i18n.t('sdms.event.종료');
                sopStatusText = i18n.t('sdms.event.종료');
                statusClassName = '';
                sopStatusHydrogenClassName = 'eventAlarmDisableIcon';
            }

            let alarmDepth = ''
            if (alarm.alarmDepth === 1) {
                alarmDepth = SopManagerResource.actionStep._1st;
            }
            else if (alarm.alarmDepth === 2) {
                alarmDepth = SopManagerResource.actionStep._2nd;
            }
            else if (alarm.alarmDepth === 3) {
                alarmDepth = SopManagerResource.actionStep._3rd;
            }
            else if (alarm.alarmDepth === 4) {
                alarmDepth = SopManagerResource.actionStep._4th;
            }

            let rowClassName = '';
            if (alarm === this.props.selectedAlarm && !alarm.isAlarm) { // 알람종료된 row가 선택됐을 때
                rowClassName = 'selectedClosedAlarm';
            }
            else if (alarm === this.props.selectedAlarm) { // 선택된 row
                rowClassName = 'selectedAlarm';
            }
            else if (!alarm.isAlarm) { // 알람 종료된 row
                rowClassName = 'closedAlarm';
            }

            let typeString = alarm.facilityTypeString;            
            if (alarm.facilityType === SDMSResource.facilityType.FIRE) {
                typeString = i18n.t('facilityType.화재센서');
            } else if (alarm.facilityType === SDMSResource.facilityType.PSM_SENSOR) {
                typeString = i18n.t('facilityType.누출센서');
            } else if (alarm.facilityType === SDMSResource.facilityType.ETC) {
                typeString = i18n.t('facilityType.기타센서');
            } else if (alarm.facilityType === SDMSResource.facilityType.Laser) {
                typeString = i18n.t('facilityType.레이저');
            } else if (alarm.facilityType === SDMSResource.facilityType.DOOR) {
                typeString = i18n.t('facilityType.도어');
            } else if (alarm.facilityType === SDMSResource.facilityType.Earthquake) {
                typeString = i18n.t('facilityType.지진');
            } else if (alarm.facilityType === SDMSResource.facilityType.Terror) {
                typeString ='테러';
            } else if (alarm.facilityType === SDMSResource.facilityType.WaterLevel) {
                typeString ='침수';
            }

            // MaterialType이 있을 경우
            if (alarm.materialTypeString !== null && alarm.materialTypeString !== undefined && alarm.materialTypeString !== "") {
                typeString = alarm.materialTypeString;
            }

            // 이벤트 숫자
            const displayNumUI = this.displayNumUI(alarm);
            
            let positionName;
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                positionName = `${i18nUtil.convertText(alarm.buildingName)} ${i18nUtil.convertText(alarm.zoneName)}`;
            } else {
                positionName = !alarm.buildingName || alarm.buildingName.length === 0
                    ? i18nUtil.convertText(alarm.zoneName)
                    : i18nUtil.convertText(alarm.buildingName);
            }

            grid.push(
                <React.Fragment key={"eventGrid_" + i}>
                    <tr className={rowClassName} onClick={() => this.onSelectedAlarm(alarm)} onDoubleClick={() => this.onMoveSelectedAlarm()}>
                        <td>{ymd}<br />{hms}{displayNumUI}</td> 
                        <td>{typeString}</td>
                        <td>{alarmDepth}</td>
                        <td>{positionName}</td>
                        <td>
                            {
                                ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen 
                                    ? <span className={alarm.isAlarm ? 'eventAlarmActiveIcon' : 'eventAlarmDisableIcon'}></span>
                                    : <span className={statusClassName}>{alarmStatusText}</span>
                            }
                        </td>
                        {useSOP && <td>{sopStatusText} </td>}
                        {useAlarmMemo && <td className={'memoText'} onClick={() => this.setPopupMemo(true, alarm.sensorZoneHistoryID, alarm.alarmMemo)}>{alarm.alarmMemo}</td>}
                    </tr>
                </React.Fragment>
            );
        }

        return grid;
    }

    displayNumUI = (alarm) => {
        if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
            return null;
        }

        let alarmInfo = this.props.alarmInfo;
        let displayNumUI = [];
        let num = null;

        for (let key in alarmInfo) {
            const data = alarmInfo[key];

            if (data[1].sensorZoneHistoryID === alarm.sensorZoneHistoryID) {
                if (key.indexOf(SDMSResource.menu.알람_CCTV + "_") !== -1) {
                    num = key.replace(SDMSResource.menu.알람_CCTV + "_", "");
                }
            }
        }

        if (num !== null && num !== undefined) {
            displayNumUI.push(
                <React.Fragment key={"eventSpan_" + num}>
                    <span className={'eventAct'}>{num}</span>
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
            if (userAuthor === AccountResource.accountLevelID.master ||
                userAuthor === AccountResource.accountLevelID.admin)
                this.props.onMalfunction(alarm);
            else
                this.props.onAuthorError();
        } 
    }
    
    async onSituationNotice() {
        const alarm = this.props.selectedAlarm;
        if (!alarm.isAlarm) {
            this.props.showConfirmDialog(i18n.t('common.확인'),
                i18n.t('sdms.event.종료된 이벤트입니다'),
                [i18n.t('common.확인')],
                null
            );
            return;
        }
        // SOP 실행 상태 (-1: SOP 시작 하기전, 0: SOP 실행 요청, 1: SOP 실행중, 2: SOP종료)
        if (alarm.sopStatus === -1) {
            this.props.showConfirmDialog(i18n.t('common.확인'),
                i18n.t('sdms.event.SOP를 실행할까요?'),
                [i18n.t('common.확인'), i18n.t('common.취소')],
                this.onRunSOP
            );
        }
        else if (alarm.sopStatus === 0) {
            this.props.showConfirmDialog(i18n.t('common.확인'),
                i18n.t('sdms.event.해당 SOP는 이미 실행 요청되었습니다'),
                [i18n.t('common.확인')],
                null
            );
        }
        else if (alarm.sopStatus === 1) {
            this.props.showConfirmDialog(i18n.t('common.확인'),
                i18n.t('sdms.event.해당 SOP가 이미 진행중입니다'),
                [i18n.t('common.확인')],
                null
            );
        }
        else if (alarm.sopStatus === 2) {
            this.props.showConfirmDialog(i18n.t('common.확인'),
                i18n.t('sdms.event.해당 SOP는 이미 종료되었습니다'),
                [i18n.t('common.확인')],
                null
            );
        }
    }

    onRunSOP = async (index) => {
        if (index === 0) {
            // sop 새탭으로 띄우기
            window.open(ProjectResource.path.sopSimulator);

            const alarm = this.props.selectedAlarm;
            await SDMSController.requestSituationNotice(alarm.facilityType, alarm.sensorZoneID);
            this.props.closeConfirmDialog();
        }
        else {
            this.props.closeConfirmDialog();
        }
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
        this.props.showConfirmDialog(i18n.t('common.확인'),
            [i18n.t('sdms.event.방송장비의 알람상태를 해제합니다'), i18n.t('sdms.event.진행중인 방송이 있으면 즉시 종료됩니다'), i18n.t('sdms.event.계속 할까요?')],
            [i18n.t('sdms.event.방송종료'), i18n.t('common.취소')],
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
            alert(message);
        }
    }

    onClickOnOffBroadcast = (onOff) => {
        if (onOff === SDMSResource.BroadcastState.Stop) {
            // 방송 시작
            this.props.showConfirmDialog(i18n.t('common.확인'),
                [i18n.t('sdms.event.방송장비의 알람상태를 동작합니다'), i18n.t('sdms.event.방송을 진행하게 됩니다'), i18n.t('sdms.event.계속 할까요?')],
                [i18n.t('sdms.event.방송시작'), i18n.t('common.취소')],
                this.onClickOnOffBroadcastOption
            );
        } else if (onOff === SDMSResource.BroadcastState.Run) {
            // 방송 중지
            this.props.showConfirmDialog(i18n.t('common.확인'),
                [i18n.t('sdms.event.방송장비의 알람상태를 해제합니다'), i18n.t('sdms.event.진행중인 방송이 있으면 즉시 종료됩니다'), i18n.t('sdms.event.계속 할까요?')],
                [i18n.t('sdms.event.방송종료'), i18n.t('common.취소')],
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
            alert(message);
        }
    }

    displayBroadcastUI = () => {
        let displayBroadcastUI = [];

        const siteID = ProjectResource.SiteID;

        if (siteID === ProjectResource.Site.Soulbrain) {
            if (this.broadcastIsRunning() === true) {
                displayBroadcastUI.push(<img className={'imgBroadcast'} src={imgCloseBroadcast} title={i18n.t('sdms.event.방송장비의 알람상태를 해제하며, 진행중인 방송이 있으면 종료시킵니다')} onClick={this.onClickCloseBroadcast} />);
            }
        } else if (siteID === ProjectResource.Site.GCC) {
            const state = this.broadcastState();

            if (state === SDMSResource.BroadcastState.Run) {
                // 방송 중 경우
                displayBroadcastUI.push(<img className={'imgBroadcast'} src={imgCloseBroadcast} title={i18n.t('sdms.event.방송장비의 알람상태를 동작시키며, 방송을 진행하게 됩니다')} onClick={() => this.onClickOnOffBroadcast(state)} />);
            } else if (state === SDMSResource.BroadcastState.Stop) {
                // 방송 중지 경우
                displayBroadcastUI.push(<img className={'imgBroadcast'} src={imgOnBroadcast} title={i18n.t('sdms.event.방송장비의 알람상태를 해제하며, 진행중인 방송이 있으면 종료시킵니다')} onClick={() => this.onClickOnOffBroadcast(state)} />);
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

        if (!selectedAlarm) {
            return <></>
        }

        let evtClassName = 'evtFIRE';
        let evtHydrogenClassName = 'evtFireH';
        let evtGGClassName = 'evtFIRE';

        if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
            if (selectedAlarm.positionName.indexOf('화재센서') > 0) {
                evtHydrogenClassName = 'evtFireH';
            } else if (selectedAlarm.positionName.indexOf('압력센서') > 0) {
                evtHydrogenClassName = 'evtPressure';
            } else if (selectedAlarm.positionName.indexOf('온도센서') > 0) {
                evtHydrogenClassName = 'evtTemperature';
            } else if (selectedAlarm.positionName.indexOf('긴급차단장치') > 0) {
                evtHydrogenClassName = 'evtShutoff';
            } else if (selectedAlarm.positionName.indexOf('유량센서') > 0) {
                evtHydrogenClassName = 'evtFlowRate';
            } else if (selectedAlarm.positionName.indexOf('가스센서') > 0) {
                evtHydrogenClassName = 'evtGas';
            }
        } 
        else if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            if (selectedAlarm.facilityType === SDMSResource.facilityType.FIRE) {
                evtGGClassName = 'evtFIRE';
            } else if (selectedAlarm.facilityType === SDMSResource.facilityType.Earthquake) {
                evtGGClassName = 'evtEarthquake';
            } else if (selectedAlarm.facilityType === SDMSResource.facilityType.EmergencyBell) {
                evtGGClassName = 'evtEmergencyBell';
            } else if (selectedAlarm.facilityType === SDMSResource.facilityType.LowBattery ||
                        selectedAlarm.facilityType === SDMSResource.facilityType.BLACKOUT) {
                evtGGClassName = 'evtElectric';
            } else if (selectedAlarm.facilityType === SDMSResource.facilityType.WaterLevel) {
                evtGGClassName = 'evtWaterLevel';
            } else if (selectedAlarm.facilityType === SDMSResource.facilityType.Terror) {
                evtGGClassName = 'evtTerror';
            } else if (selectedAlarm.facilityType === SDMSResource.facilityType.PSM_SENSOR) {
                evtGGClassName = 'evtPSMGas';
            } 
        } 
        else {
            if (selectedAlarm.facilityType >= 0) {
                if (selectedAlarm.facilityType === SDMSResource.facilityType.FIRE) {
                    evtClassName = 'evtFIRE';
                    evtHydrogenClassName = 'evtFireH';
                } else if (SDMSResource.isPSMSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtPSM';
                } else if (SDMSResource.isETCSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtETC';
                } else if (SDMSResource.isSVMSSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtSVMS';
                } else if (SDMSResource.isEnvironmentSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtEnvironment';
                } else if (SDMSResource.isManufactureSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtManufacture';
                } else if (SDMSResource.isBeaconSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtBecon';
                } else if (SDMSResource.isLaserSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtLaser';
                } else if (SDMSResource.isDoorSensorType(selectedAlarm.facilityType)) {
                    evtClassName = 'evtDoor';
                }
            }
        }

        let eventClassName = null;
        if (ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen) {
            eventClassName = evtHydrogenClassName;
        }
        else if (ProjectResource.styleMode === ProjectResource.StyleType.Gyeonggi) {
            eventClassName = evtGGClassName;
        }
        else {
            eventClassName = evtClassName;
        }

        return (
            <div className={'dseInfo'}>
                <em className={eventClassName}>이벤트 아이콘</em>
                <div>
                    <p>
                        <span>{i18nUtil.convertText(this.props.selectedAlarm.positionName)}</span>
                        {
                            (this.props.selectedAlarm.reportPerson.length === 0 && this.props.selectedAlarm.memo.length === 0)
                                ? <></>
                                : <>
                                    <span>{(this.props.selectedAlarm.reportPerson.length === 0) ? ' - ' : this.props.selectedAlarm.reportPerson}</span>
                                    <span>{(this.props.selectedAlarm.memo?.length > 0) ? this.props.selectedAlarm.memo : ' - '}</span>
                                </>
                        }
                    </p>
                    <p>{this.props.selectedAlarm.strDateTime}</p>
                    <p>{i18nUtil.convertText(this.props.selectedAlarm.message)}</p>
                </div>
            </div>
        );
    }

    setPopupMemo = async (isOpen, sensorZoneHistoryID, memoContent) => {
        if (isOpen) {
            const selectedAlarm = this.props.selectedAlarm;
            let _sensorZoneHistoryID = selectedAlarm.sensorZoneHistoryID;
            let _memoContent = selectedAlarm.alarmMemo;

            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                const alarm = await SDMSController.requestAlarmData(sensorZoneHistoryID);

                if (alarm) {
                    if (sensorZoneHistoryID > 0) _sensorZoneHistoryID = sensorZoneHistoryID;
                    _memoContent = alarm.alarmMemo;
                    this.setState({ popupMemoHistoryID: _sensorZoneHistoryID, popupMemoContent: _memoContent });
                }
            }
            else {
                if (sensorZoneHistoryID > 0) {
                    _sensorZoneHistoryID = sensorZoneHistoryID;
                    _memoContent = memoContent;
                }
    
                if (sensorZoneHistoryID !== null && sensorZoneHistoryID > 0) {
                    // 메모 팝업 열기
                    this.setState({ popupMemoHistoryID: _sensorZoneHistoryID, popupMemoContent: _memoContent });
                }
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
        const userInfo = ProjectResource.getUserInfo();
        let useAlarmMemo = false;
        useAlarmMemo = (ProjectResource.SiteID === ProjectResource.Site.GG_A) && (userInfo?.options?.ui?.useAlarmMemo === true);
        
        let btnUI =
            <ul className={'noMemoIconBox'}>
                {
                    ProjectResource.SiteID !== ProjectResource.Site.CheongSim &&
                        <li onClick={this.onSituationNotice}><span className={/*"shortcutKey" + " " + */'eventShortCut' + " " + 'hideKey'}>Sh+Q</span><span className={'eIcon1'}></span><a>S O P</a></li>
                }

                {
                    ProjectResource.SiteID !== ProjectResource.Site.CheongSim &&
                    <li onClick={() => this.onMoveSelectedAlarm()}><span className={/*"shortcutKey" + " " +*/ 'eventShortCut' + " " + 'hideKey'}>Sh+W</span><span className={'eIcon2'}></span><a>{i18n.t('sdms.event.화면전환')}</a></li>
                }

                {
                    (this.props.alarmSound)
                        ? <li onClick={this.onSound}><span className={/*"shortcutKey" + " " +*/ 'eventShortCut' + " " + 'hideKey'}>Sh+E</span><span className={'eIcon3'}></span><a>{i18n.t('sdms.event.소리끄기')}</a></li>
                        : <li onClick={this.onSound}><span className={/*"shortcutKey" + " " +*/ 'eventShortCut' + " " + 'hideKey'}>Sh+E</span><span className={'eIcon4'}></span><a>{i18n.t('sdms.event.소리켜기')}</a></li>
                }
                {
                    (useAlarmMemo)
                        ? <li onClick={() => this.setPopupMemo(true, this.props?.selectedAlarm?.sensorZoneHistoryID, this.props?.selectedAlarm?.alarmMemo)}><span className={'eventShortCut' + " " + 'hideKey'}></span><span className={'eIcon5'}></span><a>{i18n.t('sdms.event.메모')}</a></li>
                        : <React.Fragment></React.Fragment>
                }
                <li onClick={this.onMalfunction}><span className={/*"shortcutKey" + " " +*/ 'eventShortCut' + " " + 'hideKey'}>Sh+R</span><span className={'eIcon6'}></span><a>{i18n.t('sdms.event.종료')}</a></li>
            </ul>; 

        return btnUI;
    }

    getSelectSiteUI = () => {
        const sites = ProjectResource?.sites;
        const userInfo = ProjectResource?.getUserInfo();

        let selectSiteUI_GG = [];

        if(userInfo?.siteID === ProjectResource.Site.GG_A) {
            for (let i = 0; i < sites?.length; i++) {
                const siteData = sites[i];
                if (siteData.id === ProjectResource.Site.GG_A) {
                    selectSiteUI_GG.push(<option key={"selectSiteUI_" + siteData.id} value={-1}>전체기관</option>);
                }
                else {
                    selectSiteUI_GG.push(<option key={"selectSiteUI_" + siteData.id} value={siteData.id}>{siteData.siteName}</option>);
                }
            }
        } 

        return selectSiteUI_GG;
    }

    getFacilityTypeUI = () => {
        const facilityTypeUI = [];
        const useSensorTypes = this.props.useSensorTypes;

        facilityTypeUI.push(<option key={"facilityType_All"} value={-1}>{i18n.t('common.전체')}</option>);

        if (useSensorTypes?.UseFire)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.FIRE} value={SDMSResource.facilityType.FIRE}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.FIRE)}</option>);
        if (useSensorTypes?.UsePSM)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.PSM_SENSOR} value={SDMSResource.facilityType.PSM_SENSOR}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.PSM_SENSOR)}</option>);
        if (useSensorTypes?.UseETC)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.ETC} value={SDMSResource.facilityType.ETC}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.ETC)}</option>);
        if (useSensorTypes?.UseSVMS)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.Intrusion_S1} value={SDMSResource.facilityType.Intrusion_S1}>{"SVMS"}</option>);
        if (useSensorTypes?.UseEarthquake)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.Earthquake} value={SDMSResource.facilityType.Earthquake}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.Earthquake)}</option>);
        if (useSensorTypes?.UseStrongWind)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.STRONG_WIND} value={SDMSResource.facilityType.STRONG_WIND}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.STRONG_WIND)}</option>);
        if (useSensorTypes?.UseBlackOut)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.BLACKOUT} value={SDMSResource.facilityType.BLACKOUT}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.BLACKOUT)}</option>);
        if (useSensorTypes?.UseBecon)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.Becon_Stay} value={SDMSResource.facilityType.Becon_Stay}>{"비콘"}</option>);
        if (useSensorTypes?.UseEnvironment)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.Environment} value={SDMSResource.facilityType.Environment}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.Environment)}</option>);
        if (useSensorTypes?.UseManufacture)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.Manufacture} value={SDMSResource.facilityType.Manufacture}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.Manufacture)}</option>);
        if (useSensorTypes?.UseLaser)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.Laser} value={SDMSResource.facilityType.Laser}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.Laser)}</option>);
        if (useSensorTypes?.UseDoor)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.DOOR} value={SDMSResource.facilityType.DOOR}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.DOOR)}</option>);
        if (useSensorTypes?.UseEmergencyBell)
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.EmergencyBell} value={SDMSResource.facilityType.EmergencyBell}>{SDMSResource.getFacilityTypeString(SDMSResource.facilityType.EmergencyBell)}</option>);
        if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.LowBattery} value={SDMSResource.facilityType.LowBattery}>전력</option>);
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.WaterLevel} value={SDMSResource.facilityType.WaterLevel}>침수</option>);
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.Terror} value={SDMSResource.facilityType.Terror}>테러</option>);
            facilityTypeUI.push(<option key={"facilityType_" + SDMSResource.facilityType.PSM_SENSOR} value={SDMSResource.facilityType.PSM_SENSOR}>가스누출</option>);
        }

        return facilityTypeUI;
    }

    onChangeFacilityType = (e) => {
        const target = e.target;
        let facilityTypeID = parseInt(target.value);

        if (isNaN(facilityTypeID))
            return;
        else if (facilityTypeID === -1)
            facilityTypeID = null;

        this.setState({ selectedType: facilityTypeID });
    }

    onChangeSite = (e) => {
        const target = e.target;
        let siteID = parseInt(target.value);

        if (isNaN(siteID))
            return;
        else if (siteID === -1)
            siteID = null;

        this.setState({ selectedSite: siteID });
    }

    getTableUI = () => {
        // 알람메모 옵션 여부 확인
        const userInfo = ProjectResource.getUserInfo();
        let colgroupUI = null;
        let theadUI = null;

        let useSOP = true;
        let useAlarmMemo = true;

        useAlarmMemo = (userInfo?.options?.ui?.useAlarmMemo === true);

        if (useSOP === true && useAlarmMemo === true) {
            colgroupUI =
                <colgroup>
                    <col className={'width_25Pro'} />
                    <col className={'width_15Pro'} />
                    <col className={'width_10Pro'} />
                    <col className={'width_13Pro'} />
                    <col className={'width_10Pro'} />
                    <col className={'width_13Pro'} />
                    <col className={'width_14Pro'} />
                </colgroup>
        }
        else if (useSOP === true) {
            colgroupUI =
                <colgroup>
                    <col className={'width_25Pro'} />
                    <col className={'width_20Pro'} />
                    <col className={'width_12Pro'} />
                    <col className={'width_15Pro'} />
                    <col className={'width_13Pro'} />
                    <col className={'width_15Pro'} />
                </colgroup>
        }
        else if (useAlarmMemo === true) {
            colgroupUI =
                <colgroup>
                    <col className={'width_25Pro'} />
                    <col className={'width_20Pro'} />
                    <col className={'width_12Pro'} />
                    <col className={'width_15Pro'} />
                    <col className={'width_13Pro'} />
                    <col className={'width_15Pro'} />
                </colgroup>
        }
        else {
            colgroupUI =
                <colgroup>
                    <col className={'width_28Pro'} />
                    <col className={'width_23Pro'} />
                    <col className={'width_15Pro'} />
                    <col className={'width_18Pro'} />
                    <col className={'width_16Pro'} />
                </colgroup>
        }

        theadUI =
            <thead>
                <tr>
                    <th>{i18n.t('sdms.event.발생 일시')}</th>
                    <th>{i18n.t('sdms.event.상황 유형')}</th>
                    <th>{i18n.t('sdms.event.단계')}</th>
                    <th>{i18n.t('common.위치')}</th>
                    <th>{i18n.t('sdms.event.알람')}</th>
                    {(useSOP === true) && <th>SOP</th>}
                    {(useAlarmMemo === true) && <th>{i18n.t('sdms.event.메모')}</th>}
                </tr>
            </thead>;



        
        return [colgroupUI, theadUI];
    }

    render() {
        const gridUI = this.setGridUI();
        const btnUI = this.getBtnUI();
        const [colgroupUI, theadUI] = this.getTableUI();
        //const selectSiteUI_GG = this.getSelectSiteUI();
        const facilityTypeUI = this.getFacilityTypeUI();
        const userInfo = ProjectResource?.getUserInfo();

        return (
            <>
                <EventComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardEvent'}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={360}
                        popupMinHeight={300}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        <div className={'dslTop dslGrd'}>
                            <h5 className={'dslTitle'} >
                                {i18n.t('sdms.event.이벤트 정보')}
                            </h5>
                            {
                                this.displayBroadcastUI()
                            }
                            <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.eventInfo, false)}></a>
                        </div>
                        <div className={'dslContEvent'}>
                            <div ref={this.refAlarmList} className={'alarmList'}>
                                <div className='alarmListTop'>
                                    <h5 ref={this.refTitle} className={'dseTitle'}>{i18n.t('sdms.event.발생 현황')}</h5>
                                    {
                                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen 
                                            ? <></>
                                            : <>
                                                <select className={'eventSel'} onChange={this.onChangeFacilityType}>
                                                    {facilityTypeUI}
                                                </select>
                                            </>
                                    }
                                </div>
                                <div ref={this.refHeader} className={'dseTop'}>
                                    <table>
                                        {colgroupUI}
                                        { theadUI }
                                    </table>
                                </div>
                                <div className={'dseTb scrollbar'}>
                                    {/* <Scrollbars ref={this.refScrollbar}> */}
                                        <table ref={this.refTable}>
                                            <caption>이벤트 발생일시, 상황유형, 단계, 위치, 대응상태로 구성된 표</caption>
                                            { colgroupUI }
                                            <tbody>
                                                {gridUI}
                                            </tbody>
                                        </table>
                                    {/* </Scrollbars> */}
                                </div>
                            </div>
                            <div className={'alarmDetail'}>
                                <div className={'gap10'}></div>
                                <h5 className={'dseTitle'}>{i18n.t('sdms.event.세부정보')}</h5>
                                {this.getAlarmInfo()}
                                    {btnUI}
                            </div>
                        </div>
                    </PopupDraggable>
                </EventComponent>
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
            </>
        );
    }
}

export default withTranslation()(Event);