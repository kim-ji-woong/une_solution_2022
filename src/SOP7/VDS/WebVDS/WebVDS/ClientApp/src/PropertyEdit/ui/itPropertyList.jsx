import React, { Component } from 'react';
import $ from 'jquery';

import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';
import Main from '../../Main/ui/main';
import CommonResource from '../../Common/resource/id';


class ITPropertyList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: null
        }

        this.refSearch = React.createRef();

        this.expandRackElement = null;
        this.expandRackGroupElement = null;

        this.selectedRackGroups = {};
        this.selectedRacks = {};
        this.selectedItems = {};
    }

    componentDidMount() {
        this.initLinkedItems();

        /* $(document).ready(function () {
            $('input:checkbox[name="boxCheck"]').click(function (e) {
                var check = $(this).is(":checked");
                $(this).closest('span').css("background", check ? "green" : "red");
                $(e.target).closest('span').css("background", check ? "green" : "red");
            });
        }); */
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
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

                if (this.expandRackGroupElement) {
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
    }

    onClickRack(e, rack) {
        const element = e.target.parentElement;

        if ($(element).is('.' + edit.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }
    }

    onCheckRackGroup(e, rackGroup) {
        const checked = e.target.checked;

        if (checked) {
            this.selectedRackGroups[rackGroup.id] = rackGroup;
        }
        else {
            delete this.selectedRackGroups[rackGroup.id];
        }

        //this.selectedItems = {};

        for (const rack of rackGroup.racks) {
            const rackID = this.getCheckBoxRackID(rack);
            const rackElement = document.getElementById(rackID);

            if (rackElement) {
                rackElement.checked = checked;

                if (checked) {
                    this.selectedRacks[rack.id] = rack;
                }
                else {
                    delete this.selectedRacks[rack.id];
                }

                for (const item of rack.items) {
                    const itemID = this.getCheckBoxItemID(item);
                    const itemElement = document.getElementById(itemID);

                    if (itemElement) {
                        itemElement.checked = checked;

                        if (checked) {
                            this.selectedItems[item.id] = item;
                        }
                        else {
                            delete this.selectedItems[item.id];
                        }

                        this.onCheckedInput(itemElement, checked);
                    }
                }
            }
        }
    }

    onCheckRack(e, rack) {
        const checked = e.target.checked;

        if (checked) {
            this.selectedRacks[rack.id] = rack;
        }
        else {
            delete this.selectedRacks[rack.id];
        }

        for (const item of rack.items) {
            const itemID = this.getCheckBoxItemID(item);
            const itemElement = document.getElementById(itemID);

            if (itemElement) {
                itemElement.checked = checked;

                if (checked) {
                    this.selectedItems[item.id] = item;
                }
                else {
                    delete this.selectedItems[item.id];
                }

                this.onCheckedInput(itemElement, checked);
            }
        }
    }

    onCheckedInput(inputElement, checked) {
        const nextSpan = inputElement.nextSibling;

        if (checked) {
            if (!nextSpan.classList.contains(edit.selectLineBox)) {
                nextSpan.classList.add(edit.selectLineBox);
            }
        }
        else {
            if (nextSpan.classList.contains(edit.selectLineBox)) {
                nextSpan.classList.remove(edit.selectLineBox);
            }
        }
    }

    onCheckItem(e, item) {
        const checked = e.target.checked;

        if (checked) {
            this.selectedItems[item.id] = item;
        }
        else {
            delete this.selectedItems[item.id];
        }

        this.onCheckedInput(e.target, checked);
    }

    getRackItems() {
        const rackGroups = { ...this.props.rackGroups };

        if (this.props.tempRackGroup.racks.length > 0) {
            rackGroups[this.props.tempRackGroup.groupName] = this.props.tempRackGroup;
        }

        const items = [];
        const selectedItemID = this.props.selectedItem?.id;

        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            const listItems = [];
            
            listItems.push(
                <h5> {/* 제목 title */}
                    <div style={{ display: 'flex' }}>
                        <input type="checkBox" onChange={(e) => this.onCheckRackGroup(e, rackGroup)} />
                        <p className={edit.LNameIT} onClick={(e) => this.onClickRackGroup(e, rackGroup)}>{rackGroup.groupName}</p>
                    </div>
                </h5>
            );

            if (rackGroup.racks.length > 0) {
                const rackItems = [];

                for (const rack of rackGroup.racks) {
                    const itemCount = rack.items.length;
                    
                    const detailItems = [];
                    let validCount = 0;

                    for (let i = itemCount-1; i >= 0; i--) {
                        const item = rack.items[i];

                        if (item.id === selectedItemID) {
                            continue;
                        }

                        const circleClassName = item.status === 1 ? edit.greenCircle : edit.redCircle;

                        if (this.checkSearchText_item(searchText, item) === false) {
                            continue;
                        }
                        else {
                            validCount++;
                        }

                        detailItems.push(
                            <div className={edit.rackCheckArea} style={{ display: 'flex', alignItems: 'center' }}>
                                <input id={this.getCheckBoxItemID(item)} type="checkBox" onChange={(e) => this.onCheckItem(e, item)} />
                                <span className={edit.rackBoxITL}>
                                    <span className={edit.boxIT1}>{item.uPos}</span>
                                    <span className={edit.boxIT2}>{ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData)}</span>
                                    <span className={edit.boxIT3}>{item.name}</span>
                                    <span className={edit.boxIT4}>{item.itemType.modelName}</span>
                                    <span className={edit.boxIT5}>{item.itemType.unit + "U"}</span>
                                    <span className={edit.boxIT6}><span className={circleClassName}></span></span>
                                </span>

                                {/* IT자산 변경 */}
                                {/* <span className={edit.rackBoxITL}>
                                    <span className={edit.boxIT1}>24</span>
                                    <span className={edit.boxIT2}>어플라이언스</span>
                                    <span className={edit.boxIT3}>IT-9</span>
                                    <span className={edit.boxIT4}>SG510-20-M5</span>
                                    <span className={edit.boxIT5}>{item.itemType.unit + "U"}</span>
                                    <span className={edit.boxIT6}><span className={edit.greenCircle}></span></span>
                                </span> */}
                            </div>
                        );
                    }

                    if (validCount > 0 || this.checkSearchText_rack(searchText, rack)) {
                        rackItems.push(
                            <h5 style={{ padding: '10px 0px', marginLeft: '30px', borderBottom: 'solid 1px #7E8088' }}>
                                <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    <input id={this.getCheckBoxRackID(rack)} type="checkBox" onChange={(e) => this.onCheckRack(e, rack)} />
                                    <p className={edit.RNameIT} onClick={(e) => this.onClickRack(e, rack)}>{rack.name}</p>
                                    <span className={edit.LNumBoxIT}>
                                        <p className={edit.LFontIT}>{validCount}</p>
                                    </span>
                                </div>
                            </h5>
                        );
                    }

                    if (detailItems.length > 0) {
                        rackItems.push(
                            <ul style={{ marginBottom: '10px' }}>
                                <li>
                                    <h5 style={{ padding: '5px 0px' }}>
                                        <div className={edit.rackAreaIT}>
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

    getCheckBoxRackID(rack) {
        return "checkBox_rack_" + rack.id;
    }

    getCheckBoxItemID(item) {
        return "checkBox_item_" + item.id;
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

    onLinkedItems() {
        const linkedItems = [];

        for (const itemID in this.selectedItems) {
            const item = this.selectedItems[itemID];

            if (item) {
                linkedItems.push(item);
            }
        }

        this.props.onLinkedItems(this.props.selectedItem, linkedItems);
    }

    initLinkedItems() {
        for (const item of this.props.selectedItem.linkedItems) {
            const itemID = this.getCheckBoxItemID(item);
            const itemElement = document.getElementById(itemID);

            if (itemElement) {
                itemElement.checked = true;
                this.selectedItems[item.id] = item;

                this.onCheckedInput(itemElement, true);
            }
        }
    }

    render() {
        return (
            <>
                <div id={edit.ITpropertyPop}>
                    <div>
                        <div>
                            <div className={edit.itPropertyBox + " " + CommonResource.UISection}>
                                <div className={edit.itPropertyTitleBox}>
                                    <span className={edit.itPropertyTitle}>{ProjectResource.ID.edit.itPropertyListInventory}</span>
                                    <span className={edit.closeIcon} onClick={() => this.props.onAddLinkedItem(false)}></span>
                                </div>

                                <div className={edit.itPropertyContents}>
                                    <span className={edit.itPropertySearch}>
                                        <input ref={this.refSearch} type="text" placeholder={ProjectResource.ID.edit.inventoryPlaceHolder} onKeyUp={(e) => this.onSearch(e)} />
                                    </span>

                                    <div style={{ display: 'block', marginBottom: '30px' }}>
                                    <div className={edit.itPropertyScroll + " " + edit.itPropertyTreeBox} /* style={{ height: 'calc(100vh - 550px)', overflowX: 'hidden' }} */>
                                        <ul className={edit.itPropertyTree}>
                                            {
                                                this.getRackItems()
                                            }
                                        </ul>
                                    </div>
                                    </div>
                                    <span className={edit.confirmBtn} onClick={() => this.onLinkedItems()}>{ProjectResource.ID.button.confirm}</span>
                                </div>
                            </div> {/* itPropertyBox */}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default ITPropertyList;