import Main from "../../Main/ui/main";
import PopupMenu from "../../PropertyEdit/ui/popupMenu";
import ProjectResource from "../resource/id";
import wsProcessManager from "./wsProcessManager";

export default class wsManager {
    constructor(port/*, main*/) {
        this.wsProcessManager = new wsProcessManager(/*main*/);

        // WebSocket이 정상적으로 통신하기 위해선 App의 서버가 먼저 실행중이어야 한다.
        const wsUri = "ws://127.0.0.1:" + port + "/";
        this.webSocket = new WebSocket(wsUri);
        this.connected = false;

        const wsMgr = this;
        this.messageBuffers = [];

        this.webSocket.onopen = (e) => {
            wsMgr.connected = true;
            wsMgr.checkBuffers();
        }

        this.webSocket.onclose = (e) => {
            wsMgr.connected = false;
        }

        this.webSocket.onmessage = (e) => {
            const tokens = e.data.split(',');

            if (tokens.length > 0) {
                const header = parseInt(tokens[0].trim());

                if (header === 0 || header) {

                    const parameters = [];

                    for (let i = 1; i < tokens.length; i++) {
                        parameters.push(tokens[i].trim());
                    }

                    wsMgr.onMessage(header, parameters);
                }
            }
        }

        this.webSocket.onerror = (e) => {
            console.log("webSocket error : " + e.data);
        }

        this.currentViewMode = wsManager.mode3D.none;
    }

    setMain(main) {
        this.wsProcessManager.setMain(main);
    }

    setEdit(edit) {
        this.wsProcessManager.setEdit(edit);
    }

    setNewRegist(newRegist) {
        this.wsProcessManager.setNewRegist(newRegist);
    }

    static webToApp = {
        header: {
            // 모드전환 : wsManager.mode3D
            viewMode: 1,
            // 특정 DataCenter를 로딩한다.
            loadDataCenter: 2,
            // rackList 전달
            responseRackList: 3,
            // itemList 전달
            responseItemList: 4,
            responseRackTypeList: 5,
            responseItemTypeList: 6,
            setLayerState: 7,
            selectRack: 8,
            selectItem: 9,
            requestViewport: 10,
            responseViewport: 11,
            setViewport: 12,
            zoom: 13,
            menuMoveRack: 14,
            menuRotateRack: 15,
            menuRepeatGridRack: 16,
            dragStartRackType: 17,
            dropRackType: 18,
            dragEndRackType: 19,
            setRackID: 20,
            menuMoveRacks: 21,
            setRackGroupID: 22,
            showMinimap: 23,
            cancelEdit: 24,
            saveEdit: 25,
            addItem: 26,
            removeItem: 27,
            moveItem: 28,
            responseDataCenterGrid: 29,
            selectCompareRack: 30,
            menuDeleteRacks: 31,
            dragStartFacilityType: 32,
            dropFacilityType: 33,
            dragEndFacilityType: 34,
            setFacilityID: 35,
            responseFacilityList: 36,
            responseFacilityTypeList: 37,
            menuMoveFacilities: 38,
            menuRotateFacilities: 39,
            menuDeleteFacilities: 40,
            cameraOnOff: 41,
            logout: 42,
            dragStartSensorType: 43,
            dropSensorType: 44,
            dragEndSensorType: 45,
            setSensorID: 46,
            responseSensorList: 47,
            responseSensorTypeList: 48,
            menuMoveSensors: 49,
            menuDeleteSensors: 50,
            responseCompanyList: 51,
            sensorOnOff: 53
        }
    };

    static appToWeb = {
        header: {
            requestRackList: 1,
            requestItemList: 2,
            requestRackTypeList: 3,
            requestItemTypeList: 4,
            requestLayerState: 5,
            setCameraPosition: 6,
            selectRack: 7,
            selectItem: 8,
            responseViewport: 9,
            requestViewport: 10,
            showPopupMenu_SelectRack: 11,
            showPopupMenu_SelectRacks: 12,
            showPopupMenu_CreateRack: 13,
            moveRack: 14,
            rotateRack: 15,
            createGridRacks: 16,
            requestDataCenterGrid: 17,
            deleteRacks: 18,
            hidePopupMenu: 19,
            showPopupMenu_CreateFacility: 20,
            requestFacilityList: 21,
            requestFacilityTypeList: 22,
            showPopupMenu_SelectFacilities: 23,
            moveFacilities: 24,
            rotateFacilities: 25,
            deleteFacilities: 26,
            showPopupMenu_CreateSensor: 27,
            requestSensorList: 28,
            requestSensorTypeList: 29,
            showPopupMenu_SelectSensors: 30,
            moveSensors: 31,
            deleteSensors: 32,
            requestCompanyList: 33,
            cameraOnOff: 34
        }
    };

    static mode3D = {
        fps: 1,
        birdView: 2,
        edit: 3,
        editITProperty: 4,
        newRegist: 5,
        modelCompare: 6,
        none: 7
    }

    static layer = {
        nameTag: 1
        /*rackType_all: -1,
        rackType_server: 0,
        rackType_network: 1,
        rackType_etc: 2*/
    }

    static unitOfLength = {
        mm: 0,
        cm: 1,
        m: 2,
        km: 3
    }

    sendMessage(header, parameter) {
        if (!this.connected) {
            this.messageBuffers.push([header, parameter]);
            return;
        }

        if ((parameter !== 0 && !parameter) || parameter.length === 0) {
            this.webSocket.send(header.toString());
        }
        else {
            this.webSocket.send(header + ", " + parameter);
        }
    }

    onMessage(header, parameter) {
        // IT 자산 편집중일때에는 3D로부터 어떠한 신호도 받지 않는다.
        /*if (this.currentViewMode === wsManager.mode3D.editITProperty) {
            return;
        }*/

        if (header === wsManager.appToWeb.header.requestRackList) {
            this.wsProcessManager.onResponseRackList(parameter, this);
        }
        else if (header === wsManager.appToWeb.header.requestItemList) {
            this.wsProcessManager.onResponseItemList(parameter, this);
        }
        else if (header === wsManager.appToWeb.header.requestRackTypeList) {
            this.wsProcessManager.onResponseRackTypeList(this);
        }
        else if (header === wsManager.appToWeb.header.requestItemTypeList) {
            this.wsProcessManager.onResponseItemTypeList(this);
        }
        else if (header === wsManager.appToWeb.header.requestLayerState) {
            this.wsProcessManager.onResponseLayerState(this);
        }
        else if (header === wsManager.appToWeb.header.setCameraPosition) {
            this.wsProcessManager.setCameraPosition(parameter);
        }
        else if (header === wsManager.appToWeb.header.selectRack) {
            this.wsProcessManager.selectRack(parameter, this);
        }
        else if (header === wsManager.appToWeb.header.selectItem) {
            this.wsProcessManager.selectItem(parameter, this);
        }
        else if (header === wsManager.appToWeb.header.responseViewport) {
            this.wsProcessManager.resonseViewport(parameter);
        }
        else if (header === wsManager.appToWeb.header.requestViewport) {
            this.wsProcessManager.requestViewport(parameter, this);
        }
        else if (header === wsManager.appToWeb.header.showPopupMenu_SelectRack) {
            if (parameter && parameter.length >= 3) {
                this.wsProcessManager.showPopupMenu_SelectRack(parameter[0], parameter[1], parameter[2], this);
            }
        }
        else if (header === wsManager.appToWeb.header.showPopupMenu_SelectRacks) {
            if (parameter && parameter.length >= 3) {
                const rackIDs = [];

                for (let i = 2; i < parameter.length; i++) {
                    rackIDs.push(parameter[i]);
                }

                this.wsProcessManager.showPopupMenu_SelectRacks(parameter[0], parameter[1], rackIDs, this);
            }
        }
        else if (header === wsManager.appToWeb.header.showPopupMenu_CreateRack) {
            if (parameter && parameter.length >= 6) {
                this.wsProcessManager.showPopupMenu_CreateRack(parameter[0], parameter[1], parameter[2], parameter[3], parameter[4], parameter[5], this);
            }
        }
        else if (header === wsManager.appToWeb.header.moveRack) {
            if (parameter && parameter.length >= 3) {
                this.wsProcessManager.moveRack(parameter[0], parameter[1], parameter[2], this);
            }
        }
        else if (header === wsManager.appToWeb.header.rotateRack) {
            if (parameter && parameter.length >= 2) {
                this.wsProcessManager.rotateRack(parameter[0], parameter[1], this);
            }
        }
        else if (header === wsManager.appToWeb.header.deleteRacks) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.deleteRacks(parameter, this);
            }
        }
        else if (header === wsManager.appToWeb.header.createGridRacks) {
            if (parameter && parameter.length >= 4) {
                this.wsProcessManager.createGridRacks(parameter, this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestDataCenterGrid) {
            if (parameter && parameter.length >= 1) {
                this.wsProcessManager.responseDataCenterGrid(parseInt(parameter[0]), this);
            }
        }
        else if (header === wsManager.appToWeb.header.hidePopupMenu) {
            this.wsProcessManager.hidePopupMenu(this);
        }
        else if (header === wsManager.appToWeb.header.showPopupMenu_CreateFacility) {
            if (parameter && parameter.length >= 6) {
                this.wsProcessManager.showPopupMenu_CreateFacility(parameter[0], parameter[1], parameter[2], parameter[3], parameter[4], parameter[5], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestFacilityList) {
            this.wsProcessManager.onResponseFacilityList(parameter, this);
        }
        else if (header === wsManager.appToWeb.header.requestFacilityTypeList) {
            this.wsProcessManager.onResponseFacilityTypeList(this);
        }
        else if (header === wsManager.appToWeb.header.showPopupMenu_SelectFacilities) {
            if (parameter && parameter.length >= 3) {
                const facilityIDs = [];

                for (let i = 2; i < parameter.length; i++) {
                    facilityIDs.push(parameter[i]);
                }

                this.wsProcessManager.showPopupMenu_SelectFacilities(parameter[0], parameter[1], facilityIDs, this);
            }
        }
        else if (header === wsManager.appToWeb.header.moveFacilities) {
            if (parameter && parameter.length >= 3) {
                const facilityIDs = [];
                const len = parameter.length;

                for (let i = 2; i < len; i++) {
                    facilityIDs.push(parameter[i]);
                }

                this.wsProcessManager.moveFacilities(parameter[0], parameter[1], facilityIDs, this);
            }
        }
        else if (header === wsManager.appToWeb.header.rotateFacilities) {
            if (parameter && parameter.length >= 2) {
                const facilityIDs = [];
                const len = parameter.length;

                for (let i = 1; i < len; i++) {
                    facilityIDs.push(parameter[i]);
                }

                this.wsProcessManager.rotateFacilities(parameter[0], facilityIDs, this);
            }
        }
        else if (header === wsManager.appToWeb.header.deleteFacilities) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.removeFacilities(parameter, this);
            }
        }
        else if (header === wsManager.appToWeb.header.showPopupMenu_CreateSensor) {
            if (parameter && parameter.length >= 6) {
                this.wsProcessManager.showPopupMenu_CreateSensor(parameter[0], parameter[1], parameter[2], parameter[3], parameter[4], parameter[5], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestSensorList) {
            this.responseSensorList(parameter);
        }
        else if (header === wsManager.appToWeb.header.requestSensorTypeList) {
            this.wsProcessManager.onResponseSensorTypeList(this);
        }
        else if (header === wsManager.appToWeb.header.showPopupMenu_SelectSensors) {
            if (parameter && parameter.length >= 3) {
                const sensorIDs = [];

                for (let i = 2; i < parameter.length; i++) {
                    sensorIDs.push(parameter[i]);
                }

                this.wsProcessManager.showPopupMenu_SelectSensors(parameter[0], parameter[1], sensorIDs, this);
            }
        }
        else if (header === wsManager.appToWeb.header.moveSensors) {
            if (parameter && parameter.length >= 3) {
                const sensorIDs = [];
                const len = parameter.length;

                for (let i = 2; i < len; i++) {
                    sensorIDs.push(parameter[i]);
                }

                this.wsProcessManager.moveSensors(parameter[0], parameter[1], sensorIDs, this);
            }
        }
        else if (header === wsManager.appToWeb.header.deleteSensors) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.removeSensors(parameter, this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestCompanyList) {
            wsProcessManager.responseCompanyList(this);
        }
        else if (header === wsManager.appToWeb.header.cameraOnOff) {
            if (parameter.length > 0) {
                const on = parseInt(parameter[0]);

                if (isNaN(on) === false) {
                    this.wsProcessManager.responseCameraOnOff(on === 1, this);
                }
            }
        }
    }

    responseSensorList(dataCenterID) {
        this.wsProcessManager.onResponseSensorList(dataCenterID, this);
    }

    toCentimeter(len, unit) {
        if (unit === wsManager.unitOfLength.mm) {
            return len / 10;
        }
        else if (unit === wsManager.unitOfLength.m) {
            return len * 100;
        }

        return len;
    }

    responseDataCenterGrid(dataCenter) {
        const datas = [dataCenter.id, dataCenter.beginGridX, dataCenter.beginGridY, this.toCentimeter(dataCenter.width, dataCenter.unitOfLength), this.toCentimeter(dataCenter.length, dataCenter.unitOfLength), this.toCentimeter(dataCenter.height, dataCenter.unitOfLength), this.toCentimeter(dataCenter.tileElevation, dataCenter.unitOfLength)];
        this.sendMessage(wsManager.webToApp.header.responseDataCenterGrid, wsManager.arrayToParameter(datas));
    }

    checkBuffers() {
        for (const message of this.messageBuffers) {
            this.sendMessage(message[0], message[1]);
        }

        this.messageBuffers = [];
    }

    changeMode(mode, parameter1, parameter2) {
        const user = ProjectResource.getUserInfo();

        if (parameter1 || parameter1 === 0) {
            if (parameter2 || parameter2 === 0) {
                this.sendMessage(wsManager.webToApp.header.viewMode, wsManager.arrayToParameter([mode, user?.levelID, parameter1, parameter2]));
            }
            else {
                this.sendMessage(wsManager.webToApp.header.viewMode, wsManager.arrayToParameter([mode, user?.levelID, parameter1]));
            }
        }
        else {
            this.sendMessage(wsManager.webToApp.header.viewMode, [mode, user?.levelID]);
        }

        this.currentViewMode = mode;
    }

    cameraOnOff(on) {
        this.sendMessage(wsManager.webToApp.header.cameraOnOff, on);
    }

    sensorOnOff(on) {
        this.sendMessage(wsManager.webToApp.header.sensorOnOff, on);
    }

    loadDataCenter(centerID) {
        this.sendMessage(wsManager.webToApp.header.loadDataCenter, centerID);
    }

    setLayerState(layerStates) {
        const datas = [];

        for (const layer in layerStates) {
            const onOff = layerStates[layer] ? 1 : 0;
            datas.push(layer);
            datas.push(onOff);
        }

        this.sendMessage(wsManager.webToApp.header.setLayerState, wsManager.arrayToParameter(datas));
    }

    selectRack(rackID) {
        this.sendMessage(wsManager.webToApp.header.selectRack, rackID);
    }

    selectItem(itemID) {
        this.sendMessage(wsManager.webToApp.header.selectItem, itemID);
    }

    requestViewport(dataCenterID) {
        this.sendMessage(wsManager.webToApp.header.requestViewport, dataCenterID);
    }

    zoomIn() {
        this.sendMessage(wsManager.webToApp.header.zoom, 1);
    }

    zoomOut() {
        this.sendMessage(wsManager.webToApp.header.zoom, 0);
    }

    moveSensors(sensorIDs) {
        this.sendMessage(wsManager.webToApp.header.menuMoveSensors, wsManager.arrayToParameter(sensorIDs));
    }

    deleteSensors(sensorIDs) {
        this.sendMessage(wsManager.webToApp.header.menuDeleteSensors, wsManager.arrayToParameter(sensorIDs));
    }

    moveFacilities(facilityIDs) {
        this.sendMessage(wsManager.webToApp.header.menuMoveFacilities, wsManager.arrayToParameter(facilityIDs));
    }

    rotateFacilities(facilityIDs) {
        this.sendMessage(wsManager.webToApp.header.menuRotateFacilities, wsManager.arrayToParameter(facilityIDs));
    }

    deleteFacilities(facilityIDs) {
        this.sendMessage(wsManager.webToApp.header.menuDeleteFacilities, wsManager.arrayToParameter(facilityIDs));
    }

    moveRacks(rackIDs) {
        this.sendMessage(wsManager.webToApp.header.menuMoveRacks, wsManager.arrayToParameter(rackIDs));
    }

    moveRack(rackID) {
        this.sendMessage(wsManager.webToApp.header.menuMoveRack, rackID);
    }

    rotateRack(rackIDs) {
        if (Array.isArray(rackIDs)) {
            this.sendMessage(wsManager.webToApp.header.menuRotateRack, wsManager.arrayToParameter(rackIDs));
        }
        else {
            this.sendMessage(wsManager.webToApp.header.menuRotateRack, rackIDs);
        }
    }

    deleteRack(rackIDs) {
        if (Array.isArray(rackIDs)) {
            this.sendMessage(wsManager.webToApp.header.menuDeleteRacks, wsManager.arrayToParameter(rackIDs));
        }
        else {
            this.sendMessage(wsManager.webToApp.header.menuDeleteRacks, rackIDs);
        }
    }

    repeatGridRack(rackID) {
        this.sendMessage(wsManager.webToApp.header.menuRepeatGridRack, rackID);
    }

    selectCompareRack(rackID1, rackID2) {
        this.sendMessage(wsManager.webToApp.header.selectCompareRack, [rackID1, rackID2]);
    }

    sendCompanyList(companies) {
        const datas = [];

        for (const company of companies) {
            datas.push(company.id);
            datas.push(company.name);
        }

        this.sendMessage(wsManager.webToApp.header.responseCompanyList, wsManager.arrayToParameter(datas));
    }

    onMenuAction(action, parameter, edit) {
        if (action === PopupMenu.action.moveRack) {
            if (parameter && parameter.length > 0) {
                this.moveRack(parameter[0]);
            }
        }
        else if (action === PopupMenu.action.rotateRack) {
            if (parameter && parameter.length > 0) {
                this.rotateRack(parameter);
            }
        }
        else if (action === PopupMenu.action.deleteRacks) {
            if (parameter && parameter.length > 0) {
                this.deleteRack(parameter);
            }
        }
        else if (action === PopupMenu.action.repeatGridRack) {
            if (parameter && parameter.length > 0) {
                this.repeatGridRack(parameter[0]);
            }
        }
        else if (action === PopupMenu.action.editITProperty) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.showITPropertyFromRack(parameter[0], edit);
            }
        }
        else if (action === PopupMenu.action.setRackName || action === PopupMenu.action.setRackNameCheck) {
            if (parameter && parameter.length >= 2) {
                const rackID = parameter[0];
                const rackName = parameter[1];
                const update = action === PopupMenu.action.setRackName;

                edit.setRackName(rackID, rackName, update);

                // Rack 이름 Check만 할때는 화면을 갱신하지 않는다.
                return action === PopupMenu.action.setRackName;
            }
        }
        else if (action === PopupMenu.action.moveRacks) {
            if (parameter && parameter.length > 0) {
                this.moveRacks(parameter);
            }
        }
        else if (action === PopupMenu.action.makeRackGroup) {
            if (parameter && parameter.length >= 2) {
                const rackIDs = [];
                const rackGroupName = parameter[0];

                for (let i = 1; i < parameter.length; i++) {
                    rackIDs.push(parameter[i]);
                }

                return this.wsProcessManager.makeRackGroup(rackGroupName, rackIDs, this, edit);
            }
        }
        else if (action === PopupMenu.action.mount) {
            if (parameter.length >= 4) {
                this.wsProcessManager.addNewItem(parameter[0], parameter[1], parameter[2], parameter[3], edit);
            }
        }
        else if (action === PopupMenu.action.unmount) {
            if (parameter && parameter.length >= 5) {
                const x = parameter[0];
                const y = parameter[1];
                const item = parameter[2];
                edit.setState({ popupMenu: PopupMenu.menu.moveNunmount, popupMenuParameter: [x, y, item], selected: { rackGroup: parameter[4], rack: parameter[3], item: parameter[2] } });
                return false;
            }
        }
        else if (action === PopupMenu.action.moveRackItem) {
            if (parameter) {
                edit.setMovingRackItem(parameter);
            }
        }
        else if (action === PopupMenu.action.updateRackItem) {
            if (parameter) {
                return edit.editDataManager.updateRackItem(parameter);
            }
        }
        else if (action === PopupMenu.action.moveFacilities) {
            if (parameter && parameter.length > 0) {
                this.moveFacilities(parameter);
            }
        }
        else if (action === PopupMenu.action.rotateFacilities) {
            if (parameter && parameter.length > 0) {
                this.rotateFacilities(parameter);
            }
        }
        else if (action === PopupMenu.action.deleteFacilities) {
            if (parameter && parameter.length > 0) {
                this.deleteFacilities(parameter);
            }
        }
        else if (action === PopupMenu.action.moveSensors) {
            if (parameter && parameter.length > 0) {
                this.moveSensors(parameter);
            }
        }
        else if (action === PopupMenu.action.deleteSensors) {
            if (parameter && parameter.length > 0) {
                this.deleteSensors(parameter);
            }
        }
        else if (action === PopupMenu.action.setSensorName) {
            if (parameter && parameter.length > 1) {
                edit.setSensorName(parameter[0], parameter[1]);
            }
        }

        return true;
    }

    dragStartSensorType(sensorType) {
        this.sendMessage(wsManager.webToApp.header.dragStartSensorType, sensorType.id);
    }

    dropSensorType(sensorType) {
        this.sendMessage(wsManager.webToApp.header.dropSensorType, sensorType.id);
    }

    dragEndSensorType() {
        this.sendMessage(wsManager.webToApp.header.dragEndSensorType);
    }

    dragStartFacilityType(facilityType) {
        this.sendMessage(wsManager.webToApp.header.dragStartFacilityType, facilityType.id);
    }

    dropFacilityType(facilityType) {
        this.sendMessage(wsManager.webToApp.header.dropFacilityType, facilityType.id);
    }

    dragEndFacilityType() {
        this.sendMessage(wsManager.webToApp.header.dragEndFacilityType);
    }

    dragStartRackType(rackType) {
        this.sendMessage(wsManager.webToApp.header.dragStartRackType, rackType.id);
    }

    dropRackType(rackType) {
        this.sendMessage(wsManager.webToApp.header.dropRackType, rackType.id);
    }

    dragEndRackType() {
        this.sendMessage(wsManager.webToApp.header.dragEndRackType);
    }

    setSensorID(sensorID, x, y, sensorName) {
        this.sendMessage(wsManager.webToApp.header.setSensorID, wsManager.arrayToParameter([sensorID, x, y, sensorName]));
    }

    setSensorIDs(sensors) {
        const datas = [];

        for (const sensor of sensors) {
            datas.push(sensor.id);
            datas.push(sensor.x);
            datas.push(sensor.y);
            datas.push(sensor.name);
        }

        this.sendMessage(wsManager.webToApp.header.setSensorID, wsManager.arrayToParameter(datas));
    }

    setFacilityID(facilityID, x, y) {
        this.sendMessage(wsManager.webToApp.header.setFacilityID, wsManager.arrayToParameter([facilityID, x, y]));
    }

    setFacilityIDs(facilities) {
        const datas = [];

        for (const facility of facilities) {
            datas.push(facility.id);
            datas.push(facility.x);
            datas.push(facility.y);
        }

        this.sendMessage(wsManager.webToApp.header.setFacilityID, wsManager.arrayToParameter(datas));
    }

    setRackID(rackID, x, y, rackName) {
        this.sendMessage(wsManager.webToApp.header.setRackID, wsManager.arrayToParameter([rackID, x, y, rackName]));
    }

    setRackIDs(racks) {
        const datas = [];

        for (const rack of racks) {
            datas.push(rack.id);
            datas.push(rack.x);
            datas.push(rack.y);
            datas.push(rack.name);
        }

        this.sendMessage(wsManager.webToApp.header.setRackID, wsManager.arrayToParameter(datas));
    }

    setRackGroupID(rackGroup, rackIDs) {
        const datas = [rackGroup.id];

        for (const rackID of rackIDs) {
            datas.push(rackID);
        }

        this.sendMessage(wsManager.webToApp.header.setRackGroupID, wsManager.arrayToParameter(datas));
    }

    showMinimap(visible) {
        const data = visible ? 1 : 0;
        this.sendMessage(wsManager.webToApp.header.showMinimap, data);
    }

    cancelEdit() {
        this.sendMessage(wsManager.webToApp.header.cancelEdit);
    }

    saveEdit(parameter) {
        if (parameter) {
            this.sendMessage(wsManager.webToApp.header.saveEdit);
        }
        else {
            this.sendMessage(wsManager.webToApp.header.saveEdit, parameter);
        }
    }

    addItem(itemID, itemTypeID, rackID, uPos) {
        this.sendMessage(wsManager.webToApp.header.addItem, wsManager.arrayToParameter(itemID, itemTypeID, rackID, uPos));
    }

    removeItem(itemID) {
        this.sendMessage(wsManager.webToApp.header.removeItem, wsManager.arrayToParameter(itemID));
    }

    moveItem(itemID, uPos) {
        this.sendMessage(wsManager.webToApp.header.moveItem, wsManager.arrayToParameter(itemID, uPos));
    }

    logout() {
        this.sendMessage(wsManager.webToApp.header.logout);
    }

    static arrayToParameter(arr) {
        let parameter = "";
        const len = arr.length;

        for (let i = 0; i < len; i++) {
            const data = arr[i] === null || arr[i] === undefined ? "" : arr[i];

            if (i === 0) {
                parameter = data;
            }
            else {
                parameter += "," + data;
            }
        }

        return parameter;
    }

    isMainMode() {
        if (this.currentViewMode === wsManager.mode3D.fps ||
            this.currentViewMode === wsManager.mode3D.birdView) {
            return true;
        }

        return false;
    }

    isEditMode() {
        if (this.currentViewMode === wsManager.mode3D.edit) {
            return true;
        }

        return false;
    }
}