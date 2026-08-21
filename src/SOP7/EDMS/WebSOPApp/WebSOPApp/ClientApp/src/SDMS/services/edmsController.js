import { EdmsJsonManager } from "./edmsJsonManager";

export class EDMSController {
    static async requestFacilities() {

        try {
            const jsonData = EdmsJsonManager.makeRequestFacilities();

            const res = await fetch('EDMS/EDMS/RequestData', {
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
                    return [result.facilities, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
            //console.log(e);
        }

        return [null, "requestFacilities 실패"];
    }
}
