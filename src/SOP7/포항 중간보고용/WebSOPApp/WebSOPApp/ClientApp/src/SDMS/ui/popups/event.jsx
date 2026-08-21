import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { EventComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import SDMS from "../sdms";

class Event extends Component {
    
    static EventListType = {
        all: 1,
        unResponsive: 2,
        response: 3,
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
        }
    }
    
    changePopupOpacity = (value) => {
        this.setState({ opacity: value });
    }

    handleEventItem = (e, alarm) => {
        const element = document.getElementById('onEvent');

        if(element && element !== e.currentTarget.parentNode) element.id = '';

        if(e.currentTarget.parentNode.id === 'onEvent') e.currentTarget.parentNode.id = '';
        else e.currentTarget.parentNode.id = 'onEvent';
        
        this.props.setSelectedAlarm(alarm);
    }
    
    getAlarmDepthString = (level) => {
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

            let alarmDepthString = this.getAlarmDepthString(alarm.alarmDepth);
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
                            <button>SOP 실행</button>
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
                        <button className='dslX'>닫기</button>
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
                            <button>이벤트 종료</button>
                        </div>
                    </div>
                </PopupDraggable>
            </EventComponent>
        );
    }
}

export default Event;