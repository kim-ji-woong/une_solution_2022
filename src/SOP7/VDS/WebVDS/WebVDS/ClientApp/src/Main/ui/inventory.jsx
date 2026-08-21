import React, { Component } from 'react';
import $ from 'jquery';

import main from '../../Main/css/main.module.css';

//import SettingsStore from '../../Settings/settingsStore';
import PopupDraggable from './popupDraggable';
import ProjectResource from '../../Root/resource/id';
import Main from './main';
import wsManager from '../../Root/services/wsManager';
import CommonResource from '../../Common/resource/id';

//import DetailInfo from './detailInfo';


class Inventory extends Component {
    static mode = {
        all: "all",
        server: "server",
        network: "network",
        etc: "etc"
    }

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            popupMinWidth: 351,
            popupMinHeight: 536,
            mode: Inventory.mode.all,
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
        this.refSelectedRackGroup = React.createRef();
        this.refSelectedRack = React.createRef();
        this.refInventory = React.createRef();

        this.expandRackElement = null;
        this.expandRackGroupElement = null;
    }

    componentDidMount() {
        /*const _this = this;

        // 트리 열고 닫기
        $('.' + main.inventTree + ' h5 div ').click(function () {
            if ($(this).is('.' + main.on)) {
                _this.collapseElement(this, true);
                //$(this).removeClass(main.on);
                //$(this).parent().next().hide();
            } else {
                _this.collapseElement(this, false);
                //$(this).addClass(main.on);
                //$(this).parent().next().show();
            };
        });

        $('.' + main.inventTree + ' h5 span ').click(function () {
            if ($(this).is('.' + main.on)) {
                _this.collapseElement(this, true);
                //$(this).removeClass(main.on);
                //$(this).parent().next().hide();
            } else {
                _this.collapseElement(this, false);
                //$(this).addClass(main.on);
                //$(this).parent().next().show();
            };
        });*/
        this.checkExpand();
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            //console.log('statusInfoZIndex changed', this.state.popup.style.zIndex)
        }

        //this.setScrollbar();
        this.checkExpand();
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    checkExpand() {
        const expandType = this.props.getExpandType();

        if (expandType === Main.expandType.rack) {
            if (this.refSelectedRackGroup.current) {
                this.collapseElement(this.refSelectedRackGroup.current.parentElement, false);
            }
        }
        else if (expandType === Main.expandType.item) {
            if (this.refSelectedRackGroup.current && this.refSelectedRack.current) {
                this.collapseElement(this.refSelectedRackGroup.current.parentElement, false);
                //this.collapseElement(this.refSelectedRack.current.parentElement, false);

                if (this.refInventory.current) {
                    const elements = this.refInventory.current.getElementsByClassName(main.RName + " " + main.selected);

                    if (elements && elements.length > 0) {
                        this.collapseElement(elements[0].parentElement, false);
                    }
                }
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
                if (this.expandRackElement && this.expandRackElement !== element) {
                    this.collapse(this.expandRackElement);
                }

                this.expandRackElement = element;
            }
        }
    }

    collapse(element) {
        if (element.classList.contains(main.on)) {
            $(element).removeClass(main.on);
        }

        const nextElementText = element.parentElement?.nextSibling?.innerHTML;

        if (nextElementText && nextElementText.startsWith("<li>")) {
            $(element).parent().next().hide();
        }
    }

    expand(element) {
        if (element.classList.contains(main.on) === false) {
            $(element).addClass(main.on);
        }

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

    setVisiblePoi(typeName, visible) {
        this.props.setVisiblePoi(typeName, visible);
    }

    initPopupState() {
        var popup = document.getElementsByClassName(main.inventoryPopup)[0];

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
        let data = popupState.inventory;

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

    checkItemType(item) {
        if (this.state.mode === Inventory.mode.all) {
            return true;
        }

        let itemType = item.itemType?.equipmentTypeData?.engName;

        if (!itemType) {
            return false;
        }

        itemType = itemType.toLowerCase();

        if (this.state.mode === Inventory.mode.server ||
            this.state.mode === Inventory.mode.network) {
            if (this.state.mode === itemType) {
                return true;
            }
        }
        else {
            if (itemType !== Inventory.mode.server && itemType !== Inventory.mode.network) {
                return true;
            }
        }

        return false;
    }

    onClickRackGroup(e, rackGroup) {
        const element = e.target.parentElement;

        if ($(element).is('.' + main.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }

        this.props.onSelect(rackGroup, Main.RackGroup);
    }

    onClickRack(e, rack) {
        const element = e.target.parentElement;

        if ($(element).is('.' + main.on)) {
            this.collapseElement(element, true);
        }
        else {
            this.collapseElement(element, false);
        }

        this.props.onSelect(rack, Main.Rack);
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
            const rackGroupClassName = rackGroup === this.props.selected.rackGroup ? main.LName + " " + main.selected : main.LName;

            if (rackGroup === this.props.selected.rackGroup) {
                listItems.push(
                    <h5> {/* 제목 title */}
                        <div style={{ display: 'flex' }}>
                            <p ref={this.refSelectedRackGroup} className={rackGroupClassName} onClick={(e) => this.onClickRackGroup(e, rackGroup)/*this.props.onSelect(rackGroup, Main.RackGroup)*/}>{groupName}</p>
                        </div>
                    </h5>
                );
            }
            else {
                listItems.push(
                    <h5> {/* 제목 title */}
                        <div style={{ display: 'flex' }}>
                            <p className={rackGroupClassName} onClick={(e) => this.onClickRackGroup(e, rackGroup)/*this.props.onSelect(rackGroup, Main.RackGroup)*/}>{groupName}</p>
                        </div>
                    </h5>
                );
            }

            if (rackGroup.racks.length > 0) {
                const rackItems = [];

                for (const rack of rackGroup.racks) {
                    const itemCount = rack.items.length;
                    const rackClassName = rack === this.props.selected.rack ? main.RName + " " + main.selected : main.RName;

                    //f (itemCount > 0) {
                        const detailItems = [];
                        let validCount = 0;

                        for (let i = itemCount-1; i >= 0; i--) {
                            const item = rack.items[i];

                            if (this.checkItemType(item) === false || this.checkSearchText_item(searchText, item) === false) {
                                continue;
                            }
                            else {
                                validCount++;
                            }

                            const itemClassName = this.props.selected.item === item ? main.selected : "";
                            const circleClassName = item.status === 1 ? main.greenCircle : main.redCircle;

                            detailItems.push(
                                <>
                                    <>
                                    <span id={main.rackBox} className={itemClassName} onClick={() => this.props.onSelect(item, Main.RackItem)}>
                                        <span className={main.box1}>{item.uPos}</span>
                                        <span className={main.box2}>{ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData)}</span>
                                            <span className={main.box3}>{item.name}</span>
                                            <span className={main.box4}>{item.itemType.modelName}</span>
                                        <span className={main.box5}>{item.itemType.unit + "U"}</span>
                                            <span className={main.box6}><span className={circleClassName}></span></span>
                                    </span>

                                    {/* IT자산 변경 */}
                                    {/* <span id={main.rackBox} className={itemClassName} onClick={() => this.props.onSelect(item, Main.RackItem)}>
                                        <span className={main.box1}>24</span>
                                        <span className={main.box2}>어플라이언스</span>
                                        <span className={main.box3}>IT-9</span>
                                        <span className={main.box4}>SG510-20-M5</span>
                                        <span className={main.box5}>{item.itemType.unit + "U"}</span>
                                        <span className={main.box6}><span className={main.greenCircle}></span></span>
                                    </span> */}
                                    </>
                                </>
                            );
                        }

                        if (validCount > 0 || this.checkSearchText_rack(searchText, rack)) {
                            if (rack === this.props.selected.rack) {
                                rackItems.push(
                                    <h5 style={{ padding: '5px 0px' }}>
                                        <div>
                                            <p ref={this.refSelectedRack} className={rackClassName} onClick={(e) => this.onClickRack(e, rack)/*this.props.onSelect(rack, Main.Rack)*/}>{rack.name}</p>
                                            <span className={main.LNumBox}>
                                                <p className={main.LFont}>{validCount}</p>
                                            </span>
                                        </div>
                                    </h5>
                                );
                            }
                            else {
                                rackItems.push(
                                    <h5 style={{ padding: '5px 0px' }}>
                                        <div>
                                            <p className={rackClassName} onClick={(e) => this.onClickRack(e, rack)/*this.props.onSelect(rack, Main.Rack)*/}>{rack.name}</p>
                                            <span className={main.LNumBox}>
                                                <p className={main.LFont}>{validCount}</p>
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
                                            <div id={main.rackArea}>
                                                {detailItems}
                                            </div>
                                        </h5>
                                    </li>
                                </ul>
                            );
                        }
                    //}

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

        if (item.name.toLowerCase().includes(text)) {
            return true;
        }

        const unit = item.itemType.unit + "U";

        if (unit.includes(text)) {
            return true;
        }

        return false;
    }

    onClose() {
        this.props.setVisiblePopups(this.props.popupType, false);
    }

    setMode(mode) {
        this.setState({ mode });

        if (mode === Inventory.mode.all) {
            this.props.setLayerState(wsManager.layer.rackType_all, true);
        }
        else if (mode === Inventory.mode.server) {
            this.props.setLayerState(wsManager.layer.rackType_server, true);
        }
        else if (mode === Inventory.mode.network) {
            this.props.setLayerState(wsManager.layer.rackType_network, true);
        }
        else if (mode === Inventory.mode.etc) {
            this.props.setLayerState(wsManager.layer.rackType_etc, true);
        }
    }

    onSearch(e) {
        if (e.keyCode === 13) {
            const text = this.refSearch.current.value;
            this.setState({ searchText: text });
        }
    }

    render() {
        const allClassName = this.state.mode === Inventory.mode.all ? main.areaBtn + " " + main.selected : main.areaBtn;
        const serverClassName = this.state.mode === Inventory.mode.server ? main.serverBtn + " " + main.selected : main.serverBtn;
        const networkClassName = this.state.mode === Inventory.mode.network ? main.netWorkBtn + " " + main.selected : main.netWorkBtn;
        const etcClassName = this.state.mode === Inventory.mode.etc ? main.etcBtn + " " + main.selected : main.etcBtn;

        return (
            <>
                <div ref={this.refInventory} id={this.props.popupType} className={main.inventoryPopup + " " + main.inventoryBox + " " + CommonResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={353}
                        popupMinHeight={536}
                        topSize={32}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                        >
                    <div style={{ padding: '17px' }}>
                        <span className={main.inventTitle}><span className={main.inventIcon}></span><p>{ProjectResource.ID.main.inventory}</p><span className={main.closeBtn} onClick={() => this.onClose()}></span></span>
                        {/* <span className={main.btnArea}>
                            <span className={allClassName} onClick={() => this.setMode(Inventory.mode.all)}>{ProjectResource.ID.main.inventoryButtons.all}</span>
                            <span className={serverClassName} onClick={() => this.setMode(Inventory.mode.server)}>{ProjectResource.ID.main.inventoryButtons.server}</span>
                            <span className={networkClassName} onClick={() => this.setMode(Inventory.mode.network)}>{ProjectResource.ID.main.inventoryButtons.network}</span>
                            <span className={etcClassName} onClick={() => this.setMode(Inventory.mode.etc)}>{ProjectResource.ID.main.inventoryButtons.etc}</span>
                        </span> */}

                        <span className={main.inventSearch}>
                            <input ref={this.refSearch} type="text" placeholder={ProjectResource.ID.main.inventoryPlaceHolder} onKeyUp={(e) => this.onSearch(e)}/* className={main.inventSearch} */ />
                        </span>

                        <div className={main.inventScroll + " " + main.inventBox}>
                            <ul className={main.inventTree}>
                                {this.getRackItems()}
                            </ul>
                        </div>
                    </div> {/* assetManagementBox */}

                    </PopupDraggable>
                </div>
            </>
        );
    }

    //render() {

    //    return (
    //        <>
    //            <div id={this.props.popupType} className={main.inventoryPopup}>
    //                <PopupDraggable
    //                    id={this.props.popupType}
    //                    popupMinWidth={373}
    //                    popupMinHeight={493}
    //                    topSize={35}
    //                    popupState={this.props.popupState}
    //                    setActiveDragPopup={this.props.setActiveDragPopup}
    //                    setPopupState={this.props.setPopupState}
    //                >

    //                    <div className={main.inventoryBox}>
    //                        <span className={main.inventTitle}><span className={main.inventIcon}></span><p>{ProjectResource.ID.main.inventory}</p><span className={main.closeBtn}></span></span>
    //                        <span className={main.btnArea}>
    //                            <span className={main.areaBtn}>{ProjectResource.ID.main.inventoryButtons.all}</span>
    //                            <span className={main.serverBtn}>{ProjectResource.ID.main.inventoryButtons.server}</span>
    //                            <span className={main.netWorkBtn}>{ProjectResource.ID.main.inventoryButtons.network}</span>
    //                            <span className={main.etcBtn}>{ProjectResource.ID.main.inventoryButtons.etc}</span>
    //                        </span>

    //                        <span className={main.inventSearch}>
    //                            <input type="text" placeholder={ProjectResource.ID.main.inventoryPlaceHolder} /* className={main.inventSearch} */ />
    //                        </span>

    //                        <div className={main.inventTreeBox} /* style={{ display: 'none' }} */>
    //                            <div className={main.inventScroll} style={{ height: 'calc(100vh - 840px)', overflowX: 'hidden' }}>
    //                                <ul className={main.inventTree}>
    //                                    <li style={{ borderBottom: 'solid 1px #7E8088' }}>
    //                                        <h5> {/* 제목 title */}
    //                                            <div style={{ display: 'flex' }}>
    //                                                <p className={main.LName}>L-1</p>
    //                                            </div>
    //                                        </h5>
    //                                    </li>
    //                                    {/************************************************************************/}
    //                                    <li style={{ borderBottom: 'solid 1px #7E8088' }}>
    //                                        <h5> {/* 제목 title */}
    //                                            <div>
    //                                                <p className={main.LName}>L-2</p>
    //                                            </div>
    //                                        </h5>
    //                                        <ul style={{ marginBottom: '10px' }}>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack01</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}> 
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack02</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>9</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                                <ul style={{ marginBottom: '10px' }}>
    //                                                    <li>
    //                                                        <h5 style={{ padding: '5px 0px' }}> 
    //                                                            <div id={main.rackArea}>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>24</span>
    //                                                                    <span className={main.box2}>어플라이언스</span>
    //                                                                    <span className={main.box3}>Lenova</span>
    //                                                                    <span className={main.box4}>SG510-20-M5</span>
    //                                                                    <span className={main.box5}>2U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>20</span>
    //                                                                    <span className={main.box2}>어플라이언스</span>
    //                                                                    <span className={main.box3}>Lenova</span>
    //                                                                    <span className={main.box4}>SG510-20-M5</span>
    //                                                                    <span className={main.box5}>2U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>15</span>
    //                                                                    <span className={main.box2}>서버</span>
    //                                                                    <span className={main.box3}>DELL</span>
    //                                                                    <span className={main.box4}>R710</span>
    //                                                                    <span className={main.box5}>1U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>13</span>
    //                                                                    <span className={main.box2}>어플라이언스</span>
    //                                                                    <span className={main.box3}>Lenova</span>
    //                                                                    <span className={main.box4}>SG510-20-M5</span>
    //                                                                    <span className={main.box5}>1U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>30</span>
    //                                                                    <span className={main.box2}>네트워크</span>
    //                                                                    <span className={main.box3}>2980</span>
    //                                                                    <span className={main.box4}>30</span>
    //                                                                    <span className={main.box5}>2U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>30</span>
    //                                                                    <span className={main.box2}>네트워크</span>
    //                                                                    <span className={main.box3}>2980</span>
    //                                                                    <span className={main.box4}>30</span>
    //                                                                    <span className={main.box5}>2U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>30</span>
    //                                                                    <span className={main.box2}>네트워크</span>
    //                                                                    <span className={main.box3}>2980</span>
    //                                                                    <span className={main.box4}>30</span>
    //                                                                    <span className={main.box5}>2U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>30</span>
    //                                                                    <span className={main.box2}>네트워크</span>
    //                                                                    <span className={main.box3}>2980</span>
    //                                                                    <span className={main.box4}>30</span>
    //                                                                    <span className={main.box5}>2U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                                <span id={main.rackBox}>
    //                                                                    <span className={main.box1}>30</span>
    //                                                                    <span className={main.box2}>네트워크</span>
    //                                                                    <span className={main.box3}>2980</span>
    //                                                                    <span className={main.box4}>30</span>
    //                                                                    <span className={main.box5}>2U</span>
    //                                                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
    //                                                                </span>
    //                                                            </div>
    //                                                        </h5>
    //                                                    </li>
    //                                                </ul>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack03</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack04</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack05</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack06</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack07</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack08</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack09</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                            <li>
    //                                                <h5 style={{ padding: '5px 0px' }}>
    //                                                    <div>
    //                                                        <p className={main.RName}>Rack10</p>
    //                                                        <span className={main.LNumBox}>
    //                                                            <p className={main.LFont}>12</p>
    //                                                        </span>
    //                                                    </div>
    //                                                </h5>
    //                                            </li>
    //                                        </ul>
    //                                    </li>
    //                                    <li style={{ borderBottom: 'solid 1px #7E8088' }}>
    //                                        <h5> {/* 제목 title */}
    //                                            <div style={{ display: 'flex' }}>
    //                                                <p className={main.LName}>L-3</p>
    //                                            </div>
    //                                        </h5>
    //                                    </li>
    //                                    <li style={{ borderBottom: 'solid 1px #7E8088' }}>
    //                                        <h5> {/* 제목 title */}
    //                                            <div style={{ display: 'flex' }}>
    //                                                <p className={main.LName}>L-4</p>
    //                                            </div>
    //                                        </h5>
    //                                    </li>
    //                                    <li style={{ borderBottom: 'solid 1px #7E8088' }}>
    //                                        <h5> {/* 제목 title */}
    //                                            <div style={{ display: 'flex' }}>
    //                                                <p className={main.LName}>L-5</p>
    //                                            </div>
    //                                        </h5>
    //                                    </li>
    //                                    <li style={{ borderBottom: 'solid 1px #7E8088' }}>
    //                                        <h5> {/* 제목 title */}
    //                                            <div style={{ display: 'flex' }}>
    //                                                <p className={main.LName}>L-6</p>
    //                                            </div>
    //                                        </h5>
    //                                    </li>
    //                                </ul>
    //                            </div>
    //                        </div>
    //                    </div> {/* assetManagementBox */}

    //                </PopupDraggable>

    //            </div>
    //        </>
    //    );
    //}
}

export default Inventory;