import { ui } from 'jquery';
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

import PopupDraggable from './popupDraggable';
import $ from 'jquery';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //dashboardDetail: false,     // 대시보드 상세보기 팝업 오픈 여부
            useSensorList: null,        // 현재 센서 목록
            sensorAlarms: store.getState().sensorAllAlarm,     // 현재 알람
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
        // 창이 서서히 나타나는 효과
        //$('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
        //    if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
        //        document.getElementById(this.props.popupType).style.opacity = 1;
        //    }
        //});
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

        this.initCount();
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex
            console.log('dashboardZIndex changed', this.state.popup.style.zIndex)
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

    getSensorCountElements() {
        let fireSensorCount = this.props.sensorCount?.fireSensorCount ? this.props.sensorCount?.fireSensorCount : 0;
        let disabledFireSensorCount = this.props.sensorCount?.disabledFireSensorCount ? this.props.sensorCount?.disabledFireSensorCount : 0;
        let psmSensorCount = this.props.sensorCount?.psmSensorCount ? this.props.sensorCount?.psmSensorCount : 0;
        let disabledPsmSensorCount = this.props.sensorCount?.disabledPsmSensorCount ? this.props.sensorCount?.disabledPsmSensorCount : 0;
        let etcSensorCount = this.props.sensorCount?.etcSensorCount ? this.props.sensorCount?.etcSensorCount : 0;
        let disabledEtcSensorCount = this.props.sensorCount?.disabledEtcSensorCount ? this.props.sensorCount?.disabledEtcSensorCount : 0;
        let cctvCount = this.props.sensorCount?.cctvCount ? this.props.sensorCount?.cctvCount : 0;
        let disabledCCTVCount = this.props.sensorCount?.disabledCCTVCount ? this.props.sensorCount?.disabledCCTVCount : 0;


        // GS인증에 따른 UI
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
    }

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

    displayAlarmCountUI = () => {
        const [fireCount, svmsCount, psmCount, etcCount, safetyCount] = this.getAlarmState();

        // GS인증에 따른 UI
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
    }
    
    render() {
        // GS인증 관련 UI
        let dashboardBtn = null;

        if (ProjectResource.isGSMode !== true) {
            dashboardBtn = <div className={sdmsStyle.detailBtn} onClick={this.onClickDetail}><a><img src={detailDashboard} alt="상세보기" style={{ width: '9px', height: '12px' }} /></a></div>;
        }


        return (
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboardSection}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={1020}
                    popupMinHeight={46}
                    /* topSize={32} */ /* EDMS 1229 */
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={content.colseX} onClick={() => this.props.setVisiblePopups(SDMS.menu.dashboard, false)}><a><img src={imgClose} alt="닫기" style={{ width: '12px', height: '12px' }}/></a></div>
                    <div className={content.viewDashboardSectionConts}>
                        {/* {
                            this.getSensorCountElements()
                        } */}

                        <div className={content.viewDashboardText}>전기설비 ( <span className={content.blueCircle}></span> 1 ) </div>
                        <div className={content.viewDashboardText}>공조설비 ( <span className={content.blueCircle}></span> 2 ) </div>
                        <div className={content.viewDashboardText}>소화설비 ( <span className={content.blueCircle}></span> 23 ) </div>
                        <div className={content.viewDashboardText}>유도등 ( <span className={content.blueCircle}></span> 16 ) </div>
                        <div className={content.viewDashboardText}>CCTV ( <span className={content.blueCircle}></span> 4 ) </div>
                        <div className={content.viewDashboardText}>화재감지 ( <span className={content.blueCircle}></span> 6 ) </div>


                        <div className={content.viewDashboardTemperature} style={{ marginRight: "15px" }}>
                            <ul>
                                {
                                    this.displayAlarmCountUI()
                                }
                            </ul>
                        </div>
                        {dashboardBtn}
                    </div>
                
                </PopupDraggable>
            </div>
        );
    }
}

export default Dashboard;

