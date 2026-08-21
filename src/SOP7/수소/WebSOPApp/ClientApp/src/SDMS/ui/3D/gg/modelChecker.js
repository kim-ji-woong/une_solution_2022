import ProjectResource from "../../../../Root/resource/id";

// 경기도 Model 제어를 위한 클래스
export class ModelChecker {
    static targetModelName = "gg_ggc.glb";

    static checkOutdoorModel(modelNode) {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo?.siteID) {
            const modelName = modelNode.name;

            if (modelName === ModelChecker.targetModelName && userInfo.siteID >= ProjectResource.Site.GG_B && userInfo.siteID < ProjectResource.Site.GG_H) {
                ModelChecker.checkSiteModel(userInfo, modelNode);
            }
            // 임시코드(신용보증재단 모델을 사용하게 되면 없앨것)
            else if (modelName === ModelChecker.targetModelName && userInfo.siteID === ProjectResource.Site.GG_A) {
                ModelChecker.checkSiteModel(userInfo, modelNode);
            }
        }
    }

    static checkSiteModel(userInfo, modelNode) {
        const siteTags = ModelChecker.getSiteTags(userInfo.siteID);

        // 특정 입주기관(사이트)의 사용자는 자신의 건물만 보이도록 한다.
        if (siteTags) {
            for (const childModel of modelNode.children) {
                for (let i = childModel.children.length - 1; i >= 0;i--) {
                    const floorModel = childModel.children[i];
                    let find = false;

                    for (const tag of siteTags) {
                        if (floorModel.name.startsWith(tag)) {
                            find = true;
                            break;
                        }
                    }

                    if (!find) {
                        childModel.remove(floorModel);
                        //floorModel.visible = false;
                    }
                }
            }
        }
    }

    static setSiteBuildings(scene) {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo?.siteID) {
            if (userInfo.siteID >= ProjectResource.Site.GG_B && userInfo.siteID < ProjectResource.Site.GG_H) {
                for (const child of scene.children) {
                    if (child.name === ModelChecker.targetModelName) {
                        ModelChecker.checkSiteModel(userInfo, child);
                        return;
                    }
                }
            }
        }
    }

    static getSiteTags(siteID) {
        if (siteID === ProjectResource.Site.GG_B) {
            // 도청
            return ["A1", "A2", "A3"];
        }
        else if (siteID === ProjectResource.Site.GG_D) {
            // 도서관
            return ["A4"];
        }
        else if (siteID === ProjectResource.Site.GG_F) {
            // 신용보증재단
            return ["A5"];
        }
        else if (siteID === ProjectResource.Site.GG_A) {
            // 종합방재실
            // null을 사용해야 하는데 모델에서 신용보증재단을 안보이게 하기 위해 일부러 이렇게 사용
            return ["A1", "A2", "A3", "A4"];
        }

        return null;
    }

    static onChangeSite(siteID, indoorModels, scene) {
        if (!scene) {
            return;
        }

        if (isNaN(siteID)) {
            return;
        }

        let indoorModelName = null;

        for (const modelName in indoorModels) {
            const indoorModel = indoorModels[modelName];
            indoorModelName = indoorModel.file;
            break;
        }

        if (siteID === ProjectResource.Site.GG_A) {
            // 종합방재실
            ModelChecker.showBuildings(null, indoorModelName, scene);
        }
        else {
            const buildingTags = ModelChecker.getSiteTags(siteID);

            if (buildingTags) {
                ModelChecker.showBuildings(buildingTags, indoorModelName, scene);
            }
        }
    }

    static showBuildings(buildingTags, indoorModelName, scene) {
        for (const child of scene.children) {
            if (child.name === indoorModelName) {
                if (child.children.length > 0) {
                    ModelChecker.showBuildingModels(buildingTags, child.children[0].children);
                }
                return;
            }
        }
    }

    static showBuildingModels(tags, children) {
        for (const child of children) {
            if (tags === null) {
                child.visible = true;
            }
            else {
                let visible = false;

                for (const tag of tags) {
                    if (child.name.startsWith(tag)) {
                        visible = true;
                        break;
                    }
                }

                child.visible = visible;
            }
        }
    }
}