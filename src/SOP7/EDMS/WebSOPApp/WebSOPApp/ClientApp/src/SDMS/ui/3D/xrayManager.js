export class XRayManager {
    static XRayTag = "_T";

    constructor(contents3D) {
        this.contents3D = contents3D;

        this.siteOutdoorModelsNormal = {};
        this.siteOutdoorModelsXray = {};

        this.internalModelsNormal = {};
        this.internalModelsXray = {};
    }

    setXRayModels() {
        for (const siteID in this.contents3D.siteOutdoorModels) {
            const outdoorModels = this.contents3D.siteOutdoorModels[siteID];
            this.siteOutdoorModelsNormal[siteID] = outdoorModels;

            const xrayModels = [];
            this.siteOutdoorModelsXray[siteID] = xrayModels;

            for (const model of outdoorModels) {
                if (model.userData.pair) {
                    xrayModels.push(model.userData.pair);
                }
                else {
                    xrayModels.push(model);
                }
            }
        }

        this.internalModelsNormal = this.contents3D.internalModels;

        for (const modelName in this.contents3D.internalModels) {
            const models = this.contents3D.internalModels[modelName];
            const modelCount = models.length;

            const model = models[0];
            const xrayModels = [];
            this.internalModelsXray[modelName] = xrayModels;

            if (model.userData.pair) {
                xrayModels.push(model.userData.pair);
            }
            else {
                xrayModels.push(model);
            }

            for (let i = 1; i < modelCount; i++) {
                xrayModels.push(models[i]);
            }
        }
    }

    static isXrayModel(modelNode) {
        if (!modelNode) {
            return false;
        }

        const dotIndex = modelNode.name.lastIndexOf('.');

        if (dotIndex < 0)
            return null;

        const fileName = modelNode.name.substring(0, dotIndex);
        return fileName.endsWith(XRayManager.XRayTag);
    }

    static getXrayContentsFromModel(modelNode) {
        if (!modelNode) {
            return null;
        }

        return XRayManager.getXrayContentsFromModelName(modelNode.name);
    }

    static getXrayContentsFromModelName(modelName) {
        const dotIndex = modelName.lastIndexOf('.');

        if (dotIndex < 0)
            return null;

        const fileName = modelName.substring(0, dotIndex);
        const ext = modelName.substring(dotIndex);

        return fileName + XRayManager.XRayTag + ext;
    }

    static getNormalContentsFromModelName(modelName) {
        const dotIndex = modelName.lastIndexOf('.');

        if (dotIndex < 0)
            return null;

        const fileName = modelName.substring(0, dotIndex);
        const ext = modelName.substring(dotIndex);

        return fileName.substring(0, fileName.length - XRayManager.XRayTag.length) + ext;
    }

    static setXrayModel(xrayModel, params) {
        const normalModel = params[0];
        const _this = params[1];
        const _3dOptions = params[2];
        const pipeManager = params[3];

        if (xrayModel && normalModel) {
            xrayModel.userData.pair = normalModel;
            xrayModel.userData.xrayMode = true;
            normalModel.userData.pair = xrayModel;
            normalModel.userData.xrayMode = false;

            const [isOutdoor, zoneID] = XRayManager.getModelInfo(normalModel.name, _3dOptions);

            if (isOutdoor)
                pipeManager.setPipes(xrayModel, isOutdoor, null);
            else if (zoneID !== null)
                pipeManager.setPipes(xrayModel, false, zoneID);

            if (_this.isIndoorModel(normalModel)) {
                const models = _this.internalModelsXray[normalModel.name];

                // setXRayModels() 호출 이후에 로딩이 종료된 파일의 경우...
                if (models && models.length > 1) {
                    models[0] = xrayModel;
                }
            }

            //const log = xrayModel.name + ", " + normalModel.name;
            //console.log("setXrayModel : " + log);
        }
    }

    static getModelInfo(modelName, _3dOptions) {
        if (modelName === _3dOptions.outdoorModel.file) {
            return [true, null];
        }

        for (const buildingGroupName in _3dOptions.indoorModels) {
            const buildings = _3dOptions.indoorModels[buildingGroupName];

            if (buildings) {
                for (const buildingName in buildings) {
                    const buildingData = buildings[buildingName];

                    if (buildingData?.floors) {
                        for (const floor of buildingData.floors) {
                            if (floor.file === modelName) {
                                return [false, floor.zoneID];
                            }
                        }
                    }
                }
            }
        }

        return [false, null];
    }

    isIndoorModel(model) {
        if (!this.contents3D.props._3dOptions || !this.contents3D.props._3dOptions.outdoorModel) {
            return false;
        }

        if (model.name === this.contents3D.props._3dOptions.outdoorModel.file) {
            return false;
        }

        return true;
    }

    changeViewMode(model, xRayView) {
        this.contents3D.siteOutdoorModels = xRayView ? this.siteOutdoorModelsXray : this.siteOutdoorModelsNormal;
        this.contents3D.internalModels = xRayView ? this.internalModelsXray : this.internalModelsNormal;

        if (model.userData.pair && model.userData.pair.userData.pair) {
            if (xRayView !== model.userData.xrayMode) {
                XRayManager.changeViewModel(model);
            }
            else {
                XRayManager.changeViewModel(model.userData.pair);
            }

            return true;
        }

        return false;
    }

    static changeViewModel(model) {
        model.userData.pair.visible = true;
        model.visible = false;
    }

    toggleViewMode(xRayView) {
        if (this.contents3D.isIndoor()) {
            this.changeViewMode(this.contents3D.currentModel, xRayView);
        }
        else {
            const outdoorModels = this.contents3D.siteOutdoorModels[this.contents3D.props._3dOptions.siteID];

            if (outdoorModels) {
                for (const model of outdoorModels) {
                    this.changeViewMode(model, xRayView);
                }
            }
        }
    }
}