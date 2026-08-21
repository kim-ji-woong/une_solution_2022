import Main from "../../Main/ui/main";
import Edit from "../ui/edit";
import EditController from "./editController";

export default class EditDataManager {
    constructor(edit) {
        this.edit = edit;
        this.editItems = {};
        this.originRacks = {};
        this.originRackGroups = {};
        this.originFacilities = {};
        this.originSensors = {};
        this.originTempRackGroup = Edit.makeTempRackGroup(edit.props.dataCenter.id);
        this.originItems = EditDataManager.copyItems(edit.state.rackGroups, edit.tempRackGroup, edit.state.facilities, edit.state.sensors, this.editItems, this.originRacks, this.originRackGroups, this.originTempRackGroup, this.originFacilities, this.originSensors);
        this.removeItems = {};
        this.addItems = {};

        this.addRackItems = {};
        this.updateRackItems = {};
        this.removeRackItems = {};

        this.updateRacks = {};
        this.removeRacks = {};
        this.addRacks = {};

        this.addRackGroups = {};

        this.addFacilities = {};
        this.updateFacilities = {};
        this.removeFacilities = {};

        this.addSensors = {};
        this.updateSensors = {};
        this.removeSensors = {};

        this.tempItemID = -1;
        this.tempRackID = -1;
        this.tempRackGroupID = -1;
        this.tempFacilityID = -1;
        this.tempSensorID = -1;
    }

    checkLinkedItems(item, linkedItems) {
        EditDataManager._checkLinkedItems(item, linkedItems, this.originItems, this.removeItems, this.addItems, this.editItems);
    }

    removeLinkedItem(item, linkedItem) {
        const linkedItems = [...item.linkedItems];

        for (let i = linkedItems.length - 1; i >= 0; i--) {
            const _linkedItem = linkedItems[i];

            if (_linkedItem.id === linkedItem.id) {
                linkedItems.splice(i, 1);
                break;
            }
        }

        EditDataManager._checkLinkedItems(item, linkedItems, this.originItems, this.removeItems, this.addItems, this.editItems);
        return this.isChanged();
    }

    addRackItem(rack, item) {
        rack = this.edit.checkRackGroup(rack);
        item = this.edit.checkItem(item, rack);

        if (item.id < 0) {
            item.id = this.getNewItemID();
            item.status = 1;
        }

        const rackItems = this.removeRackItems[rack.id];

        if (rackItems) {
            for (let i = rackItems.length - 1; i >= 0; i--) {
                const rackItem = rackItems[i];

                if (rackItem === item) {
                    rackItems.splice(i, 1);
                    break;
                }
            }
        }

        let _rackItems = this.addRackItems[rack.id];

        if (!_rackItems) {
            _rackItems = [];
            this.addRackItems[rack.id] = _rackItems;
        }

        _rackItems.push(item);

        this.edit.wsManager.addItem(item.id, item.itemType.id, rack.id, item.uPos);
    }

    updateRackItem(item) {
        item = this.edit.checkItem(item, null);

        if (item === null) {
            return;
        }

        const rack = item.rack;

        if (!rack) {
            return false;
        }

        const itemName = item.name.toLowerCase();

        for (const rackID in this.updateRackItems) {
            const rackItems = this.updateRackItems[rackID];

            for (const rackItem of rackItems) {
                if (rackItem.id === item.id) {
                    continue;
                }

                if (rackItem.name.toLowerCase() === itemName) {
                    return false;
                }
            }
        }

        let rackItems = this.updateRackItems[rack.id];

        if (!rackItems) {
            rackItems = [];
            this.updateRackItems[rack.id] = rackItems;
        }

        rackItems.push(item);
        return true;
    }

    removeRackItem(rack, item) {
        rack = this.edit.checkRackGroup(rack);
        item = this.edit.checkItem(item, rack);

        if (!rack || !item) {
            return;
        }

        let rackItems = this.addRackItems[rack.id];

        if (rackItems) {
            for (let i = rackItems.length - 1; i >= 0; i--) {
                const rackItem = rackItems[i];

                if (rackItem === item) {
                    rackItems.splice(i, 1);
                    break;
                }
            }
        }

        rackItems = this.updateRackItems[rack.id];

        if (rackItems) {
            for (let i = rackItems.length - 1; i >= 0; i--) {
                const rackItem = rackItems[i];

                if (rackItem === item) {
                    rackItems.splice(i, 1);
                    break;
                }
            }
        }

        for (const id in this.addItems) {
            const linkedIDs = this.addItems[id];

            for (let i = linkedIDs.length - 1; i >= 0; i--) {
                const linkedID = linkedIDs[i];

                if (linkedID === item.id) {
                    linkedIDs.splice(i, 1);
                    break;
                }
            }
        }

        delete this.addItems[item.id];

        let _rackItems = this.removeRackItems[rack.id];

        if (!_rackItems) {
            _rackItems = [];
            this.removeRackItems[rack.id] = _rackItems;
        }

        _rackItems.push(item);

        const index = item.rack.items.indexOf(item);

        if (index >= 0) {
            item.rack.items.splice(index, 1);

            for (const linkedItem of item.linkedItems) {
                const index = linkedItem.linkedItems.indexOf(item);

                if (index >= 0) {
                    linkedItem.linkedItems.splice(index, 1);
                }
            }

            item.linkedItems = [];
        }

        this.edit.wsManager.removeItem(item.id);
    }

    moveRack(rack, x, y) {
        rack.x = x;
        rack.y = y;
        this.updateRack(rack);
    }

    rotateRack(rack, rotation) {
        rack.rotation = rotation;
        this.updateRack(rack);
    }

    setRackID(rack) {
        if (rack.id < 0) {
            rack.id = this.getNewRackID();
        }
    }

    addRack(rack) {
        this.addRacks[rack.id] = rack;

        if (rack.rackGroup.racks.includes(rack) === false) {
            rack.rackGroup.racks.push(rack);
        }
    }

    updateRack(rack) {
        this.updateRacks[rack.id] = rack;
    }

    removeRack(rack) {
        /*const rackGroups = { ...this.edit.state.rackGroups };
        rackGroups[this.edit.tempRackGroup.groupName] = this.edit.tempRackGroup;

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];
            let isRemoved = false;

            for (let i = rackGroup.racks.length - 1; i >= 0; i--) {
                const _rack = rackGroup.racks[i];

                if (_rack.id === rack.id) {
                    rackGroup.racks.splice(i, 1);
                    isRemoved = true;
                    break;
                }
            }

            if (isRemoved) {
                break;
            }
        }*/

        if (rack.id > 0) {
            this.removeRacks[rack.id] = rack;
        }

        const strRackID = rack.id.toString();

        for (let i = rack.rackGroup.racks.length - 1; i >= 0; i--) {
            const _rack = rack.rackGroup.racks[i];

            if (_rack.id === rack.id) {
                rack.rackGroup.racks.splice(i, 1);
                break;
            }
        }

        for (const rackID in this.addRacks) {
            if (strRackID === rackID) {
                delete this.addRacks[rackID];
                break;
            }
        }

        for (const rackID in this.updateRacks) {
            if (strRackID === rackID) {
                delete this.updateRacks[rackID];
                break;
            }
        }

        for (const rackID in this.addRackItems) {
            if (strRackID === rackID) {
                delete this.addRackItems[rackID];
                break;
            }
        }

        return this.isChanged();
    }

    setSensorName(sensor) {
        const nameMap = {};
        let sensorCount = 0;

        for (const sensorID in this.edit.sensors) {
            const _sensor = this.edit.sensors[sensorID];

            nameMap[_sensor.name] = _sensor;
            sensorCount++;
        }

        if (!nameMap[sensor.name]) {
            return;
        }

        const index = sensor.name.indexOf('-');

        if (index < 0) {
            return;
        }

        const num = sensor.name.substring(index + 1).trim();
        let no = parseInt(num);

        if (isNaN(no)) {
            return;
        }

        const nameTag = sensor.name.substring(0, index + 1);

        for (let i = 0; i <= sensorCount; i++) {
            const sensorName = no <= 9 ? nameTag + "0" + no.toString() : nameTag + no.toString();

            if (nameMap[sensorName]) {
                no++;
                continue;
            }

            sensor.name = sensorName;
            break;
        }
    }

    setSensorID(sensor) {
        if (sensor.id < 0) {
            sensor.id = this.getNewSensorID();
        }
    }

    addSensor(sensor) {
        this.addSensors[sensor.id] = sensor;
    }

    updateSensor(sensor) {
        this.updateSensors[sensor.id] = sensor;
    }

    removeSensor(sensor) {
        if (sensor.id > 0) {
            this.removeSensors[sensor.id] = sensor;
        }

        for (const sensorID in this.addSensors) {
            if (sensor.id.toString() === sensorID.toString()) {
                delete this.addSensors[sensorID];
                break;
            }
        }

        for (const sensorID in this.updateSensors) {
            if (sensor.id.toString() === sensorID.toString()) {
                delete this.updateSensors[sensorID];
                break;
            }
        }

        return this.isChanged();
    }

    setFacilityID(facility) {
        if (facility.id < 0) {
            facility.id = this.getNewFacilityID();
        }
    }

    addFacility(facility) {
        this.addFacilities[facility.id] = facility;
    }

    updateFacility(facility) {
        this.updateFacilities[facility.id] = facility;
    }

    removeFacility(facility) {
        if (facility.id > 0) {
            this.removeFacilities[facility.id] = facility;
        }

        for (const facilityID in this.addFacilities) {
            if (facility.id.toString() === facilityID.toString()) {
                delete this.addFacilities[facilityID];
                break;
            }
        }

        for (const facilityID in this.updateFacilities) {
            if (facility.id.toString() === facilityID.toString()) {
                delete this.updateFacilities[facilityID];
                break;
            }
        }

        return this.isChanged();
    }

    setRackGroupID(rackGroup, edit) {
        if (rackGroup.id < 0) {
            rackGroup.id = this.getNewRackGroupID();

            if (edit.tempRackGroup && edit.tempRackGroup !== rackGroup) {
                rackGroup.id = this.getNewRackGroupID();
            }
        }
    }

    addRackGroup(rackGroup) {
        this.addRackGroups[rackGroup.groupName] = rackGroup;
    }

    addRackGroup2(rackGroup, racks) {
        for (const rack of racks) {
            if (rack.rackGroup) {
                if (rack.rackGroup === rackGroup) {
                    continue;
                }

                const index = rack.rackGroup.racks.indexOf(rack);

                if (index >= 0) {
                    rack.rackGroup.racks.splice(index, 1);
                }
            }

            rack.rackGroup = rackGroup;
            rackGroup.racks.push(rack);
        }

        this.addRackGroups[rackGroup.groupName] = rackGroup;
    }

    getNewItemID() {
        return this.tempItemID--;
    }

    getNewRackID() {
        return this.tempRackID--;
    }

    getNewRackGroupID() {
        return this.tempRackGroupID--;
    }

    getNewFacilityID() {
        return this.tempFacilityID--;
    }

    getNewSensorID() {
        return this.tempSensorID--;
    }

    isChanged() {
        for (const id in this.removeItems) {
            const items = this.removeItems[id];

            if (items.length > 0) {
                return true;
            }
        }

        for (const id in this.addItems) {
            const items = this.addItems[id];

            if (items.length > 0) {
                return true;
            }
        }

        for (const rackID in this.addRackItems) {
            const rackItems = this.addRackItems[rackID];

            if (rackItems.length > 0) {
                return true;
            }
        }

        for (const rackID in this.removeRackItems) {
            const rackItems = this.removeRackItems[rackID];

            if (rackItems.length > 0) {
                return true;
            }
        }

        for (const rackID in this.updateRackItems) {
            const rackItems = this.updateRackItems[rackID];

            if (rackItems.length > 0) {
                return true;
            }
        }

        for (const rackID in this.updateRacks) {
            return true;
        }

        for (const rackID in this.removeRacks) {
            return true;
        }

        for (const rackID in this.addRacks) {
            return true;
        }

        for (const groupName in this.addRackGroups) {
            return true;
        }

        for (const facilityID in this.updateFacilities) {
            return true;
        }

        for (const facilityID in this.removeFacilities) {
            return true;
        }

        for (const facilityID in this.addFacilities) {
            return true;
        }

        for (const sensorID in this.updateSensors) {
            return true;
        }

        for (const sensorID in this.removeSensors) {
            return true;
        }

        for (const sensorID in this.addSensors) {
            return true;
        }

        return false;
    }

    rollBack() {
        const rackGroups = {};
        const items = {};

        for (const groupName in this.originRackGroups) {
            const rackGroup = this.originRackGroups[groupName];
            const cloneRackGroup = { ...rackGroup };
            rackGroups[groupName] = cloneRackGroup;

            cloneRackGroup.racks = [];

            for (const rack of rackGroup.racks) {
                const cloneRack = { ...rack };
                cloneRackGroup.racks.push(cloneRack);
                cloneRack.items = [];
                cloneRack.rackGroup = cloneRackGroup;

                for (const item of rack.items) {
                    const cloneItem = { ...item };
                    cloneRack.items.push(cloneItem);
                    cloneItem.rack = cloneRack;

                    items[cloneItem.id] = cloneItem;
                    cloneItem.linkedItems = [];
                }
            }
        }

        for (const itemID in items) {
            const item = items[itemID];

            for (const linkedItemID of item.linkedItemIDs) {
                const linkedItem = items[linkedItemID];

                if (linkedItem) {
                    item.linkedItems.push(linkedItem);
                }
            }
        }

        this.edit.setRackGroups(rackGroups, true);
        this.edit.setTempRackGroup(this.originTempRackGroup);
        this.edit.setFacilities(this.originFacilities, true);
        this.edit.sensors = this.edit.setSensors(this.originSensors, true);

        this.addRackItems = {};
        this.removeRackItems = {};
        this.updateRackItems = {};
        this.removeItems = {};
        this.addItems = {};
        this.updateRacks = {};
        this.removeRacks = {};
        this.addRacks = {};
        this.addRackGroups = {};
        this.addFacilities = {};
        this.updateFacilities = {};
        this.removeFacilities = {};
        this.addSensors = {};
        this.updateSensors = {};
        this.removeSensors = {};

        this.originTempRackGroup = Edit.makeTempRackGroup(this.edit.props.dataCenter.id);
        this.editItems = {};
        this.originRacks = {};
        this.originRackGroups = {};
        this.originFacilities = {};
        this.originSensors = {};
        this.originItems = EditDataManager.copyItems(this.edit.state.rackGroups, this.edit.tempRackGroup, this.edit.state.facilities, this.edit.state.sensors, this.editItems, this.originRacks, this.originRackGroups, this.originTempRackGroup, this.originFacilities, this.originSensors);

        this.tempItemID = -1;
        this.tempRackID = -1;
        this.tempRackGroupID = -1;
        this.tempFacilityID = -1;
        this.tempSensorID = -1;

        this.edit.wsManager.cancelEdit();
    }

    async save(dataCenterID) {
        const [result, errorMessage] = await EditController.requestUpdateEditData(dataCenterID, this.addItems, this.removeItems, this.addRackItems, this.updateRackItems, this.removeRackItems, this.updateRacks, this.addRacks, this.removeRacks, this.addRackGroups, this.addFacilities, this.removeFacilities, this.updateFacilities, this.addSensors, this.removeSensors, this.updateSensors);

        if (!result || result.success === false) {
            this.rollBack();
            //alert(errorMessage);
            return [false, errorMessage];
        }

        for (const id in this.editItems) {
            const item = this.editItems[id];
            const linkedItemIDs = [];

            for (const linkedItem of item.linkedItems) {
                linkedItemIDs.push(linkedItem.id);
            }

            item.linkedItemIDs = linkedItemIDs;
        }

        // 아무런 RackGroup에도 속하지 않은 Rack들을 위한 임시 RackGroup
        this.edit.tempRackGroup = Edit.makeTempRackGroup(dataCenterID);
        this.edit.setRackGroups(Main.makeRackNItemDatas(result, this.edit.tempRackGroup), false);
        this.edit.facilities = this.edit.setFacilities(result.facilities, true);
        this.edit.sensors = this.edit.setSensors(result.sensors, true);

        this.editItems = {};
        this.originRacks = {};
        this.originRackGroups = {};
        this.originTempRackGroup = Edit.makeTempRackGroup(this.edit.props.dataCenter.id);
        this.originFacilities = {};
        this.originSensors = {};
        this.originItems = EditDataManager.copyItems(this.edit.state.rackGroups, this.edit.tempRackGroup, result.facilities, result.sensors, this.editItems, this.originRacks, this.originRackGroups, this.originTempRackGroup, this.originFacilities, this.originSensors);

        // 저장후 변경된 다른 데이터 정보를 보내는 대신 saveEdit() 하나만 보낸다.
        this.edit.wsManager.saveEdit();
        //this.sendRackIDs(result.racks);
        //this.sendRackGroupIDs(result.rackGroups);

        this.removeItems = {};
        this.addItems = {};
        this.addRackItems = {};
        this.removeRackItems = {};
        this.updateRackItems = {};
        this.updateRacks = {};
        this.removeRacks = {};
        this.addRacks = {};
        this.addRackGroups = {};
        this.addFacilities = {};
        this.updateFacilities = {};
        this.removeFacilities = {};
        this.addSensors = {};
        this.updateSensors = {};
        this.removeSensors = {};

        this.tempItemID = -1;
        this.tempRackID = -1;
        this.tempRackGroupID = -1;
        this.tempFacilityID = -1;
        this.tempSensorID = -1;
        return [true, ""];
    }

    sendRackGroupIDs(rackGroups) {
        const addRackGroups = { ...this.addRackGroups };

        for (const groupName in addRackGroups) {
            const rackGroup = addRackGroups[groupName];

            if (rackGroup.id > 0) {
                continue;
            }

            for (const _rackGroup of rackGroups) {
                if (_rackGroup.groupName === groupName) {
                    const rackIDs = [];

                    for (const rack of rackGroup.racks) {
                        rackIDs.push(rack.id);
                    }

                    this.edit.wsManager.setRackGroupID(_rackGroup, rackIDs);
                    break;
                }
            }
        }
    }

    sendRackIDs(racks) {
        const addRacks = { ...this.addRacks };
        const updateRacks = [];

        for (const rackID in addRacks) {
            const rack = addRacks[rackID];

            if (rack.id > 0) {
                continue;
            }

            for (const _rack of racks) {
                if (_rack.x === rack.x && _rack.y === rack.y) {
                    updateRacks.push(_rack);
                    break;
                }
            }
        }

        if (updateRacks.length > 0) {
            this.edit.wsManager.setRackIDs(updateRacks);
        }
    }

    static getDoubleString(data) {
        if (data >= 10) {
            return data;
        }

        return "0" + data;
    }

    static copyItems(rackGroups, tempRackGroup, facilities, sensors, editItems, originRacks, originRackGroups, originTempRackGroup, originFacilities, originSensors) {
        const items = {};

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            const cloneRackGroup = { ...rackGroup };
            originRackGroups[groupName] = cloneRackGroup;
            cloneRackGroup.racks = [];

            for (const rack of rackGroup.racks) {
                const cloneRack = { ...rack };
                originRacks[rack.id] = cloneRack;
                cloneRackGroup.racks.push(cloneRack);

                cloneRack.items = [];
                cloneRack.rackGroup = cloneRackGroup;

                for (const item of rack.items) {
                    const cloneItem = { ...item };
                    items[item.id] = cloneItem;
                    editItems[item.id] = item;

                    cloneItem.linkedItems = [];
                    cloneRack.items.push(cloneItem);
                    cloneItem.rack = cloneRack;
                }
            }
        }

        for (const rack of tempRackGroup.racks) {
            const cloneRack = { ...rack };
            cloneRack.rackGroup = originTempRackGroup;
            cloneRack.items = [];

            for (const item of rack.items) {
                const cloneItem = { ...item };
                items[item.id] = cloneItem;
                editItems[item.id] = item;

                cloneItem.linkedItems = [];
                cloneRack.items.push(cloneItem);
                cloneItem.rack = cloneRack;
            }

            originTempRackGroup.racks.push(cloneRack);
        }

        for (const facility of facilities) {
            const cloneFacility = { ...facility };
            originFacilities[facility.id] = cloneFacility;
        }

        for (const sensor of sensors) {
            const cloneSensor = { ...sensor };
            originSensors[sensor.id] = cloneSensor;
        }

        for (const id in items) {
            const item = items[id];

            for (const linkedID of item.linkedItemIDs) {
                const linkedItem = items[linkedID];

                if (linkedItem) {
                    item.linkedItems.push(linkedItem);
                }
            }
        }

        return items;
    }

    static _checkLinkedItems(item, linkedItems, originItems, removeItems, addItems, editItems) {
        const originItem = originItems[item.id];

        /*if (!originItem) {
            return false;
        }*/

        const originCount = !originItem ? 0 : originItem.linkedItems.length;
        const newCount = linkedItems.length;

        const originLinkedItemIDs = {};
        const newLinkedItemIDs = {};

        for (let i = 0; i < originCount; i++) {
            const linkedItem = originItem.linkedItems[i];
            originLinkedItemIDs[linkedItem.id] = linkedItem;
        }

        for (let i = 0; i < newCount; i++) {
            const linkedItem = linkedItems[i];
            newLinkedItemIDs[linkedItem.id] = linkedItem;
        }

        EditDataManager.backToOriginLinkedItems(item, editItems, true);
        EditDataManager.deleteLinkedItems(item, removeItems);
        EditDataManager.deleteLinkedItems(item, addItems);

        let isChanged = false;

        for (let i = originCount-1; i >= 0; i--) {
            const linkedItem = originItem.linkedItems[i];

            if (!newLinkedItemIDs[linkedItem.id]) {
                isChanged = true;

                item.linkedItems.splice(i, 1);
                EditDataManager.removeLinkedItem(linkedItem, item);
                EditDataManager.setRemoveItems(removeItems, addItems, item.id, linkedItem.id);
            }
        }

        for (let i = 0; i < newCount; i++) {
            const linkedItem = linkedItems[i];

            if (!originLinkedItemIDs[linkedItem.id]) {
                isChanged = true;

                EditDataManager.addLinkedItem(item, linkedItem);
                EditDataManager.addLinkedItem(linkedItem, item);
                EditDataManager.setAddItems(addItems, removeItems, item.id, linkedItem.id);

                linkedItem.linkedItems.sort(EditDataManager.compareItem);
            }
        }

        if (isChanged) {
            item.linkedItems.sort(EditDataManager.compareItem);
        }

        return isChanged;
    }

    static backToOriginLinkedItems(item, editItems, recursive) {
        if (recursive) {
            for (const linkedItem of item.linkedItems) {
                EditDataManager.backToOriginLinkedItems(linkedItem, editItems, false);
            }
        }

        const linkedItems = [];

        for (const id of item.linkedItemIDs) {
            const linkedItem = editItems[id];

            if (linkedItem) {
                linkedItems.push(linkedItem);
            }
        }

        item.linkedItems = linkedItems;
    }

    static deleteLinkedItems(item, linkedItems) {
        const items = linkedItems[item.id];

        if (items) {
            for (const linkedItemID of items) {
                const _items = linkedItems[linkedItemID];

                if (_items) {
                    for (let i = _items.length - 1; i >= 0; i--) {
                        const id = _items[i];

                        if (id === item.id) {
                            _items.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            delete linkedItems[item.id];
        }
    }

    static setAddItems(addItems, removeItems, sourceID, targetID) {
        let items = addItems[sourceID];

        if (!items) {
            items = [];
            addItems[sourceID] = items;
        }

        let exist = false;

        for (const id of items) {
            if (id === targetID) {
                exist = true;
                break;
            }
        }

        if (exist === false) {
            items.push(targetID);
        }

        let _items = removeItems[sourceID];

        if (_items) {
            for (let i = _items.length - 1; i >= 0; i--) {
                const id = _items[i];

                if (id === targetID) {
                    _items.splice(i, 1);
                    break;
                }
            }
        }

        _items = removeItems[targetID];

        if (_items) {
            for (let i = _items.length - 1; i >= 0; i--) {
                const id = _items[i];

                if (id === sourceID) {
                    _items.splice(i, 1);
                    break;
                }
            }
        }
    }

    static setRemoveItems(removeItems, addItems, sourceID, targetID) {
        let items = removeItems[sourceID];

        if (!items) {
            items = [];
            removeItems[sourceID] = items;
        }

        let exist = false;

        for (const id of items) {
            if (id === targetID) {
                exist = true;
                break;
            }
        }

        if (exist === false) {
            items.push(targetID);
        }

        let _items = addItems[sourceID];

        if (_items) {
            for (let i = _items.length - 1; i >= 0;i--) {
                const id = _items[i];

                if (id === targetID) {
                    _items.splice(i, 1);
                    break;
                }
            }
        }

        _items = addItems[targetID];

        if (_items) {
            for (let i = _items.length - 1; i >= 0; i--) {
                const id = _items[i];

                if (id === sourceID) {
                    _items.splice(i, 1);
                    break;
                }
            }
        }
    }

    static addLinkedItem(item, target) {
        for (const linkedItem of item.linkedItems) {
            if (linkedItem.id === target.id) {
                return;
            }
        }

        item.linkedItems.push(target);
    }

    static removeLinkedItem(item, target) {
        for (let i = item.linkedItems.length - 1; i >= 0; i--) {
            const linkedItem = item.linkedItems[i];

            if (linkedItem.id === target.id) {
                item.linkedItems.splice(i, 1);
                return;
            }
        }
    }

    static compareItem(item1, item2) {
        if (item1.id < item2.id) {
            return -1;
        }
        else if (item1.id > item2.id) {
            return 1;
        }

        return 0;
    }
}