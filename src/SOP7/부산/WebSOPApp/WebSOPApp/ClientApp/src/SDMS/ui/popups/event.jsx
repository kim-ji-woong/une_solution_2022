import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import PopupDraggable from './popupDraggable';
import { EventComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import SDMS from "../sdms";
import ProjectResource from "../../../Root/resource/id";
import {SDMSController} from "../../services/sdmsController";
import Proj from "proj4/lib/Proj";

class Event extends Component {
    
    static EventListType = {
        all: 1,
        unResponsive: 2,
        response: 3,
        test: 4,
    }
    
    static SortOrder = {
        latest: 1,
        oldest: 2
    }
    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
            
            eventListType: Event.EventListType.all,
            sortOrder: Event.SortOrder.latest,
            
            isShowMemo: false,
            
            isMalfunction: false,
        }
        
        this.clickTimeout = null;
    }
    
    changePopupOpacity = (value) => {
        this.setState({ opacity: value });
    }

    handleEventItem = (e, alarm) => {
        let isSingleClick = true;
        
        if (this.clickTimeout) {
            // DoubleClick
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
            
            const zoneID = alarm.zoneID;
            isSingleClick = false;
            const externalPOIInfo = this.props.externalPOIInfo;
            
            let targetPOI = null;
            if (alarm.materialType === SdmsResource.busanExternalMaterialType.Ampere) {
                targetPOI = externalPOIInfo.find(poi => poi.spaceID === alarm.zoneID);
            } else {
                targetPOI = externalPOIInfo.find(poi => poi.id === zoneID);
            }
            
            this.props.sendSelectPOI(targetPOI.spaceID, targetPOI.id);
            
        } else {
            // SingleClick
            this.clickTimeout = setTimeout(() => {
                this.clickTimeout = null;
            }, 300);
        }
        
        const element = document.getElementById('onEvent');

        if(element && element !== e.currentTarget.parentNode) element.id = '';

        if(e.currentTarget.parentNode.id === 'onEvent') e.currentTarget.parentNode.id = '';
        else e.currentTarget.parentNode.id = 'onEvent';
        
        this.props.setSelectedAlarm(alarm, isSingleClick);
    }
    
    getAlarmDepthString = (level, alarm) => {
        
        if (alarm.materialType === 31) {
            switch (level) {
                case 4: 
                    return 'OFF'; 
                default: 
                    return 'ON';
            }
        }
        
        switch (level) {
            case 1:
                return '좋음';
            case 2:
                return '보통';
            case 3:
                return '나쁨';
            case 4:
                return '심각';
            default:
                return '알 수 없음';
        }
    }
    
    onClickMalfunction = (alarm) => {
        if (!alarm)
            return;
        
        if (alarm.isAlarm) {
            this.props.onClickMalfunction(alarm);
        }
    }
    
    onClickRunSOP = async () => {
        const alarm = this.props.selectedAlarm;
        
        if (!alarm) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, '알람이 선택되지 않았습니다.', ['확인'], this.props.onCloseConfirmDialog);
        }
        
        if (!alarm.isAlarm) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, '이미 종료된 알람입니다..', ['확인'], this.props.onCloseConfirmDialog);
        }
        
        if (alarm.sopStatus !== 1) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["SOP가 진행중이거나 이미 종료되었습니다.\r\n연결된 SOP가 존재하지 않을수도 있습니다."], ['확인'], () => this.props.onCloseConfirmDialog());
        }
        
        await SDMSController.requestSituationNotice(alarm.facilityType, alarm.sensorZoneID);
        
        // 기존 탭에서 이동
        this.props.history.push({
            pathname: '/sop-simulator',
            state: alarm
        });
    }
    
    getAlarmListUI = () => {
        let sensorAlarms = this.props.sensorAlarms;

        if (sensorAlarms === null || sensorAlarms === undefined) {
            return null;
        }
        
        if (sensorAlarms.length === 0) {
            return null;
        }
        
        let orderedAlarms = [];
        
        // 오래된 순 정렬
        if (this.state.sortOrder === Event.SortOrder.oldest){
            orderedAlarms = [ ...sensorAlarms ].reverse();
        }
        else if (this.state.sortOrder === Event.SortOrder.latest) {
            orderedAlarms = [ ...sensorAlarms];
        }
        
        let elements = [];
        
        const alarmCount = orderedAlarms?.length;
        let orderedCount = alarmCount;
        
        let eventListType = this.state.eventListType;
        
        for (let i = 0; i < alarmCount; i++) {
            const alarm = orderedAlarms[i];
            if (eventListType === Event.EventListType.unResponsive) {
                if (alarm?.isAlarm === false) {
                    orderedCount--;
                    continue;
                }
            }
            
            if (eventListType === Event.EventListType.response) {
                if (alarm?.isAlarm === true) {
                    orderedCount--;
                    continue;
                }
            }
            
            let strAlarmMaterialTypes = '';
            
            strAlarmMaterialTypes = this.getMaterialStringFromSensorZoneIDs(alarm);

            let alarmDepthString = this.getAlarmDepthString(alarm.alarmDepth, alarm);
            let alarmPositionString = alarm.positionName;
            let alarmSOPStatusString = '미대응';

            if (alarm.sopStatus === 1) {
                alarmSOPStatusString = '대응중';
            } else if (alarm.sopStatus === 2) {
                alarmSOPStatusString = '대응완료';
            }
            let isClosed = '';
            isClosed = alarm?.isAlarm === false ? ' closed' : '';

            const selectedAlarm = this.props.selectedAlarm;

            let onEvent = '';
            if (selectedAlarm && selectedAlarm.sensorZoneHistoryID === alarm.sensorZoneHistoryID) {
                onEvent = 'onEvent';
            }

            let element = (
                <div id={onEvent} className={'eventItem' + isClosed} key={alarm.sensorZoneHistoryID}>
                    <header onClick={(e) => this.handleEventItem(e, alarm)}>
                        <p>{alarmDepthString}</p>
                        <p>{alarmPositionString}</p>
                    </header>
                    <section onClick={(e) => this.handleEventItem(e, alarm)}>
                        <p>발생유형 : {strAlarmMaterialTypes}</p>
                        <p>발생일시 : {alarm.strDateTime}</p>
                        <p>SOP 상태 : {alarmSOPStatusString}</p>
                    </section>
                    <footer>
                        <div>
                            <button onClick={() => this.showMemo()}>메모</button>
                            <button onClick={() => this.onClickRunSOP()}>SOP 실행</button>
                            <button onClick={() => this.onClickMalfunction(alarm)}>알람 종료</button>
                        </div>
                    </footer>
                </div>
            )

            elements.push(element);
        }

        return (
            <div className='eventWrap scrollbar'>
                {elements}
            </div>
        );
    }

    getMaterialStringFromSensorZoneIDs = (alarm) => {
        let str = '';
        const sensorList = this.props.sensorList;
        
        if (alarm === null || alarm === undefined ||
            sensorList === null || sensorList === undefined)
        {
            return str;
        }
        
        const sensorZoneIDs = alarm?.alarmSensorZoneIDs;
        const sensorZoneCount = sensorZoneIDs.length;
        
        if (sensorZoneCount < 2) return alarm.materialTypeString;
        else 
        {
            for (let i = 0; i < sensorZoneCount; i++) {
                const sensorZoneID = sensorZoneIDs[i];
                
                for (const key in sensorList) {
                    const list = sensorList[key];
                    for (let j = 0; j < list.length; j++) {
                        const sensors = list[j].sensors;
                        for (let k = 0; k < sensors.length; k++) {
                            const sensor = sensors[k];
                            if (sensor.id === sensorZoneID) {
                                if (i === sensorZoneCount - 1) {
                                    str += sensor.sensorTypeName;
                                    return str;
                                }
                                str += sensor.sensorTypeName + ', ';
                            }
                        }
                    }
                }
            }
        }
        
        return str;
    }
    
    showMemo = () => {
        this.props.setVisiblePopups(SDMS.menu.eventMemo);
    }
    
    onChangeStatusRadio = (e, type) => {
        if (!e.target.checked) 
            return;
        
        // type: all: 1, unResponsive: 2, response: 3
        if (type === this.state.eventListType) 
            return;
        
        this.setState({ eventListType: type });
    }
    
    onChangeSortOrder = (e) => {
        if (parseInt(e.target.value) === Event.SortOrder.latest) {
            this.setState({ sortOrder: Event.SortOrder.latest });
        }
        else if (parseInt(e.target.value) === Event.SortOrder.oldest) {
            this.setState({ sortOrder: Event.SortOrder.oldest });
        }
    }

    onClickTurnSound = () => {
        this.props.setAlarmSound();
    }
    
    onClickCloseAllAlarm = () => {
        this.props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, '모든 알람을 종료하시겠습니까?', ['확인', '취소'], this.onAllMalfunction);
    }
    
    onAllMalfunction = (index) => {
        if (index === 0) { // 전체 종료
            this.props.closeAllAlarm(false);
            this.props.onCloseConfirmDialog();
        } else if (index === 1) { // 취소
            this.props.onCloseConfirmDialog();
        }
    }

    render() {
        let opacity = this.state.opacity;

        const alarmUI = this.getAlarmListUI();

        return (
            <EventComponent id={this.props.popupType} className='UI_Section event' $opacity={opacity} $resize={true}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={600}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.event}
                        </h5>
                        <input
                            type="range"
                            className="rangeInput"
                            min={0.1}
                            max={1}
                            color="gray"
                            step={0.1}
                            defaultValue={opacity}
                            onChange={(e) => {this.changePopupOpacity(e.target.valueAsNumber)}}
                        />
                        <button className='dslX' onClick={() => this.props.setVisiblePopups(SdmsResource.ID.menu.event, false)}>닫기</button>
                    </div>
                    <div className={'content'}>
                        <div className='sortWrap'>
                            <ul>
                                <li>
                                    <input type='radio' name='eventStatus' id='all' defaultChecked onChange={(e) => this.onChangeStatusRadio(e, Event.EventListType.all)}/>
                                    <label htmlFor='all'>전체</label>
                                </li>
                                <li>
                                    <input type='radio' name='eventStatus' id='unResponsive' onChange={(e) => this.onChangeStatusRadio(e, Event.EventListType.unResponsive)}/>
                                    <label htmlFor='unResponsive'>미대응</label>
                                </li>
                                <li>
                                    <input type='radio' name='eventStatus' id='response' onChange={(e) => this.onChangeStatusRadio(e, Event.EventListType.response)}/>
                                    <label htmlFor='response'>대응</label>
                                </li>
                            </ul>
                            <select className='short' value={this.state.sortOrder} onChange={(e) => this.onChangeSortOrder(e)}>
                                <option value={Event.SortOrder.latest} >최신순</option>
                                <option value={Event.SortOrder.oldest}>오래된순</option>
                            </select>
                        </div>
                        {alarmUI}
                        <div className='btnWrap'>
                            <button onClick={() => this.props.handlePopups('initialSituationManagement', true)}>초기상황 전파관리</button>
                            <button className={this.props.alarmSound ? 'on' : 'off'} onClick={() => this.onClickTurnSound()}>소리관리</button>
                            <button onClick={() => this.onClickCloseAllAlarm()}>이벤트 종료</button>
                        </div>
                    </div>
                </PopupDraggable>
            </EventComponent>
        );
    }
}

export default withRouter(Event);