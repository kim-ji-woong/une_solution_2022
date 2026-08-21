import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../Main/css/main.module.css';
import uis from '../../Common/css/ui.module.css';


import ProjectResource from '../../Root/resource/id';
import Navbar from './navBar';
import Inventory from './inventory';
//import MiniMap from './miniMap';
import ModeBar from './modeBar';
import TitleBar from '../../Root/titleBar';
import ChangeDisorder from '../../Main/ui/changeDisorder';

import ModelComparison from './modelComparison';
import InventRackInfo from '../../Main/ui/inventRackInfo';
import ITPropertyInfo from '../../Main/ui/itPropertyInfo';
import RightMenubar from '../../Main/ui/rightMenubar';


import OperationKey from '../../Main/ui/operationkey';
import MainController from '../services/mainController';
import Interchange from '../../Root/interchange';
import ITPropertyInfoDetail from './itPropertyInfoDetail';
import wsManager from '../../Root/services/wsManager';

import InventoryManagement from '../../Main/ui/inventoryManagement';
//import CameraBox from '../../PropertyEdit/ui/cameraBox';
import Edit from '../../PropertyEdit/ui/edit';
import ITViewer from './itViewer';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import CommonResource from '../../Common/resource/id';
import TimerVDC from '../../Root/timerVDC';
import CFDViewer from '../../Main/ui/cfdViewer';
import StringUtil from '../../Common/util/StringUtil';


class Main extends Component {
    static RackGroup = 1;
    static Rack = 2;
    static RackItem = 3;
    static Facility = 4;

    static popupLayer = {
        inventory: "inventory",
        itPropertyInfo: "itPropertyInfo",
        itPropertyInfoDetail: "itPropertyInfoDetail",
        inventRackInfo: "inventRackInfo",
        miniMap: "miniMap",
        changeDisorder: "changeDisorder",
        modelComparison: "modelComparison",
        InventoryManagement: "InventoryManagement",
        CFDViewer: "cfdViewer"
    }

    static expandType = {
        none: 0,
        rack: 1,
        item: 2
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            rackGroups: {},
            selected: {
                rackGroup: null,
                rack: null,
                item: null
            },
            visiblePopups: this.initVisiblePopups(),
            popupLayer: {
                inventoryZIndex: 0,
                itPropertyInfoZIndex: -1,
                itPropertyInfoDetailZIndex: -1,
                inventRackInfoZIndex: -1
            },
            popupState: {},
            modeFPS: false,
            layerState: this.initLayerState(),
            show3D: {
                item: null,
                modelName: null,
                itemType: null
            },
            fmsUpdateTime: "",
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null
            },
            sensorAlarmStatus: {}
        }

        //팝업 상태값 일괄 획득
        this.getPopupState();

        this.readDatas();

        this.expandType = Main.expandType.none;
    }

    componentDidMount() {
        const elements = document.getElementsByClassName(main.appWrap);
        if (elements.length > 0) {
            elements[0].style.background = "rgba(0,0,0,0)";
        }
        $('#mainSB').removeClass(uis.appWrap);
        $('#mainSB').addClass(uis.appWrapMain);

        this.initWebSocket();
    }

    componentDidUpdate() {
        if (this.props.getBackgroundOption()) {
            $('#mainSB').removeClass(uis.appWrap);
            $('#mainSB').addClass(uis.appWrapMain);
        }
    }

    componentWillUnmount() {
        $('#mainSB').removeClass(uis.appWrapMain);
        $('#mainSB').addClass(uis.appWrap);

        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }


    showConfirmDialog = (title, messages, buttons, onClickButton) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    alertMessage = (message, messageType = ProjectResource.ID.messageBox.title.warning) => {
        this.showConfirmDialog(messageType, [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
    }

    initVisiblePopups() {
        const visiblePopups = {};

        visiblePopups[Main.popupLayer.inventory] = true;
        visiblePopups[Main.popupLayer.itPropertyInfo] = false;
        visiblePopups[Main.popupLayer.itPropertyInfoDetail] = false;
        visiblePopups[Main.popupLayer.inventRackInfo] = false;
        visiblePopups[Main.popupLayer.miniMap] = true;
        visiblePopups[Main.popupLayer.changeDisorder] = false;
        visiblePopups[Main.popupLayer.modelComparison] = false;
        visiblePopups[Main.popupLayer.InventoryManagement] = this.props.showInventoryManagement;
        visiblePopups[Main.popupLayer.CFDViewer] = false;

        return visiblePopups;
    }

    initLayerState() {
        const layerState = {
        };

        layerState[wsManager.layer.nameTag] = false;
        return layerState;
    }

    // 저장된 위치 값 호출
    async getPopupState() {
        // 세션에서 DB의 유저 key값 획득, 전체 팝업 좌표를 호출한다.
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        //this.initWebSocket(userInfo);

        const result = await MainController.requestGetOption(userInfo.id, 'popup');
        /*
         * propertyValue1 - x좌표 (pos)
         * propertyValue2 - y좌표 (pos)
         * propertyValue3 - height (size)
         * propertyValue4 - width (size)
        */
        if (typeof result !== 'undefined' && result[0] && result[1] != null) {
            var popupState = {}
            for (var i = 0; i < result[1].length; i++) {
                popupState[result[1][i].subCategory] = {
                    id: result[1][i].id,
                    x: result[1][i].propertyValue1,
                    y: result[1][i].propertyValue2,
                    height: result[1][i].propertyValue3,
                    width: result[1][i].propertyValue4
                };
            }
            this.setState({ popupState: popupState });
        }
    }

    initWebSocket() {
        this.wsManager = this.props.wsManager;

        if (this.wsManager) {
            this.wsManager.setMain(this);

            this.wsManager.changeMode(wsManager.mode3D.birdView, this.props.getCameraOnOff() ? 1 : 0, this.props.getSensorOnOff() ? 1 : 0);
            this.wsManager.showMinimap(this.state.visiblePopups[Main.popupLayer.miniMap]);

            if (this.props.dataCenter) {
                this.wsManager.loadDataCenter(this.props.dataCenter.id);
            }
        }
    }

    //팝업 크기, 위치값 저장
    setPopupState = async (popup, state) => {
        // setState
        var popupState = this.state.popupState;
        popupState[popup] = state;

        let userInfo = ProjectResource.getUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        //DB 전달
        const result = await MainController.requestSaveOption(
            state.id,
            userInfo.id,    // UserID
            'popup',        // Category
            popup,          // SubCategory
            state.x,        // PropertyValue1
            state.y,        // PropertyValue2
            state.height,    // PropertyValue3
            state.width    // PropertyValue4
        );

        if (result[0]) {
            popupState[popup].id = result[1][0].id;
            this.setState({ popupState: popupState });
        }
    }

    // 드래그로 선택된 팝업과 나머지 팝업의 z-index를 조절한다. (선택된 팝업이 앞으로 나오도록)
    setActiveDragPopup = (popupType) => {
        // CCTV 팝업창이 제대로 동작하지 않아 제이쿼리 방식으로 수정 - K.D.R
        for (const key in Main.popupLayer) {
            const layerName = Main.popupLayer[key];

            if (layerName === popupType) {
                $("#" + layerName).css("z-index", 1);
            } else {
                $("#" + layerName).css("z-index", 0);
            }

        }
    }

    async readDatas() {
        // 아무런 RackGroup에도 속하지 않은 Rack들을 위한 임시 RackGroup
        this.tempRackGroup = Edit.makeTempRackGroup(this.props.dataCenter.id);
        const [result, errorMessage] = await MainController.requestRackNItems(this.props.dataCenter.id);

        if (!result) {
            //alert(errorMessage);
            this.showConfirmDialog("에러", [errorMessage], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }
        else {
            this.setState({ rackGroups: Main.makeRackNItemDatas(result, this.tempRackGroup), loading: false });
        }
    }

    static makeRackNItemDatas(result, tempRackGroup) {
        const rackGroups = {};
        const rackGroupIDs = {};

        for (const rackGroup of result.rackGroups) {
            const _rackGroup = {
                id: rackGroup.id,
                groupName: rackGroup.groupName,
                racks: []
            };

            rackGroups[rackGroup.groupName] = _rackGroup;
            rackGroupIDs[rackGroup.id] = _rackGroup;
        }

        const racks = {};
        const rackTypes = {};

        for (const rackType of result.rackTypes) {
            rackTypes[rackType.id] = rackType;
        }

        for (const rack of result.racks) {
            let rackGroup = rack.rackGroupID !== 0 && !rack.rackGroupID ? null : rackGroupIDs[rack.rackGroupID];

            if (!rackGroup) {
                if (tempRackGroup) {
                    rackGroup = tempRackGroup;
                    rack.rackGroupID = tempRackGroup.id;
                }
                //continue;
            }

            const rackType = rackTypes[rack.rackTypeID];

            if (!rackType) {
                continue;
            }

            const _rack = { ...rack };
            _rack.rackGroup = rackGroup;
            _rack.rackType = rackType;
            _rack.items = [];

            if (rackGroup) {
                rackGroup.racks.push(_rack);
            }

            racks[_rack.id] = _rack;
        }

        const itemTypes = {};

        for (const itemType of result.itemTypes) {
            itemTypes[itemType.id] = itemType;
        }

        const items = {};

        for (const item of result.items) {
            const rack = racks[item.rackID];

            if (!rack) {
                continue;
            }

            const itemType = itemTypes[item.itemTypeID];

            if (!itemType) {
                continue;
            }

            const _item = { ...item };
            _item.itemType = itemType;
            _item.rack = rack;

            rack.items.push(_item);
            items[_item.id] = _item;
        }

        for (const itemID in items) {
            const item = items[itemID];
            const linkedItems = [];

            for (const id of item.linkedItemIDs) {
                const linkedItem = items[id];

                if (linkedItem) {
                    linkedItems.push(linkedItem);
                }
            }

            item.linkedItems = linkedItems;
        }

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            rackGroup.racks.sort(Main.compareRack);

            for (const rack of rackGroup.racks) {
                rack.items.sort(Main.compareRackItem);
            }
        }

        tempRackGroup.racks.sort(Main.compareRack);

        for (const rack of tempRackGroup.racks) {
            rack.items.sort(Main.compareRackItem);
        }

        return rackGroups;
    }

    setItem(item, itemType) {
        item.itemType = itemType;
        item.linkedItems = [];

        const rackGroups = { ...this.state.rackGroups };
        const items = {};

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            this.setRackItem(item, rackGroup, items);
        }

        this.setRackItem(item, this.tempRackGroup, items);

        for (const itemID of item.linkedItemIDs) {
            const _item = items[itemID];

            if (_item) {
                item.linkedItems.push(_item);
            }
        }
    }

    setRackItem(item, rackGroup, items) {
        for (const rack of rackGroup.racks) {
            const itemCount = rack.items.length;

            for (let j = 0; j < itemCount; j++) {
                const _item = rack.items[j];

                if (_item.id === item.id) {
                    rack.items[j] = item;
                    item.rack = rack;
                    continue;
                }

                items[_item.id] = _item;
                const linkedCount = _item.linkedItems.length;

                for (let i = 0; i < linkedCount; i++) {
                    const linkedItem = _item.linkedItems[i];

                    if (linkedItem.id === item.id) {
                        _item.linkedItems[i] = item;
                        break;
                    }
                }
            }
        }
    }

    static compareRack(rack1, rack2) {
        if (rack1.name < rack2.name) {
            return -1;
        }
        else if (rack1.name > rack2.name) {
            return 1;
        }

        return 0;
    }

    static compareRackItem(item1, item2) {
        if (item1.uPos < item2.uPos) {
            return -1;
        }
        else if (item1.uPos > item2.uPos) {
            return 1;
        }

        return 0;
    }

    getDataCenterName() {
        const dataCenter = this.props.dataCenter;

        if (dataCenter) {
            const centerName = ProjectResource.getSiteName(dataCenter.site) + " - " + ProjectResource.getDataCenterName(dataCenter);
            return centerName;
        }

        return "";
    }

    onSelect = (item, itemType, sendMessage = true) => {
        if (itemType === Main.RackGroup) {
            if (this.state.modeFPS) {
                return;
            }

            if (item) {
                this.setState({ selected: { rackGroup: item, rack: null, item: null } });
            }
            else {
                this.setState({ selected: { rackGroup: null, rack: null, item: null } });
            }
            /*let selectedRack = this.state.selected.rack;

            if (selectedRack && selectedRack.rackGroup !== item) {
                selectedRack = null;
            }

            this.setState({ selected: { rackGroup: item, rack: selectedRack, item: null } });*/
        }
        else if (itemType === Main.Rack) {
            if (this.state.modeFPS) {
                return;
            }

            if (item) {
                const visiblePopups = this.getVisiblePopup(Main.popupLayer.inventRackInfo, true);
                this.getVisiblePopup(Main.popupLayer.itPropertyInfo, false, visiblePopups);

                const rackItem = this.state.selected.item && this.state.selected.item.rack === item ? this.state.selected.item : null;
                this.setState({ selected: { rack: item, rackGroup: item ? item.rackGroup : null, item: rackItem }, visiblePopups });

                if (this.wsManager && sendMessage) {
                    this.wsManager.selectRack(item.id);
                }
            }
            else {
                this.setState({ selected: { rack: null, rackGroup: this.state.selected.rackGroup, item: null }, visiblePopups: this.getVisiblePopup(Main.popupLayer.inventRackInfo, false) });

                if (this.wsManager && sendMessage) {
                    this.wsManager.selectRack(null);
                }
            }
        }
        else if (itemType === Main.RackItem) {
            this.selectRackItem(item, sendMessage);
            /*if (this.state.selected.item !== item) {
                if (item) {
                    const visiblePopups = this.getVisiblePopup(Main.popupLayer.itPropertyInfo, true);
                    this.getVisiblePopup(Main.popupLayer.inventRackInfo, false, visiblePopups);
                    this.setState({ selected: { rack: item.rack, rackGroup: item.rack.rackGroup, item: item }, visiblePopups });

                    if (this.wsManager && sendMessage) {
                        this.wsManager.selectItem(item.id);
                    }
                }
                else {
                    this.setState({ selected: { rack: this.state.selected.rack, rackGroup: this.state.selected.rackGroup, item: null }, visiblePopups: this.getVisiblePopup(Main.popupLayer.itPropertyInfo, false) });

                    if (this.wsManager && sendMessage) {
                        this.wsManager.selectItem(null);
                    }
                }
            }
            else {
                this.setState({ selected: { rack: this.state.selected.rack, rackGroup: this.state.selected.rackGroup, item: null }, visiblePopups: this.getVisiblePopup(Main.popupLayer.inventRackInfo, true) });
            }*/
        }
    }

    async selectRackItem(item, sendMessage) {
        if (!this.props.dataCenter) {
            return;
        }

        if (this.state.selected.item !== item) {
            if (item) {
                const [result, errorMessage] = await MainController.requestItem(this.props.dataCenter.id, item.id);

                if (result) {
                    this.setItem(result.item, result.itemType);

                    const visiblePopups = this.getVisiblePopup(Main.popupLayer.itPropertyInfo, true);
                    this.getVisiblePopup(Main.popupLayer.inventRackInfo, false, visiblePopups);
                    this.setState({ selected: { rack: result.item.rack, rackGroup: result.item.rack.rackGroup, item: result.item }, visiblePopups });

                    if (this.wsManager && sendMessage) {
                        this.wsManager.selectItem(result.item.id);
                    }
                }
                else {
                    this.alertMessage(errorMessage);
                }
            }
            else {
                this.setState({ selected: { rack: this.state.selected.rack, rackGroup: this.state.selected.rackGroup, item: null }, visiblePopups: this.getVisiblePopup(Main.popupLayer.itPropertyInfo, false) });

                if (this.wsManager && sendMessage) {
                    this.wsManager.selectItem(null);
                }
            }
        }
        else {
            this.setState({ selected: { rack: this.state.selected.rack, rackGroup: this.state.selected.rackGroup, item: null }, visiblePopups: this.getVisiblePopup(Main.popupLayer.inventRackInfo, true) });
        }
    }

    onSelectID(id, itemType) {
        const rackGroups = { ...this.state.rackGroups };
        rackGroups[this.tempRackGroup.groupName] = this.tempRackGroup;

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            if (itemType === Main.RackGroup) {
                if (rackGroup.id === id) {
                    return this.onSelect(rackGroup, itemType);
                }
            }
            else {
                for (const rack of rackGroup.racks) {
                    if (itemType === Main.Rack) {
                        if (rack.id === id) {
                            // 3D로부터 Rack 선택 이벤트를 받으면 Tree에서도 선택하여준다.
                            this.setExpandType(Main.expandType.rack);
                            this.onSelect(rack, itemType, false);
                            return;
                        }
                    }
                    else {
                        for (const item of rack.items) {
                            if (itemType === Main.RackItem) {
                                if (item.id === id) {
                                    // 3D로부터 Item 선택 이벤트를 받으면 Tree에서도 선택하여준다.
                                    this.setExpandType(Main.expandType.item);

                                    if (this.state.selected.item !== item) {
                                        this.onSelect(item, itemType, false);
                                    }

                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    setExpandType(expandType) {
        this.expandType = expandType;
    }

    getExpandType = () => {
        const expandType = this.expandType;
        this.expandType = Main.expandType.none;
        return expandType;
    }

    setVisiblePopups = (item, visible) => {
        if (item === Main.popupLayer.miniMap) {
            this.wsManager.showMinimap(visible);
        }

        if (item === Main.popupLayer.modelComparison) {
            if (visible) {
                this.wsManager.changeMode(wsManager.mode3D.modelCompare);
            }
            else {
                if (this.state.modeFPS) {
                    this.wsManager.changeMode(wsManager.mode3D.fps, this.props.getCameraOnOff() ? 1 : 0, this.props.getSensorOnOff() ? 1 : 0);
                }
                else {
                    this.wsManager.changeMode(wsManager.mode3D.birdView, this.props.getCameraOnOff() ? 1 : 0, this.props.getSensorOnOff() ? 1 : 0);
                }
            }
        }

        const visiblePopups = { ...this.state.visiblePopups };
        visiblePopups[item] = visible;

        if (visible === false) {
            if (item === Main.popupLayer.inventRackInfo) {
                this.setState({ visiblePopups, selected: { rack: null, rackGroup: this.state.selected.rackGroup, item: null } });
            }
            else if (item === Main.popupLayer.itPropertyInfo) {
                this.setState({ visiblePopups, selected: { rack: this.state.selected.rack, rackGroup: this.state.selected.rackGroup, item: null } });
            }
            else {
                this.setState({ visiblePopups });
            }
        }
        else {
            this.setState({ visiblePopups });
        }
    }

    getVisiblePopups = (item) => {
        return this.state.visiblePopups[item];
    }

    getVisiblePopup(item, visible, visiblePopups) {
        if (!visiblePopups) {
            visiblePopups = { ...this.state.visiblePopups };
        }

        visiblePopups[item] = visible;
        return visiblePopups;
    }

    changeModeFps = (modeFPS) => {
        if (modeFPS) {
            if (this.wsManager) {
                this.wsManager.changeMode(wsManager.mode3D.fps, this.props.getCameraOnOff() ? 1 : 0, this.props.getSensorOnOff() ? 1 : 0);
            }
        }
        else {
            if (this.wsManager) {
                this.wsManager.changeMode(wsManager.mode3D.birdView, this.props.getCameraOnOff() ? 1 : 0, this.props.getSensorOnOff() ? 1 : 0);
            }
        }

        this.setState({ modeFPS, selected: { rackGroup: null, rack: null, item: null } });
    }

    getLayerState = (layer) => {
        const onOff = this.state.layerState[layer];

        if (onOff) {
            return true;
        }

        return false;
    }

    setLayerState = (layer, onOff) => {
        const layerState = { ...this.state.layerState };
        layerState[layer] = onOff;

        if (this.wsManager) {
            this.wsManager.setLayerState(layerState);
        }

        this.setState({ layerState });
    }

    // 1인칭 시점에서의 카메라 위치 및 각도를 알려준다.
    setCameraPosition(x, y, rotation) {
    }

    onClickEditMode = () => {
        this.wsManager.changeMode(wsManager.mode3D.edit, 1/*this.props.getCameraOnOff() ? 1 : 0*/, this.props.getSensorOnOff() ? 1 : 0);
        this.props.onChangeMode(Interchange.Mode.edit, this.props.makeParameter(Interchange.paramType.dataCenter, this.props.dataCenter));
        //this.props.onChangeMode(Interchange.Mode.edit, [this.props.dataCenter, this.state.rackGroups, this.tempRackGroup]);
    }

    goToDashboard() {
        this.wsManager.changeMode(wsManager.mode3D.none);
        this.props.onChangeMode(Interchange.Mode.dashboard);
    }

    show3DItem = (item, modelName, itemType) => {
        this.setState({ show3D: { item: item, modelName: modelName, itemType: itemType } });
    }

    get3DItemUrl() {
        const url = this.state.show3D.item;

        if (url.startsWith("/")) {
            return ProjectResource.baseUrl + url;
        }

        return ProjectResource.baseUrl + "/" + url;
    }

    updateFMSTime(dataCenterID, isAlarm) {
        const current = new Date();
        const date = current.getFullYear() + "." + StringUtil.getDoubleString(current.getMonth() + 1).toString() + "." + StringUtil.getDoubleString(current.getDate()).toString() + " ";
        const time = StringUtil.getDoubleString(current.getHours()).toString() + ":" + StringUtil.getDoubleString(current.getMinutes()).toString() + ":" + StringUtil.getDoubleString(current.getSeconds()).toString();

        const sensorAlarmStatus = { ...this.state.sensorAlarmStatus };
        sensorAlarmStatus[dataCenterID] = isAlarm;

        this.setState({ fmsUpdateTime: date + time, sensorAlarmStatus });
    }

    sendSensorList() {
        if (this.wsManager && this.props.dataCenter) {
            this.wsManager.responseSensorList(this.props.dataCenter.id);
        }
    }

    showFmsBox() {
        if (this.props.getSensorOnOff()) {
            return true;
        }

        return this.state.sensorAlarmStatus[this.props.dataCenter.id];
    }

    setCameraOnOff = (on) => {
        this.props.setCameraOnOff(on, false);
    }

    render() {
        if (this.state.loading) {
            return <></>;
        }

        const showModelCompare = this.state.visiblePopups[Main.popupLayer.modelComparison];
        const selected = this.state.selected;

        const uiHeaderBox = main.headerBox + " " + CommonResource.UISection;

        const headerBoxClassName = this.props.isNewRegist ? main.headerBox : uiHeaderBox;
        const contents3DBoxClassName = this.props.getCameraOnOff() ? main.contents3DBox : main.contents3DBox + " " + main.dark;
        
        return (
            <>
                <div className={main.mainBoxBackground}>
                    <div className={headerBoxClassName}>
                        {
                            !this.props.isNewRegist && !showModelCompare &&
                            <span className={main.vdsLogoBox + " " + CommonResource.UISection} style={{ position: 'absolute', left: '40px', top: '4px' }}><p className={main.vdsLogo} onClick={() => this.goToDashboard()}></p></span>
                        }
                        <TimerVDC dataCenter={this.props.dataCenter} style={{ position: 'absolute', left: '100px', top: '0px' }}/>
                        {
                            !this.props.isNewRegist &&
                            <span className={main.lgTitle} style={{ position: 'absolute', left: '280px', top: '0px' }}>{this.getDataCenterName()}</span>
                        }
                        {/*{*/}
                        {/*    !showModelCompare &&*/}
                        {/*    <TitleBar menuEvent={this.props.menuEvent} target={this.props.target} style={{ position: 'absolute', right: '0px', top: '0px' }} mode={TitleBar.modeMain} onChangeMode={this.props.onChangeMode} wsManager={this.wsManager} makeParameter={this.props.makeParameter} setNewRegistMode={this.props.setNewRegistMode} />*/}
                        {/*}*/}
                    </div>
                    {
                        !showModelCompare &&
                        <TitleBar menuEvent={this.props.menuEvent} target={this.props.target} site={this.props.dataCenter?.site} dataCenter={this.props.dataCenter} style={{ position: 'absolute', right: '0px', top: '0px' }} mode={TitleBar.modeMain} onChangeMode={this.props.onChangeMode} wsManager={this.wsManager} makeParameter={this.props.makeParameter} setNewRegistMode={this.props.setNewRegistMode} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} closeRootMessageBox={this.props.closeRootMessageBox} showRootMessageBox={this.props.showRootMessageBox} getCameraOnOff={this.props.getCameraOnOff} setCameraOnOff={this.props.setCameraOnOff} getSensorOnOff={this.props.getSensorOnOff} setSensorOnOff={this.props.setSensorOnOff} />
                    }

                {
                    !this.props.isNewRegist &&
                        <div id="app3D_main" className={contents3DBoxClassName}>
                            {
                                !showModelCompare &&
                                <Navbar
                                    dataCenter={this.props.dataCenter}
                                    wsManager={this.wsManager}
                                    modeFPS={this.state.modeFPS}
                                    changeModeFps={this.changeModeFps}
                                    setLayerState={this.setLayerState}
                                    getLayerState={this.getLayerState}
                                    getCameraOnOff={this.props.getCameraOnOff}
                                    setCameraOnOff={this.props.setCameraOnOff}
                                    getSensorOnOff={this.props.getSensorOnOff}
                                    setSensorOnOff={this.props.setSensorOnOff}
                                    alertMessage={this.alertMessage}
                                />
                            }
                            {
                                this.state.visiblePopups[Main.popupLayer.inventory] && !this.state.modeFPS && !showModelCompare &&
                                <Inventory
                                    dataCenter={this.props.dataCenter}
                                    rackGroups={this.state.rackGroups}
                                    tempRackGroup={this.tempRackGroup}
                                    selected={selected}
                                    onSelect={this.onSelect}
                                    popupType={Main.popupLayer.inventory}
                                    popupState={this.state.popupState.inventory}
                                    setPopupState={this.setPopupState}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    setVisiblePopups={this.setVisiblePopups}
                                    setLayerState={this.setLayerState}
                                    getExpandType={this.getExpandType}
                                    wsManager={this.wsManager}
                                />
                            }
                            {
                                this.state.visiblePopups[Main.popupLayer.changeDisorder] && !this.state.modeFPS && !showModelCompare &&
                                <ChangeDisorder
                                    dataCenter={this.props.dataCenter}
                                    wsManager={this.wsManager}
                                    popupType={Main.popupLayer.changeDisorder}
                                    popupState={this.state.popupState.changeDisorder}
                                    setPopupState={this.setPopupState}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    setVisiblePopups={this.setVisiblePopups}
                                    alertMessage={this.alertMessage}
                                />
                            }
                            {
                        /*this.state.visiblePopups[Main.popupLayer.miniMap] &&
                        <MiniMap
                            popupType={Main.popupLayer.miniMap}
                            popupState={this.state.popupState.miniMap}
                            setPopupState={this.setPopupState}
                            setActiveDragPopup={this.setActiveDragPopup}
                            setVisiblePopups={this.setVisiblePopups}
                        />*/
                            }
                            {
                                !showModelCompare &&
                                <ModeBar
                                    modeFPS={this.state.modeFPS}
                                    changeModeFps={this.changeModeFps}
                                    setVisiblePopups={this.setVisiblePopups}
                                    getVisiblePopups={this.getVisiblePopups}
                                    onClickEditMode={this.onClickEditMode}
                                    alertMessage={this.alertMessage}
                                />
                            }
                            {
                                selected.rack && this.state.visiblePopups[Main.popupLayer.inventRackInfo] && !showModelCompare &&
                                <InventRackInfo
                                    selected={selected}
                                    popupType={Main.popupLayer.inventRackInfo}
                                    popupState={this.state.popupState.inventRackInfo}
                                    setPopupState={this.setPopupState}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    setVisiblePopups={this.setVisiblePopups}
                                />
                            }
                            {
                                selected.item && this.state.visiblePopups[Main.popupLayer.itPropertyInfo] && !showModelCompare &&
                                <ITPropertyInfo
                                    selected={selected}
                                    popupType={Main.popupLayer.itPropertyInfo}
                                    popupState={this.state.popupState.itPropertyInfo}
                                    setPopupState={this.setPopupState}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    detailVisible={this.state.visiblePopups[Main.popupLayer.itPropertyInfoDetail]}
                                    setVisiblePopups={this.setVisiblePopups}
                                />
                            }
                            {
                                selected.item && this.state.visiblePopups[Main.popupLayer.itPropertyInfoDetail] && !showModelCompare &&
                                <ITPropertyInfoDetail
                                    item={selected.item}
                                    popupType={Main.popupLayer.itPropertyInfoDetail}
                                    popupState={this.state.popupState.itPropertyInfoDetail}
                                    setPopupState={this.setPopupState}
                                    setActiveDragPopup={this.setActiveDragPopup}
                                    setVisiblePopups={this.setVisiblePopups}
                                    show3DItem={this.show3DItem}
                                />
                            }

                            {
                                this.state.modeFPS && !showModelCompare &&
                                <OperationKey />
                            }
                            {
                                !showModelCompare &&
                                <RightMenubar
                                    setVisiblePopups={this.setVisiblePopups}
                                    getVisiblePopups={this.getVisiblePopups}
                                    alertMessage={this.alertMessage}
                                />
                            }
                            {
                                showModelCompare &&
                                <ModelComparison
                                    popupType={Main.popupLayer.modelComparison}
                                    dataCenter={this.props.dataCenter}
                                    rackGroups={this.state.rackGroups}
                                    tempRackGroup={this.tempRackGroup}
                                    selected={selected}
                                    setVisiblePopups={this.setVisiblePopups}
                                    wsManager={this.wsManager}
                                />
                            }
                            {
                                this.state.show3D.item && this.state.show3D.item.length > 0 && !showModelCompare &&
                                <ITViewer url={this.get3DItemUrl()} show3DItem={this.show3DItem} itemModelName={this.state.show3D.modelName} itemType={this.state.show3D.itemType} />
                            }
                    </div>
                }
            </div>
                {
                    !this.props.isNewRegist && this.state.visiblePopups[Main.popupLayer.InventoryManagement] &&
                    <InventoryManagement
                        popupType={Main.popupLayer.InventoryManagement}
                        setVisiblePopups={this.setVisiblePopups}
                        getVisiblePopups={this.getVisiblePopups}
                        dataCenter={this.props.dataCenter}
                    />
                }
                {
                    !this.props.isNewRegist && this.state.visiblePopups[Main.popupLayer.cfdViewer] &&
                    <CFDViewer
                        popupType={Main.popupLayer.cfdViewer}
                        setVisiblePopups={this.setVisiblePopups}
                        getVisiblePopups={this.getVisiblePopups}
                        dataCenterID={this.props.dataCenter?.id}
                        alertMessage={this.alertMessage}
                    />
                }

                {
                    this.showFmsBox() &&
                    <div className={main.FMSBox + " UI_Section"} onClick={() => this.sendSensorList()}>
                        <span className={main.fmsIcon}></span>
                        <span className={main.fmsTitle}>FMS정보 업데이트</span>
                        <div className={main.fmsContents}>
                            <span>마지막 업데이트</span>
                            <span>{this.state.fmsUpdateTime}</span>
                        </div>
                    </div>
                }
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} />
                }

            </>
        );

    }

}

export default Main;