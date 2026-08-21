export class HistoryJsonManager {
    static makeRequestDetectHistories(facilityType, buildingGroupID, buildingID, zoneID, beginTime, endTime, rowCount, campusID) {
        const json = {
            "facilityType": facilityType,
            "buildingGroupID": buildingGroupID,
            "buildingID": buildingID,
            "zoneID": zoneID,
            "beginTime": beginTime,
            "endTime": endTime,
            "rowCount": rowCount,
            "campusID": campusID
        };

        return JSON.stringify(json);
    }

    static makeUpdateDetectHistoryMemo(sensorZoneHistoryID, memo) {
        const json = {
            "sensorZoneHistoryID": sensorZoneHistoryID,
            "memo": memo
        };

        return JSON.stringify(json);
    }

    static makeRequestDetectAnalysis(facilityType, buildingGroupID, buildingID, zoneID, beginTime, endTime, campusID) {
        const json = {
            "facilityType": facilityType,
            "buildingGroupID": buildingGroupID,
            "buildingID": buildingID,
            "zoneID": zoneID,
            "beginTime": beginTime,
            "endTime": endTime,
            "campusID": campusID
        };

        return JSON.stringify(json);
    }
}