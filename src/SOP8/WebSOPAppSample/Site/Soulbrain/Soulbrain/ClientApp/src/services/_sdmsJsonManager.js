export class _SdmsJsonManager {
    static makeRequestPsmSensors(rowCount) {
        const json = {
            "rowCount": rowCount
        };

        return JSON.stringify(json);
    }

    static makeRequestPsmLinkedSop(psmSensorID) {
        const json = {
            "psmSensorID": psmSensorID
        };

        return JSON.stringify(json);
    }
}