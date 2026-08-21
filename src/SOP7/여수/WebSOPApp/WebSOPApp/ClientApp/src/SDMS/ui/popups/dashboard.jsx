import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import uis from '../../../Common/css/ui.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import imgClose from '../../../Common/image/icon/close_x.png';
import detailDashboard from '../../../Common/image/icon/detail_Dashboard.png';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';

import { DashboardController } from '../../../Dashboard/services/dashboardController';
import store from '../../../Root/store';
import RootResource from '../../../Root/resource/id';
import SDMSResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import { MainEventInfoComponent } from './../../sdmsStyled';
//import PopupDraggable from './popupDraggable';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //dashboardDetail: false,     // 대시보드 상세보기 팝업 오픈 여부
            useSensorList: null,        // 현재 센서 목록
            sensorAlarms: store.getState().sensorAllAlarm,     // 현재 알람

            testParam: this.props.testParam,
        }

        this.props = props;

        store.subscribe(function () {
            let data = store.getState();

            if ((data.sensorAllAlarm !== null && data.sensorAllAlarm !== undefined)
                && data.actionType === 'SENSOR_ALARM') {
                this.changeAlarm(data.sensorAllAlarm);
            }
        }.bind(this));

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {

        this.initCount();
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex
            console.log('dashboardZIndex changed', this.state.popup.style.zIndex)
        }

        if (this.props.testParam !== prevProps.testParam) {
            this.setState({ testParam: this.props.testParam });
        }
    }

    async initCount() {
        const [result, message] = await DashboardController.requestUseSensor(this.state.buildingGroup, this.state.building, this.state.zone);

        if (result !== null && result !== undefined) {
            this.setState({ useSensorList: result });
        }
    }

    changeAlarm(sensorAlarms) {
        this.setState({ sensorAlarms: sensorAlarms });
    }

    /* getSensorCountElements() {
        let fireSensorCount = this.props.sensorCount?.fireSensorCount ? this.props.sensorCount?.fireSensorCount : 0;
        let disabledFireSensorCount = this.props.sensorCount?.disabledFireSensorCount ? this.props.sensorCount?.disabledFireSensorCount : 0;
        let psmSensorCount = this.props.sensorCount?.psmSensorCount ? this.props.sensorCount?.psmSensorCount : 0;
        let disabledPsmSensorCount = this.props.sensorCount?.disabledPsmSensorCount ? this.props.sensorCount?.disabledPsmSensorCount : 0;
        let etcSensorCount = this.props.sensorCount?.etcSensorCount ? this.props.sensorCount?.etcSensorCount : 0;
        let disabledEtcSensorCount = this.props.sensorCount?.disabledEtcSensorCount ? this.props.sensorCount?.disabledEtcSensorCount : 0;
        let cctvCount = this.props.sensorCount?.cctvCount ? this.props.sensorCount?.cctvCount : 0;
        let disabledCCTVCount = this.props.sensorCount?.disabledCCTVCount ? this.props.sensorCount?.disabledCCTVCount : 0;


        let soulbrainUI = null;
        let gccUI = null;

        if (ProjectResource.isGSMode !== true) {
            soulbrainUI = (<React.Fragment>
                <div>누출센서 ( <span className={content.greenTxt}>●</span>{psmSensorCount - disabledPsmSensorCount} / <span className={content.gray_txt}>●</span>{psmSensorCount} ) </div>
                <div>ETC센서 ( <span className={content.greenTxt}>●</span>{etcSensorCount - disabledEtcSensorCount} / <span className={content.gray_txt}>●</span>{etcSensorCount} ) </div>
            </React.Fragment>);

            gccUI = (<React.Fragment>
                <div>누출센서 ( <span className={content.greenTxt}>●</span>{psmSensorCount - disabledPsmSensorCount} / <span className={content.gray_txt}>●</span>{psmSensorCount} ) </div>
            </React.Fragment>);
        }

        if (this.props.sensorCount) {
            if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
                return (
                    <div className={uis.clfix + ' ' + content.sectionblank}>
                        <div>화재센서 ( <span className={content.greenTxt}>●</span>{fireSensorCount - disabledFireSensorCount} / <span className={content.gray_txt}>●</span>{fireSensorCount} ) </div>
                        {soulbrainUI}
                        <div>CCTV ( <span className={content.greenTxt}>●</span>{cctvCount - disabledCCTVCount} / <span className={content.gray_txt}>●</span>{cctvCount} ) </div>
                    </div>
                );
            }
            else if (ProjectResource.siteID === ProjectResource.Site.GCC) {
                return (
                    <div className={uis.clfix + ' ' + content.sectionblank}>
                        <div>화재센서 ( <span className={content.greenTxt}>●</span>{fireSensorCount - disabledFireSensorCount} / <span className={content.gray_txt}>●</span>{fireSensorCount} ) </div>
                        {gccUI}
                        <div>CCTV ( <span className={content.greenTxt}>●</span>{cctvCount - disabledCCTVCount} / <span className={content.gray_txt}>●</span>{cctvCount} ) </div>
                    </div>
                );
            }
        }

        return (
            <div className={uis.clfix + ' ' + content.sectionblank}>
            </div>
        );
    } */

    repositionPopup(popupState) {
        let data = popupState.dashboard;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + " " + content.viewDashboardSection)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        //popup.style.marginLeft = '0px';

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    onClickDetail = () => {
        //this.setState({ dashboardDetail: true });
        let url = window.location.origin + RootResource.path.dashboard;
        window.open(url, "_blank");
    }

    //onClickBtnClose = () => {
    //    this.setState({ dashboardDetail: false });
    //}

    getAlarmState = () => {
        const selectAlarms = this.state.sensorAlarms;
        const selectSensors = this.state.useSensorList;

        if (selectAlarms === null || selectAlarms === undefined)
            return ["0", "0", "0", "0", "0"];

        let fireCount = 0;
        let psmCount = 0;
        let etcCount = 0;
        let safetyCount = 0;
        let svmsCount = 0;

        let safetyCCTVs = [];

        // .TODO: safety 카운팅
        if (selectSensors !== null && selectSensors !== undefined) {
            const cctvs = selectSensors.cctvs;

            for (let i = 0; i < cctvs.length; i++) {
                const cctv = cctvs[i];

                if (cctv.type === "SAFETY-I")
                    safetyCCTVs.push(cctv);
            }
        }

        for (let i = 0; i < selectAlarms.length; i++) {
            let alarm = selectAlarms[i];
            let facilityType = alarm.facilityType;

            if (facilityType === SDMSResource.facilityType.FIRE) {
                fireCount++;
            } else if (SDMSResource.isSVMSSensorType(facilityType)) {
                svmsCount++;

                for (let i = 0; i < selectAlarms.length; i++) {
                    let alarm = selectAlarms[i];

                    if (SDMSResource.isSVMSSensorType(alarm.facilityType)) {

                        for (let j = 0; j < safetyCCTVs.length; j++) {
                            const cctv = safetyCCTVs[j];

                            if (cctv.id === alarm.orgSensorID) {
                                safetyCount++;
                                break;
                            }
                        }
                    }
                }

            } else if (SDMSResource.isPSMSensorType(facilityType)) {
                psmCount++;

                // .TODO: safety 카운팅
            } else if (SDMSResource.isETCSensorType(facilityType)) {
                etcCount++;

                // .TODO: safety 카운팅
            }
             
        }

        return [fireCount.toString(), svmsCount.toString(), psmCount.toString(), etcCount.toString(), safetyCount.toString()];
    }

    /* displayAlarmCountUI = () => {
        const [fireCount, svmsCount, psmCount, etcCount, safetyCount] = this.getAlarmState();

        let soulbrainUI = null;
        let gccUI = null;

        if (ProjectResource.isGSMode !== true) {
            soulbrainUI = (<React.Fragment>
                <li><div className={content.whiteTxt}>누출({psmCount}건) </div></li>
                <li><div className={content.whiteTxt}>ETC({etcCount}건) </div></li>
                <li><div className={content.whiteTxt}>세이프티 아이({safetyCount}건) </div></li>
                <li><div className={content.whiteTxt}>CCTV({svmsCount}건) </div></li>
            </React.Fragment>);

            gccUI = (<React.Fragment>
                <li><div className={content.whiteTxt}>누출({psmCount}건) </div></li>
                <li><div className={content.whiteTxt}>CCTV({svmsCount}건) </div></li>
            </React.Fragment>);
        }


        if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
            return (
                <React.Fragment>
                    <li><div className={content.whiteTxt}>화재({fireCount}건) </div></li>
                    {soulbrainUI}
                </React.Fragment>
            );
        } else if (ProjectResource.siteID === ProjectResource.Site.GCC) {
            return (
                <React.Fragment>
                    <li><div className={content.whiteTxt}>화재({fireCount}건) </div></li>
                    {gccUI}
                </React.Fragment>
            );
        }

        return (
            <>
                
            </>
        );
    } */

    getAlarmType(alarm) {
        if (!alarm) {
            return "정상";
        }

        if (this.props.testParam)
            return "대기오염";

        const [sensorGroupData, sensor] = this.props.getAlarmSensor(alarm);

        if (!sensorGroupData) {
            return "";
        }

        return sensorGroupData.alarmType;
    }

    getAlarmMessage() {
        if (!this.props.alarms) {
            return ["", null];
        }

        const alarms = [...this.props.alarms];
        let alarm = null;

        for (const _alarm of alarms) {
            if (_alarm.isAlarm === false) {
                continue;
            }

            if (!alarm || alarm.dtTime < _alarm.dtTime) {
                alarm = _alarm;
            }
        }

        if (!alarm) {
            return ["", alarm];
        }

        let message = "[" + alarm.strDateTime + "] " + alarm.message;

        if (this.state.testParam) {
            message = "[" + this.getDate();
            message += "] 테스트 여수산단2로에서 대기센서 신호가 감지되었습니다."
        }

        return [message, alarm];
    }

    getDate() {
        let today = new Date();

        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let day = ('0' + today.getDate()).slice(-2);

        let dateString = year + '.' + month + '.' + day + ' ';

        let hour = ('0' + today.getHours()).slice(-2);
        let minute = ('0' + today.getMinutes()).slice(-2);
        let seconds = ('0' + today.getSeconds()).slice(-2);

        let timeString = hour + ':' + minute + ':' + seconds;

        let date = dateString + timeString;

        return date;
    }

    getTextColor = (isAlarmed) => {

        let element = {};

        if (isAlarmed) {
            element = {
                background: 'linear - gradient(to bottom, #de4833,#851f11)'
            };
        }

        return element;
    }
    
    render() {
        const [message, alarm] = this.getAlarmMessage();
        let isAlarmed = true;

        let resultMessage = null;

        const today = this.getDate();

        const whiteSpace = <span style={{ display: 'inline-block', width: '500px', textAlign: 'center' }}>...</span>

        if (!message) {
            resultMessage = "[" + today + "]";
            isAlarmed = false;
        }

        //let isAlarmText = this.getTextColor(isAlarmed);

        return (
            <MainEventInfoComponent id={this.props.popupType} className={content.dashboardPopup + " " + SDMSResource.UISection}>
                {/* <PopupDraggable*/}
                {/*    id={this.props.popupType}*/}
                {/*    popupMinWidth={1367}*/}
                {/*    popupMinHeight={40}*/}
                {/*    topSize={35}*/}
                {/*    popupState={this.props.popupState}*/}
                {/*    setActiveDragPopup={this.props.setActiveDragPopup}*/}
                {/*    setPopupState={this.props.setPopupState}*/}
                {/*> */}

                <div className={'sensorDashBox'}>
                    <span className={'sensorDashTitle'}>Message</span>
                    {
                        !isAlarmed ?
                            <span className={'sensorSensing'} style={{ background: `linear-gradient(to bottom, #19A5FF, #0D5380)` }}>{this.getAlarmType(alarm)}</span> :
                            <span className={'sensorSensing'} style={{ background: `linear-gradient(to bottom, #de4833, #851f11)` }}>{this.getAlarmType(alarm)}</span>
                    }

                    {isAlarmed &&
                        <div className={'sensorEventConts'}>
                            <div className={'eventTitle'}>
                                <div className={'eventTrack'}>
                                    <span className={'eventContents'}>
                                        {
                                            message
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                    {!isAlarmed &&
                        <div className={'sensorEventConts'}>

                        <div className={'eventTitle'}>
                            <div className={'eventTrack'}>
                                <span className={'eventContents'}>{resultMessage}{whiteSpace}{resultMessage}{whiteSpace}{resultMessage}{whiteSpace}</span>
                            </div>
                        </div>

                        {/* <div className={content.animatedTitle}>
                           <div className={content.track}>
                              <div className={content.content}>{resultMessage}{whiteSpace}{resultMessage}{whiteSpace}{resultMessage}{whiteSpace}</div>
                           </div>
                        </div> */}

                        </div>
                    }
                </div>
                {/*</PopupDraggable>*/}
            </MainEventInfoComponent>
        );
    }
}

export default Dashboard;

