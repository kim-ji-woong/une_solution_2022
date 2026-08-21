import ProjectResource from "../../../Root/resource/id";

import * as THREE from "three/build/three.module.js";

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
            mgr._setFloorBoundingBox(outdoorModelName);
            contents3D.floorBoundingBoxManager = mgr;
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

        const buildingGroupModels = this.getBuildingGroupModels(outdoorModel);

        if (buildingGroupModels) {
            this.moveModels(buildingGroupModels, "A1", a1Models);
            this.moveModels(buildingGroupModels, "A2", a2Models);
            this.moveModels(buildingGroupModels, "A3", a3Models);
            this.moveModels(buildingGroupModels, "A4", a4Models);
            this.moveModels(buildingGroupModels, "A5", a5Models);
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
                //if (childModel.name === ModelChecker.targetModelName) {
                //    for (const child of childModel.children) {
                //        return child;
                //    }
                //}
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

        let siteID = null;
        let buildingName = "";

        if (tag === "A3") {
            if (floor.startsWith("B")) {
                siteID = ProjectResource.Site.GG_A;
                buildingName = "bf";
            }
            else {
                siteID = ProjectResource.Site.GG_B;
                buildingName = "gg_ggc_common";
            }
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
            buildingName = "도서관";
        }
        else if (tag === "A5") {
            siteID = ProjectResource.Site.GG_F;
            buildingName = "신용보증재단";
        }

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

    update(sensorAlarms) {
        let visibleFloorModels = [...this.visibleFloorModels];

        // 층별 BoundingBox를 모두 사라지게 한다.
        for (const model of visibleFloorModels) {
            model.visible = false;
        }

        visibleFloorModels = [];
        
        if (sensorAlarms) {
            for (const alarm of sensorAlarms) {
                // 화재 알람이 발생한 BoundingBox만 나타나게 한다.
                if (alarm.isAlarm) {
                    if (alarm.facilityTypeString.includes("화재")) {
                        const model = this.getFloorBoundingBox(alarm.zoneID);

                        if (model) {
                            model.visible = true;
                            visibleFloorModels.push(model);
                        }
                    }
                }
            }
        }

        this.visibleFloorModels = visibleFloorModels;
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
}