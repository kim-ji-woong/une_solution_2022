import JsonManager from "./jsonManager";
import { beaconHeaders } from "../../Root/apiToken";

// WonikBeaconServer 주소 (원익 현장 서버). 배포 환경마다 달라지므로 언젠가 appsettings.json 으로 옮기는 게 맞다.
// 지금은 sdmsController.js 에도 같은 주소가 하드코딩되어 있으니 함께 고쳐야 한다.
// 이력 화면에서 BeaconServer 를 부르는 건 제한속도(수집 서버의 기록 기준값) 하나뿐이다.
const BEACON_URL = 'http://10.6.13.71:2420';

// BeaconServer 호출 공통 처리.
//   - 응답이 오면 그대로 돌려준다. (서버가 success / message 를 담아 준다)
//   - 연결 실패 / 타임아웃 / HTTP 오류는 "왜" 실패했는지 message 에 담아 돌려준다.
//   - 타임아웃이 없으면 서버에 닿지 못할 때 OS 의 TCP 연결 타임아웃(20초 이상)만큼 그대로 멈춘다.
async function beaconPost(path, body, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(BEACON_URL + path, {
            method: 'post',
            headers: beaconHeaders(),
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal
        });

        if (res.ok) {
            return await res.json();
        }

        return {
            success: false,
            message: 'BeaconServer 응답 오류 (HTTP ' + res.status + ' · ' + BEACON_URL + ')'
        };
    }
    catch (e) {
        const timedOut = (e && e.name === 'AbortError');

        return {
            success: false,
            message: timedOut
                ? ('BeaconServer(' + BEACON_URL + ') 응답이 ' + Math.round(timeoutMs / 1000) + '초 안에 오지 않았습니다.')
                : ('BeaconServer(' + BEACON_URL + ')에 연결하지 못했습니다. 서버 구동 상태와 네트워크를 확인하세요.')
        };
    }
    finally {
        clearTimeout(timer);
    }
}

// 과속 이력 / 속도감지 센서 목록 - WebSOPApp 서버가 DB 에서 직접 조회한다.
//   (Areas/History/Controllers/SpeedDetectionController.cs)
//   응답 형태는 예전 BeaconServer API 와 같다: { success, message, speedDetectionDatas | sensors }
async function speedDetectionPost(action, body) {
    try {
        const res = await fetch('History/SpeedDetection/' + action, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (res.ok) {
            return await res.json();
        }

        return {
            success: false,
            message: '과속 이력 조회 실패 (HTTP ' + res.status + ')'
        };
    }
    catch (e) {
        return {
            success: false,
            message: '과속 이력 조회 실패 : ' + (e && e.message ? e.message : e)
        };
    }
}

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

    static async GetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, justOneType) {
        try {
            const jsonData = JsonManager.makeRequestGetMinMaxIndex(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, justOneType);

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

    static async DisplaySensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteID, justOneType) {
        try {
            const jsonData = JsonManager.makeRequestSensorDetectHistories(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, lastSensorZoneHistoryID, rowCount, isDesc, siteID, justOneType);

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

    static async DisplaySensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteID, justOneType) {
        try {
            const jsonData = JsonManager.makeRequestSensorDetectAnalysis(beginTime, endTime, facilityType, buildingGroupID, buildingID, zoneID, siteID, justOneType);

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

    // 과속 기준 속도(km/h). BeaconServer 의 appsettings.json(SpeedDetection:SpeedLimit)에서 온다.
    // 감지 로직과 화면이 같은 기준을 쓰도록 값을 프론트에 두지 않고 서버에서 받아 쓴다.
    static async requestWonikSpeedLimit() {
        const result = await beaconPost('/Detection/RequestSpeedLimit', null, 15000);

        if (result && result.success === true)
            return result.speedLimit;

        return null;
    }

    static async requestWonikSpeedDetectionSensors() {
        return await speedDetectionPost('RequestSpeedDetectionSensors', null);
    }

    static async requestWonikSpeedDetectionHistorys(beginDate, endDate, sensorID) {
        return await speedDetectionPost('RequestSpeedDetectionHistories',
            { BeginDate: beginDate, EndDate: endDate, SensorID: sensorID });
    }
}