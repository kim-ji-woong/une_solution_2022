import React, { Component } from 'react';
import $ from 'jquery';

import edit from '../../PropertyEdit/css/edit.module.css';
import dash from '../../Dashboard/css/dash.module.css';
import Edit from './edit';
import ProjectResource from '../../Root/resource/id';
import Main from '../../Main/ui/main';
import { Circle } from '@amcharts/amcharts4/core';

import Tooltip from '../../Main/ui/tooltip';

class EditListBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: null,
            editRackTooltipShow: false,
            editGroupNameTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
        }

        this.refSearch = React.createRef();

        this.expandRackElement = null;
        this.expandRackGroupElement = null;

        this.refSelectedRackGroup = React.createRef();
        this.refSelectedRack = React.createRef();
    }

    componentDidMount() {
        this.checkExpand();
    }

    componentDidUpdate() {
        this.checkExpand();
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    handleTooltip = (param, e) => {
        const domRect = e.target.getBoundingClientRect();

        if (param === 'editgroupname') {
            this.setState({
                editGroupNameTooltipShow: !this.state.editGroupNameTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        } else if (param === 'editrackname') {
            this.setState({
                editRackTooltipShow: !this.state.editRackTooltipShow,
                tooltipTop: domRect.top - 60,
                tooltipLeft: domRect.left - 20,
            });
        }
    }

    checkExpand() {
        const expandType = this.props.getExpandType();

        if (expandType === Edit.expandType.rack) {
            if (this.refSelectedRackGroup.current) {
                this.collapseElement(this.refSelectedRackGroup.current.parentElement, false);
            }
        }
        else if (expandType === Edit.expandType.item) {
            if (this.refSelectedRackGroup.current && this.refSelectedRack.current) {
                this.collapseElement(this.refSelectedRackGroup.current.parentElement, false);
                this.collapseElement(this.refSelectedRack.current.parentElement, false);
            }
        }
    }

    collapseElement(element, collapse) {
        const elementType = this.getElementType(element);

        if (collapse) {
            this.collapse(element);

            if (elementType === Main.RackGroup) {
                if (this.expandRackElement) {
                    this.collapse(this.expandRackElement);
                    this.expandRackElement = null;
                }

                this.expandRackGroupElement = null;
            }
            else if (elementType === Main.Rack) {
                this.expandRackElement = null;
            }
        }
        else {
            this.expand(element);

            if (elementType === Main.RackGroup) {
                if (this.expandRackElement) {
                    this.collapse(this.expandRackElement);
                    this.expandRackElement = null;
                }

                if (this.expandRackGroupElement && this.expandRackGroupElement !== element) {
                    this.collapse(this.expandRackGroupElement);
                }

                this.expandRackGroupElement = element;
            }
            else if (elementType === Main.Rack) {
                if (this.expandRackElement) {
                    this.collapse(this.expandRackElement);
                }

                this.expandRackElement = element;
            }
        }
    }

    collapse(element) {
        $(element).removeClass(edit.on);

        const nextElementText = element.parentElement?.nextSibling?.innerHTML;

        if (nextElementText && nextElementText.startsWith("<li>")) {
            $(element).parent().next().hide();
        }
    }

    expand(element) {
        if (element.classList.contains(edit.on)) {
            return;
        }

        $(element).addClass(edit.on);
        $(element).parent().next().show();
    }

    getElementType(element) {
        const index1 = element.innerHTML.indexOf("RName");
        const index2 = element.innerHTML.indexOf("LName");

        if (index1 > 0 && index2 > 0) {
            if (index1 < index2) {
                return Main.Rack;
            }
            else {
                return Main.RackGroup;
            }
        }
        else if (index1 > 0) {
            return Main.Rack;
        }
        else if (index2 > 0) {
            return Main.RackGroup;
        }

        return 0;
    }

    onClickRackGroup(e, rackGroup) {
        const element = e.target.parentElement;

        if ($(element).is('.' + edit.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }

        this.props.onSelect(rackGroup, Main.RackGroup);
    }

    onClickRack(e, rack) {
        const element = e.target.parentElement;

        if ($(element).is('.' + edit.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }

        this.props.onSelect(rack, Main.Rack);
    }

    editRackName(name, nameConts, hidden) {
        if (name.length > 10) {
            nameConts = name;
            name = name.substring(0, 10) + "...";

            return (
                <div style={{ position: 'relative' }}>
                    <div className="tooltipEditRackName">
                        <span className="tooltipEditRackNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('editrackname', e, nameConts)}
                            onMouseLeave={() => this.setState({ editRackTooltipShow: false })}>
                            {name}
                        </span>
                        <Tooltip
                            show={this.state.editRackTooltipShow}
                            message={this.nameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipEditRackNameConts tooltip-left"}
                        >
                            {nameConts}
                        </Tooltip>
                    </div>

                </div>
            );
        } else {
            return (
                <div>{name}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name}</div>
            );
        }

        return (
            <div>{name}</div>
        );
    }

    editGroupName(groupName, groupNameConts, hidden) {
        if (groupName.length > 10) {
            groupNameConts = groupName;
            groupName = groupName.substring(0, 10) + "...";

            return (
                <div style={{ position: 'relative' }} id={edit.titleBox}>
                    <div className="tooltipEditGroupName">
                        <span className="tooltipEditGroupNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('editgroupname', e, groupNameConts)}
                            onMouseLeave={() => this.setState({ editGroupNameTooltipShow: false })}>
                            {groupName}
                        </span>
                        <Tooltip
                            show={this.state.editGroupNameTooltipShow}
                            message={this.groupNameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipEditGroupNameConts tooltip-left"}
                        >
                            {groupNameConts}
                        </Tooltip>
                    </div>

                </div>
            );
        } else {
            return (
                <div>{groupName}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{groupName}</div>
            );
        }

        return (
            <div>{groupName}</div>
        );
    }


    getRackItems() {
        const rackGroups = { ...this.props.rackGroups };

        if (this.props.tempRackGroup.racks.length > 0) {
            rackGroups[this.props.tempRackGroup.groupName] = this.props.tempRackGroup;
        }

        const items = [];

        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            const listItems = [];
            const rackGroupClassName = rackGroup === this.props.selected.rackGroup ? edit.LNameE + " " + edit.selected : edit.LNameE;

            if (rackGroup === this.props.selected.rackGroup) {
                listItems.push(
                    <h5> {/* 제목 title */}
                        <div style={{ display: 'flex' }}>
                            <p ref={this.refSelectedRackGroup} className={rackGroupClassName} onClick={(e) => this.onClickRackGroup(e, rackGroup)}>
                                {groupName}
                                {/*  {
                                   this.editGroupName(groupName, true)
                                } */}
                            </p>
                        </div>
                    </h5>
                );
            }
            else {
                listItems.push(
                    <h5> {/* 제목 title */}
                        <div style={{ display: 'flex' }}>
                            <p className={rackGroupClassName} onClick={(e) => this.onClickRackGroup(e, rackGroup)}>
                                {groupName}
                                {/* {
                                    this.editGroupName(groupName, true)
                                } */}
                            </p>
                        </div>
                    </h5>
                );
            }

            if (rackGroup.racks.length > 0) {
                const rackItems = [];

                for (const rack of rackGroup.racks) {
                    const itemCount = rack.items.length;
                    const rackClassName = rack === this.props.selected.rack ? edit.RNameE + " " + edit.selected : edit.RNameE;

                    const detailItems = [];
                    let validCount = 0;

                    for (let i = itemCount-1; i >= 0; i--) {
                        const item = rack.items[i];

                        if (this.checkSearchText_item(searchText, item) === false) {
                            continue;
                        }
                        else {
                            validCount++;
                        }

                        const itemClassName = this.props.selected.item === item ? edit.selected : "";
                        const circleClassName = item.status === 1 ? edit.greenCircle : edit.redCircle;

                        detailItems.push(
                            <>
                            <span id={edit.rackBox} className={itemClassName} onClick={() => this.props.onSelect(item, Main.RackItem)}>
                                <span className={edit.box1}>{item.uPos}</span>
                                <span className={edit.box2}>{ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData)}</span>
                                <span className={edit.box3}>{item.name}</span>
                                <span className={edit.box4}>{item.itemType.modelName}</span>
                                <span className={edit.box5}>{item.itemType.unit + "U"}</span>
                                <span className={edit.box6}><span className={circleClassName}></span></span>
                            </span>

                            {/* IT자산 변경 */}
                            {/* <span id={edit.rackBox} className={itemClassName} onClick = {() => this.props.onSelect(item, Main.RackItem)}>
                                <span className={edit.box1}>24</span>
                                <span className={edit.box2}>어플라이언스</span>
                                <span className={edit.box3}>IT-9</span>
                                <span className={edit.box4}>SG510-20-M5</span>
                                <span className={edit.box5}>{item.itemType.unit + "U"}</span>
                                <span className={edit.box6}><span className={edit.greenCircle}></span></span>
                            </span> */}
                            </>
                        );
                    }

                    if (validCount > 0 || this.checkSearchText_rack(searchText, rack)) {
                        if (rack === this.props.selected.rack) {
                            rackItems.push(
                                <h5 style={{ padding: '5px 0px' }}>
                                    <div>
                                        <p ref={this.refSelectedRack} className={rackClassName} onClick={(e) => this.onClickRack(e, rack)}> 
                                            {rack.name}
                                            {/* {
                                                this.editRackName(rack.name, true)
                                            } */}
                                        </p>
                                        <span className={edit.LNumBoxE}>
                                            <p className={edit.LFontE}>{validCount}</p>
                                        </span>
                                    </div>
                                </h5>
                            );
                        }
                        else {
                            rackItems.push(
                                <h5 style={{ padding: '5px 0px' }}>
                                    <div>
                                        <p className={rackClassName} onClick={(e) => this.onClickRack(e, rack)}>
                                            {rack.name}
                                            {/* {
                                               this.editRackName(rack.name, true)
                                            } */}
                                        </p>
                                        <span className={edit.LNumBoxE}>
                                            <p className={edit.LFontE}>{validCount}</p>
                                        </span>
                                    </div>
                                </h5>
                            );
                        }
                    }

                    if (detailItems.length > 0) {
                        rackItems.push(
                            <ul style={{ marginBottom: '10px' }}>
                                <li>
                                    <h5 style={{ padding: '5px 0px' }}>
                                        <div id={edit.rackArea}>
                                            {detailItems}
                                        </div>
                                    </h5>
                                </li>
                            </ul>
                        );
                    }

                    if (rackItems.length > 0) {
                        listItems.push(
                            <ul style={{ marginBottom: '10px' }}>
                                <li>
                                    {rackItems}
                                </li>
                            </ul>
                        );
                    }
                }
            }

            if (listItems.length >= 2 || this.checkSearchText_rackGroup(searchText, rackGroup)) {
                items.push(
                    <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                        {listItems}
                    </li>
                );
            }
        }

        return items;
    }

    checkSearchText_rackGroup(text, rackGroup) {
        if (!text || text.length === 0) {
            return true;
        }

        if (rackGroup.groupName.toLowerCase().includes(text)) {
            return true;
        }

        return false;
    }

    checkSearchText_rack(text, rack) {
        if (!text || text.length === 0) {
            return true;
        }

        if (rack.name.toLowerCase().includes(text)) {
            return true;
        }

        return false;
    }

    checkSearchText_item(text, item) {
        if (!text || text.length === 0) {
            return true;
        }

        const equipmentTypeName = ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData);

        if (equipmentTypeName.toLowerCase().includes(text)) {
            return true;
        }

        const companyName = ProjectResource.getCompanyName(item.itemType.company);

        if (companyName.toLowerCase().includes(text)) {
            return true;
        }

        if (item.name.toLowerCase().includes(text)) {
            return true;
        }

        const unit = item.itemType.unit + "U";

        if (unit.includes(text)) {
            return true;
        }

        return false;
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            const text = this.refSearch.current.value;
            this.setState({ searchText: text });
        }
    }

    render() {
        return (
            <>
                {/* <div id={this.props.popupType} className={dash.vdcListPopup}> */}
                <div id='tooltip-area'></div>
                <div className={edit.editListBox}>
                    <span className={edit.editTitle}><span className={edit.editIcon}></span><p>{ProjectResource.ID.edit.inventory}</p></span>
                    <span className={edit.underLine}></span>

                    <div className={edit.editListBoxS}>
                        <span className={edit.inventListTitle}>{ProjectResource.ID.edit.inventoryList}</span>
                        {/*<span className={edit.inventListIcon} onClick={() => this.props.toggleInventoryList()}></span>*/}
                    </div>

                    <span className={edit.editSearch}>
                        <input ref={this.refSearch} type="text" placeholder={ProjectResource.ID.edit.inventoryPlaceHolder} onKeyUp={(e) => this.onSearch(e)} />
                    </span>

                    {/* <div className={edit.editTreeBox} style={{ display: 'none' }}> */}
                        <div className={edit.editTreeBox + " " + edit.editScroll}>
                            <ul className={edit.editTree}>
                                {this.getRackItems()}
                            </ul>
                        </div>
                    {/* </div> */}
                </div>
                {/* </div> */}
            </>
        )
    }
}

export default EditListBox;