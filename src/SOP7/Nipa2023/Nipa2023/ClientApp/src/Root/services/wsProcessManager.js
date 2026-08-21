import { SdmsController } from "../../SDMS/services/sdmsController";
import SDMSMainMenu from "../../SDMS/ui/sdmsMainMenu";
import ProjectResource from "../resource/id";
import wsManager from "./wsManager";

export default class wsProcessManager {
    responseLayerState(layerType, wsMgr) {
        if (wsMgr.monitoring) {
            let sensorType = null;

            if (layerType === wsManager.layer.fire) {
                sensorType = SDMSMainMenu.Fire_Sensor;
            }
            else if (layerType === wsManager.layer.smell) {
                sensorType = SDMSMainMenu.Stink_Sensor;
            }
            else if (layerType === wsManager.layer.gas) {
                sensorType = SDMSMainMenu.Gas_Sensor;
            }
            else if (layerType === wsManager.layer.emergency) {
                sensorType = SDMSMainMenu.EmergencyBell_Sensor;
            }
            else if (layerType === wsManager.layer.thermalCamera) {
                sensorType = SDMSMainMenu.ThermalImagingCamera_Sensor;
            }
            else if (layerType === wsManager.layer.cctv) {
                sensorType = SDMSMainMenu.CCTV_Sensor;
            }
            else if (layerType === wsManager.layer.text) {
                sensorType = SDMSMainMenu.ZoneName_Sensor;
            }
            else {
                return;
            }

            wsMgr.responseLayerState(layerType, wsMgr.getVisibleSensorType(sensorType) ? 1 : 0);
        }
    }

    responseAllLayerState(wsMgr) {
        const layerStates = [];

        this.setLayerState(wsMgr, wsManager.layer.fire, SDMSMainMenu.Fire_Sensor, layerStates);
        this.setLayerState(wsMgr, wsManager.layer.smell, SDMSMainMenu.Stink_Sensor, layerStates);
        this.setLayerState(wsMgr, wsManager.layer.gas, SDMSMainMenu.Gas_Sensor, layerStates);
        this.setLayerState(wsMgr, wsManager.layer.emergency, SDMSMainMenu.EmergencyBell_Sensor, layerStates);
        this.setLayerState(wsMgr, wsManager.layer.thermalCamera, SDMSMainMenu.ThermalImagingCamera_Sensor, layerStates);
        this.setLayerState(wsMgr, wsManager.layer.cctv, SDMSMainMenu.CCTV_Sensor, layerStates);
        this.setLayerState(wsMgr, wsManager.layer.text, SDMSMainMenu.ZoneName_Sensor, layerStates);
        this.setLayerState(wsMgr, wsManager.layer.worker, SDMSMainMenu.Worker_Sensor, layerStates);

        wsMgr.responseAllLayerState(layerStates);
    }

    setLayerState(wsMgr, layerType1, layerType2, layerStates) {
        layerStates.push(layerType1);

        if (wsMgr.monitoring) {
            if (wsMgr.monitoring.getVisibleSensorType(layerType2))
                layerStates.push(1);
            else
                layerStates.push(0);
        }
    }

    responseZoneSensors(zoneID, wsMgr) {
        if (wsMgr.monitoring) {
            if (wsMgr.monitoring.state.loading) {
                setTimeout(() => this.responseZoneSensors(zoneID, wsMgr), 100);
            }
            else {
                const alarmSensorZoneIDs = this.getAlarmSensors(wsMgr);
                const sensors = this.getZoneSensors(zoneID, wsMgr.monitoring.state.buildingGroupList, wsMgr.monitoring.state.outdoorZones);

                if (sensors) {
                    const params = [zoneID];
                    const alarms = wsMgr.monitoring.getAlarmList(-1);
                    const facilityAlarmSensorIDs = this.getAlarmSensorIDs(alarms);

                    for (const sensorType in sensors) {
                        const sensorList = sensors[sensorType];

                        for (const sensor of sensorList) {
                            const sensorTypeID = this.getSensorType(sensorType, sensor);

                            if (sensorTypeID !== null) {
                                sensor.sensorTypeID = sensorTypeID;

                                params.push(sensor.id);
                                params.push(sensor.name);
                                params.push(sensorTypeID);
                                params.push(sensor.x);
                                params.push(sensor.y);
                                params.push(sensor.z);
                                params.push(sensor.enabled ? 1 : 0);

                                let isAlarmStatus = 0;
                                const alarmSensorIDs = facilityAlarmSensorIDs[sensor.facilityType];

                                if (alarmSensorIDs && sensor.multiSensor?.isMultiSensor) {
                                    for (const sensorID of sensor.multiSensor.idList) {
                                        if (alarmSensorIDs[sensorID] !== undefined) {
                                            isAlarmStatus = 1;
                                            break;
                                        }
                                    }
                                }

                                /*if (alarmSensorIDs[sensor.id] !== undefined) {
                                    isAlarmStatus = 1;
                                }*/
                                if (sensor.sensorZoneID !== null && sensor.sensorZoneID !== undefined) {
                                    if (alarmSensorZoneIDs[sensor.sensorZoneID] !== undefined) {
                                        isAlarmStatus = 1;
                                    }
                                }

                                params.push(isAlarmStatus);
                            }
                        }
                    }

                    wsMgr.responseZoneSensors(params);
                }
            }
        }
    }

    getAlarmSensorIDs(alarms) {
        const facilitySensorIDs = {};

        if (alarms) {
            for (const alarm of alarms) {
                if (alarm.isAlarm) {
                    let sensorIDs = facilitySensorIDs[alarm.facilityType];

                    if (!sensorIDs) {
                        sensorIDs = {};
                        facilitySensorIDs[alarm.facilityType] = sensorIDs;
                    }

                    sensorIDs[alarm.orgSensorID] = alarm.orgSensorID;
                }
            }
        }

        return facilitySensorIDs;
    }

    updateZoneSensors(zoneID, sensorList, wsMgr) {
        const params = [zoneID];
        let sensors = null;

        for (const sensor of sensorList) {
            if (sensor.sensorTypeID === null || sensor.sensorTypeID === undefined) {
                if (sensors === null) {
                    sensors = this.getZoneSensors(zoneID, wsMgr.monitoring.state.buildingGroupList, wsMgr.monitoring.state.outdoorZones);
                    sensor.sensorTypeID = this.getSensorTypeID(sensor, sensors);
                }
            }

            if (sensor.sensorTypeID !== null && sensor.sensorTypeID !== undefined) {
                params.push(sensor.id);
                params.push(sensor.name);
                params.push(sensor.sensorTypeID);
                params.push(sensor.x);
                params.push(sensor.y);
                params.push(sensor.z);
                params.push(sensor.enabled ? 1 : 0);
            }
        }

        return params;
    }

    getSensorTypeID(sensor, sensors) {
        if (sensors) {
            for (const sensorType in sensors) {
                const sensorList = sensors[sensorType];

                for (const _sensor of sensorList) {
                    if (_sensor.facilityType === sensor.facilityType && _sensor.id === sensor.id) {
                        const sensorTypeID = this.getSensorType(sensorType, sensor);
                        return sensorTypeID;
                    }
                }
            }
        }

        return null;
    }

    getSensorType(sensorTypeName, sensor) {
        if (sensorTypeName.startsWith("atmosphere")) {
            return wsManager.layer.smell;
        }
        else if (sensorTypeName.startsWith("emergency")) {
            return wsManager.layer.emergency;
        }
        else if (sensorTypeName.startsWith("thermal")) {
            return wsManager.layer.thermalCamera;
        }
        else if (sensorTypeName.startsWith("gas")) {
            return wsManager.layer.gas;
        }
        else if (sensorTypeName.startsWith("fire")) {
            return wsManager.layer.fire;
        }
        else if (sensorTypeName.startsWith("aps")) {
            return wsManager.layer.worker;
        }
        else if (sensorTypeName.startsWith("cctv")) {
            return wsManager.layer.cctv;
        }

        return null;
    }

    getZoneSensors(zoneID, buildingGroupList, outdoorZones) {
        zoneID = parseInt(zoneID);

        if (isNaN(zoneID)) {
            return null;
        }

        const sensors = {};

        if (zoneID < 0) {
            for (const zoneData of outdoorZones) {
                if (zoneData.sensors) {
                    for (const sensorType in zoneData.sensors) {
                        let sensorList = sensors[sensorType];

                        if (!sensorList) {
                            sensorList = [];
                            sensors[sensorType] = sensorList;
                        }

                        const _sensors = zoneData.sensors[sensorType];

                        for (const sensor of _sensors) {
                            sensorList.push(sensor);
                        }
                    }
                    //return zoneData.sensors;
                }
            }

            return sensors;
        }

        for (const buildingGroup of buildingGroupList) {
            for (const buildingData of buildingGroup.buildingDatas) {
                for (const zoneData of buildingData.zoneDatas) {
                    if (zoneData.id === zoneID) {
                        return zoneData.sensors;
                    }
                }
            }
        }

        return null;
    }

    responseEquipZoneNames(zoneID, wsMgr) {
        if (wsMgr.monitoring) {
            if (wsMgr.monitoring.state.loading) {
                setTimeout(() => this.responseEquipZoneNames(zoneID, wsMgr), 100);
            }
            else {
                const equipZoneDatas = this.getEquipmentZoneDatas(zoneID, wsMgr.monitoring.state.buildingGroupList, wsMgr.monitoring.state.outdoorZones);

                if (equipZoneDatas) {
                    const params = [zoneID];

                    for (const equipZoneData of equipZoneDatas) {
                        params.push(equipZoneData.id);
                        params.push(equipZoneData.displayText);

                        const [x, y, z] = this.getXYZ(equipZoneData.textCenter);

                        params.push(x);
                        params.push(y);
                        params.push(z);
                    }

                    wsMgr.responseEquipZoneNames(params);
                }
            }
        }
    }

    getXYZ(coordString) {
        if (coordString) {
            const tokens = coordString.split(',');

            if (tokens.length >= 3) {
                const x = parseFloat(tokens[0].trim());
                const y = parseFloat(tokens[1].trim());
                const z = parseFloat(tokens[2].trim());

                if (isNaN(x) === false && isNaN(y) === false && isNaN(z) === false) {
                    return [x, y, z];
                }
            }
        }

        return [null, null, null];
    }

    getEquipmentZoneDatas(zoneID, buildingGroupList, outdoorZones) {
        zoneID = parseInt(zoneID);

        if (isNaN(zoneID)) {
            return null;
        }

        if (zoneID < 0) {
            for (const zoneData of outdoorZones) {
                if (zoneData.equipmentZoneDatas) {
                    return zoneData.equipmentZoneDatas;
                }
            }

            return null;
        }

        for (const buildingGroup of buildingGroupList) {
            for (const buildingData of buildingGroup.buildingDatas) {
                for (const zoneData of buildingData.zoneDatas) {
                    if (zoneData.id === zoneID) {
                        return zoneData.equipmentZoneDatas;
                    }
                }
            }
        }

        return null;
    }

    responseZoneCCTVs(zoneID, wsMgr) {
        if (wsMgr.monitoring) {
            if (wsMgr.monitoring.state.loading) {
                setTimeout(() => this.responseZoneCCTVs(zoneID, wsMgr), 100);
            }
            else {
                const sensors = this.getZoneSensors(zoneID, wsMgr.monitoring.state.buildingGroupList, wsMgr.monitoring.state.outdoorZones);

                if (sensors) {
                    const params = [zoneID];

                    for (const sensorType in sensors) {
                        if (sensorType.startsWith("cctv")) {
                            const cctvList = sensors[sensorType];

                            for (const cctv of cctvList) {
                                params.push(cctv.id);
                                params.push(cctv.name);
                                params.push(wsManager.layer.cctv);
                                params.push(cctv.x);
                                params.push(cctv.y);
                                params.push(cctv.z);
                                params.push(cctv.url);
                            }
                        }
                    }

                    wsMgr.responseZoneCCTVs(params);
                }
            }
        }
    }

    getAlarmSensors(wsMgr) {
        if (wsMgr.monitoring) {
            const alarms = wsMgr.monitoring.getAlarmList(-1);
            const alarmSensorZoneIDs = {};

            for (const alarm of alarms) {
                if (alarm.isAlarm) {
                    alarmSensorZoneIDs[alarm.sensorZoneID] = alarm.sensorZoneID;
                }
            }

            return alarmSensorZoneIDs;
        }

        return {};
    }

    selectSensor(zoneID, sensorID, sensorType, wsMgr) {
        if (wsMgr.monitoring) {
            if (wsMgr.monitoring.state.loading === false) {
                const sensor = this.getSensor(zoneID, sensorID, sensorType, wsMgr.monitoring.state.buildingGroupList, wsMgr.monitoring.state.outdoorZones);

                if (sensor) {
                    wsMgr.monitoring.selectSensor(sensor);
                }
            }
        }
    }

    getSensor(zoneID, sensorID, sensorType, buildingGroupList, outdoorZones) {
        zoneID = parseInt(zoneID);
        sensorID = parseInt(sensorID);
        sensorType = parseInt(sensorType);

        if (isNaN(zoneID) || isNaN(sensorID) || isNaN(sensorType)) {
            return null;
        }

        for (const buildingGroup of buildingGroupList) {
            for (const buildingData of buildingGroup.buildingDatas) {
                for (const zoneData of buildingData.zoneDatas) {
                    if (zoneData.id === zoneID) {
                        return this.findSensor(sensorID, sensorType, zoneData.sensors);
                    }
                }
            }
        }

        for (const zoneData of outdoorZones) {
            if (zoneData.id === zoneID) {
                if (zoneData.sensors) {
                    return this.findSensor(sensorID, sensorType, zoneData.sensors);
                }
            }
        }

        return null;
    }

    findSensor(sensorID, sensorType, sensors) {
        for (const sensorTypeName in sensors) {
            let sensorList = null;

            if (sensorType === wsManager.layer.fire) {
                if (sensorTypeName.startsWith("fire")) {
                    sensorList = sensors[sensorTypeName];
                }
            }
            else if (sensorType === wsManager.layer.smell) {
                if (sensorTypeName.startsWith("atmosphere")) {
                    sensorList = sensors[sensorTypeName];
                }
            }
            else if (sensorType === wsManager.layer.emergency) {
                if (sensorTypeName.startsWith("emergency")) {
                    sensorList = sensors[sensorTypeName];
                }
            }
            else if (sensorType === wsManager.layer.gas) {
                if (sensorTypeName.startsWith("gas")) {
                    sensorList = sensors[sensorTypeName];
                }
            }
            else if (sensorType === wsManager.layer.thermalCamera) {
                if (sensorTypeName.startsWith("cctv") ||
                    sensorTypeName.startsWith("thermal")) {
                    sensorList = sensors[sensorTypeName];
                }
            }
            else if (sensorType === wsManager.layer.cctv) {
                if (sensorTypeName.startsWith("cctv")) {
                    sensorList = sensors[sensorTypeName];
                }
            }
            else if (sensorType === wsManager.layer.worker) {
                if (sensorTypeName.startsWith("aps")) {
                    sensorList = sensors[sensorTypeName];
                }
            }

            if (sensorList) {
                for (const sensor of sensorList) {
                    if (sensor.id === sensorID) {
                        return sensor;
                    }
                }
            }
        }

        return null;
    }

    async responseZoneList(wsMgr) {
        const campusID = ProjectResource.campusID;
        //const user = ProjectResource.getUserInfo();

        if (campusID) {
            const [zones,] = await SdmsController.requestZoneList(campusID);

            if (zones) {
                wsMgr.responseZoneList(zones);
            }
        }
    }

    async setCurrentViewport(zoneID, cameraLocationX, cameraLocationY, cameraLocationZ, cameraRotationX, cameraRotationY, cameraRotationZ, wsMgr) {
        const [success, message] = await SdmsController.requestSaveViewport(zoneID, cameraLocationX, cameraLocationY, cameraLocationZ, cameraRotationX, cameraRotationY, cameraRotationZ);

        if (!success) {
            if (message && message.length > 0) {
                //alert(message);
            }
        }
    }

    responseCurrentAlarms(alarmType, wsMgr) {
        const alarmInfo = [];
        alarmType = parseInt(alarmType);

        //if (alarmType < 0 || alarmType === wsManager.alarmType.safetyMode) {
            if (wsMgr.monitoring) {
                this.addAlarms(alarmInfo, wsMgr.monitoring.getAlarmList(alarmType), alarmType, wsMgr.monitoring);
            }
        //}

        wsMgr.responseCurrentAlarms(alarmInfo);
    }

    addAlarms(alarmInfo, alarms, alarmType, monitoring) {
        for (const alarm of alarms) {
            if (alarm.isAlarm) {
                const sensorType = wsManager.facilityTypeNameToSensorType(alarm.facilityTypeName);

                if (sensorType === null) {
                    continue;
                }

                alarmInfo.push(alarmType);
                alarmInfo.push(alarm.zoneID);

                const buildingID = monitoring.getBuildingIDFromZoneID(alarm.zoneID);

                if (buildingID === null) {
                    alarmInfo.push(-1);
                }
                else {
                    alarmInfo.push(buildingID);
                }

                if (alarm.equipmentData?.equipment) {
                    // 설비알람의 경우 설비번호
                    alarmInfo.push(alarm.equipmentData.equipment.id);
                }
                else {
                    alarmInfo.push(alarm.orgSensorID);
                }

                alarmInfo.push(sensorType);
            }
        }
    }

    selectBuilding(buildingID, wsMgr) {
        if (wsMgr.monitoring) {
            wsMgr.monitoring.onSelect(parseInt(buildingID), null);
        }
    }

    selectFacility(facilityID, wsMgr) {
        if (wsMgr.monitoring) {
            wsMgr.monitoring.onSelect(null, parseInt(facilityID));
        }
    }

    moveToFacilityView(facilityID, wsMgr) {
        if (wsMgr.monitoring) {
            wsMgr.monitoring.moveToFacilityView(parseInt(facilityID));
        }
    }

    async responseMesEquipmentData(equipmentIDs, wsMgr) {
        const [result, message] = await SdmsController.requestMESEquipmentData(equipmentIDs);

        if (result !== null) {
            const datas = [];

            for (const equipmentData of result) {
                datas.push(equipmentData.equipment.id);
                datas.push(equipmentData.equipment.name);
                datas.push(equipmentData.data.shotCount);
                datas.push(wsProcessManager.checkDateTime(equipmentData.data.shotTime));
                datas.push(equipmentData.data.processTime);
                datas.push(equipmentData.data.cushionPos);
                datas.push(equipmentData.data.maxPressure);
                datas.push(equipmentData.data.transferPos);
                datas.push(equipmentData.data.transferPressure);
                datas.push(equipmentData.data.injectTime);
                datas.push(equipmentData.data.holdingPressure);
                datas.push(equipmentData.data.measureTime);
                datas.push(equipmentData.data.measureStartPos);
                datas.push(equipmentData.data.measureEndPos);
                datas.push(equipmentData.data.icingTime);
                datas.push(equipmentData.data.moldOpenTime);
                datas.push(equipmentData.data.moldCloseTime);
                datas.push(equipmentData.data.fowardTime);
                datas.push(equipmentData.data.backwardTime);
                datas.push(equipmentData.data.ok ? 1 : 0);
            }

            return wsMgr.responseMesEquipmentData(datas);
        }
        else {
            if (message !== null && message.length > 0) {
                console.log("responseMesEquipmentData Error : " + message);
            }
        }
    }

    static checkDateTime(dateTime) {
        if (!dateTime) {
            return dateTime;
        }

        const index = dateTime.indexOf('T');

        if (index > 0) {
            return dateTime.substring(0, index) + " " + dateTime.substring(index + 1);
        }

        return dateTime;
    }
}