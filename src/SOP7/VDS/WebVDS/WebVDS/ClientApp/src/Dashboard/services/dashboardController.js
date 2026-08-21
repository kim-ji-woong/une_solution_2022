import ProjectResource from "../../Root/resource/id";
import { DashboardJsonManager } from "./dashboardJsonManager";

export default class DashboardController {
    static async requestCountries() {
        try {
            const jsonData = DashboardJsonManager.makeRequestCountries();

            const res = await fetch(ProjectResource.baseUrl + '/api/Dashboard/RequestData', {
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
                    return [result.nations, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestCountries 실패"];
    }

    static async requestDataCenters(userID) {
        try {
            const jsonData = DashboardJsonManager.makeRequestDataCenters(userID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Dashboard/RequestData', {
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
                    return [result.dataCenters, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestDataCenters 실패"];
    }

    static async requestSiteWorkData(siteID) {
        try {
            const jsonData = DashboardJsonManager.makeRequestSiteWorkData(siteID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Dashboard/RequestData', {
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
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestSiteWorkData 실패"];
    }

    static async requestVdcStatistics(dataCenterID) {
        try {
            const jsonData = DashboardJsonManager.makeRequestVdcStatistics(dataCenterID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Dashboard/RequestData', {
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
                    return [result, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestVdcStatistics 실패"];
    }
}
