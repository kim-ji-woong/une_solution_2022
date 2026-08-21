import { SdmsJsonManager } from './sdmsJsonManager';

export class SdmsController {
    static async requestFireSensors(rowCount) {
        try {
            const jsonData = SdmsJsonManager.makeRequestFireSensors(rowCount);

            const res = await fetch('SDMS/FireSensors', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.datas, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "requestFireSensors api 호출이 실패하였습니다."];
    }

    static async requestLinkedSop(fireSensorID) {
        try {
            const jsonData = SdmsJsonManager.makeRequestLinkedSop(fireSensorID);

            const res = await fetch('SDMS/LinkedSop', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.data, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        } catch (e) {
            console.log(e);
        }

        return [null, "requestLinkedSop api 호출이 실패하였습니다."];
    }
}