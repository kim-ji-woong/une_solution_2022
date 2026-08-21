import SdmsResource from "../../SDMS/resource/id";
import { SdmsController } from "../../SDMS/services/sdmsController";
import SDMSMainMenu from "../../SDMS/ui/sdmsMainMenu";
import wsProcessManager from "./wsProcessManager";

export default class wsManager {
    constructor(port) {
        this.wsProcessManager = new wsProcessManager();

        // WebSocket이 정상적으로 통신하기 위해선 App의 서버가 먼저 실행중이어야 한다.
        const wsUri = "ws://127.0.0.1:" + port + "/";
        this.webSocket = new WebSocket(wsUri);
        this.connected = false;
        this.monitoring = null;

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
    }

    static webToApp = {
        header: {
            moveToZone: 1,
            moveToOutdoor: 2,
            setLayerState: 3,
            responseLayerState: 4,
            responseAllLayerState: 5,
            responseZoneSensors: 6,
            responseEquipZoneNames: 7,
            responseZoneCCTVs: 8,
            selectSensor: 9,
            showAlarm: 10,
            responseZoneList: 11,
            zoom: 12,
            requestCurrentViewport: 13,
            moveCamera: 14,
            autoRotation: 15,
            viewMode: 16,
            selectBuilding: 17,
            selectFacility: 18,
            updateZoneSensors: 19,
            responseCurrentAlarms: 20,
            closeAlarm: 21,
            initThermalCCTVs: 22,
            responseMesEquipmentData: 23,
            sendFacilityAlarm: 24,
            sendAutoRotationOption: 25,
            setAlarmLayers: 26,
            closePopup: 27
        }
    };

    static appToWeb = {
        header: {
            requestLayerState: 1,
            requestAllLayerState: 2,
            requestZoneSensors: 3,
            requestEquipZoneNames: 4,
            requestZoneCCTVs: 5,
            selectSensor: 6,
            requestZoneList: 7,
            responseCurrentViewport: 8,
            selectBuilding: 9,
            selectFacility: 10,
            moveToFacilityView: 11,
            requestCurrentAlarms: 12,
            requestMesEquipmentData: 13
        }
    };

    static layer = {
        fire: 1,
        smell: 2,
        gas: 3,
        emergency: 4,
        thermalCamera: 5,
        cctv: 6,
        text: 7,
        worker: 8
    };

    static sensorType = {
        fire: 1,
        smell: 2,
        gas: 3,
        emergency: 4,
        thermalCamera: 5,
        cctv: 6,
        worker: 8,
        equipment: 9
    };

    static mode = {
        etc: 0,
        monitoring: 1,
        facility: 2
    };

    static alarmType = {
        safetyMode: 1,
        facilityMode: 2
    };

    static facilityAlarmType = {
        stuckWorker: 1,
        productFail: 2
    };

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

    checkBuffers() {
        for (const message of this.messageBuffers) {
            this.sendMessage(message[0], message[1]);
        }

        this.messageBuffers = [];
    }

    setMonitoring(monitoring) {
        this.monitoring = monitoring;
    }

    onMessage(header, parameter) {
        if (header === wsManager.appToWeb.header.requestLayerState) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.responseLayerState(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestAllLayerState) {
            this.wsProcessManager.responseAllLayerState(this);
        }
        else if (header === wsManager.appToWeb.header.requestZoneSensors) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.responseZoneSensors(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestEquipZoneNames) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.responseEquipZoneNames(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestZoneCCTVs) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.responseZoneCCTVs(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.selectSensor) {
            if (parameter && parameter.length > 2) {
                this.wsProcessManager.selectSensor(parameter[0], parameter[1], parameter[2], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestZoneList) {
            this.wsProcessManager.responseZoneList(this);
        }
        else if (header === wsManager.appToWeb.header.responseCurrentViewport) {
            if (parameter && parameter.length > 6) {
                this.wsProcessManager.setCurrentViewport(parameter[0], parameter[1], parameter[2], parameter[3], parameter[4], parameter[5], parameter[6], this);
            }
        }
        else if (header === wsManager.appToWeb.header.selectBuilding) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.selectBuilding(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.selectFacility) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.selectFacility(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.moveToFacilityView) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.moveToFacilityView(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestCurrentAlarms) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.responseCurrentAlarms(parameter[0], this);
            }
        }
        else if (header === wsManager.appToWeb.header.requestMesEquipmentData) {
            if (parameter && parameter.length > 0) {
                this.wsProcessManager.responseMesEquipmentData(parameter, this);
            }
        }
    }

    moveToZone(zoneID, cameraLocation, cameraRotation) {
        this.sendMessage(wsManager.webToApp.header.moveToZone, wsManager.arrayToParameter([zoneID, cameraLocation.x, cameraLocation.y, cameraLocation.z, cameraRotation.x, cameraRotation.y, cameraRotation.z]));
    }

    moveToOutdoor(campusID, cameraLocation, cameraRotation) {
        this.sendMessage(wsManager.webToApp.header.moveToOutdoor, wsManager.arrayToParameter([campusID, cameraLocation.x, cameraLocation.y, cameraLocation.z, cameraRotation.x, cameraRotation.y, cameraRotation.z]));
    }

    setLayerState(layerType, onOff) {
        this.sendMessage(wsManager.webToApp.header.setLayerState, wsManager.arrayToParameter([layerType, onOff]));
    }

    responseLayerState(layerType, onOff) {
        this.sendMessage(wsManager.webToApp.header.responseLayerState, wsManager.arrayToParameter([layerType, onOff]));
    }

    responseAllLayerState(layerStates) {
        this.sendMessage(wsManager.webToApp.header.responseAllLayerState, wsManager.arrayToParameter(layerStates));
    }

    responseZoneSensors(zoneDataList) {
        this.sendMessage(wsManager.webToApp.header.responseZoneSensors, wsManager.arrayToParameter(zoneDataList));
    }

    responseEquipZoneNames(equipZoneDataList) {
        this.sendMessage(wsManager.webToApp.header.responseEquipZoneNames, wsManager.arrayToParameter(equipZoneDataList));
    }

    responseZoneCCTVs(cctvDataList) {
        this.sendMessage(wsManager.webToApp.header.responseZoneCCTVs, wsManager.arrayToParameter(cctvDataList));
    }

    selectSensor(zoneID, sensorID, sensorType) {
        this.sendMessage(wsManager.webToApp.header.selectSensor, wsManager.arrayToParameter([zoneID, sensorID, sensorType]));
    }

    async showAlarm(alarm) {
        const [zoneData, errorMessage] = await SdmsController.requestZoneData(alarm.zoneID);

        if (zoneData === null) {
            console.log(errorMessage);
            return;
        }

        const params = [];

        params.push(alarm.zoneID);
        params.push(zoneData.cameraPositionX);
        params.push(zoneData.cameraPositionY);
        params.push(zoneData.cameraPositionZ);
        params.push(zoneData.cameraRotationX);
        params.push(zoneData.cameraRotationY);
        params.push(zoneData.cameraRotationZ);
        params.push(null);
        params.push(null);
        params.push(null);
        params.push(null);

        const sensorType = wsManager.facilityTypeNameToSensorType(alarm.facilityTypeName);

        if (sensorType !== null) {
            if (alarm.facilityType !== alarm.materialType) {
                const [sensor, message] = await SdmsController.requestRealSensorData(alarm.facilityType, alarm.materialType, alarm.orgSensorID, alarm.zoneID);

                if (sensor === null) {
                    console.log(message);
                    params.push(alarm.orgSensorID);
                }
                else {
                    params.push(sensor.id);
                }
            }
            else {
                params.push(alarm.orgSensorID);
            }

            params.push(sensorType);
        }
        else {
            return;
        }

        this.sendMessage(wsManager.webToApp.header.showAlarm, wsManager.arrayToParameter(params));
    }

    static facilityTypeNameToSensorType(facilityTypeName) {
        if (facilityTypeName.startsWith("화재")) {
            return wsManager.sensorType.fire;
        }
        else if (facilityTypeName.startsWith("작업자") ||
            facilityTypeName === "배터리 교체") {
            return wsManager.sensorType.worker;
        }
        else if (facilityTypeName.startsWith("비상벨")) {
            return wsManager.sensorType.emergency;
        }
        else if (facilityTypeName.startsWith("열화상")) {
            return wsManager.sensorType.thermalCamera;
        }
        else if (facilityTypeName === "OU" ||
            facilityTypeName === "VOC" ||
            facilityTypeName.startsWith("미세먼지") ||
            facilityTypeName.startsWith("휘발성")) {
            return wsManager.sensorType.smell;
        }
        else if (facilityTypeName === "H2S" ||
            facilityTypeName === "CO" ||
            facilityTypeName === "O2" ||
            facilityTypeName === "CH4" ||
            facilityTypeName === "CO2") {
            return wsManager.sensorType.gas;
        }
        else if (facilityTypeName === "사출설비") {
            return wsManager.sensorType.equipment;
        }

        return null;
    }

    zoom(zoomIn) {
        if (zoomIn) {
            this.sendMessage(wsManager.webToApp.header.zoom, 1);
        }
        else {
            this.sendMessage(wsManager.webToApp.header.zoom, -1);
        }
    }

    requestCurrentViewport() {
        this.sendMessage(wsManager.webToApp.header.requestCurrentViewport);
    }

    moveCamera(cameraLocation, cameraRotation) {
        this.sendMessage(wsManager.webToApp.header.moveCamera, wsManager.arrayToParameter([cameraLocation.x, cameraLocation.y, cameraLocation.z, cameraRotation.x, cameraRotation.y, cameraRotation.z]));
    }

    autoRotation(start) {
        if (start) {
            this.sendMessage(wsManager.webToApp.header.autoRotation, 1);
        }
        else {
            this.sendMessage(wsManager.webToApp.header.autoRotation, 0);
        }
    }

    responseZoneList(zones) {
        const parameters = [];

        for (const zone of zones) {
            parameters.push(zone.id);
            parameters.push(zone.zoneName);
            parameters.push(zone.zoneData.objectID);
        }

        this.sendMessage(wsManager.webToApp.header.responseZoneList, wsManager.arrayToParameter(parameters));
    }

    setViewMode(mainMode, subMode) {
        this.sendMessage(wsManager.webToApp.header.viewMode, wsManager.arrayToParameter([mainMode, subMode]));
    }

    updateZoneSensors(zoneID, sensors) {
        const params = this.wsProcessManager.updateZoneSensors(zoneID, sensors, this);
        this.sendMessage(wsManager.webToApp.header.updateZoneSensors, wsManager.arrayToParameter(params));
    }

    selectBuilding(buildingID) {
        this.sendMessage(wsManager.webToApp.header.selectBuilding, buildingID);
    }

    selectFacility(facilityID) {
        this.sendMessage(wsManager.webToApp.header.selectFacility, facilityID);
    }

    responseCurrentAlarms(alarmInfo) {
        this.sendMessage(wsManager.webToApp.header.responseCurrentAlarms, wsManager.arrayToParameter(alarmInfo));
    }

    async closeAlarm(alarm) {
        if (this.monitoring) {
            const sensorType = wsManager.facilityTypeNameToSensorType(alarm.facilityTypeName);

            if (sensorType !== null) {
                let sensorID = alarm.orgSensorID;

                if (alarm.facilityType !== alarm.materialType) {
                    const [sensor, message] = await SdmsController.requestRealSensorData(alarm.facilityType, alarm.materialType, alarm.orgSensorID, alarm.zoneID);

                    if (sensor) {
                        sensorID = sensor.id;
                    }
                }

                const buildingID = this.monitoring.getBuildingIDFromZoneID(alarm.zoneID);
                this.sendMessage(wsManager.webToApp.header.closeAlarm, wsManager.arrayToParameter([alarm.zoneID, buildingID, sensorID, sensorType]));
            }
        }
    }

    initThermalCCTVs() {
        this.sendMessage(wsManager.webToApp.header.initThermalCCTVs);
    }

    responseMesEquipmentData(equipmentDatas) {
        this.sendMessage(wsManager.webToApp.header.responseMesEquipmentData, wsManager.arrayToParameter(equipmentDatas));
    }

    sendFacilityAlarm(facilityNo, facilityAlarmType, isAlarm) {
        const alarm = isAlarm ? 1 : 0;
        this.sendMessage(wsManager.webToApp.header.sendFacilityAlarm, wsManager.arrayToParameter([facilityNo, alarm, facilityAlarmType]));
    }

    sendAutoRotationOption(useAutoRotation, waitMinutes) {
        this.sendMessage(wsManager.webToApp.header.sendAutoRotationOption, wsManager.arrayToParameter([useAutoRotation ? 1 : 0, waitMinutes]));
    }

    sendAlarmLayers(receiveFire, receiveAtmosphere, receiveGas, receiveEmergencyBell, receiveThermalCamera, receiveWorker, receiveEquipment) {
        const datas = [];

        datas.push(wsManager.sensorType.fire);
        datas.push(receiveFire ? 1 : 0);

        datas.push(wsManager.sensorType.smell);
        datas.push(receiveAtmosphere ? 1 : 0);

        datas.push(wsManager.sensorType.gas);
        datas.push(receiveGas ? 1 : 0);

        datas.push(wsManager.sensorType.emergency);
        datas.push(receiveEmergencyBell ? 1 : 0);

        datas.push(wsManager.sensorType.thermalCamera);
        datas.push(receiveThermalCamera ? 1 : 0);

        datas.push(wsManager.sensorType.worker);
        datas.push(receiveWorker ? 1 : 0);

        datas.push(wsManager.sensorType.equipment);
        datas.push(receiveEquipment ? 1 : 0);

        this.sendMessage(wsManager.webToApp.header.setAlarmLayers, wsManager.arrayToParameter(datas));
    }

    closePopup() {
        this.sendMessage(wsManager.webToApp.header.closePopup);
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


    static layerTypeNameToID(typeName) {
        if (typeName === SDMSMainMenu.Fire_Sensor) {
            return wsManager.layer.fire;
        }
        else if (typeName === SDMSMainMenu.Stink_Sensor) {
            return wsManager.layer.smell;
        }
        else if (typeName === SDMSMainMenu.Gas_Sensor) {
            return wsManager.layer.gas;
        }
        else if (typeName === SDMSMainMenu.EmergencyBell_Sensor) {
            return wsManager.layer.emergency;
        }
        else if (typeName === SDMSMainMenu.ThermalImagingCamera_Sensor) {
            return wsManager.layer.thermalCamera;
        }
        else if (typeName === SDMSMainMenu.CCTV_Sensor) {
            return wsManager.layer.cctv;
        }
        else if (typeName === SDMSMainMenu.ZoneName_Sensor) {
            return wsManager.layer.text;
        }
        else if (typeName === SDMSMainMenu.Worker_Sensor) {
            return wsManager.layer.worker;
        }

        return null;
    }

    static layerTypeFacilityTypeToID(facilityType) {
        if (facilityType === SdmsResource.facilityType.FIRE) {
            return wsManager.layer.fire;
        }
        else if (facilityType === SdmsResource.facilityType.ATMOSPHERE) {
            return wsManager.layer.smell;
        }
        else if (facilityType === SdmsResource.facilityType.GAS) {
            return wsManager.layer.gas;
        }
        else if (facilityType === SdmsResource.facilityType.EMERGENCYBELL) {
            return wsManager.layer.emergency;
        }
        else if (facilityType === SdmsResource.facilityType.WORKER) {
            return wsManager.layer.worker;
        }
        else if (facilityType === SdmsResource.facilityType.THERMAL_CAMERA) {
            return wsManager.layer.thermalCamera;
        }

        return null;
    }

    static makeCoord(x, y, z) {
        return {
            x,
            y,
            z
        };
    }
}