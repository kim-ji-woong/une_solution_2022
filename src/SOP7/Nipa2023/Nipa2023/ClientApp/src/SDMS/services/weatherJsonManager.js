export class WeatherJsonManager {
    static makeRequestCurrentData(siteID) {
        const json = {
            "siteIDs": [siteID]
        }

        return JSON.stringify(json);
    }

    static makeRequestWeeklyInfo() {
        const json = {
        }

        return JSON.stringify(json);
    }
}