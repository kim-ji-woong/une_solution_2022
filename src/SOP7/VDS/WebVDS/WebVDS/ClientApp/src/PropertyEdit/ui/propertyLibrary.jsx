import React, { Component } from 'react';
import $ from 'jquery';

import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';
import EditController from '../services/editController';
import Edit from './edit';
import wsManager from '../../Root/services/wsManager';
import '../../Dashboard/css/dash.css';


class PropertyLibrary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedType: ProjectResource.ID.edit.editPropertyDetail.rack,
            selectedItemTypes: this.initSelectedItemTypes(),
            showPopup: false,
            selectedItem: null,
            searchText: null
        }

        this.refSearch = React.createRef();
        this.propertySelections = this.initPropertySelections();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    initSelectedItemTypes() {
        const itemTypes = {};

        itemTypes[ProjectResource.ID.edit.editPropertyDetail.rack] = ProjectResource.ID.edit.editPropertyDetail.all;
        itemTypes[ProjectResource.ID.edit.editPropertyDetail.itProperty] = ProjectResource.ID.edit.editPropertyDetail.all;
        itemTypes[ProjectResource.ID.edit.editPropertyDetail.facility] = ProjectResource.ID.edit.editPropertyDetail.all;
        /*itemTypes[ProjectResource.ID.edit.editPropertyDetail.etc] = ProjectResource.ID.edit.editPropertyDetail.all;*/

        return itemTypes;
    }

    initPropertySelections() {
        const selection = [];

        selection.push(ProjectResource.ID.edit.editPropertyDetail.rack);
        selection.push(ProjectResource.ID.edit.editPropertyDetail.itProperty);
        selection.push(ProjectResource.ID.edit.editPropertyDetail.facility);
        /*selection.push(ProjectResource.ID.edit.editPropertyDetail.etc);*/

        return selection;
    }

    getSelectionElements() {
        const options = [];

        for (const selection of this.propertySelections) {
            if (selection !== this.state.selectedType) {
                options.push(
                    <option>{selection}</option>
                );
            }
            else {
                options.push(
                    <option checked>{selection}</option>
                );
            }
        }

        return options;
    }

    selectType(e) {
        this.setState({ selectedType: e.target.value, showPopup: false });
    }

    selectItemType(type, itemType) {
        const selectedItemTypes = { ...this.state.selectedItemTypes };
        selectedItemTypes[type] = itemType;
        this.setState({ selectedItemTypes, showPopup: false });
    }

    rackTypePopups() {
        const itemType = this.state.selectedItemTypes[ProjectResource.ID.edit.editPropertyDetail.rack];

        const allClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.all ? edit.intireBox + " " + edit.selected : edit.intireBox;
        const serverClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.server ? edit.serverBox + " " + edit.selected : edit.serverBox;
        const networkClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.network ? edit.networkBox + " " + edit.selected : edit.networkBox;
        const etcClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.etc ? edit.etcBox + " " + edit.selected : edit.etcBox;

        return (
            <div className={edit.rackKindBox}>
                <span className={edit.rackKindTitle}>{ProjectResource.ID.edit.editPropertyDetail.rackTypes}</span>
                <span className={edit.rackKindBox1}>
                    <span className={allClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.rack, ProjectResource.ID.edit.editPropertyDetail.all)}>{ProjectResource.ID.edit.editPropertyDetail.all}</span>
                    <span className={serverClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.rack, ProjectResource.ID.edit.editPropertyDetail.server)}>{ProjectResource.ID.edit.editPropertyDetail.server}</span>
                </span>
                <span className={edit.rackKindBox2}>
                    <span className={networkClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.rack, ProjectResource.ID.edit.editPropertyDetail.network)}>{ProjectResource.ID.edit.editPropertyDetail.network}</span>
                    <span className={etcClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.rack, ProjectResource.ID.edit.editPropertyDetail.etc)}>{ProjectResource.ID.edit.editPropertyDetail.etc}</span>
                </span>
            </div>
        );
    }

    itPropertyPopups() {
        const itemType = this.state.selectedItemTypes[ProjectResource.ID.edit.editPropertyDetail.itProperty];

        const allClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.all ? edit.intireBox + " " + edit.selectBox : edit.intireBox;
        const serverClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.server ? edit.serverBox + " " + edit.selectBox : edit.serverBox;
        const storageClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.storage ? edit.storageBox + " " + edit.selectBox : edit.storageBox;
        const backupClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.backup ? edit.backupBox + " " + edit.selectBox : edit.backupBox;
        const networkClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.network ? edit.networkBox + " " + edit.selectBox : edit.networkBox;
        const sanSwitchClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.sanSwitch ? edit.sanBox + " " + edit.selectBox : edit.sanBox;
        const applianceClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.appliance ? edit.applicationBox + " " + edit.selectBox : edit.applicationBox;
        const etcClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.etc ? edit.etcBox + " " + edit.selectBox : edit.etcBox;
        const securityClassName = itemType === ProjectResource.ID.edit.editPropertyDetail.security ? edit.securityBox + " " + edit.selectBox : edit.securityBox;

        return (
            <div className={edit.itKindBox}>
                <span className={edit.itKindBoxTitle}>{ProjectResource.ID.edit.editPropertyDetail.itPropertyTypes}</span>
                <span className={edit.itKindBox1}>
                    <span className={allClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.all)}>{ProjectResource.ID.edit.editPropertyDetail.all}</span>
                    <span className={networkClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.network)}>{ProjectResource.ID.edit.editPropertyDetail.network}</span>
                </span>
                <span className={edit.itKindBox2}>
                    <span className={backupClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.backup)}>{ProjectResource.ID.edit.editPropertyDetail.backup}</span>
                    <span className={securityClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.security)}>{ProjectResource.ID.edit.editPropertyDetail.security}</span>
                </span>
                <span className={edit.itKindBox3}>
                    <span className={serverClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.server)}>{ProjectResource.ID.edit.editPropertyDetail.server}</span>
                    <span className={storageClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.storage)}>{ProjectResource.ID.edit.editPropertyDetail.storage}</span>
                </span>
                <span className={edit.itKindBox4}>
                    <span className={applianceClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.appliance)}>{ProjectResource.ID.edit.editPropertyDetail.appliance}</span>
                    <span className={sanSwitchClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.sanSwitch)}>{ProjectResource.ID.edit.editPropertyDetail.sanSwitch}</span>
                </span>
                <span className={edit.itKindBox5}>
                    <span className={etcClassName} onClick={() => this.selectItemType(ProjectResource.ID.edit.editPropertyDetail.itProperty, ProjectResource.ID.edit.editPropertyDetail.etc)}>{ProjectResource.ID.edit.editPropertyDetail.etc}</span>
                </span>
            </div>
        );
    }

    getHeaderElements() {
        if (this.state.selectedType === ProjectResource.ID.edit.editPropertyDetail.rack) {
            return (
                <tr>
                    <th style={{ width: '8%' }}>{ProjectResource.ID.edit.editPropertyDetail.no}</th>
                    <th style={{ width: '32%' }}>{ProjectResource.ID.edit.editPropertyDetail.modelName}</th>
                    <th style={{ width: '20%' }}>{ProjectResource.ID.edit.editPropertyDetail.width}</th>
                    <th style={{ width: '20%' }}>{ProjectResource.ID.edit.editPropertyDetail.depth}</th>
                    <th style={{ width: '20%' }}>{ProjectResource.ID.edit.editPropertyDetail.height}</th>
                </tr>
            );
        } else if (this.state.selectedType === ProjectResource.ID.edit.editPropertyDetail.facility) {
            return (
                <tr>
                    <th style={{ width: '8%' }}>{ProjectResource.ID.edit.editPropertyDetail.no}</th>
                    <th style={{ width: '28%' }}>{ProjectResource.ID.edit.editPropertyDetail.category}</th>
                    <th style={{ width: '30%' }}>{ProjectResource.ID.edit.editPropertyDetail.modelName}</th>
                    <th style={{ width: '34%' }}>{ProjectResource.ID.edit.editPropertyDetail.wdh}</th>
                </tr>
            );
        }

        return (
            <tr>
                <th style={{ width: '8%' }}>{ProjectResource.ID.edit.editPropertyDetail.no}</th>
                <th style={{ width: '30%' }}>{ProjectResource.ID.edit.editPropertyDetail.modelName}</th>
                <th style={{ width: '20%' }}>{ProjectResource.ID.edit.editPropertyDetail.company}</th>
                <th style={{ width: '35%' }}>{ProjectResource.ID.edit.editPropertyDetail.wdh}</th>
                <th style={{ width: '8%' }}>{ProjectResource.ID.edit.editPropertyDetail.type}</th>
            </tr>
            );
    }

    getItemElements(user) {
        if (this.state.selectedType === ProjectResource.ID.edit.editPropertyDetail.rack) {
            return this.getRackElements(user);
        }
        else if (this.state.selectedType === ProjectResource.ID.edit.editPropertyDetail.itProperty) {
            return this.getRackItemElements(user);
        }

        return this.getFacilityElements(user);
    }

    getCategoryName(categoryName, hidden) {
        if (categoryName.length > 8) {
            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipCategoryName">
                        <span className="tooltipCategoryTitle">
                            {categoryName}
                        </span>
                        <span className="tooltipCategoryConts tooltip-left">
                            {categoryName}
                        </span>
                    </div>
                </td>
            );
        }

        if (hidden) {
            return (
                <td /* className={dash.textHidden} */>{categoryName}</td>
            );
        }

        return (
            <td>{categoryName}</td>
        );
    }


    getFacilityLengths(getWDH_mm, getWDH_mmConts, hidden) {
        if (getWDH_mm.length > 16) {
            getWDH_mmConts = getWDH_mm;
            getWDH_mm = getWDH_mm.substring(0, 16) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipFacilityL">
                        <span className="tooltipFacilityLTitle">
                            {getWDH_mm}
                        </span>
                        <span className="tooltipFacilityLConts tooltip-left">
                            {getWDH_mmConts}
                        </span>
                    </div>
                </td>
            );
        }

        if (hidden) {
            return (
                <td>{getWDH_mm}</td>
            );
        }

        return (
            <td>{getWDH_mm}</td>
        );
    }


    getITModelName(modelName, hidden) {
        if (modelName.length > 10) {
            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipModelName">
                        <span className="tooltipModelNameTitle">
                            {modelName}
                        </span>
                        <span className="tooltipModelNameConts tooltip-left">
                            {modelName}
                        </span>
                    </div>
                </td>
            );
        }

        if (hidden) {
            return (
                <td /* className={dash.textHidden} */>{modelName}</td>
            );
        }

        return (
            <td>{modelName}</td>
        );
    }


    getITCompanyName(company, hidden) {
        if (company.length > 5) {
            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipITCompanyName">
                        <span className="tooltipITCompanyNameTitle">
                            {company}
                        </span>
                        <span className="tooltipITCompanyNameConts tooltip-left">
                            {company}
                        </span>
                    </div>
                </td>
            );
        }

        if (hidden) {
            return (
                <td /* className={dash.textHidden} */>{company}</td>
            );
        }

        return (
            <td>{company}</td>
        );
    }


    getFacilityElements(user) {
        const facilityTypes = this.props.facilityTypes;
        const sensorTypes = this.props.sensorTypes;

        const items = [];
        let index = 1;
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        const editable = Edit.isEditableUser(user);

        for (const facilityType of facilityTypes) {
            const spanClassName = facilityType === this.state.selectedItem ? edit.propertyTrSpan + " " + edit.selected : edit.propertyTrSpan;

            if (this.checkSearchText_facilityType(searchText, facilityType) === false) {
                continue;
            }

            const categoryName = facilityType.equipmentType ? ProjectResource.getEquipmentTypeName(facilityType.equipmentType) : "";


            if (this.props.item || !editable) {
                items.push(
                    <span className={spanClassName} onClick={() => this.onSelectItem(facilityType)}>
                        <tr>
                            <td>{index++}</td>
                                {
                                    this.getCategoryName(categoryName, true)
                                }
                            <td>{facilityType.modelName}</td>
                            {/* <td>{this.getWDH_mm(facilityType)}</td> */}
                            <td>
                                {
                                    this.getFacilityLengths(this.getWDH_mm(facilityType), true)
                                }
                            </td>
                        </tr>
                    </span>
                );
            }
            else {
                items.push(
                    <span className={spanClassName} onClick={() => this.onSelectItem(facilityType)}>
                        <tr draggable="true" onDragStart={(e) => this.onDragStartFacilityType(e, facilityType)} onDragEnd={() => this.onDragEndFacilityType()}>
                            <td>{index++}</td>
                            {
                                this.getCategoryName(categoryName, true)
                            }
                            <td>{facilityType.modelName}</td>
                            {/* <td>{this.getWDH_mm(facilityType)}</td> */}
                            <td>
                                {
                                    this.getFacilityLengths(this.getWDH_mm(facilityType), true)
                                }
                            </td>
                        </tr>
                    </span>
                );
            }

            if (facilityType === this.state.selectedItem) {
                if (facilityType.imageUrl && facilityType.imageUrl.length > 0) {
                    const imgUrl = facilityType.imageUrl.startsWith("/") ? ProjectResource.baseUrl + facilityType.imageUrl : ProjectResource.baseUrl + "/" + facilityType.imageUrl;

                    items.push(
                        <span className={edit.propertyRackImage2}>
                            {/* <image source={imgUrl} /> */}
                            <span className={edit.propertyImage}>
                                <img src={imgUrl} className={edit.rackImage2} />
                            </span>
                            <span className={edit.property3DIcon} onClick={() => this.props.show3DItem(facilityType.glbUrl, facilityType.modelName, ProjectResource.ID.edit.editPropertyDetail.facility)}></span>
                        </span>
                    );
                }
            }
        }

        for (const sensorType of sensorTypes) {
            const spanClassName = sensorType === this.state.selectedItem ? edit.propertyTrSpan + " " + edit.selected : edit.propertyTrSpan;

            if (this.checkSearchText_sensorType(searchText, sensorType) === false) {
                continue;
            }

            if (this.props.item || !editable) {
                items.push(
                    <span className={spanClassName} onClick={() => this.onSelectItem(sensorType)}>
                        <tr>
                            <td>{index++}</td>
                            {
                                this.getCategoryName(sensorType.category, true)
                            }
                            <td>{ProjectResource.getSensorTypeName(sensorType)}</td>
                            <td>-</td>
                        </tr>
                    </span>
                );
            }
            else {
                items.push(
                    <span className={spanClassName} onClick={() => this.onSelectItem(sensorType)}>
                        <tr draggable="true" onDragStart={(e) => this.onDragStartSensorType(e, sensorType)} onDragEnd={() => this.onDragEndSensorType()}>
                            <td>{index++}</td>
                            {
                                this.getCategoryName(sensorType.category, true)
                            }
                            <td>{ProjectResource.getSensorTypeName(sensorType)}</td>
                            <td>-</td>
                        </tr>
                    </span>
                );
            }

            if (sensorType === this.state.selectedItem) {
                if (sensorType.imageUrl && sensorType.imageUrl.length > 0) {
                    const imgUrl = sensorType.imageUrl.startsWith("/") ? ProjectResource.baseUrl + sensorType.imageUrl : ProjectResource.baseUrl + "/" + sensorType.imageUrl;

                    items.push(
                        <span className={edit.propertyRackImage2}>
                            <span className={edit.propertyImage}>
                                <img src={imgUrl} className={edit.rackImage} />
                            </span>
                        </span>
                    );
                }
            }
        }

        return items;
    }

    getRackElements(user) {
        const rackTypes = this.props.rackTypes;
        
        const items = [];
        let index = 1;
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        const editable = Edit.isEditableUser(user);

        for (const rackType of rackTypes) {
            const spanClassName = rackType === this.state.selectedItem ? edit.propertyTrSpan + " " + edit.selected : edit.propertyTrSpan;

            if (this.checkSearchText_rackType(searchText, rackType) === false) {
                continue;
            }

            if (this.props.item || !editable) {
                items.push(
                    <span className={spanClassName} onClick={() => this.onSelectItem(rackType)}>
                        <tr>
                            <td>{index++}</td>
                            <td>{rackType.modelName}</td>
                            <td>{parseInt(rackType.width)}</td>
                            <td>{parseInt(rackType.depth)}</td>
                            <td>{parseInt(rackType.height)}</td>
                        </tr>
                    </span>
                );
            }
            else {
                items.push(
                    <span className={spanClassName} onClick={() => this.onSelectItem(rackType)}>
                        <tr draggable="true" onDragStart={(e) => this.onDragStartRackType(e, rackType)} onDragEnd={() => this.onDragEndRackType()}>
                            <td>{index++}</td>
                            <td>{rackType.modelName}</td>
                            <td>{parseInt(rackType.width)}</td>
                            <td>{parseInt(rackType.depth)}</td>
                            <td>{parseInt(rackType.height)}</td>
                        </tr>
                    </span>
                );
            }

            if (rackType === this.state.selectedItem) {
                if (rackType.imageUrl && rackType.imageUrl.length > 0) {
                    const imgUrl = rackType.imageUrl.startsWith("/") ? ProjectResource.baseUrl + rackType.imageUrl : ProjectResource.baseUrl + "/" + rackType.imageUrl;

                    items.push(
                        <span className={edit.propertyRackImage2}>
                            {/* <image source={imgUrl} /> */}
                            <span className={edit.propertyImage}>
                                <img src={imgUrl} className={edit.rackImageFacility} />
                            </span>
                            <span className={edit.property3DIcon} onClick={() => this.props.show3DItem(rackType.glbUrl, rackType.modelName, ProjectResource.ID.edit.editPropertyDetail.rack)}></span>
                        </span>
                    );
                }
            }
        }

        return items;
    }

    onDragStartSensorType(e, sensorType) {
        e.dataTransfer.setData("text/plain", sensorType.id);
        e.dataTransfer.dropEffect = "copy";

        this.props.setDragItem(sensorType, Edit.dragType.sensorType);
    }

    onDragEndSensorType() {
        this.props.setDragItem(null, Edit.dragType.sensorType);
    }

    onDragStartFacilityType(e, facilityType) {
        e.dataTransfer.setData("text/plain", facilityType.id);
        e.dataTransfer.dropEffect = "copy";

        this.props.setDragItem(facilityType, Edit.dragType.facilityType);
    }

    onDragEndFacilityType() {
        this.props.setDragItem(null, Edit.dragType.facilityType);
    }

    onDragStartRackType(e, rackType) {
        e.dataTransfer.setData("text/plain", rackType.id);
        e.dataTransfer.dropEffect = "copy";

        this.props.setDragItem(rackType, Edit.dragType.rackType);
    }

    onDragEndRackType() {
        this.props.setDragItem(null, Edit.dragType.rackType);
    }

    onDragStart(e, itemType) {
        e.dataTransfer.setData("text/plain", itemType.id);
        e.dataTransfer.dropEffect = "copy";

        this.props.setDragItem(itemType, Edit.dragType.itemType);
    }

    checkItem(selectedItemTypeName, itemType) {
        /*if (selectedItemTypeName === "서버" || selectedItemTypeName.toLowerCase() === "server") {
            const targetName = ProjectResource.getEquipmentTypeName(itemType.equipmentTypeData).toLowerCase();

            if (targetName === "box" || targetName === "박스" || targetName === selectedItemTypeName) {
                return true;
            }
        }
        else */if (selectedItemTypeName === ProjectResource.ID.edit.editPropertyDetail.all || ProjectResource.getEquipmentTypeName(itemType.equipmentTypeData) === selectedItemTypeName) {
            return true;
        }

        return false;
    }

    toMilimeter(size, unitOfLength) {
        if (unitOfLength === wsManager.unitOfLength.cm) {
            return size * 10;
        }
        else if (unitOfLength === wsManager.unitOfLength.m) {
            return size * 1000;
        }

        return size;
    }

    getWDH_mm(facilityType) {
        return this.toMilimeter(facilityType.width) + " x " + this.toMilimeter(facilityType.depth) + " x " + this.toMilimeter(facilityType.height);
    }

    getWDH(itemType) {
        return parseInt(itemType.width) + " x " + parseInt(itemType.depth) + " x " + itemType.unit + "U";
    }

    getItemType(itemType) {
        if (!itemType.type) {
            return "";
        }

        const index = itemType.type.indexOf('-');

        if (index < 0) {
            return itemType.type;
        }

        return itemType.type.substring(0, index);
    }

    getRackItemElements(user) {
        const itemTypes = this.props.itemTypes;
        const selectedItemType = this.state.selectedItemTypes[this.state.selectedType];

        const items = [];
        let index = 1;
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        const editable = Edit.isEditableUser(user);

        for (const itemType of itemTypes) {
            if (this.checkItem(selectedItemType, itemType)) {
                const spanClassName = itemType === this.state.selectedItem ? edit.propertyTrSpan + " " + edit.selected : edit.propertyTrSpan;

                if (this.checkSearchText_itemType(searchText, itemType) === false) {
                    continue;
                }

                if (this.props.item && editable) {
                    items.push(
                        <span className={spanClassName} onClick={() => this.onSelectItem(itemType)}>
                            <tr /* className={spanClassName} */ draggable="true" onDragStart={(e) => this.onDragStart(e, itemType)}>
                                <td>{index++}</td>
                                {
                                    this.getITModelName(itemType.modelName ,true)
                                }
                                {
                                    this.getITCompanyName(ProjectResource.getCompanyName(itemType.company), true)
                                }
                                <td>{this.getWDH(itemType)}</td>
                                <td>{this.getItemType(itemType)}</td>
                            </tr>
                        </span>
                    );
                }
                else {
                    items.push(
                        <span className={spanClassName} onClick={() => this.onSelectItem(itemType)}>
                            <tr>
                                <td>{index++}</td>
                                {
                                    this.getITModelName(itemType.modelName, true)
                                }
                                {
                                    this.getITCompanyName(ProjectResource.getCompanyName(itemType.company), true)
                                }
                                <td>{this.getWDH(itemType)}</td>
                                <td>{this.getItemType(itemType)}</td>
                            </tr>
                        </span>
                    );
                }

                if (itemType === this.state.selectedItem) {
                    if (itemType.imageUrl && itemType.imageUrl.length > 0) {
                        const imgUrl = itemType.imageUrl.startsWith("/") ? ProjectResource.baseUrl + itemType.imageUrl : ProjectResource.baseUrl + "/" + itemType.imageUrl;
                        
                        items.push(
                            <span className={edit.propertyRackImage}>
                                <span className={edit.propertyImage}>
                                    <img src={imgUrl} className={edit.rackImageIT} />
                                </span>
                                <span className={edit.property3DIcon} onClick={() => this.props.show3DItem(itemType.glbUrl, itemType.modelName, ProjectResource.getEquipmentTypeName(itemType.equipmentTypeData))}></span>
                            </span>
                        );
                    }
                }
            }
        }

        return items;
    }

    checkSearchText_facilityType(searchText, facilityType) {
        if (!searchText || searchText.length === 0) {
            return true;
        }

        const width = facilityType.width === null || facilityType.width === undefined ? "" : facilityType.width.toString();
        const depth = facilityType.depth === null || facilityType.depth === undefined ? "" : facilityType.depth.toString();
        const height = facilityType.height === null || facilityType.height === undefined ? "" : facilityType.height.toString();
        const categoryName = facilityType.equipmentType ? ProjectResource.getEquipmentTypeName(facilityType.equipmentType).toLowerCase() : "";
        const modelName = facilityType.modelName.toLowerCase();

        if (facilityType.modelName.toLowerCase().includes(searchText)) {
            return true;
        }

        if (width.includes(searchText)) {
            return true;
        }

        if (depth.includes(searchText)) {
            return true;
        }

        if (height.includes(searchText)) {
            return true;
        }

        if (categoryName.includes(searchText)) {
            return true;
        }

        if (modelName.includes(searchText)) {
            return true;
        }

        return false;
    }

    checkSearchText_sensorType(searchText, sensorType) {
        if (!searchText || searchText.length === 0) {
            return true;
        }

        const modelName = ProjectResource.getSensorTypeName(sensorType).toLowerCase();
        const category = sensorType.category.toLowerCase();

        if (modelName.includes(searchText)) {
            return true;
        }

        if (category.includes(searchText)) {
            return true;
        }

        return false;
    }

    checkSearchText_rackType(searchText, rackType) {
        if (!searchText || searchText.length === 0) {
            return true;
        }

        const width = rackType.width === null || rackType.width === undefined ? "" : rackType.width.toString();
        const depth = rackType.depth === null || rackType.depth === undefined ? "" : rackType.depth.toString();
        const height = rackType.height === null || rackType.height === undefined ? "" : rackType.height.toString();

        if (rackType.modelName.toLowerCase().includes(searchText)) {
            return true;
        }

        if (width.includes(searchText)) {
            return true;
        }

        if (depth.includes(searchText)) {
            return true;
        }

        if (height.includes(searchText)) {
            return true;
        }

        return false;
    }

    checkSearchText_itemType(searchText, itemType) {
        if (!searchText || searchText.length === 0) {
            return true;
        }

        if (itemType.modelName.toLowerCase().includes(searchText)) {
            return true;
        }

        if (ProjectResource.getCompanyName(itemType.company).toLowerCase().includes(searchText)) {
            return true;
        }

        if (this.getWDH(itemType).toLowerCase().includes(searchText)) {
            return true;
        }

        return false;
    }

    onSelectItem(item) {
        if (item && item === this.state.selectedItem) {
            this.setState({ selectedItem: null });
        }
        else {
            this.setState({ selectedItem: item });
        }
    }

    togglePopup() {
        this.setState({ showPopup: !this.state.showPopup });
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            const text = this.refSearch.current.value;
            this.setState({ searchText: text });
        }
    }

    getFilterName() {
        const filter = this.state.selectedItemTypes[this.state.selectedType];

        if (!filter || filter.trim() === "") {
            return "";
        }

        if (filter === ProjectResource.ID.edit.editPropertyDetail.all) {
            return "";
        }

        return "-" + filter + "-";
    }

    render() {
        const user = ProjectResource.getUserInfo();

        return (
            <>
                {/* <div className={edit.propertyEditArea}> */}
                <div className={edit.propertyListBox}>
                    <span className={edit.propertyTitleE}><span className={edit.propertyIcon}></span><p>{ProjectResource.ID.edit.editProperty}</p></span>
                        <span className={edit.underLine}></span>

                        <div className={edit.propertyListBoxS}>
                            <span className={edit.propertyListTitle}>{ProjectResource.ID.edit.editPropertyDetail.lib3dProperties}</span>
                            <select className={edit.propertySelectBox} onChange={(e) => this.selectType(e)}>
                            {
                                this.getSelectionElements()
                            }
                            </select>
                        </div>

                        <span className={edit.propertySearch}>
                        <input ref={this.refSearch} type="text" placeholder={ProjectResource.ID.edit.inventoryPlaceHolder} onKeyUp={(e) => this.onSearch(e)} />
                        <span className={edit.filterIcon} onClick={() => this.togglePopup()}></span>
                        </span>
                          
                    <span className={edit.appliancesText}>{this.getFilterName()}</span>
                        <div className={edit.propertyTable + " " + edit.editPropertyScroll}>
                            <table>
                                <thead>
                                {
                                    this.getHeaderElements()
                                }
                                </thead>
                                <tbody>
                                {
                                    this.getItemElements(user)
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 랙장비종류 팝업 */}
                    {/*
                        this.state.showPopup && this.state.selectedType === ProjectResource.ID.edit.editPropertyDetail.rack &&
                        this.rackTypePopups()
                    */}

                    {/* IT장비종류 팝업 */}
                    {
                        this.state.showPopup && this.state.selectedType === ProjectResource.ID.edit.editPropertyDetail.itProperty &&
                        this.itPropertyPopups()
                    }

                {/* </div> */}
            </>
        )
    }

}
export default PropertyLibrary;