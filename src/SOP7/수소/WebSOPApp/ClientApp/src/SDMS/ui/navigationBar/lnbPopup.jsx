import React, { Component } from 'react';
import { LNBComponent, LNBToolsComponent, POIViewerComponent, Tools3DComponent  } from '../../styled/lnbStyled';
import SdmsResource from '../../resource/id';
import SDMS from '../sdms';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';
import SDMSMainMenu from '../sdmsMainMenu';


class LnbPopup extends Component {
    static InitViewport = 0;
    static SetInitialViewport = 1;
    static ZoomIn = 2;
    static ZoomOut = 3;
    static StartAutoRotation = 4;

    constructor(props) {
        super(props);

        this.props = props;
        this.refQuickButton = React.createRef();
        this.refMain = React.createRef();
    }

    setVisiblePopups = (menu) => {
        //this.props.setVisiblePopups(menu);
        this.props.setModePopup(menu);
    }

    getQuickButtonClassName(name) {
        if (this.props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }

    onClickNavigator = () => {
        const poiViewerBtn = document.getElementById('poiViewerBtn');
        const poiViewerBox = document.getElementById('poiViewerBox');
        const tool3DBtn = document.getElementById('tool3DBtn');
        const ToolBox = document.getElementById('3dToolBox');

        if (poiViewerBox) {
            if (poiViewerBox.classList.contains('on')) {
                poiViewerBtn.classList.remove('on');
                poiViewerBox.classList.remove('on');
            }
            else {
                poiViewerBtn.classList.add('on');
                poiViewerBox.classList.add('on');
            }
        }

        if (poiViewerBox.classList.contains('on')) {
            tool3DBtn.classList.remove('on');
            ToolBox.classList.remove('on');
        }
    }

    openToolBox = () => {
        const ToolBtn = document.getElementById('tool3DBtn');
        const ToolBox = document.getElementById('3dToolBox');
        const poiViewerBtn = document.getElementById('poiViewerBtn');
        const poiViewerBox = document.getElementById('poiViewerBox');

        if (ToolBox) {
            if (ToolBox.classList.contains('on')) {
                ToolBtn.classList.remove('on');
                ToolBox.classList.remove('on');
            }
            else {
                ToolBtn.classList.add('on');
                ToolBox.classList.add('on');
            }
        }

        if (ToolBox.classList.contains('on')) {
            poiViewerBtn.classList.remove('on');
            poiViewerBox.classList.remove('on');
        }
    }

    onClick3DTools = (menu) => {
        if (this.props.menu3DTools && this.props.menu3DTools.onClick3DTools) {
            this.props.menu3DTools.onClick3DTools(menu);
        }
    }
    
    render(){

        // 이벤트 알람이 0개라면 버튼 비활성화 (24.10.10 한봄희)
        let eventAlarmCount = 0;
        let eventClass = "disable";

        if (this.props.sensorAlarms?.length > 0) {
            const alarms = this.props.sensorAlarms.filter(x => x.isAlarm === true);
            eventClass = "";

            if (alarms.length > 0) {
                eventClass = "active";
            }
        }

        return(
            <>

                <LNBComponent>
                    <ul ref={this.refQuickButton}>
                        <li key={"liQuickKey_statusInfo"}><a id={"dsBot_" + SdmsResource.popupLayer.statusInfo + " " + "tooltip"} data-tooltip-text={i18n.t('sdms.menu.설비리스트')} className={this.getQuickButtonClassName(SDMS.menu.statusInfo) + " " + 'listsFacility'} onClick={() => this.setVisiblePopups(SDMS.menu.statusInfo)}></a></li>
                        <li key={"liQuickKey_dashboardPop"}><a id={"dsBot_" + SdmsResource.popupLayer.dashboardPop + " " + "tooltip"} className={this.getQuickButtonClassName(SDMS.menu.dashboardPop) + " " + 'dashboardIcon'} data-tooltip-text={i18n.t('sdms.menu.대시보드')} onClick={() => this.setVisiblePopups(SDMS.menu.dashboardPop)}></a></li>
                        <li key={"liQuickKey_eventInfoNew"}><a id={"dsBot_" + SdmsResource.popupLayer.eventInfoNew + 'tooltip'} className={this.getQuickButtonClassName(SDMS.menu.eventInfoNew) + " " + 'eventInfo' + " " + /*(eventAlarmCount > 0 ? 'active' : 'disable')*/eventClass} data-tooltip-text={i18n.t('sdms.menu.이벤트 정보')} onClick={() => this.setVisiblePopups(SDMS.menu.eventInfoNew)}></a></li>
                        <li key={"liQuickKey_detectionInfo"}><a id={"dsBot_" + SdmsResource.popupLayer.detectionInfo + 'tooltip'} className={this.getQuickButtonClassName(SDMS.menu.detectionInfo) + " " + 'anomalyDetection'} data-tooltip-text={i18n.t('sdms.menu.이상 탐지')} onClick={() => this.setVisiblePopups(SDMS.menu.detectionInfo)}></a></li>
                        <li key={"liQuickKey_analysisInfo"}><span className={'riskAnalysisSpan'}><a id={"dsBot_" + SdmsResource.popupLayer.analysisInfo + 'tooltip'} className={this.getQuickButtonClassName(SDMS.menu.analysisInfo) + " " + 'riskAnalysis'} data-tooltip-text={i18n.t('sdms.menu.위험성 평가 예측')} onClick={() => this.setVisiblePopups(SDMS.menu.analysisInfo)}></a></span></li>
                        <li key={"liQuickKey_simulationInfo"}><a id={"dsBot_" + SdmsResource.popupLayer.simulationInfo + 'tooltip'} className={this.getQuickButtonClassName(SDMS.menu.simulationInfo) + " " + 'simulation'} data-tooltip-text={i18n.t('sdms.menu.시뮬레이션')} onClick={() => this.setVisiblePopups(SDMS.menu.simulationInfo)}></a></li>
                    </ul>
                </LNBComponent>

                <LNBToolsComponent>
                    <POIViewerComponent>
                        <span id='tooltip'>
                            <button id={'poiViewerBtn'} className={'poiViewerBtn'} onClick={this.onClickNavigator} data-tooltip-text={i18n.t('sdms.toolbar.POI 뷰어')}></button>
                        </span>
                        <div id={'poiViewerBox'}>
                            <ul>
                                <li id={'flow'} className={'flow' + (this.props.visibleSensorTypes[SDMSMainMenu.Flow_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.Flow_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.Flow_Sensor])} data-tooltip-poitext={i18n.t('facilityType.유량')}><a></a></li>

                                <li id={'h2'} className={'h2' + (this.props.visibleSensorTypes[SDMSMainMenu.H2_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.H2_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.H2_Sensor])} data-tooltip-poitext={i18n.t('facilityType.고농도수소')}><a></a></li>

                                <li id={'h2low'} className={'h2low' + (this.props.visibleSensorTypes[SDMSMainMenu.H2Low_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.H2Low_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.H2Low_Sensor])} data-tooltip-poitext={i18n.t('facilityType.저농도수소')}><a></a></li>

                                <li id={'o2'} className={'o2' + (this.props.visibleSensorTypes[SDMSMainMenu.O2_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.O2_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.O2_Sensor])} data-tooltip-poitext={i18n.t('facilityType.산소')}><a></a></li>

                                <li id={'pressure'} className={'pressure' + (this.props.visibleSensorTypes[SDMSMainMenu.PRESSURE_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.PRESSURE_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.PRESSURE_Sensor])} data-tooltip-poitext={i18n.t('facilityType.압력')}><a></a></li>

                                <li id={'temperature'} className={'temperature' + (this.props.visibleSensorTypes[SDMSMainMenu.Temp_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.Temp_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.Temp_Sensor])} data-tooltip-poitext={i18n.t('facilityType.온도')}><a></a></li>

                                <li id={'h2jag'} className={'h2jag' + (this.props.visibleSensorTypes[SDMSMainMenu.H2JAG_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.H2JAG_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.H2JAG_Sensor])} data-tooltip-poitext={i18n.t('facilityType.수소가스')}><a></a></li>

                                <li id={'o2jag'} className={'o2jag' + (this.props.visibleSensorTypes[SDMSMainMenu.O2JAG_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.O2JAG_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.O2JAG_Sensor])} data-tooltip-poitext={i18n.t('facilityType.산소가스')}><a></a></li>

                                {/* 기획자 요청으로 해당 아이콘 비활성화 */}
                                {/* <li id={'conductivity'} className={'conductivity' + (this.props.visibleSensorTypes[SDMSMainMenu.Conduct_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.Conduct_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.Conduct_Sensor])} data-tooltip-poitext={i18n.t('facilityType.전도도')}></li> */}
                                {/* <li id={'gas'} className={'gas' + (this.props.visibleSensorTypes[SDMSMainMenu.GAS_Sensor] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.GAS_Sensor, !this.props.visibleSensorTypes[SDMSMainMenu.GAS_Sensor])} data-tooltip-poitext={i18n.t('facilityType.가스')}><a></a></li> */}
                                {/* <li id={'pvPanel'} className={'pvPanel' + (this.props.visibleSensorTypes[SDMSMainMenu.PV_Panel] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.PV_Panel, !this.props.visibleSensorTypes[SDMSMainMenu.PV_Panel])} data-tooltip-poitext={i18n.t('sdms.toolbar.PV 패널')}><a></a></li> */}
                            </ul>
                        </div>
                    </POIViewerComponent>
                    <Tools3DComponent>
                        <span id='tooltip'>
                            <button id={'tool3DBtn'} className={'tool3DBtn'} onClick={this.openToolBox} data-tooltip-text={i18n.t('sdms.toolbar.3D 조작툴')}></button>
                        </span>
                        <div id={'3dToolBox'}>
                            <ul>
                                <li id={'home'} className={'home'} onClick={() => this.onClick3DTools(LnbPopup.InitViewport)} data-tooltip-poitext={i18n.t('sdms.toolbar.초기화면')}><a></a></li>
                                <li id={'basicView'} className={'basicView'} onClick={() => this.onClick3DTools(LnbPopup.SetInitialViewport)} data-tooltip-poitext={i18n.t('sdms.toolbar.초기화면 지정')}><a></a></li>
                                <li id={'zoomIn'} className={'zoomIn'} onClick={() => this.onClick3DTools(LnbPopup.ZoomIn)} data-tooltip-poitext={i18n.t('sdms.toolbar.확대')}><a></a></li>
                                <li id={'zoomOut'} className={'zoomOut'} onClick={() => this.onClick3DTools(LnbPopup.ZoomOut)} data-tooltip-poitext={i18n.t('sdms.toolbar.축소')}><a></a></li>
                                <li id={'rotate'} className={'rotate' + (this.props.visibleSensorTypes[SDMSMainMenu.Use3DRotation] ? ' on' : '')} onClick={() => this.props.setVisiblePoi(SDMSMainMenu.Use3DRotation, !this.props.visibleSensorTypes[SDMSMainMenu.Use3DRotation])} data-tooltip-poitext={i18n.t('sdms.toolbar.회전')}><a></a></li>
                            </ul>
                        </div>
                    </Tools3DComponent>
                </LNBToolsComponent>

            </>
        );
    }
}

export default LnbPopup;
//export default withTranslation()(LnbPopup);
