export class GghJsonManager {
    static makeRequestNvrList() {
        const json = {
            "requestNvrList": true
        };

        return JSON.stringify(json);
    }

    static makeUpdateNvrList(nvrList) {
        const json = {
            "requestUpdateNvrList": {
                "updateList": nvrList
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEvacuations() {
        const json = {
            "requestEvacuations": true
        };

        return JSON.stringify(json);
    }

    static makeRequestAlarmNEvacuations() {
        const json = {
            "requestAlarmNEvacuations": true
        };

        return JSON.stringify(json);
    }

    static makeRequestCCTVList(siteID) {
        const json = {
            "requestCCTVList": {
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeUpdateCCTVList(cctvList) {
        const json = {
            "updateCCTVList": {
                "cctvList": cctvList
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestParkingGateList(siteID) {
        const json = {
            "requestParkingGateList": {
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

    static makeRequestExitList(siteID) {
        const json = {
            "requestExitList": {
                "siteID": siteID
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

    static makeRequestUpsStatus(siteID) {
        const json = {
            "requestUPSStatus": {
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEarthquakeHistory(quaterNo) {
        const json = {
            "requestEarthquakeHistory": {
                "quaterNo": quaterNo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestLastEarthquake() {
        const json = {
            "requestLastEarthquake": true
        };

        return JSON.stringify(json);
    }

    static makeRequestFirstAidEquipmentList(siteID) {
        const json = {
            "requestFirstAidEquipmentList": {
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestNewFirstAidEquipment(sensorType) {
        const json = {
            "requestNewFirstAidEquipment": {
                "sensorType": sensorType
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDeleteSensors(sensors) {
        const json = {
            "requestDeleteSensors": {
                "sensors": GghJsonManager.getDeleteSensors(sensors)
            }
        };

        return JSON.stringify(json);
    }

    static getDeleteSensors(sensors) {
        const json = [];

        for (const sensor of sensors) {
            json.push(
                {
                    "id": sensor.id,
                    "sensorType": sensor.sensorType
                }
            );
        }

        return json;
    }
}
