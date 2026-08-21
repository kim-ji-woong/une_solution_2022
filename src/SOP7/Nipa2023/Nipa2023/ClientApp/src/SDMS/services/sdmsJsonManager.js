export class SdmsJsonManager {
    static makeRequestSensorList(campusID) {
        const json = {
            "requestFireSensors": true,
            "requestGasSensors": true,
            "requestAtmosphereSensors": true,
            "requestEmergencyBells": true,
            "requestWorkerTags": true,
            "requestThermalCCTVs": true,
            "requestCCTVs": true,
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestAtmosphereSensorInfo(sensorID) {
        const json = {
            "sensorID": sensorID
        };

        return JSON.stringify(json);
    }

    static makeRequestGasSensorInfo(sensorID) {
        const json = {
            "sensorID": sensorID
        };

        return JSON.stringify(json);
    }

    static makeRequestBuildingGroupList(campusID) {
        /*let siteIDs = [];

        if (siteData && Array.isArray(siteData)) {
            siteIDs = siteData;
        }
        else {
            siteIDs.push(siteData);
        }*/

        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestZoneList(campusID) {
        /*let siteIDs = [];

        if (siteData && Array.isArray(siteData)) {
            siteIDs = siteData;
        }
        else {
            siteIDs.push(siteData);
        }*/

        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestZoneData(zoneID) {
        const json = {
            "zoneID": zoneID
        };

        return JSON.stringify(json);
    }

    static makeRequestSaveViewport(zoneID, cameraLocationX, cameraLocationY, cameraLocationZ, cameraRotationX, cameraRotationY, cameraRotationZ) {
        const json = {
            "zoneID": zoneID,
            "cameraPositionX": cameraLocationX,
            "cameraPositionY": cameraLocationY,
            "cameraPositionZ": cameraLocationZ,
            "cameraRotationX": cameraRotationX,
            "cameraRotationY": cameraRotationY,
            "cameraRotationZ": cameraRotationZ
        };

        return JSON.stringify(json);
    }

    static makeRequestTodayAlarmData() {
        const json = {
        };

        return JSON.stringify(json);
    }

    static makeRequestPastAlarmData(days) {
        const date = new Date();
        const endDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

        date.setDate(date.getDate() - (days - 1));
        const beginDate = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

        const json = {
            "beginDate": beginDate,
            "endDate": endDate
        };

        return JSON.stringify(json);
    }

    static makeRequestPeriodAlarmData(beginYear, beginMonth, beginDay, endYear, endMonth, endDay) {
        const beginDate = beginYear * 10000 + beginMonth * 100 + beginDay;
        const endDate = endYear * 10000 + endMonth * 100 + endDay;

        const json = {
            "beginDate": beginDate,
            "endDate": endDate
        };

        return JSON.stringify(json);
    }

    static makeRequestCampusList() {
        const json = {
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityList(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestFacilityData(facilityID) {
        const json = {
            "facilityID": facilityID
        };

        return JSON.stringify(json);
    }

    static makeRequestMESData(campusID, mesType) {
        const json = {
            "campusID": campusID,
            "type": mesType
        };

        return JSON.stringify(json);
    }

    static makeRequestMESEquipmentData(equipmentIDs) {
        const json = {
            "equipmentIDs": equipmentIDs
        };

        return JSON.stringify(json);
    }

    static makeRequestClearAlarm(sensorZoneID, sensorZoneHistoryID, accessedUserID, memo, isMalfunction) {
        const json = {
            "sensorZoneID": sensorZoneID,
            "sensorZoneHistoryID": sensorZoneHistoryID,
            "accessedUserID": accessedUserID,
            "memo": memo,
            "isMalfunction": isMalfunction
        };

        return JSON.stringify(json);
    }

    static makeRequestCampusData(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestAPStatistics(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestWorkerStatistics(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestAPList(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestWorkerList(campusID) {
        const json = {
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeRequestStreamServerURL() {
        const json = {
        };

        return JSON.stringify(json);
    }

    static makeRequestSituationNotice(sensorType, sensorZoneID) {
        const json = {
            "sensorType": sensorType,
            "sensorZoneID": sensorZoneID
        };

        return JSON.stringify(json);
    }

    static makeRequestRealSensorData(targetTypeID, currentTypeID, sensorID, zoneID) {
        const json = {
            "targetTypeID": targetTypeID,
            "currentTypeID": currentTypeID,
            "sensorID": sensorID,
            "zoneID": zoneID
        };

        return JSON.stringify(json);
    }
}