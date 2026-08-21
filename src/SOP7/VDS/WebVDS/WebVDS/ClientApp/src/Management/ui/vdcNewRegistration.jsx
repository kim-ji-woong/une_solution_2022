import React, { Component } from 'react';

import $ from 'jquery';

import uis from '../../Common/css/ui.module.css';
import dash from '../../Dashboard/css/dash.module.css';
import VDCListBox from './vdcListBox';
import ITUploadBox from './itUploadBox';
import VDCInfoBox from './vdcInfoBox';
import VDCEvent from './vdcEvent';
import VDCRackArea from './vdcRackArea';
import VDCRackContainer from './vdcRackContainer';
import VDCPropertyLibrary from './vdcPropertyLibrary';
import Interchange from '../../Root/interchange';
import Edit from '../../PropertyEdit/ui/edit';
import MainController from '../../Main/services/mainController';
import Main from '../../Main/ui/main';
import EditController from '../../PropertyEdit/services/editController';
import PopupMenu from '../../PropertyEdit/ui/popupMenu';
import EditDataManager from '../../PropertyEdit/services/editDataManager';
import ProjectResource from '../../Root/resource/id';
import ManagementController from '../services/managementController';
import CommonResource from '../../Common/resource/id';
import Viewer from '../../PropertyEdit/ui/viewer';
import CameraBox from '../../PropertyEdit/ui/cameraBox';
import wsManager from '../../Root/services/wsManager';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import StringUtil from '../../Common/util/StringUtil';

class VDCNewRegistration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rackGroups: {},
            facilities: [],
            sensors: [],
            rackTypes: [],
            itemTypes: [],
            facilityTypes: [],
            sensorTypes: [],
            selected: {
                rackGroup: null,
                rack: null
            },
            site: null,
            nation: null,
            popupMenu: PopupMenu.menu.none,
            popupMenuParameter: [],
            popupMenuAction: PopupMenu.action.none,
            popupMenuActionParameter: [],
            isChanged: false,
            loading: true,
            confirmMessage: {
                visible: false,
                title: "",
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                icon: ConfirmDialog.icon.check
            },
            show3D: {
                item: null,
                modelName: null,
                itemType: null
            },
        }

        if (this.props.wsManager) {
            this.wsManager = this.props.wsManager;
            this.wsManager.setNewRegist(this);
        }

        this.readDatas();
    }

    componentDidMount() {
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
    }

    componentWillUnmount() {
        $('#mainSB').removeClass(uis.appWrapMain);
        $('#mainSB').addClass(uis.appWrap);
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    async readDatas() {
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
                this.racks = {};

                for (const groupName in rackGroups) {
                    const rack = rackGroups[groupName];
                    this.racks[rack.id] = rack;
                }

                const [result3, message] = await ManagementController.requestSiteNNation(this.props.dataCenter.siteID, this.props.dataCenter.nationID);

                if (result3) {
                    this.facilities = this.setFacilities(result.facilities);
                    this.sensors = this.setSensors(result.sensors);

                    const [sensorTypes, errorMessage2] = await EditController.requestSensorTypes();

                    if (sensorTypes) {
                        this.setState({ rackGroups: rackGroups, rackTypes: result2.rackTypes, itemTypes: result2.itemTypes, facilityTypes: result2.facilityTypes, sensorTypes, facilities: result.facilities, sensors: result.sensors, site: result3.site, nation: result3.nation, loading: false });
                    }
                    else {
                        this.showConfirmDialog("에러", [errorMessage2], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    }
                }
                else {
                    if (message && message.length > 0) {
                        this.showConfirmDialog("에러", [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                    }
                }
            }
        }
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

    async readRackNItemTypes() {
        const [result, errorMessage] = await EditController.requestRackNItemTypes();

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.showConfirmDialog("에러", [errorMessage], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
            }
        }
        else {
        }

        return result;
    }

    alertMessage = (message, messageType = ProjectResource.ID.messageBox.title.warning) => {
        this.showConfirmDialog(messageType, [message], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
    }

    onSelect = (item, itemType) => {
        if (itemType === Main.RackGroup) {
            if (this.state.selected.rackGroup !== item) {
                if (item) {
                    this.setState({ selected: { rackGroup: item, rack: null } });
                }
                else {
                    this.setState({ selected: { rackGroup: null, rack: null } });
                }
            }
        }
        else if (itemType === Main.Rack) {
            if (this.state.selected.rack !== item) {
                if (item) {
                    // Rack만 선택하면 3D App에 해당 Rack이 선택되었음을 알린다.
                    this.setState({ selected: { rack: item, rackGroup: item.rackGroup, item: null } });

                    if (this.wsManager) {
                        this.wsManager.selectRack(item.id);
                    }
                }
                else {
                    this.setState({ selected: { rack: null, rackGroup: this.state.selected.rackGroup } });

                    if (this.wsManager) {
                        this.wsManager.selectRack(null);
                    }
                }
            }
        }
    }

    setDragItem = (item, typeName) => {
        this.dragItem = [item, typeName];

        if (typeName === Edit.dragType.rackType) {
            if (this.wsManager) {
                if (item) {
                    this.wsManager.dragStartRackType(item);
                }
                else {
                    this.wsManager.dragEndRackType();
                }
            }
        }
        else if (typeName === Edit.dragType.facilityType) {
            if (this.wsManager) {
                if (item) {
                    this.wsManager.dragStartFacilityType(item);
                }
                else {
                    this.wsManager.dragEndFacilityType();
                }
            }
        }
        else if (typeName === Edit.dragType.sensorType) {
            if (this.wsManager) {
                if (item) {
                    this.wsManager.dragStartSensorType(item);
                }
                else {
                    this.wsManager.dragEndSensorType();
                }
            }
        }
    }

    getDragItem = () => {
        return this.dragItem;
    }

    getRack(rackID) {
        const rackGroups = { ...this.state.rackGroups };

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            for (const rack of rackGroup.racks) {
                if (rack.id === rackID) {
                    return rack;
                }
            }
        }

        return null;
    }

    showPopupMenu = (menu, parameter) => {
        if (menu === PopupMenu.menu.selectRack) {
            if (parameter && parameter.length === 3) {
                const rackID = parameter[2];
                const rack = this.racks[rackID];

                if (rack) {
                    // 3D로부터 Rack 선택 이벤트를 받으면 Tree에서도 선택하여준다.
                    this.setState({ popupMenu: menu, popupMenuParameter: parameter, selected: { rackGroup: rack.rackGroup, rack: rack } });
                }

                return;
            }
        }

        this.setState({ popupMenu: menu, popupMenuParameter: parameter });
    }

    hidePopupMenu() {
        this.setState({ popupMenu: PopupMenu.menu.none });
    }

    onAction = (action, parameter, closePopupMenu = true) => {
        if (this.wsManager.onMenuAction(action, parameter, this)) {
            if (closePopupMenu) {
                this.setState({ popupMenu: PopupMenu.menu.none, popupMenuAction: action, popupMenuActionParameter: parameter, isChanged: this.editDataManager.isChanged() });
            }
            else {
                this.setState({ popupMenuAction: action, popupMenuActionParameter: parameter, isChanged: this.editDataManager.isChanged() });
            }
        }
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

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            const rackCount = rackGroup.racks.length;

            for (let i = rackCount - 1; i >= 0; i--) {
                const rack = rackGroup.racks[i];

                if (rackIDs.includes(rack.id.toString())) {
                    this.editDataManager.removeRack(rack);
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

        this.setState({ isChanged: true });
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
        for (const _rack of rackGroup.racks) {
            if (_rack.id === rack.id) {
                return _rack;
            }
        }

        return null;
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

    setSensorName(sensorID, sensorName) {
        const sensor = this.sensors[sensorID];

        if (sensor) {
            sensor.name = sensorName;
            this.editDataManager.updateSensor(sensor);
            this.setState({ isChanged: true });
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

    onInitialize = () => {
        this.editDataManager.rollBack();
        this.setState({ isChanged: false });
    }

    onSave = async (goEdit) => {
        if (this.props.dataCenter) {
            const success = await this.editDataManager.save(this.props.dataCenter.id);

            if (!success[0]) {
                this.showConfirmDialog("에러", [success[1]], this.state.confirmMessage.buttons, () => this.onCloseConfirmDialog());
                this.setState({ selected: { rackGroup: null, rack: null, item: null }, isChanged: false });
                return;
            }
        }

        this.setState({ isChanged: false });

        if (goEdit) {
            this.wsManager.changeMode(wsManager.mode3D.edit, 1, this.props.getSensorOnOff() ? 1 : 0);
            this.props.onChangeMode(Interchange.Mode.edit, this.props.makeParameter(Interchange.paramType.dataCenter, this.props.dataCenter));
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
        }
    }

    setTempRackGroup(tempRackGroup) {
        this.tempRackGroup = tempRackGroup;

        for (const rack of this.tempRackGroup.racks) {
            this.racks[rack.id] = rack;
        }
    }

    getConfirmMessageDatas(title, messages, buttons, onClickButton, icon) {
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

    showConfirmDialog = (title, messages, buttons, onClickButton, icon = ConfirmDialog.icon.check) => {
        const confirmMessage = this.getConfirmMessageDatas(title, messages, buttons, onClickButton, icon);
        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = false;

        this.setState({ confirmMessage });
    }

    onClose() {
        if (this.props.prev3DMode === wsManager.mode3D.birdView || this.props.prev3DMode === wsManager.mode3D.fps) {
            this.wsManager.changeMode(this.props.prev3DMode, this.props.getCameraOnOff() ? 1 : 0, this.props.getSensorOnOff() ? 1 : 0);
        }
        else {
            if (this.props.prev3DMode === wsManager.mode3D.edit) {
                this.wsManager.changeMode(wsManager.mode3D.edit, 1, this.props.getSensorOnOff() ? 1 : 0);
            }
            else {
                this.wsManager.changeMode(this.props.prev3DMode);
            }
        }

        this.props.onClose();
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

    setCameraOnOff = (on) => {
        this.props.setCameraOnOff(on, false);
    }

    render() {
        if (this.state.loading) {
            return <></>
        }

        return (
            <div id={dash.ITpropertyPop + " " + CommonResource.UISection}>
                <div>
                    <div>
                        <div className={dash.vdcNewRegiBox}>
                            <div style={{ display: 'flex' }} className={dash.vdcNewTitleArea + " " + CommonResource.UISection}>
                                <span className={dash.vdcNewTitle}>VDC 신규등록</span>
                                <span className={dash.vdcNewClose} onClick={() => this.onClose() }></span>
                            </div>
                            <div style={{ display: 'flex', height: '100%' }}>
                                <div className={dash.firstVDCBox}>
                                    <VDCListBox dataCenter={this.props.dataCenter} rackGroups={this.state.rackGroups} tempRackGroup={this.tempRackGroup} rackTypes={this.state.rackTypes} itemTypes={this.state.itemTypes} selected={this.state.selected} onSelect={this.onSelect} />
                                    <VDCInfoBox dataCenter={this.props.dataCenter} site={this.state.site} nation={this.state.nation} /> {/* VDC 정보창 */}
                                    <ITUploadBox dataCenter={this.props.dataCenter} alertMessage={this.alertMessage} />
                                </div>
                                <div className={dash.secondVDCBox}>
                                    <VDCEvent dataCenter={this.props.dataCenter} isActive={this.state.isChanged} onInitialize={this.onInitialize} onSave={this.onSave} showConfirmDialog={this.showConfirmDialog} onCloseConfirmDialog={this.onCloseConfirmDialog} /> {/* DC 이벤트 */}
                                    <VDCRackArea setDragItem={this.setDragItem} getDragItem={this.getDragItem} wsManager={this.wsManager} />  {/* VDC RACK 배경영역 */}
                                </div>
                                <div className={dash.thirdVDCBox}>
                                    <VDCPropertyLibrary rackTypes={this.state.rackTypes} itemTypes={this.state.itemTypes} facilityTypes={this.state.facilityTypes} sensorTypes={this.state.sensorTypes} setDragItem={this.setDragItem} show3DItem={this.show3DItem} /> {/* 3D 라이브러리 */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.popupMenu !== PopupMenu.menu.none &&
                    <PopupMenu menu={this.state.popupMenu} parameter={this.state.popupMenuParameter} onAction={this.onAction} racks={this.racks} edit={this} isEditMode={false} />
                }
                {
                    this.state.show3D.item && this.state.show3D.item.length > 0 &&
                    <Viewer url={this.get3DItemUrl()} show3DItem={this.show3DItem} itemModelName={this.state.show3D.modelName} itemType={this.state.show3D.itemType} />
                }
                {
                    this.state.confirmMessage.visible &&
                    <ConfirmDialog title={this.state.confirmMessage.title} messages={this.state.confirmMessage.messages} buttons={this.state.confirmMessage.buttons} onClose={this.state.confirmMessage.onClose} onClickButton={this.state.confirmMessage.onClickButton} icon={this.state.confirmMessage.icon} />
                }
            </div>
        );
    }
}
export default VDCNewRegistration;