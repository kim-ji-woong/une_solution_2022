export class SdmsDataManager {
    static setZoneSensors(buildingGroupList, outdoorZones, sensorList) {
        const zones = {};

        for (const buildingGroup of buildingGroupList) {
            for (const buildingData of buildingGroup.buildingDatas) {
                for (const zoneData of buildingData.zoneDatas) {
                    zoneData.sensors = {};
                    zones[zoneData.id] = zoneData;
                }
            }
        }

        for (const zoneData of outdoorZones) {
            zoneData.sensors = {};
            zones[zoneData.id] = zoneData;
        }

        const removeKeys = [];

        for (const sensorType in sensorList) {
            const sensors = sensorList[sensorType];

            if (Array.isArray(sensors)) {
                for (const sensor of sensors) {
                    const zoneData = zones[sensor.zoneID];

                    if (zoneData) {
                        let zoneSensors = zoneData.sensors[sensorType];

                        if (!zoneSensors) {
                            zoneSensors = [];
                            zoneData.sensors[sensorType] = zoneSensors;
                        }

                        zoneSensors.push(sensor);
                    }
                }
            }
            else {
                removeKeys.push(sensorType);
            }
        }

        for (const key of removeKeys) {
            delete sensorList[key];
        }
    }
}