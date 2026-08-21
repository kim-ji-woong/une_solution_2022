import { SDMSDataManager } from "../../services/sdmsDataManager";
import Contents3D from "./contents3D";
import { PipeManager } from "./pipeManager";
import { XRayManager } from "./xrayManager";
import * as THREE from "three/build/three.module.js";
import { PipePathManager } from "./pipePathManager";
import SdmsResource from "../../resource/id";
import SDMSMainMenu from "../sdmsMainMenu";

export class EtcSensorManager {
    static FireSensorType = "fire_";
    static FireSensorBoxModelType = "fire_effect-0";

    constructor(_3dOptions, facilityInfos) {
        this.zoneSensors = this.setZoneSensors(_3dOptions, facilityInfos);
        this.selectedSensorModel = null;
        this.layers = {};
    }

    setZoneSensors(_3dOptions, facilityInfos) {
        if (!_3dOptions) {
            return;
        }

        const zoneSensors = {};
        // key : sensorName
        const sensorDataMap = {};

        for (const zoneID in _3dOptions.zones) {
            const zone = _3dOptions.zones[zoneID];
            this.makeZoneSensors(zoneID, zoneSensors, zone, sensorDataMap, facilityInfos);
        }

        for (const zoneID in _3dOptions.outdoorZones) {
            const zone = _3dOptions.outdoorZones[zoneID];
            this.makeZoneSensors(zoneID, zoneSensors, zone, sensorDataMap, facilityInfos);
        }

        return zoneSensors;
    }

    makeZoneSensors(zoneID, zoneSensors, zone, sensorDataMap, facilityInfos) {
        const _sensors = {};

        if (zone.sensors) {
            zoneSensors[zoneID.toString()] = _sensors;

            for (const sensorType in zone.sensors) {
                const sensors = zone.sensors[sensorType];

                for (const sensor of sensors) {
                    const sensorData = {
                        sensor: sensor, model: { normal: null, xray: null }
                    };

                    sensorDataMap[sensor.name] = sensorData;
                    _sensors[sensor.uniqueKey] = sensorData;
                }
            }
        }

        const strZoneID = zoneID.toString();
        const nZoneID = parseInt(strZoneID);

        if (facilityInfos) {
            for (const facilityInfo of facilityInfos) {
                if (facilityInfo.zoneID === nZoneID) {
                    const index1 = facilityInfo.facilityName.lastIndexOf('(');
                    const index2 = facilityInfo.facilityName.lastIndexOf(')');

                    if (index1 >= 0 && index2 > index1) {
                        const materialTypeNo = facilityInfo.facilityName.substring(index1 + 1, index2);
                        const materialType = parseInt(materialTypeNo);

                        if (materialType === SdmsResource.materialType.ElectricFacility) {
                            const uniqueKey = facilityInfo.facilityName.substring(0, index1);
                            const sensorData = sensorDataMap[uniqueKey];

                            if (sensorData) {
                                _sensors[facilityInfo.modelName] = {
                                    sensor: sensorData.sensor, model: { normal: null, xray: null }
                                };
                            }
                        }
                    }
                }
            }
        }
    }

    linkZoneSensors(modelNode, isXrayModel, _3dOptions, mode) {
        const modelName = isXrayModel ? XRayManager.getNormalContentsFromModelName(modelNode.name) : modelNode.name;

        if (mode === Contents3D.Mode_Indoor) {
            const zoneID = this.getZoneIDFromIndoorModel(modelName, _3dOptions);

            if (zoneID) {
                this.linkModelToSensor(modelNode, zoneID, isXrayModel);
            }
        }
        else if (mode === Contents3D.Mode_Outdoor_All) {
            if (_3dOptions?.outdoorModel?.file === modelName) {
                for (const zoneID in _3dOptions.outdoorZones) {
                    this.linkModelToSensor(modelNode, zoneID, isXrayModel);
                }
            }
        }
    }

    getZoneIDFromIndoorModel(modelName, _3dOptions) {
        for (const buildingGroupName in _3dOptions.indoorModels) {
            const buildingGroupData = _3dOptions.indoorModels[buildingGroupName];

            for (const buildingName in buildingGroupData) {
                const buildingData = buildingGroupData[buildingName];

                if (buildingData.floors) {
                    for (const zoneData of buildingData.floors) {
                        if (modelName === zoneData.file) {
                            return zoneData.zoneID.toString();
                        }
                    }
                }
            }
        }

        return null;
    }

    linkModelToSensor(modelNode, zoneID, isXrayModel) {
        const zoneSensors = this.zoneSensors[zoneID];

        if (EtcSensorManager.isEmpty(zoneSensors)) {
            return;
        }

        this.findModelToSensor(modelNode, zoneSensors, isXrayModel);
    }

    findModelToSensor(node, zoneSensors, isXrayModel) {
        const sensorData = zoneSensors[node.name];

        if (sensorData) {
            const boxModel = EtcSensorManager.getBoxModel(node);

            if (boxModel) {
                node.userData.pair = boxModel;
                node.userData.boundingModel = false;
                boxModel.userData.pair = node;
                boxModel.userData.boundingModel = true;
                boxModel.visible = false;
            }

            if (isXrayModel) {
                sensorData.model.xray = node;
            }
            else {
                sensorData.model.normal = node;
            }

            const layerID = EtcSensorManager.getLayerID(node);

            if (layerID) {
                const layer = this.getLayer(layerID);
                this.addToLayer(layer, node.parent);
            }
        }
        else {
            for (const child of node.children) {
                this.findModelToSensor(child, zoneSensors, isXrayModel);
            }
        }
    }

    addToLayer(layer, node) {
        if (!node) {
            return;
        }

        for (const model of layer) {
            if (model === node) {
                return;
            }
        }

        layer.push(node);
    }

    getLayer(layerID) {
        let layer = this.layers[layerID];

        if (!layer) {
            layer = [];
            this.layers[layerID] = layer;
        }

        return layer;
    }

    static getLayerID(modelNode) {
        if (modelNode.name.startsWith(PipeManager.Fire_Data.beginTag)) {
            return SDMSMainMenu.FireControl_Sensor;
        }
        else if (modelNode.name.startsWith(PipeManager.AirFan_Data.beginTag)) {
            return SDMSMainMenu.AirFan;
        }
        else if (modelNode.name.startsWith(PipeManager.Electric_Data.beginTag)) {
            return SDMSMainMenu.Electric_Sensor;
        }

        return null;
    }

    static getBoxModel(modelNode) {
        if (modelNode.name.startsWith(EtcSensorManager.FireSensorType)) {
            return EtcSensorManager.getFireSensorBoxModel(modelNode);
        }
        else if (modelNode.name.startsWith(PipeManager.Panel1_Data.beginTag)) {
            return EtcSensorManager.getPanelSensorBoxModel(modelNode, PipeManager.Panel1_Data);
        }
        else if (modelNode.name.startsWith(PipeManager.Panel2_Data.beginTag)) {
            return EtcSensorManager.getPanelSensorBoxModel(modelNode, PipeManager.Panel2_Data);
        }
        else if (modelNode.name.startsWith(PipeManager.Electric_Data.beginTag)) {
            return EtcSensorManager.getElectricSensorBoxModel(modelNode, PipeManager.Electric_Data);
        }
        else if (modelNode.name.startsWith(PipeManager.AirFan_Data.beginTag)) {
            return EtcSensorManager.getAirFanSensorBoxModel(modelNode, PipeManager.AirFan_Data);
        }

        return null;
    }

    static getElectricSensorBoxModel(modelNode, groupData) {
        const models = modelNode?.parent?.children;

        if (models) {
            const modelNumberString = modelNode.name.substring(groupData.beginTag.length);
            const index = modelNumberString.indexOf('_');
            const modelNumber = index > 0 ? modelNumberString.substring(0, index) : modelNumberString;
            const targetName = groupData.selectedBeginTag + modelNumber + SDMSDataManager.BoundingBoxTag;

            for (const model of models) {
                if (model.name === groupData.selectedTag) {
                    for (const child of model.children) {
                        if (child.name === targetName) {
                            return child;
                        }
                    }

                    break;
                }
            }
        }

        return null;
    }

    static getAirFanSensorBoxModel(modelNode, groupData) {
        const models = modelNode?.parent?.children;

        if (models) {
            const modelNumberString = modelNode.name.substring(groupData.beginTag.length);
            const index = modelNumberString.indexOf('_');
            const modelNumber = index > 0 ? modelNumberString.substring(0, index) : modelNumberString;
            const targetName = groupData.selectedBeginTag + modelNumber + SDMSDataManager.BoundingBoxTag;

            for (const model of models) {
                if (model.name === targetName) {
                    return model;
                }
            }
        }

        return null;
    }

    static getPanelSensorBoxModel(modelNode, groupData) {
        const models = modelNode?.parent?.children;

        if (models) {
            const modelNumberString = modelNode.name.substring(groupData.beginTag.length);
            const index = modelNumberString.indexOf('_');
            const modelNumber = index > 0 ? modelNumberString.substring(0, index) : modelNumberString;
            const targetName = groupData.selectedBeginTag + modelNumber + SDMSDataManager.BoundingBoxTag;

            for (const model of models) {
                if (model.name === groupData.selectedTag) {
                    for (const child of model.children) {
                        if (child.name === targetName) {
                            return child;
                        }
                    }
                }
            }
        }

        return null;
    }

    static getFireSensorBoxModel(modelNode) {
        const models = modelNode?.parent?.children;

        if (models) {
            const modelNumber = modelNode.name.substring(EtcSensorManager.FireSensorType.length);
            const boxTag = EtcSensorManager.FireSensorBoxModelType.substring(0, EtcSensorManager.FireSensorBoxModelType.length - SDMSDataManager.BoundingBoxTag.length) + "_";
            const targetName = boxTag + modelNumber + SDMSDataManager.BoundingBoxTag;

            for (const model of models) {
                if (model.name === EtcSensorManager.FireSensorBoxModelType) {
                    for (const child of model.children) {
                        if (child.name === targetName) {
                            return child;
                        }
                    }

                    break;
                }
            }
        }

        return null;
    }

    getSensorModel(zoneID, sensorID, isXRayModel) {
        const zoneSensors = this.zoneSensors[zoneID.toString()];
        sensorID = sensorID.toString();

        if (zoneSensors) {
            for (const sensorName in zoneSensors) {
                const sensorData = zoneSensors[sensorName];

                if (sensorData.sensor?.id.toString() === sensorID) {
                    if (isXRayModel)
                        return sensorData.model.xray;
                    else
                        return sensorData.model.normal;
                }
            }
        }

        return null;
    }

    static isEmpty(object) {
        if (!object) {
            return true;
        }

        for (const key in object) {
            return false;
        }

        return true;
    }

    selectSensorModel(sensorModel, pipeManager, zoneID) {
        if (!sensorModel) {
            if (this.selectedSensorModel) {
                this.selectedSensorModel.visible = false;
            }

            this.selectedSensorModel = null;

            if (pipeManager?.pipePathManager) {
                pipeManager.pipePathManager.showAllFacilities(zoneID);
            }
        }
        else {
            if (sensorModel.userData.boundingModel) {
                this.setSelectedSensorModel(sensorModel);
            }
            else if (sensorModel.userData?.pair?.userData?.boundingModel) {
                this.setSelectedSensorModel(sensorModel.userData.pair);
            }
        }
    }

    setSelectedSensorModel(sensorModel) {
        if (this.selectedSensorModel === sensorModel) {
            this.selectedSensorModel.visible = true;
        }
        else {
            if (this.selectedSensorModel) {
                this.selectedSensorModel.visible = false;
            }

            sensorModel.visible = true;
            this.selectedSensorModel = sensorModel;
        }
    }

    getOutdoorZoneID(contents3D) {
        const outdoorZones = contents3D?.props?._3dOptions.outdoorZones;

        for (const zoneID in outdoorZones) {
            return parseInt(zoneID.toString());
        }

        return null;
    }

    onClick(event, contents3D, intersects, clickedModel) {
        let currentModel = contents3D.currentModel;

        if (!currentModel) {
            return null;
        }

        if (currentModel.userData.pair) {
            if (!currentModel.userData.xrayMode) {
                currentModel = currentModel.userData.pair;
            }
        }

        let zoneID = contents3D.props.currentView?.zoneID;

        if (zoneID === null) {
            const outdoorZones = contents3D?.props?._3dOptions.outdoorZones;

            if (outdoorZones) {
                for (const zoneID in outdoorZones) {
                    const sensorData = this._onClick(event, contents3D, intersects, clickedModel, currentModel, parseInt(zoneID.toString()), true);

                    if (sensorData) {
                        return sensorData;
                    }
                }
            }

            return null;
        }

        const isOutdoor = contents3D.props.currentView?.zoneID ? false : true;
        return this._onClick(event, contents3D, intersects, clickedModel, currentModel, zoneID, isOutdoor);
    }

    _onClick(event, contents3D, intersects, clickedModel, currentModel, zoneID, isOutdoor) {
        const zoneSensors = this.zoneSensors[zoneID];

        if (!zoneSensors) {
            return null;
        }

        if (clickedModel) {
            const sensorName = clickedModel.name;
            const sensorData = zoneSensors[sensorName];

            if (sensorData) {
                return sensorData;
            }
            /*else if (isOutdoor) {
                // 외부모델일 경우 예외를 둔다.
                return this.getLinkedSensorModel(clickedModel, zoneSensors);
            }*/
        }
        else {
            if (!intersects || intersects.length === 0) {
                const x = event.nativeEvent.offsetX;
                const y = event.nativeEvent.offsetY;
                const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, contents3D.camera);
                intersects = raycaster.intersectObjects(currentModel.children, true);
            }

            const intersectCount = intersects.length;

            if (intersectCount > 0) {
                contents3D.sortIntersects(intersects, intersectCount);

                for (let i = 0; i < intersectCount; i++) {
                    const obj = intersects[i];
                    const sensorName = obj.object.name;

                    const sensorData = zoneSensors[sensorName];

                    if (sensorData) {
                        return sensorData;
                    }
                }
            }
        }

        return null;
    }

    /*getLinkedSensorModel(clickedModel, zoneSensors) {
        const pipes = clickedModel.userData.pipes;

        if (pipes) {
            for (const pipe of pipes) {
                const facilities = pipe.userData.facilities;

                if (facilities) {
                    for (const facility of facilities) {
                        const sensorData = zoneSensors[facility.name];

                        if (sensorData) {
                            return sensorData;
                        }
                    }
                }
            }
        }

        return null;
    }*/

    setVisible(visibleSensorTypes) {
        for (const layerID in visibleSensorTypes) {
            const layer = this.layers[layerID];
    
            if (layer) {
                const visible = visibleSensorTypes[layerID];

                for (const model of layer) {
                    if (model.visible !== visible) {
                        model.visible = visible;
                    }
                }
            }
        }
    }

    getZoneSensor(zoneID, sensorName) {
        const sensors = this.zoneSensors[zoneID];

        for (const key in sensors) {
            const sensorData = sensors[key];

            if (sensorData.sensor) {
                if (sensorData.sensor.name === sensorName) {
                    if ((sensorData.sensor.x !== 0 && !sensorData.sensor.x) ||
                        (sensorData.sensor.y !== 0 && !sensorData.sensor.y) ||
                        (sensorData.sensor.z !== 0 && !sensorData.sensor.z)) {
                        if (sensorData.model.normal?.position) {
                            const position = this.getPosiiton(sensorData.model.normal);
                            sensorData.sensor.x = position.x;
                            sensorData.sensor.y = position.y;
                            sensorData.sensor.z = position.z;
                        }
                        else if (sensorData.model.xray?.position) {
                            const position = this.getPosiiton(sensorData.model.xray);
                            sensorData.sensor.x = position.x;
                            sensorData.sensor.y = position.y;
                            sensorData.sensor.z = position.z;
                        }
                    }

                    return sensorData.sensor;
                }
            }
        }

        return null;
    }

    getZoneSensorFromModelName(zoneID, modelName) {
        const sensors = this.zoneSensors[zoneID];

        if (sensors) {
            const sensorData = sensors[modelName];

            if (sensorData) {
                return sensorData;
            }
        }

        return null;
    }

    // 부모노드까지 고려한 위치를 얻어온다.
    getPosiiton(obj, position) {
        if (!obj) {
            return position;
        }

        if (!position) {
            position = new THREE.Vector3();
            position.x = obj.position.x;
            position.y = obj.position.y;
            position.z = obj.position.z;
        }
        else {
            position.x += obj.position.x;
            position.y += obj.position.y;
            position.z += obj.position.z;
        }

        return this.getPosiiton(obj.parent, position);
    }
}