import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import uis from '../../../Common/css/ui.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import imgClose from '../../../Common/image/icon/close_x.svg';
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
//import { bounceIn } from '@amcharts/amcharts4/.internal/core/utils/Ease';
//import { object } from '@amcharts/amcharts4/core';

import ConfirmDialog from '../../../Common/ui/confirmHydrogen';

import { DashboardComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            useSensorList: null,                                // 현재 센서 목록
            sensorAlarms: store.getState().sensorAllAlarm,      // 현재 알람
            serverConnState: null,                              // 서버 연결 상태
            useSensorTypes: null,                               // 사용 중인 센서 타입  

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: [''],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
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
            let data = SettingsStore.getState();

            if (data.actionType === 'RESET_POPUP') {
                // 팝업 위치 초기화
                this.repositionPopup(data.popupState);
            } else if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                // 센서서버 연결 상태 업데이트
                this.reloadServerConnState(data.sdmsCommonSettings);

                //this.reloadUseSensorTypes(data.sdmsCommonSettings);
            }
            
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

        this.initServerConnState();
        //this.initUseSensorTypes();
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

    getConnStateUI(facilityType) {
        let serverConnState = this.state.serverConnState;

        let connStateIcon = <React.Fragment></React.Fragment>;
        let connTextColClass = "";
        let enableCntColClass = 'greenTxt';
        let sensorCntColClass = "";

        if (serverConnState === null || serverConnState === undefined)
            return [connStateIcon, connTextColClass, enableCntColClass, sensorCntColClass];
        
        if (facilityType === SDMSResource.facilityType.FIRE) {
            if (serverConnState.ServerConnState_Fire === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        } else if (facilityType === SDMSResource.facilityType.PSM_SENSOR) {
            if (serverConnState.ServerConnState_PSM === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        } else if (facilityType === SDMSResource.facilityType.ETC) {
            if (serverConnState.ServerConnState_ETC === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        } else if (facilityType === SDMSResource.facilityType.Intrusion_S1) {
            if (serverConnState.ServerConnState_SVMS === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        } else if (facilityType === SDMSResource.facilityType.Earthquake) {
            if (serverConnState.ServerConnState_Earthquake === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        } else if (facilityType === SDMSResource.facilityType.STRONG_WIND) {
            if (serverConnState.ServerConnState_StrongWind === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        }
        else if (facilityType === SDMSResource.facilityType.Environment) {
            if (serverConnState.ServerConnState_Environment === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        }
        else if (facilityType === SDMSResource.facilityType.Manufacture) {
            if (serverConnState.ServerConnState_Manufacture === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        }
        else if (facilityType === SDMSResource.facilityType.Laser) {
            if (serverConnState.ServerConnState_Laser === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        }
        else if (facilityType === SDMSResource.facilityType.DOOR) {
            if (serverConnState.ServerConnState_Door === "False") {
                connStateIcon = <span className={'disconnectIcon'}></span>;
                connTextColClass = 'redTxt';
                enableCntColClass = 'grayTxt';
                sensorCntColClass = 'grayTxt';
            }
        }

        return [connStateIcon, connTextColClass, enableCntColClass, sensorCntColClass];
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
        let earthquakeSensorCount = this.props.sensorCount?.earthquakeSensorCount ? this.props.sensorCount?.earthquakeSensorCount : 0;
        let disabledEarthquakeSensorCount = this.props.sensorCount?.disabledEarthquakeSensorCount ? this.props.sensorCount?.disabledEarthquakeSensorCount : 0;
        let strongWindSensorCount = this.props.sensorCount?.strongWindSensorCount ? this.props.sensorCount?.strongWindSensorCount : 0;
        let disabledStrongWindSensorCount = this.props.sensorCount?.disabledStrongWindSensorCount ? this.props.sensorCount?.disabledStrongWindSensorCount : 0;
        let laserSensorCount = this.props.sensorCount?.laserSensorCount ? this.props.sensorCount?.laserSensorCount : 0;
        let disabledLaserSensorCount = this.props.sensorCount?.disabledLaserSensorCount ? this.props.sensorCount?.disabledLaserSensorCount : 0;
        let doorSensorCount = this.props.sensorCount?.doorSensorCount ? this.props.sensorCount?.doorSensorCount : 0;
        let disabledDoorSensorCount = this.props.sensorCount?.disabledDoorSensorCount ? this.props.sensorCount?.disabledDoorSensorCount : 0;

        let environmentSensorCount = this.props.sensorCount?.environmentSensorCount ? this.props.sensorCount?.environmentSensorCount : 0;
        let disabledEnvironmentSensorCount = this.props.sensorCount?.disabledEnvironmentSensorCount ? this.props.sensorCount?.disabledEnvironmentSensorCount : 0;
        let manufactureSensorCount = this.props.sensorCount?.manufactureSensorCount ? this.props.sensorCount?.manufactureSensorCount : 0;
        let disabledManufactureSensorCount = this.props.sensorCount?.disabledManufactureSensorCount ? this.props.sensorCount?.disabledManufactureSensorCount : 0;
        let emergencyBellCount = this.props.sensorCount?.emergencyBellCount ? this.props.sensorCount?.emergencyBellCount : 0;
        let disabledEmergencyBellCount = this.props.sensorCount?.disabledEmergencyBellCount ? this.props.sensorCount?.disabledEmergencyBellCount : 0;

        const [fireStateIcon, fireTextColClass, fireEnableCntColClass, fireCntColClass] = this.getConnStateUI(SDMSResource.facilityType.FIRE);
        const [psmStateIcon, psmTextColClass, psmEnableCntColClass, psmSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.PSM_SENSOR);
        const [etcStateIcon, etcTextColClass, etcEnableCntColClass, etcSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.ETC);
        const [svmsStateIcon, svmsTextColClass, svmsEnableCntColClass, svmsSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.Intrusion_S1);
        const [earthquakeStateIcon, earthquakeTextColClass, earthquakeEnableCntColClass, earthquakeSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.Earthquake);
        const [strongWindStateIcon, strongWindTextColClass, strongWindEnableCntColClass, strongWindSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.STRONG_WIND);

        const [environmentStateIcon, environmentTextColClass, environmentEnableCntColClass, environmentSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.Environment);
        const [manufactureStateIcon, manufactureTextColClass, manufactureEnableCntColClass, manufactureSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.Manufacture);
        const [emergencyBellStateIcon, emergencyBellTextColClass, emergencyBellEnableCntColClass, emergencyBellSensorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.EmergencyBell);
        const [laserStateIcon, laserTextColClass, laserEnableCntColClass, laserCntColClass] = this.getConnStateUI(SDMSResource.facilityType.Laser);
        const [doorStateIcon, doorTextColClass, doorEnableCntColClass, doorCntColClass] = this.getConnStateUI(SDMSResource.facilityType.DOOR);

        const useSensorTypes = this.props.useSensorTypes;
        const types = [];

        if (useSensorTypes) {
            if (useSensorTypes.UseFire === true) {
                types.push(<div key={"fire_" + fireSensorCount + "_" + disabledFireSensorCount} className={'flexBox'}>{fireStateIcon}<div style={{ lineHeight: '26px' }}><span className={fireTextColClass}>{i18n.t('facilityType.화재')}</span> ( <span className={fireEnableCntColClass}>●</span>{fireSensorCount - disabledFireSensorCount} / <span className={fireCntColClass}>●</span>{fireSensorCount} ) </div></div>);
            }
            if (useSensorTypes.UsePSM === true) {
                types.push(<div key={"psm_" + psmSensorCount + "_" + disabledPsmSensorCount} className={'flexBox'}>{psmStateIcon}<div style={{ lineHeight: '26px' }}><span className={psmTextColClass}>{i18n.t('facilityType.누출')}</span> ( <span className={psmEnableCntColClass}>●</span>{psmSensorCount - disabledPsmSensorCount} / <span className={psmSensorCntColClass}>●</span>{psmSensorCount} ) </div></div>);
            }
            if (useSensorTypes.UseETC === true) {
                types.push(<div key={"etc_" + etcSensorCount + "_" + disabledEtcSensorCount} className={'flexBox'}>{etcStateIcon}<div style={{ lineHeight: '26px' }}><span className={etcTextColClass}>{i18n.t('facilityType.기타')}</span> ( <span className={etcEnableCntColClass}>●</span>{etcSensorCount - disabledEtcSensorCount} / <span className={etcSensorCntColClass}>●</span>{etcSensorCount} ) </div></div>);
            }
            if (useSensorTypes.UseEarthquake === true && ProjectResource.SiteID !== ProjectResource.Site.GG_A) {
                types.push(<div key={"earthquake_" + earthquakeSensorCount + "_" + disabledEarthquakeSensorCount} className={'flexBox'}>{earthquakeStateIcon}<div style={{ lineHeight: '26px' }}><span className={earthquakeTextColClass}>{i18n.t('facilityType.지진')}</span> ( <span className={earthquakeEnableCntColClass}>●</span>{earthquakeSensorCount - disabledEarthquakeSensorCount} / <span className={earthquakeSensorCntColClass}>●</span>{earthquakeSensorCount} ) </div></div>);
            }
            if (useSensorTypes.UseStrongWind === true) {
                types.push(<div key={"strongWind_" + strongWindSensorCount + "_" + disabledStrongWindSensorCount} className={'flexBox'}>{strongWindStateIcon}<div style={{ lineHeight: '26px' }}><span className={strongWindTextColClass}>{i18n.t('facilityType.강풍')}</span> ( <span className={strongWindEnableCntColClass}>●</span>{strongWindSensorCount - disabledStrongWindSensorCount} / <span className={strongWindSensorCntColClass}>●</span>{strongWindSensorCount} ) </div></div>);
            }
            if (useSensorTypes.UseEnvironment === true) {
                types.push(<div key={"environment" + environmentSensorCount + "_" + disabledEnvironmentSensorCount} className={'flexBox'}>{environmentStateIcon}<div style={{ lineHeight: '26px' }}><span className={environmentTextColClass}>{i18n.t('facilityType.환경설비')}</span> ( <span className={environmentEnableCntColClass}>●</span>{environmentSensorCount - disabledEnvironmentSensorCount} / <span className={environmentSensorCntColClass}>●</span>{environmentSensorCount} ) </div></div>);
            }
            if (useSensorTypes.UseManufacture === true) {
                types.push(<div key={"manufacture" + manufactureSensorCount + "_" + disabledManufactureSensorCount} className={'flexBox'}>{manufactureStateIcon}<div style={{ lineHeight: '26px' }}><span className={manufactureTextColClass}>{i18n.t('facilityType.제조설비')}</span> ( <span className={manufactureEnableCntColClass}>●</span>{manufactureSensorCount - disabledManufactureSensorCount} / <span className={manufactureSensorCntColClass}>●</span>{manufactureSensorCount} ) </div></div>);
            }

            if (ProjectResource.SiteID !== ProjectResource.Site.Hydrogen) {
                types.push(<div key={"cctv_" + cctvCount + "_" + disabledCCTVCount} className={'flexBox'}>{svmsStateIcon}<div style={{ lineHeight: '26px' }}><span className={svmsTextColClass}>CCTV</span> ( <span className={svmsEnableCntColClass}>●</span>{cctvCount - disabledCCTVCount} / <span className={svmsSensorCntColClass}>●</span>{cctvCount} ) </div></div>);
            }

            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                types.push(<div key={"emergencyBell_" + emergencyBellCount + "_" + disabledEmergencyBellCount} className={'flexBox'}>{emergencyBellStateIcon}<div style={{ lineHeight: '26px' }}><span className={emergencyBellTextColClass}>비상벨</span> ( <span className={emergencyBellEnableCntColClass}>●</span>{emergencyBellCount - disabledEmergencyBellCount} / <span className={emergencyBellSensorCntColClass}>●</span>{emergencyBellCount} ) </div></div>);
            }

            if (ProjectResource.SiteID === ProjectResource.Site.CheongSim) {
                if (useSensorTypes.UseLaser === true)
                    types.push(<div key={"laser_" + laserSensorCount + "_" + disabledLaserSensorCount} className={'flexBox'}>{laserStateIcon}<div style={{ lineHeight: '26px' }}><span className={laserTextColClass}>레이저</span> ( <span className={laserEnableCntColClass}>●</span>{laserSensorCount - disabledLaserSensorCount} / <span className={laserCntColClass}>●</span>{laserSensorCount} ) </div></div>);
                if (useSensorTypes.UseDoor === true)
                    types.push(<div key={"emergencyBell_" + doorSensorCount + "_" + disabledDoorSensorCount} className={'flexBox'}>{doorStateIcon}<div style={{ lineHeight: '26px' }}><span className={doorTextColClass}>도어</span> ( <span className={doorEnableCntColClass}>●</span>{doorSensorCount - disabledDoorSensorCount} / <span className={doorCntColClass}>●</span>{doorSensorCount} ) </div></div>);
            }

            let hydrogenUI = null;
            if (ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen) {
                hydrogenUI = (<span className={'sectionLocationIcon'}></span>);
            }

            return (
               <>
                    {hydrogenUI}
                    <div className={'sectionblank'}>
                        {types}
                    </div>
               </>
            );
        }

        return (
            <div className={'sectionblank'}>
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

    initServerConnState = () => {
        const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

        if (sdmsCommonSettings) {
            this.reloadServerConnState(sdmsCommonSettings);
        }
    }

    reloadServerConnState = (sdmsCommonSettings) => {
        let data = sdmsCommonSettings;
        let serverConnState = this.state.serverConnState;

        if (data?.ServerConnState_Fire !== undefined ||
            data?.ServerConnState_PSM !== undefined ||
            data?.ServerConnState_ETC !== undefined ||
            data?.ServerConnState_SVMS !== undefined ||
            data?.ServerConnState_Earthquake !== undefined ||
            data?.ServerConnState_StrongWind !== undefined) {

            if (serverConnState === null) {
                let connState = new Object();
                connState.ServerConnState_Fire = data.ServerConnState_Fire;
                connState.ServerConnState_PSM = data.ServerConnState_PSM;
                connState.ServerConnState_ETC = data.ServerConnState_ETC;
                connState.ServerConnState_SVMS = data.ServerConnState_SVMS;
                connState.ServerConnState_Earthquake = data.ServerConnState_Earthquake;
                connState.ServerConnState_StrongWind = data.ServerConnState_StrongWind;

                const message = this.makeConnErrorMsg(serverConnState, data);
                if (message !== null) {
                    this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
                }

                this.setState({ serverConnState: connState });

            } else if (serverConnState.ServerConnState_Fire !== data.ServerConnState_Fire ||
                serverConnState.ServerConnState_PSM !== data.ServerConnState_PSM ||
                serverConnState.ServerConnState_ETC !== data.ServerConnState_ETC ||
                serverConnState.ServerConnState_SVMS !== data.ServerConnState_SVMS ||
                serverConnState.ServerConnState_Earthquake !== data.ServerConnState_Earthquake ||
                serverConnState.ServerConnState_StrongWind !== data.ServerConnState_StrongWind) {

                const message = this.makeConnErrorMsg(serverConnState, data);
                if (message !== null) {
                    this.showConfirmDialog(i18n.t('common.오류'), [message], null, null);
                } else if (this.state.confirmMessage.visible === true && message === null) {
                    // 연결이 다 복구 되었을 경우 
                    this.state.confirmMessage.visible = false;
                }

                serverConnState.ServerConnState_Fire = data.ServerConnState_Fire;
                serverConnState.ServerConnState_PSM = data.ServerConnState_PSM;
                serverConnState.ServerConnState_ETC = data.ServerConnState_ETC;
                serverConnState.ServerConnState_SVMS = data.ServerConnState_SVMS;
                serverConnState.ServerConnState_Earthquake = data.ServerConnState_Earthquake;
                serverConnState.ServerConnState_StrongWind = data.ServerConnState_StrongWind;

                this.setState({ serverConnState });
            }
        }
    }

    makeConnErrorMsg = (serverConnState, data) => {
        let message = null;

        if (serverConnState === null) {
            if (data.ServerConnState_Fire === "False") {
                message = i18n.t('facilityType.화재센서');
            } else if (data.ServerConnState_PSM === "False") {
                message = i18n.t('facilityType.누출센서');
            } else if (data.ServerConnState_ETC === "False") {
                message = i18n.t('facilityType.기타센서');
            } else if (data.ServerConnState_SVMS === "False") {
                message = "SVMS";
            } else if (data.ServerConnState_Earthquake === "False") {
                message = i18n.t('facilityType.지진센서');
            } else if (data.ServerConnState_StrongWind === "False") {
                message = i18n.t('facilityType.강풍센서');
            }
        } else if (serverConnState && data) {
            if (serverConnState.ServerConnState_Fire !== data.ServerConnState_Fire &&
                data.ServerConnState_Fire === "False") {
                message = i18n.t('facilityType.화재센서');
            } else if (serverConnState.ServerConnState_PSM !== data.ServerConnState_PSM &&
                data.ServerConnState_PSM === "False") {
                message = i18n.t('facilityType.누출센서');
            } else if (serverConnState.ServerConnState_ETC !== data.ServerConnState_ETC &&
                data.ServerConnState_ETC === "False") {
                message = i18n.t('facilityType.기타센서');
            } else if (serverConnState.ServerConnState_SVMS !== data.ServerConnState_SVMS &&
                data.ServerConnState_SVMS === "False") {
                message = "SVMS";
            } else if (serverConnState.ServerConnState_Earthquake !== data.ServerConnState_Earthquake &&
                data.ServerConnState_Earthquake === "False") {
                message = i18n.t('facilityType.지진센서');
            } else if (serverConnState.ServerConnState_StrongWind !== data.ServerConnState_StrongWind &&
                data.ServerConnState_StrongWind === "False") {
                message = i18n.t('facilityType.강풍센서');
            }
        }

        if (message !== null) {
            message += i18n.t('sdms.dashboard.서버 연결이 끊어졌습니다');
        }

        return message;
    }

    showConfirmDialog = (title, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.state.confirmMessage = confirmMessage;
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    onClickDetail = () => {
        let url = window.location.origin + RootResource.path.dashboard;
        window.open(url, "_blank");
    }

    getAlarmState = () => {
        const selectAlarms = this.state.sensorAlarms;
        const selectSensors = this.state.useSensorList;

        let fireCount = 0;
        let psmCount = 0;
        let etcCount = 0;
        let safetyCount = 0;
        let svmsCount = 0;
        let earthquakeCount = 0;
        let strongWindCount = 0;
        let blackOutCount = 0;
        let environmentCount = 0;
        let manufactureCount = 0;
        let emergencyBellCount = 0;
        let lowBatteryCount = 0;
        let waterLevelCount = 0;
        let terrorCount = 0;

        if (selectAlarms === null || selectAlarms === undefined)
            return [fireCount.toString(), svmsCount.toString(), psmCount.toString(), etcCount.toString(), safetyCount.toString(), earthquakeCount.toString(), strongWindCount.toString(), blackOutCount.toString(), environmentCount.toString(), manufactureCount.toString(), emergencyBellCount.toString(), lowBatteryCount.toString(), waterLevelCount.toString(), terrorCount.toString()];

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

        //for (let i = 0; i < selectAlarms.length; i++) {
        //    let alarm = selectAlarms[i];
        //    let facilityType = alarm.facilityType;

        //    if (SDMSResource.isFireSensorType(facilityType)) {
        //        fireCount++;
        //    } else if (SDMSResource.isSVMSSensorType(facilityType)) {
        //        svmsCount++;

        //        for (let i = 0; i < selectAlarms.length; i++) {
        //            let alarm = selectAlarms[i];

        //            if (SDMSResource.isSVMSSensorType(alarm.facilityType)) {

        //                for (let j = 0; j < safetyCCTVs.length; j++) {
        //                    const cctv = safetyCCTVs[j];

        //                    if (cctv.id === alarm.orgSensorID) {
        //                        safetyCount++;
        //                        break;
        //                    }
        //                }
        //            }
        //        }

        //    } else if (SDMSResource.isPSMSensorType(facilityType)) {
        //        psmCount++;

        //        // soulbrain safety 카운팅
        //    } else if (SDMSResource.isETCSensorType(facilityType) && ProjectResource.SiteID !== ProjectResource.Site.GG_A) {
        //        etcCount++;

        //        // soulbrain safety 카운팅
        //    } else if (SDMSResource.isEarthquakeSensorType(facilityType)) {
        //        earthquakeCount++;
        //    } else if (SDMSResource.isStrongWindSensorType(facilityType)) {
        //        strongWindCount++;
        //    } else if (SDMSResource.isBlackOutSensorType(facilityType)) {
        //        blackOutCount++;
        //    } else if (SDMSResource.isEnvironmentSensorType(facilityType)) {
        //        environmentCount++;
        //    } else if (SDMSResource.isManufactureSensorType(facilityType)) {
        //        manufactureCount++;
        //    } else if (SDMSResource.isEmergencyBellSensorType(facilityType)) {
        //        emergencyBellCount++;
        //    } else if (SDMSResource.isLowBatterySensorType(facilityType)) {
        //        lowBatteryCount++;
        //    } else if (SDMSResource.isWaterLevelSensorType(facilityType)) {
        //        waterLevelCount++;
        //    } else if (SDMSResource.isTerrorSensorType(facilityType)) {
        //        terrorCount++;
        //    } 
            
        //}

        return [fireCount.toString(), svmsCount.toString(), psmCount.toString(), etcCount.toString(), safetyCount.toString(), earthquakeCount.toString(), strongWindCount.toString(), blackOutCount.toString(), environmentCount.toString(), manufactureCount.toString(), emergencyBellCount.toString(), lowBatteryCount.toString(), waterLevelCount.toString(), terrorCount.toString()];
    }

    displayAlarmCountUI = () => {
        const [fireCount, svmsCount, psmCount, etcCount, safetyCount, earthquakeCount, strongWindCount, blackOutCount, environmentCount, manufactureCount, emergencyBellCount, lowBatteryCount, waterLevelCount, terrorCount] = this.getAlarmState();
        const useSensorTypes = this.props.useSensorTypes;
        const displayAlarmCountUI = [];

        if (useSensorTypes) {
            if (useSensorTypes.UseFire === true) {
                displayAlarmCountUI.push(<li key={"fire_" + fireCount}><div className={content.whiteTxt}>{i18n.t('facilityType.화재')}({fireCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UsePSM === true) {
                displayAlarmCountUI.push(<li key={"psm_" + psmCount}><div className={content.whiteTxt}>{i18n.t('facilityType.누출')}({psmCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseETC === true) {
                displayAlarmCountUI.push(<li key={"etc_" + etcCount}><div className={content.whiteTxt}>{i18n.t('facilityType.기타')}({etcCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseEnvironment === true) {
                displayAlarmCountUI.push(<li key={"environment_" + environmentCount}><div className={content.whiteTxt}>{i18n.t('facilityType.환경설비')}({environmentCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseManufacture === true) {
                displayAlarmCountUI.push(<li key={"manufacture_" + manufactureCount}><div className={content.whiteTxt}>{i18n.t('facilityType.제조설비')}({manufactureCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (ProjectResource.siteID === ProjectResource.Site.Soulbrain) {
                displayAlarmCountUI.push(<li key={"safety_" + safetyCount}><div className={content.whiteTxt}>{i18n.t('facilityType.세이프티 아이')}({safetyCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseSVMS === true) {
                displayAlarmCountUI.push(<li key={"cctv_" + svmsCount}><div className={content.whiteTxt}>{i18n.t('facilityType.CCTV')}({svmsCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseEarthquake === true) {
                displayAlarmCountUI.push(<li key={"earthquake_" + earthquakeCount}><div className={content.whiteTxt}>{i18n.t('facilityType.지진')}({earthquakeCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseStrongWind === true) {
                displayAlarmCountUI.push(<li key={"strongWind_" + strongWindCount}><div className={content.whiteTxt}>{i18n.t('facilityType.강풍')}({strongWindCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseBlackOut === true) {
                displayAlarmCountUI.push(<li key={"blackOut_" + blackOutCount}><div className={content.whiteTxt}>{i18n.t('facilityType.정전')}({blackOutCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            if (useSensorTypes.UseEmergencyBell === true) {
                displayAlarmCountUI.push(<li key={"emergencyBell_" + emergencyBellCount}><div className={content.whiteTxt}>{i18n.t('facilityType.비상벨')}({emergencyBellCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
            
            if (ProjectResource.SiteID === ProjectResource.Site.GG_A) {
                let electricCount = 0;
                electricCount = Number(blackOutCount) + Number(lowBatteryCount);

                displayAlarmCountUI.push(<li key={"electric_" + electricCount}><div className={content.whiteTxt}>전력({electricCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
                displayAlarmCountUI.push(<li key={"waterLevel_" + waterLevelCount}><div className={content.whiteTxt}>침수({waterLevelCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
                displayAlarmCountUI.push(<li key={"terror_" + terrorCount}><div className={content.whiteTxt}>테러({terrorCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
                displayAlarmCountUI.push(<li key={"psmGas_" + psmCount}><div className={content.whiteTxt}>가스누출({psmCount}{i18n.t('sdms.dashboard.건')}) </div></li>);
            }
        }

        let hydrogenUI = null;
        if (ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen) {
            hydrogenUI = (<span className={'sectionAlarmIcon'}></span>);
        }

        return (
            <>
                {hydrogenUI}
                <div className={'sectionblankAlarm'}>
                    {displayAlarmCountUI}
                </div>
            </>
        )
    }
    
    render() {
        let dashboardBtn = null;

        if (ProjectResource.siteID === ProjectResource.Site.Soulbrain ||
            ProjectResource.siteID === ProjectResource.Site.GCC)
            dashboardBtn = <div className={'detailBtn'} onClick={this.onClickDetail}><a><img src={detailDashboard} alt={i18n.t('sdms.dashboard.상세보기')} /></a></div>;

        return (
            <>
                <DashboardComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardSection'}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={970}
                        popupMinHeight={81}
                        topSize={40}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >
                        <div className={'colseX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.dashboard, false)}><a><img src={imgClose} alt={i18n.t('common.닫기')} /></a></div>
                        <div className={'viewDashboardSectionConts'}>
                            <div className={'viewDashboardSensors'}>
                                {
                                    this.getSensorCountElements()
                                }
                            </div>
                            <div className={'viewDashboardTemperature'} /* style={{ marginRight: "15px" }} */>
                                <ul>
                                    {
                                        this.displayAlarmCountUI()
                                    }
                                </ul>
                            </div>
                            {dashboardBtn}
                        </div>
                
                    </PopupDraggable>
                </DashboardComponent>
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }   
            </>
        );
    }
}

export default withTranslation()(Dashboard);

