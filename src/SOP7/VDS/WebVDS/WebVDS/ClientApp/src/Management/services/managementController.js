import ProjectResource from "../../Root/resource/id";
import { ManagementJsonManager } from "./managementJsonManager";

export default class ManagementController {
    static async requestSiteNDataCenters(userID) {
        try {
            const jsonData = ManagementJsonManager.makeRequestSiteNDataCenters(userID);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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

        return [null, "requestSiteNDataCenters 실패"];
    }

    static async requestAddDataCenter(siteID, nationID, centerName, centerType, latitude, longitude, width, depth, height, startX, startY, tileElevation, vdcTime, memo, isClone, parentCenterID, teamName, managerName, company, userID = -1) {
        try {
            const jsonData = ManagementJsonManager.makeRequestAddDataCenter(siteID, nationID, centerName, centerType, latitude, longitude, width, depth, height, startX, startY, tileElevation, vdcTime, memo, isClone, parentCenterID, teamName, managerName, company, userID);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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
                    return [result.dataCenter, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
        }

        return [null, "requestAddDataCenter 실패"];
    }

    static async requestGetDataCenters(userID, nationID, siteID, creationType, company) {
        try {
            const jsonData = ManagementJsonManager.makeRequestGetDataCenters(userID, nationID, siteID, creationType, company);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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

        return [null, "requestGetDataCenters 실패"];
    }

    static async requestSiteNNation(siteID, nationID) {
        try {
            const jsonData = ManagementJsonManager.makeRequestSiteNNation(siteID, nationID);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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

        return [null, "requestSiteNNation 실패"];
    }

    static async requestSaveDataCenterMemo(dataCenterID, memo) {
        try {
            const jsonData = ManagementJsonManager.makeRequestUpdateDataCenter(dataCenterID, memo);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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
                    return [result.success, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {

        }

        return [null, "requestSaveDataCenterMemo 실패"];
    }

    static async requestUpdateDataCenters(centerDatas) {
        try {
            const jsonData = ManagementJsonManager.makeRequestUpdateDataCenters(centerDatas);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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
                    return [result.success, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {

        }

        return [null, "requestUpdateDataCenters 실패"];
    }

    static async requestGetDataCenter(dataCenterID) {
        try {
            const jsonData = ManagementJsonManager.makeRequestGetDataCenter(dataCenterID);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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
                    return [result.dataCenter, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }

        catch (e) {

        }

        return [null, "requestGetDataCenter 실패"];
    }

    static async requestDeleteDataCenters(dataCenterIDs) {
        try {
            const jsonData = ManagementJsonManager.makeRequestDeleteDataCenters(dataCenterIDs);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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
                    return [true, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }

        catch (e) {

        }

        return [null, "requestDeleteDataCenters 실패"];
    }

    static async requestEditTypeData(updateRackTypes, updateItemTypes, updateFacilityTypes) {
        try {
            const jsonData = ManagementJsonManager.makeRequestEditTypeData(updateRackTypes, updateItemTypes, updateFacilityTypes);

            const res = await fetch(ProjectResource.baseUrl + 'api/Management/RequestData', {
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

        return [null, "requestEditTypeData 실패"];
    }

    static async requestSite(siteID) {
        try {
            const jsonData = ManagementJsonManager.makeRequestSite(siteID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Management/RequestData', {
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
                    return [result.site, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestSite 실패"];
    }

    static async requestSiteCompanies(siteID) {
        try {
            const jsonData = ManagementJsonManager.makeRequestSiteCompanies(siteID);

            const res = await fetch(ProjectResource.baseUrl + '/api/Management/RequestData', {
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
                    return [result.companies, ""];
                }
                else {
                    return [null, result.message];
                }
            }

        }
        catch (e) {
        }

        return [null, "requestSiteCompanies 실패"];
    }
}