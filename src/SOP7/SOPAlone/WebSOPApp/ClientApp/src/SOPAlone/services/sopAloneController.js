export default class SopAloneController {    
    static async requestBuildingGroupList() {
        try {
            const res = await fetch('SOPAlone/SOPAlone/LoadSpatial', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.buildingGroupDatas, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }
    static async requestFacilityTypes() {
        try {
            const res = await fetch('SOPAlone/SOPAlone/LoadFacilityTypes', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.facilityTypes, null];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, ""];
    }
}
