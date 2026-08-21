import React, { Component } from 'react';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import contents from '../../Common/css/content.module.css';
import dash from '../../Dashboard/css/dash.module.css';
import '../../Dashboard/css/dash.css';
import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';
import ManagementController from '../services/managementController';
import VDCInfoBox from './vdcInfoBox';
import VDCMemoBox from './vdcMemoBox';
import VDCList from '../../Dashboard/ui/vdsList';
import AccountResource from '../../Account/resource/id';
import PopupMenu from './popupMenu';
import wsManager from '../../Root/services/wsManager';
import UserRightsEditManager from './userRightsEditManager';
import { AccountController } from '../../Account/services/accountController';


class VDCManagementList extends Component {
    static dataCenterNameInputTag = "input_dataCenterName_";

    constructor(props) {
        super(props);

        this.state = {
            selectedNation: -1,
            selectedCenterType: -1,
            selectedCreationType: -1,
            selectedUnit: null,
            searchText: "",
            dataCenters: [],
            selectedDataCenter: null,
            selectedDataCenters: null,

            memo: false,
            memoID: null,
            memoValue: null,
            memoBox: {
                top: 0,
                left: 0
            },
            deleteCheck: false,

            isCheckedAll: false,
            pageNo: null,
            totalPage: null,

            popupMenu: {
                menu: null,
                parameter: null,
                x: null,
                y: null
            },

            clone: {
                visible: false,
                dataCenter: null,
                showMemo: false,
                memoText: null
            },

            editMode: false,
            isChanged: false
        }

        this.sites = {};
        this.nations = {};
        this.nationSites = {};

        this.refSelectCompany = React.createRef();
        this.refSelectNation = React.createRef();
        this.refSelectDataCenterType = React.createRef();
        this.refTable = React.createRef();
        this.refSearch = React.createRef();
        this.refCloneVdcMemo = React.createRef();
        this.refCloneVdcName = React.createRef();

        this.isMount = true;

        this.saveMemo = this.saveMemo.bind(this);
        this.closeMemoBox = this.closeMemoBox.bind(this);

        this.checkedDataCenters = {};
        this.maxLine = 12;

        this.editManager = new VDCEditManager(this);
        this.companies = [];
        this.selectedSiteID = -1;
    }

    componentDidMount() {
        let siteID = null;

        if (this.refSelectCompany.current && this.refSelectCompany.current) {
            const allNations = {};

            for (const nation of this.props.allNations) {
                allNations[nation.id] = nation;
            }

            for (const site of this.props.sites) {
                this.sites[site.id] = site;

                siteID = site.id;
                this.selectedSiteID = site.id;

                for (const dataCenter of site.dataCenters) {
                    const nation = allNations[dataCenter.nationID];

                    if (nation) {
                        this.nations[dataCenter.nationID] = nation;
                        let sites = this.nationSites[nation.id];

                        if (!sites) {
                            sites = [];
                            this.nationSites[nation.id] = sites;
                        }

                        if (sites.indexOf(site) < 0) {
                            sites.push(site);
                        }
                    }
                }
            }
        }

        this.initDatas(siteID);
    }

    componentWillUnmount() {
        this.isMount = false;
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    _setState(state) {
        if (this.isMount) {
            this.setState(state);
        }
    }

    async initDatas(siteID) {
        const [companies, errorMessage] = await ManagementController.requestSiteCompanies(siteID);

        if (companies === null) {
            this.props.alertMessage(errorMessage);
        }
        else {
            this.companies = companies;
            this.loadingData = false;
            this.onClickSearch();
        }
    }

    getNationElements() {
        const elements = [];

        elements.push(
            <span>국가</span>
        );

        const options = [];
        options.push(<option value={-1}>{ProjectResource.ID.management.select.all}</option>);

        for (const nationID in this.nations) {
            const nation = this.nations[nationID];
            options.push(<option value={nation.id}>{ProjectResource.getNationName(nation)}</option>);
        }

        elements.push(
            <select ref={this.refSelectNation} onChange={(e) => this.onSelectNation(e)} defaultValue={this.state.selectedNation}>
                {
                    options
                }
            </select>
        );

        return (
            <div className={dash.affiliationVDSBox}>
                {
                    elements
                }
            </div>
        );
    }

    getSiteElements() {
        const elements = [];

        elements.push(
            <span>VDC 소속사</span>
        );

        const options = [];
        options.push(<option value={-1}>{ProjectResource.ID.management.select.all}</option>);

        for (const company of this.companies) {
            options.push(<option value={company}>{company}</option>);
        }

        /*const selectedNationID = this.state.selectedNation;

        if (selectedNationID < 0) {
            for (const siteID in this.sites) {
                const site = this.sites[siteID];
                options.push(<option value={site.id}>{ProjectResource.getSiteName(site)}</option>);
            }
        }
        else {
            const sites = this.nationSites[selectedNationID];

            for (const site of sites) {
                options.push(<option value={site.id}>{ProjectResource.getSiteName(site)}</option>);
            }
        }*/

        elements.push(
            <select ref={this.refSelectCompany} onChange={(e) => this.onSelectCompany(e)} defaultValue={this.selectedSiteID}>
                {
                    options
                }
            </select>
        );

        return (
            <div className={dash.nationBox}>
                {
                    elements
                }
            </div>
        );
    }

    getCreationTypeElements() {
        const elements = [];

        elements.push(
            <span>생성방법</span>
        );

        const options = [];
        options.push(<option value={-1}>{ProjectResource.ID.management.select.all}</option>);
        options.push(<option value={ProjectResource.ID.management.creationType.fileUpload}>{ProjectResource.ID.management.creationType.fileUpload}</option>);
        options.push(<option value={ProjectResource.ID.management.creationType.interface}>{ProjectResource.ID.management.creationType.interface}</option>);

        elements.push(
            <select onChange={(e) => this.onSelectCreationType(e)}>
                {
                    options
                }
            </select>
        );

        return (
            <div className={dash.kindVDSBox}>
                {
                    elements
                }
            </div>
        );
    }

    getDataCenterTypeElements() {
        const elements = [];

        elements.push(
            <span>구분</span>
        );

        const options = [];
        options.push(<option value={-1}>{ProjectResource.ID.management.select.all}</option>);
        options.push(<option value={ProjectResource.ID.management.dataCenterType.own}>{ProjectResource.ID.management.dataCenterType.own}</option>);
        options.push(<option value={ProjectResource.ID.management.dataCenterType.rent}>{ProjectResource.ID.management.dataCenterType.rent}</option>);

        elements.push(
            <select ref={this.refSelectDataCenterType} onChange={(e) => this.onSelectDataCenterType(e)}>
                {
                    options
                }
            </select>
        );

        return (
            <div className={dash.kindVDSBox}>
                {
                    elements
                }
            </div>
        );
    }

    onClickMemoBox = (dataCenter, showMemo) => {
        if (!showMemo) {
            return;
        }

        const dataCenterID = dataCenter.id;
        const id = dataCenterID.toString();
        const element = document.getElementById(id);

        const clientRect = element.getBoundingClientRect();
        const relativeTop = clientRect.top;
        const relativeLeft = clientRect.left;

        let _memoBox = {
            top: relativeTop,
            left: relativeLeft
        }

        this.setState({ memo: !this.state.memo, memoBox: _memoBox, memoID: dataCenterID, memoValue: dataCenter.memo });
    }

    checkAll = () => {

        let _isCheckedAll = false;

        let checkBoxes = this.refTable.current.querySelectorAll('input[type="checkbox"]');
        //let checkBoxes = document.querySelectorAll('input[type="checkbox"]');
        let dataCenters = this.state.dataCenters;

        if (!this.state.isCheckedAll) { // 전체 선택 OFF 일때 
            _isCheckedAll = true; // 전체 선택 TRUE

            // property의 id값을 index로 저장해야 함
            for (let i = 0; i < dataCenters.length; i++) {
                this.checkedDataCenters[dataCenters[i].id] = dataCenters[i];
            }

            for (let i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].checked = true;
            }

        } else { // 전체 선택 ON일때
            for (let i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].checked = false;
            }
            this.checkedDataCenters = {};
        }

        this.setState({ isCheckedAll: _isCheckedAll });

    }

    onChangeDataCenterStatus(e, dataCenter) {
        if (e.target.checked === true) {
            this.checkedDataCenters[dataCenter.id] = dataCenter;
        }
        else {
            if (this.state.isCheckedAll) {
                const array = this.state.dataCenters.filter(dc => dc.id != dataCenter.id);

                this.checkedDataCenters = {};

                for (let i = 0; i < array.length; i++) {
                    this.checkedDataCenters[array[i].id] = array[i];
                }
            } else {
                delete this.checkedDataCenters[dataCenter.id];
            }
        }

        /*const currentChecked = Object.keys(this.checkedDataCenters);

        if (this.state.dataCenters.length === currentChecked.length) {
            this.setState({ isCheckedAll: true });
        } else {
            this.setState({ isCheckedAll: false });
        }*/
    }

    getDataCenterCheckBox(dataCenter) {
        if (this.props.enableEdit && this.state.editMode) {
            return <input type="checkBox" onChange={(e) => this.onChangeDataCenterStatus(e, dataCenter)} />
        }

        return (
            <input type="checkBox" onChange={(e) => this.onChangeDataCenterStatus(e, dataCenter)} disabled />
            );
    }

    getPageData(dataCenters) {
        const maxLine = this.maxLine;
        let dataCenterCount = dataCenters.length;

        const searchText = this.refSearch.current.value === null ? "" : this.refSearch.current.value.trim().toLowerCase();

        if (searchText.length > 0) {
            dataCenterCount = this.getDisplayElementCount(searchText, dataCenters);
        }

        if (dataCenterCount > maxLine) {
            if (dataCenterCount % maxLine === 0) {
                return [1, dataCenterCount / maxLine];
            }
            else {
                return [1, parseInt(dataCenterCount / maxLine) + 1];
            }
        }

        return [null, null];
    }

    getUserDataCenters() {
        const dataCenters = [...this.state.dataCenters];
        let centerCount = dataCenters.length;

        const user = ProjectResource.getUserInfo();

        if (!user) {
            return [];
        }

        for (let i = centerCount - 1; i >= 0; i--) {
            const dataCenter = dataCenters[i];

            if (user.levelID > AccountResource.accountLevel.vdsManager) {
                if (VDCList.belongToDataCenter(user, dataCenter) === false) {
                    dataCenters.splice(i, 1);
                }
            }
        }

        return dataCenters;
    }

    checkSearchText(searchText, dataCenterName, nationName, companyName, creationType, dataCenterSize, changeDate) {
        if (!searchText || searchText.length === 0) {
            return true;
        }

        if (dataCenterName.toLowerCase().includes(searchText)) {
            return true;
        }

        if (nationName.toLowerCase().includes(searchText)) {
            return true;
        }

        if (companyName.toLowerCase().includes(searchText)) {
            return true;
        }

        if (creationType.toLowerCase().includes(searchText)) {
            return true;
        }

        if (dataCenterSize.toLowerCase().includes(searchText)) {
            return true;
        }

        if (changeDate.toLowerCase().includes(searchText)) {
            return true;
        }

        return false;
    }

    onChangeDataCenterName(e, dataCenter) {
        dataCenter.name = dataCenter.engName = e.target.value;
        this.editManager.updateDataCenter(dataCenter);
    }

    getNationNameElement(nationName, nationNameConts, hidden) {
        if (nationName.length > 10) {
            nationNameConts = nationName;
            nationName = nationName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipNationName">
                        <span className="tooltipNationNameTitle">
                            {nationName}
                        </span>
                        <span className="tooltipNationNameConts tooltip-left">
                            {nationNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{nationName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{nationName}</td>
            );
        }

        return (
            <td>{nationName}</td>
        );
    }

    getDataCenterNameElement(dataCenter, dataCenterName, dataCenterNameConts, hidden) {
        if (dataCenterName.length > 12) {
            dataCenterNameConts = dataCenterName;
            dataCenterName = dataCenterName.substring(0, 12) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipData">
                        {
                            !this.state.editMode &&
                            this.getCloneElement(dataCenter)
                        }
                        <span className="tooltipDataTitle">
                            {dataCenterName}
                        </span>
                        <span className="tooltipDataConts tooltip-left">
                            {dataCenterNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{this.getCloneElement(dataCenter)}{dataCenterName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{this.getCloneElement(dataCenter)}{dataCenterName}</td>
            );
        }

        return (
            <td>{this.getCloneElement(dataCenter)}{dataCenterName}</td>
        );
    }

    getCompanyNameElement(companyName, companyNameConts, hidden) {
        if (companyName.length > 10) {
            companyNameConts = companyName;
            companyName = companyName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipSiteName">
                        <span className="tooltipSiteNameTitle">
                            {companyName}
                        </span>
                        <span className="tooltipSiteNameConts tooltip-left">
                            {companyNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{companyName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{companyName}</td>
            );
        }

        return (
            <td>{companyName}</td>
        );
    }

    getCompany(dataCenter) {
        if (dataCenter.data?.company) {
            return dataCenter.data.company;
        }

        return "-";
    }

    getTableBodyElements() {
        const elements = [];
        const dataCenters = this.getUserDataCenters();

        const maxLine = this.maxLine;
        const centerCount = dataCenters.length;

        let beginIndex = 0;
        let endIndex = centerCount;

        if (centerCount > maxLine) {
            if (this.state.pageNo !== null) {
                beginIndex = (this.state.pageNo - 1) * maxLine;

                const index2 = this.state.pageNo * maxLine;
                endIndex = centerCount < index2 ? centerCount : index2;
            }
            else {
                endIndex = maxLine;
            }
        }

        let inputIndex = 1;
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase() : "";
        
        for (let i = beginIndex, j = 0; i < centerCount && j < endIndex - beginIndex; i++) {
            const dataCenter = dataCenters[i];
            const trClassName = this.state.selectedDataCenter === dataCenter ? dash.activeTr : "";

            let id = dataCenter.id;
            const originDataCenter = this.editManager.getOriginDataCenter(id);

            const dataCenterName = ProjectResource.getDataCenterName(originDataCenter ? originDataCenter : dataCenter);
            const dataCenterNameConts = ProjectResource.getDataCenterName(originDataCenter ? originDataCenter : dataCenter);
            const nationName = this.getNationName(dataCenter);
            const nationNameConts = this.getNationName(dataCenter);
            const companyName = this.getCompany(dataCenter);
            const companyNameConts = this.getCompany(dataCenter);
            const creationType = dataCenter.creationType;
            const dataCenterSize = this.getDataCenterSize(dataCenter);
            const changeDate = this.getDateString(dataCenter);

            if (this.checkSearchText(searchText, dataCenterName, nationName, companyName, creationType, dataCenterSize, changeDate) === false) {
                continue;
            }

            j++;

            const memoClassName = dataCenter.memo && dataCenter.memo.trim().length > 0 ? dash.manageMemoIconAct : (this.state.editMode ? dash.manageMemoIcon : dash.manageMemoIcon + " " + dash.disabled);
            const showMemo = (dataCenter.memo && dataCenter.memo.trim().length > 0) || this.state.editMode;
            const dataCenterInputID = VDCManagementList.dataCenterNameInputTag + inputIndex++;

            elements.push(
                    <tr className={trClassName} onMouseUp={(e) => this.onSelectDataCenter(e, dataCenter)}>
                    <td>{this.getDataCenterCheckBox(dataCenter)}</td> 
                    {
                        this.getNationNameElement(nationName, nationNameConts)
                    }
                    {
                        !this.state.editMode &&
                        /* <td className="vdcIDList2">
                            {this.getCloneElement(dataCenter)}
                            <span>{dataCenterName}</span>
                        </td> */
                        <>
                            {
                                this.getDataCenterNameElement(dataCenter, dataCenterName, dataCenterNameConts)
                            }
                        </>
                    }
                    {
                        this.state.editMode &&
                        <td>
                            <span className={dash.vdcEdit}>
                                <input id={dataCenterInputID} type="text" value={ProjectResource.getDataCenterName(dataCenter)} onChange={(e) => this.onChangeDataCenterName(e, dataCenter)} />
                            </span>
                        </td>
                    }
                    {
                        this.getCompanyNameElement(companyName, companyNameConts)
                    }
                    <td>{creationType}</td>
                    <td>{dataCenterSize}</td>
                    <td>{changeDate}</td>
                    <td><span id={id} className={memoClassName} onClick={() => this.onClickMemoBox(dataCenter, showMemo)}></span></td>
                </tr>
            );
        }

        return (
            <tbody>
                {
                    elements
                }
            </tbody>
        );
    }

    getDisplayElementCount(searchText, dataCenters) {
        let count = 0;

        for (const dataCenter of dataCenters) {
            const dataCenterName = ProjectResource.getDataCenterName(dataCenter);
            const dataCenterNameConts = ProjectResource.getDataCenterName(dataCenter);
            const nationName = this.getNationName(dataCenter);
            const nationNameConts = this.getNationName(dataCenter);
            const companyName = this.getCompany(dataCenter);
            const companyNameConts = this.getCompany(dataCenter);
            const creationType = dataCenter.creationType;
            const dataCenterSize = this.getDataCenterSize(dataCenter);
            const changeDate = this.getDateString(dataCenter);

            if (this.checkSearchText(searchText, dataCenterName, nationName, companyName, creationType, dataCenterSize, changeDate) === false) {
                continue;
            }

            count++;
        }

        return count;
    }

    getCloneElement(dataCenter) {
        if (dataCenter.data?.isClone) {
            return (
                <span className="controlCIcon"></span> 
            );
        }

        return <></>
    }

    getPageAreaElements() {
        if (this.state.pageNo !== null && this.state.totalPage !== null) {
            const leftClassName = this.state.pageNo > 1 ? dash.leftArrowIcon + " " + dash.active : dash.leftArrowIcon;
            const rightClassName = this.state.pageNo < this.state.totalPage ? dash.rightArrowIcon + " " + dash.active : dash.rightArrowIcon;

            return (
                <div className={dash.pageArea}>
                    <span className={leftClassName} onClick={() => this.movePage(-1)}></span>
                    <span className={dash.pageNumBox}>{this.state.pageNo + "/" + this.state.totalPage}</span>
                    <span className={rightClassName} onClick={() => this.movePage(1)}></span>
                </div>
            );
        }

        return <></>;
    }

    movePage(dir) {
        this.allClearCheck();

        if (dir < 0) {
            if (this.state.pageNo > 1) {
                this.setState({ pageNo: this.state.pageNo - 1 });
            }
        }
        else {
            if (this.state.pageNo < this.state.totalPage) {
                this.setState({ pageNo: this.state.pageNo + 1 });
            }
        }
    }

    getDataCenterSize(dataCenter) {
        const w = this.getMeterString(dataCenter.width, dataCenter.unitOfLength);
        const d = this.getMeterString(dataCenter.length, dataCenter.unitOfLength);
        const h = this.getMeterString(dataCenter.height, dataCenter.unitOfLength);
        return w + " x " + d + " x " + h + "M";
    }

    getMeterString(len, unit) {
        if (unit === 0) {
            // mm
            return (len / 1000).toFixed(1);
        }
        else if (unit === 1) {
            // cm
            return (len / 100).toFixed(1);
        }

        return len.toFixed(1);
    }

    getSiteName(dataCenter) {
        const site = this.sites[dataCenter.siteID];

        if (site) {
            return ProjectResource.getSiteName(site);
        }

        return "";
    }

    getNationName(dataCenter) {
        const nation = this.nations[dataCenter.nationID];

        if (nation) {
            return ProjectResource.getNationName(nation);
        }

        return "";
    }

    getDateString(dataCenter) {
        if (!dataCenter.regDate || dataCenter.regDate.length < 10) {
            return "";
        }

        const year = dataCenter.regDate.substring(0, 4);
        const month = dataCenter.regDate.substring(5, 7);
        const day = dataCenter.regDate.substring(8, 10);

        if (isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
            return "";
        }

        return year + "." + month + "." + day;
    }

    onSelectNation(e) {
        this.search(e.target.value, this.selectedSiteID, this.state.selectedCreationType, this.refSelectCompany.current.value);
        //this.setState({ selectedNation: e.target.value });
    }

    onSelectCompany(e) {
        this.search(this.state.selectedNation, this.selectedSiteID, this.state.selectedCreationType, e.target.value);
        //this.setState({ selectedSite: e.target.value });
    }

    onSelectDataCenterType(e) {
        this.setState({ selectedCenterType: e.target.value });
    }

    onSelectCreationType(e) {
        this.search(this.state.selectedNation, this.selectedSiteID, e.target.value, this.refSelectCompany.current.value);
        //this.setState({ selectedCreationType: e.target.value });
    }

    onSelectDataCenter(e, dataCenter) {
        if (e.button === 2) {
            // Mouse Right Button
            this.setState({ selectedDataCenter: dataCenter, popupMenu: { menu: PopupMenu.menu.cloneVdc, parameter: dataCenter, x: e.nativeEvent.x, y: e.nativeEvent.y } });
        }
        else if (e.button === 0) {
            // Mouse Left Button
            this.setState({ selectedDataCenter: dataCenter, popupMenu: { menu: null } });
        }
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            this.onClickSearch();
        }
    }

    async onClickSearch() {
        this.search(this.state.selectedNation, this.selectedSiteID, this.state.selectedCreationType, this.refSelectCompany.current.value);
    }

    async search(selectedNation, siteID, selectedCreationType, selectedCompany) {
        const user = ProjectResource.getUserInfo();
        const searchText = this.refSearch.current ? this.refSearch.current.value.trim() : null;

        if (user) {
            const _selectedNation = parseInt(selectedNation);
            const _selectedType = selectedCreationType < 0 ? null : selectedCreationType;
            const _selectedCompany = selectedCompany === "-1" ? null : selectedCompany;

            const [dataCenters, errorMessage] = await ManagementController.requestGetDataCenters(user.id, _selectedNation, siteID, _selectedType, _selectedCompany);

            if (!dataCenters) {
                if (errorMessage && errorMessage.length > 0) {
                    this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error, ConfirmDialog.icon.warning);
                    return;
                }
            }
            else {
                dataCenters.sort((center1, center2) => {
                    if (center1.regDate < center2.regDate) {
                        return 1;
                    }
                    else if (center1.regDate > center2.regDate) {
                        return -1;
                    }

                    return 0;
                });

                this.editManager.setDataCenters(dataCenters);

                const [pageNo, totalPage] = this.getPageData(dataCenters);
                this.setState({ dataCenters, pageNo, totalPage, selectedNation, selectedCreationType, searchText });
            }
        }
    }

    async saveMemo(value) {
        if (!this.props.enableEdit) {
            this.setState({ memo: false });
            return;
        }

        if (value !== null && value !== undefined) {
            const dataCenter = this.getMemoDataCenter();

            if (dataCenter) {
                dataCenter.memo = value;
                this.editManager.updateDataCenter(dataCenter);
                this.setState({ memo: false, isChanged: this.editManager.isChanged() });
            }
        }
    }

    getMemoDataCenter() {
        const dataCenterID = this.state.memoID;

        if (dataCenterID !== 0 && !dataCenterID) {
            return null;
        }

        const selectedDataCenter = this.state.selectedDataCenter;

        if (selectedDataCenter && selectedDataCenter.id === dataCenterID) {
            return selectedDataCenter;
        }

        const dataCenters = [...this.state.dataCenters];

        for (const dataCenter of dataCenters) {
            if (dataCenter.id === dataCenterID) {
                return dataCenter;
            }
        }

        return null;
    }

    closeMemoBox() {
        this.setState({ memo: false });
    }

    onClickDelete() {
        let isEmpty = true;

        for (const id in this.checkedDataCenters) {
            isEmpty = false;
            break;
        }

        if (!isEmpty) {
            this.setState({ deleteCheck: true });
        }
    }

    onClickCancelDelete() {
        this.setState({ deleteCheck: false });
    }

    async doDelete() {
        let dataCenterIDs = [];

        for (const id in this.checkedDataCenters) {
            dataCenterIDs.push(parseInt(id));
        }

        const [result, errorMessage] = await ManagementController.requestDeleteDataCenters(dataCenterIDs);

        if (result) {
            const dataCenters = [ ...this.state.dataCenters ];

            for (let i = dataCenters.length - 1; i >= 0; i--) {
                const center = this.checkedDataCenters[dataCenters[i].id];

                if (center) {
                    dataCenters.splice(i, 1);
                }
            }

            this.checkedDataCenters = {};
            this.setState({ deleteCheck: false, dataCenters });
            this.props.setRefreshSites();

            this.onClickSearch();
        }
        else {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error, ConfirmDialog.icon.warning);
            }

            this.setState({ deleteCheck: false });
        }

        this.allClearCheck();
    }

    allClearCheck() {
        const checkBoxes = this.refTable.current.querySelectorAll('input[type="checkbox"]');

        if (checkBoxes) {
            for (let i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].checked = false;
            }
        }

        this.setState({ isCheckedAll: false });
    }

    isEmptyCheckedDataCenters() {
        for (const id in this.checkedDataCenters) {
            return false;
        }

        return true;
    }

    getHeaderChecker() {
        if (this.props.enableEdit && this.state.editMode) {
            return <input type="checkBox" onClick={() => this.checkAll()} checked={this.state.isCheckedAll} />
        }

        return (
            <input type="checkBox" onClick={() => this.checkAll()} checked={this.state.isCheckedAll} disabled />
            );
    }

    closePopupMenu = () => {
        this.setState({ popupMenu: { menu: null } });
    }

    onAction = (menu, parameter) => {
        this.setState({ popupMenu: { menu: null }, clone: { visible: true, dataCenter: parameter } });
    }

    onClickCancelCloneVdc() {
        this.props.showConfirmDialog(ProjectResource.ID.messageBox.title.info, ["취소하시겠습니까?"], ["취소", "확인"], (index) => this.onClickCancelCloneVdcDialog(index), ConfirmDialog.icon.question);
    }

    onClickCancelCloneVdcDialog(index) {
        this.props.onCloseConfirmDialog();

        if (index === 1) {
            this.setState({ clone: { visible: null } });
        }
    }

    onClickSaveCloneVdc() {
        if (this.refCloneVdcName.current) {
            const vdcName = this.refCloneVdcName.current.value ? this.refCloneVdcName.current.value.trim() : "";

            if (vdcName.length === 0) {
                this.props.alertMessage("VDC명을 입력하세요", ProjectResource.ID.messageBox.title.info, ConfirmDialog.icon.warning);
                return;
            }
            else {
                this.props.showConfirmDialog(ProjectResource.ID.messageBox.title.info, ["저장하시겠습니까?"], ["취소", "확인"], (index) => this.onClickSaveCloneVdcDialog(index, vdcName), ConfirmDialog.icon.plus);
            }
        }
    }

    onClickSaveCloneVdcDialog(index, vdcName) {
        this.props.onCloseConfirmDialog();

        if (index === 1) {
            this.saveCloneVdc(vdcName);
        }
    }

    async saveCloneVdc(vdcName) {
        const dataCenter = this.state.clone.dataCenter;

        if (!dataCenter) {
            this.setState({ clone: { visible: null } });
            return;
        }

        const user = ProjectResource.getUserInfo();

        if (!user) {
            return;
        }

        this.props.onLoading(true);

        const width = this.toMillimeter(dataCenter.width, dataCenter.unitOfLength);
        const depth = this.toMillimeter(dataCenter.length, dataCenter.unitOfLength);
        const height = this.toMillimeter(dataCenter.height, dataCenter.unitOfLength);
        const tileElevation = this.toMillimeter(dataCenter.tileElevation, dataCenter.unitOfLength);
        const parentCenterID = dataCenter.id;

        const [result, errorMessage] = await ManagementController.requestAddDataCenter(dataCenter.siteID, dataCenter.nationID, vdcName, dataCenter.type, dataCenter.latitude, dataCenter.longitude, width, depth, height, dataCenter.beginGridX, dataCenter.beginGridY, tileElevation, dataCenter.utc, this.state.clone.memoText, true, parentCenterID, dataCenter.data?.managerTeam, dataCenter.data?.manager, dataCenter.data?.company, user.id);

        const dataCenters = [...this.state.dataCenters];

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error, ConfirmDialog.icon.warning);
            }
        }
        else {
            const user = ProjectResource.getUserInfo();

            if (user?.dataCenters) {
                dataCenters.unshift(result);
                user.dataCenters.push(result);

                const userDatas = [];
                UserRightsEditManager.addUserData(user, userDatas);

                const [success, errorMessage2] = await AccountController.requestUpdateAccountUsers2(userDatas);

                if (success) {
                    ProjectResource.setLoginUser(user);
                    this.onClickSearch();
                }
            }
        }

        this.setState({ dataCenters, clone: { visible: null } });
        this.props.onLoading(false);
    }

    toMillimeter(length, unitType) {
        if (unitType === wsManager.unitOfLength.m) {
            return length * 1000;
        }
        else if (unitType == wsManager.unitOfLength.cm) {
            return length * 10;
        }

        return length;
    }

    getCloneDataCenterElement() {
        const dataCenter = this.state.clone.dataCenter;

        if (!dataCenter) {
            return <></>
        }

        const nation = this.nations[dataCenter.nationID];
        const site = this.sites[dataCenter.siteID];

        if (!site || !nation) {
            return <></>
        }

        const memoText = this.state.clone.memoText ? this.state.clone.memoText.trim() : "";
        const memoIconClassName = memoText.length > 0 ? dash.manageMemoIconAct : dash.manageMemoIcon;

        return (
            <>
            <div className={dash.reproductionPop}>
                <div className={dash.reproTitleBox}>
                    <span className={dash.reproductionIcon}></span>
                    <span className={dash.reproductPopTitle}>VDC복제</span>
                </div>
                <div className={dash.vdcNamePop}>
                    <span className={dash.vdcName}>VDC명</span>
                    <input ref={this.refCloneVdcName} type="text" autoFocus />
                </div>
                <div className={dash.vdcGroupPop}>
                    <span className={dash.vdcGroupTitle}>VDC 소속사</span>
                    <span className={dash.vdcGroupText}>{ProjectResource.getSiteName(site)}</span>
                </div>
                <div className={dash.vdcNationalPop}>
                    <span className={dash.vdcNationalTitle}>국가</span>
                    <span className={dash.vdcNationalText}>{ProjectResource.getNationName(nation)}</span>
                </div>
                <div className={dash.vdcPlacePop}>
                    <span className={dash.vdcPlaceTitle}>DC시설구분</span>
                    <span className={dash.vdcPlaceText}>{dataCenter.type}</span>
                </div>
                <div className={dash.vdcLocationPop}>
                    <span className={dash.vdcLocationTitle}>위치</span>
                    <span className={dash.vdcLocationText}>{"위도 : " + dataCenter.latitude.toFixed(2) + ", "}</span>
                    <span className={dash.vdcLocationText2}>{"경도 : " + dataCenter.longitude.toFixed(2)}</span>
                </div>
                <div className={dash.vdcSizePop}>
                    <span className={dash.vdcSizeTitle}>크기</span>
                    <span className={dash.vdcSizeText}>{this.getWDH(dataCenter)}</span>
                </div>
                <div className={dash.vdcStartPointPop}>
                    <span className={dash.vdcStartTitle}>시작점</span>
                    <span className={dash.vdcStartText}>{dataCenter.beginGridX + ", " + dataCenter.beginGridY}</span>
                </div>
                <div className={dash.vdcFlowPop}>
                    <span className={dash.vdcFlowTitle}>이중마루</span>
                    <span className={dash.vdcFlowText}>{this.getTileElevation(dataCenter)}</span>
                </div>
                <div className={dash.vdcMemoPop}>
                    <span className={dash.vdcMemoTitle}>메모</span>
                    <span className={memoIconClassName} onClick={() => this.onClickShowMemo()}></span>
                </div>
                <div className={dash.reproBottomBox}>
                    <span className={dash.reproductionCancel} onClick={() => this.onClickCancelCloneVdc()}>취소</span>
                    <span className={dash.reproductionSave} onClick={() => this.onClickSaveCloneVdc()}>저장</span>
                </div>
            </div>
            </>
        );
    }

    onClickShowMemo() {
        this.setState({
            clone: {
                visible: this.state.clone.visible,
                dataCenter: this.state.clone.dataCenter,
                showMemo: true,
                memoText: this.state.clone.memoText
            }
        });
    }

    closeCloneMemo() {
        this.setState({
            clone: {
                visible: this.state.clone.visible,
                dataCenter: this.state.clone.dataCenter,
                showMemo: false,
                memoText: this.state.clone.memoText
            }
        });
    }

    setCloneMemo() {
        if (this.refCloneVdcMemo.current) {
            this.setState({
                clone: {
                    visible: this.state.clone.visible,
                    dataCenter: this.state.clone.dataCenter,
                    showMemo: false,
                    memoText: this.refCloneVdcMemo.current.value
                }
            });
        }
    }

    getWDH(dataCenter) {
        let flag = 1;

        if (dataCenter.unitOfLength === wsManager.unitOfLength.mm) {
            flag = 0.001;
        }
        else if (dataCenter.unitOfLength === wsManager.unitOfLength.cm) {
            flag = 0.01;
        }

        return this.getFixed(dataCenter.width * flag, 1) + "*" + this.getFixed(dataCenter.length * flag, 1) + "*" + this.getFixed(dataCenter.height * flag, 1) + "(m)";
    }

    getTileElevation(dataCenter) {
        let flag = 1;

        if (dataCenter.unitOfLength === wsManager.unitOfLength.cm) {
            flag = 10;
        }
        else if (dataCenter.unitOfLength === wsManager.unitOfLength.m) {
            flag = 1000;
        }

        return parseInt(dataCenter.tileElevation * flag) + "(mm)";
    }

    getFixed(data, num) {
        const str = data.toFixed(num);

        if (str.includes(".") === false) {
            return str;
        }

        const len = str.length;

        for (let i = len - 1; i >= 0; i--) {
            if (str[i] !== '0') {
                if (str[i] === '.') {
                    return str.substring(0, i);
                }
                else {
                    return str.substring(0, i + 1);
                }
            }
        }

        return str;
    }

    toggleEdit() {
        if (!this.props.enableEdit) {
            return;
        }

        this.setState({ editMode: !this.state.editMode });
    }

    onClickSave() {
        if (this.state.editMode && this.state.isChanged) {
            this.props.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, "저장하시겠습니까?", ["취소", "확인"], (index) => this.onClickSaveDataCenter(index), ConfirmDialog.icon.save);
        }
    }

    onClickSaveDataCenter(index) {
        this.props.onCloseConfirmDialog();

        if (index === 1) {
            this.editManager.save();
        }
    }

    render() {
        const editClassName = this.state.editMode ? dash.removeIconAct : dash.removeIcon;
        const saveClassName = this.state.editMode && this.state.isChanged ? dash.saveDiskIconAct : dash.saveDiskIcon;
        const removeClassName = this.state.editMode ? dash.recycleBinActIcon : dash.recycleBinIcon;

        return (
            <>
                <div style={{ display: 'flex' }}>
                    <span className={dash.userRightTitle}>VDC 목록</span>
                    <span className={dash.managementClose} onClick={() => this.props.onClose()}></span>
                </div>

                <div>
                    <div className={dash.managementFlex1}>
                        {
                            this.getNationElements()
                        }
                        {
                            this.getSiteElements()
                        }
                        {
                            this.getCreationTypeElements()
                        }
                    </div>
                    <div className={dash.managementFlex2}>
                        <div className={dash.searchVDSBox}>
                            <span><div className={dash.glassIcon}></div></span>
                            <div>
                                <input ref={this.refSearch} type="text" onKeyUp={(e) => this.onSearch(e)} />
                                <div className={dash.modelSearchBtn} onClick={() => this.onClickSearch()}>검색</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={dash.userFlexVDSBox}>
                    {/* <span className={recycleClassName} onClick={() => this.onClickDelete()}></span> */}

                    <span className={editClassName} onClick={() => this.toggleEdit()}></span>
                    <span className={dash.removeText}>편집</span>
                    <span className={saveClassName} onClick={() => this.onClickSave()}></span>
                    <span className={dash.saveText}>저장</span>
                    {/* <div className={dash.recycleFBox}>
                      <span className={removeClassName} onClick={() => this.onClickDelete()}></span>
                      <span className={dash.recycleBinText}>삭제</span>
                    </div> */}
                </div>


                <div ref={this.refTable} className={dash.managementTable}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '3%' }}>{this.getHeaderChecker()}</th>
                                <th style={{ width: '14%' }}>국가</th>
                                <th style={{ width: '20%' }}>VDC명</th>
                                <th style={{ width: '17%' }}>VDC소속사</th>
                                <th style={{ width: '12%' }}>생성방법</th>
                                <th style={{ width: '17%' }}>크기(W x D x H)</th>
                                <th style={{ width: '12%' }}>수정일자</th>
                                <th style={{ width: '5%' }}>메모</th>
                            </tr>
                        </thead>
                        {
                            this.getTableBodyElements()
                        }
                    </table>
                </div>

                {
                    this.getPageAreaElements()
                }

                {
                    this.state.memo &&
                    <VDCMemoBox left={this.state.memoBox.left} top={this.state.memoBox.top} saveMemo={this.saveMemo} closeMemoBox={this.closeMemoBox} memo={this.state.memoValue} enableEdit={this.state.editMode}></VDCMemoBox>
                }
                
                {
                    this.state.deleteCheck &&
                    <div className={dash.deleteEditPop}>
                        <span className={dash.deleteEditCloseIcon} onClick={() => this.onClickCancelDelete()}></span>
                        <div className={dash.deleteFlex1}>
                            <span className={dash.fileSaveIconD}></span>
                            <span className={dash.fileTextD}>선택한 DataCenter들을 삭제하시겠습니까?</span>
                        </div>
                        <div className={dash.deleteFlex2}>
                            <span className={dash.fileCancelD} onClick={() => this.onClickCancelDelete()}>취소</span>
                            <span className={dash.fileConfirmD} onClick={() => this.doDelete()}>삭제</span>
                        </div>
                    </div>
                }

                {/* 복제창 */}
                {
                    this.state.popupMenu.menu &&
                    <PopupMenu menu={this.state.popupMenu.menu} parameter={this.state.popupMenu.parameter} x={this.state.popupMenu.x} y={this.state.popupMenu.y} onClose={this.closePopupMenu} onAction={this.onAction} />
                }

                {/* VDC복제 팝업창 */}
                {
                    this.state.clone.visible &&
                    this.getCloneDataCenterElement()
                }

                {/* 메모 팝업창 */}
                {
                    this.state.clone.showMemo &&
                    <span className={dash.vdsMemoContents + " " + dash.showAlways} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className={dash.vdsMemoBox}>
                            <span className={dash.vdsMemoTitle}>메모작성</span>
                            <span className={dash.vdsMemoCloseIcon} onClick={() => this.closeCloneMemo()}></span>
                        </div>
                        <textarea ref={this.refCloneVdcMemo}>{this.state.clone.memoText}</textarea>
                        <div className={dash.vdsMemoBtn} onClick={() => this.setCloneMemo()}>확인</div>
                    </span>
                }
                {
                    /* this.state.memo &&
                    <VDCMemoBox left={this.state.memoBox.left} top={this.state.memoBox.top} saveMemo={this.saveMemo} closeMemoBox={this.closeMemoBox} memo={this.state.memoValue}></VDCMemoBox> */
                }
            </>
        )
    }
}
export default VDCManagementList;

class VDCEditManager {
    constructor(owner) {
        this.owner = owner;
    }

    setDataCenters(dataCenters) {
        this.originDataCenters = this.copyDataCenters(dataCenters);
        this.updateDataCenters = {};
        //this.deleteDataCenters = {};
    }

    copyDataCenters(dataCenters) {
        const copyDataCenters = [];

        for (const dataCenter of dataCenters) {
            const copyDataCenter = { ...dataCenter };
            
            copyDataCenters.push(copyDataCenter);
        }

        return copyDataCenters;
    }

    updateDataCenter(dataCenter) {
        if (dataCenter) {
            const originDataCenter = this.getOriginDataCenter(dataCenter.id);

            if (originDataCenter) {
                if (this.isSame(originDataCenter, dataCenter)) {
                    delete this.updateDataCenters[dataCenter.id];
                }
                else {
                    this.updateDataCenters[dataCenter.id] = dataCenter;
                }

                this.owner.setState({ isChanged: this.isChanged() });
            }
        }
    }

    isSame(center1, center2) {
        if (ProjectResource.getDataCenterName(center1) !== ProjectResource.getDataCenterName(center2)) {
            return false;
        }

        const empty1 = !center1.memo || center1.memo.trim().length === 0;
        const empty2 = !center2.memo || center2.memo.trim().length === 0;

        if (empty1 === empty2) {
            return true
        }
        else if (empty1) {
            return false;
        }
        else if (empty2) {
            return false;
        }

        if (center1.memo.trim() !== center2.memo.trim()) {
            return false;
        }

        return true;
    }

    getOriginDataCenter(dataCenterID) {
        for (const dataCenter of this.originDataCenters) {
            if (dataCenter.id === dataCenterID) {
                return dataCenter;
            }
        }

        return null;
    }

    /*deleteDataCenter(dataCenter) {
        if (dataCenter) {
            this.deleteDataCenters[dataCenter.id] = dataCenter;
        }
    }*/

    isChanged() {
        for (const dataCenterID in this.updateDataCenters) {
            return true;
        }

        /*for (const dataCenterID in this.deleteDataCenters) {
            return true;
        }*/

        return false;
    }

    async save() {
        const centerDatas = [];

        for (const dataCenterID in this.updateDataCenters) {
            const dataCenter = this.updateDataCenters[dataCenterID];

            centerDatas.push(
                {
                    dataCenterID: dataCenter.id,
                    centerName: ProjectResource.getDataCenterName(dataCenter),
                    type: dataCenter.type,
                    creationType: dataCenter.creationType,
                    memo: dataCenter.memo
                }
            );
        }

        if (centerDatas.length > 0) {
            const [success, errorMessage] = await ManagementController.requestUpdateDataCenters(centerDatas);

            if (success) {
                for (let i = this.originDataCenters.length - 1; i >= 0; i--) {
                    const dataCenter = this.originDataCenters[i];
                    const _dataCenter = this.updateDataCenters[dataCenter.id];

                    if (_dataCenter) {
                        this.originDataCenters[i] = _dataCenter;
                    }
                }

                const originDataCenters = [...this.originDataCenters];
                this.setDataCenters(originDataCenters);
                this.owner.setState({ dataCenters: originDataCenters, isChanged: false });
            }
            else {
                this.owner.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error, ConfirmDialog.icon.warning);
            }
        }
        else {
            this.updateDataCenters = {};
            this.owner.setState({ isChanged: false });
        }
    }
}
