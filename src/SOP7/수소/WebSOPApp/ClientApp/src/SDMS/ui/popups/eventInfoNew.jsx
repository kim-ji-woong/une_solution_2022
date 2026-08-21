import React, { Component } from 'react';
import ProjectResource from '../../../Root/resource/id';
import SDMSResource from '../../resource/id';
import AccountResource from '../../../Account/resource/id';
import SDMS from '../sdms';
import PopupDraggable from './popupDraggable';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SettingsStore from '../../../Settings/settingsStore';
import { EventInfoComponent } from '../../styled/sdmsPopupsStyled';
import $ from 'jquery';
import imgClose from '../../../Common/img/imghydrogen/common/closeX_icon.svg';
import { SDMSController } from '../../services/sdmsController';

import HistoryController from '../../../History/services/historyController';


class EventInfoNew extends Component {
    static Sort_Earliest = 0;
    static Sort_Latest = 1;

    constructor(props){
        super(props);

        this.state = {
            clickMemoUI: false,
            sortAlarm: [],
            sortType: EventInfoNew.Sort_Earliest,
        }

        this.handlePen = React.createRef(null);
        this.dropdownRef = React.createRef();

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }
    
    componentDidMount(){
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

        this.sortAlarmData();

        // 이미 선택된 알람 포커스 효과
        if (this.props.selectedAlarm && this.props.selectedAlarm.isAlarm === true) {
            this.onFocusAlarmUI(this.props.selectedAlarm, true);
        }       

        document.addEventListener("keyup", this.handlePen, false);
        
        document.addEventListener("click", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside);
    }

    // 드롭다운박스 이외의 영역 클릭 시 focus 효과 삭제
    handleClickOutside = (e) => {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(e.target)) {
            this.dropdownRef.current.classList.remove('on');
        }
    };

    repositionPopup(popupState) {
        let data = popupState.eventInfoNew;

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

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex
        }
        // 알람 정보가 바뀐 경우
        if (this.props.sensorAlarms !== prevProps.sensorAlarms) {
            this.sortAlarmData();
        }
        // 알람 정보가 바뀐 경우
        if (this.props.selectedAlarm !== prevProps.selectedAlarm) {
            this.onFocusAlarmUI(this.props.selectedAlarm);
        }

        //this.setScrollbar();
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    sortAlarmData = () => {
        const sensorAlarms = this.props.sensorAlarms;
        let alarmDatas = [];
        let sortAlarm = [];

        if (this.props.sensorAlarms?.length > 0) {
            // 센서 별로 알람을 최신 순으로 묶고
            for (const alarm of this.props.sensorAlarms) {
                //const data = alarmDatas[alarm.orgSensorID];
                const data = alarmDatas.find(x => x.orgSensorID === alarm.orgSensorID);

                if (!data) {
                    // 해당 센서 알람 정보가 존재하지 않는다면
                    let alarmData = new Object();
                    alarmData.orgSensorID = alarm.orgSensorID;
                    alarmData.date = alarm.dtTime;
                    alarmData.isAlarm = alarm.isAlarm;
                    alarmData.sensorZoneHistoryID = alarm.sensorZoneHistoryID;
                    alarmData.facilityType = alarm.facilityType;
                    alarmData.alarmDepth = alarm.alarmDepth;
                    alarmData.list = [];
                    alarmData.list.push(alarm);
                    
                    alarmDatas.push(alarmData);
                }
                else {
                    // 해당 센서 알람 정보가 이미 존재한다면
                    data.list.push(alarm);
                }
            }

            sortAlarm = alarmDatas.sort((a, b) => {
                if (this.state.sortType === EventInfoNew.Sort_Latest) {
                    return ( (a.isAlarm === false && b.isAlarm === true) ? 1 : ((a.isAlarm === true && b.isAlarm === false) ? -1 : 0) || (new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1) );
                }
                else {
                    return ( (a.isAlarm === false && b.isAlarm === true) ? 1 : ((a.isAlarm === true && b.isAlarm === false) ? -1 : 0) || (new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1) );
                }
            });
        }

        this.setState({ sortAlarm });
    }

    onClickSOPPractice = (alarm) => {
        const sopPractice = document.getElementById('sopPractice_' + alarm.sensorZoneHistoryID);

        if (sopPractice) {
            sopPractice.classList.add('on');

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

            sopPractice.classList.remove('on');
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

    onClickSOPEnd = (alarm) => {
        const sopEnd = document.getElementById('sopEnd_' + alarm.sensorZoneHistoryID);

        if(sopEnd){
            sopEnd.classList.add('on');

            const userAuthor = ProjectResource.getUserAuthor();

            if (alarm.isAlarm) {
                // 권한에 따른 상황 종료 여부
                if (userAuthor === AccountResource.accountLevelID.master ||
                    userAuthor === AccountResource.accountLevelID.admin)
                    this.props.onMalfunction(alarm);
                else
                    this.props.onAuthorError();
            }

            sopEnd.classList.remove('on');
        }

        
    }

    onClickSOPAlarmNum = (sensorZoneHistoryID) => {
        const sopAlarmNum = document.getElementById('sopAlarmNum_' + sensorZoneHistoryID);
        const eventInfoAlarmList = document.getElementById('eventInfoAlarmList_' + sensorZoneHistoryID);

        if(sopAlarmNum){
            if(sopAlarmNum.classList.contains('on')){
                sopAlarmNum.classList.remove('on');
            }
            else{
                sopAlarmNum.classList.add('on');
            }
        }

        if(eventInfoAlarmList.classList.contains('on')){
            eventInfoAlarmList.classList.remove('on');
        }
        else{
            eventInfoAlarmList.classList.add('on');
        }
    }

    onClickEventBox = (alarm) => {
        if (alarm.isAlarm === false)
            return;

        // UI 포커스 작업
        this.onFocusAlarmUI(alarm);

        // 해당 알람 선택
        this.props.onSelectedAlarm(alarm);
    }

    onFocusAlarmUI = (alarm, isFirst = false) => {
        const eventInfoBox = document.getElementById('eventInfoBox_' + alarm?.sensorZoneHistoryID);

        if (eventInfoBox && eventInfoBox.classList.contains('on') && alarm.isAlarm) {
            // 이미 선택된 경우
            return;
        }
        else if (isFirst === true && !eventInfoBox) {
            // 아직 UI가 생성이 안된 경우
            setTimeout(() => this.onFocusAlarmUI(alarm), 500);
            return;
        }

        // 기존 선택제거
        const eventInfos = document.getElementsByClassName('eventInfoBox on');
        if (eventInfos) {
            for (let i = 0; i < eventInfos.length; i++) {
                const eventInfo = eventInfos[i];

                eventInfo.classList.remove('on');
            }
        }

        // 해당 알람 선택        
        if (eventInfoBox && alarm.isAlarm) {
            eventInfoBox.classList.toggle('on');
        }
    }

    handlePen = (alarm) => {
        console.log('여기까지 들어옴?');
    }

    searchEnterKey = (e, alarm) => {
        if (e.keyCode === 13) {
            this.openMemoSave(alarm);
        }
    }

    getEventInfoBox = () => {
        let ui = [];

        const sortAlarm = this.state.sortAlarm;

        for (let i = 0; i < sortAlarm.length; i++) {
            const alarm = sortAlarm[i];
            let alarmCnt = 0;
            let detailUI = [];
            let sensorName = this.getSensorName(alarm.list[0]);

            let eventClass = "eventGrayCircle";
            if (alarm.isAlarm === true) {                
                if (alarm.alarmDepth >= 3) {
                    eventClass = "eventRedCircle";
                }
                else {
                    eventClass = "eventYellowCircle";
                }
            }               
            
            if (alarm.list.length > 1) {
                for (let j = 1; j < alarm.list.length; j++) {
                    let item = alarm.list[j];

                    let sopStatusText = i18n.t('sdms.event.대기');

                    if (item.sopStatus === 1) {
                        sopStatusText = i18n.t('sdms.event.실행중');
                    }
                    else if (item.sopStatus === 2) {
                        sopStatusText = i18n.t('sdms.event.종료');
                    }
                    if (item.isAlarm === false) {
                        sopStatusText = i18n.t('sdms.event.종료');
                    }

                    let dtTime = item.dtTime;
                    dtTime = dtTime.replace("T", " ");

                    detailUI.push(
                        <>
                            <div className={'eventInfoTop_disable'}>
                                <span className={'eventInfoDisable'}></span>
                                <span>{i18nUtil.convertText(sensorName)}</span>
                            </div>
                            <div className={'eventInfoContents_disable'}>
                                <div>{i18n.t('sdms.event.위치')} : {i18nUtil.convertText(item.positionName)}</div>
                                <div>{i18n.t('sdms.event.발생유형')} : {i18nUtil.convertText(item.materialTypeString)}</div>
                                <div>{i18n.t('sdms.event.발생일시')} : {dtTime}</div>
                                <div>SOP : {sopStatusText}</div>
                                {/* <div>Memo : {item.memo}</div> */}

                                <div id={'memoArea_' + item.sensorZoneHistoryID} className={'memoArea'}>{i18n.t('sdms.event.메모')} :
                                    <span id={'inputReadOnly_' + item.sensorZoneHistoryID} className={'inputReadOnly2'}><p id={'memoBox_p' + item.sensorZoneHistoryID} className={'memoBox2'}>{item.alarmMemo}</p></span>
                                    <span id={'inputActive_' + item.sensorZoneHistoryID} className={'inputActive2'}><input type="text" id={'memoBox_' + item.sensorZoneHistoryID} className={'memoBox2'} onKeyUp={(e) => this.searchEnterKey(e, item)} /></span>
                                    <div id={'memoCheckBox_' + item.sensorZoneHistoryID} className={'memoCheckBox2'}>
                                        <span id={'memoCheck_icon_' + item.sensorZoneHistoryID} className={'memoCheck_icon'} onClick={() => this.openMemoSave(item)}></span>
                                        <span id={'memoClose_icon_' + item.sensorZoneHistoryID} className={'memoClose_icon'} onClick={() => this.openMemoClose(item)}></span>
                                    </div>
                                    <span id={'openMemoPen_' + item.sensorZoneHistoryID} className={'openMemoPen2'} onClick={() => this.openMemo(item)}></span>
                                </div>
                            </div>
                        </>
                    );

                    alarmCnt++;
                }
            }

            let sopStatusText = i18n.t('sdms.event.대기');
            if (alarm.list[0].sopStatus === 1) {
                sopStatusText = i18n.t('sdms.event.실행중');
            }
            else if (alarm.list[0].sopStatus === 2) {
                sopStatusText = i18n.t('sdms.event.종료');
            }
            if (alarm.list[0].isAlarm === false) {
                sopStatusText = i18n.t('sdms.event.종료');
            }

            let dtTime = alarm.list[0].dtTime;
            dtTime = dtTime.replace("T", " ");

            let anomalyBtn = null;
            let sopBtn = (<button className='sopPractice' id={'sopPractice_' + alarm.sensorZoneHistoryID} onClick={() => this.onClickSOPPractice(alarm.list[0])}>SOP</button>);
            if (alarm.facilityType === SDMSResource.facilityType.Anomaly) {
                anomalyBtn = (<button className='detailInfo' id={'detailInfo_' + alarm.sensorZoneHistoryID} onClick={() => this.props.onSelectAnomalyID(alarm.orgSensorID)}>상세정보</button>);
                sopBtn = null;
            }

            ui.push(
                <div className={alarm.isAlarm ? 'eventInfoBox' : 'eventInfoBox closed'} id={'eventInfoBox_' + alarm.sensorZoneHistoryID} key={alarm.date + "_" + alarm.sensorZoneHistoryID + "_1"} onClick={() => this.onClickEventBox(alarm.list[0])}>
                    <div className={'eventInfoTop'}>
                        <span className={eventClass}></span>
                        <span>{i18nUtil.convertText(sensorName)}</span>
                    </div>

                    <div className={'eventInfoContents'}>
                        <div>{i18n.t('sdms.event.위치')} : {i18nUtil.convertText(alarm.list[0].positionName)}</div>
                        <div>{i18n.t('sdms.event.발생유형')} : {i18nUtil.convertText(alarm.list[0].materialTypeString)}</div>
                        <div>{i18n.t('sdms.event.발생일시')} : {dtTime}</div>
                        <div>SOP : {sopStatusText}</div>
                        <div id={'memoArea_' + alarm.sensorZoneHistoryID} className={'memoArea'}>{i18n.t('sdms.event.메모')} :
                            <span id={'inputReadOnly_' + alarm.sensorZoneHistoryID} className={'inputReadOnly'}><p id={'memoBox_p' + alarm.sensorZoneHistoryID} className={'memoBox'}>{alarm.list[0].alarmMemo}</p></span>
                            <span id={'inputActive_' + alarm.sensorZoneHistoryID} className={'inputActive'}><input type="text" id={'memoBox_' + alarm.sensorZoneHistoryID} className={'memoBox'} onKeyUp={(e) => this.searchEnterKey(e, alarm.list[0])} /></span>
                            <div id={'memoCheckBox_' + alarm.sensorZoneHistoryID} className={'memoCheckBox'}>
                                <span id={'memoCheck_icon_' + alarm.sensorZoneHistoryID} className={'memoCheck_icon'} onClick={() => this.openMemoSave(alarm.list[0])}></span>
                                <span id={'memoClose_icon_' + alarm.sensorZoneHistoryID} className={'memoClose_icon'} onClick={() => this.openMemoClose(alarm.list[0])}></span>
                            </div>
                            <span id={'openMemoPen_' + alarm.sensorZoneHistoryID} className={'openMemoPen'} onClick={() => this.openMemo(alarm.list[0])}></span>
                        </div>
                    </div>
                    <div id={'eventInfoAlarmList_' + alarm.sensorZoneHistoryID} className={'eventInfoAlarmList'}>
                        { detailUI }
                    </div>
                    <div className={'eventInfoButton'} key={alarm.date + "_" + alarm.sensorZoneHistoryID + "_2"}>
                        <div>
                            {anomalyBtn}
                            {sopBtn}
                            <button className='sopEnd' id={'sopEnd_' + alarm.sensorZoneHistoryID} onClick={() => this.onClickSOPEnd(alarm.list[0])}>{i18n.t('sdms.event.종료')}</button>
                        </div>
                        {
                            alarmCnt > 0 &&
                            <button id={'sopAlarmNum_' + alarm.sensorZoneHistoryID} onClick={() => this.onClickSOPAlarmNum(alarm.sensorZoneHistoryID)}>{alarmCnt}</button>
                        }
                        
                    </div>
                </div>
            );
        }

        return ui;

    }

    getSensorName = (alarm) => {
        const sensorList = this.props.sensorList;

        let sensors = null;        
        let sensorName = null;

        if (alarm.facilityType === SDMSResource.facilityType.H2) {
            sensors = sensorList['h2Sensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.Temp) {
            sensors = sensorList['tempSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.Flow) {
            sensors = sensorList['flowSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.Conductivity) {
            sensors = sensorList['conductSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.GAS) {
            sensors = sensorList['gasSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.PRESSURE_SENSOR) {
            sensors = sensorList['pressureSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.H2JAG) {
            sensors = sensorList['h2JAGSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.H2Low_Senko) {
            sensors = sensorList['h2LowSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.O2JAG) {
            sensors = sensorList['o2JAGSensors'];
        } else if (alarm.facilityType === SDMSResource.facilityType.O2_Senko) {
            sensors = sensorList['o2Sensors'];
        }

        if (sensors) {
            const sensor = sensors.find(x => x.id === alarm.orgSensorID);
            
            if (sensor) {
                sensorName = sensor.name;
            }
        }
        else if (alarm.facilityType === SDMSResource.facilityType.Anomaly || alarm.facilityType === SDMSResource.facilityType.Risk) {
            sensors = sensorList['h2Sensors'];
            let sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['tempSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['flowSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['conductSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['gasSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['pressureSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['o2Sensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['h2LowSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['h2JAGSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }

            sensors = sensorList['o2JAGSensors'];
            sensor = sensors.find(x => x.id === alarm.orgSensorID);
            if (sensor) {
                sensorName = sensor.name;
                return sensorName;
            }
        }

        return sensorName;
    }

    onClickEventSelect = () => {
        const dslEventSelect = document.getElementById('dslEventSelect');
        dslEventSelect.classList.toggle('on');
    }

    openMemo = (alarm) => {
        // UI 기능
        const memoCheckBox = document.getElementById('memoCheckBox_' + alarm.sensorZoneHistoryID);
        const inputActive = document.getElementById('inputActive_' + alarm.sensorZoneHistoryID);
        const inputReadOnly = document.getElementById('inputReadOnly_' + alarm.sensorZoneHistoryID);
        const openMemoPen = document.getElementById('openMemoPen_' + alarm.sensorZoneHistoryID);
        const memoArea = document.getElementById('memoArea_' + alarm.sensorZoneHistoryID);
        
        memoCheckBox.classList.add('on');
        inputActive.classList.add('on');
        inputReadOnly.classList.add('disable');
        openMemoPen.classList.add('disable');

        memoArea.classList.remove('memoArea');
        memoArea.classList.add('memoAreaActive');

        // 내용 채우기
        const memoBox = document.getElementById('memoBox_' + alarm.sensorZoneHistoryID);
        if (memoBox)
            memoBox.value = (alarm.alarmMemo === null || alarm.alarmMemo === undefined ? "" : alarm.alarmMemo);
    }

    openMemoSave = async (alarm) => {
        // UI 기능
        const memoCheckBox = document.getElementById('memoCheckBox_' + alarm.sensorZoneHistoryID);
        const inputActive = document.getElementById('inputActive_' + alarm.sensorZoneHistoryID);
        const inputReadOnly = document.getElementById('inputReadOnly_' + alarm.sensorZoneHistoryID);
        const memoArea = document.getElementById('memoArea_' + alarm.sensorZoneHistoryID);        

        // 내용 저장
        const memoBox = document.getElementById('memoBox_' + alarm.sensorZoneHistoryID);
        const memo = memoBox.value;

        // UI 닫기
        memoCheckBox.classList.remove('on');
        inputActive.classList.remove('on');
        inputReadOnly.classList.remove('disable');

        memoArea.classList.remove('memoAreaActive');
        memoArea.classList.add('memoArea');

        //alarm.sensorZoneHistoryID
        // db update 관련 필요
        const result = await HistoryController.UpdateAlarmMemo(alarm.sensorZoneHistoryID, memo);
        if (result) {
            const memoBoxP = document.getElementById('memoBox_p' + alarm.sensorZoneHistoryID);
            if (memoBoxP)
                memoBoxP.innerText = memo;
            alarm.alarmMemo = memo;
        }
        else {
            //this.showConfirmDialog(i18n.t('common.오류'), [i18n.t('history.memo.메모를 저장할 수 없습니다')], null, null);
        }

        // 알람 리스트 전체적으로 주기적으로 메모 불러오기 기능 추가 필요         
    }

    openMemoClose = (alarm) => {
        const memoCheckBox = document.getElementById('memoCheckBox_' + alarm.sensorZoneHistoryID);
        const inputActive = document.getElementById('inputActive_' + alarm.sensorZoneHistoryID);
        const inputReadOnly = document.getElementById('inputReadOnly_' + alarm.sensorZoneHistoryID);
        const memoArea = document.getElementById('memoArea_' + alarm.sensorZoneHistoryID);

        // UI 닫기
        memoCheckBox.classList.remove('on');
        inputActive.classList.remove('on');
        inputReadOnly.classList.remove('disable');

        memoArea.classList.remove('memoAreaActive');
        memoArea.classList.add('memoArea');
  
    }

    onChangeSelect = (e) => {
        const value = e.target.value;
        let sortType = EventInfoNew.Sort_Earliest;

        if (value === EventInfoNew.Sort_Latest.toString()) {
            sortType = EventInfoNew.Sort_Latest;
        }

        this.state.sortType = sortType;
        this.sortAlarmData();
    }

    onClickAllClear = () => {
        this.props.showConfirmDialog(i18n.t('sdms.formText.알람 종료'), [i18n.t('sdms.formText.탐지된 신호를 전체종료할까요?')],
            [i18n.t('sdms.formText.종료'), i18n.t('common.취소')],
            this.onAllClear
        );
    }

    onAllClear = async (index) => {
        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        if (index === 0) {            
            SDMSController.requestAllClearReport(); // 전체복구
        }

        this.props.closeConfirmDialog();
    }

    onClickMute = () => {
        this.props.setMute();
    }

    render(){
        const eventInfoBox = this.getEventInfoBox();

        return(
            <>
                <EventInfoComponent id={this.props.popupType} className={'viewDashboardBoxD'} ref={this.handlePen}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={320}
                        popupMinHeight={330}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        <div className={'eventInfoTitle'}>
                            <span>{i18n.t('sdms.event.이벤트 정보')}</span>
                            <span className={'colseX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.eventInfoNew, false)}><a><img src={imgClose} alt={i18n.t('common.닫기')} /></a></span>
                        </div>
                        <div className={'dslContEvent'}>
                            <div className={'dslContBtnBox'}>
                                <select id={'dslEventSelect'} ref={this.dropdownRef} onClick={this.onClickEventSelect} onChange={(e) => this.onChangeSelect(e)}>                                    
                                    <option value={EventInfoNew.Sort_Earliest}>{i18n.t('sdms.event.최신순')}</option>
                                    <option value={EventInfoNew.Sort_Latest}>{i18n.t('sdms.event.오래된순')}</option>
                                </select>
                                <div>
                                    <span id={'mute'} className={'mute' + (this.props.isMute === true ? ' on' : '')} onClick={() => this.onClickMute()} data-tooltip-eventtext={i18n.t('sdms.event.음소거')}></span>
                                    <span className={'powerBtn'} onClick={() => this.onClickAllClear()} data-tooltip-eventtext={i18n.t('sdms.event.전체종료')}></span>
                                </div>
                            </div>

                            {/* <div className={'eventInfoBox'}>
                                <div>
                                    <span></span>
                                    <span>Hydrogen Production Compressor</span>
                                </div>
                            </div> */}
                            <div className={'eventInfoScroll'}>
                                {eventInfoBox}
                            </div>
                        </div>
                    </PopupDraggable>
                </EventInfoComponent>
            </>
        );
    }
}

export default withTranslation()(EventInfoNew);