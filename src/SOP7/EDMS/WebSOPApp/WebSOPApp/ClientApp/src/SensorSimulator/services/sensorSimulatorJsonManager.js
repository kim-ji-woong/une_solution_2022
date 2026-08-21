export class SensorSimulatorJsonManager {
    static makeRequestSendSensorAlarm(sensorType, sensorTagInfoID, sensorZoneID) {
        const json = {
            "requestSendSensorAlarm": {
                sensorType: sensorType,
                sensorTagInfoID: sensorTagInfoID,
                sensorZoneID: sensorZoneID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestClearSensorAlarm(sensorType, sensorTagInfoID, sensorZoneIDs) {
        const json = {
            "requestClearSensorAlarm": {
                sensorType: sensorType,
                sensorTagInfoID: sensorTagInfoID,
                sensorZoneIDs: sensorZoneIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAlarmList() {
        const json = {
            "requestAlarmList": true
        };

        return JSON.stringify(json);
    }
}