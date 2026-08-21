export class EdmsJsonManager {
    static makeRequestFacilities() {
        const json = {
            "requestFacilities": true
        };

        return JSON.stringify(json);
    }
}
