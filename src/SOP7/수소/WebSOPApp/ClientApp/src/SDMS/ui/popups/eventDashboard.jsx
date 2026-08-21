import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import SdmsResource from '../../resource/id';
import { SDMSController } from '../../services/sdmsController';

import { EventDashboardComponent, EventFullBoxComponent, SensorInfoBoxBlue, SensorInfoBoxRed} from '../../styled/sdmsPopupsStyled';
import ProjectResource from '../../../Root/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import AccountResource from '../../../Account/resource/id';

class EventDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sensorList: null,
            sensorData: "",
            prevData: "",
        }
    }

    componentDidMount() {
        document.getElementsByClassName('viewDashboardBoxD viewDashboardCurrent')[0].style.opacity = 1;
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
        // 경기도청 
        if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_H) {
            const userInfo = await ProjectResource.initUserInfo();

            if (ProjectResource.siteID === ProjectResource.Site.GG_A && userInfo?.levelID === AccountResource.accountLevelID.master) {
                // 통합방재실 > 모든 공간
                siteIDs = [];
                siteIDs.push(ProjectResource.Site.GG_A);
                siteIDs.push(ProjectResource.Site.GG_B);
                siteIDs.push(ProjectResource.Site.GG_C);
                siteIDs.push(ProjectResource.Site.GG_D);
                siteIDs.push(ProjectResource.Site.GG_E);
                siteIDs.push(ProjectResource.Site.GG_F);
                siteIDs.push(ProjectResource.Site.GG_G);
                siteIDs.push(ProjectResource.Site.GG_H);
            }
            else {
                // 그 외 > 공통으로 사용하는 지하층만 포함
                siteIDs = [];
                //siteIDs.push(ProjectResource.Site.GG_A); // 지하층
                siteIDs.push(userInfo.siteID);
            }
        }

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
        Data = await this.requestSensorList(this.props.selectedAlarm);

        let sensorData = Data + unit;

        if (this.state.prevData !== sensorData) {
            this.setState({ sensorData: sensorData, prevData: sensorData });
        }
    }

    getSensorName() {
        let sensorNames = '';

        const containsSensorLength = this.props.selectedAlarm.alarmSensorZoneIDs.length;
        let matchSensorLength = 0;

        if (SdmsResource.isH2SensorType(this.props.selectedAlarm.facilityType)) {
            const sensorLength = this.props.sensorList.h2Sensors.length;
            for (let i = 0; i < sensorLength; i++) {
                const sensor = this.props.sensorList.h2Sensors[i];
                if (this.props.selectedAlarm.alarmSensorZoneIDs.includes(sensor.sensorZoneID)) {
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

    render() {
        const dt = new Date(this.props.selectedAlarm.dtTime);
        let mm = dt.getMonth() + 1;
        let dd = dt.getDate();
        let ss = dt.getSeconds();
        let hours = dt.getHours();
        let minutes = dt.getMinutes();
        
        const ymd = dt.getFullYear() + '.' + ((mm > 9) ? '' : '0') + mm + '.' + ((dd > 9) ? '' : '0') + dd;
        const hms = ((hours > 9) ? '' : '0') + hours + ':' + ((minutes > 9) ? '' : '0') + minutes + ':' + ((ss > 9) ? '' : '0') + ss;

        // 현재 센서 수치값 및 센서 단위 받아오기
        //this.getSensorData(this.props.selectedAlarm);

        var fontColor = 'yellow'
        if (this.props.selectedAlarm.alarmDepth === 3) {
            fontColor = 'orange';
        }
        else if (this.props.selectedAlarm.alarmDepth === 4) {
            fontColor = 'red';
        }

        const sensorNames = this.getSensorName();
        let message = i18nUtil.convertText(this.props.selectedAlarm.message);
        if (sensorNames.length > 0) {
            // 센서명 끼워넣기
            const index = this.props.selectedAlarm.message.indexOf(']에서');
            if (index >= 0) {
                message = message.slice(0, index + 1) + sensorNames + message.slice(index + 1, message.length)
            }
        }

        return (
            <>
                <EventDashboardComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardCurrent'}>
                    {
                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                        <span className={'eventSideTitle'}>{i18n.t('sdms.eventDashboard.알람발생')}</span>
                    }
                    <div className={'viewTitleTxt'} style={{ color: fontColor }}>
                        {ymd}&nbsp;{hms} {/*[{this.props.selectedAlarm.facilityTypeString}]*/} &nbsp;
                    {/*{this.props.selectedAlarm.positionName} {this.state.sensorData}*/}
                        {message}
                    </div>
                </EventDashboardComponent>
            </>
        );
    }
}

export default withTranslation()(EventDashboard);