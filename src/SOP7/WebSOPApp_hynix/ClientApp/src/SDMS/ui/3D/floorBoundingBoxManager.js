import ProjectResource from "../../../Root/resource/id";
import { ModelChecker } from "./gg/modelChecker";
import * as THREE from "three/build/three.module.js";
import { SDMSDataManager } from "../../services/sdmsDataManager";

// 건물의 층별 BoundingBox를 관리한다.
export class FloorBoundingBoxManager {
    constructor(contents3D) {
        this.contents3D = contents3D;
        this.floorBoundingBox = {};
        this.visibleFloorModels = [];
    }

    static setFloorBoundingBox(contents3D) {
        const mgr = new FloorBoundingBoxManager(contents3D);
        const outdoorModelName = contents3D.props._3dOptions?.outdoorModel?.file;

        if (outdoorModelName) {
            contents3D.floorBoundingBoxManager = mgr;
            mgr._setFloorBoundingBox(outdoorModelName);
        }
    }

    _setFloorBoundingBox(outdoorModelName) {
        let outdoorModel = null;

        for (const model of this.contents3D.scene.children) {
            if (model.name === outdoorModelName && model.visible) {
                outdoorModel = model;
                break;
            }
        }

        if (!outdoorModel) {
            return;
        }

        const a1Models = {};
        const a2Models = {};
        const a3Models = {};
        const a4Models = {};
        const a5Models = {};
        const a6Models = {};
        const a7Models = {};
        const a8Models = {};

        for (const child of outdoorModel.children) {
            for (const model of child.children) {
                const modelName = model.name;
                let models = null;
                let tag = null;

                // 도청, 도의회 공용(지하4층 ~ 지상4층)
                if (modelName.startsWith("A3")) {
                    models = a3Models;
                    tag = "A3";
                }
                // 도의회
                else if (modelName.startsWith("A2")) {
                    models = a2Models;
                    tag = "A2";
                }
                // 도청
                else if (modelName.startsWith("A1")) {
                    models = a1Models;
                    tag = "A1";
                }
                // 도서관
                else if (modelName.startsWith("A4")) {
                    models = a4Models;
                    tag = "A4";
                }
                // 신용보증재단
                else if (modelName.startsWith("A5")) {
                    models = a5Models;
                    tag = "A5";
                }
                // 복합시설관
                else if (modelName.startsWith("A6")) {
                    models = a6Models;
                    tag = "A6";
                }
                // 주택도시공사
                else if (modelName.startsWith("A7")) {
                    models = a7Models;
                    tag = "A7";
                }
                // 교육청
                else if (modelName.startsWith("A8")) {
                    models = a8Models;
                    tag = "A8";
                }
                else {
                    continue;
                }

                if (modelName.endsWith("-0")) {
                    const index = modelName.indexOf("F");
                    const floor = index < 0 ? "All" : modelName.substring(3, index + 1);

                    const zoneID = this.getZoneID(floor, tag);

                    if (zoneID) {
                        models[zoneID] = model;
                    }
                    //models[floor] = model;
                }
            }
        }

        this.floorBoundingBox["A1"] = a1Models;
        this.floorBoundingBox["A2"] = a2Models;
        this.floorBoundingBox["A3"] = a3Models;
        this.floorBoundingBox["A4"] = a4Models;
        this.floorBoundingBox["A5"] = a5Models;
        this.floorBoundingBox["A6"] = a6Models;
        this.floorBoundingBox["A7"] = a7Models;
        this.floorBoundingBox["A8"] = a8Models;

        const buildingGroupModels = this.getBuildingGroupModels(outdoorModel);

        if (buildingGroupModels) {
            this.moveModels(buildingGroupModels, "A1", a1Models);
            this.moveModels(buildingGroupModels, "A2", a2Models);
            this.moveModels(buildingGroupModels, "A3", a3Models);
            this.moveModels(buildingGroupModels, "A4", a4Models);
            this.moveModels(buildingGroupModels, "A5", a5Models);
            this.moveModels(buildingGroupModels, "A6", a6Models);
            this.moveModels(buildingGroupModels, "A7", a7Models);
            this.moveModels(buildingGroupModels, "A8", a8Models);
        }
    }

    moveModels(buildingGroupModels, tagName, models) {
        for (const buildingGroupModel of buildingGroupModels.children) {
            if (buildingGroupModel.name === tagName) {
                const floorModelName = "floorModel_" + tagName;

                for (const child of buildingGroupModel.children) {
                    if (child.name === floorModelName) {
                        return;
                    }
                }

                const floorModels = new THREE.Object3D();
                floorModels.matrixAutoUpdate = false;
                floorModels.name = floorModelName;
                floorModels.visible = true;

                buildingGroupModel.add(floorModels);

                const floorModelsPosition = this.getPosition(floorModels);
                let parentModelPosition = null;

                for (const key in models) {
                    const model = models[key];

                    if (parentModelPosition === null) {
                        parentModelPosition = this.getPosition(model.parent);
                    }

                    model.parent.remove(model);
                    floorModels.add(model);

                    // 부모가 바뀌었으니 그만큼 위치보정을 해준다.
                    model.position.x += parentModelPosition.x - floorModelsPosition.x;
                    model.position.y += parentModelPosition.y - floorModelsPosition.y;
                    model.position.z += parentModelPosition.z - floorModelsPosition.z;
                }

                break;
            }
        }
    }

    // 최상위 노드까지 고려한 obj의 최종 (3D)화면 좌표
    getPosition(obj) {
        const vPos = new THREE.Vector3();

        vPos.x = obj.position.x;
        vPos.y = obj.position.y;
        vPos.z = obj.position.z;

        while (obj.parent) {
            obj = obj.parent;

            vPos.x += obj.position.x;
            vPos.y += obj.position.y;
            vPos.z += obj.position.z;
        }

        return vPos;
    }

    getBuildingGroupModels(model) {
        const sceneModel = this.getRootModel(model);

        if (sceneModel) {
            for (const childModel of sceneModel.children) {
                if (childModel.name === ModelChecker.targetModelName) {
                    for (const child of childModel.children) {
                        return child;
                    }
                }
            }
        }

        return null;
    }

    getRootModel(model) {
        while (model.parent) {
            model = model.parent;
        }

        return model;
    }

    getZoneID(floor, tag) {
        if (floor === "All") {
            return tag + "_" + floor;
        }

        const [siteID, buildingName] = FloorBoundingBoxManager.getBuildingInfo(tag);
        //let siteID = null;
        //let buildingName = "";

        //if (tag === "A3") {
        //    /*if (floor.startsWith("B")) {
        //        siteID = ProjectResource.Site.GG_A;
        //        buildingName = "bf";
        //    }
        //    else {*/
        //        siteID = ProjectResource.Site.GG_B;
        //        buildingName = "gg_ggc_common";
        //    //}
        //}
        //else if (tag === "A2") {
        //    siteID = ProjectResource.Site.GG_B;
        //    buildingName = "ggc";
        //}
        //else if (tag === "A1") {
        //    siteID = ProjectResource.Site.GG_B;
        //    buildingName = "gg";
        //}
        //else if (tag === "A4") {
        //    siteID = ProjectResource.Site.GG_D;
        //    buildingName = "경기도서관";
        //}
        //else if (tag === "A5") {
        //    siteID = ProjectResource.Site.GG_F;
        //    buildingName = "경기신용보증재단";
        //}
        //else if (tag === "A6") {
        //    siteID = ProjectResource.Site.GG_F;
        //    buildingName = "복합시설관";
        //}
        //else if (tag === "A7") {
        //    siteID = ProjectResource.Site.GG_H;
        //    buildingName = "경기주택도시공사";
        //}
        //else if (tag === "A8") {
        //    siteID = ProjectResource.Site.GG_G;
        //    buildingName = "경기도교육청";
        //}

        if (siteID === null) {
            return null;
        }

        let floorIndex = 1;
        let strFloor = "";

        if (floor.startsWith("B")) {
            floorIndex = -1;
            strFloor = floor.substring(1, floor.length - 1);
        }
        else {
            strFloor = floor.substring(0, floor.length - 1);
        }

        if (tag === "A2" && strFloor === "R") {
            floorIndex = 12;
        }
        else {
            if (floorIndex > 0) {
                floorIndex = (floorIndex * parseInt(strFloor)) - 1;
            }
            else {
                floorIndex = floorIndex * parseInt(strFloor);
            }
        }

        const _3dOptions = this.contents3D.props.site3dOptions[siteID];

        let buildingID = null;

        if (_3dOptions?.buildings) {
            for (const buildingGroupName in _3dOptions.buildings) {
                const buildings = _3dOptions.buildings[buildingGroupName];
                const buildingData = buildings[buildingName];

                if (buildingData) {
                    buildingID = buildingData[0];
                    break;
                }
            }
        }

        if (_3dOptions?.zones) {
            for (const zoneID in _3dOptions.zones) {
                const zoneData = _3dOptions.zones[zoneID];

                if (zoneData[0] === floorIndex && zoneData[1] === buildingID) {
                    return zoneID;
                }
            }
        }

        return null;
    }

    static getBuildingInfo(tag) {
        let siteID = null;
        let buildingName = null;

        if (tag === "A3") {
            /*if (floor.startsWith("B")) {
                siteID = ProjectResource.Site.GG_A;
                buildingName = "bf";
            }
            else {*/
            siteID = ProjectResource.Site.GG_B;
            buildingName = "gg_ggc_common";
            //}
        }
        else if (tag === "A2") {
            siteID = ProjectResource.Site.GG_B;
            buildingName = "ggc";
        }
        else if (tag === "A1") {
            siteID = ProjectResource.Site.GG_B;
            buildingName = "gg";
        }
        else if (tag === "A4") {
            siteID = ProjectResource.Site.GG_D;
            buildingName = "경기도서관";
        }
        else if (tag === "A5") {
            siteID = ProjectResource.Site.GG_F;
            buildingName = "경기신용보증재단";
        }
        else if (tag === "A6") {
            siteID = ProjectResource.Site.GG_F;
            buildingName = "복합시설관";
        }
        else if (tag === "A7") {
            siteID = ProjectResource.Site.GG_H;
            buildingName = "경기주택도시공사";
        }
        else if (tag === "A8") {
            siteID = ProjectResource.Site.GG_G;
            buildingName = "경기도교육청";
        }

        return [siteID, buildingName];
    }

    update(sensorAlarms) {
        let visibleFloorModels = [...this.visibleFloorModels];

        // 층별 BoundingBox를 모두 사라지게 한다.
        for (const model of visibleFloorModels) {
            FloorBoundingBoxManager.setVisible(model, false);
            //model.visible = false;
        }

        visibleFloorModels = [];
        
        if (sensorAlarms) {
            for (const alarm of sensorAlarms) {
                // 화재 알람이 발생한 BoundingBox만 나타나게 한다.
                if (alarm.isAlarm) {
                    if (alarm.facilityTypeString.includes("화재")) {
                        const model = this.getFloorBoundingBox(alarm.zoneID);

                        if (model) {
                            FloorBoundingBoxManager.setVisible(model, true);
                            //model.visible = true;
                            visibleFloorModels.push(model);
                        }
                    }
                }
            }
        }

        this.visibleFloorModels = visibleFloorModels;
    }

    static setVisible(model, visible) {
        model.userData.ownVisible = visible;
        model.visible = visible;
    }

    static _setLayerVisible(model, visible) {
        model.userData.layerVisible = visible;

        if (model.userData.layerVisible && model.userData.ownVisible) {
            model.visible = true;
        }
        else {
            model.visible = false;
        }
    }

    getFloorBoundingBox(zoneID) {
        for (const buildingTag in this.floorBoundingBox) {
            const models = this.floorBoundingBox[buildingTag];
            const model = models[zoneID];

            if (model) {
                return model;
            }
        }

        return null;
    }

    setLayerVisible(tag, visible) {
        const models = this.floorBoundingBox[tag];

        if (models) {
            for (const key in models) {
                const model = models[key];
                FloorBoundingBoxManager._setLayerVisible(model, visible);
            }
        }
    }

    // 가장 가까운 FloorBoundingBoxModel로부터 zoneID를 추출해낸다.
    static getIndoorFromFloorBoundingBoxModels(intersects, contents3D) {
        if (!intersects) {
            return [null, null, null];
        }

        let siteID = null;
        let buildingID = null;
        let floorIndex = null;
        let distance = null;

        for (const intersect of intersects) {
            if (buildingID === null || (distance !== null && distance > intersect?.distance)) {
                const [_siteID, _buildingID, _floorIndex] = FloorBoundingBoxManager.getIndoorFromFloorBoundingBoxModel(intersect.object, contents3D);

                if (_buildingID !== null) {
                    siteID = _siteID;
                    buildingID = _buildingID;
                    floorIndex = _floorIndex;
                    distance = intersect.distance;
                }
                else if (intersect.object.parent?.visible) {
                    const [__siteID, __buildingID, __floorIndex] = FloorBoundingBoxManager.getIndoorFromFloorBoundingBoxModel(intersect.object.parent, contents3D);

                    if (__buildingID !== null) {
                        siteID = __siteID;
                        buildingID = __buildingID;
                        floorIndex = __floorIndex;
                        distance = intersect.distance;
                    }
                }
            }
        }

        return [siteID, buildingID, floorIndex];
    }

    static getIndoorFromFloorBoundingBoxModel(model, contents3D) {
        if (!model.name) {
            return [null, null, null];
        }

        if (model.name.endsWith(SDMSDataManager.BoundingBoxTag)) {
            const tokens = model.name.split("-");

            if (tokens.length === 3) {
                const [siteID, buildingName] = FloorBoundingBoxManager.getBuildingInfo(tokens[0]);

                if (siteID !== null && buildingName !== null) {
                    let floorInfo = tokens[1];
                    let positive = true;

                    if (floorInfo.endsWith("F")) {
                        floorInfo = floorInfo.substring(0, floorInfo.length - 1);

                        if (floorInfo.startsWith("B")) {
                            positive = false;
                            floorInfo = floorInfo.substring(1);
                        }
                    }
                    else {
                        return [null, null, null];
                    }

                    const floor = parseInt(floorInfo);

                    if (isNaN(floor) === false && floor !== null && floor !== undefined) {
                        const floorIndex = positive ? floor - 1 : floor * (-1);
                        const buildingID = FloorBoundingBoxManager.getBuildingID(siteID, buildingName, floorIndex, contents3D);
                        return [siteID, buildingID, floorIndex]
                    }
                }
            }
        }

        return [null, null, null];
    }

    static getBuildingID(siteID, buildingName, floorIndex, contents3D) {
        const _3dOptions = contents3D.props.site3dOptions[siteID];

        if (_3dOptions) {
            for (const key in _3dOptions.buildings) {
                const buildingData = _3dOptions.buildings[key];

                if (buildingData instanceof Object) {
                    const building = buildingData[buildingName];

                    if (building) {
                        if (Array.isArray(building) && building.length >= 7) {
                            const zoneDatas = building[6];

                            for (const zoneID in zoneDatas) {
                                const zoneData = zoneDatas[zoneID];

                                if (Array.isArray(zoneData) && zoneData.length > 1 && zoneData[0] === floorIndex) {
                                    return zoneData[1];
                                }
                            }
                        }
                    }

                    break;
                }
            }
        }

        return null;
    }
}