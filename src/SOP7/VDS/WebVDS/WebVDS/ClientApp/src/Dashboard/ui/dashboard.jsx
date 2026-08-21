import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';

import VDCList from '../../Dashboard/ui/vdsList';
import GeneralInfoBox from '../../Dashboard/ui/generalInfo';
import DashboardEvent from '../../Dashboard/ui/dashboardEvent';
import MapBox from '../../Dashboard/ui/mapBox';
import VDCUsage from '../../Dashboard/ui/vdcUsage';
import VDCSummary from '../../Dashboard/ui/vdcSummary';
import VDCPropertyInfo from '../../Dashboard/ui/vdcPropertyInfo';
import VDCProSummary from '../../Dashboard/ui/vdcProSummary';
import ChangeInfo from '../../Dashboard/ui/changeInfo';

import TitleBar from '../../Root/titleBar';
import uis from '../../Common/css/ui.module.css';
import DashboardController from '../services/dashboardController';
import DashboardDataManager from '../services/dashboardDataManager';
import ProjectResource from '../../Root/resource/id';
//import Management from './management/management';
import ConfirmDialog from '../../Common/ui/confirmDialog';

//import VDCNewRegistration from './management/vdcNewRegistration';
import CommonResource from '../../Common/resource/id';
import ManagementController from '../../Management/services/managementController';


class Dashboard extends Component {
    static mode = {
        none: 0,
        management: 1,
        newRegister: 2
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            nations: [],
            sites: {},
            siteChangeDatas: [],
            siteFaultDatas: [],
            dataCenters: {},
            selectedCenter: null,
            selectedNation: null,
            selectedSite: null,

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },

            statistics: null
        }

        this.mapBox = null;
        this.vdcList = null;
    }

    componentDidMount() {
        this.initDatas();
    }

    componentDidUpdate() {
        if (this.props.getRefreshSites()) {
            this.initDatas();
        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
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

        this.setState({ confirmMessage });
    }

    async initDatas() {
        const user = ProjectResource.getUserInfo();

        if (!user) {
            return;
        }

        const [result, ] = await DashboardController.requestSiteWorkData(user.userData?.siteID);

        let [nations, errorMessage] = await DashboardController.requestCountries();

        if (!nations) {
            //alert(errorMessage);
            this.showConfirmDialog("에러", [errorMessage], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }
        else {
            let [dataCenters, errorMessage] = await DashboardController.requestDataCenters(user.id);

            if (!dataCenters) {
                user.dataCenters = [];
                //alert(errorMessage);
                this.showConfirmDialog("에러", [errorMessage], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
            else {
                user.dataCenters = [];

                for (const dataCenter of dataCenters) {
                    const center = { ...dataCenter };

                    delete center.data;
                    delete center.nation;
                    delete center.site;

                    user.dataCenters.push(center);
                }

                const sites = {};

                if (dataCenters.length === 0) {
                    const [site, message] = await ManagementController.requestSite(user.userData.siteID);

                    if (site === null) {
                        this.alertMessage(message);
                    }
                    else {
                        sites[ProjectResource.getSiteName(site)] = site;

                        if (result) {
                            this.setState({ siteChangeDatas: result.changeDatas, siteFaultDatas: result.faultDatas, loading: false, nations, dataCenters: {}, sites });
                        }
                        else {
                            this.setState({ loading: false, nations, dataCenters: {}, sites });
                        }
                    }
                }
                else {
                    const _dataCenters = DashboardDataManager.rebuildDataCenters(dataCenters, sites);

                    if (result) {
                        this.setState({ siteChangeDatas: result.changeDatas, siteFaultDatas: result.faultDatas, loading: false, nations, dataCenters: _dataCenters, sites });
                    }
                    else {
                        this.setState({ loading: false, nations, dataCenters: _dataCenters, sites });
                    }
                }
            }
        }
    }

    reloadDatas() {
        this.setState({ loading: true });
        this.initDatas();
    }

    selectDataCenter = (dataCenter) => {
        if (this.state.selectedCenter !== dataCenter) {
            this.setState({ selectedCenter: dataCenter, selectedNation: ProjectResource.getDataCenterName(dataCenter?.nation), selectedSite: dataCenter?.site/*ProjectResource.getSiteName(dataCenter?.site)*/ });

            this.getStatistics(dataCenter);

            // 0.5초후 Tree를 강제로 펼치게 한다.
            if (dataCenter && this.vdcList) {
                setTimeout(() => VDCList.expandSelectedDataCenter(this.vdcList, dataCenter), 500);
            }
        }
    }

    async getStatistics(dataCenter) {
        if (!dataCenter) {
            this.setState({ statistics: null });
        }
        else {
            const [statistics,] = await DashboardController.requestVdcStatistics(dataCenter.id);

            if (statistics) {
                this.setState({ statistics });
            }
        }
    }

    getSite(siteName) {
        if (siteName) {
            return this.state.sites[siteName];
        }

        return null;
    }

    selectNation = (nation, nationName, siteName) => {
        let selectedCenter = null;

        if (this.state.selectedCenter?.nation === nation) {
            if (this.state.selectedCenter?.site.name === siteName || this.state.selectedCenter?.site.engName === siteName) {
                selectedCenter = this.state.selectedCenter;
            }
        }

        this.setState({ selectedCenter: selectedCenter, selectedNation: nationName, selectedSite: this.getSite(siteName) });

        if (this.mapBox && nation) {
            this.mapBox.goNation(nation);
        }
    }

    selectSite = (siteName) => {
        const site = this.getSite(siteName);

        if (this.state.selectedSite !== site) {
            this.setState({ selectedCenter: null, selectedNation: null, selectedSite: site });
        }
    }

    setMapBox = (mapBox) => {
        this.mapBox = mapBox;
    }

    setVdcList = (vdcList) => {
        this.vdcList = vdcList;
    }

    goHome = () => {
        this.setState({ selectedCenter: null, selectedNation: null, selectedSite: null });

        if (this.mapBox) {
            this.mapBox.goHome();
        }
    }

    getMainSiteName() {
        if (this.state.selectedSite) {
            return [ProjectResource.getSiteName(this.state.selectedSite), this.state.selectedSite];
        }

        if (!this.state.dataCenters) {
            return ["", null];
        }

        const dataCenters = { ...this.state.dataCenters };

        for (const siteName in dataCenters) {
            return [siteName, this.getSite(siteName)];
        }

        const sites = { ...this.state.sites };

        for (const siteName in sites) {
            return [siteName, sites[siteName]];
        }

        return ["", null];
    }

    render() {
        if (this.state.loading) {
            return <></>
        }

        const [selectedSiteName, site] = this.getMainSiteName();

        return (
            <>
                <div className={uis.headerBox + " " + CommonResource.UISection}>
                    {
                        !this.props.isNewRegist &&
                        <span className={uis.vdsLogoBox + " " + CommonResource.UISection} style={{ position: 'absolute', left: '40px', top: '4px' }} onClick={() => this.goHome()}><p className={uis.vdsLogo}></p></span>
                    }
                    {
                        !this.props.isNewRegist &&
                        <span className={uis.lgTitle} style={{ position: 'absolute', left: '140px', top: '0px' }}>{selectedSiteName}</span>
                    }
                </div>
                <TitleBar menuEvent={this.props.menuEvent} target={this.props.target} site={site} dataCenter={this.props.dataCenter} style={{ position: 'absolute', right: '0px', top: '0px' }} mode={TitleBar.modeDashboard} wsManager={this.props.wsManager} onChangeMode={this.props.onChangeMode} makeParameter={this.props.makeParameter} dashboard={this} setNewRegistMode={this.props.setNewRegistMode} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} closeRootMessageBox={this.props.closeRootMessageBox} showRootMessageBox={this.props.showRootMessageBox} getCameraOnOff={this.props.getCameraOnOff} setCameraOnOff={this.props.setCameraOnOff} getSensorOnOff={this.props.getSensorOnOff} setSensorOnOff={this.props.setSensorOnOff} />
                {
                    !this.props.isNewRegist &&
                    <div className={dash.dashBoardContainerVDS}>
                        <div className={dash.firstBox}>
                            <VDCList className={dash.vdsListBox}
                                dataCenters={this.state.dataCenters}
                                selectedCenter={this.state.selectedCenter}
                                selectedNation={this.state.selectedNation}
                                selectedSite={selectedSiteName}
                                selectDataCenter={this.selectDataCenter}
                                selectNation={this.selectNation}
                                selectSite={this.selectSite}
                                setVdcList={this.setVdcList}
                                onChangeMode={this.props.onChangeMode}
                                makeParameter={this.props.makeParameter}
                            />
                            <GeneralInfoBox className={dash.generalInfoBox} selectedCenter={this.state.selectedCenter} dataCenters={this.state.dataCenters} site={site} />
                        </div>
                        <div className={dash.secondBox}>
                            <DashboardEvent className={dash.dashboardEvent} selectedNation={this.state.selectedNation} selectedCenter={this.state.selectedCenter} />
                            <MapBox className={dash.mapBox}
                                nations={this.state.nations}
                                dataCenters={this.state.dataCenters}
                                selectedSite={selectedSiteName}
                                selectedCenter={this.state.selectedCenter}
                                setMapBox={this.setMapBox}
                                goHome={this.goHome}
                                selectDataCenter={this.selectDataCenter}
                                selectNation={this.selectNation}
                                onChangeMode={this.props.onChangeMode}
                                makeParameter={this.props.makeParameter}
                            />
                        </div>
                        <div className={dash.thirdBox}>
                            {
                                !this.state.selectedCenter &&
                                <>
                                    <VDCSummary className={dash.vdcSummary} dataCenters={this.state.dataCenters} /> {/* 사용량 요약정보 */}
                                    <VDCProSummary className={dash.vdcProSummary} dataCenters={this.state.dataCenters} /> {/* 자산 요약정보 */}
                                </>
                            }
                            {
                                this.state.selectedCenter &&
                                <>
                                    <VDCUsage className={dash.vdcUsage} selectedCenter={this.state.selectedCenter} statistics={this.state.statistics} /> {/* VDC 사용량 */}
                                    <VDCPropertyInfo className={dash.vdcPropertyInfo} selectedCenter={this.state.selectedCenter} statistics={this.state.statistics} /> {/* VDC 자산정보 */}
                                </>
                            }
                            <ChangeInfo className={dash.changeInfo} changeDatas={this.state.siteChangeDatas} faultDatas={this.state.siteFaultDatas} />
                        </div>

                        {
                            /* 관리페이지 */
                            /*this.props.subMode && this.props.subMode === Dashboard.mode.management &&
                            <Management />*/
                        }
                        {
                            /* VDC 신규등록 페이지 */
                            /*this.props.subMode && this.props.subMode === Dashboard.mode.newRegister &&
                            <VDCNewRegistration dataCenter={this.props.dataCenter} prevMode={this.props.prevMode} onChangeMode={this.props.onChangeMode} makeParameter={this.props.makeParameter} />*/
                        }

                    </div>
                }
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }
            </>
        );
    }
}

export default Dashboard;