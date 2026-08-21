import JsonManager from "./jsonManager";

export default class HistoryController {
    static async DisplayUserHistories(beginTime, endTime, siteID) {
        try {
            const jsonData = JsonManager.makeRequestUserHistories(beginTime, endTime, siteID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.userHistoryDatas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async GetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID) {
        try {
            const jsonData = JsonManager.makeRequestGetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                const minID = result.minReactionHistoryID;
                const maxID = result.maxReactionHistoryID;

                return [minID, maxID];
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplaySensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteID) {
        try {
            const jsonData = JsonManager.makeRequestSensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.sensorDetectHistoryDatas, result.lastSensorReactionHistoryID];
            }
        } catch (e) {
            console.log(e);
            return [null, null]
        }
    }

    static async DisplaySensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteID) {
        try {
            const jsonData = JsonManager.makeRequestSensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplaySOPHistories(beginTime, endTime, siteID) {
        try {
            const jsonData = JsonManager.makeRequestSOPHistories(beginTime, endTime, siteID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.sopHistoryDatas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplaySOPComponentHistories(actionStepHistoryID) {
        try {
            const jsonData = JsonManager.makeRequestSOPComponentHistories(actionStepHistoryID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.sopComponentHistoryDatas;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async LoadDisasterCategories(siteID) {
        try {
            const jsonData = JsonManager.makeRequestDisasterCategories(siteID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.disasterCategories;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async UpdateAlarmMemo(sensorZoneHistoryID, memo) {
        try {
            const jsonData = JsonManager.makeRequestUpdateAlarmMemo(sensorZoneHistoryID, memo);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result;
            }
        } catch (e) {
            console.log(e);
        }
    }


    static async DisplayAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, siteID, equipZoneID = null) {
        try {
            const jsonData = JsonManager.makeRequestAssessmentHistories(beginTime, endTime, buildingGroupID, buildingID, zoneID, score, evaluator, siteID, equipZoneID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return result.assessmentHistories;
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async DisplayAssessmentDetail(assessmentID, siteID) {
        try {
            const jsonData = JsonManager.makeRequestAssessmentDetail(assessmentID, siteID);

            const res = await fetch('History/History/RequestData', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();
                return [result.aList, result.memberScores];
            }
        } catch (e) {
            console.log(e);
        }
    }

    static async LoadAssessmentClass(nSiteID) {
        try {
            const jsonData = JsonManager.makeRequestLoadAssessmentClass(nSiteID);

            const res = await fetch('History/History/RequestData', {
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
                    return [result.assessmentClasses, null];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log("ERROR LoadAssessmentClass : " + e);
            return [false, e.message];
        }
    }
}