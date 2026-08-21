import { _SdmsJsonManager } from './_sdmsJsonManager';

export class _SdmsController {
    static async requestPsmSensors(rowCount) {
        try {
            const jsonData = _SdmsJsonManager.makeRequestPsmSensors(rowCount);

            const res = await fetch('SDMSSoulbrain/PsmSensors', {
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

        return [null, "requestPsmSensors api 호출이 실패하였습니다."];
    }

    static async requestPsmLinkedSop(psmSensorID) {
        try {
            const jsonData = _SdmsJsonManager.makeRequestPsmLinkedSop(psmSensorID);

            const res = await fetch('SDMSSoulbrain/PsmLinkedSop', {
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