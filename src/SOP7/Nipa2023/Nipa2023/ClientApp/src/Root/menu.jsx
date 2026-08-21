import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import SDMS from '../SDMS/ui/sdms';
import Monitoring from '../SDMS/ui/monitoring';
import Layout from './layout';
import Dashboard from '../Dashboard/ui/dashboard';
import TeamEditor from '../TeamEditor/ui/teamEditor';
import DashboardMes from '../Dashboard/ui/dashboardMes';
import History from '../History/ui/history';
import SopManager from '../SOPManager/ui/sopManager';
import SopSimulator from '../SOPSimulator/ui/sopSimulator';

import ProjectResource from './resource/id';
import SdmsResource from '../SDMS/resource/id';

import { UserDispatch } from './resource/userDispatch';
import { SdmsController } from '../SDMS/services/sdmsController';
import { SettingsController } from '../Settings/services/settingsController';
import SopSimulatorController from '../SOPSimulator/services/sopSimulatorController';

import wsManager from './services/wsManager';
import { SettingContextManager } from './resource/settingContextManager';
import { AlarmContextManager } from './resource/alarmContextManager';
import { SopContextManager } from './resource/sopContextManager';

import sdms_img from '../SDMS/images/sdms_img.png';
import TabletEquipment from '../Tablet/ui/TabletEquipment';

class Menu extends Component {
    static contextType = UserDispatch;
    static className = "Menu";

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            sdmsEvent: {},
            monitoringEvent: {},
            dashboardMonitoringEvent: {},
            dashboardMesEvent: {},
            teamEditorEvent: {},
            historyEvent: {},
            sopManagerEvent: {},
            sopSimulatorEvent: {},
            tabletEvent: {},
            wsManager: null,
            mode: SdmsResource.getMode(),
            newAlarm: false,
            newAlarmData: {},
            images: null,
            isPopupStateReset: false,
            isMoveToOutdoor: false,

            option3DNormal: [],     // 3D 회전 대기시간
            option3DSensor: [],     // 센서감지관리
            optionSopNormal: [],    // SOP 환경 일반
        };

        this.tableEqNo = null;
        this.initSiteID();
    }

    componentDidMount() {

        const { alarm, setting, sop } = this.context;
        const alarmDispatch = alarm[1];
        const settingDispatch = setting[1];
        const sopDispatch = sop[1];

        // 새로고침시 state null 초기화 되는 오류
        // 타이머 멈췄다가 재실행
        SdmsController.stopWatchTimer();
        SdmsController.startWatchTimer(this, alarmDispatch);
        AlarmContextManager.setEventOwner(AlarmContextManager.AlarmInfo, Menu.className, this);

        SettingsController.stopWatchTimer();
        SettingsController.startWatchTimer(this, settingDispatch);
        SettingContextManager.setEventOwner(SettingContextManager.SettingInfo, Menu.className, this);

        // SopSimulatorController.stopWatchTimer();
        // SopSimulatorController.StartWatchTimer(this, sopDispatch);
        // SopContextManager.setEventOwner(SopContextManager.RunSOP, Menu.className, this);

        // 모델링 이미지 preload
        const img = new Image();
        img.src = sdms_img;
        img.onload = () => {
            this.setState({ images: img });
        };
    }

    getAlarmState() {
        const { alarm } = this.context;
        const alarmState = alarm[0].alarmState;
        return alarmState;
    }

    getSettingState() {
        const { setting } = this.context;
        const settingState = setting[0].settingState;
        return settingState;
    }

    // getSopHistoryState() {
    //     const { sop } = this.context;
    //     const sopHistory = sop[0].sopHistory;
    //     return sopHistory;
    // }

    onDispatchAction(state, action) {
        if (action.type === SettingContextManager.SettingInfo) {
            this.sendAlarmLayers(action.settingState);
        }

        return null;
    }

    sendFacilityAlarm(alarm) {
        if (alarm.equipmentData?.equipment) {
            this.state.wsManager.sendFacilityAlarm(alarm.equipmentData.equipment.id, wsManager.facilityAlarmType.productFail, false);
        }
        else {
            this.state.wsManager.sendFacilityAlarm(alarm.facilityNo, wsManager.facilityAlarmType.stuckWorker, false);
        }
    }

    sendAlarmLayers = (alarm) => {
        if(!this.state.loading) {
            this.state.wsManager.sendAlarmLayers(alarm.receiveFireAlarm, alarm.receiveAtmosphereAlarm, alarm.receiveGasAlarm, alarm.receiveEmergencyBellAlarm, alarm.receiveThermalCameraAlarm, alarm.receiveWorkerAlarm, alarm.receiveFacilityError);
        }
    }

    async initSiteID() {
        const user = await ProjectResource.getUserInfo();
        const path = window.location.pathname;

        if ((user === null || user === undefined) && path !== ProjectResource.path.tablet) {
            // 로그인 정보가 없으면 로그인 페이지로 이동
            this.props.history.push('/');
        }
        else {
            this.getSettingsOption(user);
        }
    }

    getTargetEvent() {
        this.tableEqNo = null;
        const path = window.location.pathname;

        if (path.length > 0) {
            const target = path.substring(1).toLowerCase();

            if (path === ProjectResource.path.sdms)
                return [this.state.sdmsEvent, target];
            else if (path === ProjectResource.path.monitoring)
                return [this.state.monitoringEvent, target];
            else if (path === ProjectResource.path.dashboardMonitoring)
                return [this.state.dashboardMonitoringEvent, target];
            else if (path === ProjectResource.path.dashboardMes)
                return [this.state.dashboardMesEvent, target];
            else if (path === ProjectResource.path.teamEditor)
                return [this.state.teamEditorEvent, target];
            else if (path === ProjectResource.path.history)
                return [this.state.historyEvent, target];
            else if (path === ProjectResource.path.sopManager)
                return [this.state.sopManagerEvent, target];
            else if (path === ProjectResource.path.sopSimulator)
                return [this.state.sopSimulatorEvent, target];
            else if (path === ProjectResource.path.tablet) {
                this.tableEqNo = this.getTabletEquipmentNumber();

                if (this.tableEqNo !== null) {
                    return [this.state.tabletEvent, target];
                }
            }
        }

        return [null, ""];
    }

    getTabletEquipmentNumber() {
        const index = window.location.search.indexOf('?');

        if (index >= 0) {
            const params = window.location.search.substring(1);
            const tokens = params.split('=');

            if (tokens.length === 2) {
                const key = tokens[0].toLocaleLowerCase().trim();
                const value = tokens[1].trim();

                if (key === "eq") {
                    const no = parseInt(value);

                    if (isNaN(no) === false) {
                        return no;
                    }
                }
            }
        }

        return null;
    }

    setWsManager = (wsMgr) => {
        this.setState({ wsManager: wsMgr, loading: false });
    }

    onClickChangeMode = (mode) => {
        
        if(mode) {
            SdmsResource.setMode(mode);
            this.setState({ mode: mode });
        } else {
            SdmsResource.setMode(SdmsResource.mode.monitoring);
            this.setState({ mode: SdmsResource.mode.monitoring });
        }
    }

    getSettingsOption = async (user) => {
        const campusID = ProjectResource.campusID;

        // 환경설정 불러오기
        const [options, optionsMessage] = await SettingsController.requestOptions(user.id, campusID);
    
        if (options) {
            this.setState({ option3DNormal: options.option3DNormal, optionSopNormal: options.optionSopNormal, option3DSensor: options.option3DSensor });
        }
        else {
            console.log(optionsMessage);
        }
    }

    getRoutePath = () => {
        return (<React.Fragment>
            <Route path={ProjectResource.path.sdms} render={() => <SDMS menuEvent={this.state.sdmsEvent} wsManager={this.state.wsManager} setWsManager={this.setWsManager} images={this.state.images} getSettingsOption={this.getSettingsOption} />} />
            <Route path={ProjectResource.path.monitoring} render={() => <Monitoring menuEvent={this.state.monitoringEvent} wsManager={this.state.wsManager} onClickChangeMode={this.onClickChangeMode} mode={this.state.mode} newAlarm={this.state.newAlarm} newAlarmData={this.state.newAlarmData} option3DNormal={this.state.option3DNormal} optionSopNormal={this.state.optionSopNormal} isPopupStateReset={this.state.isPopupStateReset} checkPopupStateReset={this.checkPopupStateReset} isMoveToOutdoor={this.state.isMoveToOutdoor} checkMoveToOutdoor={this.checkMoveToOutdoor} />} />
            <Route path={ProjectResource.path.dashboardMonitoring} render={() => <Dashboard menuEvent={this.state.dashboardMonitoringEvent} wsManager={this.state.wsManager} />} />
            <Route path={ProjectResource.path.dashboardMes} render={() => <DashboardMes menuEvent={this.state.dashboardMesEvent} wsManager={this.state.wsManager} />} />
            <Route path={ProjectResource.path.teamEditor} render={() => <TeamEditor menuEvent={this.state.teamEditorEvent} wsManager={this.state.wsManager} />} />
            <Route path={ProjectResource.path.history} render={() => <History menuEvent={this.state.historyEvent} wsManager={this.state.wsManager} />} />
            <Route path={ProjectResource.path.sopManager} render={() => <SopManager menuEvent={this.state.sopManagerEvent} />} />
            <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={this.state.sopSimulatorEvent} optionSopNormal={this.state.optionSopNormal} />} />
            <Route path={ProjectResource.path.tablet} render={() => <TabletEquipment menuEvent={this.state.tabletEvent} eqNo={this.tableEqNo} />} />
        </React.Fragment>);
    }

    isNewAlarm = (value) => {
        this.setState({ newAlarm: value });
    }

    setNewAlarm = (alarm) => {
        this.setState({ newAlarmData: alarm });
    }

    checkPopupStateReset = (value) => {
        this.setState({ isPopupStateReset: value });
    }

    checkMoveToOutdoor = (value) => {
        this.setState({ isMoveToOutdoor: value });
    }

    render() {
        const [targetEvent, target] = this.getTargetEvent();

        return (
            <Layout 
                menuEvent={targetEvent} 
                target={target} 
                onClickChangeMode={this.onClickChangeMode}
                wsManager={this.state.wsManager}
                isNewAlarm={this.isNewAlarm}
                setNewAlarm={this.setNewAlarm}
                option3DNormal={this.state.option3DNormal}
                option3DSensor={this.state.option3DSensor}
                optionSopNormal={this.state.optionSopNormal}
                getSettingsOption={this.getSettingsOption}
                checkPopupStateReset={this.checkPopupStateReset}
                checkMoveToOutdoor={this.checkMoveToOutdoor}
            >
                {
                    this.getRoutePath()
                }
            </Layout>
        );
    }
}

export default withRouter(Menu);