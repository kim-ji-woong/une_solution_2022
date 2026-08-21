export class ManagementJsonManager {
    static makeRequestSiteNDataCenters(userID) {
        const json = {
            "requestSiteNDataCenters": {
                "userID": userID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestAddDataCenter(siteID, nationID, centerName, centerType, latitude, longitude, width, depth, height, startX, startY, tileElevation, vdcTime, memo, isClone, parentCenterID, teamName, managerName, company, userID) {
        const json = {
            "requestAddDataCenter": {
                "siteID": siteID,
                "nationID": nationID,
                "centerName": centerName,
                "centerType": centerType,
                "creationType": "파일업로드",
                "latitude": latitude,
                "longitude": longitude,
                "width": width,
                "depth": depth,
                "height": height,
                "startX": startX,
                "startY": startY,
                "tileElevation": tileElevation,
                "utc": vdcTime,
                "memo": memo,
                "isClone": isClone,
                "parentID": parentCenterID,
                "managerTeam": teamName,
                "manager": managerName,
                "company": company,
                "userID": userID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetDataCenters(userID, nationID, siteID, creationType, company) {
        const json = {
            "requestGetDataCenters": {
                "userID": userID,
                "nationID": nationID,
                "siteID": siteID,
                "creationType": creationType,
                "company": company
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSiteNNation(siteID, nationID) {
        const json = {
            "requestSiteNNation": {
                "nationID": nationID,
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateDataCenter(dataCenterID, memo) {
        const json = {
            "requestUpdateDataCenter": {
                "dataCenterID": dataCenterID,
                "memo": memo
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestUpdateDataCenters(centerDatas) {
        const json = {
            "requestUpdateDataCenters": {
                "updateDatas": centerDatas
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestGetDataCenter(dataCenterID) {
        const json = {
            "requestGetDataCenter": {
                "dataCenterID": dataCenterID
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestDeleteDataCenters(dataCenterIDs) {
        const json = {
            "requestDeleteDataCenters": {
                "dataCenterIDs": dataCenterIDs
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestEditTypeData(updateRackTypes, updateItemTypes, updateFacilityTypes) {
        const json = {
            "editTypeData": {
                "updateRackTypes": ManagementJsonManager.getRackTypeArray(updateRackTypes),
                "updateItemTypes": ManagementJsonManager.getItemTypeArray(updateItemTypes),
                "updateFacilityTypes": ManagementJsonManager.getFacilityTypeArray(updateFacilityTypes)
            }
        };

        return JSON.stringify(json);
    }

    static makeRequestSite(siteID) {
        const json = {
            "requestSite": siteID
        };

        return JSON.stringify(json);
    }

    static makeRequestSiteCompanies(siteID) {
        const json = {
            "requestSiteCompanies": {
                "siteID": siteID
            }
        };

        return JSON.stringify(json);
    }

    static getRackTypeArray(rackTypes) {
        const rackTypeList = [];

        for (const id in rackTypes) {
            const rackType = rackTypes[id];
            rackTypeList.push(rackType);
        }

        return rackTypeList;
    }

    static getItemTypeArray(itemTypes) {
        const itemTypeList = [];

        for (const id in itemTypes) {
            const itemType = itemTypes[id];
            itemTypeList.push(itemType);
        }

        return itemTypeList;
    }

    static getFacilityTypeArray(facilityTypes) {
        const facilityTypeList = [];

        for (const id in facilityTypes) {
            const facilityType = facilityTypes[id];
            facilityTypeList.push(facilityType);
        }

        return facilityTypeList;
    }
}