export default class JsonManager{    
    static makeRequestUserHistories(beginTime, endTime, siteID) {
        const json = {
            "requestUserHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "SiteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, justOneType) {
        const json = {
            "requestGetMinMaxIndex":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "FacilityType": facilityType,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID,
                "JustOneType": justOneType
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteID, justOneType) {
        const json = {
            "requestSensorDetectHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "FacilityType": facilityType,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID,
                "LastSensorZoneHistoryID": lastSensorZoneHistoryID,
                "RowCount": rowCount,
                "IsDesc": isDesc,
                "SiteID": siteID,
                "JustOneType": justOneType
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteID, justOneType) {
        const json = {
            "requestSensorDetectAnalysis":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "FacilityType": facilityType,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID,
                "SiteID": siteID,
                "JustOneType": justOneType
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPHistories(beginTime, endTime, siteID) {
        const json = {
            "requestSOPHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "SiteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSOPComponentHistories(actionStepHistoryID) {
        const json = {
            "requestSOPComponentHistories":
            {
                "ActionStepHistoryID": actionStepHistoryID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDisasterCategories(siteID) {
        const json = {
            "requestDisasterCategories":
            {
                "SiteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateAlarmMemo(sensorZoneHistoryID, memo) {
        const json = {
            "RequestUpdateAlarmMemo":
            {
                "SensorZoneHistoryID": sensorZoneHistoryID,
                "Memo": memo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, siteID, equipZoneID) {
        const json = {
            "RequestAssessmentHistories":
            {
                "BeginTime": beginTime,
                "EndTime": endTime,
                "BuildingGroupID": buildingGroupID,
                "BuildingID": buildingID,
                "ZoneID": zoneID,
                "Score": score,
                "Evaluator": evaluator,
                "SiteID": siteID,
                "EquipZoneID": equipZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAssessmentDetail(assessmentID, siteID) {
        const json = {
            "RequestAssessmentDetail":
            {
                "AssessmentID": assessmentID,
                "SiteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestLoadAssessmentClass(nSiteID) {
        const json = {
            "RequestLoadAssessmentClass":
            {
                "SiteID": nSiteID
            }
        };

        return JSON.stringify(json);
    }
}