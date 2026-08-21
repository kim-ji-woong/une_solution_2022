import React, { Component } from 'react';
import $ from 'jquery';

import main from '../../Main/css/main.module.css';
import '../../Main/css/main.css';

//import SettingsStore from '../../Settings/settingsStore';
import Main from './main';
import ProjectResource from '../../Root/resource/id';
//import ITVentRackInfo from './inventRackInfo';
//import ITPropertyInfo from './itPropertyInfo';
//import PopupDraggable from './popupDraggable';
import CommonResource from '../../Common/resource/id';



class ModelComparison extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            firstRack: null,
            secondRack: null,
            firstElement: null,
            secondElement: null,
            firstSelectedItem: null,
            secondSelectedItem: null,
            searchText: null
        }


        /* SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this)); */

        this.refLayer = React.createRef();
        this.refScrollArea = React.createRef();
        this.refScrollbar = React.createRef();
        this.refTree = React.createRef();
        this.refSearch = React.createRef();

        this.expandRackGroupElement = null;
        this.rackIDs = {};
    }


    componentDidMount() {
    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            //console.log('statusInfoZIndex changed', this.state.popup.style.zIndex)
        }

        //this.setScrollbar();
    }

    componentWillUnmount() {
    }

    setVisiblePoi(typeName, visible) {
        this.props.setVisiblePoi(typeName, visible);
    }

    initPopupState() {
        var popup = document.getElementsByClassName(main.modelPopup)[0];

        //DB에 값이 있을 경우에만
        if (typeof this.props.popupState !== 'undefined') {
            popup.style.left = this.props.popupState.x;
            popup.style.top = this.props.popupState.y;
            popup.style.width = this.props.popupState.width;
            popup.style.height = this.props.popupState.height;
        }

        this.setState({ popup: popup });
    }

    repositionPopup(popupState) {
        let data = popupState.statusInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {
            this.search();
        }
    }

    collapseElement(element, collapse) {
        const elementType = this.getElementType(element);

        if (collapse) {
            this.collapse(element);

            if (elementType === Main.RackGroup) {
                this.expandRackGroupElement = null;
            }
        }
        else {
            this.expand(element);

            if (elementType === Main.RackGroup) {
                if (this.expandRackGroupElement) {
                    this.collapse(this.expandRackGroupElement);
                }

                this.expandRackGroupElement = element;
            }
        }
    }

    collapse(element) {
        $(element).removeClass(main.on);

        const nextElementText = element.parentElement?.nextSibling?.innerHTML;

        if (nextElementText && nextElementText.startsWith("<li>")) {
            $(element).parent().next().hide();
        }
    }

    expand(element) {
        $(element).addClass(main.on);
        $(element).parent().next().show();
    }

    getElementType(element) {
        const index1 = element.innerHTML.indexOf("RNameM");
        const index2 = element.innerHTML.indexOf("LNameM");

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

        if ($(element).is('.' + main.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }
    }

    onClickRack(element, rack) {
        if (element.checked) {
            if (!this.state.firstRack) {
                this.setCompareRacks(rack, this.state.secondRack);
                this.setState({ firstRack: rack, firstElement: element });
            }
            else if (!this.state.secondRack) {
                this.setCompareRacks(this.state.firstRack, rack);
                this.setState({ secondRack: rack, secondElement: element });
            }
            else {
                if (this.state.firstRack !== rack && this.state.firstElement) {
                    this.state.firstElement.checked = false;
                }

                if (this.state.secondElement) {
                    this.state.secondElement.checked = false;
                }

                this.setCompareRacks(rack, null);
                this.setState({ firstRack: rack, firstElement: element, secondRack: null, secondElement: null });
            }
        }
        else {
            if (rack === this.state.firstRack) {
                this.state.firstElement.checked = false;
                this.setCompareRacks(null, this.state.secondRack);
                this.setState({ firstRack: null, firstElement: null });
            }
            else if (rack === this.state.secondRack) {
                this.state.secondElement.checked = false;
                this.setCompareRacks(this.state.firstRack, null);
                this.setState({ secondRack: null, secondElement: null });
            }
        }
    }

    onClickRack2(e, rack) {
        const currentElement = e.target;
        const parent = currentElement.parentElement;
        const childCount = parent.children.length;

        for (let i = 0; i < childCount; i++) {
            const element = parent.children[i];

            if (element === currentElement) {
                if (i === 0) {
                    return;
                }

                const spanElement = parent.children[i - 1];
                const spanChildCount = spanElement.children.length;

                if (spanChildCount > 0) {
                    const input = spanElement.children[0];
                    input.checked = !input.checked;

                    this.onClickRack(input, rack);
                }

                return;
            }
        }
    }

    getRackItems() {
        const rackGroups = { ...this.props.rackGroups };

        if (this.props.tempRackGroup && this.props.tempRackGroup.racks.length > 0) {
            rackGroups[this.props.tempRackGroup.groupName] = this.props.tempRackGroup;
        }

        const items = [];
        const searchText = this.state.searchText ? this.state.searchText.toLowerCase().trim() : null;

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            const listItems = [];
            //const rackGroupClassName = rackGroup === this.props.selected.rackGroup ? main.LNameM + " " + main.selected : main.LNameM;

            listItems.push(
                <h5> {/* 제목 title */}
                    <div style={{ display: 'flex' }}>
                        <p className={main.LNameM} onClick={(e) => this.onClickRackGroup(e, rackGroup)}>{groupName}</p>
                    </div>
                </h5>
            );

            let validCount = 0;

            if (rackGroup.racks.length > 0) {
                const rackItems = [];

                for (const rack of rackGroup.racks) {
                    if (this.checkSearchText(searchText, rack.name) === false) {
                        continue;
                    }
                    else {
                        validCount++;
                    }

                    const itemCount = rack.items.length;
                    const spanClassName = rack === this.state.secondRack ? main.modelInput2 : main.modelInput;
                    const rackClassName = rack === this.state.firstRack || rack === this.state.secondRack ? main.RNameM + " " + main.selected : main.RNameM;
                    const fontClassName = rack === this.state.firstRack || rack === this.state.secondRack ? main.LFontM + " " + main.selected : main.LFontM;

                    this.rackIDs[rack.id] = rack;

                    rackItems.push(
                        <h5 style={{ padding: '5px 0px' }}>
                            <div>
                                <span className={spanClassName}><input id={this.getInputIDfromRack(rack)} type="checkbox" onChange={(e) => this.onClickRack(e.target, rack)} /></span>
                                <p className={rackClassName} draggable="true" onDragStart={(e) => this.onDragStart(e, rack)} onClick={(e) => this.onClickRack2(e, rack)}>{rack.name}</p>
                                <span className={main.LNumBoxM}>
                                    <p className={fontClassName}>{itemCount}</p>
                                </span>
                            </div>
                        </h5>
                    );

                    listItems.push(
                        <ul style={{ marginBottom: '10px' }}>
                            <li>
                                {rackItems}
                            </li>
                        </ul>
                    );
                }
            }

            if (validCount === 0) {
                if (this.checkSearchText(searchText, groupName) === false) {
                    listItems.splice(listItems.length - 1, 1);
                }
            }

            items.push(
                <li style={{ borderBottom: 'solid 1px #7E8088' }}>
                    {listItems}
                </li>
            );
        }

        return items;
    }

    checkSearchText(text, name) {
        if (!text || text.length === 0) {
            return true;
        }

        if (name.toLowerCase().includes(text)) {
            return true;
        }

        return false;
    }

    getInputIDfromRack(rack) {
        if (rack?.id || rack?.id === 0) {
            return "input_rack_" + rack.id;
        }
    }

    onDragStart(e, rack) {
        if (rack?.id || rack?.id === 0) {
            e.dataTransfer.setData("text/plain", rack.id);
            e.dataTransfer.dropEffect = "copy";
        }
    }

    onDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    onDrop = (e, no) => {
        e.preventDefault();

        const rackID = e.dataTransfer.getData("text/plain");
        const rack = this.rackIDs[rackID];

        const id = this.getInputIDfromRack(rack);

        if (!id) {
            return;
        }

        const element = document.getElementById(id);

        element.checked = true;
        this.uncheckInputElement(element, no);

        if (no === 1) {
            if (this.state.secondRack === rack) {
                this.setCompareRacks(rack, null);
                this.setState({ firstRack: rack, secondRack: null, firstElement: element, secondElement: null });
            }
            else {
                this.setCompareRacks(rack, this.state.secondRack);
                this.setState({ firstRack: rack, firstElement: element });
            }
        }
        else {
            if (this.state.firstRack === rack) {
                this.setCompareRacks(null, rack);
                this.setState({ firstRack: null, secondRack: rack, firstElement: null, secondElement: element });
            }
            else {
                this.setCompareRacks(this.state.firstRack, rack);
                this.setState({ secondRack: rack, secondElement: element });
            }
        }
    }

    uncheckInputElement(element, no) {
        if (no === 1) {
            if (this.state.firstElement && this.state.firstElement !== element) {
                this.state.firstElement.checked = false;
            }
        }
        else {
            if (this.state.secondElement && this.state.secondElement !== element) {
                this.state.secondElement.checked = false;
            }
        }
    }

    toggleSelectItem(item, isFirst) {
        if (isFirst) {
            if (this.state.firstSelectedItem === item) {
                this.setState({ firstSelectedItem: null });
            }
            else {
                this.setState({ firstSelectedItem: item });
            }
        }
        else {
            if (this.state.secondSelectedItem === item) {
                this.setState({ secondSelectedItem: null });
            }
            else {
                this.setState({ secondSelectedItem: item });
            }
        }
    }

    getRackCBoxClassName(item) {
        const unit = item.itemType.unit;

        if (unit === 2) {
            return main.rackCBox2;
        }
        else if (unit === 3) {
            return main.rackCBox3;
        }
        else if (unit === 4) {
            return main.rackCBox4;
        }
        else if (unit === 5) {
            return main.rackCBox5;
        }
        else if (unit === 6) {
            return main.rackCBox6;
        }
        else if (unit === 7) {
            return main.rackCBox7;
        }
        else if (unit === 8) {
            return main.rackCBox8;
        }
        else if (unit === 9) {
            return main.rackCBox9;
        }
        else if (unit === 10) {
            return main.rackCBox10;
        }
        else if (unit === 11) {
            return main.rackCBox11;
        }
        else if (unit === 12) {
            return main.rackCBox12;
        }
        else if (unit === 13) {
            return main.rackCBox13;
        }
        else if (unit === 14) {
            return main.rackCBox14;
        }
        else if (unit === 15) {
            return main.rackCBox15;
        }
        else if (unit === 16) {
            return main.rackCBox16;
        }
        else if (unit === 17) {
            return main.rackCBox17;
        }
        else if (unit === 18) {
            return main.rackCBox18;
        }
        else if (unit === 19) {
            return main.rackCBox19;
        }
        else if (unit === 20) {
            return main.rackCBox20;
        }
        else if (unit === 21) {
            return main.rackCBox21;
        }
        else if (unit === 22) {
            return main.rackCBox22;
        }
        else if (unit === 23) {
            return main.rackCBox23;
        }
        else if (unit === 24) {
            return main.rackCBox24;
        }
        else if (unit === 25) {
            return main.rackCBox25;
        }
        else if (unit === 26) {
            return main.rackCBox26;
        }
        else if (unit === 27) {
            return main.rackCBox27;
        }
        else if (unit === 28) {
            return main.rackCBox28;
        }
        else if (unit === 29) {
            return main.rackCBox29;
        }
        else if (unit === 30) {
            return main.rackCBox30;
        }
        else if (unit === 31) {
            return main.rackCBox31;
        }
        else if (unit === 32) {
            return main.rackCBox32;
        }
        else if (unit === 33) {
            return main.rackCBox33;
        }
        else if (unit === 34) {
            return main.rackCBox34;
        }
        else if (unit === 35) {
            return main.rackCBox35;
        }
        else if (unit === 36) {
            return main.rackCBox36;
        }
        else if (unit === 37) {
            return main.rackCBox37;
        }
        else if (unit === 38) {
            return main.rackCBox38;
        }
        else if (unit === 39) {
            return main.rackCBox39;
        }
        else if (unit === 40) {
            return main.rackCBox40;
        }
        else if (unit === 41) {
            return main.rackCBox41;
        }
        else if (unit === 42) {
            return main.rackCBox42;
        }
        else if (unit === 43) {
            return main.rackCBox43;
        }
        else if (unit === 44) {
            return main.rackCBox44;
        }
        else if (unit === 45) {
            return main.rackCBox45;
        }

        return main.rackCBox;
    }

    setCompareRacks(rack1, rack2) {
        if (rack1 && rack2) {
            this.props.wsManager.selectCompareRack(rack1.id, rack2.id);
        }
        else if (rack1) {
            this.props.wsManager.selectCompareRack(rack1.id, null);
        }
        else if (rack2) {
            this.props.wsManager.selectCompareRack(null, rack2.id);
        }
        else {
            this.props.wsManager.selectCompareRack(null, null);
        }
    }

    getRackItemElement(item, isFirst) {
        if (!item) {
            return <span className={main.rackContent}></span>;
        }

        const cBoxClassName = this.getRackCBoxClassName(item);
        const rackBoxClassName = item === this.state.firstSelectedItem || item === this.state.secondSelectedItem ? cBoxClassName + " " + main.selected : cBoxClassName;
        const circleClassName = item.status === 1 ? main.greenCircle : main.redCircle;

        return (
            <>
                <span className={rackBoxClassName} onClick={() => this.toggleSelectItem(item, isFirst)}>
                    <span className={main.cbox1}>{item.uPos}</span>
                <span className={main.cbox2}>{ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData)}</span>
                    <span className={main.cbox3}>{item.name}</span>
                    <span className={main.cbox4}>{item.itemType.modelName}</span>
                <span className={main.cbox5}>{item.itemType.unit + "U"}</span>
                    <span className={main.cbox6}><span className={circleClassName}></span></span>
            </span>

            {/* IT자산 변경 */}
            {/*<span className={rackBoxClassName} onClick={() => this.toggleSelectItem(item, isFirst)}>
                <span className={main.cbox1}>24</span>
                <span className={main.cbox2}>어플라이언스</span>
                <span className={main.cbox3}>IT-9</span>
                <span className={main.cbox4}>SG510-20-M5</span>
                <span className={main.cbox5}>{item.itemType.unit + "U"}</span>
                <span className={main.cbox6}><span className={main.greenCircle}></span></span>
            </span>*/}
            </>
            );
    }

    getItemData(data) {
        if (!data) {
            return "-";
        }

        return data;
    }

    getBoxItems(box) {
        return (
            <>
                <span className="rackDetailLeft">
                    <div className="equipmentName"><span>Box 명</span><span>:</span><span>{this.getItemData(box?.basic_Name)}</span></div>
                    <div className="otherName"><span>Box 등급</span><span>:</span><span>{this.getItemData(box?.basic_Name)}</span></div>
                    <div className="purpose"><span>Box 제조사</span><span>:</span><span>{this.getItemData(box?.basic_Company)}</span></div>
                    <div className="state"><span>Box 모델명</span><span>:</span><span>{this.getItemData(box?.basic_ModelName)}</span></div>
                    <div className="modelName"><span>상태</span><span>:</span><span>{this.getItemData(box?.basic_Status)}</span></div>
                    <div className="manufacturer"><span>용도</span><span>:</span><span>{this.getItemData(box?.basic_Usage)}</span></div>
                {/*</span>
                <span className="rackDetailRight">*/}
                    <div className="equipmentName"><span>모델명</span><span>:</span><span>{this.getItemData(box?.cpU_ModelName)}</span></div>
                    <div className="equipmentName"><span>Clock Speed</span><span>:</span><span>{this.getItemData(box?.cpU_ClockSpeed)}</span></div>
                    <div className="equipmentName"><span>총 Core 수</span><span>:</span><span>{this.getItemData(box?.cpU_TotalCoreCount)}</span></div>
                    <div className="equipmentName"><span>총 Memory 용량</span><span>:</span><span>{this.getItemData(box?.mem_TotalMemoryVolume)}</span></div>
                </span>
            </>
        );
    }

    getBackupItems(backup) {
        return (
            <>
                <span className="rackDetailLeft">
                    <div className="equipmentName"><span>장비명</span><span>:</span><span>{this.getItemData(backup?.basic_Name)}</span></div>
                    <div className="equipmentName"><span>상태</span><span>:</span><span>{this.getItemData(backup?.basic_Status)}</span></div>
                    <div className="equipmentName"><span>백업 등급</span><span>:</span><span>{this.getItemData(backup?.basic_ItemLevel)}</span></div>
                    <div className="equipmentName"><span>용도</span><span>:</span><span>{this.getItemData(backup?.basic_Usage)}</span></div>
                    <div className="equipmentName"><span>모델명</span><span>:</span><span>{this.getItemData(backup?.hW_ModelName)}</span></div>
                    <div className="equipmentName"><span>제조사</span><span>:</span><span>{this.getItemData(backup?.hW_Company)}</span></div>
                {/*</span>
                <span className="rackDetailRight">*/}
                    <div className="equipmentName"><span>Usable 용량(GB)</span><span>:</span><span>{this.getItemData(backup?.hW_UsableVolumeGB)}</span></div>
                </span>
            </>
        );
    }

    getEtcItems(etc) {
        return (
            <>
                <span className="rackDetailLeft">
                    <div className="equipmentName"><span>장비명</span><span>:</span><span>{this.getItemData(etc?.basic_Name)}</span></div>
                    <div className="equipmentName"><span>상태</span><span>:</span><span>{this.getItemData(etc?.basic_Status)}</span></div>
                    <div className="equipmentName"><span>기타 장비 상세분류</span><span>:</span><span>{this.getItemData(etc?.basic_EquipDetailClass)}</span></div>
                    <div className="equipmentName"><span>기타 등급</span><span>:</span><span>{this.getItemData(etc?.basic_ItemLevel)}</span></div>
                    <div className="equipmentName"><span>용도</span><span>:</span><span>{this.getItemData(etc?.basic_Usage)}</span></div>
                    <div className="equipmentName"><span>모델명</span><span>:</span><span>{this.getItemData(etc?.hW_ModelName)}</span></div>
                {/*</span>
                <span className="rackDetailRight">*/}
                    <div className="equipmentName"><span>제조사</span><span>:</span><span>{this.getItemData(etc?.hW_Company)}</span></div>
                </span>
            </>
        );
    }

    getNetworkItems(network) {
        return (
            <>
                <span className="rackDetailLeft">
                    <div className="equipmentName"><span>장비명</span><span>:</span><span>{this.getItemData(network?.basic_Name)}</span></div>
                    <div className="equipmentName"><span>상태</span><span>:</span><span>{this.getItemData(network?.basic_Status)}</span></div>
                    <div className="equipmentName"><span>네트워크 장비 상세분류</span><span>:</span><span>{this.getItemData(network?.basic_EquipDetailClass)}</span></div>
                    <div className="equipmentName"><span>네트워크 운영 등급</span><span>:</span><span>{this.getItemData(network?.basic_ItemLevel)}</span></div>
                    <div className="equipmentName"><span>용도</span><span>:</span><span>{this.getItemData(network?.basic_Usage)}</span></div>
                    <div className="equipmentName"><span>모델명</span><span>:</span><span>{this.getItemData(network?.hW_ModelName)}</span></div>
                {/*</span>
                <span className="rackDetailRight">*/}
                    <div className="equipmentName"><span>제조사</span><span>:</span><span>{this.getItemData(network?.hW_Company)}</span></div>
                </span>
            </>
        );
    }

    getSanSwitchItems(_switch) {
        return (
            <>
                <span className="rackDetailLeft">
                    <div className="fcName"><span>장비명</span><span>:</span><span>{this.getItemData(_switch?.basic_Name)}</span></div>
                    <div className="fcName"><span>상태</span><span>:</span><span>{this.getItemData(_switch?.basic_Status)}</span></div>
                    <div className="fcName"><span>SAN 스위치 등급</span><span>:</span><span>{this.getItemData(_switch?.basic_ItemLevel)}</span></div>
                    <div className="fcName"><span>용도</span><span>:</span><span>{this.getItemData(_switch?.basic_Usage)}</span></div>
                    <div className="fcName"><span>모델명</span><span>:</span><span>{this.getItemData(_switch?.hW_ModelName)}</span></div>
                    <div className="fcName"><span>제조사</span><span>:</span><span>{this.getItemData(_switch?.hW_Company)}</span></div>
                {/*</span>
                <span className="rackDetailRight">*/}
                    <div className="fcName"><span>FC 포트 개수(최대포트수)</span><span>:</span><span>{this.getItemData(_switch?.hW_FCPortCount)}</span></div>
                    <div className="fcName"><span>FC 포트 사용개수(최대포트수)</span><span>:</span><span>{this.getItemData(_switch?.hW_FCPortUseCount)}</span></div>
                </span>
            </>
        );
    }

    getSecurityItems(security) {
        return (
            <span className="rackDetailLeft">
                <div className="equipmentName"><span>장비명</span><span>:</span><span>{this.getItemData(security?.basic_Name)}</span></div>
                <div className="equipmentName"><span>상태</span><span>:</span><span>{this.getItemData(security?.basic_Status)}</span></div>
                <div className="equipmentName"><span>보안 등급</span><span>:</span><span>{this.getItemData(security?.basic_ItemLevel)}</span></div>
                <div className="equipmentName"><span>용도</span><span>:</span><span>{this.getItemData(security?.basic_Usage)}</span></div>
                <div className="equipmentName"><span>모델명</span><span>:</span><span>{this.getItemData(security?.hW_ModelName)}</span></div>
                <div className="equipmentName"><span>제조사</span><span>:</span><span>{this.getItemData(security?.hW_Company)}</span></div>
            </span>
        );
    }

    getStorageItems(storage) {
        return (
            <>
                <span className="rackDetailLeft">
                    <div className="equipmentName"><span>장비명</span><span>:</span><span>{this.getItemData(storage?.basic_Name)}</span></div>
                    <div className="equipmentName"><span>상태</span><span>:</span><span>{this.getItemData(storage?.basic_Status)}</span></div>
                    <div className="equipmentName"><span>Storage 등급</span><span>:</span><span>{this.getItemData(storage?.basic_ItemLevel)}</span></div>
                    <div className="equipmentName"><span>용도</span><span>:</span><span>{this.getItemData(storage?.basic_Usage)}</span></div>
                    <div className="equipmentName"><span>모델명</span><span>:</span><span>{this.getItemData(storage?.hW_ModelName)}</span></div>
                    <div className="equipmentName"><span>제조사</span><span>:</span><span>{this.getItemData(storage?.hW_Company)}</span></div>
                {/*</span>
                <span className="rackDetailRight">*/}
                    <div className="equipmentName"><span>Disk 종류</span><span>:</span><span>{this.getItemData(storage?.hW_DiskType)}</span></div>
                    <div className="equipmentName"><span>Total Usable 용량</span><span>:</span><span>{this.getItemData(storage?.hW_TotalUsableVolume)}</span></div>
                </span>
            </>
        );
    }

    getItemTypeName(item) {
        if (item.itemType?.equipmentTypeData?.engName) {
            return item.itemType.equipmentTypeData.engName.toLowerCase();
        }

        return "";
    }

    getRackDetailElement(rack, no, modelTitleClassName, rackBoxClassName) {
        if (!rack) {
            return <></>;
        }

        const rackUnitItems = {};
        const rackUnitDetailItems = {};

        for (const item of rack.items) {
            const unit = item.itemType ? item.itemType.unit : 1;
            const pos = item.uPos + unit - 2;

            rackUnitItems[pos] = item;
            rackUnitDetailItems[item.uPos - 1] = item;
        }

        const rackElements = [];

        rackElements.push(<div className={modelTitleClassName}><span>{no}</span><span>{rack.rackGroup.groupName + "_" + rack.name}</span></div>);

        const slotElements = [];
        const unitCount = rack.rackType?.unit ? rack.rackType.unit : 0;

        for (let i = unitCount - 1; i >= 0; i--) {
            const unitItem = rackUnitItems[i];

            slotElements.push(
                <span className={main.rackInfomation}>
                    <span className={main.rackNum}>{i + 1}</span>
                    {
                        this.getRackItemElement(unitItem, no === 1)
                    }
                </span>
            );

            const detailItem = rackUnitDetailItems[i];

            if (detailItem && detailItem === this.state.firstSelectedItem || detailItem === this.state.secondSelectedItem) {
                const frontImageUrl = detailItem.itemType?.imageUrl;
                const backImageUrl = detailItem.itemType?.backImageUrl;
                const frontClassName = detailItem.itemType?.className ? detailItem.itemType.className : "rackFrontImage";
                const backClassName = detailItem.itemType?.className ? detailItem.itemType.className : "rackBackImage";
                const itemTypeName = this.getItemTypeName(detailItem);

                slotElements.push(
                    <>
                    {/* <span className="rackDetailBox">
                        <span className="rackDetailImage">
                            <span className="rackFrontBox">
                                <span className="rackFrontTitle">Front</span>
                                <span className="rackFrontImage"></span>
                            </span>
                            <span className="rackBackBox">
                                <span className="rackBackTitle">Back</span>
                                <span className="rackBackImage"></span>
                            </span>
                        </span>
                        <span className="rackDetailContents">
                            <span className="rackDetailLeft">
                                <div className="hostName"><span>{ProjectResource.ID.main.itPropertyInfoDetail.hostName}</span><span>:</span><span>{detailItem.name}</span></div>
                                <div className="cpu"><span>{ProjectResource.ID.main.itPropertyInfoDetail.cpu}</span><span>:</span><span>{ITPropertyInfo.getText(detailItem.cpu)}</span></div>
                                <div className="memory"><span>{ProjectResource.ID.main.itPropertyInfoDetail.ram}</span><span>:</span><span>{ITPropertyInfo.getText(detailItem.ram)}</span></div>
                                <div className="disk"><span>{ProjectResource.ID.main.itPropertyInfoDetail.disk}</span><span>:</span><span>{ITPropertyInfo.getText(detailItem.diskInfo)}</span></div>
                            </span>
                            <span className="rackDetailRight">
                                <div className="diskSize"><span>{ProjectResource.ID.main.itPropertyInfoDetail.diskVolume}</span><span>:</span><span>{ITPropertyInfo.getText(detailItem.diskVolume)}</span></div>
                                <div className="day"><span>{ProjectResource.ID.main.itPropertyInfoDetail.regDate}</span><span>:</span><span>{ITVentRackInfo.getRegDate(detailItem)}</span></div>
                                <div className="size"><span>{ProjectResource.ID.main.itPropertyInfoDetail.size}</span><span>:</span><span>{ITPropertyInfo.getItemSize(detailItem)}</span></div>
                                <div className="shelf"><span>{ProjectResource.ID.main.itPropertyInfoDetail.shelf}</span><span>:</span><span>{ProjectResource.getNeedText(detailItem.shelf)}</span></div>
                            </span>
                        </span>
                    </span> */}

                    <span className="rackDetailBox">
                        <span className="rackDetailImage">
                            <span className="rackFrontBox">
                                <span className="rackFrontTitle">Front</span>
                                    <img className={frontClassName} src={frontImageUrl} />
                            </span>
                            <span className="rackBackBox">
                                <span className="rackBackTitle">Back</span>
                                    <img className={backClassName} src={backImageUrl} />
                            </span>
                        </span>
                            <span className="rackDetailContents">
                                {
                                    itemTypeName === "box"/*detailItem.box*/ && this.getBoxItems(detailItem.box)
                                }
                                {
                                    itemTypeName === "backup"/*detailItem.backup*/ && this.getBackupItems(detailItem.backup)
                                }
                                {
                                    itemTypeName === "etc"/*detailItem.etc*/ && this.getEtcItems(detailItem.etc)
                                }
                                {
                                    itemTypeName === "network"/*detailItem.network*/ && this.getNetworkItems(detailItem.network)
                                }
                                {
                                    itemTypeName === "san switch"/*detailItem.sanSwitch*/ && this.getSanSwitchItems(detailItem.sanSwitch)
                                }
                                {
                                    itemTypeName === "security"/*detailItem.security*/ && this.getSecurityItems(detailItem.security)
                                }
                                {
                                    itemTypeName === "storage"/*detailItem.storage*/ && this.getStorageItems(detailItem.storage)
                                }
                                {
                                    /*<span className="rackDetailLeft">
                                        <div className="equipmentName"><span>장비명</span><span>:</span><span>주차1타워 차단기 리모컨</span></div>
                                        <div className="otherName"><span>기타장비상세분류</span><span>:</span><span>-</span></div>
                                        <div className="purpose"><span>용도</span><span>:</span><span>차번인식기</span></div>
                                        <div className="state"><span>상태</span><span>:</span><span>-</span></div>
                                        <div className="modelName"><span>모델명</span><span>:</span><span>GS-RTRX</span></div>
                                        <div className="manufacturer"><span>제조사</span><span>:</span><span>지오엔시스</span></div>
                                    </span>*/
                                }
                        </span>
                    </span>
                    </>
                );
            }
        }

        rackElements.push(
            <div className={rackBoxClassName}>
                <div className={main.rackModelImage}></div>
                <div className={main.rackInfoScroll}>
                    <div className={main.rackInfoBox}>
                    {
                        slotElements
                    }
                    </div>
                </div>
            </div>
        );

        return rackElements;
    }

    onClose() {
        this.props.setVisiblePopups(this.props.popupType, false);
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
                <div id={this.props.popupType} className={main.modelPopup + " " + CommonResource.UISection}>
                    <div className={main.modelBox}>
                        <span className={main.modelTitle}><span className={main.modelIcon}></span><p>IT장비 비교</p><span className={main.closeBtn} onClick={() => this.onClose()}></span></span>

                        <div style={{ display: 'flex', height: '98%' }}>
                            <div className={main.modelInventList}>

                                <div className={main.inventoryBoxArea}>
                                    <div className={main.inventoryBoxM}>
                                        <span className={main.inventTitle}><span className={main.inventIcon}></span><p>랙/인벤토리 목록</p></span>

                                        <span className={main.inventSearch}>
                                            <input ref={this.refSearch} type="text" placeholder="검색어를 입력하세요." onKeyUp={(e) => this.onSearch(e)} />
                                        </span>

                                        <div className={main.inventTreeBox + " " + main.inventScroll}>
                                            <ul className={main.inventTreeM}>
                                                {this.getRackItems()}
                                            </ul>
                                        </div>
                                    </div> {/* assetManagementBox */}

                                    {/*<div className={main.rackLocationArea}>*/}
                                    {/*    <span className={main.miniTitle2}><span className={main.miniIcon}></span><p>미니맵</p></span>*/}
                                    {/*    <div className={main.rackLocationBox}>*/}
                                    {/*        {*/}
                                    {/*            this.state.firstRack &&*/}
                                    {/*            <span className={main.rack1Act}></span>*/}
                                    {/*        }*/}
                                    {/*        {*/}
                                    {/*            this.state.secondRack &&*/}
                                    {/*            <span className={main.rack2Act}></span>*/}
                                    {/*        }*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div> {/* modelInventList */}

                            <div className={main.modelArea1} onDrop={(e) => this.onDrop(e, 1)} onDragOver={this.onDragOver}>
                                {
                                    this.getRackDetailElement(this.state.firstRack, 1, main.modelTitle1, main.rackBox1)
                                }
                            </div>  {/* model 표출창1 */}

                            <div className={main.modelArea2} onDrop={(e) => this.onDrop(e, 2)} onDragOver={this.onDragOver}>
                                {
                                    this.getRackDetailElement(this.state.secondRack, 2, main.modelTitle2, main.rackBox2)
                                }
                            </div> {/* model 표출창2 */}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ModelComparison;