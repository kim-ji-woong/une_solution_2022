export class DashboardJsonManager {
    static makeRequestCountries() {
        const json = {
            "requestCountries": true
        };

        return JSON.stringify(json);
    }

    static makeRequestDataCenters(userID) {
        const json = {
            "requestDataCenters": {
                "userID": userID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSiteWorkData(siteID) {
        const json = {
            "requestSiteWorkData": {
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestVdcStatistics(dataCenterID) {
        const json = {
            "requestVdcStatistics": {
                "dataCenterID": dataCenterID
            }
        };

        return JSON.stringify(json);
    }
}