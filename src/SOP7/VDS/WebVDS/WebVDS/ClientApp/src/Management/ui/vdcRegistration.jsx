import React, { Component } from 'react';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';
import ManagementController from '../services/managementController';
import TitleBar from '../../Root/titleBar';
import wsManager from '../../Root/services/wsManager';
import { AccountController } from '../../Account/services/accountController';
import UserRightsEditManager from './userRightsEditManager';


class VDCRegistration extends Component {
    static all_id = "0";

    constructor(props) {
        super(props);

        this.state = {
            selectedSite: null,
            selectedNation: null,
            selectedCenterType: null,
            selectedUnit: null
        }

        this.sites = {};
        this.nations = {};
        
        this.refCompany = React.createRef();
        this.refSelectNation = React.createRef();
        //this.refSelectDataCenter = React.createRef();
        this.refSelectDataCenterType = React.createRef();
        this.refVdcName = React.createRef();
        this.refLatitude = React.createRef();
        this.refLongitude = React.createRef();
        this.refWidth = React.createRef();
        this.refHeight = React.createRef();
        this.refDepth = React.createRef();
        this.refStartX = React.createRef();
        this.refStartY = React.createRef();
        this.refBottomElevation = React.createRef();
        this.refSelectUnit = React.createRef();
        this.refHour = React.createRef();
        this.refMin = React.createRef();
        this.refTeam = React.createRef();
        this.refManager = React.createRef();

        this.isMount = true;
    }

    componentDidMount() {
        for (const nation of this.props.allNations) {
            this.nations[nation.id] = nation;

        }
        const site = this.getFirstSite(this.props.sites);

        if (site) {
            const _site = this.makeSite(site, this.nations);
            this.sites[ProjectResource.getSiteName(site)] = _site;

            let nation = this.getFirstNation(_site);

            if (nation) {
                this.refSelectNation.current.value = nation.id.toString();
            }
            else {
                nation = this.nations[this.refSelectNation.current.value];
            }

            const unit = this.refSelectUnit.current.value;
            const dataCenterType = this.refSelectDataCenterType.current.value;

            this.setState({ selectedSite: _site, selectedNation: nation, selectedCenterType: dataCenterType, selectedUnit: unit });
        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    getFirstSite(sites) {
        for (const site of sites) {
            return site;
        }

        return null;
    }

    getFirstNation(site) {
        for (const dataCenter of site.dataCenters) {
            const nation = this.nations[dataCenter.nationID];

            if (nation) {
                return nation;
            }
        }

        return null;
    }

    componentWillUnmount() {
        this.isMount = false;
    }

    _setState(state) {
        if (this.isMount) {
            this.setState(state);
        }
    }

    makeSite(site, nations) {
        const _site = { ...site };
        _site.nations = [];

        for (const dataCenter of site.dataCenters) {
            const nation = nations[dataCenter.nationID];

            if (nation) {
                _site.nations.push(nation);
            }
        }

        return _site;
    }

    getSiteElements() {
        const elements = [];

        elements.push(
            <span>VDC소속사</span>
        );

        //const options = [];

        /* for (const site of this.props.sites) {
            const siteName = ProjectResource.getSiteName(site);
            options.push(<option value={siteName}>{siteName}</option>);
        } */

        elements.push(
            <input type="text" ref={this.refCompany} onChange={(e) => this.onSelectSite(e)} />
             /*  {
                    options
             } */
        );

        return elements;
    }

    onSelectSite(e) {
        const site = this.sites[e.target.value];

        if (site && site !== this.state.site) {
            this.setState({ selectedSite: site });
        }
    }

    getNationElements() {
        const elements = [];

        elements.push(
            <span>국가</span>
        );

        const options = [];

        /*const selectedSite = this.state.selectedSite;

        if (selectedSite) {
            if (selectedSite.nations.length > 0) {
                //options.push(<option value={VDCRegistration.all_id}>{ProjectResource.ID.management.select.all}</option>);

                for (const nation of selectedSite.nations) {
                    options.push(<option value={nation.id}>{ProjectResource.getNationName(nation)}</option>);
                }
            }
        }
        else {*/
            //options.push(<option value={VDCRegistration.all_id}>{ProjectResource.ID.management.select.all}</option>);

            for (const nation of this.props.allNations) {
                options.push(<option value={nation.id}>{ProjectResource.getNationName(nation)}</option>);
            }
        //}

        elements.push(
            <select ref={this.refSelectNation} onChange={(e) => this.onSelectNation(e)}>
                {
                    options
                }
            </select>
        );

        return elements;
    }

    onSelectNation(e) {
        const nation = this.nations[e.target.value];

        if (nation && nation !== this.state.selectedNation) {
            this.setState({ selectedNation: nation });
        }
    }

    onSelectDataCenterType(e) {
        this.setState({ selectedCenterType: e.target.value });
    }

    onSelectUnit(e) {
        this.setState({ selectedUnit: e.target.value });
    }

    /*getDataCenterElements() {
        const elements = [];

        elements.push(
            <span>VDC명</span>
        );

        const options = [];

        const selectedSite = this.state.selectedSite;
        const selectedNation = this.state.selectedNation;

        if (selectedSite && selectedNation) {
            if (selectedNation === ProjectResource.ID.management.select.all) {
                if (selectedSite.dataCenters.length > 0) {
                    options.push(<option>{ProjectResource.ID.management.select.all}</option>);

                    for (const dataCenter of selectedSite.dataCenters) {
                        options.push(<option>{ProjectResource.getDataCenterName(dataCenter)}</option>);
                    }
                }
            }
            else {
                for (const dataCenter of selectedSite.dataCenters) {
                    const nation = this.nations[dataCenter.nationID];

                    if (nation && ProjectResource.getNationName(nation) === selectedNation) {
                        if (options.length === 0) {
                            options.push(<option>{ProjectResource.ID.management.select.all}</option>);
                        }

                        options.push(<option>{ProjectResource.getDataCenterName(dataCenter)}</option>);
                    }
                }
            }
        }
        else {
            const dataCenters = [];

            for (const site of this.props.sites) {
                for (const dataCenter of site.dataCenters) {
                    dataCenters.push(dataCenter);
                }
            }

            if (dataCenters.length > 0) {
                options.push(<option>{ProjectResource.ID.management.select.all}</option>);

                for (const dataCenter of dataCenters) {
                    options.push(<option>{ProjectResource.getDataCenterName(dataCenter)}</option>);
                }
            }
        }

        elements.push(
            <select ref={this.refSelectNation}>
                {
                    options
                }
            </select>
        );

        return elements;
    }*/

    getDataCenterTypeElements() {
        const elements = [];

        elements.push(
            <span>DC시설구분</span>
        );

        const options = [];
        options.push(<option value={ProjectResource.ID.management.dataCenterType.own}>{ProjectResource.ID.management.dataCenterType.own}</option>);
        options.push(<option value={ProjectResource.ID.management.dataCenterType.rent}>{ProjectResource.ID.management.dataCenterType.rent}</option>);

        elements.push(
            <select ref={this.refSelectDataCenterType} onChange={(e) => this.onSelectDataCenterType(e)}>
                {
                    options
                }
            </select>
        );

        return elements;
    }

    getValidLatitude() {
        const latitude = this.refLatitude.current.value.trim();

        if (latitude.length === 0) {
            return null;
        }

        const lat = parseFloat(latitude);

        if (isNaN(lat)) {
            return null;
        }

        if (lat < -90 || lat > 90) {
            return null;
        }

        return lat;
    }

    getValidLongitude() {
        const longitude = this.refLongitude.current.value.trim();

        if (longitude.length === 0) {
            return null;
        }

        const lon = parseFloat(longitude);

        if (isNaN(lon)) {
            return null;
        }

        if (lon < -180 || lon > 180) {
            return null;
        }

        return lon;
    }

    getValidWDH(element) {
        const length = element.value.trim();

        if (length.length === 0) {
            return null;
        }

        const len = parseFloat(length);

        if (isNaN(len)) {
            return null;
        }

        if (len < 0) {
            return null;
        }

        return len;
    }

    getValidUnsignedInt(element) {
        const data = element.value.trim();

        if (data.length === 0) {
            return null;
        }

        const dat = parseInt(data);

        if (data.includes(".")) {
            return null;
        }

        if (isNaN(dat)) {
            return null;
        }

        if (dat < 0) {
            return null;
        }

        return dat;
    }

    async onClickCreate() {
        const selectedSite = this.state.selectedSite;

        if (!selectedSite) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.selectSite);
            return;
        }

        const company = this.refCompany.current.value ? this.refCompany.current.value.trim() : "";

        if (company.length === 0) {
            this.refCompany.current.focus();
            this.props.alertMessage("VDC 소속사를 입력하세요.");
            return;
        }

        const nation = this.state.selectedNation;
        const centerType = this.state.selectedCenterType;
        const unit = this.state.selectedUnit;

        const vdcName = this.refVdcName.current.value.trim();

        if (vdcName.length === 0) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputVdcName);
            return;
        }

        const latitude = this.getValidLatitude();

        if (latitude !== 0 && !latitude) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputLatitude);
            return;
        }

        const longitude = this.getValidLongitude();

        if (longitude !== 0 && !longitude) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputLongitude);
            return;
        }

        let width = this.getValidWDH(this.refWidth.current);

        if (width !== 0 && !width) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputWidth);
            return;
        }
        else {
            width = this.toMillimeter(width, unit);
        }

        let depth = this.getValidWDH(this.refDepth.current);

        if (depth !== 0 && !depth) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputDepth);
            return;
        }
        else {
            depth = this.toMillimeter(depth, unit);
        }

        let height = this.getValidWDH(this.refHeight.current);

        if (height !== 0 && !height) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputHeight);
            return;
        }
        else {
            height = this.toMillimeter(height, unit);
        }

        const startX = this.getValidUnsignedInt(this.refStartX.current);

        if (startX !== 0 && !startX) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputStartX);
            return;
        }

        const startY = this.getValidUnsignedInt(this.refStartY.current);

        if (startY !== 0 && !startY) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputStartY);
            return;
        }

        const bottomElevation = this.getValidWDH(this.refBottomElevation.current);

        if (!bottomElevation) {
            this.props.alertMessage(ProjectResource.ID.management.errorMessage.inputBottomElevation);
            return;
        }

        const teamName = this.refTeam.current.value.trim();
        const managerName = this.refManager.current.value.trim();

        const vdcTime = this.getUTC();
        const [result, errorMessage] = await ManagementController.requestAddDataCenter(selectedSite.id, nation.id, vdcName, centerType, latitude, longitude, width, depth, height, startX, startY, bottomElevation, vdcTime, null, false, null, teamName, managerName, company);

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
        else {
            const user = ProjectResource.getUserInfo();

            if (user?.dataCenters) {
                user.dataCenters.push(result);

                const userDatas = [];
                UserRightsEditManager.addUserData(user, userDatas);

                const [success, errorMessage] = await AccountController.requestUpdateAccountUsers2(userDatas);

                if (success) {
                    ProjectResource.setLoginUser(user);
                }
            }

            const site = { ...selectedSite };
            site.dataCenters = [];
            delete site["nations"];
            result.site = site;

            const prevMode = this.props.wsManager.currentViewMode;
            this.props.wsManager.changeMode(wsManager.mode3D.newRegist, result.id);

            this.props.setCameraOnOff(1);
            this.props.setSensorOnOff(1);

            this.props.setRefreshSites();

            const param = [TitleBar.mode.newRegist, result, prevMode];
            this.props.onClose(param);
        }
    }

    getUTC() {
        const hour = parseInt(this.refHour.current.value);
        let min = parseInt(this.refMin.current.value);

        if (min === 15) {
            min = 0.25;
        }
        else if (min === 30) {
            min = 0.5;
        }
        else if (min === 45) {
            min = 0.75;
        }

        return hour + min;
    }

    toMillimeter(length, unitType) {
        if (unitType === "m") {
            return length * 1000;
        }
        else if (unitType == "cm") {
            return length * 10;
        }

        return length;
    }

    getLocalUTC() {
        const date = new Date();
        const current = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

        const timeSpan = date - current;
        const time = timeSpan / 1000 / 3600;

        const hour = parseInt(time);
        let min = time - hour;

        if (min > -0.01 && min < 0.01) {
            min = 0;
        }
        else if (min > 0.24 && min < 0.26) {
            min = 15;
        }
        else if (min > 0.49 && min < 0.51) {
            min = 30;
        }
        else if (min > 0.74 && min < 0.76) {
            min = 45;
        }
        else {
            min = 0;
        }

        return [hour, min];
    }

    render() {
        const [localHour, localMin] = this.getLocalUTC();

        return (
            <>
                <div style={{ display: 'flex' }}>
                    <span className={dash.userRightTitle}>VDC 신규등록</span>
                    <span className={dash.managementClose} onClick={() => this.props.onClose()}></span>
                </div>

                <div style={{ display: 'flex' }}>
                    <div className={dash.agencyBox}>
                        {
                            this.getSiteElements()
                        }
                    </div>

                    <div className={dash.vdcTimeBox}>
                       <span>VDC 시간</span>
                        <span>UTC</span>
                        <select ref={this.refHour} defaultValue={localHour}>
                            <option value={-12}>- 12 hr</option>
                            <option value={-11}>- 11 hr</option>
                            <option value={-10}>- 10 hr</option>
                            <option value={-9}>- 09 hr</option>
                            <option value={-8}>- 08 hr</option>
                            <option value={-7}>- 07 hr</option>
                            <option value={-6}>- 06 hr</option>
                            <option value={-5}>- 05 hr</option>
                            <option value={-4}>- 04 hr</option>
                            <option value={-3}>- 03 hr</option>
                            <option value={-2}>- 02 hr</option>
                            <option value={-1}>- 01 hr</option>
                            <option value={0}>00 hr</option>
                            <option value={1}>+ 01 hr</option>
                            <option value={2}>+ 02 hr</option>
                            <option value={3}>+ 03 hr</option>
                            <option value={4}>+ 04 hr</option>
                            <option value={5}>+ 05 hr</option>
                            <option value={6}>+ 06 hr</option>
                            <option value={7}>+ 07 hr</option>
                            <option value={8}>+ 08 hr</option>
                            <option value={9}>+ 09 hr</option>
                            <option value={10}>+ 10 hr</option>
                            <option value={11}>+ 11 hr</option>
                            <option value={12}>+ 12 hr</option>
                            <option value={13}>+ 13 hr</option>
                            <option value={14}>+ 14 hr</option>
                        </select>
                        <select ref={this.refMin} defaultValue={localMin}>
                            <option value={0}>00 min</option>
                            <option value={15}>15 min</option>
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                        </select>
                    </div>

                    <div className={dash.adminBox}>
                        <span>담당 Admin</span>
                        <span><input ref={this.refTeam} type="text" placeholder="소속" /></span>
                        <span><input ref={this.refManager} type="text" placeholder="이름" /></span>
                    </div>
                 </div>

                <div style={{ display: 'flex' }}>
                    <div className={dash.managementFlexArea}>
                        <div className={dash.managementFlex1R}>
                            <div className={dash.nationBoxR}>
                                {
                                    this.getNationElements()
                                }
                            </div>
                            <div className={dash.nameVDSBox}>
                                {
                                /*this.getDataCenterElements()*/
                                }
                                <span>VDC명</span>
                                <input ref={this.refVdcName} type="text" placeholder="VDC명을 입력해주세요." autoFocus />
                            </div>
                            <div className={dash.kindVDSBoxR}>
                                {
                                    this.getDataCenterTypeElements()
                                }
                            </div>
                        </div>
                        <div className={dash.managementFlex2R}>
                            <div className={dash.locationBox}>
                                <span>위치</span>
                                <div className={dash.locationInputBox}>
                                  <div style={{ display: 'block', borderRight: 'solid 1px #3a4146cf' }}>
                                        <input ref={this.refLatitude} type="text" placeholder="위도" />
                                  </div>
                                  <div>
                                        <input ref={this.refLongitude} type="text" placeholder="경도" />
                                  </div>
                                </div> 
                            </div>
                            <div className={dash.modelSizeBoxR}>
                                <span>크기</span>
                                <div className={dash.modelInputBoxR}>
                                  <div style={{ display: 'block', borderRight: 'solid 1px #3a4146cf' }}>
                                        <input ref={this.refWidth} type="text" placeholder="W" />
                                  </div>
                                  <div style={{ display: 'block', borderRight: 'solid 1px #3a4146cf' }}>
                                        <input ref={this.refDepth} type="text" placeholder="D" />
                                  </div>
                                  <div style={{ display: 'block', borderRight: 'solid 1px #3a4146cf' }}>
                                        <input ref={this.refHeight} type="text" placeholder="H" />
                                  </div>
                                </div>
                                <div className={dash.unitSelectBoxR} onChange={(e) => this.onSelectUnit(e)}>
                                    <select ref={this.refSelectUnit}>
                                        <option value="m">M</option>
                                        <option value="cm">cm</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={dash.managementFlex3R}>
                            <div className={dash.startPointBox}>
                                <span>시작점</span>
                                <div className={dash.startInputBox}>
                                    <div style={{ display: 'block', borderRight: 'solid 1px #3a4146cf' }}>
                                        <input ref={this.refStartX} type="text" placeholder="x" value="0" readOnly />
                                    </div>
                                    <div>
                                        <input ref={this.refStartY} type="text" placeholder="y" value="0" readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className={dash.floorBox}>
                                <span>이중마루</span>
                                <div className={dash.floorInputBoxR}>
                                    <div>
                                        <input ref={this.refBottomElevation} type="text" placeholder="바닥면에서 부터 높이" />
                                    </div>
                                </div>
                                <div className={dash.floorUnitBox}>
                                  <span>mm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={dash.creationBtn} onClick={() => this.onClickCreate()}>등록</div>
                </div>
            </>
        );
    }
}
export default VDCRegistration;
