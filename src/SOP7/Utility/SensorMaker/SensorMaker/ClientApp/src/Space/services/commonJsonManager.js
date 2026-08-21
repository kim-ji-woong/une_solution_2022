export class CommonJsonManager {
    static makeRequestSaveXML(datas) {
        const json = {
            "requestSaveXML": {
                "bTempSave": datas.bTempSave,
                "userID": datas.loginData.user.id,
                "userName": datas.loginData.user.name,
                "siteName": datas.siteName,
                "sensorTypes": datas.sensorTypes,
                
                "models": datas.models,

                "testBuildingGroupData": datas.buildingGroupList._buildingGroupDatas,
                "testBuildingData": datas.buildingGroupList._buildingDatas,
                "testZoneData": datas.buildingGroupList._zoneDatas,
                "TestEquipmentZoneData": datas.buildingGroupList._equipzoneDatas,
                
                "outdoorZones": datas.outdoorZones,
                "gltfOption": datas.gltfOption,
                "fireSensors": datas.fireSensors,
                "psmSensors": CommonJsonManager.copyPsmSensors(datas.psmSensors),
                "etcSensors": datas.etcSensors,
                "cctvs": datas.cctvSensors,
            }
        };

        return JSON.stringify(json);
    }

    static copyPsmSensors(sensors) {
        const psmSensors = [];

        for (const sensor of sensors) {
            const psmSensor = { ...sensor };

            delete psmSensor.sensorTypeName;
            delete psmSensor.orgSensorID;
            delete psmSensor.tagNo;

            if (psmSensor.equipZoneID === null)
                psmSensor.equipZoneID = -1;

            if (psmSensor.zoneID === null)
                psmSensor.zoneID = -1;

            psmSensors.push(psmSensor);
        }

        return psmSensors;
    }

    static makeRequestOpenTempXML(loginData) {
        const json = {
            "requestOpenTempXML": {
                "userID": loginData.user.id,
                "userName": loginData.user.name
            }
        };

        return JSON.stringify(json);
    }
}