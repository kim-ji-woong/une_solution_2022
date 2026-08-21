import React, { Component } from 'react';
import HistoryResource from "../resource/id";
import SensorDetectHistory from './sensorDetectHistory';
import SensorDetectAnalysis from './sensorDetectAnalysis';
import SOPHistory from './sopHistory';
import ReportHistory from './ReportHistory';
import StatisticsHistory from './StatisticsHistory';

//import { SDMSController } from '../../SDMS/services/sdmsController';
import SettingsStore from '../../Settings/settingsStore';
import ProjectResource from '../../Root/resource/id';
import { SensorDetectHistoryComponent, SensorDetectAnalysisComponent, SOPHistoryComponent, ReportHistoryComponent, StatisticsHistoryComponent } from '../styled/SensorDetectHistoryStyled';
import { SDMSController } from "../../SDMS/services/sdmsController";
import ConfirmDialog from "../../Common/ui/confirmDialog";


class History extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            content: HistoryResource.menu.센서_탐지_이력,
            buildingGroupList: null,
            sensorTypes: null,
            sensorList: null,
            externalSensors: null,
            externalSensorTypes: null,

            linkSOP: null,/*{ beginTime: null, actionStepHistoryID: -1 },*/

            prevProps: null,

            useSensorTypes: null,       // 사용 중인 센서 타입  

            selectedSiteID: null,		/* 현재 SiteID */
            materials: null,
            externalMaterials: null,

            confirmMessage: {
                visible: false,
                type: null,
                messages: [""],
                buttons: ["확인"],
                onClickButton: null
            },
        }

        this.props = props;
    }

    componentDidMount() {
        this.state.content = HistoryResource.menu.센서_탐지_이력;
        this.initLoadData();

        // 사용중인 센서 타입 초기화
        this.initUseSensorTypes();

        this.unsubscribe_SettingsStore = SettingsStore.subscribe(function () {
            let data = SettingsStore.getState();

           if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                // 사용중인 센서타입 reload
                this.reloadUseSensorTypes(data.sdmsCommonSettings);
           } else if (data.actionType === 'SELECT_SITEID') {
                this.changeSelectSiteID(data.selectSiteID);
            }

        }.bind(this));

    }

    componentWillUnmount() {
        this.unsubscribe_SettingsStore();
	}

    async initSiteID() {
		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		let siteID = null;
		
		if (userInfo.siteID) {
            siteID = userInfo.siteID;
        } else if (ProjectResource.SiteID) {
            siteID = ProjectResource.SiteID;
        }

		this.state.selectedSiteID = siteID;

        return siteID;
	}

    changeSelectSiteID = (siteID) => {
        const selectSiteID = this.state.selectSiteID;

        if (siteID && siteID !== selectSiteID) {
            this.setState({selectedSiteID: siteID});
		}
    }

    async initLoadData() {
        const siteID = await this.initSiteID();

        this.loadSpatialData(siteID);
    }

    async loadSpatialData(siteID) {

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList();
        const sensorTypes = await SDMSController.requestBusanSdmsOptions();
        
        let etcSensorList = await SDMSController.requestSensorList();
        if (etcSensorList) {
            etcSensorList = etcSensorList[0].etcSensors;
        }
        let sensorList = await SDMSController.requestAllSensors();
        if (sensorList) {
            sensorList = sensorList[0];
        }
        
        const externalSensors = await SDMSController.requestExternalSensors();
        const externalSensorTypes = await SDMSController.requestExternalSensorTypes();
        const [materials, message] = await SDMSController.requestMaterials();
        const externalMaterials = await SDMSController.requestExternalMaterials();
        
        this.setState({ buildingGroupList, sensorTypes, etcSensorList, sensorList, externalSensors, externalSensorTypes, materials, externalMaterials });
    }

    initUseSensorTypes = () => {
        const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

        if (sdmsCommonSettings) {
            this.reloadUseSensorTypes(sdmsCommonSettings);
        }
    }

    reloadUseSensorTypes = (sdmsCommonSettings) => {
        let data = sdmsCommonSettings;
        let useSensorTypes = this.state.useSensorTypes;

        if (data?.UseFire !== undefined ||
            data?.UsePSM !== undefined ||
            data?.UseETC !== undefined ||
            data?.UseSVMS !== undefined ||
            data?.UseEarthquake !== undefined ||
            data?.UseStrongWind !== undefined ||
            data?.UseBlackOut !== undefined ||
            data?.UseBecon !== undefined ||
            data?.UseEnvironment !== undefined ||
            data?.UseManufacture !== undefined) {

            let sensorTypes = new Object();
            sensorTypes.UseFire = false;
            sensorTypes.UsePSM = false;
            sensorTypes.UseETC = false;
            sensorTypes.UseSVMS = false;
            sensorTypes.UseEarthquake = false;
            sensorTypes.UseStrongWind = false;
            sensorTypes.UseBlackOut = false;
            sensorTypes.UseBecon = false;
            sensorTypes.UseEnvironment = false;
            sensorTypes.UseManufacture = false;

            if (data.UseFire === "true")
                sensorTypes.UseFire = true;
            if (data.UsePSM === "true")
                sensorTypes.UsePSM = true;
            if (data.UseETC === "true")
                sensorTypes.UseETC = true;
            if (data.UseSVMS === "true")
                sensorTypes.UseSVMS = true;
            if (data.UseEarthquake === "true")
                sensorTypes.UseEarthquake = true;
            if (data.UseStrongWind === "true")
                sensorTypes.UseStrongWind = true;
            if (data.UseBlackOut === "true")
                sensorTypes.UseBlackOut = true;
            if (data.UseBecon === "true")
                sensorTypes.UseBecon = true;
            if (data.UseEnvironment === "true")
                sensorTypes.UseEnvironment = true;
            if (data.UseManufacture === "true")
                sensorTypes.UseManufacture = true;

            if (useSensorTypes === null ||
                useSensorTypes.UseFire !== data.UseFire ||
                useSensorTypes.UsePSM !== data.UsePSM ||
                useSensorTypes.UseETC !== data.UseETC ||
                useSensorTypes.UseSVMS !== data.UseSVMS ||
                useSensorTypes.UseEarthquake !== data.UseEarthquake ||
                useSensorTypes.UseStrongWind !== data.UseStrongWind ||
                useSensorTypes.UseBlackOut !== data.UseBlackOut ||
                useSensorTypes.UseBecon !== data.UseBecon ||
                useSensorTypes.UseEnvironment !== data.UseEnvironment ||
                useSensorTypes.UseManufacture !== data.UseManufacture) {

                this.setState({ useSensorTypes: sensorTypes });
            }
        }
    }

    changeContent = (content, param) => {
        if (content === HistoryResource.menu.SOP_이력 && param && param.beginTime && param.actionStepHistoryID) {
            this.setState({ content, linkSOP: param });
        }
        else {
            this.setState({ content, linkSOP: null });
        }
    }

    getMenuUI() {
        let menu = [];

        const userInfo = ProjectResource.getUserInfo();
        const useEquipZoneAssess = (userInfo?.options?.ui?.useEquipZoneAssess === true);

        if (ProjectResource.SiteID === ProjectResource.Site.Tlb) {
            menu.push(<SOPHistory key='history_SOPHistory' changeContent={this.changeContent} linkSOP={this.state.linkSOP} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />);
        }
        else {
            if (this.state.content === HistoryResource.menu.센서_탐지_이력) {
                menu.push(<SensorDetectHistory key='history_SensorDetectHistory' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} displayLinkSOP={this.displayLinkSOP} useSensorTypes={this.state.useSensorTypes} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} sensorTypes={this.state.sensorTypes} />);
            }
            else if (this.state.content === HistoryResource.menu.센서_탐지_분석) {
                menu.push(<SensorDetectAnalysis key='history_SensorDetectAnalysis' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} useSensorTypes={this.state.useSensorTypes} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />)
            }
            else if (this.state.content === HistoryResource.menu.SOP_이력) {
                menu.push(<SOPHistory key='history_SOPHistory' changeContent={this.changeContent} linkSOP={this.state.linkSOP} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />);
            }
            else if (this.state.content === HistoryResource.menu.센서_탐지_차트) {
                menu.push(<ReportHistory key='history_ReportHistory' changeContent={this.changeContent} useEquipZoneAssess={useEquipZoneAssess} />)
            }
            else if (this.state.content === HistoryResource.menu.센서_탐지_통계표) {
                menu.push(<StatisticsHistory key='history_StatisticsHistory' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />)
            }
        }

        return menu;
    }

    getLeftMenu() {
        const menuText = HistoryResource.menu;
        const curContent = this.state.content;
        const userInfo = ProjectResource.getUserInfo();
        const useEquipZoneAssess = (userInfo?.options?.ui?.useEquipZoneAssess === true);

        return (
            <div id={'hsLft'}>
                <ul className={'hslMenu'}>
                    <li className={curContent === menuText.센서_탐지_이력 ? 'on' : ''} onClick={() => this.changeContent(menuText.센서_탐지_이력)}><a>센서 탐지 이력</a></li>
                    <li className={curContent === menuText.센서_탐지_분석 ? 'on' : ''} onClick={() => this.changeContent(menuText.센서_탐지_분석)}><a onClick={() => this.changeContent(menuText.센서_탐지_분석)}>센서 탐지 분석</a></li>
                    <li className={curContent === menuText.센서_탐지_통계표 ? 'on' : ''} onClick={() => this.changeContent(menuText.센서_탐지_통계표)}><a>센서 탐지 통계표</a></li>
                    <li className={curContent === menuText.센서_탐지_차트 ? 'on' : ''} onClick={() => this.changeContent(menuText.센서_탐지_차트)}><a>센서 탐지 차트</a></li>
                    <li className={curContent === menuText.SOP_이력 ? 'on' : ''} onClick={() => this.changeContent(menuText.SOP_이력)}><a>SOP 이력</a></li>
                </ul> 
            </div>
            );
    }

    showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.type = type;
        confirmMessage.messages = messages;
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

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        if (this.wsMgr) {
            if (this.wsMgr.connected) {
                this.wsMgr.sendClosePopup();
            }
        }

        this.setState({ confirmMessage });
    }

    render() {
        const leftMenu = this.getLeftMenu();

        if (this.state.content === HistoryResource.menu.센서_탐지_이력) {
            return (
                <SensorDetectHistoryComponent>
                    {leftMenu}
                    <SensorDetectHistory key='history_SensorDetectHistory' 
                                         changeContent={this.changeContent} 
                                         buildingGroupList={this.state.buildingGroupList} 
                                         displayLinkSOP={this.displayLinkSOP} 
                                         useSensorTypes={this.state.useSensorTypes} 
                                         selectedSiteID={this.state.selectedSiteID} 
                                         sensorTypes={this.state.sensorTypes} 
                                         sensorList={this.state.sensorList} 
                                         etcSensorList={this.state.etcSensorList} 
                                         externalSensors={this.state.externalSensors} 
                                         externalSensorTypes={this.state.externalSensorTypes} />
                </SensorDetectHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.센서_탐지_분석) {
            return (
                <SensorDetectAnalysisComponent>
                    {leftMenu}
                    <SensorDetectAnalysis key='history_SensorDetectAnalysis' 
                                          changeContent={this.changeContent} 
                                          buildingGroupList={this.state.buildingGroupList} 
                                          useSensorTypes={this.state.useSensorTypes} 
                                          selectedSiteID={this.state.selectedSiteID}
                                          sensorTypes={this.state.sensorTypes}
                                          sensorList={this.state.sensorList}
                                          etcSensorList={this.state.etcSensorList}
                                          externalSensors={this.state.externalSensors}
                                          externalSensorTypes={this.state.externalSensorTypes}/>

                    {
                        /* alert창 대신 사용 */
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog
                            type={this.state.confirmMessage.type}
                            messages={this.state.confirmMessage.messages}
                            buttons={this.state.confirmMessage.buttons}
                            onClickButton={this.state.confirmMessage.onClickButton}
                            onCloseConfirmDialog={() => this.onCloseConfirmDialog()}
                        />
                    }
                </SensorDetectAnalysisComponent>
            );
        } else if (this.state.content === HistoryResource.menu.SOP_이력) {
            return (
                <SOPHistoryComponent>
                    {leftMenu}
                    <SOPHistory key='history_SOPHistory' changeContent={this.changeContent} linkSOP={this.state.linkSOP} selectedSiteID={this.state.selectedSiteID} />

                    {
                        /* alert창 대신 사용 */
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog
                            type={this.state.confirmMessage.type}
                            messages={this.state.confirmMessage.messages}
                            buttons={this.state.confirmMessage.buttons}
                            onClickButton={this.state.confirmMessage.onClickButton}
                            onCloseConfirmDialog={() => this.onCloseConfirmDialog()}
                        />
                    }
                </SOPHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.센서_탐지_통계표) {
            return (
                <ReportHistoryComponent>
                    {leftMenu}
                    <ReportHistory key='history_ReportHistory' 
                                   changeContent={this.changeContent}
                                   externalSensors={this.state.externalSensors}
                                   etcSensorList={this.state.etcSensorList}
                                   externalSensorTypes={this.state.externalSensorTypes}
                                   sensorList={this.state.sensorList}
                                   buildingGroupList={this.state.buildingGroupList}
                                   materials={this.state.materials}
                                   externalMaterials={this.state.externalMaterials}
                                   showConfirmDialog={this.showConfirmDialog}
                                   onCloseConfirmDialog={this.onCloseConfirmDialog}
                    />

                    {
                        /* alert창 대신 사용 */
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog
                            type={this.state.confirmMessage.type}
                            messages={this.state.confirmMessage.messages}
                            buttons={this.state.confirmMessage.buttons}
                            onClickButton={this.state.confirmMessage.onClickButton}
                            onCloseConfirmDialog={() => this.onCloseConfirmDialog()}
                        />
                    }
                </ReportHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.센서_탐지_차트) {
            return (
                <StatisticsHistoryComponent>
                    {leftMenu}
                    <StatisticsHistory key='history_StatisticsHistory' 
                                       changeContent={this.changeContent} 
                                       selectedSiteID={this.state.selectedSiteID}
                                       externalSensors={this.state.externalSensors}
                                       etcSensorList={this.state.etcSensorList}
                                       externalSensorTypes={this.state.externalSensorTypes}
                                       sensorList={this.state.sensorList}
                                       buildingGroupList={this.state.buildingGroupList}
                                       materials={this.state.materials}
                                       externalMaterials={this.state.externalMaterials}
                                       showConfirmDialog={this.showConfirmDialog}
                                       onCloseConfirmDialog={this.onCloseConfirmDialog}
                    />

                    {
                        /* alert창 대신 사용 */
                        this.state.confirmMessage.visible &&
                        <ConfirmDialog
                            type={this.state.confirmMessage.type}
                            messages={this.state.confirmMessage.messages}
                            buttons={this.state.confirmMessage.buttons}
                            onClickButton={this.state.confirmMessage.onClickButton}
                            onCloseConfirmDialog={() => this.onCloseConfirmDialog()}
                        />
                    }
                </StatisticsHistoryComponent>
            );
        } 
    }
}

export default History;