import React, { Component } from 'react';

import { NavigationBarComponent } from '../../styled/sdmsPopupsStyled';
import SDMS from '../sdms';
import SdmsResource from '../../resource/id';
import nav_home from '../../images/nav_home.svg';
import nav_back from '../../images/nav_back.svg';

class NavigationBar extends Component {
    
    constructor(props) {
        super(props);
        
        this.props = props;
        
        this.state = {
            
        }
    }
    
    getQuickButtonClassName(name) {
        // 이벤트 현황 className은 알람 상황에 따라 따로 처리한다.
        if (name === SDMS.menu.event) {
            return this.getEventIconClassName();
        }
        
        if (this.props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }
    
    getEventIconClassName = () => {
        // 발생한 알람이 한개도 없을 때 - 화면설계서 번호 1 참조
        if (!this.props.sensorAlarms || this.props.sensorAlarms.length === 0)
            return 'disable';

        const alarmCount = this.props.sensorAlarms.length;

        // 오늘 발생한 알람이 한개도 없을 때 - 화면설계서 번호 1 참조
        let noAlarmToday = true;
        for (let i = 0; i < alarmCount; i++) {
            const alarm = this.props.sensorAlarms[i];
            if (this.isToday(alarm.dtTime)) {
                noAlarmToday = false;
                break;
            }
        }
        if (noAlarmToday)
            return 'disable'; // 1)

        // 1-1, 1-2 - 화면설계서 번호 참조
        if (!this.props.visiblePopups[SDMS.menu.event]) { // 이벤트 현황 팝업이 닫혀있을 때

            // 1-1 현재 알람이 없는 경우 - 오늘 일자 알람은 있지만 현재 미대응 알람이 없는경우
            // 1-2 현재 알람이 있는 경우 - 오늘 일자 알람이 있고 현재 미대응 알람이 있는경우

            let isTodayAlarm = false;

            for (let i = 0; i < alarmCount; i++) {
                const alarm = this.props.sensorAlarms[i];
                const isToday = this.isToday(alarm.dtTime);

                if (isToday) {
                    if (alarm.isAlarm) {
                        isTodayAlarm = true;
                        break;
                    }
                }
            }

            if (!isTodayAlarm)
                return 'off_none'; // 1-1

            return 'off_alarm'; // 1-2
        }
        // 2, 2-1 - 화면설계서 번호 참조
        else { // 이벤트 현황 팝업이 열려있을 때

            let isTodayAlarm = false;

            // 2-1 현재 알람이 없는 경우 - 오늘 일자 알람은 있지만 현재 미대응 알람이 없는경우
            for (let i = 0; i < alarmCount; i++) {
                const alarm = this.props.sensorAlarms[i];
                const isToday = this.isToday(alarm.dtTime);

                if (isToday) {
                    if (alarm.isAlarm) {
                        isTodayAlarm = true;
                        break;
                    }
                }
            }

            if (!isTodayAlarm)
                return 'on_none'; // 2-1

            return 'on_alarm'; // 2
        }
    }

    isToday = (dtTime) => {

        if (dtTime === null || dtTime === undefined)
            return false;
            
        const date = new Date(dtTime);
        const today = new Date();

        return (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate());

    }
    
    onClickHome = () => {
        
    }
    
    onClickEventIcon = () => {
        const sensorAlarms = this.props.sensorAlarms;
        
        const element = document.getElementById("dsBot_" + SdmsResource.popupLayer.event);
        
        if (element && element.classList.contains('disable'))
            return this.props.setVisiblePopups(SDMS.menu.event, false);
        
        if (!sensorAlarms || sensorAlarms.length === 0)
            return this.props.setVisiblePopups(SDMS.menu.event, false);
        
        return this.props.setVisiblePopups(SDMS.menu.event);
    }

    render() {
        return (
            <NavigationBarComponent className={"UI_Section"}>
            <ul>
                <li>
                    <ul className='navList'>
                        <li data-title="센서현황">
                            <button id={"dsBot_" + SdmsResource.popupLayer.statusInfo} className={this.getQuickButtonClassName(SDMS.menu.statusInfo) + " " + 'statusInfoIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.statusInfo)}/>
                        </li>
                        <li data-title="이벤트현황">
                            <button id={"dsBot_" + SdmsResource.popupLayer.event} className={this.getQuickButtonClassName(SDMS.menu.event) + " " + 'eventIcon'} onClick={() => this.onClickEventIcon()}/>
                        </li>
                    </ul>
                </li>
                <li className='navHomeBtn' data-title="초기화면">
                    <button><img src={true ? nav_home : nav_back}></img></button>
                </li>
                <li>
                    <ul className='navList'> 
                        <li data-title="미니맵">
                            <button id={"dsBot_" + SdmsResource.popupLayer.miniMap} className={this.getQuickButtonClassName(SDMS.menu.miniMap) + " " + 'miniMapIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap)}/>
                        </li>
                        <li data-title="확산시뮬레이션">
                            <button id={"dsBot_" + SdmsResource.popupLayer.simulation} className={this.getQuickButtonClassName(SDMS.menu.simulation) + " " + 'simulationIcon'} onClick={() => this.props.setVisiblePopups(SDMS.menu.simulation)}/>
                        </li>
                    </ul>
                </li>
            </ul>
            </NavigationBarComponent>
        );
    }
}

export default NavigationBar;