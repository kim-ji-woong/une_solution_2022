import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SensorDetailInfoComponent } from '../../styled/dashboardStyled';
import SdmsResource from '../../../SDMS/resource/id';

class SensorDetailInfo extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
        }

		this.props = props;
	}

    componentDidUpdate(prevProps) {
        const mainInfoWrap = document.getElementsByClassName("mainInfoWrap on");
        const detailInfoWrap = document.getElementsByClassName("detailInfoWrap on");

        if(mainInfoWrap.length === 0 || detailInfoWrap.length === 0) {
            return;
        }

        if(this.props.selectedSensorName !== prevProps.selectedSensorName) {
            for(let mainInfo of mainInfoWrap) {
                mainInfo.classList.remove("on");
            }
    
            for(let detailInfo of detailInfoWrap) {
                detailInfo.classList.remove("on");
            }
        }
    }

    onDetailInfo = (e) => {
        const target = e.currentTarget;
        const childTarget = e.currentTarget.nextSibling;
        
        const mainInfoWrap = document.getElementsByClassName("mainInfoWrap on");
        const detailInfoWrap = document.getElementsByClassName("detailInfoWrap on");

        for(let mainInfo of mainInfoWrap) {
            if(target !== mainInfo) {
                mainInfo.classList.remove("on");
            }
        }

        for(let detailInfo of detailInfoWrap) {
            if(childTarget !== detailInfo) {
                detailInfo.classList.remove("on");
            }
        }

        target.classList.toggle('on');
        childTarget.classList.toggle('on');
    }

    getAlarmDetail() {
        const alarmList = this.props.selectedAlarm;
        const sensorName = this.props.selectedSensorName;
        let table = [];
        let tableIndex = 1;

        if(alarmList) {
            alarmList.map((alarm) => {

                let sopStatusText = '대기';
                if (alarm.sopStatus === 1) {
                    sopStatusText = '실행중';
                }
                else if (alarm.sopStatus === 2) {
                    sopStatusText = '완료';
                }

                const eventTime = new Date(alarm.eventTime);
                const [eventTimeYmd, eventTimeHms] = SdmsResource.getDate(eventTime);

                let [closeTimeYmd, closeTimeHms] = '';

                if(alarm.closeTime) {
                    const closeTime = new Date(alarm.closeTime);
                    [closeTimeYmd, closeTimeHms] = SdmsResource.getDate(closeTime);
                } else {
                    closeTimeYmd = '-';
                    closeTimeHms = '';
                }

                table.push(
                    <li key={'alarmDetail_' + tableIndex}>
                        <div className='mainInfoWrap' id='mainInfo' onClick={(e) => this.onDetailInfo(e)}>
                            <div>
                                <span>{tableIndex}.</span>
                                <span>{eventTimeYmd + ' ' + eventTimeHms}</span>
                            </div>
                            <div>
                                <span>{alarm.positionName.trim()}</span>
                                <span><button>열기</button></span>
                            </div>
                        </div>
                        <ul className='detailInfoWrap' id='detailInfo'>
                            <li>발생일시 : {eventTimeYmd + ' ' + eventTimeHms}</li>
                            <li>발생장소 : {alarm.positionName}</li>
                            <li>센서명 : {alarm.sensorName}</li>
                            <li>SOP 실행 여부 : {sopStatusText}</li>
                            <li>이벤트 종료 시간 : {closeTimeYmd + ' ' + closeTimeHms}</li>
                        </ul>
                    </li>
                );

                tableIndex++;
            });
        }

        return [table, sensorName];
    }

    render() {

        const [table, sensorName] = this.getAlarmDetail();

        return (
            <SensorDetailInfoComponent className="sensorDetailInfo">
                <div className='titleWrap'>
                    <h1>센서 이벤트 알람 상세정보</h1>
                    <p>{sensorName}</p>
                </div>
                <div className='content scrollbar'>
                    <ul>
                        {table}
                    </ul>
                </div>
            </SensorDetailInfoComponent>
        )
    }
}

export default withRouter(SensorDetailInfo);