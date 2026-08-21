import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';
import edit from '../../PropertyEdit/css/edit.module.css';
import CommonResource from '../../Common/resource/id';
import ProjectResource from '../../Root/resource/id';
import wsManager from '../../Root/services/wsManager';
import Viewer from '../../PropertyEdit/ui/viewer';
import AccountResource from '../../Account/resource/id';
import ManagementController from '../services/managementController';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import EditController from '../../PropertyEdit/services/editController';



class Property3DList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rackTypes: [],
            itemTypes: [],
            facilityTypes: [],
            rackTypeList: [],
            itemTypeList: [],
            facilityTypeList: [],
            rackTypeCompanies: [],
            itemTypeCompanies: [],
            facilityTypeCompanies: [],
            facilityTypeEquipmentTypes: [],
            selectedType: ProjectResource.ID.management.select.rack,
            selectedCompanyID: -1,
            selectedPropertyType: "",
            selectedRackType: "",
            selectedUnit: -1,
            selectedCategory: "",
            selectedEquipmentType: -1,
            searchText: null,
            pageNo: 1,
            totalPage: null,
            rackTyeDatas: [],
            itemTypeDatas: [],
            isCheckedAll: false,
            item3D: null,
            showMemo: {
                visible: false,
                item: null,
                itemType: null
            },
            editMode: false,
            isChanged: false,
            loading: true,
            needUpdate: false
        }

        this.delayItem = null;
        this.maxLine = 12;

        this.refSearch = React.createRef();
        this.refTable = React.createRef();
        this.refMemo = React.createRef();

        this.readDatas();
    }

    componentDidMount() {
        this.setEditManager();
        this.onClickSearch();
    }

    componentDidUpdate() {
        this.setEditManager();

        if (this.state.needUpdate) {
            this.onClickSearch();
        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    setEditManager() {
        if (this.state.loading === false && !this.editDataManager) {
            this.editDataManager = new Property3DEditManager(this);
        }
    }

    async readDatas() {
        const result = await this.readRackNItemTypes();

        this.reloadDatas(result);
    }

    reloadDatas = (result) => {
        if (result) {
            const rackTyeDatas = this.getTypes(result.rackTypes);
            const itemTypeDatas = this.getTypes(result.itemTypes);

            this.setState(
                {
                    rackTypes: result.rackTypes,
                    itemTypes: result.itemTypes,
                    facilityTypes: result.facilityTypes,
                    rackTyeDatas,
                    itemTypeDatas,
                    rackTypeCompanies: this.getComapnies(result.rackTypes),
                    itemTypeCompanies: this.getComapnies(result.itemTypes),
                    facilityTypeCompanies: this.getComapnies(result.facilityTypes),
                    facilityTypeEquipmentTypes: this.getFacilityEquipmentTypes(result.facilityTypes),
                    loading: false,
                    needUpdate: true
                });
        }
    }

    getFacilityEquipmentTypes(facilityTypes) {
        const equipmentTypeMap = {};

        for (const facilityType of facilityTypes) {
            if (facilityType.equipmentType) {
                equipmentTypeMap[facilityType.equipmentType.id] = facilityType.equipmentType;
            }
        }

        const equipmentTypes = [];

        for (const id in equipmentTypeMap) {
            const equipmentType = equipmentTypeMap[id];
            equipmentTypes.push(equipmentType);
        }

        return equipmentTypes;
    }

    getComapnies(items) {
        const companyMap = {};

        for (const item of items) {
            if (item.company) {
                companyMap[item.company.id] = item.company;
            }
        }

        const companies = [];

        for (const id in companyMap) {
            companies.push(companyMap[id]);
        }

        companies.sort((company1, company2) => {
            const name1 = ProjectResource.getCompanyName(company1).toLowerCase();
            const name2 = ProjectResource.getCompanyName(company2).toLowerCase();

            if (name1.startsWith("기본") || name1.startsWith("basic")) {
                return 1;
            }
            else if (name2.startsWith("기본") || name2.startsWith("basic")) {
                return -1;
            }

            if (name1 < name2) {
                return -1;
            }
            else if (name1 > name2) {
                return 1;
            }

            return 0;
        });

        return companies;
    }

    async readRackNItemTypes() {
        const [result, errorMessage] = await EditController.requestRackNItemTypes();

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }

        return result;
    }

    getTypes(items) {
        const typeMap = {};

        for (const item of items) {
            typeMap[item.type] = item.type;
        }

        const types = [];

        for (const typeName in typeMap) {
            types.push(typeName);
        }

        types.sort();
        return types;
    }

    getOptionElements() {
        if (this.state.selectedType === ProjectResource.ID.management.select.rack) {
            return this.getRackOptionElements();
        }
        else if (this.state.selectedType === ProjectResource.ID.management.select.itProperty) {
            return this.getITPropertyElements();
        }

        return this.getFacilityElements();
    }

    getTypeElements(className) {
        return (
            <div className={className}>
                <span>구분</span>
                <select onChange={(e) => this.onSelectType(e)} value={this.state.selectedType}>
                    <option value={ProjectResource.ID.management.select.rack}>{ProjectResource.ID.management.select.rack}</option>
                    <option value={ProjectResource.ID.management.select.itProperty}>{ProjectResource.ID.management.select.itProperty}</option>
                    <option value={ProjectResource.ID.management.select.facility}>{ProjectResource.ID.management.select.facility}</option>
                </select>
            </div>
            );
    }

    getFacilityElements() {
        const elements = [];
        const items = [];

        items.push(
            this.getTypeElements(dash.sortationBoxF)
        );

        let options = [<option value={-1}>{ProjectResource.ID.management.select.all}</option>];

        for (const company of this.state.facilityTypeCompanies) {
            options.push(
                <option value={company.id}>{ProjectResource.getCompanyName(company)}</option>
            );
        }

        items.push(
            <div className={dash.manufacturerBoxF}>
                <span>제조사</span>
                <select onChange={(e) => this.onSelectCompany(e)} value={this.state.selectedCompanyID}>
                    {
                        options
                    }
                </select>
            </div>
        );

        options = [<option value={-1}>{ProjectResource.ID.management.select.all}</option>];

        for (const equipmentType of this.state.facilityTypeEquipmentTypes) {
            options.push(
                <option value={equipmentType.id}>{ProjectResource.getEquipmentTypeName(equipmentType)}</option>
            );
        }

        items.push(
            <div className={dash.categoryBoxF}>
                <span>카테고리</span>
                <select onChange={(e) => this.onSelectEquipmentType(e)} value={this.state.selectedEquipmentType}>
                    {
                        options
                    }
                </select>
            </div>
        );

        elements.push(
            <div className={dash.property3DFlex1}>
                {
                    items
                }
            </div>
        );

        elements.push(
            <div className={dash.property3DFlex2}>
                <div className={dash.modelSearchBoxF}>
                    <div><span className={dash.glassIcon}></span></div>
                    <input ref={this.refSearch} type="text" onKeyUp={(e) => this.onSearch(e)} />
                    <span className={dash.modelSearchBtn} onClick={() => this.onClickSearch()}>검색</span>
                </div>
            </div>
        );

        return elements;
    }

    getITPropertyElements() {
        const elements = [];
        const items = [];

        items.push(
            this.getTypeElements(dash.sortationBoxIT)
        );

        let options = [<option value={-1}>{ProjectResource.ID.management.select.all}</option>];

        for (const company of this.state.itemTypeCompanies) {
            options.push(
                <option value={company.id}>{ProjectResource.getCompanyName(company)}</option>
            );
        }

        items.push(
            <div className={dash.manufacturerBoxIT}>
                <span>제조사</span>
                <select onChange={(e) => this.onSelectCompany(e)} value={this.state.selectedCompanyID}>
                    {
                        options
                    }
                </select>
            </div>
        );

        options = [<option value={""}>{ProjectResource.ID.management.select.all}</option>];

        for (const typeName of this.state.itemTypeDatas) {
            options.push(
                <option value={typeName}>{typeName}</option>
            );
        }

        items.push(
            <div className={dash.kindPropertyBoxIT}>
                <span>종류</span>
                <select onChange={(e) => this.onSelectPropertyType(e)} value={this.state.selectedPropertyType}>
                    {
                        options
                    }
                </select>
            </div>
        );

        options = [<option value={-1}>{ProjectResource.ID.management.select.all}</option>];

        for (let i = 1; i <= 45; i++) {
            options.push(
                <option value={i}>{i.toString()}</option>
            );
        }

        items.push(
            <div className={dash.unitBoxIT}>
                <span>Unit</span>
                <select onChange={(e) => this.onSelectUnit(e)} value={this.state.selectedUnit}>
                    {
                        options
                    }
                </select>
            </div>
        );

        elements.push(
            <div className={dash.property3DFlex1}>
                {
                    items
                }
            </div>
        );

        elements.push(
            <div className={dash.property3DFlex2}>
                <div className={dash.categoryBoxIT}>
                    <span>카테고리</span>
                    <select onChange={(e) => this.onSelectCategory(e)} value={this.state.selectedCategory}>
                        <option value={""}>{ProjectResource.ID.management.select.all}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.network}>{ProjectResource.ID.edit.editPropertyDetail.network}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.backup}>{ProjectResource.ID.edit.editPropertyDetail.backup}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.security}>{ProjectResource.ID.edit.editPropertyDetail.security}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.server}>{ProjectResource.ID.edit.editPropertyDetail.server}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.storage}>{ProjectResource.ID.edit.editPropertyDetail.storage}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.appliance}>{ProjectResource.ID.edit.editPropertyDetail.appliance}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.sanSwitch}>{ProjectResource.ID.edit.editPropertyDetail.sanSwitch}</option>
                        <option value={ProjectResource.ID.edit.editPropertyDetail.etc}>{ProjectResource.ID.edit.editPropertyDetail.etc}</option>
                    </select>
                </div>
                <div className={dash.modelSearchBoxIT}>
                    <div><span className={dash.glassIcon}></span></div>
                    <input ref={this.refSearch} type="text" onKeyUp={(e) => this.onSearch(e)} />
                    <span className={dash.modelSearchBtn} onClick={() => this.onClickSearch()}>검색</span>
                </div>
            </div>
        );
        
        return elements;
    }

    getRackOptionElements() {
        const elements = [];
        const items = [];

        items.push(
            this.getTypeElements(dash.sortationBox)
        );

        let options = [<option value={-1}>{ProjectResource.ID.management.select.all}</option>];

        for (const company of this.state.rackTypeCompanies) {
            options.push(
                <option value={company.id}>{ProjectResource.getCompanyName(company)}</option>
            );
        }

        items.push(
            <div className={dash.manufacturerBox}>
                <span>제조사</span>
                <select onChange={(e) => this.onSelectCompany(e)} value={this.state.selectedCompanyID}>
                    {
                        options
                    }
                </select>
            </div>
        );

        options = [<option value={""}>{ProjectResource.ID.management.select.all}</option>];

        for (const typeName of this.state.rackTyeDatas) {
            options.push(
                <option value={typeName}>{typeName}</option>
            );
        }

        items.push(
            <div className={dash.kindPropertyBox}>
                <span>종류</span>
                <select onChange={(e) => this.onSelectRackType(e)} value={this.state.selectedRackType}>
                    {
                        options
                    }
                </select>
            </div>
        );

        options = [<option value={-1}>{ProjectResource.ID.management.select.all}</option>];

        for (let i = 20; i <= 45; i++) {
            options.push(
                <option value={i}>{i.toString()}</option>
            );
        }

        items.push(
            <div className={dash.unitBox}>
                <span>Unit</span>
                <select onChange={(e) => this.onSelectUnit(e)} value={this.state.selectedUnit}>
                    {
                        options
                    }
                </select>
            </div>
        );

        elements.push(
            <div className={dash.property3DFlex1}>
                {
                    items
                }
            </div>
        );

        elements.push(
            <div className={dash.property3DFlex2}>
                <div className={dash.modelSearchBox}>
                    <div><span className={dash.glassIcon}></span></div>
                    <input ref={this.refSearch} type="text" onKeyUp={(e) => this.onSearch(e)} />
                    <span className={dash.modelSearchBtn} onClick={() => this.onClickSearch()}>검색</span>
                </div>
            </div>
        );

        return elements;
    }

    getTableElements() {
        const elements = [];

        elements.push(
            this.getTableHeaderElements()
        );

        elements.push(
            this.getTableBodyElements()
        );

        return (
            <table ref={this.refTable}>
                {
                    elements
                }
            </table>
                );
    }

    getTableHeaderElements() {
        if (this.state.selectedType === ProjectResource.ID.management.select.rack) {
            return this.getRackTableHeaderElements();
        }
        else if (this.state.selectedType === ProjectResource.ID.management.select.itProperty) {
            return this.getITPropertyTableHeaderElements();
        }

        return this.getFacilityTableHeaderElements();
    }

    getTableBodyElements() {
        if (this.state.selectedType === ProjectResource.ID.management.select.rack) {
            return this.getRackTableBodyElements();
        }
        else if (this.state.selectedType === ProjectResource.ID.management.select.itProperty) {
            return this.getITPropertyTableBodyElements();
        }

        return this.getFacilityTableBodyElements();
    }

    getWDH(w, d, h, unitOfLength) {
        return parseInt(this.toMillimeter(w, unitOfLength)).toString() + " x " + parseInt(this.toMillimeter(d, unitOfLength)).toString() + " x " + parseInt(this.toMillimeter(h, unitOfLength)).toString();
    }

    toMillimeter(size, unitOfLength) {
        if (unitOfLength === wsManager.unitOfLength.cm) {
            return size * 10;
        }
        else if (unitOfLength === wsManager.unitOfLength.m) {
            return size * 1000;
        }

        return size;
    }

    getMemoElement(memoClassName, item, type, clickable) {
        if (clickable) {
            return (
                <td><span className={memoClassName} onClick={() => this.showMemo(item, type)}></span></td>
                );
        }

        return (
            <td><span className={memoClassName}></span></td>
        );
    }

    getCheckBoxElement() {
        if (this.state.editMode) {
            return (
                <td><input type="checkBox" /></td>
            );
        }

        return (
            <td><input type="checkBox" disabled /></td>
        );
    }

    getHeaderCheckBoxElement() {
        if (this.state.editMode) {
            return (
                <input type="checkBox" onClick={() => this.checkAll()} checked={this.state.isCheckedAll} />
            );
        }

        return (
            <input type="checkBox" disabled checked={this.state.isCheckedAll} />
        );
    }

    getmodelNameElement(modelName, modelNameConts, hidden) {
        if (modelName.length > 10) {
            modelNameConts = modelName;
            modelName = modelName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipModelNameR">
                        <span className="tooltipModelNameRTitle">
                            {modelName}
                        </span>
                        <span className="tooltipModelNameRConts tooltip-left">
                            {modelNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{modelName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{modelName}</td>
            );
        }

        return (
            <td>{modelName}</td>
        );
    }

    getCompanyNameElement(company, companyConts, hidden) {
        if (company.length > 10) {
            companyConts = company;
            company = company.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipCompanyNameR">
                        <span className="tooltipCompanyNameRTitle">
                            {company}
                        </span>
                        <span className="tooltipCompanyNameRConts tooltip-left">
                            {companyConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{company}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{company}</td>
            );
        }

        return (
            <td>{company}</td>
        );
    }

    getEquipmentTypeNameElement(equipmentTypeData, equipmentTypeDataConts, hidden) {
        if (equipmentTypeData.length > 10) {
            equipmentTypeDataConts = equipmentTypeData;
            equipmentTypeData = equipmentTypeData.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipEquipment">
                        <span className="tooltipEquipmentTitle">
                            {equipmentTypeData}
                        </span>
                        <span className="tooltipEquipmentConts tooltip-left">
                            {equipmentTypeDataConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{equipmentTypeData}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{equipmentTypeData}</td>
            );
        }

        return (
            <td>{equipmentTypeData}</td>
        );
    }


    getModelNameITElement(modelName, modelNameConts, hidden) {
        if (modelName.length > 10) {
            modelNameConts = modelName;
            modelName = modelName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipModelNameIT">
                        <span className="tooltipModelNameITTitle">
                            {modelName}
                        </span>
                        <span className="tooltipModelNameITConts tooltip-left">
                            {modelNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{modelName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{modelName}</td>
            );
        }

        return (
            <td>{modelName}</td>
        );
    }

    getCompanyNameITElement(company, companyConts, hidden) {
        if (company.length > 10) {
            companyConts = company;
            company = company.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipCompanyNameIT">
                        <span className="tooltipCompanyNameITTitle">
                            {company}
                        </span>
                        <span className="tooltipCompanyNameITConts tooltip-left">
                            {companyConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{company}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{company}</td>
            );
        }

        return (
            <td>{company}</td>
        );
    }

    getEquipmentTypeNameFElement(equipmentType, equipmentTypeConts, hidden) {
        if (equipmentType.length > 10) {
            equipmentTypeConts = equipmentType;
            equipmentType = equipmentType.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipEquipmentF">
                        <span className="tooltipEquipmentFTitle">
                            {equipmentType}
                        </span>
                        <span className="tooltipEquipmentFConts tooltip-left">
                            {equipmentTypeConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{equipmentType}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{equipmentType}</td>
            );
        }

        return (
            <td>{equipmentType}</td>
        );
    }

    getModelNameFElement(modelName, modelNameConts, hidden) {
        if (modelName.length > 10) {
            modelNameConts = modelName;
            modelName = modelName.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipModelNameF">
                        <span className="tooltipModelNameFTitle">
                            {modelName}
                        </span>
                        <span className="tooltipModelNameFConts tooltip-left">
                            {modelNameConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{modelName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{modelName}</td>
            );
        }

        return (
            <td>{modelName}</td>
        );
    }

    getCompanyNameFElement(company, companyConts, hidden) {
        if (company.length > 10) {
            companyConts = company;
            company = company.substring(0, 10) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipCompanyNameF">
                        <span className="tooltipCompanyNameFTitle">
                            {company}
                        </span>
                        <span className="tooltipCompanyNameFConts tooltip-left">
                            {companyConts}
                        </span>
                    </div>
                </td>
            );
        } else {
            return (
                <td>{company}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{company}</td>
            );
        }

        return (
            <td>{company}</td>
        );
    }


    getRackTableBodyElements() {
        const elements = [];
        const beginIndex = (this.state.pageNo - 1) * this.maxLine;

        const rackTypes = [...this.state.rackTypeList];
        const rackTypeCount = rackTypes.length;
        const endIndex = this.state.pageNo * this.maxLine < rackTypeCount ? this.state.pageNo * this.maxLine : rackTypeCount;

        for (let i = beginIndex; i < endIndex; i++) {
            const rackType = rackTypes[i];
            const clickable = rackType.memo && rackType.memo.trim().length > 0;
            const memoClassName = clickable ? dash.memo3DIconAct : (this.state.editMode ? dash.memo3DIconDis + " " + dash.active : dash.memo3DIconDis);

            elements.push(
                <tr>
                    {
                        this.getCheckBoxElement()
                    }
                    <td>랙</td>
                    {
                        this.getmodelNameElement(rackType.modelName, true)
                    }
                    {
                        this.getCompanyNameElement(ProjectResource.getCompanyName(rackType.company), true)
                    }
                    <td>{this.getWDH(rackType.width, rackType.depth, rackType.height, wsManager.unitOfLength.mm)}</td>
                    <td>{rackType.unit}</td>
                    <td>{ProjectResource.getColorName(rackType)}</td>
                    <td>{rackType.type}</td>
                    <td>{this.getDateString(rackType)}</td>
                    <td><span className={dash.view3DIcon} onClick={() => this.show3D(rackType)}></span></td>
                    {
                        this.getMemoElement(memoClassName, rackType, ProjectResource.ID.management.select.rack, this.state.editMode || clickable)
                    }
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

    getITPropertyTableBodyElements() {
        const elements = [];
        const beginIndex = (this.state.pageNo - 1) * this.maxLine;

        const itemTypes = [...this.state.itemTypeList];
        const itemTypeCount = itemTypes.length;
        const endIndex = this.state.pageNo * this.maxLine < itemTypeCount ? this.state.pageNo * this.maxLine : itemTypeCount;

        for (let i = beginIndex; i < endIndex; i++) {
            const itemType = itemTypes[i];

            elements.push(
                <tr>
                    {
                        this.getCheckBoxElement()
                    }
                    <td>IT장비</td>
                    {
                        this.getEquipmentTypeNameElement(ProjectResource.getEquipmentTypeName(itemType.equipmentTypeData), true)
                    }
                    {
                        this.getModelNameITElement(itemType.modelName, true)
                    }
                    {
                        this.getCompanyNameITElement(ProjectResource.getCompanyName(itemType.company), true)
                    }
                    <td>{this.getWDH(itemType.width, itemType.depth, itemType.height, wsManager.unitOfLength.mm)}</td>
                    <td>{itemType.unit}</td>
                    <td>{itemType.type}</td>
                    <td>{this.getDateString(itemType)}</td>
                    <td><span className={dash.view3DIcon} onClick={() => this.show3D(itemType)}></span></td>
                    <td><span className={dash.memo3DIconDis}></span></td>
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

    getFacilityTableBodyElements() {
        const elements = [];
        const beginIndex = (this.state.pageNo - 1) * this.maxLine;

        const facilityTypes = [...this.state.facilityTypeList];
        const facilityTypeCount = facilityTypes.length;
        const endIndex = this.state.pageNo * this.maxLine < facilityTypeCount ? this.state.pageNo * this.maxLine : facilityTypeCount;
        
        for (let i = beginIndex; i < endIndex; i++) {
            const facilityType = facilityTypes[i];

            elements.push(
                <tr>
                    {
                        this.getCheckBoxElement()
                    }
                    <td>설비</td>
                    {
                        this.getEquipmentTypeNameFElement(ProjectResource.getEquipmentTypeName(facilityType.equipmentType), true)
                    }
                    {
                        this.getModelNameFElement(facilityType.modelName, true)
                    }
                    {
                        this.getCompanyNameFElement(ProjectResource.getCompanyName(facilityType.company), true)
                    }
                    <td>{this.getWDH(facilityType.width, facilityType.depth, facilityType.height, facilityType.unitOfLength)}</td>
                    <td>{this.getDateString(facilityType)}</td>
                    <td><span className={dash.view3DIcon} onClick={() => this.show3D(facilityType)}></span></td>
                    <td><span className={dash.memo3DIconDis}></span></td>
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

    show3D(item) {
        if (!this.delayItem || this.delayItem.glbUrl !== item.glbUrl) {
            this.delayItem = item;
            this.setState({ item3D: null, showMemo: { visible: false, item: null, itemType: null }, needUpdate: true });
        }
        else {
            this.setState({ item3D: this.delayItem, showMemo: { visible: false, item: null, itemType: null } });
            this.delayItem = null;
        }
    }

    showMemo(item, type) {
        this.setState({ item3D: null, showMemo: { visible: true, item: item, itemType: type } });
    }

    checkSearchText(searchText, trg) {
        if (!searchText || searchText.length === 0) {
            return true;
        }

        if (!trg) {
            return false;
        }

        return trg.toLowerCase().includes(searchText);
    }

    getRackTableHeaderElements() {
        return (
            <thead>
                <tr>
                    <th style={{ width: '5%' }}>{this.getHeaderCheckBoxElement()}</th>
                    <th style={{ width: '7%' }}>구분</th>
                    <th style={{ width: '12%' }}>모델명</th>
                    <th style={{ width: '12%' }}>제조사</th>
                    <th style={{ width: '15%' }}>크기(W x D x H mm)</th>
                    <th style={{ width: '7%' }}>Unit</th>
                    <th style={{ width: '7%' }}>색상</th>
                    <th style={{ width: '10%' }}>종류</th>
                    <th style={{ width: '10%' }}>등록일자</th>
                    <th style={{ width: '8%' }}>3D 미리보기</th>
                    <th style={{ width: '6%' }}>메모</th>
                </tr>
            </thead>
            );
    }

    getITPropertyTableHeaderElements() {
        return (
            <thead>
                <tr>
                    <th style={{ width: '5%' }}>{this.getHeaderCheckBoxElement()}</th>
                    <th style={{ width: '7%' }}>구분</th>
                    <th style={{ width: '13%' }}>카테고리</th>
                    <th style={{ width: '12%' }}>모델명</th>
                    <th style={{ width: '12%' }}>제조사</th>
                    <th style={{ width: '14%' }}>크기(W x D x H mm)</th>
                    <th style={{ width: '6%' }}>Unit</th>
                    <th style={{ width: '8%' }}>종류</th>
                    <th style={{ width: '10%' }}>등록일자</th>
                    <th style={{ width: '8%' }}>3D 미리보기</th>
                    <th style={{ width: '6%' }}>메모</th>
                </tr>
            </thead>
        );
    }

    getFacilityTableHeaderElements() {
        return (
            <thead>
                <tr>
                    <th style={{ width: '5%' }}>{this.getHeaderCheckBoxElement()}</th>
                    <th style={{ width: '7%' }}>구분</th>
                    <th style={{ width: '17%' }}>카테고리</th>
                    <th style={{ width: '14%' }}>모델명</th>
                    <th style={{ width: '14%' }}>제조사</th>
                    <th style={{ width: '15%' }}>크기(W x D x H mm)</th>
                    <th style={{ width: '14%' }}>등록일자</th>
                    <th style={{ width: '8%' }}>3D 미리보기</th>
                    <th style={{ width: '6%' }}>메모</th>
                </tr>
            </thead>
            );
    }

    checkAll = () => {
        let _isCheckedAll = false;

        let checkBoxes = this.refTable.current.querySelectorAll('input[type="checkbox"]');

        if (!this.state.isCheckedAll) {
            _isCheckedAll = true;

            for (let i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].checked = true;
            }

        } else {
            for (let i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].checked = false;
            }
        }

        this.setState({ isCheckedAll: _isCheckedAll });

    }

    onSelectType(e) {
        const selectedType = e.target.value;

        if (selectedType !== this.state.selectedType) {
            this.setState({ selectedType: e.target.value, selectedCompanyID: -1, selectedPropertyType: "", selectedRackType: "", selectedUnit: -1, selectedCategory: "", selectedEquipmentType: -1, isCheckedAll: false, needUpdate: true });
        }
    }

    onSelectPropertyType(e) {
        this.setState({ selectedPropertyType: e.target.value, needUpdate: true });
    }

    onSelectUnit(e) {
        this.setState({ selectedUnit: parseInt(e.target.value), needUpdate: true });
    }

    onSelectCategory(e) {
        this.setState({ selectedCategory: e.target.value, needUpdate: true });
    }

    onSelectCompany(e) {
        this.setState({ selectedCompanyID: parseInt(e.target.value), needUpdate: true });
    }

    onSelectRackType(e) {
        this.setState({ selectedRackType: e.target.value, needUpdate: true });
    }

    onSelectEquipmentType(e) {
        this.setState({ selectedEquipmentType: parseInt(e.target.value), needUpdate: true });
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            this.onClickSearch();
        }
    }

    onClickSearch() {
        if (!this.refSearch.current) {
            return;
        }

        const searchText = this.refSearch.current.value ? this.refSearch.current.value.trim().toLowerCase() : null;

        if (this.state.selectedType === ProjectResource.ID.management.select.rack) {
            this.searchRackType(searchText, this.state.selectedCompanyID, this.state.selectedRackType, this.state.selectedUnit);
        }
        else if (this.state.selectedType === ProjectResource.ID.management.select.itProperty) {
            this.searchItemType(searchText, this.state.selectedCompanyID, this.state.selectedPropertyType, this.state.selectedUnit, this.state.selectedCategory);
        }
        else {
            this.searchFacilityType(searchText, this.state.selectedCompanyID, this.state.selectedEquipmentType);
        }
    }

    getDateString(item) {
        if (!item.regDate || item.regDate.length < 10) {
            return "";
        }

        const year = item.regDate.substring(0, 4);
        const month = item.regDate.substring(5, 7);
        const day = item.regDate.substring(8, 10);

        if (isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
            return "";
        }

        return year + "." + month + "." + day;
    }

    searchRackType(searchText, selectedCompanyID, selectedRackType, selectedUnit) {
        const rackTypes = [];
        let count = 0;

        for (const rackType of this.state.rackTypes) {
            let valid = false;

            if (selectedCompanyID >= 0) {
                if (rackType.company.id !== selectedCompanyID) {
                    continue;
                }
            }

            if (selectedRackType && selectedRackType.length > 0) {
                if (rackType.type !== selectedRackType) {
                    continue;
                }
            }

            if (selectedUnit >= 0) {
                if (rackType.unit !== selectedUnit) {
                    continue;
                }
            }

            if (this.checkSearchText(searchText, rackType.modelName) ||
                this.checkSearchText(searchText, ProjectResource.getCompanyName(rackType.company)) ||
                this.checkSearchText(searchText, this.getWDH(rackType.width, rackType.depth, rackType.height, wsManager.unitOfLength.mm)) ||
                this.checkSearchText(searchText, rackType.unit.toString()) ||
                this.checkSearchText(searchText, ProjectResource.getColorName(rackType)) ||
                this.checkSearchText(searchText, rackType.type) ||
                this.checkSearchText(searchText, this.getDateString(rackType))) {
                valid = true;
            }

            if (!valid) {
                continue;
            }

            rackTypes.push(rackType);
            count++;
        }

        const totalPage = this.calcTotalPage(count);

        if (this.delayItem) {
            this.setState({ item3D: this.delayItem, searchText, selectedCompanyID, selectedRackType, selectedUnit, rackTypeList: rackTypes, pageNo: 1, totalPage, needUpdate: false });
        }
        else {
            this.setState({ searchText, selectedCompanyID, selectedRackType, selectedUnit, rackTypeList: rackTypes, pageNo: 1, totalPage, needUpdate: false });
        }
    }

    searchItemType(searchText, selectedCompanyID, selectedPropertyType, selectedUnit, selectedCategory) {
        const itemTypes = [];
        let count = 0;

        for (const itemType of this.state.itemTypes) {
            let valid = false;

            if (selectedCompanyID >= 0) {
                if (itemType.company.id !== selectedCompanyID) {
                    continue;
                }
            }

            if (selectedPropertyType && selectedPropertyType.length > 0) {
                if (itemType.type !== selectedPropertyType) {
                    continue;
                }
            }

            if (selectedUnit >= 0) {
                if (itemType.unit !== selectedUnit) {
                    continue;
                }
            }

            if (selectedCategory && selectedCategory.length > 0) {
                if (ProjectResource.getEquipmentTypeName(itemType.equipmentTypeData) !== selectedCategory) {
                    continue;
                }
            }

            if (this.checkSearchText(searchText, ProjectResource.getEquipmentTypeName(itemType.equipmentTypeData)) ||
                this.checkSearchText(searchText, itemType.modelName) ||
                this.checkSearchText(searchText, ProjectResource.getCompanyName(itemType.company)) ||
                this.checkSearchText(searchText, this.getWDH(itemType.width, itemType.depth, itemType.height, wsManager.unitOfLength.mm)) ||
                this.checkSearchText(searchText, itemType.unit.toString()) ||
                this.checkSearchText(searchText, itemType.type) ||
                this.checkSearchText(searchText, this.getDateString(itemType))) {
                valid = true;
            }

            if (!valid) {
                continue;
            }

            itemTypes.push(itemType);
            count++;
        }

        const totalPage = this.calcTotalPage(count);

        if (this.delayItem) {
            this.setState({ item3D: this.delayItem, searchText, selectedCompanyID, selectedPropertyType, selectedUnit, selectedCategory, itemTypeList: itemTypes, pageNo: 1, totalPage, needUpdate: false });
        }
        else {
            this.setState({ searchText, selectedCompanyID, selectedPropertyType, selectedUnit, selectedCategory, itemTypeList: itemTypes, pageNo: 1, totalPage, needUpdate: false });
        }
    }

    searchFacilityType(searchText, selectedCompanyID, selectedEquipmentType) {
        const facilityTypes = [];
        let count = 0;

        for (const facilityType of this.state.facilityTypes) {
            let valid = false;

            if (selectedCompanyID >= 0) {
                if (facilityType.company.id !== selectedCompanyID) {
                    continue;
                }
            }

            if (selectedEquipmentType >= 0) {
                if (facilityType.equipmentType.id !== selectedEquipmentType) {
                    continue;
                }
            }

            if (this.checkSearchText(searchText, ProjectResource.getEquipmentTypeName(facilityType.equipmentType)) ||
                this.checkSearchText(searchText, facilityType.modelName) ||
                this.checkSearchText(searchText, ProjectResource.getCompanyName(facilityType.company)) ||
                this.checkSearchText(searchText, this.getWDH(facilityType.width, facilityType.depth, facilityType.height, facilityType.unitOfLength)) ||
                this.checkSearchText(searchText, this.getDateString(facilityType))) {
                valid = true;
            }

            if (!valid) {
                continue;
            }

            facilityTypes.push(facilityType);
            count++;
        }

        const totalPage = this.calcTotalPage(count);

        if (this.delayItem) {
            this.setState({ item3D: this.delayItem, searchText, selectedCompanyID, selectedEquipmentType, facilityTypeList: facilityTypes, pageNo: 1, totalPage, needUpdate: false });
        }
        else {
            this.setState({ searchText, selectedCompanyID, selectedEquipmentType, facilityTypeList: facilityTypes, pageNo: 1, totalPage, needUpdate: false });
        }
    }

    calcTotalPage(count) {
        if (count < this.maxLine) {
            return null;
        }

        if (count % this.maxLine === 0) {
            return count / this.maxLine;
        }

        return parseInt(count / this.maxLine) + 1;
    }

    getPageAreaElements() {
        if (this.state.totalPage !== null) {
            const leftClassName = this.state.pageNo > 1 ? dash.leftArrowIcon + " " + dash.active : dash.leftArrowIcon;
            const rightClassName = this.state.pageNo < this.state.totalPage ? dash.rightArrowIcon + " " + dash.active : dash.rightArrowIcon;

            return (
                <div className={dash.pageArea3D}>
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

    allClearCheck() {
        const checkBoxes = this.refTable.current.querySelectorAll('input[type="checkbox"]');

        if (checkBoxes) {
            for (let i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].checked = false;
            }
        }

        this.setState({ isCheckedAll: false });
    }

    show3DItem() {
        const item = this.state.item3D;

        return (
            <div className={dash.viewerBox3D + " " + CommonResource.UISection}>
                <Viewer url={item.glbUrl} show3DItem={this.close3DView} itemModelName={item.modelName} itemType={this.state.selectedType} />
            </div>
            );
    }

    close3DView = (params) => {
        this.setState({ item3D: null });
    }

    enableEdit() {
        const user = this.props.user;

        if (user && user.levelID <= AccountResource.accountLevel.vdsManager) {
            return true;
        }

        return false;
    }

    toggleEdit() {
        this.setState({ editMode: !this.state.editMode });
    }

    onClickSave() {
        if (this.state.editMode && this.state.isChanged) {
            this.props.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, "저장하시겠습니까?", ["취소", "확인"], (index) => this.onClickSaveData(index), ConfirmDialog.icon.save);
        }
    }

    onClickSaveData(index) {
        this.props.onCloseConfirmDialog();

        if (index === 1) {
            this.editDataManager.save();
        }
    }

    getEditElement(editClassName) {
        if (this.enableEdit()) {
            return (
                <span className={editClassName} onClick={() => this.toggleEdit()}></span>
            );
        }

        return (
            <span className={editClassName}></span>
            );
    }

    getTextAreaElement(editMode) {
        if (editMode) {
            return (
                <textarea ref={this.refMemo}>{this.state.showMemo.item?.memo}</textarea>
            );
        }

        return (
            <textarea ref={this.refMemo} disabled>{this.state.showMemo.item?.memo}</textarea>
        );
    }

    onCloseMemo(saveMemo) {
        const item = this.state.showMemo.item;

        if (saveMemo && this.state.editMode && item) {
            const memo = this.refMemo.current.value ? this.refMemo.current.value.trim() : null;
            item.memo = memo;

            if (this.state.showMemo.itemType === ProjectResource.ID.management.select.rack) {
                this.editDataManager.updateRackType(item);
            }
            else if (this.state.showMemo.itemType === ProjectResource.ID.management.select.itProperty) {
                this.editDataManager.updateItemType(item);
            }
            else {
                this.editDataManager.updateFacilityType(item);
            }

            this.setState({
                isChanged: this.editDataManager.isChanged(), showMemo: { visible: false, item: null, itemType: null }
            });
        }
        else {
            this.setState({
                showMemo: { visible: false, item: null, itemType: null }
            });
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <></>
                );
        }

        const enableEdit = this.enableEdit();
        const editClassName = enableEdit ? (this.state.editMode ? dash.removeIconAct : dash.removeIcon) : dash.removeIconDisabled;
        const saveClassName = this.state.editMode && this.state.isChanged ? dash.saveDiskIconAct : dash.saveDiskIcon;

        return (
            <>
                <div style={{ display: 'flex' }}>
                    <span className={dash.userRightTitle}>3D 자산목록</span>
                    <span className={dash.managementClose} onClick={() => this.props.onClose()}></span>
                </div>

                {/* rack 3D 자산목록 */}
                <div>
                    {
                        this.getOptionElements()
                    }
                </div>

                <div className={dash.userFlexVDSBox}>
                    {
                        this.getEditElement(editClassName)
                    }
                    <span className={dash.removeText}>편집</span>
                    <span className={saveClassName} onClick={() => this.onClickSave()}></span>
                    <span className={dash.saveText}>저장</span>
                </div>

                <div className={dash.property3DTable}>
                    {
                        this.getTableElements()
                    }
                </div> 

                {
                    this.getPageAreaElements()
                }

                {
                    this.state.item3D &&
                    this.show3DItem()
                }

                {/* 메모팝업창 */}
                {
                    this.state.showMemo.visible &&
                    <div className={dash.userMemoPopBox} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className={dash.userMemoTitle}>
                            <span>메모작성</span>
                            <span className={dash.memoCloseIcon} onClick={() => this.onCloseMemo(false)}></span>
                        </div>
                        <div className={dash.memoContents}>
                            {
                                this.getTextAreaElement(this.state.editMode)
                            }
                        </div>
                        <span className={dash.memoConfirmBtn} onClick={() => this.onCloseMemo(true)}>확인</span>
                    </div>
                }
           </>
        )
    }
}
export default Property3DList;

class Property3DEditManager {
    constructor(owner) {
        this.owner = owner;

        this.setDatas(this.owner.state.rackTypes, this.owner.state.itemTypes, this.owner.state.facilityTypes);
    }

    setDatas(rackTypes, itemTypes, facilityTypes) {
        this.originRackTypes = this.copyDatas(rackTypes);
        this.originItemTypes = this.copyDatas(itemTypes);
        this.originFacilityTypes = this.copyDatas(facilityTypes);

        this.updateRackTypes = {};
        this.updateItemTypes = {};
        this.updateFacilityTypes = {};
    }

    copyDatas(datas) {
        const copyDatas = {};

        for (const data of datas) {
            const copyData = { ...data };
            copyDatas[copyData.id] = copyData;
        }

        return copyDatas;
    }

    updateRackType(rackType) {
        const originRackType = this.originRackTypes[rackType.id];

        if (originRackType && this.isSame(originRackType, rackType)) {
            delete this.updateRackTypes[rackType.id];
        }
        else {
            this.updateRackTypes[rackType.id] = rackType;
        }
    }

    updateItemType(itemType) {
        const originItemType = this.originItemTypes[itemType.id];

        if (originItemType && this.isSame(originItemType, itemType)) {
            delete this.updateItemTypes[itemType.id];
        }
        else {
            this.updateItemTypes[itemType.id] = itemType;
        }
    }

    updateFacilityType(facilityType) {
        const originFacilityType = this.originFacilityTypes[facilityType.id];

        if (originFacilityType && this.isSame(originFacilityType, facilityType)) {
            delete this.updateFacilityTypes[facilityType.id];
        }
        else {
            this.updateFacilityTypes[facilityType.id] = facilityType;
        }
    }

    isSame(originData, data) {
        const empty1 = !originData.memo || originData.memo.trim().length === 0;
        const empty2 = !data.memo || data.memo.trim().length === 0;

        if (empty1 && empty2) {
            return true;
        }
        else if (empty1 || empty2) {
            return false;
        }

        return originData.memo === data.memo;
    }

    isChanged() {
        for (const id in this.updateRackTypes) {
            return true;
        }

        for (const id in this.updateItemTypes) {
            return true;
        }

        for (const id in this.updateFacilityTypes) {
            return true;
        }

        return false;
    }

    rollBack() {
        for (const id in this.originRackTypes) {
            const originRackType = this.originRackTypes[id];
            const rackType = this.owner.state.rackTypes[id];

            if (rackType) {
                rackType.memo = originRackType.memo;
            }
        }

        for (const id in this.originItemTypes) {
            const originItemType = this.originItemTypes[id];
            const itemType = this.owner.state.itemTypes[id];

            if (itemType) {
                itemType.memo = originItemType.memo;
            }
        }

        for (const id in this.originFacilityTypes) {
            const originFacilityType = this.originFacilityTypes[id];
            const facilityType = this.owner.state.facilityTypes[id];

            if (facilityType) {
                facilityType.memo = originFacilityType.memo;
            }
        }

        this.updateRackTypes = {};
        this.updateItemTypes = {};
        this.updateFacilityTypes = {};

        this.owner.setState({ isChanged: false });
    }

    async save() {
        const [result, message] = await ManagementController.requestEditTypeData(this.updateRackTypes, this.updateItemTypes, this.updateFacilityTypes);

        if (result) {
            this.setDatas(result.rackTypes, result.itemTypes, result.facilityTypes);

            this.owner.setState({ isChanged: false });
            this.owner.reloadDatas(result);
        }
        else {
            this.owner.props.alertMessage(message, ProjectResource.ID.messageBox.title.error);
        }
    }
}