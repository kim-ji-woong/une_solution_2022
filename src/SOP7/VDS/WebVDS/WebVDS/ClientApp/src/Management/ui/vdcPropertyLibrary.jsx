import React, { Component } from 'react';
import $ from 'jquery';
import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';
import Edit from '../../PropertyEdit/ui/edit';
import CommonResource from '../../Common/resource/id';
import wsManager from '../../Root/services/wsManager';


class VDCPropertyLibrary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedType: ProjectResource.ID.edit.editPropertyDetail.rack,
            selectedItemTypes: this.initSelectedItemTypes(),
            showPopup: false,
            searchText: null,
            selectedRack: null,
            selectedFacility: null,
            selectedSensor: null
        }

        this.refSearch = React.createRef();

        this.propertySelections = this.initPropertySelections();
    }

    componentDidMount() {
        //$(document).ready(function () {
        //    $('.' + dash.vdcEvent).click(function () {
        //        $('.' + dash.vdcPropertyBox).toggle();
        //    });
        //});
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    initSelectedItemTypes() {
        const itemTypes = {};

        itemTypes[ProjectResource.ID.edit.editPropertyDetail.rack] = ProjectResource.ID.edit.editPropertyDetail.all;
        itemTypes[ProjectResource.ID.edit.editPropertyDetail.facility] = ProjectResource.ID.edit.editPropertyDetail.all;

        return itemTypes;
    }

    initPropertySelections() {
        const selection = [];

        selection.push(ProjectResource.ID.edit.editPropertyDetail.rack);
        selection.push(ProjectResource.ID.edit.editPropertyDetail.facility);

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

    selectRackType = (rackType) => {
        if (this.state.selectedRack) {
            if (this.state.selectedRack.id === rackType.id) {
                this.setState({ selectedRack: null });
            } else {
                this.setState({ selectedRack: rackType });
            }
        } else {
            this.setState({ selectedRack: rackType });
        }        
    }

    selectFacilityType = (facilityType) => {
        if (this.state.selectedFacility) {
            if (this.state.selectedFacility.id === facilityType.id) {
                this.setState({ selectedFacility: null });
            } else {
                this.setState({ selectedFacility: facilityType, selectedSensor: null });
            }
        } else {
            this.setState({ selectedFacility: facilityType, selectedSensor: null });
        }
    }

    selectSensorType = (sensorType) => {
        if (this.state.selectedSensor) {
            if (this.state.selectedSensor.id === sensorType.id) {
                this.setState({ selectedSensor: null });
            } else {
                this.setState({ selectedSensor: sensorType, selectedFacility: null });
            }
        } else {
            this.setState({ selectedSensor: sensorType, selectedFacility: null });
        }
    }

    getRackTypeElements() {
        const elements = [];

        elements.push(
            <thead>
                <tr>
                    <th style={{ width: '10%' }}>No</th>
                    <th style={{ width: '30%' }}>모델명</th>
                    <th style={{ width: '20%' }}>Width</th>
                    <th style={{ width: '20%' }}>Depth</th>
                    <th style={{ width: '20%' }}>Height</th>
                </tr>
            </thead>
        );

        const items = [];
        let no = 1;
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        let isOpened = false;

        for (const rackType of this.props.rackTypes) {
            if (searchText && searchText.length > 0) {
                const width = rackType.width === null || rackType.width === undefined ? "" : rackType.width.toString();
                const depth = rackType.depth === null || rackType.depth === undefined ? "" : rackType.depth.toString();
                const height = rackType.height === null || rackType.height === undefined ? "" : rackType.height.toString();

                if (rackType.modelName.toLowerCase().includes(searchText) === false &&
                    width.includes(searchText) === false &&
                    depth.includes(searchText) === false &&
                    height.includes(searchText) === false) {
                    continue;
                }
            }

            if (this.state.selectedRack) {
                if (rackType.id === this.state.selectedRack.id) {
                    if (isOpened) {
                        isOpened = false;
                    } else {
                        isOpened = true;
                    }
                } else {
                    isOpened = false;
                }
            }

            const imgUrl = rackType.imageUrl;

            items.push(
                <>
                    <tr draggable="true" onDragStart={(e) => this.onDragStartRackType(e, rackType)} onDragEnd={() => this.onDragEndRackType()} className={dash.vdcEvent} onClick={() => this.selectRackType(rackType)}>
                        <td>{no++}</td>
                        <td>{rackType.modelName}</td>
                        <td>{rackType.width}</td>
                        <td>{rackType.depth}</td>
                        <td>{rackType.height}</td>
                    </tr>
                    {isOpened && 
                        <div className={dash.vdcPropertyBox}>
                            <span className={dash.propertyRackImage}>
                                <span className={dash.propertyImage}>
                                    <img src={imgUrl} className={dash.rackImage} />
                                </span>
                                <span className={dash.property3DIconB} onClick={() => this.props.show3DItem(rackType.glbUrl, rackType.modelName, ProjectResource.ID.edit.editPropertyDetail.rack)}></span>
                            </span>
                        </div>
                    }
                </>
            );
        }

        elements.push(
            <tbody>
                {
                    items
                }
            </tbody>
        );

        return elements;
    }

    getVdcCategoryName(categoryName, categoryNameConts, hidden) {
        if (categoryName.length > 7) {
            categoryNameConts = categoryName;
            categoryName = categoryName.substring(0, 7) + "...";

            return (
                <td style={{ position: 'relative' }}>
                    <div className="tooltipVDCcategoryName">
                        <span className="tooltipVDCcategoryNameTitle">
                            {categoryName}
                        </span>
                        <span className="tooltipVDCcategoryNameConts tooltip-left">
                            {categoryNameConts}
                        </span>
                    </div>
                </td>
            );

        } else {
            return (
                <td>{categoryName}</td>
            );
        }

        if (hidden) {
            return (
                <td className={dash.textHidden}>{categoryName}</td>
            );
        }
        return (
            <td>{categoryName}</td>
        );
    }

    getFacilityElements() {
        const elements = [];

        elements.push(
            <thead>
                <tr>
                    <th style={{ width: '8%' }}>{ProjectResource.ID.edit.editPropertyDetail.no}</th>
                    <th style={{ width: '33%' }}>{ProjectResource.ID.edit.editPropertyDetail.category}</th>
                    <th style={{ width: '25%' }}>{ProjectResource.ID.edit.editPropertyDetail.modelName}</th>
                    <th style={{ width: '34%' }}>{ProjectResource.ID.edit.editPropertyDetail.wdh}</th>
                </tr>
            </thead>
        );

        const facilityTypes = this.props.facilityTypes;
        const sensorTypes = this.props.sensorTypes;

        const items = [];
        let no = 1;
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        let isOpened = false;

        for (const facilityType of facilityTypes) {
            if (this.checkSearchText_facilityType(searchText, facilityType) === false) {
                continue;
            }

            if (this.state.selectedFacility) {
                if (facilityType.id === this.state.selectedFacility.id) {
                    if (isOpened) {
                        isOpened = false;
                    } else {
                        isOpened = true;
                    }
                } else {
                    isOpened = false;
                }
            }

            const categoryName = facilityType.equipmentType ? ProjectResource.getEquipmentTypeName(facilityType.equipmentType) : "";

            items.push(
                <>
                    <tr draggable="true" onDragStart={(e) => this.onDragStartFacilityType(e, facilityType)} onDragEnd={() => this.onDragEndFacilityType()} className={dash.vdcEvent} onClick={() => this.selectFacilityType(facilityType)}>
                        <td>{no++}</td>
                            {
                               this.getVdcCategoryName(categoryName, true) 
                            } 
                            {/* {categoryName} */}
                        <td>{facilityType.modelName}</td>
                        <td>{this.getWDH_mm(facilityType)}</td>
                    </tr>
                    {isOpened &&
                        <div className={dash.vdcPropertyBox}>
                            <span className={dash.propertyRackImage}>
                            <span className={dash.propertyImage}>
                                <img src={facilityType.imageUrl} className={dash.rackImage} />
                                </span>
                            <span className={dash.property3DIconB} onClick={() => this.props.show3DItem(facilityType.glbUrl, facilityType.modelName, ProjectResource.ID.edit.editPropertyDetail.facility)}></span>
                            </span>
                        </div>
                    }
                </>
            );
        }

        for (const sensorType of sensorTypes) {
            if (this.checkSearchText_sensorType(searchText, sensorType) === false) {
                continue;
            }

            if (this.state.selectedSensor) {
                if (sensorType.id === this.state.selectedSensor.id) {
                    if (isOpened) {
                        isOpened = false;
                    } else {
                        isOpened = true;
                    }
                } else {
                    isOpened = false;
                }
            }

            const categoryName = sensorType.category;

            items.push(
                <>
                    <tr draggable="true" onDragStart={(e) => this.onDragStartSensorType(e, sensorType)} onDragEnd={() => this.onDragEndSensorType()} className={dash.vdcEvent} onClick={() => this.selectSensorType(sensorType)}>
                        <td>{no++}</td>
                        <td>{categoryName}</td>
                        <td>{ProjectResource.getSensorTypeName(sensorType)}</td>
                        <td>-</td>
                    </tr>
                    {isOpened &&
                        <div className={dash.vdcPropertyBox}>
                            <span className={dash.propertyRackImage}>
                                <span className={dash.propertyImage}>
                                    <img src={sensorType.imageUrl} className={dash.rackImage} />
                                </span>
                            </span>
                        </div>
                    }
                </>
            );
        }

        elements.push(
            <tbody>
                {
                    items
                }
            </tbody>
        );

        return elements;
        /*const facilityTypes = this.props.facilityTypes;
        const sensorTypes = this.props.sensorTypes;

        const items = [];
        let index = 1;
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        for (const facilityType of facilityTypes) {
            const spanClassName = facilityType === this.state.selectedItem ? edit.propertyTrSpan + " " + edit.selected : edit.propertyTrSpan;

            if (this.checkSearchText_facilityType(searchText, facilityType) === false) {
                continue;
            }

            const categoryName = facilityType.equipmentType ? ProjectResource.getEquipmentTypeName(facilityType.equipmentType) : "";


            if (this.props.item) {
                items.push(
                    <span className={spanClassName} onClick={() => this.onSelectItem(facilityType)}>
                        <tr>
                            <td>{index++}</td>
                            {
                                this.getCategoryName(categoryName, true)
                            }
                            <td>{facilityType.modelName}</td>
                            <td>{this.getWDH_mm(facilityType)}</td>
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
                            <td>{this.getWDH_mm(facilityType)}</td>
                        </tr>
                    </span>
                );
            }

            if (facilityType === this.state.selectedItem) {
                if (facilityType.imageUrl && facilityType.imageUrl.length > 0) {
                    const imgUrl = facilityType.imageUrl.startsWith("/") ? ProjectResource.baseUrl + facilityType.imageUrl : ProjectResource.baseUrl + "/" + facilityType.imageUrl;

                    items.push(
                        <span className={edit.propertyRackImage2}>
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

            if (this.props.item) {
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
                                <img src={imgUrl} className={edit.rackImage2} />
                            </span>
                        </span>
                    );
                }
            }
        }

        return items;*/
        /*const elements = [];

        elements.push(
            <thead>
                <tr>
                    <th style={{ width: '10%' }}>No</th>
                    <th style={{ width: '30%' }}>모델명</th>
                    <th style={{ width: '20%' }}>Width</th>
                    <th style={{ width: '20%' }}>Depth</th>
                    <th style={{ width: '20%' }}>Height</th>
                </tr>
            </thead>
        );

        const items = [];

        elements.push(
            <tbody>
                {
                    items
                }
            </tbody>
        );

        return elements;*/
    }

    getWDH_mm(facilityType) {
        return this.toMilimeter(facilityType.width) + " x " + this.toMilimeter(facilityType.depth) + " x " + this.toMilimeter(facilityType.height);
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

    getItemElements() {
        if (this.state.selectedType === ProjectResource.ID.edit.editPropertyDetail.rack) {
            return this.getRackTypeElements();
        }

        return this.getFacilityElements();
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            this.onClickSearch();
        }
    }

    onClickSearch() {
        const text = this.refSearch.current.value;
        this.setState({ searchText: text });
    }

    render() {
        return (
            <>
                <div className={dash.vdc3DPropertyBox + " " + CommonResource.UISection}>
                    <span className={dash.vdcEditTitle}><span className={dash.editIcon}></span><p>자산편집</p></span>
                    <span className={dash.underLine}></span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className={dash.vdcPropertyTitle}><p>3D자산 라이브러리</p></span>
                        <select className={dash.vdcPropertySelectBox} onChange={(e) => this.selectType(e)}>
                            {
                                this.getSelectionElements()
                            }
                        </select>
                    </div>

                    <span className={dash.underLine}></span>

                    <span className={dash.vdcPropertySearch}>
                        <input ref={this.refSearch} type="text" placeholder={ProjectResource.ID.edit.inventoryPlaceHolder} onKeyUp={(e) => this.onSearch(e)} />
                        <span className={dash.vdcfilterIcon} onClick={() => this.onClickSearch()}></span>
                    </span>

                    <div className={dash.vdcPropertyTable + " " + dash.vdcPropertyScroll}>
                        <table>
                            {
                                this.getItemElements()
                            }
                        </table>
                    </div>

                    {/* 팝업창 */}
                    {/* <div className={dash.rack3DKindBox}>
                        <span className={dash.rack3DKindTitle}>랙장비 종류</span>
                        <span className={dash.rack3DKindBox1}>
                            <span className={dash.intireBox + " " + dash.selectedBox}>전체</span>
                            <span className={dash.serverBox}>서버</span>
                        </span>
                        <span className={dash.rack3DKindBox2}>
                           <span className={dash.networkBox}>네트워크</span>
                           <span className={dash.etcBox}>기타</span>
                        </span>
                    </div> */}

                    {/* VDC 랙 편집창 */}
                    {/*<div className={dash.rackVDCEditBox}>
                        <span className={dash.rackName}>STR1_01</span>
                        <span className={dash.rackPropertyEdit}>IT자산배치</span>
                    </div>*/}
                </div>
            </>
        );
    }
}
export default VDCPropertyLibrary;