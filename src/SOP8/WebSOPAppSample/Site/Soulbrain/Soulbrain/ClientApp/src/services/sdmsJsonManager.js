export class SdmsJsonManager {
    static makeRequestFireSensors(rowCount) {
        const json = {
            "rowCount": rowCount
        };

        return JSON.stringify(json);
    }

    static makeRequestLinkedSop(fireSensorID) {
        const json = {
            "fireSensorID": fireSensorID
        };

        return JSON.stringify(json);
    }
}