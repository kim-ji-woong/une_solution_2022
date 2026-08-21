import ProjectResource from "../../Root/resource/id";
import { SensorSimulatorJsonManager } from "./sensorSimulatorJsonManager";

export class SensorSimulatorController {
    static async sendAlarm(sensorType, sensorTagInfoID, sensorZoneID, alarmLevel = null, sensorValue = null) {
        console.log("sensorType: " + sensorType + " sensorTagInfoID: " + sensorTagInfoID + " sensorZoneID: " + sensorZoneID + " alarmLevel: " + alarmLevel + " sensorValue: " + sensorValue);
        try {
            const jsonData = SensorSimulatorJsonManager.makeRequestSendSensorAlarm(sensorType, sensorTagInfoID, sensorZoneID, alarmLevel, sensorValue);

            const response = await fetch(ProjectResource.baseUrl + '/SDMS/SensorSimulator/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });
            if (response.ok) {
                console.log(response.url.toString());

                const result = await response.json();

                if (result.success) {
                    return [result, ""];
                }
                else {
                    if (result.message !== null && result.message !== undefined && result.message !== "") {
                        console.log("SensorSimulatorController.sendAlarm() : " + result.message);
                    }
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "sendAlarm 실패"];
    }

    static async clearAlarm(sensorType, sensorTagInfoID, sensorZoneIDs) {
        try {
            const jsonData = SensorSimulatorJsonManager.makeRequestClearSensorAlarm(sensorType, sensorTagInfoID, sensorZoneIDs);

            const response = await fetch(ProjectResource.baseUrl + '/SDMS/SensorSimulator/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return [result.alarmDatas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "sendAlarm 실패"];
    }

    static async requestAlarmList() {
        try {
            const jsonData = SensorSimulatorJsonManager.makeRequestAlarmList();

            const response = await fetch(ProjectResource.baseUrl + '/SDMS/SensorSimulator/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return [result.alarms, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestAlarmList 실패"];
    }

    static async requestMaterialAlarmDatas() {
        try {
            const jsonData = SensorSimulatorJsonManager.makeRequestMaterialAlarmDatas();

            const response = await fetch(ProjectResource.baseUrl + '/Industrial/Industrial/RequestData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: jsonData
            });

            if (response.ok) {
                const result = await response.json();

                if (result.success) {
                    return [result.materialLinks, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestMaterialAlarmDatas 실패"];
    }
}