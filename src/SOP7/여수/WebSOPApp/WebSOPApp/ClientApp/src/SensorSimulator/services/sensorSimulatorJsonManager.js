export class SensorSimulatorJsonManager {
    static makeRequestSendSensorAlarm(sensorType, sensorTagInfoID, sensorZoneID, alarmLevel, sensorValue) {
        const json = {
            "requestSendSensorAlarm": {
                sensorType: sensorType,
                sensorTagInfoID: sensorTagInfoID,
                sensorZoneID: sensorZoneID,
                alarmLevel: alarmLevel,
                sensorValue: sensorValue
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

    static makeRequestMaterialAlarmDatas() {
        const json = {
            "requestMaterialAlarmDatas": true
        };

        return JSON.stringify(json);
    }
}