import ProjectResource from "../../Root/resource/id";
import { HistoryJsonManager } from "./historyJsonManager";

export class HistoryController {
    static async requestDetectHistories(facilityType, buildingGroupID, buildingID, zoneID, beginTime, endTime, rowCount, campusID) {
        try {
            const jsonData = HistoryJsonManager.makeRequestDetectHistories(facilityType, buildingGroupID, buildingID, zoneID, beginTime, endTime, rowCount, campusID);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/History/RequestSensorDetectHistories', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.sensorDetectHistoryDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestDetectHistories 실패"];
    }

    static async updateDetectHistoryMemo(sensorZoneHistoryID, memo) {
        try {
            const jsonData = HistoryJsonManager.makeUpdateDetectHistoryMemo(sensorZoneHistoryID, memo);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/History/UpdateSensorDetectHistoryMemo', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.success, result.message];
            }
        }
        catch (e) {
            console.log(e);
        }

        return [false, "updateDetectHistoryMemo 실패"];
    }

    static async requestDetectAnalysis(facilityType, buildingGroupID, buildingID, zoneID, beginTime, endTime, campusID) {
        try {
            const jsonData = HistoryJsonManager.makeRequestDetectAnalysis(facilityType, buildingGroupID, buildingID, zoneID, beginTime, endTime, campusID);

            const res = await fetch(ProjectResource.baseUrl + '/SDMS/History/RequestSensorDetectAnalysis', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestDetectAnalysis 실패"];
    }
}