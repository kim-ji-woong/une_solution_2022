import React, { useEffect, useState } from 'react';
import { BoardRealTimeComponent } from '../../styled/dashboardGG';
import StringUtil from '../../../Common/util/StringUtil';
import SDMSResource from '../../../SDMS/resource/id';
import ProjectResource from '../../../Root/resource/id';

const BoardRealTime = (props) => {
    const [sites, setSites] = useState([]);

    useEffect(() => {
        const arrSites = [];
        const sites = ProjectResource.sites;

        for (let i = 0; i < sites?.length; i++) {
            const item = { value: sites[i].id, name: sites[i].siteName.trim() };
			arrSites.push(item);
        }

        setSites(arrSites);
    }, [])

    const getRealTimeAlarms = () => {
        let ui = [];
        const todayAllAlarms = props.todayAllAlarms;

        if (todayAllAlarms && todayAllAlarms.length > 0) {
            let count = 0;

            for (let i = 0; i < todayAllAlarms.length; i++) {
                const alarm = todayAllAlarms[i];

                if (alarm.isAlarm) {
                    // 발생일시
                    const dt = new Date(alarm.dtTime);
                    let mm = dt.getMonth() + 1;
                    let dd = dt.getDate();
                    let ss = dt.getSeconds();
                    const ymd = dt.getFullYear() + '.' + StringUtil.getDoubleString(mm) + '.' + StringUtil.getDoubleString(dd);
                    const hms = StringUtil.getDoubleString(dt.getHours()) + ':' + StringUtil.getDoubleString(dt.getMinutes()) + ':' + StringUtil.getDoubleString(ss);
    
                    // 유형
                    let typeString = alarm.facilityTypeString;            
                    if (alarm.facilityType === SDMSResource.facilityType.FIRE) {
                        typeString = '화재';
                    } else if (alarm.facilityType === SDMSResource.facilityType.EmergencyBell) {
                        typeString = '비상벨';
                    } else if (alarm.facilityType === SDMSResource.facilityType.PSM_SENSOR) {
                        typeString = '가스누출';
                    } else if (alarm.facilityType === SDMSResource.facilityType.Earthquake) {
                        typeString = '지진';
                    } else if (alarm.facilityType === SDMSResource.facilityType.Terror) {
                        typeString ='테러';
                    } else if (alarm.facilityType === SDMSResource.facilityType.WaterLevel) {
                        typeString ='침수';
                    } else if (alarm.facilityType === SDMSResource.facilityType.BLACKOUT || alarm.facilityType === SDMSResource.facilityType.LowBattery) {
                        typeString ='전력';
                    }
    
                    // 단계
                    let alarmDepth = ''
                    if (alarm.alarmDepth === 1) {
                        alarmDepth = '관심';
                    }
                    else if (alarm.alarmDepth === 2) {
                        alarmDepth = '주의';
                    }
                    else if (alarm.alarmDepth === 3) {
                        alarmDepth = '경계';
                    }
                    else if (alarm.alarmDepth === 4) {
                        alarmDepth = '심각';
                    }
    
                    // 기관
                    const site = sites.find((x) => x.value === alarm.siteID);
    
                    // 알람, SOP 상태
                    let sopStatusText = '대기';
                    let alarmStatusText = '발생';
    
                    if (alarm.sopStatus === 1) {
                        sopStatusText = '실행중';
                    }
                    else if (alarm.sopStatus === 2) {
                        sopStatusText = '종료';
                    }
    
                    if (alarm.isAlarm === false) {
                        alarmStatusText = '종료';
                        sopStatusText = '종료';
                    }
    
                    ui.push(
                        <li className='body' key={alarm.sensorZoneHistoryID}>
                            <span>{ymd}<br />{hms}</span>
                            <span>{typeString}</span>
                            <span>{alarmDepth}</span>
                            <span>{site.name}</span>
                            <span>{alarm.buildingName}</span>
                            <span>{alarmStatusText}</span>
                            <span>{sopStatusText}</span>
                        </li>
                    );

                    count++;
                    if (count === 4) break;
                }
            }
        }
        else {
            return null;
        }

        return ui;
    }

    const onClickMoveSDMS = () => {
        let url = window.location.origin + ProjectResource.path.sdms;
        window.open(url, "_blank");
    }

    const getActiveAlarmCount = () => {
        const todayAllAlarms = props.todayAllAlarms;
        return todayAllAlarms.reduce((count, alarm) => alarm.isAlarm ? count + 1 : count, 0);
    }

    return (
        <BoardRealTimeComponent className='real-time-area'>
            <h2>실시간 이벤트 현황</h2>
                {
                    (props.todayAllAlarms && getActiveAlarmCount() > 4) &&
                    <div className='btnWrap'>
                        <p>* 최신 이벤트 최대 4개까지 표출됩니다.</p>
                        <button onClick={() => onClickMoveSDMS()}>더보기</button>
                    </div>
                }
            <div className='tableWrap'>
                <ul>
                    <li className='head'>
                        <span>발생일시</span>
                        <span>유형</span>
                        <span>단계</span>
                        <span>기관</span>
                        <span>위치</span>
                        <span>알람</span>
                        <span>SOP</span>
                    </li>
                    <li className='bodyWrap'>
                        <ul>
                            {getRealTimeAlarms()}
                        </ul>
                    </li>
                </ul>
            </div>
        </BoardRealTimeComponent>
    );
};

export default BoardRealTime;