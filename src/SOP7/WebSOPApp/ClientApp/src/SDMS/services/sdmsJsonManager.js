export class SdmsJsonManager {   
    static makeRequestBuildingGroupList(siteData) {
        let siteIDs = null;
        if (siteData?.length > 0) {
            siteIDs = siteData;
        }

        const json = {
            "requestBuildingGroupList": {
                "siteIDs": siteIDs
            }
        };  

        return JSON.stringify(json);
    }

    static makeRequestOuterDatas(siteIDs) {
        const json = {
            "requestOuterDatas":
            {
                "siteIDs": siteIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestIndoorDatas(zoneID, siteIDs) {
        const json = {
            "requestIndoorDatas":
            {
                "zoneID": zoneID,
                "siteIDs": siteIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGltfDataList(userID, siteData) {
        let siteIDs = null;
        if (siteData?.length > 0) {
            siteIDs = siteData;
        }

        const json = {
            "requestGltfDataList": {
                "userID": userID,
                "siteIDs": siteIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGltfDataList2(userID, siteData) {
        let siteIDs = null;
        if (siteData?.length > 0) {
            siteIDs = siteData;
        }

        const json = {
            "userID": userID,
            "siteIDs": siteIDs
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveViewport(modelName, modelFile, camera, modelDisplayText, buildingGroupID, buildingID, zoneID) {
        const json = {
            "requestSaveViewport":
            {
                "modelName": modelName,
                "modelFile": modelFile,
                "modelDisplayText": modelDisplayText,
                "buildingGroupID": buildingGroupID,
                "buildingID": buildingID,
                "zoneID": zoneID,
                "cameraPosition":
                {
                    x: camera.position[0],
                    y: camera.position[1],
                    z: camera.position[2]
                },
                "cameraQuaternion":
                {
                    x: camera.quaternion[0],
                    y: camera.quaternion[1],
                    z: camera.quaternion[2],
                    w: camera.quaternion[3]
                },
                "cameraRotation":
                {
                    x: camera.rotation[0],
                    y: camera.rotation[1],
                    z: camera.rotation[2]
                },
                "orbitTarget":
                {
                    x: camera.targetControl[0],
                    y: camera.targetControl[1],
                    z: camera.targetControl[2]
                },
                "fov": camera.fov,
                "near": camera.near,
                "far": camera.far,
                "floorIndex": null
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestMoveBuildingNameText(buildingGroupName, buildingName, x, y, z) {
        const json = {
            "requestMoveBuildingNameText":
            {
                "buildingGroupName": buildingGroupName,
                "buildingName": buildingName,
                "x": x,
                "y": y,
                "z": z
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestMoveEquipZoneNameText(equipZoneID, equipZoneName, x, y, z) {
        const json = {
            "requestMoveEquipZoneNameText":
            {
                "equipZoneID": equipZoneID,
                "displayText": equipZoneName,
                "x": x,
                "y": y,
                "z": z
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorList(siteIDs) {
        const json = {
            "requestSensorList":
            {
                "requestFireSensors": true,
                "requestPSMSensors": true,
                "requestEtcSensors": true,
                "requestCCTVs": true,
                "requestEarthquakeSensors": true,
                "requestStrongWindSensors": true,
                "requestEnvironmentSensors": true,
                "requestManufactureSensors": true,
                "requestEmergencyBellSensors": true,
                "requestLaserSensors": true,
                "requestDoorSensors": true,
                "requestLowBatterySensors": true,
                "requestSpeedDetectionSensors": true,
                "siteIDs": siteIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestPageSensorList(siteIDs, sensorType, enabled, searchText, pageItemCount, pageIndex) {
        const json = {
            "requestSensorList":
            {
                "requestFireSensors": SdmsJsonManager.isSensorType(sensorType, "fire"),
                "requestPSMSensors": SdmsJsonManager.isSensorType(sensorType, "psm"),
                "requestEtcSensors": SdmsJsonManager.isSensorType(sensorType, "etc"),
                "requestCCTVs": SdmsJsonManager.isSensorType(sensorType, "cctv"),
                "requestEarthquakeSensors": SdmsJsonManager.isSensorType(sensorType, "earthquake"),
                "requestStrongWindSensors": SdmsJsonManager.isSensorType(sensorType, "strongwind"),
                "requestEnvironmentSensors": SdmsJsonManager.isSensorType(sensorType, "environment"),
                "requestManufactureSensors": SdmsJsonManager.isSensorType(sensorType, "manufacture"),
                "requestEmergencyBellSensors": SdmsJsonManager.isSensorType(sensorType, "emergencybell"),
                "requestLaserSensors": SdmsJsonManager.isSensorType(sensorType, "laser"),
                "requestDoorSensors": SdmsJsonManager.isSensorType(sensorType, "door"),
                "siteIDs": siteIDs,
                "enabled": enabled,
                "searchText": searchText,
                "pageItemCount": pageItemCount,
                "pageIndex": pageIndex
            }
        };

        return JSON.stringify(json);
    }

    static isSensorType(srcSensorType, trgSensorType) {
        if (srcSensorType === null) {
            return true;
        }

        return srcSensorType.toLowerCase() === trgSensorType;
    }

    static makeRequestSensor(sensorType, sensorID, x, z) {
        const json = {
            "requestMoveSensor":
            {
                "SensorType": sensorType,
                "SensorID": sensorID,
                "x": x,
                "z": z
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestMalfunction(sensorType, sensorZoneID, accessedUserID, isMalfunction) {
        const json = {
            "requestMalfunction":
            {
                "sensorType": sensorType,
                "sensorZoneID": sensorZoneID,
                "accessedUserID": accessedUserID,
                "isMalfunction": isMalfunction
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSituationNotice(sensorType, sensorZoneID) {
        const json = {
            "requestSituationNotice":
            {
                "sensorType": sensorType,
                "sensorZoneID": sensorZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestManualReport(dateTime, sensorType, sensorZoneID, zoneID, alarmDepth, reportPerson, memo) {
        const json = {
            "requestManualReport":
            {
                "dateTime": dateTime,
                "sensorType": sensorType,
                "sensorZoneID": sensorZoneID,
                "zoneID": zoneID,
                "alarmDepth": alarmDepth,
                "reportPerson": reportPerson,
                "memo": memo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestClearManualReport(sensorType, sensorZoneID, sensorZoneHistoryID, accessedUserID) {
        const json = {
            "requestClearManualReport":
            {
                "sensorType": sensorType,
                "sensorZoneID": sensorZoneID,
                "sensorZoneHistoryID": sensorZoneHistoryID,
                "accessedUserID": accessedUserID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAllClearReport(sensorType) {
        const json = {
            "requestAllClearReport":
            {
                "sensorType": sensorType
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneCCTV(EquipZoneID) {
        const json = {
            "requestEquipZoneCCTV":
            {
                "equipZoneID": EquipZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneCCTVListFromSensor(sensorType, sensorID) {
        const json = {
            "requestEquipZoneCCTVFromSensor":
            {
                "sensorType": sensorType,
                "sensorID": sensorID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneSensorList(sensorType, sensorID) {
        const json = {
            "requestEquipZoneSensorList":
            {
                "sensorType": sensorType,
                "sensorID": sensorID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateEquipZoneCCTVs(equipZoneCCTVs) {
        const datas = [];

        for (const equipZoneID in equipZoneCCTVs) {
            const cctvList = equipZoneCCTVs[equipZoneID];
            const cctvCount = cctvList.length;

            datas.push({
                "equipZoneID": equipZoneID,
                "cctV1": cctvCount > 0 ? cctvList[0] : null,
                "cctV2": cctvCount > 1 ? cctvList[1] : null,
                "cctV3": cctvCount > 2 ? cctvList[2] : null,
                "cctV4": cctvCount > 3 ? cctvList[3] : null,
                "cctV5": cctvCount > 4 ? cctvList[4] : null,
                "cctV6": cctvCount > 5 ? cctvList[5] : null
            });
        }

        const json = {
            "requestUpdateEquipZoneCCTVs":
            {
                "equipZoneCCTVs": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetOrgSensorID(sensorZoneID) {
        const json = {
            "requestGetOrgSensorID":
            {
                "SensorZoneID": sensorZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorCount(selectSiteID) {
        const json = {
            "requestSensorCount": 
            {
                "SiteID": selectSiteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestStreamServerURL() {
        const json = {
            "requestStreamServerURL": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityTypes() {
        const json = {
            "requestFacilityTypes": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityType(FacilityTypeID) {
        const json = {
            "requestFacilityType":
            {
                "facilityTypeID": FacilityTypeID
            }
        };

        return JSON.stringify(json);
    }

    // 옵션 요청
    static makeRequestGetOption(UserID, Category) {
        const json = {
            "requestOption":
            {
                "userID": UserID,
                "category": Category

            }
        }
        return JSON.stringify(json);
    }

    static makeRequestSaveOption(ID, UserID, Category, SubCategory, PropertyValue1, PropertyValue2, PropertyValue3, PropertyValue4) {
        const json = {
            "requestSaveOption":
            {
                'saveOption': {
                    "id": ID,
                    "userID": UserID,
                    "category": Category,
                    "subCategory": SubCategory,
                    "propertyValue1": PropertyValue1,
                    "propertyValue2": PropertyValue2,
                    "propertyValue3": PropertyValue3,
                    "propertyValue4": PropertyValue4,
                }
            }
        }
        return JSON.stringify(json);
    }

    static makeRequestUpdatePOIPosition(userID, sensorType, zoneID, sensorID, x, y, z) {
        const json = {
            "requestUpdatePOIPosition":
            {
                "userID": userID,
                "sensorType": sensorType,
                "zoneID": zoneID,
                "sensorID": sensorID,
                "position":
                {
                    x: x,
                    y: y,
                    z: z
                }
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdatePOIPositions(userID, sensorPositions) {
        const positions = [];
        const dataCount = sensorPositions.length;

        for (let i = 0; i < dataCount; i++) {
            const sensorData = sensorPositions[i];

            positions.push({
                "userID": userID,
                "sensorType": sensorData.sensorType,
                "zoneID": sensorData.zoneID,
                "sensorID": sensorData.sensorID,
                "position":
                {
                    x: sensorData.x,
                    y: sensorData.y,
                    z: sensorData.z
                },
                "text": sensorData.text
            });
        }

        const json = {
            "requestUpdatePOIPositions":
            {
                "datas": positions
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateCCTVs(userID, datas) {
        const updateDatas = [];
        const dataCount = datas.length;

        for (let i = 0; i < dataCount; i++) {
            const [cctvID, zoneID, x, y, z] = datas[i];

            updateDatas.push({
                id: cctvID,
                zoneID: zoneID,
                x: x,
                y: y,
                z: z
            });
        }

        const json = {
            "requestUpdateCCTVs":
            {
                "userID": userID,
                "updateCCTVs": updateDatas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityInfoData(modelName) {
        const json = {
            "requestFacilityInfoData":
            {
                "modelName": modelName
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAllFacilityInfo() {        
        const json = {
            "requestAllFacilityInfo": true
        };

        return JSON.stringify(json);
    }

    static makeRequestBuildingData(buildingName) {
        const json = {
            "requestBuildingData":
            {
                "buildingName": buildingName
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestBuildingGroupData(buildingGroupID) {
        const json = {
            "requestBuildingGroupData":
            {
                "buildingGroupID": buildingGroupID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveIndoorModelViewport(modelName, cameraData, zoneID, userID) {
        const json = {
            "requestSaveIndoorModelViewport":
            {
                "userID": userID,
                "modelName": modelName,
                "cameraPosition": {
                    x: cameraData.pos.x,
                    y: cameraData.pos.y,
                    z: cameraData.pos.z
                },
                "cameraQuaternion": {
                    x: cameraData.quaternion.x,
                    y: cameraData.quaternion.y,
                    z: cameraData.quaternion.z,
                    w: cameraData.quaternion.w
                },
                "cameraRotation": {
                    x: cameraData.rotation.x,
                    y: cameraData.rotation.y,
                    z: cameraData.rotation.z
                },
                "orbitTarget": {
                    x: cameraData.orbitTarget.x,
                    y: cameraData.orbitTarget.y,
                    z: cameraData.orbitTarget.z
                },
                "zoneID": zoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveOrthoModelViewport(modelName, cameraData, zoneID, userID) {
        const json = {
            "requestSaveOrthoModelViewport":
            {
                "userID": userID,
                "modelName": modelName,
                "cameraPosition": {
                    x: cameraData.pos.x,
                    y: cameraData.pos.y,
                    z: cameraData.pos.z
                },
                "cameraQuaternion": {
                    x: cameraData.quaternion.x,
                    y: cameraData.quaternion.y,
                    z: cameraData.quaternion.z,
                    w: cameraData.quaternion.w
                },
                "cameraRotation": {
                    x: cameraData.rotation.x,
                    y: cameraData.rotation.y,
                    z: cameraData.rotation.z
                },
                "target": {
                    x: cameraData.target.x,
                    y: cameraData.target.y,
                    z: cameraData.target.z
                },
                "zoom": cameraData.zoom,
                "zoneID": zoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestWeatherInfo() {
        const json = {
            "requestWeatherInfo": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFakeWalls(zoneID) {
        const json = {
            "requestFakeWalls":
            {
                "zoneID": zoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateFakeWall(userID, fakeWall, id, zoneID, mode) {
        const json = {
            "requestUpdateFakeWall":
            {
                "userID": userID,
                "fakeWallID": id,
                "zoneID": zoneID,
                "x": fakeWall.position.x,
                "y": fakeWall.position.y,
                "z": fakeWall.position.z,
                "rotate": fakeWall.rotation.y,
                "scale": fakeWall.scale.x,
                "mode": mode
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateFakeWalls(userID, fakeWallDatas) {
        const datas = [];
        const dataCount = fakeWallDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const fakeWallData = fakeWallDatas[i];
            const fakeWall = fakeWallData.fakeWall;

            datas.push({
                "userID": userID,
                "fakeWallID": fakeWallData.id,
                "zoneID": fakeWallData.zoneID,
                "x": fakeWall.position.x,
                "y": fakeWall.position.y,
                "z": fakeWall.position.z,
                "rotate": fakeWall.rotation.y,
                "scale": fakeWall.scale.x,
                "mode": fakeWallData.mode
            });
        }

        const json = {
            "requestUpdateFakeWalls":
            {
                "updateDatas": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewCCTVList() {
        const json = {
            "requestNewCCTVList": true
        };

        return JSON.stringify(json);
    }


    static makeRequestTodayAlarmData() {
        const json = {
            "requestTodayAlarmData": true
        };

        return JSON.stringify(json);
    }

    static makeRequestGetSiteID() {
        const json = {
            "requestGetSiteID": true
        };

        return JSON.stringify(json);
    }

    static makeRequestMaterials() {
        const json = {
            "requestMaterials": true
        };

        return JSON.stringify(json);
    }

    static makeRequestRangeSensors() {
        const json = {
            "requestRangeSensors": true
        };

        return JSON.stringify(json);
    }

    static makeRequestImagePath(zoneID) {
        const json = {
            "requestImagePath": {
                "ZoneID": zoneID
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestWorkerInfos() {
        const json = {
            "requestWorkerInfos": true
        };

        return JSON.stringify(json);
    }

    static makeRequestWonikEquipZoneMembers(equipZoneID) {
        const json = {
            "requestEquipZoneMembers": {
                "equipZoneID": equipZoneID
            }
        }

        return JSON.stringify(json);
    }

    static makeRequestUpdateEquipZoneAreas(userID, equipZoneAreaDatas) {
        const datas = [];
        const dataCount = equipZoneAreaDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const equipZoneAreaData = equipZoneAreaDatas[i];

            datas.push({
                "userID": userID,
                "zoneID": equipZoneAreaData.zoneID,
                "equipZoneID": equipZoneAreaData.equipZoneID,
                "lines": equipZoneAreaData.lines,
                "mode": equipZoneAreaData.mode
            });
        }

        const json = {
            "requestUpdateEquipZoneAreas":
            {
                "updateDatas": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEquipZoneAreas(zoneID) {
        const json = {
            "requestEquipZoneAreas":
            {
                "zoneID": zoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateSensorEquipZones(userID, sensorEquipZoneDatas) {
        const datas = [];
        const dataCount = sensorEquipZoneDatas.length;

        for (let i = 0; i < dataCount; i++) {
            const data = sensorEquipZoneDatas[i];

            datas.push({
                "userID": userID,
                "sensorType": data.sensorType,
                "sensorID": data.sensorID,
                "equipZoneID": data.equipZoneID,
                "zoneID": data.zoneID
            });
        }

        const json = {
            "requestUpdateSensorEquipZones":
            {
                "updateDatas": datas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetAlarmMemos(sensorZoneHistoryIDs) {
        const json = {
            "requestGetAlarmMemos":
            {
                "SensorZoneHistoryIDs": sensorZoneHistoryIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestYearStatus() {
        const json = {
            "requestYearStatus": true
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateSensorCoordinatesFor2D(sensorType, sensorID, x, y) {
        const json = {
            "requestUpdateSensorCoordinatesFor2D":
            {
                "sensorType": sensorType,
                "sensorID": sensorID,
                "x": x,
                "y": y
            }
        };
        return JSON.stringify(json);
    }
    
    static makeRequestUpdateSensorsFor2D(modifiedSensors) {
        
        let datas = [];
        const dataCount = modifiedSensors?.length;
        
        for (let i = 0; i < dataCount; i++) {
            const data = modifiedSensors[i];
            
            datas.push({
                "id": data.id,
                "name": data.name,
            });
        }
        
        const json = {
            "requestUpdateSensorsFor2D":
            {
                "updateDatas": datas
            }
        };
        
        return JSON.stringify(json);
    }

    static makeRequestElevators(siteID) {
        const json = {
            "requestElevators":
            {
                "siteID": siteID
            }
        };
        return JSON.stringify(json);
    }

    static makeRequestAlarmData(sensorZoneHistoryID) {
        const json = {
            "requestAlarmData": {
                "sensorZoneHistoryID": sensorZoneHistoryID
            }
        };
        return JSON.stringify(json);
    }

    static makeUpdateSensorEnabled(enabledSensorDatas, disabledSensorDatas) {
        const json = {
            "updateSensorEnabled": {
                "enabledSensors": enabledSensorDatas,
                "disabledSensors": disabledSensorDatas
            }
        };
        return JSON.stringify(json);
    }

    static makeRequestAllDoors(siteID) {
        const json = {
            "requestAllDoors": {
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDoorStatus(siteID) {
        const json = {
            "requestDoorStatus": {
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }
}