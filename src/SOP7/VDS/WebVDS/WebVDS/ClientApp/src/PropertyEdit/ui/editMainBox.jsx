import React, { Component } from 'react';
import Main from '../../Main/ui/main';
import '../../Main/css/main.css';
import $ from 'jquery';

import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';
import wsManager from '../../Root/services/wsManager';
import EditController from '../services/editController';
import CameraBox from './cameraBox';
import Edit from './edit';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import CommonResource from '../../Common/resource/id';
import PopupMenu from './popupMenu';
import AccountResource from '../../Account/resource/id';
import EditEvent from './editEvent';

import Tooltip from '../../Main/ui/tooltip';

class EditMainBox extends Component {
    static LeftButton = 0;

    constructor(props) {
        super(props);

        this.state = {
            selectedItem: null,
            editingItem: null,
            editConnectNameTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
        }

        this.refBody = React.createRef();
        this.refSlotParent = React.createRef();

        this.pageNo = null;
        this.totalPage = null;
        this.prevSelectedItem = null;
        this.prevLinkedItemCount = 0;
        this.maxLine = 8;
    }

    componentDidMount() {
        this.checkSlotSize();
    }

    componentDidUpdate() {
        this.checkSlotSize();
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
        } else if (param === 'editconnectname') {
            this.setState({
                editConnectNameTooltipShow: !this.state.editConnectNameTooltipShow,
                tooltipTop: domRect.top - 60,
                tooltipLeft: domRect.left - 20,
            });
        }
    }

    checkSlotSize() {
        const rack = this.props?.item?.rack;

        if (rack) {
            let bigSizeUnit = true;

            /*for (const item of rack.items) {
                if (!item.itemType?.unit) {
                    return;
                }

                if (item.itemType.unit > 1) {
                    bigSizeUnit = true;
                    break;
                }
            }*/

            if (bigSizeUnit) {
                const elements = this.refBody.current.getElementsByClassName(edit.rackInfomation);

                if (!elements) {
                    return;
                }

                const slotElementPosition = {};

                for (const element of elements) {
                    let slotNo = null;

                    if (element.id.length === 0) {
                        if (element.children.length > 0) {
                            slotNo = parseInt(element.children[0].innerHTML);

                            if (isNaN(slotNo)) {
                                continue;
                            }
                        }

                        if (!slotNo) {
                            continue;
                        }
                    }
                    else {
                        const index1 = element.id.indexOf('_');
                        const index2 = element.id.lastIndexOf('_');

                        if (index1 > 0 && index2 > index1) {
                            slotNo = parseInt(element.id.substring(index1 + 1, index2));

                            if (isNaN(slotNo)) {
                                return;
                            }
                        }
                    }

                    if (slotNo) {
                        const rect = element.getBoundingClientRect();
                        slotElementPosition[slotNo] = {
                            top: rect.top,
                            bottom: rect.bottom
                        };
                    }
                }

                this.setElementSize(edit.rackEBox, 1, slotElementPosition);
                this.setElementSize(edit.rackEBox2, 2, slotElementPosition);
                this.setElementSize(edit.rackEBox3, 3, slotElementPosition);
                this.setElementSize(edit.rackEBox4, 4, slotElementPosition);
                this.setElementSize(edit.rackEBox5, 5, slotElementPosition);
                this.setElementSize(edit.rackEBox6, 6, slotElementPosition);
                this.setElementSize(edit.rackEBox7, 7, slotElementPosition);
                this.setElementSize(edit.rackEBox8, 8, slotElementPosition);
                this.setElementSize(edit.rackEBox9, 9, slotElementPosition);
                this.setElementSize(edit.rackEBox10, 10, slotElementPosition);
                this.setElementSize(edit.rackEBox11, 11, slotElementPosition);
                this.setElementSize(edit.rackEBox12, 12, slotElementPosition);
                this.setElementSize(edit.rackEBox13, 13, slotElementPosition);
                this.setElementSize(edit.rackEBox14, 14, slotElementPosition);
                this.setElementSize(edit.rackEBox15, 15, slotElementPosition);
                this.setElementSize(edit.rackEBox16, 16, slotElementPosition);
                this.setElementSize(edit.rackEBox17, 17, slotElementPosition);
                this.setElementSize(edit.rackEBox18, 18, slotElementPosition);
                this.setElementSize(edit.rackEBox19, 19, slotElementPosition);
                this.setElementSize(edit.rackEBox20, 20, slotElementPosition);
                this.setElementSize(edit.rackEBox21, 21, slotElementPosition);
                this.setElementSize(edit.rackEBox22, 22, slotElementPosition);
                this.setElementSize(edit.rackEBox23, 23, slotElementPosition);
                this.setElementSize(edit.rackEBox24, 24, slotElementPosition);
                this.setElementSize(edit.rackEBox25, 25, slotElementPosition);
                this.setElementSize(edit.rackEBox26, 26, slotElementPosition);
                this.setElementSize(edit.rackEBox27, 27, slotElementPosition);
                this.setElementSize(edit.rackEBox28, 28, slotElementPosition);
                this.setElementSize(edit.rackEBox29, 29, slotElementPosition);
                this.setElementSize(edit.rackEBox30, 30, slotElementPosition);
                this.setElementSize(edit.rackEBox31, 31, slotElementPosition);
                this.setElementSize(edit.rackEBox32, 32, slotElementPosition);
                this.setElementSize(edit.rackEBox33, 33, slotElementPosition);
                this.setElementSize(edit.rackEBox34, 34, slotElementPosition);
                this.setElementSize(edit.rackEBox35, 35, slotElementPosition);
                this.setElementSize(edit.rackEBox36, 36, slotElementPosition);
                this.setElementSize(edit.rackEBox37, 37, slotElementPosition);
                this.setElementSize(edit.rackEBox38, 38, slotElementPosition);
                this.setElementSize(edit.rackEBox39, 39, slotElementPosition);
                this.setElementSize(edit.rackEBox40, 40, slotElementPosition);
                this.setElementSize(edit.rackEBox41, 41, slotElementPosition);
                this.setElementSize(edit.rackEBox42, 42, slotElementPosition);
                this.setElementSize(edit.rackEBox43, 43, slotElementPosition);
                this.setElementSize(edit.rackEBox44, 44, slotElementPosition);
                this.setElementSize(edit.rackEBox45, 45, slotElementPosition);
            }
        }
    }

    setElementSize(className, unitSize, slotElementPosition) {
        const elements = this.refBody.current.getElementsByClassName(className);

        if (!elements) {
            return;
        }

        for (const element of elements) {
            const index = element.id.indexOf("_");

            if (index < 0) {
                continue;
            }

            const uPos = parseInt(element.id.substring(index + 1));

            if (isNaN(uPos)) {
                continue;
            }

            const pos1 = slotElementPosition[uPos];
            const pos2 = slotElementPosition[uPos + unitSize - 1];

            if (pos1 && pos2) {
                const height = pos1.bottom > pos2.top ? pos1.bottom - pos2.top : pos2.bottom - pos1.top;
                const bottom = pos2.bottom;
                element.style.height = height + "px";
                element.style.bottom = bottom + "px";
            }
        }
    }

    onMouseUpSlot(e, slot, rackItem) {
        if (e.detail === 2) {
            const user = ProjectResource.getUserInfo();

            if (Edit.isEditableUser(user)) {
                // double click
                this.setState({ editingItem: rackItem });
            }
            return;
        }

        if (e.button === 0) {
            // Left Button
            if (rackItem) {
                if (this.props.item !== rackItem) {
                    this.props.onSelect(rackItem, Main.RackItem);
                }
            }
        }
        else if (e.button === 2) {
            // Right Button
            if (rackItem) {
                const user = ProjectResource.getUserInfo();

                if (Edit.isEditableUser(user)) {
                    this.props.onAction(PopupMenu.action.unmount, [e.clientX, e.clientY, rackItem, rackItem.rack, rackItem?.rack?.rackGroup]);
                }
            }
        }
    }

    onKeyDownItemName(e, rackItem) {
        if (e.key === 'Enter') {
            this.onFocusoutItemName(e, rackItem);
        }
    }

    onFocusoutItemName(e, rackItem) {
        const name = e.target.value ? e.target.value.trim() : "";

        if (rackItem.name !== name) {
            this.setItemName(rackItem, name);
            /*rackItem.name = name;
            this.props.onAction(PopupMenu.action.updateRackItem, rackItem);
            this.setState({ editingItem: null });*/
        }
    }

    async setItemName(rackItem, name) {
        const [success, message] = await EditController.checkValidItemName(name, rackItem.id, this.props.dataCenter.id);

        if (success) {
            const oldName = rackItem.name;
            rackItem.name = name;

            if (this.props.onAction(PopupMenu.action.updateRackItem, rackItem) === false) {
                rackItem.name = oldName;

                const errorMessage = "[" + name + "]는 이미 사용중인 이름입니다.";
                this.setState({ editingItem: null });
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
            else {
                this.setState({ editingItem: null });
            }
        }
        else {
            this.setState({ editingItem: null });
            this.props.alertMessage(message, ProjectResource.ID.messageBox.title.error);
        }
    }

    onClickEmptySlot(e, slot) {
        if (this.movingRackItem) {
            if (e.button === EditMainBox.LeftButton) {
                if (e.target.classList.contains(edit.droppable) || e.target.parentElement.classList.contains(edit.droppable)) {
                    this.clearDroppable();

                    if (this.props.item.rack === this.movingRackItem.rack) {
                        this.movingRackItem.uPos = slot;
                    }
                    else {
                        this.moveItem(slot);
                    }

                    this.props.onAction(PopupMenu.action.updateRackItem, this.movingRackItem);
                    this.props.wsManager.moveItem(this.movingRackItem.id, slot);
                }
            }

            this.clearDroppable();

            this.movingRackItem = null;
            this.props.setMovingRackItem(null);
            this.setState({});
        }
    }

    moveItem(slot) {
        const index = this.movingRackItem.rack.items.indexOf(this.movingRackItem);

        if (index >= 0) {
            this.movingRackItem.rack.items.splice(index, 1);
            this.props.item.rack.items.push(this.movingRackItem);
            this.movingRackItem.rack = this.props.item.rack;
            this.movingRackItem.uPos = slot;
            this.movingRackItem.rackID = this.movingRackItem.rack.id;

            this.props.item.rack.items.sort(Edit.compareRackItem);
        }
    }

    getRackEditBoxClassName(unitCount) {
        if (unitCount === 2) {
            return edit.rackEBox2;
        }
        else if (unitCount === 3) {
            return edit.rackEBox3;
        }
        else if (unitCount === 4) {
            return edit.rackEBox4;
        }
        else if (unitCount === 5) {
            return edit.rackEBox5;
        }
        else if (unitCount === 6) {
            return edit.rackEBox6;
        }
        else if (unitCount === 7) {
            return edit.rackEBox7;
        }
        else if (unitCount === 8) {
            return edit.rackEBox8;
        }
        else if (unitCount === 9) {
            return edit.rackEBox9;
        }
        else if (unitCount === 10) {
            return edit.rackEBox10;
        }
        else if (unitCount === 11) {
            return edit.rackEBox11;
        }
        else if (unitCount === 12) {
            return edit.rackEBox12;
        }
        else if (unitCount === 13) {
            return edit.rackEBox13;
        }
        else if (unitCount === 14) {
            return edit.rackEBox14;
        }
        else if (unitCount === 15) {
            return edit.rackEBox15;
        }
        else if (unitCount === 16) {
            return edit.rackEBox16;
        }
        else if (unitCount === 17) {
            return edit.rackEBox17;
        }
        else if (unitCount === 18) {
            return edit.rackEBox18;
        }
        else if (unitCount === 19) {
            return edit.rackEBox19;
        }
        else if (unitCount === 20) {
            return edit.rackEBox20;
        }
        else if (unitCount === 21) {
            return edit.rackEBox21;
        }
        else if (unitCount === 22) {
            return edit.rackEBox22;
        }
        else if (unitCount === 23) {
            return edit.rackEBox23;
        }
        else if (unitCount === 24) {
            return edit.rackEBox24;
        }
        else if (unitCount === 25) {
            return edit.rackEBox25;
        }
        else if (unitCount === 26) {
            return edit.rackEBox26;
        }
        else if (unitCount === 27) {
            return edit.rackEBox27;
        }
        else if (unitCount === 28) {
            return edit.rackEBox28;
        }
        else if (unitCount === 29) {
            return edit.rackEBox29;
        }
        else if (unitCount === 30) {
            return edit.rackEBox30;
        }
        else if (unitCount === 31) {
            return edit.rackEBox31;
        }
        else if (unitCount === 32) {
            return edit.rackEBox32;
        }
        else if (unitCount === 33) {
            return edit.rackEBox33;
        }
        else if (unitCount === 34) {
            return edit.rackEBox34;
        }
        else if (unitCount === 35) {
            return edit.rackEBox35;
        }
        else if (unitCount === 36) {
            return edit.rackEBox36;
        }
        else if (unitCount === 37) {
            return edit.rackEBox37;
        }
        else if (unitCount === 38) {
            return edit.rackEBox38;
        }
        else if (unitCount === 39) {
            return edit.rackEBox39;
        }
        else if (unitCount === 40) {
            return edit.rackEBox40;
        }
        else if (unitCount === 41) {
            return edit.rackEBox41;
        }
        else if (unitCount === 42) {
            return edit.rackEBox42;
        }
        else if (unitCount === 43) {
            return edit.rackEBox43;
        }
        else if (unitCount === 44) {
            return edit.rackEBox44;
        }
        else if (unitCount === 45) {
            return edit.rackEBox45;
        }

        return "";
    }

    getRackItemElement(user) {
        const selectedItem = this.props.item;
        const selectedRack = this.props.checkRackGroup(selectedItem.rack);
        const rackItems = {};

        for (const item of selectedRack.items) {
            rackItems[item.uPos + item.itemType.unit - 1] = item;
        }

        const items = [];

        items.push(
            <div style={{ display: 'flex' }}>
                <div className={edit.editModelTitle}><span>{selectedItem.rack.rackGroup.groupName + "_" + selectedItem.rack.name}</span></div>
                <div className={edit.rackOutBox}>
                    <span className={edit.rackEditText}>{ProjectResource.getRackEditOut()}</span>
                    <span className={edit.rackOutIcon} onClick={() => this.props.onSelect(null, Main.RackItem)}></span>
               </div>
            </div>
        );

        const slotItems = [];
        const slotCount = selectedRack.rackType.unit;

        for (let i = slotCount; i > 0; i--) {
            const rackItem = rackItems[i];

            if (rackItem && rackItem !== this.movingRackItem) {
                let boxClassName = edit.rackEBox;
                let boxID = "item_" + rackItem.uPos;
                const unitCount = rackItem.itemType?.unit;

                if (unitCount && unitCount > 1) {
                    boxClassName = this.getRackEditBoxClassName(unitCount);
                }

                if (rackItem === selectedItem) {
                    boxClassName += " " + edit.selectLine;
                }

                const circleClassName = rackItem.status === 1 ? edit.greenCircle : edit.redCircle;

                if (rackItem === this.state.editingItem) {
                    slotItems.push(
                        <span className={edit.rackInfomation} onMouseUp={(e) => this.onMouseUpSlot(e, i, rackItem)}>
                            <span className={edit.rackNum}>{i}</span>
                            <span id={boxID} className={boxClassName} /*onClick={() => this.props.onSelect(rackItem, Main.RackItem)}*/>
                                <span className={edit.ebox1}>{rackItem.uPos}</span>
                                <span className={edit.ebox2}>{ProjectResource.getEquipmentTypeName(rackItem.itemType.equipmentTypeData)}</span>
                                <span className={edit.ebox3}><input type="text" defaultValue={rackItem.name} onKeyDown={(e) => this.onKeyDownItemName(e, rackItem)} onBlur={(e) => this.onFocusoutItemName(e, rackItem)} /></span>
                                <span className={edit.ebox4}>{rackItem.itemType.modelName}</span>
                                <span className={edit.ebox5}>{rackItem.itemType.unit + "U"}</span>
                                <span className={edit.ebox6}><span className={circleClassName}></span></span>
                            </span>
                            <span class={edit.movingItem}>{this.getMovingItemName()}</span>
                        </span>
                    );
                }
                else {
                    slotItems.push(
                        <span className={edit.rackInfomation} onMouseUp={(e) => this.onMouseUpSlot(e, i, rackItem)}>
                            <span className={edit.rackNum}>{i}</span>
                            <span id={boxID} className={boxClassName} /*onClick={() => this.props.onSelect(rackItem, Main.RackItem)}*/>
                                <span className={edit.ebox1}>{rackItem.uPos}</span>
                                <span className={edit.ebox2}>{ProjectResource.getEquipmentTypeName(rackItem.itemType.equipmentTypeData)}</span>
                                <span className={edit.ebox3}>{rackItem.name}</span>
                                <span className={edit.ebox4}>{rackItem.itemType.modelName}</span>
                                <span className={edit.ebox5}>{rackItem.itemType.unit + "U"}</span>
                                <span className={edit.ebox6}><span className={circleClassName}></span></span>
                            </span>
                            <span class={edit.movingItem}>{this.getMovingItemName()}</span>
                        </span>
                    );
                }
            }
            else {
                const emptySlotCount = this.getEmptySlotCountUp(i - 1, rackItems, slotCount);
                const spanID = "U" + emptySlotCount + "_" + i + "_rack";

                if (Edit.isEditableUser(user)) {
                    slotItems.push(
                        <span id={spanID} className={edit.rackInfomation} onDrop={(e) => this.onDrop(e)} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onMouseEnter={(e) => this.onMouseEnter(e)} onMouseLeave={(e) => this.onMouseLeave(e)} onMouseUp={(e) => this.onClickEmptySlot(e, i)}>
                            <span className={edit.rackNum}>{i}</span>
                            <span className={edit.rackContent}></span>
                            <span class={edit.movingItem}>{this.getMovingItemName()}</span>
                        </span>
                    );
                }
                else {
                    slotItems.push(
                        <span id={spanID} className={edit.rackInfomation}>
                            <span className={edit.rackNum}>{i}</span>
                            <span className={edit.rackContent}></span>
                            <span class={edit.movingItem}>{this.getMovingItemName()}</span>
                        </span>
                    );
                }
            }
        }

        items.push(
            <div className={edit.editrackBox}>
                <div className={edit.editrackModelImage}></div>
                <div ref={this.refSlotParent} className={edit.editrackInfoBox}>
                    {
                        slotItems
                    }
                </div>
            </div>
        );

        return items;
    }

    getMovingItemName() {
        if (this.movingRackItem) {
            return this.movingRackItem.name;
        }

        return "";
    }

    getEmptySlotCount(index, rackItems) {
        let count = 1;

        for (let i = index; i >= 0; i--) {
            const rackItem = rackItems[i];

            if (rackItem) {
                return count;
            }

            count++;
        }

        return count;
    }

    getEmptySlotCountUp(index, rackItems, slotCount) {
        let count = 0;

        for (let i = index; i < slotCount; i++) {
            if (this.checkEmptySlot(i + 1, rackItems) === false) {
                return count;
            }

            count++;
        }

        return count;
    }

    checkEmptySlot(index, rackItems) {
        for (const slotNo in rackItems) {
            const rackItem = rackItems[slotNo];

            if (rackItem === this.movingRackItem) {
                continue;
            }

            if (index >= rackItem.uPos && index <= parseInt(slotNo)) {
                return false;
            }
        }

        return true;
    }

    onDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        const elementID = e.target.id;
        const index = elementID.indexOf('_');

        if (index > 0) {
            const str = elementID.substring(1, index);
            const slotCount = parseInt(str);

            if (isNaN(slotCount)) {
                return null;
            }

            const [itemType, typeName] = this.props.getDragItem();

            if (!itemType || typeName !== Edit.dragType.itemType) {
                return;
            }

            if (itemType.unit > slotCount) {
                return;
            }

            let element = e.target;

            for (let i = 0; i < itemType.unit; i++) {
                if (!element) {
                    break;
                }

                if (!element.classList.contains(edit.droppable)) {
                    element.classList.add(edit.droppable);
                }

                element = element.previousSibling;
            }
        }
    }

    onMouseEnter(e) {
        if (this.movingRackItem) {
            const elementID = e.target.id;
            const index1 = elementID.indexOf('_');
            const index2 = elementID.lastIndexOf('_');

            if (index1 > 0 && index2 > index1) {
                const str = elementID.substring(index1 + 1, index2);
                const slotNo = parseInt(str);

                if (isNaN(slotNo)) {
                    return null;
                }

                const rack = this.props.item.rack;

                if (rack) {
                    if (this.isEmptySlot(rack, this.movingRackItem, slotNo)) {
                        let element = e.target;
                        const unit = this.movingRackItem.itemType?.unit;

                        if (unit) {
                            for (let i = 0; i < unit; i++) {
                                if (!element) {
                                    break;
                                }

                                if (!element.classList.contains(edit.droppable)) {
                                    element.classList.add(edit.droppable);
                                }

                                element = element.previousSibling;
                            }
                        }
                    }
                }
            }
        }
    }

    isEmptySlot(rack, movingItem, slotNo) {
        const unit = movingItem?.itemType?.unit;

        if (!unit) {
            return false;
        }

        for (const item of rack.items) {
            if (item === movingItem) {
                continue;
            }

            const slotCount = item.itemType?.unit;

            if (!slotCount) {
                continue;
            }

            for (let i = 0; i < unit; i++) {
                if (item.uPos <= slotNo + i && item.uPos + slotCount > slotNo + i) {
                    return false;
                }
            }
        }

        if (rack.rackType?.unit) {
            if (rack.rackType.unit >= slotNo + unit - 1) {
                return true;
            }
        }

        return false;
    }

    onDragLeave = (e) => {
        this.clearDroppable();
    }

    onMouseLeave(e) {
        if (this.movingRackItem) {
            this.clearDroppable();
        }
    }

    clearDroppable() {
        for (const childSpan of this.refSlotParent.current.children) {
            if (childSpan.classList.contains(edit.droppable)) {
                childSpan.classList.remove(edit.droppable);
            }
        }
    }

    onDrop = (e) => {
        e.preventDefault();

        const [itemType, typeName] = this.props.getDragItem();
        this.props.setDragItem(null, null);

        if (e.target.classList.contains(edit.droppable)) {
            this.clearDroppable();
        }
        else {
            return;
        }

        //const itemType = this.getDropItemType(e);

        if (!itemType || typeName !== Edit.dragType.itemType) {
            return;
        }

        const elementID = e.target.id;
        const index = elementID.indexOf('_');
        const index2 = elementID.lastIndexOf('_');

        if (index > 0 && index2 > 0) {
            const str = elementID.substring(index + 1, index2);
            const uPos = parseInt(str);

            if (!isNaN(uPos)) {
                //const rect = e.target.getBoundingClientRect();
                this.props.onNewItemPrev(this.props.item?.rack, this.props.dataCenter.id, itemType, uPos, e.clientX, e.clientY);

                //this.addNewItem(itemType, uPos);
            }
        }
    }

    onDragOverRackType = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    onDropRackType = (e) => {
        e.preventDefault();

        const [rackType, typeName] = this.props.getDragItem();
        this.props.setDragItem(null, null);

        if (!rackType || typeName !== Edit.dragType.rackType) {
            return;
        }

        this.props.wsManager.dropRackType(rackType);
    }

    async addNewItem(itemType, uPos) {
        const rack = this.props.item?.rack;

        if (!rack) {
            return;
        }

        const dataCenterID = this.props.dataCenter.id;

        const [newItem, errorMessage] = await EditController.requestNewItem(itemType.id, uPos, dataCenterID, rack.id);

        if (!newItem) {
            this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            return;
        }

        newItem.itemType = itemType;
        newItem.rack = rack;
        newItem.linkedItems = [];
        this.props.onNewItem(rack, newItem);
    }

    getDropItemType(e) {
        const str = e.dataTransfer.getData("text/plain");
        const itemTypeID = parseInt(str);
        //const itemTypeID = parseInt(e.dataTransfer.getData("text/plain"));

        if (isNaN(itemTypeID)) {
            return null;
        }

        const itemTypes = this.props.itemTypes;
        let itemType = null;

        for (const _itemType of itemTypes) {
            if (_itemType.id === itemTypeID) {
                itemType = _itemType;
                break;
            }
        }

        return itemType;
    }

    onRemoveLinkedItem() {
        this.props.onRemoveLinkedItem(this.state.selectedItem);
        this.setState({ selectedItem: null });
    }

    checkSelectedItem(item) {
        if (!item?.rack) {
            return false;
        }

        for (const _item of item.rack.items) {
            if (_item === item) {
                return true;
            }
        }

        return false;
    }

    onAddLinkedItem() {
        if (this.checkSelectedItem(this.props.item) === false) {
            this.props.alertMessage("먼저 연결할 IT 자산을 선택하세요.");
        }
        else {
            this.props.onAddLinkedItem(true);
        }
    }

    editConnectName(name, nameConts, hidden) {
        if (name.length > 10) {
            nameConts = name;
            name = name.substring(0, 10) + "...";

            return (
                <div style={{ position: 'relative' }}>
                    <div className="tooltipEditConnectName">
                        <span className="tooltipEditConnectNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('editconnectname', e, nameConts)}
                            onMouseLeave={() => this.setState({ editConnectNameTooltipShow: false })}>
                            {name}
                        </span>
                        <Tooltip
                            show={this.state.editConnectNameTooltipShow}
                            message={this.nameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipEditConnectNameConts tooltip-left"}
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
                <div /* className={dash.textHidden} */>{name}</div>
            );
        }

        return (
            <div>{name}</div>
        );
    }


    getLinkedItemElements(user) {
        const selectedItem = this.props.item;
        const rackItems = {};

        const [pageNo, totalPage] = this.getPageData();
        this.pageNo = pageNo;
        this.totalPage = totalPage;

        for (const item of selectedItem.linkedItems) {
            let items = rackItems[item.rack.id];

            if (!items) {
                items = [];
                rackItems[item.rack.id] = items;
            }

            items.push(item);
        }

        const beginIndex = pageNo !== null ? (pageNo - 1) * this.maxLine : 0;
        const endIndex = beginIndex + this.maxLine;
        let index = 0;

        const rackElements = [];

        for (const rackID in rackItems) {
            const items = rackItems[rackID];
            const rack = items[0].rack;

            const itemElements = [];
            index++;

            if (index >= beginIndex && index < endIndex) {
                itemElements.push(
                    <span className={edit.rackNameIT}>{rack.name}</span>
                );
            }

            for (const item of items) {
                index++;

                if (index > beginIndex && index <= endIndex) {
                    const className = item === this.state.selectedItem ? edit.rackBoxIT + " " + edit.selectIT : edit.rackBoxIT;
                    const circleClassName = item.status === 1 ? edit.greenCircle : edit.redCircle;

                    itemElements.push(
                        <span className={className} onClick={() => this.onSelectItem(item)}>
                            <span className={edit.box1}>{item.uPos}</span>
                            <span className={edit.box2}>{ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData)}</span>
                            <span className={edit.box3}>
                                {/* {item.name} */}
                                {
                                    this.editConnectName(item.name, true)
                                }
                            </span>
                            <span className={edit.box4}>{item.itemType.modelName}</span>
                            <span className={edit.box5}>{item.itemType.unit + "U"}</span>
                            <span className={edit.box6}><span className={circleClassName}></span></span>
                        </span>
                    );
                }
            }

            rackElements.push(
                <div className={edit.rackAreaITM}>
                    {
                        itemElements
                    }
                </div>
            );
        }

        const elements = [];

        elements.push(
            <div className={edit.rackLocationBoxE}>
                <span className={edit.rackLocationImageE}></span>
            </div>
        );

        const minusIconClassName = this.state.selectedItem ? edit.minusIcon + " " + edit.active : edit.minusIcon;

        elements.push(
            <div className={edit.connectItPropertyBox}>
                <div style={{ display: 'flex' }}>
                    <span className={edit.connectTitle}>{ProjectResource.ID.edit.linkedITProperty}</span>
                    <div className={edit.connectIconBox}>
                        {
                            this.getEditLInkedIcon(user, minusIconClassName)
                        }        
                    </div>
                </div>
                {
                    rackElements
                }
                {
                    this.getPageNoElement(pageNo, totalPage)
                }
            </div>
        );

        return elements;
    }

    movePage(dir) {
        if (dir < 0) {
            if (this.pageNo <= 0) {
                return;
            }
        }

        if (dir > 0) {
            if (this.pageNo >= this.totalPage) {
                return;
            }
        }

        this.pageNo += dir;
        this.setState({});
    }

    getPageNoElement(pageNo, totalPage) {
        if (pageNo === null) {
            return (
                <></>
            );
        }

        const leftClassName = pageNo > 1 ? edit.leftArrowIconIT + " " + edit.active : edit.leftArrowIcon;
        const rightClassName = pageNo < totalPage ? edit.rightArrowIconIT + " " + edit.active : edit.rightArrowIcon;

        return (
            <div className={edit.pageAreaIT}>
                <span className={leftClassName} onClick={() => this.movePage(-1)}></span>
                <span className={edit.pageNumBoxIT}>{pageNo + " / " + totalPage}</span>
                <span className={rightClassName} onClick={() => this.movePage(1)}></span>
            </div>
            );
    }

    getPageData() {
        const selectedItem = this.props.item;

        const rackItems = {};

        for (const item of selectedItem.linkedItems) {
            let items = rackItems[item.rack.id];

            if (!items) {
                items = [];
                rackItems[item.rack.id] = items;
            }

            items.push(item);
        }

        let itemCount = 0;
        
        for (const rackID in rackItems) {
            const items = rackItems[rackID];
            itemCount += items.length + 1;
        }

        if (this.prevSelectedItem !== selectedItem || this.prevLinkedItemCount !== itemCount) {
            this.prevSelectedItem = selectedItem;
            this.prevLinkedItemCount = itemCount;

            const maxLine = this.maxLine;

            if (itemCount > maxLine) {
                if (itemCount % maxLine === 0) {
                    return [1, itemCount / maxLine];
                }
                else {
                    return [1, parseInt(itemCount / maxLine) + 1];
                }
            }

            return [null, null];
        }

        return [this.pageNo, this.totalPage];
    }

    getEditLInkedIcon(user, minusIconClassName) {
        if (Edit.isEditableUser(user) === false) {
            return (
                <></>
            );
        }

        return (
            <>
                <span className={edit.addIcon} onClick={() => this.onAddLinkedItem(true)}></span>
                <span className={minusIconClassName} onClick={() => this.onRemoveLinkedItem()}></span>
            </>
        );
    }

    onSelectItem(item) {
        if (this.state.selectedItem === item) {
            this.setState({ selectedItem: null });
        }
        else {
            this.setState({ selectedItem: item });
        }
    }

    getParentPosition(element) {
        let pos = {
            x: element.offsetLeft,
            y: element.offsetTop
        }

        if (element.offsetParent) {
            const parentPos = this.getParentPosition(element.offsetParent);
            pos.x += parentPos.x;
            pos.y += parentPos.y;
        }

        return pos;
    }

    render() {
        const user = ProjectResource.getUserInfo();

        if (!this.props.item) {
            if (Edit.isEditableUser(user)) {
                return (
                    <></>
                    /* 랙 편집모드 */
                    /*<div id="app3D_edit" className={edit.rack3Ddeploy} onDrop={(e) => this.onDropRackType(e)} onDragOver={this.onDragOverRackType}>
                        <CameraBox wsManager={this.props.wsManager} setCameraMode={this.props.setCameraMode} getCameraMode={this.props.getCameraMode} />
                    </div>*/
                );
            }
            else {
                return (
                    <></>
                    /* 랙 편집모드 */
                    /*<div id="app3D_edit" className={edit.rack3Ddeploy}>
                        <CameraBox wsManager={this.props.wsManager} setCameraMode={this.props.setCameraMode} getCameraMode={this.props.getCameraMode} />
                    </div>*/
                );
            }
        }

        this.movingRackItem = this.props.getMovingRackItem();

        return (
            <>
                {/* IT자산 편집모드 */}
                <div ref={this.refBody} className={edit.editItMainBox + " " + CommonResource.UISection}>
                    <div className={edit.editMainFirstBox}>
                        {
                            this.getLinkedItemElements(user)
                        }
                    </div>
                    <div className={edit.editMainSecondBox}>
                        {
                            this.getRackItemElement(user)
                        }
                    </div>
                </div>

                {/* 랙 편집창 */}
                {/* <div className={edit.rackEditBox}>
                   <span className={edit.rackName}>RACK25</span>
                   <span className={edit.moveBox}>이동</span>
                   <span className={edit.rotateBox}>회전</span>
                   <span className={edit.repetitionGrid}>반복 그리드</span>
                   <span className={edit.itPropertyEdit}>IT자산편집</span>
                </div> */}

                {/* host 작성창 */}
                {/* <div className={edit.rackEditBox2}>
                    <span className={edit.rackInputBox}><input type="text" placeholder="HOST명을 작성해주세요." /></span>
                    <span className={edit.moveBox}>이동</span>
                    <span className={edit.rotateBox}>회전</span>
                    <span className={edit.repetitionGrid}>반복 그리드</span>
                    <span className={edit.itPropertyEdit}>IT자산편집</span>
                </div> */}

                {/* 이동그룹창 */}
                {/* <div className={edit.groupBox}>
                  <span className={edit.moveText}>이동</span>
                  <span className={edit.groupText}>그룹</span>
                </div> */}

                {/* mount */}
                {/* <div className={edit.mountBox}>
                  <span className={edit.mountText}>mount</span>
                </div> */}

                {/* 그룹명 작성창 */}
                {/* <div className={edit.groupWriterBox}>
                    <input type="text" placeholder="그룹명을 작성해주세요." />
                </div> */}

                {/* 수정창  */}
                {/* <div className={edit.rackFixBox}>
                    <span className={edit.rackMove}>이동</span>
                    <span className={edit.unMountText}>un mount</span>
                </div> */}

                {/* 회전창 */}
                {/* <div className={edit.rotateBox2}>
                    <div className={edit.rotateTitle}>회전</div>
                    <div className={edit.angle}>90</div>
                    <div className={edit.angleBtnBox}>
                        <div>취소</div>
                        <div>확인</div>
                    </div>
                </div> */}

                {/* 반복그리드창 */}
                {/* <div className={edit.gridBox}>
                    <div className={edit.gridTitle}>반복그리드</div>
                    <div className={edit.gridInterval}>간격:</div>
                    <div className={edit.gridNum}>횟수:</div>
                    <div className={edit.gridBtnBox}>
                       <div>취소</div>
                       <div>확인</div>
                    </div>
                </div> */}
            </>
        )
    }

}
export default EditMainBox;