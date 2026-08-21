import MainController from "../../Main/services/mainController";
import Main from "../../Main/ui/main";
import EditController from "../../PropertyEdit/services/editController";
import Edit from "../../PropertyEdit/ui/edit";
import PopupMenu from "../../PropertyEdit/ui/popupMenu";
import wsManager from "./wsManager";
import ProjectResource from "../resource/id";
import ManagementController from "../../Management/services/managementController";

export default class wsProcessManager {
    setMain(main) {
        this.main = main;
    }

    setEdit(edit) {
        this.edit = edit;
    }

    setNewRegist(newRegist) {
        this.newRegist = newRegist;
    }

    async onResponseRackList(dataCenterID, wsMgr) {
        dataCenterID = parseInt(dataCenterID);

        if (isNaN(dataCenterID)) {
            return;
        }

        /*if (this.main.props.dataCenter.id === dataCenterID) {
            const rackGroups = { ...this.main.state.rackGroups };

            if (this.getObjectItemCount(rackGroups) > 0) {
                const racks = this.getRackList(rackGroups);
                this.responseRackList(racks, wsMgr);
                return;
            }
        }*/

        const [result, /*errorMessage*/] = await MainController.requestRackNItems(dataCenterID);

        if (result) {
            // 아무런 RackGroup에도 속하지 않은 Rack들을 위한 임시 RackGroup
            const tempRackGroup = Edit.makeTempRackGroup(dataCenterID);
            const rackGroups = Main.makeRackNItemDatas(result, tempRackGroup);
            rackGroups[tempRackGroup.groupName] = tempRackGroup;

            const racks = this.getRackList(rackGroups);
            this.responseRackList(racks, wsMgr);
        }
    }

    async onResponseItemList(dataCenterID, wsMgr) {
        dataCenterID = parseInt(dataCenterID);

        if (isNaN(dataCenterID)) {
            return;
        }

        /*if (this.main.props.dataCenter.id === dataCenterID) {
            const rackGroups = { ...this.main.state.rackGroups };

            if (this.getObjectItemCount(rackGroups) > 0) {
                const rackItems = this.getRackItemList(rackGroups);
                this.responseItemList(rackItems, wsMgr);
                return;
            }
        }*/

        const [result, /*errorMessage*/] = await MainController.requestRackNItems(dataCenterID);

        if (result) {
            // 아무런 RackGroup에도 속하지 않은 Rack들을 위한 임시 RackGroup
            const tempRackGroup = Edit.makeTempRackGroup(dataCenterID);
            const rackGroups = Main.makeRackNItemDatas(result, tempRackGroup);
            rackGroups[tempRackGroup.groupName] = tempRackGroup;

            if (this.getObjectItemCount(rackGroups) > 0) {
                const rackItems = this.getRackItemList(rackGroups);
                this.responseItemList(rackItems, wsMgr);
            }
        }
    }

    async onResponseRackTypeList(wsMgr) {
        const [rackTypes, /*errorMessage*/] = await MainController.requestRackTypeList();

        if (rackTypes) {
            this.responseRackTypeList(rackTypes, wsMgr);
        }
    }

    async onResponseItemTypeList(wsMgr) {
        const [itemTypes, /*errorMessage*/] = await MainController.requestItemTypeList();

        if (itemTypes) {
            this.responseItemTypeList(itemTypes, wsMgr);
        }
    }

    async onResponseFacilityTypeList(wsMgr) {
        const [facilityTypes, /*errorMessage*/] = await MainController.requestFacilityTypeList();

        if (facilityTypes) {
            this.responseFacilityTypeList(facilityTypes, wsMgr);
        }
    }

    async onResponseSensorTypeList(wsMgr) {
        const [sensorTypes, /*errorMessage*/] = await MainController.requestSensorTypeList();

        if (sensorTypes) {
            this.responseSensorTypeList(sensorTypes, wsMgr);
        }
    }

    async responseRackTypeList(rackTypes, wsMgr) {
        const datas = [];

        for (const rackType of rackTypes) {
            datas.push(rackType.id);
            datas.push(rackType.companyID);
            datas.push(ProjectResource.getCompanyName(rackType.company));
            datas.push(rackType.modelName);
            datas.push(rackType.fbxUrl);
        }

        wsMgr.sendMessage(wsManager.webToApp.header.responseRackTypeList, wsManager.arrayToParameter(datas));
    }

    async onResponseFacilityList(dataCenterID, wsMgr) {
        dataCenterID = parseInt(dataCenterID);

        if (isNaN(dataCenterID)) {
            return;
        }

        const [result, /*errorMessage*/] = await MainController.requestRackNItems(dataCenterID);

        if (result) {
            this.responseFacilityList(result.facilities, wsMgr);
        }
    }

    async onResponseSensorList(dataCenterID, wsMgr) {
        dataCenterID = parseInt(dataCenterID);

        if (isNaN(dataCenterID)) {
            return;
        }

        const [result, /*errorMessage*/] = await MainController.requestRackNItems(dataCenterID);

        if (result) {
            this.responseSensorList(result.sensors, dataCenterID, wsMgr);
        }
    }

    async setCameraPosition(parameter) {
        //const params = wsProcessManager.stringToArray(parameter);

        if (parameter.length >= 3) {
            const x = parseFloat(parameter[0].trim());
            const y = parseFloat(parameter[1].trim());
            const rotation = parseFloat(parameter[2].trim());

            if ((x === 0 || x) && (y === 0 || y) && (rotation === 0 || rotation)) {
                // 1인칭 시점에서의 카메라 위치 및 각도를 알려준다.
                this.main.setCameraPosition(x, y, rotation);
            }
        }
    }

    async selectRack(rackID, wsMgr) {
        rackID = parseInt(rackID);

        if (isNaN(rackID)) {
            return;
        }

        if (wsMgr.isMainMode()) {
            this.main.onSelectID(rackID, Main.Rack);
        }
        else if (wsMgr.isEditMode()) {
            this.edit.onSelectID(rackID, Main.Rack);
        }
    }

    async selectItem(itemID, wsMgr) {
        itemID = parseInt(itemID);

        if (isNaN(itemID)) {
            return;
        }

        if (wsMgr.isMainMode()) {
            this.main.onSelectID(itemID, Main.RackItem);
        }
    }

    async resonseViewport(parameter) {
        //const params = wsProcessManager.stringToArray(parameter);

        if (parameter.length >= 7) {
            const dataCenterID = parseInt(parameter[0].trim());
            const posX = parseFloat(parameter[1].trim());
            const posY = parseFloat(parameter[2].trim());
            const posZ = parseFloat(parameter[3].trim());
            const rotationX = parseFloat(parameter[4].trim());
            const rotationY = parseFloat(parameter[5].trim());
            const rotationZ = parseFloat(parameter[6].trim());

            if ((dataCenterID === 0 || dataCenterID) && (posX === 0 || posX) &&
                (posY === 0 || posY) && (posZ === 0 || posZ) &&
                (rotationX === 0 || rotationX) && (rotationY === 0 || rotationY) &&
                (rotationZ === 0 || rotationZ)) {
                MainController.requestSaveViewport(dataCenterID, posX, posY, posZ, rotationX, rotationY, rotationZ);
            }
        }
    }

    async requestViewport(dataCenterID, wsMgr) {
        dataCenterID = parseInt(dataCenterID);

        if (isNaN(dataCenterID)) {
            return;
        }

        const [result, /*errorMessage*/] = await MainController.requestViewport(dataCenterID);

        if (result) {
            const datas = [];
            datas.push(result.dataCenterID);
            datas.push(result.positionX);
            datas.push(result.positionY);
            datas.push(result.positionZ);
            datas.push(result.rotationX);
            datas.push(result.rotationY);
            datas.push(result.rotationZ);

            wsMgr.sendMessage(wsManager.webToApp.header.responseViewport, wsManager.arrayToParameter(datas));
        }
    }

    responseItemTypeList(itemTypes, wsMgr) {
        const datas = [];

        for (const itemType of itemTypes) {
            datas.push(itemType.id);
            datas.push(itemType.type);
            datas.push(itemType.companyID);
            datas.push(ProjectResource.getCompanyName(itemType.company));
            datas.push(itemType.modelName);
            datas.push(itemType.fbxUrl);
            /*datas.push(itemType.shelf ? 1 : 0);*/
        }

        wsMgr.sendMessage(wsManager.webToApp.header.responseItemTypeList, wsManager.arrayToParameter(datas));
    }

    responseFacilityTypeList(facilityTypes, wsMgr) {
        const datas = [];

        for (const facilityType of facilityTypes) {
            datas.push(facilityType.id);
            datas.push(facilityType.companyID);
            datas.push(ProjectResource.getCompanyName(facilityType.company));
            datas.push(facilityType.modelName);
            datas.push(ProjectResource.getEquipmentTypeName(facilityType.equipmentType));
            datas.push(facilityType.fbxUrl);
        }

        wsMgr.sendMessage(wsManager.webToApp.header.responseFacilityTypeList, wsManager.arrayToParameter(datas));
    }

    responseSensorTypeList(sensorTypes, wsMgr) {
        const datas = [];

        for (const sensorType of sensorTypes) {
            datas.push(sensorType.id);
            datas.push(ProjectResource.getSensorTypeName(sensorType));
            datas.push(sensorType.imageUrl);
            datas.push(sensorType.abnormalImageUrl);
        }

        wsMgr.sendMessage(wsManager.webToApp.header.responseSensorTypeList, wsManager.arrayToParameter(datas));
    }

    responseRackList(racks, wsMgr) {
        wsMgr.sendMessage(wsManager.webToApp.header.responseRackList, wsManager.arrayToParameter(racks));
    }

    responseItemList(items, wsMgr) {
        wsMgr.sendMessage(wsManager.webToApp.header.responseItemList, wsManager.arrayToParameter(items));
    }

    responseFacilityList(facilities, wsMgr) {
        const datas = [];

        for (const facility of facilities) {
            datas.push(facility.id);
            datas.push(facility.facilityTypeID);
            datas.push(facility.rotation);
            datas.push(facility.x);
            datas.push(facility.y);
            datas.push(facility.z);
        }

        wsMgr.sendMessage(wsManager.webToApp.header.responseFacilityList, wsManager.arrayToParameter(datas));
    }

    responseSensorList(sensors, dataCenterID, wsMgr) {
        const datas = [];
        let isAlarm = false;

        for (const sensor of sensors) {
            datas.push(sensor.id);
            datas.push(sensor.sensorTypeID);
            datas.push(sensor.x);
            datas.push(sensor.y);
            datas.push(sensor.z);
            datas.push(sensor.name);
            datas.push(sensor.currentData);
            datas.push(sensor.status);

            if (this.isAlarmStatus(sensor.status)) {
                isAlarm = true;
            }
        }

        wsMgr.sendMessage(wsManager.webToApp.header.responseSensorList, wsManager.arrayToParameter(datas));

        if (this.main) {
            this.main.updateFMSTime(dataCenterID, isAlarm);
        }
    }

    isAlarmStatus(sensorStatus) {
        if (sensorStatus === "비정상" ||
            sensorStatus === "감지" ||
            sensorStatus === "OFF") {
            return true;
        }

        return false;
    }

    onResponseLayerState(wsMgr) {
        wsMgr.setLayerState(this.main.state.layerState);
    }

    getRackList(rackGroups) {
        const racks = [];

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            for (const rack of rackGroup.racks) {
                racks.push(rack.id);
                racks.push(rack.rackTypeID);
                racks.push(rack.rotation);
                racks.push(rack.x);
                racks.push(rack.y);
                racks.push(rack.z);
                racks.push(rack.name);
            }
        }

        return racks;
    }

    getRackItemList(rackGroups) {
        const rackItems = [];

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            for (const rack of rackGroup.racks) {
                for (const item of rack.items) {
                    rackItems.push(item.id);
                    rackItems.push(item.itemTypeID);
                    rackItems.push(rack.id);
                    rackItems.push(item.uPos);

                    if (item.positionInShelf === null || item.positionInShelf === undefined) {
                        rackItems.push(-1);
                    }
                    else {
                        rackItems.push(item.positionInShelf);
                    }
                }
            }
        }

        return rackItems;
    }

    getObjectItemCount(obj) {
        let itemCount = 0;

        for (const key in obj) {
            itemCount++;
        }

        return itemCount;
    }

    showPopupMenu_SelectRack(mouseX, mouseY, rackID, wsMgr) {
        mouseX = parseInt(mouseX);
        mouseY = parseInt(mouseY);
        rackID = parseInt(rackID);

        if (isNaN(mouseX) || isNaN(mouseY) || isNaN(rackID)) {
            return;
        }

        const user = ProjectResource.getUserInfo();

        if (!user || user.levelID >= 3) {
            return;
        }

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.showPopupMenu(PopupMenu.menu.selectRack, [mouseX, mouseY, rackID]);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.showPopupMenu(PopupMenu.menu.selectRack, [mouseX, mouseY, rackID]);
        }
    }

    showPopupMenu_SelectRacks(mouseX, mouseY, rackIDs, wsMgr) {
        mouseX = parseInt(mouseX);
        mouseY = parseInt(mouseY);

        if (isNaN(mouseX) || isNaN(mouseY)) {
            return;
        }

        const user = ProjectResource.getUserInfo();

        if (!user || user.levelID >= 3) {
            return;
        }

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.showPopupMenu(PopupMenu.menu.selectRacks, [mouseX, mouseY, rackIDs]);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.showPopupMenu(PopupMenu.menu.selectRacks, [mouseX, mouseY, rackIDs]);
        }
    }

    showPopupMenu_SelectFacilities(mouseX, mouseY, facilityIDs, wsMgr) {
        mouseX = parseInt(mouseX);
        mouseY = parseInt(mouseY);

        if (isNaN(mouseX) || isNaN(mouseY)) {
            return;
        }

        const user = ProjectResource.getUserInfo();

        if (!user || user.levelID >= 3) {
            return;
        }

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.showPopupMenu(PopupMenu.menu.selectFacilities, [mouseX, mouseY, facilityIDs]);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.showPopupMenu(PopupMenu.menu.selectFacilities, [mouseX, mouseY, facilityIDs]);
        }
    }

    showPopupMenu_SelectSensors(mouseX, mouseY, sensorIDs, wsMgr) {
        mouseX = parseInt(mouseX);
        mouseY = parseInt(mouseY);

        if (isNaN(mouseX) || isNaN(mouseY)) {
            return;
        }

        const user = ProjectResource.getUserInfo();

        if (!user || user.levelID >= 3) {
            return;
        }

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.showPopupMenu(PopupMenu.menu.selectSensors, [mouseX, mouseY, sensorIDs]);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.showPopupMenu(PopupMenu.menu.selectSensors, [mouseX, mouseY, sensorIDs]);
        }
    }

    showITPropertyFromRack(rackID, edit) {
        rackID = parseInt(rackID);

        if (isNaN(rackID)) {
            return;
        }

        if (rackID && edit) {
            const rack = edit.racks[rackID];

            if (rack && rack.rackGroup) {
                // 아이템 선택없이 IT자산 편집창을 띄우기 위하여 가상의 Item을 생성한다.
                const item = {
                    rack: rack,
                    linkedItems: []
                };

                edit.onSelect(item, Main.RackItem);
            }
        }
    }

    async showPopupMenu_CreateRack(dataCenterID, rackTypeID, x, y, mouseX, mouseY, wsMgr) {
        dataCenterID = parseInt(dataCenterID);
        rackTypeID = parseInt(rackTypeID);
        x = parseInt(x);
        y = parseInt(y);
        mouseX = parseInt(mouseX);
        mouseY = parseInt(mouseY);

        if (isNaN(dataCenterID) || isNaN(rackTypeID) || isNaN(x) ||
            isNaN(y) || isNaN(mouseX) || isNaN(mouseY)) {
            return;
        }

        let edit = null;

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            edit = this.edit;
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            edit = this.newRegist;
        }

        if (edit) {
            let rackType = null;
            const rackTypes = [...edit.state.rackTypes];

            for (const _rackType of rackTypes) {
                if (_rackType.id === rackTypeID) {
                    rackType = _rackType;
                    break;
                }
            }

            if (!rackType) {
                return;
            }

            const [newRack, errorMessage] = await EditController.requestNewRack(dataCenterID, rackTypeID, x, y);

            if (!newRack) {
                //alert(errorMessage);
                return errorMessage;
            }

            //wsManager.setRackID(newRack.id, x, y);
            newRack.rackType = rackType;
            newRack.items = [];

            edit.onNewRack(newRack, mouseX, mouseY);
        }
    }

    async showPopupMenu_CreateFacility(dataCenterID, facilityTypeID, x, y, mouseX, mouseY, wsMgr) {
        dataCenterID = parseInt(dataCenterID);
        facilityTypeID = parseInt(facilityTypeID);
        x = parseInt(x);
        y = parseInt(y);
        mouseX = parseInt(mouseX);
        mouseY = parseInt(mouseY);

        if (isNaN(dataCenterID) || isNaN(facilityTypeID) || isNaN(x) ||
            isNaN(y) || isNaN(mouseX) || isNaN(mouseY)) {
            return;
        }

        let edit = null;

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            edit = this.edit;
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            edit = this.newRegist;
        }

        if (edit) {
            let facilityType = null;
            const facilityTypes = [...edit.state.facilityTypes];

            for (const _facilityType of facilityTypes) {
                if (_facilityType.id === facilityTypeID) {
                    facilityType = _facilityType;
                    break;
                }
            }

            if (!facilityType) {
                return;
            }

            const [newFacility, errorMessage] = await EditController.requestNewFacility(dataCenterID, facilityTypeID, x, y);

            if (!newFacility) {
                return errorMessage;
            }

            newFacility.facilityType = facilityType;

            edit.onNewFacility(newFacility, mouseX, mouseY);
        }
    }

    async showPopupMenu_CreateSensor(dataCenterID, sensorTypeID, x, y, mouseX, mouseY, wsMgr) {
        dataCenterID = parseInt(dataCenterID);
        sensorTypeID = parseInt(sensorTypeID);
        x = parseInt(x);
        y = parseInt(y);
        mouseX = parseInt(mouseX);
        mouseY = parseInt(mouseY);

        if (isNaN(dataCenterID) || isNaN(sensorTypeID) || isNaN(x) ||
            isNaN(y) || isNaN(mouseX) || isNaN(mouseY)) {
            return;
        }

        let edit = null;

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            edit = this.edit;
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            edit = this.newRegist;
        }

        if (edit) {
            let sensorType = null;
            const sensorTypes = [...edit.state.sensorTypes];

            for (const _sensorType of sensorTypes) {
                if (_sensorType.id === sensorTypeID) {
                    sensorType = _sensorType;
                    break;
                }
            }

            if (!sensorType) {
                return;
            }

            const [newSensor, errorMessage] = await EditController.requestNewSensor(dataCenterID, sensorTypeID, x, y);

            if (!newSensor) {
                return errorMessage;
            }

            newSensor.sensorType = sensorType;

            edit.onNewSensor(newSensor, mouseX, mouseY);
        }
    }

    async responseDataCenterGrid(dataCenterID, wsMgr) {
        const [dataCenter, ] = await ManagementController.requestGetDataCenter(dataCenterID);

        if (dataCenter) {
            wsMgr.responseDataCenterGrid(dataCenter);
        }
    }

    static checkMakeRackGroup(rackIDs, edit) {
        for (const rackID of rackIDs) {
            const rack = edit.racks[rackID];

            if (rack && rack.rackGroup && rack.rackGroup !== edit.tempRackGroup) {
                return false;
            }
        }

        return true;
    }

    static checkRackGroupName(rackGroupName, edit) {
        for (const groupName in edit.props.rackGroups) {
            if (groupName === rackGroupName) {
                //alert(ProjectResource.getErrorMessage_SameRackGroupName());
                return false;
            }
        }

        return true;
    }

    moveSensors(gridX, gridY, sensorIDs, wsMgr) {
        if ((gridX !== 0 && !gridX) || (gridY !== 0 && !gridY)) {
            return;
        }

        gridX = parseInt(gridX);
        gridY = parseInt(gridY);

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.onMoveSensors(gridX, gridY, sensorIDs);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.onMoveSensors(gridX, gridY, sensorIDs);
        }
    }

    removeSensors(sensorIDs, wsMgr) {
        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.onRemoveSensors(sensorIDs);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.onRemoveSensors(sensorIDs);
        }
    }

    moveFacilities(gridX, gridY, facilityIDs, wsMgr) {
        if ((gridX !== 0 && !gridX) || (gridY !== 0 && !gridY)){
            return;
        }

        gridX = parseInt(gridX);
        gridY = parseInt(gridY);

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.onMoveFacilities(gridX, gridY, facilityIDs);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.onMoveFacilities(gridX, gridY, facilityIDs);
        }
    }

    rotateFacilities(rotation, facilityIDs, wsMgr) {
        if (rotation !== 0 && !rotation) {
            return;
        }

        rotation = parseFloat(rotation);

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.onRotateFacilities(rotation, facilityIDs);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.onRotateFacilities(rotation, facilityIDs);
        }
    }

    removeFacilities(facilityIDs, wsMgr) {
        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.onRemoveFacilities(facilityIDs);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.onRemoveFacilities(facilityIDs);
        }
    }

    makeRackGroup(rackGroupName, rackIDs, wsManager, edit) {
        if (!wsProcessManager.checkMakeRackGroup(rackIDs, edit)) {
            return false;
        }

        if (!wsProcessManager.checkRackGroupName(rackGroupName, edit)) {
            return false;
        }

        const rackGroup = edit.addRackGroup(rackGroupName);

        for (const rackID of rackIDs) {
            const rack = edit.racks[rackID];

            if (rack) {
                rackGroup.racks.push(rack);

                if (rack.rackGroup) {
                    const index = rack.rackGroup.racks.indexOf(rack);

                    if (index >= 0) {
                        rack.rackGroup.racks.splice(index, 1);
                        rack.rackGroup = rackGroup;
                        edit.editDataManager.updateRack(rack);
                    }
                }
            }
        }

        edit.setState({ isChanged: true });
        wsManager.setRackGroupID(rackGroup, rackIDs);
        return true;
    }

    moveRack(gridX, gridY, rackID, wsMgr) {
        gridX = parseInt(gridX);
        gridY = parseInt(gridY);
        rackID = parseInt(rackID);

        if (isNaN(gridX) || isNaN(gridY) || isNaN(rackID)) {
            return;
        }

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            if (this.edit?.editDataManager) {
                const rack = this.edit.racks[rackID];
                this.edit.editDataManager.moveRack(rack, gridX, gridY);
                this.edit.setState({ isChanged: true });
            }
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            if (this.newRegist?.editDataManager) {
                const rack = this.newRegist.racks[rackID];
                this.newRegist.editDataManager.moveRack(rack, gridX, gridY);
                this.newRegist.setState({ isChanged: true });
            }
        }
    }

    rotateRack(rotation, rackID, wsMgr) {
        rotation = parseFloat(rotation);
        rackID = parseInt(rackID);

        if (isNaN(rotation) || isNaN(rackID)) {
            return;
        }

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            if (this.edit?.editDataManager) {
                const rack = this.edit.racks[rackID];
                this.edit.editDataManager.rotateRack(rack, rotation);
                this.edit.setState({ isChanged: true });
            }
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            if (this.newRegist?.editDataManager) {
                const rack = this.newRegist.racks[rackID];
                this.newRegist.editDataManager.rotateRack(rack, rotation);
                this.newRegist.setState({ isChanged: true });
            }
        }
    }

    deleteRacks(rackIDs, wsMgr) {
        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.onRemoveRacks(rackIDs);
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.onRemoveRacks(rackIDs);
        }
    }

    hidePopupMenu(wsMgr) {
        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            this.edit.hidePopupMenu();
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            this.newRegist.hidePopupMenu();
        }
    }

    async addNewItem(itemType, uPos, rack, dataCenterID, edit) {
        const [newItem, errorMessage] = await EditController.requestNewItem(itemType.id, uPos, dataCenterID, rack.id);

        if (!newItem) {
            this.showConfirmDialog("에러", [errorMessage], ["확인"], () => {});
            return;
        }

        newItem.itemType = itemType;
        newItem.rack = rack;
        newItem.linkedItems = [];
        edit.onNewItem(rack, newItem);
    }

    async createGridRacks(parameter, wsMgr) {
        let edit = null;

        if (wsMgr.currentViewMode === wsManager.mode3D.edit && this.edit) {
            edit = this.edit;
        }
        else if (wsMgr.currentViewMode === wsManager.mode3D.newRegist && this.newRegist) {
            edit = this.newRegist;
        }

        if (edit) {
            const parameterCount = parameter.length;
            const rackCount = parseInt(parameterCount / 4);

            if (rackCount === 0) {
                return;
            }

            const dataCenterID = parseInt(parameter[0]);
            const rackID = parseInt(parameter[1]);

            const rackSource = edit.racks[rackID];

            if (!rackSource) {
                return;
            }

            const [newRacks, ] = await EditController.requestNewRacks(dataCenterID, rackSource.rackTypeID, rackSource.rotation, rackCount);

            if (!newRacks || newRacks.length !== rackCount) {
                return;
            }

            newRacks.sort((rack1, rack2) => {
                if (rack1.name < rack2.name) {
                    return -1;
                }
                else if (rack1.name > rack2.name) {
                    return 1;
                }

                return 0;
            });

            const coords = [];

            for (let i = 0; i < parameterCount - 3; i += 4) {
                const x = parseInt(parameter[i + 2]);
                const y = parseInt(parameter[i + 3]);

                coords.push([x, y]);
            }

            coords.sort((coord1, coord2) => {
                if (coord1[0] < coord2[0]) {
                    return -1;
                }
                else if (coord1[0] > coord2[0]) {
                    return 1;
                }

                if (coord1[1] < coord2[1]) {
                    return -1;
                }
                else if (coord1[1] > coord2[1]) {
                    return 1;
                }

                return 0;
            });

            const coordCount = coords.length;

            for (let i = 0; i < coordCount;i++) {
                const coord = coords[i];
                const rack = newRacks[i];

                if (rack) {
                    rack.rackType = rackSource.rackType;
                    rack.items = [];
                    rack.x = coord[0];
                    rack.y = coord[1];
                }
            }

            edit.onNewRacks(newRacks);
        }
    }

    responseCameraOnOff(on, wsMgr) {
        if (wsMgr.isMainMode() && this.main) {
            this.main.setCameraOnOff(on);
        }
        else if (wsMgr.isEditMode() && this.edit) {
            this.edit.setCameraOnOff(on);
        }
    }

    static async responseCompanyList(wsMgr) {
        const [companies, ] = await MainController.requestCompanyList();
        wsMgr.sendCompanyList(companies);
    }

    static stringToArray(params) {
        if (!params) {
            return [];
        }

        return params.split(',');
    }
}