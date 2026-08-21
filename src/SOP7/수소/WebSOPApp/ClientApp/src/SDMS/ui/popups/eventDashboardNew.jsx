import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import SdmsResource from '../../resource/id';
import { SDMSController } from '../../services/sdmsController';
import SDMS from '../sdms';

import { EventDashboardNewComponent, EventFullBoxComponent, SensorInfoBoxBlue, SensorInfoBoxRed} from '../../styled/sdmsPopupsStyled';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import AccountResource from '../../../Account/resource/id';

import SettingsStore from '../../../Settings/settingsStore';

class EventDashboard extends Component {
    static MoveDisplayAlarm = {
        current: "0",
        move: "3"
    }

    constructor(props) {
        super(props);

        this.state = {
            sensorList: null,
            sensorData: "",
            prevData: "",
            count: 5,

            moveDisplayAlarm: EventDashboard.MoveDisplayAlarm.move
        }

        this.timer = null;

        this.initSettings();
    }

    componentDidMount() {
        document.getElementsByClassName('viewDashboardBoxD viewDashboardCurrent')[0].style.opacity = 1;

        // 타이머 카운트 5초 잡은 뒤, 카운트 종료 시 팝업 종료 및 옵션에 따라 화면 이동
        this.timer = setTimeout(() => this.timerCount(this), 1000);
    }

    componentWillUnmount() {
        // 타이머 카운트 종료
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    initSettings = () => {
        const data = SettingsStore.getState();
        const moveDisplayAlarm = data?.sdmsCommonSettings?.MoveDisplayAlarm;

        if (moveDisplayAlarm !== null && moveDisplayAlarm !== undefined) {
            this.state.moveDisplayAlarm = moveDisplayAlarm;
        }
    }

    timerCount = (target) => {
        if (target !== null && target !== undefined) {
            let count = target.state.count;

            if (count < 2) {
                // 옵션에 따라 화면 이동
                const moveDisplayAlarm = this.state.moveDisplayAlarm;
                
                if (moveDisplayAlarm === EventDashboard.MoveDisplayAlarm.move) {
                    // 해당 알람 선택
                    this.props.onSelectedAlarm(target.props.toastAlarm);

                    // 이벤트 모드로 전환
                    if (target.props.visiblePopups[SDMS.menu.eventInfoNew] === false) {
                        //target.props.setVisiblePopups(SDMS.menu.eventInfoNew);
                        target.props.setModePopup(SDMS.menu.eventInfoNew);
                    }
                }                
                                  
                target.props.setVisiblePopups(SDMS.menu.eventDashboardNew, false);
            }
            else {
                count--;
                target.setState({ count });

                target.timer = setTimeout(() => target.timerCount(target), 1000);
            }            
        }
    }

    async requestFacilityTypeUnit(facilityTypeID) {
        const [result, message] = await SDMSController.getFacilityType(facilityTypeID);
        let retUnit = "";

        if (result === null) {
            console.log(message);
        }
        else {
            if (message.id !== 0) {
                if (message.uom !== null && message.uom !== undefined) {
                    retUnit = message.uom;
                }
            } 
        }

        return retUnit;
    }

    async requestSensorList(selectedAlarm) {
        let sensorData = "";

        let siteIDs = null;

        const [result, message] = await SDMSController.requestSensorList(siteIDs);

        if (result === null) {
            console.log(message);
        }
        else {
            
            if (selectedAlarm.facilityType !== 1) {

                let sensorList = "";

                if (selectedAlarm.facilityType == 215 ||
                    selectedAlarm.facilityType == 216 ||
                    selectedAlarm.facilityType == 222) {
                    sensorList = result.psmSensors;
                } else {
                    sensorList = result.etcSensors;
                }

                for (let i = 0; i < sensorList.length; i++) {
                    let sensor = sensorList[i];

                    if (selectedAlarm.orgSensorID == sensor.id) {
                        sensorData = sensor.currentData;
                        break;
                    }
                }
            }
        }

        return sensorData;
    }

    async getSensorData(selectedAlarm) {
        if (selectedAlarm === null || selectedAlarm === undefined)
            return;

        let unit = "";
        let Data = "";

        // 센서 단위 받아오기
        unit = await this.requestFacilityTypeUnit(selectedAlarm.facilityType);
        // 센서 현재값 갱신
        Data = await this.requestSensorList(this.props.toastAlarm);

        let sensorData = Data + unit;

        if (this.state.prevData !== sensorData) {
            this.setState({ sensorData: sensorData, prevData: sensorData });
        }
    }

    getSensorName() {
        let sensorNames = '';

        const containsSensorLength = this.props.toastAlarm.alarmSensorZoneIDs.length;
        let matchSensorLength = 0;

        if (SdmsResource.isH2SensorType(this.props.toastAlarm.facilityType)) {
            const sensorLength = this.props.sensorList.h2Sensors.length;
            for (let i = 0; i < sensorLength; i++) {
                const sensor = this.props.sensorList.h2Sensors[i];
                if (this.props.toastAlarm.alarmSensorZoneIDs.includes(sensor.sensorZoneID)) {
                    if (sensorNames.length > 0) {
                        sensorNames += ', ' + sensor.name;
                    }
                    else {
                        sensorNames = sensor.name;
                    }

                    matchSensorLength++;
                }

                if (containsSensorLength === matchSensorLength) {
                    sensorNames = '(' + sensorNames + ')';
                    break;
                }
            }
        }

        return sensorNames;
    }

    onClickClose = () => {       
        // 옵션에 따라 화면 이동
        const moveDisplayAlarm = this.state.moveDisplayAlarm;

        if (moveDisplayAlarm === EventDashboard.MoveDisplayAlarm.move) {
            // 해당 알람 선택
            this.props.onSelectedAlarm(this.props.toastAlarm);

            // 이벤트 모드로 전환
            if (this.props.visiblePopups[SDMS.menu.eventInfoNew] === false) {
                this.props.setModePopup(SDMS.menu.eventInfoNew);
            }
        }

        this.props.setVisiblePopups(SDMS.menu.eventDashboardNew, false);
    }

    render() {
        let ymd = "";
        let hms = "";
        let message = "-";

        const dt = new Date(this.props?.toastAlarm?.dtTime);
        if (dt) {
            let mm = dt.getMonth() + 1;
            let dd = dt.getDate();
            let ss = dt.getSeconds();
            let hours = dt.getHours();
            let minutes = dt.getMinutes();

            ymd = dt.getFullYear() + '.' + ((mm > 9) ? '' : '0') + mm + '.' + ((dd > 9) ? '' : '0') + dd;
            hms = ((hours > 9) ? '' : '0') + hours + ':' + ((minutes > 9) ? '' : '0') + minutes + ':' + ((ss > 9) ? '' : '0') + ss;
        }

        if (this.props.toastAlarm?.message) {
            //message = i18nUtil.convertText(this.props.toastAlarm.message);
            message = i18nUtil.convertText(this.props.toastAlarm.positionName);
        }

        let alarmMessage = null;
        let moveMessage = null;

        const moveDisplayAlarm = this.state.moveDisplayAlarm;

        // 옵션 확인
        console.log("moveDisplayAlarm: " + moveDisplayAlarm);

        if (moveDisplayAlarm === EventDashboard.MoveDisplayAlarm.move) {
            if (i18n.language === "ko") {
                alarmMessage = (<span><p>[{message}]</p>{i18n.t('sdms.eventDashboard.에서 이벤트가 탐지되었습니다')}</span>);
                moveMessage = (<span>{this.state.count}{i18n.t('sdms.eventDashboard.초 뒤 자동으로 화면이 이동합니다')}</span>);
            }
            else {
                alarmMessage = (<span>{i18n.t('sdms.eventDashboard.에서 이벤트가 탐지되었습니다')}&nbsp;<p>[{message}]</p></span>);
                moveMessage = (<span>{i18n.t('sdms.eventDashboard.초 뒤 자동으로 화면이 이동합니다')}{this.state.count}{i18n.t('sdms.eventDashboard.초')}</span>);
            }
        }
        else {

            if (i18n.language === "ko") {
                alarmMessage = (<span><p>[{message}]</p>{i18n.t('sdms.eventDashboard.에서 이벤트가 탐지되었습니다')}</span>);
                moveMessage = (<span>{this.state.count}{i18n.t('sdms.eventDashboard.초 뒤 자동으로 알림창이 닫힙니다')}</span>);
            }
            else {
                alarmMessage = (<span>{i18n.t('sdms.eventDashboard.에서 이벤트가 탐지되었습니다')}&nbsp;<p>[{message}]</p></span>);
                moveMessage = (<span>{i18n.t('sdms.eventDashboard.초 뒤 자동으로 알림창이 닫힙니다')}{this.state.count}{i18n.t('sdms.eventDashboard.초')}</span>);
            }
        }        

        return (
            <>
                <EventDashboardNewComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardCurrent'}>
                    <span className={'eventSideTitle'}></span>
                    <div className={'viewTitleTxt'} /* style={{ color: fontColor }} */>
                        <span>{ymd}&nbsp;{hms}</span>
                        {alarmMessage}
                        {moveMessage}
                    </div>
                    <span className={'eventClose'} onClick={() => this.onClickClose()}></span>
                </EventDashboardNewComponent>
            </>
        );
    }
}

export default withTranslation()(EventDashboard);