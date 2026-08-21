import React, { Component } from 'react';

import $ from 'jquery';
import edit from '../../PropertyEdit/css/edit.module.css';
import uis from '../../Common/css/ui.module.css';
import dash from '../../Dashboard/css/dash.module.css';

//import ProjectResource from '../../Root/resource/id';
import TitleBar from '../../Root/titleBar';
import EditListBox from '../../PropertyEdit/ui/editListBox';
import RackUploadBox from '../../PropertyEdit/ui/rackUploadBox';
import EditEvent from '../../PropertyEdit/ui/editEvent';
import EditMainBox from './editMainBox';
import Rack3Ddeploy from '../../PropertyEdit/ui/rack3Ddeploy';
import PropertyLibrary from '../../PropertyEdit/ui/propertyLibrary';
import InventoryList from '../../PropertyEdit/ui/inventoryList';
import Viewer from '../../PropertyEdit/ui/viewer';
import ITPropertyList from '../../PropertyEdit/ui/itPropertyList';

import newStyles from '../../Common/css/newStyle.module.css';
import Interchange from '../../Root/interchange';
import ProjectResource from '../../Root/resource/id';
import Main from '../../Main/ui/main';
import RightMenubar from '../../Main/ui/rightMenubar';
import EditDataManager from '../services/editDataManager';
import EditController from '../services/editController';
import PopupMenu from './popupMenu';
import StringUtil from '../../Common/util/StringUtil';
import wsManager from '../../Root/services/wsManager';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import CommonResource from '../../Common/resource/id';
import MainController from '../../Main/services/mainController';
import CameraBox from './cameraBox';
import TimerVDC from '../../Root/timerVDC';
import AccountResource from '../../Account/resource/id';


class Edit extends Component {
    static dragType = {
        itemType: "itemType",
        rackType: "rackType",
        facilityType: "facilityType",
        sensorType: "sensorType"
    }

    static expandType = {
        none: 0,
        rack: 1,
        item: 2
    }

    static postAlertMode = {
        dashboard: 0,
        main: 1
    }

    constructor(props) {
        super(props);

        this.state = {
            rackGroups: {},
            facilities: [],
            sensors: [],
            selected: {
                rackGroup: null,
                rack: null,
                item: null
            },
            showInventoryList: false,
            show3D: {
                item: null,
                modelName: null,
                itemType: null
            },
            visibleITPropertyList: false,
            isChanged: false,
            loading: true,
            loadingData: false,
            rackTypes: [],
            itemTypes: [],
            facilityTypes: [],
            sensorTypes: [],
            popupMenu: PopupMenu.menu.none,
            popupMenuParameter: [],
            popupMenuAction: PopupMenu.action.none,
            popupMenuActionParameter: [],

            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                icon: ConfirmDialog.icon.check
            }
        }

        this.readDatas();

        //this.editDataManager = new EditDataManager(this);
        this.dragItem = [null, null];

        this.expandType = Edit.expandType.none;
        this.movingRackItem = null;
        this.itPropertyEdit = false;
        this.cameraMode = CameraBox.mode.a;
        this.postAlertMode = null;

        this.oldSensorOnOff = this.props.getSensorOnOff();
    }

    componentDidMount() {
        this.initWebSocket();
        //this.readRackNItemTypes();

        if (this.state.loading === false && !this.editDataManager) {
            this.editDataManager = new EditDataManager(this);
        }

        $('#mainSB').removeClass(uis.appWrap);
        $('#mainSB').addClass(uis.appWrapMain);
    }

    componentDidUpdate() {
        if (this.state.loading === false && !this.editDataManager) {
            this.editDataManager = new EditDataManager(this);
        }

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

        ProjectResource.deleteObject(this.racks);
        ProjectResource.deleteObject(this.facilities);
        ProjectResource.deleteObject(this.sensors);
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
            const result2 = await this.readRackNItemTypes();

            if (result2) {
                const rackGroups = Main.makeRackNItemDatas(result, this.tempRackGroup);
                this.racks = this.setRacks(rackGroups);
                this.facilities = this.setFacilities(result.facilities);
                this.sensors = this.setSensors(result.sensors);

                const [sensorTypes, errorMessage2] = await EditController.requestSensorTypes();

                if (sensorTypes) {
                    this.setState({ rackGroups, rackTypes: result2.rackTypes, itemTypes: result2.itemTypes, facilityTypes: result2.facilityTypes, facilities: result.facilities, sensors: result.sensors, sensorTypes, loading: false });
                }
                else {
                    this.alertMessage(errorMessage2, ProjectResource.ID.messageBox.title.error);
                }
            }
        }
    }

    reloadDatas = async (message) => {
        this.wsManager.saveEdit(1);

        // 아무런 RackGroup에도 속하지 않은 Rack들을 위한 임시 RackGroup
        this.tempRackGroup = Edit.makeTempRackGroup(this.props.dataCenter.id);

        const [result, errorMessage] = await MainController.requestRackNItems(this.props.dataCenter.id);

        if (!result) {
            this.showConfirmDialog("에러", [errorMessage], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
        }
        else {
            const result2 = await this.readRackNItemTypes();

            if (result2) {
                const rackGroups = Main.makeRackNItemDatas(result, this.tempRackGroup);
                this.racks = this.setRacks(rackGroups);
                this.facilities = this.setFacilities(result.facilities);
                this.sensors = this.setSensors(result.sensors);

                if (message && message.length > 0) {
                    const confirmMessage = this.getConfirmMessageDatas("확인", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    this.setState({ rackGroups, rackTypes: result2.rackTypes, itemTypes: result2.itemTypes, facilityTypes: result2.facilityTypes, facilities: result.facilities, sensors: result.sensors, confirmMessage });
                }
                else {
                    this.setState({ rackGroups, rackTypes: result2.rackTypes, itemTypes: result2.itemTypes, facilityTypes: result2.facilityTypes, facilities: result.facilities, sensors: result.sensors, loading: false });
                }
            }
        }
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    showConfirmDialog = (title, messages, buttons, onClickButton, icon = ConfirmDialog.icon.check) => {
        const confirmMessage = this.getConfirmMessageDatas(title, messages, buttons, onClickButton, icon);
        /*const confirmMessage = { ...this.state.confirmMessage };
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
        }*/

        this.setState({ confirmMessage });
    }

    getConfirmMessageDatas(title, messages, buttons, onClickButton, icon = ConfirmDialog.icon.check) {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.title = title;
        confirmMessage.buttons = buttons;
        confirmMessage.onClickButton = onClickButton;
        confirmMessage.icon = icon;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        return confirmMessage;
    }

    alertMessage = (message, messageType = ProjectResource.ID.messageBox.title.warning) => {
        this.showConfirmDialog(messageType, [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog(), ConfirmDialog.icon.warning);
    }

    initWebSocket() {
        this.wsManager = this.props.wsManager;
        this.wsManager.setEdit(this);
    }

    static makeTempRackGroup(dataCenterID) {
        return {
            id: -1,
            centerID: dataCenterID,
            racks: [],
            groupName: ProjectResource.getUnknownRackGroupName()
        };
    }

    setRackGroups(rackGroups, initialize) {
        const groupNames = [];

        for (const groupName in this.state.rackGroups) {
            groupNames.push(groupName);
        }

        for (const groupName of groupNames) {
            delete this.state.rackGroups[groupName];
        }

        for (const groupName in rackGroups) {
            this.state.rackGroups[groupName] = rackGroups[groupName];
        }

        this.racks = this.setRacks({ ...this.state.rackGroups });

        if (initialize) {
            this.tempRackGroup = Edit.makeTempRackGroup(this.props.dataCenter.id);
        }

        const selected = this.state.selected;

        if (selected) {
            if (selected.rackGroup) {
                selected.rackGroup = rackGroups[selected.rackGroup.groupName];
            }

            if (selected.rack) {
                selected.rack = this.racks[selected.rack.id];
            }

            if (selected.item) {
                for (const rackID in this.racks) {
                    const rack = this.racks[rackID];

                    if (rack) {
                        for (const item of rack.items) {
                            if (item.id === selected.item.id) {
                                selected.item = item;
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    addRackGroup(rackGroupName) {
        if (!rackGroupName || rackGroupName.length === 0) {
            const current = new Date();
            const date = current.getFullYear() + StringUtil.getDoubleString(current.getMonth() + 1).toString() + StringUtil.getDoubleString(current.getDate()).toString();
            const time = StringUtil.getDoubleString(current.getHours()).toString() + StringUtil.getDoubleString(current.getMinutes()).toString() + StringUtil.getDoubleString(current.getSeconds()).toString();

            rackGroupName = "rackGroup_" + date + time;
        }

        let minID = -2;

        for (const groupName in this.state.rackGroups) {
            const rackGroup = this.state.rackGroups[groupName];

            if (rackGroupName === groupName) {
                return rackGroup;
            }

            if (rackGroup.id < minID) {
                minID = rackGroup.id - 1;
            }
        }

        const newRackGroup = Edit.makeTempRackGroup(this.props.dataCenter.id);
        newRackGroup.groupName = rackGroupName;
        newRackGroup.id = minID;

        this.state.rackGroups[rackGroupName] = newRackGroup;
        this.editDataManager.setRackGroupID(newRackGroup, this);
        this.editDataManager.addRackGroup(newRackGroup);
        return newRackGroup;
    }

    setRacks(rackGroups) {
        const racks = {};
        //const rackGroups = { ...this.state.rackGroups };

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            for (const rack of rackGroup.racks) {
                racks[rack.id] = rack;
            }
        }

        for (const rack of this.tempRackGroup.racks) {
            racks[rack.id] = rack;
            rack.rackGroup = this.tempRackGroup;
        }

        return racks;
    }

    setSensors(sensors, initialize) {
        const _sensors = {};
        const sensorArray = [];

        if (Array.isArray(sensors)) {
            for (const sensor of sensors) {
                _sensors[sensor.id] = sensor;
                sensorArray.push(sensor);
            }
        }
        else {
            for (const id in sensors) {
                const sensor = sensors[id];
                _sensors[sensor.id] = sensor;
                sensorArray.push(sensor);
            }
        }

        if (initialize) {
            this.setState({ sensors: sensorArray });
        }

        return _sensors;
    }

    setFacilities(facilities, initialize) {
        const _facilities = {};
        const facilityArray = [];

        if (Array.isArray(facilities)) {
            for (const facility of facilities) {
                _facilities[facility.id] = facility;
                facilityArray.push(facility);
            }
        }
        else {
            for (const id in facilities) {
                const facility = facilities[id];
                _facilities[facility.id] = facility;
                facilityArray.push(facility);
            }
        }

        if (initialize) {
            this.setState({ facilities: facilityArray });
        }

        return _facilities;
    }

    setTempRackGroup(tempRackGroup) {
        this.tempRackGroup = tempRackGroup;

        for (const rack of this.tempRackGroup.racks) {
            this.racks[rack.id] = rack;
        }
    }

    async readRackNItemTypes() {
        const [result, errorMessage] = await EditController.requestRackNItemTypes();

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                //alert(errorMessage);
                this.showConfirmDialog("에러", [errorMessage], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
        }
        else {
            //this.setState({ rackTypes: result.rackTypes, itemTypes: result.itemTypes, loading: false });
        }

        return result;
    }

    onSelect = (item, itemType) => {
        if (itemType === Main.RackGroup) {
            if (this.state.selected.rackGroup !== item) {
                if (item) {
                    this.setState({ selected: { rackGroup: item, rack: null, item: null } });
                }
                else {
                    this.setState({ selected: { rackGroup: null, rack: null, item: null } });
                }
            }
        }
        else if (itemType === Main.Rack) {
            if (this.state.selected.rack !== item) {
                if (item) {
                    // Rack만 선택하면 3D App에 해당 Rack이 선택되었음을 알린다.
                    this.setState({ selected: { rack: item, rackGroup: item.rackGroup, item: null } });

                    // Rack만 선택해도 IT자산 편집 화면이 나오도록 한다.
                    /*const rackItem = {
                        rack: item,
                        linkedItems: []
                    };

                    this.setState({ selected: { rack: item, rackGroup: item.rackGroup, item: rackItem } });*/

                    if (this.wsManager) {
                        this.wsManager.selectRack(item.id);
                    }
                }
                else {
                    this.setState({ selected: { rack: null, rackGroup: this.state.selected.rackGroup, item: null }/*, visiblePopups: this.getVisiblePopup(Main.popupLayer.inventRackInfo, false)*/ });

                    if (this.wsManager) {
                        this.wsManager.selectRack(null);
                    }
                }
            }
        }
        else if (itemType === Main.RackItem) {
            if (this.state.selected.item !== item) {
                if (item) {
                    //const visiblePopups = this.getVisiblePopup(Main.popupLayer.itPropertyInfo, true);
                    //this.getVisiblePopup(Main.popupLayer.inventRackInfo, false, visiblePopups);
                    this.setState({ selected: { rack: item.rack, rackGroup: item.rack.rackGroup, item: item }/*, visiblePopups*/ });

                    /*if (this.wsManager) {
                        this.wsManager.selectItem(item.id);
                    }*/
                }
                else {
                    this.setState({ selected: { rack: this.state.selected.rack, rackGroup: this.state.selected.rackGroup, item: null }/*, visiblePopups: this.getVisiblePopup(Main.popupLayer.itPropertyInfo, false)*/ });

                    /*if (this.wsManager) {
                        this.wsManager.selectItem(null);
                    }*/
                }
            }
            else {
                this.setState({ selected: { rack: this.state.selected.rack, rackGroup: this.state.selected.rackGroup, item: null }/*, visiblePopups: this.getVisiblePopup(Main.popupLayer.inventRackInfo, true)*/ });
            }
        }
    }

    getDataCenterName() {
        const dataCenter = this.props.dataCenter;

        if (dataCenter) {
            const centerName = ProjectResource.getSiteName(dataCenter.site) + " - " + ProjectResource.getDataCenterName(dataCenter);
            return centerName;
        }

        return "";
    }

    toggleInventoryList = () => {
        //this.setState({ showInventoryList: !this.state.showInventoryList });
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

    onAddLinkedItem = (visible) => {
        this.setState({ visibleITPropertyList: visible });
    }

    onRemoveLinkedItem = (linkedItem) => {
        if (this.state.selected.item && linkedItem) {
            const isChanged = this.editDataManager.removeLinkedItem(this.state.selected.item, linkedItem);
            this.setState({ isChanged });
        }
    }

    onLinkedItems = (item, linkedItems) => {
        this.editDataManager.checkLinkedItems(item, linkedItems);
        this.setState({ visibleITPropertyList: false, isChanged: this.editDataManager.isChanged() });
    }

    onInitialize = () => {
        this.editDataManager.rollBack();

        let selectedItem = this.state.selected.item;
        let selectedRack = this.state.selected.rack;

        if (selectedItem?.rack) {
            const rack = this.racks[selectedItem.rack.id];

            if (rack) {
                if (selectedItem.id === null || selectedItem.id === undefined) {
                    selectedItem.rack = rack;
                }
                else {
                    for (const _item of rack.items) {
                        if (selectedItem.id === _item.id) {
                            selectedItem = _item;
                            break;
                        }
                    }
                }
            }
        }

        if (selectedRack) {
            const rack = this.racks[selectedRack.id];

            if (rack) {
                selectedRack = rack;
            }
        }

        this.setState({ selected: { item: selectedItem, rack: selectedRack, rackGroup: this.state.selected.rackGroup }, isChanged: false });
    }

    onSave = async () => {
        if (this.props.dataCenter) {
            this.onLoading(true);

            const success = await this.editDataManager.save(this.props.dataCenter.id);

            this.onLoading(false);

            if (!success[0]) {
                this.showConfirmDialog("에러", [success[1]], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                this.setState({ selected: { rackGroup: null, rack: null, item: null }, isChanged: false });
                return;
            }
        }

        this.setState({ isChanged: false });
    }

    onNewItem = (rack, item) => {
        const itemRack = this.checkRackGroup(rack);

        if (!itemRack) {
            return;
        }

        item.rack = itemRack;
        itemRack.items.push(item);
        itemRack.items.sort(Edit.compareRackItem);
        this.editDataManager.addRackItem(itemRack, item);
        this.setState({
            isChanged: true,
            selected: {
                rackGroup: this.state.selected.rackGroup,
                rack: itemRack,
                item: item
            }
        });
    }

    checkRackGroup = (rack) => {
        if (rack.rackGroup) {
            const rackGroups = this.state.rackGroups;

            for (const groupName in rackGroups) {
                const rackGroup = rackGroups[groupName];

                if (rackGroup.id === rack.rackGroup.id) {
                    return this.checkRack(rack, rackGroup);
                }
            }

            if (this.tempRackGroup.id === rack.rackGroup.id) {
                return this.checkRack(rack, this.tempRackGroup);
            }
        }

        return null;
    }

    checkRack(rack, rackGroup) {
        let sameNameRack = null;

        for (const _rack of rackGroup.racks) {
            if (_rack.id === rack.id) {
                return _rack;
            }

            if (_rack.name === rack.name) {
                sameNameRack = _rack;
            }
        }

        return sameNameRack;
    }

    checkItem(item, rack) {
        if (rack === null) {
            if (!item.rack) {
                return item;
            }

            rack = this.checkRackGroup(item.rack);
        }

        if (item.rack === rack) {
            return item;
        }

        for (const _item of rack.items) {
            if (_item.id === item.id) {
                return _item;
            }
        }

        return null;
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

    onNewItemPrev = (rack, dataCenterID, itemType, uPos, x, y) => {
        /*const x = rect.x;
        const y = rect.y + rect.height + 20;*/
        this.setState({ popupMenu: PopupMenu.menu.mount, popupMenuParameter: [x, y, itemType, uPos, rack, dataCenterID] });
    }

    hidePopupMenu() {
        this.setState({ popupMenu: PopupMenu.menu.none });
    }

    onNewRack = (rack, x, y) => {
        if (this.props.dataCenter?.id !== rack.centerID) {
            this.alertMessage("랙 추가는 현재의 DataCenter에만 적용할 수 있습니다.");
            return;
        }

        this.editDataManager.setRackID(rack);

        this.racks[rack.id] = rack;
        this.tempRackGroup.racks.push(rack);
        rack.rackGroup = this.tempRackGroup;

        this.editDataManager.addRack(rack);
        this.wsManager.setRackID(rack.id, rack.x, rack.y, rack.name);

        // 팝업메뉴는 띄우지 않는다. Drag & Drop시 팝업메뉴가 계속 나타나면 너무 번거롭다.
        this.setState({ isChanged: true });
        //this.setState({ popupMenu: PopupMenu.menu.createNewRack, popupMenuParameter: [x, y, rack], isChanged: true });
    }

    onNewRacks = (racks) => {
        const rackCount = racks.length;

        for (let i = 0; i < rackCount; i++) {
            const rack = racks[i];

            if (this.props.dataCenter?.id !== rack.centerID) {
                this.alertMessage("랙 추가는 현재의 DataCenter에만 적용할 수 있습니다.");
                return;
            }

            this.editDataManager.setRackID(rack);

            this.racks[rack.id] = rack;
            this.tempRackGroup.racks.push(rack);
            rack.rackGroup = this.tempRackGroup;

            this.editDataManager.addRack(rack);
        }

        this.wsManager.setRackIDs(racks);
        this.setState({ isChanged: true });
    }

    onMoveSensors = (x, y, sensorIDs) => {
        let isChanged = false;

        for (const sensorID of sensorIDs) {
            const sensor = this.sensors[sensorID];

            if (sensor) {
                sensor.x = x;
                sensor.y = y;

                this.editDataManager.updateSensor(sensor);
                isChanged = true;
            }
        }

        if (isChanged) {
            this.setState({ isChanged: true });
        }
    }

    onRemoveSensors = (sensorIDs) => {
        //let isChanged = false;

        for (const sensorID of sensorIDs) {
            const sensor = this.sensors[sensorID];

            if (sensor) {
                delete this.sensors[sensor.id];
                this.editDataManager.removeSensor(sensor);
                //isChanged = true;
            }
        }

        this.setState({ isChanged: this.editDataManager.isChanged() });
        /*if (isChanged) {
            this.setState({ isChanged: true });
        }*/
    }

    onMoveFacilities = (x, y, facilityIDs) => {
        let isChanged = false;

        for (const facilityID of facilityIDs) {
            const facility = this.facilities[facilityID];

            if (facility) {
                facility.x = x;
                facility.y = y;

                this.editDataManager.updateFacility(facility);
                isChanged = true;
            }
        }

        if (isChanged) {
            this.setState({ isChanged: true });
        }
    }

    onRotateFacilities = (rotation, facilityIDs) => {
        let isChanged = false;

        for (const facilityID of facilityIDs) {
            const facility = this.facilities[facilityID];

            if (facility) {
                facility.rotation = rotation;
                this.editDataManager.updateFacility(facility);
                isChanged = true;
            }
        }

        if (isChanged) {
            this.setState({ isChanged: true });
        }
    }

    onRemoveFacilities = (facilityIDs) => {
        //let isChanged = false;

        for (const facilityID of facilityIDs) {
            const facility = this.facilities[facilityID];

            if (facility) {
                delete this.facilities[facility.id];
                this.editDataManager.removeFacility(facility);
                //isChanged = true;
            }
        }

        this.setState({ isChanged: this.editDataManager.isChanged() });
        /*if (isChanged) {
            this.setState({ isChanged: true });
        }*/
    }

    onRemoveRacks = (rackIDs) => {
        const rackGroups = { ...this.state.rackGroups };
        rackGroups[this.tempRackGroup.groupName] = this.tempRackGroup;

        const targetCount = rackIDs.length;
        let removeCount = 0;
        let isChanged = this.state.isChanged;

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            const rackCount = rackGroup.racks.length;

            for (let i = rackCount - 1; i >= 0; i--) {
                const rack = rackGroup.racks[i];

                if (rackIDs.includes(rack.id.toString())) {
                    isChanged = this.editDataManager.removeRack(rack);
                    delete this.racks[rack.id];

                    if (++removeCount >= targetCount) {
                        break;
                    }
                }
            }

            if (removeCount >= targetCount) {
                break;
            }
        }

        this.setState({ isChanged });
    }

    onNewFacility = (facility, x, y) => {
        if (this.props.dataCenter?.id !== facility.dataCenterID) {
            this.alertMessage("설비 추가는 현재의 DataCenter에만 적용할 수 있습니다.");
            return;
        }

        this.editDataManager.setFacilityID(facility);

        this.facilities[facility.id] = facility;
        this.editDataManager.addFacility(facility);

        this.wsManager.setFacilityID(facility.id, facility.x, facility.y);

        // 팝업메뉴는 띄우지 않는다. Drag & Drop시 팝업메뉴가 계속 나타나면 너무 번거롭다.
        this.setState({ isChanged: true });
    }

    onNewSensor = (sensor, x, y) => {
        if (this.props.dataCenter?.id !== sensor.centerID) {
            this.alertMessage("센서 추가는 현재의 DataCenter에만 적용할 수 있습니다.");
            return;
        }

        this.editDataManager.setSensorID(sensor);
        this.editDataManager.setSensorName(sensor);

        this.sensors[sensor.id] = sensor;
        this.editDataManager.addSensor(sensor);

        this.wsManager.setSensorID(sensor.id, sensor.x, sensor.y, sensor.name);

        // 팝업메뉴는 띄우지 않는다. Drag & Drop시 팝업메뉴가 계속 나타나면 너무 번거롭다.
        this.setState({ isChanged: true });
    }

    onAction = (action, parameter, closePopupMenu = true) => {
        if (this.wsManager.onMenuAction(action, parameter, this)) {
            if (closePopupMenu) {
                this.setState({ popupMenu: PopupMenu.menu.none, popupMenuAction: action, popupMenuActionParameter: parameter, isChanged: this.editDataManager.isChanged() });
            }
            else {
                this.setState({ popupMenuAction: action, popupMenuActionParameter: parameter, isChanged: this.editDataManager.isChanged() });
            }

            return true;
        }

        return false;
    }

    setDragItem = (item, typeName) => {
        this.movingRackItem = null;
        this.setState({});

        this.dragItem = [item, typeName];

        if (typeName === Edit.dragType.rackType) {
            if (item) {
                this.wsManager.dragStartRackType(item);
            }
            else {
                this.wsManager.dragEndRackType();
            }
        }
        else if (typeName === Edit.dragType.facilityType) {
            if (item) {
                this.wsManager.dragStartFacilityType(item);
            }
            else {
                this.wsManager.dragEndFacilityType();
            }
        }
        else if (typeName === Edit.dragType.sensorType) {
            if (item) {
                this.wsManager.dragStartSensorType(item);
            }
            else {
                this.wsManager.dragEndSensorType();
            }
        }
    }

    getDragItem = () => {
        return this.dragItem;
    }

    showPopupMenu = (menu, parameter) => {
        if (menu === PopupMenu.menu.selectRack) {
            if (parameter && parameter.length === 3) {
                const rackID = parameter[2];
                const rack = this.racks[rackID];

                if (rack) {
                    // 3D로부터 Rack 선택 이벤트를 받으면 Tree에서도 선택하여준다.
                    this.setExpandType(Edit.expandType.rack);
                    this.setState({ popupMenu: menu, popupMenuParameter: parameter, selected: { rackGroup: rack.rackGroup, rack: rack, item: null } });
                }

                return;
            }
        }

        this.setState({ popupMenu: menu, popupMenuParameter: parameter });
    }

    onSelectID(itemID, itemType) {
        if (itemType === Main.Rack) {
            const rack = this.racks[itemID];

            if (rack) {
                // 3D로부터 Rack 선택 이벤트를 받으면 Tree에서도 선택하여준다.
                this.setExpandType(Edit.expandType.rack);
                this.setState({ selected: { rackGroup: rack.rackGroup, rack: rack, item: null } });
            }
        }
        else if (itemType === Main.RackItem) {
            itemID = itemID.toString();

            for (const rackID in this.racks) {
                const rack = this.racks[rackID];

                for (const item of rack.items) {
                    if (item.id.toString() === itemID) {
                        // 3D로부터 Item 선택 이벤트를 받으면 Tree에서도 선택하여준다.
                        this.setExpandType(Edit.expandType.item);
                        this.setState({ selected: { rackGroup: rack.rackGroup, rack: rack, item: item } });
                        return;
                    }
                }
            }
        }
    }

    setSensorName(sensorID, sensorName) {
        const sensor = this.sensors[sensorID];

        if (sensor) {
            if (sensor.nmae !== sensorName) {
                sensor.name = sensorName;
                this.editDataManager.updateSensor(sensor);
                this.setState({ isChanged: true });
            }
        }
    }

    setRackName(rackID, rackName, update) {
        rackID = rackID.toString();

        for (const id in this.racks) {
            if (id.toString() === rackID) {
                continue;
            }

            const rack = this.racks[id];

            if (rack) {
                if (rack.name === rackName) {
                    this.showConfirmDialog("에러", [ProjectResource.ID.errorMessage.sameRackName], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    return false;
                }
            }
        }

        if (update) {
            const targetRack = this.racks[rackID];

            if (targetRack) {
                if (targetRack.name !== rackName) {
                    targetRack.name = rackName;
                    this.editDataManager.updateRack(targetRack);
                }
            }
        }

        return true;
    }

    async onClickButtonCheckSave(index) {
        this.onCloseConfirmDialog();

        if (index === 0) {
            const [success, errorMessage] = await this.editDataManager.save(this.props.dataCenter.id);

            if (success) {
                this.doPostAlert();
            }
            else {
                this.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
        else if (index === 1) {
            this.doPostAlert();
        }
    }

    doPostAlert() {
        if (this.postAlertMode === Edit.postAlertMode.dashboard) {
            this.goToDashboard(false);
        }
        else if (this.postAlertMode === Edit.postAlertMode.main) {
            this.gotoMain(false);
        }
    }

    checkChangedData() {
        if (this.editDataManager.isChanged()) {
            this.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, ["아직 저장되지 않은 편집중인 데이터가 있습니다.", "저장할까요?"], ["저장", "무시", "취소"], (index) => this.onClickButtonCheckSave(index));
            return false;
        }

        return true;
    }

    goToDashboard(checkChange = true) {
        this.postAlertMode = Edit.postAlertMode.dashboard;
        const checked = !checkChange || this.checkChangedData();

        if (checked) {
            this.postAlertMode = null;
            this.wsManager.changeMode(wsManager.mode3D.none);
            this.props.onChangeMode(Interchange.Mode.dashboard);
        }
    }

    gotoMain(checkChange = true) {
        this.postAlertMode = Edit.postAlertMode.main;
        const checked = !checkChange || this.checkChangedData();

        if (checked) {
            this.postAlertMode = null;
            this.props.onChangeMode(Interchange.Mode.main, this.props.dataCenter);
        }
    }

    setExpandType(expandType) {
        this.expandType = expandType;
    }

    getExpandType = () => {
        const expandType = this.expandType;
        this.expandType = Edit.expandType.none;
        return expandType;
    }

    setMovingRackItem = (rackItem) => {
        this.movingRackItem = rackItem;
    }

    getMovingRackItem = () => {
        const rackItem = this.movingRackItem;
        //this.movingRackItem = null;
        return rackItem;
    }

    setCameraMode = (mode) => {
        this.cameraMode = mode;
    }

    getCameraMode = () => {
        return this.cameraMode;
    }

    setViewMode() {
        if (this.wsManager) {
            if (this.state.selected.item) {
                if (!this.itPropertyEdit) {
                    this.itPropertyEdit = true;

                    this.oldSensorOnOff = this.props.getSensorOnOff();
                    this.wsManager.changeMode(wsManager.mode3D.editITProperty);
                    this.props.setSensorOnOff(0);
                }
            }
            else {
                if (this.itPropertyEdit) {
                    this.itPropertyEdit = false;
                    this.wsManager.changeMode(wsManager.mode3D.edit, 1, this.oldSensorOnOff ? 1 : 0);
                    this.props.setSensorOnOff(this.oldSensorOnOff, false);
                }
            }
        }
    }

    static isEditableUser(user) {
        return user && user.levelID <= AccountResource.accountLevel.vdcSupervisor;
    }

    onLoading = (loading) => {
        this.setState({ loadingData: loading });
    }

    async _gotoInventoryManagement(index) {
        this.onCloseConfirmDialog();

        if (index === 1) {
            this.props.onChangeMode(Interchange.Mode.main_InventoryManagement, this.props.dataCenter);
        }
        else if (index === 2) {
            const [success, errorMessage] = await this.editDataManager.save(this.props.dataCenter.id);

            if (success) {
                this.props.onChangeMode(Interchange.Mode.main_InventoryManagement, this.props.dataCenter);
            }
            else {
                this.alertMessage(errorMessage);
            }
        }
    }

    gotoInventoryManagement = () => {
        if (this.editDataManager.isChanged()) {
            this.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, ["아직 저장되지 않은 편집중인 데이터가 있습니다.", "저장할까요?"], ["취소", "초기화후 바로가기", "저장후 바로가기"], (index) => this._gotoInventoryManagement(index));
        }
        else {
            this.props.onChangeMode(Interchange.Mode.main_InventoryManagement, this.props.dataCenter);
        }
    }

    getSensorClassName() {
        const cameraOn = this.props.getCameraOnOff();
        const sensorOn = this.props.getSensorOnOff();

        if (!cameraOn) {
            return [false, null];
        }

        const showSensorIcon = this.state.selected.item === null || this.props.isNewRegist;

        if (sensorOn) {
            return [showSensorIcon, edit.fmsOnIcon + " " + CommonResource.UISection];
        }

        return [showSensorIcon, edit.fmsOffIcon + " " + CommonResource.UISection];
    }

    onClickSensorOnOff() {
        const sensorOn = this.props.getSensorOnOff();
        this.props.setSensorOnOff(!sensorOn);
    }

    setCameraOnOff = (on) => {
        this.props.setCameraOnOff(on, false);
    }

    render() {
        if (this.state.loading) {
            return <></>;
        }

        const user = ProjectResource.getUserInfo();
        this.setViewMode();

        const cameraOnOff = this.props.getCameraOnOff();

        const containerVDSClassName = cameraOnOff ? edit.editContainerVDS : edit.editContainerVDS + " " + edit.dark;
        //const containerVDSClassName = this.state.selected.item ? edit.editContainerVDS + " " + edit.dark : edit.editContainerVDS;
        const headerBoxClassName = this.props.isNewRegist ? edit.marginTop50 : edit.headerBox + " " + CommonResource.UISection;
        const [showSensorIcon, sensorClassName] = this.getSensorClassName();

        const editBackgroundBoxClassName = cameraOnOff ? edit.editBackgroundBox : edit.editBackgroundBox + " " + edit.dark;

        return (
            <>
                <div className={editBackgroundBoxClassName}>
                    <div className={headerBoxClassName}>
                        {
                            !this.props.isNewRegist &&
                            <span className={edit.editLogoBox + " " + CommonResource.UISection} style={{ position: 'absolute', left: '40px', top: '4px' }}><p className={newStyles.vdsEditLogo2} onClick={() => this.goToDashboard()}></p></span>
                        }
                        <TimerVDC dataCenter={this.props.dataCenter} style={{ position: 'absolute', left: '100px', top: '0px' }} />
                        {
                            !this.props.isNewRegist &&
                            <span className={edit.lgTitle + " " + edit.marginTop50} style={{ position: 'absolute', left: '280px', top: '0px' }}>{this.getDataCenterName()}</span>
                        }
                        <TitleBar menuEvent={this.props.menuEvent} target={this.props.target} site={this.props.dataCenter?.site} dataCenter={this.props.dataCenter} style={{ position: 'absolute', right: '0px', top: '0px' }} mode={TitleBar.modeEdit} wsManager={this.wsManager} onChangeMode={this.props.onChangeMode} makeParameter={this.props.makeParameter} setNewRegistMode={this.props.setNewRegistMode} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} closeRootMessageBox={this.props.closeRootMessageBox} showRootMessageBox={this.props.showRootMessageBox} getCameraOnOff={this.props.getCameraOnOff} setCameraOnOff={this.props.setCameraOnOff} getSensorOnOff={this.props.getSensorOnOff} setSensorOnOff={this.props.setSensorOnOff} />
                    </div>

                    {
                        !this.props.isNewRegist &&
                        <div className={containerVDSClassName}>
                            <div className={edit.firstBox + " UI_Section"}>
                                {/* 인벤토리 관리 */}
                                <EditListBox rackGroups={this.state.rackGroups} tempRackGroup={this.tempRackGroup} selected={this.state.selected} onSelect={this.onSelect} toggleInventoryList={this.toggleInventoryList} getExpandType={this.getExpandType} />
                                <RackUploadBox dataCenter={this.props.dataCenter} alertMessage={this.alertMessage} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} reloadDatas={this.reloadDatas} onLoading={this.onLoading} gotoInventoryManagement={this.gotoInventoryManagement}/> {/* 렉 실장도 */}
                            </div>
                            <div className={edit.secondBox}>
                                {
                                    showSensorIcon &&
                                    <span className={sensorClassName} onClick={() => this.onClickSensorOnOff()}></span>
                                }
                                <EditEvent isRackEdit={this.state.selected.item ? false : true} isChanged={this.state.isChanged} onInitialize={this.onInitialize} onSave={this.onSave} user={user} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} />
                                <EditMainBox item={this.state.selected.item} onAddLinkedItem={this.onAddLinkedItem} onRemoveLinkedItem={this.onRemoveLinkedItem} onSelect={this.onSelect} getDragItem={this.getDragItem} setDragItem={this.setDragItem} onNewItem={this.onNewItem} onNewItemPrev={this.onNewItemPrev} itemTypes={this.state.itemTypes} onAction={this.onAction} setMovingRackItem={this.setMovingRackItem} getMovingRackItem={this.getMovingRackItem} setCameraMode={this.setCameraMode} getCameraMode={this.getCameraMode} checkRackGroup={this.checkRackGroup} wsManager={this.wsManager} alertMessage={this.alertMessage} dataCenter={this.props.dataCenter} />
                            
                                {/* <Rack3Ddeploy /> */}

                                <div id={edit.vdsEditModebar} className={edit.modeBar + " UI_Section"}>
                                    <button onClick={this.popupBtm}></button>
                                    <ul ref={this.refQuickButton}>
                                        <li><a onClick={() => {this.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info)}}></a></li>
                                        <li><a onClick={() => { }}></a></li>
                                        <li><a onClick={() => { }}></a></li>
                                        <li><span className={edit.modeChangeEdit} onClick={() => { this.gotoMain() }}>{ProjectResource.ID.quickButton.modeEdit}</span></li>
                                        <li><a onClick={() => { }}></a></li>
                                        <li><a onClick={() => { }}></a></li>
                                        <li><a onClick={() => {this.gotoMain()}} className={edit.on}></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className={edit.thirdBox + " UI_Section"}>
                                <PropertyLibrary show3DItem={this.show3DItem} rackTypes={this.state.rackTypes} setDragItem={this.setDragItem} facilityTypes={this.state.facilityTypes} sensorTypes={this.state.sensorTypes} itemTypes={this.state.itemTypes} item={this.state.selected.item} />
                            </div>

                            <RightMenubar /* open={this.state.popupOpen} */ mode={RightMenubar.modeRightEdit} alertMessage={this.alertMessage} /> {/* 우측메뉴바 */}

                            {/* 팝업창 */}
                            {
                                this.state.showInventoryList &&
                                <InventoryList rackGroups={this.state.rackGroups} />
                            }
                            {
                                this.state.show3D.item && this.state.show3D.item.length > 0 &&
                                <Viewer url={this.get3DItemUrl()} show3DItem={this.show3DItem} itemModelName={this.state.show3D.modelName} itemType={this.state.show3D.itemType} />
                            }
                            {
                                this.state.selected.item && this.state.visibleITPropertyList &&
                                <ITPropertyList rackGroups={this.state.rackGroups} tempRackGroup={this.tempRackGroup} selectedItem={this.state.selected.item} onAddLinkedItem={this.onAddLinkedItem} onLinkedItems={this.onLinkedItems} />
                            }

                        </div>
                    }
                    {
                        this.state.popupMenu !== PopupMenu.menu.none &&
                        <PopupMenu menu={this.state.popupMenu} parameter={this.state.popupMenuParameter} onAction={this.onAction} racks={this.racks} edit={this} isEditMode={true} alertMessage={this.alertMessage} />
                    }
                </div>
                {
                    this.state.loadingData &&
                    <div className={dash.loadingPop}>
                        <div>
                            <div>
                                <div className={dash.loading}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    /* alert창 대신 사용 */
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                }
            </>
        );
    }
}

export default Edit;