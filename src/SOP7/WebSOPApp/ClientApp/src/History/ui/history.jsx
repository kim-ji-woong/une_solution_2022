import React, { Component } from 'react';
import HistoryResource from "../resource/id";
import UserHistory from './userHistory';
import SensorDetectHistory from './SensorDetectHistory';
import SensorDetectAnalysis from './SensorDetectAnalysis';
import SOPHistory from './SOPHistory';
import SpreadHistory from './SpreadHistory';
import SafetyAreaHistory from './SafetyAreaHistory';
import SpeedDetectionHistory from './SpeedDetectionHistory';
import RepeatSpeedSuspect from './RepeatSpeedSuspect';
import { SDMSController } from '../../SDMS/services/sdmsController';
import SettingsStore from '../../Settings/settingsStore';
import ProjectResource from '../../Root/resource/id';
import { UserHistoryComponent, SensorDetectHistoryComponent, SensorDetectAnalysisComponent, SOPHistoryComponent, SpreadHistoryComponent, SafetyAreaHistoryComponent, SpeedDetectionHistoryComponent, RepeatSpeedSuspectComponent } from '../styled/SensorDetectHistoryStyled';
import { i18n, withTranslation } from '../../language/i18n';

class History extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            content: HistoryResource.menu.센서_탐지_이력,
            buildingGroupList: null,

            linkSOP: null,/*{ beginTime: null, actionStepHistoryID: -1 },*/

            prevProps: null,

            useSensorTypes: null,       // 사용 중인 센서 타입  

            selectedSiteID: null,		/* 현재 SiteID */
        }

        this.props = props;
    }

    componentDidMount() {
        const lang = ProjectResource.getLanguage();
        if (lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }
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

        if (siteID === ProjectResource.Site.GG_A) {
            this.state.content = HistoryResource.menu.SOP_이력;
        }

        return siteID;
	}

    changeSelectSiteID = (siteID) => {
        const selectSiteID = this.state.selectedSiteID;
        
        if (siteID && siteID !== selectSiteID) {
            let content = HistoryResource.menu.센서_탐지_이력;

            if (siteID === ProjectResource.Site.GG_A) {
                content = HistoryResource.menu.SOP_이력;
            }

            this.setState({selectedSiteID: siteID, content: content});
		}
    }

    async initLoadData() {
        const siteID = await this.initSiteID();

        this.loadSpatialData(siteID);
    }

    async loadSpatialData(siteID) {
        let siteIDs = null;
        if (siteID) {
            if (siteID === ProjectResource.Site.GG_A) {
                siteIDs = [41, 43, 44, 45, 46, 47];
            }
            else {
                siteIDs = [siteID];
            }
        }

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteIDs);
        
        this.setState({ buildingGroupList });
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
            data?.UseManufacture !== undefined ||
            data?.UseLaser !== undefined ||
            data?.UseDoor !== undefined) {

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
            sensorTypes.UseLaser = false;
            sensorTypes.UseDoor = false;

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
            if (data.UseLaser === "true")
                sensorTypes.UseLaser = true;
            if (data.UseDoor === "true")
                sensorTypes.UseDoor = true;

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
                useSensorTypes.UseManufacture !== data.UseManufacture ||
                useSensorTypes.UseLaser !== data.UseLaser ||
                useSensorTypes.UseDoor !== data.UseDoor) {

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
            if (this.state.content === HistoryResource.menu.데이터_수정_이력) {
                menu.push(<UserHistory key='history_UserHistory' changeContent={this.changeContent} useEquipZoneAssess={useEquipZoneAssess} selectedSiteID={this.state.selectedSiteID} />);
            }
            else if (this.state.content === HistoryResource.menu.센서_탐지_이력) {
                menu.push(<SensorDetectHistory key='history_SensorDetectHistory' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} displayLinkSOP={this.displayLinkSOP} useSensorTypes={this.state.useSensorTypes} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />);
            }
            else if (this.state.content === HistoryResource.menu.센서_탐지_분석) {
                menu.push(<SensorDetectAnalysis key='history_SensorDetectAnalysis' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} useSensorTypes={this.state.useSensorTypes} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />)
            }
            else if (this.state.content === HistoryResource.menu.SOP_이력) {
                menu.push(<SOPHistory key='history_SOPHistory' changeContent={this.changeContent} linkSOP={this.state.linkSOP} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />);
            }
            else if (this.state.content === HistoryResource.menu.상황전파_이력) {
                menu.push(<SpreadHistory key='history_SpreadHistory' changeContent={this.changeContent} useEquipZoneAssess={useEquipZoneAssess} />)
            }
            else if (this.state.content === HistoryResource.menu.안전구역_평가_이력) {
                menu.push(<SafetyAreaHistory key='history_SafetyAreaHistory' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} selectedSiteID={this.state.selectedSiteID} useEquipZoneAssess={useEquipZoneAssess} />)
            }
            else if (this.state.content === HistoryResource.menu.차량과속_이력) {
                menu.push(<SpeedDetectionHistory key='history_SpeedDetectionHistory' changeContent={this.changeContent}  />)
            }
        }

        return menu;
    }

    getLeftMenu() {
        const menuText = HistoryResource.menu;
        const curContent = this.state.content;
        const userInfo = ProjectResource.getUserInfo();
        const useEquipZoneAssess = (userInfo?.options?.ui?.useEquipZoneAssess === true);
        
        let leftUI = null;
        
        //if (ProjectResource.SiteID === ProjectResource.Site.Hydrogen) {
        //    leftUI = 
        //        <>
        //            <ul className={'hslMenu'}>
        //                <li><a onClick={() => this.changeContent(menuText.센서_탐지_이력)} className={curContent === menuText.센서_탐지_이력 && 'on'}>{i18n.t('history.menu.이벤트 이력')}</a></li>
        //                <li><a onClick={() => this.changeContent(menuText.SOP_이력)} className={curContent === menuText.SOP_이력 && 'on'}>{i18n.t('history.menu.SOP 이력')}</a></li>
        //                <li><a onClick={() => this.changeContent(menuText.데이터_수정_이력)} className={curContent === menuText.데이터_수정_이력 && 'on'}>{i18n.t('history.menu.고장 이력')}</a></li>
        //                <li><a onClick={() => this.changeContent(menuText.상황전파_이력)} className={curContent === menuText.상황전파_이력 && 'on'}>{i18n.t('history.menu.점검 이력')}</a></li>
        //            </ul>
        //        </>
        //} else
        if (ProjectResource.SiteID === ProjectResource.Site.CheongSim) {
            leftUI = 
                <>
                    <ul className={'hslMenu'}>
                        <li><a onClick={() => this.changeContent(menuText.센서_탐지_이력)} className={curContent === menuText.센서_탐지_이력 && 'on'}>{i18n.t('history.menu.이벤트 이력')}</a> </li>
                        <li><a onClick={() => this.changeContent(menuText.센서_탐지_분석)} className={curContent === menuText.센서_탐지_분석 && 'on'}>{i18n.t('history.menu.센서 탐지 분석')}</a> </li>
                    </ul>
                </>
        } else if (this.state.selectedSiteID === ProjectResource.Site.GG_A) {
            leftUI = 
                <>
                    <ul className={'hslMenu'}>
                        <li><a onClick={() => this.changeContent(menuText.SOP_이력)} className={curContent === menuText.SOP_이력 && 'on'}>{i18n.t('history.menu.SOP 이력')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.데이터_수정_이력)} className={curContent === menuText.데이터_수정_이력 && 'on'}>{i18n.t('history.menu.데이터 수정 이력')}</a></li>
                    </ul>
                </>
        } else if (ProjectResource.SiteID === ProjectResource.Site.Wonik) {
            leftUI =
                <>
                    <ul className={'hslMenu'}>
                        <li><a onClick={() => this.changeContent(menuText.센서_탐지_이력)} className={curContent === menuText.센서_탐지_이력 && 'on'}>{i18n.t('history.menu.센서 탐지 이력')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.센서_탐지_분석)} className={curContent === menuText.센서_탐지_분석 && 'on'}>{i18n.t('history.menu.센서 탐지 분석')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.SOP_이력)} className={curContent === menuText.SOP_이력 && 'on'}>{i18n.t('history.menu.SOP 이력')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.데이터_수정_이력)} className={curContent === menuText.데이터_수정_이력 && 'on'}>{i18n.t('history.menu.데이터 수정 이력')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.차량과속_이력)} className={curContent === menuText.차량과속_이력 && 'on'}>차량 과속 이력 및 분석</a></li>
                        <li><a onClick={() => this.changeContent(menuText.반복과속_의심차량)} className={curContent === menuText.반복과속_의심차량 && 'on'}>{menuText.반복과속_의심차량}</a></li>
                        {
                            useEquipZoneAssess &&
                            <li><a onClick={() => this.changeContent(menuText.안전구역_평가_이력)} className={curContent === menuText.안전구역_평가_이력 && 'on'}>{i18n.t('history.menu.안전구역 평가 이력')}</a></li>
                        }
                    </ul>
                </>
        } else {
            leftUI =
                <>
                    <ul className={'hslMenu'}>
                        <li><a onClick={() => this.changeContent(menuText.센서_탐지_이력)} className={curContent === menuText.센서_탐지_이력 && 'on'}>{i18n.t('history.menu.센서 탐지 이력')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.센서_탐지_분석)} className={curContent === menuText.센서_탐지_분석 && 'on'}>{i18n.t('history.menu.센서 탐지 분석')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.SOP_이력)} className={curContent === menuText.SOP_이력 && 'on'}>{i18n.t('history.menu.SOP 이력')}</a></li>
                        <li><a onClick={() => this.changeContent(menuText.데이터_수정_이력)} className={curContent === menuText.데이터_수정_이력 && 'on'}>{i18n.t('history.menu.데이터 수정 이력')}</a></li>
                        {/*<li><a onClick={() => this.changeContent(menuText.상황전파_이력)} className={curContent === menuText.상황전파_이력 && 'on'}>{i18n.t('history.menu.상황전파 이력')}</a></li>*/}
                        {
                            useEquipZoneAssess &&
                            <li><a onClick={() => this.changeContent(menuText.안전구역_평가_이력)} className={curContent === menuText.안전구역_평가_이력 && 'on'}>{i18n.t('history.menu.안전구역 평가 이력')}</a></li>
                        }
                    </ul>
                </>
        }
        
        let hsLftDiv =
            <div id={'hsLft'}>
                {leftUI}
            </div>;
        
        return hsLftDiv;
    }

    render() {
        const leftMenu = this.getLeftMenu();

        if (this.state.content === HistoryResource.menu.데이터_수정_이력) {
            return (
                <UserHistoryComponent id={'hsback'}>
                    {
                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                        <div className={'teamEditorName'}><span>{i18n.t('history.headTitle.이력관리')}</span></div>
                    }
                    {leftMenu}
                    <UserHistory key='history_UserHistory' changeContent={this.changeContent} selectedSiteID={this.state.selectedSiteID} />
                </UserHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.센서_탐지_이력) {
            return (
                <SensorDetectHistoryComponent>
                    {
                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                        <div className={'teamEditorName'}><span>{i18n.t('history.headTitle.이력관리')}</span>{/* <span className={'teamEditorNameIcon'}></span> */}</div>
                    }
                    {leftMenu}
                    <SensorDetectHistory key='history_SensorDetectHistory' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} displayLinkSOP={this.displayLinkSOP} useSensorTypes={this.state.useSensorTypes} selectedSiteID={this.state.selectedSiteID} />
                </SensorDetectHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.센서_탐지_분석) {
            return (
                <SensorDetectAnalysisComponent id={'hsback'}>
                    {leftMenu}
                    <SensorDetectAnalysis key='history_SensorDetectAnalysis' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} useSensorTypes={this.state.useSensorTypes} selectedSiteID={this.state.selectedSiteID} />
                </SensorDetectAnalysisComponent>
            );
        } else if (this.state.content === HistoryResource.menu.SOP_이력) {
            return (
                <SOPHistoryComponent id={'hsback'}>
                    {
                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                        <div className={'teamEditorName'}><span>{i18n.t('history.headTitle.이력관리')}</span></div>
                    }
                    {leftMenu}
                    <SOPHistory key='history_SOPHistory' changeContent={this.changeContent} linkSOP={this.state.linkSOP} selectedSiteID={this.state.selectedSiteID} />
                </SOPHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.상황전파_이력) {
            return (
                <SpreadHistoryComponent id={'hsback'}>
                    {
                        ProjectResource.styleMode === ProjectResource.StyleType.Hydrogen &&
                        <div className={'teamEditorName'}><span>{i18n.t('history.headTitle.이력관리')}</span>{/* <span className={'teamEditorNameIcon'}></span> */}</div>
                    }
                    {leftMenu}
                    <SpreadHistory key='history_SpreadHistory' changeContent={this.changeContent} />
                </SpreadHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.안전구역_평가_이력) {
            return (
                <SafetyAreaHistoryComponent id={'hsback'}>
                    {leftMenu}
                    <SafetyAreaHistory key='history_SafetyAreaHistory' changeContent={this.changeContent} buildingGroupList={this.state.buildingGroupList} selectedSiteID={this.state.selectedSiteID} />
                </SafetyAreaHistoryComponent>
                );
        } else if (this.state.content === HistoryResource.menu.차량과속_이력) {
            return (
                <SpeedDetectionHistoryComponent id={'hsback'}>
                    {leftMenu}
                    <SpeedDetectionHistory key='history_SpeedDetectionHistory' />
                </SpeedDetectionHistoryComponent>
            );
        } else if (this.state.content === HistoryResource.menu.반복과속_의심차량) {
            return (
                <RepeatSpeedSuspectComponent id={'hsback'}>
                    {leftMenu}
                    <RepeatSpeedSuspect key='history_RepeatSpeedSuspect' selectedSiteID={this.state.selectedSiteID} />
                </RepeatSpeedSuspectComponent>
            );
        }
        //const menuUI = this.getMenuUI();
        //return (
        //    <>
        //        {menuUI}
        //    </>
        //);
    }
}

export default withTranslation()(History);