import React, { Component } from 'react';

import PopupDraggable from './popupDraggable';
import { EventMemoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import HistoryController from "../../../History/services/historyController";
import ProjectResource from "../../../Root/resource/id";
import SDMS from "../sdms";
import {SDMSController} from "../../services/sdmsController";

class EventMemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            originMemo: ''
        }
    }
    
    componentDidMount() {
        this.getMemo();
    }
    
    getMemo = async () => {
        const alarm = this.props.selectedAlarm;
        let memo = '';
        
        if (alarm === null || alarm === undefined) {
            return memo;
        }
        
        const alarmMemos = await SDMSController.requestGetAlarmMemo();
        
        const sensorZoneHistoryID = alarm.sensorZoneHistoryID;
        
        if (alarmMemos && alarmMemos[sensorZoneHistoryID] !== null && alarmMemos[sensorZoneHistoryID] !== undefined) {
            memo = alarmMemos[sensorZoneHistoryID];
        }
        
        this.setState({ content: memo })
    }

    saveMemo = async () => {
        const memo = this.state.content;
        const alarm = this.props.selectedAlarm;
        
        if (memo !== null && memo === undefined && memo.trim() === '') {
            return;
        }
        
        const result = await HistoryController.UpdateAlarmMemo(alarm.sensorZoneHistoryID, memo);
        
        if (!result) {
            return this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, '메모 저장에 실패하였습니다.', ['확인'], () => this.props.onCloseConfirmDialog());
        }
        this.props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, '메모가 저장되었습니다.', ['확인'], () => this.props.onCloseConfirmDialog());
        this.props.setVisiblePopups(SDMS.menu.eventMemo, false);
    }
    
    getContents = () => {
        const alarm = this.props.selectedAlarm;
        
        if (alarm === null || alarm === undefined) {
            return this.props.setVisiblePopups(SDMS.menu.eventMemo, false);
        }
        
        let title = alarm.positionName + ' - ' + alarm.materialTypeString;
        
        return title;
    }
    
    handleInputChange = (e) => {
        this.setState({
            content: e.target.value
        });
    }

    render() {
        
        const title = this.getContents();
        
        return (
            <EventMemoComponent id={this.props.popupType} className='UI_Section eventMemo' $resize={false}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={300}
                    popupMinHeight={300}
                    topSize={40}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                    usePopupResize={false}
                >
                    <div className='dslTop'>
                        <h5 className='dslTitle'>
                            {SdmsResource.ID.menu.eventMemo + ' - ' + title}
                        </h5>
                        <button className='dslX' onClick={() => this.props.setVisiblePopups(SdmsResource.ID.menu.eventMemo)}>닫기</button>
                    </div>
                    <div className={'content'}>
                        <textarea value={this.state.content} onChange={this.handleInputChange}/>
                        <div className='btnWrap'>
                            <button className='cancle' onClick={() => this.props.setVisiblePopups(SdmsResource.ID.menu.eventMemo)}>취소</button>
                            <button className='submit' onClick={() => this.saveMemo()}>저장</button>
                        </div>
                    </div>
                </PopupDraggable>
            </EventMemoComponent>
        );
    }
}

export default EventMemo;